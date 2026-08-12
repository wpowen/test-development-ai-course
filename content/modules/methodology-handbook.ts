import type { TutorialBlock, TutorialPage } from "../course.ts";

/**
 * 方法论手册接入层。
 *
 * 手册正文位于仓库 `methodology/`（14 篇），可直接使用的模板、检查单、Schema、
 * 贯穿案例与自检器位于 `courses/td-ai-methodology-handbook/learner-materials/`，
 * 并投影为 `materials/methodology-handbook/`。
 *
 * 这里只做两件事：
 * 1. 给生命周期页面补一个「阶段契约与判断表」教学块，把单页动作放回完整流程；
 * 2. 把手册工件挂成页面材料，让读者拿到页面就能拿到可填写的模板。
 *
 * 每页的表格、准出条件与判断依据都逐页不同，不使用共享模板句。
 */

type StageContract = {
  stage: string;
  chapter: string;
  blockTitle: string;
  intro: string;
  handoff: string;
  contract: { input: string; activity: string; output: string; owner: string };
  decision: { headers: string[]; rows: string[][]; caption: string };
  exitChecks: [string, string, string, ...string[]];
  /** 反例：看起来对但不成立的做法 */
  counter: { title: string; rows: [string, string, string][] };
  /** 诊断树：症状 → 先怀疑本阶段什么 → 下一步 */
  diagnosis: { title: string; rows: [string, string, string][] };
  template: { title: string; description: string; href: string };
  checklist: { title: string; description: string; href: string };
};

