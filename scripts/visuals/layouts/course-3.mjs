/** Course 3 diagrams with explicit source/target ports and unscaled typography.
 * The caller retains the common header, teaching sections, safety gates and refs.
 */
export function render(c, s, y, tools) {
  const plan = plans[s.id];
  if (!plan) return null;
  const {wrap, widthOf, palette, colors, esc} = tools;
  const boxes = new Map(), routes = new Map();
  const box = (id, x, top, w, h) => {
    if (!s.nodes.some(n => n.id === id) || boxes.has(id)) throw Error(`${s.id}: invalid node ${id}`);
    boxes.set(id, {x, y: top, w, h});
  };
  const edge = (from, to, points, lx, ly) => {
    const index = s.edges.findIndex(e => e.from === from && e.to === to);
    if (index < 0 || routes.has(index)) throw Error(`${s.id}: invalid edge ${from} → ${to}`);
    routes.set(index, {points, lx, ly});
  };
  const height = plan(box, edge);
  if (boxes.size !== s.nodes.length || routes.size !== s.edges.length) throw Error(`${s.id}: incomplete layout`);
  c.region(`system-graph-${s.id}`, 64, y, 1472, height);
  c.add(`<g transform="translate(0 ${y})" data-graph-scale="1">`);
  c.text(88, 43, 'A', 20, colors.input, 800, 'class="mono"');
  c.block(122, 43, s.focus, 1370, 25, colors.ink, 700, 37);
  // Shared-source segments are deliberate fork buses. Each semantic edge still
  // owns exactly one path and a stable identifier for the closure verifier.
  for (const [i, e] of s.edges.entries()) {
    const {points} = routes.get(i);
    const d = points.map(([x, yy], j) => `${j ? 'L' : 'M'}${x} ${yy}`).join(' ');
    c.path(d, e.kind, `data-from="${esc(e.from)}" data-to="${esc(e.to)}" data-edge-id="${esc(s.id)}-e${i}"`);
  }
  for (const n of s.nodes) {
    const b = boxes.get(n.id), tone = palette[n.tone] || palette.process;
    const titles = wrap(n.title, b.w - 44, 26);
    const body = n.body.flatMap(t => wrap(t, b.w - 44, 23));
    if (titles.length * 36 + body.length * 34 + 52 > b.h) throw Error(`${s.id}: node ${n.id} needs more height`);
    c.region(`node-${s.id}-${n.id}`, b.x, b.y, b.w, b.h, tone.fill, 'none', `node node-${n.tone}`);
    let yy = b.y + 40;
    for (const t of titles) { c.text(b.x + 22, yy, t, 26, tone.ink, 700); yy += 36; }
    yy += 15;
    for (const t of body) { c.text(b.x + 22, yy, t, 23, colors.ink); yy += 34; }
    c.end();
  }
  for (const [i, e] of s.edges.entries()) {
    const {lx, ly} = routes.get(i);
    const lines = wrap(e.label, 270, 21);
    const w = Math.max(...lines.map(t => widthOf(t, 21))) + 20;
    c.rect(lx - w / 2, ly - 24, w, lines.length * 30 + 5, '#fff', 'none', 5);
    lines.forEach((t, j) => c.text(lx, ly + j * 30, t, 21, (e.kind === 'data' ? colors.input : colors[e.kind]) || colors.evidence, 600, 'text-anchor="middle" class="edge-label"'));
  }
  c.end();
  c.end();
  return y + height;
}

