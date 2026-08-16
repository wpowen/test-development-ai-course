#!/usr/bin/env python3
"""把公开物料里的提示词正文投影成站点可引用的查表模块。

用法：
    python3 scripts/build-prompt-bodies.py

## 它解决什么

页面上的「版本化 Prompt」块标着可复制，内容却是一句 71–120 字节的硬编码残句，
而它 `promptPath` 指向的文件已经是 4–6KB 的完整提示词。学习者点复制拿到的
不是那份提示词，是一句概括。

根因是同一份内容被写了两遍：一遍在物料文件里，一遍在页面模块的字符串里。
两者没有任何机制保持一致，于是第二遍在提示词重构后立刻过期。

这个脚本消除第二遍：页面改为按 `promptPath` 查表，表由物料文件生成。
改提示词只需重跑生成器，页面自动跟上。

## 键的形式

键与页面 `promptPath` 字段完全一致，即相对 `site/public/` 的路径，
例如 `materials/agent-load-stability/prompts/TD-AP01/prompt-v1.md`。
这样调用处可以直接复用已有的路径表达式，不需要再引入第二套标识。
"""
from __future__ import annotations

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "site" / "public"
MATERIALS = PUBLIC / "materials"
OUT = ROOT / "site" / "content" / "prompt-bodies.ts"

PROMPT_NAMES = (
    "prompt-v1.md", "system-v1.md", "task-v1.md", "critic-v1.md",
    "system.md", "task.md", "critic.md",
)


def main() -> int:
    bodies: dict[str, str] = {}
    for path in sorted(MATERIALS.rglob("*.md")):
        if path.name in PROMPT_NAMES or path.name.endswith(".prompt.md"):
            key = path.relative_to(PUBLIC).as_posix()
            bodies[key] = path.read_text(encoding="utf-8")

    payload = json.dumps(bodies, ensure_ascii=False, indent=2)
    total = sum(len(v) for v in bodies.values())
    OUT.write_text("\n".join([
        "/**",
        " * 提示词正文查表（生成产物，请勿直接编辑）。",
        " *",
        f" * 由 scripts/build-prompt-bodies.py 从 site/public/materials 收集，共 {len(bodies)} 份。",
        " * 页面上的 Prompt 块按 promptPath 查这张表，因此「页面上显示并可复制的内容」",
        " * 与「物料文件里的内容」永远是同一份——此前它们是各写一遍、改完就不同步。",
        " *",
        " * 改提示词请改对应生成器的设计数据，然后重跑：",
        " *   python3 scripts/build-prompt-packages.py",
        " *   python3 scripts/build-page-prompt-packages.py",
        " *   python3 scripts/build-prompt-bodies.py",
        " */",
        "",
        f"const bodies: Record<string, string> = {payload};",
        "",
        "/**",
        " * 按 promptPath 取提示词正文。",
        " *",
        " * 取不到时返回回退文本而不是空串：页面宁可显示「这里应该有一份提示词但没找到」，",
        " * 也不要显示一个可复制的空块——后者会让人以为复制成功了。",
        " */",
        "export const promptBody = (promptPath: string): string =>",
        "  bodies[promptPath] ?? `（未找到提示词正文：${promptPath}。请重跑 scripts/build-prompt-bodies.py）`;",
        "",
        "export const promptBodyCount = " + str(len(bodies)) + ";",
        "",
    ]), encoding="utf-8")
    print(f"提示词正文表已生成：{len(bodies)} 份，合计 {total // 1024} KB → {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
