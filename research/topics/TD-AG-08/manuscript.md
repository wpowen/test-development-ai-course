# TD-AG-08 Manuscript｜Governance 业务规则、四版本链与审计

Wave4 sync: page-specific four-dimension lineage drift, business-rule blocker, named risk acceptance, rollback repair, ring decision, and governance card transfer are represented in the source module.

Wave5 sync: added lineage-drift worked decisions, audit-chain diagnosis, governance migration cards, and named risk-acceptance promotion limits.

## Professional problem
模型、Prompt、工具、记忆任何一项漂移，都可能让同一业务规则得到不可复现的结果；缺少 owner 就无法追责。

## Method and rationale
四版本审计法：把 business_rules、audit_chain、model/prompt/tool/memory 四版本、human_owner 与 rollback 绑定为一条可回放记录。 版本链让问题从“模型变了”具体落到可比较的变更和回滚动作。

## Runnable action
1. 在课程包根目录读取 TD-AG-08 的 版本治理 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-08 --phase cycle --report-dir reports/td-ag-08`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-08/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-08 的 FOUR-VERSION 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 FOUR-VERSION 映射到新的合成业务对象，填写 版本治理 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
FOUR-VERSION 要求四类版本齐全；AUDIT 连接业务规则与事件；OWNER、ROLLBACK 保证有人能批准和恢复。 Eval 断言 BUSINESS-RULES、AUDIT、FOUR-VERSION、OWNER、ROLLBACK 五项，并核对 tool_version 变异。

## Prompt / Eval / Mutation
Prompt manifest 记录四版本哈希、规则引用、事件序列、owner 和 rollback 指针，禁止用当前版本覆盖历史。 Mutation 将 tool_version 改为 false，模拟工具契约漂移；其他版本保持稳定。

## Failure diagnosis and repair
若 FOUR-VERSION 失败，比较四个版本字段与审计链；若 OWNER 失败，结论只能是 BLOCKED。 repair 只能恢复 TD-AG-08 的 canonical contract，不能删除 FOUR-VERSION Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到企业 RAG 时，将知识库快照、检索器、Prompt、模型、工具和记忆版本写入同一发布 receipt。 四版本结论来自离线治理 fixture；真实企业审计、在线模型漂移、practitioner accountability 与 production rollback 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
