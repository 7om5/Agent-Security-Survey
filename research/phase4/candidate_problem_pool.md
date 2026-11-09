# 阶段四候选研究问题池（12 个）

> 每个问题按 13 项字段描述。`[PDF证据]` 指 124 篇语料；`[外部 prior art]` 指阶段四补充材料（见 `external_prior_art/`）；`[推断]`/`[待验证]` 明确标注。
> C1–C5 为进入完整评价的候选；C6–C12 为被现有工作淘汰或降级的候选，保留以说明筛选过程。

---

## C1｜FV-Delegation：衰减式 Agent 委托链的形式化验证

1. **问题名称**：对 AATs/UCAN/Biscuit/Lineage 一类衰减式委托链，在恶意子 Agent、链截断与撤销条件下，定义并机器验证授权可靠性、单调衰减、撤销可靠性与链完整性。
2. **所属方向**：B1 身份认证与权限委托；B2 任务授权/最小权限。
3. **真实场景**：用户 U 授权编排 Agent A0 完成一项任务；A0 通过 MCP/A2A 把子任务委托给 A1、A2；A1 调用工具 T。资源服务器只看到一条 token 链，无法确认链是否完整、是否被截断、撤销是否生效。
4. **保护资产**：用户授权范围、工具/数据访问权、撤销状态、审计责任链；不是模型权重或训练数据。
5. **主体与信任关系**：U（根授权者，可信）、A0/A1/A2（可能被提示注入或恶意，持有有效凭证）、T/MCP server（资源方，半可信）、AS（授权服务器，诚实但可能离线）、Revocation Service（诚实但间歇可达）。信任边界在每次跨 Agent/跨工具调用。
6. **攻击者能力**：恶意子 Agent 可获得一份合法但受限的委托；可重放、重排、截断链、组合 sibling token、选择 audience/resource、与另一 delegatee 串谋；不能伪造签名或攻破哈希。可选更强模型：被攻陷的 AS 或离线撤销。
7. **现有系统缺陷**：OAuth token exchange/RAR/DPoP 能表达“谁、什么、给谁、多久”，UCAN/AATs 能表达衰减，但**组合后的协议**是否有授权可靠性、截断抗性、撤销可靠性，缺少机器验证；实现 bug 与规范歧义可能让受限 token 放大。
8. **已有密码能解决的部分**：签名/MAC 保证 token 不可伪造；哈希/父链保证完整性；DPoP/mTLS 保证持有者绑定；状态列表/短 TTL 提供撤销；这些是“构件”，不是“组合协议的安全性”。
9. **未覆盖需求**：跨标准组合（OAuth token exchange + UCAN/AATs + A2A header）的授权不变量；链截断/尾端伪装；撤销在多跳、缓存、离线子 Agent 下的传播；audience/resource 混淆；sibling token 混用。
10. **密码学切入点**：把协议写成 ProVerif/Tamarin 的符号模型；用 correspondence assertions 表达“每个被接受的工具调用都存在一条从 U 到调用者的、scope 单调衰减的链”；用 Tamarin 的 global state/phase 表达撤销；发现攻击后提出最小修复（父哈希、presenter 绑定、链长/位置承诺、撤销 epoch、audience 绑定），再机器验证。
11. **124 篇最接近**：R2-07（B1 委托架构，OAuth/OIDC/VC，无形式化证明）[PDF证据：笔记 §5–§9]；R1-03（SAGA，X25519/OTK/X.509 + ProVerif，但只验证自家协议）[PDF证据：笔记 §5–§9]；R3-01（AC 只检查当前 query，说明链/历史缺口）[PDF证据：pp.3–4]；R3-36（多 Agent 控制流劫持）[PDF证据：§5.3]。
12. **潜在价值**：给 2026 年快速出现的 agent delegation 标准提供第一份系统化符号安全分析；可产出可复现攻击轨迹与修复；适合密码学/安全协议会议或 NDSS/ACSAC 类。
13. **难点与风险**：标准仍在演化；ProVerif 对全局撤销/状态表达弱，需 Tamarin；可能只找到已知攻击；建模保真度与“实现是否真的这样跑”之间有差距；若找不到新攻击，贡献会退化为“验证了已知正确性”。

---

## C2｜AuthTrace：授权感知的多步 Agent 轨迹证明

