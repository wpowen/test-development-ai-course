/**
 * Shared visual design system for the course SVG generators.
 *
 * Every generated diagram reads from this single source so the palettes,
 * typography and node language stay consistent with the site theme
 * (forest / lime / warm paper) while still carrying the maturity boundary
 * required by the project's fail-closed gates.
 */

export const tokens = {
  // Canvas
  paper: "#fbfaf6",
  canvas: "#f3f1e9",
  white: "#ffffff",

  // Brand
  forest: "#174a3a",
  deep: "#0e3026",
  lime: "#93bd2c",
  limeDark: "#5f7d16",

  // Node tones (neutral)
  mint: "#edf5f0",
  sage: "#c2d9cc",
  cream: "#f7f4e9",
  sand: "#e8dfc5",

  // Semantic tones
  amber: "#a96a18",
  amberFill: "#fdf1d8",
  red: "#b2402f",
  redFill: "#fbe9e5",
  blue: "#355f96",
  blueFill: "#eaf1fa",
  purple: "#6a49a8",
  purpleFill: "#f0ecfb",

  // Text
  ink: "#1c2924",
  muted: "#5f6c66",
  soft: "#85908a",
  onDark: "#d9e8e0",
  onDarkMuted: "#9db7ab",

  // Structure
  line: "#d9ded9",
};

export const sans = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  '"PingFang SC"',
  '"Hiragino Sans GB"',
  '"Microsoft YaHei"',
  "sans-serif",
].join(",");

export const mono = [
  "ui-monospace",
  "SFMono-Regular",
  "Menlo",
  "Consolas",
  "monospace",
].join(",");

