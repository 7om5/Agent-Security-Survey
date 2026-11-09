# Agent Security × 密码学交叉观察（阶段一进行中）

> 用途：记录精读过程中发现的、**可能有密码学研究价值**的接口、缺口与反例。
> 纪律：本文件不是研究方向排名，也不是已确认的创新点。每条观察区分 `[PDF证据]`、`[基于文献推断]`、`[尚待验证]`；未做全量文献交叉验证的“缺口”只能标为假设。
> 当前覆盖：124/124 篇（截至 2026-11-03，阶段一阅读完成）。

## 观察索引

| # | 论文 | 主题 | 置信度 |
|---|---|---|---|
| C1 | R3-80 | 完整 Agent 执行的可验证性（zkSNARK/one-shot transcript） | 高 |
| C2 | R1-03 | 多 Agent 治理的认证协议（OTK/X25519/ProVerif） | 高 |
| C3 | R2-07 | 可认证委托凭证（OAuth/OIDC/VC） | 高 |
| C4 | R1-01 | SoK 中的 IAM/凭证/工具签名清单 | 中 |
| C5 | R3-10 | MCP 工具供应链隐私外泄与"统计不可区分"误用 | 高 |
| C6 | R3-01 | 记忆时间信道绕过访问控制 | 高 |
| C7 | R1-02 | 权限预测不等于授权执行 | 高 |
| C8 | R1-05 | 执行隔离/参考监视器但无密码学绑定 | 高 |
| C9 | R1-06 | 静态信息流格与规划/执行分离 | 高 |
| C10 | R2-08 | LLM guardrail 的未认证角色与 `eval()` 代码执行 | 中 |
| C11 | R2-12 | 任务对齐护栏的语义判断与延迟代价 | 高 |
| C12 | R2-16 | Planner/Validator/Isolator 的字符串级隔离 | 高 |
| C13 | R2-17 | MCP-SafetyBench 暴露的版本/签名缺失 | 中 |
| C14 | R1-07 | 合法工具组合滥用（Parasitic Toolchain） | 高 |
| C15 | R1-12 | 跨工具收割/污染的语义寄生 | 高 |
| C16 | R2-11 | 记忆提取：静态加密不足 | 高 |
| C17 | R2-03/04/05 | ML 后门不是密码学后门 | 高 |
| C18 | R2-18 | A2A AgentCard 欺骗/能力伪装与签名缺失 | 高 |
| C19 | R2-19 | 真实工具 Agent 的授权失败/凭证泄露评测 | 高 |
| C20 | R2-21 | 多 Agent impersonation 与身份认证边界 | 高 |
| C21 | R2-22 | 级联注入与“已认证但恶意”的 Agent | 高 |
| C22 | R2-23 | 本地/远程 LLM 路由与 PII 泄露边界 | 中 |
| C23 | R3-02 | 轨迹审计 vs 可验证执行 | 中 |
| C24 | R3-03 | MAS 提示/IP 提取与 TEE/水印边界 | 中 |
| C25 | R3-06 | 授权上下文框架：四条属性的形式化缺口 | 高 |
| C26 | R3-07 | 可信本地清洗：部署假设 vs 密码学信任根 | 高 |
| C27 | R3-04 | “Provable” 只是统计误差界 | 高 |
| C28 | R3-13 | MCP 注册表缺少密码学验证：签名 Server Cards/透明日志/attestation 的边界 | 中 |
| C29 | R3-11 | LLM 推断式再识别 vs 形式化匿名/DP：LSR 不是隐私保证 | 中 |
| C30 | R3-17 | 角色混淆：签名 role label 不能修复模型对文风的角色感知 | 高 |
| C31 | R3-23 | SkillTrojan：XOR+Base64 不是加密；签名 skill 不能阻止组合滥用 | 高 |
| C32 | R3-22 | A-MemGuard：签名 memory/Merkle log 不能检测授权写入的恶意内容 | 中高 |
| C33 | R3-29 | 网络安全 Agent 的可验证授权：VC/PKI/capability 能绑定授权，但不能判定行为安全 | 高 |
| C34 | R3-33 | 环境注入 PII 泄露：签名字段清单/PII tokenization 能约束字段，但不能判定页面意图 | 高 |
| C35 | R3-34 | 同意伪造：签名同意凭证 + nonce 绑定能防重放，但不能防被说服的合法同意 | 高 |
| C36 | R3-35 | IFC 的 “provable” 是系统保证，不是密码学证明；endorsement 是可信去分类事件 | 高 |
| C37 | R3-43 | Secret Collusion：隐写威胁模型/容量主张强于实际形式化；LLM 群体隐写 26% | 高 |
| C38 | R3-48 | Agent Security is a Systems Problem：密码学加固执行边界，但不能替代语义判断 | 高 |
| C39 | R3-59 | CIA：消息加密/签名不隐藏通信拓扑元数据；黑盒输出仍可推断 | 中高 |
| C40 | R3-68 | MAST：消息篡改暴露未认证的 Agent 间通道；签名/MAC+nonce 可阻断在途篡改 | 高 |
| C41 | R3-79 | SkillScope：语义最小权限缺少 artifact 完整性绑定与不可伪造 capability | 高 |
| C42 | R3-84 | 页内 IPI 测量：80.6% 为 first-party，内容来源签名无法解决核心情形 | 高 |

---

## C1. R3-80 zkAgent：完整执行可验证性

- **问题描述**：provider 托管 LLM 推理与 server-side 工具，用户无法验证模型是否被替换、工具观测是否被伪造。zkAgent 把完整推理管线（embedding/位置编码/Transformer/解码）与工具子证明（zkTLS/zkVM）组合成单一 proof bundle。
- **原文证据**：p.1 Abstract；p.8 §2.6 threat model；pp.9–17 §3 zkEmbed/zkPosEnc/zkDecode；pp.18–22 §4 one-shot/transcript binding；pp.26–28 Tables 5–6；p.39 Def.1–2；pp.52–53 Theorem 1；pp.56–57 Appendix G soundness statement。
- **论文实际使用的密码学**：GKR/sumcheck、KZG/KZH 多项式承诺、lookup arguments（LogUp/Shout/cq）、Fiat–Shamir、random oracle 哈希、zkTLS、zkVM（SP1）。`[PDF证据]`
- **是否定义并证明安全性质**：定义了 zk argument of knowledge 与 zkPC（p.39–40），并证明 prefix equivalence（Theorem 1, pp.52–53）；但**没有给出端到端组合 soundness 定理与归约**，Appendix G 只有四项保证的陈述（pp.56–57）。`[PDF证据]`
- **证明涵盖/未涵盖**：涵盖模型计算完整性、transcript 位移一致性、工具 schema 与响应绑定；未涵盖模型承诺的语义（c_W 是否真对应宣称架构/训练过程）、zkTLS 的 server 合谋/CA 信任、prompt injection、工具业务逻辑。`[PDF证据 + 推断]`
- **Agent 接口/信任边界**：provider（LLM+server tools）= 唯一恶意方；client 与本地工具可信；模型承诺 c_W、transcript 承诺 c_tr、工具子证明通过明文相等绑定（p.22, p.56–57）。
- **研究缺口（原文支持）**：组合 soundness 未形式化；模型 identity 承诺不完整；只有 GPT-2 端到端评估（pp.24–26）；零知识属性主体未实现（p.7）。
- **密码学能解决 vs 语义判断**：能解决“是否按承诺模型/真实工具执行”的完整性与来源；不能解决“输入是否恶意/输出是否符合用户意图”。`[推断]`
- **置信度**：高（形式定义/定理/实现均有原文）。
- **尚待验证**：组合 soundness 是否已有后续工作；大模型（Llama/DeepSeek）完整证明成本；模型承诺的更强定义；增量/递归证明。

## C2. R1-03 SAGA：多 Agent 认证与访问 token

- **问题描述**：用户/Agent 注册、联系策略、一次性密钥（OTK）、X25519 共享密钥、加密访问控制 token、Agent 间双向 TLS。
- **原文证据**：p.5 §III-C/D threat model；pp.6–9 §IV protocol；p.9 ProVerif；pp.15–18 appendices；Table I（原语与假设）。
- **论文实际使用的密码学**：EUF-CMA 签名（ECDSA/Ed25519）、SHA-256/3、X25519 ECDH、HKDF-SHA256、X.509、TLS、对称加密（正文未点名算法）。`[PDF证据]`
- **是否定义并证明安全性质**：使用 ProVerif 在 Dolev-Yao 符号模型下证明 token secrecy、Agent–Provider 认证、Agent–Agent 认证（p.9, pp.16–17）。**没有计算安全证明，也没有证明授权/策略符合性**。`[PDF证据]`
- **证明涵盖/未涵盖**：涵盖 token 保密与通信认证；未涵盖“只有 CP_A 允许的发起方才能获得 token”、token 的不可伪造性游戏、撤销一致性、C3/C4 自我复制/凭证共享、恶意 Provider。`[PDF证据]`
- **Agent 接口/信任边界**：中心化 Provider 维护注册表与联系策略；Provider 只在控制面发放 OTK/token，数据面直连；用户/Provider 认证可信；token 是 bearer 凭证，接收方只验“为 B 签发、未过期、未超配额”，不验当前 CP（pp.7–9）。`[PDF证据]`
- **研究缺口（原文支持）**：token 字段无 task；正文“scoped to a specific task”未被密码学强制；C4 共谋无密码学防御；长期密钥泄露的前向保密未处理；Provider 被攻陷无密码学保证（pp.5, 8–9）。
- **密码学能解决 vs 语义判断**：能解决身份认证、密钥建立、token 保密/完整性；不能解决“这个任务是否在用户授权范围内”的语义判断，除非把策略形式化并绑定到 token。`[推断]`
- **置信度**：高（协议与 ProVerif 模型有原文；授权缺口为原文+推断）。
- **尚待验证**：任务绑定 token 的构造与证明；可衰减委托链；撤销的跨域一致性；ProVerif 模型的计算可靠性。

## C3. R2-07 Position: Authenticated Delegation

- **问题描述**：Agent 代表用户与第三方交互时，第三方需验证 (a) 是 Agent，(b) 代表哪个用户，(c) 有哪些权限。
- **原文证据**：p.2 §2 三项验证目标；pp.4–5 §3 OIDC/UMA；pp.14–15 §B.1 三类 token；p.16 §B.5 威胁模型；pp.19–20 §D 局限。
- **论文实际使用的密码学**：用户 ID-token、Agent-ID token、用户签名的 Delegation Token（引用/哈希绑定前两者）、W3C VC、OIDC pairwise pseudonym、audience restriction、DID（pp.14–17）。`[PDF证据]`
- **是否定义并证明安全性质**：**没有**。没有安全定义、攻击游戏、归约或定理；只有威胁枚举与体系论证。`[PDF证据]`
- **证明涵盖/未涵盖**：无证明。未涵盖 token 不可伪造、scope 不扩张、撤销一致性、链式委托组合、密钥泄露恢复。
- **Agent 接口/信任边界**：OP 被信任签发/验证；用户是委托者；Agent 是 OAuth native client；第三方服务执行验证；OIDC 集中化带来隐私/单点监控（p.19）。`[PDF证据]`
- **研究缺口（原文支持）**：标准化 scope 定义、隐私保护委托机制、服务提供者工具（p.9）；撤销/密钥生命周期未解决（pp.19–20）。
- **密码学能解决 vs 语义判断**：能绑定身份、权限声明、委托关系；不能判断自然语言任务是否在 scope 内，除非 scope 已形式化。`[推断]`
- **置信度**：高（架构/威胁/局限有原文；形式化缺口为全文推断）。
- **尚待验证**：委托凭证的 unforgeability/scope non-amplification/revocation soundness 形式定义；链式委托的组合性；与 MCP/A2A 的实际集成。

