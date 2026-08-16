#!/usr/bin/env python3
"""Build course-side source, capability, evidence and adapter contracts.

This script consumes the deterministic source inventory and current tutorial
projection. It never promotes fixture evidence to model, integration,
practitioner, learner or production evidence.
"""

from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research"
LEDGER_PATH = RESEARCH / "source-assimilation-ledger.json"
TUTORIAL_PATH = ROOT / "tutorial/tutorial-site.json"
ADAPTER_PATH = RESEARCH / "software-testing-career-agent-adapter.json"
DECLARATIONS_PATH = RESEARCH / "capability-declarations.json"
PROFILES_PATH = RESEARCH / "capability-profiles.json"
EVIDENCE_PATH = RESEARCH / "professional-evidence.json"
PLAN_PATH = RESEARCH / "course-rebuild/new-page-plan.json"

CAREER_TARGETS = [
    "site/content/modules/career-evolution.ts",
    "courses/td-ai-career-evolution/course.md",
    "research/software-testing-career-agent-adapter.json",
]
AGENT_TARGETS = [
    "site/content/modules/agent-architecture-system.ts",
    "courses/td-ai-agent-architecture-system/course.md",
    "research/software-testing-career-agent-adapter.json",
]
CAREER_REVIEW = "research/course-rebuild/career-source-adjudication.md"
AGENT_REVIEW = "research/course-rebuild/agent-source-adjudication.md"

CAREER_PAGE_IDS = ["TD-C02", "TD-C03", "TD-C04", "TD-F05", "TD-T26", "TD-R01"]
AGENT_PAGE_IDS = [f"TD-AG-{index:02d}" for index in range(11)]


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def source_lines(source_path: str) -> list[str]:
    return (ROOT / source_path).read_text(encoding="utf-8").splitlines()


def protected_meaning(item: dict, lines: list[str]) -> str:
    start = max(0, int(item["start_line"]) - 1)
    end = min(len(lines), int(item["end_line"]))
    raw = " ".join(lines[start:end])
    raw = re.sub(r"```(?:mermaid|json|python|bash|yaml)?", " ", raw, flags=re.I)
    raw = re.sub(r"[#|>*_`~]+", " ", raw)
    raw = re.sub(r"\s+", " ", raw).strip()
    title = str(item.get("title") or item.get("locator") or item["id"]).strip()
    if not raw:
        raw = title
    if len(raw) > 440:
        raw = raw[:437].rstrip() + "…"
    return f"{title}：{raw}" if title not in raw[: max(20, len(title))] else raw


CAREER_ORG_PATTERN = re.compile(
    r"P[5-9]|职级|晋升|\b\d+\s*[-~至到]\s*\d+\s*年|\d+\+?\s*年|\d+\s*个月|"
    r"(?:≥|≤|>=|<=|>|<)?\s*\d+(?:\.\d+)?\s*%|覆盖率|自动化率|NPS|用例数|Bug\s*数|"
    r"点赞|粉丝|Star|专利|论文数量|分享次数|能力占比|固定权重",
    re.I,
)
CAREER_PROMISE_PATTERN = re.compile(r"保证|必然|就业|一定达到|快速达到|天花板|薪资承诺", re.I)
CAREER_RESOURCE_PATTERN = re.compile(r"书籍|课程|平台|社区|工具与框架|论文推荐|资源推荐|链接|参考资料", re.I)
AGENT_THRESHOLD_PATTERN = re.compile(
    r"(?:≥|≤|>=|<=|>|<)\s*\d|\d+(?:\.\d+)?\s*%|κ|kappa|P9[59]|P50|CV|ASR|"
    r"pass\^?\d|pass@\d|\b[1-9]\d{1,3}\s*(?:条|次|天|周|月|秒|ms)|置信区间不重叠",
    re.I,
)
AGENT_UNVERIFIED_PATTERN = re.compile(
    r"行业.*(?:比例|下降|提升)|必然退化|事故.*下降|参考依据|法律|法规|罚款|Colorado|EU AI Act|"
    r"90%.*失败|67%|82\s*:\s*1|11\s*天",
    re.I,
)
AGENT_DOMAIN_EXAMPLE_PATTERN = re.compile(r"交易所|金融|行情|资金|下单|交易", re.I)


