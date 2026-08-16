# Route A：需求／设计解释、Test Basis 与 AI 测试预言的标准研究

## Request Type

Comprehensive research（标准、官方 syllabus、规范与 AI 评测边界）。

检索与复核日期：2026-08-11（Asia/Shanghai）。本文件只提供可被课程工厂编码的通用协议，不为某一页面、业务名称或单个工具硬编码规则。

## Direct Answer

需求到测试设计应被实现为一个“有证据的图”而不是一次模型生成：

1. **先建输入基线**：登记每份需求文档、技术设计、接口描述、风险记录、假设、版本、提交哈希、来源定位和生效范围。文档缺失、版本冲突、TBD/TBR 或无法解析的引用，不得让模型猜测，状态应为 `BLOCKED` 或 `UNKNOWN`。
2. **分离需求与设计**：需求回答“系统必须达到什么可观察结果以及约束是什么”；设计回答“采用哪些组件、接口、数据／控制流、状态、技术决策和权衡来实现”。设计中的实现选择不能自动升级为需求，除非有可追溯的需求或已批准的约束来源。
3. **生成 Requirement Contract**：每条规则至少含唯一 ID、原文引用、actor/trigger、前置条件、输入、可观察结果、状态／转换、不变量、例外、数据／安全／性能等 NFR、约束、owner、验证方法、风险、版本和不确定性。事实、未知、冲突要分开；缺少来源的 ACCEPTED 规则必须拒绝。
4. **建立双向 Test Basis 图**：`source span → requirement/design claim → risk → test condition → test case/data/environment → oracle → result → defect/decision`。检查正向覆盖、反向可达、孤儿节点、悬挂引用、变更影响和结果回溯；不能把“有测试”当作“满足需求”。
5. **按输入形态与风险选方法**：数值／枚举域先用等价类；有序边界用 BVA；条件组合用决策表；状态和非法转换用状态转换；场景／用户目标用用例或场景测试；参数交互高风险时用组合／pairwise 或更高强度；实现已知且需要结构覆盖时再用白盒；规范不足或时间紧时用探索式、错误猜测、检查表，并保留较低可重复性的边界。
6. **为 AI 输出分层判定**：结构层（JSON／Schema／字段类型）通过，不等于语义、业务、来源、风险或副作用正确。AI 结果必须分别经过 Schema 验证、来源／指针存在性、规则与约束、风险与冲突门禁，再由领域 owner 复核关键金额、权限、状态、合规和副作用。
7. **LLM 评测必须绑定部署语境**：为每个场景预先定义可观察指标、参考事实或变换关系、人工／自动判定责任、阈值方法、数据切分、模型／提示／工具版本、失败处置和残余风险。离线 fixture 只能证明该 fixture 的可运行性；不能升级成真实模型、企业集成、生产或从业者证据。

## Evidence / Inference / Unknown

### Evidence（来源直接支持）

- ISO/IEC/IEEE 29148:2018 的官方页面确认需求工程过程、信息项、内容和格式的范围；NASA 公开手册进一步给出需求 ID、来源、owner、验证方法和双向追踪等可执行元数据要求。
- ISO/IEC/IEEE 42010:2022 的官方页面确认架构描述应处理 viewpoint、framework、language 和 model kind，同时不规定某一种架构方法或工具。
- ISTQB CTFL v4.0.1 与 CTAL-TA v4.0 syllabus 明确 test basis 分析、风险优先的 test conditions、Test Basis/testware 追踪、测试技术选择条件和 test oracle problem；CTAL-TA 直接把 AI 的非确定性、概率行为与歧义需求列为 oracle 难点。
- NIST AI RMF Measure 与 Generative AI Profile 要求部署前及运行中 TEVV，并强调 ground truth、自动／人工复合评测、测量不确定性、adversarial testing 及 benchmark 到真实部署的边界。
- JSON Schema、JSON Pointer 和 OpenAPI 官方规范分别支持结构约束、稳定定位和接口描述；它们不自动证明业务语义、引用真实性或副作用正确。

### Inference（跨来源综合出的工厂协议）

