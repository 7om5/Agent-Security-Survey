# Phase 3 输出索引

> 状态：阶段三分析完成；**六项勘误完成（2026-11-06）**；阶段四已启动。
> 语料：124 篇；Taxonomy v1.1；四个维度独立，不合并总分。

## 核心报告

| 文件 | 内容 |
|---|---|
| `phase3_report.md` | 阶段三完整报告（摘要、9 主类、31 叶、发现、限制） |
| `phase3_errata_report.md` | **六项勘误**：H 分项、D3 年份、R1-01 A 分、F 子项、全量敏感性、证据页码 |
| `metadata_audit.md` | 书目/发表状态审计（110 正式主会、112 含 workshop、7 preprint、1 unknown、2 submitted、2 accepted） |
| `scoring_rubric.md` | H/T/A/F 评分锚点、聚合规则、校准案例；A=1/A=2 最小澄清 |
| `research_activity.md` | 样本内 H、年度分布、趋势、样本偏差；年度 ID 可追溯 |
| `theoretical_crypto_ranking.md` | T_crypto 排行与证据（B1 广度 3；B4 ceiling 4；仅 3 篇 T≥3） |
| `applied_crypto_ranking.md` | A_crypto 排行与证据（B1 广度 3；B4 ceiling 4；无 A=5；R1-01 A=1） |
| `master_feasibility_ranking.md` | F_master 排行与依据（B1=5；7 个方向=4；31 叶四子项） |
| `sensitivity_analysis.md` | 发表口径/交叉标签/**全量 30 篇 medium**/小样本/FULLY_READ 敏感性 |
| `taxonomy_count_correction.md` | 13 项边界澄清 vs 13 篇 v1.0→v1.1 差异 vs 7 篇 Phase1→v1.1 迁移 |

## 数据

| 文件 | 内容 |
|---|---|
| `paper_metadata.csv/.json` | 124 篇书目与发表状态 |
| `paper_crypto_evidence.csv/.json` | 124 篇论文级密码学证据矩阵（T/A/潜力/类型/证据）；R1-01 A=1 |
| `direction_scores_full.csv/.json` | **最终** 31 叶 + 9 主类的 H（含 V/M/B）/T/A/F 全表；F 含四个子项 |
| `direction_scores.csv/.json` | 中间表（仅 H/T/A，无 F/潜力字段）；以 `full` 为准 |
| `direction_year_matrix.csv` | 31 叶 + 9 主类的 2024/2025/2026 主会论文 ID 与数量 |
| `sensitivity_full.json` | 30 篇 medium 的 68 个单项情景、联合边界、10,000 次随机模拟 |
| `sensitivity_rank_stability.csv` | 各方向 H 区间、排名众数、top-tier/第 1 概率 |

## 可重算脚本

- `work/phase3/build_metadata.js` → 书目表
- `work/phase3/apply_errata.js` → 将 R1-01 A=1 与 R3-01/22/24 证据页码写回证据批次
- `work/phase3/merge_evidence.js` → 证据矩阵
- `work/phase3/aggregate_scores.js` → H/T/A 方向分
- `work/phase3/add_f.js` → 加 F_master + 四个子项，输出 `direction_scores_full`
- `work/phase3/build_year_matrix.js` → 年度/论文 ID 矩阵
- `work/phase3/sensitivity_full.js` → 30 篇 medium 全量敏感性
- `work/phase3/check_markdown_consistency.js` → 检查 Markdown 报告是否含修正后的关键值
- `scripts/audit_phase3.js` → 124 证据/124 书目/31 叶/9 主类/H 公式/F 求和/T/A 复算/年份矩阵一致性
- `scripts/audit_taxonomy.js` → Taxonomy v1.1 一致性检查

## 重跑顺序

```bash
node work/phase3/build_metadata.js
node work/phase3/apply_errata.js
node work/phase3/merge_evidence.js
node work/phase3/aggregate_scores.js
node work/phase3/add_f.js
node work/phase3/build_year_matrix.js
node work/phase3/sensitivity_full.js
node work/phase3/check_markdown_consistency.js
node scripts/audit_phase3.js
node scripts/audit_taxonomy.js
```

## 关键边界

- 124 篇是定向调研样本，不是全领域全集；H 是样本内代理。
- `T_dir/A_dir` 是“方向内是否普遍”，`T_ceiling/A_ceiling` 是“最好一篇做到什么”；B4 是单篇 spike。
- `T_potential/A_potential` 是研究假设，不是已有贡献。
- A 衡量实际使用/实现/评估；只在综述中“论及”密码机制记 A=1，不记 A=2。
- F 是“可开展性”，不是“新颖性”；F=5 不证明有可发表创新点。
- 30 篇 medium 已全量敏感性测试；D2 多数情景第 1，但联合边界下 H1 可第 1；A2/E2/G4 是第一梯队边界成员。
- 六项勘误完成后，阶段三标记为“修正完成”；阶段四据此启动。
