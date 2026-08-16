# 当前课程对专家建议的覆盖与缺口审计

审计日期：2026-08-12。对象为当前 full-fidelity `tutorial/tutorial-site.json` 中 85 个公开页面，以及 `research/course-catalog-manifest.json` 中 117 个 canonical topic。判定标准不是“出现过关键词”，而是该能力是否具有独立教学问题、方法选择、可执行工件、独立 Oracle、0→1→0 证据和迁移边界。

## 总裁决

当前课程已经有一条较强的 **Fixture 级工程骨架**：传统测试、需求到证据、Eval/RAG/Agent、Serving、Agent 压测、质量系统和 Benchmark 都有公开页面；85/85 页面有当前可执行性与编辑审计记录。但它还不是用户描述的“一站式专业 AI 测试培养体系”，主要原因有三类：

1. 有些知识以分散实践出现，没有形成新人能掌握的基础概念和指标选择方法；
2. 有些主题只在 canonical catalog 中 `planned/outlined` 或作为 alias 存在，不能视作已教学；
3. Skill/MCP、提效实验、数据标注、“AI 味”、工具横向适配等关键闭环缺少独立能力单元。

成熟度边界：以下“已覆盖”只表示当前页面和 fixture 工件可消费，不表示真实模型、平台集成、从业者或生产完成。

## 保留并加深

| 专家要求 | 当前页面 | 判定 | 二次改造 |
| --- | --- | --- | --- |
| 传统功能、接口、自动化、性能、安全、移动端能力 | TD-PS01..12 | **较完整的 Fixture 基础** | 增加统一入学诊断和真实代码仓迁移任务；确保初学者先通过传统能力门禁再进入 AI 质量。 |
| 需求解读→计划→Oracle→自动化→证据→发布 | TD-P01..08 | **较完整** | 把该链提升为所有后续 AI 单元的强制前置和共享工件，不允许后续页绕开 Basis/Oracle。 |
| 大模型生命周期、Token/Context、LLM/RAG/Agent/Workflow 边界 | TD-F02..04 | **覆盖但偏测试视角** | 增加发展脉络、训练/推理、Transformer、embedding、alignment、serving 等小白概念桥接和可视化实验。 |
| Eval 合同、Dataset/Slice/Holdout、Composite Oracle、重复运行 | TD-T01..04 | **较完整** | 增加统一 Metric Card 和统计解释模板；明确分类、生成、检索、Agent 各任务指标的选择分支。 |
| RAG 语料、检索、Faithfulness、无答案与权限 | TD-T09..12 | **较完整** | 加入多路检索、reranker、chunk 策略对照和领域标注一致性；保留 end-to-end 与 retrieval/generation 分离。 |
| Prompt/模型/知识库 A/B 与 LLM Judge | TD-T13..14 | **高级专题已有，基础层缺口明显** | 新增 Prompt 基础单元后再进入 A/B；Judge 增加 human-human agreement、position swap、abstain 和成本/延迟选择。 |
| Agent 结果/步骤/轨迹、工具权限、注入、浏览器、自愈 | TD-T15..19 | **较完整** | 增加跨 Agent 框架 adapter、真实浏览器 sandbox 和副作用账本的集成级练习。 |
| Workflow/多 Agent、重试/Handoff/终止 | TD-W01..03 | **覆盖** | 新增 state machine 可视化、orchestrator-worker 公平实验、长流程可恢复性和死循环预算。 |
| AI Serving 和 Agent 性能 | TD-A01..06、TD-AP01..08 | **当前最强板块之一** | 把 QPS/RPS 与 Task Goodput 明确区分；增加工具实操入口、硬件资源证据和安全停止 SOP。 |
| 公共到企业 Benchmark | TD-B01..06 | **覆盖方法框架** | 接入 HELM/OpenCompass/C-Eval/GAIA/MLPerf 的版本化适配器示例；明示 CAIA 歧义，不建立错误课程名称。 |
| 质量平台、Lineage、Trace-to-Regression、联合 Gate、漂移/回滚 | TD-T20..24、TD-QP01..04 | **覆盖工程骨架** | 增加真实平台最小接入层和跨系统权限/脱敏测试；当前仍是离线 fixture。 |
| Capstone 与职业迁移 | TD-T25、TD-C01 | **有入口但范围不足** | 改为消费新增全链能力的组合项目；必须提交 metric tree、annotation pack、prompt package、MCP/tool adapter、ROI experiment 和 release evidence。 |

## 部分覆盖但需要独立教学单元