- `basis_manifest`、`Requirement Contract`、双向关系图和分层 oracle 是把上述证据编码成可执行工厂协议的综合设计，不是任何单一标准要求的固定字段集合。
- “每一层失败即阻断”“孤儿测试只能标记探索性”“fixture-tested / model-integrated / integration-tested / practitioner-reviewed / production-validated 分级”是为避免过度声称而作的工程性推导；项目可加严，但不能把较低成熟度状态改写为较高状态。
- 将设计选择与需求分离、将 source span/content hash/locator 作为证据，以及按输入形态 × 风险 × oracle 可得性选择测试方法，是由需求质量、架构描述、风险驱动测试和追踪原则综合推导的通用实现策略。

### Unknown（当前证据不能回答）

- 目标课程或企业文档上，任一具体 LLM 的抽取准确率、跨模型／跨版本稳定性、提示注入抗性和成本／延迟分布未知。
- 未执行真实模型、企业 API、权限系统、Jira/GitLab/Kubernetes、浏览器或生产 workload 的运行收据；因此不能由本研究声称 `model-integrated`、`integration-tested`、`practitioner-reviewed` 或 `production-validated`。
- 任何组织的 Test Basis 组成、法规阈值、人工审批责任和可接受残余风险可能不同，须由项目 owner 配置和批准，不能由工厂默认猜测。

## Protocol to Encode in the Factory

### A. 输入登记与 Test Basis 组装

把以下项目作为不可省略的 `basis_manifest`（字段可按项目裁剪，但不能隐式丢失）：

| 字段 | 最小内容 | 阻断条件 |
|---|---|---|
| `artifact_id` / `artifact_type` | 需求、用户故事、技术设计、OpenAPI、数据契约、风险记录、法规、假设 | ID 重复或类型未知 |
| `version` / `effective_at` / `content_hash` | 版本、适用时间、内容哈希 | 版本不可判定或已过期但仍标记当前 |
| `source_uri` / `locator` | URL、文件路径、页／章／段、JSON Pointer 或锚点 | 引用无法重新打开或定位 |
| `authority` / `owner` | 发布者、审批人、责任 owner | 关键规则没有可问责 owner |
| `scope` / `supersedes` | 适用系统／接口／租户及替代关系 | 同一范围有未解决的冲突版本 |
| `assumptions` / `unknowns` | 显式假设、TBD/TBR、待确认问题 | 把未知转写为确定事实 |
| `risk_refs` | 风险 ID、可能性、影响、风险等级 | 高风险没有处理或测试策略 |

`source_refs` 不是装饰字段：每个接受的规则必须至少引用一个可定位的源片段；推导规则要同时指向父规则、推导理由和批准关系。没有引用的模型填充值进入 `UNKNOWN`，而不是 `ACCEPTED`。

### B. 需求文档解读检查表

使用以下顺序，先识别语义层级，再抽取字段：

1. **意图层**： stakeholder need/goal、业务事件、成功标准、法规或合同约束。目标和期望不是系统需求，不能直接拿来做通过条件。
2. **规范层**：识别规范性语句及其适用 actor、trigger、输入、前置条件、动作／响应、可观察结果、时序、状态、不变量、例外、数据和质量属性。把“快、友好、合理、充分”等不可判定形容词列为可测试性缺陷。
3. **关系层**：唯一 ID、父／子需求、依赖、冲突、重复、来源和 rationale；记录从 stakeholder expectation 到派生技术需求的 flow-down。
4. **验证层**：每条需求预先指定 `test | inspection | analysis | demonstration` 之一或组合、验证层级、验收判定、必要数据／环境和责任人。若没有可行验证方法，规则不应进入可执行测试条件。
5. **变更层**：记录基线、变更请求、受影响设计／代码／测试／风险和回归范围；旧证据只可标记 `SUPERSEDED`，不得静默覆盖。

需求质量应至少检查正确性、一致性、清晰性、完整性、可行性、可验证性、可维护性和安全关键性。NASA 的软件需求分析指南把这些作为独立分析维度，并明确要求处理 TBD、假设、场景和可验证术语；这适合作为通用字段检查的基线，而不是让模型代替领域审批。

### C. 技术设计解读检查表

把设计文档当作**架构／实现证据**，按以下视图读取：

