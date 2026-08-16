#!/usr/bin/env python3
"""Project the canonical Agent architecture learner bundle to public + ZIP."""

from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
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
SOURCE = ROOT / "courses/td-ai-agent-architecture-system/learner-materials"
PUBLIC = ROOT / "site/public/materials/agent-architecture-system"
ARCHIVE = ROOT / "site/public/materials/agent-architecture-system.zip"
SOURCE_SHA256 = "b38274bcc1ba2d8c6e721157765f1b64ae70b0cbc9cc2cdd0a703140a69b2b54"


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _card(x, y, w, h, title, lines, accent, fill, title_size=15):
    out = f'<g filter="url(#ds-soft)"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="{accent}" stroke-width="1.5"/></g>'
    out += f'<rect x="{x}" y="{y}" width="6" height="{h}" rx="3" fill="{accent}"/>'
    out += f'<text x="{x + 24}" y="{y + 30}" font-family="{SANS}" font-size="{title_size}" font-weight="800" fill="{DS["ink"]}">{xml(title)}</text>'
    yy = y + 56
    for line in lines:
        out += f'<text x="{x + 24}" y="{yy}" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{DS["muted"]}">{xml(line)}</text>'
        yy += 21
    return out


def _edge(x1, y1, x2, y2, tone="forest", dashed=False):
    marker = "ds-arw-forest" if tone == "forest" else "ds-arw-red"
    color = DS["forest"] if tone == "forest" else DS["red"]
    dash = ' stroke-dasharray="6 5"' if dashed else ""
    return f'<path d="M {x1} {y1} L {x2} {y2}" fill="none" stroke="{color}" stroke-width="2"{dash} marker-end="url(#{marker})"/>'


_RING_TONES = {
    "mint": (DS["mint"], DS["forest"]),
    "blue": (DS["blueFill"], DS["blue"]),
    "amber": (DS["amberFill"], DS["amber"]),
    "purple": (DS["purpleFill"], DS["purple"]),
}


def _ring_card(x, top, w, index, title, tone, input_text, entry, method, exit_text, block, owner, rollback, status, badge):
    fill, stroke = _RING_TONES[tone]
    h = 470
    parts = [
        f'<g filter="url(#ds-soft)"><rect x="{x}" y="{top}" width="{w}" height="{h}" rx="16" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/></g>',
        f'<rect x="{x}" y="{top}" width="6" height="{h}" rx="3" fill="{stroke}"/>',
        f'<text x="{x + 24}" y="{top + 30}" font-family="{SANS}" font-size="15" font-weight="800" fill="{DS["ink"]}">{xml(title)}</text>',
        f'<text x="{x + 24}" y="{top + 50}" font-family="{MONO}" font-size="10" font-weight="800" letter-spacing=".1em" fill="{stroke}">RING {index:02d}</text>',
    ]
    yy = top + 78
    for label, value in [("input", input_text), ("entry", entry), ("method", method), ("exit", exit_text)]:
        parts.append(f'<text x="{x + 24}" y="{yy}" font-family="{MONO}" font-size="9.5" font-weight="700" letter-spacing=".08em" fill="{DS["soft"]}">{xml(label)}</text>')
        parts.append(f'<text x="{x + 24}" y="{yy + 16}" font-family="{SANS}" font-size="11.5" font-weight="600" fill="{DS["ink"]}">{xml(value)}</text>')
        yy += 40
    parts.append(f'<rect x="{x + 20}" y="{yy}" width="{w - 40}" height="44" rx="9" fill="{DS["redFill"]}" stroke="{DS["red"]}" stroke-width="1.2"/>')
    parts.append(f'<text x="{x + 32}" y="{yy + 17}" font-family="{MONO}" font-size="9.5" font-weight="700" letter-spacing=".08em" fill="{DS["red"]}">hard block</text>')
    parts.append(f'<text x="{x + 32}" y="{yy + 33}" font-family="{SANS}" font-size="11" font-weight="700" fill="{DS["ink"]}">{xml(block)}</text>')
    yy += 58
    parts.append(f'<text x="{x + 24}" y="{yy}" font-family="{MONO}" font-size="9.5" font-weight="700" letter-spacing=".08em" fill="{DS["soft"]}">owner</text>')
    parts.append(f'<text x="{x + 24}" y="{yy + 16}" font-family="{SANS}" font-size="11.5" font-weight="600" fill="{DS["ink"]}">{xml(owner)}</text>')
    yy += 36
    parts.append(f'<text x="{x + 24}" y="{yy}" font-family="{MONO}" font-size="9.5" font-weight="700" letter-spacing=".08em" fill="{DS["soft"]}">rollback</text>')
    parts.append(f'<text x="{x + 24}" y="{yy + 16}" font-family="{SANS}" font-size="11.5" font-weight="600" fill="{DS["ink"]}">{xml(rollback)}</text>')
    yy += 38
    parts.append(f'<rect x="{x + 20}" y="{yy}" width="{w - 40}" height="62" rx="10" fill="{DS["white"]}" stroke="{stroke}" stroke-width="1.2"/>')
    parts.append(f'<text x="{x + 32}" y="{yy + 20}" font-family="{SANS}" font-size="11" font-weight="700" fill="{DS["muted"]}">{xml(status)}</text>')
    parts.append(f'<text x="{x + 32}" y="{yy + 42}" font-family="{MONO}" font-size="11" font-weight="800" fill="{stroke}">{xml(badge)}</text>')
    return "".join(parts)


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


def _panel(x, y, w, title, accent, fill, rows, title_size=14):
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


