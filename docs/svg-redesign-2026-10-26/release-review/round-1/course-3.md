# Course-3 独立内容与视觉审阅

共 27 张；PASS 16，REWORK 11。P1 0，P2 11，P3 13。P1/P2 阻断部署，P3 为非阻断润色。

## 审阅对象与方法

- 对象仅为 `output/svg-release-20261026/candidate/public`，没有把 public 正式旧图作为待审版本。
- 27 个输入条目的 screenshot 均使用 view_image(detail=original) 实际查看；不是用拼图或几何 PASS 代替逐图检查。
- 按每条 sourceRefs 定位 body-sources/course-3.json 实际正文，核对标题意图、关键节点、连线方向/条件、关键完整性、示例与未知边界。引用短句均在对应正文 block 中复核存在。
- 候选 SVG 的实际 SHA、剥离 metadata 后的渲染输入 SHA 及截图路径与 candidate/batch-verification.json 一致。render_sha256 是 SVG 渲染输入摘要，不是 PNG 摘要；另将已查看 PNG 的实际 SHA 写入每条 JSON，供后续防漂移。
- 参照实际查看的 `output/playwright/svg-redesign-2026-10-26/TD-M04.review.png`：字体、浅底、蓝色页眉、多色语义与分区基本连续。相较参考，部分图的宽阔留白没有用于隔离长程控制/反馈边，线路仍挤在中间。P2 针对已观察到的追踪困难，不以“零文字重叠”视为视觉通过，也不把缺图标或个人配色偏好升为阻断。
- 这是指定候选的代理内容/视觉审阅，不替代真人从业者或学习者验收，不构成部署授权；修复后需对新哈希对应截图重新 review。

## 逐图结论

| ID | 结论 | Findings | 正文核查 |
|---|---|---|---|
| TD-X601 | PASS | 无明确缺陷 | 伤害模型先于合法切片；最坏组 blocker 与独立人工/申诉两路约束具名决定，纠错回流方向正确；不宣称真实公平性评审。 |
| TD-T20 | REWORK | P2 | L0–L3 的不同触发时机、异常 fail-closed、artifact/退出码与人工发布门禁均在；未把本地退出码外推为远端保护分支生效。 |
| TD-T21 | PASS | P3 | 六类版本共同进入运行/决策账本，无虚构执行依赖；应用/评测 SHA、模型别名解析、索引及 scorer 均有，托管模型历史权重边界明确。 |
| TD-T22 | PASS | P3 | 过期退款政策示例有正文支持；隔离脱敏、最小触发、独立 policy、fault 红/repair 绿及关闭条件完整，无真实事故闭环声称。 |
| TD-T23 | PASS | 无明确缺陷 | 三维同 workload 独立硬门禁后再 Pareto/具名选点，未合成可抵消总分；没有伪造性能数值。 |
| TD-T24 | PASS | P3 | 确认变化来源后冻结；waiver 有 owner/范围/补偿/expiry，过期自动阻断；完整 manifest 回滚及回归后复基线方向正确。 |
| TD-X805 | PASS | 无明确缺陷 | 假设/MDE、稳定用户分流、离线准入、最坏切片与代表性人工抽样都约束扩量；下一阶梯有条件，未预设通用比例。 |
| TD-B01 | REWORK | P2 | 任务/数据/协议/模型-harness/scorer/聚合/限制七部分完整；抽取和解码写入协议，n/区间/业务距离明确，不把榜单当生产门禁。 |
| TD-B02 | REWORK | P2 | 四集合用途及不同更新纪律与正文一致；regression 不调优、holdout 按本地合同开封并重建，未承诺无偏真值。 |
| TD-B03 | PASS | P3 | 先落逐题账本再分确定性和 Judge；分栏、分母、pass@k/pass^k、聚类重复及样本不足均保留，未报告模型性能值。 |
| TD-B04 | PASS | P3 | 数据/模型及非实验参数锁定，A/B 只改单一协议变量，同题配对后有限归因；harness 版本变更另建基线，无虚构幅度。 |
| TD-B05 | PASS | P3 | 版本兼容、暴露、金丝雀和配对不确定性汇入可信度分类；间接泄漏/训练语料未知写明，未把未检出解释为无污染。 |
| TD-B06 | REWORK | P2 | 方法与内部业务风险分别输入；四类内部数据、员工基线、同预算 adapter、独立 blocker 与维护 owner 均在，公开分数不填补内部未知。 |
| TD-QP01 | PASS | P3 | 事件仅触发，Jira REST 权威回读后冻结 source pack；批准/冲突/权限准入及候选 source_ref、范围内人工批准执行完整；真实集成另验。 |
| TD-QP02 | REWORK | P2 | 当前 HEAD 到 jobs/聚合/合并三处校验，报告 digest/来源/有效期及缺失失败、SHA-bound 状态完整；无真实 GitLab 生效声称。 |
| TD-QP03 | REWORK | P2, P3 | 申请、独立 namespace、可复位依赖、最小权限、配额网络、运行、到期/取消回收与残留回读完整；配置不等于隔离生效。 |
| TD-QP04 | REWORK | P2 | 统一事件信封、去重、两本账、只补未完成动作、超时回读、DLQ 告警、脱敏通知与周期对账均有；事务边界及远端副作用未声称已验。 |
| TD-T25 | PASS | P3 | 风险追踪、数据与协议、独立 expected、三阶段红绿、hash 闭包、性能/waiver/rollback 与人工 RC 成熟度齐备；最多 PASS-FIXTURE。 |
| TD-C01 | PASS | 无明确缺陷 | 岗位行为和可复验基线定位五维差距；90 天工件/日期、独立复评及回流方向正确；企业资料保护和非就业承诺清晰。 |
| TD-AP01 | REWORK | P2 | 退款/查询/转人工三切片有正文实例；合法终态/副作用与 eligible/excluded、profile hash 及前提检查完整；真实容量 NOT_RUN。 |
| TD-AP02 | PASS | P3 | 计划起点、queue/model/tool/retry 观测、关键路径不重复相加、goodput 与终态/成本/副作用联合判定保留；缺失观测 UNKNOWN。 |
| TD-AP03 | PASS | P3 | 一任务一 root，子 span 与根上 finalize 区分；每次物理 attempt、独立 ledger、闭包/脱敏及缺终态 UNKNOWN 完整；未把边画成时间先后。 |
| TD-AP04 | REWORK | P2 | open/closed 同 workload/版本/deadline 对照，保留计划/发出/完成、遗漏分母及发压端资源检查；不由闭环结果承诺 SLO。 |
| TD-AP05 | REWORK | P2 | 首个 latency/quality/cost gate 失败之前的稳定档作为容量候选，信号支持/反证、单变量复验及同负载反馈正确；未迁移合成容量。 |
| TD-AP06 | PASS | P3 | 任务共享预算/绝对 deadline 与语义闸门共同准入；未知写先对账，重复/无审计阻断，预算耗尽走安全终态；真实幂等/补偿未声称已验。 |
| TD-AP07 | REWORK | P2 | 固定条件、趋势/快照/cleanup 联合判读平台期和泄漏候选；中途改变废弃结论，区间跨零不证明无泄漏；真实 soak NOT_RUN。 |
| TD-AP08 | PASS | P3 | good task 才进入 SLI 分子，终态/延迟/成本/副作用联合判定；多窗口燃烧到具名 runbook、恢复和回归闭环完整，无生产放行外推。 |

