# 职业材料课程重建裁决

**输入**：`/Users/owen/Downloads/AI测试工程师发展.md`  
**输入状态**：用户提供的专家输入；文档版本 v1.0，更新日期 2025-11-05；作者、组织、样本和引用链未知。  
**审议对象**：`outputs/test-development-ai-v2/tutorial/tutorial-site.json` 当前 85 个页面。  
**本文件状态**：`COURSE-REBUILD-PLAN / NOT-YET-INGESTED`  
**写作边界**：本文件只提供 course lane 的裁决和映射；不修改 Skill、课程页面、站点、发布物或验证器。

## 1. 可复现输入概况

本次只分析职业发展文档，尚未把原文件复制到 package-local frozen source 区，也尚未生成正式 `source-assimilation-ledger.json`。下一次课程任务的第一条命令必须先冻结副本、记录 SHA-256，再运行：

```bash
python3 outputs/career-ai-course-factory/scripts/build_source_assimilation_ledger.py \
  --source DOC-CAREER=research/course-rebuild/sources/AI测试工程师发展.md \
  --output research/source-assimilation-ledger.json
```

当前可读性审计证据：2,091 行、146 个标题（1 个一级、9 个二级、36 个三级、100 个四级）、34 个代码围栏、12 个 Mermaid 图、172 行表格、812 条列表项。以上是输入形状证据，不是已覆盖内容数量，也不能代替原子 ledger。

正式 ledger 必须逐个记录：标题、段落、列表项、表格行、代码/Mermaid 图、术语定义、例子、约束、数字、FAQ、资源和结语，并为每项指定下列五种 disposition 之一：

| disposition | 本课程含义 | 必须留下的证据 |
|---|---|---|
| `incorporated` | 原意直接教给学员，允许删去冗余措辞但不删边界 | source locator、page/block/artifact ref |
| `adapted` | 保留专业意图，转换为证据化、组织可配置或任务化合同 | 原文义、转换规则、owner、target ref |
| `rejected` | 不作为指导使用，例如无来源的普遍阈值或就业承诺 | 原 locator、拒绝理由、反证/安全依据 |
| `blocked` | 可能重要，但缺少范围、owner、版本或外部证据，暂不能落地 | closure owner、需要的证据、下游影响 |
| `superseded` | 被新版本或更强来源替代 | replacement ref、旧内容状态 |

`covered elsewhere` 不得作为 disposition；必须落到确切 page/block/artifact。任何剩余 `UNMAPPED` 都阻塞 course lane。

## 2. 总裁决：这份材料如何进入课程

### 2.1 直接吸收的专业骨架（`incorporated`）

以下内容是职业知识本体，应保留为学习内容，而不是压缩成一页岗位介绍：

1. **角色边界**：AI 测试工程师保障 AI 系统质量，负责发现问题、客观评估、风险识别、工具建设和持续优化；不替代算法开发、产品规则 owner 或发布风险 owner。
2. **传统测试底座**：测试理论、黑/白/灰盒、测试金字塔、左移/右移、测试计划、用例设计、自动化、接口/UI/性能、CI/CD、数据/环境/报告。
3. **AI/ML 任务族**：监督/非监督/强化学习测试；分类、回归、聚类、排序/推荐、生成、对话、RAG、Agent；CV 与 NLP 的输入变换、语义变化和长尾风险。
4. **AI 特有质量面**：数据质量、标注一致性、偏见、公平、鲁棒性、异常输入、对抗、可解释性、A/B、漂移、反馈闭环。
5. **工程能力**：Python、数据处理、模型推理、框架适配、MLOps、容器/云和监控；内容以“测试工程所需深度”讲，不假装学员必须成为算法研究员。
6. **软技能**：跨产品、研发、算法、运营协同；需求理解、根因分析、沟通、项目管理、业务价值和文档表达。
7. **能力由低到高的真实变化**：从知道概念，到指导下执行、独立负责、建设可复用系统，再到策略/治理/带教。原文的 L0-L5 保留为学习诊断语言，但出口以责任证据而不是自我感觉。
8. **按背景分路**：测试背景、开发背景和零基础的入口不同；学习路径由诊断和出口工件决定，而不是让所有人机械走同一时间表。
9. **能力评估和项目评估的结构**：自评、主管/同行复评、项目复杂度、质量/效率/影响力维度保留为表单结构，但每个分数必须绑定 evidence ref、分母、版本和 owner。
10. **资源地图**：书籍、课程、练习平台、社区、工具、论文作为可选资源索引，不能在课程中冒充学习效果证据。

