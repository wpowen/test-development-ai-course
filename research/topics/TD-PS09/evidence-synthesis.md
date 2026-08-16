# TD-PS09 Evidence Synthesis

## Fact

打开的规范与官方资料共同支持以下可核查事实：open-loop arrival 保持外部到达，closed-loop 诊断单用户上限，分阶段 Trace 定位 queue/model/tool，风险切片阻止均值掩盖，Goodput 将质量安全纳入容量。这些资料说明工具和协议的责任边界，却没有证明目标企业已经采用同样的版本、阈值、权限或运行环境。对本页场景“客服 Agent 同时处理 FAQ 和高风险退款长对话，包含检索和工具 fan-out”，必须分别观察输入契约、处理状态、独立 Oracle、失败证据和具名决策；只保存一次模型回答、截图或最终 PASS 都不足以形成专业结论。

本页固定四个独立 Oracle：到达率与 dropped iterations 可核对；每任务阶段时间相加可解释 E2E；只有质量安全延迟同时合格进入 Goodput；失败重试和工具调用计入 cost_per_success。它们由页级 owner 审批，并由确定性 runner 读取 manifest 执行。Prompt 只能把来源和历史失败转换成候选测试包，不能改写 Oracle、批准 waiver、删除 blocker 或将缺失信息补成事实。

## Cross-source synthesis

路线 A 从标准和官方文档出发，确定长期稳定的协议、测试控制和证据字段；路线 B 从 failure-first 角度检查工具盲区、环境差异与常见假绿。两条路线在“必须有版本化输入、独立 Oracle、可复现负控和失败后修复复跑”上达成一致。分歧在于工具文档通常强调可执行能力，而标准和反证资料强调适用条件；本课程裁决为先固定控制问题，再按风险选择工具，任何工具通过都不能越过业务 Oracle 和人工责任。

Baseline 使用已知良好 fixture；Fault 注入 工具 fan-out 翻倍、队列饱和并丢迭代、重试掩盖失败并放大成本 中的一个单变量；Repair 恢复同一输入和 Oracle。三阶段报告保存 page_id、owner、manifest hash、oracle_id、mode、status、failed rules 和 evidence boundary。Fault 预期非零退出是检测力证据，不是脚本故障。

## Inference

推断：把 从 workload、任务切片、SLO 和成本模型生成 open/closed 场景、阶段指标和容量判定；禁止发明通用阈值或忽略失败成本 版本化，可减少漏项并让初学者复用专家检查顺序。这个推断必须用 mutation 发现率、失败可定位性和人工审查结果验证，不能从提示词文字本身推出有效性。共享 bundle 只复用 runner 和目录结构，页面场景、Oracle、Prompt、fault 与 owner 均独立，防止共享模板把不同专业问题压扁。

## Unknown

目标模型硬件、provider 内部队列、真实流量分布和价格。这些未知项必须在迁移到目标环境时写入 baseline manifest，由对应系统 owner、数据/安全 owner 和发布 owner 决定。当前 evidence level 仅为 desk research 加确定性离线 fixture；没有 practitioner、真实设备、真实浏览器、真实数据库、真实集群或生产验证。
