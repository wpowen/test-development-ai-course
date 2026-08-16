# TD-PS03 Research Brief

## Controlling question

怎样在部署前证明消费者字段兼容，并在运行时证明租户、幂等、死信和补偿没有静默失败？

场景：Checkout 发布 order.created，库存支付通知消费者异步处理并可能重复乱序。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS03-content-owner、TD-PS03-oracle-owner、course-release-owner。关键 Unknown：目标 broker 投递保证、策略引擎版本和补偿 owner。
