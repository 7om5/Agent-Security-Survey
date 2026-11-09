# 阶段四：4 个入选研究问题的完整比较

> 入选：C1 FV-Delegation、C2 AuthTrace、C4 ChainComplete、C5 RevHidden。
> C3 PrivPath 被 C2 Pareto 支配，列为 reserve；C6–C12 已在 `candidate_evaluation.md` 淘汰。
> 每个问题的完整 A–H 方案见 `research_proposals/`。

## 1. 一页比较

| 维度 | C1 FV-Delegation | C2 AuthTrace | C4 ChainComplete | C5 RevHidden |
|---|---|---|---|---|
| 一句话问题 | 衰减委托链在恶意子 Agent/截断/撤销下是否安全？ | 如何证明整条多步轨迹被委托 DAG 授权？ | 如何证明一条委托链没有隐藏 hop？ | 如何离线验证撤销而不暴露撤销列表/不依赖时钟？ |
| 方向 | B1/B2 | B4/B1 | B1/B4 | B1/B2 |
| 核心密码学 | 符号模型、ProVerif/Tamarin、签名/哈希/状态 | zkVM/zkSNARK、承诺、签名收据、Merkle | 聚合签名、链长/位置承诺、透明日志 | 累加器、非成员证明、epoch/witness |
| 主要资产 | 用户授权范围、撤销状态、责任链 | 授权覆盖、敏感参数、审计证据 | 链完整性、根可见性、撤销传播 | 撤销状态新鲜度、列表隐私、离线可用性 |
| 攻击者 | 恶意 delegatee、串谋、截断、重放 | 恶意 Agent、删改/替换/重放 trace | 恶意 delegatee、尾端伪装、重排 | 被撤销 Agent、陈旧 witness、时钟回拨 |
| 最接近工作 | AATs/UCAN/Lineage/Cross-Protocol/SUDP | zkAgent/ERC-8354/CVA/Proof of Claw | AATs/aggregate signatures/ICISS 2026 | HBHC/root-scoped/status list/accumulators |
| 创新点 | 首个覆盖 AATs/UCAN 组合的机器验证 | 多步 delegation-DAG 覆盖 + 累计约束 + 选择性披露 | 链完整性形式化 + 紧凑证明 + presenter 绑定 | 隐藏列表/无时钟的累加器级联撤销 |
| 主要风险 | 只找到已知攻击；标准演化 | zkVM 工程/性能；CVA/ERC-8354 扩展 | 被简单“根签名链长”解决；ICISS 覆盖 | HBHC/root-scoped 已覆盖核心；创新增量 |
| 8 周 MVP | ProVerif/Tamarin 模型 + 3 Agent testbed | RISC Zero 5–10 call trace proof | Ed25519/BLS 5-hop 链 + 截断攻击 | Rust accumulator + 3 层 DAG |
| 硕士可行性 | **5** | 3 | **5** | 4 |
| 风险 | **2** | 4 | 3 | 3 |
| 主权重 S | **4.34** | 4.25 | 3.81 | 3.82 |
| 推荐 | **第一优先** | **第二优先** | 低风险备选 | 备选（创新弱） |

## 2. C1 FV-Delegation

**为什么值得做**：2026 年 agent delegation 标准（AATs、UCAN、ASOR、Lineage）快速出现，但缺少对“组合协议”的机器验证；AIC/INTERSAGE 相关论文明确把 UCAN-style attenuation 的 ProVerif/Tamarin 建模列为 future work；Cross-Protocol 论文只覆盖 MCP/A2A/FIPA 翻译，不覆盖衰减链。密码学背景可以直接用于协议建模、攻击轨迹、修复与证明。

**最接近工作与差异**：
- R2-07/R1-03 给了架构与自家协议验证；C1 验证**标准组合**，不是再设计一个 SAGA。
- AATs/UCAN 给了 token 格式与衰减规则；C1 问“组合后是否真的授权可靠”，并给出攻击/修复。
- SUDP 给了 secret-use delegation 的形式模型；C1 覆盖**公开可验证的委托链**与撤销。
- Cross-Protocol 给了 MCP/A2A/FIPA 翻译的 ProVerif/Tamarin/TLA+；C1 覆盖 **AATs/UCAN 链本身**。

**最大不确定性**：可能只找到规范已经知道的攻击，或模型抽象过强导致“攻击”不可实现。缓解：先做小模型，再逐步加全局状态/撤销；每个攻击都在 Python/Rust testbed 复现。

**最小实验**：ProVerif 模型 + Tamarin 撤销模型 + 3 Agent/1 Tool 的 Python testbed；攻击脚本（截断、scope 放大、重放、撤销竞争）；修复后攻击成功率 0，合法任务成功率不降，验证延迟 <10ms。

## 3. C2 AuthTrace

**为什么值得做**：zkAgent 证明“模型跑对了 + 工具输出绑定”，但不证明“这次执行被授权”；ERC-8354/CVA/Proof of Claw 主要做单次动作/单次策略 verdict。多步 trace 的 delegation-DAG 覆盖、累计约束、选择性披露仍是窄缝。应用密码学价值高，适合有 zkVM 工程能力的硕士。

