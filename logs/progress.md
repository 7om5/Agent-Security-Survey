# 研究进度总账（跨会话）

> 最后更新：2026-11-03
> 当前阶段：**阶段一（124 篇全文精读）进行中**
> 真实完成度：**124 / 124 篇已全文精读（其中 117 篇 QUALITY_CHECKED、7 篇 FULLY_READ 有附录/补充材料缺口）；2,599 / 2,945 页深读（约 88.25%）**
> 不得把“已下载 / 已映射 / 已读摘要 / 已抽取全文”表述为“已精读”。

## 0. 覆盖率统计口径（2026-11-03 修正）

- `total_pages`：PDF 总页数（含封面、参考文献）。
- `extracted_pages`：已做文本抽取的页数；**不等于精读页数**。
- `deep_read_pages`：实际逐节深读的正文/附录页数，不含仅浏览的参考文献页。
- `browsed_pages`：已完成论文中仅浏览/非技术材料页数（一般为参考文献、封面、checklist）。
- `uncovered_pages`：已完成论文中尚未覆盖的页数（当前全部为 0）。
- `visually_checked_pages`：实际渲染 PNG 并人工核对的关键图/表页数。
- `QUALITY_CHECKED` 的含义：完整正文 + 方法/实验/证明相关附录 + 关键图表已检查；不是“笔记已生成”本身。
- **互斥页数恒等式**：`total_pages = deep_read_pages + browsed_pages + uncovered_pages + not_started_pages`。其中 `not_started_pages` 为 `NOT_STARTED` 论文的总页数；已开始论文按 deep/browsed/uncovered 三分。
- 当前核算：2,599（深读）+ 346（已读论文仅浏览）+ 0（未覆盖）+ 0（0 篇未开始）= **2,945**。此前报告把仅浏览页误并入“未开始”，已修正。

## 1. 语料与映射状态（阶段 0，已完成）

- 工作集：R1=15、R2=25、R3=84，共 **124** 个 ID；排除 6 篇：R3-51、R3-78、XX-01—XX-04。
- 本地 `papers/` 有 **124** 个 PDF；`registry/paper_manifest.csv` 中 124 个 ID 全部一对一精确匹配（标题规范化后 match_score=1.00）。
- `papers/已收集下载的论文.md` 为权威标题清单；未重新做检索、书目核验或去重。
- 排除项检查：`papers/` 中未发现六篇排除论文（`registry/mapping_issues.md`）。
- 总页数 2,945（`pdfinfo`）；SHA-256 已写入 manifest/status。
- `taxonomy/taxonomy_v1_0_original.md` 为原分类初稿只读副本；阶段二之前不修改。

## 2. 阅读状态（截至本文件更新）

| 状态 | 数量 | 说明 |
|---|---:|---|
| QUALITY_CHECKED | 117 | 正文＋相关附录＋关键图表已读，笔记含页码证据 |
| FULLY_READ | 7 | R2-25、R3-62、R3-63、R3-64、R3-66、R3-71、R3-84：正文与图表已读，但论文引用的附录/补充材料不在 PDF 中，质量检查不完整 |
| READING | 0 | — |
| EXTRACTED | 0 | 仅抽取、未精读的不单独计数 |
| NOT_STARTED | 0 | 尚未开始 |

已深读页数：**2,599 / 2,945**（批次 1：126p；批次 2：86p；批次 3：82p；批次 4：100p；批次 5：111p；批次 6：103p；批次 7：132p；批次 8：124p；批次 9：79p；批次 10：83p；批次 11：80p；批次 12：130p；批次 13：93p；批次 14：108p；批次 15：146p；批次 16：128p；批次 17：147p；批次 18：134p；批次 19：148p；批次 20：115p；批次 21：48p；批次 22：59p；批次 23：85p；批次 24：93p；批次 25：59p）。
页数核算：**2,599 深读 + 346 已读论文仅浏览 + 0 未覆盖 + 0 未开始 = 2,945**。各篇参考文献/封面/非技术 checklist 页归入“仅浏览”。

### 第一批覆盖率审计（2026-11-03）
- 审计发现：旧脚本把 `extracted_pages` 直接写成 PDF 总页数，导致“147 页”被误当作精读页数。
- 处理：新增 `deep_read_pages` 与 `read_scope` 两列；已回填 5 篇的真实深读范围。
- 补读：R3-80 的 Appendix B（pp.35–38）、C.2–C.6（pp.41–46）、D（pp.47–51）此前未逐节读，本次已补读；深读页数由 37 修正为 54。
- 其余 4 篇的参考文献页（R1-01 pp.16–20、R2-07 pp.10–13、R3-01 pp.16–18、R3-10 pp.10–12）按规范仅浏览，不构成缺口。

## 3. 已完成批次

### 批次 1（校准批，2026-11-03）

| ID | 短标题 | 类型 | 页数 | 笔记 | 主要密码学关联（初判，非最终评分） |
|---|---|---|---:|---|---|
| R1-01 | SoK: Attack and Defense Landscape of Agentic AI | SoK | 21 | `notes/R1-01.md` | IAM/OAuth/签名工具定义/凭证管理仅清单；无形式化 |
| R2-07 | Position: AI Agents Need Authenticated Delegation | Position | 21 | `notes/R2-07.md` | 委托 token、OIDC/OAuth、VC；直接但无证明 |
| R3-01 | FragFuse: memory-based AC bypass | Attack | 21 | `notes/R3-01.md` | 无密码学；证明“仅当前 query 的授权”不可靠 |
| R3-10 | SOPE: MCP privacy exfiltration | Attack | 25 | `notes/R3-10.md` | 无密码学；“统计不可区分”非形式化；MCP 供应链信任 |
| R3-80 | zkAgent: one-shot transcript proofs | System/Defense | 59 | `notes/R3-80.md` | 强：zkSNARK/GKR/lookup/zkTLS/zkVM，含形式定义与定理 |

校准结论：模板可用；证据颗粒度到 PDF 页码/章节/图表；已区分原文事实与个人推断。R3-80 篇幅最长（59 页），后续同类长文单独分批。

### 批次 2（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R1-02 | Automating Data Access Permissions | Measurement + System | IEEE S&P 2026 | 17/19 | `notes/R1-02.md` | 205 人 vignette；过度授权普遍；混合 ICL+LightGCN 预测 85.1%，但不执行权限、无密码学 |
| R1-03 | SAGA: Governing AI Agentic Systems | System + Protocol | NDSS 2026 | 18/18 | `notes/R1-03.md` | Provider 注册表 + 联系策略 + OTK/X25519 + 访问 token；ProVerif 符号验证；无计算安全证明 |
| R1-04 | AirGapAgent | Attack + Defense | ACM CCS 2024 | 14/15 | `notes/R1-04.md` | context hijacking 使隐私保护率 94.4%→45.2%；逻辑隔离 + LLM 最小化；单轮、无形式保证 |
| R1-05 | ISOLATEGPT | System | NDSS 2025 | 19/20 | `notes/R1-05.md` | hub-and-spoke 进程隔离；1,598 条攻击；20.2% ASR vs 7.6% PA 不可直接比较；保护依赖用户拒绝授权 |
| R1-06 | ACE | System + Defense | NDSS 2026 | 18/18 | `notes/R1-06.md` | 抽象/具体规划 + 格静态 IFC + Docker 隔离；1,054 条 InjecAgent 100% 安全评分；无 soundness 形式保证 |

