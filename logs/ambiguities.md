# 歧义与异常日志

> 规则：遇到不一致，以 PDF 原文论证技术事实；以用户固定清单决定是否在 124 篇范围内。不得悄悄修正历史记录。

## 1. 映射异常
- 无。124 个 ID 与 124 个 PDF 一一精确匹配（规范化标题，match_score=1.00）。
- 未发现六篇排除论文（R3-51、R3-78、XX-01—XX-04）的 PDF。

## 2. R3-80 书目信息缺失
- `papers/zkAgent_Verifiable LLM Agent Execution via One-Shot Transcript Proofs.pdf` 首页只有标题、作者、单位，**未标注会议/期刊/年份**。
- 处理：`registry/paper_manifest.csv` 与 `papers.jsonl` 的 venue/year 保持空/null；不根据引用格式或记忆猜测。待用户元数据库或正式出版信息确认后回填。
- 作者单位：Shanghai Jiao Tong University（PDF p.1）。

## 3. 页码口径
- 笔记与证据表统一使用 **PDF 文件页码**（抽取文本中的 `===== PAGE n / N =====`），不是印刷页码。
- 已知偏移：
  - R1-01：PDF p.1 为 USENIX 封面；PDF p.2 起为正文，印刷页 6047。
  - R3-01：PDF p.1 为 USENIX 封面；PDF p.2 起为正文，印刷页 4761。
  - R2-07：PDF p.1 = 印刷 p.1。
  - R3-10：PDF p.1 = 印刷 p.1。
  - R3-80：PDF p.1 = 印刷 p.1。
- 引用正文时同时写章节/图表，避免只依赖页码。

## 4. 术语误用风险（R3-10）
- R3-10 标题使用 “Statistically Indistinguishable”，但全文没有密码学/统计学意义上的不可区分性定义（无分布族、distinguisher、advantage、negl(κ)），其操作化是 ESR、PPL 重叠、轨迹隐空间重叠与分类器规避。
- 处理：在笔记中明确标注“非形式化”，阶段三评分时不得因标题术语给理论密码学高分。这不是论文错误，而是术语口径差异。

## 5. 已读论文的版本/发表状态
- R1-01、R3-01 为 USENIX Security 2026 正式论文集版本（有会议封面、ISBN、印刷页）。
- R2-07 为 ICML 2025 PMLR 267 版本。
- R3-10 为 ICML 2026 PMLR 306 版本。
- R3-80 版本状态未知（见第 2 条）。

## 6. R1-11 页数/页码异常（已修正）
- `pdfinfo` 显示 R1-11 为 **18 页**，但旧版 `pdftotext` 全文件抽取按 `\f` 切分得到 **36 个页块**：PDF 页面文本内含嵌入的 form-feed 字符，导致页码整体错位。
- 处理：`scripts/extract_text.js` 已改为逐物理页调用 `pdftotext -f n -l n`，重新抽取 R1-11 后为 18 页；后续所有论文均用此方法。
- 已检查第一批 5 篇与 R1-02—R1-06 的页标记数与 `pdfinfo` 一致，未受影响。

## 7. 抽取质量
- `pdftotext -layout` 对双栏论文的表格列、公式上下标、图内文字有错位。
- 已对 5 篇的关键图页做 PNG 渲染核对（`work/pages/`）；后续长文继续此流程。
- 未使用 OCR；未发现扫描页。

## 8. 批次 11 原文内部不一致（均已在笔记标注，不作为证据使用）
- **R3-09**：摘要 “up to 12.32%” 实为百分点（23.7−11.4），且是 Mistral-7B 特定运行点；Table 2 的加粗方向与指标方向不一致；Table 2 将 Llama-3.2-1B 标为 “Llama-3B”；训练细节写 generator 4 epochs，但消融只涉及 verifier/refiner；Table 5 与 Table 6（GPT-4o）的有用性绝对值差一个数量级却称 consistent。
- **R3-11**：Table 2 的 Gap 行用正值表示 privacy gain（与 LSR 算术差方向相反）；Claude 在 m=6 的 93.13 低于 m=4 的 97.27（非单调）；Abstract 复数 “agents” 的 79.2% 实为 GPT-5 单模型结果。
- **R3-12**：p.7 正文称 RedCode 良性 “54–56%”，但 Table 2 的 Star+4 为 48.0；3.8× 对应 BrowserART 38.0/10.0，RedCode Chain 原始比值为 4.5×；p.6 “GPT-5.4 ≤3% across all configurations” 仅适用于 BrowserART；OS-Harm “uniformly zero” 与 standalone 2.0 不符。
- **R3-14**：Table 5 印刷矩阵（TN=80/FN=11/FP=20/TP=189）与所报 FPR 12.09%/FNR 9.57% 矛盾；Table 2 GPT-5.1 Overall 69.9% 与其五类简单平均 60.18% 不一致；Figure 8 误引 Figure 5；默认 attacker 与实际 task injection/memory poisoning 使用的 GPT-5.1 不一致；A.4 把 white-box 能力称为 grey-box。
- **R3-13**：Abstract 承诺的 “fundamental shifts” 正文未编号兑现；UNESCO 引文被标为 `(Zhu et al., 2025)`，与参考文献不符；`(Commission, 2020)` 与 2019 Guidelines 条目不一致。

