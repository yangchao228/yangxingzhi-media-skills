#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
BOOK_ROOT = ROOT / "human3.0_book"
MATERIALS = BOOK_ROOT / "materials.md"
ENTRIES = BOOK_ROOT / "entries"

PART_HEADINGS = [
    "## Part 1｜旧人类的失效",
    "## Part 2｜认知主权",
    "## Part 3｜结构杠杆",
    "## Part 4｜从消费者到生产者",
    "## Part 5｜个人数字生产资料",
    "## Part 6｜Human3.0 的生活实践",
    "## 未归档 / 当前不纳入",
]


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def require(errors: list[str], condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


def validate_entry(path: pathlib.Path) -> list[str]:
    errors: list[str] = []
    text = read(path)
    required_markers = [
        "# ",
        "## 归档信息",
        "## 成书判断",
        "## 最小纠偏",
        "## 发布包",
        "## 正文快照",
        "审查结论：",
        "入书判断：",
        "归属主线：",
        "建议章节：",
        "状态标签：",
    ]
    for marker in required_markers:
        require(errors, marker in text, f"{path.relative_to(ROOT)}: missing {marker}")

    require(
        errors,
        re.search(r"状态标签：.*#(通过|条件通过|不通过)", text) is not None,
        f"{path.relative_to(ROOT)}: status tags missing review result tag",
    )
    require(
        errors,
        re.search(r"状态标签：.*#(可入书|待轻改|待重写)", text) is not None,
        f"{path.relative_to(ROOT)}: status tags missing action tag",
    )
    return errors


def main() -> int:
    errors: list[str] = []

    require(errors, BOOK_ROOT.is_dir(), "human3.0_book directory missing")
    require(errors, (BOOK_ROOT / "README.md").is_file(), "human3.0_book/README.md missing")
    require(errors, MATERIALS.is_file(), "human3.0_book/materials.md missing")
    require(errors, ENTRIES.is_dir(), "human3.0_book/entries directory missing")

    if errors:
        for error in errors:
            print(f"[human3-book][FAIL] {error}", file=sys.stderr)
        return 1

    materials = read(MATERIALS)
    for heading in PART_HEADINGS:
        require(errors, heading in materials, f"materials.md missing heading: {heading}")

    linked_entries = re.findall(r"`(entries/[^`]+\.md)`", materials)
    require(errors, bool(linked_entries), "materials.md has no linked entries")

    entry_files = sorted(ENTRIES.glob("*.md"))
    require(errors, bool(entry_files), "human3.0_book/entries has no entry files")

    linked_set = {BOOK_ROOT / link for link in linked_entries}
    for link_path in sorted(linked_set):
        require(errors, link_path.is_file(), f"materials.md links missing entry: {link_path.relative_to(ROOT)}")

    for entry in entry_files:
        require(errors, entry in linked_set, f"{entry.relative_to(ROOT)} is not linked from materials.md")
        errors.extend(validate_entry(entry))

    if errors:
        for error in errors:
            print(f"[human3-book][FAIL] {error}", file=sys.stderr)
        return 1

    print(f"[human3-book] validated {len(entry_files)} entrie(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
