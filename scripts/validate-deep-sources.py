#!/usr/bin/env python3
"""校验内容源里的「可落地性」，而不只是「有没有内容」。

用法：
    python3 scripts/validate-deep-sources.py

## 它拦的是什么

深度门禁（正文字数、判断表数、跨页重复率）已经能拦住「页面太薄」和「十页一个样」，
但拦不住第三种失败：**内容正确、结构完整、读完仍然不知道做到什么程度算做到**。
全站实测显示 60/102 页的正文里没有任何可判定阈值，中位数为 0——
读者拿到的是「要做鲁棒性测试」，不是「pass^5 的 95% CI 下界 ≥ 80%，P0 任务 k=10」。

这个校验器把四件事变成机器可判定的：

1. `failure`  失效点每行必须带可核查的数字。没有数字的失效点等于「这样不好」。
2. `metrics`  「关键指标」列必须是可判定阈值，不能是「良好」「合理」「较高」。
3. `archref`  表头必须是约定的三列，节点数 ≥ 3；节点名与页面架构图的交叉校验
              由 `site/scripts/validate-content.ts` 完成（架构图挂在页面上，不在内容源里）。
4. `gate`     三段式门禁三段都必须非空，且硬红线必须可判定。

## 分阶段生效

`ENFORCED` 是已完成改造的模块名单。新结构在 TypeScript 类型上是可选的，
只有进入这份名单的模块才被强制要求四段齐全。这遵循
`page-depth-and-projection-fidelity-contract.md` 的分阶段提门禁规程：
一次性把全站转红会让门禁失去指示作用，也无法区分「还没做」和「做坏了」。
每完成一个模块就把它加进 ENFORCED，退化会立刻被拦下。
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "methodology" / "dimensions" / "_sources"

# 已完成四段改造、受强制校验的模块。改造一个加一个。
ENFORCED: set[str] = {
    "agent-architecture-supplement",
    "agent-performance",
    "agent-workflow",
    "ai-assisted-testing",
    "ai-foundations",
    "ai-serving",
    "benchmark",
    "career-evolution",
    "professional-specializations",
    "prompt-first-lesson-supplement",
    "quality-platform",
    "quality-system",
    "rag-quality",
    "requirements-lifecycle-supplement",
}

ARCHREF_HEADERS = ["架构节点", "本页负责的部分", "出口工件"]
ARCHREF_MIN_NODES = 3

# 传统测试专项模块必须回答「这项能力在 AI 时代变成了什么」。
# 只对这个模块强制：其余模块讲的本来就是 AI 原生能力，没有可迁移的前身。
ENFORCED_EVOLUTION: set[str] = {
    "professional-specializations",
}
EVOLUTION_HEADERS = ["传统做法", "在 AI 系统里为什么不够用", "融合后的新做法"]
EVOLUTION_MIN_ROWS = 4
EVOLUTION_MIN_INVARIANT = 3

# 可判定阈值：比较号接数字、百分比、分位、或具名统计量。
#
# 等式阈值（缺失率 = 0、覆盖率 = 100%）必须算数：它们是最严格的判据。
# 初版正则只认 ≥ ≤ < >，把「= 0」判为不可判定，等于逼作者把「一条都不许缺」
# 改写成更模糊的「尽量不缺」——门禁反过来奖励了它本要消灭的东西。
THRESHOLD = re.compile(
    r"(?:[≥≤<>]\s*=?\s*\d)"          # ≥ 0.7 / ≤ 1% / < 2s
    r"|(?:[=＝]\s*\d)"                # = 0 / = 100%
    r"|(?:\d+\s*(?:%|pt|ms|s\b|分钟|秒|天|轮|次|条|步))"  # 30% / 200ms / 5 天
    r"|(?:p\d{2,3}\b)"                # p95 / p99
    r"|(?:pass[\^@]\d)"               # pass^5 / pass@1
    r"|(?:κ|kappa|CV|CI|KL|Wilson|Cohen)"  # 具名统计量
)
# 「正确的废话」词：出现在关键指标列即判失败。
VAGUE = re.compile(r"良好|合理|较高|较低|充分|适当|尽量|基本|一定程度|视情况|酌情")
DIGIT = re.compile(r"\d")


def check_failure(page_id: str, section: dict) -> list[str]:
    problems: list[str] = []
    rows = section["table"]["rows"]
    if len(rows) < 3:
        problems.append(f"{page_id}.failure: 只有 {len(rows)} 条失效点，至少 3 条")
    for index, row in enumerate(rows):
        if not DIGIT.search(" ".join(row[1:])):
            problems.append(
                f"{page_id}.failure 第 {index + 1} 行「{row[0][:24]}」没有可核查的数字"
            )
    return problems


def check_metrics(page_id: str, section: dict) -> list[str]:
    problems: list[str] = []
    table = section["table"]
    try:
        column = table["headers"].index("关键指标")
    except ValueError:
        return [f"{page_id}.metrics: 表头缺少「关键指标」列，实际是 {table['headers']}"]
    rows = table["rows"]
    if len(rows) < 3:
        problems.append(f"{page_id}.metrics: 只有 {len(rows)} 行指标，至少 3 行")
    for index, row in enumerate(rows):
        cell = row[column]
        if not THRESHOLD.search(cell):
            problems.append(f"{page_id}.metrics 第 {index + 1} 行不是可判定阈值：「{cell[:40]}」")
        elif VAGUE.search(cell):
            problems.append(f"{page_id}.metrics 第 {index + 1} 行含模糊词：「{cell[:40]}」")
    return problems


def check_archref(page_id: str, section: dict) -> list[str]:
    problems: list[str] = []
    table = section["table"]
    if table["headers"] != ARCHREF_HEADERS:
        problems.append(f"{page_id}.archref: 表头必须是 {ARCHREF_HEADERS}，实际是 {table['headers']}")
    if len(table["rows"]) < ARCHREF_MIN_NODES:
        problems.append(
            f"{page_id}.archref: 只映射了 {len(table['rows'])} 个架构节点，至少 {ARCHREF_MIN_NODES} 个"
        )
    return problems


def check_gate(page_id: str, section: dict) -> list[str]:
    problems: list[str] = []
    for stage in ("redline", "statistical", "acceptance"):
        items = section.get(stage) or []
        if len(items) < 2:
            problems.append(f"{page_id}.gate.{stage}: 只有 {len(items)} 条，至少 2 条")
    for index, item in enumerate(section.get("redline") or []):
        if not THRESHOLD.search(item):
            problems.append(f"{page_id}.gate.redline 第 {index + 1} 条不可判定：「{item[:40]}」")
    return problems


def check_evolution(page_id: str, section: dict) -> list[str]:
    problems: list[str] = []
    table = section["table"]
    if table["headers"] != EVOLUTION_HEADERS:
        problems.append(f"{page_id}.evolution: 表头必须是 {EVOLUTION_HEADERS}，实际是 {table['headers']}")
    if len(table["rows"]) < EVOLUTION_MIN_ROWS:
        problems.append(
            f"{page_id}.evolution: 只有 {len(table['rows'])} 条演进对照，至少 {EVOLUTION_MIN_ROWS} 条"
        )
    invariant = section.get("invariant") or []
    if len(invariant) < EVOLUTION_MIN_INVARIANT:
        problems.append(
            f"{page_id}.evolution.invariant: 只有 {len(invariant)} 条不变项，至少 {EVOLUTION_MIN_INVARIANT} 条"
        )
    # 第二列要说清「为什么不够用」，一句泛泛的「不适用于 AI」等于没说。
    for index, row in enumerate(table["rows"]):
        if len(row) >= 2 and len(row[1]) < 24:
            problems.append(
                f"{page_id}.evolution 第 {index + 1} 行没说清为什么不够用：「{row[1]}」"
            )
    return problems



# 表格预告句：「下面三条是…」这类只宣告下文、不携带信息的句子。
#
# 它们曾经占 104 处，几乎每页一条。成因是 intro 早先被类型定义成定长二元组，
# 一段必须写满两句；内容只够一句时，第二句就只能用来预告表格。类型已放开成
# string[]，这条门禁负责拦住复发——一段介绍写几句由内容决定，不由结构决定。
#
# 判据：句子以「下面/以下」开头，且不含长度 ≥ 10 的实质分句。
ANNOUNCE = re.compile(r"^(下面|以下)")
ANNOUNCE_MIN_CLAUSE = 10


def check_intro(page_id: str, section_name: str, section: dict) -> list[str]:
    intro = section.get("intro")
    if intro is None:
        return []
    if isinstance(intro, str):
        intro = [intro]
    if not intro:
        return [f"{page_id}.{section_name}.intro: 一段都没有"]
    problems = []
    for index, line in enumerate(intro):
        for sentence in (s for s in line.split("。") if s.strip()):
            if not ANNOUNCE.match(sentence):
                continue
            tail = sentence.split("，", 1)[1] if "，" in sentence else ""
            if len(tail) < ANNOUNCE_MIN_CLAUSE:
                problems.append(
                    f"{page_id}.{section_name}.intro 第 {index + 1} 段是表格预告，不携带信息："
                    f"「{sentence[:32]}」"
                )
    return problems


CHECKS = {
    "failure": check_failure,
    "metrics": check_metrics,
    "archref": check_archref,
    "gate": check_gate,
    "evolution": check_evolution,
}


def main() -> int:
    problems: list[str] = []
    enforced_pages = 0
    optional_pages = 0

    for source in sorted(SOURCE_DIR.glob("*.json")):
        slug = source.stem
        enforced = slug in ENFORCED
        pages = json.loads(source.read_text(encoding="utf-8"))
        for page_id, page in pages.items():
            if enforced:
                enforced_pages += 1
            # 预告句对所有段落生效，不限于纳入强制的四段。
            for section_name, section in page.items():
                if isinstance(section, dict):
                    problems.extend(check_intro(page_id, section_name, section))

            for section_name, check in CHECKS.items():
                section = page.get(section_name)
                required = enforced if section_name != "evolution" else slug in ENFORCED_EVOLUTION
                if section is None:
                    if required:
                        problems.append(f"{slug}/{page_id}: 缺少 {section_name} 段（该模块已纳入强制）")
                    continue
                if not enforced:
                    optional_pages += 1 if section_name == "metrics" else 0
                problems.extend(check(page_id, section))

    if problems:
        for problem in problems:
            print(f"  ✗ {problem}", file=sys.stderr)
        print(f"\n{len(problems)} 处可落地性问题。", file=sys.stderr)
        return 1

    pending = sorted({source.stem for source in SOURCE_DIR.glob("*.json")} - ENFORCED)
    print(f"可落地性校验通过：{len(ENFORCED)} 个模块已强制（{enforced_pages} 页）。")
    if pending:
        print(f"尚未纳入强制：{', '.join(pending)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
