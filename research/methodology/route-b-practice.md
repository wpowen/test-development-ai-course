# 路线 B：实际工程工作流与失败面（Practice）

> 研究日期：2026-08-11（Asia/Shanghai）  
> 研究类型：综合研究（工程工作流、测试设计、AI 输出契约、评测与失败注入）  
> 适用对象：`TD-P01~TD-P08` 的工厂通用核心 + 软件测试适配器  
> 证据边界：以下是公开规范、官方文档、开源项目和公开工程工件的综合；不是目标企业实习、生产回放或从业者盲评。

## Request Type

Comprehensive research（需求到测试分析、测试方法选择、可测试性审查、Prompt package、结构化输出失败、评测集、负例、变异测试和审查提示词）。

## Version Note

本文按 2026-08-11 可访问资料整理。OpenAI Structured Outputs/Evals、Promptfoo、OWASP 页面可能随模型/API/风险版本变化；GitHub Models 资料已明确于 2026-07-30 退役，只作为历史工件形状参考。ISTQB CTAL-TA v4.0 GA 的发布日期为 2025-05-02；NIST AI 600-1 为 2024-07。凡目标系统、模型、工具或企业流程未被本次运行实测，均保持 `Unknown` 或 `BLOCKED`。

## 结论先行

路线 B 不应把课程做成“写一条提示词，然后让模型生成测试用例”。可复用的工程闭环应是两层、七个可审计工件：

```text
Authority/Input Pack
  -> Evidence Extraction Contract
  -> Testability Review + Open Questions
  -> Risk/Technique Decision
  -> Oracle/Test Package
  -> Versioned Prompt Package + Model Run Manifest
  -> Eval Set (positive/negative/refusal/incomplete)
  -> Mutation/Fault Injection + Human Review Gate
```

建议工厂提供通用核心：输入版本与引用、Schema/状态机、未知/冲突/拒答/不完整状态、评测数据与运行收据、追溯、负例和人工门禁；软件测试适配器只负责需求到测试的语义：test basis、风险、测试条件、Oracle、测试层级、测试技术、契约/接口/状态/变形测试、mutation 与回归集。

核心判断：

1. 结构化输出只解决“能否被程序解析”，不解决需求语义、证据支持或测试 Oracle；拒答和截断必须是显式状态，不能被当作空 JSON 或 PASS。
2. 测试方法选择必须从目标风险、测试依据、可得 Oracle、状态/规则/数据模型、生命周期和约束出发；不能按工具或“用例数量”选择。
3. Prompt package 是版本化工程输入，不是聊天记录。至少包含 prompt、输入模板/夹具、Schema、模型与参数、评测集、负例、预期拒答/不完整规则、运行命令、结果与审批。
4. “绿色”只有在独立 Oracle、负控制和变异/故障注入都有效时才有测试强度证据；fixture 绿不能升级为 live、production 或 practitioner 证据。

## Official Docs Evidence

官方证据的最小基线是 ISTQB（软件测试分析/设计/审查）、OpenAI（结构化输出与 Evals）、JSON Schema（结构验证）、NIST（AI 生命周期 TEVV/风险）和 OWASP（LLM 风险分类）。它们定义边界和可审计字段，不替代目标企业集成实测。

## 工程工作流重构

### 1. PRD/技术方案如何进入测试分析

