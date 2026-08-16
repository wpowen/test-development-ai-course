# AI 时代 UI 自动化测试：Web、Android、iOS 深度调研

> 研究截点：2026-08-10（Asia/Shanghai）。范围：只采用工具官方文档、官方 GitHub、Apple/Google 一手文档、W3C 标准与论文。\
> 成熟度标签：**生产**=核心能力有稳定官方文档/CI 使用路径，可纳入门禁；**生产-有条件**=能力可用，但环境、基线或平台约束必须显式治理；**实验/试点**=官方已经提供或论文验证，但尚不足以替代确定性断言和人工审批；**未证实**=未找到一手来源，不把营销或社区传闻当作能力。

## 1. 结论先行

1. **Web 首选 Playwright**：其核心的 role/label/test-id 定位器、actionability 自动等待、可重试断言、trace 与视觉对比已经是生产能力；Playwright 官方 MCP 和 Planner/Generator/Healer 是当前最完整的自然语言/代理入口，但应当作为“生成、探索、诊断、提议修复”层，不作为无人审批的发布门禁。
2. **Android 采用分层组合，而非单选**：应用团队拥有源码、需要最快且可解释的组件级验证时用 Espresso；跨应用、黑盒、真实设备和跨技术栈回归用 Appium UiAutomator2 或 Maestro；需要统一 YAML、低代码 smoke/E2E 和 Android+iOS 共用流程时优先 Maestro。Appium 的跨平台价值来自 WebDriver + driver 生态，代价是更深的服务/驱动/设备链路。
3. **iOS 首选 XCUITest/XCTest 做原生深度测试**：它直接使用 Apple 的 XCTest、XCUIApplication、XCUIElement、XCUIElementQuery 与 Accessibility；需要跨平台语言/协议、统一设备编排或与 Android 共用测试层时采用 Appium XCUITest driver 或 Maestro，但故障面比原生链更多。
4. **视觉、自然语言、自愈不是同一个能力**：截图像素/结构比较是测试 oracle；视觉找元素是定位策略；自然语言代理是规划和行动控制；自愈是对失败测试提出候选修改。四者必须分别计量，否则“能看懂页面”会被误报为“能证明产品正确”。
5. **AI 的安全边界**：允许 AI 读需求、生成草稿、探索 UI、总结 trace、分类失败、提出 locator 修复；不允许 AI 自动改业务断言、自动批准视觉基线、把超时/失败改成 skip、在生产账号执行有副作用动作，或将一次代理成功当成稳定回归覆盖。

## 2. 一手证据与版本上下文

### 2.1 官方文档证据

