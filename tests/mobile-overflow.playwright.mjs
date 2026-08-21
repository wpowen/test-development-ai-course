import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { homedir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { releaseScope } from "../content/course.ts";

const siteRoot = fileURLToPath(new URL("..", import.meta.url));
const distRoot = path.join(siteRoot, "dist-github-pages");
const playwrightCli = path.join(homedir(), ".codex/skills/playwright/scripts/playwright_cli.sh");
const session = `course-mobile-overflow-${process.pid}`;

function runCli(args, { allowFailure = false } = {}) {
  const result = spawnSync(playwrightCli, args, {
    cwd: siteRoot,
    encoding: "utf8",
    env: { ...process.env, PLAYWRIGHT_CLI_SESSION: session },
  });
  if (!allowFailure) {
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  }
  return result.stdout.trim();
}

async function availablePort() {
  return await new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close((error) => error ? reject(error) : resolve(address.port));
    });
  });
}

async function waitForServer(url) {
  let lastError;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw lastError;
}

test("every page in the current public release scope fits a 390px viewport without horizontal document overflow", { timeout: 180_000 }, async () => {
  assert.ok(existsSync(playwrightCli), `Playwright Skill wrapper missing: ${playwrightCli}`);
  assert.ok(existsSync(path.join(distRoot, "index.html")), "run npm run export:static before this test");

  const html = await readFile(path.join(distRoot, "index.html"), "utf8");
  const dataMatch = html.match(/const COURSE_DATA=(\{[\s\S]*?\});\s*const DATA=/);
  const data = dataMatch
    ? JSON.parse(dataMatch[1])
    : JSON.parse(await readFile(path.join(distRoot, "course-index.json"), "utf8"));
  const pageIds = data.pages.map((page) => page.id);
  assert.ok(pageIds.length > 0, "the public release scope must not be empty");
  assert.equal(new Set(pageIds).size, pageIds.length, "the public catalog must not contain duplicate page IDs");
  assert.deepEqual(
    pageIds,
    releaseScope.promisedPageIds,
    "the mobile regression must exercise the exact ordered releaseScope.promisedPageIds catalog",
  );

  const port = await availablePort();
  const baseUrl = `http://127.0.0.1:${port}/`;
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", distRoot], {
    cwd: siteRoot,
    stdio: "ignore",
  });

  try {
    await waitForServer(baseUrl);
    runCli(["open", baseUrl, "--browser", "chrome"]);
    // Playwright Skill guard: capture the page state before browser evaluation.
    runCli(["snapshot"]);
    runCli(["resize", "390", "844"]);
    const measurements = JSON.parse(runCli([
      "run-code",
      `async page => {
        const ids = ${JSON.stringify(pageIds)};
        const results = [];
        for (const id of ids) {
          await page.evaluate(expected => {
            history.replaceState(null, "", "#" + expected);
            window.renderAll();
          }, id);
          await page.waitForFunction(expected => {
            const crumb = document.querySelector(".crumb")?.textContent ?? "";
            return location.hash === "#" + expected && crumb.includes(expected) && document.querySelector(".block");
          }, id, { timeout: 5_000 });
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          results.push(await page.evaluate(pageId => {
            const viewportWidth = document.documentElement.clientWidth;
            const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
            const widest = Array.from(document.querySelectorAll("*"))
              .map(element => {
                const rect = element.getBoundingClientRect();
                return {
                  tag: element.tagName.toLowerCase(),
                  className: typeof element.className === "string" ? element.className : "",
                  width: Math.round(rect.width),
                  right: Math.round(rect.right),
                  overflowRight: Math.round(rect.right - viewportWidth),
                };
              })
              .filter(item => item.overflowRight > 1)
              .sort((left, right) => right.overflowRight - left.overflowRight)
              .slice(0, 3);
            return { pageId, viewportWidth, scrollWidth, widest };
          }, id));
        }
        return results;
      }`,
      "--raw",
    ]));

    const failures = measurements.filter((item) => item.scrollWidth > item.viewportWidth + 1);
    assert.deepEqual(failures, [], `mobile horizontal overflow detected:\n${JSON.stringify(failures, null, 2)}`);
  } finally {
    runCli(["close"], { allowFailure: true });
    server.kill("SIGTERM");
  }
});
