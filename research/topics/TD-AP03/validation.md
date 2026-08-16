# TD-AP03 验证记录

## Research coverage
两轮研究与来源覆盖已保存，Evidence、Inference、Unknown 分开。
## Claim traceability
Trace 结论可回到 source-pack、schema 和 fixture report。
## Runnable lab
显式 cwd 下执行 baseline/fault/repair，观察 0/1/0。
## Independent comparison
Run A 与 Run B 独立比较后裁决。
## Publication verdict
PASS-FIXTURE only；live、practitioner、production NOT_RUN。

- [x] 精确九件研究包，无聚合 research-package.md。
- [x] 15 个来源已打开，覆盖 15 个 family、11 个 publisher group、10 个 evidence lane。
- [x] 两个独立 query/run 与独立 comparison 均有引用。
- [x] Evidence / Inference / Unknown / Counterevidence 分开。
- [x] Prompt/Input/Schema/Eval/Mutation 均锁定 v1.0.0。
- [x] baseline/fault/repair 的实际退出码为 0/1/0；fault 为“让 45% 模型/工具 Span 丢失父子关联”。
- [x] typed command 指向公开材料和显式 cwd。
- [x] 页面与证据明确 synthetic fixture 不等于 production capacity。

结论：PASS-FIXTURE（内容与执行闭环）；PASS-LIVE、PASS-PRACTITIONER、production capacity 均未建立。