def architecture_svg() -> str:
    W, H = 1240, 880
    forest, lime = DS["forest"], DS["lime"]
    blue, purple = DS["blue"], DS["purple"]
    amber, red = DS["amber"], DS["red"]
    mint = DS["mint"]
    body = f'''<g data-source-ref="AI agent测试架构.txt:L73-L238">
{_card(40, 168, 270, 128, "输入与风险", ["任务 / 数据 / 权限 / 工具", "失败成本 / 副作用 / owner"], blue, DS["blueFill"])}
{_card(336, 168, 270, 128, "D0 评估可信", ["Gold / Rubric / Judge / 人审", "偏差 / 漂移 / 分歧 / 构念效度"], purple, DS["purpleFill"])}
{_card(632, 168, 270, 128, "D1–D3 行为与协作", ["D1 单体能力与轨迹", "D2 编排交接与隔离", "D3 中断 / 接管 / 人机权威"], forest, mint)}
{_card(928, 168, 270, 128, "D4–D7 系统与治理", ["D4 可靠性 · D5 安全", "D6 效率经济 · D7 业务治理", "区间 / 预算 / 规则 / 决定权"], forest, mint)}
{_edge(310, 232, 330, 232)}
{_edge(606, 232, 626, 232)}
{_edge(902, 232, 922, 232)}
<g filter="url(#ds-strong)"><rect x="40" y="330" width="1160" height="108" rx="16" fill="{DS["amberFill"]}" stroke="#e0b76a" stroke-width="1.5"/></g>
<rect x="40" y="330" width="6" height="108" rx="3" fill="{amber}"/>
<text x="64" y="360" font-family="{SANS}" font-size="14" font-weight="800" fill="{DS["ink"]}">边界 → 风险 → Observable → Method → 独立 Oracle → Case / Fault → Evidence → Decision</text>
<text x="64" y="386" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{DS["muted"]}">能力边界：任务与工具能做什么　│　信任边界：什么输入与记忆不可信　│　副作用边界：什么动作不可逆</text>
<text x="64" y="410" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{DS["muted"]}">每个 D0–D7 域都必须沿这条链留下证据；只有风险清单、没有 Oracle 和 failure action 的架构不可测试。</text>
<text x="64" y="431" font-family="{MONO}" font-size="10.5" font-weight="700" fill="{amber}">固定阈值进入 Metric Card（task / population / slice / uncertainty / owner / failure action），不得从来源直接复制</text>
{_edge(235, 296, 175, 324, dashed=True)}
{_edge(735, 296, 735, 324, dashed=True)}
{_edge(1035, 296, 990, 324, dashed=True)}
{_card(40, 480, 360, 132, "四证据环", ["离线 fixture → 受控沙箱", "影子 / 灰度 → 在线持续", "未运行的环 = NOT_RUN"], forest, mint)}
{_card(440, 480, 360, 132, "运行时护栏", ["最小权限 / 策略沙箱 / 预算", "幂等 / Kill Switch / 回滚", "模型声明不是强制控制"], red, DS["redFill"])}
{_card(840, 480, 360, 132, "决策与反馈", ["PASS / FAIL / BLOCKED / 不足", "风险接受 / 回滚 / 新样例", "具名 owner 才能作决定"], amber, DS["amberFill"])}
{_edge(400, 546, 434, 546)}
{_edge(800, 546, 834, 546)}
{_edge(620, 438, 620, 474, dashed=True)}
{_edge(620, 438, 220, 474, dashed=True)}
{_edge(620, 438, 1020, 474, dashed=True)}
<path d="M1020 612 C1020 720 180 720 180 232" fill="none" stroke="{red}" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#ds-arw-red)"/>
<text x="410" y="726" font-family="{SANS}" font-size="11.5" font-weight="700" fill="{red}">失败回灌：事故 / 漂移 / 新攻击 → 更新输入、D0 校准集、故障库与护栏</text>
</g>'''
    boundary = "本图是来源结构的课程适配；真实模型、真实工具、企业权限、从业者评审与生产效果均 NOT_RUN，不证明上线安全。"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title id="title">AI Agent 测试总架构：边界、D0–D7、证据与反馈</title>