## 9. 批次 12 原文内部不一致（均已在笔记标注，不作为证据使用）
- **R3-15**：Table 8 caption 的 Playwright 150 与 Table 2 的 140/总 365 矛盾；§4.1 “79% vs 51%” 与 “88.57%” 对不上 Table 8 平均值；16%/30% 实为百分点但原文混用 %；Table 5 分母 309 vs 正文 300；Algorithm 1 的 Skip 分支 `E \ {e.key}` 与正文矛盾；Table 10 “Baseline” 与 Fig.12 “Taxonomy Defense” 命名不一致。
- **R3-16**：Table 5 的 About targeted 59% 与 Table 15 三个开源模型的 30/26/26（均值 27.3%）无法对应；Table 6 的 DeepSeek-R1 DashDish 定制后 22.9→20.0，方向与总体“定制提升 ASR”相反；p.4 对 Figure 5 的两处交叉引用疑似错误；附录称 “six parts” 但只列 A–E。
- **R3-17**：Fig.24 caption/正文写 3.2% Userness，但表中为 9.4%；logic ablation 正文“60% vs 63%”与图中均值（basic 60.2 / absurd 63.0）顺序相反；Abstract 的 60% 是六模型均值，逐模型 17–94%。
- **R3-18**：Abstract 称“超过 15% absolute F1”，但 Table 3 相对最佳基线只有 GPT-5.1 Thinking 为 +15.9；Claude SR 42.9→40.7（-2.2pp），与“保持或提升 benign SR”不完全一致；OSWorld 无防御数字取自 leaderboard 而非同配置重跑。
- **R3-19**：Table 1 的 No Defense ASR 88.87 与 p.18 正文 89.47 冲突；p.4 “30× larger LLMs” 与 p.9 “10× parameter difference” 不一致；Table 3 的 ASR 0.29 无法由 Table 4 九格复算；p.19 “binary search; O(log S_t)” 与 batch 拆分不符；p.8 的 Gemini-3.1-Pro 疑为 Gemini-3-Pro 笔误。

## 10. 批次 13 原文内部不一致（均已在笔记标注，不作为证据使用）
- **R3-20**：Table 9 含 InjecAgent 1,054 而 Table 11 不含，benchmark 合计 18,060 vs 17,006；Table 10 的 split 仅覆盖 Toucan 1,010,394；Figure 4 ToolEmu 标 1,072 而正文/表格为 947；Figure 5 六域计数合计 18,200，无法与 49,898/1,077,298 对齐；Abstract 称 CausalBench >1M 但 App E.1 仅 49,898；示例 8 nodes 与后文 5 nodes 矛盾；Eq.1 无噪声项而示例含 U；Mechanism Integrity 文字称 d-separation、算法实际用 `tv ∨ wg`。
- **R3-21**：Table 4 与 §4.5 的 safety token 百分比不一致（9/124≈7.3%→36/182≈19.8% vs 正文 11%→16%；Phi-4 harmful 81/180=45%）；“safety tokens consistently below reasoning tokens” 与 Phi-4 safety 81 > think 26 矛盾；Table 5 与 Table 8 的 NR 列含义不同；Algorithm 1 多出未定义的 `p_ref`；Table 7 的 “Base MOSAIC” 行实为 MOSAIC 参考运行；训练集 Agent-SafetyBench 与参考文献 ASB 命名混叠。
- **R3-22**：Abstract “>95%” 与 Intro “>97%” 只在 ASR-r 上成立，端到端 ASR-t 仍为 36.17（EHRAgent）甚至 42.85（ReAct LLaMA+DPR）；Table 3 中 EHR 的 ACC 有 83.0→71.3、48.9→39.2 的下降；EntityOverlap 按 Eq.12 是 Jaccard∈[0,1]，Table 7 却报 15.0；正文称 “7 injected paths” 而 K=4；Eq.9 说教训就是异常路径本身，App H 又说要 synthesize 成 concise lesson。
- **R3-23**：Qwen3-VL 上 ASR 26.7 < AgentPoison 37.6、ACC 48.4 < Non-attack 53.2，推翻“strongest end-to-end attack”的全局表述；Table 7 中 Qwen3-VL 的 Native ACC 50.3 < Non-attack 53.2，与正文“Native 在全部四个设置最好”矛盾；Table 4 正确值应为 4 payload families/3 crypto variants/50 triggers（抽取文本误为 6/4/3）；§5.3 “从 top 1,200 中 retain”与 Table 4 “Templates 1200”未澄清。
- **R3-24**：异步 +0.55 的基线 0.38 无法由 Table 1 任何单一基线复现（0.38 恰为 G-Safeguard 0.432 与 BlindGuard 0.328 的平均，而同步 0.72 只取 G-Safeguard）；Table 3 与 Table 1/2 的 HotPotQA F1/TCR 不一致（0.95/0.98 vs 0.94/0.96）；攻击强度表述 0–40% vs 稳健到 50%/测试 75%；HotPotQA 正文称五个 agent、案例称三个 agent。

