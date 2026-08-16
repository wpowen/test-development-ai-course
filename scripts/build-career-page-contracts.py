#!/usr/bin/env python3
"""Enrich the career learner package with page-level executable contracts.

The content module and executability audit consume the public projection, while
the course package remains the source. This generator writes identical
manifest/prompt contracts to both trees and rebuilds the learner ZIP.
"""

from __future__ import annotations

import json
import hashlib
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
    wrap,
    xml,
)


ROOT = Path(__file__).resolve().parents[1]
COURSE = ROOT / "courses/td-ai-career-evolution"
SOURCE = ROOT / "courses/td-ai-career-evolution/learner-materials"
PUBLIC = ROOT / "site/public/materials/career-evolution"
ARCHIVE = ROOT / "site/public/materials/career-evolution.zip"
PAGE_IDS = ("TD-C02", "TD-C03", "TD-C04", "TD-F05", "TD-T26", "TD-R01")
WORKDIR = "materials/career-evolution"
CAREER_SOURCE_SHA256 = "d6df309516b91cb5c7e68ce2f69eb817c2bed7798f80ab9005627097dbc8416c"


CAREER_VISUALS = [
    {
        "visual_id": "career-role-comparison",
        "kind": "comparison",
        "file": "career-role-comparison.svg",
        "title": "传统软件测试、AI 测试与 AI 开发的责任边界",
        "purpose": "帮助学习者判断一个任务的主责任、共同责任与不可由 AI 自动接管的发布责任。",
        "source_refs": ["AI测试工程师发展.md:L18-L70"],
        "nodes": ["传统软件测试", "AI 测试开发", "AI 开发", "共同工程底座", "发布责任人"],
        "relationships": ["传统测试→确定性软件风险", "AI 测试→数据/模型/Agent 风险", "AI 开发→能力实现", "三者→共同工程底座", "证据→发布责任人"],
        "alt": "三列职责对比图：传统软件测试聚焦确定性行为与系统风险，AI 测试开发增加数据、模型、评测与 Agent 风险，AI 开发负责能力实现；三者共享工程底座，最终发布决定仍由具名责任人作出。",
        "caption": "先按风险和证据划分责任，再选工具；岗位名称可以变化，业务规则和风险接受的决定权不能消失。",
    },
    {
        "visual_id": "career-capability-mindmap",
        "kind": "mindmap",
        "file": "career-capability-mindmap.svg",
        "title": "AI 测试开发五维能力证据地图",
        "purpose": "把来源中的五维能力从知识清单改写成可观察工件、故障证据和下游消费者。",
        "source_refs": ["AI测试工程师发展.md:L78-L218"],
        "nodes": ["AI/ML 测试", "测试专业", "AI 特有测试", "技术工程", "协作与业务", "证据中心"],
        "relationships": ["五维→证据中心", "证据中心→项目决定", "故障注入→能力证明", "Reviewer→边界确认"],
        "alt": "以证据中心为核心的五分支思维导图，分别连接 AI/ML 测试、测试专业、AI 特有测试、技术工程、协作与业务，并要求每一支都有工件、故障和 reviewer。",
        "caption": "能力不是自我评分的形容词；每个分支都要落到可复核工件、故障检测和真实消费者。",
    },
    {
        "visual_id": "career-capability-allocation",
        "kind": "pie",
        "file": "career-capability-allocation.svg",
        "title": "五维能力占比：来源示例与组织参数",
        "purpose": "保留来源 30/25/25/15/5 的比较功能，同时明确它只是来源示例，不能直接成为组织晋升权重。",
        "source_refs": ["AI测试工程师发展.md:L210-L218"],
        "nodes": ["AI/ML 30", "测试专业 25", "AI 特有 25", "技术工程 15", "协作业务 5", "组织参数"],
        "relationships": ["来源示例→五维分配", "组织参数→重新加权", "owner→审批", "证据→校准"],
        "alt": "环形占比图展示来源示例的五项能力权重 30、25、25、15、5；右侧强调组织参数、适用岗位、证据与 owner 未确认前状态为 INTERNAL-UNKNOWN。",
        "caption": "30/25/25/15/5 仅用于解释来源结构；真实岗位权重必须在 organization_level_adapter 中由 owner 参数化。",
    },
    {
        "visual_id": "career-evidence-lifecycle",
        "kind": "lifecycle",
        "file": "career-evidence-lifecycle.svg",
        "title": "能力主张到复评的证据生命周期",
        "purpose": "让学习者把自评变成主张、证据、故障、评审、应用与反馈闭环，而不是一次性打分。",
        "source_refs": ["AI测试工程师发展.md:L1335-L1490"],
        "nodes": ["能力主张", "证据引用", "故障/变异", "独立评审", "工作应用", "反馈复评"],
        "relationships": ["主张→证据", "证据→故障验证", "验证→评审", "评审→应用", "应用→反馈", "反馈→新主张"],
        "alt": "六步环形生命周期，从能力主张开始，经证据引用、故障或变异、独立评审、工作应用、反馈复评，最后回到下一轮能力主张。",
        "caption": "没有 evidence_ref 或故障证据时只能记为 Unknown；复评不是晋升承诺，而是更新下一轮学习决策。",
    },
    {
        "visual_id": "career-responsibility-ladder",
        "kind": "ladder",
        "file": "career-responsibility-ladder.svg",
        "title": "四态责任阶梯：用证据范围替代固定年限",
        "purpose": "把 P5-P9 的有用成长方向适配为可迁移的四类责任状态，并保留组织职级映射入口。",
        "source_refs": ["AI测试工程师发展.md:L552-L857"],
        "nodes": ["指导下完成", "独立范围负责", "系统与跨团队杠杆", "战略治理与培养", "组织职级适配"],
        "relationships": ["任务证据→独立负责", "范围证据→系统杠杆", "组织影响→治理培养", "四态→组织映射"],
        "alt": "四级台阶从指导下完成、独立范围负责、系统与跨团队杠杆到战略治理与培养；旁边的组织职级适配器将公司级别标记为 INTERNAL-UNKNOWN。",
        "caption": "来源中的 P5-P9 年限不作通用门槛；只有责任范围、决定权、失败代价和可复核证据可以跨组织迁移。",
    },
    {
        "visual_id": "career-evidence-radar",
        "kind": "radar",
        "file": "career-evidence-radar.svg",
        "title": "五维能力证据雷达：示例数据与缺口",
        "purpose": "示范如何用证据成熟度比较当前状态与目标任务，而不把来源 L1-L5 或职级标签当事实。",
        "source_refs": ["AI测试工程师发展.md:L584-L630"],
        "nodes": ["AI/ML", "测试方法", "AI Eval", "工程交付", "业务协作", "当前证据", "任务目标"],
        "relationships": ["当前证据↔任务目标", "差距→学习项目", "项目→复评", "owner→目标定义"],
        "alt": "五轴雷达图比较一份示例的当前证据成熟度与目标任务要求，轴为 AI/ML、测试方法、AI Eval、工程交付和业务协作；数据明确标为示例。",
        "caption": "雷达值是演示数据，不是能力诊断结果；迁移时必须用 evidence_ref 重算，并由任务 owner 定义目标。",
    },
    {
        "visual_id": "career-evidence-gantt",
        "kind": "gantt",
        "file": "career-evidence-gantt.svg",
        "title": "可参数化的 30/60/90 证据计划",
        "purpose": "把来源的固定成长时间线改写为可编辑的三个证据窗口，用交付和复评而非晋升日期收口。",
        "source_refs": ["AI测试工程师发展.md:L858-L1250"],
        "nodes": ["窗口 A 定基线", "窗口 B 做故障", "窗口 C 交付复评", "owner 调整窗口", "证据出口"],
        "relationships": ["基线→故障", "故障→交付", "交付→复评", "owner→窗口参数", "证据→下一计划"],
        "alt": "三段甘特式计划以窗口 A、B、C 表示基线、故障实验和交付复评，默认可示例为 30/60/90 天，但实际时长由 owner 参数化。",
        "caption": "30/60/90 是规划示例，不是晋升期限；每一段必须以可审计工件和 reviewer 决定是否进入下一段。",
    },
    {
        "visual_id": "career-background-paths",
        "kind": "path",
        "file": "career-background-paths.svg",
        "title": "三种起点到同一责任证据的学习路径",
        "purpose": "保留测试背景、开发背景和零基础的差异化路径，但删除固定几个月即可达标的无依据承诺。",
        "source_refs": ["AI测试工程师发展.md:L1256-L1288"],
        "nodes": ["测试背景", "开发背景", "零基础", "各自缺口", "共同项目", "责任证据"],
        "relationships": ["起点→缺口诊断", "缺口→先修组合", "先修→共同项目", "共同项目→责任证据"],
        "alt": "三条并行学习路线从测试背景、开发背景和零基础出发，先做缺口诊断和不同先修，再汇合到同一个可运行项目与责任证据。",
        "caption": "起点只改变先修顺序，不改变完成条件；学习时长为 Unknown，不能从来源示例外推到个人。",
    },
    {
        "visual_id": "career-priority-quadrant",
        "kind": "quadrant",
        "file": "career-priority-quadrant.svg",
        "title": "能力投资优先级四象限",
        "purpose": "用任务重要性和当前证据成熟度排序学习投资，并明确每个象限对应的行动而非贴标签。",
        "source_refs": ["AI测试工程师发展.md:L1355-L1393"],
        "nodes": ["优先补齐", "保持优势", "暂缓", "分享与复用", "任务重要性", "证据成熟度"],
        "relationships": ["高重要低证据→优先补齐", "高重要高证据→保持优势", "低重要低证据→暂缓", "低重要高证据→分享复用"],
        "alt": "二维四象限以任务重要性为纵轴、证据成熟度为横轴，四格分别是优先补齐、保持优势、暂缓、分享与复用。",
        "caption": "重要性由当前任务 owner 定义，成熟度由证据而非自信定义；象限只决定下一步，不证明职级。",
    },
]