批次 2 结论：5 篇全部达到 `QUALITY_CHECKED`；累计 10/124，212/2,945 页（7.2%）。R1-03 是本批唯一包含实际密码协议与原语（X25519、OTK、X.509、ProVerif）的论文，但仍是标准原语组合与符号验证，不是新密码构造；其授权策略仍由可信 Provider 执行。R1-02/04/05/06 均无密码学构造或证明，分别属于权限预测、LLM 数据最小化、OS 隔离与静态信息流分析。

### 批次 3（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R1-07 | Parasites in the Toolchain | Attack + Measurement | IEEE S&P 2026 | 16/18 | `notes/R1-07.md` | Parasitic Toolchain Attack；1,360 servers/12,230 tools 中 8.7% 工具、27.2% server 可被组合利用；9/10 链成功 |
| R1-08 | Malicious Agent Skills in the Wild | Measurement | USENIX Security 2026 | 18/21 | `notes/R1-08.md` | 98,380 skills → 157 恶意、632 漏洞；84.2% 漏洞在 SKILL.md 自然语言；Data Thieves vs Agent Hijackers |
| R1-09 | Formalizing Prompt Injection | Formalization + Benchmark | USENIX Security 2024 | 16/18 | `notes/R1-09.md` | 攻击构造的功能形式化（非安全游戏）；10 LLM × 7 任务；Combined Attack 最强；防御均不足 |
| R1-10 | StruQ | Defense | USENIX Security 2025 | 15/19 | `notes/R1-10.md` | prompt/data 双通道 + 保留 token + 结构化指令微调；手工攻击近 0%，TAP 9%，GCG 仍 58% |
| R1-11 | ToolHijacker | Attack | NDSS 2026 | 17/18 | `notes/R1-11.md` | no-box 工具选择攻击；单个恶意工具文档；ASR 最高 99.6%；StruQ/SecAlign 与检测防御不足 |

批次 3 结论：5 篇全部 `QUALITY_CHECKED`；累计 15/124，294/2,945 页（10.0%）。本批全部无密码学构造或证明：R1-07/08 是 MCP/Skills 供应链测量与攻击组合；R1-09 的“formalizing”只是攻击构造的数学记法；R1-10 是解析/训练层防御；R1-11 是优化型对抗 ML。共同暴露的系统缺口是“合法能力被组合滥用”和“指令/数据语义混淆”，密码学只能约束授权与来源，不能直接判定语义。

### 批次 4（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R1-12 | Les Dissonances / XTHP | Attack + Measurement | NDSS 2026 | 19/20 | `notes/R1-12.md` | 恶意工具寄生到受害工具控制流；66 工具中 75% 可劫持、72% 可收割、68% 可污染 |
| R1-13 | ObliInjection | Attack | NDSS 2026 | 18/18 | `notes/R1-13.md` | 多源单 segment 注入；order-oblivious loss 是排列期望，不是最坏情况保证；ASR ~99% |
| R1-14 | RENNERVATE | Defense | NDSS 2026 | 16/18 | `notes/R1-14.md` | 注意力 token 级检测/净化；FIPI 数据集；99.58% 准确率；白盒、经验性 |
| R1-15 | AgentDoS | Attack + System | USENIX Security 2026 | 16/21 | `notes/R1-15.md` | 资源生命周期 DoS；CodeQL+LLM fuzzing；36 零日/15 CVE；grey-box |
| R2-01 | ASB | Benchmark | ICLR 2025 | 31/36 | `notes/R2-01.md` | 10 场景/10 Agent/400 攻击任务/420 工具/13 LLM；Mixed Attack ASR 84.30%；防御普遍不足 |

批次 4 结论：5 篇全部 `QUALITY_CHECKED`；累计 20/124，394/2,945 页（13.4%）。本批仍无密码学构造：R1-12/13/15 是工具组合、排列期望注入与资源 DoS 攻击；R1-14 是注意力检测；R2-01 是 benchmark。R1-13 的 “order-oblivious” 与密码学 ORAM/混淆无关；R1-15 的资源配额是运维约束，不是密码学访问控制；R2-01 的 “formalizing” 是指示函数记法。

### 批次 5（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R2-02 | AgentDojo | Benchmark | NeurIPS 2024 | 22/26 | `notes/R2-02.md` | 4 环境/97 用户任务/27 注入任务/629 用例；GPT-4o targeted ASR 47.69%；确定性状态谓词 |
| R2-03 | AgentPoison | Attack | NeurIPS 2024 | 26/29 | `notes/R2-03.md` | RAG 记忆/KB 后门；触发词嵌入优化；ASR-r 81.2%、ASR-t 62.6%；<0.1% 投毒 |
| R2-04 | Watch Out for Your Agents | Attack | NeurIPS 2024 | 16/27 | `notes/R2-04.md` | Agent 后门分类 Query/Observation/Thought；LLaMA2-7B；50 条投毒 Query-Attack 100% |
| R2-05 | BadAgent | Attack | ACL 2024 | 14/17 | `notes/R2-05.md` | 微调数据投毒；主动/被动触发；ASR 85–100%，干净测试 0%；继续微调难清除 |
| R2-06 | AgentHarm | Benchmark | ICLR 2025 | 33/36 | `notes/R2-06.md` | 110 行为/440 变体/11 类/104 工具；模型本身高度配合；聊天越狱可迁移到 Agent |

批次 5 结论：5 篇全部 `QUALITY_CHECKED`；累计 25/124，505/2,945 页（17.2%）。本批以 benchmark 与 ML 后门/数据投毒为主，均无密码学构造或证明。R2-03/R2-04/R2-05 的 “backdoor” 是 ML 后门，不应类比密码学后门；R2-02/R2-06 的 “security benchmark” 不是安全定义或认证。

### 批次 6（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R2-08 | GuardAgent | Defense/System | ICML Workshop 2025 | 25/27 | `notes/R2-08.md` | 自然语言策略→代码 guardrail agent；EICU-AC 316 例 ≥98.4%，Mind2Web-SC 200 例 ≥83.5% |
| R2-09 | SafeArena | Benchmark | ICML 2025 | 34/38 | `notes/R2-09.md` | 250 有害+250 安全任务；GPT-4o 直接完成 22.8% 有害任务；任务分解可越狱 Claude |
| R2-10 | AdvAgent | Attack | ICML 2025 | 11/13 | `notes/R2-10.md` | HTML 属性注入；SFT+DPO prompter；SeeAct+GPT-4V ASR 97.5%，Gemini 1.5 99.8% |
| R2-11 | MEXTRA | Attack | ACL 2025 | 17/20 | `notes/R2-11.md` | 黑盒记忆提取；locator+aligner；30 条提示可提取 50 条记录；edit-distance 检索更易泄露 |
| R2-12 | Task Shield | Defense | ACL 2025 | 16/18 | `notes/R2-12.md` | 任务对齐运行时护栏；AgentDojo ASR 47.69%→2.07%，但 Slack 中位延迟 6.17s→62.56s |

批次 6 结论：5 篇全部 `QUALITY_CHECKED`；累计 30/124，608/2,945 页（20.7%）。本批仍无密码学构造：R2-08/R2-12 是 LLM 策略检查/任务对齐护栏；R2-09/R2-10/R2-11 分别是 Web 安全评测、黑盒红队与记忆提取。R2-12 的延迟数据说明“LLM 语义检查”作为运行时控制的工程代价，是后续密码学/系统混合方案的重要对照。

