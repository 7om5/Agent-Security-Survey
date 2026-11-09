# 阶段三勘误报告｜2026-11-06

> 范围：按用户 2026-11-06 指令，对阶段三做六项定点修正，并重新运行一致性审计。
> 结论：**六项全部完成；未发现需要推翻阶段三主要结论的阻断性错误；阶段三标记为“修正完成”，据此启动阶段四。**
> 语料仍为 124 篇；永久排除 R3-51、R3-78、XX-01–XX-04，未进入任何统计。

## 0. 审计摘要

| 检查 | 结果 |
|---|---|
| `node scripts/audit_phase3.js` | **AUDIT OK**：124 证据行、124 书目行、31 叶、9 主类；H 公式 40/40 行复算；F 四子项 31/31 行求和；T/A 40/40 行按证据重算；年份矩阵 40 行；证据引用 124/124 含 PDF 页码与笔记章节 |
| `node scripts/audit_taxonomy.js` | **AUDIT OK**：124 篇主类、31 叶非空、计数和 124、置信度 high 94 / medium 30 |
| `node work/phase3/check_markdown_consistency.js` | **MARKDOWN CONSISTENCY OK**：13 项关键 Markdown 值（A2、D3、A 分布、A1 ceiling、F 子项、敏感性）与 CSV/修正一致 |
| 排除项 | R3-51、R3-78、XX-01–XX-04 在证据/书目中 0 次出现 |
| 主要结论是否改变 | B1 唯一 T/A 广度 3、B4 单篇 ceiling 4、仅 3 篇 T/A≥3、无 T=5/A=5、F 排行均不变；A1 的 A_ceiling 由 2 降为 1；H 的“D2 恒第 1”“A2 稳定第一梯队”被弱化为条件性结论 |

## 1. 修正 1：H 分项统计

### 1.1 原情况

- `research_activity.md` §3 的 A2 行显示 `V/M/B = 4/5/3`，但 A2 有 **8 篇正式主会 published**，按 Rubric `H_volume` 应为 **5**；`0.30×5+0.45×5+0.25×3 = 4.5`，与表中的 H=4.5 一致。说明是**展示文本错误**，不是 H 总分计算错误。
- `direction_scores_full.csv` 的旧表头只输出 H 总分，未输出 `H_volume/H_momentum/H_breadth`；JSON 中有这三个字段，但 CSV 不可直接复算。
- 其余 30 个叶子的 V/M/B 与 H 是否一致、9 个一级方向是否按规则汇总，此前未做程序化逐行检查。

### 1.2 修正方法

1. 将 A2 的 V/M/B 由 `4/5/3` 改为 **`5/5/3`**；H 仍为 4.5。
2. 在 `direction_scores_full.csv` 表头加入 `H_volume,H_momentum,H_breadth`，使 31 叶 + 9 主类均可直接从 CSV 复算。
3. 在 `scripts/audit_phase3.js` 中新增：
   - 每行 `H = round(0.30V+0.45M+0.25B, 1)`；
   - 从 `paper_metadata.json` 重新统计每行 `n_pub_main/y2024/y2025/y2026`，并重算 V/M/B；
   - 校验一级方向的论文集合等于其叶子并集、`n_total` 等于叶子 n 之和；
   - 明确一级 H **按一级方向全部论文直接计数**，不是叶 H 平均；审计按前者检查。
4. 全量 40 行复算结果：**只有 A2 的展示文本有误；其余 39 行的 V/M/B 与 H 一致**。9 个一级方向的 H 均按直接计数规则计算（A–E、G–I 为 5.0，F 为 4.5）。

### 1.3 修改文件

- `research/phase3/research_activity.md`（A2 行、§2 汇总结论、§7 边界说明）
- `work/phase3/add_f.js`（CSV 表头加入 V/M/B）
- `research/phase3/direction_scores_full.csv`（重新生成）
- `scripts/audit_phase3.js`（新增 H 复算）

### 1.4 修正前后

| 项 | 修正前 | 修正后 |
|---|---|---|
| A2 `V/M/B`（Markdown） | 4/5/3 | **5/5/3** |
| A2 H | 4.5 | 4.5（不变） |
| `direction_scores_full.csv` H 分项 | 未输出 | 输出 V/M/B |
| 其他 30 叶 V/M/B/H 不一致 | 未验证 | 0 处 |
| 9 个一级 H | 5.0×8、F 4.5 | 不变；已注明汇总规则 |

