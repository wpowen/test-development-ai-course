# TD-F01 Validation

## Research coverage

13 个来源已打开，覆盖职业数据库、政府框架、专业大纲、标准、系统工程、技术规范、AI 风险、安全、雇主反例与社区信号；source family 超过 5、evidence lane 超过 5、source type 超过 4。两个独立 research run 已完成并有 comparison 裁决。

## Claim traceability

职业共同骨架由 O*NET、UK DDaT 与 ISTQB 支持；需求/技术双文档与验证矩阵由 ISO、NASA、OpenAPI、JSON Schema 支持；AI 能力迁移由 NIST 与 OWASP 支持；职位变化和年限差异由 GitLab/Reddit 作为反例与信号，不用于普遍性断言。目标公司事实均标 INTERNAL-UNKNOWN。

## Runnable lab

`profession_self_check.py` 已从 canonical 与公开 `materials/profession-reality` 两个工作目录执行 baseline/fault/repair：观测退出码 0/1/0，cycle 总体退出 0，并生成 cycle 与三份 phase 报告。Prompt 1.0.0 已绑定 input/schema/eval，但 provider=none、model_status=NOT_RUN。模块级 executability audit 观测到 1 页通过、4 个 typed block、0 finding、0 `courses/` 路径、0 隐含 cwd、0 untyped block；canonical/public/ZIP 逐字节闭包测试通过，typecheck 通过。

## Independent comparison

comparison.md 对 Route A/B 的共识、冲突与裁决独立记录。保留既有责任/工件地图，新增完整流程、双文档、独立 Oracle、人类发布边界、AI 迁移和入场自测。单一雇主与论坛不用于行业结论。

## Publication verdict

研究与确定性实验上限为 PASS_FIXTURE。全局内容验证仍被共享 `course.ts` 中旧 TD-F01 `deliverySupport` 覆盖模块自带 materials，以及其他并发课程页缺材料所阻断；这不改变模块级通过证据，也不能被静默忽略。没有模型运行、从业者盲审、真实企业集成、学习效果、线上、发布或生产证据；因此 publication verdict 为 BLOCKED-NOT-REQUESTED，不得写成完整课程、practitioner 或 live。
