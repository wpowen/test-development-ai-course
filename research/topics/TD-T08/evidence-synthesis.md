# TD-T08 证据综合

## Fact
W3C Trace Context 定义可跨系统传播的 `traceparent` 与 `tracestate`，它支持关联但不识别根因。OpenTelemetry trace 概念、日志规范和 context propagation 文档说明 span 层级、event、TraceId/SpanId 与上下文传播；缺 instrumentation 或采样会造成断链。pytest 输出文档支持结构化测试结果与时间信息，GitHub Actions artifacts 文档支持保存运行工件；留存机制不保证内容语义正确，也受平台权限和期限影响。

Sentry 的 grouping 发布说明展示语义分组能力，而官方支持文章同时承认 fingerprint 会错误合并或拆分，这是关键反证。Google SRE 故障排查章节主张假设驱动、收集证据和控制变量；Google Testing Blog 要求失败信息可行动，但二者都没有证明 AI 能自动完成因果诊断。OpenAI eval 指南支持数据集、grader 与运行输出的显式化，不支持让同一模型批准自己的因果结论。教学课程页只证明学习需求，不是聚类效果基准。

## Cross-source synthesis
可靠流水线先保存原始事件：event/run/test ID、trace/span、commit、环境、依赖版本、时间、日志/截图/报告路径和哈希。标准化器产生只读派生字段并保持 raw reference；聚类器依据明确特征形成候选组，同时保存未归组与低置信事件。输出 schema 区分 symptom、cluster rationale、hypothesis、confounders、evidence gaps、next experiment 和 cause status。模型只能建议分组与实验，不能把语言相似性变成 VERIFIED_CAUSE。

因果升级需要预先定义的证据：在相同版本重放、单变量改变后症状消失，或修复回滚能稳定翻转结果；否则保持 HYPOTHESIS/UNKNOWN。混合 commit、环境或缺 trace 时，先按版本分层或重新采集。聚类质量应同时测 pair precision/recall、错误合并、错误拆分、unknown preservation 与原始引用完整率；没有独立标注集不能报告准确率。异常值不可丢弃，因为它可能是不同缺陷或关键反证。

fixture 包含共享 trace、相同 commit/environment 的失败事件。baseline 保留 raw refs，形成 evidence-closed cluster，并给出下一控制实验；fault 清空 trace、把 commit 设为 mixed，系统将 cause_status 保持 UNKNOWN，退出 2；repair 恢复引用和版本一致性，再次通过。实验展示证据缺口如何触发停止，但没有连接真实 OpenTelemetry 或分组模型。

## Unknown
真实系统的采样率、字段完整性、隐私/保留政策、跨服务时钟、独立标注与真实根因未知。未运行 AI 聚类、真实 trace 后端、线上事故或从业者复核，不能报告准确率、节省时间或生产可用性。fixture 中的 `VERIFIED_CAUSE` 仅指合成规则满足，不能外推为真实因果能力；总体状态为 `fixture-tested`。
