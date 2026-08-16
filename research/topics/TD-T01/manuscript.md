# Eval Contract：先写发布问题，再选指标

## Professional problem

### Wave-2 decision-first exercise

以“是否允许客服助手进入 10% Canary”为唯一决策，先写允许/拒绝表，再倒推切片、黄金集、Oracle、阈值依据和 waiver owner。需求方确认业务后果，测试方确认数据和执行可行性；意见不一致保留 SOURCE_CONFLICT。指标不能脱离失败动作，任何 blocker 都必须独立阻断。

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-T01`, that statement cannot answer 一个能决定发布的 Eval Contract 必须固定哪些字段和停止状态？ The concrete failure is more useful: 团队先选择一个流行指标，再用平均分替代高风险退款行为的发布决定。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is system-under-test、风险、数据、Oracle、阈值、owner、版本与 stop state. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 任何分数都必须回答测谁、测什么风险、谁批准和失败后做什么；owner 或阈值依据缺失即阻断。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is 版本化 Eval Contract 和决策表.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is 合同字段完整率、阻断规则覆盖率、决策 owner 覆盖率. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-T01 --phase baseline
python3 scripts/run_lab.py --topic TD-T01 --phase fault
python3 scripts/run_lab.py --topic TD-T01 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 团队先选择一个流行指标，再用平均分替代高风险退款行为的发布决定。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 真实业务的错误成本、发布阈值和风险接受人只能由目标组织确认。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-T01`.
