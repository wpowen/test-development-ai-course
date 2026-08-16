# AI 测试专业能力证据矩阵

日期：2026-08-12。来源细节见 `source-ledger.csv`。本矩阵把“来源直接支持的事实”和“为课程工厂作出的工程推导”分开。

## Evidence

| Claim ID | Evidence（来源直接支持） | Source IDs | 反证或限制 | 对课程的约束 |
| --- | --- | --- | --- | --- |
| CL-01 | AI 系统质量不能只用准确率表达；测试还涉及数据、功能正确性、鲁棒性、安全、隐私、公平、可解释、性能、监控和漂移。 | E01-E04 | 标准不提供所有业务阈值。 | 课程必须用质量树，不得用单一“模型分数”代替发布判断。 |
| CL-02 | 分类任务可由混淆矩阵得到 accuracy、precision、recall、F1；F1 是 precision 与 recall 的调和平均。 | E01, E07 | F1 掩盖类别、slice 和错误成本；macro/micro/weighted 口径不同。 | 学员必须先写误报/漏报成本、正类定义和 slice，再选 F1 及 averaging。 |
| CL-03 | 摘要和文本生成可使用 ROUGE、BERTScore 等自动指标，但它们分别主要衡量词汇重叠或表示相似性。 | E08-E09 | 高分不证明事实正确、来源支持、业务可用或安全。 | 自动指标必须和事实性、来源、任务完成、拒答与人工 rubric 组合。 |
| CL-04 | RAG 应把检索上下文、对上下文的忠实使用与最终生成质量分开评估。 | E10 | 自动评测需要领域校准；检索 gold 也可能有分歧。 | 课程必须保存 query、rewrite、top-k、doc ID/score/filter、context 与 answer trace，不能只看最终回答。 |
| CL-05 | LLM Judge 可与人类偏好较高一致，但存在位置、冗长、自增强、推理和模型家族偏差。 | E11-E13 | 单一研究的 agreement 数字不能迁移为通用阈值。 | Judge 不能自批；需金标校准、顺序交换、重复运行、分歧升级和人工 blocker。 |
| CL-06 | LLM serving 性能至少要区分 TTFT、inter-token latency/TPOT、端到端延迟、request throughput 和 token throughput，并固定输入/输出长度分布。 | E14-E16 | 工具默认 workload 不代表生产 workload；硬件与 batching 影响很大。 | 每个性能数必须绑定 workload version、并发/到达模型、长度分布、SLO 和环境。 |
| CL-07 | Agent 评测对象不仅是最终答案，还包括 harness、轨迹、工具动作、权限、停止和 grader 组合。 | E13, E21, E38-E39 | 框架提供的 trace 不自动证明业务正确或副作用安全。 | Agent 测试要有 task-root→step→tool-attempt trace、side-effect ledger、termination oracle 和人工审批边界。 |
| CL-08 | MCP 工具名称只需在单 server 内唯一；聚合器应对跨 server 冲突作消歧。工具测试还要覆盖 schema、transport 与真实协议路径。 | E17-E20 | namespace 不能解决权限、版本、输出路径和副作用冲突。 | Skill/MCP 工厂必须有 exact ID/namespace、冲突类型、权限、兼容矩阵、测试收据和 fail-closed 路由。 |
| CL-09 | Playwright Test Agents 定义 planner/generator/healer；Cypress 具有命令队列、retryability 和 actionability 等不同执行语义。 | E21-E23 | 工具工作流不是测试方法；healer 可能误修绿。 | 工具作为 adapter 教学；同一 Test Basis/Oracle 必须跨 Playwright/Cypress 保持一致。 |
| CL-10 | 数据集应记录动机、组成、采集、预处理、用途和维护；模型报告应记录意图、评测条件、群体表现和限制。 | E25-E26 | 文档齐全不等于标签正确、代表性足够或无泄漏。 | 课程要加入 Annotation Guide、Label Schema、IAA、disagreement/adjudication、Dataset Card、Split/Holdout 和 lineage。 |
| CL-11 | AI 辅助开发的提效不能靠主观感觉或营销倍率证明；一项随机研究在其样本中观察到使用早期 2025 AI 工具的资深开发者变慢 19%。 | E27 | 研究规模、任务和工具版本有限，不证明 AI 永远降效。 | 课程必须教 baseline/control、分层任务、time-to-accepted、质量/缺陷/返工/成本联合测量和置信区间。 |
| CL-12 | LLM 生成测试通常需要上下文构造、编译/执行反馈和修复循环；覆盖率提升不等于断言正确或能杀死缺陷。 | E28-E29 | 研究项目和模型有限；结果需在目标代码库复验。 | AI 测试用例生成必须通过 compile/run、assertion review、mutation、trace coverage、flakiness 和 human acceptance。 |
| CL-13 | Prompt 工程应从成功标准和可测试评测开始，而不是先写措辞；清晰结构、例子和迭代有帮助。 | E30-E31 | 供应商提示建议不是跨模型保证，也不能修复数据/架构问题。 | Prompt 包必须绑定 Basis、风险、方法、Oracle、Schema、Eval、Mutation、模型版本和收据。 |
| CL-14 | HELM、OpenCompass、C-Eval、GAIA、MLPerf 分别覆盖透明横评、评测流水线、中文知识、通用助手和系统推理性能的不同侧面。 | E14-E15, E32-E35 | 公共 benchmark 有污染、harness 敏感性、部署差异和维护风险；HELM 已有维护状态新变化。 | 横评必须固定模型/Prompt/harness/data/seed，报告区间、成本和限制；企业验收需另建业务 benchmark。 |
| CL-15 | AI 文本作者检测存在改写攻击和误报/漏报权衡，不能可靠地把一段文本判为 AI 所写。 | E24 | 不否定内容质量 rubric、来源核验和人工编辑。 | “AI 味检测”应改造成可观察的内容缺陷评审，不得把 detector 分数写成作者身份事实。 |
| CL-16 | OpenAPI 能提供机器可读接口合同；OWASP API Top 10 给出鉴权、资源、流程、SSRF、库存和不安全消费等风险。 | E05-E06 | Schema 合规不证明业务状态、副作用或可用性。 | 接口巡检规则必须覆盖 schema、authorization、business flow、state/idempotency、rate/resource、dependency、audit 与 privacy。 |
| CL-17 | 精确检索下，CAIA 是加密资产交易 Agent 的领域 benchmark，而 GAIA 是通用 AI Assistant benchmark。 | E35-E36 | 用户可能指另一个缩写。 | 在 owner 确认前，课程不得写“通用 CAIA 基准”。 |
| CL-18 | 用户已明确目标为飞书 MCP；飞书开放平台提供 MCP 与本地 OpenAPI MCP 官方入口。FastMCP 是另一技术框架，不是本次平台名称。 | E37 | 官方入口不证明目标租户的凭证、权限、OpenAPI scope 和运行成功。 | 建立飞书协同 adapter；必须测试权限、脱敏、幂等、审计、失败恢复和跨系统证据回写，不能只演示发送消息。 |
| CL-19 | 用户提供的职业能力文档覆盖传统测试、ML/DL/LLM、CV/NLP/推荐、数据/模型/鲁棒/公平/可解释、A/B、漂移、MLOps 与协作等候选能力。 | E43 | 作者、组织、样本与详细来源链未知；固定权重、P5-P9、年限和晋升指标不具行业权威性。 | 吸收专业主题，不吸收固定权重、职级、年限、数量指标和就业承诺；改造成证据化责任阶梯和可选专项。 |
| CL-20 | 用户提供的 Agent 架构文档把评估器可信度、单体、协作、交互、可靠性、安全、经济和治理分成 D0-D7，并提出 offline、sandbox、shadow/canary、online 四环。 | E44 | 这是设计草案；多数百分比、样本量、时长和法规日期未经定位或已时变。 | 将 D0-D7 和四环作为 coverage/运行合同，不把草案中的固定值当行业门禁。 |
| CL-21 | τ-bench 用 `pass^k` 描述同一任务多次均成功的可靠性；该基准的 retail 场景中报告了低于 25% 的 pass^8。 | E45 | benchmark、模型、任务和 harness 特定；`pass^k` 不是 `pass@k`，小 k 也不直接提供普适发布置信度。 | 课程必须分别定义 Pass@1、PassAllK/pass^k、任务状态重置、独立性、分层重复和区间方法。 |
| CL-22 | Claw-Eval 报告轨迹不透明的评测会漏掉其基准中的安全/鲁棒问题，且故障注入可使 Pass^3 明显下降而 Pass@3 保持稳定。 | E46 | 具体 44%、13%、24 个百分点只适用于论文的 300 任务、14 模型和 scorer。 | Agent Eval 必须组合 deterministic state/effect checks、trajectory audit 和 semantic judge；不得只看最终文本。 |
| CL-23 | MCPTox 在其 45 个 MCP server、353 个工具和受测 agent 设置中证明了 tool-description poisoning 是现实攻击面。 | E47 | 72.8% 等 ASR 是特定模型/设置结果，不是所有 MCP 的普遍漏洞率。 | MCP conformance 增加 tool manifest poisoning、rug-pull、签名/哈希变更、能力与副作用策略的负例。 |
| CL-24 | OWASP 发布了 2026 Agentic Applications Top 10，覆盖目标劫持、工具误用、身份权限、供应链、代码执行、记忆/上下文、中间通信、级联、人类信任和 rogue agent 等风险。 | E48 | 风险分类不能证明具体系统已受影响，也不给出通用阈值。 | Agent 安全课程和 Skill risk taxonomy 应显式覆盖这些攻击面并绑定 threat model、control、detection 和 residual-risk owner。 |
| CL-25 | 欧盟和 Colorado 的 AI 法律适用日期是分阶段且会修订的时效事实。 | E49-E50 | 旧文档中的“2026-08 高风险全部生效”及旧 Colorado 日期过宽或过时。 | 法规内容必须记录 jurisdiction、statute/article、version、checked_at、legal owner；没有当前法律复核不得变成发布门禁。 |

