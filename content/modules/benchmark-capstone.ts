import { buildQualityBenchmarkPage, type QualityBenchmarkSpec } from "./quality-system.ts";
import { qualityPlatformDeepBlocks } from "./quality-platform-deep.ts";
import { composeDeepPage } from "./deep-layer.ts";
import { benchmarkDeepBlocks } from "./benchmark-deep.ts";
import type { TutorialBlock } from "../course.ts";

const benchmarkReviewBlocks: Record<string, TutorialBlock> = {
  "TD-B02": { title: "Dataset 分层复盘：代表性与挑战性不能互相替代", body: ["四类数据角色解决的是四种不同决策：representative 看常见流量，challenge 放大边界与攻击，regression 锁住历史事故，sealed holdout 防止调参过拟合。先写 sampling frame、实体/事件去重、时间窗和风险切片，再决定样本数量；不能把简单 FAQ 的高频率当成业务风险的代表。", "一个可直接复用的检查是给每条样例加 provenance、incident_id、tenant、policy_version 和 split_role，然后按 incident/entity/time 做去重。发现同一事件改写跨 train/dev/holdout、未授权访问 holdout 或标签争议未 adjudicate 时，立即使旧结果失效。迁移到代码或 Agent 任务时改实体和 Oracle，但保持四类角色、访问审计和 hash 绑定。"], table: { headers: ["症状", "疑似层", "下一步检查"], rows: [["Holdout 分数异常高", "数据泄漏", "按事件/实体查近重复和访问日志；泄漏后重建 split"], ["高风险退款几乎没有样本", "抽样/切片", "按风险目录补 challenge 与事故回归，不用频率掩盖"], ["标注者对权限答案争议大", "Oracle/标注", "保存双标、adjudication 与政策版本；未共识则 UNKNOWN"], ["开发者反复查看 sealed 数据", "访问治理", "冻结访问并轮换 holdout；旧结论降级"]], caption: "数据角色、访问权和 Oracle 必须一起审计。" } },
  "TD-B03": { title: "指标复盘：先把分母和失败动作写清楚", body: ["Accuracy、pass@k、resolved rate 和 Judge score 回答不同问题。逐题 ledger 必须保留每次尝试、超时、拒答、成本、工具调用和 blocker；不能因为某次失败而把它从分母删除。pass@k 的提升可能只是增加重试，resolved rate 可能只看最终状态，Judge 分又依赖校准，三者不能用一个总分互相替代。", "可复用的 Metric Card 至少声明单位、公式、分母、缺失策略、重复次数、区间方法和失败动作。迁移到 Agent 评测时，把越权工具调用作为独立 blocker；迁移到 RAG 时增加引用正确性和新鲜度切片。小样本或区间重叠时保持 UNKNOWN，不把点估计写成能力提升。"], table: { headers: ["症状", "疑似层", "下一步检查"], rows: [["pass@5 很高但单次成功低", "重复/分母", "同时报告单次 resolved rate、重试次数和单位成本"], ["超时被排除后分数上升", "missing policy", "把超时放回分母，声明失败动作并重算"], ["Judge 分高但越权存在", "独立 Oracle", "越权一票否决，回查工具 trace 与人工校准"], ["两候选差异很小", "不确定性", "增加预先约定重复并报区间；不足则不宣布 winner"]], caption: "指标是决策接口，不是脱离分母的排行榜数字。" } },
  "TD-B06": { title: "公共 Benchmark 迁移复盘：结构可借鉴，结论不能照搬", body: ["HELM、SWE-bench、AgentBench 等公共方法可以借鉴任务卡、协议固定、逐题记录和可复现报告，但公开分数不包含企业政策、租户隔离、退款权限、中文业务和维护责任。企业内部基准必须从一个真实发布决策开始，连接业务风险、独立 Oracle、事故回归和具名 owner。", "迁移的最小步骤是：选一个公共任务结构→替换为业务代表/挑战/回归/隐藏数据→加入权限与副作用 blocker→规定版本、争议、轮换和废弃→用同预算 adapter 比较候选。没有真实数据、标注团队或发布连接时，只能交付设计与 fixture，不得写成生产基准。"], table: { headers: ["症状", "疑似层", "下一步检查"], rows: [["翻译公开题后就称企业可用", "业务 Oracle", "回链真实决策和事故；补权限、引用和副作用条件"], ["公共分数高但客服失败", "任务/切片", "加入中文长对话、低频高风险和政策版本切片"], ["基准长期无人维护", "治理 owner", "检查版本、轮换、争议和 retire policy；无 owner 则阻断"], ["候选比较不公平", "adapter/protocol", "锁定模型、工具、Prompt、预算和 scorer，报告 confounded"]], caption: "可迁移的是证据结构和治理方法，不是榜单名次。" } },
  "TD-T25": { title: "Capstone 复盘：用一条追踪链证明交付边界", body: ["Capstone 不是把十二页材料拼成漂亮目录，而是从 PRD 风险追到 Dataset、Prompt/Input/Schema、Composite Oracle、CI、Trace regression、性能、Waiver 和 rollback。每个高风险 mutation 都要有 owner、运行 receipt、失败证据和修复后重跑；任何缺口都写 UNKNOWN 或 BLOCKED。", "交付审查按顺序进行：先验证 artifact/hash closure，再运行 baseline 0；注入引用、权限、注入或性能 fault 使其变成 1；最后在不改 expected 的情况下 repair 回 0。当前最多是 PASS-FIXTURE release candidate，模型、真实 RAG/Agent、企业集成、从业者评审和 production 均 NOT_RUN。"], table: { headers: ["症状", "疑似层", "下一步检查"], rows: [["所有报告绿但无需求映射", "traceability", "逐 requirement/risk 查 test/evidence/owner；缺失即阻断"], ["fault 通过改 expected", "Oracle integrity", "比较 baseline/fault/repair expected hash；改 Oracle 视为失败"], ["ZIP 与公开文件 hash 不同", "artifact closure", "重新构建 closure 并逐 member 对账"], ["fixture receipt 被写成 live", "证据边界", "恢复 NOT_RUN、FIXTURE_ONLY 和独立晋级门禁"]], caption: "Capstone 的合格出口是可审计的 fixture RC，不是生产或从业者证明。" } },
};

