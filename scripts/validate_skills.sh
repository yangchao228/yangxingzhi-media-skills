#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PY="${PYTHON:-python3}"
FAILED=0

log() {
  printf '[validate] %s\n' "$*"
}

fail() {
  printf '[validate][FAIL] %s\n' "$*" >&2
  FAILED=1
}

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    fail "missing file: $path"
  fi
}

log "scan skill directories"
SKILL_FILES=()
while IFS= read -r file; do
  SKILL_FILES+=("$file")
done < <(find . -path './.git' -prune -o -path './dist' -prune -o -name SKILL.md -type f -print | sort)
if [[ "${#SKILL_FILES[@]}" -eq 0 ]]; then
  fail "no SKILL.md files found"
fi

for skill_file in "${SKILL_FILES[@]}"; do
  skill_dir="$(dirname "$skill_file")"
  log "check ${skill_dir#./}"

  "$PY" - "$skill_file" <<'PY'
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
errors = []

if not text.startswith("---\n"):
    errors.append("missing YAML frontmatter")
else:
    end = text.find("\n---", 4)
    if end == -1:
        errors.append("frontmatter is not closed")
    else:
        frontmatter = text[4:end]
        fields = {}
        for line in frontmatter.splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                fields[key.strip()] = value.strip()
        for key in ("name", "description"):
            if not fields.get(key):
                errors.append(f"missing frontmatter field: {key}")

if not text.lstrip().startswith("---") and "# " not in text:
    errors.append("missing markdown title")
elif "# " not in text:
    errors.append("missing markdown title")

if errors:
    for error in errors:
        print(f"{path}: {error}", file=sys.stderr)
    sys.exit(1)
PY
  if [[ "$?" -ne 0 ]]; then
    fail "invalid skill metadata: ${skill_file#./}"
  fi

  if [[ -f "$skill_dir/skill.json" ]]; then
    "$PY" - "$skill_dir" "$skill_dir/skill.json" <<'PY'
import json
import pathlib
import sys

skill_dir = pathlib.Path(sys.argv[1])
path = pathlib.Path(sys.argv[2])
data = json.loads(path.read_text(encoding="utf-8"))
errors = []

for key in ("slug", "title", "summary", "source_dir", "entry", "status"):
    if not data.get(key):
        errors.append(f"missing skill.json field: {key}")

source_dir = data.get("source_dir")
if source_dir and pathlib.Path(source_dir).as_posix() != skill_dir.as_posix().lstrip("./"):
    errors.append(f"source_dir mismatch: expected {skill_dir.as_posix().lstrip('./')}, got {source_dir}")

entry = data.get("entry")
if entry and not (skill_dir / entry).is_file():
    errors.append(f"entry does not exist: {entry}")

if errors:
    for error in errors:
        print(f"{path}: {error}", file=sys.stderr)
    sys.exit(1)
PY
    if [[ "$?" -ne 0 ]]; then
      fail "invalid skill.json: ${skill_dir#./}/skill.json"
    fi
  fi

  if [[ -f "$skill_dir/run.sh" ]]; then
    if [[ ! -x "$skill_dir/run.sh" ]]; then
      fail "run.sh is not executable: ${skill_dir#./}/run.sh"
    else
      "$skill_dir/run.sh" --help >/dev/null
    fi
  fi

  case "${skill_dir#./}" in
    content/wenchang-*)
      require_file "$skill_dir/examples/minimal-input.md"
      require_file "$skill_dir/examples/expected-output-notes.md"
      ;;
  esac
done

log "compile Python scripts"
PY_FILES=()
while IFS= read -r file; do
  PY_FILES+=("$file")
done < <(find . -path './.git' -prune -o -path './dist' -prune -o -path './*/__pycache__/*' -prune -o -name '*.py' -type f -print | sort)
if [[ "${#PY_FILES[@]}" -gt 0 ]]; then
  PYTHONPYCACHEPREFIX=/tmp/yangxingzhi-media-skills-pycache "$PY" -m py_compile "${PY_FILES[@]}"
fi

if [[ -d content/fixtures ]]; then
  log "validate content fixtures"
  "$PY" scripts/validate_content_fixtures.py
fi

log "check stale references"
if command -v rg >/dev/null 2>&1; then
  if rg -n 'skills/tooling/md-img-r2|package_skill\.py' . \
    --glob '!scripts/validate_skills.sh' \
    --glob '!todo.md' \
    >/tmp/yangxingzhi-media-skills-rg.log; then
    cat /tmp/yangxingzhi-media-skills-rg.log >&2
    fail "stale path or missing package script reference found"
  fi
fi

log "check tracked generated files"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git ls-files | grep -E '(^|/)(\.DS_Store|__pycache__/|[^/]+\.pyc$|[^/]+\.pyo$|\.env$|.*\.replace-report\.json$|.*\.md\.bak$)' >/tmp/yangxingzhi-media-skills-tracked.log; then
    cat /tmp/yangxingzhi-media-skills-tracked.log >&2
    fail "generated or secret-like files are tracked by git"
  fi
fi

if [[ -d md-img-r2 ]]; then
  log "run md-img-r2 dry-run fixture"
  TMPDIR="$(mktemp -d /tmp/md-img-r2-validate.XXXXXX)"
  export TMPDIR
  "$PY" <<'PY'
import base64
import os
import pathlib

root = pathlib.Path(os.environ["TMPDIR"])
(root / "assets").mkdir(parents=True, exist_ok=True)
png = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII="
)
(root / "assets" / "cover.png").write_bytes(png)
(root / "assets" / "space image.png").write_bytes(png)
(root / "article.md").write_text(
    "\n".join(
        [
            "# Local image fixture",
            "",
            "![cover](./assets/cover.png)",
            "![remote](https://example.com/remote.png)",
            '<img src="./assets/cover.png" width="300">',
            "![missing](./assets/missing.png)",
            "![ref image][img1]",
            "[img1]: <./assets/space image.png> \"title\"",
            "",
        ]
    ),
    encoding="utf-8",
)
PY
  ./md-img-r2/run.sh "$TMPDIR/article.md" --dry-run --public-base-url https://img.example.com --key-prefix smoke >/dev/null
  "$PY" - "$TMPDIR/article.md.replace-report.json" <<'PY'
import json
import pathlib
import sys

report = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
checks = {
    "planned replacements": len(report.get("replaced", [])) >= 3,
    "skipped remote": len(report.get("skipped_remote", [])) == 1,
    "missing file": len(report.get("missing_files", [])) == 1,
    "dry run": report.get("dry_run") is True,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    for name in failed:
        print(f"dry-run check failed: {name}", file=sys.stderr)
    sys.exit(1)
PY
fi

if [[ "$FAILED" -ne 0 ]]; then
  log "validation failed"
  exit 1
fi

log "validation passed"
