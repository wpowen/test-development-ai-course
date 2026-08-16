# TD-AP01 证据综合：工作负载模型与任务口径

## Fact

Fact claims are limited to opened source definitions and implementation references; they define workload semantics and metric boundaries, but do not establish production capacity.

## Evidence

- 开环到达率与闭环并发回答不同问题，闭环会把响应变慢反馈成较低到达率。
- 用户任务、Agent run、模型调用和工具调用是不同分母。
- 已打开 15 个来源；官方定义、实现参考、SRE 机制、失败 issue 与学习供给分别保留 publisher、family、lane 和限制。

## Inference

- 工作负载必须按 task_type、token bucket、tool path、risk slice 和 allowed terminal state 建联合分布。
- 本课程将这些机制映射为确定性 simulator gate；这是一种教学实现选择，不是来源直接给出的统一标准。

## Unknown

- 目标系统真实峰值流量、未来任务组合与生产工具失败分布。
- 未运行真实模型/工具、未做企业环境集成、未做从业者评审，状态不得高于 fixture-tested。

## Counterevidence

- vLLM 的资源增长 issue 只是一条具体环境报告，提醒需要 soak 与版本固定；不能据此断言所有推理服务泄漏。
- OpenTelemetry Agent grouping issue 说明标准仍有缺口；因此课程锁定 schema version 并将本地字段放入 app namespace。
- synthetic 0/1/0 只能证明故障可被本地 gate 检出并在修复参数下恢复，不能推导生产容量。

## Cross-source synthesis

Run A supplies computable workload definitions; Run B supplies failure modes and operational counterexamples. The blueprint keeps task, step, tool, retry and terminal-state evidence separate and consumes both runs without inventing a universal threshold.

该裁决具体落到 learner 的 evidence card：先写任务分母与允许终态，再记录到达模型、工具路径、重试预算和 trace 关联。独立 Oracle 只读取输入、期望终态和风险规则，不读取 evaluator 的结论；因此 fault 即使伪造入口成功，也会因任务切片或业务终态缺失而被拒绝。这个教学选择适用于离线夹具，不代表任何供应商或组织的容量合同。
