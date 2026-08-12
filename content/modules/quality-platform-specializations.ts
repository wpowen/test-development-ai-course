import type { TutorialPage } from "../course.ts";

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

export const qualityPlatformSpecializationPages: TutorialPage[] = [
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
];
