# career-ai-course-factory：专业课程完成定义与自动发布门禁

> 审查角色：严格课程质量审查员  
> 审查对象：`career-ai-course-factory` 的公开课程完成定义  
> 结论：**当前完成定义不够严格。它能拦住一部分空页面和未完成状态，却不能证明公开课题真正可学、可跑、可复用。应将公开课题从“内容记录”升级为“经验证的学习交付单元”。**

## 1. 审查结论

现有 Skill 已经规定了正文、学习动作、预期结果、失败注入、来源和公开发布范围，但这些要求分散在多个契约中，且部分要求只约束 `guided-lab` 或示范课程。由此仍可能出现四类假完成：

1. 页面写了命令或脚本名，仓库中没有对应文件。
2. 页面有教程正文，但没有可以复制执行的最小路径。
3. 页面有文件，但没有测试记录，无法确认脚本是否能运行、是否能识别故障。
4. 主 JSON 已清理，未完成课题仍通过 HTML、XML、JavaScript、Markdown、压缩包或构建产物泄漏到公开站点。

新的硬规则应当是：

> **一个公开课题只有在正文、图、命令、仓库物料、实验、预期输出、失败路径、来源证据和适用边界同时存在，且所有引用文件真实存在、所有声明可由当前构建中的测试证据证明时，才允许进入公开页面集合。任一项缺失，课题状态保持 `outlined` 或 `blocked`，不得进入任何发布目标。**

“文字很多”“结构完整”“页面能打开”“主测试通过”都不能替代这一定义。

## 2. 新的原子交付单元

每个公开课题必须对应一个独立目录，目录是发布门禁的最小审查单位：

```text
topics/<page-id>/
├── page-manifest.json
├── tutorial.md
├── diagrams/
│   ├── architecture.mmd
│   └── architecture.svg
├── lab/
│   ├── README.md
│   ├── fixtures/
│   ├── run.*
│   ├── mutate.*
│   ├── repair.*
│   └── tests/
├── expected/
│   ├── baseline.*
│   ├── red.*
│   └── green.*
├── evidence/
│   ├── source-pack.csv
│   └── execution-evidence.json
└── materials/
    └── reusable-artifacts.*
```

允许不同技术栈使用 `.py`、`.sh`、`.js`、`.ts`、`.yaml`、`.json` 等扩展名，但目录责任不能消失。若多个页面共享实验框架，每页仍必须在 `page-manifest.json` 中列出本页使用的入口、输入、预期输出、测试和边界，不能只链接到一个无法判断归属的大目录。

### 2.1 `page-manifest.json` 必填字段

```json
{
  "page_id": "TD-EXAMPLE",
  "title": "课题标题",
  "delivery_status": "fixture-tested",
  "evidence_status": "fixture-tested",
  "tutorial_path": "topics/TD-EXAMPLE/tutorial.md",
  "diagram_ids": ["TD-EXAMPLE-architecture"],
  "command_ids": ["install", "baseline", "mutate", "repair", "verify"],
  "artifact_paths": ["topics/TD-EXAMPLE/materials/reusable-artifacts.yaml"],
  "lab": {
    "entrypoint": "topics/TD-EXAMPLE/lab/run.py",
    "fixture_paths": ["topics/TD-EXAMPLE/lab/fixtures/input.json"],
    "test_commands": ["python3 -m unittest topics/TD-EXAMPLE/lab/tests/test_lab.py"],
    "baseline_command": "python3 topics/TD-EXAMPLE/lab/run.py --case baseline",
    "mutation_command": "python3 topics/TD-EXAMPLE/lab/mutate.py",
    "red_command": "python3 topics/TD-EXAMPLE/lab/run.py --case mutated",
    "repair_command": "python3 topics/TD-EXAMPLE/lab/repair.py",
    "green_command": "python3 topics/TD-EXAMPLE/lab/run.py --case repaired",
    "expected_paths": {
      "baseline": "topics/TD-EXAMPLE/expected/baseline.json",
      "red": "topics/TD-EXAMPLE/expected/red.json",
      "green": "topics/TD-EXAMPLE/expected/green.json"
    }
  },
  "source_ids": ["S001", "S002", "S003"],
  "boundary": {
    "applies_to": ["明确的系统、版本和工作条件"],
    "does_not_apply_to": ["明确排除的场景"],
    "prerequisites": ["运行环境和前置知识"],
    "security_and_data_limits": ["隐私、权限和数据边界"],
    "human_decision": "必须由谁作出什么决定"
  }
}
```