/** Escape text for safe inclusion in XML/SVG attributes and text nodes. */
export const xml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const charWidth = (char) => (/[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(char) ? 1 : 0.58);

/** Wrap a string to a maximum visual width, returning an array of lines. */
export const wrap = (value, maxWidth, maxLines = 3) => {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return [""];
  const chars = [...text];
  const lines = [];
  let current = "";
  let width = 0;
  for (const char of chars) {
    const nextWidth = width + charWidth(char);
    if (nextWidth > maxWidth && current) {
      lines.push(current);
      current = char;
      width = charWidth(char);
    } else {
      current += char;
      width = nextWidth;
    }
    if (lines.length === maxLines - 1 && [...current].length) {
      // Keep packing into the final allowed line and ellipsize later.
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    const last = kept[maxLines - 1].replace(/.{1,2}$/u, "…");
    kept[maxLines - 1] = last;
    return kept;
  }
  return lines;
};

/** Common defs: shadows and arrow markers in every semantic tone. */
export const defs = () => `
  <defs>
    <filter id="ds-soft" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#0e3026" flood-opacity="0.08"/>
    </filter>
    <filter id="ds-strong" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#0e3026" flood-opacity="0.13"/>
    </filter>
    <marker id="ds-arw-forest" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="${tokens.forest}"/>
    </marker>
    <marker id="ds-arw-amber" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="${tokens.amber}"/>
    </marker>
    <marker id="ds-arw-red" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="${tokens.red}"/>
    </marker>
    <marker id="ds-arw-soft" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="${tokens.soft}"/>
    </marker>
  </defs>`;

/** Base stylesheet shared by every generated diagram. */
export const css = () => `
    .ds-bg{fill:${tokens.paper}}
    .ds-header{fill:url(#ds-header-grad)}
    .ds-eyebrow{font:700 11px ${mono};letter-spacing:.16em;fill:${tokens.lime}}
    .ds-title{font:800 26px ${sans};fill:${tokens.white}}
    .ds-subtitle{font:500 13px ${sans};fill:${tokens.onDark}}
    .ds-source{font:500 10.5px ${mono};fill:${tokens.onDarkMuted}}
    .ds-section{font:800 11px ${mono};letter-spacing:.12em;fill:${tokens.forest}}
    .ds-foot{font:500 11px ${sans};fill:${tokens.muted}}
    .ds-footbadge{font:800 10px ${mono};letter-spacing:.1em;fill:${tokens.amber}}
    .ds-node rect{stroke-width:1.4}
    .ds-node-title{font:800 13.5px ${sans};fill:${tokens.ink}}
    .ds-node-detail{font:500 10.5px ${sans};fill:${tokens.muted}}
    .ds-node-index{font:800 10px ${mono};fill:${tokens.soft}}
    .ds-edge{fill:none;stroke:${tokens.forest};stroke-width:2}
    .ds-edge-label{font:600 9.5px ${sans};fill:${tokens.muted};paint-order:stroke;stroke:${tokens.paper};stroke-width:4px}
    .ds-legend{font:500 10px ${sans};fill:${tokens.muted}}
`;

/** Header gradient used by every diagram. */
export const headerDef = () => `
    <linearGradient id="ds-header-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${tokens.deep}"/>
      <stop offset="1" stop-color="${tokens.forest}"/>
    </linearGradient>`;

/**
 * Render the standard header band.
 * height is the band height; title/subtitle/source are placed inside it.
 */
export const header = ({ width, height, eyebrow, title, subtitle, source }) => {
  const titleMax = Math.max(20, Math.floor((width - 72) / 27));
  const subtitleMax = Math.max(18, Math.floor((width - 620) / 6.6));
  const titleText = wrap(title, titleMax, 1)[0];
  const subtitleText = wrap(subtitle, subtitleMax, 1)[0];
  return `
  <rect class="ds-header" x="0" y="0" width="${width}" height="${height}" rx="22"/>
  <rect class="ds-header" x="0" y="${height - 22}" width="${width}" height="22"/>
  <text class="ds-eyebrow" x="36" y="32">${xml(eyebrow)}</text>
  <text class="ds-subtitle" x="${width - 36}" y="32" text-anchor="end">${xml(subtitleText)}</text>
  <text class="ds-title" x="36" y="74">${xml(titleText)}</text>
  <text class="ds-source" x="36" y="${height + 22}">${xml(source)}</text>`;
};

/**
 * Render a rounded node card.
 * tone selects fill/stroke; index is the numeric badge.
 */
export const node = ({ x, y, width, height, title, detail, index, tone = "mint", highlight = false }) => {
  const fill = {
    mint: tokens.mint,
    cream: tokens.cream,
    amber: tokens.amberFill,
    red: tokens.redFill,
    blue: tokens.blueFill,
    purple: tokens.purpleFill,
  }[tone] ?? tokens.mint;
  const stroke = {
    mint: tokens.sage,
    cream: tokens.sand,
    amber: "#e0b76a",
    red: "#e3a89f",
    blue: "#aec6e3",
    purple: "#c9b8ea",
  }[tone] ?? tokens.sage;
  const titleLines = wrap(title, Math.max(8, Math.floor((width - 30) / 9)), 2);
  const detailLines = wrap(detail, Math.max(8, Math.floor((width - 30) / 10.5)), 2);
  const badge = index != null
    ? `<circle cx="${x + 18}" cy="${y + 18}" r="11" fill="${highlight ? tokens.forest : tokens.white}" stroke="${stroke}" stroke-width="1.4"/>
       <text class="ds-node-index" x="${x + 18}" y="${y + 21}" text-anchor="middle" ${highlight ? `fill="${tokens.white}"` : ""}>${String(index).padStart(2, "0")}</text>`
    : "";
  const titleY = y + (index != null ? 48 : 34);
  const titleText = titleLines.map((line, lineIndex) =>
    `<text class="ds-node-title" x="${x + 15}" y="${titleY + lineIndex * 17}">${xml(line)}</text>`).join("");
  const detailText = detailLines.map((line, lineIndex) =>
    `<text class="ds-node-detail" x="${x + 15}" y="${titleY + titleLines.length * 17 - 2 + lineIndex * 14}">${xml(line)}</text>`).join("");
  return `
    <g class="ds-node" filter="${highlight ? "url(#ds-strong)" : "url(#ds-soft)"}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="14" fill="${fill}" stroke="${stroke}"${highlight ? ' stroke-width="2"' : ""}/>
      ${highlight ? `<rect x="${x}" y="${y}" width="6" height="${height}" rx="3" fill="${tokens.lime}"/>` : ""}
      ${badge}
      ${titleText}
      ${detailText}
    </g>`;
};

/** Render a directed edge with an optional label. */
export const edge = ({ x1, y1, x2, y2, label = "", tone = "forest", dashed = false, curve = 0 }) => {
  const marker = {
    forest: "ds-arw-forest",
    amber: "ds-arw-amber",
    red: "ds-arw-red",
    soft: "ds-arw-soft",
  }[tone] ?? "ds-arw-forest";
  const stroke = {
    forest: tokens.forest,
    amber: tokens.amber,
    red: tokens.red,
    soft: tokens.soft,
  }[tone] ?? tokens.forest;
  const path = curve
    ? `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;
  const labelText = label
    ? `<text class="ds-edge-label" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 6}" text-anchor="middle">${xml(label)}</text>`
    : "";
  return `
    <path d="${path}" fill="none" stroke="${stroke}" stroke-width="2"${dashed ? ' stroke-dasharray="6 5"' : ""} marker-end="url(#${marker})"/>
    ${labelText}`;
};

/** Render the standard evidence-boundary footer. */
export const footer = ({ width, height, badge = "证据边界", text }) => `
  <rect x="28" y="${height - 74}" width="${width - 56}" height="46" rx="12" fill="${tokens.amberFill}" stroke="#e3c07b" stroke-width="1.2"/>
  <text class="ds-footbadge" x="46" y="${height - 48}">${xml(badge)}</text>
  <text class="ds-foot" x="46" y="${height - 26}">${xml(text)}</text>`;

/** A small caption/legend line under the content area. */
export const legend = ({ x, y, items }) => items.map((item, index) => {
  const gap = 14 + (index === 0 ? 0 : items.slice(0, index).reduce((sum, prev) => sum + prev.label.length * 6.2 + 26, 0));
  return `<circle cx="${x + 6 + gap}" cy="${y - 4}" r="4" fill="${item.color}"/><text class="ds-legend" x="${x + 16 + gap}" y="${y}">${xml(item.label)}</text>`;
}).join("");
