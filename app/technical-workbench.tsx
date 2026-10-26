"use client";

import { useMemo, useState } from "react";
import type { TechnicalBlockPresentation, TutorialBlock } from "../content/course";
import { buildBrowserLabSpec, type PythonBrowserLabSpec } from "./browser-lab-contract";

type PythonResult = {
  exit_code: number;
  stdout: string;
  stderr: string;
  changed: { path: string; bytes: number; change: "created" | "updated"; content?: string }[];
  artifact_checks: { path: string; exists: boolean; changed: boolean }[];
  evidence_boundary: string;
};

type WorkerReply = { id: string; type: "progress"; message: string }
  | { id: string; type: "result"; result: PythonResult }
  | { id: string; type: "error"; message: string };

let labWorker: Worker | null = null;
const pending = new Map<string, (reply: WorkerReply) => void>();

function browserWorker() {
  if (!labWorker) {
    labWorker = new Worker(new URL("pyodide-lab-worker.js", document.baseURI), { type: "module" });
    labWorker.onmessage = (event: MessageEvent<WorkerReply>) => pending.get(event.data.id)?.(event.data);
  }
  return labWorker;
}

function runPythonLab(spec: PythonBrowserLabSpec, onProgress: (message: string) => void) {
  return new Promise<PythonResult>((resolve, reject) => {
    const id = `${spec.pageId}-${spec.blockIndex}-${Date.now()}`;
    pending.set(id, (reply) => {
      if (reply.type === "progress") onProgress(reply.message);
      if (reply.type === "result") { pending.delete(id); resolve(reply.result); }
      if (reply.type === "error") { pending.delete(id); reject(new Error(reply.message)); }
    });
    browserWorker().postMessage({ id, spec: { ...spec, archiveUrl: new URL(spec.archiveHref, document.baseURI).href } });
  });
}

const promptTabs = [
  ["prompt", "Prompt"], ["input", "输入"], ["schema", "Schema"], ["evaluation", "评测"], ["manifest", "Manifest"],
] as const;

