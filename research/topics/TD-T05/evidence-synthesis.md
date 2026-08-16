# TD-T05 证据综合

## Fact
ISTQB CTFL 与高级测试分析师大纲把测试依据分析、风险识别、可追溯性和入口条件置于测试分析工作的核心；它们能证明职业方法需要“依据—风险—测试”的链路，但不能证明任何 AI 工作流准确。Git diff 格式文档定义文件状态、rename、hunk 与行级变化，因此可以把候选风险定位到可复核的变更片段；它不能显示运行时依赖、未修改配置或业务损失。GitHub 的 PR 审查文档把 commits、changed files 和具体行作为审查界面；Copilot PR 教程与 Playwright Test Agents 证明当代工具能总结变化、规划或生成测试文件，但供应商的 responsible-use 文档明确要求人工检查，不能由此推导完整性。OpenAI eval 指南支持版本化数据和显式评价准则；CodeQL 支持对代码数据库运行查询。这些是实现机制，不是需求权威。

O*NET 将需求审阅、风险与缺陷证据列入软件 QA 职责，支持本主题的职业相关性。Google Testing Blog 关于可行动失败的实践文章提醒，证据必须支持诊断与行动，而不是只输出解释流畅的摘要。Ministry of Testing 的实践课程页显示市场上确有从需求到自动化的学习供给，但课程存在不等于效果经过独立验证。

## Cross-source synthesis
跨来源能形成的最小可靠协议是：先冻结 basis 版本和其来源类型，显式区分需求、设计约束、既有 Oracle 与政策；再解析 diff 的文件、状态、hunk 与符号；模型仅将二者连接成风险候选。候选结构必须包含 `risk_id`、`requirement_ref`、`diff_ref`、`oracle_id`、`owner`、置信理由和 `status=CANDIDATE`。schema 门禁能检查字段，却不能判断引用内容的业务正确性，因此还要用独立冻结表验证 Oracle 标识，并由相应 owner 审批。一个生成模型不得同时生成候选和批准自己的 Oracle，否则评价与被评价对象同源，无法发现系统性臆测。

风险排序只能在损失维度被业务明确给出时运行。没有影响、概率、可检测性和合规权重，就保留未排序候选；缺 requirement、diff、oracle 或 owner 时标为 `BLOCKED`，冲突时保留双方版本并标 `UNKNOWN`。diff 是发现入口，不是影响面全集；应把依赖图、静态分析、历史故障和运行遥测作为可选补充证据，并分别记录版本。这样可以避免把代码行数、模型置信度或摘要长度误作风险。

课程 fixture 用两个已批准需求与 Oracle 演示闭环：baseline 输出两条带完整引用的候选；fault 移除一条 diff 引用并添加不存在的 SLA，独立门禁返回退出码 2；repair 恢复引用并删除虚构规则后再次通过。这证明门禁逻辑可执行，不证明真实仓库召回率或模型质量。

## Unknown
真实组织的 source precedence、跨服务依赖图、历史事故分布、风险接受阈值与 owner 边界未知。真实模型在长上下文、截断、文件重命名、生成代码和多语言仓库上的准确率未运行；fixture 未测试凭据、隐私和恶意 diff。课程未获得从业者签字，也没有生产基线、A/B 结果或发布回读。因此目前只能标记 `fixture-tested`，不能标记 live、practitioner 或完整生产方案。