| 视图 | 要抽取的可测试事实 | 常见误读 |
|---|---|---|
| 范围与关注点 | stakeholder、concern、系统边界、信任边界、部署上下文 | 把图上的组件名称当作业务需求 |
| 结构 | 组件、连接器、依赖、拥有者、版本和替换点 | 只抄框图，不记录接口契约 |
| 行为 | 时序、状态、事件、guard、重试、超时、幂等、副作用 | 只测 happy path |
| 数据与接口 | 输入／输出 schema、编码、单位、错误码、鉴权、兼容性和引用 | 只验证 HTTP 200 或 JSON 可解析 |
| 质量属性 | 延迟、吞吐、可用性、恢复、安全、隐私、可观测性、成本 | 没有单位、负载分布、阈值或 owner 的指标 |
| 决策与权衡 | ADR、假设、被拒方案、风险、回滚和重新评估条件 | 把实现选择升级为不可变需求 |
| 运维与变更 | 监控、告警、迁移、降级、回滚、数据保留、版本兼容 | 设计完成但无执行／回读证据 |

ISO/IEC/IEEE 42010:2022 规定架构描述的结构表达、架构框架、语言、viewpoint 和 model kind，但明确不规定具体建模方法、工具或架构本身的需求。因此测试抽取应要求设计作者提供与 stakeholder concerns 对应的 viewpoint、决策 rationale 和可验证接口；不能把某个图法或模板当作唯一正确设计。

OpenAPI 3.2.0 可作为接口设计的机器可读依据：它定义语言无关的 HTTP API 描述，可供文档、代码生成和测试工具消费；但规范也保留 implementation-defined/undefined 行为和版本兼容问题。对接口字段使用版本化 JSON Pointer／`$ref` 定位，仍须通过运行时契约、错误响应、副作用和权限测试确认，不得只做描述文件 lint。

### D. Requirement Contract 与双向追踪

推荐的通用关系模型：

```text
SourceSpan
  └─derives/clarifies─> Requirement
       ├─allocated/implemented-by─> DesignClaim / Interface / DataContract
       ├─risk-addressed-by─> Risk
       ├─tested-by─> TestCondition ─tested-by─> TestCase
       │                              ├─uses─> TestData / Environment
       │                              └─judged-by─> Oracle
       └─results-in─> Result ─raises─> Defect / Decision
```

每个节点必须有稳定 ID、版本和 owner；每条边必须有关系类型、证据引用、建立者、时间和状态。最小门禁：

- `source → requirement`：每个 ACCEPTED 规则至少一个可解析源定位；一个源可产生多条规则，但不能复制成“独立证据”。
- `requirement → design`：每个设计声称的行为／接口／约束要么链接父需求，要么显式标记为实现假设／决策。
- `requirement/risk → test condition`：每条高风险需求有至少一个可执行或可审查条件，并标出覆盖标准。
- `test condition → case/data/environment`：条件必须落到输入、动作、预期结果和环境；只写自然语言标题不算测试工件。
- `case → oracle/result`：必须有明确 pass/fail、比较规则和结果证据；随机或生成式输出不可用“看起来合理”代替。
- **反向检查**：每个测试、设计接口和结果都能反向找到需求／风险或标记为探索性发现；孤儿测试可能仍有价值，但不能声称需求覆盖。
- **变更影响**：需求或设计版本变化时，图计算受影响的条件、案例、数据、oracle、实现和回归范围；旧结果标记 `SUPERSEDED`。

对 JSON/YAML/接口文档，优先保存 `document_uri + content_hash + JSON Pointer/RFC 6901 fragment`。RFC 6901 定义了指向 JSON 文档具体值的字符串语法，并规定不存在值应产生解析错误；工厂应在发布前重新解析指针，解析失败即 `BLOCKED`，而不是把失效引用当作“已追踪”。对 Markdown／PDF 保存页码、标题锚点或稳定段落哈希，并同时保存原文片段的最小摘要。

### E. 按输入形态与风险选择测试设计方法

方法选择不是“每种都跑一遍”，而是 `test_object_shape × defect hypothesis × product risk × oracle feasibility × cost` 的决策。可编码为以下默认矩阵，并允许领域 owner 加严：

