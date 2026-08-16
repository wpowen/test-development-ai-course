#!/usr/bin/env python3
"""校验提示词是否写完了，以及它有没有和自己的包说同一件事。

用法：
    python3 scripts/validate-prompt-packages.py

依据 methodology/prompt-design-contract.md。

## 它拦的是什么

改造前实测：50 份提示词里 0 份有示例、0 份有输出规范、0 份有推理路径、0 份有自检，
42 份是不分段的单段落。它们不是错的，是**不可执行**的——模型不知道按什么顺序想、
输出长什么样、边界情况怎么办。

这个校验器把四件事变成机器可判定的：

1. **七段齐全**  缺任何一段即失败。
2. **三类示例**  正例、边界例、拒答例各至少一个；只给正例会让模型把
   「一定要给出答案」当成隐含目标。
3. **停止状态交叉引用**  manifest 声明的每个 stop_state 必须在提示词里被逐字提到。
   声明了却不告诉模型，等于没有声明。
4. **必填字段交叉引用**  schema.required 的每个字段必须出现在输出规范段。

第 3、4 条与页面层的「架构图节点必须被正文引用」是同一个机制：让声明与内容之间的
漂移变成构建错误，而不是文档瑕疵。
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
COURSES = ROOT / "courses"
PUBLIC = ROOT / "site" / "public" / "materials"

# requirements-to-evidence 生命周期的 8 页采用 direct-use one-shot 契约，
# prompt-v1.md 是「直接复制到 AI Agent」，不走七段式任务提示词校验；
# 它们由 pipeline.py / DIRECT-USE-GUIDE.md / lifecycle-direct-use-prompts.test.mjs
# 独立校验，避免在这里被误报为「尚未改造」。
DIRECT_USE_TOPICS = frozenset(f"TD-P0{i}" for i in range(1, 9))

REQUIRED_SECTIONS = [
    "## 🔍 优化诊断 (Diagnosis)",
    "## 🎭 角色与专业定位 (Role & Expertise)",
    "## 🎯 任务目标与成功标准 (Objectives & Success Criteria)",
    "## 📋 上下文与知识基础 (Context & Knowledge Base)",
    "## 🧠 推理策略与思考路径 (Reasoning Strategy & Thinking Path)",
    "## 📝 示例与模式学习 (Examples & Pattern Learning)",
    "## 🛡️ 约束与安全护栏 (Constraints & Safety Guardrails)",
    "## 📊 输出规范与质量标准 (Output Specification & Quality Standards)",
    "## 🔄 迭代优化指令 (Iterative Refinement)",
    "## ❓ 信息缺口与引导性问题 (Missing Information)",
    "## 🧪 A/B 变体建议 (Variants)",
    "## 📈 效果追踪指标 (Tracking)",
    "## 📝 优化历史记录 (Version History)",
]
# 示例三分法：零样本给形态、单样本给标准解、多样本给模式变化。
EXAMPLE_HEADINGS = ["### 零样本示例", "### 单样本示例", "### 多样本示例"]
# 输出规范三分与约束三级，缺任一子标题即视为该段没写完。
SUBHEADINGS = ["**格式要求**", "**质量指标**", "**验证方法**",
               "**优先级 1**", "**优先级 2**", "**红线规则**"]
# 引导性问题必须三段齐全，否则它只是一个没人能回答的疑问句。
GAP_MARKERS = ["**【问题】**", "**【示例答案】**", "**【为什么需要】**"]
MIN_CHECKLIST = 4
MIN_STEPS = 4
MIN_VARIANTS = 2
REQUIRED_TRAILERS = ("- **v1.0**", "- **v2.0**", "**框架组合**")

ALIASES = {
    "schema": ("schema.json", "output-schema-v1.json"),
    "manifest": ("manifest.json",),
}


def read_part(pkg: pathlib.Path, part: str) -> dict:
    for name in ALIASES[part]:
        path = pkg / name
        if path.exists():
            try:
                return json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                return {}
    return {}


def check(pkg: pathlib.Path, text: str) -> list[str]:
    label = pkg.name
    problems: list[str] = []

    for section in REQUIRED_SECTIONS:
        if section not in text:
            problems.append(f"{label}: 缺少「{section.replace('## ', '')}」段")
    for heading in EXAMPLE_HEADINGS:
        if heading not in text:
            problems.append(f"{label}: 缺少「{heading.replace('### ', '')}」")
    for sub in SUBHEADINGS:
        if sub not in text:
            problems.append(f"{label}: 缺少子标题「{sub.strip('*')}」")
    for marker in GAP_MARKERS:
        if marker not in text:
            problems.append(f"{label}: 引导性问题缺少「{marker.strip('*')}」")
    variants = text.count("| A ·") + text.count("| B ·") + text.count("| C ·")
    if variants < MIN_VARIANTS:
        problems.append(f"{label}: A/B 变体只有 {variants} 个，至少 {MIN_VARIANTS} 个")

    if text.count("```json") < 3:
        problems.append(f"{label}: 三类示例中只有 {text.count('```json')} 个带 JSON 输出，需要 3 个")

    steps = len(re.findall(r"\*\*第 \d+ 步", text))
    if steps < MIN_STEPS:
        problems.append(f"{label}: 推理路径只有 {steps} 步，至少 {MIN_STEPS} 步")

    for trailer in REQUIRED_TRAILERS:
        if trailer not in text:
            problems.append(f"{label}: 缺少优化记录中的「{trailer}」")

    checklist = text.count("☐")
    if checklist < MIN_CHECKLIST:
        problems.append(f"{label}: 自检清单只有 {checklist} 条，至少 {MIN_CHECKLIST} 条")

    # 交叉引用：声明的停止状态与必填字段必须真的出现在提示词里。
    manifest = read_part(pkg, "manifest")
    for stop in manifest.get("stop_states") or []:
        if stop not in text:
            problems.append(f"{label}: manifest 声明了停止状态 {stop}，提示词里没有提到它")

    schema = read_part(pkg, "schema")
    marker = "## 📊 输出规范与质量标准"
    output_section = text.split(marker)[-1] if marker in text else ""
    for field in schema.get("required") or []:
        if field not in output_section:
            problems.append(f"{label}: schema 必填字段 {field} 未出现在输出规范段")

    return problems


# 三件套的分节要求：system 只管角色与约束，task 承载其余全部框架分节。
SYSTEM_SECTIONS = ["## 🎭 角色与专业定位 (Role & Expertise)",
                   "## 🛡️ 约束与安全护栏 (Constraints & Safety Guardrails)"]
TASK_SECTIONS = [s for s in REQUIRED_SECTIONS
                 if s not in ("## 🎭 角色与专业定位 (Role & Expertise)",
                              "## 🛡️ 约束与安全护栏 (Constraints & Safety Guardrails)")]
CRITIC_SECTIONS = ["## 🎭 角色与边界 (Role & Boundary)",
                   "## 🛡️ 逐项否决判据 (Rejection Rules)",
                   "## 🔬 必须核对的 Oracle (Mandatory Oracles)",
                   "## 📊 输出规范 (Output Specification)"]


def check_triple(pkg: pathlib.Path) -> list[str]:
    """三件套：system + task + critic 各自的分节完整性。"""
    problems: list[str] = []
    for filename, sections in (("system-v1.md", SYSTEM_SECTIONS),
                               ("task-v1.md", TASK_SECTIONS),
                               ("critic-v1.md", CRITIC_SECTIONS)):
        path = pkg / filename
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for section in sections:
            if section not in text:
                problems.append(f"{pkg.name}/{filename}: 缺少「{section.replace('## ', '')}」段")
        if filename == "task-v1.md":
            for heading in EXAMPLE_HEADINGS:
                if heading not in text:
                    problems.append(f"{pkg.name}/{filename}: 缺少「{heading.replace('### ', '')}」")
            if text.count("```json") < 3:
                problems.append(f"{pkg.name}/{filename}: 三类示例只有 {text.count('```json')} 个 JSON 输出，需要 3 个")
            steps = len(re.findall(r"\*\*第 \d+ 步", text))
            if steps < MIN_STEPS:
                problems.append(f"{pkg.name}/{filename}: 推理路径只有 {steps} 步，至少 {MIN_STEPS} 步")
    return problems


def main() -> int:
    prompts = sorted(
        [p for p in COURSES.glob("**/prompt-v1.md")]
        + [p for p in PUBLIC.glob("**/prompt-v1.md")]
    )
    if not prompts:
        print("没有找到任何 prompt-v1.md", file=sys.stderr)
        return 2

    problems: list[str] = []
    converted = 0
    direct_use = 0
    for path in prompts:
        if path.parent.name in DIRECT_USE_TOPICS:
            direct_use += 1
            continue
        text = path.read_text(encoding="utf-8")
        # 尚未改造的提示词不参与校验：分阶段推进，改一个纳入一个。
        if "## 🎭 角色与专业定位 (Role & Expertise)" not in text:
            continue
        converted += 1
        problems.extend(check(path.parent, text))

    # 三件套：有 system-v1.md 的包，且未被 receipt.json 钉住。
    triples = sorted({p.parent for p in COURSES.glob("**/system-v1.md")}
                     | {p.parent for p in PUBLIC.glob("**/system-v1.md")})
    triple_checked = 0
    triple_skipped = 0
    for pkg in triples:
        if (pkg / "receipt.json").exists() or pkg.name == "AG-DIM":
            triple_skipped += 1
            continue
        if "## 🎭 角色与专业定位 (Role & Expertise)" not in (pkg / "system-v1.md").read_text(encoding="utf-8"):
            continue
        triple_checked += 1
        problems.extend(check_triple(pkg))

    if problems:
        for problem in sorted(set(problems)):
            print(f"  ✗ {problem}", file=sys.stderr)
        print(f"\n{len(set(problems))} 处提示词设计问题。", file=sys.stderr)
        return 1

    print(f"提示词设计校验通过：{converted}/{len(prompts)} 份单文件包已按模块化契约改造。")
    print(f"三件套（system/task/critic）：{triple_checked} 个包通过，"
          f"{triple_skipped} 个因 hash 钉死或粘贴区体裁跳过。")
    if direct_use:
        print(f"direct-use 生命周期包：{direct_use} 份（由 lifecycle-direct-use-prompts.test.mjs 单独校验）。")
    if converted < len(prompts):
        remaining = len(prompts) - converted - direct_use
        if remaining:
            print(f"尚未改造：{remaining} 份（不参与校验）。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
