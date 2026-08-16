# TD-PS03 · 在消费者上线前阻断不兼容事件

## 在消费者上线前阻断不兼容事件

order.created 的字段兼容只是起点；跨租户事件、重复 event_id、乱序投递和补偿失败都可能在消费者运行后才暴露。课程把部署前契约和运行时终态放在同一证据账本中。

消费者契约先发现字段破坏，事件 envelope 固定身份，回放和 Trace 再检验幂等与补偿；缺任一层都不能宣称异步链路安全。 先完成消费者读取矩阵、事件权限表、重复乱序回放和死信终态证明。

四个 Oracle 分别是：

1. provider 变更满足所有活跃消费者
2. 跨租户事件被拒绝且零副作用
3. 重复 event_id 只产生一次支付意图
4. 失败事件进入具名 dead-letter 或补偿终态

## 复制运行 TD-PS03 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/api-ai-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS03.json --mode cycle
```

TD-PS03 的 cycle 应严格记录 `0 → 1 → 0`；事件链 fault 若退出 0，要核对跨租户或重复 event_id 是否真正穿过消费者回放，以及死信/补偿 Oracle 是否读取了新的终态。


进入材料目录后运行 TD-PS03 的 cycle 命令。事件实验先验证消费者字段表、tenant policy、CloudEvents envelope 和补偿终态，再运行兼容 baseline、重复乱序 fault 与幂等恢复。Repair 必须让同一 event_id 只创建一次支付意图并回到 exit 0；报告需分别保留 provider、consumer、回放账本和 cycle receipt。

Prompt 包的任务是：根据消费者读取字段、事件规范和策略夹具生成兼容矩阵与回放序列；禁止自动授予权限或更改事件语义。事件页的 system 固定 envelope 与权限边界，task 生成消费者兼容矩阵和重复乱序序列，critic 拒绝自动授予租户权限或把 DLQ 当成功。模型仍未运行，Eval 只检查 Prompt/Input/Schema/Mutation 的确定性合同；真实调用还要保存 broker、消费者版本、原始候选和 owner 裁决。

项目迁移先替换事件 Schema、活跃消费者清单和 tenant policy，再保留 event_id 幂等与具名终态 Oracle；在隔离 broker 证明重复、乱序、DLQ 和补偿后，才能讨论生产投递保证。目标 broker 投递保证、策略引擎版本和补偿 owner 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS03 的假绿与恢复失败

本页的三类代表故障是：删除消费者字段；重复并乱序投递；策略版本拒绝失效。故障注入只改变租户或投递顺序，并定位到对应消费者 Oracle。若所有消费者同时红，先查 envelope/fixture；Fault 绿说明回放未命中活跃处理器或账本未消费 mutation，Repair 红则排查 offset、去重存储或补偿状态残留。

AI 可整理消费者字段和候选回放，却不能改事件语义、扩大 tenant 权限或批准补偿终态。当前只证明离线事件 fixture 的检测链，目标 broker 保证、策略引擎版本和补偿 owner 仍为 Unknown；交付包括兼容矩阵、独立 Oracle、Prompt/Eval/Mutation、0/1/0 收据与 broker 迁移门禁。

TD-PS03 仍标记 fixture-tested：学习者必须指出哪个消费者拒绝了不兼容字段、哪个账本挡住重复 event_id，以及 DLQ/补偿何时只能保持 Unknown。

## Wave5 证据边界

本页的 static Pact envelope、事件顺序和租户拒绝 fixture 只证明兼容矩阵、event_id 去重与零副作用 Oracle 的结构。provider/model、真实 broker/policy-engine integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN；离线补偿判定不是跨服务运行证据。
