# TD-C02 Engineering Blueprint

## Architecture and data flow

The executable path is `task -> responsibility state -> decision rights -> failure cost -> reusable artifact -> seeded fault -> independent reviewer -> escalation or reevaluation`. The input fixture contains the approved observation; the page manifest declares exact expected fields, the fault patch, unknowns, and evidence boundary. The Prompt package is provider-neutral (`provider=none`, `model_execution=NOT_RUN`) and may draft a responsibility map but cannot infer a title or approve a release. The runner writes baseline, fault, repair, and cycle JSON with input and manifest hashes.

The four public states are guided execution, independent scoped ownership, system/cross-team leverage, and strategy/governance/mentoring. They are not employer bands. A state is only as strong as its observable decision, artifact, failure cost, reviewer, and evidence references.

## Metrics and decisions

The page measures responsibility-state field completeness, decision-right completeness, evidence-reference completeness, artifact/reviewer coverage, and whether `years_only=false`. A PASS means the fixture observation meets the exact contract; it does not score a human. A missing reference, missing reviewer, or years-only claim blocks. The named decision owner must decide whether to widen scope, keep the state, escalate, or schedule a reevaluation.

## Baseline failure repair

Baseline loads TD-C02's known-good observation and exits 0. Fault flips `career.evidence_refs_complete=false` and `career.years_only=true`; the independent exact-field oracle must report FAIL and exit 1. Repair restores the approved observation and exits 0. Run:

```bash
cd site/public/materials/career-evolution
python3 scripts/career_evolution_lab.py --manifest manifests/TD-C02.json --mode cycle
```

Do not edit expected values to accommodate a fault, remove the evidence check, or let the candidate model judge itself. The output remains `PASS-FIXTURE`.
