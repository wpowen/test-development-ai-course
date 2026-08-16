#!/usr/bin/env python3
"""把人工判断的引用目录 + GitHub 实时元数据，合成为页面可消费的引用台账。

用法：
    python3 scripts/build-reference-library.py            # 抓取实时元数据后重建
    python3 scripts/build-reference-library.py --offline  # 沿用上次抓到的元数据，只重算派生字段

## 为什么要有这一步

课程里写「Playwright 1.4x」这种手抄版本号，三个月后就是错的，而且没有任何机制会告诉你它错了。
这个脚本把版本号、许可证、最近提交从 `gh api` 现抓，人工只维护判断类字段
（这条资料能证明什么、不能证明什么、哪几页在用）。版本会腐烂，判断不会。

## 许可证复用口径

`reuse` 不由人工指定，而是从 GitHub 报告的 SPDX 许可证按 catalog.policy 推导：

  code-quotable          MIT / Apache-2.0 / BSD 等宽松许可，可整段搬运源码
  quote-with-share-alike MPL / EPL / CC-BY-SA，可短引并署名，不整段搬进本仓库
  link-only              AGPL / GPL / LGPL / 许可证未知，只给链接与转述

GitHub 无法判定许可证时返回 NOASSERTION，一律降级为 link-only。这是保守但可自动执行的口径：
宁可少搬一段代码，也不要在一百多页课程里埋一个需要人工逐条复核的许可证问题。
"""
from __future__ import annotations

import argparse
import json
import pathlib
import subprocess
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOG = ROOT / "research" / "reference-catalog.json"
LIBRARY = ROOT / "research" / "reference-library.json"
SITE_MODULE = ROOT / "site" / "content" / "references.ts"

GITHUB_FIELDS = (
    "[.full_name,(.license.spdx_id // \"NOASSERTION\"),"
    "(.stargazers_count|tostring),.pushed_at,.default_branch,(.html_url)]|join(\"\\u0001\")"
)