验证器应拒绝未知字段拼写、空数组、空字符串、占位内容和指向目录而非具体文件的路径。`delivery_status` 与 `evidence_status` 必须分开：正文写完不等于实验跑过。

## 3. 每个公开课题的十项硬门禁

以下门禁是 AND 关系，不是评分项。任何一项失败，页面不得发布。

### G01 教程正文门禁

每页必须有独立的 `tutorial.md`，并满足：

- 正文不低于 1,200 个有效中文字符；代码、导航、元数据、来源列表和重复模板不计入。
- 至少解释一个职业决策、一个完整工作流或一个可验证技术问题。
- 明确传统做法中仍然有效的部分、AI 改变的部分、新增失败模式和人的责任。
- 至少有一个带真实字段或样例值的完整示例，不能只写抽象步骤。
- 章节内容不得与其他公开页面出现大段复用；去除代码与固定元数据后，任意两页连续相同文本超过 120 字即失败。
- 禁止用“本页完成后你会带走什么”“接下来按步骤操作”等教学模板填充字数。

自动检查：正文长度、必要语义块、占位词、重复段落指纹、空标题、标题后空正文、代码块闭合。

### G02 架构图或流程图门禁

每页至少一张与正文问题直接相关、可被机器解析的图：

- 图源必须是 Mermaid、Graphviz、PlantUML 或结构化 SVG；仅有截图不合格。
- 每张图至少 3 个有效节点、2 条关系边，并包含输入、处理或决策、输出中的至少两类。
- `tutorial.md` 必须引用 `diagram_id`，HTML 必须渲染对应图并提供标题和替代文本。
- 图中的关键组件名必须至少有两个在正文中被解释，防止装饰性流程图。
- 图源必须通过语法解析或无网络渲染测试。

对架构、平台集成、自动化、稳定性、压测、故障注入、Agent/Workflow 测试等设计型课题，至少需要两张图：一张系统/组件图，一张执行、诊断或数据流图。

### G03 可复制命令门禁

每页至少提供以下五类可复制命令或等价、可自动化的操作：

1. 环境检查或安装；
2. 基线运行；
3. 故障注入或输入变异；
4. 修复或重置；
5. 重新验证。

每条命令必须有稳定 `command_id`、工作目录、前置条件、预期退出码和预期输出锚点。禁止使用本机绝对路径、未声明环境变量、隐藏凭证、`...`、`your-token`、`example.com/private` 等不可执行占位符。

仅展示 API 请求时，也必须提供可直接执行的 `curl`、HTTP client、测试框架命令或仓库脚本入口，并附离线 fixture；不能让学习者自行补全请求体。

### G04 仓库物料门禁

页面中声称“提供”“下载”“复制”“运行”的文件必须包含在公开仓库或发布包中，并列入 `artifact_paths`：

- 输入 fixture、配置、提示词、数据集、Schema、脚本、CI 配置、告警规则、Dashboard、检查表或报告模板至少一种；
- 物料不能只是教程正文的复制品；
- 每个物料必须记录用途、下游使用者、格式、版本、许可证/来源、是否为合成数据和限制；
- HTML 下载链接、Markdown 链接、命令参数和 manifest 路径必须解析到同一个规范化文件；
- 发布打包后重新检查，不允许源仓库存在而发布包缺失。

### G05 最小实验门禁

每页必须有一个 15 至 45 分钟可完成的最小实验。概念页也不能只有阅读题，可以使用“解析一条 trace”“比较两种输出”“运行一个离线评测”等轻量实验。

