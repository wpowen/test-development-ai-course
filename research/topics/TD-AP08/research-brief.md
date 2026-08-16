# TD-AP08 研究简报：SLO、告警与事故证据

## 决策问题

Controlling question：如何以 good task 为 SLI，把多窗口 burn-rate 告警连接到 owner、止血、恢复和事故样例回流？

如何把任务正确性、时延、成本和副作用安全写成 SLI，并连接 burn-rate 告警与事故 Runbook？

- 目标学习者：已会接口测试、首次负责 Agent 性能与稳定性的测试开发工程师。
- 待做决定：什么症状应 page、什么信号只用于诊断。
- 必交工件：Agent SLO、分层告警和事故证据卡。
- 范围：订单异常处置 Agent 的确定性离线夹具；不调用真实模型、支付或生产工具。
- 非目标：不估算供应商性能，不声明生产容量，不替组织设定 SLO。

## 查询计划

Run A 从官方规格、指标与实现文档建立可计算定义；Run B 从级联故障、issue、运维指南与学习供给寻找反例和落地限制。两个 run 分开记录，比较者只消费两份结果与 source refs。

## 验收门槛

至少 10 个已打开来源、5 个 evidence lane、5 个 source family、2 个独立 run、独立 comparison，以及 baseline/fault/repair 的 0/1/0 证据。所有结论必须分类为 Evidence、Inference 或 Unknown。
