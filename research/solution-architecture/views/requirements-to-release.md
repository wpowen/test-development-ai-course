# Requirements-to-release evidence architecture

Boundary: synthetic requirements, designs, contracts and local deterministic checks. Jira, Confluence, Git, CI and production release systems are external and `NOT_RUN`. The evidence points are the frozen basis, authority policy, requirement contract, test package, red/green reports and human release gate.

## Context

```mermaid
flowchart LR
  PO[Product owner] --> DOC[PRD / technical design / OpenAPI]
  DOC --> SYS[Evidence transformation boundary]
  SYS --> QE[Test lead]
  SYS --> CI[External CI - NOT_RUN]
  QE --> HG[Human release gate]
  SYS -. sensitive data .-> TB[Trust boundary]
```

## Building block

```mermaid
flowchart LR
  B[Basis gate] --> A[Authority resolver]
  A --> C[Requirement contract]
  C --> R[Risk and method selector]
  R --> T[Test-package compiler]
  T --> E[Deterministic evaluator]
  E --> V[Evidence vault]
  V --> H[Human decision]
```

## Runtime

```mermaid
sequenceDiagram
  participant O as Owner
  participant B as BasisGate
  participant C as ContractGate
  participant E as Evaluator
  participant H as HumanGate
  O->>B: submit versioned sources
  alt conflict or missing authority
    B-->>H: BLOCKED with source refs
  else accepted basis
    B->>C: typed claims
    C->>E: tests and oracle refs
    E-->>H: PASS or FAIL receipt
  end
```

## Deployment

```mermaid
flowchart TB
  DEV[Local learner workspace] --> PY[Python 3.9+ fixture runner]
  PY --> FS[Versioned local files]
  PY --> REP[Local reports]
  EXT[Model / Jira / GitLab / CI]:::unknown
  PY -. adapter NOT_RUN .-> EXT
  REP --> REVIEW[Reviewer workstation]
  classDef unknown stroke-dasharray: 5 5
```

## Data flow

```mermaid
flowchart LR
  RAW[PRD / design / OpenAPI] -->|hash + source_ref| BASIS[Frozen basis]
  BASIS --> CLAIM[Typed claims]
  CLAIM --> RISK[Risk and method]
  RISK --> CASE[Test cases]
  CASE --> RESULT[Observed results]
  RESULT --> RECEIPT[Immutable receipt]
  RECEIPT --> DECISION[Human decision]
```

## Security and trust boundary

```mermaid
flowchart LR
  U[Untrusted document] --> S[Sanitization and classification]
  S --> M[Read-only model boundary - NOT_RUN]
  S --> D[Deterministic gates]
  D --> P[Privileged release action]
  P -->|requires approval| H[Accountable human]
  D --> A[Audit log]
  M -. no tool authority .-> P
```

Failure path: missing sources, ambiguous precedence or unsupported rules stop as `BLOCKED`; an implementation mutation produces `FAIL`; only a named human may accept residual release risk. Decisions supported: offline/live separation and independent human authority.
