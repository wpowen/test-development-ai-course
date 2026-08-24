"use client";

import { useEffect, useMemo, useRef } from "react";
import { glossary, type GlossaryEntry } from "../content/glossary";
import { buildGlossaryMatcher, findGlossaryEntry, tokenizeGlossaryText } from "./glossary-matcher";

export const glossaryMatcher = buildGlossaryMatcher(glossary);

export function GlossaryText({ text, onOpen }: { text: string; onOpen: (entry: GlossaryEntry) => void }) {
  const parts = useMemo(() => tokenizeGlossaryText(text, glossaryMatcher), [text]);
  return <>{parts.map((part, index) => part.kind === "text"
    ? <span key={`${index}-${part.text}`}>{part.text}</span>
    : <button
      key={`${index}-${part.entry.term}`}
      type="button"
      className="glossary-term-trigger"
      data-glossary-term={part.entry.term}
      aria-haspopup="dialog"
      aria-controls="glossary-drawer"
      onClick={() => onOpen(part.entry)}
      title={`查看术语：${part.entry.term}`}
    >{part.text}</button>)}</>;
}

type DrawerProps = {
  entry: GlossaryEntry | null;
  onClose: () => void;
  onOpen: (entry: GlossaryEntry) => void;
  onOpenGlossary: () => void;
};

export function GlossaryDrawer({ entry, onClose, onOpen, onOpenGlossary }: DrawerProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!entry) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus();
    };
  }, [entry, onClose]);

  if (!entry) return null;
  return <div className="glossary-drawer-layer">
    <button className="glossary-drawer-backdrop" type="button" onClick={onClose} aria-label="关闭术语解释" />
    <aside
      id="glossary-drawer"
      className="glossary-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-drawer-title"
    >
      <header>
        <div><span>{entry.category}</span><h2 id="glossary-drawer-title">{entry.term}</h2>{entry.aka && <small>又称 {entry.aka}</small>}</div>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="关闭术语解释">×</button>
      </header>
      <div className="glossary-drawer-content">
        <section className="glossary-drawer-plain"><b>一句话说明</b><p>{entry.plain}</p></section>
        {entry.why && <section><b>为什么测试开发要关心</b><p>{entry.why}</p></section>}
        <section><b>它怎么工作</b><p>{entry.mechanism}</p></section>
        <section><b>测试时重点看什么</b><ul>{entry.testFocus.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><b>实际例子</b><p>{entry.example}</p></section>
        <section><b>常见误区</b><ul>{entry.pitfalls.map((item) => <li key={item}>{item}</li>)}</ul></section>
        {entry.related.length > 0 && <section><b>关联术语</b><div className="glossary-drawer-related">{entry.related.map((related) => {
          const target = findGlossaryEntry(glossaryMatcher, related);
          return target ? <button key={related} type="button" onClick={() => onOpen(target)}>{related}</button> : <span key={related}>{related}</span>;
        })}</div></section>}
        {entry.sources.length > 0 && <section><b>延伸来源</b><ul className="glossary-drawer-sources">{entry.sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><small>{source.kind} · {source.accessed}</small></li>)}</ul></section>}
      </div>
      <footer><button type="button" onClick={onOpenGlossary}>打开完整术语表</button></footer>
    </aside>
  </div>;
}