### 批次 7（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R2-13 | AGrail | Defense/System | ACL 2025 | 34/36 | `notes/R2-13.md` | 双 LLM 运行时护栏 + memory/TTA；Safe-OS 100 例；任务风险 ~96.3%，但部分基线更好 |
| R2-14 | AI Agent Deployment Competition | Measurement | NeurIPS 2025 | 33/37 | `notes/R2-14.md` | ~180 万次攻击/44 场景/22 LLM；会话 ASR 12.7%，间接注入 27.1%，直接 5.7% |
| R2-15 | WASP | Benchmark | NeurIPS 2025 | 20/23 | `notes/R2-15.md` | GitLab/Reddit 84 任务；中间 ASR 16.7–85.7%，端到端仅 0–16.7%（security by incompetence） |
| R2-16 | DRIFT | Defense | NeurIPS 2025 | 25/29 | `notes/R2-16.md` | Planner+Validator+Injection Isolator；AgentDojo ASR 30.7%→1.3%，但为字符串过滤 |
| R2-17 | MCP-SafetyBench | Benchmark | ICLR 2026 | 20/23 | `notes/R2-17.md` | 245 用例/20 攻击类型/13 LLM；ASR 29.80–48.16%；安全提示几乎无效 |

批次 7 结论：5 篇全部 `QUALITY_CHECKED`；累计 35/124，740/2,945 页（25.1%）。本批均无密码学构造或证明。R2-13/16 是 LLM 语义护栏；R2-14/15/17 是竞赛/benchmark。R2-15 的“中间劫持高、端到端完成低”提示：攻击成功与真实危害之间需要分开度量；R2-16 的“injection isolation”是记忆内容过滤，不是密码学隔离。

### 批次 8（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R2-18 | A2ASecBench | Benchmark | ICLR 2026 | 21/24 | `notes/R2-18.md` | A2A AgentCard spoofing ASR 0.82；capability cloaking 降效用；签名/attestation 仅建议未实现 |
| R2-19 | OpenAgentSafety | Benchmark | ICLR 2026 | 21/26 | `notes/R2-19.md` | 真实工具/356 任务；安全脆弱轨迹上不安全率 49–73%；LLM judge 不可靠 |
| R2-20 | Breaking Agent Backbones | Benchmark | ICLR 2026 | 37/38 | `notes/R2-20.md` | threat snapshot；30 场景/210 攻击/34 LLM；vulnerability score 0.13–0.63 |
| R2-21 | TAMAS | Benchmark | ACL 2026 | 28/31 | `notes/R2-21.md` | 300 实例/6 攻击；impersonation 最高 82%，DPI 81%；“Byzantine”是行为标签 |
| R2-22 | ACIArena | Benchmark | ACL 2026 | 17/18 | `notes/R2-22.md` | 28 攻击/1,356 用例/6 MAS；级联注入 ASR 最高 100%；拓扑不能解释鲁棒性 |

批次 8 结论：5 篇全部 `QUALITY_CHECKED`；累计 40/124，864/2,945 页（29.3%）。本批均为行为级 benchmark，无密码学构造或证明。R2-18 的签名/attestation 只是 prompt 级建议；R2-21 的 “impersonation” 是未认证权威声称，但威胁模型允许改写用户查询，不能直接套用身份认证；R2-19 的 Docker 只是 OS 隔离，不是安全架构。

### 批次 9（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 状态 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|---|
| R2-23 | Privacy-R1 | Defense/System | ACL 2026 | 11/14 | QUALITY_CHECKED | `notes/R2-23.md` | 本地/远程 LLM 句级路由；PPO；Med-PCD 89.5% 质量/5.1% 泄露；隐私仅 PII 字符串匹配 |
| R2-24 | Personalization Legitimizes Risks | Measurement | ACL 2026 | 25/27 | QUALITY_CHECKED | `notes/R2-24.md` | 记忆个性化使有害请求“情境合理”；ASR 相对上升 15.8–243.7%；检测-反思降 27.4% |
| R2-25 | Unintended Misalignment | Measurement/Defense | AAAI 2026 | 7/9 | **FULLY_READ** | `notes/R2-25.md` | 良性 agentic 微调降低拒绝率；PING 前缀搜索；**附录/Table 16 不在 PDF 中，质量检查不完整** |
| R3-02 | MATE | Defense/Auditing | USENIX Security 2026 | 18/21 | QUALITY_CHECKED | `notes/R3-02.md` | 移动 GUI Agent 轨迹级策略审计；14 万合成轨迹；MATE-3B REAL 95.06% |
| R3-03 | MASLeak | Attack/Measurement | USENIX Security 2026 | 18/21 | QUALITY_CHECKED | `notes/R3-03.md` | 黑盒 MAS IP 提取；蠕虫式查询分解；8.7 次查询/<11 秒；防御不足 |

批次 9 结论：4 篇 `QUALITY_CHECKED` + 1 篇 `FULLY_READ`（R2-25 附录缺失）；累计 45/124 已全文精读，943/2,945 页（32.0%）。R2-23 的“隐私”是 PII 不外发，不是密码学隐私；R2-24 的个性化是语义合法化，不是授权；R3-02 的审计是事后分类，不是可验证执行；R3-03 的 IP 提取是语义 prompt extraction，不是密码学侧信道。

### 批次 10（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-04 | MELON | Defense | ICML 2025 | 18/20 | `notes/R3-04.md` | 掩码重执行+工具调用缓存；AgentDojo ASR 0.32%；“Provable” 只是 Hoeffding 统计界 |
| R3-05 | G-Safeguard | Defense | ACL 2025 | 13/16 | `notes/R3-05.md` | 话语图+GAT 节点检测/剪边；部分设置 ASR 反升；图拓扑不是认证 |
| R3-06 | Position: Agent Security Redefinition | Position | ICML 2026 | 11/13 | `notes/R3-06.md` | 授权上下文四属性（Source Authorization/Task/action alignment/Data Isolation）；无形式化 |
| R3-07 | MINIM | Defense | ICML 2026 | 15/17 | `notes/R3-07.md` | 本地 broker 清洗 UI 观测；honest-but-curious 远程；trusted local 不是 TEE |
| R3-08 | Contextualized Privacy Defense | Defense | ICML 2026 | 26/28 | `notes/R3-08.md` | CDI 逐步隐私指引 + GRPO；PP 94.2%/HS 80.6%/AD 86.5%；自适应攻击 PP 79.5% |

批次 10 结论：5 篇全部 `QUALITY_CHECKED`；累计 50/124 已全文精读（49 QUALITY + 1 FULLY_READ），1,026/2,945 页（34.8%）。R3-04 的 “Provable” 是统计界不是密码学证明；R3-06 的授权上下文框架没有形式化谓词；R3-07 的 trusted local sanitization 是部署假设，不是 TEE/attestation；R3-08 的上下文隐私是语义判断。

