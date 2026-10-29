#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
VERSION="${VERSION:-0.1}"
WITH_PUBLISHING=0
OUT_DIR="${PACKAGE_OUT_DIR:-$ROOT/dist/sale}"

usage() {
  printf 'Usage: %s [--with-publishing] [--out-dir DIR]\n' "$0"
  printf 'Default: content-production skill pack. --with-publishing adds rebuildable publishing tools.\n'
  printf 'VERSION selects a new version; existing package files are never overwritten.\n'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --with-publishing) WITH_PUBLISHING=1; shift ;;
    --out-dir)
      [[ $# -ge 2 && -n "$2" ]] || { usage >&2; exit 1; }
      OUT_DIR="$2"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) printf 'unknown option: %s\n' "$1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ ! "$VERSION" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
  printf 'invalid VERSION (use letters, numbers, dots, hyphens or underscores)\n' >&2
  exit 1
fi
PACKAGE_NAME="wenchang-skill-pack-v${VERSION}"
if [[ "$WITH_PUBLISHING" -eq 1 ]]; then
  PACKAGE_NAME="wenchang-publishing-pack-v${VERSION}"
fi
mkdir -p "$OUT_DIR"
OUT_DIR="$(cd "$OUT_DIR" && pwd)"
WORK_DIR="$OUT_DIR/$PACKAGE_NAME"
ZIP_PATH="$OUT_DIR/$PACKAGE_NAME.zip"

require_tool() {
  local name="$1"
  if ! command -v "$name" >/dev/null 2>&1; then
    printf 'missing required tool: %s\n' "$name" >&2
    exit 1
  fi
}

check_source_path() {
  local src="$1"
  local component current="$ROOT" physical
  local -a components
  if [[ "$src" == /* ]]; then
    printf 'source path must be relative: %s\n' "$src" >&2
    exit 1
  fi
  IFS='/' read -r -a components <<< "$src"
  for component in "${components[@]}"; do
    if [[ -z "$component" || "$component" == '.' || "$component" == '..' ]]; then
      printf 'invalid source path: %s\n' "$src" >&2
      exit 1
    fi
    current="$current/$component"
    if [[ -L "$current" ]]; then
      printf 'source symlink not allowed: %s\n' "$src" >&2
      exit 1
    fi
  done
  if [[ -d "$current" ]]; then
    physical="$(cd "$current" && pwd -P)"
  elif [[ -f "$current" ]]; then
    physical="$(cd "$(dirname "$current")" && pwd -P)/$(basename "$current")"
  else
    printf 'missing source path: %s\n' "$src" >&2
    exit 1
  fi
  case "$physical" in
    "$ROOT"/*) ;;
    *) printf 'source path leaves repository: %s\n' "$src" >&2; exit 1 ;;
  esac
}

copy_file() {
  local src="$1"
  local dst="$WORK_DIR/$src"
  check_source_path "$src"
  if [[ ! -f "$ROOT/$src" || -L "$ROOT/$src" ]]; then
    printf 'missing file: %s\n' "$src" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$dst")"
  cp "$ROOT/$src" "$dst"
}

copy_dir() {
  local src="$1"
  local dst="$WORK_DIR/$src"
  check_source_path "$src"
  if [[ ! -d "$ROOT/$src" ]]; then
    printf 'missing directory: %s\n' "$src" >&2
    exit 1
  fi
  mkdir -p "$dst"
  rsync -a \
    --exclude '.DS_Store' \
    --exclude '.git/' \
    --exclude '.env' \
    --exclude '.env.*' \
    --exclude '*.env' \
    --exclude '.local/' \
    --exclude 'local/' \
    --exclude 'private/' \
    --exclude 'credentials*' \
    --exclude '*credentials*' \
    --exclude 'node_modules/' \
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
  found="$(find "$WORK_DIR" \( \( ! -type d -a ! -type f \) -o -name $'*\n*' -o -name $'*\r*' -o -iname '.git' -o -iname '.env*' -o -iname '*.env' -o -iname '*credentials*' -o -iname '.local' -o -iname 'local' -o -iname 'private' -o -iname 'node_modules' -o -iname 'dist' -o -iname 'outputs' -o -iname '__pycache__' -o -iname '*.pyc' -o -iname '*.pyo' -o -iname '.ds_store' \) -print)"
  if [[ -n "$found" ]]; then
    printf 'blocked files found in package:\n%s\n' "$found" >&2
    exit 1
  fi
}

require_tool rsync
require_tool zip
if [[ "$WITH_PUBLISHING" -eq 1 ]]; then
  require_tool python3
fi

if [[ -e "$WORK_DIR" || -e "$ZIP_PATH" ]]; then
  printf 'package already exists: %s\n' "$PACKAGE_NAME" >&2
  printf 'set VERSION=0.2 or remove the existing package manually.\n' >&2
  exit 1
fi

mkdir -p "$WORK_DIR"

copy_file "README.md"
copy_file "docs/wenchang-user-guide.md"
copy_file "docs/product/wenchang-local-publishing-mvp.md"
copy_file "docs/publishing-install.md"
copy_file "tools/wenchang-publishing/README.md"
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

if [[ "$WITH_PUBLISHING" -eq 1 ]]; then
  # Only the validator's bounded source allowlist is copied; no user projects,
  # account evidence, .env files, dependency folders or compiled output.
  SOURCE_LIST="$(python3 "$ROOT/scripts/validate_publishing_package.py" --list-source-files --source-root "$ROOT")"
  while IFS= read -r file; do
    copy_file "$file"
  done <<< "$SOURCE_LIST"
  python3 "$ROOT/scripts/validate_publishing_package.py" --package "$WORK_DIR" --source-root "$ROOT" --write-manifest
fi

scan_blocked_files

{
  printf '# 文昌 skill 售卖包清单\n\n'
  printf 'package: %s\n' "$PACKAGE_NAME"
  printf 'generated_at: %s\n\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  printf '## files\n\n'
  (
    cd "$WORK_DIR"
    find . -type f ! -path './package-manifest.txt' | sed 's#^\./##' | LC_ALL=C sort
  )
} > "$WORK_DIR/package-manifest.txt"

if [[ "$WITH_PUBLISHING" -eq 1 ]]; then
  python3 "$ROOT/scripts/validate_publishing_package.py" --package "$WORK_DIR" --source-root "$ROOT"
fi

(
  cd "$OUT_DIR"
  zip -qr "$ZIP_PATH" "$PACKAGE_NAME"
)

printf 'created package: %s\n' "$ZIP_PATH"
