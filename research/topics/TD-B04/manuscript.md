# Harness 敏感性

## Professional problem — 工具、超时和 Prompt 一起变，不能归因为模型

代码任务同时开放测试工具、延长 timeout、增加 retry 并修改 system prompt，分数上升后团队却宣布模型更聪明。Benchmark 的观察来自模型与 Harness 的共同作用；多变量同时变化只能标 CONFOUNDED。本页先锁定 model snapshot、dataset、scorer、环境和采样，再一次只改变一个协议变量。

方法选择“配对单变量敏感性实验”。Prompt 本身是候选变量之一；Eval 保存逐题 flip、工具调用、超时、重试与成本；Mutation 令 single_variable_isolated=false。独立 Oracle 使用同一任务成功条件，不随候选协议改变。

## Runnable action — fault 的 1 否定归因，不否定工具价值

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-B04 --phase baseline
python3 scripts/run_lab.py --topic TD-B04 --phase fault
python3 scripts/run_lab.py --topic TD-B04 --phase repair
~~~

baseline exit 0 表示合成比较隔离了一个变量；fault exit 1 应显示 single_variable_isolated=false，结论只能是无法归因；repair exit 0 说明锁定合同恢复。即使工具确实提高成功率，也要把贡献写成当前协议组合，而非裸模型能力。

## Failure and repair — 逐项核对锁定字段

fault 假绿时做 manifest diff，检查 Prompt、tool access、Context policy、timeout、retry 是否有超过一项变化，并确认 Eval 使用相同 case_id 做配对。repair 仍红时排除环境与 Scorer 漂移。不能把多个变化包成一个“新方案”后声称单因素结论。

迁移到事故摘要时，可以先只改检索 top-k，再单独试工具访问；每轮保留同一模型、数据、Judge 和环境。成功标准是逐题转变与资源变化都能回链到唯一主变量。

选择方法时先问归因目标：若只关心端到端候选优劣，可比较完整受控方案；若要回答某个 Harness 变量的贡献，就必须单变量。两种实验都合法，但不能用前者的数据写后者的因果语言。

### Evidence boundary

当前 PASS-FIXTURE 未运行公开 Harness、模型、工具或真实 A/B。它仅证明单变量字段缺失会 fail-closed，实际 effect size 仍未知。
