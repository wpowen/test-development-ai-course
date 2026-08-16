# TD-C03 Manuscript

Wave3 learner expansion: self-assessment claims, evidence_ref routing, 30/60/90 portfolio experiments, and explicit unrun boundaries are represented in the source module.

Wave4 sync: the source adds a claim-level self-assessment case, UNKNOWN gap routing, 30/60/90 evidence snapshots, reviewer disagreement handling, and a reusable learner handoff checklist.

Wave5 sync: added claim-level worked decisions, evidence-chain diagnosis, staged 30/60/90 project routing, reviewer-only replay, and organization-bound migration artifacts.

Wave6 sync: added guided/project claim decisions, evidence-chain fault diagnosis, stop/rollback/escalate branches, and migration-ready review ledgers.

## Professional problem

“I want to learn AI testing” is not a plan. A professional self-assessment must say what is already evidenced, what remains unknown, which gap matters, what artifact will close it, and who will review it. The career source supplies a broad learning route but cannot know a learner's baseline, time, mentor, or employer.

## Runnable action

Open `fixtures/TD-C03-input.json` and fill claims, evidence references, gap routes, next artifacts, reviewers, and review dates. Then run:

```bash
cd site/public/materials/career-evolution
python3 scripts/career_evolution_lab.py --manifest manifests/TD-C03.json --mode cycle
```

The method is evidence-bound self-assessment. Prompt output follows the schema; Eval checks unknown preservation; Mutation removes evidence, unknown, and plan fields. AI is a drafting assistant, not a learning assessor.

## Failure and repair

The fault turns empty evidence into a false PASS by removing references, unknowns, and the staged plan. It must exit 1. Repair restores the approved observation and exits 0. Never add a job guarantee, promotion guarantee, or certificate claim to make the route persuasive.

## Transfer and handoff

For a developer background, route the same contract through API/automation and AI quality gates; for a zero-background learner, route through Python/test foundations first. Keep the invariant—evidence, reviewer, artifact, and boundary—but change the practice, data, and next page. Handoff includes JSON, 90-day plan, cycle receipt, and unresolved unknowns.
