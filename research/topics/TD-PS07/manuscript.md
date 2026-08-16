# TD-PS07 · 验证 iOS 改期在权限与清理后的真实终态

## 验证 iOS 改期在权限与清理后的真实终态

预约改期会跨日期控件、通知权限、后台恢复、签名环境与服务端版本；只看 XCUITest 页面文案无法证明预约未被重复更新，也无法证明测试后没有 Keychain 或日历残留。

稳定 identifier、launch state、XCTest expectation 和后端版本 Oracle 分别控制定位、初态、等待和业务真值。 交付可复现环境 Manifest、权限替代路径、预约版本断言与清理复核表。

四个 Oracle 分别是：

1. 稳定 identifier 不依赖本地化文字
2. 权限拒绝仍可完成安全替代路径
3. 同一预约版本只应用一次改期
4. 清理后通知日历 keychain 与后端状态回到基线

## 复制运行 TD-PS07 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ui-mobile-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS07.json --mode cycle
```

TD-PS07 的 cycle 应严格记录 `0 → 1 → 0`；iOS fault 若没有被拒绝，要检查预约版本或权限恢复 Mutation 是否写入后端 fixture，并确认清理 Oracle 覆盖通知、日历与 Keychain。


进入材料目录后运行 TD-PS07 的 cycle 命令。iOS 实验先冻结预约版本、accessibility identifier、launch state 和清理清单，再执行正常改期、重复更新 fault 与版本恢复。Repair 只有在后端预约应用一次且通知/日历/Keychain 回到基线时 exit 0；XCUITest 记录、环境 Manifest、后端快照和 cycle receipt 缺一不可。

Prompt 包的任务是：读取预约状态机、XCUITest preflight、权限与环境清单，生成 launch state、等待条件、清理和后端 Oracle；不得把模拟器通过写成真机通过。iOS 页 system 将 UI 可见、系统权限、签名环境与后端结果分开，task 生成 launch state、等待和清理候选，critic 拒绝本地化文字 locator 或模拟器外推。模型尚未调用，Eval 检查 Prompt/Input/Schema/Mutation；真实模型与设备运行必须保存 Xcode、签名、系统版本和 reviewer 记录。

接入目标预约应用时先替换服务端状态机、identifier 与权限文案，同时保留预约版本单次更新和无残留 Oracle；模拟器过关后再逐台真机补签名、通知和后台恢复证据。目标签名配置、真实通知服务和 iOS 版本分布 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS07 的假绿与恢复失败

本页的三类代表故障是：动画和异步回调延迟；通知权限拒绝；测试清理漏掉 keychain 状态。一次只改变权限选择、后台恢复或预约版本，观察对应 Oracle。若所有路径都红，先查 launch state 与签名 fixture；Fault 绿说明只看了页面成功，Repair 红则定位通知、Keychain 或后端预约记录未清。

AI 可以整理 XCUITest 候选与环境差异，但不能修改预约真值、授予系统权限或把模拟器结果写成真机通过。当前结论只到 iOS fixture，目标签名、真实通知服务和版本分布保持 Unknown；交付含独立 Oracle、Prompt/Eval/Mutation、0/1/0 和清理收据。

TD-PS07 仍是 fixture-tested：验收必须同时核对预约 version、通知/日历/Keychain 清理和环境 Manifest；模拟器的一次绿灯不能覆盖真机签名或后台恢复缺口。
