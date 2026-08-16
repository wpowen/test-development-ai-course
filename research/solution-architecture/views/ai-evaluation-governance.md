# AI system evaluation and governance architecture

Boundary: curriculum and design evidence. Real model/provider calls, production data, calibrated judges, red-team approval, continuous evaluation and deprecation operations are `NOT_RUN`.

## Context
```mermaid
flowchart LR
  Product[AI product owner] --> Eval[Evaluation system]
  Model[Model/provider] --> Eval
  RAG[RAG/agent/workflow] --> Eval
  Eval --> QE[AI quality engineer]
  Eval --> Gov[Governance owner]
  Gov --> Release[Release decision]
  Users --> Feedback[Production feedback]
  Feedback -. NOT_RUN .-> Eval
```

## Building block
```mermaid
flowchart LR
  Dataset[Versioned dataset/card] --> Harness[Eval harness]
  Versions[Model/prompt/RAG/tool versions] --> Harness
  Harness --> Rules[Deterministic checks]
  Harness --> Judge[Calibrated judge]
  Rules --> Aggregate[Slice/statistical aggregation]
  Judge --> Aggregate
  Aggregate --> Gate[Quality gate]
  Gate --> Ledger[Experiment ledger]
```

## Runtime
```mermaid
sequenceDiagram
  participant O as Owner
  participant H as Harness
  participant J as Judge
  participant G as Gate
  participant R as Reviewer
  O->>H: candidate versions + frozen dataset
  H->>J: rubric-scoped samples
  J-->>H: score + rationale + uncertainty
  H->>G: deterministic and slice results
  alt blocker or judge disagreement
    G-->>R: FAIL/UNKNOWN and escalation
  else gates pass
    G-->>R: candidate recommendation
  end
```

## Deployment
```mermaid
flowchart TB
  Local[Local deterministic fixture] --> Ledger[Local experiment ledger]
  EvalCI[Evaluation CI - NOT_RUN] --> Provider[Model provider - NOT_RUN]
  EvalCI --> RAGX[RAG/Agent staging - NOT_RUN]
  EvalCI --> SecureData[Controlled eval data - NOT_RUN]
  EvalCI --> Telemetry[Trace store - NOT_RUN]
  Telemetry --> Dashboard[Governance dashboard - NOT_RUN]
```

## Data flow
```mermaid
flowchart LR
  Raw[Approved examples] --> Card[Dataset card]
  Card --> Split[Train/dev/holdout split]
  Split --> Run[Versioned eval run]
  Run --> Scores[Per-slice scores]
  Run --> Traces[Outputs/citations/tools]
  Scores --> Decision
  Traces --> Decision
  Feedback[Production failures - NOT_RUN] -. lineage .-> Raw
```

## Security and trust boundary
```mermaid
flowchart LR
  Data[Sensitive eval data] --> Classify[Classification/minimization]
  Classify --> Sandbox[Eval sandbox]
  Provider[External provider] --> Contract[Data-use contract - NOT_RUN]
  Sandbox --> Tools[Tool allowlist]
  Tools --> SideEffect[Privileged action]
  SideEffect --> Human[Human authority]
  Sandbox --> Audit[Prompt/output audit]
```

Failure path: dataset leakage, contamination, missing lineage, unsafe tool call, uncalibrated judge, statistically ambiguous change or missing human approval blocks promotion. Decisions supported: combined deterministic/human-calibrated oracles and versioned evaluation before release.