## 11. 批次 14 原文内部不一致与术语陷阱（均已在笔记标注，不作为证据使用）
- **R3-25**：γ、L、Sep(c) 均未测量；定理用 L2、实验用 cosine；N、R、|A|、数据集规模、δ、k、τ、ε、ℓ 未给；Eq (1)–(4) 无求解算法；down-weighting 未单独实验；Table 4 指标名与 Table 5 half-life 阈值未写。
- **R3-26**：**术语陷阱**——标题的 “signed DAG” 是边符号（+1/0/−1），不是数字签名；引言称开销 <10% 但 Table 15 为 10.6%；SA 降幅 3–4% vs 表 2–3 个百分点；Table 11 “decline” 与数值不符；动态图降幅 3% vs 复算约 1.9%；B.2/Table 20 百分比不可复算；MMLU 引用为 KMMLU；§4.1 子域列表与 5 列不符。
- **R3-27**：Table 7 与 Table 1 的模型 roster 不一致（Table 7 有 Qwen3-30B-A3B、LLaMA-3.3-70B-IT 而无 Kimi-K2）；Table 2 与 Table 1 的 GPT-4.1-mini 基线差 3–6 pp 且未说明时间戳；Qwen3-8B 时间戳对比下降 11.4 pp，原文仍称 “only slightly”；“不显式要求说服”与 Prompt 6 明确优化 perceived credibility 存在张力。
- **R3-28**：Table 2 与 Table 17 的 Method 列互相冲突；§1 称 6,973 tokens 是 Claude Code 自身，但 Table 13 的 main 只有 1,707，6,973 是五 Agent 总和；Table 17 caption 称 Self-C 只记 2 个模型、Cross-C 32 个，但表中 41 行都有值；Table 19 的 “Morph” 不在 41 模型列表；§4.3 多处技能标签错位（H5/FITD、L6/Reciprocity、L5/Social Proof）；§4.9 的 T1–T14/M1–M15 与 App J 的 L1–L14/H1–H14 不一致。
- **R3-29**：正文 25–99% 与 Table 2 最大值 98% 不一致；Figure 2 的 localhost:8080 与 App A.1 的 port 5001 不一致；Figure 3a 的 pass@n < pass@1（Opus 89<95、GPT-5.2 68<95）疑为标签错位；Figure 3 caption “both pass@1” 与 U=P×(1−R) 不符。

## 12. 批次 15 原文内部不一致与口径问题（均已在笔记标注，不作为证据使用）
- **R3-30**：标注测试样例数 p.7 写 12、p.32 写 10；App A（p.17）称人类 recall 平均 75.3%，但 §4.3（p.8）明确 75.3% 是自动 precision、人类 recall 78.8%；Table D.3 标题写 “0–4”，实际 rubric 为 0–3；摘要 68.8% 仅为 adversarial precision，standard 是 72.5%。
- **R3-31**：Figure 2 子类合计 Interaction 51/Content 49 vs §3.1 正文 47/53；§1 与 Figure 1 的 o1-preview 68% vs Table 2 Ensemble 66%；App C.3 的 prefilling 90/99 vs Table 3 的 57/78；Table 2 “+Attack” 是总体 ASR 还是 DA 拒绝子集条件 ASR 的口径有歧义。
- **R3-32**：摘要称 evaluator/value function 相对增加 15%/20%，正文 31→36 为 16.1%、31→38 为 22.6%；引言称 evaluator 带来 23% 相对降低，正文 31→25 为 19.4%。
- **R3-33**：Table 1 的 GPT-4V/MI 方差印为 0.461，与八个位置值重算的约 0.044–0.050 不符，疑为小数点错位；App B 的 4/5（80%）高于主表 70%，未解释两个口径；p.8 有一句原文缺谓语。
- **R3-34**：Reproducibility 误写 “Training-100 and Testing-100”，正文只有 Training-5；Figure 4 y 轴标 “Leak Score” 而图注为 “leak velocity”；Table 9 caption “non-thinking and non-thinking” 应为 “thinking and non-thinking”；Table 15/16 逐步 LV 与最终 D2 平均口径不一致（step 8 0.04 低于 step 7 0.07）；Table 13 D1 step 5 0.00 与最终 2.5% 口径不同。

## 13. 批次 16 原文内部不一致与口径问题（均已在笔记标注，不作为证据使用）
- **R3-35**：摘要 “up to 9%/1.9×” 与 Table 2 GPT-5 的 +15.6 pp/5.7× 不一致；“23.6%/34.8% higher” 实为百分点；Finding 2 “consistently” 被 GPT-4o 反例（HITL 23.8 vs 7.8）否定；HITL load 只统计成功任务，存在选择偏差。
- **R3-36**：正文称 AgentDojo computer-use 呈现 63% “with Llama”，但 Table 1 的 63% 在 LF(o4-mini) 行；正文 80%/67% 与 Table 2/3 不符；正文 WordPress + o4-mini 7%→50%，表为 7%→57%；Table 3 caption 写 10 tasks/5 use cases，而 §5.1 与 Table 1 写 6 tasks/3 use cases。
- **R3-37**：4,634 vs Table 4 求和 4,639；8 类只列 7 类；10 个模型 vs D.1/Fig 19 的 12 个；“three” 对抗设置却列四项；§5.4 称 GPT-4o-mini 用 Agent Task ICL 但最优是 QA Task ICL；延迟降 50% 与 Table 1 数值不符；Figure 20 caption 与正文/Table 10 矛盾；Table 1 “Cost/Task” 与正文 “per prompt” 口径冲突。
- **R3-38**：§4.3 “所有 BUA 在 Messenger/Email 仍 >50%” 与 Table 1 多处矛盾；§4.6 “BUA frequently 100% SR” 与 Table 1 只有单个 100% SR 单元格不符；§4.7 “Gemini 最易受攻击” 与 GPT-5 Email SR 更高不一致；p.8 正文 64.4% vs Figure 3 的 64.1%。
- **R3-39**：Table 1 的 Multi-turn delta 基线口径不一致；Table 2 Llama-4 native 19.0 vs Table 1 17.2；Table 8 caption 写 ASR 实为 Utility；正文 6 模型 vs 摘要 9 模型；§6.1 “four approaches” 列了 5 项且两个 “(2)”；GPT-oss “66.7→20 以下” 与 Multi-turn default 38.3 不符。