实验必须包含：

- 固定输入或可重复生成的 fixture；
- 基线命令；
- 可观察产物；
- 与课题核心风险相关的故障注入；
- 能将结果判为失败的 Oracle；
- 修复或重置；
- 绿灯复跑；
- 清理步骤；
- 不依赖凭证的默认路径；
- 可选的真实系统适配器及其权限边界。

实验若需要 Jira、GitLab、K8s、云模型或移动设备，默认路径必须提供 mock server、录制响应、kind/minikube、模拟器或离线 snapshot。离线实验只能证明 fixture 可运行，不能写成生产验证。

### G06 预期输出门禁

基线、红灯和修复后三个阶段都必须保存机器可比对的预期输出。仅写“应该成功”“可以看到结果”不合格。

预期输出至少包含：

- 退出码；
- 一个稳定字段、指标、断言或日志事件；
- 输出文件路径或 API 响应片段；
- 允许变化的字段及其比较规则；
- 成功与失败的判断者。

对性能、稳定性、Agent 和评测课题，必须同时说明工作负载、样本量或持续时间、聚合方法、维度、阈值来源和触发动作。不得把示例阈值写成行业通用标准。

### G07 失败路径门禁

失败路径必须与课题的职业风险相关，而不是故意写错语法。验证器必须证明：

- 基线命令退出码符合预期；
- 注入故障后，验证命令按契约变红；
- 红灯证据指出具体断言、指标、步骤或组件；
- 修复后同一验证命令恢复为绿灯；
- 若检查器在变异后仍为 PASS，整个课题发布失败。

失败路径还应写明误报、漏报、不可恢复状态、升级条件和清理失败的处理方式。

### G08 来源证据门禁

每页至少引用三个独立来源家族，并覆盖：

1. 职业流程、标准或现有工程基线；
2. 当前 AI/工具/协议的一手技术资料；
3. 实现仓库、Issue、故障案例、实践资料或反证。

所有来源必须在 `source-pack.csv` 中记录准确 URL、访问日期、版本/日期、支持的主张、不支持的主张和限制。工具能力、参数、接口和版本主张必须引用官方文档或源仓库。论坛和课程可证明痛点与供给，不能单独证明工具有效。

页面中的关键主张必须携带 `source_id` 或明确标注为工程综合、推断、示例、未知。来源 URL 未打开、发生重定向后未记录最终地址、只保存搜索摘要，均不能通过发布门禁。

### G09 适用边界门禁

每页必须说明：

- 适用的角色、系统类型、规模、版本和运行条件；
- 不适用的情形；
- 数据、隐私、安全、权限和成本边界；
- fixture、live、practitioner、production 证据分别证明了什么；
- 哪些判断必须由测试、开发、产品、安全或业务负责人作出；
- 何时停止自动化并升级人工处理。

缺少 `does_not_apply_to`、`human_decision` 或把示例经验写成普遍结论时，页面不得发布。

### G10 页面—物料—证据闭环门禁

页面中的每个命令、文件、图、输出和来源都必须在 `page-manifest.json` 中有唯一 ID；manifest 中的每个公开项也必须被正文或实验引用。门禁应拒绝：

- 正文引用但 manifest 不存在的孤儿项；
- manifest 声明但发布包未包含的幽灵文件；
- 存在于仓库但没有任何公开页面使用的无主物料；
- 页面 A 误用页面 B 的实验记录；
- 测试记录的 commit、内容哈希或工具版本与当前发布不一致；
- HTML、GitHub 和 ChatGPT Site 之间的页面、物料或哈希漂移。

## 4. 脚本真实性与运行证明门禁

这是本轮必须新增的核心门禁。凡教程、HTML、XML、JavaScript、Markdown、README、命令块或配置中引用了可执行文件，都必须完成以下检查。

### S01 路径解析

