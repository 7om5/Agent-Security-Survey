# C1 研究方案｜FV-Delegation：衰减式 Agent 委托链的形式化验证

> 状态：`[推断]/[待验证]` 研究计划；未实现、未跑实验。
> 方向：B1 身份认证与权限委托；B2 任务授权/最小权限。
> 一句话：用 ProVerif/Tamarin 验证 AATs/UCAN/Lineage 一类委托链在恶意子 Agent、链截断、撤销与跨标准组合下是否真的“授权可靠”，找出攻击并给出最小修复。

## A. 研究问题

**具体缺陷**：Agent 委托链由多个 token/hop 组成。每个 token 的签名都有效，不等于：
1. 整条链从用户根授权开始（可能被截断）；
2. 每跳 scope 单调不放大（可能通过 token exchange/audience 混淆放大）；
3. 撤销在多跳/缓存/离线子 Agent 下真的生效（可能 zombie）；
4. presenter 就是链的合法末端（可能尾端伪装/重放）；
5. 跨标准组合（OAuth `act` 链 + UCAN/AATs chain position + A2A header）语义一致。

**研究问题**：把上述性质写成形式化安全目标，对 2–3 个代表性委托链协议（AATs、UCAN、Lineage/A2A header）建立 ProVerif/Tamarin 模型；在恶意 delegatee、串谋、截断、重放、撤销竞争等攻击者能力下，机器验证这些目标；若发现攻击，提出最小协议修复并重新验证。

**贡献形式**：形式化模型 + 可复现攻击轨迹 + 修复 + 机器验证证明/反例；可选 Python/Rust testbed 复现攻击。不是新密码原语。

## B. 系统与威胁模型

### B.1 主体与信任边界

```text
User U
  | root delegation (scope S0, audience, expiry)
  v
Orchestrator A0  --delegates-->  Sub-agent A1  --delegates-->  Sub-agent A2
  |                                  |                              |
  | MCP/A2A                          | MCP/A2A                      | tool call
  v                                  v                              v
Tool/MCP Server T1             Tool/MCP Server T2             Resource T3
        ^                                                            ^
        |                    Verifier V (resource side) -------------|
        |                    Authorization Server AS
        |                    Revocation Service R (may be offline)
```

- **U**：根授权者，持有根私钥；可信。
- **A0/A1/A2**：Agent/子 Agent；可能被提示注入、恶意、或被攻陷；持有合法但受限的 token。
- **T1–T3 / MCP server**：资源方；半可信；只验证 token/链。
- **AS**：授权服务器；诚实但可能不可达；负责签名/注册。
- **R**：撤销服务；诚实但间歇可达；状态可能陈旧。
- **V**：验证者；可能离线；只信任根公钥/AS 公钥与本地状态。

### B.2 攻击者能力

**基本模型（必须覆盖）**：
- 恶意 delegatee：拥有一份合法、受限的委托 token；能读/改/重放/重排协议消息；能选择 audience/resource；能与另一个 delegatee 串谋组合 token；不能伪造签名/攻破哈希。
- 恶意子 Agent 可被提示注入，但攻击者不需要理解 LLM；攻击在协议层。
- 可观察链的公开部分；不知道其他 Agent 的私钥。

**扩展模型（敏感性）**：
- 被攻陷的 AS（可签任意 token）→ 协议无法保证授权，需 transparency/审计；本方案只讨论“AS 诚实”。
- 撤销服务离线/陈旧 → 需要 bounded staleness；本方案定义 freshness 窗口。
- 时钟回拨/重放 → 需要 nonce/epoch；本方案建模。

### B.3 信任假设

- 签名 EUF-CMA、哈希抗碰撞、MAC PRF；符号模型使用 perfect crypto 抽象。
- 根私钥不被攻陷；AS 签名密钥不被攻陷。
- 验证者最终能获得根公钥/AS 公钥（可预置）。
- 撤销服务最终可达，或允许 bounded staleness；不允许无限期陈旧。

## C. 最接近现有工作

| 工作 | 已解决 | 尚未解决 | 证据 |
|---|---|---|---|
| R2-07 Authenticated Delegation（语料） | OAuth/OIDC/VC 委托架构、scope/audience/撤销接口 | 无形式化定义/协议验证/攻击实验 | `[PDF证据]` 笔记 §5–§9 |
| R1-03 SAGA（语料） | 自家协议的 ProVerif 验证 + 实现 | 不覆盖 AATs/UCAN/Lineage；Provider 强信任 | `[PDF证据]` 笔记 §5–§9 |
| AATs（IETF draft-niyikiza） | 工具级 capability、离线衰减、holder PoP、chain position | 规范级安全分析；恶意 delegatee/截断/撤销组合 | `[外部 prior art: S6]` |
| UCAN spec | delegation/attenuation/invocation/revocation | 无 confinement guarantee；无机器验证的完整模型 | `[外部 prior art: S5]` |
| Lineage（IEEE 2026） | HMAC 链头、scope 单调、深度限制、审计 | 形式化模型/攻击者能力；跨标准组合 | `[外部 prior art: P20]` |
| Cross-Protocol（2026） | ProVerif/Tamarin/TLA+ 于 MCP/A2A/FIPA 翻译 | 不覆盖 AATs/UCAN 衰减链；不覆盖撤销新鲜度 | `[外部 prior art: P22]` |
| SUDP（2026） | secret-use delegation 形式模型/定理 | 不是公开可验证的衰减链；不覆盖 OAuth/UCAN 组合 | `[外部 prior art: P9]` |

