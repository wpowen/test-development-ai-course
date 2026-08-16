# AI Agent 测试架构 v2.0：课程吸收与重建审议

## 0. 结论与证据边界

**来源**：`/Users/owen/Downloads/AI agent测试架构.txt`，639 行，版本标注为 v2.0，定位为生产级 AI Agent（含金融/交易场景）。本文件只做 course lane 的来源审议，不把来源中的数字、案例或法规表述自动升级为通用事实。

**Evidence**

- 当前教程树包含 Agent/Workflow、LLM-as-judge、轨迹、工具权限、注入、Memory、路由、CI、Lineage、Canary、Benchmark、Agent 压测等页面；这些是“现有页面主题覆盖”的证据，不是本来源已完整吸收的证据。
- 当前页面顺序为 1–85，Agent 主题主要位于第 52–69 页，Agent 性能主题位于第 78–85 页。
- 当前页面已有 `pass@k`、Judge 校准、轨迹分层、工具策略、Handoff、成本、Trace、Canary 等局部内容，但尚未形成这份来源要求的 `D0–D7 → 四环 → 三段门禁 → 业务责任` 闭环。

**Inference**

- 课程可以在现有 LLM/RAG/Agent/质量系统主线内吸收本来源，不需要另起一套“金融 Agent 专课”；但必须新增一个架构总览和若干缺口页/页内区块，并把示例阈值改成带范围的 Metric Card。
- 仅在已有页面标题中出现“Agent、轨迹、压测、Canary”不能算 source fidelity；每个来源 section/atom 必须指向正文 block、图、工件或明确的拒绝/阻断记录。

**Unknown**

- 来源中的 τ-bench、Claw-Eval、MCPTox、2026 方差研究、法规日期及组织调查数字尚未在本文件中完成独立外部复核；在复核前只能保留为“用户材料中的待核主张”。
- 当前课程尚无完成后的 source-assimilation ledger、learner-usability-reuse receipt、visual-sequence manifest，因此不能据此宣称“小白可懂”或“拿来即用”。

## 1. 来源章节处置策略

| 来源定位 | 保护内容 | 处置 | 课程目标 |
|---|---|---|---|
| L23–L70「为什么需要 v2.0」 | 布尔门禁失效、只看最终结果、Judge 盲区、安全持续化、在线退化、多 Agent/成本/身份缺口 | `adapted`：保留问题链；外部数字先标 `USER-CLAIM/NEEDS-VERIFY` | Agent 测试为什么需要轨迹、分布、Judge 校准和持续环 |
| L73–L99「架构总览」 | 8 域 36 维、D0/D2 新增、D4/D5 范式变化 | `incorporated` + `adapted`：8 域作为教学地图，阈值移入 Metric Card | 让学习者先看到被测系统边界，再逐域学习 |
| L101–L235「Mermaid 架构图」 | 输入、D0–D7、四环、护栏、输出和反馈回灌关系 | `adapted`：重绘为仓库内 `.mmd` + `.svg`，保留源引用 | 一图理解测试输入、域、执行环和决策输出 |
| L238–L494「36 维明细」 | 每域职责、指标、方法、反例、护栏与审计字段 | `incorporated`：逐域映射到页面/区块；金融阈值改为场景适配器 | 能从架构边界推到风险、Oracle、case 和证据 |
| L496–L523「四环执行模型」 | 离线 CI、沙箱回放、影子/灰度、在线持续评估 | `incorporated` | 形成从提交到生产反馈的证据成熟度链 |
| L525–L566「三段式质量门禁」 | 硬红线、统计门禁、风险接受 | `incorporated` + `adapted` | 学会“阻断/证据不足/风险接受”而非单一 PASS |
| L568–L605「交易所场景」 | 数据时效、建议/执行分离、能力沙箱、7×24、巡检 Judge | `adapted`：明确为高风险示例，不作为普适阈值 | 展示业务规则、不可逆副作用与实时数据的特殊性 |
| L607–L623「迁移路线图」 | P0–P4 的先后依赖和“先校准 Judge”原则 | `incorporated` | 产出可执行的迁移 backlog 与阶段 Gate |
| L625–L639「参考依据」 | 来源名称、版本线索和复核入口 | `blocked` 直到外部复核；不得把引用表当已验证证据 | 每个外部主张有 source ledger、日期和适用范围 |