1. **问题名称**：让 Agent 生成一个简洁证明，证明**整条多步工具调用轨迹**都被一条委托 DAG 覆盖、每步 scope 不放大、累计约束满足，并可选择性隐藏敏感参数；验证者不需要信任 Agent 运行时。
2. **所属方向**：B4 策略审计与可验证执行；B1/B2。
3. **真实场景**：Agent 执行 5–20 次工具调用（读文件、查数据库、发邮件、付款）；审计方/资源方只拿到日志，无法确认“每次调用都确实被用户授权”，且日志可能被 Agent 删改。
4. **保护资产**：用户授权范围、工具调用参数中的敏感数据、审计证据完整性、累计预算/次数限制。
5. **主体与信任关系**：U（根授权者）、A0/A1（Agent，可能恶意/被注入）、T1..Tm（工具/资源服务器，签发收据）、V（审计方/资源方，验证 proof）、Revocation Service（撤销状态）。V 只信任公共参数、根公钥、proof。
6. **攻击者能力**：恶意 Agent 持有合法委托，但试图加入未授权调用、省略调用、替换参数、重放到另一任务、使用已撤销 token、与子 Agent 串谋；不能攻破 zkVM/承诺/签名。
7. **现有系统缺陷**：zkAgent 证明的是 **LLM 推理 + 工具绑定**，不证明授权覆盖；ERC-8354/CVA/ZK-ACE 主要做**单次动作**的策略 verdict；审计日志可被删改；多步轨迹的 delegation-DAG 覆盖与累计约束没有被统一证明。
8. **已有密码能解决的部分**：签名收据保证工具响应来源；哈希链/Merkle 保证日志完整性；zkVM/zkSNARK 保证计算正确；承诺隐藏参数；这些可以组合，但**“授权覆盖”关系**需要新的定义与电路/程序。
9. **未覆盖需求**：多步 trace 的授权路径存在性；scope 单调性；累计预算/次数；撤销新鲜度；选择性披露；proof 与 trace 的绑定；跨工具/跨 MCP 的收据组合。
10. **密码学切入点**：定义 `TraceAuth` 关系与 soundness/completeness/zero-knowledge/binding 游戏；用 RISC Zero/SP1 zkVM 跑一个 Rust 验证器（输入：trace commitment、delegation tokens、per-call scope、Merkle paths、revocation epoch；输出：accept/reject）；用 SHA-256 承诺 + Ed25519 收据；可选递归聚合每步 proof。证明义务：zkVM soundness + 承诺 binding + 签名 EUF-CMA；不证明 LLM 语义。
11. **124 篇最接近**：R3-80（zkAgent，one-shot transcript proof + zkTLS/zkVM，但不证明授权）[PDF证据：笔记 §5–§9，pp.8–15, 39–40, 52–53]；R2-07/R1-03（委托模型）[PDF证据：笔记 §5–§9]；R3-02/R3-75（审计/运行时强制，无密码证明）[PDF证据：§5–§7]。
12. **潜在价值**：把“可验证执行”从“模型跑对了”推进到“这次执行被授权了”；可用于审计、合规、跨组织 Agent 调用；应用密码学/系统安全价值高。
13. **难点与风险**：zkVM 工程与证明开销；策略语言/累计约束在电路或 Rust 验证器中的表达；ERC-8354/CVA/Proof of Claw 可能扩展到 trace，创新窗口窄；若 10 次调用证明 >10 分钟，MVP 不成立；不能把“证明授权”误写成“证明语义正确”。

---

## C3｜PrivPath：隐私保护的多跳委托路径证明

