# Taxonomy v1.0 → v1.1 变更记录

> 依据：124 篇全文笔记 + 六组独立逐篇审计（`work/phase2/audit_batch1.jsonl` … `audit_batch6.jsonl`）+ 合并校验（`work/phase2/merge_audits.js`）。
> 原则：有限修订；不新增/删除一级或二级类别；不改变 R1/R2/R3 编号；所有迁移可回溯到笔记页码。

## 1. 结构性变化

- 一级方向：A–I 九类，**不变**。
- 二级方向：31 个，**不增不减**。
- 主类计数变化：

| 一级 | v1.0（Phase 1 reviewed） | v1.1 | 变化 |
|---|---:|---:|---:|
| A | 21 | 17 | −4 |
| B | 13 | 13 | 0 |
| C | 16 | 17 | +1 |
| D | 22 | 24 | +2 |
| E | 11 | 11 | 0 |
| F | 5 | 5 | 0 |
| G | 15 | 14 | −1 |
| H | 13 | 13 | 0 |
| I | 8 | 10 | +2 |
| **合计** | **124** | **124** | **0** |

> 注：v1.0 原始计数为 A18/B13/C17/D22/E11/F5/G15/H15/I8；Phase 1 已做过少量临时迁移（见 `registry/papers.jsonl` 的 `reviewed_category`），本表以 Phase 1 为基线，便于逐篇对照。

## 2. 七篇主类迁移（有证据）

### 2.1 R2-09 SafeArena：A2 → I1

- **旧类**：A2（通用 Benchmark/红队）。
- **新类**：I1（Web/GUI/移动设备与 CUA 风险）。
- **证据**：笔记 §5.1 pp.3–4（250 个有害 + 250 个配对安全任务，四个 WebArena 站点）；§5.2 pp.4–5（ARIA 四级风险与 NSS）；§8 pp.1–3（面向自主 Web Agent 故意滥用的 benchmark）。
- **理由**：任务、动作空间与执行环境均绑定 WebArena/Web Agent，属特定环境 benchmark；按 v1.1 §6 规则应回 I1。A2 仅保留其 benchmark 方法论维度，H1 保留有害任务完成/拒绝维度。
- **审计**：batch1 独立建议 A2→I1；其余批次无异议。

### 2.2 R2-10 AdvAgent：A2 → D2

- **旧类**：A2。
- **新类**：D2（Web/检索/多源/视觉等注入攻击）。
- **证据**：笔记 §5 p.4（对抗 prompt 放入 aria-label 等非渲染 HTML 属性）；§8 pp.1–2（黑盒定向红队框架，440 任务 ASR 97.5%）；§13 pp.3–4（威胁模型与隐形注入设计）。
- **理由**：核心是 Web Agent 的 HTML 属性注入入口与攻击构造，不是通用评测；A2 只保留其红队/benchmark 方法论维度，I1 保留 Web 环境维度。
- **审计**：batch3 确认 A2→D2。

### 2.3 R3-27 SafeSearch：A2 → D2

- **旧类**：A2。
- **新类**：D2。
- **证据**：笔记 §5 pp.4–5（不可靠网页生成、差分过滤、D∪{du} 注入搜索结果）；§8 pp.1–2（search-agent 自动化红队框架与 300 用例）；§9 p.4（良性查询、每查询最多一个不可靠网站、五类风险）。
- **理由**：特定 search 工具的 red-team benchmark，注入入口是检索结果，D2 明确含“检索”；五类风险中广告/偏见/错误信息三类非注入，故 A2/H1/I1 作 secondary。置信度 medium。
- **审计**：batch6 独立建议 A2→D2；batch3 确认。

### 2.4 R3-57 PhoneSafety：A2 → I1

- **旧类**：A2。
- **新类**：I1。
- **证据**：笔记 §5.1 p.4（700 个真实手机 safety-critical moments、130+ 应用）；§5.2 pp.4–5（Safe/Unsafe/CFR 三分解与 Cond-Safe）；§8 pp.2–3,5（PHONESAFETY benchmark）。
- **理由**：对象是手机 GUI/CUA 执行环境中的授权敏感动作安全，属特定移动环境评测；评测方法论放 A2，拒绝/确认行为放 H1，权限/授权放 B2。
- **审计**：batch3 确认 A2→I1。

