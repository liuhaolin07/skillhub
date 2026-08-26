import json
import threading
import urllib.error
import urllib.parse
import urllib.request
from http.server import ThreadingHTTPServer

import pytest

from skillhub import app


def request(base, path, method="GET", data=None):
    body = None if data is None else json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        base + path,
        data=body,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            raw = response.read()
            content_type = response.headers.get("Content-Type", "")
            payload = json.loads(raw) if "json" in content_type else raw.decode("utf-8")
            return response.status, response.headers, payload
    except urllib.error.HTTPError as error:
        return error.code, error.headers, json.loads(error.read())


@pytest.fixture()
def skillhub_server(tmp_path, monkeypatch):
    home = tmp_path / "hermes-home"
    root = home / "skills"
    skill = root / "automation" / "demo"
    (skill / "references").mkdir(parents=True)
    (skill / "SKILL.md").write_text(
        "---\nname: demo\ndescription: Demo skill\nversion: 1.0.0\n---\n# Demo",
        encoding="utf-8",
    )
    (skill / "references" / "guide.md").write_text("# Guide", encoding="utf-8")

    source = {"label": "main", "root": str(root), "flat": False, "agent": "hermes"}
    monkeypatch.setenv("HERMES_HOME", str(home))
    monkeypatch.setattr(app, "SOURCES", {"hermes/main": source})
    monkeypatch.setattr(app, "FLAT_LABELS", set())
    monkeypatch.setattr(
        app,
        "AGENTS",
        {"hermes": {"name": "Hermes", "icon": "purple", "instances": [source]}},
    )
    app.invalidate_cache()
    app._CONFIG_CACHE.update({"data": None, "ts": 0.0})

    server = ThreadingHTTPServer(("127.0.0.1", 0), app.SkillHubHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()
    server.server_close()
    thread.join(timeout=5)
    app.invalidate_cache()


def test_frontend_static_and_security_headers(skillhub_server):
    status, headers, html = request(skillhub_server, "/")
    assert status == 200
    assert "/static/app.css" in html
    assert headers["X-Frame-Options"] == "DENY"
    assert "Content-Security-Policy" in headers

    status, _, js = request(skillhub_server, "/static/app.js")
    assert status == 200
    assert "function renderGrid" in js

    status, _, _ = request(skillhub_server, "/missing")
    assert status == 404

    rebound = urllib.request.Request(skillhub_server + "/api/health", headers={"Host": "evil.example"})
    with pytest.raises(urllib.error.HTTPError) as error:
        urllib.request.urlopen(rebound, timeout=5)
    assert error.value.code == 421


def test_overview_and_file_access(skillhub_server):
    status, _, overview = request(skillhub_server, "/api/overview")
    assert status == 200
    assert overview["summary"]["skills"] == 1
    assert overview["summary"]["instances"] == 1
    assert overview["agents"][0]["capability"] == "manage"

    query = urllib.parse.urlencode(
        {
            "source": "hermes/main",
            "category": "automation",
            "skill_name": "demo",
            "subdir": "references",
            "filename": "guide.md",
        }
    )
    status, _, payload = request(skillhub_server, f"/api/file?{query}")
    assert status == 200
    assert payload["content"] == "# Guide"


def test_traversal_and_state_change_method(skillhub_server):
    traversal = urllib.parse.urlencode(
        {
            "source": "hermes/main",
            "category": "automation",
            "skill_name": "demo",
            "subdir": "references",
            "filename": "../../SKILL.md",
        }
    )
    status, _, _ = request(skillhub_server, f"/api/file?{traversal}")
    assert status == 400

    status, _, _ = request(skillhub_server, "/api/disabled/toggle?name=demo&disabled=true")
    assert status == 405

    status, _, payload = request(
        skillhub_server,
        "/api/disabled/toggle",
        method="PUT",
        data={"name": "demo", "disabled": True},
    )
    assert status == 200
    assert "demo" in payload["disabled"]


def test_invalid_and_oversized_json_are_rejected(skillhub_server, monkeypatch):
    invalid = urllib.request.Request(
        skillhub_server + "/api/rescan",
        data=b"{",
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    with pytest.raises(urllib.error.HTTPError) as error:
        urllib.request.urlopen(invalid, timeout=5)
    assert error.value.code == 400

    monkeypatch.setattr(app, "MAX_BODY_SIZE", 2)
    status, _, _ = request(skillhub_server, "/api/rescan", method="POST", data={"large": True})
    assert status == 413


def test_security_status_endpoint(skillhub_server):
    status, _, payload = request(skillhub_server, "/api/security/status")
    assert status == 200
    assert payload["available"] is False  # scanner home not configured in this fixture
    assert payload["reports"] == []
    assert payload["repo_url"].endswith("agent-skill-scanner")


def test_security_scan_endpoint_validation_and_errors(skillhub_server, monkeypatch):
    # invalid identity params
    status, _, payload = request(
        skillhub_server,
        "/api/security/scan",
        method="POST",
        data={"source": "", "category": "", "name": "", "deep": False, "force": False},
    )
    assert status == 400

    status, _, _ = request(
        skillhub_server,
        "/api/security/scan",
        method="POST",
        data={"source": "hermes/main", "category": "../x", "name": "demo", "deep": False, "force": False},
    )
    assert status == 400

    # unknown skill -> 404
    status, _, _ = request(
        skillhub_server,
        "/api/security/scan",
        method="POST",
        data={"source": "hermes/main", "category": "automation", "name": "ghost", "deep": False, "force": False},
    )
    assert status == 404

    # engine unavailable -> 503 with error message (scanner not configured in fixture)
    status, _, payload = request(
        skillhub_server,
        "/api/security/scan",
        method="POST",
        data={"source": "hermes/main", "category": "automation", "name": "demo", "deep": False, "force": True},
    )
    assert status == 503
    assert "error" in payload
