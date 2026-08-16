# TD-T15 最终结果、单步动作和完整轨迹 research brief

**Controlling question:** 怎样把 Agent 评测拆为 outcome、step 和 trajectory 三层 Oracle，使最终答案正确也不能掩盖越权工具调用、重复动作或不可接受的路径？

- Professional decision: 质量负责人分别批准业务最终状态、关键动作安全和完整轨迹；任何禁止副作用在 step 层出现即 blocker，不能被 outcome 总分抵消。
- Work object: 退款 Agent 的订单状态、最终回复、每次工具名与参数、权限 receipt、观察、重试、handoff、预算和 stop reason。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.