### 1.5 影响

- 不改变任何 H 总分或排行；只修正展示与可复算性。
- 明确了一级 H 的口径，避免把“F 一级 H=4.5”误读为叶 H 平均（叶平均会低得多）。

## 2. 修正 2：D3 趋势年份归属

### 2.1 原情况

`research_activity.md` §4 的 D3 句为：

> 2025 年 5 篇（R1-10、R1-14、R2-12、R2-16、R3-19），2026 年 2 篇（R3-04、R3-77）。

按 `paper_metadata.csv`：

| 论文 | 年份 | 类型/状态 |
|---|---|---|
| R1-10 | 2025 | USENIX Security, main published |
| R1-14 | **2026** | NDSS, main published |
| R2-12 | 2025 | ACL, main published |
| R2-16 | 2025 | NeurIPS, main published |
| R3-04 | **2025** | ICML, main published |
| R3-19 | **2026** | ICML, main published |
| R3-77 | **2025** | ACM CCS, main published |

因此原句把 R1-14、R3-19 错放 2025，把 R3-04、R3-77 错放 2026；**年度总数 5/2 本身是对的，但 ID 分组错误**。

同时发现同节其他 ID 列表也有“把非主会/其他年份论文混入年度主会列表”的问题：

- D2 原句列了 11 个 ID（含 2025 的 R2-10、R2-15 和 workshop 的 R3-54），却说“2026 有 8 篇”；
- C1 原句列了 5 个 2026 ID，其中 R3-81 是 preprint，不是正式主会；
- E2 原句把 R3-47（2025）列入 2026；
- A3 第 7 条含一段未清理的括号草稿（“R3-55（2026? A3 has … wait …）”）。

### 2.2 修正方法

1. 新增 `work/phase3/build_year_matrix.js`，从 `paper_metadata.csv` 程序生成 `direction_year_matrix.csv`：31 叶 + 9 主类的 2024/2025/2026 正式主会 ID、数量，以及非主会 ID。
2. 用该矩阵逐条重写 §4 的 8 条趋势叙述；所有年度结论都给出精确 ID。
3. 对非主会论文（preprint/workshop/submitted/accepted）单独标注，不混入年度主会计数。
4. 删除“研究下降/防御滞后”的因果措辞；明确 2026 窗口不完整。
5. `scripts/audit_phase3.js` 新增年份矩阵 40 行的一致性检查（数量与 ID 均比对 metadata）。

### 2.3 修正后的关键年份

| 方向 | 2024 | 2025 | 2026（正式主会） | 非主会 |
|---|---|---|---|---|
| D2 | — | R2-10、R2-15 | R1-13、R3-16、R3-27、R3-38、R3-39、R3-70、R3-71、R3-84 | R3-54（workshop submitted） |
| D3 | — | R1-10、R2-12、R2-16、R3-04、R3-77 | R1-14、R3-19 | — |
| C1 | R1-04、R3-42 | R3-44 | R3-07、R3-08、R3-09、R3-63 | R3-81（preprint） |
| E2 | — | R3-47 | R1-11、R1-12、R3-66、R3-86 | — |
| A3 | — | R2-13、R3-69 | — | R3-55（workshop published） |
| B1 | — | R2-07 | R1-03 | — |
| B4 | — | R3-75 | R3-02 | R3-80（unknown/preprint） |
| G3 | R3-43 | — | R2-22、R3-68 | — |
| E3 | — | — | R1-08、R3-23 | — |

### 2.4 修改文件

- `research/phase3/research_activity.md`（§4 全部重写；§6 小样本与敏感性表述更新）
- `research/phase3/direction_year_matrix.csv`（新增）
- `work/phase3/build_year_matrix.js`（新增）
- `scripts/audit_phase3.js`（新增年份矩阵检查）

### 2.5 影响

- 年度**计数**未变（D3 仍 5/2，D2 仍 0/2/8，C1 仍 2/1/4 等）；变的是 ID 归属与叙述准确性。
- 不改变 H 分数或排行。
- 旧句“D3 2025 高峰后回落”保留为描述性事实，但明确不能据此推断领域衰退或防御滞后。

