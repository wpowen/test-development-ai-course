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
  title: "测试开发如何与 AI 协作，以及哪些发布责任必须由人承担",
  type: "跟做",
  status: "fixture-tested",
  duration: "90 分钟",
  summary: "从真实研发流程出发，先说清测试开发负责什么，再练习阅读需求和技术文档、选择测试方法、建立独立判断依据、整理发布证据，并完成一次可运行的入场自测。",
  why: "如果没有先说清测试开发负责什么、在哪个环节作判断、要把什么证据交给谁，后面的 AI 用法就只会变成工具清单。职责和流程决定 AI 可以辅助哪些工作，也决定哪些判断必须留给人。",
  prerequisites: [],
  outcomes: [
    "用一句话解释测试开发的职业责任，而不是把它等同于点点点或写自动化",
    "重建从需求到生产反馈的研发测试全链，并说清需求文档和技术文档各自的位置",
    "区分测试方法、判断对错的依据、交付工件与发布责任，知道哪些决定不能交给 AI",
    "理解传统测试能力如何迁移到大语言模型（LLM）、检索增强生成（RAG）和智能代理（Agent）的数据、评测、运行记录与治理",
    "运行红绿修复自测，得到带门禁的证据缺口行动计划",
  ],
  artifact: "职业责任地图、研发测试生命周期图、入场自测报告、版本化职业分析提示词与证据缺口行动计划",
  architecture: {
    title: "从规则到生产证据的职业责任链",
    caption: "测试开发不替产品定义规则，也不替发布负责人接受风险；它把规则依据、测试方法、执行结果和剩余风险整理成可以复核的发布证据。",
    nodes: ["需求规则", "技术设计", "权威裁决", "风险与方法", "独立判据", "测试包", "执行与归因", "发布决定", "生产反馈"],
    visual: {
      src: "materials/career-evolution/visuals/career-role-comparison.svg",
      alt: "传统软件测试、AI 测试开发和 AI 开发的职责对比图，三者共享工程底座，但业务规则和发布风险仍由具名责任人裁决。",
      kind: "career",
    },
  },
  blocks: [
    {
      title: "先把职责说清：测试开发要帮助团队判断这个版本能不能发布",
      body: [
        "测试开发不能保证系统永远没有缺陷，也不能用执行了多少条用例证明质量。它要尽早找出会影响用户和业务的风险，把模糊规则整理成可检查的条件，把执行结果保存成别人能够复现的证据，帮助发布负责人回答三个问题：这个版本能不能发布、还剩哪些风险、出了问题怎样回滚。",
        "职责必须分开：产品或业务负责人裁决业务规则，研发和架构负责人解释实现方案，测试开发独立检查风险与证据，发布负责人决定是否接受剩余风险，站点可靠性或运行负责人（SRE）准备回滚和生产响应。一个人可以兼任多个角色，但每项决定仍要写清由谁作出。",
      ],
      table: {
        headers: ["你负责什么", "你不承诺什么", "必须留下什么证据"],
        rows: [
          ["识别风险、建立测试依据、选择方法", "不能替业务定义正确规则", "引用、冲突、未知与裁决记录"],
          ["设计能检出失败的测试与自动化", "不能用执行数量证明有效", "独立判断依据、缺陷注入结果与覆盖理由"],
          ["汇总通过项、失败项与剩余风险", "不能匿名替团队放行", "运行记录（Run Manifest）、例外放行（Waiver）与具名决定"],
          ["让事故回流到回归资产", "不能把修复上线当问题永久消失", "根因证据、回归样例、监控与复盘项"],
        ],
      },
      refs: ["R-ONET-QA", "R-UK-DDAT"],
    },
    {
      title: "外部职业资料怎么用：只做职责查漏，不替公司定规则",
      body: [
        "美国劳工部维护的职业信息数据库（O*NET）列出了软件测试岗位常见的设计评审、测试计划、缺陷跟踪、发布准备和问题诊断工作。英国政府数字和数据专业能力框架则给出了测试工程师从协助执行到负责方法、自动化、持续集成和交付（CI/CD）及跨团队改进的公开职责样例。引用它们，是为了检查课程有没有把测试工作误写成只会执行用例。",
        "这些资料描述的是公开职业共性，不是你公司的岗位说明。它们不能决定你所在公司的岗位权限、绩效标准或发布责任；这些内部规则必须以公司的流程、责任矩阵和具名负责人确认为准。",
      ],
      refs: ["R-ONET-QA", "R-UK-DDAT"],
    },
    {
      title: "完整研发测试流程：你在每一站都要回答一个不同问题",
      body: [
        "把工作画成九站，而不是把测试压缩成开发后的一个阶段。需求阶段问“用户和业务要什么”；技术设计问“系统怎样实现和失败”；测试分析问“哪些风险值得优先控制”；策略阶段选择测试层级和方法；设计阶段建立判断对错的依据（Oracle）；准备阶段建设环境、数据和自动化；执行阶段保存版本并定位失败来源；发布阶段说明剩余风险；生产阶段把线上问题转成新的回归测试。",
        "左移测试（Shift-left）不是更早开始写脚本，而是更早暴露规则冲突、不可测试设计、权限缺口和缺少监控的问题。右移测试（Shift-right）也不是在线上随便试，而是在监控、回滚、权限和责任都明确时，用生产信号验证真实风险并补充回归资产。",
      ],
      table: {
        headers: ["阶段", "输入", "测试开发关键问题", "输出/消费者"],
        rows: [
          ["1 需求", "PRD、用户故事、政策", "规则、边界、例外、验收和权威人是谁", "需求依据表 / 产品与研发"],
          ["2 技术设计", "架构、接口、状态、数据", "实现约束、失败恢复、可观测性和安全边界是什么", "设计审查问题 / 架构与研发"],
          ["3 测试分析", "变更、依赖、历史事故", "损失、概率、可探测性与未知是什么", "风险地图 / 项目团队"],
          ["4 策略", "风险、时间、资源", "单元、契约、集成、UI、性能或探索如何组合", "测试策略 / 团队与发布方"],
          ["5 测试设计", "规则、风险、技术约束", "判断依据是否独立，边界与组合是否有检测力", "测试包（TestPackage）/ 自动化与评审"],
          ["6 准备", "环境、权限、数据、构建", "数据可复位吗，依赖可控吗，版本可追吗", "可复位测试数据和环境（Fixture）与脚本 / CI"],
          ["7 执行归因", "运行记录、构建、测试包", "失败来自产品、测试、环境、数据还是模型波动", "结果、调用链记录（Trace）、缺陷 / 研发与运行负责人"],
          ["8 发布", "通过证据、阻断项、遗留风险", "是否达到已批准门禁，谁接受剩余风险", "建议、例外放行、回滚条件 / 发布负责人"],
          ["9 生产反馈", "监控、事故、用户反馈", "假设哪里失效，怎样形成新样例和预防控制", "回归、评测（Eval）和监控资产 / 全团队"],
        ],
        caption: "每一站的工件必须服务下一项真实决定。",
      },
      technical: {
        kind: "diagram",
        content: "需求 → 技术设计 → 权威裁决 → 风险分析 → 方法与独立判据 → 环境/数据/自动化 → 执行与归因 → 发布/例外放行/回滚 → 生产反馈回流",
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
      title: "测试方法、判断依据、交付工件和发布责任是四件不同的事",
      body: [
        "方法回答“怎样提高检出某类失败的概率”：状态转换适合生命周期规则，决策表适合条件组合，边界值适合阈值，契约测试适合接口兼容，属性/变形测试适合大量输入，探索测试适合未知风险，负载与故障注入适合容量和恢复。不要因为会某个工具就反推方法。",
        "判断对错的依据（Oracle）回答“凭什么说结果正确”。它可以来自批准的业务规则、独立计算、参考实现、不变量、状态机、人工标注的标准答案或多重证据。若预期结果直接复制被测实现的输出，测试只会证明系统等于自己；若用同一个模型生成答案再判断答案，也可能一起犯错。",
        "交付工件回答“证据怎样传给下一位使用者”：每项要有负责人、版本、来源、验收规则和使用者。发布责任回答“谁接受剩余风险”：AI 可以聚合证据，测试开发可以提出建议，但发布、例外放行（Waiver）与回滚必须由组织批准的具名负责人决定。",
      ],
      table: {
        headers: ["对象", "核心问题", "最低合格线", "常见坏味道"],
        rows: [
          ["方法", "怎样检出这个失败模式", "与风险和机制有因果理由", "先选工具，再找场景"],
          ["判断依据", "怎样独立判断对错", "来源可追、与实现解耦", "把实现或模型输出直接当成正确答案"],
          ["交付工件", "谁在什么决定中使用", "负责人、版本、来源、验收规则、使用者", "文档生成后无人使用"],
          ["发布责任", "谁接受剩余风险", "具名负责人、门禁、例外放行、回滚", "AI 或匿名团队自动放行"],
        ],
      },
    },
    {
      title: "依赖和工件决定 AI 能不能真正落地",
      body: [
        "同样是“生成测试用例”，有人缺的是边界案例，有人缺的是已批准规则，有人根本没有稳定环境和测试数据。模型不能替你补齐权限、责任人、历史事故和业务判断依据。先画依赖：产品和研发、代码与持续集成（CI）、环境和数据、日志与调用链记录（Trace）、发布政策和时间窗口。",
        "再画工件链：风险地图 → 测试策略 → 需求契约 → 测试包（TestPackage）→ 自动化与可复位测试数据（Fixture）→ 运行记录（Run Manifest）→ 缺陷和发布证据 → 生产回归资产。每个工件要有负责人、版本、来源、验收规则和下游使用者。后续课程就是沿这条链展开。",
      ],
      warning: "如果 AI 产物没有进入真实工件链，也没有人用它做决定，它只是一次演示。",
    },
    {
      title: "晋升不是多写几条用例，而是扩大可负责的质量范围",
      body: [
        "职业成长不应该只看写了多少用例，而要看能够独立负责多大的质量范围。公开岗位资料通常把成长过程描述为：先在指导下维护测试和记录结果，再独立选择方法、建设可复用工具、处理跨团队依赖并指导他人。GitLab 过去的软件测试工程师（SET）能力页面也采用过类似的证据维度，例如策略、流水线值班、不稳定测试治理、工具、环境、目标和知识共享。",
        "这些资料只能提供比较方向：能力证据应从“我执行了多少”转向“我是否更早识别风险、让反馈更快更稳定、形成可复用工具、帮助团队依据证据作决定”。目标公司的绩效权重、晋升评审方式和职级边界仍必须读取内部规则，并由负责人确认。",
        "GitLab 后来把该 SET 页面标记为弃用，并说明相关角色已经迁移到后端工程岗位。这不是全行业都会发生的结论，只说明职位名称和组织分工可能变化。比职位名更值得保留的，是能够迁移到其他团队的工程、质量、评测和可靠性能力。论坛里的“工作几年应该升到哪一级”彼此矛盾，只能当个人经验，不能当市场统计。",
      ],
      table: {
        headers: ["能力层次", "可展示证据", "AI 时代新增要求"],
        rows: [
          ["完成任务", "可复现测试、缺陷和报告", "会审查 AI 输出，不把生成当完成"],
          ["独立负责", "风险策略、稳定自动化、清晰放行证据", "会建版本化数据、Eval 和 Trace"],
          ["形成杠杆", "平台、标准、跨团队改进和事故回流", "会治理 Agent 权限、成本、Judge 和生产质量"],
        ],
      },
      refs: ["R-UK-DDAT", "R-ONET-QA"],
    },
    {
      title: "传统能力不会消失，而会迁移成 AI 质量工程",
      body: [
        "AI 系统增加了概率输出、结果波动、数据依赖、检索链、工具副作用和模型更新，但没有取消需求、风险、判断依据、版本、执行与发布责任。美国国家标准与技术研究院的 AI 风险管理框架（NIST AI RMF）把治理、场景分析、测量和持续管理放在同一个生命周期中；它提供的是风险管理结构，不是某个公司的自动放行规则。",
        "能力迁移也不只是“测试工程师学会写提示词（Prompt）”：需求分析要补充任务意图、风险分组和拒答边界；测试数据要记录来源、许可、标签负责人、开发集和最终保留集；断言要组合确定性规则、参考答案、评分标准、模型评分校准和人工复核；日志要覆盖提示词、模型、检索、工具和状态的调用链；自动化要支持 AI 评测（Eval）、版本比较和回滚；安全测试还要覆盖提示词注入、工具越权和权限过大。",
      ],
      table: {
        headers: ["传统测试能力", "AI 质量迁移", "新增失败", "仍保留的人类责任"],
        rows: [
          ["需求与场景", "任务定义、风险分组、拒答和人工交接", "意图歧义、能力越界", "定义业务风险与可接受行为"],
          ["测试数据", "数据集、标签、最终保留集、时间切分", "污染、泄漏、代表性不足", "数据许可与标签裁决"],
          ["断言与判断依据", "数据结构规则、评分标准、模型评分、人工标准答案", "模型评分偏差、共同失败", "校准与高风险复核"],
          ["自动化与持续集成", "AI 评测、重复运行、版本比较", "随机波动、模型静默更新", "阈值依据与回滚决定"],
          ["日志与诊断", "提示词、检索、工具和状态调用链", "证据缺失、错误归因", "因果确认与处置"],
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
          ["脚手架与数据准备重复", "生成代码骨架和可复位测试数据", "代码审查、权限和缺陷注入验证"],
          ["CI 与线上诊断慢", "聚合证据、提出可证伪根因", "确认因果和处置"],
          ["发布证据散落", "汇总状态和引用", "具名发布、例外放行或回滚"],
          ["大语言模型和智能代理的新风险", "被测对象、辅助评分模型和评测设施", "数据、阈值、权限和生产治理"],
        ],
      },
      expected: "每个 AI 机会都应写出原流程基线、输入权限、可检查产出、人工门禁、新失败和成功指标。写不出来就先不做。",
    },
    {
      title: "职业责任反例：看起来完成了，实际上谁也不能据此放行",
      body: [
        "反例一：测试开发把执行数量、代码覆盖率和模型置信度汇总成“质量 98 分”，看起来很量化，却没有说明业务规则、独立判断依据和剩余风险，发布负责人仍无法判断能否放行。反例二：AI 读完产品需求文档（PRD）与技术方案后直接选择“更合理”的一条规则，输出很完整，却抹掉了来源冲突和真正应该裁决的人。",
        "正确做法是把责任拆开：业务负责人确认规则，研发负责人解释实现，测试开发建立能够检出失败的证据，发布负责人接受剩余风险，运行负责人负责回滚和事故处置。一个人可以兼任角色，但每项决定仍要有具名负责人、版本和关闭问题所需的证据。",
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
      body: ["遇到返工或事故时，不要先让 AI 重写用例。沿着责任链从规则依据、判断对错的依据、执行证据到发布决定逐层排查；任何一层缺证据都标记为“未知”或“阻断”，并把下一项补证动作交给真正的负责人。"],
      table: {
        headers: ["症状/问题", "疑似层", "下一检查与修复动作"],
        rows: [
          ["需求和技术设计给出相反规则", "规则权威层", "记录两处原文位置和影响，标记为来源冲突，交给业务负责人裁决"],
          ["测试全绿但高损失缺陷逃逸", "判断依据或方法层", "检查预期结果是否独立，并用缺陷注入验证检测力"],
          ["失败报告无法判断产品还是环境", "执行和调用链层", "冻结构建、数据、依赖、调用链和每次重试；证据缺失时结论保持未知"],
          ["发布材料没有人签字接受风险", "发布治理层", "补具名负责人、例外放行记录和回滚条件；AI 不得自动放行"],
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
