# 检索评测：召回、排序与查询切片

## Professional problem

### Wave-2 retrieval diagnosis

每条查询保存原始 query、rewrite、filters、candidate doc IDs、scores、索引版本与 top-k。gold 不在候选先查语料、chunk、embedding、rewrite 或 ACL；gold 在候选但位次低才查 ranking；Context 正确而答案错才进入生成层。迁移阈值必须由漏检成本、Context 预算和人工升级能力决定，争议标注不能静默改写。

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-T10`, that statement cannot answer 怎样把检索失败与生成失败分开，并用查询切片判断 recall 与 ranking？ The concrete failure is more useful: 模型凭参数记忆回答正确，但检索完全漏掉最新政策；上线后政策更新即失效。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is gold document、top-k、recall、precision、MRR、过滤条件、query reformulation 和难例切片. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 先确认相关文档是否进入候选集，再评价排序；最终回答正确不能替代检索层证据。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is 检索 query set、gold document 映射和失败诊断报告.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is Recall@k、Precision@k、MRR 与逐查询 miss reason. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-T10 --phase baseline
python3 scripts/run_lab.py --topic TD-T10 --phase fault
python3 scripts/run_lab.py --topic TD-T10 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 模型凭参数记忆回答正确，但检索完全漏掉最新政策；上线后政策更新即失效。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 没有运行真实 embedding、向量库、reranker 或线上查询分布。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-T10`.
