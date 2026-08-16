# AI 测试开发专业能力蓝图 v2

版本：1.0.0  
日期：2026-08-12  
状态：`RESEARCH-ADJUDICATED / FACTORY-NOT-IMPLEMENTED`  
证据边界：标准、官方文档、主要研究和本地课程审计；没有真实模型、飞书租户、企业数据、从业者或生产验证。

## 1. 目标能力

学员最终不只是“会用 AI 写测试用例”，而是能对一个 AI-enabled system 完成以下闭环：

```text
业务目标与失败成本
  → Test Basis / 技术架构 / 风险
  → 数据与标注合同
  → 任务、模型、系统、性能、业务指标树
  → 测试策略、方法与独立 Oracle
  → Prompt / Eval / Mutation package
  → API / Web / Mobile / Model / RAG / Agent adapters
  → 执行、Trace、故障归因与报告
  → 飞书 MCP 协同、人工审批与回写
  → 回归、发布、监控、回滚与能力迭代
```

AI 的权限始终是：提取、生成候选、执行已授权动作、聚类、归因建议和摘要。AI 不能自动决定来源权威、业务阈值、关键 Oracle、权限例外、生产放行或残余风险接受。

## 2. 统一质量与指标框架

### 2.1 四层质量树

| 层 | 回答的问题 | 典型维度 | 初学者必须交付 |
| --- | --- | --- | --- |
| L0 业务与用户 | 做对这件事产生什么价值，失败损失是什么？ | 任务完成、转化、解决率、升级率、满意度、违规/损失、人工节省 | Business Outcome Contract、error-cost matrix、owner 与 stop/rollback |
| L1 数据与任务/模型 | 模型是否在定义的数据和任务上做对？ | 输入有效性、label/coverage、classification、regression、ranking、summarization、dialogue、RAG、Agent outcome | Dataset/Annotation Card、Task Metric Card、slice 与 reference/oracle |
| L2 系统质量 | 整个 AI 系统是否可信地工作？ | 功能正确性、一致性、边界、鲁棒、安全、隐私、公平、可解释、可用、可靠、可维护 | Test Strategy、risk-method-oracle matrix、security/safety blockers |
| L3 运行与经济 | 在目标 workload 下能否持续并可负担地工作？ | E2E latency、TTFT、TPOT/ITL、QPS/RPS、token throughput、goodput、concurrency、resource、cost、stability | Workload Manifest、Metric Tree、capacity envelope、cost/success 与 SLO |

### 2.2 Metric Card 强制合同

任何课程或 Skill 只写“测 F1/QPS/正确率”都应失败。一个指标至少要有：

```yaml
metric_id: MET-...
decision_question: 这个数字支持哪个决策
task_and_population: 任务、用户、流量和适用范围
failure_cost: FP/FN/错误动作/延迟/成本分别造成什么损失
definition: 公式、单位、分子分母、方向
data_version: dataset/workload/split/hash
slices: 风险切片与最低样本数
aggregation: micro/macro/weighted/mean/median/p95/p99/CI
measurement_point: client/gateway/model/tool/task-root
threshold:
  value: ...
  method: baseline/regulatory/risk-budget/statistical
  owner: ...
uncertainty: CI/repeats/judge-disagreement/unknowns
version_bindings: model/prompt/tool/harness/environment
failure_action: BLOCK/REVIEW/DEGRADE/ROLLBACK/INVESTIGATE
limitations: 不能从该指标推出什么
```

### 2.3 按任务选指标，不按工具选指标

