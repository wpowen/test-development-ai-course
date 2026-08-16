# TD-AG-00 Manuscript｜Agent 测试架构总览与边界登记

Wave6 sync: added a page-specific D0-D7 architecture overview, cascade links, four-ring entry/exit decisions, risk ledger, and unknown-register artifacts.

## Professional problem
架构图如果只有节点名称，测试开发工程师仍无法证明 D0-D7 的输入、权限、状态、四证据环和责任人已经闭合。

## Method and rationale
边界闭合表法：先把输入、D0-D7 域、四证据环、guard、owner、Oracle 写成不可省略的字段，再以一条故障只破坏 OWNER-ORACLE 做反例。 这样学习者能把“画架构”转换成可审计的风险清单，而不是凭图形判断覆盖率。

## Runnable action
1. 在课程包根目录读取 TD-AG-00 的 架构边界 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-00 --phase cycle --report-dir reports/td-ag-00`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-00/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-00 的 OWNER-ORACLE 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 OWNER-ORACLE 映射到新的合成业务对象，填写 架构边界 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
OWNER-ORACLE 同时检查 owners 与 oracles；故障态必须列出 OWNER-ORACLE，不能用模型质量解释。 Eval 读取 baseline、fault、repair 的 failed_oracle_ids，并核对 INPUTS、D0-D7、FOUR-RINGS、GUARDS、OWNER-ORACLE。

## Prompt / Eval / Mutation
Prompt manifest 以 boundary.inputs/domains/rings/guards/owners/oracles 为输入，固定 TD-AG-00 fixture。 Mutation 只将 boundary.oracles 从 true 改为 false，禁止调阈值或删除检查。

## Failure diagnosis and repair
若 fault 返回 []，说明 Oracle 没有独立读取边界字段；若出现 OWNER-ORACLE，回看 owner/oracle 责任矩阵。 repair 只能恢复 TD-AG-00 的 canonical contract，不能删除 OWNER-ORACLE Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到客服 Agent 时重填会话输入、工具权限、状态字段、四环证据和批准人；架构图必须伴随边界表。 本页仅以离线合成边界 fixture 证明闭环；真实模型、在线工具、企业数据、practitioner review、learner transfer 与 production deployment 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
