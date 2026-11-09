# C2 研究方案｜AuthTrace：授权感知的多步 Agent 轨迹证明

> 状态：`[推断]/[待验证]` 研究计划；未实现、未跑实验。
> 方向：B4 策略审计与可验证执行；B1/B2 委托/授权。
> 一句话：用 zkVM 证明“整条多步工具调用轨迹都被一条委托 DAG 覆盖、scope 不放大、累计约束满足、撤销状态有效”，同时隐藏敏感参数；验证者不需要信任 Agent 运行时。

## A. 研究问题

**具体缺陷**：Agent 执行多步工具调用后，审计方/资源方通常只看到日志。日志可能被 Agent 删改；即使日志完整，也无法确认：
1. 每次调用是否真的被用户授权（delegation path 存在）；
2. 每步 scope 是否单调不放大；
3. 累计预算/次数/数据流约束是否满足；
4. 调用后 token 是否被撤销；
5. 敏感参数能否只向验证者披露必要部分。

**研究问题**：定义 `TraceAuth` 关系与安全性质；设计一个 zkVM 证明系统，证明一条提交的 trace 满足委托 DAG 覆盖、scope 单调、累计约束、撤销有效性；实现 5–10 次调用的原型，测量证明/验证开销，并与无证明、单动作 proof、zkAgent 风格执行 proof 对比。

**贡献形式**：安全定义 + 关系/策略语言 + zkVM 证明系统 + 原型 + 实验；不证明 LLM 推理，不证明自然语言语义。

## B. 系统与威胁模型

### B.1 主体与信任边界

```text
User U (root key, policy commitment)
  |
  v
Orchestrator A0 --delegates--> A1 --delegates--> A2
  |                              |                 |
  | tool call 1                  | tool call 2     | tool call 3
  v                              v                 v
Tool T1 (signed receipt)     Tool T2 (receipt)  Tool T3 (receipt)
  \___________________________ trace commitment ___________________/
                                   |
                                   v
                         Prover P (agent runtime)
                                   |
                                   v  proof π
                         Verifier V (auditor/resource)
```

- **U**：根授权者；签发 delegation token / policy commitment；可信。
- **A0/A1/A2**：Agent；可能恶意/被注入；持有合法 token；生成 trace。
- **T1–T3**：工具/资源服务器；对响应签名（receipt）；半可信。
- **P**：证明者；通常就是 Agent 运行时；不可信，但必须生成有效 proof。
- **V**：验证者；只信任公共参数、根公钥、proof；可离线。
- **Revocation Service**：提供 epoch/status；诚实但可能离线；V 使用本地缓存 + bounded staleness。

### B.2 攻击者能力

- 恶意 Agent/证明者：持有合法但受限的 delegation token；可删改 trace、替换参数、加入未授权调用、省略调用、重放到另一 nonce、使用已撤销 token、与子 Agent 串谋；不能攻破 zkVM soundness/承诺 binding/签名。
- 恶意工具：返回错误/伪造 receipt；但 receipt 签名限制为工具密钥；工具被攻陷是另一个信任问题。
- 验证者好奇：只能看到 proof + 公共输入；不应学到未披露参数。
- 网络攻击者：可重放 proof；用 nonce/domain separation 阻止。

### B.3 信任假设

- zkVM 的 soundness（计算完整性）成立；承诺方案 binding；签名 EUF-CMA；哈希抗碰撞。
- 根公钥/工具公钥真实；撤销服务最终可达或有 freshness 窗口。
- **不假设** Agent 运行时可信；**不假设** LLM 输出语义正确。
- 策略/委托 token 的语义由 U 签名承诺；V 只检查“声明的关系”，不检查“U 的真实意图”。

## C. 最接近现有工作

| 工作 | 已解决 | 尚未解决 | 证据 |
|---|---|---|---|
| R3-80 zkAgent（语料） | 完整 LLM 推理 + 工具绑定（zkTLS/zkVM）的 one-shot transcript proof | 不证明授权覆盖/delegation DAG/累计约束 | `[PDF证据]` 笔记 §5–§9；`[外部 prior art: P7]` |
| ERC-8354 | 单次动作 ZK policy verdict；policy root；nullifier | 多步 trace；delegation 链；累计约束；选择性披露 | `[外部 prior art: S13]` |
| CVA / ZK authorization（arXiv:2607.21325） | identity/request/execution binding；指出“证明授权 ≠ 证明执行” | 多步 trace 的 delegation-DAG 覆盖；累计约束；proof composition | `[外部 prior art: P40]` |
| Proof of Claw | RISC Zero zkVM policy-adherence proof；value threshold | 多步 trace；delegation 链；跨工具；选择性披露 | `[外部 prior art: P37]` |
| BAID | zkVM+zkTLS 身份/配置/执行 proof | 授权覆盖；多步 trace；累计约束 | `[外部 prior art: P8]` |
| R1-03/R2-07（语料） | 委托 token/架构 | 无可验证执行；无 trace proof | `[PDF证据]` 笔记 §5–§9 |

