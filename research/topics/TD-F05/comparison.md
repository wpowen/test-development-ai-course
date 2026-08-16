# TD-F05 Independent Comparison

## Agreements
来源一致认为评测必须有明确任务、参考或规则、指标定义和失败记录；仅凭生成文本的主观印象不能作为质量证据。

## Disagreements
材料对裁判模型能否独立、是否需要人工双评以及阈值如何设定意见不同。供应商指标常不说明样本构成、分母和反例；研究资料更强调置信区间与偏差。我们保留差异，不把单一分数当通用标准。

## Adjudication
reviewer: evaluation-engineer + test-lead。采用独立 Oracle 优先、人工抽检校准、Metric Card 记录分母。阈值由业务 owner 版本化，冲突进入 `UNKNOWN/BLOCKED`。课程只承诺 fixture 可运行和失败可诊断，不承诺线上模型质量。
reviewer: evaluation-engineer + test-lead。比较记录了独立性、分母、冲突和阈值 owner；所有未解决争议进入 UNKNOWN/BLOCKED。

补充判断：分类任务关注 precision/recall/F1，生成任务需要参考或人工 Oracle，RAG 还要拆检索与生成，Agent 需要步骤、工具和终止条件。不能用一张万能 Metric Card 掩盖任务差异。

两条路线最终一致接受“指标服务决策而非装饰报告”，但对 Judge 的使用范围仍有分歧。裁决是把确定性规则放在第一层，版本化 Judge 仅处理语义层，并保留 abstain 与人工升级。任何阈值都要同时写样本、置信边界、owner 和失败动作。

因此最终工件不是一个分数，而是任务合同、分层 Oracle、Metric Card、mutation 结果和决策 receipt 的组合。它允许 reviewer 重算结论，也允许业务 owner 在不改原始证据的前提下调整门槛；门槛变化必须产生新版本。