const benchmarkDiagnosticBlocks: Record<string, TutorialBlock> = {
  "TD-B01": { title: "Benchmark 七段链诊断", body: ["一个榜单分数无法回答退款权限是否安全。worked walkthrough：从 task、dataset、protocol、model/harness、scorer、aggregation、report 七段逐项取证，发现 scorer 没有记录拒答分母时，结论只能 INCOMPARABLE。迁移到内部客服基准时补企业 Oracle、权限 blocker 和 owner，保留逐题回链。"], table: { headers: ["症状/问题", "疑似层", "下一步检查", "修复/重跑"], rows: [["榜单分数无法复现", "protocol", "查 Prompt/预算/超时", "锁定 manifest 重跑"], ["高分但退款越权", "Oracle", "查工具 trace", "加入权限 blocker"], ["总分变化无逐题记录", "aggregation", "查 raw ledger", "保留失败分母"], ["报告缺限制", "report", "查适用范围", "补 boundary 再发布"]], caption: "Benchmark 先证明可解释，再谈性能。" } },
  "TD-B04": { title: "Harness 敏感性诊断", body: ["worked walkthrough：固定模型和数据，只把 timeout 从 30s 改为 60s；resolved rate 上升但成本和失败分布变化。学员提交 paired ledger、变量 diff、区间和 unit-success cost，迁移到工具访问或 Prompt 时一次只换一个变量。"], table: { headers: ["症状/问题", "疑似层", "下一步检查", "修复/重跑"], rows: [["分数上升且超时下降", "timeout", "查成本与缺失", "同预算重跑"], ["工具开启后提升", "harness", "查调用次数", "单变量对照"], ["Prompt 与工具同时变", "实验设计", "查 manifest diff", "拆成两次实验"], ["差异无法重复", "环境", "查版本与 seed", "标 UNKNOWN 后重跑"]], caption: "Benchmark 变化必须归因到单一协议变量。" } },
  "TD-B03": { title: "指标分母诊断", body: ["worked walkthrough：10 题各跑 5 次，pass@5 很高但单次成功低且一次越权被均值掩盖。学员保留逐题 ledger、超时、重试、成本和 blocker；迁移到 Agent 加工具 blocker，RAG 加引用切片。"], table: { headers: ["症状/问题", "疑似层", "下一步检查", "修复/重跑"], rows: [["pass@5 高单次低", "重复", "查重试与成本", "报告单次率"], ["超时被排除", "分母", "查 missing policy", "放回重算"], ["Judge 高但越权", "Oracle", "查工具 trace", "一票否决并重跑"], ["差异很小", "不确定性", "查区间与样本", "不足则 UNKNOWN"]], caption: "指标必须可回链到分母与失败动作。" } },
  "TD-T25": { title: "Capstone 追踪诊断", body: ["worked walkthrough：从 PRD 风险追到 Dataset、Prompt/Schema、Composite Oracle、CI、Trace regression、性能、Waiver 和 rollback；先 hash closure，再 baseline 0，注入 fault 变 1，repair 不改 expected 回 0。"], table: { headers: ["症状/问题", "疑似层", "下一步检查", "修复/重跑"], rows: [["报告绿但无需求映射", "traceability", "查 requirement/risk", "补 owner 后重跑"], ["fault 通过改 expected", "Oracle", "比三阶段 hash", "恢复 expected 重跑"], ["ZIP 与公开文件不一致", "closure", "逐 member 对账", "重建 closure"], ["fixture receipt 写成 live", "边界", "查状态字段", "恢复 NOT_RUN"]], caption: "Capstone 出口是可审计 fixture RC。" } },
};