const stageContracts: Record<string, StageContract> = {
  "TD-P01": {
    stage: "S1 测试依据冻结",
    chapter: "methodology/04-阶段方法-依据到策略.md",
    blockTitle: "阶段契约：S1 在完整流程中承担什么，交出什么",
    intro:
      "这一页的动作在方法论中对应 S1。S1 存在的唯一理由是：让「对不对」这个问题有一个唯一、可复现、可引用的答案来源。没有 S1，后面每一份工件都建在流沙上——用例写得越完整，返工代价越大。",
    handoff:
      "S1 的产物是 S2 的准入条件。冻结失败时不要往下走：此时继续做需求契约，只会把一份不确定的输入变成一份看起来很确定的 JSON。",
    contract: {
      input: "PRD、技术方案、接口契约、状态机、术语表、变更范围、历史缺陷，以及模型/Prompt/知识库/工具四类 AI 侧依据",
      activity: "登记版本、owner、内容 hash、敏感级；切分并分配不可变 source_ref；识别跨来源冲突与未定义项",
      output: "Test Basis Pack 与 source-manifest.json",
      owner: "测试开发（A/R）；业务规则冲突由产品 owner 裁决（A）",
    },
    decision: {
      headers: ["遇到的情况", "正确处置", "错误处置", "状态"],
      rows: [
        ["两份有效来源互相矛盾", "登记 conflicts 并指名升级责任人", "让模型选一个更合理的说法", "BLOCKED"],
        ["文档没有写某条规则", "登记 unknowns 并指定谁确认", "由模型按常识补写", "UNKNOWN"],
        ["网页来源没有版本号", "记录访问日期或提交版本", "只保存当前地址", "可继续"],
        ["同一文档有两个在用版本", "确认哪一版已批准，另一版标记过期", "两版都喂给模型", "BLOCKED"],
        ["来源含未脱敏个人信息", "脱敏或降级访问后再进入流程", "先跑起来再说", "BLOCKED"],
      ],
      caption: "S1 的判断依据是「这条信息能不能被稳定引用」，不是「这条信息看起来对不对」。",
    },
    exitChecks: [
      "所有文件可访问且版本唯一，source_ref 不随文档重排变化",
      "来源优先级规则由产品与技术 owner 书面确认，不是口头默契",
      "已识别冲突进入 conflicts 且 status=BLOCKED，并指定升级责任人",
      "unknowns 非空——真实需求不可能全部明确，为空说明该找的没找",
    ],
    counter: { title: "两种看起来在冻结依据、实际没冻住的做法", rows: [
      ["把所有文档打包发给模型，附一句「以最新版本为准」", "省时间，覆盖也全，模型确实能读懂多份文档", "模型无法判断哪份最新。「最新」是组织事实不是文本事实，必须由人写明版本与优先级"],
      ["用文档标题加页码作为引用坐标", "定位精确，人也能对得上", "文档一改版页码就全变。坐标必须不随重排变化，用段落 ID 或提交版本"],
    ] },
    diagnosis: { title: "下游总在返工时按什么顺序查", rows: [
      ["用例写完才发现规则变了", "来源版本未冻结", "检查 manifest 里是否记录了版本与 hash"],
      ["同一规则两个人理解不同", "优先级规则未书面化", "补来源优先级并由产品与技术 owner 确认"],
      ["模型输出的事实找不到出处", "source_ref 粒度太粗", "把坐标细到段落级并校验存在性"],
      ["冲突被写进了用例", "冲突未 BLOCKED", "检查 conflicts 是否指定了升级责任人"],
    ] },
    template: {
      title: "S1 测试依据清单模板",
      description: "登记来源版本、owner、hash、敏感级与 AI 侧依据；含冲突与未知两张登记表和准出检查。",
      href: "materials/methodology-handbook/templates/03-test-basis-pack.md",
    },
    checklist: {
      title: "需求评审检查单（S1–S2）",
      description: "评审会上逐条打勾：依据完整性、规则可测性、未知与冲突、权限与安全、两道门禁是否分离。",
      href: "materials/methodology-handbook/checklists/01-requirements-review.md",
    },
  },
  "TD-P02": {
    stage: "S2 需求契约化",
    chapter: "methodology/04-阶段方法-依据到策略.md",
    blockTitle: "阶段契约：S2 的字段不是为了好看，是为了支撑下游能力",
    intro:
      "S2 把自然语言变成下游程序可以直接消费的结构。判断一个字段该不该存在，只有一个标准：删掉它之后，哪一项下游能力会消失。删掉 invariants，属性测试与对账就没了依据；删掉 side_effects，幂等测试就无从设计。",
    handoff:
      "S2 交给 S3 的是「业务要什么」，交给 S4 的是风险的原材料。契约里任何一条 UNKNOWN 或 BLOCKED，都会在 S4 变成一条必须处理的风险或阻断项。",
    contract: {
      input: "S1 冻结的 Test Basis Pack",
      activity: "受约束地抽取角色、前置、触发、状态转换、不变量、异常、副作用、非功能要求与未知项",
      output: "requirement-contract.json 与两份分别留痕的门禁结果",
      owner: "测试开发（A/R）；需求语义确认由产品 owner（A）",
    },
    decision: {
      headers: ["字段", "支撑的下游能力", "缺失后果", "常见填写错误"],
      rows: [
        ["actors", "权限测试、越权用例", "漏测越权路径", "只写「用户」，不区分买家/客服/管理员"],
        ["preconditions", "前置状态构造", "用例无法自动准备数据", "写成业务描述而非可判定条件"],
        ["state_transitions", "状态转换与非法转换用例", "漏测非法转换", "只列合法路径"],
        ["invariants", "属性测试、变形测试、账本对账", "无法写「永远成立」的断言", "写成「系统应稳定」这类不可判定表述"],
        ["side_effects", "幂等测试、观察点设计", "漏测重复副作用", "只写「发消息」，不写幂等身份"],
        ["unknowns", "阻断下游、生成待确认清单", "模型替你补写规则", "为空"],
      ],
      caption: "字段设计从下游倒推：先问「谁要消费这条信息」，再决定它是否进契约。",
    },
    exitChecks: [
      "结构门禁 PASS_SCHEMA 与语义门禁 PASS_SEMANTIC 分别执行并分别留痕，未被合并成一个「通过」",
      "每条关键规则有 source_ref，或被明确标记为 UNKNOWN",
      "关键金额、权限、状态由领域 owner 逐项署名确认",
      "契约中没有出现模型自行补写的业务规则",
    ],
    counter: { title: "两种看起来结构化了、实际不可消费的契约", rows: [
      ["用模型生成一段结构良好的需求摘要", "字段清晰、可读性好、评审通过快", "摘要不是契约。下游需要稳定字段名与枚举值才能自动消费，散文再工整也无法生成用例"],
      ["把不确定的地方按最合理的方式补全，标注为「推断」", "保留了推断标记，比直接编造诚实", "标注为推断的规则仍然会进入下游生成。正确做法是 UNKNOWN 并阻断，由具名的人来确认"],
    ] },
    diagnosis: { title: "契约通过校验但用例仍然不对时查什么", rows: [
      ["结构全对但业务错", "只跑了 PASS_SCHEMA", "补语义门禁并要求领域 owner 署名"],
      ["漏测越权路径", "actors 只写了「用户」", "按角色拆开：买家、客服、管理员"],
      ["漏测非法状态转换", "只列了合法路径", "补 exceptions 与非法转换清单"],
      ["unknowns 为空", "被模型补写了", "逐条核对是否有来源支持"],
    ] },
    template: {
      title: "S2 需求契约填写指南与 Schema",
      description: "逐字段说明「删掉它会失去什么」，附提取 Prompt 的权限声明与五类常见填写错误。",
      href: "materials/methodology-handbook/templates/04-requirement-contract-guide.md",
    },
    checklist: {
      title: "需求评审检查单（S1–S2）",
      description: "重点看「两道门禁是否分离」与「unknowns 是否为空」两项。",
      href: "materials/methodology-handbook/checklists/01-requirements-review.md",
    },
  },
  "TD-P03": {
    stage: "S3 技术契约化",
    chapter: "methodology/04-阶段方法-依据到策略.md",
    blockTitle: "阶段契约：S3 回答「结果如何发生、在哪里观察」",
    intro:
      "需求说明业务结果，技术文档说明结果如何发生以及在哪里能被观察到。只读 PRD 会漏掉重试、幂等、并发、异步、回滚和可观测性；只读设计又容易把实现选择误当成业务规则。S3 的任务是把两者对齐，并把差集变成有 owner 的问题。",
    handoff:
      "S3 输出的需求—技术矩阵是 S4 风险识别的第二个来源。矩阵里的每一个 gap、每一个不可观察点，都会在 S4 直接变成一条候选风险。",
    contract: {
      input: "已批准的 requirement-contract.json 与技术方案、OpenAPI、事件 Schema、状态与数据设计",
      activity: "抽取六类可测试对象；对每个异步边界成组追问失败与恢复；建立双向一致性矩阵",
      output: "technical-contract.json 与 requirement-design-matrix.json",
      owner: "研发 owner 对实现方案负责（A）；可测试性与可观测性缺口由测试开发提出（A/R）",
    },
    decision: {
      headers: ["矩阵里出现什么", "含义", "下一步动作", "谁负责关闭"],
      rows: [
        ["需求有、组件无", "实现缺口", "形成带 close_with 的问题", "研发 owner"],
        ["设计有、需求无", "越界实现", "回到产品确认是否授权", "产品 owner"],
        ["有状态、无观察点", "不可观察即不可测", "补 Trace/事件/审计字段", "研发 owner"],
        ["有重试、无幂等身份", "重复副作用风险", "补幂等键与 safe terminal", "研发 owner"],
        ["有异步、无 safe terminal", "耗尽后状态未定义", "标记 BLOCKED 并升级", "研发 owner"],
      ],
      caption: "缺少映射不能写成「研发自行处理」——那句话既不是问题也不是决定，它只是把不确定推给了未来。",
    },
    exitChecks: [
      "需求与组件、接口、状态、观察点之间双向可追踪",
      "每个异步边界的幂等语义与 safe terminal 有具名 owner",
      "关键状态或副作用不可观察时状态为 BLOCKED，并阻断风险与用例生成",
      "技术缺口以带 owner 和 close_with 的问题形式存在，不是会议纪要里的一句话",
    ],
    counter: { title: "两种看起来读懂了技术方案、实际漏掉失败面的做法", rows: [
      ["把架构图翻译成文字描述，逐个组件说明职责", "覆盖了全部组件，描述也准确", "组件职责不等于可测试对象。重试、幂等、并发、死信这些只出现在失败路径上，架构图上通常没有"],
      ["技术方案里没写的部分，按常见实现补充说明", "补充让文档更完整，也符合工程惯例", "补充的实现会被当成需求写进用例。没写就是 UNKNOWN，要向研发 owner 要答案而不是自己补"],
    ] },
    diagnosis: { title: "上线后出现设计没覆盖的问题时查什么", rows: [
      ["异步任务耗尽后状态不明", "safe terminal 未定义", "把它标为 BLOCKED 并指定 owner"],
      ["重复消息造成重复副作用", "幂等身份缺失", "检查矩阵中是否有「有重试无幂等」行"],
      ["出事后查不到发生了什么", "关键状态不可观察", "补 Trace、事件或审计字段"],
      ["实现做了需求没授权的事", "越界实现未被发现", "反向检查设计有、需求无的行"],
    ] },
    template: {
      title: "生命周期阶段契约表",
      description: "九阶段的输入、活动、输出、准入、准出与负责人；S3 行可直接抄进你的测试策略。",
      href: "materials/methodology-handbook/templates/11-entry-exit-criteria.md",
    },
    checklist: {
      title: "风险与策略检查单（S4）",
      description: "S3 的 gap 会直接进入 S4 风险识别，先看这份检查单的「风险识别」一节。",
      href: "materials/methodology-handbook/checklists/02-risk-and-strategy.md",
    },
  },
  "TD-P04": {
    stage: "S4 风险分析与测试策略",
    chapter: "methodology/04-阶段方法-依据到策略.md",
    blockTitle: "阶段契约：S4 是测试开发唯一独占的裁决权",
    intro:
      "决定测什么、在哪一层测、测到多深，是测试开发这份工作里唯一由自己裁决的部分。它也最常被两样东西顶替：用例数量和工具清单。风险打分不是为了得到一个分数，是为了让「这条不测」变成一个有人签字的决定。",
    handoff:
      "S4 交给 S5 的是「哪些条件必须有独立 Oracle」，交给 S6 的是「哪些切片是 blocker」。没有 S4，S5 会退化成给所有条件写同样深度的检查。",
    contract: {
      input: "requirement-contract.json 与 requirement-design-matrix.json",
      activity: "从四个来源识别风险、按 I×L×D 打分、分配主责层级、按输入形态与 Oracle 可得性选方法",
      output: "风险登记册、测试策略、方法选择记录、残余风险清单",
      owner: "测试开发（A/R）；风险容忍度由发布 owner 与产品 owner 共同确认（C）",
    },
    decision: {
      headers: ["如果……", "首选方法", "Oracle 来源", "为什么不是别的"],
      rows: [
        ["存在状态与非法转换", "状态转换测试", "状态机文档", "等价类无法表达转换顺序"],
        ["三条以上规则互相影响", "决策表", "PRD 规则", "逐条用例会漏掉组合"],
        ["有明确不变量但无唯一答案", "属性测试", "不变量本身", "精确匹配会把合法变体判错"],
        ["完全没有标准答案（AI 生成内容）", "变形测试", "输入变换与输出变换的关系", "没有参考答案就无法做精确比较"],
        ["需要证明用例真的能发现问题", "变异测试", "杀死率", "覆盖率只说明执行过"],
        ["依赖不可控外部系统", "契约测试加录制回放", "契约", "直连真实系统不可复现"],
      ],
      caption: "选择依据是「输入形态 × 风险类型 × Oracle 可得性」三者交叉，不是团队习惯或工具能力。",
    },
    exitChecks: [
      "每条高风险有指定层级、方法与 Oracle 来源，且理由不是工具名",
      "每条降档有理由、具名接受人与复评日期",
      "不可行组合已显式记录，而不是悄悄不做",
      "策略中没有把用例数量当作质量判据",
    ],
    counter: { title: "两种看起来在做风险驱动、实际按习惯行事的策略", rows: [
      ["按历史缺陷分布决定测试重点，数据驱动", "历史数据客观，也确实反映过去的薄弱环节", "历史只覆盖已经被发现过的失败。新引入的 AI 非确定性、漂移与注入三类风险在历史里完全没有样本"],
      ["把所有高风险都放到端到端层覆盖，一次跑全", "端到端最接近用户，覆盖也最完整", "E2E 定位成本最高、稳定性最差。层级选择依据是「缺陷在哪一层最早最便宜最稳定地暴露」，不是最接近用户"],
    ] },
    diagnosis: { title: "测了很多但仍然漏时按什么顺序查", rows: [
      ["漏的都是新类型问题", "风险源只有三个", "补 AI 特有的非确定性、漂移、注入三类"],
      ["用例很多但杀死率低", "方法选择按习惯", "对照输入形态×Oracle 可得性重选"],
      ["某类风险从来没测过", "被静默跳过", "查不可行组合是否被显式记录"],
      ["降档后出了事", "降档无人签字", "补理由、接受人与复评日期"],
    ] },
    template: {
      title: "S4 风险登记册与方法选择矩阵",
      description: "含 I/L/D 打分口径、RPN 分档、层级分配、变形关系候选表与不可行组合登记。",
      href: "materials/methodology-handbook/templates/06-technique-selection-matrix.md",
    },
    checklist: {
      title: "风险与策略检查单（S4）",
      description: "识别、打分分档、层级方法、不可行与残余、阈值五组共 20 条。",
      href: "materials/methodology-handbook/checklists/02-risk-and-strategy.md",
    },
  },
  "TD-P05": {
    stage: "S5 Oracle 设计",
    chapter: "methodology/05-阶段方法-设计到执行.md",
    blockTitle: "阶段契约：六层 Oracle 与两条不可越过的红线",
    intro:
      "先写用例、再想「期望结果是什么」，几乎必然写出自洽但无效的测试——期望值要么来自被测实现本身，要么来自这一次的模型输出。这类测试永远绿，也永远不发现问题。所以 S5 必须先于 S6。",
    handoff:
      "S5 交给 S6 的是每个测试条件的判据来源。任何找不到独立 Oracle 的条件都必须停在这里，用「人工目测一下」代替是把问题推给了未来的自己。",
    contract: {
      input: "S4 的风险登记册与测试条件清单",
      activity: "为每个条件选定六层 Oracle 中的组合，标注独立来源与明确排除的层",
      output: "Oracle 设计记录，含无 Oracle 项的 BLOCKED 清单",
      owner: "测试开发（A/R）；关键金额、权限、状态由领域 owner 确认（C）",
    },
    decision: {
      headers: ["层", "判断什么", "独立性", "能否单独放行 blocker"],
      rows: [
        ["L1 传输", "响应、状态码、超时", "高", "否"],
        ["L2 结构", "字段、类型、枚举、必填", "高", "否"],
        ["L3 来源", "引用是否真实存在且相关", "高", "否"],
        ["L4 规则", "业务规则与不变量", "高", "是"],
        ["L5 语义", "内容是否正确、忠实", "低", "否（硬性）"],
        ["L6 人机", "高风险决定是否可接受", "最高", "是"],
      ],
      caption: "两条红线：语义层不得单独放行任何 blocker；被测者不得出现在自己的 Oracle 里。",
    },
    exitChecks: [
      "每个关键条件的 Oracle 独立于被测实现，也独立于本次模型输出",
      "涉及金额、权限、状态、合规的条件由 L4 规则或 L6 人工判定",
      "使用语义层判分前，已先测人人一致性再测模型与人的一致性",
      "找不到独立 Oracle 的条件已显式 BLOCKED，并写明需要什么才能解锁",
    ],
    counter: { title: "两种看起来有 Oracle、实际是自证的做法", rows: [
      ["先跑一遍实现，把输出保存下来作为期望值", "这是回归基线的标准做法，效率也高", "期望值来自被测实现本身。实现一开始就是错的时候，这条测试会永远绿并且永远不发现问题"],
      ["用同一个模型生成参考答案，再用它来评分", "参考答案和评分标准一致，评分很稳定", "考生自己批卷。生成与评判共享同一套偏差，错误会被系统性地一致放过"],
    ] },
    diagnosis: { title: "测试全绿但线上出问题时查什么", rows: [
      ["测试从未失败过", "Oracle 来自实现", "检查 expected 的来源是不是被测系统"],
      ["语义问题全部漏掉", "只有 L1/L2 层", "补 L4 规则层或 L6 人工"],
      ["金额或权限出错", "L5 单独放行了 blocker", "把这类判定移到规则层"],
      ["某条件根本没测", "无独立 Oracle 未 BLOCKED", "显式标记并写明解锁条件"],
    ] },
    template: {
      title: "S5 Oracle 设计记录模板",
      description: "六层参考表、逐条记录、无 Oracle 项登记，以及使用语义层判分前的四项校准声明。",
      href: "materials/methodology-handbook/templates/07-oracle-design-record.md",
    },
    checklist: {
      title: "Oracle 与测试数据检查单（S5–S6）",
      description: "Oracle 独立性九条、用例四条、数据八条，逐条打勾。",
      href: "materials/methodology-handbook/checklists/03-oracle-and-data.md",
    },
  },
  "TD-P06": {
    stage: "S6–S7 用例、数据与自动化",
    chapter: "methodology/05-阶段方法-设计到执行.md",
    blockTitle: "阶段契约：一个自动化用例凭什么被允许合并",
    intro:
      "自动化的价值不在于跑得快，而在于它能在正确的时刻变红。一个从未在任何缺陷上红过的用例，不管它跑得多稳定、覆盖率报表多好看，都不构成质量证据。合并门槛因此必须写成可检查的条件，而不是评审时的印象。",
    handoff:
      "S7 交给 S8 的是一套能产生可归因结果的执行装置。若失败信息不足以定位到层，S8 的归因就只能靠猜，AI 会很乐意帮你猜一个听起来合理的根因。",
    contract: {
      input: "S5 的 Oracle 设计记录、S6 的用例与数据集",
      activity: "分层实现自动化、登记环境、确定外部依赖策略、验证每个用例的红绿稳定性",
      output: "自动化代码、流水线配置、环境登记册",
      owner: "测试开发（A/R）；生产写权限授予由安全 owner 裁决（A）",
    },
    decision: {
      headers: ["合并门槛", "怎么验证", "不满足时的典型伪装"],
      rows: [
        ["在预埋缺陷上稳定变红", "连续三次注入同一缺陷", "只在本次演示中红过一次"],
        ["在干净基线上稳定变绿", "连续三次跑基线", "靠 retry 掩盖偶发失败"],
        ["失败信息足以定位到层", "人为制造五层各一个故障", "只输出「断言失败」"],
        ["运行时间在层级预算内", "统计分位耗时", "把慢用例塞进每次提交层"],
        ["不依赖顺序与残留状态", "打乱顺序单独跑", "依赖上一个用例创建的数据"],
      ],
      caption: "五条全部满足才允许合并。任何一条靠「这次先合了，后面补」通过的用例，都会在半年后变成没人敢删的 Flaky。",
    },
    exitChecks: [
      "每个自动化用例满足五条合并门槛，并有对应的红绿记录",
      "外部依赖按策略处理，模型调用默认走录制回放而非直连真实 API",
      "Flaky 用例进入 QUARANTINE 并保留统计，未被删除或用 retry 掩盖",
      "环境可重建、可回收、有 owner 与成本归属",
    ],
    counter: { title: "两种看起来自动化很成熟、实际检测力很低的做法", rows: [
      ["用例数量三个月翻倍，回归覆盖大幅提升", "数量增长可量化，覆盖报表也确实变好", "没有变异验证的用例可能全都杀不死缺陷。AI 生成用例的典型形态就是覆盖率高、杀死率极低"],
      ["给不稳定的用例加上重试，流水线绿了", "重试是处理网络抖动的常规手段，成本也低", "重试会把真实的非确定性缺陷一起掩盖掉。正确做法是标记 QUARANTINE，保留运行与统计"],
    ] },
    diagnosis: { title: "流水线常绿但缺陷仍然逃逸时查什么", rows: [
      ["用例从未在缺陷上红过", "缺红绿验证", "在预埋缺陷上连续跑三次"],
      ["失败信息只有「断言失败」", "定位能力不足", "人为制造五层故障各一个，检查可定位性"],
      ["单跑通、批量跑挂", "依赖顺序或残留状态", "打乱顺序单独跑验证"],
      ["Flaky 越来越多", "用 retry 掩盖", "改为 QUARANTINE 并统计"],
    ] },
    template: {
      title: "S7 测试环境登记册与依赖策略",
      description: "五级环境表、外部依赖策略表（含大模型 API 默认录制回放）与四条硬规则自查。",
      href: "materials/methodology-handbook/templates/09-environment-register.md",
    },
    checklist: {
      title: "自动化合并检查单（S7）",
      description: "五条门槛加六条附加检查，以及 Flaky 的 QUARANTINE 处理规则。",
      href: "materials/methodology-handbook/checklists/04-automation-merge.md",
    },
  },
  "TD-P07": {
    stage: "S8 执行、证据与归因",
    chapter: "methodology/05-阶段方法-设计到执行.md",
    blockTitle: "阶段契约：五层归因，以及承认不知道的纪律",
    intro:
      "任何一句「我验证过了」都必须能拆成三段：干净基线全绿、注入已知缺陷变红、修复后恢复绿。只有第一段的绿色不证明任何事，它可能只是因为检查根本没做。三段齐备之后，失败才谈得上归因。",
    handoff:
      "S8 交给 S9 的是 Run Receipt 与剩余风险。缺少模型、数据集版本、Prompt 版本三者任一的收据，不能作为发布证据——因为它无法回答「这个结论对应哪个版本」。",
    contract: {
      input: "S7 的执行装置与 S6 的数据集",
      activity: "基线执行、故障注入、重复运行、失败归因、缺陷分级与提交",
      output: "Run Receipt、缺陷记录、归因报告",
      owner: "测试开发（A/R）；缺陷优先级由产品 owner 裁决（A）",
    },
    decision: {
      headers: ["层", "先问什么", "一次只改的变量", "查不出来时"],
      rows: [
        ["L1 输入与数据", "输入变了吗？数据集版本变了吗？", "数据集版本", "对比 baseline 的输入 hash"],
        ["L2 模型与 Prompt", "模型别名漂移？Prompt 版本？参数？", "模型或 Prompt 之一", "对比 manifest diff"],
        ["L3 检索与工具", "索引重建？分块变了？权限变了？", "索引或工具之一", "对比工具版本表"],
        ["L4 执行环境", "环境差异？并发？超时？", "环境", "在干净临时环境复跑"],
        ["L5 Scorer 与阈值", "Judge 版本？阈值？聚合口径？", "Scorer 版本", "用旧 Scorer 重算历史结果"],
      ],
      caption: "五层都无法区分时，正确输出是 UNKNOWN 并升级人工，而不是让模型补一个听起来合理的根因。",
    },
    exitChecks: [
      "0/1/0 三段结果齐备，且 fault 段指名了 failed_oracle_ids",
      "每次结论有完整 lineage：数据、Prompt、模型、工具、Scorer 五要素",
      "Severity 与 Priority 分别填写，未合并成一个字段",
      "非确定性缺陷写明 N 次中复现 M 次，未写成「偶现」；UNKNOWN 桶未被清空",
    ],
    counter: { title: "两种看起来在归因、实际在编故事的做法", rows: [
      ["让模型读日志并给出根因分析，节省排查时间", "模型确实能快速读完海量日志并给出条理清晰的解释", "模型会为任何数据生成一个合理解释。五层无法区分时正确输出是 UNKNOWN，而不是一个听起来对的根因"],
      ["把相似失败聚成一类，按类修复，效率更高", "聚类减少了重复工作，也让报告更清晰", "聚类必须保留每条原始证据并抽检三条同因。只留摘要时，混进去的异类会被一起「修好」"],
    ] },
    diagnosis: { title: "同一问题反复出现时查什么", rows: [
      ["每次结论都不一样", "lineage 不完整", "检查数据/Prompt/模型/工具/Scorer 五要素"],
      ["无法复现", "缺可重放要素", "补种子、完整 prompt、工具快照与时间戳"],
      ["写着「偶现」", "复现率未统计", "改成 N 次中复现 M 次"],
      ["UNKNOWN 桶一直是空的", "被强行归因", "检查是否有失败被塞进了最近的一类"],
    ] },
    template: {
      title: "S8 缺陷分级、分类与 Run Receipt Schema",
      description: "Severity/Priority 分离规则、十类 AI 特有缺陷分类、缺陷记录必填字段与逃逸台账。",
      href: "materials/methodology-handbook/templates/10-defect-severity-taxonomy.md",
    },
    checklist: {
      title: "生产事件回灌检查单",
      description: "捕获、复现、归因、回归、反查、台账六段，以及三条禁止做法。",
      href: "materials/methodology-handbook/checklists/08-incident-regression-feedback.md",
    },
  },
  "TD-P08": {
    stage: "S9 发布判断与生产闭环",
    chapter: "methodology/06-阶段方法-发布到生产.md",
    blockTitle: "阶段契约：发布是一份署名决定，不是流水线的绿灯",
    intro:
      "准出不是「用例都跑完了」，而是「约定深度的风险已被覆盖，剩余风险已被具名接受」。这句话的重点在后半句：一份没有剩余风险清单的发布报告，不是风险为零，而是没人去数。",
    handoff:
      "S9 交回 S1 的是逃逸缺陷。每一个都必须在约定时限内走完 Trace-to-Regression：复现、归因、补一条能稳定变红的回归用例、用变异验证它确实有检测力、再反查同类风险。",
    contract: {
      input: "S8 的 Run Receipt、缺陷记录与剩余风险清单",
      activity: "按档位判定准出、处理 Waiver、作出发布决定、配置生产观察、回灌逃逸缺陷",
      output: "发布决定书、Waiver 台账、持续评估配置、回归资产",
      owner: "发布 owner 作发布与 Waiver 决定（A）；回滚由 SRE 决定与执行（A/R）",
    },
    decision: {
      headers: ["Waiver 的四条禁令", "为什么", "正确做法"],
      rows: [
        ["没有过期时间的 Waiver 无效", "长期豁免等于永久取消门禁", "写明日期，最长两个迭代"],
        ["没有补偿控制的 Waiver 无效", "否则风险只是被记录，没有被降低", "关闭入口、收紧告警或加人工抽检"],
        ["不能由测试开发单方签", "接受风险是发布 owner 的职权", "由发布 owner 署名"],
        ["同一门禁连续三次被豁免", "要么阈值不合理，要么工程债需立项", "门禁本身重新评审"],
      ],
      caption: "Waiver 是合法的工程手段，前提是它必须过期。超期未处理的 Waiver 直接阻断下一次发布。",
    },
    exitChecks: [
      "发布前七个问题全部答得上来，尤其是「已知坏版本能否被当前门禁稳定拦下」",
      "剩余风险清单非空且每条有具名接受人",
      "回滚预案已演练，且回滚对象为模型、Prompt、索引、工具、阈值五要素成组",
      "上一周期的逃逸缺陷已全部完成 Trace-to-Regression 闭环",
    ],
    counter: { title: "两种看起来在做发布治理、实际把责任藏起来的做法", rows: [
      ["用一个综合质量分作为发布判据，超过阈值即放行", "单一判据决策快，也便于跨版本比较", "加权综合分会把 blocker 平均掉。一次权限泄露可能只让总分掉两分，仍然达标"],
      ["剩余风险写「无重大风险」，评审通过", "表述谨慎，也没有夸大", "没有清单不代表没有风险，通常代表没人去数。剩余风险必须逐条列出并具名接受"],
    ] },
    diagnosis: { title: "发布后出事复盘时查什么", rows: [
      ["门禁全绿仍然出事", "门禁未在坏版本上验证", "注入已知坏版本，看能否拦下"],
      ["同一门禁反复被豁免", "阈值不合理或有工程债", "连续三次即重新评审门禁"],
      ["回滚后行为仍异常", "只回滚了一维", "按四要素成组回滚"],
      ["同类问题再次发生", "逃逸未回灌", "走完 Trace-to-Regression 并做同类反查"],
    ] },
    template: {
      title: "S9 发布决定书与准入准出准则",
      description: "按风险档位的准出矩阵、发布前七问、Waiver 四条禁令、渐进发布与回滚成组规则。",
      href: "materials/methodology-handbook/templates/14-release-decision-record.md",
    },
    checklist: {
      title: "发布前检查单（S9）",
      description: "证据、风险与豁免、七个问题、回滚、生产准备、署名六组共 25 条。",
      href: "materials/methodology-handbook/checklists/06-pre-release.md",
    },
  },
};

