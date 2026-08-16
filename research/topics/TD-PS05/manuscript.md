# TD-PS05 · 分开验证语义、键盘与视觉基线

## 分开验证语义、键盘与视觉基线

退款控件可能通过 DOM 扫描，却在键盘路径中失焦、被长文本遮挡，或在视觉基线自动更新后掩盖风险提示消失。课程要求四种证据各自判定。

WCAG/ARIA 给出可访问语义依据，自动规则只覆盖常见缺陷，人工旅程和基线审批承担自动化无法证明的部分。 交付规则结果、键盘旅程、窄视口证据和具名 owner 批准的视觉差异记录。

四个 Oracle 分别是：

1. 关键控件 name role value 可编程确定
2. 完整退款过程键盘可达且焦点可见
3. 390px 与长文本不遮挡风险和批准控件
4. 视觉基线变更有设计 owner 审批

## 复制运行 TD-PS05 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ui-mobile-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS05.json --mode cycle
```

TD-PS05 的 cycle 应严格记录 `0 → 1 → 0`；可访问性 fault 若未退出 1，应检查 Mutation 是否真的移除了 name/role/focus 或遮挡关键控件，并确认对应语义/旅程 Oracle 被消费。


进入材料目录后运行 TD-PS05 的 cycle 命令。无障碍实验先锁定退款旅程、控件语义、键盘顺序和窄视口基线，再执行合格页面、语义破坏 fault 与批准修复。Repair 必须恢复可编程 name/role/value 和可见焦点后 exit 0；自动规则、键盘记录、视口差异及 cycle receipt 分开保存。

Prompt 包的任务是：从 WCAG 条款、旅程和视口矩阵生成分层检查与人工复核清单；明确自动扫描未覆盖项，禁止自动批准截图基线。本页 system 要求引用 WCAG/ARIA 和关键旅程，task 只生成分层检查与人工复核候选，critic 拒绝自动扫描全覆盖或自动更新视觉基线。模型保持 NOT_RUN，Eval 通过 Prompt/Input/Schema/Mutation 测试缺失与冲突；真实模型输出还需由可访问性 owner 审阅。

替换目标页面时先确定关键任务和风险控件，再换 locator、语言、视口与辅助技术组合；语义 Oracle、键盘完成条件和人工基线审批必须保留，不能复制课程像素阈值。真实辅助技术组合、用户研究结果和品牌容差 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS05 的假绿与恢复失败

本页的三类代表故障是：移除对话框 accessible name；隐藏焦点样式；长文本遮挡确认按钮。单次只移除一个语义属性、焦点信号或布局约束，观察相应层级是否变红。全部检查同时失败时先查页面 fixture；Fault 绿意味着扫描未覆盖关键旅程，Repair 红则检查焦点状态或旧视觉工件残留。

AI 能协助映射条款和生成检查清单，但不能模拟残障用户结论、批准视觉差异或降低 blocker。当前只到无障碍 fixture-tested，真实辅助技术组合、用户研究和品牌容差仍为 Unknown；交付要包含四层证据、Prompt/Eval/Mutation 版本与 0/1/0 收据。

TD-PS05 验收时应分别展示自动规则、键盘焦点序列、窄视口遮挡证据和设计 owner 的基线决定；这四项不可合并成一个“可访问性通过”标签，也不能代替真实辅助技术复核。

长文本、本地化和缩放属于独立风险切片，也要分别留下人工观察。
