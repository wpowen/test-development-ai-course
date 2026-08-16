# TD-X502｜多语言、可访问与包容性 AI 的任务门禁

## Professional problem：翻译正确，不代表用户能完成任务

把中文提示翻成英文再比较字符串，无法覆盖 RTL 布局、输入法、键盘导航、可访问名称、语音控制或文化语境。测试开发需要从“语言是否像”转向“目标用户是否能完成关键任务”。这里的 risk 是关键 locale 根本没进入样本，或页面视觉上正常却无法用键盘触达和读屏识别，最后被多数语言的平均值隐藏。

本页 method 先冻结任务矩阵：locale、script、方向、输入方式、辅助技术、关键动作和失败影响。翻译模型可以提供候选措辞，但独立 Oracle 来自批准术语表、无障碍语义树、任务完成规则与具名语言/可访问性 owner；同一模型不能自评自己的翻译。

## Runnable action：让缺失 locale 和键盘断点真正失败

```bash
python3 advanced_quality_lab.py run --topic TD-X502 --phase baseline --report reports/td-x502-baseline.json
python3 advanced_quality_lab.py run --topic TD-X502 --phase fault --report reports/td-x502-fault.json
python3 advanced_quality_lab.py run --topic TD-X502 --phase repair --report reports/td-x502-repair.json
```

Prompt 只根据冻结任务和术语表生成候选测试；Schema 强制保存 locale、脚本方向、辅助技术、证据引用和 stop state；Eval 按 locale 切片检查任务成功、键盘路径和 accessible name；Mutation 删除一个 required locale，并破坏关键控件的键盘到达与可访问名称。

## Failure and repair：为什么平均通过率不能救回缺失切片

Baseline 退出 0，说明所有 required locale 与键盘/name 门禁都在报告中。Fault 应退出 1，并出现 `required_locales_covered`、`keyboard_and_name_gate`。若没有变红，说明 locale 可能只被计入总数、DOM 断言没有读取可访问树、或 runner 把缺字段当作“不适用”。Repair 恢复缺失 locale，修复焦点顺序和名称来源后才返回 0。

0→1→0 的含义是合成任务矩阵能阻止这两种回归；它不证明真实读屏、移动设备、方言或文化伤害已经经过验证。

## 把报告转成发布前清单

关键任务必须逐 locale 给出结果，不能只给全局均值。键盘 blocker、缺失名称和错误方向应独立阻断；翻译分歧可以进入人工 adjudication，但不能被模型置信度替代。真实设备/辅助技术组合、方言覆盖、文化语境、适用法律和用户任务频率仍为 UNKNOWN。

## 边界与练习

状态是 fixture-tested 且 `model_evidence=NOT_RUN`，不是 live 可访问性审计、practitioner 语言评审或 production 合规证明。练习时选一个注册流程，为简体中文、英语和一个 RTL locale 写任务矩阵，并补键盘、读屏名称、错误恢复和术语 owner；任何缺失切片都应产生 BLOCKED。
