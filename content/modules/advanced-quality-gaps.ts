import type { TutorialPage } from "../course.ts";

type GapSpec = {
  id: "TD-X602" | "TD-X101" | "TD-X501" | "TD-X502" | "TD-X601" | "TD-X603" | "TD-X604" | "TD-X805";
  moduleId: string;
  title: string;
  prerequisites: string[];
  summary: string;
  why: string;
  outcomes: string[];
  artifact: string;
  situation: string[];
  flow: string[];
  nodes: string[];
  decisionRows: string[][];
  prompt: string;
  metrics: string[];
  fault: string;
  baseline: string;
  repair: string;
  practice: string[];
  completion: string[];
  sources: string[];
  boundary: string;
};

const WORKDIR = "materials/advanced-quality";

const makePage = (spec: GapSpec): TutorialPage => {
  const slug = spec.id.toLowerCase();
  const manifestPath = `${WORKDIR}/page-manifests/${spec.id}.json`;
  const promptRoot = `${WORKDIR}/page-prompts/${spec.id}`;
  const report = `reports/${slug}`;
  return {
    id: spec.id,
    moduleId: spec.moduleId,
    order: 0,
    title: spec.title,
    type: "项目",
    status: "fixture-tested",
    duration: "85 分钟",
    summary: spec.summary,
    why: spec.why,
    prerequisites: spec.prerequisites,
    outcomes: spec.outcomes,
    artifact: spec.artifact,
    blocks: [
      {
        title: `${spec.title}：错误决定会造成什么`,
        body: [
          ...spec.situation,
          `本页 method 的可交付物是${spec.artifact}；先固定风险与停止条件，再决定哪些检查交给 runner。`,
        ],
        warning: spec.boundary,
      },
      {
        title: `${spec.title}：证据如何到达独立 Oracle`,
        body: [
          ...spec.flow,
          `独立 Oracle 不读取模型的自我批准，而依据受保护输入和 owner 规则执行“${spec.decisionRows[0]?.[0]}”的判定。`,
        ],
        technical: {
          kind: "diagram",
          content: spec.nodes.join(" → "),
          verification: `沿 ${spec.nodes.join("、")} 逐项核对来源、版本、owner 和停止状态；缺一项就保留 UNKNOWN。`,
        },
      },
      {
        title: `${spec.id} 停止表：哪些证据不能被平均值抵消`,
        body: [
          ...spec.metrics,
          `Fault 将验证门禁是否真的阻断这类故障：${spec.fault}`,
        ],
        table: {
          headers: ["证据状态", "动作", "禁止事项"],
          rows: spec.decisionRows,
          caption: `${spec.id} 的 owner 与停止条件`,
        },
      },
      {
        title: `${spec.title} 的 Prompt / Eval / Mutation 分工`,
        body: [
          `Prompt 任务是：${spec.prompt}`,
          `Eval 把 ${spec.metrics.join(" ")} 转成可检查项；Mutation 只注入既定故障，不改 expected：${spec.fault}`,
          "Critic 只指出引用、版本或停止状态缺口；独立 owner 位于 Prompt 包之外，当前 provider/model 仍为 NOT_RUN。",
        ],
        technical: {
          kind: "prompt",
          content: spec.prompt,
          version: "1.0.0",
          promptPath: `${promptRoot}/prompt-v1.md`,
          manifestPath: `${promptRoot}/manifest.json`,
          inputFixturePath: `${promptRoot}/input.json`,
          outputSchemaPath: `${promptRoot}/schema.json`,
          evaluationPath: `${promptRoot}/eval.json`,
        },
        expected: "输出必须保留 source refs、owner、limitations 与 stop_state；不得自建 Oracle、自批例外或生成生产通过结论。",
      },
      {
        title: `${spec.id} Baseline（退出 0）：先证明正常路径可观察`,
        body: [spec.baseline, `如果这一步失败，优先检查 ${spec.nodes.slice(0, 3).join("、")} 是否缺失；不要进入 fault。`],
        technical: {
          kind: "command",
          content: `python3 advanced_quality_lab.py run --topic ${spec.id} --phase baseline --report ${report}-baseline.json`,
          manifestPath,
          stepId: `${slug}-baseline`,
          workingDirectory: WORKDIR,
          expectedExitCode: 0,
          expectedArtifacts: [`${report}-baseline.json`],
        },
        expected: `PASS/0；${spec.baseline} 报告同时保留 Prompt manifest hash、逐项 checks 与限制。`,
      },
      {
        title: `${spec.id} Fault（退出 1）：让目标故障被点名`,
        body: [spec.fault, `若仍退出 0，检查 ${spec.nodes.slice(-3).join("、")} 是否只被展示而未参与断言；不得吞异常或改 Oracle。`],
        technical: {
          kind: "command",
          content: `python3 advanced_quality_lab.py run --topic ${spec.id} --phase fault --report ${report}-fault.json`,
          manifestPath,
          stepId: `${slug}-fault`,
          workingDirectory: WORKDIR,
          expectedExitCode: 1,
          expectedArtifacts: [`${report}-fault.json`],
        },
        expected: `FAIL/1；failed_checks 必须能回指这次 Mutation：${spec.fault}`,
      },
      {
        title: `${spec.id} Repair（恢复退出 0）：只修根因`,
        body: [spec.repair, `用同一 Prompt manifest 与阈值重放；完成后逐条核对 ${spec.completion.join("、")}。`],
        technical: {
          kind: "command",
          content: `python3 advanced_quality_lab.py run --topic ${spec.id} --phase repair --report ${report}-repair.json`,
          manifestPath,
          stepId: `${slug}-repair`,
          workingDirectory: WORKDIR,
          expectedExitCode: 0,
          expectedArtifacts: [`${report}-repair.json`],
        },
        expected: `PASS/0；${spec.repair} 该结果只覆盖同一合成合同。`,
      },
      {
        title: `${spec.title}：把 fixture 迁移到真实项目还缺什么`,
        body: [
          ...spec.metrics,
          spec.boundary,
          `迁移时至少替换合成输入与 owner，重新确认${spec.completion.join("、")}，并补 live 集成、practitioner 复核和 production 读回。`,
        ],
      },
    ],
    practice: spec.practice,
    completion: spec.completion,
    sourceIds: spec.sources,
    evidenceBoundary: spec.boundary,
    architecture: {
      title: `${spec.title} 的证据闭环`,
      caption: `${spec.nodes.join(" → ")}；生成候选的模型不拥有 Oracle 或发布决定。`,
      nodes: spec.nodes,
    },
    materials: [
      { title: "高级质量实验完整包", description: "包含八页 runner、Prompt/Eval/Mutation、执行 manifest、报告和哈希清单。", href: "materials/advanced-quality.zip", kind: "archive", validation: "fixture-tested" },
      { title: "确定性高级质量 Runner", description: "离线执行八个主题的 baseline、fault 与 repair，不调用模型。", href: `${WORKDIR}/advanced_quality_lab.py`, kind: "script", validation: "fixture-tested" },
      { title: `${spec.id} 执行 Manifest`, description: "固定三条命令、工作目录、预期退出码和报告路径。", href: manifestPath, kind: "config", validation: "fixture-tested" },
      { title: `${spec.id} Prompt 包 Manifest`, description: "绑定 Prompt、Schema、Eval、Mutation、Critic、模型边界与独立 owner。", href: `${promptRoot}/manifest.json`, kind: "config", validation: "static-reviewed" },
      { title: `${spec.id} Fault 报告`, description: "目标故障被阻断的可重放负控制；不是生产证明。", href: `${WORKDIR}/${report}-fault.json`, kind: "evidence", validation: "fixture-tested" },
      { title: `${spec.id} Repair 报告`, description: "相同合同恢复后的收据；保留 model_evidence=NOT_RUN。", href: `${WORKDIR}/${report}-repair.json`, kind: "evidence", validation: "fixture-tested" },
    ],
  };
};