1. **问题名称**：Agent 向资源方证明“存在一条从用户到本次调用的有效、未撤销的委托路径”，但隐藏中间 Agent 身份、无关 scope 与委托拓扑。
2. **所属方向**：B1 身份/委托；C1/C4 隐私。
3. **真实场景**：跨组织 Agent 协作中，A2 不想向工具 T 暴露 A1 的身份、组织关系、其他任务的 scope；T 只想知道这次调用被合法授权。
4. **保护资产**：中间 Agent 身份、组织关系、委托图拓扑、无关 scope、用户身份（可选）。
5. **主体与信任关系**：U、A0/A1/A2、T、Verifier；A1 可能不愿暴露身份但仍需被追责；T 半可信；撤销服务诚实但可能离线。
6. **攻击者能力**：恶意 A2 试图伪造路径、扩大 scope、重放、链接同一用户的不同调用；恶意 T 与 A1 串谋试图去匿名化；撤销服务返回陈旧状态。
7. **现有系统缺陷**：UCAN/AATs 的链是**公开可验证**的，暴露全部中间 hop 与 scope；BBS+/SD-JWT 支持选择性披露，但多跳委托路径 + scope 衰减 + 撤销的组合缺少 agent-specific 设计；delegatable anonymous credentials 有理论，但未与 MCP/A2A 工具语义结合。
8. **已有密码能解决的部分**：BBS+/PS 签名、ZK 证明、累加器/状态列表、nullifier；这些足以构建，但需要新的关系定义与集成。
9. **未覆盖需求**：路径存在性证明；scope 子集证明；中间 hop 匿名但可追责（可选 escrow）；撤销不泄露身份；跨工具 audience 绑定；防止路径链接。
10. **密码学切入点**：BBS+ 签名委托凭证；ZK 证明“存在 U→A1→A2 的签名链，scope(A2)⊆scope(A1)⊆scope(U)，且本次调用 scope 匹配”；累加器/状态列表证明非撤销；nullifier 防重放；定义 unforgeability、scope soundness、anonymity/unlinkability、revocation soundness；在 ROM/AGM 下证明或给出 game-based 分析。
11. **124 篇最接近**：R2-07（委托凭证架构，公开链）[PDF证据：§5–§9]；R1-03（SAGA 认证协议，非匿名）[PDF证据：§5–§9]；R3-11（再识别）[PDF证据：§5–§7]；R3-59（拓扑推断）[PDF证据：§5–§7]。
12. **潜在价值**：把 Agent 委托从“全链路暴露”推进到“最小披露授权”；适合 PETs/应用密码学；可与 VC/BBS+ 生态结合。
13. **难点与风险**：delegatable anonymous credentials（Belenkiy et al. 2009；Acar–Nguyen PKC 2011）已有强 prior art，纯密码学新意可能不足；BBS+ 库与撤销/匿名组合复杂；性能与证明大小；若只做“BBS+ 包装 UCAN”，会被视为工程集成。

---

## C4｜ChainComplete：委托链截断抗性与完整性证明

1. **问题名称**：验证者如何在不联网的情况下判断一条委托链是否**完整**（没有隐藏祖先/尾端 hop），并证明“presenter 就是链的合法末端”？
2. **所属方向**：B1 身份/委托；B4 审计。
3. **真实场景**：A2 向 T 出示一条 U→A0→A2 的链，但实际还有 A1 这一跳被截断；T 看到的链签名都有效，却不知道 A1 的存在/撤销状态。
4. **保护资产**：委托链完整性、根授权者可见性、撤销传播、审计责任链。
5. **主体与信任关系**：U、A0/A1/A2、T、Verifier；A1/A2 可能恶意；T 不一定能访问 AS/日志。
6. **攻击者能力**：恶意 delegatee 删除中间 hop、重排 hop、尾端替换、重放旧链、与 A1 串谋隐藏；不能伪造根签名。
7. **现有系统缺陷**：UCAN 要求 invocation 链到 presenter，AATs 有 chain-position claim；但 W3C/IETF 讨论明确指出“聚合签名证明哪些 hop 签了，不证明所有期望 hop 都在”；截断在授权上可能无害，但在审计/撤销上不完整；缺少形式定义与紧凑证明。
8. **已有密码能解决的部分**：父哈希链、签名链、聚合签名、透明日志 checkpoint、链长/位置承诺；这些是构件。
9. **未覆盖需求**：链完整性（而非仅签名有效性）；presenter 绑定；根锚定；离线验证；与撤销状态结合；截断检测的 soundness。
10. **密码学切入点**：定义 `ChainComplete` 游戏（攻击者输出一条通过验证但缺少某个祖先 hop 的链）；构造根签名的链长/末端承诺 + 父哈希 + 聚合签名（BLS）+ 可选透明日志 checkpoint；证明 reduction 到 EUF-CMA/collision resistance；实现 Ed25519/BLS 原型。
11. **124 篇最接近**：R2-07（链式委托，无截断分析）[PDF证据：§5–§9]；R1-03（注册表/ token，非链完整）[PDF证据：§5–§9]；R3-36（多 Agent 控制流/重路由）[PDF证据：§5.3]；R3-68（消息篡改）[PDF证据：§5]。
12. **潜在价值**：补上 delegation 标准中“签名有效 ≠ 链完整”的缺口；可作为审计/撤销的前置；小论文/硕士论文体量合适。
13. **难点与风险**：ICISS 2026 已形式化 purpose-limited secrets 的 truncation；IETF aggregate signatures 已讨论完整性缺口；若“根签名链长”就够，贡献偏小；需要证明“没有更简单的现有机制”。

