#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const REQUIRED_RESEARCH_FILES = [
  "research-brief.md",
  "source-pack.csv",
  "research-runs.json",
  "evidence-synthesis.md",
  "engineering-blueprint.md",
  "manuscript.md",
  "comparison.md",
  "lab-manifest.json",
  "validation.md",
  "projection-ledger.json",
];

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.dirname(SCRIPT_ROOT);
const SITE_ROOT = path.join(PACKAGE_ROOT, "site");
const RESEARCH_ROOT = path.join(PACKAGE_ROOT, "research");
const COURSE_ROOT = path.join(PACKAGE_ROOT, "courses");
const PUBLIC_ROOT = path.join(SITE_ROOT, "public");
const STATIC_ROOT = path.join(SITE_ROOT, "dist-github-pages");

const sha256Bytes = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const sha256File = (file) => sha256Bytes(readFileSync(file));
const contentHash = (value) => sha256Bytes(Buffer.from(JSON.stringify(value)));
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const isFile = (file) => existsSync(file) && statSync(file).isFile() && statSync(file).size > 0;
const posix = (value) => value.split(path.sep).join("/");

const allFiles = (root) => {
  if (!existsSync(root)) return [];
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile() && entry.name !== ".DS_Store" && entry.name !== "__pycache__" && !entry.name.endsWith(".pyc")) files.push(absolute);
    }
  };
  visit(root);
  return files.sort();
};

const reverseCanonicalMapping = (canonicalManifest) => {
  const mapping = new Map();
  for (const topic of canonicalManifest.topics ?? []) {
    for (const alias of topic.aliases ?? []) {
      if (!/^site-\d+$/.test(alias.source_catalog ?? "") || typeof alias.source_id !== "string") continue;
      const ids = mapping.get(alias.source_id) ?? [];
      if (!ids.includes(topic.canonical_id)) ids.push(topic.canonical_id);
      mapping.set(alias.source_id, ids);
    }
  }
  return mapping;
};

const normalizedMaterials = (page) => (page.materials ?? []).map(({ href, kind, validation }) => ({ href, kind, validation }));

export const buildSupportOwnership = ({ pages, publicPageIds = pages.map((page) => page.id) }) => {
  const requiredMaterials = new Set(publicPageIds);
  const grouped = new Map();
  for (const page of pages) {
    const materials = normalizedMaterials(page);
    const signature = materials.length > 0 ? JSON.stringify(materials) : `empty:${page.id}`;
    const group = grouped.get(signature) ?? { materials, owner_page_ids: [] };
    group.owner_page_ids.push(page.id);
    grouped.set(signature, group);
  }
  const bundles = [...grouped.values()].map((group) => {
    const bundle_id = `support-${contentHash(group.materials.length ? group.materials : group.owner_page_ids).slice(7, 19)}`;
    const missingRequiredMaterial = group.materials.length === 0 && group.owner_page_ids.some((id) => requiredMaterials.has(id));
    return {
      bundle_id,
      owner_page_ids: group.owner_page_ids,
      shared: group.owner_page_ids.length > 1,
      applicability: group.owner_page_ids.length > 1
        ? `Identical ordered learner-material contract shared by exact pages: ${group.owner_page_ids.join(", ")}`
        : `Dedicated learner-material contract for exact page ${group.owner_page_ids[0]}`,
      material_refs: group.materials.length > 0
        ? group.materials.map((material) => material.href)
        : ["materials/internal-topics/README.md"],
      material_descriptors: group.materials,
      verdict: missingRequiredMaterial ? "FAIL" : "PASS",
      findings: missingRequiredMaterial ? ["public page has no learner-facing support material"] : [],
    };
  });
  const page_owners = Object.fromEntries(bundles.flatMap((bundle) => bundle.owner_page_ids.map((id) => [id, bundle.bundle_id])));
  const findings = bundles.flatMap((bundle) => bundle.findings.map((finding) => `${bundle.owner_page_ids.join(",")}: ${finding}`));
  return {
    schema_version: "support-ownership.v1",
    ownership_mode: "exact-page-id",
    catalog_page_ids: pages.map((page) => page.id),
    public_page_ids: [...publicPageIds],
    page_owners,
    bundles,
    verdict: findings.length === 0 ? "PASS" : "FAIL",
    findings,
  };
};

