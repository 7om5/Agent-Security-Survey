# 阶段四：最接近工作与密码技术充分性检查

> 目的：对候选问题做“是否仍值得解决”的严格检查，而不是寻找支持预设方案的材料。
> 证据：124 篇语料 `[PDF证据]` + `external_prior_art/sources.json` 的外部材料 `[外部 prior art: ID]`。外部材料多为摘要/片段级，未全文精读；具体限制见 `external_prior_art/README.md`。

## 1. C1 FV-Delegation：委托链形式化验证

### 1.1 最接近工作

| 工作 | 已解决 | 未解决 | 证据性质 |
|---|---|---|---|
| R2-07 Authenticated Delegation（语料） | OAuth/OIDC/VC 的委托架构、scope/audience/撤销/审计接口 | 无形式化安全定义、无协议验证、无攻击实验 | `[PDF证据]` 笔记 §5–§9 |
| R1-03 SAGA（语料） | X25519/OTK/X.509 + 访问 token + ProVerif 验证自家协议 | 只验证 SAGA 自身；不覆盖 AATs/UCAN/Lineage；Provider 强信任 | `[PDF证据]` 笔记 §5–§9 |
| AATs（IETF draft-niyikiza） | 工具级 capability、离线衰减、holder PoP、chain position | 规范级安全分析；恶意 delegatee/截断/撤销组合 | `[外部 prior art: S6]` |
| UCAN spec | delegation/attenuation/invocation/revocation；DID | 无 confinement guarantee；无机器验证的完整协议模型 | `[外部 prior art: S5]` |
| Lineage（IEEE 2026） | UMA 2.0 扩展；HMAC 链头；scope 单调；深度限制；审计 | 形式化模型/攻击者能力；跨标准组合 | `[外部 prior art: P20]` |
| Cross-Protocol Attack Surface Analysis（2026） | ProVerif/Tamarin/TLA+ 分析 MCP/A2A/FIPA 翻译；87 属性，10 违反 | 不覆盖 AATs/UCAN 的衰减链；不覆盖撤销新鲜度 | `[外部 prior art: P22]` |
| SUDP（arXiv:2604.24920） | secret-use delegation 的形式模型与定理 | 不是标准衰减链；不覆盖 OAuth/UCAN 组合 | `[外部 prior art: P9]` |
| HBHC / Root-scoped（2026） | 离线级联撤销 / 长运行 Agent 的根作用域静默 | 不是“链的授权可靠性”形式化；不覆盖 scope 放大/截断 | `[外部 prior art: P3/P4]` |

### 1.2 已有技术充分性

- **普通签名/MAC**：只能保证单个 token 不可伪造；不能保证**组合链**的授权可靠性、单调性、截断抗性。
- **OAuth 2.0/OIDC + RAR + Token Exchange + DPoP**：能表达 scope/audience/actor/持有者绑定；但跨标准组合（OAuth + UCAN/AATs + A2A header）的语义没有统一形式模型。
- **Macaroon/Biscuit/UCAN**：能做衰减；但“衰减规则”与“验证者如何检查完整链/撤销”仍是协议层问题。
- **策略引擎/OS 隔离**：能执行策略，但不能证明“这条链确实来自根授权者且没有放大”。
- **TEE/zkVM**：能证明“某段代码运行过”，不能替代协议级符号分析。

**结论**：不是“再加一个签名”能解决；需要**协议组合的形式化模型 + 攻击者能力定义 + 机器验证**。C1 通过 G2/G3。

### 1.3 仍未解决的核心

1. 跨标准组合的授权不变量（OAuth token exchange 的 `act` 链 + AATs chain position + A2A header）。
2. 恶意 delegatee 的链截断/尾端伪装。
3. 撤销在多跳、缓存、离线子 Agent 下的传播与新鲜度。
4. audience/resource 混淆与 sibling token 混用。
5. 这些性质能否用 ProVerif/Tamarin 的 correspondence/equivalence 表达，并给出可复现攻击轨迹。

### 1.4 外部证据支持的 gap

- AATs/UCAN 的**衰减链**缺少完整符号验证；AIC/INTERSAGE 相关论文（摘要/片段级）把 UCAN-style attenuation chains 的 ProVerif/Tamarin 建模列为 future work（`[外部 prior art: P39]`，见 sources 补充；未全文核实）。
- Cross-Protocol 论文只覆盖 MCP/A2A/FIPA 翻译，不覆盖 AATs/UCAN 链（`[外部 prior art: P22]`）。
- IETF aggregate signatures draft 明确承认“证明哪些 hop 签了，不证明所有期望 hop 都在”（`[外部 prior art: S8]`），说明链完整性问题在标准层仍未闭合。

## 2. C2 AuthTrace：授权感知的多步轨迹证明

