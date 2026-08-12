import type { TechnicalBlock, TutorialBlock, TutorialPage } from "../course.ts";
import { handbookMaterials, methodologyExtraBlocks, methodologyStageBlock } from "./methodology-handbook.ts";

const commonBoundary = "本专题使用虚构的订单取消与退款资料包验证工件结构和离线流水线。它能证明流程可运行、冲突能阻断、预埋缺陷能被测试发现；不能证明模型能正确理解你公司的全部文档，也不能替代产品、研发、法务和发布责任人的确认。";

const rawRequirementsTestingLifecyclePages: TutorialPage[] = [
  {
    id: "TD-P01",
    moduleId: "TD-M00",
    order: 0,
    title: "先冻结测试依据：别让 AI 读一堆互相打架的文档",
    type: "跟做",
    status: "desk-researched",
    duration: "45 分钟",
    summary: "把 PRD、技术方案、接口契约、状态模型和术语表整理成有版本、有优先级、可引用的 Test Basis Pack。",
    why: "模型可以很快归纳多份文档，但它不知道哪份已经过期，也没有权力替团队决定冲突规则。输入版本和来源优先级不清楚，后面的测试用例越完整，返工越大。",
    prerequisites: ["TD-F01"],
    outcomes: ["建立可复现的文档输入包", "为每段内容分配稳定引用", "在冲突未解决时停止下游生成"],
    artifact: "Test Basis Pack 与 source-manifest.json",
    blocks: [
      {
        title: "先明确这次到底要测哪个版本",
        body: [
          "贯穿案例是订单取消：买家可以取消未发货订单；已支付订单取消后异步退款。这里故意放入一条冲突——PRD 禁止已发货订单取消，旧技术方案却仍写着 SHIPPED 可取消。正确结果不是让模型选一个更合理的说法，而是把该条标成 BLOCKED。",
          "最小输入包包含 PRD、技术方案、OpenAPI、状态机、业务术语表、变更范围和历史缺陷。每份文件记录版本、责任人、有效期、敏感等级和内容哈希。网页链接不能只保存当前地址，还要保存访问日期或提交版本。",
        ],
        table: {
          headers: ["输入", "必须记录", "下游用途"],
          rows: [
            ["PRD", "版本、段落 ID、产品 owner", "业务目标、范围、规则"],
            ["技术方案", "提交 SHA、接口/状态引用、技术 owner", "实现约束、依赖、副作用"],
            ["OpenAPI/事件 Schema", "规范版本、文件 hash", "请求、响应、错误和契约测试"],
            ["历史缺陷", "缺陷 ID、影响版本、复现证据", "风险权重与回归集"],
          ],
        },
      },
      {
        title: "给文档加上模型能引用的坐标",
        body: ["不要把一个 80 页 PDF 直接丢给模型。先按标题和语义段落切分，并分配不可变的 source_ref，例如 PRD-v3#R17、TECH-a13f#S04。模型输出的每条事实必须引用这些坐标。"],
        code: `{
  "baseline_id": "order-cancel-2026-08-10",
  "sources": [
    {"id":"PRD-v3","type":"prd","owner":"product-a","sha256":"…","precedence":1},
    {"id":"TECH-a13f","type":"design","owner":"tech-b","sha256":"…","precedence":2},
    {"id":"OPENAPI-v7","type":"contract","owner":"service-c","sha256":"…","precedence":3}
  ],
  "precedence_rule": "业务语义由已批准 PRD 决定；实现细节由当前技术方案和接口契约决定；任意语义冲突必须进入评审，不得自动覆盖"
}`,
        expected: "任何人拿到 manifest，都能确认模型读了哪些文件、哪个版本，以及某条结论来自哪个段落。",
      },
      {
        title: "把模型权限写进任务，不要靠一句‘请勿幻觉’",
        body: ["提取 Agent 只能做信息抽取、分类和候选冲突识别。它不能新增退款政策、性能阈值或状态转换。缺失信息输出 UNKNOWN；多源冲突输出 BLOCKED；两者都不能进入测试生成。"],
        code: `角色：需求证据提取器。你只整理已提供的资料，不决定业务规则。

输入：source-manifest、带 source_ref 的 PRD/技术方案/OpenAPI。
规则：
1. 每项事实必须给出 source_refs；没有引用则删除该事实。
2. 文档没有说明的内容写入 unknowns，不得补写。
3. 两个有效来源冲突时写入 conflicts，status=BLOCKED。
4. 只输出给定 JSON Schema；不要输出摘要、建议或测试用例。
5. 不处理任何生产密钥、真实支付账号或未脱敏个人信息。`,
        warning: "‘综合判断后采用更合理规则’会抹掉冲突，也会把模型变成没有授权的产品负责人。",
      },
      {
        title: "门禁：输入不合格时就停在这里",
        body: ["进入下一页之前，至少检查：文件可访问、版本唯一、来源坐标稳定、优先级规则已确认、敏感数据已处理。关键文件缺失或冲突责任人不明确时，状态保持 BLOCKED。"],
        code: "cd courses/td-ai-011-requirements-to-evidence/lab\npython3 pipeline.py validate-basis",
        expected: "干净夹具返回 PASS；运行 `python3 pipeline.py inject-doc-conflict` 后再次验证，返回 BLOCKED 并列出 PRD-v3#R17 与 TECH-a13f#S04。",
      },
    ],
    practice: ["把一份脱敏 PRD 和一份技术方案切成稳定 source_ref", "写出来源优先级和冲突升级责任人", "故意加入一条冲突并确认流水线停止"],
    completion: ["每份输入有版本、owner、hash 和敏感等级", "任一结论可回到具体段落", "冲突不会被模型静默合并"],
    sourceIds: ["S41", "S42", "S81", "S85"],
    evidenceBoundary: commonBoundary,
  },
  {
    id: "TD-P02",
    moduleId: "TD-M00",
    order: 0,
    title: "把自然语言变成需求契约：让下游程序能直接消费",
    type: "跟做",
    status: "fixture-tested",
    duration: "55 分钟",
    summary: "用受约束的模型输出 Requirement Contract，明确角色、状态、不变量、异常、副作用、非功能要求和未知项。",
    why: "一段‘需求摘要’不能直接生成可靠测试。下游需要稳定字段、可追溯引用和停止状态，才能判断哪些规则可测、哪些规则仍待确认。",
    prerequisites: ["TD-P01"],
    outcomes: ["定义 Requirement Contract", "区分事实、推断、未知与冲突", "校验结构正确不等于语义正确"],
    artifact: "requirement-contract.json 与校验结果",
    blocks: [
      {
        title: "先定义下游需要什么，再让模型提取",
        body: ["字段不是为了让 JSON 看起来专业，而是为了支持后续风险分析、用例生成、执行和变更回归。订单取消至少要明确参与者、前置状态、触发、状态变化、拒绝路径、退款副作用、幂等不变量、接口和待确认项。"],
        code: `{
  "requirement_id": "REQ-CANCEL-001",
  "status": "ACCEPTED|UNKNOWN|BLOCKED",
  "statement": "已支付且未发货的订单允许买家取消，并创建一次退款请求",
  "actors": ["BUYER"],
  "preconditions": ["payment_status=PAID", "shipment_status=NOT_SHIPPED"],
  "trigger": "POST /orders/{order_id}/cancel",
  "state_transitions": ["PAID->CANCEL_PENDING", "CANCEL_PENDING->CANCELLED"],
  "invariants": ["refund_count<=1", "refund_total<=captured_amount"],
  "exceptions": ["SHIPPED->409", "non-owner->403"],
  "side_effects": ["emit refund.requested"],
  "nfrs": [],
  "unknowns": ["退款完成时限未定义"],
  "source_refs": ["PRD-v3#R17", "OPENAPI-v7#/cancel"]
}`,
      },
      {
        title: "结构化输出只解决格式，不保证业务语义",
        body: ["支持 JSON Schema 的模型可以减少缺字段和类型错误；它仍可能把原文理解错。提取后要运行结构校验，再由独立评审 Agent 或人工逐项核对来源。关键金额、权限和状态 Oracle 必须由领域 owner 确认。"],
        bullets: [
          "schema 校验：字段、类型、枚举、必填项是否正确",
          "引用校验：source_refs 是否存在于当前 baseline",
          "语义校验：statement 和不变量是否得到原文支持",
          "权限校验：AI 是否越权补充了业务决定",
        ],
      },
      {
        title: "可复制的提取任务",
        body: ["System Prompt 固定权限和失败语义；Task Prompt 只传当前 baseline、输出 schema 和待处理段落。不要把生成测试用例混在同一个调用里。"],
        code: "cd .\ncat prompt-package/system-v1.md\ncat prompt-package/task-v1.md\ncat prompt-package/critic-v1.md\ncat schemas/requirement-contract.schema.json",
        expected: "看到已版本化的 system/task/critic、Schema 和失败语义；没有真实模型输出，manifest 保持 provider=none/model=offline-deterministic/status=NOT_RUN。",
      },
      {
        title: "用坏契约验证门禁有牙齿",
        body: ["教学夹具先验证已批准契约，再删除一条关键 source_ref。结构仍然是合法 JSON，但证据门禁应失败。"],
        code: "unzip requirements-to-evidence.zip\ncd requirements-to-evidence\npython3 pipeline.py reset\npython3 pipeline.py validate-package\npython3 pipeline.py validate-authority\npython3 pipeline.py validate-prompt-package\npython3 pipeline.py validate-trace\npython3 pipeline.py all --report reports/baseline.json",
        expected: "解压后固定 cwd 执行；package/authority/prompt/trace 与 baseline 均 PASS。再运行 `python3 pipeline.py inject-unsupported-rule && python3 pipeline.py validate-contract`，退出 2 并指出 REQ-CANCEL-001 的 `refund_timeout_hours` 没有来源。",
        warning: "模型能输出正确 JSON，只说明传输契约成立；不能据此宣称需求已经正确。",
      },
    ],
    practice: ["为自己的业务补一条状态转换和一条不变量", "加入一个文档未定义的字段并确认校验失败", "让产品 owner 只评审关键业务语义而不是整段模型解释"],
    completion: ["Requirement Contract 能被程序读取", "每个关键规则有来源或明确 UNKNOWN", "结构通过与业务确认被分成两道门禁"],
    architecture: { title: "需求到证据的可追溯转换链", caption: "版本化输入先经过 authority、schema、source/oracle、eval、mutation 和 trace 门禁；模型没有运行证据时保持 NOT_RUN。", nodes: ["PRD/Technical Design/OpenAPI", "Authority Policy", "Versioned Prompt + Schema", "Requirement Contract", "Independent Oracle + Eval", "Mutation Runner", "Traceability + Run Receipt"] },
    materials: [
      { title: "TD-P02 完整实验包", description: "下载后解压进入目录，包含输入、Prompt、Schema、eval、mutation、trace 与报告。", href: "materials/requirements-to-evidence.zip", kind: "archive", validation: "fixture-tested" },
      { title: "TD-P02 pipeline", description: "固定 cwd 可运行 package/authority/schema/eval/mutation/trace 与 0/1/0 红绿门禁。", href: "materials/requirements-to-evidence/pipeline.py", kind: "script", validation: "fixture-tested" },
      { title: "Prompt/Schema/Eval 工件", description: "查看 versioned system/task/critic、offline model manifest、八类 eval 与 mutation。", href: "materials/requirements-to-evidence/prompt-package/manifest.json", kind: "config", validation: "static-reviewed" },
      { title: "实验运行说明", description: "解释下载、解压、baseline、注入、修复和 fixture-only 证据边界。", href: "materials/requirements-to-evidence/README.md", kind: "guide", validation: "fixture-tested" }
    ],
    sourceIds: ["S41", "S66", "S81", "S85"],
    evidenceBoundary: commonBoundary,
  },
  {
    id: "TD-P03",
    moduleId: "TD-M00",
    order: 0,
    title: "解析技术文档：把组件、接口、状态与失败恢复变成可测试契约",
    type: "诊断",
    status: "desk-researched",
    duration: "45 分钟",
    summary: "把技术方案、OpenAPI、事件、数据与状态设计解析成可测试契约，并逐项检查它们是否支持已批准需求。",
    why: "需求说明业务结果，技术文档说明结果如何发生和在哪里观察。只读 PRD 会漏掉重试、幂等、并发、异步、回滚和可观测性；只读设计又可能把实现选择误当业务规则。",
    prerequisites: ["TD-P02"],
    outcomes: ["解析组件、接口、数据与状态", "建立需求—技术一致性矩阵", "识别重试、幂等、可观测性与恢复缺口"],
    artifact: "technical-contract.json 与 requirement-design-matrix.json",
    blocks: [
      {
        title: "先把技术文档拆成六类可测试对象",
        body: ["技术解析不是把架构图翻译成文字，而是分别抽取组件责任、接口/事件、数据与状态、异步与失败恢复、安全权限、可观测证据。每条技术结论绑定 source_ref，并说明它服务哪个 requirement_id。"],
        table: {
          headers: ["技术对象", "订单取消例子", "测试要观察什么"],
          rows: [
            ["组件与依赖", "订单服务、退款 Worker、支付网关", "责任边界与失败传播"],
            ["接口与事件", "POST /cancel、refund.requested", "Schema、错误、兼容性"],
            ["状态与数据", "PAID→CANCEL_PENDING→CANCELLED", "合法/非法转换与账本不变量"],
            ["重试与幂等", "消息重投与重复取消", "至多一次副作用"],
            ["可观测性", "trace_id、退款事件、审计记录", "受理、处理和最终结果"],
          ],
        },
      },
      {
        title: "用需求—技术矩阵找出实现缺口和越界实现",
        body: ["矩阵要能看出每条需求落在哪个组件、接口、状态和观察点，也要暴露设计中存在但需求未授权的行为。缺少映射不能写成‘研发自行处理’，而要形成带 owner 和 close_with 的问题。"],
        code: `{
  "requirement_id": "REQ-CANCEL-001",
  "technical_refs": ["TECH-a13f#S02", "OPENAPI-v7#/cancel"],
  "components": ["order-service", "refund-worker"],
  "states": ["PAID", "CANCEL_PENDING", "CANCELLED"],
  "observations": ["refund.requested", "refund_count", "audit.cancel_id"],
  "coverage": "PARTIAL",
  "gap": "publisher retry exhaust 后的 safe terminal 未定义"
}`,
      },
      {
        title: "技术文档解析必须连同失败和恢复一起问",
        body: ["不要只问正常调用链。对同步/异步边界逐项检查超时、取消、重试、幂等、并发竞争、死信、补偿、回滚和最终状态；再确认日志、指标、Trace、事件或存储是否能区分这些结果。"],
        code: `输入：已批准 Requirement Contract、技术方案、OpenAPI、事件 Schema、状态/数据设计。
输出：组件依赖、接口/事件契约、状态转换、失败恢复、可观测性与需求—技术一致性矩阵。
要求：每条结论有 source_ref；Evidence/Inference/Unknown 分开；重试与幂等一起分析；需求与设计冲突不得自动裁决；关键状态或副作用不可观察时 BLOCKED。`,
      },
      {
        title: "技术缺口也必须成为可关闭的问题",
        body: ["例如‘事件最多重试三次’仍不完整：还要确认退避、死信、重复投递、幂等身份、告警、人工恢复和 safe terminal。问题要记录影响的 requirement/risk、技术 owner 和关闭后的版本证据。"],
        expected: "得到 requirement-design-matrix；缺少幂等、回滚或可观察点的关键路径为 BLOCKED，并能直接传给下一页风险与方法选择。",
      },
    ],
    practice: ["给一个接口补齐超时、重试、幂等和最终状态", "画出一条异步链并标出每个可观察证据", "找一条设计超出需求授权的行为并 BLOCKED"],
    completion: ["需求与组件/接口/状态/观察点双向可追踪", "失败恢复与幂等语义有 owner", "关键技术缺口会阻断风险和用例生成"],
    sourceIds: ["S41", "S42", "S81", "S82"],
    evidenceBoundary: commonBoundary,
  },
  {
    id: "TD-P04",
    moduleId: "TD-M00",
    order: 0,
    title: "从需求契约到风险策略：决定测什么、在哪一层测",
    type: "概念",
    status: "desk-researched",
    duration: "50 分钟",
    summary: "把已确认需求映射到业务风险、测试目标、测试层级、Oracle、监控和残余风险责任人。",
    why: "AI 很容易生成几十条格式工整的用例，却不会自动知道哪项失败会造成资金损失，也不会替团队承担测试不足的风险。先做风险策略，才能控制范围和测试层级。",
    prerequisites: ["TD-P03"],
    outcomes: ["建立风险到测试的映射", "避免全部堆到 E2E", "为高风险定义测试、监控和处置"],
    artifact: "risk-test-plan.json 与测试层级决策表",
    blocks: [
      {
        title: "先写失败影响，再写测试类型",
        body: ["订单取消的主要风险不是‘接口报错’，而是重复退款、越权取消、已发货仍取消、状态和账本不一致、事件丢失。每项风险记录触发、影响、暴露面和责任人。"],
        code: `{
  "risk_id": "RISK-REFUND-DUPLICATE",
  "requirement_ids": ["REQ-CANCEL-001"],
  "failure": "重试或并发请求创建两笔退款",
  "impact": "资金损失与账务对账失败",
  "severity": "CRITICAL",
  "test_levels": ["unit", "service-integration", "contract"],
  "oracles": ["refund_count<=1", "refund_total<=captured_amount"],
  "monitoring": ["duplicate_refund_block_total", "refund_amount_mismatch_total"],
  "owner": "payments-quality-owner"
}`,
      },
      {
        title: "让测试层级承担不同证据",
        body: ["状态不变量和权限矩阵优先在单元/组件层快速覆盖；OpenAPI 和事件 Schema 用契约测试；数据库、消息和支付网关用服务集成；少量关键用户旅程进入 E2E。不要为了‘更真实’把所有组合都塞进浏览器。"],
        table: {
          headers: ["层级", "本例验证", "失败定位"],
          rows: [
            ["单元/属性", "状态机、不变量、金额边界", "业务规则"],
            ["契约", "409/403、事件字段、兼容性", "消费者/提供者契约"],
            ["集成", "事务、消息、支付重试", "依赖与一致性"],
            ["E2E", "买家取消到退款可见", "关键旅程"],
            ["生产监控", "重复退款和卡住状态", "真实分布与长尾"],
          ],
        },
      },
      {
        title: "AI 生成候选策略，人决定取舍",
        body: ["可以让模型依据契约、历史缺陷和架构生成候选风险，再由测试架构师合并、排序和选择层级。输出必须说明为什么选择、为什么不选择，以及残余风险由谁接受。"],
        code: `输入：ACCEPTED RequirementContract、架构图、历史缺陷、变更范围。
输出：RiskTestPlan[]。
要求：
- 每个 risk_id 绑定 requirement_ids 和 source_refs；
- 给出 failure、impact、test_levels、oracle、data、monitoring、owner；
- 说明未选择 E2E 或未覆盖组合的理由；
- 不编造严重性定义和阈值，缺失时标 UNKNOWN；
- 高风险没有 oracle、监控或 owner 时 status=BLOCKED。`,
      },
      {
        title: "策略门禁看覆盖关系，不看用例数量",
        body: ["至少检查：每个关键需求是否映射到风险；每个高风险是否映射到测试、Oracle、监控和处置；每个测试是否能说明自己保护什么。用例数量本身不是质量信号。"],
        warning: "‘生成 100 条测试用例’会鼓励重复和低价值组合；课程不使用数量作为完成标准。",
      },
    ],
    practice: ["为订单取消补一个安全风险和一个稳定性风险", "把一个 E2E 用例下沉到更合适的层级", "写出一项明确接受的残余风险及 owner"],
    completion: ["关键风险都有测试与 Oracle", "层级选择有理由", "高风险同时有监控和责任人"],
    sourceIds: ["S41", "S43", "S45", "S82"],
    evidenceBoundary: commonBoundary,
  },
  {
    id: "TD-P05",
    moduleId: "TD-M00",
    order: 0,
    title: "生成测试之前先固定 Oracle：否则 AI 只会生成自洽答案",
    type: "跟做",
    status: "desk-researched",
    duration: "60 分钟",
    summary: "从风险策略生成可执行测试模型，明确数据、动作、精确 Oracle、容差、清理和证据要求。",
    why: "同一个模型根据自己理解的需求生成代码和断言，错误规则也可能一起通过。关键业务结果必须依赖独立契约、状态不变量、账本或人工确认样例。",
    prerequisites: ["TD-P04"],
    outcomes: ["区分精确与概率 Oracle", "生成可追溯测试包", "用负控制证明测试有检测力"],
    artifact: "test-package.json、数据夹具和 Oracle 清单",
    blocks: [
      {
        title: "一个测试项需要的不只是步骤和预期结果",
        body: ["可执行 TestPackage 至少包含测试 ID、需求/风险映射、层级、前置数据、动作、Oracle、清理、证据和适用版本。对订单取消，HTTP 200 不是关键 Oracle；账本金额、退款次数、状态和事件才是。"],
        code: `{
  "test_id": "T-CANCEL-IDEMPOTENT-01",
  "requirement_ids": ["REQ-CANCEL-001"],
  "risk_ids": ["RISK-REFUND-DUPLICATE"],
  "fixture": {"order":"PAID_NOT_SHIPPED", "idempotency_key":"idem-001"},
  "actions": ["POST cancel", "POST cancel with same key"],
  "oracles": [
    "response[0].status=202",
    "response[1].refund_id=response[0].refund_id",
    "refund_operation_count(order_id)=1",
    "refund_total=captured_amount"
  ],
  "evidence": ["responses", "ledger_rows", "events", "trace_id"]
}`,
      },
      {
        title: "Oracle 分层，别把所有判断交给 LLM Judge",
        body: ["确定性业务规则使用精确断言、数据库不变量或契约校验。文本语义才考虑规则评分、模型 Judge 和人工抽查；Judge 要用人工标签校准，并保存版本与不确定状态。"],
        bullets: [
          "精确 Oracle：金额、状态、权限、次数、Schema、事件顺序",
          "属性/变形 Oracle：重复请求不增加副作用；输入顺序变化不改变总额",
          "统计 Oracle：失败率、延迟分位数、波动区间",
          "语义 Oracle：评分规则、独立 Judge、人工标签与 UNKNOWN 区间",
        ],
      },
      {
        title: "让模型生成候选，不让它删除证据",
        body: ["生成任务要接收已批准契约和风险计划，只生成指定层级的 TestPackage。每条测试必须说明保护的风险和所需证据；无法定义 Oracle 时输出 BLOCKED_TEST，不得退化为‘检查结果是否正确’。"],
        code: `依据 RequirementContract v2 和 RiskTestPlan 生成 TestPackage[]。
约束：
1. 每个测试绑定 requirement_ids、risk_ids、test_level。
2. 必须给出 fixture、actions、oracles、cleanup、evidence。
3. 金额、权限、状态和副作用优先使用确定性 Oracle。
4. 不得从被测实现反向推导预期结果。
5. 无独立 Oracle 时 status=BLOCKED_TEST，并说明需要哪个 owner。`,
      },
      {
        title: "先植入缺陷，再相信这组测试",
        body: ["教学实验会把已发货订单错误地改为可取消。测试包必须稳定变红，并把失败归到 REQ-CANCEL-002 与状态不变量，而不是只给一段‘可能存在业务问题’。"],
        code: "python3 pipeline.py reset\npython3 pipeline.py generate-tests\npython3 pipeline.py inject-code-defect\npython3 pipeline.py execute",
        expected: "执行返回 FAIL；T-CANCEL-SHIPPED-01 指出期望 409、实际 202，并保存 mutation_id、输入 hash 和运行日志。",
      },
    ],
    practice: ["把一个‘检查结果正确’改成可执行 Oracle", "为幂等和并发各写一条独立不变量", "植入一个错误实现并确认测试稳定失败"],
    completion: ["每个测试保护明确风险", "关键 Oracle 不依赖生成实现的同一模型", "至少一个负控制被可靠发现"],
    sourceIds: ["S41", "S45", "S87", "S07"],
    evidenceBoundary: commonBoundary,
  },
  {
    id: "TD-P06",
    moduleId: "TD-M00",
    order: 0,
    title: "把测试包接到自动化：接口、契约、集成和 UI 各自负责什么",
    type: "跟做",
    status: "desk-researched",
    duration: "65 分钟",
    summary: "把 TestPackage 转成测试骨架和适配器，并保持需求、风险、Oracle 与执行代码之间的追溯。",
    why: "直接让 AI 从 PRD 写 Playwright 脚本，往往把所有场景塞进 UI，还会基于当前页面行为生成错误断言。先有测试包，再选择执行适配器，代码才有稳定的业务依据。",
    prerequisites: ["TD-P05"],
    outcomes: ["为测试选择合适适配器", "生成后做静态与运行审查", "保留代码到契约的双向追溯"],
    artifact: "自动化测试骨架、adapter contract 与追溯索引",
    blocks: [
      {
        title: "生成代码前固定适配器边界",
        body: ["API 适配器负责请求和响应证据；数据库/事件适配器只读验证副作用；UI 适配器只覆盖用户可见关键路径。生产退款、取消和扣款等动作不得由教学 Agent 直接执行。"],
        table: {
          headers: ["适配器", "允许动作", "禁止动作"],
          rows: [
            ["API sandbox", "测试账号、幂等键、录制响应", "真实支付凭证"],
            ["DB evidence", "只读查询测试 schema", "修改生产账本"],
            ["Event probe", "订阅测试 topic", "向生产 topic 发事件"],
            ["Browser", "测试环境关键旅程", "绕过权限做副作用"],
          ],
        },
      },
      {
        title: "给代码生成 Agent 的输入必须是已批准工件",
        body: ["Playwright 的 planner、generator、healer 分工说明了计划、生成和修复可以拆开；但生成测试仍可能有错误或被跳过。课程进一步要求：生成器只接收 ACCEPTED TestPackage，不从当前实现猜预期。"],
        code: `输入：TestPackage、OpenAPI v7、adapter contract、测试环境变量清单。
输出：pytest/Playwright 测试骨架与 traceability-index.json。
要求：
- 每个测试函数标注 test_id、requirement_ids、risk_ids；
- Oracle 原样来自 TestPackage，不得根据实际响应改写；
- 失败必须保存 request_id、trace_id、响应和依赖状态；
- 禁止 skip、宽泛 try/except、固定 sleep 和删除失败断言；
- 只能调用允许的 sandbox 工具。`,
      },
      {
        title: "代码审查要找假绿模式",
        body: ["静态审查搜索空断言、只断言状态码、吞异常、自动重试后只报最终成功、条件性 skip 和 mock 自证。运行审查则植入权限、状态、重复副作用和依赖超时缺陷。"],
        bullets: [
          "断言是否来自 TestPackage，而不是复制实际返回",
          "失败是否保留原始证据和每次重试",
          "测试是否真的触发目标风险，而非只验证 mock 调用",
          "选择性执行和 skip 是否进入报告",
        ],
      },
      {
        title: "追溯索引让变更可以选择回归集",
        body: ["生成代码后保存 `test_id -> file/function -> requirement_ids -> risk_ids -> oracle_ids`。PRD、接口或实现变更时先更新影响集，再运行命中的测试；不能只按文件名猜回归范围。"],
        expected: "修改 REQ-CANCEL-001 后，可以列出受影响的契约、用例、自动化函数和上一次执行证据。",
      },
    ],
    practice: ["为一个 TestPackage 选择 API/契约/集成/UI 层", "审查一段只有 HTTP 200 的假绿测试", "生成一份 test_id 到代码函数的追溯索引"],
    completion: ["自动化代码不改变业务 Oracle", "高风险副作用只在隔离环境执行", "任一函数能回溯需求与风险"],
    sourceIds: ["S01", "S44", "S45", "S85"],
    evidenceBoundary: commonBoundary,
  },
  {
    id: "TD-P07",
    moduleId: "TD-M00",
    order: 0,
    title: "执行、收集、归因：一次绿色结果需要哪些证据",
    type: "诊断",
    status: "desk-researched",
    duration: "55 分钟",
    summary: "运行版本化测试包，保存 Run Manifest、原始日志、Trace、依赖状态、重试和失败分类。",
    why: "绿色截图无法证明测了哪个版本、是否跳过用例、是否因重试碰巧通过。执行结果只有连同输入、环境和原始证据一起保存，才能支持缺陷归因和发布判断。",
    prerequisites: ["TD-P06"],
    outcomes: ["生成可复现 Run Manifest", "区分产品失败、测试失败和环境阻塞", "禁止重试掩盖波动"],
    artifact: "run-manifest.json、原始日志与缺陷候选",
    blocks: [
      {
        title: "运行前先把版本钉住",
        body: ["Run Manifest 记录代码/镜像、需求 baseline、TestPackage、数据、依赖、模型/Prompt（如果参与）、环境和命令。任一关键版本缺失时，结果是 NOT_RUN 或 BLOCKED，不是 PASS。"],
        code: `{
  "run_id":"RUN-20260810-001",
  "code_sha":"7a31…",
  "baseline_id":"order-cancel-v2",
  "test_package_hash":"b82f…",
  "fixture_hash":"f104…",
  "environment":"local-sandbox",
  "command":"python3 pipeline.py execute",
  "retry_policy":"none",
  "selected_test_ids":["T-CANCEL-SHIPPED-01","T-CANCEL-IDEMPOTENT-01"]
}`,
      },
      {
        title: "失败先分类，修复 Agent 才能被约束",
        body: ["至少区分 PRODUCT_FAIL、TEST_FAIL、ENV_BLOCKED、DEPENDENCY_BLOCKED、UNKNOWN。没有足够证据时保持 UNKNOWN；不要让 healer 为了转绿直接改断言、加 skip 或放宽阈值。"],
        table: {
          headers: ["状态", "例子", "下一步"],
          rows: [
            ["PRODUCT_FAIL", "SHIPPED 返回 202", "建缺陷，保留 mutation/trace"],
            ["TEST_FAIL", "测试数据未创建", "修测试夹具，不改业务 Oracle"],
            ["ENV_BLOCKED", "服务未启动", "恢复环境后重跑"],
            ["UNKNOWN", "响应缺失且无 trace", "补证据，不做发布结论"],
          ],
        },
      },
      {
        title: "跑完整的 PASS → FAIL → PASS",
        body: ["离线实验使用同一份契约和测试包，先运行正常实现，再植入‘已发货可取消’缺陷，最后恢复。三次运行各自保存 manifest 和结果。"],
        code: "python3 pipeline.py reset\npython3 pipeline.py execute --report reports/baseline.json\npython3 pipeline.py inject-code-defect\npython3 pipeline.py execute --report reports/mutation.json\npython3 pipeline.py repair\npython3 pipeline.py execute --report reports/repair.json",
        expected: "baseline=PASS，mutation=FAIL，repair=PASS；mutation 报告包含测试 ID、期望 409、实际 202、代码版本和原始证据。",
      },
      {
        title: "结果收集不是生成一段总结",
        body: ["报告要保留原始结果、未运行项、重试次数、选择理由、覆盖关系和 artifact hash。AI 可以聚类相似失败、生成缺陷草稿；发布 owner 必须能打开原始证据，并知道哪些结论仍是推断。"],
        warning: "‘最终全部通过’若没有 selected tests、skipped、retry 和版本信息，只能算展示文字。",
      },
    ],
    practice: ["给一次运行补齐 code/baseline/data/test hash", "制造环境失败并确认状态是 BLOCKED 而不是 FAIL", "检查重试是否记录每次结果"],
    completion: ["运行结果可在同一夹具上复现", "失败状态不会被强制二值化", "原始证据足以支持缺陷归因"],
    sourceIds: ["S01", "S42", "S49", "S89"],
    evidenceBoundary: commonBoundary,
  },
  {
    id: "TD-P08",
    moduleId: "TD-M00",
    order: 0,
    title: "变更回归与发布判断：把整条证据链串起来",
    type: "项目",
    status: "fixture-tested",
    duration: "90 分钟",
    summary: "完成从 Test Basis、需求契约、评审、风险、测试包、执行证据到回归和发布决策的离线项目。",
    why: "这条链路的价值不在于第一次生成多少用例，而在于需求、接口、代码或模型变化后，能否知道哪些证据过期、该重跑什么、谁接受残余风险。",
    prerequisites: ["TD-P07"],
    outcomes: ["运行端到端离线证据链", "验证文档冲突与产品缺陷两类阻断", "生成有责任人与边界的发布建议"],
    artifact: "Requirements-to-Evidence Capstone 与三态运行证据",
    blocks: [
      {
        title: "你将交付的不是一份长文，而是九个可连接工件",
        body: ["依次产生 Test Basis Pack、Requirement Contract、Review Question Pack、Risk Test Plan、TestPackage、自动化代码/追溯索引、Run Manifest、Evidence Pack 和 Impact Set。每个工件都有 parent IDs、版本、owner、状态和下游消费者。"],
        code: "Test Basis -> Requirement Contract -> Review Questions\n           -> Risk Test Plan -> TestPackage -> Executable Tests\n           -> Run Manifest -> Evidence Pack -> Impact Set",
      },
      {
        title: "先证明输入冲突会阻断",
        body: ["重置后注入旧技术方案冲突。流水线必须停在需求评审之前，不能继续生成测试。"],
        code: "cd courses/td-ai-011-requirements-to-evidence/lab\npython3 pipeline.py reset\npython3 pipeline.py inject-doc-conflict\npython3 pipeline.py all",
        expected: "exit 2；status=BLOCKED；报告列出冲突来源和需要产品 owner 决定的问题；tests 目录不生成新产物。",
      },
      {
        title: "再证明测试能发现已知产品缺陷",
        body: ["恢复已批准文档，生成测试并运行正常实现；然后植入已发货可取消缺陷。"],
        code: "python3 pipeline.py reset\npython3 pipeline.py all --report reports/baseline.json\npython3 pipeline.py inject-code-defect\npython3 pipeline.py all --report reports/mutation.json",
        expected: "baseline exit 0；mutation exit 1；失败明确映射到 REQ-CANCEL-002、RISK-INVALID-STATE 和 T-CANCEL-SHIPPED-01。",
      },
      {
        title: "修复后生成发布证据，而不是自动批准",
        body: ["修复实现并重跑。Evidence Pack 汇总覆盖、失败、未决问题、环境、工件 hash 和残余风险。离线课程只输出 RELEASE_CANDIDATE；真实 Go/No-Go 仍需要具名责任人。"],
        code: "python3 pipeline.py repair\npython3 pipeline.py all --report reports/repair.json\npython3 pipeline.py evidence",
        expected: "repair exit 0；Evidence Pack 显示三态证据完整，但明确标注 synthetic fixture、not production validated、human release decision required。",
      },
      {
        title: "最后做一次变更影响分析",
        body: ["把 OpenAPI 的 409 响应 Schema 改成新版本。Impact Set 应命中需求契约、契约测试、API 自动化和发布证据；未命中的测试要保留选择理由。文件名相邻不等于业务影响。"],
        bullets: ["需求/技术文档变化：重做提取、评审和风险映射", "API/事件 Schema 变化：重做契约与消费者测试", "代码/配置变化：按依赖图选择回归集", "模型/Prompt/工具变化：旧 AI 评测证据不能自动继承"],
      },
    ],
    practice: ["完整保存 BLOCKED、FAIL、PASS 三种结果", "新增一个未授权取消的 mutation", "为一次接口契约变更生成 Impact Set"],
    completion: ["文档冲突阻断且不生成下游测试", "代码缺陷能稳定变红并正确归因", "修复后生成可审计但不越权的发布候选"],
    sourceIds: ["S41", "S42", "S66", "S81", "S82", "S07"],
    evidenceBoundary: commonBoundary,
  },
];