- 提取 Markdown 链接、反引号路径、shell 命令参数、HTML `href/src/data-*`、XML `loc/link`、JSON 字段和 JavaScript 字符串中的脚本路径。
- 对 URL decode、HTML entity、相对路径、`./` 和构建 base path 进行规范化。
- 拒绝 `..` 越界、本机绝对路径、`file://`、用户目录、临时目录和仓库外文件。
- 大小写必须与仓库实际文件一致，避免 macOS 可运行而 Linux CI 失败。

### S02 文件存在性

- 每个引用脚本必须是当前 release root 下的普通文件，不能是断链符号链接。
- 页面链接到目录、仅在作者源目录存在、被 `.gitignore` 忽略、被打包脚本排除，均视为不存在。
- 生成型脚本必须在干净检出后由声明的构建命令生成，并进入最终发布包验证。

### S03 静态可执行性

- Python：`python3 -m py_compile`，并验证 import 不依赖未声明的本机模块。
- Shell：`bash -n`；若 CI 有 `shellcheck`，同时要求通过。
- JavaScript/TypeScript：语法检查、类型检查或项目既有 lint/typecheck。
- YAML/JSON/XML：使用真实解析器解析，不能只做字符串匹配。
- Dockerfile、K8s、GitLab CI、GitHub Actions 等配置必须使用对应 lint/schema 检查器或最小 dry-run。

### S04 动态测试

- 每个脚本至少被一个 `test_command` 覆盖，不能只做语法检查。
- 测试必须在干净临时目录执行，显式设置允许的环境变量，禁止读取作者机器上的缓存或凭证。
- 测试记录保存命令、工作目录、开始/结束时间、退出码、stdout/stderr、平台、运行时版本、commit 和输入/输出哈希。
- 运行记录必须来自当前 commit。复制旧日志、手写 `PASS`、只保存截图都无效。
- 网络、设备或企业系统不可用时，离线适配器必须通过；真实适配器标为 `NOT_RUN` 或 `BLOCKED`，不得提升证据等级。

### S05 引用覆盖率

定义：

```text
脚本引用覆盖率 = 被存在性检查且被动态测试覆盖的公开脚本数 / 全部公开脚本引用数
```

发布要求为 100%。分母为 0 也失败，因为每个公开课题必须有最小实验。任何一个公开脚本没有测试映射，整包发布失败。

## 5. 多文件格式泄漏门禁

现有“扫描公开 JSON 和主 HTML”的策略不足。必须先生成完整发布文件清单，再按 MIME 和格式解析所有可公开访问的文件。扩展名不是可信边界。

### L01 全文件清单

构建结束后，对最终 release root 递归生成：

```text
relative_path,size,mime_type,sha256,publication_target,generated_from
```

拒绝未列入清单的文件、断链符号链接、设备文件、仓库元数据、私密研究目录、临时文件、source map、测试缓存和凭证文件。文件清单生成后再计算 release hash，验证过程不得修改发布目录。

### L02 统一泄漏词典

维护机器可读的禁止集合：

- 未完成状态：`planned`、`outlined`、`blocked`、`draft`、`todo`、`tbd`、`not-ready`；
- 未公开 page/module/topic IDs；
- 内部路径：`course-package`、`research-redesign`、maintainer backlog、私有评审目录；
- 占位词与假链接；
- 个人绝对路径、凭证模式、内部域名和未脱敏标识。

状态词不能只做全文匹配，因为教程可能需要解释 `blocked`。验证器应优先解析结构字段、导航、链接和页面对象；正文命中则进入人工白名单，白名单必须记录文件、位置、原因和 reviewer，不能全局忽略。

### L03 JSON 泄漏检查

- 对所有 `.json`、JSONL、manifest、内嵌 JSON 和无扩展名 JSON 做真实解析。
- 递归检查对象键和值中的状态、内部 ID、页面记录、模块记录、导航、搜索索引和路由。
- 公开 page ID 集必须与 `promised_page_ids` 完全一致，顺序也一致。
- 拒绝重复键、NaN、Infinity、注释 JSON 和解析失败后继续发布。