export function TechnicalWorkbench({
  anchorId, pageId, blockIndex, block, presentation, copied, onCopy,
}: {
  /** 首个可运行命令块的页内锚点，供「浏览器实验台」滚动定位。 */
  anchorId?: string;
  pageId: string;
  blockIndex: number;
  block: TutorialBlock;
  presentation: TechnicalBlockPresentation;
  copied: boolean;
  onCopy: (content: string) => void;
}) {
  const spec = useMemo(() => buildBrowserLabSpec(pageId, blockIndex, block), [pageId, blockIndex, block]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<PythonResult | null>(null);
  const [error, setError] = useState("");
  const [promptFiles, setPromptFiles] = useState<Record<string, string>>({});
  const [activePromptTab, setActivePromptTab] = useState<(typeof promptTabs)[number][0]>("prompt");
  const [editor, setEditor] = useState(spec.kind === "config" ? spec.content : "");
  const runPassed = spec.kind === "python" && result
    ? result.exit_code === spec.expectedExitCode && result.artifact_checks.every((artifact) => artifact.exists)
    : false;

  const openPrompt = async () => {
    if (spec.kind !== "prompt") return;
    setOpen(true); setError(""); setStatus("正在加载完整 Prompt 包…");
    try {
      const entries = await Promise.all([
        ["prompt", spec.promptHref], ["input", spec.inputHref], ["schema", spec.schemaHref],
        ["evaluation", spec.evaluationHref], ["manifest", spec.manifestHref],
      ].map(async ([key, href]) => {
        const response = await fetch(new URL(href, document.baseURI));
        if (!response.ok) throw new Error(`${href}：HTTP ${response.status}`);
        return [key, await response.text()];
      }));
      setPromptFiles(Object.fromEntries(entries));
      setStatus("完整 Prompt 包已加载；修改只保存在当前页面。 ");
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); setStatus(""); }
  };

  const execute = async () => {
    if (spec.kind !== "python") return;
    setOpen(true); setResult(null); setError("");
    try { setResult(await runPythonLab(spec, setStatus)); setStatus(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); setStatus(""); }
  };

  const action = spec.kind === "python"
    ? <button className="primary-action" type="button" onClick={execute}>在页面运行</button>
    : spec.kind === "prompt"
      ? <button className="primary-action" type="button" onClick={openPrompt}>打开完整 Prompt</button>
      : spec.kind === "config"
        ? <button className="primary-action" type="button" onClick={() => setOpen(!open)}>在线编辑</button>
        : <span className="explanation-label">{spec.statusLabel}</span>;

  return <div className="code-box technical-workbench" id={anchorId} data-technical-kind={presentation.kind}>
    <div className="technical-toolbar"><small>{presentation.label}</small>{presentation.workingDirectory && <small> · 工作目录：{presentation.workingDirectory}</small>}<div>{action}{presentation.copyable && <button type="button" onClick={() => onCopy(presentation.content)}>{copied ? "已复制" : "复制使用"}</button>}</div></div>
    {spec.kind !== "prompt" && <pre>{presentation.content}</pre>}
    <small>{presentation.reason}</small>
    {open && <section className="browser-lab-panel" aria-live="polite">
      {status && <p className="lab-status">{status}</p>}
      {error && <div className="lab-error"><b>运行未完成</b><p>{error}</p></div>}
      {spec.kind === "prompt" && Object.keys(promptFiles).length > 0 && <>
        <div className="lab-tabs">{promptTabs.map(([key, label]) => <button type="button" key={key} className={activePromptTab === key ? "active" : ""} onClick={() => setActivePromptTab(key)}>{label}</button>)}</div>
        <textarea aria-label={`编辑${activePromptTab}`} value={promptFiles[activePromptTab] ?? ""} onChange={(event) => setPromptFiles({ ...promptFiles, [activePromptTab]: event.target.value })} />
        <button type="button" onClick={() => onCopy(promptFiles[activePromptTab] ?? "")}>复制当前文件</button>
      </>}
      {spec.kind === "config" && <><textarea aria-label="编辑配置" value={editor} onChange={(event) => setEditor(event.target.value)} /><div className="lab-actions"><button type="button" onClick={() => onCopy(editor)}>复制修改后的配置</button>{spec.format.toLowerCase() === "json" && <span>{(() => { try { JSON.parse(editor); return "✓ JSON 格式有效"; } catch { return "JSON 格式有误"; } })()}</span>}</div></>}
      {result && spec.kind === "python" && <div className={`lab-result ${runPassed ? "pass" : "fail"}`}>
        <b>{runPassed ? "✓ 运行结果符合实验预期" : "运行结果与实验预期不符"}</b>
        <p>实际退出码：{result.exit_code}；预期退出码：{spec.expectedExitCode}</p>
        {result.stdout && <pre>{result.stdout}</pre>}{result.stderr && <pre className="stderr">{result.stderr}</pre>}
        {result.artifact_checks.length > 0 && <details open><summary>预期证据文件（{result.artifact_checks.filter((artifact) => artifact.exists).length}/{result.artifact_checks.length}）</summary>{result.artifact_checks.map((artifact) => <article key={artifact.path}><b>{artifact.exists ? "✓" : "缺失"} {artifact.path}</b><small>{artifact.changed ? "本次运行已创建或更新" : artifact.exists ? "文件存在，内容未变化" : "未找到"}</small></article>)}</details>}
        {result.changed.length > 0 && <details><summary>本次创建或更新的文件（{result.changed.length}）</summary>{result.changed.map((file) => <article key={file.path}><b>{file.path}</b><small>{file.change === "created" ? "新建" : "更新"} · {file.bytes} bytes</small>{file.content && <pre>{file.content}</pre>}</article>)}</details>}
        <small>{result.evidence_boundary}</small>
      </div>}
    </section>}
  </div>;
}
