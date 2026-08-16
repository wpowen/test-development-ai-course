# AI 时代接口自动化测试如何演进

## 研究结论

- **研究类型**：综合研究（契约、生成、属性/模糊、虚拟化、CI、AI 接口运行时）。
- **检索/核验日期**：2026-08-10（Asia/Shanghai）。
- **证据边界**：优先使用标准、官方规格、官方文档、官方 GitHub 仓库和论文；没有用社区帖子或营销页作为关键结论依据。
- **核心判断**：接口自动化测试不是“让 LLM 多写几条 HTTP 请求”，而是从“请求/响应样例”演进为“可执行契约 + 状态机/属性 + 事件流 + 受控副作用 + 可审计 CI 证据”。LLM 适合生成候选场景、边界值、属性和失败归因，但不能单独充当测试 oracle 或合并门禁。

## 一、演进主线

### 1. 从单接口断言到多种契约并存

OpenAPI 是机器可读的 HTTP 接口描述；当前公开的最新版本是 **OpenAPI 3.2.0（2025-09-19）**，同日发布 3.1.2。3.2.0 还明确了连续/流式媒体类型、`itemSchema`、SSE 和 `webhooks` 的描述方式。工具必须先声明自己支持的 OAS minor 版本和 JSON Schema dialect；不能把“能解析 OpenAPI”误写成“支持全部 OAS 3.2 语义”。

建议把“契约”拆成四类，而不是让一个文档承担所有保证：

| 契约 | 解决的问题 | 典型证据 | 不解决的问题 |
|---|---|---|---|
| OpenAPI/JSON Schema | 路径、参数、序列化、状态码、请求/响应形状 | schema validation、兼容性 diff、生成输入 | 消费者是否真的按约使用；复杂业务不变量 |
| Consumer-driven contract | 某个消费者实际依赖的请求/响应交互 | Pact consumer/provider verification | 未被消费者覆盖的 provider 行为 |
| AsyncAPI/CloudEvents | 消息、channel、事件 envelope、异步协议 | 消息 schema、发布/订阅/回调验证 | 端到端处理时序和业务副作用 |
| AI tool/model contract | 工具名、参数 JSON Schema、tool call/result 往返、结构化输出 | 事件序列、schema、调用次数、幂等账本 | 模型“是否聪明”、开放式文本质量的全部语义 |

Pact 官方文档明确区分：OAS 是描述资源所有可能状态的静态 artefact，而 Pact 是执行具体 request/response 对的“contract by example”；仅做 provider 对 OAS 的校验，不能保证消费者调用方式正确。因此成熟系统应组合“provider conformance + consumer contract”，不能二选一。

### 2. 从人工用例到规格驱动、属性驱动和状态驱动生成

生成器的能力阶梯大致如下：

1. 从 OAS examples 生成正向 smoke cases；
2. 从 schema 生成边界值、非法值、序列化变体和负向请求；
3. 从 response schema、`Location`、OpenAPI links 或运行时反馈推断 producer-consumer 依赖；
4. 生成操作序列，而非孤立请求；
5. 在可控字典、环境、权限和状态预算内做 fuzzing/search；
6. 由 LLM 从自然语言需求、错误日志和已有用例中补充场景、属性和测试 oracle 候选；
7. 所有候选都回到静态校验、真实执行、mutation/回归和确定性门禁。

Schemathesis 官方文档将 OpenAPI/GraphQL schema 转换为 property-based tests，并提供 pytest、GitHub Actions、JUnit XML、Allure 和 HAR 输出；其 stateful testing 依赖 OpenAPI links、response schema、`Location` 等关系。RESTler 官方仓库/论文则强调：从 OpenAPI 编译 grammar，推断 producer-consumer dependencies，依据服务响应动态学习状态，并按 compile → test → fuzz-lean → fuzz 的阶段执行。EvoMaster 代表另一条路线：用 evolutionary search 生成系统级 REST/GraphQL/RPC 测试，部分模式结合白盒信息。

这里的“AI 时代”变化不是替代这些生成器，而是把 LLM 放在它们之上：理解自然语言业务规则、补足描述缺失、提出候选依赖和场景，再让确定性生成器与运行结果筛选候选。

### 3. 从 response body 到状态转移和事件轨迹

对于普通 JSON API，测试对象通常是：

```text
request -> status/header/schema/business invariant -> response
```

对于 AI 接口、流式接口和异步接口，测试对象应改为：

```text
input
  -> accepted/queued/stream-open
  -> event_1 ... event_n
  -> tool call(s) / callback(s) / poll(s)
  -> terminal event or final resource
  -> side-effect ledger and cost/latency evidence
```

测试断言也从单一 body equality 改成：