## 具体修改项

### TD-T20 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T20.svg`；SHA256：`026d06344919f0acbbfb8c27b7e2f8a015ec58b4380624a603a02d1ab4fbc30d`。

- **P2：四层证据汇聚与触发线混在同一中央走廊，主线难以连续追踪。**
  - 实际证据：A 区 PR→L3 的橙色斜线穿过 L1→Artifact 的紫色证据线；L0→Artifact 与 L1→Artifact 又在 L3 左侧相交，并以相近角度汇入 Artifact。上方和右侧有空白，但线路集中在 L0/L3/Artifact 之间。
  - 建议修复：将 L0–L3 排成同一层的四个并列分支；触发线与结果线分用上、下走廊，四路结果再进入独立汇聚节点。

### TD-T21 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T21.svg`；SHA256：`eeb7b2e2603918093570a8ef325df75770dee37a1ca21e559a25c9c6e915bbc4`。

- **P3：六路同色证据汇聚的局部弯线不够简洁。**
  - 实际证据：A 区 Prompt→Manifest 的弯线与 Dataset→Manifest 斜线在 Model/Runtime 右侧交叉；六个箭头集中在 Manifest 顶边。文字仍可读、方向仍可辨。
  - 建议修复：将六项版本做成同层输入或两侧对称输入，以短支线接共同汇聚总线，保留每项独立标签。

### TD-T22 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T22.svg`；SHA256：`87134c57c2d11a62e8ec09dc18711d7fdbec9440c41f9201c0a54014e7711271`。

- **P3：节点正文出现单字尾行，降低排版精致程度。**
  - 实际证据：字段分类/脱敏的“差异”被拆成“差 / 异”；CI 重放的“回绿”被拆成“回 / 绿”，两处均在原尺寸截图可见。
  - 建议修复：按词组主动断行，微调卡片宽度或缩短文案，避免词尾单字独占一行。

