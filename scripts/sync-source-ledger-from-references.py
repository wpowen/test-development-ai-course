#!/usr/bin/env python3
"""把引用台账里的开源仓库回填进研究台账与 GitHub 工件台账。

用法：
    python3 scripts/sync-source-ledger-from-references.py            # 写入
    python3 scripts/sync-source-ledger-from-references.py --check    # 只报告差异，不写

## 为什么需要这一步

2026-08 引入 `research/reference-library.json` 之后，这个包里出现了两份互不相干的台账：

  · `research/source-ledger.csv`      研究阶段的调研台账，74 条，其中仓库类只有 4 条
  · `research/reference-library.json` 面向读者的引用台账，85 条，其中仓库类 61 条

两者只有 10 个 URL 重叠。也就是说：课程正文实际引用了 61 个开源仓库，而工厂层的
research corpus 只登记了 4 个——包契约、多渠道证据协议、`validate_career_package.py`
看到的都是那 4 个。台账因此在说一件与课程实际情况不符的事。

这个脚本消掉这份不一致：凡是被正文引用的仓库，都以 `primary repository` 身份登记进
研究台账，并同步生成 `github-artifacts.csv`。

## 诚实性约束

回填的行一律 `run_status=metadata-only`、`selected_for_lab=false`。这是准确的：
本课程读了这些仓库的文档、锚定了版本与许可证，但没有在 CI 里克隆并执行它们。
把 `selected_for_lab` 写成 true 会触发工厂校验器要求 `research/github-runs/` 下的
真实运行证据——那份证据不存在，写 true 就是伪造。
"""
from __future__ import annotations

import argparse
import csv
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "research" / "reference-library.json"
LEDGER = ROOT / "research" / "source-ledger.csv"
ARTIFACTS = ROOT / "research" / "github-artifacts.csv"
CHANNELS = ROOT / "research" / "channel-coverage.json"

LEDGER_COLUMNS = [
    "id", "title", "creator", "source_type", "platform", "language", "year", "url",
    "access_date", "evidence_tier", "publisher_group", "source_family_id", "channel_ids",
    "relevance", "credibility", "used_for", "limitations",
]
ARTIFACT_COLUMNS = [
    "artifact_id", "source_id", "repo_url", "commit_or_tag", "license", "last_commit_at",
    "release_or_commit_url", "issues_url", "ci_url", "setup_command", "smoke_command",
    "run_status", "run_at", "exit_code", "evidence_path", "selected_for_lab", "limitations",
]
# 仓库类来源统一登记到这两个渠道，与既有 4 条仓库行保持一致。
REPO_CHANNELS = "ai-primary;github-artifact"
ACCESS_DATE = "2026-08-14"

# CSV 单元格里的换行与逗号会破坏下游按行解析的工具；标题与说明统一压成一行并截断。
def flatten(text: str, limit: int) -> str:
    single = re.sub(r"\s+", " ", text or "").strip()
    return single if len(single) <= limit else single[: limit - 1] + "…"


def slug(owner_repo: str) -> str:
    return owner_repo.lower().replace("/", "-").replace("_", "-")