- 事件类型是否符合允许的状态机；
- 每个 chunk/event 是否可单独解析，最终拼接结果是否符合 schema；
- 是否只出现一次终态，终态前后是否还有非法事件；
- `call_id`、tool name、arguments 和 tool result 是否一一对应；
- 重试、断线重连、取消、超时是否产生允许的状态转移；
- 外部副作用是否 exactly-once、at-most-once 或可幂等重放；
- 最终业务不变量是否成立，而不是把开放式文本当作精确字符串。

## 二、权威规格与版本边界

### 官方规格/标准

- [OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html) — 2025-09-19 发布；定义 HTTP API 描述、`webhooks`、连续/流式媒体类型和 SSE 的 `itemSchema`。截至本研究日，官方版本索引将 3.2.0 列为最新发布版，并同时列出 3.1.2。
- [OpenAPI Specification version index](https://spec.openapis.org/oas/) — 说明同一 minor 版本的 patch 版本共享 schema iteration；schema 与规范正文冲突时以规范正文为准。
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12) — 当前公开规范版本；OAS 3.1/3.2 的 Schema Object 仍需按具体 OAS dialect 解释，不能简单假设所有 JSON Schema keyword 都被每个工具实现。
- [AsyncAPI Specification 3.0.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0) — 描述消息驱动 API，协议无关，可覆盖 AMQP、MQTT、WebSocket、Kafka、HTTP、STOMP、Mercure 等。
- [CloudEvents specification](https://github.com/cloudevents/spec) — 事件 envelope 的标准化来源；若系统用 webhook/event bus，应把 `id`、`source`、`type`、`subject`、`time`、`data` 和重复投递语义纳入测试。
- [WHATWG Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html) — Living Standard；截至 2026-07-20 更新。规定 `text/event-stream`、UTF-8、逐行解析、空行 dispatch、`id`/`retry`/`Last-Event-ID`、断线重连和 `204` 停止重连等行为。
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) — 安全测试风险目录；至少应把对象级授权、资源消耗、业务流滥用、SSRF、错误配置和不安全 API 消费纳入 API gate 设计。

### 官方工具/仓库证据

