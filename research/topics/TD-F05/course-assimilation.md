# TD-F05｜AI 任务族与指标选择

## Source

Primary user source: `/Users/owen/Downloads/AI测试工程师发展.md` (`DOC-CAREER`, read 2026-08-12). Relevant atoms include AI task families, functional/quality/performance/security/robustness dimensions and common metrics.

## Disposition

- **Incorporated**: classification, generation, RAG and Agent distinctions; F1/Recall@k/ROUGE/QPS/latency are treated as task-dependent signals.
- **Adapted**: every metric is a Metric Card with population, denominator, slices, Oracle, uncertainty, owner and failure action.
- **Blocked**: production thresholds and business KPIs without a real system owner and denominator.

## Evidence / Inference / Unknown

- Evidence: source lists broad quality dimensions and metric examples.
- Inference: a decision-oriented Metric Card is the smallest beginner-reusable form.
- Unknown: actual business loss function and release threshold.

## Reusable artifact

`task-metric-card.yaml`; run the TD-F05 cycle to prove denominator/Oracle mutations go red.
