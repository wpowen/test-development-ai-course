"use client";

/**
 * 模块全景视图 —— 站点的「总」层。
 *
 * 读者从侧栏点模块标题进到这里，先看清整个模块由哪几段组成、每段交出什么、
 * 为什么是这个顺序，再决定进哪一页。此前站点只有「分」层：点开就是某一页的
 * 细节，模块本身没有落点。
 *
 * 内容全部来自 content/module-overviews.ts，由
 * scripts/build-module-overviews.py 从 methodology/module-overviews.json 投影。
 * 阶段与页面的对应关系由 scripts/validate-content.ts 强制校验，改一边漏一边会构建失败。
 */

import { moduleOverviews } from "../content/module-overviews";
import { publicModules, type TutorialPage } from "../content/course";

type Props = {
  module: (typeof publicModules)[number];
  pages: TutorialPage[];
  onOpenPage: (pageId: string) => void;
};

export function ModuleOverviewView({ module, pages, onOpenPage }: Props) {
  const overview = moduleOverviews[module.id];
  if (!overview) return null;

  const byId = new Map(pages.map((page) => [page.id, page]));

  return (
    <main className="reader module-view">
      <div className="reader-inner">
        <div className="breadcrumb"><span>模块全景</span><span>›</span><span>{module.id}</span></div>

        <p className="eyebrow">{module.id} · {pages.length} 页 · {overview.stages.length} 个阶段</p>
        <h1>{module.title}</h1>
        <p className="lead">{overview.thesis}</p>

        <section className="module-panorama">
          <p className="eyebrow">全景：架构与流程</p>
          <figure className="course-visual">
            <a
              href={overview.panorama.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`打开高清原图：${overview.panorama.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 与页面级架构图一致，本地静态 SVG 直接加载，保留浏览器原生缩放 */}
              <img src={overview.panorama.src} alt={overview.panorama.alt} loading="lazy" decoding="async" />
            </a>
            <figcaption>{module.subtitle}　手机端可在图内左右滑动，点击图片可打开高清原图。</figcaption>
          </figure>
        </section>

        <section className="module-logic">
          <h2>这个模块是怎么组织的</h2>
          {overview.logic.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="module-stages">
          <h2>逐段导览</h2>
          <p className="section-note">
            阶段顺序即依赖顺序。每一段的出口工件是下一段的输入，跳段会让后面的产物建立在未确认的假设上。
          </p>
          <ol>
            {overview.stages.map((stage, index) => (
              <li key={stage.name} className="module-stage">
                <div className="stage-head">
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <div>
                    <h3>{stage.name}</h3>
                    <p className="stage-question">{stage.question}</p>
                  </div>
                </div>
                <p className="stage-output"><span>出口工件</span>{stage.output}</p>
                <div className="stage-pages">
                  {stage.pages.map((pageId) => {
                    const page = byId.get(pageId);
                    if (!page) return null;
                    return (
                      <button key={pageId} className="stage-page" onClick={() => onOpenPage(pageId)}>
                        <span className="page-number">{String(page.display_number).padStart(2, "0")}</span>
                        <span className="page-name">{page.title}<small>{page.duration} · {page.artifact}</small></span>
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="module-boundary">
          <h2>这个模块不负责什么</h2>
          <ul>{overview.boundary.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>
    </main>
  );
}
