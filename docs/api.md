# HTTP API

默认基址：`http://127.0.0.1:8080`。所有响应均为 JSON，根页面与静态资源除外。

## 读取

| Method | Path | 说明 |
|---|---|---|
| GET | `/api/health` | 存活检查 |
| GET | `/api/status` | 预热/重扫状态 |
| GET | `/api/overview` | 平台、权限与指标 |
| GET | `/api/skills` | Skill 索引，可用 query 筛选 |
| GET | `/api/skill` | 单个 Skill 详情 |
| GET | `/api/sources` | Source 列表 |
| GET | `/api/categories` | 分类列表 |
| GET | `/api/agents` | Agent/实例树 |
| GET | `/api/compare` | 同名 Skill 跨 Source 比较 |
| GET | `/api/file` | 读取允许的 Skill 子文件 |
| GET | `/api/disabled` | 全局禁用名称列表 |
| GET | `/api/security/status` | 安全审计引擎状态与已缓存报告摘要 |

## 写入

| Method | Path | 说明 |
|---|---|---|
| POST | `/api/skill` | 创建 Skill |
| POST | `/api/migrate` | 复制/移动 Skill |
| POST | `/api/rescan` | 清缓存并后台重扫 |
| POST | `/api/security/scan` | 扫描单个 Skill（`deep`/`force` 布尔参数） |
| PUT | `/api/skill` | 编辑/重命名 Skill |
| PUT | `/api/disabled/toggle` | 幂等启停单个名称 |
| PUT | `/api/disabled` | 替换禁用列表 |
| PUT | `/api/disabled/batch` | 批量启停 |
| PUT | `/api/skill/file` | 写入允许的子文件 |
| DELETE | `/api/skill` | 删除 Skill |

写操作只允许目标为 Hermes Source。文件操作只允许 `references`、`templates`、`scripts` 下的单层文件名。

## 安全审计

### `GET /api/security/status`

```json
{
  "available": true,
  "engine": "python",
  "version": "0.2.1",
  "rule_count": 16,
  "categories": [{"id": "secret_access", "label": "Secrets & SSH keys"}],
  "config_source": "local_config",
  "repo_url": "https://github.com/liuhaolin07/agent-skill-scanner",
  "reports": [
    {"key": "hermes/main|security|demo", "risk": "CRITICAL", "score": 100,
     "file_count": 7, "finding_count": 15, "mode": "deep", "warnings": 0}
  ]
}
```

未配置引擎时 `available` 为 `false` 并附带 `error` 说明。

### `POST /api/security/scan`

请求体：`{"source": "...", "category": "...", "name": "...", "deep": false, "force": false}`

- `deep: true` 扫描 Skill 内全部支持的文本文件；默认只扫 SKILL.md。
- `force: true` 忽略缓存重新扫描。
- 返回报告含 `risk`（LOW/MEDIUM/HIGH/CRITICAL）、`score`（0–100）、逐文件的 `findings`（每条含 `severity`、`title`、`why`、`remediation` 与带行号的 `evidence`）。
- 引擎不可用时返回 `503`，参数缺失或非法返回 `400`。
