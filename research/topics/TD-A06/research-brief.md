# AI Serving 韧性：限流、Timeout、Retry、Fallback 与 Degradation research brief

## Controlling question

怎样保证 429、5xx、超时和断流下重试有界、工具副作用不重复，fallback 不会无声突破质量与安全底线？

专业角色是负责 AI API、Serving 或职业迁移证据的测试开发工程师。业务对象是版本化生成服务与其发布决定。失败代价包括不可归因回归、重复副作用、错误容量承诺、重试风暴和无证据职业建议。范围包括独立控制问题、方法选择、Oracle、版本化 Prompt/Input/Schema/Eval/Mutation 以及 baseline-fault-repair。范围外包括真实 Provider 能力、生产 SLO、硬件容量、就业与薪资承诺。

研究先看协议和标准，再看 Serving 实现与指标，再看可靠性反例和职业框架。核心方法：先分类错误并传播 deadline；次数、总时间、Token/费用和副作用共同限制重试；fallback 必须独立评测。 学员工件：韧性状态机、重试预算、故障矩阵与恢复证据。关键 Unknown：真实供应商配额、Retry-After、fallback 模型质量和生产恢复没有运行。