| 任务 | 主指标候选 | 必需的补充 Oracle / 陷阱 |
| --- | --- | --- |
| 分类/识别 | confusion matrix、precision、recall、F1、AUROC/PR-AUC、calibration | 先定义正类和错误成本；必须按类别/人群/场景 slice；accuracy 可被不平衡数据欺骗 |
| 回归/预测 | MAE、RMSE、quantile error、calibration | 单位和容忍区间；极端风险 slice；时间漂移；不能只看平均误差 |
| 排序/检索 | Recall@k、Precision@k、MRR、nDCG、coverage | gold doc 可能不唯一；保存 top-k trace；按 query 类型和权限 slice |
| 摘要/生成 | factuality、source support、coverage、relevance、instruction adherence、ROUGE/BERTScore | ROUGE/BERTScore 只作辅助；必须有事实/来源/拒答/安全/human rubric |
| 对话 | task success、turn success、helpfulness、consistency、refusal/escalation | 多轮状态、用户目标、上下文污染、不可解任务；不能只用单轮 Judge |
| RAG | corpus quality、retrieval、context quality、faithfulness/citation、answer quality、end-to-end outcome | 检索与生成分层；无答案/权限独立门禁；index/query/prompt 全版本化 |
| Agent | outcome、trajectory、step/tool correctness、permission、side effects、termination、recovery、cost | 最终答案正确不抵消越权动作；工具结果和副作用需独立 ledger |
| 多模态 | cross-modal alignment、task accuracy、OCR/ASR、temporal/spatial consistency、safety | 每个 modality 独立 Oracle；不可只让同一多模态模型自评 |

### 2.4 职业能力采用责任证据梯

课程不得把工作年限、P5-P9、证书、分享数、Star 或固定用例数量当作通用能力等级。公共能力梯为：

| Level | 责任边界 | 必须提供的证据 |
| --- | --- | --- |
| C0 Guided execution | 在给定 Basis/fixture/Oracle 下执行并解释结果 | exact command、raw result、finding、边界与导师 review |
| C1 Independent scoped ownership | 独立完成一个受控主题的风险→方法→Oracle→执行→修复 | capability artifact、mutation 0→1→0、decision record、consumer acceptance |
| C2 System/cross-team leverage | 让多个团队或组件复用合同并安全处理变更 | versioned adapter、compatibility/effect trace、incident/regression linkage、owner review |
| C3 Strategy/governance/mentoring | 定义质量策略、风险接受、组织机制并培养他人 | portfolio evidence、governance decision、residual-risk owner、transfer/mentoring receipt |

公司 title/P-band 只能由 `organization_level_adapter` 显式映射；默认 `INTERNAL-UNKNOWN`。学习路线由 learner diagnostic、目标岗位、可用时间和出口工件决定，不承诺固定月份或就业结果。

## 3. 新人递进课程架构

### Stage 0：传统测试入场门禁

- 功能/接口/自动化/性能/稳定性/安全的基本方法；
- 需求与技术文档解读、风险、Oracle、测试数据、执行证据；
- 不满足入场诊断的学员先走 TD-P/TD-PS 路径。

出口工件：一个传统系统的 Basis→Risk→Method→Oracle→Case→Result 追踪包。

### Stage 1：AI 与大模型基础

- AI→ML→DL→Transformer→Foundation Model→LLM→RAG→Agent 的发展与边界；
- training、fine-tuning、alignment、inference、serving、context、embedding、tool use；
- probabilistic behavior、non-determinism、version drift、data drift。

出口工件：组件图、数据/控制流、版本清单和“故障可能来自哪一层”的诊断表。

### Stage 2：Prompt 基础与 Prompt 测试

- 指令层级、角色、context、examples、constraint、structured output、tool call、refusal、truncation；
- 先定义 success criteria 和 eval，再迭代 Prompt；
- Prompt 不是修复所有问题的工具：数据、检索、模型、工具、权限和流程问题必须分流。

出口工件：versioned system/task/critic/repair prompts、input fixture、output schema、eval/mutation、model manifest、run receipt。

### Stage 3：AI 任务、数据与指标

- classification/regression/clustering/ranking/generation/multimodal 的任务差异；
- confusion matrix、F1、Recall@k、MRR/nDCG、ROUGE/BERTScore 的含义和误用；
- 数据采样、去重、slice、holdout、leakage、annotation、IAA 和 adjudication。

出口工件：Task Metric Decision Table、Annotation Guide、Dataset Card、Metric Cards、错误成本矩阵。

### Stage 4：LLM、RAG 与 Judge

- factuality、grounding、citation、instruction following、safety、refusal；
- corpus/chunk/embedding/retrieval/rerank/generation 分层评测；
- rule/code/reference/metamorphic/model/human grader 的组合；
- Judge 偏差、校准、抽检、abstain 和升级。

