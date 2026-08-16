# 测试开发 × AI 完整方案合同

更新时间：2026-08-11  
总体状态：`partial / release-blocked`  
证据边界：六个方案单元已完成机器合同骨架、25 维逐项评估、六类 repository-owned 架构视图、决策、逐页追溯、Gate、风险与 receipt 边界；只有 TD-P02 的合成离线红绿链在本轮新鲜运行。真实模型、企业系统、浏览器/移动端、平台集成、生产运维和从业者评审均保持 `NOT_RUN / unknown / not-reviewed`。

本文件是 [research/solution-architecture.json](research/solution-architecture.json) 的人类评审入口，不是发布通过证明。结构完整不能把 `partial` 升级为 `complete`，本地 Fixture 也不能升级为 integration、live、practitioner 或 production 证据。

## Scope and boundaries

本合同只约束六个方案单元的设计、证据和晋级边界。它不声明企业身份、真实 API、浏览器/真机、模型 Provider、GPU/队列、Jira/GitLab/Kubernetes、生产运维或从业者评审已经可用；这些边界在没有可复现 receipt 前一律保持 `NOT_RUN / unknown`。

## Solution units

| 方案单元 | 页面范围 | 设计 | 单元执行 | 从业者 | 发布 | 当前最强证据 |
|---|---|---|---|---|---|---|
| 需求到发布证据链 | TD-F01、TD-P01～P08 | partial | desk-researched | not-reviewed | internal | TD-P02 fresh `PASS→FAIL→PASS` fixture；其余页 NOT_RUN |
| API 与服务质量 | TD-PS01～PS03、PS09 | partial | desk-researched | not-reviewed | internal | 研究设计；真实 API/账本/事件 NOT_RUN |
| Web、Android、iOS 自动化 | TD-PS04～PS08 | partial | desk-researched | not-reviewed | internal | 研究设计；浏览器/模拟器/真机 NOT_RUN |
| 稳定性、性能与 Agent 压测 | TD-PS10～PS12、TD-AP01～AP08 | partial | desk-researched | not-reviewed | internal | 本地材料不外推；Provider/GPU/Queue/On-call NOT_RUN |
| 质量平台集成 | TD-QP01～QP04 | partial | desk-researched | not-reviewed | internal | 本地状态机材料；Jira/GitLab/Kubernetes NOT_RUN |
| AI 系统评测与治理 | 当前由 TD-P02 提供 Prompt/Eval/Mutation 边界，完整课程页仍在内部 | partial | desk-researched | not-reviewed | internal | 离线包结构；真实模型、Judge 校准、持续评测 NOT_RUN |

单元状态采用最弱闭环口径，不用某一页的较强证据代表整单元。例如 TD-P02 已有 Fixture receipt，但“需求到发布证据链”其余页面没有同等级执行证据，所以单元仍是 `desk-researched`。

## Maturity and evidence

成熟度分别记录设计、执行、从业者评审和发布状态，不能跨列推导。当前六个单元均为 `partial / desk-researched / not-reviewed / internal`；唯一成功执行证据是 TD-P02 的确定性 Fixture 红绿链，且只支撑该页面的 Fixture 级命题。

## 25 维评估规则

每个单元都在机器合同中包含且仅包含以下 25 个维度：目的与成功、范围与非目标、利益相关方与决策权、现状与基线、用例与需求、约束与依赖、备选与 ADR、上下文与组件、运行时状态、部署环境、接口集成、数据治理、AI 生命周期与人工权威、安全隐私合规、质量评测、性能容量成本、可靠性灾备、可观测与支持、实现与仓库、发布迁移回滚、交付资源与所有权、风险未知与债务、学习体验与复用工件、证据追溯与验收、演进版本与弃用。

当前所有单元都保持 `partial`；真实部署、接口、数据治理、安全评审、性能容量、可靠性、运维、回滚和组织所有权等维度保持 `gap`。每个 gap 都有问题、当前决策、工件引用、证据边界和 reviewer 字段，不用沉默代替结论。

## Architecture views

每个方案单元都有一个 repository-owned 视图文件，文件内分别提供 Context、Building block、Runtime、Deployment、Data flow 与 Security trust boundary 六张 Mermaid 图。每张机器记录还包含目的、节点、边、边界、失败路径、证据点和关联决策。

