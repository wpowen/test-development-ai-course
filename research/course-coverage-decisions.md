# Course Catalog Coverage Decisions

更新时间：2026-08-11

## Decision

选择 research/course-topic-system-v3.md 的 105 个专业命题作为稳定知识主干，并新增 12 个主动审计高风险单元，形成 117 个 canonical topic。旧 46 课程合同和站点 107 ID 不删除，全部通过 migration CSV 映射到 canonical ID。

## 为什么不选 46 或 81

- 46 课程合同是过薄的阶段合同，多数把多个独立职业结果合并在一课。
- 107 个站点 ID 中仍有内部 outlined 页面；103 个公开页也不等于逐命题研究完成。
- 105 命题树覆盖专业主干，但仍漏掉若干传统专项和 AI 前沿责任，所以只作为主干，不冒充最终完整性。

## 合并与 alias 规则

- `TD-S01～S04` 合并到 API/平台/安全等 canonical 主题，保留 alias。
- `TD-F04` 与 `TD-T01/T02` 分解映射到 AI 系统结构主题。
- `TD-T05～T08` 与 `TD-P01～P08` 映射到需求、风险、设计、执行和发布 canonical 主题。
- `TD-A01～A06`、`TD-PS09～PS12` 和 `TD-AP01～AP08` 按协议、指标、工作负载、诊断、容量、降级和 Agent 任务性能拆分。
- 一个旧 ID 映射多个 canonical ID 时记为 `split-alias`；多个旧 ID 指向同一 canonical ID 时记为 merge aliases。任何 alias 的成熟度只在原 scope 内有效。
- TD-PS08、TD-PS05、TD-PS06、TD-PS07 分别作为 TD-X102、TD-X103、TD-X104、TD-X105 的覆盖 alias；保留原页面，不重复新建数据库、Web、Android、iOS 页面。

## 主动新增的 12 个 gap

- TD-X101 静态测试、架构、代码与依赖质量：怎样把设计评审、静态分析、依赖与供应链风险连接到可阻断证据？
- TD-X102 数据库、数据管道与迁移质量：怎样验证 Schema、数据质量、批流处理、回填和迁移不会破坏业务不变量？
- TD-X103 Web 兼容、可访问性与本地化质量：怎样把浏览器差异、辅助技术、语言和视觉变化变成可维护门禁？
- TD-X104 Android 质量工程：怎样验证生命周期、同步、权限、系统版本和设备矩阵下的业务旅程？
- TD-X105 iOS 质量工程：怎样验证签名、权限、状态残留、系统弹窗和设备版本下的业务旅程？
- TD-X501 多模态 AI 评测：怎样分别验证文本、图像、音频、视频及跨模态对齐，而不是只看最终描述？
- TD-X502 多语言、可访问性与包容性 AI 评测：怎样验证不同语言、方言、读写能力和辅助技术场景下的质量差异？
- TD-X601 公平性、伤害与人类监督有效性：怎样识别群体差异、错误自动化信任和无效人工复核？
- TD-X602 训练、Fine-tuning 与模型更新质量：训练数据、适配、模型更新和回滚怎样进入应用团队可审计的质量合同？
- TD-X603 长期 Memory、个性化与语义缓存质量：怎样验证记忆写入、读取、遗忘、隔离、缓存命中和陈旧内容风险？
- TD-X604 模型路由、Provider Fallback 与工具协议漂移：多模型路由、降级、MCP/工具 Schema 变化时怎样保持语义、权限和可重放性？
- TD-X805 在线实验、Canary 与人工抽样评审：没有实时黄金答案时，怎样用 Canary、代理信号和人工抽样支持发布与回滚？

## 当前 coverage verdict

- Canonical topics：117。
- 可宣称 complete：0。
- 内容门禁：117 blocked；目录覆盖不等于内容、从业者或发布门禁通过。
- 主动高风险 coverage gap：0；8 个 canonical 新页和 4 个专项 alias 已有明确落点。
- 旧站点中最强的执行证据仍是少数 Fixture；只有对应 alias 可记录该 maturity。
- 真实模型、真实平台、从业者评审和学习效果继续为 Unknown。

## 下一步

先按 canonical 顺序完成第一条 12 页初学者路径的逐命题研究与正文，再进入 Eval、LLM/RAG、Agent 和生产路线。禁止从 Agent 压测或平台集成页绕过 AI 基础、Eval 和安全前置。
