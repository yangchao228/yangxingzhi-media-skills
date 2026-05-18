from __future__ import annotations

import argparse
import re
from datetime import date
from pathlib import Path


SECTION_MAP = {
    "Part 1": "## Part 1｜旧人类的失效",
    "Part 2": "## Part 2｜认知主权",
    "Part 3": "## Part 3｜结构杠杆",
    "Part 4": "## Part 4｜从消费者到生产者",
    "Part 5": "## Part 5｜个人数字生产资料",
    "Part 6": "## Part 6｜Human3.0 的生活实践",
    "未归档": "## 未归档 / 当前不纳入",
}


def build_entry(args: argparse.Namespace) -> str:
    return (
        f"## {args.date}｜{args.title}\n"
        f"> 书稿备注标题：{args.book_title}\n\n"
        f"- 审查结论：{args.result}\n"
        f"- 入书判断：{args.decision}\n"
        f"- 归属主线：{args.track}\n"
        f"- 建议章节：{args.chapter}\n"
        f"- 偏离备注：{args.note}\n"
        f"- 最小纠偏：{args.fix}\n"
        f"- 状态标签：{args.tags}\n"
    )


def resolve_bucket(result: str, chapter: str) -> str:
    if result == "不通过" or "当前不建议进入书稿结构" in chapter:
        return "未归档"
    m = re.search(r"Part\s*([1-6])", chapter)
    if m:
        return f"Part {m.group(1)}"
    return "未归档"


def insert_under_section(text: str, section_header: str, entry: str) -> str:
    pattern = re.escape(section_header)
    match = re.search(pattern, text)
    if not match:
        raise ValueError(f"Section header not found: {section_header}")

    start = match.end()
    next_header = re.search(r"\n## ", text[start:])
    if next_header:
        insert_at = start + next_header.start()
    else:
        insert_at = len(text)

    section_body = text[start:insert_at].strip("\n")
    prefix = "\n\n" if section_body else "\n\n"
    new_chunk = prefix + entry.strip() + "\n"
    return text[:insert_at] + new_chunk + text[insert_at:]


def main() -> None:
    parser = argparse.ArgumentParser(description="Archive one reviewed article into Human3.0 materials file")
    parser.add_argument("--materials", required=True, help="Path to Human3.0-book-materials.md")
    parser.add_argument("--title", required=True)
    parser.add_argument("--book-title", required=True)
    parser.add_argument("--result", choices=["通过", "条件通过", "不通过"], required=True)
    parser.add_argument(
        "--decision",
        choices=["可纳入书稿素材库", "轻改后纳入书稿素材库", "当前版本不纳入书稿素材库"],
        required=True,
    )
    parser.add_argument("--track", required=True)
    parser.add_argument("--chapter", required=True)
    parser.add_argument("--note", required=True)
    parser.add_argument("--fix", required=True)
    parser.add_argument("--tags", required=True)
    parser.add_argument("--date", default=str(date.today()))
    args = parser.parse_args()

    materials_path = Path(args.materials)
    if not materials_path.exists():
        raise FileNotFoundError(f"Materials file not found: {materials_path}")

    bucket = resolve_bucket(args.result, args.chapter)
    section_header = SECTION_MAP[bucket]
    entry = build_entry(args)

    text = materials_path.read_text(encoding="utf-8")
    updated = insert_under_section(text, section_header, entry)
    materials_path.write_text(updated, encoding="utf-8")

    print(f"Archived to: {materials_path}")
    print(f"Bucket: {bucket}")
    print("Entry:")
    print(entry)


if __name__ == "__main__":
    main()