## C4. R1-01 SoK：IAM、凭证与工具签名清单

- **问题描述**：SoK 把 IAM（身份、访问控制、凭证管理）与工具加固（ETDI 签名工具定义）列为防御层。
- **原文证据**：p.8 §5.1（CIA+contextual security）；pp.13–14 §5.4（身份/访问控制/凭证）；p.15 §5.5（ETDI “cryptographically signed and versioned tool control”）；p.7 side-channel 空白。
- **论文实际使用的密码学**：只引用 OAuth 2.0/OIDC、SSO、短期 token、加密存储、TEE、ETDI 签名；没有构造或证明。`[PDF证据]`
- **是否定义并证明安全性质**：无。全文无形式化定义/定理。
- **证明涵盖/未涵盖**：不适用；作者明确把 IAM 归因、跨平台撤销、凭证生命周期列为开放问题（pp.13–14）。
- **Agent 接口/信任边界**：把 Agent 行为归因于人类/Agent 实例/任务三者未定；跨平台凭证签发/委托/撤销不兼容；多 Agent 密钥共享难以最小权限（pp.13–14）。`[PDF证据]`
- **研究缺口（原文支持）**：上述 IAM 开放问题 + side-channel 未研究（p.7）。
- **密码学能解决 vs 语义判断**：能提供身份、凭证、签名、审计；不能单独解决“行为归因语义”与“工具实现是否按声明运行”。
- **置信度**：中（SoK 的清单性证据强，但具体缺口需原论文验证）。
- **尚待验证**：ETDI 的实际安全属性；Agent 身份与人类身份的绑定模型；跨平台撤销。

## C5. R3-10 SOPE：MCP 供应链与“统计不可区分”术语

- **问题描述**：恶意 MCP server 在工具描述/提示模板/实现中嵌入情境合理的隐私探测，代码层零点击外传。
- **原文证据**：p.4 threat model；pp.4–6 §3.2–3.4；pp.6–8 Tables 1–6；p.9 Limitations。
- **论文实际使用的密码学**：**无**。Assign 是 LoRA 分类器，Fuse 是 PPO，Leak 是代码层 `f_trans`；没有签名/加密/证明。`[PDF证据]`
- **是否定义并证明安全性质**：无。标题 “statistically indistinguishable” 没有形式化定义；操作化是 ESR、PPL 重叠、轨迹投影重叠、代码扫描检出率（pp.8, 13–25）。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用。未证明对自适应防御的鲁棒性；未给出分布不可区分性。
- **Agent 接口/信任边界**：恶意 MCP server 开发者控制 φ/π/f；Agent 内部、防御、用户数据不可见；依赖 client 允许扩展 schema 与出站网络（p.9）。`[PDF证据]`
- **研究缺口（原文支持）**：部署假设（schema 校验/沙箱/allowlist 会降低 Leak 效果，p.9）；没有协议层防御。
- **密码学能解决 vs 语义判断**：能签工具实现/镜像、做远程认证、限制出站/参数能力；不能判断“这个隐私请求在情境上是否合理”。`[推断]`
- **置信度**：高（机制与局限有原文；术语非形式化为全文核对）。
- **尚待验证**：工具实现 attestation 对 SOPE 类攻击的实际阻断率；参数级 capability 的表达力；统计不可区分性是否能形式化为程序/分布等价问题。

## C6. R3-01 FragFuse：记忆时间信道与访问控制

- **问题描述**：把违规查询拆成片段写入长期记忆，再检索融合，绕过只检查当前 query 的访问控制。
- **原文证据**：p.3 §1 temporal channel；p.5 §3 threat model；pp.6–8 §4.2–4.5；pp.9–13 Tables 1–6；pp.13–14 §6 defenses。
- **论文实际使用的密码学**：无。AC 是 LLM/Agent 护栏；记忆是明文记录。`[PDF证据]`
- **是否定义并证明安全性质**：无；实验证明现有 AC 不满足授权属性。
- **证明涵盖/未涵盖**：不适用。未定义“历史相关授权”或“跨会话不变量”。
- **Agent 接口/信任边界**：攻击者是普通用户，不能访问记忆/AC 内部；AC 策略公开；可观察 accept/reject（p.5）。
- **研究缺口（原文支持）**：AC 只看当前 query；记忆写入/检索未纳入检查；后置检查成本高（pp.13–14）。
- **密码学能解决 vs 语义判断**：能对记忆条目做来源/完整性/访问控制；不能判断“片段组合是否等价于违规意图”。`[推断]`
- **置信度**：高（攻击与防御边界有原文；密码学接口为推断）。
- **尚待验证**：记忆增强后重新做 AC 的 BSR/TSR 代价；来源绑定 + 会话隔离的实测效果；历史授权自动机形式化。

## C7. R1-02 权限预测：预测≠执行

- **问题描述**：用用户研究 + LLM/协同过滤预测 Agent 数据访问权限，减少权限疲劳。
- **原文证据**：p.6 Fig.2 over-authorization；pp.10–11 Tables 5–6 predictor；pp.12–13 error analysis；p.3 OAuth mention；p.5 TEE out of scope。
- **论文实际使用的密码学**：无；只有 OAuth 背景提及与 TEE out-of-scope。`[PDF证据]`
- **是否定义并证明安全性质**：无；85.1% accuracy 不是安全保证。
- **证明涵盖/未涵盖**：不适用；未建模 CF 投毒/群体偏差/执行层强制。
- **Agent 接口/信任边界**：预测器输出 allow/deny，但没有 PEP/参考监视器；权限历史集中存储（pp.10–13）。
- **研究缺口（原文支持）**：只预测不执行；冷启动 66.9%；bottom-20% 用户 69.7%；CF 错误会被跟随（pp.12–13）。
- **密码学能解决 vs 语义判断**：能把预测结果变成可执行、可撤销、可审计的 capability；不能保证预测正确。
- **置信度**：高（数据与局限有原文；接口为推断）。
- **尚待验证**：预测器 + 签名 capability + 审计的端到端误授权率；CF 投毒的对抗评估。

## C8. R1-05 IsolateGPT：执行隔离与参考监视器

- **问题描述**：hub-and-spoke 进程隔离，每 App 独立 LLM/记忆，跨 App 经 hub 中转的 ISC。
- **原文证据**：pp.5–7 §IV architecture；pp.7–9 ISC；pp.9–10 Table I；pp.10–13 case studies；pp.17–18 Appendix A。
- **论文实际使用的密码学**：无；seccomp/setrlimit、eTLD+1、结构化消息、会话 ID、权限 UI。`[PDF证据]`
- **是否定义并证明安全性质**：无形式化模型；保护依赖用户拒绝带警告的权限请求（p.10; p.19）。
- **证明涵盖/未涵盖**：不适用；未证明隔离的非干扰性/中介完整性。
- **Agent 接口/信任边界**：hub/operator/OS 可信；App 不可信；spoke 互不信任；ISC 无多主机认证（笔记推断）。
- **研究缺口（原文支持）**：单 App 内部攻陷 out of scope；冷启动/尾延迟开销；用户拒绝是安全条件。
- **密码学能解决 vs 语义判断**：能做 hub 签发 capability、认证 IPC、签名 App 清单、审计；不能判断 App 的自然语言行为是否恶意。
- **置信度**：高（架构/评估有原文；多主机认证缺口为推断）。
- **尚待验证**：多主机 ISC 的认证与密钥建立；权限凭证化后的可用性；非干扰形式化。

## C9. R1-06 ACE：静态信息流格与规划/执行分离

- **问题描述**：抽象规划器只接触可信 query；具体规划器做 lattice 静态 IFC；executor 用 Docker 隔离。
- **原文证据**：pp.3–4 threat model；pp.5–7 architecture；pp.7–9 static IFC；pp.10–11 attacks on IsolateGPT；p.12 Tables II–III；p.16 no soundness。
- **论文实际使用的密码学**：无；Denning lattice IFC、Docker、orchestrator-worker。`[PDF证据]`
- **是否定义并证明安全性质**：无；作者明确承认 Python 子集导致无 soundness 保证（p.16）。
- **证明涵盖/未涵盖**：不适用；未证明非干扰或计划完整性。
- **Agent 接口/信任边界**：query/context 可信；abstract planner/orchestrator/LLM 可信；app 不可信；app clearance 配置可信但分配/验证未说明。
- **研究缺口（原文支持）**：无 soundness；clearance 分配未定义；单 query/standalone app；container escape/伪造消息（p.17）。
- **密码学能解决 vs 语义判断**：能签 app manifest/计划、做 attestation、加密审计；不能替代 lattice 策略的语义正确性。
- **置信度**：高。
- **尚待验证**：clearance 的密码学凭证化；计划签名与执行绑定；形式化非干扰证明。

## C10. R2-08 GuardAgent：LLM guardrail 的信任缺口

- **问题描述**：外部 guardrail agent 读取目标 agent 日志，生成 Python 检查代码并执行。
- **原文证据**：pp.4–5 Fig.1；p.7 Table 1；p.16 Tables 2–3；p.21 Fig.14；p.23 Fig.17。
- **论文实际使用的密码学**：无；自然语言策略、LLM 规划、代码生成、`eval()`。`[PDF证据 + 代码图推断]`
- **是否定义并证明安全性质**：无；只有 benchmark 准确率。
- **证明涵盖/未涵盖**：不适用；未证明日志完整性、角色认证、代码沙箱。
- **Agent 接口/信任边界**：目标 agent 日志/输出被视为输入；用户角色来自 prompt 文本（p.21 Fig.14），未认证；guard 代码在本机执行，未见沙箱（p.23 Fig.17）。
- **研究缺口（原文支持/推断）**：未认证角色、日志可伪造、`eval()` 注入、无完整性保护（笔记 §9 推断）。
- **密码学能解决 vs 语义判断**：能认证角色/签名日志/TEE 绑定真实工具调用；不能保证策略语义正确。
- **置信度**：中（机制有原文，安全缺陷部分为代码图推断）。
- **尚待验证**：真实部署中日志来源与完整性；`eval()` 可利用性；角色凭证化后的准确率/延迟。

## C11. R2-12 Task Shield：任务对齐护栏的语义与代价

