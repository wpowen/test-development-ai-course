# TD-PS02 Research Brief

## Controlling question

怎样证明 Schema 生成的用例具备业务检测力，而不是生成大量合法 JSON？

场景：支付意图 amount currency merchant customer 与过期状态形成跨字段约束。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS02-content-owner、TD-PS02-oracle-owner、course-release-owner。关键 Unknown：目标生成器对 OAS dialect 的实现差异和生产商户配置。