def adjudicate(item: dict, lines: list[str]) -> dict:
    meaning = protected_meaning(item, lines)
    source_id = item["source_id"]
    text = f"{item.get('locator', '')} {meaning}"
    item = dict(item)
    item["meaning"] = meaning
    item["owner"] = "course-evidence-owner"
    item["evidence_refs"] = [CAREER_REVIEW if source_id == "career" else AGENT_REVIEW]
    if source_id == "career":
        if CAREER_PROMISE_PATTERN.search(text):
            item.update(
                disposition="rejected",
                target_refs=[CAREER_REVIEW],
                rationale="就业、晋升、薪资或固定时长承诺缺少目标学员、组织制度和效果证据；课程保留可验证出口工件，不作结果保证。",
                evidence_refs=[CAREER_REVIEW],
            )
        elif CAREER_RESOURCE_PATTERN.search(text):
            item.update(
                disposition="blocked",
                target_refs=["research/technology-radar.json"],
                rationale="资源、工具和链接具有时效性；在逐条核验版本、维护状态、许可和替代方案前，不列为必学或最佳实践。",
                evidence_refs=[CAREER_REVIEW, "research/technology-radar.json"],
            )
        elif CAREER_ORG_PATTERN.search(text):
            item.update(
                disposition="adapted",
                target_refs=CAREER_TARGETS,
                rationale="保留能力评估与成长意图，但将公司 P-band、工作年限、固定权重和百分比转换为默认 INTERNAL-UNKNOWN 的组织适配器或场景化 Metric Card。",
            )
        else:
            item.update(
                disposition="incorporated",
                target_refs=CAREER_TARGETS[:2],
                rationale="职业责任、传统测试底座、AI/ML 任务、工程能力、协作与证据化成长结构进入独立职业学习链和可复用工件。",
            )
    else:
        if AGENT_UNVERIFIED_PATTERN.search(text):
            item.update(
                disposition="blocked",
                target_refs=[AGENT_REVIEW],
                rationale="精确行业数字、法律日期或外部结论缺少可审计一手来源、版本和适用范围；保留为待核事实，不能进入通用门禁。",
                evidence_refs=[AGENT_REVIEW, "research/course-rebuild/validation-gap-map.md"],
            )
        elif AGENT_DOMAIN_EXAMPLE_PATTERN.search(text):
            item.update(
                disposition="adapted",
                target_refs=AGENT_TARGETS,
                rationale="保留高风险、时效和不可逆副作用的测试思想，但将交易/金融内容标为领域适配示例，不推广为所有 Agent 的默认政策。",
            )
        elif AGENT_THRESHOLD_PATTERN.search(text):
            item.update(
                disposition="adapted",
                target_refs=AGENT_TARGETS,
                rationale="保留指标、统计和风险门槛的设计意图；固定数字只作为来源示例，实际阈值必须进入含总体、分母、切片、不确定性、owner 与失败动作的 Metric Card。",
            )
        else:
            item.update(
                disposition="incorporated",
                target_refs=AGENT_TARGETS[:2],
                rationale="D0-D7、四证据环、轨迹、交接、可靠性、安全、经济性和治理进入独立 Agent 架构测试学习链。",
            )
    return item


