# Token、Context 与非确定性：为什么一次 PASS 不够

## Professional problem

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-F03`, that statement cannot answer 怎样把 Token、Context、解码和非确定性变成可控的测试变量？ The concrete failure is more useful: 只跑一次温度为零的请求后宣称系统稳定，升级推理后端时才暴露尾部失败。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is 上下文预算、位置影响、采样配置、重复运行和单变量实验. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 结构、权限和副作用用确定性 Gate；语义行为保存完整上下文并重复运行，报告分布而非挑选一次结果。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is 推理变量—测试设计矩阵和重复运行计划.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is 每样例运行次数、通过率分布、上下文利用与截断状态. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-F03 --phase baseline
python3 scripts/run_lab.py --topic TD-F03 --phase fault
python3 scripts/run_lab.py --topic TD-F03 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 只跑一次温度为零的请求后宣称系统稳定，升级推理后端时才暴露尾部失败。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 不同硬件、内核、批处理与服务端路由对确定性的影响需要当前环境实测。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-F03`.
