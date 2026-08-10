import type { TutorialPage } from "../course.ts";

const apiExecutableMaterials: NonNullable<TutorialPage["materials"]> = [
  { title: "API 专项完整实验包", description: "离线脚本、OpenAPI、事件夹具、配置、指南与红绿报告。", href: "materials/api-ai-automation.zip", kind: "archive", validation: "fixture-tested" },
  { title: "API 红绿实验脚本", description: "从材料根目录直接运行 baseline、mutation、repair，预期退出码 0/1/0。", href: "materials/api-ai-automation/scripts/api_automation.py", kind: "script", validation: "fixture-tested" },
  { title: "API 实验运行说明", description: "给出可复制命令、预期结果、外部工具 NOT_RUN 边界和迁移步骤。", href: "materials/api-ai-automation/README.md", kind: "guide", validation: "fixture-tested" },
];

const uiExecutableMaterials: NonNullable<TutorialPage["materials"]> = [
  { title: "Web/Android/iOS 专项实验包", description: "UI 契约脚本、四类业务夹具、设备矩阵、指南与平台样例索引。", href: "materials/ui-mobile-automation.zip", kind: "archive", validation: "fixture-tested" },
  { title: "UI 契约红绿脚本", description: "验证稳定定位器和业务 Oracle，预埋缺失字段后变红，再恢复为绿。", href: "materials/ui-mobile-automation/scripts/ui_contract_lab.py", kind: "script", validation: "fixture-tested" },
  { title: "UI/移动端实验说明", description: "给出 0/1/0 命令，并区分离线夹具与浏览器、模拟器、真机 NOT_RUN。", href: "materials/ui-mobile-automation/README.md", kind: "guide", validation: "fixture-tested" },
];

const reliabilityExecutableMaterials: NonNullable<TutorialPage["materials"]> = [
  { title: "稳定性与故障注入实验包", description: "负载配置、Chaos 实验卡、Trace 契约、Runbook 和三组机器报告。", href: "materials/reliability-chaos-observability.zip", kind: "archive", validation: "fixture-tested" },
  { title: "稳定性红绿实验脚本", description: "模拟队列、重试、工具调用和成本，故障配置必须以退出码 1 被门禁拦截。", href: "materials/reliability-chaos-observability/scripts/reliability_lab.py", kind: "script", validation: "fixture-tested" },
  { title: "稳定性实验运行说明", description: "给出 0/1/0 命令、报告位置和 K8s/Chaos Mesh/生产环境 NOT_RUN 边界。", href: "materials/reliability-chaos-observability/README.md", kind: "guide", validation: "fixture-tested" },
];

// 主文件已有来源 ID 暂用于本组页面。后续应在 course.ts 的 sourceNotes 中补充/核对：
// https://spec.openapis.org/oas/ | https://docs.pact.io/ | https://www.rfc-editor.org/rfc/rfc9110.html
// https://playwright.dev/docs/intro | https://developer.android.com/training/testing/espresso
// https://developer.apple.com/documentation/xctest | https://opentelemetry.io/docs/concepts/signals/
// https://sre.google/sre-book/monitoring-distributed-systems/ | https://principlesofchaos.org/
// https://docs.vllm.ai/en/latest/design/metrics/ | https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_benchmark/genai-perf-README.html

