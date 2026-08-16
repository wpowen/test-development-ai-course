# TD-PS08 Independent Comparison

## Agreements

路线 A（standards-and-official-docs）与路线 B（failure-first-and-counterevidence）都认同：怎样证明迁移前后行数、键、金额、状态语义和 CDC offset 一致，并在部分失败时安全停止或回滚？ 必须由版本化输入、明确方法、独立 Oracle、负控和具名 owner 共同回答。两条路线均拒绝把工具运行成功、页面文字、HTTP 2xx、单一平均值或模型自评当作完整证据，也同意 baseline/fault/repair 使用同一 manifest 才可比较。

## Disagreements

路线 A 倾向从规范支持面建立检查清单，容易低估工具实现差异与目标系统边界；路线 B 从 回填跳过一个分片、CDC offset 回退产生重复、旧消费者读取已删除字段 出发，更敏感于假绿，但若脱离标准可能产生只适用于一个事故的规则。工具文档描述“能做什么”，反证资料提醒“不能据此证明什么”。对 订单表从 status 字符串迁移到 status_code 与状态维表，同时进行双读、回填和 CDC，单靠任一路线都会遗漏方法选择理由或可执行形状。

## Adjudication

独立 reviewer 裁决为：保留路线 A 的协议和证据字段，采用路线 B 的单变量故障与 counterexample；以四个页级 Oracle 作为唯一自动门禁，Prompt 只能生成候选。共享 runner 明确 owner，不能携带跨页默认业务规则。最终设计是：expand-contract 降低兼容风险，约束与 checksum 验证静态完整性，分片回填和高水位验证进度，CDC 对账处理并发变化，影子读比较语义。被拒绝的替代方案包括“直接让模型生成 100 条用例”“让模型自己评分”“只跑 happy path”“失败后降低阈值”。

裁决不升级成熟度。目标数据规模、锁等待、复制延迟、业务可接受停机窗口 仍为 Unknown；真实工具、设备、数据库、集群或生产环境必须在 validation lane 重新运行，并由 practitioner 与责任人审查。comparison 由 course-owner 读取两个 run 的 source refs 后完成，不是 draft 自批。
