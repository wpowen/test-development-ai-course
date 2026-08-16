# TD-X601｜公平、伤害与 HITL：人工步骤存在不等于控制有效

## Professional problem：总体指标上升时，最坏切片可能更危险

### Wave-2 HITL evidence

先按使用情境定义合法切片，再报告最坏结果和伤害严重度。HITL 必须记录抽样规则、失败样本覆盖、override 权限、申诉路径和回归回写；没有合法切片依据或真实人工样本时保持 UNKNOWN/NOT_RUN，不能以总体公平分代替结论。

公平与伤害评测的核心风险（risk）最容易被两个表象误导：整体准确率提高，以及流程图里画了一个“人工复核”节点。前者可能掩盖少数切片的严重退化，后者可能只是让同一团队确认模型建议。测试开发要验证的不是抽象善意，而是切片是否合法定义、伤害 blocker 是否独立、人工样本是否代表失败和边界、override 是否可追踪且能触发申诉或停止。

本页 method 将性能切片、伤害事件和 HITL 控制分开计量。独立 Oracle 必须由获授权的专业 owner 持有原始样本与决策规则；生成候选或打分的模型不能批准自己的 fairness 结论。

## Runnable action：制造“平均值好看、控制无效”的反例

```bash
python3 advanced_quality_lab.py run --topic TD-X601 --phase baseline --report reports/td-x601-baseline.json
python3 advanced_quality_lab.py run --topic TD-X601 --phase fault --report reports/td-x601-fault.json
python3 advanced_quality_lab.py run --topic TD-X601 --phase repair --report reports/td-x601-repair.json
```

Prompt 只能按已批准切片和伤害分类整理候选；Schema 要求逐切片分子/分母、严重度、人工抽样来源和限制；Eval 分别检查 group slice、harm blocker、独立人工样本；Mutation 改成只汇总平均值，并让同一模型自我评审。

## Failure and repair：三盏红灯缺一不可

Baseline 应退出 0。Fault 应退出 1，并列出 `group_slices_reported`、`harm_blockers_separate`、`independent_human_sample`。若只红一项，说明评测把不同控制揉成总分；若全绿，检查是否用“存在 reviewer 字段”代替了身份独立性，或只抽了成功样本。Repair 恢复逐切片报告、独立伤害 blocker 和代表性人工样本后退出 0。

这个 0→1→0 只证明 fixture 能抓到聚合掩盖和自我批准，不证明系统公平、无伤害或安全。

## 什么时候必须停止

最坏切片严重退化、伤害 blocker 命中、抽样不代表目标人群、reviewer 无授权或 override 无审计链时都应 BLOCKED。总体改善不能抵消严重伤害。受保护属性处理是否合法、因果公平是否成立、真实伤害频率、评审负担与申诉效果仍是 UNKNOWN，需要法律、领域和用户研究证据。

## 边界与练习

当前是 fixture-tested，`model_evidence=NOT_RUN`，没有 live 流量、practitioner 审查或 production 后果证据。练习时为一个候选筛选系统写三类样本：最坏切片、潜在严重伤害、人工分歧；同时规定谁能批准、谁能申诉、触发何种停止动作。不得把离线反例通过写成公平性证明。
