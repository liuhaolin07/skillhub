#!/usr/bin/env python3
"""
SkillHub — 通用 Agent Skill 管理工具
可视化管理各 agent 的 skill（CRUD、跨 profile 对比、格式校验）

用法: skillhub [--port 8080] [--host 127.0.0.1]
"""

import os
import json
import re
import shutil
import argparse
import mimetypes
import socket
import threading
import time
import urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path

from .security import SecurityScanner

# ─── 配置 ───────────────────────────────────────────────

HOME = os.path.expanduser('~')
MAX_BODY_SIZE = 8 * 1024 * 1024


def get_hermes_home():
    """Resolve the Hermes data directory without hard-coding one machine."""
    override = os.environ.get('HERMES_HOME')
    if override:
        return Path(override).expanduser().resolve()
    default = Path.home() / '.hermes'
    legacy_windows = Path('D:/Hermes')
    if os.name == 'nt' and legacy_windows.is_dir():
        return legacy_windows.resolve()
    return default.resolve()


HERMES_HOME = get_hermes_home()
STATIC_DIR = Path(__file__).resolve().parent / 'static'
_SECURITY_SCANNER = None
_SECURITY_SCANNER_LOCK = threading.Lock()


def get_security_scanner():
    # Re-resolve against the current HERMES_HOME so tests and env changes follow.
    global _SECURITY_SCANNER
    hermes_home = get_hermes_home()
    with _SECURITY_SCANNER_LOCK:
        if _SECURITY_SCANNER is None or _SECURITY_SCANNER.hermes_home != hermes_home:
            _SECURITY_SCANNER = SecurityScanner(hermes_home)
        return _SECURITY_SCANNER

# Agent 注册表：agent → 实例列表（每个实例是一个 skill source）
# instance: {label, root, flat}  flat=True 表示无分类层（skills/<name>/SKILL.md）
AGENTS = {
    'hermes': {
        'name': 'Hermes',
        'icon': '🟣',
        'instances': [],   # 动态填充
    },
    'codex': {
        'name': 'Codex',
        'icon': '🔵',
        'instances': [
            {'label': 'user', 'root': os.path.join(HOME, '.agents', 'skills'), 'flat': True},
            {'label': 'legacy', 'root': os.path.join(HOME, '.codex', 'skills'), 'flat': True},
        ],
    },
    'claude-code': {
        'name': 'Claude Code',
        'icon': '🟠',
        'instances': [
            {'label': 'plugins', 'root': os.path.join(HOME, '.claude', 'plugins', 'cache'), 'flat': False, 'plugin_layout': True},
            {'label': 'skills', 'root': os.path.join(HOME, '.claude', 'skills'), 'flat': True},
        ],
    },
    'zcode': {
        'name': 'ZCode',
        'icon': '🟢',
        'instances': [
            {'label': 'plugins', 'root': os.path.join(HOME, '.zcode', 'cli', 'plugins', 'cache'), 'flat': False, 'plugin_layout': True},
        ],
    },
}

PROFILES_DIR = str(HERMES_HOME / 'profiles')

def discover_sources():
    """构建 SOURCES: label -> {root, agent, instance, flat, plugin_layout}"""
    sources = {}
    # Hermes 实例：default + bundled + profiles
    hermes_instances = [
        {'label': 'main', 'root': str(HERMES_HOME / 'skills'), 'flat': False},
        {'label': 'bundled', 'root': str(HERMES_HOME / 'hermes-agent' / 'skills'), 'flat': False},
    ]
    if os.path.isdir(PROFILES_DIR):
        for pn in sorted(os.listdir(PROFILES_DIR)):
            psd = os.path.join(PROFILES_DIR, pn, 'skills')
            if os.path.isdir(psd):
                hermes_instances.append({'label': f'profile:{pn}', 'root': psd, 'flat': False})
    # 只保留实际存在的实例
    hermes_instances = [i for i in hermes_instances if os.path.isdir(i['root'])]
    AGENTS['hermes']['instances'] = hermes_instances
    for inst in hermes_instances:
        sources[f'hermes/{inst["label"]}'] = {**inst, 'agent': 'hermes'}

    # 其他 agents
    for agent_key, agent in AGENTS.items():
        if agent_key == 'hermes':
            continue
        agent['instances'] = [i for i in agent['instances'] if os.path.isdir(i['root'])]
        for inst in agent['instances']:
            sources[f'{agent_key}/{inst["label"]}'] = {**inst, 'agent': agent_key}

    return sources

SOURCES = discover_sources()
FLAT_LABELS = {lbl for lbl, v in SOURCES.items() if v.get('flat')}

def get_agents_tree():
    """返回 agent→实例 树（供前端侧边栏）"""
    tree = []
    for key, agent in AGENTS.items():
        instances = []
        for inst in agent['instances']:
            label = f'{key}/{inst["label"]}'
            count = len(get_all_skills_cached(label, inst['root']))
            instances.append({
                'label': label,
                'instance': inst['label'],
                'count': count,
                'flat': inst.get('flat', False),
                'layout': 'plugin' if inst.get('plugin_layout') else ('flat' if inst.get('flat') else 'categorized'),
                'writable': key == 'hermes',
            })
        if instances:
            total = sum(i['count'] for i in instances)
            tree.append({'key': key, 'name': agent['name'], 'icon': agent['icon'],
                         'total': total, 'writable': key == 'hermes',
                         'instances': instances})
    return tree


