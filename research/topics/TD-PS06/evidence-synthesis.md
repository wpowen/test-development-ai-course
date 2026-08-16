# TD-PS06 Evidence Synthesis

## Fact

打开的规范与官方资料共同支持以下可核查事实：ViewModel/组件测试覆盖状态，Espresso idling 覆盖同步，UI Automator 覆盖系统权限，设备矩阵覆盖风险切片，服务端幂等账本提供独立 Oracle。这些资料说明工具和协议的责任边界，却没有证明目标企业已经采用同样的版本、阈值、权限或运行环境。对本页场景“仓库收货扫码经过相机权限、旋转、后台、进程恢复、离线队列和库存 API”，必须分别观察输入契约、处理状态、独立 Oracle、失败证据和具名决策；只保存一次模型回答、截图或最终 PASS 都不足以形成专业结论。

本页固定四个独立 Oracle：权限拒绝不创建收货记录；旋转后台与恢复保留可解释扫描状态；同一 receipt_id 只入账一次；失败包关联 logcat 设备状态和服务 trace。它们由页级 owner 审批，并由确定性 runner 读取 manifest 执行。Prompt 只能把来源和历史失败转换成候选测试包，不能改写 Oracle、批准 waiver、删除 blocker 或将缺失信息补成事实。

## Cross-source synthesis

路线 A 从标准和官方文档出发，确定长期稳定的协议、测试控制和证据字段；路线 B 从 failure-first 角度检查工具盲区、环境差异与常见假绿。两条路线在“必须有版本化输入、独立 Oracle、可复现负控和失败后修复复跑”上达成一致。分歧在于工具文档通常强调可执行能力，而标准和反证资料强调适用条件；本课程裁决为先固定控制问题，再按风险选择工具，任何工具通过都不能越过业务 Oracle 和人工责任。

Baseline 使用已知良好 fixture；Fault 注入 扫描后进程被杀、网络切换导致重放、相机权限永久拒绝 中的一个单变量；Repair 恢复同一输入和 Oracle。三阶段报告保存 page_id、owner、manifest hash、oracle_id、mode、status、failed rules 和 evidence boundary。Fault 预期非零退出是检测力证据，不是脚本故障。

## Inference

推断：把 读取 Android 生命周期、权限、设备矩阵和库存契约，输出分层测试、同步信号、状态恢复与服务端 Oracle；未运行设备写 NOT_RUN 版本化，可减少漏项并让初学者复用专家检查顺序。这个推断必须用 mutation 发现率、失败可定位性和人工审查结果验证，不能从提示词文字本身推出有效性。共享 bundle 只复用 runner 和目录结构，页面场景、Oracle、Prompt、fault 与 owner 均独立，防止共享模板把不同专业问题压扁。

## Unknown

OEM 定制行为、目标 API level 分布和真机资源限制。这些未知项必须在迁移到目标环境时写入 baseline manifest，由对应系统 owner、数据/安全 owner 和发布 owner 决定。当前 evidence level 仅为 desk research 加确定性离线 fixture；没有 practitioner、真实设备、真实浏览器、真实数据库、真实集群或生产验证。
