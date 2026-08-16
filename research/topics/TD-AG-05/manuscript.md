# TD-AG-05 Manuscript｜Reliability 重复运行、pass@k 与 pass^k

Wave4 sync: page-specific repeated-task fixture, pass@k/pass^k and horizon mutation, clustered decision repair, ring maturity boundary, and reliability Metric Card transfer are represented in the source module.

Wave5 sync: added repeated-task worked decisions, state-reset and denominator diagnosis, horizon migration artifacts, and four-ring reliability promotion limits.

Wave6 sync: added reliability depth expansion with task-clustered decision evidence and horizon-specific transfer notes.

## Professional problem
单次成功会掩盖长轨迹失败；把 pass@k 和 pass^k 混称会错误估计 Agent 在连续任务中的可靠性。

## Method and rationale
分布可靠性法：按任务与运行重复采样，分别计算 pass@k、pass^k，使用 clustered CI、horizon buckets 和 sample_reason 描述分母。 把“能否找到一次成功”与“连续多步都成功”分离，才能制定可信的上线门槛。

## Runnable action
1. 在课程包根目录读取 TD-AG-05 的 可靠性聚类 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-05 --phase cycle --report-dir reports/td-ag-05`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-05/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-05 的 CLUSTERED-CI 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 CLUSTERED-CI 映射到新的合成业务对象，填写 可靠性聚类 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
PASS-K-SEPARATE 要求 pass_at_k 不被当作 pass_all_k；CLUSTERED-CI、HORIZON、SAMPLE-REASON 约束统计解释。 Eval 断言 TASKS、REPEATS、PASS-K-SEPARATE、CLUSTERED-CI、HORIZON、SAMPLE-REASON，并保存分母。

## Prompt / Eval / Mutation
Prompt manifest 冻结 tasks=12、runs=5、两种通过率、置信区间聚类方式、轨迹长度桶和抽样理由。 Mutation 将 clustered_ci 改为 false，模拟把相关重复当成独立样本。

## Failure diagnosis and repair
若 CLUSTERED-CI 失败，回查任务簇与重复运行键；若 PASS-K-SEPARATE 失败，重算两种定义而非调阈值。 repair 只能恢复 TD-AG-05 的 canonical contract，不能删除 CLUSTERED-CI Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到回归集时按任务 ID 分层报告成功率、轨迹长度、成本和 CI，并为短轨/长轨设置不同观察窗。 本页仅在 12 个合成任务上演示统计结构；真实模型稳定性、线上样本、practitioner reliability 与 production SLO 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