## 3. 修正 3：R1-01 的应用密码学评分

### 3.1 原情况

R1-01 `SoK: Attack and Defense Landscape of Agentic AI Systems`：

- `uses_crypto = none`
- `A_paper = 2`
- 证据引用：笔记 §10/§11（pp.13–15）
- 原文事实：正文 pp.13–15 把 OAuth 2.0/OIDC、TEE、ETDI 签名工具定义列为 IAM/工具加固的**现成机制清单**；全文没有构造、实现、评估或形式化证明（笔记 §10–§11；PDF pp.2–15、p.21 Appendix A）。

按 Rubric v1 的 A=2 字面“现有凭证/加密/认证作为配套——用了 OAuth/TLS/签名等”，R1-01 没有“用”，只是“论及”，因此 A=2 不成立。

### 3.2 修正方法（最小 Rubric 澄清）

不改变 A 的整体 0–5 锚点，只把 A=1/A=2 的边界写清：

- **A=1**：一般安全功能；**或仅在综述/背景中列举密码机制，未实际使用、实现或评估**。
- **A=2**：论文**实际使用**现有凭证/加密/认证作为系统组件（即使不是核心贡献）。
- **A≥3**：密码机制成为明确工程切入点（凭证、令牌、密钥、审计、加密共享）。

据此：

- R1-01 由 **A=2 → A=1**；
- R3-43 保留 A=2（隐写构造/监控者密钥讨论属实际讨论密码构造，虽无系统实现）；
- 其他论文不受影响（没有第二篇“纯综述 + 仅论及”的 A=2）。

### 3.3 修改文件

- `work/phase3/evidence_batch1.jsonl`（R1-01 `A_paper=1`，note 更新）
- `research/phase3/paper_crypto_evidence.csv/.json`（重新生成）
- `research/phase3/direction_scores.csv/.json`、`direction_scores_full.csv/.json`（重新聚合）
- `research/phase3/applied_crypto_ranking.md`（分布、A1 行、A_ceiling 排行、负面证据、结论）
- `research/phase3/phase3_report.md`（A 分布、一级 A_ceiling、§6.3）
- `research/phase3/research_activity.md`（一级 A 表）
- `research/phase3/scoring_rubric.md`（A=1/A=2 最小澄清）
- `scripts/audit_phase3.js`（回归检查 R1-01 A=1、A1 A_ceiling=1）

### 3.4 修正前后

| 项 | 修正前 | 修正后 |
|---|---|---|
| R1-01 `A_paper` | 2 | **1** |
| A 分布（0/1/2/3/4/5） | 91/28/2/2/1/0 | **91/29/1/2/1/0** |
| A1 `A_dir` | 1 | 1（不变） |
| A1 `A_ceiling` | 2 | **1** |
| 一级 A `A_ceiling` | 2 | **1** |
| 应用密码学 A_ceiling 排行 | B4 4；B1 3；A1/G3 2 | **B4 4；B1 3；G3 2；A1 1** |
| T/A≥3 的 3 篇 | R3-80/R1-03/R2-07 | 不变 |

### 3.5 影响

- 只影响 A1 的 ceiling 与应用密码学排行的第 3 名之后；**不改变 B1/B4 的核心结论，不改变 T 排行，不改变 F 排行**。
- 不影响 H / 30 篇 medium 敏感性：R1-01 不在 H 的 key directions，也不在 C1–C5 的密码学证据链中；A1 的 A_dir 仍为 1。
- 这是“评分定义澄清”而非“为了改分而改标准”；澄清已写入 Rubric，后续可复现。

## 4. 修正 4：F_master 的可复算性

### 4.1 原情况

- `direction_scores_full.csv` 中 9 个一级方向的 `F_master` 为 **0**，与“0 分 = 不适合”混淆；实际上它们从未被评价。
- 31 个二级方向只有 F 总分与一段 rationale，没有四个子项，无法验证总分如何得出。

### 4.2 修正方法

