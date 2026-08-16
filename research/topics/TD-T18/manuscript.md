# TD-T18 learner manuscript

## Wave-5 Browser Agent walkthrough

将“已激活商品必须人工复核”绑定风险 ID，planner 生成场景，generator 在隔离账户生成测试；基线通过后把后端状态改为 auto_refunded，测试必须变红。若只因 timeout 失败先修环境；若 healer 删除断言或改 expected，拒绝合并。迁移到支付或审批页替换状态机与 Oracle，保留 Trace、mutation 和人工 review。

```bash
cd materials/llm-agent-quality/learner-materials && python3 scripts/agent_quality_lab.py --topic TD-T18 --phase cycle --report-dir reports/TD-T18
```

## 用后端业务 Oracle 证明 Browser Agent 没有只点亮页面

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 退款审核页面的需求风险、seed 数据、Planner 场景、Generator 测试、浏览器 Trace、后端状态与 auto_refunded 业务变异。。如果团队只看一个总分或最终回答，可能把混杂变量、越权动作、事实错误或重复副作用藏在绿色数字里。业务后果由人工负责人承担，因此被测模型、Judge 或 healer 不能批准自己的期望。

本页控制问题是：怎样让 Browser Agent 从需求风险生成可执行浏览器测试，同时用业务状态 Oracle 与 mutation 证明它不是只复述页面可见文本？ 先把它翻译为决策：测试负责人只接受能追溯风险 ID、在隔离账户执行、验证后端业务状态并杀死已知 mutation 的候选测试；生成模型无合并权。。这一步决定哪些证据是 blocker，谁能批准，什么情况必须 UNKNOWN，也决定后续 Prompt 应要求模型输出“候选与证据”，而不是“替负责人下结论”。

TD-T18 追踪退款审核页面的 risk ID、seed、浏览器 Trace 与后端 `manual_review` 状态；页面出现“已提交”不是业务成功，已知 `auto_refunded` mutation 必须被杀死。

## Runnable action

运行 TD-T18 Browser Agent fixture；fault 只断言页面文字而放过 `auto_refunded`，repair 增加业务状态 Oracle：

```bash
cd materials/llm-agent-quality/learner-materials
python3 scripts/agent_quality_lab.py --topic TD-T18 --phase cycle --report-dir reports/TD-T18
```

cycle 预期 `0 / 1 / 0`，核对 risk trace、后端状态和 mutation report。

运行前先画出证据流：需求风险 → Planner 计划 → Generator 候选 → 隔离浏览器 → 后端状态 Oracle → mutation 重跑 → 人工评审。接着问五个问题：输入版本是否冻结；身份与 scope 是否在写之前核验；哪个 Oracle 独立于模型；哪个人工 owner 能批准；失败后如何回滚。指标解释为：统计 risk-to-test trace、business-Oracle coverage、known-mutation kill、flaky retry、Trace completeness 和人工拒绝原因。。只要权限、版本或命名 Oracle 缺失，就 fail-closed。

TD-T18 的 eval 放页面成功但后端失败的反例，mutation 固定 `auto_refunded`；critic 检查风险 ID、隔离账户和业务 Oracle，provider/model 为 NOT_RUN。

## Failure and repair

故障症状可能是绿色总分、漂亮理由或成功最终文本，但第一诊断入口永远是命名 Oracle 与副作用日志。BUSINESS-ORACLE 与 MUTATION-KILLED 都必须通过；页面可见性、截图或模型解释不能替代后端业务状态。 若 fault 没有变红，说明评测缺乏检测力；若 repair 通过但 mutation 存活，说明修复制造了假绿；若 writes 在授权前出现，即使结果正确也必须失败。

安全修复顺序为：冻结写通道，保留原始报告与 hash，恢复最小权限，定位第一个被破坏不变量，再提交候选修复给人工 owner。回滚：拒绝生成候选，恢复 seed 与上一测试版本，保留 Trace/截图/网络记录并停用生成写权限。。禁止做法包括让模型改 expected、删除 assertion、无限重试、偷偷增加预算、用另一个同源 Judge 自证或把 NOT_RUN 写成 live。

完成后做迁移练习：迁移到订单审核页面时保持风险追溯、隔离账户、业务状态 Oracle 和 mutation，替换 fixture 与状态机。。迁移说明必须写出 source_context、target_context、保持的不变量、至少两项必须改变的配置和成功标准。最后由人检查 fault 是否仍稳定变红、repair 是否真正恢复控制、权限是否零扩大。当前结论只到 fixture-tested；真实浏览器、企业页面、认证、网络波动和生成模型尚未执行；fixture 不代表 E2E 稳定或业务覆盖完整。

### TD-T18 浏览器证据卡

Planner 输出必须引用风险 ID，而不是只描述按钮名称。
Generator 生成的断言要同时指向页面反馈和后端状态。
隔离账户禁止携带生产 cookie 或真实支付 token。
Trace 至少包含导航、请求、响应和状态转移时间线。
`auto_refunded` mutation 检查的是业务事实，不是截图像素。
网络重试不能吞掉后端 500 或状态冲突。
业务 Oracle 应由产品 owner 与测试 owner 共同维护。
healer 不得把失败断言改成存在性断言。
人工审查需要看到 network trace 与 mutation 结果。
repair 后重新运行原风险切片，不能只跑 happy path。
迁移到订单审核时，审批状态和账本变化是新的独立 Oracle。
企业认证、浏览器版本与第三方组件漂移仍未知。
fixture 通过不等于真实页面覆盖率达标。

## Browser Agent 业务变异

生成浏览器测试的闭环是风险 ID→可观察业务状态→候选动作→后端变异→失败证据。截图、按钮可见和页面无报错只是表面信号；将 auto_refunded 改成 manual_review_required 后测试稳定变红，才证明断言覆盖风险。planner、generator、healer 的输出都要保留 trace、账户和 fixture 版本，生成代码必须人工 review 后合并。

诊断顺序：页面绿但错误订单状态未发现，补业务状态 Oracle；healer 改到相邻按钮，比较 Trace 的真实副作用并拒绝自动合并；偶发超时，先固定数据、等待和网络，区分环境失败；生成代码无风险来源，回链 PRD 风险和验收条件。迁移到订单或审批页只替换状态机和 mutation，真实浏览器兼容性和生产数据 NOT_RUN。

案例工件：需求要求已激活商品进入人工复核；auto_refund mutation 后脚本必须变红。学员交 risk-to-test 映射、Trace、mutation 报告和 healer 拒绝理由，生成速度不能替代业务 Oracle。
