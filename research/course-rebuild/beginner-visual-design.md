# 测试开发 × AI 课程重建：小白学习与主题视觉设计

> Lane：`course`。本文是课程重建的设计合同，不是课程完成证明，也不替代 `learner-usability-reuse.json`、`visual-sequence-manifest.json` 或真实学员验证。

## 1. 当前 85 页基线：能运行，不等于已完成重建

### 已确认的事实（Evidence）

- 当前 `tutorial/tutorial-site.json` 有 85 个页面，`order` 已连续为 1–85；页面有稳定 `page_id`，也有前后页链。
- 每页均有 `architecture`、`materials` 和 13 个正文 section；技术内容已分出 command、config、prompt、source-file 等 typed block。
- 当前站点只渲染 `architecture.nodes` 为横向步骤条；`architecture` 没有 `kind/source_path/alt_text/edges/source_refs`，不能满足主题视觉合同。
- 仓库中没有逐页、可追溯的 `.svg`、`.mmd` 或 `.mermaid` 视觉源文件；因此“页面有架构字段”不能写成“已有可审计图”。
- 至少 7 页复用了完全相同的 `PRD/技术方案 → Basis Gate → 需求契约 → 风险与 TestPackage → 自动化执行 → Run Manifest → 发布证据` 节点序列；这属于通用模板复用，不是页面主题视觉。
- 每页都有材料链接，但现有页面记录没有统一声明 `inputs/editable_fields/outputs/adaptation_steps/validation/limitations/owner`，不能直接证明学习者可迁移复用。
- 当前课程的真实状态仍是 `PASS-FIXTURE`；初学者理解、迁移和职业从业者验证均未运行。

### 需要修复的推断（Inference）

现有课程适合作为工程素材库和页面草稿，不能直接作为“一个小白照着做就能学会”的最终教材。主要原因不是页数，而是：图没有独立来源，页面之间缺少统一的术语/心理模型/失败诊断闭环，工件卡没有迁移契约，且若仅靠静态编辑审查无法证明学习效果。

### 未知（Unknown）

- 目标初学者是否能在不看答案的情况下解释术语、定位失败和修改工件。
- 学习者是否能把同一工件迁移到另一个 API、RAG 知识库或 Agent 工具。
- 真实模型、企业系统、从业者盲评和发布站点回读结果。

## 2. 重建设计原则

### 2.1 每页只有一个职业动作

每页必须回答一个问题：学习者完成什么动作，留下什么可审计工件，下一页消费哪一个字段。页面标题可以解释概念，但完成判定必须是动作和证据，而不是“读完”。

推荐页面链：

```text
职业场景 → 一句话术语 → 心智模型 → 最小正确例子 → 反例/故障
→ 学习者操作 → 预期观察 → 修复与重跑 → 可复用工件 → 小测与迁移
```

### 2.2 视觉表达关系，而不是装饰

视觉类型由知识关系决定；不能为所有页套一个七节点流程：

| 页面要教的关系 | 必须使用的视觉 | 图中至少表现 | 测试开发例子 |
| --- | --- | --- | --- |
| 概念分类 | concept-map | 上位概念、互斥边界、例子、非例子、来源 | Prompt / Context / Tool / Agent 的边界 |
| 状态变化 | state-flow | 状态、触发器、成功/失败/阻断终态 | `NOT_RUN → RUNNING → PASS/FAIL/BLOCKED` |
| 人和系统交互 | sequence | actor、调用、返回、权限、失败回路 | Agent → Tool → System → Trace |
| 数据/信任边界 | data-flow | 输入、变换、存储、脱敏、权限边界、输出 | RAG 文档 → Chunk → Retrieval → Answer/Citation |
| 症状定位 | decision-tree | 症状、检查顺序、分支、证据、升级边界 | TTFT 变慢：Queue / GPU / Provider / Retry |
| 指标到决策 | metric-tree | 原始观测、派生指标、切片、阈值 owner、决定 | Goodput → SLO → Waiver/Rollback |
| 职业成长 | evidence-ladder | 能力层级、证据样例、缺口、下一步 | 执行测试 → 设计 Oracle → 质量系统 Owner |
| 分阶段放行 | gate-ring | Gate、证据环、停止条件、责任人 | Dataset / Oracle / Model / Integration 四环 |

每张图都必须有“它支持什么决定”和“它不能证明什么”的 caption。装饰性图、无来源截图、跨无关页面复用的图均不通过。

### 2.3 面向小白的术语顺序

页面正文采用以下固定顺序，且由 `terms_used` 对 `terms_introduced` 做依赖检查：

