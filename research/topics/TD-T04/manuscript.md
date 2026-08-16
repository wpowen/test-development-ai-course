# 重复运行与统计：从一次结果到可解释分布

## Professional problem

### Wave-2 repeatability exercise

配对运行固定模型、Prompt、Context、索引和服务配置，只改变一个变量；保存 run_id、raw output hash 与不可用原因。候选总体均值更高但高风险切片出现越权时仍阻断。学习者交付 run ledger、配对差异表，并说明固定题集描述不能外推任务总体。

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-T04`, that statement cannot answer 概率系统应该运行多少次、报告什么统计量，才能支撑有限而诚实的决定？ The concrete failure is more useful: 候选只运行一次且平均得分略高，就被写成稳定提升；高风险切片的两次失败被均值吞掉。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is 估计目标、重复运行、分母、切片分布、置信区间、配对比较和 blocker 分离. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 先声明要估计固定样例表现还是相似任务总体表现；报告逐条原始结果和不确定性，不发明通用次数。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is 重复运行报告、分布图和发布解释模板.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is 逐切片通过分布、配对差异、区间宽度、blocker 事件数. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-T04 --phase baseline
python3 scripts/run_lab.py --topic TD-T04 --phase fault
python3 scripts/run_lab.py --topic TD-T04 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 候选只运行一次且平均得分略高，就被写成稳定提升；高风险切片的两次失败被均值吞掉。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 教学中的五次运行不构成生产样本量建议，样本量取决于估计目标与错误成本。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-T04`.
