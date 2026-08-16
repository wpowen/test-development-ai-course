# TD-X805｜在线实验、Canary 与人工抽样的扩量门禁

## Professional problem：Canary 跑过了，为什么还不能扩大流量

### Wave-2 canary evidence

先冻结 assignment、离线 blocker、guardrail、最坏切片、人工样本和 rollback manifest；Canary 同时看失败、低置信和长尾，不得只抽成功样本。当前仅证明发布门禁形状，真实流量、统计功效、人工标签和生产发布均为 NOT_RUN。

在线实验的风险（risk）不是把新版本暴露给 5% 用户后观察平均转化率就能看清的。分流污染会让对照组失真，guardrail 回归可能被业务指标上涨掩盖，只抽成功案例会让人工评审失去代表性。测试开发需要在上线前定义 hypothesis、MDE、稳定分流、停止阈值、最坏切片、人工抽样和 rollback owner；缺任何关键证据都不能扩量。

本页 method 将 assignment integrity、业务主指标、质量/安全 guardrail、代表性人工样本和回滚时延分开。独立 Oracle 来自实验分配日志、批准阈值、原始 Trace 与人工 adjudication；生成实验解释的模型不能自行批准 Canary。

## Runnable action：模拟一轮受污染的扩量请求

```bash
python3 advanced_quality_lab.py run --topic TD-X805 --phase baseline --report reports/td-x805-baseline.json
python3 advanced_quality_lab.py run --topic TD-X805 --phase fault --report reports/td-x805-fault.json
python3 advanced_quality_lab.py run --topic TD-X805 --phase repair --report reports/td-x805-repair.json
```

Prompt 只根据冻结实验计划和运行证据生成解释候选；Schema 保存 assignment、切片、guardrail、人工样本、owner 和 stop state；Eval 检查分流完整性、阻断指标和样本代表性；Mutation 污染 assignment、制造 guardrail 回归，并把人工抽样改成只看成功案例。

## Failure and repair：0→1→0 是扩量门禁，不是线上收益证明

Baseline 退出 0，说明合成实验合同、guardrail 和抽样规则存在。Fault 必须退出 1，`assignment_integrity`、`guardrails_pass`、`human_sample_representative` 应同时出现在 `failed_checks`。若仍是 0，检查匿名用户是否跨组、曝光日志是否晚于结果过滤、guardrail 是否被并入总分、人工样本是否由模型挑选。Repair 恢复稳定分流、阻断阈值和代表性抽样后返回 0。

该证据只证明反例能阻止合成扩量，不证明真实 MDE、长期收益或用户影响已经成立。

## 扩量决定的顺序

先看 assignment，再看 blocker 和最坏切片，随后核对人工样本与 rollback，最后才解释业务指标。任何分流污染、严重 guardrail 失败、样本偏置或回滚 owner 缺失都应 BLOCKED。真实流量、实验伦理、标签容量、长期效果、业务阈值和 production 读回仍为 UNKNOWN。

## 边界与练习

本页只是 fixture-tested，`model_evidence=NOT_RUN`，不是 live Canary、practitioner 评审或 production 发布结论。练习时为一个新回答策略写假设、单位、MDE、分流键、三项 guardrail、最坏切片、人工抽样框和回滚命令；然后故意让同一用户跨组，确认门禁会停止扩量。