SVG_STYLE = """
<style>
.bg{fill:#f7f8fb}.panel{fill:#fff;stroke:#cbd5e1;stroke-width:1.5}.primary{fill:#e0f2f1;stroke:#0f766e;stroke-width:2}.secondary{fill:#eef2ff;stroke:#4f46e5;stroke-width:1.7}.warn{fill:#fff7ed;stroke:#c2410c;stroke-width:1.7}.unknown{fill:#fef2f2;stroke:#b91c1c;stroke-width:1.7}.title{font:700 28px system-ui,"PingFang SC",sans-serif;fill:#0f172a}.sub{font:14px system-ui,"PingFang SC",sans-serif;fill:#475569}.h{font:700 15px system-ui,"PingFang SC",sans-serif;fill:#0f172a}.m{font:12px system-ui,"PingFang SC",sans-serif;fill:#334155}.tiny{font:11px system-ui,"PingFang SC",sans-serif;fill:#64748b}.badge{font:700 11px ui-monospace,monospace;fill:#b91c1c}.edge{fill:none;stroke:#0f766e;stroke-width:2;marker-end:url(#arrow)}.dash{fill:none;stroke:#64748b;stroke-width:1.5;stroke-dasharray:5 4;marker-end:url(#arrow2)}
</style>"""


def _svg_shell(visual: dict, body: str) -> str:
    boundary = "SOURCE-EXAMPLE · 组织职级/年限/权重均为 INTERNAL-UNKNOWN · 本图不证明晋升、就业或真实学习效果"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 1200 760" width="1200" height="760">
<title id="title">{visual["title"]}</title>
<desc id="desc">{visual["alt"]} {boundary}</desc>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#0f766e"/></marker><marker id="arrow2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#64748b"/></marker></defs>
{SVG_STYLE}
<rect class="bg" width="1200" height="760"/>
<g data-source-ref="{visual["source_refs"][0]}"><text class="title" x="40" y="54">{visual["title"]}</text><text class="sub" x="40" y="82">{visual["purpose"]}</text></g>
{body}
<rect class="unknown" x="40" y="676" width="1120" height="52" rx="10"/><text class="badge" x="58" y="698">证据边界</text><text class="m" x="142" y="698">{boundary}</text><text class="tiny" x="58" y="717">{visual["caption"]}</text>
</svg>'''


def _career_svg(visual: dict) -> str:
    kind = visual["kind"]
    if kind == "comparison":
        body = '''<g><rect class="panel" x="40" y="116" width="1120" height="518" rx="18"/>
<rect class="secondary" x="72" y="154" width="300" height="290" rx="14"/><text class="h" x="94" y="188">传统软件测试</text><text class="m" x="94" y="220">确定性行为 · 状态 · 接口 · 性能</text><text class="m" x="94" y="248">方法：边界 / 状态 / 契约 / 故障</text><text class="m" x="94" y="276">Oracle：业务规则与独立计算</text><text class="m" x="94" y="304">证据：缺陷、Trace、回归资产</text>
<rect class="primary" x="450" y="136" width="300" height="328" rx="14"/><text class="h" x="472" y="174">AI 测试开发</text><text class="m" x="472" y="206">在传统底座上增加：</text><text class="m" x="472" y="234">数据 / 模型 / RAG / Agent</text><text class="m" x="472" y="262">Eval / Judge 校准 / 统计区间</text><text class="m" x="472" y="290">轨迹 / 权限 / 成本 / 漂移</text><text class="m" x="472" y="318">证据：Dataset、Run、Metric Card</text>
<rect class="secondary" x="828" y="154" width="300" height="290" rx="14"/><text class="h" x="850" y="188">AI 开发</text><text class="m" x="850" y="220">模型与应用能力实现</text><text class="m" x="850" y="248">数据 / Pipeline / 服务 / 工具</text><text class="m" x="850" y="276">可观测、回滚和故障修复</text><text class="m" x="850" y="304">证据：设计、代码、运行版本</text>
<path class="edge" d="M372 340 C410 340 412 340 444 340"/><path class="edge" d="M750 340 C788 340 790 340 822 340"/>
<rect class="warn" x="250" y="500" width="700" height="94" rx="14"/><text class="h" x="274" y="530">共同工程底座：需求依据 → 风险 → 独立 Oracle → 运行证据</text><text class="m" x="274" y="556">测试提出证据与建议；产品裁决规则；发布 owner 接受剩余风险</text><text class="badge" x="274" y="580">AI 不得自动签署 Waiver 或发布决定</text></g>'''
    elif kind == "mindmap":
        items = [(600,350,"证据中心","工件 · 故障 · Reviewer"),(120,150,"AI/ML 测试","数据、模型、LLM/RAG"),(790,130,"测试专业","风险、设计、Oracle"),(900,390,"AI 特有测试","Eval、Judge、Agent"),(650,540,"技术工程","代码、平台、MLOps"),(120,470,"协作与业务","需求、沟通、决策")]
        body = '<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/>'
        for i,(x,y,title,detail) in enumerate(items):
            cls='primary' if i==0 else 'secondary'
            body += f'<rect class="{cls}" x="{x}" y="{y}" width="250" height="92" rx="46"/><text class="h" x="{x+24}" y="{y+38}">{title}</text><text class="m" x="{x+24}" y="{y+64}">{detail}</text>'
            if i: body += f'<path class="edge" d="M {x+125} {y+46} C 520 {y+46}, 520 396, 594 396"/>'
        body += '<text class="tiny" x="425" y="630">判断规则：能说出 ≠ 能完成；能完成 ≠ 能在故障下注明边界并被真实消费者使用</text></g>'
    elif kind == "pie":
        body = '''<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/>
