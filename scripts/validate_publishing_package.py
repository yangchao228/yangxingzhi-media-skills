#!/usr/bin/env python3
"""Offline publishing-delivery checks. Never read credentials or contact services."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys


MANIFEST = "publishing-manifest.json"
FILE_MANIFEST = "package-manifest.txt"
TOOL = "tools/wenchang-publishing"
FIXTURE = "content/publishing/p0/fixture"
STATIC_FILES = (
    f"{TOOL}/package.json", f"{TOOL}/package-lock.json", f"{TOOL}/tsconfig.json",
    f"{TOOL}/README.md", "scripts/validate_publishing_package.py",
    "docs/publishing-install.md", "docs/product/wenchang-local-publishing-mvp.md",
    "md-img-r2/SKILL.md", "md-img-r2/skill.json", "md-img-r2/README.md",
    "md-img-r2/run.sh", "md-img-r2/scripts/md_img_r2.py",
    f"{FIXTURE}/body.md", f"{FIXTURE}/metadata.json", f"{FIXTURE}/preview.html",
    f"{FIXTURE}/assets/image-01.png", f"{FIXTURE}/assets/image-02.png",
)
# Extensions are accepted only in these dedicated implementation directories.
SOURCE_GLOBS = (f"{TOOL}/src/**/*.ts", f"{TOOL}/schemas/*.json",
                f"{TOOL}/browser/*.mjs", f"{TOOL}/test/*.mjs")
BLOCKED_PARTS = {".git", ".local", "local", "private", "node_modules", "dist", "outputs", "__pycache__"}


class PackageError(Exception):
    pass


def blocked(ref: str) -> bool:
    parts = PurePosixPath(ref).parts
    return "\n" in ref or "\r" in ref or any(part.lower() in BLOCKED_PARTS or part.lower().startswith(".env")
               or part.lower().endswith(".env") or "credentials" in part.lower()
               or part.lower() == ".ds_store" or part.lower().endswith((".pyc", ".pyo")) for part in parts)


def source_files(root: Path) -> list[str]:
    refs = set(STATIC_FILES)
    for pattern in SOURCE_GLOBS:
        matches = sorted(root.glob(pattern))
        if not matches:
            raise PackageError(f"missing source group: {pattern}")
        refs.update(path.relative_to(root).as_posix() for path in matches)
    for ref in sorted(refs):
        path = root / ref
        if blocked(ref) or not path.is_file() or path.is_symlink():
            raise PackageError(f"missing or disallowed source file: {ref}")
        try:
            path.resolve().relative_to(root.resolve())
        except ValueError:
            raise PackageError(f"source leaves package root: {ref}")
    return sorted(refs)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def scan_package(root: Path) -> None:
    for path in root.rglob("*"):
        ref = path.relative_to(root).as_posix()
        if blocked(ref) or path.is_symlink():
            raise PackageError(f"blocked package entry: {ref}")
        if not path.is_file() and not path.is_dir():
            raise PackageError(f"package entry is not a regular file: {ref}")
    # Delivery can include content-production skills; runtime and fixture trees
    # must match the bounded allowlist exactly, including after unzip.
    allowed = set(source_files(root))
    for prefix in (TOOL, "md-img-r2", "content/publishing"):
        for path in (root / prefix).rglob("*"):
            if path.is_file() and path.relative_to(root).as_posix() not in allowed:
                raise PackageError(f"unexpected runtime or evidence file: {path.relative_to(root)}")


def validate_file_manifest(root: Path) -> None:
    manifest = root / FILE_MANIFEST
    if not manifest.is_file() or manifest.is_symlink():
        raise PackageError("missing package file manifest")
    try:
        listed = manifest.read_text(encoding="utf-8").split("## files\n\n", 1)[1].splitlines()
    except (OSError, UnicodeError, IndexError) as error:
        raise PackageError("invalid package file manifest") from error
    if listed != sorted(set(listed)):
        raise PackageError("invalid package file manifest")
    actual = sorted(path.relative_to(root).as_posix() for path in root.rglob("*")
                    if path.is_file() and path != manifest)
    # Older packages listed the root manifest itself. Both forms protect the
    # same file set; nested files sharing its basename must still be listed.
    if listed not in (actual, sorted(actual + [FILE_MANIFEST])):
        raise PackageError("package file manifest mismatch")


def validate(root: Path, source: Path | None = None, write: bool = False) -> int:
    if not root.is_dir() or root.is_symlink():
        raise PackageError("package root must be an existing directory")
    scan_package(root)
    refs = source_files(root)
    if source is not None:
        expected = source_files(source)
        if refs != expected:
            raise PackageError("publishing source file set differs from repository")
        for ref in refs:
            if digest(root / ref) != digest(source / ref):
                raise PackageError(f"source/package bytes differ: {ref}")
    entries = [{"path": ref, "sha256": digest(root / ref), "bytes": (root / ref).stat().st_size}
               for ref in refs]
    manifest = {"schema_version": 1, "package_kind": "publishing-source",
                "requires": {"node": ">=22", "python": ">=3.8", "npm": "npm ci"},
                "accounts_included": False, "publication_performed": False, "files": entries}
    file = root / MANIFEST
    if write:
        file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    else:
        if not file.is_file() or file.is_symlink():
            raise PackageError(f"missing publishing source manifest: {MANIFEST}")
        try:
            actual = json.loads(file.read_text(encoding="utf-8"))
        except (ValueError, OSError) as error:
            raise PackageError("invalid publishing source manifest") from error
        if actual != manifest:
            raise PackageError("publishing manifest mismatch: file is missing, changed or unlisted")
        validate_file_manifest(root)
    return len(entries)


def check_runtimes() -> None:
    # Deliberately inspect executables only; never run npm install or open an account.
    for name in ("node", "npm", "python3"):
        executable = shutil.which(name)
        if not executable:
            raise PackageError(f"missing runtime: {name}")
        command = [executable, "--version"]
        try:
            result = subprocess.run(command, capture_output=True, text=True, timeout=10, check=True)
        except (OSError, subprocess.SubprocessError) as error:
            raise PackageError(f"runtime check failed: {name}") from error
        if name in ("node", "python3"):
            version = re.search(r"(\d+)\.(\d+)", result.stdout)
            required = (22, 0) if name == "node" else (3, 8)
            if not version or tuple(map(int, version.groups())) < required:
                minimum = "22" if name == "node" else "3.8"
                raise PackageError(f"unsupported runtime: {name} requires >={minimum}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, help="extracted publishing package directory")
    parser.add_argument("--source-root", type=Path, help="optionally compare against source checkout")
    parser.add_argument("--list-source-files", action="store_true", help="print the bounded source allowlist")
    parser.add_argument("--write-manifest", action="store_true", help="packager only: create source hash manifest")
    parser.add_argument("--check-runtimes", action="store_true", help="also require Node >=22, npm and Python >=3.8")
    args = parser.parse_args()
    try:
        if args.list_source_files:
            if args.source_root is None:
                raise PackageError("--list-source-files requires --source-root")
            print("\n".join(source_files(args.source_root.resolve())))
            return 0
        if args.check_runtimes:
            check_runtimes()
        if args.package is not None:
            count = validate(args.package.resolve(), args.source_root.resolve() if args.source_root else None,
                             args.write_manifest)
            print(f"publishing package verified: {count} source files; no accounts or compiled dependencies")
        elif not args.check_runtimes:
            raise PackageError("provide --package or --check-runtimes")
    except PackageError as error:
        print(f"publishing package check failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
