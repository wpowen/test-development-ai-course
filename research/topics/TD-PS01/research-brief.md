# TD-PS01 Research Brief

## Controlling question

怎样证明 202 响应、订单状态、退款账本和事件消费属于同一次合法取消，而不是只证明 HTTP 成功？

场景：已支付未发货订单取消后异步退款，客户端超时重试不能生成第二笔退款。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS01-content-owner、TD-PS01-oracle-owner、course-release-owner。关键 Unknown：目标支付网关幂等窗口、真实账本可查询性和业务延迟阈值。
