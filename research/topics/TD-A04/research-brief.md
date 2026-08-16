# AI Serving 负载与容量：从 Token 分布到 SLO 拐点 research brief

## Controlling question

怎样固定到达率、Token 长度、缓存、场景和质量条件，找到 fixture 的 Goodput 拐点且不发生 coordinated omission？

专业角色是负责 AI API、Serving 或职业迁移证据的测试开发工程师。业务对象是版本化生成服务与其发布决定。失败代价包括不可归因回归、重复副作用、错误容量承诺、重试风暴和无证据职业建议。范围包括独立控制问题、方法选择、Oracle、版本化 Prompt/Input/Schema/Eval/Mutation 以及 baseline-fault-repair。范围外包括真实 Provider 能力、生产 SLO、硬件容量、就业与薪资承诺。

研究先看协议和标准，再看 Serving 实现与指标，再看可靠性反例和职业框架。核心方法：open-loop 保持外部到达并记录 dropped arrivals；closed-loop 仅诊断单用户上限；阶梯实验每级只改到达率。 学员工件：工作负载 Manifest、阶梯实验与 fixture-only 容量报告。关键 Unknown：没有网络、模型、GPU、调度器或生产流量，不能外推真实容量。
