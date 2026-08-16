"""Shared visual design system for the Python SVG generators.

Mirrors ``scripts/visual-design-system.mjs`` so career and methodology
diagrams stay on the same palette, type scale and boundary language as the
Node-generated page and Agent diagrams.
"""

from __future__ import annotations

import re
from html import escape as _xml_escape


TOKENS = {
    "paper": "#fbfaf6",
    "canvas": "#f3f1e9",
    "white": "#ffffff",
    "forest": "#174a3a",
    "deep": "#0e3026",
    "lime": "#93bd2c",
    "limeDark": "#5f7d16",
    "mint": "#edf5f0",
    "sage": "#c2d9cc",
    "cream": "#f7f4e9",
    "sand": "#e8dfc5",
    "amber": "#a96a18",
    "amberFill": "#fdf1d8",
    "red": "#b2402f",
    "redFill": "#fbe9e5",
    "blue": "#355f96",
    "blueFill": "#eaf1fa",
    "purple": "#6a49a8",
    "purpleFill": "#f0ecfb",
    "ink": "#1c2924",
    "muted": "#5f6c66",
    "soft": "#85908a",
    "onDark": "#d9e8e0",
    "onDarkMuted": "#9db7ab",
    "line": "#d9ded9",
}

SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"
MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"


def xml(value) -> str:
    return _xml_escape(str(value if value is not None else ""), quote=True)


_CJK = re.compile(r"[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]")


def _char_width(char: str) -> float:
    return 1.0 if _CJK.match(char) else 0.58


def wrap(value, max_width: int, max_lines: int = 3):
    text = re.sub(r"\s+", " ", str(value if value is not None else "")).strip()
    if not text:
        return [""]
    lines = []
    current = ""
    width = 0.0
    for char in text:
        next_width = width + _char_width(char)
        if next_width > max_width and current:
            lines.append(current)
            current = char
            width = _char_width(char)
        else:
            current += char
            width = next_width
    if current:
        lines.append(current)
    if len(lines) > max_lines:
        kept = lines[:max_lines]
        kept[max_lines - 1] = kept[max_lines - 1][:-1] + "…"
        return kept
    return lines


def defs() -> str:
    return f"""
  <defs>
    <filter id="ds-soft" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#0e3026" flood-opacity="0.08"/>
    </filter>
    <filter id="ds-strong" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#0e3026" flood-opacity="0.13"/>
    </filter>
    <linearGradient id="ds-header-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="{TOKENS['deep']}"/>
      <stop offset="1" stop-color="{TOKENS['forest']}"/>
    </linearGradient>
    <marker id="ds-arw-forest" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="{TOKENS['forest']}"/></marker>
    <marker id="ds-arw-amber" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="{TOKENS['amber']}"/></marker>
    <marker id="ds-arw-red" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="{TOKENS['red']}"/></marker>
    <marker id="ds-arw-soft" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="{TOKENS['soft']}"/></marker>
  </defs>"""


def css() -> str:
    return f"""
    .ds-bg{{fill:{TOKENS['paper']}}}
    .ds-header{{fill:url(#ds-header-grad)}}
    .ds-eyebrow{{font:700 11px {MONO};letter-spacing:.16em;fill:{TOKENS['lime']}}}
    .ds-title{{font:800 26px {SANS};fill:{TOKENS['white']}}}
    .ds-subtitle{{font:500 13px {SANS};fill:{TOKENS['onDark']}}}
    .ds-source{{font:500 10.5px {MONO};fill:{TOKENS['onDarkMuted']}}}
    .ds-section{{font:800 11px {MONO};letter-spacing:.12em;fill:{TOKENS['forest']}}}
    .ds-foot{{font:500 11px {SANS};fill:{TOKENS['muted']}}}
    .ds-footbadge{{font:800 10px {MONO};letter-spacing:.1em;fill:{TOKENS['amber']}}}
    .ds-node rect{{stroke-width:1.4}}
    .ds-node-title{{font:800 13.5px {SANS};fill:{TOKENS['ink']}}}
    .ds-node-detail{{font:500 10.5px {SANS};fill:{TOKENS['muted']}}}
    .ds-node-index{{font:800 10px {MONO};fill:{TOKENS['soft']}}}
    .ds-edge{{fill:none;stroke:{TOKENS['forest']};stroke-width:2}}
    .ds-edge-label{{font:600 9.5px {SANS};fill:{TOKENS['muted']};paint-order:stroke;stroke:{TOKENS['paper']};stroke-width:4px}}
    .ds-legend{{font:500 10px {SANS};fill:{TOKENS['muted']}}}
"""


_TONE_FILL = {
    "mint": ("#edf5f0", "#c2d9cc"),
    "cream": ("#f7f4e9", "#e8dfc5"),
    "amber": ("#fdf1d8", "#e0b76a"),
    "red": ("#fbe9e5", "#e3a89f"),
    "blue": ("#eaf1fa", "#aec6e3"),
    "purple": ("#f0ecfb", "#c9b8ea"),
}


