# TD-F05 Manuscript: 从测试任务得到可审计指标

## 你要解决的专业问题
“模型回答得不错”不是测试结论。没有预期行为、独立 Oracle 和分母，团队无法解释通过率，也无法复现失败。目标是把模糊任务改造成可运行、可比较的 Metric Card。

## 跟做：四步任务链
运行 `python3 scripts/career_evolution_lab.py --manifest manifests/TD-F05.json --mode baseline`。先写 task contract（输入、预期、风险、owner），再切成最小 assertion，选择不生成答案的 Oracle，最后填写 metric、窗口和决策门。保存 JSON 后执行 eval；不要把模型自评当独立裁判。

## 失败与修复
fault 模式会删除预期或替换 Oracle，命令应以 1 退出。诊断输出说明 schema、分母或独立性失败；修复模式补字段、锁定 prompt/eval 版本并重跑。样本为空或 Oracle 冲突时保持 `BLOCKED`，不输出虚假百分比。

## 可复用工件
得到 task contract、Metric Card、Oracle 说明、mutation 清单和 cycle evidence。复制到 API、RAG 或 Agent 评测时只替换任务字段，不改变状态语义。fixture-tested 不替代真实业务基线或 practitioner 评审。
## 检查清单
确认 task contract 有输入、预期、风险和 owner；assertion 能单独执行；Oracle 不生成被测答案；指标有分母和窗口；冲突被记录；mutation 至少覆盖一个边界；evidence 能复现命令。把最终 Metric Card 交给同事复核，若对方无法从卡片重建结果，状态保持 BLOCK。

## 小练习
用一个退款意图分类例子写出 TP、FP、FN，再用一个 RAG 例子写 Recall@k 与引用正确性。不要把 accuracy、F1、ROUGE、QPS 互换。练习输出只用于理解字段，不能当生产阈值。

完成后让同伴只看 Metric Card 重算一个结果。如果他无法定位分母、样本切片或 Oracle，说明卡片仍不可复用。再故意反转一条期望运行 mutation：Eval 必须把结果从 PASS 改为 FAIL/BLOCKED，并保存失败证据；若分数不变，先修 Oracle，不得调整阈值掩盖问题。

提交前再检查一次状态传播：输入缺失是 UNKNOWN，未执行是 NOT_RUN，语义冲突是 BLOCKED，断言不满足才是 FAIL。把这些状态混成零分会丢失诊断信息。可复用卡片必须写清编辑字段、输出路径、验证命令和限制，使下一位学习者能替换任务而不重写整套评测逻辑。