export const professionalSpecializationPages: TutorialPage[] = [
  {
    id: "TD-PS01", moduleId: "TD-M08", order: 1, title: "API 业务契约：从 HTTP 结果到可验证副作用", type: "跟做", status: "desk-researched", duration: "55 分钟",
    summary: "以订单取消与退款 API 为业务场景，建立协议、Schema、业务不变量和副作用四层断言。",
    why: "生产事故常发生在接口返回成功、状态却没有推进，或重试造成重复副作用的瞬间。测试开发需要证明业务结果，而不是收集 200 数量。",
    prerequisites: ["TD-P08"], outcomes: ["拆出协议、Schema、业务和副作用 Oracle", "为幂等与错误模型设计可重放请求", "把 Trace 和状态证据接入发布判断"], artifact: "API 业务契约测试包与运行 Manifest",
    blocks: [
      { title: "业务场景与风险边界", body: ["订单取消接口允许已支付且未发货订单进入 CANCEL_PENDING，并发出一次退款事件。风险包括已发货误取消、非订单所有者越权、超时后服务端已成功、重复请求重复退款，以及事件消费延迟。", "把可接受结果写成状态机和不变量：退款次数不超过一次、退款金额不超过实付金额、拒绝请求不改变订单状态。"] },
      { title: "实现与配置四层 Oracle", body: ["请求层验证 method、状态码、Header 和超时；Schema 层验证字段类型与错误结构；业务层验证角色、状态转换与金额；副作用层查询事件账本或受控 Stub。每层失败都保留 request_id、trace_id 和数据快照。"], code: "POST /orders/O-42/cancel\nheaders: Idempotency-Key: cancel-O-42-1\nassert: status in [202,409]\nassert: refund_count_delta == 1\nassert: trace_id is present", expected: "正常请求只有一个退款意图；同一幂等键重放不会增加退款计数。" },
      { title: "SOP：先探针，再主流程，再故障", body: ["先确认服务版本、数据库迁移、事件消费者和测试账户，再执行成功、权限拒绝、非法状态、重复请求四组用例。每组都保存前后状态，避免只看响应体。", "发布门禁按照 blocker 优先：越权、重复扣款、状态倒退先阻断；普通文案差异进入人工复核。"] },
      { title: "指标与报告口径", body: ["至少记录业务成功率、错误模型覆盖率、幂等冲突率、事件端到端延迟 p95、重复副作用数和 Trace 完整率。平均响应时间不能替代事件完成时间，HTTP 成功率也不能替代业务成功率。"], table: { headers: ["指标", "分母", "动作"], rows: [["业务成功率", "接受的有效订单请求", "低于基线阻断"], ["副作用重复率", "重放请求组", "非零即调查"], ["事件延迟 p95", "已接受的取消事件", "触发异步链路诊断"]] } },
      { title: "故障注入、诊断与 AI 边界", body: ["注入退款服务超时、事件重复和数据库只读，检查是否有有界重试、补偿和死信。诊断顺序是响应→Trace→服务日志→账本→事件消费；AI 只能聚类失败和提出候选根因，不能批准退款语义或替代账本 Oracle。"] },
    ],
    practice: ["为取消接口补齐成功、拒绝、重放和依赖超时四组请求", "注入一次重复事件并证明账本不重复", "输出带 trace_id、状态前后值和发布结论的运行 Manifest"], completion: ["四层 Oracle 均有独立断言", "故障注入能稳定变红且诊断链完整", "报告明确阻断项、责任人和回滚条件"], sourceIds: ["S44", "S61", "S45"], evidenceBoundary: "页面方法依据 OpenAPI、HTTP 语义和 Pact 官方资料整理；接口、账本、事件和重试语义未在目标系统真实运行，阈值必须用目标业务风险校准。",
    architecture: { title: "取消请求的证据链", caption: "请求经过网关、领域服务和账本后，还必须证明事件副作用与最终状态；任一关键证据缺失都不能把响应 202 当成业务完成。", nodes: ["调用方与幂等键", "API Gateway", "订单领域服务", "订单/退款账本", "事件总线与消费者", "Trace/日志/指标", "发布门禁"] },
    materials: [{ title: "API 取消契约夹具", description: "订单取消 OpenAPI、错误模型和状态不变量。", href: "materials/api-ai-automation/fixtures/order-cancel.openapi.yaml", kind: "fixture", validation: "static-reviewed" }, { title: "API 运行 Manifest", description: "记录环境、数据、Trace 和副作用断言。", href: "materials/api-ai-automation/guides/api-run-manifest.md", kind: "guide", validation: "static-reviewed" }, ...apiExecutableMaterials],
  },
  {
    id: "TD-PS02", moduleId: "TD-M08", order: 2, title: "OpenAPI Schema 与属性测试：让坏请求和破坏性变更变红", type: "跟做", status: "desk-researched", duration: "50 分钟",
    summary: "围绕支付意图 API，结合正反例、Schema 变异和业务属性测试，识别只校验格式的假覆盖。", why: "Schema 通过不等于业务正确；结构化 API 最容易把测试退化成字段类型检查。", prerequisites: ["TD-PS01"], outcomes: ["从 OpenAPI 生成受控正反例", "区分 Schema 失败和业务属性失败", "用 mutation 证明测试确实有检测力"], artifact: "OpenAPI 负向测试集、属性清单与 mutation 报告",
    blocks: [
      { title: "场景：支付意图的边界不是字段类型", body: ["支付意图包含 amount、currency、merchant_id、customer_id 和 return_url。除了 required/type，还要检查金额大于零、币种与商户配置匹配、客户只能访问自己的意图、过期意图不能再次确认。", "把每个字段约束映射到风险和 Oracle，避免生成大量没有业务意义的随机字符串。"] },
      { title: "实现：正反例与 Schema 变异", body: ["使用 OpenAPI 作为输入生成边界、缺字段、额外字段、非法枚举和错误 Content-Type；再人工补充跨字段约束。对服务契约删除 required、放宽金额范围、改变错误码，验证门禁能捕获破坏性变化。"], code: "cases = [valid_payment, amount_zero, currency_unknown, owner_mismatch, expired_intent]\nfor case in cases:\n    response = client.send(case)\n    assert oracle(response, case)\nmutation: remove_required('merchant_id')\nmutation: allow(amount <= 0)", expected: "每个负向样例都有明确错误模型；契约 mutation 至少使一个检查失败，而不是全套仍然绿色。" },
      { title: "SOP：生成、审查、执行、最小重放", body: ["固定规范版本和随机种子，先做 Schema 校验，再做服务执行；失败时缩减到最小请求、最小数据和单一变异。将不可重复的外部依赖标记 UNKNOWN，不把网络波动算成产品缺陷。"] },
      { title: "指标：覆盖质量而不是样例数量", body: ["报告 Schema 分支覆盖、业务属性覆盖、错误模型覆盖、mutation 发现率、最小复现率和无效请求拒绝率。生成 1,000 个样例但 mutation 发现率为零，说明 Oracle 或测试层级有问题。"] },
      { title: "注入、诊断与 AI 边界", body: ["注入类型放宽、字段删除、错误码改写和跨字段规则删除；诊断顺序是规范 diff→请求样例→服务日志→业务状态。AI 可提出边界候选与解释 diff，但不得把合法 JSON 自动判为合法业务请求。"] },
    ], practice: ["从一个 OpenAPI 操作生成并审查 10 个正反例", "删除一个 required 字段并验证 mutation 门禁失败", "把一个跨字段规则写成独立属性并生成最小重放"], completion: ["每个关键约束有业务 Oracle", "至少一种契约破坏会阻断", "报告区分结构、业务和环境失败"], sourceIds: ["S44", "S61", "S43"], evidenceBoundary: "OpenAPI 与 HTTP 来源支持规范和协议测试方法；Schema 变异、随机数据分布和服务业务规则没有在目标 API 上执行验证，教学样例不代表实际覆盖率。",
    architecture: { title: "规范到最小失败请求", caption: "Schema 只是入口，属性和状态才是业务证据；变异器制造坏契约，报告必须回链到最小请求和对应风险。", nodes: ["OpenAPI 版本", "例生成器", "Schema 校验器", "业务属性 Oracle", "被测 API", "Mutation 控制器", "报告与门禁"] },
    materials: [{ title: "支付意图规范夹具", description: "含边界、错误和跨字段约束的 OpenAPI 文件。", href: "materials/api-ai-automation/fixtures/payment-intent.openapi.yaml", kind: "fixture", validation: "static-reviewed" }, { title: "Schema Mutation 清单", description: "可审查的破坏性变更与预期失败。", href: "materials/api-ai-automation/configs/schema-mutations.yaml", kind: "config", validation: "static-reviewed" }, ...apiExecutableMaterials],
  },
  {
    id: "TD-PS03", moduleId: "TD-M08", order: 3, title: "契约、事件与鉴权：测试跨服务边界的真实兼容性", type: "诊断", status: "desk-researched", duration: "55 分钟",
    summary: "以购物车结算事件为例，覆盖消费者契约、版本兼容、租户隔离、重复投递、乱序和补偿。", why: "服务间测试如果只依赖共享 Mock，会让提供者和消费者各自绿色、集成后却失败。", prerequisites: ["TD-PS02"], outcomes: ["建立消费者驱动契约与版本策略", "验证鉴权、租户和事件不变量", "沿 Trace 诊断最终一致性问题"], artifact: "Pact/事件契约包、权限矩阵和补偿诊断记录",
    blocks: [
      { title: "场景：结算不是一个同步响应", body: ["Checkout 服务接受购物车后发布 order.created，库存、支付和通知消费者异步处理。业务要求同一 order_id 只能产生一次支付意图，跨租户事件不能被消费，库存失败必须进入可追踪补偿状态。"] },
      { title: "实现：契约与兼容性", body: ["消费者先表达真实读取字段和错误处理，再由提供者验证；新增字段通常可兼容，删除字段、收紧枚举、改变 null 语义和错误结构需要门禁。事件 Schema 需携带 event_id、aggregate_id、version、occurred_at 和 tenant_id。"], code: "event = {event_id, aggregate_id, version, tenant_id, payload}\nassert consumer.accepts(event)\nassert idempotency_store.seen(event.event_id) is False\nassert cross_tenant(event, consumer) is denied", expected: "提供者删除消费者字段或改变事件版本时契约失败；重复 event_id 不产生第二个支付意图。" },
      { title: "SOP：权限先于业务流", body: ["先执行同租户成功、跨租户拒绝、角色不足、过期令牌，再执行正常异步链路；每次失败记录身份 claims、策略版本和决策理由。契约通过后仍要跑一次真实消息路径或受控事件回放。"] },
      { title: "指标与诊断树", body: ["观察契约失败数、拒绝率、重复事件率、事件积压、端到端完成 p95、死信数和补偿成功率。若支付重复，先查 event_id 幂等存储；若库存延迟，沿 trace 查队列、消费者和下游，不先让 AI 猜根因。"] },
      { title: "故障注入与 AI 边界", body: ["注入消息重复、乱序、消费者超时、策略配置错误和 Schema 旧版本；验证有界重试、死信、补偿和人工升级。AI 可审查 diff、聚类 Trace 和生成候选契约，但不能授予租户权限、自动修改事件语义或关闭 blocker。"] },
    ], practice: ["为一个消费者写出读取字段和错误契约", "注入跨租户 event 并验证拒绝无副作用", "重放乱序与重复事件并记录最终状态"], completion: ["提供者破坏性变更可在部署前失败", "鉴权负例和事件幂等均有证据", "补偿、死信和 Trace 诊断路径可执行"], sourceIds: ["S45", "S44", "S50"], evidenceBoundary: "Pact、OpenAPI 与 OWASP 官方资料支持契约和权限测试框架；消息中间件、策略引擎和补偿语义需在目标架构中实测，页面不宣称真实跨服务已运行。",
    architecture: { title: "事件契约与权限传播", caption: "身份策略、事件版本和幂等存储共同决定下游是否安全消费；任何一段断链都可能产生静默副作用。", nodes: ["Checkout API", "Auth/租户策略", "契约 Broker", "事件总线", "库存消费者", "支付消费者", "死信/补偿与 Trace"] },
    materials: [{ title: "结算事件契约", description: "包含版本、租户和幂等字段的事件 Fixture。", href: "materials/api-ai-automation/fixtures/checkout-events.json", kind: "fixture", validation: "static-reviewed" }, { title: "消费者兼容矩阵", description: "记录版本变更、消费者依赖和阻断规则。", href: "materials/api-ai-automation/guides/consumer-compatibility.md", kind: "guide", validation: "static-reviewed" }, ...apiExecutableMaterials],
  },
  {
    id: "TD-PS04", moduleId: "TD-M08", order: 4, title: "Web UI 关键旅程：隔离、定位器、网络控制与跨浏览器", type: "跟做", status: "desk-researched", duration: "50 分钟",
    summary: "围绕后台退款审批旅程，设计 Playwright 风格的稳定 UI 测试、网络控制和浏览器矩阵。", why: "UI 自动化最常见的失败不是产品逻辑，而是脆弱定位器、共享状态、第三方网络和错误等待。", prerequisites: ["TD-PS03"], outcomes: ["建立隔离且可重放的用户旅程", "选择可维护 Locator 和等待策略", "按用户风险裁剪浏览器与视口矩阵"], artifact: "退款审批 UI 套件、浏览器矩阵和 Trace 包",
    blocks: [
      { title: "场景：审批人看到的不是一个按钮", body: ["审批人打开待处理退款，需看到订单状态、金额、风险标签和审计记录；批准后 UI 显示处理中，并在异步完成后更新。需要覆盖空列表、权限不足、重复点击、网络失败和窄视口布局。"] },
      { title: "实现：隔离与稳定 Locator", body: ["每个测试创建独立订单和账户，使用 role、label、可访问名称或稳定 data-testid 定位；禁止固定 sleep，等待业务状态或网络响应。第三方支付和通知服务通过受控路由隔离，但核心订单 API 保留真实契约验证。"], code: "await page.getByRole('button', {name: '批准退款'}).click();\nawait expect(page.getByRole('status')).toHaveText('处理中');\nawait page.waitForResponse('**/refunds/*/status');\nawait expect(page.getByTestId('refund-state')).toHaveText('已完成');", expected: "测试在不同运行速度下等待业务信号；失败 Trace 能看到 DOM、网络和控制台，而不是只有超时。" },
      { title: "SOP：探针、旅程、清理", body: ["先检查构建版本、登录态和依赖 Stub，再跑关键旅程；测试结束删除订单和账户，清理失败要使套件失败。跨浏览器只运行风险矩阵选中的组合，不把全矩阵当成覆盖证明。"] },
      { title: "指标：稳定性与用户风险", body: ["记录旅程通过率、重试后通过率、Locator 失败占比、Trace 完整率、关键视口布局差异和跨浏览器差异。Flaky 率必须分母明确，重试通过不能被计为无条件绿。"] },
      { title: "故障注入、诊断与 AI 边界", body: ["让退款 API 延迟、返回 500、第三方路由失败和浏览器上下文崩溃；通过 Trace 分辨产品、测试和环境故障。AI 可建议稳定 Locator 或聚类 Trace，但不能因页面出现文字就判定资金状态已改变。"] },
    ], practice: ["实现一个不使用固定 sleep 的审批旅程", "让第三方通知失败并验证 UI 呈现可诊断错误", "为 Chromium、Firefox、WebKit 和两个视口写风险选择理由"], completion: ["测试上下文和业务数据相互隔离", "关键断言包含 UI 状态与 API/业务证据", "失败 Trace 足以支持人工诊断"], sourceIds: ["S62", "S43", "S58"], evidenceBoundary: "本页采用浏览器自动化与质量模型的通用方法；未真实启动浏览器或接入目标站点，浏览器兼容性、渲染差异和网络行为均为 desk-researched 状态。",
    architecture: { title: "UI 旅程的控制面与证据面", caption: "浏览器只是执行端，业务 API、身份、依赖路由和 Trace 才共同构成可诊断的 UI 证据。", nodes: ["测试数据工厂", "浏览器上下文", "Web UI", "订单/退款 API", "第三方路由 Stub", "Trace/截图/控制台", "回归门禁"] },
    materials: [{ title: "审批旅程 Fixture", description: "角色、订单状态、空态和错误态数据。", href: "materials/ui-mobile-automation/fixtures/refund-approval.json", kind: "fixture", validation: "static-reviewed" }, { title: "Playwright 旅程指南", description: "Locator、等待、隔离和 Trace 采集规则。", href: "materials/ui-mobile-automation/guides/web-journey-sop.md", kind: "guide", validation: "static-reviewed" }, ...uiExecutableMaterials],
  },
  {
    id: "TD-PS05", moduleId: "TD-M08", order: 5, title: "Web UI 兼容性、无障碍与视觉回归", type: "诊断", status: "desk-researched", duration: "45 分钟",
    summary: "以客服工作台为场景，组合键盘可达性、响应式布局、国际化文本和视觉差异诊断。", why: "主路径点击通过仍可能让键盘用户无法完成任务、窄屏信息溢出或错误状态被遮挡。", prerequisites: ["TD-PS04"], outcomes: ["建立按用户风险裁剪的兼容矩阵", "区分自动 a11y 规则和人工语义审查", "定位视觉差异的真实原因"], artifact: "Web 兼容性与可访问性证据包",
    blocks: [
      { title: "场景：客服必须在不同输入方式下完成退款", body: ["客服工作台支持鼠标、键盘和辅助技术；退款金额、风险提示和确认对话框必须在 1280px 与 390px 视口可读，英文与中文长文本不能遮挡批准控件。"] },
      { title: "实现：矩阵与检查层次", body: ["先用流量和风险选择浏览器、OS、视口和语言，再分别做 DOM 规则、键盘焦点、语义阅读顺序和视觉快照。动态时间、头像和广告位要稳定化，不应通过关闭全部差异来消除信号。"], code: "matrix = [\n  {browser:'chromium', viewport:'1280x800', locale:'zh-CN'},\n  {browser:'webkit', viewport:'390x844', locale:'en-US'}\n]\nchecks = ['keyboard-order', 'dialog-name', 'contrast', 'overflow', 'visual-diff']", expected: "每个矩阵组合有选择理由；失败报告能指出元素、规则、截图和变更 commit。" },
      { title: "SOP：先语义，再像素", body: ["先验证页面结构、焦点和可操作名称，再比较视觉；先排除字体、时区、数据和动画差异，再判断 CSS 回归。预期设计变化必须有审查记录，不可直接更新基线掩盖失败。"] },
      { title: "指标与故障注入", body: ["记录关键旅程的键盘完成率、阻断级 a11y 违规数、视口溢出数、视觉差异面积和跨浏览器失败率。注入长用户名、RTL 文本、慢网络和系统字体缺失，验证诊断分类。"] },
      { title: "AI 边界", body: ["AI 可对比截图、归纳重复违规和提出可能 CSS 位置；它不能证明对辅助技术用户的可用性，也不能自动批准视觉基线。高风险对话框、付款和权限操作必须由人工进行语义确认。"] },
    ], practice: ["为客服工作台裁剪两个浏览器、两个视口和两种语言", "注入长文本并记录溢出元素", "完成一次键盘-only 旅程并保留焦点证据"], completion: ["矩阵选择与用户风险相连", "自动规则与人工语义检查分开", "视觉基线更新有审查和回滚证据"], sourceIds: ["S62", "S43", "S58"], evidenceBoundary: "WCAG 与质量模型提供通用检查框架；本页未真实运行浏览器、辅助技术或视觉基线，具体合规结论必须在目标产品和目标市场复核。",
    architecture: { title: "兼容性证据分层", caption: "同一页面的可访问性、响应式和视觉证据来自不同检查层，不能用一个截图或一次点击替代全部层次。", nodes: ["用户/输入方式", "浏览器与视口矩阵", "DOM/语义检查", "键盘/焦点路径", "视觉快照", "差异诊断", "人工批准与门禁"] },
    materials: [{ title: "客服工作台矩阵", description: "浏览器、视口、语言和用户风险映射。", href: "materials/ui-mobile-automation/configs/web-compatibility-matrix.yaml", kind: "config", validation: "static-reviewed" }, { title: "a11y 与视觉 SOP", description: "自动检查、人工复核和基线审批步骤。", href: "materials/ui-mobile-automation/guides/a11y-visual-regression.md", kind: "guide", validation: "static-reviewed" }, ...uiExecutableMaterials],
  },
  {
    id: "TD-PS06", moduleId: "TD-M08", order: 6, title: "Android 自动化：生命周期、同步、权限与设备矩阵", type: "诊断", status: "desk-researched", duration: "50 分钟",
    summary: "以扫码收货应用为业务场景，设计 Espresso/Appium 风格的离线测试策略，并明确未运行设备的证据边界。", why: "移动端失败经常来自生命周期、系统权限、网络切换和设备差异，单一模拟器绿不能代表用户可用。", prerequisites: ["TD-PS05"], outcomes: ["拆分 Android 测试层级与同步策略", "覆盖权限、后台恢复和设备差异", "用日志、截图和崩溃信息诊断失败"], artifact: "Android 设备矩阵、生命周期用例与失败包",
    blocks: [
      { title: "场景：仓库收货不能丢扫描状态", body: ["收货员扫描条码后上传库存；相机权限首次拒绝、应用切到后台、网络断开、屏幕旋转或低电量都不能让已扫描货物重复入库。服务端以幂等 receipt_id 作为独立 Oracle。"] },
      { title: "实现：同步和分层", body: ["组件层验证 ViewModel 状态与校验，Espresso 层等待可观察 Idling 状态而非 sleep，API 层验证上传契约；设备层选择 Android 版本、屏幕和网络组合。权限弹窗由系统行为控制，测试必须显式处理首次与再次请求。"], code: "launchReceipt('R-17')\nassertPermission('CAMERA', expected='prompt')\nscan('SKU-9')\nrotate()\nbackgroundFor('3s')\nresume()\nassertServerInvariant('receipt_id=R-17', 'count=1')", expected: "恢复后扫描状态可解释；同一 receipt_id 重放不会产生第二次库存入账。" },
      { title: "SOP：设备探针与失败包", body: ["记录 APK、设备 API level、厂商、分辨率、权限状态、网络配置和测试数据；先跑启动/登录探针，再跑业务旅程。失败包保留 logcat、截图、屏幕状态、网络事件和服务 Trace。"] },
      { title: "指标与故障注入", body: ["记录冷启动、扫描到确认延迟、崩溃率、ANR、权限路径通过率、离线恢复成功率和设备切片通过率。注入网络切换、进程杀死、权限拒绝和旋转，先看设备日志，再对照服务端幂等证据。"] },
      { title: "AI 边界与状态", body: ["AI 可从 logcat 聚类崩溃、提出设备切片优先级和生成候选断言；未连接真实设备时不能声称兼容性通过。AI 也不能将截图中的‘上传成功’当作库存账本已更新。"] },
    ], practice: ["设计首次拒绝相机权限和再次进入的路径", "注入进程杀死并检查 receipt_id 幂等", "写出至少三种设备切片及其业务理由"], completion: ["同步策略不依赖固定等待", "生命周期与服务端状态均有证据", "设备未运行时报告明确标 desk-researched"], sourceIds: ["S43", "S61", "S58"], evidenceBoundary: "Android 测试层次和权限策略为 desk-researched；本页未启动 Android 模拟器或真机，设备、ROM、性能和系统弹窗结论不能当作运行结果。",
    architecture: { title: "Android 扫描状态链", caption: "移动 UI 状态、系统生命周期和服务端幂等状态必须同时观察，否则恢复场景容易出现假绿或重复入账。", nodes: ["收货员与设备", "Android Activity/Process", "扫描与权限层", "本地状态/队列", "库存 API", "库存账本", "logcat/Trace/报告"] },
    materials: [{ title: "Android 收货 Fixture", description: "扫描、权限、网络和生命周期状态。", href: "materials/ui-mobile-automation/fixtures/android-receiving.yaml", kind: "fixture", validation: "static-reviewed" }, { title: "设备矩阵与失败包规范", description: "设备选择、logcat、截图和 Trace 采集。", href: "materials/ui-mobile-automation/guides/android-device-matrix.md", kind: "guide", validation: "static-reviewed" }, ...uiExecutableMaterials],
  },
  {
    id: "TD-PS07", moduleId: "TD-M08", order: 7, title: "iOS 自动化：可访问性标识、权限、签名与状态残留", type: "诊断", status: "desk-researched", duration: "50 分钟",
    summary: "以医疗预约改期为场景，建立 XCUITest 关注的系统权限、模拟器/真机差异、动画同步和清理策略。", why: "iOS 测试常被签名、权限弹窗、动画和上一次运行残留干扰；一条 UI 通过不能证明预约状态可靠。", prerequisites: ["TD-PS06"], outcomes: ["设计可访问性标识驱动的定位策略", "覆盖权限、后台恢复和签名前置条件", "区分设备、应用和服务状态故障"], artifact: "iOS 预约改期测试包与 xcresult 证据规范",
    blocks: [
      { title: "场景：预约改期必须避免重复占号", body: ["患者选择新时段并确认，客户端可能遇到通知权限、网络切换、后台恢复和旧预约残留。服务端以 appointment_id 与 slot_version 约束重复提交和并发占用。"] },
      { title: "实现：标识、同步和权限", body: ["为关键控件提供稳定 accessibilityIdentifier，并对可见文本和业务状态做双断言；等待网络或状态变化，不用坐标和固定延时。运行前固定 Bundle、签名、模拟器 OS、区域、权限和数据清理策略。"], code: "app.buttons['reschedule-confirm'].tap()\nXCTAssertTrue(app.staticTexts['pending'].waitForExistence(timeout: 5))\nassertTraceHas('appointment_id', 'slot_version')\nassertServerState('slot_version', expected: 8)", expected: "UI 显示处理中时服务端请求可追踪；重复点击不会产生第二个预约变更。" },
      { title: "SOP：干净状态与结果收集", body: ["每次运行用独立账户和预约，必要时重置 Keychain、应用数据和系统授权；先执行签名/安装/权限探针，再跑旅程。失败保存 xcresult、截图、系统日志和服务 Trace。"] },
      { title: "指标与故障注入", body: ["关注预约改期成功率、重复提交率、权限路径通过率、动画等待超时、崩溃和不同 OS 切片差异。注入通知拒绝、离线、后台挂起和 slot_version 冲突，按客户端、服务端、环境分类。"] },
      { title: "AI 边界", body: ["AI 可解释 xcresult、建议缺失标识和聚类失败，但不能替代签名、真机或业务 owner。没有真实设备运行，不能把模拟器推断扩展为所有 iPhone、OS 或辅助技术组合。"] },
    ], practice: ["为预约改期控件定义 accessibilityIdentifier 和业务断言", "模拟并发 slot_version 冲突并确认 UI 友好失败", "写出模拟器与真机各自不能证明的事项"], completion: ["关键控件不依赖坐标定位", "权限、数据清理和签名前置有记录", "服务端预约状态与 UI 结果相互印证"], sourceIds: ["S43", "S62", "S58"], evidenceBoundary: "XCTest、WCAG 和质量模型用于方法设计；本页未运行 XCUITest、模拟器或真机，签名、OS、动画和设备兼容性均只能标为 desk-researched。",
    architecture: { title: "iOS 预约改期证据链", caption: "应用状态、系统授权和预约服务的版本冲突必须在同一运行包中关联，才能定位是 UI、权限还是业务竞争失败。", nodes: ["患者与 iOS 设备", "XCUITest/Accessibility", "系统权限与生命周期", "预约 API", "Slot 版本/账本", "xcresult/系统日志", "回归门禁"] },
    materials: [{ title: "iOS 预约 Fixture", description: "预约、时段版本、权限和恢复状态。", href: "materials/ui-mobile-automation/fixtures/ios-reschedule.json", kind: "fixture", validation: "static-reviewed" }, { title: "XCUITest 运行前检查", description: "签名、权限、清理和 xcresult 采集。", href: "materials/ui-mobile-automation/guides/ios-xcuitest-preflight.md", kind: "guide", validation: "static-reviewed" }, ...uiExecutableMaterials],
  },
  {
    id: "TD-PS08", moduleId: "TD-M02", order: 8, title: "AI UI 生成与自愈：先证明检测力，再谈省维护", type: "诊断", status: "desk-researched", duration: "55 分钟",
    summary: "以电商退货旅程为对象，审查 AI 生成步骤、Locator 自愈和轨迹质量，防止自愈把错误路径修成绿。", why: "自愈的目标不是让脚本永远通过，而是保留业务 Oracle；错误地点击相似按钮或绕过权限，比测试失败更危险。", prerequisites: ["TD-PS04", "TD-PS05"], outcomes: ["定义生成测试的来源、Oracle 和审查门禁", "区分 Locator 修复与业务变化", "用轨迹和 mutation 识别误修绿"], artifact: "AI UI 生成审查包、轨迹评测和自愈审计记录",
    blocks: [
      { title: "场景：退货流程中的相似控件风险", body: ["页面同时出现‘申请退货’、‘取消订单’和‘联系客服’；AI 可能依据视觉相似度点错控件。真实 Oracle 是退货状态、订单权限、退款金额和审计事件，不是 URL 或按钮文字单独变化。"] },
      { title: "实现：Planner、Generator、Critic 三段隔离", body: ["Planner 从需求和页面语义提取旅程；Generator 产生候选步骤与 Locator；Critic 检查来源、稳定性、权限和业务 Oracle。自愈仅允许在候选 Locator 集合内替换，并保留原失败、替换理由和人工批准。"], code: "candidate = heal(locator_failure, allowed=['role','label','testid'])\nassert candidate.source_ref\nassert candidate.business_oracle\nassert not candidate.crosses_permission_boundary\nrequire_human_review(candidate)", expected: "自愈后仍验证退货状态、金额和审计事件；若只到达‘成功页面’但业务状态未变，轨迹评测必须失败。" },
      { title: "SOP：坏版本先红，修复后复验", body: ["先用预埋错 Locator、相似按钮和错误权限页面证明测试会失败，再运行候选自愈；人工审查替换 diff，最后在相同故障和未修改回归集上复跑。禁止自动更新所有基线。"] },
      { title: "指标：维护成本不能掩盖质量损失", body: ["记录候选修复接受率、误修绿率、原失败重现率、业务 Oracle 覆盖、人工审查率和每次修复平均触达范围。自愈成功率上升但误修绿率上升时，应阻断自动合并。"] },
      { title: "故障注入、诊断与 AI 边界", body: ["交换两个同名按钮、隐藏关键权限、改变 DOM 层级、返回旧订单状态并模拟第三方成功页；沿轨迹、请求和账本诊断。AI 能加速候选生成和聚类，不能成为唯一 Locator Oracle、权限审批人或发布批准人。"] },
    ], practice: ["设计一个相似按钮导致误修绿的页面夹具", "为候选 Locator 补 source_ref、业务 Oracle 和权限边界", "比较自愈前后误修绿率与人工审查率"], completion: ["生成步骤可回溯到业务来源", "自愈保留原失败且不跨权限边界", "预埋错路径会被轨迹或业务 Oracle 阻断"], sourceIds: ["S62", "S43", "S59"], evidenceBoundary: "页面是 AI 辅助 UI 的 desk-researched 设计；未真实运行浏览器 Agent、自愈框架或目标站点，任何维护率、误修率和兼容性结论必须由离线夹具或授权环境验证。",
    architecture: { title: "UI 生成到人工门禁", caption: "自愈是受限候选搜索，不是自动批准；轨迹、业务状态和权限证据共同决定是否接受修复。", nodes: ["需求/业务 Oracle", "页面与可访问性树", "Planner", "Generator/Locator 候选", "Critic/轨迹评测", "人工审查", "CI 门禁"] },
    materials: [{ title: "退货 UI 轨迹夹具", description: "相似按钮、权限和错误成功页场景。", href: "materials/ui-mobile-automation/fixtures/return-trajectory.json", kind: "fixture", validation: "static-reviewed" }, { title: "自愈审计规则", description: "候选范围、误修绿、人工审查和回滚。", href: "materials/ui-mobile-automation/configs/self-healing-policy.yaml", kind: "config", validation: "static-reviewed" }, ...uiExecutableMaterials],
  },
  {
    id: "TD-PS09", moduleId: "TD-M09", order: 9, title: "AI 性能指标：TTFT、TPOT、Goodput 与单位成功成本", type: "诊断", status: "desk-researched", duration: "55 分钟",
    summary: "以客服 Agent 流式回答和工具调用为场景，建立按切片、尾延迟、质量和成本联合决策的性能指标体系。", why: "平均延迟变快可能伴随长输入质量下降、工具调用放大和 p99 恶化；AI 性能必须与任务成功绑定。", prerequisites: ["TD-PS03"], outcomes: ["定义 AI 请求阶段指标与分母", "区分 TTFT、TPOT、端到端和 Goodput", "用质量、SLO 和成本做 Pareto 决策"], artifact: "AI 性能 workload、指标卡和容量决策报告",
    blocks: [
      { title: "场景：客服回答不是单一模型调用", body: ["客服 Agent 先检索政策，再调用模型并可能查询订单。短 FAQ 与长退款对话的输入、工具数、输出长度和风险完全不同；性能报告必须保留这些切片。"] },
      { title: "实现：阶段计时与 workload 固定", body: ["固定输入长度、输出上限、并发、到达率、缓存状态、模型/Prompt/知识库版本和工具比例；记录请求排队、TTFT、流式 token 间隔、TPOT、总时长、任务结果和 token 成本。"], code: "workload = {slices:['faq','refund-long'], concurrency:[1,8,32], output_tokens:256}\nmetrics = ['queue_ms','ttft_ms','tpot_ms','e2e_ms','goodput','cost_per_success']\ngate = safety_blockers == 0 and refund_success >= 0.98 and p95_ttft_ms <= budget", expected: "报告按 slice 展示 p50/p95/p99、任务质量和成本；不能用整体平均值掩盖退款长对话尾延迟。" },
      { title: "SOP：基线、候选、回退", body: ["先跑固定基线并保存 manifest，再比较候选路由或批处理配置；先淘汰突破安全、质量和 SLO 底线的候选，剩余结果展示 Pareto 前沿，明确适用流量和回退条件。"] },
      { title: "指标解释与诊断", body: ["TTFT 反映首 token 等待，TPOT 反映生成阶段节奏，Goodput 只计算满足质量与 SLO 的成功任务。若 TTFT 变差查队列和 Prefill，TPOT 变差查 Decode、并发和资源；成本异常查重试和工具放大。"] },
      { title: "故障注入与 AI 边界", body: ["注入限流、工具超时、重试风暴、长上下文和 GPU/队列饱和；观察指标是否按阶段暴露。AI 可帮助分析曲线和生成 workload 候选，但不能选择风险阈值、忽略失败请求成本或宣称托管服务内部 GPU 指标已知。"] },
    ], practice: ["为 FAQ 与退款长对话定义两个 workload slice", "计算 TTFT、TPOT、Goodput 和 cost_per_success 的分母", "注入一次工具超时并解释重试对性能和成本的影响"], completion: ["指标按切片和分位数呈现", "质量底线先于速度优化", "报告包含回退条件与未知内部指标"], sourceIds: ["S51", "S52", "S54"], evidenceBoundary: "vLLM、GenAI-Perf 和 Prometheus 官方资料支持指标定义；页面未在目标模型、硬件或供应商服务上压测，所有容量、阈值和成本数字必须重新实测。",
    architecture: { title: "AI 请求阶段指标链", caption: "从到达到首 token、连续生成、工具调用到任务成功，性能和质量必须在同一 trace 中关联。", nodes: ["Workload/到达率", "队列与调度", "Prefill/TTFT", "Decode/TPOT", "工具与检索", "质量/Goodput", "成本与容量门禁"] },
    materials: [{ title: "客服 Agent Workload", description: "输入长度、并发、工具比例和风险切片。", href: "materials/api-ai-automation/configs/ai-performance-workload.yaml", kind: "config", validation: "static-reviewed" }, { title: "AI 指标卡模板", description: "阶段指标、分母、分位数和联合门禁。", href: "materials/api-ai-automation/guides/ai-performance-metric-card.md", kind: "guide", validation: "static-reviewed" }, ...apiExecutableMaterials],
  },
  {
    id: "TD-PS10", moduleId: "TD-M08", order: 10, title: "故障注入：从单点失败到重试风暴与级联故障", type: "跟做", status: "desk-researched", duration: "55 分钟",
    summary: "以订单 AI 助手为对象，设计有授权、可停止、可回滚的故障注入矩阵，并验证降级、限流和补偿。", why: "可靠性不是没有故障，而是故障传播可控、用户影响可知、恢复动作可执行。", prerequisites: ["TD-PS09"], outcomes: ["按假设设计故障实验", "验证超时、限流、依赖降级和补偿", "用 SLO 与副作用证据判断实验结论"], artifact: "Chaos Experiment Card、注入记录和复盘报告",
    blocks: [
      { title: "场景与授权边界", body: ["订单助手可查询订单、解释退款政策，但不能在没有二次确认时退款。实验只在隔离命名空间和合成账户执行，先声明 blast radius、停止条件、观察人和回滚命令；没有这些字段的实验保持 BLOCKED。"] },
      { title: "实现：实验卡而非随机破坏", body: ["每项实验写假设、注入点、预期 SLI、风险、开始/停止条件、清理动作和证据。优先从单实例工具超时、模型 429、检索空结果开始，再逐步验证队列积压与级联。"], code: "experiment: tool-timeout\nhypothesis: assistant remains read-only and returns bounded fallback\nblast_radius: namespace=qa-chaos, users=synthetic\nstop_if: error_rate > 0.10 or side_effect_count > 0\nrollback: disable_fault('tool-timeout')", expected: "工具超时后助手不执行退款，响应可解释，错误率和 Trace 显示降级；触发停止条件时实验自动结束。" },
      { title: "SOP：基线、注入、恢复、复验", body: ["先记录健康基线，再注入一个变量；观察 SLI、日志、Trace、副作用和用户分层，达到停止条件立即恢复。恢复后跑同一回归集，确认没有残留队列、错误 Feature Flag 或数据污染。"] },
      { title: "指标与传播诊断", body: ["关注错误率、延迟分位数、队列积压、重试次数、降级命中率、错误预算消耗和副作用计数。若错误扩大，沿调用图从根依赖查超时预算、重试策略和连接池，不能只看入口 5xx。"] },
      { title: "AI 边界", body: ["AI 可根据历史 Trace 提出实验候选、总结传播路径和生成复盘草稿；它不能自主向生产注入故障、修改停止阈值或判断资金副作用安全。实验结论必须由授权负责人确认。"] },
    ], practice: ["写一张工具超时 Chaos Experiment Card", "为重试风暴定义停止条件和副作用 Oracle", "恢复后验证队列、Feature Flag 和合成数据均清理"], completion: ["实验有明确授权和 blast radius", "故障后降级不越权且可观测", "恢复与同一回归集复验均有证据"], sourceIds: ["S48", "S60", "S47"], evidenceBoundary: "页面依据 Google SRE 与 Chaos Engineering 原则做 desk-researched 设计；未在任何 K8s 集群或生产环境运行故障注入，实验安全性和恢复时间必须先在授权隔离环境验证。",
    architecture: { title: "故障传播与停止链", caption: "故障注入只对隔离依赖生效，停止条件同时观察用户 SLI、系统传播和不可逆副作用。", nodes: ["实验授权/隔离命名空间", "注入器", "模型/工具/检索依赖", "Agent 重试与降级", "订单 API/队列", "SLI/Trace/副作用", "自动停止与回滚"] },
    materials: [{ title: "订单助手实验卡", description: "工具超时、429、空检索和停止条件。", href: "materials/reliability-chaos-observability/fixtures/order-assistant-chaos.yaml", kind: "fixture", validation: "static-reviewed" }, { title: "Chaos 授权与复验指南", description: "隔离、观察、回滚和残留清理。", href: "materials/reliability-chaos-observability/guides/chaos-experiment-sop.md", kind: "guide", validation: "static-reviewed" }, ...reliabilityExecutableMaterials],
  },
  {
    id: "TD-PS11", moduleId: "TD-M09", order: 11, title: "线上可观测性：把 AI 质量、Trace、成本和 SLO 接成一条链", type: "概念", status: "desk-researched", duration: "50 分钟",
    summary: "以生产客服 Agent 为场景，设计脱敏 Trace、指标、日志和质量回流，明确托管模型内部不可见时的未知项。", why: "没有输入、检索、工具、模型版本和最终结果的关联，线上质量下降只能靠猜；过度采集又会泄露敏感数据。", prerequisites: ["TD-PS10"], outcomes: ["定义 AI 观测字段和脱敏边界", "把质量事件连接到 Trace 与版本 Manifest", "建立告警、调查和回归回流路径"], artifact: "AI 可观测性字段契约、Dashboard 设计和事故样例",
    blocks: [
      { title: "场景：正确率下降但 Judge 没变", body: ["客服退款正确率连续下降，Judge 分数保持稳定，可能是知识库索引过期、输入分布变化、Judge 漂移或工具错误。需要同时查看质量切片、检索版本、Trace、成本和用户反馈。"] },
      { title: "实现：最小可用 Trace", body: ["关联 request_id、trace_id、模型/Prompt/Scorer/知识库版本、风险 slice、检索文档 ID、工具名与参数摘要、延迟阶段、token 计数、结果和人工判定。PII、凭证和原文按最小化、哈希或脱敏策略处理。"], code: "trace = {trace_id, manifest_id, risk_slice, model_version, prompt_hash,\n  retrieval_ids, tool_names, latency:{ttft,e2e}, token_counts, outcome}\nredact(trace, fields=['email','phone','credential','raw_payment'])", expected: "可以从一个质量异常回到版本和链路；敏感字段不进入默认 Dashboard，原始数据访问有权限和保留期限。" },
      { title: "SOP：基线、告警、调查、回流", body: ["保存质量、输入分布、延迟、成本和 Judge 基线；告警按风险切片和连续窗口触发，先冻结相关版本并恢复完整已知良好 Manifest，再逐项前滚。确认的脱敏失败样例进入回归集。"] },
      { title: "指标与告警", body: ["分层记录任务成功率、事实性/引用、拒答、工具政策、TTFT、p95、单位成功成本、检索召回代理指标和 Trace 完整率。告警必须写明分母、窗口、owner、动作和是否阻断；未暴露的 GPU/KV 指标标 UNKNOWN。"] },
      { title: "AI 边界与诊断", body: ["AI 可总结 Trace、聚类症状和生成调查问题，但不能静默更换 Judge、删除敏感证据、放宽阈值或自动回滚高风险版本。诊断先验证数据和版本，再判断模型或代码。"] },
    ], practice: ["设计一份不含 PII 的 Agent Trace 字段契约", "为高风险退款正确率下降写连续窗口告警", "把一条脱敏失败样例映射回回归用例"], completion: ["质量、性能、成本与版本可关联", "敏感数据边界和访问控制明确", "告警动作能冻结、诊断、回滚并回流"], sourceIds: ["S49", "S47", "S51"], evidenceBoundary: "OpenTelemetry、Google SRE 和 vLLM 资料支持信号与指标设计；本页未接入生产 telemetry 或真实 Trace，字段可见性、PII 策略和告警阈值需由目标组织验证。",
    architecture: { title: "AI 质量信号闭环", caption: "Trace 把模型、检索、工具、性能和业务结果连接起来；脱敏与权限是观测系统的前置约束。", nodes: ["用户请求/风险切片", "Gateway 与 Trace", "模型/检索/工具 Span", "日志与指标", "质量/成本评测", "告警与版本冻结", "回归集与发布门禁"] },
    materials: [{ title: "Agent Trace 字段契约", description: "版本、Span、质量、成本和脱敏字段。", href: "materials/reliability-chaos-observability/configs/agent-trace-schema.yaml", kind: "config", validation: "static-reviewed" }, { title: "线上质量调查指南", description: "告警窗口、诊断树、回滚和回流。", href: "materials/reliability-chaos-observability/guides/ai-observability-investigation.md", kind: "guide", validation: "static-reviewed" }, ...reliabilityExecutableMaterials],
  },
  {
    id: "TD-PS12", moduleId: "TD-M09", order: 12, title: "稳定性 Runbook：SLO 触发后的冻结、回滚与复盘", type: "项目", status: "desk-researched", duration: "60 分钟",
    summary: "把限流、质量下降、工具越权和恢复洪峰组织成可执行 Runbook，形成从告警到复验的生产质量决策。", why: "监控图表不会自动恢复服务。稳定性能力的专业证据是值班人员能在压力下做出有边界、可审计、可回滚的动作。", prerequisites: ["TD-PS11"], outcomes: ["定义 AI 服务 SLO、错误预算和触发级别", "执行冻结、降级、回滚和复验决策", "把事故转化为新增测试与门禁"], artifact: "稳定性 Runbook、GameDay 记录和事故复盘报告",
    blocks: [
      { title: "场景：退款助手质量与延迟同时恶化", body: ["高风险退款切片正确率跌破基线，p95 TTFT 上升，工具调用次数翻倍；低风险 FAQ 仍正常。Runbook 必须优先保护资金与权限，不能用全局平均掩盖高风险影响。"] },
      { title: "实现：SLO、错误预算和决策表", body: ["为高风险任务定义任务成功、工具政策、p95 延迟、可用性和成本指标；每条告警绑定严重级别、owner、止损动作和回滚版本。SLO 数值只是示例，必须从真实业务承诺和风险成本校准。"], table: { headers: ["症状", "立即动作", "恢复证据"], rows: [["越权工具调用", "冻结写工具，切只读", "轨迹中无越权且回归通过"], ["高风险正确率下降", "冻结模型/知识库版本", "高风险切片恢复基线"], ["p95 TTFT 超预算", "限并发或回退路由", "连续窗口达标"]] } },
      { title: "SOP：告警到回滚", body: ["确认告警分母和窗口，建立事故记录；冻结最近变更，恢复完整已知良好 Manifest，切换只读或安全降级；验证用户影响停止扩大，再按模型、Prompt、知识库、工具和基础设施逐项前滚。"] },
      { title: "诊断、指标与证据", body: ["Runbook 要求保留告警快照、Trace 样例、版本账本、操作人、命令、时间线、影响切片、回滚结果和未解决风险。复盘区分触发原因、放大因素、检测缺口和恢复缺口，而不是只归咎模型。"] },
      { title: "故障演练与 AI 边界", body: ["在隔离环境演练知识库过期、限流、工具超时和版本回滚，并验证到期 Waiver 自动失效。AI 可生成初版时间线和候选修复，但不能独立执行生产回滚、批准 Waiver 或关闭事故。若 K8s/生产未运行，状态保持 desk-researched。"] },
    ], practice: ["为高风险退款写一页值班 Runbook", "演练一次‘只读降级→回滚→回归复验’路径", "把事故根因转成一个 API/UI/Eval 回归门禁"], completion: ["每个 SLO 触发器都有明确动作和 owner", "回滚后有连续窗口与风险切片复验", "复盘产物能产生具体回归资产"], sourceIds: ["S47", "S48", "S49"], evidenceBoundary: "Google SRE、OpenTelemetry 和 Chaos Engineering 资料支持 Runbook 结构；未在真实生产、K8s 或值班系统执行演练，SLO、回滚耗时和恢复结论不能视为实测结果。",
    architecture: { title: "稳定性事件闭环", caption: "稳定性决策从 SLO 告警开始，经冻结、降级、回滚和复验，最终必须把事故转为新的自动化证据。", nodes: ["SLO/错误预算", "告警与事故分级", "版本冻结", "只读/降级", "回滚与配置恢复", "切片回归复验", "复盘与质量资产"] },
    materials: [{ title: "退款助手 Runbook", description: "触发级别、止损动作、回滚和复验。", href: "materials/reliability-chaos-observability/guides/refund-agent-runbook.md", kind: "guide", validation: "static-reviewed" }, { title: "稳定性 GameDay 记录模板", description: "时间线、操作、证据、影响和新增回归。", href: "materials/reliability-chaos-observability/fixtures/stability-gameday-report.yaml", kind: "fixture", validation: "static-reviewed" }, ...reliabilityExecutableMaterials],
  },
];
