# TD-T26 Research Brief

## Controlling question

Does AI-generated test content improve accepted detection power and time-to-accepted-test compared with a same-task baseline, or does it only increase candidate count? The source document calls for AI-assisted test generation, prompt rules, workflow integration, and productivity measures. This topic makes the claim falsifiable with an independent oracle, seeded mutations, review receipts, time, cost, and defect yield.

The scope includes requirements basis, risk selection, Prompt/Input/Schema/Eval/Mutation, baseline/control, candidate generation, compile/run, accepted tests, mutation kill, reviewer, cost, and maintenance caveats. It excludes real team ROI, model/provider quality, production defect savings, or employment claims. AI is a candidate generator only; it cannot judge its own correctness or approve a waiver.

## Evidence / Inference / Unknown

Evidence: testing and evaluation guidance supports regression checks, risk-based oracles, and repeatable evidence. Inference: mutation is a small, concrete test of detection power against batch hallucination. Unknown: provider cost, team variance, long-term maintenance, and production defect yield.

## Learner decision

The learner must compare accepted tests and mutation kills, not generated volume, then run TD-T26 baseline/fault/repair. If the AI self-judges or the mutation stays green, the productivity claim is blocked.
