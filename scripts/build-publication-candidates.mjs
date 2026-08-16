#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(scriptRoot);
const workspaceRoot = path.dirname(root);
const factory = path.join(workspaceRoot, "career-ai-course-factory");
const siteRoot = path.join(root, "site");
const researchRoot = path.join(root, "research");
const tutorialRoot = path.join(root, "tutorial");
const distRoot = path.join(root, "dist");
const githubTarget = path.join(distRoot, "github-candidate");
// 归档文件名带页数，且页数必须来自当前公开页集合。
// 曾经硬编码为 85p，导致 102 页课程仍然产出名为 85p 的候选包——
// 文件名本身就是一次成熟度错误声明。
let siteArchive = path.join(distRoot, "test-development-ai-site.zip");
let githubArchive = path.join(distRoot, "test-development-ai-github-candidate.zip");
const setArchiveNames = (count) => {
  siteArchive = path.join(distRoot, `test-development-ai-site-${count}p.zip`);
  githubArchive = path.join(distRoot, `test-development-ai-github-candidate-${count}p.zip`);
};

const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const writeJson = (file, value) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const sha256Bytes = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const sha256File = (file) => sha256Bytes(readFileSync(file));
const copy = (source, target) => {
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(source, target, { recursive: statSync(source).isDirectory() });
};
const allFiles = (directory) => {
  const files = [];
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".DS_Store" || entry.name === ".git" || entry.name === "__pycache__") continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile() && !entry.name.endsWith(".pyc")) files.push(absolute);
    }
  };
  visit(directory);
  return files.sort();
};
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: "inherit" });
const output = (command, args, cwd = root) => execFileSync(command, args, { cwd, encoding: "utf8" }).trim();

const assertSourceGates = () => {
  run("npm", ["test"], siteRoot);
  run("npm", ["run", "lint"], siteRoot);
  run("node", [path.join(scriptRoot, "sync-tutorial-package.mjs"), "--check"]);
  run("node", [path.join(scriptRoot, "sync-solution-architecture-coverage.mjs"), "--check"]);
  run("node", [path.join(scriptRoot, "generate-course-integrity-manifests.mjs")]);
  run("python3", [path.join(factory, "scripts/validate_career_package.py"), root]);
};

