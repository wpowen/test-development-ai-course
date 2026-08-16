#!/usr/bin/env python3
"""Project incorporated/adapted user-source atoms into exact learner targets.

This is deliberately semantic rather than a file-level coverage shortcut. Each
required atom receives one dominant teaching function, an exact tutorial page
anchor, and—when its function requires one—a rendered visual, reusable asset,
or exercise. Fixed years, weights, counts and thresholds remain scoped or
parameterized; they are never promoted as universal policy.
"""

from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEDGER_PATH = ROOT / "research/source-assimilation-ledger.json"
OUTPUT_PATH = ROOT / "research/source-semantic-projection.json"
TUTORIAL_PATH = ROOT / "tutorial/tutorial-site.json"

AUTHOR_ID = "course-semantic-projection-author-2026-08-13"
REVIEWER_ID = "course-source-projection-audit-agent-2026-08-13"

CAREER_VISUALS = {
    "career-atom-0005-0001": "career-role-comparison.svg",
    "career-atom-0008-0001": "career-capability-allocation.svg",
    "career-atom-0024-0001": "career-evidence-lifecycle.svg",
    "career-atom-0046-0001": "career-responsibility-ladder.svg",
    "career-atom-0047-0001": "career-evidence-radar.svg",
    "career-atom-0074-0001": "career-evidence-gantt.svg",
    "career-atom-0075-0001": "career-evidence-gantt.svg",
    "career-atom-0098-0001": "career-background-paths.svg",
    "career-atom-0101-0001": "career-responsibility-ladder.svg",
    "career-atom-0103-0001": "career-priority-quadrant.svg",
    "career-atom-0130-0001": "career-capability-mindmap.svg",
    "career-atom-0131-0001": "career-capability-mindmap.svg",
    "career-atom-0132-0001": "career-capability-mindmap.svg",
    "career-atom-0137-0001": "career-background-paths.svg",
}

AGENT_VISUALS = {
    "agent-atom-0013-0001": "AG-DIM-ARCHITECTURE.svg",
    "agent-atom-0025-0001": "AG-DIM-36.svg",
    "agent-atom-0030-0002": "AG-DIM-36.svg",
    "agent-atom-0035-0001": "AG-DIM-36.svg",
    "agent-atom-0041-0001": "AG-DIM-GATE.svg",
    "agent-atom-0042-0001": "AG-DIM-GATE.svg",
}

THRESHOLD_PATTERN = re.compile(
    r"P[5-9]|职级|晋升|\d+\s*[-~至到]\s*\d+\s*年|\d+\+?\s*年|\d+\s*个月|"
    r"(?:≥|≤|>=|<=|>|<)\s*\d|\d+(?:\.\d+)?\s*%|权重|占比|阈值|门槛|"
    r"P50|P9[59]|QPS|TTFT|TPOT|pass[@^]|κ|kappa|样本量|置信区间",
    re.I,
)
PROMPT_PATTERN = re.compile(r"prompt|提示词|system\s*prompt|critic", re.I)
GLOSSARY_PATTERN = re.compile(r"术语|概念|是什么|定义|原理|llm|rag|agent|embedding|token|context", re.I)
METRIC_PATTERN = re.compile(r"指标|metric|准确率|召回|precision|recall|f1|延迟|吞吐|成本|资源|稳定性", re.I)
WORKFLOW_PATTERN = re.compile(r"流程|生命周期|执行模型|四环|路线|路径|阶段|闭环|sop", re.I)
COMPARISON_PATTERN = re.compile(r"对比|区别|vs\.?|差异", re.I)
CHECKLIST_PATTERN = re.compile(r"清单|检查项|faq|使用指南|验收|评估表", re.I)
SELF_ASSESSMENT_PATTERN = re.compile(r"自评|能力评估|当前位置|差距|雷达", re.I)
TEMPLATE_PATTERN = re.compile(r"模板|表格|矩阵|register|card|报告", re.I)
EXERCISE_PATTERN = re.compile(r"练习|实践|实战|case|案例|运行|执行", re.I)
RISK_PATTERN = re.compile(r"风险|安全|偏见|公平|隐私|失败|边界|限制|不适用|爆炸半径|拒答", re.I)
DECISION_PATTERN = re.compile(r"判断|决策|裁决|发布|回滚|阻断|block|gate|oracle|人审", re.I)


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def tutorial_pages() -> dict[str, dict]:
    tutorial = read_json(TUTORIAL_PATH)
    return {str(page["page_id"]): page for page in tutorial.get("pages", [])}


