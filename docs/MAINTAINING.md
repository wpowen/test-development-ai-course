# 站点维护说明

## 目录与编辑边界

| 位置 | 用途 |
| --- | --- |
| `app/` | 动态阅读器、课程总览、术语解释与实验台 |
| `content/site.ts` | 动态版与静态版共用的课程介绍及仓库链接 |
| `content/course.ts` | 公开课程目录、页面合同与发布范围 |
| `content/modules/` | 课程正文投影；源 JSON 位于独立的完整工程 |
| `public/materials/` | 可公开下载的实验、模板和压缩包 |
| `scripts/export-static.ts` | 独立静态站生成器，输出 `dist-github-pages/` |
| `docs/images/` | README 使用的真实静态站截图 |
| `.github/workflows/pages.yml` | 验证并发布 GitHub Pages |

站点介绍、界面与 README 可在此维护。修改课程正文时，需在完整工程的 `methodology/dimensions/_sources/*.json` 修改并重新生成，再同步到此仓库；直接修改 `content/modules/` 会被下次生成覆盖。保留稳定页面 ID，避免已有学习链接失效。

## 公开仓库验证

```bash
npm ci
npm run test:site
```

`test:site` 检查类型、课程结构与可执行性、静态导出、公开物料与静态文件及 ZIP 的一致性、离线实验，以及静态页面和浏览器实验合同。它使用物料校验器已有的 `--skip-source` 参数，因为独立仓库不包含上游课程源目录；不代表完成了上游源文件到公开物料的一致性检查。

静态测试中的 canonical source projection 检查仍保留，只有这项依赖外部源工程的测试在 `test:site` 中明确跳过。没有降低完整工程的门禁，也没有把未运行的集成评测标记为通过。

动态站还可运行：

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

`npm test` 和 `validate:release:workspace` 保留完整工程验证用途；其中的源投影、完整物料闭包、语义与晋级收据检查，需要仓库外的 `courses/`、`methodology/`、研究记录及上游脚本，不能作为独立克隆的快速入门命令。

## 发布与链接

在线地址为 <https://wpowen.github.io/test-development-ai-course/>。课程总览用 `#path`，术语表用 `#glossary`，模块和课页直接使用稳定 ID，如 `#TD-M03`、`#TD-F01`。

GitHub Pages 使用 GitHub Actions 发布。`main` 分支推送或手动运行 Pages workflow 时，先执行 `npm run test:site`，再将 `dist-github-pages/` 上传并发布。PR 只运行检查。部署有自己的 `github-pages` 环境；以 workflow 成功及线上读取为发布依据。

动态版和静态版应同步修改公开文案、源码链接与交互。静态版采用相对资源路径，以支持仓库子路径。

## README 截图

截图来自实际运行的静态站，分别对应课程总览（`#path`）、首课（`#TD-F01`）与术语表（`#glossary`）。更新截图前先执行静态导出，再在浏览器中检查页面、等待字体与图片加载并截图；不要用概念图代替产品截图。

保存到 `docs/images/course-overview.png`、`course-reader.png`、`course-glossary.png`。README 使用仓库内相对图片路径与在线绝对页面链接：GitHub 可直接显示图片，点击图片会进入对应课程视图。

当前证据边界仍为离线夹具验证。页面完整、截图正常或构建成功，都不等于真实模型、企业集成、人工评审或生产效果已经通过验证。