def get_platform_overview():
    """聚合平台架构、权限与库存指标，作为前端控制台的单一元数据入口。"""
    all_skills = get_all_skills()
    agents = get_agents_tree()
    categories = sorted(set(s['category'] for s in all_skills))
    disabled_names = sorted(set(s['name'] for s in all_skills if s.get('disabled')))

    source_rows = []
    for label, info in SOURCES.items():
        source_skills = [s for s in all_skills if s['source'] == label]
        source_rows.append({
            'label': label,
            'agent': info['agent'],
            'instance': info['label'],
            'count': len(source_skills),
            'writable': info['agent'] == 'hermes',
            'layout': 'plugin' if info.get('plugin_layout') else ('flat' if info.get('flat') else 'categorized'),
            'categories': len(set(s['category'] for s in source_skills)),
        })

    for agent in agents:
        agent_skills = [s for s in all_skills if s['source'].startswith(agent['key'] + '/')]
        agent['enabled'] = sum(1 for s in agent_skills if not s.get('disabled'))
        agent['disabled'] = sum(1 for s in agent_skills if s.get('disabled'))
        agent['categories'] = len(set(s['category'] for s in agent_skills))
        agent['capability'] = 'manage' if agent['writable'] else 'observe'

    return {
        'summary': {
            'skills': len(all_skills),
            'agents': len(agents),
            'instances': len(SOURCES),
            'categories': len(categories),
            'enabled': sum(1 for s in all_skills if not s.get('disabled')),
            'disabled_records': sum(1 for s in all_skills if s.get('disabled')),
            'disabled_names': len(disabled_names),
            'writable': sum(1 for s in all_skills if not s.get('readonly')),
            'readonly': sum(1 for s in all_skills if s.get('readonly')),
        },
        'agents': agents,
        'sources': source_rows,
        'categories': categories,
    }

# ─── config.yaml 管理 ───────────────────────────────────
def get_config_path():
    """获取 config.yaml 路径"""
    return str(get_hermes_home() / 'config.yaml')

_CONFIG_CACHE = {'data': None, 'ts': 0.0}

def load_config():
    """加载 config.yaml（TTL 缓存：1 秒内复用，避免扫描时每技能重复解析）"""
    import yaml
    now = time.time()
    if _CONFIG_CACHE['data'] is not None and now - _CONFIG_CACHE['ts'] < 1.0:
        return _CONFIG_CACHE['data']
    path = get_config_path()
    if not os.path.isfile(path):
        cfg = {}
    else:
        with open(path, 'r', encoding='utf-8') as f:
            cfg = yaml.safe_load(f) or {}
    _CONFIG_CACHE['data'] = cfg
    _CONFIG_CACHE['ts'] = now
    return cfg

