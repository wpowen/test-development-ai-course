import type { TutorialPage } from "../course.ts";
import { promptBody } from "../prompt-bodies.ts";
import { composeDeepPage } from "./deep-layer.ts";
import { requirementsLifecycleSupplement } from "./requirements-lifecycle-supplement.ts";

export const professionPrompt = `# TD-F01 职业现实重建 Prompt v1.0.0

你是“证据约束的测试开发职业分析员”。你可以采用资深从业者的分析视角，但不得声称真实任职经历，不得编造公司内部流程，不得替代具名发布责任人作决定。

输入是一个脱敏的职业场景，包含公开依据、内部未知、近期需求或故障样本。先重建职业责任，再分析 AI；禁止先列工具。

按以下顺序输出严格 JSON：

1. \`responsibility_statement\`：说明测试开发的责任是让质量风险可见、可验证、可决策，而不是统计用例数量。
2. \`lifecycle\`：覆盖需求、技术设计、测试分析、策略、设计、自动化/环境/数据、执行归因、发布、生产反馈；每步写 actor、input、artifact、oracle、decision、consumer。
3. \`document_reading\`：分别列出需求文档的业务规则/验收边界/权威性问题，以及技术文档的状态/接口/数据/失败恢复/可观测性问题。若两者冲突，必须输出 \`BLOCKED\` 和待裁决人。
4. \`method_and_oracle\`：风险与失败模式决定方法；Oracle 必须独立于被测实现和本次模型输出。
5. \`artifacts\`：每项写 owner、version、source、acceptance、consumer。
6. \`release_boundary\`：AI 只能生成候选与聚合证据；发布、Waiver、回滚由具名人类责任人决定。
7. \`ai_migration\`：把传统能力映射到 AI 系统质量，包括数据集、Eval、Trace、权限、成本、安全、生产漂移；写清新失败模式。
8. \`learning_route\`：根据输入自测结果给出最小下一步，并写出完成门禁。
9. \`unknowns\`：所有内部流程、权限、绩效权重、历史事故标 \`INTERNAL-UNKNOWN\`，指出要读的文档或要访谈的角色。

每个关键判断都标 \`FACT\`、\`PRACTITIONER-SIGNAL\`、\`INFERENCE\`、\`VENDOR-CLAIM\` 或 \`INTERNAL-UNKNOWN\`，并引用 \`source_id\`。缺少权威依据、Oracle 或发布责任人时，整体 \`status\` 必须是 \`BLOCKED\`。`;

