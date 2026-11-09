# 阶段四研究报告：从方向到具体密码学问题

> 日期：2026-11-06
> 范围：在阶段三修正后的 124 篇证据与 H/T/A/F 基础上，完成 12 个具体问题的挖掘、外部 prior art 检查、八维评价、4 个完整方案与 2 个优先推荐。
> 边界：未实现系统、未跑原型、未训练模型；所有“预期结果”均为 `[待验证]`。外部 prior art 多为摘要/片段级，未全文复现。

## 1. 执行摘要

1. **方向层面的通用问题已被 2026 年工作大量覆盖**：跨工具组合授权（CapScope/CoSA/ChainCaps/SARA）、历史相关记忆授权（ResidualAuth/Audience-Bound Memory）、Skill 供应链签名（SIGIL/Chainguard）、MCP registry 透明日志（HISTOR/Sigstore）、MAS 消息认证（BlockA2A/Lineage/WCA）、Agent 身份 attestation（BAID/Ratify）、purpose-bound VC（zkMe/GLEIF）都已有系统/标准/产品。直接做这些方向的“通用版本”创新空间不足。
2. **仍有两个窄缝**：
   - **C1 FV-Delegation**：对 AATs/UCAN/Lineage 一类衰减式委托链做**机器验证**，覆盖恶意子 Agent、链截断、撤销与跨标准组合；AIC/INTERSAGE 相关论文（摘要级）把 UCAN-style attenuation 的 ProVerif/Tamarin 建模列为 future work，Cross-Protocol 论文只覆盖 MCP/A2A/FIPA 翻译。这是“协议组合安全”问题，密码学核心，8 周可做。
   - **C2 AuthTrace**：把“可验证执行”从“模型跑对了”（zkAgent）推进到“整条多步 trace 被委托 DAG 授权”；ERC-8354/CVA/Proof of Claw 主要做单次动作/单次策略 verdict，多步 delegation-DAG 覆盖 + 累计约束 + 选择性披露仍是窄缝。应用密码学价值高，但 zkVM 工程风险高。
3. **最终推荐**：**C1 第一优先，C2 第二优先**。C1 在理论/创新权重下第 1，C2 在应用权重下第 1；两者共享“委托链”问题域，可形成“形式化验证 + 应用证明”的组合，但不要同时启动两个 8 周 MVP。
4. **备选**：C4 ChainComplete（低风险、窄问题，C1/C2 的 fallback）；C5 RevHidden（密码学内容足，但 HBHC/root-scoped 已覆盖核心，创新窗口最窄）；C3 PrivPath 被 C2 Pareto 支配，列为 reserve。
5. **没有直接选 B1 或 R3-80**：B1 是方向不是问题；R3-80 证明 LLM 推理+工具绑定，工程成本高且不证明授权。C1/C2 是从 B1/B4 收敛出的具体问题，经过了现有技术充分性检查。

## 2. 完成了什么

| 任务 | 结果 |
|---|---|
| 候选问题挖掘 | **12 个**具体问题，每个 13 项字段（场景、资产、主体、攻击者、缺陷、已有密码、未覆盖需求、切入点、124 篇证据、价值、难点） |
| 外部 prior art | **52 条**来源（标准/RFC、IETF drafts、arXiv/ePrint、工业实现），存 `external_prior_art/sources.json`；与 124 篇严格分离 |
| 现有技术充分性 | 对签名/HMAC/OAuth/DPoP/UCAN/策略引擎/OS 隔离/TEE/zkVM/透明日志/累加器逐项判定“充分/部分/不足” |
| 淘汰 | **7 个**候选（C6–C12）因现有工作覆盖而淘汰；**1 个**（C3）被 C2 Pareto 支配，列 reserve |
| 八维评价 | C1–C5 原始分、门槛、Pareto、主权重 + 三套敏感性；C1 4.34、C2 4.25、C5 3.82、C4 3.81、C3 3.66 |
| 完整方案 | C1/C2/C4/C5 各一份 A–H 方案（问题、威胁模型、最接近工作、密码方案、MVP、实验、风险、8 周计划） |
| 最终推荐 | C1 第一、C2 第二；C4 低风险备选、C5 备选、C3 reserve |
| 8 周路线图 | C1 主线 + C2 条件并行；4 个 gate（G1–G4）与失败切换 |

## 3. 12 个候选的结局

