# TD-T06 教学稿：用 mutation 审问 AI 候选测试

## 用独立 Mutation 证明 AI 候选测试能杀错
AI 很容易生成“看起来像测试”的代码：有 arrange、act、assert，也能跑出绿色结果。但如果 expected 来自当前实现，测试只是在重复代码；如果只统计覆盖率，执行过错误分支也可能全绿；如果生成模型同时写用例、定义 Oracle 并评价自己，整个链路没有独立反证。专业目标不是测试数量，而是证明某个断言能区分批准行为与受控错误。

先把测试标成 `CANDIDATE`。每条必须引用批准 basis 和独立 Oracle，说明输入、期望、断言、setup 与 cleanup。再做两次不同性质的运行：baseline 验证候选在批准实现上不误报；mutation 主动改变一个明确行为，验证同一候选是否失败。killed 是检测到这个受控错误，survived 是未检测，no coverage 是没有执行到；三者不能混写。工具错误或等价性未定时写 UNKNOWN。

## 运行 TD-T06 并核对引用链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-assisted-testing
python3 ai_assisted_lab.py run --topic TD-T06 --phase baseline --report reports/td-t06-baseline.json
python3 ai_assisted_lab.py run --topic TD-T06 --phase fault --report reports/td-t06-fault.json
python3 ai_assisted_lab.py run --topic TD-T06 --phase repair --report reports/td-t06-repair.json
```

TD-T06 预期退出码为 `0 → 1 → 0`；本页 fault 非零是检测力证据，不得用 shell 吞掉。

在材料目录先执行 TD-T06 baseline，检查每个 case 的 `oracle_source` 来自冻结文件，而非 runner 临时推断。打开 `page-prompts/TD-T06/`，确认 manifest 为 1.0.0，Prompt/Input/Schema/Eval/Mutation 与模型配置分别存在。eval 的八类用例验证缺失、冲突和越权时会停下；mutation 文件定义受控错误，生成器无权修改。当前 manifest 明示 `model_evidence=NOT_RUN`，所以这里只验证合同和 runner。

执行 fault：runner 反转 activated digital refund 的守卫。独立 Oracle 期望 `MANUAL_REVIEW`，实际行为错误，报告将 mutation 标为 KILLED 并退出 1。注意“命令失败”正是 fault 阶段的成功证据；如果用 `|| true` 抹掉退出码，就失去门禁。然后执行 repair，恢复批准逻辑，沿用相同 Oracle 与输入后回到退出 0。

## 诊断 TD-T06 的错误批准路径
失败一是看到 100% 覆盖便批准；修复是要求目标 mutation 被特定断言杀死。失败二是为了让 fault 变绿而更新 expected；这等于让错误改写 Oracle，修复必须回到批准 basis 并恢复实现。失败三是把所有 survived 当真实缺陷；修复是分别调查 no coverage、弱断言、不可达和等价 mutation，由独立 reviewer 处置。失败四是 killed 因无关超时；修复是检查失败是否命中目标 case 与 Oracle。

完成标准包括 baseline 绿、fault 按预期红、repair 再绿，三阶段版本与哈希一致，并能解释 killed/survived/no coverage。实验只覆盖一个合成退款规则；没有真实模型候选、没有真实仓库 mutation 成本、没有从业者评审和生产回读，因此结论严格为 `fixture-tested`。迁移时必须重新冻结 Oracle、选择可解释的 mutation 操作符并保存真实 CI 证据。
## 反例与诊断

100% 覆盖仍可能没有业务断言；为了 fault 变绿而更新 expected 等于让错误改写 Oracle；无关超时造成的红也不能算 killed。杀死率低时先区分 no coverage、弱断言、不可达和等价 mutation，核对目标 case 与独立 Oracle，再决定补测试或保留 UNKNOWN。

