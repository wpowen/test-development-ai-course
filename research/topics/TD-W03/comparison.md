# TD-W03 independent comparison

## Agreements

运行 A 从职业风险出发，运行 B 从系统和对抗失败出发。两者一致认为：怎样在相同模型、任务、总 Token、工具、重试和人工干预预算下比较单 Agent 与多 Agent，避免把更多资源误写成架构收益？ 的答案不能是单一平均分。都要求版本化输入、独立 Oracle、权限先于副作用、明确人工 owner、baseline/fault/repair 0/1/0 和可执行回滚。两者也都拒绝让模型、Judge 或 healer 批准自己的 expected，并把真实模型、浏览器、工具、队列和 practitioner review 标为 NOT_RUN。

双方对核心决策也一致：架构负责人只在实验 manifest 可比、重复运行分布显示超出噪声的收益、blocker 不增加且单位成功成本可接受时采用多 Agent；否则保留单 Agent 或 UNKNOWN。。共同接受的证据流为 冻结任务/Oracle → 锁定共享预算 → 单 Agent 重复运行 → 多 Agent 重复运行 → blocker/成本分布 → 架构决定，共同要求 fault 必须留下命名 failed_oracle_ids，而不是只在说明文字里声称考虑了风险。

## Disagreements

运行 A 更强调业务失败成本、风险切片与责任人，倾向少而清晰的 blocker；运行 B 更强调 manifest hash、轨迹、权限 receipt、mutation kill 和静态材料闭包，担心人工语言掩盖不可执行性。A 认为指标必须先服务决策，B 担心没有严格机器契约时决策无法重放。

来源内部也有张力：Judge 研究报告一定的人类偏好相关性，而偏差研究揭示位置与自偏好；Agent/测试框架展示可实现能力，但标准与安全资料提醒能力不等于授权或生产有效性；WebArena 的可复现基准不能直接外推企业系统。

## Adjudication

裁决不是二选一，而是分层保留：业务层定义失败成本、blocker、人工 owner 与 rollback；工程层把这些规则编码进版本化 Eval、Mutation、权限检查和报告。指标顺序采用 同预算报告成功率分布、blocker、延迟、coordination failure、unit-success cost 和置信区间；不比较单次最好结果。。本页故障 故障给 multi-agent arm 两倍 Token 预算后宣布更优；修复恢复 SAME-TOKEN-BUDGET 并把差异不足标 UNKNOWN。 用确定性 runner 验证控制契约，但不声称外部系统效果。

若业务标签与模型 Judge 冲突，先核对人人一致性和事实证据，再由独立人工 owner 裁决；若框架文档与本地运行冲突，以可复现运行结果为准；若没有运行，则 Unknown。最终 publication verdict 为 fixture-tested only，下一晋级需要真实集成回读、安全审查和 practitioner sign-off。


