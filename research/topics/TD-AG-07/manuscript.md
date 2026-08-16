# TD-AG-07 Manuscript｜Economics 成本、长尾延迟与 goodput

Wave4 sync: page-specific task-step-tool workload, budget mutation, P95/P99 and goodput ledger, cost-tail repair, ring-specific capacity limits, and reusable cost card are represented in the source module.

Wave5 sync: added task-step-tool worked decisions, tail-budget diagnosis, capacity and cost migration artifacts, and ring-specific evidence limits.

## Professional problem
平均延迟和平均 token 费会掩盖 P99 超时、失败重试和低质量吞吐；没有 hard budget 就无法做工程取舍。

## Method and rationale
经济性尾部法：以 task trace 绑定结果、P95/P99、goodput、cost tail、hard budget 与 resource isolation，先排除失败任务再解释效率。 将质量、时延、成本放在同一任务分母中，避免用便宜但不可用的输出冒充提效。

## Runnable action
1. 在课程包根目录读取 TD-AG-07 的 成本预算 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-07 --phase cycle --report-dir reports/td-ag-07`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-07/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-07 的 HARD-BUDGET 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 HARD-BUDGET 映射到新的合成业务对象，填写 成本预算 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
TAILS 同时检查 p95/p99；GOODPUT 只计合格结果；COST-TAIL 与 HARD-BUDGET 防止长尾吞噬预算。 Eval 断言 TASK-TRACE、TAILS、GOODPUT、COST-TAIL、HARD-BUDGET、RESOURCE-ISOLATION。

## Prompt / Eval / Mutation
Prompt manifest 要求记录 task_trace、P95/P99、goodput、成本尾部、硬预算和资源隔离，不接受只报平均值。 Mutation 将 hard_budget 改为 false，模拟预算保护被移除而不改变平均指标。

## Failure diagnosis and repair
若 HARD-BUDGET 失败，查看超预算任务与重试链；若 GOODPUT 失败，检查质量门是否被平均吞吐掩盖。 repair 只能恢复 TD-AG-07 的 canonical contract，不能删除 HARD-BUDGET Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到 CI Agent 时按任务记录 token、工具耗时、P95/P99、合格率和预算 owner，再决定并发或模型路由。 当前只用合成任务 trace 计算指标结构；真实账单、线上负载、practitioner productivity 与 production cost gate 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