### 2.2 必须转换的内容（`adapted`）

| 原文内容 | 转换理由 | 课程中的保留形态 |
|---|---|---|
| 五大维度固定 30%/25%/25%/15%/5% | 没有目标岗位、风险和样本依据 | 作为“文档作者的一个示例权重”，并在自评模板中改为可配置权重；默认不产生总分 |
| P5–P9 和 0–2/2–4/4–7/7–10/10+ 年 | 公司职级不可跨组织迁移，年限不是能力证明 | `organization_level_adapter`；默认 `INTERNAL-UNKNOWN`。公共课程使用四个责任状态：guided execution、independent scoped ownership、system/cross-team leverage、strategy/governance/mentoring |
| “每周 50+ 用例”“覆盖率 ≥80%”“节省 30%”“NPS ≥8”等固定数字 | 缺少任务、分母、风险、版本和 owner | 仅作为“待审核的示例指标”，转成 Metric Card：任务、人口、切片、分子/分母、基线、不确定性、owner、失败动作 |
| 3/6/12/24/36 个月里程碑 | 学员背景、时间投入和组织出口不同 | 改为 30/60/90 天 evidence plan；日期由 learner profile 配置，不承诺晋升或就业 |
| 机器学习、深度学习、LLM、CV、NLP、推荐的能力要求 | 领域跨度大，不能用一页清单替代练习 | 公共任务/指标选择桥接 + 可选专项 adapter；每个专项有输入、Oracle、切片、故障和可运行工件 |
| 云平台、MLOps、框架清单 | 工具版本会变，使用场景也不同 | technology radar + provider-neutral contract；绑定当前版本和替代路径，不能把“知道名称”写成掌握 |
| 职级雷达图、四象限图、时间线图 | 图形易给出伪精确等级 | 改为证据地图、责任范围图、依赖路径图；允许 learner 标 `UNKNOWN/NOT_RUN` |
| 书籍、课程、平台、社区、论文和工具推荐 | 链接和维护状态会变化，且不是成效证明 | `resource-index`，记录 checked_at、适用 level、用途、成本/替代、版本和限制 |

### 2.3 拒绝或阻塞（`rejected` / `blocked`）

| 内容 | disposition | 处理原因和下游动作 |
|---|---|---|
| 固定年限等价于 P5–P9 能力 | `rejected` 作为通用规律；`adapted` 作为组织示例 | 不写入公共能力门禁；组织 owner 提供内部 band/证据后才能映射 |
| 固定用例数、Bug 数、覆盖率、自动化率、NPS、效率提升比例 | `rejected` 作为普适标准 | 可教学“如何定义指标”，但不能填入 universal threshold |
| “学习若干月即可达到某级别/就业” | `rejected` | 只提供可验证出口工件和自评路线，不做就业、薪资、晋升承诺 |
| 资源列表中的最新性、推荐星级和效果 | `blocked` 直到逐条核查版本/链接/维护状态 | 未核查前只作为待审索引，不写成“必读”或“最佳” |
| P8/P9 的行业影响、顶会、专利论文数量 | `adapted` 为治理/带教证据，数字固定值 `rejected` | 用审计过的策略、标准、风险决策、带教 receipt 证明 |
| 复杂度按数据量、人数、工期固定分级 | `adapted` | 另加不可逆副作用、隐私、权限、耦合、业务损失和回滚成本 |
| 文档中没有来源的模型/指标/框架事实 | `blocked` 或 `rejected`，视下游风险 | 需要权威来源、owner、版本；否则不能作为事实教学 |

