# TD-T26 Engineering Blueprint: AI 测试生成提效实验

## Architecture and data flow
输入是冻结需求、基线用例、AI 生成用例、执行结果和人工修订日志。数据流为 `需求版本 → 提示词版本 → 候选用例 → 静态检查 → 执行/变异 → 人工采纳 → Metric Card`。随机抽样和对照组预先登记，避免只挑成功案例。输出保留 trace_id、时间、工具版本和 reviewer。

## Metrics and decisions
同时记录覆盖率、缺陷发现率、可执行率、重复率、人工编辑分钟、首次通过率、延迟和成本。提效定义为质量不下降前提下减少总工时，而非生成数量。决策表要求质量门、效率门和置信区间都满足，否则 `NOT_RUN` 或 `BLOCKED`。业务 KPI 由 owner 确认，不能从 fixture 外推。

## Baseline failure repair
基线故障是把生成条数当提效，或只比较 prompt 前后而没有人工成本。fault mutation 删除边界需求、插入重复用例、改变预期结果，Oracle 应发现 coverage/质量回退。修复为补充对照组、冻结版本、执行 mutation、记录人工修订，并保存 before/after diff。fixture 结果不等于团队 ROI。

## Method, oracle, prompt and eval
方法链为“需求切片 → 版本化 prompt → 用例 Oracle → mutation → 成本/质量 Metric Card”。Prompt 要求引用需求 locator、给出前置条件和负例；Oracle 检查可执行性、边界覆盖与断言质量。Eval 同时比较基线和 AI 组，mutation 反转断言、删除边界、制造重复，期望状态为 FAIL 或 BLOCK。
## Implementation notes and handoff
实验登记必须在生成前冻结需求版本、抽样方法、对照组和成本口径。候选用例进入静态 schema 检查后才允许执行；失败样本不可删除。Mutation 结果要与需求 locator 对齐，便于解释哪个边界被漏测。人工修订时间使用同一计时规则，质量和效率分开设门。若样本量不足、没有真实 baseline 或 reviewer 未签字，结论保持 NOT_RUN。将实验复制到新的模型或工具时，只能新增版本，不覆盖旧 evidence。

报告层必须展示 paired case：同一条需求在人工组与 AI 组中的用例、编辑记录、执行结果和 mutation 命中。统计时按任务或需求聚类，避免把同一需求派生出的多条用例误当独立样本；实验开始前登记最小可接受质量差异，结束后同时报告效应、区间和失败切片。
