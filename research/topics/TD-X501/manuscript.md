# TD-X501｜多模态评测：不要把图、音、文分别打高分

## Professional problem：单模态都正确，组合起来为什么仍会答错

### Wave-2 observable artefacts

为图、音频、视频和文字分配同一 pair_id，记录模态可解析、跨模态关系、时间对齐和缺模态状态。caption 正确不等于事件对齐；关系 Oracle 必须指出冲突工件。迁移真实设备前补采集编码、时钟漂移、标注者和隐私证据；当前仅证明合成配对 fault 可被独立 Oracle 捕获。

多模态系统常见的假绿是：图片识别对了，语音转写对了，文本回答也通顺，但三者指向的不是同一个事件。测试开发必须验证“关系”，例如视频中的警报声是否对应画面里的设备、截图里的价格是否与语音询问的商品一致、时间轴上的字幕是否落在正确片段。真正的 risk 不在某个模态平均分，而在错配、缺失、冲突和无法拒答时仍给出确定答案。

本页的 method 是给每个样本固定 pairing ID、时间窗和模态版本，再由独立关系 Oracle 判定跨模态约束。模型可以生成候选描述或发现疑点，但不能既产生解释又批准 alignment；争议样本必须进入具名人工复核。

## Runnable action：注入一次跨模态错配

在 `materials/advanced-quality` 中运行：

```bash
python3 advanced_quality_lab.py run --topic TD-X501 --phase baseline --report reports/td-x501-baseline.json
python3 advanced_quality_lab.py run --topic TD-X501 --phase fault --report reports/td-x501-fault.json
python3 advanced_quality_lab.py run --topic TD-X501 --phase repair --report reports/td-x501-repair.json
```

Prompt 接收固定的图像、音频、文本引用与 pairing ID，只能输出带来源的候选关系；Schema 要求记录冲突、缺失模态、拒答与 owner；Eval 分开检查模态覆盖、跨模态一致性和 Oracle 独立性；Mutation 把一个模态换到错误样本，同时移除独立 Oracle。

## Failure and repair：0→1→0 应该告诉你什么

Baseline 退出 0，表示合成配对和外部 Oracle 被 runner 观察到。Fault 必须退出 1，`cross_modal_alignment` 与 `oracle_independent` 同时变红。若 fault 仍为 0，先查 pairing ID 是否只存在于展示层、检查器是否把相同文件名误当语义一致、或者 critic 的自评是否被错误用作 Oracle。Repair 恢复正确配对，并从生成器之外加载关系判定后退出 0。

这里的 repair 不是“把答案改得更像预期”，而是恢复输入身份和批准权。若修复时同时改了 expected，就失去了反证价值。

## 如何读多模态报告

先看错配与关键模态缺失，再看平均准确率；一个严重关系错误不能被其他样本抵消。需要分别报告对齐失败率、缺失模态率、冲突拒答率和人工分歧。真实设备差异、音画同步漂移、标注一致性、benchmark 污染与 production 模态分布都仍是 UNKNOWN。

## 边界与练习

本页是 fixture-tested，`model_evidence=NOT_RUN`；没有执行 live 模型、多设备采集或 practitioner 复核，因此不能写成多模态质量已经达标。练习时为一个“图像 + 语音问题”任务设计正确配对、错误配对、缺失音频和矛盾文字四个样本，并明确哪个证据拥有最终 Oracle 权限。