## 3. 目标页面映射

### 3.1 现有页面可承载的内容

| 来源主题 | 目标页面 | 课程动作和必须补的工件 |
|---|---|---|
| 角色定位、传统测试 vs AI 测试、基础职业责任 | `TD-F01` | 保留职业边界；增加“AI 测试不是 AI 开发”的对照图、责任 owner 表、个人入场自测 |
| L0–L5 概念、测试基础、测试设计方法、自动化/CI | `TD-F01`、`TD-P01..P08`、`TD-PS01..12` | 将基础方法变成 prerequisite；每类方法至少有正常/边界/异常、Oracle、执行证据和失败修复 |
| ML/DL/LLM 基础、Token、Context、Transformer、推理边界 | `TD-F02`、`TD-F03`、`TD-F04` | 补“AI→ML→DL→Transformer→LLM→RAG→Agent”知识桥；先定义术语再进入评测 |
| 分类/回归/聚类/排序/生成/对话指标 | `TD-T01..T04`、`TD-B03` | 增加任务→数据→Oracle→指标选择分支；补 confusion matrix、F1、Recall@k、MRR/nDCG、ROUGE 的最小例子与误用反例 |
| 数据质量、标注、偏见、数据版本 | `TD-T02`、`TD-T09`、`TD-X601` | 增加 Dataset Card、Annotation Guide、标注一致性/裁决表、slice/holdout/leakage 工件 |
| 模型质量、鲁棒性、异常/边界、对抗 | `TD-T05..T08`、`TD-T13..T14`、`TD-X501..X502` | 从风险矩阵选方法；每个方法必须有 seeded fault、independent Oracle 和 mutation 收据 |
| RAG 语料、检索、生成、端到端质量 | `TD-T09..T12` | 保留 retrieval/generation 分层；补 chunk/rerank/no-answer/permission 的对照练习 |
| Prompt 设计、输出质量、上下文、多轮一致性 | `TD-F03`、`TD-T05..T08`、`TD-T13..T14` | 先教 Prompt 输入合同、约束、结构化输出、拒答和截断；Prompt 不得替代数据/权限/Oracle 修复 |
| Agent/Workflow/多 Agent、工具、权限、轨迹 | `TD-T15..T19`、`TD-W01..W03` | 加 Agent state/side-effect ledger、handoff contract、终止/恢复、权限矩阵和 trajectory Oracle |
| 线上监控、漂移、A/B、模型版本 | `TD-T20..T24`、`TD-X805`、`TD-B01..B06` | 增加版本/lineage、统计区间、Canary/rollback；明确 fixture 和生产证据界限 |
| 编程、框架、MLOps、云平台 | `TD-PS01..12`、`TD-A01..A06`、`TD-AP01..08` | 不另设工具百科页；以当前职业任务的 adapter 和版本化命令复用 |
| 沟通、根因、项目、业务和技术影响力 | `TD-P03`、`TD-P07..P08`、`TD-T20..T24`、`TD-C01` | 每个工件注明 owner、消费者、升级条件、残余风险和复盘问题 |
| 资源、FAQ、术语 | `TD-F02..F04`、`TD-C01` + 内部 resource index | 术语先于使用；资源带 checked_at/版本/限制；FAQ 改为 misconception→diagnosis→repair |

### 3.2 必须新增或拆出的页面/工件

现有 `TD-C01` 只有“组合岗位路径、自评、作品集边界”三项结果，不能直接替代原文的职业模型、职级矩阵、四阶段成长、自评表和团队使用指南。建议在课程重建中新增以下稳定页面 ID；未写完前只放 internal catalog，不能进入 public projection：

