# API and service quality architecture

Boundary: design and local contract fixtures only. Real OAuth/mTLS, tenant isolation, payment side effects, queues, rate limits and production cleanup are `NOT_RUN`.

## Context
```mermaid
flowchart LR
  Client --> Gateway
  Gateway --> API[Order API]
  API --> DB[(Order ledger)]
  API --> Bus[Event bus]
  Bus --> Consumer
  QE[Test engineer] --> Gate[Quality gate]
  Gate -. external boundary .-> API
```

## Building block
```mermaid
flowchart LR
  Spec[OpenAPI contract] --> Gen[Candidate generator]
  Gen --> Schema[Schema checks]
  Schema --> State[State-machine oracle]
  State --> Side[Side-effect oracle]
  Side --> Trace[Trace correlator]
  Trace --> Report[Decision report]
```

## Runtime
```mermaid
sequenceDiagram
  participant T as TestRunner
  participant A as API
  participant L as Ledger
  participant Q as Queue
  T->>A: cancel request + idempotency key
  A->>L: conditional state transition
  A->>Q: refund.requested
  alt retry or duplicate event
    T->>A: repeat same key
    L-->>T: refund_count remains 1
  else dependency failure
    A-->>T: timeout/5xx evidence
  end
```

## Deployment
```mermaid
flowchart TB
  Local[Local fixture] --> Stub[API/event stubs]
  CI[Controlled CI - NOT_RUN] --> Service[Test service - NOT_RUN]
  Service --> Queue[Queue - NOT_RUN]
  Service --> Database[(Database - NOT_RUN)]
  Service --> OTel[Telemetry - NOT_RUN]
  Secrets[Secret manager - NOT_RUN] --> Service
```

## Data flow
```mermaid
flowchart LR
  Contract --> Request
  Request --> Response
  Request --> StateChange
  StateChange --> LedgerEvidence
  StateChange --> EventEvidence
  Response --> Correlation
  LedgerEvidence --> Correlation
  EventEvidence --> Correlation
```

## Security and trust boundary
```mermaid
flowchart LR
  Caller[Untrusted caller] --> AuthN[AuthN]
  AuthN --> AuthZ[Owner/role authorization]
  AuthZ --> Rate[Rate and replay guard]
  Rate --> Domain[Domain service]
  Domain --> Money[Privileged refund side effect]
  Money --> Audit[Immutable audit]
  Admin[Human waiver] --> Audit
```

Failure path: authentication failure, state conflict, duplicate refund, delayed event or missing ledger evidence blocks a positive conclusion. Decisions supported: deterministic business oracles over HTTP-only checks, and controlled adapters before real side effects.
