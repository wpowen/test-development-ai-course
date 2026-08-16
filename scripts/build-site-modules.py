#!/usr/bin/env python3
"""把全部 11 份内容源投影成站点深度层 TypeScript 模块。

用法：
    python3 scripts/build-site-modules.py            # 全量重建
    python3 scripts/build-site-modules.py benchmark  # 只重建一个模块

此前投影靠人工逐条调用 `build-deep-module.py`，命令散落在提交记录里，
换个人就无法复现同一份产物。这个驱动把「哪份源生成哪个模块、用什么导出名」
写成一份注册表，使重建成为一条命令。

单一事实来源是 `methodology/dimensions/_sources/*.json`。
本脚本与 `build-dimension-docs.mjs` 是它的两个投影：前者产出站点模块，
后者产出维度 Markdown。改内容请改 JSON，改完两个投影都要重跑。
"""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "methodology" / "dimensions" / "_sources"
OUTPUT_DIR = ROOT / "site" / "content" / "modules"
BUILDER = ROOT / "scripts" / "build-deep-module.py"

# 源文件名 → (输出模块, 导出函数名, 模块编号, 模块标题)
REGISTRY: dict[str, tuple[str, str, str, str]] = {
    "ai-foundations": ("ai-foundations-deep.ts", "aiFoundationsDeepBlocks", "TD-M01", "大模型与 AI 系统基础"),
    "ai-assisted-testing": ("ai-assisted-deep.ts", "aiAssistedDeepBlocks", "TD-M02", "AI 帮你做传统测试"),
    "rag-quality": ("rag-quality-deep.ts", "ragQualityDeepBlocks", "TD-M03", "测试 LLM 和 RAG"),
    "agent-workflow": ("agent-workflow-deep.ts", "agentWorkflowDeepBlocks", "TD-M04", "测试 Agent、Worker 与 Workflow"),
    "quality-system": ("quality-system-deep.ts", "qualitySystemDeepBlocks", "TD-M05", "建设 AI 质量系统"),
    "benchmark": ("benchmark-deep.ts", "benchmarkDeepBlocks", "TD-M06", "Benchmark 与分数工程"),
    "quality-platform": ("quality-platform-deep.ts", "qualityPlatformDeepBlocks", "TD-M07", "专业专题与 Capstone"),
    "professional-specializations": (
        "professional-specializations-deep.ts",
        "professionalSpecializationsDeepBlocks",
        "TD-M08",
        "传统测试专项",
    ),
    "ai-serving": ("ai-serving-deep.ts", "aiServingDeepBlocks", "TD-M09", "AI 接口、性能与可靠性"),
    "career-evolution": ("career-evolution-deep.ts", "careerEvolutionDeepBlocks", "TD-M10", "职业演进"),
    "agent-performance": ("agent-performance-deep.ts", "agentPerformanceDeepBlocks", "TD-M11", "Agent 性能与稳定性工程"),
    # 补充层：正文手写，内容源只提供失效点/架构索引/指标卡/门禁四段。
    "requirements-lifecycle-supplement": (
        "requirements-lifecycle-supplement.ts", "requirementsLifecycleSupplement", "TD-M00", "完整测试生命周期"),
    "agent-architecture-supplement": (
        "agent-architecture-supplement.ts", "agentArchitectureSupplement", "TD-M12", "Agent 测试架构"),
    "prompt-first-lesson-supplement": (
        "prompt-first-lesson-supplement.ts", "promptFirstLessonSupplement", "TD-M01", "Prompt 小白第一课"),
}

# 走补充层投影的源（只写四段，用 renderSupplement 渲染）。
SUPPLEMENT = {
    "requirements-lifecycle-supplement",
    "agent-architecture-supplement",
    "prompt-first-lesson-supplement",
}


def header_for(slug: str, module_id: str, title: str) -> str:
    return "\n".join([
        "/**",
        f" * {module_id}「{title}」深度层。",
        " *",
        f" * 内容源：methodology/dimensions/_sources/{slug}.json",
        " * 本文件是投影产物，直接编辑会在下次重建时被覆盖——请改 JSON 后运行",
        " * `python3 scripts/build-site-modules.py`。",
        " *",
        " * 渲染器 `deep-layer.ts` 不写任何教学句：页面上的每一句话都来自 JSON。",
        " */",
    ])


def main() -> int:
    wanted = sys.argv[1:] or list(REGISTRY)
    unknown = [slug for slug in wanted if slug not in REGISTRY]
    if unknown:
        print(f"未知模块：{', '.join(unknown)}", file=sys.stderr)
        print(f"可选：{', '.join(REGISTRY)}", file=sys.stderr)
        return 2

    failures: list[str] = []
    for slug in wanted:
        out_name, export_name, module_id, title = REGISTRY[slug]
        source = SOURCE_DIR / f"{slug}.json"
        if not source.exists():
            failures.append(f"{slug}: 内容源不存在 {source}")
            continue
        result = subprocess.run(
            [
                sys.executable,
                str(BUILDER),
                str(source),
                str(OUTPUT_DIR / out_name),
                export_name,
                header_for(slug, module_id, title),
                *(["--supplement"] if slug in SUPPLEMENT else []),
            ],
            check=False,
        )
        if result.returncode != 0:
            failures.append(f"{slug}: 投影失败")

    if failures:
        print("", file=sys.stderr)
        for failure in failures:
            print(f"  ✗ {failure}", file=sys.stderr)
        return 1

    print(f"\n{len(wanted)} 个模块已投影。接着跑 `node scripts/build-dimension-docs.mjs` 同步 Markdown。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