const plans = {
  'TD-B04'(box, edge) {
    // Model and data are shared controls above two symmetric protocol arms.
    box('data', 190, 150, 480, 180);
    box('model', 930, 150, 480, 180);
    box('a', 190, 450, 480, 180);
    box('b', 930, 450, 480, 180);
    box('runner', 560, 760, 480, 180);
    box('raw', 100, 1100, 360, 230);
    box('paired', 620, 1100, 360, 230);
    box('attribution', 1140, 1100, 360, 230);
    edge('data', 'runner', [[190,240],[100,240],[100,850],[550,850]], 290, 828);
    edge('model', 'runner', [[1410,240],[1500,240],[1500,850],[1050,850]], 1310, 828);
    edge('a', 'runner', [[430,630],[430,690],[680,690],[680,750]], 490, 669);
    edge('b', 'runner', [[1170,630],[1170,690],[920,690],[920,750]], 1110, 669);
    edge('runner', 'raw', [[800,940],[800,1010],[280,1010],[280,1090]], 555, 989);
    edge('raw', 'paired', [[460,1215],[610,1215]], 540, 1194);
    edge('paired', 'attribution', [[980,1215],[1130,1215]], 1060, 1194);
    return 1360;
  },
  'TD-B05'(box, edge) {
    // Parallel audits: compatibility has its own left approach to classification.
    box('candidate', 560, 130, 480, 180);
    const audits = ['compatibility','exposure','canary','uncertainty'];
    audits.forEach((id, i) => box(id, 96 + i * 368, 450, 304, 260));
    box('classify', 560, 990, 480, 180);
    box('owner', 560, 1260, 480, 180);
    audits.forEach((id, i) => {
      const x = 248 + i * 368;
      edge('candidate', id, [[800,310],[800,360],[x,360],[x,440]], x, 410);
    });
    edge('compatibility','classify', [[248,710],[248,910],[620,910],[620,980]], 420, 889);
    edge('exposure','classify', [[616,710],[616,820],[740,820],[740,980]], 630, 789);
    edge('canary','classify', [[984,710],[984,820],[860,820],[860,980]], 970, 789);
    edge('uncertainty','classify', [[1352,710],[1352,910],[980,910],[980,980]], 1180, 889);
    edge('classify','owner', [[800,1170],[800,1250]], 800, 1220);
    return 1470;
  },
  'TD-AP01'(box, edge) {
    // Slice evidence merges before Oracle; sample distribution uses the left
    // exterior corridor and joins workload at a separate input port.
    box('sample', 560, 130, 480, 180);
    ['refund','query','handoff'].forEach((id, i) => box(id, 160 + i * 460, 450, 360, 230));
    box('oracle', 560, 900, 480, 190);
    box('profile', 560, 1210, 480, 190);
    box('gate', 560, 1510, 480, 190);
    ['refund','query','handoff'].forEach((id, i) => {
      const x = 340 + i * 460;
      edge('sample', id, [[800,310],[800,370],[x,370],[x,440]], x, 417);
    });
    edge('refund','oracle', [[340,680],[340,800],[680,800],[680,890]], 480, 777);
    edge('query','oracle', [[800,680],[800,890]], 800, 760);
    edge('handoff','oracle', [[1260,680],[1260,800],[920,800],[920,890]], 1120, 777);
    edge('sample','profile', [[560,220],[100,220],[100,1305],[550,1305]], 300, 1284);
    edge('oracle','profile', [[800,1090],[800,1200]], 800, 1154);
    edge('profile','gate', [[800,1400],[800,1500]], 800, 1461);
    return 1730;
  },
  'TD-AP03'(box, edge) {
    // A common root fork above child spans; ledger stays on the far-right
    // independent audit corridor, outside both the tree and evidence merge.
    box('root', 480, 130, 480, 180);
    box('ledger', 1100, 130, 400, 180);
    const children = ['queue','generation','attempt','terminal'];
    children.forEach((id, i) => box(id, 100 + i * 366, 480, 300, 260));
    box('closure', 1100, 1080, 400, 190);
    children.forEach((id, i) => {
      const x = 250 + i * 366;
      edge('root', id, [[720,310],[720,390],[x,390],[x,470]], x, 444);
    });
    edge('queue','closure', [[250,740],[250,1000],[1140,1000],[1140,1070]], 500, 979);
    edge('generation','closure', [[616,740],[616,940],[1240,940],[1240,1070]], 800, 919);
    edge('attempt','closure', [[982,740],[982,880],[1340,880],[1340,1070]], 1110, 859);
    edge('terminal','closure', [[1348,740],[1348,820],[1440,820],[1440,1070]], 1388, 799);
    edge('ledger','closure', [[1300,310],[1300,350],[1520,350],[1520,1175],[1510,1175]], 1410, 369);
    return 1300;
  },
};
