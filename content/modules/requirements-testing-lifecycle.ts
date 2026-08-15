import type { TechnicalBlock, TutorialBlock, TutorialPage } from "../course.ts";
import { promptBody } from "../prompt-bodies.ts";
import { requirementsLifecycleSupplement } from "./requirements-lifecycle-supplement.ts";
import { handbookMaterials, methodologyExtraBlocks, methodologyStageBlock } from "./methodology-handbook.ts";

const commonBoundary = "本专题使用虚构的订单取消与退款资料包验证工件结构和离线流水线。它能证明流程可运行、冲突能阻断、预埋缺陷能被测试发现；不能证明模型能正确理解你公司的全部文档，也不能替代产品、研发、法务和发布责任人的确认。provider/model、真实集成、practitioner 盲审、learner 实际迁移、live、production 均为 NOT_RUN；fixture-only 结果不得升级为企业可用或发布证据。";

const wave2LifecycleBlocks: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "TD-P01 反例与诊断：为什么先生成用例会让冲突消失", body: ["反例一：把旧技术方案当唯一真相，能快速生成 200/409 两组用例，却把已批准 PRD 的 SHIPPED 禁止取消规则覆盖掉；看起来覆盖很多，实际没有保护业务权威。反例二：让模型按‘更合理’规则合并两份文档，输出很流畅，但 reviewer 无法定位谁批准了该语义。正确动作是保留双方 source_ref、设置 BLOCKED，并等待具名 owner 的裁决版本。", "诊断时先看 source-manifest 是否唯一，再看 authority/有效期，最后检查 conflict finding 是否进入下游 gate；不要从接口响应倒推哪份文档正确。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["同一状态有两个相反预期", "authority", "核对 owner、版本和 source_ref；升级 BLOCKED"], ["Prompt 输出没有引用", "traceability", "检查 schema/eval 的引用门禁，删除无证据结论"], ["修复后旧 case 仍为 PASS", "versioning", "比较 basis hash，使旧收据失效并重跑"], ["接口失败但无法判断规则", "oracle", "等待业务 Oracle，禁止用实现响应作真值"]] } }],
  "TD-P02": [{ title: "TD-P02 反例与诊断：合法 JSON 仍可能是坏契约", body: ["反例一：把 refund_timeout_hours 填成 24，格式和类型都正确，但原始 PRD 没有该时限；它会让性能门禁伪装成事实。反例二：把 UNKNOWN 的退款完成状态写成 CANCELLED，后续用例会错误地断言副作用已完成。学员应逐字段回到 source_ref，并把缺失项交给 owner。", "结构校验通过后，先查引用存在性，再查语义不变量和权限边界，最后让独立评审确认；schema 只能防止坏格式，不能批准业务含义。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["字段齐全但用例仍错", "semantic", "逐条对照 source_ref 和业务 owner"], ["未知项被填成阈值", "authority", "删除猜测，写 UNKNOWN 并给 close_with"], ["契约能解析但副作用重复", "invariant", "核对 refund_count<=1 与幂等 Oracle"], ["下游拒绝输入", "schema/trace", "检查枚举、引用和 baseline hash"]] } }],
  "TD-P03": [{ title: "TD-P03 反例与诊断：架构图不等于可观察契约", body: ["反例一：只画同步调用链，忽略退款 Worker 的重试和死信；主流程用例全绿，重复退款却无人发现。反例二：把 trace_id 写在设计里就当作可观测，实际异步事件没有关联 ID，失败只能猜。正确做法是把状态、重试、幂等、观察点和恢复 owner 一起落表。", "诊断从状态转换是否闭合开始，再检查每个副作用的幂等键、超时/死信和日志 Trace，最后验证需求—技术矩阵是否有双向引用。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["重复消息造成两次退款", "idempotency", "检查 dedupe key、重试和账本不变量"], ["异步失败无法归因", "observability", "确认 trace/event/audit 三类证据"], ["设计有状态但需求无授权", "authority", "列出越界行为并 BLOCKED"], ["超时后状态不确定", "recovery", "补 safe terminal、补偿和 owner"]] } }],
  "TD-P04": [{ title: "TD-P04 反例与诊断：风险策略不是测试清单排序", body: ["反例一：把所有风险堆到 E2E，因为它‘最接近用户’，结果失败定位慢且无法覆盖异步重试。反例二：按历史用例数量分配优先级，忽略一次权限越界可能比几十个低影响 UI 缺陷更危险。先写损失、概率、可探测性和 owner，再选择能检出该失败的层级。", "当测试很多仍漏缺陷时，先回到 failure model 和独立 Oracle，而不是继续加 case；策略必须说明拒绝了哪些方法以及为什么。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["E2E 很多但定位慢", "strategy", "按风险拆契约/状态/集成层"], ["高风险无监控", "release", "补 monitoring、owner 和残余风险"], ["阈值边界未覆盖", "method", "改用 boundary/decision table"], ["优先级争议", "authority", "要求损失口径与具名裁决"]] } }],
  "TD-P05": [{ title: "TD-P05 反例与诊断：自证 Oracle 会把错误锁死", body: ["反例一：先运行实现得到退款金额，再把它复制到 expected；实现若少退一分钱，测试仍然绿色。反例二：让同一模型生成答案和 Judge，模型共同漏掉权限问题。应先冻结业务规则、独立计算或不变量，再让 case 引用 oracle_id。", "当测试全绿但事故仍发生，先确认 expected_source 是否来自实现；再检查 Oracle owner、版本与高风险人工复核。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["全绿但金额错误", "oracle", "与独立计算/账本对照"], ["Judge 与生成器意见一致", "independence", "更换独立 Oracle 并校准"], ["边界结果无法解释", "rule", "补批准规则和输入分区"], ["期望随代码更新", "version", "锁定 Oracle hash，旧收据失效"]] } }],
  "TD-P06": [{ title: "TD-P06 反例与诊断：自动化绿不代表检测力强", body: ["反例一：adapter 捕获断言异常后继续执行，报告全绿却没有一条有效断言。反例二：UI locator 改动后直接按实际文本更新 expected，脚本恢复通过但业务回归被吞掉。正确做法是让异常向上传播、保留 selected/skipped/retries，并只映射已批准 Oracle。", "审查自动化时先看断言是否引用 oracle_id，再看 skip/重试策略和原始报告，最后用 mutation 证明故障确实能打红。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["流水线常绿但变异存活", "assertion", "核对断言与 mutation 目标"], ["失败后无原始日志", "evidence", "禁止吞异常，保存 artifact"], ["locator 变化导致改期望", "oracle", "恢复批准 expected，不改规则求绿"], ["重试掩盖首败", "runner", "记录每次结果并设上限"]] } }],
  "TD-P07": [{ title: "TD-P07 反例与诊断：归因前先冻结运行事实", body: ["反例一：只看最后一次 PASS，把前一次超时抹掉；反例二：没有 pinned code/data/Prompt hash 就把失败归因产品缺陷。Run Manifest 必须保存选择/跳过、每次重试、原始 actual、Trace 和环境版本，证据不足保持 UNKNOWN。", "归因顺序是版本与选择、Oracle 与 actual、环境/依赖、产品行为；不要让模型摘要替代原始证据。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["同一 case 结果相反", "run", "比较 seed、构建、数据和重试"], ["失败没有 actual", "evidence", "回到原始报告，保持 UNKNOWN"], ["环境错误被报成产品错", "dependency", "检查服务/凭据/网络门禁"], ["模型说‘可能是缓存’", "inference", "设计可证伪实验，不采纳猜测"]] } }],
  "TD-P08": [{ title: "TD-P08 反例与诊断：旧 PASS 不是永久资产", body: ["反例一：接口 409 改成 422，却只重跑未受影响的 happy path，旧 PASS 继续挡住发布。反例二：Prompt/模型版本变化仍复用旧 Eval 收据，无法证明行为相同。影响分析必须沿 source→requirement→risk→oracle→case→result 传播，使受影响证据变 stale。", "发布候选只能呈现 Evidence/Inference/Unknown、残余风险和 rollback owner；具名发布人未批准前保持 BLOCKED。"], table: { headers: ["症状", "疑似层", "下一检查/修复"], rows: [["变更后仍继承旧绿", "impact", "重算影响集并标记 STALE"], ["回归集过小", "trace", "检查 diff 到 risk/case 的追踪"], ["模型更新未重评", "eval", "冻结新 hash 并重跑相关评测"], ["没人接受残余风险", "release", "指定 owner、Waiver 或回滚条件"]] } }],
};

const wave3DepthBlocks: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 工作示例：把订单取消资料整理成可交接的依据包", body: ["假设你接到一个周五要上线的订单取消改动。先不要把三份文档同时贴给模型，而是建立一个表：PRD-v3#R17 说已支付未发货可取消，TECH-a13f#S04 仍允许 SHIPPED，OPENAPI-v7#/cancel 只说明 409 的接口表面。你要在表中写 owner、版本、hash、有效期和冲突影响；这张表本身就是后续评审的输入。", "接着把一个冲突展开成测试影响：若采用 PRD，SHIPPED 应拒绝且不得产生退款事件；若采用旧设计，则会发生未授权退款。不要写两个都通过的 expected，而是输出 SOURCE_CONFLICT、影响风险、待裁决人和 close_with。裁决后再生成新的 basis hash，并让旧的 case receipt 失效。", "迁移到审批、登录或结算业务时，只替换来源类型、状态和责任人，不要复制订单规则。可观察工件至少包括 source-manifest.json、conflicts.json、裁决记录和新的 baseline 报告；学员提交这些文件，评审者才能判断你是否真的冻结了依据。", "失败修复顺序是：先查版本是否唯一，再查 source_ref 是否稳定，再查 authority 是否书面确认，最后查模型是否越权补写。若任一项没有证据，页面结论必须保持 BLOCKED/UNKNOWN，而不是继续生成测试。"], table: { headers: ["交付物", "工作示例", "迁移检查"], rows: [["source-manifest", "PRD/TECH/OpenAPI 各自带 hash 与 owner", "换业务后仍能按段落定位"], ["conflict record", "SHIPPED 可取消 vs 禁止取消", "冲突有具名裁决人"], ["basis receipt", "裁决后生成新版本", "旧收据不被静默复用"]] } }],
  "TD-P02": [{ title: "P02 工作示例：从一句需求得到可消费契约", body: ["把‘已支付且未发货的订单允许取消’拆成 actor=BUYER、precondition=PAID+NOT_SHIPPED、trigger=POST cancel、状态 PAID→CANCEL_PENDING→CANCELLED、副作用 refund.requested 和不变量 refund_count<=1。每个字段都要回到 PRD-v3#R17 或接口契约，不能因为 JSON 需要字段就臆造退款时限。", "然后故意制造一个坏契约：删除 SHIPPED 拒绝分支并加入 refund_timeout_hours=24。Schema 仍可能通过，但 semantic gate 必须指出没有来源和权限边界。学员应保存原始输入、结构校验、语义校验和修复后的 contract 四份工件，展示格式正确与业务正确是两道门。", "迁移到会员续费时，把 actor 换成会员/客服，把状态换成 ACTIVE、PAUSED、CANCELLED，把副作用换成 invoice.created；保留 source_refs、unknowns、conflicts、owner 和 close_with 字段。这样下游风险和测试设计能复用结构，而不会把订单语义误带过去。", "出现下游用例异常时，先检查字段是否能被程序读取，再检查每个关键语义是否有引用，最后核对不变量是否独立于实现。修复应回到来源或 owner，不应让模型自动填满空字段。"], table: { headers: ["检查", "通过样例", "失败修复"], rows: [["格式", "枚举和必填字段合法", "修 schema，不改规则"], ["引用", "每条状态有 source_ref", "补 locator 或标 UNKNOWN"], ["语义", "退款不变量获 owner 确认", "BLOCKED 等待裁决"]] } }],
  "TD-P03": [{ title: "P03 工作示例：技术文档要把失败恢复画出来", body: ["在订单取消架构中，order-service 接受请求，refund-worker 消费事件，payment-gateway 返回结果。不要只画成功箭头，还要画超时、重复消息、死信、补偿和最终状态；为每个箭头写 request_id、trace_id、幂等键和观察点。这样测试可以知道失败属于接口、队列、支付依赖还是数据状态。", "例如 worker 第一次处理成功但 ACK 丢失，第二次投递必须不再产生第二次退款。若设计只写‘消息可重试’，却没有 dedupe key、退避和 safe terminal，测试开发应创建设计缺口而不是猜 expected。技术矩阵要把这个缺口连回 REQ-CANCEL-001 和风险 owner。", "迁移到异步审批时，把退款事件换成 approval.requested，把账本不变量换成同一申请只能有一个终态；仍然保留状态、重试、权限、Trace 和审计列。学员的可观察工件是 component map、state table、failure matrix 和 review questions。", "诊断先看状态转换是否闭合，再查重试与幂等，再查 Trace 是否跨服务传递，最后查回滚和人工恢复。缺少任一关键证据，技术契约应为 BLOCKED，不能因为接口 200 就判设计完成。"], table: { headers: ["故障", "应观察", "修复动作"], rows: [["ACK 丢失重复投递", "dedupe key、refund_count", "补幂等与回归样例"], ["支付超时", "trace、状态、补偿", "定义 safe terminal"], ["死信积压", "指标、告警、owner", "补恢复 runbook"]] } }],
  "TD-P04": [{ title: "P04 工作示例：从损失倒推测试层级", body: ["假设取消接口有三类风险：已发货仍被退款是高损失权限/状态错误；重复点击造成两次退款是幂等错误；错误码字段改名是契约兼容错误。第一类需要状态模型、独立账本 Oracle 和集成/回归门禁，第二类需要属性与消息重放，第三类可在契约层快速发现。不能因为 E2E 最像用户就把三类都堆进去。", "策略表要写为什么选择某方法、拒绝什么方法、需要什么数据和监控。若没有损失口径或 owner，严重度不要填数字；写 UNKNOWN 并列出确认问题。这样风险排序是可解释的，而不是模型凭语气打分。", "迁移到搜索、支付或 Agent 工具调用时，替换 failure model、独立 Oracle、数据许可和发布门禁；保留‘风险→方法→Oracle→证据→残余责任’的链。学员提交 risk-test-plan、层级决策表和一条被拒绝方法的理由。", "当测试很多仍漏错，先检查是否写错了失败模型，再检查 Oracle 是否能观察目标失败，最后看监控和残余风险 owner。增加用例数量不能修复方法与风险不匹配。"], table: { headers: ["风险", "方法", "证据"], rows: [["已发货退款", "状态/集成", "账本与事件 Oracle"], ["重复退款", "属性/重放", "refund_count<=1"], ["错误码变更", "契约", "Schema diff receipt"]] } }],
  "TD-P05": [{ title: "P05 工作示例：先写 Oracle，再写用例", body: ["对退款金额，不要让实现先算出 98 元再把 98 写成 expected。正确做法是从批准规则和独立账本计算公式得到 expected_amount、currency、refund_count 和 audit_event，再让用例调用实现。对于 SHIPPED，Oracle 是拒绝且无退款副作用，而不是‘接口通常返回 409’。", "用例至少覆盖已支付未发货、已发货、非订单所有者、重复请求、金额边界和支付依赖超时。每一条记录 requirement_id、risk_id、oracle_id、数据、动作、transport/state/event/audit expected、清理动作和证据路径。这样 reviewer 能发现某条用例只断言状态码却没有检查副作用。", "迁移到推荐系统时，Oracle 可来自规则引擎、金标、约束或独立计算；不要把同一个模型既当生成器又当唯一 Judge。学员提交 Oracle Registry、case matrix 和一条被 mutation 杀死的回归样例。", "全绿但事故逃逸时，先确认 expected_source 是否 implementation-derived，再检查 Oracle 版本和独立性，最后做高风险人工复核。若 Oracle 本身未批准，测试状态应 BLOCKED_TEST。"], table: { headers: ["用例", "独立 Oracle", "关键断言"], rows: [["已发货取消", "业务规则禁止", "409+无 refund.requested"], ["重复取消", "refund_count<=1", "一次副作用"], ["超时重试", "最终状态不变量", "trace 与补偿"]] } }],
  "TD-P06": [{ title: "P06 工作示例：把 Test Package 安全接入自动化", body: ["把 P05 的 case 映射到 API adapter 时，先检查 endpoint、schema、fixture、凭据边界和 cwd。adapter 可以把 case action 翻译成请求，也可以收集 response、event 和 audit；它不能改变 expected、吞断言异常或无限重试。每次重试都要进入报告，selected/skipped 也要显式记录。", "故意注入一个假绿缺陷：让 runner 捕获金额断言异常并继续。报告看起来全绿，但 mutation 目标没有被杀死。修复是恢复异常传播、保留原始日志并让独立 Oracle 重新比较，而不是删掉失败 case。", "迁移到 Playwright、Cypress 或接口巡检时，只替换 adapter contract、locator/请求和环境准备，保留 oracle_id、命令退出码、artifact 路径和安全控制。学员提交 adapter review、baseline/fault/repair 报告和一张 trace map。", "流水线常绿但缺陷逃逸时，先查断言传播，再查 skip/retry，最后用 mutation 检查检测力。若凭据、契约或环境未冻结，状态保持 BLOCKED。"], table: { headers: ["自动化层", "允许动作", "禁止动作"], rows: [["Adapter", "映射请求和收集证据", "改 expected"], ["Runner", "有界重试、保留每次结果", "吞异常/无限重试"], ["Report", "记录版本、选择和原始失败", "只保留最后 PASS"]] } }],
  "TD-P07": [{ title: "P07 工作示例：一次失败报告怎样做到可归因", body: ["冻结 Run Manifest 时记录 requirement/basis hash、代码构建、配置、数据集、Test Package、Prompt/模型（若有）、环境、命令、时间、selected/skipped 和每次 retry。一个订单取消测试失败，只有同时保存 expected、actual、trace 和依赖状态，才有资格判断 PRODUCT_FAIL。", "如果日志显示支付网关超时但没有 gateway 版本和 trace，不能直接报产品缺陷；分类应是 UNKNOWN 或 DEPENDENCY_BLOCKED，并给出下一实验。若第一次失败、第二次重试通过，也必须保留首败，不能只截图最后一次。", "迁移到移动端或 Agent 流程时，替换运行环境和 trace 字段，仍然产出 manifest、归因表、缺证据清单、缺陷草稿和决策摘要。学员提交一条 UNKNOWN 记录，证明自己能停下来而不是编故事。", "诊断顺序是版本/选择、Oracle/actual、环境依赖、产品行为。修复后重跑必须使用同一 basis 或明确新版本，不能用新规则解释旧失败。"], table: { headers: ["状态", "需要的证据", "下一步"], rows: [["PRODUCT_FAIL", "独立 Oracle+actual+Trace", "建缺陷并回归"], ["ENV_BLOCKED", "环境错误和命令证据", "修环境后重跑"], ["UNKNOWN", "缺 pinned 或原始日志", "补证据，不猜根因"]] } }],
  "TD-P08": [{ title: "P08 工作示例：把变更影响传到发布证据", body: ["假设取消接口把已发货错误码从 409 改成 422，同时 Prompt 模板也更新。影响分析不能只重跑 happy path，而要沿 source→requirement→risk→oracle→case→run 找出状态拒绝、客户端契约、错误解析和 Prompt Eval 的全部受影响节点，并把旧 receipt 标记 STALE。", "发布 Evidence Pack 应同时呈现 selected regression、未选原因、通过/失败/UNKNOWN、残余风险、Waiver 和 rollback owner。它只能生成 RELEASE_CANDIDATE；具名发布人没有确认前不能写 released。模型更新还必须有新 hash 和桥接评测，不能继承旧模型结论。", "迁移到 RAG 索引或 Agent 工具权限变更时，把 diff 换成 chunk/index/tool policy 版本，把回归 Oracle 换成检索命中、引用正确性或最小权限不变量；保留影响集、失效规则和回滚条件。学员提交 Change Set、Impact Set、回归收据和发布问题清单。", "若发布后出事，先查影响集是否漏节点，再查旧 PASS 是否被复用，最后看残余风险是否有人接受。任何未闭合链路都应 BLOCKED。"], table: { headers: ["变更", "受影响证据", "修复/重跑"], rows: [["409→422", "契约、客户端、回归", "重建 contract 与相关 case"], ["Prompt hash 更新", "Eval、Oracle、receipt", "新版本评测"], ["工具权限扩大", "安全用例、审计", "最小权限回归与人工批准"]] } }],
};

const wave3TransferBlocks: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 迁移工件：把一次评审变成下次可复用的输入", body: ["请创建 basis-review.md，固定本次目标、来源清单、优先级规则、冲突记录和裁决状态。然后把一个已关闭冲突写成回归样例：输入两条互相矛盾的 source_ref，预期输出 BLOCKED，不能因为改了文档顺序就变成 ACCEPTED。", "在评审会上，先让产品 owner 只确认业务语义，再让技术 owner 确认实现约束，测试开发补齐 Oracle 和下游消费者。这样不会把一个人说的‘应该可以’误记成团队共识。", "复用时替换文件和 owner，保留 hash、locator、conflict、close_with 字段；如果新业务没有版本、权限或数据许可，就明确 UNKNOWN，不要把旧案例复制成新事实。", "完成标准是另一位同事仅凭 manifest、裁决记录和新 baseline 就能重放你的判断，并能指出哪些结论仍未运行。"], table: { headers: ["迁移工件", "内容", "准出"], rows: [["basis-review.md", "目标、来源、冲突、裁决", "owner 签名"], ["conflict regression", "相反规则和 BLOCKED 预期", "fault 可重放"], ["handoff note", "下游输入、未知、消费者", "版本可追踪"]] } }],
  "TD-P02": [{ title: "P02 迁移工件：让需求契约真正交给下游", body: ["把 contract.json 交给风险页前，另建 contract-review.md，列出每个字段由谁消费：actors 给权限测试，states 给状态测试，invariants 给属性测试，side_effects 给幂等与观察点，unknowns 给待确认清单。字段没有消费者就删除或说明原因。", "示例中，‘取消成功’不能只写一句话，要拆为受理状态、最终状态、退款事件和审计记录；如果退款完成时间没有批准值，就保留 UNKNOWN，而不是填一个看似合理的小时数。", "迁移时做一轮字段替换审查：业务名、状态、事件、权限和数据脱敏全部替换，但保留 status、source_refs、owner、close_with 和 version。提交前用坏契约 mutation 删除一个关键引用，确认语义门禁能变红。", "学员交付 contract.json、消费者矩阵、坏契约报告和修复 receipt。评审者应能从任一用例反查到字段和源文档。"], table: { headers: ["字段", "消费者", "缺失后果"], rows: [["states", "状态/非法转换测试", "漏掉非法路径"], ["invariants", "属性/对账", "无法判定永真条件"], ["unknowns", "评审待办", "模型越权补全"]] } }],
  "TD-P03": [{ title: "P03 迁移工件：技术审查问题要能关闭", body: ["把每个架构疑问写成 review-question.csv：问题、source_ref、受影响 requirement/risk、猜测禁止项、accountable owner、close_with 和目标版本。‘请补充重试’不是关闭证据；必须有退避、最大次数、死信、幂等身份和恢复动作。", "订单取消的异步链可用一个故障演练验证：ACK 丢失后重复消息，观察 refund_count、trace_id、audit_event 和最终状态。如果缺任一观察点，结论是 BLOCKED，而不是把测试改成只看 HTTP 200。", "迁移到文件处理、审批或 Agent 工具链时，替换组件和事件，但保留失败恢复、权限、审计、回滚、监控五列。学员应提交一张状态/事件图和一条可执行故障脚本。", "修复后重新生成技术矩阵并让旧问题保留为历史记录；只有新版本有 owner 和 close evidence，才允许风险页消费。"], table: { headers: ["问题类型", "关闭证据", "未关闭状态"], rows: [["重试语义", "次数/退避/死信/幂等", "BLOCKED"], ["可观测性", "Trace/事件/审计样例", "UNKNOWN"], ["越界行为", "需求 owner 裁决", "SOURCE_CONFLICT"]] } }],
  "TD-P04": [{ title: "P04 迁移工件：用风险矩阵解释为什么这样测", body: ["风险矩阵不能只有高、中、低。对每条风险写失败动作、受影响用户、可逆性、可探测性、测试层级、独立 Oracle、数据需求、监控、残余风险 owner 和拒绝的方法。没有依据的概率和金额写 UNKNOWN。", "订单取消中，重复退款比错误提示更需要状态/属性和账本对账；错误码兼容则先做契约测试，再安排少量 E2E。把这个选择写成决策记录，下一次变更才能复用理由而不是重新争论。", "迁移到 RAG 时，把损失换成错误引用/敏感泄露，把 Oracle 换成金标与权限不变量；迁移到 Agent 时增加工具副作用、最小权限和人工 handoff。不要把页面的订单阈值当组织标准。", "失败修复是补齐方法和 Oracle 的因果依据、监控信号及责任人，再重排选择集；加几十条 happy path 不能替代高风险失败的检出能力。"], table: { headers: ["策略记录", "必须回答", "证据"], rows: [["为什么选该层", "它能检出哪类失败", "failure model"], ["为什么拒绝 E2E", "成本/归因/覆盖限制", "决策记录"], ["怎样准出", "门禁、监控、owner", "release input"]] } }],
  "TD-P05": [{ title: "P05 迁移工件：Oracle Registry 要能被另一个人复核", body: ["Oracle Registry 每行写 oracle_id、来源、版本、计算方式、适用输入、禁止依赖、owner 和复核状态。金额 Oracle 可来自独立账本；状态 Oracle 可来自批准状态机；生成式答案要有金标、Rubric、Judge 校准和人工升级。", "用订单案例写六条 case：允许取消、已发货拒绝、非所有者拒绝、重复请求、支付超时、边界金额。每条 expected 同时说明 transport、state、event、audit，避免只断言状态码。", "迁移到接口巡检或 Playwright 时，Oracle 仍应在测试代码之外版本化；locator、请求字段、数据准备属于 adapter，不得成为业务真值。提交前运行实现反转 mutation，验证至少一条断言能独立杀死它。", "如果评审发现 expected 直接来自实际响应，退回 BLOCKED_TEST；修复必须恢复来源或批准公式，并重新生成 case 与 receipt。"], table: { headers: ["Oracle 类型", "例子", "独立性要求"], rows: [["规则", "SHIPPED 禁止退款", "产品批准"], ["计算", "退款金额/账本", "独立公式"], ["不变量", "refund_count<=1", "跨实现验证"]] } }],
  "TD-P06": [{ title: "P06 迁移工件：自动化执行必须把失败原样交回", body: ["建立 adapter-contract.md，写清框架版本、cwd、凭据边界、数据复位、请求/locator 映射、oracle_id、退出码和报告路径。这样 Playwright、Cypress、API runner 都能替换实现而不改变测试语义。", "一次 fault 演练应包含断言失败、网络超时和选择跳过三种结果。报告要区分产品失败、测试失败、环境阻断和未运行；不能用重试或 skip 把首个失败抹掉。", "迁移时只将订单 fixture 替换为团队脱敏数据，保留最小权限、禁止真实副作用、录制 trace 和清理动作。任何需要生产凭据、未脱敏个人信息或未声明副作用的脚本都先 BLOCKED。", "修复假绿时先恢复异常传播和证据保存，再重跑 baseline/fault/repair；不得把实现当前响应写回 expected，也不得删掉 flaky case 来获得绿色。"], table: { headers: ["执行证据", "最小字段", "失败处置"], rows: [["命令", "cwd、exit code、版本", "不可复现则 UNKNOWN"], ["结果", "expected/actual、trace", "缺证据不归因"], ["清理", "数据复位、副作用", "缺权限则 BLOCKED"]] } }],
  "TD-P07": [{ title: "P07 迁移工件：把 UNKNOWN 也变成可行动报告", body: ["Run Manifest 不只记录通过项。对每个 selected、skipped、not_run 和 retry 写原因、命令、版本、原始输出和下一步。一个支付网关超时但没有依赖版本时，报告应是 DEPENDENCY_BLOCKED，并给出修环境后重跑的条件。", "把一次首败和重试通过放在同一 receipt，保留两个时间点和 trace；决策摘要只能引用原始证据。这样 reviewer 能区分偶发环境噪声、测试本身错误和真实产品行为。", "迁移到移动设备、Agent trace 或多端执行时，替换环境字段与采集器，保留 pinned input、Oracle、选择集和 artifact hash。提交一条 UNKNOWN 记录，证明你知道什么时候不能下结论。", "修复归因问题先补版本、依赖、日志或 Oracle，再按同一 basis 重跑；如果规则也变了，必须新建版本并标记旧结果 stale。"], table: { headers: ["归因", "证据门槛", "动作"], rows: [["PRODUCT_FAIL", "Oracle+actual+Trace", "缺陷/回归"], ["TEST_FAIL", "断言/fixture 证据", "修测试"], ["UNKNOWN", "关键证据缺失", "补证据再跑"]] } }],
  "TD-P08": [{ title: "P08 迁移工件：发布候选不是发布决定", body: ["Change Set 记录变更文件、契约、配置、模型/Prompt hash；Impact Set 逐项映射到 requirement、risk、oracle、case 和 receipt。接口错误码变化必须使客户端契约和错误处理回归失效，不能只重跑成功路径。", "Evidence Pack 要把通过、失败、UNKNOWN、未选回归、残余风险、Waiver 和 rollback owner 放在一起。发布 owner 只消费这份材料做决定，AI 或测试开发不能代签。", "迁移到 RAG 索引更新时，影响集应覆盖 chunk、检索策略、引用正确性和敏感权限；迁移到 Agent 时覆盖工具 schema、权限、审计和人工 handoff。每次模型/Prompt 变化都要新 hash 和新 Eval。", "事故复盘时反向走 lineage：若找不到受影响节点或旧 PASS 被复用，先标记 BLOCKED，修复依赖图和回归选择后再生成新的候选证据。"], table: { headers: ["发布材料", "用途", "不能声称"], rows: [["Impact Set", "选择相关回归", "全量覆盖"], ["Evidence Pack", "呈现证据和未知", "自动放行"], ["Rollback plan", "降低剩余风险", "线上已验证"]] } }],
};

const wave3DeepeningBlocks: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 深入练习：评审现场如何逐句追责", body: ["把评审过程录成四列笔记：发言人、原文 locator、判断类型、下一位消费者。例如产品说‘已支付可取消’是业务 Evidence；测试开发说‘需要幂等’是基于机制的 Inference；‘退款 30 分钟内完成’若没有来源就是 Unknown。这样学员不会把经验性建议冒充需求事实。", "当技术 owner 说旧设计仍允许已发货取消时，不要争论谁更懂系统，先要求双方指出版本和批准记录。若没有人能证明旧设计已替代 PRD，冲突必须阻断；若业务选择新规则，必须更新 basis、Oracle、case 和回归，而不是只改一张评审表。", "练习结束后把 source-manifest 交给另一位同事盲审，让他从任意测试条件反查来源、owner 和 hash。盲审找不到坐标，说明切分粒度仍太粗；盲审发现同一 locator 有两个版本，说明版本门禁还未关闭。", "迁移时可把订单案例换成优惠券、审批或账号注销，但必须重新定义 authority、状态、例外和副作用。最终工件不是一段总结，而是能让下游继续工作的依据包和明确的 BLOCKED/UNKNOWN 清单。"], table: { headers: ["评审动作", "观察证据", "不合格处置"], rows: [["逐句标 Evidence/Inference/Unknown", "locator、版本、owner", "补引用或标 UNKNOWN"], ["冲突双向保留", "conflict record", "BLOCKED 等待裁决"], ["交给下游盲审", "可反查的 case", "修 source_ref/版本"]] } }],
  "TD-P02": [{ title: "P02 深入练习：契约字段如何驱动后续用例", body: ["取一条需求字段做反向追踪：actors=BUYER 产生非所有者 403；preconditions=PAID/NOT_SHIPPED 产生边界组合；state_transitions 产生合法和非法转换；side_effects 产生事件与幂等检查；unknowns 产生阻断问题。若字段没有下游消费者，就说明它只是装饰。", "再把一条需求改写三次：先写自然语言摘要，再写结构合法 JSON，最后写带引用和 Oracle 的可执行契约。比较三版差异，学员应能说出第二版为何仍不够，以及第三版如何让测试、自动化和发布共同消费。", "契约评审要区分结构错误、来源错误和语义错误。结构错误可以由 schema 机器修复；来源错误需要回到 source manifest；语义错误要由产品或领域 owner 裁决。模型不能把三类问题都改成‘建议补充’。", "迁移到自己的业务时保留 contract status、source_refs、unknowns、conflicts、owner 和 close_with。提交时至少附一份删除关键字段的 mutation 报告，证明下游确实依赖该字段。"], table: { headers: ["字段", "后续用例", "复核问题"], rows: [["actors", "越权/角色", "角色是否有权"], ["states", "转换/边界", "非法状态怎样处理"], ["side_effects", "事件/幂等", "副作用如何观察"]] } }],
  "TD-P03": [{ title: "P03 深入练习：从架构图走到一次故障演练", body: ["画订单取消的同步和异步两张图，并在每条边旁写 timeout、retry、idempotency、trace 和 audit。然后选 ACK 丢失故障，逐步写出第一次处理、消息重投、去重、最终状态和告警。图上没有观察点的步骤，不能成为可靠的 expected。", "技术文档评审还要问数据一致性：订单服务已写 CANCEL_PENDING 但退款事件未发出怎么办？支付已成功但回执丢失怎么办？Worker 重试耗尽后谁能恢复？每个问题都应有 safe terminal、补偿、人工操作和可验证证据。", "把这些问题交给架构 owner 时附上 requirement_id、风险影响和 close_with，不要只贴截图。关闭后重新生成技术矩阵和 failure matrix，保留旧版本以便解释为什么之前的测试不足。", "迁移到文件上传、审批流或 Agent tool call 时，替换组件和事件名称，但仍必须覆盖正常、超时、重复、权限、回滚、死信和审计。学员最终提交图、表、故障步骤和关闭记录。"], table: { headers: ["架构审查", "必须问", "观察证据"], rows: [["状态", "中间态如何终止", "状态/账本"], ["依赖", "超时后谁恢复", "Trace/告警"], ["副作用", "重复是否安全", "幂等键/审计"]] } }],
  "TD-P04": [{ title: "P04 深入练习：把策略争论变成可审计选择", body: ["召开策略评审时，要求每个候选方法填写能检出的失败、准备成本、归因能力和残余风险。E2E、契约、状态、属性和故障注入没有绝对优先级，优先级来自风险机制和可观察 Oracle。", "对已发货退款风险，E2E 能证明用户路径但难以隔离账本副作用；状态/属性测试能更快击中非法转换；集成测试才覆盖支付依赖。三者不是互相替代，而是由同一风险拆成不同层级的证据。", "如果团队只给严重度数字不给依据，记录 Unknown 并请求损失口径；如果测试没有 monitoring 和 residual owner，策略准出为 BLOCKED。评审记录要保存被拒绝方法，防止下一轮又按习惯选择。", "迁移到 AI 应用时，把风险对象换成检索遗漏、引用错误、越权工具、成本超限或延迟抖动；方法和 Oracle 也要随之变化。提交 risk-test-plan、decision log 和一条未关闭风险。"], table: { headers: ["策略问题", "可审计回答", "缺失结果"], rows: [["为何选此层", "失败机制+Oracle", "UNKNOWN"], ["为何拒绝某方法", "成本/归因理由", "需补证据"], ["谁接受剩余风险", "具名 owner", "BLOCKED"]] } }],
  "TD-P05": [{ title: "P05 深入练习：用例设计要同时覆盖结果与副作用", body: ["针对取消接口，设计一条成功用例并写四类 expected：HTTP 受理、订单最终状态、退款事件/账本和审计记录。再设计已发货、非所有者、重复请求和支付超时用例，说明每条 case 由哪个 Oracle 判定。", "审查时特别寻找‘只断言 200/409’的空洞用例。状态码正确但退款事件重复，仍然是产品失败；错误码正确但审计缺失，也不能放行。用例表要把 transport、state、event、audit 分开。", "Mutation 练习反转一个业务守卫，观察哪条断言真正击中它。若没有 case 被杀死，先检查前置和可达性，再检查 expected 来源，不能直接提高阈值或改 Oracle。", "迁移到推荐、RAG 或 Agent 时，Oracle 可能是金标、规则、引用集合、权限不变量或人工升级 Rubric。学员要提交 registry、case matrix、mutation receipt 和一条转化后的回归样例。"], table: { headers: ["断言面", "订单例子", "漏掉时的风险"], rows: [["transport", "409/200", "接口兼容误判"], ["state", "CANCELLED", "中间态卡死"], ["side effect", "一次退款事件", "重复扣款"], ["audit", "cancel_id", "无法追责"]] } }],
  "TD-P06": [{ title: "P06 深入练习：执行器不是业务规则的拥有者", body: ["把一条 Test Case 映射到 Playwright、Cypress 或 API runner 时，先列 adapter 只允许做的事情：准备数据、发送请求、收集 locator/response/trace、清理环境。业务 expected、Oracle、风险优先级和发布状态不能在 adapter 里重写。", "一次真实的假绿检查要同时注入断言吞异常、错误重试和数据未复位。报告应保留第一失败、后续重试、selected/skipped、stdout/stderr 和 artifact hash。若只剩最后一次成功，结果不具备归因资格。", "迁移到多端执行时，使用相同 TestPackage 和 Oracle Registry，不同端只产生不同执行证据。浏览器 locator、接口字段、移动端控件都需绑定版本，变化后影响分析应让旧 receipt stale。", "提交 adapter contract、红绿报告、trace map 和清理证明；没有真实凭据时用脱敏 fixture，并明确 integration/live/production NOT_RUN。"], table: { headers: ["执行器责任", "可做", "不可做"], rows: [["数据/环境", "准备和复位", "跳过安全控制"], ["断言/报告", "比较 Oracle、留原始证据", "吞异常"], ["重试", "有界并逐次记录", "覆盖首败"]] } }],
  "TD-P07": [{ title: "P07 深入练习：报告要让别人能复现你的判断", body: ["对一个失败用例写完整 Run Manifest：basis、代码、配置、数据、TestPackage、Prompt hash、环境、命令、selected/skipped、每次 retry、expected、actual、Trace 和原始报告。缺一个关键字段，就把归因降级为 UNKNOWN，而不是从日志语气猜根因。", "用同一失败做三种分类练习：断言写错是 TEST_FAIL，支付网关不可用是 DEPENDENCY_BLOCKED，产品返回错误金额且 Oracle 独立是 PRODUCT_FAIL。分类依据必须写在报告里，不能依赖模型摘要。", "复现修复时冻结原始输入和版本；如果修复同时改了需求或模型，建立新 baseline 并标记旧结果 stale。学员要提交归因表、补证清单和重跑 receipt，说明每一步由谁消费。", "迁移到 Agent trace 或移动设备时，增加工具调用、设备版本和网络条件，但保持证据层次和 UNKNOWN 规则。报告的价值是可追溯，不是措辞漂亮。"], table: { headers: ["分类", "最小证据", "处置"], rows: [["TEST_FAIL", "断言/fixture", "修测试"], ["DEPENDENCY_BLOCKED", "依赖错误/环境", "修环境"], ["PRODUCT_FAIL", "Oracle/actual/Trace", "缺陷+回归"], ["UNKNOWN", "关键证据缺失", "补证再跑"]] } }],
  "TD-P08": [{ title: "P08 深入练习：发布证据要能回答‘为什么现在可以’", body: ["从一个错误码变更开始，逐层检查 source、requirement、risk、oracle、case、run 和 receipt。影响集不是文件列表，而是哪些行为预期和发布判断已经失效。未选回归必须写理由，不能因为时间紧就默默跳过。", "把 Evidence Pack 分成通过、失败、UNKNOWN、残余风险、Waiver 和 rollback 条件，并给每一项写消费者。发布 owner 需要看到风险如何被控制，而不是只看到一个总分。AI 可以帮聚合引用，但不能签字接受风险。", "如果模型/Prompt/索引版本更新，重新冻结 hash、运行相关 Eval 和安全门禁；旧 PASS 只有在依赖图与桥接证据证明不受影响时才可复用。任何复用都要写范围和理由。", "迁移到真实团队时提交 Change Set、Impact Set、回归选择、证据包和发布评审记录。事故复盘反向验证是否遗漏了某个节点，修复后把新失败加入回归资产。"], table: { headers: ["发布问题", "需回答", "不能用"], rows: [["为何重跑这些", "影响集/风险", "按目录猜"], ["谁批准", "具名 owner", "AI 自动放行"], ["旧证据能否复用", "依赖图/桥接", "最近一次 PASS"]] } }],
};

const wave3CaseStudyBlocks: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 案例复盘：为什么这一页必须阻断下游", body: ["在真实项目里，需求评审往往不是一次会议，而是多个版本在不同群组里并行流动。产品文档可能在周一批准，技术设计在周三更新，接口文档却由服务团队继续引用旧状态。测试开发的工作不是判断谁说话更有分量，而是把每个版本、owner 和生效范围放入同一份证据包。", "学员可以模拟一次版本漂移：先用 PRD-v3 生成 basis，再把 TECH-a13f 的 SHIPPED 规则改成相反内容，观察冲突门禁是否阻断。若流水线仍生成测试，说明 authority 没有真正接入；若只报格式错误，说明语义门禁太晚。修复后保留旧冲突报告，建立新的裁决版本和回归样例。", "把这个过程带到自己的团队时，应先问三个问题：哪份资料是业务规则权威，谁批准实现约束，哪一版变更可以进入测试。回答不了其中任何一个，就不要让 AI 代替组织决策。最终的可复用资产应包含来源索引、冲突表、裁决记录、下游入口状态和复现命令。", "页面的完成不是‘我会整理文档’，而是别人能用你的包继续做需求契约、风险分析和用例设计，并知道哪些地方仍需要人工确认。"], table: { headers: ["复盘问题", "证据", "错误信号"], rows: [["哪份规则有效", "批准版本与 owner", "只按修改时间判断"], ["冲突是否阻断", "SOURCE_CONFLICT receipt", "仍自动生成 case"], ["修复是否可复用", "新 basis+regression", "覆盖旧历史"]] } }],
  "TD-P02": [{ title: "P02 案例复盘：一份契约如何被不同角色消费", body: ["产品 owner 关注 actors、业务规则和验收；开发关注状态、接口和副作用；测试开发关注 Oracle、边界和未知；发布 owner 关注残余风险。Requirement Contract 的价值是让这些角色消费同一组结构化字段，而不是各自从摘要里猜意思。", "在订单案例中，actors 缺失会让非所有者权限测试消失，state_transitions 缺失会让 CANCEL_PENDING 卡死无人检查，side_effects 缺失会让重复退款无法观察。学员应把每个字段挂到一个下游工件，并用 mutation 删除它，确认至少一个测试或评审问题变红。", "迁移到自己的业务时，先画消费者矩阵再设计 schema。字段太多不一定专业，关键字段缺失才危险。若某项规则只有口头说法，记录 Unknown 和需要访谈的角色；若两个来源冲突，保留双方而不是自动合并。", "一份合格契约应能支持后续页面直接开始风险和 Oracle 讨论，同时明确哪些条件不能进入自动化。"], table: { headers: ["角色", "消费字段", "判定"], rows: [["产品", "actors/规则/例外", "业务语义已批准"], ["开发", "状态/接口/副作用", "机制可实现"], ["测试", "Oracle/unknowns", "可检出且可阻断"], ["发布", "风险/残余", "可做责任决定"]] } }],
  "TD-P03": [{ title: "P03 案例复盘：从接口成功到业务最终一致", body: ["一个 POST /cancel 返回 202 只表示请求被受理，不表示退款完成。技术文档必须说明 CANCEL_PENDING 如何进入 CANCELLED、退款 Worker 失败时是否重试、重复事件如何去重、支付网关回调如何关联，以及最终状态在哪里观察。测试开发要把这些问题转成状态、事件和审计三条证据链。", "学员可执行一次人工故障演练：在事件发布后阻断 ACK，再重放消息；检查 refund_count、trace_id、audit.cancel_id 和最终状态。如果系统只给出‘重试成功’，但没有证明一次副作用，结论只能是 Unknown。修复设计后重新生成契约，并让原问题保留在变更历史。", "迁移到异步审批或文件处理时，改变业务名词不改变审查逻辑。每个组件都要有责任边界，每条跨服务边都要有失败恢复，每个副作用都要有幂等和审计。没有这些信息，不能把架构图当完成证据。", "学员的最终作品是能被开发、测试和 SRE 共同使用的技术契约，而不是一张只展示正常路径的漂亮图。"], table: { headers: ["层次", "案例问题", "下游工件"], rows: [["接口", "202 代表什么", "契约/状态"], ["消息", "重复是否安全", "幂等/属性"], ["运行", "失败如何恢复", "Trace/runbook"]] } }],
  "TD-P04": [{ title: "P04 案例复盘：高风险不是高数量", body: ["策略评审中，团队很容易把‘覆盖所有路径’当作目标，却没有回答哪种失败最值得先控制。已发货退款涉及资金和权限，必须优先保证状态、账本和事件 Oracle；一个按钮文案错误可能影响体验，但不应挤掉副作用一致性验证。", "学员可以给三类风险分别做成本—检测力分析：契约测试便宜但看不到支付真实副作用，集成测试能观察事件却更难稳定，E2E 能证明用户路径却定位慢。策略不是选一个万能层级，而是组合最小充分证据，并记录时间、数据、环境和监控约束。", "迁移到 AI 应用时，风险还包括数据泄露、拒答边界、引用错误、工具越权、成本和延迟。方法必须随失败模型变化；生成式任务不能只沿用传统状态码断言，必须增加金标、Rubric、Trace 和人工升级条件。", "页面完成证据是一份能解释取舍的策略，而不是一张按严重度排序的清单。"], table: { headers: ["取舍", "可能收益", "必须承认的限制"], rows: [["契约优先", "快且稳定", "看不到跨服务副作用"], ["集成优先", "接近真实机制", "环境和归因成本高"], ["E2E 优先", "用户路径完整", "慢、难定位、覆盖有限"]] } }],
  "TD-P05": [{ title: "P05 案例复盘：一条用例为什么要有多个观察面", body: ["‘取消成功’不是一个状态码。对已支付未发货订单，测试开发要同时观察接口受理、状态迁移、退款事件、账本金额、审计记录和幂等结果。任何一面缺失，测试都可能在业务已经出错时保持绿色。", "学员先从批准规则写 Oracle Registry，再写 case。金额由独立公式计算，状态由状态机判定，副作用由事件和账本不变量判定，权限由角色规则判定。让实现先运行再复制输出，会把实现缺陷固化成期望。", "迁移到 RAG 或 Agent 时，Oracle 不一定是字符串相等，可以是引用集合、事实一致性、工具权限不变量或人工升级 Rubric。但必须说明来源、版本、适用范围和判定者，不能把模型自评当独立真值。", "提交的作品应让审阅者能从一条 expected 反查到批准规则，并能指出哪些是 Inference、哪些仍是 Unknown。"], table: { headers: ["观察面", "为何需要", "缺失后果"], rows: [["接口", "兼容和错误码", "客户端误判"], ["状态", "业务生命周期", "卡在中间态"], ["副作用", "资金/事件安全", "重复或漏发"], ["审计", "责任追踪", "无法复盘"]] } }],
  "TD-P06": [{ title: "P06 案例复盘：同一个 Test Package 可以跨执行器", body: ["测试语义和执行实现应分离。P05 的 case 定义了订单、风险、Oracle 和预期；API runner、Playwright 和 Cypress 只是不同 adapter。这样换框架不会重新发明业务规则，也能比较不同端的执行证据。", "学员把同一条‘已发货禁止退款’分别映射到接口和浏览器：接口检查 409、状态和事件；浏览器检查提示、按钮状态和请求 trace。两端都要引用同一个 oracle_id，任何一端吞异常或修改 expected 都应被审查发现。", "迁移到真实项目时，先冻结 cwd、依赖、凭据、数据清理和报告路径。生产账号、未脱敏数据或不受控副作用都不应进入教学脚本。对 flaky 重试必须保存每次结果，否则无法知道修复是否真实。", "最终工件是 adapter contract、运行报告和失败回放，而不是一段只能在作者电脑上执行的脚本。"], table: { headers: ["分层", "可复用内容", "需替换内容"], rows: [["Test Package", "风险/Oracle/case", "不替换业务规则"], ["Adapter", "契约映射约束", "框架/locator/请求"], ["Runner", "证据格式", "环境和命令"]] } }],
  "TD-P07": [{ title: "P07 案例复盘：报告中的空白也是事实", body: ["当支付依赖超时、Trace 丢失或数据版本未知时，最专业的结论不是猜 PRODUCT_FAIL，而是明确 UNKNOWN/DEPENDENCY_BLOCKED。报告要写缺什么、为什么影响归因、下一步如何补证，以及谁消费这个决定。", "学员可以把一条完整失败故意删掉构建 hash 或 raw actual，再运行归因门禁；若仍输出确定根因，说明系统在编故事。修复是让证据缺失传播为 Unknown，并保留原始失败，等补齐版本或依赖后重跑。", "迁移到多端执行时，增加设备、浏览器、网络、模型和工具版本，但不要把字段当装饰。只有它们能支持复现或排除某层，才有必要进入 manifest。", "页面完成标准是别人可以沿 manifest 重放或明确指出不能重放的原因，而不是报告文字看起来像专家结论。"], table: { headers: ["缺失信息", "不能做的判断", "补证动作"], rows: [["构建 hash", "不能比较版本", "锁定构建重跑"], ["raw actual", "不能判产品失败", "恢复原始报告"], ["依赖状态", "不能排除环境", "记录服务状态"]] } }],
  "TD-P08": [{ title: "P08 案例复盘：发布材料如何支持责任决定", body: ["发布候选必须把变更、影响、回归和残余风险串起来。错误码从 409 改为 422 会影响客户端解析、契约测试、文档和监控；Prompt 或模型 hash 变化会影响测试候选与 Eval。只重跑一条 happy path 不能证明这些依赖仍然成立。", "学员先生成 Impact Set，再选择回归集，记录未选项和理由。Evidence Pack 中把通过、失败、Unknown、Waiver 和 rollback 条件分开；发布 owner 只在证据充分时接受风险。AI 可以做聚合，却没有发布权限。", "迁移到 RAG 时，索引、切分、检索和引用是影响节点；迁移到 Agent 时，工具 schema、权限、审计和 handoff 是影响节点。每次变更都需新的 hash、相关 Eval 和安全检查。", "事故复盘时沿 lineage 反查是否遗漏节点；新增失败应回到风险、Oracle 和回归资产，而不是只修一次线上配置。"], table: { headers: ["材料", "回答的问题", "责任人"], rows: [["Change Set", "变了什么", "研发/架构"], ["Impact Set", "影响了谁", "测试开发"], ["Evidence Pack", "证据够不够", "发布 owner"], ["Rollback", "失败怎么办", "运行 owner"]] } }],
};

const wave3FinalPractice: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 最后练习：从资料包写出下一步任务", body: ["完成依据冻结后，不能只说‘可以开始测试’。请把每个未知写成具体问题：谁确认已发货订单规则，何时给出裁决，裁决会更新哪个版本；把每个冲突写成禁止下游动作；把每个已批准规则写成下一页要消费的字段。这样测试开发交出的不是摘要，而是一张可以排进迭代的任务清单。", "当同事拿到你的包时，他应该能从 manifest 找到原文，从 conflict 找到责任人，从 basis receipt 找到版本，从 handoff 找到下游输入。如果任何一步要靠口头解释，说明工件还不可复用。迁移到其他业务只允许替换事实，不允许改变这条证据链。"], table: { headers: ["检查项", "完成证据"], rows: [["未知转问题", "owner+close_with"], ["冲突阻断", "BLOCKED receipt"], ["下游交接", "versioned handoff"]] } }],
  "TD-P02": [{ title: "P02 最后练习：把契约当成团队接口", body: ["把 contract.json 发给产品、开发、测试三位角色，让他们分别指出一个自己需要的字段和一个不能接受的推断。若三人对同一状态的理解不同，契约不能进入测试生成；应回到 source_refs 和 owner，而不是在页面上自行修正。", "再将一个 unknown 转成可关闭的问题，并保留问题前后两个版本。这样学习者能看到契约不是一次性模型输出，而是会被评审、版本化、消费和回归的团队接口。迁移时保留字段语义和状态，不照抄订单值。"], table: { headers: ["团队接口", "复用方式"], rows: [["产品", "确认规则和例外"], ["开发", "确认状态与副作用"], ["测试", "确认 Oracle 和门禁"]] } }],
  "TD-P03": [{ title: "P03 最后练习：用一个故障验证架构可测性", body: ["选择一条跨服务链，写出正常、超时、重试、重复、降级和恢复六种路径，并为每条路径列出可观察的状态、事件、日志和 Trace。若某路径只有‘系统应恢复’而没有终态或 owner，它不是可执行契约。", "让架构 owner 只关闭有证据的问题：补充状态机、幂等键、死信策略或告警样例。关闭后重跑技术矩阵和故障测试，并把旧缺口留在历史。迁移到新系统时重画组件图，不复制旧服务名。"], table: { headers: ["路径", "必须有"], rows: [["正常", "状态/响应/事件"], ["失败", "错误/Trace/告警"], ["恢复", "终态/补偿/owner"]] } }],
  "TD-P05": [{ title: "P05 最后练习：做一次 Oracle 交叉评审", body: ["邀请不参与实现的人复核三条高风险 expected：已发货拒绝、重复退款只产生一次副作用、金额计算与账本一致。复核者只能看批准规则和 Oracle Registry，不能看实现当前输出；若他无法独立判断，说明 Oracle 仍被实现污染。", "评审后把发现的问题变成 mutation 或回归样例，并给出 owner、版本和下一次重跑命令。迁移到生成式结果时，补 Rubric、金标和人工升级条件；不要用流畅度替代正确性。"], table: { headers: ["复核", "结果"], rows: [["规则独立", "可复算 expected"], ["副作用独立", "可检查账本/事件"], ["变异可杀", "有 detection receipt"]] } }],
  "TD-P06": [{ title: "P06 最后练习：让自动化证据可以交接", body: ["把执行命令交给另一台干净环境运行，检查 cwd、依赖、fixture、凭据、退出码和报告路径是否足够。若只能在作者机器上运行，状态是 ENV_BLOCKED，不是 PASS。把首败、重试、跳过和清理结果一并交给下游。", "选择一个 Playwright 或 Cypress adapter，写出它与 Test Package 的字段映射和禁止行为。框架升级、locator 改动或接口字段变化都要触发影响分析；不要在 adapter 中静默改 Oracle。"], table: { headers: ["交接", "证据"], rows: [["可运行", "固定 cwd/依赖"], ["可归因", "原始日志/Trace"], ["可复用", "contract+版本"]] } }],
  "TD-P07": [{ title: "P07 最后练习：报告读者不应猜你的结论", body: ["把一份失败报告交给没有参与执行的人，让他只看 Run Manifest 判断是产品、测试、环境、依赖还是未知。如果他无法判断，记录缺少的字段并设计补证动作；不要在报告里添加未经证实的根因。", "修复后用同一 basis 重放，并在新报告中引用旧失败。若期间需求、代码、数据或 Prompt 变了，建立新版本并说明不可直接比较。迁移到多端执行时保留这种版本和证据纪律。"], table: { headers: ["读者测试", "合格表现"], rows: [["能复现", "命令和版本齐全"], ["能归因", "Oracle/actual/Trace"], ["能行动", "下一实验明确"]] } }],
  "TD-P08": [{ title: "P08 最后练习：把发布候选变成可问责决定", body: ["请用一页表格回答四个问题：本次变更影响了哪些风险，哪些回归被选择或跳过，哪些证据仍 UNKNOWN，谁接受剩余风险。没有 rollback owner 或 Waiver 的候选不能进入发布会议的最后一格。", "让发布 owner 只签署有引用的风险，不签署模型摘要。发布后把事故或用户反馈回灌到 impact graph、Oracle、case 和监控；这样回归资产会增长，而不是每次从零开始。迁移到 RAG/Agent 时同样保留 lineage。"], table: { headers: ["发布问题", "必填"], rows: [["影响", "Impact Set"], ["证据", "PASS/FAIL/UNKNOWN"], ["责任", "owner/Waiver/Rollback"]] } }],
};

const wave3Closure: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 交付闭环", body: ["最后请把本页交付拆成输入、处理、输出和门禁四段。输入是已脱敏且有版本的 PRD、技术文档和接口资料；处理是切分 source_ref、登记冲突和确认 authority；输出是 basis、conflict、裁决和下游 handoff；门禁是任何关键冲突都不得进入生成。每段都写消费者，避免材料只是展示。", "用一个新版本验证闭环：只改文档 hash，不改业务规则，系统应能识别版本变化并要求重新确认；只改业务规则，影响集应触发 Oracle、case 和 receipt 失效。迁移时保留这两个实验，能证明你掌握的是生命周期，而不是订单名词。", "若评审者无法在十分钟内从任意 case 找回原文和裁决，退回 source package；若能找回来源却找不到责任人，退回 governance；若责任齐全却没有下游消费者，退回 artifact design。这样的退回理由本身也是可复用的质量门禁。" ] }],
  "TD-P02": [{ title: "P02 交付闭环", body: ["完成契约后，按‘被谁消费’做一次走查。产品看规则和例外，研发看状态、接口和副作用，测试看 Oracle 和边界，发布看风险和未知。每个字段必须能指向一个后续动作，否则不要为了完整而保留。", "做一轮反向删除实验：删掉 actors，观察权限用例；删掉 state_transitions，观察非法状态；删掉 side_effects，观察幂等和审计；删掉 unknowns，观察模型是否开始猜测。把这些结果写入 contract validation receipt，证明 schema 字段有实际价值。", "迁移到任何业务都应先重建消费者矩阵，再替换字段值和来源；不能把订单状态直接复制到会员或支付。若新业务没有批准 Oracle，契约只能停在 BLOCKED/UNKNOWN。" ] }],
  "TD-P03": [{ title: "P03 交付闭环", body: ["技术解析的完成条件不是说清组件名称，而是能够指导一次失败演练。请为同步、异步、重试、超时、回滚和恢复各写一条可观察断言，并指出它来自哪份设计或需求。没有依据的细节不应被模型补出来。", "把 architecture review 交给开发和 SRE 复核：开发确认实现约束，SRE 确认告警、回滚和运行证据。两者意见冲突时保留双方并升级架构 owner。修复后更新矩阵、状态图和测试输入，历史缺口不可删除。", "迁移到新系统时重新定义事件和状态，但保留‘组件—接口—状态—失败—观察—恢复—责任’七列。评审者能据此直接选择测试层级，说明页面工件可复用。" ] }],
  "TD-P04": [{ title: "P04 交付闭环", body: ["策略表应能解释资源不足时先做什么、不能做什么。对高损失且可独立验证的风险优先安排 deterministic gate；对未知行为安排探索和人工升级；对环境不稳定的证据先修环境。不要用模型置信度替代风险依据。", "请把一个风险从 failure model 推到 method、Oracle、data、monitoring、owner 和 residual decision，形成一条可审计链。任何断点都标 UNKNOWN，并写补证实验。迁移时只替换风险事实，保留这条链。", "复盘时比较策略与真实故障：漏错说明方法或 Oracle 不匹配，定位慢说明层级选择不当，无法放行说明责任边界缺失。将复盘结论回写 risk register 和 regression plan。" ] }],
  "TD-P05": [{ title: "P05 交付闭环", body: ["Oracle Registry 通过后，再检查每条 case 的输入是否覆盖边界、权限、并发、重试和恢复。不要用更多 happy path 代替失败面。每条 expected 都要能由独立规则或计算重现，并保留判定证据。", "安排一次 blind review：复核者只拿 basis、Oracle 和 case，不看实现输出，独立写 expected，再和测试包比较。差异必须回到来源或 owner；不能把两份结果平均。将盲审发现变成 mutation 或回归资产。", "迁移到生成式系统时，增加 Rubric、金标集、Judge 校准和人工升级；迁移到 Agent 时增加工具副作用和权限不变量。页面完成意味着能交付可审计 TestPackage，而不是生成几条文本。" ] }],
  "TD-P06": [{ title: "P06 交付闭环", body: ["执行器接入前要确认数据复位、凭据最小权限、依赖可达和报告持久化。测试代码只能消费批准的 TestPackage，不能在运行时重写业务规则。每次失败都保留原始输入、输出和清理结果。", "做一次跨框架复用：同一个 API case 用 API runner 和 Playwright 各跑一遍，比较二者是否引用同一 oracle_id、是否产生等价业务证据。若浏览器只验证文案，说明它不能替代接口和副作用测试。", "迁移到 CI 或飞书工作流时，替换调度和通知，不改变 fail-closed 退出码、artifact 路径和责任人字段。任何跳过、吞错、无限重试都必须在 review 中被拒绝。" ] }],
  "TD-P07": [{ title: "P07 交付闭环", body: ["报告的第一读者不是模型，而是下一位工程师。请让他只凭 manifest 复现一次运行，确认能区分产品、测试、环境、依赖和未知。复现不了时，报告应直接告诉他缺哪个版本或原始文件。", "对一次修复保留 before/after 两份 receipt，写清哪些证据相同、哪些证据更新；若输入或 Prompt 变化，旧报告不能继续当 baseline。迁移到 Agent trace 时记录工具调用和状态，但仍要保留选择集与 Oracle。", "最终提交归因表、补证清单、重跑命令和下游决策摘要。报告不需要华丽，但必须让错误分类和下一步动作可审计、可复用。" ] }],
  "TD-P08": [{ title: "P08 交付闭环", body: ["发布候选必须把变更影响和证据状态放在同一页面。请逐项确认已选回归有理由、未选回归有风险说明、UNKNOWN 有补证动作、残余风险有具名接受人、回滚条件可执行。没有这些字段，候选只能 BLOCKED。", "做一次 stale 练习：改动错误码、Prompt hash 或索引版本，观察旧 PASS 是否失效；如果没有失效，修依赖图和 receipt 传播，而不是手动改分数。迁移到其他业务保留这个练习，能防止旧真相污染新发布。", "发布后把事故、用户反馈和监控漂移回写成新的 risk、Oracle、case 和 Eval。这样课程工件形成闭环，团队每次变更都能复用，而不是回到一次性文档。" ] }],
};

const wave3DepthFinish: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 深度准出：让下一页可以直接开工", body: ["完成 S1 后，下一页不应重新猜来源。请在 handoff 中逐项写出已批准规则、未决冲突、下游消费者和禁止动作；例如‘只允许未发货取消’可交给契约页，‘退款时限未定义’必须作为 Unknown 交给需求 owner。", "如果下游发现同一 locator 有两个版本，回退到本页重建 manifest，而不是在需求契约中偷偷选一个。迁移到新业务时同样提交新版本、冲突回归和责任人签名，证明依据包可独立复核。" ] }],
  "TD-P02": [{ title: "P02 深度准出：用坏输入证明契约有牙齿", body: ["把一个不存在的退款时限、一条缺失来源的权限规则和一个非法状态转换同时注入契约。预期不是三个格式错误，而是分别被 source、semantic 和 authority 门禁识别，并给出 owner、close_with 和下游阻断。", "修复时只恢复批准输入和明确规则，不让模型补全。然后将修复后的 contract 交给风险页，确认它能读取状态、不变量、副作用和 unknowns。若下游仍需要口头解释，契约尚未达到可复用标准。" ] }],
  "TD-P03": [{ title: "P03 深度准出：每个失败都能落到观察点", body: ["技术契约准出前，随机选择一个状态、一个依赖失败和一个副作用，要求你分别指出输入、预期终态、Trace/事件/审计证据和恢复 owner。说不出观察点的设计不能直接生成可靠用例。", "把验证结果交给风险页和运行页，确认它们可以选择方法、设计 Run Manifest 和归因。迁移时替换组件和事件，但保留失败恢复、可观测性和责任边界的四列。" ] }],
  "TD-P04": [{ title: "P04 深度准出：策略必须能解释取舍", body: ["选择一条高风险和一条低风险行为，写出为何使用状态、契约、集成或 E2E，以及每种方法看不到什么。若所有理由只是‘覆盖更全面’，说明没有分析失败机制和 Oracle。", "将策略交给执行团队时，附数据、环境、监控、时间和残余风险 owner；交给发布 owner 时，说明哪些证据仍 Unknown。迁移到 AI 系统要替换数据集、Eval、Judge 和安全风险，不能照抄传统层级。" ] }],
  "TD-P05": [{ title: "P05 深度准出：独立 Oracle 要能抵抗实现变化", body: ["把实现返回的错误金额或文本改掉，Oracle Registry 不应随之变化；把批准规则改掉，相关 case 才应变为 stale。通过这个双向实验，证明 Oracle 不是实现快照，也不是模型自评。", "把 registry、case matrix 和 mutation receipt 交给自动化页，确认每条断言都有 oracle_id、数据、清理和证据路径。迁移到生成式任务时，补金标和 Rubric，并明确何时升级人工。" ] }],
  "TD-P06": [{ title: "P06 深度准出：执行结果必须可追溯到语义", body: ["让同一个 TestPackage 在两个执行器中运行，比较业务 expected、oracle_id、selected/skipped、重试和原始报告。若只有框架日志没有业务证据，执行器并未完成测试责任。", "把失败和修复 receipt 交给归因页，确认它能分辨产品、测试、环境和未知。迁移到 CI、飞书或多端时替换调度器，不替换 fail-closed 退出码和责任字段。" ] }],
  "TD-P07": [{ title: "P07 深度准出：报告必须支持下一次决定", body: ["从报告中挑一条 PRODUCT_FAIL、一条 ENV_BLOCKED 和一条 UNKNOWN，分别写出谁消费、下一实验和是否进入发布证据。若三者都只给‘继续观察’，说明归因不够具体。", "修复后保留旧报告、补证动作和新 receipt；改变版本时显式 stale。迁移到 Agent trace 或移动端时增加必要运行字段，但不以模型摘要替代原始证据。" ] }],
  "TD-P08": [{ title: "P08 深度准出：发布候选必须可被拒绝", body: ["让发布 owner 面对一份故意缺少 rollback owner、一个 UNKNOWN 和一条 stale PASS 的 Evidence Pack，要求其明确拒绝原因。课程不是教人如何把材料写绿，而是教人如何阻止不充分证据进入发布。", "修复后重新计算 Impact Set、回归集和残余风险，生成新的候选证据。迁移到 RAG/Agent 时保留权限、安全、成本、引用和人工 handoff 的影响节点。" ] }],
};

const wave3FinalDepth2: Record<string, TutorialBlock[]> = {
  "TD-P01": [{ title: "P01 个人复用记录", body: ["请把一次真实脱敏评审写成一页记录：哪些段落已确认，哪些段落只是推断，哪些段落完全未知；每个判断都写 source_ref、owner 和下游消费者。记录不能只给结论，还要保留冲突被阻断的过程，便于新人理解为什么不能直接生成用例。", "当资料包交接给另一个测试开发时，他应能独立运行 conflict mutation、看到 BLOCKED、读取裁决后新版本并开始 P02。若交接者需要询问你‘这份文档到底哪个是真的’，说明 authority matrix 没有完成。迁移到新业务只替换事实和来源，不改变版本、责任和证据字段。" ] }],
  "TD-P02": [{ title: "P02 个人复用记录", body: ["请为每个契约字段写下消费者和一个会失败的测试。如果 actors 改错，权限测试应失败；如果 states 缺失，非法转换用例应失败；如果 side_effects 缺失，幂等和审计检查应失败。这样你是在验证契约推动了下游，而不是在堆字段。", "另一个人拿到 contract 后，应该能从 source_refs 找回原文、从 unknowns 找到待办、从 status 判断是否允许继续。迁移到审批或订阅业务时，先重建状态和副作用，再复用 schema 骨架；任何未批准的新规则继续保持 UNKNOWN。" ] }],
  "TD-P03": [{ title: "P03 个人复用记录", body: ["请选一个异步故障，写清第一次请求、消息投递、重试、重复、死信、补偿和最终终态；每一步都指定 Trace、事件、审计或指标。没有观察点的步骤不能作为测试预期，也不能把‘系统会恢复’当作设计契约。", "将 review questions 发给架构和 SRE，要求他们分别确认实现约束和运行恢复。冲突、缺 owner 或缺 safe terminal 都要阻断。迁移到文件处理或 Agent tool call 时重新命名组件，但保留失败恢复、幂等、权限和审计维度。" ] }],
  "TD-P04": [{ title: "P04 个人复用记录", body: ["请对三条风险写出选择理由：哪一层最早能检出，哪个 Oracle 独立，准备什么数据，失败怎样观察，谁接受残余风险。把拒绝的方法也写下，例如为什么只做 E2E 会使重复退款难以定位。没有依据的严重度和阈值不要填数字。", "交给执行团队的不是风险分数，而是可执行策略和门禁；交给发布 owner 的不是模型建议，而是证据状态和未闭合风险。迁移到 AI 时把风险改成数据泄露、检索遗漏、越权、成本或延迟，并重新选择 Eval、Trace 和安全方法。" ] }],
  "TD-P05": [{ title: "P05 个人复用记录", body: ["请让一个不了解实现的人只根据批准规则写 expected，再与 TestPackage 比较。若金额、状态或副作用不同，回到 Oracle Registry 查来源、版本和 owner；不要用实现返回值说服复核者。每个 case 都要同时覆盖 transport、state、event、audit 和 cleanup。", "完成一次 mutation 后，把 killed、survived、no coverage 和 tool error 分开处理。迁移到 RAG 或 Agent 时把 expected 换成金标、引用集合、权限不变量或 Rubric，但仍需独立评审和人工升级条件。" ] }],
  "TD-P06": [{ title: "P06 个人复用记录", body: ["请把同一 TestPackage 交给接口 runner 和浏览器 runner，比较两份报告是否引用同一 oracle_id，是否保存首败、重试、跳过、Trace 和清理证据。adapter 只能翻译执行，不得改变业务规则；如果两端结论冲突，先查证据而不是选更漂亮的一份。", "迁移到 CI、飞书工作流或多端执行时，固定 cwd、依赖、凭据和 artifact 路径，确保失败退出码不会被吞掉。没有真实凭据时保持 fixture-only；任何 integration、live 或 production 结论都必须另行运行。" ] }],
  "TD-P07": [{ title: "P07 个人复用记录", body: ["请把一份报告交给未参与执行的同事，让他判断 PRODUCT_FAIL、TEST_FAIL、ENV_BLOCKED、DEPENDENCY_BLOCKED 或 UNKNOWN。若无法判断，记录缺少的版本、原始日志、Trace 或 Oracle，不要追加未经证实的根因。报告的价值是让下一位工程师可以复现或知道为什么不能复现。", "修复后保留 before/after receipt，并说明 basis、代码、数据、Prompt 和环境哪些相同、哪些变化。迁移到 Agent trace 或移动设备时增加工具和设备字段，但不改变 Evidence/Inference/Unknown 规则。" ] }],
  "TD-P08": [{ title: "P08 个人复用记录", body: ["请让发布 owner 审阅一份故意缺少 rollback owner、包含 UNKNOWN 和 stale PASS 的 Evidence Pack，并要求他明确拒绝。只有当 Impact Set、回归选择、残余风险、Waiver 和回滚条件都闭合，才允许形成 RELEASE_CANDIDATE；它仍不等于已发布。", "迁移到 RAG 或 Agent 时，把索引、检索、引用、工具 schema、权限、审计和 handoff 纳入影响图。模型或 Prompt hash 变化必须重新评测，事故和用户反馈必须回流到 risk、Oracle、case 和监控。" ] }],
};

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

// content 入参保留给调用方做说明，但页面显示与复制的正文一律按 promptPath 从
// 物料查表：此前两处各写一遍，提示词重构后页面立刻过期。
const pagePrompt = (pageId: string, content: string): TechnicalBlock => ({
  kind: "prompt",
  // 生命周期八页面向的是小白：页面上要显示并可复制的是带输入粘贴区的直用提示词
  // prompt-v1.md，而不是同目录下给编排用的 task-v1.md。内容与 promptPath 必须
  // 指同一份文件，否则复制到的东西和标注的来源不是一回事。
  content: promptBody(`materials/requirements-to-evidence/page-prompts/${pageId}/prompt-v1.md`),
  version: "1.2.0",
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
    // 补充层 head：失效点 → 架构索引 → 指标卡，排在本页自有内容之前。
    ...requirementsLifecycleSupplement(page.id).head,
    ...page.blocks.map((block, index) => migrateTechnicalBlock(page.id, block, index + 1)),
    ...(methodologyStageBlock(page.id) ? [methodologyStageBlock(page.id)!] : []),
    ...methodologyExtraBlocks(page.id),
    ...(wave2LifecycleBlocks[page.id] ?? []),
    ...(wave3DepthBlocks[page.id] ?? []),
    ...(wave3TransferBlocks[page.id] ?? []),
    ...(wave3DeepeningBlocks[page.id] ?? []),
    ...(wave3CaseStudyBlocks[page.id] ?? []),
    ...(wave3FinalPractice[page.id] ?? []),
    ...(wave3Closure[page.id] ?? []),
    ...(wave3DepthFinish[page.id] ?? []),
    ...(wave3FinalDepth2[page.id] ?? []),
    directUsePromptBlock(page.id),
    // 补充层 tail：三段式门禁。
    ...requirementsLifecycleSupplement(page.id).tail,
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
