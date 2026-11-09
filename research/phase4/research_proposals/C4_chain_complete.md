# C4 研究方案｜ChainComplete：委托链截断抗性与完整性证明

> 状态：`[推断]/[待验证]` 研究计划；未实现、未跑实验。
> 方向：B1 身份认证与权限委托；B4 审计。
> 一句话：定义“委托链完整性”的安全目标，构造在离线/低信任条件下可验证的链完整性证明，阻止恶意 delegatee 通过截断/尾端伪装隐藏祖先 hop。

## A. 研究问题

**具体缺陷**：一条委托链的每个签名都有效，但验证者无法知道：
1. 链是否从根授权者开始，还是被截断了祖先；
2. presenter 是否是链的合法末端，还是尾端被替换；
3. 被隐藏的 hop 是否已被撤销/scope 更大；
4. 在离线、无透明日志时，能否检测截断。

**研究问题**：形式化“链完整性”（相对于根注册的 path/长度/末端），给出不同信任模型下的可行性边界；构造一个紧凑的完整性证明（根签名元数据 + 父哈希 + 聚合签名/日志 checkpoint），证明其 soundness；实现 5-hop 原型，测量截断检测率、proof size、验证时间。

**贡献形式**：安全定义 + 可行性/不可能性分析 + 构造 + 原型；不是新签名方案。

## B. 系统与威胁模型

### B.1 主体与信任边界

```text
U (root) --delegates--> A0 --delegates--> A1 --delegates--> A2 (presenter)
   |                       |                 |                  |
   | root cert             | token           | token            | token
   v                       v                 v                  v
                         Verifier V (resource/auditor)
                         optional: Transparency Log L / AS
```

- **U**：根授权者；可能在线（可注册 path）或离线（只能预签元数据）。
- **A0/A1/A2**：可能恶意；A2 是 presenter；可删/重排/替换 hop。
- **V**：验证者；可能离线；只信任根公钥/日志 checkpoint。
- **L/AS**：可选透明日志/授权服务器；诚实但可能不可达。

### B.2 攻击者能力

- 恶意 delegatee 持有合法链的一段；可删除祖先/中间 hop、重排、尾端替换、重放旧链；可与被删 hop 串谋；不能伪造根/AS 签名。
- 攻击者知道验证者算法；可选择任意 path/长度/末端。
- 不假设攻击者能攻破哈希/签名。

### B.3 信任模型（三档）

1. **Root-online**：U 在委托完成后可签署最终链元数据（path_id, exact length, presenter）。
2. **Root-precommit**：U 预签最大长度/路径 ID，但不知道最终长度；允许长度 ≤ max；需要额外机制防提前截断。
3. **Log-based**：每次委托追加到透明日志；V 用 checkpoint/inclusion proof；可离线验证（checkpoint 预置）。

## C. 最接近现有工作

| 工作 | 已解决 | 尚未解决 | 证据 |
|---|---|---|---|
| AATs chain-position | 链位置/离线衰减 | 完整性证明；presenter 绑定；撤销 | `[外部 prior art: S6]` |
| UCAN invocation | 链到 presenter | 截断/尾端伪装；审计完整性 | `[外部 prior art: S5]` |
| Aggregate signatures draft | 聚合签名；哪些 hop 签了 | 明确承认不证明所有期望 hop 都在 | `[外部 prior art: S8]` |
| ICISS 2026 Purpose-Limited Secrets | 形式化 truncation attack；EUF-CMA/CR reduction | Agent delegation 标准；紧凑实现；撤销 | `[外部 prior art: P28]` |
| W3C public-credentials thread | 讨论 truncation/chain-of-custody | 无统一形式定义/实现 | `[外部 prior art: S14]` |
| 透明日志 checkpoint | 日志完整性/尾截断检测 | 委托链完整性；presenter 绑定 | 通用机制 |
| R2-07/R1-03（语料） | 链式委托/ token | 无截断分析/完整性证明 | `[PDF证据]` 笔记 §5–§9 |

**已承认的不足**：
- Aggregate signatures draft 明确说“proves which hops signed, not that every expected hop was included”（`[外部 prior art: S8]`）。
- W3C 讨论中 truncation 被视为 chain-of-custody/审计问题，未形成统一形式化（`[外部 prior art: S14]`）。
- ICISS 2026 已对 purpose-limited secrets 做 truncation 形式化，但未覆盖 agent delegation 标准（`[外部 prior art: P28]`）。

**我们的假设（待验证）**：
- 在 root-precommit 模型下，仅靠“根签最大长度”不足以防提前截断；需要每跳的“承诺到最终长度”或日志。
- 存在一个 compact construction，在 root-online 或 log-based 模型下达到完整性，且开销低于全链重放。
- 现有 AATs/UCAN 的 chain-position 不足以提供审计级完整性。

## D. 密码学技术方案

### D.1 定义

- **Chain**：`C = (t_0, t_1, ..., t_n)`，`t_0` 由 U 签，`t_i` 由 `t_{i-1}.subject` 签，`t_n.subject = presenter`。
- **Expected hop set** `H*`：根注册的 path 上所有合法 hop（由 U/日志定义）。
- **Completeness**：V 接受 `C` ⇒ `C` 包含 `H*` 中从根到 presenter 的所有 hop；或 V 输出“不完整”并拒绝。
- **Soundness game**：敌手输出 `(C, π)`；若 V 接受但 `C` 缺少 `H*` 中某个 hop，则敌手赢。
- **Presenter binding**：`t_n` 绑定 presenter 公钥；尾端替换不能通过。

### D.2 构造候选

