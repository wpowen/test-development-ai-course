import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {test} from 'node:test';
import {runtimePackage} from '../scripts/visuals/runtime.mjs';
import {renderSpec, widthOf} from '../scripts/visuals/renderer.mjs';
import {createDotSource, dimensionsFor, planRailGraph, wrapText, bridgedPath} from '../scripts/visuals/routing.mjs';

const {instance} = await import(pathToFileURL(runtimePackage('@viz-js/viz')));
const viz = await instance();
const wrap = (text, width, size) => wrapText(text, width, size, widthOf);
const specs = [];
for (const [file, id] of [['course-1', 'TD-P03'], ['course-2', 'TD-T16'], ['materials', 'AG-DIM-ARCHITECTURE']]) {
  specs.push((await import(`../scripts/visuals/specs/${file}.mjs`)).default.find(spec => spec.id === id));
}
const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const normalize = text => text.replace(/\s/g, '');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

for (const spec of specs) {
  test(`${spec.id}: bounded two-column rails preserve every condition and every independent port`, () => {
    const before = JSON.stringify(spec);
    const plan = planRailGraph(spec, dimensionsFor(spec, wrap, widthOf), spec.ranks, wrap, widthOf);
    assert.equal(plan.width, 1424);
    assert.ok(plan.ranks.every(row => row.length <= 2));
    assert.equal(plan.edges.length, spec.edges.length);
    const ports = new Set();
    for (const node of plan.nodes.values()) {
      assert.ok(node.w >= 354);
      assert.ok(node.x >= 0 && node.x + node.w <= plan.width);
      assert.ok(node.y >= 0 && node.y + node.h <= plan.height);
      for (const other of plan.nodes.values()) if (other !== node) assert.ok(!intersects(node, other));
    }
    const labelBoxes = [];
    for (const route of plan.edges) {
      assert.equal(normalize(route.label.lines.join('')), normalize(`${String(route.index + 1).padStart(2, '0')} ${route.edge.label}`));
      const box = {x: route.label.x - route.label.w / 2, y: route.label.y - route.label.h / 2, w: route.label.w, h: route.label.h};
      assert.ok(box.x >= 0 && box.x + box.w <= plan.width);
      assert.ok(box.y >= 0 && box.y + box.h <= plan.height);
      assert.ok([...plan.nodes.values(), ...labelBoxes].every(other => !intersects(box, other)));
      labelBoxes.push(box);
      for (const [id, port] of [[route.edge.from, route.sourcePort], [route.edge.to, route.targetPort]]) {
        const key = id + '/' + port.join(',');
        assert.ok(!ports.has(key), `shared port ${key}`); ports.add(key);
      }
      for (let i = 1; i < route.points.length; i++) {
        const a = route.points[i - 1], b = route.points[i];
        assert.ok(a[0] === b[0] || a[1] === b[1], 'all rails are axis-aligned before bridge decoration');
        assert.ok(a[0] >= 0 && a[0] <= plan.width);
        assert.ok(a[1] >= 0 && a[1] <= plan.height);
      }
      const horizontal = route.points.slice(1).some((point, i) => point[1] === route.label.y && route.points[i][1] === route.label.y
        && route.label.x >= Math.min(point[0], route.points[i][0]) && route.label.x <= Math.max(point[0], route.points[i][0]));
      assert.ok(horizontal, 'a condition is centered on its own edge, never a detached callout');
    }
    assert.equal(JSON.stringify(spec), before, 'layout must not modify specs');
  });

  test(`${spec.id}: distinct semantic edges never share a collinear run`, () => {
    const plan = planRailGraph(spec, dimensionsFor(spec, wrap, widthOf), spec.ranks, wrap, widthOf);
    for (let a = 0; a < plan.edges.length; a++) for (let b = a + 1; b < plan.edges.length; b++) {
      const first = plan.edges[a].points, second = plan.edges[b].points;
      for (let i = 1; i < first.length; i++) for (let j = 1; j < second.length; j++) {
        const [p, q, r, s] = [first[i - 1], first[i], second[j - 1], second[j]];
        if (p[0] === q[0] && r[0] === s[0] && p[0] === r[0]) {
          assert.ok(Math.min(Math.max(p[1], q[1]), Math.max(r[1], s[1])) - Math.max(Math.min(p[1], q[1]), Math.min(r[1], s[1])) <= 1,
            `${a + 1}/${b + 1}: shared vertical run`);
        }
        if (p[1] === q[1] && r[1] === s[1] && p[1] === r[1]) {
          assert.ok(Math.min(Math.max(p[0], q[0]), Math.max(r[0], s[0])) - Math.max(Math.min(p[0], q[0]), Math.min(r[0], s[0])) <= 1,
            `${a + 1}/${b + 1}: shared horizontal run`);
        }
      }
    }
  });

  test(`${spec.id}: integrated renderer keeps 23px body type and exact semantic edge inventory`, async () => {
    const svg = await renderSpec(spec, viz);
    const scale = Number(svg.match(/data-graph-scale="([^"]+)"/)[1]);
    assert.ok(scale >= 0.78, `graph scale ${scale}`);
    assert.ok(23 * scale >= 18);
    assert.ok(svg.includes('data-routing="outer-rails"'), 'complex topology must use independent rails');
    const edges = [...svg.matchAll(/data-edge-id="e(\d+)" data-from="([^"]+)" data-to="([^"]+)"/g)];
    assert.equal(edges.length, spec.edges.length);
    for (const [i, match] of edges.entries()) assert.deepEqual(match.slice(1), [String(i), spec.edges[i].from, spec.edges[i].to]);
  });
}

