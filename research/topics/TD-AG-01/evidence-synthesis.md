# TD-AG-01 Evidence Synthesis｜D0 Judge 校准与评估可信

## Fact
1. 官方/标准来源把评测、风险、权限和可追溯性拆成不同责任面；没有来源允许用最终文本替代工具权限或业务 Oracle。
2. Agent 的真实结论需要版本化输入、Prompt、工具、状态和 Judge；重复运行和长时程必须保存 raw evidence。
3. 课程 fixture 的可证事实是：标准库 runner 能执行 baseline、单一命名 fault 和同一合同 repair，退出码为 `0/1/0`；模型 provider、live Agent、shadow/online 均未运行。
4. S01/S03/S04/S10 提供产品能力形态，S07/S08/S23 提供治理与职业边界，S13/S24 提供失败与反例提醒，S36 提供可复现 harness 参考。

## Cross-source synthesis
对 TD-AG-01 的共同结论是：先定义被测边界和决策权，再选测量方法。官方文档可说明工具能做什么，却不能证明本课程业务正确；标准与职业大纲可说明责任原则，却不能替代 fixture 的失败收据；实践和反例来源能揭露常见误区，却不能直接提供统一阈值。因而页面采用四层闭环：

- **输入层**：固定风险切片、版本、脱敏数据、权限和工作负载；缺任一关键输入标记 `BLOCKED`。
- **观察层**：保存 outcome、step/span、tool 参数、状态、handoff、成本和 stop reason；只看最终文本属于证据缺口。
- **Oracle 层**：独立 schema/policy/business owner 进行判定；模型和 Judge 不能自批。
- **决策层**：区分 PASS、FAIL、UNKNOWN、NOT_RUN、BLOCKED 与 risk accepted；高危安全或业务 blocker 不被平均分抵消。

指标解释也必须分层。D4 的 pass@k 表示至少一次成功，pass^k 表示每次都成功，二者不能互换；D6 的 P95/P99、goodput 与成本尾部必须绑定 workload 和价格版本；D5 的攻击阻断率必须声明攻击总体和暴露量。来源中的例子只作为方法启发，不是跨业务的默认门槛。

## Reuse decision
页面将来源原则改写为可执行 artifact：版本化 Prompt/Input/Schema/Eval/Mutation、逐页 manifest、0/1/0 runner、四证据环 entry/exit/rollback 和小白检查单。迁移时只复用证据链、schema 和责任边界；业务 Oracle、风险切片、阈值、工具权限和 owner 必须重取证。

## Unknown
真实模型行为分布、provider 版本、企业工具后端、MCP/浏览器/队列、在线流量、从业者可读性、学习者完成率和 ROI 均未知。不能从页面数量、fixture PASS、静态来源或单次样例推断这些结论。
