from __future__ import annotations

import argparse
from pathlib import Path


def build_request(mode: str) -> str:
    if mode == "quick":
        return (
            "请使用 Human3.0 成书守门员，快速检查下面这篇文章有没有偏离主线。\n"
            "我只提供原文，标题和主线归属由你自动判断。"
        )
    return (
        "请使用 Human3.0 成书守门员，按成书审查模式检查下面这篇文章。\n"
        "我只提供原文，其他信息请你自动判断并生成，包括：\n"
        "1. 原始标题\n"
        "2. 书稿备注标题\n"
        "3. 是否通过\n"
        "4. 归属主线\n"
        "5. 入书判断\n"
        "6. 最小纠偏建议\n"
        "7. 建议归入哪一章\n"
        "8. 建议存档条目\n"
        "9. 建议归档位置\n"
        "10. 机器可解析块"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a review prompt for Human3.0 成书守门员")
    parser.add_argument("--draft", required=True, help="Path to the markdown draft")
    parser.add_argument("--mode", choices=["quick", "book"], default="book", help="Review mode")
    args = parser.parse_args()

    draft = Path(args.draft).read_text(encoding="utf-8")
    request = build_request(args.mode)
    print(f"{request}\n\n---文章开始---\n{draft}\n---文章结束---")


if __name__ == "__main__":
    main()