def build_ledger() -> dict:
    ledger = read_json(LEDGER_PATH)
    source_map = {source["source_id"]: source_lines(source["path"]) for source in ledger["sources"]}
    ledger["sources"] = [
        {
            **source,
            "authority": "USER-PROVIDED-ADJUDICATED",
            "scope": "professional candidate input; organization-specific values and unverified external claims remain adapted, blocked, or rejected",
            "owner": "course-evidence-owner",
        }
        for source in ledger["sources"]
    ]
    ledger["sections"] = [adjudicate(item, source_map[item["source_id"]]) for item in ledger["sections"]]
    ledger["atoms"] = [adjudicate(item, source_map[item["source_id"]]) for item in ledger["atoms"]]
    atom_counts = Counter(item["disposition"] for item in ledger["atoms"])
    section_counts = Counter(item["disposition"] for item in ledger["sections"])
    ledger["coverage_receipt"] = {
        "source_count": len(ledger["sources"]),
        "section_count": len(ledger["sections"]),
        "atom_count": len(ledger["atoms"]),
        "accounted_section_count": len(ledger["sections"]),
        "accounted_atom_count": len(ledger["atoms"]),
        "disposition_counts": dict(sorted(atom_counts.items())),
        "section_disposition_counts": dict(sorted(section_counts.items())),
        "unaccounted_ids": [],
        "inventory_command": "python3 outputs/career-ai-course-factory/scripts/build_source_assimilation_ledger.py --package-root outputs/test-development-ai-v2 --source career=outputs/test-development-ai-v2/research/user-input/AI测试工程师发展.md --source agent=outputs/test-development-ai-v2/research/user-input/AI-agent测试架构.txt --output outputs/test-development-ai-v2/research/source-assimilation-ledger.json && python3 scripts/build-course-global-contracts.py",
        "reviewer": "course-evidence-owner",
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
        "verdict": "PASS",
    }
    return ledger


RESPONSIBILITY_STATES = [
    ("guided-execution", "在明确输入、方法和评审下完成一个受限任务"),
    ("independent-scoped-ownership", "独立拥有风险、工件、Oracle、结果和交接"),
    ("system-cross-team-leverage", "建设被多个团队消费的控制、平台或标准"),
    ("strategy-governance-mentoring", "承担策略、治理、风险接受、带教与反馈闭环"),
]
DOMAINS = [
    ("D0-evaluation-trust", "评估可信层", "gold、Judge 校准、分歧、构念效度与评估器漂移"),
    ("D1-single-agent-capability", "单体能力层", "意图、规划、工具选择、参数、记忆与任务终态"),
    ("D2-orchestration-multi-agent", "编排协作层", "路由、handoff、上下文保真、隔离和级联熔断"),
    ("D3-interaction-collaboration", "交互协同层", "多轮、澄清、中断、接管、确认疲劳与人工权威"),
    ("D4-robustness-reliability", "鲁棒可靠层", "重复运行、长时程、异常、自恢复、幂等和统计回归"),
    ("D5-security-adversarial", "安全对抗层", "注入、权限、委托、供应链、记忆污染、沙箱与爆炸半径"),
    ("D6-efficiency-economics", "效率经济层", "延迟、吞吐、资源、Token、工具、Judge、人审和尾部成本"),
    ("D7-business-governance", "业务治理层", "业务规则、审计、隐私、版本、灰度、waiver、回滚和 ROI"),
]


