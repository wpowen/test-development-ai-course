import type { TutorialBlock } from "../content/course";

export type PythonBrowserLabSpec = {
  kind: "python";
  pageId: string;
  blockIndex: number;
  command: string;
  archiveHref: string;
  archiveRoot: string;
  workingDirectory: string;
  expectedExitCode: number;
  expectedArtifacts: string[];
  evidenceBoundary: "fixture-tested";
};

export type PromptBrowserLabSpec = {
  kind: "prompt";
  pageId: string;
  blockIndex: number;
  version: string;
  promptHref: string;
  inputHref: string;
  schemaHref: string;
  evaluationHref: string;
  manifestHref: string;
};

export type ConfigBrowserLabSpec = {
  kind: "config";
  pageId: string;
  blockIndex: number;
  format: string;
  content: string;
  sourceHref: string;
};

export type ExplanationBrowserLabSpec = {
  kind: "explanation";
  pageId: string;
  blockIndex: number;
  actionLabel: "查看说明";
  statusLabel: "说明性内容";
  verification: string;
};

export type BrowserLabSpec = PythonBrowserLabSpec | PromptBrowserLabSpec | ConfigBrowserLabSpec | ExplanationBrowserLabSpec;

const publicHref = (path: string) => path.replace(/^\/?(?:public\/)?/, "");

export function buildBrowserLabSpec(pageId: string, blockIndex: number, block: TutorialBlock): BrowserLabSpec {
  const technical = block.technical;
  if (!technical) return {
    kind: "explanation", pageId, blockIndex, actionLabel: "查看说明", statusLabel: "说明性内容",
    verification: "这段内容尚未迁移为可执行技术块。",
  };
  if (technical.kind === "command") {
    const relativeWorkingDirectory = technical.workingDirectory.replace(/^materials\//, "");
    const archiveRoot = relativeWorkingDirectory.split("/")[0];
    return {
      kind: "python",
      pageId,
      blockIndex,
      command: technical.content,
      archiveHref: `materials/${archiveRoot}.zip`,
      archiveRoot,
      workingDirectory: relativeWorkingDirectory,
      expectedExitCode: technical.expectedExitCode,
      expectedArtifacts: technical.expectedArtifacts,
      evidenceBoundary: "fixture-tested",
    };
  }
  if (technical.kind === "prompt") return {
    kind: "prompt",
    pageId,
    blockIndex,
    version: technical.version,
    promptHref: publicHref(technical.promptPath),
    inputHref: publicHref(technical.inputFixturePath),
    schemaHref: publicHref(technical.outputSchemaPath),
    evaluationHref: publicHref(technical.evaluationPath),
    manifestHref: publicHref(technical.manifestPath),
  };
  if (technical.kind === "config") return {
    kind: "config",
    pageId,
    blockIndex,
    format: technical.format,
    content: technical.content,
    sourceHref: publicHref(technical.sourcePath),
  };
  return {
    kind: "explanation",
    pageId,
    blockIndex,
    actionLabel: "查看说明",
    statusLabel: "说明性内容",
    verification: technical.kind === "source-file" ? `源码位置：${technical.sourcePath}` : technical.verification,
  };
}