**已承认的不足**：
- zkAgent 证明的是执行/工具绑定，不是授权（`[外部 prior art: P7]`）。
- CVA 明确指出“proof of authorization ≠ proof of execution”（`[外部 prior art: P40]`，摘要级）。
- ERC-8354 是单次动作 verdict，不是多步 trace（`[外部 prior art: S13]`）。

**我们的假设（待验证）**：
- 多步 trace 的 delegation-DAG 覆盖可以用 zkVM 在 10 次调用内证明，且成本远低于证明 LLM 推理。
- 现有单动作/执行 proof 不能直接组合出 trace 级授权 soundness。
- 选择性披露 + 累计约束可以在同一个 proof 中完成。

## D. 密码学技术方案

### D.1 `TraceAuth` 关系

公共输入：
```text
pp = (root_pk, policy_commit, trace_commit, revocation_epoch, verifier_nonce)
```
私有 witness：
```text
w = (delegation_tokens, per_call_scopes, tool_receipts,
     merkle_paths, arguments, salts, revocation_witness)
```
关系 `R(pp, w)=1` 当且仅当：
1. **路径覆盖**：对每个 call i，存在一条从 root 到 caller 的签名链，链上每跳 `scope_child ⊆ scope_parent`，且 call 的 scope 被末端 token 覆盖。
2. **trace 绑定**：`trace_commit = H(seq_no, caller, tool_id, H(args||salt), H(receipt), prev_hash)` 对每个 call 成立；顺序绑定。
3. **累计约束**：`sum(cost_i) ≤ budget`、`count_i ≤ limit`、数据流标签不违反策略（可选）。
4. **撤销有效**：每个 token 的 revocation epoch 满足 `epoch_i ≥ min_epoch`；非成员证明/状态列表有效。
5. **presenter/audience**：call 的 audience/resource 与 token 匹配；presenter 公钥绑定。
6. **无未授权调用**：trace 中每个 call 都在上述覆盖内；没有“省略的 call”（trace commitment 绑定完整序列）。

### D.2 证明系统

- **zkVM**：RISC Zero 或 SP1；用 Rust 写验证器程序 `verify_trace(pp, w) -> accept/reject`；zkVM 证明程序执行正确。
- **签名**：Ed25519/secp256k1；如果 in-circuit 验证太慢，评估 BLS 聚合签名或 hash-based credential；不能把签名验证完全移出 proof，否则 soundness 丢失。
- **承诺**：SHA-256/Poseidon（视 zkVM 友好性）；trace commitment + policy commitment + args commitments。
- **撤销**：Merkle/accumulator witness；public epoch；proof 内检查非成员/状态。
- **递归/聚合（可选）**：per-call proof + recursive aggregation；或单次 zkVM 执行整个 trace。
- **零知识**：zkVM 默认隐藏 witness；公共输出只包含 accept + 必要字段（如总花费区间），不输出参数明文。

### D.3 安全定义

| 性质 | 定义（示意） |
|---|---|
| **Soundness** | 对任意 PPT 敌手，若其输出 `(pp, π)` 使 V 接受，则以压倒性概率存在 witness w 使 `R(pp,w)=1`。 |
| **Completeness** | 若存在合法 w，诚实 prover 能生成 V 接受的 π。 |
| **Zero-knowledge** | 存在模拟器，仅用 pp 和公共输出即可模拟 π；不泄露 args/tokens。 |
| **Binding** | trace_commit 绑定唯一 trace；不能替换 call/参数/顺序。 |
| **Revocation soundness** | 若 token 在 epoch 被撤销，则不存在接受 proof（在 freshness 窗口内）。 |
| **Policy soundness** | 接受的 proof 只说明“声明的 policy 被满足”，不说明 policy 与用户真实意图一致。 |

证明方法：zkVM soundness + 承诺 binding + 签名 EUF-CMA 的组合；给出 reduction sketch（不是完整形式化证明，硕士论文可做 game-based 定义 + 论证）。

### D.4 与 Agent 系统集成

- **Tool Gateway/MCP proxy**：每次工具调用返回 signed receipt（工具 ID、输入哈希、输出哈希、时间、nonce）。
- **Agent runtime**：收集 receipts + delegation tokens；生成 proof；把 `pp, π` 发给审计方/资源方。
- **Verifier**：检查 proof + 公共输入；不需要重放 Agent。
- **策略编译**：U 把任务策略编译成 `policy_commit`；Agent 不能修改；V 可验证策略哈希。

### D.5 边界（必须写清）

- 不证明 LLM 推理正确；不证明工具输出语义正确；不证明“用户真实意图”。
- 只证明“trace 满足声明的 delegation/scope/累计/撤销关系”。
- 若 policy 本身写错，proof 仍然“正确”；这是策略正确性问题，不是密码学问题。

## E. 最小可行原型

### E.1 组件

