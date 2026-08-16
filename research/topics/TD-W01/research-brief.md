# TD-W01 Agent、Worker 与 Workflow 边界 research brief

**Controlling question:** 怎样根据下一步控制权、状态所有权和副作用提交点区分 Agent、Worker 与 Workflow，并为每类选择不同测试 Oracle 和权限？

- Professional decision: 架构与质量负责人共同确认每个组件的控制权分类、状态 owner、身份和副作用边界；术语或目录名不能代替运行语义。
- Work object: 内容发布系统的 deterministic router、自主 Agent loop、异步队列 Worker、持久 Workflow state、身份 token 与 human owner。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.


