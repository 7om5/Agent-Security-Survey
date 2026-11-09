# 阶段四最终推荐：1–2 个优先研究问题

> 推荐不是“方向标签”，而是可执行的问题。本文明确回答用户要求的 8 个问题，并说明为什么不是直接选 B1 或 R3-80。
> 证据边界：124 篇 `[PDF证据]` + 外部 prior art `[外部 prior art]`；外部材料多为摘要级，未全文复现。

## 0. 结论

| 优先级 | 问题 | 定位 | 推荐理由（一句话） |
|---:|---|---|---|
| **第一优先** | **C1 FV-Delegation** | 理论/形式化，低风险 | 密码学核心、8 周可做、gap 有外部证据、与现有标准直接对话 |
| **第二优先** | **C2 AuthTrace** | 应用密码学/zk，高风险高回报 | 把“可验证执行”推进到“可验证授权覆盖”，应用价值最高 |
| 备选 1 | C4 ChainComplete | 低风险窄问题 | C1/C2 的 fallback，8 周可出结果 |
| 备选 2 | C5 RevHidden | 应用密码学 | 密码学内容足，但 HBHC/root-scoped 已覆盖核心，创新窗口最窄 |
| Reserve | C3 PrivPath | 隐私凭证 | 被 C2 Pareto 支配；若隐私是硬约束可复活 |

**组合建议**：C1 与 C2 共享“委托链”问题域，但方法和产出不同。若只做一个，选 C1；若团队有 zkVM 工程能力/合作者，C1 + C2 可形成“理论验证 + 应用证明”的双论文组合。不要同时启动两个 8 周 MVP；先做 C1 的 4 周 gate，再决定是否并行 C2。

## 1. 第一优先：C1 FV-Delegation

### 1.1 为什么适合当前密码学背景？

- 核心工作是**协议建模、攻击者能力定义、符号证明/反例**，正是密码学本科/研一训练的内容；不需要训练 LLM、不需要 GPU、不需要组内 Agent Security 指导。
- ProVerif/Tamarin 是成熟工具；R1-03 已在本语料中用 ProVerif 验证自家协议，说明该方法在课题组/语料范围内可落地。
- 交付物清晰：模型、攻击轨迹、修复、机器验证；不依赖“跑出一个大系统”。

### 1.2 Agent Security 实际需求是否足够强？

- Agent 委托正在从“一个 Agent 调一个工具”变成“用户→编排 Agent→子 Agent→MCP/A2A 工具”的多跳链；AATs/UCAN/Lineage/ASOR 等标准在 2026 年快速出现。
- 现有标准/实现的核心安全假设是“签名有效 + scope 单调 + 撤销状态”，但**组合协议**是否真的授权可靠，缺少机器验证；一旦有 scope 放大/截断/撤销绕过，就是实际越权。
- 需求不是“再做一个 Agent 应用”，而是“给正在标准化的委托链补安全分析”。

### 1.3 理论/应用密码学价值具体在哪？

- **理论**：定义 authorization soundness、attenuation monotonicity、chain completeness、revocation soundness、sibling isolation；用 correspondence/equivalence 表达；给出攻击轨迹与修复证明。
- **应用**：可直接给 AATs/UCAN/Lineage 的规范/实现提补丁（父哈希、presenter 绑定、audience 绑定、撤销 epoch）；可复现 testbed 验证攻击。
- 不是新原语，但**协议组合安全**是密码学核心问题；比“加签名”更有理论含量。

### 1.4 与现有工作最重要的差异？

- R2-07/R1-03：架构/自家协议；C1 验证**跨标准组合**。
- AATs/UCAN/Lineage：token 格式/衰减规则；C1 问“组合后是否授权可靠”，并给出机器验证。
- Cross-Protocol：MCP/A2A/FIPA 翻译；C1 覆盖 **AATs/UCAN 衰减链本身**。
- SUDP：secret-use delegation；C1 覆盖公开可验证的委托链 + 撤销。
- HBHC/root-scoped：撤销机制；C1 把撤销作为链性质的一部分，而不是单独协议。

### 1.5 最大创新风险？

- 可能只找到规范已经知道的攻击，或模型抽象过强导致攻击不可实现。
- 标准仍在演化；固定 draft 版本可能很快过时。
- 若审稿人认为“形式化验证已有协议”不够新，需要至少一个**非平凡攻击 + 修复**，或一个**不可能性/下界**。

