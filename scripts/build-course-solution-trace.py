#!/usr/bin/env python3
"""Attach the rebuilt career and Agent pages to existing solution units."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARCHITECTURE = ROOT / "research/solution-architecture.json"

GROUPS = (
    {
        "solution_id": "SOL-REQ-RELEASE",
        "course_id": "td-ai-career-evolution",
        "scenario_id": "TD-S07",
        "coverage_cell_id": "TD-CELL-027",
        "pages": ("TD-C02", "TD-C03", "TD-C04", "TD-F05", "TD-T26", "TD-R01"),
    },
    {
        "solution_id": "SOL-AI-EVAL-GOV",
        "course_id": "td-ai-agent-architecture-system",
        "scenario_id": "TD-S03",
        "coverage_cell_id": "TD-CELL-028",
        "pages": tuple(f"TD-AG-{index:02d}" for index in range(11)),
    },
    {
        "solution_id": "SOL-AI-EVAL-GOV",
        "course_id": "td-ai-foundations-eval",
        "scenario_id": "TD-S01",
        "coverage_cell_id": "TD-CELL-014",
        "pages": ("TD-FP01",),
    },
)


def main() -> None:
    document = json.loads(ARCHITECTURE.read_text(encoding="utf-8"))
    units = {unit["solution_id"]: unit for unit in document["solution_units"]}
    for group in GROUPS:
        unit = units[group["solution_id"]]
        # Solution architecture course_ids use the canonical curriculum IDs,
        # while these rebuilt package slugs are linked through page trace rows.
        # Do not inject package slugs into the canonical curriculum namespace.
        unit["course_ids"] = [
            course_id for course_id in unit["course_ids"]
            if course_id != group["course_id"]
        ]
        if group["scenario_id"] not in unit["scenario_ids"]:
            unit["scenario_ids"].append(group["scenario_id"])
        existing = {row["page_id"] for row in unit["traceability"]}
        for page_id in group["pages"]:
            if page_id not in unit["page_ids"]:
                unit["page_ids"].append(page_id)
            if page_id not in existing:
                unit["traceability"].append(
                    {
                        "coverage_cell_id": group["coverage_cell_id"],
                        "topic_id": page_id,
                        "page_id": page_id,
                        "scenario_id": group["scenario_id"],
                        "artifact_ref": f"research/topics/{page_id}/manuscript.md",
                        "command_ref": f"research/topics/{page_id}/lab-manifest.json",
                        "execution_receipt_ref": "NOT_RUN",
                        "assessment_ref": f"research/topics/{page_id}/validation.md",
                        "human_gate": "NOT_REVIEWED: qualified test-development practitioner plus accountable domain owner",
                    }
                )
    ARCHITECTURE.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    page_count = sum(len(group["pages"]) for group in GROUPS)
    print(f"solution trace synchronized: {page_count} rebuilt pages")


if __name__ == "__main__":
    main()
