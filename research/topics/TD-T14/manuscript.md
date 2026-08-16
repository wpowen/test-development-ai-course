# TD-T14 learner manuscript

## 用双标与反例校准 Judge，而不是崇拜总分

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 30 对退款答复校准集：顺序对、冗长风格对、政策事实错误对，以及两名领域人员的独立标签和裁决记录。。如果团队只看一个总分或最终回答，可能把混杂变量、越权动作、事实错误或重复副作用藏在绿色数字里。业务后果由人工负责人承担，因此被测模型、Judge 或 healer 不能批准自己的期望。

本页控制问题是：怎样用人工双标、顺序翻转、风格扰动和事实反例校准 LLM Judge，使其只能辅助可委托的评分，而不能批准自己的期望或绕过事实 blocker？ 先把它翻译为决策：质量负责人基于人人一致性、人机分歧矩阵和反例命中率划定 Judge 可自动评分、需抽检和必须人工审批的范围；事实、安全、权限类永不由单一 Judge 放行。。这一步决定哪些证据是 blocker，谁能批准，什么情况必须 UNKNOWN，也决定后续 Prompt 应要求模型输出“候选与证据”，而不是“替负责人下结论”。

TD-T14 把 30 对退款答复拆成顺序翻转、风格扰动、过期政策和人工双标四种切片；学员要交付分歧矩阵、事实 blocker 与升级规则，不能把 Judge 的自信理由当作独立 Oracle。

## Runnable action

运行 TD-T14 的固定校准夹具，fault 会交换候选顺序并放过过期政策；repair 只恢复位置稳定性与事实 blocker：

```bash
cd materials/llm-agent-quality/learner-materials
python3 scripts/agent_quality_lab.py --topic TD-T14 --phase cycle --report-dir reports/TD-T14
```

cycle 内部必须是 `0 / 1 / 0`；打开 baseline/fault/repair 的分歧矩阵、`failed_oracle_ids` 和人工升级字段。

先盲化候选身份，再做 AB/BA 顺序重排；分别报告人人一致性、position flip rate、fact-blocker miss 和升级率。事实与安全分歧直接阻断自动判分，单一一致率不能覆盖反例。

TD-T14 的 `eval.json` 固定顺序翻转、风格扰动和过期政策反例，`mutation.json` 固定 position flip 与 fact-blocker miss；`critic.md` 强制人工双标和升级。provider/model 保持 NOT_RUN。

## Failure and repair

诊断先看 AB/BA 结果和 fact-blocker 命中，而不是理由长度；`POSITION-STABLE` 或 `FACT-BLOCKER` 任一失败都必须拒绝自动放行。若 fault 不变红，说明校准集没有检测力；若 repair 只是改阈值，则属于假绿。

修复先保留原始顺序与人工标签，撤回该 Judge 的自动权限，启用独立事实 Oracle，再交人工 owner 重校准；不得让 Judge 改 expected 或将 NOT_RUN 伪装成 live。

迁移到代码评审 Judge 时保持双标、盲评、反例和升级，改写编译/安全/API blocker；学员必须记录新 source/target、两项变化与成功标准。当前仅 fixture-tested，标注员训练、长期漂移和版本再校准仍需 practitioner review。

## Judge 校准与人工升级

Judge 是测量仪器，不是业务真相。校准集要覆盖事实正确/错误、权限越界、冗长无关、顺序翻转和近邻答案，并保存人工理由、政策版本和风险标签。先算人人分歧，再算 Judge 与共识的分歧；风格可以自动筛选，事实、隐私、权限和安全必须人工升级；更换 Judge 或 rubric 即使输入不变也要重新校准。

诊断顺序：交换顺序改变胜负，做盲化和多次反转；长答案总被偏爱，加入同事实不同长度配对；过期政策仍高分，加入引用版本和事实 blocker；人工彼此不一致，先 adjudication，未形成共识则 UNKNOWN。迁移到代码评审时替换领域 Oracle，保留盲评、反例和人工升级四个控制点，模型执行仍 NOT_RUN。
