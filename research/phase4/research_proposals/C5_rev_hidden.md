# C5 研究方案｜RevHidden：隐藏撤销列表的离线委托撤销（备选）

> 状态：`[推断]/[待验证]` 研究计划；未实现、未跑实验。
> 方向：B1/B2。
> 一句话：用动态累加器 + 非成员证明，让离线验证者在不获取完整撤销列表、不依赖可信时钟的情况下，验证 Agent 委托 token 未被撤销，并支持父撤销→后代级联失效。

## A. 研究问题

**具体缺陷**：
1. 状态列表/OCSP/introspection 需要联网；离线 Agent 无法验证。
2. HBHC 用父心跳 + 本地时钟；有时钟回拨/时钟同步假设。
3. 撤销列表本身可能含敏感信息（哪些 Agent/组织被撤销）。
4. 父 token 撤销后，后代 token 可能仍被接受（zombie/级联不完整）。

**研究问题**：构造一个基于动态累加器的撤销方案，使验证者离线验证“token 未撤销”，不暴露完整撤销列表，不依赖可信时钟（用 epoch/更新序列 + bounded staleness），并支持委托 DAG 的级联撤销；形式化 revocation soundness/freshness，比较状态列表/HBHC 的开销。

**贡献形式**：安全模型 + 累加器构造 + 原型 + 与 HBHC/status list 的定量比较；属于应用密码学，不新造累加器原语。

## B. 系统与威胁模型

### B.1 主体与信任边界

```text
Issuer/AS --publishes accumulator Acc_e, epoch e--> Verifier V (offline)
   |                                                   ^
   | issues token with witness w_i(e)                  | checks non-membership
   v                                                   |
Agent A_i --delegates--> A_j --delegates--> A_k -------+
   |                       |                 |
   | parent revocation     | child token     | presenter
```

- **Issuer/AS**：诚实；维护撤销集合；发布 accumulator/epoch；可能不可达。
- **Agent A_i/A_j/A_k**：可能被撤销/恶意；持有 token/witness。
- **Verifier V**：可能离线；有本地缓存的 accumulator/epoch；不信任 Agent。
- **Revocation Service**：发布更新；诚实但可能延迟。

### B.2 攻击者能力

- 被撤销的 Agent 持有旧 token/witness；可重放旧 epoch；与未撤销 sibling 串谋；可尝试用旧 witness 通过验证。
- 攻击者不能攻破累加器 soundness/签名；不能伪造 issuer 更新。
- 时钟回拨：V 的本地时钟不可信；攻击者可能延迟更新。

### B.3 信任假设

- 累加器（RSA/双线性）的强 RSA/q-SDH 假设；签名 EUF-CMA；哈希抗碰撞。
- Issuer 诚实；更新最终可达，允许 bounded staleness（最大 epoch gap）。
- 不假设可信时钟；只假设 epoch 单调递增、签名更新不可伪造。

## C. 最接近现有工作

| 工作 | 已解决 | 尚未解决 | 证据 |
|---|---|---|---|
| HBHC（arXiv:2605.20704） | 父心跳 + 本地时钟的离线级联撤销；49-agent/4 层；0.26ms | 隐藏撤销列表；无可信时钟；累加器对比 | `[外部 prior art: P3]` |
| Root-scoped quiescence（arXiv:2609.21284） | 长运行 Agent 的根作用域静默证书；异步执行；proofs | 隐藏撤销；轻量 DAG 累加器；性能对比 | `[外部 prior art: P4]` |
| IETF status list（AATs/ASOR） | 离线验证 + 短 TTL 状态 | 隐藏列表；无时钟；级联 | `[外部 prior art: S6/S7]` |
| Acar–Nguyen PKC 2011 | delegatable non-membership proofs | Agent DAG；隐藏列表；性能 | `[外部 prior art: P23]` |
| Begum–Nakanishi 2022 | 单累加器/epoch 的 revocable DAC | Agent 场景；级联；无时钟 | `[外部 prior art: P24]` |
| ePrint 2026/832 / 1824 | 累加器 delegated proof updates；revocation framework | Agent 场景；隐藏列表；级联 | `[外部 prior art: P25/P26]` |
| ALLOSAUR | 低延迟 accumulator updates | Agent DAG；隐藏列表 | `[外部 prior art: P27]` |
| R2-07/R1-03（语料） | 撤销/Provider 注册表/token | 无离线/隐藏/级联设计 | `[PDF证据]` 笔记 §5–§9 |

**已承认的不足**：
- HBHC 依赖本地时钟与父心跳（`[外部 prior art: P3]`）。
- Root-scoped 的证书在 manifest/configuration 边界内，不是全局 idle（`[外部 prior art: P4]`）。
- 状态列表需要联网/短 TTL（`[外部 prior art: S7]`）。

**我们的假设（待验证）**：
- 累加器可以在不暴露列表的情况下，达到与状态列表相近的验证开销。
- 无时钟、仅 epoch gap 的 freshness 可以在 bounded staleness 下定义并实现。
- 父撤销的级联可以通过把父 token 的累加器成员关系嵌入子 witness 实现。

## D. 密码学技术方案

### D.1 构造

