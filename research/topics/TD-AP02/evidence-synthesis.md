# TD-AP02 证据综合：TTFT、TPOT、Queue、Retry 与 Step 指标树

## Fact

Opened sources define queue, time-to-first-token, generation and task-level metric semantics; they do not establish a target system capacity number.

## Evidence

- TTFT、TPOT/ITL、E2E 描述不同等待阶段，输入输出 token 长度会改变解释。
- 直方图可聚合分位数；平均值不能代表尾延迟。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- Agent 指标树还需要 queue、retry、step、task success 与 goodput，且每个比率必须标明分母。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 目标业务各切片可接受阈值和观测成本。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Cross-source synthesis

Run A supplies metric semantics and Run B supplies failure cases; the page joins them in a metric tree while preserving task-level denominators and tail behavior.

指标树的落地顺序是 task success → queue → TTFT/TPOT → tool/retry → goodput；每层都必须注明分母、切片、聚合、测量点和失败动作。独立 Oracle 从原始事件重算关键分子，不能把模型输出或报告摘要当作真值。fault 删除字段时，红灯应解释为证据不完整而不是“性能变差”，repair 则补回合同并保持阈值不变。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。