def build_adapter() -> dict:
    mappings = []
    for domain_id, title, boundary in DOMAINS:
        mappings.append({
            "domain_id": domain_id,
            "architecture_boundary": boundary,
            "risks": [f"{title}关键状态不可见", f"{title}总分掩盖 blocker"],
            "observables": ["versioned input", "trace/state", "independent result", "stop reason"],
            "methods": ["contract/state testing", "risk slice", "fault injection", "paired or repeated comparison"],
            "independent_oracles": ["frozen fixture/reference state", "policy or business owner", "ledger/schema validator"],
            "cases_faults": ["baseline", "single seeded fault", "repair", "missing/conflict/refusal"],
            "evidence_refs": [AGENT_REVIEW, f"research/topics/TD-AG-{int(domain_id[1]):02d}/engineering-blueprint.md"],
            "stop_decision": "关键输入、独立 Oracle、权限、统计单位或 owner 缺失时 BLOCKED；不得以平均分抵消安全/业务 blocker。",
        })
    return {
        "schema_version": "1.0.0",
        "responsibility_states": [
            {
                "state_id": state_id,
                "plain_definition": definition,
                "observable_work": ["版本化工件", "故障/Mutation 证据", "下游消费者反馈"],
                "decision_rights": "由证据和具名评审确定，不由年限或自评分自动推断",
                "transition_evidence": ["accepted artifact", "named reviewer", "failure recovery receipt"],
            }
            for state_id, definition in RESPONSIBILITY_STATES
        ],
        "self_assessment": [
            {
                "dimension_id": dimension,
                "question": question,
                "evidence_refs": ["courses/td-ai-career-evolution/learner-materials/templates/career-self-assessment.json"],
                "gap_route_page_ids": route,
                "reviewer": "learner plus named professional reviewer",
            }
            for dimension, question, route in [
                ("basis-method-oracle", "能否把需求/技术依据转成风险、方法、独立 Oracle 和结果？", ["TD-C02", "TD-P01"]),
                ("ai-system-model", "能否画出 LLM/RAG/Agent/Workflow 边界并定位失败层？", ["TD-F05", "TD-AG-00"]),
                ("evaluation-evidence", "能否用数据、切片、指标、不确定性和 owner 支撑决定？", ["TD-T26", "TD-AG-01"]),
                ("system-leverage", "是否有被下游复用并在故障时变红的工件？", ["TD-C03", "TD-R01"]),
                ("governance-growth", "能否说明决策权、残余风险、30/60/90 天证据目标？", ["TD-C04", "TD-AG-08"]),
            ]
        ],
        "organization_level_adapter": {
            "status": "INTERNAL-UNKNOWN",
            "default_status": "INTERNAL-UNKNOWN",
            "owner": "target-organization career committee",
            "evidence_refs": [CAREER_REVIEW],
            "required_inputs": ["internal title/band", "decision rights", "review rules", "named source/version"],
            "prohibited_defaults": ["P5-P9 universal mapping", "years imply capability", "fixed promotion time", "vanity counts as evidence"],
        },
        "agent_domains": [
            {"domain_id": domain_id, "title": title, "plain_boundary": boundary, "page_ids": [f"TD-AG-{index:02d}"]}
            for index, (domain_id, title, boundary) in enumerate(DOMAINS, start=1)
        ],
        "evidence_rings": [
            {"ring_id": "offline-fixture", "entry": "versioned synthetic input", "exit": "0/1/0 receipt", "owner": "course lab owner", "maturity": "fixture-tested"},
            {"ring_id": "controlled-integration", "entry": "sandbox credentials and cleanup", "exit": "integration receipt", "owner": "system owner", "maturity": "NOT_RUN"},
            {"ring_id": "shadow-canary", "entry": "paired old/new manifest and no-effect policy", "exit": "staged decision/rollback receipt", "owner": "release owner", "maturity": "NOT_RUN"},
            {"ring_id": "continuous-online", "entry": "privacy-approved telemetry and SLO", "exit": "monitoring/incident/rollback evidence", "owner": "production owner", "maturity": "NOT_RUN"},
        ],
        "domain_test_mappings": mappings,
        "statistical_semantics": {
            "pass_at_k": "同一任务的 k 次尝试至少一次成功；适合机会型完成率，不代表单次稳定性。",
            "pass_power_k": "同一任务在 k 次状态重置后的执行全部成功；报告任务分层分布，不把共享任务的重复当独立样本。",
            "pass_caret_k": "pass^k 与 pass_power_k 同义；不是 pass@k。",
            "repeat_unit": "task-attempt nested within task/session/trajectory",
            "state_reset": "每次运行记录 memory、cache、tool state、seed 和外部 fixture 是否重置",
            "uncertainty_method": "按任务配对或聚类 bootstrap/区间；预声明样本不足与多重比较处置",
        },
        "metric_card_policy": {
            "required_fields": ["task_population", "numerator", "denominator", "slice", "baseline", "uncertainty", "sample_size_rationale", "version", "owner", "failure_action"],
            "universal_thresholds_allowed": False,
            "zero_event_rule": "报告 exposure、套件覆盖和上界解释；零观测不等于零风险。",
        },
        "owners": ["course-evidence-owner", "target-system owner", "independent oracle owner", "release/risk owner"],
        "evidence_refs": [CAREER_REVIEW, AGENT_REVIEW, "research/source-assimilation-ledger.json"],
        "maturity_boundary": "课程页和离线 runner 仅可证明 desk-researched/fixture-tested；真实模型、企业集成、目标学员、从业者、shadow、online 和生产效果保持 NOT_RUN。",
    }


