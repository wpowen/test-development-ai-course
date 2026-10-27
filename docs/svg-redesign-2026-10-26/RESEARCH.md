# SVG 调研与样图评审

> 后续状态：用户已确认样图并授权全量重绘。本文保留首轮调研记录；最终交付、复核范围与验证结果见 [DELIVERY.md](DELIVERY.md)。

调研日期：2026-10-26。当前阶段：**仅样图，待用户确认**。本目录没有替换正式图片，也没有批量改图。

## 结论

本项目主要是中文技术教学图。适合采用“逐图内容建模 → 原生 SVG 精细排版 → 浏览器几何与目视检查 → 同源发布”的方式。精致程度来自信息层次、真实关系、留白、字体和视觉语义；增加渐变、阴影或图标不能补足缺失的内容。

本次实际采用：Codex 编写可编辑 SVG；参考 `svg-diagram` 的中文字体、连接线、箭头尺寸、避让和边界检查规范；Playwright + Chrome 实际渲染。没有安装新 Skill/MCP，没有向外部设计平台上传项目材料。工具的官方能力已调研，未调用的工具不记为实测。

## Skill、绘图工具与 MCP

| 方案 | 已核查的能力 | 对项目的适用性与取舍 | 本次状态 |
|---|---|---|---|
| [bybit-exchange/svg-diagram](https://github.com/bybit-exchange/svg-diagram) | 专门面向技术图的 SVG Skill；含中文排版、手工布局、连线规则及独立 lint 工具 | **优先参考**。比通用绘画提示更接近教学图需求；lint 只检查规则，不能证明语义正确或视觉精美。项目风格与图种仍需自行设计 | 阅读 SKILL.md，参考绘制规范；未安装或运行上游 linter |
| [linyaosky/svg-skill](https://github.com/linyaosky/svg-skill) | 原生 SVG、图标、流程图、图表、无障碍标记、组件输出 | 适合基础 SVG 工程规范；不会自动补齐课程知识，也不会自动产生出色的信息布局 | 阅读官方仓库与 Skill；未安装 |
| [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) | 将 Mermaid 文本生成 SVG、PNG、PDF | 流程、时序、状态图适合快速建模；复杂中文排版与多区教学版面仍需额外设计 | 文档调研，未运行 |
| [draw.io 官方 MCP](https://github.com/jgraph/drawio-mcp) / [SVG 导出说明](https://www.drawio.com/docs/manual/export/export-to-svg/) | MCP App 可在兼容宿主内显示交互图；Tool Server 在编辑器打开图；原生文件可编辑并可导出 SVG。各集成路径输出能力不同 | 适合需要拖拽修改、标准架构符号和协作的技术图。导出的文本需检查 foreignObject/字体兼容性；不能把打开图的 MCP 能力等同于已落盘导出 | 官方仓库与导出文档调研；本环境没有调用该 MCP |
| [Penpot 官方 MCP](https://github.com/penpot/penpot/tree/develop/mcp) | 通过 Plugin API 查询、创建和变换设计元素；需 MCP 服务、插件服务及活动文件连接 | 适合希望以开源设计工具维护可编辑图形的工作流；本次样图无需先部署整套服务 | 文档调研，未连接 |
| [Figma MCP](https://developers.figma.com/docs/figma-mcp-server/) | 读设计上下文、写入 Figma Design/FigJam/Slides、代码与画布协作；功能受连接、客户端和账户条件影响 | 当前插件目录返回已安装。适合团队协作与人工精修；可作为后续可编辑设计稿的选项 | 核查插件状态与官方文档，未创建云端文件 |
| Canva（当前可用插件） | 插件目录描述支持设计创建、修改、素材导入与反馈 | 当前目录返回已安装。适合模板型视觉内容；本次未核实账户的 SVG 导出与付费权限，不把它作为批量工程依赖 | 核查插件目录；未调用设计工具 |
| tldraw（插件目录可发现） | 目录描述为可在 ChatGPT/Codex 中与 AI 在画布共同绘图 | 适合快速讨论和改图；其 SVG 落盘导出能力本次未验证 | 未安装，仅发现 |

当前本地还存在 `build-relationship-map`，强调显式节点、边类型、分组和逐边审核，适合关系图内容规划；它不能替代所有流程、时序、状态、图表各自的语义结构。`find-skills` 用于检索工作流，`playwright` 用于实际渲染检查。

关于 ChatGPT：本轮可直接使用的价值是调研、内容组织、SVG 代码与工具协作；draw.io 官方文档提供 MCP Apps 路径。是否可以直接连接取决于用户账户与宿主实际能力，本次没有替用户配置连接。仅生成一张位图不能满足文字、连线与节点可编辑的 SVG 交付需求。

## 当前资产盘点

子代理进行只读盘点，并核查引用、哈希和 ZIP 投影：

| 相对目录 | public 源资源数 | 静态导出数 |
|---|---:|---:|
| visuals/course | 87 | 87 |
| visuals/modules | 14 | 13 |
| materials/agent-architecture-system/visuals | 16 | 16 |
| materials/career-evolution/visuals | 9 | 9 |
| 合计 | **126** | **125** |

- 本仓库中共 251 个 SVG 文件，126 种不同内容；依赖目录的工具 SVG 不属于课程重绘范围。
- 103 个公开学习页、13 个公开模块的主图引用均存在。静态导出没有 TD-M13，对应未公开模块。
- 没有发现页面内联 SVG 或 SVG data URI。
- 16 个材料 ZIP 中，职业包包含 9 张、Agent 包包含 16 张 SVG；当前盘点中图片与 public/静态副本字节一致。
- `content/professional-visual-contracts.ts` 的 27 个缓存哈希匹配；职业 manifest 覆盖 9/9，Agent manifest 覆盖 5/16。
- README 明确本仓库是交付面：上游内容 JSON、canonical courses 与部分生成脚本未包含。具体缺少 `scripts/build-professional-visuals.mjs`、`scripts/build-module-overviews.py`、`methodology/module-overviews.json` 等。正式批量前须确认可维护入口，避免图片被旧生成器覆盖。

## 已观察到的原图问题

以 TD-M04 为具体例子：

1. 七个教学阶段与一个 Basis/版本节点按圆形布局连接，但连线类型主要随位置轮换。它不能清楚说明组件的实际数据、控制和证据关系。
2. 较长的阶段/产物名称直接放进宽 320 的单行标题，文字可能超出节点边界。
3. 上部边界说明被截为省略号，读者无法从图内读完范围。
4. 只有“阶段 → 产物”标题，没有清楚展开如何测试、何时阻断、谁有权执行。
5. 模块全景、具体架构、状态机和实验图不应仅靠同一套几何排列区分。

## 样图

- 目标：`public/visuals/modules/TD-M04.svg`，当前正式资源保持原样。
- [重绘 SVG](assets/TD-M04.review.svg)
- [原图快照](assets/TD-M04.original.svg)
- [交互对比预览](preview.html)
- [可编辑生成器](generate-sample.mjs)
- [来源与阶段清单](sample-manifest.json)

设计分为三部分：

A. **运行关系**：任务依据 → Workflow → Agent → 独立 Policy Gate → Worker；工具观察结果回到 Agent；补充记忆/路由、拒绝与审批、恢复与接管。明确这是一种受控组合，并不要求所有任务都引入 Agent。

B. **测试覆盖**：按照原教学顺序保留七个关注面，三层评测单独展开为 Outcome / Step / Trajectory；其余六项标明检查要点、交付物和课程编号。这些编号表示学习顺序，不冒充执行依赖。

C. **证据判断**：汇总证据 → 分类异常 → Owner 判断 → 新回执。区分 FAIL、BLOCKED、UNKNOWN，保留原始证据与修复后重跑。

边界：性能容量在 TD-M11，完整架构分域在 TD-M12；保留教学/夹具与真实生产证据的区别。

## 用户确认后的批量顺序

1. 确认样图的内容密度、视觉方向和文字可读性；此确认仅决定批量设计方向，不能视为每张图已通过内容审核。
2. 为 126 张正式资源建立路径、用途、节点、关系、来源、维护入口与引用清单；决定缺失上游源如何补齐或迁移。不要对静态副本另画一遍。
3. 依各图的实际任务选择流程、时序、状态、分层架构、指标实验、职业路径等布局；复用字体、配色和组件，不套一个万能版式。
4. 按课程/模块/Agent 包/职业包分批绘制，逐图对照内容检查关系和缺漏；检查 XML、文字边界、连接端点、桌面与手机，以及浅/深背景。
5. 更新必要的 manifest、缓存哈希、public、ZIP 与静态导出，运行可用的发布契约检查。涉及缺失上游的检查必须恢复依赖后再声明通过。
6. 提供前后对照和覆盖清单；用户审图结果独立于结构校验与构建成功。

本轮完成边界：调研、盘点、一张独立样图与检查；**批量重绘仍等待用户确认**。

## 本轮验证结果

- SVG XML 可解析；纯矢量文本与路径，无内嵌位图、脚本、foreignObject 或外部图片。
- Chrome 实际渲染：1600 × 1700；106 个文本节点，**画布越界 0、卡片文字越界 0、文字包围盒重叠 0**。
- 原课程的七个阶段、十个课程编号全部保留；正式 SVG 哈希保持不变。
- 已目视查看原图、新图及 760px 阅读尺寸、深色背景和手机截图。手机使用图内横向滚动；390px 视口的页面总宽度为 390px。
- 现有 `node --test tests/architecture-visual-rendering.test.mjs`：1/1 通过。没有修改应用代码或正式图，不以此声称完整发布链通过。
- [机器检查结果](verification.json)；截图保存在 `output/playwright/svg-redesign-2026-10-26/`。
- 用户对审美、内容密度和批量方向的确认仍未发生，样图状态保持 REVIEW_PENDING。

本地复现（在项目根目录执行）：

```sh
node docs/svg-redesign-2026-10-26/generate-sample.mjs
python3 -m http.server 4179 --bind 127.0.0.1 --directory docs/svg-redesign-2026-10-26
```

浏览器打开 `http://127.0.0.1:4179/preview.html`。另一个终端运行：

```sh
node docs/svg-redesign-2026-10-26/verify-sample.mjs /absolute/path/to/playwright/index.mjs
```

验证脚本接收已有 Playwright 包路径；没有向项目新增依赖。


## 批量阶段补充的工程工具调研

本机已有 [Viz.js](https://viz-js.com/api/)（Graphviz WASM）。本次用固定语义节点位置配合 Graphviz 路由样条，再以原生 SVG 自行绘制中文文本和标签；显式节点和边来自逐图规格。另实现中文标签避让与浏览器最终坐标检查。相关官方说明：[Graphviz 方向](https://graphviz.org/docs/attrs/rankdir/)、[样条属性](https://graphviz.org/docs/attrs/splines/)。图的知识内容仍以正文与原材料为依据，不由布局引擎推断。


## 全量审查后的路由修正（2026-10-27）

首轮全量复核发现：Nop2曲线虽通过几何检查，仍会出现反向边重合与条件标签远离对应路径。因此正式候选改用dot路由；过宽或多重反向关系使用固定阅读宽度的外轨、独立端口与跨线桥。每条边仍来自正文规格，中文禁则另行处理；TD-M04保持已确认样图，其他模块保留学习顺序。四环比较、36维依赖和职业行动矩阵采用专用版面。新候选需全部重新逐图查看，旧PASS不自动继承。
