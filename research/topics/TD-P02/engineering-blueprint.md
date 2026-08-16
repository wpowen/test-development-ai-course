# TD-P02 engineering blueprint

## Architecture and data flow

## Metrics and decisions

## Baseline failure repair

固定工作目录是解压后的 `requirements-to-evidence/`。`inputs/` 保存带稳定 locator/hash 的 PRD、technical design、OpenAPI 与 authority policy；`prompt-package/` 保存 system/task/critic；`schemas/` 保存 Requirement Contract schema；`lab/` 的 pipeline 只使用 Python 标准库；`receipts/` 保存运行环境、命令、模型状态和输出 hash。任何真实 provider 都是可选适配器，本夹具 provider/model=`none/offline-deterministic`，status=`NOT_RUN`。

## Deterministic gates

顺序是 package → authority → schema → source/oracle → eval → mutation → trace。package gate 检查必需文件和 hashes；authority gate 检查 owner/evidence 与冲突；schema gate 检查 JSON 结构；source/oracle gate 检查 accepted 规则引用和独立 oracle；eval gate 检查八类案例；mutation gate 运行 prompt/source/oracle 与现有代码 mutation；trace gate 验证 source→claim→risk→method→oracle→case→result 双向闭环。任一 stop state 阻断下游生成。

## State and evidence

`NOT_RUN`、`PASS_SCHEMA`、`PASS_SEMANTIC`、`FAIL`、`BLOCKED`、`UNKNOWN`、`REFUSED`、`INCOMPLETE` 不能互换。报告只写 `fixture-tested`，并保存 stdout/stderr、退出码、输入 hash、selected cases、skips、retries 和 residual risk。独立 oracle 不读取被测实现来生成 expected；模型自评不算独立 oracle。

## Failure design

source mutation 删除 source_ref，预期 authority gate 返回 2；oracle mutation 将 SHIPPED expected 改成 202，预期执行返回 1；prompt mutation 允许补写 SLA，预期 prompt constraint gate 返回 2。repair 恢复来源、oracle 和约束后返回 0。文档冲突继续使用既有 `inject-doc-conflict`，验证 stop propagation。

## Security and release boundary

输入仅为合成订单资料，不包含支付密钥或个人信息；脚本不联网、不读环境凭证、不调用模型。课程页面必须先下载/解压/cd，不能假设站点源码 cwd。发布 owner 只接受 fixture receipt，不能以静态构建、zip 存在或退出码冒充 live/practitioner/production。
