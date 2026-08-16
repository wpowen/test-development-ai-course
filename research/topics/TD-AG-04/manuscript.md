# TD-AG-04 Manuscript｜Human takeover 人工接管、脏状态与回滚

Wave4 sync: page-specific pre/post-authorization interruption fixture, dirty-state rollback, takeover owner, confirmation-fatigue ring boundary, and reusable human-control checklist are represented in the source module.

## Professional problem
高影响动作需要人在环；如果中断后留下 dirty state，人工接管可能重复提交或无法回滚。

## Method and rationale
接管回滚法：在指定 interrupt_step 注入暂停，分别记录 dirty_state、rollback、takeover、approval、owner，再验证状态恢复。 先证明可暂停和可回滚，才有资格讨论自动化比例或无人值守。

## Runnable action
1. 在课程包根目录读取 TD-AG-04 的 人工回滚 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-04 --phase cycle --report-dir reports/td-ag-04`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-04/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-04 的 ROLLBACK 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 ROLLBACK 映射到新的合成业务对象，填写 人工回滚 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
NO-DIRTY-STATE 要求 dirty_state=false；ROLLBACK、TAKEOVER、APPROVAL-OWNER 共同证明人工接管可执行且有责任人。 Eval 检查 INTERRUPT、NO-DIRTY-STATE、ROLLBACK、TAKEOVER、APPROVAL-OWNER 五个独立 Oracle。

## Prompt / Eval / Mutation
Prompt manifest 固定 interrupt_step=2，并要求输出状态快照、回滚动作、审批人和接管人，不允许把暂停写成成功。 Mutation 将 rollback 改为 false；故障模拟中断后无法恢复，而不改变审批字段。

## Failure diagnosis and repair
若 ROLLBACK 失败，先对照状态快照确认哪一步产生脏写；若 APPROVAL-OWNER 失败，停止任何自动执行。 repair 只能恢复 TD-AG-04 的 canonical contract，不能删除 ROLLBACK Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到发布或数据修复流程时，设计 dry-run、人工批准、幂等键、补偿动作和回滚 owner。 这是离线接管状态机 fixture；真实人工值班、企业权限、生产回滚演练、practitioner sign-off 与 learner transfer 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