### 2.1 最接近工作

| 工作 | 已解决 | 未解决 | 证据性质 |
|---|---|---|---|
| R3-80 zkAgent（语料） | 完整 LLM 推理 + 工具绑定（zkTLS/zkVM）的 one-shot transcript proof | 不证明授权覆盖；不证明 delegation DAG；不证明累计约束 | `[PDF证据]` 笔记 §5–§9；`[外部 prior art: P7]` |
| ERC-8354 Confidential Agent Policy Verdicts | 单次动作的 ZK policy verdict；policy root；nullifier | 多步 trace；delegation 链覆盖；累计约束；选择性披露 | `[外部 prior art: S13]` |
| CVA / ZK authorization（arXiv:2607.21325） | 区分 identity/request/execution binding；指出“证明授权 ≠ 证明执行” | 多步 trace 的 delegation-DAG 覆盖；累计约束；proof composition | `[外部 prior art: P40]` |
| Proof of Claw | RISC Zero zkVM policy-adherence proof；value threshold | 多步 trace；delegation 链；跨工具；选择性披露 | `[外部 prior art: P37]` |
| BAID | zkVM+zkTLS 身份与配置 proof；递归执行 proof | 授权覆盖；多步 trace；累计约束 | `[外部 prior art: P8]` |
| R1-03/R2-07 | 委托 token/架构 | 无可验证执行；无 trace proof | `[PDF证据]` 笔记 §5–§9 |

### 2.2 已有技术充分性

- **zkVM/zkSNARK**：能证明“验证器程序在输入上返回 accept”；但**验证器程序**（授权关系）必须由我们定义。zkAgent 证明的是推理+工具绑定，不是授权。
- **签名收据 + Merkle 链**：能保证工具响应来源与日志完整性；不能证明“每次调用都被授权”。
- **ERC-8354/CVA/Proof of Claw**：单次动作/单次策略 verdict 已覆盖；多步 trace + delegation DAG + 累计约束仍是窄缝。
- **TEE**：可替代 zkVM 做执行证明，但信任 TEE 厂商/侧信道；且同样不定义授权语义。

**结论**：C2 不是“用 zk 证明 LLM 输出正确”，而是“用 zk 证明一条 trace 的授权覆盖关系”。现有工作没有完整覆盖；但创新窗口窄，必须明确与 ERC-8354/CVA/Proof of Claw 的差异。

### 2.3 仍未解决的核心

1. 多步 trace 的 delegation-DAG 路径存在性（不是单 token 验证）。
2. 每步 scope 单调 + 累计预算/次数约束。
3. 撤销新鲜度与 trace 的时间绑定。
4. 选择性披露参数（隐藏 PII）同时证明策略合规。
5. proof composition：per-call proof 聚合成 trace proof 的 soundness。
6. 证明开销是否可接受（10 次调用 < 5 分钟）。

### 2.4 关键区分（防止夸大）

- 证明的是**声明的策略/委托关系**被满足，不是 LLM 理解了用户意图。
- 证明的是**计算完整性**，不是工具输出语义正确。
- 证明的是**授权覆盖**，不是“这次行动在业务上正确”。

## 3. C3 PrivPath：隐私保护的多跳委托路径

### 3.1 最接近工作

| 工作 | 已解决 | 未解决 | 证据性质 |
|---|---|---|---|
| Delegatable Anonymous Credentials（Belenkiy et al. 2009；Acar–Nguyen PKC 2011） | 多跳匿名委托、non-membership/revocation | Agent 工具 scope 语义；MCP/A2A 集成；撤销新鲜度 | `[外部 prior art: P23]` |
| Revocable DAC with accumulator（Begum–Nakanishi 2022） | 单累加器/epoch 的撤销 | Agent 场景；路径隐藏与工具绑定 | `[外部 prior art: P24]` |
| BBS+ VC / SD-JWT | 选择性披露、签名凭证 | 多跳路径存在性 + scope 衰减 + 撤销的组合 | 通用密码学（未单列来源） |
| zkMe Agent-Ready Credentials | Agent DID + scope/TTL + ZK in TEE | 多跳匿名路径；离线撤销；公开可验证 | `[外部 prior art: P34]` |
| UCAN/AATs | 公开链、衰减 | 不隐藏中间 hop/scope | `[外部 prior art: S5/S6]` |

### 3.2 已有技术充分性

- **BBS+/PS 签名 + ZK**：足以构建“隐藏属性、证明谓词”的凭证。
- **Delegatable anonymous credentials**：已解决多跳匿名与撤销的理论问题；纯密码学新意有限。
- **Agent-specific 差异**：工具 scope、MCP/A2A audience、撤销新鲜度、可追责性；这些是应用层，不是新原语。