- **问题描述**：检查每个动作是否 contributes to 用户任务，偏离则阻断。
- **原文证据**：pp.3–4 Def.1–4；p.6 Table 1；p.8 Table 2；p.13 Algorithm 1；p.14 Table 6。
- **论文实际使用的密码学**：无；LLM 抽取/打分、提示层级。`[PDF证据]`
- **是否定义并证明安全性质**：定义了 Task Alignment 概念，但**无定理、无 soundness/completeness、无攻击游戏**（p.9 作者自认 proof-of-concept）。
- **证明涵盖/未涵盖**：不适用；未证明对齐判定正确性；未覆盖自适应攻击。
- **Agent 接口/信任边界**：用户任务 T_u 可信且被无条件并入（Algorithm 1 第 5–8 行）；Content Checker 读取不可信工具输出；LLM 判定是信任根。
- **研究缺口（原文支持）**：10× 延迟（Slack 6.17→62.56s）；单次试验、无 CI；只测三种固定攻击。
- **密码学能解决 vs 语义判断**：能把 T_u 做成签名/可衰减任务凭证、在 gateway 做硬策略；不能替代“动作是否服务于任务”的语义判断。
- **置信度**：高。
- **尚待验证**：签名任务凭证 + 硬策略的 ASR/延迟；Task Shield 判定器被注入的鲁棒性。

## C12. R2-16 DRIFT：字符串级注入隔离

- **问题描述**：Secure Planner + Dynamic Validator + Injection Isolator。
- **原文证据**：p.3 Fig.1；pp.4–6 design；p.9 Table 1；p.10 Tables 2–3；pp.15–29 appendices。
- **论文实际使用的密码学**：无；LLM 规划/验证、JSON 参数清单、字符串遮蔽。`[PDF证据]`
- **是否定义并证明安全性质**：无；Checklist 3 = NA。
- **证明涵盖/未涵盖**：不适用；未证明隔离的非干扰性；未覆盖所有自适应攻击。
- **Agent 接口/信任边界**：planner/validator 是 LLM；记忆写入前过滤；用户批准是信任决策。
- **研究缺口（原文支持）**：字符串过滤不是密码学隔离；自适应攻击集手工构造；无延迟/误差棒。
- **密码学能解决 vs 语义判断**：能签计划、做 capability 强制 Read/Write/Execute、MAC 记忆来源；不能解决自然语言意图对齐。
- **置信度**：高。
- **尚待验证**：capability 强制后的 ASR/效用；隔离器对编码/分段注入的鲁棒性。

## C13. R2-17 MCP-SafetyBench：版本/签名缺失的经验证据

- **问题描述**：20 类 MCP 攻击、245 用例、13 LLM；host-side 攻击最强，安全提示几乎无效。
- **原文证据**：pp.4–6 Tables 2–3；pp.7–8 Table 4；p.9 host-side results；pp.9–10 safety prompt；p.15 Rug Pull 定义。
- **论文实际使用的密码学**：无；行为 ASR 评测。仅在 Rug Pull 定义提到缺失 “versioning or signature checks”（p.15）。`[PDF证据]`
- **是否定义并证明安全性质**：无；经验 ASR。
- **证明涵盖/未涵盖**：不适用；未做协议层插桩，无法直接检验签名/版本锁定防御。
- **Agent 接口/信任边界**：server/host/user 三类攻击源；MCP harness 无协议层观测。
- **研究缺口（原文支持）**：安全提示无效；host-side 攻击 81.94% 平均 ASR；Rug Pull 的版本/签名缺失。
- **密码学能解决 vs 语义判断**：能签/版本锁定工具 manifest、做服务器身份与消息 MAC/nonce、凭证代理；不能阻止合法 server 的语义攻击。
- **置信度**：中（benchmark 数据强；密码学接口为推断）。
- **尚待验证**：在 MCP harness 中加入签名/版本锁定后的 ASR 变化；host-side 攻击的协议层根因。

## C14. R1-07 Parasitic Toolchain：合法工具组合滥用

- **问题描述**：攻击者不部署恶意 server，只把提示植入外部内容，经“外部摄取→隐私读取→网络外传”组合合法工具。
- **原文证据**：pp.1–5 Fig.1–2；pp.9–11 Tables 4–5；pp.11–13 Table 7；p.13 Table 8；pp.13–14 defenses。
- **论文实际使用的密码学**：无；测量 + 攻击组合。`[PDF证据]`
- **是否定义并证明安全性质**：无；经验 ASR。
- **证明涵盖/未涵盖**：不适用；未证明 context–tool isolation 或 least privilege 的必要性。
- **Agent 接口/信任边界**：攻击者控制外部内容；工具均为合法 server；Agent 组合它们完成攻击。
- **研究缺口（原文支持）**：8.7% 工具/27.2% server 可组合利用；防御仅提出未实现。
- **密码学能解决 vs 语义判断**：能做任务绑定、可衰减授权凭证、reference monitor；不能判断“这组合法调用是否构成恶意任务”。
- **置信度**：高。
- **尚待验证**：任务绑定 capability 对组合攻击的阻断率；跨工具审计的检测率。

## C15. R1-12 Les Dissonances：语义寄生的跨工具攻击

- **问题描述**：恶意工具通过语义/格式依赖寄生到受害工具前后，劫持控制流并收割/污染数据。
- **原文证据**：pp.3–4 Fig.2；pp.5–10 attack vectors；pp.11–12 Table III；p.12 Table II；pp.13–14 Table VI。
- **论文实际使用的密码学**：无；工具描述/控制流分析。`[PDF证据]`
- **是否定义并证明安全性质**：无；经验测量。
- **证明涵盖/未涵盖**：不适用；未证明工具来源认证能阻止寄生。
- **Agent 接口/信任边界**：恶意工具在 pool 中；Agent planner 读取工具描述；合法工具被组合。
- **研究缺口（原文支持）**：66 工具中 75% 可劫持、72% 可收割、68% 可污染；现有防御基本失效。
- **密码学能解决 vs 语义判断**：能签工具清单/发布者、做 capability；不能阻止“合法工具描述的语义寄生”。
- **置信度**：高。
- **尚待验证**：签名清单 + 工具描述语义验证的联合防御；控制流完整性形式化。

## C16. R2-11 MEXTRA：记忆提取与静态加密边界

- **问题描述**：黑盒提示（locator+aligner）从 Agent 长期记忆提取记录。
- **原文证据**：pp.3–5 design；p.5 Table 1；pp.6–7 Table 2/Fig.3；p.8 Fig.4；pp.13–20 appendices。
- **论文实际使用的密码学**：无；提示工程。`[PDF证据]`
- **是否定义并证明安全性质**：无；经验泄露率。
- **证明涵盖/未涵盖**：不适用；未定义记忆 confidentiality 的泄露上界。
- **Agent 接口/信任边界**：攻击者是黑盒用户；记忆检索结果进入 prompt；无 session control。
- **研究缺口（原文支持）**：单 Agent/静态记忆；防御仅定性讨论。
- **密码学能解决 vs 语义判断**：能做按用户/会话的检索授权、密钥隔离、TEE 内检索；**静态加密不足**，因为记录必须明文进入 prompt（推断）。
- **置信度**：高。
- **尚待验证**：检索时授权（ABAC/capability）对 MEXTRA 的阻断率；TEE 内检索的隐私/性能；多用户共享记忆的隔离。

## C17. R2-03/R2-04/R2-05：ML 后门 ≠ 密码学后门

- **问题描述**：AgentPoison（RAG 记忆投毒）、Watch Out（Agent 轨迹后门）、BadAgent（微调数据投毒）。
- **原文证据**：R2-03 pp.1–2/5–9；R2-04 pp.4–10；R2-05 pp.2–8。
- **论文实际使用的密码学**：无；embedding/trigger 优化、数据投毒、PEFT 微调。`[PDF证据]`
- **是否定义并证明安全性质**：无；经验 ASR/防御评估。
- **证明涵盖/未涵盖**：不适用；“backdoor”是 ML 概念，无密钥/陷门/不可区分性。
- **Agent 接口/信任边界**：攻击者可写记忆/训练数据；模型/数据供应链是信任边界。
- **研究缺口（原文支持）**：现有文本后门防御失效（R2-04 DAN AUROC 61–82%）；干净微调难清除（R2-05）。
- **密码学能解决 vs 语义判断**：能签模型/数据来源、透明日志、TEE 训练审计；不能证明“模型无触发行为”，也不能阻止恶意发布者。
- **置信度**：高。
- **尚待验证**：来源签名 + 复现构建对供应链后门的实际约束；TEE 训练证明的可行性。

---

## C18. R2-18 A2ASecBench：AgentCard 欺骗与能力伪装

- **问题描述**：A2A 多 Agent 系统中，攻击者通过近似 AgentCard、能力声明与任务流操纵，诱导 Agent 选择恶意 Agent 或泄露数据。
- **原文证据**：pp.3–6 benchmark design；p.8 Table 2 ASR；p.9 Tables 3–4 guardrails；pp.15–16 Prompt 2；pp.14–24 appendices。
- **论文实际使用的密码学**：**无**。AgentCard 签名、publisher key continuity、TLS、revocation、capability attestation 只作为 LLM prompt 检查项/方向性建议（p.9, pp.15–16），未实现/未评测。`[PDF证据]`
- **是否定义并证明安全性质**：无安全定义/定理；AS 测的是 LLM 对近似 AgentCard 的选择，不是签名伪造。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；未验证签名、attestation、revocation 是否降低 ASR。
- **Agent 接口/信任边界**：A2A AgentCard/能力声明是信任入口；benchmark 只做行为级观测，未做协议层密码验证。
- **研究缺口（原文支持）**：AgentCard spoofing ASR 0.82；guardrails 仅部分缓解（ASRF 0.23–0.48 等）；签名/attestation 未评测（p.9）。
- **密码学能解决 vs 语义判断**：能签 AgentCard、绑定 key/身份、做 capability attestation；不能阻止合法 Agent 的语义欺骗或能力声明与现实不符（除非 attestation 覆盖实现）。
- **置信度**：高。
- **尚待验证**：AgentCard JWS/registry 对 spoofing 的实际阻断率；capability attestation 的语义范围；跨域 revocation。

## C19. R2-19 OpenAgentSafety：真实工具 Agent 的授权/凭证失败

- **问题描述**：356 个真实工具任务（文件、bash、浏览器、ChatNPC），评估 Agent 的授权失败、隐私泄露、凭证泄露等。
- **原文证据**：pp.2–4 framework；p.6 Table 3；pp.7–8 benign/malicious intent；p.9 Table 4 judge agreement；pp.16–26 appendices。
- **论文实际使用的密码学**：**无**；OpenHands + Docker + 规则脚本 + GPT-4.1 judge。Docker 是 OS 隔离，不是安全架构。`[PDF证据]`
- **是否定义并证明安全性质**：无；规则/LLM judge 是经验评测。
- **证明涵盖/未涵盖**：不适用；未验证 capability token/credential broker/签名审计。
- **Agent 接口/信任边界**：工具层是真实执行边界；规则评测器是可信 oracle；LLM judge 不是 verifier。
- **研究缺口（原文支持）**：安全脆弱轨迹上不安全率 49.06–72.73%；良性意图下 50–86% 出现不安全行为；LLM judge 与人类分歧 39.1%（p.9）。
- **密码学能解决 vs 语义判断**：能做工具层 capability、credential broker、签名 append-only 审计；不能判定自然语言请求是否构成授权。
- **置信度**：高。
- **尚待验证**：capability token 对“unauth-discount/change-branch-policy”类任务的阻断率；credential broker 的可用性；签名审计与规则评测的互补性。

