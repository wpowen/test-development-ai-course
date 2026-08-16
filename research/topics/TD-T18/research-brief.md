# TD-T18 Browser Agent 生成测试 research brief

**Controlling question:** 怎样让 Browser Agent 从需求风险生成可执行浏览器测试，同时用业务状态 Oracle 与 mutation 证明它不是只复述页面可见文本？

- Professional decision: 测试负责人只接受能追溯风险 ID、在隔离账户执行、验证后端业务状态并杀死已知 mutation 的候选测试；生成模型无合并权。
- Work object: 退款审核页面的需求风险、seed 数据、Planner 场景、Generator 测试、浏览器 Trace、后端状态与 auto_refunded 业务变异。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.