出口工件：RAG trace pack、Judge calibration set、position-swap result、human disagreement ledger。

### Stage 5：Agent、Workflow 与安全

- result/step/trajectory/tool/handoff/termination；
- prompt injection、data leakage、excessive agency、memory、tenant isolation；
- fixed workflow、single agent、orchestrator-worker、multi-agent 的适用与公平对照。

出口工件：agent state machine、tool policy、side-effect ledger、safety eval、recovery receipt。

### Stage 6：Serving 与 Agent 压测

- request 与 task 的计量差异；
- TTFT/TPOT/ITL/latency/token throughput/QPS/goodput/resource/cost；
- open/closed workload、ramp/steady/soak/stress/fault/recovery；
- queue、GPU/KV cache、tool bottleneck、retry amplification、degradation。

出口工件：Workload Manifest、Metric Tree、capacity curve、fault matrix、safe operating envelope。

### Stage 7：AI 辅助测试全流程提效

- AI 消费受控 Basis，生成候选策略/用例/数据/代码；
- API/Web/Cypress/Playwright/Mobile adapters；
- compile/run、mutation、flake、review、accepted artifact、defect yield；
- baseline/control 与统计分析，拒绝营销式“提效倍数”。

出口工件：Productivity Experiment Manifest、全链 trace、baseline vs AI 报告、人审和成本收据。

### Stage 8：Skill、MCP 与飞书协同工程

- Skill capability contract、registry、exact ID、trigger、schema、owner、version、side-effect policy；
- MCP list/call/error/transport/auth/roots/timeouts/idempotency/collision/security/conformance；
- 飞书 MCP 将报告、文档、表格、任务/审批与消息接入质量流程；
- 脱敏、tenant/app scope、幂等回写、限流、审计和失败恢复。

出口工件：Capability Registry、MCP conformance suite、Feishu adapter、审批/回写 0→1→0 fixture。

### Stage 9：Benchmark、质量平台与 Capstone

- HELM/OpenCompass/C-Eval/GAIA/MLPerf 的目标和边界；
- 公共 benchmark 与企业 dataset/风险/SLO 的迁移；
- lineage、trace-to-regression、canary、waiver、rollback、incident；
- 完整交付一个 fixture release candidate，并列出进入 model/integration/practitioner/production 的缺证。

## 4. AI 生成测试用例的专业方法

### 4.1 生成前输入

1. `Basis Manifest`：需求、技术设计、OpenAPI、数据/事件合同、风险、版本、authority；
2. `Requirement/Testability Contract`：actor、trigger、precondition、input、observable result、state、exceptions、NFR、unknown；
3. `Risk/Method Matrix`：失败模型、影响、测试层级、EP/BVA/decision table/state/scenario/property/fuzz/metamorphic；
4. `Independent Oracle Pack`：规则、reference、model-free state machine、ledger、human rubric；
5. `Environment/Data Contract`：fixture、account/role、time、seed、dependency、cleanup、privacy。

### 4.2 Prompt package

| Prompt | 职责 | 禁止事项 |
| --- | --- | --- |
| extractor | 从指定 locator 抽取 atomic claims、conflicts、unknowns | 不得裁定未声明的来源优先级 |
| planner | 将 risk 映射到方法、层级、数据、环境和 Oracle | 不得用“多写用例”替代风险覆盖 |
| generator | 输出 schema-conformant candidate cases/code/data | 不得自造接口、阈值、权限或 expected result |
| critic | 查 trace 缺口、弱 Oracle、重复用例、边界遗漏、过度声称 | 不得修改原始证据或自动批准 |
| repair | 只根据批准的 finding 修复候选并保留 ID/refs | 不得吞断言、跳过测试、放宽阈值 |
| evaluator | 对固定 gold/mutations 评分并产生 raw findings | 不得与 generator 共用未经校准的自评结论 |
| reporter | 汇总真实 run receipts、Unknown、blocked 和 action | 不得把 NOT_RUN、fixture 或 stale PASS 改写成完成 |

### 4.3 用例输出合同