<desc id="desc">从输入与风险进入架构边界，D0 先校准评估系统，D1 到 D7 分别检查能力、编排、人机协同、可靠性、安全、效率和治理；四证据环承载执行，运行时护栏强制停止，决定与反馈回到测试资产。本图不代表真实 Agent、企业集成或生产效果已验证。</desc>
{ds_defs()}
<style>{ds_css()}</style>
<rect class="ds-bg" width="{W}" height="{H}" rx="22"/>
{ds_header(W, 118, "AGENT · 测试总架构", "AI Agent 测试总架构：边界、D0–D7、证据与反馈", "先画系统与信任边界，再选择测试；D0 的可信度决定其他数字的上限。", "source · AI agent测试架构.txt:L73-L238")}
{body}
{ds_footer(W, H, boundary)}
</svg>'''


def four_ring_svg() -> str:
    W, H = 1240, 920
    top = 160
    ring_data = [
        ("环 1 · 离线 fixture", "mint", "冻结 case / schema / mutation", "版本与 Oracle 可追",
         "确定性规则 + 红绿循环", "预期退出码 + hash receipt", "Oracle / lineage 缺失",
         "课程 / 测试资产 owner", "撤销候选资产", "当前课程成熟度", "PASS-FIXTURE only"),
        ("环 2 · 受控沙箱", "blue", "真实接口的隔离副本", "权限、复位、脱敏、预算",
         "轨迹回放与故障注入", "可重复集成结果与归因", "副作用不可控",
         "集成环境 owner", "恢复沙箱快照", "当前状态", "NOT_RUN"),
        ("环 3 · 影子 / 灰度", "amber", "真实 workload，动作不生效", "配对版本与流量策略",
         "切片对比、人工抽检", "统计区间与已知失败", "真实动作未隔离",
         "发布 / 业务 owner", "停止灰度并回旧版", "当前状态", "NOT_RUN"),
        ("环 4 · 在线持续", "purple", "线上 Trace 与高危事件", "SLO / 采样 / 隐私 policy",
         "漂移、回归、事故回灌", "持续，不是一次性通过", "护栏或审计失效",
         "运行 / 风险 owner", "Kill Switch + 回滚", "当前状态", "NOT_RUN"),
    ]
    cards = []
    for i, (title, tone, input_text, entry, method, exit_text, block, owner, rollback, status, badge) in enumerate(ring_data):
        cards.append(_ring_card(54 + i * 294, top, 250, i + 1, title, tone, input_text, entry, method, exit_text, block, owner, rollback, status, badge))
    body = f'''<g data-source-ref="AI agent测试架构.txt:L496-L524">
{cards[0]}
{cards[1]}
{cards[2]}
{cards[3]}
{_edge(310, top + 34, 342, top + 34)}
{_edge(604, top + 34, 636, top + 34)}
{_edge(898, top + 34, 930, top + 34)}
<g filter="url(#ds-strong)"><rect x="220" y="648" width="800" height="100" rx="16" fill="{DS["amberFill"]}" stroke="#e0b76a" stroke-width="1.5"/></g>
<rect x="220" y="648" width="6" height="100" rx="3" fill="{DS["amber"]}"/>
<text x="246" y="676" font-family="{SANS}" font-size="14" font-weight="800" fill="{DS["ink"]}">参数化门禁与失败回路</text>
<text x="246" y="700" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{DS["muted"]}">每环的时长、样本量、流量比例与阈值必须来自 Metric Card 的 parameter + population + uncertainty + owner。</text>
<text x="246" y="722" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{DS["muted"]}">任一 exit 不满足：本环保持 FAIL / BLOCKED / EVIDENCE-INSUFFICIENT，不得升级；执行 rollback 并把失败样例回灌环 1。</text>
<text x="246" y="742" font-family="{MONO}" font-size="10.5" font-weight="700" fill="{DS["amber"]}">本图移除来源中的固定分钟、天数和采样比例；它们只是来源示例，不是通用 policy。</text>
<path d="M1061 630 L1061 788 L179 788 L179 630" fill="none" stroke="{DS["red"]}" stroke-width="2" stroke-dasharray="7 5" stroke-linejoin="round" marker-end="url(#ds-arw-red)"/>
<text x="620" y="778" text-anchor="middle" font-family="{SANS}" font-size="11.5" font-weight="700" fill="{DS["red"]}">任一 exit 失败 → rollback → 回灌环 1</text>
</g>'''
    boundary = "四证据环是测试与成熟度模型，不代表后三环已接入真实系统；真实模型、集成、从业者与生产效果均 NOT_RUN。"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title id="title">四证据环：从离线 fixture 到在线持续评估</title>
<desc id="desc">四个独立证据环说明离线 fixture、受控沙箱、影子或灰度、在线持续评估各自的输入、entry、exit、hard block、owner 与 rollback。时长、样本量、流量比例与阈值全部参数化；当前课程只证明 fixture，后三环均为 NOT_RUN，不代表已运行。</desc>
{ds_defs()}
<style>{ds_css()}</style>
<rect class="ds-bg" width="{W}" height="{H}" rx="22"/>
{ds_header(W, 118, "AGENT · 四证据环", "四证据环：不同环境提供不同成熟度的证明", "每次升级都要新的输入、风险、统计、owner 和回滚；fixture 成功不能自动越级。", "source · AI agent测试架构.txt:L496-L524")}
{body}
{ds_footer(W, H, boundary)}
</svg>'''


