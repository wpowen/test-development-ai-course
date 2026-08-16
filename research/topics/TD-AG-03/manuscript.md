# TD-AG-03 Manuscript｜Orchestration 编排、交接与三重预算

Wave4 sync: page-specific handoff schema loss, context poisoning, cascade timeout, three-budget circuit-breaker repair, and cross-team migration evidence are represented in the source module.

Wave6 sync: added D2 handoff-specific field/permission diagnosis, three-budget decisions, cross-dimension cascade analysis, and migration contracts.

## Professional problem
多 Agent 交接时事实可能丢失，且没有 step/time/cost 三重预算；系统会在错误上下文里继续执行。

## Method and rationale
交接契约法：先冻结 handoff schema 与事实字段，再验证隔离、事实存活数、step_limit、time_limit、cost_limit 和 stop_reason。 把“编排顺利”拆成可检查的上下文与预算合同，学习者才能判断应停在何处。

## Runnable action
1. 在课程包根目录读取 TD-AG-03 的 交接停止 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-03 --phase cycle --report-dir reports/td-ag-03`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-03/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-03 的 STOP-REASON 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 STOP-REASON 映射到新的合成业务对象，填写 交接停止 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
FACT-SURVIVAL 要求至少 5 个事实跨交接保留；TRIPLE-BUDGET 检查三种预算同时存在；STOP-REASON 不能为空。 Eval 逐项断言 HANDOFF、FACT-SURVIVAL、ISOLATION、TRIPLE-BUDGET、STOP-REASON，失败后输出下游不可继续的理由。

## Prompt / Eval / Mutation
Prompt manifest 输入 handoff_schema、facts_survive、isolation、step_limit、time_limit、cost_limit、stop_reason，并禁止隐式补全。 Mutation 清空 stop_reason；其他字段保持原值，模拟无限重试而非普遍模型失败。

## Failure diagnosis and repair
若 STOP-REASON 失败，检查上游是否写入结构化停止原因；若 FACT-SURVIVAL 失败，比较交接前后事实键集合。 repair 只能恢复 TD-AG-03 的 canonical contract，不能删除 STOP-REASON Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到研发流水线时为每个子 Agent 规定输入/输出 schema、预算 owner、重试上限和升级路径。 本页只证明合成编排数据的交接与预算检查；真实多 Agent 运行、在线成本、practitioner handoff、production SLA 和 learner transfer 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
