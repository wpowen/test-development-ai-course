# 无答案、权限与端到端 RAG Gate

## Wave-3 项目交付

为 known、no-answer、source-conflict、cross-tenant 和 injection 各准备一条脱敏 case，保存 tenant、检索结果、claim、拒答原因、Handoff owner 和 side-effect ledger。Fault 只能改一个合同字段，例如让 ACL 失效；Repair 不能删除攻击样例或降低阈值。真实租户、provider/model、向量库、工具副作用、人工 SLA、安全演练、learner 观察、live、production 和 publication 均为 NOT_RUN。

## Professional problem

### Wave-2 end-to-end RAG gate

项目覆盖 known、no-answer、source-conflict、cross-tenant 和 injection 五类 case。known 要求证据支持，no-answer 要求拒答或 Handoff，跨租户即使答案正确也阻断；每类保存 doc IDs、tenant、policy reason、side-effect ledger 和责任人。真实租户、向量库、模型、工具副作用、人工 SLA 与安全演练均仍为 NOT_RUN。

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-T12`, that statement cannot answer 没有证据、没有权限或来源冲突时，系统如何安全停止并留下可审计证据？ The concrete failure is more useful: 跨租户问题没有正确文档，系统却从其他租户语料拼出一个流畅答案。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is no-answer、拒答、Handoff、tenant ACL、prompt injection、工具副作用和端到端发布 Gate. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 证据不足、来源冲突或权限不明时拒答或转人工；任何未授权读取和副作用独立阻断。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is RAG 端到端 Gate、权限攻击集和人工升级 Runbook.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is 正确拒答率、越权命中数、无副作用率、Handoff 完整率. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-T12 --phase baseline
python3 scripts/run_lab.py --topic TD-T12 --phase fault
python3 scripts/run_lab.py --topic TD-T12 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 跨租户问题没有正确文档，系统却从其他租户语料拼出一个流畅答案。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 真实身份链、租户隔离、策略引擎与人工 SLA 未集成验证。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-T12`.
