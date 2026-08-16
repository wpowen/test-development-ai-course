# 两条路线裁决与 Factory Contract

**研究范围**：仅比较 `route-a-standards.md`（标准/官方 syllabus）与 `route-b-practice.md`（工程实践/失败面），并结合 2026-08-11 的项目状态。本文是研究 lane 到 factory lane 的接口；不修改 Skill、课程或验证器。

## 1. 裁决摘要

两条路线在核心原则上是一致的：先冻结带来源的 Test Basis，再抽取可测试契约；用风险、输入形态和 Oracle 可得性选择测试技术；把结构、来源、语义、安全和人工责任分层；拒答、截断、冲突和未知必须显式阻断；fixture、模型集成、真实集成、从业者评审和生产验证不能互相升级。

最终采用 **A 的证据与追踪骨架 + B 的可运行工件与故障注入**：

- 通用核心负责输入版本/hash、来源定位、Schema、状态、评测、运行收据、人工门禁和生命周期。
- 软件测试适配器负责 TestBasis、RequirementContract、风险、测试条件、方法、Oracle、测试层级、契约/状态/变形测试、mutation 与回归。
- 任一硬门禁失败即停止下游生成/发布；“结构通过”只能是 `PASS_SCHEMA`，不能写成语义或课程完成。

## 2. 一致、分歧与证据强弱

| 主题 | Route A（标准） | Route B（实践） | 裁决 |
|---|---|---|---|
| 输入基线 | `basis_manifest`、版本、hash、locator、owner、scope、冲突/未知 | `TestBasisPack` 冻结 PRD、技术方案、OpenAPI、状态、缺陷和敏感级别 | 合并为一个可复现 `InputBasisManifest`；字段不得静默丢失 |
| 需求与设计 | 需求是可观察结果/约束；设计是实现选择与权衡 | 设计映射接口、副作用、状态、依赖和历史缺陷 | 需求、设计声明、实现假设三种 claim 分型，不能相互自动升级 |
| 追踪 | source → requirement → risk → condition → case/data/env → oracle → result | 追加 review、运行收据、defect/decision 和回归 | 采用双向图；孤儿测试只能标 `EXPLORATORY`，不得算需求覆盖 |
| 技术选择 | 按输入形态×风险×Oracle×约束选 EP/BVA/决策表/状态/场景/组合/白盒/探索 | 给出可落地选择表和不可行组合/残余风险 | 采用选择记录，不按工具数量或用例数量判定质量 |
| AI Oracle | 传输、Schema、来源、语义、风险、人机六层 | 规则/伪Oracle/变形/人工混合，禁止模型自证 | 六层均保留；关键金额、权限、状态、副作用需独立规则或 owner |
| Prompt package | 评测 manifest 与模型/提示/数据版本 | 目录化包、raw output、重试、run manifest、review | 采用 B 的目录和 A 的证据字段/状态语义 |
| 失败处理 | UNKNOWN/BLOCKED/SUPERSEDED，不猜测 | REFUSED、INCOMPLETE、SCHEMA_INVALID、SOURCE_CONFLICT、UNSUPPORTED_RULE | 细粒度状态纳入通用枚举，并规定传播与停止语义 |
| 评测与负例 | ground truth、分割、部署语境、测量不确定性 | 正例/边界/冲突/缺失/越权/拒答/截断/变体、断言阈值 | 两者都必需；阈值由 owner 配置，公开资料不提供默认正确率 |
| 变异/故障 | 标准路线只提出回归与变更影响 | 提供 mutation/fault 示例和 killed/survived/no-coverage 语义 | 采用可插拔 mutation；survived 不自动等于产品缺陷 |

### 分歧与优先级

未发现会改变主协议的实质冲突。主要是粒度差异：A 偏向规范可追溯性与生命周期，B 偏向目录结构、CLI/断言和故障注入。若两者看似冲突，按以下优先级裁决：来源/安全/状态硬门禁 > 语义与独立 Oracle > 可运行性 > 便利性。B 中的工具能力、阈值和示例仅是适配器候选，不升级为行业标准或目标系统效果。

## 3. 证据分级、反证与 Unknown

### 证据强弱

1. **强证据**：ISO/IEC/IEEE 29148、42010，ISTQB CTFL/CTAL-TA，JSON Schema/JSON Pointer/OpenAPI，NIST AI RMF/GenAI Profile，OpenAI Structured Outputs/Evals 的官方条文；支持字段、追踪、Oracle、TEVV 和 API 失败分支。
2. **中等证据**：Pact、Schemathesis、Stryker、Promptfoo 官方文档/可审查实现；支持工件形状、契约/property/mutation/assertion 的可运行做法，不证明目标系统成效。
3. **项目推导**：双向图、分层状态、fail-closed、成熟度分级、最小目录和前向场景，是为可审计生产而作的工程综合，必须由项目 owner 接受并在验证器中落地。

