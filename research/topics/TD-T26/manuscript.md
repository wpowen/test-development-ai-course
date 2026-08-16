# TD-T26 Manuscript: 证明 AI 生成用例是否真的提效

Wave3 learner expansion: productivity experiment evidence, baseline/fault/repair portfolio receipt, reviewer acceptance, transfer conditions, and NOT_RUN limits are represented in the source module.

Wave4 sync: the source adds a fixed baseline-versus-AI case, positive/negative mutation set, independent Oracle repair loop, cost-per-kill decision card, and reusable manifest editable fields.

Wave5 sync: added a baseline/control worked decision, mutation-layer diagnosis, fixed experiment discipline, accepted-test/cost decision card, and framework-transfer checklist.

Wave6 sync: added accepted-test layer decisions, mutation diagnosis, pilot-entry branches, and framework-specific migration artifacts.

## 你要解决的专业问题
生成更多用例不代表测试更快或更好。若漏掉边界、产生重复、增加人工修订，团队反而变慢。你要用对照实验同时测质量和工时，回答是否提效。

## 跟做：建立可重复实验
运行 `python3 scripts/career_evolution_lab.py --manifest manifests/TD-T26.json --mode baseline`。冻结同一需求和基线用例，登记 prompt、模型/工具版本与抽样规则；让 AI 生成候选，再由同一 Oracle 检查断言、边界和可执行性。记录人工修改分钟数，填写质量/效率 Metric Card，最后跑 mutation。

## 失败与修复
fault 模式会插入重复用例或破坏边界断言，必须非零退出。修复时不删坏样本；补齐对照组、需求 locator 和 reviewer，重跑 eval，并比较 before/after。若没有真实成本或样本不足，状态是 `NOT_RUN`，不能宣称 ROI。

## 可复用工件
实验登记表、版本化 Prompt、用例 schema、Oracle、mutation 清单和比较报告可复制到 API、UI 或 Agent 测试。结论写明样本、版本和窗口；fixture-tested 只证明实验流程。
## 检查清单
检查需求是否冻结、prompt 是否有版本、基线与 AI 组是否同任务、Oracle 是否独立、重复和边界是否有 mutation、编辑分钟是否真实记录、质量门是否先于速度门。报告必须同时给出样本范围、失败例子和不确定性。没有团队成本或缺陷数据时，写“实验未证明 ROI”，不要写“提效已验证”。

## 小练习
把“生成 500 条用例”改写成三个可检验假设：覆盖率不下降、人工编辑时间下降、变异缺陷发现率不下降。为每个假设指定 metric、Oracle、阈值 owner 和 BLOCK 条件。

最后把其中一个边界条件从需求中删除，再运行 mutation。若 AI 组的用例数量仍增加但 mutation 存活，质量门应先阻断效率结论。Prompt、Eval、样本和人工计时规则都要版本化；更换模型、工具或团队后必须新建实验轮次，不能覆盖旧 receipt。

报告至少展示一个成功样本和一个失败样本，并说明人工为何采纳、修改或拒绝。把总工时拆成需求理解、生成、编辑、执行和诊断，避免只统计模型响应时间。只有质量不劣、mutation 命中、人工总成本下降且 reviewer 认可时，才能在该样本和版本范围内写“观察到提效”。

把该结论交给下一位测试工程师时，同时提供冻结需求、基线用例、AI 候选、修改日志、运行命令和 receipt。对方应能独立重跑并得到同一状态；若只能看到汇总百分比，实验仍不可复用。真实模型或团队数据尚未运行时，页面明确保持 NOT_RUN。
