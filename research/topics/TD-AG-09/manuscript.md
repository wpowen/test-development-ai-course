# TD-AG-09 Manuscript｜四证据环与离线到在线的成熟度门

Wave4 sync: page-specific offline/sandbox/shadow/online fixture contract, hard/statistical/risk-acceptance gate separation, failed-ring repair, and NOT_RUN upgrade handoff are represented in the source module.

Wave5 sync: added four-ring worked decisions, ring-specific failure diagnosis, promotion artifacts, and explicit evidence-insufficient handling.

## Professional problem
离线分数通过不代表可以在线；如果没有 sandbox、shadow、online 的风险接受和硬红线，发布只是猜测。

## Method and rationale
成熟度阶梯法：按 offline、sandbox、shadow、online 四环登记证据，明确 statistical gate、hard redline、risk acceptance 与 receipt maturity。 把“已测”与“可发布”拆开，避免 fixture PASS 被误写成生产结论。

## Runnable action
1. 在课程包根目录读取 TD-AG-09 的 成熟度红线 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-09 --phase cycle --report-dir reports/td-ag-09`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-09/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-09 的 HARD-REDLINE 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 HARD-REDLINE 映射到新的合成业务对象，填写 成熟度红线 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
UNRUN-BOUNDARY 必须保留 shadow/online=NOT_RUN；HARD-REDLINE、STATISTICAL、RISK-ACCEPTANCE、RECEIPT 共同决定能否升环。 Eval 断言 OFFLINE、SANDBOX、UNRUN-BOUNDARY、HARD-REDLINE、STATISTICAL、RISK-ACCEPTANCE、RECEIPT。

## Prompt / Eval / Mutation
Prompt manifest 为四环分别记录输入、门槛、证据 owner 和 receipt；shadow、online 明确写 NOT_RUN。 Mutation 将 hard_redline 改为 false；模拟离线分数很好但关键风险未设硬门。

## Failure diagnosis and repair
若 HARD-REDLINE 失败，停止晋级；若 UNRUN-BOUNDARY 失败，检查是否把规划写成已执行。 repair 只能恢复 TD-AG-09 的 canonical contract，不能删除 HARD-REDLINE Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到线上客服 Agent 时先补 sandbox 与 shadow 的真实 owner、分母、回滚和风险签收，再讨论 online。 本页只演示离线/沙箱记录结构，shadow 与 online 明确 NOT_RUN；没有 live、practitioner、production 或 learner gate 证据。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