const benchmarkWave6Blocks: Record<string, TutorialBlock> = {
  "TD-B02": { title: "Split 泄漏计算与迁移验收", body: ["worked calculation：若 2,000 条样例按 incident_id 去重后发现 18 个近重复跨 split，overlap rate=18/2,000=0.9%，这不是可忽略噪声，而是使 holdout 结论失效的 blocker。学员提交 overlap ledger、重建 split hash、访问审计和四类数据角色的样例比例。", "迁移到 Agent trajectory 时按 session_id 去重；迁移到代码任务时按 issue/repository/time 去重。验收条件是近重复为 0、holdout 访问可追踪、高风险 challenge 覆盖有分母、旧结果被标失效。"], table: { headers: ["决策/故障", "层", "证据", "修复/验收"], rows: [["18 个近重复", "Split", "overlap ledger", "重建并重算"], ["holdout 被调参", "访问", "access log", "冻结轮换"], ["风险覆盖不足", "抽样", "slice 分母", "补 challenge"], ["迁移到 Agent", "实体", "session hash", "同规则验收"]], caption: "数据完整性用分母和 hash 交接。" } },
  "TD-B03": { title: "指标计算与迁移验收", body: ["worked calculation：10 题各跑 5 次共 50 次运行，40 次成功，resolved rate=40/50=80%；其中 8 题至少成功一次，pass@5=80%，两者恰好相同并不表示单次可靠。若一次越权调用发生，安全 blocker 仍使候选失败。学员交 raw ledger、Metric Card、区间、缺失策略和 blocker receipt。", "迁移到 RAG 增加 citation-correctness 分母，迁移到 Agent 增加 step-level prohibited-action 分母。验收条件是公式能从逐题 ledger 重算、超时不被删除、独立 Oracle 可否决平均分、样本不足输出 UNKNOWN。"], table: { headers: ["决策/故障", "层", "证据", "修复/验收"], rows: [["40/50=80%", "resolved", "raw ledger", "重算分母"], ["pass@5=80%", "k 聚合", "逐题尝试", "同时报单次率"], ["一次越权", "安全 Oracle", "tool trace", "一票否决"], ["迁移到 RAG", "引用", "citation ledger", "同分母验收"]], caption: "指标计算必须可由学员独立重算。" } },
  "TD-B06": { title: "企业基准计算与迁移验收", body: ["worked calculation：内部客服基准将 100 条样例分为 60 representative、20 challenge、15 regression、5 sealed holdout；若 15 条 regression 中 1 条权限 blocker，整体 99% 也不能放行。学员提交任务卡、风险分层分母、Composite Oracle、owner、expiry 与版本 hash。", "迁移到支付或代码 Agent 时重新定义副作用与业务 Oracle，但保持事故 regression 一票否决、同预算 adapter、访问审计和 retire policy。验收条件是公共分数与内部分数分栏，企业决策可回链，未知项不被榜单结论填补。"], table: { headers: ["决策/故障", "层", "证据", "修复/验收"], rows: [["1/15 regression blocker", "业务 Gate", "事故 ledger", "阻断发布"], ["100 条四类分层", "数据", "split manifest", "重算覆盖"], ["候选不公平", "协议", "adapter hash", "同预算重跑"], ["迁移到支付", "Oracle", "副作用规则", "人工验收"]], caption: "企业基准必须先服务业务决策。" } },
  "TD-T25": { title: "Capstone 计算式验收", body: ["worked calculation：追踪矩阵有 12 个高风险 requirement，若 11 条有 test/evidence/owner，coverage=91.7%，但缺 1 条权限风险仍应 BLOCKED。学员核对 hash closure、baseline/fault/repair 退出码、ZIP member、unknown register 和人工 Gate receipt。", "迁移到真实项目必须新增 provider/model、integration、practitioner、learner observation 与 live/production 门禁；fixture 的 0→1→0 只能证明 mutation sensitivity。验收条件是覆盖率、blocker、工件闭包和未知项同时满足，不能用平均分代替缺口。"], table: { headers: ["决策/故障", "层", "证据", "修复/验收"], rows: [["11/12 coverage", "Traceability", "risk matrix", "补缺口重跑"], ["fault exit 0", "Runner", "receipt", "恢复 exit 1"], ["ZIP hash 不一致", "Closure", "member diff", "重建 bundle"], ["fixture 晋级 live", "Boundary", "status/provider", "恢复 NOT_RUN"]], caption: "Capstone 验收看缺口是否阻断。" } },
};