def next_ids(existing: set[str], count: int) -> list[str]:
    """接着现有最大编号往下发，不复用已删除的号——号被复用会让历史引用指向别的东西。"""
    used = {int(m.group(1)) for item in existing if (m := re.fullmatch(r"S(\d+)", item))}
    start = max(used, default=0) + 1
    return [f"S{start + offset:02d}" for offset in range(count)]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="只报告差异，不写文件")
    args = parser.parse_args()

    library = json.loads(LIBRARY.read_text(encoding="utf-8"))["entries"]
    repos = {
        entry_id: entry for entry_id, entry in library.items()
        if entry.get("repo") and entry.get("repoUrl")
    }

    ledger_rows = list(csv.DictReader(LEDGER.open(encoding="utf-8")))
    by_url = {row["url"].rstrip("/"): row for row in ledger_rows}
    missing = {
        entry_id: entry for entry_id, entry in repos.items()
        if entry["repoUrl"].rstrip("/") not in by_url
    }

    print(f"引用台账里的仓库：{len(repos)}")
    print(f"研究台账已登记：{len(repos) - len(missing)}")
    print(f"缺登记：{len(missing)}")
    if args.check:
        for entry_id, entry in sorted(missing.items()):
            print(f"  · {entry_id:28s} {entry['repo']}")
        return 1 if missing else 0

    new_ids = next_ids({row["id"] for row in ledger_rows}, len(missing))
    for source_id, (entry_id, entry) in zip(new_ids, sorted(missing.items())):
        owner = entry["repo"].split("/")[0]
        anchor = entry.get("anchor") or {}
        year = (anchor.get("date") or entry.get("lastPushedAt") or ACCESS_DATE)[:4]
        row = {
            "id": source_id,
            "title": flatten(entry["title"], 90),
            "creator": owner,
            "source_type": "primary repository",
            "platform": "github.com",
            "language": "en",
            "year": year,
            "url": entry["repoUrl"],
            "access_date": ACCESS_DATE,
            "evidence_tier": "primary",
            "publisher_group": owner.lower(),
            "source_family_id": f"{slug(entry['repo'])}-repo",
            "channel_ids": REPO_CHANNELS,
            "relevance": flatten(entry["role"], 60),
            "credibility": "high",
            "used_for": flatten(entry["whatItProves"], 160),
            "limitations": flatten(entry["whatItDoesNotProve"], 160),
        }
        ledger_rows.append(row)
        by_url[entry["repoUrl"].rstrip("/")] = row

    with LEDGER.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=LEDGER_COLUMNS)
        writer.writeheader()
        writer.writerows({key: row.get(key, "") for key in LEDGER_COLUMNS} for row in ledger_rows)

    # GitHub 工件台账整体重建：它是研究台账中仓库行的投影，不单独维护。
    repo_rows = [row for row in ledger_rows if "repository" in row["source_type"].lower()]
    artifacts = []
    for index, row in enumerate(sorted(repo_rows, key=lambda item: item["id"]), start=1):
        # 台账里 repoUrl 可能为 None（非仓库类条目），不能直接 .rstrip
        entry = next(
            (item for item in library.values()
             if (item.get("repoUrl") or "").rstrip("/") == row["url"].rstrip("/")),
            None,
        )
        anchor = (entry or {}).get("anchor") or {}
        repo_path = row["url"].split("github.com/")[-1].strip("/")
        artifacts.append({
            "artifact_id": f"GH{index:02d}",
            "source_id": row["id"],
            "repo_url": row["url"],
            "commit_or_tag": anchor.get("value") or "HEAD",
            "license": (entry or {}).get("license") or "NOASSERTION",
            "last_commit_at": (entry or {}).get("lastPushedAt") or "",
            "release_or_commit_url": anchor.get("url") or row["url"],
            "issues_url": f"https://github.com/{repo_path}/issues",
            "ci_url": f"https://github.com/{repo_path}/actions",
            # 只作为资料引用，不作为学员运行时，因此不声明安装与冒烟命令的执行结果。
            "setup_command": "see upstream README",
            "smoke_command": "see upstream README",
            "run_status": "metadata-only",
            "run_at": "not-run",
            "exit_code": "not-run",
            "evidence_path": "not-run",
            "selected_for_lab": "false",
            "limitations": flatten(
                (entry or {}).get("whatItDoesNotProve")
                or "Referenced as documentation only; not executed in this package.",
                180,
            ),
        })

    with ARTIFACTS.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=ARTIFACT_COLUMNS)
        writer.writeheader()
        writer.writerows(artifacts)

    # 刻意**不**改 research/channel-coverage.json。
    #
    # 初版这里把新来源 id 也写进了 ai-primary 与 github-artifact 两个渠道，结果被工厂校验器
    # 拦下：「channel ai-primary uses unselected or unopened sources」。这次拦截是对的——
    # 渠道记录的是「某一轮检索用哪些检索式、扫到了哪些来源」，而这 67 个仓库不是那一轮
    # 检索扫出来的，是写正文时按主题逐个选进来的。把它们塞进渠道，等于伪造检索来源。
    #
    # 台账行上的 channel_ids 只声明这类来源属于哪种证据面（必填字段），不代表它被那次检索命中。
    # 两者的区别在这个包里是有意义的，因此保持分离。

    print(f"\n研究台账：{len(ledger_rows)} 条（新增 {len(missing)}），其中仓库类 {len(repo_rows)} 条")
    print(f"GitHub 工件台账：{len(artifacts)} 条，全部 metadata-only / selected_for_lab=false")
    print("未改 channel-coverage.json：渠道记录的是检索命中，这批来源来自逐题选取而非那轮检索")
    return 0


if __name__ == "__main__":
    sys.exit(main())