### 1.6 最小实验能否在现有资源下开展？

- 能。ProVerif/Tamarin + Python testbed；3 Agent/1 Tool；笔记本 CPU；无 GPU；无真实 LLM。
- 8 周目标：模型 + 至少 1 个可复现攻击 + 修复 + 小规模实验；不是完整论文。
- 成本主要是人力/学习曲线，不是算力/API。

### 1.7 为什么优于其他候选？

- 相比 C2：风险低、8 周可行、不需要 zkVM 工程；理论/创新权重下第 1。
- 相比 C4：问题更大、理论贡献更高；C4 更像 C1 的一个 property/模块。
- 相比 C5：C5 的核心已被 HBHC/root-scoped 覆盖；C1 的 gap 有外部证据（AIC 论文摘要提到把 UCAN 衰减链形式化列为 future work；需全文复核）。
- 相比 C3：C3 被 C2 Pareto 支配，且 DAC 文献压缩创新空间。

### 1.8 如果主要假设被证伪，切换到哪个备选？

- 若 3 个协议在 6 条性质下全部通过且找不到非平凡攻击 → 转向 **C4 ChainComplete**（把“链完整性”做成形式化 + 构造/下界），或 **C2 AuthTrace**（把重点转到应用证明）。
- 若攻击都依赖 AS 被攻陷 → 转向 transparency/审计（C4 的日志构造）或 C5。
- 若标准演化导致模型失效 → 固定一个稳定 draft（AATs/UCAN），把贡献定位为“方法/工具 + 案例”，而不是“某版本规范的最终结论”。

## 2. 第二优先：C2 AuthTrace

### 2.1 为什么适合当前密码学背景？

- 核心是**承诺、签名、zkVM、安全定义**；密码学背景可以直接用于关系定义、soundness 论证、proof 设计。
- 需要学 Rust/RISC Zero，但不是 LLM 训练；不需要 GPU（zkVM 是 CPU 证明）。
- 与 R3-80 zkAgent 同一问题域，但**不证明 LLM 推理**，只证明授权覆盖，工程成本可控。

### 2.2 Agent Security 实际需求是否足够强？

- Agent 审计/合规需要“这次执行被授权”的证据；现有日志可被删改，zkAgent 只证明执行/工具绑定，不证明授权。
- 多步 trace 的 delegation-DAG 覆盖、累计预算、撤销状态是实际审计问题；对跨组织 Agent 调用尤其重要。
- 需求是“可验证授权”，不是“再做一个 zk demo”。

### 2.3 理论/应用密码学价值具体在哪？

- **理论**：定义 `TraceAuth` 关系、soundness/completeness/zero-knowledge/binding/revocation soundness；给出 zkVM + 承诺 + 签名的组合证明。
- **应用**：RISC Zero/SP1 原型；MCP tool gateway 集成；5–10 call 的 proof 时间/大小数据；可与 zkAgent 对比。
- 把“可验证执行”推进到“可验证授权覆盖”，是应用密码学的实质问题。

### 2.4 与现有工作最重要的差异？

- zkAgent：证明推理+工具绑定；C2 证明**授权覆盖**，不证明推理，成本应低得多。
- ERC-8354：单次动作 verdict；C2 做**多步 trace + delegation DAG + 累计约束**。
- CVA：identity/request/execution binding；C2 把 request binding 扩展为**整条 trace 的 delegation 覆盖**。
- Proof of Claw：单 Agent policy adherence；C2 做**跨 Agent/跨工具**。

### 2.5 最大创新风险？

- zkVM 证明时间/内存可能超预期；5–10 call 可能 >10 分钟。
- ERC-8354/CVA/Proof of Claw 可能快速扩展到 trace，创新窗口窄。
- 策略语言/累计约束在 proof 内表达复杂；若只做“工具白名单”，创新不足。

### 2.6 最小实验能否在现有资源下开展？

- 能，但有风险。RISC Zero/SP1 + Rust；3 Agent/3 Tool/5 call；笔记本/单机 CPU；无 GPU。
- 8 周目标：1 call proof → 5 call proof → 攻击集/性能；若 5 call >10 分钟，降级为 per-call proof + C4 链完整性。
- 需要 Rust/zkVM 学习曲线；建议有工程合作者或先做 2 周 gate。

