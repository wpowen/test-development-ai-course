# TD-AP01 研究简报：工作负载模型与任务口径

## 决策问题

Controlling question：如何把真实 Agent 任务、路径、输入和业务终态转成可回放工作负载，而不是重复一个 HTTP 请求？

如何把真实 Agent 任务、路径、输入和业务终态转成可回放工作负载，而不是重复一个 HTTP 请求？

- 目标学习者：已会接口测试、首次负责 Agent 性能与稳定性的测试开发工程师。
- 待做决定：是否允许该负载进入容量或稳定性测试。
- 必交工件：版本化 workload model 与业务 Oracle。
- 范围：订单异常处置 Agent 的确定性离线夹具；不调用真实模型、支付或生产工具。
- 非目标：不估算供应商性能，不声明生产容量，不替组织设定 SLO。

## 查询计划

Run A 从官方规格、指标与实现文档建立可计算定义；Run B 从级联故障、issue、运维指南与学习供给寻找反例和落地限制。两个 run 分开记录，比较者只消费两份结果与 source refs。

## 验收门槛

至少 10 个已打开来源、5 个 evidence lane、5 个 source family、2 个独立 run、独立 comparison，以及 baseline/fault/repair 的 0/1/0 证据。所有结论必须分类为 Evidence、Inference 或 Unknown。
