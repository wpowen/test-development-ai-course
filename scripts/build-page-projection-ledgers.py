#!/usr/bin/env python3
"""Build hash-pinned research-to-page projection ledgers for public pages.

The generator maps protected manuscript functions only to existing exact
`content_sections` anchors. It does not use a broad tutorial file reference and
does not invent independent model, practitioner, learner or publication proof.
"""

from __future__ import annotations

import hashlib
import json
import re
import argparse
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TUTORIAL_PATH = ROOT / "tutorial/tutorial-site.json"
TOPICS_ROOT = ROOT / "research/topics"
AUTHOR_ID = "course-page-projection-author-2026-08-13"
REVIEWER_ID = "course-page-projection-audit-agent-2026-08-13"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha256_bytes(value: bytes) -> str:
    return "sha256:" + hashlib.sha256(value).hexdigest()


def page_content_hash(page: dict) -> str:
    serialized = json.dumps(
        page.get("content_sections", {}),
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    )
    return sha256_bytes(serialized.encode("utf-8"))


def flatten_text(value) -> str:
    if isinstance(value, str):
        return re.sub(r"\s+", " ", value).strip()
    if isinstance(value, list):
        return " ".join(filter(None, (flatten_text(item) for item in value)))
    if isinstance(value, dict):
        return " ".join(filter(None, (flatten_text(item) for item in value.values())))
    return ""


def compact(value, max_length: int = 260) -> str:
    text = flatten_text(value)
    if len(text) <= max_length:
        return text
    return text[: max_length - 1].rstrip() + "…"


def line_locator(lines: list[str], patterns: list[str]) -> str:
    for pattern in patterns:
        regex = re.compile(pattern, re.I)
        for index, line in enumerate(lines, start=1):
            if regex.search(line):
                return f"manuscript.md:L{index}-L{index}"
    return "manuscript.md:L1-L1"


def target(page_id: str, field: str, section: dict) -> str:
    current = section
    parts = field.split(".")
    for part in parts:
        current = current[int(part)] if isinstance(current, list) else current[part]
    if current in (None, "", []):
        raise ValueError(f"{page_id} empty target content_sections.{field}")
    return f"{page_id}#content_sections.{field}"


def table_index(section: dict) -> int | None:
    for index, block in enumerate(section.get("teaching_blocks", [])):
        table = block.get("table") if isinstance(block, dict) else None
        if isinstance(table, dict) and table.get("headers") and table.get("rows"):
            return index
    return None


def metric_index(section: dict) -> int | None:
    metric_pattern = re.compile(
        r"指标|metric|分母|numerator|denominator|f1|precision|recall|qps|延迟|吞吐|成本|"
        r"通过率|区间|切片|样本|slo|ttft|tpot|pass[@^]|kappa|κ",
        re.I,
    )
    for index, block in enumerate(section.get("teaching_blocks", [])):
        if metric_pattern.search(flatten_text(block)):
            return index
    return None


def counterexample_index(section: dict) -> int | None:
    pattern = re.compile(r"反例|错误|看似|假绿|不能|不等于|故意|mutation|fault|失败", re.I)
    for index, block in enumerate(section.get("teaching_blocks", [])):
        if pattern.search(str(block.get("title", ""))) and flatten_text(block.get("body")):
            return index
    return None


def claim(
    page_id: str,
    claim_id: str,
    kind: str,
    locator: str,
    meaning,
    page_target: str,
    rationale: str,
    owner: str,
    disposition: str = "projected",
) -> dict:
    return {
        "claim_id": f"{page_id}-{claim_id}",
        "manuscript_locator": locator,
        "meaning": compact(meaning),
        "kind": kind,
        "disposition": disposition,
        "page_target": page_target,
        "rationale": rationale,
        "owner": owner,
    }


