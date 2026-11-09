# Taxonomy 计数与版本基线修正｜2026-11-03

> 目的：回应用户指出的“13 项边界澄清 / 13 篇 v1.0→v1.1 分类差异 / 7 篇 Phase 1→v1.1 迁移”口径问题。
> **不改变已验收的 124 篇主分类**；仅修正文档表述。

## 1. 三个不同的“13/7”，不要混用

| 口径 | 数量 | 含义 |
|---|---:|---|
| 二级方向重命名/边界澄清 | **13 项** | A2、B2、B4、C4、D4、E2、F2、G2、H1、H2、H3、I1、I3 的名称/边界调整；不改变论文主类 |
| v1.0 原始 → v1.1 主类差异 | **13 篇** | 以 `papers.jsonl` 的 `original_category` 为基线，与 v1.1 主类不同 |
| Phase 1 reviewed → v1.1 主类迁移 | **7 篇** | 以 `papers.jsonl` 的 `reviewed_category` 为基线，与 v1.1 主类不同 |

三者不是同一集合：13 项是方向名称/边界；13 篇是论文主类；7 篇是 Phase 2 新增迁移。

## 2. v1.0 原始 → v1.1：13 篇

| ID | v1.0 | v1.1 | Phase 1 reviewed | 说明 |
|---|---|---|---|---|
| R3-09 | C3 | C1 | C1 | Phase 1 已迁移；v1.0→v1.1 仍差 |
| R3-36 | G3 | D4 | D4 | Phase 1 已迁移 |
| R3-37 | D4 | H1 | H1 | Phase 1 已迁移 |
| R3-45 | A3 | A2 | A2 | Phase 1 已迁移 |
| R3-52 | H1 | A2 | A2 | Phase 1 已迁移 |
| R3-53 | H3 | H1 | H1 | Phase 1 已迁移 |
| R3-56 | H1 | A2 | A2 | Phase 1 已迁移 |
| R2-09 | A2 | I1 | A2 | Phase 2 新增迁移 |
| R2-10 | A2 | D2 | A2 | Phase 2 新增迁移 |
| R3-27 | A2 | D2 | A2 | Phase 2 新增迁移 |
| R3-57 | H3 | I1 | A2 | Phase 1 从 H3→A2；Phase 2 从 A2→I1；v1.0→v1.1 为 H3→I1 |
| R3-75 | B3 | B4 | B3 | Phase 2 新增迁移 |
| R3-85 | D2 | D4 | D2 | Phase 2 新增迁移 |

**合计 13 篇**：7 篇 Phase 1 已迁移（R3-09、R3-36、R3-37、R3-45、R3-52、R3-53、R3-56）+ 6 篇 Phase 2 从原始类直接迁移（R2-09、R2-10、R3-27、R3-57、R3-75、R3-85）。

> R3-59 不在此表：其 v1.0 原始类为 C4，Phase 1 reviewed 为 G2，Phase 2 回到 C4；v1.0→v1.1 没有差异，但 Phase1→v1.1 有迁移。

## 3. Phase 1 reviewed → v1.1：7 篇

| ID | Phase 1 reviewed | v1.1 | v1.0 原始 | 变更理由摘要 |
|---|---|---|---|---|
| R2-09 | A2 | I1 | A2 | 特定 WebArena 环境 benchmark |
| R2-10 | A2 | D2 | A2 | HTML 属性注入攻击 |
| R3-27 | A2 | D2 | A2 | search 工具/检索注入 benchmark |
| R3-57 | A2 | I1 | H3 | 手机 GUI/CUA 安全评测 |
| R3-59 | G2 | C4 | C4 | 黑盒拓扑推断，内部信息提取（回到原始 C4） |
| R3-75 | B3 | B4 | B3 | OS 级运行时策略审计/强制 |
| R3-85 | D2 | D4 | D2 | 多步 workflow 控制流劫持 |

**合计 7 篇**；其中 R3-59 是“回到原始类”，不是 v1.0→v1.1 新增差异。

## 4. 13 项二级方向重命名/边界澄清

A2、B2、B4、C4、D4、E2、F2、G2、H1、H2、H3、I1、I3。

- 这些是**方向名称/边界**调整，不改变论文主类计数；详见 `taxonomy/taxonomy_change_log.md` §3。
- 与 13 篇论文差异是不同维度：一个是“方向定义”，一个是“论文归属”。

## 5. 对阶段三统计的影响

- 阶段三使用 `registry/paper_topics_v1_1.json` 的 `v1_1_primary`，即已验收的 124 篇主分类；本修正**不改变任何论文主类**。
- H/T/A/F 的所有计算均不受本文件影响。
- 阶段二报告中的“7 篇迁移”“13 项重命名”表述保留；本文件补充“v1.0→v1.1 13 篇”口径，避免读者把三个数字混用。

## 6. 版本基线

- `taxonomy/taxonomy_v1_0_original.md`：原始 v1.0，只读保留。
- `registry/papers.jsonl`：Phase 1 的 `original_category` 与 `reviewed_category` 均保留，不覆盖。
- `registry/paper_topics_v1_1.json`：v1.1 最终主类，阶段三唯一统计基线。
- `taxonomy/taxonomy_v1_1_reviewed.md`：已验收的 v1.1 分类树。
