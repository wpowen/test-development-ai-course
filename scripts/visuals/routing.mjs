/** Typography and semantic-edge routing shared by the SVG renderer. */
const OPEN = /[（【《〈〔〖「『“‘([{]$/u;
const CLOSE = /^[，。、；：？！）】》〉〕〗」』”’％%.,:;!?\])}]/u;
const HAN = /\p{Script=Han}/gu;

/** Keep English identifier components intact; '-' and '/' are semantic breaks. */
export function wrapText(value, width, size, measure) {
  const output = [];
  for (const paragraph of String(value ?? '').split('\n')) {
    const units = paragraph.match(/[A-Za-z0-9_@.:%+^=<>#{}\x5b\x5d]+[-/]?|\s+|./gu) ?? [];
    if (!units.length) { output.push(''); continue; }
    const costs = Array(units.length + 1).fill(Infinity), next = [];
    costs[units.length] = 0;
    for (let i = units.length - 1; i >= 0; i--) {
      let line = '', found = false;
      for (let j = i; j < units.length; j++) {
        line += units[j];
        const trimmed = line.trim();
        if (!trimmed) continue;
        const after = units.slice(j + 1).find(unit => unit.trim()) ?? '';
        if (OPEN.test(trimmed) || CLOSE.test(after)) continue;
        const length = measure(trimmed, size);
        if (length > width && found) break;
        const oneHan = (trimmed.match(HAN)?.length ?? 0) === 1 && !/[A-Za-z0-9]/.test(trimmed)
          && (paragraph.match(HAN)?.length ?? 0) > 1;
        if (oneHan && (j === units.length - 1 || width < measure('中文', size))) continue;
        const slack = Math.max(0, width - length);
        const cost = 1000 + slack * slack * (j === units.length - 1 ? 0.0002 : 0.002)
          + (oneHan ? 20_000 : 0) + Math.max(0, length - width) ** 2 + costs[j + 1];
        if (cost < costs[i]) { costs[i] = cost; next[i] = j + 1; }
        found = Number.isFinite(costs[i]);
        if (length > width && found) break; // An indivisible word may exceed a caller's budget.
      }
    }
    let cursor = 0;
    while (cursor < units.length) {
      const end = next[cursor] ?? units.length;
      const line = units.slice(cursor, end).join('').trim();
      if (line) output.push(line);
      cursor = end;
    }
  }
  return output.length ? output : [''];
}

export function dimensionsFor(spec, wrap, measure) {
  return new Map(spec.nodes.map(node => {
    const w = 354;
    const titles = wrap(node.title, w - 44, 28);
    const body = node.body.flatMap(text => wrap(text, w - 44, 23));
    const intrinsic = Math.max(...titles.map(text => measure(text, 28)), ...body.map(text => measure(text, 23)));
    return [node.id, {w: Math.max(w, intrinsic + 44), h: Math.max(170, 90 + titles.length * 39 + body.length * 34), titles, body}];
  }));
}

export function createDotSource(spec, dimensions, rankInput, wrap, measure) {
  const q = JSON.stringify;
  const ranks = rankInput.map(row => [...row]);
  const assigned = new Set(ranks.flat());
  for (const node of spec.nodes) if (!assigned.has(node.id)) ranks.push([node.id]);
  const rank = new Map(ranks.flatMap((row, i) => row.map((id, j) => [id, {i, j}])));
  const ports = new Map(spec.nodes.map(node => [node.id, {n: [], e: [], s: [], w: []}]));
  const edgePorts = spec.edges.map((edge, index) => {
    const a = rank.get(edge.from), b = rank.get(edge.to);
    let tail, head;
    if (a.i === b.i) {
      [tail, head] = a.j < b.j ? ['e', 'w'] : ['s', 's'];
    } else if (a.i < b.i) [tail, head] = ['s', 'n'];
    else [tail, head] = ['w', 'w'];
    const from = `e${index}t`, to = `e${index}h`;
    ports.get(edge.from)[tail].push(from); ports.get(edge.to)[head].push(to);
    return {from, to, tail, head, forward: a.i < b.i};
  });
  let dot = 'digraph G { graph [rankdir=TB, splines=spline, overlap=false, newrank=true, nodesep=0.55, ranksep=1.10, pad=0.05, margin=0]; node [shape=plain]; edge [arrowsize=0.8, penwidth=2.6];\n';
  for (const node of spec.nodes) {
    const m = dimensions.get(node.id), p = ports.get(node.id);
    const columns = Math.max(1, p.n.length, p.s.length) + 2, rows = Math.max(1, p.w.length, p.e.length) + 2;
    let table = `<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="0" WIDTH="${m.w}" HEIGHT="${m.h}" FIXEDSIZE="TRUE">`;
    for (let row = 0; row < rows; row++) {
      table += '<TR>';
      for (let col = 0; col < columns; col++) {
        const port = row === 0 ? p.n[col - 1] : row === rows - 1 ? p.s[col - 1]
          : col === 0 ? p.w[row - 1] : col === columns - 1 ? p.e[row - 1] : undefined;
        table += `<TD${port ? ` PORT="${port}"` : ''} WIDTH="${m.w / columns}" HEIGHT="${m.h / rows}" FIXEDSIZE="TRUE"><FONT POINT-SIZE="1"> </FONT></TD>`;
      }
      table += '</TR>';
    }
    dot += `${q(node.id)} [label=<${table}</TABLE>>];\n`;
  }
  for (const [rowIndex, row] of ranks.entries()) {
    dot += `__rank${rowIndex} [label="",shape=point,width=0,height=0,style=invis];\n`;
    dot += `{rank=same; __rank${rowIndex}; ${row.map(q).join(';')};}\n`;
    if(rowIndex) dot += `__rank${rowIndex-1} -> __rank${rowIndex} [style=invis,weight=100,minlen=1];\n`;
    for (let i = 1; i < row.length; i++) dot += `${q(row[i - 1])} -> ${q(row[i])} [style=invis, weight=100];\n`;
  }
  for (const [index, edge] of spec.edges.entries()) {
    const port = edgePorts[index];
    const lines = wrap(edge.label || '', 238, 21);
    const w = Math.ceil(Math.max(1, ...lines.map(line => measure(line, 21))) + 24), h = lines.length * 32 + 10;
    const label = `<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="0"><TR><TD WIDTH="${w}" HEIGHT="${h}" FIXEDSIZE="TRUE"><FONT POINT-SIZE="1"> </FONT></TD></TR></TABLE>`;
    dot += `${q(edge.from)} -> ${q(edge.to)} [id="e${index}", tailport="${port.from}:${port.tail}", headport="${port.to}:${port.head}", label=<${label}>, constraint=${port.forward}, weight=${port.forward ? 4 : 0}];\n`;
  }
  return dot + '}';
}

/** Graphviz can report success while pathplan silently omits a spline. */
function hasCompleteSemanticPaths(graph, spec) {
  if (!Array.isArray(graph.edges) || !Array.isArray(graph.objects)) return false;
  const edges = graph.edges.filter(edge => edge.id !== undefined);
  if (edges.length !== spec.edges.length) return false;
  const names = new Map(graph.objects.map(object => [object._gvid, object.name]));
  const seen = new Set();
  for (const edge of edges) {
    if (!/^e(0|[1-9]\d*)$/.test(edge.id) || seen.has(edge.id)) return false;
    seen.add(edge.id);
    const semantic = spec.edges[Number(edge.id.slice(1))];
    if (!semantic || names.get(edge.tail) !== semantic.from || names.get(edge.head) !== semantic.to) return false;
    const curves = edge._draw_?.filter(draw => draw.op === 'b') ?? [];
    // One emitted SVG path per semantic edge, with complete cubic segments.
    if (curves.length !== 1) return false;
    const points = curves[0].points;
    if (!Array.isArray(points) || points.length < 4 || (points.length - 1) % 3 !== 0
      || !points.every(point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite))) return false;
  }
  return spec.edges.every((_, index) => seen.has(`e${index}`));
}

export async function renderRoutedGraph(c, spec, y, viz, tools) {
  const {wrap, widthOf: measure, palette, colors, esc, labelName, dotSource} = tools;
  const dimensions = dimensionsFor(spec, wrap, measure);
  if (spec.routing === 'outer-rails') return renderRailGraph(c, spec, y, dimensions, tools);
  const result = viz.render(dotSource(dimensions), {format: 'json', engine: 'dot'});
  if (result.status !== 'success' || Object.keys(result.errors ?? {}).length) return renderRailGraph(c, spec, y, dimensions, tools);
  const graph = JSON.parse(result.output);
  if (!hasCompleteSemanticPaths(graph, spec)) return renderRailGraph(c, spec, y, dimensions, tools);
  const [, , bw, bh] = graph.bb.split(',').map(Number);
  const scale = Math.min(1, 1400 / (bw + 24));
  const repeatedDirection = spec.edges.some((edge, i) => spec.edges.some((other, j) => i !== j
    && ((edge.from === other.to && edge.to === other.from) || (edge.from === other.from && edge.to === other.to))));
  const rectangles = graph.objects.filter(object => dimensions.has(object.name)).map(object => {
    const [x, cy] = object.pos.split(',').map(Number), m = dimensions.get(object.name);
    return {x: x - m.w / 2, y: bh - cy - m.h / 2, w: m.w, h: m.h};
  });
  const labelRects = [];
  const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  let labelCollision = false;
  for (const edge of graph.edges ?? []) {
    if (!/^e\d+$/.test(edge.id) || !edge.lp) continue;
    const semantic = spec.edges[Number(edge.id.slice(1))];
    const lines = wrap(semantic.label || '', 238, 21), [x, cy] = edge.lp.split(',').map(Number);
    const w = Math.max(1, ...lines.map(line => measure(line, 21))) + 24, h = lines.length * 32 + 10;
    const box = {x: x - w / 2, y: bh - cy - h / 2, w, h};
    if ([...rectangles, ...labelRects].some(other => intersects(box, other))) labelCollision = true;
    labelRects.push(box);
  }
  if (scale < 0.78 || repeatedDirection || labelCollision) return renderRailGraph(c, spec, y, dimensions, tools);
  const height = (bh + 32) * scale + 160;
  c.region('system-graph', 64, y, 1472, height);
  c.text(88, y + 42, 'A', 20, colors.input, 800, 'class="mono"');
  c.text(122, y + 42, spec.focus || labelName || '系统与关系', 25, colors.ink, 700);
  c.text(88, y + 77, labelName || '显式关系图', 18, colors.muted, 550);
  c.add(`<g transform="translate(${800 - bw * scale / 2} ${y + 116}) scale(${scale})" data-graph-scale="${scale}" data-routing="dot">`);
  const coord = ([x, yy]) => [x, bh - yy];
  for (const edge of graph.edges ?? []) {
    if (!/^e\d+$/.test(edge.id)) continue;
    const index = Number(edge.id.slice(1)), semantic = spec.edges[index];
    for (const draw of edge._draw_ ?? []) {
      if (draw.op !== 'b') continue;
      const points = draw.points.map(coord);
      let d = `M${points[0].join(' ')}`;
      for (let i = 1; i < points.length; i += 3) d += ` C${points.slice(i, i + 3).map(point => point.join(' ')).join(' ')}`;
      c.path(d, semantic.kind || 'data', `data-edge-id="e${index}" data-from="${esc(semantic.from)}" data-to="${esc(semantic.to)}"`);
    }
  }
  for (const [index, node] of spec.nodes.entries()) {
    const object = graph.objects.find(object => object.name === node.id);
    const [cx, cy] = coord(object.pos.split(',').map(Number)), m = dimensions.get(node.id);
    const x = cx - m.w / 2, top = cy - m.h / 2, tone = palette[node.tone] || palette.process;
    c.region(`node-${node.id}`, x, top, m.w, m.h, tone.fill, 'none', `node node-${node.tone || 'process'}`);
    c.rect(x + 18, top + 17, 36, 25, '#fff', 'none', 7);
    c.text(x + 25, top + 35, String(index + 1).padStart(2, '0'), 15, tone.ink, 750, 'class="mono"');
    let textY = top + 76;
    for (const title of m.titles) { c.text(x + 22, textY, title, 28, tone.ink, 700); textY += 39; }
    textY += 4;
    for (const line of m.body) { c.text(x + 22, textY, line, 23, colors.ink); textY += 34; }
    c.end();
  }
  for (const edge of graph.edges ?? []) {
    if (!/^e\d+$/.test(edge.id) || !edge.lp) continue;
    const index = Number(edge.id.slice(1)), semantic = spec.edges[index];
    const [x, yy] = coord(edge.lp.split(',').map(Number));
    const lines = wrap(semantic.label || '', 238, 21);
    const w = Math.ceil(Math.max(1, ...lines.map(line => measure(line, 21))) + 24), h = lines.length * 32 + 10;
    c.rect(x - w / 2, yy - h / 2, w, h, '#fff', 'none', 6);
    lines.forEach((line, i) => c.text(x, yy - (lines.length - 1) * 16 + 7 + i * 32, line, 21,
      (semantic.kind === 'data' ? colors.input : colors[semantic.kind]) || colors.muted, 600,
      `text-anchor="middle" class="edge-label" data-edge-id="e${index}"`));
  }
  c.end(); c.end();
  return y + height;
}

/** Fixed reading width; dense ranks reflow into two columns instead of shrinking. */
export function planRailGraph(spec, dimensions, ranksInput, wrap, measure) {
  const ranks = ranksInput.flatMap(row => Array.from({length: Math.ceil(row.length / 2)}, (_, i) => row.slice(i * 2, i * 2 + 2)));
  const assigned = new Set(ranks.flat());
  for (const node of spec.nodes) if (!assigned.has(node.id)) ranks.push([node.id]);
  const locations = new Map(ranks.flatMap((row, i) => row.map((id, col) => [id, {row: i, col: row.length === 1 ? 0.5 : col}])));
  const gaps = Array.from({length: ranks.length + 1}, () => ({sources: [], upTargets: [], downTargets: []}));
  const edges = spec.edges.map((edge, index) => {
    const from = locations.get(edge.from), to = locations.get(edge.to);
    const direction = Math.sign(to.row - from.row);
    const side = edge.routeSide ?? (from.col === 0 ? 'left' : from.col === 1 ? 'right' : to.col < 0.5 ? 'left' : to.col > 0.5 ? 'right' : index % 2 ? 'left' : 'right');
    const band = direction ? side : 'center';
    const lines = wrap(`${String(index + 1).padStart(2, '0')}  ${edge.label || ''}`, band === 'center' ? 152 : 184, 21);
    const label = {lines, w: Math.max(...lines.map(line => measure(line, 21))) + 16, h: lines.length * 32 + 12};
    const sourceGap = from.row + (direction >= 0 ? 1 : 0), targetGap = to.row + (direction <= 0 ? 1 : 0);
    const route = {index, edge, from, to, direction, side, band, label, sourceGap, targetGap};
    gaps[sourceGap].sources.push(route);
    if (direction) gaps[targetGap][direction > 0 ? 'downTargets' : 'upTargets'].push(route);
    return route;
  });
  // Interval coloring gives unrelated long edges independent exterior rails.
  const tracks = {left: [], right: []};
  for (const route of edges.filter(route => route.direction).sort((a, b) => Math.abs(b.to.row - b.from.row) - Math.abs(a.to.row - a.from.row))) {
    const low = Math.min(route.from.row, route.to.row), high = Math.max(route.from.row, route.to.row);
    const slots = tracks[route.side];
    let slot = slots.findIndex(intervals => intervals.every(([a, b]) => high < a || low > b));
    if (slot < 0) { slot = slots.length; slots.push([]); }
    if (slot > 10) throw Error(`${spec.id}: exterior rail budget exceeded; add a semantic panel`);
    slots[slot].push([low, high]);
    route.railX = route.side === 'left' ? 84 - slot * 7 : 1356 + slot * 6;
  }
  let top = 20;
  const nodes = new Map();
  for (let row = 0; row <= ranks.length; row++) {
    const gap = gaps[row]; gap.top = top;
    let offset = 14;
    for (const route of gap.upTargets) { route.targetY = top + offset; offset += 14; }
    const start = offset + 12;
    const offsets = {left: start, right: start, center: start};
    for (const route of gap.sources) {
      route.sourceY = top + offsets[route.band] + route.label.h / 2;
      offsets[route.band] += route.label.h + 20;
    }
    offset = Math.max(...Object.values(offsets)) + 18;
    for (const route of gap.downTargets) { route.targetY = top + offset; offset += 14; }
    gap.h = Math.max(row === 0 ? 26 : 130, offset + 12);
    top += gap.h;
    if (row === ranks.length) break;
    const height = Math.max(...ranks[row].map(id => dimensions.get(id).h));
    for (const id of ranks[row]) {
      const location = locations.get(id), m = dimensions.get(id);
      nodes.set(id, {...m, x: location.col === 0.5 ? 537 : location.col === 0 ? 274 : 804, y: top, row});
    }
    top += height;
  }
  // Order ports by destination position so fanout does not invert at the card.
  const ports = new Map([...nodes.keys()].map(id => [id, {n: [], s: []}]));
  for (const route of edges) {
    const outSide = route.direction < 0 ? 'n' : 's', inSide = route.direction > 0 ? 'n' : 's';
    ports.get(route.edge.from)[outSide].push({route, end: 'source'});
    ports.get(route.edge.to)[inSide].push({route, end: 'target'});
  }
  for (const [id, sides] of ports) for (const [side, entries] of Object.entries(sides)) {
    const node = nodes.get(id);
    entries.sort((a, b) => {
      const other = entry => entry.end === 'source' ? nodes.get(entry.route.edge.to) : nodes.get(entry.route.edge.from);
      return other(a).x - other(b).x || a.route.index - b.route.index;
    });
    entries.forEach(({route, end}, i) => { route[end + 'Port'] = [node.x + 24 + (i + 1) * (node.w - 48) / (entries.length + 1), node.y + (side === 's' ? node.h : 0)]; });
  }
  for (const route of edges) {
    const [sx, sy] = route.sourcePort, [tx, ty] = route.targetPort;
    route.points = route.direction
      ? [[sx, sy], [sx, route.sourceY], [route.railX, route.sourceY], [route.railX, route.targetY], [tx, route.targetY], [tx, ty]]
      : [[sx, sy], [sx, route.sourceY], [tx, route.sourceY], [tx, ty]];
    route.label.x = route.band === 'left' ? 190 : route.band === 'right' ? 1246 : 716;
    route.label.y = route.sourceY;
  }
  return {nodes, edges, width: 1424, height: top + 20, ranks};
}

export function bridgedPath(route, routes) {
  const points = route.points;
  let d = `M${points[0].join(' ')}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    if (a[1] === b[1] && a[0] !== b[0]) {
      const crossings = [];
      for (const other of routes) {
        if (other === route) continue;
        for (let j = 1; j < other.points.length; j++) {
          const p = other.points[j - 1], q = other.points[j];
          if (p[0] === q[0] && p[0] > Math.min(a[0], b[0]) + 8 && p[0] < Math.max(a[0], b[0]) - 8
            && a[1] > Math.min(p[1], q[1]) + 8 && a[1] < Math.max(p[1], q[1]) - 8) crossings.push(p[0]);
        }
      }
      const groups = [];
      for (const x of [...new Set(crossings)].sort((a, b) => a - b)) {
        const group = groups.at(-1);
        if (group && x - group[1] < 14) group[1] = x; else groups.push([x, x]);
      }
      const direction = Math.sign(b[0] - a[0]);
      if (direction < 0) groups.reverse();
      for (const [low, high] of groups) {
        const start = direction > 0 ? low - 5 : high + 5, end = direction > 0 ? high + 5 : low - 5;
        d += ` L${start} ${a[1]} Q${(start + end) / 2} ${a[1] - 12} ${end} ${a[1]}`;
      }
    }
    d += ` L${b.join(' ')}`;
  }
  return d;
}

export function renderRailGraph(c, spec, y, dimensions, tools) {
  const {wrap, widthOf: measure, ranks, palette, colors, esc, labelName} = tools;
  const plan = planRailGraph(spec, dimensions, ranks, wrap, measure);
  const height = plan.height + 130;
  c.region('system-graph', 64, y, 1472, height);
  c.text(88, y + 42, 'A', 20, colors.input, 800, 'class="mono"');
  c.text(122, y + 42, spec.focus || labelName || '系统与关系', 25, colors.ink, 700);
  c.text(88, y + 77, '同号为同一连线；跨线桥表示穿越，不表示连接', 18, colors.muted, 550);
  c.add(`<g transform="translate(88 ${y + 106})" data-graph-scale="1" data-routing="outer-rails">`);
  for (const route of plan.edges) {
    const d = bridgedPath(route, plan.edges), edge = route.edge;
    c.add(`<path d="${d}" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>`);
    c.path(d, edge.kind || 'data', `data-edge-id="e${route.index}" data-from="${esc(edge.from)}" data-to="${esc(edge.to)}"`);
  }
  for (const [index, node] of spec.nodes.entries()) {
    const m = plan.nodes.get(node.id), tone = palette[node.tone] || palette.process;
    c.region(`node-${node.id}`, m.x, m.y, m.w, m.h, tone.fill, 'none', `node node-${node.tone || 'process'}`);
    c.rect(m.x + 18, m.y + 17, 36, 25, '#fff', 'none', 7);
    c.text(m.x + 25, m.y + 35, String(index + 1).padStart(2, '0'), 15, tone.ink, 750, 'class="mono"');
    let textY = m.y + 76;
    for (const title of m.titles) { c.text(m.x + 22, textY, title, 28, tone.ink, 700); textY += 39; }
    textY += 4;
    for (const line of m.body) { c.text(m.x + 22, textY, line, 23, colors.ink); textY += 34; }
    c.end();
  }
  for (const route of plan.edges) {
    const {x, y: yy, w, h, lines} = route.label, edge = route.edge;
    const ink = (edge.kind === 'data' ? colors.input : colors[edge.kind]) || colors.muted;
    c.rect(x - w / 2, yy - h / 2, w, h, '#fff', 'none', 6);
    lines.forEach((line, i) => c.text(x, yy - (lines.length - 1) * 16 + 7 + i * 32, line, 21, ink, 600,
      `text-anchor="middle" class="edge-label" data-edge-id="e${route.index}"`));
    // Match the full condition label to the arrow endpoint even across a rail.
    const [tx, ty] = route.targetPort;
    c.text(tx + 4, ty + (route.direction > 0 ? -10 : 22), String(route.index + 1).padStart(2, '0'), 18, ink, 750,
      `class="edge-end-label" data-edge-id="e${route.index}" stroke="#fff" stroke-width="4" paint-order="stroke"`);
  }
  c.end(); c.end();
  return y + height;
}