**结论**：C3 的密码学必要性高，但**创新空间受 DAC 文献压缩**；需要把贡献定位为“agent 工具语义 + 可部署协议 + 撤销/追责”，而不是“新的匿名凭证”。

### 3.3 仍未解决的核心

1. 路径存在性证明与 scope 子集证明的组合。
2. 中间 hop 匿名但可追责（可选 escrow/门限）。
3. 撤销不泄露身份；离线/新鲜度。
4. 与 MCP/A2A 的 audience/tool scope 绑定。
5. 性能：3–5 hop 的 proof 大小/验证时间。

## 4. C4 ChainComplete：委托链截断抗性

### 4.1 最接近工作

| 工作 | 已解决 | 未解决 | 证据性质 |
|---|---|---|---|
| AATs chain-position claim | 链位置/离线衰减 | 完整性证明；presenter 绑定；撤销 | `[外部 prior art: S6]` |
| UCAN invocation | 链到 presenter | 截断/尾端伪装；审计完整性 | `[外部 prior art: S5]` |
| Aggregate signatures draft | 聚合签名；哪些 hop 签了 | 明确承认不证明所有期望 hop 都在 | `[外部 prior art: S8]` |
| ICISS 2026 Purpose-Limited Secrets | 形式化 truncation attack；EUF-CMA/CR reduction | Agent delegation 标准；紧凑实现；撤销 | `[外部 prior art: P28]` |
| W3C public-credentials thread | 讨论 truncation/chain-of-custody | 无统一形式定义/实现 | `[外部 prior art: S14]` |
| 透明日志 checkpoint | 日志完整性/尾截断检测 | 委托链完整性；presenter 绑定 | 通用机制 |

### 4.2 已有技术充分性

- **父哈希 + 根签名链长/位置**：可能足以阻止简单截断；需要形式证明。
- **聚合签名**：能压缩多跳签名，但不证明“期望 hop 集合”完整。
- **透明日志**：能检测日志尾截断，但需要在线/checkpoint，且不绑定 presenter。

**结论**：C4 有明确形式问题；但可能被“根签名的链长承诺”简单解决，创新空间取决于能否证明现有标准仍不满足，并给出非平凡构造/下界。

### 4.3 仍未解决的核心

1. 链完整性的形式定义（相对“期望 hop 集合”还是“根到 presenter 的所有 hop”）。
2. 无在线日志的紧凑完整性证明。
3. presenter 绑定与尾端伪装。
4. 与撤销状态、audience 的结合。
5. 与 ICISS 2026 的差异化（agent delegation vs purpose-limited secrets）。

## 5. C5 RevHidden：隐藏撤销列表的离线撤销

### 5.1 最接近工作

| 工作 | 已解决 | 未解决 | 证据性质 |
|---|---|---|---|
| HBHC（arXiv:2605.20704） | 父心跳 + 本地时钟的离线级联撤销；49-agent/4 层；0.26ms | 隐藏撤销列表；无可信时钟；累加器对比 | `[外部 prior art: P3]` |
| Root-scoped quiescence（arXiv:2609.21284） | 长运行 Agent 的根作用域静默证书；异步执行；proofs | 隐藏撤销；DAG 累加器；轻量实现 | `[外部 prior art: P4]` |
| IETF status list（AATs/ASOR） | 离线验证 + 短 TTL 状态 | 隐藏列表；无时钟；级联 | `[外部 prior art: S6/S7]` |
| Acar–Nguyen PKC 2011 | delegatable non-membership proofs | Agent DAG；隐藏列表；性能 | `[外部 prior art: P23]` |
| ePrint 2026/832 / 1824 | 累加器 delegated proof updates；revocation framework | Agent 场景；级联；无时钟 | `[外部 prior art: P25/P26]` |
| ALLOSAUR | 低延迟 accumulator updates | Agent DAG；隐藏列表 | `[外部 prior art: P27]` |

### 5.2 已有技术充分性

- **状态列表/短 TTL**：工程简单，但需要联网/新鲜度。
- **HBHC**：已解决离线级联撤销的核心问题（心跳+时钟）。
- **累加器**：离线非成员证明成熟；但“无时钟”仍需某种 epoch/更新假设。
- **隐藏撤销列表**：可用 ZK/累加器；但与 agent DAG/级联的组合是窄缝。

**结论**：C5 的核心已被 HBHC/root-scoped 覆盖；只剩“隐藏列表 + 无时钟 + 累加器”窄变体。创新空间最低，作为备选。

## 6. 已有技术充分性矩阵

