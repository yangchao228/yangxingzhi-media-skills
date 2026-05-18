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


def extract_archive_block(text: str) -> dict[str, str]:
    match = re.search(r"```human3_archive\n(.*?)```", text, re.S)
    if not match:
        raise ValueError("No ```human3_archive block found in review file.")

    block = match.group(1).strip()
    data: dict[str, str] = {}
    for line in block.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip()
    return data


def extract_title_date(text: str) -> str | None:
    match = re.search(r"^##\s+(\d{4}-\d{2}-\d{2})｜.+$", text, re.M)
    if not match:
        return None
    return match.group(1)


def build_entry(data: dict[str, str], entry_date: str) -> str:
    title = data.get("title", "未命名文章")
    book_title = data.get("book_title", "待补书稿备注标题")
    result = data.get("result", "条件通过")
    decision = data.get("decision", "轻改后纳入书稿素材库")
    track = data.get("track", "待判断")
    chapter = data.get("chapter", "当前不建议进入书稿结构")
    note = data.get("note", "待补偏离备注")
    fix = data.get("fix", "待补最小纠偏")
    tags = data.get("tags", "#条件通过 #待轻改")

    return (
        f"## {entry_date}｜{title}\n"
        f"> 书稿备注标题：{book_title}\n\n"
        f"- 审查结论：{result}\n"
        f"- 入书判断：{decision}\n"
        f"- 归属主线：{track}\n"
        f"- 建议章节：{chapter}\n"
        f"- 偏离备注：{note}\n"
        f"- 最小纠偏：{fix}\n"
        f"- 状态标签：{tags}\n"
    )


def normalize_bucket(raw: str, result: str, chapter: str) -> str:
    raw = raw.strip()
    if raw in SECTION_MAP:
        return raw
    if result == "不通过" or "当前不建议进入书稿结构" in chapter:
        return "未归档"
    match = re.search(r"Part\s*([1-6])", raw or chapter)
    if match:
        return f"Part {match.group(1)}"
    return "未归档"


def insert_under_section(text: str, section_header: str, entry: str) -> str:
    match = re.search(re.escape(section_header), text)
    if not match:
        raise ValueError(f"Section header not found: {section_header}")

    start = match.end()
    next_header = re.search(r"\n## ", text[start:])
    insert_at = start + next_header.start() if next_header else len(text)

    new_chunk = "\n\n" + entry.strip() + "\n"
    return text[:insert_at] + new_chunk + text[insert_at:]


def main() -> None:
    parser = argparse.ArgumentParser(description="Archive reviewed article from a review markdown file")
    parser.add_argument("--review", required=True, help="Path to model review output markdown")
    parser.add_argument("--materials", required=True, help="Path to Human3.0-book-materials.md")
    parser.add_argument("--date", default=None, help="Override entry date YYYY-MM-DD")
    args = parser.parse_args()

    review_path = Path(args.review)
    materials_path = Path(args.materials)
    if not review_path.exists():
        raise FileNotFoundError(f"Review file not found: {review_path}")
    if not materials_path.exists():
        raise FileNotFoundError(f"Materials file not found: {materials_path}")

    review_text = review_path.read_text(encoding="utf-8")
    data = extract_archive_block(review_text)
    entry_date = args.date or extract_title_date(review_text) or str(date.today())
    bucket = normalize_bucket(
        data.get("archive_bucket", ""),
        data.get("result", "条件通过"),
        data.get("chapter", "当前不建议进入书稿结构"),
    )
    entry = build_entry(data, entry_date)

    materials_text = materials_path.read_text(encoding="utf-8")
    updated = insert_under_section(materials_text, SECTION_MAP[bucket], entry)
    materials_path.write_text(updated, encoding="utf-8")

    print(f"Archived to: {materials_path}")
    print(f"Bucket: {bucket}")
    print("Entry:")
    print(entry)


if __name__ == "__main__":
    main()