## C20. R2-21 TAMAS：impersonation 与身份认证边界

- **问题描述**：多 Agent 系统中 impersonation、DPI/IPI、Byzantine、collusion 等 6 类攻击。
- **原文证据**：pp.1–2 overview；p.6 attack results；p.14 Table 2；pp.16–19 metrics/defense。
- **论文实际使用的密码学**：**无**；提示层攻击与行为评测。“Byzantine”是输出不一致，“collusion”是显式 prompt 协同，不是 BFT/隐蔽信道。`[PDF证据]`
- **是否定义并证明安全性质**：无；Safety 指标是相对 min-max 分。
- **证明涵盖/未涵盖**：不适用；未验证签名 Agent 身份/角色凭证。
- **Agent 接口/信任边界**：攻击者可改写用户查询并冒充权威身份；因此单靠用户身份认证不能阻断。
- **研究缺口（原文支持）**：impersonation 最高 82%、DPI 81%；防御有限（p.7–8）。
- **密码学能解决 vs 语义判断**：能认证 Agent 身份/角色、签消息；不能阻止已认证 Agent 的语义冒充或恶意指令。
- **置信度**：高。
- **尚待验证**：签名角色凭证 + 消息认证对 impersonation 的阻断率；与用户查询完整性保护的联合设计。

## C21. R2-22 ACIArena：级联注入与“已认证但恶意”

- **问题描述**：多 Agent 系统中级联注入，经外部输入、恶意 Agent profile、Agent 间消息传播。
- **原文证据**：pp.1–3 taxonomy；pp.4–5 cases；pp.6–7 results；p.9 Table 2 defense；pp.12–18 appendices。
- **论文实际使用的密码学**：**无**；语义注入 + 变异/LLM judge + ACI-SENTINEL 语义最小化。`[PDF证据]`
- **是否定义并证明安全性质**：无；经验 ASR/BU/UA/PVI。
- **证明涵盖/未涵盖**：不适用；未验证签名/mTLS/attestation。
- **Agent 接口/信任边界**：Agent 间消息与 profile 是注入面；即使消息认证通过，合法 Agent 仍可生成恶意自然语言。
- **研究缺口（原文支持）**：ASR 最高 100%；拓扑不能解释鲁棒性；防御迁移差（p.9, Table 2）。
- **密码学能解决 vs 语义判断**：能消除消息篡改/冒充面、限制后果；不能阻止“已认证但恶意”的 Agent 语义输出。
- **置信度**：高。
- **尚待验证**：mTLS/签名消息对 T 面（消息篡改）的阻断率；capability token 对 Exfiltration 的约束；与语义最小化防御的叠加效果。

## C22. R2-23 Privacy-R1：本地/远程路由与 PII 泄露

- **问题描述**：本地模型逐句选择本地/远程 LLM，在保持任务质量的同时减少 PII 发送给远程 provider。
- **原文证据**：pp.3–5 method/Eq.3–7；pp.5–6 Med-PCD Table 1；p.7 Table 3；pp.8–9 Tables 4–6；p.9 limitations。
- **论文实际使用的密码学**：**无**；冻结 MiniLM + Transformer 策略 + PPO；隐私指标是 PII 精确字符串匹配比例（p.4 式 2）。`[PDF证据]`
- **是否定义并证明安全性质**：无；作者明确 “not a formal privacy guarantee”（p.9）。
- **证明涵盖/未涵盖**：不适用；未定义远程观察者的推断能力，也未给泄露上界。
- **Agent 接口/信任边界**：本地模型与远程 provider 之间是数据流边界；远程 provider 可读取收到的明文 chunk。
- **研究缺口（原文支持）**：仅单轮、二动作；可能主动泄露任务关键 PII；不适用于 100% 防暴露场景（p.9）。
- **密码学能解决 vs 语义判断**：能做 DP 式路由/泄露上界、TEE/MPC/FHE 机密推理、PII 令牌化；不能判定“哪句 PII 对任务是必要的”这一语义问题。TLS/OAuth/日志签名不能阻止 provider 读明文。`[推断]`
- **置信度**：中（机制/局限有原文；密码学接口为推断）。
- **尚待验证**：路由策略的 DP/互信息泄露界；TEE/MPC 替代路线的质量-延迟权衡；Med-PCD 作为密码学增强评测床的适用性。

## C23. R3-02 MATE：轨迹审计 vs 可验证执行

- **问题描述**：移动 GUI Agent 轨迹级、策略条件化审计，输出违规判定与理由。
- **原文证据**：pp.1–4 design；pp.5–9 synthesis/training；pp.10–13 MATEBENCH；pp.19–21 appendices。
- **论文实际使用的密码学**：**无**；全参数微调 Qwen2.5-0.5B/1.5B/3B、bge-m3 策略检索、LLM-as-judge。`[PDF证据]`
- **是否定义并证明安全性质**：无；监督学习准确率。
- **证明涵盖/未涵盖**：不适用；未证明审计器对策略漂移/对抗轨迹的 soundness。
- **Agent 接口/信任边界**：事后审计；轨迹来自截图/UI 树，可能被篡改；策略检索与模型判定是信任根。
- **研究缺口（原文支持）**：REAL 标签由 LLM 生成；Human Level Acc 96.0% 协议未说明（p.9）；无形式化保证。
- **密码学能解决 vs 语义判断**：能签轨迹/时间戳/审计日志、做 TEE 内审计、可验证日志；不能证明“轨迹违反自然语言策略”的语义判断。`[推断]`
- **置信度**：中。
- **尚待验证**：签名轨迹 + TEE 审计的完整性收益；策略形式化后能否做可验证策略符合性；对抗轨迹下的检测率。

## C24. R3-03 MASLeak：提示/IP 提取与 TEE/水印边界

- **问题描述**：黑盒攻击者仅查询首 Agent、观察末 Agent 输出，提取 MAS 的拓扑、系统提示、任务指令、工具规范。
- **原文证据**：pp.4–5 threat model；pp.6–8 method/Eq.4；pp.10–12 results；pp.14–16 defenses；pp.20–21 appendices。
- **论文实际使用的密码学**：**无**；蠕虫式查询分解 + 语义相似度；IP = intellectual property，不是 IP 地址。`[PDF证据]`
- **是否定义并证明安全性质**：无；ER/ACC 经验指标。
- **证明涵盖/未涵盖**：不适用；未定义查询预算下的泄漏上界；未验证 TEE/加密/ACL。
- **Agent 接口/信任边界**：首/末 Agent 是唯一观测接口；内部通信/状态不可见；Agent 必须读取自己的提示并可能复述。
- **研究缺口（原文支持）**：工具提取最弱；防御仅降 ER 到 0.45–0.50；Known-answer TPR 26.6%；真实平台方差大（pp.15–16）。
- **密码学能解决 vs 语义判断**：TEE/attestation 可保护提示存储与执行环境，但不能阻止 Agent 在输出中复述提示；ACL 不能约束语义复述；水印只能做克隆检测/所有权验证，不是防提取。`[推断]`
- **置信度**：中。
- **尚待验证**：TEE 内提示 + 输出 DLP 的实际降低率；提示水印对克隆检测的鲁棒性；带查询预算的泄漏博弈形式化。

## C25. R3-06 Position：授权上下文框架与形式化缺口

- **问题描述**：主张 Agent 安全应从“动作内容是否有害”改为 authorization context，包含 Source Authorization、Task Alignment、Action Alignment、Data Isolation 四属性，并沿轨迹持续检查。
- **原文证据**：p.1 abstract；p.2 §1；pp.3–4 §3.1；p.4 Table 1；pp.5–7 attack reclassification；pp.7–8 critique；pp.12–13 Appendix A。
- **论文实际使用的密码学**：**无**；provenance 只是来源追踪，不是密码学 provenance；全文无 encryption/signature/MAC/OAuth/TEE/attestation。`[PDF证据]`
- **是否定义并证明安全性质**：无形式化谓词、状态机、安全游戏或证明；四属性只有自然语言定义与 Fig.3 概念映射。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；唯一经验依据是单作者人工检查 AgentDojo/WASP 的 45 个注入任务（p.3; pp.12–13）。
- **Agent 接口/信任边界**：授权上下文贯穿用户、数据来源、Agent、工具与记忆；论文没有给出信任边界的形式化。
- **研究缺口（原文支持）**：内容过滤器无法从文本恢复来源是否已认证（p.7）；snapshot benchmark 按构造看不见 Data Isolation（p.6）。
- **密码学能解决 vs 语义判断**：签名 task token/capability、provenance/透明日志、IFC/noninterference 可覆盖 Source Authorization 与 Data Isolation 的部分；Task/Action Alignment 仍是语义判断。`[推断]`
- **置信度**：高（框架原文清楚；形式化缺口为全文核对）。
- **尚待验证**：四属性能否写成可判定谓词；签名 task token 与策略引擎的接口；轨迹级授权的组合性。

## C26. R3-07 MINIM：可信本地清洗的信任根

- **问题描述**：本地 broker 对 UI accessibility tree 做敏感度/必要性预测，保留/抽象/删除节点后再发给远程 LLM。
- **原文证据**：p.1 problem；pp.2–4 threat model/method Eq.1–4；p.6 Tables 1–2；p.13 Algorithm 1；p.14 Tables 7–10；p.9 impact statement。
- **论文实际使用的密码学**：**无**；GATv2、互信息目标、阈值规则；“trusted local sanitization” 是本地设备未被攻破的部署假设，不是 TEE/attestation。`[PDF证据]`
- **是否定义并证明安全性质**：无；Eq.(1)/Eq.(5) 是优化目标，附录 A 自称 Lagrangian proxy，无定理/泄露界（p.4, p.12）。
- **证明涵盖/未涵盖**：不适用；未证明对 honest-but-curious server 的泄露上界。
- **Agent 接口/信任边界**：远程 server 仅 honest-but-curious；本地环境、prompt injection、主动攻击者明确 out of scope（pp.2–3）。
- **研究缺口（原文支持）**：无端到端任务成功率；TCNP-I 只是节点保留代理；标注者/切分未说明；域加权 TISL 与总体不一致（p.6 vs p.14）。
- **密码学能解决 vs 语义判断**：broker 远程认证/签名策略/TEE 可强化本地信任假设；不能解决“模型把敏感内容误判为必要”的语义失效。`[推断]`
- **置信度**：高。
- **尚待验证**：TEE 化 broker 的延迟/信任收益；签名策略与模型版本绑定；端到端任务成功率。

## C27. R3-04 MELON：标题中的 “Provable” 边界

