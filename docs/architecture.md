# 架构

## 总览

SkillHub 是单进程、本地优先的控制平面。它使用 Python 标准库 HTTP Server 提供 API 和静态页面，不需要数据库。

```text
Browser
  │  HTML/CSS/JS + JSON API
  ▼
SkillHub ThreadingHTTPServer
  ├─ Source discovery
  ├─ Skill scanner + mtime cache
  ├─ Permission policy
  ├─ Config writer (Hermes skills.disabled)
  └─ Static asset server
       │
       ├─ Hermes skills / profiles       (manage)
       ├─ Codex skills                   (observe)
       ├─ Claude Code skills             (observe)
       └─ ZCode plugin skills            (observe)
```

## 组件

### Source discovery

启动时根据 `HERMES_HOME`、用户主目录和已存在目录构建 Source 注册表。支持：

- categorized：`<root>/<category>/<skill>/SKILL.md`
- flat：`<root>/<skill>/SKILL.md`
- plugin cache：`<marketplace>/<plugin>/<version>/skills/<skill>/SKILL.md`

### 扫描与缓存

每个 Source 独立缓存。浅层目录 mtime 在短 TTL 内复用；写操作只使相关 Source 失效。启动与手动重扫使用后台预热，状态由 `/api/status` 暴露。

### 权限模型

权限由 Source 所属 Agent 决定：Hermes 可管理，其他 Agent 只读。前端显示权限，后端再次强制检查；UI 不是安全边界。

### 前端

无框架前端分为：

- `index.html`：语义结构
- `app.css` / `security.css`：设计令牌、布局、响应式与安全审计组件样式
- `app.js`：状态、筛选、渲染、I18N 与 API 交互

前端一次加载完整 Skill 索引，在本地组合筛选；全局平台统计来自 `/api/overview`。

### 安全审计适配层

`security.py` 将 [agent-skill-scanner](https://github.com/liuhaolin07/agent-skill-scanner) 的 Python 引擎作为可选插件接入：

- **动态加载**：通过 `importlib` 从配置目录加载 `scanner.py`，按引擎文件签名（mtime + size）热重载，规则始终以 scanner 仓库为单一来源。
- **两级扫描**：quick 只读 SKILL.md（毫秒级预检），deep 收集 Skill 内全部 Markdown/JSON/YAML（受文件数与总大小上限保护）。
- **报告缓存**：进程内 per-skill 双槽缓存，键包含文件 mtime/size 签名；Skill 的创建、编辑、删除、迁移会精确失效对应缓存。
- **优雅降级**：未配置 scanner 时 API 返回 `available: false`，UI 显示引导信息，其余功能完全不受影响。

## 设计约束

- 定位是可信本机上的单用户开发者工具。
- 无数据库、无登录、无公网部署保证。
- Skill 名称是全局启停键；同名 Skill 跨 Source 同步显示状态。
- 仅子目录 `references`、`templates`、`scripts` 可通过文件 API 访问。