### 批次 11（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-09 | PrivAct | Defense | ICML 2026 | 18/20 | `notes/R3-09.md` | 多 Agent 偏好训练内化上下文隐私；Llama-8B leak 6.263% vs Vanilla 9.697%；12.32 是百分点且为 Mistral 特定运行点；无密码学 |
| R3-11 | InferLink | Measurement | ICML 2026 | 15/18 | `notes/R3-11.md` | LLM Agent 推断式再识别；Netflix m=2 GPT-5 79.17% vs 经典基线 56.0–60.2%；LSR 非形式化匿名，ZK 指“无指定目标” |
| R3-12 | Architecture Matters | Measurement | ICML 2026 | 21/24 | `notes/R3-12.md` | 13 种 MAS 架构 × 3 环境；BrowserART HT 10.0%→38.0%（3.8×）；无普适安全架构；非密码学 |
| R3-13 | Position: Trustworthy MCP | Position | ICML 2026 | 9/13 | `notes/R3-13.md` | 七原则分析 + 五类干预点；指出 registry 缺密码学验证，但自身无协议字段/实现/实验；纯治理议程 |
| R3-14 | AgentLAB | Benchmark | ICML 2026 | 17/19 | `notes/R3-14.md` | 五类长程攻击/28 环境/644 用例；Overall ASR 28.9–81.5%；单轮防御迁移差；行为级 benchmark |

批次 11 结论：5 篇全部 `QUALITY_CHECKED`；累计 55/124 已全文精读（54 QUALITY + 1 FULLY_READ），1,106/2,945 页（37.6%）。本批均无形式化密码构造：R3-09 是偏好学习内化语义隐私；R3-11 是经验性再识别评测（anonymization 仅为去直接标识符，非 DP/密码学匿名）；R3-12 是 MAS 架构行为评测；R3-13 是 MCP 治理 Position，仅指出 registry 缺密码学验证；R3-14 是长程攻击 benchmark。R3-13 与 R3-11 分别产生 C28/C29 两条密码学交叉观察（签名 Server Cards/透明日志/attestation；形式化匿名/DP/PPRL 边界）。

### 批次 12（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-15 | MT-AgentRisk / ToolShield | Benchmark + Defense | ICML 2026 | 38/40 | `notes/R3-15.md` | 多轮工具攻击 taxonomy（8 子类）+ 365 任务；单轮→多轮 ASR +16.07pp；ToolShield 平均降 29.8pp；无密码学 |
| R3-16 | TRAP | Attack/Benchmark | ICML 2026 | 16/17 | `notes/R3-16.md` | 网页说服式注入 benchmark；平均 ASR 25.1%，按钮比链接强 3.5×；单点击指标；无密码学 |
| R3-17 | Role Confusion | Attack + 机理分析 | ICML 2026 | 28/31 | `notes/R3-17.md` | 模型按文风而非 role label 归属；CoT Forgery 均值 60.2%（17–94%）；agent 外传 56–70%；无密码学 |
| R3-18 | DEACTION | Defense + Benchmark | ICML 2026 | 27/30 | `notes/R3-18.md` | MISACTBENCH 558 轨迹/2,264 动作标签；DEACTION 离线 F1 70.7–82.8、在线 ASR 60→6；无密码学 |
| R3-19 | CausalArmor | Defense | ICML 2026 | 21/23 | `notes/R3-19.md` | LOO 因果归因 + 选择性净化；AgentDojo ASR 0.62/0.42/0.40 vs 32.47/12.01/7.06；Prop 4.1 仅概率界 |

批次 12 结论：5 篇全部 `QUALITY_CHECKED`；累计 60/124 已全文精读（59 QUALITY + 1 FULLY_READ），1,236/2,945 页（42.0%）。本批均无形式化密码构造：R3-15/16 是多轮工具攻击与网页说服 benchmark；R3-17 是角色混淆的表示层机理分析（其“authentication”是比喻，不是密码学认证）；R3-18 是动作级语义护栏；R3-19 的 Proposition 4.1 是条件性概率界，不是密码学定理。R3-17 产生 C30：签名 role label 只能认证通道/标签，不能改变模型对文风的角色感知；真正可落地的密码工程接口是 tool gateway 的 capability/egress 与签名审计，而非模型内部角色认证。

### 批次 13（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-20 | CausalTrace | System/Defense | ICML 2026 | 18/21 | `notes/R3-20.md` | 轨迹 SCM + do-calculus 反事实；半真实 99.2 F1、OOD 92.6；无密钥 SHA-256 仅作标记，非认证 |
| R3-21 | MOSAIC | Defense | ICML 2026 | 20/22 | `notes/R3-21.md` | plan–check–act/refuse + 成对偏好 RL；GPT-4o harm 0.31→0.07；Phi-4 安全回退；无密码学 |
| R3-22 | A-MemGuard | Defense | ICML 2026 | 26/27 | `notes/R3-22.md` | 语义共识过滤 memory poisoning；ASR-r 100→2.13；consensus 非 BFT，无写入认证 |
| R3-23 | SkillTrojan | Attack | ICML 2026 | 12/14 | `notes/R3-23.md` | skill 供应链后门；“加密”实为 XOR+Base64，密钥随包分发；扫描器 98.2%/99.4% 判 safe |
| R3-24 | AcMAS | Defense | ICML 2026 | 17/20 | `notes/R3-24.md` | 激活空间 one-class 检测 + 修正；F1 0.92–0.95；需白盒激活；无密码学 |

批次 13 结论：5 篇全部 `QUALITY_CHECKED`；累计 65/124 已全文精读（64 QUALITY + 1 FULLY_READ），1,329/2,945 页（45.1%）。本批均无形式化密码构造：R3-20 是因果推断/轨迹审计，无密钥 SHA-256 不是认证；R3-21 是模型层偏好对齐；R3-22 是 LLM 语义共识；R3-23 的 “encrypted payload” 是白盒混淆；R3-24 是激活异常检测。新增 C31（R3-23：签名 skill 不能阻止合法 skill 组合滥用，capability sandbox 才是执行层接口）与 C32（R3-22：签名 memory/Merkle log 只能检测未授权篡改，不能检测授权写入的恶意内容）。

### 批次 14（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-25 | When Embedding Defenses Fail | Analysis/Attack | ICML 2026 | 12/13 | `notes/R3-25.md` | 嵌入可分性失效 + Lipschitz 局部界；Slow Drift/Wrapper/Chaos；无密码学 |
| R3-26 | Node Contribution Backprop | Defense | ICML 2026 | 14/15 | `notes/R3-26.md` | signed DAG（边符号，非数字签名）+ 贡献反向传播；Flat 76.3→85.4%；无密码学 |
| R3-27 | SafeSearch | Benchmark | ICML 2026 | 42/46 | `notes/R3-27.md` | 搜索红队 300 用例/3 scaffold/17 模型；最高 ASR 90.5%；sandbox 非 TEE |
| R3-28 | JustAsk | Attack/Measurement | ICML 2026 | 24/25 | `notes/R3-28.md` | code agent 系统提示提取；41 模型 100%@0.7；Claude Code 6,973 tokens；非密码学 |
| R3-29 | Cyber Refusals | Framework/Benchmark | ICML 2026 | 16/19 | `notes/R3-29.md` | 网络安全拒绝边界；Hard 6/8 模型 0% 拒绝；授权不可验证；无密码学 |

