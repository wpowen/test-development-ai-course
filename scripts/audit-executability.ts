import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  getTechnicalBlockPresentation,
  pages,
  type TechnicalBlock,
  type TutorialBlock,
  type TutorialPage,
} from "../content/course.ts";

type AuditOptions = { publicDir?: string };

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const sameStringArray = (left: unknown, right: unknown) => Array.isArray(left)
  && Array.isArray(right)
  && left.length === right.length
  && left.every((value, index) => value === right[index]);

const resolvePublicFile = (publicDir: string, repositoryPath: unknown): string | undefined => {
  if (!hasText(repositoryPath)
    || /^(?:[a-z]+:)?\/\//i.test(repositoryPath)
    || repositoryPath.startsWith("/")
    || repositoryPath.split("/").includes("..")) return undefined;
  const absolute = resolve(publicDir, repositoryPath);
  const root = resolve(publicDir) + sep;
  return absolute.startsWith(root) ? absolute : undefined;
};

const readJson = (path: string): Record<string, unknown> | undefined => {
  try {
    const value: unknown = JSON.parse(readFileSync(path, "utf8"));
    return isRecord(value) ? value : undefined;
  } catch {
    return undefined;
  }
};

const requirePublicFile = (publicDir: string, repositoryPath: unknown, label: string, findings: string[]) => {
  const path = resolvePublicFile(publicDir, repositoryPath);
  if (!path || !existsSync(path) || !statSync(path).isFile() || statSync(path).size === 0) {
    findings.push(`missing ${label}: ${String(repositoryPath ?? "")}`);
    return undefined;
  }
  return path;
};

const auditCommand = (technical: Extract<TechnicalBlock, { kind: "command" }>, block: TutorialBlock, publicDir: string, prefix: string, findings: string[]) => {
  const presentation = getTechnicalBlockPresentation(block);
  if (!presentation?.copyable) findings.push(`${prefix}: command contract is incomplete and cannot be copied`);
  if (technical.content.includes("courses/") || technical.workingDirectory.includes("courses/")) {
    findings.push(`${prefix}: command references unpublished courses/ path`);
  }
  if (!hasText(technical.workingDirectory)) findings.push(`${prefix}: command has no explicit working directory`);
  if (!block.expected) findings.push(`${prefix}: command has no observable expected result`);

  const manifestFile = requirePublicFile(publicDir, technical.manifestPath, "command manifest", findings);
  if (!manifestFile) return;
  const manifest = readJson(manifestFile);
  if (!manifest) {
    findings.push(`${prefix}: command manifest is not valid JSON`);
    return;
  }
  if (manifest.working_directory !== technical.workingDirectory) {
    findings.push(`${prefix}: working directory does not exactly match manifest`);
  }
  const steps = Array.isArray(manifest.steps) ? manifest.steps.filter(isRecord) : [];
  const step = steps.find((candidate) => candidate.step_id === technical.stepId);
  if (!step) {
    findings.push(`${prefix}: manifest step ${technical.stepId} is missing`);
    return;
  }
  if (step.command !== technical.content) findings.push(`${prefix}: command does not exactly match manifest step`);
  if (step.expected_exit_code !== technical.expectedExitCode) findings.push(`${prefix}: expected exit code does not exactly match manifest step`);
  if (!sameStringArray(step.expected_artifacts, technical.expectedArtifacts)) {
    findings.push(`${prefix}: expected artifacts do not exactly match manifest step`);
  }
  const requiredFiles = Array.isArray(manifest.required_files) ? manifest.required_files : [];
  for (const requiredFile of requiredFiles) {
    const path = hasText(requiredFile) ? `${technical.workingDirectory}/${requiredFile}` : requiredFile;
    requirePublicFile(publicDir, path, "manifest required file", findings);
  }
};

const auditPrompt = (technical: Extract<TechnicalBlock, { kind: "prompt" }>, block: TutorialBlock, publicDir: string, prefix: string, findings: string[]) => {
  const presentation = getTechnicalBlockPresentation(block);
  if (!presentation?.copyable) findings.push(`${prefix}: prompt contract is incomplete and cannot be copied`);
  if (!block.expected) findings.push(`${prefix}: prompt has no fixed input/output fixture and evaluation result`);
  const promptFile = requirePublicFile(publicDir, technical.promptPath, "prompt file", findings);
  const manifestFile = requirePublicFile(publicDir, technical.manifestPath, "prompt manifest", findings);
  requirePublicFile(publicDir, technical.inputFixturePath, "prompt input fixture", findings);
  requirePublicFile(publicDir, technical.outputSchemaPath, "prompt output schema", findings);
  requirePublicFile(publicDir, technical.evaluationPath, "prompt evaluation", findings);
  if (!promptFile || !manifestFile) return;
  const manifest = readJson(manifestFile);
  if (!manifest) {
    findings.push(`${prefix}: prompt manifest is not valid JSON`);
    return;
  }
  if (manifest.version !== technical.version) findings.push(`${prefix}: prompt version does not exactly match manifest`);
  const manifestDirectory = dirname(technical.manifestPath);
  // one_shot_copy_file 是 direct_use 包声明的「直接复制给 AI 的那一份」，
  // 它和三段式提示词一样由 manifest 具名并进入 artifact_sha256。
  // 生命周期页面向小白展示的正是这一份，因此它同样算「manifest 声明过的提示词」。
  const promptEntries = [
    manifest.system_prompt,
    manifest.task_prompt,
    manifest.critic_prompt,
    manifest.one_shot_copy_file,
  ]
    .filter(hasText)
    .map((path) => `${manifestDirectory}/${path}`);
  if (!promptEntries.includes(technical.promptPath)) findings.push(`${prefix}: prompt path is not declared by manifest`);
  if (hasText(manifest.schema) && resolve(manifestDirectory, manifest.schema) !== resolve(technical.outputSchemaPath)) {
    findings.push(`${prefix}: output schema does not exactly match manifest`);
  }
  if (hasText(manifest.eval) && resolve(manifestDirectory, manifest.eval) !== resolve(technical.evaluationPath)) {
    findings.push(`${prefix}: evaluation does not exactly match manifest`);
  }
};

