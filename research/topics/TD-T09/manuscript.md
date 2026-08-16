# RAG 语料治理：来源、版本、分块与权限

## Professional problem

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-T09`, that statement cannot answer 进入索引前，怎样证明语料是当前、可引用、可授权和可撤销的？ The concrete failure is more useful: 旧退款政策和新政策同时被分块，召回系统返回语义更相似的旧文档。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is source document、chunk、metadata、effective date、ACL、索引版本和删除传播. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 每个 chunk 保留 source_id、版本、生效期和 ACL；冲突或过期来源不得静默进入当前索引。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is RAG corpus manifest、chunk schema 和索引准入报告.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is 来源覆盖、过期 chunk 数、ACL 保留率、删除传播延迟. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-T09 --phase baseline
python3 scripts/run_lab.py --topic TD-T09 --phase fault
python3 scripts/run_lab.py --topic TD-T09 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 旧退款政策和新政策同时被分块，召回系统返回语义更相似的旧文档。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 真实文档系统的 ACL、删除 SLA、OCR 和分块质量尚未连接。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-T09`.
