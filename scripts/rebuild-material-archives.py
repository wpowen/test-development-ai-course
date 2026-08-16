#!/usr/bin/env python3
"""从 site/public/materials/<bundle>/ 重建对应的 <bundle>.zip。

用法：
    python3 scripts/rebuild-material-archives.py                 # 只重建内容已漂移的
    python3 scripts/rebuild-material-archives.py advanced-quality  # 指定 bundle
    python3 scripts/rebuild-material-archives.py --all           # 全部重建

## 为什么需要它

同一份物料在 learner-materials/、lab/、site/public/materials/ 与 ZIP 里各有一份，
`site/scripts/validate-material-archives.py` 会逐字节校验这四跳。改了源文件而不重建
ZIP，闭包门禁会拦下发布——这是设计意图，但此前没有对应的重建入口，只能手工打包。

## 与门禁的对齐

成员名沿用归档中已有的写法（带 bundle 前缀或不带），因为校验器两种都接受，
但同一个包内必须一致；重建时保持原样可以避免无谓的全量 diff。

写入使用固定时间戳与 deflate，使同样的输入产出同样的字节，重建不会制造伪变更。
"""
from __future__ import annotations

import pathlib
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
MATERIALS = ROOT / "site" / "public" / "materials"

# 固定时间戳：ZIP 会把 mtime 写进条目头，用真实时间会让每次重建都产生不同字节。
FIXED_TIME = (2026, 1, 1, 0, 0, 0)


def bundle_files(folder: pathlib.Path) -> dict[str, bytes]:
    return {
        path.relative_to(folder).as_posix(): path.read_bytes()
        for path in sorted(folder.rglob("*"))
        if path.is_file() and "__pycache__" not in path.parts and path.suffix != ".pyc"
    }


def uses_root_prefix(archive: pathlib.Path, name: str) -> bool:
    """沿用归档已有的成员命名方式，避免重建时产生无谓的全量差异。"""
    if not archive.exists():
        return True
    with zipfile.ZipFile(archive) as zipped:
        members = [item.filename for item in zipped.infolist() if not item.is_dir()]
    return any(member.startswith(f"{name}/") for member in members)


def is_stale(archive: pathlib.Path, name: str, expected: dict[str, bytes]) -> bool:
    if not archive.exists():
        return True
    prefix = f"{name}/" if uses_root_prefix(archive, name) else ""
    with zipfile.ZipFile(archive) as zipped:
        actual = {item.filename for item in zipped.infolist() if not item.is_dir()}
        if actual != {f"{prefix}{rel}" for rel in expected}:
            return True
        return any(zipped.read(f"{prefix}{rel}") != content for rel, content in expected.items())


def rebuild(name: str) -> None:
    folder = MATERIALS / name
    archive = MATERIALS / f"{name}.zip"
    expected = bundle_files(folder)
    prefix = f"{name}/" if uses_root_prefix(archive, name) else ""
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as zipped:
        for relative, content in expected.items():
            info = zipfile.ZipInfo(f"{prefix}{relative}", date_time=FIXED_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            zipped.writestr(info, content)


def main() -> int:
    args = [a for a in sys.argv[1:] if a != "--all"]
    force_all = "--all" in sys.argv

    names = args or sorted(
        path.stem for path in MATERIALS.glob("*.zip")
        if path.is_file() and (MATERIALS / path.stem).is_dir()
    )
    missing = [n for n in names if not (MATERIALS / n).is_dir()]
    if missing:
        print(f"没有对应的物料目录：{', '.join(missing)}", file=sys.stderr)
        return 2

    rebuilt = []
    for name in names:
        expected = bundle_files(MATERIALS / name)
        if force_all or args or is_stale(MATERIALS / f"{name}.zip", name, expected):
            rebuild(name)
            rebuilt.append(f"{name} ({len(expected)} 个成员)")

    if not rebuilt:
        print(f"{len(names)} 个归档均与物料目录一致，无需重建。")
        return 0
    print("已重建：")
    for line in rebuilt:
        print(f"  {line}")
    print("\n接着跑 `cd site && npm run validate:materials` 确认四跳闭包。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
