# TD-AP01 验证记录

## Research coverage

两轮独立研究、15 个已打开来源、多个 evidence lane 和 counterevidence 均已保存；页面只消费可追溯 source IDs。

## Claim traceability

教学结论可回到 source-pack、research-runs、蓝图字段和对应 fixture report；Evidence、Inference、Unknown 分开记录。

## Runnable lab

Manifest 使用显式 cwd、版本化 Prompt 包和 0/1/0 退出码，报告与 trace 保留在课程包。

## Independent comparison

Run A 与 Run B 独立完成后再由 comparison.md 裁决，未把单一 issue 或单次运行当成普遍规律。

## Publication verdict

PASS-FIXTURE only；真实模型、生产系统、从业者评审和公开发布均 NOT_RUN。

- [x] 精确九件研究包，无聚合 research-package.md。
- [x] 15 个来源已打开，覆盖 15 个 family、11 个 publisher group、10 个 evidence lane。
- [x] 两个独立 query/run 与独立 comparison 均有引用。
- [x] Evidence / Inference / Unknown / Counterevidence 分开。
- [x] Prompt/Input/Schema/Eval/Mutation 均锁定 v1.0.0。
- [x] baseline/fault/repair 的实际退出码为 0/1/0；fault 为“删去一半任务切片并只保留入口 2xx Oracle”。
- [x] typed command 指向公开材料和显式 cwd。
- [x] 页面与证据明确 synthetic fixture 不等于 production capacity。

结论：PASS-FIXTURE（内容与执行闭环）；PASS-LIVE、PASS-PRACTITIONER、production capacity 均未建立。