## Inference

以下是跨来源综合出的工厂协议，不是某个标准逐字规定：

1. **四层指标合同**：`业务结果与失败成本 → 任务/模型质量 → 系统/非功能质量 → 运行/经济指标`。每个指标再绑定 `slice + statistic + threshold owner + version + failure action`。
2. **指标选择顺序**：先写被测任务、用户与损失，再写数据与 Oracle，最后才选 F1、ROUGE、Recall@k、TTFT、QPS 等公式。工具能计算什么不决定项目应该测什么。
3. **Prompt 不是独立能力岛**：专业 Prompt 必须消费已批准的 Test Basis、风险、方法和 Oracle，并产出结构化候选；Critic、Eval、Mutation 和人审决定能否进入下游。
4. **AI 辅助测试提效是实验问题**：效率、质量、成本和风险必须同时测量。以 `time-to-accepted-test` 而不是“生成速度”作为主效率单位，更能避免大量不可用候选制造假提效。
5. **Agent 压测的计量单位是 Task**：HTTP request 只能作为底层信号。容量应报告 `successful tasks under SLO and safety constraints`，而不是最大 QPS。
6. **向量化只负责发现，不负责授权**：Skill 的 embedding/index 可降低耦合并支持检索，但 activation、版本、依赖、权限、副作用和输出必须走确定性 policy graph。
7. **公共 Benchmark 是校准与比较层**，企业 Benchmark 是决策层。两者可共享 harness 形状，但不能共享未验证的阈值或“领先”结论。
8. **“AI 味”应转成缺陷 taxonomy**：空泛、重复、模板化、无来源、伪精确、不可执行、无 owner、无反例、无失败动作、边界声称漂移。该 taxonomy 可测试；作者身份不可可靠断言。
9. **职业能力要用证据阶梯而不是公司职级**：`guided execution → independent scoped ownership → system/cross-team leverage → strategy/governance/mentoring`；每层用 decision rights、failure cost、artifact、fault/mutation、consumer 和 reviewer 证明，不用年限和影响力计数替代。
10. **评估器也是被测系统**：Judge 的 agreement 只是 reliability 证据，不自动证明 construct validity；需要 Judge Card、Gold/IAA、偏差与顺序交换、abstain、版本桥接、human sentinel 和失败动作。
11. **Agent 可靠性必须拆分峰值能力与重复可靠性**：Pass@k、pass^k/PassAllK、长时程 survival、恢复和 cost tail 回答不同问题；统计单位、依赖结构和 CI 必须显式。
12. **四环不是固定天数**：每环都需要 entry/exit、代表性、硬阻断、统计证据、升降级、rollback hysteresis、owner 和 evidence retention；时长与抽样比例由风险/成本决定。