### 2.5 R3-59 CIA：G2 → C4

- **旧类**：G2（多 Agent 架构、拓扑与系统评测）。
- **新类**：C4（内部信息提取、再识别与拓扑推断）。
- **证据**：笔记 §8 pp.1–2（问题提出：MAS 通信拓扑本身可在黑盒下被推断，关联 Vulnerability Exposure/IP Threat）；§5 pp.4–6（两阶段攻击：对抗查询恢复中间推理、GBD/LWS 恢复有向边）；§9 p.9（无防御评估、3–7 节点小 DAG）。
- **理由**：首要资产是 MAS 内部通信拓扑这一未公开内部信息；攻击是黑盒信息提取，不是架构/系统评测。G2 仅在“对象是多 Agent 拓扑”意义上作 secondary。
- **审计**：batch5 确认 G2→C4。

### 2.6 R3-75 AgentSentinel：B3 → B4（B4a）

- **旧类**：B3（隔离、约束规划与可信执行）。
- **新类**：B4a（策略审计/运行时强制）。
- **证据**：笔记 §5.3 pp.5–8（16 个 eBPF/LSM 探针 + 规则/LLM 审计 + 挂起/终止；无 TEE/远程认证/签名日志）；§8 p.2（端到端实时 CUA 防御）；§9 pp.13–14（FPR/FNR、审计预算耗尽绕过）。
- **理由**：核心是 OS 级运行时策略审计与强制（敏感操作前挂起、审计后恢复/终止），不是 B3 的隔离/约束规划（无 sandbox、不限制工具集），也不是 B4b（无 TEE、远程认证、签名或哈希链日志）。B3 作执行控制 secondary，D3 作注入防御 secondary，I1 作 CUA 环境 secondary。
- **审计**：batch6 独立建议 B4a；batch5 确认。

### 2.7 R3-85 Comment and Control：D2 → D4

- **旧类**：D2（Web/检索/多源/视觉等注入攻击）。
- **新类**：D4（多步动作、控制流与轨迹级异常）。
- **证据**：笔记 §8 pp.1–2,8–12（Guarded Workflow Graph、dynamic prompt provenance、dynamic capability profiling、Plan–Verify–Execute + 进化搜索）；§5 pp.5–9（跨仓库控制流、tool-call chain）；§9 pp.12–14（无独立 Limitations、4,174 hijackable vs successfully hijacked）。
- **理由**：核心是 agentic workflow 的多步控制流劫持（路径分析→prompt provenance→能力探测→tool-call chain 进化），不是单点注入入口。单点注入入口放 D2，最小权限/能力约束放 B2，工具链滥用放 E2。
- **审计**：batch5 确认 D2→D4；batch6 确认 D4。

## 3. 重命名/边界澄清（不改变编号）

| 编号 | v1.0 | v1.1 | 依据/影响论文 |
|---|---|---|---|
| A2 | Benchmark/红队/风险发现 | 通用 Benchmark、测量与红队（仅跨攻击面） | 与 2.1–2.4 的四篇迁移配套；R3-15/R3-30 等跨工具通用 benchmark 保留 |
| B2 | 任务相关授权/最小权限 | 任务相关授权、最小权限与访问控制 | R1-02 权限预测、R3-01 访问控制绕过、R2-08 运行时策略检查、R3-79 最小权限分析 |
| B4 | 策略审计/证明 | 策略审计与可验证执行（B4a/B4b） | R3-02/R3-75 为 B4a；R3-80 为 B4b |
| C4 | 提取/再识别/内部信息 | 内部信息提取、再识别与拓扑推断 | 纳入 R3-59；R3-03/R3-11/R3-28/R3-34 保持 |
| D4 | 多步动作与控制流异常 | 多步动作、控制流与轨迹级异常 | 纳入 R3-18/R3-20 的轨迹级检测/审计与 R3-85 |
| E2 | 工具选择/跨工具滥用 | 工具选择、元数据操纵与跨工具滥用 | 纳入 R3-66 MPMA、R3-86 MetaMancer |
| F2 | 集体记忆与状态污染 | 集体记忆、群体影响与状态漂移 | R3-41 Mandela Effect |
| G2 | 多 Agent 架构/评测 | 多 Agent 架构、拓扑与系统评测 | R3-59 迁出后，仍保留 R2-21/R3-12/R3-50/R3-58/R3-62 |
| H1 | 危险任务/拒绝/护栏 | 危险任务、拒绝、运行时护栏与行为安全 | R2-06/R2-24/R3-21/R3-29/R3-31/R3-37/R3-40/R3-53 |
| H2 | 后门和微调风险 | 后门、微调与训练数据风险 | 纳入 R2-25 良性 agentic SFT 失准 |
| H3 | 骨干模型/多模态鲁棒性 | 骨干模型、多模态与表示层鲁棒性 | R2-20、R3-32；R3-53 交叉 |
| I1 | Web/GUI/移动设备风险 | Web/GUI/移动设备与 CUA 风险 | 纳入 R2-09、R3-46、R3-57 |
| I3 | 生态传播与外部系统威胁 | 生态传播、内容保护与外部性 | 纳入 R3-74 WebCloak、R3-76 AI Worm |