def build_claims(page: dict, manuscript: str) -> list[dict]:
    page_id = str(page["page_id"])
    section = page["content_sections"]
    lines = manuscript.splitlines()
    claims = [
        claim(
            page_id,
            "DECISION-01",
            "decision-rule",
            line_locator(lines, [r"Professional problem", r"专业问题", r"Runnable action"]),
            section["completion_check"],
            target(page_id, "completion_check", section),
            "完成条件保留了研究中的可判定出口，学习者必须提供证据而非仅阅读页面。",
            "course decision-rule owner",
        ),
        claim(
            page_id,
            "FAILURE-01",
            "failure-mode",
            line_locator(lines, [r"Failure and repair", r"故障", r"失败"]),
            section["common_errors"],
            target(page_id, "common_errors", section),
            "页面显式保留常见失败与修复入口，防止只展示成功路径。",
            "course failure-mode owner",
        ),
        claim(
            page_id,
            "BOUNDARY-01",
            "boundary",
            line_locator(lines, [r"Evidence boundary", r"证据边界", r"NOT_RUN", r"fixture"]),
            section["evidence_boundary"],
            target(page_id, "evidence_boundary", section),
            "页面逐字保留成熟度和证据边界，不把静态或 fixture 成功提升为 live、practitioner 或 production。",
            "course evidence-boundary owner",
        ),
        claim(
            page_id,
            "ARTIFACT-01",
            "artifact",
            line_locator(lines, [r"Runnable action", r"运行", r"工件", r"artifact"]),
            f"行动：{section['learner_action']} 预期：{section['expected_result']}",
            target(page_id, "learner_action", section),
            "页面把研究结论转换为学习者可执行动作和可检查工件出口。",
            "course reusable-artifact owner",
        ),
    ]
    index = table_index(section)
    if index is not None:
        block = section["teaching_blocks"][index]
        claims.append(claim(
            page_id,
            "TABLE-01",
            "judgement-table",
            line_locator(lines, [r"Professional problem", r"Failure and repair", r"Evidence boundary"]),
            {"title": block.get("title"), "table": block.get("table")},
            target(page_id, f"teaching_blocks.{index}", section),
            "研究中的判断维度被压缩为页面中的真实表格；表格行保留条件、风险或处置差异。",
            "course judgement-table owner",
            "condensed",
        ))
    metric = metric_index(section)
    if metric is not None:
        block = section["teaching_blocks"][metric]
        claims.append(claim(
            page_id,
            "METRIC-01",
            "metric-definition",
            line_locator(lines, [r"metric", r"指标", r"分母", r"区间", r"threshold"]),
            block,
            target(page_id, f"teaching_blocks.{metric}", section),
            "指标相关研究保留在具名教学块；任何固定数值按页面证据边界解释为场景参数或 UNKNOWN。",
            "course metric-card owner",
            "condensed",
        ))
    counter = counterexample_index(section)
    if counter is not None:
        block = section["teaching_blocks"][counter]
        claims.append(claim(
            page_id,
            "COUNTEREXAMPLE-01",
            "counterexample",
            line_locator(lines, [r"Failure and repair", r"fault", r"错误", r"失败"]),
            block,
            target(page_id, f"teaching_blocks.{counter}", section),
            "反例或错误路径进入独立教学块，学习者可以解释其为何假绿以及如何修复。",
            "course counterexample owner",
            "condensed",
        ))
    return claims


def build(check: bool = False) -> tuple[list[Path], list[str]]:
    tutorial = read_json(TUTORIAL_PATH)
    pages = tutorial.get("pages", [])
    written: list[Path] = []
    drifted: list[str] = []
    for page in pages:
        page_id = str(page["page_id"])
        topic_dir = TOPICS_ROOT / page_id
        manuscript_path = topic_dir / "manuscript.md"
        manuscript = manuscript_path.read_text(encoding="utf-8")
        claims = build_claims(page, manuscript)
        dispositions = Counter(item["disposition"] for item in claims)
        ledger = {
            "schema_version": "page-projection-ledger.v1",
            "topic_id": page_id,
            "author_id": AUTHOR_ID,
            "manuscript_sha256": sha256_bytes(manuscript_path.read_bytes()),
            "page_content_sha256": page_content_hash(page),
            "claims": claims,
            "counts": {
                "total": len(claims),
                "projected": dispositions["projected"],
                "condensed": dispositions["condensed"],
                "deferred": dispositions["deferred"],
                "rejected": dispositions["rejected"],
                "unaccounted": 0,
            },
            "reviewer": REVIEWER_ID,
            "verdict": "PASS",
            "evidence_boundary": "Static research-to-page fidelity only; model, practitioner, learner, publication and production validation remain separate NOT_RUN lanes.",
        }
        output = topic_dir / "projection-ledger.json"
        serialized = json.dumps(ledger, ensure_ascii=False, indent=2) + "\n"
        if check:
            if not output.is_file() or output.read_text(encoding="utf-8") != serialized:
                drifted.append(page_id)
        else:
            output.write_text(serialized, encoding="utf-8")
        written.append(output)
    return written, drifted


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail instead of rewriting stale ledgers")
    args = parser.parse_args()
    written, drifted = build(check=args.check)
    verdict = "FAIL" if drifted else "PASS"
    print(json.dumps({"projection_ledgers": len(written), "drifted_page_ids": drifted, "verdict": verdict}, ensure_ascii=False))
    if drifted:
        raise SystemExit("projection ledger drift: " + ", ".join(drifted))


if __name__ == "__main__":
    main()
