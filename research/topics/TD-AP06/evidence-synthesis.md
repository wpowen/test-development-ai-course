# TD-AP06 证据综合：超时、重试与安全降级

## Fact

Opened reliability references describe deadlines, retries and backoff; they do not authorize a production retry budget or a write-side effect.

## Evidence

- 重试会放大依赖负载，退避和 jitter 只能缓解，仍需总预算。
- 级联故障处理强调负载削减、队列控制和避免无界重试。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- Agent 需跨 gateway、SDK、orchestrator、tool 统一 attempts 与 deadline，并为写操作定义只读或人工终态。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 各外部依赖的 retryable 语义、Retry-After、幂等保证和业务补偿责任。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Cross-source synthesis

Run A supplies deadline and backoff semantics and Run B supplies retry-storm failure evidence; the page joins them into a bounded, side-effect-aware policy.

练习把 deadline 和 attempt budget 从 gateway 传到 SDK、Agent 与 tool，并为读、写、人工升级和对账定义不同终态。独立 Oracle 检查尝试次数、幂等键和副作用类别，不接受“最终文本说成功”作为写操作证据。fault 的 retry storm 或 unsafe write 必须退出 1，repair 只能恢复预算与安全终态。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。