def build_plan() -> dict:
    career = [
        ("TD-C02", "职业责任证据梯：从跟做到独立负责", ["TD-F01"]),
        ("TD-C03", "能力自评：用证据定位当前位置", ["TD-C02"]),
        ("TD-C04", "30/60/90 天成长路线与组织适配", ["TD-C03"]),
        ("TD-F05", "AI/ML 任务族与测试能力地图", ["TD-F04"]),
        ("TD-T26", "AI 测试指标、业务指标与 Metric Card", ["TD-T04", "TD-F05"]),
        ("TD-R01", "作品集、复盘与职业迁移证据", ["TD-C04", "TD-T26"]),
    ]
    agent = [
        ("TD-AG-00", "Agent 测试架构总览：D0-D7 与四证据环", ["TD-F04"]),
        ("TD-AG-01", "D0 评估可信与 Judge Card", ["TD-AG-00", "TD-T03"]),
        ("TD-AG-02", "D1 单 Agent 能力与 span 轨迹", ["TD-AG-01"]),
        ("TD-AG-03", "D2 多 Agent 编排、Handoff 与熔断", ["TD-AG-02"]),
        ("TD-AG-04", "D3 人机协同、中断、接管与确认疲劳", ["TD-AG-03"]),
        ("TD-AG-05", "D4 可靠性分布、pass@k、pass^k 与长时程", ["TD-AG-04", "TD-T04"]),
        ("TD-AG-06", "D5 Agent 安全、MCP 供应链与爆炸半径", ["TD-AG-05", "TD-T17"]),
        ("TD-AG-07", "D6 Agent 延迟、吞吐、成本与资源隔离", ["TD-AG-06", "TD-A03"]),
        ("TD-AG-08", "D7 业务规则、审计、版本、ROI 与风险接受", ["TD-AG-07", "TD-T21"]),
        ("TD-AG-09", "四环实战：CI、沙箱、Shadow/Canary、在线持续", ["TD-AG-08"]),
        ("TD-AG-10", "高风险领域适配器：时效、建议/执行与能力沙箱", ["TD-AG-09"]),
    ]
    return {
        "schema_version": "1.0.0",
        "status": "COURSE-IMPLEMENTED-FIXTURE-BOUNDARY",
        "baseline_public_page_count": 85,
        "pages": [
            {"page_id": page_id, "title": title, "prerequisite_ids": prerequisites, "source_obligation": "career-evolution-system" if page_id in CAREER_PAGE_IDS else "agent-architecture-testing"}
            for page_id, title, prerequisites in career + agent
        ],
        "evidence_boundary": "17 页必须进入公开课程数据、研究包、可运行 fixture、视觉和复用合同；真实模型、企业集成、从业者与目标学员验证仍 NOT_RUN。",
    }