**最接近工作与差异**：
- zkAgent：证明推理+工具绑定；C2 不证明 LLM 推理，只证明**授权覆盖**，因此证明成本可低得多。
- ERC-8354：单次动作 ZK policy verdict；C2 做**多步 trace + 委托 DAG + 累计约束**。
- CVA：区分 identity/request/execution binding；C2 把“request binding”扩展为**整条 trace 的 delegation 覆盖**。
- Proof of Claw：单 Agent policy adherence；C2 做**跨 Agent/跨工具**。

**最大不确定性**：zkVM 证明时间/内存；CVA/ERC-8354 可能很快扩展到 trace；策略语言复杂。缓解：先做 3 次调用、单策略、单 DAG；用 RISC Zero/SP1 的 Rust 验证器，不证明 LLM 推理；若 10 次调用 >10 分钟，降级为 per-call proof + hash chain（C4 风格）。

**最小实验**：RISC Zero 证明器 + Rust 验证器；3 Agent/3 Tool/5–10 call；Ed25519 token + SHA-256 承诺；攻击：加未授权调用、删调用、换参数、重放、撤销后使用；指标：soundness（攻击接受 0）、false reject、proof time/size、verify time、泄漏字段。

## 4. C4 ChainComplete

**为什么值得做**：签名有效 ≠ 链完整；AATs/UCAN/aggregate signatures 都承认“哪些 hop 签了”与“所有期望 hop 都在”之间的缺口；W3C 讨论中 truncation 是活跃问题；ICISS 2026 已形式化 purpose-limited secrets 的 truncation，但未覆盖 agent delegation 标准。问题窄、可实现、8 周能出结果。

**最接近工作与差异**：
- AATs 有 chain-position；C4 问“位置声明是否足以证明完整性”，并给出形式定义。
- Aggregate signatures draft 明确不证明期望 hop 集合；C4 补这个缺口。
- ICISS 2026 做 purpose-limited secrets；C4 做**agent delegation 链 + presenter 绑定 + 撤销**。
- 透明日志 checkpoint 能检测日志尾截断；C4 做**无在线日志的链完整性**。

**最大不确定性**：可能“根签名的链长/末端承诺”就足够，导致贡献偏小；需要证明现有标准仍不满足，或给出非平凡下界/构造。缓解：先做形式定义与不可能性/充分性分析；若简单构造足够，转为“标准补丁 + 机器验证”的小论文，或并入 C1。

**最小实验**：Ed25519/BLS 5-hop 链；截断攻击（删中间/尾端/重排/重放）；验证者本地检查；指标：检测率、false accept、proof size、verify time；与 naive 签名链、透明日志 checkpoint 对比。

## 5. C5 RevHidden

**为什么值得做**：离线 Agent 需要撤销验证；HBHC 用心跳+时钟，root-scoped 用证书/前端；状态列表需要联网；累加器可以隐藏列表/离线，但 agent DAG 的级联/新鲜度/性能仍是窄缝。密码学内容足，但创新窗口最窄。

**最接近工作与差异**：
- HBHC：父心跳+本地时钟，49-agent/4 层；C5 去掉可信时钟，用累加器 epoch/witness。
- Root-scoped：长运行 Agent 的静默证书；C5 做**隐藏撤销列表**的轻量验证。
- 状态列表：简单但需联网；C5 做离线/隐私。
- Acar–Nguyen/Begum–Nakanishi/ePrint 2026/832：累加器撤销成熟；C5 做 **agent DAG 级联 + 隐藏列表 + 性能对比**。

**最大不确定性**：HBHC/root-scoped 已覆盖核心；审稿人可能认为“累加器替换状态列表”是增量；无时钟的 freshness 需要额外假设。缓解：把贡献限定为“隐藏撤销列表 + 无时钟 + 级联”的组合，并给出与 HBHC/status list 的定量对比；若没有明显优势，降级为 C4/C1 的附录。

**最小实验**：Rust 累加器（RSA/双线性）+ 3 层 DAG；离线验证者；撤销列表隐藏；攻击：撤销后使用、陈旧 witness、时钟回拨、sibling 串谋；指标：proof size、verify time、update cost、zombie window、隐私泄漏。

## 6. 最终排序（问题层面）

| 排名 | 候选 | 理由 |
|---:|---|---|
| 1 | **C1 FV-Delegation** | 密码学核心、8 周可行、gap 有外部证据、风险最低；理论/创新权重下第 1 |
| 2 | **C2 AuthTrace** | 应用密码学价值最高、与 zkAgent 差异清晰；应用权重下第 1，但工程风险高 |
| 3 | C4 ChainComplete | 低风险、窄问题、可快速验证；适合作为 C1/C2 的 fallback |
| 4 | C5 RevHidden | 密码学内容足，但 HBHC/root-scoped 已覆盖核心；创新窗口最窄 |

> 这不是“C1 一定比 C2 好”，而是“在当前硕士条件与 8 周 MVP 约束下，C1 的风险调整后优先级更高”。若研究者更偏应用密码学/zk 工程，C2 可以作为第一优先；两者共享“委托链”问题域，可以互相迁移。
