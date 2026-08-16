# Harness 敏感性：证据综合

## Fact

OpenAI Evals 将 evaluation 描述为数据源配置、测试标准/graders 与可重复运行；这支持把评测从聊天印象拆成版本化结构，但不支持任何企业阈值。lm-evaluation-harness 把任务、模型适配器与运行配置显式化；HELM 强调标准化数据、统一模型接口、逐样例检查和超越 accuracy 的指标；SWE-bench 把真实问题、仓库环境和测试判定结合。这些来源共同支持一个事实：Benchmark 分数依赖任务、数据、协议、系统和 Scorer 的组合。

NIST AI RMF 的 MAP/MEASURE/MANAGE 要求记录场景、风险容忍、测试验证和残余风险；GenAI Profile 把治理放到整个生命周期。ML Test Score 指出小型离线实验不足以证明生产就绪。OpenTelemetry GenAI 语义约定把模型、token、finish reason、tool 调用与 Trace 连接。这些来源支持可观察、可回放、有人负责的质量系统，不支持模型自动批准 waiver 或发布。

## Cross-source synthesis

针对 `TD-B04`，跨来源工程综合是：一次只归因一个协议变量；多变量变化输出 CONFOUNDED。 具体工作面是 单变量实验、锁定 Manifest、paired task flips 与资源差异。传统测试的 test basis、独立 Oracle、负控、回归、退出码和事故闭环仍有效；AI 场景扩张了版本图、概率性多次运行、检索/工具轨迹、Judge 校准、数据污染和成本/延迟分布。

反例 `同时开放工具、延长超时和改 system prompt 后，把提升归因给模型。` 会改变行动：先保存 manifest 和 raw record，再定位第一个破坏合同的组件；不能先改 Prompt 或平均阈值。度量 `paired flips、effect size、variance、tool calls、timeouts 与 cost delta` 必须声明测量点、分母、切片、聚合、版本、owner 与失败动作。高风险 blocker 不允许被许多简单样例平均抵消。

## Unknown

公开 Harness 与真实模型适配器均未运行。 来源也不能给出目标公司的流量、事故频率、权限模型、可接受误报、定价、SLO、隐私分类、真实 Judge 对齐或发布 owner。它们保持 UNKNOWN/NOT_RUN。课程不能用一般方法论伪装成现场证据。

## Counterevidence

公开 Benchmark 的透明和可重复性不能自动解决训练污染、任务代表性或企业适配；隐藏测试不能保证无人泄露；重复运行不能替代正确 Oracle；Trace 丰富也会增加隐私风险。最终方案因此保留访问控制、限制、逐题证据与人类责任。