export const buildCatalogManifest = ({ catalogPages, publicPages, releaseScope, canonicalManifest, previousManifest }) => {
  const mapping = reverseCanonicalMapping(canonicalManifest);
  const ownership = buildSupportOwnership({ pages: catalogPages, publicPageIds: publicPages.map((page) => page.id) });
  const catalogIds = catalogPages.map((page) => page.id);
  const publicIds = publicPages.map((page) => page.id);
  const findings = [];
  if (new Set(catalogIds).size !== catalogIds.length) findings.push("catalog contains duplicate page IDs");
  if (new Set(publicIds).size !== publicIds.length) findings.push("public projection contains duplicate page IDs");
  if (JSON.stringify(publicIds) !== JSON.stringify(releaseScope.promisedPageIds)) findings.push("releaseScope promisedPageIds is not the exact ordered public projection");
  for (const id of catalogIds) if (!(mapping.get(id)?.length > 0)) findings.push(`canonical mapping missing exact site page ID: ${id}`);
  const pages = catalogPages.map((page, index) => ({
    page_id: page.id,
    order: index + 1,
    module_id: page.moduleId,
    delivery_status: page.status,
    public: publicIds.includes(page.id),
    canonical_topic_ids: mapping.get(page.id) ?? [],
    support_bundle_id: ownership.page_owners[page.id] ?? null,
  }));
  const projection = { page_ids: catalogIds, release_scope: releaseScope, pages };
  return {
    schema_version: "catalog-integrity.v1",
    catalog_id: "test-development-ai-v2",
    catalog_scope: "complete-catalog",
    content_version: contentHash(projection),
    page_ids: catalogIds,
    previous_validated_page_ids: previousManifest?.previous_validated_page_ids ?? [],
    release_scope: {
      mode: releaseScope.mode,
      promised_page_ids: [...releaseScope.promisedPageIds],
      catalog_complete: releaseScope.catalogComplete,
      validated_at: releaseScope.validatedAt ?? null,
    },
    pages,
    verdict: findings.length === 0 ? "PASS" : "FAIL",
    findings,
  };
};