- **zkVM**：RISC Zero（Rust）或 SP1；优先 RISC Zero（生态成熟、Rust 友好）。
- **Agent harness**：Python 脚本模拟 3 个 Agent；通过 subprocess/HTTP 调用 Rust prover。
- **工具**：3 个本地 FastAPI 工具（读文件、查数据库、发邮件）；返回 Ed25519 signed receipt。
- **Token**：Ed25519 delegation token（CBOR/JWT）；scope JSON；parent_hash。
- **承诺**：SHA-256；可选 Poseidon（若 zkVM 友好）。
- **环境**：笔记本/单机 CPU；不需要 GPU；RISC Zero 需要 Rust toolchain。

### E.2 最小范围

- 1 个用户、3 个 Agent、3 个工具、5–10 次调用。
- 1 条 delegation DAG：U→A0→A1/A2。
- 1 个策略：工具白名单 + 路径前缀 + 最大总花费 + 最大调用次数。
- 1 个撤销场景：撤销 A1 后，A2 的后续调用不能证明。
- 1 个选择性披露场景：隐藏 email 地址/文件名，只证明“在允许前缀内”。

### E.3 验证目标

1. 5 次调用 proof 生成 <5 分钟（目标），验证 <100ms；10 次调用 <10 分钟。
2. 未授权 trace（加调用/删调用/换参数/撤销后）无法生成接受 proof。
3. 合法 trace 可以生成 proof；false reject 低。
4. 选择性披露：验证者只看到允许字段/谓词，不看到明文。

## F. 安全与性能实验

### F.1 对照

- **无防护基线**：Agent 自报日志，验证者信任日志。
- **成熟技术基线**：per-call ERC-8354 风格 proof（单动作 policy verdict）+ hash chain；或 zkAgent 风格执行 proof（若可复现）。
- **提出方案**：TraceAuth 单 proof / 递归聚合。

### F.2 攻击测试

| 攻击 | 期望（无防护） | 期望（TraceAuth） |
|---|---|---|
| 加入未授权调用 | 接受 | 拒绝 |
| 省略一次调用 | 接受 | 拒绝（trace binding） |
| 替换参数（收款账号/文件名） | 接受 | 拒绝（commitment） |
| 重放到另一 nonce/资源 | 接受 | 拒绝（domain separation） |
| 撤销后继续使用 | 接受 | 拒绝（revocation witness） |
| 子 Agent 串谋扩大 scope | 接受 | 拒绝（scope 单调） |
| 合法任务 | 接受 | 接受（false reject 低） |

### F.3 指标

- **安全性**：攻击接受率（目标 0）、false reject rate。
- **性能**：proof time、proof size、verify time、memory；5/10/20 call 扩展。
- **隐私**：验证者可见字段数；模拟器/泄漏检查（定性）。
- **对比**：与 per-call proof 的总 proof 时间/大小；与 zkAgent 的执行 proof 成本（若数据可得）。

### F.4 统计

- 每个场景 ≥20 次；报告均值/标准差；不同 call 数/链长。
- 不把“单次运行”当性能结论；报告硬件/工具版本。

## G. 风险与失败条件

| 风险 | 严重度 | 缓解/失败条件 |
|---|---:|---|
| zkVM 证明太慢/太大 | 高 | 先做 1 call；用 RISC Zero/SP1 优化；若 5 call >10 分钟，降级为 per-call proof + C4 链完整性 |
| 签名 in-circuit 太贵 | 高 | 评估 BLS/聚合签名；或把签名验证放到 proof 外的“收据”层，但仍需绑定（可能损失 soundness） |
| ERC-8354/CVA 快速扩展到 trace | 高 | 强调 delegation-DAG + 累计约束 + 选择性披露的组合；持续跟踪 |
| 策略语言过复杂 | 中 | 限制为工具白名单/路径前缀/预算/次数；不做通用策略 |
| 没有真实部署 | 中 | 用本地 MCP/FastAPI 模拟；明确“原型”边界 |
| 证明只覆盖声明策略 | 中 | 在论文中明确“不证明语义/意图”；避免夸大 |

**证伪条件**：
- 若 5 次调用 proof >10 分钟，或 proof size >100MB → MVP 不成立；转向 C4（链完整性）或 C1（形式化）。
- 若 ERC-8354/CVA 已覆盖多步 trace + delegation DAG → 创新失败；转向 C4/C1。
- 若无法在 proof 内验证签名而不泄露/损失 soundness → 重新设计为“收据 + 链完整性”方案。

## H. 8 周推进计划

| 周 | 任务 | 产出/验收 |
|---|---|---|
| 1–2 | 定义 `TraceAuth` 关系/策略；Rust 验证器；RISC Zero 1-call proof | 1-call proof 可生成/验证；关系文档 |
| 3–4 | 扩展到 5–10 call；delegation DAG；撤销 witness；benchmark | proof time/size 数据；合法/非法 trace 测试 |
| 5–6 | 选择性披露；攻击集；per-call/zkAgent 对照；优化 | 攻击接受率 0；性能对比 |
| 7–8 | 扩展 20 call；写论文草稿；go/no-go | 技术报告 + 复现脚本；决定是否继续 |

**8 周目标**：证明“5–10 call 的授权 trace proof 可行”，而不是完整部署/论文。