1. 先给日常语言定义（不超过 40 字）；
2. 给测试开发类比（例如 Oracle 是“判卷标准”）；
3. 给最小结构图；
4. 用一个正确例子和一个错误例子；
5. 才引入英文缩写、公式或代码；
6. 让学员用自己的话回答一个小测；
7. 最后才进入下一页会消费的技术字段。

基础节点的推荐顺序是：`模型 → Token → Prompt → Context → Embedding → RAG → Tool call → Agent → Workflow → Oracle → Dataset/Slice → Metric → Latency/Throughput → Trace`。任何页面越级使用，都必须增加前置页面或在本页完成定义。

## 3. 页面级信息架构（可直接编译为 JSON）

每个公开页面必须有一条完整记录，字段不是文案建议，而是生成和验证输入：

```json
{
  "page_id": "TD-T10",
  "display_number": 47,
  "prerequisite_ids": ["TD-F02", "TD-F03", "TD-T09"],
  "terms_introduced": ["Recall", "Ranking", "query slice"],
  "terms_used": ["RAG", "embedding", "Recall"],
  "mental_model": "检索像图书馆先找对书，再判断答案是否真的来自书",
  "worked_example": {"input_path": "materials/.../queries.jsonl", "expected_observation": "..."},
  "counterexample": {"input_path": "materials/.../no-answer.jsonl", "expected_observation": "..."},
  "learner_action": {"command_or_steps": "...", "expected_result": "..."},
  "failure_diagnosis": {
    "symptom": "Recall 下降",
    "checks": ["query slice", "chunk version", "embedding version"],
    "repair": "固定切片并恢复版本化索引",
    "rerun_check": "同一 query_id 的 Recall 恢复并有 Run Manifest"
  },
  "comprehension_checks": [{"question": "...", "expected_answer": "...", "misconception": "..."}],
  "reusable_artifacts": [{
    "artifact_id": "rag-retrieval-eval-v1",
    "path": "materials/rag/retrieval-eval/",
    "purpose": "评估检索是否召回了正确证据",
    "inputs": ["queries.jsonl", "qrels.jsonl", "index_manifest.json"],
    "editable_fields": ["query slice", "k", "index version"],
    "outputs": ["raw_results.jsonl", "metric-card.json", "run-manifest.json"],
    "adaptation_steps": ["绑定新业务 query", "由业务 owner 更新 qrels", "运行 gate", "解释失败切片"],
    "validation": "schema + deterministic oracle + held-out slice",
    "limitations": "不证明答案生成的真实性或生产效果",
    "owner": "课程学习者/业务评测 owner"
  }],
  "visuals": [{
    "visual_id": "TD-T10-retrieval-boundary",
    "kind": "decision-tree",
    "purpose": "决定 Recall 下降应先检查哪个版本边界",
    "source_path": "visuals/TD-T10-retrieval-boundary.mmd",
    "alt_text": "从 Recall 下降分流到 query、chunk、embedding 和权限检查",
    "caption": "支持检索回归定位；不证明生成回答正确",
    "nodes": ["Recall drop", "query slice", "chunk version", "embedding version", "permission filter", "repair", "rerun"],
    "edges": ["symptom→query", "query→chunk", "chunk→embedding", "embedding→permission", "check→repair", "repair→rerun"],
    "source_refs": ["S23", "S37"]
  }]
}
```

站点渲染器可以继续使用现有 React 页面框架，但应将 `architecture` 升级为 `visuals[]` 投影：展示渲染后的 SVG/Mermaid，同时保留“查看源文件”和哈希信息；不能只把 `nodes` 画成卡片。

## 4. 可复用工件卡：让“拿来用”有边界

每页最多 1–3 个主工件，工件卡按以下顺序显示：

1. **用途**：它解决哪个职业决定；
2. **输入**：文件、字段、版本、权限和前置工件；
3. **可编辑字段**：学习者可以改什么；
4. **不变量**：不能改什么，否则证据失效；
5. **输出**：输出文件和关键字段；
6. **迁移步骤**：如何换一个业务对象、更新 Oracle/阈值 owner、执行验证；
7. **失败解释**：失败意味着什么、不意味着什么；
8. **限制和责任人**：fixture、真实模型、企业数据、隐私及人工批准边界。

四类工件必须分开：

