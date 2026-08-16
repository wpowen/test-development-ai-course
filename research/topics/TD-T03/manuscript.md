# Composite Oracle：规则、语义 Judge 与人工如何组合

## Professional problem

### Wave-2 oracle selection

“未验证身份却调用退款工具”是权限 blocker，即使 Schema 和语义 Judge 都通过也必须失败；语气自然度才适合连续分数。学习者保存双人工分歧、Judge rubric 版本和升级决定。没有领域双标时写 UNKNOWN，不能把 Judge 自信当校准证据。

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-T03`, that statement cannot answer 怎样组合确定性规则、语义评分与人工复核，避免 Judge 自证和平均分掩盖 blocker？ The concrete failure is more useful: 同一个模型生成答案又评价自己的权限合规性，并用高语义总分覆盖越权工具调用。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is Schema、业务不变量、权限、引用、语义 rubric、Judge 校准和人工升级. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 先执行独立确定性 blocker，再执行语义评分；高风险分歧由具名业务或安全 owner 决定。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is 风险—Oracle 决策表和分歧升级记录.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is blocker 数、Oracle 独立率、人机分歧率与升级关闭率. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-T03 --phase baseline
python3 scripts/run_lab.py --topic TD-T03 --phase fault
python3 scripts/run_lab.py --topic TD-T03 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 同一个模型生成答案又评价自己的权限合规性，并用高语义总分覆盖越权工具调用。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 模型 Judge 在目标领域的偏差、位置效应和一致性尚未用人工双标集校准。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-T03`.
