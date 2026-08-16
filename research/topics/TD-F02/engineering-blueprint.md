# 模型生命周期：一次错误究竟来自哪里: engineering blueprint

## Architecture and data flow

The learner starts with a synthetic case and a versioned topic contract. `run_lab.py` reads `configs/topic-contracts.json`, selects `TD-F02`, produces an observation record, applies either no mutation or the declared mutation, evaluates every exact field, writes a JSON report, and returns exit 0 or 1. The report feeds a human release decision; the script cannot approve the decision. Data flow: `case/manifest → topic contract → candidate observation → deterministic oracle → report/exit code → named owner`. Stop states include missing owner, unsupported source, conflict, NOT_RUN and BLOCKED.

Five meaningful boundaries are visible: source and policy authority; versioned input; AI/model or application candidate; independent deterministic checker; human Gate. The actual fixture bypasses the model boundary and marks model execution `NOT_RUN`. This makes the lab reproducible while preventing an offline success from masquerading as a model result.

## Metrics and decisions

Primary catalog: Manifest 完整率与可重放率. Definition must name field, numerator, denominator, aggregation, risk slice and source point. The synthetic decision rule is exact equality for three contract fields, with a blocker on the injected high-risk field. Unit is a count or proportion over the fixed three checks; aggregation is per topic and per field, never across unrelated topics. Interpretation is limited to mutation detection in this fixture. Threshold method is risk-first: the single deliberate blocker must be detected. Failure action is exit 1, preserve the report and prevent promotion until repair.

The workload contains one known-good baseline, one deliberately faulty observation and one repaired observation. This is enough to prove sensitivity to one specified mutation, not enough to estimate a population rate. A production study would add realistic query slices, temporal sampling, repeated stochastic executions and calibrated uncertainty.

## Baseline failure repair

From `site/public/materials/ai-foundations-eval`, run `python3 scripts/run_lab.py --topic TD-F02 --phase baseline`; expected exit 0 and report `reports/TD-F02/baseline.json`. Then run the fault phase; expected exit 1 and the report must name the mutation derived from `浮动模型别名让同一回归集在两天得到不同结果，却没有任何可比较版本证据。`. Finally run repair; expected exit 0 with the same expected contract. The repair does not relax the Oracle; it restores the observation.

Entry conditions: Python 3, repository files present and synthetic-data boundary accepted. Stop conditions: unknown topic, missing contract, missing required file or mismatched expected exit. Cleanup is optional because reports are versionable evidence. Owner is the learner during the fixture and a named test/business owner in a real release.

Diagnosis order: verify topic ID and manifest; compare the injected field; inspect expected versus actual; confirm the report phase; ensure a red exit was not swallowed; ensure repair kept the same expected values. Misleading fixes include changing the expected value to match the bug, deleting the blocker, or describing a NOT_RUN model as successful.

Security and privacy: only synthetic public records are included. The prompt package declares `provider=none`, restricted authority and stop states. Cost and latency are not measured. Rollback means restoring the last accepted contract/config; it is not a production deployment rollback.

## Ownership and residual risk

Professional decision: 先核对模型、Prompt、数据、工具和运行环境的版本 Manifest；没有 Trace 时不把症状归因给模型。 The learner produces 模型生命周期—测试责任图和版本 Manifest. Human review must confirm policy, risk acceptance and publication language. Residual unknown: 基础模型训练数据、后训练配方及提供方内部发布变更通常不可见。 A real adapter must preserve raw model/retrieval/tool evidence and create a separate integration receipt before any maturity promotion.
