# TD-AP03 两轮研究比较

## Agreements

两轮研究都要求可关联、可脱敏、可版本化的 task-rooted trace。

## Run A：官方规格与实现

优势：给出 Trace 语义与因果证据 的字段、公式、调度或工具接口，可直接形成 schema 和 typed technical block。限制：产品/标准文档证明语义与功能存在，不证明目标环境效果。

## Run B：失败、运维与学习供给

优势：暴露队列、重试、Trace 缺口、资源增长和告警误用等反例，并能形成 fault mutation 与 Runbook。限制：issue 是具体环境报告，不能普遍化。

## Disagreements

标准语义与 issue 反例对默认 span 完整性没有共同结论。

## Adjudication

课程以本地 schema gate 验证闭包，不把 provider 默认行为当事实。

裁决后的作业要求导出一条完整 root trace 和一条断链 fault trace，并说明缺失证据与真实业务失败的区别。

## 独立比较结论

最终判断必须附完整 root、断链 fault、脱敏结果和独立 closure 检查；缺 span 不得写成通过。还要保存 schema version 与缺失原因，便于复现诊断。

学习者必须把两轮证据转换成 trace schema、脱敏策略、断链 mutation 和独立 closure 检查，并明确 provider 默认行为仍未知。

两轮证据一致支持“版本化负载 + 可下钻证据 + fail-closed gate”。差异在于 Run A 偏定义，Run B 偏失效机制。课程同时保留二者：定义决定字段，失效机制决定 mutation。Production capacity、组织阈值和 practitioner sign-off 保持 Unknown。