const promptBlocks: Record<string, number[]> = {
  "TD-P01": [2],
  "TD-P02": [3],
  "TD-P03": [3],
  "TD-P04": [3],
  "TD-P05": [3],
  "TD-P06": [2],
};

const diagramBlocks: Record<string, number[]> = {
  "TD-P08": [1],
};

const commandLikeBlocks: Record<string, number[]> = {
  "TD-P01": [4],
  "TD-P02": [4],
  "TD-P05": [4],
  "TD-P07": [3],
  "TD-P08": [2, 3, 4],
};

const pagePrompt = (pageId: string, content: string): TechnicalBlock => ({
  kind: "prompt",
  content,
  version: "1.1.0",
  promptPath: `materials/requirements-to-evidence/page-prompts/${pageId}/prompt-v1.md`,
  manifestPath: `materials/requirements-to-evidence/page-prompts/${pageId}/manifest.json`,
  inputFixturePath: `materials/requirements-to-evidence/page-prompts/${pageId}/input.json`,
  outputSchemaPath: `materials/requirements-to-evidence/page-prompts/${pageId}/schema.json`,
  evaluationPath: `materials/requirements-to-evidence/page-prompts/${pageId}/eval.json`,
});

const directUsePromptTexts: Record<string, string> = {
  "TD-P01": `你是证据优先的测试生命周期负责人。请建立 Test Basis Pack，不替团队决定业务规则。

【业务范围】[填写本次要测试的能力]
【来源权威】[填写每类文档的 owner、有效版本和冲突处理]
【输入粘贴区】
--- PRD/需求 ---\n[粘贴并保留标题/段落]\n--- 技术方案 ---\n[粘贴]\n--- API/事件/历史缺陷 ---\n[粘贴]

先生成稳定 source_ref，再输出：1. 来源与版本清单；2. Evidence / Inference / Unknown；3. 冲突、影响、owner_question、close_with；4. 下游 Requirement Contract、技术解析、风险、Oracle、用例、执行、回归的入口状态。不要编造状态、阈值、权限、错误码或 SLA；关键来源缺失或冲突时 status=BLOCKED。`,
  "TD-P02": `你是需求评审与解析专家。请把自然语言需求转为可测试 Requirement Contract，不替产品 owner 补规则。

【评审目标】[填写功能/变更]
【来源权威】[粘贴已确认规则]
【输入粘贴区】\n[粘贴 PRD、用户故事、验收标准、术语]

逐条输出 requirement_id、actor、preconditions、trigger、states、invariants、exceptions、side_effects、permissions、NFR、source_refs、status，并补 Given/When/Then/Oracle。检查歧义、冲突、缺失分支、重复、并发、权限、不可观察结果和未定义 NFR。结果分 Evidence / Inference / Unknown；没有 source_ref 不得 ACCEPTED，关键问题必须给 owner、block_level、close_with 并 BLOCKED。`,
  "TD-P03": `你是测试开发与架构审查专家。请解析技术文档并检查其与需求一致性，不替架构师裁决冲突。

【系统范围】[填写]
【Requirement Contract】[粘贴已批准需求]
【输入粘贴区】\n[粘贴技术方案、组件、OpenAPI、事件 Schema、数据/状态、重试/幂等/超时、可观测性、安全与回滚]

输出组件依赖、接口/事件契约、状态转换、失败恢复、需求—技术一致性矩阵与 Review Questions。每条结论带 source_ref，并区分 Evidence / Inference / Unknown。重点检查组件、接口、状态、重试、幂等、并发、可观测性、权限和回滚；不要编造缺失 SLA/错误码/阈值，关键冲突或不可观察结果必须 BLOCKED。`,
  "TD-P04": `你是风险驱动测试架构师。请先分析失败影响，再选择测试方法和层级，不按用例数量优化。

【Requirement Contract】[粘贴]
【技术解析】[粘贴]
【风险口径】[粘贴组织定义；没有写未定义]
【输入粘贴区】\n[粘贴历史缺陷、变更、环境和预算约束]

输出 Risk Test Plan：risk_id、failure、impact、Evidence / Inference / Unknown、method、rationale、rejected_methods、test_level、independent oracle、data、monitoring、owner、residual risk。按输入形态选择等价类/边界值/决策表/状态/场景/契约/属性/变形；不要编造严重度与阈值。关键风险无 Oracle、监控或 owner 时 BLOCKED。`,
  "TD-P05": `你是专业测试设计师。先建立独立 Oracle Registry，再生成测试条件和用例；不要从实现实际输出反推 expected。

【Requirement Contract】[粘贴]
【Risk Test Plan】[粘贴]
【技术可观察点】[粘贴]
【独立 Oracle 来源】[粘贴业务规则/Schema/公式/不变量及 owner]
【输入粘贴区】\n[粘贴测试数据、环境和禁止副作用]

输出 Oracle Registry、方法覆盖矩阵和 Test Cases。每条用例含 requirement_id、risk_id、method、oracle_id、preconditions、data、action、expected transport/state/event/audit、cleanup、evidence、status；覆盖正常、拒绝、边界、权限、并发、重试和恢复。分 Evidence / Inference / Unknown；缺规则/Oracle/环境时 BLOCKED_TEST，不要编造。`,
  "TD-P06": `你是测试开发工程师。先审查 Test Package，再映射到自动化；不能改业务 Oracle，也不能用 skip、吞异常或无限重试假绿。

【目标适配器】[API/契约/组件/UI/数据]
【Test Package】[粘贴]
【系统契约】[粘贴接口/locator/schema]
【输入粘贴区】\n[粘贴框架版本、cwd、数据、凭据边界、禁止副作用]

输出 REVIEW findings、Adapter Contract、代码/文件清单、baseline/fault/repair 命令与追踪图。命令必须有 cwd、exit code、artifacts；断言引用 oracle_id；错误向上传播；重试有界并保留每次结果。分 Evidence / Inference / Unknown；契约、凭据或安全控制缺失时 BLOCKED，不要编造字段。`,
  "TD-P07": `你是测试执行与证据归因专家。请冻结 Run Manifest，并把失败分类为 PRODUCT_FAIL / TEST_FAIL / ENV_BLOCKED / DEPENDENCY_BLOCKED / UNKNOWN。

【固定版本】[需求/代码/配置/数据/Test Package/hash]
【运行命令】[cwd、命令、时间、exit code]
【选择与跳过】[selected/skipped/not_run]
【输入粘贴区】\n[按 test_id 粘贴 expected、actual、日志/trace/报告和每次重试]

输出 Run Manifest、逐项归因、Evidence / Inference / Unknown、缺陷草稿、最小补证动作和决策摘要。PRODUCT_FAIL 必须有独立 Oracle 与原始 actual；证据不足保持 UNKNOWN。不要用最后一次 PASS 覆盖先前失败，也不要编造根因。`,
  "TD-P08": `你是变更影响与回归负责人。请让受影响的旧 PASS 失效，选择可解释回归集并生成发布候选证据；你不能批准上线。

【变更目标】[填写]
【BEFORE / AFTER】[粘贴版本、diff、契约、配置、模型/Prompt hash]
【追踪链】[source→requirement→risk→method→oracle→case→result]
【输入粘贴区】\n[粘贴历史 receipt、发布门禁、risk/release/rollback owner]

输出 Change Set、Impact Set、selected/not_selected Regression Set、Evidence Pack、residual risks 和 RELEASE_CANDIDATE / BLOCKED / UNKNOWN。分 Evidence / Inference / Unknown；默认不继承旧 PASS，模型/Prompt 变化的旧评测也视为 STALE，除非有版本桥接证据。不要编造覆盖率或风险接受。`,
};