### 反证/限制

- `PASS_SCHEMA` 只能证明可解析和结构符合；不能证明来源、业务语义、风险或副作用。
- 高行覆盖、mutation score 或契约通过，不能证明需求完整、provider 全功能或生产可靠。
- benchmark/fixture/单次试玩不能证明真实模型、企业 API、跨租户、生产或从业者效果。
- GitHub Models `.prompt.yml` 仅作历史形状参考（服务已于 2026-07-30 退役），不得作为当前依赖。

### 当前 Unknown（必须进入 manifest）

目标企业的文档优先级、审批责任、真实数据/权限、模型跨版本稳定性、提示注入抗性、成本/延迟、真实 Jira/GitLab/Kubernetes/浏览器/移动端/生产回读和从业者盲评均未被本研究运行验证。未知必须保持 `UNKNOWN` 或 `BLOCKED`，不能通过补写或 LLM 自评消除。

## 4. 通用核心 Factory Contract

### 4.1 运行顺序

```text
InputBasisManifest
 → EvidenceExtractionContract
 → TestabilityReview / OpenQuestions
 → RiskTechniqueDecision
 → OracleTestPackage
 → VersionedPromptPackage + ModelRunManifest
 → EvalSet + Graders
 → Mutation/Fault Injection
 → Human/Owner Gate
 → maturity status
```

下游只能消费上一步为 `PASS_*` 且无阻断状态的工件。

### 4.2 必需 Schema（最小字段）

**InputBasisManifest**：`baseline_id`、`artifact_id`、`artifact_type`、`version`、`effective_at`、`content_hash`、`source_uri`、`locator`（页/段/JSON Pointer/$ref）、`authority`、`owner`、`scope`、`supersedes`、`assumptions`、`unknowns`、`risk_refs`、`sensitivity`。

**RequirementContract / DesignClaim**：`id`、`kind`、`source_refs[]`、`actor`、`trigger`、`preconditions`、`inputs`、`observable_outcomes`、`states/transitions`、`invariants`、`exceptions`、`nfr`（单位/阈值/负载）、`constraints`、`owner`、`verification_methods[]`、`risk_refs[]`、`uncertainty`、`status`、`version`。没有可解析 `source_refs` 的规则不得为 `ACCEPTED`；设计实现假设必须显式标记。

**TestCondition / TestCase / Oracle / Result**：分别包含 `requirement_refs`、`risk_refs`、`technique`、`test_level`、`actions`、`data`、`environment`、`cleanup`、`oracle_id`、`pass_fail_rule`、`evidence_refs`、`run_id`、`actual_status`、`defect_or_decision`、`supersedes`。

**PromptPackage**：`package_id/version/purpose/authority`、prompt 模板/hash、输入夹具/hash、output Schema/hash、模型/provider/version、参数/seed（如有）、工具权限、隐私级别、eval_set_id、expected_statuses、stop_states、review owner。

**EvalManifest / RunManifest**：`scenario_id`、用途/部署语境、数据版本/来源/切分/污染控制、模型/提示/工具版本、`oracle_type`、指标/单位/聚合/不确定性/阈值方法/owner、对抗例、拒答策略、时间/环境、raw outputs、scorer 版本、输入/输出 hash、重试、日志、限制、残余风险、`supersedes`。

**ReviewQuestion**：`question_id`、`type`、`requirement_refs`、`source_refs`、`impact`、`risk`、`owner_needed`、`block_level`、`close_with`、`status`；涉及金额、权限、状态、合规、发布 Oracle 的未关闭问题为 `RELEASE_BLOCKER`。

### 4.3 状态与传播

通用状态至少包括：`NOT_RUN`、`PASS_SCHEMA`、`SCHEMA_INVALID`、`REFUSED`、`INCOMPLETE`、`UNSUPPORTED_RULE`、`SOURCE_CONFLICT`、`SEMANTIC_UNKNOWN`、`BLOCKED`、`PASS_SEMANTIC`、`FAIL`、`SUPERSEDED`，以及成熟度标签 `fixture-tested`、`model-integrated`、`integration-tested`、`practitioner-reviewed`、`production-validated`。

- `SCHEMA_INVALID`：保存原始输出，可受控重试；禁止静默裁剪。
- `REFUSED`：保存拒答原因和 hash；不得变成空数组或 UNKNOWN 假完成。
- `INCOMPLETE`：标记未运行/阻断；不得解析半个契约。
- `SOURCE_CONFLICT`：生成 review question，等待 owner；不得自动按“较新/较合理”覆盖。
- `UNSUPPORTED_RULE`：证据门禁阻断；不得补造引用。
- `SEMANTIC_UNKNOWN`：进入人工门禁或保持未知；不得生成下游测试/发布。
- 任何阻断状态向下游传播；旧结果只能变 `SUPERSEDED`，不可静默覆盖。