## 14. 批次 17 原文内部不一致与术语陷阱（均已在笔记标注，不作为证据使用）
- **R3-40**：“Harmful Detection Precision” 按公式实为风险样本上的召回；Figure 9 caption 写 “ratio 3:1”，x 轴却从 3:1 扫到 1:8；MetaGPT 类别准确率 0.80→0.80 未提升；RM 划分写作 1,400 测试/300 训练（疑似写反）；Safiron prompt 只要求解释文本，未要求三字段输出。
- **R3-41**：“所有模型错误率显著上升” 与 GPT-5 Err_GL 13.58 < Err_B 17.63 矛盾；“仅 Deepseek 例外” 与仅 4/13 满足双条件不符；p.7 出现未定义的 σ^B 与错配的 σ^RL；Claude 3.5 Haiku vs Claude 4 Sonnet 标签混用；摘要 74.40% 平均降幅无计算口径；RS 案例 “six other players” 与默认 N=5 不一致。
- **R3-42**：摘要/§5.2 用 “leak” 表述 LRh 数值（LR 与 LRh 不同）；Table 3 的 pL 标为 percentage 但取值为 0.2–0.6 的比例；Checklist 将 error bars 标 N/A，但 Figure 4 标注 95% CI。
- **R3-43**：Abstract 的 “formal threat model/capacity” 与实际形式化程度不符；§4 假设监控者可解密，与 Theorem 2 的 public-key stego 反例冲突；群体 26% 无 N/CI，且 overseer 不共享 Wikipedia 段落；Table 3 的 50% 与 F.1.1 的 49%、self-sampling “∼” 与 Table 31 “Yes”、能力随规模非单调；[116]/[118] 与 [129]/[130] 重复条目。
- **R3-44**：p.9 “25%–46% privacy performance” 数值实为 leakage rate（Table 4 privacy 为 0.541–0.748）；Llama-3.2 多模态 privacy 0.776 与正文“约 90%”“多模态影响很小”不符；Table 4 before/after 表示类型未说明；Table 8 整数计数与“3 次平均”口径未交代。

## 15. 批次 18 原文内部不一致与书目缺口（均已在笔记标注，不作为证据使用）
- **R3-45**：CoT 生成 prompt 给定额定标签并禁止质疑（p.28）；Table 22 的 Recall/Precision/Acc 三列与 Table 12/13 系统性错位；Table 22 的 AA F1 与全量结果逐位相同、人类却仅 50 条子样本；R-Judge 569 vs 564、人类评估者 5 vs 6；NeurIPS checklist 声称有 “theoretical proofs” 但正文无定理。
- **R3-46**：p.9 正文称 o4-mini 在 50 条人工标注中 20% 顺从注入，但 Table 4 各格 counts 加权为 12/50=24%；两个 GitHub 地址（`tml-epfl/os-harm` 与 `thomas-kuntz/os-harm`）未解释；无误差棒；C3 的 4% 仅 2 条轨迹。
- **R3-47**：81%–95% 仅对 targeted 成立（untargeted GPT-4o-mini 23.10%）；Conclusion 称 “four open-source” 实际是三个开源+一个商用；“up to 94% ASR/92% PL” 与 Table 1 的 95.58/94.69 不符；“gap 7.8%” 无法复现；Qwen3-32B targeted AMA 85.43 低于 Injection 86.00；checklist Q3/Q7 对“定理/误差棒”回答 Yes 属过度声明。
- **R3-48**：PDF 未标注会议，仅 `arXiv:2605.18991v2`；Table 1 与正文有 3 处勾选不一致（SpAIware 漏最小权限；Cursor 漏完全中介与 TCB 抗篡改；Operator 多勾人的薄弱环节）；“three gaps/five principles/three mechanisms” 无映射；“provable separation” 正文限定为 “if attainable”；Contextual Integrity 未定义即与 Least Privilege 并列。
- **R3-49**：PDF 未标注会议，仅 `arXiv:2607.18063v2`（Preprint. Revised September 2026）；provenance 表 180 为两臂合计 vs 正文 110/270→70/270；竞赛 18,422 vs 17,584 分母；defender spread 29.4/26.5/23.7 三种纳入规则；provenance 与 frontier 的 memleak 基线来自不同记录集。

## 16. 批次 19 原文内部不一致与书目状态（均已在笔记标注，不作为证据使用）
- **R3-50**：NeurIPS 2026 投稿（未接收），PDF 页脚 “Submitted to ... Do not distribute”；Table 10 Sonnet Guardian 四阶段 96+0+4+2=102，与“合计 100%”不符；Table 16 FP=27 与正文 14/50 口径不一致；Table 13/14 benign −9.0 vs −9.2；Table 1 customer 164/– 与 §F.4 airline 50 tasks 口径不一致；attack-aware 映射 Table 7/8 没有 collusion 专属条目。
- **R3-52**：PDF 为 arXiv preprint（2605.19149v1），未标注会议；轨迹总量 1,440 + 1,512 ≠ 1,920，Figure 2 的 208=16×13 对应 16 个 model-harness 组合而正文称 18 个；上报口径在摘要/§5.1/讨论间单位不一致；§5.3 称 F.3 由 TLS 证书验证失败触发，但 App F.3 trace 从 429 开始且一开始就用 `curl -k`。
- **R3-53**：正文平均 ASR 13.36%/72.63 点 vs Table 2 三值均值 11.78%/74.21 点；负向 steering collapse 正文 6.25% vs Table 3 6.20%；Table 3 Gemma before-steering collapse 3.70% 未解释；单次表与五 seed 表数值有差异；Abstract “reduces ... by 72.63%” 实为百分点。
- **R3-54**：PDF 为 FAGEN workshop @ ICML 在投稿件（未录用）；Opus “robust in both settings” 与 Table 2 的 exec user 75.7%/clarif user 58.3% 不一致；Opus “degrade under clarification” 与 Table 2/3 的 2.1→2.2/2.6、A1 -0.4、A4 -0.9 不符；“clarification consistently reduces utility” 与 Table 1 中 o3/Kimi 的 utility 上升矛盾；Opus A4 的 bootstrap CI 与 McNemar p 值冲突；Table 2/3 分母不同不能直接相减。
- **R3-55**：p.8 正文称 decisive error 在 Step 3，但 Fig.5 的 search_agent 在 Step 5 返回 Horwich，模型也报 Step 5；Table 1 caption 称 AgentDebug-7B “detects zero unsafe trajectories”，但 Coding 为 28.57/4.05，仅 Math 为 0.00；Eq. 8 用 `≥⌊V/2⌋+1`，正文 “exceeds ... =2” 在 V=3 时字面冲突。

