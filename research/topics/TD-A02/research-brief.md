# AI API 协议：Streaming、Structured、Tool 与 Async research brief

## Controlling question

怎样证明 streaming、structured output、tool call 和 async job 的过程与终态都合法，且取消或重试不会重复副作用？

专业角色是负责 AI API、Serving 或职业迁移证据的测试开发工程师。业务对象是版本化生成服务与其发布决定。失败代价包括不可归因回归、重复副作用、错误容量承诺、重试风暴和无证据职业建议。范围包括独立控制问题、方法选择、Oracle、版本化 Prompt/Input/Schema/Eval/Mutation 以及 baseline-fault-repair。范围外包括真实 Provider 能力、生产 SLO、硬件容量、就业与薪资承诺。

研究先看协议和标准，再看 Serving 实现与指标，再看可靠性反例和职业框架。核心方法：为 SSE、结构化输出、工具调用、异步任务建立四个独立状态机，分别检查过程和终态。 学员工件：四协议状态机、事件 reducer、幂等账本与重放报告。关键 Unknown：真实代理缓冲、网络分片、工具服务和任务队列没有运行。
