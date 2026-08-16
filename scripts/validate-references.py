#!/usr/bin/env python3
"""校验外部引用的完整性与诚实性。

用法：
    python3 scripts/validate-references.py

## 它拦的是什么

`validate-deep-sources.py` 拦的是「内容能不能落地」。这个校验器拦的是另一件事：
**结论有没有出处，以及出处有没有被诚实地限定**。

课程里最容易出现、也最难被发现的退化有四种，这里逐一变成机器可判定：

1. **引用了不存在的资料。** 内容源里写 `refs: ["R-FOOBAR"]`，台账里没有这条。
   渲染层会静默丢弃它（见 `references.ts` 的 resolveReferences），页面上什么都不显示——
   作者以为标了依据，读者一个链接都看不到。这一类必须由门禁而不是渲染层报错。

2. **只写「能证明」不写「不能证明」。** 这是拿工具给结论背书的技术形态。
   台账里两个字段都必须非空，且「不能证明」不许写成「无」「暂无」这类占位。

3. **版本没有锚点。** 「用 Playwright 做 UI 自动化」这种句子三年后仍然成立，
   但阈值、参数名与默认行为会变。仓库类引用必须有 release / tag / commit 锚点。

4. **许可证口径被人为放宽。** `reuse` 由许可证按 policy 推导，不许手工改成更宽松的档。
   这里重算一遍并比对——因为「能不能把这段代码抄进自己仓库」是页面上印给读者看的信息，
   写错了就是给读者埋一个法律问题。

## 分阶段生效

与 `validate-deep-sources.py` 同一套规程：只有进入 `ENFORCED` 的模块才被强制要求
每页达到最低引用数。新模块改造完成后加进名单，此后退化会立刻被拦下。
"""
from __future__ import annotations

import argparse
import concurrent.futures
import importlib.util
import json
import pathlib
import re
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "methodology" / "dimensions" / "_sources"
CATALOG = ROOT / "research" / "reference-catalog.json"
LIBRARY = ROOT / "research" / "reference-library.json"
STANDARD_REVIEW_QUEUE = ROOT / "research" / "reference-standards-review-queue.json"
BUILD_REFERENCE_LIBRARY = ROOT / "scripts" / "build-reference-library.py"

_build_spec = importlib.util.spec_from_file_location("build_reference_library", BUILD_REFERENCE_LIBRARY)
assert _build_spec and _build_spec.loader
_build_reference_library = importlib.util.module_from_spec(_build_spec)
_build_spec.loader.exec_module(_build_reference_library)

# 已完成引用层改造、受强制校验的模块。改造一个加一个。
ENFORCED: set[str] = {
    "agent-architecture-supplement",
    "agent-performance",
    "career-evolution",
    "prompt-first-lesson-supplement",
    "requirements-lifecycle-supplement",
    "ai-assisted-testing",
    "quality-platform",
    "quality-system",
    "agent-workflow",
    "ai-serving",
    "rag-quality",
    "ai-foundations",
    "benchmark",
    "professional-specializations",
}

# 每页最低引用数。3 是下限不是目标：一页只引 1 条通常意味着结论来自单一来源，
# 而单一来源无法暴露该来源自身的偏差。
MIN_REFS_PER_PAGE = 3
# 每页至少要有这么多段挂了 refs。全页引用集中在一段上，等于其余段落仍然没有出处。
MIN_SECTIONS_WITH_REFS = 3

# 「不能证明」列的占位词。写了等于没写，且比没写更有害——它看起来已经被考虑过了。
PLACEHOLDER = re.compile(r"^(无|暂无|N/?A|待补|TBD|不适用|-{1,3})[。.]?$", re.IGNORECASE)

SECTION_KEYS = (
    "failure", "terms", "evolution", "toolchain", "archref",
    "method", "metrics", "counter", "diagnosis", "drill", "gate",
)


def load(path: pathlib.Path) -> dict:
    if not path.exists():
        print(f"  ✗ 缺少 {path.relative_to(ROOT)}，先跑 scripts/build-reference-library.py", file=sys.stderr)
        sys.exit(2)
    return json.loads(path.read_text(encoding="utf-8"))