## 17. 批次 20 原文内部不一致与书目状态（均已在笔记标注，不作为证据使用）
- **R3-56**：PDF 为 arXiv preprint（2609.08126v1），未标注会议；SCOUT 报告 accuracy=precision=83.03%、recall=100%，在标准混淆矩阵下等价于“全部判正”，且 83.03%×250 非整数、分母不明；正文 all-off 范围 21.71–31.93% 与 Fig. 4 的 23.7–34.9% 不符；正文称 pressure 单独增益 2.01–8.49 pp，但 Fig. 4 中 o1/Claude 下降；28 个工具类别 vs Table 7 的 33 个字符串；真实性 rubric 出现 14/12/11 三种口径；Qwen3-32B 同时是生成器、筛选 judge、SCOUT judge 与被评测模型；场景按“至少一个模型 scheming”保留，构成选择偏差；all-off 生成 prompt 已隐式嵌入 goal，不是中性基线。
- **R3-57**：PDF 为 arXiv preprint（2605.07630v2），未标注会议；构建流程 477+329 与 736 不能直接相加；Claude general SR 用 0.25 而非 0.14；§3.1 与 §3.6 对 protocol 是否进入模型输入表述不一致；8 个模型的相关系数样本偏小；参考敏感性只测 false-CFR 一个方向。
- **R3-58**：ACL 2024（pp.15202–15231）；Doctor 称重复到 Psy Score < P=20，但 Table 5 报告 Psy 79.66/78.56；正文称 GPT-3.5 Turbo 安全最低，但 Table 2 的 GPT-4 0613 JDR-R3 更高（58.3%/40.0% vs 45.0%/21.5%）；Table 2 攻击/数据条件未说明且 Claude2 另加 jailbreak prompt；无运行次数/种子/置信区间，单 GPT judge、单人类评估者；r=0.41 被表述为 strong correlation 偏强；MetaGPT/AutoGPT 仅 1 轮，JDR-R3 不可与 3 轮框架直接比较。
- **R3-59**：ACL 2026（pp.17917–17933）；§6.2 称 AUC 全部 >0.75，但 AGP-HumanEval 为 0.7480（仅高基线 0.0005）；摘要 0.87 与 Table 1 均值 0.8608 有 0.01 口径差；Table 1 行标签与数值在文本抽取中整体错位（已用 PNG 校正）；拓扑仅 3–7 节点小 DAG；无训练/测试划分、无查询成本、无防御评估。
- **R3-60**：ACL 2026（pp.22090–22103）；Table 1 原文写作 “Claude S4.5”，正文为 “Claude 4.5 Sonnet”；p.12 “1.2× original item price” 与 Figure 2(b) 截图（1.2× subtotal+shipping）口径不一致；SVR 把点击 Cancel/关闭也计为违规（构念效度问题，按原文定义推断）；单次运行、无置信区间，45 tasks/cell 粒度约 2.2 个百分点；无 clean/no-deception 基线；domain redirection 存在天花板效应。

