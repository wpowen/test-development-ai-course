# TD-PS01 Independent Comparison

## Agreements

路线 A（standards-and-official-docs）与路线 B（failure-first-and-counterevidence）都认同：怎样证明 202 响应、订单状态、退款账本和事件消费属于同一次合法取消，而不是只证明 HTTP 成功？ 必须由版本化输入、明确方法、独立 Oracle、负控和具名 owner 共同回答。两条路线均拒绝把工具运行成功、页面文字、HTTP 2xx、单一平均值或模型自评当作完整证据，也同意 baseline/fault/repair 使用同一 manifest 才可比较。

## Disagreements

路线 A 倾向从规范支持面建立检查清单，容易低估工具实现差异与目标系统边界；路线 B 从 服务端提交后客户端超时、重复退款事件、非 owner 取消 出发，更敏感于假绿，但若脱离标准可能产生只适用于一个事故的规则。工具文档描述“能做什么”，反证资料提醒“不能据此证明什么”。对 已支付未发货订单取消后异步退款，客户端超时重试不能生成第二笔退款，单靠任一路线都会遗漏方法选择理由或可执行形状。

## Adjudication

独立 reviewer 裁决为：保留路线 A 的协议和证据字段，采用路线 B 的单变量故障与 counterexample；以四个页级 Oracle 作为唯一自动门禁，Prompt 只能生成候选。共享 runner 明确 owner，不能携带跨页默认业务规则。最终设计是：分层使用 HTTP 语义、OpenAPI Schema、领域状态机、副作用账本和 Trace；因为任一单层都无法证明异步资金结果。被拒绝的替代方案包括“直接让模型生成 100 条用例”“让模型自己评分”“只跑 happy path”“失败后降低阈值”。

裁决不升级成熟度。目标支付网关幂等窗口、真实账本可查询性和业务延迟阈值 仍为 Unknown；真实工具、设备、数据库、集群或生产环境必须在 validation lane 重新运行，并由 practitioner 与责任人审查。comparison 由 course-owner 读取两个 run 的 source refs 后完成，不是 draft 自批。