const capstoneReleaseReview: TutorialBlock = {
  title: "Capstone 发布候选评审：逐项给出放行、阻断或补证据",
  body: [
    "评审时不要从首页演示开始，而要随机抽一条高风险需求，沿 requirement→risk→test condition→case/data→independent Oracle→baseline/fault/repair receipt→decision 反向核对。每个节点必须能打开当前文件、显示 owner 和 hash，并说明下游消费者；任何断边都输出 BLOCKED，不能用其他页面的通过率补偿。",
    "接着执行三类破坏性复核：删除一条权限映射，确认 coverage 缺口被发现；替换一个旧 ZIP member，确认 artifact closure 失败；把 fault 的 expected 改宽，确认 Oracle integrity 拦截假修复。三类故障都被定位、恢复后才得到 fixture release candidate；这仍不等于模型、企业集成或生产发布通过。",
    "学习者最后提交一页 decision record，分别列出 Evidence、Inference、Unknown、hard blocker、剩余风险、补证据 owner、到期时间和 rollback。换到自己的项目时可以复用表结构与审查顺序，但必须替换业务规则、数据、权限、模型/工具版本和发布责任人；没有具名批准者时保持 NOT_RUN/BLOCKED。",
  ],
  table: {
    headers: ["评审问题", "必须打开的证据", "失败状态", "下一动作"],
    rows: [
      ["高风险需求是否闭环", "trace matrix + case + receipt", "BLOCKED", "补齐首条断边并重跑"],
      ["故障是否真的被杀死", "mutation + failed_oracle_ids", "FAIL", "恢复独立 Oracle 后重放"],
      ["下载包是否与页面一致", "artifact closure + member hash", "INTEGRITY-FAIL", "重建并逐成员核对"],
      ["是否具备更高成熟度证据", "model/integration/practitioner/learner/live receipts", "NOT_RUN", "由对应 owner 启动独立门禁"],
    ],
    caption: "Capstone 的终点是可审计决定，不是一张全绿截图。",
  },
};

