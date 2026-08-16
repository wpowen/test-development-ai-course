# TD-T16 工具选择、参数和权限 research brief

**Controlling question:** 怎样把工具选择、参数 Schema、身份、tenant、scope 与 human approval 编成写前门禁，使 Agent 即使提出合理动作也不能越权执行？

- Professional decision: 工具安全 owner 只在身份有效、tenant 匹配、参数通过 Schema、scope 最小且高风险动作获独立人工批准后发放单次执行 receipt。
- Work object: 退款工具调用候选，包括 tool_name、order_id、amount、tenant_id、actor、scope、approval_id、idempotency_key 和执行状态。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.