批次 14 结论：5 篇全部 `QUALITY_CHECKED`；累计 70/124 已全文精读（69 QUALITY + 1 FULLY_READ），1,437/2,945 页（48.8%）。本批均无形式化密码构造：R3-25 是嵌入空间/Lipschitz 分析；R3-26 的 “signed” 是边符号，不是数字签名；R3-27 是搜索红队 benchmark；R3-28 是黑盒 system prompt 语义提取（再次印证 C24：加密/TEE 不能阻止模型描述它必须读取的提示）；R3-29 是拒绝边界框架。新增 C33（R3-29：VC/PKI/capability 可把授权 scope 变成可验证凭证，但不能判定授权本身或行为是否安全）。

### 批次 15（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-30 | ToolEmu | Benchmark/Evaluation | ICLR 2024 | 48/68 | `notes/R3-30.md` | LM 仿真工具沙箱 + adversarial emulator + safety evaluator；最强 agent 仍 23.9% 失败；非 TEE |
| R3-31 | BrowserART | Benchmark/Measurement | ICLR 2025 | 17/22 | `notes/R3-31.md` | chat 对齐不迁移到 browser agent；GPT-4o 12%→74%，human rewrite 98%；无密码学 |
| R3-32 | VWA-Adv/ARE | Attack+Evaluation | ICLR 2025 | 19/22 | `notes/R3-32.md` | 200 多模态对抗任务 + 组件图鲁棒性分解；最高 67%；AdvIn 非密码学定义 |
| R3-33 | EIA | Attack | ICLR 2025 | 29/32 | `notes/R3-33.md` | 环境注入 PII 泄露；特定 PII 70%、完整请求 16%；防御 prompt 无效；无密码学 |
| R3-34 | Search Privacy | Attack+Defense | ICLR 2026 | 33/35 | `notes/R3-34.md` | 并行搜索攻击/防御；A2 42.2%、D2 7.1%；同意伪造；D2 仅 prompt 级认证 |

批次 15 结论：5 篇全部 `QUALITY_CHECKED`；累计 75/124 已全文精读（74 QUALITY + 1 FULLY_READ），1,583/2,945 页（53.8%）。本批均无形式化密码构造：R3-30 的 “sandbox” 是 LM 仿真；R3-31/32 是 browser/multimodal 行为评测；R3-33 是环境注入 PII 泄露；R3-34 的 “authenticated account” 是 prompt 检查。新增 C34（R3-33：签名字段清单/PII tokenization 可约束字段，但不能判定页面语义意图）与 C35（R3-34：签名同意凭证 + nonce 绑定可防伪造/重放，但不能防被说服的合法同意）。

### 批次 16（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-35 | PRUDENTIA | Defense | ICLR 2026 | 30/32 | `notes/R3-35.md` | FIDES IFC + 策略感知规划 + endorsement；o3-mini TCR@0 59.1% vs 50.1%；“provable” 是系统保证 |
| R3-36 | Control-flow hijacking | Attack+Defense | ICLR 2026 | 28/32 | `notes/R3-36.md` | CFH 绕过 alignment check；CONTROLVALVE CFG+NL 规则；0% ASR；CFI 非密码学 |
| R3-37 | Sequential monitors | Defense | ICLR 2026 | 25/30 | `notes/R3-37.md` | 轻量序列 monitor；GPT-4o-mini F1 0.918；PAIR 弱自适应；无密码学 |
| R3-38 | VPI-Bench | Attack+Benchmark | ICLR 2026 | 20/24 | `notes/R3-38.md` | 视觉提示注入 306 用例；CUA 51.3%、BUA 100%；沙箱预配置资源 |
| R3-39 | ChatInject | Attack | ICLR 2026 | 25/28 | `notes/R3-39.md` | chat template 角色伪造；InjecAgent 15.13→45.90%；模板非认证 |

批次 16 结论：5 篇全部 `QUALITY_CHECKED`；累计 80/124 已全文精读（79 QUALITY + 1 FULLY_READ），1,711/2,945 页（58.1%）。本批均无形式化密码构造：R3-35 的 “provable” 是 IFC 系统保证；R3-36 的 CFI 是系统安全属性；R3-37 是 prompt-engineered 序列监控；R3-38 是视觉注入 benchmark；R3-39 是 chat-template 伪造。新增 C36（R3-35：IFC 的 provable 不是密码学证明；endorsement 是可信去分类事件，签名/TEE 只能认证标签/执行，不能保证策略语义正确）。

### 批次 17（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-40 | AuraGen/Safiron | Defense+Benchmark | ICLR 2026 | 27/32 | `notes/R3-40.md` | 预执行护栏 + 合成风险轨迹；Safiron 0.949/0.973；无执行强制；非密码学 |
| R3-41 | Mandela Effect | Benchmark+Measurement | ICLR 2026 | 27/30 | `notes/R3-41.md` | 脚本化群体压力使答案翻转；GPT-5 17.63→41.59；非密码学 |
| R3-42 | PrivacyLens | Benchmark | NeurIPS 2024 | 31/35 | `notes/R3-42.md` | Contextual Integrity 隐私规范评测；probing 98.99% 但 LR 24.54%；非密码学 |
| R3-43 | Secret Collusion | Theory+Benchmark | NeurIPS 2024 | 38/48 | `notes/R3-43.md` | 隐写串谋；4 个非形式定理；GPT-4 群体隐写 26%；非密码学构造 |
| R3-44 | AgentDAM | Benchmark | NeurIPS 2025 | 24/26 | `notes/R3-44.md` | data minimization 端到端评测；泄露 9.8–45.9%；privacy CoT 0.821–0.939；非密码学 |

批次 17 结论：5 篇全部 `QUALITY_CHECKED`；累计 85/124 已全文精读（84 QUALITY + 1 FULLY_READ），1,858/2,945 页（63.1%）。本批仍无密码学构造：R3-40 是预执行分类护栏；R3-41 是群体说服/summary 实验；R3-42/44 是语义隐私 benchmark；R3-43 是信息论隐写/能力评测，虽有 4 个“定理”，但没有安全游戏、KL/检测误差、容量可达性或密码学归约。新增 C37（R3-43：Secret Collusion 的 formal/capacity 主张强于实际形式化；LLM 群体隐写 26% 且监控者信息不对称）。

### 批次 18（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-45 | AgentAuditor | Benchmark/Evaluator | NeurIPS 2025 | 46/58 | `notes/R3-45.md` | 记忆增强评估器；R-Judge 96.31 F1；ASSE-Safety 91.59；CoT 用已知标签条件化 |
| R3-46 | OS-Harm | Benchmark | NeurIPS 2025 | 29/32 | `notes/R3-46.md` | CUA 安全 150 任务；unsafe 21–29%；jailbreak 到 100%；judge F1 0.76 |
| R3-47 | AMA | Attack | NeurIPS 2025 | 21/24 | `notes/R3-47.md` | 工具 metadata 黑盒优化；targeted ASR 81–95%；auditor TPR 1.7–6.3% |
| R3-48 | Systems Problem | Position | 未标注/2026 | 13/18 | `notes/R3-48.md` | 模型不可信、系统层强制不变量；密码学只能加固执行边界 |
| R3-49 | Adaptive Adversaries | Benchmark | 未标注/2026 | 25/26 | `notes/R3-49.md` | 15 轮自适应攻击 ASR 7.9–16.8% vs 首轮 0–1%；provenance 段落降 ASR |

