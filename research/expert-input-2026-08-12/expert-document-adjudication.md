# 用户专家文档裁决与融合记录

日期：2026-08-12  
状态：`RESEARCH-ADJUDICATED / FACTORY-NOT-IMPLEMENTED`  
目的：把用户提供的两份文档转成可迁移的专业能力合同，而不是把其全部段落、固定数字或职业承诺直接复制进课程。

## 1. 输入与完整性

| Input ID | 文件 | 行数 | SHA-256 | 来源地位 |
| --- | --- | ---: | --- | --- |
| DOC-CAREER | `/Users/owen/Downloads/AI测试工程师发展.md` | 2091 | `d6df309516b91cb5c7e68ce2f69eb817c2bed7798f80ab9005627097dbc8416c` | 用户提供的专家输入；作者、组织和验证样本未知，不是行业标准 |
| DOC-AGENT | `/Users/owen/Downloads/AI agent测试架构.txt` | 639 | `b38274bcc1ba2d8c6e721157765f1b64ae70b0cbc9cc2cdd0a703140a69b2b54` | 用户提供的架构草案；适合作为设计候选，不是生产就绪规范 |

两份文件均已逐行完整读取。本文引用文件标题、章节和行号只是定位输入观点；观点是否进入蓝图，仍由标准、官方资料、原始研究、反证和当前课程证据共同裁决。

## 2. 职业能力文档裁决

### 2.1 直接吸收为能力候选

- 角色不只是执行测试，还承担质量守门、评测设计、风险识别、工具建设和持续优化（DOC-CAREER 20–77）。
- 公共核心应覆盖传统测试、需求与技术文档、自动化、CI、数据与标注、模型任务、鲁棒性、公平性、可解释性、A/B、漂移监控、工程化与 MLOps（222–552）。
- 传统 ML、CV、NLP、推荐/排序是不同任务族，需要不同数据、变换、Oracle、指标和失败模式（222–327）。
- 学员起点不同，应做入学诊断和可配置学习路线，而不是只有一条统一时间表（1254–1332）。
- 个人成长需要自评、评审和真实项目证据，但评价对象应是工件、决策和迁移能力（1333–1535）。

### 2.2 转换后吸收

| 原文形状 | 风险 | 转换后的 Skill 合同 |
| --- | --- | --- |
| 五类能力固定为 30/25/25/15/5 | 权重无目标岗位、失败成本和样本依据 | `capability_profile` 由目标系统、责任、风险和 learner diagnostic 配置；默认无权重 |
| P5–P9 绑定 0–2/2–4/4–7/7–10/10+ 年 | 用年限代理能力，跨组织不可迁移 | 不带公司职级的责任证据梯；公司映射只能由 `organization_level_adapter` 和具名 owner 提供 |
| 项目规模由数据量、人数和工期划分 | 不能反映权限、不可逆副作用、隐私和耦合 | `project_risk_profile` 使用失败成本、敏感度、可逆性、权限、复杂依赖和运行规模 |
| 工具与平台推荐列表 | 版本、维护、许可和目标环境会变化 | `technology_radar` 记录版本、用途、替代路径、锁定风险和运行证据 |
| 固定 3/6/12 个月路线 | 对学习背景、投入、目标和评审无效 | `learner_route_profile` 基于诊断和出口工件生成路线，不承诺月份或就业结果 |

### 2.3 明确拒绝

- 用例数、Bug 数、覆盖率、自动化率、NPS、节省比例、按时率等脱离分母、风险、版本和 owner 的通用阈值。
- 分享次数、博客、Star、点赞、粉丝、证书、专利或论文数量作为专业能力的主要证明。
- 固定晋升周期、年限等价能力、就业保证或“某方向最热门”作为课程选择依据。
- 由未经校准的 GPT/LLM 单独给能力或模型质量打分。

## 3. Agent 架构文档裁决

### 3.1 直接吸收为架构骨架

