# TD-PS10 Validation

## Research coverage

10 个直接 URL 已打开并记录，覆盖至少五条 evidence lane、五个 source family 和四类 source type；两个独立 research run 已保存。

## Claim traceability

控制问题、方法、四个 Oracle、Prompt、fault 和 Unknown 均可回到 source-pack 与 manifest；没有把工具能力写成目标系统事实。

## Runnable lab

在 `site/public/materials/reliability-chaos-observability` 运行 `python3 scripts/specialty_lab.py --manifest manifests/TD-PS10.json --mode cycle`，必须得到 baseline/fault/repair = 0/1/0 和 cycle PASS。当前仅为确定性离线 fixture。

## Independent comparison

course-owner-independent-pass 比较路线 A/B，裁决记录在 comparison.md；draft 未自批。

## Publication verdict

研究包与离线 lab 可进入内容验证；practitioner、真实系统和 publication 仍 BLOCKED。Unknown：目标供应商 Retry-After、真实队列容量和业务降级文案。
