# TD-PS08 Research Brief

## Controlling question

怎样证明迁移前后行数、键、金额、状态语义和 CDC offset 一致，并在部分失败时安全停止或回滚？

场景：订单表从 status 字符串迁移到 status_code 与状态维表，同时进行双读、回填和 CDC。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS08-content-owner、TD-PS08-oracle-owner、course-release-owner。关键 Unknown：目标数据规模、锁等待、复制延迟、业务可接受停机窗口。