| 输入／行为形态 | 首选方法 | 适合暴露的缺陷 | 风险加严与边界 |
|---|---|---|---|
| 连续、有序或离散输入域 | 等价类（valid/invalid） | 类型、范围、分类处理错误 | 分区必须非空、不重叠；多个参数的 Each Choice 不覆盖交互组合 |
| 有序上下界、长度、时间、金额 | 边界值分析（2-value/3-value） | 上下界偏移、遗漏、错误比较符 | BVA 仅适用于有序分区；高风险可采用 3-value 或额外异常值 |
| 多条件、多结果、权限／费率／资格规则 | 决策表 | 组合遗漏、规则冲突、不可达／矛盾规则 | 条件多时组合数指数增长；删去不可行列并以风险决定是否全组合、最小化或降为 pairwise |
| 生命周期、会话、重试、锁定、审批 | 状态转换／状态表 | 非法转换、缺失 guard、错误副作用 | 同时覆盖有效转换和关键非法转换；一次只触发一个非法转换以减少 defect masking |
| 角色目标、端到端业务流程、验收场景 | 用例／场景测试 | 功能遗漏、交互和 handoff 错误 | 每个场景写前置、主／异常流、成功标准和回滚；需要与风险和接口条件连接 |
| 多参数配置、环境矩阵、交互风险 | 组合测试（pairwise、n-wise） | 参数交互失败 | pairwise 不是所有组合；高影响／安全关键场景提升 n-wise 或全组合，并记录不可行组合 |
| 已知实现控制流、代码路径、分支 | 白盒语句／分支覆盖 | 未执行分支、路径条件错误 | 不能发现规范遗漏；必须与需求／黑盒测试并用，且覆盖率不是质量充分条件 |
| 规范稀少、变化快、未知风险 | 探索式、错误猜测、检查表 | 新颖失败、历史缺陷、界面与数据异常 | 依赖技能和领域知识；用 charter、时间盒和 session notes 保留证据，不能伪装成可重复的完整规格覆盖 |
| 预期输出难以直接计算、非确定或 AI 生成 | 变形测试／性质测试／伪 oracle／人工 oracle | 关系不变量、单调性、约束违例、跨版本回归 | 先定义变换关系和允许差异；人工判定需抽样协议、一致性与升级路径 |

ISTQB CTFL v4.0.1 将黑盒、白盒和经验式技术区分开，并定义 EP、BVA、决策表、状态转换、错误猜测、探索式和检查表。ISTQB CTAL-TA v4.0（2025-05-01）进一步要求按测试目标、产品风险、测试基础、oracle 可得性、SDLC、知识技能、法规和项目约束选择并组合技术；这比“根据输入类型机械映射”更适合作为工厂协议。

### F. AI/LLM 测试预言（Oracle）与评测边界

#### F.1 Oracle 分层

将每个 AI 输出拆成独立的判定层，任何一层失败都不能被另一层掩盖：

1. **传输／完成层**：请求状态、超时、拒答、截断、重试、工具错误、模型／提示／参数版本。
2. **语法／Schema 层**：JSON 可解析、Schema 约束、字段类型／必填／枚举、额外字段策略。结构通过只说明“能被解析”，不说明字段值正确。
3. **来源／追踪层**：每个事实或规则有 source_ref；指针、页码、哈希和版本存在且指向原文；引用不存在或跨版本即失败／阻断。
4. **语义／业务层**：领域规则、不变量、状态转换、权限、金额、单位、时序、例外和副作用；由可执行规则、伪 oracle、参考答案、变形关系或领域 owner 判定。
5. **风险／安全／公平层**：越权、隐私泄漏、注入、危险建议、偏差、可解释性和失败安全；按照部署风险和法规加严。
6. **人机协同层**：哪些输出可自动接受、哪些必须人工批准、拒答／不确定如何升级、人工反馈如何进入后续评测。

OpenAI 的 Structured Outputs 文档是**供应商证据**：在没有拒答且生成未提前中断时，可保证符合给定 JSON Schema；同一文档明确提示，Schema 内的值仍可能错误。它支持 `refusal` 和提前中断处理，但不替代业务验证。该结论可用于 TD-P02 的“Schema 合规 ≠ 业务正确”门禁，不应推广成所有模型或所有 API 的普遍保证。

#### F.2 评测包的最小字段