- **累加器**：RSA dynamic accumulator（Camenisch–Lysyanskaya）或 bilinear accumulator；每 epoch 发布 `Acc_e`。
- **Token**：包含 `token_id, parent_id, epoch, witness_w_i(e)`；issuer 签名。
- **非成员证明**：`π_nonmember(token_id, Acc_e)`；V 验证 token 未被撤销。
- **级联**：子 token 的 witness 包含父 token 的非成员证明/父 epoch；V 检查父未撤销 + 子未撤销；若父撤销，子 witness 失效。
- **隐藏列表**：V 只看到 accumulator 与自己的 witness；不知道其他被撤销 ID。
- **无时钟 freshness**：V 本地保存最后 epoch `e_local`；要求 `e_current - e_local ≤ Δ_max`；若超过，fail-closed。`e_current` 由签名更新给出；不依赖 wall clock。
- **更新**：issuer 发布 delta（add/delete）；V 更新 accumulator/witness；delta 签名。

### D.2 安全定义

| 性质 | 定义（示意） |
|---|---|
| **Revocation soundness** | 若 token 在 epoch e 被撤销，则不存在 PPT 敌手能生成 V 接受的 `(token, π_nonmember, e'≥e)`。 |
| **Cascade soundness** | 若父 token 被撤销，则所有后代 token 不能通过 V（在 freshness 窗口内）。 |
| **Freshness** | V 接受时，`e_current - e_local ≤ Δ_max`；否则拒绝。 |
| **List privacy** | V 从 accumulator/witness 学不到其他被撤销 token 的身份（除自己的）。 |
| **Update soundness** | 伪造 delta 不能改变 accumulator 的撤销集合。 |

证明：归约到累加器的 strong RSA/q-SDH、签名 EUF-CMA、哈希 CR；给出 game-based 论证。

### D.3 与 Agent 系统集成

- Token 格式兼容现有 JWT/VC；增加 `acc_epoch`/`witness` 字段。
- Verifier 可以是 MCP gateway/资源服务器；离线时用本地 accumulator 缓存。
- 与 C1/C4 共享 token 链；C5 可作为 C1 的撤销模块。

## E. 最小可行原型

- **语言**：Rust（`rug`/`num-bigint` 做 RSA 累加器；或 `arkworks` 做双线性）；Python 脚本做 Agent 模拟。
- **规模**：1 issuer、3 层 DAG（U→A0→A1/A2→A3）、10–50 个 token；1 个离线 verifier。
- **环境**：笔记本 CPU；无 GPU；无真实 LLM。
- **验证目标**：非成员证明 <10ms；proof <2KB；撤销后 token 拒绝；父撤销后后代拒绝；隐藏列表（V 看不到其他 ID）。

## F. 安全与性能实验

### F.1 对照

- **状态列表**（bitstring）：需要联网/本地缓存；简单。
- **HBHC 风格**：父心跳 + 本地时钟（简化实现）。
- **提出方案**：累加器 + epoch gap。
- **Naive**：无撤销检查。

### F.2 攻击测试

| 攻击 | Naive | 状态列表 | HBHC | 提出 |
|---|---|---|---|---|
| 撤销后使用 | 接受 | 拒绝（需更新） | 拒绝（窗口） | 拒绝 |
| 陈旧 witness | 接受 | 拒绝 | 拒绝 | 拒绝（epoch gap） |
| 父撤销后后代 | 接受 | 可能接受 | 拒绝（级联） | 拒绝 |
| 时钟回拨 | 接受 | 不适用 | 可能接受 | 不依赖时钟 |
| 列表隐私 | 泄露 | 泄露 | 部分 | 隐藏 |
| 合法 token | 接受 | 接受 | 接受 | 接受 |

### F.3 指标

- 证明大小、验证时间、更新成本、accumulator 大小；zombie window；列表泄漏（定性）。
- 区分“撤销后拒绝”与“合法 token 误拒”；报告两者。
- 扩展 10/100/1000 token；不同 epoch gap。

## G. 风险与失败条件

| 风险 | 严重度 | 缓解/失败条件 |
|---|---:|---|
| HBHC/root-scoped 已覆盖核心 | 高 | 差异化到“隐藏列表 + 无时钟 + 级联”；若无法证明优势，降级为 C4/C1 附录 |
| 累加器替换状态列表是增量 | 高 | 量化隐私/离线/带宽优势；否则不立项 |
| 无时钟 freshness 仍需 epoch 更新 | 中 | 用 bounded staleness + fail-closed；明确假设 |
| 累加器性能/证明大小 | 中 | 用 RSA 2048/3072 基准；对比 bilinear |
| 与 C1/C4 重叠 | 中 | 作为 C1 的撤销模块；不单独作为主贡献 |

**证伪条件**：
- 若累加器在验证时间/证明大小上不优于状态列表，且隐私优势不被需要 → C5 失败；转向 C1/C4。
- 若 HBHC 已支持隐藏列表/无时钟 → 创新失败。

## H. 8 周推进计划

| 周 | 任务 | 产出/验收 |
|---|---|---|
| 1–2 | 精读 HBHC/root-scoped/累加器；写安全定义；实现 RSA 累加器 | 定义 + 累加器 demo |
| 3–4 | 实现 token/级联/epoch 更新；离线 verifier；攻击脚本 | 撤销/级联测试 |
| 5–6 | 与状态列表/HBHC 对比；优化；隐私分析 | 性能/隐私数据 |
| 7–8 | 写论文草稿；go/no-go；决定是否并入 C1 | 技术报告 + 复现脚本 |