### 2.7 为什么优于其他候选？

- 应用密码学价值最高（D4=5）；在应用导向权重下第 1。
- 与 zkAgent 的差异清晰：不证明 LLM 推理，只证明授权覆盖，因此可行性和成本更可控。
- 比 C4 更有论文野心；比 C5 创新空间大；比 C3 应用价值高（C3 被 C2 支配）。

### 2.8 如果主要假设被证伪，切换到哪个备选？

- 若 5 call proof >10 分钟或 proof size 不可接受 → 转向 **C4 ChainComplete**（per-call proof + hash chain），或 **C1**（形式化）。
- 若 ERC-8354/CVA 已覆盖 trace + delegation DAG → 转向 **C4** 或 **C1**。
- 若策略语言过于复杂 → 缩小到“工具白名单 + 路径前缀 + 预算”，先做单策略 proof。

## 3. 为什么不是“直接选 B1”或“直接选 R3-80”？

### 3.1 不是直接选 B1

B1 是阶段三的**方向**，不是问题。B1 的 T/A=3 说明“身份/委托”与密码学接近，但：
- B1 只有 2 篇（R2-07、R1-03），且 R2-07 是 Position/架构、R1-03 是自家协议；它们没有回答“标准组合是否安全”。
- 2026 年外部工作（AATs/UCAN/Lineage/CapScope/ResidualAuth/HBHC）已经把“通用委托/衰减/撤销”做得很多；直接做“B1 身份认证”会撞车。
- C1/C2 是从 B1/B4 中**收敛出的具体问题**，并且经过了现有技术充分性检查；不是“因为 B1 排名高就选 B1”。

### 3.2 不是直接选 R3-80/zkAgent

R3-80 是阶段三 T/A 最高的论文（4/4），但：
- 它证明的是 **LLM 推理 + 工具绑定**，证明工程成本高（本地 PDF：GPT-2 512-token 证明 142.45s、0.30 s/token，真实 weather/coding agent 端到端 93–95s；外部 ePrint 版本报告的数字略有差异）；硕士复现/扩展风险大。
- 它**不证明授权覆盖**；C2 选择“不证明 LLM 推理、只证明授权 trace”，正是为了避开 R3-80 的成本，同时补它的缺口。
- 不能因为 R3-80 分数最高，就忽略其单篇证据集中风险与工程成本。

## 4. 推荐置信度与什么会改变结论

**置信度：中高**。
- C1 的 gap 有外部证据（AIC 论文明确把 UCAN 衰减链形式化列为 future work；Cross-Protocol 只覆盖翻译路径），且 8 周可行。
- C2 的创新窗口较窄（ERC-8354/CVA/Proof of Claw），但“多步 trace + delegation DAG + 累计约束”仍有差异；工程风险高。

**会改变推荐的因素**：
1. 若外部全文精读发现 AATs/UCAN 已有完整形式化验证 → C1 创新下降，C2/C4 上升。
2. 若 ERC-8354/CVA 已支持多步 trace + delegation DAG → C2 创新下降，C1/C4 上升。
3. 若研究者有 zkVM/Rust 工程经验 → C2 可行性上升，可与 C1 并列。
4. 若导师要求纯密码学理论/不愿做系统 → C1 更合适；若导师偏应用密码学/工程 → C2。
5. 若 8 周 gate 发现 C1 找不到新攻击 → 立即转 C4，而不是硬撑 C1。

## 5. 下一步最值得做的验证实验

**C1（第 1–2 周）**：
- 选 AATs + UCAN 两个协议，固定版本；写 6 条性质；ProVerif 最小模型（单链、无撤销）；跑出第一条 trace。
- 若 2 周内不能表达“scope 单调 + audience 绑定”，说明模型抽象有问题，先修模型再扩展。

**C2（若启动，第 1–2 周）**：
- RISC Zero 1-call proof：验证一个 Ed25519 token + 一个 scope 子集检查 + 一个 receipt hash；测 proof time/size。
- 若 1 call >60 秒或 proof >10MB，先优化/换 SP1；若仍不可接受，降级 C4。

**共同**：不要先写“完整系统”；先做**可证伪的最小实验**，再决定是否投入 8 周。