**处置原则**：任何固定百分比、κ、样本量、时长、攻击率、法规日期、组织比例和金融阈值都不能直接写成课程政策；必须转为 `metric-card`、标注示例/假设，或在 ledger 中 `blocked/rejected` 并保留原 locator。

## 2. D0–D7 逐域映射

### D0 评估可信层（4 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D0-1 Judge 校准/元评估 | TD-T03、TD-T14、TD-T21、TD-T24 | 部分覆盖 | 200–300 条仅作来源示例；补人人一致性、位置/长度/自偏好、双向 A/B、Judge Card、换版重校准和停用回退 |
| D0-2 评估集卫生 | TD-T02、TD-B02、TD-B05 | 部分覆盖 | 污染、漂移、代表性、访问日志、Sealed Holdout 的闭环；KL 仅为候选方法，不设通用通过线 |
| D0-3 指标构念效度 | TD-T01、TD-T03、TD-T23 | 缺少独立区块 | 明确“指标是否测到声称的构念”；业务相关性是待验证假设，不是默认 0.6 门槛 |
| D0-4 人审闭环/标注一致性 | TD-T03、TD-T14、TD-X601 | 部分覆盖 | 三类标注者/仲裁、争议样本、标注版本、人工升级规则和 reviewer owner |

**D0 学习产物**：`judge-card.json`、`gold-set-manifest.jsonl`、`annotation-disagreement.csv`、`evaluator-drift-report.md`。没有 D0 证据，后续 Judge 分数只能标 `UNTRUSTED/NOT_RUN`。

### D1 单体能力层（5 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D1-1 意图理解 | TD-T15、TD-T16 | 部分覆盖 | 高危意图零误判作为场景要求；补意图切片、错误类型和混淆矩阵 |
| D1-2 工具选择/参数 | TD-T16 | 覆盖较好 | 增加工具选择、参数、前置条件和权限的逐 step ledger |
| D1-3 span 级轨迹质量 | TD-T15、TD-W02 | 部分覆盖 | 四类 span 标签（工具、参数、观测利用、步骤必要性）、首错位置、步骤效率比、无效循环率 |
| D1-4 记忆读写/检索 | TD-X603 | 部分覆盖 | 将错误记忆、召回、遗忘、隔离和陈旧内容拆为可测 case；不能只讲 Memory 概念 |
| D1-5 规划/自我修正 | TD-W02、TD-T19 | 部分覆盖 | 注入错误观测、检查自纠、计划可执行性和人工接管边界 |

### D2 编排协作层（4 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D2-1 交接/职责边界 | TD-W01、TD-W02、TD-W03 | 部分覆盖 | A→B handoff schema、必传字段、5 个事实的三跳信息衰减、职责真空/重叠矩阵 |
| D2-2 子 Agent 隔离 | TD-W01、TD-T17、TD-X603 | 缺少明确架构块 | 主/子上下文可见性、返回污染、租户和秘密隔离；需 trace 级证据 |
| D2-3 级联失败/熔断 | TD-W02、TD-T24、TD-AP06 | 部分覆盖 | 下游错误/超时/空结果、步数/时间/成本三重熔断，并验证触发延迟 |
| D2-4 上下文工程 | TD-F03、TD-W02、TD-X603 | 部分覆盖 | 压缩/折叠/复位后的关键事实召回、上下文腐烂、checkpoint 版本 |

### D3 交互协同层（4 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D3-1 多轮上下文 | TD-F03、TD-X603 | 部分覆盖 | 轮数/指代/上下文保留的分层用例；不能只作为 Token 例子 |
| D3-2 多模态 | TD-X501、TD-X502 | 覆盖但需边界 | 图表/截图/文档输入的独立 Oracle、模态缺失与可访问性反例 |
| D3-3 中断/接管/确认疲劳 | TD-X601、TD-W02 | 缺少完整流程 | N 步中断、脏状态、回滚、接管后交回、确认疲劳和人工权威证据 |
| D3-4 可解释/体验 | TD-T15、TD-T21、TD-AP08 | 部分覆盖 | 决策依据、工具动作、用户可理解性与“解释不等于正确”的反例 |