### L04 HTML 泄漏检查

- 使用 HTML parser 检查 DOM、注释、`template`、`noscript`、隐藏元素、ARIA、meta、链接、表单默认值和 `data-*`。
- 解析每一个内嵌 `<script>`；其中的 JSON、路由表、搜索索引和预加载数据继续进入 JSON/JavaScript 门禁。
- 提取全部页面 ID、模块 ID、链接目标和下载文件，与 canonical manifest 比对。
- CSS 隐藏不算删除。`display:none`、不可见路由或前端条件过滤中的未完成内容都视为泄漏。

### L05 XML 泄漏检查

- 解析 `sitemap.xml`、RSS、Atom、OpenSearch、SVG 和其他 XML。
- 检查 `loc`、`link`、`guid`、标题、描述、CDATA、注释、SVG text/metadata 和链接属性。
- sitemap/RSS/Atom 中公开 URL 对应的 page ID 必须是 promised 集合子集且不能缺少应发布页面。
- XML 解析错误、外部实体、DOCTYPE 和实体扩展默认失败，防止绕过或 XXE。

### L06 JavaScript 泄漏检查

- 扫描源 JS、构建后的 bundle、chunk、service worker、precache manifest、route manifest 和 source map。
- 使用 parser/AST 提取字符串常量、对象字面量、数组、动态 import 路径和路由定义；不能只 grep 可读源码。
- 搜索索引、课程数据和页面注册表中的 ID 必须等于 promised 集合。
- 出现 `eval`、动态解密/解压课程数据、无法静态恢复的公开内容载荷时默认失败，除非构建过程额外输出并验证解码后的 canonical 数据。
- `.map` 文件默认不发布；确需发布时必须按 JavaScript 与 JSON 双重门禁扫描。

### L07 Markdown 泄漏检查

- 解析 YAML front matter、标题、链接、图片、HTML 块、代码块、脚注和引用定义。
- 检查未完成状态、未公开 ID、内部路径、本机绝对路径、缺失物料和死链接。
- fenced JSON/JavaScript/XML/HTML 必须继续交给对应解析器；不能因为在 Markdown 代码块中就跳过。
- Markdown 中的示例命令若引用仓库脚本，仍必须通过 S01-S05。

### L08 压缩、编码与构建产物泄漏检查

- 对 `.zip`、`.tar`、`.tgz`、`.gz`、`.br` 和站点预压缩资源解包后递归执行同一门禁。
- 对 base64、大型字符串常量、data URL 和构建器内嵌载荷进行解码后检查；无法判断用途的大型编码载荷默认拒绝。
- GitHub release archive、GitHub Pages artifact 和 ChatGPT Site 上传包分别检查，不能用源目录 PASS 替代最终上传包 PASS。

### L09 跨目标一致性

对 GitHub、GitHub Pages、ChatGPT Site 三个发布目标分别提取：

- 有序 page ID 集；
- 模块 ID 集；
- 页面正文哈希；
- 图与物料路径及哈希；
- 命令集合；
- evidence status；
- release commit 和 content hash。

除目标特有外壳文件外，上述集合必须一致。任一目标多一页、少一个脚本、使用旧图或旧实验记录，整次发布失败。

## 6. 专业覆盖完整性门禁

“每页完整”不能替代“课程体系完整”。Skill 必须先从职业知识系统推导专项，不得等用户逐项补充。

### C01 通用推导规则

每个职业都必须建立以下覆盖矩阵：

```text
工作生命周期 × 专项族 × 系统类型 × 质量属性 × AI 变化 × 学习层级
```

每个高风险或高频单元必须有课题、明确合并理由、证据支持的 `not-applicable`，或记录为阻塞缺口。空白单元、无证据的 N/A、只按工具品牌分课均失败。

### C02 测试开发专业最低覆盖基线

针对测试开发课程，以下专项在发布“完整体系”前必须各自有独立覆盖结论；不能因为用户没有点名而省略：

