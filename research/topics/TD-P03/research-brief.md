# TD-P03 research brief

## Controlling question

如何把歧义、来源冲突、缺失分支、不可观察结果和未定义 NFR 转成可关闭的问题？

Learner baseline：会阅读 PRD、接口文档并运行 Python，但不会区分来源 authority、独立 Oracle、负控制和发布证据。Professional decision：交付 Review Question Pack，能解释字段来源、停止条件、owner 与证据边界。System boundary：仅处理脱敏离线订单取消 fixture；模型、企业系统、真实支付、生产部署和从业者盲评均不在本页证据内。Failure cost：AI 总结没有 owner、关闭证据或阻断级别。Exclusions：不把 JSON 合法、页面完整或 exit 0 当业务正确。Freshness：来源在 2026-08-11 按路线 A/B 重新登记。Learner proof：运行 baseline/fault/repair 0/1/0，提交带 source_refs、owner、stop state 的工件。

