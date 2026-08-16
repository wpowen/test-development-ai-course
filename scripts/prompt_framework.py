"""提示词工程框架的公共分节渲染。

两个生成器共用它，因此单文件包（prompt-v1.md）与三件套（system/task/critic）
产出的结构完全一致——分节命名、示例三分法、输出规范三分、迭代指令、
信息缺口问题、A/B 变体与效果追踪都出自这里。

抽出来的理由很直接：这些段落此前在两个脚本里各写一遍，第一次改分节名就会漂移。
"""
from __future__ import annotations

import json
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from diagnose_prompt import DIMENSIONS, render_table, score  # noqa: E402


def bullets(items: list[str], marker: str = "-") -> str:
    return "\n".join(f"{marker} {item}" for item in items)


def json_block(payload) -> str:
    return "```json\n" + json.dumps(payload, ensure_ascii=False, indent=2) + "\n```"


def quality_metrics() -> str:
    return bullets([
        "结论可追溯率 = 100%：每条结论都能指回输入中的具体字段",
        "事实与推断可区分：两者分列，不合并陈述",
        "未知保留率：指不回来源的内容全部进入未知字段，不被省略也不被推测补全",
    ])


def render_iteration() -> str:
    return "\n".join([
        "## 🔄 迭代优化指令 (Iterative Refinement)",
        "",
        "完成初稿后不要直接提交，再走一遍：",
        "",
        bullets([
            "**自洽性检查**：把推理路径每一步的结论与最终输出逐条对照。"
            "不一致时改输出而不是改推理——推理路径是先写下来的那一版。",
            "**多路径推理**：换一条推理顺序重做一次关键判断。两次结论不同时，"
            "说明证据不足以支撑其中任何一个，降级进未知字段。",
            "**自我批判**：假设你的结论是错的，从输入里找一条能推翻它的证据。"
            "找得到就降级；找不到才保留。",
            "**边界复查**：逐个对照停止状态，确认没有任何一个本应触发而被略过。"
            "宁可多停一次，也不要给一个证据不足的成功态。",
        ]),
    ])


def render_tracking() -> str:
    return "\n".join([
        "## 📈 效果追踪指标 (Tracking)",
        "",
        bullets([
            "**响应准确性**：结论可追溯率，目标 = 100%",
            "**输出稳定性**：同一输入重复 5 次，结构一致率；低于 100% 说明约束不足",
            "**任务完成度**：非停止状态下必填字段完整率，目标 = 100%",
            "**停止判定正确率**：应停未停与不应停却停两类错误各自计数，目标均 = 0",
        ]),
    ])


def gap_questions(spec: dict, stops: list[str]) -> str:
    """1.3 缺失要素识别：每个问题含【问题】【示例答案】【为什么需要】三段。"""
    items = spec.get("gap_questions") or [
        {
            "q": "本次判断依赖的输入字段中，哪些是缺失的？",
            "a": "例如：source_refs 未覆盖该规则，无法确认它的权威版本。",
            "why": "缺字段时任何结论都建立在假设上；显式问出来比默默补全便宜得多。",
        },
        {
            "q": f"下列停止状态是否已有条件成立？{'、'.join(stops) if stops else '（本包未声明）'}",
            "a": "例如：已成立，资料之间存在未裁决冲突。",
            "why": "停止状态成立时继续输出，会让后续每一步都建立在一个错误前提上。",
        },
        {
            "q": "本次结论需要哪位具名 owner 才能生效？",
            "a": "例如：需要业务 owner 裁决冲突条款，模型不能代裁。",
            "why": "判定权不在模型手上；说清楚谁签字，才知道这份输出交给谁。",
        },
    ]
    body = "\n\n".join(
        f"**【问题】**{item['q']}\n\n**【示例答案】**{item['a']}\n\n**【为什么需要】**{item['why']}"
        for item in items
    )
    return "\n".join([
        "## ❓ 信息缺口与引导性问题 (Missing Information)",
        "",
        "当输入不足以完成判断时，不要猜，按下列格式把问题交回给人：",
        "",
        body,
    ])


def variants_table(spec: dict) -> str:
    variants = spec.get("variants") or [
        ("A · 严格版（当前）", "停止状态从严，证据不足一律停止",
         "高风险场景；代价是拒答率上升，人工复核量增加"),
        ("B · 宽松版", "证据不足时给出带置信标注的候选而非停止",
         "探索阶段或低风险场景；代价是下游需要额外一道人工过滤"),
        ("C · 分步版", "把推理路径拆成两次调用，先出中间结论再出最终输出",
         "输入材料很长时；代价是调用次数与成本翻倍"),
    ]
    rows = ["## 🧪 A/B 变体建议 (Variants)", "",
            "| 变体 | 差异 | 适用场景与代价 |", "| --- | --- | --- |"]
    rows += [f"| {name} | {diff} | {when} |" for name, diff, when in variants]
    rows += ["", "当前包使用变体 A。切换变体属于一次需要重新评测的变更，不是配置调整。"]
    return "\n".join(rows)


def self_probe(steps, constraints, checklist) -> str:
    """把将要生成的内容拼成探针文本，用同一套检测器给 v2 打分。

    直接对最终产物打分会造成循环依赖（分数是产物的一部分），因此用一份在十个
    检测维度上与产物等价的探针替代。
    """
    return "\n".join([
        "## 🎭 角色与专业定位 Expertise", "你是",
        "## 🎯 任务目标与成功标准 Objectives 成功标准",
        "## 📋 上下文与知识基础 Context 不可信 边界",
        "## 🧠 推理策略与思考路径",
        *[f"**第 {i} 步" for i in range(1, len(steps) + 1)],
        "## 📝 示例与模式学习", "### 零样本示例", "### 单样本示例", "### 多样本示例",
        "```json", "```json", "```json",
        "## 🛡️ 约束与安全护栏 优先级 红线 注入 越权 停止状态",
        *[f"- {c}" for c in constraints],
        "## 📊 输出规范与质量标准 格式要求 质量指标 验证方法 schema JSON",
        *[f"☐ {c}" for c in checklist],
        "## 🔄 迭代优化指令 自检", "## ❓ 信息缺口与引导性问题",
        "## 🧪 A/B 变体建议", "## 📈 效果追踪指标", "## 📝 优化历史记录 框架组合",
    ])


def render_diagnosis(before: dict | None, spec: dict, steps, required) -> str:
    after = score(self_probe(
        steps,
        spec.get("constraints_p1", []) + spec.get("constraints_p2", []) + spec.get("redlines", []) or ["占位约束"],
        spec.get("checklist") or list(required) or ["占位自检"],
    ))
    return "\n".join([
        "## 🔍 优化诊断 (Diagnosis)",
        "",
        "十维诊断矩阵。「优化前」一列由 `scripts/diagnose_prompt.py` 读取 git 中的 v1 原文实测得出，可复算。",
        "",
        render_table(before, after),
    ])
