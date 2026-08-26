from importlib import resources
from pathlib import Path

import json

from skillhub import app


def test_parse_frontmatter():
    fm, body = app.parse_frontmatter("---\nname: demo\ndescription: Demo skill\n---\n# Demo")
    assert fm["name"] == "demo"
    assert fm["description"] == "Demo skill"
    assert body == "# Demo"

    fm, _ = app.parse_frontmatter("---\n- not\n- a mapping\n---\n# Demo")
    assert fm == {}


def test_safe_segment_and_join(tmp_path):
    assert app.safe_segment("demo-skill")
    assert not app.safe_segment("../secret")
    assert not app.safe_segment("a/b")
    assert not app.safe_segment("a\\b")
    assert not app.safe_segment(".")
    assert not app.safe_segment("bad\nname")
    assert not app.safe_segment('bad:name')
    assert app.safe_join(str(tmp_path), "category", "skill").startswith(str(tmp_path))
    assert app.safe_join(str(tmp_path), "..", "outside") is None


def test_scan_categorized_skill(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    root = tmp_path / "skills"
    skill = root / "automation" / "demo"
    skill.mkdir(parents=True)
    (skill / "SKILL.md").write_text(
        "---\nname: demo\ndescription: Demo skill\nversion: 1.0.0\n---\n# Demo",
        encoding="utf-8",
    )
    monkeypatch.setattr(app, "FLAT_LABELS", set())
    rows = app.scan_skills(str(root), "hermes/main")
    assert len(rows) == 1
    assert rows[0]["category"] == "automation"
    assert rows[0]["readonly"] is False
    assert Path(rows[0]["path"]) == skill


def test_dynamic_skill_values_are_not_embedded_in_inline_handlers():
    javascript = resources.files("skillhub").joinpath("static/app.js").read_text(encoding="utf-8")
    assert 'onclick="event.stopPropagation(); toggleSelect' not in javascript
    assert 'onclick="event.stopPropagation(); toggleSkillDisabled' not in javascript
    assert "onclick=\"openFileEditor('" not in javascript


def _make_scanner(tmp_path, monkeypatch):
    from skillhub.security import SecurityScanner

    home = tmp_path / "home"
    home.mkdir(exist_ok=True)
    (home / "skillhub.local.json").write_text("{}", encoding="utf-8")
    monkeypatch.delenv("AGENT_SKILL_SCANNER_HOME", raising=False)
    return SecurityScanner(home)


def _make_fake_engine(tmp_path):
    engine = tmp_path / "engine"
    (engine / "src").mkdir(parents=True)
    (engine / "rules").mkdir()
    (engine / "src" / "scanner.py").write_text(
        "\n".join(
            [
                "ALLOWED_SUFFIXES = ('.md',)",
                "SKIP_DIRS = {'.git'}",
                "MAX_FILE_BYTES = 1000",
                "MAX_TOTAL_BYTES = 2000",
                "MAX_FILES = 10",
                "RULES = [{'id': 'demo'}]",
                "def scanner_metadata():",
                "    return {'ruleCount': 1, 'categories': [{'id': 'demo', 'label': 'Demo'}]}",
                "def scan_text(name, text):",
                "    risky = 'curl http://evil' in text",
                "    return {'schemaVersion': '1.0', 'risk': 'HIGH' if risky else 'LOW', 'score': 40 if risky else 0,",
                "            'file': name, 'findings': ([{'id': 'NET', 'category': 'network_access', 'severity': 'high',",
                "            'title': 'net', 'why': 'w', 'remediation': 'r', 'evidence': [{'line': 1, 'excerpt': text.strip()}]}] if risky else []),",
                "            'scannedAt': '2026-08-26T00:00:00Z'}",
                "def scan_files(files):",
                "    merged = [scan_text(f['name'], f['content']) for f in files]",
                "    findings = [x for m in merged for x in m['findings']]",
                "    return {'schemaVersion': '1.0', 'risk': 'HIGH' if findings else 'LOW', 'score': 40 if findings else 0,",
                "            'fileCount': len(files), 'findingCount': len(findings), 'reports': merged,",
                "            'scannedAt': '2026-08-26T00:00:00Z'}",
            ]
        ),
        encoding="utf-8",
    )
    (engine / "rules" / "scanner-rules.json").write_text("[]", encoding="utf-8")
    (engine / "package.json").write_text('{"version": "9.9.9"}', encoding="utf-8")
    return engine


def _make_skill(tmp_path):
    skill = tmp_path / "skills" / "automation" / "demo"
    skill.mkdir(parents=True)
    (skill / "SKILL.md").write_text("---\nname: demo\ndescription: d\n---\ncurl http://evil", encoding="utf-8")
    (skill / "references").mkdir()
    (skill / "references" / "extra.md").write_text("# extra", encoding="utf-8")
    return {
        "source": "hermes/main",
        "category": "automation",
        "name": "demo",
        "path": str(skill),
    }


def test_security_status_unavailable_without_config(tmp_path, monkeypatch):
    scanner = _make_scanner(tmp_path, monkeypatch)
    status = scanner.status()
    assert status["available"] is False
    assert status["repo_url"].endswith("agent-skill-scanner")


def test_security_scan_quick_deep_and_cache(tmp_path, monkeypatch):
    engine = _make_fake_engine(tmp_path)
    scanner = _make_scanner(tmp_path, monkeypatch)
    (tmp_path / "home" / "skillhub.local.json").write_text(
        json.dumps({"scanner_home": str(engine)}), encoding="utf-8"
    )

    status = scanner.status()
    assert status["available"] is True
    assert status["version"] == "9.9.9"
    assert status["config_source"] == "local_config"
    assert status["rule_count"] == 1

    skill = _make_skill(tmp_path)
    quick = scanner.scan(skill, deep=False, force=True)
    assert quick["mode"] == "quick" and quick["risk"] == "HIGH"
    assert quick["fileCount"] == 1 and quick["findingCount"] == 1

    again = scanner.scan(skill, deep=False)
    assert again is quick  # served from cache without re-scan

    deep = scanner.scan(skill, deep=True, force=True)
    assert deep["mode"] == "deep" and deep["fileCount"] == 2 and deep["findingCount"] == 1

    summaries = scanner.summaries()
    assert len(summaries) == 1 and summaries[0]["mode"] == "deep"

    # editing the file invalidates only that skill's cache entries
    scanner.invalidate(skill["path"])
    fresh = scanner.scan(skill, deep=False)
    assert fresh is not quick
