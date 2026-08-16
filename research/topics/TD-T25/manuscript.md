# Capstone Fixture Release Candidate

## Professional problem — 最终绿报告不能替代首个红灯和全链闭包

退款 RAG+Agent 可能引用过期政策、越权调用工具、在并发下变慢，还可能因 Judge 漂移假绿。只交聊天截图或最终 PASS 无法证明系统能发现坏版本。Capstone 必须把 PRD/risk、Dataset/Split、Prompt/Input/Schema、Composite Oracle、Benchmark/CI、Trace regression、性能成本、waiver 和 rollback 连成可追溯仓库。

方法选择“需求到证据闭包 + mutation kill”。每个 requirement/risk 都有 test、owner 和 evidence；Prompt/Eval/Mutation 共享版本 manifest；独立 Oracle 先判权限、引用等 blocker；Mutation 令 capstone_trace_complete=false。Artifact owner、SHA-256 和 receipt 共同防止手抄结论。

## Runnable action — 0→1→0 是 release candidate 的最低证据

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-T25 --phase baseline
python3 scripts/run_lab.py --topic TD-T25 --phase fault
python3 scripts/run_lab.py --topic TD-T25 --phase repair
~~~

baseline exit 0 表示 Fixture 工件链满足当前合同；fault exit 1 应显示 capstone_trace_complete=false 并回链到缺失节点；repair exit 0 必须恢复 observation，而不改 Oracle。三份 receipt、manifest 与 ZIP member hash 要一致，且状态始终停在 fixture release candidate。

## Failure and repair — 从缺失 trace 边开始，不从展示页面补字

fault 假绿时检查 trace matrix 是否真正被 runner 消费、所有 artifact 是否有 owner/hash、report 是否引用当前 manifest。repair 仍红时沿 requirement→risk→test→run→evidence→decision 查第一条断边。不能伪造 receipt、复用旧绿报告、删除 blocker 或把 NOT_RUN 改成 PASS。

迁移到事故摘要项目时，替换退款场景和业务 Oracle，但保留全链结构；至少注入权限、过期知识或 lineage 故障中的一个。完成条件是坏版本可重复失败、可定位、可修复，所有 unknown 仍可见。

### Evidence boundary

Capstone 最高为 PASS-FIXTURE release candidate。模型、真实 RAG/Agent、企业集成、从业者评审、publication 与 production 全部 NOT_RUN；闭包不是上线许可。

## Capstone 复盘

计算式 walkthrough：追踪矩阵有 12 个高风险 requirement，11 条有 test/evidence/owner，coverage=91.7%，但缺 1 条权限风险仍必须 BLOCKED。修复补齐映射后重跑 baseline/fault/repair、hash closure 和 unknown register；真实项目要新增 provider、integration、practitioner、learner 与 live/production 门禁。

从 PRD 风险追到 Dataset、Prompt/Input/Schema、Composite Oracle、CI、Trace regression、性能、Waiver 和 rollback；每个 mutation 有 owner、receipt、失败证据和修复重跑。先验证 hash closure，再 baseline 0，注入权限/引用/性能 fault 变 1，最后不改 expected 地 repair 回 0。无需求映射查 traceability，改 expected 查三阶段 hash，ZIP 不一致逐 member 对账，fixture 被写成 live 则恢复 NOT_RUN/FIXTURE_ONLY。合格出口是 fixture RC，不是生产证明。

边界：本页仅 fixture/static release candidate；真实 model/provider、enterprise integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN。

当前仅 fixture/static release candidate；真实模型/provider、enterprise integration、practitioner、learner observation、live、production 和 publication 均 NOT_RUN。闭包不是上线许可。

## 发布候选评审演练

评审者不要从首页演示开始，而要随机抽一条高风险需求，沿 requirement→risk→test condition→case/data→独立 Oracle→baseline/fault/repair receipt→decision 反向核对。每个节点必须能打开当前文件、显示 owner 与 hash，并说明下游消费者；任何断边都输出 BLOCKED，不能用其他页面的平均通过率补偿。

随后执行三类破坏性复核：删除一条权限映射，确认 coverage 缺口被发现；替换一个旧 ZIP member，确认 artifact closure 失败；把 fault 的 expected 改宽，确认 Oracle integrity 能拦截假修复。三类故障都能定位并恢复后，才能得到 fixture release candidate；真实模型、企业集成、从业者、学习者和生产发布仍分别 NOT_RUN。

学习者最终提交 decision record，分栏记录 Evidence、Inference、Unknown、hard blocker、剩余风险、补证据 owner、到期时间和 rollback。迁移到自己的系统时只能复用字段与审查顺序，必须替换业务规则、数据、权限、模型/工具版本和具名发布责任人。
