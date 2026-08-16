# TD-AP06 研究简报：超时、重试与安全降级

## 决策问题

Controlling question：如何跨 gateway、SDK、Agent 和 tool 统一 deadline、attempt budget 与安全降级终态？

如何设置总超时与重试预算，避免多层重试风暴，并在压力下安全降级？

- 目标学习者：已会接口测试、首次负责 Agent 性能与稳定性的测试开发工程师。
- 待做决定：故障策略能否止住反馈环且不放大副作用。
- 必交工件：超时/重试/降级策略与三阶段证据。
- 范围：订单异常处置 Agent 的确定性离线夹具；不调用真实模型、支付或生产工具。
- 非目标：不估算供应商性能，不声明生产容量，不替组织设定 SLO。

## 查询计划

Run A 从官方规格、指标与实现文档建立可计算定义；Run B 从级联故障、issue、运维指南与学习供给寻找反例和落地限制。两个 run 分开记录，比较者只消费两份结果与 source refs。

## 验收门槛

至少 10 个已打开来源、5 个 evidence lane、5 个 source family、2 个独立 run、独立 comparison，以及 baseline/fault/repair 的 0/1/0 证据。所有结论必须分类为 Evidence、Inference 或 Unknown。
