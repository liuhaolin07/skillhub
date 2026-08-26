"""Optional adapter for liuhaolin07/agent-skill-scanner.

SkillHub dynamically loads the scanner's Python engine and keeps its rules in the
scanner repository. No rules or scanner dependency are bundled here.
"""

from __future__ import annotations

import importlib.util
import json
import os
import sys
import threading
from datetime import datetime, timezone
from pathlib import Path

REPO_URL = "https://github.com/liuhaolin07/agent-skill-scanner"


class SecurityScanner:
    """Thread-safe, hot-reloadable scanner adapter with per-skill memory cache."""

    def __init__(self, hermes_home: Path):
        self.hermes_home = Path(hermes_home)
        self.config_path = self.hermes_home / "skillhub.local.json"
        self._lock = threading.RLock()
        self._module = None
        self._signature = None
        self._home = None
        self._source = None
        self._version = None
        self._error = None
        self._cache = {}  # (source|category|name, quick|deep) -> entry

    def _settings(self):
        try:
            data = json.loads(self.config_path.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (OSError, ValueError, TypeError):
            return {}

    def resolve_home(self):
        env_home = os.environ.get("AGENT_SKILL_SCANNER_HOME", "").strip()
        if env_home:
            path = Path(env_home).expanduser()
            return (path.resolve(), "environment") if path.is_dir() else (None, "environment")
        configured = str(self._settings().get("scanner_home", "")).strip()
        if configured:
            path = Path(configured).expanduser()
            return (path.resolve(), "local_config") if path.is_dir() else (None, "local_config")
        for path in (
            Path.cwd().parent / "agent-skill-scanner",
            Path.home() / "agent-skill-scanner",
            Path.home() / "Agent skill scanner",
        ):
            if path.is_dir():
                return path.resolve(), "auto_discovery"
        return None, None

    @staticmethod
    def _engine_signature(home: Path):
        paths = (home / "src" / "scanner.py", home / "rules" / "scanner-rules.json", home / "package.json")
        return tuple((str(p), p.stat().st_mtime_ns, p.stat().st_size) for p in paths if p.is_file())

    def _load(self):
        home, source = self.resolve_home()
        if not home:
            raise RuntimeError("agent-skill-scanner 未配置；请设置 AGENT_SKILL_SCANNER_HOME 或 skillhub.local.json")
        scanner_py = home / "src" / "scanner.py"
        rules_json = home / "rules" / "scanner-rules.json"
        if not scanner_py.is_file() or not rules_json.is_file():
            raise RuntimeError("scanner 目录缺少 src/scanner.py 或 rules/scanner-rules.json")
        signature = self._engine_signature(home)
        with self._lock:
            if self._module is not None and self._signature == signature:
                return self._module
            try:
                module_name = "_skillhub_agent_skill_scanner"
                spec = importlib.util.spec_from_file_location(module_name, scanner_py)
                if not spec or not spec.loader:
                    raise RuntimeError("无法创建 scanner Python 模块")
                module = importlib.util.module_from_spec(spec)
                sys.modules[module_name] = module
                spec.loader.exec_module(module)
                if not hasattr(module, "scan_text") or not hasattr(module, "scan_files"):
                    raise RuntimeError("scanner Python API 不兼容：缺少 scan_text/scan_files")
                version = None
                package_json = home / "package.json"
                if package_json.is_file():
                    try:
                        version = json.loads(package_json.read_text(encoding="utf-8")).get("version")
                    except (OSError, ValueError, TypeError):
                        pass
                if self._signature not in (None, signature):
                    self._cache.clear()
                self._module, self._signature = module, signature
                self._home, self._source, self._version = str(home), source, version
                self._error = None
                return module
            except Exception as exc:
                self._module, self._signature = None, signature
                self._home, self._source, self._version = str(home), source, None
                self._error = str(exc)
                raise

    def invalidate(self, skill_path=None):
        with self._lock:
            if skill_path is None:
                self._cache.clear()
                return
            wanted = os.path.normcase(os.path.normpath(str(skill_path)))
            for slot, entry in list(self._cache.items()):
                cached = os.path.normcase(os.path.normpath(str(entry.get("path", ""))))
                if cached == wanted:
                    self._cache.pop(slot, None)

    @staticmethod
    def _key(skill):
        return f"{skill['source']}|{skill['category']}|{skill['name']}"

    def summaries(self):
        chosen = {}
        with self._lock:
            for (key, mode), entry in self._cache.items():
                if key not in chosen or mode == "deep":
                    report = entry["report"]
                    chosen[key] = {
                        "key": key,
                        "risk": report.get("risk", "LOW"),
                        "score": report.get("score", 0),
                        "file_count": report.get("fileCount", 0),
                        "finding_count": report.get("findingCount", 0),
                        "mode": mode,
                        "scanned_at": report.get("scannedAt"),
                        "warnings": len(report.get("warnings", [])),
                    }
        return sorted(chosen.values(), key=lambda row: row["key"])

    def status(self):
        try:
            module = self._load()
            metadata = module.scanner_metadata() if hasattr(module, "scanner_metadata") else {}
            return {
                "available": True,
                "engine": "python",
                "version": self._version,
                "rule_count": metadata.get("ruleCount", len(getattr(module, "RULES", []))),
                "categories": metadata.get("categories", []),
                "config_source": self._source,
                "repo_url": REPO_URL,
                "reports": self.summaries(),
            }
        except Exception as exc:
            return {
                "available": False,
                "engine": "python",
                "version": None,
                "rule_count": 0,
                "categories": [],
                "config_source": self._source,
                "repo_url": REPO_URL,
                "reports": self.summaries(),
                "error": str(exc),
            }

    @staticmethod
    def _collect(module, skill_path: Path):
        suffixes = tuple(getattr(module, "ALLOWED_SUFFIXES", (".md", ".json", ".yaml", ".yml")))
        skip_dirs = set(getattr(module, "SKIP_DIRS", {".git", "node_modules", ".venv", "__pycache__"}))
        max_file = int(getattr(module, "MAX_FILE_BYTES", 2_000_000))
        max_total = int(getattr(module, "MAX_TOTAL_BYTES", 50_000_000))
        max_files = int(getattr(module, "MAX_FILES", 1_000))
        files, warnings, total = [], [], 0
        try:
            candidates = sorted(skill_path.rglob("*"), key=str)
        except OSError as exc:
            raise RuntimeError(f"无法遍历 Skill 目录: {exc}") from exc
        for path in candidates:
            try:
                if not path.is_file() or path.suffix.lower() not in suffixes:
                    continue
                rel = path.relative_to(skill_path)
                if any(part in skip_dirs for part in rel.parts[:-1]):
                    continue
                stat = path.stat()
                if stat.st_size > max_file:
                    warnings.append(f"{rel.as_posix()}: 文件过大，已跳过")
                    continue
                if len(files) >= max_files or total + stat.st_size > max_total:
                    warnings.append("已达到 scanner 单次扫描上限，其余文件已跳过")
                    break
                files.append({
                    "name": rel.as_posix(),
                    "content": path.read_text(encoding="utf-8", errors="replace"),
                    "_mtime": stat.st_mtime_ns,
                    "_size": stat.st_size,
                })
                total += stat.st_size
            except (OSError, ValueError) as exc:
                warnings.append(f"{path.name}: 无法读取，已跳过 ({exc})")
        if not files:
            raise RuntimeError("Skill 中没有可扫描的 Markdown/JSON/YAML 文件")
        signature = tuple((f["name"], f["_mtime"], f["_size"]) for f in files)
        payload = [{"name": f["name"], "content": f["content"]} for f in files]
        return payload, warnings, signature

    def scan(self, skill, deep=False, force=False):
        module = self._load()
        skill_path = Path(os.path.normpath(str(skill["path"])))
        key, mode = self._key(skill), ("deep" if deep else "quick")
        if deep:
            files, warnings, file_signature = self._collect(module, skill_path)
        else:
            skill_md = skill_path / "SKILL.md"
            try:
                stat = skill_md.stat()
                files = [{"name": "SKILL.md", "content": skill_md.read_text(encoding="utf-8", errors="replace")}]
            except OSError as exc:
                raise RuntimeError(f"无法读取 SKILL.md: {exc}") from exc
            warnings, file_signature = [], (("SKILL.md", stat.st_mtime_ns, stat.st_size),)
        signature, slot = (self._signature, file_signature), (key, mode)
        with self._lock:
            cached = self._cache.get(slot)
            if cached and cached["signature"] == signature and not force:
                return cached["report"]
        if deep:
            report = module.scan_files(files)
        else:
            single = module.scan_text("SKILL.md", files[0]["content"])
            report = {
                "schemaVersion": single.get("schemaVersion", "1.0"),
                "risk": single["risk"],
                "score": single["score"],
                "fileCount": 1,
                "findingCount": len(single.get("findings", [])),
                "reports": [single],
            }
        report.update({
            "key": key,
            "skill": {k: skill[k] for k in ("name", "source", "category")},
            "mode": mode,
            "warnings": warnings,
            "scannedAt": report.get("reports", [{}])[0].get("scannedAt") or datetime.now(timezone.utc).isoformat(),
            "scanner": {"name": "agent-skill-scanner", "version": self._version, "repo_url": REPO_URL},
        })
        with self._lock:
            self._cache[slot] = {"signature": signature, "report": report, "path": str(skill_path)}
        return report