- [Pact Introduction](https://docs.pact.io/) / [Pact consumer tests](https://docs.pact.io/consumer) — consumer-driven contract 的边界与使用方式。
- [Schemathesis documentation](https://schemathesis.readthedocs.io/en/stable/) / [stateful testing](https://schemathesis.readthedocs.io/en/latest/guides/stateful-testing/) / [GitHub repository](https://github.com/schemathesis/schemathesis) — schema-driven property/fuzz/stateful API testing；当前文档列出 OAS 2.0、3.0、3.1、3.2 支持，但仓库中仍应 pin 具体版本。
- [Microsoft RESTler repository](https://github.com/microsoft/restler-fuzzer) / [RESTler: Stateful REST API Fuzzing](https://www.microsoft.com/en-us/research/uploads/prod/2021/03/RESTler.pdf) — 状态化 REST fuzzing、依赖推断、grammar、checker、replay 和 fuzzing mode；论文明确其基础 HTTP-status oracle 覆盖有限。
- [EvoMaster repository](https://github.com/WebFuzzing/EvoMaster) / [EvoMaster paper](https://arxiv.org/abs/1901.04472) — evolutionary system-level generation；适合补充黑盒/白盒搜索，不等同于 OAS contract verification。
- [Hypothesis stateful testing](https://hypothesis.readthedocs.io/en/latest/stateful.html) — 规则式状态机生成整段操作序列；其官方建议简单场景不要滥用 stateful，而应从普通 property test 开始。
- [Prism](https://stoplight.io/open-source/prism) / [Prism GitHub](https://github.com/stoplightio/prism) — 从 OpenAPI 生成动态 mock、校验 request/response、支持 callback，并可做 validation proxy 检查实现与文档偏差。
- [WireMock documentation](https://wiremock.org/docs) / [record and playback](https://wiremock.org/docs/record-playback/) / [stateful behaviour](https://wiremock.org/docs/stateful-behaviour/) — HTTP mock、record/playback、故障/延迟注入和 scenario 状态机。
- [MockServer verification](https://www.mock-server.com/proxy/verification.html) — 可记录并验证 forwarded/mock 请求和响应、顺序、次数、异步到达和“在窗口内不得发生”的 negative verification。
- [Postman Newman CI](https://learning.postman.com/docs/reference/newman-cli/continuous-integration/) / [Newman CLI repository](https://github.com/postmanlabs/newman) — 以命令行运行 collection；可用退出码和 `--bail` 让 CI 失败。
- [Grafana k6 checks](https://grafana.com/docs/k6/latest/using-k6/checks/) / [k6 thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/) — checks 是观测，thresholds 才能让测试失败并返回非零退出码；适合把延迟、错误率、流式 TTFT/完成时间等变成门禁。
- [GitHub Actions required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks) — 保护分支要求的检查必须在 PR 和 merge queue (`merge_group`) 上都报告，路径过滤错误可能造成“等待未报告检查”的假阻塞。

### AI 接口官方文档

- [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling) — tool calling 是多步循环：请求工具定义 → 收到 tool call → 应用执行 → 回传 tool output → 得到最终响应或更多 tool calls；工具执行责任在应用侧。
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) — 结构化输出与 JSON Schema/`strict` 相关；测试仍必须对实际返回和拒答/截断路径做 schema 与业务验证。
- [OpenAI streaming](https://developers.openai.com/api/docs/guides/streaming-responses) — Responses API 使用 typed semantic events，并存在 function-call arguments delta/done 等事件；流式测试应按事件而非只收集最终字符串。
- [OpenAI background mode](https://developers.openai.com/api/docs/guides/background) — 长任务异步启动，应用轮询 response object 状态；测试要覆盖重试、超时、取消、终态和临时存储/可见性边界。
- [OpenAI evals](https://developers.openai.com/api/docs/guides/evals) — evals 以测试输入运行并分析结果，用于模型/提示升级回归；页面同时提示 Evals platform 的当前弃用时间线，因此应把 eval 数据与断言资产保存在仓库，不把在线平台当唯一证据。
- [Anthropic tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) — client tool 由应用执行；模型返回 `tool_use`，应用再回传对应 `tool_result`，并可控制并行 tool use。
- [Anthropic streaming](https://platform.claude.com/docs/en/build-with-claude/streaming) — SSE 事件流包含 `message_start`、content block start/delta/stop 等生命周期。
- [Gemini function calling](https://ai.google.dev/gemini-api/docs/function-calling) / [Gemini streaming](https://ai.google.dev/gemini-api/docs/streaming) — 工具参数可以以 partial arguments 流式到达，必须聚合完整参数后再执行；Interactions API 的 stream 使用 `step.start` → `step.delta` → `step.stop` → completed 的事件序列。
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output) — 结构化输出和 function calling 有不同用途；官方明确区分“最终格式约束”和“中间动作/工具调用”，且支持的 JSON Schema 是子集。

## 三、推荐架构

```text
                    ┌──────────────────────────────────┐
                    │  Contract source of truth         │
                    │  OpenAPI / JSON Schema / AsyncAPI  │
                    │  Pact / tool schema / event rules │
                    └─────────────────┬────────────────┘
                                      │ parse + lint + diff
                    ┌─────────────────▼────────────────┐
                    │  Contract compiler / test manifest │
                    │  operation graph + state graph      │
                    │  oracle catalog + safety policy     │
                    └───────┬──────────┬──────────┬──────┘
                            │          │          │
             ┌──────────────▼─┐  ┌────▼─────┐  ┌──▼────────────────┐
             │ Deterministic   │  │ Generated │  │ Runtime-special   │
             │ examples/Pact  │  │ PBT/fuzz   │  │ stream/async/tool  │
             │ smoke/compat   │  │ stateful   │  │ event reducers     │
             └──────┬──────────┘  └────┬─────┘  └──┬────────────────┘
                    │                  │           │
            ┌───────▼──────────────────▼───────────▼───────┐
            │  Controlled environment                         │
            │  SUT + Prism/WireMock/MockServer + data reset   │
            │  tool sandbox + side-effect ledger + webhook sink│
            └──────────────────────┬──────────────────────────┘
                                   │ evidence
                    ┌──────────────▼────────────────────────┐
                    │ CI gates                                │
                    │ spec → diff → contract → smoke → fuzz  │
                    │ → stream/async/tool → security/perf    │
                    │ artifacts, replay, provenance, exit code│
                    └─────────────────────────────────────────┘

        LLM assist plane (旁路，不直接拥有 merge 权限)
        requirements/logs/spec → candidate cases/properties/oracles
        → schema validation → sandbox execution → mutation/review
        → only accepted artifacts enter deterministic gates
```

### 组件职责

1. **Contract source**：只放可版本控制的接口事实。每个 operation 需要 operationId、鉴权、前置数据、成功/失败响应、幂等语义、可观察副作用和敏感数据分类。
2. **Manifest/compiler**：把多个规格规范化为统一 manifest；生成 operation graph、producer-consumer edges、允许的事件序列、oracle ID、预算和 side-effect policy。不要让每个测试脚本自行解释 OAS。
3. **Oracle catalog**：把断言分为 schema oracle、protocol oracle、business invariant、security oracle、resource oracle 和 side-effect oracle。LLM 生成的 oracle 必须标记 `candidate`，经过人工/规则确认才可升级为 `required`。
4. **Test engines**：确定性 examples/Pact 负责快速反馈；Schemathesis/Hypothesis 负责属性/状态；RESTler/EvoMaster 负责更深的序列/搜索；Newman/k6 负责 collection/performance；专门的 event reducer 负责 streaming/async/tool。
5. **Virtualization**：Prism 用于 contract-first mock/validation proxy；WireMock/MockServer 用于状态、记录回放、延迟/故障、请求/响应验证。任何 record/replay fixture 都要有来源时间、版本和失效策略。
6. **LLM assist plane**：只读入被批准的 spec、需求、历史失败和脱敏日志；输出候选 JSON manifest/测试代码/属性/triage，不得直接调用生产工具或带副作用的真实 endpoint。
7. **Evidence store**：每次运行保存 commit、spec hash、tool/model/version、seed、environment image、trace/event log、request/response hash、失败 replay 和 gate result。没有这些元数据的“通过”不算可复现通过。

## 四、适用边界与关键取舍

### OpenAPI/契约测试

**适合**：API-first、微服务、前后端并行、版本兼容性和文档/实现一致性。OAS 3.2.0 对流式内容和 webhook 描述更完整，但工具生态可能仍主要支持 3.0/3.1；应以真实工具版本的 support matrix 和本地 fixture 为准。

**不适合单独承担**：权限业务规则、跨资源不变量、消费者真实使用方式、最终模型质量。OAS schema 通过不等于“库存扣减正确”；Pact provider 通过也不等于所有消费者都被覆盖。

**推荐**：provider 侧执行 OAS conformance；消费者侧维护 Pact；对 breaking change 分级：文档/可选字段、请求必填、响应删字段、状态码、鉴权、幂等、事件 schema 分别定义门禁。

### API 测试生成、属性与模糊

**适合**：参数空间大、边界值多、错误处理不完整、状态序列容易遗漏、需要低人工成本发现 500/校验绕过/响应违规。

**不适合直接跑生产**：RESTler 官方文档警告 fuzz 可能造成资源泄漏、性能退化或 backend corruption；必须使用隔离租户、短 TTL、数据库 reset、速率预算、破坏性 endpoint allowlist 和 kill switch。

**oracle 边界**：状态码/JSON schema 是低成本 oracle，但不能发现所有逻辑、安全和信息泄露问题。RESTler 论文明确指出简单 HTTP status oracle 的可见性有限；需要叠加不变量、差分结果、审计日志、资源计数和安全策略。

### 服务虚拟化

**适合**：外部依赖不稳定、成本高、尚未上线、不可控故障难以触发、需要确定性 CI。

**不适合替代真实集成**：mock 可能与真实 provider 漂移；record/replay 可能掩盖鉴权、限流、schema 演进和真实时序问题。建议“虚拟化常态 + 低频真实 canary”，并通过 Prism validation proxy、Pact provider verify、定期录制校验对漂移设门禁。

### LLM 辅助用例

论文 [RESTestBench](https://arxiv.org/abs/2604.25862) 研究从自然语言需求生成 REST API 测试并提出用运行反馈 refinement；[Test Amplification for REST APIs via Single and Multi-Agent LLM Systems](https://arxiv.org/abs/2504.08113) 研究用单/多 agent 扩增已有测试。它们说明研究方向活跃，不构成“生产中 LLM 生成用例必然更好”的证明。

LLM 的合适职责：

- 将自然语言需求映射为候选操作、前置条件和不变量；
- 从 schema/错误日志提出边界组合和缺失状态；
- 把失败 trace 聚类并生成最小复现描述；
- 生成测试代码草稿、mock 场景、mutation 候选；
- 为不确定的开放式输出生成候选 rubric，但最终 rubric 需固定版本并可回放。

LLM 的不合适职责：

- 直接决定“通过/失败”而不提供可执行证据；
- 直接执行生产副作用工具；
- 把文本相似度当作业务正确性；
- 生成没有 spec hash、model/version、prompt 和 seed 的不可审计测试；
- 在 CI 中无限自我修复直到变绿，掩盖真实缺陷。

## 五、AI 接口专项测试设计

### 1. 流式 SSE

把 stream 作为协议状态机实现，而不是 `await response.text()`：

```text
CONNECTING → OPEN
OPEN → event_start → delta* → event_stop
OPEN → terminal → CLOSED
OPEN → transport_error → reconnect or CLOSED
```

至少覆盖：

- `Content-Type: text/event-stream`、UTF-8、CRLF/LF/CR；
- comments、`event`、多行 `data`、空行 dispatch；
- partial UTF-8/JSON chunk、chunk 边界任意切分；
- `id`、`retry`、`Last-Event-ID` 和断线重连；
- server 在未闭合事件时 EOF（WHATWG 规定未完成事件不得 dispatch）；
- 流式结构化输出逐块解析与最终 schema 验证；
- function-call arguments delta 的聚合、JSON parse、tool call 完结事件；
- 取消、客户端断开、代理缓冲、心跳和 terminal event 唯一性。

OpenAPI 3.2.0 指出完整 `schema` 需要把内容整体读入，而 `itemSchema` 可以逐项验证流式序列；WHATWG SSE 规定具体 wire parser。因此用例 oracle 应分成“wire parser”“per-event schema”“whole-stream state”“final business result”四层。

### 2. 异步任务、轮询和 webhook

对 `202 Accepted` 或 background task 建模为：

```text
submit(idempotency_key) → accepted(task_id)
  → poll(status) *
  → {running | succeeded(resource) | failed(error) | cancelled}
```

并行 webhook 时增加：

```text
submit → webhook delivery 0..n → ack/retry → final resource
```

测试：重复 submit、同一 idempotency key、乱序 webhook、重复 webhook、签名失败、超时重试、poll 404/429/5xx、任务取消竞态、最终资源可见性、任务终态不会回退。用 fake clock、可控队列和 webhook sink，不能在 CI 等待真实分钟级任务。

### 3. Tool/function calling

把一次“回答”拆成可审计的多轮协议：

```text
model output: tool_call(call_id, name, arguments)
→ schema/auth/policy validation
→ sandbox tool execution
→ tool_result(call_id, result/error)
→ model final output or more tool_call
```

必须验证：未知工具、错误工具名、缺失/额外/错误类型参数、超大参数、重复 `call_id`、并行调用、工具失败回传、工具结果污染、模型在未授权时调用 destructive tool、取消/重试导致的副作用次数、结果与调用 ID 的关联、最终输出 schema。工具执行器要有 allowlist、租户隔离、超时、预算、审计日志、幂等键和 dry-run/transactional fake。

OpenAI、Anthropic、Gemini 的官方文档都把工具执行责任放在应用或明确的服务侧，并要求把 tool result 带回后继续循环；这意味着接口测试的 oracle 不能只检查最终自然语言，而应检查完整 tool-call trace。

## 六、端到端 SOP

### Phase 0：冻结基线

1. 固定 OAS/AsyncAPI/JSON Schema dialect、工具版本、容器 digest、运行时版本、模型 provider/version 和测试数据版本。
2. 生成 `manifest.json`：spec hash、operation IDs、state links、oracle IDs、风险等级、预算和 destructive allowlist。
3. 定义证据目录：`artifacts/spec/`、`artifacts/contract/`、`artifacts/fuzz/`、`artifacts/stream/`、`artifacts/async/`、`artifacts/tools/`、`artifacts/triage/`。

### Phase 1：先做确定性门禁

1. 解析/格式/lint/schema validation；发现无效 OAS 立即停止。
2. 做版本 diff：必填字段、响应删除、状态码/媒体类型、鉴权、webhook/event schema 和 idempotency 变化分级。
3. 跑 provider OAS conformance、Pact provider verification、固定 smoke cases。
4. 跑 Prism mock/validation proxy 与 WireMock/MockServer dependency scenarios，确认测试环境本身可用。

### Phase 2：生成与探索

1. 用 examples 生成 baseline，再用 Schemathesis/Hypothesis 生成 property/negative cases。
2. 对有 links/producer-consumer 的 API 开 stateful testing；对依赖未解析的 API 先补 OpenAPI links、字典或 fixture，不能假装已覆盖。
3. 用 RESTler/EvoMaster 做隔离环境深度探索；设置时长、请求数、序列深度、资源 TTL、端点 allowlist、并发和 stop condition。
4. 每个失败自动保存 seed、缩减后的序列、request/response、spec hash 和 replay command。

### Phase 3：LLM 辅助闭环

1. 输入仅限脱敏需求、批准的 spec、已有测试和失败 trace。
2. 要求 LLM 输出固定 JSON：`scenario_id`、`preconditions`、`steps`、`assertions`、`risk`、`source_refs`、`confidence`，禁止输出直接执行命令之外的自由文本作为唯一结果。
3. 对候选做 JSON Schema 校验、operationId 存在性校验、参数类型校验、权限/副作用 policy 校验和重复/等价用例去重。
4. 在 Prism/WireMock/MockServer + sandbox SUT 中运行；失败用运行错误回馈一次或有限次数 refinement。
5. 用 mutation、覆盖/状态 coverage、replay 和人工审核确认候选；只有确认后的用例才进入 required gate。

### Phase 4：专项运行时测试

1. stream parser 用任意 byte/event 边界切分进行 property test。
2. async runner 用 fake clock、可控 queue、webhook receiver 和状态模型测试竞态。
3. tool runner 用 deterministic fake tools、side-effect ledger 和权限 policy 测试调用循环。
4. 真实 provider 只做预算受控 canary；记录模型/version、temperature/seed（若支持）、输入 hash、输出事件和成本/延迟。

### Phase 5：CI 门禁与发布

建议门禁顺序：

```text
G0 spec parse/lint
  → G1 compatibility diff
  → G2 Pact/OAS/AsyncAPI contract
  → G3 deterministic smoke + virtualization
  → G4 bounded property/stateful/fuzz
  → G5 stream/async/tool protocol
  → G6 security/performance thresholds
  → G7 optional AI eval canary
```

任一必需门禁失败即停止；LLM 的“建议修复”只能生成 PR/工单，不得绕过失败门禁。GitHub Actions 保护分支还要为 `merge_group` 触发同一必需检查，避免 merge queue 获得错误的绿灯。

## 七、建议仓库脚本清单

以下是建议的 wrapper 名称；具体实现可以是 Python、Node、Go 或 shell，但脚本必须有固定退出码、版本打印、产物目录和 replay 参数。

| 脚本 | 最小职责 | 推荐实现/产物 |
|---|---|---|
| `api:spec:normalize` | 解析、bundle、canonicalize、输出 spec hash | OAS/AsyncAPI parser；`artifacts/spec/manifest.json` |
| `api:spec:lint` | 规范、命名、安全和 examples lint | OAS/AsyncAPI linter；JUnit/JSON report |
| `api:spec:diff` | 与 base commit 比较 breaking changes | schema-aware diff；change classification |
| `api:contract:pact` | consumer/provider verification | Pact runner；broker/本地 pact artifact |
| `api:contract:provider` | 实现对 OpenAPI/AsyncAPI 的 conformance | Prism proxy 或等价 validator；request/response report |
| `api:mock:prism` | 从 OAS 起 mock、动态例子、validation proxy | `prism mock` / `prism proxy`；mock logs |
| `api:mock:dependency` | 依赖 stub、record/replay、延迟/故障/state | WireMock 或 MockServer；scenario fixture |
| `api:test:examples` | 固定正/负向 smoke、鉴权和幂等样例 | pytest/JUnit/Newman；JUnit XML |
| `api:test:property` | schema-driven data generation 和 invariant checks | Schemathesis + Hypothesis；seed/replay |
| `api:test:stateful` | create→read→update→delete、links/资源依赖 | Schemathesis state machine / RESTler |
| `api:test:fuzz` | 限额 fuzz、checker、缩减和 replay | RESTler/EvoMaster；bug bucket + replay |
| `api:test:stream` | SSE parser、事件状态机、partial chunk、终态 | 自定义 reducer + OAS `itemSchema`；raw stream |
| `api:test:async` | 202/poll/webhook、fake clock、重试和取消 | fake scheduler + webhook sink；state timeline |
| `api:test:tools` | tool schema、调用 trace、权限、幂等副作用 | deterministic fake tools + ledger |
| `api:ai:generate` | 从批准输入生成候选 scenarios/properties | 固定 prompt/schema；候选 JSON + provenance |
| `api:ai:verify` | 候选静态校验、运行、去重、mutation/replay | candidate status；禁止直接 promote |
| `api:security` | OWASP API 风险、授权、SSRF、资源消耗和错误暴露 | DAST/策略测试；脱敏报告 |
| `api:perf` | p95/p99、错误率、TTFT、stream complete、吞吐预算 | k6 thresholds；趋势 JSON |
| `api:gate` | 聚合 G0–G7、fail-closed、打印摘要 | stable exit codes 0/1/2/3；全部 artifacts |

建议的 `package.json`/Make/Taskfile 入口只负责编排，不把复杂逻辑塞入 CI YAML：

```text
api:check      = api:spec:normalize → api:spec:lint → api:spec:diff
api:contract   = api:contract:pact + api:contract:provider
api:generated  = api:test:property + api:test:stateful + api:test:fuzz
api:runtime    = api:test:stream + api:test:async + api:test:tools
api:ci         = api:check → api:contract → api:examples → api:generated
                 → api:runtime → api:security → api:perf → api:gate
```

## 八、验收实验设计

这些实验是建议的最小可运行证明，不是本次检索中已经执行的结果；执行时要保存命令、commit、版本、输出和失败 replay。

### 实验 A：契约漂移与 breaking change

- 基线：一个 OAS 3.1/3.2 API、一个 consumer Pact、一个 provider。
- 变异：删除 response required field；把 request optional 改 required；改变状态码/媒体类型；删掉一个 webhook event field。
- 期望：`api:spec:diff` 给出正确级别；Pact/provider conformance 至少有一项失败；CI 返回非零；报告能定位 operationId 和字段路径。
- 边界：如果只有 schema validation 失败而 consumer test 通过，说明只测了 provider conformance，没有覆盖实际消费者。

### 实验 B：状态依赖与 API 生成

- 基线：`create user → get user → update → delete → get`，其中 ID 由前一步生成。
- 对照组：固定 examples；实验组：Schemathesis stateful + RESTler。
- 指标：operation/state coverage、可执行序列数、唯一 bug、最小 replay 长度、未解析 dependency 数。
- 注入缺陷：忽略不存在资源、删除后仍可读、跨租户 ID 可读、重复 create 非幂等。
- 期望：状态生成至少发现一项 examples 未覆盖的缺陷；未解析依赖必须显式报告，不得被计为覆盖。

### 实验 C：属性与模糊 oracle

- 生成：null、空字符串、超长字符串、Unicode、边界整数、重复数组、未知字段、错误 content type、越权 ID。
- 断言：schema、状态码分类、幂等性、分页单调性、金额守恒、资源计数、审计日志和无 5xx。
- 指标：每千请求唯一 failure、重放成功率、缩减后序列、mutation kill rate、误报率。
- 期望：测试能区分“服务拒绝非法输入”和“服务崩溃/错误接受”；只靠 500 oracle 的覆盖要单独标低置信度。

### 实验 D：服务虚拟化与故障注入

- 依赖场景：正常、超时、连接重置、429、5xx、错误 JSON、慢响应、重复 webhook、乱序响应。
- 工具：Prism 做契约 mock/validation proxy；WireMock/MockServer 做状态、record/replay、故障和次数/顺序验证。
- 断言：重试次数上限、退避、熔断、fallback、幂等键、副作用 exactly-once/at-most-once。
- 期望：mock 模式稳定通过；定期真实 canary 对同一 fixture 做 provider drift 检查。

### 实验 E：SSE/流式 AI 接口

- 服务器输出：把同一事件在任意字节边界切分；加入 comments、多行 data、UTF-8 边界、重复 id、提前 EOF、终态后多发 event。
- 断言：符合 WHATWG parser；每个 event 的 `itemSchema` 通过；终态唯一；不完整事件不 dispatch；断线按 `Last-Event-ID`/策略重连或正确关闭。
- AI 变体：文本 delta、structured JSON delta、tool-call arguments delta、tool-call complete、refusal/error、cancel。
- 指标：parse success、terminal correctness、reconnect duplication、TTFT、time-to-complete、token/event loss。

### 实验 F：异步任务与 webhook

- 流程：submit 返回 202/taskId；poll 与 webhook 并行；插入 timeout、429、重复投递、乱序、取消竞态。
- 断言：状态机只允许合法转移；相同 idempotency key 不产生重复副作用；webhook signature、ack 和 retry 正确；最终资源与 task 状态一致。
- 期望：fake clock 下可在秒级完成；不依赖真实外部队列的偶然时序。

### 实验 G：tool/function calling 安全与副作用

- 输入：合法 call、未知 tool、缺失参数、额外参数、错误类型、并行调用、重复 call_id、tool error、超时、恶意/越权参数。
- 执行：所有工具使用 deterministic fake；写操作先进入 side-effect ledger，支持 dry-run、幂等键和回滚。
- 断言：schema/auth/policy 在执行前生效；每个 call_id 至多按契约执行；tool result 必须关联原 call；拒绝越权和 destructive action；重试不会重复扣款/发信/删数据。
- 期望：不仅最终文本正确，整条 trace、权限决策和副作用账本都可审计。

### 实验 H：LLM 辅助的增益而非“看起来生成了很多”

- 固定输入：同一个 spec、需求集、seed、预算和 SUT。
- 对照：人工/规格生成 baseline；实验：LLM 只生成候选并经同一校验/运行/mutation 流程。
- 指标：候选 schema-valid rate、可执行率、重复率、operation/state coverage、mutation kill rate、唯一缺陷数、flaky rerun rate、triage time、token/cost。
- 接受条件：LLM 组必须在固定预算下提高至少一个预先声明的质量指标，且不能显著增加误报/不稳定性；“生成数量更多”本身不是收益。
- 失败条件：LLM 候选无法通过 schema/operation/policy 校验，或只有 LLM judge 认为正确而没有确定性证据；这种结果只能标记 `candidate/unknown`，不得进 required gate。

### 实验 I：CI 门禁完整性

- 故意让 G0、G1、G2、G5 各失败一次，并检查 PR、merge queue、重跑、artifact 上传和退出码。
- 期望：每个必需 gate 都能阻断；失败仍保留 replay/report；`merge_group` 会触发同名检查；不允许路径过滤让 required check 永久不报告。

## 九、版本、证据和未知项

- **已确认**：截至 2026-08-10，OpenAPI 官方索引列出 3.2.0 为最新公开规范，3.1.2 与 3.2.0 同日发布；OAS 3.2.0 有流式媒体/SSE/webhook 章节。JSON Schema 官方当前公开 Draft 2020-12。
- **已确认**：Pact、Schemathesis、RESTler、Prism、WireMock、MockServer、Newman、k6、Hypothesis 和 GitHub Actions 都有官方文档或仓库支持相应的可运行能力。
- **需本地验证**：具体工具对 OAS 3.2.0 每一个新 keyword、JSON Schema dialect、SSE `itemSchema`、callback/webhook 和非 JSON 序列化的实现完整度；文档支持矩阵不能替代本地 fixture。
- **需本地验证**：供应商模型的可复现性、seed 支持、tool-call 并行语义、结构化输出 schema 子集、流式事件版本和计费/限流行为；这些都是快速漂移的 API 事实，必须在 CI 运行前锁定版本并做 probe。
- **不应推断**：论文中的 benchmark、官方 demo 或 GitHub stars 不等于本团队 API 的 defect detection、稳定性或 ROI。
- **不应推断**：OAS schema 通过、HTTP 200、最终文本“看起来合理”或 LLM judge 通过，都不能单独证明业务正确、权限安全或副作用正确。

## 可复用结论

接口自动化测试的下一代最小闭环是：

```text
版本化契约
  + consumer/provider 交互契约
  + schema/属性/状态生成
  + 流式/异步/tool-call 事件状态机
  + 可控虚拟化和副作用账本
  + LLM 候选生成与有限 refinement
  + 确定性验证、mutation、replay、CI fail-closed 门禁
```

把 LLM 放在“扩大探索空间、整理证据、提出候选 oracle”的位置；把标准、schema、运行时状态机、可重放 trace 和退出码放在“决定是否通过”的位置。这样才能让自动化测试随接口从普通 CRUD 演进到 agentic、streaming、async 和 tool-using API，而不会把不可复现的模型输出误当成工程质量证据。

## 主要来源清单（按证据层级）

### 规格/标准

1. [OpenAPI 3.2.0](https://spec.openapis.org/oas/v3.2.0.html)
2. [OpenAPI specification index](https://spec.openapis.org/oas/)
3. [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
4. [AsyncAPI 3.0.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0)
5. [CloudEvents specification](https://github.com/cloudevents/spec)
6. [WHATWG Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
7. [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)

### 官方文档/官方仓库

8. [Pact docs](https://docs.pact.io/)
9. [Schemathesis docs](https://schemathesis.readthedocs.io/en/stable/)
10. [Schemathesis stateful testing](https://schemathesis.readthedocs.io/en/latest/guides/stateful-testing/)
11. [Microsoft RESTler](https://github.com/microsoft/restler-fuzzer)
12. [EvoMaster](https://github.com/WebFuzzing/EvoMaster)
13. [Hypothesis stateful testing](https://hypothesis.readthedocs.io/en/latest/stateful.html)
14. [Prism](https://stoplight.io/open-source/prism)
15. [WireMock](https://wiremock.org/docs)
16. [MockServer verification](https://www.mock-server.com/proxy/verification.html)
17. [Newman CI](https://learning.postman.com/docs/reference/newman-cli/continuous-integration/)
18. [k6 checks](https://grafana.com/docs/k6/latest/using-k6/checks/)
19. [k6 thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
20. [GitHub required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
21. [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling)
22. [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
23. [OpenAI streaming](https://developers.openai.com/api/docs/guides/streaming-responses)
24. [OpenAI background mode](https://developers.openai.com/api/docs/guides/background)
25. [OpenAI evals](https://developers.openai.com/api/docs/guides/evals)
26. [Anthropic tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
27. [Anthropic streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)
28. [Gemini function calling](https://ai.google.dev/gemini-api/docs/function-calling)
29. [Gemini streaming](https://ai.google.dev/gemini-api/docs/streaming)
30. [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)

### 论文/研究证据

31. [RESTler: Stateful REST API Fuzzing](https://www.microsoft.com/en-us/research/uploads/prod/2021/03/RESTler.pdf)
32. [EvoMaster: Evolutionary Multi-context Automated System Test Generation](https://arxiv.org/abs/1901.04472)
33. [RESTestBench: A Benchmark for Evaluating LLM-Generated REST API Test Cases](https://arxiv.org/abs/2604.25862)
34. [Test Amplification for REST APIs via Single and Multi-Agent LLM Systems](https://arxiv.org/abs/2504.08113)
35. [TestPilot: LLM test-generation repository](https://github.com/githubnext/testpilot) — 官方 GitHub archive 将其定位为早期研究探索，不应当作当前生产能力证据。

### 补充证据

本稿未使用第三方博客、论坛、Wikipedia 或营销比较作为关键结论依据；工程场景建议均来自上述官方工具文档、标准或论文。这样牺牲了部分“团队实际采用”的叙事，却保留了可审计、可复现和版本可核验性。
