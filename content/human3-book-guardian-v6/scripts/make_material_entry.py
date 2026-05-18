from __future__ import annotations
import argparse
from datetime import date


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate one Markdown entry for Human3.0 成书素材库")
    parser.add_argument("--title", required=True)
    parser.add_argument("--book-title", required=True)
    parser.add_argument("--result", choices=["通过", "条件通过", "不通过"], required=True)
    parser.add_argument("--decision", choices=["可纳入书稿素材库", "轻改后纳入书稿素材库", "当前版本不纳入书稿素材库"], required=True)
    parser.add_argument("--track", required=True, help="归属主线")
    parser.add_argument("--chapter", required=True, help="建议章节")
    parser.add_argument("--note", required=True, help="偏离备注")
    parser.add_argument("--fix", required=True, help="最小纠偏")
    parser.add_argument("--tags", required=True, help="状态标签，例如 #条件通过 #待轻改 #结构杠杆")
    parser.add_argument("--date", default=str(date.today()))
    args = parser.parse_args()

    print(f"## {args.date}｜{args.title}")
    print(f"> 书稿备注标题：{args.book_title}\n")
    print(f"- 审查结论：{args.result}")
    print(f"- 入书判断：{args.decision}")
    print(f"- 归属主线：{args.track}")
    print(f"- 建议章节：{args.chapter}")
    print(f"- 偏离备注：{args.note}")
    print(f"- 最小纠偏：{args.fix}")
    print(f"- 状态标签：{args.tags}")