## 18. 批次 21 原文内部不一致与书目状态（均已在笔记标注，不作为证据使用）
- **R3-61**：ACL 2026（pp.38315–38335）；摘要称 “without compromising successful task completion”，但唯一测得的 TSR 从 27.50% 降至 23.91%（−3.59 pp）；贡献写 “online experiments”，实际是 Mind2Web 的离线条目；成本只算输出 token，忽略注入内容带来的输入 token；GRPO 消融 12 个设置中 4 个 w/o G 更高，原文只举正例；威胁模型主体（网页注入者 vs 能观察 token 用量者）不清；VirusTotal 不是语义注入检测器；TkC/AS 与 TkCA 部分行不能互推；GPT–Domain benign 值为整数，疑舍入异常；单次运行、无置信区间、无 artifact。
- **R3-62**：AAAI-25（pp.27573–27581）；正文引用 Appendix（系统提示、12 条 jailbreak、疫苗文本、per-model Fig. 3），但 9 页 PDF 无 Appendix；Exp 2 称 6 模型、5,400 trials，Table 2 只列 5 行，5 行均值与表中 Average 不符；p.5 “14 points (76.7% to 90%)” 实为 13.3 pp；模型命名不一致；gpt-3.5-turbo 的 instruction 防御使鲁棒性低于 no defense；摘要称防御普遍降低合作，但疫苗条件合作率与 no defense 相当或更高；robustness 只测是否爆炸；两个因变量均由 GPT-4 Omni 判定，无人类标注/judge 一致性；无显著性检验。
- **R3-63**：AAAI-26（pp.35626–35634）；正文引用 Appendix（prompt 模板、超参数、RA 评分过程），但 9 页 PDF 无 Appendix，且无 Limitations/Ethics/Threat Model 节；p.7 Gemini 低敏感 PRR 59.94% vs Table 2 的 55.94%；p.7 Gemini RA(EH) 66.14% vs Table 3 的 67.14%；p.6 称 GPT-4o “instruction stream” PLR 74.42%，表中 74.42% 属 Image、Instruction 为 15.85%；p.1 “explicit hints” vs p.2 “implicit hints”；p.3 误指 Figure 2（实为 Figure 3c）；InternVL 1.5 vs 2.5；正文称 “seven smartphone agents”，实际仅 2 个 GUI Agent、5 个 backbone/VLM；全阳性集使 PRR 实质为召回率，无 FPR；GPT-4o 同时生成参考响应/标注与被评测。
- **R3-64**：AAAI-26（pp.37565–37573）；正文引用 Appendix A–F（威胁模型、评估器规则、prompt 全文、人类调查、应用清单），但 9 页 PDF 无 Appendix；p.7 “28% higher” 与 Table 2 的 6%→36%（+30 pp）不符；GPT-4o SCoT 高风险拒绝在 Fig.3/§5.2 为 31%、Table 2/3 为 36%、Table 4 为 41%；Table 3 Gemini-1.5 agentic 82% 与 Fig.3 约 53% 不同；Table 2 与 Table 4 的 6%/36% vs 7%/41% 子集口径未说明；Fig.3 题注称 baseline，但主实验默认 SCoT；Phi-4 为文本模型却与多模态 Agent 并列；无置信区间/多种子；IPI 仅 3 模型/50 静态任务。
- **R3-65**：AAAI-26（pp.35811–35819）；Table 1 的 224+548+725=1497 与全文 1,348 矛盾，且 Table 2 的 Avg 可按 224/548/725 加权复现，非纯排版笔误；摘要 10 类风险 vs 正文 11 类；P1 平均 36.7 不能由其行复算，疑为三个范式值的算术平均串位；p.7 “27.8%” 只对应 Qwen3-8b；Claude-3.7-sonnet 在 Enhanced Setting 1 异常下降未解释；§3.4 明确是 prompt-level 模拟，未测试 live MCP 传输或真实工具执行；20 “agents” 实为 20 个模型设置；无 clean baseline、utility、防御实验、模型版本/温度/重复/置信区间。

## 19. 批次 22 原文内部不一致与书目状态（均已在笔记标注，不作为证据使用）
- **R3-66**：AAAI-26（pp.35838–35846）；正文至少 8 处把 Related Work、prompts、dataset、GA 对比、经济测算与补充讨论外置到 full version（arXiv:2505.11154），本 PDF 不含该材料，故标 FULLY_READ；无任何防御；Algorithm 1 初始化池伪代码自相矛盾；正文称 Au  consistently best，但 Table 1 的 GPT-4o 行 Su 35.00 > Au 22.50，Ex 13.75 低于 1/6 基线；Table 2 的 SR 全 100.00 近乎同义反复；TPR 公式与三名标注者聚合方式未说明，Figure 5 的 LLM/人类面板参考线不同；Figure 1 把 Base LLM 画在 MCP Host 之外；基线假设竞品 identical 与 §5 的改写描述冲突；每服务器 10 条查询、单次运行、无置信区间/种子/温度/多重比较校正。
- **R3-67**：AAAI-26（pp.37970–37978）；无 Appendix、无独立 Limitations/Ethics；防御是 5 条未公开准则的 prompt 自检，无自适应攻击、无良性 utility/成本；ASR 由 GPT-4o 判官评定；Fig.3 显示 BU-MA AgentVerse 一致性 0.78→0.57、UUA 0.59→0.35，与“无显著质量退化”冲突；RQ1/RQ2 的 AgentVerse 叙述与 Fig.6/Fig.7 不符（如 test-only 0.52 > code-only 0.45）；“仅防御关键阶段≈全防御”仅 MetaGPT 成立；降幅表述为百分比但实为百分点；消融“Td 比 Ci 贡献大”在 BU-MA 不成立；Table 2 文本抽取行序错位（已用 300 dpi 校正）。
- **R3-68**：AAAI-26（pp.29784–29792）；Table 1 的 bold/underline 标注多处错误；Table 2 把 PD 定义为 τ，正文称 pairwise preference detection，且 MAB 上去掉 SE 的 ASR 87.8 低于 Full 90.2，与“去掉会提高 ASR”表述冲突；Fig.4(b) 正文称 ASR 对 ε 更敏感，但热图上 δ 变化更大；记号 A 同时表示 Agent 集合与系统，G 同时表示通信图与全局任务；无 Appendix/Limitations/Ethics；单次运行、无方差、检测器 FPR/FNR 未说明。
- **R3-69**：USENIX Security 2025（pp.3767–3786）；§7.3 称 27 个 CVE，Table 1/4 为 23 个；ground truth 35 的第 35 个来源未说明（若 LLMSmith 10 个全为 AgentFuzz 子集，并集应为 34）；69.01 CPU h 约等于 828×5 min 预算，与 Algorithm 1 找到 PoC 即 break 存在张力；100% precision 为作者人工复核、无独立标注/CI；33.25×/2.4× 是相对增量口径（总量比 34.25×/3.4×），数字本身可复现。
- **R3-70**：USENIX Security 2026（pp.1527–1546）；44 是 E2E 运行次数而非 44 个不同攻击，与摘要/§1 “distinct attacks” 措辞冲突；“3 cross-application attacks” 对应 2 个目标、3 次运行；§4.1 称三个用户任务又描述第四个 Northwind 任务；p.11 称 webhook 五次运行全部 partial，Table 2/7 为 4；Table 3 的 Qwen3-32B 与正文 Qwen3-VL-32B-Instruct 不一致；Table 9 把 LlamaGuard 2 误写成 Llama PromptGuard 2；摘要属性列表写 privacy 而非 integrity；Table 6 只选已确认 E2E 的目标且每应用 10 次；Table 5 百分比合计约 101.9%；单环境、k=5、无置信区间、无系统/密码防御评测。

