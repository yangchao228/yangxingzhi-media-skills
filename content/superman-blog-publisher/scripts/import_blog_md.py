#!/usr/bin/env python3
import argparse
import json
import math
import re
from datetime import date, datetime
from pathlib import Path


MONTHS = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Import a Markdown blog post into the superman content layer.")
    parser.add_argument("--source", required=True, help="Source Markdown file.")
    parser.add_argument("--locale", required=True, choices=["zh", "en"])
    parser.add_argument("--slug", required=True, help="Shared slug for both zh and en versions.")
    parser.add_argument("--title", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--category", required=True)
    parser.add_argument("--tags", required=True, help="Comma-separated tags.")
    parser.add_argument("--published-at", default=date.today().isoformat())
    parser.add_argument("--status", default="published")
    parser.add_argument("--display-date")
    parser.add_argument("--reading-time")
    parser.add_argument("--cover-image")
    parser.add_argument("--order", type=int)
    parser.add_argument("--output-root", default="frontend/content/blog")
    parser.add_argument("--force", action="store_true", help="Overwrite existing output file.")
    args = parser.parse_args()

    slug = normalize_slug(args.slug)
    if not slug:
        raise SystemExit("slug must contain at least one ASCII letter or number")

    source_path = Path(args.source)
    body = normalize_body(strip_frontmatter(source_path.read_text(encoding="utf-8")))
    published_at = parse_date(args.published_at)
    tags = [tag.strip() for tag in args.tags.split(",") if tag.strip()]

    if not tags:
        raise SystemExit("tags must contain at least one value")

    frontmatter = {
        "id": f"blog-{slug}-{args.locale}",
        "type": "blog",
        "locale": args.locale,
        "title": args.title,
        "slug": slug,
        "summary": args.summary,
        "category": args.category,
        "tags": tags,
        "status": args.status,
        "publishedAt": published_at.isoformat(),
        "displayDate": args.display_date or format_display_date(published_at, args.locale),
        "readingTime": args.reading_time or estimate_reading_time(body, args.locale),
    }

    if args.cover_image:
        frontmatter["coverImage"] = args.cover_image

    if args.order is not None:
        frontmatter["order"] = args.order

    output_path = Path(args.output_root) / args.locale / f"{slug}.md"
    if output_path.exists() and not args.force:
        raise SystemExit(f"{output_path} already exists; pass --force to overwrite")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(render_markdown(frontmatter, body), encoding="utf-8")
    print(output_path)


def strip_frontmatter(markdown: str) -> str:
    if markdown.startswith("---"):
        match = re.match(r"^---\s*\n[\s\S]*?\n---\s*\n?", markdown)
        if match:
            return markdown[match.end():]

    return markdown


def normalize_body(markdown: str) -> str:
    lines = markdown.strip().splitlines()

    while lines and not lines[0].strip():
        lines.pop(0)

    if lines and lines[0].lstrip().startswith("# "):
        lines.pop(0)

    while lines and not lines[0].strip():
        lines.pop(0)

    if lines and re.fullmatch(r"-{3,}", lines[0].strip()):
        lines.pop(0)

    while lines and not lines[0].strip():
        lines.pop(0)

    return "\n".join(lines).strip() + "\n"


def normalize_slug(value: str) -> str:
    slug = value.strip().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def parse_date(value: str) -> date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def format_display_date(value: date, locale: str) -> str:
    if locale == "zh":
        return f"{value.year}年{value.month}月{value.day}日"

    return f"{MONTHS[value.month]} {value.day}, {value.year}"


def estimate_reading_time(body: str, locale: str) -> str:
    plain_text = re.sub(r"`{1,3}[^`]*`{1,3}", " ", body)
    plain_text = re.sub(r"[#>*_\-\[\]()]|https?://\S+", " ", plain_text)

    if locale == "zh":
        cjk_chars = re.findall(r"[\u4e00-\u9fff]", plain_text)
        minutes = max(1, math.ceil(len(cjk_chars) / 500))
        return f"{minutes} 分钟阅读"

    words = re.findall(r"[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?", plain_text)
    minutes = max(1, math.ceil(len(words) / 220))
    return f"{minutes} min read"


def render_markdown(frontmatter: dict, body: str) -> str:
    lines = ["---"]
    for key, value in frontmatter.items():
        if isinstance(value, list):
            rendered_value = json.dumps(value, ensure_ascii=False)
        elif isinstance(value, int):
            rendered_value = str(value)
        else:
            rendered_value = json.dumps(str(value), ensure_ascii=False)

        lines.append(f"{key}: {rendered_value}")

    lines.append("---")
    lines.append("")
    lines.append(body.strip())
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
