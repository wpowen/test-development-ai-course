# TD-P04 research brief

## Controlling question

如何从需求推导风险并选择测试层级、方法、独立 Oracle、监控与残余风险责任人？

Learner baseline：会阅读 PRD、接口文档并运行 Python，但不会区分来源 authority、独立 Oracle、负控制和发布证据。Professional decision：交付 Risk Test Plan，能解释字段来源、停止条件、owner 与证据边界。System boundary：仅处理脱敏离线订单取消 fixture；模型、企业系统、真实支付、生产部署和从业者盲评均不在本页证据内。Failure cost：用例数量替代风险覆盖或把所有场景堆到 E2E。Exclusions：不把 JSON 合法、页面完整或 exit 0 当业务正确。Freshness：来源在 2026-08-11 按路线 A/B 重新登记。Learner proof：运行 baseline/fault/repair 0/1/0，提交带 source_refs、owner、stop state 的工件。

