# TD-W03 learner manuscript

```bash
cd materials/llm-agent-quality/learner-materials && python3 scripts/agent_quality_lab.py --topic TD-W03 --phase cycle --report-dir reports/TD-W03
```

## 在相同预算下比较单 Agent 与多 Agent

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 固定研究任务集、single-agent arm、multi-agent arm、相同模型与只读工具、总 Token/时间/重试/人工干预预算、逐次结果与协调失败。。如果团队只看一个总分或最终回答，可能把混杂变量、越权动作、事实错误或重复副作用藏在绿色数字里。业务后果由人工负责人承担，因此被测模型、Judge 或 healer 不能批准自己的期望。

本页控制问题是：怎样在相同模型、任务、总 Token、工具、重试和人工干预预算下比较单 Agent 与多 Agent，避免把更多资源误写成架构收益？ 先把它翻译为决策：架构负责人只在实验 manifest 可比、重复运行分布显示超出噪声的收益、blocker 不增加且单位成功成本可接受时采用多 Agent；否则保留单 Agent 或 UNKNOWN。。这一步决定哪些证据是 blocker，谁能批准，什么情况必须 UNKNOWN，也决定后续 Prompt 应要求模型输出“候选与证据”，而不是“替负责人下结论”。

TD-W03 把研究任务、只读工具、总 Token、重试次数和人工干预预算锁成单/多 Agent 两个 arm；只有重复运行分布和单位成功成本都可比，架构收益才可讨论。

## Runnable action

进入材料目录，先运行 baseline 命令，打开报告核对 topic、phase、oracle_results、failed_oracle_ids、writes 和 evidence_boundary。然后运行 fault：它必须稳定返回 1，并说明 故障给 multi-agent arm 两倍 Token 预算后宣布更优；修复恢复 SAME-TOKEN-BUDGET 并把差异不足标 UNKNOWN。。最后运行 repair：它必须返回 0，但修复只能恢复控制，不能删除 Oracle 或修改 expected。cycle 命令把三个阶段串起来并验证内部退出码恰为 0/1/0。

运行前先画出证据流：冻结任务/Oracle → 锁定共享预算 → 单 Agent 重复运行 → 多 Agent 重复运行 → blocker/成本分布 → 架构决定。接着问五个问题：输入版本是否冻结；身份与 scope 是否在写之前核验；哪个 Oracle 独立于模型；哪个人工 owner 能批准；失败后如何回滚。指标解释为：同预算报告成功率分布、blocker、延迟、coordination failure、unit-success cost 和置信区间；不比较单次最好结果。。只要权限、版本或命名 Oracle 缺失，就 fail-closed。

TD-W03 的 eval 放 token/tool/task 预算不一致和重复运行不足，mutation 固定 multi arm 的 token 翻倍；critic 拒绝单次最好结果，provider/model 保持 NOT_RUN。

## Failure and repair

故障症状可能是绿色总分、漂亮理由或成功最终文本，但第一诊断入口永远是命名 Oracle 与副作用日志。SAME-TOKEN-BUDGET 是可比性 blocker；任一工具、重试或人工救场不一致都使实验 confounded。 若 fault 没有变红，说明评测缺乏检测力；若 repair 通过但 mutation 存活，说明修复制造了假绿；若 writes 在授权前出现，即使结果正确也必须失败。

安全修复顺序为：冻结写通道，保留原始报告与 hash，恢复最小权限，定位第一个被破坏不变量，再提交候选修复给人工 owner。回滚：在无证据收益切片退回单 Agent，冻结多 Agent manifest，仅保留可复核研究候选与成本记录。。禁止做法包括让模型改 expected、删除 assertion、无限重试、偷偷增加预算、用另一个同源 Judge 自证或把 NOT_RUN 写成 live。

完成后做迁移练习：迁移到软件开发任务时保持公平预算、任务分层和重复运行，替换研究工具为仓库只读工具和编译 Oracle。。迁移说明必须写出 source_context、target_context、保持的不变量、至少两项必须改变的配置和成功标准。最后由人检查 fault 是否仍稳定变红、repair 是否真正恢复控制、权限是否零扩大。当前结论只到 fixture-tested；真实模型随机性、并行限流、通信成本、任务泄露和长期维护成本尚未运行；fixture 不证明多 Agent 更优。

### TD-W03 公平实验判断卡

两条实验臂必须读取同一份任务快照和同一版本的独立 Oracle，不能让多 Agent 获得额外事实输入。
预算锁定模型 token、工具调用次数、重试上限和人工介入额度，报告中逐项列出消耗。
重复次数不足以覆盖随机性时，结论标记为 UNKNOWN，而不是用一次成功运行代表平均表现。
通信开销按每个成功任务的消息数和延迟计量，不能从质量分数里隐去。
除完成率外，记录 coordination failure、task leakage、rework 和 owner escalation 四类失败。
比较前先检查两臂的阻塞分布；若一臂因权限未配置而全失败，不得称为模型能力差异。
mutation 将多 Agent 的共享上下文截断或重复发送，预期 Oracle 能发现信息泄漏和预算膨胀。
repair 重跑两条实验臂并复用同一任务快照，避免只修复优势臂造成选择偏差。
人工 owner 不能同时修改多 Agent 期望值并批准结论，审批身份必须独立记录。
迁移到软件开发时，编译和静态检查是统一 Oracle，仓库写权限与分支保护必须保持对称。
真实模型随机性、并行限流、通信成本和长期维护成本尚未实测，相关字段仍为 NOT_RUN。
fixture 只证明实验协议和失败可见性，不能证明多 Agent 在生产任务上更优。

## 公平对照与复杂度决策

多 Agent 不能靠额外 token、工具或人工救场制造优势。先生成共享 manifest，锁定任务集、模型快照、工具 scope、总 token、时间、重试和人工干预，再分别多次运行，保存每题成功、协作冲突、轨迹长度、成本和 blocker。收益只在跨服务切片成立时，才对该切片启用编排；区间重叠或依赖额外人工时结论为 UNKNOWN。

诊断顺序：成功率更高但 token 翻倍，核对总预算和单位成功成本；reviewer 重复 planner，检查消息增量和交接 schema；只在一个样例提升，扩大同类任务并报区间；人工频繁救场，把干预纳入两组相同预算。迁移到研究或测试生成只替换任务和 Oracle，公平约束不变。