<circle cx="330" cy="360" r="154" fill="none" stroke="#0f766e" stroke-width="84" stroke-dasharray="290 678" transform="rotate(-90 330 360)"/>
<circle cx="330" cy="360" r="154" fill="none" stroke="#4f46e5" stroke-width="84" stroke-dasharray="242 726" stroke-dashoffset="-290" transform="rotate(-90 330 360)"/>
<circle cx="330" cy="360" r="154" fill="none" stroke="#0284c7" stroke-width="84" stroke-dasharray="242 726" stroke-dashoffset="-532" transform="rotate(-90 330 360)"/>
<circle cx="330" cy="360" r="154" fill="none" stroke="#c2410c" stroke-width="84" stroke-dasharray="145 823" stroke-dashoffset="-774" transform="rotate(-90 330 360)"/>
<circle cx="330" cy="360" r="154" fill="none" stroke="#b91c1c" stroke-width="84" stroke-dasharray="49 919" stroke-dashoffset="-919" transform="rotate(-90 330 360)"/>
<circle cx="330" cy="360" r="92" fill="#fff"/><text class="h" x="274" y="348">SOURCE-EXAMPLE</text><text class="m" x="265" y="374">仅保留比较结构</text><text class="badge" x="270" y="400">不是组织权重</text>
<rect class="secondary" x="610" y="160" width="480" height="314" rx="14"/><text class="h" x="638" y="194">来源示例 30 / 25 / 25 / 15 / 5</text><text class="m" x="638" y="230">● AI/ML 测试知识：30</text><text class="m" x="638" y="266">● 测试专业能力：25</text><text class="m" x="638" y="302">● AI 特有测试：25</text><text class="m" x="638" y="338">● 技术工程能力：15</text><text class="m" x="638" y="374">● 协作与业务：5</text><text class="tiny" x="638" y="422">比较时必须记录岗位、任务、版本、样本与证据</text><text class="badge" x="638" y="450">owner 未配置 parameter → INTERNAL-UNKNOWN</text>
<path class="edge" d="M520 360 C560 360 570 320 604 320"/><rect class="warn" x="610" y="510" width="480" height="94" rx="14"/><text class="h" x="638" y="542">组织参数化入口</text><text class="m" x="638" y="568">organization_level_adapter.weights + owner + effective_date</text><text class="tiny" x="638" y="590">缺任一字段都不生成晋升结论</text></g>'''
    elif kind == "lifecycle":
        points=[(600,150,"能力主张"),(870,250,"证据引用"),(870,470,"故障/变异"),(600,570,"独立评审"),(330,470,"工作应用"),(330,250,"反馈复评")]
        body='<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/><circle cx="600" cy="360" r="220" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="7 7"/>'
        for i,(x,y,title) in enumerate(points):
            nx,ny,_=points[(i+1)%len(points)]
            body+=f'<rect class="{"primary" if i==3 else "secondary"}" x="{x-92}" y="{y-34}" width="184" height="68" rx="34"/><text class="h" x="{x-55}" y="{y+5}">{title}</text><path class="edge" d="M {x+92} {y} Q 600 360 {nx-98} {ny}"/>'
        body+='<rect class="warn" x="472" y="304" width="256" height="112" rx="14"/><text class="h" x="498" y="338">闭环条件</text><text class="m" x="498" y="366">evidence_ref + failure + reviewer</text><text class="badge" x="498" y="392">缺证据 → Unknown，不升级</text></g>'
    elif kind == "ladder":
        body='''<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/>
<rect class="secondary" x="90" y="490" width="230" height="105"/><text class="h" x="112" y="525">1 指导下完成</text><text class="m" x="112" y="553">有方法、有复核的单项任务</text>
<rect class="secondary" x="320" y="400" width="230" height="195"/><text class="h" x="342" y="435">2 独立范围负责</text><text class="m" x="342" y="463">工件 · 风险 · Oracle · 交接</text><text class="tiny" x="342" y="490">失败代价可控且可归因</text>
<rect class="primary" x="550" y="300" width="250" height="295"/><text class="h" x="572" y="335">3 系统与跨团队杠杆</text><text class="m" x="572" y="363">平台 · 标准 · 复用控制</text><text class="tiny" x="572" y="390">消费者跨团队、收益可验证</text>
<rect class="warn" x="800" y="190" width="280" height="405"/><text class="h" x="822" y="225">4 战略治理与培养</text><text class="m" x="822" y="253">风险政策 · 决定权 · 导师制</text><text class="tiny" x="822" y="280">治理反馈改变组织系统</text>
<path class="edge" d="M320 520 L314 520"/><path class="edge" d="M550 430 L544 430"/><path class="edge" d="M800 330 L794 330"/>
<rect class="unknown" x="100" y="150" width="580" height="82" rx="12"/><text class="h" x="122" y="182">P5–P9 / 年限 / 晋升周期 → organization_level_adapter</text><text class="badge" x="122" y="208">owner、内部规则与生效版本未提供：INTERNAL-UNKNOWN</text></g>'''
    elif kind == "radar":
        body='''<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/>
<polygon points="360,150 560,295 484,530 236,530 160,295" fill="none" stroke="#cbd5e1" stroke-width="2"/><polygon points="360,205 510,314 453,490 267,490 210,314" fill="none" stroke="#cbd5e1"/><polygon points="360,260 460,333 422,450 298,450 260,333" fill="none" stroke="#cbd5e1"/>
<line x1="360" y1="360" x2="360" y2="150" stroke="#94a3b8"/><line x1="360" y1="360" x2="560" y2="295" stroke="#94a3b8"/><line x1="360" y1="360" x2="484" y2="530" stroke="#94a3b8"/><line x1="360" y1="360" x2="236" y2="530" stroke="#94a3b8"/><line x1="360" y1="360" x2="160" y2="295" stroke="#94a3b8"/>
<polygon points="360,238 500,315 435,462 298,445 235,320" fill="#0f766e" fill-opacity=".18" stroke="#0f766e" stroke-width="3"/><polygon points="360,182 535,303 470,510 250,510 185,303" fill="#4f46e5" fill-opacity=".09" stroke="#4f46e5" stroke-width="2" stroke-dasharray="7 5"/>
<text class="h" x="320" y="138">AI/ML</text><text class="h" x="570" y="294">测试方法</text><text class="h" x="455" y="554">AI Eval</text><text class="h" x="154" y="554">工程交付</text><text class="h" x="68" y="294">业务协作</text>
<rect class="secondary" x="690" y="170" width="400" height="252" rx="14"/><text class="h" x="716" y="204">示例数据，不是诊断结果</text><text class="m" x="716" y="238">实线：当前 evidence_ref 覆盖</text><text class="m" x="716" y="270">虚线：目标任务所需证据</text><text class="m" x="716" y="302">差距：转成一个可运行项目</text><text class="m" x="716" y="334">复评：故障注入 + 独立 reviewer</text><text class="badge" x="716" y="376">无 evidence_ref 的轴 = Unknown</text>
<path class="edge" d="M560 360 C620 360 630 300 684 300"/></g>'''
    elif kind == "gantt":
        body='''<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/>
<text class="h" x="90" y="170">证据窗口</text><line x1="270" y1="190" x2="1080" y2="190" stroke="#94a3b8"/><text class="tiny" x="290" y="178">窗口 A</text><text class="tiny" x="555" y="178">窗口 B</text><text class="tiny" x="820" y="178">窗口 C</text>
<text class="m" x="90" y="244">1 定基线</text><rect class="secondary" x="270" y="216" width="250" height="44" rx="10"/><text class="m" x="292" y="244">能力主张 + evidence_ref</text>
<text class="m" x="90" y="324">2 做故障</text><rect class="primary" x="520" y="296" width="270" height="44" rx="10"/><text class="m" x="542" y="324">mutation / fault / repair</text>
<text class="m" x="90" y="404">3 交付复评</text><rect class="warn" x="790" y="376" width="280" height="44" rx="10"/><text class="m" x="812" y="404">consumer 使用 + reviewer</text>
<path class="dash" d="M520 238 L514 318"/><path class="dash" d="M790 318 L784 398"/>
<rect class="secondary" x="270" y="476" width="800" height="112" rx="14"/><text class="h" x="294" y="508">parameterized_schedule</text><text class="m" x="294" y="536">default example：30 / 60 / 90；actual：由 owner 按工件复杂度、机会和风险配置</text><text class="badge" x="294" y="566">不输出晋升日期；任一窗口无出口工件则保持进行中或 Unknown</text></g>'''
    elif kind == "path":
        body='''<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/>