const specs: QualityBenchmarkSpec[] = [
  {
    id: "TD-B01", moduleId: "TD-M06", title: "Benchmark 流水线：七个可变组件", type: "概念", duration: "50 分钟", prerequisites: ["TD-T21"],
    summary: "把任务、数据、协议、运行环境、Scorer、聚合和报告拆开，判断一个 Benchmark 分数能说明什么。",
    why: "同一模型在两个榜单分数不同，常常来自 Prompt、工具、超时、版本、Scorer 或聚合差异，而不只是模型能力。",
    outcomes: ["画出完整 Benchmark 数据流", "区分模型能力与 harness 影响", "从总分追到逐题结果和适用边界"], artifact: "Benchmark 七段流水线与审计清单",
    failure: "团队只截图 leaderboard 名次就选择企业客服模型，却不知道 task version、Prompt、工具预算、超时、失败处理和 scorer；公开总分无法回答退款权限是否安全。",
    mechanism: "Benchmark 测的是 task×dataset×protocol×system×scorer×aggregation 的组合。HELM 强调透明可复现，lm-eval 暴露任务与模型适配，SWE-bench 则把真实问题、仓库环境和测试判定结合。",
    mechanismBullets: ["Task：能力问题与成功条件", "Dataset：来源、样本与 split", "Protocol：Prompt、few-shot、工具、预算和超时", "System：模型快照、适配器和运行环境", "Scorer/Aggregation：逐题 Oracle、缺失处理和总分"],
    decision: "任一关键字段缺失时，把结论标为不可复现或适用范围未知；公共榜单只能提供外部参考，不能自动成为企业发布 Gate。",
    decisionBullets: ["从报告回链到逐题 record", "记录失败和超时而非删除", "比较前确认 task/harness/version 相同", "限制说明与总分同屏"],
    metric: "先检查 benchmark completeness 与 reproducibility，再解释 performance。报告应同时包含样本量、逐任务、切片、失败类型、成本和不确定性。",
    metricBullets: ["分母：所有纳入任务", "缺失/超时有明确计分规则", "宏/微平均不能混用", "总分不覆盖 blocker"], faultSignal: "`pipeline_components_complete=false` 导致 FAIL",
    practice: ["选一个公开报告填写七段清单", "标出仍未知的协议变量", "说明该分数不能支持哪类企业决定"], completion: ["总分能回链到逐题结果", "harness 与模型能力分开解释", "未知信息不被猜测补齐"],
    sources: ["S36", "S37", "S38", "S40"], boundary: "课程没有复现完整公开榜单，也不对当前模型排名作时效性承诺；只验证流水线合同。", architecture: ["任务定义", "Dataset/Split", "Prompt/Protocol", "Model/Harness", "Scorer", "Aggregation/CI", "Report/Limitations"],
  },
  {
    id: "TD-B02", moduleId: "TD-M06", title: "Benchmark 数据集：Split 与 Sealed Holdout", type: "项目", duration: "65 分钟", prerequisites: ["TD-B01"],
    summary: "从真实任务抽样、标注和去重，建立 representative、challenge、regression 与 sealed holdout 四类数据角色。",
    why: "随机按行切分会让同一事件跨组泄漏；反复查看 Holdout 会把最终验证集磨成开发集。",
    outcomes: ["定义抽样框、纳入排除和风险切片", "组织标注争议与 Dataset Card", "按实体和时间去重并封存 Holdout"], artifact: "Dataset Card、Split Manifest 与 Holdout 访问合同",
    failure: "客服数据 99% 是简单 FAQ，随机采样掩盖少量高风险退款；同一 incident 的改写还跨 train/dev/holdout 出现，导致虚高。",
    mechanism: "代表集回答常见流量，挑战集放大边界与攻击，回归集锁定历史失败，sealed holdout 只用于阶段性最终判断；四者不能用同一访问和调参规则。",
    mechanismBullets: ["先声明目标人群、时间窗和失败成本", "按 incident/entity/time 去重和分组切分", "双人标注并保存 disagreement/adjudication", "Holdout 限权、审计访问和轮换", "泄漏后重建 split 并使旧结果失效"],
    decision: "开发者需要看 development set 的逐题失败，但不应反复看 sealed holdout。发现跨 split 近重复、未授权访问或标签来源不明时停止比较。",
    decisionBullets: ["每条样例保留 provenance/licence/policy version", "高风险切片不只靠自然频率", "历史事故有独立 regression 角色", "Holdout 结论必须绑定 dataset hash"],
    metric: "审计 overlap rate、slice coverage、label agreement、holdout access count 与 temporal freshness；每项都带分母和访问日志。",
    metricBullets: ["overlap 分母是跨 split 样例对", "agreement 不等于 Oracle 正确", "低频高风险单独报告", "泄漏是 blocker，不用扣几分处理"], faultSignal: "`holdout_sealed=false` 导致 FAIL",
    practice: ["将合成样例分为四种数据角色", "按 incident_id 检查跨 split 泄漏", "写出 Holdout 访问与失效政策"], completion: ["数据卡含来源、时间、许可和限制", "同一实体不跨 split 泄漏", "Holdout 与调试面隔离"],
    sources: ["S23", "S37", "S38", "S40"], boundary: "本页只在离线合成 Fixture 中验证 Split 与 Holdout 合同；没有运行真实模型或企业数据集成，也没有完成领域从业者评审、隐私许可审查或 production 验证。", architecture: ["任务与失败池", "采样/去重", "Representative", "Challenge", "Regression", "Sealed Holdout", "访问审计/版本"],
  },
  {
    id: "TD-B03", moduleId: "TD-M06", title: "Benchmark 指标：Accuracy、Pass@k、Resolved Rate 与置信区间", type: "项目", duration: "65 分钟", prerequisites: ["TD-B02"],
    summary: "从逐题记录计算 accuracy、pass@k、resolved rate、Judge score 与置信区间，理解分母和重复采样。",
    why: "多次尝试后的 pass@k 可以很高，同时单次成功率、成本和安全 blocker 很差；一个均值无法表达这些差异。",
    outcomes: ["给常见指标写 Metric Card", "解释 k、重复次数和聚合对结论的影响", "同时报告切片、blocker 与不确定性"], artifact: "Metric Card、逐题 ledger 与区间报告",
    failure: "10 题各跑 5 次，8 题至少成功一次，因此 pass@5 很高；但单次 resolved rate 低、重试成本高且一次越权调用被平均 Judge 分掩盖。",
    mechanism: "指标必须从逐题、逐次 ledger 计算。Accuracy 常针对固定判定，pass@k 描述 k 次中至少一次成功，resolved rate 依赖任务最终 Oracle，Judge score 还依赖校准和版本。",
    mechanismBullets: ["先定义样本单位和成功条件", "超时/拒答/缺失不能静默移出分母", "成对比较保存每题转变", "小样本同时报告区间", "安全 blocker 独立于均值"],
    decision: "只有同一 task/dataset/protocol/scorer 下的指标才可直接比较。区间重叠和样本不足时保留不确定，不输出虚假精确排名。",
    decisionBullets: ["Metric Card 固定公式与分母", "报告 k、重复次数和随机设置", "逐风险切片展示 numerator/denominator", "失败请求成本与质量一起保留"],
    metric: "本页重点不是背公式，而是追溯 numerator、denominator、aggregation、missing policy、CI method 和 decision rule。",
    metricBullets: ["accuracy 与 resolved rate 的 Oracle 可不同", "pass@k 不代表单次可靠性", "Judge score 要有校准证据", "区间表达估计不确定性，不证明业务外推"], faultSignal: "`metric_denominator_declared=false` 导致 FAIL",
    practice: ["手算十题五次的 pass@k", "把一个超时重新放回正确分母", "增加 blocker 并验证均值不能抵消"], completion: ["每个指标有公式、分母和缺失规则", "报告含样本量与区间", "blocker 独立触发失败"],
    sources: ["S36", "S38", "S39", "S40"], boundary: "Fixture 不运行随机模型或 bootstrap；只验证 Metric Card 字段，数字不代表任何模型性能。", architecture: ["逐题多次 Runs", "Raw Ledger", "确定性 Oracle", "Judge/校准", "Metric Calculator", "Slice/Confidence", "Decision Gate"],
  },
  {
    id: "TD-B04", moduleId: "TD-M06", title: "Harness 敏感性与控制变量实验", type: "诊断", duration: "55 分钟", prerequisites: ["TD-B03"],
    summary: "固定模型与数据，单独改变 Prompt、工具、上下文、超时或重试，定位分数对 Harness 的敏感性。",
    why: "Benchmark 测到模型与运行系统的组合；同时改 Prompt、工具和重试会产生无法归因的分数变化。",
    outcomes: ["列出主要 Harness 变量", "设计单变量对照实验", "区分模型能力、工具能力和系统工程贡献"], artifact: "Harness 单变量敏感性与复现实验报告",
    failure: "代码修复任务增加测试执行工具、延长超时并修改 system prompt 后分数上升；团队把三项变化统称为模型变聪明。",
    mechanism: "先锁定 model snapshot、dataset、seed/采样、scorer 和环境；只在 Prompt、tool access、context policy、timeout、retry 中选一个变量；保存逐题转变、调用和成本。",
    mechanismBullets: ["工具提升可能来自额外行动能力", "Prompt 模板改变任务解释", "超时改变缺失/失败分布", "重试提高 pass@k 也提高成本", "Context/检索改变模型实际可见信息"],
    decision: "结论只归因到被改变变量及当前条件。无法重复的变化标 UNKNOWN；多个变量同时变化则报告 CONFOUNDED，不生成能力 winner。",
    decisionBullets: ["每个 run 引用完整 lineage", "保存逐题 flip 而非只看总差", "报告额外工具预算与失败类型", "必要时发布多个受控协议结果"],
    metric: "报告 paired task flips、effect size、variance、tool calls、timeout count 与 cost delta；小差异结合区间和机制解释。",
    metricBullets: ["成对单位是同一任务", "环境差异先排除", "增加预算不是免费提升", "协议适用范围必须可见"], faultSignal: "`single_variable_isolated=false` 导致 FAIL",
    practice: ["选择一个 Harness 变量写 A/B", "列出所有锁定字段", "把混杂实验改成两个顺序实验"], completion: ["一次只改一个主变量", "报告逐题转变和资源变化", "归因不超出实验边界"],
    sources: ["S36", "S37", "S38", "S39"], boundary: "没有运行公开 Benchmark 或真实 Harness；合成合同只证明单变量字段不可缺。", architecture: ["Locked Dataset", "Locked Model", "Protocol Variant A/B", "Harness/Tools", "Raw Runs", "Paired Comparison", "有限归因"],
  },
  {
    id: "TD-B05", moduleId: "TD-M06", title: "Benchmark 污染与不确定性", type: "诊断", duration: "60 分钟", prerequisites: ["TD-B04"],
    summary: "审计样本量、重复运行、置信区间、近重复污染、隐藏测试访问和跨版本可比性。",
    why: "公开题过拟合、小样本波动或 Harness 更新，都可能让 1.5% 的差异失去意义。",
    outcomes: ["识别统计与污染风险", "设计 canary、访问日志和轮换", "把报告分为可信、存疑和不可比较"], artifact: "Benchmark 污染、不确定性与版本审计报告",
    failure: "候选只跑一次就高 1.5%，部分题在训练说明里可直接找到答案，Harness 版本还升级；团队却宣布显著能力提升。",
    mechanism: "污染审计看 exact/near duplicate、公开曝光、调试访问与异常记忆迹象；不确定性审计看样本量、成对变化、重复运行、区间和失败处理；版本审计决定趋势线是否仍合法。",
    mechanismBullets: ["没有污染证据不等于没有污染", "隐藏测试仍可能经人工或日志泄露", "canary 需要限权、审计和轮换", "Harness/task 版本变化可断开趋势线", "污染题单独分析，不用全局平均洗掉"],
    decision: "证据不足时输出 SUSPECT/INCOMPARABLE，而不是精确排名。候选只在污染题提升时拒绝整体提升结论，并用新鲜 sealed canary 复核。",
    decisionBullets: ["保存 access log 与 dataset hash", "报告配对区间和原始失败", "区分污染信号与确定污染", "轮换后重新建立基线"],
    metric: "指标包括 overlap rate、canary exposure、paired delta interval、run variance 与 version compatibility；每项都需限制说明。",
    metricBullets: ["污染检测有假阴性", "小样本区间宽是结论的一部分", "跨版本不可比不能硬拼趋势", "失败动作：隔离题目、重建基线、降低结论"], faultSignal: "`contamination_audit_present=false` 导致 FAIL",
    practice: ["在 Fixture 中标记一个近重复题", "判断一次 1.5% 提升的证据等级", "设计五个 sealed canary 的访问与轮换"], completion: ["报告区分 evidence/inference/unknown", "污染和版本变化不被隐藏", "不确定性进入最终决定"],
    sources: ["S37", "S38", "S40", "S23"], boundary: "课程不能确认闭源模型训练数据，也没有真实隐藏测试基础设施；只演示 fail-closed 审计。", architecture: ["Candidate Results", "Version Compatibility", "Duplicate/Exposure Audit", "Sealed Canary", "Paired Uncertainty", "可信度分类", "Rebaseline/Owner"],
  },
  {
    id: "TD-B06", moduleId: "TD-M06", title: "Benchmark 方法的企业化迁移", type: "项目", duration: "90 分钟", prerequisites: ["TD-B05", "TD-T22"],
    summary: "借鉴 HELM、SWE-bench、AgentBench 的任务、协议和报告思想，建立企业内部风险基准。",
    why: "公共分数帮助理解通用能力，却不覆盖企业政策引用、租户隔离、退款权限、中文长对话和维护责任。",
    outcomes: ["选择可迁移的公共 Benchmark 组件", "从业务任务和事故建立内部协议", "定义版本、访问、轮换、争议与废弃政策"], artifact: "企业内部 Benchmark 最小仓库与治理卡",
    failure: "团队把公开题翻译成中文就当客服发布基准；题目没有企业 Oracle、权限边界、流量切片或事故回归，分数无法支持真实放行。",
    mechanism: "迁移的是结构，不是榜单结论：用公共任务卡和可复现协议组织内部 representative/challenge/regression/hidden 数据；Scorer 加入业务规则、权限、引用和人工校准。",
    mechanismBullets: ["从业务 decision 与 failure cost 开始", "公共任务只作外部 sanity，不作内部 Oracle", "历史事故转为独立 regression", "租户/权限/副作用是确定性 blocker", "维护 owner 负责版本、争议和 retire"],
    decision: "企业 Benchmark 必须连接一个真实发布问题和具名 owner；未具备领域数据、权限或人工标注时保持设计/Fixture 状态。",
    decisionBullets: ["每个 task 声明来源和数据角色", "两个候选使用同一受控 adapter", "报告逐任务与风险切片", "发布 Gate、waiver、rollback 另有治理合同"],
    metric: "最小报告同时包含 task coverage、blocker、risk-slice quality、latency/cost、uncertainty 与 maintenance freshness。",
    metricBullets: ["覆盖率针对业务风险目录", "事故 regression 一票否决", "公共/内部结果分栏", "过期政策版本触发失效"], faultSignal: "`enterprise_oracle_linked=false` 导致 FAIL",
    practice: ["把一个公共 task 结构映射到退款风险", "添加租户隔离 blocker", "写出维护 owner 与废弃政策"], completion: ["内部任务来自业务而非翻译题", "Oracle 与权限 owner 明确", "仓库能复现 0→1→0"],
    sources: ["S37", "S38", "S39", "S40"], boundary: "内部 Benchmark 为合成教学仓库；没有真实企业数据、标注团队、模型或发布连接。", architecture: ["公共方法参考", "业务风险目录", "内部四类 Dataset", "Candidate Adapters", "Composite Scorer", "Versioned Report", "Maintenance/Release Owner"],
  },
  {
    id: "TD-T25", moduleId: "TD-M07", title: "Capstone：AI Quality Fixture Release Candidate", type: "项目", duration: "210 分钟", prerequisites: ["TD-T12", "TD-T17", "TD-T20", "TD-T24", "TD-B06"],
    summary: "消费 PRD、风险、Trace、Dataset、Prompt、Scorer、CI、性能、Waiver 与回滚工件，完成端到端质量仓库。",
    why: "会用零散工具不等于能交付职业方案；Capstone 必须让坏版本安全失败、定位、修复并保留全链证据。",
    outcomes: ["组装完整 AI 质量架构与追踪", "交付可运行 baseline/fault/repair Gate", "用 Evidence/Inference/Unknown 解释风险与剩余缺口"], artifact: "AI Quality Engineering Capstone Fixture Release Candidate",
    failure: "退款 RAG+Agent 同时可能引用过期政策、越权调用工具、在并发下变慢或因 Judge 漂移假绿。只提交文档、聊天截图或最终绿色报告无法证明系统会杀死这些故障。",
    mechanism: "Capstone 以需求/风险为根，将 traceability matrix 连接 Dataset/Split、Prompt/Input/Schema、Composite Oracle、Benchmark protocol、CI、Trace regression、性能成本、Waiver 与 rollback。每条 Gate 都有 owner 和 receipt。",
    mechanismBullets: ["至少覆盖引用、权限、注入、性能与 Trace 失败", "版本 Manifest 是所有报告共同主键", "baseline 先证明入口可用", "fault 至少杀死一个高风险 mutation", "repair 不改 Oracle 并回链到首个红灯"],
    decision: "本交付最多是 fixture release candidate：可以证明仓库工件闭包和离线 mutation sensitivity，不能写 publication、production、live 或 practitioner。任何晋级都需要单独集成、从业者与发布 Gate。",
    decisionBullets: ["完整消费上游工件，不手抄结论", "receipt 区分 FIXTURE 与 NOT_RUN", "所有 unknown 和 waiver 可见", "人工 owner 才能决定下一阶段"],
    metric: "验收看 trace coverage、artifact closure、blocker mutation kill、0→1→0 receipt、hash consistency 与 unknown completeness，而不是一个课程总分。",
    metricBullets: ["每个 requirement/risk 至少一条 test/evidence", "每个公开 artifact 有 owner 与 SHA-256", "ZIP member 与公开文件 hash 相同", "模型/企业/人审未运行明确 NOT_RUN"], faultSignal: "`capstone_trace_complete=false` 导致 FAIL",
    practice: ["按追踪矩阵组装十二页工件", "注入一个权限或 lineage 故障", "核对三阶段 receipt 与 ZIP hash closure"], completion: ["一条命令可重现 0→1→0", "全链工件有 owner/hash/trace", "状态严格停在 fixture release candidate"],
    sources: ["S05", "S23", "S24", "S37", "S38", "S40"], boundary: "Capstone 仅为 PASS-FIXTURE release candidate；模型、真实 RAG/Agent、企业集成、从业者评审、publication 与 production 均 NOT_RUN。", architecture: ["PRD/Risk/Owner", "Dataset/Split/Trace", "Prompt/Input/Schema", "Composite Oracle", "Benchmark/CI", "Performance/Waiver/Rollback", "Fixture RC/Human Gate"],
  },
];

const benchmarkBoundaryIds = new Set(["TD-B01", "TD-B02", "TD-B03", "TD-B05", "TD-B06", "TD-T25"]);
export const benchmarkCapstonePages = specs.map(buildQualityBenchmarkPage).map((page) => ({
  ...page,
  evidenceBoundary: `${page.evidenceBoundary}${benchmarkBoundaryIds.has(page.id) ? " 本页仅 fixture/static；真实 model/provider、enterprise integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN。" : ""}`,
  blocks: composeDeepPage([
    ...page.blocks,
    ...(benchmarkReviewBlocks[page.id] ? [benchmarkReviewBlocks[page.id]] : []),
    ...(benchmarkDiagnosticBlocks[page.id] ? [benchmarkDiagnosticBlocks[page.id]] : []),
    ...(benchmarkWave6Blocks[page.id] ? [benchmarkWave6Blocks[page.id]] : []),
    ...(page.id === "TD-T25" ? [capstoneReleaseReview] : []),
  ], benchmarkDeepBlocks(page.id), qualityPlatformDeepBlocks(page.id)),
}));