| 建议 ID | 页面目标 | 前置 | 必须交付 |
|---|---|---|---|
| `TD-C02` | 四责任状态与能力证据梯 | `TD-F01`, `TD-P01..P08` | responsibility ladder、decision-rights matrix、failure-cost map、reviewer receipt |
| `TD-C03` | 个人能力自评与学习路线生成 | `TD-C02`, `TD-T01..T04` | evidence-bound self-assessment JSON、gap routing、30/60/90 日计划、复评记录 |
| `TD-C04` | 组织职级适配器与团队使用 | `TD-C02`, `TD-C03` | `organization_level_adapter`；P-band/year/threshold 默认 INTERNAL-UNKNOWN；owner/内部来源/生效版本 |
| `TD-F05` | AI 任务族和指标选择入门 | `TD-F02..F04`, `TD-T01` | 分类/回归/排序/生成/RAG/Agent 决策树、最小数据集和错误成本卡 |
| `TD-T26` | AI 生成测试用例的专业提效实验 | `TD-P01..P08`, `TD-T01..T08` | baseline/control、Prompt package、mutation、accepted-test、time/quality/cost/defect-yield 报告 |
| `TD-R01` | 职业资源与持续更新方法 | `TD-C03` | versioned resource index、检查日期、替代路径、过期处理，不以星级作质量证明 |

若产品必须保持 85 个 public pages，则上述内容不能被压进 `TD-C01` 的一段说明；应从当前较宽的专题页中明确拆出稳定 page/block/artifact，并更新 release scope。任何删页或合并都要在 ledger 中保留原 source atom 的 target ref。

## 4. 职业责任梯与自评合同

### 4.1 公共责任梯（替代通用 P5–P9）

| 状态 | 学员必须能做的工作 | 决策权 | 必须有的工件 | 失败/变异证据 | 消费者与评审 |
|---|---|---|---|---|---|
| `guided-execution` | 在批准的 Basis、fixture、方法和 Oracle 下执行并解释一次任务 | 不能改变业务阈值、权限、Oracle 或发布结论 | exact command、raw result、finding、边界说明 | 基线通过、故障变红、修复复绿；导师/课程 reviewer | 指导者/页面 reviewer |
| `independent-scoped-ownership` | 独立完成一个受控主题的风险→方法→Oracle→执行→修复→报告 | 可选择测试方法、补充切片并提出 stop/review | capability artifact、decision record、0→1→0 receipt | seeded mutation kill、重复运行、未知项处理 | 项目 owner/同行 reviewer |
| `system-cross-team-leverage` | 让多个团队复用契约、adapter、平台或回归闭环 | 可定义兼容性、迁移和升级门禁；不能替风险 owner 接受风险 | versioned adapter、trace-to-regression、incident link、consumer acceptance | 变更兼容、权限/副作用、回滚和跨团队复用 | 多团队 consumer/平台 owner |
| `strategy-governance-mentoring` | 定义质量策略、治理机制、风险接受、带教与反馈循环 | 可提出策略和组织门禁；风险接受仍归具名业务 owner | governance decision、residual-risk register、portfolio、mentoring receipt | policy mutation、审计回放、反例和升级演练 | 组织/合规/业务 owner |

### 4.2 `TD-C03` 自评字段

每一个能力项都要填写以下字段；只有勾选 L0–L5 不能通过：

```json
{
  "dimension_id": "ai-eval|test-design|data|automation|agent|reliability|communication|governance",
  "responsibility_state": "guided-execution",
  "claim": "我可以在批准的 Oracle 下完成分类模型切片评测",
  "evidence_refs": ["materials/.../reports/...json"],
  "decision_rights": ["choose_slice", "propose_block"],
  "failure_cost": "错误漏检会导致高风险用户被错误放行",
  "last_verified_at": "YYYY-MM-DD",
  "maturity": "fixture-tested",
  "unknowns": ["真实模型未运行"],
  "gap_route": ["TD-T02", "TD-T04"],
  "next_artifact": "Task Metric Card",
  "reviewer": "named owner or NOT_ASSIGNED"
}
```

