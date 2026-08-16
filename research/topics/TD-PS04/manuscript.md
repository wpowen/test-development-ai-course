# TD-PS04 · 让退款 UI 等到业务终态而不是文案出现

## 让退款 UI 等到业务终态而不是文案出现

客服看到“已提交”并不代表退款账本已完成；固定 sleep、宽泛文本 locator 和共享账号会把异步延迟与数据污染藏在绿色截图后。课程围绕一次审批的 UI、API、审计和 Trace 对齐。

role/testid 解决定位稳定性，actionability 解决交互时机，业务 API 与账本才负责最终 Oracle；Trace 用于解释而不是判定业务成功。 交付定位契约、隔离数据策略、终态断言和一次可回放失败 Trace。

四个 Oracle 分别是：

1. 批准控件角色名称与权限一致
2. 重复点击只产生一次退款意图
3. UI 终态与订单 API 和审计记录一致
4. 失败包含 DOM 网络控制台和 trace

## 复制运行 TD-PS04 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ui-mobile-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS04.json --mode cycle
```

TD-PS04 的 cycle 应严格记录 `0 → 1 → 0`；退款 UI 的 fault 若仍为 0，应检查重复点击 Mutation 是否改变审计/账本，而不是只观察按钮文案或重跑浏览器。


进入材料目录后运行 TD-PS04 的 cycle 命令。UI 实验先冻结角色、testid、订单初态与审计 Oracle，再执行正常审批、重复交互 fault 和幂等恢复。Repair 必须让界面终态、订单 API 与审计记录再次一致并 exit 0；DOM、网络、控制台、Trace 与 cycle receipt 都要作为诊断材料保存。

Prompt 包的任务是：读取旅程、角色、网络契约和风险矩阵，输出 locator 选择、等待信号、隔离数据、业务 Oracle 与失败证据；不得生成 fixed sleep。UI 页 system 禁止 fixed sleep 和宽泛文本定位，task 生成 locator、等待信号、数据隔离与业务断言，critic 查找共享账号、自动改基线和只看页面成功。模型尚为 NOT_RUN，Eval 固定 Prompt/Input/Schema/Mutation；接入模型时需保留浏览器矩阵、原始建议与 reviewer 拒绝理由。

迁移真实工作台时先替换角色、稳定 locator 和订单 fixture，同时保留账本零重复 Oracle；在隔离租户验证重复点击与异步终态后，再逐个增加浏览器和第三方依赖。目标浏览器流量占比、第三方沙箱稳定性和真实页面可访问名称 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS04 的假绿与恢复失败

本页的三类代表故障是：退款 API 延迟后返回 500；重复点击；第三方通知失败。每次只注入重复点击或等待信号缺失，确认失败落到副作用或终态 Oracle。若 DOM、API、审计全红，先修初态或账号隔离；Fault 绿表示测试仍只看文案，Repair 红则检查异步任务或共享数据未清理。

AI 可以提出 locator 和失败聚类，但不能修改退款 Oracle、自愈删除断言或自动接受截图基线。现有证据仅覆盖离线 UI 合同，目标浏览器占比、沙箱稳定性与真实可访问名称保持 Unknown；完成物需含 Prompt/Eval/Mutation、0/1/0 证据和跨层 Trace。

TD-PS04 的 fixture-tested 完成证据还要把重复点击产生的页面事件、订单 API 终态和审计记录对齐到同一 trace_id；任一层缺失都不能用“界面显示成功”补齐。
