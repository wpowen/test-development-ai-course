# TD-T16 learner manuscript

## Wave-5 tool gate walkthrough

为每个工具固定身份、tenant、scope、参数范围、approval、幂等键和审计字段；回放未认证、金额越界、跨租户、重复 request_id 四类 fault，策略必须在 adapter 前拒绝且写入数为零。诊断优先读服务端权限和 idempotency ledger，不把 Prompt 拒绝当权限证据。迁移到邮件工具只替换 recipient/attachment 规则，真实凭据和写端点仍需独立集成门禁。

```bash
cd materials/llm-agent-quality/learner-materials && python3 scripts/agent_quality_lab.py --topic TD-T16 --phase cycle --report-dir reports/TD-T16
```

## 在写动作之前证明身份、scope 与幂等键

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 退款工具调用候选，包括 tool_name、order_id、amount、tenant_id、actor、scope、approval_id、idempotency_key 和执行状态。。如果团队只看一个总分或最终回答，可能把混杂变量、越权动作、事实错误或重复副作用藏在绿色数字里。业务后果由人工负责人承担，因此被测模型、Judge 或 healer 不能批准自己的期望。

本页控制问题是：怎样把工具选择、参数 Schema、身份、tenant、scope 与 human approval 编成写前门禁，使 Agent 即使提出合理动作也不能越权执行？ 先把它翻译为决策：工具安全 owner 只在身份有效、tenant 匹配、参数通过 Schema、scope 最小且高风险动作获独立人工批准后发放单次执行 receipt。。这一步决定哪些证据是 blocker，谁能批准，什么情况必须 UNKNOWN，也决定后续 Prompt 应要求模型输出“候选与证据”，而不是“替负责人下结论”。

TD-T16 以退款工具候选调用为对象，把 tool name、参数 Schema、tenant、actor、scope、approval 和 idempotency key 排成写前链；学员交付授权 receipt，而不是凭合理参数放行。

## Runnable action

运行 TD-T16 的写前授权夹具；fault 将 `user_verified=false` 且执行 write，repair 必须恢复零直接写：

```bash
cd materials/llm-agent-quality/learner-materials
python3 scripts/agent_quality_lab.py --topic TD-T16 --phase cycle --report-dir reports/TD-T16
```

cycle 预期 `0 / 1 / 0`，逐项查看 `AUTH-BEFORE-ACTION`、`NO-DIRECT-WRITE` 和 approval receipt。

证据流必须是参数 Schema→身份/tenant→最小 scope→人工批准→单次 receipt→审计；优先统计先授权、越权阻断、重复副作用和审计完整率，任何写前缺口直接 fail-closed。

Prompt 包中的 system.md 限制模型权力；task.md 描述工作对象和证据格式；critic.md 专门查自批准、缺引用与先写后授权；output.schema.json 约束结构；eval.json 放 baseline、fault、missing-evidence 和 unauthorized-write 用例；mutation.json 放已知可杀死变异。模型供应商与模型名保持 NOT_RUN，避免静态包伪装真实调用。

## Failure and repair

故障症状可能是绿色总分、漂亮理由或成功最终文本，但第一诊断入口永远是命名 Oracle 与副作用日志。AUTH-BEFORE-ACTION 与 NO-DIRECT-WRITE 任一失败即拒绝；模型不能解释性地授予自己 scope 或伪造 approval。 若 fault 没有变红，说明评测缺乏检测力；若 repair 通过但 mutation 存活，说明修复制造了假绿；若 writes 在授权前出现，即使结果正确也必须失败。

安全修复顺序为：冻结写通道，保留原始报告与 hash，恢复最小权限，定位第一个被破坏不变量，再提交候选修复给人工 owner。回滚：吊销执行 receipt 和 token，撤销或补偿未授权动作，冻结工具并由安全 owner 对账审计日志。。禁止做法包括让模型改 expected、删除 assertion、无限重试、偷偷增加预算、用另一个同源 Judge 自证或把 NOT_RUN 写成 live。

完成后做迁移练习：迁移到代码 Agent 时保持身份、仓库 scope、参数 Schema 和合并批准，替换退款写为分支与 PR 操作。。迁移说明必须写出 source_context、target_context、保持的不变量、至少两项必须改变的配置和成功标准。最后由人检查 fault 是否仍稳定变红、repair 是否真正恢复控制、权限是否零扩大。当前结论只到 fixture-tested；真实 IAM、策略引擎、密钥轮换和补偿事务尚未连接；离线 fixture 只证明写前门禁契约。

### TD-T16 操作判断卡

先把 `refund:propose` 与 `refund:execute` 视为两个不同能力。
参数金额必须与订单币种和租户账本一致。
Schema 通过不等于业务授权通过。
tenant mismatch 应在策略层拒绝，而不是交给模型解释。
approval_id 必须绑定当前订单、操作者和风险等级。
idempotency_key 重放只能返回原 receipt。
任何 write timestamp 早于 authorization timestamp 都是 blocker。
审计记录要能从候选调用回到原始输入版本。
人工 owner 复核的是动作证据，不是模型的自述理由。
fault 报告中的 `write_executed=true` 必须保留，不能清理成示例。
repair 只改变授权中介，不能把 expected 改成实际行为。
迁移到代码 Agent 时，分支保护规则承担同样的人工批准职责。
迁移后的 scope 应从订单资源换成仓库和分支资源。
真实密钥轮换和补偿事务仍需隔离环境验证。

## 工具调用审查

工具测试的目标是证明错误动作没有越过执行边界，不是让模型输出漂亮 JSON。每个工具都要声明身份、tenant、scope、参数范围、幂等键、审批条件、可逆性和审计字段。先验证 policy receipt，再验证 adapter 没有写入；只看模型拒答会漏掉后端直达路径。把退款迁移成发邮件时替换收件人和附件策略，仍保持写前授权、最小权限和零副作用。

诊断顺序：模型拒绝却发生写入，查 adapter、服务端审计并证明 zero-write；金额越界，执行 Schema 和边界变异；重试两次副作用，按 request_id 对账并恢复唯一 receipt；跨租户读取，检查 token scope 与服务端 tenant enforcement。真实凭据、真实写端点和组织审批均 NOT_RUN，必须另开集成门禁。

案例工件：10 元退款被变异为 1000 元并重复 request_id。学员交 policy receipt、zero-write trace、幂等 ledger 和 repair diff；迁移到邮件工具时替换收件人域与附件边界，但保持写前授权、最小权限和幂等。
