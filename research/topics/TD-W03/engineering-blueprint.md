# TD-W03 engineering blueprint

## Architecture and data flow

本页采用六段显式数据流：冻结任务/Oracle → 锁定共享预算 → 单 Agent 重复运行 → 多 Agent 重复运行 → blocker/成本分布 → 架构决定。输入层读取版本化 input.json、system/task/critic Prompt、output.schema.json、eval.json 与 mutation.json；预检层先核对 topic ID、manifest hash、唯一 owner、身份/tenant/scope 和允许的副作用；执行层只运行标准库 fixture，不连接模型、浏览器、网络、队列或企业系统；观察层保存 phase、oracle_results、failed_oracle_ids、writes 与 NOT_RUN 能力；判定层由独立 Oracle 处理 blocker；决策层才把报告交给人工 owner。

工作对象是 固定研究任务集、single-agent arm、multi-agent arm、相同模型与只读工具、总 Token/时间/重试/人工干预预算、逐次结果与协调失败。。信任边界规定：不可信内容只能进入数据通道，不能改写 system policy；模型输出只能是候选；工具授权在模型外检查；Judge 与 healer 无权改 expected；所有写操作必须在 authorization receipt 之后。共享 bundle 使用 exact owners 列表，不用 TD-T 前缀推断所有权，避免跨 ID 污染。

版本闭包要求 Prompt、Input、Schema、Eval、Mutation 和 page manifest 都带明确版本；lab manifest 列出精确工作目录、命令、退出码与工件。canonical learner-materials、site/public 静态副本和 ZIP 必须相对路径集合、SHA-256 完全一致。任一缺文件或 hash 漂移都会阻断页面晋级。

## Metrics and decisions

同预算报告成功率分布、blocker、延迟、coordination failure、unit-success cost 和置信区间；不比较单次最好结果。 指标的顺序本身是门禁：先确认可比较性、权限和 blocker，再查看平均表现与成本。决策规则为 架构负责人只在实验 manifest 可比、重复运行分布显示超出噪声的收益、blocker 不增加且单位成功成本可接受时采用多 Agent；否则保留单 Agent 或 UNKNOWN。 每次决定要记录输入 hash、运行 ID、失败 Oracle、人工 owner、允许范围、回滚触发器与 residual risk。

Oracle 是 SAME-TOKEN-BUDGET 是可比性 blocker；任一工具、重试或人工救场不一致都使实验 confounded。。它不由被测模型生成或批准。模型理由只能辅助归因，不能覆盖确定性权限检查、业务事实或人工标签。若来源冲突，优先采用直接可复现的本地故障证据；若本地未运行，则标 Unknown，而不是从论文均值推断本场景结果。

可观察性最少包含每阶段开始/结束、锁定字段、权限 receipt、动作与参数、写计数、stop reason、预算消耗和工件 hash。报告同时保留 failed 与 passed Oracle，防止只输出一个绿色摘要。故障结果应稳定为 exit 1；baseline 与 repair 为 exit 0。

## Baseline failure repair

Baseline 读取固定 fixture，验证所有不变量并生成 baseline.json。Fault 注入：故障给 multi-agent arm 两倍 Token 预算后宣布更优；修复恢复 SAME-TOKEN-BUDGET 并把差异不足标 UNKNOWN。 runner 不捕获失败为成功，而是写出 fault.json 后以 1 退出，使 CI 和学员都能看到命名 Oracle。Repair 只恢复被破坏的控制，不改评测问题、不删断言、不扩大权限、不增加隐性预算；随后生成 repair.json 并以 0 退出。

诊断顺序是：先比 manifest/input hash，再看权限和 writes，然后定位第一个 failed_oracle_id，再核对轨迹与 stop reason，最后才看模型文本。回滚策略是：在无证据收益切片退回单 Agent，冻结多 Agent manifest，仅保留可复核研究候选与成本记录。。迁移规则是：迁移到软件开发任务时保持公平预算、任务分层和重复运行，替换研究工具为仓库只读工具和编译 Oracle。。迁移时必须至少修改业务对象、fixture 或 allowlist 中的两项，同时保持独立 Oracle、0/1/0 和人工权力。

这套蓝图只证明离线 contract 可执行。模型质量、浏览器稳定性、真实工具权限、队列重投、供应商费用与生产回滚均列为 NOT_RUN；缺少这些证据时不允许提升成熟度。


