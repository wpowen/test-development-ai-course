# TD-AP03 证据综合：Trace 语义与因果证据

## Fact

Opened sources define trace and GenAI span relationships; they do not prove that any provider emits complete task-rooted evidence by default.

## Evidence

- Span 表示有时长的操作并通过 parent/span context 组成 Trace。
- GenAI Agent 语义约定仍处于 Development，必须锁定 schema/version。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- 应用字段应使用自有命名空间补齐 task、attempt、budget 和 business oracle，不能伪造标准 gen_ai 字段。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 目标遥测后端采样、保留期、PII 分类和访问审计策略。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Cross-source synthesis

Run A defines span relationships and Run B exposes missing or ambiguous grouping; the page therefore versions its schema and tests trace closure explicitly.

页面把一次用户任务固定为 root，并要求 generation、tool、attempt、handoff、finalize 能回到同一个 root；缺 parent、错误工具或脱敏失败都属于阻断证据。独立 Oracle 依据输入任务和允许路径检查 closure，不使用 trace evaluator 自己生成的 verdict。这样学员能区分“没有采集到”与“采集到了但失败”，而不是用最终文本掩盖审计缺口。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。
