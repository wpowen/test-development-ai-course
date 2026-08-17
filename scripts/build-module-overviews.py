#!/usr/bin/env python3
"""把模块概览从单一来源投影成站点 TS 模块和全景 SVG。

用法：
    python3 scripts/build-module-overviews.py

## 这一层解决什么

改造前站点只有两级：侧栏列出 13 个模块，点进去直接是某一页的细节。
模块本身没有落点——读者看不到「这个模块由哪几段组成、每段交出什么、
它们为什么是这个顺序」，只能靠逐页读完自己拼。

这个生成器补的是「总」这一层：每个模块一张全景图（阶段流 + 每段的出口工件），
外加架构思路、阶段导览与边界声明。读者先看全景再进细节。

## 为什么是生成的

阶段里写的 page_id 必须真的存在、必须属于本模块、且本模块每一页都必须
出现在某个阶段里。这三条如果靠人维护，加一页忘了改概览就会静默漂移——
和页面层「架构图节点必须被正文引用」是同一个机制。校验在
site/scripts/validate-content.ts 里执行，这里只负责投影。

SVG 复用 scripts/svg_design_system.py，与 103 张页面级图同一套视觉语言。
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from svg_design_system import (  # noqa: E402
    MONO, SANS, TOKENS, css, defs, edge, footer, header, legend, node, wrap, xml,
)

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE = ROOT / "methodology" / "module-overviews.json"
TS_OUT = ROOT / "site" / "content" / "module-overviews.ts"
SVG_DIR = ROOT / "site" / "public" / "visuals" / "modules"

# 全景图排版：每行最多 4 段，段宽固定，行高含出口工件与控制问题。
COLUMNS = 4
NODE_W = 258
NODE_H = 124
GAP_X = 26
GAP_Y = 46
MARGIN = 32
HEADER_H = 104


def module_titles() -> dict[str, tuple[str, str]]:
    """从站点 course.ts 取模块标题，避免概览里再抄一份会过期的副本。"""
    script = (
        'import {modules} from "./content/course.ts";'
        'console.log(JSON.stringify(Object.fromEntries('
        '(modules as any[]).map(m=>[m.id,[m.title,m.subtitle]]))));'
    )
    out = subprocess.run(
        ["npx", "tsx", "-e", script], cwd=ROOT / "site",
        capture_output=True, text=True, check=True,
    ).stdout
    line = [ln for ln in out.splitlines() if ln.startswith("{")][-1]
    return json.loads(line)


def page_titles() -> dict[str, str]:
    script = (
        'import {pages} from "./content/course.ts";'
        'console.log(JSON.stringify(Object.fromEntries('
        '(pages as any[]).map(p=>[p.id,p.title]))));'
    )
    out = subprocess.run(
        ["npx", "tsx", "-e", script], cwd=ROOT / "site",
        capture_output=True, text=True, check=True,
    ).stdout
    line = [ln for ln in out.splitlines() if ln.startswith("{")][-1]
    return json.loads(line)


def render_svg(module_id: str, title: str, subtitle: str, spec: dict) -> str:
    """全景图：阶段按流程排布，每段显示序号、名称、出口工件。"""
    stages = spec["stages"]
    rows = (len(stages) + COLUMNS - 1) // COLUMNS
    width = MARGIN * 2 + COLUMNS * NODE_W + (COLUMNS - 1) * GAP_X
    height = HEADER_H + MARGIN + rows * NODE_H + (rows - 1) * GAP_Y + 108

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t d" '
        f'viewBox="0 0 {width} {height}" width="{width}" height="{height}">',
        f'  <title id="t">{xml(title)}：模块全景</title>',
        f'  <desc id="d">{xml(spec["thesis"])}</desc>',
        defs(), f"  <style>{css()}</style>",
        f'  <rect class="ds-bg" x="0" y="0" width="{width}" height="{height}" rx="22"/>',
        header(width, HEADER_H, module_id, title, subtitle, spec["thesis"]),
    ]

    positions = []
    for index, stage in enumerate(stages):
        row, col = divmod(index, COLUMNS)
        x = MARGIN + col * (NODE_W + GAP_X)
        y = HEADER_H + MARGIN + row * (NODE_H + GAP_Y)
        positions.append((x, y))
        # 出口工件是这一段对下游的承诺，比阶段名更有信息量，放在 detail 位。
        parts.append(node(
            x, y, NODE_W, NODE_H,
            stage["name"], f'→ {stage["output"]}',
            index=index + 1, tone="mint",
            highlight=(index == 0 or index == len(stages) - 1),
        ))
        # 控制问题单独一行，它是读者判断「这一段跟我有没有关系」的最快依据。
        for line_no, line in enumerate(wrap(stage["question"], 26, 2)):
            parts.append(
                f'<text class="ds-node-detail" x="{x + 15}" y="{y + NODE_H - 26 + line_no * 14}" '
                f'fill="{TOKENS["muted"]}">{xml(line)}</text>'
            )

    for index in range(len(stages) - 1):
        (x1, y1), (x2, y2) = positions[index], positions[index + 1]
        if y1 == y2:
            parts.append(edge(x1 + NODE_W, y1 + NODE_H // 2, x2 - 6, y2 + NODE_H // 2))
        else:
            # 换行：从本行末尾绕到下一行开头，虚线表示视觉换行而非新的依赖。
            parts.append(edge(x1 + NODE_W // 2, y1 + NODE_H,
                              x2 + NODE_W // 2, y2 - 6, tone="soft", dashed=True, curve=40))

    parts.append(legend(MARGIN, height - 92, [
        {"label": "阶段顺序不可交换", "color": TOKENS["forest"]},
        {"label": "→ 后为该段出口工件", "color": TOKENS["lime"]},
    ]))
    parts.append(footer(width, height, "；".join(spec["boundary"][:2]), badge="模块边界"))
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def ts_literal(value) -> str:
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list):
        return "[" + ", ".join(ts_literal(item) for item in value) + "]"
    if isinstance(value, dict):
        return "{ " + ", ".join(f"{key}: {ts_literal(val)}" for key, val in value.items()) + " }"
    raise TypeError(type(value))


def render_ts(source: dict, titles: dict[str, str]) -> str:
    lines = [
        "// 生成产物，请勿手改。",
        "// 改内容请改 methodology/module-overviews.json 后重跑",
        "// python3 scripts/build-module-overviews.py",
        "",
        "export type ModuleStage = {",
        "  name: string;",
        "  pages: string[];",
        "  output: string;",
        "  question: string;",
        "};",
        "",
        "export type ModuleOverview = {",
        "  /** 一句话主张，作为模块页的 lead。 */",
        "  thesis: string;",
        "  /** 架构逻辑与思路，2–3 段。 */",
        "  logic: string[];",
        "  /** 全景阶段，顺序即流程顺序。 */",
        "  stages: ModuleStage[];",
        "  /** 这个模块不负责什么。 */",
        "  boundary: string[];",
        "  /** 模块全景 SVG，与 stages 同源生成。 */",
        "  panorama: { src: string; alt: string };",
        "};",
        "",
        "export const moduleOverviews: Record<string, ModuleOverview> = {",
    ]
    for module_id, spec in source.items():
        alt = (f"{titles[module_id]}模块全景：{len(spec['stages'])} 个阶段依次为 "
               + "、".join(stage["name"] for stage in spec["stages"])
               + "，每段标注出口工件与控制问题。")
        payload = {
            "thesis": spec["thesis"],
            "logic": spec["logic"],
            "stages": spec["stages"],
            "boundary": spec["boundary"],
            "panorama": {"src": f"visuals/modules/{module_id}.svg", "alt": alt},
        }
        lines.append(f"  {json.dumps(module_id, ensure_ascii=False)}: {{")
        for key, value in payload.items():
            if key == "stages":
                lines.append("    stages: [")
                for stage in value:
                    lines.append(f"      {ts_literal(stage)},")
                lines.append("    ],")
            elif key in ("logic", "boundary"):
                lines.append(f"    {key}: [")
                for item in value:
                    lines.append(f"      {json.dumps(item, ensure_ascii=False)},")
                lines.append("    ],")
            else:
                lines.append(f"    {key}: {ts_literal(value)},")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    meta = module_titles()

    missing = [module_id for module_id in meta if module_id not in source]
    if missing:
        print(f"这些模块还没有概览：{', '.join(missing)}", file=sys.stderr)
        return 1

    SVG_DIR.mkdir(parents=True, exist_ok=True)
    titles = {module_id: meta[module_id][0] for module_id in source}
    for module_id, spec in source.items():
        title, subtitle = meta[module_id]
        (SVG_DIR / f"{module_id}.svg").write_text(
            render_svg(module_id, title, subtitle, spec), encoding="utf-8")

    TS_OUT.write_text(render_ts(source, titles), encoding="utf-8")
    stages = sum(len(spec["stages"]) for spec in source.values())
    print(f"模块概览已生成：{len(source)} 个模块，{stages} 个阶段，"
          f"{len(source)} 张全景 SVG → {SVG_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