1. **D0 先评估评估系统**：Gold、rubric、deterministic checker、Judge、人工分歧和版本漂移本身必须被测（240–266）。
2. **D1–D7 分层**：单体能力、编排协作、交互接管、鲁棒可靠、安全对抗、效率经济、业务治理构成一张有用的风险覆盖图（86–99、268–494）。
3. **轨迹级证据**：最终答案不能抵消错误工具、越权副作用、错误顺序或未终止；task root、span、tool attempt、state 和 effect 要连成追踪链（278–295）。
4. **多 Agent 交接**：交接字段、信息保真、上下文压缩、级联故障、熔断和责任归属是独立测试对象（297–323）。
5. **人类协同**：中断、接管、确认、回滚和确认疲劳必须同时测安全性与可用性（325–342）。
6. **可靠性是分布**：重复运行、一致性、长时程衰减和 checkpoint 应与单次最高能力分开（344–385）。
7. **Agent 供应链与爆炸半径**：工具描述、版本 rug-pull、身份委托、记忆污染、沙箱、短时凭证、限额、kill switch 和不可逆动作应进入负例（387–436）。
8. **四环运行模型**：offline CI → sandbox replay → shadow/canary → online continuous evaluation，并在每环记录 entry、exit、降级、回滚和 owner（496–523）。
9. **三段式决策**：硬安全阻断、统计证据、具名风险接受应分开，不用单一总分代替（525–566）。

τ-bench、Claw-Eval、MCPTox 和 OWASP Agentic Top 10 分别为重复可靠性、轨迹不透明、工具描述投毒和 Agent 风险分类提供外部支持（E45–E48）；它们的数字只适用于各自 benchmark，不是通用行业阈值。

### 3.2 必须修正的方法

| 草案做法 | 问题 | 专业改造 |
| --- | --- | --- |
| 把 `pass^k` 与 `pass@k` 混用 | 前者是 k 次全部成功，后者通常表达 k 次中至少一次成功；决策含义相反 | Metric Card 明确定义 task、trajectory、状态重置、独立性、k、seed/config、Pass@1/PassAllK/CI；使用 task-stratified bootstrap、层级或 clustered 方法 |
| “置信区间不重叠才算回归” | 不是正确的配对回归检验规则 | 使用 paired difference CI、bootstrap/permutation/McNemar、非劣效边界或序贯检验，并声明 power 与多重比较 |
| 三名标注员统一用 Cohen κ | Cohen κ 适用于两名标注者；类别不平衡也会扭曲 κ | 按标注设计选择 Fleiss κ、weighted κ、Krippendorff α 或其他一致性统计，并保留 disagreement/adjudication |
| A/B 与 B/A 不一致就删除样本 | 会丢失不确定样本并产生选择偏差 | 保留 disagreement，盲法仲裁并把 position sensitivity 作为 Judge Card 维度 |
| Judge 与 generator 不同模型族即可独立 | 不同模型族仍可能共享训练偏差或 rubric 缺陷 | 使用 deterministic/reference/human sentinel、holdout judge、abstain、版本桥接和 construct validity；模型家族只是一项风险缓解 |
| 同一 Judge 贯穿离线和在线 | 易形成 common-mode blind spot 和不可比漂移 | 固定 construct/rubric，版本化 scorer；每次升级做 bridge set，并保留人工 sentinel |
| Bernoulli pass rate 使用 CV | 接近 0/1 时不稳定或失真 | 报告 rate、CI、slice、repeat 和 failure distribution；成本重尾另报 p95/p99/max/budget-stop |
| KL 作为默认漂移距离 | 零桶和高维支持集会导致无穷或误判 | 预注册特征空间；按数据选 JS/PSI/Wasserstein/校准漂移，并报告置信区间和失败动作 |
| 0 次攻击成功写成“0 风险” | 零观测不等于风险为零 | 报告暴露分母、覆盖、检测灵敏度和零事件上界；只写 `zero observed in suite vN` |
| 固定随机种子即可复现 | Provider、检索、工具、网络和缓存仍非确定 | 区分 exact replay 与 behavioral replay；冻结响应/时间/索引快照并记录不可重放项 |