test('dot uses an actual layout engine with independently named ports and label dimensions', () => {
  const spec = {nodes: [{id: 'a', title: '请求', body: ['批准任务']}, {id: 'b', title: '决定', body: ['核验权限']}],
    edges: [{from: 'a', to: 'b', label: '权限核验通过', kind: 'control'}]};
  const source = createDotSource(spec, dimensionsFor(spec, wrap, widthOf), [['a'], ['b']], wrap, widthOf);
  const result = viz.render(source, {engine: 'dot', format: 'json'});
  assert.equal(result.status, 'success');
  const graph = JSON.parse(result.output), edge = graph.edges.find(edge => edge.id === 'e0');
  assert.ok(edge.lp && edge._draw_.some(draw => draw.op === 'b'));
  assert.notEqual(edge.tailport, edge.headport);
  const labelWidth = edge._ldraw_.find(draw => draw.op === 'T')?.width ?? 0;
  assert.ok(labelWidth <= widthOf(spec.edges[0].label, 21) + 24);
});

test('crossings use bridge arcs instead of looking like electrical junctions', () => {
  const a = {points: [[0, 50], [100, 50]]}, b = {points: [[50, 0], [50, 100]]};
  assert.match(bridgedPath(a, [a, b]), / Q50 38 55 50/);
  assert.equal(bridgedPath(a, [a]), 'M0 50 L100 50');
});

test('modules retain their original snake ranks and nop2 learning path', async () => {
  const spec = (await import('../scripts/visuals/specs/modules.mjs')).default.find(spec => spec.id === 'TD-M00');
  const before = JSON.stringify(spec), engines = [];
  const svg = await renderSpec(spec, {render(source, options) { engines.push(options.engine); return viz.render(source, options); }});
  assert.deepEqual(engines, ['nop2']);
  assert.equal(JSON.stringify(spec), before);
  assert.ok(Number(svg.match(/data-graph-scale="([^"]+)"/)[1]) >= 0.78);
});

test('approved TD-M04 source, candidate and formal bytes remain equal to the experiment snapshot', async () => {
  const report = JSON.parse(await readFile(new URL('../output/routing-experiment/report.json', import.meta.url), 'utf8'));
  for (const [path, hash] of Object.entries(report.approvedHashes)) {
    assert.equal(sha(await readFile(new URL('../' + path, import.meta.url))), hash, path);
  }
});
