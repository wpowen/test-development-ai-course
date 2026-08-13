"use client";

import { useEffect, useMemo, useState } from "react";
import { firstUsablePath, getTechnicalBlockPresentation, pages, publicModules, sourceNotes } from "../content/course";
import { DesignView, GlossaryView } from "./reference-views";

const statusLabel = (status: string) => status === "fixture-tested" ? "实验已跑" : "资料已审";

/**
 * 术语表与设计思路不是课程页面：它们不在 102 页的交付清单里，也不参与页面深度门禁。
 * 用同一套 hash 路由承载，是为了让它们和课程页一样可被链接、可被浏览器前进后退。
 */
const REFERENCE_VIEWS = ["glossary", "design"] as const;
type ReferenceView = (typeof REFERENCE_VIEWS)[number];

function setHash(id: string) {
  window.location.hash = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Home() {
  const [currentId, setCurrentId] = useState(firstUsablePath[0]);
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  // 目录默认展开；收起状态记在 localStorage，换页和刷新都保持不变。
  // 初值固定为 false 而不是读 localStorage，避免服务端渲染与首帧不一致。
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [view, setView] = useState<"lesson" | ReferenceView>("lesson");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace("#", "");
      if ((REFERENCE_VIEWS as readonly string[]).includes(id)) {
        setView(id as ReferenceView);
      } else {
        setView("lesson");
        setCurrentId(pages.some((page) => page.id === id) ? id : firstUsablePath[0]);
      }
      setMobileNav(false);
    };
    sync();
    const restoreTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("career-ai-completed");
      if (saved) setCompleted(JSON.parse(saved));
      setNavCollapsed(window.localStorage.getItem("career-ai-nav-collapsed") === "1");
    }, 0);
    window.addEventListener("hashchange", sync);
    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const current = pages.find((page) => page.id === currentId) ?? pages[0];
  const currentIndex = pages.findIndex((page) => page.id === current.id);
  const previous = currentIndex > 0 ? pages[currentIndex - 1] : undefined;
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined;
  const visiblePages = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return pages;
    return pages.filter((page) => `${page.id} ${page.title} ${page.summary} ${page.artifact}`.toLowerCase().includes(keyword));
  }, [query]);

  const toggleComplete = () => {
    const updated = completed.includes(current.id)
      ? completed.filter((id) => id !== current.id)
      : [...completed, current.id];
    setCompleted(updated);
    window.localStorage.setItem("career-ai-completed", JSON.stringify(updated));
  };

  // 术语表里的「出现在 TD-xxx」和设计思路里的路径按钮都走这里。
  // 特例 __glossary__ 让设计思路能把读者送去术语表，而不必让它知道 hash 的写法。
  const openFromReference = (pageId: string) => setHash(pageId === "__glossary__" ? "glossary" : pageId);

  const toggleNav = () => {
    const next = !navCollapsed;
    setNavCollapsed(next);
    window.localStorage.setItem("career-ai-nav-collapsed", next ? "1" : "0");
  };

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1200);
  };

  const currentModule = publicModules.find((item) => item.id === current.moduleId)!;

  return (
    <div className={`app-shell ${navCollapsed ? "nav-collapsed" : ""}`}>
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="打开课程目录">目录</button>
        <a className="brand" href={`#${firstUsablePath[0]}`}>
          <span className="brand-mark">QE</span>
          <span><b>测试开发 × AI</b><small>从会测试，到会验证 AI 系统</small></span>
        </a>
        <button
          className="nav-toggle"
          onClick={toggleNav}
          aria-expanded={!navCollapsed}
          aria-controls="course-sidebar"
          aria-label={navCollapsed ? "展开课程目录" : "收起课程目录"}
          title={navCollapsed ? "展开课程目录" : "收起课程目录"}
        >
          <span aria-hidden="true">{navCollapsed ? "»" : "«"}</span>
        </button>
        <div className="top-progress">
          <span>专业主路径已完成 {completed.filter((id) => firstUsablePath.includes(id)).length}/{firstUsablePath.length}</span>
          <div><i style={{ width: `${(completed.filter((id) => firstUsablePath.includes(id)).length / firstUsablePath.length) * 100}%` }} /></div>
        </div>
      </header>

      <aside id="course-sidebar" className={`sidebar ${mobileNav ? "open" : ""}`} aria-hidden={navCollapsed}>
        <div className="course-summary">
          <p className="eyebrow">当前可用版本</p>
          <h2>从传统测试到 AI 质量工程</h2>
          <p>这里只展示已经完成逐题研究、正文、实操和验证门禁的内容。内部研究路线图不会混入公开课程。</p>
          <div className="summary-stats"><span><b>{pages.length}</b> 可学习页面</span><span><b>{publicModules.length}</b> 已交付模块</span></div>
        </div>
        <label className="search-box">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 RAG、Agent、CI…" />
        </label>
        <nav className="reference-nav" aria-label="参考">
          <button className={view === "glossary" ? "active" : ""} onClick={() => setHash("glossary")}>
            <b>术语表</b><small>336 条 · 不懂的词先查这里</small>
          </button>
          <button className={view === "design" ? "active" : ""} onClick={() => setHash("design")}>
            <b>设计思路</b><small>内容凭什么可信、页面为什么这样排</small>
          </button>
        </nav>
        <nav className="course-nav" aria-label="课程目录">
          {publicModules.map((group) => {
            const groupPages = visiblePages.filter((page) => page.moduleId === group.id);
            if (!groupPages.length) return null;
            return <section key={group.id}>
              <h3>{group.title}</h3>
              <p>{group.subtitle}</p>
              {groupPages.map((page) => <button
                key={page.id}
                data-page-id={page.id}
                className={`nav-page ${page.id === current.id ? "active" : ""}`}
                onClick={() => setHash(page.id)}
              >
                <span className="page-number">{String(page.display_number).padStart(2, "0")}</span>
                <span className="page-name">{page.title}<small>{page.type} · {statusLabel(page.status)}</small></span>
                <span className={`status-dot ${completed.includes(page.id) ? "done" : page.status}`} />
              </button>)}
            </section>;
          })}
        </nav>
      </aside>

      {view === "glossary" && <GlossaryView onOpenPage={openFromReference} />}
      {view === "design" && <DesignView onOpenPage={openFromReference} />}

      {view === "lesson" && <>
      <main className="reader">
        <div className="reader-inner">
          <div className="breadcrumb"><span>{currentModule.title}</span><span>›</span><span>{current.id}</span></div>
          <div className="lesson-meta">
            <span className={`status-badge ${current.status}`}>{statusLabel(current.status)}</span>
            <span>{current.type}</span><span>{current.duration}</span><span>更新于 2026-08-10</span>
          </div>
          <h1>{current.title}</h1>
          <p className="lead">{current.summary}</p>

          <section className="outcome-card">
            <div><span>学完能做到</span><ul>{current.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><span>本页必须交付</span><strong>{current.artifact}</strong><small>不是“看懂”就算完成，要留下能被下游使用和检查的工件。</small></div>
          </section>

          <section className="why-card"><b>为什么测试开发需要这一页</b><p>{current.why}</p></section>

          {current.architecture && <section className="architecture-card">
            <p className="eyebrow">架构 / 流程</p>
            <h2>{current.architecture.title}</h2>
            {current.architecture.visual && <figure className="course-visual">
              <a href={current.architecture.visual.src} target="_blank" rel="noreferrer" aria-label={`打开高清原图：${current.architecture.visual.alt}`}>
                <img src={current.architecture.visual.src} alt={current.architecture.visual.alt} loading="lazy" />
              </a>
              <figcaption>{current.architecture.caption} 手机端可在图内左右滑动，点击图片可打开高清原图。</figcaption>
            </figure>}
            <div className="architecture-flow">{current.architecture.nodes.map((node, index) => <div className="architecture-step" key={node}><b>{String(index + 1).padStart(2, "0")}</b><span>{node}</span></div>)}</div>
            {!current.architecture.visual && <p>{current.architecture.caption}</p>}
          </section>}

          {current.materials && current.materials.length > 0 && <section className="materials-card">
            <div><p className="eyebrow">随课物料</p><h2>页面里提到的脚本和配置，都在这里</h2></div>
            <div className="material-grid">{current.materials.map((material) => <a href={material.href} key={material.href} target="_blank" rel="noreferrer">
              <span>{material.kind} · {material.validation === "fixture-tested" ? "已跑夹具" : "静态复核"}</span>
              <b>{material.title}</b>
              <p>{material.description}</p>
              <i>打开物料 →</i>
            </a>)}</div>
          </section>}

              {current.prerequisites.length > 0 && <section className="prerequisites"><b>前置页面</b>{current.prerequisites.map((id) => {
                const page = pages.find((item) => item.id === id);
                return <button key={id} onClick={() => setHash(id)}>{id} · {page?.title}</button>;
              })}</section>}

              {current.blocks.map((block, index) => {
                const technical = getTechnicalBlockPresentation(block);
                const copyKey = `${current.id}-${index}`;
                return <section className="content-block" key={block.title} id={`section-${index}`}>
                <div className="section-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="section-body">
                  <h2>{block.title}</h2>
                  {block.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {block.bullets && <ul>{block.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                  {block.table && <div className="table-wrap"><table><thead><tr>{block.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{block.table.rows.map((row, rowIndex) => <tr key={`${block.title}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table>{block.table.caption && <small>{block.table.caption}</small>}</div>}
                  {technical && <div className="code-box" data-technical-kind={technical.kind}>
                    <div><small>{technical.label}</small>{technical.workingDirectory && <small> · 工作目录：{technical.workingDirectory}</small>}</div>
                    {technical.copyable
                      ? <button onClick={() => copy(technical.content, copyKey)}>{copied === copyKey ? "已复制" : "复制使用"}</button>
                      : <span aria-label="不可复制">不可复制</span>}
                    <pre>{technical.content}</pre>
                    <small>{technical.reason}</small>
                  </div>}
                  {block.expected && <div className="expected"><b>预期结果</b><p>{block.expected}</p></div>}
                  {block.warning && <div className="warning"><b>常见误区</b><p>{block.warning}</p></div>}
                </div>
              </section>})}

              <section className="practice-card">
                <p className="eyebrow">实操</p>
                <h2>练习与项目替换</h2>
                <ol>{current.practice.map((item) => <li key={item}>{item}</li>)}</ol>
              </section>

              <section className="completion-card">
                <div><p className="eyebrow">完成检查</p><h2>满足这些条件，才算学完</h2></div>
                <div>{current.completion.map((item) => <label key={item}><input type="checkbox" /> <span>{item}</span></label>)}</div>
                <button className={completed.includes(current.id) ? "completed" : ""} onClick={toggleComplete}>{completed.includes(current.id) ? "✓ 已标记完成" : "标记本页完成"}</button>
              </section>

          <section className="evidence-card">
            <h2>证据与边界</h2>
            <p>{current.evidenceBoundary}</p>
            <div className="sources">{current.sourceIds.map((id) => sourceNotes[id] && <a key={id} href={sourceNotes[id].url} target="_blank" rel="noreferrer"><b>{id}</b>{sourceNotes[id].title}</a>)}</div>
          </section>

          <nav className="page-nav">
            {previous ? <button onClick={() => setHash(previous.id)}><small>← 上一页</small><b>{previous.title}</b></button> : <span />}
            {next && <button className="next" onClick={() => setHash(next.id)}><small>下一页 →</small><b>{next.title}</b></button>}
          </nav>
        </div>
      </main>

      <aside className="right-rail">
        <p className="eyebrow">本页导航</p>
        {current.blocks.map((block, index) => <button key={block.title} onClick={() => document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: "smooth" })}>{index + 1}. {block.title}</button>)}
        <div className="route-card"><b>当前深度路径</b><p>{firstUsablePath.join(" → ")}</p><small>测试依据 → 需求契约 → 评审 → 风险 → Oracle → 自动化 → 执行证据 → 变更回归</small></div>
      </aside>
      </>}
    </div>
  );
}
