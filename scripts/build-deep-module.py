#!/usr/bin/env python3
"""把 methodology/dimensions/_sources/<module>.json 渲染成站点深度层 TypeScript 模块。

用法：
    python3 scripts/build-deep-module.py <source.json> <output.ts> <exportName> <headerComment>

单一事实来源是 JSON；本脚本与 build-dimension-docs.mjs 分别把它投影成
站点模块与 Markdown 文档。修改内容请改 JSON，不要改任何一个投影。

投影方式：JSON 直接作为 TypeScript 对象字面量输出，由 `Record<string, DeepPageContent>`
的上下文类型约束元组字段（intro 的二元组、takeaway.bullets 的三元组等）。
早期版本逐字段手写拼接，每加一段结构就要改一次拼接逻辑且容易漏引号；
直接投影把「JSON 结构是否合法」这件事交还给 TypeScript 编译器。
"""
from __future__ import annotations

import json
import pathlib
import sys

REQUIRED_SECTIONS = ("terms", "method", "counter", "diagnosis", "drill", "takeaway")
# 补充层只写四段，其余由页面自身的手写块承担。
SUPPLEMENT_SECTIONS = ("failure", "archref", "metrics", "gate")


def validate(src: dict[str, dict], supplement: bool) -> list[str]:
    """在投影前拦住结构性错误，让报错指向 JSON 而不是生成出来的 TypeScript。"""
    problems: list[str] = []
    required = SUPPLEMENT_SECTIONS if supplement else REQUIRED_SECTIONS
    for page_id, page in src.items():
        for section in required:
            if section not in page:
                problems.append(f"{page_id}: 缺少必需段 {section}")
        for section in ("failure", "toolchain", "archref", "metrics", "method", "counter", "diagnosis", "evolution"):
            table = page.get(section, {}).get("table")
            if table is None:
                continue
            width = len(table["headers"])
            for index, row in enumerate(table["rows"]):
                if len(row) != width:
                    problems.append(
                        f"{page_id}.{section}: 第 {index + 1} 行有 {len(row)} 列，表头是 {width} 列"
                    )
    return problems


def main() -> int:
    args = [a for a in sys.argv[1:] if a != "--supplement"]
    supplement = "--supplement" in sys.argv
    src_path, out_path, export_name, header = args[0], args[1], args[2], args[3]
    src = json.loads(pathlib.Path(src_path).read_text(encoding="utf-8"))

    problems = validate(src, supplement)
    if problems:
        for problem in problems:
            print(f"  ✗ {problem}", file=sys.stderr)
        print(f"{src_path}: {len(problems)} 处结构问题，未生成", file=sys.stderr)
        return 1

    body = json.dumps(src, ensure_ascii=False, indent=2)
    out = "\n".join([
        ('import { EMPTY_DEEP_BLOCKS, renderSupplement, type DeepBlocks, type DeepSupplement } from "./deep-layer.ts";'
         if supplement else
         'import { EMPTY_DEEP_BLOCKS, renderDeepBlocks, type DeepBlocks, type DeepPageContent } from "./deep-layer.ts";'),
        "",
        header,
        "",
        f"const content: Record<string, {'DeepSupplement' if supplement else 'DeepPageContent'}> = {body};",
        "",
        f"export const {export_name} = (pageId: string): DeepBlocks => {{",
        "  const page = content[pageId];",
        f"  return page ? {'renderSupplement' if supplement else 'renderDeepBlocks'}(page) : EMPTY_DEEP_BLOCKS;",
        "};",
        "",
    ])
    pathlib.Path(out_path).write_text(out, encoding="utf-8")
    print(f"{out_path.split('/')[-1]:44} {len(src):3} 页  {len(out) // 1024:4} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
