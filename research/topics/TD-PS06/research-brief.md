# TD-PS06 Research Brief

## Controlling question

怎样证明移动生命周期恢复不丢扫描状态也不重复入账，并区分应用、设备和服务端失败？

场景：仓库收货扫码经过相机权限、旋转、后台、进程恢复、离线队列和库存 API。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS06-content-owner、TD-PS06-oracle-owner、course-release-owner。关键 Unknown：OEM 定制行为、目标 API level 分布和真机资源限制。
