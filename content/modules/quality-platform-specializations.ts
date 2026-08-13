import type { TutorialPage } from "../course.ts";
import { qualityPlatformDeepBlocks } from "./quality-platform-deep.ts";
import { composeDeepPage } from "./deep-layer.ts";

const wave3QualityPlatformDepth = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-QP01": [{ title: "QP01 Worked example：PROJ-42 revision 7 的 Basis Gate", body: ["假设 Jira webhook 报告需求变化，但回读发现 issue 当前 revision 已是 7，技术方案仍引用 revision 6。学习者先保存 event id、issue key、revision、changelog、actor、tenant 和 source snapshot hash，再决定状态是 ACCEPTED 还是 BLOCKED；没有当前验收条件不能让 AI 生成可执行副作用。", "接着把候选分成 proposed、approved、rejected、superseded，并让产品 owner、技术 owner、测试 owner 和 reviewer 分别承担语义、约束、Oracle 与批准责任。AI 只整理证据，不能替代 reviewer。交付 Basis Pack、冲突表、候选 provenance 和批准 receipt。"], table: { headers: ["检查", "失败表现", "工件"], rows: [["revision/changelog", "旧方案仍可用", "当前快照与 hash"], ["source_ref", "摘要无依据", "引用坐标表"], ["actor/scope", "跨项目读取", "权限回读"], ["review decision", "无人批准仍执行", "批准/拒绝 receipt"]], caption: "需求事件是触发器，不是当前事实。" } }, { title: "QP01 反例与迁移", body: ["把 webhook payload 直接交给模型看起来快速，但它可能缺字段、过期或被重放；把 Jira 评论表情当批准也无法证明 reviewer 身份和范围。修复必须回读当前 issue/changelog，并把批准绑定 revision。", "迁移到真实 Jira 前先做 capability probe：字段、transition、权限、签名、限流、审计和撤销路径逐项确认。静态 fixture 只能证明分支检测，真实 provider/model、integration、practitioner review、learner observation、live 与 production 审批均 NOT_RUN。"], table: { headers: ["症状", "怀疑层", "下一步与修复"], rows: [["候选引用缺失", "Basis/source", "阻断并补 source_ref"], ["批准来自旧 revision", "review scope", "重新回读并 supersede"], ["重复 webhook", "Inbox 去重", "按 event id 抑制"], ["Jira 403/429", "adapter 权限", "保留 outbox，不写成功"]], caption: "每个诊断都要留下可回读 receipt。" } }, { title: "QP01 迁移工件", body: ["交付字段契约、Basis Gate 规则、候选 schema、review matrix、supersede/rollback SOP 和一份带冲突的脱敏事件。用同一份材料指导新人从需求解析走到人工批准，未知权限和真实审批结果必须显式列出。"], bullets: ["当前 revision 优先", "人工批准有身份和范围", "冲突不自动裁决"] }],
    "TD-QP02": [{ title: "QP02 Worked example：MR 9 的旧 SHA 竞态", body: ["MR 9 先产生 commit A 和绿色 Pipeline 501，随后推送 commit B；如果旧 Pipeline 事件晚到，平台不能把 A 的 JUnit 和 status 绑定到 B。学习者回读 MR HEAD、pipeline SHA、required suite、artifact digest、approval rule 后，只有全部属于当前 SHA 才能进入 gate。", "把 test pass、flaky、error、skipped、缺 suite 分开聚合，并记录 run_id、policy_version 和 source hash。交付 SHA-bound manifest、JUnit 聚合摘要、stale evidence 诊断和拒绝 receipt。"], table: { headers: ["证据", "错误解释", "修复"], rows: [["MR HEAD=B、pipeline=A", "旧绿灯可复用", "阻断 stale SHA"], ["JUnit 缺 contract suite", "unit 全绿即通过", "补齐 required suite"], ["artifact hash 漂移", "下载成功", "校验 digest"], ["status 延迟到达", "当前 MR 绿色", "按 run/pipeline 关联"]], caption: "状态颜色不能替代版本绑定。" } }, { title: "QP02 反例与迁移", body: ["只看 GitLab merge badge 看起来符合自动化，但无法说明报告属于哪个 commit；手改 XML 的 SHA 更会破坏审计。迁移到真实 GitLab 前要验证 API tier、Runner、protected branch、status check、权限和报告格式。", "本地 fixture 仅证明旧 SHA、缺报告和缺 suite 能被阻断；真实 provider/model、integration、practitioner review、learner observation、live 与 production CI 均 NOT_RUN。"], table: { headers: ["症状", "怀疑层", "下一步与修复"], rows: [["绿色状态对应旧 commit", "SHA binding", "重新运行当前 HEAD"], ["部分 suite 未上报", "聚合器", "按 required set 阻断"], ["artifact 下载异常", "完整性", "保留 digest 与来源"], ["重复回调", "幂等键", "按 pipeline/run 去重"]], caption: "门禁输出必须可回链到 MR 和 artifact。" } }, { title: "QP02 迁移工件", body: ["交付 MR evidence manifest、JUnit schema、current-SHA gate、stale-race fault/repair 报告和保护分支检查清单。让新人能复制输入、运行离线 cycle、解释失败并知道真实集成前缺哪些 receipt。"], bullets: ["SHA 是质量证据主键", "缺 suite 不算完整", "旧结果不能跨版本传播"] }],
    "TD-QP03": [{ title: "QP03 Worked example：run-42 临时环境闭环", body: ["为 run-42 创建 namespace 时，provisioner 只能使用模板和最小 Role，runner 只能创建本 namespace 的测试 Job，cleaner 只能删除带 owner/run 标签的资源。学习者逐项检查 RBAC、Quota、NetworkPolicy、Secret 引用、Job TTL、expires_at 和 Kubernetes audit。", "故障注入 runner 读取 Secret、访问相邻 namespace、创建超 quota Pod 和 cleanup 403；每一项都要产生 authz/policy/audit/残留证据。Pod Running 只是局部信号，环境只有在 artifact 上传、资源回收和审计闭环后才完成。"], table: { headers: ["边界", "错误绿灯", "复验工件"], rows: [["RBAC", "kubectl 命令成功", "authz deny 与 Role 快照"], ["网络", "服务可达", "policy 命中记录"], ["资源", "Job 完成", "Quota 与成本"], ["回收", "删除返回 0", "残留清单与 receipt"]], caption: "临时环境的完成条件包含隔离、回收和审计。" } }, { title: "QP03 反例与迁移", body: ["共享 namespace 看起来省资源，却会让 MR 之间互读数据；cluster-admin 让排错方便，却突破最小权限。迁移到真实集群前先做 API/admission/审计/配额 capability probe，再在隔离集群跑 fault。", "本地材料只能证明 fixture 检测越权和残留，真实 provider/model、integration、practitioner review、learner observation、live 与 production 集群均 NOT_RUN。"], table: { headers: ["症状", "怀疑层", "下一步与修复"], rows: [["runner 读到 Secret", "RBAC", "撤销绑定并复验 authz"], ["跨 namespace 可达", "NetworkPolicy", "默认拒绝后补 allow"], ["孤儿资源增加", "cleanup/TTL", "按 owner 扫描并回收"], ["audit 缺事件", "审计 backend", "阻断完成并补配置"]], caption: "环境安全结论必须绑定 namespace UID 和时间线。" } }, { title: "QP03 迁移工件", body: ["交付 Environment Manifest、身份矩阵、Quota/NetworkPolicy、TTL/cleanup SOP、故障证据和残留资源清单。学习者迁移时需明确生产 namespace 永不作为实验对象，真实清理 SLA 仍由 cluster owner 决定。"], bullets: ["身份分离", "默认拒绝网络", "owner/TTL 双重回收"] }],
    "TD-QP04": [{ title: "QP04 Worked example：重复 CloudEvent 的两本账", body: ["同一 CloudEvent 因网络超时被重放两次：Inbox 记录 event id 已收到，Outbox 记录一次发送意图，adapter receipt 可能晚到。学习者要用 event id、远端 issue key、trace id 和本地 ledger 判断是 no-op、远端已创建未回执，还是尚未创建；不能只看 HTTP 200。", "将 Jira defect、GitLab status、K8s cleanup 和脱敏通知拆成不同副作用，分别定义幂等键、重试预算、DLQ、对账和 rollback。交付 event graph、reconciliation report、duplicate-effect fault 和修复 receipt。"], table: { headers: ["状态", "不可下的结论", "下一步"], rows: [["Outbox 有、receipt 无", "远端未执行", "回读远端并对账"], ["同 key 两个 defect", "网络重试正常", "阻断并修复幂等"], ["通知已发、audit 缺", "用户收到即完成", "补审计或标不完整"], ["DLQ 清空", "事件处理完", "检查 payload hash"]], caption: "跨系统质量必须以业务副作用为准。" } }, { title: "QP04 反例与迁移", body: ["只按标题去重会把不同版本需求误合并；只重试请求会造成重复 Jira defect；删除 DLQ 可让队列变干净，却丢失失败证据。迁移到真实事件总线前先验证签名、schema、重试语义、通知脱敏和人工回滚。", "本地 fixture 只证明重放和对账分支，真实 provider/model、integration、practitioner review、learner observation、live 与 production 事件闭环均 NOT_RUN。"], table: { headers: ["症状", "怀疑层", "下一步与修复"], rows: [["重复副作用", "幂等 ledger", "暂停重放并对账"], ["远端响应丢失", "adapter receipt", "回读业务 key"], ["通知泄露字段", "脱敏策略", "阻断并扫描"], ["DLQ 事件孤儿", "reconciliation", "保留 hash 与 owner"]], caption: "Exactly-once-effect 是业务账本结论。" } }, { title: "QP04 迁移工件", body: ["交付 CloudEvents schema、Inbox/Outbox/DLQ 状态机、adapter receipt、幂等键表、对账报告和 rollback runbook。让新人能从一条事件复盘到远端事实，不把 fixture 通过写成 live 发布能力。"], bullets: ["接收事实与发送意图分账", "远端副作用必须回读", "DLQ 是证据不是垃圾桶"] }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5QualityPlatformDepth = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-QP01": [{ title: "QP01 Guided lab：revision 争议的可回放评审", body: ["把 PROJ-42 的 revision 6、revision 7 和一次重复 webhook 放入输入目录，先用 issue key 与 tenant 做范围校验，再读取 changelog 中的字段差异。学习者不得直接让模型总结；先建立 source_ref 表，记录字段路径、作者、时间、hash、当前验收条件和缺失项。若 revision 7 只改变描述而未改变验收条件，候选仍需由 reviewer 确认；若验收条件发生改变，则 revision 6 的批准自动标记 superseded。", "实验的第一轮只允许读取，不允许写 Jira。第二轮将一个批准 receipt 绑定到 revision 6，观察 Basis Gate 是否阻断；第三轮修正到 revision 7，并确认 actor、scope、transition 和签名均能回读。每轮都保存 input hash、决策原因、阻断字段和 reviewer 责任人。学习者要比较模型摘要与 source_ref，发现摘要把推测写成事实时，将其降级为 UNKNOWN，而不是修正文案后继续放行。"], table: { headers: ["步骤", "输入/计算", "通过条件", "带走物"], rows: [["冻结", "3 个 revision + webhook hash", "当前 revision 可定位", "snapshot-manifest"], ["解析", "字段路径与验收条件 diff", "每条 claim 有 source_ref", "basis-matrix"], ["注入", "旧批准/重放事件", "旧 receipt 被阻断", "fault-report"], ["批准", "actor+scope+transition", "人工 receipt 完整", "review-record"]], caption: "Jira 事件评审的核心不是生成摘要，而是把版本争议变成可审计决定。" } }, { title: "QP01 Project handoff：向真实租户迁移", body: ["项目工件必须拆成四份：字段能力探针、Basis Gate 配置、冲突决策表和 rollback SOP。探针先确认 Jira 版本、字段可读性、transition 权限、webhook 签名、限流和审计保留期；任何一项读不到都要写 NOT_RUN，并禁止把离线批准 receipt 当成真实批准。迁移时用一条低风险 issue 做 canary，只验证读取和回读，再由项目 owner 决定是否允许写。", "故障诊断按顺序进行：若 revision 不一致，先查缓存和 webhook 顺序；若 source_ref 缺失，查抓取器与权限；若 actor 不在 scope，查身份映射；若写入返回 403/429，保留 outbox 并等待人工处理。交付包要含输入样例、判定表、四种故障的原始证据、修复前后 hash 和 transfer note。provider/model、真实 Jira integration、practitioner review、learner observation、live、production 仍 NOT_RUN。"], bullets: ["旧版本不因摘要漂亮而复活", "每个批准都绑定 revision、actor 和 scope", "写权限未回读时保持 BLOCKED"] }],
    "TD-QP02": [{ title: "QP02 Guided lab：SHA 绑定的竞态重放", body: ["构造 MR 9 的 commit A、commit B、Pipeline 501/502 和延迟到达的 JUnit。先计算 current_sha=MR_HEAD，再对每个 artifact 校验 pipeline_sha、suite 名称、digest、run_id 与 policy_version。只有 current_sha 相等、required suite 齐全且 artifact digest 未漂移，结果才进入 gate；flaky、error、skipped 和缺 suite 不能被一个绿色总状态覆盖。", "实验分三轮：第一轮让 A 的绿色报告晚于 B 到达，验证 stale evidence 被拒绝；第二轮删除 contract suite，观察 unit 全绿仍然阻断；第三轮篡改 XML 中的 SHA，验证 digest 和原始下载 receipt 能发现手改。学习者需把每次阻断定位到聚合器、回调关联、artifact 完整性或分支保护层，并说明为什么只看 merge badge 会误判。"], table: { headers: ["核算项", "判定公式", "失败诊断", "工件"], rows: [["版本", "MR_HEAD===pipeline_sha", "竞态/旧回调", "sha-manifest"], ["套件", "required⊆reported", "缺契约套件", "suite-gap"], ["完整性", "digest=下载摘要", "手改/漂移", "artifact-receipt"], ["策略", "approval+branch rule", "绕过保护", "gate-decision"]], caption: "CI 质量证据必须以 SHA 为主键，而不是以状态颜色为主键。" } }, { title: "QP02 Project handoff：让结果能被下一位工程师复用", body: ["交付 current-SHA gate 配置、JUnit schema、竞态夹具、stale-race 报告和保护分支检查单。迁移到另一条流水线时只复用证据字段与判定顺序，不复制 Runner 数量、超时或 suite 名称；新项目必须重新声明 required set、artifact 生命周期和 owner。若 API 无法回读 pipeline SHA 或 artifact digest，整个结论保持 UNKNOWN。", "故障排查先固定 MR、pipeline、run 和 artifact 四个 ID，再对照时间线。状态延迟不等于测试失败，缺 suite 也不等于套件通过；必须区分执行失败、证据缺失、版本漂移和权限拒绝。真实 GitLab integration、provider/model、practitioner review、learner observation、live、production CI 均 NOT_RUN。"], bullets: ["SHA、suite、digest、approval 四项闭包", "旧绿灯不可跨 commit 传播", "缺回读证据即 BLOCKED"] }],
    "TD-QP03": [{ title: "QP03 Guided lab：RBAC 与回收闭环", body: ["为 run-42 设计 provisioner、runner、cleaner 三个 ServiceAccount，分别绑定最小 Role。输入包括 namespace、owner/run 标签、Quota、NetworkPolicy、Secret 引用、TTL 和 expires_at；学习者先计算每个身份允许的 verb/resource/name，随后检查 audit 是否出现越权拒绝。Pod Running 只说明调度成功，不能说明隔离、artifact 上传、清理和审计完整。", "注入四个故障：runner 读取 Secret、访问相邻 namespace、创建超过 quota 的 Pod、cleaner 收到 403。每个 fault 都要保存 authz decision、policy 命中、audit event 和残留资源列表。修复时不能直接授予 cluster-admin；应缩小资源名、namespace 和 verb，重跑同一 fault，确认拒绝仍存在且正常 job 不受影响。"], table: { headers: ["层", "具体计算", "失败解释", "迁移工件"], rows: [["身份", "verb×resource×namespace", "权限过宽", "rbac-matrix"], ["网络", "默认拒绝+显式 allow", "跨域可达", "policy-hit"], ["资源", "request≤quota", "超额创建", "quota-report"], ["回收", "owner+TTL+expires_at", "孤儿资源", "cleanup-receipt"]], caption: "临时环境只有在权限、网络、资源、回收和审计同时闭合时才完成。" } }, { title: "QP03 Project handoff：把实验集群边界写进 SOP", body: ["迁移工件包括 Environment Manifest、身份矩阵、Quota/NetworkPolicy、TTL/cleanup SOP、残留清单和停止条件。先做 API、admission、审计 backend 和配额 capability probe，再在隔离集群运行；生产 namespace 永远不作为学习夹具。若审计 backend 不保留拒绝事件，安全结论必须标 UNKNOWN。", "诊断顺序是身份绑定、资源策略、网络策略、回收控制器、审计存储。发现孤儿资源时先冻结下一轮创建，再按 owner/run 标签列出资源；发现 cleaner 403 时不能删掉残留清单掩盖失败。真实 Kubernetes 集群、provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["最小权限优先于排错便利", "owner 与 TTL 双重回收", "残留清单是证据不是噪声"] }],
    "TD-QP04": [{ title: "QP04 Guided lab：Inbox/Outbox 两本账对账", body: ["准备同一 CloudEvent 的首发、超时重放和乱序事件，使用 event_id、source、subject、time、traceparent 和 payload hash 建立 Inbox。Outbox 只记录发送意图，adapter receipt 记录远端事实；三者不能互相代替。学习者逐条计算 expected_effect、observed_effect 和 reconciliation_state，区分 no-op、已创建未回执、尚未创建和副作用重复四种状态。", "再把 Jira defect、GitLab status、K8s cleanup、脱敏通知拆成独立副作用，每种副作用声明幂等键、重试预算、DLQ、owner 和 rollback。注入 receipt 丢失、重复 key、schema 变更和通知敏感字段四类 fault；修复后必须能用远端业务 key、审计事件和 ledger 对账，而不是仅凭 HTTP 200 或 DLQ 为空。"], table: { headers: ["账本", "可计算字段", "错误绿灯", "工件"], rows: [["Inbox", "event_id+payload_hash", "重复被吞但无证据", "inbox-ledger"], ["Outbox", "effect_key+attempt", "发送意图当成事实", "outbox-ledger"], ["Receipt", "远端 key+status", "超时即判未执行", "adapter-receipt"], ["Reconcile", "expected↔observed", "DLQ 清空即完成", "reconcile-report"]], caption: "跨系统 exactly-once 只能落到业务副作用账本，而不是传输层口号。" } }, { title: "QP04 Project handoff：事件闭环的回滚与通知", body: ["交付 CloudEvents schema、Inbox/Outbox/DLQ 状态机、幂等键表、对账报告、脱敏策略和 rollback runbook。迁移到真实总线前，先验证签名时间窗、schema 兼容性、重试语义、DLQ 保留期、通知字段脱敏和人工回滚权限；任何一个能力未回读都保持 NOT_RUN。", "故障诊断先查 event_id 与 payload hash，再查远端业务 key、receipt、audit 和 DLQ owner。重复副作用应暂停重放并对账，通知泄露应阻断并扫描，孤儿 DLQ 事件应保留原始 hash 与负责人。真实事件总线、provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["接收事实、发送意图、远端事实分账", "DLQ 保存失败证据", "通知成功不等于业务完成"] }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5QualityPlatformCaseNotes = (page: TutorialPage): TutorialPage => {
  const notes: Record<string, TutorialPage["blocks"]> = {
    "TD-QP01": [{ title: "QP01 评审案例记录", body: ["把三次评审写成可复核时间线：10:00 收到 revision 6 webhook，10:03 读取到 revision 7，10:05 reviewer 仍引用旧验收条件。学习者必须在每个时间点标注 Evidence、Inference、Unknown，并说明为什么下一步是回读而不是生成。对照表要把字段缺失、版本冲突、身份越权、签名失效分别映射到停止动作。", "项目复盘还要比较‘摘要看起来完整’与‘引用可回读’的差异。前者只能作为候选，后者才允许进入人工批准。将修复后的 source_ref、reviewer scope、transition receipt 和 rollback 结果打包，下一位工程师可以用同一输入验证版本漂移不会再次放行。"], table: { headers: ["证据层", "例子", "允许动作"], rows: [["Evidence", "当前 revision/changelog", "更新 Basis"], ["Inference", "可能是旧 webhook", "安排复核"], ["Unknown", "权限未回读", "保持 BLOCKED"], ["Decision", "批准绑定 revision", "保存 receipt"]], caption: "证据层分离让需求评审可审计。" } }],
    "TD-QP02": [{ title: "QP02 竞态复盘记录", body: ["把 commit A 绿色、commit B 修改测试、旧 Pipeline 迟到这一连串事件画成时间线，学习者分别保存 MR HEAD、pipeline SHA、artifact digest 和 approval rule。若只保留最终绿色状态，后续人员无法判断是执行失败还是证据错配。每个阻断结论要引用一个具体字段和一个可执行修复。", "复用到另一 CI 平台时，先建立字段映射表，再做同一竞态重放。不能把 GitLab 的 status 语义直接套到新平台；必须确认报告聚合、重试、取消、分支保护和 artifact 保留期。交付 mapping、fault replay、repair receipt 和 owner 签收。"], table: { headers: ["复盘问题", "现场证据", "不可做的推断"], rows: [["是否当前版本", "MR HEAD/Pipeline SHA", "绿色即当前"], ["是否完整", "required suite 集合", "unit 全绿即完整"], ["是否可信", "artifact digest", "下载成功即可信"], ["谁批准", "approval rule/actor", "状态有颜色即批准"]], caption: "SHA 竞态必须保留原始时间线。" } }],
    "TD-QP03": [{ title: "QP03 集群边界复盘", body: ["为 run-42 保留 namespace UID、ServiceAccount、RoleBinding、Quota、NetworkPolicy、Job、artifact 和 cleanup 的全链证据。学习者按创建、运行、上传、回收四个阶段检查每个身份的权限变化；任何阶段出现 cluster-admin、跨 namespace 访问或无 owner 标签，都要阻断并记录影响范围。", "把残留资源按 owner/run、类型、创建时间和预计回收时间排序，不能直接执行宽泛 delete。cleaner 403 时先保存审计和失败返回，再由 cluster owner 决定修复。这样新人拿到清单就能复现问题，不会把‘Pod 已完成’误认为环境闭环。"], table: { headers: ["阶段", "核查重点", "停止条件"], rows: [["创建", "身份/Role/Quota", "权限越界"], ["运行", "NetworkPolicy/Secret", "跨域或泄密"], ["上传", "artifact/trace", "证据缺失"], ["回收", "TTL/owner/audit", "残留或无审计"]], caption: "Kubernetes 测试环境需要生命周期级证据。" } }],
    "TD-QP04": [{ title: "QP04 事件账本复盘", body: ["将同一 event_id 的首发、超时、重放、远端创建和通知分开记录，形成 expected、attempt、receipt、observed 四列。学习者必须能解释‘Outbox 有但远端 key 未知’和‘远端已创建但 receipt 丢失’的差别，并为两种情况选择不同的对账动作。", "迁移时还要验证 payload hash、schema version、签名时间窗、DLQ 保留和通知脱敏。任意字段无法回读时不能用重试掩盖未知；应保留原始事件、owner 和下一次人工动作。交付 event timeline、reconciliation state、rollback 和通知扫描结果。"], table: { headers: ["状态", "可确认事实", "下一步"], rows: [["Inbox only", "已接收", "查询远端"], ["Outbox only", "有发送意图", "检查 adapter"], ["Receipt only", "远端回执", "写入 ledger"], ["DLQ", "处理失败", "保留 hash/owner"]], caption: "事件闭环的核心是区分意图与事实。" } }],
  };
  const extra = notes[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5QualityPlatformFinalDepth = (page: TutorialPage): TutorialPage => {
  const text: Record<string, TutorialPage["blocks"]> = {
    "TD-QP01": [{ title: "QP01 最终练习：写出可审计批准", body: ["学习者从三个 revision 中选择唯一可批准版本，并在表格中写出选择依据、未决冲突、责任人和回滚条件。若当前 issue 没有可读验收条件，结果必须是 BLOCKED；若 webhook 与当前快照冲突，必须生成 supersede 记录而不是覆盖旧 receipt。", "最后把 Basis Pack 转成一张新人检查单：事件范围、当前 revision、字段来源、权限回读、人工批准、写入回执、异常停止。每个格子都要有证据路径和下一步负责人，才能被下一位工程师直接复用。"], table: { headers: ["练习输出", "最低要求", "不满足时"], rows: [["Basis Pack", "每条 claim 有 source_ref", "BLOCKED"], ["冲突表", "列出 revision 与 owner", "不得合并"], ["批准 receipt", "actor/scope/transition", "不执行写入"], ["回滚 SOP", "含触发与责任人", "转人工"]], caption: "QP01 的完成不是摘要漂亮，而是批准可回放。" } }],
    "TD-QP02": [{ title: "QP02 最终练习：拒绝 stale green", body: ["学习者要把旧 Pipeline 的绿色结果故意接到新 SHA，提交 gate 应输出阻断原因、当前 SHA、旧 SHA、缺失 suite 和 artifact digest。随后用同一输入修复关联，确认 repair 只改变证据绑定而没有删除失败记录。", "迁移到新 CI 时，保留 SHA-bound manifest、suite contract、artifact receipt 和 branch policy 四个接口；平台名称可以变，证据主键和阻断语义不能丢。"], table: { headers: ["产物", "可复用字段", "边界"], rows: [["SHA manifest", "MR/pipeline/run", "禁止跨版本"], ["JUnit report", "suite/status/digest", "缺套件阻断"], ["race report", "事件时间线", "旧绿不继承"], ["policy check", "approval/rule", "保护不可绕过"]], caption: "QP02 的项目价值是让 CI 绿灯有版本归属。" } }],
    "TD-QP03": [{ title: "QP03 最终练习：证明环境真的结束", body: ["学习者提交环境完成证明：所有测试 artifact 已上传、任务终态已记录、owner/run 标签仍可查询、TTL 已设置、cleanup receipt 已保存、审计事件可回读。任何一个条件缺失，都只能把环境状态写成 UNKNOWN 或 BLOCKED。", "把这份证明交给 cluster owner 审阅，不能由创建环境的人自行批准。生产集群、真实成本、集群级审计保留和清理 SLA 都保持 NOT_RUN，迁移时必须重新取得具名责任人意见。"], table: { headers: ["完成证据", "检查", "失败处理"], rows: [["artifact", "hash 可回读", "重传并阻断"], ["资源", "owner/TTL 存在", "列残留清单"], ["权限", "拒绝事件存在", "撤销越权"], ["审计", "actor/action/result", "补 backend"]], caption: "QP03 以环境生命周期闭环作为完成标准。" } }],
    "TD-QP04": [{ title: "QP04 最终练习：把重复事件变成可解释状态", body: ["学习者需要为每个重复 CloudEvent 选择 no-op、reconcile、retry、DLQ 或 rollback，并写出选择依据。状态不能由 HTTP code 单独决定，而要综合 Inbox、Outbox、远端业务 key、adapter receipt、audit 和 payload hash。", "交接给事件总线 owner 时，附上 schema 版本、签名窗口、脱敏规则、重试预算和回滚责任人。缺少任何真实远端回读时，教学结论只能停留在 fixture-tested。"], table: { headers: ["状态", "必须核对", "允许动作"], rows: [["no-op", "幂等键与远端事实", "记录重复"], ["reconcile", "业务 key/ledger", "补回执"], ["retry", "错误类型/预算", "有限重试"], ["rollback", "副作用与 owner", "人工批准"]], caption: "QP04 让事件处理从传输状态回到业务事实。" } }],
  };
  const extra = text[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5QualityPlatformAcceptance = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-QP01": [{ title: "QP01 验收标准", body: ["验收前由独立 reviewer 复核 revision、source_ref、actor、scope 和 transition；任一字段无法从快照或回执回读，就只允许提交 BLOCKED 结果。批准记录必须能被另一人重放，且不会让 superseded 版本重新进入执行队列。"], bullets: ["输入、判定、回执三者可互链", "冲突有具名 owner", "真实租户能力仍 NOT_RUN"] }],
    "TD-QP02": [{ title: "QP02 验收标准", body: ["验收前必须证明当前 MR HEAD 与 Pipeline SHA、required suite、artifact digest、approval rule 全部闭合；任何 stale callback、缺 suite 或 digest 漂移都需要阻断 receipt。修复只能通过重新绑定当前版本得到，不能手改历史报告。"], bullets: ["版本绑定优先", "缺证据不等于通过", "真实 Runner 与 CI integration 仍 NOT_RUN"] }],
    "TD-QP03": [{ title: "QP03 验收标准", body: ["验收前必须同时拥有身份矩阵、网络命中、Quota、artifact、TTL、cleanup 和 audit 证据；Pod Running 不能替代生命周期闭环。任何残留或审计缺口都要留下清单和 owner，不能通过扩大权限或直接删除资源掩盖。"], bullets: ["最小权限闭合", "残留可追溯", "真实集群与 production cleanup 仍 NOT_RUN"] }],
    "TD-QP04": [{ title: "QP04 验收标准", body: ["验收前必须区分 Inbox 接收、Outbox 意图、远端 receipt 和业务 observed effect，并能用 event_id、payload hash、业务 key 和 audit 完成对账。DLQ 为空不代表闭环成功；未回读的远端事实保持 UNKNOWN。"], bullets: ["意图与事实分账", "副作用按业务 key 对账", "真实事件总线与 live delivery 仍 NOT_RUN"] }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5QualityPlatformProjectDecision = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-QP01": [{ title: "QP01 项目决策记录", body: ["在最终决策中，学习者要把‘是否允许 AI 生成候选’和‘是否允许系统写入 Jira’拆成两个门禁。前一个门禁只要求输入完整、来源可追溯、冲突已列出；后一个门禁还要求当前 revision、actor、scope、transition、签名和撤销路径全部可回读。即使候选内容质量很高，只要写入条件缺一项，也必须停在 BLOCKED。", "决策记录要写明未采用的替代方案：没有选择直接使用 webhook，因为它可能过期或被重放；没有选择把评论表情当批准，因为无法证明身份和范围；没有选择覆盖旧 receipt，因为会破坏 supersede 链。这样项目接收人能知道规则为何存在，而不是只复制一个脚本。"], table: { headers: ["门禁", "所需证据", "输出"], rows: [["候选", "source_ref/当前快照", "ACCEPTED 或 BLOCKED"], ["审批", "actor/scope/revision", "review receipt"], ["写入", "transition/签名/撤销", "执行或停止"], ["迁移", "能力探针/owner", "NOT_RUN 清单"]], caption: "QP01 的最终项目产物是可解释的批准决策。" } }],
    "TD-QP02": [{ title: "QP02 项目决策记录", body: ["最终决策必须区分‘测试真的失败’、‘测试证据缺失’、‘证据属于旧 SHA’和‘平台权限拒绝’四种状态。每种状态有不同的下一步：失败要修代码或测试，缺证据要补 suite，旧 SHA 要重跑当前 HEAD，权限拒绝要阻断并通知 owner。把它们合成一个红灯会让修复方向错误。", "决策记录还要说明为什么不接受手改 JUnit XML、为什么不把 merge badge 当唯一依据、为什么不把重试后的最新状态覆盖旧事件。交接人按 MR、pipeline、run、artifact 四个 ID 即可重放整条证据链，真实 CI provider 和 Runner 仍保持 NOT_RUN。"], table: { headers: ["状态", "判定证据", "责任动作"], rows: [["执行失败", "当前 SHA 的测试输出", "修复并重跑"], ["证据缺失", "required suite 不全", "补套件"], ["版本漂移", "MR_HEAD≠pipeline_sha", "阻断旧绿"], ["权限拒绝", "API/branch receipt", "通知 owner"]], caption: "QP02 把 CI 状态拆成可执行的责任分支。" } }],
    "TD-QP03": [{ title: "QP03 项目决策记录", body: ["最终项目决策不是‘namespace 建好了’，而是‘环境能否安全交给下一阶段’。交接前要确认 provisioner、runner、cleaner 的身份边界，网络默认拒绝，Quota 不越界，Secret 不被读取，artifact 已上传，TTL 和 owner 标签可查询，cleanup 与 audit 都有 receipt。任一条件未满足，环境不得进入下一轮。", "不采用 cluster-admin 解决问题，因为它会掩盖真实权限边界；不采用共享 namespace 节省资源，因为会引入跨任务数据；不直接删除残留，因为会丢失诊断证据。项目 owner 需要签收残留清单、停止条件和风险，而不是由执行脚本自行批准。"], table: { headers: ["交接问题", "证据", "结论"], rows: [["能否运行", "身份/Quota/Policy", "允许或阻断"], ["能否取证", "artifact/trace/audit", "完整或 UNKNOWN"], ["能否回收", "owner/TTL/cleanup", "完成或残留"], ["能否迁移", "owner/SLA/边界", "NOT_RUN 或批准"]], caption: "QP03 用生命周期交接替代单点 Pod 绿灯。" } }],
    "TD-QP04": [{ title: "QP04 项目决策记录", body: ["最终决策必须先确定远端业务事实，再选择 no-op、reconcile、retry、DLQ 或 rollback。Inbox 只能证明收到，Outbox 只能证明意图，receipt 只能证明某次适配器回执；只有远端业务 key、审计和账本一致，才可把副作用标记为完成。", "不采用按标题去重，因为不同版本需求可能同名；不采用无限重试，因为未知写结果会造成重复副作用；不采用清空 DLQ 作为完成信号，因为会丢失失败证据。迁移时由事件 owner、系统 owner 和安全 reviewer 分别签收 schema、幂等、脱敏、回滚和 NOT_RUN 边界。"], table: { headers: ["决策", "前置证据", "责任人"], rows: [["no-op", "重复 key+远端事实", "适配器 owner"], ["reconcile", "ledger/receipt/audit", "业务 owner"], ["retry", "错误类型/预算", "平台 owner"], ["rollback", "副作用/风险", "安全或业务 reviewer"]], caption: "QP04 把事件传输问题还原为业务副作用决策。" } }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5QualityPlatformTargetRepair = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-QP02": [{ title: "QP02 竞态修复演练：并发构建的最终裁决", body: ["同时启动同一 MR 的 pipeline A 与 pipeline B：A 先完成但引用旧 commit，B 后完成并修改了 required suite。学习者先建立事件时间线，再计算每条 JUnit 的 current_sha、pipeline_sha、run_id、suite_set 和 artifact_digest 是否闭合。若 A 的绿色结果晚到，不能因为状态更新更早就覆盖 B；若 B 缺少 contract suite，也不能用 unit suite 的绿色替代完整性。", "故障阶段分别注入旧回调、JUnit 报告被截断、artifact digest 改变和 concurrent build 取消信号。修复阶段只允许更新关联规则：旧回调按 SHA 丢弃，截断报告标记 evidence_missing，digest 漂移阻断，取消事件保留原始 receipt。项目决策要写清是 code failure、evidence failure、stale evidence 还是 platform failure，并将每个结论转成下一位工程师可执行的动作。"], table: { headers: ["故障", "观测", "修复", "复验"], rows: [["旧 SHA 晚到", "MR_HEAD≠pipeline_sha", "丢弃 stale", "重跑当前 HEAD"], ["报告截断", "suite 数不完整", "标 evidence_missing", "补齐报告"], ["digest 改变", "hash 不一致", "阻断 artifact", "重新下载校验"], ["并发取消", "cancel receipt", "保留事件链", "核对最终 run"]], caption: "QP02 的修复必须保持并发事件可追溯，不能只留下最后一个绿色状态。" } }, { title: "QP02 迁移裁决记录", body: ["迁移到另一 CI 平台时，先把 MR、commit、pipeline、run、suite、artifact、approval 七类对象做字段映射，再决定哪些字段是硬门禁。若新平台无法提供当前 SHA 或 artifact digest，结果只能是 BLOCKED/UNKNOWN；不能因为界面显示绿色就提高成熟度。交付 concurrent-build timeline、stale-evidence report、repair receipt 和 owner 签收，真实 Runner、CI integration、provider/model、practitioner review、learner observation、live、production 仍 NOT_RUN。"], bullets: ["并发事件按版本绑定", "缺报告是证据失败", "修复不能覆盖原始失败"] }],
    "TD-QP03": [{ title: "QP03 集群修复演练：从越权到可回收环境", body: ["为 run-42 建立独立 namespace，分别给 provisioner、runner、cleaner 配置最小 Role。先计算每个身份的 verb、resource、namespace 和 resourceName，再验证 Quota request 不超过上限、NetworkPolicy 默认拒绝跨 namespace、Secret 只允许必要引用。环境的完成条件还包括 Job TTL、expires_at、owner/run 标签、artifact 上传和 cleanup receipt。", "故障阶段注入 runner 读取 Secret、访问相邻 namespace、创建超 quota Pod、cleaner 403、TTL 控制器延迟和 NetworkPolicy 漏放。修复时不得授予 cluster-admin 或直接删除残留；应缩小 Role、补默认拒绝、调整 request、修复 cleaner 身份和记录 TTL 延迟。每次 repair 都要保留 authz decision、policy hit、audit event、残留清单与新 receipt，才能证明问题真的被修好。"], table: { headers: ["故障", "诊断证据", "修复", "验收"], rows: [["读取 Secret", "authz deny/allow", "缩小 Role", "同请求被拒绝"], ["跨 namespace", "policy hit", "补默认拒绝", "邻域不可达"], ["超 Quota", "request/limit", "调整资源预算", "创建受控"], ["cleanup 403/TTL 延迟", "audit/残留/时间线", "修 cleaner/等待", "receipt 完整"]], caption: "QP03 的修复要同时保护权限、网络、资源和回收证据。" } }, { title: "QP03 迁移裁决记录", body: ["迁移到真实集群前先做 API、admission、audit backend、Quota、NetworkPolicy 和 TTL capability probe；任何能力未回读都保持 NOT_RUN。交付 Environment Manifest、身份矩阵、policy 命中记录、Quota 报告、cleanup receipt、残留资源清单和 owner 签收。生产 namespace 永远不作为夹具，真实 cluster、provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["最小权限优先", "残留不删除证据", "TTL 延迟要进时间线"] }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

type QualityPlatformPageId = "TD-QP01" | "TD-QP02" | "TD-QP03" | "TD-QP04";

const qualityPlatformBundleOwnerIds: readonly QualityPlatformPageId[] = ["TD-QP01", "TD-QP02", "TD-QP03", "TD-QP04"];

const qualityPlatformExecutableMaterials = (ownerPageId: QualityPlatformPageId): NonNullable<TutorialPage["materials"]> => {
  if (!qualityPlatformBundleOwnerIds.includes(ownerPageId)) return [];
  return [
    { title: "质量控制平面完整实验包", description: "包含 Jira、GitLab、K8s、事件总线、审计与脱敏通知的离线材料。", href: "materials/quality-platform-integrations.zip", kind: "archive", validation: "fixture-tested" },
    { title: "质量控制平面运行说明", description: "主模拟器与四个专题入口均可直接运行，完整路径预期退出码 0/1/0。", href: "materials/quality-platform-integrations/learner-materials/README.md", kind: "guide", validation: "fixture-tested" },
    { title: "共享材料精确 owner 清单", description: `共享 bundle 只归属 ${qualityPlatformBundleOwnerIds.join("、")}，不按模块或 ID 前缀继承。`, href: "materials/quality-platform-integrations/learner-materials/manifests/shared-bundle-owners.json", kind: "config", validation: "fixture-tested" },
  ];
};

export const qualityPlatformSpecializationPages: TutorialPage[] = ([
  {
    id: "TD-QP01",
    moduleId: "TD-M07",
    order: 1,
    title: "Jira 需求事件：从 Basis Gate 到人工批准",
    type: "跟做",
    status: "fixture-tested",
    duration: "60 分钟",
    summary: "把 Jira 需求事件变成有版本、有来源、有冲突状态的测试依据，再让 AI 生成候选方案与用例，最终由有权限的人批准执行。",
    why: "需求 webhook 只说明发生了变化，不说明当前事实是什么。没有回读、Basis Gate 和人工批准，AI 很容易把旧方案、缺失条件或冲突规则变成自动化门禁。",
    prerequisites: ["TD-P01", "TD-P02"],
    outcomes: ["为 Jira 需求事件建立可重放的 Basis Pack", "把 AI 输出限制为带 provenance 的候选", "记录人工批准、拒绝和 superseded 决策"],
    artifact: "Jira requirement event、Basis Gate 报告、候选评审记录与 approved revision",
    blocks: [
      {
        title: "业务场景：需求变化先停在 Basis Gate",
        body: [
          "场景是 Jira 中的订单取消需求：产品更新验收条件，技术方案仍引用旧的已发货状态规则。事件到达后，平台先用 issue key、changelog、版本和 source snapshot hash 回读 Jira；不能把 webhook payload 当作事实来源。",
          "Basis Gate 检查目标项目、issue 类型、当前 revision、必需字段、引用坐标、敏感数据和冲突责任人。缺字段、版本不唯一或有效来源冲突时状态为 BLOCKED，禁止生成执行计划；需求变更会把旧候选标为 superseded。",
        ],
        bullets: ["业务 owner 确认范围和验收条件", "技术 owner 确认接口、状态和依赖", "测试 owner 确认风险、Oracle 和门禁责任"],
        warning: "AI 可以整理冲突，不能替产品或技术负责人选择冲突规则。",
      },
      {
        title: "实现：事件、候选和批准分成三种状态",
        body: [
          "Event Gateway 验证 Jira webhook 的原始 body 签名、时间窗和去重键，先写 Inbox 再快速返回 2xx；Orchestrator 使用 Jira REST v3 回读 issue、changelog、权限和可用 transition。每个 revision 关联 jira_issue_key、source_event_id、correlation_id、policy_version 和 trace_id。",
          "AI Assist 只输出结构化候选：需求摘要、风险、测试候选、假设、unknowns、source_refs、模型标识、提示词哈希和 schema 版本。候选只能进入 proposed；Review Console 记录 reviewer、scope、decision、reason 和 approved revision，未批准 revision 不得创建环境、触发 Pipeline 或写成功状态。",
        ],
        table: { headers: ["对象", "机器状态", "允许的副作用"], rows: [["Basis Pack", "ACCEPTED/BLOCKED", "仅 accepted 可生成候选"], ["AI candidate", "PROPOSED/REJECTED/SUPERSEDED", "不得直接改变业务状态"], ["Human review", "APPROVED/REJECTED", "approved 才能进入执行请求"]] },
        expected: "固定输入、JSON Schema 和 eval 已绑定；模型 provider/model 仍为 NOT_RUN，首次真实运行必须另存 receipt。",
        technical: { kind: "prompt", content: "读取固定 Jira 事件和当前快照；先校验身份、权限、revision 与 source_refs，再输出 fail-closed Basis Gate、unknowns 和需人工决定的候选。禁止自动批准。", version: "1.0.0", promptPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp01/task.md", manifestPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp01/manifest.json", inputFixturePath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp01/input.json", outputSchemaPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp01/output.schema.json", evaluationPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp01/eval.json" },
      },
      {
        title: "SOP：回读、校验、生成、评审、冻结",
        body: [
          "先核对目标 Jira 项目、issue key、当前 revision、changelog 分页和权限；再运行 Basis Gate，保存通过或阻断原因。Gate 通过后才允许 AI 读取已批准的脱敏输入，并强制每条事实带 source_ref。",
          "评审人逐项检查目标、非目标、风险、Oracle、依赖、故障模式、回滚条件和未知项；批准的 scope 必须明确哪些候选可进入执行，拒绝项必须保留原因。Jira 评论或 ChatOps 表情不能替代有身份和范围的批准记录。",
          "需求再次更新时停止旧 revision 的执行请求，建立 superseded 关系，并要求按当前 revision 重新评审；外部 API 不可用时保留 outbox，不人工补写成功状态。",
        ],
        technical: { kind: "command", content: "python3 scripts/basis_gate_and_candidate_review.py cycle --report-dir reports/td-qp01", manifestPath: "materials/quality-platform-integrations/learner-materials/manifests/td-qp01-lab.json", stepId: "cycle", workingDirectory: "materials/quality-platform-integrations/learner-materials", expectedExitCode: 0, expectedArtifacts: ["reports/td-qp01/baseline.json", "reports/td-qp01/fault.json", "reports/td-qp01/repair.json", "reports/td-qp01/cycle-summary.json"] },
        expected: "一次运行可以从 Jira 事件追到当前 source snapshot、Basis Gate、AI provenance、reviewer 和最终 revision；任一关键证据缺失都停在 BLOCKED 或 NOT_RUN。",
      },
      {
        title: "指标、审计与故障注入：证明门禁真的在工作",
        body: [
          "指标至少包括事件验签失败率、去重抑制率、Basis Gate BLOCKED 率、候选引用完整率、人工批准率、评审耗时、superseded 率和从变更到批准的 lead time。所有比例都记录分母、时间窗、tenant/project 和 policy_version。",
          "注入旧方案与新 PRD 冲突、重复 webhook、过期签名、缺失验收条件、Jira 429/403 和 reviewer 拒绝。诊断顺序是签名与 Inbox → Jira 回读/changelog → source refs → AI provenance → review audit → outbox；不要把下游没有执行解释成通过。",
        ],
        table: { headers: ["审计事件", "必须保留", "阻断条件"], rows: [["basis.evaluated", "输入 hash、规则版本、结果和原因", "冲突或缺字段"], ["candidate.proposed", "模型、提示词 hash、source_refs", "无引用或 schema 无效"], ["review.decided", "reviewer、scope、decision、时间", "没有批准或批准已过期"]] },
      },
      {
        title: "人类决策、回滚与 NOT_RUN 边界",
        body: [
          "产品 owner 决定需求语义，技术 owner 决定实现约束，测试 owner 决定风险覆盖，授权 reviewer 决定候选是否进入执行；AI 没有批准、豁免、缺陷关闭或发布放行权限。任何人工 waiver 都要有原因、范围、到期时间和补偿控制。",
          "回滚是撤销未批准的 candidate、恢复上一个 approved revision，并保留原始事件和拒绝证据；不能删除 audit 或把旧 revision 改写成当前版本。Jira transition 必须先读取当前可用 transition 和权限，不硬编码状态名。",
          "本页是 desk-researched、static-reviewed：未在真实 Jira 租户创建 issue、配置 webhook、调用 REST、运行 AI 或执行人工审批；真实租户权限、字段、webhook 生命周期、模型质量和审批结果均为 NOT_RUN，不能写成已通过。",
        ],
        warning: "NOT_RUN 不是成功也不是失败；它表示没有真实租户证据，后续验收必须从隔离 Jira project 开始。",
      },
    ],
    practice: ["用一个需求变更夹具跑出 accepted 和 blocked 两种 Basis Gate 结果", "让 AI 候选缺少 source_ref 并证明它不能进入 approved", "记录一次 reviewer reject、supersede 和按新 revision 重评"],
    completion: ["Basis Gate 能阻断冲突、缺失和过期依据", "每个 AI 候选都有 provenance、scope 和人工决定", "审计记录能重建事件、revision、review 和回滚关系"],
    sourceIds: ["S93", "S94", "S66"],
    evidenceBoundary: "本页基于 research-redesign/40-quality-platform-integrations.md 与 Atlassian、CloudEvents、结构化输出资料做 desk research；未连接真实 Jira 租户、真实模型或组织审批流程，所有租户字段、权限、阈值和批准结果均为 NOT_RUN。",
    architecture: { title: "Jira 需求到人工批准的证据链", caption: "事件只触发回读；Basis Gate 决定输入是否可用，AI 只生成候选，人工批准决定是否允许执行。", nodes: ["Jira 需求与变更", "Webhook Gateway/Inbox", "Jira REST 回读", "Basis Gate/Source Pack", "AI 候选与 provenance", "Review Console/人工批准", "Orchestrator/审计与执行请求"] },
    materials: [
      { title: "Jira Basis Gate 脚本", description: "按 issue、changelog、来源 hash 和冲突责任人生成 TD-QP01 的 accepted/blocked 结果。", href: "materials/quality-platform-integrations/learner-materials/scripts/basis_gate_and_candidate_review.py", kind: "script", validation: "fixture-tested" },
      { title: "Jira 事件与评审配置", description: "定义 webhook 验签、去重、候选 provenance 和人工批准字段，供本页动作使用。", href: "materials/quality-platform-integrations/learner-materials/configs/jira-basis-gate.yaml", kind: "config", validation: "static-reviewed" },
      { title: "需求变更事件夹具", description: "包含当前 revision、changelog 和与旧技术方案冲突的脱敏 Jira 事件。", href: "materials/quality-platform-integrations/learner-materials/fixtures/jira-requirement-event.json", kind: "fixture", validation: "static-reviewed" },
      { title: "TD-QP01 Jira 评审 SOP", description: "指导回读、Basis Gate、候选评审、supersede、回滚和 NOT_RUN 记录。", href: "materials/quality-platform-integrations/learner-materials/guides/td-qp01-jira-review-sop.md", kind: "guide", validation: "static-reviewed" },
      ...qualityPlatformExecutableMaterials("TD-QP01"),
    ],
  },
  {
    id: "TD-QP02",
    moduleId: "TD-M07",
    order: 2,
    title: "GitLab MR 与 Pipeline：把 JUnit 证据绑定到当前 SHA",
    type: "跟做",
    status: "fixture-tested",
    duration: "65 分钟",
    summary: "将 MR、Pipeline、Job、JUnit 报告和外部质量状态绑定到同一个 commit SHA，聚合证据并以 fail-closed 方式阻断不完整结果。",
    why: "Pipeline 成功、测试报告存在和当前 MR 可合并不是同一件事。旧 SHA 的绿色状态、缺失 JUnit、没有 Pipeline 或必跑套件缺失，都不能被解释为当前代码通过。",
    prerequisites: ["TD-QP01", "TD-P06"],
    outcomes: ["建立 project_id、mr_iid、pipeline_id、run_id、commit_sha 的绑定", "确定性聚合 JUnit 与工件证据", "实现当前 SHA 优先的 fail-closed gate"],
    artifact: "MR 质量门禁 Manifest、JUnit 聚合摘要、当前 SHA status 与 fail-closed 诊断报告",
    blocks: [
      {
        title: "业务场景：MR 通过必须是真实当前代码",
        body: [
          "场景是订单服务 MR：Pipeline 在 commit A 上完成，测试生成两份 JUnit；开发者随后推送 commit B，旧 Pipeline 的 success 事件才到达。质量平台必须把 run、Pipeline、报告和 status 绑定到 A，并确认 MR 当前 HEAD 已经变成 B，不能让 A 的绿色结果覆盖 B。",
          "合并条件是 Pipeline 成功、必跑套件齐全、JUnit 可读且属于当前 SHA、外部质量状态成功、必需审批和线程规则满足；任何条件缺失都为 failed 或 inconclusive，而不是 skipped-as-success。",
        ],
        bullets: ["没有 Pipeline：NOT_RUN/阻断", "SHA 不匹配：failed/阻断", "报告缺失或篡改：inconclusive/阻断"],
      },
      {
        title: "实现：以 SHA 为主键，以报告为证据",
        body: [
          "GitLab webhook 只触发处理；Orchestrator 回读 MR 的 last_commit、head_pipeline_id、Pipeline 状态、Jobs、test_report、test_report_summary、artifact 引用和当前保护规则。质量状态写入当前 SHA，并带 run_id、pipeline_id、target URL、policy_version 和 reasons。",
          "JUnit 聚合器保存每条 testcase 的 suite、name、status、duration、attempt、producer、artifact_ref 和 SHA。重试 attempt 独立保留，最终计数规则固定；flaky、error、skipped 和缺失套件单独统计，不能把“最近一次通过”直接变成 overall passed。",
        ],
        table: { headers: ["绑定字段", "用途", "校验"], rows: [["project_id + mr_iid", "定位 MR", "项目与事件来源一致"], ["pipeline_id + commit_sha", "定位一次执行", "Pipeline ref/SHA 与 MR HEAD 回读一致"], ["run_id + suite_version", "定位质量运行", "Manifest、JUnit、artifact provenance 一致"]] },
        expected: "固定输入必须输出 current-SHA 绑定与 fail-closed gate；provider/model 未运行，eval 状态保持 NOT_RUN。",
        technical: { kind: "prompt", content: "读取固定 MR、Pipeline 和 JUnit；严格绑定 current SHA、pipeline_id、suite 与 artifact hash，证据缺失或旧 SHA 必须失败。", version: "1.0.0", promptPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp02/task.md", manifestPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp02/manifest.json", inputFixturePath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp02/input.json", outputSchemaPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp02/output.schema.json", evaluationPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp02/eval.json" },
      },
      {
        title: "SOP：探针、执行、收集、聚合、发布 gate",
        body: [
          "先探针检查 GitLab 实例版本/tier、项目权限、MR pipeline source、保护分支、approval rule、status check 注册、Runner 和必跑套件。探针不通过时，不触发新的 Pipeline，也不写 success。",
          "执行阶段创建唯一 run_id 并记录 current SHA；收集阶段按 pipeline_id 回读 Jobs、JUnit summary 和 artifact hash；聚合阶段检查所有必跑 suite、报告可读性、producer、时间范围、SHA 和 run 一致性；发布阶段再次回读 MR HEAD，再写 status。",
          "若聚合期间 HEAD 变化，旧 run 只能标记 superseded，必须为新 SHA 重新执行。GitLab API 429/5xx 只按幂等边界重试，超限进入 outbox/DLQ，并以 pending/failed 告警，不用人工评论补绿。",
        ],
        technical: { kind: "command", content: "python3 scripts/gitlab_sha_junit_gate.py cycle --report-dir reports/td-qp02", manifestPath: "materials/quality-platform-integrations/learner-materials/manifests/td-qp02-lab.json", stepId: "cycle", workingDirectory: "materials/quality-platform-integrations/learner-materials", expectedExitCode: 0, expectedArtifacts: ["reports/td-qp02/baseline.json", "reports/td-qp02/fault.json", "reports/td-qp02/repair.json", "reports/td-qp02/cycle-summary.json"] },
        expected: "相同 run 重复接收 webhook 或重复拉取报告只产生一个最终决策；任何证据不完整的路径都保留原因和重试上下文。",
      },
      {
        title: "指标、审计与故障注入：区分红灯原因",
        body: [
          "指标包括当前 SHA 绑定成功率、Pipeline 到报告延迟、必跑套件完整率、JUnit 解析失败率、failed/error/flaky/skipped 比例、artifact hash 校验失败率、gate pending 时长、旧 SHA 状态拒绝率和 MR 被阻断率。分母必须按 project、MR、SHA、suite_version 拆分。",
          "注入旧 SHA 竞态、缺失 Pipeline、JUnit XML 损坏、报告属于其他 Pipeline、必跑 suite 缺失、重复 webhook、API 429/403 和测试 failed=1。诊断顺序是 MR HEAD → Pipeline/Jobs → JUnit/artifact → 聚合规则 → 外部 status → protection/approval；先区分产品失败、证据失败和平台不可用。",
        ],
        table: { headers: ["故障", "应见证据", "门禁结果"], rows: [["旧 SHA 回写", "当前 HEAD 与 status SHA 不同", "拒绝 success，superseded"], ["JUnit 缺失", "required suite absent", "inconclusive/failed"], ["测试失败", "failed testcase 与 artifact_ref", "failed，触发缺陷流程"]] },
      },
      {
        title: "人类决策、回滚与 NOT_RUN 边界",
        body: [
          "测试 owner 定义 suite、聚合和 blocker；代码 owner 处理失败；MR approver 决定业务变更是否可合并；质量平台只产生可验证 status，不修改 protected branch、approval rule 或直接推送代码。Waiver 必须写入范围、原因、风险 owner、到期时间和补偿测试。",
          "回滚包括撤销过期 SHA 的 success 传播、恢复上一份已批准 gate policy/aggregator 版本、冻结新 status，并按当前 SHA 重跑回归；不能删除旧 JUnit、覆盖失败报告或把 inconclusive 改成 passed。",
          "本页为 desk-researched、static-reviewed：未在真实 GitLab project 创建 MR、触发 Pipeline、读取 JUnit、注册 status check 或验证 tier/权限；真实 Runner、GitLab 版本、报告格式、保护规则和合并结果均为 NOT_RUN。",
        ],
        warning: "NOT_RUN 表示尚未获得真实 GitLab 证据；静态设计不能证明当前 SHA 竞态或 fail-closed 实现已经上线。",
      },
    ],
    practice: ["为两个 commit 生成一条旧 SHA 竞态并拆开 status 与当前 HEAD", "聚合通过、失败、flaky、缺失 suite 四类 JUnit 证据", "让报告 hash 或 SHA 不匹配并确认 gate 不会 success"],
    completion: ["Manifest 能唯一绑定 MR、Pipeline、run、suite 和 SHA", "没有 Pipeline、缺报告或 SHA 不匹配时门禁 fail-closed", "报告和 status 可回链到 artifact、原因、策略版本和审计事件"],
    sourceIds: ["S95", "S96", "S97"],
    evidenceBoundary: "本页基于 GitLab Pipeline/MR/JUnit/status check 官方文档以及质量控制平面设计做 desk research；未连接真实 GitLab 实例或 Runner，版本、tier、权限、报告接口、合并结果和性能指标均为 NOT_RUN。",
    architecture: { title: "当前 SHA 的 MR 质量证据链", caption: "Webhook 触发回读，Pipeline 与 JUnit 只作为当前 SHA 的可验证证据；门禁缺证据即关闭。", nodes: ["GitLab MR/当前 HEAD", "Project Webhook/Inbox", "Pipeline 与 Jobs", "JUnit/Artifact Store", "确定性聚合器", "SHA-bound Status Check", "MR Approval/Protected Branch Gate"] },
    materials: [
      { title: "GitLab SHA 门禁脚本", description: "回读 MR HEAD、Pipeline、JUnit 和 artifact provenance，并输出当前 SHA 的 fail-closed 决策。", href: "materials/quality-platform-integrations/learner-materials/scripts/gitlab_sha_junit_gate.py", kind: "script", validation: "fixture-tested" },
      { title: "MR/JUnit 门禁配置", description: "定义必跑套件、重试计数、flaky/error 口径、artifact hash 和 status 字段。", href: "materials/quality-platform-integrations/learner-materials/configs/gitlab-junit-gate.yaml", kind: "config", validation: "static-reviewed" },
      { title: "MR Pipeline JUnit 夹具", description: "覆盖当前 SHA、旧 SHA、缺报告、失败用例和必跑套件缺失的事件与报告引用。", href: "materials/quality-platform-integrations/learner-materials/fixtures/mr-pipeline-junit.json", kind: "fixture", validation: "static-reviewed" },
      { title: "TD-QP02 SHA/JUnit SOP", description: "指导探针、回读、聚合、status 写入、竞态诊断、回滚和 NOT_RUN 记录。", href: "materials/quality-platform-integrations/learner-materials/guides/td-qp02-sha-junit-sop.md", kind: "guide", validation: "static-reviewed" },
      ...qualityPlatformExecutableMaterials("TD-QP02"),
    ],
  },
  {
    id: "TD-QP03",
    moduleId: "TD-M07",
    order: 3,
    title: "Kubernetes 临时测试环境：隔离、回收与审计",
    type: "跟做",
    status: "fixture-tested",
    duration: "70 分钟",
    summary: "为每次 MR/测试运行设计短生命周期 namespace，落实 RBAC、ResourceQuota、NetworkPolicy、Job TTL、回收和 Kubernetes 审计。",
    why: "临时环境如果共享 namespace、默认读取 Secret、没有网络边界或没有 owner/TTL，就会把测试污染、越权访问和资源泄漏变成平台事故。",
    prerequisites: ["TD-QP02", "TD-PS11"],
    outcomes: ["设计每次 run 独立且可追踪的 namespace 基线", "验证 runner 与 provisioner 的最小权限", "证明 TTL、显式 cleanup 和 Kubernetes audit 能闭环"],
    artifact: "Ephemeral Environment Manifest、RBAC/NetworkPolicy 验收报告、cleanup 和 audit 记录",
    blocks: [
      {
        title: "业务场景：一个 MR 一个可回收环境",
        body: [
          "场景是订单服务 MR 需要执行集成测试。质量平台为 project_id、mr_iid、commit_sha、run_id 创建唯一 namespace，部署被测服务、测试 Job 和报告上传通道；另一个 MR 不能读取、写入或复用这个 namespace。",
          "环境的失败边界包括跨 namespace 访问、读取 Secret、创建未批准资源、突破 CPU/内存/Pod quota、访问未 allowlist 的 endpoint、Job 完成后 namespace 残留和清理器误删非本 run 资源。生产集群和生产 namespace 不在本页范围。",
        ],
        bullets: ["Namespace 标签包含 run、MR、SHA、owner 和 expires_at", "测试 runner 与 namespace provisioner 使用不同身份", "清理器只按精确 owner/run 标签操作"],
      },
      {
        title: "实现：RBAC、网络和生命周期必须同时成立",
        body: [
          "Provisioner 只创建经过 allowlist 的 namespace/template；runner 只在 namespace 内管理测试所需 Job、Pod、Service、ConfigMap 等资源，不读取 Secret、不改 RBAC、不访问其他 namespace。RoleBinding 显式列出 verbs/resources，禁止 wildcard 和 cluster-admin。",
          "ResourceQuota 与 requests/limits 限制 blast radius；NetworkPolicy 默认拒绝 ingress/egress，再按被测服务、DNS、artifact store 需要添加最小 allow policy；Job 设置 ttlSecondsAfterFinished，namespace 同时由 MR close/merge stop、cleanup worker 和过期扫描兜底。",
          "每个资源带 ownerReferences 或精确 run label；environment_id、namespace、policy_hash、expires_at、cleanup_status 写入平台状态和 audit，报告引用只传 artifact_ref，不把凭据塞进事件。",
        ],
        table: { headers: ["身份", "允许", "禁止"], rows: [["NamespaceProvisioner", "创建受控 namespace、绑定模板", "读 Secret、任意 RBAC、生产资源"], ["TestRunner", "本 namespace 测试资源", "跨 namespace、改策略、读 Secret"], ["CleanupWorker", "删除本 run 资源并记录结果", "模糊删除无 owner 资源"]] },
        expected: "固定输入必须暴露身份越权、隔离与回收缺口；没有真实集群或模型证据时保持 NOT_RUN。",
        technical: { kind: "prompt", content: "读取固定 namespace、身份、RBAC、Quota、NetworkPolicy、TTL 与 cleanup；越权、跨 namespace、残留或审计缺失均 fail-closed。", version: "1.0.0", promptPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp03/task.md", manifestPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp03/manifest.json", inputFixturePath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp03/input.json", outputSchemaPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp03/output.schema.json", evaluationPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp03/eval.json" },
      },
      {
        title: "SOP：预检、创建、执行、回收、复核",
        body: [
          "预检 cluster minor/API、Runner、准入策略、网络插件、quota、审计 backend 和 service identity；任何版本或权限未知都标为 NOT_RUN，不直接创建环境。创建时校验名称、标签、RBAC、Quota、NetworkPolicy、ServiceAccount 和 Job TTL，再写 environment.ready。",
          "执行时只允许测试 Job 使用合成/脱敏数据，采集 JUnit、日志和 provenance；Job 完成后先上传不可变工件，再由 stop job 或 cleanup worker 删除带 owner 的资源。TTL 是兜底，不是精确回收 SLA。",
          "复核同时检查 namespace、Pod、Job、Service、ConfigMap 和可能残留的临时存储；按 environment_id、actor、action、resource、time、trace_id 和 policy_hash 关联 Kubernetes audit 与平台记录。",
        ],
        technical: { kind: "command", content: "python3 scripts/ephemeral_namespace_cleanup.py cycle --report-dir reports/td-qp03", manifestPath: "materials/quality-platform-integrations/learner-materials/manifests/td-qp03-lab.json", stepId: "cycle", workingDirectory: "materials/quality-platform-integrations/learner-materials", expectedExitCode: 0, expectedArtifacts: ["reports/td-qp03/baseline.json", "reports/td-qp03/fault.json", "reports/td-qp03/repair.json", "reports/td-qp03/cycle-summary.json"] },
        expected: "一次 run 的创建、测试、失败、过期和删除都可回到同一 environment_id；任何未授权访问或残留资源都不被标记为清理成功。",
      },
      {
        title: "指标、审计与故障注入：观察隔离是否有效",
        body: [
          "指标包括 namespace 创建成功率、Ready 延迟、quota 拒绝率、NetworkPolicy 拒绝/允许命中、RBAC deny 率、Job 完成率、TTL 回收延迟、显式 cleanup 成功率、孤儿资源数、audit 记录完整率和每次 run 的资源成本。清理延迟需按环境类型、集群和资源量分层。",
          "注入 runner 读取 Secret、访问其他 namespace、创建超 quota Pod、连接未 allowlist endpoint、删除 owner label、Job 失败、cleanup worker 403、TTL controller 不可用和 MR 关闭后重复 cleanup。诊断顺序是 API/RBAC → admission/quota → NetworkPolicy → Job/Pod → artifact → cleanup/audit。",
        ],
        table: { headers: ["注入", "证据", "门禁/处置"], rows: [["读 Secret", "kubectl auth can-i deny + K8s audit", "阻断并告警"], ["未 allowlist 网络", "连接失败与 policy 命中", "测试失败，保留 trace"], ["回收失败", "cleanup_status=failed、残留清单", "不报告环境已清理"]] },
      },
      {
        title: "人类决策、回滚与 NOT_RUN 边界",
        body: [
          "平台 owner 批准 namespace 模板和 allowlist；安全 owner 批准 RBAC、网络和 Secret 边界；测试 owner 批准 runner 行为；集群 owner 决定准入、审计和回收策略。AI 可以解释 manifest 或聚类 audit，不得创建任意 RBAC、放宽 NetworkPolicy 或决定清理生产资源。",
          "回滚包括停止新环境创建、恢复上一版已批准模板、隔离受影响 namespace、按 owner label 清理，并重新跑 RBAC/网络/报告回归；若无法证明资源归属，宁可冻结并人工处理，不进行模糊删除。",
          "本页为 desk-researched、static-reviewed：未连接真实 Kubernetes 集群、网络插件、准入控制器、Runner 或审计 backend；cluster minor、RBAC 实际响应、NetworkPolicy enforcement、TTL 时延和孤儿资源结果均为 NOT_RUN。",
        ],
        warning: "Kubernetes manifest 的静态审阅不能证明网络策略被实际 enforcement，也不能证明清理 worker 在目标集群有权限。",
      },
    ],
    practice: ["设计一个含 quota、默认拒绝网络、ServiceAccount 和 Job TTL 的临时环境基线", "为 runner 写出至少三条 can-i 预期结果并加入跨 namespace/Secret 负例", "模拟 cleanup 失败并让报告保留残留资源与审计关联"],
    completion: ["Provisioner、runner、cleaner 权限边界可验证", "环境有 namespace/RBAC/NetworkPolicy/TTL/owner 全套证据", "回收失败、网络越权和审计缺失都会 fail-closed"],
    sourceIds: ["S98", "S99", "S100", "S101"],
    evidenceBoundary: "本页基于 Kubernetes 官方资源模型、RBAC、NetworkPolicy、Job TTL、审计资料和质量平台设计做 desk research；未在真实集群或真实网络插件执行，版本、准入、权限、隔离、回收时延和审计完整性均为 NOT_RUN。",
    architecture: { title: "临时测试环境的隔离与回收链", caption: "环境不是一次性 kubectl apply；身份、资源、网络、生命周期和审计必须共同证明可控。", nodes: ["MR/Run 请求", "Namespace Provisioner", "Namespace/RBAC/ServiceAccount", "Quota/NetworkPolicy", "Test Job/Runner", "TTL/Stop/Cleanup Worker", "K8s Audit/平台审计"] },
    materials: [
      { title: "临时 namespace 回收脚本", description: "按 environment_id 和精确 owner/run 标签检查创建、失败、TTL 与显式 cleanup，输出残留清单。", href: "materials/quality-platform-integrations/learner-materials/scripts/ephemeral_namespace_cleanup.py", kind: "script", validation: "fixture-tested" },
      { title: "临时环境安全基线配置", description: "包含 namespace、RBAC、quota、默认拒绝 NetworkPolicy、ServiceAccount、资源限制和 Job TTL。", href: "materials/quality-platform-integrations/learner-materials/configs/ephemeral-namespace-baseline.yaml", kind: "config", validation: "static-reviewed" },
      { title: "K8s 失败与审计夹具", description: "记录 Secret/跨 namespace deny、quota 拒绝、网络拒绝、Job 失败和 cleanup 残留。", href: "materials/quality-platform-integrations/learner-materials/fixtures/k8s-isolation-audit.json", kind: "fixture", validation: "static-reviewed" },
      { title: "TD-QP03 临时环境 SOP", description: "指导集群预检、创建、运行、故障注入、TTL/stop 回收、审计复核和 NOT_RUN 记录。", href: "materials/quality-platform-integrations/learner-materials/guides/td-qp03-k8s-ephemeral-sop.md", kind: "guide", validation: "static-reviewed" },
      ...qualityPlatformExecutableMaterials("TD-QP03"),
    ],
  },
  {
    id: "TD-QP04",
    moduleId: "TD-M07",
    order: 4,
    title: "跨系统事件总线：幂等、重放、脱敏通知与审计闭环",
    type: "项目",
    status: "fixture-tested",
    duration: "75 分钟",
    summary: "用统一事件信封连接 Jira、GitLab、Kubernetes、证据存储和通知适配器，处理幂等/重放、回写、脱敏和跨系统审计闭环。",
    why: "跨系统集成最容易在重复、乱序、漏投、部分成功和敏感数据泄露时失真。Webhook、ChatOps 和单个系统的状态都不能单独证明质量平台已经完成一次运行。",
    prerequisites: ["TD-QP01", "TD-QP02", "TD-QP03"],
    outcomes: ["定义可去重、可追踪、可脱敏的事件信封", "实现 Jira/GitLab 回写的幂等与 reconciliation 边界", "把通知、外部审计和平台审计闭合为一次 run"],
    artifact: "CloudEvents 风格事件包、Inbox/Outbox/DLQ 记录、回写结果、脱敏通知和审计闭环报告",
    blocks: [
      {
        title: "业务场景：一次质量运行跨四个系统闭环",
        body: [
          "场景是 Jira 需求变更触发 GitLab MR 质量运行：GitLab Pipeline 在 K8s 临时 namespace 执行，JUnit 与日志进入 artifact store，质量平台把缺陷/链接回写 Jira，把当前 SHA gate 写回 GitLab，并向 ChatOps 发送脱敏摘要。任何一步重复、乱序、漏投或部分失败，都必须可解释。",
          "通知系统只消费已脱敏的结果，不成为事实来源；Jira、GitLab、Kubernetes audit、artifact provenance 和平台 append-only audit 共同支撑重建。AI 可以做事件分类、失败聚类和通知草稿，但不能直接发送未审查 PII、创建重复缺陷或改变 gate。",
        ],
        bullets: ["同一 source + id 只产生一次业务副作用", "旧事件不能覆盖新 revision/SHA/环境状态", "通知失败不改变事实状态和门禁结果"],
      },
      {
        title: "实现：CloudEvents 信封加 Inbox/Outbox/DLQ",
        body: [
          "事件最小字段包括 specversion、id、source、type、time、subject、datacontenttype、dataschema，以及 tenant_id、correlation_id、causation_id、trace_id、schema_version、source_event_id、jira_issue_key、gitlab_project_id、mr_iid、commit_sha、run_id 和 artifact_refs。大日志、JUnit、截图和敏感字段只用授权引用读取。",
          "Gateway 验签、限制 timestamp、防重放、校验 project/tenant/type、写 Inbox 后快速返回；Orchestrator 使用状态机和幂等键驱动副作用；跨系统写入先落 Outbox，带 fingerprint、run_id 或 source_event_id；重试超过上限进入 DLQ，reconciliation 从 Jira/GitLab/K8s API 回读事实补偿漏事件。",
          "Jira 缺陷用 fingerprint 幂等创建/更新并链接需求、MR、Pipeline、artifact；GitLab status 绑定当前 SHA 和 pipeline_id；K8s cleanup 只按 environment_id/owner 执行；通知 adapter 只接收 allowlist 字段并记录 delivery audit。",
        ],
        table: { headers: ["层", "关键键", "失败处理"], rows: [["Inbox", "source + event id", "重复抑制并记录 duplicate_suppressed"], ["Outbox", "effect type + run/fingerprint", "幂等重试，超限 DLQ"], ["Reconciliation", "current revision/SHA/environment", "回读事实，禁止旧状态覆盖新状态"]] },
        expected: "固定输入必须拒绝重复副作用并给出对账/回滚计划；未执行真实消息系统或模型。",
        technical: { kind: "prompt", content: "读取固定 CloudEvents 信封和副作用账本；核对 source+id、trace、重试、脱敏、reconciliation 与 rollback，重复副作用必须失败。", version: "1.0.0", promptPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp04/task.md", manifestPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp04/manifest.json", inputFixturePath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp04/input.json", outputSchemaPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp04/output.schema.json", evaluationPath: "materials/quality-platform-integrations/learner-materials/prompts/td-qp04/eval.json" },
      },
      {
        title: "SOP：验签、入站、编排、回写、通知、对账",
        body: [
          "先固定 schema_version、tenant/project allowlist、签名密钥、重放时间窗、审计字段、脱敏规则和保留期限；再接收 Jira/GitLab 事件，验签并去重，回读上游状态，生成 causation 链。未通过签名、租户或 schema 的事件不进入副作用队列。",
          "编排阶段按状态机处理 approved requirement、current SHA、environment ready、results collected、gate evaluated 和 defect synced；每个动作先检查当前版本，再写目标系统。Jira/GitLab 返回 429/5xx 时只重试安全边界内的读或带幂等键的写；通知失败只进入通知 outbox。",
          "恢复阶段运行 reconciliation，比较平台状态与 Jira/GitLab/K8s 事实，补齐漏事件或标记人工处理；重放实验必须证明事件副作用只发生一次，旧事件只能产生 duplicate/superseded audit，不能回滚当前状态。",
        ],
        technical: { kind: "command", content: "python3 scripts/event_replay_and_reconcile.py cycle --report-dir reports/td-qp04", manifestPath: "materials/quality-platform-integrations/learner-materials/manifests/td-qp04-lab.json", stepId: "cycle", workingDirectory: "materials/quality-platform-integrations/learner-materials", expectedExitCode: 0, expectedArtifacts: ["reports/td-qp04/baseline.json", "reports/td-qp04/fault.json", "reports/td-qp04/repair.json", "reports/td-qp04/cycle-summary.json"] },
        expected: "给定一个 run_id，可以从首个 Jira 事件到最终 gate、缺陷、通知、环境回收和外部审计引用重建完整 causation graph。",
      },
      {
        title: "指标、审计与故障注入：让部分成功可诊断",
        body: [
          "指标包括事件接收/验签/去重率、Inbox lag、Outbox age、DLQ depth、reconciliation repair rate、重复副作用率、Jira/GitLab 回写成功率、通知脱敏违规数、通知投递延迟、跨系统 trace 完整率和审计关联完整率。每项按 event type、tenant、system、run 和 policy_version 分层。",
          "注入同一事件重复投递、旧 timestamp 重放、乱序 gate/结果、Jira 创建后响应丢失、GitLab status 429、K8s cleanup 延迟、DLQ 堵塞、含 PII 的失败堆栈、通知 endpoint 超时和 reconciliation 发现旧 SHA。诊断顺序是签名/Inbox → 状态版本 → Outbox/DLQ → 目标 API 回读 → artifact/provenance → 通知脱敏 → audit graph。",
        ],
        table: { headers: ["失败", "不得做的事", "正确状态"], rows: [["Jira 写入响应丢失", "直接重建新缺陷", "按 fingerprint 回读并幂等补偿"], ["通知超时", "改 gate 或伪造已通知", "事实已落库，通知 pending/failed"], ["旧事件到达", "覆盖当前 revision/SHA", "duplicate/superseded 并审计"]] },
      },
      {
        title: "人类决策、回滚与 NOT_RUN 边界",
        body: [
          "平台 owner 决定事件 schema、重试和对账策略；Jira owner 决定缺陷字段/transition；GitLab owner 决定 status/approval 规则；集群 owner 决定环境回收；安全/隐私 owner 决定通知 allowlist 和脱敏；审计 owner 决定保留、访问和复核。AI 不得替代这些责任人。",
          "回滚先冻结新的外部成功状态和高风险回写，再恢复上一版 schema/adapter/policy，保留 Inbox/Outbox/DLQ 原始记录，按 current revision/SHA reconciliation，必要时人工批准补偿；不能删除重复事件、通知失败或审计证据。",
          "本页为 desk-researched、static-reviewed：未在真实 Jira/GitLab 租户、Kubernetes 集群、事件总线、通知频道或审计后端投递/重放事件；真实签名、网络、租户权限、丢包、延迟、脱敏效果和回写结果均为 NOT_RUN。",
        ],
        warning: "跨系统静态契约不能证明 delivery guarantee；只有隔离租户/集群的重放和故障验收产生真实闭环证据。",
      },
    ],
    practice: ["设计包含 Jira/GitLab/K8s 关联字段的最小事件信封", "重放一次事件并证明 Jira 缺陷、GitLab status 和 K8s cleanup 不重复", "让通知含敏感字段并确认被脱敏拒绝，同时用 reconciliation 修复一次漏事件"],
    completion: ["Inbox/Outbox/DLQ/reconciliation 的职责和幂等键明确", "回写、通知和清理的部分成功状态可分别诊断", "审计 graph 能关联 actor、action、resource、run、trace、版本和结果"],
    sourceIds: ["S102", "S89", "S93", "S95", "S101"],
    evidenceBoundary: "本页基于 CloudEvents、W3C Trace Context、Atlassian/GitLab/Kubernetes 官方资料与研究重设计做 desk research；未在真实租户、集群、事件总线或通知系统执行投递/重放，delivery、幂等、回写、脱敏和审计闭环均为 NOT_RUN。",
    architecture: { title: "跨系统质量事件的审计闭环", caption: "事件网关负责可信入站，编排器负责状态与副作用，适配器负责回写；通知只是脱敏消费者。", nodes: ["Jira/GitLab/K8s 上游事件", "Event Gateway/验签去重", "Inbox/Outbox/DLQ", "Quality Orchestrator/状态机", "Jira/GitLab/K8s 适配器", "Artifact/脱敏通知", "Reconciliation/Trace/审计 Sink"] },
    materials: [
      { title: "事件重放与对账脚本", description: "重放重复/乱序/旧事件，检查 Jira/GitLab/K8s 副作用幂等，并从当前事实执行 reconciliation。", href: "materials/quality-platform-integrations/learner-materials/scripts/event_replay_and_reconcile.py", kind: "script", validation: "fixture-tested" },
      { title: "事件网关策略配置", description: "定义 CloudEvents 字段、验签时间窗、tenant allowlist、去重键、重试/DLQ 和脱敏字段。", href: "materials/quality-platform-integrations/learner-materials/configs/event-gateway-policy.yaml", kind: "config", validation: "static-reviewed" },
      { title: "跨系统质量事件夹具", description: "包含 Jira 需求、GitLab gate、K8s cleanup、重复/乱序事件和含敏感字段的通知输入。", href: "materials/quality-platform-integrations/learner-materials/fixtures/quality-event-envelope.json", kind: "fixture", validation: "static-reviewed" },
      { title: "TD-QP04 事件审计 SOP", description: "指导入站验签、幂等/重放、回写、脱敏通知、DLQ、对账、回滚和 NOT_RUN 记录。", href: "materials/quality-platform-integrations/learner-materials/guides/td-qp04-event-audit-sop.md", kind: "guide", validation: "static-reviewed" },
      ...qualityPlatformExecutableMaterials("TD-QP04"),
    ],
  },
] satisfies TutorialPage[]).map((page): TutorialPage => ({
  ...page,
  blocks: composeDeepPage(page.blocks, qualityPlatformDeepBlocks(page.id)),
})).map(wave3QualityPlatformDepth).map(wave5QualityPlatformDepth).map(wave5QualityPlatformCaseNotes).map(wave5QualityPlatformFinalDepth).map(wave5QualityPlatformAcceptance).map(wave5QualityPlatformProjectDecision).map(wave5QualityPlatformTargetRepair);
