# TD-AP08 两轮研究比较

## Agreements

两轮研究都要求 good-task SLI、error budget、owner 和恢复动作闭环。

## Run A：官方规格与实现

优势：给出 SLO、告警与事故证据 的字段、公式、调度或工具接口，可直接形成 schema 和 typed technical block。限制：产品/标准文档证明语义与功能存在，不证明目标环境效果。

## Run B：失败、运维与学习供给

优势：暴露队列、重试、Trace 缺口、资源增长和告警误用等反例，并能形成 fault mutation 与 Runbook。限制：issue 是具体环境报告，不能普遍化。

## Disagreements

告警窗口与 burn-rate 阈值因组织和服务等级而异。

## Adjudication

课程只验证可追溯的本地合同，不声明组织 SLO。

裁决后的作业必须从 good-task 原始事件重算 SLI，写清窗口、owner、止血、恢复和事故回流；组织阈值仍由人工负责。

## 独立比较结论

最终判断必须附 good-task 原始事件、窗口/burn-rate、owner、止血与恢复；组织 SLO 仍由人工确定。每个告警必须能回指一个可审计任务样本。

学习者必须把两轮证据转换成 good-task SLI、窗口和 burn-rate 表、owner/止血/恢复工件，以及独立 Oracle 重算。

两轮证据一致支持“版本化负载 + 可下钻证据 + fail-closed gate”。差异在于 Run A 偏定义，Run B 偏失效机制。课程同时保留二者：定义决定字段，失效机制决定 mutation。Production capacity、组织阈值和 practitioner sign-off 保持 Unknown。
