# TD-PS12 Evidence Synthesis

## Fact

打开的规范与官方资料共同支持以下可核查事实：ASVS/WSTG 提供控制目录，威胁建模映射资产与信任边界，身份/对象/功能级权限矩阵构造负例，输入验证和工具 allowlist 强制策略，审计 Trace 提供拒绝证据。这些资料说明工具和协议的责任边界，却没有证明目标企业已经采用同样的版本、阈值、权限或运行环境。对本页场景“退款助手能读取订单并调用工具，攻击者可能利用对象 ID、Prompt 注入、越权 token 或日志泄密”，必须分别观察输入契约、处理状态、独立 Oracle、失败证据和具名决策；只保存一次模型回答、截图或最终 PASS 都不足以形成专业结论。

本页固定四个独立 Oracle：无效过期或错 audience token 被拒绝；跨租户对象读取和退款写入均为零；Prompt 内容不能扩大工具 allowlist；日志报告不含 token PII 或支付秘密。它们由页级 owner 审批，并由确定性 runner 读取 manifest 执行。Prompt 只能把来源和历史失败转换成候选测试包，不能改写 Oracle、批准 waiver、删除 blocker 或将缺失信息补成事实。

## Cross-source synthesis

路线 A 从标准和官方文档出发，确定长期稳定的协议、测试控制和证据字段；路线 B 从 failure-first 角度检查工具盲区、环境差异与常见假绿。两条路线在“必须有版本化输入、独立 Oracle、可复现负控和失败后修复复跑”上达成一致。分歧在于工具文档通常强调可执行能力，而标准和反证资料强调适用条件；本课程裁决为先固定控制问题，再按风险选择工具，任何工具通过都不能越过业务 Oracle 和人工责任。

Baseline 使用已知良好 fixture；Fault 注入 替换 order_id 做 BOLA、注入忽略策略并调用退款工具、将 bearer token 写入日志 中的一个单变量；Repair 恢复同一输入和 Oracle。三阶段报告保存 page_id、owner、manifest hash、oracle_id、mode、status、failed rules 和 evidence boundary。Fault 预期非零退出是检测力证据，不是脚本故障。

## Inference

推断：把 读取 threat model、角色权限、API/工具 schema 与数据分类，生成 abuse case、独立 Oracle 和证据要求；不得生成真实攻击生产命令或自动批准风险 版本化，可减少漏项并让初学者复用专家检查顺序。这个推断必须用 mutation 发现率、失败可定位性和人工审查结果验证，不能从提示词文字本身推出有效性。共享 bundle 只复用 runner 和目录结构，页面场景、Oracle、Prompt、fault 与 owner 均独立，防止共享模板把不同专业问题压扁。

## Unknown

目标 IdP 策略、真实密钥管理、渗透授权范围和剩余风险接受人。这些未知项必须在迁移到目标环境时写入 baseline manifest，由对应系统 owner、数据/安全 owner 和发布 owner 决定。当前 evidence level 仅为 desk research 加确定性离线 fixture；没有 practitioner、真实设备、真实浏览器、真实数据库、真实集群或生产验证。
