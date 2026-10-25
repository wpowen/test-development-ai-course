import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import { pages } from "../content/course.ts";
import { buildBrowserLabSpec } from "../app/browser-lab-contract.ts";

test("every published Python command maps to a browser archive and exact workspace", async () => {
  const specs = [];
  for (const page of pages) page.blocks.forEach((block, blockIndex) => {
    if (block.technical?.kind === "command") specs.push(buildBrowserLabSpec(page.id, blockIndex, block));
  });
  assert.equal(specs.length, 133);
  for (const spec of specs) {
    assert.equal(spec.kind, "python");
    assert.match(spec.archiveHref, /^materials\/[a-z0-9-]+\.zip$/);
    assert.match(spec.command, /^python3 /m);
    assert.ok(spec.workingDirectory.startsWith(spec.archiveRoot));
    assert.ok(Number.isInteger(spec.expectedExitCode));
    assert.ok(Array.isArray(spec.expectedArtifacts));
    await access(new URL(`../public/${spec.archiveHref}`, import.meta.url));
  }
});

test("every published prompt opens its complete package instead of placeholder text", () => {
  const specs = [];
  for (const page of pages) page.blocks.forEach((block, blockIndex) => {
    if (block.technical?.kind === "prompt") specs.push(buildBrowserLabSpec(page.id, blockIndex, block));
  });
  assert.equal(specs.length, 104);
  for (const spec of specs) {
    assert.equal(spec.kind, "prompt");
    assert.match(spec.promptHref, /^materials\//);
    assert.match(spec.inputHref, /^materials\//);
    assert.match(spec.schemaHref, /^materials\//);
    assert.match(spec.evaluationHref, /^materials\//);
    assert.match(spec.manifestHref, /^materials\//);
  }
});

test("formula, diagram and pseudocode are labelled explanatory instead of broken", () => {
  for (const kind of ["formula", "diagram", "pseudocode"]) {
    const spec = buildBrowserLabSpec("TEST", 0, {
      title: kind,
      body: [kind],
      technical: { kind, content: `${kind} content`, verification: "review evidence" },
    });
    assert.equal(spec.kind, "explanation");
    assert.equal(spec.actionLabel, "查看说明");
    assert.doesNotMatch(spec.statusLabel, /不可复制|没有/);
  }
});

test("browser worker pins Pyodide and preserves the fixture evidence boundary", async () => {
  const worker = await readFile(new URL("../public/pyodide-lab-worker.js", import.meta.url), "utf8");
  assert.match(worker, /pyodide\/v314\.0\.4\/full\/pyodide\.mjs/);
  assert.match(worker, /unpackArchive/);
  assert.match(worker, /fixture-tested/);
  assert.match(worker, /subprocess/);
  assert.match(worker, /hashlib\.sha256/);
  assert.match(worker, /artifact_checks/);
  assert.match(worker, /sys\.path\.insert\(0, workspace\)/);
});