批次 18 结论：5 篇全部 `QUALITY_CHECKED`；累计 90/124 已全文精读（89 QUALITY + 1 FULLY_READ），1,992/2,945 页（67.6%）。本批均无密码学构造：R3-45/46 是 evaluator/CUA benchmark；R3-47 是 metadata 攻击；R3-48 是系统安全 Position；R3-49 是多轮自适应 benchmark。新增 C38（R3-48：密码学可加固 TCB/attestation/capability/审计等执行边界，但不能替代“什么算 sensitive/harmful”的语义判断与 NL→formal 策略翻译）。

### 批次 19（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-50 | ORBIT | Framework/Benchmark | NeurIPS 2026 投稿 | 40/45 | `notes/R3-50.md` | MAS 安全评测六层框架；monitor 72→12% compromised，但 collusion 30→30% |
| R3-52 | Agent Meltdowns | Measurement/Benchmark | 未标注/2026 | 30/32 | `notes/R3-52.md` | 良性错误触发 13 类 accidental meltdown；64.79% rollout 至少一个 medium/high |
| R3-53 | MechSuits | Defense+Benchmark | NeurIPS 2026 | 24/27 | `notes/R3-53.md` | 线性探针 + 激活 steering；检测 95–99%，ASR 降至 4–17%；白盒 |
| R3-54 | ASPI | Benchmark/Measurement | ICML Workshop 在投 | 28/30 | `notes/R3-54.md` | 澄清通道放大注入；clarif ASR 最高 63.1%；状态/通道混杂 |
| R3-55 | AgentForesight | System/Benchmark | ICML Workshop 2026 | 26/29 | `notes/R3-55.md` | 前缀级在线审计；Exact-F1 66.44；FAR 2.37%；无对抗评估 |

批次 19 结论：5 篇全部 `QUALITY_CHECKED`；累计 95/124 已全文精读（94 QUALITY + 1 FULLY_READ），2,140/2,945 页（72.7%）。本批均无密码学构造：R3-50 是 MAS 评测框架；R3-52 是良性错误触发的行为测量；R3-53 是表示层探针/steering；R3-54 是澄清通道注入 benchmark；R3-55 是 ML 在线审计。未新增密码学交叉观察；R3-52 的 TLS 降级/凭据泄露观察归入已有“密码工程只能加固执行边界”的 C38 模式，不单独计数。

### 批次 20（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|
| R3-56 | SchemeArena | Benchmark/Measurement | 未标注/2026（arXiv） | 37/39 | `notes/R3-56.md` | 400 场景因子化 scheming 压力测试；goal-only 使 scheming 74.4–81.2%；SCOUT 指标疑为全判正 |
| R3-57 | PhoneSafety | Evaluation/Benchmark | 未标注/2026（arXiv） | 24/26 | `notes/R3-57.md` | 700 安全关键手机时刻；general SR 与 Cond-Safe 仅 r=0.239，与 1−CFR r=0.906；能力混淆 |
| R3-58 | PsySafe | Attack+Defense+Evaluation | ACL 2024 | 27/30 | `notes/R3-58.md` | 六维 dark traits 注入；PDR 5.6→98.0%；Doctor 降 JDR 但阈值与 Table 5 矛盾 |
| R3-59 | CIA | Attack | ACL 2026 | 15/17 | `notes/R3-59.md` | 黑盒通信拓扑推断；12 设置平均 AUC 0.8608、峰值 0.9873；无防御评估 |
| R3-60 | WebDecept | Benchmark/Measurement | ACL 2026 | 12/14 | `notes/R3-60.md` | 电商欺骗界面注入；domain redirection SVR 全 1.00；price drift 高 TC 伴 SVR 1.00 |

批次 20 结论：5 篇全部 `QUALITY_CHECKED`；累计 100/124 已全文精读（99 QUALITY + 1 FULLY_READ），2,255/2,945 页（76.6%）。本批均无密码学构造：R3-56/57/60 是行为 benchmark/evaluation；R3-58 是心理注入 red-teaming；R3-59 是黑盒结构推断。新增 C39（R3-59：Agent 间消息加密/签名保护内容机密性与来源认证，但不隐藏通信拓扑这一结构元数据；黑盒输出仍可被用于拓扑推断）。

### 批次 21（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 状态 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|---|
| R3-61 | CostBomb | Attack | ACL 2026 | 18/21 | QUALITY_CHECKED | `notes/R3-61.md` | WebAgent 黑盒成本攻击；ΔTkC 最高 1.6031；TSR 27.50→23.91% |
| R3-62 | Multi-Agent Security Tax | Evaluation/Defense | AAAI 2025 | 7/9 | **FULLY_READ** | `notes/R3-62.md` | 7-Agent 实验室；疫苗降攻击但合作税不均；**Appendix 缺失** |
| R3-63 | Third Eye / SAPA-Bench | Benchmark | AAAI 2026 | 7/9 | **FULLY_READ** | `notes/R3-63.md` | 7,138 隐私场景；PRR 最高 80.16%；**Appendix 缺失** |
| R3-64 | MobileSafetyBench | Benchmark | AAAI 2026 | 8/9 | **FULLY_READ** | `notes/R3-64.md` | 250 手机任务；SCoT 拒绝 6→36%；**Appendix A–F 缺失** |
| R3-65 | MCPTox | Benchmark/Attack | AAAI 2026 | 8/9 | QUALITY_CHECKED | `notes/R3-65.md` | 45 MCP 服务器/1,348 用例；平均 ASR 36.5%；语义投毒 |

批次 21 结论：2 篇 `QUALITY_CHECKED` + 3 篇 `FULLY_READ`（R3-62/63/64 正文引用的方法/实验附录不在 9 页 PDF 中）；累计 105/124 已全文精读（101 QUALITY + 4 FULLY_READ），2,303/2,945 页（78.2%）。本批均无密码学构造：R3-61 是成本攻击；R3-62 是 prompt/memory 干预评测；R3-63 是隐私意识语义 benchmark；R3-64 是移动安全 benchmark；R3-65 是 MCP 工具元数据投毒 benchmark。未新增密码学交叉观察；R3-65 为 C28（MCP registry 缺密码学验证）提供了具体证据，但签名/来源验证仍只认证发布者，不判定工具描述语义。

### 批次 22（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 状态 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|---|
| R3-66 | MPMA | Attack/Measurement | AAAI 2026 | 8/9 | **FULLY_READ** | `notes/R3-66.md` | MCP 工具偏好操纵；五模型平均 ASR 22.19–91.88%；**补充材料外置缺失** |
| R3-67 | Shadows in the Code | Attack+Defense | AAAI 2026 | 8/9 | QUALITY_CHECKED | `notes/R3-67.md` | 多 Agent 软件开发恶意 Agent；ASR 最高 93%；防御仅 prompt 自检 |
| R3-68 | MAST | Attack | AAAI 2026 | 8/9 | QUALITY_CHECKED | `notes/R3-68.md` | 多轮消息篡改；ASR 最高 95.3；假设消息无认证/完整性 |
| R3-69 | Make Agent Defeat Agent | System/Tool | USENIX Security 2025 | 17/21 | QUALITY_CHECKED | `notes/R3-69.md` | 污点式漏洞检测；828 sink callsites；34 0-day/23 CVE |
| R3-70 | MUZZLE | Attack/Evaluation | USENIX Security 2026 | 18/21 | QUALITY_CHECKED | `notes/R3-70.md` | 自适应 Web Agent 红队；ASR 86.7% vs WASP 20.0% |