**论文明确承认的不足**：
- IETF aggregate signatures draft 承认“证明哪些 hop 签了，不证明所有期望 hop 都在”（`[外部 prior art: S8]`）。
- AIC/INTERSAGE 相关论文把 UCAN-style attenuation 的 ProVerif/Tamarin 建模列为 future work（`[外部 prior art: P39]`，摘要级）。

**我们的假设（不是已证实）**：
- 这些协议组合存在至少一个非平凡攻击（scope 放大、截断、撤销竞争或 audience 混淆）。
- 现有 AATs/UCAN/Lineage 的规范文本不足以排除这些攻击。
- 最小修复可以在不破坏兼容性的情况下补上。

## D. 密码学技术方案

### D.1 安全模型

定义协议参与方与敌手，使用符号模型（ProVerif/Tamarin）与以下性质：

| 性质 | 形式化目标（示意） |
|---|---|
| **Authorization soundness** | 若 V 接受调用 `call(p, s, t)`，则存在一条从 U 到 p 的签名链，每跳 scope 包含 s，audience/resource 匹配，且调用前无撤销事件。 |
| **Attenuation monotonicity** | 链上任意相邻 token 的 scope 满足 `S_child ⊆ S_parent`；不存在放大路径。 |
| **Chain completeness** | 接受的链包含从根到 presenter 的所有 hop；或被显式标记为“截断但授权仍安全”，且撤销状态可追溯。 |
| **Revocation soundness** | 撤销事件后，在 freshness 窗口内不再接受该 principal/后代的调用。 |
| **Replay/resource binding** | token 绑定 audience/resource/presenter/nonce；不能跨资源/跨会话重用。 |
| **No sibling mixing** | 两个合法 delegatee 的 token 不能组合成第三个未授权 scope。 |

### D.2 协议结构（被验证对象）

Token 抽象：

```text
tok = Sign_{issuer}(
  version, issuer, subject, parent_hash,
  scope, audience, expiry, nonce,
  chain_len, position, revocation_epoch
)
```

- `parent_hash`：绑定上一跳 token 的哈希；防止替换/重排。
- `scope`：工具/资源/操作/参数约束的格（lattice）；子集检查是公开函数。
- `audience/resource`：RFC 8707/RAR 风格；防止 token 被换到别的资源。
- `presenter`：DPoP/mTLS 公钥或 key thumbprint；防止 bearer 重放。
- `chain_len/position`：根签名的链长/位置承诺；用于 C4 的完整性检查。
- `revocation_epoch`：撤销状态版本；verifier 检查本地/缓存状态。

### D.3 形式化工具与证明义务

- **ProVerif**：用于 secrecy/authentication/correspondence；建模签名、哈希、nonce、scope 子集函数；验证 `accepted ==> exists chain`。
- **Tamarin**：用于全局撤销状态、partial order、locks、epoch；验证 `Accept@t & Revoke@t' ==> t < t' or within_freshness`。
- **Scope lattice**：在模型中抽象为有限集合/符号函数；避免把自然语言 scope 塞进模型。
- **攻击轨迹**：Tamarin 的 attack graph/ProVerif 的 trace；每个攻击在 testbed 复现。
- **修复验证**：修改协议后重跑同一组 lemmas；要求所有 properties 通过，且合法 trace 仍可达（avoid vacuity）。

### D.4 修复候选

1. **父哈希 + 根锚定链长/位置**：阻止截断/重排（与 C4 共享）。
2. **Presenter binding**：token 绑定持有者公钥；DPoP/mTLS 验证。
3. **Audience/resource 显式**：禁止 token exchange 不重新签名。
4. **撤销 epoch + bounded staleness**：verifier 检查 `epoch >= min_epoch`；过期则 fail-closed。
5. **Scope lattice + 子集检查**：禁止字符串前缀/通配符歧义。
6. **Sibling 隔离**：token 绑定 delegation path ID；禁止跨路径组合。

### D.5 证明义务与边界

- 符号模型证明的是**协议逻辑**，不是计算安全；需要在论文中明确。
- 不证明 LLM 语义/任务意图；只证明“声明的 scope/链/撤销”关系。
- 不证明实现无 bug；testbed 只验证攻击可复现/修复有效。
- 若 AS 被攻陷，协议无法保证授权；需要 transparency/审计，超出本方案。

## E. 最小可行原型

### E.1 组件