| 机制 | C1 FV | C2 AuthTrace | C3 PrivPath | C4 ChainComplete | C5 RevHidden |
|---|---|---|---|---|---|
| 普通数字签名 | 部分（对象） | 部分（收据） | 部分（凭证） | 部分（链） | 部分（token） |
| HMAC/MAC | 部分（对称链） | 部分（收据） | 不适用（需公开验证） | 部分（父链） | 部分（状态） |
| OAuth 2.0/OIDC | 部分（scope/audience） | 部分（token） | 部分（scope） | 部分（链） | 部分（状态） |
| DPoP/mTLS | 部分（持有者绑定） | 部分（通道） | 部分（持有者） | 部分（presenter） | 部分（通道） |
| Macaroon/Biscuit/UCAN | 部分（衰减） | 部分（token） | 部分（公开链） | 部分（链） | 部分（caveat） |
| 策略引擎 | 部分（执行） | 部分（策略） | 不适用 | 不适用 | 不适用 |
| OS 隔离/Reference Monitor | 不足 | 不足 | 不足 | 不足 | 不足 |
| TEE/远程证明 | 部分（执行） | 部分（执行） | 部分（密钥保护） | 部分（presenter） | 部分（状态） |
| zkVM/zkSNARK | 部分（协议证明） | **核心** | **核心** | 部分（链证明） | 部分（非成员） |
| 透明日志 | 部分（审计） | 部分（trace） | 部分（撤销） | 部分（完整性） | 部分（状态） |
| 累加器 | 不适用 | 不适用 | 部分（撤销） | 不适用 | **核心但成熟** |

**读法**：“部分”= 能解决一个构件，但不能单独满足候选的完整安全目标；“核心”= 候选必须使用，但仍需新的关系定义/协议。

## 7. C6–C12 淘汰理由（简表）

| 候选 | 最接近工作 | 淘汰理由 |
|---|---|---|
| C6 ToolComp | CapScope（P1）、CoSA（P13）、SCR（P14 相关）、ChainCaps（P15）、SARA（P16） | per-agent capability store、derive 非放大、value-level budgets、runtime authorization 都已实现/评测；再做同类系统工作创新不足 |
| C7 MemAuth | ResidualAuth（P2）、Audience-Bound Memory（P17）、AkasicMEM（P18）、NeurIPS 2026 laundering（P38） | 历史相关授权状态已被形式化；记忆生命周期授权已有系统；密码学增量小 |
| C8 SkillAttest | SIGIL（P10）、Formal Analysis（P11）、ClosureBound（P12）、Chainguard（P33） | 签名+manifest+runtime loader 已被覆盖；剩余是语义行为检测，不是密码学 |
| C9 MCPLog | HISTOR（P31）、MDPI Registry（P32）、MCP Security IG | 透明日志已部署/有蓝图；通用方案无硕士创新空间 |
| C10 MsgProv | BlockA2A（P19）、Lineage（P20）、WCA（S10）、SPI-Net（P21）、Segurai | signed envelope/provenance/non-repudiation 是 commodity；语义串谋超出密码学 |
| C11 AgentID | BAID（P8）、Ratify（P30）、DCT（P29）、Passport Alliance | 分层身份+配置 attestation 已被覆盖 |
| C12 PurposeVC | zkMe（P34）、Affinidi（P35）、GLEIF AMC（P36）、Agents++ | purpose-bound VC + 选择性披露已产品化；纯密码学新意低 |

## 8. 负面结果与伪交叉

1. **“给日志签名”**：只证明日志未被改，不证明日志内容/授权正确；不能作为 C1–C5 的核心贡献。
2. **“用 TEE 跑 Agent”**：保护执行环境，不证明授权链/策略正确；且引入厂商信任。
3. **“用 ZK 证明 LLM 输出正确”**：证明计算完整性，不证明语义正确；C2 明确不证明 LLM 理解。
4. **“用 OAuth scope 表达任务”**：scope 是字符串/结构化声明，不能证明任务语义；C1 只验证声明链，不验证自然语言意图。
5. **“用累加器替换状态列表”**：若没有隐藏列表/无时钟/级联的明确优势，只是工程替换；C5 风险最高。
6. **“多 Agent 消息签名”**：签名认证发送者，不阻止被攻陷的合法发送者或语义串谋；C10 淘汰。

## 9. 需要全文复核的外部工作

进入开题前，至少全文精读：
- AATs draft（S6）、UCAN spec（S5）、ASOR draft（S7）；
- CapScope（P1）、ResidualAuth（P2）、HBHC（P3）、Root-scoped（P4）；
- zkAgent（P7）、ERC-8354（S13）、CVA（P40）、Proof of Claw（P37）；
- Cross-Protocol formal analysis（P22）、SUDP（P9）；
- Acar–Nguyen（P23）、Begum–Nakanishi（P24）、ePrint 2026/832（P25）。

本阶段对这些材料的引用只到“摘要/片段级”，不能写成“已复现其定理/实验”。