每条用例至少有：`case_id`、`requirement_ids`、`risk_ids`、`method+rationale`、`preconditions`、`data`、`steps`、`expected_http/state/event/audit/UI`、`oracle_id`、`environment`、`negative/boundary/fault`、`stop_state`、`automation_adapter`、`evidence_paths`、`maturity`。

### 4.4 质量和提效验证

AI 生成结果不是以“生成数量”验收，而以：

- requirement/risk/trace closure；
- compile/import success；
- deterministic run and assertion quality；
- mutation kill 与 seeded defect detection；
- duplicate/low-value case rate；
- reviewer accepted/rejected/repair effort；
- flaky rate 与 maintenance cost；
- time-to-accepted-test、cost-per-accepted、cost-per-killed-mutation；
- unique defect yield、escaped defect、release decision impact；
- model/prompt/version change robustness。

提效实验必须有 baseline/control、同类任务分层、人员经验、统一完成定义、原始时间和质量数据、异常值规则、置信区间、版本和停止条件。METR 的反向结果说明：不能预设 AI 一定更快。

## 5. Agent 压测 SOP

### 5.1 Workload

- task taxonomy：简单问答、检索、工具读、工具写、多步审批、失败恢复；
- 风险 slice：权限、租户、金额、时限、长上下文、多工具、并发副作用；
- versioned distributions：input/output tokens、step count、tool latency/error、arrival/concurrency、think time；
- sealed validation set 与独立 fault set。

### 5.2 场景顺序

`probe → warmup → baseline → ramp → steady → stress → fault → recovery → soak → recheck`

任何权限或副作用控制未证明时，不得进入高并发写场景。

### 5.3 指标树

- Outcome：task success、safe refusal、human handoff、duplicate/invalid side effects；
- Experience：E2E p50/p95/p99、TTFT、time-to-first-action、time-to-resolution；
- Trajectory：steps/task、tool calls/task、retries、loop/timeout/termination；
- Component：model、queue、retrieval、tool latency/error、worker saturation；
- Resource/Economic：CPU/GPU/memory/network、tokens、cost/task、cost/success；
- Reliability/Safety：error budget、degradation rate、recovery time、idempotency violation、cross-tenant violation。

容量结论写成：在 `workload W + environment E + safety policy P + SLO S` 下，可持续完成的 `safe successful tasks/time` 区间。禁止只报最大 QPS。

### 5.4 Fault matrix

至少覆盖 429/5xx/timeout、slow tool、schema drift、partial result、stale credential、model fallback、retrieval empty/poisoned、queue backlog、duplicate delivery、worker crash、network partition、approval unavailable、trace loss。每个 fault 有注入点、预期传播、stop/degrade/retry、恢复 Oracle 和 cleanup。

### 5.5 Agent 评估架构 D0-D7

| 域 | 控制问题 | 最小工件 |
| --- | --- | --- |
| D0 Evaluation trust | 评估器是否可靠且测到了目标构念？ | Judge Card、Gold/IAA、bias/position、abstain、human sentinel、version bridge |
| D1 Single-agent capability | 结果、步骤、工具、状态和终止是否正确？ | task/trajectory/effect oracle、negative/boundary set |
| D2 Orchestration/collaboration | 路由、交接、上下文压缩和级联是否安全？ | Handoff Contract、fact-survival mutation、cascade circuit receipt |
| D3 Human interaction/control | 人能否中断、接管、确认、取消并从 dirty state 恢复？ | Human Control state machine、approval usability/confirmation-fatigue test |
| D4 Robustness/reliability | 峰值能力、重复可靠性、长时程和恢复是否分开测量？ | Pass@1/PassAllK、horizon/survival、checkpoint/recovery、cluster-aware CI |
| D5 Security | 目标劫持、工具/身份/供应链/记忆/通信/代码执行/爆炸半径如何受控？ | threat model、signed manifest、delegation/effect ledger、sandbox/kill-switch suite |
| D6 Efficiency/economics | 成功、尾延迟、重尾成本和预算终止如何联合判断？ | cost/success、p95/p99/max、budget-stop、workload/environment bindings |
| D7 Business/governance | 业务后果、四维版本、审计、风险接受和法规如何留证？ | model/prompt/tool/memory version、risk acceptance、legal `checked_at`、audit chain |