- **Agent harness**：Python；3 个 Agent（A0/A1/A2）+ 1 个 MCP-like tool server（FastAPI/Flask）；不需要真实 LLM，可用脚本化策略模拟工具调用。
- **Token 库**：Python `cryptography`（Ed25519）、`pyjwt` 或自定义 CBOR；scope 用 JSON schema；parent_hash 用 SHA-256。
- **AS/Verifier**：本地 FastAPI 服务；撤销列表/epoch 文件。
- **形式化工具**：ProVerif 2.x、Tamarin 1.8+；模型文件 + 脚本。
- **可选**：真实 MCP server（官方 Python SDK）做 1 个端到端 demo；不需要 GPU。

### E.2 最小范围

- 1 个用户 U、3 个 Agent、2 个工具（读文件/发邮件）、1 个资源服务器。
- 1 条主链 U→A0→A1→A2；1 条 sibling 链 U→A0→A1'。
- 1 个 scope lattice：`{read:/data, send:mail, admin}`；子集关系。
- 1 个撤销场景：撤销 A1 后，A2 的 token 失效。
- 1 个截断场景：A2 只出示 A1→A2，不出示 U→A0→A1。

### E.3 验证目标

1. 模型能表达 6 条性质；至少 1 条在 naive 协议下被攻击。
2. testbed 复现该攻击（攻击成功率 >0）。
3. 修复后模型通过，testbed 攻击成功率 0，合法任务成功率不降。
4. 验证延迟 <10ms/token（本地），模型运行时间可接受。

## F. 安全与性能实验

### F.1 对照

- **无防护基线**：bearer token，无链/无 audience/无撤销。
- **成熟技术基线**：OAuth 2.0 token exchange + DPoP + RAR（简化实现）；AATs/UCAN 参考实现（若可用）。
- **提出方案**：修复后的链协议。

### F.2 攻击测试

| 攻击 | 期望（naive） | 期望（修复） |
|---|---|---|
| Scope 放大（token exchange/audience 混淆） | 成功 | 阻断 |
| 链截断（删中间 hop） | 成功 | 阻断/审计告警 |
| 尾端伪装（换 presenter） | 成功 | 阻断 |
| 重放（跨资源/跨会话） | 成功 | 阻断 |
| 撤销竞争（撤销后缓存 token） | 成功 | 在 freshness 窗口内阻断 |
| Sibling token 混用 | 成功 | 阻断 |
| 合法任务（无误） | 成功 | 成功（false block 低） |

### F.3 指标

- 攻击成功率（ASR）；合法任务成功率（TSR）；误阻断率（FBR）。
- 验证延迟（ms/token）；链长 1–5 的扩展；模型验证时间。
- 区分“未授权调用被阻断”与“合法调用被错误阻断”；两者都报告。

### F.4 统计

- 每个场景 ≥100 次；报告均值/95% CI；不同链长/Agent 数。
- 形式化模型：报告 lemmas 数、验证时间、攻击轨迹数；不做“统计显著性”。

## G. 风险与失败条件

| 风险 | 严重度 | 缓解/失败条件 |
|---|---:|---|
| 只找到规范已知的攻击 | 高 | 先做文献/规范对比；若攻击已在 AATs/UCAN 安全考虑中，转为“机器验证 + 修复证明”，仍可成文但创新下降 |
| 模型抽象过强，攻击不可实现 | 高 | 每个攻击在 testbed 复现；不能复现的攻击不作为主贡献 |
| ProVerif 无法表达全局撤销 | 中 | 用 Tamarin；ProVerif 只做无状态部分 |
| 标准演化/版本差异 | 中 | 固定 draft 版本；把版本差异写成限制 |
| 修复破坏兼容性 | 中 | 提供兼容模式/迁移分析；至少给出最小补丁 |
| 没有新密码构造 | 中 | 贡献定位为协议验证/攻击/修复，不是新原语；选安全协议/应用密码学 venue |

**证伪条件**：
- 若 3 个协议在 6 条性质下全部通过，且找不到任何非平凡攻击 → C1 的核心假设失败；转向 C4（链完整性形式化）或 C2（授权轨迹证明）。
- 若所有攻击都依赖“AS 被攻陷” → 超出协议层，转向 transparency/审计方向或 C5。

## H. 8 周推进计划

| 周 | 任务 | 产出/验收 |
|---|---|---|
| 1–2 | 精读 AATs/UCAN/Lineage/ASOR；固定版本；写 6 条性质；ProVerif 最小模型（单链、无撤销） | 性质表 + 模型 v0；能跑出 1 条 trace |
| 3–4 | 加 parent_hash/audience/presenter/撤销；Tamarin 全局状态模型；构造攻击 | 攻击轨迹 ≥1；testbed 复现 |
| 5–6 | 修复协议；重跑模型；实现修复版 testbed；对照实验 | 模型通过；ASR 0；FBR 低 |
| 7–8 | 扩展链长/Agent 数；写论文草稿；go/no-go 评审 | 技术报告 + 复现脚本；决定是否继续 |

**8 周目标不是完整论文**：目标是“模型 + 至少一个可复现攻击 + 修复 + 小规模实验”，用于判断是否值得投入硕士论文。
