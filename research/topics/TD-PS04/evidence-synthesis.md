# TD-PS04 Evidence Synthesis

## Fact

打开的规范与官方资料共同支持以下可核查事实：用户感知 locator 与显式 test id 负责定位，auto-wait 负责 actionability，API/账本负责业务 Oracle，独立上下文负责隔离，Trace 负责诊断。这些资料说明工具和协议的责任边界，却没有证明目标企业已经采用同样的版本、阈值、权限或运行环境。对本页场景“后台退款审批需跨 UI、订单 API、异步状态和审计记录完成”，必须分别观察输入契约、处理状态、独立 Oracle、失败证据和具名决策；只保存一次模型回答、截图或最终 PASS 都不足以形成专业结论。

本页固定四个独立 Oracle：批准控件角色名称与权限一致；重复点击只产生一次退款意图；UI 终态与订单 API 和审计记录一致；失败包含 DOM 网络控制台和 trace。它们由页级 owner 审批，并由确定性 runner 读取 manifest 执行。Prompt 只能把来源和历史失败转换成候选测试包，不能改写 Oracle、批准 waiver、删除 blocker 或将缺失信息补成事实。

## Cross-source synthesis

路线 A 从标准和官方文档出发，确定长期稳定的协议、测试控制和证据字段；路线 B 从 failure-first 角度检查工具盲区、环境差异与常见假绿。两条路线在“必须有版本化输入、独立 Oracle、可复现负控和失败后修复复跑”上达成一致。分歧在于工具文档通常强调可执行能力，而标准和反证资料强调适用条件；本课程裁决为先固定控制问题，再按风险选择工具，任何工具通过都不能越过业务 Oracle 和人工责任。

Baseline 使用已知良好 fixture；Fault 注入 退款 API 延迟后返回 500、重复点击、第三方通知失败 中的一个单变量；Repair 恢复同一输入和 Oracle。三阶段报告保存 page_id、owner、manifest hash、oracle_id、mode、status、failed rules 和 evidence boundary。Fault 预期非零退出是检测力证据，不是脚本故障。

## Inference

推断：把 读取旅程、角色、网络契约和风险矩阵，输出 locator 选择、等待信号、隔离数据、业务 Oracle 与失败证据；不得生成 fixed sleep 版本化，可减少漏项并让初学者复用专家检查顺序。这个推断必须用 mutation 发现率、失败可定位性和人工审查结果验证，不能从提示词文字本身推出有效性。共享 bundle 只复用 runner 和目录结构，页面场景、Oracle、Prompt、fault 与 owner 均独立，防止共享模板把不同专业问题压扁。

## Unknown

目标浏览器流量占比、第三方沙箱稳定性和真实页面可访问名称。这些未知项必须在迁移到目标环境时写入 baseline manifest，由对应系统 owner、数据/安全 owner 和发布 owner 决定。当前 evidence level 仅为 desk research 加确定性离线 fixture；没有 practitioner、真实设备、真实浏览器、真实数据库、真实集群或生产验证。