/** 手册总入口材料，逐页共享；页面专属模板与检查单由 handbookMaterials 追加。 */
const sharedHandbookMaterials = [
  {
    title: "方法论手册工件包总览",
    description: "19 份模板、8 份检查单、5 份 Schema、6 份贯穿案例样例与 1 个自检器的使用顺序说明。",
    href: "materials/methodology-handbook/README.md",
    kind: "guide" as const,
    validation: "static-reviewed" as const,
  },
  {
    title: "方法论手册自检器",
    description: "标准库实现，无网络无模型；all / --fault <name> / --report 三种用法，退出码 0 与 1 分别表示通过与阻断。",
    href: "materials/methodology-handbook/scripts/validate_handbook.py",
    kind: "script" as const,
    validation: "fixture-tested" as const,
  },
  {
    title: "订单取消贯穿案例：完整填写样例",
    description: "source-manifest、requirement-contract、risk-register、oracle-record、waiver 与三段 run-receipt 的可运行样例。",
    href: "materials/methodology-handbook/examples/source-manifest.json",
    kind: "fixture" as const,
    validation: "fixture-tested" as const,
  },
];

export const methodologyStageBlock = (pageId: string): TutorialBlock | null => {
  const contract = stageContracts[pageId];
  if (!contract) return null;
  return {
    title: contract.blockTitle,
    body: [
      contract.intro,
      `阶段契约——输入：${contract.contract.input}；活动：${contract.contract.activity}；输出：${contract.contract.output}；负责人：${contract.contract.owner}。`,
      contract.handoff,
    ],
    table: contract.decision,
    bullets: contract.exitChecks,
    expected: `完成本阶段后，你手上应有 ${contract.contract.output}，并能对照上表说明每一条判断的依据来自哪份文档。完整阶段方法见仓库 ${contract.chapter}。`,
    warning:
      "本阶段的准出条件不允许用「先过、后面补」跳过。跳过一次准出，等于把不确定性推给下游阶段，用返工代价偿还。",
  };
};