### D4 鲁棒可靠层（5 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D4-1 可靠性分布 | TD-F03、TD-T04、TD-B03 | 部分覆盖 | 明确 `pass@k`（k 次至少一次成功）与 `pass^k`（k 次全部成功）；重复 task 的 clustered/paired uncertainty；CI 下界和样本不足状态 |
| D4-2 长时程降级 | TD-AP07、TD-AP08、TD-W02 | 部分覆盖 | 按任务时长画 horizon 衰减，产出自主时长上限和 checkpoint 间隔 |
| D4-3 Prompt/输入稳定性 | TD-F03、TD-T13、TD-T07 | 部分覆盖 | 语义等价改写、位置、冲突材料、截断和采样变异；不把 95% 写成普适 Gate |
| D4-4 异常/自恢复 | TD-W02、TD-PS10、TD-AP06 | 覆盖较好 | 将恢复率绑定故障暴露、预算、幂等和副作用 |
| D4-5 统计回归 | TD-T04、TD-T13、TD-T24、TD-B04 | 部分覆盖 | 预声明比较方法、配对/分层区间、effect size、版本一致性；“CI 不重叠”只能作示例规则，不能取代统计设计 |

### D5 安全对抗层（6 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D5-1 直接/间接注入 | TD-T17、TD-PS12 | 覆盖较好 | 延迟触发、多轮和跨会话套件；攻击到达每层的 trace |
| D5-2 工具投毒/MCP 供应链 | TD-T17、TD-X604、TD-X101 | 缺少专门区块 | tool description/result 投毒、rug-pull、manifest hash、实际权限 vs 声明权限、MCP 版本核查 |
| D5-3 身份/委托越权 | TD-T16、TD-PS12 | 部分覆盖 | Agent→用户→工具委托链、能力 token、最小权限和跨租户反例 |
| D5-4 记忆投毒/持久污染 | TD-X603、TD-T17 | 部分覆盖 | 当前会话、下一轮、下一会话存活率；污染写入前后 owner 和清除证据 |
| D5-5 代码执行/沙箱逃逸 | TD-X101、TD-T16 | 缺少 Agent 专门测试 | 能力沙箱、逃逸尝试、工具返回恶意 payload、禁止真实凭证 |
| D5-6 不可逆动作/爆炸半径 | TD-T16、TD-X601、TD-QP04 | 部分覆盖 | 可逆性×影响面×资金影响矩阵；二次确认、双人复核、硬额度、Kill Switch 的控制自身测试 |

### D6 效率经济层（4 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D6-1 延迟/吞吐 | TD-PS09、TD-A03、TD-A04、TD-AP02 | 覆盖较好 | Agent task、step、tool latency 与 streaming 指标的关联；P95/P99 仅作环境 profile |
| D6-2 Token/成本 | TD-PS09、TD-T23、TD-AP05 | 部分覆盖 | 成本 P99、单任务硬上限、质量-成本 Pareto、评估基础设施成本和超预算停止 |
| D6-3 并发/资源隔离 | TD-A04、TD-A05、TD-AP04、TD-AP05 | 覆盖较好 | 目标并发下 `pass^k` 变化、资源租户隔离、队列和 goodput 分母 |
| D6-4 可观测/可复现 | TD-AP03、TD-T21、TD-AP08 | 覆盖较好 | model/prompt/seed、完整 system prompt、tool manifest hash、调用输入输出、时间戳和可重放限制 |

### D7 业务治理层（4 维）

| 来源维度 | 当前页面 | 当前状态 | 必须补齐 |
|---|---|---|---|
| D7-1 业务规则/决策 | TD-T01、TD-T15、TD-T16、TD-T20 | 部分覆盖 | 业务硬规则独立于平均分；建议/执行分离；数据时效作为独立断言 |
| D7-2 合规/审计链 | TD-T21、TD-T22、TD-QP04、TD-AP08 | 覆盖较好 | 每个动作回链 Agent、代表用户、工具、依据、时间和 owner |
| D7-3 变更治理 | TD-T13、TD-T21、TD-T24、TD-X604 | 覆盖较好 | 四维 Agent 版本：模型、system prompt、工具清单、Memory 快照；任一变化触发回归 |
| D7-4 业务价值/ROI | TD-C01、TD-T23、TD-X805 | 部分覆盖 | 人工基线、质量/时延/成本联合结果、收益口径和风险接受责任；不得由“节省时间”推断 ROI |