---

## C5｜RevHidden：隐藏撤销列表的离线委托撤销

1. **问题名称**：在 Agent 委托 DAG 中，验证者如何离线验证“该 token 未被撤销”，同时不暴露完整撤销列表、不依赖可信时钟？
2. **所属方向**：B1/B2。
3. **真实场景**：离线/边缘 Agent 在断网时调用工具；撤销列表包含敏感的组织/人员信息；状态列表/心跳需要联网或时钟同步。
4. **保护资产**：撤销状态新鲜度、撤销列表隐私、离线可用性、后代 token 的级联失效。
5. **主体与信任关系**：Issuer、Delegatee、Verifier、Revocation Service；Verifier 可能离线；Issuer 可信但可能不可达。
6. **攻击者能力**：被撤销的 Agent 使用缓存 token；重放旧 witness；与未撤销 sibling 串谋；拒绝更新；时钟回拨。
7. **现有系统缺陷**：HBHC 用父存活心跳 + 本地时钟，解决 zombie 但有时钟/心跳依赖；root-scoped quiescence 用证书/前端，假设较强；状态列表需要联网；累加器适合离线但 agent-specific 的级联/新鲜度语义未统一。
8. **已有密码能解决的部分**：RSA/双线性累加器、非成员证明、witness 更新、状态列表、短 TTL；这些是成熟原语。
9. **未覆盖需求**：隐藏撤销列表；无时钟离线；级联撤销（父撤销→所有后代）；witness 新鲜度；与 delegation DAG 的绑定；性能对比。
10. **密码学切入点**：动态累加器 + 非成员证明；按 epoch 更新；父 token 的撤销状态纳入子 token 的 witness；定义 revocation soundness/freshness；实现 Rust 原型，与状态列表/HBHC 对比。
11. **124 篇最接近**：R2-07（撤销/审计需求）[PDF证据：§5–§9]；R1-03（Provider 注册表/ token）[PDF证据：§5–§9]；R3-79（Skills 最小权限，撤销未展开）[PDF证据：§5–§9]。
12. **潜在价值**：离线 Agent 场景真实；累加器+隐私有密码学内容；可作为应用密码学论文。
13. **难点与风险**：HBHC/root-scoped/累加器 prior art 很近，创新窗口窄；若无时钟，freshness 本身需要某种“最后更新”假设；性能/证明大小可能不如状态列表；若审稿人认为“用累加器替换状态列表”是增量，价值下降。

---

## C6｜ToolComp：跨工具组合的授权非放大（已淘汰）

1. **名称**：单个工具调用都合法，但组合后产生未授权效果；研究组合级 capability 与数据流不变量。
2. **方向**：B2/E1。
3. **场景**：MCP 工具池中“读通讯录 + 发邮件”“读文件 + 上传”组合泄露数据。
4. **资产**：用户数据、工具权限、跨工具数据流。
5. **主体**：Agent、多个 MCP server、工具网关、用户。
6. **攻击者**：恶意工具描述/提示注入，诱导 Agent 组合合法工具。
7. **缺陷**：现有 AC 逐调用检查，不检查组合；R1-07/R1-12 已证明跨工具收割/污染。
8. **已有密码**：capability token、策略引擎、IFC。
9. **未覆盖**：组合级非放大、数据流标签、跨工具 provenance。
10. **切入点**：value-level capability budgets、线性 capability、IFC + 签名 provenance。
11. **124 篇**：R1-07、R1-12、R1-11、R3-47。
12. **价值**：真实且热。
13. **淘汰理由**：CapScope（arXiv:2609.08371）已做 per-agent capability store + derive；CoSA/SCR 已系统化组合攻击；ChainCaps 已做 value-level budgets；SARA 已做 runtime authorization。再做同类系统工作，硕士创新空间不足。

---

## C7｜MemAuth：记忆介导的历史相关授权（已淘汰）

