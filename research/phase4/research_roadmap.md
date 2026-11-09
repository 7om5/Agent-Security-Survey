# 阶段四研究路线图：C1 优先，C2 条件并行

> 前提：研一密码学背景、AI 基础较弱、无组内 Agent Security 直接指导；每周可投入 20–30 小时；无 GPU，CPU/API 预算有限。
> 原则：先做**可证伪的最小实验**，不是先写完整系统；每 2 周一个 gate，失败就切换，不硬撑。

## 1. 总体安排

| 周 | C1 FV-Delegation（主线） | C2 AuthTrace（条件并行） | Gate/产出 |
|---|---|---|---|
| 1–2 | 精读 AATs/UCAN/Lineage；写 6 条性质；ProVerif 单链模型 | 只做 1-call RISC Zero gate（可选，≤3 天） | **G1**：C1 模型能跑出 trace；C2 1-call proof 时间/大小 |
| 3–4 | 加 parent_hash/audience/presenter/撤销；Tamarin 全局状态；构造攻击 | 若 G1 通过：5-call trace + delegation DAG | **G2**：C1 至少 1 个可复现攻击；C2 5-call proof <10 分钟 |
| 5–6 | 修复协议；重跑模型；Python testbed 对照实验 | 若 G2 通过：选择性披露 + 攻击集 + 对照 | **G3**：C1 攻击率 0、false block 低；C2 攻击接受 0 |
| 7–8 | 扩展链长/Agent 数；写技术报告；go/no-go | 若 G3 通过：10–20 call + 性能；否则停 | **G4**：决定硕士主课题/论文投稿方向 |

**默认只做 C1**。C2 只有在 G1（1-call proof 可接受）且 C1 在 4 周内没有致命问题时才并行；否则 C2 作为后续学期/合作方向。

## 2. C1 八周计划（主线）

### 第 1–2 周：问题与模型

**任务**：
1. 精读并固定版本：AATs draft（S6）、UCAN spec（S5）、ASOR draft（S7）、Lineage（P20）；记录每份的 scope/attenuation/revocation/chain-position 规则。
2. 写 6 条性质：authorization soundness、attenuation monotonicity、chain completeness、revocation soundness、replay/resource binding、sibling isolation。
3. 建 ProVerif 最小模型：单链 U→A0→A1，签名/哈希/nonce/scope 子集；无撤销。
4. 建 Python testbed 骨架：3 Agent + 1 Tool + 1 Verifier；Ed25519 token。

**验收（G1）**：
- 性质表（每条有形式化目标与反例条件）；
- ProVerif 模型能跑出至少 1 条合法 trace；
- testbed 能签发/验证一条 2-hop 链；
- 如果 2 周内无法表达“scope 单调 + audience 绑定”，先修模型，不进入第 3 周。

**风险触发**：ProVerif 表达不了 scope lattice → 改用 Tamarin 或有限枚举；不要硬写。

### 第 3–4 周：撤销、攻击、复现

**任务**：
1. 扩展 Tamarin：全局撤销状态、epoch、partial order；加 parent_hash/audience/presenter。
2. 攻击集：scope 放大（token exchange/audience 混淆）、链截断、尾端伪装、重放、撤销竞争、sibling 混用。
3. 每个攻击在 testbed 复现；记录攻击前提、消息序列、成功率。
4. 与 AATs/UCAN 规范对比：哪些攻击是规范已考虑、哪些是新的。

**验收（G2）**：
- 至少 1 个**非平凡、可复现**攻击；若 0 个，进入 fallback（C4）。
- 攻击轨迹/消息序列可读；
- testbed 攻击成功率 >0（naive），并有基线对比。

**风险触发**：所有攻击都依赖“AS 被攻陷” → 转 C4 或 transparency 方向；不要声称协议层攻击。

### 第 5–6 周：修复与对照实验

**任务**：
1. 选最小修复组合：父哈希 + presenter 绑定 + audience 显式 + 撤销 epoch + scope lattice。
2. 重跑 ProVerif/Tamarin；确保所有性质通过且合法 trace 可达（非空验证）。
3. 实现修复版 testbed；对照：bearer、naive signed chain、AATs 风格、修复版。
4. 攻击集 + 合法任务集；测 ASR/TSR/FBR/延迟。

