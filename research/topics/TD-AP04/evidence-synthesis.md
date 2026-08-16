# TD-AP04 证据综合：开放与封闭负载模型

## Fact

Opened load-model references distinguish open arrival from closed concurrency and document coordinated-omission risks; they do not choose an organizational load profile.

## Evidence

- 闭环下一次迭代依赖上一次完成；开环到达独立于完成时长。
- 固定到达率执行器可以减少系统变慢导致的流量自动下降。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- 容量边界用开环更直接，固定用户体验用闭环；两者应以相同任务分布交叉验证。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 真实用户 think time、流量突发与发压端自身资源上限。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Cross-source synthesis

Run A defines open/closed workload semantics and Run B demonstrates misleading measurements; the page compares both models against the same task oracle.

实际练习先固定任务集合与终态，再只切换 arrival scheduler 或 concurrency executor；offered rate、achieved rate、queue 和 p99 分开保存。独立 Oracle 只判断任务是否在截止时间内完成及证据是否完整，避免把负载工具的 summary 当作业务真值。fault 隐藏排队样本时必须红灯，repair 恢复采集而非删除等待。

## Cross-source synthesis（learner decision record）

学员先冻结相同任务集合，再切换 open/closed 调度器；只有同时保存 offered rate、achieved rate、queue、p99 和 task oracle，比较才可解释。该记录不输出目标系统容量。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。