const directUsePromptBlock = (pageId: string): TutorialBlock => ({
  title: "直接复制到任意 AI Agent：先用快速版，再下载完整专业版",
  body: [
    "下面的快速版可以立即粘贴使用；方括号内容替换成你的材料。完整文件另外包含能做什么、准备项、字段改法、完整输出结构、自检与 BLOCKED 条件，适合正式工作留档。",
    "AI 只负责提取、候选分析和结构化，不负责批准需求、裁决冲突、接受风险或决定发布。首次迁移先用脱敏的小范围资料，并人工抽查 source_ref 与 Oracle。",
  ],
  technical: pagePrompt(pageId, directUsePromptTexts[pageId]),
  expected: "复制后替换输入粘贴区，得到带 source_ref、Evidence/Inference/Unknown、责任人和停止状态的候选工件；完整 Prompt 文件提供进一步的输出字段和自检。",
  warning: "本包已通过静态合同和离线负控制；真实 AI provider/model 执行仍为 NOT_RUN，不能据此声称模型准确、企业可用或生产通过。",
});

const pageCycleNarratives: Record<string, { title: string; body: string[]; expected: string; warning: string }> = {
  "TD-P01": {
    title: "运行来源冲突门禁：旧技术设计不能覆盖已批准 PRD",
    body: ["先把 PRD、技术设计与 OpenAPI 冻结为带 authority 的 Test Basis；再由资金/权限/状态风险选择方法和独立 Oracle，最后才允许 case 与 Prompt/Eval/Mutation 消费。fault 将相反规则同时提升为有效 authority，验证下游在 SOURCE_CONFLICT 时停止。"],
    expected: "cycle 退出 0，内部 baseline/fault/repair=0/1/0；fault finding_id=SOURCE_CONFLICT，repair 通过新裁决版本恢复，而不是让模型选择规则。",
    warning: "若只在接口响应不一致时失败，说明门禁放得太晚；本页应在测试依据阶段 BLOCKED。模型、从业者、企业集成、live 与 production 仍为 NOT_RUN。",
  },
  "TD-P02": {
    title: "运行本页独立 baseline → fault → repair",
    body: ["从材料目录运行 manifest 精确声明的命令。脚本先证明批准夹具为绿，再注入本页特有缺陷变红，最后修复回绿；真实模型和企业集成仍为 NOT_RUN。"],
    expected: "退出 0；reports/TD-P02-cycle.json 内三相状态依次为 PASS、FAIL、PASS，evidence_status=fixture-tested，provider=none，model_status=NOT_RUN。",
    warning: "该结果只证明离线确定性负控制可运行，不是模型、从业者、企业集成、线上或生产验证。",
  },
  "TD-P03": {
    title: "运行无人负责的评审问题门禁",
    body: ["需求与技术文档先暴露冲突和不可观察项；风险决定 block_level，批准规则形成独立 Oracle，关闭后的 question 才能更新 case。Prompt 只生成问题候选，Schema/Eval 强制 owner 与 close_with，Mutation 删掉二者验证 UNOWNED_BLOCKER。"],
    expected: "cycle 退出 0，内部 0/1/0；fault finding_id=UNOWNED_BLOCKER，并指出问题缺少 accountable owner 或 close_with evidence。",
    warning: "把 owner 默认成“团队”或把问题改成“请完善需求”是假修复；应补 locator、影响、具名回答人和关闭后的契约版本。",
  },
  "TD-P04": {
    title: "运行关键风险缺少方法与 Oracle 的门禁",
    body: ["PRD 提供损失和验收边界，技术设计提供并发、事件与重试机制；据此为资金、权限、状态风险选择属性、决策表、状态转换或契约测试。case/Prompt/Eval 都必须引用独立 Oracle，Mutation 删除关键风险的方法、监控和 residual owner。"],
    expected: "cycle 退出 0，内部 0/1/0；fault finding_id=METHOD_GAP，明确关键风险没有 method、oracle、monitoring 或 residual-risk owner。",
    warning: "增加 E2E 用例数量不能修复 METHOD_GAP；必须说明方法为何能检出该失败，并指定独立预期和剩余风险责任人。",
  },
  "TD-P05": {
    title: "运行实现反推预期的自证 Oracle 门禁",
    body: ["需求规则和技术可观察面先分离：风险决定测试方法，Oracle Registry 只接受批准规则、独立计算或不变量，case 再引用 oracle_id。Prompt/Schema/Eval 检查 TestPackage 的追踪关系，Mutation 把 expected_source 改成 implementation_output。"],
    expected: "cycle 退出 0，内部 0/1/0；fault finding_id=SELF_CONFIRMING_ORACLE，指出 expected 来自被测实现；repair 恢复独立依据。",
    warning: "同一模型生成 expected 再担任 Judge 仍可能共同失败；高风险金额和权限 Oracle 需要独立证据与具名 owner。",
  },
  "TD-P06": {
    title: "运行吞断言或改 Oracle 的假绿自动化门禁",
    body: ["生成器必须消费已批准的需求、技术契约、风险方法、Oracle 与 case，而不是直接从 PRD 猜 UI 脚本。版本化 Prompt 绑定 input/Schema/Eval/Mutation；adapter 只做实现映射，不能吞异常、skip 或按实际响应改写 expected。"],
    expected: "cycle 退出 0，内部 0/1/0；fault finding_id=FAKE_GREEN_AUTOMATION，明确 adapter swallowed an assertion or changed the approved oracle。",
    warning: "最终重试成功不等于门禁通过；selected、skipped、retries 与 assertion 传播必须进入报告。真实模型生成仍为 NOT_RUN。",
  },
  "TD-P07": {
    title: "运行缺少固定输入与原始证据的归因门禁",
    body: ["basis/package 版本固定后，风险方法决定 selected cases，独立 Oracle 决定 actual/expected 比较，Prompt/Eval/Mutation 的 hash 一并进入 Run Manifest。fault 删除 pinned input、selection、retry 或 raw evidence，验证运行不能被归因为产品失败。"],
    expected: "cycle 退出 0，内部 0/1/0；fault finding_id=UNATTRIBUTABLE_RUN，明确缺少 pinned input、selection、retry 或 raw evidence。",
    warning: "绿色截图和模型总结不能替代 Run Manifest；证据不足时保持 UNKNOWN，不允许 healer 猜根因或改断言转绿。",
  },
  "TD-P08": {
    title: "运行新版本继承旧 PASS 的过期证据门禁",
    body: ["需求或技术契约 diff 先传播到 risk/oracle/case，再决定 Prompt/Eval/Mutation 与回归选择；Impact Set 必须使受影响 receipt 失效。fault 让变更后的 409 契约继承旧 PASS，验证 Evidence Pack 拒绝 stale truth。"],
    expected: "cycle 退出 0，内部 0/1/0；fault finding_id=STALE_EVIDENCE，指出 changed contract inherited an obsolete PASS receipt；repair 生成新版本证据。",
    warning: "未受影响证据只能由依赖图和版本范围证明后复用；流水线只生成 RELEASE_CANDIDATE，不能替具名人类批准发布。",
  },
};