**Evidence（官方）**：ISTQB CTAL Test Analyst v4.0（2025-05-02）规定 test analyst 从 test basis 产生时介入；入口条件包括范围/目标/方法清楚、test basis 已定义、产品风险已记录。分析阶段要检查 test basis 完整性、缺陷和可测试性，定义并按风险排序 test conditions，保持 test basis→test condition→test case 的追溯，并确定 Oracle、环境和数据需求。[ISTQB CTAL-TA v4.0 PDF](https://www.istqb.org/wp-content/uploads/sdm-uploads/ISTQB-CTAL-TA-Syllabus-v4.0-EN-4.pdf)

**Inference（可转为工厂协议）**：`TestBasisPack` 不应是“把所有文档塞进上下文”，而应冻结一次可复现的输入：`baseline_id`、每份文档版本/提交 SHA/哈希、段落或 JSON Pointer、owner、优先级、有效期、敏感等级、冲突列表和变更范围。只有引用坐标稳定，模型提取和后续回归才可复现。

**Software adapter**：把 `PRD`、技术方案、OpenAPI/事件 Schema、状态模型、术语表、历史缺陷映射到：

| 输入 | 测试分析工件 | 失败面 |
|---|---|---|
| 业务规则/验收标准 | requirement、actor、trigger、状态、例外 | 歧义、过期、互相冲突 |
| 技术方案/接口契约 | 可调用操作、响应/错误、依赖、副作用 | 只看 HTTP 200，漏事件/账本/权限 |
| 状态/流程/数据模型 | 状态转换、守卫、不可达/死锁、数据边界 | 缺状态、非法跳转、隐含前置 |
| 历史缺陷/事故 | 风险权重、回归集合、负例 | 只按文件改动选回归，漏业务影响 |

**Unknown**：公开资料无法证明任何公司的文档优先级、批准流程、真实数据脱敏策略或责任人；路线 B 的夹具只能模拟这些输入，不能冒充企业基线。

### 2. 测试设计方法如何选择

**Evidence（官方）**：ISTQB 明确把技术选择绑定到测试目标、产品风险、test basis、Oracle 难度、重复缺陷、测试者能力、SDLC、合同/监管和成本，并允许组合技术；风险越高可能需要全组合而非 pairwise，Oracle 难以导出时可用 metamorphic 或经验型方法。[ISTQB 选择技术章节](https://www.istqb.org/wp-content/uploads/sdm-uploads/ISTQB-CTAL-TA-Syllabus-v4.0-EN-4.pdf)

**可复用选择表（Inference，软件测试适配器）**：

| 观察到的风险/模型 | 首选方法 | 输出与门禁 |
|---|---|---|
| 数值、长度、额度、日期边界 | domain/等价类 + BVA | 分区、边界点、不可接受域、每项 Oracle |
| 多参数交互/组合爆炸 | combinatorial/pairwise；关键风险保留全组合 | 约束、覆盖标准、不可行组合、残余风险 |
| 有状态业务（订单、权限、会话） | state transition、N-switch、round-trip | 状态/事件/守卫/动作、非法转移和序列 Oracle |
| 条件组合决定动作 | decision table | 完整性、一致性、可行性、重叠检查 |
| 真实用户/跨系统旅程 | scenario/use-case、CRUD | 主流程、替代流程、异常流程、跨系统证据 |
| 同一输入变换后性质应保持 | metamorphic/property-based | 变形关系、源/跟随样例、关系 Oracle |
| 规范不完整或回归经验重要 | checklist、exploratory、session charter | 检查表版本、风险覆盖、发现与升级责任人 |
| OpenAPI/GraphQL 契约输入 | schema/property-based/contract | 可重现最小失败、请求/响应/Schema 证据 |

ISTQB 还指出模型化可在代码前暴露规范缺失、不一致、歧义、状态死锁、规则重叠和异常遗漏；这支持先做“需求可测试性审查”，再让模型生成测试工件，而不是直接生成 UI 脚本。

### 3. 可测试性审查与审查提示词

**Evidence（官方）**：ISTQB 的 review 技术包括 checklist-based、scenario-based、role-based 和 perspective-based review。Perspective-based review 要从不同角色尝试生成下游工件，检查 test basis 是否提供足够信息；checklist 应根据 test basis 类型、风险和历史漏项持续更新。[ISTQB review techniques](https://www.istqb.org/wp-content/uploads/sdm-uploads/ISTQB-CTAL-TA-Syllabus-v4.0-EN-4.pdf)

**Inference（提示词设计）**：审查 Agent 不应重写需求或替产品 owner 做决定。它应输出 `ReviewQuestion[]`，每项包括：`question_id`、`type`（ambiguity/conflict/missing-branch/unobservable/NFR/authority）、`requirement_refs`、`source_refs`、`impact`、`risk`、`owner_needed`、`block_level`、`close_with`、`status`。有 RELEASE_BLOCKER 就停止下游生成。

**可复用审查提示词（示意，须落为版本化文件）**：

```text
角色：需求可测试性审查员。只发现问题，不重写规则、不猜测缺失值、不生成测试代码。
输入：BaselineManifest、带 source_ref 的 PRD/技术方案/OpenAPI/状态模型、RequirementContract。
逐项检查：来源冲突；缺失状态/分支/重试/幂等；不可观察的成功条件；副作用与权限；数据与 NFR；责任人和关闭条件。
输出：ReviewQuestion[]，每个问题必须带 source_refs、impact、owner_needed、block_level、close_with。
无法由输入证实的判断写 UNKNOWN；会改变金额、权限、状态、发布 Oracle 的问题标 RELEASE_BLOCKER。
不得把模型建议当作批准的业务规则；不得删除原始引用。
```

**Unknown**：公开标准没有规定“审查 Agent”必须使用哪一个模型或评分阈值；模型只能生成候选问题，关键语义仍需产品、研发、安全或数据 owner 关闭。

## Prompt package 的专业组成

### 证据基线

**Evidence（当前官方）**：OpenAI Structured Outputs 指南要求调用方定义 JSON Schema；同时明确模型可能因安全拒答或达到 token 上限而不能返回符合 Schema 的结果，调用方必须检查 refusal/incomplete 后再解析。指南还建议用 evals 选择更合适的 Schema；“解析成功”不等于业务语义正确。[OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

OpenAI Evals 文档把 eval 定义为数据源 Schema + testing criteria/graders；示例数据包含人工提供的 ground-truth 字段，运行记录包含模型、输入模板、数据文件、状态和结果统计。[OpenAI Evals](https://developers.openai.com/api/docs/guides/evals)

**公开工程工件（当前但非标准）**：Promptfoo 将每条测试表示为输入变量和 assertions，支持 `is-json`、`is-refusal`、自定义 Python/JavaScript、阈值、权重、元数据及 CSV/JSONL/Hugging Face 数据源；其 red-team 流程生成并执行对抗用例，运行标签可记录 CI run ID 和 Git SHA。[Promptfoo assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/)、[Promptfoo test cases](https://www.promptfoo.dev/docs/configuration/test-cases/)、[Promptfoo red-team configuration](https://www.promptfoo.dev/docs/red-team/configuration/)

**历史/失效证据（必须标注）**：GitHub Models 的 `.prompt.yml` 曾把 prompt、模型、参数、变量、testData 和 evaluators 放在仓库文件中，适合作为“专业 Prompt package 形状”的公开样例；但 GitHub 文档已注明该服务于 2026-07-30 退役，不能作为当前可执行依赖或“最新平台”证据。[GitHub Models 退役说明](https://docs.github.com/en/github-models)、[历史 prompt 文件结构](https://docs.github.com/en/github-models/use-github-models/storing-prompts-in-github-repositories)

### 工厂应要求的最小包

```text
prompt-package/
├── prompt.yaml|prompt.md          # system/developer/user 模板、权限、失败语义、版本
├── input-fixtures/                 # 脱敏 PRD/技术方案/Schema、source_ref 与 hash
├── output-schema.json              # JSON Schema 版本、枚举、必填与禁止字段
├── model-manifest.json             # provider/model/version、参数、工具、时间、凭证边界
├── eval-set.jsonl                  # 正例、边界、冲突、缺失、注入、语言/格式变体
├── expected/                       # ground truth、允许差异、Oracle、人工标签
├── failure-cases/                  # refusal、incomplete、schema-invalid、unsupported-rule
├── run.sh / run.py                 # 固定工作目录、依赖、命令、退出码
├── run-manifest.json               # 输入/提示词/Schema/模型/输出 hash、状态、日志
└── review.md                       # 结构/语义/安全/职业 owner 审查与残余风险
```

**通用核心字段**：`package_id`、`version`、`purpose`、`authority`、`input_refs`、`prompt_hash`、`schema_hash`、`model_manifest`、`temperature/seed`（若支持）、`tool_permissions`、`privacy_class`、`expected_statuses`、`eval_set_id`、`human_gate`、`stop_states`。

**软件测试适配器字段**：`test_basis_refs`、`requirement_ids`、`risk_ids`、`test_conditions`、`technique`、`test_level`、`oracle_ids`、`fixture`、`actions`、`cleanup`、`traceability_index`、`mutation_plan`。

## 结构化输出与失败状态

### 必须分开的状态

| 状态 | 触发 | 处理 | 不能做的事 |
|---|---|---|---|
| `PASS_SCHEMA` | JSON 可解析且符合 Schema | 进入 source_ref/语义门禁 | 不能宣称规则正确 |
| `SCHEMA_INVALID` | 缺字段、类型/枚举/额外字段错误 | 记录原始输出，允许受控重试 | 不能静默修剪成合法结果 |
| `REFUSED` | API 返回 refusal/拒答 | 保存拒答原因和输入 hash，升级或换安全路径 | 不能当空数组或 UNKNOWN 伪造完成 |
| `INCOMPLETE` | finish reason/response status 表示长度或 token 截断 | 标记 NOT_RUN/BLOCKED，补预算或拆分输入 | 不能解析半个契约 |
| `UNSUPPORTED_RULE` | 字段无 source_ref 或越权新增规则 | 证据门禁 BLOCKED | 不能让模型自行补引用 |
| `SOURCE_CONFLICT` | 有效来源对同一语义相冲突 | 生成 ReviewQuestion，等待 owner | 不能按“较新/较合理”自动覆盖 |
| `SEMANTIC_UNKNOWN` | Schema 合法但 Oracle/语义未确认 | 进入人工门禁或保持 UNKNOWN | 不能进入测试生成/发布 |

**Evidence**：OpenAI 官方明确 refusal 不一定遵循 response_format，达到上限会 incomplete；JSON Schema 规范定义文档验证语义，但不能为业务规则提供真值。[OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)、[JSON Schema 2020-12 Core](https://json-schema.org/draft/2020-12/json-schema-core)

**Inference**：验证器需要保留 raw response、finish/status、错误、重试次数和每次输入 hash；“重试后成功”不能覆盖第一次拒答/截断。对于关键金额、权限、状态、副作用，必须有独立 Oracle 或人工 owner。

## 评测集、负例与审查

### 评测集分层

1. **正例**：文档定义完整、来源可定位、输出可接受。
2. **边界例**：长度/金额/日期/枚举边界、状态前后、可选字段、空输入。
3. **冲突例**：PRD 与技术方案对同一状态或错误码相反，预期 `SOURCE_CONFLICT/BLOCKED`。
4. **缺失例**：缺少 SLA、权限、重试、观察 Oracle，预期 `SEMANTIC_UNKNOWN`。
5. **负例/越权**：要求模型发明规则、补充未提供金额或状态，预期拒绝补写并输出 unknown。
6. **拒答/安全例**：输入含敏感/危险请求，预期 `REFUSED` 或安全分支。
7. **不完整例**：限制输出预算或人为截断，预期 `INCOMPLETE`，不得生成下游工件。
8. **变体例**：重排段落、同义改写、中英文混合、格式噪声、重复段落，验证引用和状态不漂移。

OpenAI 的 Evals 示例要求数据集包含输入与人工 ground truth，再用 grader 比较输出；Promptfoo 的 `__expected`/assertions 和元数据支持把每条负例绑定检查类型。这里的 ground truth 应是“允许的状态和关键字段/引用”，不是要求模型输出一字不差的长文本。

### 评测门禁

```text
schema_valid_rate >= 目标值（仅结构指标）
source_ref_precision/recall = 引用是否真实且覆盖关键规则
conflict_block_rate = 冲突样例是否全部阻断
unsupported_rule_leak_rate = 越权规则进入 ACCEPTED 的比例，必须为 0
refusal/incomplete_handling = 状态正确传播，不得静默 PASS
oracle_independence = 期望结果不由被测实现或同一模型自证
human_review_sample = 关键金额/权限/状态按风险抽样复核
```

**Unknown/反证**：没有公开统一阈值能保证企业需求抽取正确；高 Schema 合规率也可能伴随语义错配。模型、参数、输入分布变化后必须重跑评测，旧结果不能自动继承。

## 变异测试与故障注入

### 软件测试证据

**Evidence（开源工具官方文档）**：Stryker 通过修改代码后执行测试；至少一个测试失败即 mutant killed，全部通过则 survived。报告区分 killed、survived、no coverage、timeout、runtime/compile error，并定义 mutation score；因此 mutation score 不是代码覆盖率，也不能掩盖未覆盖 mutant。[Stryker mutation testing](https://stryker-mutator.io/docs/)、[Stryker mutant states and metrics](https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/)

**Inference（路线 B 实验）**：TD-P02 不能只删除 `source_ref` 做静态证据门禁；还应至少做：

- 需求契约 mutation：删除关键引用、改状态、增无来源 `refund_timeout_hours`；预期契约门禁变红。
- 测试 Oracle mutation：把 `SHIPPED -> 409` 改为 `202`、取消权限改成允许；预期测试失败并保存 `mutation_id`。
- Prompt mutation：删掉“不得推断/冲突 BLOCKED/不生成测试”限制，预期 eval-set 发现越权或冲突漏报。
- 断言/适配器 fault injection：吞异常、只断言 HTTP 200、自动 retry 后丢中间结果、条件 skip；预期静态审查或负例门禁失败。

每个 mutation 要保存原始版本、变异描述、命中测试/评测项、期望状态、实际状态、日志、修复版本和残余风险。Stryker 的 `survived` 不是“产品缺陷”，而是“现有测试没有检测到该变异”；需由测试 owner 判断是否补测试、接受等价变异或记录限制。

## 适配器蓝图：通用核心 vs 软件测试

| 能力 | 工厂通用核心 | 软件测试适配器 |
|---|---|---|
| 输入冻结 | manifest、版本、hash、敏感等级、引用坐标 | PRD/技术方案/OpenAPI/状态/缺陷 |
| 输出契约 | JSON Schema、状态枚举、raw output | RequirementContract、ReviewQuestion |
| 方法选择 | 风险/约束/Oracle 选择接口 | domain/BVA、decision/state/scenario/contract/metamorphic |
| 评测 | 正/负/拒答/截断/变体、grader、运行收据 | 规则引用准确度、测试条件覆盖、Oracle 独立性 |
| 失败注入 | 可插拔 mutation、fault、reset | 无来源规则、错状态码、错 Oracle、假绿测试 |
| 人工门禁 | owner、block_level、close_with、残余风险 | 产品/研发/安全/测试架构师审批 |
| 证据状态 | `NOT_RUN/BLOCKED/UNKNOWN/PASS/FAIL/SUPERSEDED` | `PASS_SCHEMA` 与 `PASS_SEMANTIC` 分离，fixture/live/practitioner 分层 |

## Source-Reference Evidence

Pact、Schemathesis、Stryker 与 Promptfoo 是开源/上游实现证据，用于把标准转成可运行的契约、性质测试、mutation、断言和 red-team 工件；它们的工具能力和项目方声明不能被写成目标系统效果。

## 公开来源与证据账本

访问日期均为 2026-08-11；“官方/上游”与“补充开源实现”分开。竞品课程未用于效果证明。

### 官方规范与文档

1. [ISTQB CTAL-TA Syllabus v4.0 GA（2025-05-02）](https://www.istqb.org/wp-content/uploads/sdm-uploads/ISTQB-CTAL-TA-Syllabus-v4.0-EN-4.pdf) — **Evidence**：test analysis/design/implementation/execution、追溯、Oracle、风险导向、方法选择、review、模型化；**Boundary**：教学大纲，不是企业流程执行收据。
2. [OpenAI Structured model outputs](https://developers.openai.com/api/docs/guides/structured-outputs) — **Evidence**：Schema 约束、Schema 设计建议、refusal/incomplete 分支；**Boundary**：OpenAI API 行为，不能外推其他提供商。
3. [OpenAI Evals](https://developers.openai.com/api/docs/guides/evals) — **Evidence**：数据源 Schema、人工 ground truth、grader、运行状态/结果；**Boundary**：OpenAI Evals 接口，不等于评测质量自动成立。
4. [JSON Schema 2020-12 Core](https://json-schema.org/draft/2020-12/json-schema-core) — **Evidence**：JSON 文档验证基础；**Boundary**：不定义业务语义 Oracle。
5. [NIST AI RMF Generative AI Profile（AI 600-1，2024-07）](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) — **Evidence**：跨生命周期风险、预部署测试、人工监督、错误/near-miss 记录；**Boundary**：自愿性跨行业框架，非课程验收阈值。
6. [NIST AI Resource Center](https://airc.nist.gov/) — **Evidence**：TEVV（测试、评估、验证、确认）资源入口，AI RMF 1.0 正在修订；**Boundary**：页面提示版本会变化。
7. [OWASP GenAI LLM Top 10（2025 页面）](https://genai.owasp.org/llm-top-10/) — **Evidence**：Prompt Injection、Improper Output Handling、Excessive Agency、Misinformation、Unbounded Consumption 等风险面；**Boundary**：安全风险分类，不是业务准确率证明。

### 上游/开源工程工件

8. [Pact Consumer Tests](https://docs.pact.io/consumer) — **Evidence**：consumer/provider 共享具体交互契约；强调每个测试一个交互、测试只断言 consumer 真正依赖的行为；**Boundary**：契约测试不是 provider 功能测试。
9. [Schemathesis](https://schemathesis.readthedocs.io/en/stable/) — **Evidence**：从 OpenAPI/GraphQL 生成 property-based 测试、边界输入、最小可复现请求、JUnit/HAR 输出；**Boundary**：工具能力不等于目标 API 已运行。
10. [Stryker mutation testing](https://stryker-mutator.io/docs/) 与 [mutant states/metrics](https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/) — **Evidence**：killed/survived/no coverage/timeout、mutation score 语义；**Boundary**：实现语言/测试 runner 适配另行验证。
11. [Promptfoo assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/) — **Evidence**：assertion、阈值、权重、is-json/is-refusal、自定义代码；**Boundary**：第三方工具文档，分数需自己定义含义。
12. [Promptfoo test cases](https://www.promptfoo.dev/docs/configuration/test-cases/) — **Evidence**：CSV/JSONL、expected、metadata、多个断言和数据字段；**Boundary**：公开项目能力，不是行业标准。
13. [Promptfoo red-team configuration](https://www.promptfoo.dev/docs/red-team/configuration/) — **Evidence**：生成/执行对抗用例、标签化 CI 收据、外部数据集；**Boundary**：安全扫描结果不能替代完整业务评测。
14. [Promptfoo GitHub repository](https://github.com/promptfoo/promptfoo) — **Evidence**：可审查的 CLI/配置/CI 实现；**Boundary**：仓库说明和 stars 不是效果证明，选用时仍需固定 commit 并运行 smoke。

## Caveats / Ambiguity Flags

以下反证和未知会阻断“完整课程/生产就绪”措辞：

- **结构 ≠ 语义**：OpenAI Structured Outputs 只保证符合 Schema 的路径（且 refusal/incomplete 例外）；ISTQB 的 Oracle 问题明确指出非确定性、概率行为和缺失需求会使 Oracle 难以获得。课程不能把 JSON parse PASS 写成“需求正确”。
- **覆盖 ≠ 测试强度**：Stryker 报告区分 no coverage/survived；高行覆盖可能仍有 surviving mutants。mutation score 也不等于真实缺陷发现率。
- **契约 ≠ provider 功能**：Pact 明确 consumer contract 只验证 consumer 依赖的请求/响应，不负责证明 provider 的全部业务规则；这正好要求 TD-P06 分离契约、集成和 E2E。
- **工具宣传 ≠ 生产能力**：Schemathesis 的“首轮发现生产常见 bug”等描述属于项目方声明，不能在课程中当作目标系统实测；必须用自己的 run receipt。
- **安全分类 ≠ 风险已缓解**：OWASP 风险条目提供测试面，不提供目标系统的通过阈值或完整防御证明。
- **GitHub Models 资料已过期**：`.prompt.yml` 结构仍可作为历史工件形状参考，但服务于 2026-07-30 退役，不能写进当前依赖、运行命令或“最新最佳实践”。
- **企业流程未知**：公开资料无法证实目标组织的 PRD 审批、真实数据、Jira/GitLab 权限、模型提供商、告警/回滚或从业者接受标准；这些仍应标 `UNKNOWN/BLOCKED`。

## 交付给 factory 的最小验收清单

### 通用核心

- [ ] 每次 run 有固定工作目录、版本/hash、输入/输出/提示词/Schema/model manifest。
- [ ] `REFUSED`、`INCOMPLETE`、`SCHEMA_INVALID`、`UNKNOWN`、`BLOCKED` 不会被序列化为 PASS。
- [ ] 正例、边界、冲突、缺失、越权、拒答、不完整和变体都在 eval-set 中。
- [ ] raw output、finish/status、重试、日志和 artifact hash 保留。
- [ ] 有独立 Oracle/人工 owner；模型不能用自身输出自证业务语义。
- [ ] 负例和 mutation 能稳定变红，修复后能 PASS；每次有 reset/cleanup。

### 软件测试适配器

- [ ] PRD/技术方案先形成 `TestBasisPack`，再形成 `RequirementContract`，再做可测试性审查。
- [ ] 每个 test condition/case 映射 requirement、risk、technique、level、Oracle 和 evidence。
- [ ] 方法选择写明风险、模型、Oracle、成本和残余风险，而不是按工具或数量。
- [ ] 契约、单元/属性、服务集成、E2E、生产监控边界清楚；不能把全套塞进浏览器。
- [ ] 需求冲突在生成测试前阻断；代码缺陷通过 mutation/fault injection 产生可归因 FAIL。
- [ ] fixture-tested、integration-tested、practitioner-reviewed、production-validated 仍是独立状态。

## Reusable takeaway

把路线 B 编成一个“证据先于生成”的课程：AI 负责候选提取、问题发现、风险/方法候选、测试包草稿和失败聚类；Schema、引用门禁、Oracle、评测集、负例、mutation、运行收据和责任人决定是否可继续。工厂通用核心管理状态、版本、证据和停止语义；软件测试适配器把它们连接到 test basis、风险导向方法、契约/状态/Oracle 与回归。当前公开证据支持这一设计，但不支持把 TD-P02 从 desk-researched/fixture-tested 升级为真实模型、真实系统或 practitioner 通过。
