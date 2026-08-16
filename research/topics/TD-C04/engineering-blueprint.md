# TD-C04 Engineering Blueprint: organization adapter

## Architecture and data flow
把岗位能力、组织边界和可用证据分成三层：`role_input` 记录岗位与团队语境，`adapter` 将公共能力映射到组织字段，`evidence` 只接收带来源、日期、owner 的事实。数据流为“用户填写上下文 → 适配器校验字段 → 生成可审阅的责任矩阵 → 人工确认 → 输出 30/60/90 行动”。任何没有来源的制度、晋升阈值或访问权限都写成 `INTERNAL-UNKNOWN`，禁止模型补全。适配器版本必须随组织、岗位、日期变化而递增，旧版本保留以便回溯。

## Metrics and decisions
最小 Metric Card 包含 `metric_id`、定义、分母/分子、采集窗口、证据 URI、owner、阈值状态和决策。对新人采用证据数量、独立复核率、返工率和闭环时间，不把固定 P5-P9 或年限当普遍真理。决策表把结果分为 `ADOPT`、`ADAPT`、`BLOCK` 和 `INTERNAL-UNKNOWN`。

## Baseline failure repair
基线故障是把网上常见职级表直接当作本公司晋升规则，导致错误自评。故障注入删除 owner、日期或来源，Oracle 应拒绝输出确定性的晋升结论，并指出缺口。修复步骤：补充组织上下文，给每条 claim 添加 locator 与版本，运行 schema/eval，再由经理或导师复核。fixture 通过不代表真实组织适用。

## Method, oracle, prompt and eval
方法链为“证据分级 → 适配映射 → Metric Card → 决策门禁”。Oracle 检查未知状态是否保留、组织字段是否可追溯、阈值是否带版本。Prompt 明确要求先列已知/未知，再生成两种适配方案，不得编造公司政策。Eval 覆盖缺 owner、冲突规则和过期版本；mutation 删除来源、替换阈值并改变岗位名称，期望均进入 `BLOCK` 或 `INTERNAL-UNKNOWN`。
## Implementation notes and handoff
实现时先验证 JSON schema，再生成可读表格；不要让页面渲染层修改状态。每个 adapter 变更写 changelog，保留旧版本和迁移原因。组织输入、公共资料和内部政策分目录保存，权限不足时只记录访问请求。人工门由 manager 或 mentor 执行，模型只能提出映射候选。完成条件是字段完整、source locator 可打开、未知状态没有被折叠、fault 能被 Oracle 捕获。输出的责任矩阵必须能被下一次评审直接复用，并清楚显示哪些数字是示例、哪些是组织确认值。若 owner 不可用，流水线停在 BLOCK，不能继续生成 30/60/90 计划。