<rect class="secondary" x="76" y="150" width="210" height="78" rx="12"/><text class="h" x="102" y="182">测试背景</text><text class="m" x="102" y="207">补 AI 原理与 Eval</text>
<rect class="primary" x="76" y="292" width="210" height="78" rx="12"/><text class="h" x="102" y="324">开发背景</text><text class="m" x="102" y="349">补测试方法与 Oracle</text>
<rect class="warn" x="76" y="434" width="210" height="78" rx="12"/><text class="h" x="102" y="466">零基础</text><text class="m" x="102" y="491">补编程、测试与 AI 基础</text>
<rect class="secondary" x="400" y="245" width="240" height="180" rx="16"/><text class="h" x="428" y="280">缺口诊断</text><text class="m" x="428" y="312">先修页面组合</text><text class="m" x="428" y="340">一项固定输入练习</text><text class="m" x="428" y="368">故障检测与修复</text><text class="badge" x="428" y="400">时长：Unknown</text>
<rect class="primary" x="760" y="245" width="320" height="180" rx="16"/><text class="h" x="788" y="280">共同完成条件</text><text class="m" x="788" y="312">可运行项目 + 独立 Oracle</text><text class="m" x="788" y="340">红/绿收据 + 迁移卡</text><text class="m" x="788" y="368">真实 consumer + reviewer</text><text class="badge" x="788" y="400">责任证据，不是 P5 承诺</text>
<path class="edge" d="M286 189 C350 189 350 300 394 300"/><path class="edge" d="M286 331 L394 331"/><path class="edge" d="M286 473 C350 473 350 365 394 365"/><path class="edge" d="M640 335 L754 335"/>
<text class="tiny" x="398" y="560">起点不同 → 先修顺序不同；出口标准相同 → 可审计的工作证据</text></g>'''
    else:
        body='''<g><rect class="panel" x="40" y="110" width="1120" height="540" rx="18"/><line x1="600" y1="160" x2="600" y2="610" stroke="#475569" stroke-width="2"/><line x1="120" y1="385" x2="1080" y2="385" stroke="#475569" stroke-width="2"/>
<text class="h" x="500" y="145">任务重要性 ↑</text><text class="h" x="910" y="630">证据成熟度 →</text>
<rect class="warn" x="140" y="190" width="400" height="150" rx="14"/><text class="h" x="168" y="226">优先补齐</text><text class="m" x="168" y="258">高重要 · 低证据</text><text class="m" x="168" y="288">下一步：固定输入 + 故障实验</text><text class="badge" x="168" y="316">owner 确认当前任务优先级</text>
<rect class="primary" x="660" y="190" width="400" height="150" rx="14"/><text class="h" x="688" y="226">保持优势</text><text class="m" x="688" y="258">高重要 · 高证据</text><text class="m" x="688" y="288">下一步：生产使用与漂移复评</text>
<rect class="secondary" x="140" y="430" width="400" height="150" rx="14"/><text class="h" x="168" y="466">暂缓</text><text class="m" x="168" y="498">低重要 · 低证据</text><text class="m" x="168" y="528">记录触发条件，不制造学习焦虑</text>
<rect class="secondary" x="660" y="430" width="400" height="150" rx="14"/><text class="h" x="688" y="466">分享与复用</text><text class="m" x="688" y="498">低重要 · 高证据</text><text class="m" x="688" y="528">模板化、带教或转移维护权</text></g>'''
    return _svg_shell(visual, body)


def _t(x, y, text, size=12, weight=600, fill=None, family=SANS, anchor="start", ls=None):
    fill = fill or DS["muted"]
    letter = f' letter-spacing="{ls}"' if ls else ""
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{letter}>{xml(text)}</text>'


def _pill(x, y, text, fill, ink):
    width = int(len(text) * 6.4) + 26
    return (
        f'<rect x="{x - width // 2}" y="{y - 11}" width="{width}" height="22" rx="11" fill="{fill}"/>'
        f'<text x="{x}" y="{y + 4}" font-family="{SANS}" font-size="10.5" font-weight="700" fill="{ink}" text-anchor="middle">{xml(text)}</text>'
    )


def _bullet(x, y, color, text, max_chars=24):
    lines = wrap(text, max_chars, 2)
    out = ""
    for i, line in enumerate(lines):
        yy = y + i * 23
        out += (
            f'<rect x="{x}" y="{yy - 11}" width="15" height="15" rx="4.5" fill="{color}"/>'
            f'<path d="M {x + 3.5} {yy - 3} L {x + 6} {yy - 0.5} L {x + 11.5} {yy - 7}" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<text x="{x + 23}" y="{yy}" font-family="{SANS}" font-size="12.5" font-weight="500" fill="{DS["ink"]}">{xml(line)}</text>'
        )
    return out, len(lines) * 23


def _divider(x1, x2, y, color=None):
    color = color or DS["line"]
    return f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{color}" stroke-width="1.2"/>'


def _career_shell(visual, kind_label, body):
    width = 1240
    height = 860
    header_height = 118
    boundary = "SOURCE-EXAMPLE · 组织职级 / 年限 / 权重均为 INTERNAL-UNKNOWN · 本图不证明晋升、就业或真实学习效果"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
<title id="title">{xml(visual["title"])}</title>
<desc id="desc">{xml(visual["alt"])} {xml(boundary)}</desc>
{ds_defs()}
<style>{ds_css()}
.cc-title{{font:800 18px {SANS};fill:{DS["ink"]}}}
.cc-label{{font:800 10.5px {MONO};letter-spacing:.12em;fill:{DS["soft"]}}}
.cc-value{{font:500 12.5px {SANS};fill:{DS["muted"]}}}
.cc-note{{font:500 11px {SANS};fill:{DS["muted"]}}}
</style>
<rect class="ds-bg" width="{width}" height="{height}" rx="22"/>
{ds_header(width, header_height, kind_label, visual["title"], visual["purpose"], "source · " + visual["source_refs"][0])}
<g data-source-ref="{visual["source_refs"][0]}">{body}</g>
<text x="40" y="{height - 96}" font-family="{SANS}" font-size="11px" font-weight="500" fill="{DS["muted"]}">{xml(visual["caption"])}</text>
{ds_footer(width, height, boundary)}
</svg>'''


