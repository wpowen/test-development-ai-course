# TD-AG-06 Manuscript｜Security 注入、MCP 权限与租户隔离

Wave4 sync: page-specific document injection, mutable MCP manifest, memory contamination, tenant-scope blocker, Kill Switch repair, and four-ring security acceptance are represented in the source module.

## Professional problem
Agent 遇到 prompt injection 或恶意工具时，最危险的不是答错，而是跨租户读写和扩大工具权限。

## Method and rationale
最小权限攻击法：冻结攻击样本、manifest hash、tenant、scope、sandbox、side-effect 和 blast radius，再逐条证明拒绝路径。 安全评测必须观察权限与副作用，而不能只看回复是否礼貌。

## Runnable action
1. 在课程包根目录读取 TD-AG-06 的 租户隔离 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-06 --phase cycle --report-dir reports/td-ag-06`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-06/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-06 的 TENANT 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 TENANT 映射到新的合成业务对象，填写 租户隔离 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
TENANT 检查租户隔离；SCOPE 与 SANDBOX 约束最小能力；BLAST-RADIUS 要求失败影响可界定且有 owner。 Eval 断言 ATTACK-CASES、MANIFEST、TENANT、SCOPE、SANDBOX、NO-SIDE-EFFECT、BLAST-RADIUS。

## Prompt / Eval / Mutation
Prompt manifest 包含 8 个攻击案例、工具 manifest hash、租户标识、最小 scope 与 sandbox 开关，禁止真实副作用。 Mutation 将 tenant_isolation 改为 false；只制造跨租户边界缺口，保持攻击样本和 hash 不变。

## Failure diagnosis and repair
若 TENANT 失败，立刻停止并检查请求租户、凭证和资源前缀；禁止以“模型拒答”代替权限证据。 repair 只能恢复 TD-AG-06 的 canonical contract，不能删除 TENANT Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到飞书或 MCP 接入时，为每个工具登记 hash、租户、scope、sandbox、审计 owner 和撤销办法。 安全结论只来自无网络合成攻击 fixture；真实凭证、在线 MCP、practitioner red-team、production security approval 与 learner transfer 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