def gate_svg() -> str:
    W, H = 1240, 940
    amber = DS["amber"]
    red = DS["red"]
    blue = DS["blue"]
    forest = DS["forest"]

    input_svg, input_h = _panel(40, 150, 300, "候选版本证据包", DS["soft"], DS["cream"], [
        ("四维版本 lineage：模型 / prompt / 工具 / 记忆", "m"),
        ("D0–D7 各域原始运行结果", "m"),
        ("缺 lineage 的证据不进入门禁", "badge"),
    ])
    stage1, h1 = _panel(380, 150, 370, "第一段 · 硬红线（布尔，无例外）", red, DS["redFill"], [
        ("D5 高危攻击：符合已批准 policy", "s"),
        ("D7-1 硬业务规则：不得违反", "s"),
        ("D5-6 不可逆动作：不得绕过确认", "s"),
        ("D0-1 judge：满足校准 Metric Card", "s"),
        ("κ 不达标 ≠ 这一项失败", "badge"),
        ("κ 不达标 = 本轮所有分数无效", "badge"),
        ("「发生一次即不可接受」的事件不能统计化", "tiny"),
    ])
    stage2, h2 = _panel(380, 380, 370, "第二段 · 统计门禁（看区间）", amber, DS["amberFill"], [
        ("pass^k 的 95% CI 下界 ≥ 阈值", "s"),
        ("与上一版本：CI 不重叠才判定回归", "s"),
        ("聚类单位 = 任务，不是 n×k", "s"),
        ("样本量不足 → EVIDENCE-INSUFFICIENT", "badge"),
        ("它不是「通过」，是一个独立结论", "badge"),
        ("区间法容易解释；更严谨可用配对 / 聚类显著性检验", "tiny"),
    ])
    stage3, h3 = _panel(380, 580, 370, "第三段 · 风险接受（署名决策）", blue, DS["blueFill"], [
        ("列出所有已知失败模式及其频率", "s"),
        ("标注每个失败模式的护栏覆盖情况", "s"),
        ("由具名业务 / 发布 owner 签字", "s"),
        ("无护栏覆盖的失败模式不能被「接受」", "badge"),
        ("那不是接受风险，是不知道有风险", "badge"),
        ("Agent 系统不存在「没有失败模式」的版本", "tiny"),
    ])
    output_svg, _ = _panel(790, 580, 330, "输出：一份署名决定", forest, DS["mint"], [
        ("发布 / 有条件发布 / 不发布", "m"),
        ("剩余风险清单 + 接受人 + 复评日期", "m"),
        ("回滚触发条件与四维成组回滚对象", "m"),
        ("流水线只输出「请决定」", "good"),
    ])
    block_svg, _ = _panel(790, 150, 330, "阻断（不进入第二段）", red, DS["redFill"], [
        ("没必要算区间——红线已破", "m"),
        ("回到修复，重新提交证据包", "m"),
        ("Waiver 不能豁免硬红线", "badge"),
    ])
    fail_svg, _ = _panel(790, 300, 330, "FAIL 或证据不足", amber, DS["amberFill"], [
        ("FAIL → 阻断，回到修复", "m"),
        ("EVIDENCE-INSUFFICIENT → 可进第三段", "m"),
        ("但必须作为已知失败模式列出", "m"),
        ("不得写成「通过」", "badge"),
    ])

    body = f'''<g data-source-ref="AI agent测试架构.txt:L525-L574">
{input_svg}
{stage1}
{stage2}
{stage3}
{output_svg}
{block_svg}
{fail_svg}
{_edge(340, 210, 374, 210)}
{_edge(565, 150 + h1, 565, 374)}
{_edge(565, 380 + h2, 565, 574)}
{_edge(750, 640, 784, 640)}
{_edge(750, 210, 784, 210, tone="red", dashed=True)}
{_edge(750, 370, 784, 370, tone="red", dashed=True)}
<text x="573" y="{150 + h1 + 24}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["forest"]}">红线全部满足</text>
<text x="573" y="{380 + h2 + 24}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["forest"]}">PASS 或证据不足</text>
<text x="766" y="202" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["red"]}">任一破线</text>
<path d="M955 734 L955 830 L190 830 L190 339" fill="none" stroke="{DS["red"]}" stroke-width="2" stroke-dasharray="7 5" stroke-linejoin="round" marker-end="url(#ds-arw-red)"/>
<text x="572" y="818" text-anchor="middle" font-family="{SANS}" font-size="11.5" font-weight="700" fill="{DS["red"]}">证据回灌与修复：阻断 / 回滚 → 重新提交证据包</text>
</g>'''
    boundary = "阈值由 Metric Card 的 parameter + population + uncertainty + owner 配置；本图为教学结构图，不代表真实门禁已验证，结论 NOT_RUN。"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title id="title">三段式门禁决策流</title>