### TD-T24 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T24.svg`；SHA256：`3b268bb9d70b58d5b3e4c8bdd81f95ea1a4bee5fe1a72e8ebe3bbfd631ccf6ac`。

- **P3：复基线反馈线穿过下层决策线，且 Closure 卡片有单字尾行。**
  - 实际证据：A 区 Closure→版本化基线的绿色曲线穿过冻结→回滚的橙线及 waiver→回滚的红线；Closure 正文“恢复证据”末字另起一行。反馈颜色和方向仍可辨。
  - 建议修复：将反馈改走图外侧留白；在 Closure 内按完整短语断行。

### TD-B01 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B01.svg`；SHA256：`3b39a729a5d00a2a01df75f9ea20403d46329edfd10a228131772408e2d5f34d`。

- **P2：两条直接到报告的长程证据线打断了核心实验流水线。**
  - 实际证据：A 区“任务定义→Report”的紫色长斜线穿过 Protocol→Harness 的准入线、Harness→Scorer 的逐题输出线及 Scorer→Aggregation 的判分记录线；“业务距离声明”标签却放在 Dataset 下方，需跨多个交点回溯来源。
  - 建议修复：将任务/协议对报告的元数据绑定移到外侧走廊或报告附带的元数据栏；核心输入→执行→判分→聚合保持一条不被贯穿的主线。

### TD-B02 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B02.svg`；SHA256：`45c41c5286a0506e5f7c4fe133dad3fc1f2c05924df8cdcf0cb59af4765b581b`。

- **P2：四种并列数据角色被拆成两层，采样分流与审计汇聚在中间交错。**
  - 实际证据：A 区 Representative/Challenge 在第二行，Regression/Holdout 在第三行；采样→Regression 与采样→Holdout 的蓝线在 Challenge 左侧相交，并与 Representative→审计的紫线交叉。“按历史缺陷”“封存验收划分”“重采与版本”集中于这一狭窄区域。
  - 建议修复：将四类集合排成同一层或明确的同级 2×2 分组，采样侧和审计侧分别布线，避免把四类角色的关系画成上下穿插的流程。

### TD-B03 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B03.svg`；SHA256：`7a78b9c02ea80ab6f9a1c7ec839ae4deb56c0628a7ef335b4adf56399ee0a4cf`。

- **P3：指标卡片的自动断行割裂定义短语。**
  - 实际证据：Metric Calculator 中“分别定义”的“义”单独成行；Raw Ledger 的“可查”也拆成“可 / 查”。判分分流与分母含义本身正确。
  - 建议修复：将两句正文压缩或手动按语义换行，给 pass@k/pass^k 保留各自完整行。

### TD-B04 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B04.svg`；SHA256：`93d1b549515c505ca21841a4ceb786b0a381509c87ad672c263ad2e30cfe07e0`。

- **P3：A/B 并列实验条件在空间上缺少对称性。**
  - 实际证据：Variant A 位于右上，Variant B 位于左中，A 的“快照”还被拆为“快 / 照”；需借助 A 区说明才能迅速认出两者同级。
  - 建议修复：把 A/B 放在同一水平层、对称接入 Harness；锁定模型与数据单列为共享控制条件。

### TD-B05 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B05.svg`；SHA256：`7fdcbf7066c89423b8836bd9e04f1afb864e6836b900231469091b01ab575ac4`。

- **P3：历史可比性长线穿过两条审计输入线，局部不够利落。**
  - 实际证据：Version Compatibility→可信度分类的橙色曲线连续穿过 Candidate→Paired Uncertainty 和 Candidate→Sealed Canary 的蓝色线。标签分离且颜色不同，仍可追踪。
  - 建议修复：将版本兼容性分支与其余三类审计并排，或把长线放到外围单独走廊。

### TD-B06 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B06.svg`；SHA256：`0bd0ea3a0771db88f532fa772ceb5c87aa3d251349d1d1699ebf9103150c9a32`。

- **P2：公共方法控制线贯穿内部输入链，反馈与报告证据再次交叉。**
  - 实际证据：A 区“公共方法→Versioned Report”的橙色竖线穿过“风险→内部 Dataset”的蓝线及“Dataset→Adapter”的蓝线；底部“Owner→Dataset”绿色反馈又与“Scorer→Report”紫色线交叉。内部任务主线与外部方法约束无法分区阅读。
  - 建议修复：公共方法放为顶部控制带、业务数据与 adapter/scorer 形成独立主线；维护反馈走外侧，报告规范用短支线绑定 Report。