**验收（G3）**：
- 修复后攻击成功率 0（或仅剩需 AS 攻陷的场景）；
- 合法任务成功率不显著下降；false block 报告；
- 验证延迟 <10ms/token（本地）。

### 第 7–8 周：扩展与决策

**任务**：
1. 扩展链长 1–5、Agent 数 3–10；测延迟/模型时间。
2. 写技术报告：问题、模型、攻击、修复、实验、限制。
3. Go/no-go：是否值得作为硕士主课题/投稿；若否，转 C4。

**验收（G4）**：
- 技术报告 + 复现脚本 + 模型文件；
- 明确“已验证/待验证/失败”的边界；
- 决定：C1 继续 → 硕士论文；C1 失败 → C4；C1 成功但想偏应用 → C2。

## 3. C2 条件并行（只在 G1 通过后）

### 第 1–2 周：1-call gate（≤3 天）

- RISC Zero/SP1 安装；Rust 验证器：1 个 Ed25519 token + 1 个 scope 子集 + 1 个 receipt hash。
- 测 proof time/size/verify time。
- **Gate**：1 call proof <60 秒、proof <10MB；否则停，不做 C2。

### 第 3–4 周：5-call trace

- 3 Agent/3 Tool/5 call；delegation DAG；trace commitment；撤销 witness。
- **Gate**：5 call proof <10 分钟；否则降级为 per-call proof + C4。

### 第 5–6 周：选择性披露 + 攻击

- 隐藏 email/文件名；攻击：加调用/删调用/换参数/重放/撤销后。
- **Gate**：攻击接受 0；false reject 可接受。

### 第 7–8 周：10–20 call + 性能

- 扩展；与 per-call/zkAgent 对比；写报告。
- 若 proof 太大/太慢，停在小规模，作为 C1 的应用附录或后续工作。

## 4. 资源与依赖

| 项 | C1 | C2 |
|---|---|---|
| 算力 | 笔记本 CPU；ProVerif/Tamarin | 笔记本/单机 CPU；RISC Zero 需要内存 |
| GPU | 不需要 | 不需要（zkVM CPU） |
| API | 不需要真实 LLM | 不需要真实 LLM（脚本工具） |
| 主要学习 | ProVerif/Tamarin、协议建模 | Rust、RISC Zero/SP1、zkVM |
| 外部合作 | 可选：协议/标准专家 | 建议：zkVM 工程合作者 |
| 主要风险 | 找不到新攻击 | 证明太慢/太大 |
| Fallback | C4 | C4/C1 |

## 5. 验收点与失败判据

| Gate | 时间 | 通过条件 | 失败动作 |
|---|---|---|---|
| G1 | 第 2 周末 | C1 模型跑通；性质表完整 | 修模型/换 Tamarin；不进入攻击阶段 |
| G2 | 第 4 周末 | ≥1 个非平凡可复现攻击 | 转 C4（链完整性）或改 C1 为“验证+证明” |
| G3 | 第 6 周末 | 修复后 ASR≈0，FBR 可接受 | 修修复方案；若仍失败，转 C4 |
| G4 | 第 8 周末 | 技术报告 + 可复现；有明确论文点 | 转 C4/C2，或调整硕士选题 |

## 6. 论文/投稿方向（初步，不保证）

- **C1**：安全协议/应用密码学 venue（NDSS、ACSAC、ESORICS、AsiaCCS；或 SoK/安全分析 track）。贡献是“标准组合的机器验证 + 攻击 + 修复”。
- **C2**：应用密码学/系统安全（CCS、USENIX Security、S&P 的 applied crypto/verifiable computation track；或 zkVM 工作坊）。贡献是“TraceAuth 定义 + zkVM 原型 + 实验”。
- **C4**：可用 C1 的附录/短文；或安全协议 venue 的短论文。
- **C5**：应用密码学 venue；但创新窗口最窄，优先级最低。

## 7. 与阶段三/四的关系

- 阶段三给的是方向分数；本路线图只使用其证据，不把 H/T/A/F 当选题理由。
- 阶段四的外部 prior art 只到摘要级；开题前必须全文精读 `external_prior_art/README.md` 列出的核心工作。
- 所有“预期结果”均为 `[待验证]`；8 周 gate 的结果可能否定推荐，这是正常的。