- **解释工件**：术语表、心智模型、决策树；可理解，不可假装可执行。
- **执行工件**：命令、输入 fixture、schema、run manifest；必须有预期退出码和输出。
- **评测工件**：Oracle、dataset/slice、metric card、mutation；必须能区分 PASS、FAIL、UNKNOWN、BLOCKED。
- **职业证明工件**：测试策略、风险登记、回归报告、职业证据梯；必须有 reviewer/owner。

## 5. 课程视觉序列与编号治理

- 以 `page_id` 做稳定追踪，以 `display_number` 做学习者看到的连续编号；页面显示严格为 `1..N`。
- 课程生成顺序固定为：职业基线 → AI 基础 → AI 辅助传统测试 → LLM/RAG → Agent/Workflow → 性能可靠性 → 质量系统 → Benchmark → Capstone → 职业演进复盘。
- 每次页面增删或重排都必须同时更新：catalog、前后页链、prerequisites、`learner-usability-reuse.json`、`visual-sequence-manifest.json`、fidelity hash。
- 页面视觉路径必须一页一源；相同主题的相邻页可以复用视觉语言（颜色、图例、节点形状），不能复用同一 source path。
- 图源放在仓库内，例如 `tutorial/visuals/TD-T10-retrieval-boundary.mmd`；生成的 SVG 需要记录生成工具、源 hash 和渲染时间。

## 6. 页面类型的最小交付模板

| 页面类型 | 必须出现 | 不能省略 |
| --- | --- | --- |
| 概念 | 一句话定义、类比、概念图、正确/错误例子、小测 | 不能只有名词表 |
| 跟做 | 输入路径、步骤、命令、预期输出、故障注入、修复、产物 | 不能只有复制代码 |
| 诊断 | 症状、检查顺序、决策树、根因证据、修复、重跑 | 不能把猜测当根因 |
| 参考 | 定义表、选择规则、版本、边界、替代方案、来源 | 不能把阈值写成普适真理 |
| 项目 | 业务简报、约束、工件链、评分标准、迁移挑战、人工评审 | 不能把 fixture RC 写成生产方案 |
| 职业演进 | 能力状态、证据梯、当前自评、缺口、下一步作品 | 不能用岗位口号代替证据 |

## 7. 建议的课程改造顺序（只允许顺序执行）

1. **冻结输入与裁决 611 个 source atom**：先生成并人工完成来源吸收 ledger；任何 `UNMAPPED` 停止。
2. **重建基础页**：TD-F01–F04 先完成术语、心智模型和最小 SVG/Mermaid；后续页不得隐藏前置知识。
3. **重建一条代表性纵切**：建议 `TD-P01 → TD-P05 → TD-T06 → TD-T10 → TD-T16 → TD-T20 → TD-T25`，验证从需求依据到质量门禁的迁移链。
4. **按页面类型补齐工件卡**：先输入/输出/编辑字段/限制，再写解释性文字；每张卡都必须能在干净目录中运行或明确标记不可运行。
5. **生成全量视觉序列**：为 85 个公开 page_id 生成一页一源的视觉清单和源文件；至少 5 个节点、4 条语义关系；职业演进使用 evidence ladder，Agent 使用 architecture/sequence/gate ring。
6. **运行静态门禁**：source closure、terms-before-use、continuous numbering、prerequisite order、visual source/hash、artifact contract。
7. **运行 clean-room fixture**：学习者只拿公开 release，按页面操作；保留原始输入、输出、失败和修复收据。
8. **独立学员验证**：在没有答案提示的情况下完成“解释、找错、修改、迁移”任务；结果记录为 `NOT_RUN/PASS/FAIL/BLOCKED`，不得由作者自评升级。

## 8. 完成条件与停止条件

### 课程重建可交给 validation lane 的条件

- 611 个来源原子均有明确 disposition 和目标页面/适配器；
- 每个公开页有 `display_number=1..N`、术语依赖、心智模型、正反例、失败修复、小测和可复用工件；
- 每个公开页至少有一个主题视觉源，视觉语义与正文一致，源路径不重复，渲染和移动端可读性有收据；
- 页面顺序、前置关系、工件路径、材料 hash 和站点投影闭合；
- 静态和 fixture 门禁全绿，但 learner/practitioner 状态仍按真实证据填写。

### 必须停止并报告的情况

- 任一 source atom 无法裁决、组织内部规则被静默删除、或来源 hash 漂移；
- 视觉只有节点卡片/截图，没有仓库源文件、关系边或 source refs；
- 页面以“已阅读”代替可观察学习动作；
- 工件没有输入、可编辑字段、输出、验证或责任人；
- 将 `fixture-tested`、作者审查或静态构建写成小白已理解、从业者认可、真实模型通过或已发布。

