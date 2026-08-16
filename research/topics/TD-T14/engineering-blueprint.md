# TD-T14 engineering blueprint

## Architecture and data flow

本页采用六段显式数据流：人工双标 → 盲化候选身份 → A/B 顺序翻转 → Judge 重复评分 → 分歧归因 → 风险分层与升级。输入层读取版本化 input.json、system/task/critic Prompt、output.schema.json、eval.json 与 mutation.json；预检层先核对 topic ID、manifest hash、唯一 owner、身份/tenant/scope 和允许的副作用；执行层只运行标准库 fixture，不连接模型、浏览器、网络、队列或企业系统；观察层保存 phase、oracle_results、failed_oracle_ids、writes 与 NOT_RUN 能力；判定层由独立 Oracle 处理 blocker；决策层才把报告交给人工 owner。

工作对象是 30 对退款答复校准集：顺序对、冗长风格对、政策事实错误对，以及两名领域人员的独立标签和裁决记录。。信任边界规定：不可信内容只能进入数据通道，不能改写 system policy；模型输出只能是候选；工具授权在模型外检查；Judge 与 healer 无权改 expected；所有写操作必须在 authorization receipt 之后。共享 bundle 使用 exact owners 列表，不用 TD-T 前缀推断所有权，避免跨 ID 污染。

版本闭包要求 Prompt、Input、Schema、Eval、Mutation 和 page manifest 都带明确版本；lab manifest 列出精确工作目录、命令、退出码与工件。canonical learner-materials、site/public 静态副本和 ZIP 必须相对路径集合、SHA-256 完全一致。任一缺文件或 hash 漂移都会阻断页面晋级。

## Metrics and decisions

分别报告人人一致性、人机一致性、position flip rate、fact blocker miss、理由可追溯率和升级率，不把单一一致率当准确率。 指标的顺序本身是门禁：先确认可比较性、权限和 blocker，再查看平均表现与成本。决策规则为 质量负责人基于人人一致性、人机分歧矩阵和反例命中率划定 Judge 可自动评分、需抽检和必须人工审批的范围；事实、安全、权限类永不由单一 Judge 放行。 每次决定要记录输入 hash、运行 ID、失败 Oracle、人工 owner、允许范围、回滚触发器与 residual risk。

Oracle 是 POSITION-STABLE 与 FACT-BLOCKER 任一失败即拒绝自动判定；被测 Judge 不能生成并批准自己的 reference 或 expected。。它不由被测模型生成或批准。模型理由只能辅助归因，不能覆盖确定性权限检查、业务事实或人工标签。若来源冲突，优先采用直接可复现的本地故障证据；若本地未运行，则标 Unknown，而不是从论文均值推断本场景结果。

可观察性最少包含每阶段开始/结束、锁定字段、权限 receipt、动作与参数、写计数、stop reason、预算消耗和工件 hash。报告同时保留 failed 与 passed Oracle，防止只输出一个绿色摘要。故障结果应稳定为 exit 1；baseline 与 repair 为 exit 0。

## Baseline failure repair

Baseline 读取固定 fixture，验证所有不变量并生成 baseline.json。Fault 注入：故障 Judge 在交换候选顺序后翻转胜负，并因答案流畅放过过期政策；修复启用顺序一致性检查与事实 blocker 独立 Oracle。 runner 不捕获失败为成功，而是写出 fault.json 后以 1 退出，使 CI 和学员都能看到命名 Oracle。Repair 只恢复被破坏的控制，不改评测问题、不删断言、不扩大权限、不增加隐性预算；随后生成 repair.json 并以 0 退出。

诊断顺序是：先比 manifest/input hash，再看权限和 writes，然后定位第一个 failed_oracle_id，再核对轨迹与 stop reason，最后才看模型文本。回滚策略是：撤回该 Judge 版本的自动门禁权限，恢复人工裁决，保留原始 prompt、输入顺序和理由用于重校准。。迁移规则是：迁移到代码评审 Judge 时保持双标、盲评、反例和升级机制，替换事实 blocker 为编译、安全和 API 契约。。迁移时必须至少修改业务对象、fixture 或 allowlist 中的两项，同时保持独立 Oracle、0/1/0 和人工权力。

这套蓝图只证明离线 contract 可执行。模型质量、浏览器稳定性、真实工具权限、队列重投、供应商费用与生产回滚均列为 NOT_RUN；缺少这些证据时不允许提升成熟度。