```text
eval_manifest:
  scenario_id, intended_use, deployment_context
  dataset_version, source_lineage, split_policy, contamination_controls
  model/provider/version, prompt_hash, tool/config/version
  oracle_type (rule | reference | metamorphic | pseudo | human | hybrid)
  metrics: name, unit, aggregation, uncertainty, threshold_method, owner
  adversarial_cases, abstention/refusal_policy, human_escalation
  run_receipt: timestamp, environment, raw_outputs, scorer_version, exit_code
  limitations, residual_risk, supersedes
```

NIST AI RMF 1.0 的 Measure function要求在部署前和运行中测试 AI，并记录指标、方法、基准、测量不确定性和结果；NIST《Generative AI Profile》（AI 600-1，2024，网页 2026-04-08 更新）建议以已知 ground truth、多种自动／人工方法和 fact-checking 评估准确性、质量、可靠性与真实性，并进行定期 adversarial testing。它同时警告：为人设计的考试、轶事式试玩、单纯 jailbreak／prompt 测试或封闭 benchmark，不能保证部署语境中的有效性和可靠性；实验室与真实环境、提示敏感性和场景异质性会造成测量缺口。

因此，工厂必须把以下证据状态分开：

| 状态 | 可以声称 | 不可以声称 |
|---|---|---|
| `fixture-tested` | 固定输入、规则 oracle 和指定环境重现了该行为 | 真实模型能力、企业流行度、生产效果 |
| `model-integrated` | 指定模型／提示／参数在给定数据集上的结果 | 跨模型、跨版本或生产稳定性 |
| `integration-tested` | 目标 API／系统和权限在记录环境中回读成功 | 长期可用性、所有租户／区域覆盖 |
| `practitioner-reviewed` | 指定领域评审人审查了语义、风险和可用性 | 统计代表性或合规认证 |
| `production-validated` | 线上监控、告警、回滚和真实样本支持部署判断 | 未来版本、未覆盖场景和零风险 |

#### F.3 不确定或不可用 oracle 的处理

当没有可靠期望答案时，不得用 LLM 自己给自己打分来伪造确定性。优先顺序：

- 可计算业务性质（schema、范围、状态、不变量、引用存在性、幂等、权限）→ 规则 oracle；
- 有输入变换下应保持／改变的关系 → metamorphic/property oracle；
- 可独立实现且足够可信的简化模型或旧系统 → pseudo-oracle；
- 高风险、开放式、审美或事实整合输出 → 领域人工 oracle，记录评分量表、双评／抽样一致性、升级和复核；
- 仍无可接受 oracle → `UNKNOWN`／`BLOCKED`，先修订需求或定义评测设计。

ISTQB CTAL-TA v4.0 明确把 AI 的非确定性、概率行为、数据复杂度及缺失／歧义需求列为 test oracle problem 的来源，并列出 pseudo-oracle、模型化预期结果、断言和人工 oracle 等解决路径。这一条是测试设计边界，不是“LLM judge 总是可用”的许可。

## Official Docs Evidence