- 需求、技术方案、风险分析、用例设计、执行、缺陷、报告和回归的完整研发测试生命周期；
- API/接口测试、契约测试、服务虚拟化、测试数据和环境治理；
- Web UI、Android、iOS 自动化及其选择、稳定性、可维护性和 AI 演进；
- 性能、容量、成本、AI 推理/Agent 延迟与吞吐；
- 故障注入、混沌工程、服务稳定性、可观测性、告警和事故反馈；
- 安全、隐私、权限、提示注入和供应链风险；
- Jira、GitLab、GitHub、K8s、消息通知、CI/CD Pipeline 和质量门禁集成；
- LLM、RAG、Agent、Workflow、Benchmark、评测数据集和线上质量闭环；
- 测试平台、质量数据、团队协作、治理和职业能力演进。

每个专项至少回答：传统基线是什么、AI 改变什么、新增什么风险、用什么架构和工具、如何验证、产出什么物料、什么条件下不能用。仅列标题或框架名不算覆盖。

### C03 工具调研与可用性

每个被推荐的框架或平台必须记录：

- 官方文档与源仓库；
- 当前维护状态、版本和许可证；
- 支持的操作系统、设备、协议或部署环境；
- 接口与最小接入示例；
- 优势、盲区、已知失败、替代方案；
- 本项目是否实际运行，以及运行证据。

“GitHub 上有很多框架”“业内常用”“AI 能自动生成”不构成工具结论。未实际运行的工具只能标为候选，不能写入默认实验路径。

## 7. 建议的自动验证流水线

门禁必须按以下顺序执行，任一失败立即停止，不生成或部署公开产物：

```mermaid
flowchart LR
  A[内部课题与研究包] --> B[逐页完整性 G01-G10]
  B --> C[脚本真实性 S01-S05]
  C --> D[专业覆盖 C01-C03]
  D --> E[生成公开投影]
  E --> F[最终发布目录清单]
  F --> G[多格式泄漏 L01-L08]
  G --> H[跨目标一致性 L09]
  H --> I[独立审查与发布]
```

建议拆成五个可单独运行的验证器：

```bash
python3 scripts/validate_topic_delivery.py <career-package>
python3 scripts/validate_script_references.py <career-package> --run
python3 scripts/validate_specialty_coverage.py <career-package>
python3 scripts/validate_public_release.py <assembled-release> --scan-all-formats
python3 scripts/compare_publication_targets.py <github-artifact> <pages-artifact> <sites-artifact>
```

总入口必须使用 fail-closed 语义：

```bash
python3 scripts/validate_professional_course.py <career-package> \
  --run-labs \
  --verify-sources \
  --scan-all-formats \
  --require-target-parity
```

退出码约定：

- `0`：全部硬门禁 PASS；
- `1`：内容、物料、测试、来源、边界或泄漏门禁失败；
- `2`：运行环境、网络、设备、凭证或外部系统导致无法验证；
- `3`：验证器自身错误或无法解析构建产物。

退出码 `2` 和 `3` 都不得发布，不能降级为警告。

## 8. 必须加入的回归与变异测试

验证器测试不能只证明好样本通过，还必须对每类坏样本证明会失败。至少包含：

1. 删除页面引用的脚本，验证失败。
2. 保留脚本但删除测试映射，验证失败。
3. 让脚本语法通过但运行退出非预期，验证失败。
4. 让故障注入后仍然绿灯，验证失败。
5. 删除预期红灯输出，验证失败。
6. 删除适用边界中的人工决策，验证失败。
7. 将架构图替换为单节点装饰图，验证失败。
8. 页面正文保留，但删除仓库物料，验证失败。
9. 在 `tutorial-site.json` 注入 `planned` 页面，验证失败。
10. 在 HTML 隐藏节点注入内部 page ID，验证失败。
11. 在 `sitemap.xml`、RSS 或 SVG metadata 注入内部 page ID，验证失败。
12. 在 minified JS、service worker 或 source map 注入内部 page ID，验证失败。
13. 在 Markdown front matter、链接定义或 fenced JSON 注入未完成页面，验证失败。
14. 在 gzip/Brotli/zip 产物中放入内部课题，验证失败。
15. 让 GitHub 有脚本、Sites 缺脚本，跨目标一致性验证失败。
16. 使用旧 commit 的 execution evidence，验证失败。
17. 使用本机绝对路径并在 macOS 上恰好可运行，Linux CI 仍应失败。
18. 将三页正文替换为同一模板，仅替换标题，重复内容门禁失败。
19. 删除测试开发专项矩阵中的 Android、iOS、故障注入或流水线集成单元，完整体系声明失败。
20. 把未实测工具写成默认方案，证据等级与工具门禁失败。