1. **名称**：授权决策必须依赖跨会话记忆历史，而非当前 query；研究记忆写入/检索/融合的授权不变量。
2. **方向**：B2/F1。
3. **场景**：FragFuse 把违规 query 拆成片段写入记忆，后续检索融合绕过 AC。
4. **资产**：跨会话授权、记忆完整性、用户数据。
5. **主体**：用户、Agent、记忆库、AC 模块。
6. **攻击者**：普通用户多轮写入片段，不直接访问记忆。
7. **缺陷**：AC 只看当前 query；记忆写回不受策略约束（R3-01）。
8. **已有密码**：写入签名、Merkle 日志、capability、加密记忆。
9. **未覆盖**：历史相关授权状态、片段重组语义、跨会话撤销。
10. **切入点**：认证记忆 + 状态化 capability + 历史自动机。
11. **124 篇**：R3-01、R2-11、R3-22、R3-82。
12. **价值**：真实且与 Agent 记忆热。
13. **淘汰理由**：ResidualAuth（arXiv:2609.08062）已形式化 revocable delegation 的 residual state；Audience-Bound Persistent Memory（arXiv:2609.36373）已做记忆生命周期授权；AkasicMEM（arXiv:2609.25563）做 lineage 授权；NeurIPS 2026 已有“memory authorization laundering”。纯密码学增量小。

---

## C8｜SkillAttest：Skill 能力清单与运行时一致性证明（已淘汰）

1. **名称**：Skill 包签名 + 能力清单 + 运行时一致性 attestation。
2. **方向**：E3。
3. **场景**：Agent 安装第三方 Skill；Skill 声明只读文件，但运行时调用网络/写文件。
4. **资产**：宿主文件、网络、用户数据、供应链完整性。
5. **主体**：Skill 发布者、registry、Agent runtime、用户。
6. **攻击者**：恶意发布者、被攻陷的 Skill、rug-pull。
7. **缺陷**：签名只保证包来源/完整性，不保证行为与声明一致；R1-08/R3-23 已证明恶意 Skill/后门。
8. **已有密码**：Sigstore、in-toto/SLSA、哈希、签名、TEE attestation。
9. **未覆盖**：声明-运行时一致性、权限漂移、动态行为。
10. **切入点**：签名 manifest + 沙箱审计 + 运行时 attestation。
11. **124 篇**：R1-08、R3-23、R3-79。
12. **价值**：供应链真实。
13. **淘汰理由**：SIGIL（arXiv:2605.05274）已做 registry + 权限 manifest + runtime loader；Formal Analysis（arXiv:2603.00195）已做威胁模型 + capability constraints；ClosureBound（arXiv:2609.05920）做依赖闭包；Chainguard 已用 Sigstore/Rekor 验证 Skill。通用方案已被覆盖。

---

## C9｜MCPLog：MCP Registry 透明日志（已淘汰）

1. **名称**：MCP 工具定义的内容寻址 + Merkle 透明日志 + 客户端一致性验证。
2. **方向**：E1。
3. **场景**：MCP registry 的工具描述被 rug-pull/分区视图。
4. **资产**：工具元数据完整性、客户端信任。
5. **主体**：registry、MCP server、client、log auditor。
6. **攻击者**：恶意 registry/server、split-view。
7. **缺陷**：registry 只验证 namespace，不验证内容；客户端接受 face-value metadata。
8. **已有密码**：Merkle log、signed tree head、Sigstore/Rekor、JCS hash。
9. **未覆盖**：语义投毒（签名不解决）、生态治理。
10. **切入点**：透明日志 + 一致性 proof。
11. **124 篇**：R1-07、R2-17、R3-65、R3-13。
12. **价值**：真实。
13. **淘汰理由**：HISTOR 已部署 21k server 的 MCP 工具透明日志；MDPI Trustworthy MCP Registry 已给 Sigstore/Rekor 蓝图；MCP Security IG 已在讨论 registry signing。通用透明日志没有硕士创新空间。

---

## C10｜MsgProv：多 Agent 消息来源与因果溯源（已淘汰）

1. **名称**：MAS 消息签名 + nonce/重放窗口 + 因果 hash 链 + 责任追踪。
2. **方向**：G3。
3. **场景**：R3-68 消息篡改、R3-43 隐写串谋、R2-22 级联注入。
4. **资产**：消息完整性、发送者身份、审计链。
5. **主体**：多个 Agent、消息总线、工具。
6. **攻击者**：被攻陷 Agent、恶意 relay、串谋。
7. **缺陷**：MAS 消息常无认证；签名不阻止合法发送者的语义恶意。
8. **已有密码**：mTLS、Ed25519、MAC、nonce、hash chain。
9. **未覆盖**：语义串谋/隐写（密码学不能直接解决）。
10. **切入点**：签名消息 + 因果 provenance。
11. **124 篇**：R3-68、R3-43、R2-22、R3-36。
12. **价值**：工程真实。
13. **淘汰理由**：BlockA2A、Lineage、WCA、SPI-Net、Segurai 已覆盖 signed envelope/provenance/non-repudiation；通用消息认证是 commodity；语义串谋超出密码学。

