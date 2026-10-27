import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {test} from 'node:test';
import {renderSpec} from '../scripts/visuals/renderer.mjs';
import {runtimePackage} from '../scripts/visuals/runtime.mjs';

const {instance} = await import(pathToFileURL(runtimePackage('@viz-js/viz')));
const viz = await instance();
function assertClosed(svg, spec) {
  const paths = [...svg.matchAll(/<path\b[^>]*data-edge-id="e(\d+)" data-from="([^"]+)" data-to="([^"]+)"/g)];
  assert.equal(paths.length, spec.edges.length, `${spec.id}: drawable edge count`);
  const ids = new Set();
  for (const path of paths) {
    const index = Number(path[1]);
    assert.ok(!ids.has(index), `${spec.id}: duplicate drawable edge`); ids.add(index);
    assert.deepEqual(path.slice(2), [spec.edges[index].from, spec.edges[index].to]);
  }
}

for (const [file, id, count] of [
  ['aliases', 'TD-T26-compat', 10], ['course-1', 'TD-PS02', 10],
  ['course-3', 'TD-B01', 8], ['materials', 'career-evidence-lifecycle', 10],
]) {
  test(`${id}: successful Graphviz status cannot drop a semantic edge`, async () => {
    const spec = (await import(`../scripts/visuals/specs/${file}.mjs`)).default.find(spec => spec.id === id);
    assert.equal(spec.edges.length, count);
    const svg = await renderSpec(spec, viz);
    assertClosed(svg, spec);
    assert.ok(svg.includes('data-routing="outer-rails"'));
  });
}

const spec = {id: 'routing-drop-fixture', path: 'visuals/course/routing-drop-fixture.svg', layout: 'flow',
  title: '连线闭包', thesis: '任何语义边都必须有可绘制路径。', focus: '独立边检查',
  nodes: [{id: 'a', title: '输入', body: ['批准任务']}, {id: 'b', title: '结果', body: ['保留证据']}],
  edges: [{from: 'a', to: 'b', label: '核验通过', kind: 'data'}], ranks: [['a'], ['b']],
  sections: [], failure: '缺边阻断。', outcome: '完整路径。', boundary: '测试夹具。'};

for (const [name, mutate] of [
  ['missing semantic edge', graph => {graph.edges = graph.edges.filter(edge => edge.id !== 'e0');}],
  ['missing _draw_', graph => {delete graph.edges.find(edge => edge.id === 'e0')._draw_;}],
  ['no b command', graph => {graph.edges.find(edge => edge.id === 'e0')._draw_ = [{op: 'c', color: '#000000'}];}],
  ['empty b points', graph => {graph.edges.find(edge => edge.id === 'e0')._draw_ = [{op: 'b', points: []}];}],
  ['duplicate semantic id', graph => {graph.edges.push({...graph.edges.find(edge => edge.id === 'e0')});}],
  ['wrong endpoint', graph => {const edge = graph.edges.find(edge => edge.id === 'e0'); edge.head = edge.tail;}],
]) {
  test(`dot ${name} falls back before drawing a partial graph`, async () => {
    const svg = await renderSpec(spec, {render(source, options) {
      const result = viz.render(source, options), graph = JSON.parse(result.output);
      mutate(graph);
      return {...result, output: JSON.stringify(graph)};
    }});
    assert.ok(svg.includes('data-routing="outer-rails"'));
    assertClosed(svg, spec);
  });
}

test('nonempty errors on successful dot result always fall back', async () => {
  const svg = await renderSpec(spec, {render(source, options) {
    return {...viz.render(source, options), status: 'success', errors: [{level: 'warning', message: 'triangulation failed'}]};
  }});
  assert.ok(svg.includes('data-routing="outer-rails"'));
  assertClosed(svg, spec);
});
