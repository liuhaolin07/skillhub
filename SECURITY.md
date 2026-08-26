# 安全策略

## 支持版本

当前仅维护最新的 `main` 和最新 GitHub Release。

## 报告漏洞

请不要公开披露未修复漏洞。使用 GitHub 的 **Private vulnerability reporting**，或通过仓库所有者公开资料中的联系方式私下报告。

报告请包含影响、复现步骤、受影响端点/文件操作和建议修复。请勿附带真实凭据或私人 Skill 内容。

## 安全模型

- 默认仅监听 `127.0.0.1`。
- 当前没有用户认证，**不得直接暴露到公网**。
- Hermes Source 可写；Codex、Claude Code、ZCode Source 默认只读。
- 文件 API 拒绝绝对路径、路径分隔符、`.`、`..` 与 NUL 字节。
- Skill 查找通过扫描索引定位真实根目录，并使用安全路径拼接。
- 页面启用 CSP、`X-Frame-Options: DENY` 与 `nosniff`。

若使用 `--host 0.0.0.0`，必须自行配置可信反向代理、认证、防火墙和 TLS。