## 3. 四环执行模型映射

| 来源环 | 当前目标页 | 吸收结果 | 必须拥有的工件/门禁 |
|---|---|---|---|
| 环 1 离线 CI | TD-T04、TD-T14、TD-T17、TD-T20 | 可在 fixture 中实现 | `offline-ci-manifest.json`、静态安全规则、确定性 Oracle、阻断 exit code、提交级 receipt |
| 环 2 沙箱回放 | TD-T15、TD-T16、TD-T17、TD-W02、TD-T20 | 有页面骨架，需统一环合同 | `sandbox-replay-manifest.json`、全轨迹 ledger、重复次数、故障注入、pass^k、回滚/owner |
| 环 3 影子/灰度 | TD-X805、TD-PS11、TD-AP08 | 主题存在，真实流量仍 NOT_RUN | `shadow-canary-plan.json`、旧/新版本配对、真实流量不生效、3–7 日观察窗、停止/回滚条件 |
| 环 4 在线持续 | TD-X805、TD-PS11、TD-AP08、TD-T24 | 设计存在，生产证据未知 | `online-monitoring-card.json`、采样/高危全量策略、漂移、告警、自动回滚、隐私/保留策略 |

每个环必须记录：`entry`、`exit`、`hard_blocks`、`population/workload`、`statistical_method`、`owner`、`rollback`、`evidence_maturity`。四环不是四个标题，而是同一风险在不同运行环境的证据升级链。

## 4. 统计与门槛的纠偏清单

### 4.1 必须保留的语义

1. `pass@k`：同一任务的 k 次尝试至少一次成功；不能当作单次稳定性。
2. `pass^k`：同一任务的 k 次尝试全部成功；它表达重复一致性，但不能自动等同生产可靠性。
3. 明确统计单位：`task`、`attempt/run`、`step/span`、`trajectory`、`session`，并声明状态是否重置。
4. 同一任务重复运行不是独立 Bernoulli 样本；跨 task 比较应采用 paired/clustered uncertainty 或等价的预声明方法。
5. 结果必须含 numerator、denominator、slice、baseline、版本、缺失/超时处理、区间方法、样本量理由、owner 和失败动作。
6. 观察到 0 次事故要同时给出 exposure 与上界解释；0 不是风险为 0 的证明。

### 4.2 必须改写为候选而非通用门槛

来源中的 `κ≥0.7`、位置交换≥95%、意图≥95%、参数≥98%、`pass^5≥80%`、CV≤0.15、ASR≤1%、工具拒绝≥99%、P95/P99、成本 CV≤0.3、D0 200–300 条金标、P0/P1/P2 的 k=10/5/3 等均应进入 Metric Card 的 `threshold_rationale`，并绑定任务、风险、总体、时间、版本、owner 和失效动作。

### 4.3 三段门禁的课程表达

```text
硬红线：高危安全/业务规则/不可逆动作绕过确认/D0 失效 -> BLOCKED
统计门禁：预声明的区间下界、分布差异、样本量和切片 -> PASS / EVIDENCE-INSUFFICIENT
风险接受：列出失败频率、护栏覆盖、owner、expiry、rollback -> 明示接受或拒绝
```

不得用总分抵消安全 blocker；不得把“统计证据不足”写成通过；不得让 Judge 自评或自动批准 waiver。

## 5. 小白前置与学习顺序

### 已有前置链

当前链条 `TD-F02 → TD-F03 → TD-F04 → TD-T01 → TD-T02 → TD-T03 → TD-T04 → Agent/Workflow` 是合理的：先模型/Token/Context，再 RAG/Agent 边界、Eval、Dataset、Oracle、重复统计。

### 来源新增但当前未显式建立的术语

在使用以下术语前，必须在本页或前置页用白话定义并给最小反例：`D0–D7`、meta-evaluation、span、first error position、handoff contract、context isolation、cascade failure、circuit breaker、horizon、pass^k、CI 下界、ASR、MCP tool poisoning、rug-pull、delegation chain、blast radius、shadow、canary、risk acceptance、Judge Card、construct validity、ROI。

### 建议的实际顺序

