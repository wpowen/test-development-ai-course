# TD-T13 independent comparison

## Agreements

运行 A 从职业风险出发，运行 B 从系统和对抗失败出发。两者一致认为：当候选系统的 Prompt、模型、知识库和评分器都可能变化时，怎样证明观察到的差异来自唯一自变量，并把高风险切片 blocker 放在平均分之前？ 的答案不能是单一平均分。都要求版本化输入、独立 Oracle、权限先于副作用、明确人工 owner、baseline/fault/repair 0/1/0 和可执行回滚。两者也都拒绝让模型、Judge 或 healer 批准自己的 expected，并把真实模型、浏览器、工具、队列和 practitioner review 标为 NOT_RUN。

双方对核心决策也一致：发布负责人只能在 manifest diff 证明唯一自变量、重复运行分布稳定、退款等高风险切片没有 blocker 时批准候选；否则结论为混杂或 UNKNOWN。。共同接受的证据流为 版本 manifest → 唯一变量检查 → 同预算重复运行 → blocker 与风险切片 → 成本/延迟 → 人工发布决定，共同要求 fault 必须留下命名 failed_oracle_ids，而不是只在说明文字里声称考虑了风险。

## Disagreements

运行 A 更强调业务失败成本、风险切片与责任人，倾向少而清晰的 blocker；运行 B 更强调 manifest hash、轨迹、权限 receipt、mutation kill 和静态材料闭包，担心人工语言掩盖不可执行性。A 认为指标必须先服务决策，B 担心没有严格机器契约时决策无法重放。

来源内部也有张力：Judge 研究报告一定的人类偏好相关性，而偏差研究揭示位置与自偏好；Agent/测试框架展示可实现能力，但标准与安全资料提醒能力不等于授权或生产有效性；WebArena 的可复现基准不能直接外推企业系统。

## Adjudication

裁决不是二选一，而是分层保留：业务层定义失败成本、blocker、人工 owner 与 rollback；工程层把这些规则编码进版本化 Eval、Mutation、权限检查和报告。指标顺序采用 先看 manifest 锁定字段与 blocker，再看切片成功率分布、重复运行方差、单位成功成本和延迟；总平均分不得覆盖退款承诺错误。。本页故障 故障运行同时更换模型与检索索引，使得分上涨无法归因；修复恢复单变量实验并保留另一变化到下一轮。 用确定性 runner 验证控制契约，但不声称外部系统效果。

若业务标签与模型 Judge 冲突，先核对人人一致性和事实证据，再由独立人工 owner 裁决；若框架文档与本地运行冲突，以可复现运行结果为准；若没有运行，则 Unknown。最终 publication verdict 为 fixture-tested only，下一晋级需要真实集成回读、安全审查和 practitioner sign-off。

