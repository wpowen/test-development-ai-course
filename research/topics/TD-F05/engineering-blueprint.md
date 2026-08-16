# TD-F05 Engineering Blueprint: task-to-oracle Metric Card

## Architecture and data flow
输入是可观察测试任务：目标、输入数据、预期行为、风险和 owner。流程把任务切成 assertion，再选择独立 Oracle（规则、参考答案或裁判模型），最后写入 Metric Card。数据流为 `task → slice → oracle → metric → decision → evidence`；Prompt 只能提出候选断言，不能替代 Oracle。每张卡带 schema、版本、样本窗口和失败处理。

## Metrics and decisions
核心字段包括 pass rate、coverage、false-positive/negative、latency、成本和人工复核率；阈值由业务 owner 设定。决策表区分 `PASS`、`FAIL`、`NOT_RUN`、`BLOCKED` 和 `UNKNOWN`。若 Oracle 与人工结论冲突，记录 disagreement；若分母为空，拒绝计算。

## Baseline failure repair
基线故障是只看模型输出“像不像”，没有可执行断言。故障注入删除预期结果、替换 Oracle 或制造空样本，evaluator 应拒绝并返回 exit code 1。修复为补齐输入/预期/Oracle、固定 prompt 版本、重跑 eval 和 mutation，并保存 diff。fixture 通过只证明卡片链路可运行。

## Method, oracle, prompt and eval
方法链为“任务分片 → 独立 Oracle → Metric Card → 反例 mutation”。Oracle 与生成器解耦；Prompt 输出结构化 JSON 与证据定位。Eval 检查 schema、覆盖率和冲突记录；mutation 改写边界输入、删除关键字段、反转期望，结果应为可识别的 FAIL 或 BLOCK。
## Implementation notes and handoff
先冻结任务和样本，再编写 schema；评测脚本必须把分母为空、Oracle 缺失和冲突分别编码。生成器与 Oracle 使用不同输入通道，避免同一提示词自证。每次运行保存 prompt、eval、mutation 版本和 evidence URI。人工复核只校准 Oracle，不覆盖原始结果。若业务 owner 尚未确认阈值，Metric Card 只能输出描述性统计并标记 UNKNOWN。该链路可迁移到分类、摘要、RAG、Agent，但每个任务都要重新定义预期行为和失败成本。

实现层将每一次决策写成不可变 receipt：任务版本、样本切片、指标公式、分母、阈值 owner、失败动作和代码版本缺一不可。分类任务的混淆矩阵、RAG 的检索与生成指标、Agent 的步骤和副作用指标分别落在独立卡片中，再由发布决策汇总，禁止用单一总分覆盖局部高风险失败。