const pageCycle = (pageId: string): TutorialBlock => {
  const narrative = pageCycleNarratives[pageId];
  if (!narrative) throw new Error(`Missing page-cycle narrative for ${pageId}`);
  return {
    ...narrative,
    technical: {
      kind: "command",
      content: `python3 pipeline.py page-cycle --page ${pageId} --report reports/${pageId}-cycle.json`,
      manifestPath: `materials/requirements-to-evidence/page-manifests/${pageId}.json`,
      stepId: "cycle",
      workingDirectory: "materials/requirements-to-evidence",
      expectedExitCode: 0,
      expectedArtifacts: [`reports/${pageId}-cycle.json`],
    },
  };
};

const migrateTechnicalBlock = (pageId: string, block: TutorialBlock, blockNumber: number): TutorialBlock => {
  if (!("code" in block) || !block.code) return block;
  const { code, ...base } = block;
  if (promptBlocks[pageId]?.includes(blockNumber)) {
    return {
      ...base,
      technical: { kind: "pseudocode", content: code, verification: "本段解释 Prompt 权限或任务分解；可复制版本见本页“直接复制到任意 AI Agent”与完整 Prompt 文件。" },
      expected: base.expected ?? "按固定 input 生成符合 schema 的候选工件；eval 检查引用、authority、Unknown、独立 Oracle 与证据边界，真实模型保持 NOT_RUN。",
    };
  }
  if (diagramBlocks[pageId]?.includes(blockNumber)) {
    return {
      ...base,
      technical: { kind: "diagram", content: code, verification: "解释性工件链，不可运行；以本页 manifest 的 0/1/0 cycle 验证链路。" },
    };
  }
  if (commandLikeBlocks[pageId]?.includes(blockNumber)) {
    return {
      ...base,
      technical: { kind: "pseudocode", content: code, verification: "保留原教学步骤用于解释，不直接复制；运行本页新增的 exact-manifest cycle 命令。", implementationPath: "materials/requirements-to-evidence/pipeline.py" },
    };
  }
  return {
    ...base,
    technical: {
      kind: "config",
      content: code,
      sourcePath: `materials/requirements-to-evidence/examples/${pageId}.json`,
      format: "JSON",
      consumer: `${pageId} learner artifact example`,
    },
  };
};

