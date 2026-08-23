// 生成产物，请勿手改。
// Source: scripts/build-professional-visuals.mjs

export type ProfessionalVisualContract = {
  src: string;
  alt: string;
  kind: "flow" | "architecture" | "decision" | "state" | "sequence" | "metric" | "career" | "evidence";
};

export const professionalVisualContracts: Record<string, ProfessionalVisualContract> = {
  "TD-A02": { src: "visuals/course/TD-A02.svg", alt: "AI 接口边生成边返回，还会调用工具，自动化测试怎么写的state-machine：展示请求、SSE reducer、Schema+语义、Tool 权限/幂等、Async 状态机之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-W02": { src: "visuals/course/TD-W02.svg", alt: "AI 长流程为什么会丢状态、重复执行或一直不结束的state-machine：展示Workflow state、Checkpoint、Queue delivery、Idempotent worker、Budget guard之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-T12": { src: "visuals/course/TD-T12.svg", alt: "RAG 上线前，哪些检索、拒答和权限问题必须拦住的state-machine：展示Versioned corpus、Tenant ACL、Retriever/no-result、Generator、Faithfulness·Citation之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-PS10": { src: "visuals/course/TD-PS10.svg", alt: "服务超时或流量过载时，怎样降级才不会扩大故障的state-machine：展示实验授权/隔离命名空间、注入器、模型/工具/检索依赖、Agent 重试与降级、订单 API/队列之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-QP04": { src: "visuals/course/TD-QP04.svg", alt: "把需求、代码流水线和测试环境串成一条证据记录的state-machine：展示Jira/GitLab/K8s 上游事件、Event Gateway/验签去重、Inbox/Outbox/DLQ、Quality Orchestrator/状态机、Jira/GitLab/K8s 适配器之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-X604": { src: "visuals/course/TD-X604.svg", alt: "切换模型或工具后，哪些功能和安全行为必须重新测试的state-machine：展示请求合同、能力/区域/权限、Provider 路由、协议/Schema、Fallback 再授权之间的数据、控制、证据和反馈关系。", kind: "state" },
  "TD-F04": { src: "visuals/course/TD-F04.svg", alt: "AI 应用只是回答问题，还是会查资料、调工具和改状态的layered-architecture：展示用户目标、检索·Context、模型决策、工具策略 Gate、Worker·队列之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T11": { src: "visuals/course/TD-T11.svg", alt: "AI 回答带了引用，怎样判断引用真的支持答案的layered-architecture：展示Retrieved Context、Generated answer、Atomic claims、Evidence spans、Faithfulness scorer之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T15": { src: "visuals/course/TD-T15.svg", alt: "Agent 最终答对了，为什么执行过程仍可能不安全的layered-architecture：展示Business outcome、Tool step ledger、State snapshots、Trajectory graph、Policy blockers之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T21": { src: "visuals/course/TD-T21.svg", alt: "一次 AI 评测要记录哪些版本，才能复现历史结果的layered-architecture：展示代码 Commit、Prompt/Input/Schema、Dataset/Split、Knowledge/Tool、Model/Runtime之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-AP03": { src: "visuals/course/TD-AP03.svg", alt: "记录 Agent 每一步，定位慢点和最早失败的layered-architecture：展示invoke_agent root、queue.wait span、gen_ai generation span、execute_tool attempt span、task.finalize event之间的数据、控制、证据和反馈关系。", kind: "architecture" },
  "TD-T04": { src: "visuals/course/TD-T04.svg", alt: "一次评测结果不稳定，重复几次后应该怎样下结论的metric-experiment：展示版本化 cases、重复采样、Raw run ledger、独立 Scorer、Slice aggregation之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-T10": { src: "visuals/course/TD-T10.svg", alt: "知识库里明明有答案，RAG 为什么还是搜不到的metric-experiment：展示Query slices、Query rewrite、ACL/metadata filter、Retriever、Top-k ranking之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-B03": { src: "visuals/course/TD-B03.svg", alt: "AI 评测分数怎么计算，样本少时结果能信吗的metric-experiment：展示逐题多次 Runs、Raw Ledger、确定性 Oracle、Judge/校准、Metric Calculator之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-AP02": { src: "visuals/course/TD-AP02.svg", alt: "用户等 Agent 太久：把排队、模型、工具和重试耗时拆开的metric-experiment：展示计划到达时间、Queue wait、Prefill/TTFT、Decode/TPOT、Tool/Retry/Step之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-A03": { src: "visuals/course/TD-A03.svg", alt: "AI 服务快不快、能处理多少请求、花多少钱，应该看哪些指标的metric-experiment：展示到达、Queue、Prefill/首 Token、Decode/ITL、终态/质量之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-T23": { src: "visuals/course/TD-T23.svg", alt: "质量更好但更慢更贵时，这个 AI 版本到底能不能发的metric-experiment：展示版本化 Workload、模型/路由候选、质量 Scorer、Trace/延迟分解、Token/成本账本之间的数据、控制、证据和反馈关系。", kind: "metric" },
  "TD-P01": { src: "visuals/course/TD-P01.svg", alt: "PRD、技术方案和接口文档说法不一致时，测试应该信谁的decision-tree：展示PRD/技术方案、Basis Gate、需求契约、风险与 TestPackage、自动化执行之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-P04": { src: "visuals/course/TD-P04.svg", alt: "项目时间有限时，单元、接口和 E2E 测试应该怎么分配的decision-tree：展示PRD/技术方案、Basis Gate、需求契约、风险与 TestPackage、自动化执行之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-T03": { src: "visuals/course/TD-T03.svg", alt: "AI 答案没有标准答案时，怎样判断它到底对不对的decision-tree：展示Eval case、Schema Gate、业务规则 Gate、权限·副作用 Gate、语义 Judge之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-T14": { src: "visuals/course/TD-T14.svg", alt: "用另一个模型给答案打分靠谱吗，什么时候必须人工复核的decision-tree：展示Double human labels、Blind pair shuffle、Versioned Judge、Bias probes、Disagreement matrix之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-X501": { src: "visuals/course/TD-X501.svg", alt: "AI 同时看图和文字：重点检查图文矛盾和理解错误的decision-tree：展示任务/模态合同、配对 Fixture、跨模态关系、独立 Oracle、矛盾注入之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-X805": { src: "visuals/course/TD-X805.svg", alt: "AI 新版本从离线测试到小流量上线的decision-tree：展示假设/MDE、稳定分流、离线门禁、小流量 Canary、Guardrail/最坏切片之间的数据、控制、证据和反馈关系。", kind: "decision" },
  "TD-P08": { src: "visuals/course/TD-P08.svg", alt: "需求变更后的回归选择：该重跑什么，什么时候能发布的evidence-lineage：展示PRD/技术方案、Basis Gate、需求契约、风险与 TestPackage、自动化执行之间的数据、控制、证据和反馈关系。", kind: "evidence" },
  "TD-T22": { src: "visuals/course/TD-T22.svg", alt: "把线上出现过的 AI 故障变成自动回归用例的evidence-lineage：展示生产 Trace 隔离区、字段分类/脱敏、最小失败抽取、业务/安全 Oracle、Regression Dataset之间的数据、控制、证据和反馈关系。", kind: "evidence" },
  "TD-T25": { src: "visuals/course/TD-T25.svg", alt: "AI 版本发布前的质量报告应该写什么的evidence-lineage：展示PRD/Risk/Owner、Dataset/Split/Trace、Prompt/Input/Schema、Composite Oracle、Benchmark/CI之间的数据、控制、证据和反馈关系。", kind: "evidence" },
  "TD-QP02": { src: "visuals/course/TD-QP02.svg", alt: "代码已经更新，为什么测试报告可能还是旧版本的的evidence-lineage：展示GitLab MR/当前 HEAD、Project Webhook/Inbox、Pipeline 与 Jobs、JUnit/Artifact Store、确定性聚合器之间的数据、控制、证据和反馈关系。", kind: "evidence" },
};