def run_gh(endpoint: str, jq: str) -> str | None:
    """调 gh api；失败返回 None 而不是抛异常——单条资料抓不到不该让整个构建停下。"""
    result = subprocess.run(
        ["gh", "api", endpoint, "--jq", jq],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    value = result.stdout.strip()
    return value or None


def fetch_repo(repo: str) -> dict[str, Any]:
    raw = run_gh(f"repos/{repo}", GITHUB_FIELDS)
    if raw is None:
        return {"fetchStatus": "unreachable"}
    full_name, spdx, stars, pushed_at, branch, html_url = raw.split("\u0001")

    release = run_gh(
        f"repos/{repo}/releases/latest",
        '[.tag_name,.published_at[0:10],.html_url]|join("\\u0001")',
    )
    if release:
        tag, published, release_url = release.split("\u0001")
        anchor = {"type": "release", "value": tag, "date": published, "url": release_url}
    else:
        # 没有 GitHub Release 的仓库（Debezium、CodeQL 等）退回到最新 tag；
        # 再没有 tag 就锚到默认分支的 HEAD commit，永远给得出一个可复现的锚点。
        tag = run_gh(f"repos/{repo}/tags?per_page=1", ".[0].name")
        if tag:
            anchor = {
                "type": "tag",
                "value": tag,
                "date": None,
                "url": f"https://github.com/{repo}/releases/tag/{tag}",
            }
        else:
            sha = run_gh(f"repos/{repo}/commits/{branch}", ".sha")
            anchor = {
                "type": "commit",
                "value": (sha or "unknown")[:12],
                "date": None,
                "url": f"https://github.com/{repo}/commit/{sha}" if sha else html_url,
            }

    return {
        "fetchStatus": "ok",
        "repoUrl": html_url,
        "canonicalRepo": full_name,
        "license": spdx,
        "stars": int(stars),
        "lastPushedAt": pushed_at,
        "anchor": anchor,
    }


def resolve_reuse(policy: dict[str, list[str]], license_id: str | None) -> tuple[str, str]:
    """返回 (口径, 给读者看的一句话说明)。"""
    if not license_id:
        return "link-only", "非代码资料，按链接引用与转述处理"
    for bucket in ("code-quotable", "quote-with-share-alike", "link-only"):
        if license_id in policy[bucket]:
            break
    else:
        bucket = "link-only"
    note = {
        "code-quotable": f"{license_id}：宽松许可，可整段引用源码并保留出处与版本锚点",
        "quote-with-share-alike": f"{license_id}：弱著佐权，可短引并署名，不整段搬入本仓库",
        "link-only": (
            "许可证未能自动判定，按最保守口径只链接不搬代码"
            if license_id == "NOASSERTION"
            else f"{license_id}：著佐权许可，只链接与转述，不搬代码"
        ),
    }[bucket]
    return bucket, note


SITE_MODULE_HEADER = '''/**
 * 引用台账的站点投影。
 *
 * 内容源：research/reference-catalog.json（人工判断）+ GitHub API（版本与许可证）
 * 本文件由 `python3 scripts/build-reference-library.py` 生成，直接编辑会被覆盖。
 *
 * 页面正文块只携带引用 ID（`refs: ["R-SCHEMATHESIS"]`），渲染时在这里查表展开成
 * 可点击、带版本锚点与许可证口径的引用卡。这样做的原因是：正文里散落 URL 会在
 * 上游改版时全站失效且无人发现，而 ID 引用能被门禁校验——引用了不存在的 ID 会构建失败。
 */

export type ReferenceReuse = "code-quotable" | "quote-with-share-alike" | "link-only";

export type ReferenceEntry = {
  id: string;
  /** repo=开源实现，spec=规范，standard=标准/RFC，doc=官方文档 */
  kind: "repo" | "spec" | "standard" | "doc";
  title: string;
  /** 这条资料在本模块里承担的角色，例如「传统专项工具」「机理说明」「AI 侧断言执行器」 */
  role: string;
  publisher: string | null;
  /** 读者应该点进去的那一个链接：优先官方文档，其次仓库 */
  url: string | null;
  repo: string | null;
  repoUrl: string | null;
  /** 版本锚点：release / tag / commit，附日期与可点击 URL */
  anchor: { type: string; value: string; date: string | null; url: string } | null;
  license: string | null;
  reuse: ReferenceReuse;
  reuseNote: string;
  lastPushedAt: string | null;
  /** 引它是为了证明什么 */
  whatItProves: string;
  /** 它不能证明什么——这一条比上一条更重要，缺了就变成拿工具背书结论 */
  whatItDoesNotProve: string;
};
'''


def ts_literal(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)


def render_site_module(entries: dict[str, Any], by_page: dict[str, list[str]]) -> str:
    keep = (
        "id", "kind", "title", "role", "publisher", "url", "repo", "repoUrl",
        "anchor", "license", "reuse", "reuseNote", "lastPushedAt",
        "whatItProves", "whatItDoesNotProve",
    )
    lines = [SITE_MODULE_HEADER, "", "export const references: Record<string, ReferenceEntry> = {"]
    for entry_id in sorted(entries):
        entry = entries[entry_id]
        lines.append(f"  {ts_literal(entry_id)}: {{")
        for key in keep:
            lines.append(f"    {key}: {ts_literal(entry.get(key))},")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    lines.append("/** 页面 → 引用 ID。页面自身没声明 refs 时，用它兜底展示模块级引用。 */")
    lines.append("export const referencesByPage: Record<string, string[]> = {")
    for page in sorted(by_page):
        lines.append(f"  {ts_literal(page)}: {ts_literal(sorted(by_page[page]))},")
    lines.append("};")
    lines.append("")
    lines.append("""/**
 * 把引用 ID 展开成条目；未知 ID 直接丢弃而不是渲染成半个卡片。
 * 真正拦截未知 ID 的是 `scripts/validate-references.py`——渲染层保持沉默，门禁负责报错。
 */
export const resolveReferences = (ids: readonly string[] | undefined): ReferenceEntry[] =>
  (ids ?? []).map((id) => references[id]).filter((entry): entry is ReferenceEntry => Boolean(entry));
""")
    return "\n".join(lines)


SOURCE_DIR = ROOT / "methodology" / "dimensions" / "_sources"


def scan_actual_usage() -> dict[str, set[str]]:
    """扫描内容源里真正写了的 `refs`，返回 引用 ID → 用到它的页面集合。

    目录里的 `pages` 是作者的意图声明，这里拿到的是正文的实际使用。两者必然会分叉：
    写内容时临时决定多引一条、或者某条最终没用上，都不会有人回头改目录。
    与其要求人工同步两份名单（那从来不会持续发生），不如把实际使用并进来——
    目录负责「我打算让它服务哪几页」，扫描负责「它实际被哪几页引了」，并集才是真相。
    """
    usage: dict[str, set[str]] = {}
    for source in sorted(SOURCE_DIR.glob("*.json")):
        pages = json.loads(source.read_text(encoding="utf-8"))
        for page_id, page in pages.items():
            for section in page.values():
                if isinstance(section, dict):
                    for ref_id in section.get("refs") or []:
                        usage.setdefault(ref_id, set()).add(page_id)
    return usage


def build(offline: bool) -> int:
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    usage = scan_actual_usage()
    policy = catalog["policy"]
    previous: dict[str, Any] = {}
    if offline and LIBRARY.exists():
        previous = json.loads(LIBRARY.read_text(encoding="utf-8")).get("entries", {})

    entries: dict[str, Any] = {}
    unreachable: list[str] = []

    for item in catalog["entries"]:
        entry_id = item["id"]
        repo = item.get("repo")

        if repo and offline and entry_id in previous:
            fetched = {key: previous[entry_id][key] for key in
                       ("fetchStatus", "repoUrl", "canonicalRepo", "license", "stars", "lastPushedAt", "anchor")
                       if key in previous[entry_id]}
        elif repo:
            fetched = fetch_repo(repo)
        else:
            fetched = {}

        if fetched.get("fetchStatus") == "unreachable":
            unreachable.append(f"{entry_id} ({repo})")

        license_id = fetched.get("license")
        reuse, reuse_note = resolve_reuse(policy, license_id)

        entries[entry_id] = {
            "id": entry_id,
            "kind": item["kind"],
            "title": item["title"],
            "role": item["role"],
            "publisher": item.get("publisher") or (repo.split("/")[0] if repo else None),
            "url": item.get("url") or item.get("docUrl") or fetched.get("repoUrl"),
            "repo": repo,
            "repoUrl": fetched.get("repoUrl"),
            "docUrl": item.get("docUrl"),
            "anchorHint": item.get("anchorHint"),
            "license": license_id,
            "reuse": reuse,
            "reuseNote": reuse_note,
            "stars": fetched.get("stars"),
            "lastPushedAt": fetched.get("lastPushedAt"),
            "anchor": fetched.get("anchor"),
            "whatItProves": item["whatItProves"],
            "whatItDoesNotProve": item["whatItDoesNotProve"],
            "pages": sorted(set(item["pages"]) | usage.get(entry_id, set())),
            "declaredPages": sorted(item["pages"]),
        }

    by_page: dict[str, list[str]] = {}
    for entry in entries.values():
        for page in entry["pages"]:
            by_page.setdefault(page, []).append(entry["id"])

    payload = {
        "_doc": (
            "由 scripts/build-reference-library.py 生成，请勿手工编辑。"
            "判断类字段改 research/reference-catalog.json；版本与许可证改不了，它们来自 GitHub API。"
        ),
        "generatedBy": "scripts/build-reference-library.py",
        "entryCount": len(entries),
        "byPage": {page: sorted(ids) for page, ids in sorted(by_page.items())},
        "entries": entries,
    }
    LIBRARY.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SITE_MODULE.write_text(render_site_module(entries, by_page), encoding="utf-8")

    buckets: dict[str, int] = {}
    for entry in entries.values():
        buckets[entry["reuse"]] = buckets.get(entry["reuse"], 0) + 1

    print(f"引用台账已生成：{len(entries)} 条，覆盖 {len(by_page)} 页 → {LIBRARY.relative_to(ROOT)}")
    print("  复用口径：" + "，".join(f"{name} {count}" for name, count in sorted(buckets.items())))
    if unreachable:
        print(f"  ⚠ {len(unreachable)} 条仓库元数据抓取失败：{', '.join(unreachable)}", file=sys.stderr)
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--offline", action="store_true", help="沿用上次抓到的元数据，不调用 GitHub API")
    args = parser.parse_args()
    return build(args.offline)


if __name__ == "__main__":
    sys.exit(main())
