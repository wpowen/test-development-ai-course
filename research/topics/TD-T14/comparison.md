# TD-T14 independent comparison

## Agreements

运行 A 从职业风险出发，运行 B 从系统和对抗失败出发。两者一致认为：怎样用人工双标、顺序翻转、风格扰动和事实反例校准 LLM Judge，使其只能辅助可委托的评分，而不能批准自己的期望或绕过事实 blocker？ 的答案不能是单一平均分。都要求版本化输入、独立 Oracle、权限先于副作用、明确人工 owner、baseline/fault/repair 0/1/0 和可执行回滚。两者也都拒绝让模型、Judge 或 healer 批准自己的 expected，并把真实模型、浏览器、工具、队列和 practitioner review 标为 NOT_RUN。

双方对核心决策也一致：质量负责人基于人人一致性、人机分歧矩阵和反例命中率划定 Judge 可自动评分、需抽检和必须人工审批的范围；事实、安全、权限类永不由单一 Judge 放行。。共同接受的证据流为 人工双标 → 盲化候选身份 → A/B 顺序翻转 → Judge 重复评分 → 分歧归因 → 风险分层与升级，共同要求 fault 必须留下命名 failed_oracle_ids，而不是只在说明文字里声称考虑了风险。

## Disagreements

运行 A 更强调业务失败成本、风险切片与责任人，倾向少而清晰的 blocker；运行 B 更强调 manifest hash、轨迹、权限 receipt、mutation kill 和静态材料闭包，担心人工语言掩盖不可执行性。A 认为指标必须先服务决策，B 担心没有严格机器契约时决策无法重放。

来源内部也有张力：Judge 研究报告一定的人类偏好相关性，而偏差研究揭示位置与自偏好；Agent/测试框架展示可实现能力，但标准与安全资料提醒能力不等于授权或生产有效性；WebArena 的可复现基准不能直接外推企业系统。

## Adjudication

裁决不是二选一，而是分层保留：业务层定义失败成本、blocker、人工 owner 与 rollback；工程层把这些规则编码进版本化 Eval、Mutation、权限检查和报告。指标顺序采用 分别报告人人一致性、人机一致性、position flip rate、fact blocker miss、理由可追溯率和升级率，不把单一一致率当准确率。。本页故障 故障 Judge 在交换候选顺序后翻转胜负，并因答案流畅放过过期政策；修复启用顺序一致性检查与事实 blocker 独立 Oracle。 用确定性 runner 验证控制契约，但不声称外部系统效果。

若业务标签与模型 Judge 冲突，先核对人人一致性和事实证据，再由独立人工 owner 裁决；若框架文档与本地运行冲突，以可复现运行结果为准；若没有运行，则 Unknown。最终 publication verdict 为 fixture-tested only，下一晋级需要真实集成回读、安全审查和 practitioner sign-off。