`pass^k/PassAllK` 必须与 `pass@k` 分开定义。重复运行应声明 task/session/trajectory 单位、状态重置、依赖结构、k、config 和区间方法；同一任务的多次运行不能默认当作独立 Bernoulli 样本。

### 5.6 四环运行合同

1. Offline CI：确定性规则、schema、fixture、mutation 和高风险 blocker；
2. Sandbox replay：冻结外部响应/时间/索引或声明 behavioral replay，验证副作用和恢复；
3. Shadow/canary：代表性采样、无副作用/受限副作用、对照、升降级和回滚；
4. Online continuous evaluation：漂移、incident、human feedback、成本和安全 sentinel。

每环必须记录 `entry_criteria`、`exit_criteria`、`hard_blockers`、`statistical_evidence`、`sampling_bias`、`owner`、`timeout`、`rollback+hysteresis`、`retention`。环的分钟、小时、天数和采样比例都不是通用常数。

### 5.7 重放、隐私与自主边界

Trace 至少绑定 provider/endpoint/region、model/prompt/rubric、tools/manifest、memory、corpus/index、policy、identity/delegation、environment、cache/retry/cancel、parent/child run、timestamps 和 raw hashes。完整 Prompt/工具结果可能含 PII/secret，必须字段级脱敏、加密、RBAC 和 retention；hash 需配签名 manifest/attestation 才能证明来源。

每个可行动 Agent 还要有 `Autonomy Envelope`：max steps/time/tokens/money、允许/禁止副作用、审批点、idempotency、checkpoint、cancel、safe terminal、kill switch、quota 和 residual-risk owner。

## 6. Skill 与 MCP 根治协议

### 6.1 稳定核心与 adapter

```text
Professional Method Core
  ├─ Source/Authority/Trace
  ├─ Metric/Oracle/Prompt/Eval/Mutation contracts
  ├─ Capability Registry and Policy Graph
  ├─ Run Receipt and Maturity State
  └─ Conflict/Change/Publication Gates
       ├─ Playwright adapter
       ├─ Cypress adapter
       ├─ API contract/fuzz adapter
       ├─ Model/RAG/Agent adapter
       ├─ MCP server/client adapter
       └─ Feishu collaboration adapter
```

### 6.2 Skill 冲突类型

| 冲突 | 例子 | 强制解决 |
| --- | --- | --- |
| name/trigger | 两个 Skill 都响应“生成用例” | namespace + exact ID + trigger priority + owner |
| schema/semantic | 字段同名但单位或状态不同 | schema version + semantic contract + compatibility test |
| resource/output | 同时写同一报告或 fixture | write scope + lock/transaction + artifact owner |
| authority | 一个按 PRD，一个按实现默认裁决 | authority manifest；歧义 `BLOCKED` |
| side effect | 两个工具都可能发消息/建任务/改数据 | permission + idempotency key + approval + effect ledger |
| dependency/version | MCP/tool/model 升级改变行为 | exact pin + compatibility matrix + shadow eval |
| maturity/status | fixture PASS 被别的 Skill 写成 live PASS | monotonic state machine + evidence receipt + supersession |

### 6.3 向量化解耦

embedding/vector index 只保存 `capability description、examples、tags、knowledge chunks` 并返回候选。实际执行必须由：

`exact capability_id → version → dependency graph → allowed inputs → owner → permission → side-effect class → output contract → gates`

决定。若只凭语义相似自动激活 Skill，必须在测试中植入近义但权限不同的负例并使其失败。

### 6.4 MCP conformance

- discovery/list：schema、description、unique/disambiguated names、version；
- call：valid/invalid args、structured error、timeout/cancel、retry/idempotency；
- auth/scope：least privilege、tenant/user/app boundary、secret handling；
- roots/resources：path traversal、unsupported root、read/write boundary；
- transport：stdio/HTTP lifecycle、reconnect、partial frame、concurrency；
- security：prompt/tool injection、untrusted output、exfiltration、unsafe side effect；
- observability：correlation ID、raw request/result hash、effect/audit receipt；
- cross-client：至少两个 client adapter 或一个标准 fixture + contract runner。