自评输出必须同时生成：

- 当前证据地图：哪些是 `desk-researched`、`fixture-tested`、`live-tested`、`practitioner-reviewed`、`production-validated`；
- 缺口路由：每个缺口指向一个页面、练习或真实验证任务；
- 90 天计划：每 30 天一个可验证工件，不写“学习完/掌握/就业”；
- 作品集边界：输入来源、版本、命令、原始结果、Oracle、失败/修复、未知和适用范围；
- 复评：同一工件在新版本/新 slice/新 reviewer 下复验，保留差异。

### 4.3 `organization_level_adapter` 门禁

P5–P9、公司 band、工作年限、晋升周期、固定 KPI 和内部岗位名称只能通过组织适配器进入：

```yaml
adapter_id: ORG-LEVEL-...
status: INTERNAL-UNKNOWN
organization: unknown
source_ref: null
owner: NOT_ASSIGNED
effective_from: null
version: 0
mapping:
  guided-execution: null
  independent-scoped-ownership: null
  system-cross-team-leverage: null
  strategy-governance-mentoring: null
thresholds: []
review_cadence: null
failure_action: BLOCK
```

课程可以教学员如何填写适配器，但不能替组织填写。适配器未配置时，职业路径只能输出公共责任梯和 `INTERNAL-UNKNOWN`，不能输出“你现在是 P6/两年后可晋升 P7”。

## 5. 小白可理解性和直接复用要求

### 5.1 必须补的概念依赖

当前课程已有大量专业词，但职业材料目标读者是从小白到测试开发工程师。页面顺序必须先解释下列概念，再让学员执行后续页面：

1. 软件测试、测试依据（Basis）、风险、方法、Oracle、用例、结果和发布责任；
2. AI、机器学习、深度学习、Transformer、模型、推理、训练、Token、Context；
3. Prompt、结构化输出、Embedding、RAG、检索、生成、Agent、Tool、Workflow；
4. Dataset、标注、Slice、Holdout、混淆矩阵、Precision、Recall、F1、AUC；
5. BLEU/ROUGE、Recall@k、MRR/nDCG、Faithfulness、Citation、Judge、Calibration、IAA；
6. Latency、TTFT、TPOT/ITL、QPS/RPS、Throughput、Goodput、Resource、SLO、Drift；
7. Pass@k、PassAllK/`pass^k`、task/session/trajectory、seed、状态重置和置信区间；
8. Agent 的 outcome/step/trajectory、权限、side effect、Handoff、Retry、Checkpoint、Kill switch；
9. `desk-researched`、`fixture-tested`、`live-tested`、`practitioner-reviewed`、`production-validated`。

每个新词必须有：一句白话定义、一个职业类比、一个最小例子、一个反例/误用、一次学习者动作、预期观察和一个检查问题。不能只在附录列术语。

### 5.2 可直接复用的工件包

职业材料的“可复用”不是复制一段话，而是复制后能绑定新场景并验证。至少生成以下可编辑工件：

