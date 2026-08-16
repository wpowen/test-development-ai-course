#!/usr/bin/env python3
"""Regenerate the two hand-authored methodology overview SVGs.

These diagrams live in ``methodology/visuals/`` and are referenced from
``methodology/README.md``. They are canonical sources, not mirrors.
"""

from __future__ import annotations

from pathlib import Path

from svg_design_system import (
    MONO,
    SANS,
    TOKENS as DS,
    css as ds_css,
    defs as ds_defs,
    footer as ds_footer,
    header as ds_header,
    xml,
)


ROOT = Path(__file__).resolve().parents[1]
VISUALS = ROOT / "methodology" / "visuals"


_ROW_H = {"h": 21, "m": 21, "s": 21, "tiny": 20, "badge": 19, "good": 19, "mono": 19}
_ROW_STYLES = {
    "h": (SANS, 12.5, "700", DS["ink"]),
    "m": (SANS, 11.5, "500", DS["muted"]),
    "s": (SANS, 12, "600", DS["ink"]),
    "tiny": (SANS, 10.5, "500", DS["soft"]),
    "badge": (MONO, 10.5, "700", DS["red"]),
    "good": (MONO, 10.5, "700", DS["forest"]),
    "mono": (MONO, 10.5, "700", DS["amber"]),
}


def panel(x, y, w, title, accent, fill, rows, title_size=14):
    body_h = sum(_ROW_H.get(row[1], 21) if isinstance(row, tuple) else 21 for row in rows)
    h = 56 + body_h + 16
    parts = [
        f'<g filter="url(#ds-soft)"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="{accent}" stroke-width="1.5"/></g>',
        f'<rect x="{x}" y="{y}" width="6" height="{h}" rx="3" fill="{accent}"/>',
        f'<text x="{x + 24}" y="{y + 30}" font-family="{SANS}" font-size="{title_size}" font-weight="800" fill="{DS["ink"]}">{xml(title)}</text>',
    ]
    yy = y + 58
    for row in rows:
        text, kind = row if isinstance(row, tuple) else (row, "m")
        font, size, weight, color = _ROW_STYLES[kind]
        parts.append(f'<text x="{x + 24}" y="{yy}" font-family="{font}" font-size="{size}" font-weight="{weight}" fill="{color}">{xml(text)}</text>')
        yy += _ROW_H.get(kind, 21)
    return "".join(parts), h


def edge(x1, y1, x2, y2, tone="forest", dashed=False):
    marker = {"forest": "ds-arw-forest", "amber": "ds-arw-amber", "red": "ds-arw-red"}.get(tone, "ds-arw-forest")
    color = {"forest": DS["forest"], "amber": DS["amber"], "red": DS["red"]}.get(tone, DS["forest"])
    dash = ' stroke-dasharray="6 5"' if dashed else ""
    return f'<path d="M {x1} {y1} L {x2} {y2}" fill="none" stroke="{color}" stroke-width="2"{dash} marker-end="url(#{marker})"/>'


