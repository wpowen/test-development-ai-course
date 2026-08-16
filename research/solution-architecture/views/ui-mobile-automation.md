# Web, Android and iOS automation architecture

Boundary: page designs and shared offline contracts. Real browsers, simulators, signed apps, device farms, OS dialogs and repair telemetry are `NOT_RUN`.

## Context
```mermaid
flowchart LR
  Learner --> Runner[Automation runner]
  Runner --> Web[Web browser]
  Runner --> Android[Android device]
  Runner --> IOS[iOS device]
  Runner --> Agent[AI planner/healer]
  Agent --> Approval[Human repair approval]
  Runner --> Evidence[Evidence store]
```

## Building block
```mermaid
flowchart LR
  Intent[Test intent] --> Model[Page/screen model]
  Model --> Locator[Locator adapter]
  Locator --> Driver[Platform driver]
  Driver --> Oracle[Business oracle]
  Oracle --> Artifact[Screenshot/trace/state]
  Artifact --> Repair[Bounded repair candidate]
  Repair --> Review[Independent review]
```

## Runtime
```mermaid
sequenceDiagram
  participant R as Runner
  participant D as Device/Browser
  participant O as Oracle
  participant H as Healer
  participant P as Human
  R->>D: execute stable user action
  D-->>O: UI + API + state evidence
  alt locator failure
    O->>H: bounded repair request
    H-->>P: diff, confidence, risks
    P-->>R: approve or reject
  else business failure
    O-->>R: FAIL without healing assertion
  end
```

## Deployment
```mermaid
flowchart TB
  Src[Test repository] --> Local[Local runner]
  Src --> CI[CI runner - NOT_RUN]
  CI --> Browser[Browser grid - NOT_RUN]
  CI --> Device[Device farm - NOT_RUN]
  Device --> App[Signed app - NOT_RUN]
  CI --> Telemetry[Artifacts and traces - NOT_RUN]
```

## Data flow
```mermaid
flowchart LR
  Spec --> SeedTest
  SeedTest --> ActionTrace
  ActionTrace --> Screenshot
  ActionTrace --> NetworkTrace
  Screenshot --> OracleBundle
  NetworkTrace --> OracleBundle
  OracleBundle --> RepairDataset
  RepairDataset --> HumanDecision
```

## Security and trust boundary
```mermaid
flowchart LR
  TestData[Masked test data] --> Runner
  Runner --> Sandbox[Device/browser sandbox]
  Agent[Untrusted model suggestion] --> Policy[Repair policy]
  Policy --> Diff[Reviewable diff]
  Diff --> Human[Human approval]
  Human --> Repo[Protected repository]
  Sandbox --> Audit[Artifact retention controls]
```

Failure path: platform unavailable, permission dialog, flaky timing, wrong locator or unsafe AI repair remains `UNKNOWN/FAIL`; the agent may not delete assertions or rewrite expected business outcomes. Decisions supported: platform-specific adapters and human-approved repair.