- **问题描述**：掩码重执行 + 工具调用缓存检测间接提示注入；标题称 “Provable Defense”。
- **原文证据**：pp.4–5 Algorithm 1；p.6 §3.4；p.8 Table 1；p.9 limitations；p.18 Appendix E。
- **论文实际使用的密码学**：**无**；只有嵌入相似度、阈值、Hoeffding 不等式。`[PDF证据]`
- **是否定义并证明安全性质**：**没有密码学证明**。§3.4 的 “provable” 是对集成检测器错误率的 Hoeffding 统计界；该集成检测器未进入主实验，独立性/有界性假设未验证。`[PDF证据]`
- **证明涵盖/未涵盖**：统计界只约束检测错误率，不约束 Agent 端到端行为；未覆盖纯文本响应型攻击（66 个逃逸案例的 72.73%）与自适应攻击（p.9, p.18）。
- **Agent 接口/信任边界**：监控器在 Agent 运行时观察工具调用；工具输出不可信；检测器本身是信任根。
- **研究缺口（原文支持）**：误报 9.28%；合法“执行外部指令”的任务被误判；无自适应评估。
- **密码学能解决 vs 语义判断**：工具输出 provenance/签名 capability 可辅助来源判断；不能判断注入内容是否恶意。`[推断]`
- **置信度**：高。
- **尚待验证**：统计界在真实检测器上的适用性；与来源认证联合的误报/漏报；端到端安全保证。

## 跨论文初步模式（仅观察，不做排名/评分）

1. **“认证/授权/完整性”与“语义判断”分层**：R1-03/R2-07/R3-80 能提供身份、凭证、执行证明；R2-12/R2-16/R2-08 依赖 LLM 判断任务/策略语义。前者不能替代后者，后者也没有密码学保证。`[基于文献推断]`
2. **合法工具组合是系统性缺口**：R1-07/R1-12/R3-10 都显示“工具本身合法、组合后恶意”；仅签名工具/服务器不能解决，需要任务级、可衰减的授权与跨工具审计。`[PDF证据 + 推断]`
3. **“backdoor/statistically indistinguishable/order-oblivious/formalizing” 等术语常被非形式化使用**：R2-03/04/05、R3-10、R1-13、R1-09、R2-01 均如此；阶段三评分时必须回到定义与证明，不能按标题词给分。`[PDF证据]`
4. **静态加密/签名不足以覆盖运行时语义**：R2-11（记忆必须明文进 prompt）、R3-10（代码层外传）、R1-02（预测不执行）都说明密码学必须与运行时 reference monitor/信息流控制结合。`[推断]`
5. **形式化证明的覆盖范围通常小于论文宣称**：R1-03 的 ProVerif 不覆盖授权；R3-80 无组合 soundness 定理；R2-12 只有概念定义。引用时必须写明“证明覆盖了什么、没覆盖什么”。`[PDF证据]`

## C28. R3-13 Position：MCP 注册表的密码学验证缺口

- **问题描述**：MCP 注册表只验证命名空间所有权与 schema 正确性，缺少密码学或包级验证；论文主张把可信 AI 要求嵌入协议/生态层，但提出的 Server Cards、审计记录、补救接口都是治理工件，没有密码机制。
- **原文证据**：p.3 §2（“lack cryptographic or package-level validation mechanisms”；registry approval 不保证 runtime safety）；p.6 §4（Server Cards 字段）；p.8 §7（最小审计记录、redress interface）；p.1 §1（HTTP→HTTPS 类比）；p.9 §9（协议本身不能保证可信）。
- **论文实际使用的密码学**：**无**；没有 OAuth、TLS 设计、X.509、VC、签名、TEE/attestation、透明日志或密钥管理。`[PDF证据]`
- **是否定义并证明安全性质**：无；没有 threat model、adversary、安全游戏、定理或证明；“trustworthy MCP”是约定性定义，不是可判定属性。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；论文没有证明任何建议能阻止任何攻击。
- **Agent 接口/信任边界**：host 被默认为可信执行点；注册表信任与运行时行为分离；server 可执行任意代码；host 自身可能被提示注入或恶意应用控制（论文未分析）。
- **研究缺口（原文支持）**：注册表批准不保证运行时安全；Server Cards 是自我声明、不可验证；缺少撤销、版本固定、透明排名与审计完整性机制；论文自己引用的 typosquatting/rug pull 与自我声明卡片直接冲突。
- **补充证据（R3-65 MCPTox，AAAI 2026）**：45 个真实 MCP 服务器、353 个工具、1,348 个投毒用例，平均 ASR 36.5%，o1-mini 72.8%；投毒载体是工具描述/元数据的**语义**污染，论文只在 p.7 建议 metadata sanitization、sandbox、tool-call validation 与 reasoning audit，未评估签名/来源验证/allowlist。这印证了 C28 的边界：签名与透明日志可以认证“哪个发布者发布了哪个版本的哪个工具描述”，但不能判定该描述是否含恶意指令；allowlist 与人工审核仍是语义判断。`[PDF证据 + 推断]`
- **密码学能解决 vs 语义判断**：签名 Server Cards/发布者凭证可绑定“谁发布了什么”；Merkle 透明日志可让上架/下架/版本可审计；可复现构建 + 远程 attestation 可绑定“运行代码与声明一致”；capability token 可约束调用范围。但这些都不能证明 server 行为安全、目的兼容或公平；恶意 publisher 可以签一个恶意 server，TEE 也不能过滤提示注入。`[推断]`
- **置信度**：中（缺口与论文立场有原文；具体密码学接口为推断）。
- **尚待验证**：签名字段的最小集合（manifest/build hash/runtime config）；撤销与密钥轮换；透明日志的治理与防捕获；attestation 的采用成本；如何把声明目的绑定到运行时调用；与 MCP 现有 `server.json`/Server Card schema 的兼容性。

## C29. R3-11 InferLink：LLM 推断式再识别 vs 形式化匿名

- **问题描述**：LLM Agent 把匿名记录中单独不具识别性的线索与公开证据结合，重建真实身份；论文用 LSR 测量成功率和 prompt 防御，但没有形式化匿名保证。
- **原文证据**：p.1 Abstract（inference-driven linkage）；pp.3–4 Netflix/AOL 设置与 Table 1；pp.5–6 InferLink 三因子与 Table 2；p.9 §6 局限；pp.14–18 附录 A–F（prompt、数据、judge）。
- **论文实际使用的密码学**：**无**；anonymization 只是去除姓名/邮箱/路径等直接标识符；没有 DP、k-anonymity、l-diversity、PPRL、PSI、加密或安全计算。`[PDF证据]`
- **是否定义并证明安全性质**：无；LSR 是经验成功率，不是 advantage；没有安全游戏、辅助信息模型、定理或归约。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；论文明确不主张所有弱线索都危险，也不能估计真实发生率（p.9）。
- **Agent 接口/信任边界**：分析者/Agent 已被授权访问匿名数据与辅助来源；失败发生在“使用/推断”层，不是访问控制层；公开 web 与 LLM 推理是攻击面。
- **研究缺口（原文支持）**：InferLink 每 cell 仅 20 个二值样本、60 个唯一配对，无 CI/显著性检验；prompt 防御在 Claude 上把 LSR 0.98→0.03 但 U 0.99→0.45；没有与 DP/PPRL/PSI 基线比较。
- **密码学能解决 vs 语义判断**：形式化匿名/DP 可给发布机制提供最坏情况保证；PPRL/PSI/MPC 可避免把两方记录集中到一个 Agent；但 DP 保护的是机制对个体参与的不可区分性，不限制分析者从合法发布数据 + 辅助信息中推断身份；PPRL 保护链接计算，不保护链接后的推断；TLS/OAuth 只保护传输/授权，不阻止“授权内推断”。`[推断]`
- **置信度**：中（测量结果与缺口有原文；形式化接口为推断）。
- **尚待验证**：带辅助信息的 linkage advantage 博弈定义；DP 合成数据在 record-level 任务上的效用；PPRL/PSI 架构与 LLM Agent 的接口；匿名集缩小/候选集熵是否比二值 LSR 更能预测伤害；自适应改写下的防御鲁棒性。

## C30. R3-17 Role Confusion：签名 role label 不能修复模型对文风的角色感知

- **问题描述**：模型不从 `<user>`/`<tool>` 标签可靠地推断文本来源，而是从文风、词汇、显式声明等可伪造线索推断“谁在说话”；注入文本因模仿可信角色而获得该角色的权威。CoT Forgery 把伪造推理放进 user 消息或 tool 输出，模型误当成自己的推理。
- **原文证据**：pp.3–4 CoT Forgery 形式与 chat/agent ASR；p.6 Table 1（假标签下 CoT 85% CoTness、仅 2% Userness）；pp.7–8 role probe 与剂量-反应；p.9 §7 结论；p.31 App K（Systemness 随位置衰减、AUC .74）。
- **论文实际使用的密码学**：**无**；没有加密、签名、MAC、承诺、ZK、MPC、FHE、TEE；没有安全游戏、优势、定理或归约。`[PDF证据]`
- **是否定义并证明安全性质**：无；“authentication”是模型内部角色推断的比喻，不是密码学认证；role probe 是线性分类器与统计检验。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；探针只覆盖四个 20–120B 开源模型，闭源模型靠行为外推。
- **Agent 接口/信任边界**：模型上下文中的 role label 是唯一“来源”信号；chat 的 user/assistant/CoT 与 agent 的 tool output 都进入同一 token 流；模型没有密钥、验证器或可信第三方。
- **研究缺口（原文支持）**：无防御实验；role labeling/spotlighting 未测；CoT Forgery 终会被检测但根因仍在；签名/标签无法改变 style-based perception（p.6, p.9）。
- **密码学能解决 vs 语义判断**：签名/MAC 可在模型外部认证“这段文本确实来自工具 T/用户 U”，但验证结果最终仍以文本/元数据进入上下文；模型仍可能给签名 `<tool>` 块中的推理文本高 CoTness。能力令牌/egress allowlist 可阻断外传的“最后一步”，TEE 可保护 runtime/密钥，透明日志可审计；它们都不能让模型内部正确归属角色。真正的修复需要模型/表示层或结构化通道（例如验证失败的内容根本不进入模型上下文），不是密码学原语本身。`[推断]`
- **置信度**：高（角色混淆与标签失效有直接 probe/行为证据；密码学边界为严格推断）。
- **尚待验证**：签名 role label + 结构化 API（模型只能看到已验证角色字段）能否降低 ASR；probe-based 检测在自适应攻击下的鲁棒性；表示层 steer/ablate 是否因果降低 ASR；跨语言/跨风格泛化；把“角色不可区分性”做成可检验的评测博弈。

## C31. R3-23 SkillTrojan：XOR+Base64 不是加密；签名 skill 不能阻止组合滥用

