# TD-C03 Engineering Blueprint

## Architecture and data flow

The workflow is `current evidence -> capability claim -> evidence-ref check -> maturity boundary -> gap route -> 30-day artifact -> 60-day fault evidence -> 90-day review -> boundary statement`. The fixture observation deliberately separates evidence references, preserved unknowns, and a 30/60/90 plan. The Prompt package can draft a candidate self-assessment but cannot invent a reviewer, claim an outcome, or convert an empty reference into PASS. The runner compares exact fields and writes hashes and evidence levels.

The learner starts with a traditional testing baseline, then routes gaps to AI task literacy, metric design, RAG/Agent evaluation, automation, reliability, or governance practice. Every route ends in an artifact: responsibility map, Metric Card, seeded fault receipt, or reviewer record. The route is adaptable; the dates are not a promotion contract.

## Metrics and decisions

The page measures evidence-ref completeness, preservation of UNKNOWN, presence of 30/60/90 milestones, gap-route completeness, artifact path, reviewer, and review date. A PASS says only that the fixture contract is complete. A missing reference or a plan with no artifact is a blocker. The learner and reviewer decide whether to narrow scope, add practice, repeat a fault, or keep the claim unknown.

## Baseline failure repair

Baseline loads TD-C03's approved observation and exits 0. Fault removes evidence references, erases unknown preservation, and removes the 30/60/90 plan; the independent oracle exits 1. Repair restores the observation and exits 0:

```bash
cd site/public/materials/career-evolution
python3 scripts/career_evolution_lab.py --manifest manifests/TD-C03.json --mode cycle
```

Do not edit expected values, turn an empty evidence list into PASS, or let a model promise a job or promotion. The cycle is `0/1/0` fixture evidence only.
