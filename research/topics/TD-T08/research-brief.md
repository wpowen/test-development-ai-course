# TD-T08 研究简报：失败聚类与证据保全

**Controlling question**：如何让 AI 聚类大量测试失败以降低排查负担，同时保留不可变原始证据、版本和 trace 引用，并在证据不足时输出 `UNKNOWN` 而不是把相似症状写成已验证根因？

研究覆盖 trace 标准、OpenTelemetry 日志/链路、供应商分组能力与误分反证、SRE 假设驱动诊断、测试输出、工件留存、评估和教学需求。输出必须区分 observation、cluster、hypothesis、experiment 与 verified cause；聚类器不能自证因果。