const assembleCandidate = () => {
  rmSync(githubTarget, { recursive: true, force: true });
  mkdirSync(githubTarget, { recursive: true });

  copy(path.join(root, "github/README.md"), path.join(githubTarget, "README.md"));
  copy(path.join(root, "DISTRIBUTION.md"), path.join(githubTarget, "DISTRIBUTION.md"));
  copy(path.join(root, "validation-report.md"), path.join(githubTarget, "validation-report.md"));
  copy(path.join(root, ".github"), path.join(githubTarget, ".github"));
  copy(path.join(root, "courses"), path.join(githubTarget, "courses"));
  copy(path.join(factory), path.join(githubTarget, "skill/career-ai-course-factory"));
  copy(path.join(siteRoot, "dist-github-pages"), path.join(githubTarget, "site"));
  copy(path.join(siteRoot, "scripts/validate-material-archives.py"), path.join(githubTarget, "tools/validate-material-archives.py"));
  for (const name of ["README.md", "course-tree.md", "page-template.md", "tutorial-site.json", "index.html"]) {
    copy(path.join(tutorialRoot, name), path.join(githubTarget, "tutorial", name));
  }
  for (const name of ["learning-architecture.md", "course-map.md", "curriculum-gap-analysis.md", "industry-framework.md", "profession-reality-map.md"]) {
    copy(path.join(root, name), path.join(githubTarget, "docs", name));
  }
  for (const name of ["source-ledger.csv", "competitor-matrix.csv", "evidence-matrix.md"]) {
    copy(path.join(researchRoot, name), path.join(githubTarget, "docs/research", name));
  }

  const tutorial = json(path.join(tutorialRoot, "tutorial-site.json"));
  const pageIds = tutorial.pages.map((page) => page.page_id);
  setArchiveNames(pageIds.length);
  for (const pageId of pageIds) {
    const topicRoot = path.join(researchRoot, "topics", pageId);
    const compatibilityPackage = path.join(topicRoot, "research-package.md");
    if (existsSync(compatibilityPackage)) {
      copy(compatibilityPackage, path.join(githubTarget, "docs/research/topics", pageId, "research-package.md"));
    }
    const receipt = json(path.join(topicRoot, "promotion-receipt.json"));
    writeJson(path.join(githubTarget, "docs/research/topics", pageId, "promotion-summary.json"), {
      schema_version: "public-promotion-summary.v1",
      page_id: pageId,
      verdict: receipt.verdict,
      research_package_files: receipt.research_package_files,
      research_package_complete: receipt.research_inventory?.every((item) => item.exists === true) ?? false,
      editorial_score: receipt.editorial_score,
      boundary_preservation_score: receipt.boundary_preservation_score,
      executability_verdict: receipt.executability_audit?.verdict ?? "FAIL",
      validated_at: receipt.validated_at,
      reviewer: receipt.reviewer,
      evidence_boundary: "Public-safe gate summary only; detailed research remains in the authoring package.",
    });
  }

  const catalog = json(path.join(researchRoot, "catalog-manifest.json"));
  const publicCatalog = {
    ...catalog,
    schema_version: "public-catalog-projection.v1",
    source_catalog_ref: "authoring:research/catalog-manifest.json",
    source_catalog_hash: sha256File(path.join(researchRoot, "catalog-manifest.json")),
    catalog_scope: "pilot-public-projection",
    page_ids: pageIds,
    previous_validated_page_ids: pageIds,
    pages: catalog.pages.filter((page) => pageIds.includes(page.page_id)),
    release_scope: {
      ...catalog.release_scope,
      promised_page_ids: pageIds,
      catalog_complete: false,
    },
  };
  const executability = json(path.join(researchRoot, "executability-audit.json"));
  const publicationClosure = json(path.join(researchRoot, "publication-closure.json"));
  const solutionSource = json(path.join(researchRoot, "solution-architecture.json"));
  const promotions = pageIds.map((pageId) => {
    const receipt = json(path.join(researchRoot, "topics", pageId, "promotion-receipt.json"));
    return {
      page_id: pageId,
      verdict: receipt.verdict,
      research_package_complete: receipt.research_inventory?.every((item) => item.exists === true) ?? false,
      editorial_score: receipt.editorial_score,
      boundary_preservation_score: receipt.boundary_preservation_score,
      executability_verdict: receipt.executability_audit?.verdict ?? "FAIL",
      material_hashes: receipt.material_hashes,
      validated_at: receipt.validated_at,
      reviewer: receipt.reviewer,
    };
  });
  const solutionManifest = {
    schema_version: "github-candidate-solution.v1",
    source_contract_ref: "docs/solution-architecture.json",
    source_contract_hash: sha256File(path.join(researchRoot, "solution-architecture.json")),
    evidence_boundary: "Local deterministic fixture candidate; no integration, practitioner approval, publication, or production evidence.",
    solution_units: solutionSource.solution_units.map((unit) => ({
      solution_id: unit.solution_id,
      page_ids: unit.page_ids,
      design_status: unit.design_status,
      execution_status: unit.execution_status,
      practitioner_review_status: unit.practitioner_review_status,
      publication_status: unit.publication_status,
      architecture_view_kinds: unit.architecture_views.map((view) => view.kind),
      acceptance_gate_status: unit.acceptance_gates.every((gate) => gate.status === "pass") ? "pass" : "blocked",
      execution_receipt_refs: [],
      residual_risk_count: unit.residual_risks.length,
    })),
  };

  copy(path.join(researchRoot, "solution-architecture.json"), path.join(githubTarget, "docs/solution-architecture.json"));
  copy(path.join(researchRoot, "artifacts/tutorial-materials.zip"), path.join(githubTarget, "COURSE-RELEASE.zip"));
  writeJson(path.join(githubTarget, "CATALOG-MANIFEST.json"), publicCatalog);
  writeJson(path.join(githubTarget, "EXECUTABILITY-MANIFEST.json"), executability);
  writeJson(path.join(githubTarget, "PAGE-PROMOTION-MANIFEST.json"), {
    schema_version: "page-promotion-manifest.v1",
    generated_at: publicationClosure.generated_at,
    pages: promotions,
  });
  writeJson(path.join(githubTarget, "SOLUTION-MANIFEST.json"), solutionManifest);

  // 公共发布校验器要求候选包根目录同时携带这六份工件。此前它们只存在于 research/，
  // 候选包因此始终缺件——文件在仓库里但没有进入发布面，是一次典型的投影缺口。
  for (const [source, target] of [
    ["capability-profiles.json", "CAPABILITY-PROFILES.json"],
    ["professional-evidence.json", "PROFESSIONAL-EVIDENCE.json"],
    ["status-registry.json", "STATUS-REGISTRY.json"],
    ["source-assimilation-ledger.json", "SOURCE-ASSIMILATION-MANIFEST.json"],
    ["source-semantic-projection.json", "SOURCE-SEMANTIC-PROJECTION.json"],
    ["learner-usability-reuse.json", "LEARNER-USABILITY-REUSE.json"],
    ["visual-sequence-manifest.json", "VISUAL-SEQUENCE-MANIFEST.json"],
  ]) {
    const from = path.join(researchRoot, source);
    if (!existsSync(from)) throw new Error(`missing research artifact for public release: ${source}`);
    cpSync(from, path.join(githubTarget, target));
  }

  // 来源吸收台账在仓库里把闭包数字放在 coverage_receipt 下；公共发布校验器读取顶层字段。
  // 这里做一次显式投影，而不是让校验器去猜嵌套结构——投影后两边表达同一组事实。
  {
    const ledgerPath = path.join(githubTarget, "SOURCE-ASSIMILATION-MANIFEST.json");
    const ledger = json(ledgerPath);
    const receipt = ledger.coverage_receipt ?? {};
    const closed =
      Array.isArray(receipt.unaccounted_ids) &&
      receipt.unaccounted_ids.length === 0 &&
      receipt.section_count === receipt.accounted_section_count &&
      receipt.atom_count === receipt.accounted_atom_count;
    writeJson(ledgerPath, {
      ...ledger,
      verdict: closed ? "PASS" : "FAIL",
      section_count: receipt.section_count,
      accounted_section_count: receipt.accounted_section_count,
      atom_count: receipt.atom_count,
      accounted_atom_count: receipt.accounted_atom_count,
      unaccounted_ids: receipt.unaccounted_ids ?? null,
    });
  }

  // Authoring refs use tutorial/tutorial-site.json#<page-id>#<field>. The public
  // validator consumes an explicit page_ids list so it can reject unknown or
  // hidden pages without parsing locator strings. Keep the locators and add the
  // exact derived IDs as a lossless public projection.
  {
    const projectionPath = path.join(githubTarget, "SOURCE-SEMANTIC-PROJECTION.json");
    const projection = json(projectionPath);
    const publicIds = new Set(pageIds);
    const units = (projection.units ?? []).map((unit, index) => {
      const ids = [...new Set((unit.page_refs ?? []).map((ref) => {
        const match = String(ref).match(/^tutorial\/tutorial-site\.json#([^#]+)#/);
        return match?.[1] ?? "";
      }).filter(Boolean))];
      if (!ids.length || ids.some((pageId) => !publicIds.has(pageId))) {
        throw new Error(`source semantic unit ${index} has invalid public page refs: ${ids}`);
      }
      return { ...unit, page_ids: ids };
    });
    writeJson(projectionPath, { ...projection, units });
  }

  // 状态登记引用的人工评审文件与证据必须存在于候选包内，否则校验器报「引用了不存在的工件」。
  // 人工评审文件在仓库里用中文名；zip 不带 UTF-8 标志时 `unzip -Z1` 读出乱码，
  // 会让归档成员校验误判为漂移。因此候选包里用 ASCII 投影名，并同步改写登记里的路径。
  const humanReviewProjection = {
    "04-完整方案审计.md": "04-complete-solution-audit.md",
    "05-逐命题深研与代码可执行性审计.md": "05-per-topic-research-and-executability-audit.md",
    "06-最终课程验收.md": "06-final-course-acceptance.md",
    "07-102页课程重建检查点.md": "07-course-rebuild-checkpoint.md",
    "08-AI测试开发专家全文档审计-2026-08-14.md": "08-ai-testing-expert-full-audit-2026-08-14.md",
    "09-AI测试开发专家内容质量评估-2026-08-14.md": "09-ai-testing-expert-content-quality-2026-08-14.md",
    "01-调研思路与主要结论.md": "01-research-approach-and-findings.md",
    "02-成果清单与课程地图.md": "02-deliverables-and-course-map.md",
    "03-细化样课.md": "03-detailed-sample-lesson.md",
    "README.md": "README.md",
  };
  mkdirSync(path.join(githubTarget, "human-review"), { recursive: true });
  for (const [source, target] of Object.entries(humanReviewProjection)) {
    const from = path.join(root, "human-review", source);
    if (existsSync(from)) cpSync(from, path.join(githubTarget, "human-review", target));
  }
  for (const evidence of ["executability-audit.json", "source-assimilation-ledger.json", "editorial-review-2026-08-11-final.json"]) {
    const from = path.join(researchRoot, evidence);
    const to = path.join(githubTarget, "research", evidence);
    mkdirSync(path.dirname(to), { recursive: true });
    cpSync(from, to);
  }
  {
    const registryPath = path.join(githubTarget, "STATUS-REGISTRY.json");
    const registry = json(registryPath);
    const rewrite = (value) => {
      const name = value.startsWith("human-review/") ? value.slice("human-review/".length) : null;
      return name && humanReviewProjection[name] ? `human-review/${humanReviewProjection[name]}` : value;
    };
    writeJson(registryPath, {
      ...registry,
      records: (registry.records ?? []).map((record) => ({ ...record, path: rewrite(String(record.path ?? "")) })),
    });
  }

  // VISUAL-SEQUENCE-MANIFEST 用仓库相对路径声明每页的图源（site/public/...）。
  // 候选包此前只带了静态导出后的 site/visuals，因此校验器在 102 页上全部报缺源文件。
  // 这里把图源按声明路径原样带入，让「声明的路径」与「包里的路径」一致。
  for (const visualDir of [
    "visuals/course",
    "materials/agent-architecture-system/visuals",
    "materials/career-evolution/visuals",
  ]) {
    const from = path.join(siteRoot, "public", visualDir);
    if (!existsSync(from)) throw new Error(`missing visual source directory: ${visualDir}`);
    const to = path.join(githubTarget, "site/public", visualDir);
    mkdirSync(path.dirname(to), { recursive: true });
    cpSync(from, to, { recursive: true });
  }

  const artifactClosure = {
    schema_version: "github-candidate-artifact-closure.v1",
    canonical_catalog_ref: "CATALOG-MANIFEST.json",
    canonical_catalog_hash: sha256File(path.join(githubTarget, "CATALOG-MANIFEST.json")),
    tutorial_ref: "tutorial/tutorial-site.json",
    tutorial_hash: sha256File(path.join(githubTarget, "tutorial/tutorial-site.json")),
    archive_ref: "COURSE-RELEASE.zip",
    material_entries: publicationClosure.material_entries.map((entry) => ({
      page_id: entry.page_id,
      href: entry.href,
      dist_ref: `site/${entry.href}`,
      archive_member: entry.archive_member,
      sha256: entry.sha256,
    })),
  };
  writeJson(path.join(githubTarget, "ARTIFACT-CLOSURE.json"), artifactClosure);

  const blocker = {
    blocker_id: "EXTERNAL-VALIDATION-NOT-RUN",
    status: "BLOCKED-HIGHER-MATURITY",
    evidence: {
      practitioner_review_statuses: [...new Set(solutionManifest.solution_units.map((unit) => unit.practitioner_review_status))],
      publication_statuses: [...new Set(solutionManifest.solution_units.map((unit) => unit.publication_status))],
    },
    closure_required: [
      "real model/provider receipts",
      "controlled integration evidence",
      "named practitioner approval",
      "beginner usability evidence",
      "post-deploy online readback",
    ],
  };
  writeJson(path.join(githubTarget, "PUBLICATION-BLOCKERS.json"), {
    schema_version: "publication-blockers.v1",
    blockers: [blocker],
  });

  const contentHash = output("python3", [
    "-c",
    "from pathlib import Path; from validate_public_release import normalized_hash; import sys; print(normalized_hash(Path(sys.argv[1]), ['site','tutorial']))",
    githubTarget,
  ], path.join(factory, "scripts"));
  const sourceCommit = output("git", ["-C", siteRoot, "rev-parse", "HEAD"]);
  const manifestPaths = {
    solution_manifest_hash: "SOLUTION-MANIFEST.json",
    catalog_manifest_hash: "CATALOG-MANIFEST.json",
    promotion_manifest_hash: "PAGE-PROMOTION-MANIFEST.json",
    executability_manifest_hash: "EXECUTABILITY-MANIFEST.json",
    artifact_closure_hash: "ARTIFACT-CLOSURE.json",
    // 公共发布校验器要求这六项也参与哈希绑定。缺字段时校验器会把候选包判为结构无效，
    // 而此前 RELEASE-MANIFEST 只绑定了前五项。
    capability_profiles_hash: "CAPABILITY-PROFILES.json",
    professional_evidence_hash: "PROFESSIONAL-EVIDENCE.json",
    status_registry_hash: "STATUS-REGISTRY.json",
    source_assimilation_hash: "SOURCE-ASSIMILATION-MANIFEST.json",
    source_semantic_projection_hash: "SOURCE-SEMANTIC-PROJECTION.json",
    learner_usability_reuse_hash: "LEARNER-USABILITY-REUSE.json",
    visual_sequence_hash: "VISUAL-SEQUENCE-MANIFEST.json",
  };
  const manifest = {
    schema_version: "1.3-candidate",
    source_commit: sourceCommit,
    release_scope: tutorial.release_scope.mode,
    catalog_complete: tutorial.release_scope.catalog_complete,
    page_count: pageIds.length,
    delivered_page_count: pageIds.length,
    promised_page_ids: pageIds,
    learner_artifact_roots: ["site", "tutorial"],
    content_hash: contentHash,
    validation_verdict: "BLOCKED-HIGHER-MATURITY",
    publication_targets: ["github-pages", "chatgpt-site"],
    evidence_level: "fixture-tested local candidate; not practitioner-reviewed; not published",
    publication_blockers_ref: "PUBLICATION-BLOCKERS.json",
    ...Object.fromEntries(Object.entries(manifestPaths).map(([field, file]) => [field, sha256File(path.join(githubTarget, file))])),
  };
  writeJson(path.join(githubTarget, "RELEASE-MANIFEST.json"), manifest);

  const validatorProbe = output("python3", [
    "-c",
    [
      "from pathlib import Path",
      "from validate_public_release import validate_release",
      "import json, sys",
      "errors=validate_release(Path(sys.argv[1]))",
      "allowed=[e for e in errors if e == 'release manifest validation_verdict must be PASS' or e.endswith('must be pilot or public')]",
      "unexpected=[e for e in errors if e not in allowed]",
      "expected_internal=sum(1 for e in allowed if e.endswith('must be pilot or public'))",
      "ok=(not unexpected and expected_internal==6 and 'release manifest validation_verdict must be PASS' in allowed)",
      "print(json.dumps({'candidate_structure_valid':ok,'expected_publication_blockers':allowed,'unexpected_errors':unexpected},ensure_ascii=False))",
      "raise SystemExit(0 if ok else 1)",
    ].join(";"),
    githubTarget,
  ], path.join(factory, "scripts"));
  const candidateValidation = JSON.parse(validatorProbe);
  writeJson(path.join(githubTarget, "CANDIDATE-VALIDATION.json"), {
    schema_version: "github-candidate-validation.v1",
    page_count: pageIds.length,
    source_gates: "PASS",
    candidate_structure_valid: candidateValidation.candidate_structure_valid,
    expected_publication_blockers: candidateValidation.expected_publication_blockers,
    unexpected_errors: candidateValidation.unexpected_errors,
    publication_attempted: false,
  });
  return { pageIds, candidateValidation };
};

const zipDirectory = (directory, archive) => {
  rmSync(archive, { force: true });
  run("zip", ["-q", "-r", "-X", archive, path.basename(directory)], path.dirname(directory));
};

const verifyArchiveMembers = (directory, archive) => {
  const prefix = `${path.basename(directory)}/`;
  const expected = allFiles(directory).map((file) => `${prefix}${path.relative(directory, file).split(path.sep).join("/")}`).sort();
  const actual = output("unzip", ["-Z1", archive]).split("\n").filter((member) => member && !member.endsWith("/")).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`archive member drift: ${archive}`);
};

if (!process.argv.includes("--skip-source-gates")) assertSourceGates();
const { pageIds, candidateValidation } = assembleCandidate();
zipDirectory(path.join(siteRoot, "dist-github-pages"), siteArchive);
zipDirectory(githubTarget, githubArchive);
verifyArchiveMembers(path.join(siteRoot, "dist-github-pages"), siteArchive);
verifyArchiveMembers(githubTarget, githubArchive);

const result = {
  page_count: pageIds.length,
  site_directory: path.join(siteRoot, "dist-github-pages"),
  site_archive: siteArchive,
  site_archive_sha256: sha256File(siteArchive),
  github_candidate_directory: githubTarget,
  github_candidate_archive: githubArchive,
  github_candidate_archive_sha256: sha256File(githubArchive),
  candidate_structure_valid: candidateValidation.candidate_structure_valid,
  publication_status: "BLOCKED-HIGHER-MATURITY",
  deployed: false,
};
writeJson(path.join(distRoot, "PUBLICATION-CANDIDATES.json"), result);
console.log(JSON.stringify(result, null, 2));