1. 一级方向 `F_master` 改为 **空值/null**；JSON 为 `null`，CSV 为空字符串；并注明“F 只在二级方向评分，一级不聚合”。
2. 为 31 个二级方向补四个子项：
   - `F_crypto_leverage` 0–2；
   - `F_low_ai_compute` 0–1；
   - `F_open_experiment` 0–1；
   - `F_definability` 0–1。
3. 每行满足四项之和 = `F_master`；`add_f.js` 在生成时即抛错校验，`audit_phase3.js` 再逐行复算。
4. 为每个方向补 `F_rationale`、`F_limitations`、`F_evidence_source` 三列；Markdown 排行表给出摘要，CSV 保存全文。
5. 拆解后**没有发现原 F 无法成立**：31 个方向的 F 总分全部保持不变；只是把判断拆成可审计的子项。
6. 明确 F≠新颖性：F=5 只表示“较容易构建可验证工作”，不证明有可发表创新点；B4 的 F=4 中 `F_low_ai_compute=0`，说明 zk 证明并不便宜。

### 4.3 修改文件

- `work/phase3/add_f.js`（F 映射改为 8 元组；加入求和校验；一级 null）
- `research/phase3/direction_scores_full.csv/.json`（重新生成，新增 7 列）
- `research/phase3/master_feasibility_ranking.md`（31 行子项表、B4 说明、F≠新颖性）
- `scripts/audit_phase3.js`（F 子项范围与求和检查）
- `research/phase3/scoring_rubric.md`（§5.0 子项定义）

### 4.4 修正前后

| 项 | 修正前 | 修正后 |
|---|---|---|
| 一级 F_master | 0（易误读为评分） | **null/空** |
| 31 叶子项 | 无 | 每行 4 项，31/31 求和通过 |
| F 总分 | B1=5；7 个=4；… | **不变** |
| B4 低算力项 | 未表达 | **0**（zk 证明 CPU/内存高） |
| 评分依据/限制/证据 | 仅一段 rationale | 每方向三列 + Markdown 摘要 |

### 4.5 影响

- 不改变 F 排行；提高可复算性与解释力。
- 明确“F=5 ≠ 创新性”，防止阶段四直接用 F 选方向。

## 5. 修正 5：敏感性分析的覆盖与表述

### 5.1 原情况

`sensitivity_analysis.md` §3 只对 7 个关键边界做替代主类重算，但结论写成“若把所有 30 篇 medium 都按替代主类重算，H 的精确小数会变，但第一梯队与低样本方向不会重排”。该表述**超出了实际验证范围**：没有测试全部 30 篇，也没有测试联合变化。

### 5.2 修正方法（选择方案 A）

1. 对全部 **30/30** 篇 `confidence=medium` 论文，从 `registry/paper_topics_v1_1.json` 的 `boundary_note` 与 `secondary_categories` 提取有依据的替代类（首选替代在前），共 **68 个单项情景**。
2. 增加 **1 个联合边界情景**：30 篇同时迁到各自首选替代类。
3. 增加 **10,000 次随机模拟**：每篇 50% 保持原类，否则在替代类中均匀抽取。
4. 输出 `sensitivity_full.json`（完整情景与随机分布）与 `sensitivity_rank_stability.csv`（每方向 H 区间、排名众数、top-tier/第 1 概率）。
5. 重写 `sensitivity_analysis.md` §3 与 §6，明确“不是 2^30 穷举”，并把旧结论改为条件性表述。

### 5.3 主要结果

| 结论 | 修正前 | 修正后 |
|---|---|---|
| T/A 排行 | “7 个情景不变” | **68 个单项 + 联合边界均不变**；B1 恒 3/3/3/3，B4 恒 0/1/4/4 |
| D2 H 第 1 | “三种口径均 5.0” | 68 个单项中保持第 1 或第 2；随机 63% 第 1；**联合边界下 H1 第 1、D2 第 2** |
| A2 第一梯队 | “仍在第一梯队” | **P(H≥4.5)=0.55**，是边界成员；E2 0.53、G4 0.50 |
| C1/H1/I1 | “第一梯队” | P=1.00/0.97/0.86，较稳 |
| “全部 30 篇变化不影响结论” | 曾如此表述 | **删除**；改为“T/A 不变，H 排名会变，A2/E2/G4 约一半情景掉出第一梯队” |

