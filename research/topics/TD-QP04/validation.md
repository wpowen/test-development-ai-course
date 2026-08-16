# TD-QP04 Validation

## Research coverage

PASS-FIXTURE：10 opened sources、至少五 lanes、五 families、四 source types；两个独立 runs 覆盖平台语义和失败边界。无 practitioner blind review。

## Claim traceability

PASS：Facts、synthesis、Inference、Unknown 分开；不把文档推断成组织权限/delivery guarantee，不使用通用阈值。

## Runnable lab

PASS-FIXTURE：public working_directory、required files、baseline/fault/repair 和 0/1/0 明确；故障为同一事件创建两个 Jira defects，EXACTLY-ONCE-EFFECT 变红；Prompt 有 input/Schema/eval/manifest 与 NOT_RUN model policy。

## Independent comparison

PASS：独立 comparator 记录 agreements、disagreements、adjudication、rejected claims 和 unknowns。

## Publication verdict

仅 fixture-tested；live integration、practitioner review、生产 SLO 和发布均 NOT_RUN。没有当前 promotion receipt 与全局 closure 时不得 publication-ready。
