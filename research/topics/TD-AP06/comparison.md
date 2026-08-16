# TD-AP06 两轮研究比较

## Agreements

两轮研究都要求 deadline、retry、backoff 和副作用边界可观察。

## Run A：官方规格与实现

优势：给出 超时、重试与安全降级 的字段、公式、调度或工具接口，可直接形成 schema 和 typed technical block。限制：产品/标准文档证明语义与功能存在，不证明目标环境效果。

## Run B：失败、运维与学习供给

优势：暴露队列、重试、Trace 缺口、资源增长和告警误用等反例，并能形成 fault mutation 与 Runbook。限制：issue 是具体环境报告，不能普遍化。

## Disagreements

重试策略受系统和业务影响，来源没有统一预算。

## Adjudication

课程采用保守的 fixture budget，并把真实写操作策略交给人工 owner。

裁决后的作业要求给出 deadline、attempt budget、幂等和安全终态的字段表，并用 retry-storm fault 证明预算不可被吞掉。

## 独立比较结论

最终判断必须附预算传播、幂等证据和安全终态；真实写操作需人工批准。报告还要区分 retryable、terminal 和 reconciliation 状态。

学习者必须把两轮证据转换成 deadline/attempt budget 字段表、retry-storm mutation、幂等检查和人工升级边界。

两轮证据一致支持“版本化负载 + 可下钻证据 + fail-closed gate”。差异在于 Run A 偏定义，Run B 偏失效机制。课程同时保留二者：定义决定字段，失效机制决定 mutation。Production capacity、组织阈值和 practitioner sign-off 保持 Unknown。
