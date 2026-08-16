# 术语歧义与待裁决登记

日期：2026-08-12。以下词不能在课程中被自动改写成另一术语。未由 owner 关闭前，相关课程名称与工具结论保持 `UNKNOWN`。

| ID | 用户原词 | 已核到的证据 | 当前裁决 | 下游处理 |
| --- | --- | --- | --- | --- |
| AMB-01 | CAIA 基准测试 | 精确检索可核到 CAIA/CAIBA 是面向加密资产交易 Agent 的专用 benchmark；`CAIA` 也常被用作 Colorado AI Act 缩写；通用 Agent benchmark 的权威名称另有 GAIA。 | `UNKNOWN`：不能把 CAIA 自动当作 GAIA、C-Eval、信通院 CAICT、Colorado 法案或通用企业基准。 | 蓝图暂列“公共 Benchmark 与企业 Benchmark”，只有 owner 给出 definition URL、领域和版本后才启用具体 CAIA adapter；涉及法律时还需 jurisdiction/statute/version/checked_at/legal owner。 |
| AMB-02 | 飞速 MCP | 用户于 2026-08-12 明确更正为“飞书 MCP”；飞书开放平台有 MCP 概述和本地 OpenAPI MCP 官方文档。 | `RESOLVED`：目标平台为飞书 MCP，不是 FastMCP。 | 课程建立 `feishu-collaboration-adapter`：覆盖消息、文档/表格、任务/审批、报告回写、权限、脱敏、幂等、审计和失败恢复；MCP server framework 仍是独立技术层。 |
| AMB-03 | Web Coding 的道法术器 | 未找到稳定、权威的“Web Coding 道法术器”方法定义；相关研究和行业讨论更常用 “Vibe Coding”。 | `UNKNOWN`：可能指 Web 开发方法，也可能指 Vibe Coding。 | 若是 Web 开发，进入 Web 自动化/前端质量；若是 Vibe Coding，进入“意图→规格→生成代码→独立测试→安全审查→发布证据”单元。 |
| AMB-04 | AI 味检测 | “AI 味”可能指内容空泛/模板化，也可能指判断文本是否由 AI 创作。学术证据显示通用作者检测容易被改写攻击并有误报/漏报。 | 分成两项：`内容质量缺陷检测` 可落地；`作者身份检测` 不可作为确定性事实。 | Skill 应强制使用来源、具体性、重复度、可执行性、领域术语、证据和错误率等 rubric；detector 只能作弱信号。 |
| AMB-05 | 向量化解耦 | 该词不是 MCP 或 Skill 规范中的标准合同。合理工程含义可能是使用 embedding 做 Skill/知识发现，同时保持执行契约与权限路由确定。 | `INFERENCE`，不是标准原文。 | 向量检索只负责候选发现和排序；激活、版本、依赖、权限、副作用和输出路径必须由 exact ID、namespace 和 policy graph 决定。 |

## 关闭证据要求

每个歧义项至少需要：`term_id`、精确定义、官方或项目权威 URL/文件、适用范围、反例、owner、批准时间、被替代术语和下游影响。用户对本人原始输入的明确更正可关闭拼写歧义；平台能力与技术结论仍需官方文档和运行证据。
