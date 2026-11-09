# Agent Security 研究分类树与 124 篇文献逐篇概述

> **研究状态**：本文件仅基于本 ChatGPT 会话前 3 轮推荐时的介绍及用户已核验的《已收集下载的论文.md》，没有重新搜索、没有阅读 124 篇 PDF 全文。因此逐篇概述是**历史对话级摘要**，不是替代原文的研究证据。若先前讨论没有具体介绍，仅可依据标题陈述研究对象（表内“题名级”）。
> **范围锁定**：R1 15 篇 + R2 25 篇 + R3 84 篇 = **124 篇唯一工作集**。不包含 R3-51、R3-78 和 XX-01—XX-04 共六篇指定排除论文；后续也不将其作为本 124 篇语料的一部分。

## 1. 对原始分类树的结构修正

原树把 `Transformer/Tokenization`（知识基础）、`Tool Calling/MCP`（系统组件）、`RBAC/OAuth`（安全机制）与 `隐私泄露`（安全问题）放在一个纵向层级，造成不同分类维度混杂。它适合作为入门**知识地图**，不适合作为研究文献的互斥分类树。

采用两层视图：（a）**先修知识图**：LLM 基础 / Agent 运行时组件 / 传统系统与密码安全；（b）**研究问题树**：下面的 A—I 九个主类、共 31 个二级叶子类别。每篇论文仅有一个 `primary_category` 便于统计，同时设置任意多个交叉标签。

## 2. Agent Security 研究问题树（v1.0）

```text
Agent Security — LLM-driven agents with planning, tool use, memory and/or collaboration
├─ A. 研究总览、安全评测与审计 (18篇)
│  ├─ A1. 安全定义/SoK/系统观 (3篇)
│  ├─ A2. Benchmark/红队/风险发现 (11篇)
│  ├─ A3. 监控审计与漏洞发现 (4篇)
├─ B. 身份、授权、权限治理与可信执行 (13篇)
│  ├─ B1. 身份认证与委托 (2篇)
│  ├─ B2. 任务相关授权/最小权限 (4篇)
│  ├─ B3. 隔离/约束规划/可信执行 (5篇)
│  ├─ B4. 策略审计/证明 (2篇)
├─ C. 隐私、机密性与敏感信息流 (17篇)
│  ├─ C1. 隐私规范/数据最小化 (7篇)
│  ├─ C2. 记忆隐私 (1篇)
│  ├─ C3. 外传/跨模型跨服务共享 (4篇)
│  ├─ C4. 提取/再识别/内部信息 (5篇)
├─ D. 提示注入、任务劫持与行为偏移 (22篇)
│  ├─ D1. 威胁机理与形式化 (2篇)
│  ├─ D2. Web/检索/多源/视觉等攻击 (10篇)
│  ├─ D3. 注入防御 (7篇)
│  ├─ D4. 多步动作与控制流异常 (3篇)
├─ E. 工具、MCP 与 Skills 生态安全 (11篇)
│  ├─ E1. MCP 安全与工具投毒 (4篇)
│  ├─ E2. 工具选择/跨工具滥用 (5篇)
│  ├─ E3. Skills 供应链及后门 (2篇)
├─ F. 记忆与知识库完整性 (5篇)
│  ├─ F1. 记忆/知识库投毒 (2篇)
│  ├─ F2. 集体记忆与状态污染 (1篇)
│  ├─ F3. 记忆防护 (2篇)
├─ G. 多智能体通信、协作与信任 (15篇)
│  ├─ G1. A2A 协议信任 (1篇)
│  ├─ G2. 多 Agent 架构/评测 (5篇)
│  ├─ G3. 级联/串谋/消息篡改 (4篇)
│  ├─ G4. 恶意 Agent 检测与防御 (5篇)
├─ H. Agent 行为安全、对齐与模型脆弱性 (15篇)
│  ├─ H1. 危险任务/拒绝/护栏 (8篇)
│  ├─ H2. 后门和微调风险 (3篇)
│  ├─ H3. 骨干模型/多模态鲁棒性 (4篇)
├─ I. 真实执行环境、资源与生态外部性 (8篇)
│  ├─ I1. Web/GUI/移动设备风险 (4篇)
│  ├─ I2. 资源滥用/成本攻击 (2篇)
│  ├─ I3. 生态传播与外部系统威胁 (2篇)
```

