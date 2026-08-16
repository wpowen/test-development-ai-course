# TD-AP02 研究简报：TTFT、TPOT、Queue、Retry 与 Step 指标树

## 决策问题

Controlling question：如何把 Agent 的队列、首 token、生成、工具、重试和任务终态放进一棵可解释的指标树？

哪些指标能把用户等待拆成排队、首 Token、逐 Token、工具与重试，并保持可行动性？

- 目标学习者：已会接口测试、首次负责 Agent 性能与稳定性的测试开发工程师。
- 待做决定：性能回归应由哪些门禁阻断。
- 必交工件：版本化 Agent 指标字典。
- 范围：订单异常处置 Agent 的确定性离线夹具；不调用真实模型、支付或生产工具。
- 非目标：不估算供应商性能，不声明生产容量，不替组织设定 SLO。

## 查询计划

Run A 从官方规格、指标与实现文档建立可计算定义；Run B 从级联故障、issue、运维指南与学习供给寻找反例和落地限制。两个 run 分开记录，比较者只消费两份结果与 source refs。

## 验收门槛

至少 10 个已打开来源、5 个 evidence lane、5 个 source family、2 个独立 run、独立 comparison，以及 baseline/fault/repair 的 0/1/0 证据。所有结论必须分类为 Evidence、Inference 或 Unknown。
