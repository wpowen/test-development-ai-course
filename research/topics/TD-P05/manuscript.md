# TD-P05：先建独立 Oracle，再写 TestPackage

## Professional problem — 用当前响应生成预期会制造自证假绿

如果订单取消接口返回 200，生成器便把 200 写成 expected；如果实现重复退款，模型又从日志归纳“允许重试产生多次退款”，所有 case 仍可能通过。TD-P05 要切断这条自证链：Oracle Registry 的依据只能是已批准业务规则、独立计算、不变量、状态模型或人工金标，并记录 owner、version、source_refs 与适用范围。

需求文档决定已发货拒绝、非 owner 禁止和退款不超过实付；技术设计只帮助确定在哪些层观察 HTTP、订单状态、账本与事件。风险决定方法：权限用决策表与负向契约，状态用状态转换，重复退款用属性/并发，异步完成用事件与最终一致性检查。每个 case 写 requirement_ids、risk_ids、method、oracle_ids、setup、action、observations 和 cleanup，而不是只给标题与步骤。

Prompt 输入应是批准的 Requirement Contract、Risk Test Plan 与 Oracle Registry，而不是源代码或实际响应。Schema 检查 TestPackage 结构；Eval 检查 traceability、风险覆盖和 Oracle 独立性；Mutation 把 expected_source 改为 implementation_output。只有检测到 SELF_CONFIRMING_ORACLE，才说明 Prompt/Eval 对假绿有抵抗力。

## Runnable action — 运行 TD-P05 自证 Oracle 负控制

在公开材料目录执行：

```bash
python3 pipeline.py page-cycle --page TD-P05 --report reports/TD-P05-cycle.json
```

预期三相退出 0/1/0。fault 报告必须包含 `finding_id=SELF_CONFIRMING_ORACLE` 和 `Expected result was derived from the implementation under test`。baseline 与 repair 应恢复批准的 oracle_id，并保存 prompt/input hash；不能通过删除受影响 case 或将 expected 改成“任意成功状态”回绿。

核对 `page-prompts/TD-P05/eval.json` 时，重点不是案例总数，而是是否存在“实现输出与批准规则冲突”的负例。若 Eval 只做 Schema 校验，TestPackage 格式再完整也不能判断语义。

## Failure and repair — Oracle 共同失败如何定位

fault 未红通常有三类根因：validator 没检查 expected_source；生成器把 source_refs 丢失后仍填默认值；同一模型既生成 expected 又担任 Judge。修复必须恢复独立依据，并对高风险金额/权限项安排具名 owner 复核。必要时用两个不同证据通道交叉验证，而不是简单换另一个模型。

repair 通过只证明确定性夹具能识别 implementation-derived expected。它没有证明模型会正确生成 TestPackage，也没有校准 Judge、接入真实支付系统或通过从业者、live、production 评审；证据保持 fixture-tested、provider none、model_status NOT_RUN。
## 反例与诊断

把实现当前返回的退款金额复制成 expected，会把实现错误锁死；让同一模型生成答案又担任 Judge，则可能共同漏掉权限失败。测试全绿但事故逃逸时，先核对 expected_source、Oracle owner/version/hash，再安排独立计算或高风险人工复核。

