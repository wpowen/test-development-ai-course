# TD-PS10 Independent Comparison

## Agreements

路线 A（standards-and-official-docs）与路线 B（failure-first-and-counterevidence）都认同：怎样证明每层 deadline 和 retry budget 有界，过载时安全拒绝或只读降级，恢复后不会产生洪峰与重复副作用？ 必须由版本化输入、明确方法、独立 Oracle、负控和具名 owner 共同回答。两条路线均拒绝把工具运行成功、页面文字、HTTP 2xx、单一平均值或模型自评当作完整证据，也同意 baseline/fault/repair 使用同一 manifest 才可比较。

## Disagreements

路线 A 倾向从规范支持面建立检查清单，容易低估工具实现差异与目标系统边界；路线 B 从 模型 429 与工具超时叠加、多层同时重试、恢复时流量洪峰 出发，更敏感于假绿，但若脱离标准可能产生只适用于一个事故的规则。工具文档描述“能做什么”，反证资料提醒“不能据此证明什么”。对 订单助手依赖模型、检索和退款工具，局部超时可能触发多层重试与队列级联，单靠任一路线都会遗漏方法选择理由或可执行形状。

## Adjudication

独立 reviewer 裁决为：保留路线 A 的协议和证据字段，采用路线 B 的单变量故障与 counterexample；以四个页级 Oracle 作为唯一自动门禁，Prompt 只能生成候选。共享 runner 明确 owner，不能携带跨页默认业务规则。最终设计是：deadline 传播控制等待，指数退避+jitter 降低同步重试，retry budget 限制放大，熔断和 load shedding 保护容量，只读 fallback 保护资金副作用。被拒绝的替代方案包括“直接让模型生成 100 条用例”“让模型自己评分”“只跑 happy path”“失败后降低阈值”。

裁决不升级成熟度。目标供应商 Retry-After、真实队列容量和业务降级文案 仍为 Unknown；真实工具、设备、数据库、集群或生产环境必须在 validation lane 重新运行，并由 practitioner 与责任人审查。comparison 由 course-owner 读取两个 run 的 source refs 后完成，不是 draft 自批。