def _career_svg_v2(visual):
    kind = visual["kind"]
    B = DS
    ink, muted, soft, line = B["ink"], B["muted"], B["soft"], B["line"]
    forest, lime = B["forest"], B["lime"]
    blue, blueFill = B["blue"], B["blueFill"]
    purple, purpleFill = B["purple"], B["purpleFill"]
    amber, amberFill = B["amber"], B["amberFill"]
    red, redFill = B["red"], B["redFill"]
    mint, sage = B["mint"], B["sage"]

    if kind == "comparison":
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
{_t(72, 178, "三个角色的责任边界", size=13, weight=800, fill=forest)}
<g filter="url(#ds-strong)"><rect x="64" y="196" width="336" height="360" rx="16" fill="#fff" stroke="#dde3dd" stroke-width="1.2"/></g>
<rect x="64" y="196" width="336" height="7" rx="3.5" fill="{blue}"/><circle cx="90" cy="232" r="6" fill="{blue}"/>
{_t(106, 237, "传统软件测试", size=17, weight=800, fill=ink)}
{_pill(330, 233, "确定性工程", blueFill, blue)}
{_divider(88, 376, 258)}
{_t(88, 284, "聚焦范围", size=10.5, weight=800, fill=soft)}
{_t(88, 306, "确定性行为 · 状态 · 接口 · 性能", size=12.5, weight=500, fill=muted)}
{_t(88, 338, "主责任", size=10.5, weight=800, fill=soft)}
{_bullet(88, 356, blue, "依据业务规则与独立计算建 Oracle")[0]}
{_bullet(88, 379, blue, "边界 / 状态 / 契约 / 故障注入")[0]}
{_bullet(88, 402, blue, "把缺陷、Trace 固化为回归资产")[0]}
{_bullet(88, 425, blue, "用 Mutation 证明测试检测力")[0]}
{_divider(88, 376, 448)}
{_t(88, 474, "证据产出", size=10.5, weight=800, fill=soft)}
{_t(88, 500, "缺陷报告 · Trace · 回归集", size=12.5, weight=600, fill=ink)}
<g filter="url(#ds-strong)"><rect x="452" y="176" width="336" height="392" rx="16" fill="#fff" stroke="{forest}" stroke-width="2.2"/></g>
<rect x="452" y="176" width="336" height="9" rx="4.5" fill="{forest}"/><circle cx="478" cy="222" r="6" fill="{forest}"/>
{_t(494, 227, "AI 测试开发", size=18, weight=800, fill=ink)}
{_pill(724, 223, "课程主线", "#d7ebd0", forest)}
{_divider(476, 764, 252)}
{_t(476, 278, "聚焦范围", size=10.5, weight=800, fill=soft)}
{_t(476, 300, "在传统底座上新增模型与数据风险", size=12.5, weight=600, fill=ink)}
{_t(476, 332, "主责任", size=10.5, weight=800, fill=soft)}
{_bullet(476, 350, forest, "Dataset：采样 / 标签 / Holdout / 泄漏")[0]}
{_bullet(476, 373, forest, "Eval：Judge 校准 / 统计区间 / 拒答")[0]}
{_bullet(476, 396, forest, "Trace：权限 / 成本 / 漂移 / 治理")[0]}
{_bullet(476, 419, forest, "红队：注入 / 越权 / 过度代理")[0]}
{_divider(476, 764, 442)}
{_t(476, 468, "证据产出", size=10.5, weight=800, fill=soft)}
{_t(476, 494, "Dataset · Run Receipt · Metric Card", size=12.5, weight=600, fill=ink)}
{_t(476, 522, "本列是 AI 测试工程师的职业主路径", size=11, weight=600, fill=lime if False else forest)}
<g filter="url(#ds-strong)"><rect x="840" y="196" width="336" height="360" rx="16" fill="#fff" stroke="#dde3dd" stroke-width="1.2"/></g>
<rect x="840" y="196" width="336" height="7" rx="3.5" fill="{purple}"/><circle cx="866" cy="232" r="6" fill="{purple}"/>
{_t(882, 237, "AI 开发", size=17, weight=800, fill=ink)}
{_pill(1106, 233, "能力实现", purpleFill, purple)}
{_divider(864, 1152, 258)}
{_t(864, 284, "聚焦范围", size=10.5, weight=800, fill=soft)}
{_t(864, 306, "模型与应用能力落地", size=12.5, weight=500, fill=muted)}
{_t(864, 338, "主责任", size=10.5, weight=800, fill=soft)}
{_bullet(864, 356, purple, "数据 / Pipeline / 服务 / 工具")[0]}
{_bullet(864, 379, purple, "可观测、回滚和故障修复")[0]}
{_bullet(864, 402, purple, "能力版本与运行证据")[0]}
{_bullet(864, 425, purple, "与测试共享工程底座")[0]}
{_divider(864, 1152, 448)}
{_t(864, 474, "证据产出", size=10.5, weight=800, fill=soft)}
{_t(864, 500, "设计 · 代码 · 运行版本", size=12.5, weight=600, fill=ink)}
<g filter="url(#ds-strong)"><rect x="64" y="588" width="1112" height="86" rx="14" fill="{amberFill}" stroke="#e3c07b" stroke-width="1.2"/></g>
{_t(88, 616, "共同工程底座", size=12, weight=800, fill=amber)}
{_t(88, 640, "需求依据 → 风险 → 独立 Oracle → 运行证据；测试提出证据与建议，产品裁决规则", size=12.5, weight=500, fill=ink)}
{_t(88, 662, "发布 owner 接受剩余风险", size=12.5, weight=500, fill=ink)}
{_t(1076, 652, "AI 不得代签", size=12, weight=800, fill=red)}'''
        return _career_shell(visual, "CAREER · 责任边界对比", body)

    if kind == "mindmap":
        branches = [
            (86, 168, "AI/ML 测试", "数据、模型、LLM / RAG", blue, blueFill),
            (890, 150, "测试专业", "风险、设计、Oracle", purple, purpleFill),
            (930, 420, "AI 特有测试", "Eval、Judge、Agent", forest, mint),
            (640, 545, "技术工程", "代码、平台、MLOps", amber, amberFill),
            (110, 545, "协作与业务", "需求、沟通、决策", red, redFill),
        ]
        branch_svg = ""
        for x, y, title, detail, accent, fill in branches:
            cx, cy = x + 125, y + 40
            branch_svg += (
                f'<path d="M {cx} {cy} C {cx + (620 - cx) * 0.45} {cy}, {620 - (620 - cx) * 0.15} {400}, 508 400" fill="none" stroke="{sage}" stroke-width="1.8" marker-end="url(#ds-arw-forest)"/>'
                if x < 620
                else f'<path d="M {cx} {cy} C {cx + (620 - cx) * 0.45} {cy}, {620 + (cx - 620) * 0.15} {400}, 732 400" fill="none" stroke="{sage}" stroke-width="1.8" marker-end="url(#ds-arw-forest)"/>'
            )
            branch_svg += (
                f'<g filter="url(#ds-soft)"><rect x="{x}" y="{y}" width="250" height="82" rx="14" fill="{fill}" stroke="{accent}" stroke-width="1.5"/></g>'
                f'<circle cx="{x + 25}" cy="{y + 24}" r="5" fill="{accent}"/>'
                f'<text x="{x + 40}" y="{y + 29}" font-family="{SANS}" font-size="14" font-weight="800" fill="{ink}">{xml(title)}</text>'
                f'<text x="{x + 22}" y="{y + 60}" font-family="{SANS}" font-size="11" font-weight="500" fill="{muted}">{xml(detail)}</text>'
            )
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
<g filter="url(#ds-strong)"><rect x="510" y="348" width="220" height="104" rx="52" fill="{forest}" stroke="{forest}"/></g>
<text x="620" y="392" font-family="{SANS}" font-size="16" font-weight="800" fill="#fff" text-anchor="middle">证据中心</text>
<text x="620" y="416" font-family="{SANS}" font-size="11" font-weight="600" fill="{B["onDark"]}" text-anchor="middle">工件 · 故障 · Reviewer</text>
{branch_svg}
{_t(425, 642, "判断规则：能说出 ≠ 能完成；能完成 ≠ 能在故障下注明边界并被真实消费者使用", size=11, weight=600, fill=muted)}'''
        return _career_shell(visual, "CAREER · 能力证据地图", body)

    if kind == "pie":
        segments = [
            (290, 678, blue, "AI/ML 测试知识", 30),
            (242, 726, purple, "测试专业能力", 25),
            (242, 726, B["forest"], "AI 特有测试", 25),
            (145, 823, amber, "技术工程能力", 15),
            (49, 919, red, "协作与业务", 5),
        ]
        rings = ""
        offset = 0
        for dash, total, color, label, value in segments:
            rings += f'<circle cx="330" cy="360" r="154" fill="none" stroke="{color}" stroke-width="84" stroke-dasharray="{dash} {total}" stroke-dashoffset="-{offset}" transform="rotate(-90 330 360)"/>'
            offset += dash
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
{rings}
<circle cx="330" cy="360" r="92" fill="#fff"/><text x="330" y="352" font-family="{SANS}" font-size="13" font-weight="800" fill="{ink}" text-anchor="middle">SOURCE-EXAMPLE</text><text x="330" y="376" font-family="{SANS}" font-size="10.5" font-weight="600" fill="{muted}" text-anchor="middle">仅保留比较结构</text>
<g filter="url(#ds-soft)"><rect x="640" y="170" width="500" height="300" rx="16" fill="#fff" stroke="{line}" stroke-width="1.2"/></g>
{_t(668, 204, "来源示例 30 / 25 / 25 / 15 / 5", size=14, weight=800, fill=ink)}
{_t(668, 238, "● AI/ML 测试知识：30", size=12.5, weight=600, fill=blue)}
{_t(668, 268, "● 测试专业能力：25", size=12.5, weight=600, fill=purple)}
{_t(668, 298, "● AI 特有测试：25", size=12.5, weight=600, fill=B["forest"])}
{_t(668, 328, "● 技术工程能力：15", size=12.5, weight=600, fill=amber)}
{_t(668, 358, "● 协作与业务：5", size=12.5, weight=600, fill=red)}
{_t(668, 398, "比较时必须记录岗位、任务、版本、样本与证据", size=11, weight=600, fill=muted)}
{_t(668, 428, "owner 未配置 parameter → INTERNAL-UNKNOWN", size=11, weight=800, fill=red)}
<path d="M520 360 C580 360 590 320 634 320" fill="none" stroke="{sage}" stroke-width="2" marker-end="url(#ds-arw-soft)"/>
<g filter="url(#ds-soft)"><rect x="640" y="494" width="500" height="100" rx="14" fill="{amberFill}" stroke="#e3c07b" stroke-width="1.2"/></g>
{_t(668, 528, "组织参数化入口", size=12, weight=800, fill=amber)}
{_t(668, 552, "organization_level_adapter.weights + owner + effective_date", size=11.5, weight=600, fill=ink)}
{_t(668, 576, "缺任一字段都不生成晋升结论", size=11, weight=600, fill=muted)}'''
        return _career_shell(visual, "CAREER · 能力占比示例", body)

    if kind == "lifecycle":
        import math
        center_x, center_y, radius = 620, 400, 235
        steps = ["能力主张", "证据引用", "故障 / 变异", "独立评审", "工作应用", "反馈复评"]
        cycle = ""
        for i, label in enumerate(steps):
            angle = -90 + i * 60
            rad = math.radians(angle)
            x = center_x + radius * math.cos(rad)
            y = center_y + radius * math.sin(rad)
            fill = forest if i == 3 else mint
            stroke = forest if i == 3 else sage
            cycle += f'<g filter="url(#ds-soft)"><rect x="{x - 82}" y="{y - 30}" width="164" height="60" rx="30" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/></g>'
            cycle += f'<circle cx="{x}" cy="{y}" r="5" fill="{forest if i == 3 else sage}"/>'
            cycle += f'<text x="{x}" y="{y + 4}" font-family="{SANS}" font-size="12.5" font-weight="800" fill="{ink}" text-anchor="middle">{xml(label)}</text>'
            nxt = steps[(i + 1) % len(steps)]
            na = -90 + ((i + 1) % len(steps)) * 60
            nx = center_x + (radius - 82) * math.cos(math.radians(na))
            ny = center_y + (radius - 82) * math.sin(math.radians(na))
            if i == 0:
                sx, sy = x + 82 * math.cos(math.radians(angle - 90)), y + 82 * math.sin(math.radians(angle - 90))
            cycle += f'<path d="M {x + 82} {y} Q {center_x} {center_y} {nx} {ny}" fill="none" stroke="{forest}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>'
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
<circle cx="{center_x}" cy="{center_y}" r="235" fill="none" stroke="{line}" stroke-width="1.5" stroke-dasharray="7 7"/>
{cycle}
<g filter="url(#ds-strong)"><rect x="472" y="330" width="296" height="132" rx="16" fill="#fff" stroke="{forest}" stroke-width="1.5"/></g>
{_t(500, 364, "闭环条件", size=12, weight=800, fill=forest)}
{_t(500, 392, "evidence_ref + failure + reviewer", size=11.5, weight=600, fill=ink)}
{_t(500, 420, "缺证据 → Unknown，不升级", size=11, weight=800, fill=red)}'''
        return _career_shell(visual, "CAREER · 证据生命周期", body)

    if kind == "ladder":
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
<g filter="url(#ds-soft)"><rect x="70" y="520" width="230" height="106" rx="14" fill="{mint}" stroke="{sage}" stroke-width="1.5"/></g>
<text x="92" y="552" font-family="{SANS}" font-size="14" font-weight="800" fill="{ink}">1 指导下完成</text>
<text x="92" y="578" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{muted}">有方法、有复核的单项任务</text>
<g filter="url(#ds-soft)"><rect x="340" y="432" width="230" height="194" rx="14" fill="{mint}" stroke="{sage}" stroke-width="1.5"/></g>
<text x="362" y="464" font-family="{SANS}" font-size="14" font-weight="800" fill="{ink}">2 独立范围负责</text>
<text x="362" y="490" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{muted}">工件 · 风险 · Oracle · 交接</text>
<text x="362" y="516" font-family="{SANS}" font-size="11" font-weight="600" fill="{soft}">失败代价可控且可归因</text>
<g filter="url(#ds-strong)"><rect x="610" y="332" width="250" height="294" rx="14" fill="{B["mint"]}" stroke="{forest}" stroke-width="2"/></g>
<text x="632" y="364" font-family="{SANS}" font-size="14.5" font-weight="800" fill="{ink}">3 系统与跨团队杠杆</text>
<text x="632" y="392" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{muted}">平台 · 标准 · 复用控制</text>
<text x="632" y="418" font-family="{SANS}" font-size="11" font-weight="600" fill="{soft}">消费者跨团队、收益可验证</text>
<g filter="url(#ds-strong)"><rect x="900" y="204" width="250" height="422" rx="14" fill="{amberFill}" stroke="#e0b76a" stroke-width="1.8"/></g>
<text x="922" y="236" font-family="{SANS}" font-size="14.5" font-weight="800" fill="{ink}">4 战略治理与培养</text>
<text x="922" y="264" font-family="{SANS}" font-size="11.5" font-weight="500" fill="{muted}">风险政策 · 决定权 · 导师制</text>
<text x="922" y="290" font-family="{SANS}" font-size="11" font-weight="600" fill="{soft}">治理反馈改变组织系统</text>
<path d="M300 570 C320 570 320 530 334 530" fill="none" stroke="{forest}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>
<path d="M570 520 C590 520 590 470 604 470" fill="none" stroke="{forest}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>
<path d="M860 420 C880 420 880 400 894 400" fill="none" stroke="{forest}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>
<g filter="url(#ds-soft)"><rect x="70" y="176" width="500" height="76" rx="12" fill="{redFill}" stroke="#e3a89f" stroke-width="1.2"/></g>
{_t(92, 208, "P5–P9 / 年限 / 晋升周期 → organization_level_adapter", size=12, weight=800, fill=ink)}
{_t(92, 234, "owner、内部规则与生效版本未提供：INTERNAL-UNKNOWN", size=11, weight=800, fill=red)}'''
        return _career_shell(visual, "CAREER · 责任阶梯", body)

    if kind == "radar":
        center_x, center_y, radius = 420, 400, 210
        axes = ["AI/ML", "测试方法", "AI Eval", "工程交付", "业务协作"]
        import math
        grid = ""
        for level in (1.0, 0.66, 0.33):
            pts = []
            for i in range(5):
                a = math.radians(-90 + i * 72)
                pts.append(f"{center_x + radius * level * math.cos(a):.1f},{center_y + radius * level * math.sin(a):.1f}")
            grid += f'<polygon points="{" ".join(pts)}" fill="none" stroke="{line}" stroke-width="1.4"/>'
        spokes = ""
        labels = ""
        current = []
        target = []
        cur_vals = [0.72, 0.55, 0.48, 0.62, 0.4]
        tgt_vals = [0.9, 0.78, 0.82, 0.72, 0.68]
        for i, label in enumerate(axes):
            a = math.radians(-90 + i * 72)
            ex, ey = center_x + (radius + 26) * math.cos(a), center_y + (radius + 26) * math.sin(a)
            spokes += f'<line x1="{center_x}" y1="{center_y}" x2="{center_x + radius * math.cos(a)}" y2="{center_y + radius * math.sin(a)}" stroke="{line}" stroke-width="1.4"/>'
            labels += f'<text x="{ex}" y="{ey + 4}" font-family="{SANS}" font-size="12.5" font-weight="800" fill="{ink}" text-anchor="middle">{xml(label)}</text>'
            current.append(f"{center_x + radius * cur_vals[i] * math.cos(a):.1f},{center_y + radius * cur_vals[i] * math.sin(a):.1f}")
            target.append(f"{center_x + radius * tgt_vals[i] * math.cos(a):.1f},{center_y + radius * tgt_vals[i] * math.sin(a):.1f}")
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
{grid}{spokes}
<polygon points="{" ".join(current)}" fill="{forest}" fill-opacity=".18" stroke="{forest}" stroke-width="3"/>
<polygon points="{" ".join(target)}" fill="{blue}" fill-opacity=".09" stroke="{blue}" stroke-width="2" stroke-dasharray="7 5"/>
{labels}
<g filter="url(#ds-soft)"><rect x="780" y="186" width="380" height="300" rx="16" fill="#fff" stroke="{line}" stroke-width="1.2"/></g>
{_t(808, 220, "示例数据，不是诊断结果", size=13, weight=800, fill=ink)}
{_t(808, 254, "实线：当前 evidence_ref 覆盖", size=12, weight=600, fill=forest)}
{_t(808, 284, "虚线：目标任务所需证据", size=12, weight=600, fill=blue)}
{_t(808, 314, "差距：转成一个可运行项目", size=12, weight=500, fill=muted)}
{_t(808, 344, "复评：故障注入 + 独立 reviewer", size=12, weight=500, fill=muted)}
{_t(808, 384, "无 evidence_ref 的轴 = Unknown", size=11.5, weight=800, fill=red)}
<g filter="url(#ds-soft)"><rect x="780" y="516" width="380" height="72" rx="12" fill="{amberFill}" stroke="#e3c07b" stroke-width="1.2"/></g>
{_t(808, 546, "owner 定义目标；示例值不迁移", size=11.5, weight=700, fill=amber)}
{_t(808, 570, "必须用 evidence_ref 重算", size=11, weight=600, fill=muted)}'''
        return _career_shell(visual, "CAREER · 五维证据雷达", body)

    if kind == "gantt":
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
{_t(90, 184, "证据窗口", size=13, weight=800, fill=forest)}
<line x1="270" y1="206" x2="1090" y2="206" stroke="{soft}" stroke-width="1.2"/>
{_t(300, 194, "窗口 A", size=11, weight=700, fill=soft)}
{_t(565, 194, "窗口 B", size=11, weight=700, fill=soft)}
{_t(830, 194, "窗口 C", size=11, weight=700, fill=soft)}
{_t(90, 258, "1 定基线", size=12.5, weight=800, fill=ink)}
<g filter="url(#ds-soft)"><rect x="270" y="232" width="250" height="44" rx="10" fill="{blueFill}" stroke="{blue}" stroke-width="1.4"/></g>
{_t(292, 260, "能力主张 + evidence_ref", size=12, weight=600, fill=ink)}
{_t(90, 338, "2 做故障", size=12.5, weight=800, fill=ink)}
<g filter="url(#ds-soft)"><rect x="520" y="312" width="270" height="44" rx="10" fill="{mint}" stroke="{forest}" stroke-width="1.4"/></g>
{_t(542, 340, "mutation / fault / repair", size=12, weight=600, fill=ink)}
{_t(90, 418, "3 交付复评", size=12.5, weight=800, fill=ink)}
<g filter="url(#ds-soft)"><rect x="790" y="392" width="280" height="44" rx="10" fill="{amberFill}" stroke="{amber}" stroke-width="1.4"/></g>
{_t(812, 420, "consumer 使用 + reviewer", size=12, weight=600, fill=ink)}
<path d="M520 254 L514 306" fill="none" stroke="{soft}" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#ds-arw-soft)"/>
<path d="M790 334 L784 386" fill="none" stroke="{soft}" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#ds-arw-soft)"/>
<g filter="url(#ds-soft)"><rect x="270" y="486" width="800" height="118" rx="14" fill="#fff" stroke="{line}" stroke-width="1.2"/></g>
{_t(294, 520, "parameterized_schedule", size=12.5, weight=800, fill=ink)}
{_t(294, 548, "default example：30 / 60 / 90；actual：由 owner 按工件复杂度、机会和风险配置", size=12, weight=500, fill=muted)}
{_t(294, 576, "不输出晋升日期；任一窗口无出口工件则保持进行中或 Unknown", size=11.5, weight=800, fill=red)}'''
        return _career_shell(visual, "CAREER · 证据计划", body)

    if kind == "path":
        body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
<g filter="url(#ds-soft)"><rect x="76" y="170" width="210" height="78" rx="12" fill="{blueFill}" stroke="{blue}" stroke-width="1.4"/></g>
{_t(102, 202, "测试背景", size=14, weight=800, fill=ink)}
{_t(102, 226, "补 AI 原理与 Eval", size=11.5, weight=500, fill=muted)}
<g filter="url(#ds-soft)"><rect x="76" y="312" width="210" height="78" rx="12" fill="{mint}" stroke="{forest}" stroke-width="1.4"/></g>
{_t(102, 344, "开发背景", size=14, weight=800, fill=ink)}
{_t(102, 368, "补测试方法与 Oracle", size=11.5, weight=500, fill=muted)}
<g filter="url(#ds-soft)"><rect x="76" y="454" width="210" height="78" rx="12" fill="{amberFill}" stroke="{amber}" stroke-width="1.4"/></g>
{_t(102, 486, "零基础", size=14, weight=800, fill=ink)}
{_t(102, 510, "补编程、测试与 AI 基础", size=11.5, weight=500, fill=muted)}
<g filter="url(#ds-strong)"><rect x="400" y="265" width="240" height="180" rx="16" fill="#fff" stroke="{forest}" stroke-width="1.6"/></g>
{_t(428, 300, "缺口诊断", size=14, weight=800, fill=forest)}
{_t(428, 332, "先修页面组合", size=11.5, weight=500, fill=muted)}
{_t(428, 356, "一项固定输入练习", size=11.5, weight=500, fill=muted)}
{_t(428, 380, "故障检测与修复", size=11.5, weight=500, fill=muted)}
{_t(428, 412, "时长：Unknown", size=11, weight=800, fill=red)}
<g filter="url(#ds-strong)"><rect x="760" y="265" width="320" height="180" rx="16" fill="#fff" stroke="{forest}" stroke-width="1.6"/></g>
{_t(788, 300, "共同完成条件", size=14, weight=800, fill=forest)}
{_t(788, 332, "可运行项目 + 独立 Oracle", size=11.5, weight=500, fill=muted)}
{_t(788, 356, "红 / 绿收据 + 迁移卡", size=11.5, weight=500, fill=muted)}
{_t(788, 380, "真实 consumer + reviewer", size=11.5, weight=500, fill=muted)}
{_t(788, 412, "责任证据，不是 P5 承诺", size=11, weight=800, fill=red)}
<path d="M286 209 C340 209 340 300 394 300" fill="none" stroke="{blue}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>
<path d="M286 351 L394 351" fill="none" stroke="{forest}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>
<path d="M286 493 C340 493 340 410 394 410" fill="none" stroke="{amber}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>
<path d="M640 355 L754 355" fill="none" stroke="{forest}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>
{_t(398, 500, "起点不同 → 先修顺序不同；出口标准相同 → 可审计的工作证据", size=11, weight=600, fill=muted)}'''
        return _career_shell(visual, "CAREER · 背景路径", body)

    # quadrant
    body = f'''<rect x="40" y="146" width="1160" height="512" rx="18" fill="{B["canvas"]}" stroke="{line}" stroke-width="1.2"/>
<line x1="600" y1="176" x2="600" y2="624" stroke="{soft}" stroke-width="2"/>
<line x1="120" y1="400" x2="1080" y2="400" stroke="{soft}" stroke-width="2"/>
{_t(500, 164, "任务重要性 ↑", size=12, weight=800, fill=forest)}
{_t(930, 650, "证据成熟度 →", size=12, weight=800, fill=forest)}
<g filter="url(#ds-strong)"><rect x="140" y="202" width="400" height="160" rx="14" fill="{redFill}" stroke="#e3a89f" stroke-width="1.5"/></g>
{_t(168, 238, "优先补齐", size=14, weight=800, fill=ink)}
{_t(168, 266, "高重要 · 低证据", size=11.5, weight=700, fill=red)}
{_t(168, 294, "下一步：固定输入 + 故障实验", size=12, weight=500, fill=muted)}
{_t(168, 326, "owner 确认当前任务优先级", size=11, weight=800, fill=red)}
<g filter="url(#ds-strong)"><rect x="660" y="202" width="400" height="160" rx="14" fill="{mint}" stroke="{sage}" stroke-width="1.5"/></g>
{_t(688, 238, "保持优势", size=14, weight=800, fill=ink)}
{_t(688, 266, "高重要 · 高证据", size=11.5, weight=700, fill=forest)}
{_t(688, 294, "下一步：生产使用与漂移复评", size=12, weight=500, fill=muted)}
{_t(688, 326, "持续验证，不视为终身结论", size=11, weight=800, fill=forest)}
<g filter="url(#ds-soft)"><rect x="140" y="442" width="400" height="160" rx="14" fill="{B["cream"]}" stroke="{B["sand"]}" stroke-width="1.5"/></g>
{_t(168, 478, "暂缓", size=14, weight=800, fill=ink)}
{_t(168, 506, "低重要 · 低证据", size=11.5, weight=700, fill=muted)}
{_t(168, 534, "记录触发条件，不制造学习焦虑", size=12, weight=500, fill=muted)}
{_t(168, 566, "时机或任务变化后再评估", size=11, weight=800, fill=muted)}
<g filter="url(#ds-soft)"><rect x="660" y="442" width="400" height="160" rx="14" fill="{blueFill}" stroke="{blue}" stroke-width="1.5"/></g>
{_t(688, 478, "分享与复用", size=14, weight=800, fill=ink)}
{_t(688, 506, "低重要 · 高证据", size=11.5, weight=700, fill=blue)}
{_t(688, 534, "模板化、带教或转移维护权", size=12, weight=500, fill=muted)}
{_t(688, 566, "释放精力，聚焦高优先级", size=11, weight=800, fill=blue)}'''
    return _career_shell(visual, "CAREER · 优先级四象限", body)


