# TD-T19 自愈测试的反作弊门禁 research brief

**Controlling question:** 怎样允许 healer 修复 locator、等待和非语义适配，同时禁止它删除断言、改变 expected、跳过步骤或无限重试制造假绿？

- Professional decision: 测试维护负责人只合并能保留原业务 Oracle、杀死原 mutation、diff 落在允许修复面且无权限扩张的候选 patch。
- Work object: 失败浏览器测试、原 Trace/DOM/截图、healer 候选 diff、不可变业务 Oracle、已知 mutation、重试预算与人工合并记录。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.