### TD-QP01 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP01.svg`；SHA256：`ae75ecffb9ab3b25538f10d4e263032552aa223cad29c89c058c7298d84175d5`。

- **P3：关键准入条件的断行不够整齐。**
  - 实际证据：Basis Gate 中“有权限”被拆为“有权 / 限”；Review Console 的中英文标题也跨行。无挡字，准入语义可读。
  - 建议修复：按“批准 / 冻结 / 无冲突 / 有权限”完整短语分行，调整卡片宽度或精简标题。

### TD-QP02 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP02.svg`；SHA256：`bf610f46117ebb982e01b4fe6fc66fd530a0c8cea2522aaad1a387ae137ecbec`。

- **P2：HEAD 控制线穿越证据链，且与聚合结论线同色相交。**
  - 实际证据：A 区 HEAD→Gate 的橙色长曲线从 Pipeline/Artifact 间穿过报告线，底部又与“聚合器→Status Check”的橙色虚线形成 X；顶部“HEAD→聚合器”也与 Inbox→Jobs 相交。图的核心是 SHA 绑定，但目前需要跨多处交点追踪绑定关系。
  - 建议修复：将当前 SHA 画成独立控制带，分别用短支线接 Jobs、聚合器和最终 Gate；流水线/产物/状态链保持连续。

### TD-QP03 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP03.svg`；SHA256：`bffc7ba8b134b45397e238d8fb49043c2462edefc1b2161507131d2a8f506cb1`。

- **P2：环境生命周期、准入和审计线路混用中央走廊。**
  - 实际证据：A 区“请求→Cleanup”竖虚线与“Provisioner→运行身份”及“运行身份→Runner”相交；“Provisioner→Audit”紫色竖线穿过 Quota→Runner 与身份→Runner；下方“身份→Audit”又与 Runner→Cleanup 相交。多条准入与旁路证据不能连续阅读。
  - 建议修复：生命周期放在一条主链；身份和配额并列约束 Runner；审计单列侧栏，TTL 独立走外侧，不贯穿运行区。
- **P3：技术标识符被从单词中间截断。**
  - 实际证据：运行身份节点标题把 ServiceAccount 拆成“Ser / viceAccount”。
  - 建议修复：按 Namespace、RBAC、ServiceAccount 三个完整词分行或简写标题，把全名放到说明。

### TD-QP04 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP04.svg`；SHA256：`773647b15880973ccbe0d54750ea80094aae5406cc92d6ba218f456dbfa27289`。

- **P2：状态机请求与适配器回执两条相反方向的线完全共线，无法独立阅读。**
  - 实际证据：A 区状态机与适配器之间，橙色“未完成动作”请求和绿色“回执或回读结果”反馈共享同一水平线，截图主要显示绿色线、两端不同色箭头。实际 SVG data-from=state/data-to=adapters 与反向 feedback 均在局部 y=499，证实不是单纯视觉接近。
  - 建议修复：请求与回执用上下两个端口/通道分别画出，标签贴近各自线段；把周期补偿反馈再放到外围，避免三类动作共用狭窄区域。

### TD-T25 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T25.svg`；SHA256：`e5a229ccc662995bc6e386f8a3bb630b7772ded0cef448426df27d42c2f1afde`。

- **P3：风险到 RC 的长斜线切过 Oracle→CI 控制线。**
  - 实际证据：A 区“需求追踪与 owner”紫色长线与“独立 expected”橙线交叉；PRD 卡片“负责人”和 Oracle 卡片“分层”也有单字尾行。线色和目标仍可辨。
  - 建议修复：把风险追踪作为 RC 的侧栏或外侧短连接；节点按完整词组断行。

### TD-AP01 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP01.svg`；SHA256：`e98027591ba99d87645a30b2ccfd6bef7417966ecd4a892e497bbe4a7cfd338c`。

- **P2：workload 的上行绑定与下行验收线挤在同一走廊，标签还落在另一条分层线上。**
  - 实际证据：A 区“Oracle→workload”橙线在 workload 下方紧贴“workload→压测前提检查”的紫色竖线；“带 hash 的合同”标签位于样本→转人工的蓝色斜线交叉位置；紫色验收线又与转人工→Oracle 的紫色线相交。
  - 建议修复：把三个业务切片同层排列，Oracle 与样本分布共同向下汇入 workload，再向下进入前提检查；取消先上返再下行的相向布线。

### TD-AP02 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP02.svg`；SHA256：`487cfe8ef529c5d5a12c819cc0c63f04d6c3ac820a20233cf2b61a608d2ea648`。