**分类边界与统计规则**：上述计数为每篇仅归一个主类的**书目导航计数**，不是现实中完全独立的攻击面统计。比如 Memory Privacy 放在 C，Memory Poisoning 放在 F；MCP 数据外传放在 C，MCP Tool Poisoning 放在 E；A2A 身份/协议安全放在 G，身份与授权机制主要放在 B。A 类仅存放**跨攻击面的总览、通用 benchmark 与审计**，面向特定隐私/工具/协议的 benchmark 回到其研究对象对应的分支。

## 3. 九类各自研究的核心问题

- **A 研究总览、安全评测与审计（18篇）：** A1 安全定义/SoK/系统观；A2 Benchmark/红队/风险发现；A3 监控审计与漏洞发现。
- **B 身份、授权、权限治理与可信执行（13篇）：** B1 身份认证与委托；B2 任务相关授权/最小权限；B3 隔离/约束规划/可信执行；B4 策略审计/证明。
- **C 隐私、机密性与敏感信息流（17篇）：** C1 隐私规范/数据最小化；C2 记忆隐私；C3 外传/跨模型跨服务共享；C4 提取/再识别/内部信息。
- **D 提示注入、任务劫持与行为偏移（22篇）：** D1 威胁机理与形式化；D2 Web/检索/多源/视觉等攻击；D3 注入防御；D4 多步动作与控制流异常。
- **E 工具、MCP 与 Skills 生态安全（11篇）：** E1 MCP 安全与工具投毒；E2 工具选择/跨工具滥用；E3 Skills 供应链及后门。
- **F 记忆与知识库完整性（5篇）：** F1 记忆/知识库投毒；F2 集体记忆与状态污染；F3 记忆防护。
- **G 多智能体通信、协作与信任（15篇）：** G1 A2A 协议信任；G2 多 Agent 架构/评测；G3 级联/串谋/消息篡改；G4 恶意 Agent 检测与防御。
- **H Agent 行为安全、对齐与模型脆弱性（15篇）：** H1 危险任务/拒绝/护栏；H2 后门和微调风险；H3 骨干模型/多模态鲁棒性。
- **I 真实执行环境、资源与生态外部性（8篇）：** I1 Web/GUI/移动设备风险；I2 资源滥用/成本攻击；I3 生态传播与外部系统威胁。

## 4. 124 篇逐篇概述（原始轮次与编号不变）

### R1：15 篇

| 编号 | 原始英文标题 | 一句话概述（历史对话级） | 主分类 |
|---|---|---|---|
| R1-01 | SoK: Attack and Defense Landscape of Agentic AI Systems | 系统化梳理 Agentic AI 的攻击面、防御机制与开放安全问题。 | A1 |
| R1-02 | Towards Automating Data Access Permissions in AI Agents | 研究依据任务与用户偏好为 Agent 自动确定数据访问权限。 | B2 |
| R1-03 | SAGA: A Security Architecture for Governing AI Agentic Systems | 提出多 Agent 治理架构，管理 Agent 身份、访问控制及安全委托。 | B1 |
| R1-04 | AirGapAgent: Protecting Privacy-Conscious Conversational Agents | 通过减少第三方组件对敏感上下文的接触，保护对话 Agent 的隐私。 | C1 |
| R1-05 | IsolateGPT_An Execution Isolation Architecture for LLM-Based Agentic Systems | 对 LLM 集成系统中的第三方应用实施执行隔离与安全边界控制。 | B3 |
| R1-06 | ACE: A Security Architecture for LLM-Integrated App Systems | 用信息流与能力边界约束 LLM 应用的计划和执行阶段。 | B3 |
| R1-07 | Parasites in the Toolchain: A Large-Scale Analysis of Attacks on the MCP Ecosystem | 大规模分析 MCP 生态中的恶意工具、协议滥用及攻击途径。 | E1 |
| R1-08 | “Do Not Mention This to the User”: Detecting and Understanding Malicious Agent Skills in the Wild | 测量真实 Agent Skills 中的恶意行为、隐蔽指令及凭证窃取风险。 | E3 |
| R1-09 | Formalizing and Benchmarking Prompt Injection Attacks and Defenses | 形式化提示注入攻击模型，并系统比较攻击与防御方法。 | D1 |
| R1-10 | StruQ: Defending Against Prompt Injection with Structured Queries | 将可信指令与不可信数据结构化分离，以抑制提示注入。 | D3 |
| R1-11 | Prompt Injection Attack to Tool Selection in LLM Agents | 利用工具描述诱导 Agent 选择攻击者指定的工具。 | E2 |
| R1-12 | Les Dissonances: Cross-Tool Harvesting and Polluting in Pool-of-Tools Empowered LLM Agents | 分析工具之间经由 Agent 发生的机密信息收集与数据污染。 | E2 |
| R1-13 | ObliInjection: Order-Oblivious Prompt Injection Attack to LLM Agents with Multi-source Data | 攻击从多个来源组装上下文的 Agent，无须掌握输入排列顺序。 | D2 |
| R1-14 | Attention is All You Need to Defend Against Indirect Prompt Injection Attacks in LLMs | 利用注意力信息检测并清理间接提示注入的恶意 token。 | D3 |
| R1-15 | Autonomy Comes with Costs: Detecting Denial-of-Service Vulnerabilities Caused by Resource Abusing in LLM-based Agents | 研究 Agent 自主任务中的计算或外部资源滥用型拒绝服务漏洞。 | I2 |