### 4.4 验证门禁（全部可判定）

1. 每份输入可重新打开、hash 与 locator 可复核；冲突、过期、TBD/TBR 显式列出。
2. 每个 `ACCEPTED` claim 至少一个真实 `source_ref`；每条高风险 claim 至少一个测试条件或有 owner 批准的例外。
3. 每个测试条件落到 case/data/environment/actions/oracle；每个结果有 pass/fail 规则和证据。
4. 正例、边界、冲突、缺失、越权、拒答、截断和变体均有评测样例；`unsupported_rule_leak_rate = 0`，冲突样例全部阻断。
5. raw output、finish/status、重试、日志、输入/输出/prompt/Schema/model hash 可回放。
6. Oracle 独立于被测模型/实现；关键语义由规则、伪 Oracle、变形关系或指定 owner 判定。
7. mutation/fault 的预期红绿可重现，记录 killed/survived/no-coverage/timeout；survived 必须有处置或残余风险。
8. 只有达到对应证据层，才能赋予成熟度标签；fixture 不能升级 live/practitioner/production。

## 5. 软件测试适配器

适配器将 PRD、技术方案、OpenAPI/事件 Schema、状态模型、术语表和历史缺陷映射到 `TestBasisPack → RequirementContract → ReviewQuestion → RiskTechniqueDecision → TestPackage`。默认方法：域/EP+BVA（数值边界）、决策表（条件组合）、状态/N-switch（生命周期与非法转换）、场景/CRUD（跨系统旅程）、契约/schema/property（OpenAPI/GraphQL）、metamorphic/property（难以直接求值）、白盒（已知控制流）、checklist/exploratory（规范不足）。每项记录覆盖标准、不可行组合、Oracle、成本和残余风险。

软件适配器的额外硬要求：

- 需求冲突在测试生成前 `BLOCKED`；设计选择不自动成为需求。
- 契约测试、单元/property、服务集成、E2E 和生产监控分层；不能只以浏览器或 HTTP 200 代替副作用、错误码、权限和事件回读。
- mutation 示例至少覆盖：删 `source_ref`、错状态码/权限 Oracle、无来源规则、放宽 prompt 约束、吞异常/自动 retry 丢结果/条件 skip。
- 每个 mutation 有 `mutation_id`、原始/变异版本、命中项、期望/实际状态、日志、修复版本和残余风险。

## 6. 前向测试场景（factory 必须预留）

| 场景 | 期望状态/门禁 |
|---|---|
| 完整 PRD + 可定位来源 + 合法 JSON | `PASS_SCHEMA` 后才进入来源/语义门禁 |
| PRD 与设计对同一错误码/状态冲突 | `SOURCE_CONFLICT`、`RELEASE_BLOCKER`，不生成测试 |
| 缺 SLA、权限、重试或 Oracle | `SEMANTIC_UNKNOWN`，要求 owner 关闭 |
| 模型新增未提供的金额/状态/规则 | `UNSUPPORTED_RULE`，泄漏率必须为 0 |
| refusal、安全拒答 | `REFUSED`，保存原始原因，不伪造结果 |
| token/响应截断 | `INCOMPLETE`，不解析半个契约 |
| source_ref 指针失效或 hash 不匹配 | `BLOCKED`，旧结果 `SUPERSEDED` |
| 重排、同义改写、中英文混合、重复段落 | 引用/状态不漂移；失败可归因 |
| 错 Oracle、吞异常、只断言 200、skip 条件 | mutation/fault 应变红并留 run receipt |
| 完成 fixture 后接真实 API/权限/浏览器 | 只能按新运行收据升级 `model-integrated`/`integration-tested` |

## 7. 停止条件与交接建议

停止条件：任一输入/来源/Schema/语义/安全/Oracle/人工责任门禁失败，或所需真实环境/权限/owner 缺失；状态写为 `BLOCKED`/`UNKNOWN`，不得继续生成或发布。解除条件是补齐证据、重跑受影响回归并保留新 run manifest，不能只改文字标签。

本裁决足以交给 factory lane 设计通用 Schema、状态传播和验证器变更；不支持把当前 TD-P02 或项目整课升级为 live、practitioner 或 production 完成。

## 8. 来源账本（本次只引用已读路线）

- `outputs/test-development-ai-v2/research/methodology/route-a-standards.md`：ISO/IEEE、ISTQB、NIST、JSON Schema/Pointer/OpenAPI 与 OpenAI 官方证据及通用协议。
- `outputs/test-development-ai-v2/research/methodology/route-b-practice.md`：工程目录、评测/失败状态、Promptfoo、Pact、Schemathesis、Stryker、mutation/fault 与适配器蓝图。
- `PROJECT.md`、`docs/PROJECT_STATUS.md`、`docs/TASK_MAP.md`：lane 隔离、成熟度边界、当前 release-blocked 状态与下一优先级。
