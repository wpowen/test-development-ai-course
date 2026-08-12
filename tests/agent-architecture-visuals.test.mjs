import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { pages } from "../content/course.ts";

const siteRoot = fileURLToPath(new URL("..", import.meta.url));
const publicRoot = path.join(siteRoot, "public");
const pageIds = Array.from({ length: 11 }, (_, index) => `TD-AG-${String(index).padStart(2, "0")}`);

const requiredSvgTerms = {
  "TD-AG-00": ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "离线 CI", "沙箱回放", "影子", "在线持续", "护栏", "反馈"],
  "TD-AG-01": ["金标", "人工标注", "Judge", "偏差探针", "分歧", "停用"],
  "TD-AG-02": ["Task", "Span", "Tool", "Observation", "首错", "Outcome", "Trajectory"],
  "TD-AG-03": ["Agent A", "Handoff", "Agent B", "上下文隔离", "故障注入", "熔断", "Owner"],
  "TD-AG-04": ["Agent 运行", "中断", "脏状态", "回滚", "人工接管", "恢复", "审计"],
  "TD-AG-05": ["任务集", "重复运行", "pass@k", "pass^k", "置信区间", "Horizon", "证据不足"],
  "TD-AG-06": ["不可信输入", "MCP", "记忆", "委托", "策略沙箱", "不可逆动作", "Kill Switch"],
  "TD-AG-07": ["Workload", "Queue", "LLM", "Tool", "延迟", "成本", "预算门禁"],
  "TD-AG-08": ["业务规则", "四维版本", "委托", "工具动作", "审计证据", "风险接受", "回滚"],
  "TD-AG-09": ["离线 CI", "沙箱回放", "影子", "在线持续", "硬红线", "统计门禁", "风险接受"],
  "TD-AG-10": ["数据时效", "建议任务", "执行任务", "能力沙箱", "硬额度", "人工审批", "回滚"],
};

test("all Agent architecture pages use their professional visual, not the generic course strip", async () => {
  const agentPages = pages.filter((page) => pageIds.includes(page.id));
  assert.deepEqual(agentPages.map((page) => page.id), pageIds);
  for (const page of agentPages) {
    assert.equal(page.architecture?.visual?.src, `materials/agent-architecture-system/visuals/${page.id}.svg`);
    assert.match(page.architecture?.visual?.alt ?? "", /风险|证据|边界|门禁|轨迹|架构/);
    assert.ok(page.architecture?.caption.includes("不代表"), `${page.id} caption must preserve maturity boundary`);
  }
});

test("each Agent SVG expresses the page-specific system, failure path, and decision boundary", async () => {
  for (const pageId of pageIds) {
    const svg = await readFile(path.join(publicRoot, `materials/agent-architecture-system/visuals/${pageId}.svg`), "utf8");
    assert.ok(svg.length >= 5000, `${pageId} SVG is still a thin box strip`);
    assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
    assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
    assert.match(svg, /marker-end=/, `${pageId} needs directed relationships`);
    assert.ok((svg.match(/class="node/g) ?? []).length >= 7, `${pageId} needs at least seven semantic nodes`);
    assert.ok((svg.match(/class="edge/g) ?? []).length >= 7, `${pageId} needs at least seven semantic edges`);
    assert.match(svg, /FAIL|BLOCKED|NOT_RUN|停止|回滚|证据不足/, `${pageId} needs an explicit failure or stop path`);
    for (const term of requiredSvgTerms[pageId]) assert.ok(svg.includes(term), `${pageId} SVG missing ${term}`);
  }
});

test("the Agent overview teaches the full D0-D7 and four-ring architecture in one bounded visual", async () => {
  const svg = await readFile(path.join(publicRoot, "materials/agent-architecture-system/visuals/TD-AG-00.svg"), "utf8");
  for (const section of ["输入与风险", "D0 评估可信", "D1 单体能力", "D2 编排协作", "D3 人机协同", "D4 鲁棒可靠", "D5 安全对抗", "D6 效率经济", "D7 业务治理", "四证据环", "运行时护栏", "决策与反馈"]) {
    assert.ok(svg.includes(section), `overview missing section ${section}`);
  }
  assert.match(svg, /高危 blocker/);
  assert.match(svg, /不得用总分抵消/);
});
