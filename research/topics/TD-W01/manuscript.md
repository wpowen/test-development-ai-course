# TD-W01 learner manuscript

```bash
cd materials/llm-agent-quality/learner-materials && python3 scripts/agent_quality_lab.py --topic TD-W01 --phase cycle --report-dir reports/TD-W01
```

## 按控制权和状态所有权区分 Agent、Worker、Workflow

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 内容发布系统的 deterministic router、自主 Agent loop、异步队列 Worker、持久 Workflow state、身份 token 与 human owner。。架构分类若只剩一个总分，可能遮住 Worker 重投递、Agent 越权或 Workflow 孤儿状态；被测模型、Judge 与 healer 因而不能批准自己的期望。

本页控制问题是：怎样根据下一步控制权、状态所有权和副作用提交点区分 Agent、Worker 与 Workflow，并为每类选择不同测试 Oracle 和权限？ 先把它翻译为决策：架构与质量负责人共同确认每个组件的控制权分类、状态 owner、身份和副作用边界；术语或目录名不能代替运行语义。。blocker 是分类证据、状态 owner、token scope 与副作用提交点，缺任一项就 UNKNOWN；Prompt 要求组件候选与证据，而不是替负责人下结论。

TD-W01 以退款编排中的 router、policy selector 和 audit writer 为三种组件样本；分类依据是下一步控制权、状态所有权和副作用提交点，而不是“用了模型”这个标签。

## Runnable action

进入材料目录，先运行 baseline 命令，打开报告核对 topic、phase、oracle_results、failed_oracle_ids、writes 和 evidence_boundary。然后运行 fault：它必须稳定返回 1，并说明 故障把异步 audit Worker 误分类为 Agent，漏测 redelivery 与幂等；修复恢复 Worker 分类和重复投递 Oracle。。最后运行 repair：它必须返回 0，但修复只能恢复组件边界，不能删除 Oracle 或修改 expected。cycle 命令把三个阶段串起来并验证内部退出码恰为 0/1/0。

运行前先画出证据流：业务步骤 → 控制权分类 → 状态 owner → 消息/工具接口 → 副作用提交点 → 专属 Oracle 与权限。重点核验输入快照、每类组件的 identity scope、独立 Oracle、能批准架构变更的 owner 与回滚路径。指标解释为：分别统计 deterministic branch coverage、agent policy violation、worker redelivery/idempotency、workflow orphan-state 和边界误分类。。任一权限、版本或命名 Oracle 缺失，就 fail-closed。

TD-W01 的 eval 放状态 owner 混淆和副作用错配，mutation 固定 audit writer 误分类；critic 要求写出组件边界和人工 owner，provider/model 为 NOT_RUN。

## Failure and repair

组件诊断先读控制权 trace、状态 owner 和副作用日志；名字含 Agent 不能覆盖运行证据。WORKER-CLASSIFIED 必须根据队列触发、无自主规划和幂等副作用成立。若 fault 没有变红，说明评测缺乏检测力；若 repair 通过但 mutation 存活，说明修复制造了假绿；若 writes 在授权前出现，即使结果正确也必须失败。

安全修复顺序为：冻结跨组件写通道，保留状态与消息 hash，恢复最小权限，定位第一个被破坏不变量，再提交边界修复给人工 owner。回滚：恢复组件独立身份和状态 owner，停用跨组件共享高权限 token，并重放未确认消息。。禁止让模型改 expected、删除 assertion、无限重试、偷偷增加预算、用同源 Judge 自证或把 NOT_RUN 写成 live。

完成后做迁移练习：迁移到订单系统时保持控制权/状态/副作用三问，替换 router、履约 Worker 和异常处理 Agent。。迁移说明必须写出 source_context、target_context、保持的不变量、至少两项必须改变的配置和成功标准。最后由人检查 fault 是否仍稳定变红、repair 是否真正恢复控制、权限是否零扩大。当前结论只到 fixture-tested；真实组织拓扑、队列语义、框架隐式重试和跨团队 owner 尚未审查；fixture 只证明分类方法。

### TD-W01 组件边界卡

Workflow 持有全局状态和下一步控制权。
Agent 持有策略选择但不应直接提交共享副作用。
Worker 持有队列任务、重试与幂等 receipt。
分类表必须写明状态 owner 和提交点。
共享 token 会模糊责任边界，应在设计阶段拒绝。
audit writer 若由 Agent 执行，审计可信度立即下降。
误分类 mutation 要改变状态 owner，而不是只换组件名称。
每个组件都要有独立的输入、输出和失败 Oracle。
handoff 需要明确接收 owner 与权限范围。
队列重投由 Worker 处理，不能让 Agent 无限规划。
迁移到订单系统时，履约 Worker 和异常 Agent 的账本必须分开。
真实 broker、隐式重试和组织 owner 仍需现场验证。
