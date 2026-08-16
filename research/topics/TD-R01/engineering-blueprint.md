# TD-R01 Engineering Blueprint: 可维护资源索引

## Architecture and data flow
资源条目包含 canonical URL、标题、publisher group、source family、版本/发布日期、访问日期、适用任务、限制和 owner。采集器写入候选区，去重器按 canonical URL 与内容指纹合并，reviewer 再把条目发布到索引。数据流是 `候选 → 打开验证 → 版本标注 → 失效检测 → 审阅 → 学习页引用`；打不开或过期的链接不能静默保留为事实。

## Metrics and decisions
Metric Card 记录 opened rate、freshness、独立 family 数、版本覆盖、断链率和引用命中率。决策为 `KEEP`、`REFRESH`、`SUPERSEDED`、`BLOCKED`。最新不等于权威，复制内容不增加独立性；每个课程 claim 至少保留一个可打开的直接来源和限制说明。

## Baseline failure repair
基线故障是把搜索摘要或旧链接写入索引，导致学习者照失效规则练习。fault mutation 替换 URL、删除 accessed_at、标记过期版本，Oracle 应阻断发布。修复为重新打开原页、记录版本日期、补 publisher/family/limitations，并保留 superseded 条目。fixture 链路不能证明长期维护能力。

## Method, oracle, prompt and eval
方法链为“来源分层 → canonical 去重 → 新鲜度检查 → 引用审阅”。Oracle 检查 HTTP 可达、标题/内容一致、日期和限制字段；Prompt 只允许从打开页面抽取，不得凭记忆补链接。Eval 覆盖断链、重复 family、过期版本和缺 owner；mutation 后期望 `BLOCKED` 或 `SUPERSEDED`。
## Implementation notes and handoff
每个条目先进入候选区，打开原文后才获得 `opened` 状态。canonical URL、内容指纹和 publisher group 用于去重；同一机构的镜像不能增加独立性。失效扫描只改变状态，不删除历史。学习页引用必须带 source_id、访问日期和限制，reviewer 负责确认用途与读者层级。若链接需要登录或版本不明，写 BLOCKED/UNKNOWN 并给出关闭问题的动作。资源索引每次发布生成变更日志，便于回滚和审计。

索引服务还要输出 machine-readable diff：新增、内容变化、重定向、删除和 superseded 分开记录。页面构建只消费 `KEEP` 条目；发现引用漂移时先阻断受影响 claim，再由 owner 选择替代来源。Prompt 可辅助归类和摘要，Oracle 必须依据实际打开的页面、版本元数据与内容指纹，Eval 覆盖断链、错误标题和同源重复。
