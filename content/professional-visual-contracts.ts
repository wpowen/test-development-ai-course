// 生成产物，请勿手改。
// Source: scripts/build-professional-visuals.mjs

export type ProfessionalVisualContract = {
  src: string;
  alt: string;
  kind: "flow" | "architecture" | "decision" | "state" | "sequence" | "metric" | "career" | "evidence";
};

export const professionalVisualContracts: Record<string, ProfessionalVisualContract> = {
  "TD-A02": { src: "visuals/course/TD-A02.svg", alt: "AI API 协议：Streaming、Structured、Tool 与 Async的state-machine：展示请求、SSE reducer、Schema+语义、Tool 权限/幂等、Async 状态机之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-W02": { src: "visuals/course/TD-W02.svg", alt: "Workflow 状态、循环、重试、Handoff 与终止条件的state-machine：展示Workflow state、Checkpoint、Queue delivery、Idempotent worker、Budget guard之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-T12": { src: "visuals/course/TD-T12.svg", alt: "RAG 端到端门禁：无答案与权限的state-machine：展示Versioned corpus、Tenant ACL、Retriever/no-result、Generator、Faithfulness·Citation之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-PS10": { src: "visuals/course/TD-PS10.svg", alt: "稳定性：超时、重试预算、熔断、限流与降级的state-machine：展示实验授权/隔离命名空间、注入器、模型/工具/检索依赖、Agent 重试与降级、订单 API/队列之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-QP04": { src: "visuals/course/TD-QP04.svg", alt: "跨系统事件总线：幂等、重放、脱敏通知与审计闭环的state-machine：展示Jira/GitLab/K8s 上游事件、Event Gateway/验签去重、Inbox/Outbox/DLQ、Quality Orchestrator/状态机、Jira/GitLab/K8s 适配器之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-X604": { src: "visuals/course/TD-X604.svg", alt: "模型路由、Fallback 与工具协议漂移测试的state-machine：展示请求合同、能力/区域/权限、Provider 路由、协议/Schema、Fallback 再授权之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-F04": { src: "visuals/course/TD-F04.svg", alt: "LLM、RAG、Agent 与 Workflow 的测试边界的layered-architecture：展示用户目标、检索·Context、模型决策、工具策略 Gate、Worker·队列之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T11": { src: "visuals/course/TD-T11.svg", alt: "Faithfulness 与 Citation 评估的layered-architecture：展示Retrieved Context、Generated answer、Atomic claims、Evidence spans、Faithfulness scorer之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T15": { src: "visuals/course/TD-T15.svg", alt: "Agent 结果、步骤与轨迹评估的layered-architecture：展示Business outcome、Tool step ledger、State snapshots、Trajectory graph、Policy blockers之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T21": { src: "visuals/course/TD-T21.svg", alt: "模型与评测 Lineage 追踪的layered-architecture：展示代码 Commit、Prompt/Input/Schema、Dataset/Split、Knowledge/Tool、Model/Runtime之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-AP03": { src: "visuals/course/TD-AP03.svg", alt: "Agent Trace 语义：Task Root 到 Tool Attempt的layered-architecture：展示invoke_agent root、queue.wait span、gen_ai generation span、execute_tool attempt span、task.finalize event之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T04": { src: "visuals/course/TD-T04.svg", alt: "重复运行、统计与结果分布的metric-experiment：展示版本化 cases、重复采样、Raw run ledger、独立 Scorer、Slice aggregation之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-T10": { src: "visuals/course/TD-T10.svg", alt: "检索评测：Recall、Ranking 与查询切片的metric-experiment：展示Query slices、Query rewrite、ACL/metadata filter、Retriever、Top-k ranking之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-B03": { src: "visuals/course/TD-B03.svg", alt: "Benchmark 指标：Accuracy、Pass@k、Resolved Rate 与置信区间的metric-experiment：展示逐题多次 Runs、Raw Ledger、确定性 Oracle、Judge/校准、Metric Calculator之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-AP02": { src: "visuals/course/TD-AP02.svg", alt: "Agent 性能指标树：TTFT、TPOT、Queue、Retry、Step的metric-experiment：展示计划到达时间、Queue wait、Prefill/TTFT、Decode/TPOT、Tool/Retry/Step之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-A03": { src: "visuals/course/TD-A03.svg", alt: "AI Serving 指标：TTFT、TPOT、ITL、Goodput 与单位成功成本的metric-experiment：展示到达、Queue、Prefill/首 Token、Decode/ITL、终态/质量之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-T23": { src: "visuals/course/TD-T23.svg", alt: "质量、延迟与成本联合门禁的metric-experiment：展示版本化 Workload、模型/路由候选、质量 Scorer、Trace/延迟分解、Token/成本账本之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-P01": { src: "visuals/course/TD-P01.svg", alt: "测试依据冻结：来源版本、权威与冲突门禁的decision-tree：展示PRD/技术方案、Basis Gate、需求契约、风险与 TestPackage、自动化执行之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-P04": { src: "visuals/course/TD-P04.svg", alt: "风险分析与测试层级策略的decision-tree：展示PRD/技术方案、Basis Gate、需求契约、风险与 TestPackage、自动化执行之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-T03": { src: "visuals/course/TD-T03.svg", alt: "Composite Oracle：规则、Judge 与人工评审组合的decision-tree：展示Eval case、Schema Gate、业务规则 Gate、权限·副作用 Gate、语义 Judge之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-T14": { src: "visuals/course/TD-T14.svg", alt: "LLM-as-Judge 校准与反例集的decision-tree：展示Double human labels、Blind pair shuffle、Versioned Judge、Bias probes、Disagreement matrix之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-X501": { src: "visuals/course/TD-X501.svg", alt: "多模态关系与独立 Oracle 评测的decision-tree：展示任务/模态合同、配对 Fixture、跨模态关系、独立 Oracle、矛盾注入之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-X805": { src: "visuals/course/TD-X805.svg", alt: "在线实验、Canary 与人工抽样发布门禁的decision-tree：展示假设/MDE、稳定分流、离线门禁、小流量 Canary、Guardrail/最坏切片之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-P08": { src: "visuals/course/TD-P08.svg", alt: "影响分析、回归选择与发布证据链的evidence-lineage：展示PRD/技术方案、Basis Gate、需求契约、风险与 TestPackage、自动化执行之间的数据、控制、证据和反馈关系。", kind: "evidence" },
  "TD-T22": { src: "visuals/course/TD-T22.svg", alt: "Trace-to-Regression：生产失败到回归用例的evidence-lineage：展示生产 Trace 隔离区、字段分类/脱敏、最小失败抽取、业务/安全 Oracle、Regression Dataset之间的数据、控制、证据和反馈关系。", kind: "evidence" },
  "TD-T25": { src: "visuals/course/TD-T25.svg", alt: "Capstone：AI Quality Fixture Release Candidate的evidence-lineage：展示PRD/Risk/Owner、Dataset/Split/Trace、Prompt/Input/Schema、Composite Oracle、Benchmark/CI之间的数据、控制、证据和反馈关系。", kind: "evidence" },
  "TD-QP02": { src: "visuals/course/TD-QP02.svg", alt: "GitLab MR、Pipeline 与证据 SHA 绑定的evidence-lineage：展示GitLab MR/当前 HEAD、Project Webhook/Inbox、Pipeline 与 Jobs、JUnit/Artifact Store、确定性聚合器之间的数据、控制、证据和反馈关系。", kind: "evidence" },
};
