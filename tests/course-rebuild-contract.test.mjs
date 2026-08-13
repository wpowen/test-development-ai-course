import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { pages, releaseScope } from "../content/course.ts";

const siteRoot = fileURLToPath(new URL("..", import.meta.url));
const packageRoot = path.resolve(siteRoot, "..");

const readJson = async (relativePath) => {
  const absolutePath = path.join(packageRoot, relativePath);
  return JSON.parse(await readFile(absolutePath, "utf8"));
};

const readJsonOrNull = async (relativePath) => {
  try {
    return await readJson(relativePath);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};

const exists = async (relativePath) => {
  await access(path.join(packageRoot, relativePath));
};

const publicPageIds = () => releaseScope.promisedPageIds;

test("course rebuild assigns learner-facing display_number continuously to every public page", () => {
  assert.equal(pages.length, publicPageIds().length, "public scope and page data must have the same cardinality");
  const numbers = pages.map((page) => page.display_number);
  assert.deepEqual(numbers, Array.from({ length: pages.length }, (_, index) => index + 1));
});

test("source assimilation closes all 198 sections and 413 atoms with zero UNMAPPED items", async () => {
  const ledger = await readJsonOrNull("research/source-assimilation-ledger.json");
  assert.ok(ledger, "course rebuild must generate research/source-assimilation-ledger.json");
  assert.equal(ledger.coverage_receipt?.source_count, 2);
  assert.equal(ledger.coverage_receipt?.section_count, 198);
  assert.equal(ledger.coverage_receipt?.atom_count, 413);
  assert.equal(ledger.coverage_receipt?.unaccounted_ids?.length, 0);
  assert.equal(ledger.coverage_receipt?.verdict, "PASS");
  assert.equal(ledger.sections?.length, 198);
  assert.equal(ledger.atoms?.length, 413);

  for (const item of [...(ledger.sections ?? []), ...(ledger.atoms ?? [])]) {
    assert.ok(["incorporated", "adapted", "rejected", "blocked", "superseded"].includes(item.disposition), `${item.id} has invalid disposition`);
    if (["incorporated", "adapted"].includes(item.disposition)) {
      assert.ok(Array.isArray(item.target_refs) && item.target_refs.length > 0, `${item.id} needs learner-facing target_refs`);
      for (const target of item.target_refs) await exists(target);
    }
  }
});

test("source-detected career and Agent obligations have explicit capability declarations", async () => {
  const ledger = await readJsonOrNull("research/source-assimilation-ledger.json");
  const declarations = await readJsonOrNull("research/capability-declarations.json");
  assert.ok(ledger, "source ledger is required before capability promotion");
  assert.ok(declarations, "capability declarations are required");
  const detected = new Set((ledger.sources ?? []).flatMap((source) => source.detected_obligations ?? []));
  assert.ok(detected.has("career-evolution-system"));
  assert.ok(detected.has("agent-architecture-testing"));
  const active = new Map((declarations.capabilities ?? []).map((item) => [item.capability, item]));
  for (const capability of ["career-evolution-system", "agent-architecture-testing"]) {
    const declaration = active.get(capability);
    assert.ok(declaration, `${capability} must be explicitly declared`);
    assert.ok(Array.isArray(declaration.topics) && declaration.topics.length > 0, `${capability} needs exact topic/page IDs`);
    assert.ok(declaration.owner, `${capability} needs an accountable owner`);
    assert.ok(Array.isArray(declaration.evidence) && declaration.evidence.length > 0, `${capability} needs evidence refs`);
  }
});

test("career and Agent adapter provides evidence states, D0-D7 domains, rings, and metric semantics", async () => {
  const adapter = await readJsonOrNull("research/software-testing-career-agent-adapter.json");
  assert.ok(adapter, "career/Agent adapter is required");
  assert.deepEqual(new Set(adapter.responsibility_states?.map((item) => item.state_id)), new Set([
    "guided-execution",
    "independent-scoped-ownership",
    "system-cross-team-leverage",
    "strategy-governance-mentoring",
  ]));
  assert.deepEqual(new Set(adapter.agent_domains?.map((item) => item.domain_id)), new Set([
    "D0-evaluation-trust",
    "D1-single-agent-capability",
    "D2-orchestration-multi-agent",
    "D3-interaction-collaboration",
    "D4-robustness-reliability",
    "D5-security-adversarial",
    "D6-efficiency-economics",
    "D7-business-governance",
  ]));
  assert.equal(adapter.evidence_rings?.length, 4);
  assert.ok(adapter.organization_level_adapter?.default_status === "INTERNAL-UNKNOWN");
  assert.ok(adapter.statistical_semantics?.pass_at_k);
  assert.ok(adapter.statistical_semantics?.pass_power_k || adapter.statistical_semantics?.pass_caret_k);
  assert.ok(adapter.metric_card_policy?.required_fields?.length > 0);
  assert.ok(adapter.maturity_boundary);
});

test("every public page has a beginner/reuse record with executable learner action and artifact contract", async () => {
  const contract = await readJsonOrNull("research/learner-usability-reuse.json");
  assert.ok(contract, "learner usability contract is required");
  const byId = new Map((contract.pages ?? []).map((page) => [page.page_id, page]));
  assert.deepEqual(new Set(byId.keys()), new Set(publicPageIds()));
  for (const [index, pageId] of publicPageIds().entries()) {
    const page = byId.get(pageId);
    assert.ok(page, `${pageId} learner record is missing`);
    assert.equal(page.display_number, index + 1);
    assert.ok(page.mental_model && page.worked_example?.input && page.worked_example?.expected_observation);
    assert.ok(page.counterexample?.input && page.counterexample?.expected_observation);
    assert.ok(page.learner_action?.input_ref && page.learner_action?.action && page.learner_action?.expected_result);
    await exists(page.learner_action.input_ref);
    assert.ok(page.failure_diagnosis?.symptom && page.failure_diagnosis?.repair && page.failure_diagnosis?.rerun_check);
    assert.ok(page.comprehension_checks?.length > 0);
    assert.ok(page.reusable_artifacts?.length > 0);
    for (const artifact of page.reusable_artifacts) {
      await exists(artifact.path);
      assert.ok(artifact.inputs?.length && artifact.editable_fields?.length && artifact.outputs?.length);
      assert.ok(artifact.adaptation_steps?.length >= 2);
      assert.ok(artifact.validation?.method && artifact.validation?.expected_evidence);
    }
  }
});

test("foundation terms are introduced before any dependent page uses them", async () => {
  const contract = await readJsonOrNull("research/learner-usability-reuse.json");
  assert.ok(contract, "learner usability contract is required");
  const seen = new Set();
  for (const page of [...(contract.pages ?? [])].sort((a, b) => a.display_number - b.display_number)) {
    const introduced = new Set((page.terms_introduced ?? []).map((item) => item.term.toLowerCase()));
    const assumed = new Set((page.assumed_knowledge ?? []).map((term) => term.toLowerCase()));
    for (const term of page.terms_used ?? []) {
      assert.ok(seen.has(term.toLowerCase()) || introduced.has(term.toLowerCase()) || assumed.has(term.toLowerCase()), `${page.page_id} uses ${term} before definition`);
    }
    for (const term of introduced) seen.add(term);
  }
  for (const term of ["prompt", "rag", "agent", "workflow", "oracle", "dataset", "metric"]) {
    assert.ok(seen.has(term), `foundation term ${term} must be defined`);
  }
});

test("every public page has a unique, hash-pinned, non-generic repository visual", async () => {
  const manifest = await readJsonOrNull("research/visual-sequence-manifest.json");
  assert.ok(manifest, "visual sequence manifest is required");
  assert.deepEqual(manifest.ordered_page_ids, publicPageIds());
  const paths = new Set();
  for (const page of manifest.pages ?? []) {
    assert.ok(page.display_number >= 1);
    assert.ok(page.visuals?.length > 0, `${page.page_id} needs visual artifacts`);
    for (const visual of page.visuals) {
      assert.ok(/\.(svg|mmd|mermaid)$/i.test(visual.source_path), `${page.page_id} visual must be SVG/Mermaid source`);
      assert.ok(visual.source_hash, `${page.page_id} visual must be hash pinned`);
      assert.ok(!paths.has(visual.source_path), `${page.page_id} reuses a visual path`);
      paths.add(visual.source_path);
      await exists(visual.source_path);
      assert.ok(visual.source_path.includes(page.page_id) || visual.source_path.includes(visual.visual_id), `${page.page_id} visual path is generic`);
      assert.ok(visual.nodes?.length >= 5 && visual.edges?.length >= 4);
      assert.ok(visual.alt_text && visual.caption && visual.source_refs?.length);
    }
  }
});

test("course rebuild publishes exactly 17 new pages with a closed earlier-prerequisite order", async () => {
  const plan = await readJsonOrNull("research/course-rebuild/new-page-plan.json");
  assert.ok(plan, "course rebuild must publish a 17-page plan before implementation");
  assert.equal(plan.pages?.length, 17);
  const ids = plan.pages.map((page) => page.page_id);
  assert.equal(new Set(ids).size, 17);
  const publicIds = new Set(publicPageIds());
  const planIndex = new Map(ids.map((id, index) => [id, index]));
  for (const page of plan.pages) {
    assert.ok(publicIds.has(page.page_id), `${page.page_id} is not published`);
    for (const prerequisite of page.prerequisite_ids ?? []) {
      assert.ok(publicIds.has(prerequisite), `${page.page_id} prerequisite ${prerequisite} is unknown`);
      if (planIndex.has(prerequisite)) assert.ok(planIndex.get(prerequisite) < planIndex.get(page.page_id), `${page.page_id} prerequisite ${prerequisite} must appear earlier`);
    }
  }
});
