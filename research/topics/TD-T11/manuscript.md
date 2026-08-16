# Faithfulness 与 Citation：回答是否真的被证据支持

## Wave-4 诊断表

将回答拆成 atomic claims，逐条核对 supporting span、contradicting span、no-evidence 与 citation resolve。引用可打开不等于声明被支持；诊断时读取原始 Context、claim-evidence matrix、scorer 版本和人工分歧，修复后以同一反例重跑。关键 unsupported claim 应独立阻断，不能被非关键句平均稀释。

| 症状/问题 | 疑似层 | 下一步检查 | 修复/重跑 |
|---|---|---|---|
| 引用可打开但声明无依据 | claim-evidence 对齐 | 读取 supporting span 与原始 Context | 删除无依据承诺并重跑 |
| 引用来自旧版政策 | source/version | 比对 document_version、effective_date、supersedes | 隔离旧来源后重建报告 |
| Judge 给高分但人工判错 | rubric/calibration | 检查盲评样本、rubric 版本和分歧矩阵 | 校准 Judge 并复跑反例 |
| 关键声明被非关键句稀释 | aggregation/blocker | 查看 atomic claim 分母和严重度 | 将关键 unsupported claim 独立阻断 |

## Professional problem

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-T11`, that statement cannot answer 如何把回答拆成声明，验证每个关键声明受当前上下文支持且引用可解析？ The concrete failure is more useful: 回答引用了正确文档 ID，却捏造了文档没有的自动退款承诺。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is claim extraction、entailment、citation alignment、source conflict、答案完整性和 unsupported claim. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 关键业务声明必须回链到当前证据；自动 faithfulness 分数只用于筛查，冲突与高风险声明进入人工复核。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is 声明—证据矩阵、Citation 报告和反例集.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is supported-claim ratio、citation precision、冲突数与关键声明 blocker. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-T11 --phase baseline
python3 scripts/run_lab.py --topic TD-T11 --phase fault
python3 scripts/run_lab.py --topic TD-T11 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 回答引用了正确文档 ID，却捏造了文档没有的自动退款承诺。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 自动 scorer 尚未与领域人工校准，也未运行真实生成模型。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-T11`.