## Unknown

- 用户所指 `CAIA`、`Web Coding` 的精确定义；`飞书 MCP` 已由用户确认目标名称，但具体租户、应用、scope 和业务动作仍未知。
- 目标企业的业务指标、错误成本、红线阈值、数据权限、标注 owner、人工审批比例和可接受残余风险。
- Playwright、Cypress、飞书 MCP、FastMCP 和模型 Provider 在目标环境的真实凭证、网络、权限、成本、延迟和兼容结果；飞书 MCP 是目标协同平台，FastMCP 只是可能的 server framework，二者不互为同义词。
- 当前没有真实模型运行、企业 API/数据、从业者盲评或生产 workload；不能由本研究升级为 `model-integrated`、`integration-tested`、`practitioner-reviewed` 或 `production-validated`。
- 当前 85 页虽通过 fixture executability 与 editorial rubric，但尚未因为本研究自动获得新增能力；必须经过 factory 变更、课程重建、逐页运行和 validation 才能晋级。
- 用户两份文档的作者来源链、采用组织、目标公司职级、阈值样本和职业有效性；因此只能把它们当作专家输入，不能当作标准或实践证明。
- 目标是否需要交易/金融专项；Agent 文档中的交易限制、时效、双人复核、成本和风险接受值均没有本项目 owner。
- 传统 ML、CV、推荐/排序、解释有效性是公共必修还是选择性专项，需由目标岗位和 learner route 决定；当前建议为公共方法核心 + 选择性 adapter。
