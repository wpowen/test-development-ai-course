# TD-T05 工程蓝图

## Architecture and data flow
输入层接收四个版本化对象：需求基线、设计/政策基线、独立 Oracle 注册表、代码 diff。冻结器为每个文件计算哈希并记录 commit、版本和 owner；解析器只提取明确存在的 requirement ID、规则句、文件状态、hunk 和符号，不对业务含义做补全。上下文构建器按允许列表组合输入，提示包 `v1.0.0` 要求生成器输出风险候选 JSON。输出经过 schema 校验、引用存在性校验、Oracle allowlist 校验和 owner 路由；任何缺失或冲突进入隔离队列。业务评审者可以接受、拒绝或请求证据，但不能修改原始输入。最终被接受的风险条目保留 prompt、input、schema、eval、mutation 与模型配置版本。

数据流为：`frozen basis -> typed claims -> diff hunks -> candidate generator -> structural gate -> independent oracle gate -> human owner decision -> test-design backlog`。静态分析或依赖图只能以新的 evidence lane 附加，不能覆盖原 basis。原始 diff 与解析结果都保留哈希，使后续能区分“输入变化”“解析错误”和“模型连接错误”。若模型拒答、输出截断或 schema 不合法，系统应停止而非自动重试到看似合理的结果。

## Metrics and decisions
首要安全指标是 unsupported accepted count，目标为 0；随后是 citation completeness、invalid oracle reference count、conflict preservation rate、owner coverage 与人工撤销率。召回率只有在存在独立、盲审的金标准风险集时才可计算；不能用生成器自己的列表充当分母。风险分值必须由明确损失函数支持，否则不展示精确小数。门禁决策表：四类引用完整且 Oracle 在 allowlist 中，进入 `CANDIDATE_FOR_REVIEW`；字段缺失、Oracle 非法或来源冲突，进入 `BLOCKED/UNKNOWN`；只有 owner 才能变为 accepted。

评估集覆盖正常输入、边界、冲突、缺失、越权、拒答、截断与同义改写。mutation 包故意删除 diff 引用、替换 Oracle 或注入不存在的 SLA，验证门禁是否杀死错误。模型能力证据与确定性门禁证据分开：当前仅运行后者，`model_evidence=NOT_RUN`。任何报告必须同时记录 basis hash 和 oracle hash，防止用更新后的规则解释旧输出。

## Baseline failure repair
Baseline 命令在合成 basis 上生成两条完整候选，退出码 0，报告状态 PASS。Fault 命令删除审计风险的 `diff_ref`，再加入 `R-INVENTED-SLA`，其 requirement 为 UNKNOWN、Oracle 不在冻结注册表；门禁应返回退出码 2 和 `STOP_AND_REVIEW`。如果 fault 返回 0，说明系统存在静默接受缺证据的严重缺陷。

Repair 不是让模型“润色”字段，而是回到权威输入：恢复真实 diff 引用、删除虚构 SLA，重新冻结并验证哈希；命令应回到退出码 0。报告只证明 Python 标准库 runner 在本地 fixture 上重现了故障和修复。真实 PR 接入、真实模型输出、仓库级覆盖、凭据隔离、性能和从业者判断均未运行，进入下一门禁前必须保留为 Unknown。