### 5.4 修改文件

- `work/phase3/sensitivity_full.js`（新增）
- `research/phase3/sensitivity_full.json`（新增）
- `research/phase3/sensitivity_rank_stability.csv`（新增）
- `research/phase3/sensitivity_analysis.md`（§3 全量重写；§6 结论表更新）
- `research/phase3/research_activity.md`（§6 敏感性表述）
- `research/phase3/phase3_report.md`（§8 敏感性表述）
- `scripts/audit_phase3.js`（检查覆盖 30 篇/10,000 次/非穷举声明）

### 5.5 影响

- **削弱**了“D2 恒为第 1”“A2 稳定第一梯队”的强表述；这是必要的严谨性修正。
- **不改变**密码学 T/A 排行与 B1/B4 结论。
- 敏感性结论现在是“区间/概率”，不再声称覆盖所有组合。

## 6. 修正 6：密码学证据的准确页码

### 6.1 原情况

`paper_crypto_evidence.csv` 中 R3-01、R3-22、R3-24 的 `evidence_ref` 只有 `§10–§11`，没有 PDF 物理页码、图表/公式编号或核查范围。全表扫描发现：**只有这 3 行缺少 PDF 页码**；其余 121 行均含 `p./pp.` 与 `§`。

### 6.2 修正方法

依据三篇论文的研究笔记 §10–§11、§13 证据索引与 PDF 物理页码，补充：

| 论文 | 修正后的证据引用（摘要） |
|---|---|
| R3-01 | 笔记 §10（PDF pp.2–15，§1–§7；pp.19–21 Appendix A,C–P）：全文无签名/MAC/加密/ZK/定理；§11（p.5 §3 威胁模型；pp.6–8 §4 Eq.(1)–(7)；pp.9–14 §5–§6 Tables 1–7） |
| R3-22 | 笔记 §10（PDF pp.1–9，§1–§5；pp.11–27 Appendix A–N）：无加密/签名/MAC/承诺/ZK/MPC/FHE/TEE/定理；Eq.3–4 p.4 为优化目标非安全定义；§11（p.6 Table 1；p.7 Table 2；p.8 Table 3） |
| R3-24 | 笔记 §10（PDF pp.1–10，§1–§6；pp.14–20 Appendix A–F）：无密码原语/形式化定义/定理；§11（p.5 Eq.10–12 余弦阈值；pp.5–6 Eq.14–15 激活修正；p.6 Table 1；p.7 Table 2） |

对“没有密码学构造或证明”的判断，均写明**核查范围**（正文 + 相关附录）与**核查方法**（逐节全文核对，非只读摘要）；没有把未检查的附录标为已验证。

### 6.3 修改文件

- `work/phase3/evidence_batch1.jsonl`（R1-01，见修正 3）
- `work/phase3/evidence_batch2.jsonl`（R3-01/R3-22/R3-24）
- `work/phase3/apply_errata.js`（新增，记录三处替换）
- `research/phase3/paper_crypto_evidence.csv/.json`（重新生成）
- `scripts/audit_phase3.js`（124/124 必须含 `pp?.` 与 `§`；三篇回归检查含 `PDF p`）

### 6.4 修正前后

| 项 | 修正前 | 修正后 |
|---|---|---|
| 含 PDF 页码的证据行 | 121/124 | **124/124** |
| R3-01/R3-22/R3-24 | `§10–§11` | 笔记章节 + PDF 物理页 + 公式/表号 + 核查范围 |
| 虚构页码 | — | 0；所有页码来自已有笔记与 PDF 核对 |

### 6.5 影响

- 不改变任何 T/A 分数；只提高可追溯性。
- 三篇均为 T/A≤1 的非密码学论文，页码补充不影响密码学排行。

### 6.6 附加发现：T_ceiling/A_ceiling 列表完整性（非六项之一）

审计时发现 `phase3_report.md`、`theoretical_crypto_ranking.md`、`applied_crypto_ranking.md` 的“T_ceiling/A_ceiling 排行”文字列表漏列了部分 **1 分叶**（例如 A3、C1、C4、D2、D3、D4、E2、G4、H1 等），并写成“其余 0”。这是**展示不完整**，不是分数错误；CSV 中的 31 叶分数一直正确。