const zipMembers = (archive) => {
  try {
    return execFileSync("unzip", ["-Z1", archive], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").filter((member) => member && !member.endsWith("/"));
  } catch {
    return [];
  }
};

const safeArchiveMember = (member) => member.length > 0
  && !member.startsWith("/")
  && !member.split("/").includes("..")
  && !member.includes("\\");

const zipMemberBytes = (archive, member) => {
  try {
    return execFileSync("unzip", ["-p", archive, member], { encoding: "buffer", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
};

const stableJson = (value) => {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  }
  return value;
};

// Lab runs deliberately mint a new top-level run_id. That receipt identity is
// not learner-facing behavior, so canonical -> public provenance compares a
// normalized semantic hash for JSON members under reports/. Public -> static
// -> ZIP remains byte-exact and is recorded separately below. No other field
// is ignored.
const provenanceBytes = (bytes, materialRelative) => {
  const parts = materialRelative.split("/");
  if (!parts.includes("reports") || path.extname(materialRelative) !== ".json") return bytes;
  try {
    const parsed = JSON.parse(bytes.toString("utf8"));
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object" || !("run_id" in parsed)) return bytes;
    const normalized = { ...parsed };
    delete normalized.run_id;
    return Buffer.from(JSON.stringify(stableJson(normalized)));
  } catch {
    return bytes;
  }
};

const provenanceHash = (bytes, materialRelative) => sha256Bytes(provenanceBytes(bytes, materialRelative));

const fileHashCache = new Map();
const cachedProvenanceHash = (file, materialRelative) => {
  const key = `${file}\0${materialRelative}`;
  if (!fileHashCache.has(key)) fileHashCache.set(key, provenanceHash(readFileSync(file), materialRelative));
  return fileHashCache.get(key);
};

const findCanonicalSource = (publicFile, materialRelative, courseFiles) => {
  const expectedHash = provenanceHash(readFileSync(publicFile), materialRelative);
  const suffix = `/${materialRelative}`;
  const candidates = courseFiles.filter((file) => posix(file).endsWith(suffix) && cachedProvenanceHash(file, materialRelative) === expectedHash);
  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) return candidates.sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
  // Published learner bundles may deliberately flatten a canonical lab tree
  // (for example topic-manifests/TD-F02.json -> manifests/TD-F02.json). The
  // byte identity is the durable provenance key in that case. Keep the exact
  // suffix lookup first, then fall back to a unique/shortest hash-identical
  // course-owned source instead of reporting a false missing-source finding.
  const hashCandidates = courseFiles.filter((file) => cachedProvenanceHash(file, materialRelative) === expectedHash);
  if (hashCandidates.length === 0) return null;
  return hashCandidates.sort((a, b) => a.length - b.length || a.localeCompare(b))[0];
};

const fileClosure = ({ href, publicRoot, staticRoot, courseFiles }) => {
  const publicFile = path.join(publicRoot, href);
  const staticFile = path.join(staticRoot, href);
  const relative = href.replace(/^materials\//, "");
  const [bundle, ...rest] = relative.split("/");
  const archive = path.join(publicRoot, "materials", `${bundle}.zip`);
  const relativeMember = rest.join("/");
  const archiveMembers = isFile(archive) ? zipMembers(archive) : [];
  const archiveMember = archiveMembers.includes(`${bundle}/${relativeMember}`)
    ? `${bundle}/${relativeMember}`
    : archiveMembers.includes(relativeMember) ? relativeMember : `${bundle}/${relativeMember}`;
  const source = isFile(publicFile) ? findCanonicalSource(publicFile, rest.join("/"), courseFiles) : null;
  const publicBytes = isFile(publicFile) ? readFileSync(publicFile) : null;
  const staticBytes = isFile(staticFile) ? readFileSync(staticFile) : null;
  const archiveBytes = isFile(archive) && safeArchiveMember(archiveMember) ? zipMemberBytes(archive, archiveMember) : null;
  const hashes = {
    canonical_source: source ? provenanceHash(readFileSync(source), relativeMember) : null,
    public: publicBytes ? provenanceHash(publicBytes, relativeMember) : null,
    static: staticBytes ? provenanceHash(staticBytes, relativeMember) : null,
    archive_member: archiveBytes ? provenanceHash(archiveBytes, relativeMember) : null,
  };
  const raw_hashes = {
    public: publicBytes ? sha256Bytes(publicBytes) : null,
    static: staticBytes ? sha256Bytes(staticBytes) : null,
    archive_member: archiveBytes ? sha256Bytes(archiveBytes) : null,
  };
  const findings = [];
  if (!hashes.canonical_source) findings.push("canonical authoring source missing or ambiguous");
  if (!hashes.public) findings.push("public material missing or empty");
  if (!hashes.static) findings.push("static material missing or empty");
  if (!hashes.archive_member) findings.push("ZIP member missing, unsafe, or unreadable");
  if (new Set(Object.values(hashes).filter(Boolean)).size > 1) findings.push("source/public/static/ZIP hashes differ");
  if (new Set(Object.values(raw_hashes).filter(Boolean)).size > 1) findings.push("public/static/ZIP bytes differ");
  return {
    material_href: href,
    kind: "file",
    canonical_source_path: source ? posix(path.relative(PACKAGE_ROOT, source)) : null,
    public_path: posix(path.relative(PACKAGE_ROOT, publicFile)),
    static_path: posix(path.relative(PACKAGE_ROOT, staticFile)),
    archive_path: posix(path.relative(PACKAGE_ROOT, archive)),
    archive_member: archiveMember,
    hashes,
    raw_hashes,
    source_ref: source ? posix(path.relative(PACKAGE_ROOT, source)) : null,
    tutorial_ref: posix(path.relative(PACKAGE_ROOT, publicFile)),
    dist_ref: posix(path.relative(PACKAGE_ROOT, staticFile)),
    // Promotion/publication receipts pin the learner-facing byte stream. The
    // normalized provenance hash above is only for canonical-source matching.
    sha256: findings.length === 0 ? raw_hashes.public : null,
    verdict: findings.length === 0 ? "PASS" : "FAIL",
    findings,
  };
};

const archiveClosure = ({ href, publicRoot, staticRoot, courseFiles }) => {
  const publicArchive = path.join(publicRoot, href);
  const staticArchive = path.join(staticRoot, href);
  const bundle = path.basename(href, ".zip");
  const folder = path.join(publicRoot, "materials", bundle);
  const members = isFile(publicArchive) ? zipMembers(publicArchive) : [];
  const findings = [];
  if (!isFile(publicArchive)) findings.push("public archive missing or empty");
  if (!isFile(staticArchive)) findings.push("static archive missing or empty");
  const publicHash = isFile(publicArchive) ? sha256File(publicArchive) : null;
  const staticHash = isFile(staticArchive) ? sha256File(staticArchive) : null;
  if (publicHash && staticHash && publicHash !== staticHash) findings.push("public/static archive hashes differ");
  if (members.length === 0) findings.push("archive has no readable file members");
  const folderMembers = allFiles(folder).map((file) => posix(path.relative(folder, file)));
  const rootedMembers = folderMembers.map((relative) => `${bundle}/${relative}`);
  const sortedMembers = [...members].sort();
  const rootedLayout = JSON.stringify(sortedMembers) === JSON.stringify(rootedMembers.sort());
  const rootlessLayout = JSON.stringify(sortedMembers) === JSON.stringify([...folderMembers].sort());
  const memberClosures = members.map((member) => {
    const expectedPrefix = `${bundle}/`;
    const relative = rootedLayout && member.startsWith(expectedPrefix) ? member.slice(expectedPrefix.length) : rootlessLayout ? member : null;
    const publicFile = relative ? path.join(folder, relative) : null;
    const source = publicFile && isFile(publicFile) ? findCanonicalSource(publicFile, relative, courseFiles) : null;
    const publicBytes = publicFile && isFile(publicFile) ? readFileSync(publicFile) : null;
    const archiveBytes = safeArchiveMember(member) ? zipMemberBytes(publicArchive, member) : null;
    const hashes = {
      canonical_source: source ? provenanceHash(readFileSync(source), relative) : null,
      public: publicBytes ? provenanceHash(publicBytes, relative) : null,
      archive_member: archiveBytes ? provenanceHash(archiveBytes, relative) : null,
    };
    const raw_hashes = {
      public: publicBytes ? sha256Bytes(publicBytes) : null,
      archive_member: archiveBytes ? sha256Bytes(archiveBytes) : null,
    };
    const memberFindings = [];
    if (!safeArchiveMember(member)) memberFindings.push("unsafe ZIP member path");
    if (!relative) memberFindings.push("member is outside canonical bundle prefix");
    if (!hashes.canonical_source) memberFindings.push("canonical authoring source missing or ambiguous");
    if (!hashes.public) memberFindings.push("public projection member missing");
    if (!hashes.archive_member) memberFindings.push("ZIP member unreadable");
    if (new Set(Object.values(hashes).filter(Boolean)).size > 1) memberFindings.push("source/public/ZIP member hashes differ");
    if (new Set(Object.values(raw_hashes).filter(Boolean)).size > 1) memberFindings.push("public/ZIP member bytes differ");
    return {
      member,
      canonical_source_path: source ? posix(path.relative(PACKAGE_ROOT, source)) : null,
      hashes,
      raw_hashes,
      verdict: memberFindings.length === 0 ? "PASS" : "FAIL",
      findings: memberFindings,
    };
  });
  if (!rootedLayout && !rootlessLayout) findings.push("public folder and ZIP member sets differ");
  if (memberClosures.some((entry) => entry.verdict !== "PASS")) findings.push("one or more archive members lack source/public/ZIP hash closure");
  return {
    material_href: href,
    kind: "archive",
    public_path: posix(path.relative(PACKAGE_ROOT, publicArchive)),
    static_path: posix(path.relative(PACKAGE_ROOT, staticArchive)),
    hashes: { public: publicHash, static: staticHash },
    source_ref: posix(path.relative(PACKAGE_ROOT, publicArchive)),
    tutorial_ref: posix(path.relative(PACKAGE_ROOT, publicArchive)),
    dist_ref: posix(path.relative(PACKAGE_ROOT, staticArchive)),
    archive_member: null,
    sha256: findings.length === 0 ? publicHash : null,
    member_count: members.length,
    members: memberClosures,
    verdict: findings.length === 0 ? "PASS" : "FAIL",
    findings,
  };
};

export const buildPublicationClosure = ({ pages, publicRoot = PUBLIC_ROOT, staticRoot = STATIC_ROOT, courseRoot = COURSE_ROOT, catalogIdentity = null, tutorialProjection = null }) => {
  const courseFiles = allFiles(courseRoot);
  const entries = [];
  for (const page of pages) {
    const materials = page.materials ?? [];
    const materialEntries = materials.map((material) => material.href.endsWith(".zip")
      ? archiveClosure({ href: material.href, publicRoot, staticRoot, courseFiles })
      : fileClosure({ href: material.href, publicRoot, staticRoot, courseFiles }));
    const findings = [];
    if (materials.length === 0) findings.push("page has no learner-facing material links");
    if (materialEntries.some((entry) => entry.verdict !== "PASS")) findings.push("one or more learner materials lack source/public/static/ZIP closure");
    entries.push({ page_id: page.id, materials: materialEntries, verdict: findings.length === 0 ? "PASS" : "FAIL", findings });
  }
  const findings = entries.filter((entry) => entry.verdict !== "PASS").map((entry) => `${entry.page_id}: ${entry.findings.join("; ")}`);
  return {
    schema_version: "publication-closure.v1",
    canonical_catalog: catalogIdentity,
    tutorial_projection_sha256: tutorialProjection ? contentHash(tutorialProjection) : null,
    public_page_ids: pages.map((page) => page.id),
    entries,
    verdict: findings.length === 0 ? "PASS" : "FAIL",
    findings,
  };
};

const parseEditorialEvidence = (topicRoot) => {
  const validation = path.join(topicRoot, "validation.md");
  if (!isFile(validation)) return { editorial_score: null, boundary_preservation_score: null };
  const text = readFileSync(validation, "utf8");
  const editorial = text.match(/(?:Editorial(?: review)?[\s\S]{0,300}?Score|编辑(?:评审|评分)?[\s\S]{0,300}?)[^\d]*(\d{1,3})\s*\/\s*100/i);
  const boundary = text.match(/(?:boundary preservation|边界保留|边界保持)[^\d]*(\d{1,3})\s*\/\s*100/i);
  return {
    editorial_score: editorial ? Number(editorial[1]) : null,
    boundary_preservation_score: boundary ? Number(boundary[1]) : null,
  };
};

export const normalizeEditorialReviewEvidence = (report, pageReview, reviewHash) => ({
  editorial_score: pageReview?.editorial_score ?? null,
  boundary_preservation_score: pageReview?.boundary_preservation_score ?? null,
  page_content_hash: pageReview?.hashes?.tutorial_page_content_hash ?? pageReview?.page_content_hash ?? null,
  review_ref: "research/editorial-review-2026-08-11-final.json",
  review_hash: reviewHash,
  review_verdict: pageReview?.verdict ?? null,
  reviewer_id: pageReview?.reviewer_id ?? report?.reviewer ?? null,
  author_id: pageReview?.author_id ?? report?.author_id ?? null,
  reviewer_is_independent_of_author: report?.reviewer_is_independent_of_author === true
    && (pageReview?.reviewer_id ?? report?.reviewer) !== (pageReview?.author_id ?? report?.author_id),
});

export const buildPromotionReceipt = async ({ page, topicRoot, audit, auditHash, closureEntries, validationTime, reviewer, editorialReview }) => {
  const research_inventory = REQUIRED_RESEARCH_FILES.map((name) => {
    const file = path.join(topicRoot, name);
    return { path: name, exists: isFile(file), sha256: isFile(file) ? sha256File(file) : null };
  });
  const pageClosure = closureEntries.find((entry) => entry.page_id === page.id);
  const materialEntries = pageClosure?.materials ?? [];
  const learner_material_hashes = materialEntries.map((entry) => ({
    href: entry.material_href,
    public_sha256: entry.raw_hashes?.public ?? entry.hashes?.public ?? null,
    static_sha256: entry.raw_hashes?.static ?? entry.hashes?.static ?? null,
    archive_member_sha256: entry.raw_hashes?.archive_member ?? entry.hashes?.archive_member ?? null,
    closure_verdict: entry.verdict,
  }));
  const review = editorialReview ?? parseEditorialEvidence(topicRoot);
  const currentPageContentHash = contentHash(page);
  const findings = [];
  const auditFindingCount = audit?.finding_count ?? audit?.findingCount;
  if (research_inventory.some((item) => !item.exists)) findings.push("exact ten-file research package incomplete");
  if (!audit || audit.verdict !== "PASS" || auditFindingCount !== 0) findings.push("executability audit is not PASS with zero findings");
  if (!pageClosure || pageClosure.verdict !== "PASS") findings.push("learner material publication closure is not PASS");
  if (review.editorial_score === null || review.editorial_score < 90) findings.push("editorial score >= 90/100 is not evidenced");
  if (review.boundary_preservation_score !== 100) findings.push("boundary preservation score 100/100 is not evidenced");
  if (!review.review_ref || !review.review_hash) findings.push("independent editorial review artifact is not pinned");
  if (review.review_verdict !== "PASS") findings.push("independent editorial page verdict is not PASS");
  if (review.reviewer_is_independent_of_author !== true || !review.reviewer_id || review.reviewer_id === review.author_id) findings.push("editorial reviewer is not independent of page author");
  if (review.page_content_hash !== currentPageContentHash) findings.push("independent editorial review does not pin current page content hash");
  return {
    schema_version: "page-promotion-receipt.v1",
    page_id: page.id,
    validated_at: validationTime,
    reviewer,
    page_content_hash: currentPageContentHash,
    editorial_review_ref: review.review_ref ?? null,
    editorial_review_hash: review.review_hash ?? null,
    editorial_review_verdict: review.review_verdict ?? null,
    editorial_reviewer_id: review.reviewer_id ?? null,
    page_author_id: review.author_id ?? null,
    reviewer_is_independent_of_author: review.reviewer_is_independent_of_author === true,
    research_package_files: REQUIRED_RESEARCH_FILES,
    research_inventory,
    editorial_score: review.editorial_score,
    boundary_preservation_score: review.boundary_preservation_score,
    executability_audit_ref: "research/executability-audit.json",
    executability_audit_hash: auditHash,
    executability_audit: {
      path: "../../executability-audit.json",
      sha256: auditHash,
      verdict: audit?.verdict ?? "FAIL",
      finding_count: auditFindingCount ?? null,
    },
    material_hashes: Object.fromEntries(materialEntries.map((entry) => [entry.material_href, entry.raw_hashes?.public ?? entry.hashes?.public ?? null])),
    learner_material_hashes,
    verdict: findings.length === 0 ? "PASS" : "FAIL",
    findings,
  };
};

const withMetadata = (manifest, generatedAt) => ({ ...manifest, generated_at: generatedAt });
const writeJson = (file, value) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

const buildReleaseMaterialArchive = (pages, archive) => {
  const hrefs = [...new Set(pages.flatMap((page) => (page.materials ?? []).map((material) => material.href)))].sort();
  if (hrefs.length === 0) throw new Error("cannot build release material archive without learner materials");
  for (const href of hrefs) {
    if (!isFile(path.join(PUBLIC_ROOT, href))) throw new Error(`release material is missing: ${href}`);
  }
  mkdirSync(path.dirname(archive), { recursive: true });
  const temporary = `${archive}.tmp`;
  rmSync(temporary, { force: true });
  execFileSync("zip", ["-q", "-X", temporary, ...hrefs], { cwd: PUBLIC_ROOT, stdio: ["ignore", "ignore", "pipe"] });
  renameSync(temporary, archive);
};

const compareManifest = (file, expected, problems) => {
  if (!isFile(file)) return problems.push(`manifest missing: ${posix(path.relative(PACKAGE_ROOT, file))}`);
  if (JSON.stringify(json(file)) !== JSON.stringify(expected)) problems.push(`manifest stale: ${posix(path.relative(PACKAGE_ROOT, file))}`);
};

export const generateIntegrityManifests = async ({ write = false } = {}) => {
  const course = await import(`${pathToFileURL(path.join(SITE_ROOT, "content/course.ts")).href}?integrity=${Date.now()}`);
  const auditModule = await import(`${pathToFileURL(path.join(SITE_ROOT, "scripts/audit-executability.ts")).href}?integrity=${Date.now()}`);
  const paths = {
    catalog: path.join(RESEARCH_ROOT, "catalog-manifest.json"),
    ownership: path.join(RESEARCH_ROOT, "support-ownership.json"),
    audit: path.join(RESEARCH_ROOT, "executability-audit.json"),
    closure: path.join(RESEARCH_ROOT, "publication-closure.json"),
  };
  const generatedAt = write
    ? new Date().toISOString()
    : isFile(paths.catalog) ? json(paths.catalog).generated_at : new Date().toISOString();
  const canonicalManifest = json(path.join(RESEARCH_ROOT, "course-catalog-manifest.json"));
  const previous = isFile(paths.catalog) ? json(paths.catalog) : null;
  const catalog = withMetadata(buildCatalogManifest({
    catalogPages: course.catalogPages,
    publicPages: course.pages,
    releaseScope: course.releaseScope,
    canonicalManifest,
    previousManifest: previous,
  }), generatedAt);
  const ownership = withMetadata(buildSupportOwnership({ pages: course.catalogPages, publicPageIds: course.pages.map((page) => page.id) }), generatedAt);
  const rawAudit = auditModule.auditTutorialPages(course.pages, { publicDir: PUBLIC_ROOT });
  const normalizedAuditPages = rawAudit.pages.map((page) => ({
    page_id: page.pageId,
    status: page.status,
    code_block_count: page.codeBlockCount,
    kinds: page.kinds,
    material_count: page.materialCount,
    finding_count: page.findingCount,
    findings: page.findings,
    verdict: page.verdict,
  }));
  const audit = withMetadata({
    schema_version: "executability-audit.v1",
    audit_id: `executability-${contentHash(normalizedAuditPages).slice(7, 19)}`,
    audited_at: generatedAt,
    public_page_ids: course.pages.map((page) => page.id),
    source_hashes: {
      course: sha256File(path.join(SITE_ROOT, "content/course.ts")),
      audit_implementation: sha256File(path.join(SITE_ROOT, "scripts/audit-executability.ts")),
    },
    summary: rawAudit.summary,
    pages: normalizedAuditPages,
    verdict: rawAudit.summary.pagesFailing === 0 ? "PASS" : "FAIL",
    findings: rawAudit.pages.filter((page) => page.verdict !== "PASS").map((page) => `${page.pageId}: ${page.findings.join("; ")}`),
  }, generatedAt);
  const closure = withMetadata(buildPublicationClosure({
    pages: course.pages,
    catalogIdentity: { catalog_id: catalog.catalog_id, content_version: catalog.content_version, page_ids: catalog.page_ids },
    tutorialProjection: course.pages,
  }), generatedAt);
  const tutorialPath = path.join(PACKAGE_ROOT, "tutorial/tutorial-site.json");
  const releaseArchive = path.join(RESEARCH_ROOT, "artifacts/tutorial-materials.zip");
  const materialEntries = course.pages.flatMap((page) => (page.materials ?? []).map((material) => {
    const source = path.join(PUBLIC_ROOT, material.href);
    return {
      page_id: page.id,
      href: material.href,
      source_ref: `site/public/${material.href}`,
      dist_ref: `site/dist-github-pages/${material.href}`,
      archive_member: material.href,
      sha256: isFile(source) ? sha256File(source) : null,
    };
  }));
  Object.assign(closure, {
    canonical_source_ref: "research/catalog-manifest.json",
    canonical_source_hash: sha256Bytes(Buffer.from(`${JSON.stringify(catalog, null, 2)}\n`)),
    tutorial_ref: "tutorial/tutorial-site.json",
    tutorial_hash: isFile(tutorialPath) ? sha256File(tutorialPath) : null,
    static_export_root: "site/dist-github-pages",
    archive_ref: "research/artifacts/tutorial-materials.zip",
    material_entries: materialEntries,
  });
  const auditHash = sha256Bytes(Buffer.from(`${JSON.stringify(audit, null, 2)}\n`));
  const editorialReviewPath = path.join(RESEARCH_ROOT, "editorial-review-2026-08-11-final.json");
  const editorialReview = isFile(editorialReviewPath) ? json(editorialReviewPath) : null;
  const editorialReviewHash = isFile(editorialReviewPath) ? sha256File(editorialReviewPath) : null;
  const editorialByPage = new Map((editorialReview?.pages ?? []).filter((item) => item && typeof item.page_id === "string").map((item) => [item.page_id, item]));
  const receipts = [];
  for (const page of course.pages) {
    const topicRoot = path.join(RESEARCH_ROOT, "topics", page.id);
    const existingReceipt = path.join(topicRoot, "promotion-receipt.json");
    const receiptTime = write ? generatedAt : isFile(existingReceipt) ? json(existingReceipt).validated_at ?? generatedAt : generatedAt;
    const pageReview = editorialByPage.get(page.id);
    receipts.push(await buildPromotionReceipt({
      page,
      topicRoot,
      audit: audit.pages.find((entry) => entry.page_id === page.id),
      auditHash,
      closureEntries: closure.entries,
      validationTime: receiptTime,
      reviewer: editorialReview?.reviewer ?? "validation-review-required",
      editorialReview: editorialReview ? normalizeEditorialReviewEvidence(editorialReview, pageReview, editorialReviewHash) : null,
    }));
  }

  const expected = [[paths.catalog, catalog], [paths.ownership, ownership], [paths.audit, audit], [paths.closure, closure]];
  const problems = [];
  if (write) {
    buildReleaseMaterialArchive(course.pages, releaseArchive);
    for (const [file, value] of expected) writeJson(file, value);
    for (const receipt of receipts) writeJson(path.join(RESEARCH_ROOT, "topics", receipt.page_id, "promotion-receipt.json"), receipt);
  } else {
    for (const [file, value] of expected) compareManifest(file, value, problems);
    for (const receipt of receipts) compareManifest(path.join(RESEARCH_ROOT, "topics", receipt.page_id, "promotion-receipt.json"), receipt, problems);
  }
  const gateFailures = [catalog, ownership, audit, closure].filter((manifest) => manifest.verdict !== "PASS").map((manifest) => `${manifest.schema_version}: ${manifest.verdict}`);
  gateFailures.push(...receipts.filter((receipt) => receipt.verdict !== "PASS").map((receipt) => `${receipt.page_id}: promotion FAIL`));
  return { write, generatedAt, publicPageCount: course.pages.length, catalogPageCount: course.catalogPages.length, problems, gateFailures };
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const write = process.argv.includes("--write");
  const result = await generateIntegrityManifests({ write });
  console.log(JSON.stringify(result, null, 2));
  if (result.problems.length > 0 || result.gateFailures.length > 0) process.exitCode = 1;
}
