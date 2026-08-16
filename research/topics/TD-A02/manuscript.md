# AI API 协议：Streaming、Structured、Tool 与 Async

## 把流式、工具与异步过程建成状态机

重放断流后的同一 request_id，并用副作用账本检查工具只执行一次。SSE 顺序、结构化语义、工具幂等和异步唯一终态是四个不同协议问题；最终文本无法覆盖中间态。

方法选择是：为 SSE、结构化输出、工具调用、异步任务建立四个独立状态机，分别检查过程和终态。 独立 Oracle 为：事件顺序合法且唯一终态；Schema 与业务语义均通过；工具副作用至多一次；异步部分失败不得汇总为完成。 这使学员能解释为什么一个测试变红，而不是只复制命令。学员最终交付 四协议状态机、事件 reducer、幂等账本与重放报告，并在工件中区分 desk-researched、fixture-tested、live-tested、practitioner-reviewed 与 production-validated。

### 重放断流后的同一 request_id，并用副作用账本检查工具只执行一次

先读取 page manifest 与批准输入；baseline 只验证本页 Oracle。随后注入：模拟断流重试后再次执行同一工具，使 side_effect_count 从 1 变成 2。门禁必须退出 1 并保存 expected/actual；repair 执行：恢复幂等键和状态查询，重放同一 request_id 只读取已有终态。重放时 Oracle、Prompt/Input/Schema/Eval/Mutation 版本均不得漂移。

### 为什么采用这条 Oracle 链

SSE 顺序、结构化语义、工具幂等和异步唯一终态是四个不同协议问题；最终文本无法覆盖中间态。 受保护链条包括：事件序列、Schema+业务语义、工具 allowlist/幂等键、task_id 与唯一终态。

## 复制运行 TD-A02 的 0 → 1 → 0

```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-serving-career
python3 scripts/serving_lab.py --manifest manifests/TD-A02.json --mode baseline
python3 scripts/serving_lab.py --manifest manifests/TD-A02.json --mode fault
python3 scripts/serving_lab.py --manifest manifests/TD-A02.json --mode repair
python3 scripts/serving_lab.py --manifest manifests/TD-A02.json --mode cycle
```

预期内部结果为 `0 -> 1 -> 0`。打开 `evidence/TD-A02/` 下四份 JSON，核对 input hash、manifest hash、实际检查和 evidence level。先预测哪一个字段会变红，再运行；如果 fault 仍绿，立即判为测试资产无检测力。

## TD-A02 失败诊断与修复边界

失败：模拟断流重试后再次执行同一工具，使 side_effect_count 从 1 变成 2。 修复：恢复幂等键和状态查询，重放同一 request_id 只读取已有终态。 若 baseline 事件乱序先修 reducer；若 fault 仍绿，核对 side_effect_count 是否由独立账本读取；repair 必须恢复幂等查询而不是忽略第二次调用。

本页的 Remaining Unknown 是：真实代理缓冲、网络分片、工具服务和任务队列没有运行。本页只验证 TD-A02 的离线 mutation 能被门禁拒绝；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。模型、供应商、GPU、队列、集成环境、实践者复核、学习者完成、线上服务和生产系统均未运行，不能把事件夹具外推为真实集成结论。

### Worked example、迁移条件与可复用工件

退款助手先发送 SSE delta，再要求结构化审批建议，随后调用订单查询工具并提交异步合规任务。学习者要分别画四张状态机，标出取消、断流、Schema 合法但语义错误、工具超时和异步部分失败的出口；最终文本相同也不能合并这些状态。

真实代理接入前逐项确认 SSE 心跳与代理缓冲、JSON Schema 版本、工具 allowlist/幂等键、task_id 回调签名和重放策略。任何一个状态没有明确 owner，就把该分支标为 BLOCKED，而不是用客户端重试掩盖；副作用账本必须独立于模型文本保存。

交付事件 reducer、Schema+业务不变量清单、工具副作用账本和异步状态转移表。每个故障样例都记录“收到的最后事件、允许的下一事件、用户可见提示、是否重试和修复后终态”，这样新人可以直接复制表格改成自己的协议。