| ID | 问题 | 方向 | 结局 | 关键理由 |
|---|---|---|---|---|
| C1 | FV-Delegation | B1/B2 | **第一优先** | 机器验证 gap 有外部证据；密码学核心；8 周可行 |
| C2 | AuthTrace | B4/B1 | **第二优先** | 多步 delegation-DAG 覆盖 + 累计约束；应用价值高；zkVM 风险 |
| C3 | PrivPath | B1/C | Reserve | 被 C2 Pareto 支配；DAC 文献压缩创新 |
| C4 | ChainComplete | B1/B4 | 备选 1 | 低风险窄问题；可能被“根签名链长”简化 |
| C5 | RevHidden | B1/B2 | 备选 2 | HBHC/root-scoped 已覆盖核心；累加器增量 |
| C6 | ToolComp | B2/E1 | 淘汰 | CapScope/CoSA/ChainCaps/SARA |
| C7 | MemAuth | B2/F1 | 淘汰 | ResidualAuth/Audience-Bound/AkasicMEM |
| C8 | SkillAttest | E3 | 淘汰 | SIGIL/Formal Analysis/ClosureBound/Chainguard |
| C9 | MCPLog | E1 | 淘汰 | HISTOR/MDPI Registry/Sigstore |
| C10 | MsgProv | G3 | 淘汰 | BlockA2A/Lineage/WCA/SPI-Net |
| C11 | AgentID | B1/G1 | 淘汰 | BAID/Ratify/DCT/Passport |
| C12 | PurposeVC | C1/B2 | 淘汰 | zkMe/Affinidi/GLEIF/Agents++ |

## 4. 评价结果

### 4.1 原始分（C1–C5）

| 候选 | D1 需求 | D2 密码 | D3 理论 | D4 应用 | D5 创新 | D6 可行 | D7 实验 | D8 风险 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| C1 | 4 | 5 | 5 | 3 | 4 | 5 | 5 | 2 |
| C2 | 4 | 5 | 4 | 5 | 4 | 3 | 4 | 4 |
| C3 | 3 | 5 | 4 | 4 | 3 | 3 | 3 | 4 |
| C4 | 3 | 4 | 4 | 4 | 3 | 5 | 4 | 3 |
| C5 | 4 | 5 | 4 | 4 | 2 | 4 | 4 | 3 |

### 4.2 加权与敏感性

| 候选 | 主权重 | 理论导向 | 应用导向 | 创新导向 |
|---|---:|---:|---:|---:|
| C1 | **4.34 (1)** | **4.54 (1)** | 4.24 (2) | **3.66 (1)** |
| C2 | 4.25 (2) | 4.31 (2) | **4.32 (1)** | 3.63 (2) |
| C3 | 3.66 (5) | 3.88 (4) | 3.68 (5) | 3.18 (5) |
| C4 | 3.81 (4) | 3.81 (5) | 4.02 (3) | 3.21 (4) |
| C5 | 3.82 (3) | 3.92 (3) | 3.92 (4) | 3.26 (3) |

**读法**：C1 与 C2 只差 0.09（主权重），不是“显著优于”；C1 偏理论/创新，C2 偏应用。权重敏感性支持“两个都推荐，但按个人偏好/导师方向二选一或组合”。

## 5. 两个优先推荐的核心论证

### 5.1 C1 FV-Delegation

- **问题**：AATs/UCAN/Lineage 等委托链在恶意子 Agent、截断、撤销、跨标准组合下是否授权可靠？
- **密码学**：ProVerif/Tamarin 符号模型；authorization soundness、attenuation monotonicity、chain completeness、revocation soundness、replay/resource binding、sibling isolation。
- **最小实验**：3 Agent/1 Tool Python testbed + ProVerif/Tamarin；攻击脚本；修复后 ASR 0、合法任务不降、验证 <10ms。
- **为什么第一**：密码学核心、8 周可行、gap 有外部证据、风险最低；理论/创新权重下第 1。
- **最大风险**：只找到已知攻击；标准演化。失败切换：C4 或 C2。

### 5.2 C2 AuthTrace

- **问题**：如何证明整条多步工具调用轨迹被 delegation DAG 覆盖、scope 不放大、累计约束满足、撤销有效，同时隐藏敏感参数？
- **密码学**：`TraceAuth` 关系 + zkVM（RISC Zero/SP1）+ 承诺 + 签名收据 + 撤销 witness；soundness/completeness/ZK/binding/revocation soundness。
- **最小实验**：3 Agent/3 Tool/5–10 call；proof time/size；攻击集；与 per-call/zkAgent 对比。
- **为什么第二**：应用密码学价值最高；与 zkAgent（执行）和 ERC-8354/CVA（单动作）差异清晰；但 zkVM 工程风险高。
- **最大风险**：证明太慢/太大；ERC-8354/CVA 扩展到 trace。失败切换：C4 或 C1。

## 6. 已验证 vs 待验证

### 6.1 已验证（本阶段实际完成）

- 124 篇语料与阶段三修正数据：`AUDIT OK`；B1/B4/T/A 结论稳定。
- 12 个候选的语料证据：每个都有 124 篇中最近论文的 ID/页码/笔记章节。
- 外部 prior art 的“存在性/标题/摘要级主张”：通过 WebSearch/WebFetch 核对；来源/URL/日期存 `external_prior_art/sources.json`。
- 现有技术充分性矩阵、淘汰理由、八维评分、权重敏感性：均为本报告实际计算/判断。

