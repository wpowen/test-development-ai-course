# TD-AG-10 Manuscript｜高风险 Agent：建议与执行分离、硬限额与双批准

Wave4 sync: page-specific stale-market/high-risk adapter fixture, advice-versus-execution boundary, hard-limit and dual-approval blocker, rollback repair, and regulated migration checklist are represented in the source module.

Wave5 sync: added high-risk adapter worked decisions, freshness/approval/limit diagnosis, regulated migration artifacts, and four-ring execution boundaries.

## Professional problem
涉及资金、删除或高影响决定时，建议文本一旦越过执行边界就会产生不可逆后果。

## Method and rationale
高风险隔离法：先写 timestamp，再分开 advice/execution，施加 capability sandbox、hard limit、dual approval、kill switch，并声明 no_real_funds。 安全关键不是让 Agent 更聪明，而是让危险动作在权限和审批上不可隐式发生。

## Runnable action
1. 在课程包根目录读取 TD-AG-10 的 高风险限额 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-10 --phase cycle --report-dir reports/td-ag-10`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-10/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-10 的 HARD-LIMIT 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 HARD-LIMIT 映射到新的合成业务对象，填写 高风险限额 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
ADVICE-EXECUTION 检查建议与执行分离；HARD-LIMIT、DUAL-APPROVAL、KILL-SWITCH 和 NO-REAL-FUNDS 构成最后防线。 Eval 断言 TIMESTAMP、ADVICE-EXECUTION、SANDBOX、HARD-LIMIT、DUAL-APPROVAL、KILL-SWITCH、NO-REAL-FUNDS。

## Prompt / Eval / Mutation
Prompt manifest 固定时间戳、能力沙箱、硬限额、双批准、kill switch 与无真实资金标志，输出建议不得触发副作用。 Mutation 将 hard_limit 改为 false，模拟危险动作失去上限；其余批准和 kill switch 保持不变。

## Failure diagnosis and repair
若 HARD-LIMIT 失败，立即阻断执行并记录时间戳、请求人和批准链；不能用文本解释覆盖硬门。 repair 只能恢复 TD-AG-10 的 canonical contract，不能删除 HARD-LIMIT Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到支付、删除或生产变更流程时，用 dry-run、双人批准、最小能力、可撤销令牌和独立 kill switch。 当前仅为无真实资金的高风险状态 fixture；真实建议、执行权限、practitioner approval、production action 与 learner transfer 均 NOT_RUN.

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
