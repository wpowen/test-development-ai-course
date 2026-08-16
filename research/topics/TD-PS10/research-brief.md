# TD-PS10 Research Brief

## Controlling question

怎样证明每层 deadline 和 retry budget 有界，过载时安全拒绝或只读降级，恢复后不会产生洪峰与重复副作用？

场景：订单助手依赖模型、检索和退款工具，局部超时可能触发多层重试与队列级联。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS10-content-owner、TD-PS10-oracle-owner、course-release-owner。关键 Unknown：目标供应商 Retry-After、真实队列容量和业务降级文案。