## 4. 不迁移但记录边界的论文

| ID | 主类 | 边界说明 | 证据 |
|---|---|---|---|
| R3-76 AI Worm | I3 | 首要现象是自复制 prompt 的生态传播；DonkeyRail 是防御组件，D3/F1 为交叉 | 笔记 §8 p.2,11–13；§5 p.2–3 |
| R3-41 Mandela Effect | F2 | 研究对象是群体压力与长期记忆巩固导致的状态漂移，不是记忆投毒；G2/G3 交叉 | 笔记 §8 pp.1–3；§5 pp.2–3 |
| R2-25 PING | H2 | 核心是良性 agentic SFT 引发的无意失准，不是后门；H1 交叉 | 笔记 §8 pp.1–3；§9 |
| R3-31 BrowserART | H1 | 核心是浏览器 Agent 的拒绝/行为安全评测；A2/I1 交叉 | 笔记 §8 pp.1–6；§5 |
| R3-32 VWA-Adv | H3 | 核心是多模态/骨干鲁棒性与组件级攻击面；D2/A2 交叉 | 笔记 §8 pp.1–5；§5 |
| R2-13 AGrail | A3 | 运行时动作监控/guardrail；B4/H1 交叉 | 笔记 §8 pp.1–4；§5 |
| R3-55 AgentForesight | A3 | 前缀级在线审计与失败归因；B4/D4 交叉 | 笔记 §8 pp.1–3；§5 |
| R2-08 GuardAgent | B2 | 运行时策略检查，但研究对象是任务级访问控制；B4a 交叉 | 笔记 §5 pp.5–6；§9 p.21 |
| R3-15 MT-AgentRisk | A2 | 跨 5 个 MCP 工具、8 类风险的 benchmark，保留 A2；E1/H1 交叉（置信度 medium） | 笔记 §8 pp.1–2；§5 pp.4–6 |
| R3-30 ToolEmu | A2 | 跨工具/场景的通用风险 benchmark；E2/H1 交叉，sandbox 是 LM 仿真非 B3 | 笔记 §5.1 pp.4–5；§8 |

## 5. 审计方法与一致性

- 六组独立审计，每组约 20–21 篇，逐篇读笔记头部、§5、§8、§9、§13，返回 primary/subtype/secondary/tags/confidence/evidence/boundary_note。
- 合并脚本 `work/phase2/merge_audits.js` 校验：124 行、唯一 ID、主类合法、B4 亚型、secondary ≤3、cross_tags 3–6 且均在受控词表、confidence 合法。
- 结果：**VALIDATION OK**；124 篇全部有主类；31 个二级方向全部有论文；计数和 124。
- 审计分歧：仅 R2-09 在 batch1 中因基线 CSV 损坏而标 `agreement=no`，但其 proposed_primary=I1 与 v1.1 迁移一致；其余 123 篇 proposed 与基线一致或明确支持迁移。
- 置信度：high 94、medium 30、low 0。