| 主题 | 一手来源 | 本报告采用的事实 |
|---|---|---|
| Playwright 定位与等待 | [Locators](https://playwright.dev/docs/locators)、[Auto-waiting](https://playwright.dev/docs/actionability)、[Assertions](https://playwright.dev/docs/test-assertions) | Locator 是自动等待/重试的中心；动作会检查唯一性、可见、稳定、可接收事件、启用等条件；Web 断言会重试直到条件满足或超时。 |
| Playwright 诊断与生成 | [Trace Viewer](https://playwright.dev/docs/trace-viewer)、[Test generator](https://playwright.dev/docs/codegen)、[Retries](https://playwright.dev/docs/test-retries) | trace 可用于回放动作、网络、截图和错误上下文；codegen 是生成起点，不是最终质量保证；retry 只能降低偶发环境噪声，不能修复错误 oracle。 |
| Playwright 视觉 | [Visual comparisons](https://playwright.dev/docs/test-snapshots) | `toHaveScreenshot()` 有官方基线比较；官方明确提醒操作系统、浏览器、硬件和 headless 等差异会影响截图，基线应在一致环境生成。 |
| Playwright 代理 | [Playwright Test Agents](https://playwright.dev/docs/test-agents)、[Release notes](https://playwright.dev/docs/release-notes)、[playwright-mcp GitHub](https://github.com/microsoft/playwright-mcp) | 官方提供 planner、generator、healer；MCP 使用结构化 accessibility snapshot，强调不依赖截图视觉模型。代理定义需随 Playwright 更新重新生成；官方文档没有承诺完全自治的正确性。 |
| Appium 架构 | [How Does Appium Work?](https://appium.io/docs/en/latest/intro/appium/)、[Intro to Drivers](https://appium.io/docs/en/latest/intro/drivers/)、[Drivers](https://appium.io/docs/en/latest/ecosystem/drivers/) | Appium 是服务器 + 客户端 + driver 的 WebDriver 接口；UiAutomator2、XCUITest 是官方 driver；iOS 链路包含 Node 侧、WebDriverAgent、Xcode、XCUITest、iOS，故障需要分层定位。 |
| Appium 版本 | [Migrating to Appium 3](https://appium.io/docs/en/latest/guides/migrating-2-to-3/)、[UiAutomator2 quickstart](https://appium.io/docs/en/latest/quickstart/uiauto2-driver/) | Appium 3 要求 Node `20.19.0+`/npm 10+；Appium 2/3 驱动独立安装；UiAutomator2 在 macOS/Linux/Windows 可用，XCUITest 要求 macOS。 |
| Appium 视觉/插件 | [Appium Plugins](https://appium.io/docs/en/latest/ecosystem/plugins/)、[Images plugin API](https://appium.io/docs/en/3.4/reference/api/plugins/) | 官方 Images plugin 支持图像匹配与比较；它是可选插件，不等于 AI 视觉理解或自愈。插件应单独锁版本、权限和审计。 |
| Maestro | [Maestro 官方 GitHub](https://github.com/mobile-dev-inc/maestro)、[Maestro 文档](https://docs.maestro.dev/) | 官方定位是 Android、iOS、Web 的开源 UI/E2E 框架；YAML flow、解释执行、智能等待、`launchApp`/`tapOn`/`assertVisible` 等适合跨平台 smoke/E2E。README 同时说明 Java 17+ 和设备/浏览器运行条件。 |
| Maestro AI/MCP | [maestro-ai README](https://github.com/mobile-dev-inc/maestro/tree/main/maestro-ai)、[Maestro MCP 源码](https://github.com/mobile-dev-inc/maestro/blob/main/maestro-cli/src/main/java/maestro/cli/command/McpCommand.kt)、[Maestro Chat 源码](https://github.com/mobile-dev-inc/maestro/blob/main/maestro-cli/src/main/java/maestro/cli/command/ChatCommand.kt) | `maestro-ai` 是需要 API key 的截图缺陷 demo/库；旧 `maestro chat` 已明确 discontinued，源码建议改用 Maestro MCP。它们证明有实验/代理入口，不证明核心 YAML flow 已具备通用自然语言自愈。 |
| Espresso | [Espresso](https://developer.android.com/training/testing/espresso)、[AndroidX Test samples](https://github.com/android/testing-samples) | Espresso 面向开发者；可 black-box，但完整能力需要熟悉代码库；其同步会等待主线程消息、AsyncTask 和开发者定义的 IdlingResource，避免手写 sleep/poll。 |
| XCTest/XCUITest | [Apple User Interface Testing](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/09-ui_testing.html)、[Writing Test Classes](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/04-writing_tests.html)、[XCTest](https://developer.apple.com/documentation/xctest)、[XCUIAutomation](https://developer.apple.com/documentation/xcuiautomation) | Apple UI testing 以 XCTest + Accessibility 为核心，使用 XCUIApplication/XCUIElement/XCUIElementQuery 查询、合成事件、断言 UI 状态；测试进程与被测应用进程分离。Apple archive 页面较旧（2017），现代 API 页面需要 JS，故版本能力以项目 Xcode/SDK 实际锁定为准。 |
| WebDriver 标准 | [W3C WebDriver](https://www.w3.org/TR/webdriver2/) | Appium 的可移植协议边界应按 W3C WebDriver 及各 driver 扩展理解；不要把某个客户端封装的 mobile command 当作所有平台的通用标准。 |

### 2.2 论文与研究基准证据

- [AndroidWorld: A Dynamic Benchmarking Environment for Autonomous Agents](https://arxiv.org/abs/2405.14573) 及其 [官方 GitHub](https://github.com/google-research/android_world)：在真实 Android emulator 上提供 20 个应用、116 个手工任务并动态生成参数；仓库明确标注“不是 Google 官方支持产品”，且 Docker 支持为 experimental。它适合验收 GUI agent，不适合直接证明生产测试稳定性。
- [Autonomous Large Language Model Agents Enabling Intent-Driven Mobile GUI Testing](https://arxiv.org/abs/2311.08649)：DroidAgent 以高层意图驱动 Android GUI 测试，论文报告了探索覆盖和任务生成结果；这是研究实验，不是 Appium/Espresso/Maestro/XCTest 的官方保证。
- [Large Language Models for Mobile GUI Text Input Generation: An Empirical Study](https://arxiv.org/abs/2404.08948)：在 62 个开源 Android app、114 个 UI 页面上研究输入生成，报告通过率区间和隐私风险；结果支持“AI 可扩展输入探索”，不支持“自然语言生成测试即等价于验收”。
- [LLM-Guided Scenario-based GUI Testing](https://arxiv.org/abs/2506.05079)：提出 Observer/Decider/Executor/Supervisor/Recorder 分工，说明把 agent 与监督器、可追踪场景结合比单一 prompt 更可评估。
- [Mobile-Agent-v3.5](https://arxiv.org/abs/2602.16855)：展示跨 Web/mobile 的 GUI agent benchmark 能力，但 benchmark 分数是研究结果，不能直接转化为产品缺陷检测率、稳定性或合规性。

### 2.3 版本规则

- 本文写的是“截至研究日可查到的官方状态”，不是永久兼容表。CI 必须锁定 Node/Java/JDK/Xcode/SDK/driver/browser/emulator image 与测试库版本，并将 `--version`、设备信息、commit SHA 写入报告。
- Playwright 官方 release 页面当前显示 1.56.x 线并包含 Agents；在实际项目中以 `package-lock.json`/`pnpm-lock.yaml` 和运行时 `npx playwright --version` 为准。
- Appium 官方文档已进入 Appium 3 迁移语境；Appium server、UiAutomator2/XCUITest/Espresso driver、插件独立发布，不能只升级 server 就宣称全链升级。
- Apple archive 文档为历史文档，不应把 2017 更新日期误读成 XCUITest 当前 SDK 版本；运行版本必须从 `xcodebuild -version`、`xcrun simctl list` 和项目构建日志取得。

## 3. 选型矩阵

评分：★★★★★ 强，★★★★ 可用，★★ 有条件，— 不提供；“成熟度”只评价表内能力，不评价产品整体。

| 方案 | 平台/对象 | 测试层与定位 | 同步/稳定性 | 视觉能力 | 自然语言/代理 | 成熟度（截至 2026-08-10） | 适合选择 | 主要边界 |
|---|---|---|---|---|---|---|---|---|
| Playwright | Chromium/Firefox/WebKit Web | 浏览器上下文；role/label/text/test-id/CSS 等 Locator | ★★★★★ actionability + auto-retry expect | ★★★★ 官方 screenshot baseline；环境需固定 | ★★★★ 官方 MCP、planner/generator/healer；CI 自动修复仍应试点 | 核心生产；视觉生产-有条件；Agents/MCP 试点 | Web E2E、API+UI、trace 诊断、代理生成草稿 | 不负责原生 Android/iOS app；截图 baseline 不应跨环境混用 |
| Appium + UiAutomator2 | Android native/hybrid/web | W3C/WebDriver + Android driver；跨语言/黑盒 | ★★★ 依赖 server/driver/ADB/device，需显式等待 | ★★★ 官方 Images plugin、模板/相似度比较 | ★★ 没有官方通用 NL agent；可由外部 agent 调 WebDriver/MCP | 核心生产-有条件；AI/视觉扩展试点 | 跨 app、真实设备、跨语言、黑盒回归 | 链路深；driver 版本和 Android SDK/ADB 兼容性必须锁定 |
| Appium + XCUITest | iOS/iPadOS/tvOS native/hybrid/web | W3C/WebDriver + WebDriverAgent + XCTest | ★★★ 依赖 macOS/Xcode signing/WDA/device | ★★★ Images plugin 可用但非语义视觉 | ★★ 无官方通用 NL agent | driver 生产-有条件；AI/视觉扩展试点 | 跨平台协议、统一设备农场、跨语言 | XCUITest driver 10+ 仅兼容 Appium 3；诊断面比原生更长 |
| Maestro | Android/iOS/Web；emulator/simulator/real device/browser | YAML interpreted flow，文本/语义/层级查询 | ★★★★ 官方宣称 smart waiting/flakiness tolerance；仍需项目实测 | ★★★ flow screenshot/assert 可用；需固定渲染环境 | ★★★ Maestro MCP 已在 CLI；`maestro-ai` 是 demo/库，不能当通用自愈 | 核心 flow 生产-有条件；MCP/AI 试点 | 快速跨平台 smoke/E2E、产品/QA 共读、低代码流程 | 复杂原生白盒断言、底层性能/同步控制不如 Espresso/XCTest |
| Espresso | Android app 内部 UI | instrumentation；View matcher、actions、assertions | ★★★★★ 主线程/AsyncTask/IdlingResource 同步 | ★★ 非核心视觉回归工具 | — 官方文档未提供 NL agent | Android 原生生产 | 开发者拥有源码、组件级高频测试、快速反馈 | 需要源码/测试构建；跨 app/系统 UI/黑盒流程不合适 |
| XCTest + XCUITest | Apple native UI | Apple 原生 UI test target；Accessibility + XCUI queries | ★★★★ 原生整合；异步需 expectation/平台语义 | ★★ 失败时 UI snapshot/报告，不等于视觉回归 | — Apple 官方资料未提供 NL agent | iOS 原生生产-有条件 | iOS/iPadOS 原生可靠门禁、Accessibility 质量、Xcode CI | Xcode/macOS/device/signing 约束；历史 archive 文档版本需谨慎 |
| 视觉回归（作为横切层） | Web/mobile screenshot | 只比较渲染输出，不能替代语义断言 | ★★ 受字体、OS、动画、网络、设备影响 | ★★★★ 视觉 oracle；Appium Images/Playwright 官方支持 | ★★ AI 可辅助聚类/解释，但不能自动批准 | 生产-有条件 | 设计系统、关键页面、跨 viewport 变更检测 | baseline 审批、mask/阈值、环境一致性不可省略 |
| 自愈/自然语言 agent（横切层） | Web 较强；移动研究中 | 读取 DOM/accessibility/screenshot，规划行动，提出 patch | ★★ 依赖模型、上下文、环境；需 replay | ★★ 视觉模型可补充，但不保证语义正确 | ★★★ Web 官方已产品化入口；移动更多为 MCP/研究 | 试点/实验 | 探索、草拟、失败诊断、候选 locator 修复 | 不把成功率、benchmark 分数或一次修复当作测试正确性 |

### 推荐组合

| 场景 | 默认组合 | 备选/补充 |
|---|---|---|
| Web 关键用户旅程 | Playwright semantic locators + web-first assertions + trace | screenshot/ARIA snapshot；代理只生成/诊断 |
| Android 单模块快速反馈 | Espresso | 少量 Maestro/Appium 黑盒跨 app smoke |
| Android 全链路/真实设备 | Maestro 或 Appium UiAutomator2 | 关键内部状态用 Espresso 补齐 |
| iOS 原生门禁 | XCUITest/XCTest | Maestro/Appium 做跨平台旅程或设备编排 |
| Android+iOS 同一业务流 | Maestro | 平台差异深的断言下沉到 Espresso/XCUITest |
| AI 探索与生成 | Playwright Agents/MCP；Maestro MCP | AndroidWorld/论文方法作为实验基准，不直接进发布门禁 |

## 4. 分层架构

```text
L0 需求与测试 oracle
    业务不变量、风险分级、数据契约、可观测性、隐私/权限边界
        ↓
L1 场景模型 / 可执行规格
    人类批准的 Given-When-Then、YAML flow、seed test、测试数据和预期结果
        ↓
L2 语义交互适配器（默认路径）
    Web: Playwright Locator       Android: Espresso matcher / UiAutomator2
    iOS: XCUIElementQuery          Cross-platform: Maestro query
        ↓
L3 同步与状态控制
    web-first assertions / idling resources / XCTest expectation / smart waiting
    网络 stub、clock、权限、账号、数据库 seed、app reset、设备健康检查
        ↓
L4 平台执行层
    BrowserContext | Android instrumentation/emulator/device | Xcode simulator/device
    Appium server + driver + WDA/ADB | Maestro driver/CLI/MCP
        ↓
L5 观测与证据层
    JUnit/HTML result、trace、video、screenshot、UI hierarchy、device log、network log
        ↓
L6 AI 辅助层（旁路，受策略门控）
    需求→草稿；trace→故障分类；DOM/accessibility/screenshot→候选 locator/patch；
    代理探索→新增候选场景；任何写回必须产生 diff、证据和人工批准
        ↓
L7 质量门禁
    确定性断言 + 视觉基线审批 + 重跑/隔离策略 + 变更审计 + 发布决策
```

### 设计原则

- **Oracle 先于 Agent**：AI 可以帮助找到“怎么走”，但不能决定“什么算对”。业务不变量必须来自需求、领域专家或可验证服务契约。
- **语义先于像素**：先用 accessibility/role/label/resource-id/test-id；视觉或坐标只作为明确记录的 fallback。视觉找到按钮不代表点击后的业务结果正确。
- **平台能力下沉**：Espresso/XCUITest 负责原生内部速度与可见性；Maestro/Appium 负责跨 app/黑盒/设备；不要用跨平台抽象抹掉平台特有风险。
- **AI 只旁路写回**：代理产出的 flow、test、locator patch、baseline 变更均进入 review；运行时不得静默修改仓库或门禁。
- **每次失败可复盘**：保留输入版本、设备、应用 build、测试 commit、AI prompt/model/version、工具 trace 与修复 diff，才能区分产品缺陷、测试缺陷、环境故障和代理错误。

## 5. 标准 SOP

### A. 设计与接入

1. **分级风险**：P0 支付/权限/账号/数据破坏只允许确定性路径和人工批准；P1 核心业务可进入阻断门禁；P2 视觉/探索可异步；P3 代理生成的候选只做报告。
2. **先定义 oracle**：为每个场景写前置状态、动作、可观察结果、业务不变量、清理动作；禁止只写“页面看起来正确”。
3. **选择最短平台链**：Web→Playwright；Android 白盒→Espresso；iOS 原生→XCUITest；跨平台/黑盒→Maestro/Appium。只有存在跨 app、设备农场或统一协议理由时才增加 Appium 层。
4. **建立可访问性契约**：按钮、输入框、列表项、错误提示都有稳定 role/label/content description/accessibility identifier/resource-id/test-id。把缺失测试标识视为产品可测试性缺陷，而不是让 AI 猜坐标。
5. **固定环境**：锁定运行时、浏览器/SDK、字体、时区、locale、动画、网络 stub、账号和种子数据；移动端记录 emulator/simulator image、设备型号、OS、分辨率、Xcode/ADB。

### B. 编写与验证

1. 用官方 codegen/UI recording/Studio 只生成初稿；人工改成语义 locator、Page/Screen object 或可读 flow。
2. 每一步使用框架原生同步：不要在 Playwright 里先 `sleep`，不要在 Espresso/XCUITest 里盲等；等待业务状态或平台可观测状态。
3. 每个动作后有最小、明确的断言；关键路径同时断言结构化状态与必要的视觉区域。
4. 为失败打开证据：Playwright trace；Appium server/driver/WDA/ADB log；Maestro report/screenshot/viewer；Espresso/XCTest result、screenshot、console/device log。
5. 首次运行只创建候选基线，不自动批准；视觉基线变更必须由变更作者说明原因并由责任人审批。
6. 本地重复至少 10 次，CI 在干净 worker 重复至少 30 次；记录 flake rate、p50/p95、失败分类，而不是只看一次绿色。

### C. AI 引入

1. 给 agent 最小权限：只读源码/DOM/accessibility/trace；默认无生产凭据、无外网副作用、无提交权限。
2. 代理输出强制结构：场景、观测、候选动作、候选 locator、预期、证据引用、置信度、未决问题。
3. 生成测试先跑静态检查，再跑 replay；任何 patch 必须展示前后 diff、通过次数、未通过场景、可能的误修复。
4. Healer 只能尝试 locator/wait/fixture 等限定白名单；禁止修改业务 assertion、删除步骤、放宽阈值、增加无限重试、改成 `skip`。
5. 对外部模型脱敏：账号、token、个人数据、支付信息和内部源码按数据分级处理；保留模型与 prompt 版本。

### D. 发布门禁

1. 环境健康门禁通过：设备在线、app 安装/签名正确、server/driver 版本可记录、依赖服务可达。
2. 确定性 suite 通过；重试后的首次失败也保留，不得用 retry 覆盖 flake。
3. 视觉变更有基线 diff 和审批；没有审批的更新为阻断或明确标记人工检查。
4. AI 只作为附加信号：agent 成功不能覆盖确定性失败；agent 失败也不自动判定产品失败。
5. 输出可复现包：命令、版本、设备、日志、trace、截图、HAR/网络摘要、测试 commit、AI 记录。

## 6. 可运行样例与脚本清单

以下样例使用官方公开 API；需替换 URL、appId、bundleId、资源 ID 和测试数据后运行。它们是最小 smoke，不声称覆盖完整产品。

### 6.1 Web / Playwright（TypeScript）

安装与运行：

```bash
npm init playwright@latest
npx playwright install
npx playwright test --trace=on-first-retry
npx playwright show-report
```

`tests/checkout.spec.ts`：

```ts
import { test, expect } from '@playwright/test';

test('semantic login and visual checkpoint', async ({ page }) => {
  await page.goto('https://example.test/login');
  await page.getByLabel('Email').fill('qa@example.test');
  await page.getByLabel('Password').fill('test-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByTestId('account-status')).toHaveText('Active');
  // First run creates a candidate; approve only after human review.
  await expect(page.getByTestId('dashboard-shell')).toHaveScreenshot('dashboard-shell.png');
});
```

代理/自然语言试点（不进入无审查门禁）：

```bash
npx playwright init-agents --loop=codex
# 由 agent 读取 specs/ 中的人类批准的场景，生成 tests/ 草稿
npx playwright test --debug=cli
# 失败后仅允许 healer 产生候选 diff；review 后再提交
```

### 6.2 Android / Espresso（Kotlin）

依赖（版本应跟随项目 AndroidX BOM/锁文件）：

```kotlin
androidTestImplementation("androidx.test.ext:junit:<locked>")
androidTestImplementation("androidx.test.espresso:espresso-core:<locked>")
```

```kotlin
@RunWith(AndroidJUnit4::class)
class LoginUiTest {
  @get:Rule val scenario = ActivityScenarioRule(LoginActivity::class.java)

  @Test
  fun validLogin_showsDashboard() {
    onView(withId(R.id.email)).perform(typeText("qa@example.test"))
    onView(withId(R.id.password)).perform(typeText("test-password"))
    onView(withId(R.id.sign_in)).perform(click())

    onView(withId(R.id.dashboard_title))
      .check(matches(isDisplayed()))
      .check(matches(withText("Dashboard")))
  }
}
```

异步网络/后台任务应接入 `IdlingResource` 或测试替身，而不是 `Thread.sleep`。官方说明 Espresso 会在 `onView()` 前检查 UI message queue、AsyncTask 和开发者定义的 IdlingResource。

### 6.3 Android / Maestro YAML

```yaml
appId: com.example.app
---
- launchApp:
    clearState: true
- tapOn:
    id: email
- inputText: qa@example.test
- tapOn:
    id: password
- inputText: test-password
- tapOn:
    text: Sign in
- assertVisible:
    text: Dashboard
- takeScreenshot: login-dashboard
```

运行与诊断：

```bash
java -version                 # Java 17+
maestro --version
adb devices                   # Android
maestro test .maestro/login.yaml
maestro hierarchy             # 检查当前 UI 层级（按当前 CLI 帮助为准）
```

### 6.4 iOS / XCTest + XCUITest（Swift）

`LoginUITests.swift`：

```swift
import XCTest

final class LoginUITests: XCTestCase {
    func testValidLoginShowsDashboard() {
        let app = XCUIApplication()
        app.launchArguments += ["-ui-testing", "-stub-network"]
        app.launch()

        let email = app.textFields["email"]
        XCTAssertTrue(email.waitForExistence(timeout: 5))
        email.tap()
        email.typeText("qa@example.test")

        let password = app.secureTextFields["password"]
        password.tap()
        password.typeText("test-password")

        app.buttons["Sign in"].tap()
        XCTAssertTrue(app.staticTexts["Dashboard"].waitForExistence(timeout: 5))
    }
}
```

```bash
xcodebuild -scheme App -destination 'platform=iOS Simulator,name=iPhone 16' test
```

`accessibilityIdentifier`/label 是查询契约；不要依赖屏幕坐标。Apple 官方说明 UI testing 依靠 Accessibility 数据、查询 UI 对象、合成事件并对对象状态断言。

### 6.5 Appium / WebDriver（Python，Android 示例）

准备：

```bash
node --version                  # Appium 3: >= 20.19.0
npm install -g appium
appium driver install uiautomator2
appium driver doctor uiautomator2
appium
```

```python
from appium import webdriver
from appium.options.android import UiAutomator2Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = UiAutomator2Options()
options.platform_name = "Android"
options.automation_name = "UiAutomator2"
options.app_package = "com.example.app"
options.app_activity = ".MainActivity"

driver = webdriver.Remote("http://127.0.0.1:4723", options=options)
try:
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "com.example.app:id/email"))
    ).send_keys("qa@example.test")
    driver.find_element(By.ID, "com.example.app:id/password").send_keys("test-password")
    driver.find_element(By.ACCESSIBILITY_ID, "Sign in").click()
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ACCESSIBILITY_ID, "Dashboard"))
    )
finally:
    driver.quit()
```

### 6.6 官方能力脚本/命令清单

| 目的 | Playwright | Android | iOS | 证据应保存 |
|---|---|---|---|---|
| 版本 | `npx playwright --version` | `./gradlew dependencies`、`appium --version`、driver list | `xcodebuild -version`、`xcrun simctl list` | stdout、lockfile、设备 image |
| 环境健康 | `npx playwright install --dry-run`（按版本支持） | `adb devices`、`appium driver doctor uiautomator2` | `xcodebuild -showsdks`、签名/设备信任 | preflight JSON |
| 生成草稿 | `npx playwright codegen URL` | Maestro Studio/flow 草稿；Appium Inspector（作为工具，不当 oracle） | Xcode UI Recording | 生成文件 + 人工修改 diff |
| 运行 | `npx playwright test --trace=on-first-retry` | `./gradlew connectedAndroidTest` / `maestro test` / Appium client | `xcodebuild test` | JUnit、截图、视频、日志 |
| 失败复盘 | `show-trace trace.zip`、HTML report | Appium server/driver/WDA/ADB log、Maestro report | `.xcresult`、device console、UI snapshot | 统一 failure bundle |
| 视觉 | `expect(page).toHaveScreenshot()` | Maestro screenshot/assert；Appium Images plugin | 截图后接外部/项目视觉比较器 | baseline、diff、审批记录 |
| AI 试点 | `init-agents`、Playwright MCP | Maestro MCP；AndroidWorld benchmark | 自建 agent + XCUITest/MCP（实验） | prompt、model、tool calls、replay |

## 7. 失败诊断

### 7.1 先判定故障层，不要先让 AI 改 locator

```text
测试失败
  ├─ preflight 失败？→ 环境/版本/设备/签名/driver；停止，不改测试
  ├─ session 建立失败？→ Appium server/WDA/ADB/Xcode/权限/端口
  ├─ 元素不存在或多匹配？→ hierarchy/DOM/accessibility；检查产品契约和页面状态
  ├─ actionability/timeout？→ 动画、遮罩、网络、异步；修复可观测等待或 fixture
  ├─ assertion 失败？→ 先保留原始证据；判定产品缺陷、数据错、oracle 错
  ├─ screenshot diff？→ 校准环境→排除动态区→人工审核→再决定基线
  └─ agent 失败？→ 固定状态重放；记录观察→动作→结果；不得以“模型不确定”代替结论
```

### 7.2 分类表

| 症状 | 常见根因 | 必取证据 | 修复优先级 |
|---|---|---|---|
| locator 找不到 | accessibility/test-id 缺失、页面未到达、语言/权限弹窗、错误 app/build | DOM/ARIA snapshot 或 UI hierarchy、URL/route、截图、app log | 先修状态与可测试性契约；最后才考虑 fallback |
| locator 多匹配 | 选择器过宽、重复 label、列表未限定容器 | locator count、层级树、渲染数据 | 加 role + name + container；禁止盲选 first |
| Playwright click timeout | 不可见、动画未停、被遮挡、未启用 | trace actionability、截图、console/network | 用语义等待/状态断言；不默认 `force: true` |
| Espresso flaky | 未注册 IdlingResource、后台任务不受测试控制、共享状态污染 | logcat、线程/网络 fake、测试顺序 | 接入同步资源、隔离 fixture、去掉 sleep |
| XCUITest timeout | app 未启动、Accessibility label 不稳定、系统弹窗、simulator 状态 | `.xcresult`、UI snapshot、simctl、console | reset/权限/identifier；用 `waitForExistence` 表达等待 |
| Appium session/WDA 失败 | Node/Appium/driver/Xcode 不兼容、签名/端口/设备信任 | server log、driver log、WDA log、capabilities、版本 | 固定兼容矩阵；逐层最小复现 |
| Maestro flow flaky | 动态文本、flow 状态未清理、设备/网络差异 | flow report、截图、hierarchy、设备日志 | 明确 `clearState`/数据、语义查询、等待条件 |
| 视觉误报 | 字体/OS/browser/scale/动画/时间/广告/网络差 | baseline metadata、diff、渲染环境 | 固定环境、mask 动态区、阈值审批；不直接放宽阈值 |
| 自愈后绿色但功能错 | AI 点到相似控件、删掉断言/步骤、修改 oracle | patch diff、原失败、重放、业务状态/接口 | 禁止自动写回；要求反例集和人工 review |
| 代理循环/成本高 | 状态不可重复、上下文不足、工具返回过大、目标不闭合 | prompt、tool call、step count、token/cost | 限步数/权限/预算；先用结构化树，必要时才上视觉 |

### 7.3 诊断禁忌

- 不把重试通过率当作真实稳定性；报告“首次失败率”和“最终失败率”两项。
- 不把 `force`、坐标点击、全局 sleep、无限 retry、skip 当作修复。
- 不把网络 500、设备离线、WDA 崩溃、app assertion failure 归到同一“测试失败”。
- 不让 AI 在没有 trace/hierarchy/console/业务状态的情况下提出高置信度根因。

## 8. AI 引入边界与成熟度判定

### 8.1 可以生产使用的 AI 辅助

在“人审后写回”的前提下，以下可先用于生产团队流程：

- **需求→测试草稿**：把已批准场景转成 Playwright spec、Maestro YAML、Espresso/XCUITest 模板；必须经过编译、lint、replay 和 review。
- **失败摘要**：从 trace、截图、层级树、日志中生成时间线和候选分类；原始证据仍是唯一事实源。
- **候选 locator 修复**：只从当前 accessibility/DOM 树中提出候选，给出旧/新 locator、匹配数和反例结果。
- **测试探索**：在隔离 demo/staging 账号上发现未覆盖流程，产出候选场景而非直接发布测试。
- **视觉 diff 聚类/说明**：帮助人类在大量差异中定位相似变更；最终由固定规则和人工批准决定。

### 8.2 只做实验/试点

- Playwright Healer 自动修复并反复重跑：官方已有明确工作流，但“修复成功”可能只是绕过了真实缺陷；先在非阻断分支，以 false repair rate 作为门槛。
- Playwright MCP、Maestro MCP 驱动浏览器/移动设备：工具接口成熟度不等于 agent 决策正确性；必须限制设备、账号、动作集合和步数。
- Maestro `maestro-ai` 截图缺陷 demo：仓库需要模型 API key，样例是缺陷识别 demo；不能外推为通用移动测试自愈。
- 视觉找元素、OCR/模板匹配作为主 locator：在无 accessibility metadata 的 legacy UI 可做 fallback，但必须有误点反例、动作前后二次断言和人工审计。
- AndroidWorld、DroidAgent、ScenGen 等论文方法：适合评估探索和生成能力，尚不等于生产回归测试框架。

### 8.3 明确禁止自动化的动作

1. 自动批准或覆盖视觉基线。
2. 自动删除、弱化或重写业务断言。
3. 失败后自动添加无限等待、`force`、retry 或 skip 使 pipeline 变绿。
4. 在生产账号执行支付、转账、删除、发布、权限授权等副作用动作。
5. 把模型自报的“通过”“已修复”“高置信度”当作证据。
6. 将个人数据、秘密、token、客户页面截图发送给未批准的模型服务。

## 9. 验收实验设计

所有实验先在固定 demo app/staging 环境进行；实验报告必须包含工具/driver/model 版本、设备、应用 commit、数据 seed、原始 artifacts 和复现命令。

### E1：确定性基线与 flake

- **对象**：同一 10 个 Web、10 个 Android、10 个 iOS 关键场景；分别用 Playwright、Espresso/Maestro 或 Appium、XCUITest/Maestro。
- **运行**：干净 worker 本地 10 次，CI 30 次；收集首次失败率、最终失败率、p50/p95、平均设备占用、失败分类。
- **通过门槛示例**：P0 场景首次失败率 0；P1 首次失败率 ≤1%，且所有失败可分类；任何未分类失败阻断接入。
- **目的**：先证明基础自动化稳定，再测 AI；禁止用 AI 结果替代基线。

### E2：可测试性/locator 突变实验

- **突变**：改按钮文案、DOM 顺序、无关 CSS class、Android 资源位置、iOS view hierarchy；保持业务语义不变。另做“相似错误控件”反例。
- **比较**：语义 locator、坐标/图像 locator、AI healer 候选；记录检测率、误修复率、修复后业务 oracle 通过率。
- **通过门槛**：任何自动写回方案必须 `business-oracle-pass = 100%`；候选 patch 误修复率为 0 才能进入阻断候选。否则仅建议模式。

### E3：视觉回归实验

- **基线**：同一 OS/browser/SDK/device image/字体/scale 下生成 baseline；分别注入 1px layout、颜色、文案、字体、动态时间和真实缺陷。
- **指标**：true positive、false positive、区域定位准确率、人工审批时间；Playwright screenshot、Maestro screenshot/assert、Appium Images plugin 分开计量。
- **通过门槛**：关键区域真实缺陷召回率 ≥99%；动态区域误报率 ≤5%；任意阈值/遮罩变更必须有 diff review。

### E4：自然语言 agent 可控性实验

- **任务**：从 20 个已知场景 + 10 个危险动作反例中抽样；给 agent 业务目标、最小工具集和隔离账号。
- **记录**：task success、oracle pass、wrong-action、step count、cost、time、越权动作、重复运行一致性（至少 5 次）。
- **通过门槛**：agent 只能在 staging；危险反例越权动作 0；`task success` 与 `oracle pass` 必须同时满足；任何一次错误业务状态都计为失败。
- **研究对照**：可使用 AndroidWorld 任务或其自定义任务，但报告必须写明 benchmark 不代表生产缺陷检测能力。

### E5：自愈安全实验

- **注入**：只破坏 locator、等待和 fixture；另注入真实产品断言失败、服务 500、权限弹窗和设备离线。
- **期望行为**：自愈器只对允许类别提出 patch；对产品失败/环境失败停止并正确分类；不得改 oracle。
- **指标**：repair precision、repair recall、false repair、unsafe mutation、人工接受率、修复后 30 次稳定率。
- **通过门槛**：`false repair = 0`、`unsafe mutation = 0`；否则不上阻断 pipeline。

### E6：跨平台一致性实验

- **场景**：登录、搜索、创建、错误提示、权限拒绝、离线恢复各 1 条；以同一业务 oracle 映射到 Maestro + 平台原生补充测试。
- **检查**：文本/Accessibility 语义是否一致、时区/locale、键盘、返回手势、权限弹窗和后台恢复。
- **结论**：只比较业务结果，不要求三套 UI locator 相同；如果平台语义不可比，应拆分 oracle，而不是在跨平台层强行兼容。

## 10. 证据边界与未决问题

- 官方文档能证明 API、架构、安装与官方功能存在，不能单独证明某个项目的 flake rate、ROI 或“AI 生产级”。这些必须通过上述实验测得。
- Apple 当前文档页面需要 JavaScript，本文使用 Apple archive 的 UI testing 模型作可引用的一手证据，并显式标记其 2017 更新日期；现代 Xcode/SDK 的具体 API 以本地 SDK 文档和构建验证为准。
- Maestro 官方 README 说明 smart waiting、跨平台 flow 和 MCP/Studio 入口；本文未找到官方承诺“通用自愈 locator”或“自然语言代理可安全替代 YAML 测试”，因此按试点处理。
- Appium Images plugin 是模板/图像比较能力，不应写成视觉语言模型；Appium 生态中非官方 driver/plugin 的维护、许可证、隐私和安全要逐项审查。
- 论文中的 benchmark 分数、任务覆盖率、模型通过率不能直接映射到企业回归测试的缺陷召回率、合规性和稳定性。

## 11. 可复用决策卡

```text
如果目标是 Web 关键路径：Playwright。
如果目标是 Android 源码内、快速、可控同步：Espresso。
如果目标是 iOS 原生、Apple 生态和 Accessibility：XCUITest/XCTest。
如果目标是 Android+iOS 共用黑盒 flow：Maestro，平台深度断言下沉原生。
如果目标是跨 app/真实设备/多语言/统一 WebDriver：Appium，接受较长故障链。
如果目标是视觉差异：在确定性测试旁加视觉层，不用它替代语义 oracle。
如果目标是 AI：先做草拟、探索、诊断和候选修复；用 E1–E5 证明安全后，仍不让 AI 改 oracle。
```

## 12. 最小来源清单（便于复核）

### 官方文档 / 官方 GitHub

1. [Playwright Locators](https://playwright.dev/docs/locators)
2. [Playwright Auto-waiting](https://playwright.dev/docs/actionability)
3. [Playwright Assertions](https://playwright.dev/docs/test-assertions)
4. [Playwright Visual comparisons](https://playwright.dev/docs/test-snapshots)
5. [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
6. [Playwright Test Agents](https://playwright.dev/docs/test-agents)
7. [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
8. [Appium Drivers](https://appium.io/docs/en/latest/ecosystem/drivers/)
9. [Appium Intro to Drivers](https://appium.io/docs/en/latest/intro/drivers/)
10. [Appium Migrating to 3](https://appium.io/docs/en/latest/guides/migrating-2-to-3/)
11. [Appium UiAutomator2 quickstart](https://appium.io/docs/en/latest/quickstart/uiauto2-driver/)
12. [Appium Plugins](https://appium.io/docs/en/latest/ecosystem/plugins/)
13. [Appium XCUITest driver](https://github.com/appium/appium-xcuitest-driver)
14. [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
15. [Maestro documentation](https://docs.maestro.dev/)
16. [Maestro AI source](https://github.com/mobile-dev-inc/maestro/tree/main/maestro-ai)
17. [Maestro MCP source](https://github.com/mobile-dev-inc/maestro/blob/main/maestro-cli/src/main/java/maestro/cli/command/McpCommand.kt)
18. [Android Espresso](https://developer.android.com/training/testing/espresso)
19. [Android testing samples](https://github.com/android/testing-samples)
20. [Apple User Interface Testing](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/09-ui_testing.html)
21. [Apple XCTest](https://developer.apple.com/documentation/xctest)
22. [Apple XCUIAutomation](https://developer.apple.com/documentation/xcuiautomation)
23. [W3C WebDriver](https://www.w3.org/TR/webdriver2/)

### 论文 / 研究基准

1. [AndroidWorld](https://arxiv.org/abs/2405.14573) / [official repository](https://github.com/google-research/android_world)
2. [DroidAgent](https://arxiv.org/abs/2311.08649)
3. [LLM mobile GUI text input study](https://arxiv.org/abs/2404.08948)
4. [ScenGen: LLM-Guided Scenario-based GUI Testing](https://arxiv.org/abs/2506.05079)
5. [Mobile-Agent-v3.5](https://arxiv.org/abs/2602.16855)

---

**复用结论**：生产基线应由 Playwright / Espresso / XCUITest / Maestro / Appium 的确定性能力组成；视觉是受控的附加 oracle；AI 是受权限、证据、反例和人工审批约束的辅助层。任何声称“自然语言代理已经替代 UI 自动化工程”的结论，若没有 E1–E5 的产品级实验数据，都应标记为实验性或未知。
