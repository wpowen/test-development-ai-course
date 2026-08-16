# TD-T26 Evidence Synthesis

## Fact

The source document calls for AI-assisted test generation, prompt design, workflow integration, and productivity measures. Testing and evaluation references support a risk-based basis, repeatable checks, independent judgment, regression evidence, and failure injection. They do not support the claim that candidate count, token speed, or a model's self-score equals productivity or quality.

## Cross-source synthesis

Route A preserves the normal test-development chain: requirements basis, risk, method, oracle, implementation, execution, report, and review. Route B injects false productivity: 500 duplicate candidates, AI as its own judge, removed assertions, or a mutation set that is never run. Agreement: the same task and completion definition must be used for baseline and AI candidate; a named reviewer and independent oracle must remain. Adjudication: accept only tests that compile, run, satisfy the oracle, survive mutation checks, and are accepted by a reviewer.

The method is: requirements Basis → risk/method → independent oracle → baseline and AI candidate → compile/run → mutation kill → reviewer → productivity decision. The Prompt/Input/Schema/Eval/Mutation package is versioned and provider-neutral. The runner mutates mutation detection, oracle independence, and accepted count, producing a red fault when volume is mistaken for quality.

## Inference

Mutation is a concrete proxy for detection power in this offline experiment: it asks whether a known defect becomes observable. Time-to-accepted-test, cost-per-kill, duplicate rate, maintenance effort, and unique defect yield are more informative than generated volume, but their causal value still requires real team and production data.

## Unknown

Provider/model quality, team variance, reviewer time, maintenance cost, production defect yield, ROI, and practitioner agreement remain unknown. The course reports only `PASS-FIXTURE` and does not claim a business productivity multiplier.
