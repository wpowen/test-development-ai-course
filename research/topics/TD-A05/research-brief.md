# AI Serving 瓶颈：Queue、GPU、KV Cache 与阶段诊断 research brief

## Controlling question

怎样从 TTFT、TPOT、ITL 症状定位 Queue、prefill、decode、GPU、KV Cache 或工具瓶颈，并避免相关性误判？

专业角色是负责 AI API、Serving 或职业迁移证据的测试开发工程师。业务对象是版本化生成服务与其发布决定。失败代价包括不可归因回归、重复副作用、错误容量承诺、重试风暴和无证据职业建议。范围包括独立控制问题、方法选择、Oracle、版本化 Prompt/Input/Schema/Eval/Mutation 以及 baseline-fault-repair。范围外包括真实 Provider 能力、生产 SLO、硬件容量、就业与薪资承诺。

研究先看协议和标准，再看 Serving 实现与指标，再看可靠性反例和职业框架。核心方法：先按阶段症状分流，再关联 request trace 与资源信号，最后用单变量实验确认或推翻候选根因。 学员工件：瓶颈诊断树、Trace 对照、反证与单变量实验记录。关键 Unknown：托管服务内部队列、GPU profiler 和真实 KV cache eviction 不可见。
