# TD-PS03 Independent Comparison

## Agreements

路线 A（standards-and-official-docs）与路线 B（failure-first-and-counterevidence）都认同：怎样在部署前证明消费者字段兼容，并在运行时证明租户、幂等、死信和补偿没有静默失败？ 必须由版本化输入、明确方法、独立 Oracle、负控和具名 owner 共同回答。两条路线均拒绝把工具运行成功、页面文字、HTTP 2xx、单一平均值或模型自评当作完整证据，也同意 baseline/fault/repair 使用同一 manifest 才可比较。

## Disagreements

路线 A 倾向从规范支持面建立检查清单，容易低估工具实现差异与目标系统边界；路线 B 从 删除消费者字段、重复并乱序投递、策略版本拒绝失效 出发，更敏感于假绿，但若脱离标准可能产生只适用于一个事故的规则。工具文档描述“能做什么”，反证资料提醒“不能据此证明什么”。对 Checkout 发布 order.created，库存支付通知消费者异步处理并可能重复乱序，单靠任一路线都会遗漏方法选择理由或可执行形状。

## Adjudication

独立 reviewer 裁决为：保留路线 A 的协议和证据字段，采用路线 B 的单变量故障与 counterexample；以四个页级 Oracle 作为唯一自动门禁，Prompt 只能生成候选。共享 runner 明确 owner，不能携带跨页默认业务规则。最终设计是：消费者契约验证使用字段，AsyncAPI/CloudEvents 固定事件 envelope，权限矩阵验证租户，回放器验证重复乱序，Trace 验证补偿。被拒绝的替代方案包括“直接让模型生成 100 条用例”“让模型自己评分”“只跑 happy path”“失败后降低阈值”。

裁决不升级成熟度。目标 broker 投递保证、策略引擎版本和补偿 owner 仍为 Unknown；真实工具、设备、数据库、集群或生产环境必须在 validation lane 重新运行，并由 practitioner 与责任人审查。comparison 由 course-owner 读取两个 run 的 source refs 后完成，不是 draft 自批。