const specs: GapSpec[] = [
  {
    id: "TD-X602", moduleId: "TD-M05", title: "训练、Fine-tuning 与模型更新的版本化验收", prerequisites: ["TD-Q10"],
    summary: "把训练数据、基座、代码、超参、holdout、候选模型和回滚目标锁进同一 lineage，再比较关键切片。",
    why: "只记录最终模型名无法复现实验；训练污染、数据许可、灾难性遗忘和回滚缺口会被一个平均分掩盖。",
    outcomes: ["建立训练运行与模型候选 lineage", "封存 holdout 并检测污染", "用版本漂移 mutation 验证阻断与回滚"],
    artifact: "模型更新 manifest、候选比较、污染门禁与 0→1→0 收据",
    situation: ["团队准备微调客服模型。测试开发不是只比较新旧总分，而要确认数据来源、许可、划分、基座 hash、代码、超参、环境和回滚版本。", "模型是候选而不是最新即正确；关键业务切片、拒答和安全 blocker 需要独立 owner。"],
    flow: ["先冻结批准目的和 lineage，再封存 holdout；候选与基座在相同协议下比较，任何污染或版本断链直接阻断。"],
    nodes: ["批准目的", "数据 lineage", "基座/代码/超参快照", "封存 Holdout", "候选比较", "独立 Owner", "注册或回滚"],
    decisionRows: [["lineage 与 holdout 闭合", "进入候选比较", "不得跳过关键切片"], ["数据版本或许可缺失", "BLOCKED", "不得训练后补记录"], ["关键切片退化", "FAIL 并回滚", "不得用平均值抵消"]],
    prompt: "读取批准的训练 manifest 与独立 eval 结果，只输出带数据、基座、代码、超参、holdout 和 rollback refs 的候选比较；缺失或污染返回 BLOCKED。",
    metrics: ["关键切片 delta、holdout contamination、blocker 和 rollback readiness 分开报告；真实收益与灾难性遗忘仍 UNKNOWN。"],
    fault: "Fault 取消版本固定并把训练样本混入 holdout，versions_pinned、lineage_complete 与 holdout_sealed 必须同时变红。",
    baseline: "Baseline 要求训练快照闭合、holdout 封存且回滚候选存在，但不运行真实训练。",
    repair: "恢复数据/基座/代码/超参版本和封存 holdout；不能删除受污染样本后假装原评测仍有效。",
    practice: ["画出一次模型更新 lineage", "运行 0→1→0 并解释污染为何使旧分数失效", "为真实项目列出许可与硬件 UNKNOWN"],
    completion: ["所有候选能唯一定位", "holdout 污染稳定阻断", "能区分 fixture 可执行与真实训练效果"],
    sources: ["S24","S40","S65","S66"], boundary: "10 个 opened 来源、双 research run 与确定性 0→1→0 支持工程合同；训练、模型调用、许可审查、从业者复核和生产收益 NOT_RUN。",
  },
  {
    id: "TD-X101", moduleId: "TD-M00", title: "静态、架构、代码与依赖供应链门禁", prerequisites: ["TD-F04"],
    summary: "把 diff、架构边界、SBOM、provenance、签名、扫描发现与例外 owner 连成可审计合并门禁。",
    why: "零告警只代表已配置规则没有发现；语言盲区、私有依赖、未签名工件和过期例外仍可能存在。",
    outcomes: ["区分代码、架构与供应链证据", "为 critical 发现绑定 owner 和例外期限", "注入未签名依赖验证 fail-closed"],
    artifact: "SBOM/签名/架构/扫描联合门禁与负控制报告",
    situation: ["一次依赖升级同时改变传递依赖和网络访问边界。扫描器输出不是安全结论，测试开发要核对构建图、SBOM、来源证明、签名与架构约束。", "不同语言和构建系统覆盖不同；无法证明来源的依赖不能因测试通过而放行。"],
    flow: ["从 trust boundary 与 commit 开始生成 SBOM，验证 provenance/signature，再将发现、owner 和有期限例外交给合并门禁。"],
    nodes: ["Trust Boundary", "Commit/Diff", "SBOM", "Provenance/Signature", "静态发现", "Owner/例外", "合并门禁"],
    decisionRows: [["SBOM 与签名闭合", "继续扫描与审查", "不等同安全"], ["未签名或来源未知", "FAIL", "不得以测试绿放行"], ["critical 无 owner", "BLOCKED", "不得长期忽略"]],
    prompt: "基于固定 commit、架构规则、SBOM 和签名记录生成带证据引用的发现候选；禁止把零发现写成安全，critical 无 owner 或依赖未签名必须停止。",
    metrics: ["报告 SBOM 完整率、签名验证、critical owner 与例外到期；真实构建覆盖、误报率和私有依赖 UNKNOWN。"],
    fault: "Fault 加入未签名依赖并删除 critical owner，dependency_signed 与 critical_findings_owned 必须变红。",
    baseline: "Baseline 验证合成 SBOM、签名、架构检查与 owner 均存在。",
    repair: "恢复可验证签名并指派具名 owner；不能通过降严重度或关闭规则修绿。",
    practice: ["为一个依赖升级画 trust boundary", "运行未签名依赖 fault", "列出静态结果不覆盖的运行风险"],
    completion: ["扫描结果能回到 commit/SBOM", "未签名与无人负责 critical 会阻断", "不把零告警写成安全"],
    sources: ["S08","S41","S50","S64"], boundary: "10 个 opened 来源与 0→1→0 支持离线供应链合同；真实构建、漏洞利用、安全审计和生产风险 NOT_RUN。",
  },
  {
    id: "TD-X501", moduleId: "TD-M03", title: "多模态关系与独立 Oracle 评测", prerequisites: ["TD-L03"],
    summary: "验证图文、音画或视频时序之间的关系，在矛盾、缺模态和拒答场景中保留原始工件与人工复核。",
    why: "分别得到高单模态分数，不代表跨模态指代、时序和语义一致；同一模型描述图片再自评会复制偏差。",
    outcomes: ["建立配对模态 fixture 与关系 Oracle", "注入跨模态矛盾", "区分自动关系检查与人工语义判断"],
    artifact: "多模态配对集、关系指标、反例与独立复核记录",
    situation: ["报障系统同时接收截图、语音和文字。答案必须绑定同一事件，不能只看每个模态是否可解析。", "关键模态缺失、跨模态冲突或时间轴错位要显式拒答或转人工。"],
    flow: ["先声明模态合同和配对 ID，再建立跨模态关系 Oracle；保留矛盾反例并按模态/设备/任务切片。"],
    nodes: ["任务/模态合同", "配对 Fixture", "跨模态关系", "独立 Oracle", "矛盾注入", "切片指标", "人工复核"],
    decisionRows: [["模态齐全且关系一致", "进入候选复核", "仍需语义 owner"], ["关键模态缺失", "拒答/转人工", "不得猜测"], ["图文或音画冲突", "FAIL", "不得用单模态分抵消"]],
    prompt: "读取配对模态 refs 和独立关系 Oracle，输出关系候选、冲突、缺失与应拒答状态；不得让同一模型生成描述后批准自己的答案。",
    metrics: ["模态覆盖、跨模态一致性、应拒答率与人工一致率分开报告；设备差异、音画同步和生产分布 UNKNOWN。"],
    fault: "Fault 制造图文矛盾并移除独立 Oracle，cross_modal_alignment 与 oracle_independent 必须变红。",
    baseline: "Baseline 验证所有模态存在、关系一致、Oracle 独立并保留反例容器。",
    repair: "恢复正确配对和独立 Oracle；不能删除冲突样本或让模型自评。",
    practice: ["定义一组图文关系 Oracle", "运行矛盾 fault", "为缺音频场景定义拒答与转人工"],
    completion: ["不把单模态高分当关系正确", "矛盾和 Oracle 缺失会阻断", "原始模态工件可追溯"],
    sources: ["S23","S36","S37","S65"], boundary: "10 个 opened 来源与合成跨模态 fault 支持合同；真实设备、模型、标注者、污染与生产体验 NOT_RUN。",
  },
  {
    id: "TD-X502", moduleId: "TD-M03", title: "多语言、可访问与包容性 AI 任务验收", prerequisites: ["TD-X501"],
    summary: "从真实用户任务建立 locale、script、RTL、键盘、可访问名称和翻译语义矩阵，拒绝英文平均分外推。",
    why: "翻译文本存在不等于任务能完成；多数语言均值会掩盖关键 locale、键盘路径和屏幕阅读阻断。",
    outcomes: ["建立 locale 与辅助技术任务矩阵", "分开语言等价和交互可达性", "注入 locale/键盘/名称缺口"],
    artifact: "语言与可访问任务矩阵、阻断切片和本地化 owner 记录",
    situation: ["同一 AI 表单面向中英阿拉伯语用户与键盘/屏幕阅读器用户。测试需要验证任务语义和交互，而不是只比较翻译相似度。", "文化伤害和法律适用必须由具备背景的人审查。"],
    flow: ["冻结用户任务和必要 locale，建立等价语义与键盘/名称 Oracle，按 locale/script/辅助技术切片并交给本地化 owner。"],
    nodes: ["用户任务", "Locale/Script 矩阵", "语义等价", "键盘/名称 Oracle", "切片运行", "本地化 Owner", "阻断/接受"],
    decisionRows: [["必要 locale 任务通过", "交本地化复核", "不外推其他方言"], ["键盘或名称 blocker", "FAIL", "不得用视觉可用抵消"], ["文化语义未评审", "UNKNOWN", "不得自动批准"]],
    prompt: "依据必需 locale、用户任务和独立键盘/名称 Oracle 生成分切片结果；缺 locale、RTL、accessible name 或 owner 时返回 BLOCKED。",
    metrics: ["locale 任务成功、翻译分歧、键盘 blocker 与 accessible-name 完整率分别报告；文化伤害、设备矩阵和法律 UNKNOWN。"],
    fault: "Fault 删除必需 locale 并破坏键盘与可访问名称，required_locales_covered 和 keyboard_and_name_gate 必须变红。",
    baseline: "Baseline 只证明合成 locale、RTL、键盘、名称和翻译 owner 合同齐备。",
    repair: "恢复必需 locale 与键盘/名称语义；不能删除相关用户任务求绿。",
    practice: ["建立三种 locale 的任务矩阵", "运行 locale/键盘 fault", "列出需要母语和辅助技术用户复核的 UNKNOWN"],
    completion: ["语言和可访问性按任务验收", "关键切片 blocker 不被平均值覆盖", "知道 fixture 不证明包容性"],
    sources: ["S23","S62","S65","S90"], boundary: "10 个 opened 来源与离线门禁支持合同；真实用户、辅助技术设备、文化伤害、法律和包容性结论 NOT_RUN。",
  },
  {
    id: "TD-X601", moduleId: "TD-M05", title: "公平、伤害与 HITL 有效性门禁", prerequisites: ["TD-X502"],
    summary: "把群体切片、最坏结果、伤害 blocker、独立人工样本、override 与申诉效果连成可审计控制。",
    why: "一个平均公平分和流程图上的人工步骤，都不能证明严重伤害被发现或人工有权限改变结果。",
    outcomes: ["定义合法切片和伤害模型", "检验 HITL 的独立性、覆盖与权力", "阻断 aggregate-only 和自评故障"],
    artifact: "群体切片报告、伤害 blocker、HITL 抽样与 override 账本",
    situation: ["候选模型总体指标提升，但一个关键群体的拒绝率恶化。测试开发要保留最坏切片、样本限制和伤害严重度。", "人工复核必须抽到失败和低置信样本，并能真正 override、申诉和回溯。"],
    flow: ["从使用情境和伤害模型开始，合法地定义切片；报告最坏切片与 blocker，再由独立人工样本和具名 owner 决定。"],
    nodes: ["使用情境/伤害模型", "合法切片", "分组结果", "最坏切片/Blocker", "独立人工样本", "分歧/申诉", "具名决定"],
    decisionRows: [["总体改善且切片无 blocker", "进入独立复核", "不代表无伤害"], ["严重伤害切片", "FAIL", "不得平均抵消"], ["HITL 无权限或只抽成功", "控制无效", "不得标记人工通过"]],
    prompt: "读取合法批准的群体切片和独立人工样本，只输出分组结果、伤害 blocker、分歧、override 和限制；不得推断未提供属性或让同一模型自评。",
    metrics: ["最坏切片、伤害 blocker、人工覆盖、评审一致率与 override 时延分别报告；因果公平和真实伤害 UNKNOWN。"],
    fault: "Fault 只保留汇总平均并让同一模型自评，group_slices_reported、harm_blockers_separate 与 independent_human_sample 必须变红。",
    baseline: "Baseline 验证合成切片、伤害 blocker、独立人工样本和分歧保留合同。",
    repair: "恢复分组结果与独立人工样本；不能删除受影响群体或把异议改成一致。",
    practice: ["写出一个伤害模型和合法切片限制", "运行 aggregate-only fault", "检查人工是否有覆盖、权限和回执"],
    completion: ["不以平均值覆盖严重伤害", "HITL 有独立性和实际作用", "不把 fixture 写成公平证明"],
    sources: ["S07","S23","S40","S65"], boundary: "10 个 opened 来源与合成切片 fault 支持控制形状；受保护数据合法性、因果公平、真实伤害、专业复核和生产效果 NOT_RUN。",
  },
  {
    id: "TD-X603", moduleId: "TD-M04", title: "长期 Memory、个性化与语义缓存治理", prerequisites: ["TD-A17"],
    summary: "用同意、目的、用户隔离、TTL、版本、删除回执和缓存失效防止跨用户泄露与陈旧个性化。",
    why: "相似答案不证明缓存可用；长期记忆一旦缺少主体、目的和删除传播，就可能泄露用户数据并固化旧模型行为。",
    outcomes: ["建立 Memory 生命周期与同意合同", "验证用户/租户隔离和删除回执", "注入跨用户陈旧缓存故障"],
    artifact: "Memory/缓存 manifest、隔离门禁、删除回执与陈旧命中反例",
    situation: ["助手保存用户偏好并用语义缓存降成本。测试开发要验证谁的数据、为何保存、保存多久、谁可读，以及模型/Prompt/知识升级后旧命中如何失效。", "删除请求必须跨主存、索引和缓存传播。"],
    flow: ["先验证同意和目的，再用 user/tenant key 隔离写入；检索和缓存带版本，冲突与删除产生可核对回执。"],
    nodes: ["同意/目的", "用户/租户隔离", "写入/TTL", "检索/缓存版本", "冲突/删除", "回执", "回归"],
    decisionRows: [["同意、隔离、TTL 完整", "允许候选写入", "仍需最小化"], ["跨用户命中", "FAIL", "不得返回近似答案"], ["删除无回执或缓存陈旧", "BLOCKED", "不得声称已删除"]],
    prompt: "只基于批准同意、user/tenant、TTL、模型/Prompt/知识版本和删除回执生成 Memory/缓存决策；任何跨用户或旧版本命中必须停止。",
    metrics: ["跨用户泄露、陈旧命中、删除传播、同意覆盖与 cache bypass 分开报告；真实法律、用户预期和长期漂移 UNKNOWN。"],
    fault: "Fault 造成跨用户命中并保留旧版本缓存，user_isolation 与 cache_version_current 必须变红。",
    baseline: "Baseline 验证同意、TTL、用户隔离、缓存版本和删除回执合同。",
    repair: "恢复隔离 key 并失效旧版本缓存；不能只删除 UI 记录或改相似阈值。",
    practice: ["画出删除传播路径", "运行跨用户陈旧缓存 fault", "为模型升级定义 cache invalidation key"],
    completion: ["Memory 写入有同意与目的", "跨用户和陈旧命中会阻断", "删除有可复核回执"],
    sources: ["S35","S49","S65","S66"], boundary: "10 个 opened 来源与离线隔离 fault 支持合同；真实隐私法律、用户同意、存储系统、删除传播与生产漂移 NOT_RUN。",
  },
  {
    id: "TD-X604", moduleId: "TD-M04", title: "模型路由、Fallback 与工具协议漂移测试", prerequisites: ["TD-A20"],
    summary: "每次模型、Provider、MCP server 或工具 fallback 都重新检查能力、区域、权限、Schema、幂等和副作用。",
    why: "把 fallback 当简单重试会静默降低结构化输出、上下文、数据区域和工具权限，并可能重复不可逆动作。",
    outcomes: ["建立能力/权限/协议路由合同", "检测 Schema 漂移和不安全 fallback", "验证副作用不会因重试重复"],
    artifact: "路由策略、协议兼容矩阵、fallback 负控制与 Trace",
    situation: ["主 Provider 超时后路由器切换模型并调用 MCP 工具。测试开发要确认候选满足能力和区域政策，工具 Schema 兼容，重试不会重复下单。", "每次 fallback 都是新决策，不继承原批准。"],
    flow: ["请求合同匹配能力、区域和权限；路由后验证协议/Schema，fallback 重新授权，副作用由幂等门禁保护并记录 Trace。"],
    nodes: ["请求合同", "能力/区域/权限", "Provider 路由", "协议/Schema", "Fallback 再授权", "副作用门禁", "Trace/回滚"],
    decisionRows: [["能力与协议匹配", "允许候选调用", "仍需工具结果 Oracle"], ["fallback 能力降级", "拒绝/降级功能", "不得静默继续"], ["副作用幂等未知", "BLOCKED", "不得自动重试"]],
    prompt: "依据请求能力、区域、权限、provider 与 MCP/tool schema 版本生成路由候选；fallback 必须重新授权，副作用幂等未知时拒绝执行。",
    metrics: ["能力错配、Schema 拒绝、fallback 质量、重复副作用和重试放大分开报告；真实容量、价格与模型等价性 UNKNOWN。"],
    fault: "Fault 切换到能力不满足的 fallback 并注入协议漂移，capability_match、protocol_schema_pinned 与 fallback_policy_preserved 必须变红。",
    baseline: "Baseline 验证合成能力、协议版本、fallback 政策与副作用门禁。",
    repair: "恢复满足能力的 provider 与固定 Schema，并重新执行授权；不能吞解析错误继续调用。",
    practice: ["为一个工具调用写能力和权限矩阵", "运行 fallback/schema fault", "设计不可逆动作的幂等和人工门禁"],
    completion: ["fallback 会重新授权", "协议漂移稳定阻断", "副作用不会盲目重试"],
    sources: ["S39","S48","S49","S65"], boundary: "10 个 opened 来源与合成协议 fault 支持合同；真实 Provider、容量、区域合规、MCP server 和生产副作用 NOT_RUN。",
  },
  {
    id: "TD-X805", moduleId: "TD-M05", title: "在线实验、Canary 与人工抽样发布门禁", prerequisites: ["TD-X604"],
    summary: "用稳定分流、离线 blocker、小流量 guardrail、最坏切片、代表性人工样本和预置回滚控制渐进发布。",
    why: "总体 KPI 尚未变化不代表安全；分流污染、少数切片退化和只抽成功样本会让 Canary 给出假绿。",
    outcomes: ["建立稳定分流与预置回滚", "区分收益指标和 guardrail", "注入分流/guardrail/抽样故障"],
    artifact: "实验 manifest、Canary guardrail、人工样本账本与回滚收据",
    situation: ["团队准备逐步放量新 Agent。测试开发要先过离线 blocker，再验证分流完整、最坏切片、失败/低置信样本和回滚时延。", "Canary 第一职责是限制伤害，不是抢先证明收益。"],
    flow: ["先写假设与最小效果，稳定分流并过离线门禁；小流量期间监控 guardrail/最坏切片和代表性人工样本，再扩量或回滚。"],
    nodes: ["假设/MDE", "稳定分流", "离线门禁", "小流量 Canary", "Guardrail/最坏切片", "人工抽样", "扩量/回滚"],
    decisionRows: [["分流与 blocker 通过", "进入小流量", "不得直接全量"], ["guardrail 或最坏切片退化", "回滚", "不得等待总体 KPI"], ["人工样本只含成功", "BLOCKED", "不得支持扩量"]],
    prompt: "读取实验假设、assignment、离线 blocker、guardrail、切片、人工抽样和 rollback manifest；分流污染、严重退化或样本不代表时必须停止。",
    metrics: ["分流完整、guardrail、最坏切片、人工样本覆盖与回滚时延分别报告；真实流量、MDE、长期效果和业务阈值 UNKNOWN。"],
    fault: "Fault 污染 assignment、让 guardrail 退化并只抽成功样本，assignment_integrity、guardrails_pass 与 human_sample_representative 必须变红。",
    baseline: "Baseline 验证合成分流、guardrail、人工样本与 rollback ready 合同。",
    repair: "恢复稳定分流、阻断阈值和代表性样本；不能删除失败用户或延后回滚。",
    practice: ["写一个 Canary 停止规则", "运行分流/guardrail fault", "设计覆盖失败和低置信的人工抽样"],
    completion: ["guardrail 失败立即回滚", "人工抽样具有代表性", "不把离线 fixture 写成线上实验成功"],
    sources: ["S24","S40","S47","S58"], boundary: "10 个 opened 来源与离线 0→1→0 支持发布门禁形状；真实流量、用户、伦理、统计功效、人工标签和生产发布 NOT_RUN。",
  },
];

export const advancedQualityGapPageIds = specs.map((spec) => spec.id);
export const advancedQualityGapPages: TutorialPage[] = specs.map(makePage);
