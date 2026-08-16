# TD-AP02 两轮研究比较

## Agreements

两轮研究都支持任务级指标树、明确分母和尾部证据。

## Run A：官方规格与实现

优势：给出 TTFT、TPOT、Queue、Retry 与 Step 指标树 的字段、公式、调度或工具接口，可直接形成 schema 和 typed technical block。限制：产品/标准文档证明语义与功能存在，不证明目标环境效果。

## Run B：失败、运维与学习供给

优势：暴露队列、重试、Trace 缺口、资源增长和告警误用等反例，并能形成 fault mutation 与 Runbook。限制：issue 是具体环境报告，不能普遍化。

## Disagreements

规范定义与运维反例对具体阈值没有共同结论。

## Adjudication

课程保留两类证据并将组织阈值标为 Unknown。

裁决后的作业要求学员从原始事件独立重算一个任务成功率和尾延迟，解释 request、step、task 三个分母为何不能互换。

## 独立比较结论

最终判断必须附原始事件、分母说明和修复前后差异；缺少独立重算则保持 UNKNOWN。报告还要注明指标版本、风险切片和 owner，避免把不同任务混成一个平均数。若分母不完整，结论只能写 UNKNOWN；不得用平均值补齐缺失任务。

学习者必须把两轮证据转换成指标字典、分母审计、fault mutation 和独立重算结果，并明确组织阈值仍未知。

两轮证据一致支持“版本化负载 + 可下钻证据 + fail-closed gate”。差异在于 Run A 偏定义，Run B 偏失效机制。课程同时保留二者：定义决定字段，失效机制决定 mutation。Production capacity、组织阈值和 practitioner sign-off 保持 Unknown。
