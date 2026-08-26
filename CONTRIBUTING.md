# 贡献指南

感谢参与 SkillHub。

## 开发环境

1. Fork 并克隆仓库。
2. 运行 `uv sync --extra dev`。
3. 从 `main` 创建功能分支。
4. 修改后运行：

```bash
uv run pytest
uv run ruff check src tests
uv build
```

## 提交要求

- 一个提交解决一个清晰问题。
- 新行为应有测试；修复安全边界时必须添加回归测试。
- 不要提交真实 Skill 内容、个人目录、配置文件、令牌或 API Key。
- UI 改动请同时验证桌面端和 430px 窄屏，并附截图。
- 保持外部 Agent 来源只读；改变权限模型前先开 Issue 讨论。

## Pull Request

PR 描述应包含：问题、方案、验证命令、UI 截图（如适用）和兼容性影响。