### 6.2 待验证（不能写成已成立）

- **C1 的攻击是否真实存在**：目前是假设；需要 ProVerif/Tamarin + testbed 验证。
- **C2 的 zkVM 性能**：没有跑过 5–10 call proof；proof time/size 是估计。
- **C4 的“根签名链长是否足够”**：需要形式化/构造/下界分析。
- **C5 的累加器优势**：需要与状态列表/HBHC 做定量对比。
- **外部 prior art 的全文细节**：多数只到摘要/片段级；AATs/UCAN/CapScope/ResidualAuth/zkAgent/ERC-8354/CVA 需要全文精读。
- **论文可发表性**：没有投稿/评审；venue 判断是初步的。

## 7. 主要限制与不确定性

1. **外部 prior art 的覆盖不完整**：只查了候选问题相关的工作；可能遗漏 2026 年新论文/工业实现。
2. **摘要级证据**：外部论文的定理/实验数字未复现；不能把“摘要说”当“已证明”。
3. **评分主观**：八维分数是单人判断；没有第二评审；创新分高度依赖检索结果。
4. **C1 的“新攻击”不确定**：可能规范已经考虑；需要 4 周 gate。
5. **C2 的工程风险**：zkVM 学习曲线/证明开销可能超出硕士 8 周；需要 1-call gate。
6. **C4/C5 的创新窗口窄**：可能被现有工作覆盖；只作为 fallback。
7. **没有真实 Agent/LLM 实验**：MVP 设计基于脚本化 Agent/工具；真实 LLM 的提示注入/语义问题不在密码学证明范围内。
8. **不能把 124 篇样本热度当全领域热度**：阶段三的边界仍适用。

## 8. 下一步建议

### 8.1 立即（1–2 周）

1. **全文精读**：AATs（S6）、UCAN（S5）、ASOR（S7）、CapScope（P1）、ResidualAuth（P2）、zkAgent（P7）、ERC-8354（S13）、CVA（P40）、Cross-Protocol（P22）。
2. **C1 模型**：ProVerif 单链 + 6 条性质；跑出第一条 trace。
3. **C2 gate（可选）**：RISC Zero 1-call proof；测 proof time/size；若 >60s/10MB，停。
4. **与导师确认**：是否接受“形式化验证/应用密码学”方向；是否有 zkVM/协议合作者。

### 8.2 中期（3–6 周）

- C1：攻击集 + testbed + 修复；G2/G3 gate。
- C2（条件）：5-call trace + 攻击集；G2/G3 gate。
- 若 C1 失败：转 C4；若 C2 失败：转 C4/C1。

### 8.3 长期（7–8 周及以后）

- 技术报告/论文草稿；决定硕士主课题。
- 若做 C1：把模型/攻击/修复整理成安全协议论文；可加 C4 作为链完整性模块。
- 若做 C2：把 TraceAuth + zkVM 原型整理成应用密码学论文；可加 C1 的委托模型作为策略层。

## 9. 文件索引

| 文件 | 内容 |
|---|---|
| `phase4_research_plan.md` | 阶段四目标、方法、门槛、权重、输出 |
| `candidate_problem_pool.md` | 12 个问题 × 13 字段 |
| `external_prior_art/README.md` | 外部证据边界、关键发现、证据等级 |
| `external_prior_art/sources.json` | 52 条来源索引 |
| `prior_art_review.md` | 最接近工作、技术充分性矩阵、淘汰理由、伪交叉 |
| `candidate_evaluation.md` | 八维原始分、门槛、Pareto、权重敏感性 |
| `top_candidates.md` | C1/C2/C4/C5 完整比较 |
| `research_proposals/C1_fv_delegation.md` | C1 A–H 方案 |
| `research_proposals/C2_authtrace.md` | C2 A–H 方案 |
| `research_proposals/C4_chain_complete.md` | C4 A–H 方案 |
| `research_proposals/C5_rev_hidden.md` | C5 A–H 方案 |
| `final_recommendation.md` | 1–2 优先推荐 + 8 问 + 切换 |
| `research_roadmap.md` | 8 周计划 + 4 个 gate |
| `candidate_index.csv/.json` | 机器可读候选索引 |

## 10. 一句话结论

**在 2026 年的 Agent Security 密码学交叉中，“通用委托/撤销/供应链/消息认证”已经被大量工作覆盖；仍值得硕士做的，是把问题收窄到“委托链的机器验证”（C1）或“多步轨迹的授权覆盖证明”（C2）。C1 风险最低、最贴合密码学背景；C2 应用价值最高、但需要 zkVM 工程能力。**
