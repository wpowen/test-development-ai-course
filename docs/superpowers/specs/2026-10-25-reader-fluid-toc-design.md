# 课站阅读器：正文撑满 + 右侧本页导航可折叠

**日期：** 2026-10-25  
**状态：** Owen 已批准落地（方案 A｜对齐左侧）  
**仓库：** `wpowen/test-development-ai-course`（冷镜台 PR #1 分支）  
**范围：** 只动壳，不动文案 / 公开导航 / lab / TD-M13 公开性

## 背景

现网（冷镜台壳）正文 `.reader-inner` 用 `min(760px)` / 宽页 `min(880px)` 居中，左右栏之间大量留白。右侧「本页导航」固定 `--rail: 200px`，无法收起。左侧目录已有 `nav-collapsed`。

Owen 要求：
- 正文吃满左右栏之间的全部宽度（禁约 880px 居中左右留白）
- 右侧「本页导航」默认展开，可一键收起以增加阅读空间

## 方案（已选 A）

镜像左侧目录折叠模式：

1. **正文撑满**：`.reader-inner`（含 `.reader-wide` / `.path-view`）改为占满 `.reader` 栏宽（`width: 100%`），保留约 28–40px 内边距；去掉 `min(760px/880px)` 与居中造成的两侧留白。左栏或右栏收起时，正文随 `.reader` 的 `margin-left` / `margin-right` 立刻变宽。
2. **右栏可收**：`app-shell` 增加 `rail-collapsed`。展开：`--rail: 200px` + 固定右栏。收起：右栏隐藏、`margin-right: 0`。顶栏或右栏标题旁提供一键开关（视觉与左侧 `nav-toggle` 同级克制）。默认展开；`localStorage` 键 `career-ai-rail-collapsed`（`"1"` = 收起），与 `career-ai-nav-collapsed` 同套路。
3. **窄屏**：现有断点下右栏已 `display: none`，保持不变；桌面折叠逻辑不破坏移动端。

## 不做

- 不改色板 / 冷镜台气质 token
- 不改课程文案、去 AI 味（另 PR）
- 不把 TD-M13 放进公开导航
- 不引入浮层 TOC（方案 C）或细轨残留（方案 B）

## 验收

- 宽屏：正文无 760/880 居中留白，吃满左右栏之间
- 右栏默认展开；一键收起后栏位归零、正文吃满
- 左栏原折叠仍可用；左右可独立折叠
- 刷新后记住右栏偏好
- lab / 公开 13 模块导航行为不变

## 触达文件（预期）

- `app/globals.css`
- `app/page.tsx`
- 相关测试若断言 `reader-inner` 宽度或需覆盖 `rail-collapsed` / `career-ai-rail-collapsed`，一并更新