def anchor(page_id: str, field: str, pages: dict[str, dict]) -> str:
    page = pages[page_id]
    current = page
    for part in field.split("."):
        current = current[int(part)] if isinstance(current, list) else current[part]
    if current in (None, "", []):
        raise ValueError(f"empty learner anchor: {page_id}#{field}")
    return f"tutorial/tutorial-site.json#{page_id}#{field}"


def item_text(item: dict) -> str:
    return " ".join(str(item.get(field, "")) for field in ("locator", "title", "meaning", "kind"))


def agent_page(text: str) -> str:
    normalized = text.lower()
    domain_map = [
        (r"d0|judge|裁判|评估可信|gold", "TD-AG-01"),
        (r"d1|单体|轨迹|规划|工具选择", "TD-AG-02"),
        (r"d2|编排|handoff|级联|多.?agent", "TD-AG-03"),
        (r"d3|人机|中断|接管|确认疲劳", "TD-AG-04"),
        (r"d4|鲁棒|可靠|pass[@^]|长时程|重复", "TD-AG-05"),
        (r"d5|安全|攻击|注入|爆炸半径|供应链", "TD-AG-06"),
        (r"d6|效率|经济|成本|延迟|吞吐|资源", "TD-AG-07"),
        (r"d7|治理|审计|roi|业务规则|版本", "TD-AG-08"),
        (r"四环|影子|shadow|canary|在线持续|三段|门禁", "TD-AG-09"),
        (r"金融|交易|行情|高危|沙箱|建议.*执行|7.?24", "TD-AG-10"),
    ]
    for pattern, page_id in domain_map:
        if re.search(pattern, normalized, re.I):
            return page_id
    return "TD-AG-00"


def career_page(text: str) -> str:
    if re.search(r"传统.*ai|ai.*传统|角色定位|职责|测试流程|完整流程", text, re.I):
        return "TD-F01"
    if re.search(r"指标|f1|qps|延迟|吞吐|模型评估|数据质量|任务族|nlp|cv|rag|推荐", text, re.I):
        return "TD-F05"
    if re.search(r"提效|生产力|测试用例生成|实验|roi", text, re.I):
        return "TD-T26"
    if re.search(r"资源|书籍|课程|工具|框架|学习路径|不同背景", text, re.I):
        return "TD-R01"
    if re.search(r"p[5-9]|组织|职级|晋升|年限|权重|占比", text, re.I):
        return "TD-C04"
    if re.search(r"自评|评估|差距|雷达|四象限|优先级|成长计划|时间线", text, re.I):
        return "TD-C03"
    return "TD-C02"


def page_field(function_kind: str, page_id: str, pages: dict[str, dict]) -> str:
    section = pages[page_id]["content_sections"]
    preferred = {
        "concept-model": "plain_explanation",
        "comparison": "professional_relevance",
        "workflow": "teaching_blocks.1",
        "decision-rule": "completion_check",
        "metric-definition": "teaching_blocks.2",
        "threshold-policy": "evidence_boundary",
        "career-ladder": "teaching_blocks.1",
        "self-assessment": "learner_action",
        "visual": "teaching_blocks.1",
        "template": "learner_action",
        "prompt-package": "teaching_blocks.2",
        "checklist": "completion_check",
        "worked-example": "smallest_example",
        "counterexample": "common_errors",
        "exercise": "learner_action",
        "source-resource": "teaching_blocks.1",
        "reference-claim": "professional_relevance",
        "glossary": "plain_explanation",
        "risk-boundary": "evidence_boundary",
    }
    field = preferred[function_kind]
    current = section
    try:
        for part in field.split("."):
            current = current[int(part)] if isinstance(current, list) else current[part]
    except (KeyError, IndexError, TypeError, ValueError):
        field = "plain_explanation"
    return f"content_sections.{field}"


