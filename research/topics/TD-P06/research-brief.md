# TD-P06 research brief

## Controlling question

如何把需求、风险与独立 Oracle 传给版本化 Prompt，生成不越权、不吞错、可追溯的自动化骨架？

Learner baseline：会阅读 PRD、接口文档并运行 Python，但不会区分来源 authority、独立 Oracle、负控制和发布证据。Professional decision：交付 Versioned Test-Generation Prompt Package，能解释字段来源、停止条件、owner 与证据边界。System boundary：仅处理脱敏离线订单取消 fixture；模型、企业系统、真实支付、生产部署和从业者盲评均不在本页证据内。Failure cost：直接从 PRD 生成 UI 脚本并根据实际响应改写断言。Exclusions：不把 JSON 合法、页面完整或 exit 0 当业务正确。Freshness：来源在 2026-08-11 按路线 A/B 重新登记。Learner proof：运行 baseline/fault/repair 0/1/0，提交带 source_refs、owner、stop state 的工件。