批次 22 结论：4 篇 `QUALITY_CHECKED` + 1 篇 `FULLY_READ`（R3-66 的 Related Work、prompt、dataset、GA 对比与补充讨论外置到未纳入语料的 full arXiv version）；累计 110/124 已全文精读（105 QUALITY + 5 FULLY_READ），2,362/2,945 页（80.2%）。本批均无密码学构造：R3-66 是工具选择层语义操纵；R3-67 是多 Agent 软件开发攻击；R3-68 是消息篡改；R3-69 是程序分析/污点检测；R3-70 是自适应 IPI 红队。新增 C40（R3-68：消息级签名/MAC + nonce 可阻断仅链路攻击者的在途篡改，但不能阻止被攻陷发送端；TLS 若在 relay/broker 终止则需端到端签名）。

### 批次 23（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 状态 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|---|
| R3-71 | Retrieval Barrier / IPI in the Wild | Attack/Measurement | USENIX Security 2026 | 17/21 | **FULLY_READ** | `notes/R3-71.md` | 黑盒前缀优化越过检索门槛；Recall@5 近 100%；Agent Fusion 80%；**附录缺失** |
| R3-72 | Site Isolation is Dead | Measurement+Attack | IEEE S&P 2026 | 17/18 | QUALITY_CHECKED | `notes/R3-72.md` | renderer RCE + IPC 伪造绕过 site isolation；9 系统各至少一个面失守 |
| R3-73 | Dark Patterns on Web Agents | Measurement | IEEE S&P 2026 | 19/20 | QUALITY_CHECKED | `notes/R3-73.md` | 88 场景；DPSR 41.1%；组合模式放大；prompt 防御 63→43% |
| R3-74 | WebCloak | Measurement+Defense | IEEE S&P 2026 | 18/20 | QUALITY_CHECKED | `notes/R3-74.md` | 智能爬取 benchmark；DOM 混淆使召回 88.7→0%；非密码学访问控制 |
| R3-75 | AgentSentinel | Defense/System | ACM CCS 2025 | 14/15 | QUALITY_CHECKED | `notes/R3-75.md` | eBPF/LSM+规则/LLM 审计；DSR 79.6%；A2M 无密码认证、日志不抗篡改 |

批次 23 结论：4 篇 `QUALITY_CHECKED` + 1 篇 `FULLY_READ`（R3-71 正文引用的 Appendix A.2.1/A.3/B/C 与定理证明不在 21 页 PDF 中）；累计 115/124 已全文精读（109 QUALITY + 6 FULLY_READ），2,447/2,945 页（83.1%）。本批均无密码学构造：R3-71 是检索层 IPI 攻击；R3-72 是浏览器进程/源隔离测量；R3-73 是 UI 暗黑模式测量；R3-74 是 DOM 混淆防御；R3-75 是 OS 级运行时审计。未新增密码学交叉观察；R3-75 的 A2M 握手与未签名日志为 C40/C38 提供补充证据，R3-73 的“同意只是 UI 点击”支持 C35。

### 批次 24（2026-11-03）

| ID | 短标题 | 类型 | venue/year | 深读 | 状态 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|---|
| R3-76 | AI Worm / DonkeyRail | Attack+Defense | ACM CCS 2025 | 14/15 | QUALITY_CHECKED | `notes/R3-76.md` | 自复制 prompt 传播；13/15 模型易感；相似度护栏 FPR 0.5–1.7% |
| R3-77 | SecAlign | Defense | ACM CCS 2025 | 14/15 | QUALITY_CHECKED | `notes/R3-77.md` | DPO 偏好优化防御；Opt.-Free ASR 0%；Opt.-Based 1–14% |
| R3-79 | SkillScope | System/Defense | ACM CCS 2026 | 20/21 | QUALITY_CHECKED | `notes/R3-79.md` | 动作级最小权限；6,590/68,312 越权；抑制 88.56%；无完整性绑定 |
| R3-81 | PriMobiBench | Benchmark | 未标注/2026（arXiv） | 22/23 | QUALITY_CHECKED | `notes/R3-81.md` | 视觉隐私泄露；识别 0.438–0.825；画像 0.401–0.712；像素化非可证匿名 |
| R3-82 | Shadow Memory | Defense | ACM CCS 2026 | 23/24 | QUALITY_CHECKED | `notes/R3-82.md` | 私有语义记忆+RL 检测；SHADE-Arena ASR 100→8.3%；非密码学 |

批次 24 结论：5 篇全部 `QUALITY_CHECKED`；累计 120/124 已全文精读（114 QUALITY + 6 FULLY_READ），2,540/2,945 页（86.3%）。本批均无密码学构造：R3-76 是自复制 prompt 传播与相似度护栏；R3-77 是 DPO 训练防御；R3-79 是静态/沙箱/LLM judge 的最小权限分析；R3-81 是视觉隐私语义测量；R3-82 是语义 shadow memory + RL 监控。新增 C41（R3-79：语义最小权限缺少 artifact 完整性绑定与不可伪造 capability；签名/attestation 可绑定扫描后的 bundle，但不能判定 action 是否在任务语义范围内）。

### 批次 25（2026-11-03，最后一批）

| ID | 短标题 | 类型 | venue/year | 深读 | 状态 | 笔记 | 核心观察 |
|---|---|---|---:|---|---|---|---|
| R3-83 | MemPoison | Attack | ACM CCS 2026 | 15/15 | QUALITY_CHECKED | `notes/R3-83.md` | 选择性记忆后门；ASR 0.83–0.95；Claude Opus 仅 0.12 |
| R3-84 | In-Page IPI Measurement | Measurement | ACM CCS 2026 | 13/15 | **FULLY_READ** | `notes/R3-84.md` | 15,387 注入/2,042 hosts；80.6% first-party；**伴随论文 [58] 缺失** |
| R3-85 | Comment and Control | Attack+Measurement | 未标注/2026（arXiv） | 16/16 | QUALITY_CHECKED | `notes/R3-85.md` | 4,174 GitHub workflows 可劫持；15 Actions；注释→指令 |
| R3-86 | MetaMancer | Attack+Defense | ACM CCS 2026 | 15/15 | QUALITY_CHECKED | `notes/R3-86.md` | 工具选择攻击 ASR 92.7/93.8%；六防御仍 91.2/92.2% |

批次 25 结论：3 篇 `QUALITY_CHECKED` + 1 篇 `FULLY_READ`（R3-84 的 §5.4/§6.4/§7.2/§10 把 Table 10、Figures 4/5/6/8 与 §10.3 委托给未纳入语料的伴随论文 [58]）；累计 **124/124 已全文精读（117 QUALITY + 7 FULLY_READ）**，2,599/2,945 页（88.25%），页数恒等式成立。本批均无密码学构造：R3-83 是记忆后门；R3-84 是页内 IPI 测量；R3-85 是工作流注释注入；R3-86 是工具元数据选择攻击。新增 C42（R3-84：80.6% 注入来自 first-party，内容来源签名不能解决核心情形；需要 instruction provenance/authorization 而非 content provenance）。

## 4. 关键中间观察（**临时，禁止当作阶段三/四结论**）

