# TD-W02 状态、循环、重试、handoff 与终止 research brief

**Controlling question:** 怎样把 checkpoint、循环预算、消息重投、幂等 receipt、handoff 契约和 stop reason 组成可恢复工作流，避免重复副作用、孤儿状态和无限循环？

- Professional decision: Workflow owner 仅在重复消息无重复写、checkpoint 可恢复、handoff 不扩权、循环在预算内终止并记录 stop reason 时批准流程。
- Work object: msg-42 审计任务、checkpoint、attempt、idempotency ledger、handoff payload、iteration/token/time budget、stop reason 和人工接管。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.