1. `TD-F04` 后增加“Agent 架构总览”页：画出输入→D0–D7→四环→护栏→决策输出；只讲边界，不急着测指标。
2. 先学 D0（评估系统可信）和 D1（单体轨迹），再进入 D2/D3（编排与人机协同）。
3. 之后学 D4/D5（分布可靠性与持续安全），再学 D6/D7（成本、治理、ROI）。
4. 最后将四环和三段门禁接入 CI、沙箱、影子、在线；Capstone 必须消费所有环的 receipt。
5. 交易所内容放在 D5/D7 的“高风险适配器”中，不作为小白默认场景。

### 每页最小小白闭环

`术语定义 → 一张 mental model 图 → 正例 → 反例/故障 → 学习者运行一个仓库输入 → 观察结果 → 诊断 → 修复 → 重新运行 → comprehension check`。

只给阈值、论文名或一段 Mermaid，不满足小白理解；只给命令但没有输入、预期证据、失败修复，也不满足直接复用。

## 6. 视觉与可复用工件清单

### 6.1 必须新增或重绘的图

| 图 ID | 内容 | 建议路径 | 最小节点/边 |
|---|---|---|---|
| `AG-VIS-00` | 8 域 Agent 测试架构总览 | `assets/visuals/agent-architecture-v2.mmd` + `.svg` | 输入、D0–D7、四环、护栏、输出、反馈，≥12/≥16 |
| `AG-VIS-01` | D0 Judge 校准闭环 | `assets/visuals/agent-d0-calibration.mmd` + `.svg` | gold → 人审 → Judge → 偏差 → 重校准/停用 |
| `AG-VIS-02` | D1 span 轨迹分层 | `assets/visuals/agent-d1-span-trace.mmd` + `.svg` | task → step/tool/observation → first error → Oracle |
| `AG-VIS-03` | D2 handoff/隔离/熔断 | `assets/visuals/agent-d2-orchestration.mmd` + `.svg` | A→schema→B→failure→circuit breaker→owner |
| `AG-VIS-04` | D3 中断与接管 | `assets/visuals/agent-d3-human-control.mmd` + `.svg` | run→interrupt→dirty state/rollback→takeover→resume |
| `AG-VIS-05` | D4 pass@k/pass^k 与 horizon | `assets/visuals/agent-d4-reliability.mmd` + `.svg` | task×runs→distribution→CI→time buckets→decision |
| `AG-VIS-06` | D5 攻击面与爆炸半径 | `assets/visuals/agent-d5-attack-surface.mmd` + `.svg` | untrusted input/tool/memory→policy→sandbox→side effect |
| `AG-VIS-07` | D6 质量-延迟-成本 Pareto | `assets/visuals/agent-d6-economics.mmd` + `.svg` | workload→trace→latency/cost/quality→budget |
| `AG-VIS-08` | D7 版本与审计链 | `assets/visuals/agent-d7-governance.mmd` + `.svg` | model/prompt/tools/memory→lineage→audit→waiver/rollback |
| `AG-VIS-09` | 四环成熟度与三段门禁 | `assets/visuals/agent-four-rings-gates.mmd` + `.svg` | CI→sandbox→shadow→online→hard/stat/risk |

每张图必须有 source refs、独立文件路径，不能复用同一 SVG 冒充不同知识关系；网页只引用仓库文件，不能依赖在线 Mermaid 渲染服务。

### 6.2 直接复用工件合同

每个工件至少实现：`artifact_id,path,purpose,inputs,editable_fields,outputs,adaptation_steps,validation,limitations,owner`。

| 工件 | 输入 | 学习者可改 | 预期输出/验证 |
|---|---|---|---|
| `agent-architecture-map.json` | 系统节点、工具、状态、边界 | 节点/责任/信任边界 | D0–D7 映射；每域有 risk/observable/Oracle |
| `judge-card.json` | rubric、gold set、Judge manifest | rubric 版本、校准样本、owner | κ/偏差/区间/停用动作；Judge 换版触发回归 |
| `trajectory-ledger.jsonl` | task、trace、工具调用、状态 | case、允许路径、禁止副作用 | outcome/step/trajectory 三层结果、首错位置 |
| `handoff-contract.json` | A/B schema、必传字段、上下文策略 | 字段和语义约束 | 信息保真、职责真空、隔离失败可复现 |
| `reliability-metric-card.json` | task set、重复运行、切片 | k、风险切片、区间方法、门槛 owner | pass@k/pass^k、分母、CI、样本不足状态 |
| `agent-security-suite.json` | 注入/投毒/越权/记忆/逃逸 cases | payload、租户、权限、动作 | ASR、阻断层、trace、爆炸半径；无真实副作用 |
| `workload-cost-card.json` | task workload、token、价格、并发 | 到达率、预算、模型/工具 profile | P95/P99、goodput、成本 P99、Pareto 与超限动作 |
| `four-ring-release-plan.json` | 版本 manifest、环配置、owner | 入口、观察窗、阈值、rollback | 四环 receipt、成熟度、阻断与回退 |
| `business-risk-acceptance.json` | 业务规则、失败成本、护栏、owner | 风险等级、expiry、补偿控制 | hard blocker、剩余风险、签字责任；不自动批准 |
| `agent-migration-backlog.csv` | P0–P4 项目、依赖、工期 | owner、排期、证据状态 | 每阶段 0→1→0，未完成保持 BLOCKED/NOT_RUN |