---

## C11｜AgentID：Agent 实例身份与配置 attestation（已淘汰）

1. **名称**：用户→Agent 实例→子 Agent→工具的分层身份 + 模型/提示/工具清单 attestation + 撤销。
2. **方向**：B1/G1。
3. **场景**：用户委托一个云端 Agent 实例；需要确认实例的模型版本、系统提示、工具清单未被替换。
4. **资产**：身份真实性、配置完整性、委托绑定。
5. **主体**：用户、Agent provider、Agent 实例、verifier。
6. **攻击者**：恶意 provider、模型替换、配置漂移。
7. **缺陷**：现有 OIDC 只认证客户端，不认证 Agent 配置；VC 可认证属性但不绑定运行时。
8. **已有密码**：VC、DID、TEE attestation、Merkle 配置承诺。
9. **未覆盖**：配置 attestation 与委托 token 的绑定；跨 provider。
10. **切入点**：分层 VC + 配置承诺 + TEE/远程证明。
11. **124 篇**：R1-03、R2-07、R2-18、R3-80。
12. **价值**：真实。
13. **淘汰理由**：BAID（arXiv:2512.17538）已做 zkVM+zkTLS 身份与配置 Merkle proof；Ratify Protocol 做离线 delegated authority + hybrid signatures；DCT 做 Ed25519 capability token；Passport Alliance 做 Agent Passport。通用分层身份已被覆盖。

---

## C12｜PurposeVC：目的绑定的 Agent 数据访问凭证（已淘汰）

1. **名称**：用户签发 purpose-bound、最小披露的数据访问凭证；Agent 证明请求符合 purpose/recipient/expiry。
2. **方向**：C1/B2。
3. **场景**：Agent 代表用户访问健康/财务数据；资源方要求“仅用于本次任务”。
4. **资产**：PII、目的限制、数据最小化。
5. **主体**：用户、Agent、资源方、issuer。
6. **攻击者**：恶意 Agent、过度收集、二次外传。
7. **缺陷**：OAuth scope 太粗；purpose 是语义，难以密码学强制；Agent 可超范围使用。
8. **已有密码**：SD-JWT VC、BBS+、ZK、ABAC。
9. **未覆盖**：purpose 的形式化与执行；跨服务。
10. **切入点**：purpose-bound credential + ZK policy proof。
11. **124 篇**：R1-04、R3-07、R3-10、R3-33、R2-23。
12. **价值**：隐私真实。
13. **淘汰理由**：zkMe Agent-Ready Credentials、Affinidi Cierge、GLEIF Agent Mandate Credentials、Agents++ 已做 scope/purpose-bound VC + 选择性披露；纯密码学新意低，且 purpose 语义无法由密码学单独证明。

---

## 汇总

| ID | 问题 | 方向 | 状态 |
|---|---|---|---|
| C1 | FV-Delegation | B1/B2 | **保留** |
| C2 | AuthTrace | B4 | **保留** |
| C3 | PrivPath | B1/C | **保留（高风险）** |
| C4 | ChainComplete | B1/B4 | **保留（低风险）** |
| C5 | RevHidden | B1/B2 | **保留（备选）** |
| C6 | ToolComp | B2/E1 | 淘汰：CapScope/CoSA/ChainCaps/SARA |
| C7 | MemAuth | B2/F1 | 淘汰：ResidualAuth/Audience-Bound/AkasicMEM |
| C8 | SkillAttest | E3 | 淘汰：SIGIL/Formal Analysis/ClosureBound |
| C9 | MCPLog | E1 | 淘汰：HISTOR/MDPI/Sigstore |
| C10 | MsgProv | G3 | 淘汰：BlockA2A/Lineage/WCA/SPI-Net |
| C11 | AgentID | B1/G1 | 淘汰：BAID/Ratify/DCT/Passport |
| C12 | PurposeVC | C1/B2 | 淘汰：zkMe/Affinidi/GLEIF/Agents++ |

> 淘汰不等于“方向无价值”，而是“在 2026-11 的现有工作下，硕士阶段做同类问题难以形成非平凡创新”。C1–C5 的详细比较见 `candidate_evaluation.md` 与 `top_candidates.md`。