- [需求到发布证据链](research/solution-architecture/views/requirements-to-release.md)
- [API 与服务质量](research/solution-architecture/views/api-service-quality.md)
- [Web、Android、iOS 自动化](research/solution-architecture/views/ui-mobile-automation.md)
- [稳定性、性能与 Agent 压测](research/solution-architecture/views/reliability-agent-load.md)
- [质量平台集成](research/solution-architecture/views/quality-platform-integrations.md)
- [AI 系统评测与治理](research/solution-architecture/views/ai-evaluation-governance.md)

这些图中的外部系统均明确标记 `NOT_RUN`；图表示设计边界，不表示环境已存在或集成已经成功。

## Decisions and trade-offs

每个单元接受两项跨单元不变量，并为单元生成独立 ADR ID：

1. Fixture 与真实适配器分层。离线确定性门禁用于教学和检测力证明；只有控制环境中的真实边界运行才能成为 integration 或更强 evidence。
2. 模型不得批准自己的 Oracle 或专业决定。确定性 Oracle、独立评审或具名人工 owner 必须位于权限与发布 Gate 上。

代价是增加适配、评审和运行成本；收益是避免把“可生成”“可构建”或“一次绿灯”误写成专业可用。重新评审需要实际集成 receipt、误报漏报数据和具名责任人批准，不能仅凭更长正文。

## Traceability

机器合同已为 33 个公开页面建立至少一条精确链：

`coverage_cell_id → topic_id → page_id → scenario_id → artifact_ref → command_ref → execution_receipt_ref → assessment_ref → human_gate`

只有 TD-P02 在“需求到发布证据链”中引用 `REC-TD-P02-FIXTURE-20260811`。其余页面的 command 和 receipt 明确为 `NOT_RUN`，并链接 [NOT_RUN command contract](research/solution-architecture/validation/not-run-command.md)，防止研究文档冒充可执行证据。TD-P02 在“AI 系统评测与治理”单元仍引用 `NOT_RUN`，因为本次没有真实模型或 Judge 运行，不能借用确定性流水线证明模型评测能力。

## Execution receipt

[TD-P02 fixture receipt](research/solution-architecture/receipts/td-p02-fixture-20260811.json) 来自重新解压公开实验包后的本地执行：

- baseline：exit 0，`PASS`；
- 注入 shipped-order 行为缺陷：exit 1，`T-CANCEL-SHIPPED-01` 失败；
- repair：exit 0，`PASS`；
- 保存 Python 版本、精确命令、工作目录类型、输入与输出 SHA-256、观测断言、红灯、修复、绿灯和限制。

旧 trace 曾把 `RESULT=PASS` 指向 `provider=none / status=NOT_RUN` 的模型 receipt。完整方案合同不再使用该对象作为 PASS 证据；新的 fixture receipt 只证明本地确定性测试链，模型调用仍为 `NOT_RUN`。

其余五个单元各有一个结构化 NOT_RUN receipt，用于证明“没有执行”，而不是作为成功证据。

## Acceptance gates

每个单元都有设计、功能、安全、性能、可靠性、运维、回滚和学员迁移八类 Gate。当前：

- 设计 Gate：`conditional`，等待逐命题研究、具名 owner 和独立评审；
- 需求链功能 Gate：`conditional`，只覆盖 TD-P02 Fixture，不覆盖整单元；
- 其余功能、安全、性能、可靠性、运维、回滚、迁移：`unknown`；
- practitioner：`not-reviewed`；publication：`internal`。

因此当前不满足 `pilot`，更不满足 `public`。

## Risks and unknowns

每个单元至少保留两项开放风险：证据成熟度被夸大、组织责任人缺失。触发任一风险时，必须保持 `gap/unknown` 并阻断 pilot/public promotion。进一步风险包括合成数据偏差、真实身份与权限、网络/设备/队列差异、阈值无分母、Judge 未校准、运维与回滚未演练，以及学员迁移效果未知。

## Completion conditions

本合同阶段完成只表示“缺口被结构化且可验证”，不表示课程或方案完成。下一阶段仍必须：

1. 完成其余 promised 页的独立研究包与可执行物料；
2. 为实际集成薄切片生成真实 adapter receipt；
3. 由具名测试开发/AI QE、业务 owner 与安全 reviewer 审查相关维度和 Gate；
4. 关闭或正式接受 residual risk；
5. 只有满足完整方案合同的页面才能进入 pilot/public 投影。