def check_library(library: dict, policy: dict[str, list[str]]) -> list[str]:
    """台账自身的完整性：每条都要有出处、锚点、双向边界，且复用口径不被放宽。"""
    problems: list[str] = []
    for entry_id, entry in library["entries"].items():
        if not entry.get("url"):
            problems.append(f"{entry_id}: 没有可点击的 URL，读者无法核对")
        for field, label in (("whatItProves", "能证明"), ("whatItDoesNotProve", "不能证明")):
            value = (entry.get(field) or "").strip()
            if not value:
                problems.append(f"{entry_id}: 缺少「{label}」")
            elif PLACEHOLDER.match(value):
                problems.append(f"{entry_id}: 「{label}」是占位词「{value}」，等于没写")
            elif len(value) < 20:
                problems.append(f"{entry_id}: 「{label}」只有 {len(value)} 字，说不清边界")
        if entry.get("repo") and not entry.get("anchor"):
            problems.append(f"{entry_id}: 仓库类引用没有版本锚点，读者无法知道结论对应哪个版本")

        # 复用口径重算：只允许比推导结果更保守，不允许更宽松。
        license_id = entry.get("license")
        rank = {"link-only": 0, "quote-with-share-alike": 1, "code-quotable": 2}
        if not license_id:
            derived = "link-only"
        else:
            derived = next(
                (bucket for bucket in ("code-quotable", "quote-with-share-alike", "link-only")
                 if license_id in policy[bucket]),
                "link-only",
            )
        actual = entry.get("reuse", "link-only")
        if rank[actual] > rank[derived]:
            problems.append(
                f"{entry_id}: 复用口径被放宽（许可证 {license_id} 应为 {derived}，实际 {actual}）"
            )
    return problems


def check_standard_versioning(catalog: dict, library: dict) -> list[str]:
    """标准必须保留版本化主工件，且不稳定状态必须在复核队列里可见。"""
    problems: list[str] = []
    catalog_standards = {entry["id"]: entry for entry in catalog["entries"] if entry["kind"] == "standard"}
    library_entries = library["entries"]
    for entry_id, catalog_entry in catalog_standards.items():
        for problem in _build_reference_library.validate_standard_metadata(catalog_entry):
            problems.append(f"{entry_id}: 标准版本契约无效：{problem}")
        generated = library_entries.get(entry_id)
        if not generated:
            problems.append(f"{entry_id}: 标准没有进入生成后的引用台账")
            continue
        for field in _build_reference_library.STANDARD_FIELDS:
            if generated.get(field) != catalog_entry.get(field):
                problems.append(f"{entry_id}: 生成台账中的 {field} 与引用目录不一致；请重建")

    if not STANDARD_REVIEW_QUEUE.exists():
        problems.append("缺少 research/reference-standards-review-queue.json；请重建引用台账")
        return problems
    queue = json.loads(STANDARD_REVIEW_QUEUE.read_text(encoding="utf-8"))
    if queue.get("itemCount") != len(queue.get("items", [])):
        problems.append("标准版本复核队列 itemCount 与 items 数量不一致")
    queued_ids = {item.get("referenceId") for item in queue.get("items", []) if item.get("reviewStatus") == "required"}
    for entry_id, entry in library_entries.items():
        if entry.get("kind") == "standard" and entry.get("lifecycle", {}).get("status") != "published":
            if entry_id not in queued_ids:
                problems.append(f"{entry_id}: 生命周期不是 published，却没有进入标准版本复核队列")
    return problems


def collect_refs(page: dict) -> dict[str, list[str]]:
    """返回 段名 → 该段声明的引用 ID。"""
    found: dict[str, list[str]] = {}
    for key in SECTION_KEYS:
        section = page.get(key)
        if isinstance(section, dict) and section.get("refs"):
            found[key] = list(section["refs"])
    return found


# 链路存活检查用的浏览器 UA。不少文档站对默认的 Python UA 直接返回 403，
# 那会产出一批假阳性，比不检查更糟。
BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36"


def probe(url: str, attempts: int = 3) -> tuple[str, int | str]:
    """HEAD 不被普遍支持，统一用 GET 但不读 body。重试是必需的——实测有站点会偶发超时。"""
    last: int | str = "unknown"
    for _ in range(attempts):
        try:
            request = urllib.request.Request(url, method="GET", headers={"User-Agent": BROWSER_UA})
            with urllib.request.urlopen(request, timeout=25) as response:
                if 200 <= response.status < 400:
                    return url, response.status
                last = response.status
        except urllib.error.HTTPError as error:
            last = error.code
            # 401/403 反爬、405 方法不支持、429 限流——都说明资源存在，不算链接失效。
            # 429 尤其要容忍：并发探测同一个文档站（readthedocs 上就有好几个）必然触发限流，
            # 把它判成失效会产生一批只在批量检查时出现、单独访问又正常的假阳性。
            if error.code in (401, 403, 405, 429):
                return url, error.code
        except Exception as error:  # noqa: BLE001 — 网络错误形态很多，一律记为不可达
            last = type(error).__name__
    return url, last


