# TD-AG-01 Manuscript｜Judge 裁判模型校准与偏差检测

Wave4 sync: page-specific 12-answer gold fixture, order/length/fact probes, Judge red-repair decision, four-ring limits, and reusable Judge Card handoff are represented in the source module.

## Professional problem
Judge 可能因选项顺序或事实缺口改变结论；只报告一个总分会把裁判偏差误认为 Agent 能力。

## Method and rationale
双顺序裁判卡法：冻结 GOLD、独立 HUMAN-LABELS、A→B/B→A 两种顺序和 FACT-BLOCKER，再用 JUDGE-CARD 记录判定理由。 先验证裁判稳定性，才能把模型输出质量与评测器质量分开归因。

## Runnable action
1. 在课程包根目录读取 TD-AG-01 的 裁判顺序 Prompt、Eval、Mutation manifest，并确认输入版本与 fixture hash。
2. 执行 `python3 site/public/materials/agent-architecture-system/scripts/agent_architecture_lab.py --topic TD-AG-01 --phase cycle --report-dir reports/td-ag-01`，脚本只生成确定性 baseline、fault、repair 三份报告。
3. 打开 `reports/td-ag-01/cycle-summary.json`，必须观察 `observed_exit_codes=[0,1,0]`；再阅读 fault 的 `failed_oracle_ids`。
4. 用独立 Oracle 对照 TD-AG-01 的 ORDER-STABLE 字段；模型回答、Judge 分数和人工印象都不能替代这张验收单。
5. 把 ORDER-STABLE 映射到新的合成业务对象，填写 裁判顺序 专属 owner、threshold、source_refs 与 stop_state；缺项保持 UNKNOWN/BLOCKED。

## Independent Oracle
ORDER-STABLE 比较 order_ab 与 order_ba；FACT-BLOCKER 检查事实不足时是否拒绝臆判，二者均独立于生成模型。 Eval 对 A/B 顺序交换、事实阻断和人工标签分别断言 GOLD、HUMAN-LABELS、ORDER-STABLE、FACT-BLOCKER、JUDGE-CARD。

## Prompt / Eval / Mutation
Prompt manifest 固定 gold、human_labels、order_ab、order_ba、fact_blocker、card 六字段，明确不可根据结果改答案。 Mutation 仅把 order_ba 改成 B，模拟位置偏差；不要同时改变 gold 或人工标签。

## Failure diagnosis and repair
若失败列表缺 ORDER-STABLE，先检查裁判输入是否真的交换；若缺 FACT-BLOCKER，检查证据不足时的拒答分支。 repair 只能恢复 TD-AG-01 的 canonical contract，不能删除 ORDER-STABLE Oracle、放宽权限、改变 expected，或把 NOT_RUN 改成 PASS。

## Beginner explanation
先把 Agent 当成可追踪的实习生：Prompt 是任务单，Eval 是验收单，Mutation 是故意制造的一处坏改动，Oracle 是不听解释的独立检查员。读报告时先看失败字段，再看证据来源，最后才讨论修复。

## Transfer and evidence boundary
迁移到摘要或 RAG 评测时建立任务专属 gold 与双人标签，记录裁判版本和冲突升级人。 这是确定性 judge fixture 的偏差训练，不是模型排行榜或真实裁判一致性结论；live judge、practitioner calibration、production gate 与 learner transfer 均 NOT_RUN。

## Reusable worksheet
填写：topic_id、专业风险、输入/版本、Prompt hash、Oracle IDs、Mutation 字段、实际命令、0/1/0 退出码、failed_oracle_ids、owner、阈值依据、source_refs、stop_state、repair 证据。Evidence、Inference、Unknown 三栏必须分开。
