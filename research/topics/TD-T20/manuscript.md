# CI 分层门禁

## Professional problem — 报告红了而流水线仍绿，就是没有门禁

高风险退款用例已经失败，评测 job 却配置 continue-on-error，合并请求仍显示绿色。CI 的价值不是自动生成报告，而是把风险决定变成不可绕过的退出语义。本页把 Gate 分为 PR smoke、nightly regression 和 release candidate 三层：快层杀结构与权限 blocker，慢层扩大切片和重复运行，发布层核对版本、waiver 与 owner。

方法选择“blocker-first DAG”。Prompt 是候选版本的一部分；Eval 输出逐 case 结果；Mutation 将 blocking_exit_propagated 改为 false；独立 Oracle 依据固定风险合同判定，不让候选模型自行决定是否阻断。聚合顺序固定为 blocker→高风险切片→总体指标。

## Runnable action — 0→1→0 必须穿透到 shell

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-T20 --phase baseline
python3 scripts/run_lab.py --topic TD-T20 --phase fault
python3 scripts/run_lab.py --topic TD-T20 --phase repair
~~~

baseline exit 0 代表 Fixture Gate 接受已知好观察；fault exit 1 应显示 blocking_exit_propagated=false，证明报告失败会阻止晋级；repair exit 0 说明非零传播恢复。三阶段 expected、Prompt/Input/Schema/Eval 版本必须一致，只有 observation 被 Mutation 改坏再修复。

## Failure and repair — 追踪第一个吞掉 exit 1 的边界

若 fault 仍绿，先单独运行命令并立即读 shell 退出码，再检查 runner、package script、CI job 和依赖 job 是否用了忽略错误设置。若 repair 失败，确认恢复的是传播链，而非删除高风险 case 或把 blocker 变成 warning。报告 artifact 还要绑定当前 SHA，旧绿报告不得覆盖新失败。

迁移到事故助手时，PR 层检查 Schema/PII，nightly 层跑严重度与长 Context，release 层核对 runbook/权限/回滚 owner。通过条件是任一 P1 blocker 都能在对应层稳定终止 promotion。

### Evidence boundary

当前是 PASS-FIXTURE。真实 GitHub/GitLab CI、云 runner、模型、企业审批和发布分支均 NOT_RUN；本地退出码不能冒充线上 Gate 已部署。

## CI 门禁复盘

计算式 walkthrough：L1 有 120 个高风险 case、2 个 blocker，blocker rate=2/120；即使总体通过率 98.3%，仍必须停止 promotion。修复只改退出码传播或聚合逻辑，再复跑同一 fault；迁移到 Agent 换成越权工具，RAG 换成过期引用，验收仍要求同分母、exit 1 和 owner receipt。

把 CI 当质量控制面：L0 阻断 Schema/权限/manifest，L1 运行历史事故和高风险切片，L2 做重复与漂移，L3 才允许 release candidate。故意令 `blocking_exit_propagated=false`，验证报告上传成功但 promotion 仍停止；迁移到 RAG 或 Agent 只替换切片和 Oracle，红线、统计、风险接受顺序不变。诊断报告 FAIL 但 CI 绿查 continue-on-error；高风险下降查逐题分母；旧报告覆盖新 SHA 查 lineage。

边界：本页仅 fixture/static 合同；真实 model/provider、integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN。

案例工件：退款知识库改错后 L0 仍通过，L1 发现两条错误承诺。提交 job graph、退出码证明、失败 artifact 和停止 promotion receipt。真实 CI、模型/provider、integration、practitioner、learner observation、live/production/publication 均 NOT_RUN；仅 fixture/static evidence。
