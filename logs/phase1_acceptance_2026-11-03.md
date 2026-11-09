# 阶段一验收报告｜2026-11-03

## 结论
阶段一（124 篇 Agent Security 论文全文精读）**阅读与记录已完成，验收通过**，但保留 **7 篇有明确阻断原因的 `FULLY_READ` 例外**，未冒充 `QUALITY_CHECKED`。本报告不进入阶段二，不做热度排名、密码学评分或选题推荐。

## 1. 语料与映射
- 工作集：124 篇（R1=15、R2=25、R3=84）。
- 124 个 ID 与 `papers/` 中 PDF 一对一映射；无缺失。
- 永久排除项检查：`notes/`、`registry/papers.jsonl`、`registry/paper_status.csv` 中 **0 次**出现 R3-51、R3-78、XX-01—XX-04。
- 未重新检索、未重新书目核验、未新增语料。

## 2. 笔记与结构化记录
- `notes/`：**124** 份非空笔记。
- 全部 124 份笔记运行 `node scripts/check_note.js <id>`：**0 失败**；均含 14 个二级章节、`深读覆盖`、证据表头 `| 事实/判断 |`、≥8 行证据、无 TODO/TBD/待补充、>3000 bytes。
- `registry/papers.jsonl`：**124** 条唯一记录，无缺失 ID。
- `registry/reading_queue.csv`：25 批、124 行，全部 `completed`。

## 3. 状态统计
| 状态 | 数量 |
|---|---:|
| QUALITY_CHECKED | 117 |
| FULLY_READ | 7 |
| NOT_STARTED | 0 |
| 合计 | 124 |

## 4. 页数互斥核算
- `total_pages` = 2,945。
- `deep_read_pages` = **2,599**。
- `browsed_pages` = **346**（已完成论文中的纯参考文献/封面等）。
- `uncovered_pages` = **0**。
- `not_started_pages` = **0**。
- 恒等式：**2,599 + 346 + 0 + 0 = 2,945**；`node scripts/audit_coverage.js` 返回 `AUDIT OK`。
- 深读覆盖率：**2,599 / 2,945 = 88.25%**；其余 11.75% 为已读论文的纯参考文献页。

## 5. 7 篇 FULLY_READ 例外（阻断原因）
| ID | 阻断原因 |
|---|---|
| R2-25 | 正文引用的 Appendix A.1/C/D/E–G/H/I 与 Table 16 不在 9 页 PDF 中 |
| R3-62 | 正文引用的 Appendix（系统提示、12 条 jailbreak、疫苗文本、按模型 Fig. 3）不在 9 页 AAAI PDF 中 |
| R3-63 | 正文引用的 Appendix（prompt 模板、超参数、RA 评分过程）不在 9 页 AAAI PDF 中 |
| R3-64 | 正文引用的 Appendix A–F（威胁模型、评估器规则、prompt、应用清单）不在 9 页 AAAI PDF 中 |
| R3-66 | 正文至少 8 处把 Related Work、prompt、dataset、GA 对比与补充讨论外置到未纳入语料的 full arXiv version |
| R3-71 | 正文引用的 Appendix A.2.1/A.3/B/C 与定理证明不在 21 页 PDF 中 |
| R3-84 | §5.4/§6.4/§7.2/§10 把 Table 10、Figures 4/5/6/8 与 §10.3 委托给未纳入语料的伴随论文 [58]（arXiv:2604.27202） |

## 6. 密码学交叉观察
- `research/crypto_intersection_observations.md`：**42** 条（C1–C42）。
- 每条含论文 ID、问题描述、原文页码证据、推断依据、置信度、尚待验证问题。
- 严格区分形式化密码机制、现有密码技术的工程应用、纯语义/系统方法；未把未验证缺口写成已确认创新点。

## 7. 原文内部不一致
- `logs/ambiguities.md` 共 22 节，覆盖各批次发现的数值/表列/书目不一致；矛盾数字均未作为证据使用。
- 未发现未解决的硬阻断；7 篇 `FULLY_READ` 均为语料/PDF 完整性缺口，已记录而非隐瞒。

## 8. 已知书目缺口
- R3-80：PDF 未标注 venue/year，registry 保持 null。
- R3-52、R3-56、R3-57、R3-81、R3-85：未标注 venue 的 arXiv preprint，venue 为空、year 2026。
- R3-50：NeurIPS 2026 投稿（非接收）；R3-54：ICML Workshop 在投。

## 9. 阶段边界
- 本报告只完成阶段一验收；**未开始阶段二**。
- 未做全语料热度排名、最终密码学相关度评分、Taxonomy 修订或硕士选题推荐。
- 进入阶段二前，应先确认 7 篇 `FULLY_READ` 例外是否可接受，或是否需要寻找完整版 PDF（当前语料冻结，未外部检索）。