const auditTypedBlock = (block: TutorialBlock, blockIndex: number, publicDir: string, findings: string[]) => {
  if (!("technical" in block) || !block.technical) {
    if ("code" in block && hasText(block.code)) findings.push(`block ${blockIndex + 1}: legacy code is not a typed technical block`);
    return;
  }
  const technical = block.technical;
  const prefix = `block ${blockIndex + 1}`;
  if (technical.kind === "command") return auditCommand(technical, block, publicDir, prefix, findings);
  if (technical.kind === "prompt") return auditPrompt(technical, block, publicDir, prefix, findings);
  if (technical.kind === "source-file") {
    if (!getTechnicalBlockPresentation(block)?.copyable) findings.push(`${prefix}: source-file contract is incomplete`);
    requirePublicFile(publicDir, technical.sourcePath, "source file", findings);
    return;
  }
  if (technical.kind === "config") {
    if (!getTechnicalBlockPresentation(block)?.copyable) findings.push(`${prefix}: config contract is incomplete`);
    requirePublicFile(publicDir, technical.sourcePath, "config file", findings);
    if (technical.schemaPath) requirePublicFile(publicDir, technical.schemaPath, "config schema", findings);
    return;
  }
  if (!hasText(technical.verification)) findings.push(`${prefix}: ${technical.kind} has no verification contract`);
  if (technical.kind === "pseudocode" && technical.implementationPath) {
    requirePublicFile(publicDir, technical.implementationPath, "pseudocode implementation", findings);
  }
};

export const auditTutorialPages = (tutorialPages: TutorialPage[], options: AuditOptions = {}) => {
  const publicDir = resolve(options.publicDir ?? "public");
  const pageAudits = tutorialPages.map((page) => {
    const findings: string[] = [];
    const technicalBlocks = page.blocks
      .map((block, index) => ({ block, index, presentation: getTechnicalBlockPresentation(block) }))
      .filter((candidate) => candidate.presentation);
    for (const { block, index } of technicalBlocks) auditTypedBlock(block, index, publicDir, findings);
    for (const material of page.materials ?? []) requirePublicFile(publicDir, material.href, "material", findings);
    const runnableCommands = technicalBlocks.filter(({ presentation }) => presentation?.kind === "command" && presentation.copyable);
    if (runnableCommands.length === 0 && ["跟做", "项目"].includes(page.type)) findings.push("guided/project page has no typed executable command");
    if (page.status === "fixture-tested" && findings.length > 0) findings.push("fixture-tested status overstates the page-level manifest contract");
    return {
      pageId: page.id,
      status: page.status,
      codeBlockCount: technicalBlocks.length,
      kinds: technicalBlocks.map(({ presentation }) => presentation?.kind),
      materialCount: page.materials?.length ?? 0,
      findingCount: findings.length,
      findings,
      verdict: findings.length === 0 ? "PASS" : "FAIL",
    };
  });
  const summary = {
    pageCount: pageAudits.length,
    codeBlockCount: pageAudits.reduce((sum, page) => sum + page.codeBlockCount, 0),
    pagesPassing: pageAudits.filter((page) => page.verdict === "PASS").length,
    pagesFailing: pageAudits.filter((page) => page.verdict === "FAIL").length,
    blocksByKind: pageAudits.flatMap((page) => page.kinds).reduce<Record<string, number>>((counts, kind) => {
      if (kind) counts[kind] = (counts[kind] ?? 0) + 1;
      return counts;
    }, {}),
    invalidPublishedCoursePaths: pageAudits.reduce((sum, page) => sum + page.findings.filter((finding) => finding.includes("unpublished courses/ path")).length, 0),
    commandsWithoutWorkingDirectory: pageAudits.reduce((sum, page) => sum + page.findings.filter((finding) => finding.includes("working directory")).length, 0),
    untypedTechnicalBlocks: pageAudits.reduce((sum, page) => sum + page.findings.filter((finding) => finding.includes("not a typed technical block")).length, 0),
  };
  return { summary, pages: pageAudits };
};

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const result = auditTutorialPages(pages);
  console.log(JSON.stringify(result, null, 2));
  if (result.summary.pagesFailing > 0) process.exitCode = 1;
}
