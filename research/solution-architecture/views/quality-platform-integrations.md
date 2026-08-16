# Quality platform integration architecture

Boundary: local Jira, GitLab, Kubernetes and event-state fixtures. Real webhooks, protected branches, RBAC, NetworkPolicy, Admission, immutable storage and notifications are `NOT_RUN`.

## Context
```mermaid
flowchart LR
  Jira --> Platform[Quality evidence platform]
  GitLab --> Platform
  Kubernetes --> Platform
  EventBus --> Platform
  Platform --> Reviewer[Release reviewer]
  Platform --> Vault[Evidence vault]
  Admin[Platform owner] --> Platform
```

## Building block
```mermaid
flowchart LR
  Ingress[Signed ingress] --> Normalize[Event normalizer]
  Normalize --> Idempotency[Idempotency ledger]
  Idempotency --> Policy[Policy engine]
  Policy --> Evidence[Evidence binder]
  Evidence --> Writer[Controlled status writer]
  Writer --> Audit[Immutable audit]
```

## Runtime
```mermaid
sequenceDiagram
  participant S as SourceSystem
  participant I as Ingress
  participant P as Policy
  participant W as StatusWriter
  participant H as Human
  S->>I: signed event + source SHA
  I->>P: normalized idempotent event
  alt duplicate, 429 or 5xx
    P-->>I: retry/DLQ without duplicate write
  else policy decision
    P->>W: proposed status transition
    W->>H: approval for privileged change
  end
```

## Deployment
```mermaid
flowchart TB
  Local[Local state-machine fixture] --> Files[Fixture reports]
  CI[Integration CI - NOT_RUN] --> Adapter[Platform adapters - NOT_RUN]
  Adapter --> JiraX[Jira Sandbox - NOT_RUN]
  Adapter --> GitLabX[GitLab Sandbox - NOT_RUN]
  Adapter --> K8s[Kubernetes namespace - NOT_RUN]
  Adapter --> Store[Immutable evidence store - NOT_RUN]
```

## Data flow
```mermaid
flowchart LR
  Event --> Verify[Signature and schema]
  Verify --> Normalize
  Normalize --> Correlate[Commit/build/run correlation]
  Correlate --> PolicyDecision
  PolicyDecision --> StatusWrite
  StatusWrite --> Readback
  Readback --> AuditRecord
```

## Security and trust boundary
```mermaid
flowchart LR
  Internet[Untrusted webhook] --> WAF[Ingress control]
  WAF --> Signature[Signature/replay check]
  Signature --> Service[Least-privilege adapter]
  Service --> RBAC[Platform RBAC]
  RBAC --> Protected[Protected branch/cluster action]
  Protected --> Human[Human approval]
  Service --> Audit[Immutable audit]
```

Failure path: invalid signature, replay, missing source SHA, non-idempotent write, failed readback or unavailable DLQ remains `FAIL/UNKNOWN`. Decisions supported: append-only evidence before status mutation and least-privilege adapters with readback.