### 6.5 飞书 MCP 协同 adapter

目标是让质量证据进入协作流程，而不是展示“AI 会发消息”：

1. 从受控报告读取 summary/findings/evidence links；
2. 脱敏和字段 allowlist；
3. 按 app/user/tenant scope 执行消息、文档、表格、任务或审批动作；
4. 使用 correlation/idempotency key 防止重复消息、任务和审批；
5. 回读目标对象确认当前版本和链接；
6. 记录 actor、tool、scope、request/result hash、object ID、timestamp、retry、final status；
7. 权限不足、限流、部分成功、回写失败、审批超时必须进入明确状态；
8. 飞书结果不能自动改变测试/发布 verdict，只有具名人类批准可改变决策。

## 7. API 巡检规则系统

规则分九类：

1. Spec/schema：OpenAPI 可解析、版本、required/type/format/enum、错误响应；
2. AuthN/AuthZ：对象级、属性级、功能级、租户和角色边界；
3. Business flow：状态、金额、时序、审批、补偿、重复请求；
4. Data/property：边界、组合、property/metamorphic、fuzz、encoding；
5. Reliability：timeout、retry、rate limit、circuit、idempotency、eventual consistency；
6. Resource/performance：payload、pagination、batch、QPS、tail latency、resource exhaustion；
7. Dependency/security：SSRF、unsafe API consumption、secret/PII、injection；
8. Change/inventory：shadow/unused endpoint、version diff、consumer/provider compatibility；
9. Evidence/operations：correlation、trace、audit、alert、runbook、rollback。

每条 rule 有 ID、风险、适用 selector、输入、执行 adapter、Oracle、severity、owner、waiver、evidence 和 remediation。工具可由 Schemathesis/Pact/Playwright/Cypress/自研 runner 适配，但规则语义不绑定品牌。

## 8. AI 味与内容质量评测

### 8.1 可落地的质量 rubric

- source fidelity：关键 claim 有来源且可定位；
- specificity：有真实对象、条件、单位、数字、路径、命令和失败动作；
- domain method：风险、方法、Oracle 和 trade-off 专业正确；
- executability：命令、输入、cwd、预期退出、产物可重放；
- non-redundancy：跨页模板句、同义反复和泛化标题受控；
- uncertainty：Evidence/Inference/Unknown 分开，不伪造 owner/阈值/运行；
- counterexample：有负例、反证、mutation 和失败诊断；
- human value：帮助学习者作决定和迁移，而不只是“解释概念”。

### 8.2 不可使用的判定

不得用单一 AI detector、困惑度或“像不像 AI”作为作者身份、抄袭、诚信或发布阻断的唯一证据。检测器可作为抽样信号，但最终 finding 必须指向具体可观察缺陷。

## 9. Benchmark 横评合同

横评必须固定并公开：model/provider/version、prompt/system template、generation config、tool access、dataset/split/hash、harness/scorer version、seed/repeats、hardware/region、cost、raw outputs、failure/abstain、confidence interval、contamination note。

公共 benchmark 的建议组合：

- HELM：透明场景/指标结构，注意当前维护状态；
- OpenCompass：配置→推理→评测→可视化 adapter；
- C-Eval：中文知识能力示例；
- GAIA：通用助手、多步工具/浏览类示例；
- MLPerf：系统推理性能与规则化场景；
- CAIA：仅在确认 crypto-agent 场景时使用，不能命名为“通用 CAIA”。

企业 benchmark 另加：真实业务风险、用户/语言/权限 slice、历史 incident、sealed holdout、人工 owner、SLO/cost、release/rollback action。公共领先不自动通过企业 Gate。

## 10. Factory 应强制生成和验证的工件

每个专业主题至少：

