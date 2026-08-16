# TD-C02 Manuscript

Wave3 learner expansion: responsibility ladder evidence, reviewer-owned fault experiment, transfer conditions, and UNKNOWN/NOT_RUN boundaries are represented in the source module.

Wave4 sync: the source adds a responsibility-state case, decision-rights rubric, organization-specific adapter example, reviewer disagreement drill, and explicit static/fixture/provider/model/integration/practitioner/learner/live/production/publication boundary.

## Professional problem

Many beginners report tools and years but cannot show what risk they owned, which decision they could make, what artifact another person could reuse, or how a reviewer challenged the result. That is the professional problem: a title-shaped claim without a responsibility-shaped evidence trail. The career source's progression idea is useful, but a course must not turn it into an employer promotion verdict.

## Runnable action

Open `fixtures/TD-C02-input.json`, read the Prompt/Input/Schema/Eval/Mutation package, and run:

```bash
cd site/public/materials/career-evolution
python3 scripts/career_evolution_lab.py --manifest manifests/TD-C02.json --mode cycle
```

The method is a four-state responsibility ladder. The exact-field oracle checks state completeness, evidence references, decision rights, and `years_only=false`. The Prompt produces a candidate map only; `model_execution=NOT_RUN` and the named reviewer remain part of the contract.

## Failure and repair

The mutation removes evidence references and turns the observation into a years-only claim. The fault must exit 1 and identify expected versus actual. Repair restores the approved observation and exits 0. Never change expected, delete the oracle, or let the AI self-judge. The cycle proves fixture detection power only.

## Transfer and handoff

Copy the responsibility map to an incident-summary assistant, replace the business risk, owner, failure cost, and evidence refs, and preserve `UNKNOWN` for organization policy. Hand off the JSON, cycle receipt, reviewer, and boundary statement. The next owner decides whether the learner may widen responsibility; no P5–P9, salary, or employment conclusion is generated.