def build_capabilities_and_evidence(tutorial: dict):
    pages = tutorial.get("pages", [])
    page_ids = [page["page_id"] for page in pages]
    career_topics = [page_id for page_id in page_ids if page_id in {"TD-F01", "TD-C01", *CAREER_PAGE_IDS}]
    agent_topics = [page_id for page_id in page_ids if page_id in {"TD-F04", "TD-T15", "TD-T16", "TD-T17", "TD-W01", "TD-W02", "TD-W03", *AGENT_PAGE_IDS}]
    declarations = {
        "schema_version": "1.0.0",
        "capabilities": [
            {
                "capability": "profession-baseline",
                "topics": page_ids,
                "status": "desk-researched",
                "owner": "course editorial owner",
                "evidence": ["tutorial/tutorial-site.json", "research/editorial-review-2026-08-11-final.json"],
            },
            {
                "capability": "artifact-transformation",
                "topics": ["TD-P02"],
                "status": "fixture-tested",
                "owner": "requirements-to-evidence lab owner",
                "evidence": ["research/traceability.json"],
                "method_library": "research/profession-method-library.json",
                "transformation_contracts": {"TD-P02": "research/topics/TD-P02/transformation-contract.json"},
                "prompt_package_dir": "research/prompt-package",
                "prompt_manifest": "research/prompt-package/manifest.json",
                "prompt_eval": "research/prompt-package/eval.json",
                "prompt_mutation": "research/prompt-package/mutation.json",
                "traceability": "research/traceability.json",
            },
            {
                "capability": "career-evolution-system",
                "topics": career_topics,
                "status": "fixture-tested",
                "owner": "career evidence owner",
                "evidence": [CAREER_REVIEW, "research/software-testing-career-agent-adapter.json", "research/source-assimilation-ledger.json"],
            },
            {
                "capability": "agent-architecture-testing",
                "topics": agent_topics,
                "status": "fixture-tested",
                "owner": "agent quality architecture owner",
                "evidence": [AGENT_REVIEW, "research/software-testing-career-agent-adapter.json", "research/source-assimilation-ledger.json"],
            },
        ],
    }
    career_set, agent_set = set(career_topics), set(agent_topics)
    profiles = {"schema_version": "1.0.0", "pages": []}
    evidence = {"schema_version": "1.0.0", "pages": []}
    for page in pages:
        page_id = page["page_id"]
        capabilities = ["profession-baseline"]
        if page_id in career_set:
            capabilities.append("career-evolution-system")
        if page_id in agent_set:
            capabilities.append("agent-architecture-testing")
        if page_id == "TD-P02":
            capabilities.append("artifact-transformation")
        profiles["pages"].append({
            "page_id": page_id,
            "capabilities": capabilities,
            "rationale": "页面把一个专业问题转成版本化工件、独立判断、故障证据和下游决定；附加能力按显式课程链声明。",
            "risk": "缺失来源、Oracle、权限、统计单位或 owner 会制造不可复核结论。",
            "reviewer": "course evidence owner",
            "reviewed_at": datetime.now(timezone.utc).isoformat(),
            "evidence_refs": [f"research/topics/{page_id}/validation.md", "research/executability-audit.json"],
        })
        lane = lambda limitations: {"status": "NOT_RUN", "receipt_refs": [], "limitations": limitations}
        evidence["pages"].append({
            "page_id": page_id,
            "maturity_claim": "desk-researched",
            "model": {**lane("没有真实模型/provider 重复运行证据；版本化 Prompt 不等于模型执行。"), "provider": "none"},
            "integration": lane("没有目标企业系统、认证、清理和回滚运行证据。"),
            "clean_room": lane("课程侧 executability/fixture 另有收据；专业证据合同不在此伪造 clean-room PASS。"),
            "practitioner": lane("没有具名测试开发从业者评审收据。"),
            "learner": lane("没有至少五名目标学员的理解、完成与迁移观察。"),
        })
    return declarations, profiles, evidence


def main() -> None:
    ledger = build_ledger()
    adapter = build_adapter()
    tutorial = read_json(TUTORIAL_PATH)
    declarations, profiles, evidence = build_capabilities_and_evidence(tutorial)
    write_json(ADAPTER_PATH, adapter)
    write_json(LEDGER_PATH, ledger)
    write_json(DECLARATIONS_PATH, declarations)
    write_json(PROFILES_PATH, profiles)
    write_json(EVIDENCE_PATH, evidence)
    write_json(PLAN_PATH, build_plan())
    print(json.dumps({
        "sources": len(ledger["sources"]),
        "sections": len(ledger["sections"]),
        "atoms": len(ledger["atoms"]),
        "dispositions": ledger["coverage_receipt"]["disposition_counts"],
        "pages": len(tutorial.get("pages", [])),
        "new_page_plan": len(CAREER_PAGE_IDS) + len(AGENT_PAGE_IDS),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
