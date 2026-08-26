# Changelog

本项目遵循 [Semantic Versioning](https://semver.org/)。

## [Unreleased]

## [0.2.0] - 2026-08-26

### Added
- 🛡️ 静态安全审计：可选集成 [agent-skill-scanner](https://github.com/liuhaolin07/agent-skill-scanner)。
  - 详情页「安全」Tab：风险评分、分类命中网格、逐条 finding（危害解释/修复建议/证据行号）。
  - 技能卡片风险徽章与头部「已审计」统计。
  - `GET /api/security/status` 与 `POST /api/security/scan` 端点。
  - 引擎按文件签名热重载；报告按 Skill 文件签名缓存，写操作精确失效。
- 安全审计核心测试与 HTTP 回归（fake 引擎夹具覆盖 quick/deep/缓存失效与端点错误路径）。

## [0.1.0] - 2026-08-26

### Added
- 统一发现 Hermes、Codex、Claude Code 与 ZCode Skill。
- Platform Shell v3：Agent/实例/权限卡、工作区导航与响应式抽屉。
- Skill 搜索、筛选、预览、编辑、启停、删除、比较和迁移。
- `/api/overview` 平台架构元数据入口。
- 路径穿越保护、只读 Source 权限边界和 loopback 默认绑定。
- 标准 Python 包、测试、CI、文档和 MIT 许可证。
