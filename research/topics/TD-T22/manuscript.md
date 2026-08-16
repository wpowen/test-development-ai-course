# Trace-to-Regression

## Professional problem — 原样复制生产 Trace 会泄密，过度脱敏又会删掉故障机制

一次越权工具事故包含 PII、租户标识和内部路径，不能直接进入课程或回归库；但若把角色、调用顺序和权限状态全部抹掉，case 再也无法重放。本页用最小充分表示法：保留触发机制、时序、策略结果与预期，替换身份和业务内容，并记录从 incident 到 synthetic case 的变换。

方法选择“隐私审查后再固化 regression”。Prompt 可帮助生成脱敏候选，但独立 Oracle 对照原事故不变量；Eval 检查 redaction、replayability 与 source_trace_linked；Mutation 断开 source trace 链接。未经隐私和领域 owner 批准的样例只能留在 investigation。

## Runnable action — 红灯验证可追溯性没有在脱敏中丢失

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-T22 --phase baseline
python3 scripts/run_lab.py --topic TD-T22 --phase fault
python3 scripts/run_lab.py --topic TD-T22 --phase repair
~~~

baseline exit 0 表示合成 regression 与来源记录相连；fault exit 1 应显示 source_trace_linked=false，专业动作是阻止该 case 进入长期 Gate；repair exit 0 只恢复链接字段。它不证明真实生产 Trace 已合法处理。

## Failure and repair — 检查失去的是隐私还是故障语义

fault 假绿时查看 incident_ref、transformation log、expected invariant 和 case hash 是否被 checker 消费。repair 仍失败时确认来源引用与合成字段属于同一版本。不能通过复制敏感 payload 获取可重放性，也不能用空模板伪造 closure；两种情况都应 fail-closed。

迁移到事故摘要助手时，保留“未授权角色→工具调用→状态写入”的机制，替换用户名、租户和内容。验收包括首次红灯、修复后绿灯、隐私 owner 与领域 owner 的独立签核位置。

### Evidence boundary

当前 PASS-FIXTURE 只验证 trace link 合同。没有读取生产日志、处理真实 PII、完成法律/隐私审批或运行事故系统；从业者有效性为 NOT_RUN。

## Trace-to-Regression 复盘

计算式 walkthrough：一条 Trace 有 14 个 span，首错在 span 6；只保留触发 span、身份、检索版本和工具参数，避免复制全部 14 个。让过期文档 mutation 使 policy Oracle 从 0 变 1，修复索引后同一 hash 回到 0；迁移到性能事故替换为 p95 breach，保留 source hash 和 owner。

Trace 先定位首个违反不变量的 span，保存 Prompt、检索、工具权限和模型快照，再抽取最小触发条件、Oracle、风险和 owner；不能复制最后一句错误回答。诊断用例无法重放查脱敏输入和版本，修复后不变红就重注入原 fault，含 PII 则隔离并补隐私 owner。迁移到 Agent 轨迹或性能事故只替换节点与 breach Oracle，trace→risk→test→receipt 不变。

边界：本页仅 fixture/static Trace 合同；真实 production log、model/provider、integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN。

案例工件：Trace 显示过期政策后调用 refund_order；提交 source hash、脱敏最小输入、首错 span、regression mutation 和修复 receipt。真实生产日志、模型/provider、integration、practitioner、learner observation、live/production/publication 均 NOT_RUN；仅 fixture/static evidence。
