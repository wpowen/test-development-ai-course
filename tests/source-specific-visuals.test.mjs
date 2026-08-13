import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("..", import.meta.url));
const root = path.dirname(siteRoot);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const packages = {
  career: {
    canonical: path.join(root, "courses/td-ai-career-evolution/learner-materials"),
    public: path.join(siteRoot, "public/materials/career-evolution"),
    required: {
      comparison: "career-role-comparison.svg",
      mindmap: "career-capability-mindmap.svg",
      pie: "career-capability-allocation.svg",
      lifecycle: "career-evidence-lifecycle.svg",
      ladder: "career-responsibility-ladder.svg",
      radar: "career-evidence-radar.svg",
      gantt: "career-evidence-gantt.svg",
      path: "career-background-paths.svg",
      quadrant: "career-priority-quadrant.svg",
    },
  },
  agent: {
    canonical: path.join(root, "courses/td-ai-agent-architecture-system/learner-materials"),
    public: path.join(siteRoot, "public/materials/agent-architecture-system"),
    required: {
      architecture: "AG-DIM-ARCHITECTURE.svg",
      four_ring: "AG-DIM-FOUR-RINGS.svg",
      gate: "AG-DIM-GATE.svg",
      dimensions: "AG-DIM-36.svg",
    },
  },
};

test("source-specific visual manifests preserve purpose, provenance, alt, caption, and evidence boundary", async () => {
  for (const [packageName, contract] of Object.entries(packages)) {
    const manifestPath = path.join(contract.canonical, "source-visual-manifest.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    assert.equal(manifest.schema_version, "1.0.0");
    assert.match(manifest.source.sha256, /^[a-f0-9]{64}$/);
    assert.ok(manifest.source.locators.length >= 3);

    const byKind = new Map(manifest.visuals.map((visual) => [visual.kind, visual]));
    for (const [kind, file] of Object.entries(contract.required)) {
      const visual = byKind.get(kind);
      assert.ok(visual, `${packageName} missing ${kind} manifest record`);
      assert.equal(visual.rendered_path, `visuals/${file}`);
      assert.ok(visual.purpose.length >= 20, `${kind} needs a decision purpose`);
      assert.ok(visual.alt_text.length >= 30, `${kind} needs useful alt text`);
      assert.ok(visual.caption.length >= 30, `${kind} needs a teaching caption`);
      assert.match(visual.not_proof, /不证明|NOT_RUN|Unknown|UNKNOWN/);
      assert.ok(visual.source_refs.length >= 1);
      assert.ok(visual.nodes.length >= 4);
      assert.ok(visual.relationships.length >= 3);
      const rendered = await readFile(path.join(contract.canonical, visual.rendered_path));
      assert.equal(visual.sha256, sha256(rendered), `${visual.visual_id} manifest hash drifted`);
      const editable = await readFile(path.join(contract.canonical, visual.editable_path));
      const publicEditable = await readFile(path.join(contract.public, visual.editable_path));
      assert.deepEqual(publicEditable, editable, `${visual.visual_id} editable source did not reach public`);
    }
    const canonicalManifest = await readFile(manifestPath);
    const publicManifest = await readFile(path.join(contract.public, "source-visual-manifest.json"));
    assert.deepEqual(publicManifest, canonicalManifest, `${packageName} manifest did not reach public`);
  }
});

test("career source functions render as nine distinct, inspectable SVGs", async () => {
  const contract = packages.career;
  const hashes = [];
  for (const [kind, file] of Object.entries(contract.required)) {
    const canonical = await readFile(path.join(contract.canonical, "visuals", file));
    const publicBytes = await readFile(path.join(contract.public, "visuals", file));
    assert.deepEqual(publicBytes, canonical, `${file} public projection drifted`);
    hashes.push(sha256(canonical));
    const svg = canonical.toString("utf8");
    assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
    assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
    assert.match(svg, /source-ref=/);
    assert.match(svg, /不证明|INTERNAL-UNKNOWN|来源示例|示例数据/);
    assert.ok(svg.length >= 2500, `${kind} is still a thin placeholder`);
  }
  assert.equal(new Set(hashes).size, hashes.length, "career visual kinds must not share one generic SVG");
});

test("career fixed weights, years, and organization levels stay scoped or parameterized", async () => {
  const rootPath = packages.career.canonical;
  const manifest = await readFile(path.join(rootPath, "source-visual-manifest.json"), "utf8");
  const source = await readFile(path.join(rootPath, "visuals/career-visual-source.json"), "utf8");
  for (const text of [manifest, source]) {
    assert.match(text, /SOURCE-EXAMPLE/);
    assert.match(text, /INTERNAL-UNKNOWN/);
    assert.match(text, /owner/);
    assert.match(text, /parameter/i);
  }
});

test("Agent architecture, four rings, gate, and 36 dimensions are separate semantic visuals", async () => {
  const contract = packages.agent;
  const files = [...new Set(Object.values(contract.required))];
  const hashes = [];
  for (const file of files) {
    const canonical = await readFile(path.join(contract.canonical, "visuals", file));
    const publicBytes = await readFile(path.join(contract.public, "visuals", file));
    assert.deepEqual(publicBytes, canonical, `${file} public projection drifted`);
    hashes.push(sha256(canonical));
    const svg = canonical.toString("utf8");
    assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
    assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
    assert.match(svg, /不代表|不证明|NOT_RUN|参数化/);
  }
  assert.equal(new Set(hashes).size, files.length);

  const architecture = await readFile(path.join(contract.canonical, "visuals/AG-DIM-ARCHITECTURE.svg"), "utf8");
  for (let domain = 0; domain <= 7; domain += 1) assert.ok(architecture.includes(`D${domain}`));
  for (const term of ["输入与风险", "评估可信", "运行时护栏", "决策与反馈", "失败回灌"]) assert.ok(architecture.includes(term));

  const dimensions = await readFile(path.join(contract.canonical, "visuals/AG-DIM-36.svg"), "utf8");
  const dimensionLabels = dimensions.match(/D[0-7]-[1-6]/g) ?? [];
  assert.equal(new Set(dimensionLabels).size, 36, "36-dimension visual must name every dimension exactly enough to audit coverage");

  const rings = await readFile(path.join(contract.canonical, "visuals/AG-DIM-FOUR-RINGS.svg"), "utf8");
  for (const term of ["离线 fixture", "受控沙箱", "影子 / 灰度", "在线持续", "entry", "exit", "rollback", "NOT_RUN"]) {
    assert.ok(rings.includes(term), `four-ring visual missing ${term}`);
  }
  assert.doesNotMatch(rings, /≤\s*10\s*min|≤\s*2\s*h|3[–-]7\s*天|1[–-]10%/);

  const gate = await readFile(path.join(contract.canonical, "visuals/AG-DIM-GATE.svg"), "utf8");
  assert.match(gate, /Metric Card|owner|参数/);
  assert.doesNotMatch(gate, /κ\s*[≥>]\s*0\.7/);
});
