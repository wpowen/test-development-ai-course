# 测试开发 × AI 教程站

面向测试开发工程师的 AI 质量工程教程。课程不是工具清单，而是从职业问题出发，逐页完成可验证产物。

## 当前版本

- **13 个模块 / 102 页**公开学习页，覆盖传统测试基线、大模型基础、AI 辅助测试、LLM/RAG、Agent/Workflow、模型服务、质量工程平台、Benchmark、职业演进与 Capstone；另有 4 个未完成主题保留在内部，不对外投影。
- **每页六段固定结构**：术语前置 → 方法判断表 → 反例（含"为什么它看起来是对的"）→ 症状到层的诊断树 → 可运行或手工演练 → 本页带走物。
- **102/102 页通过全部结构与深度门禁**，0 个导航占位页。
- 5 套可运行 lab 均复现 `PASS → FAIL → PASS`（0/1/0 红绿约定），仅依赖标准库。
- 91 张架构图 / 设计图（SVG，双主题安全），16 个物料包，四跳字节一致闭包。

## 证据边界（重要）

当前证据等级为 **L1 fixture-tested**：离线夹具可复现。

它证明的是内容结构与深度达标、命令逐字可执行、材料闭包成立、lab 红绿可复现。它**不**证明任何真实模型准确率、企业集成效果、从业者认可或生产收益。`model-integrated`、`integration-tested`、`practitioner-reviewed`、`production-validated` 四级全部 `NOT_RUN`，不得由本站内容的完整性推断为已验证。

## 本地预览

```bash
npm install
npm run dev
```

## 验证

```bash
npm test
```

`npm test` 串联的门禁：

| 门禁 | 命令 | 检查什么 |
| --- | --- | --- |
| 内容结构与深度 | `validate:content` | 块数、outcomes、practice、来源、正文中文字符数 ≥ 1600、每页判断表 ≥ 3 张、模块内句级重复率 ≤ 20% |
| 可执行性 | `audit:executability` | 命令与 manifest 逐字一致、路径已发布、cwd 显式 |
| 材料闭包 | `validate:materials` | canonical → public → static → ZIP 四跳字节一致 |
| 完整性清单 | `test:integrity` | 逐页 promotion receipt 与哈希 |
| 视觉契约 | `test:agent-visuals` | 架构图与页面引用一致 |
| 类型 / 构建 / 静态导出 | `typecheck`、`build`、`test:static` | SSR、静态导出 JS 语法、交付状态诚实性 |

## 内容维护

`content/modules/*.ts` 是**投影产物，不是内容源**。

内容源为 `methodology/dimensions/_sources/*.json`（11 份，位于本仓库之外的完整工程包中），经两个生成器分别投影为本站 TypeScript 模块和 108 篇 Markdown 文档。**直接编辑 `content/modules/` 会在下次生成时被覆盖**——改内容请改 JSON 后重新生成。

`content/modules/topic-page.ts` 中的 `buildTopicPage` 已退役并会抛错：通用散文模板会产生同质化页面，跨页重复率门禁因此设立。

页面 ID 必须稳定；计划页不得写成已完成页；证据状态不能超出真实验证范围。

## 本仓库的范围

本仓库只包含**站点交付面**。完整工程包还包含以下内容，不在此处：

- `methodology/` — 方法论正文 15 篇 + 11 个维度 / 108 篇深度文档 + 内容源 JSON
- `courses/` — 5 套 learner-materials（可运行 lab、模板、检查单、Schema）
- `research/` — 逐题九件研究包、状态登记、共享脚手架声明
- `scripts/` — 投影生成器与发布候选构建

GitHub 用于版本、实验和复用物料；OpenAI Sites 用于学习体验。两个渠道从同一份已验证内容构建。