<desc id="desc">第一段硬红线为布尔判定，任一不满足即阻断；第二段统计门禁看置信区间并允许「证据不足」这一独立结论；第三段风险接受由具名 owner 签字，流水线只输出「请决定」，不输出「可以发布」。阈值全部参数化，真实门禁 NOT_RUN。</desc>
{ds_defs()}
<style>{ds_css()}</style>
<rect class="ds-bg" width="{W}" height="{H}" rx="22"/>
{ds_header(W, 118, "AGENT · 三段式门禁", "三段式门禁决策流：红线 → 区间 → 署名接受", "硬红线、统计证据与具名风险接受是三个不能互相抵消的阶段。", "source · AI agent测试架构.txt:L525-L574")}
{body}
{ds_footer(W, H, boundary)}
</svg>'''


def _dim_card(x, y, w, title, accent, fill, dims, foot=None, badge=None):
    n = len(dims)
    h = 46 + n * 19 + (20 if foot or badge else 0) + 12
    parts = [
        f'<g filter="url(#ds-soft)"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="{accent}" stroke-width="1.5"/></g>',
        f'<rect x="{x}" y="{y}" width="6" height="{h}" rx="3" fill="{accent}"/>',
        f'<text x="{x + 22}" y="{y + 26}" font-family="{SANS}" font-size="13" font-weight="800" fill="{DS["ink"]}">{xml(title)}</text>',
    ]
    yy = y + 48
    for dim in dims:
        parts.append(f'<text x="{x + 22}" y="{yy}" font-family="{SANS}" font-size="11.5" font-weight="600" fill="{DS["ink"]}">{xml(dim)}</text>')
        yy += 19
    if badge:
        parts.append(f'<text x="{x + 22}" y="{yy}" font-family="{MONO}" font-size="9.5" font-weight="700" fill="{DS["red"]}">{xml(badge)}</text>')
    elif foot:
        parts.append(f'<text x="{x + 22}" y="{yy}" font-family="{SANS}" font-size="10" font-weight="500" fill="{DS["soft"]}">{xml(foot)}</text>')
    return "".join(parts), h


def dimensions_svg() -> str:
    W, H = 1240, 990
    forest, mint = DS["forest"], DS["mint"]
    red, amber = DS["red"], DS["amber"]
    purple = DS["purple"]
    blue = DS["blue"]

    input_svg, input_h = _dim_card(54, 140, 250, "输入与风险", DS["soft"], DS["cream"],
                                   ["需求与风险登记册", "生产流量回放集", "红队攻击语料"])
    d0, d0_h = _dim_card(54, 289, 250, "D0 评估可信（4 维）", purple, DS["purpleFill"],
                         ["D0-1 Judge 校准与元评估", "D0-2 评估集卫生", "D0-3 指标构念效度", "D0-4 人审闭环与标注一致性"],
                         badge="κ 达不到 → 本轮所有分数无效")
    rings, rings_h = _dim_card(54, 457, 250, "四证据环", forest, mint,
                               ["环 1 离线 CI · 每提交 · 硬门禁", "环 2 沙箱回放 · 每日 · 硬门禁", "环 3 影子灰度 · 真流量不生效", "环 4 在线持续 · 7×24 采样"],
                               badge="环 3 / 环 4 本项目 NOT_RUN")
    guard, guard_h = _dim_card(54, 625, 250, "运行时护栏", red, DS["redFill"],
                               ["策略引擎与工具白名单", "人工确认检查点", "熔断与 Kill Switch", "短时效凭证与最小权限"],
                               foot="护栏是 D5 的输出，不是独立功能")

    d1, d1_h = _dim_card(360, 140, 270, "D1 单体能力（5 维）", forest, mint,
                         ["D1-1 意图理解", "D1-2 工具选择与参数", "D1-3 轨迹质量（span 级）", "D1-4 记忆读写与检索", "D1-5 规划与自我修正"],
                         foot="参数错误比工具错误更危险")
    d2, d2_h = _dim_card(360, 327, 270, "D2 编排协作（4 维）", blue, DS["blueFill"],
                         ["D2-1 交接与职责边界", "D2-2 子 Agent 上下文隔离", "D2-3 级联失败与熔断", "D2-4 上下文工程"],
                         foot="每一次 handoff 都是新断点")
    d3, d3_h = _dim_card(360, 495, 270, "D3 人机协同（4 维）", blue, DS["blueFill"],
                         ["D3-1 多轮交互与上下文保持", "D3-2 多模态理解", "D3-3 中断 · 接管 · 授权确认", "D3-4 可解释性与体验"],
                         foot="弹窗多不等于人有控制权")
    d4, d4_h = _dim_card(360, 663, 270, "D4 鲁棒可靠（5 维）", amber, DS["amberFill"],
                         ["D4-1 可靠性分布 pass^k · CI", "D4-2 长时程降级 horizon", "D4-3 输入与 Prompt 稳定性", "D4-4 异常处理与自恢复", "D4-5 统计回归 分布对比"],
                         badge="样本不足 → 证据不足，不是通过")

    d5, d5_h = _dim_card(670, 140, 270, "D5 安全对抗（6 维）", red, DS["redFill"],
                         ["D5-1 直接与间接提示注入", "D5-2 工具投毒与 MCP 供应链", "D5-3 身份与委托链越权", "D5-4 记忆投毒与持久污染", "D5-5 代码执行与沙箱逃逸", "D5-6 不可逆动作与爆炸半径"],
                         badge="授权在工具边界，不在提示词里")
    d6, d6_h = _dim_card(670, 346, 270, "D6 效率经济（4 维）", blue, DS["blueFill"],
                         ["D6-1 延迟与吞吐", "D6-2 Token 与成本经济学", "D6-3 并发与资源隔离", "D6-4 可观测性与可复现"],
                         foot="成本是长尾，报 P99 不报均值")
    d7, d7_h = _dim_card(670, 514, 270, "D7 业务治理（4 维）", amber, DS["amberFill"],
                         ["D7-1 业务规则与决策正确性", "D7-2 合规与审计证据链", "D7-3 变更治理 四维版本", "D7-4 业务价值与 ROI"],
                         foot="模型名没变，系统可能已经变了")

    decision_svg, decision_h = _panel(980, 580, 210, "决策与反馈", amber, DS["amberFill"], [
        ("可靠性记分卡（带置信区间）", "s"),
        ("风险接受决策（具名 owner）", "s"),
        ("失败归因与改进项", "s"),
        ("高危 blocker 一票阻断", "badge"),
        ("回滚：模型 / prompt / 工具 / 记忆成组", "tiny"),
    ])

    body = f'''<g data-source-ref="AI agent测试架构.txt:L238-L494">
{input_svg}
{d0}
{rings}
{guard}
{d1}
{d2}
{d3}
{d4}
{d5}
{d6}
{d7}
{decision_svg}
{_edge(179, 140 + input_h, 179, 283)}
{_edge(495, 140 + d1_h, 495, 321)}
{_edge(495, 327 + d2_h, 495, 489)}
{_edge(495, 495 + d3_h, 495, 657)}
{_edge(805, 140 + d5_h, 805, 340)}
{_edge(805, 346 + d6_h, 805, 508)}
<path d="M304 360 C330 300 330 210 354 200" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M304 420 C480 360 500 210 664 200" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M304 540 C330 620 330 700 354 720" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M940 600 L974 600" fill="none" stroke="{forest}" stroke-width="1.8" marker-end="url(#ds-arw-forest)"/>
<path d="M630 780 L980 780 L980 760" fill="none" stroke="{forest}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#ds-arw-forest)"/>
<path d="M1085 754 L1085 860 L179 860 L179 287" fill="none" stroke="{red}" stroke-width="2" stroke-dasharray="7 5" stroke-linejoin="round" marker-end="url(#ds-arw-red)"/>
<text x="632" y="850" text-anchor="middle" font-family="{SANS}" font-size="11.5" font-weight="700" fill="{red}">决策 / 阻断 / 失败 → 回灌输入与 D0 重校准</text>
<text x="620" y="888" text-anchor="middle" font-family="{SANS}" font-size="10.5" font-weight="600" fill="{DS["muted"]}">实线 = 证据主链 / 依赖顺序　虚线 = D0 校准与四环驱动　红线 = 停止 / 护栏 / 回灌</text>
</g>'''
    boundary = "36 维是覆盖清单，不替代场景风险分析；每维仍须映射到独立 Oracle、case、fault、evidence 与 owner。课程仅提供 fixture 与静态设计证据，live 与生产均 NOT_RUN。"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title id="title">Agent 测试架构 8 域 36 维全景图</title>
<desc id="desc">D0 评估可信层校准所有其他域；D1 到 D7 按依赖顺序排列，共 36 个维度；四证据环驱动能力、可靠、安全与效率域，运行时护栏由 D5 输出作为兜底，决策输出含风险接受与回灌。图为教学结构图，不代表真实系统拓扑。</desc>
{ds_defs()}
<style>{ds_css()}</style>
<rect class="ds-bg" width="{W}" height="{H}" rx="22"/>
{ds_header(W, 118, "AGENT · 36 维全景", "Agent 测试架构 8 域 36 维全景图", "D0 决定所有分数的准确性上限；36 维是覆盖清单，不替代场景风险分析。", "source · AI agent测试架构.txt:L238-L494")}
{body}
{ds_footer(W, H, boundary)}
</svg>'''


def reliability_svg() -> str:
    W, H = 1240, 880
    forest, mint = DS["forest"], DS["mint"]
    red = DS["red"]
    amber = DS["amber"]
    blue = DS["blue"]

    input_svg, input_h = _panel(40, 150, 300, "任务集与重复运行", DS["soft"], DS["cream"], [
        ("15 个任务 × 每任务重复 5 次", "s"),
        ("固定 temperature 与版本并记录", "m"),
        ("保留全部 raw run（失败不得删除）", "m"),
        ("重置规则：每次 run 前回到同一快照", "tiny"),
    ])
    a_svg, a_h = _panel(370, 150, 320, "口径 A · pass@k（至少一次成功）", forest, mint, [
        ("14 / 15 = 93.3%", "h"),
        ("回答：它「能不能」做对", "m"),
        ("用途：判断能力上限，不能作为承诺", "good"),
    ])
    b_svg, b_h = _panel(370, 300, 320, "口径 B · pass^k（每次都成功）", red, DS["redFill"], [
        ("7 / 15 = 46.7%", "h"),
        ("回答：它「能不能每次都」做对", "m"),
        ("这才是你对用户的承诺", "badge"),
        ("同一份数据，两个口径差 46.6 个百分点", "tiny"),
    ])
    ci_svg, ci_h = _panel(370, 470, 320, "区间：以任务为聚类单位", blue, DS["blueFill"], [
        ("Wilson 95% CI = [0.246, 0.699]", "s"),
        ("n = 15（任务数），不是 75", "m"),
        ("把 n×k=75 当独立样本会严重低估不确定性", "badge"),
        ("同一任务的 5 次运行高度相关", "tiny"),
    ])
    three_svg, three_h = _panel(720, 400, 480, "三种统计结论，不是两种", red, DS["redFill"], [
        ("PASS：CI 下界 ≥ 阈值", "m"),
        ("FAIL：CI 上界 < 阈值，或与旧版 CI 不重叠且更差", "m"),
        ("EVIDENCE-INSUFFICIENT：样本不足 → 不是「通过」", "badge"),
        ("非重叠 CI 才算真回归；点估计的涨跌大多是噪声", "tiny"),
    ])

    chart = f'''
<g filter="url(#ds-soft)"><rect x="720" y="150" width="480" height="230" rx="14" fill="{DS["amberFill"]}" stroke="#e0b76a" stroke-width="1.5"/></g>
<rect x="720" y="150" width="6" height="230" rx="3" fill="{amber}"/>
<text x="744" y="180" font-family="{SANS}" font-size="14" font-weight="800" fill="{DS["ink"]}">horizon 衰减：按任务时长分桶</text>
<line x1="744" y1="330" x2="1170" y2="330" stroke="{DS["soft"]}" stroke-width="1.2"/>
<rect x="760" y="225" width="55" height="105" rx="6" fill="{forest}"/>
<rect x="850" y="225" width="55" height="105" rx="6" fill="{forest}"/>
<rect x="940" y="284" width="55" height="46" rx="6" fill="{amber}"/>
<rect x="1030" y="295" width="55" height="35" rx="6" fill="{red}"/>
<text x="787" y="217" text-anchor="middle" font-family="{MONO}" font-size="12" font-weight="800" fill="{forest}">75%</text>
<text x="877" y="217" text-anchor="middle" font-family="{MONO}" font-size="12" font-weight="800" fill="{forest}">75%</text>
<text x="967" y="276" text-anchor="middle" font-family="{MONO}" font-size="12" font-weight="800" fill="{amber}">33%</text>
<text x="1057" y="287" text-anchor="middle" font-family="{MONO}" font-size="12" font-weight="800" fill="{red}">25%</text>
<text x="787" y="348" text-anchor="middle" font-family="{SANS}" font-size="10.5" font-weight="600" fill="{DS["muted"]}">&lt;5min</text>
<text x="877" y="348" text-anchor="middle" font-family="{SANS}" font-size="10.5" font-weight="600" fill="{DS["muted"]}">5–30min</text>
<text x="967" y="348" text-anchor="middle" font-family="{SANS}" font-size="10.5" font-weight="600" fill="{DS["muted"]}">30min–2h</text>
<text x="1057" y="348" text-anchor="middle" font-family="{SANS}" font-size="10.5" font-weight="600" fill="{DS["muted"]}">&gt;2h</text>
<text x="744" y="372" font-family="{SANS}" font-size="11" font-weight="600" fill="{DS["muted"]}">结论直接变成两条产品规则：自主时长上限 + 强制检查点间隔</text>'''

    metric = f'''
<g filter="url(#ds-strong)"><rect x="40" y="660" width="1160" height="90" rx="16" fill="{DS["amberFill"]}" stroke="#e0b76a" stroke-width="1.5"/></g>
<rect x="40" y="660" width="6" height="90" rx="3" fill="{amber}"/>
<text x="64" y="688" font-family="{SANS}" font-size="13" font-weight="800" fill="{DS["ink"]}">Metric Card 必填字段</text>
<text x="64" y="712" font-family="{SANS}" font-size="11.5" font-weight="600" fill="{DS["ink"]}">口径（经验 / 解析）· 分子分母 · k · 状态重置规则 · 区间方法与聚类单位 · 样本量理由 · 时长桶 · 切片 · 四维版本 · owner · 失败动作</text>
<text x="64" y="734" font-family="{MONO}" font-size="10.5" font-weight="700" fill="{amber}">缺任一项，这个 pass^k 数字不可复用，也不能进发布决定书</text>'''

    body = f'''<g data-source-ref="AI agent测试架构.txt:L438-L494">
{input_svg}
{a_svg}
{b_svg}
{ci_svg}
{three_svg}
{chart}
{metric}
{_edge(340, 210, 364, 210)}
<path d="M340 280 L364 340" fill="none" stroke="{forest}" stroke-width="1.8" marker-end="url(#ds-arw-forest)"/>
{_edge(530, 150 + a_h, 530, 294)}
{_edge(530, 300 + b_h, 530, 464)}
{_edge(690, 360, 714, 360)}
{_edge(960, 380, 960, 394)}
{_edge(690, 520, 714, 520)}
{_edge(960, 400 + three_h, 960, 654, tone="red", dashed=True)}
<text x="538" y="{150 + a_h + 26}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["forest"]}">同一份数据</text>
<text x="538" y="{300 + b_h + 26}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{DS["forest"]}">两个口径</text>
</g>'''
    boundary = "数值来自本仓库夹具 fixtures/run-ledger.json，用于演示口径差异；不是任何真实系统的性能指标。阈值均为结构占位，成熟度 fixture-tested，真实模型与生产效果 NOT_RUN。"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title id="title">pass@k 与 pass^k 的差距及区间口径</title>
<desc id="desc">同一份 15 任务 × 5 次重复的运行台账，按「至少一次成功」与「每次都成功」两种口径得到完全不同的结论；右侧展示按任务时长分桶的 horizon 衰减，底部展示聚类区间与逐 run 展开的差别。</desc>
{ds_defs()}
<style>{ds_css()}</style>
<rect class="ds-bg" width="{W}" height="{H}" rx="22"/>
{ds_header(W, 118, "AGENT · 可靠性口径", "pass@k 与 pass^k 的差距及区间口径", "同一份数据，两个口径可以差得极远；口径决定承诺。", "source · AI agent测试架构.txt:L438-L494")}
{body}
{ds_footer(W, H, boundary)}
</svg>'''


def build_source_visuals() -> None:
    visual_root = SOURCE / "visuals"
    visual_root.mkdir(parents=True, exist_ok=True)
    generated = {
        "AG-DIM-ARCHITECTURE.svg": architecture_svg(),
        "AG-DIM-FOUR-RINGS.svg": four_ring_svg(),
        "AG-DIM-GATE.svg": gate_svg(),
        "AG-DIM-36.svg": dimensions_svg(),
        "AG-DIM-RELIABILITY.svg": reliability_svg(),
    }
    for name, content in generated.items():
        (visual_root / name).write_text(content + "\n", encoding="utf-8")

    records = [
        {
            "visual_id": "agent-test-architecture", "kind": "architecture", "file": "AG-DIM-ARCHITECTURE.svg",
            "purpose": "在选择测试方法前画出 Agent 系统、信任与副作用边界，并连接 D0-D7、护栏、决定和失败反馈。",
            "alt_text": "AI Agent 测试总架构图，从输入与风险进入 D0 评估可信，再到 D1-D7 行为、协作、可靠性、安全、效率与治理，最后连接四证据环、运行时护栏和决定反馈。",
            "caption": "测试架构不是维度清单；它把边界、风险、Observable、独立 Oracle、故障、证据、停止动作和 owner 连成系统。",
            "not_proof": "本图不证明真实 Agent、企业集成、从业者有效性或生产安全，以上保持 NOT_RUN。",
            "source_refs": ["AI agent测试架构.txt:L73-L238"],
            "nodes": ["输入与风险", "D0 评估可信", "D1-D3", "D4-D7", "四证据环", "运行时护栏", "决定与反馈"],
            "relationships": ["输入→D0", "D0→D1-D7", "域→证据环", "护栏→停止", "决定→失败回灌"],
        },
        {
            "visual_id": "agent-four-evidence-rings", "kind": "four_ring", "file": "AG-DIM-FOUR-RINGS.svg",
            "purpose": "区分离线 fixture、受控沙箱、影子灰度和在线持续评估能证明什么，并为每环声明 entry、exit 与 rollback。",
            "alt_text": "四列证据环图分别展示离线 fixture、受控沙箱、影子或灰度、在线持续评估的输入、进入条件、退出条件、硬阻断、owner 和回滚。",
            "caption": "每次成熟度升级都需要新的真实输入和 owner；当前课程只运行环一，环二至环四保持 NOT_RUN。",
            "not_proof": "本图不证明沙箱、影子、灰度或在线评估已经执行，它们均为 NOT_RUN。",
            "source_refs": ["AI agent测试架构.txt:L496-L524"],
            "nodes": ["离线 fixture", "受控沙箱", "影子 / 灰度", "在线持续", "参数化门禁"],
            "relationships": ["fixture→sandbox", "sandbox→shadow", "shadow→online", "exit failure→rollback", "failure→fixture feedback"],
        },
        {
            "visual_id": "agent-three-stage-gate", "kind": "gate", "file": "AG-DIM-GATE.svg",
            "purpose": "把硬政策、统计证据和具名风险接受分成三个不能互相抵消的决策阶段。",
            "alt_text": "三段式门禁图先检查由 Metric Card 与 policy 配置的硬红线，再检查区间与样本充分性，最后由具名 owner 决定风险接受、发布或回滚。",
            "caption": "流水线提供证据和阻断，不自动签署发布决定；固定阈值必须由场景 Metric Card 参数化。",
            "not_proof": "本图不证明任何真实系统已达到门禁，真实 policy、阈值和 owner 保持 Unknown / NOT_RUN。",
            "source_refs": ["AI agent测试架构.txt:L525-L574"],
            "nodes": ["候选证据包", "硬政策门禁", "统计门禁", "风险接受", "阻断与回滚"],
            "relationships": ["证据→硬门禁", "硬门禁→统计门禁", "统计门禁→风险接受", "任一失败→阻断", "决定→回灌"],
        },
        {
            "visual_id": "agent-36-dimensions", "kind": "dimensions", "file": "AG-DIM-36.svg",
            "purpose": "逐项保留 D0-D7 共 36 个维度并展示 D0 校准、域间依赖、四环、护栏和决策输出。",
            "alt_text": "D0-D7 的 36 维全景图，D0 评估可信校准其他域，D1-D7 展示能力、协作、可靠性、安全、效率和治理维度，并连接证据环和护栏。",
            "caption": "36 维是覆盖清单，不替代场景风险分析；每一维仍须映射到独立 Oracle、case、fault、evidence 与 owner。",
            "not_proof": "本图不证明 36 维均已在真实项目运行；课程仅提供 fixture 与静态设计证据，live 保持 NOT_RUN。",
            "source_refs": ["AI agent测试架构.txt:L238-L494"],
            "nodes": ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "四证据环"],
            "relationships": ["D0→D1-D7", "D1→D2", "D4→D7", "D5→护栏", "四环→域执行"],
        },
        {
            "visual_id": "agent-reliability", "kind": "reliability", "file": "AG-DIM-RELIABILITY.svg",
            "purpose": "用同一份运行台账对比 pass@k 与 pass^k 两种口径，说明聚类区间与 horizon 衰减如何改变发布承诺。",
            "alt_text": "可靠性口径对比图，左侧任务集与重复运行，中间 pass@k 与 pass^k 两个口径及 Wilson 聚类区间，右侧 horizon 时长桶衰减柱状图与三种统计结论，底部是 Metric Card 必填字段。",
            "caption": "同一份数据可以同时回答「能不能做对」和「能不能每次都做对」；口径、聚类单位与时长桶决定数字能否进发布决定书。",
            "not_proof": "本图数值来自仓库夹具，只演示口径差异，不代表任何真实系统性能；真实模型与生产效果 NOT_RUN。",
            "source_refs": ["AI agent测试架构.txt:L438-L494"],
            "nodes": ["任务集", "pass@k", "pass^k", "聚类区间", "horizon 衰减", "三种统计结论"],
            "relationships": ["任务集→pass@k", "任务集→pass^k", "pass^k→聚类区间", "口径→horizon", "结论→Metric Card"],
        },
    ]
    editable = {
        "schema_version": "1.0.0",
        "status": "SOURCE-ADAPTED",
        "policy": {
            "fixed_thresholds": "parameterized through a Metric Card",
            "parameter_owner": "scenario metric owner",
            "unexecuted_rings": "NOT_RUN",
            "failure_action": "block maturity promotion and preserve the exact failed ring",
        },
        "visuals": records,
    }
    write_json(visual_root / "agent-visual-source.json", editable)
    manifest = {
        "schema_version": "1.0.0",
        "package_id": "td-ai-agent-architecture-source-visuals",
        "source": {"path": "/Users/owen/Downloads/AI agent测试架构.txt", "sha256": SOURCE_SHA256, "locators": ["AI agent测试架构.txt:L73-L238", "AI agent测试架构.txt:L238-L494", "AI agent测试架构.txt:L496-L574"]},
        "visuals": [],
        "evidence_boundary": "Static design and fixture evidence only; live model, integration, practitioner and production validation are NOT_RUN.",
    }
    for record in records:
        path = visual_root / record["file"]
        projected = {key: value for key, value in record.items() if key != "file"}
        manifest["visuals"].append({**projected, "rendered_path": f"visuals/{path.name}", "editable_path": "visuals/agent-visual-source.json", "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    write_json(SOURCE / "source-visual-manifest.json", manifest)


def main() -> None:
    if not SOURCE.is_dir():
        raise SystemExit(f"canonical learner materials missing: {SOURCE}")
    build_source_visuals()
    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    shutil.copytree(SOURCE, PUBLIC)
    ARCHIVE.unlink(missing_ok=True)
    with zipfile.ZipFile(ARCHIVE, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(PUBLIC.rglob("*")):
            if path.is_file():
                archive.write(path, Path(PUBLIC.name) / path.relative_to(PUBLIC))
    print(f"agent architecture materials synchronized: {sum(p.is_file() for p in PUBLIC.rglob('*'))} files")


if __name__ == "__main__":
    main()