def header(width: int, height: int, eyebrow: str, title: str, subtitle: str, source: str) -> str:
    title_max = max(20, int((width - 72) / 27))
    subtitle_max = max(18, int((width - 620) / 6.6))
    title_text = wrap(title, title_max, 1)[0]
    subtitle_text = wrap(subtitle, subtitle_max, 1)[0]
    return f"""
  <rect class="ds-header" x="0" y="0" width="{width}" height="{height}" rx="22"/>
  <rect class="ds-header" x="0" y="{height - 22}" width="{width}" height="22"/>
  <text class="ds-eyebrow" x="36" y="32">{xml(eyebrow)}</text>
  <text class="ds-subtitle" x="{width - 36}" y="32" text-anchor="end">{xml(subtitle_text)}</text>
  <text class="ds-title" x="36" y="74">{xml(title_text)}</text>
  <text class="ds-source" x="36" y="{height + 22}">{xml(source)}</text>"""


def node(x: int, y: int, width: int, height: int, title: str, detail: str = "", index=None, tone: str = "mint", highlight: bool = False) -> str:
    fill, stroke = _TONE_FILL.get(tone, _TONE_FILL["mint"])
    title_lines = wrap(title, max(8, int((width - 30) / 9)), 2)
    detail_lines = wrap(detail, max(8, int((width - 30) / 10.5)), 2)
    badge = ""
    if index is not None:
        badge_fill = TOKENS["forest"] if highlight else TOKENS["white"]
        badge_text_fill = TOKENS["white"] if highlight else TOKENS["soft"]
        badge = f'''<circle cx="{x + 18}" cy="{y + 18}" r="11" fill="{badge_fill}" stroke="{stroke}" stroke-width="1.4"/>
       <text class="ds-node-index" x="{x + 18}" y="{y + 21}" text-anchor="middle" fill="{badge_text_fill}">{index:02d}</text>'''
    title_y = y + (48 if index is not None else 34)
    title_text = "".join(
        f'<text class="ds-node-title" x="{x + 15}" y="{title_y + i * 17}">{xml(line)}</text>'
        for i, line in enumerate(title_lines)
    )
    detail_text = "".join(
        f'<text class="ds-node-detail" x="{x + 15}" y="{title_y + len(title_lines) * 17 - 2 + i * 14}">{xml(line)}</text>'
        for i, line in enumerate(detail_lines)
    )
    stroke_attr = ' stroke-width="2"' if highlight else ""
    accent = f'<rect x="{x}" y="{y}" width="6" height="{height}" rx="3" fill="{TOKENS["lime"]}"/>' if highlight else ""
    filter_attr = 'url(#ds-strong)' if highlight else 'url(#ds-soft)'
    return f"""
    <g class="ds-node" filter="{filter_attr}">
      <rect x="{x}" y="{y}" width="{width}" height="{height}" rx="14" fill="{fill}" stroke="{stroke}"{stroke_attr}/>
      {accent}
      {badge}
      {title_text}
      {detail_text}
    </g>"""


def edge(x1: int, y1: int, x2: int, y2: int, label: str = "", tone: str = "forest", dashed: bool = False, curve: int = 0) -> str:
    marker = {"forest": "ds-arw-forest", "amber": "ds-arw-amber", "red": "ds-arw-red", "soft": "ds-arw-soft"}.get(tone, "ds-arw-forest")
    stroke = {"forest": TOKENS["forest"], "amber": TOKENS["amber"], "red": TOKENS["red"], "soft": TOKENS["soft"]}.get(tone, TOKENS["forest"])
    path = f"M {x1} {y1} C {x1 + curve} {y1}, {x2 - curve} {y2}, {x2} {y2}" if curve else f"M {x1} {y1} L {x2} {y2}"
    dash = ' stroke-dasharray="6 5"' if dashed else ""
    label_text = f'<text class="ds-edge-label" x="{(x1 + x2) // 2}" y="{(y1 + y2) // 2 - 6}" text-anchor="middle">{xml(label)}</text>' if label else ""
    return f"""
    <path d="{path}" fill="none" stroke="{stroke}" stroke-width="2"{dash} marker-end="url(#{marker})"/>
    {label_text}"""


def footer(width: int, height: int, text: str, badge: str = "证据边界") -> str:
    return f"""
  <rect x="28" y="{height - 74}" width="{width - 56}" height="46" rx="12" fill="{TOKENS['amberFill']}" stroke="#e3c07b" stroke-width="1.2"/>
  <text class="ds-footbadge" x="46" y="{height - 48}">{xml(badge)}</text>
  <text class="ds-foot" x="46" y="{height - 26}">{xml(text)}</text>"""


def legend(x: int, y: int, items) -> str:
    parts = []
    offset = 0
    for item in items:
        label = item["label"]
        parts.append(
            f'<circle cx="{x + 6 + offset}" cy="{y - 4}" r="4" fill="{item["color"]}"/>'
            f'<text class="ds-legend" x="{x + 16 + offset}" y="{y}">{xml(label)}</text>'
        )
        offset += int(len(label) * 6.2 + 26)
    return "".join(parts)
