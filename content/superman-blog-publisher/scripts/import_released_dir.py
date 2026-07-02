#!/usr/bin/env python3
"""Plan or import a released WeChat Markdown directory into the blog content layer."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path
from typing import Any


DEFAULT_SOURCE_ROOT = "/Users/yangchao/my_knowledge_space/微信公众号/released"
DEFAULT_OUTPUT_ROOT = "frontend/content/blog"
DEFAULT_REPORT = "frontend/content/blog/import-released-report.json"
DEFAULT_R2_SCRIPT = "/Users/yangchao/.codex/skills/md-img-r2/run.sh"
DEFAULT_R2_PREFIX = "superman/blog/released"
DEFAULT_STAGING_DIR = "/private/tmp/superman-released-blog-import"
DEFAULT_EXCLUDED_DIRS = {
    ".git",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    "node_modules",
    "site-packages",
    "dist",
    "build",
}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Scan, deduplicate, optionally upload images, and import released Markdown posts."
    )
    parser.add_argument("--source-root", default=DEFAULT_SOURCE_ROOT)
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--output-root", default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--report", default=DEFAULT_REPORT)
    parser.add_argument("--manifest", help="Optional JSON metadata overrides reviewed by Codex.")
    parser.add_argument(
        "--allow-auto-metadata",
        action="store_true",
        help="Allow --apply without a reviewed manifest. Not recommended for public imports.",
    )
    parser.add_argument("--locale", default="zh", choices=["zh", "en"])
    parser.add_argument("--published-at", default=date.today().isoformat())
    parser.add_argument("--status", default="published")
    parser.add_argument("--apply", action="store_true", help="Write blog files. Without this, only plan.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing target files.")
    parser.add_argument("--include-existing-report", action="store_true", default=True)
    parser.add_argument("--ignore-existing-report", action="store_true")
    parser.add_argument("--upload-images", action="store_true", help="Run md-img-r2 on staged Markdown before import.")
    parser.add_argument("--r2-script", default=DEFAULT_R2_SCRIPT)
    parser.add_argument("--key-prefix", default=DEFAULT_R2_PREFIX)
    parser.add_argument("--staging-dir", default=DEFAULT_STAGING_DIR)
    parser.add_argument(
        "--allow-image-upload-failures",
        action="store_true",
        help="Continue even if md-img-r2 reports upload_failed entries.",
    )
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    source_root = Path(args.source_root).expanduser().resolve()
    output_root = resolve_repo_path(repo_root, args.output_root)
    report_path = resolve_repo_path(repo_root, args.report)
    import_script = Path(__file__).with_name("import_blog_md.py")

    if not source_root.exists():
        raise SystemExit(f"source root does not exist: {source_root}")

    manifest = load_manifest(args.manifest)
    if args.apply and not manifest and not args.allow_auto_metadata:
        raise SystemExit("--apply requires a reviewed --manifest unless --allow-auto-metadata is set")

    previous_hashes = set()
    if args.include_existing_report and not args.ignore_existing_report:
        previous_hashes = load_previous_hashes(report_path)

    existing_slugs = collect_existing_slugs(output_root / args.locale)
    scan = scan_markdown_files(source_root)
    candidates: list[dict[str, Any]] = []
    skipped: list[dict[str, Any]] = []
    seen_hashes: dict[str, Path] = {}

    for item in scan:
        path = item["path"]
        digest = item["hash"]
        rel = item["relativePath"]

        if not item["body"].strip():
            skipped.append({"path": str(path), "relativePath": rel, "reason": "empty", "hash": digest})
            continue

        if digest in seen_hashes:
            skipped.append(
                {
                    "path": str(path),
                    "relativePath": rel,
                    "reason": "duplicate",
                    "duplicateOf": str(seen_hashes[digest]),
                    "hash": digest,
                }
            )
            continue

        if digest in previous_hashes:
            skipped.append({"path": str(path), "relativePath": rel, "reason": "already_imported", "hash": digest})
            seen_hashes[digest] = path
            continue

        seen_hashes[digest] = path
        metadata = build_metadata(item, manifest, existing_slugs, args)
        existing_slugs.add(metadata["slug"])
        candidates.append({**metadata, "source": str(path), "relativePath": rel, "hash": digest})

    created: list[dict[str, Any]] = []
    image_upload_failures: list[dict[str, Any]] = []
    staged_root: Path | None = None

    if args.apply:
        if args.upload_images:
            staged_root = stage_source_tree(source_root, Path(args.staging_dir))

        for candidate in candidates:
            source_path = Path(candidate["source"])
            import_source = source_path
            if staged_root is not None:
                import_source = staged_root / candidate["relativePath"]
                upload_result = upload_images(import_source, args.r2_script, args.key_prefix)
                if upload_result.get("upload_failed"):
                    image_upload_failures.append(
                        {
                            "source": str(source_path),
                            "staged": str(import_source),
                            "upload_failed": upload_result["upload_failed"],
                        }
                    )
                    if not args.allow_image_upload_failures:
                        continue

            target = import_one(import_script, import_source, output_root, candidate, args)
            created.append(
                {
                    "source": str(source_path),
                    "target": relativize(target, repo_root),
                    "slug": candidate["slug"],
                    "title": candidate["title"],
                    "hash": candidate["hash"],
                }
            )

    report = {
        "sourceRoot": str(source_root),
        "mode": "apply" if args.apply else "plan",
        "createdCount": len(created),
        "candidateCount": len(candidates),
        "skippedCount": len(skipped),
        "imageUploadFailureCount": len(image_upload_failures),
        "created": created,
        "candidates": candidates if not args.apply else [],
        "skipped": skipped,
        "imageUploadFailures": image_upload_failures,
    }

    if args.apply:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(report_path)
    else:
        print(json.dumps(report, ensure_ascii=False, indent=2))


def resolve_repo_path(repo_root: Path, value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else repo_root / path


def load_manifest(path_value: str | None) -> dict[str, dict[str, Any]]:
    if not path_value:
        return {}

    path = Path(path_value).expanduser().resolve()
    raw = json.loads(path.read_text(encoding="utf-8"))
    items = raw.get("items", raw) if isinstance(raw, dict) else raw
    if not isinstance(items, list):
        raise SystemExit("manifest must be a list or an object with an items list")

    index: dict[str, dict[str, Any]] = {}
    for item in items:
        if not isinstance(item, dict):
            continue
        keys = [
            item.get("source"),
            item.get("path"),
            item.get("relativePath"),
            item.get("file"),
        ]
        for key in keys:
            if key:
                index[str(key)] = item

    return index


def load_previous_hashes(report_path: Path) -> set[str]:
    if not report_path.exists():
        return set()

    try:
        report = json.loads(report_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return set()

    hashes: set[str] = set()
    for section in ("created", "skipped"):
        for item in report.get(section, []):
            digest = item.get("hash")
            if digest:
                hashes.add(str(digest))

    return hashes


def collect_existing_slugs(locale_dir: Path) -> set[str]:
    if not locale_dir.exists():
        return set()

    return {path.stem for path in locale_dir.glob("*.md") if path.is_file()}


def scan_markdown_files(source_root: Path) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for path in sorted(source_root.rglob("*.md")):
        if not path.is_file():
            continue
        if should_skip_path(path, source_root):
            continue

        raw = path.read_text(encoding="utf-8", errors="replace")
        body = normalize_body(strip_frontmatter(raw), remove_h1=False)
        digest = hashlib.sha256(normalize_for_hash(body).encode("utf-8")).hexdigest()
        rel = path.relative_to(source_root).as_posix()
        items.append({"path": path, "relativePath": rel, "raw": raw, "body": body, "hash": digest})

    return items


def should_skip_path(path: Path, source_root: Path) -> bool:
    try:
        relative = path.relative_to(source_root)
    except ValueError:
        return True

    for part in relative.parts[:-1]:
        if part.startswith(".") or part in DEFAULT_EXCLUDED_DIRS:
            return True

    return False


def build_metadata(
    item: dict[str, Any],
    manifest: dict[str, dict[str, Any]],
    existing_slugs: set[str],
    args: argparse.Namespace,
) -> dict[str, Any]:
    override = find_override(item, manifest)
    title = override.get("title") or guess_title(item)
    slug = override.get("slug") or unique_slug(slugify(title) or slugify(Path(item["relativePath"]).stem), item["hash"], existing_slugs)
    summary = override.get("summary") or guess_summary(item["body"])
    category = override.get("category") or guess_category(item["relativePath"])
    tags = override.get("tags") or guess_tags(item["relativePath"], category)
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",") if tag.strip()]

    metadata = {
        "slug": slug,
        "title": title,
        "summary": summary,
        "category": category,
        "tags": tags,
        "publishedAt": override.get("publishedAt") or override.get("published_at") or args.published_at,
        "status": override.get("status") or args.status,
    }

    optional_map = {
        "displayDate": "display-date",
        "readingTime": "reading-time",
        "coverImage": "cover-image",
        "order": "order",
    }
    for source_key, target_key in optional_map.items():
        if source_key in override:
            metadata[target_key] = override[source_key]

    return metadata


def find_override(item: dict[str, Any], manifest: dict[str, dict[str, Any]]) -> dict[str, Any]:
    path = Path(item["path"])
    keys = [str(path), item["relativePath"], path.name, path.stem]
    for key in keys:
        if key in manifest:
            return manifest[key]
    return {}


def guess_title(item: dict[str, Any]) -> str:
    body = item["body"]
    match = re.search(r"^\s*#\s+(.+?)\s*$", body, flags=re.MULTILINE)
    if match:
        return clean_inline(match.group(1))

    for line in body.splitlines():
        stripped = clean_inline(line)
        if stripped and not stripped.startswith(("!", "[", "---", ">")):
            return stripped[:80]

    return Path(item["relativePath"]).stem


def guess_summary(body: str) -> str:
    for block in re.split(r"\n\s*\n", body):
        text = clean_inline(block)
        if not text or text.startswith("#") or text.startswith("!") or text.startswith("【标题"):
            continue
        text = re.sub(r"^【摘要】", "", text).strip()
        if text:
            return truncate(text, 120)
    return "一篇来自已发布内容库的文章，已整理进入个人站博客。"


def guess_category(relative_path: str) -> str:
    rel = relative_path.lower()
    if "codex" in rel:
        return "Codex 实践"
    if "human3" in rel or "human3.0" in rel:
        return "Human 3.0"
    if "特征治理" in relative_path:
        return "特征治理"
    if "何以为父" in relative_path or "家庭" in relative_path:
        return "家庭协作"
    if "stitch" in rel:
        return "AI 设计实践"
    if "openclaw" in rel or "养虾" in relative_path:
        return "OpenClaw 实践"
    if "ai" in rel or "AI" in relative_path:
        return "AI 实践"
    return "个人系统"


def guess_tags(relative_path: str, category: str) -> list[str]:
    tags = [category]
    rel = relative_path.lower()
    if "codex" in rel:
        tags.append("Codex")
    if "human3" in rel or "human3.0" in rel:
        tags.append("Human 3.0")
    if "openclaw" in rel:
        tags.append("OpenClaw")
    if "stitch" in rel:
        tags.append("Stitch")
    if "ai" in rel or "AI" in relative_path:
        tags.append("AI")
    return dedupe(tags)[:4]


def unique_slug(base: str, digest: str, existing_slugs: set[str]) -> str:
    slug = base.strip("-") or f"post-{digest[:10]}"
    if slug not in existing_slugs:
        return slug

    suffix = digest[:8]
    candidate = f"{slug}-{suffix}"
    counter = 2
    while candidate in existing_slugs:
        candidate = f"{slug}-{suffix}-{counter}"
        counter += 1
    return candidate


def slugify(value: str) -> str:
    slug = value.strip().lower()
    replacements = {
        "ai": "ai",
        "chatgpt": "chatgpt",
        "codex": "codex",
        "openclaw": "openclaw",
        "human": "human",
        "stitch": "stitch",
    }
    for source, target in replacements.items():
        slug = re.sub(source, target, slug, flags=re.IGNORECASE)
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def stage_source_tree(source_root: Path, staging_dir: Path) -> Path:
    staged_root = staging_dir / "source"
    if staged_root.exists():
        shutil.rmtree(staged_root)
    staged_root.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source_root, staged_root)
    return staged_root


def upload_images(markdown_path: Path, r2_script: str, key_prefix: str) -> dict[str, Any]:
    script = Path(r2_script).expanduser()
    if not script.exists():
        raise SystemExit(f"md-img-r2 script does not exist: {script}")

    subprocess.run([str(script), str(markdown_path), "--key-prefix", key_prefix], check=True)
    report_path = markdown_path.with_suffix(markdown_path.suffix + ".replace-report.json")
    if report_path.exists():
        return json.loads(report_path.read_text(encoding="utf-8"))
    return {}


def import_one(
    import_script: Path,
    source_path: Path,
    output_root: Path,
    metadata: dict[str, Any],
    args: argparse.Namespace,
) -> Path:
    command = [
        sys.executable,
        str(import_script),
        "--source",
        str(source_path),
        "--locale",
        args.locale,
        "--slug",
        metadata["slug"],
        "--title",
        metadata["title"],
        "--summary",
        metadata["summary"],
        "--category",
        metadata["category"],
        "--tags",
        ",".join(metadata["tags"]),
        "--published-at",
        metadata["publishedAt"],
        "--status",
        metadata["status"],
        "--output-root",
        str(output_root),
    ]

    for key in ("display-date", "reading-time", "cover-image", "order"):
        if key in metadata and metadata[key] is not None:
            command.extend([f"--{key}", str(metadata[key])])

    if args.force:
        command.append("--force")

    result = subprocess.run(command, check=True, text=True, capture_output=True)
    output = result.stdout.strip().splitlines()[-1]
    return Path(output)


def strip_frontmatter(markdown: str) -> str:
    if markdown.startswith("---"):
        match = re.match(r"^---\s*\n[\s\S]*?\n---\s*\n?", markdown)
        if match:
            return markdown[match.end() :]
    return markdown


def normalize_body(markdown: str, remove_h1: bool = True) -> str:
    lines = markdown.strip().splitlines()
    while lines and not lines[0].strip():
        lines.pop(0)
    if remove_h1 and lines and lines[0].lstrip().startswith("# "):
        lines.pop(0)
    while lines and not lines[0].strip():
        lines.pop(0)
    if lines and re.fullmatch(r"-{3,}", lines[0].strip()):
        lines.pop(0)
    while lines and not lines[0].strip():
        lines.pop(0)
    return "\n".join(lines).strip()


def normalize_for_hash(markdown: str) -> str:
    body = strip_frontmatter(markdown)
    body = body.replace("\r\n", "\n").replace("\r", "\n")
    body = re.sub(r"\s+", " ", body)
    return body.strip()


def clean_inline(value: str) -> str:
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", value)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[#>*_`]+", "", text)
    return re.sub(r"\s+", " ", text).strip()


def truncate(value: str, length: int) -> str:
    return value if len(value) <= length else value[: length - 1].rstrip() + "…"


def dedupe(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            result.append(value)
    return result


def relativize(path: Path, base: Path) -> str:
    try:
        return path.resolve().relative_to(base).as_posix()
    except ValueError:
        return str(path)


if __name__ == "__main__":
    main()
