# 阶段三书目与发表状态审计｜2026-11-03

> 目的：为研究活跃度统计建立可核验的发表状态口径。**不修改** `registry/paper_manifest.csv`、`paper_status.csv`、`papers.jsonl`；新文件为 `research/phase3/paper_metadata.csv/.json`。
> 原则：只使用本地 PDF 首页/页脚、阶段一笔记与既有书目文件；不联网、不根据标题或早期推荐记录推断录用状态。无法确认的保留 `unconfirmed`。

## 1. 字段定义

| 字段 | 取值 |
|---|---|
| `publication_year` | 会议/期刊年份；arXiv-only 用预印本年份；无法确认留空 |
| `venue` | 会议/期刊/Workshop 名称；arXiv-only 为 `arXiv preprint`；R3-80 为 `unknown` |
| `publication_type` | `main_conference` / `workshop` / `preprint` / `unknown` |
| `publication_status` | `published` / `accepted_not_published` / `submitted` / `unconfirmed` |
| `metadata_confidence` | `high` / `medium` / `low` |
| `metadata_source` | PDF 页码/页脚、笔记头部、arXiv ID 等 |

**判定规则**：
- PDF 显示 DOI/ proceedings 页码/PMLR 卷号/会议 proceedings → `published`。
- PDF 明确写“accepted at …”但无 proceedings 元数据 → `accepted_not_published`。
- PDF 写“Submitted to …”或“Under review by …” → `submitted`。
- PDF 只有 arXiv ID/Preprint、无 venue → `preprint` + `unconfirmed`。
- 2026 年主会论文若 PDF 有 proceedings 页码/DOI → `published`，但置信度记 `medium`（会议时间窗口/索引差异）；若只有会议页脚无 proceedings → `accepted_not_published`。

## 2. 总体计数

| 维度 | 计数 |
|---|---:|
| 总论文 | 124 |
| `main_conference` | 113 |
| `workshop` | 3 |
| `preprint` | 7 |
| `unknown` | 1（R3-80） |
| `published` | 112 |
| `accepted_not_published` | 2 |
| `submitted` | 2 |
| `unconfirmed` | 8 |
| `metadata_confidence=high` | 50 |
| `metadata_confidence=medium` | 73 |
| `metadata_confidence=low` | 1 |

### 2.1 按年份

| 年份 | 总数 | 正式主会 published | 其他 |
|---|---:|---:|---|
| 2024 | 10 | 10 | 0 |
| 2025 | 28 | 27 | 1 workshop published（R2-08） |
| 2026 | 85 | 73 | 2 accepted_not_published（R3-53、R3-79）、1 submitted（R3-50）、1 workshop submitted（R3-54）、1 workshop published（R3-55）、7 preprint |
| 未知 | 1 | 0 | R3-80 unknown |

> 2026 年 85 篇包含预印本、Workshop、投稿与 accepted_not_published；**不能把 85 直接当作 2026 年正式主会发表量**。正式主会 published 的 2026 年数量为 **73**。

### 2.2 按 venue

| venue | 数量 | 备注 |
|---|---:|---|
| ICML | 28 | 主会 |
| ICLR | 18 | 主会 |
| ACL | 13 | 主会 |
| NeurIPS | 13 | 主会；另有 1 篇 submitted（R3-50） |
| USENIX Security | 11 | 主会 |
| ACM CCS | 9 | 主会；R3-79 accepted_not_published |
| AAAI | 8 | 主会 |
| NDSS | 7 | 主会 |
| IEEE S&P | 5 | 主会 |
| ICML Workshop | 3 | R2-08 published；R3-54 submitted；R3-55 published |
| NeurIPS (submitted) | 1 | R3-50，submitted |
| arXiv preprint | 7 | R3-48/49/52/56/57/81/85 |
| unknown | 1 | R3-80（无 venue/arXiv ID） |

> 总 venue 行合计 124（28+18+13+13+11+9+8+7+5+1+3+7+1=124）。R3-80 单列为 `unknown`，不计入 `arXiv preprint`。

## 3. 八篇空 venue 论文

| ID | 年份 | 类型 | 状态 | 置信度 | 依据 |
|---|---|---|---|---|---|
| R3-80 | 未知 | unknown | unconfirmed | low | PDF 首页无会议/期刊/arXiv ID；笔记记为未标注 |
| R3-48 | 2026 | preprint | unconfirmed | high | arXiv:2605.18991v2 |
| R3-49 | 2026 | preprint | unconfirmed | high | arXiv:2607.18063v2 |
| R3-52 | 2026 | preprint | unconfirmed | high | arXiv:2605.19149v1 |
| R3-56 | 2026 | preprint | unconfirmed | high | arXiv:2609.08126v1，Preprint |
| R3-57 | 2026 | preprint | unconfirmed | high | arXiv:2605.07630v2，Preprint |
| R3-81 | 2026 | preprint | unconfirmed | high | arXiv:2609.13873v1 |
| R3-85 | 2026 | preprint | unconfirmed | high | arXiv:2605.11229v1 |

## 4. 四篇 Workshop/Submitted/Under review

| ID | PDF 证据 | 类型 | 状态 | 处理 |
|---|---|---|---|---|
| R2-08 GuardAgent | Workshop on Computer-use Agents @ ICML 2025 | workshop | published | 计入 Workshop published，不计入主会 |
| R3-50 ORBIT | “Submitted to 40th NeurIPS 2026. Do not distribute.” | main_conference | submitted | 不计入正式发表量 |
| R3-54 ASPI | “Under review by FAGEN workshop at ICML” | workshop | submitted | 不计入正式发表量 |
| R3-55 AgentForesight | “Proceedings of the Failure Modes in Agentic AI Workshop … PMLR 306, 2026” | workshop | published | 计入 Workshop published，不计入主会 |

另有两篇 `accepted_not_published`：
- **R3-53 Agent MechSuits**：PDF 页脚为 NeurIPS 2026，会议在 2026-12（当前 2026-11-03），未见到 proceedings 元数据，记 `accepted_not_published`、confidence high。
- **R3-79 SkillScope**：PDF 写 “full version of a paper accepted at ACM CCS 2026”，未见到 proceedings 页码/DOI，记 `accepted_not_published`、confidence high。

## 5. 统计口径建议

1. **正式主会发表量**：`publication_type=main_conference AND publication_status=published`，共 **110** 篇（2024:10、2025:27、2026:73）。
2. **正式发表量（含 Workshop）**：`published`，共 **112** 篇。
3. **宽口径（所有 124 篇）**：用于内容/密码学分析，不用于“顶会发表量”比较。
4. **2026 年时间窗口**：2026 年 85 篇中只有 73 篇是正式主会 published；其余为预印本/Workshop/投稿/录用未出版。报告年度趋势时必须同时列出口径。
5. **不能做的事**：不得把 submitted、workshop、preprint 与主会 published 等权；不得把 2026 年总量直接解释为增长率；不得根据标题推断录用。

## 6. 置信度与限制

- `medium` 主要集中在 2026 年主会论文：PDF 有会议页脚/页码，但本次未联网核验 proceedings 索引；若后续需要精确书目，应以 DBLP/官方 proceedings 复核，但本阶段不联网。
- R3-80 的 venue/year 无法从 PDF 确认，保持 `unknown`，不臆测。
- 该元数据表是**阶段三统计口径**，不覆盖原始 `registry/` 记录；原始记录保留以便追溯。
- 8 篇 `preprint` 仍参与内容与密码学分析，但不计入正式主会发表量；在活跃度报告中单独列示。