def solution_architecture_svg() -> str:
    W, H = 1240, 1040
    forest = DS["forest"]
    red = DS["red"]
    gap = 22

    l1, l1_h = panel(40, 150, 440, "第 1 层 · 契约与门禁", DS["purple"], DS["purpleFill"], [
        ("Skill 34 份 reference", "s"),
        ("page-depth-and-projection-fidelity（本次新增）", "m"),
        ("8 道机器门禁 · 5 套可运行 lab · 0/1/0", "m"),
        ("它约束下面三层，不产生内容", "tiny"),
    ])
    l2_y = 150 + l1_h + gap
    l2, l2_h = panel(40, l2_y, 440, "第 2 层 · 方法论", DS["blue"], DS["blueFill"], [
        ("methodology/ 15 篇", "s"),
        ("九阶段生命周期 · 六层 Oracle · 五级成熟度", "m"),
        ("dimensions/ 11 维度 · 108 篇", "m"),
        ("Agent 8 域 36 维 · Benchmark · 职业演进", "m"),
        ("判断表、反例、诊断树都在这一层定稿", "tiny"),
    ])
    l3_y = l2_y + l2_h + gap
    l3, l3_h = panel(40, l3_y, 440, "第 3 层 · 内容源（唯一事实来源）", forest, DS["mint"], [
        ("_sources/*.json · 11 份", "s"),
        ("每页六段：术语 · 判断表 · 反例 · 诊断树 · 演练 · 带走物", "m"),
        ("改内容 = 改 JSON，不改代码", "badge"),
    ])
    l4_y = l3_y + l3_h + gap
    l4, l4_h = panel(40, l4_y, 440, "第 4 层 · 交付面", DS["amber"], DS["amberFill"], [
        ("102 学习页 · 13 模块", "s"),
        ("静态站点 · 教程 JSON · 103 张 SVG", "m"),
        ("108 篇 Markdown（文档站 / PDF）", "m"),
        ("正文 20.4 万字 · 中位 1948 字", "good"),
    ])

    gen1_y = l3_y + 8
    gen1, gen1_h = panel(520, gen1_y, 230, "投影器 · 站点", DS["soft"], DS["cream"], [
        ("build-deep-module.py", "s"),
        ("→ 站点 TS 模块", "tiny"),
    ])
    gen2_y = gen1_y + gen1_h + 12
    gen2, gen2_h = panel(520, gen2_y, 230, "投影器 · 文档", DS["soft"], DS["cream"], [
        ("build-dimension-docs", "s"),
        ("→ 108 篇 Markdown", "tiny"),
    ])

    gate, gate_h = panel(790, 150, 410, "八道门禁（fail-closed）", red, DS["redFill"], [
        ("1 内容结构　2 正文深度 ≥1600　3 判断表 ≥3", "s"),
        ("4 重复率 ≤20%　5 可执行性 102/102　6 材料四跳闭包", "s"),
        ("7 目录与晋级　8 发布候选结构", "s"),
        ("2 / 3 / 4 为本次新增", "badge"),
        ("执行失败等同不通过，不得视为跳过", "tiny"),
    ])
    cand_y = 150 + gate_h + gap
    cand, cand_h = panel(790, cand_y, 410, "发布候选包", DS["forest"], DS["mint"], [
        ("dist/github-candidate/", "s"),
        ("candidate_structure_valid = true · unexpected_errors = []", "good"),
        ("publication_status = BLOCKED-HIGHER-MATURITY", "badge"),
    ])
    ext_y = cand_y + cand_h + gap
    ext, ext_h = panel(790, ext_y, 410, "外部验证", red, DS["redFill"], [
        ("L2 真实模型 · L3 企业集成 · L4 从业者 · L5 生产", "m"),
        ("全部 NOT_RUN", "badge"),
        ("未运行即阻断，不冒充", "tiny"),
    ])
    ledger_y = ext_y + ext_h + gap
    ledger, ledger_h = panel(790, ledger_y, 410, "投影保真台账", DS["purple"], DS["purpleFill"], [
        ("manuscript → page · 逐条 claim 处置", "m"),
        ("unaccounted 必须为 0", "badge"),
        ("此前缺失的一跳：研究 3000 字 vs 页面 1030 字", "tiny"),
    ])
    paths, paths_h = panel(40, l4_y + l4_h + gap, 1160, "三条学习路径", DS["blue"], DS["blueFill"], [
        ("A 新人：术语 → 生命周期 → 跟做　｜　B 测试负责人：策略 → 度量 → RACI　｜　C 测 AI 系统：固定 Oracle 与数据集，再写评测", "m"),
    ])

    body = f'''<g data-source-ref="methodology/00-完整测试方案总览.md">
{l1}
{l2}
{l3}
{l4}
{gen1}
{gen2}
{gate}
{cand}
{ext}
{ledger}
{paths}
{edge(260, 150 + l1_h, 260, l2_y - 4)}
{edge(260, l2_y + l2_h, 260, l3_y - 4)}
{edge(260, l3_y + l3_h, 260, l4_y - 4)}
{edge(480, l3_y + int(l3_h * 0.4), 514, l3_y + int(l3_h * 0.4))}
{edge(480, l4_y + int(l4_h * 0.45), 514, l4_y + int(l4_h * 0.45), dashed=True)}
{edge(635, gen1_y + gen1_h, 635, gen2_y - 4)}
{edge(514, gen2_y + int(gen2_h * 0.5), 480, l4_y + int(l4_h * 0.45), dashed=True)}
{edge(995, 150 + gate_h, 995, cand_y - 4)}
{edge(995, cand_y + cand_h, 995, ext_y - 4)}
{edge(995, ext_y + ext_h, 995, ledger_y - 4)}
<text x="268" y="{150 + l1_h + 16}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["forest"]}">约束</text>
<text x="268" y="{l2_y + l2_h + 16}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["forest"]}">产生</text>
<text x="268" y="{l3_y + l3_h + 16}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["forest"]}">投影</text>
<path d="M790 230 C600 230 600 130 480 130" fill="none" stroke="{red}" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#ds-arw-red)"/>
<text x="636" y="118" text-anchor="middle" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{red}">发布被阻断时回到内容与门禁</text>
</g>'''
    boundary = "整体成熟度 L1 fixture-tested；L2–L5 全部 NOT_RUN。四层单向依赖，反向修改交付面会在下次生成时被覆盖，这是设计意图。"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title id="title">完整测试方案四层架构与投影链</title>
