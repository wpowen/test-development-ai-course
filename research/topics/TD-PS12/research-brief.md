# TD-PS12 Research Brief

## Controlling question

怎样从 threat model 和权限矩阵构建确定性安全 Oracle，并证明拒绝发生在工具边界且没有跨租户读取或写副作用？

场景：退款助手能读取订单并调用工具，攻击者可能利用对象 ID、Prompt 注入、越权 token 或日志泄密。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS12-content-owner、TD-PS12-oracle-owner、course-release-owner。关键 Unknown：目标 IdP 策略、真实密钥管理、渗透授权范围和剩余风险接受人。