**Construction A（Root-online）**：
- U 在委托完成后签发 `Cert_root = Sign_U(path_id, n, H(t_n), presenter_pk, expiry)`。
- 每个 token 含 `path_id, depth, parent_hash`；V 检查 `depth` 连续、`H(t_n)` 匹配、`presenter_pk` 匹配。
- 优点：紧凑；缺点：U 必须在线/事后签名。

**Construction B（Root-precommit + per-hop final-length commitment）**：
- U 预签 `path_id, max_depth, root_scope`。
- 每个 hop 的 token 含 `path_id, depth, parent_hash, final_depth_commitment`；但 intermediate 不知道 final depth。
- 需要“最终长度”由 U 或日志在后签；否则提前截断仍可能。结论可能是**不可能**在纯 root-precommit + 无日志下达到审计级完整性；这本身是有价值的下界。

**Construction C（Log-based）**：
- 每次委托 append 到 Merkle log；token 含 log leaf hash；V 用 checkpoint + inclusion proof 验证“该 path 的 hop 集合”完整；checkpoint 可预置/离线。
- 优点：不需要 U 在线；缺点：需要日志/checkpoint 分发；隐私（hop 可见）可用 Merkle 隐私/选择性披露缓解。

**Construction D（Aggregate signature + chain length）**：
- BLS 聚合所有 hop 签名；根签名包含 `path_id, max_depth`；V 检查聚合签名 + depth 连续。
- 仍不能防提前截断，除非根签 exact length；作为对比基线。

### D.3 证明义务

- **Theorem（示意）**：在 EUF-CMA + collision resistance 下，Construction A/C 满足 completeness soundness；给出 reduction。
- **Proposition（不可能性/下界）**：在 root-precommit + 无日志 + 无在线第三方模型下，任何只依赖根预签 max_depth 的协议都不能区分“提前截断”与“合法短链”；给出反例。
- **Presenter binding**：尾端替换归约到签名 EUF-CMA。
- **Privacy（可选）**：日志构造泄露 hop；用 Merkle 隐私/选择性披露；不在主贡献。

### D.4 与 Agent 系统集成

- Token 格式兼容 AATs/UCAN 的 `parent_hash`/`chain position` 字段；增加 `path_id`/`depth`/`presenter_pk`。
- Verifier 可以是 MCP gateway/资源服务器；离线时用预置 checkpoint/根证书。
- 与 C1 共享模型；C4 可作为 C1 的一个 property/修复模块。

## E. 最小可行原型

- **语言**：Python（Ed25519 via `cryptography`）+ Rust/Python（BLS via `py_ecc` 或 `blst`）；Merkle log 用 `merkletools`/自写。
- **规模**：U + 3 Agent + 1 Verifier；5-hop 链；3 种构造（A/C/D）。
- **攻击脚本**：删祖先、删中间、尾端替换、重排、重放旧链、提前截断。
- **环境**：笔记本 CPU；无 GPU；无真实 LLM。
- **验证目标**：攻击检测率 100%（构造 A/C）；proof size <5KB；verify <10ms；与 naive 链对比。

## F. 安全与性能实验

### F.1 对照

- **Naive**：仅逐跳签名 + parent_hash；无完整性证明。
- **AATs/UCAN 风格**：chain-position claim；无根锚定 exact length。
- **提出方案**：Construction A（root-online）/ C（log-based）。
- **上界基线**：全链重放/在线查询 AS。

### F.2 攻击测试

| 攻击 | Naive | AATs 风格 | A/C |
|---|---|---|---|
| 删祖先 hop | 接受 | 可能接受 | 拒绝 |
| 删中间 hop | 接受 | 可能接受 | 拒绝 |
| 尾端替换 | 接受 | 可能接受 | 拒绝 |
| 重排 hop | 接受 | 可能接受 | 拒绝 |
| 重放旧链 | 接受 | 可能接受 | 拒绝（nonce/epoch） |
| 合法链 | 接受 | 接受 | 接受 |

### F.3 指标

- 检测率/接受率；false reject；proof size；verify time；日志 inclusion proof 大小；root-online 延迟。
- 区分“检测到截断并拒绝”与“合法短链被误拒”；报告两种。

## G. 风险与失败条件

| 风险 | 严重度 | 缓解/失败条件 |
|---|---:|---|
| 简单“根签名 exact length”就够 | 高 | 把贡献转为“可行性边界/下界 + 标准化建议”；若仍太薄，并入 C1 |
| ICISS 2026 已覆盖核心 | 高 | 差异化到 agent delegation 标准 + 多跳/撤销/presenter；否则降级 |
| 日志方案需要在线/隐私差 | 中 | 用 checkpoint 预置/选择性披露；报告限制 |
| 没有新构造 | 中 | 贡献可以是“形式化 + 不可能性 + 标准补丁”，不强调新原语 |
| 与 C1 重叠 | 中 | C4 作为 C1 的一个 property/模块；若 C1 强，C4 作为 fallback |

**证伪条件**：
- 若 Construction A 的“根签 exact length”在现有 AATs/UCAN 中已可实现且无新问题 → C4 创新不足；并入 C1 或转向 C2。
- 若所有攻击都被现有 chain-position 阻止 → C4 的核心假设失败。

## H. 8 周推进计划

| 周 | 任务 | 产出/验收 |
|---|---|---|
| 1–2 | 精读 AATs/UCAN/aggregate signatures/ICISS；写完整性定义；实现 naive 链 | 定义 + naive testbed |
| 3–4 | 实现 Construction A/C/D；攻击脚本；形式化 soundness 草图 | 攻击检测数据；reduction 草图 |
| 5–6 | 证明/下界；性能对比；与 C1 模型对接 | 定理/反例；proof size/verify 数据 |
| 7–8 | 写论文草稿；go/no-go；决定是否并入 C1 | 技术报告 + 复现脚本 |