<desc id="desc">契约与门禁约束方法论，方法论产生内容源，内容源经两个生成器投影成站点模块与 Markdown 文档，再经八道门禁形成发布候选；外部验证证据保持 NOT_RUN。</desc>
{ds_defs()}
<style>{ds_css()}</style>
<rect class="ds-bg" width="{W}" height="{H}" rx="22"/>
{ds_header(W, 118, "METHODOLOGY · 方案总架构", "完整测试方案四层架构与投影链", "契约 → 方法论 → 内容源 → 交付面；八道门禁 fail-closed。", "source · methodology/00-完整测试方案总览.md")}
{body}
{ds_footer(W, H, boundary)}
</svg>'''


def lifecycle_flow_svg() -> str:
    W, H = 1240, 900
    forest = DS["forest"]
    red = DS["red"]

    stages = [
        ("S1 依据冻结", "出：source-manifest", "版本 · hash · 优先级", "冲突未升级 → BLOCKED", "badge"),
        ("S2 需求契约", "出：requirement-contract", "两道门禁分别留痕", "PASS_SEMANTIC 需署名", "good"),
        ("S3 技术契约", "出：需求—技术矩阵", "六类可测试对象", "不可观察 → BLOCKED", "badge"),
        ("S4 风险与策略", "出：风险登记册 · 策略", "I×L×D · 层级 · 方法", "降档需具名接受", "tiny"),
        ("S5 Oracle 设计", "出：Oracle 设计记录", "六层组合 · 独立来源", "L5 不得单独放行", "badge"),
        ("S6 用例与数据", "出：用例 · 切片 · 评测集", "五类样本 · holdout 封存", "生成用例过变异才算资产", "tiny"),
        ("S7 环境与自动化", "出：环境登记册 · 流水线", "五条合并门槛", "模型调用默认录制回放", "tiny"),
        ("S8 执行与归因", "出：Run Receipt · 缺陷", "0/1/0 三段 · 五层归因", "分不清 → UNKNOWN 升级", "badge"),
        ("S9 发布判断", "出：发布决定书 · Waiver", "按档位准出 · 七问", "剩余风险须具名接受", "badge"),
    ]

    top_y, bottom_y = 180, 400
    top_xs = [40, 262, 484, 706, 928]
    bottom_xs = [928, 706, 484, 262]

    stage_svg = []
    # top row S1..S5
    for i in range(5):
        title, out, mid, foot, foot_kind = stages[i]
        rows = [(out, "s"), (mid, "m"), (foot, foot_kind)]
        svg, _ = panel(top_xs[i], top_y, 210, title, DS["blue"], DS["blueFill"], rows, title_size=13)
        stage_svg.append(svg)
    # bottom row S6..S9 (right to left)
    for i in range(4):
        title, out, mid, foot, foot_kind = stages[5 + i]
        rows = [(out, "s"), (mid, "m"), (foot, foot_kind)]
        svg, _ = panel(bottom_xs[i], bottom_y, 210, title, DS["blue"], DS["blueFill"], rows, title_size=13)
        stage_svg.append(svg)

    product, _ = panel(262, 60, 210, "产品 owner", forest, DS["mint"], [("裁决规则冲突 · 语义确认", "m")], title_size=13)
    domain, _ = panel(928, 60, 210, "领域 owner", forest, DS["mint"], [("金额 / 权限 / 状态判据", "m")], title_size=13)
    release, _ = panel(40, 400, 210, "发布 owner", forest, DS["mint"], [("接受剩余风险并署名", "m")], title_size=13)
    sre, _ = panel(40, 500, 210, "SRE / 运行负责人", forest, DS["mint"], [("回滚决定与执行", "m")], title_size=13)

    trace, _ = panel(262, 620, 480, "Trace-to-Regression（参数化闭环）", red, DS["redFill"], [
        ("捕获 → 复现 M/N → 归因到层 → 补回归用例", "m"),
        ("→ 变异验证检测力 → 同类反查 → 更新风险登记册", "m"),
        ("只修代码不补用例、补用例不验检测力，都不算闭环", "badge"),
    ])
    prod, _ = panel(780, 620, 210, "生产", DS["soft"], DS["cream"], [
        ("持续评估 · 漂移检测", "m"),
        ("逃逸缺陷台账", "m"),
        ("本项目 NOT_RUN", "badge"),
    ])

    body = f'''<g data-source-ref="methodology/03-生命周期总览.md">
{stage_svg[0]}
{stage_svg[1]}
{stage_svg[2]}
{stage_svg[3]}
{stage_svg[4]}
{stage_svg[5]}
{stage_svg[6]}
{stage_svg[7]}
{stage_svg[8]}
{product}
{domain}
{release}
{sre}
{trace}
{prod}
{edge(250, 180 + 46, 256, 180 + 46)}
{edge(472, 180 + 46, 478, 180 + 46)}
{edge(694, 180 + 46, 700, 180 + 46)}
{edge(916, 180 + 46, 922, 180 + 46)}
{edge(1033, 180 + 133, 1033, 394)}
{edge(922, 400 + 46, 916, 400 + 46)}
{edge(700, 400 + 46, 694, 400 + 46)}
{edge(478, 400 + 46, 472, 400 + 46)}
<path d="M367 153 L367 174" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M1033 153 L1033 174" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M250 445 L256 445" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M145 593 L145 640 L256 640" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M780 680 L748 680" fill="none" stroke="{red}" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#ds-arw-red)"/>
<path d="M262 753 L20 753 L20 313 L145 313" fill="none" stroke="{red}" stroke-width="2" stroke-dasharray="7 5" stroke-linejoin="round" marker-end="url(#ds-arw-red)"/>
<text x="130" y="743" text-anchor="middle" font-family="{SANS}" font-size="11.5" font-weight="700" fill="{red}">逃逸缺陷回灌 S1</text>
</g>'''
    boundary = "S9 的生产闭环在本项目为 NOT_RUN：没有真实流量、没有生产接入、没有在线采样。蓝框 = 阶段，绿框 = 人工决策点，红线 = 阻断与回流。"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title id="title">九阶段测试生命周期与四个人工交互点</title>
<desc id="desc">S1 到 S9 按证据流串联，每阶段产物是下一阶段准入；四个人工决策点分别由产品、领域、发布与运行负责人承担；逃逸缺陷经 Trace-to-Regression 回灌 S1。</desc>
{ds_defs()}
<style>{ds_css()}</style>
<rect class="ds-bg" width="{W}" height="{H}" rx="22"/>
{ds_header(W, 118, "METHODOLOGY · 九阶段生命周期", "九阶段测试生命周期与四个人工交互点", "每阶段产物是下一阶段准入；跳过准出等于把不确定性推给下游。", "source · methodology/03-生命周期总览.md")}
{body}
{ds_footer(W, H, boundary)}
</svg>'''


def main() -> None:
    VISUALS.mkdir(parents=True, exist_ok=True)
    (VISUALS / "solution-architecture.svg").write_text(solution_architecture_svg() + "\n", encoding="utf-8")
    (VISUALS / "lifecycle-flow.svg").write_text(lifecycle_flow_svg() + "\n", encoding="utf-8")
    print("methodology visuals regenerated: 2 files")


if __name__ == "__main__":
    main()
