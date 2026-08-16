# TD-AP04 两轮研究比较

## Agreements

两轮研究都支持区分 open arrival 与 closed concurrency，并单独记录排队。

## Run A：官方规格与实现

优势：给出 开放与封闭负载模型 的字段、公式、调度或工具接口，可直接形成 schema 和 typed technical block。限制：产品/标准文档证明语义与功能存在，不证明目标环境效果。

## Run B：失败、运维与学习供给

优势：暴露队列、重试、Trace 缺口、资源增长和告警误用等反例，并能形成 fault mutation 与 Runbook。限制：issue 是具体环境报告，不能普遍化。

## Disagreements

不同工具对 omission 控制与负载解释粒度不同。

## Adjudication

课程用同一 task oracle 比较两种执行器，生产负载选择仍 Unknown。

裁决后的作业固定任务集合，只切换 open/closed 调度器，分别解释 offered rate、queue 和 omission 风险。

## 独立比较结论

最终判断必须附两种调度器的 offered/achieved rate、queue、p99 和 task 终态；生产模型选择保持 UNKNOWN。

学习者必须把两轮证据转换成负载选择决策、omission 风险说明、fault mutation 和独立 task Oracle 结果，并明确生产负载仍未知。

两轮证据一致支持“版本化负载 + 可下钻证据 + fail-closed gate”。差异在于 Run A 偏定义，Run B 偏失效机制。课程同时保留二者：定义决定字段，失效机制决定 mutation。Production capacity、组织阈值和 practitioner sign-off 保持 Unknown。
