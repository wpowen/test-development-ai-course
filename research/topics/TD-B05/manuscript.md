# 污染与不确定性

## Professional problem — 1.5% 提升可能只发生在见过的题上

候选只在训练说明可直接找到答案的题上进步，Harness 同时升级，却仍被宣布显著领先。污染审计要看 exact/near duplicate、公开曝光、调试访问与异常记忆迹象；不确定性审计要看样本量、配对变化、重复运行、区间和失败处理；版本审计决定趋势线能否继续。

方法选择“证据分级 + sealed canary”。Prompt、Dataset 与 Harness 版本冻结；Eval 报告 overlap、canary exposure、paired interval、variance 与 compatibility；Mutation 令 contamination_audit_present=false。独立 Oracle 对新鲜 canary 保持限权和访问日志，检测不到污染也只能写“未发现”，不能写“没有”。

## Runnable action — 缺污染审计时拒绝精确排名

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-B05 --phase baseline
python3 scripts/run_lab.py --topic TD-B05 --phase fault
python3 scripts/run_lab.py --topic TD-B05 --phase repair
~~~

baseline exit 0 表示 Fixture 有审计字段；fault exit 1 对应 contamination_audit_present=false，报告状态应降为 SUSPECT/INCOMPARABLE；repair exit 0 只恢复审计存在性。它没有证明闭源模型训练集不含这些题。

## Failure and repair — 把版本断点和污染信号分开

fault 假绿时核对 duplicate/exposure 结果是否进入 Gate，access log 与 dataset hash 是否同版本。repair 仍红时查看 Harness/task version 是否已经断开可比性。不能删除污染题后继续沿用旧总分，也不能把宽区间写成“无显著差异”之外的强结论。

迁移到事故摘要时，sealed canary 应来自新事件结构而非复制历史文本，并限制调试人员访问。验收要求污染题、未污染题和版本变化分栏，原始观察可追踪。

### Evidence boundary

PASS-FIXTURE 只演示 fail-closed 审计。闭源训练数据、真实 hidden test 基础设施、统计重复运行和模型输出都没有验证。
