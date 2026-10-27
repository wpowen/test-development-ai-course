# 正文绑定的 SVG 维护

本目录负责此仓库126个SVG资源路径的绘制，不重建仓库外的课程canonical工程。85个逐课规格、25张材料图、14张模块图及2个兼容路径各有正文出处；TD-M04沿用用户确认的样图。

## 先生成、再全量审查，最后替换

```sh
npm run visuals:build
npm run visuals:verify
npm run visuals:gallery
# 逐张实际查看新截图，核对正文，写入release-review对应报告
npm run visuals:review
npm run visuals:approve
npm run visuals:promote
npm run test:site
```

每次新发布要使用**新的候选目录**，基线对应当前正式文件；上一轮候选、基线、批准收据和备份都是历史证据，不覆盖重用。例如本轮版式优化：

```sh
export SVG_CANDIDATE_ROOT=output/svg-release-20261027-polish/candidate
# 然后执行上述生成、验证、审查、批准与替换命令
```

已提升过的候选不能再次对旧基线执行提升。需要回退时使用当轮 promotion-backups，而非重新初始化掩盖差异。

前三步只写候选目录`output/svg-release-20261026/candidate/`和本地审阅资源，不改正式`public/`、页面映射或线上站点。`prepare.mjs`首次建立候选与正式基线，已存在时保留修改；不得用重新初始化掩盖用户文件冲突。

每轮生成后都要实际看图。几何检查通过只证明可渲染与坐标约束，不能证明分支易读、内容完整或符合正文。逐图报告分为course-1、course-2、course-3、materials、modules-aliases五组，共126条，记录候选SHA、实图查看、正文核对、具体问题和PASS/REWORK。旧轮报告保留在`release-review/round-1/`，新图必须复审，不能复制旧PASS改哈希。

`review --check`只验证现有报告，不制造审查结论。覆盖缺失、图或报告哈希过期、REWORK、未解决P1/P2均阻断。`--approve`生成24小时有效的本地批准收据，绑定全部133个将被替换的文件（126SVG、页面映射、4个注册/清单JSON和2ZIP）及报告。`promote`再次核验收据与正式旧基线，完整备份后替换；遇到失败回滚，遇到用户并发编辑保留其文件并报告冲突。替换本身不部署。

## 规格与证据

- `specs/`拥有节点、显式关系、条件、检查、故障、交付与正文引文；布局工具不能从相邻位置推断关系。
- `renderer.mjs`负责中文排版、矢量卡片、连接与各专用布局；`routing.mjs`对简单拓扑使用dot布局，对密集/双向关系采用独立外轨与编号端口，并用跨线桥区分穿越与连接。`layouts/`用明确节点实例与局部子图减少跨区查线；同号复用卡仍是同一语义节点，每条显式边只绘制一次。没有测量时使用定性矩阵和待填字段，不虚构雷达、容量曲线、个人能力或真实工期。
- `body-inputs.mjs`检查103页教学正文与输入快照一致；正文变更需连同对应图重新审查。
- `sync.mjs`同步候选中的页面alt/缓存哈希、材料注册清单和两个ZIP，保留ZIP其他成员。
- `verify.mjs`实际用Chrome逐张截图，检查文字/画布越界、文字重叠及标签遮挡；`audit.mjs`核对原始126路径、规格、正文引文和物料哈希。
- `review-inputs.mjs`刷新审图输入，不修改结论。`published.mjs`供CI读取正式文件，核验126份通过记录、133文件和当前规格/正文。

截图、候选、备份和对照画廊为本机生成物，位于忽略目录。画廊可用`python3 -m http.server 4179 --bind 127.0.0.1 --directory docs/svg-redesign-2026-10-26`打开；原图优先取本地备份，无备份时从已记录Git基线读取并校验。

## 运行环境与发布

渲染使用已有`@viz-js/viz`，检查使用Playwright/Chrome和Sharp。脚本先找本地包，再找Codex工作区运行库；可用`SVG_RUNTIME_MODULES`指定已有`node_modules`。本次没有新增项目依赖；站点运行和部署已审SVG不需要这些绘图工具。

局部修正可用`build.mjs --only=ID --partial`，但放行前必须完整生成清单并重新验证受影响图。`verify.mjs --changed`仅复用渲染输入确实未变的旧截图，不能复用发生视觉变化的审图结论。

按`docs/MAINTAINING.md`走现有GitHub Pages。提交前将通过的manifest、报告及正式文件哈希保存为公开交付证据；Actions同时执行站点检查、门禁回归与`visuals:published`。以当前提交的workflow成功、线上文件哈希和实际页面查看作为部署完成依据。学习者接受、真实模型与生产效果仍需各自验证。


`readback.mjs`可用 `SVG_PAGE_IDS` 指定本轮相关课页，`SVG_MOBILE_PAGE_IDS`指定手机实测集合（逗号分隔）；手机除整页无溢出外，还实际横向滚到宽图右侧。未变化SVG可继承已审版本，但必须核验相同SHA并保留原报告和原实看截图；新截图的几何检查不能冒充一次新的视觉审查。