1. Source/Authority Manifest；
2. Controlling Question 和 Evidence/Inference/Unknown；
3. Capability Contract（entry、method、artifact、transfer）；
4. Metric Cards 与 business/risk link；
5. Prompt Package + model/config manifest；
6. Eval Set（positive/negative/boundary/conflict/missing/refusal/truncation/variant）；
7. Mutation/Fault Manifest；
8. Independent Oracle Pack；
9. Trace Graph `source→claim→risk→method→metric/oracle→case→result→decision`；
10. Run Receipt（exact command/cwd/hash/version/raw result/exit）；
11. Human Review/Owner/Approval；
12. Maturity Boundary 与 supersession。

新增全局合同：`MetricCard`、`AnnotationPackage`、`ProductivityExperiment`、`CapabilityRegistry`、`SkillConflictManifest`、`MCPConformanceManifest`、`FeishuAdapterReceipt`、`HorizontalBenchmarkManifest`、`ContentQualityRubric`。

本轮专家文档再新增：`CapabilityEvidenceProfile`、`OrganizationLevelAdapter`、`LearnerRouteProfile`、`ProjectRiskProfile`、`JudgeCard`、`AgentEvaluationArchitecture`、`HandoffContract`、`HumanControlContract`、`AutonomyEnvelope`、`RingGateManifest`、`RiskAcceptanceRecord`、`SignedToolManifest`、`LegalFreshnessRecord`。

## 11. Fail-closed 门禁

- 指标无业务决策、slice、阈值 owner 或失败动作：`BLOCKED-METRIC`；
- 数据无 lineage/label schema/holdout 或高风险标注未裁决：`BLOCKED-DATA`；
- Prompt 无 eval/mutation/model version：`BLOCKED-PROMPT`；
- Judge 未校准或同一模型自批 blocker：`BLOCKED-ORACLE`；
- Skill/MCP 名称、权限、schema、版本或副作用冲突未关闭：`BLOCKED-CAPABILITY-CONFLICT`；
- 飞书动作无 scope、脱敏、幂等和回读收据：`BLOCKED-COLLABORATION`；
- 提效无 baseline/control 或只测速度不测质量：`BLOCKED-PRODUCTIVITY-CLAIM`；
- Benchmark 缺版本/harness/raw output/limitations：`BLOCKED-BENCHMARK`；
- AI 味 finding 只有 detector 分数、没有具体缺陷：`BLOCKED-EDITORIAL-FINDING`；
- fixture/NOT_RUN 被写成 model/live/practitioner/production：`BLOCKED-MATURITY-OVERCLAIM`。
- 用年限/P-band/分享数/覆盖率固定值推断通用能力：`BLOCKED-CAPABILITY-EVIDENCE`；
- Judge 无构念、校准、偏差、abstain、版本桥接或人工 sentinel：`BLOCKED-EVALUATOR-TRUST`；
- `pass^k` 与 `pass@k` 混用、重复样本独立性/CI/单位不明：`BLOCKED-RELIABILITY-METHOD`；
- 多 Agent 交接无 schema/authority/fact-survival/cascade stop：`BLOCKED-HANDOFF`；
- 可行动 Agent 无 interrupt/takeover/cancel/rollback 或自主预算：`BLOCKED-HUMAN-CONTROL`；
- 法规无 jurisdiction/statute/version/checked_at/legal owner：`BLOCKED-LEGAL-FRESHNESS`。

## 12. 完成定义

当且仅当以下全部满足，才可说 Skill 已具备生成专业课程的能力：

- 上述新 Schema 和状态在 canonical Skill 中实现并回归；
- 每类合同有正例、负例、冲突、缺失、拒答、截断和 mutation RED→GREEN；
- 课程页面只能消费 exact-ID promotion receipt；
- 新基础单元和端到端单元实际由 Skill 生成，而不是人工绕过工厂补文案；
- fresh unzip 能重放 fixture，产生 raw receipt；
- validator 能阻断指标误用、自评 Judge、假提效、Skill 冲突、未授权飞书副作用和 benchmark 过度声称；
- editorial、executability、trace、material closure 和 scope integrity 均为 fresh PASS；
- 未运行的 model/integration/practitioner/production 仍明确 `NOT_RUN/UNKNOWN`。

这一定义只产生高质量 **fixture-ready professional course**。真实模型、企业工具、飞书租户、从业者和生产结论仍必须在对应 lane 另行验证。
