# TD-AP08 证据综合：SLO、告警与事故证据

## Fact

Opened SLO references define good events, error budgets and multi-window alerting; they do not set an organization’s SLO or on-call authority.

## Evidence

- SLO 需从用户可见结果定义 SLI 与目标；多窗口 burn-rate 告警兼顾快慢燃烧。
- Golden Signals 说明服务健康，但不能单独证明 Agent 业务正确。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- good task 应同时满足允许终态、时延、重试/成本与副作用安全，高风险切片单独治理。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 组织错误预算、值班责任、业务影响等级、恢复审批和合规保留期。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Cross-source synthesis

Run A supplies SLO and burn-rate definitions and Run B supplies alert/incident failure cases; the page binds thresholds to owners and recovery actions without asserting organizational policy.

练习以 good task 为 numerator，以合约定义的 eligible task 为 denominator，并保存窗口、burn-rate、owner、止血动作、恢复证据和事故样例回流。独立 Oracle 从原始任务事件重算 SLI，不能使用告警组件自己的 verdict。fault 删除 owner 或 good-task 证据时必须阻断；repair 恢复闭环但不降低阈值。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。
