"use client";

import { useMemo, useState } from "react";
import { glossary, glossaryCategories, type GlossaryEntry } from "../content/glossary.ts";

/** 术语表不是课程页面，而是每页底部可回跳的学习参考。 */

const CORE_FIRST = (a: GlossaryEntry, b: GlossaryEntry) =>
  a.kind === b.kind ? 0 : a.kind === "core" ? -1 : 1;

export function GlossaryView({ onOpenPage }: { onOpenPage: (pageId: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("全部");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return glossary
      .filter((entry) => category === "全部" || entry.category === category)
      .filter((entry) => {
        if (!keyword) return true;
        return `${entry.term} ${entry.aka ?? ""} ${entry.plain} ${entry.why ?? ""}`
          .toLowerCase()
          .includes(keyword);
      })
      .slice()
      .sort(CORE_FIRST);
  }, [query, category]);

  const coreCount = glossary.filter((entry) => entry.kind === "core").length;

  return (
    <main className="reader reader-wide">
      <div className="reader-inner">
        <div className="breadcrumb"><span>参考</span><span>›</span><span>术语表</span></div>
        <h1>术语表</h1>
        <p className="lead">
          共 {glossary.length} 条。其中 {coreCount} 条是贯穿全站的核心词；每条都展开为
          「是什么、怎么工作、测试开发看什么、例子、误区、关联词和来源」。点条目末尾的页号
          可以跳回它第一次出现的地方。
        </p>

        <section className="glossary-controls">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索术语、别名或解释…"
              aria-label="搜索术语"
            />
          </label>
          <div className="glossary-filters" role="group" aria-label="按分类筛选">
            {["全部", ...glossaryCategories].map((name) => (
              <button
                key={name}
                className={category === name ? "active" : ""}
                onClick={() => setCategory(name)}
                aria-pressed={category === name}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        <p className="glossary-count">{filtered.length} 条匹配</p>

        <div className="glossary-list">
          {filtered.map((entry) => (
            <article key={entry.term} className={`glossary-entry ${entry.kind}`}>
              <div className="glossary-category-label">
                <span>{entry.category}</span>
                <small>{entry.kind === "core" ? "核心术语" : "页面术语"}</small>
              </div>
              <h2>
                {entry.term}
                {entry.aka && <small>又称 {entry.aka}</small>}
              </h2>
              <p className="glossary-plain">{entry.plain}</p>
              {entry.why && (
                <p className="glossary-why">
                  <b>为什么要关心它</b>
                  {entry.why}
                </p>
              )}
              <div className="glossary-detail-grid">
                <section><b>它怎么工作</b><p>{entry.mechanism}</p></section>
                <section><b>测试开发看什么</b><ul>{entry.testFocus.map((item) => <li key={item}>{item}</li>)}</ul></section>
                <section><b>可复用例子</b><p>{entry.example}</p></section>
                <section><b>常见误区</b><ul>{entry.pitfalls.map((item) => <li key={item}>{item}</li>)}</ul></section>
              </div>
              {entry.related.length > 0 && <p className="glossary-related"><b>关联词：</b>{entry.related.map((term) => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</p>}
              {entry.sources.length > 0 && <div className="glossary-sources"><b>延伸来源</b><ul>{entry.sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><small>{source.kind} · {source.accessed}</small></li>)}</ul></div>}
              {entry.pages.length > 0 && (
                <p className="glossary-pages">
                  出现在：
                  {entry.pages.slice(0, 6).map((pageId) => (
                    <button key={pageId} onClick={() => onOpenPage(pageId)}>{pageId}</button>
                  ))}
                  {entry.pages.length > 6 && <span>等 {entry.pages.length} 页</span>}
                </p>
              )}
            </article>
          ))}
          {filtered.length === 0 && <p className="glossary-empty">没有匹配的术语。换个关键词，或把分类切回「全部」。</p>}
        </div>
      </div>
    </main>
  );
}

const LAYERS = [
  {
    name: "第 1 层 · 契约与门禁",
    what: "规定什么样的内容才算写完了",
    detail: "页面深度、判断表数量、跨页重复率、指标阈值可判定性、架构图与正文的交叉引用——这些都由脚本检查，不通过就构建失败。",
  },
  {
    name: "第 2 层 · 方法论",
    what: "九阶段测试生命周期、六层 Oracle、证据成熟度分级",
    detail: "回答「一次测试从哪里开始、到哪里算结束、每一步的判据由谁提供」。它约束内容源怎么写。",
  },
  {
    name: "第 3 层 · 内容源",
    what: "14 份 JSON，是深度正文层的事实来源",
    detail: "每页包含失效点、术语、能力演进、架构索引、方法表、指标卡、反例、诊断树、演练、门禁、带走物。改内容改这里。",
  },
  {
    name: "第 4 层 · 交付面",
    what: "站点页面与维度文档",
    detail: "由内容源投影生成。直接改这一层会在下次生成时被覆盖——这是设计意图，不是缺陷。",
  },
];

const PAGE_SECTIONS = [
  ["失效点", "不做这件事会得到什么错误结论。每一条都必须带一个可核查的数字，否则它只是「这样不好」。"],
  ["术语前置", "本页判断真正依赖的几个词，先说清楚再往下走。"],
  ["能力演进", "只有传统专项模块有：这项能力原来怎么做、在 AI 系统上为什么不够用、融合之后怎么做，以及哪些地基不变。"],
  ["架构索引", "架构图上的每个节点由正文哪一段负责、产出什么工件。节点名必须与图逐字一致，由门禁双向校验。"],
  ["方法判断表", "本页的核心方法，写成可以照着做判断的表而不是段落。"],
  ["指标卡", "测什么、硬阈值是多少、多久复测一次。阈值必须是可比较的数字，写「良好」会被门禁拒绝。"],
  ["反例", "两种看起来对但不成立的做法，并说明它为什么看起来是对的。建议先遮住第三列自己判断。"],
  ["诊断树", "出现某个症状时，按什么顺序往下查。"],
  ["演练", "一次可运行或可手工完成的练习，通常 30–50 分钟。"],
  ["三段式门禁", "硬红线、统计判据、风险接受。第三段永远需要一个具名的人，不能由脚本代签。"],
  ["带走物", "这一页结束后你手上应该多出来的东西。"],
];

export function DesignView() {
  return (
    <main className="reader reader-wide">
      <div className="reader-inner">
        <div className="breadcrumb"><span>参考</span><span>›</span><span>设计思路</span></div>
        <h1>这套课程是怎么设计的</h1>
        <p className="lead">
          这一页回答三个问题：内容凭什么可信、页面为什么长成这样、以及哪些结论现在还不成立。
          如果你只想快速开始，直接从左侧第一页读起即可；这里是给想知道「为什么」的人准备的。
        </p>

        <section className="design-section">
          <h2>一、被替换掉的那个默认做法</h2>
          <p>
            大多数技术课程的默认做法是「把知道的东西讲清楚」。它的问题不在于讲得对不对，
            而在于读者读完之后，仍然不知道<b>做到什么程度算做到了</b>。
          </p>
          <p>
            本站在改造前实测过一次：102 页里有 60 页的正文<b>没有任何可判定阈值</b>，全站中位数为 0。
            读者拿到的是「要做鲁棒性测试」，而不是「pass^5 的 95% 置信区间下界要 ≥ 80%，P0 任务重复 10 次」。
            前者读起来没有错，但它不能被执行、不能被检查、也不能用来判断该不该发版。
          </p>
          <p>
            所以这套课程的设计目标不是「讲得更全」，而是<b>让「正确的废话」在机器层面无法通过</b>。
          </p>
        </section>

        <section className="design-section">
          <h2>二、四层结构，单向依赖</h2>
          <p>内容不是写在页面上的，页面是最后一层投影。四层之间是单向的：上层约束下层，下层不能反向修改上层。</p>
          <ol className="design-layers">
            {LAYERS.map((layer) => (
              <li key={layer.name}>
                <b>{layer.name}</b>
                <span>{layer.what}</span>
                <p>{layer.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="design-section">
          <h2>三、每一页固定的十一段</h2>
          <p>
            页面结构是强制的，不是模板偏好。固定结构的作用是让「缺了什么」可以被机器发现——
            少了指标卡、判断表不足三张、架构图节点没有解释，构建都会失败。
          </p>
          <dl className="design-sections">
            {PAGE_SECTIONS.map(([name, detail]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="design-section">
          <h2>四、架构图为什么必须被引用</h2>
          <p>
            每页都配架构图，这件事本身不难。难的是图和正文说的是不是同一件事——
            图很容易变成一张放在开头的插画，读者看一眼就滑过去。
          </p>
          <p>
            这里的做法是让它成为骨架：<b>架构索引</b>那一段要求图上每个节点都声明由正文哪一段负责、
            产出什么工件；校验器会双向比对——正文引用了图上没有的节点，或者图上画了却没被解释，
            都会让构建失败。图改了而正文没跟，是构建错误，不是文档瑕疵。
          </p>
        </section>

        <section className="design-section">
          <h2>五、当前的证据边界</h2>
          <p>
            这是本站最重要的一条诚实性声明：<b>内容完整不等于结论已被验证</b>。
          </p>
          <p>
            当前全站处于<b>离线夹具可复现</b>这一级。它证明的是内容结构与深度达标、命令逐字可执行、
            材料闭包成立、实验的红绿可复现。它<b>不</b>证明任何真实模型的准确率、企业集成效果、
            从业者认可或生产收益——「接了真实模型」「做过集成测试」「从业者评审过」「生产验证过」
            这四级全部标记为 <b>NOT_RUN</b>。
          </p>
          <p>
            页面里出现的所有阈值同理：带来源的按来源引用，其余是结构默认值，
            必须用你自己前三个版本的实测分布重新标定之后，才能当作你系统的验收线。
          </p>
        </section>

      </div>
    </main>
  );
}
