# TD-AP07 证据综合：长稳、资源漂移与泄漏

## Fact

Opened operations references describe soak windows, resource trends and leak investigation; they do not prove long-run stability of a real provider.

## Evidence

- tracemalloc 能比较内存分配快照；单个终点值不能证明泄漏。
- 真实推理服务 issue 显示长时间缓存增长需按版本、任务类型和缓存配置复现。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- 长稳门禁应结合斜率、平台期、cleanup、吞吐和尾延迟，并用 baseline/fault/repair 比较。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 生产 GC、GPU allocator、缓存淘汰、驱动版本和业务季节性。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Cross-source synthesis

Run A supplies soak and resource measurement definitions and Run B supplies leak and recovery counterexamples; the page compares windows and snapshots rather than one summary number.

长稳实验固定 warmup、steady、recovery 三个窗口，逐窗口记录资源斜率、平台期、cleanup 差分、尾延迟和错误重试。独立 Oracle 对快照与窗口完整性做判断，不把一次短跑的平均值当作稳定性。fault 缺 recovery 或资源不释放时必须保持红灯，repair 关闭资源并重新跑完整窗口。

## Cross-source synthesis（learner decision record）

学员将 warmup、steady、recovery 三个窗口与资源快照、cleanup 差分、p99 和错误切片绑定，并由独立 Oracle 检查窗口完整性；短跑绿灯不能替代长稳证据。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。
