# TD-X602｜训练、Fine-tuning 与模型更新的版本化验收

## Professional problem：新模型分数更高，为什么仍可能不能注册

### Wave-2 model-update lineage

候选比较必须同一 manifest 锁定数据版本、许可、基座 hash、训练代码、超参、holdout 和 rollback ref，再看关键切片、拒答和安全 blocker。holdout 污染会使旧结论整体失效；真实训练流水线、许可、硬件、作业和回滚读回仍需重新取证。

模型更新不是替换一个名称。训练数据、基座模型、代码、超参、运行环境、holdout、候选权重和回滚目标共同决定结果。只保存最终分数会留下两个关键 risk：无法复现实验，以及训练样本污染 holdout 后产生虚假提升。测试开发要先建立 lineage，再谈候选是否优于基座。

本页 method 是封存版本 manifest、隔离 holdout、按关键切片比较候选，并预先声明 rollback ref。独立 Oracle 来自冻结的评测集、切片规则和批准 owner；模型训练流程或候选生成器不能修改 Oracle 来批准自己。

## Runnable action：亲手制造一次 holdout 污染

```bash
python3 advanced_quality_lab.py run --topic TD-X602 --phase baseline --report reports/td-x602-baseline.json
python3 advanced_quality_lab.py run --topic TD-X602 --phase fault --report reports/td-x602-fault.json
python3 advanced_quality_lab.py run --topic TD-X602 --phase repair --report reports/td-x602-repair.json
```

Prompt 只读取批准的训练 manifest 和独立 eval 结果；Schema 强制输出数据、基座、代码、超参、holdout 与 rollback 引用；Eval 检查版本闭包、lineage 和 holdout 封存；Mutation 同时取消版本 pin，并把训练样本混入 holdout。

## Failure and repair：分数没变也必须拒绝的故障

Baseline 退出 0，表示合成 manifest 闭合且 holdout 未污染。Fault 必须退出 1，`versions_pinned`、`lineage_complete`、`holdout_sealed` 都应进入 `failed_checks`。若 fault 仍为 0，先排查数据 ID 是否在切分后被重写、重复检测是否只比较文件名、或缺失版本是否被默认成 latest。Repair 恢复数据/基座/代码/超参版本，重新封存 holdout，再返回 0。

这条 0→1→0 证据说明 runner 能阻断版本断链和合成污染；它没有运行真实训练，也没有证明性能提升或不存在灾难性遗忘。

## 候选注册前的判读顺序

先验证 lineage 与污染，再比较关键切片，最后检查 blocker 与回滚可用性。任何关键引用缺失都应 BLOCKED；平均分上涨不能抵消拒答、安全或核心业务切片退化。真实训练数据许可、硬件可复现性、线上收益、灾难性遗忘范围和回滚耗时仍为 UNKNOWN。

## 边界与练习

当前只是 fixture-tested，`model_evidence=NOT_RUN`，不等于 live 训练、practitioner 模型评审或 production 注册通过。练习时画出一次微调 lineage，包含数据快照、基座 hash、代码 commit、超参、环境、holdout seal、候选和 rollback；然后说明任一引用失效时为什么旧分数必须作废。