所有变异测试都要断言具体错误码和错误消息，防止验证器“因其他原因失败”造成假覆盖。

## 9. 发布判定表

| 状态 | 可以进入内部课题树 | 可以进入公开教程 | 可以宣传可执行 | 可以宣传完整体系 |
|---|---:|---:|---:|---:|
| 只有标题/大纲 | 是 | 否 | 否 | 否 |
| 有正文，无图或物料 | 是 | 否 | 否 | 否 |
| 有脚本，未测试 | 是 | 否 | 否 | 否 |
| 实验可跑，无红灯路径 | 是 | 否 | 否 | 否 |
| G01-G10 通过，来源已打开，离线实验通过 | 是 | 是 | 仅可称 `fixture-tested` | 否 |
| 全部逐页门禁通过，但专业覆盖矩阵仍有高风险缺口 | 是 | 可发布为明确范围的专题/试学路径 | 按证据状态 | 否 |
| 全部逐页、专业覆盖、泄漏和跨目标门禁通过 | 是 | 是 | 按证据状态 | 仅在 `complete-catalog` 范围内可以 |

## 10. 审查员最终签字条件

只有同时回答“是”，审查员才能给出 `PASS`：

- 随机打开任一公开页面，学习者是否能在该页找到真实文件并跑出可比对结果？
- 把核心故障注入后，检查是否一定变红，而不是继续输出看似合理的结果？
- 修复后，学习者是否使用同一个 Oracle 重新得到绿灯？
- 页面中的图是否真的解释了组件、链路、数据或决策，而不是装饰？
- 每个脚本是否存在于最终发布包，并由当前 commit 的测试覆盖？
- 页面是否明确说明适用范围、无效条件、证据等级和人工责任？
- 任一公开格式、构建 chunk、sitemap、压缩包或发布目标是否都没有泄漏内部课题？
- 专业专项是否由覆盖矩阵主动发现，而不是只补用户刚刚指出的缺口？
- “可执行”“实测”“完整”这些表述是否严格等于当前证据和发布范围？

若其中任何一项无法证明，判定为 `FAIL` 或 `BLOCKED`，不得用“整体不错”“后续补充”替代门禁结果。

## 11. 对 Skill 的修改优先级

建议按以下优先级落地，不应先继续批量生成课程正文：

1. **P0：** 增加逐页原子交付 manifest、脚本真实性、红绿实验和发布包文件存在性门禁。
2. **P0：** 将 JSON/HTML 检查扩展为 JSON、HTML、XML、JavaScript、Markdown、压缩产物和跨目标一致性检查。
3. **P0：** 为每个坏样本增加变异回归，确保门禁会因正确原因失败。
4. **P1：** 增加职业专项覆盖矩阵；测试开发使用 C02 作为最低基线。
5. **P1：** 为图源、渲染结果、正文引用和图语义建立一致性检查。
6. **P1：** 在 GitHub Actions 中运行干净环境实验，并保存当前 commit 的执行证据。
7. **P2：** 在通过以上门禁后，再扩写 API、Android/iOS UI、稳定性、故障注入、Jira/GitLab/K8s 集成等专项。

这套完成定义的目标不是让页面更长，而是让每个公开课题都能回答三个问题：**学习者拿到了什么、怎样亲手验证、失败时怎样判断和恢复。**
