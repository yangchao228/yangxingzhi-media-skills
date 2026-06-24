#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="${VERSION:-0.1}"
PACKAGE_NAME="wenchang-skill-pack-v${VERSION}"
OUT_DIR="$ROOT/dist/sale"
WORK_DIR="$OUT_DIR/$PACKAGE_NAME"
ZIP_PATH="$OUT_DIR/$PACKAGE_NAME.zip"

require_tool() {
  local name="$1"
  if ! command -v "$name" >/dev/null 2>&1; then
    printf 'missing required tool: %s\n' "$name" >&2
    exit 1
  fi
}

copy_file() {
  local src="$1"
  local dst="$WORK_DIR/$src"
  if [[ ! -f "$ROOT/$src" ]]; then
    printf 'missing file: %s\n' "$src" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$dst")"
  cp "$ROOT/$src" "$dst"
}

copy_dir() {
  local src="$1"
  local dst="$WORK_DIR/$src"
  if [[ ! -d "$ROOT/$src" ]]; then
    printf 'missing directory: %s\n' "$src" >&2
    exit 1
  fi
  mkdir -p "$dst"
  rsync -a \
    --exclude '.DS_Store' \
    --exclude '.env' \
    --exclude '.env.*' \
    --exclude '*.env' \
    --exclude '__pycache__/' \
    --exclude '*.pyc' \
    --exclude '*.pyo' \
    --exclude '*.md.bak' \
    --exclude '*.replace-report.json' \
    --exclude 'dist/' \
    --exclude 'outputs/' \
    --exclude 'assets/2026-*' \
    "$ROOT/$src/" "$dst/"
}

scan_blocked_files() {
  local found
  found="$(find "$WORK_DIR" \( -name '.env' -o -name '.env.*' -o -name '*.env' -o -name '.DS_Store' \) -print)"
  if [[ -n "$found" ]]; then
    printf 'blocked files found in package:\n%s\n' "$found" >&2
    exit 1
  fi
}

require_tool rsync
require_tool zip

if [[ -e "$WORK_DIR" || -e "$ZIP_PATH" ]]; then
  printf 'package already exists: %s\n' "$PACKAGE_NAME" >&2
  printf 'set VERSION=0.2 or remove the existing package manually.\n' >&2
  exit 1
fi

mkdir -p "$WORK_DIR"

copy_file "README.md"
copy_file "docs/wenchang-user-guide.md"
copy_file "content/CONTENT_STATE.md"
copy_file "content/content_state.schema.json"

copy_dir "sale"

SKILL_DIRS=(
  "content/wenchang-orchestrator"
  "content/wenchang-router"
  "content/storm-research"
  "content/wenchang-research"
  "content/wenchang-review"
  "content/wenchang-publish-check"
  "content/wechat-writing-skill-ai-human3"
  "content/wechat-hot-topic-skill-ai-human3"
  "content/wechat-hot-topic-skill-generic"
  "content/zhihu-topic-hunter"
  "content/xiaohongshu-topic-generator"
  "content/wechat-to-cards"
  "content/redbook-cards"
  "content/long-to-cards"
  "content/xiaohongshu-viral-image-skill-v4"
  "content/human3-book-guardian-v6"
)

for dir in "${SKILL_DIRS[@]}"; do
  copy_dir "$dir"
done

scan_blocked_files

{
  printf '# 文昌 skill 售卖包清单\n\n'
  printf 'package: %s\n' "$PACKAGE_NAME"
  printf 'generated_at: %s\n\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  printf '## files\n\n'
  find "$WORK_DIR" -type f | sed "s#^$WORK_DIR/##" | sort
} > "$WORK_DIR/package-manifest.txt"

(
  cd "$OUT_DIR"
  zip -qr "$ZIP_PATH" "$PACKAGE_NAME"
)

printf 'created package: %s\n' "$ZIP_PATH"
