# Phase 4 输出索引

> 状态：阶段四分析与选题推荐完成；**未实现原型、未跑实验**。
> 输入：阶段三修正后的 124 篇证据 + 外部 prior art（与 124 篇严格分离）。
> 结论：C1 FV-Delegation 第一优先；C2 AuthTrace 第二优先；C4 低风险备选；C5 备选；C3 reserve。

## 阅读顺序

1. `phase4_report.md` — 总报告（摘要、12 候选结局、评价、推荐、限制）。
2. `final_recommendation.md` — 1–2 优先推荐 + 8 问 + 证伪切换。
3. `top_candidates.md` — C1/C2/C4/C5 一页比较。
4. `candidate_evaluation.md` — 八维评分、门槛、Pareto、权重敏感性。
5. `prior_art_review.md` — 最接近工作、技术充分性矩阵、淘汰理由。
6. `candidate_problem_pool.md` — 12 个问题的 13 项字段。
7. `research_proposals/` — C1/C2/C4/C5 的 A–H 方案。
8. `research_roadmap.md` — 8 周计划与 gate。
9. `external_prior_art/` — 外部证据索引与边界。

## 文件

| 文件 | 内容 |
|---|---|
| `phase4_research_plan.md` | 目标、方法、门槛、权重 |
| `candidate_problem_pool.md` | 12 个候选 × 13 字段 |
| `prior_art_review.md` | 最接近工作、充分性矩阵、淘汰 |
| `candidate_evaluation.md` | 八维评分、Pareto、敏感性 |
| `top_candidates.md` | 4 个入选问题比较 |
| `research_proposals/C1_fv_delegation.md` | 形式化验证方案 |
| `research_proposals/C2_authtrace.md` | 授权轨迹证明方案 |
| `research_proposals/C4_chain_complete.md` | 链完整性方案 |
| `research_proposals/C5_rev_hidden.md` | 隐藏撤销方案 |
| `final_recommendation.md` | 第一/第二优先与切换 |
| `research_roadmap.md` | 8 周路线图 |
| `phase4_report.md` | 阶段四总结 |
| `candidate_index.csv/.json` | 机器可读候选索引 |
| `external_prior_art/README.md` | 外部证据边界 |
| `external_prior_art/sources.json` | 52 条来源 |

## 关键边界

- **外部 prior art 多为摘要/片段级**：不能把“摘要说”当“已证明”；开题前全文精读核心工作。
- **没有实验**：C1/C2 的 proof time、攻击成功率、性能都是 `[待验证]`。
- **评分是判断**：八维分数单人评分；创新分依赖 2026-11 检索；需导师/同行复核。
- **不是全领域结论**：只对 12 个候选做范围明确的检查，不声称覆盖整个 Agent Security。
- **F/T/A/H 不是选题理由**：阶段三分数只作为证据；阶段四在问题层独立比较。
