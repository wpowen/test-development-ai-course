#!/usr/bin/env python3
"""按十维诊断矩阵给一份提示词打分。

被 build-prompt-packages.py 引用，用来把「优化前后」写成实测数字而不是断言。

v1 原文从 git 历史取（site/ 是仓库根，公开投影在 public/materials/ 下），
因此表格里的「优化前」列是真读了那份文件之后算出来的，不是我事后追认的印象。

评分不追求精确，只要求可复算：每一维都由一个能在文本上执行的检测器给出，
同一份输入永远得到同一个分数。
"""
from __future__ import annotations

import re
import subprocess

DIMENSIONS = [
    "目标明确性",
    "角色定义完整性",
    "上下文充分性",
    "指令结构化程度",
    "示例质量与相关性",
    "输出格式规范性",
    "约束条件明确性",
    "推理策略适配性",
    "安全防护措施",
    "平台特定优化",
]


def _cap(value: float) -> int:
    return max(0, min(10, round(value)))


def score(text: str) -> dict[str, int]:
    """十维评分。每一维的检测器都只看文本，可被任何人复算。"""
    sections = len(re.findall(r"^##\s", text, re.M))
    subsections = len(re.findall(r"^###\s", text, re.M))
    json_blocks = text.count("```json")
    steps = len(re.findall(r"\*\*第 \d+ 步|^\d+\.\s", text, re.M))
    checks = text.count("☐")
    bullets = len(re.findall(r"^[-*]\s", text, re.M))

    return {
        "目标明确性": _cap(3 + 4 * ("目标" in text or "Objectives" in text) + 3 * ("成功标准" in text)),
        "角色定义完整性": _cap(2 + 3 * bool(re.search(r"你是|Role:", text)) + 5 * ("专业定位" in text or "Expertise" in text)),
        "上下文充分性": _cap(2 + 4 * ("上下文" in text or "Context" in text) + 4 * ("不可信" in text or "边界" in text)),
        "指令结构化程度": _cap(min(10, sections * 1.2 + subsections * 0.4)),
        "示例质量与相关性": _cap(json_blocks * 3),
        "输出格式规范性": _cap(2 * bool(re.search(r"schema|Schema", text)) + 4 * ("格式要求" in text) + 4 * ("验证方法" in text)),
        "约束条件明确性": _cap(2 * (bullets >= 3) + 4 * ("优先级" in text) + 4 * ("红线" in text)),
        "推理策略适配性": _cap(min(10, steps * 1.5)),
        "安全防护措施": _cap(3 * bool(re.search(r"注入|越权|不可信", text)) + 3 * ("红线" in text) + 4 * ("停止状态" in text or "stop" in text.lower())),
        "平台特定优化": _cap(3 * ("JSON" in text or "json" in text) + 3 * ("迭代" in text or "自检" in text) + 4 * ("框架组合" in text)),
    }


def score_from_git(repo: str, commit: str, relpath: str) -> dict[str, int] | None:
    """从 git 取出旧版原文并打分；取不到时返回 None，由调用方降级处理。"""
    try:
        text = subprocess.run(
            ["git", "-C", repo, "show", f"{commit}:{relpath}"],
            capture_output=True, text=True, check=True,
        ).stdout
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    return score(text) if text.strip() else None


def render_table(before: dict[str, int] | None, after: dict[str, int]) -> str:
    rows = ["| 诊断维度 | 优化前 | 优化后 |", "| --- | --- | --- |"]
    for name in DIMENSIONS:
        old = f"{before[name]}/10" if before else "—"
        rows.append(f"| {name} | {old} | {after[name]}/10 |")
    if before:
        rows.append(f"| **合计** | **{sum(before.values())}/100** | **{sum(after.values())}/100** |")
    else:
        rows.append(f"| **合计** | — | **{sum(after.values())}/100** |")
    return "\n".join(rows)
