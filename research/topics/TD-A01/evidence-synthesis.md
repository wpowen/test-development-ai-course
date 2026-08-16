# 普通 API 与 AI API：从确定性响应到版本化生成服务 evidence synthesis

## Fact

打开的 HTTP、OpenAPI、SSE、JSON Schema、AsyncAPI 与 CloudEvents 资料共同说明：协议形状、事件序列、终态和错误语义属于不同证据面，不能用最终文本相互替代。vLLM 与 NVIDIA 文档暴露首 Token、逐 Token、队列、缓存或请求结果等 Serving 指标，但这些定义并不自动给出某个业务的阈值。k6 的 open/closed 模型说明负载生成方式会改变观察到的到达行为。Google SRE 与 AWS 的过载、超时、重试和 jitter 指导说明恢复策略也可能放大故障。

对本页最重要的事实是：request_id 必须存在；公开版本变量齐全；不可见内部版本为 UNKNOWN；错误类别能驱动 retryable 决策。 这是可观测字段的条件，不是模型能力或生产安全证明。来源能定义协议、测量点、故障机制和责任框架；来源不能替目标组织决定错误成本、容量、安全余量、岗位设置或风险接受人。

## Cross-source synthesis

本页采用的方法是：保留 HTTP、鉴权、错误和幂等共同契约，再增加生成 Manifest、行为 Oracle、Token/成本和可靠性层。 选择理由不是追求更多指标，而是让一个失败能定位到唯一或有限的责任层。普通 API 的状态码和 Schema 仍然保留；AI API 额外记录模型/Prompt/Schema/Tool 版本、流式事件、Token 和行为证据；Serving 把 queue、prefill、decode、quality 和 cost 分开；职业迁移把岗位职责、自评和 evidence_ref 分开。

控制问题“怎样证明一次 AI API 结果来自哪组协议、模型、Prompt、上下文、采样、Schema、工具和区域变量，而不伪造供应商内部版本？”落到一个可执行判断：request_id 必须存在；公开版本变量齐全；不可见内部版本为 UNKNOWN；错误类别能驱动 retryable 决策。 主指标是 Manifest 完整率、UNKNOWN 诚实率、错误分类覆盖率。每个指标必须写明分子、分母、聚合、切片、采集点、版本与 owner。fixture 中使用精确值只为证明 mutation sensitivity，不能外推为生产阈值。

反例是：删除 request_id，并把不可见内部模型版本伪造为固定值。 如果只看最终 PASS、总延迟、GPU 利用率、证书数量或友好回答，反例会被隐藏。因此本页先运行 baseline，随后只改变声明的 fault 字段并要求 exit 1，最后恢复实现且不修改 Oracle。修复要求：恢复 request_id，把内部版本改回 UNKNOWN，同时保留可见模型别名、Prompt、Schema 和 Tool 版本。

职业页额外使用 O*NET、SFIA、ISTQB 与 NIST，把岗位描述、技能责任、测试基础和 AI 风险治理作为不同输入。它们支持能力映射，不支持承诺就业、薪资、晋升或某一公司岗位。Serving 页的容量数字一律写为 fixture-only。

## Unknown

供应商内部模型修订、路由、限额和区域实现没有公开可观察证据。 真实组织还需要确认流量分布、错误成本、数据/隐私等级、模型和硬件版本、工具权限、事件与指标可观测性、风险接受人。缺失字段保持 UNKNOWN、NOT_RUN 或 BLOCKED。本页实验为确定性离线 fixture：没有调用模型、供应商、GPU、队列、工具或招聘系统；PASS 只证明声明的 mutation 被门禁杀死。
