# AI Serving 指标：TTFT、TPOT、ITL、Goodput 与单位成功成本 research brief

## Controlling question

怎样让 TTFT、TPOT、ITL、Goodput 和 cost_per_success 的时间点、分母、切片与质量条件都可重算？

专业角色是负责 AI API、Serving 或职业迁移证据的测试开发工程师。业务对象是版本化生成服务与其发布决定。失败代价包括不可归因回归、重复副作用、错误容量承诺、重试风暴和无证据职业建议。范围包括独立控制问题、方法选择、Oracle、版本化 Prompt/Input/Schema/Eval/Mutation 以及 baseline-fault-repair。范围外包括真实 Provider 能力、生产 SLO、硬件容量、就业与薪资承诺。

研究先看协议和标准，再看 Serving 实现与指标，再看可靠性反例和职业框架。核心方法：从请求、首 Token、逐 Token 和终态时间戳计算延迟；Goodput 只计质量、安全、完整性和 SLO 同时合格的请求。 学员工件：指标定义卡、Token 事件夹具与单位成功成本报告。关键 Unknown：fixture 时间戳和成本不代表任何模型、GPU、地区或供应商。
