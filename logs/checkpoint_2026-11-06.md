# 跨会话检查点｜2026-11-06

## 当前状态

- 语料：124 篇固定（R1=15、R2=25、R3=84）；排除 R3-51、R3-78、XX-01–XX-04；无新增、无重做书目。
- 阶段一：124/124 精读（117 QUALITY_CHECKED + 7 FULLY_READ）；2,599/2,945 页；`audit_coverage.js` 曾 `AUDIT OK`。
- 阶段二：Taxonomy v1.1（9 主类、31 叶）；用户已验收；`audit_taxonomy.js` → `AUDIT OK`。
- 阶段三：**六项勘误完成**；`audit_phase3.js` → `AUDIT OK`。
- 阶段四：**分析与选题推荐完成；未实现原型、未跑实验**。

## 阶段三勘误（六项）

1. **A2 H 分项**：`research_activity.md` 的 A2 `V/M/B` 由 4/5/3 改为 **5/5/3**；H=4.5 不变；`direction_scores_full.csv` 增加 V/M/B 列；40 行 H 公式复算通过。
2. **D3 年份**：2025 = R1-10/R2-12/R2-16/R3-04/R3-77；2026 = R1-14/R3-19；新增 `direction_year_matrix.csv`；全 31 叶年度 ID 程序核对。
3. **R1-01 A 分**：A=2→**1**（SoK 只目录化 OAuth/OIDC/TEE/签名，无实际使用）；A1 A_ceiling 2→1；A 分布 91/29/1/2/1/0；Rubric 增加“论及≠应用”最小澄清。
4. **F_master**：9 个一级方向 F 改 **null/空**；31 叶补四子项（密码杠杆 0–2、低 AI/算力 0–1、开放实验 0–1、可定义性 0–1）；31/31 求和通过；F 排行不变；B4 低算力项=0；F≠新颖性写明。
5. **敏感性**：30/30 篇 medium；68 个单项情景 + 1 个全替代边界 + 10,000 次随机；T/A 排行不变；D2 随机 63% 第 1、边界下 H1 第 1；A2/E2/G4 top-tier ≈0.50–0.55；旧“全部 30 篇不影响结论”表述删除。
6. **证据页码**：R3-01/R3-22/R3-24 的 `§10–§11` 补为“笔记章节 + PDF 物理页 + 公式/表号 + 核查范围”；124/124 证据引用含页码与章节。

## 阶段四结论

- 12 个候选：
  - **C1 FV-Delegation**（B1/B2）：委托链形式化验证；第一优先；主权重 4.34；理论/创新导向第 1。
  - **C2 AuthTrace**（B4/B1）：多步 trace 的授权覆盖 zkVM 证明；第二优先；主权重 4.25；应用导向第 1。
  - **C4 ChainComplete**（B1/B4）：链截断抗性；低风险备选；3.81。
  - **C5 RevHidden**（B1/B2）：隐藏撤销列表；备选；3.82；创新弱。
  - **C3 PrivPath**（B1/C）：reserve；被 C2 Pareto 支配；3.66。
  - C6–C12 淘汰：ToolComp、MemAuth、SkillAttest、MCPLog、MsgProv、AgentID、PurposeVC（现有工作覆盖）。
- 外部 prior art：52 条，`research/phase4/external_prior_art/sources.json`；多数摘要/片段级；关键“撞车”工作：CapScope、ResidualAuth、HBHC、Root-scoped、SIGIL、HISTOR、BlockA2A、BAID、zkMe；关键 gap 证据：AIC/INTERSAGE 把 UCAN 衰减链形式化列为 future work；Cross-Protocol 只覆盖翻译路径；zkAgent 不证明授权；ERC-8354/CVA 主要单动作。
- 最终推荐：**C1 第一、C2 第二**；C1 失败转 C4；C2 失败转 C4/C1；不要直接选 B1 方向或 R3-80 单篇。

## 关键文件

- 阶段三：`research/phase3/phase3_errata_report.md`、`phase3_report.md`、`direction_scores_full.csv`、`direction_year_matrix.csv`、`sensitivity_full.json`、`sensitivity_rank_stability.csv`。
- 阶段四：`research/phase4/phase4_report.md`、`final_recommendation.md`、`top_candidates.md`、`candidate_evaluation.md`、`prior_art_review.md`、`candidate_problem_pool.md`、`research_roadmap.md`、`candidate_index.csv/.json`、`research_proposals/C1–C5`、`external_prior_art/`。
- 审计：`node scripts/audit_phase3.js` → `AUDIT OK`；`node scripts/audit_taxonomy.js` → `AUDIT OK`。

## 下一步（下一次会话入口）

1. 读 `research/phase4/phase4_report.md` 与 `final_recommendation.md`。
2. 全文精读（不是摘要）：AATs（IETF draft-niyikiza）、UCAN spec、ASOR draft、CapScope（arXiv:2609.08371）、ResidualAuth（arXiv:2609.08062）、zkAgent（ePrint 2026/199）、ERC-8354、CVA（arXiv:2607.21325）、Cross-Protocol（IS&T 2026）。
3. 执行 C1 的 2 周 gate：6 条性质 + ProVerif 单链模型 + testbed 骨架；若 2 周内无法表达 scope/audience，先修模型。
4. C2 只在 1-call RISC Zero proof <60s、proof <10MB 时并行；否则停。
5. 所有外部 prior art 的“摘要级”结论升级为“全文级”后，才可写入开题报告。

## 纪律提醒

- 124 篇固定；不新增、不重做检索/书目。
- 外部 prior art 不加入 124 篇；不改变阶段三分数。
- 不把“124 篇没看到”写成“没人做过”；不把摘要级证据写成“已证明”。
- 不把“加签名/OAuth/ZKP”当创新；不声称密码学证明 LLM 语义。
- F=5 不代表创新；B1 排名高不代表直接选 B1；R3-80 分高不代表直接复现 zkAgent。
- 8 周 gate 失败就切换，不硬撑；不把未完成阶段标为完成。