| 工件 | 必填字段 | 学员修改什么 | 不得修改什么 | 复用验证 |
|---|---|---|---|---|
| `responsibility-map.json` | role、state、decision_rights、failure_cost、artifact、consumer、reviewer | 目标业务、责任 owner、证据路径 | maturity 语义和缺失证据状态 | 新场景能生成明确的 stop/review/rollback |
| `capability-self-assessment.json` | dimension、claim、evidence_refs、gap_route、reviewer、date | 自己的证据、目标路线、时间和工件 | 无证据不能填 PASS | 缺证项路由到页面并保持 UNKNOWN |
| `organization-level-adapter.yaml` | org、source、owner、version、mapping、thresholds、effective_from | 组织 band、内部来源和生效版本 | 公共责任状态定义 | 未配置必须 fail closed |
| `task-metric-card.yaml` | task/population、failure_cost、definition、slices、statistic、threshold owner、uncertainty、failure_action | 任务、分母、切片、基线和 owner | 指标单位、状态语义和证据边界 | 改 slice/版本后可复跑且不混淆指标 |
| `annotation-guide.md` | label、positive/negative、edge case、adjudication、IAA | 领域标签、例子、裁决人 | 未证实的统一 κ/阈值 | 两人标注能复现分歧与裁决 |
| `risk-method-oracle.csv` | risk、impact、method、rationale、oracle、case、owner、stop | 新风险和方法 | Oracle 不能由 generator 自批 | seeded fault 被指定 Oracle 检出 |
| `90-day-evidence-plan.md` | day 0/30/60/90、baseline、fault、repair、reviewer、maturity | 日期、工件、复评者 | 不写就业/晋升保证 | 计划末尾有可运行/可审阅产物 |
| `resource-index.json` | resource、url/path、version、checked_at、level、purpose、limits、fallback | 资源和替代 | 不把推荐星级当效果证据 | 链接/版本过期时能标记并替换 |

每个工件都要有 `inputs`、`editable_fields`、`outputs`、`adaptation_steps`、`validation`、`limitations`、`owner` 和真实仓库路径。Prompt 必须同时绑定 Input、Schema、Eval、Mutation、Model/Provider manifest 和 run receipt；“复制命令”而没有预期证据不算直接复用。

## 6. 页面视觉与流程图计划

原文包含丰富 Mermaid，但不能原样堆在一个长页。每张图必须回答一个学习问题，源文件归仓、具备 `source_refs`、节点至少 5 个、边至少 4 条，并与正文和工件一致。

| 图 ID | 图的学习问题 | 建议目标页 | 图类型/内容 |
|---|---|---|---|
| `V-CAR-01` | AI 测试与传统测试究竟哪里相同、哪里不同 | `TD-F01` | 双泳道 SVG：确定性/概率性、代码/数据/模型、一次执行/持续监控、共同测试设计 |
| `V-CAR-02` | 五维能力如何组成职业能力系统 | `TD-F01` 或 `TD-C02` | Mermaid/ SVG 分层图：AI/ML、测试专业、AI 特有、工程、协作；权重标为示例而非事实 |
| `V-CAR-03` | 从概念到责任的成长如何发生 | `TD-C02` | 四状态阶梯图：guided→scoped ownership→cross-team→governance；每层连 decision/artifact/reviewer |
| `V-CAR-04` | 自评如何把证据缺口路由到课程 | `TD-C03` | 流程图：输入证据→诊断→gap→页面/项目→0/1/0→复评 |
| `V-CAR-05` | AI 测试完整生命周期如何回到生产反馈 | `TD-P01` 或 `TD-T20` | 闭环图：Basis→Data→Model→System→A/B→Monitor→Feedback→回归 |
| `V-CAR-06` | 任务类型如何决定指标 | `TD-F05` | 决策树：classification/regression/ranking/generation/RAG/Agent→Oracle→Metric Card |
| `V-CAR-07` | 个人路线如何按背景分叉 | `TD-C03` | 三入口流程：测试/开发/零基础→共同基础→专项→出口工件 |
| `V-CAR-08` | 组织职级为什么不能由 Skill 自动猜 | `TD-C04` | 边界图：公共责任梯与内部 P-band adapter；未配置→INTERNAL-UNKNOWN→BLOCK |
| `V-CAR-09` | 评估器和模型为何都需要被测 | `TD-T03/T14` | 双层 Oracle 图：gold/rule/reference/judge/human sentinel→calibration→decision |
| `V-CAR-10` | 资源与能力证据如何进入作品集 | `TD-C01/R01` | 证据链：资源/练习→工件→review→maturity→可迁移边界 |