def save_config(cfg):
    """保存 config.yaml"""
    import yaml
    path = get_config_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        yaml.safe_dump(cfg, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    _CONFIG_CACHE['data'] = cfg   # 写后同步缓存，立即生效且免重读
    _CONFIG_CACHE['ts'] = time.time()

def get_disabled_skills():
    """获取全局禁用的 skill 名称列表"""
    cfg = load_config()
    skills_cfg = cfg.get('skills', {})
    disabled = skills_cfg.get('disabled', [])
    if isinstance(disabled, str):
        disabled = [disabled]
    return [str(d).strip() for d in disabled if str(d).strip()]

def set_disabled_skills(names):
    """设置全局禁用的 skill 名称列表"""
    with CONFIG_LOCK:
        cfg = load_config()
        if 'skills' not in cfg:
            cfg['skills'] = {}
        cfg['skills']['disabled'] = list(names)
        save_config(cfg)

# ─── 扫描缓存（mtime 失效）─────────────────────────────
SCAN_CACHE = {}          # source_label -> {'mtime': float, 'skills': [...]}
MTIME_CHECK_CACHE = {}   # source_label -> {'mtime': float, 'ts': float}（短 TTL 免重复遍历目录树）
MTIME_TTL = 2.0
CACHE_LOCK = threading.Lock()
CONFIG_LOCK = threading.Lock()

# 扫描状态（供 /api/status 与前端骨架屏使用）
SCAN_STATUS = {
    'ready': False,          # 全部 source 至少扫完一遍
    'warming': False,        # 预热进行中
    'done_sources': [],      # 已完成的 source
    'total_sources': 0,
    'started_at': None,
    'finished_at': None,
}
STATUS_LOCK = threading.Lock()

def _status_update(**kw):
    with STATUS_LOCK:
        SCAN_STATUS.update(kw)

def warm_cache():
    """后台预热线程：依次扫描所有 source，让首屏请求直接命中缓存"""
    _status_update(warming=True, ready=False, started_at=time.time(),
                   finished_at=None, total_sources=len(SOURCES), done_sources=[])
    for label, info in SOURCES.items():
        try:
            get_all_skills_cached(label, info['root'])
        except Exception as e:
            print(f'[warm] {label} failed: {e}')
        done = []
        with STATUS_LOCK:
            SCAN_STATUS['done_sources'].append(label)
            done = list(SCAN_STATUS['done_sources'])
        _status_update(done_sources=done)
    _status_update(warming=False, ready=True, finished_at=time.time())

def _dir_mtime(path):
    """目录树的最大 mtime（浅层：根 + 一级子目录），用于缓存失效判断"""
    latest = 0.0
    try:
        latest = os.path.getmtime(path)
        for entry in os.listdir(path):
            ep = os.path.join(path, entry)
            try:
                m = os.path.getmtime(ep)
                if m > latest:
                    latest = m
                if os.path.isdir(ep):
                    for sub in os.listdir(ep):
                        try:
                            m = os.path.getmtime(os.path.join(ep, sub))
                            if m > latest:
                                latest = m
                        except OSError:
                            pass
            except OSError:
                pass
    except OSError:
        pass
    return latest

def get_all_skills_cached(source_label, root):
    """带缓存的 skill 扫描；目录 mtime 未变时直接返回缓存（mtime 校验本身带 2s TTL）"""
    with CACHE_LOCK:
        cached = SCAN_CACHE.get(source_label)
        mc = MTIME_CHECK_CACHE.get(source_label)
        now = time.time()
        if cached and mc and now - mc['ts'] < MTIME_TTL:
            return cached['skills']   # TTL 内：跳过目录树遍历
    current_mtime = _dir_mtime(root)
    with CACHE_LOCK:
        MTIME_CHECK_CACHE[source_label] = {'mtime': current_mtime, 'ts': time.time()}
        if cached and cached['mtime'] == current_mtime:
            return cached['skills']
    plugin_layout = SOURCES.get(source_label, {}).get('plugin_layout', False)
    skills = scan_skills(root, source_label, plugin_layout=plugin_layout)
    with CACHE_LOCK:
        SCAN_CACHE[source_label] = {'mtime': current_mtime, 'skills': skills}
    return skills

def invalidate_cache(source_label=None):
    """写操作后失效缓存"""
    with CACHE_LOCK:
        if source_label is None:
            SCAN_CACHE.clear()
            MTIME_CHECK_CACHE.clear()
        else:
            SCAN_CACHE.pop(source_label, None)
            MTIME_CHECK_CACHE.pop(source_label, None)

def refresh_disabled_in_cache():
    """启停切换后就地更新缓存中的 disabled 标记（免全量重扫，O(n) 内存操作）"""
    ds = set(get_disabled_skills())
    with CACHE_LOCK:
        for entry in SCAN_CACHE.values():
            for s in entry['skills']:
                s['disabled'] = s['name'] in ds or s.get('dir_name') in ds

# ─── 工具函数 ───────────────────────────────────────────

def parse_frontmatter(content):
    """解析 SKILL.md 的 YAML frontmatter"""
    fm = {}
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 2:
            try:
                import yaml
                fm = yaml.safe_load(parts[1]) or {}
                if not isinstance(fm, dict):
                    fm = {}
            except Exception:
                # 手动解析简单 YAML
                for line in parts[1].strip().split('\n'):
                    if ':' in line:
                        k, v = line.split(':', 1)
                        fm[k.strip()] = v.strip().strip('"').strip("'")
            body = parts[2].strip() if len(parts) >= 3 else ''
        else:
            body = content
    else:
        body = content
    return fm, body

def make_frontmatter(fm):
    """生成 YAML frontmatter 字符串"""
    lines = ['---']
    for k, v in fm.items():
        if isinstance(v, list):
            lines.append(f'{k}:')
            for item in v:
                lines.append(f'  - {item}')
        elif isinstance(v, dict):
            lines.append(f'{k}:')
            for sk, sv in v.items():
                if isinstance(sv, list):
                    lines.append(f'  {sk}:')
                    for item in sv:
                        lines.append(f'    - {item}')
                else:
                    lines.append(f'  {sk}: {sv}')
        else:
            lines.append(f'{k}: {v}')
    lines.append('---')
    return '\n'.join(lines)

def scan_skills(root, source_label, plugin_layout=False):
    """扫描 skill 目录，返回结构化数据。
    - 普通实例: root/<category>/<skill>/SKILL.md
    - flat 实例: root/<skill>/SKILL.md（category='skills'）
    - plugin_layout: root/<marketplace>/<plugin>/<version>/skills/<skill>/SKILL.md
    """
    skills = []
    if not os.path.isdir(root):
        return skills
    disabled_set = set(get_disabled_skills())  # 一次读取复用（原每技能读一次 config）

    if plugin_layout:
        # 插件缓存布局：遍历 <marketplace>/<plugin>/<version>/skills/
        cat_iter = []
        for marketplace in sorted(os.listdir(root)):
            mp_path = os.path.join(root, marketplace)
            if not os.path.isdir(mp_path) or marketplace.startswith('.'):
                continue
            for plugin in sorted(os.listdir(mp_path)):
                plugin_path = os.path.join(mp_path, plugin)
                if not os.path.isdir(plugin_path) or plugin.startswith('.'):
                    continue
                for version in sorted(os.listdir(plugin_path)):
                    skills_dir = os.path.join(plugin_path, version, 'skills')
                    if os.path.isdir(skills_dir):
                        cat_iter.append((f'{plugin}', skills_dir))
        flat = True  # 每个 skills/ 目录内部是平铺的
    else:
        flat = source_label in FLAT_LABELS
        if flat:
            cat_iter = [('skills', root)]
        else:
            cat_iter = [(c, os.path.join(root, c)) for c in sorted(os.listdir(root))]

    for category, cat_path in cat_iter:
        if not os.path.isdir(cat_path) or (not flat and category.startswith('.')):
            continue
        for skill_name in sorted(os.listdir(cat_path)):
            skill_path = os.path.join(cat_path, skill_name)
            skill_md = os.path.join(skill_path, 'SKILL.md')
            if not os.path.isfile(skill_md):
                continue
            try:
                with open(skill_md, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
            except Exception:
                continue
            fm, body = parse_frontmatter(content)

            # 收集子文件
            refs, templates, scripts = [], [], []
            for sub, key in [('references', refs), ('templates', templates), ('scripts', scripts)]:
                d = os.path.join(skill_path, sub)
                if os.path.isdir(d):
                    for f in sorted(os.listdir(d)):
                        fp = os.path.join(d, f)
                        if os.path.isfile(fp):
                            key.append({'name': f, 'size': os.path.getsize(fp)})

            skills.append({
                'name': fm.get('name', skill_name),
                'dir_name': skill_name,
                'category': category,
                'source': source_label,
                'path': skill_path,
                'description': fm.get('description', ''),
                'version': fm.get('version', ''),
                'author': fm.get('author', ''),
                'platforms': fm.get('platforms', []),
                'tags': fm.get('metadata', {}).get('hermes', {}).get('tags', []) if isinstance(fm.get('metadata'), dict) else [],
                'body': body,
                'frontmatter': fm,
                'refs': refs,
                'templates': templates,
                'scripts': scripts,
                'size': os.path.getsize(skill_md),
                'modified': os.path.getmtime(skill_md),
                'disabled': skill_name in disabled_set,
                'readonly': bool(source_label.split('/')[0] != 'hermes'),
            })
    return skills

def get_all_skills():
    """获取所有 source 的所有 skills（带缓存）"""
    all_skills = []
    for label, info in SOURCES.items():
        all_skills.extend(get_all_skills_cached(label, info['root']))
    return all_skills

def safe_join(base, *parts):
    """路径拼接 + 防目录穿越：结果必须仍在 base 内"""
    base_abs = os.path.abspath(base)
    target = os.path.abspath(os.path.join(base_abs, *parts))
    if not (target == base_abs or target.startswith(base_abs + os.sep)):
        return None
    return target


def safe_segment(value):
    """只允许单个路径片段，禁止绝对路径、分隔符与 . / ..。"""
    if not isinstance(value, str) or not value or value in ('.', '..') or len(value) > 255:
        return False
    if any(ord(char) < 32 for char in value):
        return False
    return not any(char in value for char in '/\\<>:"|?*')

def find_skill(source, category, skill_name):
    """定位单个 skill（兼容 flat / plugin_layout source：直接查缓存索引）"""
    info = SOURCES.get(source)
    if not info:
        return None
    all_in_src = get_all_skills_cached(source, info['root'])
    for s in all_in_src:
        if s['dir_name'] == skill_name or s['name'] == skill_name:
            if category and s['category'] != category:
                continue
            c = dict(s)
            return c
    return None

def validate_skill(skill_data):
    """校验 skill 格式"""
    errors = []
    if not skill_data.get('name'):
        errors.append('缺少 name 字段')
    if not skill_data.get('description'):
        errors.append('缺少 description 字段')
    if not skill_data.get('body') or not skill_data['body'].strip():
        errors.append('SKILL.md 正文为空')
    return {'valid': len(errors) == 0, 'errors': errors}

# ─── HTTP Handler ───────────────────────────────────────

class SkillHubHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass  # 静默日志

    def _host_allowed(self):
        """Block DNS-rebinding Host headers when running in loopback mode."""
        bound_host = str(self.server.server_address[0]).lower()
        loopback = {'127.0.0.1', 'localhost', '::1'}
        if bound_host not in loopback:
            return True
        raw_host = (self.headers.get('Host') or '').strip().lower()
        if raw_host.startswith('['):
            host = raw_host[1:].split(']', 1)[0]
        else:
            host = raw_host.rsplit(':', 1)[0]
        return host in loopback

    def _reject_untrusted_host(self):
        if self._host_allowed():
            return False
        self._send_json({'error': 'untrusted host header'}, 421)
        return True

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, html, status=200):
        body = html.encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'")
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
        except (TypeError, ValueError):
            self._send_json({'error': 'invalid content length'}, 400)
            return None
        if length < 0 or length > MAX_BODY_SIZE:
            self._send_json({'error': 'request body too large'}, 413)
            return None
        if length > 0:
            try:
                data = json.loads(self.rfile.read(length).decode('utf-8'))
            except (UnicodeDecodeError, json.JSONDecodeError):
                self._send_json({'error': 'invalid JSON body'}, 400)
                return None
            if not isinstance(data, dict):
                self._send_json({'error': 'JSON body must be an object'}, 400)
                return None
            return data
        return {}

    def _get_query(self):
        parsed = urllib.parse.urlparse(self.path)
        params = {}
        if parsed.query:
            for pair in parsed.query.split('&'):
                if '=' in pair:
                    k, v = pair.split('=', 1)
                    params[k] = urllib.parse.unquote(v)
        return params

    def do_GET(self):
        if self._reject_untrusted_host():
            return
        # 本机 localhost 解析可能异常缓慢（此机实测 ~2s/新连接），
        # 301 到 127.0.0.1：浏览器只需慢一次，之后全程直连 IPv4 秒回
        host_hdr = (self.headers.get('Host') or '').lower()
        if host_hdr.startswith('localhost'):
            _port = self.server.server_address[1]
            self.send_response(301)
            self.send_header('Location', f'http://127.0.0.1:{_port}{self.path}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        params = self._get_query()

        # API routes
        if path == '/api/skills':
            all_skills = get_all_skills()
            # 过滤
            source = params.get('source', '')
            category = params.get('category', '')
            search = params.get('search', '').lower()
            disabled_filter = params.get('disabled', '')  # 'true' / 'false' / ''

            filtered = []
            for s in all_skills:
                if source and s['source'] != source:
                    continue
                if category and s['category'] != category:
                    continue
                if disabled_filter == 'true' and not s.get('disabled'):
                    continue
                if disabled_filter == 'false' and s.get('disabled'):
                    continue
                if search:
                    searchable = f"{s['name']} {s['description']} {s['category']} {' '.join(s['tags'])}".lower()
                    if search not in searchable:
                        continue
                filtered.append(s)

            # 简化输出（浅拷贝，避免污染缓存对象）
            out = []
            for s in filtered:
                c = {k: v for k, v in s.items() if k not in ('body', 'frontmatter')}
                out.append(c)

            self._send_json({
                'skills': out,
                'total': len(out),
                'sources': sorted(SOURCES.keys()),
                'categories': sorted(set(s['category'] for s in all_skills)),
            })

        elif path == '/api/skill':
            source = params.get('source', '')
            category = params.get('category', '')
            name = params.get('name', '')
            if source and category and name:
                skill = find_skill(source, category, name)
                if skill:
                    self._send_json(skill)
                else:
                    self._send_json({'error': 'not found'}, 404)
            else:
                self._send_json({'error': 'missing params'}, 400)

        elif path == '/api/categories':
            all_skills = get_all_skills()
            cats = sorted(set(s['category'] for s in all_skills))
            self._send_json({'categories': cats})

        elif path == '/api/sources':
            self._send_json({'sources': sorted(SOURCES.keys())})

        elif path == '/api/agents':
            self._send_json({'agents': get_agents_tree()})

        elif path == '/api/overview':
            self._send_json(get_platform_overview())

        elif path == '/api/compare':
            # 跨 source 对比同一 skill
            skill_name = params.get('name', '')
            if not skill_name:
                self._send_json({'error': 'missing name'}, 400)
                return
            all_skills = get_all_skills()
            matches = [s for s in all_skills if s['dir_name'] == skill_name or s['name'] == skill_name]
            self._send_json({'matches': matches})

        elif path == '/api/health':
            self._send_json({'status': 'ok', 'sources': len(SOURCES)})

        elif path == '/api/status':
            with STATUS_LOCK:
                st = dict(SCAN_STATUS)
                st['done_sources'] = list(st['done_sources'])
            self._send_json(st)

        elif path == '/api/security/status':
            self._send_json(get_security_scanner().status())

        elif path == '/api/file':
            # 读取子文件内容
            source = params.get('source', '')
            category = params.get('category', '')
            skill_name = params.get('skill_name', '')
            subdir = params.get('subdir', '')
            filename = params.get('filename', '')

            if not all([source, category, skill_name, subdir, filename]):
                self._send_json({'error': 'missing params'}, 400)
                return

            if subdir not in ('references', 'templates', 'scripts') or not safe_segment(filename) or not safe_segment(skill_name):
                self._send_json({'error': 'invalid path'}, 400)
                return

            target_skill = find_skill(source, category, skill_name)
            if not target_skill:
                self._send_json({'error': 'skill not found'}, 404)
                return
            file_path = safe_join(target_skill['path'], subdir, filename)
            if not file_path or not os.path.isfile(file_path):
                self._send_json({'error': 'file not found'}, 404)
                return

            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()

            self._send_json({'ok': True, 'content': content, 'path': file_path})

        elif path == '/api/disabled':
            self._send_json({'disabled': get_disabled_skills()})

        elif path == '/api/disabled/toggle':
            self._send_json({'error': 'method not allowed; use PUT /api/disabled/toggle'}, 405)

        elif path.startswith('/static/'):
            self._serve_static(path)
        elif path in ('', '/'):
            self._serve_frontend()
        else:
            self._send_json({'error': 'not found'}, 404)

    def do_POST(self):
        if self._reject_untrusted_host():
            return
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        data = self._read_body()
        if data is None:
            return

        if path == '/api/skill':
            # Create new skill
            source = data.get('source', 'hermes/main')
            category = data.get('category', 'misc')
            name = data.get('name', '')
            description = data.get('description', '')
            body = data.get('body', '')
            version = data.get('version', '1.0.0')
            author = data.get('author', '')

            if not name:
                self._send_json({'error': 'missing name'}, 400)
                return
            if not safe_segment(name) or not safe_segment(category):
                self._send_json({'error': 'invalid name or category'}, 400)
                return

            src_info = SOURCES.get(source)
            if not src_info:
                self._send_json({'error': f'unknown source: {source}'}, 400)
                return
            if src_info['agent'] != 'hermes':
                self._send_json({'error': 'read-only source; create skills under hermes/*'}, 403)
                return
            root = src_info['root']

            skill_path = safe_join(root, category, name)
            if not skill_path:
                self._send_json({'error': 'invalid target path'}, 400)
                return
            if os.path.exists(skill_path):
                self._send_json({'error': 'skill already exists'}, 409)
                return

            os.makedirs(skill_path, exist_ok=True)

            fm = {
                'name': name,
                'description': description,
                'version': version,
                'author': author,
            }
            fm_text = make_frontmatter(fm)
            skill_md_content = fm_text + '\n' + body

            with open(os.path.join(skill_path, 'SKILL.md'), 'w', encoding='utf-8') as f:
                f.write(skill_md_content)

            invalidate_cache(source)
            self._send_json({'ok': True, 'message': f'Created {source}/{category}/{name}'}, 201)

        elif path == '/api/migrate':
            # 跨 source 迁移（复制或移动）
            src_source = data.get('from_source', '')
            src_category = data.get('from_category', '')
            name = data.get('name', '')
            dst_source = data.get('to_source', '')
            dst_category = data.get('to_category', '')  # 平铺目标可留空
            mode = data.get('mode', 'copy')  # copy / move
            overwrite = bool(data.get('overwrite', False))

            if not all([src_source, name, dst_source]):
                self._send_json({'error': 'missing from_source/name/to_source'}, 400)
                return
            if not safe_segment(name) or (dst_category and not safe_segment(dst_category)):
                self._send_json({'error': 'invalid name or target category'}, 400)
                return
            if mode not in ('copy', 'move'):
                self._send_json({'error': 'mode must be copy or move'}, 400)
                return
            if src_source == dst_source and src_category == dst_category:
                self._send_json({'error': 'source and target are identical'}, 400)
                return

            src_info = SOURCES.get(src_source)
            dst_info = SOURCES.get(dst_source)
            if not src_info or not dst_info:
                self._send_json({'error': 'unknown source'}, 400)
                return
            if dst_info['agent'] != 'hermes':
                self._send_json({'error': 'read-only target; migrate only into hermes/*'}, 403)
                return
            dst_root = dst_info['root']

            # 通过扫描索引定位真实路径，兼容 flat 与 plugin cache 布局
            src_skill = find_skill(src_source, src_category, name)
            src_path = src_skill['path'] if src_skill else None
            if not src_path or not os.path.isdir(src_path):
                self._send_json({'error': 'skill not found in source'}, 404)
                return

            dst_flat = dst_source in FLAT_LABELS
            if dst_flat:
                dst_cat = 'skills'
                dst_cat_seg = ''
            else:
                dst_cat = dst_category or 'migrated'
                dst_cat_seg = dst_cat
            dst_path = safe_join(dst_root, dst_cat_seg, name)
            if not dst_path:
                self._send_json({'error': 'invalid target path'}, 400)
                return

            if os.path.exists(dst_path):
                if not overwrite:
                    self._send_json({'error': 'target already exists', 'code': 'exists'}, 409)
                    return
                shutil.rmtree(dst_path)

            os.makedirs(os.path.dirname(dst_path), exist_ok=True)
            if mode == 'copy':
                shutil.copytree(src_path, dst_path)
            else:
                shutil.move(src_path, dst_path)

            invalidate_cache(src_source)
            invalidate_cache(dst_source)
            scanner = get_security_scanner()
            scanner.invalidate(src_path)
            scanner.invalidate(dst_path)
            action = 'Copied' if mode == 'copy' else 'Moved'
            self._send_json({
                'ok': True,
                'message': f'{action} {name}: {src_source}/{src_category} -> {dst_source}/{dst_cat}',
                'target': {'source': dst_source, 'category': dst_cat, 'name': name},
            })

        elif path == '/api/rescan':
            # 手动重扫：先同步切换状态，再后台重建，避免客户端看到旧 ready=true
            invalidate_cache()
            get_security_scanner().invalidate()
            _status_update(ready=False, warming=True, finished_at=None,
                           total_sources=len(SOURCES), done_sources=[])
            threading.Thread(target=warm_cache, daemon=True, name='skillhub-rescan').start()
            self._send_json({'ok': True, 'message': 'rescan started'})

        elif path == '/api/security/scan':
            source = str(data.get('source', '')).strip()
            category = str(data.get('category', '')).strip()
            name = str(data.get('name', '')).strip()
            deep = data.get('deep', False)
            force = data.get('force', False)
            if not all([source, category, name]) or not isinstance(deep, bool) or not isinstance(force, bool):
                self._send_json({'error': 'need source/category/name + deep(bool) + force(bool)'}, 400)
                return
            if not safe_segment(category) or not safe_segment(name):
                self._send_json({'error': 'invalid skill identity'}, 400)
                return
            skill = find_skill(source, category, name)
            if not skill:
                self._send_json({'error': 'skill not found'}, 404)
                return
            try:
                self._send_json(get_security_scanner().scan(skill, deep=deep, force=force))
            except Exception as exc:
                self._send_json({'error': str(exc)}, 503)

        else:
            self._send_json({'error': 'not found'}, 404)

    def do_PUT(self):
        if self._reject_untrusted_host():
            return
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        data = self._read_body()
        if data is None:
            return

        if path == '/api/skill':
            source = data.get('source', '')
            category = data.get('category', '')
            name = data.get('name', '')

            if not source or not category or not name:
                self._send_json({'error': 'missing source/category/name'}, 400)
                return
            if not safe_segment(name) or not safe_segment(category):
                self._send_json({'error': 'invalid name or category'}, 400)
                return

            src_info = SOURCES.get(source)
            if not src_info:
                self._send_json({'error': f'unknown source: {source}'}, 400)
                return
            if src_info['agent'] != 'hermes':
                self._send_json({'error': 'read-only source; edit skills under hermes/*'}, 403)
                return
            root = src_info['root']

            target_skill = find_skill(source, category, name)
            skill_path = target_skill['path'] if target_skill else None
            if not skill_path:
                self._send_json({'error': 'skill not found'}, 404)
                return
            skill_md = os.path.join(skill_path, 'SKILL.md')

            if not os.path.isfile(skill_md):
                self._send_json({'error': 'skill not found'}, 404)
                return

            # 读取现有内容
            with open(skill_md, 'r', encoding='utf-8', errors='replace') as f:
                old_content = f.read()
            old_fm, old_body = parse_frontmatter(old_content)

            # 更新字段
            new_fm = old_fm.copy()
            if 'name' in data: new_fm['name'] = data['name']
            if 'description' in data: new_fm['description'] = data['description']
            if 'version' in data: new_fm['version'] = data['version']
            if 'author' in data: new_fm['author'] = data['author']
            if 'platforms' in data: new_fm['platforms'] = data['platforms']
            if 'tags' in data:
                md = new_fm.get('metadata', {}).copy()
                hermes = md.get('hermes', {}).copy()
                hermes['tags'] = data['tags']
                md['hermes'] = hermes
                new_fm['metadata'] = md

            new_body = data.get('body', old_body)

            # 校验
            validation = validate_skill({'name': new_fm.get('name', ''), 'description': new_fm.get('description', ''), 'body': new_body})
            if not validation['valid']:
                self._send_json({'error': 'validation failed', 'details': validation['errors']}, 400)
                return

            # 改名前先验证目标，避免写入后才发现冲突而产生半完成状态
            new_name = data.get('name', name)
            if not safe_segment(new_name):
                self._send_json({'error': 'invalid target name'}, 400)
                return
            new_path = skill_path
            if new_name != name:
                cat_seg = '' if source in FLAT_LABELS else category
                new_path = safe_join(root, cat_seg, new_name)
                if not new_path:
                    self._send_json({'error': 'invalid target path'}, 400)
                    return
                if os.path.exists(new_path):
                    self._send_json({'error': 'target name already exists'}, 409)
                    return

            # 写入
            fm_text = make_frontmatter(new_fm)
            new_content = fm_text + '\n' + new_body
            old_skill_path = skill_path

            with open(skill_md, 'w', encoding='utf-8') as f:
                f.write(new_content)

            # 如果改名了，移动目录
            if new_name != name:
                os.rename(skill_path, new_path)
                skill_path = new_path

            invalidate_cache(source)
            scanner = get_security_scanner()
            scanner.invalidate(old_skill_path)
            scanner.invalidate(skill_path)
            self._send_json({'ok': True, 'message': f'Updated {source}/{category}/{new_name}'})

        elif path == '/api/disabled/toggle':
            name = str(data.get('name', '')).strip()
            disabled = data.get('disabled', None)
            if not safe_segment(name) or not isinstance(disabled, bool):
                self._send_json({'error': 'need safe name + disabled(bool)'}, 400)
                return
            current = get_disabled_skills()
            if disabled and name not in current:
                current.append(name)
            elif not disabled and name in current:
                current.remove(name)
            set_disabled_skills(current)
            refresh_disabled_in_cache()
            self._send_json({'ok': True, 'disabled': get_disabled_skills(), 'name': name})

        elif path == '/api/disabled':
            names = data.get('names', [])
            if not isinstance(names, list):
                self._send_json({'error': 'names must be a list'}, 400)
                return
            set_disabled_skills([str(n).strip() for n in names if str(n).strip()])
            refresh_disabled_in_cache()  # 就地更新标记，免全量重扫
            self._send_json({'ok': True, 'disabled': get_disabled_skills()})

        elif path == '/api/disabled/batch':
            # 批量启用/禁用
            names = data.get('names', [])
            action = data.get('action', '')  # 'disable' / 'enable'
            if not isinstance(names, list) or action not in ('disable', 'enable'):
                self._send_json({'error': 'need names(list) + action(disable/enable)'}, 400)
                return
            current = get_disabled_skills()
            if action == 'disable':
                for n in names:
                    n = str(n).strip()
                    if n and n not in current:
                        current.append(n)
            else:
                current = [n for n in current if str(n).strip() not in {str(x).strip() for x in names}]
            set_disabled_skills(current)
            refresh_disabled_in_cache()  # 就地更新标记，免全量重扫
            self._send_json({'ok': True, 'action': action, 'affected': len(names), 'disabled': get_disabled_skills()})

        elif path == '/api/skill/file':
            # 写入子文件（references/templates/scripts）
            source = data.get('source', '')
            category = data.get('category', '')
            skill_name = data.get('skill_name', '')
            subdir = data.get('subdir', '')  # references / templates / scripts
            filename = data.get('filename', '')
            content = data.get('content', '')

            if not all([source, category, skill_name, subdir, filename]):
                self._send_json({'error': 'missing params'}, 400)
                return

            if subdir not in ('references', 'templates', 'scripts') or not safe_segment(filename) or not safe_segment(skill_name):
                self._send_json({'error': 'invalid path'}, 400)
                return

            src_info = SOURCES.get(source)
            if not src_info:
                self._send_json({'error': f'unknown source: {source}'}, 400)
                return
            if src_info['agent'] != 'hermes':
                self._send_json({'error': 'read-only source; edit skills under hermes/*'}, 403)
                return

            target_skill = find_skill(source, category, skill_name)
            if not target_skill:
                self._send_json({'error': 'skill not found'}, 404)
                return
            file_path = safe_join(target_skill['path'], subdir, filename)
            if not file_path:
                self._send_json({'error': 'invalid path'}, 400)
                return
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

            invalidate_cache(source)
            get_security_scanner().invalidate(target_skill['path'])
            self._send_json({'ok': True, 'message': f'Wrote {file_path}'})

        else:
            self._send_json({'error': 'not found'}, 404)

    def do_DELETE(self):
        if self._reject_untrusted_host():
            return
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        params = self._get_query()

        if path == '/api/skill':
            source = params.get('source', '')
            category = params.get('category', '')
            name = params.get('name', '')

            if not all([source, category, name]):
                self._send_json({'error': 'missing params'}, 400)
                return
            if not safe_segment(name) or not safe_segment(category):
                self._send_json({'error': 'invalid name or category'}, 400)
                return

            src_info = SOURCES.get(source)
            if not src_info:
                self._send_json({'error': f'unknown source: {source}'}, 400)
                return
            if src_info['agent'] != 'hermes':
                self._send_json({'error': 'read-only source; delete only under hermes/*'}, 403)
                return
            target_skill = find_skill(source, category, name)
            skill_path = target_skill['path'] if target_skill else None
            if not skill_path or not os.path.isdir(skill_path):
                self._send_json({'error': 'skill not found'}, 404)
                return

            shutil.rmtree(skill_path)
            invalidate_cache(source)
            get_security_scanner().invalidate(skill_path)
            self._send_json({'ok': True, 'message': f'Deleted {source}/{category}/{name}'})

        else:
            self._send_json({'error': 'not found'}, 404)

    def _serve_frontend(self):
        """ Serve the frontend HTML """
        html = self._get_frontend_html()
        self._send_html(html)

    def _get_frontend_html(self):
        return (STATIC_DIR / 'index.html').read_text(encoding='utf-8')

    def _serve_static(self, request_path):
        asset_name = request_path.removeprefix('/static/')
        if not safe_segment(asset_name):
            self._send_json({'error': 'not found'}, 404)
            return
        asset_path = safe_join(str(STATIC_DIR), asset_name)
        if not asset_path or not os.path.isfile(asset_path):
            self._send_json({'error': 'not found'}, 404)
            return
        body = Path(asset_path).read_bytes()
        content_type = mimetypes.guess_type(asset_path)[0] or 'application/octet-stream'
        if content_type.startswith('text/') or content_type in ('application/javascript', 'application/json'):
            content_type += '; charset=utf-8'
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'public, max-age=3600')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.end_headers()
        self.wfile.write(body)



# ─── Server ─────────────────────────────────────────────

def run_server(host='127.0.0.1', port=8080):
    class _ExclusiveServer(ThreadingHTTPServer):
        """bind 前设置独占绑定，禁止同端口僵尸实例并存（Windows）"""
        allow_reuse_address = False  # Windows 上 SO_REUSEADDR 与独占标志互斥，且会允许端口重复绑定
        def server_bind(self):
            if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):
                try:
                    self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
                except OSError:
                    pass
            super().server_bind()

    server = _ExclusiveServer((host, port), SkillHubHandler)
    try:
        # 后台预热：服务一起动就开始扫，不等首个请求
        threading.Thread(target=warm_cache, daemon=True, name='skillhub-warmer').start()
        print(f"""
╔══════════════════════════════════════════╗
║           ⚡ SkillHub                    ║
║   通用 Agent Skill 管理工具               ║
╠══════════════════════════════════════════╣
║  访问: http://127.0.0.1:{port}          ║
║  Sources: {len(SOURCES)}                               ║
║  后台预热已启动（首屏秒开）               ║
╚══════════════════════════════════════════╝
""")
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n shutting down...")
        server.shutdown()

def main(argv=None):
    parser = argparse.ArgumentParser(description='SkillHub - Agent Skill Management Tool')
    parser.add_argument('--port', type=int, default=8080)
    parser.add_argument('--host', type=str, default='127.0.0.1')
    args = parser.parse_args(argv)
    run_server(args.host, args.port)


if __name__ == '__main__':
    main()