### R2：25 篇

| 编号 | 原始英文标题 | 一句话概述（历史对话级） | 主分类 |
|---|---|---|---|
| R2-01 | Agent Security Bench (ASB): Formalizing and Benchmarking Attacks and Defenses in LLM-based Agents | 构建 Agent 安全基准，统一评估多种攻击入口与防御方法。 | A2 |
| R2-02 | AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents | 建立动态工具交互环境，测试 Agent 的间接提示注入攻击与防御。 | A2 |
| R2-03 | AgentPoison: Red-teaming LLM Agents via Poisoning Memory or Knowledge Bases | 通过污染 Agent 的记忆或知识库诱发后续恶意行为。 | F1 |
| R2-04 | Watch Out for Your Agents! Investigating Backdoor Threats to LLM-Based Agents | 系统研究 LLM Agent 后门的触发位置和恶意工具行动。 | H2 |
| R2-05 | BadAgent: Inserting and Activating Backdoor Attacks in LLM Agents | 研究在 Agent 中植入和激活后门，并考察其持续性。 | H2 |
| R2-06 | AgentHarm: A Benchmark for Measuring Harmfulness of LLM Agents | 构建 Agent 执行有害任务能力的安全评估基准。 | H1 |
| R2-07 | Position: AI Agents Need Authenticated Delegation | 主张 Agent 代表用户操作时必须具备可认证、可限定的委托授权。 | B1 |
| R2-08 | GuardAgent: Safeguard LLM Agents via Knowledge-Enabled Reasoning | 通过知识辅助推理检查 Agent 操作是否违反访问控制或安全策略。 | B2 |
| R2-09 | SafeArena: Evaluating the Safety of Autonomous Web Agents | 在真实网站任务中评测自治 Web Agent 的危险行为与风险等级。 | A2 |
| R2-10 | AdvAgent: Controllable Blackbox Red-teaming on Web Agents | 自动生成针对 Web Agent 的黑盒对抗测试输入。 | A2 |
| R2-11 | Unveiling Privacy Risks in LLM Agent Memory | 研究从 Agent 长期记忆中提取历史用户交互和私人信息的攻击。 | C2 |
| R2-12 | The Task Shield: Enforcing Task Alignment to Defend Against Indirect Prompt Injection in LLM Agents | 核对工具调用与指令是否符合用户原始任务，抑制间接提示注入。 | D3 |
| R2-13 | AGrail: A Lifelong Agent Guardrail with Effective and Adaptive Safety Detection | 提出持续自适应的 Agent 安全检测与防护框架。 | A3 |
| R2-14 | Security Challenges in AI Agent Deployment: Insights from a Large Scale Public Competition | 分析大规模公开 Agent 攻击竞赛的真实安全评测结果。 | A2 |
| R2-15 | WASP: Benchmarking Web Agent Security Against Prompt Injection Attacks | 建立专门针对 Web Agent 提示注入的基准测试。 | D2 |
| R2-16 | DRIFT: Dynamic Rule-Based Defense with Injection Isolation for Securing LLM Agents | 以安全规划、动态校验与注入隔离限制 Agent 的偏航行为。 | D3 |
| R2-17 | MCP-SafetyBench: A Benchmark for Safety Evaluation of Large Language Models with Real-World MCP Servers | 在真实 MCP Server 环境中构建 Agent 工具链安全基准。 | E1 |
| R2-18 | A2ASecBench: A Protocol-Aware Security Benchmark for Agent-to-Agent Multi-Agent Systems | 针对 A2A 多 Agent 协议进行身份、声明和交互安全评测。 | G1 |
| R2-19 | OpenAgentSafety: A Comprehensive Framework for Evaluating Real-World AI Agent Safety | 建立覆盖浏览器、文件、命令行等真实工具的 Agent 安全评测框架。 | A2 |
| R2-20 | Breaking Agent Backbones: Evaluating the Security of Backbone LLMs in AI Agents | 比较不同基础模型在 Agent 实际运行场景中的安全脆弱性。 | H3 |
| R2-21 | TAMAS: Benchmarking Adversarial Risks in Multi-Agent LLM Systems | 构建多 Agent 系统中对抗攻击风险的跨场景评测基准。 | G2 |
| R2-22 | ACIArena: Toward Unified Evaluation for Agent Cascading Injection | 评估恶意指令在 Agent 间逐级传播的级联攻击。 | G3 |
| R2-23 | Privacy-R1: Privacy-Aware Multi-LLM Agent Collaboration via Reinforcement Learning | 研究本地与远程模型协作时的敏感信息选择性委托。 | C3 |
| R2-24 | When Personalization Legitimizes Risks: Uncovering Safety Vulnerabilities in Personalized Dialogue Agents | 分析个性化历史信息使 Agent 不恰当地合理化危险请求的现象。 | H1 |
| R2-25 | Unintended Misalignment from Agentic Fine-Tuning: Risks and Mitigation | 研究 Agent 专项微调可能破坏模型既有安全对齐的问题。 | H2 |

