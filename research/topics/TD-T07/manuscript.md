# TD-T07 教学稿：先选失败模型，再生成数据

## 从失败模型选择边界、组合、属性或 Fuzz
“让 AI 多生成一些测试数据”没有可审计的完成条件。金额阈值错误、多个规则交互、幂等不变量和解析器崩溃属于不同问题；把它们都交给随机数，可能得到大量无效样例，却漏掉真正边界。专业测试开发先说明想捕获哪类失败，再决定数据方法、合法域、Oracle、预算和停止条件。生成量只是运行参数，不是覆盖证明。

四种方法的核心差异是问题形状：boundary 检查有序域阈值邻域；combination 用约束后的 covering array 检查离散因子交互；property 对大量合法输入验证同一 invariant，并把失败收缩；fuzz 在授权沙箱中探索未知语法或字节空间。AI 可协助列因子、边界和候选属性，却不能决定业务合法状态，更不能对真实付费/写操作接口无授权 fuzz。

## 运行 TD-T07 并核对引用链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-assisted-testing
python3 ai_assisted_lab.py run --topic TD-T07 --phase baseline --report reports/td-t07-baseline.json
python3 ai_assisted_lab.py run --topic TD-T07 --phase fault --report reports/td-t07-fault.json
python3 ai_assisted_lab.py run --topic TD-T07 --phase repair --report reports/td-t07-repair.json
```

TD-T07 预期退出码为 `0 → 1 → 0`；本页 fault 非零是检测力证据，不得用 shell 吞掉。

进入材料目录运行 TD-T07 baseline。报告展示固定 seed、选择的方法、生成数量与拒绝的无约束 fuzz，属性 `refund_count<=1` 在批准实现上成立。打开版本化提示包，检查 input 是否明确金额、状态、幂等 key 和重复次数的域；schema 是否要求 method、constraint、Oracle 与 replay；eval 是否覆盖缺失、冲突、越权等八类；mutation 是否描述故障而非给生成器自批答案。

运行 fault。故障破坏幂等保护，同一个 key 的重复请求造成退款次数大于 1，runner 退出 1。不要只保存“第 17 个随机样例失败”，而要读取 `minimal_counterexample` 与 replay：seed、系统版本、是否复现。最后运行 repair，用完全相同输入合同恢复实现并退出 0。将最小反例转成固定回归，属性生成继续探索其他输入。

## 诊断 TD-T07 的错误批准路径
失败一是用随机数据替代方法选择；修复是先写 failure model。失败二是固定 seed 后宣称完全可复现；修复是同时冻结工具、系统、依赖、时间与外部状态，不能冻结的写 UNKNOWN。失败三是 property 由实现细节推导，错误会共享；修复是由批准需求定义独立 invariant。失败四是对生产执行 fuzz；修复是沙箱、授权、速率、预算和副作用门禁。

完成标准是能解释为什么选某方法、故障阶段确实产生可重放且已收缩的反例、修复阶段同合同通过，并保存原始失败而不是只留摘要。当前实验没有真实模型、真实 API 或生产数据，也没有从业者批准 domain/invariant，因此只标 `fixture-tested`。迁移到项目时需要重新定义域、约束、权限和停止条件，不能沿用本页阈值冒充真实策略。
