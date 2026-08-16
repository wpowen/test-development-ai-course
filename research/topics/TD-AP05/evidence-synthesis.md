# TD-AP05 证据综合：容量曲线与瓶颈归因

## Fact

Opened sources define saturation, queueing and bottleneck observations; they do not establish production thresholds for the synthetic Agent.

## Evidence

- 饱和与排队是过载的重要信号，吞吐必须与延迟和错误一起解释。
- 模型服务公开 queue、TTFT、ITL、KV cache 等内部指标用于诊断。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- 只报告最大吞吐会掩盖质量与尾延迟，应报告 goodput 和第一个门禁失效阶梯。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 生产硬件、配额、模型、网络、工具与流量分布；synthetic 结果不能外推。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Cross-source synthesis

Run A supplies saturation metrics and Run B supplies operational bottleneck examples; the page uses controlled step-load mutations and refuses to infer a production limit.

阶梯实验每次只改变一个负载变量，并保存第一个失效级别、goodput、queue、prefill、decode、tool 和 retry 切片。独立 Oracle 根据预先冻结的 gate 和风险分母判断“是否失效”，不允许通过移动阈值让曲线变绿。learner 交付的是可解释的 synthetic capacity curve 与下一步实测计划，而不是对生产容量的承诺。

## Cross-source synthesis（learner decision record）

学员先冻结阶梯步长和 gate，再记录每一级的 queue、goodput 与瓶颈切片；首个失效点必须可由独立 Oracle 重算。该记录只支持 synthetic capacity curve，不支持生产容量承诺。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。