## 20. 批次 23 原文内部不一致与书目状态（均已在笔记标注，不作为证据使用）
- **R3-71**：USENIX Security 2026（pp.1567–1586）；正文引用的 Appendix A.2.1、A.3、B、B.1、B.2、C 及 Theorem 1/NP-hard 证明不在 21 页 PDF 中，故标 FULLY_READ；“in the wild” 名不副实，实为 BEIR 离线语料 + Enron 合成注入，未探测真实部署；Table 3 与 Figure 2/附录正文数值冲突（平均 n=10 94.1 vs 95.6；n=3 28.4 vs 29.5；MRR 0.78 vs 0.79）；Figure 5 的 Qwen3-0.6B→OpenAI 与矩阵不符；Abstract “over 80%” vs 正文 “up to 80%”；Figure 3 正文方向写反；正文称 11 LLMs，Figure 9 有 12 行（含 Qwen3-0.6B）；检索成功 ≠ 下游执行成功（GPT-4o CEM R@5=1 但 ASR 2%）。
- **R3-72**：IEEE S&P 2026（pp.1804–1821）；威胁模型要求 renderer 内存破坏 RCE；实验固定 Chromium 130，补丁版本未测；仅 2 个开源浏览器 + 7 个扩展，闭源 Comet/Atlas/Gemini 未分析；Table 2 是二值 PoC 矩阵，无重复/置信区间；防御仅代码级 PoC，guardrail 只测单步 IPI、非自适应、未报 LLM 型号；p.12 称 BrowserOS TSR “modest 6% decrease”，Table 3 为 0.20→0.14（6 个百分点，相对 30%）；摘要称所有系统易受 “these attacks”，但 WebPilot 无 MPI、Vibe/BrowserOS 无 SLI，准确说法是每个系统至少易受一种；Table 2 的 “–” 语义未区分。
- **R3-73**：IEEE S&P 2026（pp.4497–4516）；4 个合成站点/14 个作者实现模式/32 任务，外部效度有限；3 次运行、无 CI/显著性检验；Overall 聚合权重未说明（41.1% 不是五类算术平均 43.9%）；Action Validator 无准确率/一致率；LLM 与 scaffold 混淆；视觉实验仅 3 agents；“同意”只是点击 Accept/ToS，不是可验证授权；Table 5 的 Confusion 与 Confirm Shaming ID 同为 cf；p.1 写 75%、p.3 写 76%；p.9 写 “Claude 3.7 Pro”（应为 Sonnet）；p.10 写 “higher rate than Claude and Gemini”（应为 Claude 与 GPT-4o）；正文 “8 variations” 与 Table 6 的 9 行表述不清。
- **R3-74**：IEEE S&P 2026（pp.436–455）；客户端还原依赖 JS，专家可手工逆向单页，评估以图像为中心；Part 2 约 3 min/页；§7.2 的 57.5/62.5/54.4 与 Table 4 的 65.0/71.0/60.4、Table 5 的 93.1/95.3/77.7 三套口径混用；Table 7 Text 行 Average 与行值算术平均不符；Table 8 正文称 DeepSeek-V3 有 2.9% 离群页而表中为 0；Table 11 正文称 LCP 上升 0.88 s 而表为 +4.52 s；§4/Fig.2 的 332,079 token 与 Table 14 的 257k 不一致；Table 1 把 No.1 recall 误称为 MVR；Fig.7 显示 100% 移除 Part 2 后召回反弹到 97.1%/85.0%。
- **R3-75**：ACM CCS 2025（pp.3535–3549）；摘要称 six attack categories，贡献/§5.1/结论称 seven attack types，§3 又称 six classes；Table 1 的 FPR/FNR 定义与 §5.2 用法相反；§5.2 同段先说 Tool-Use Guard 平均 DSR 最高、又说 Llama Guard 最高；§5.3 称 2.8 queries/tool use，§6 称 2.4；§5.5 称 “four representative tasks” 实际五个 case study；Table 4 的 Tool-Use Guard 平均 FNR 56.2 与四行均值 57.5 不符；Table 6 把 Claude 3.5/3.7 合并为一列；A2M 无 TLS/证书/签名/HMAC/密钥交换，审计日志未签名/未哈希链/非 Merkle，不抗篡改；单次运行、无 CI、Linux/eBPF/LSM only、无 Ethics/dual-use。