## 7. 当前课程重建建议与完成条件

### 建议新增/重写页面集合

优先不打乱已有稳定 page ID；新页面使用独立稳定 ID，并由 validator 重新生成连续 `display_number`：

1. `TD-AG-00` Agent 测试架构总览（D0–D7、四环、护栏）。
2. `TD-AG-01` D0 评估可信：Judge Card、标注一致性、构念效度和漂移。
3. `TD-AG-02` D1 轨迹 span：工具/参数/观测/步骤效率和首错位置。
4. `TD-AG-03` D2 编排：handoff schema、隔离、级联、熔断和上下文工程。
5. `TD-AG-04` D3 人机协同：中断、接管、确认疲劳和解释边界。
6. `TD-AG-05` D4 可靠性分布：pass^k、horizon、变异与统计回归。
7. `TD-AG-06` D5 持续安全：MCP/rug-pull、委托、Memory、沙箱和爆炸半径。
8. `TD-AG-07` D6 经济性：task/step 指标、成本尾部、并发隔离和重放。
9. `TD-AG-08` D7 业务治理：规则、审计、四维版本、ROI 和风险接受。
10. `TD-AG-09` 四环与三段门禁实战：CI→沙箱→影子→在线的 receipt 链。
11. `TD-AG-10` 交易/金融高风险适配器：时效、建议/执行、能力沙箱；显式标注非通用。

这些页面可以将已有 TD-T14/T15/T16/T17/TD-W02/TD-T20/TD-T23/TD-X805/TD-AP03 等内容迁移或引用，但不能只改标题；每个来源 atom 要落到具体 block、artifact、visual 或 disposition。

### Course lane 完成条件

- 冻结两份用户源文件并记录 SHA-256；source ledger 的 section/atom 数量精确闭合，零 `UNMAPPED`。
- `career-evolution-system` 与 `agent-architecture-testing` capability/adapter 已声明；本文的 D0–D7、四环和统计语义能被 validator 读取。
- 所有新增页面有连续 `display_number`、先修项、术语定义、正/反例、可运行输入、预期观察、故障修复、comprehension check 和复用工件。
- 每张视觉图有 source-owned `.mmd/.mermaid` 与 `.svg`，节点/边/来源引用满足 manifest；不重复路径、不在线渲染。
- 每个 Metric Card 有总体、分母、切片、版本、区间、阈值理由、owner 和失败动作；所有用户材料数字未被偷换成普适政策。
- 课程校验通过 source-assimilation、learner-usability-reuse、visual-sequence 三个新门禁；真实模型、真实企业、从业者和学习者证据仍单独记录为 `NOT_RUN`，不得写成完整课程或 live。

## 8. 交接给 course 实施任务

**第一条命令**：冻结 `/Users/owen/Downloads/AI agent测试架构.txt` 与 `/Users/owen/Downloads/AI测试工程师发展.md` 的包内副本，运行 `build_source_assimilation_ledger.py`，生成并逐项裁决 ledger；不要先改页面。

**本文件的交付性质**：`course-rebuild/agent-source-adjudication.md` 是来源→课程的审议输入，不是 source ledger、课程通过证据或发布批准。

**禁止事项**：不把来源中的数字写成通用门槛；不把交易所示例扩展成所有 Agent 规则；不把 fixture、静态图、Judge 自评或页面数量写成 live、practitioner、learner PASS 或 publication。