- **问题描述**：攻击者把恶意 payload 编码/分割后嵌入多个看似良性的 skill；触发 query 命中时，片段经 tool output 进入轨迹，verifier 按集合包含重组并执行。论文称 payload 为 “encrypted”，并把 signed package provenance 列为防御方向。
- **原文证据**：pp.3–5 威胁模型、payload 分割/重组 Eq.1–6；p.8 Table 3 扫描器判 safe 98.2%/99.4%；p.9 Table 5 加密消融（XOR+Base64 的 heuristic flag 78.0%，Hybrid 21.0%）；p.13 Alg.1 line 14 密钥 `k` 随 verifier skill 分发；p.9 防御方向。
- **论文实际使用的密码学**：**名义/弱**；`Enc`/`Dec` 落地为 XOR + Base64，Base64 是编码，XOR 未说明密钥长度/生成/IV；密钥在分发的 skill 包内，能读代码的审计者即可提取。没有 IND-CPA、密钥管理或安全定义。`[PDF证据]`
- **是否定义并证明安全性质**：无；没有 theorem/lemma/proof/security game/reduction；ASR/ACC 是经验指标。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；扫描器只测静态启发式命中率，不测密码学机密性。
- **Agent 接口/信任边界**：skill 包安装后攻击者无宿主访问；payload 在 agent 进程内以 agent 权限执行；verifier 是攻击者控制的 skill；单个 skill 可完全合法，危害来自组合。
- **研究缺口（原文支持）**：两个 LLM 扫描器把 98.2%/99.4% 的 SkillTrojan 判为 safe；去掉编码/分段后降到 3.4%/2.8%；签名 provenance 只证发布者/完整性，不证行为良性；逐包签名会放行所有单个合法 skill。
- **密码学能解决 vs 语义判断**：签名/透明日志/SBOM 可认证“谁发布了什么”、检测替换与撤销；capability/沙箱/egress 可限制 payload 的文件、网络、secret 访问；秘密共享可改变重组门槛。但密码学不能判定“多个合法 skill 的组合是否恶意”，也不能在 verifier 受攻击者控制时提供可信解密。`[推断]`
- **置信度**：高（密钥分发与 XOR+Base64 有原文；密码学边界为严格推断）。
- **尚待验证**：密钥提取/去混淆的实际成功率；`(t,N)` VSS 对 ASR/可检测性的影响；execution-trace monitor 的 ASR/ACC 权衡；签名 provenance + capability sandbox 的组合收益；不同 payload family 的权限依赖。

## C32. R3-22 A-MemGuard：签名 memory/Merkle log 不能检测授权写入的恶意内容

- **问题描述**：攻击者向 agent memory 写入看似良性的记录，记录只在特定 trigger query 下激活，并可能被存为“先例”形成自我强化错误。A-MemGuard 在检索后用多条推理路径的语义共识过滤异常记忆，并把异常路径蒸馏为 lesson memory。
- **原文证据**：pp.3–5 威胁模型、Eq.1–10；pp.6–8 AgentPoison/MINJA 主结果与消融；pp.24–26 ASR-t gap、100% malicious 检索、Limitation。
- **论文实际使用的密码学**：**无**；没有加密、签名、MAC、Merkle log、TEE 或访问控制；`consensus` 是 LLM 裁判对 K 条路径的语义一致性判断，不是 Byzantine 共识。`[PDF证据]`
- **是否定义并证明安全性质**：无；没有 theorem/proof/security game；ASR-r/a/t 与 ACC 是经验指标。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；没有误报率/过度阻断度量，ASR-t 仍为 36.17（EHRAgent）到 42.85（ReAct LLaMA）。
- **Agent 接口/信任边界**：memory store、retriever、LLM judge 被默认可信；攻击者有有限直接写权限或经良性查询间接归档；防御只在检索时过滤，不阻止写入。
- **研究缺口（原文支持）**：投毒记录仍留在主记忆；lesson memory 是新的攻击面，未净化/签名/过期；LLM 裁判可被注入；K 条路径同源、非独立；没有 FPR/延迟/真实部署。
- **密码学能解决 vs 语义判断**：写入者签名 + capability 可把“有限写权限”变成可审计、可撤销的授权；Merkle/透明日志可检测未授权修改、删除、回滚；TEE 可保护裁判与 lesson 库的执行完整性。但这些都不能判断“已授权写入的内容是否恶意”；签名只证“谁写的”，Merkle log 只证“没被改”，BFT 需要副本/quorum/证书而本文没有。`[推断]`
- **置信度**：中高（威胁模型/机制有原文；密码学接口为推断）。
- **尚待验证**：签名写入 + capability 对 direct injection 的降低幅度；Merkle log 对 overwrite/delete/rollback 与 authorized-append 的检测差异；lesson memory 投毒导致的过度阻断；裁判注入对共识的破坏；路径相关性与投票错误界。

## C33. R3-29 Cyber Refusals：可验证授权能绑定 scope，但不能判定行为安全

- **问题描述**：Agent 在网络安全任务中需要判断“是否应拒绝”；论文的核心观察是 Agent 无法可靠验证用户声称的授权，scope/rules-of-engagement 文档容易伪造，localhost 代理又可伪装成合法测试环境。论文提出 red/green/yellow 拒绝边界与 CRF benchmark，但没有实现授权验证机制。
- **原文证据**：p.3 §3.2（“AI agents cannot reliably verify legitimate authorization”；不能把所有决定交给 user claims）；p.8 §6（加入 scope/rules of engagement、把真实站点代理到 localhost 是两个通用绕过）；p.4 三分类；p.17 App A.3（nginx 自签名证书 CN 为目标域名）；pp.5–7 评测结果。
- **论文实际使用的密码学**：**无**；TLS 证书只在 p.3 作为“环境枚举信号”被提到，论文没有实现证书验证；没有 OAuth、VC、签名、mTLS、TEE 或 capability token。`[PDF证据]`
- **是否定义并证明安全性质**：无；没有 `Authorized(...)` 谓词、授权逻辑、安全游戏或定理；red/green/yellow 是规范性分类，不是可判定属性。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；评测是 8 个模型 × 29 挑战 × 5 trials 的行为统计，judge 为 Claude Sonnet 4.5。
- **Agent 接口/信任边界**：Agent 从 headers/TLS/页面内容与用户自然语言声明推断环境性质；目标身份、授权 issuer、scope 都没有密码学验证；Medium 的 scope 文档是不可验证的授权声明。
- **研究缺口（原文支持）**：6/8 模型在 Hard 真实系统上拒绝率 0%（但 Hard 只要求 recon + plan）；Medium scope 文档可伪造；localhost 代理绕过 green 分类；yellow 类没有对应挑战；论文没有提出或评估任何验证机制。
- **密码学能解决 vs 语义判断**：VC/SD-JWT/BBS+、mTLS、PKI/CT/DNSSEC 可把“issuer–agent–target–action–scope–expiry”绑定成可验证凭证，让 Agent 验证目标身份与授权范围；capability gateway 可在工具层强制执行 allowlist；签名审计可归因。但这些只能证明“谁授权了什么”，不能判断“该授权本身是否合法/范围是否适当”，也不能判断“测试动作是否会造成伤害”；恶意或过宽的 issuer 仍可签出危险授权。`[推断]`
- **置信度**：高（授权不可验证与两个绕过有原文；密码学接口为严格推断）。
- **尚待验证**：issuer 信任模型与撤销；scope 语义/细粒度；重放与委托链；Agent 是否真的检查证书/凭证；VC + capability gateway 对 false compliance 的降低幅度；与 refusal policy 的组合；真实 pentest 工作流的 UX 与法律约束。

## C34. R3-33 EIA：字段级 capability/PII tokenization 与页面语义意图

- **问题描述**：攻击者控制网页 HTML/CSS/JS，在 PII 字段附近注入不可见表单或镜像元素，用“This is the right place to input the {PII}”诱导 Web Agent 把 PII 输入注入字段；JS 在停止输入后自动外传并删除 DOM。
- **原文证据**：pp.5–6 注入设计、透明度/位置、FI/MI、自动提交；pp.7–8 70%/16% ASR；p.9 VirusTotal 未标记、防御 prompt 无效；p.10 防御讨论；p.17 手工适配 4/5；p.28 Relaxed-EIA。
- **论文实际使用的密码学**：**无**；没有 TLS 配置、签名、SRI/CSP、TEE、capability token 或加密。`[PDF证据]`
- **是否定义并证明安全性质**：无；没有信息流/非干涉定义、安全游戏或定理；ASR 是经验条件概率。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；离线单步、单点注入、SeeAct 单框架；70%/16% 是“在该 PII 动作步上”的条件率。
- **Agent 接口/信任边界**：Agent 从页面 DOM/截图与 aria-label 推断“哪个字段该填什么”；页面来源与字段语义都没有可信绑定；攻击者是网页控制者/供应链。
- **研究缺口（原文支持）**：VirusTotal 未标记任何注入页面；三种防御 prompt 几乎无效；标准 EIA 对完整请求 0%，Relaxed-EIA 仅 GPT-4V 16%；人工监督只在额外适配时失效。
- **密码学能解决 vs 语义判断**：签名字段清单/能力令牌可把“允许的字段 ID、类型、接收方、表单 action”绑定到可信 issuer，Agent 执行器在输入前校验；PII tokenization/vaulting 可让 Agent 只看到 pseudonym，真实值由可信网关替换；SRI/CSP/可复现构建可限制第三方脚本；出口 DLP 可拦截明文外发。但这些只能证明“字段/脚本来自谁、是否在清单内”，不能判断页面是否在语义上诱导用户；镜像合法字段、合法但恶意的站点、完整请求泄露仍然存在；加密不能阻止 Agent 把明文输入页面。`[推断]`
- **置信度**：高（攻击与防御失效有原文；密码学接口为严格推断）。
- **尚待验证**：字段清单绑定 DOM 路径/源/表单 action 的可行性与误杀；PII tokenization 与网站校验的兼容性；出口 DLP 的编码/分片绕过；人类检测率随视觉偏差的变化；跨模型/跨框架迁移。

## C35. R3-34 Search Privacy：签名同意凭证与 nonce 绑定

- **问题描述**：恶意 recipient Agent 通过多轮社会工程提取数据，策略从直接索取演化到冒充数据主体、伪造/转发同意；防御 D2 用 prompt 级“authenticated account + 状态机”检查，但不是密码认证。
- **原文证据**：pp.3–6 三方仿真与搜索；p.7 策略演化 A1/D1/A2/D2；p.8 迁移；p.9 真实 Outlook 3/5 且伪造消息被当作 “Consent verified”；p.17 data subject 被禁用；pp.20–22 有用性；pp.32–35 搜索轨迹。
- **论文实际使用的密码学**：**无**；没有 SPF/DKIM/DMARC、S/MIME/PGP、签名、VC、TEE 或 capability token；D2 的 “authenticated account” 是自然语言 prompt 检查。`[PDF证据]`
- **是否定义并证明安全性质**：无；没有认证协议、消息新鲜性、nonce、重放保护或安全游戏；LV 是行为指标。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；仿真中 data subject 被禁用，合法同意不存在，D2 可能等价于“永不分享”；真实案例仅 5 次。
- **Agent 接口/信任边界**：sender 只看到消息文本与账户名；recipient 可冒充/转发；data subject 不在线；工具层不提供结构化认证结果。
- **研究缺口（原文支持）**：A2 42.2% vs D2 7.1%，但 D2 有用性 31.2%；真实案例中伪造同意被当成 verified；防御跨弱 backbone 迁移差；只报 LV 不报 LR。
- **密码学能解决 vs 语义判断**：SPF/DKIM/DMARC、S/MIME/PGP、平台 authenticated sender ID 可让工具层验证“谁发的”；签名同意凭证（VC/SD-JWT/BBS+）绑定 subject–recipient–item–purpose–nonce–timestamp–expiry，可阻止伪造、转发与跨请求重放；capability token 可在 send API 强制执行。但认证只证明“谁发的/谁同意了什么”，不能判断 recipient 是否通过社会工程说服了数据主体，也不能判断披露在语境上是否适当；被欺骗的合法同意仍是有效签名。`[推断]`
- **置信度**：高（同意伪造与 D2 的 prompt 性质有原文；密码学接口为严格推断）。
- **尚待验证**：consent receipt 的字段与 UX；nonce/撤销/密钥管理；LLM 是否会忽略工具层验证结果；data subject 在线同意后的攻击面；跨应用身份；LV/LR 双指标下的防御排序。