### R3：84 篇

| 编号 | 原始英文标题 | 一句话概述（历史对话级） | 主分类 |
|---|---|---|---|
| R3-01 | FragFuse: Bypassing Access Control of Large Language Model Agents via Memory-Based Query Fragmentation and Fusion | 通过跨轮次分解并经记忆重组敏感请求，绕过 Agent 访问控制。 | B2 |
| R3-02 | MATE: Policy-Aware Security Auditing for Mobile Agents via Synthesis-Driven Trajectory Learning | 结合安全策略与执行轨迹，审计移动 Agent 是否越权操作。 | B4 |
| R3-03 | MASLeak: Investigating and Exposing Intellectual Property Leakage Vulnerabilities in Multi-Agent Systems | 黑盒推断多 Agent 系统内部拓扑、提示词和工具等专有信息。 | C4 |
| R3-04 | MELON: Provable Defense Against Indirect Prompt Injection Attacks in AI Agents | 通过掩码重执行与工具行为比较检测间接提示注入。 | D3 |
| R3-05 | G-Safeguard: A Topology-Guided Security Lens and Treatment on LLM-based Multi-agent Systems | 将多 Agent 交互建模为图并进行恶意消息检测与拓扑干预。 | G4 |
| R3-06 | Position: Agent Security Needs Redefinition through a Holistic Framework | 提出以授权上下文、任务一致性和数据隔离重新界定 Agent 安全。 | A1 |
| R3-07 | MINIM: Privacy-Aware Minimal View for Agents via Trusted Local Sanitization | 由可信本地组件最小化 Agent 可见的界面与敏感信息。 | C1 |
| R3-08 | Contextualized Privacy Defense for LLM Agents | 针对具体任务上下文动态调整 Agent 的隐私保护行为。 | C1 |
| R3-09 | PrivAct: Internalizing Contextual Privacy Preservation via Multi-Agent Preference Training | 用多 Agent 偏好训练强化协作过程中的上下文隐私保护。 | C3 |
| R3-10 | SOPE: Situation-Aware and Statistically Indistinguishable Privacy Exfiltration for MCP-enabled Agents | 研究恶意 MCP 工具如何结合任务情境隐蔽外传私人信息。 | C3 |
| R3-11 | From Weak Cues to Real Identities: Evaluating Inference-Driven De-Anonymization in LLM Agents | 评估 Agent 依据多个弱线索推断真实身份的重新识别风险。 | C4 |
| R3-12 | Architecture Matters for Multi-Agent Security | 系统比较多 Agent 架构、角色及记忆设计对安全风险的影响。 | G2 |
| R3-13 | Position: Trustworthy Model Context Protocol Enables Responsible Agentic AI! | 提出构建可信 MCP 协议与 Agent 工具生态的立场与要求。 | E1 |
| R3-14 | AgentLAB: Benchmarking LLM Agents against Long-Horizon Attacks | 建立覆盖长期、多步攻击链的 Agent 安全评测基准。 | A2 |
| R3-15 | Unsafer in Many Turns: Benchmarking and Defending Multi-Turn Safety Risks in Tool-Using Agents | 系统评估工具 Agent 的多轮安全风险及对应防御。 | A2 |
| R3-16 | It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents | 通过说服式恶意网页内容重定向 Web Agent 的任务目标。 | D2 |
| R3-17 | Prompt Injection as Role Confusion | 从指令角色混淆角度解释提示注入为何取得控制权。 | D1 |
| R3-18 | When Actions Go Off-Task: Detecting and Correcting Misaligned Actions in Computer-Use Agents | 检测与纠正计算机操作 Agent 在执行中偏离用户任务的动作。 | D4 |
| R3-19 | CausalArmor: Efficient Indirect Prompt Injection Guardrails via Causal Attribution | 以因果归因识别不可信内容对 Agent 行为的异常影响。 | D3 |
| R3-20 | Causal Detection of Multi-Step LLM Agent Attacks | 用因果模型检测跨多个步骤展开的 Agent 攻击。 | D4 |
| R3-21 | Learning When to Act or Refuse: Guarding Agentic Reasoning Models for Safe Multi-Step Tool Use | 训练 Agent 在多步工具执行中判断何时继续、何时拒绝。 | H1 |
| R3-22 | A-MemGuard: A Proactive Defense Framework For LLM-Based Agent Memory | 提出针对 Agent 记忆污染和持续恶意影响的主动防御。 | F3 |
| R3-23 | SkillTrojan: Backdoor Attacks on Skill-Based Agent Systems | 通过恶意 Agent Skill 或技能组合植入后门。 | E3 |
| R3-24 | When Agents Go Rogue: Activation-Based Detection of Malicious Behaviors in Multi-Agent Systems | 依据模型内部激活信息识别多 Agent 系统中的恶意 Agent 行为。 | G4 |
| R3-25 | When Embedding-Based Defenses Fail: Rethinking Safety in LLM-Based Multi-Agent Systems | 分析基于向量嵌入的多 Agent 恶意消息防御为何失效。 | G4 |
| R3-26 | Securing Multi-Agent Systems Against Corruptions via Node Contribution Backpropagation | 通过多 Agent 协作图上的节点贡献识别和缓解恶意扰动。 | G4 |
| R3-27 | SafeSearch: Automated Red-Teaming of LLM-Based Search Agents | 为搜索型 Agent 自动生成安全红队测试。 | A2 |
| R3-28 | Just Ask: Curious Code Agents Reveal System Prompts in Frontier LLMs | 利用代码 Agent 的交互能力提取隐藏系统提示词。 | C4 |
| R3-29 | A New Framework for Cybersecurity Refusals in AI Agents | 提出判断 Agent 在网络安全任务中应执行或拒绝的安全框架。 | H1 |
| R3-30 | Identifying the Risks of LM Agents with an LM-Emulated Sandbox | 利用由模型模拟的工具沙箱识别 Agent 操作风险。 | A2 |
| R3-31 | Aligned LLMs Are Not Aligned Browser Agents | 展示对话模型的安全对齐无法直接保证浏览器 Agent 的执行安全。 | H1 |
| R3-32 | Dissecting Adversarial Robustness of Multimodal LM Agents | 分析多模态 Agent 在对抗输入下的安全鲁棒性。 **〔题名级概述〕** | H3 |
| R3-33 | EIA: Environmental Injection Attack on Generalist Web Agents for Privacy Leakage | 利用恶意网页环境诱导通用 Web Agent 泄露私人信息。 | C3 |
| R3-34 | Searching for Privacy Risks in LLM Agents via Simulation | 使用模拟交互寻找多轮 Agent 的隐私提取与泄露风险。 | C4 |
| R3-35 | Optimizing Agent Planning for Security and Autonomy | 研究如何在 Agent 自主规划中加入安全约束。 | B3 |
| R3-36 | Breaking and Fixing Defenses Against Control Flow Hijacking in Multi-Agent Systems | 研究并防御多 Agent 协作中的控制流劫持。 | G3 |
| R3-37 | Monitoring Decomposition Attacks with Lightweight Sequential Monitors | 利用轻量序列监控发现危险任务分解式攻击。 | D4 |
| R3-38 | VPI-Bench: Visual Prompt Injection Attacks for Computer-Use Agents | 构建计算机操作 Agent 的视觉提示注入测试。 | D2 |
| R3-39 | ChatInject: Abusing Chat Templates for Prompt Injection in LLM Agents | 利用聊天模板及消息角色边界触发 Agent 提示注入。 | D2 |
| R3-40 | Building a Foundational Guardrail for General Agentic Systems via Synthetic Data | 用合成数据训练适用于多类 Agent 的通用安全护栏。 | H1 |
| R3-41 | When Agents “Misremember” Collectively: Exploring the Mandela Effect in LLM-based Multi-Agent Systems | 探讨多 Agent 系统中错误记忆的累积与集体传播。 | F2 |
| R3-42 | PrivacyLens: Evaluating Privacy Norm Awareness of Language Models in Action | 评测行动型模型能否遵守依赖任务情境的隐私规范。 | C1 |
| R3-43 | Secret Collusion among AI Agents: Multi-Agent Deception via Steganography | 研究 Agent 之间通过隐写手段进行秘密通信和协同欺骗。 | G3 |
| R3-44 | AgentDAM: Privacy Leakage Evaluation for Autonomous Web Agents | 评测 Web Agent 是否遵守数据最小化原则，避免无关用户信息泄露。 | C1 |
| R3-45 | AgentAuditor: Human-level Safety and Security Evaluation for LLM Agents | 提出 Agent 行为的安全审计与评估方案。 | A3 |
| R3-46 | OS-Harm: A Benchmark for Measuring Safety of Computer Use Agents | 建立计算机操作 Agent 在系统环境中的危险行为基准。 | I1 |
| R3-47 | Attractive Metadata Attack: Inducing LLM Agents to Invoke Malicious Tools | 通过有吸引力的工具元数据诱导 Agent 调用恶意工具。 | E2 |
| R3-48 | Agent Security is a Systems Problem | 主张将 Agent 安全视为系统层问题，而不是仅靠模型对齐。 | A1 |
| R3-49 | Adaptive Adversaries: A Multi-Turn, Multi-LLM Benchmark for LLM Agent Security | 建立多轮、自适应、多模型的 Agent 安全攻击基准。 | A2 |
| R3-50 | ORBIT: A Framework for Multi-Agent Security Evaluations | 提出针对多 Agent 系统的综合安全评估框架。 | G2 |
| R3-52 | Agent Meltdowns: The Road to Hell Is Paved with Helpful Agents | 探讨善意或协作型 Agent 如何产生非预期的不安全行为。 **〔题名级概述〕** | H1 |
| R3-53 | Agent MechSuits: Mechanistic Subspace Safety Steering for Multi-Turn CLI Agents | 探索对多轮命令行 Agent 进行模型内部安全子空间控制。 | H3 |
| R3-54 | ASPI: Seeking Ambiguity Clarification Amplifies Prompt Injection Vulnerability in LLM Agents | 分析 Agent 为澄清模糊任务而额外交互引起的注入风险。 | D2 |
| R3-55 | AgentForesight: Online Auditing for Early Failure Prediction in Multi-Agent Systems | 在线监测多 Agent 执行过程并提前预测失败或风险。 | A3 |
| R3-56 | SchemeArena: Factorized Stress Testing of Scheming in LLM Agents | 构建识别 Agent 隐蔽谋划或欺骗行为的压力测试。 | H1 |
| R3-57 | Safe, or Simply Incapable? Rethinking Safety Evaluation for Phone-Use Agents | 区分手机 Agent 因安全原则拒绝与因能力不足而失败。 | H3 |
| R3-58 | PsySafe: A Comprehensive Framework for Psychological-based Attack, Defense, and Evaluation of Multi-agent System Safety | 构建多 Agent 心理/行为攻击、防御与评测框架。 | G2 |
| R3-59 | CIA: Inferring the Communication Topology from LLM-based Multi-Agent Systems | 通过外部交互推断多 Agent 系统的通信拓扑。 | C4 |
| R3-60 | Benchmarking Web Agent Safety under E-commerce Deceptive Interfaces | 评测电商网页中的欺骗式界面对 Web Agent 造成的安全影响。 | I1 |
| R3-61 | When Efficiency Becomes a Vulnerability: Computational Cost Attacks on WebAgents | 通过诱导冗长计算或推理使 Web Agent 产生异常成本。 | I2 |
| R3-62 | Multi-Agent Security Tax: Trading Off Security and Collaboration Capabilities in Multi-Agent Systems | 研究多 Agent 协作能力提升与安全防护之间的权衡。 | G2 |
| R3-63 | Mind the Third Eye! Benchmarking Privacy Awareness in MLLM-powered Smartphone Agents | 评估多模态手机 Agent 识别屏幕隐私和恰当处理敏感信息的能力。 | C1 |
| R3-64 | MobileSafetyBench: Evaluating Safety of Autonomous Agents in Mobile Device Control | 评测移动设备控制 Agent 执行高风险任务时的安全性。 | I1 |
| R3-65 | MCPTox: A Benchmark for Tool Poisoning on Real-World MCP Servers | 基于真实 MCP Server 评估工具投毒攻击。 | E1 |
| R3-66 | MPMA: Preference Manipulation Attack Against Model Context Protocol | 研究攻击者操纵 MCP 工具选择偏好的方法。 | E2 |
| R3-67 | Shadows in the Code: Exploring the Risks and Defenses of LLM-based Multi-Agent Software Development Systems | 研究多 Agent 软件开发系统中的恶意协作风险与防御。 | G4 |
| R3-68 | Attack the Messages, Not the Agents: A Multi-round Adaptive Stealthy Tampering Framework for LLM-MAS | 通过多轮自适应篡改 Agent 间消息实施隐蔽攻击。 | G3 |
| R3-69 | Make Agent Defeat Agent: Automatic Detection of Taint-Style Vulnerabilities in LLM-based Agents | 利用 Agent 驱动的灰盒测试发现 Agent 应用中的污点式漏洞。 | A3 |
| R3-70 | MUZZLE: Adaptive Agentic Red-Teaming of Web Agents Against Indirect Prompt Injection Attacks | 按 Web Agent 执行轨迹自适应生成间接提示注入攻击。 | D2 |
| R3-71 | Overcoming the Retrieval Barrier: Indirect Prompt Injection in the Wild for LLM Systems | 研究如何使恶意检索内容实际进入 Agent 上下文并触发攻击。 | D2 |
| R3-72 | Site Isolation is Dead: How Site Isolation is Broken in Agentic Browsers and Extensions | 分析 Agent 浏览器及其扩展对传统网页站点隔离的破坏。 | B3 |
| R3-73 | Investigating the Impact of Dark Patterns on LLM-Based Web Agents | 评估恶意网页暗黑模式如何影响 LLM Web Agent 决策。 | I1 |
| R3-74 | WebCloak: Characterizing and Mitigating Threats From LLM-Driven Web Agents as Intelligent Scrapers | 分析自治 Web Agent 作为智能网页抓取者对网站形成的威胁。 | I3 |
| R3-75 | AgentSentinel: An End-to-End and Real-Time Security Defense Framework for Computer-Use Agents | 提出用于计算机操作 Agent 的端到端实时安全防护架构。 | B3 |
| R3-76 | Here Comes the AI Worm: Preventing the Propagation of Adversarial Self-Replicating Prompts Within GenAI Ecosystems | 研究恶意提示在 GenAI / Agent 生态中的自复制传播及抑制。 | I3 |
| R3-77 | SecAlign: Defending Against Prompt Injection with Preference Optimization | 用偏好优化提升模型抵御提示注入的能力。 | D3 |
| R3-79 | SkillScope: Toward Fine-Grained Least-Privilege Enforcement for Agent Skills | 针对 Agent Skills 的调用和执行实施细粒度最小权限控制。 | B2 |
| R3-80 | zkAgent: Verifiable LLM Agent Execution via One-Shot Transcript Proofs | 使用执行转录记录的证明机制增强 Agent 执行可验证性。 | B4 |
| R3-81 | PriMobiBench: Characterizing Visual Privacy Leakage in VLM-Driven Mobile GUI Agents | 评测视觉语言模型驱动的移动 GUI Agent 的隐私泄露风险。 | C1 |
| R3-82 | Safeguarding LLM Agents against Long-Horizon Threats via Shadow Memory | 利用影子记忆降低长时程执行中的记忆相关攻击风险。 | F3 |
| R3-83 | MemPoison: Bypassing Selective Memory Mechanisms to Plant Backdoors in LLM Agents | 利用选择性记忆机制的缺陷植入持久 Agent 后门。 | F1 |
| R3-84 | A Large-scale Measurement of In-Page Prompt Injections Against LLM Web Agents | 对真实网页内针对 LLM Web Agent 的提示注入进行大规模测量。 | D2 |
| R3-85 | Comment and Control: Hijacking Agentic Workflows via Context-Grounded Evolution | 借助上下文相关恶意内容劫持 Agent 的工作流。 | D2 |
| R3-86 | MetaMancer: Practical Tool Selection Attacks against LLM Agents | 研究针对 Agent 工具选择流程的实用攻击。 | E2 |

