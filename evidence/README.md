# Evidence index（批次 1–19）

本目录记录**已实际核对**的图表/公式证据。PDF 本身保持只读；渲染页存放在 `work/pages/`，笔记中的页码均为 PDF 文件页码。

| 论文 | 证据对象 | PDF 页 | 渲染文件 | 核对结论 |
|---|---|---|---|---|
| R1-01 | Fig.1 Agent 结构图 | p.4 | `work/pages/R1-01_fig1-04.png` | 组件/数据流与 §3.1 一致 |
| R1-01 | Fig.2 攻击向量 V1–V6 与风险 R1–R7 | p.6 | `work/pages/R1-01_fig2-06.png` | 六种向量、七类风险位置与正文一致 |
| R1-01 | Fig.4 防御景观 | p.9 | `work/pages/R1-01_fig4-09.png` | Runtime/Secure-by-Design/IAM/Component Hardening 四层 |
| R2-07 | Fig.1 委托凭证结构 | p.2 | `work/pages/R2-07_fig1-02.png` | ID/权限/元数据/签名四块与 §B.1 一致 |
| R2-07 | Fig.2 OIDC+UMA 委托流程 | p.5 | `work/pages/R2-07_fig2-05.png` | 用户→OP→Agent→资源服务流程与 §3.2 一致 |
| R3-01 | Fig.1 FragFuse 三阶段 | p.3 | `work/pages/R3-01_fig1-03.png` | 片段发现/载体注入/检索融合与 §4 一致 |
| R3-01 | Fig.3 困惑度分布 | p.14 | `work/pages/R3-01_fig3-14.png` | RAP/SeeAct/OSAgent 重叠，InspAgent 较弱，与 §6 一致 |
| R3-10 | Fig.2 Assign–Fuse–Leak 总览 | p.3 | `work/pages/R3-10_fig2-03.png` | 三相与 §3 一致 |
| R3-10 | Fig.3 轨迹隐空间投影 | p.8 | `work/pages/R3-10_fig3-08.png` | 完整 SOPE 与良性轨迹重叠，消融偏离 |
| R3-10 | Table 2 效果数据 | p.7 | `work/pages/R3-10_table2-07.png` | 已核对列对齐：targeted LR 0.92 / untargeted LR 0.76（benchmark） |
| R3-80 | Fig.1 架构与 proof bundle | p.2 | `work/pages/R3-80_fig1-02.png` | provider 侧需证明、client/local tools 可信 |
| R3-80 | Fig.2 stepwise vs one-shot | p.17 | `work/pages/R3-80_fig2-17.png` | 因果掩码单次前向与逐步证明对比 |
| R3-09 | Fig.1 三类隐私范式对比 | p.1 | `work/pages/R3-09_p1-01.png` | prompt/agent 外部干预 vs 训练内化，与 §1 一致 |
| R3-09 | Table 5 主结果（Mistral judge） | p.18 | `work/pages/R3-09_p18-18.png` | Llama-8B PrivAct 6.263 vs Vanilla 9.697；Mistral 11.414 vs AIFC 23.737 |
| R3-09 | Fig.3 组件消融 | p.7 | `work/pages/R3-09_p7-07.png` | V-only/R-only/V+R 与 §4.4 一致 |
| R3-11 | Table 1 Netflix 链接结果 | p.3 | `work/pages/R3-11_p3-03.png` | m=2 GPT-5 79.17±4.97，经典基线 56.0–60.2 |
| R3-11 | Table 2 InferLink 主结果 | p.6 | `work/pages/R3-11_p6-06.png` | IMPLICIT/EXPLICIT-ZK/EXPLICIT-MK 的 LSR/U 与正文一致 |
| R3-11 | Table 3 refusal 分析 | p.17 | `work/pages/R3-11_p17-17.png` | GPT-5 COORDINATE+EXPLICIT-MK refusal 0.25、LSR 0.90→0.65 |
| R3-12 | Table 1 角色配置结果 | p.5 | `work/pages/R3-12_p-05.png` | BrowserART standalone HT 10.0→Star+2 38.0；RedCode/OS-Harm 同表 |
| R3-12 | Table 2 拓扑结果 | p.7 | `work/pages/R3-12_p7-07.png` | BrowserART Star 31.0 > Chain 16.0 > Mesh 7.0；RedCode Chain 42.5 |
| R3-12 | Table 4 跨模型角色结果 | p.13 | `work/pages/R3-12_p13-13.png` | GPT-5.4 最高 3.0；Qwen3-VL 9.0→40.0；Llama 70B 27.0→42.0 |
| R3-13 | Fig.1 七原则—干预点映射 | p.2 | `work/pages/R3-13_p2-02.png` | 五类干预点 [i]–[v] 与 §0 一致；全文唯一图 |
| R3-14 | Table 2 Overall ASR | p.6 | `work/pages/R3-14_p6-06.png` | Qwen-3 81.5、GPT-4o 78.1、Claude-4.5 28.9；Tool Chaining 73.3–96.3 |
| R3-14 | Table 4 防御迁移 | p.8 | `work/pages/R3-14_p8-08.png` | 单轮防御跨 Agent/攻击差异大，与 §5.3 一致 |
| R3-14 | Table 5 judge 混淆矩阵 | p.15 | `work/pages/R3-14_p15-15.png` | 300 例、准确率 89.67%、κ=0.67；矩阵与 FPR/FNR 矛盾（笔记 §9.2） |
| R3-15 | Table 2 工具/任务分布 | p.4 | `work/pages/R3-15_p4tab2-04.png` | Playwright 140、Terminal 70、Filesystem 70、PostgreSQL 70、Notion 15，合计 365 |
| R3-15 | Table 8/9 单轮 vs 多轮与防御 | p.25 | `work/pages/R3-15_p25-25.png` | 六模型单轮→多轮 ASR；ToolShield 后 Claude 71.78→21.92，平均降 29.8pp |
| R3-15 | Algorithm 1 safety tree | p.17 | `work/pages/R3-15_p17-17.png` | 测试用例生成/执行/经验 add/update/skip；Skip 分支与正文矛盾 |
| R3-16 | Table 1 主结果 | p.6 | `work/pages/R3-16_p-06.png` | 平均 ASR 25.1%；GPT-5 13%、DeepSeek-R1 43%、LLaMA 4 Maverick 17% |
| R3-16 | Table 3/4 组件与界面 | p.7 | `work/pages/R3-16_p-07.png` | 按钮 77.5% vs 超链接 22.5%；Social Proof/Consistency 份额最高 |
| R3-16 | Table 5/6 位置与定制 | p.8 | `work/pages/R3-16_p-08.png` | About 59/52；GoCalendar 3.3→18.6（5.6×）；Table 5 vs Table 15 不一致 |
| R3-17 | Table 1 假标签 probe | p.6 | `work/pages/R3-17_p6-06.png` | `<user>` 包裹的 CoT 仍 85% CoTness、仅 2% Userness |
| R3-17 | Fig.9/10 剂量-反应 | pp.7–8 | `work/pages/R3-17_p7-07.png`; `work/pages/R3-17_p8-08.png` | 626 次越狱按分位 9%→90%；1000 次 agent 注入 2%→70% |
| R3-17 | Fig.24 role space | p.26 | `work/pages/R3-17_p26-26.png` | forged CoT 79.1% CoTness；Userness 表中 9.4% vs 正文 3.2% 不一致 |
| R3-18 | Table 3 离线结果 | p.6 | `work/pages/R3-18_p6-06.png` | F1 70.7/80.4/79.4/82.8；precision 80.1/88.2/73.4/89.9 |
| R3-18 | Table 5 在线结果 | p.8 | `work/pages/R3-18_p8-08.png` | Claude 60→6、OpenAI 42→4、OpenCUA 32→2；UA/SR 同表 |
| R3-18 | Table F.1 分类型检测 | p.23 | `work/pages/R3-18_p23-23.png` | MIF recall 89.86/F1 81.42；HUB F1 44.57；OTIB F1 68.69 |
| R3-19 | Table 1 DoomArena | p.7 | `work/pages/R3-19_p7-07.png` | No Defense 88.87 → CausalArmor 3.65；BU 73.57→70.96 |
| R3-19 | Table 3/4 CoT masking 与消融 | pp.8, 20 | `work/pages/R3-19_p8-08.png`; `work/pages/R3-19_p20-20.png` | CoT masking ASR 1.75→0.29；AgentDojo ASR 0.62/0.42/0.40 |
| R3-19 | Proposition 4.1 / 证明 | p.5; pp.13–14 | `work/pages/R3-19_p4-04.png` | 条件性概率界 `T·|Y_mal|·exp(−(β+γ))`；非密码学定理 |
| R3-20 | Fig.6/7 主结果与消融 | p.8 | `work/pages/R3-20_p8_fig6l-08.png`; `work/pages/R3-20_p8_fig7-08.png` | full 99.2 F1；去 taint/watermark 99.0/99.1；counterfactual 84.2 |
| R3-20 | Fig.8 链恢复与延迟 | p.9 | `work/pages/R3-20_p9-09.png` | edge recall 91.4%、bottleneck 87.2%、0.15 ms |
| R3-20 | Table 11 数据集构成 | p.19 | `work/pages/R3-20_p19-19.png` | 1,077,298 总轨迹；531,099 attack/546,199 benign；CausalBench 49,898 |
| R3-21 | Fig.1 MOSAIC 循环 | p.1 | `work/pages/R3-21_p1-01.png` | Plan→Check→Act/Refuse 与 §2 一致 |
| R3-21 | Table 1 主结果 | p.5 | `work/pages/R3-21_p5-05.png` | GPT-4o harm 0.31→0.07；Qwen2.5 0.18→0.09；Phi-4 0.06→0.09 |
| R3-21 | Table 7 六次运行 | p.20 | `work/pages/R3-21_p20-20.png` | Harm 0.10±0.06、DPI ASR 0.42±0.11、单次 0.29–0.56 |
| R3-22 | Table 1 AgentPoison 主结果 | p.6 | `work/pages/R3-22_p6-06.png` | ASR-r 100→2.13、ASR-a 87.23→6.38、ASR-t 100→36.17 |
| R3-22 | Table 3 良性效用 | p.8 | `work/pages/R3-22_p8-08.png` | Ours 多数最高；EHR ACC 83.0→71.3、48.9→39.2 |
| R3-22 | Table 11 ASR-t gap | p.24 | `work/pages/R3-22_p24-24.png` | ASR-t=1−AccEM；LLaMA clean 37.20 vs defended 42.13 |
| R3-23 | Table 1/2 主结果 | p.6 | `work/pages/R3-23_p6hi-06.png` | GPT-5.2 89.3 ACC/97.2 ASR；Qwen3-VL 48.4/26.7 反例 |
| R3-23 | Table 3 扫描器结果 | p.8 | `work/pages/R3-23_p8-08.png` | SkillTrojan 98.2%/99.4% 判 safe；去编码/分段 3.4%/2.8% |
| R3-23 | Table 5 加密消融 | p.9 | `work/pages/R3-23_p9-09.png` | XOR+Base64 78.0% heuristic flag vs Hybrid 21.0% |
| R3-24 | Table 1 检测主结果 | p.6 | `work/pages/R3-24_p6-06.png` | AcMAS F1 0.92–0.95 vs G-Safeguard 0.72/0.43 |
| R3-24 | Table 2 防御效果 | p.7 | `work/pages/R3-24_p7-07.png` | TCR 0.96–1.00；ASR 0.02–0.05；No Defense ASR 0.85–0.91 |
| R3-24 | Table 4 计算开销 | p.9 | `work/pages/R3-24_p9-09.png` | 检测约 0.22%；修正 185.3ms/12.4% |
| R3-25 | Theorem 4.1 与攻击几何 | p.4 | `work/pages/R3-25_p4-04.png` | L-Lipschitz + margin γ ⇒ γ/L 邻域被接受；三种 near-benign 攻击 |
| R3-25 | Table 1 主结果 | p.7 | `work/pages/R3-25_p-07.png` | LLaMA MMLU No defense 38.8 vs Ours 52.7；GSM8K 66.7 vs 77.7 |
| R3-25 | Tables 4–5 信号持续性 | p.8 | `work/pages/R3-25_p-08.png` | Emb 0.62 vs Conf 0.84；half-life 1–3 轮，ASR@R 0.22→0.48 |
| R3-26 | Fig.1 机制总览 | p.2 | `work/pages/R3-26_p2-02.png` | 图构建→符号评分→反向传播→离群剪枝 |
| R3-26 | Table 1 主结果 | p.6 | `work/pages/R3-26_p6-06.png` | Flat 76.3→85.4；Hierarchy 78.6→87.5；No Attack 88.4/88.7 |
| R3-26 | Table 15 时间开销 | p.9 | `work/pages/R3-26_p9-09.png` | Flat +9.0%、Hierarchy +10.6%；与引言 <10% 不一致 |
| R3-27 | Table 1 主结果 | p.6 | `work/pages/R3-27_p6-06.png` | 最高 ASR 90.5%；scaffold 平均 63.1/49.3/38.9 |
| R3-27 | Fig.5 防御与消融 | p.8 | `work/pages/R3-27_p8-08.png` | Reminder 90.5→87.8；Filtering→43.6，recall 44.2% |
| R3-27 | Table 3 风险分类 | p.15 | `work/pages/R3-27_p-15.png` | Ads/Bias/Harmful/Prompt Injection/Misinformation 五类及后果 |
| R3-28 | UCB/技能表与公式 | p.4 | `work/pages/R3-28_p4-04.png` | 14 low-level + 14 high-level skills；UCB 选择策略 |
| R3-28 | Table 5 静态基线对照 | p.8 | `work/pages/R3-28_p8-08.png` | PLeak 降 41%、Raccoon 26%、Zhang 22%；JustAsk 仅 3% |
| R3-28 | Table 9 防御评估 | p.9 | `work/pages/R3-28_p9-09.png` | none 0.719、simple 0.676、aware 0.587；aware 后均 >0.5 |
| R3-29 | Fig.2/三分类 | p.4 | `work/pages/R3-29_p4-04.png` | red/green/yellow；29 挑战、9 CWE、4 关键基础设施域 |
| R3-29 | Fig.3/Table 1 结果 | pp.5–6 | `work/pages/R3-29_p5hi-05.png`; `work/pages/R3-29_p6-06.png` | Easy over-refusal；Hard 6/8 模型 0% 拒绝 |
| R3-29 | Table 2 reality check | p.7 | `work/pages/R3-29_p7-07.png` | Hard 正确识别真实环境 44–98%；Medium localhost 0–15% |
| R3-30 | Fig.1 ToolEmu 总览 | p.2 | `work/pages/R3-30_p1-01.png` | 工具仿真→Agent 动作→safety/helpfulness evaluator |
| R3-30 | Table 2 端到端验证 | p.7 | `work/pages/R3-30_p7-07.png` | Standard precision 72.5%、incidence 39.6%；Adversarial 68.8%、50.0% |
| R3-30 | Table 4 主结果 | p.9 | `work/pages/R3-30_p9-09.png` | GPT-4 Safety 2.359/23.9%/1.824；NoAct 3.000/0/0.063 |
| R3-31 | Fig.1 chat vs agent ASR | p.2 | `work/pages/R3-31_p2-02.png` | GPT-4o 12/13/8/74/100；o1-preview 4/0/13/68 |
| R3-31 | Fig.5 直接请求结果 | p.7 | `work/pages/R3-31_p7-07.png` | 8 模型 chat/HTML/tool/agent ASR |
| R3-31 | Table 2 攻击矩阵 | p.9 | `work/pages/R3-31_p8_9-09.png` | Human rewrites 98/99；Ensemble 100/100；Opus Ensemble 41 |
| R3-32 | Fig.2 四种 Agent 图 | p.4 | `work/pages/R3-32_p4-04.png` | base/captioner/reflexion/tree search 组件图 |
| R3-32 | Fig.4 攻击结果 | p.7 | `work/pages/R3-32_p7-07.png` | 文本 40%、captioner 31%、self-caption 19%、base CLIP 10% |
| R3-32 | Fig.5/6 evaluator/value function | pp.8–9 | `work/pages/R3-32_p8-08.png`; `work/pages/R3-32_p9-09.png` | 31→25→36；31→26→38 |
| R3-33 | Fig.1/2 EIA 注入 | pp.2, 5 | `work/pages/R3-33_p2-02.png`; `work/pages/R3-33_p5-05.png` | 不可见表单/镜像注入 + 自动提交 |
| R3-33 | Table 1 主结果 | p.7 | `work/pages/R3-33_p7-07.png` | 特定 PII 70%；GPT-4V SR 0.78 |
| R3-33 | Fig.24 Relaxed-EIA | p.28 | `work/pages/R3-33_p28-28.png` | 完整请求最高 16%（GPT-4V）；开源模型 0 |
| R3-34 | Fig.3 策略演化 | p.7 | `work/pages/R3-34_p7-07.png` | A0 直接索取→A1 紧急/权威→A2 冒充/伪造同意；D1→D2 |
| R3-34 | Table 2 交替搜索 | p.6 | `work/pages/R3-34_p6-06.png` | A0,D0 3.4%；A1,D0 76.0%；A1,D1 2.5%；A2,D1 42.2%；A2,D2 7.1% |
| R3-34 | Table 11 有用性权衡 | p.22 | `work/pages/R3-34_p22-22.png` | C0,D2 helpful 31.2%；加 helpful prompt 96.2% |
| R3-35 | Fig.1/2 自主性结果 | pp.6–7 | `work/pages/R3-35_p6-06.png`; `work/pages/R3-35_p7-07.png` | o3-mini TCR@0 59.1 vs 50.1/35.5/24.3 |
| R3-35 | Table 2 模型异质性 | p.16 | `work/pages/R3-35_p16-16.png` | GPT-4o PRUDENTIA HITL 23.8 vs FIDES 7.8；GPT-5 41.3→7.3 |
| R3-35 | Table 3–6 成本 | p.19 | `work/pages/R3-35_p19-19.png` | GPT-4o banking 3.859 vs 1.542 USD cents；input 22.6K vs 7.7K |
| R3-36 | Fig.1/2 CFH 与 alignment | pp.2–3 | `work/pages/R3-36_pg-02.png`; `work/pages/R3-36_pg-03.png` | CFH 伪装错误+修复；四个 checker 全放行 |
| R3-36 | Table 1/2 主结果 | pp.7–8 | `work/pages/R3-36_p7-07.png`; `work/pages/R3-36_p8-08.png` | Undefended coding CFH 97–100%；CONTROLVALVE 全 0% |
| R3-36 | Table 9 运行开销 | p.19 | `work/pages/R3-36_pg-19.png` | Base 51s vs CONTROLVALVE 128s |
| R3-37 | Fig.1 序列监控 | p.1 | `work/pages/R3-37_p1-01.png` | 累计上下文→halt/continue |
| R3-37 | Table 1 主结果 | p.7 | `work/pages/R3-37_p7-07.png` | GPT-4o-mini F1 0.918、0.437s；o3-mini 0.836、3.976s |
| R3-37 | Table 3 PAIR | p.9 | `work/pages/R3-37_p9-09.png` | 50 次迭代 F1 0.872、DSR 0.814 |
| R3-38 | Fig.1 威胁模型 | p.4 | `work/pages/R3-38_p4-04.png` | benign prompt + webpage + visual payload + environment |
| R3-38 | Table 1 主结果 | p.7 | `work/pages/R3-38_p7-07.png` | CUA 最高 51.3%；BUA 最高 100%；AR/SR |
| R3-38 | Fig.3 行为分析 | p.8 | `work/pages/R3-38_p8-08.png` | success/partial/failed/no recognition/recognition |
| R3-39 | Fig.2 模板注入 | p.3 | `work/pages/R3-39_p2-02.png` | special-token 角色边界伪造 |
| R3-39 | Table 1 主结果 | p.5 | `work/pages/R3-39_p5-05.png` | InjecAgent 15.13→45.90%；AgentDojo 5.18→32.05% |
| R3-39 | Table 2 跨模型迁移 | p.8 | `work/pages/R3-39_p8-08.png` | Qwen 模板跨模型 21.4/16.8；闭源 29.6/23.5 |
| R3-40 | Fig.1 AuraGen 管线 | p.3 | `work/pages/R3-40_p3-03.png` | 良性轨迹→风险注入→奖励模型过滤 |
| R3-40 | Table 2 主结果 | p.9 | `work/pages/R3-40_p9-09.png` | Safiron SFT+GRPO 0.949/0.973/0.646/0.570；GPT-5 0.425/0.990 |
| R3-40 | Fig.11 案例研究 | p.17 | `work/pages/R3-40_p17-17.png` | MetaGPT 0.91、AutoGen 0.83 |
| R3-41 | Fig.2 五种协议 | p.4 | `work/pages/R3-41_p4-04.png` | B/GS/GL/RS/RL 与五角色 |
| R3-41 | Table 2/3 主结果 | p.6 | `work/pages/R3-41_p6-06.png` | GPT-5 17.63→41.59；Llama3.1-8B 44.58→99.67 |
| R3-41 | Fig.5/6 防御 | pp.9–10 | `work/pages/R3-41_p9-09.png`; `work/pages/R3-41_p10-10.png` | GPT-4o σ_RS 56.0→17.0/25.2；Llama SFT 99.5→18.2/21.5 |
| R3-42 | Fig.1 风险模型 | p.2 | `work/pages/R3-42_p2-02.png` | sender/recipient/LM agent，无恶意攻击者 |
| R3-42 | Table 2 主结果 | p.8 | `work/pages/R3-42_p8-08.png` | GPT-4 PE probing 98.99、LR 24.54、LRh 25.68 |
| R3-42 | Table 3 动态扩展 | p.9 | `work/pages/R3-42_p9-09.png` | 10 seeds×5 条件；pL 0.2–0.6 |
| R3-43 | Fig.1 隐写分类 | p.2 | `work/pages/R3-43_r-02.png` | covertext modification / information-theoretic / complexity-theoretic |
| R3-43 | 定理页 | pp.9–10 | `work/pages/R3-43_q-09.png`; `work/pages/R3-43_q-10.png` | Definition 1、Theorem 1–4 |
| R3-43 | 群体隐写结果 | pp.31–32 | `work/pages/R3-43_t20-31.png`; `work/pages/R3-43_t20b-32.png` | GPT-4 26%、GPT-3.5 18%、GPT-2 0% |
| R3-44 | Fig.1 评测流程 | p.4 | `work/pages/R3-44_p4-04.png` | 观测→动作→Privacy Leakage Evaluator |
| R3-44 | Table 4 主结果 | p.9 | `work/pages/R3-44_p9-09.png` | 无缓解泄露 0.455–0.902；privacy CoT 0.821–0.939 |
| R3-44 | Table 5 任务级泄露 | p.9 | `work/pages/R3-44_p9crop-09.png` | reddit_create_post 89/96→18/96；总计 162/246→73/246 |
| R3-45 | Fig.1/2 评估器架构 | pp.3–4 | `work/pages/R3-45_p8-08.png` | 特征记忆→聚类→CoT 推理记忆→两级检索 |
| R3-45 | Table 2 主结果 | p.8 | `work/pages/R3-45_p8_table-08.png` | AgentAuditor R-Judge 96.31 F1；ASSE-Safety 91.59 |
| R3-45 | Table 22 人类评估 | p.56 | `work/pages/R3-45_p56-56.png` | 人类/LLM 对比仅 50 条子样本；三列错位 |
| R3-46 | Fig.2/Table 1 任务构造 | p.4 | `work/pages/R3-46_p4-04.png` | 150 任务/每类 50/11 应用/53 文件 |
| R3-46 | Table 2 主结果 | p.7 | `work/pages/R3-46_p7-07.png` | unsafe 21–29%；C1 48–70%、C2 2–20%、C3 4–10% |
| R3-46 | Table 3 judge 一致性 | p.8 | `work/pages/R3-46_p8-08.png` | 安全 F1 0.76、完成 F1 0.79 |
| R3-47 | Fig.1 AMA 流程 | p.2 | `work/pages/R3-47_p2-02.png` | metadata 生成→模拟选择→top-k 演化 |
| R3-47 | Table 1 主结果 | p.7 | `work/pages/R3-47_p7-07.png` | targeted ASR 81.43–95.58%；untargeted GPT-4o-mini 23.10% |
| R3-47 | Table 2 auditor | p.9 | `work/pages/R3-47_p9-09.png` | AMA TPR 1.67–6.25%；Injection 55.00% |
| R3-48 | Fig.1 系统安全映射 | p.3 | `work/pages/R3-48_p3-03.png` | 五原则与 Agent 组件映射 |
| R3-48 | Table 1 十一案例 | p.5 | `work/pages/R3-48_p5hi-05.png` | 11 个真实攻击与原则违反勾选 |
| R3-48 | Fig.2 研究议程 | p.17 | `work/pages/R3-48_p17-17.png` | semantic gap 与三机制挑战 |
| R3-49 | Fig.3 攻击矩阵 | p.4 | `work/pages/R3-49_p4-04.png` | 3×3 attacker–defender、945 battles |
| R3-49 | Table 1 轮数结果 | p.6 | `work/pages/R3-49_p6-06.png` | 首轮 ASR 0–1% vs 15 轮 7.9–16.8% |
| R3-49 | Table 6/8 provenance | pp.14–16 | `work/pages/R3-49_p14-14.png`; `work/pages/R3-49_p16-16.png` | provenance 110/270→70/270 |
| R3-50 | Fig.2 ORBIT 六层 | p.5 | `work/pages/R3-50_p5-05.png` | setup/scenario/attack/defense/execution/evaluation |
| R3-50 | Table 2 防御主结果 | p.9 | `work/pages/R3-50_p9-09.png` | monitor 72→12% compromised；collusion 30→30% |
| R3-50 | Table 14 DiD | p.35 | `work/pages/R3-50_p35-35.png` | compromised −60 [−74,−46]；collusion 0 [−14,+14] |
| R3-52 | Table 1 错误场景 | p.4 | `work/pages/R3-52_p4-04.png` | 4 本地 + 3 远程错误 |
| R3-52 | Table 2 taxonomy | p.5 | `work/pages/R3-52_p-05.png` | 5 类 13 行为 B01–B13 |
| R3-52 | Fig.2/3 主结果 | pp.3, 7 | `work/pages/R3-52_p3-03.png`; `work/pages/R3-52_p7-07.png` | 64.79% rollout；164/208 tuples；上报率 50.22% |
| R3-53 | Fig.2/3 探针与 ASR | pp.5, 7 | `work/pages/R3-53_p5-05.png`; `work/pages/R3-53_p7-07.png` | 检测 99.15/97.46/95.35%；ASR 73.80→16.70 等 |
| R3-53 | Table 2/3 steering | pp.8–9 | `work/pages/R3-53_p8-08.png`; `work/pages/R3-53_p9-09.png` | ASR 下降与负向 steering 100%/63% |
| R3-53 | Table 10 随机方向 | p.22 | `work/pages/R3-53_p22-22.png` | 随机方向仍有 40.00/30.43% ASR |
| R3-54 | Fig.1/2 条件设计 | pp.3, 5 | `work/pages/R3-54_p3-03.png`; `work/pages/R3-54_p5-05.png` | 8 条件、状态/通道两轴 |
| R3-54 | Table 2 主结果 | p.20 | `work/pages/R3-54_p20-20.png` | o3 1.8→34.0；Gemini-Flash 2.2→35.7；Kimi 11.1→63.1 |
| R3-54 | Table 3 分解 | p.21 | `work/pages/R3-54_p21-21.png` | A1 6/10 为负；A4 9/10 为正 |
| R3-55 | Fig.1 在线审计 | p.2 | `work/pages/R3-55_p2-02.png` | post-hoc attribution vs prefix-level alarm |
| R3-55 | Table 1 主结果 | p.7 | `work/pages/R3-55_p7-07.png` | Exact-F1 66.44；DeepSeek 46.56 |
| R3-55 | Table 6 部署 trade-off | p.20 | `work/pages/R3-55_p20-20.png` | FAR 2.37%、Step-Acc 59.51% |
| R3-56 | Fig.4 因子化主结果 | p.9 | `work/pages/R3-56_p9-09.png` | all-off 23.7–34.9% → goal-only 74.4–81.2% |
| R3-56 | Table 7/8 工具与组件 | p.22 | `work/pages/R3-56_p22-22.png` | 33 个工具类别字符串与组件均值 |
| R3-57 | Table 1 八 Agent 主结果 | p.6 | `work/pages/R3-57_p6-06.png` | AutoGLM 9B 二值无害 90.5%、Safe 19.0% |
| R3-57 | Tables 4/5 相关性/退化 | p.15 | `work/pages/R3-57_p15-15.png` | general SR vs Cond-Safe r=0.239；vs 1−CFR r=0.906 |
| R3-57 | Table 8 hard subset | p.19 | `work/pages/R3-57_p19-19.png` | 强模型仍有 37–44% CFR |
| R3-58 | Table 1/2 攻击主结果 | p.7 | `work/pages/R3-58_p7-07.png`; `work/pages/R3-58_p7_tab1-07.png` | Camel PDR 5.6→98.0%；AutoGen JDR-R3 7.5% |
| R3-58 | Table 3 防御对比 | p.8 | `work/pages/R3-58_p8-08.png`; `work/pages/R3-58_p8_tab3full-08.png` | Doctor JDR 21.5→1.5%，PDR 98.4→26.2% |
| R3-59 | Fig.3 两阶段 CIA | p.4 | `work/pages/R3-59_p4-04.png` | 对抗查询→输出还原→GBD/LWS→有向边 |
| R3-59 | Table 1 AUC 主结果 | p.7 | `work/pages/R3-59_p7-07.png`; `work/pages/R3-59_p7_300-07.png` | 12 设置均值 0.8608、峰值 0.9873 |
| R3-59 | Tables 2/3 消融 | p.8 | `work/pages/R3-59_p8-08.png` | 去 GBD 0.5115–0.6294；去 LWS 0.7061–0.9012 |
| R3-60 | Fig.2 欺骗界面示例 | p.4 | `work/pages/R3-60_p4-04.png`; `work/pages/R3-60_p4_fig2b-04.png` | pop-up、price drift 等状态触发注入 |
| R3-60 | Table 1/2 主结果 | pp.7–8 | `work/pages/R3-60_p7-07.png`; `work/pages/R3-60_p8-08.png` | domain redirection SVR 1.00；price drift TC 0.59/SVR 1.00 |
| R3-61 | Fig.1 CostBomb 流程 | p.1 | `work/pages/R3-61_p01-01.png` | 网页注入→生成器/选择器→token 成本膨胀 |
| R3-61 | Table 1/2 主结果 | p.8 | `work/pages/R3-61_p08-08.png`; `work/pages/R3-61_p08hi-08.png` | SeeAct 9 设置 ΔTkC>0；最高 ΔTkC 1.6031 |
| R3-61 | Algorithm 1 / Table 3 | pp.13–14 | `work/pages/R3-61_p13-13.png`; `work/pages/R3-61_p13-14.png` | 选择器流程；TSR 27.50→23.91% |
| R3-62 | Fig.1/2 模拟与防御 | pp.2–3 | `work/pages/R3-62_p02-2.png`; `work/pages/R3-62_p03-3.png` | 7-Agent 实验室与四类干预 |
| R3-62 | Table 1/2 主结果 | p.6 | `work/pages/R3-62_p06-6.png`; `work/pages/R3-62_p06_table2-6.png` | robustness 76.7→90.0%；cooperation 87.1→52.3% |
| R3-63 | Fig.1 SAPA-Bench 流程 | p.1 | `work/pages/R3-63_p1-1.png` | 场景构建→标注→七模型横评 |
| R3-63 | Table 1 主结果 | p.5 | `work/pages/R3-63_pg-5.png`; `work/pages/R3-63_table1_crop-5.png` | PRR 最高 80.16%；PLR 13.61–45.14% |
| R3-63 | Table 2/3 条件结果 | p.6 | `work/pages/R3-63_pg-6.png` | NH 条件 RA 仅 11.75–21.63；EH 最高 67.14% |
| R3-64 | Fig.1/3 任务与拒绝率 | pp.2, 5 | `work/pages/R3-64_p2.png`; `work/pages/R3-64_fig3_p5_300dpi.png` | 高风险拒绝 31%（图）vs 36%（表） |
| R3-64 | Table 2/3/4 主结果 | p.7 | `work/pages/R3-64_tab2_p7_300dpi.png`; `work/pages/R3-64_tab34_p7_300dpi.png` | SCoT 6→36%；IPI 防御 3/50、8/50、15/50 |
| R3-65 | Fig.1 MCPTox 流程 | p.1 | `work/pages/R3-65_p1-1.png` | 真实 MCP 工具→投毒描述→20 模型评测 |
| R3-65 | Table 1 范式计数 | p.4 | `work/pages/R3-65_p4_table1_300dpi-4.png` | P1 224 / P2 548 / P3 725，合计 1,497 vs 1,348 |
| R3-65 | Table 2/3 ASR | p.6 | `work/pages/R3-65_p6-6.png`; `work/pages/R3-65_p6_table2_300dpi-6.png` | 平均 ASR 36.5%；o1-mini 72.8% |
| R3-66 | Fig.1 MCP 调用链 | p.2 | `work/pages/R3-66_p2_fig1_300dpi-2.png` | host/客户端/服务器与工具选择位置 |
| R3-66 | Table 1 GAPMA 主结果 | p.7 | `work/pages/R3-66_p7_table1_300dpi-7.png` | ASR 22.19–91.88%；基线 16.67% |
| R3-66 | Fig.5 隐蔽性 | p.7 | `work/pages/R3-66_p7_fig5_full_300dpi-7.png` | LLM judge TPR 0–5%；人评更高 |
| R3-67 | Fig.2 攻击/防御流程 | p.3 | `work/pages/R3-67_p3_defense.png` | MU-BA/BU-MA 与 prompt 自检 |
| R3-67 | Table 1 主结果 | p.4 | `work/pages/R3-67_p4.png` | ASR 93/45/71% 与 71/84/45% |
| R3-67 | Fig.3/4 质量与消融 | p.5 | `work/pages/R3-67_p5_fig3.png`; `work/pages/R3-67_p5_fig4b.png` | BU-MA AgentVerse 一致性 0.78→0.57 |
| R3-68 | Table 1 主结果 | p.6 | `work/pages/R3-68_tab1-6.png` | ASR 85.4–95.3；Stealth 74.7–82.6 |
| R3-68 | Fig.4 敏感性 | p.7 | `work/pages/R3-68_fig4-7.png` | δ 变化大于 ε，与正文表述不符 |
| R3-69 | Table 1 主结果 | p.12 | `work/pages/R3-69_p12-12.png` | 34 0-day/23 CVE；69.01 CPU h |
| R3-69 | Table 4 CVE 清单 | p.20 | `work/pages/R3-69_tab4_crop-20.png` | 34 行（23 具体 CVE + 11 Assigning） |
| R3-69 | Table 5 sink 列表 | p.21 | `work/pages/R3-69_p21-21.png` | 16 条 sink callsite |
| R3-70 | Fig.1/2 框架 | pp.5, 7 | `work/pages/R3-70_fig1-p05.png`; `work/pages/R3-70_fig2-p07.png` | 轨迹驱动 vessel 排序与载荷生成 |
| R3-70 | Table 2/Fig.3 主结果 | p.10 | `work/pages/R3-70_tab2-fig3-p10.png` | E2E 18 基线 vs 7–10 |
| R3-70 | Tables 3–5 运行与检测 | p.13 | `work/pages/R3-70_tab345-p13.png` | 44 次 E2E；ASR 86.7%；最佳 TPR 32.2% |
| R3-71 | Fig.1 检索攻击流程 | p.3 | `work/pages/R3-71_p03.png` | 恶意文档→黑盒 embedding 优化→检索 |
| R3-71 | Table 1 检索召回 | p.7 | `work/pages/R3-71_p07_200.png` | 多数数据集 Recall@5 近 100%；Vanilla 0 |
| R3-71 | Table 3 平均结果 | p.21 | `work/pages/R3-71_p21_200.png` | 平均 n=10 94.1%；与正文 95.6% 冲突 |
| R3-72 | Table 1/2 系统与攻击面 | pp.4–6 | `work/pages/R3-72_p-04.png`; `work/pages/R3-72_table2_lower-06.png` | 9 系统各至少一个攻击面成功 |
| R3-72 | Table 3 guardrail | p.12 | `work/pages/R3-72_q-12.png` | BrowserOS IPI ASR 0.89→0.00；TSR 0.20→0.14 |
| R3-73 | Table 1 DPSR 主结果 | p.8 | `work/pages/R3-73_p08-08.png` | 总体 41.1%；Skyvern 72.3%、Agent-E 12.1% |
| R3-73 | Table 2 LLM 差异 | p.9 | `work/pages/R3-73_p09-09.png` | DPSR Claude 53.8%、GPT-4o 51.3%、Gemini 65.8% |
| R3-73 | Table 3 prompt 防御 | p.12 | `work/pages/R3-73_p12-12.png` | specific postscript 63.0→43.0% |
| R3-74 | Fig.2/Table 2 攻击分类 | pp.6–8 | `work/pages/R3-74_p06-06.png`; `work/pages/R3-74_p08-08.png` | 32 变体/5 类；84.4% 可提取多图 |
| R3-74 | Table 7/8 防御结果 | pp.9–10 | `work/pages/R3-74_p09-09.png`; `work/pages/R3-74_p10-10.png` | 平均召回 88.7→0% |
| R3-75 | Fig.1/3 架构 | pp.3, 5 | `work/pages/R3-75_p03.png`; `work/pages/R3-75_p05.png` | trace→audit→enforce；A2M 状态机 |
| R3-75 | Tables 1/2 攻击基准 | p.9 | `work/pages/R3-75_hi-09.png`; `work/pages/R3-75_tab2-09.png` | 60 场景/7 类；平均 ASR 87.25% |
| R3-75 | Table 4 防御对比 | p.11 | `work/pages/R3-75_tab4-11.png` | AgentSentinel DSR 79.6% vs 基线 29.2% |
| R3-76 | Fig.1 RAGworm 流程 | p.6 | `work/pages/R3-76_crop_p06_fig1.png` | 检索→改写→复制→外发 |
| R3-76 | Table 1 模型易感性 | p.4 | `work/pages/R3-76_p04.png` | 13/15 完全易感；Claude Sonnet 3.7 0/5 |
| R3-76 | Table 2/Fig.8 传播 | pp.9–10 | `work/pages/R3-76_p09.png`; `work/pages/R3-76_crop_p10_fig8.png` | Gemini 1.5 Flash 1.000；约 20 新客户/感染者（估算） |
| R3-77 | Table 2 ASR | p.10 | `work/pages/R3-77_p-10.png` | Opt.-Free 0%；Opt.-Based 1–14% vs StruQ 27–60% |
| R3-77 | Table 6/8 WinRate 与消融 | p.15 | `work/pages/R3-77_p-15.png` | Instruct WinRate 67.01→69.22；DPO/ORPO/KTO |
| R3-79 | Fig.2/3 分析流程 | pp.5–7 | `work/pages/R3-79_p05-05.png`; `work/pages/R3-79_p07-07.png` | action graph→sandbox replay→LLM judge→rewrite |
| R3-79 | Table 2 检测结果 | p.9 | `work/pages/R3-79_p09_300dpi-09.png` | skill F1 94.53%；action F1 94.74% |
| R3-79 | Table 10/19 抑制与效用 | pp.12, 21 | `work/pages/R3-79_p12_300dpi-12.png`; `work/pages/R3-79_p21_300dpi-21.png` | 472→54；utility 94.78% |
| R3-81 | Fig.3 识别率 | p.7 | `work/pages/R3-81_p7.png` | overall 0.438–0.825 |
| R3-81 | Table 3 画像 | p.8 | `work/pages/R3-81_tab3_p8_300dpi.png` | 0.401–0.712；PII 0.589–0.833 |
| R3-81 | Table 5 缓解 | p.12 | `work/pages/R3-81_tab5_p12_300dpi.png` | 画像最大降 57.9%；任务损失 16.7–20.4% |
| R3-82 | Fig.2/Table 1 主结果 | pp.4, 11 | `work/pages/R3-82_p4.png`; `work/pages/R3-82_p11.png` | SHADE-Arena ASR 100→8.3%；BU 94.4% |
| R3-82 | Table 5 AgentDojo | p.12 | `work/pages/R3-82_p12.png` | ASR 0.7/0.4/0.0；PI2 98.2→0.0 |
| R3-82 | 自适应/白盒 | p.13 | `work/pages/R3-82_p13.png` | J/M-adaptive 12.5%；GCG 4.2% |
| R3-83 | Fig.2/Table 1 记忆攻击 | pp.6, 9 | `work/pages/R3-83_p6.png`; `work/pages/R3-83_p9.png` | A-Mem 0.89–0.90、LangMem 0.77–0.83、Mem0 0.91–0.95 |
| R3-83 | Table 7 Hermes 真实系统 | p.11 | `work/pages/R3-83_tab7_p11_300dpi.png` | Qwen3-max/DeepSeek-r1/Kimi 1.00；Claude Opus 0.12 |
| R3-84 | Table 5 provenance | p.8 | `work/pages/R3-84_p8-08.png` | first-party 80.6%、third-party 17.6%、user 1.8% |
| R3-84 | Table 9 有效性 | p.15 | `work/pages/R3-84_p15_table9_crop-15.png` | plain text 最高 3.9%；HTML 1.1%；raw 0.2% |
| R3-85 | Fig.1 工作流劫持 | p.3 | `work/pages/R3-85_fig1_300-03.png` | 注释→Agent 指令→CI 执行 |
| R3-85 | Table 1 数据集 | p.5 | `work/pages/R3-85_table1_300-05.png` | 112,568 workflows；9,154 n8n 模板 |
| R3-85 | Tables 4/5 结果 | p.14 | `work/pages/R3-85_p-14.png` | 4,174 hijackable；481 s/$0.62 per workflow |
| R3-86 | Tables 2/3 主结果 | p.10 | `work/pages/R3-86_p10_300-10.png` | ToolBench/MCPTools 92.7/93.8% |
| R3-86 | Tables 4/5 防御 | p.11 | `work/pages/R3-86_p11-11.png` | 六防御 91.2/92.2%；CVR 降至 18.0/17.6% |
| R3-86 | Fig.3/4 优化与消融 | pp.10–12 | `work/pages/R3-86_p10_fig4crop-10.png`; `work/pages/R3-86_p12-12.png` | 143 LLM calls vs ToolHijacker 4,501 |

## 使用规则
- 这些图片只用于核对论文内容，不得作为新的“论文语料”或外部资料混入 124 篇主体。
- 引用时优先写 `notes/<id>.md` 的证据表；需要图证时再指向本表与 `work/pages/`。
- 后续批次继续按“关键图页 PNG + 笔记证据表”的方式积累。