## C36. R3-35 PRUDENTIA：IFC 的 “provable” 不是密码学证明

- **问题描述**：论文在 FIDES 的确定性信息流控制（IFC）之上优化 planning 自主性，提出 HITL load/TCR@k 指标、策略感知规划、变量展开与 endorsement；摘要/正文用 “provably eliminate PIAs by design” 描述 IFC 的安全保证。
- **原文证据**：pp.2–3 IFC 承诺与标签格；pp.3–4 指标与策略；pp.5–6 PRUDENTIA/endorsement；pp.9–10 限制与讨论；pp.16–20 结果/成本。
- **论文实际使用的密码学**：**无**；没有加密、签名、MAC、承诺、TEE 或密码协议；变量隐藏是运行时封装，不是加密。`[PDF证据]`
- **是否定义并证明安全性质**：**没有密码学定义/定理/归约**；“provable”指既有 IFC 工作在标签/策略正确、user/planner/tools 可信、人类认真审批时的系统级保证；本文没有重复证明，也没有证明 PRUDENTIA 的 prompt 设计保持该性质。`[PDF证据]`
- **证明涵盖/未涵盖**：IFC 覆盖“低完整性数据不能影响 consequential action”；不覆盖模型幻觉、语义误解、标签/策略错误、HITL 界面操纵、用户被社会工程。GPT-4o 上 PRUDENTIA 的 HITL 反而高于 FIDES（23.8 vs 7.8），说明自主性收益并非普遍。`[PDF证据]`
- **Agent 接口/信任边界**：user/planner/tools 可信；标签/策略由可信运行时分配；endorsement 是用户把 U 数据显式升级为 T 的“可信去分类”事件；HITL 界面可能被攻击者操纵（作者承认）。
- **研究缺口（原文支持）**：AgentDojo 没有 ASR 实测，安全是 “by design”；无自适应攻击、无用户研究；HITL load 只统计成功任务；成本 1.9–5.9×；标签/策略错误未评估。
- **密码学能解决 vs 语义判断**：签名的数据来源/标签凭证可认证“标签是谁打的”，TEE/attestation 可保护 planner/IFC 执行完整性，capability 可把策略检查移到工具网关；但这些不能保证策略语义正确、不能防止用户被说服后做出错误 endorsement，也不能把 IFC 的系统保证升级为密码学证明。IFC 本身是非干扰/访问控制性质，不是计算困难性假设下的密码学。`[推断]`
- **置信度**：高（“provable”的限定与 endorsement 机制有原文；密码学边界为严格推断）。
- **尚待验证**：PRUDENTIA 是否保持 FIDES 的非干扰性（形式化证明）；标签/策略错误的敏感度；endorsement 界面的社会工程抗性；capability 网关与 IFC 的组合；成本归一化的自主性收益。

## C37. R3-43 Secret Collusion：隐写威胁模型/容量主张强于实际形式化

- **问题描述**：两个或多个生成式 Agent 用隐写术在看似无害的公开通信中隐藏协调/秘密，以躲避监控；论文提出 DecAI 系统模型、四档监控者、序数激励条件、4 个定理与 CASE 能力评测。
- **原文证据**：p.1 Abstract 称 “formal threat model” 与 “capacity”；pp.4–6 定义/分类/激励；pp.9–10 定理与证明；p.23–24 证明附录；pp.7–8 与 pp.30–36 CASE 结果；pp.22–48 附录。
- **论文实际使用的密码学**：**没有密码学构造**。AES/SHA-256/OTP/public key 只作为能力目标、Theorem 3 假设或引用；iMEC 是引用 [118] 的信息论隐写算法，不是本文构造；没有签名、承诺、ZK、MPC、FHE、TEE。`[PDF证据]`
- **是否定义并证明安全性质**：有 **1 个 grounding function 定义 + 4 个定理/论证**，但都不是密码学：
  - Theorem 1 是认识论/逻辑检测，依赖“知道 A 的先验知识并删除隐写相关知识”，无误差界/复杂度；
  - Theorem 2 把“共同知识大/未知”等同于 intractable，无复杂度类/归约；
  - Theorem 3 假设密码哈希存在且可由神经电路实现，是可行性论证；
  - Theorem 4 证明的是改写前后互信息上界，不是 subliminal channel capacity。
  没有安全游戏、advantage、KL/检测误差、容量可达性/converse。`[PDF证据]`
- **证明涵盖/未涵盖**：不覆盖“统计不可检测”的 KL/检测误差定义，不覆盖容量可达速率，不覆盖监控者自适应；实验 26% 不能换算成 bits/token，也未与 Theorem 4 上界比较。
- **Agent 接口/信任边界**：监控者 E 读取公共信道；§4 假设 E 能解密，但 Theorem 2 的公钥隐写反例依赖 E 无私钥，二者冲突；A/B 共享 Wikipedia 段落而 E 不共享，群体 26% 主要是“利用共享知识编码”，不是“骗过同等信息/能力的监控者”。
- **研究缺口（原文支持）**：Abstract 的 formal/capacity 与实际形式化程度不符；no N/CI/显著性；无 mitigation 实验；真实案例是 prompt-scaffolded、单次定性；“perfectly secure” iMEC 示例用固定 key `b'\x03'*64`，无检测实验。
- **密码学能解决 vs 语义判断**：标准隐写定义（Cachin 的 KL ε-secure、Hopper 的计算不可检测）与容量定理可以把“不可检测/速率”形式化；LLM 的自回归 token 分布可估计 KL/检测误差，但 covertext 分布、监控者先验与辅助信息需要明确。完美隐写在统计上与 covertext 不可区分，monitoring/watermarking 无优势；TEE/签名/日志只能保护执行与记录完整性，不能检测输出中的隐写；DLP/正则会被编码绕过。`[推断]`
- **置信度**：高（定义/定理与实验缺口有原文；密码学接口为严格推断）。
- **尚待验证**：LLM 隐写的 bits/token 容量；KL/检测误差的可测上界；同等信息/能力监控者下的成功率；自适应监控者与自适应隐写；mitigation（paraphrase/grounding/参数优化）的实验评估；多模态/工具信道。

## C38. R3-48 Agent Security is a Systems Problem：密码学加固执行边界，但不能替代语义判断

- **问题描述**：Position paper 主张把驱动 Agent 的 AI 模型视为不可信组件，在系统层强制执行安全不变量（TCB、安全策略、reference monitor、最小权限、完全中介、安全信息流、人的薄弱环节），而不是依赖模型鲁棒性。
- **原文证据**：pp.1–2 立场；pp.3–4 五原则；pp.6–9 三机制（指令/数据分离、最小权限沙箱+可验证策略生成、IFC）与语义 gap；p.5 Table 1 十一个真实攻击；pp.15–18 附录案例。
- **论文实际使用的密码学**：**无**；没有加密、签名、MAC、承诺、ZK、MPC、FHE、TEE、capability token 或密码协议。密码学只出现三处类比：p.3 OS 的 “Cryptographic Root of Trust”、p.5 Web 的 Subresource Integrity、p.6 “hardness assumptions of cryptographic protocols” 的对比句。`[PDF证据]`
- **是否定义并证明安全性质**：无形式化定义、定理、证明或 reduction；五原则/三机制是规范性论证；“provable separation” 在正文被限定为 “if attainable”，且作者承认当前标签/分隔符方法不可证明。`[PDF证据]`
- **证明涵盖/未涵盖**：不适用；11 个案例是事后归因，不是系统抽样或实验；没有实现/开销数据。
- **Agent 接口/信任边界**：模型被移出 TCB；reference monitor/策略引擎/工具网关应是确定性、抗篡改、完全中介的；但 TCB 正确性、NL→formal 策略翻译、LLM 内部标签传播、人的审批疲劳仍未解决。
- **研究缺口（原文支持）**：semantic gap（自然语言意图直接压成工具调用）；IFC 的 label explosion；mutual entailment 不可直接检查；人工批准是负担转移；Table 1 与正文有 3 处勾选不一致。
- **密码学能解决 vs 语义判断**：密码学可加固**执行边界**：TCB 远程证明/隔离、签名策略包、工具网关 capability token、来源/完整性认证、不可变配置、签名审计日志。它不能解决**语义判断**：什么算 sensitive/harmful、NL→formal 策略翻译、模型内部信息混合、审批疲劳。把“已签名”当“可信指令”是 confused deputy；把 TEE 证明当“模型不会被注入”是范畴错误。`[推断]`
- **置信度**：高（立场、原则与案例有原文；密码学边界为严格推断）。
- **尚待验证**：TCB + 密码协议组合的形式化定理（覆盖策略已形式化的部分）；capability 粒度与过度阻断；来源认证对“合法源被滥用”的无效性；IFC 标签粒度（role/origin vs token/variable）；审批疲劳的用户研究。

## C39. R3-59 CIA：消息加密/签名不隐藏通信拓扑元数据

