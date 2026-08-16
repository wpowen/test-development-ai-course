# AI Serving 负载与容量：从 Token 分布到 SLO 拐点 evidence synthesis

## Fact

打开的 HTTP、OpenAPI、SSE、JSON Schema、AsyncAPI 与 CloudEvents 资料共同说明：协议形状、事件序列、终态和错误语义属于不同证据面，不能用最终文本相互替代。vLLM 与 NVIDIA 文档暴露首 Token、逐 Token、队列、缓存或请求结果等 Serving 指标，但这些定义并不自动给出某个业务的阈值。k6 的 open/closed 模型说明负载生成方式会改变观察到的到达行为。Google SRE 与 AWS 的过载、超时、重试和 jitter 指导说明恢复策略也可能放大故障。

对本页最重要的事实是：计划到达数等于完成、失败、dropped 和仍排队之和；SLO 破坏后停止；容量以 Goodput 判定。 这是可观测字段的条件，不是模型能力或生产安全证明。来源能定义协议、测量点、故障机制和责任框架；来源不能替目标组织决定错误成本、容量、安全余量、岗位设置或风险接受人。

## Cross-source synthesis

本页采用的方法是：open-loop 保持外部到达并记录 dropped arrivals；closed-loop 仅诊断单用户上限；阶梯实验每级只改到达率。 选择理由不是追求更多指标，而是让一个失败能定位到唯一或有限的责任层。普通 API 的状态码和 Schema 仍然保留；AI API 额外记录模型/Prompt/Schema/Tool 版本、流式事件、Token 和行为证据；Serving 把 queue、prefill、decode、quality 和 cost 分开；职业迁移把岗位职责、自评和 evidence_ref 分开。

控制问题“怎样固定到达率、Token 长度、缓存、场景和质量条件，找到 fixture 的 Goodput 拐点且不发生 coordinated omission？”落到一个可执行判断：计划到达数等于完成、失败、dropped 和仍排队之和；SLO 破坏后停止；容量以 Goodput 判定。 主指标是 到达守恒、Goodput 拐点、安全余量、dropped arrivals。每个指标必须写明分子、分母、聚合、切片、采集点、版本与 owner。fixture 中使用精确值只为证明 mutation sensitivity，不能外推为生产阈值。

反例是：删除 dropped arrivals，并只用完成请求作为容量分母。 如果只看最终 PASS、总延迟、GPU 利用率、证书数量或友好回答，反例会被隐藏。因此本页先运行 baseline，随后只改变声明的 fault 字段并要求 exit 1，最后恢复实现且不修改 Oracle。修复要求：恢复到达账本和排队项，把失败与 dropped 纳入分母。

职业页额外使用 O*NET、SFIA、ISTQB 与 NIST，把岗位描述、技能责任、测试基础和 AI 风险治理作为不同输入。它们支持能力映射，不支持承诺就业、薪资、晋升或某一公司岗位。Serving 页的容量数字一律写为 fixture-only。

## Unknown

没有网络、模型、GPU、调度器或生产流量，不能外推真实容量。 真实组织还需要确认流量分布、错误成本、数据/隐私等级、模型和硬件版本、工具权限、事件与指标可观测性、风险接受人。缺失字段保持 UNKNOWN、NOT_RUN 或 BLOCKED。本页实验为确定性离线 fixture：没有调用模型、供应商、GPU、队列、工具或招聘系统；PASS 只证明声明的 mutation 被门禁杀死。
