# TD-AP01 两轮研究比较

## Agreements

两轮研究都支持以版本化 workload、业务终态和可下钻 trace 作为性能判断的最小证据链。

## Run A：官方规格与实现

优势：给出 工作负载模型与任务口径 的字段、公式、调度或工具接口，可直接形成 schema 和 typed technical block。限制：产品/标准文档证明语义与功能存在，不证明目标环境效果。

## Run B：失败、运维与学习供给

优势：暴露队列、重试、Trace 缺口、资源增长和告警误用等反例，并能形成 fault mutation 与 Runbook。限制：issue 是具体环境报告，不能普遍化。

## Disagreements

Run A 偏规范和可计算定义，Run B 偏运维反例；二者对具体容量阈值和组织预算没有共同结论。

## Adjudication

课程采用定义作为字段合同、反例作为 mutation 设计，并将生产容量、组织阈值和从业者签字保留为 Unknown。

裁决后的教学工件是 workload profile、业务 Oracle、trace schema 和 evidence card；学员必须展示一条正常任务、一条 fault 任务和 repair 后同一任务的差异。

## 独立比较结论

学习者必须把两轮证据转换成字段合同、fault mutation、独立 Oracle 和迁移限制，并在报告中明确哪些数字仅来自 synthetic fixture。

两轮证据一致支持“版本化负载 + 可下钻证据 + fail-closed gate”。差异在于 Run A 偏定义，Run B 偏失效机制。课程同时保留二者：定义决定字段，失效机制决定 mutation。Production capacity、组织阈值和 practitioner sign-off 保持 Unknown。
