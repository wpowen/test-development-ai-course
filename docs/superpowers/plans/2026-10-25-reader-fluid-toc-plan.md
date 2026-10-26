# 正文撑满 + 右栏可折叠 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 课站阅读器正文吃满左右栏之间全部宽度；右侧「本页导航」默认展开、可一键收起（镜像左侧目录折叠）。

**Architecture:** 在现有冷镜台 `app-shell` 上增加 `rail-collapsed`，与已有 `nav-collapsed` 对称；去掉 `.reader-inner` 的 760/880px 居中封顶，使正文随 `.reader` 的 margin 吃满栏间宽度。偏好写入 `localStorage` 键 `career-ai-rail-collapsed`。

**Tech Stack:** Next/vinext React SPA；CSS 变量 `--side` / `--rail`；现有 `page.tsx` 状态模式。

**Spec:** `docs/superpowers/specs/2026-10-25-reader-fluid-toc-design.md`（Owen 2026-10-25 批准方案 A）

## Global Constraints

- 只动壳：`app/globals.css`、`app/page.tsx`，及必要测试；不动课程文案、公开导航、lab、TD-M13 公开性
- 保持冷镜台 token；青绿 `#0f766e` 仅 active/进度/关键链
- 禁 Tailwind CDN
- 推送到现有 PR #1 分支 `cursor/cold-mirror-reader-shell-ef9a`（勿新开无关 PR，勿 merge main）
- 窄屏现有断点（右栏已隐藏）行为不变

---

### Task 1: 测试锚定流体宽度与右栏折叠约定

**Files:**
- Modify: `tests/rendered-html.test.mjs`（及若存在对 `reader-inner` / `nav-collapsed` 的断言处）
- Create if needed: 同文件内新增断言

**Interfaces:**
- Produces: 断言 CSS 含 `rail-collapsed` 或 `career-ai-rail-collapsed` 相关约定；断言 `.reader-inner` 不再使用 `min(760px` / `min(880px` 作为封顶（或断言 `width: 100%` / 等价吃满写法）

- [ ] **Step 1: 读现有测试** `tests/rendered-html.test.mjs` 中 `--side` / `--rail` 断言，扩展而非删除 `--rail: 200px`（展开态仍为 200px）。
- [ ] **Step 2: 写失败断言** —— 构建/读取产出 CSS 后：
  - 必须匹配 `career-ai-rail-collapsed`（出现在打包 JS 或源码导出路径中，与 `career-ai-nav-collapsed` 同级可测方式）
  - 必须匹配 `rail-collapsed`
  - 不得匹配 `min(760px` 与 `min(880px` 作为 `.reader-inner` 宽度封顶（若静态导出内联 CSS，对导出 CSS 断言）
- [ ] **Step 3: 跑测试确认失败**（实现前）
- [ ] **Step 4: 实现 Task 2–3 后再跑通并提交**

### Task 2: CSS — 正文吃满 + `rail-collapsed`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1:** `.reader-inner` 改为占满 `.reader`：`width: 100%`（或 `calc(100%)`），去掉 `min(760px, calc(100% - 56px))` 与导致两侧大留白的 `margin: 0 auto` 居中封顶；保留合理水平 padding（约 28–40px）与现有边框/背景。
- [ ] **Step 2:** `.reader-wide .reader-inner` / `.path-view .reader-inner` 同样吃满，去掉 `min(880px, …)`。
- [ ] **Step 3:** 增加与左侧对称的折叠规则（桌面断点内）：
  - `.app-shell.rail-collapsed .right-rail` 隐藏（`visibility`/`transform` 或等价，与左侧一致的过渡可选用）
  - `.app-shell.rail-collapsed .reader { margin-right: 0; }`
- [ ] **Step 4:** 窄屏（现有 `@media` 已 ` .right-rail { display: none }`）不因本改动回归；确认折叠类在窄屏无冲突。
- [ ] **Step 5:** 若需要收起后再展开的可见控件样式，为 `.rail-toggle`（或复用克制按钮类）写最小样式，气质对齐 `.nav-toggle`，勿新色板。

### Task 3: React — 状态、开关、持久化

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1:** 增加 `railCollapsed` state，默认 `false`（展开）。
- [ ] **Step 2:** 挂载时读 `localStorage.getItem("career-ai-rail-collapsed") === "1"` 初始化（镜像 `career-ai-nav-collapsed`）。
- [ ] **Step 3:** `toggleRail` 写入同一 key。
- [ ] **Step 4:** `app-shell` className 拼上 `rail-collapsed`（可与 `nav-collapsed` 并存）。
- [ ] **Step 5:** 在右栏标题「本页导航」旁或顶栏合适位置放一键开关；`aria-expanded={!railCollapsed}`；label/title：「收起本页导航」/「展开本页导航」。收起后仍须有可点的展开入口（顶栏右侧或等价，勿把用户锁死在收起态）。
- [ ] **Step 6:** 仅桌面课页展示右栏时启用；home/无右栏视图勿误显示坏掉的开关。

### Task 4: 验证与推送

- [ ] 跑相关测试（至少 `tests/rendered-html.test.mjs` 及项目惯用 `npm test` / 文档中的门禁；已知 `validate:materials` 缺父级 courses lab 可跳过并注明）
- [ ] 将 `docs/superpowers/specs/2026-10-25-reader-fluid-toc-design.md` 与本 plan 一并提交
- [ ] 推送到 PR #1 分支；更新 PR 说明简述本改动
- [ ] 报告：新 head SHA、改动文件列表、测试结果、如何本地预览

## 验收对照

- [ ] 宽屏无 760/880 居中留白
- [ ] 右栏默认开；收起后 margin-right 0、正文吃满
- [ ] 左栏折叠仍可用
- [ ] 刷新保留右栏偏好
- [ ] lab / 公开导航不变
