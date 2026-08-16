# Evidence synthesis

## Fact

## Cross-source synthesis

这些来源共同支持分层门禁，而不是模型摘要即完成。

官方 Structured Outputs 资料支持“结构约束、拒答与不完整结果需要单独处理”，但不支持把 JSON 形状当作业务正确。ISTQB 的 test basis 与 traceability 词汇支持把需求、风险、测试条件和结果连接起来。OpenAPI 的稳定指针支持接口字段级定位。ISO/IEC/IEEE 29148 的公开资料支持需求信息项应被结构化，但本包没有声称拥有或逐条引用付费标准全文。JSONSchemaBench 支持结构合规和约束覆盖是独立维度。

## Inference

将这些证据组合为一个教学方法：先冻结输入版本与 authority，再抽取 typed claim；缺失信息输出 UNKNOWN，冲突输出 BLOCKED；最后由独立 source/oracle 门禁和人工责任人决定是否进入测试生成。该方法是工程综合，不是任一来源的原文结论。软件测试适配器选择状态/契约/权限/幂等测试，是因为订单取消包含生命周期、接口和副作用风险，而不是因为工具数量更多。

## Unknown

没有真实模型/API run receipt，不能估计抽取准确率、拒答率、延迟或 token 成本；没有企业 Jira/GitLab/支付系统回读，不能推断集成可靠性；没有从业者盲评，不能升级 practitioner-reviewed；合成订单规则不能代表真实组织的 authority policy。以上未知在 manifest、课程页面和 handoff 中保持显式。

本综合还明确区分 source authority 与 capability evidence：供应商资料只能说明模型接口行为，不能替产品 owner 决定业务规则；测试标准说明方法词汇，不能证明某个企业的缺陷率。教学 policy 的优先级有 owner/evidence，冲突则停止。这样才能解释为什么 schema PASS 后仍需要 source、risk、oracle 和 human gate。

## Decision

TD-P02 只声明 `fixture-tested`。可复现证据是 fresh unzip 后 baseline PASS、source mutation BLOCKED、implementation mutation FAIL、repair PASS。任何下游结果都必须携带输入 hash、oracle、case 和 run receipt；不存在“模型输出为空即成功”的降级路径。

## Implications for teaching

学习者先观察一个“看起来合理但不可审计”的摘要，再对照版本化 Requirement Contract。摘要没有稳定 locator，就不能进入 risk test plan；有 locator 但状态未知，也不能伪装成 ACCEPTED；Schema 合规却没有独立 oracle，仍只能停在 PASS_SCHEMA。该拆分让每个失败都可定位：输入 authority 失败属于 BLOCKED，格式失败属于 SCHEMA_INVALID，业务断言不符属于 FAIL，模型拒答属于 REFUSED，输出被截断属于 INCOMPLETE。报告保留这些状态，而不是把所有失败压成红/绿二元。

本包的路线 A/B 不是独立 live 实验：它们是本轮已经保存的研究记录，source-pack 通过 URL、版本日期、opened_status、支持项和限制项表达可审计边界。`example.invalid` 项仅代表内部路线记录，不应被读者当作外部来源。若要升级 source evidence，validation lane 必须重新打开并保存直接 URL、响应、hash 和时间；在此之前，课程页面只写 desk-researched/fixture-tested。这样既能满足教学可运行性，也避免把静态材料或历史报告升级为 practitioner 或 production 证据。