## 21. 批次 24 原文内部不一致与书目状态（均已在笔记标注，不作为证据使用）
- **R3-76**：ACM CCS 2025（pp.3975–3989）；摘要称“1–3 天内 20 个新客户”，但 §4.3.2/Fig.7 显示 1 封/天约需 20 天、3–5 封/天约一周；§3.1.1 的 Model Independence 与 Claude 0/5、o3-mini 2/5、Gemini 1.5 Pro 20 跳降至 64% 冲突；标题/摘要说 Preventing，§6 称 DonkeyRail 是 mitigation not prevention；贡献称 Gemini Advanced 演示 full RAGworm，§3.3.2 只报告 worm-carrying draft；多处 Listing 交叉引用错误；§5.2 用 G^{n−1} 而 §3.1.2 用 LLM^{n−1}；Table 1 的 Avg Hops 实为成功跳数/总跳数；§4.2.1 称不超过 rank 13，Fig.6 热图标到 15。
- **R3-77**：ACM CCS 2025（pp.2833–2847）；摘要称 ASR <10%，Llama-7B 为 14%；§6 称注入在末尾最有效，Table 3 的 middle 3.6 低于 end 6.5；Appendix 称所有时刻 0% ASR，Table 8 的 In-Response 有 0.5/1；§4.1 称 three fine-tuning-based 基线，正文列五个；§4.2 称两个 Instruct 模型 WinRate over 70%，Mistral-7B-Instruct 为 67.01；引言称 prompting/fine-tuning 防御的 optimization-based ASR consistently over 40%，但 prompting 基线只测了 optimization-free；Table 8 表头 “Hello Word” 且未标模型；Appendix 称 AdvPrompter 在 Instruct 模型更强，Mistral-7B-Instruct 上 GCG 89 > AdvPrompter 81；GCG 训练成本 p.7 说 hundreds、p.12 说 thousands。
- **R3-79**：ACM CCS 2026 full version；Table 2 的 GPT-5.1 F1 写 80.31%，按 281/129/1,695/8 重算约 80.40%；Table 13 有 0.01–0.05 pp 舍入差异；249 在 Tables 3/10/12 的口径未完全对齐；`capability` 不是形式化 capability，`Auth_p` 由 LLM judge 估计；无 artifact 完整性绑定、无独立 reference monitor；无 adaptive attacker；残余 13/95 skills、54/472 actions；单一默认 GPT-5.1 judge、无 IAA。
- **R3-81**：arXiv:2609.13873v1（无 venue）；§5.3 正文识别率与 Fig.3、Table 5 冲突且模型排序不同；Gemma3-27B 出现 0.499/0.550/0.652 三个值；Abstract 的“最多降低 58% 画像、仅约 8% 性能损失”拼接了 segmentation-only 与 task-relevance filtering 两个不同配置；p.6 自然截图 0.812/0.724 与 p.14 iOS 26 的 0.786/0.652 冲突；Prompt 禁止推断但报告 inference-based 结果；画像 prompt 给闭集属性列表；GPT-5-mini 同时是 judge 与被评测模型；主结果无 CI/显著性检验。
- **R3-82**：ACM CCS 2026；λ 默认 0.5 vs 1.0；TC 3.6K vs 2.9K；default BU 56.8 vs 59.5；MELON Qwen3 utility loss 9.8 vs 10.8 pp；`update_memory` vs `memory_overwrite`；Example 1.4 称 append-only 而 Eq.(2)/D.1 为 overwrite；7,682 用例无法由 43×14×3 推出；仅 STAC/PI2 两类攻击、≤24 轮、单 Agent、训练/评测同源、LLM-as-judge 循环、拒绝即终止。

## 22. 批次 25 原文内部不一致与书目状态（均已在笔记标注，不作为证据使用）
- **R3-83**：ACM CCS 2026；Abstract “ASR up to 0.95” 与 Table 1 RAG 0.99、Table 7 Hermes 1.00 不一致；§5.3.2 “ASR=1.0 across all k” 与 Table 1 选择性记忆最高 0.95 属不同配置；默认单轮/单条与 §5.3.2 的 N_poison=5 冲突；“most tested models” 偏乐观（Table 7 中 3/7 低于 0.90）；A-Mem Personal ACC 0.87 vs Non-Attack 0.91；超参数未给出，无实验附录；无自适应攻击。
- **R3-84**：ACM CCS 2026；§5.4/§6.4/§7.2/§10 把 Table 10、Figures 4/5/6/8 与 §10.3 委托给伴随论文 [58]（arXiv:2604.27202），本 PDF 不含，故标 FULLY_READ；Table 5 与 §6.2 的 header pages 6,444 vs 6,394、hosts 1,648 vs 1,640、body 7,500 vs 7,216；§10.2 “87% 中 70%” 实际 10,779/13,483=79.9%（70% 的分母是全部 15,387）；Table 3 子类多标签不可加总；Table 6 off-by-one（13,482 vs 13,483）；抽样非概率、header matches 自动视为 true positive、单次运行无 CI。
- **R3-85**：arXiv:2605.11229v1（无 venue）；Abstract 的 “4,174 successfully hijacked” 与 §5.1 的 “4,174 hijackable” 不等价；无 FP/FN 与人工抽样；4,174 仅对应 15 个 Action，可能高估独立漏洞；Table 3 样本小（3×3×3，单一 mutator）；p.10 “55,684” 后缺名词；p.14 Table 5 在左、Table 4 在右；p.16 Table 6 无节标题且正文未引用；p.11 对基线的表述过宽；无独立 Limitations 节。
- **R3-86**：ACM CCS 2026；Table 4 与 Table 5 对同一 27B/MCPTools 配置的 MQS 为 94.3 vs 92.6；ASR 只到 selection，未测 execution；未评估 allowlist/签名/registry；MQS 仅两个 LLM auditor，Gemini-3.1-Pro 同时是目标模型；六防御为 post-hoc，仅 CVR 有自适应攻击；基线候选池 3–20 vs 本文 59–2,578，差距可能被池规模放大；无独立 Limitations 节。
