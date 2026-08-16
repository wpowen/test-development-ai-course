# TD-X604｜模型路由、Provider Fallback 与工具协议漂移

## Professional problem：切换成功不等于原请求仍被正确执行

### Wave-2 fallback compatibility

每个 Provider 记录能力、Schema、权限、区域和成本合同。Fallback 不是无条件重试：降级模型可能不兼容工具或数据边界。保存 route trace、schema validation、tool permission 和 side-effect ledger；真实 Provider、容量、区域合规、MCP server 与生产副作用仍是 NOT_RUN。

主 Provider 超时后，路由器可能切到上下文更短、区域不允许或不支持结构化输出的模型；MCP/tool server 升级后，字段仍能解析，却改变了权限或副作用语义。最大的 risk 是把 fallback 当作透明重试，继承旧批准并重复不可逆动作。测试开发必须把每次路由看成新决策：重新匹配能力、区域、权限、Schema 和幂等条件。

本页 method 用请求能力合同约束 provider 候选，以版本化协议 Schema 校验工具调用，再用幂等键和 Trace 约束副作用。独立 Oracle 来自权限策略、工具协议和业务状态读回；路由模型不能自行宣布“等价”。

## Runnable action：让错误 fallback 与 Schema 漂移同时暴露

```bash
python3 advanced_quality_lab.py run --topic TD-X604 --phase baseline --report reports/td-x604-baseline.json
python3 advanced_quality_lab.py run --topic TD-X604 --phase fault --report reports/td-x604-fault.json
python3 advanced_quality_lab.py run --topic TD-X604 --phase repair --report reports/td-x604-repair.json
```

Prompt 根据请求能力、区域、权限和工具版本提出候选；Schema 保留 provider、协议版本、授权与 stop state；Eval 检查 capability match、protocol pin 和 fallback policy；Mutation 路由到能力不足的候选并注入工具 Schema 漂移。

## Failure and repair：为什么“还能返回 JSON”也必须失败

Baseline 退出 0，表示合成能力和协议合同可验证。Fault 必须退出 1，并列出 `capability_match`、`protocol_schema_pinned`、`fallback_policy_preserved`。若 fault 仍是 0，排查路由是否只检查 provider 可用性、解析器是否忽略未知字段、fallback 是否继承旧 token，或副作用重试是否缺少幂等读回。Repair 恢复满足能力的 provider，固定 Schema 并重新授权后退出 0。

0→1→0 只证明确定性合同能阻断这次降级，不证明供应商模型语义等价，也不证明生产容量稳定。

## 允许降级与必须阻断的分界

只有请求明确允许功能降级、权限重新确认、工具 Schema 匹配且副作用可安全重放时，才能继续。区域冲突、能力缺口、幂等未知或协议证据缺失应 BLOCKED。真实容量、价格、区域合规、模型等价性、MCP server 升级时序和 production 故障恢复仍是 UNKNOWN。

## 边界与练习

当前状态是 fixture-tested，`model_evidence=NOT_RUN`；未调用 live provider、真实工具或 practitioner 审核。练习时为“创建订单”写主模型与 fallback 的能力矩阵、MCP schema version、重新授权点、幂等键和最终订单读回；如果无法证明不会重复下单，就必须停止自动重试。
