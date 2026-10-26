"use client";

/**
 * 课程路径总览。
 *
 * 顶栏品牌回到这里。正文是已交付模块的路径网格，不是营销 Hero。
 * 模块名单只来自 publicModules，不把未公开模块挂进导航。
 */

import type { TutorialPage } from "../content/course";

type Props = {
  modules: readonly { id: string; title: string; subtitle: string }[];
  pages: readonly TutorialPage[];
  onOpenModule: (moduleId: string) => void;
  onOpenPage: (pageId: string) => void;
  onOpenLab: () => void;
};

export function PathOverview({ modules, pages, onOpenModule, onOpenPage, onOpenLab }: Props) {
  const firstPage = pages[0];
  const firstPageOf = (moduleId: string) => pages.find((page) => page.moduleId === moduleId);

  return (
    <main className="reader reader-wide path-view">
      <div className="reader-inner">
        <div className="breadcrumb"><span>课程路径</span><span>›</span><span>总览</span></div>
        <p className="home-kicker">Path overview</p>
        <h1>从传统测试到 AI 质量工程</h1>
        <p className="lead">
          按模块推进：先建立专业测试骨架，再进入大模型、RAG、Agent 与质量系统。下面是已交付的 {modules.length} 个模块——点进任一路径即进入阅读器。
        </p>
        <div className="home-meta">
          <span><b>{pages.length}</b> 可学习页面</span>
          <span><b>{modules.length}</b> 已交付模块</span>
          <span>门禁：本地内容 · 结构 · 离线夹具</span>
        </div>

        <div className="lab-strip">
          <div>
            <b>浏览器实验台 · Technical Workbench</b>
            <p>课页内的可执行命令保留红绿修复入口；不依赖把实验台改写成另一套页面。侧栏「浏览器实验台」会打开 TD-F01 的 cycle 命令。</p>
          </div>
          <button type="button" onClick={onOpenLab}>打开 TD-F01 实验</button>
        </div>

        <div className="path-grid" aria-label="模块路径">
          {modules.map((module, index) => {
            const entry = firstPageOf(module.id);
            const featured = index === 0 && entry;
            return (
              <button
                key={module.id}
                type="button"
                className={featured ? "mod-card featured" : "mod-card"}
                onClick={() => featured ? onOpenPage(entry.id) : onOpenModule(module.id)}
              >
                <span className="mod-id">{module.id}</span>
                <span className="mod-body">
                  <h2>{module.title}</h2>
                  <p>{module.subtitle}</p>
                </span>
                <span className="mod-link">{featured ? "进入首课 →" : "进入模块 →"}</span>
              </button>
            );
          })}
        </div>

        <p className="footer-note">
          这里只展示已通过本地内容、结构和离线夹具门禁的页面。
          {firstPage && <button type="button" onClick={() => onOpenPage(firstPage.id)}>打开首课 {firstPage.id}</button>}
        </p>
      </div>
    </main>
  );
}