- [ISO/IEC/IEEE 29148:2018 — Requirements engineering](https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/20/72089.html) — 定义需求工程过程、信息项、内容和格式；ISO 页面显示 2018 第 2 版于 2024 复核后仍为当前版，但 2026-02-16 已进入待修订阶段。
- [ISO/IEC/IEEE 42010:2022 — Architecture description](https://www.iso.org/standard/74393.html) — 定义架构描述、viewpoint、framework、language 和 model kind 的结构要求；不规定架构方法、工具或实体本身的需求。
- [ISTQB CTFL Syllabus v4.0.1 (2024-09-15)](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) — test analysis 识别可测试特征并按风险排序；要求 Test Basis 与 testware、风险、结果和缺陷保持可追踪；定义 EP、BVA、决策表、状态转换、白盒和经验式技术。
- [ISTQB CTAL-TA Syllabus v4.0 GA (2025-05-01)](https://www.istqb.org/wp-content/uploads/sdm-uploads/ISTQB-CTAL-TA-Syllabus-v4.0-EN.pdf) — 要求评估 Test Basis、定义可追踪 test conditions、识别 oracle；按目标、风险、oracle、SDLC 和约束选择／组合测试技术；讨论组合测试、变形测试和 AI 非确定性的 oracle problem。
- [NASA Systems Engineering Handbook (NASA/SP-2016-6105)](https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf) — 需求元数据包括 ID、rationale、双向追踪、owner、验证方法和层级；要求需求与 stakeholder expectations、ConOps、假设、设计约束和可验证性一致。
- [NASA Software Engineering Handbook — SWE-051, Requirements Analysis](https://swehb.nasa.gov/spaces/SWEHBVD/pages/102695426/SWE-051%2BSoftware%2BRequirements%2BAnalysis?desktop=true&macroName=set-data) — 提供正确性、一致性、清晰性、完整性、追踪、可行性、可验证性、可维护性和安全关键性检查；要求父／子需求双向 flow-down。
- [NASA Software Engineering Handbook — SWE-050, Software Requirements](https://swehb.nasa.gov/spaces/SWEHBVB/pages/32604503/SWE-050%2BSoftware%2BRequirements) — 要求记录需求起源／basis、stakeholder expectations、风险、法规、技术和时间约束，以及 TBD/TBR 和数据库中的双向关系。
- [OpenAPI Specification v3.2.0](https://spec.openapis.org/oas/latest.html) — 提供机器可读、语言无关的 HTTP API 描述，可被文档、代码生成和测试工具消费；版本和 implementation-defined 行为必须显式处理。
- [RFC 6901 — JSON Pointer](https://www.rfc-editor.org/info/rfc6901/) — 标准化 JSON 文档内值的字符串定位语法；不存在值或非法指针应导致解析失败，应用必须定义错误处理。
- [JSON Schema Specification (current 2020-12)](https://json-schema.org/specification) 与 [Validation specification](https://json-schema.org/draft/2020-12/json-schema-validation.html) — Schema validation 断言 JSON 实例的结构约束并产生注释；结构验证不能自动替代业务语义判断。
- [NIST AI RMF 1.0 — Measure](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) — 要求部署前和运行中 TEVV，记录指标、方法、基准、不确定性、独立／领域专家输入和测量有效性。
- [NIST AI RMF: Generative AI Profile (AI 600-1)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) — 建议 ground truth、人工／自动复合评测、fact-checking、定期 adversarial testing；明确 benchmark 与现实部署、提示敏感性及场景异质性的边界。

## Version Note

- 检索基线是 2026-08-11。测试设计采用 **CTFL v4.0.1（2024-09-15）** 和 **CTAL-TA v4.0 GA（2025-05-01）**；旧版 CTFL v3.1、CTAL-TA v3.1 不应作为当前培训协议的唯一依据。
- **ISO/IEC/IEEE 29148:2018** 仍是 ISO 页面显示的当前发布版，但已在 2026-02-16 标记“待修订”；引用时保存版本和日期，禁止写成“永不变化的最新标准”。
- **ISO/IEC/IEEE 42010:2022** 已替代 2011 版；2011 页面仅作历史说明，不能作为现行版本主证据。
- **OpenAPI 3.2.0** 于 2025-09-19 发布；工具链若只支持 3.0/3.1，必须在 manifest 中声明兼容性和降级行为。
- **JSON Schema 当前规范页显示 2020-12**；不同 validator、OpenAPI dialect 和供应商 Structured Outputs 支持的子集可能不同，必须记录 dialect 与 validator 版本。
- NIST AI RMF 1.0 页面提示正在修订；AI 600-1 网页显示创建于 2024-07-26、更新于 2026-04-08。AI 评测协议应保留检索日期并允许后续迁移。
- OpenAI Structured Outputs（2024-08-06）是供应商文档，不是跨供应商标准。它的 schema adherence、`refusal` 和 incomplete 处理只适用于声明的 API／模型条件，不能外推到其他模型。

## Supporting Examples

### 1. 来源到契约的最小记录（示意）

```json
{
  "requirement_id": "REQ-042",
  "status": "ACCEPTED",
  "statement": "系统在已授权且余额足够时接受退款请求，并记录退款状态。",
  "source_refs": [
    {
      "artifact_id": "prd-2026-08",
      "version": "3.2.0",
      "content_hash": "sha256:...",
      "locator": "#/refund/authorization",
      "quote_hash": "sha256:..."
    }
  ],
  "test_basis_refs": ["DESIGN-REFUND-07", "RISK-REFUND-03"],
  "conditions": ["authorized=true", "balance>=amount"],
  "expected": {"status": "accepted", "side_effect": "refund_record_created"},
  "exceptions": ["unauthorized", "insufficient_balance", "timeout"],
  "verification": {"method": "test", "oracle": "rule+state_assertion"},
  "unknowns": [],
  "conflicts": []
}
```

若模型把 `refund_timeout_hours=24` 填入，但输入文档没有此字段或可定位来源，结构仍可能合法；引用存在性和业务 owner 门禁必须返回 `BLOCKED`，不能把 24 小时当作事实。

### 2. 方法选择示意

- `amount ∈ [0, 10000]`：EP 覆盖有效／无效分区，BVA 覆盖 -1、0、1、9999、10000、10001；高风险时增加精度、货币单位和溢出组合。
- `authorized ∧ balance_ok ∧ fraud_clear → action`：决策表覆盖可行规则，显式标记不可行组合和拒绝动作。
- `PENDING → APPROVED → SETTLED`，重试不能重复扣款：状态转换覆盖有效／非法转换，并以幂等断言检查副作用次数。
- LLM 从 PRD 抽取 `actor/trigger/NFR/source_refs`：Schema 断言字段形状；JSON Pointer 存在性断言来源；领域规则断言权限、金额、状态和副作用；人工 owner 复核未被规则表达的语义。

## Source-Reference Evidence

- [Stanford CRFM — HELM rationale and findings](https://crfm.stanford.edu/2022/11/17/helm.html)（上游研究，不是标准）：主张覆盖多个场景与多个指标，显式列出未覆盖场景；报告提示适配策略会显著改变结果，且部分任务需要人工评测。它支持“场景、指标、提示／适配和原始输出必须一起记录”的工程推论，但不替代项目领域验收。
- [OpenAI — Introducing Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/)（供应商来源）：说明拒答／提前中断处理和 JSON Schema adherence，同时承认 Schema 内值仍可能错误。它只支持本供应商 API 的条件性行为，不能充当通用 LLM 正确性证据。

## Caveats / Ambiguity Flags

- ISO 标准正文通常受版权和付费访问限制；本文件依赖官方公开 abstract／版本状态和 NASA、ISTQB 的公开实施指导，不声称逐条复现 ISO 正文。需要合规认证时，必须由组织取得并审阅授权版本。
- “Test Basis”在不同组织可能包含需求、用户故事、设计、风险、法规、接口或运行假设；工厂应允许显式配置 `artifact_type`，但必须保留来源、版本、追踪、风险和验证关系。
- 需求文档和技术设计中的自然语言可能互相冲突、重复或遗漏；模型只能提出候选冲突，不能单方面裁决责任、金额、权限、安全或法规。
- JSON Pointer 解决定位，不解决文档变更语义；数组重排、段落重写、生成式引用和未签名 URL 仍可能使锚点失效，故应保存哈希／版本并执行重开验证。
- LLM 输出不存在单一“正确率”足以代表业务质量。自动指标、LLM-as-judge、人工评分、参考答案和变形关系各有盲点；高风险场景需要组合 oracle、独立评审、现场反馈和残余风险记录。
- benchmark 分数不可直接外推到企业部署。NIST 明确指出实验室／benchmark、提示敏感性和真实场景异质性会造成测量缺口；Stanford HELM 也把未覆盖场景显式化。没有部署相似数据、版本和 workload 的实测，不得写成生产结论。
- 本文件未证明目标企业文档上的 LLM 抽取准确率、跨模型一致性、真实 Jira/GitLab/Kubernetes 等集成或从业者认可；这些保持 `UNKNOWN`，需要后续 `model-integrated`、`integration-tested` 或 `practitioner-reviewed` 证据。

## Reusable Takeaway

工厂应把 TD-P02 类课程实现为四层不可跳过的门禁：

`文档／设计基线与版本 → 需求契约与来源定位 → Test Basis 双向追踪与风险驱动设计 → 分层 oracle、运行收据与人工责任`。

Schema 通过只证明形状；Test Basis 追踪只证明关系；fixture 通过只证明固定环境可运行。只有引用、语义、风险、oracle、运行上下文和责任边界全部有证据，才可升级课程或系统的成熟度。
