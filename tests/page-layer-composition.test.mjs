import assert from "node:assert/strict";
import test from "node:test";

import { pages } from "../content/course.ts";

const page = (id) => {
  const value = pages.find((item) => item.id === id);
  assert.ok(value, `${id} must be public`);
  return value;
};

const titles = (id) => page(id).blocks.map((block) => block.title);

test("quality pages retain review, worked-case, practice, and calculation layers", () => {
  assert.ok(titles("TD-T20").includes("CI 门禁复盘：报告绿色不等于变更可放行"));
  assert.ok(titles("TD-T20").includes("分层 CI worked case"));
  assert.ok(titles("TD-T20").includes("CI 分层实操：交给值班工程师的发布卡"));
  assert.ok(titles("TD-T20").includes("CI 门禁计算与迁移验收"));

  assert.ok(titles("TD-T22").includes("Trace-to-Regression 复盘：事故闭环要留下可重放证据"));
  assert.ok(titles("TD-T22").includes("事故回归 worked case"));
  assert.ok(titles("TD-T22").includes("Trace-to-Regression 实操：从一条事故到稳定回归"));
  assert.ok(titles("TD-T22").includes("Trace 回归计算与迁移验收"));
});

test("benchmark pages retain source review and calculation instead of last-write-wins", () => {
  for (const id of ["TD-B02", "TD-B03", "TD-B06", "TD-T25"]) {
    const blocks = page(id).blocks;
    assert.ok(blocks.some((block) => block.title.includes("复盘")), `${id} review layer missing`);
    assert.ok(blocks.some((block) => block.title.includes("计算") || block.title.includes("验收")), `${id} calculation layer missing`);
  }
  assert.ok(titles("TD-B03").includes("指标分母诊断"));
  assert.ok(titles("TD-T25").includes("Capstone 追踪诊断"));
});

test("serving diagnosis and Agent depth repairs are learner-visible", () => {
  const diagnosis = page("TD-A05").blocks.find((block) => block.title === "Queue、Prefill、Decode、KV 与下游：四列诊断卡");
  assert.deepEqual(diagnosis?.table?.headers, ["症状/问题", "疑似层", "下一步检查", "修复/重跑"]);
  assert.equal(diagnosis?.table?.rows.length, 4);

  assert.match(page("TD-AG-00").blocks.flatMap((block) => block.body ?? []).join("\n"), /cross-domain decision sheet/);
  assert.match(page("TD-AG-05").blocks.flatMap((block) => block.body ?? []).join("\n"), /autonomy envelope/);
});
