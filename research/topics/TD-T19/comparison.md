# TD-T19 independent comparison

## Agreements

运行 A 从职业风险出发，运行 B 从系统和对抗失败出发。两者一致认为：怎样允许 healer 修复 locator、等待和非语义适配，同时禁止它删除断言、改变 expected、跳过步骤或无限重试制造假绿？ 的答案不能是单一平均分。都要求版本化输入、独立 Oracle、权限先于副作用、明确人工 owner、baseline/fault/repair 0/1/0 和可执行回滚。两者也都拒绝让模型、Judge 或 healer 批准自己的 expected，并把真实模型、浏览器、工具、队列和 practitioner review 标为 NOT_RUN。

双方对核心决策也一致：测试维护负责人只合并能保留原业务 Oracle、杀死原 mutation、diff 落在允许修复面且无权限扩张的候选 patch。。共同接受的证据流为 原始失败证据 → healer 候选 → diff 分类 → Oracle preservation → mutation 重跑 → 预算检查 → 人工合并，共同要求 fault 必须留下命名 failed_oracle_ids，而不是只在说明文字里声称考虑了风险。

## Disagreements

运行 A 更强调业务失败成本、风险切片与责任人，倾向少而清晰的 blocker；运行 B 更强调 manifest hash、轨迹、权限 receipt、mutation kill 和静态材料闭包，担心人工语言掩盖不可执行性。A 认为指标必须先服务决策，B 担心没有严格机器契约时决策无法重放。

来源内部也有张力：Judge 研究报告一定的人类偏好相关性，而偏差研究揭示位置与自偏好；Agent/测试框架展示可实现能力，但标准与安全资料提醒能力不等于授权或生产有效性；WebArena 的可复现基准不能直接外推企业系统。

## Adjudication

裁决不是二选一，而是分层保留：业务层定义失败成本、blocker、人工 owner 与 rollback；工程层把这些规则编码进版本化 Eval、Mutation、权限检查和报告。指标顺序采用 统计 patch 类型、Oracle preservation、expected-value change、mutation survival、retry inflation、人工拒绝率和回归影响。。本页故障 故障 healer 删除 manual_review Oracle 使测试变绿且 mutation 存活；修复只调整 locator 并恢复不可变 Oracle。 用确定性 runner 验证控制契约，但不声称外部系统效果。

若业务标签与模型 Judge 冲突，先核对人人一致性和事实证据，再由独立人工 owner 裁决；若框架文档与本地运行冲突，以可复现运行结果为准；若没有运行，则 Unknown。最终 publication verdict 为 fixture-tested only，下一晋级需要真实集成回读、安全审查和 practitioner sign-off。


