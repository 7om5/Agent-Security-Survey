# 阶段四外部 Prior Art 索引

> **与 124 篇语料严格分离**：本目录只用于阶段四候选问题的“现有工作充分性检查”。外部论文/标准**不加入** 124 篇固定语料，不改变阶段三 H/T/A/F 分数，也不作为 124 篇的引用替代。
> 访问日期：2026-11-06。检索方式：WebSearch/WebFetch；只对候选问题做范围明确的核查，没有重新做全领域 Agent Security 综述。
> 限制：WebFetch 对 arxiv.org 被网络策略阻断，多数外部论文只通过 WebSearch 的标题/摘要/片段核对；未逐页精读全文。
> 证据等级：`standard`（标准原文/草案）、`peer-reviewed`（会议/期刊，书目级或摘要级）、`preprint`（arXiv/ePrint，摘要/片段级）、`industry`（厂商文档/开源实现/白皮书）、`prototype`（hackathon/未评审原型）。

## 1. 为什么需要外部核查

124 篇是 2024–2026 的定向样本；阶段四要判断“研究问题是否仍值得做”，必须检查 124 篇之外的：
- 密码学会议/期刊（PKC、CCS、ePrint、TDSC）；
- 标准（OAuth RFC、IETF WIMSE/OAuth drafts、UCAN、W3C VC）；
- 传统系统/分布式身份/供应链安全；
- 2026 年快速出现的 agent-specific 预印本与工业实现。

没有外部核查，容易把“124 篇没看到”误判为“没人做过”。

## 2. 关键外部发现（直接改变候选池）

| 发现 | 影响 |
|---|---|
| **CapScope**（arXiv:2609.08371）做 per-agent capability store、task ceiling、derive 非放大、dispatch 检查 | C6“跨工具组合授权”被覆盖，淘汰 |
| **CoSA / SCR / ChainCaps / SARA** 已系统化 skill/tool 组合攻击与 value-level capability budgets | C6 淘汰 |
| **ResidualAuth**（arXiv:2609.08062）形式化 revocable delegation 的 residual state | C7“历史相关授权”被覆盖，淘汰 |
| **Audience-Bound Persistent Memory**（arXiv:2609.36373）、**AkasicMEM**（arXiv:2609.25563）、NeurIPS 2026 memory laundering | C7 淘汰 |
| **SIGIL**（arXiv:2605.05274）、**Formal Analysis**（arXiv:2603.00195）、**ClosureBound**（arXiv:2609.05920）、Chainguard Sigstore | C8“Skill 签名+manifest”被覆盖，淘汰 |
| **HISTOR**、**MDPI Trustworthy MCP Registry**（Sigstore/Rekor） | C9“MCP registry 透明日志”已部署/有蓝图，淘汰 |
| **BlockA2A / Lineage / WCA / SPI-Net / Segurai** | C10“消息认证/provenance”是 commodity，淘汰 |
| **BAID / Ratify / DCT / Passport Alliance** | C11“Agent 身份+配置 attestation”被覆盖，淘汰 |
| **zkMe / Affinidi / GLEIF AMC / Agents++** | C12“purpose-bound VC”被覆盖，淘汰 |
| **zkAgent**（ePrint 2026/199 / CCS 2026）只证明执行与工具绑定，不证明授权覆盖 | C2 有差异化空间 |
| **ERC-8354 / CVA / Proof of Claw** 做单次动作 policy verdict / 执行绑定 | C2 必须做“多步 trace + delegation DAG 覆盖”，否则被覆盖 |
| **AATs / UCAN / Lineage / HBHC / Root-scoped** 已有衰减、撤销、离线验证 | C1/C4/C5 必须在“组合协议形式化/链完整性/隐藏撤销”上找窄缝 |
| **Cross-Protocol Attack Surface Analysis**（ProVerif/Tamarin/TLA+ 于 MCP/A2A/FIPA） | C1 的最接近形式化工作；它没有覆盖 AATs/UCAN 的衰减链 |
| **AIC 论文明确把 UCAN-style attenuation chains 的 ProVerif/Tamarin 建模列为 future work** | C1 的 gap 有外部证据支撑 |
| **HBHC**（arXiv:2605.20704）用 heartbeat 做离线级联撤销；**Root-scoped quiescence**（arXiv:2609.21284）做长运行 Agent 的撤销证书 | C5 的核心已被覆盖，只剩“无时钟/隐藏列表/累加器”窄变体 |
| **Acar–Nguyen PKC 2011 / Begum–Nakanishi 2022 / ePrint 2026/832** | C5/C3 的累加器与可撤销委托凭证是成熟密码学；纯原语创新空间小 |

## 3. 证据等级与使用限制

1. 多数 arXiv/ePrint 条目只核对了**标题、摘要/片段、版本日期**，没有逐页精读全文；论文中的具体数字/定理未独立复现。
2. 工业文档/仓库（HISTOR、Ratify、Chainguard、zkMe）只作为“已有实现/产品”的存在性证据，不当作同行评审结论。
3. 标准草案可能继续演化；引用时固定 draft 编号/版本。
4. 没有把任何外部论文加入 124 篇，也没有用外部论文替换 124 篇的证据。
5. 不能因为某外部工作存在，就断言“124 篇中的对应论文没有价值”；淘汰的是**阶段四的候选问题**，不是阶段三的方向评价。
6. **外部书目信息不反向修改阶段三**：例如 ePrint 页面把 zkAgent 标为 ACM CCS 2026，但本地 R3-80 PDF 无 venue，阶段三 metadata 仍保持 `unknown`；外部信息只用于阶段四 prior art，不混入 124 篇统计。

## 4. 文件

- `sources.json`：机器可读索引（id/title/type/year/url/scope/evidence_level/used_for）。
- 本 README：关键发现、证据等级、与 124 篇的边界。
- 具体“最接近工作—已解决—未解决”比较见 `../prior_art_review.md`。

## 5. 复核建议

若进入正式开题，应对 C1/C2 的最接近工作做**全文精读**（至少：AATs draft、UCAN spec、CapScope、ResidualAuth、zkAgent、ERC-8354、CVA、Cross-Protocol paper），并把本目录的“摘要级”证据升级为“全文级”。本阶段不把摘要级证据写成“已证明”。