export const requirementsTestingLifecyclePages: TutorialPage[] = rawRequirementsTestingLifecyclePages.map((page) => ({
  ...page,
  status: "fixture-tested",
  blocks: [
    ...page.blocks.map((block, index) => migrateTechnicalBlock(page.id, block, index + 1)),
    ...(methodologyStageBlock(page.id) ? [methodologyStageBlock(page.id)!] : []),
    ...methodologyExtraBlocks(page.id),
    directUsePromptBlock(page.id),
    pageCycle(page.id),
  ],
  materials: [
    ...(page.materials ?? []),
    ...(page.materials?.some((material) => material.kind === "script" && material.validation === "fixture-tested")
      ? []
      : [{
          title: `${page.id} 可运行 Pipeline`,
          description: `已用于 ${page.id} baseline/fault/repair/cycle 的 Python 标准库实现；从公开材料工作目录按本页 manifest 运行。`,
          href: "materials/requirements-to-evidence/pipeline.py",
          kind: "script" as const,
          validation: "fixture-tested" as const,
        }]),
    { title: `${page.id} 独立运行 Manifest`, description: "精确声明 owner、cwd、所需文件、baseline/fault/repair/cycle 命令、退出码与报告。", href: `materials/requirements-to-evidence/page-manifests/${page.id}.json`, kind: "config", validation: "fixture-tested" },
    { title: `${page.id} 版本化 Prompt 包`, description: "包含 v1.1.0 Prompt、固定 input、JSON Schema、eval、mutation 和 NOT_RUN 模型边界。", href: `materials/requirements-to-evidence/page-prompts/${page.id}/manifest.json`, kind: "config", validation: "static-reviewed" },
    { title: `${page.id} 可直接复制的完整 Prompt`, description: "包含能做什么、准备项、输入粘贴区、可改字段、完整输出、自检和 BLOCKED 条件。", href: `materials/requirements-to-evidence/page-prompts/${page.id}/prompt-v1.md`, kind: "guide", validation: "static-reviewed" },
    { title: "完整生命周期 Prompt Kit 使用指南", description: "按 P01→P08 说明先看什么、怎么复制、如何检查以及 AI 不能替你决定什么。", href: "materials/requirements-to-evidence/DIRECT-USE-GUIDE.md", kind: "guide", validation: "static-reviewed" },
    { title: "业务迁移卡", description: "替换业务场景、来源权威、责任人和验证方法，同时保留追踪、独立 Oracle 与证据边界。", href: "materials/requirements-to-evidence/ADAPTATION-CARD.md", kind: "guide", validation: "static-reviewed" },
    { title: `${page.id} 0/1/0 收据`, description: "逐页离线负控制汇总；只证明 fixture-tested，不代表模型、集成或生产通过。", href: `materials/requirements-to-evidence/reports/${page.id}-cycle.json`, kind: "evidence", validation: "fixture-tested" },
    ...handbookMaterials(page.id),
  ],
}));
