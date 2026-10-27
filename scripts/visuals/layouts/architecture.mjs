/** Decompose the system graph into local relations, with numbered references.
 * A repeated card is the same semantic node; every edge is drawn exactly once.
 */
export function render(c, s, y, tools) {
  if (s.id !== 'AG-DIM-ARCHITECTURE' && s.id !== 'TD-AG-00-compat') return null;
  const {wrap, widthOf, palette, colors, esc} = tools;
  const nodes = new Map(s.nodes.map((n, i) => [n.id, {...n, number: String(i + 1).padStart(2, '0')}]));
  const cards = new Map(), routes = new Map(), panels = [], complete = new Set();
  const card = (key, id, x, top, w, compact = false) => {
    const n = nodes.get(id); if (!n || cards.has(key)) throw Error(`${s.id}: invalid card ${key}`);
    const titles = wrap(n.title, w - 44, compact ? 25 : 28);
    const body = compact ? [] : n.body.flatMap(line => wrap(line, w - 44, 23));
    const h = 76 + titles.length * 39 + body.length * 34;
    const m = {key, id, x, y: top, w, h, n, titles, body, compact};
    cards.set(key, m); if (!compact) complete.add(id); return m;
  };
  const bottom = m => m.y + m.h;
  const port = (m, side, at = .5) => side === 'n' || side === 's'
    ? [m.x + m.w * at, side === 'n' ? m.y : bottom(m)]
    : [side === 'w' ? m.x : m.x + m.w, m.y + m.h * at];
  const edge = (i, a, b, sideA, sideB, via, label, atA = .5, atB = .5, width = 270) => {
    const e = s.edges[i];
    if (!e || e.from !== a.id || e.to !== b.id || routes.has(i)) throw Error(`${s.id}: edge ${i}`);
    routes.set(i, {points: [port(a, sideA, atA), ...via, port(b, sideB, atB)], label, width});
  };
  const across = (i, a, b) => edge(i, a, b, 'e', 'w', [], [(a.x + a.w + b.x) / 2, a.y + a.h / 2 - 35]);
  const panel = (title, top, end) => panels.push({title, top, h: end - top + 30});
  let start = 88;

  // D0 calibrates each domain; score invalidation has its own local relation.
  const d0 = card('d0', 'd0', 500, start + 65, 600);
  const targets = ['distribution', 'behavior', 'security', 'cost', 'business'].map((id, i) => card(`cal-${id}`, id, 104 + i * 280, bottom(d0) + 185, 264, true));
  targets.forEach((m, i) => edge(i + 1, d0, m, 's', 'n', [[800, bottom(d0) + 50], [m.x + m.w / 2, bottom(d0) + 50]], [m.x + m.w / 2, m.y - 75], .5, .5, 248));
  let top = Math.max(...targets.map(bottom)) + 145;
  const invalidD0 = card('invalid-d0', 'd0', 120, top, 520, true);
  const invalidDecision = card('invalid-decision', 'decision', 960, top, 520, true);
  across(6, invalidD0, invalidDecision);
  panel('A1  D0 校准五类评分；失准限制单独进入决定', start, Math.max(bottom(invalidD0), bottom(invalidDecision)));
  start = Math.max(bottom(invalidD0), bottom(invalidDecision)) + 110;

  // Four rings drive all four targets, rather than being chained at the end.
  const rings = card('rings', 'rings', 104, start + 65, 1392);
  const execution = ['behavior', 'distribution', 'security', 'cost'].map((id, i) => card(`run-${id}`, id, 104 + i * 352, bottom(rings) + 185, 336));
  execution.forEach((m, i) => edge(8 + i, rings, m, 's', 'n', [], [m.x + m.w / 2, m.y - 85], (m.x + m.w / 2 - rings.x) / rings.w, .5, 316));
  panel('A2  四环按各自输入与覆盖范围横向执行', start, Math.max(...execution.map(bottom)));
  start = Math.max(...execution.map(bottom)) + 110;

  // Input, behavioral evidence and feedback use short, separate local paths.
  const input = card('input', 'input', 120, start + 65, 520);
  const behavior = card('input-behavior', 'behavior', 960, input.y, 520, true);
  across(0, input, behavior);
  top = Math.max(bottom(input), bottom(behavior)) + 155;
  const feedback = card('feedback-decision', 'decision', 120, top, 520, true);
  const distribution = card('trace-distribution', 'distribution', 960, top, 520, true);
  edge(7, behavior, distribution, 's', 'n', [], [1220, (bottom(behavior) + distribution.y) / 2]);
  edge(20, feedback, input, 'n', 's', [], [380, (bottom(input) + feedback.y) / 2]);
  const recalibrate = card('recalibrate-d0', 'd0', 120, bottom(feedback) + 155, 520, true);
  edge(21, feedback, recalibrate, 's', 'n', [], [380, (bottom(feedback) + recalibrate.y) / 2]);
  panel('A3  输入、完整轨迹与失败回灌分开追踪', start, Math.max(bottom(recalibrate), bottom(distribution)));
  start = Math.max(bottom(recalibrate), bottom(distribution)) + 110;

  // Guardrail configuration and direct hard blockers cannot merge into a score.
  const security = card('guard-security', 'security', 120, start + 65, 520, true);
  const business = card('business', 'business', 960, security.y, 520);
  const guard = card('guard', 'guard', 400, Math.max(bottom(security), bottom(business)) + 165, 800);
  edge(12, security, guard, 's', 'n', [[380, guard.y - 70], [600, guard.y - 70]], [440, guard.y - 105], .5, .25);
  edge(13, business, guard, 's', 'n', [[1220, guard.y - 70], [1000, guard.y - 70]], [1160, guard.y - 105], .5, .75);
  top = bottom(guard) + 155;
  const redSecurity = card('hard-security', 'security', 120, top, 520, true);
  const redBusiness = card('hard-business', 'business', 960, top, 520, true);
  const blocked = card('hard-decision', 'decision', 250, Math.max(bottom(redSecurity), bottom(redBusiness)) + 180, 1100, true);
  edge(18, redSecurity, blocked, 's', 'n', [], [440, blocked.y - 90], .5, .12, 450);
  edge(19, redBusiness, blocked, 's', 'n', [], [1160, blocked.y - 90], .5, .88, 450);
  panel('A4  风险接到运行护栏；已证硬红线直接阻断', start, bottom(blocked));
  start = bottom(blocked) + 110;

  // Evidence enters a wide decision card at four widely separated ports.
  const evidence = ['distribution', 'cost', 'business', 'guard'].map((id, i) => card(`evidence-${id}`, id, 104 + i * 352, start + 65, 336, true));
  const decision = card('decision', 'decision', 250, Math.max(...evidence.map(bottom)) + 185, 1100);
  evidence.forEach((m, i) => edge(14 + i, m, decision, 's', 'n', [], [m.x + m.w / 2, decision.y - 90], .5, [.04, .34, .66, .96][i], 316));
  panel('A5  统计、成本、责任和停止回执支持具名决定', start, bottom(decision));
  const height = bottom(decision) + 65;
  if (complete.size !== s.nodes.length || routes.size !== s.edges.length) throw Error(`${s.id}: incomplete architecture panels`);

  c.region('system-graph', 64, y, 1472, height);
  c.add(`<g transform="translate(0 ${y})" data-graph-scale="1" data-routing="architecture-panels">`);
  c.text(88, 42, 'A  局部关系分区 · 同号卡片引用同一节点', 25, colors.ink, 700);
  c.text(88, 76, '分区呈现校准、执行、反馈、护栏和决定；重复引用不表示重复执行或先后放行。', 20, colors.muted);
  for (const p of panels) {
    c.region(`panel-${p.title.slice(0, 2)}`, 84, p.top, 1432, p.h, '#fff', '#dce5f0');
    c.text(106, p.top + 30, p.title, 23, colors.input, 700); c.end();
  }
  for (const [i, e] of s.edges.entries()) {
    const r = routes.get(i), d = r.points.map(([x, yy], j) => `${j ? 'L' : 'M'}${x} ${yy}`).join(' ');
    c.path(d, e.kind, `data-edge-id="e${i}" data-from="${esc(e.from)}" data-to="${esc(e.to)}"`);
  }
  for (const m of cards.values()) {
    const tone = palette[m.n.tone] || palette.process;
    c.region(`node-${m.key}`, m.x, m.y, m.w, m.h, tone.fill, 'none', `node node-${m.n.tone}`);
    c.text(m.x + 22, m.y + 29, `${m.n.number}${m.compact ? ' · 同一节点' : ''}`, 16, tone.ink, 750, 'class="mono"');
    let yy = m.y + 73;
    for (const line of m.titles) { c.text(m.x + 22, yy, line, m.compact ? 25 : 28, tone.ink, 700); yy += 39; }
    yy += 4;
    for (const line of m.body) { c.text(m.x + 22, yy, line, 23, colors.ink); yy += 34; }
    c.end();
  }
  for (const [i, e] of s.edges.entries()) {
    const r = routes.get(i), [x, yy] = r.label;
    const lines = wrap(`${String(i + 1).padStart(2, '0')}  ${e.label}`, r.width, 21);
    const w = Math.max(...lines.map(t => widthOf(t, 21))) + 20, h = lines.length * 32 + 12;
    c.rect(x - w / 2, yy - h / 2, w, h, '#fff', 'none', 5);
    lines.forEach((line, j) => c.text(x, yy - (lines.length - 1) * 16 + 7 + j * 32, line, 21, colors[e.kind === 'data' ? 'input' : e.kind] || colors.muted, 600, `text-anchor="middle" class="edge-label" data-edge-id="e${i}"`));
  }
  c.end(); c.end(); return y + height;
}