原文的能力占比饼图、P5–P9 雷达图、固定月数时间线、固定 KPI 数字不得直接作为公共真理图。若保留，必须在图题、caption 和数据文件中标注“用户文档示例/未验证/组织适配器待配置”。

## 7. 证据、未知与验收门禁

### Evidence

- 读取到的原文结构和明确陈述：角色职责、测试/AI 能力主题、AI 特有质量面、工程和软技能、阶段路径、自评表、资源索引、FAQ 与图示。
- 当前课程已有页面：`TD-F01`、`TD-F02..F04`、`TD-P01..P08`、`TD-PS01..12`、`TD-T01..T25`、`TD-W01..W03`、`TD-B01..B06`、`TD-C01`、`TD-AP01..08`；其页面状态仍以现有 `tutorial-site.json` 为准。
- 当前 `TD-C01` 已有能力自评、90 天计划和作品集边界的 fixture 包，但不能覆盖原文全部职业章节。

### Inference

- 原材料适合成为“职业能力和成长路径适配器”，不适合原样成为行业标准。
- 当前课程的工程化 AI 质量内容可承接多数专业主题，但职业发展知识的独立教学和组织适配仍不足。
- 为小白服务时，必须增加概念桥和诊断入口；把长文压到 `TD-C01` 会导致内容丢失或术语跳跃。

### Unknown / blocked

- 原文作者实际服务的组织、岗位范围、样本数量和能力权重依据未知。
- P5–P9 是否对应目标学习者的组织 band 未知；未配置组织 adapter 前不得给出个人职级结论。
- 资源链接、版本、维护状态、费用和当前可访问性尚未逐条核验。
- 原文的固定质量阈值没有任务、人口、分母、基线、统计和 owner；不能直接写入发布门禁。
- 当前没有真实模型、企业数据、飞书/MCP、从业者或小白学习者运行证据；不得将 fixture 课程升级为 live/practitioner/learner PASS。

## 8. Course lane 完成条件

下一个课程重建任务只有同时满足以下条件，才能把状态从 `COURSE-REBUILD-PLAN` 推进到课程验证：

1. frozen source hash 与正式 ledger 建立，所有 sections/atoms exact closure，零 `UNMAPPED`；
2. 每个 `incorporated/adapted` 原子有 page/block/artifact target；每个 `rejected/blocked/superseded` 原子有理由、owner 和证据/关闭引用；
3. 职业能力声明、career adapter、organization adapter、Agent adapter（若输入包同时包含 Agent 文档）均已配置；
4. 至少有一条从 `TD-F01` 开始的 beginner route，先解释术语，再执行动作，再检查预期，再故障诊断和迁移；
5. 每个公共页面有连续 `display_number`、稳定 `page_id`、前置依赖和一个主学习结果；编号不得把内部 topic/order 当作显示编号；
6. 新增职业页面与现有工程页之间有 `source_ids`、`scenario_ids`、工件路径、视觉源文件和 evidence boundary；
7. 责任梯、自评、组织适配、任务指标卡和 30/60/90 计划可以在新业务场景中改字段、运行验证并保留 UNKNOWN；
8. 课程内容、教程投影、GitHub 包和 OpenAI Sites 内容均从同一 canonical commit 生成；本 lane 不负责发布；
9. 完成 course lane 后写入 `docs/handoffs/<date>-course-to-validation-*.md`，明确真实模型、从业者和小白学习者仍需 validation lane 独立验证。

## 9. 给执行任务的最小顺序

```text
freeze user source
  → build section/atom ledger
  → adjudicate every atom
  → materialize career adapter + organization adapter
  → add beginner prerequisite and display numbering
  → map pages, artifacts, diagrams, source refs
  → generate/repair course pages and canonical manifests
  → run source/learner/visual/sequence validators
  → run course fixture labs and static build
  → write course→validation handoff
```

任何一步失败都保持 `BLOCKED`，不能用旧的 85 页 `fixture-tested` 报告替代本次材料吸收和小白迁移验证。