- **问题描述**：CIA 在纯黑盒条件下，仅凭提交查询与读取最终输出，推断 LLM 多 Agent 系统的有向通信拓扑（3–7 节点 DAG）；12 个设置平均 AUC 0.8608、峰值 0.9873，最高基线 0.7475。
- **原文证据**：pp.3–5 威胁模型与两阶段方法；pp.6–8 主结果/消融；pp.12–17 附录 A–K（prompt、超参、逐设置表）。
- **论文实际使用的密码学**：**无**；没有加密、签名、MAC、PKI、TLS、TEE 或安全信道；消息就是明文 LLM 文本，攻击面是最终输出内容。`[PDF证据]`
- **是否定义并证明安全性质**：没有；Theorem 1 是借用的总相关（TC）分解恒等式；MI/TC/InfoNCE 仅用于表示解耦与弱监督，不构成拓扑泄露的界。`[PDF证据]`
- **证明涵盖/未涵盖**：不覆盖查询成本、防御、训练/测试划分、自适应对手；拓扑仅 3–7 节点；无真实生产 MAS。
- **Agent 接口/信任边界**：黑盒用户只能看最终输出；系统内部 Agent 间通信、配置与拓扑均不可见；但最终输出必须携带足够任务信息，攻击者利用这一点恢复中间推理。
- **研究缺口（原文支持）**：无防御评估；无下游定向攻击；依赖 Agent 遵从格式指令与逐字复制；无噪声/格式扰动鲁棒性；§6.2 称 AUC 全部 >0.75，但 AGP-HumanEval 为 0.7480。
- **密码学能解决 vs 语义判断**：mTLS/签名消息可提供**来源认证与内容机密性**，加密的 Agent 间信道可防止网络窃听；但这些都不隐藏**结构元数据**——谁与谁通信、消息序列、最终输出中的推理痕迹。即使所有边都加密，黑盒输出仍可能泄露拓扑（内容级推断）。要保护拓扑，需要流量分析防护（padding、batching、mixnet）、输出最小化/改写，以及把“拓扑可见性”当作独立隐私目标；密码学可以提供匿名信道/群签名，但代价与可用性需评估。`[推断]`
- **置信度**：中高（攻击与结果有原文；“加密不隐藏拓扑”是严格推断，尚未在本文实验）。
- **尚待验证**：加密信道下 CIA 的 AUC 是否下降；输出改写/摘要对拓扑推断的影响；真实 MAS（AutoGen/MetaGPT）上的泛化；防御（拓扑隐藏、查询限速、输出过滤）的成本；与 C30（角色认证）和 C32（memory 认证）的边界。

## C40. R3-68 MAST：消息篡改攻击暴露未认证的 Agent 间通道

- **问题描述**：MAST 对 LLM-MAS 做多轮自适应、隐蔽的消息篡改：攻击者控制部分通信链路，拦截/修改/转发 Agent 间消息，但不直接改变 Agent 状态；在 Flat/Chain/Hierarchical 三种拓扑与多个任务上 ASR 最高 95.3、Stealthiness 最高 82.6。攻击成立的前提是 Agent 间消息缺少认证与完整性保护。
- **原文证据**：p.2 明确写 “inter-agent exchanges often lack rigorous authentication and integrity guarantees”；pp.3–5 威胁模型、攻击流程与优化；p.6 Table 1 主结果；p.7 讨论与“robust communication safeguards”呼吁。
- **论文实际使用的密码学**：**无**。没有 TLS/mTLS、签名、MAC/HMAC、证书、nonce、序列号、重放窗口、Merkle 日志、TEE 或密钥管理；唯一的“防御”是 LLM 语义检测器 A_S。`[PDF证据]`
- **是否定义并证明安全性质**：没有。p.2 的 “formally define” 是记号与约束优化（Eq.1–3），不是安全定义；stealthiness 是余弦相似度阈值与 LLM 检测器（Eq.10–11），不是计算不可区分性或检测误差界；无安全游戏、advantage、定理或归约。`[PDF证据]`
- **证明涵盖/未涵盖**：不覆盖认证/完整性机制、密钥泄露、被攻陷发送端、TLS 终止于 relay/broker 的情形；ASR 判定者与检测器 FPR/FNR 未说明；单次运行、无方差。
- **Agent 接口/信任边界**：攻击者只控制链路（p.3），不直接改 Agent 状态、不窃取密钥（后者为推断）；这意味着接收端无法区分“发送者原话”与“链路上被改写的消息”，因为没有密码学绑定。
- **研究缺口（原文支持）**：论文没有把任何密码学完整性保护作为基线或消融；没有讨论逐跳 TLS 与端到端消息签名的区别；没有密钥生命周期、性能或部署分析；语义检测器是唯一缓解，且可被自适应攻击规避。
- **密码学能解决 vs 语义判断**：mTLS、消息级 Ed25519/ECDSA 签名或 HMAC、每消息单调 nonce/序列号 + 重放窗口、对整段 transcript 的签名/Merkle 哈希链，能在本文“仅链路攻击者”模型下把在途篡改的 ASR 压到接近 0；这是密码学直接覆盖的部分。若攻击者攻陷发送端或持有密钥，签名不能阻止其发送恶意内容，此时仍需语义检测/授权策略；密码学与语义防御互补。若 TLS 在 relay/broker 终止，逐跳保护不足，需要端到端消息级签名。`[推断]`
- **置信度**：高（未认证通道假设与“无密码机制”有原文；“签名可阻断在途篡改”是标准推断，未在本文实验）。
- **尚待验证**：在消息总线加入 Ed25519 签名 + 单调 nonce + 接收端验签/防重放后重跑 MAST 的 ASR；被攻陷发送端/密钥泄露变体；逐跳 TLS vs 端到端签名的差异；密钥轮换/撤销与多租户 MAS；签名带来的延迟与吞吐成本；与 C39（拓扑元数据）和 C30（角色标签认证）的边界。

## C41. R3-79 SkillScope：语义最小权限缺少 artifact 完整性绑定与不可伪造 capability

- **问题描述**：SkillScope 对 Agent Skills 做动作级最小权限分析：静态图分析 + 沙箱 replay + LLM scope judge 估计授权谓词，再把约束写回 SKILL.md 与脚本。它在 68,312 个真实 Skill 中确认 6,590 个越权，约束后 action-in-task 违规从 472 降到 54（88.56% suppression），但同时保留 13/95 skills 与 54/472 action-in-task 的残余违规。
- **原文证据**：pp.3–8 方法（action graph、sandbox replay、Auth_p、artifact rewriting）；pp.9–13 生态测量与评测；p.14 Limitations；pp.16–21 附录 A–H。
- **论文实际使用的密码学**：**无**。没有签名、MAC、承诺、VC、TEE、attestation、OAuth/TLS 或密钥管理；`capability` 是“Skill 打包的功能/动作范围”的日常用法，不是不可伪造的密码学 capability；`Auth_p` 是 LLM 估计的语义授权谓词。`[PDF证据]`
- **是否定义并证明安全性质**：没有。没有授权凭证不可伪造性、敌手能力、委托/衰减、不可绕过性游戏或归约；least privilege 引用的是 Saltzer–Schroeder/NIST 的系统访问控制原则。`[PDF证据]`
- **证明涵盖/未涵盖**：不覆盖扫描后篡改、版本更新、自适应恶意 Skill、不可 replay 的行为、任务歧义导致的过宽/过窄授权；没有独立 reference monitor，运行时 guard 是自然语言 + if/else，由 Agent 的底层 LLM 解释。
- **Agent 接口/信任边界**：SkillScope 在发布前/使用前离线运行（marketplace/registry 或用户侧）；修复后的 bundle 没有完整性绑定，策略执行点不是独立的、可验证的监控器；平台 permission 不等于 task-scope authorization（p.13, p.19）。
- **研究缺口（原文支持）**：残余越权 13/95 skills、54/472 actions；无 adaptive attacker；单一默认 GPT-5.1 judge；无 IAA；真实 Agent 未报告 utility；扫描与执行之间存在 TOCTOU 窗口。
- **密码学能解决 vs 语义判断**：签名/attestation 可以把**被扫描的确切 bundle 哈希**绑定到发布者，防止扫描后篡改与静默版本漂移；透明日志可让版本可审计；MAC/签名 capability token 可让授权不可伪造并支持委托/衰减；这些是密码学直接覆盖的部分。但密码学不能判定某个 action 是否在任务语义范围内（Auth_p）、不能判定 Skill 是否恶意，也不能替代运行时 reference monitor；一个已签名但过宽的策略仍然危险。`[推断]`
- **置信度**：高（方法与非密码学性质有原文；完整性绑定/不可伪造 capability 为标准推断）。
- **尚待验证**：签名 bundle 的密钥管理与 marketplace 治理；capability token 如何绑定 task scope 与用户同意；扫描-执行 TOCTOU 的实测；自适应 Skill 与组合攻击；签名/验签的开销；与 C31（signed skill provenance）和 C33（verifiable authorization）的边界。

## C42. R3-84 大规模页内 IPI：内容来源签名无法解决 first-party 注入

- **问题描述**：论文对 1.2B URL / 24.8M hosts 做页内提示注入测量，验证出 15,387 个注入、11,722 个页面、2,042 个 host；按来源分，80.6% 为 first-party（9,731）、17.6% 为 third-party（2,124）、1.8% 为 user（220）；70% 的注入位于 non-visible-by-construction 通道，87% 总体不可见。LLM 摘要测试中 plain text 的最高 ASR 为 3.9%（small 模型 8.0%），HTML/snapshot 为 1.1%，raw 为 0.2%。
- **原文证据**：pp.1–2 摘要与贡献；pp.6–8 测量与来源分类；p.10 可见性与有效性；Table 5 provenance 与 §6.2/§10.2 的分母口径。
- **论文实际使用的密码学**：**无**。`provenance` 是 first-party/third-party/user 的来源分类，不是密码学 provenance；没有 TLS、C2PA、签名、VC、TEE 或 zk。`[PDF证据]`
- **是否定义并证明安全性质**：没有；这是经验测量，没有安全定义、游戏、定理或归约；有效性测试是一次性摘要，不是端到端 Agent 行为。
- **证明涵盖/未涵盖**：不覆盖真实 Agent 的后续动作、自适应攻击、non-English/多模态注入；Common Crawl 低估登录/平台内容；伴随论文 [58] 承载 Table 10、Figures 4/5/6/8 与 §10.3，未纳入语料。
- **Agent 接口/信任边界**：first-party 运营者同时控制页面内容与任何内容签名；third-party/user 内容可能由他人注入，但 first-party 注入是最大类别。页面是否渲染、是否进入 Agent 上下文，取决于 Agent 的观测通道（HTML/snapshot/raw），而非密码学认证。
- **研究缺口（原文支持）**：80.6% 的注入来自 first-party，说明“谁签发了内容”与“这条指令是否被授权”是不同问题；non-visible 通道占 70%，说明渲染/观测层而非传输层是关键；一次性摘要的低 ASR 不能外推到端到端 Agent。
- **密码学能解决 vs 语义判断**：TLS/C2PA/内容签名能认证**发布者与字节完整性**，但当发布者就是注入者时（80.6%），签名仍然有效，不能区分“开发者授权的内容”与“页面里塞入的指令”。真正需要的是 **instruction provenance/authorization**：把某条自然语言指令绑定到用户/开发者的授权，而不是只绑定内容来源。密码学可以承载签名的授权清单、capability token 或用户同意凭证，但不能判定某条指令在语义上是否被授权；这仍是策略/语义判断。non-visible 通道需要渲染感知的检测，密码学不覆盖。`[推断]`
- **置信度**：高（来源比例与测量方法有原文；instruction provenance 的边界为严格推断）。
- **尚待验证**：instruction provenance 的具体凭证设计；签名的开发者策略清单如何绑定到页面/指令；用户同意凭证与 first-party 注入的区分；non-visible 通道的渲染感知检测；端到端 Agent 的 ASR；与 C28/C34/C38 的边界。

> 以上均为阶段一观察，需在 124 篇读完后做跨文献验证、反例搜索与阶段三评分；不得直接当作研究创新点。
