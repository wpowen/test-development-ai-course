/** Native panels for the six course-2 polish diagrams.
 * Semantic nodes/edges remain in the spec. Copies have distinct DOM ids and
 * retain the original node number. Every semantic edge is emitted exactly once.
 */
const handled = new Set(['TD-T06', 'TD-A02', 'TD-T10', 'TD-T12', 'TD-T15', 'TD-W03']);

export function render(c, s, y, tools) {
  if (!handled.has(s.id)) return null;
  const {wrap, widthOf, palette, colors, esc} = tools;
  const cards = new Map(), panels = [], routes = [], full = new Set();
  const original = new Map(s.nodes.map((node, i) => [node.id, {...node, number: String(i + 1).padStart(2, '0')}]));
  const card = (key, id, x, top, w = 520, compact = false) => {
    const node = original.get(id);
    if (!node) throw Error(`${s.id}: missing node ${id}`);
    const titles = wrap(node.title, w - 44, compact ? 25 : 28);
    const body = compact ? [] : node.body.flatMap(line => wrap(line, w - 44, 23));
    const h = 62 + titles.length * 39 + body.length * 34 + (compact ? 8 : 14);
    const m = {key, id, x, y: top, w, h, node, titles, body, compact};
    if (cards.has(key)) throw Error(`${s.id}: duplicate instance ${key}`);
    cards.set(key, m); if (!compact) full.add(id);
    return m;
  };
  const bottom = m => m.y + m.h;
  const port = (m, side, at = .5) => side === 'n' ? [m.x + m.w * at, m.y]
    : side === 's' ? [m.x + m.w * at, bottom(m)]
      : side === 'w' ? [m.x, m.y + m.h * at] : [m.x + m.w, m.y + m.h * at];
  const edge = (index, from, to, a = 's', b = 'n', via = [], label, atA = .5, atB = .5, labelWidth = 270) => {
    const semantic = s.edges[index];
    if (!semantic || semantic.from !== from.id || semantic.to !== to.id) throw Error(`${s.id}: e${index} endpoints`);
    if (routes.some(route => route.index === index)) throw Error(`${s.id}: repeated e${index}`);
    const points = [port(from, a, atA), ...via, port(to, b, atB)];
    const lines = wrap(`${String(index + 1).padStart(2, '0')}  ${semantic.label}`, labelWidth, 21);
    routes.push({index, semantic, points, label: label || [(points[0][0] + points.at(-1)[0]) / 2, (points[0][1] + points.at(-1)[1]) / 2], lines});
  };
  const down = (i, a, b, x = a.x + a.w / 2, labelX = x + 170) => {
    const mid = (bottom(a) + b.y) / 2;
    edge(i, a, b, 's', 'n', [[x, mid], [b.x + b.w / 2, mid]], [labelX, mid - 6]);
  };
  const across = (i, a, b, labelWidth = 270) => edge(i, a, b, 'e', 'w', [], [(a.x + a.w + b.x) / 2, a.y + a.h / 2 - 38], .5, .5, labelWidth);
  const panel = (title, top, end) => panels.push({title, y: top, h: end - top + 32});
  let end;

  if (s.id === 'TD-T06') {
    const candidate = card('candidate', 'candidate', 540, 130);
    const row1 = bottom(candidate) + 160;
    const base = card('base', 'base', 120, row1), mutate = card('mutate', 'mutate', 960, row1);
    const mid = bottom(candidate) + 85;
    edge(0, candidate, base, 's', 'n', [[670, mid], [380, mid]], [390, mid - 25], .25);
    edge(1, candidate, mutate, 's', 'n', [[930, mid], [1220, mid]], [1210, mid - 25], .75);
    across(4, base, mutate);
    const row2 = Math.max(bottom(base), bottom(mutate)) + 180;
    const oracle = card('oracle', 'oracle', 120, row2), detect = card('detect', 'detect', 960, row2);
    edge(2, oracle, base, 'n', 's', [], [380, row2 - 75]);
    across(3, oracle, detect);
    down(5, mutate, detect, 1220, 1330);
    const row3 = Math.max(bottom(oracle), bottom(detect)) + 180;
    const classify = card('classify', 'classify', 120, row3), review = card('review', 'review', 960, row3);
    edge(7, detect, classify, 's', 'n', [[1090, row3 - 100], [380, row3 - 100]], [730, row3 - 125], .25);
    edge(6, detect, review, 's', 'n', [[1350, row3 - 70], [1220, row3 - 70]], [1330, row3 - 100], .75);
    across(8, classify, review);
    end = Math.max(bottom(classify), bottom(review)) + 32;
    panel('A1  同一候选、独立期望与正常 / 变异对照', 82, end);
  }

  if (s.id === 'TD-T10') {
    const gold = card('gold', 'gold', 500, 132, 600);
    const split = bottom(gold) + 160;
    const ca = card('corpus-judge', 'corpus', 120, split, 520, true);
    const ra = card('retrieval-judge', 'retrieval', 960, split, 520, true);
    edge(0, gold, ca, 's', 'n', [[650, split - 90], [380, split - 90]], [380, split - 118], .25);
    edge(3, gold, ra, 's', 'n', [[950, split - 90], [1220, split - 90]], [1220, split - 118], .75);
    let top = Math.max(bottom(ca), bottom(ra)) + 145;
    panel('A1  独立 qrels 分别约束语料与召回', 82, top - 110);
    const pipelineTop = top - 30;
    const corpus = card('corpus', 'corpus', 120, top + 40);
    const missing = card('miss-corpus', 'miss', 960, corpus.y);
    across(2, corpus, missing);
    top = Math.max(bottom(corpus), bottom(missing)) + 145;
    const retrieval = card('retrieval', 'retrieval', 120, top);
    const rm = card('miss-retrieval', 'miss', 960, top, 520, true);
    down(1, corpus, retrieval, 380, 550); across(5, retrieval, rm);
    top = bottom(retrieval) + 145;
    const ranking = card('ranking', 'ranking', 120, top);
    const km = card('miss-ranking', 'miss', 960, top, 520, true);
    down(4, retrieval, ranking, 380, 550); across(7, ranking, km);
    top = bottom(ranking) + 145;
    const context = card('context', 'context', 120, top);
    const cm = card('miss-context', 'miss', 960, top, 520, true);
    down(6, ranking, context, 380, 550); across(9, context, cm);
    top = bottom(context) + 145;
    const generation = card('generation', 'generation', 120, top);
    down(8, context, generation, 380, 575);
    end = bottom(generation) + 24;
    panel('A2  成功沿左列逐层验证；缺失在当层交给 Owner', pipelineTop, end);
  }

  if (s.id === 'TD-T12') {
    let top = 132;
    const corpus = card('corpus', 'corpus', 120, top);
    top = bottom(corpus) + 145;
    const acl = card('acl', 'acl', 120, top);
    const blocker = card('gate-blocker', 'gate', 960, top, 520, true);
    down(0, corpus, acl, 380, 555); across(10, acl, blocker);
    top = bottom(acl) + 145;
    const retrieval = card('retrieval', 'retrieval', 120, top);
    const handoff = card('handoff', 'handoff', 960, top);
    down(1, acl, retrieval, 380, 555); across(3, retrieval, handoff);
    top = Math.max(bottom(retrieval), bottom(handoff)) + 145;
    const generate = card('generate', 'generate', 120, top), policy = card('policy', 'policy', 960, top);
    down(2, retrieval, generate, 380, 555); across(5, generate, policy);
    top = Math.max(bottom(generate), bottom(policy)) + 145;
    const faith = card('faith', 'faith', 120, top), hf = card('handoff-faith', 'handoff', 960, top, 520, true);
    down(4, generate, faith, 380, 555); across(6, faith, hf);
    const mainEnd = Math.max(bottom(faith), bottom(hf));
    panel('A1  证据主链与独立停止 / 工具支路', 82, mainEnd + 20);
    top = mainEnd + 190;
    const a = card('faith-exit', 'faith', 104, top, 432, true);
    const b = card('policy-exit', 'policy', 584, top, 432, true);
    const d = card('handoff-exit', 'handoff', 1064, top, 432, true);
    const gate = card('gate', 'gate', 250, Math.max(bottom(a), bottom(b), bottom(d)) + 160, 1100);
    [a, b, d].forEach((m, i) => edge([7, 8, 9][i], m, gate, 's', 'n', [], [m.x + m.w / 2, gate.y - 75], .5, [.064, .5, .936][i], 400));
    end = bottom(gate) + 20;
    panel('A2  证据、写入与交接分别交给发布 Gate', top - 60, end);
  }

  if (s.id === 'TD-T15') {
    const state = card('state-outcome', 'state', 104, 132, 432);
    const ledger = card('ledger-step', 'ledger', 584, 132, 432);
    const ts = card('state-trajectory', 'state', 1064, 132, 432, true);
    const tl = card('ledger-trajectory', 'ledger', 1064, bottom(ts) + 28, 432, true);
    const top = Math.max(bottom(state), bottom(ledger), bottom(tl)) + 170;
    const outcome = card('outcome', 'outcome', 104, top, 432);
    const step = card('step', 'step', 584, top, 432);
    const trajectory = card('trajectory', 'trajectory', 1064, top, 432);
    down(0, state, outcome, 320, 320); down(1, ledger, step, 800, 800);
    edge(2, ts, trajectory, 'w', 'n', [[1040, ts.y + ts.h / 2], [1040, top - 85], [1180, top - 85]], [1160, top - 112], .5, .27, 225);
    edge(3, tl, trajectory, 's', 'n', [[1280, top - 55], [1380, top - 55]], [1370, top - 15], .5, .73, 225);
    const human = card('human', 'human', 250, Math.max(bottom(outcome), bottom(step), bottom(trajectory)) + 170, 1100);
    [outcome, step, trajectory].forEach((m, i) => edge([6, 5, 7][i], m, human, 's', 'n', [], [m.x + m.w / 2, human.y - 80], .5, [.064, .5, .936][i], 400));
    panel('A1  三层独立、并列出结论', 82, bottom(human) + 20);
    const ptop = bottom(human) + 190;
    const policy = card('policy', 'policy', 500, ptop, 600);
    const sp = card('step-policy', 'step', 120, bottom(policy) + 150, 520, true);
    const hp = card('human-policy', 'human', 960, bottom(policy) + 150, 520, true);
    edge(4, policy, sp, 's', 'n', [[650, sp.y - 75], [380, sp.y - 75]], [380, sp.y - 105], .25);
    edge(8, policy, hp, 's', 'n', [[950, hp.y - 75], [1220, hp.y - 75]], [1220, hp.y - 105], .75, .5, 430);
    end = Math.max(bottom(sp), bottom(hp)) + 20;
    panel('A2  横切策略：写前约束与独立否决', ptop - 60, end);
  }

  if (s.id === 'TD-W03') {
    const tasks = card('tasks', 'tasks', 120, 132, 1360);
    const budget = card('budget', 'budget', 420, bottom(tasks) + 145, 760);
    const armY = bottom(budget) + 160;
    const single = card('single', 'single', 240, armY, 480), multi = card('multi', 'multi', 880, armY, 480);
    edge(0, tasks, single, 's', 'w', [[145, bottom(tasks) + 70], [145, armY + single.h / 2]], [350, bottom(tasks) + 60], .018, .5, 380);
    edge(1, tasks, multi, 's', 'e', [[1455, bottom(tasks) + 70], [1455, armY + multi.h / 2]], [1250, bottom(tasks) + 60], .982, .5, 380);
    edge(2, budget, single, 's', 'n', [[610, armY - 70], [480, armY - 70]], [470, armY - 100], .25);
    edge(3, budget, multi, 's', 'n', [[990, armY - 70], [1120, armY - 70]], [1130, armY - 100], .75);
    const trials = card('trials', 'trials', 360, Math.max(bottom(single), bottom(multi)) + 160, 880);
    edge(4, single, trials, 's', 'n', [], [480, trials.y - 85], .5, .136);
    edge(5, multi, trials, 's', 'n', [], [1120, trials.y - 85], .5, .864);
    const cost = card('cost', 'cost', 360, bottom(trials) + 160, 880);
    edge(6, single, cost, 'w', 'w', [[190, armY + single.h * .7], [190, cost.y + cost.h / 2]], [390, cost.y - 85], .7);
    edge(7, multi, cost, 'e', 'e', [[1410, armY + multi.h * .7], [1410, cost.y + cost.h / 2]], [1210, cost.y - 85], .7);
    panel('A1  共享任务 / 预算下发；两臂结果与成本分别汇总', 82, bottom(cost) + 24);
    const top = bottom(cost) + 190;
    const tr = card('trials-decision', 'trials', 120, top, 520, true), co = card('cost-decision', 'cost', 960, top, 520, true);
    const exitY = Math.max(bottom(tr), bottom(co)) + 190;
    const invalid = card('invalid', 'invalid', 120, exitY), decision = card('decision', 'decision', 960, exitY);
    down(9, tr, invalid, 380, 380);
    edge(10, tr, decision, 'e', 'n', [[800, tr.y + tr.h / 2], [800, exitY - 70], [1090, exitY - 70]], [820, exitY - 105], .5, .25);
    edge(11, co, decision, 's', 'n', [], [1310, exitY - 70], .68, .75);
    const bu = card('budget-invalid', 'budget', 120, Math.max(bottom(invalid), bottom(decision)) + 150, 520, true);
    edge(8, bu, invalid, 'n', 's', [], [380, bu.y - 75]);
    end = bottom(bu) + 20;
    panel('A2  混杂先排除；配对收益和代价共同支持决定', top - 60, end);
  }

  if (s.id === 'TD-A02') {
    const request = card('request', 'request', 104, 132, 1392);
    const protocolY = bottom(request) + 165;
    const ids = ['sse', 'structured', 'async', 'tool'];
    const protocol = ids.map((id, i) => card(id, id, 104 + i * 352, protocolY, 336));
    protocol.forEach((m, i) => edge([0, 1, 3, 2][i], request, m, 's', 'n', [], [m.x + 168, protocolY - 80], (m.x + 168 - request.x) / request.w, .5, 310));
    const outputY = Math.max(...protocol.map(bottom)) + 155;
    protocol.slice(0, 3).forEach((m, i) => {
      const le = card(`ledger-${m.id}`, 'ledger', m.x, outputY, 290, true);
      const ga = card(`gate-${m.id}`, 'gate', m.x, bottom(le) + 160, 290, true);
      edge([13, 14, 15][i], m, le, 's', 'n', [], [m.x + 145, outputY - 65], .28, .5, 280);
      edge([16, 17, 18][i], m, ga, 'e', 'e', [[m.x + 326, m.y + m.h * .65], [m.x + 326, ga.y + ga.h / 2]], [m.x + 145, ga.y - 65], .65, .5, 280);
    });
    // The fourth column is a reference into the tool expansion, not an extra
    // inferred semantic edge. Its full permission/idempotency node is above.
    const overviewEnd = Math.max(...[...cards.values()].map(bottom));
    panel('A1  四协议概览：过程判据与业务状态分别核验', 82, overviewEnd + 20);
    const top = overviewEnd + 190;
    const tool = card('tool-detail', 'tool', 120, top, 520, true);
    const execute = card('execute', 'execute', 960, top);
    across(4, tool, execute, 300);
    const failY = Math.max(bottom(tool), bottom(execute)) + 170;
    const fallback = card('fallback', 'fallback', 960, failY);
    const deny = card('fallback-denied', 'fallback', 120, failY, 520, true);
    down(5, tool, deny, 380, 380); down(8, execute, fallback, 1220, 1220);
    const resultY = Math.max(bottom(fallback), bottom(deny)) + 190;
    const refill = card('refill', 'refill', 960, resultY);
    const success = card('execute-success', 'execute', 120, resultY, 520, true);
    across(7, success, refill, 300);
    down(10, fallback, refill, 1220, 1220);
    panel('A2  工具放大：先授权执行；成功 / 失败均如实回填', top - 60, bottom(refill) + 20);
    const auditTop = bottom(refill) + 190;
    const sources = ['tool', 'fallback', 'execute'].map((id, i) => card(`${id}-audit`, id, 104 + i * 480, auditTop, 432, true));
    const ledger = card('ledger', 'ledger', 250, Math.max(...sources.map(bottom)) + 180, 1100);
    sources.forEach((m, i) => edge([6, 9, 12][i], m, ledger, 's', 'n', [], [m.x + m.w / 2, ledger.y - 80], .5, [.064, .5, .936][i], 410));
    const refillCopy = card('refill-audit', 'refill', 960, bottom(ledger) + 160, 520, true);
    const ledgerCopy = card('ledger-refill', 'ledger', 120, refillCopy.y, 520, true);
    across(11, ledgerCopy, refillCopy, 310);
    const gate = card('gate', 'gate', 250, Math.max(bottom(refillCopy), bottom(ledgerCopy)) + 170, 1100);
    edge(20, ledgerCopy, gate, 's', 'n', [], [400, gate.y - 75], .5, .12, 380);
    edge(19, refillCopy, gate, 's', 'n', [], [1200, gate.y - 75], .5, .88, 410);
    end = bottom(gate) + 20;
    panel('A3  独立账本：重复查状态、副作用读回与最终协议门禁', auditTop - 60, end);
  }

  if (routes.length !== s.edges.length || full.size !== s.nodes.length) throw Error(`${s.id}: incomplete panels (${routes.length}/${s.edges.length} edges, ${full.size}/${s.nodes.length} nodes)`);
  const height = end + 66;
  c.region('system-graph', 64, y, 1472, height);
  c.text(88, y + 37, 'A  分区关系图 · 同号卡片为同一节点的复用', 25, colors.ink, 700);
  c.text(88, y + 69, '箭头条件沿用原始合同；重复卡片只缩短查线距离，不表示新增步骤或再次执行。', 20, colors.muted);
  c.add(`<g transform="translate(0 ${y})" data-graph-scale="1" data-routing="course-2-panels">`);
  for (const p of panels) {
    c.rect(82, p.y, 1436, p.h, '#fff', colors.line, 12);
    c.text(104, p.y + 31, p.title, 23, colors.input, 700);
  }
  for (const route of routes) {
    const d = route.points.map(([x, yy], i) => `${i ? 'L' : 'M'}${x} ${yy}`).join(' ');
    const e = route.semantic;
    c.path(d, e.kind || 'data', `data-edge-id="e${route.index}" data-from="${esc(e.from)}" data-to="${esc(e.to)}"`);
  }
  for (const m of cards.values()) {
    const tone = palette[m.node.tone] || palette.process;
    c.region(`node-${s.id}-${m.key}`, m.x, m.y, m.w, m.h, tone.fill, 'none', `node node-${m.node.tone}`);
    c.text(m.x + 20, m.y + 28, `${m.node.number}${m.compact ? ' · 同一节点' : ''}`, 16, tone.ink, 750, 'class="mono"');
    let ty = m.y + 65;
    for (const line of m.titles) { c.text(m.x + 22, ty, line, m.compact ? 25 : 28, tone.ink, 700); ty += 39; }
    ty += 4;
    for (const line of m.body) { c.text(m.x + 22, ty, line, 23, colors.ink); ty += 34; }
    c.end();
  }
  for (const route of routes) {
    const [x, yy] = route.label;
    const w = Math.max(...route.lines.map(line => widthOf(line, 21))) + 18, h = route.lines.length * 32 + 8;
    c.rect(x - w / 2, yy - h / 2, w, h, '#fff', 'none', 6);
    route.lines.forEach((line, i) => c.text(x, yy - (route.lines.length - 1) * 16 + 7 + i * 32, line, 21,
      colors[route.semantic.kind === 'data' ? 'input' : route.semantic.kind] || colors.muted, 600,
      `text-anchor="middle" class="edge-label" data-edge-id="e${route.index}"`));
  }
  c.end(); c.end();
  return y + height;
}
