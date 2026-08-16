# TD-PS04 Research Brief

## Controlling question

怎样让 UI 测试等待业务终态、隔离数据并保存可诊断 Trace，而不是靠 sleep 和文本出现判绿？

场景：后台退款审批需跨 UI、订单 API、异步状态和审计记录完成。研究范围包含方法选择、独立 Oracle、版本化 Prompt、baseline/fault/repair 和人工门禁。排除真实生产破坏、真实个人数据、未授权设备/集群/数据库操作。决策 owner：TD-PS04-content-owner、TD-PS04-oracle-owner、course-release-owner。关键 Unknown：目标浏览器流量占比、第三方沙箱稳定性和真实页面可访问名称。
