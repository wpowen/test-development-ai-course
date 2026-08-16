# Reliability, performance and Agent load architecture

Boundary: deterministic retry-storm and load fixtures. Real providers, GPUs, queues, model endpoints, alerting, On-call, disaster recovery and cost accounts are `NOT_RUN`.

## Context
```mermaid
flowchart LR
  Load[Workload generator] --> Agent[Agent service]
  Agent --> Model[Model provider]
  Agent --> Tools[Tool dependencies]
  Agent --> Queue[Queue/state store]
  Agent --> OTel[Telemetry backend]
  SRE[On-call owner] --> Gate[SLO gate]
  OTel --> Gate
```

## Building block
```mermaid
flowchart LR
  Workload[Workload model] --> Injector[Load/fault injector]
  Injector --> Runtime[Agent runtime]
  Runtime --> Collector[Trace/metric collector]
  Collector --> Slice[Risk slice aggregator]
  Slice --> Budget[SLO/cost budget]
  Budget --> Runbook[Runbook decision]
```

## Runtime
```mermaid
sequenceDiagram
  participant L as LoadGenerator
  participant A as Agent
  participant D as Dependency
  participant G as SLOGate
  participant H as Human
  L->>A: open/closed-loop requests
  A->>D: model and tool calls
  alt timeout and retry storm
    D-->>A: timeout
    A-->>G: retries, queue, cost spike
    G-->>H: freeze/degrade recommendation
  else within budget
    A-->>G: task success + latency slices
  end
```

## Deployment
```mermaid
flowchart TB
  Fixture[Local simulator] --> Reports[Local reports]
  LoadCI[Load runner - NOT_RUN] --> Staging[Staging Agent - NOT_RUN]
  Staging --> Provider[Provider/GPU - NOT_RUN]
  Staging --> Queue[Queue - NOT_RUN]
  Staging --> OTel[Telemetry - NOT_RUN]
  OTel --> Alert[Alert manager - NOT_RUN]
```

## Data flow
```mermaid
flowchart LR
  Workload --> RequestTrace
  RequestTrace --> PhaseLatency
  RequestTrace --> ToolCount
  RequestTrace --> TokenCost
  PhaseLatency --> Distribution
  ToolCount --> Distribution
  TokenCost --> Distribution
  Distribution --> SLODecision
```

## Security and trust boundary
```mermaid
flowchart LR
  Synthetic[Approved synthetic workload] --> Injector
  Injector --> TestEnv[Isolated environment]
  TestEnv --> ToolPolicy[Tool allowlist]
  ToolPolicy --> SideEffect[Privileged side effect]
  SideEffect --> Human[Human approval]
  TestEnv --> Audit[Trace and cost audit]
  Production[Production] -. prohibited .-> Injector
```

Failure path: overload, retry amplification, queue saturation, quality regression or missing telemetry blocks capacity claims. Decisions supported: phase- and risk-sliced metrics rather than averages, and a freeze/degrade/rollback human gate.