## 5. 交叉标签建议

不要让所有维度直接成为树的层级，维护 `papers.json` 或数据库时建议保存下列多值标签：

| 字段 | 建议枚举及含义 |
|---|---|
| `primary_category` | `A1`—`I3`，唯一主叶子分类；首次分配见上表 |
| `security_objective` | `Confidentiality`、`Integrity`、`Availability`、`Authentication`、`Authorization`、`Privacy`、`Accountability`、`Safety/Alignment`（可多选） |
| `entry_point` | `User instruction`、`Retrieved content`、`Tool output`、`Tool metadata`、`Skill`、`Memory/KB`、`GUI/Web content`、`Inter-agent message`、`Model weights`、`None/Not attack` |
| `agent_surface` | `Browser`、`Computer-use`、`Mobile`、`Code`、`Search/RAG`、`MCP`、`A2A`、`Multi-agent`、`General purpose` |
| `paper_type` | `SoK`、`Position`、`Attack`、`Defense`、`Architecture`、`Benchmark`、`Measurement`、`Auditing`、`Hybrid` |
| `attacker_capability` | 从 PDF 中摘录可信权限和控制范围，禁止根据名称推断 |
| `defense_boundary` | Prompt/Model/Planner/Tool gateway/Memory/MCP server/OS sandbox/Inter-agent protocol 等 |
| `evidence` | 论文 PDF 的页码、定理、实验或相关小节；当前未提供 PDF，统一留空待 Codex 提取 |
| `source_status` | `History summary` 或 `Title-level`; 不能冒充 PDF 结论 |

