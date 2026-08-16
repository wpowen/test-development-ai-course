# TD-P02 learner manuscript

## Professional problem

你要解决的不是“让模型总结 PRD”，而是让测试、产品和研发可以共同审计一条需求规则。先下载本页的 `requirements-to-evidence.zip`，解压后进入目录：

```bash
cd requirements-to-evidence
python3 pipeline.py reset
python3 pipeline.py all --report reports/baseline.json
```

看到 `PASS` 后打开 `inputs/`：PRD 说明已发货不可取消，OpenAPI 固定 409，旧技术方案只是实现背景。再看 `prompt-package/`：system prompt 限制“只抽取来源”，task prompt 提供 schema，critic prompt 检查引用；manifest 明确没有真实 provider/model，状态为 `NOT_RUN`。这一步教你区分“可执行夹具”与“模型证据”。

## Runnable action

Requirement Contract 的核心字段是 actor、trigger、preconditions、state transitions、invariants、exceptions、side effects、nfrs、unknowns 和 source_refs。结构合法只代表传输成功。运行：

```bash
python3 pipeline.py inject-unsupported-rule
python3 pipeline.py validate-contract
```

## Failure and repair

退出码 2 表示 BLOCKED，因为 `refund_timeout_hours=24` 没有来源。接着修复并演示产品缺陷：

```bash
python3 pipeline.py reset
python3 pipeline.py all --report reports/baseline.json
python3 pipeline.py inject-code-defect
python3 pipeline.py all --report reports/mutation.json
python3 pipeline.py repair
python3 pipeline.py all --report reports/repair.json
```

预期是 `0 / 1 / 0`。红色来自独立 SHIPPED→409 oracle，不是把 expected 改成实现返回值。打开 `reports/*.json` 和 `receipts/*.json`，检查输入 hash、mutation_id、selected cases、retries、limitations；再打开 `traceability.json`，沿 source→claim→risk→method→oracle→case→result 往返。迁移到自己的登录、审批或结算业务时，只替换版本化输入、状态和责任人，不能复制订单规则。

本实验是 `fixture-tested`：它证明下载包、Schema、source authority、独立 oracle、failure injection 和 repair 能重放；它不证明真实模型抽取准确率、企业 API、支付系统、从业者评审或生产安全。
## 反例与诊断

`refund_timeout_hours=24` 即使通过 JSON Schema 也可能没有任何来源；把 UNKNOWN 的退款状态写成 CANCELLED 会让下游错误断言副作用完成。先查 source_refs，再查语义不变量、权限和 owner close_with；格式通过不能替代业务批准。