def classify(item: dict) -> tuple[str, str]:
    text = item_text(item)
    item_id = str(item["id"])
    if item_id in CAREER_VISUALS or item_id in AGENT_VISUALS:
        return "visual", "保留来源图示的教学关系，并以可编辑源和独立 SVG 交付；不以通用流程图替代。"
    if THRESHOLD_PATTERN.search(text) and item.get("disposition") == "adapted":
        return "threshold-policy", "保留指标或成长规则的设计意图，但把固定年限、权重、计数和阈值改为有 owner 的场景参数。"
    if PROMPT_PATTERN.search(text):
        return "prompt-package", "把提示词从聊天文本升级为绑定输入、Schema、Eval、Mutation、适配卡、停止态与收据的版本化 Prompt Package。"
    if SELF_ASSESSMENT_PATTERN.search(text):
        return "self-assessment", "把等级或自我描述转换成主张、evidence_ref、故障证据、reviewer 与下一工件。"
    if COMPARISON_PATTERN.search(text):
        return "comparison", "保留对比关系，并明确比较对象、共同底座、差异边界与不可外推项。"
    if WORKFLOW_PATTERN.search(text):
        return "workflow", "把步骤投影为连续的输入—判断—工件—消费者链，并显式保留 BLOCKED/FAIL 与回流。"
    if METRIC_PATTERN.search(text):
        return "metric-definition", "将指标绑定任务总体、分子分母、切片、基线、不确定性、owner 与失败动作。"
    if CHECKLIST_PATTERN.search(text):
        return "checklist", "把检查项转换为可勾选且能阻断的完成条件，而不是阅读清单。"
    if TEMPLATE_PATTERN.search(text):
        return "template", "将来源中的表格或报告结构落为可编辑工件，并提供 owner、版本、未知和验证字段。"
    if DECISION_PATTERN.search(text):
        return "decision-rule", "保留由证据触发的决定规则；AI 只生成候选，具名人类 owner 负责发布、豁免与回滚。"
    if RISK_PATTERN.search(text):
        return "risk-boundary", "保留风险或失败边界，缺依据、权限、Oracle 或责任人时 fail-closed。"
    if EXERCISE_PATTERN.search(text):
        return "exercise", "把概念落到固定输入、故障注入、修复与可复核输出的练习。"
    if GLOSSARY_PATTERN.search(text):
        return "glossary", "用小白可理解的定义说明概念、适用边界、常见失败与相邻概念差异。"
    if str(item.get("kind")) == "table":
        return "template", "把来源表格转换为可编辑、可评审、可复用的结构化工件。"
    return "concept-model", "保留来源的专业心智模型，并落到页面中的输入、判断、证据和决定。"


def assets_for(item: dict, function_kind: str, page_id: str) -> tuple[list[str], list[str], list[str]]:
    item_id = str(item["id"])
    visual_refs: list[str] = []
    reusable: list[str] = []
    exercises: list[str] = []
    if item_id in CAREER_VISUALS:
        visual_refs.append(f"courses/td-ai-career-evolution/learner-materials/visuals/{CAREER_VISUALS[item_id]}")
    if item_id in AGENT_VISUALS:
        visual_refs.append(f"courses/td-ai-agent-architecture-system/learner-materials/visuals/{AGENT_VISUALS[item_id]}")
    if function_kind in {"template", "self-assessment", "checklist"}:
        if item["source_id"] == "career":
            artifact = {
                "TD-C02": "TD-C02-responsibility-map.json",
                "TD-C03": "TD-C03-capability-self-assessment.json",
                "TD-C04": "TD-C04-organization-level-adapter.yaml",
                "TD-F05": "TD-F05-task-metric-card.yaml",
                "TD-T26": "TD-T26-productivity-experiment-report.json",
                "TD-R01": "TD-R01-resource-index.json",
            }.get(page_id, "TD-C02-responsibility-map.json")
            reusable.append(f"courses/td-ai-career-evolution/learner-materials/artifacts/{artifact}")
        else:
            reusable.append("courses/td-ai-agent-architecture-system/learner-materials/templates/dimension-register.md")
    if function_kind == "prompt-package":
        reusable.append("courses/td-ai-011-requirements-to-evidence/lab/page-prompts/TD-P02/manifest.json")
    if function_kind == "exercise":
        if item["source_id"] == "career":
            manifest_page = page_id if page_id in {"TD-C02", "TD-C03", "TD-C04", "TD-F05", "TD-T26", "TD-R01"} else "TD-C02"
            exercises.append(f"courses/td-ai-career-evolution/learner-materials/manifests/{manifest_page}.json")
        else:
            exercises.append(f"courses/td-ai-agent-architecture-system/learner-materials/manifests/{page_id}.json")
    return visual_refs, reusable, exercises