## 6. Codex 后续核验与树的维护

1. **载入元数据库**：以《已收集下载的论文.md》标题和 ID 为权威清单；所有本次 124 篇保持原 ID 与主分类初稿，不补回六个排除项。
2. **从 PDF 原文核查**：逐篇提取系统模型、受保护资产、攻击者目标与能力、信任边界、攻击链或防御机制、实验环境及主要局限。
3. **审阅主分类**：如题名级、历史对话级概述与 PDF 冲突，以 PDF 为准；改动时记录 `old_category`、`new_category`、理由与证据页码。
4. **允许交叉标签**：对一篇同时涉及 MCP、Privacy、Prompt Injection、Multi-Agent 的论文，保留唯一主类，多标签不受限；支持交叉查询和重新投影。
5. **构建分类树**：先验证一/二级划分的互斥性与覆盖度，再加三级子主题；每个叶子至少附代表论文、共有 Threat Model、评价方法和未解问题。
6. **前后比较避免偏差**：当前各分支数量反映的是所下载的 124 篇，而不是完整学界论文发生率；不要因此推断“热度”或“研究空白”。
7. **输出物**：维护 `papers.json`、`taxonomy.md`、`taxonomy.mmd`、`taxonomy-changelog.md`、`research-gaps.md`，保留输入 PDF 的不可变 ID 映射。

## 7. 可审计性说明

- 用户已核对 124 篇 PDF 的书目与去重，但**本次回答仅得到论文标题清单**，没有实际阅读 PDF 论文内容。
- `source_status = Title-level` 仅表示对该条缺乏具体历史对话内容，概述仅按题名描述，不能当作研究证据。
- 没有重新联网检索，不依赖第三方最新发表状态；不会为每篇论文凭空补充论文独有实验数据。
- 这是分类树 **v1.0（供 Codex 在论文全文核验后迭代）**，并非已完成的系统综述、研究空白鉴定或主会资格审查。