def build_source_visuals() -> None:
    visual_root = SOURCE / "visuals"
    visual_root.mkdir(parents=True, exist_ok=True)
    editable = {
        "schema_version": "1.0.0",
        "status": "SOURCE-EXAMPLE",
        "policy": {
            "organization_level_status": "INTERNAL-UNKNOWN",
            "weights_and_years": "parameterized",
            "parameter_owner": "organization_level_adapter.owner",
            "failure_action": "block promotion conclusions until owner and internal source are supplied",
        },
        "visuals": CAREER_VISUALS,
    }
    write_json(visual_root / "career-visual-source.json", editable)
    manifest = {
        "schema_version": "1.0.0",
        "package_id": "td-ai-career-evolution-source-visuals",
        "status": "SOURCE-EXAMPLE",
        "source": {
            "path": "/Users/owen/Downloads/AI测试工程师发展.md",
            "sha256": CAREER_SOURCE_SHA256,
            "locators": sorted({ref for visual in CAREER_VISUALS for ref in visual["source_refs"]}),
        },
        "policy": editable["policy"],
        "visuals": [],
        "evidence_boundary": "Static design evidence only; learner comprehension, practitioner validity, employment and promotion outcomes are NOT_RUN.",
    }
    for visual in CAREER_VISUALS:
        target = visual_root / visual["file"]
        target.write_text(_career_svg_v2(visual) + "\n", encoding="utf-8")
        manifest["visuals"].append({
            "visual_id": visual["visual_id"], "kind": visual["kind"], "purpose": visual["purpose"],
            "rendered_path": f"visuals/{visual['file']}", "editable_path": "visuals/career-visual-source.json",
            "sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "alt_text": visual["alt"],
            "caption": visual["caption"], "not_proof": "本图不证明职级、晋升时长、真实学习效果或就业结果；这些保持 NOT_RUN / INTERNAL-UNKNOWN。",
            "source_refs": visual["source_refs"], "nodes": visual["nodes"], "relationships": visual["relationships"],
        })
    write_json(SOURCE / "source-visual-manifest.json", manifest)


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    # The learner tree is the canonical source for the public material bundle.
    # Mirror standard package assets into it before projecting to public so the
    # archive cannot contain files without a canonical owner.
    for directory in ("materials", "video"):
        target = SOURCE / directory
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(COURSE / directory, target)
    (SOURCE / "evidence").mkdir(parents=True, exist_ok=True)
    shutil.copy2(
        COURSE / "evidence/execution-evidence.json",
        SOURCE / "evidence/execution-evidence.json",
    )
    build_source_visuals()

    for page_id in PAGE_IDS:
        manifest_path = SOURCE / "manifests" / f"{page_id}.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest.update(
            {
                "manifest_version": "1.0.0",
                "working_directory": WORKDIR,
                "steps": [
                    {
                        "step_id": "cycle",
                        "command": f"python3 scripts/career_evolution_lab.py --manifest manifests/{page_id}.json --mode cycle",
                        "expected_exit_code": 0,
                        "expected_artifacts": [
                            f"evidence/{page_id}/baseline.json",
                            f"evidence/{page_id}/fault.json",
                            f"evidence/{page_id}/repair.json",
                            f"evidence/{page_id}/cycle.json",
                        ],
                    }
                ],
                "required_files": [
                    "scripts/career_evolution_lab.py",
                    f"fixtures/{page_id}-input.json",
                    f"manifests/{page_id}.json",
                ],
            }
        )
        write_json(manifest_path, manifest)

        prompt_manifest_path = SOURCE / "prompts" / page_id / "manifest.json"
        prompt_manifest = json.loads(prompt_manifest_path.read_text(encoding="utf-8"))
        prompt_manifest.update(
            {
                "version": "1.0.0",
                "system_prompt": "system-v1.md",
                "task_prompt": "task-v1.md",
                "critic_prompt": "critic-v1.md",
                "schema": f"../../schemas/{page_id}-output.schema.json",
                "eval": f"../../evals/{page_id}-eval.json",
            }
        )
        write_json(prompt_manifest_path, prompt_manifest)

    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    shutil.copytree(SOURCE, PUBLIC)
    ARCHIVE.unlink(missing_ok=True)
    with zipfile.ZipFile(ARCHIVE, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(PUBLIC.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(PUBLIC))
    print(f"career page contracts synchronized: {len(PAGE_IDS)} pages")


if __name__ == "__main__":
    main()
