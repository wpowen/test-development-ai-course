import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { pages } from "../content/course.ts";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("architecture visuals are local SVGs with an explicitly bounded native-image exception", () => {
  const visuals = pages
    .map((page) => ({ id: page.id, visual: page.architecture?.visual }))
    .filter(({ visual }) => visual);

  assert.ok(visuals.length > 0, "the course should contain architecture visuals");
  for (const { id, visual } of visuals) {
    assert.match(visual.src, /^(?:\/?(?:visuals|materials)\/).+\.svg$/, `${id} must use a local SVG visual`);
    assert.ok(visual.alt.trim().length > 0, `${id} must provide meaningful alternative text`);
  }

  assert.match(
    pageSource,
    /eslint-disable-next-line @next\/next\/no-img-element -- local SVG architecture diagrams are already static assets; preserve direct SVG loading and browser-native zoom/,
    "the lint exception must explain why this one native image is intentional",
  );
  assert.match(
    pageSource,
    /<img src=\{current\.architecture\.visual\.src\} alt=\{current\.architecture\.visual\.alt\} loading="lazy" decoding="async" \/>/,
    "architecture images must defer loading and decoding",
  );
});