已按 `direction_scores_full.csv` 补全：
- `T_ceiling=1` 的 19 个叶：A1、A3、B2、B3、C1、C4、D1、D2、D3、D4、E1、E2、E3、G1、G2、G3、G4、H1、H3；
- `A_ceiling=1` 的 16 个叶：A1、A3、B2、B3、C1、C4、D2、D3、D4、E1、E2、E3、G1、G2、G4、H1；
- 未列出的叶为 0；B4/B1/G3 的高分不变。
- 不影响 T/A 排行、B1/B4 结论或 F。

## 7. 对阶段三主要结论的影响

| 原结论 | 是否改变 | 说明 |
|---|---|---|
| 124 篇中只有 R3-80（4/4）、R1-03（3/3）、R2-07（3/3）达到 T/A≥3 | **否** | 证据矩阵与方向聚合均未改变这三篇 |
| B1 是唯一 T_dir=A_dir=3 的方向 | **否** | 68/68 敏感性情景稳定 |
| B4 是 T/A ceiling 最高的单篇 spike（T_dir=0/A_dir=1） | **否** | R3-80 仍 4/4；R3-02/R3-75 仍 0–1 |
| 无 T=5、无 A=5 | **否** | 分布未变 |
| F：B1=5；B2/B3/B4/E1/E3/G1/G3=4；H1/H2/H3/F2=1 | **否** | 四子项拆解后总分不变 |
| A1 有 A=2 的 SoK 接口 | **是** | A1 A_ceiling 2→1；R1-01 A=1 |
| D2 是样本内最活跃方向 | **弱化** | 多数情景第 1，但联合边界下 H1 第 1 |
| A2/C1/H1/I1 稳定第一梯队 | **部分弱化** | C1/H1/I1 较稳；A2 仅 0.55，E2/G4 约 0.50 |
| 阶段三 T/A 排行不受 medium 分类影响 | **是（加强）** | 从 7 个情景扩展到 30 篇/68 单点/联合边界，T/A 仍不变 |

## 8. 尚未解决的限制

1. **敏感性不是 2^30 穷举**：68 个单项 + 1 个联合边界 + 10,000 次随机，覆盖全部 30 篇的有依据替代类，但不能证明“所有组合”都不改变排名。
2. **替代类本身是判断**：来自 registry 的 boundary_note 与 secondary，不是外部 ground truth；若某篇的替代类选择本身错误，敏感性会低估/高估。
3. **H 仍是样本内代理**：124 篇定向样本，不是全领域全集；2026 窗口不完整。
4. **metadata 置信度**：2026 主会论文多为 medium，未联网核验 proceedings；R3-80 venue/year 仍 unknown。
5. **F 子项是 evaluator 判断**：审计只能验证“四项之和 = F”，不能验证子项赋值本身是否最优；已在 `F_limitations` 中公开主要不确定性。
6. **7 篇 FULLY_READ**：R2-25、R3-62、R3-63、R3-64、R3-66、R3-71、R3-84；其 T/A 均为 0，不影响密码学排行，但影响部分 H 小数与证据完整度。
7. **趋势叙述的“研究类型演化”**：年度 ID 已程序核对；研究类型分类仍是笔记判断，未做第二人复核。
8. **未做外部 prior art**：阶段三不联网核查全领域；阶段四才对候选问题做范围明确的外部现有工作检查。

## 9. 复现命令

```bash
node work/phase3/build_metadata.js
node work/phase3/apply_errata.js
node work/phase3/merge_evidence.js
node work/phase3/aggregate_scores.js
node work/phase3/add_f.js
node work/phase3/build_year_matrix.js
node work/phase3/sensitivity_full.js
node work/phase3/check_markdown_consistency.js
node scripts/audit_phase3.js
node scripts/audit_taxonomy.js
```

预期末行：`AUDIT OK`（两个脚本均如此）。

## 10. 阶段状态

- 六项修正：**全部完成**。
- 阻断性数据矛盾：**未发现**。
- 阶段三：**修正完成（2026-11-06）**，可以进入阶段四。
- 阶段四：按用户指令已启动；阶段三报告中的“不进入阶段四”是历史边界，现由本勘误报告和 `research/phase4/` 取代。
