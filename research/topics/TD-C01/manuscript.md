# 职业能力迁移：岗位路径、自评证据与作品集边界

Wave3 learner expansion: portfolio evidence, responsibility-state self-assessment, 90-day mutation experiment, organization-adapter limits, and explicit model/integration/practitioner/learner/live/production NOT_RUN boundaries are represented in the source module.

Wave4 sync: the source now includes a page-specific portfolio review, 0/1/0 self-assessment experiment, organization adapter re-entry fields, reviewer questions, and static/fixture/provider/model/integration/practitioner/learner/live/production/publication NOT_RUN boundaries.

Wave5 sync: added a guided-to-project career decision, RAG portfolio fault diagnosis, role decision card, reviewer objection loop, and organization-aware migration artifact.

Wave6 sync: added serving-specific responsibility decisions, version/risk diagnosis, continue-stop-escalate branches, and reusable role-scope artifacts.

## 把岗位自评绑定可复验作品而非证书数量

把五维自评分逐项链接到 baseline-fault-repair 工件，并验证 employment_guarantee=false。职业框架只提供责任基线；能力等级必须回到当前可复验作品，无证据项写 UNKNOWN，岗位是否存在由具体组织决定。

方法选择是：用 O*NET、SFIA、ISTQB、NIST 建责任基线，再按风险、代码/数据、AI Eval、Serving/Reliability、沟通治理五维自评。 独立 Oracle 为：岗位负责/协作/禁止边界清楚；自评分有 evidence_ref 或 UNKNOWN；90 天计划含 baseline-fault-repair；employment_guarantee=false。 这使学员能解释为什么一个测试变红，而不是只复制命令。学员最终交付 岗位路径图、能力自评 JSON、90 天计划和作品集证据表，并在工件中区分 desk-researched、fixture-tested、live-tested、practitioner-reviewed 与 production-validated。

### 把五维自评分逐项链接到 baseline-fault-repair 工件，并验证 employment_guarantee=false

先读取 page manifest 与批准输入；baseline 只验证本页 Oracle。随后注入：把证书数量当能力证据，并加入完成课程即可就业的承诺。门禁必须退出 1 并保存 expected/actual；repair 执行：删除就业承诺，把能力等级绑定可复验作品和 30/60/90 天复评。重放时 Oracle、Prompt/Input/Schema/Eval/Mutation 版本均不得漂移。

### 为什么采用这条 Oracle 链

职业框架只提供责任基线；能力等级必须回到当前可复验作品，无证据项写 UNKNOWN，岗位是否存在由具体组织决定。 受保护链条包括：负责/协作/禁止边界、五维 evidence_ref、自评 UNKNOWN、90 天作品和非就业承诺。

## 复制运行 TD-C01 的 0 → 1 → 0

```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-serving-career
python3 scripts/serving_lab.py --manifest manifests/TD-C01.json --mode baseline
python3 scripts/serving_lab.py --manifest manifests/TD-C01.json --mode fault
python3 scripts/serving_lab.py --manifest manifests/TD-C01.json --mode repair
python3 scripts/serving_lab.py --manifest manifests/TD-C01.json --mode cycle
```

预期内部结果为 `0 -> 1 -> 0`。打开 `evidence/TD-C01/` 下四份 JSON，核对 input hash、manifest hash、实际检查和 evidence level。先预测哪一个字段会变红，再运行；如果 fault 仍绿，立即判为测试资产无检测力。

## TD-C01 失败诊断与修复边界

失败：把证书数量当能力证据，并加入完成课程即可就业的承诺。 修复：删除就业承诺，把能力等级绑定可复验作品和 30/60/90 天复评。 若 baseline 分数没有 evidence_ref，先撤销该分数；若 fault 的就业承诺未被挡住，检查非承诺规则；repair 用 30/60/90 天复评计划替代结果保证。

本页的 Remaining Unknown 是：课程不能证明招聘需求、薪资、晋升、地区机会或个体适配。本页只验证合成自评合同能拒绝无证据分数和就业承诺；没有招聘组织、岗位需求、薪资或个体适配证据。
