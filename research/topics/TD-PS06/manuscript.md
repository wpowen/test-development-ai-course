# TD-PS06 · 重放 Android 生命周期且不重复入账

## 重放 Android 生命周期且不重复入账

仓库扫码跨相机权限、旋转、后台与进程恢复后，界面恢复并不等于库存只写入一次。课程把设备状态与服务端 receipt_id 账本同时纳入判定。

组件测试观察应用状态，Espresso/UI Automator 分别处理应用同步和系统权限，服务端幂等账本独立证明业务副作用。 交付生命周期矩阵、设备清单、logcat/Trace 关联和 receipt_id 重放报告。

四个 Oracle 分别是：

1. 权限拒绝不创建收货记录
2. 旋转后台与恢复保留可解释扫描状态
3. 同一 receipt_id 只入账一次
4. 失败包关联 logcat 设备状态和服务 trace

## 复制运行 TD-PS06 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ui-mobile-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS06.json --mode cycle
```

TD-PS06 的 cycle 应严格记录 `0 → 1 → 0`；Android fault 若仍成功，应核对旋转/进程恢复 Mutation 是否改变 receipt 状态，以及服务端幂等账本是否参与最终 Oracle。


进入材料目录后运行 TD-PS06 的 cycle 命令。Android 实验先固定 API level、权限初态、扫描 ViewModel 与 receipt_id，再依次重放正常生命周期、恢复重复入账 fault 和幂等修复。Repair 必须在同一 receipt_id 下只写一次库存并 exit 0；应用状态、logcat、设备清单、服务 Trace 和 cycle receipt 共同交付。

Prompt 包的任务是：读取 Android 生命周期、权限、设备矩阵和库存契约，输出分层测试、同步信号、状态恢复与服务端 Oracle；未运行设备写 NOT_RUN。Android 页 system 区分组件、应用、系统权限和服务端责任，task 生成生命周期矩阵与同步信号，critic 拒绝 sleep、只看 UI 或把模拟器写成真机。Android 模型调用为 NOT_RUN，Eval 专门冻结生命周期 Input、状态 Schema 和重复入账 Mutation；真实接入还需记录 Gradle、设备镜像、模型输出与人工审批。

迁移仓库应用时先替换权限策略、扫描状态和库存 API fixture，再保留 receipt_id 幂等 Oracle；按旋转、后台、进程杀死和离线恢复逐项增加真机证据，不能一次换完整设备矩阵。OEM 定制行为、目标 API level 分布和真机资源限制 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS06 的假绿与恢复失败

本页的三类代表故障是：扫描后进程被杀；网络切换导致重放；相机权限永久拒绝。每次仅改变一个生命周期事件，确认失败落到状态恢复或入账次数。若 UI、logcat、账本全红，先修启动参数和初态；Fault 绿表示账本未参与判定，Repair 红通常来自 ViewModel、离线队列或服务端记录未清。

AI 可建议 Android 场景和聚类 logcat，却不能决定库存真值、扩大相机权限或声称模拟器覆盖 OEM。当前仅证明离线生命周期合同，OEM 行为、API level 分布和真机资源限制为 Unknown；结课需提交 Prompt/Eval/Mutation、0/1/0 与真机迁移清单。

TD-PS06 的 fixture-tested 收据必须让旋转、后台、进程恢复与 receipt_id 账本逐一可回放；只有页面状态恢复但库存写入次数不可核对时，结论仍应停在 Unknown。
