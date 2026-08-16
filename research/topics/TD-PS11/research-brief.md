# TD-PS11 Research Brief

## Controlling question

怎样让 symptom、fault event、跨服务 Trace、质量切片和恢复检查属于同一证据链，并在 telemetry 缺失时保持 UNKNOWN？

场景：生产客服 Agent 质量下降可能来自索引、工具、模型、队列或观测丢失，需要在隔离范围内验证。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS11-content-owner、TD-PS11-oracle-owner、course-release-owner。关键 Unknown：目标 collector 采样、生产权限、托管模型内部 span 和真实恢复时间。