const rawProfessionRealityPage: TutorialPage = {
  id: "TD-F01",
  moduleId: "TD-M00",
  order: 0,
  title: "测试开发职业责任与 AI 授权边界",
  type: "跟做",
  status: "fixture-tested",
  duration: "90 分钟",
  summary: "从职业责任与完整研发测试流程出发，学会读需求和技术文档、选择方法与独立 Oracle、交付可审计工件、守住发布责任，并完成一次可运行的入场自测。",
  why: "如果连测试开发为什么负责、在哪个环节判断、拿什么证据交付都没有还原，后面的 AI 用法只会退化成工具清单。职业地图决定课程教什么，也决定 AI 可以辅助什么、必须由谁裁决。",
  prerequisites: [],
  outcomes: [
    "用一句话解释测试开发的职业责任，而不是把它等同于点点点或写自动化",
    "重建从需求到生产反馈的研发测试全链，并说清需求文档和技术文档各自的位置",
    "区分方法、Oracle、工件与发布责任，知道哪些决定不能交给 AI",
    "把传统测试能力迁移到 LLM、RAG 与 Agent 的数据、Eval、Trace 和治理能力",
    "运行红绿修复自测，得到带门禁的证据缺口行动计划",
  ],
  artifact: "职业责任地图、研发测试生命周期图、入场自测报告、版本化职业重建 Prompt 与证据缺口行动计划",
  architecture: {
    title: "从规则到生产证据的职业责任链",
    caption: "测试开发不替产品定义规则，也不替发布 owner 接受风险；它把依据、方法、执行和剩余风险连接成可审计决定。",
    nodes: ["需求规则", "技术设计", "权威裁决", "风险与方法", "独立 Oracle", "TestPackage", "执行与归因", "发布决定", "生产反馈"],
    visual: {
      src: "materials/career-evolution/visuals/career-role-comparison.svg",
      alt: "传统软件测试、AI 测试开发和 AI 开发的职责对比图，三者共享工程底座，但业务规则和发布风险仍由具名责任人裁决。",
      kind: "career",
    },
  },
  blocks: [
    {
      title: "先建立职业责任：不是找 Bug，而是让质量风险可决定",
      body: [
        "对小白最重要的第一句话是：测试开发的责任不是保证零缺陷，也不是统计执行了多少条用例；而是尽早识别影响用户和业务的质量风险，把规则与未知转成可测试依据，把结果转成可复现证据，让具名责任人能作出发布、Waiver、回滚或继续投入的决定。O*NET 的任务清单覆盖设计评审、测试计划、缺陷、发布准备和问题诊断；英国政府能力框架把风险分析、方法选择、自动化、CI/CD、报告与技术问题解决放在同一职业面上。",
        "职责边界同样重要：产品或业务 owner 裁决业务规则；研发和架构 owner 对实现方案负责；测试开发独立检查风险与证据；发布 owner 接受剩余风险；SRE 或运行责任人掌握回滚与生产响应。一个人可以兼任多个角色，但角色对应的决定权不能消失。",
      ],
      table: {
        headers: ["你负责什么", "你不承诺什么", "必须留下什么证据"],
        rows: [
          ["识别风险、建立测试依据、选择方法", "不能替业务定义正确规则", "引用、冲突、未知与裁决记录"],
          ["设计可检出失败的测试与自动化", "不能用执行数量证明有效", "独立 Oracle、Mutation 与覆盖理由"],
          ["汇总通过项、失败项与剩余风险", "不能匿名替团队放行", "Run Manifest、Waiver 与具名决定"],
          ["让事故回流到回归资产", "不能把修复上线当问题永久消失", "根因证据、回归样例、监控与复盘项"],
        ],
      },
    },
    {
      title: "完整研发测试流程：你在每一站都要回答一个不同问题",
      body: [
        "把工作画成九站，而不是把测试压缩成开发后的一个阶段。需求阶段问“用户和业务要什么”；技术设计问“系统怎样实现和失败”；测试分析问“哪些风险值得优先控制”；策略问“在哪个层级用什么方法”；设计阶段建立独立 Oracle；准备阶段建设环境、数据和自动化；执行阶段保存版本并归因；发布阶段呈现剩余风险；生产阶段让反馈回流。",
        "Shift-left 不是更早开始写脚本，而是更早让不可测试、规则冲突、权限缺口和不可观测设计暴露。Shift-right 也不是线上随便试，而是在监控、回滚、权限和责任明确时，用生产信号验证真实风险并回灌资产。",
      ],
      table: {
        headers: ["阶段", "输入", "测试开发关键问题", "输出/消费者"],
        rows: [
          ["1 需求", "PRD、用户故事、政策", "规则、边界、例外、验收和权威人是谁", "需求依据表 / 产品与研发"],
          ["2 技术设计", "架构、接口、状态、数据", "实现约束、失败恢复、可观测性和安全边界是什么", "设计审查问题 / 架构与研发"],
          ["3 测试分析", "变更、依赖、历史事故", "损失、概率、可探测性与未知是什么", "风险地图 / 项目团队"],
          ["4 策略", "风险、时间、资源", "单元、契约、集成、UI、性能或探索如何组合", "测试策略 / 团队与发布方"],
          ["5 测试设计", "规则、风险、技术约束", "Oracle 是否独立，边界与组合是否有检测力", "TestPackage / 自动化与评审"],
          ["6 准备", "环境、权限、数据、构建", "数据可复位吗，依赖可控吗，版本可追吗", "Fixture 与脚本 / CI"],
          ["7 执行归因", "Manifest、构建、测试包", "失败来自产品、测试、环境、数据还是模型波动", "结果、Trace、缺陷 / 研发与 SRE"],
          ["8 发布", "通过证据、Blocker、遗留风险", "是否达到已批准门禁，谁接受剩余风险", "建议、Waiver、回滚条件 / 发布 owner"],
          ["9 生产反馈", "监控、事故、用户反馈", "假设哪里失效，怎样形成新样例和预防控制", "回归/Eval/监控资产 / 全团队"],
        ],
        caption: "每一站的工件必须服务下一项真实决定。",
      },
      technical: {
        kind: "diagram",
        content: "需求 → 技术设计 → 权威裁决 → 风险分析 → 方法与独立 Oracle → 环境/数据/自动化 → 执行与归因 → 发布/Waiver/回滚 → 生产反馈回流",
        verification: "用 examples/career-responsibility-map.json 核对九个节点，并运行 cycle 证明错误责任边界会触发失败。",
      },
    },
    {
      title: "需求文档与技术文档不互相替代：先分清它们回答什么",
      body: [
        "需求文档是业务意图与验收边界的入口：读参与者、触发、前置条件、主流程、例外、状态变化、数量/时间/权限限制、非功能目标、明确不做什么，以及谁有权裁决。不要从一句“支持取消订单”直接写用例；先问已支付、已发货、部分退款、并发请求、超时和重复操作分别是什么规则。",
        "技术文档是实现表面的入口：读组件边界、接口请求/响应、状态机、数据模型、一致性、幂等、缓存、重试、降级、权限、日志、Trace、监控与部署。OpenAPI 能描述 HTTP 表面，但不能自动证明业务语义；技术设计说明“怎样实现”，不能静默改写 PRD 的有效规则。",
        "两类文档冲突时，测试开发不猜也不让模型投票。记录两个精确 locator、影响与候选验证，状态设为 BLOCKED，交给权威 owner 裁决。裁决结果写回版本化依据，然后才进入测试设计。",
      ],
      table: {
        headers: ["阅读面", "需求文档要找", "技术文档要找", "转成测试什么"],
        rows: [
          ["行为", "Actor、目标、业务规则、验收", "接口、状态转换、组件调用", "场景、状态模型、契约"],
          ["边界", "金额、时间、权限、例外、不做", "字段、类型、超时、容量、资源限制", "边界值、等价类、负向与性能"],
          ["失败", "用户可接受结果、补偿政策", "错误码、重试、回滚、幂等、降级", "故障注入、恢复与一致性"],
          ["证据", "权威 owner、版本、引用", "日志、Trace、指标、构建版本", "Oracle、可观测性与归因"],
        ],
      },
      warning: "技术设计与当前实现都不是天然 Oracle；需求依据也可能过期。先验证权威性和版本，再写预期结果。",
    },
    {
      title: "方法、Oracle、工件和发布责任是四件不同的事",
      body: [
        "方法回答“怎样提高检出某类失败的概率”：状态转换适合生命周期规则，决策表适合条件组合，边界值适合阈值，契约测试适合接口兼容，属性/变形测试适合大量输入，探索测试适合未知风险，负载与故障注入适合容量和恢复。不要因为会某个工具就反推方法。",
        "Oracle 回答“凭什么判断对错”。它可以来自批准的业务规则、独立计算、参考实现、不变量、状态机、人工金标或多重证据。若预期直接复制被测实现输出，测试只会证明系统等于自己；若用同一个模型生成答案再判答案，也存在共同失败。",
        "工件回答“证据如何传给下游”：每项要有 owner、版本、来源、验收规则和消费者。发布责任回答“谁接受剩余风险”：AI 可聚合证据，测试开发可提出建议，但发布、Waiver 与回滚必须由组织批准的具名责任人决定。",
      ],
      table: {
        headers: ["对象", "核心问题", "最低合格线", "常见坏味道"],
        rows: [
          ["方法", "怎样检出这个失败模式", "与风险和机制有因果理由", "先选工具，再找场景"],
          ["Oracle", "怎样独立判断对错", "来源可追、与实现解耦", "把实现/模型输出当真值"],
          ["工件", "谁在什么决定中消费", "owner、版本、来源、验收、消费者", "文档生成后无人使用"],
          ["发布责任", "谁接受剩余风险", "具名 owner、门禁、Waiver、回滚", "AI 或匿名团队“自动放行”"],
        ],
      },
    },
    {
      title: "依赖和工件决定 AI 能不能真正落地",
      body: [
        "同样是“生成测试用例”，有人缺的是边界案例，有人缺的是已批准规则，有人根本没有稳定环境和测试数据。模型不能替你补齐权限、责任人、历史事故和业务 Oracle。先画依赖：产品和研发、代码与 CI、环境和数据、日志与 Trace、发布政策和时间窗口。",
        "再画工件链：风险地图 → 测试策略 → 需求契约 → TestPackage → 自动化与 Fixture → Run Manifest → 缺陷和发布证据 → 生产回归资产。每个工件要有 owner、版本、来源、验收规则和下游消费者。后续课程就是沿这条链展开。",
      ],
      warning: "如果 AI 产物没有进入真实工件链，也没有人用它做决定，它只是一次演示。",
    },
    {
      title: "晋升不是多写几条用例，而是扩大可负责的质量范围",
      body: [
        "英国公开能力框架把初级描述为在指导下维护测试、分析工件和记录结果；到高级则要负责一个范围的测试工程，选择技术和方法、建设可复用框架与标准、处理跨团队依赖并指导他人。GitLab 的历史 SET 框架也把策略、覆盖、流水线值班、Flaky 治理、工具、环境、OKR 和知识共享放在同一能力面上。",
        "这些资料支持一个方向：能力证据会从“我执行了多少”转向“我是否更早识别风险、让反馈更快更稳、形成复用杠杆、帮助团队作出可审计决定”。但目标公司的绩效权重、晋升委员会和职级边界不能从公开资料推断，必须读取内部规则并访谈负责人。",
        "GitLab 还在 2026 年把该 SET 页面标记为弃用，并说明角色迁移到 Backend Engineer。它不是全行业结论，却提醒我们：职位名会变化，测试开发需要保留可迁移的工程、质量、评测和可靠性能力。论坛里的年限阶梯彼此不一致，只能作为从业者信号，不能当市场统计。",
      ],
      table: {
        headers: ["能力层次", "可展示证据", "AI 时代新增要求"],
        rows: [
          ["完成任务", "可复现测试、缺陷和报告", "会审查 AI 输出，不把生成当完成"],
          ["独立负责", "风险策略、稳定自动化、清晰放行证据", "会建版本化数据、Eval 和 Trace"],
          ["形成杠杆", "平台、标准、跨团队改进和事故回流", "会治理 Agent 权限、成本、Judge 和生产质量"],
        ],
      },
    },
    {
      title: "传统能力不会消失，而会迁移成 AI 质量工程",
      body: [
        "AI 系统增加了概率输出、非确定性、数据依赖、检索链、工具副作用和模型更新，但没有取消需求、风险、Oracle、版本、执行与发布责任。NIST AI RMF 的 Govern、Map、Measure、Manage 强调全生命周期角色、上下文、测量和持续管理；GenAI Profile 进一步要求对数据与内容流、决策标准和生成式 AI 风险建立测试评估。",
        "迁移方式不是“测试工程师学会写 Prompt”这么窄：需求分析迁移为用例意图、风险切片与拒答边界；测试数据迁移为有来源、许可、标签 owner、开发集与 Holdout 的 Dataset；断言迁移为确定性 Gate、参考答案、Rubric、Judge 校准和人工升级；日志迁移为 Prompt/模型/检索/工具/状态 Trace；自动化迁移为 Eval CI、版本比较和回滚；安全测试迁移为 Prompt Injection、越权工具与过度代理权。",
      ],
      table: {
        headers: ["传统测试能力", "AI 质量迁移", "新增失败", "仍保留的人类责任"],
        rows: [
          ["需求与场景", "任务定义、风险切片、拒答/Handoff", "意图歧义、能力越界", "定义业务风险与可接受行为"],
          ["测试数据", "Dataset、标签、Holdout、时间切分", "污染、泄漏、代表性不足", "数据许可与标签裁决"],
          ["断言与 Oracle", "Schema、Rubric、Judge、人工金标", "Judge 偏差、共同失败", "校准与高风险复核"],
          ["自动化与 CI", "Eval、重复运行、版本比较", "随机波动、模型静默更新", "阈值依据与回滚决定"],
          ["日志与诊断", "Prompt/检索/工具/状态 Trace", "证据缺失、错误归因", "因果确认与处置"],
          ["安全与权限", "注入、数据泄漏、工具副作用、Agent 权限", "过度代理、跨租户访问", "最小权限和事故响应"],
        ],
      },
      expected: "你得到的是一张能力迁移地图，不是“AI 会取代/不会取代测试”的口号。",
    },
    {
      title: "把痛点分成六类，再决定 AI 的权限",
      body: ["不要问“AI 能帮测试做什么”，而要逐项问当前损失发生在哪里、有没有可验证产出、谁承担错误。"],
      table: {
        headers: ["痛点", "适合的 AI 角色", "必须保留的人类责任"],
        rows: [
          ["文档分散或冲突", "抽取、引用、冲突候选", "裁决有效业务规则"],
          ["风险和边界遗漏", "生成候选问题和测试条件", "确定优先级、Oracle 和剩余风险"],
          ["脚手架与数据准备重复", "生成代码骨架和 Fixture", "Code Review、权限和 Mutation 验证"],
          ["CI 与线上诊断慢", "聚合证据、提出可证伪根因", "确认因果和处置"],
          ["发布证据散落", "汇总状态和引用", "具名放行、Waiver 或回滚"],
          ["LLM/Agent 新风险", "被测对象、Judge 助手和评测设施", "数据、阈值、权限和生产治理"],
        ],
      },
      expected: "每个 AI 机会都应写出原流程基线、输入权限、可检查产出、人工门禁、新失败和成功指标。写不出来就先不做。",
    },
    {
      title: "职业责任反例：看起来完成了，实际上谁也不能据此放行",
      body: [
        "反例一：测试开发把执行数量、代码覆盖率和模型置信度汇总成‘质量 98 分’，看起来很量化，却没有说明业务规则、独立 Oracle 和剩余风险，发布 owner 仍无法判断能否放行。反例二：AI 读完 PRD 与技术方案后直接选择‘更合理’的一条规则，输出很完整，却抹掉了来源冲突和真正应该裁决的人。",
        "正确的职业动作是把责任拆开：业务 owner 确认规则，研发 owner 解释实现，测试开发建立可检出的证据，发布 owner 接受剩余风险，运行 owner 负责回滚和事故处置。一个人可以兼任角色，但每个决定仍要有具名 owner、版本和 close evidence。",
      ],
      table: {
        headers: ["看起来合理的做法", "为什么它看起来是对的", "实际漏掉了什么"],
        rows: [
          ["用覆盖率/用例数代表质量", "数字整齐、容易汇报", "没有证明 Oracle 独立，也没有覆盖业务高损失失败"],
          ["让 AI 自动合并 PRD 与技术方案冲突", "减少沟通、输出流畅", "静默改变业务规则，责任人和裁决证据消失"],
        ],
        caption: "两个与职业责任直接相关的反例；先问谁有权决定，再问 AI 能生成什么。",
      },
    },
    {
      title: "主题诊断树：职业链断在哪里，下一步查哪层",
      body: ["遇到返工或事故时，不要先让 AI 重写用例。沿着责任链从依据、Oracle、执行证据到发布决定逐层排查；任何一层缺证据都保持 UNKNOWN/BLOCKED，并把下一实验写给真正的 owner。"],
      table: {
        headers: ["症状/问题", "疑似层", "下一检查与修复动作"],
        rows: [
          ["需求和技术设计给出相反规则", "authority", "定位两个 source_ref，标 SOURCE_CONFLICT，升级业务 owner"],
          ["测试全绿但高损失缺陷逃逸", "oracle/method", "检查 expected 是否独立，并用 mutation 验证检测力"],
          ["失败报告无法判断产品还是环境", "execution/trace", "冻结构建、数据、依赖、Trace 和每次重试，缺失则 UNKNOWN"],
          ["发布材料没有人签字接受风险", "release governance", "补具名 owner、Waiver、回滚条件；AI 不得自动放行"],
        ],
        caption: "从职业责任而不是工具故障出发的四行诊断树。",
      },
    },
    {
      title: "版本化 Prompt：先重建职业，再给 AI 权限",
      body: [
        "这段 Prompt 不是让模型扮演一个会拍脑袋的专家。它要求模型先还原工作链、区分需求和技术依据、暴露冲突与未知，再提出有边界的 AI 机会。",
        "Prompt 只是契约的一部分：同目录还固定了输入、JSON Schema、六个评测案例和四个 Mutation。当前 provider=none、model_status=NOT_RUN；它没有经过模型或从业者评审，因此不能把“版本齐全”写成“模型表现已通过”。",
      ],
      technical: {
        kind: "prompt",
        content: promptBody("materials/profession-reality/prompts/TD-F01/prompt-v1.md"),
        version: "1.0.0",
        promptPath: "materials/profession-reality/prompts/TD-F01/prompt-v1.md",
        manifestPath: "materials/profession-reality/prompts/TD-F01/manifest.json",
        inputFixturePath: "materials/profession-reality/prompts/TD-F01/input.json",
        outputSchemaPath: "materials/profession-reality/prompts/TD-F01/schema.json",
        evaluationPath: "materials/profession-reality/prompts/TD-F01/eval.json",
      },
      expected: "若需求与技术设计冲突、Oracle 不独立或发布责任人缺失，结构化输出必须是 BLOCKED；模型效果仍为 NOT_RUN。",
    },
    {
      title: "入场自测：先证明你能守住责任边界",
      body: [
        "打开 learner-profile.json，逐项判断你能否解释责任、同时读取需求与技术设计、在冲突时阻断、建立独立 Oracle、让风险决定方法、写清工件消费者、说出发布 owner，并把生产反馈回灌资产。脚本不是能力考试，它只验证你是否填出了最低责任契约。",
        "故障夹具故意把用例数量当责任、只读技术设计、让模型裁决冲突、把实现输出当 Oracle、让 AI 决定发布。完整 cycle 必须先绿、再红、修复后再绿；若 fault 不红，说明门禁只是装饰。",
      ],
      technical: {
        kind: "command",
        content: "python3 profession_self_check.py cycle --report reports/TD-F01-cycle.json",
        manifestPath: "materials/profession-reality/manifest.json",
        stepId: "cycle",
        workingDirectory: "materials/profession-reality",
        expectedExitCode: 0,
        expectedArtifacts: ["reports/TD-F01-cycle.json", "reports/TD-F01-baseline.json", "reports/TD-F01-fault.json", "reports/TD-F01-repair.json"],
      },
      expected: "进程退出 0；cycle 报告显示 baseline=0、fault=1、repair=0，provider=none、model_status=NOT_RUN。",
    },
    {
      title: "把你自己的岗位带进来，得到带门禁的证据缺口行动计划",
      body: [
        "选最近一次真实但可脱敏的需求。记录你实际花在读文档、确认规则、设计、准备数据、执行、定位和汇报上的时间；列出最终交付哪些工件、谁做决定、哪些信息只能在公司内部获得。不要为了填满表格而猜内部权威。",
        "按缺口选路线：读不清需求和设计，先学 TD-P01～P03；方法与 Oracle 薄弱，学 TD-P04～P06；不会执行归因与回归，学 TD-P07～P08；这些稳定后再进入 LLM、RAG、Agent 的 Dataset、Eval、Trace、权限与生产治理。每一步必须以一个可审计工件和一个会变红的门禁结束。",
      ],
      technical: {
        kind: "config",
        content: `{
  "responsibility": "把质量风险变成可追溯依据、可复现证据与可问责发布输入",
  "chain": ["需求规则", "技术约束", "权威裁决", "风险与方法", "独立 Oracle", "测试包", "执行与归因", "发布决定", "生产反馈"],
  "human_only": ["业务规则裁决", "风险接受", "发布或 Waiver", "生产回滚"],
  "ai_allowed": ["抽取与引用", "冲突候选", "测试条件候选", "脚手架", "证据聚合"]
}`,
        sourcePath: "materials/profession-reality/examples/career-responsibility-map.json",
        format: "JSON",
        consumer: "职业入场自测与证据缺口行动计划",
      },
      expected: "形成一条包含当前基线、一个待补能力、一个工件、一个故障注入和一个具名消费者的学习待办。",
    },
  ],
  practice: [
    "用最近一次需求重建九阶段研发测试链，并为每阶段写 input、artifact、decision 和 consumer",
    "分别列出需求文档与技术文档各五个阅读问题，模拟一个冲突并写出 BLOCKED 升级路径",
    "为一个高风险场景选择方法并写出独立 Oracle，说明为什么不依赖被测实现或本次模型输出",
    "运行职业能力 baseline/fault/repair cycle，查看 fault 中被检出的责任边界",
    "选择传统测试到 AI 质量迁移的一项能力，写 Dataset/Eval/Trace/权限或生产反馈工件",
  ],
  completion: [
    "能用一句话说明测试开发责任，并说出业务、研发、测试、发布和运行责任边界",
    "生命周期包含需求、技术设计、权威裁决、风险、方法、Oracle、执行归因、发布和生产回流",
    "需求与技术文档的读法已经区分，冲突不会被技术实现或模型静默覆盖",
    "至少一个方法绑定风险，一个 Oracle 独立于实现，一个工件有 owner/version/source/acceptance/consumer",
    "自测 cycle 真实得到 0/1/0，报告明确 provider none、model NOT_RUN 和 fixture-only 边界",
    "证据缺口行动计划的每一步都有工件、故障注入和下游决定，不以看完页面作为完成",
  ],
  sourceIds: ["S07", "S32", "S44", "S65", "S81", "S82", "S85", "S90", "S91", "S92"],
  evidenceBoundary: "公开职业框架、标准、雇主材料与社区讨论只支持共同职业结构和可迁移能力。确定性自测已通过 fixture 红绿修复，但 Prompt 的 provider=none、model_status=NOT_RUN；目标公司职责、权限、绩效、发布规则和真实效果仍为 INTERNAL-UNKNOWN。本页不构成 practitioner、integration、live、publication 或 production 证据。",
  materials: [
    {title: "传统测试 / AI 测试 / AI 开发职责对比图", description: "来源专属 SVG；先理解职业边界，再判断 AI 可以辅助什么。", href: "materials/career-evolution/visuals/career-role-comparison.svg", kind: "guide", validation: "static-reviewed"},
    {title: "职业发展九类视觉索引", description: "含 comparison、mindmap、pie、lifecycle、ladder、radar、gantt、path、quadrant 的来源定位、alt、关系和哈希。", href: "materials/career-evolution/source-visual-manifest.json", kind: "config", validation: "static-reviewed"},
    {title: "职业入口完整材料包", description: "含脚本、输入、Prompt/Schema/Eval、示例与 fixture 报告。", href: "materials/profession-reality.zip", kind: "archive", validation: "fixture-tested"},
    {title: "职业能力自测脚本", description: "离线运行 baseline/fault/repair，验证责任与 Oracle 边界。", href: "materials/profession-reality/profession_self_check.py", kind: "script", validation: "fixture-tested"},
    {title: "精确执行 manifest", description: "声明 TD-F01 独立 owner、公开工作目录、命令和预期工件。", href: "materials/profession-reality/manifest.json", kind: "config", validation: "fixture-tested"},
    {title: "版本化职业重建 Prompt", description: "绑定输入、Schema、Eval；模型状态明确为 NOT_RUN。", href: "materials/profession-reality/prompts/TD-F01/manifest.json", kind: "config", validation: "static-reviewed"},
    {title: "完整红绿修复报告", description: "确定性 fixture 结果：baseline 通过、fault 失败、repair 通过。", href: "materials/profession-reality/reports/TD-F01-cycle.json", kind: "evidence", validation: "fixture-tested"},
  ],
};

/**
 * TD-F01 此前是全站唯一一个「内容源里写了补充层、页面却没有接」的页面。
 *
 * 它的失效点、架构索引、指标卡与三段式门禁四段一直存在于
 * `_sources/requirements-lifecycle-supplement.json` 里，也一直通过 `validate-deep-sources.py`
 * 的可落地性校验——但这一页的正文由本文件手写，从未调用 `requirementsLifecycleSupplement`，
 * 于是那四段渲染在任何地方都看不到。校验器只检查内容源写没写，检查不到投影有没有被消费，
 * 因此这个缺口存在了很久且没有任何信号。现在由 `scripts/validate-reference-projection.py` 补上。
 *
 * TD-F01 是全站访问量最高的入口页，这个缺口的实际代价也最大。
 */
export const professionRealityPage: TutorialPage = {
  ...rawProfessionRealityPage,
  blocks: composeDeepPage(
    rawProfessionRealityPage.blocks,
    requirementsLifecycleSupplement(rawProfessionRealityPage.id),
  ),
};
