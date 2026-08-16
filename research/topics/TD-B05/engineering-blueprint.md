# 污染与不确定性：工程 Blueprint

## Architecture and data flow

合成 case 与版本 Manifest 进入 topic contract。`run_lab.py` 读取固定期望，baseline 生成一致 observation，fault 只改变一个会影响职业决定的字段，repair 恢复 observation 而不改 Oracle。确定性 checker 保存 expected/actual、verdict、mutation、NOT_RUN 状态和未知，再把 exit code 交给人工 Gate。数据流为 `basis → version manifest → candidate observation → independent checks → report/exit → owner decision`。

业务系统、模型、RAG、Agent、企业 CI 和审批均在 Fixture 边界外。本地脚本只证明指定 mutation 会从 exit 0 变为 exit 1，并在恢复后回到 0。Prompt 包存在但 provider=none；其作用是展示 Prompt/Input/Schema/Eval/Mutation 必须一起版本化。

## Metrics and decisions

主测量面为 overlap、canary exposure、paired interval、variance 与 version compatibility。每个指标需要单位、分母、聚合、风险维度、观测点、版本和 owner。合成 Gate 要求三个字段全部精确匹配，单个 blocker 被破坏即 exit 1；这个阈值只为 mutation sensitivity 服务，不能外推到真实业务。统计性指标仍需真实分布、重复次数和不确定性。

## Baseline failure repair

从 `site/public/materials/ai-quality-benchmark` 运行 `python3 scripts/run_lab.py --topic TD-B05 --phase baseline`，预期 0；fault 预期 1 并显示 `候选只在污染题提升，Harness 又更新，却仍宣布显著进步。` 对应字段；repair 预期 0。三份 JSON 的 expected 保持相同。若 fault 假绿，依次检查 topic ID、manifest、mutation 字段、report phase 与 shell 是否吞掉退出码。禁止删除用例、改变 expected 或把 blocker 降为 warning。

## CI、安全与恢复

入口条件是 Python 3、全部 required_files、合成公开数据和精确 topic ID。停止条件是缺文件、未知 topic、合同冲突或 expected exit 不符。Prompt 权限为 candidate-only。故障恢复只恢复最后接受的 observation/config；它不是生产回滚。真实环境还需安全 sandbox、secret 隔离、Trace 脱敏和企业审批。

## 责任

学员生成 污染、不确定性与版本审计报告。AI 可整理候选与运行检查；AI 不得批准阈值、例外、权限或发布。无法确认闭源模型训练数据，污染检测仍可能假阴性。