| 缺口 | 当前证据 | 为什么现在仍不够 | 必须新增的学习产物 |
| --- | --- | --- | --- |
| Prompt 基础与规则 | canonical catalog 有“Prompt 与结构化输出”，状态 `planned`；现有页面普遍使用版本化 Prompt。 | 学员会复制 Prompt 工件，但没有系统掌握指令层级、context、examples、输出契约、拒答、截断、tool use、调试和何时不该改 Prompt。 | `Prompt Contract`、版本化 system/task/critic/repair、正/负/拒答/截断 eval、跨模型差异收据。 |
| AI/ML 任务基础与指标 | F02-F04、T01-T04 分散涉及。 | 缺分类/回归/聚类/排序/摘要/对话/多模态的任务→数据→Oracle→指标选择总图；F1 等公式没有独立新手路径。 | `Task Metric Decision Table`、混淆矩阵 lab、摘要多 Oracle lab、metric misuse mutations。 |
| 业务指标协商 | T01、T23 有发布问题与联合 Gate。 | 尚无独立教学如何从业务损失、用户旅程和风险偏好确定 success/failure、阈值 owner 与降级动作。 | `Business Metric Tree`、error-cost matrix、threshold decision record、上线/回滚动作表。 |
| 数据标注标准 | T02、B02 有 dataset/split/双人标注片段。 | 没有完整 Annotation Guide、label ontology、示例边界、IAA、disagreement/adjudication、gold/holdout 管理与标注 QA。 | `Annotation Guide`、双盲标注夹具、IAA/混淆报告、adjudication ledger、Dataset Card。 |
| 常用 AI 工具、平台与工作流 | 页面按不同工具和架构分散。 | 新人无法回答“什么场景选哪种平台/工具，如何比较 lock-in、数据边界、成本和复现性”。 | 版本化 `Tool/Platform Radar`、选择矩阵、同一 fixture 的两 adapter 对照、迁移记录。 |
| AI 辅助测试提效 | T05-T08 覆盖生成风险、候选、方法和聚类；站点只有少量“提效”说明。 | 没有对照实验、任务分层、人员经验、time-to-accepted、返工、缺陷产出、flaky、成本和统计不确定性。 | `Productivity Experiment Manifest`、baseline/control、计时/质量/成本收据、human acceptance、效果区间和停止规则。 |
| API 巡检规则 | PS01-PS03 有业务契约、OpenAPI/属性、事件/鉴权。 | 缺可复用的巡检 rule registry、增量变更策略、auth/resource/business-flow/SSRF/inventory 等安全全图和告警处置。 | `API Inspection Rule Registry`、OpenAPI diff、mutation/fuzz、state/idempotency test、OWASP mapping、report adapter。 |
| 横向模型评测 | B01-B06 有 benchmark 工程。 | 缺同一 harness 接入多个公开评测与模型的具体配置、成本归一、置信区间、污染与版本报告。 | `Horizontal Evaluation Manifest`、adapter contract、raw output archive、confidence/cost table、contamination note。 |
| 职业能力与个性化路线 | TD-F01、TD-C01 已以证据工件和 90 天 transfer 取代就业保证。 | 缺统一入学诊断、责任证据阶梯、组织职级 adapter 和专项选择规则；不能用 P5-P9/年限直接补。 | `Learner Diagnostic`、`Capability Evidence Profile`、`Organization Level Adapter`、route decision record。 |
| 传统 ML 训练失效 | T01-T04 有数据、slice、重复与 Oracle 基础。 | 没有系统讲欠拟合/过拟合、数据泄漏、校准、特征/标签漂移和训练/服务偏差。 | `Model Failure Matrix`、leakage/calibration/drift mutations、slice Metric Cards。 |
| CV、推荐/排序、解释有效性专项 | 多模态、检索、排序、公平/安全散落在既有页。 | 没有以各任务的数据变换、变形关系、离线→在线指标、反馈回路和解释忠实度形成选择性完整 track。 | CV metamorphic suite、ranking metric tree、Explanation Claim/Oracle Card。 |
| 评估系统可信度 | T14 有 Judge 偏差与校准，B03/B04 有 scorer/回归。 | 尚未把 construct validity、适用 agreement statistic、版本桥接、human sentinel 和 meta-evaluation drift 作为 D0 强制层。 | `Judge Card`、gold/IAA pack、bias/position eval、abstain、bridge receipt、construct-validity decision。 |
| 多 Agent 交接与长时程自主 | W01-W03、T15-T16、AP 系列已有编排、轨迹和性能。 | 交接字段、事实存活率、上下文压缩丢失、级联熔断、interrupt/takeover/dirty rollback、confirmation fatigue 和 autonomy envelope 不完整。 | `Handoff Contract`、fact-survival mutation、Human Control state machine、horizon buckets、budget/kill-switch receipt。 |

## 当前缺失或不可用