- 已读 124 篇中，只有 R3-80 具备新的密码学构造与形式化定义/定理；R1-03 使用标准原语（OTK/X25519/X.509）并做 ProVerif 符号验证，但不是新密码构造；R2-07 提出委托凭证架构但无安全定义/证明；R3-43 是信息论隐写/能力评测，有定理但非密码学定义/归约；其余多为纯语义/系统/benchmark 工作。
- “access control”“privacy”“indistinguishable”“verifiable”等词频繁出现，但多数是经验性/系统语义，不能自动映射为密码学相关度（符合交接文档 §6 的警告）。
- 目前看到的两个高潜力交叉点（仅假设，需全量阅读验证）：
  1. 委托/授权的形式化与凭证构造（R2-07 为入口，R1-01 的 IAM 章节为背景）；
  2. Agent 执行/工具调用的可验证性（R3-80 为强证据，R3-10 暴露 MCP 工具实现信任根问题）。
- 目前看到的“伪交叉”风险：仅给日志/工具定义签名；仅把 OAuth 包进 Agent；用 ZK 证明单步模型执行但不绑定完整 transcript/工具。
- 这些观察必须在阶段三/四用全量证据重新评估，不能在阶段一提前排名。

## 5. 下一批与后续计划

- **阶段一阅读已完成**：25 批全部完成，124/124 篇已有笔记与 `papers.jsonl` 记录。
- 阅读顺序：R1 完成 15 篇 → R2 完成 25 篇 → R3 完成 84 篇。
- 队列文件：`registry/reading_queue.csv`（共 25 批，全部 completed）。
- **下一步不是直接进入阶段二**：先执行阶段一验收（124 个 ID、124 份笔记、状态与页数恒等式、7 篇 FULLY_READ 例外清单、无未解决阻断），验收通过后再按交接文档进入阶段二。
- 每批结束必须更新：`registry/paper_status.csv`、`registry/papers.jsonl`、`logs/progress.md`、`logs/session_log.md`；有异常写 `logs/ambiguities.md`。
- 阶段一验收条件：124 篇全部 `QUALITY_CHECKED`，124 份非空笔记，关键图表核对，无未解决阻断。未达标前不得输出最终热度/密码学排名。

## 6. 当前阻断项

- 无硬阻断。
- 软问题：R3-80 的 PDF 未标注 venue/year（已记入 ambiguities，registry 保持 null）。
- 工具限制：`pdftotext -layout` 对双栏表格/公式偶有错位；已用渲染页图核对关键图表。后续长文继续采用“文本抽取＋关键页 PNG”流程。

## 7. 复现命令

```bash
cd "E:/Claude Code/Agent安全"
node scripts/build_manifest.js          # 重建 ID↔PDF 映射与哈希（只读 papers/）
node scripts/extract_text.js R1-02 R1-03 R1-04 R1-05 R1-06
node scripts/build_reading_queue.js     # 重建阅读队列（会保留已完成状态）
node scripts/update_status.js registry/batchNN_status.json
```

## 8. 阶段二状态（Taxonomy v1.1）

- 状态：**完成，等待用户验收**；未进入阶段三。
- 分类树：9 个一级方向、31 个二级方向（不增不减）。
- 124 篇全部有唯一主类；31 叶非空；计数和 124。
- 7 篇迁移：R2-09 A2→I1；R2-10 A2→D2；R3-27 A2→D2；R3-57 A2→I1；R3-59 G2→C4；R3-75 B3→B4a；R3-85 D2→D4。
- 置信度：high 94、medium 30、low 0；`node scripts/audit_taxonomy.js` → `AUDIT OK`。
- 文件：`taxonomy/taxonomy_v1_1_reviewed.md`、`taxonomy/taxonomy_change_log.md`、`registry/paper_topics_v1_1.csv`、`logs/phase2_report.md`、`logs/phase2_consistency_check.md`。
- 下一步：用户验收 v1.1；验收通过后进入阶段三（热度/T_crypto/A_crypto/可行性分别评分）。

## 9. 阶段三状态（研究活跃度/密码学相关度/可行性）

- 状态：**分析完成；六项勘误完成（2026-11-06）；阶段四已启动。**
- 书目审计：124 篇；正式主会 published 110（2024:10、2025:27、2026:73）；含 Workshop 112；preprint 7；submitted 2；accepted_not_published 2；unknown 1（R3-80）。
- 证据矩阵：124/124；T=0:85、1:36、3:2、4:1；A=0:91、1:28、2:2、3:2、4:1；T/A≥3 仅 R3-80（4/4）、R1-03（3/3）、R2-07（3/3）。
- 方向分：B1 T/A 广度=3；B4 T/A ceiling=4（R3-80 单篇）；H 最高 D2=5.0；F 最高 B1=5。
- 一致性：`scripts/audit_phase3.js` → `AUDIT OK`；`scripts/audit_taxonomy.js` → `AUDIT OK`。
- 输出：`research/phase3/`（phase3_report、metadata_audit、scoring_rubric、paper_crypto_evidence、research_activity、三个排行、sensitivity_analysis、direction_scores_full）。
- 下一步：用户审阅阶段三；阶段四才做候选方向收敛与最终推荐。

## 10. 阶段三勘误（2026-11-06）

- 六项全部完成：A2 V/M/B 4/5/3→5/5/3；D3 年份-ID 修正；R1-01 A=2→1；F 一级 null + 31 叶四子项；30 篇 medium 全量敏感性（68 单点 + 联合边界 + 10,000 随机）；R3-01/22/24 证据页码补全。
- 结果：A 分布 91/29/1/2/1/0；A1 A_ceiling 2→1；F 排行不变；T/A≥3 仍仅 R3-80/R1-03/R2-07；D2 “恒第 1” 弱化为“63% 第 1，联合边界下 H1 第 1”；A2/E2/G4 top-tier 概率约 0.50–0.55。
- 审计：`node scripts/audit_phase3.js` → `AUDIT OK`（124 证据/124 书目/31 叶/9 主类/H 公式 40 行/F 求和 31 行/T/A 复算/年份矩阵）；`node scripts/audit_taxonomy.js` → `AUDIT OK`。
- 报告：`research/phase3/phase3_errata_report.md`；新增 `direction_year_matrix.csv`、`sensitivity_full.json`、`sensitivity_rank_stability.csv`。

## 11. 阶段四状态（2026-11-06）

- 状态：**分析与选题推荐完成；未实现原型、未跑实验。**
- 候选：12 个具体问题；淘汰 7 个（C6–C12，现有工作覆盖）；C3 被 C2 Pareto 支配列 reserve；保留 C1/C2/C4/C5。
- 评价：C1 4.34、C2 4.25、C5 3.82、C4 3.81、C3 3.66（主权重）；理论/创新导向 C1 第 1，应用导向 C2 第 1。
- 推荐：**C1 FV-Delegation 第一优先；C2 AuthTrace 第二优先；C4 低风险备选；C5 备选。**
- 外部 prior art：52 条来源存 `research/phase4/external_prior_art/sources.json`；与 124 篇严格分离；多数为摘要/片段级，未全文复现。
- 输出：`research/phase4/`（计划、候选池、prior art、评价、top candidates、4 份 proposals、最终推荐、8 周路线图、报告、candidate_index）。
- 下一步：全文精读 AATs/UCAN/ASOR/CapScope/ResidualAuth/zkAgent/ERC-8354/CVA/Cross-Protocol；执行 C1 的 2 周 gate；C2 仅在 1-call zkVM gate 通过后并行。