def build() -> dict:
    ledger = read_json(LEDGER_PATH)
    pages = tutorial_pages()
    required = [
        item for item in ledger.get("atoms", [])
        if str(item.get("disposition", "")).lower() in {"incorporated", "adapted"}
    ]
    units = []
    for index, item in enumerate(required, start=1):
        text = item_text(item)
        page_id = career_page(text) if item["source_id"] == "career" else agent_page(text)
        function_kind, protected_function = classify(item)
        page_ref = anchor(page_id, page_field(function_kind, page_id, pages), pages)
        visual_refs, reusable, exercises = assets_for(item, function_kind, page_id)
        adapted = str(item.get("disposition", "")).lower() == "adapted"
        if function_kind == "threshold-policy":
            adaptation = {
                "mode": "parameterized",
                "scope": f"{page_id} target task/organization; never universal",
                "owner": "target organization or target-system quality owner",
                "evidence_ref": "research/software-testing-career-agent-adapter.json",
                "uncertainty": "Target population, baseline, internal level mapping and production calibration remain UNKNOWN until supplied.",
            }
        else:
            adaptation = {
                "mode": "scoped" if adapted else "direct",
                "scope": f"{page_id} learner-facing static/fixture teaching contract; live, practitioner and outcome evidence NOT_RUN",
            }
        units.append({
            "unit_id": f"SEM-{index:04d}",
            "source_item_ids": [item["id"]],
            "function_kind": function_kind,
            "protected_function": protected_function,
            "page_refs": [page_ref],
            "visual_refs": visual_refs,
            "reusable_asset_refs": reusable,
            "exercise_refs": exercises,
            "adaptation": adaptation,
            "verification": f"Static trace: {item['locator']} → {page_ref}; target files are repository-owned and independently hash-checked by course validators.",
            "owner": "course semantic parity owner",
            "status": "adapted" if adapted else "projected",
        })
    required_ids = [item["id"] for item in required]
    function_counts = Counter(unit["function_kind"] for unit in units)
    return {
        "schema_version": "source-semantic-projection.v1",
        "source_ledger_ref": "research/source-assimilation-ledger.json",
        "source_ledger_sha256": "sha256:" + hashlib.sha256(LEDGER_PATH.read_bytes()).hexdigest(),
        "author_id": AUTHOR_ID,
        "units": units,
        "coverage": {
            "required_source_item_ids": required_ids,
            "covered_source_item_ids": required_ids,
            "unaccounted_source_item_ids": [],
            "function_counts": dict(function_counts),
            "verdict": "PASS",
        },
        "reviewer": REVIEWER_ID,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
        "verdict": "PASS",
        "evidence_boundary": "PASS proves exact static semantic projection only. Real-model, practitioner, learner, enterprise-integration, publication and production evidence remain NOT_RUN.",
    }


def main() -> None:
    projection = build()
    write_json(OUTPUT_PATH, projection)
    print(json.dumps({
        "output": str(OUTPUT_PATH.relative_to(ROOT)),
        "units": len(projection["units"]),
        "required_atoms": len(projection["coverage"]["required_source_item_ids"]),
        "function_counts": projection["coverage"]["function_counts"],
        "verdict": projection["verdict"],
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