- **P3：Goodput 卡片正文存在单字尾行。**
  - 实际证据：Task Goodput Gate 中“副作用”被拆成“副作 / 用”。关键路径、UNKNOWN 与真实运行边界均可读。
  - 建议修复：缩短第二行或主动在“质量 / 成本 / 副作用”完整词组间断行。

### TD-AP03 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP03.svg`；SHA256：`8760ee3774e7ccf623238a0e9bb4ee9f73e91f7fa59476cfd435b5347420c622`。

- **P3：父子归属线与独立对账线发生交叉。**
  - 实际证据：A 区 ledger→审计的紫色竖线穿过 root→tool 的蓝色归属线；root→terminal 的竖线又穿过 queue→审计的紫线。颜色与标签仍能区分关系。
  - 建议修复：将终态事件放在根卡片内附属区，独立 ledger 和审计放同一侧，减少树与审计层的交叉。

### TD-AP04 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP04.svg`；SHA256：`6c91351c824085abe6a7545064b7644d44f3e0e950d3b4f5d18d3b22a07f559b`。

- **P2：对照实验没有形成两条清晰的并列阅读路径。**
  - 实际证据：A 区“合同→Open”的长橙弧线穿过 Closed→fixture 的蓝线；Open→fixture 横跨中间并经过 Closed→时钟账的紫色竖线。“相同任务集”“开环实验”和两处“计划与发出记录”集中在调度器下方，读者须来回追线才能区分两轮输入和观测。
  - 建议修复：Closed/Open 放成左右对称两列，共享合同居上；各自短线接独立观测端口，再汇入同一 fixture/对照结果，公共时钟账用下方汇聚带。

### TD-AP05 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP05.svg`；SHA256：`7bae98865c953cda52287355fd857e4f2d70af82dbb5baeea7bfa2b22845940b`。

- **P2：容量结论与瓶颈归因两条同色证据线在关键失败节点下相交。**
  - 实际证据：A 区“首失败→前一稳定台阶”和“观测信号→瓶颈候选”均为紫线，在首失败卡片下缘附近交叉；“取失败前稳定档”与“支持与反证”标签分布在该交点两侧，同色线路看起来形成分叉。
  - 建议修复：把容量裁决与瓶颈诊断分成两条泳道：首失败直接下接容量卡，观测侧路接瓶颈候选；复跑反馈走外围。

### TD-AP06 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP06.svg`；SHA256：`ce648814072a7032d9c6285b9b9dbba75fd3882a74673abcf9a809c188e1e4d8`。

- **P3：重试闸门的长程分支与分类线/预算反馈交错，版面可进一步简化。**
  - 实际证据：A 区 failure→semantic 蓝色弧线经过共享预算下方，与 retry→budget 绿色反馈相交；semantic→degrade 长橙线从 retry/reconcile 之间向下斜穿。仍能由颜色和条件标签辨认各分支。
  - 建议修复：闸门放中间，有限重试、未知写对账、安全终态三个出口并列；预算回扣反馈走外侧。

### TD-AP07 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP07.svg`；SHA256：`dc1d7f595d8d950b2d0a6a93892fbf5332f375d25d580fd5681ca232730107a3`。

- **P2：平台期与泄漏候选的证据线同色交叉，关键条件贴近交点。**
  - 实际证据：A 区“趋势→泄漏”的紫线与“快照→平台期”的紫线形成 X，“稳态持续正斜率”“检查有界性”集中在这一交点；右侧“条件改变”红线又跨过 cleanup→leak 的证据线。平台/泄漏是本图核心区分，目前依赖逐线追踪才能核对。
  - 建议修复：将趋势与快照先并入联合判读区，再用明确条件分别连接平台期/泄漏候选；实验污染走外侧独立红线。

### TD-AP08 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP08.svg`；SHA256：`efa3fbd587b13e7c18f5ed5f32cb7e9f686be747cab120a149f54f5bad923f26`。

- **P3：事故回流反馈穿过三段主流程。**
  - 实际证据：A 区 regression→evaluator 的绿色曲线穿过 budget→alert、alert→action 和 action→restore 的连接。绿色虚线仍与主流程明显区分，文字没有被遮挡。
  - 建议修复：回流放到图右侧或外围留白，主流程保持连续下行；恢复/回归正文按完整短语断行。

## 发布前交接

先修复所有 REWORK 图中的 P2 线路布局，再为修复后的实际 candidate SVG 重新生成绑定截图并 review。PASS 只适用于本报告记录的哈希；P3 可作为润色项处理。全部候选审阅收敛前，不据此替换正式资源或部署。