export const methodologyExtraBlocks = (pageId: string): TutorialBlock[] => {
  const contract = stageContracts[pageId];
  if (!contract) return [];
  return [
    {
      title: contract.counter.title,
      body: [
        "只给正例学不会判断。下面两种做法都能在评审会上说得通，也都有数据支撑——它们成立的前提不成立。",
        "遮住第三列先自己判断；判断不出来的那一条，就是这个阶段最可能被跳过的一步。",
      ],
      table: {
        headers: ["看起来合理的做法", "为什么它看起来是对的", "它实际上漏掉了什么"],
        rows: contract.counter.rows.map((row) => [...row]),
        caption: "反例的价值不在于「不要这样做」，而在于说清它为什么曾经说服过一个认真的团队。",
      },
    },
    {
      title: contract.diagnosis.title,
      body: [
        "这个阶段做得不到位时，症状通常出现在下游。下表把症状直接映射回本阶段的具体缺口。",
        "查的顺序有讲究：先确认本阶段的产物是否完整，再去怀疑下游的实现或工具。",
      ],
      table: {
        headers: ["症状", "先怀疑本阶段的什么", "下一步检查"],
        rows: contract.diagnosis.rows.map((row) => [...row]),
        caption: "四行都指向同一件事：下游的返工代价，几乎总是上游某个被跳过的准出条件。",
      },
    },
  ];
};

export const handbookMaterials = (pageId: string): NonNullable<TutorialPage["materials"]> => {
  const contract = stageContracts[pageId];
  if (!contract) return [];
  return [
    ...sharedHandbookMaterials,
    { ...contract.template, kind: "guide" as const, validation: "static-reviewed" as const },
    { ...contract.checklist, kind: "guide" as const, validation: "static-reviewed" as const },
  ];
};

export const methodologyStagePageIds = Object.keys(stageContracts);
