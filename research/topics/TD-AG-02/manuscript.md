# TD-AG-02 Manuscript｜Trace 级轨迹、工具调用与首错定位

Wave4 sync: page-specific outcome/step/trajectory fixture, forbidden write span, first-error repair, ring boundaries, and learner trace-ledger transfer are represented in the source module.

Wave5 sync: added D1 worked decisions, span-level fault diagnosis, trajectory-ledger migration artifacts, and ring-specific promotion boundaries.

## Professional problem
最终答案正确并不代表过程安全；一次被禁止的工具调用或缺失的首错 span 可能被最后的文本掩盖。

## Method and rationale
轨迹首错法：把 outcome、每步 action、工具参数、授权结果、trace 完整性和 first_error 置于同一事件序列，优先定位最早违反合同的 span。 首错定位能阻止团队在下游输出上反复调 Prompt，却漏掉真正的权限或状态根因。

## Runnable action
1. 在课程包根目录读取 TD-AG-02 的 轨迹首错 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-02 --phase cycle --report-dir reports/td-ag-02`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-02/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-02 的 STEP-SAFETY 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 STEP-SAFETY 映射到新的合成业务对象，填写 轨迹首错 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
STEP-SAFETY 检查 prohibited_calls=0 且 authorized；FIRST-ERROR 要求首个异常 span 可回指，TRACE-COMPLETE 检查链条无洞。 Eval 分别验证 OUTCOME、STEP-SAFETY、TRACE-COMPLETE、FIRST-ERROR，不接受只给最终文本的替代证据。

## Prompt / Eval / Mutation
Prompt manifest 要求输出 trace.outcome、prohibited_calls、authorized、complete、first_error，并保留原始事件顺序。 Mutation 把 prohibited_calls 从 0 改为 1；故障只增加一次越权调用，不重写 outcome。

## Failure diagnosis and repair
failed_oracle_ids 出现 STEP-SAFETY 时查看调用参数和权限快照；出现 FIRST-ERROR 时定位 trace 中最早异常 span。 repair 只能恢复 TD-AG-02 的 canonical contract，不能删除 STEP-SAFETY Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到 Playwright 或 MCP 工具链时，为每步保留 action、参数、授权、结果、时间戳和首错指针。 当前只执行离线 trace fixture；真实 Agent trace、在线工具副作用、practitioner incident review、production observability 与 learner transfer 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