def check_urls(library: dict) -> list[str]:
    targets: set[str] = set()
    for entry in library["entries"].values():
        for key in ("url", "repoUrl", "docUrl"):
            if entry.get(key):
                targets.add(entry[key])
        if entry.get("anchor"):
            targets.add(entry["anchor"]["url"])

    problems: list[str] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for url, status in pool.map(probe, sorted(targets)):
            if not (isinstance(status, int) and 200 <= status < 400) and status not in (401, 403, 405, 429):
                problems.append(f"链接不可达（{status}）：{url}")
    print(f"  链路存活：检查 {len(targets)} 个 URL，{len(targets) - len(problems)} 个可达")
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description="校验外部引用的完整性与诚实性")
    parser.add_argument(
        "--check-urls",
        action="store_true",
        help="额外访问每个 URL 确认仍然可达。默认关闭：门禁不应该依赖网络，"
             "否则断网就等于内容有问题，会训练团队忽略这个门禁。建议放在每周定时任务里跑。",
    )
    args = parser.parse_args()

    catalog = load(CATALOG)
    library = load(LIBRARY)
    known = set(library["entries"])
    problems = check_library(library, catalog["policy"])
    problems.extend(check_standard_versioning(catalog, library))

    checked_pages = 0
    for source in sorted(SOURCE_DIR.glob("*.json")):
        slug = source.stem
        enforced = slug in ENFORCED
        pages = json.loads(source.read_text(encoding="utf-8"))
        for page_id, page in pages.items():
            by_section = collect_refs(page)
            all_ids = [rid for ids in by_section.values() for rid in ids]

            # 未知 ID 无论模块是否强制都要报——静默丢弃是最坏的失败形态。
            for section, ids in by_section.items():
                for rid in ids:
                    if rid not in known:
                        problems.append(f"{slug}/{page_id}.{section}: 引用了台账里不存在的 {rid}")

            if not enforced:
                continue
            checked_pages += 1

            unique = set(all_ids) & known
            if len(unique) < MIN_REFS_PER_PAGE:
                problems.append(
                    f"{slug}/{page_id}: 只有 {len(unique)} 条有效引用，至少 {MIN_REFS_PER_PAGE} 条"
                )
            if len(by_section) < MIN_SECTIONS_WITH_REFS:
                problems.append(
                    f"{slug}/{page_id}: 只有 {len(by_section)} 段挂了依据，"
                    f"至少 {MIN_SECTIONS_WITH_REFS} 段（否则其余段落仍然没有出处）"
                )
            # 台账「声明」服务于这一页的资料，页面自己一条都没引到，说明两边已经脱节。
            #
            # 这里必须用 declaredPages 而不是 pages：pages 是「声明 ∪ 正文实际引用」的并集，
            # 拿它来判断会退化成自证——正文引了什么就出现在 pages 里，检查永远通过。
            declared = {
                rid for rid, e in library["entries"].items()
                if page_id in (e.get("declaredPages") or e["pages"])
            }
            if declared and not (unique & declared):
                problems.append(
                    f"{slug}/{page_id}: 台账声明有 {len(declared)} 条资料服务于本页，正文一条都没引"
                )

    if args.check_urls:
        problems.extend(check_urls(library))

    if problems:
        for problem in problems:
            print(f"  ✗ {problem}", file=sys.stderr)
        print(f"\n{len(problems)} 处引用问题。", file=sys.stderr)
        return 1

    pending = sorted({s.stem for s in SOURCE_DIR.glob("*.json")} - ENFORCED)
    print(
        f"引用校验通过：台账 {len(known)} 条，"
        f"{len(ENFORCED)} 个模块已强制（{checked_pages} 页，每页 ≥ {MIN_REFS_PER_PAGE} 条依据）。"
    )
    if pending:
        print(f"尚未纳入强制：{', '.join(pending)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