| 缺失能力 | 当前判断 | 根治要求 |
| --- | --- | --- |
| Skill 冲突治理 | **缺失**。少数页面提 MCP/provider drift，但没有 Skill name/trigger/schema/resource/authority/side-effect/version/output 冲突体系。 | factory 新增 `Capability Registry + Conflict Manifest + Resolution Receipt`，强制 namespace、exact owner、deny/allow、compatibility 和 shadow eval。 |
| 向量化解耦 | **缺失且术语有歧义**。 | 把向量检索限定为候选发现；执行走 deterministic policy graph。课程需设计冲突反例，证明 embedding 相似不能授权调用。 |
| MCP Server 工程与跨平台接入 | **缺失端到端单元**。现有 MCP 只作为局部工具协议词出现。 | 覆盖 schema/list/call/error、stdio/HTTP transport、auth/scope、roots、timeout/retry/idempotency、tool collision、prompt injection、side effects、audit 和跨 client conformance。 |
| Playwright/Cypress 双适配 | **Playwright 有，Cypress 无**。 | 统一 Test Basis 与 Oracle，分别适配两者执行语义；比较可运行性、重试、定位器、网络控制、证据和维护成本，不能做品牌优劣宣传。 |
| “AI 味”评测体系 | **缺失**。当前项目有 ai-slop-cleaner 工作流，但课程无正式专业单元。 | 建 `Content Quality Rubric`、重复/空泛/伪来源/不可执行 mutations、人工复核；禁止把 detector 作为作者身份判定。 |
| Web/Vibe Coding 质量方法 | **术语 Unknown，当前无独立单元**。 | owner 澄清后，若为 Vibe Coding，则必须教 intent/spec/code/test/security/review/release 全链和“无人读源码”的反证。 |
| 飞书 MCP 具体平台 | **名称已确认，但当前课程缺失端到端单元**。 | 建飞书协同 adapter：需求/缺陷/报告在消息、文档、表格、任务或审批间受控流转；测试 app scope、租户边界、脱敏、幂等、回写、审计、限流和失败恢复。FastMCP 不作为同义词。 |
| “通用 CAIA” | **无法使用**：当前精确证据只支持 crypto domain CAIA。 | owner 关闭 AMB-01；默认课程采用 GAIA/C-Eval/HELM/OpenCompass/MLPerf + 企业 benchmark 的明确名称。 |
| 固定职业权重、P5-P9 与年限路线 | **无法作为通用课程合同使用**。输入文档提供的是公司化候选模型，缺组织与有效性证据。 | 用责任证据阶梯和 `organization_level_adapter`；默认 `INTERNAL-UNKNOWN`，不得推断职级、晋升或就业结果。 |
| Agent 架构固定阈值 | **无法直接使用**。κ、Gold 数量、pass^k、ASR、延迟、抽样率、shadow 时长和路线周期均缺目标风险/样本/owner。 | 所有值进入 Metric Card，声明 population、failure cost、baseline/regulation、power/CI、owner、version、failure action。 |
| 轨迹与 Agent 供应链安全 | **现有课有基础但不可称完整**。缺 evaluator D0、rug-pull、签名来源、delegation identity、confirmation fatigue 和 blast-radius 负例闭环。 | 新增 `Agent Evaluation Architecture`、`Signed Tool Manifest`、delegation/effect ledger 和 cross-ring release decision。 |

## 目录与成熟度冲突

- 公开站点有 85 页，但 canonical catalog 有 117 topic；“目录有名词”不能代替“公开页可教学”。
- canonical 中诸多主题仍是 `planned/outlined` 且 `content_gate=blocked`，即便它们有公开 alias，也不应被写成完整 canonical 能力。
- 85 页的可执行性和编辑审计说明 **当前 fixture 页面** 达到既定结构门禁；它们不证明专家新增要求已经被吸收，更不证明真实工具、模型、平台、从业者或生产使用。

## 二次改造优先级

1. **P0 Skill 根治**：能力合同、Metric Card、Prompt/Eval/Mutation、Skill/MCP 冲突与适配、ROI Experiment、术语歧义门禁。
2. **P1 新人基础**：LLM 发展与原理、Prompt 基础、AI/ML 任务与指标、业务指标、数据标注。
3. **P1 专业闭环**：Judge 校准、AI 辅助测试提效、Agent 压测 SOP、API 巡检规则、MCP/跨平台接入。
4. **P2 平台融合**：Playwright/Cypress、飞书 MCP 协同 adapter、公开 Benchmark adapter、质量平台。
5. **P2 Capstone 重组**：用完整全流程交付证明能力，不以页面数或讲过名词作为完成条件。
6. **P1 Agent D0/D2/D3/D4 根治**：Judge Card、handoff、human control、long-horizon reliability、autonomy envelope 和四环 entry/exit/rollback。
7. **P2 选择性专项**：传统 ML 训练失效为公共桥接；CV、推荐/排序、解释有效性按目标岗位启用，不为凑目录重复现有页。
