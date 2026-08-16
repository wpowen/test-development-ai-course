# TD-AP07 两轮研究比较

## Agreements

两轮研究都支持窗口化 soak、资源趋势和恢复检查。

## Run A：官方规格与实现

优势：给出 长稳、资源漂移与泄漏 的字段、公式、调度或工具接口，可直接形成 schema 和 typed technical block。限制：产品/标准文档证明语义与功能存在，不证明目标环境效果。

## Run B：失败、运维与学习供给

优势：暴露队列、重试、Trace 缺口、资源增长和告警误用等反例，并能形成 fault mutation 与 Runbook。限制：issue 是具体环境报告，不能普遍化。

## Disagreements

不同运行时对资源快照和泄漏证据的可见性不同。

## Adjudication

课程采用本地窗口与 snapshot diff，真实平台泄漏保持 Unknown。

裁决后的作业必须对 warmup、steady、recovery 分窗并报告资源斜率、cleanup 差分与尾延迟，而不是引用一次短跑平均值。

## 独立比较结论

最终判断必须附三窗口原始快照、资源 slope、cleanup diff 和独立窗口审计；短跑不能替代 soak。资源指标需注明单位、采样点和恢复条件；没有完整 recovery 的报告不得升级状态。

学习者必须把两轮证据转换成分窗 soak 计划、资源 slope、snapshot diff、fault mutation 和独立窗口审计。

两轮证据一致支持“版本化负载 + 可下钻证据 + fail-closed gate”。差异在于 Run A 偏定义，Run B 偏失效机制。课程同时保留二者：定义决定字段，失效机制决定 mutation。Production capacity、组织阈值和 practitioner sign-off 保持 Unknown。