### 3.3 参数化而非通用门禁

`κ≥0.7`、Gold 200–300、三名标注员、position consistency 95%、P0/P1/P2 的 k=10/5/3、ASR≤1%、P95/P99、1–10% 抽样、3–7 天 shadow、四/六/八周路线和所有 D1–D7 百分比，都只能作为组织候选起点。最终值必须来自：任务与 population、失败成本、baseline、法规、风险预算、样本量/power、置信区间、owner、版本和失败动作。

### 3.4 过期、矛盾或未证实的外部结论

- “EU 高风险义务整体于 2026-08 生效”过宽；欧盟官方是分阶段时间线，课程必须绑定条款和 `checked_at`（E49）。
- Colorado AI 法律日期已多次变更，旧 SB24-205 日期不可当作 2026-08 当前事实；必须从官方入口重查 statute/version（E50）。这也说明 `CAIA` 既可能指 Colorado AI Act，也可能指 crypto-agent benchmark。
- “持续评估减少事故 67%”“30–60 天必然退化”“90% Agent 中途失败”“20 万 MCP”“82:1 机器身份”“11 天失控”等未找到可审计一手来源，保持 `UNKNOWN`，不得进入课程事实或门禁。
- Claw-Eval 的 44%、13%、24 个百分点，MCPTox 的 45/353/72.8%，只可作为相应研究设置下的 Evidence，不可写成所有 Agent/MCP 的普遍发生率（E46–E47）。

## 4. 融入后的能力增量

### 公共核心新增

- `Capability Evidence Ladder`：guided execution → independent scoped ownership → system/cross-team leverage → strategy/governance/mentoring；每层绑定 decision rights、failure cost、artifact、fault/mutation、consumer 和 reviewer，不绑定年限。
- `Judge Card / Evaluation System Trust`：构念、Gold、标注协议、适用统计、偏差测试、abstain、版本桥接、human sentinel、失败动作。
- `Agent Evaluation Architecture`：D0–D7 coverage、trajectory/effect ledger、可靠性分布、四环 entry/exit/rollback 和 risk acceptance。
- `Handoff Contract`：source agent、target agent、facts/decisions/unknowns、context budget、lost-information check、authority、idempotency、cascade stop。
- `Human Control Contract`：interrupt/takeover/approval/cancel/rollback、dirty-state recovery、confirmation fatigue、误批/拒绝率和 audit。
- `Autonomy Envelope`：max steps/time/tokens/money/side effects、checkpoint、safe terminal、kill switch 和 residual risk owner。

### 选择性专项新增

- 传统 ML 训练失效：欠拟合、过拟合、泄漏、校准、漂移和特征/标签质量。
- CV：变换/变形、检测/分割/跟踪、多模态与空间/时间 Oracle。
- 推荐与排序：离线/在线指标、反馈回路、长短期目标、公平和 counterfactual 限制。
- 解释有效性与可申诉：解释的忠实度、稳定性、可理解性和申诉流程；SHAP/LIME 图不是因果证明。

## 5. 状态边界与下游动作

- 本轮只更新研究裁决；没有修改 canonical Skill、课程页面、站点或发布物。
- 当前 85 页的 fixture/editorial PASS 不自动覆盖这些新增能力。
- 下一步必须由 `factory-root-cure-ai-testing-professional-capability-contracts` 把本裁决变成 Schema、状态、模板、负例和 validator；随后 course lane 通过 Skill 生成最小样板，再决定批量迁移。
- 未运行真实模型、Judge、MCP、飞书、生产流量、从业者评审或法律审查；相关成熟度保持 `NOT_RUN/UNKNOWN`。
