#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
FIXTURES_ROOT = ROOT / "content" / "fixtures"


REQUIRED_CASE_FILES = [
    "router-input.md",
    "router-expected.md",
    "research-input.md",
    "research-expected.md",
    "review-input.md",
    "review-expected.md",
    "publish-input.md",
    "publish-expected.md",
]

CASE_TYPES = {
    "ai-memory": "existing-direction",
    "codex-workbench": "external-article",
    "content-agents-diagnostic": "draft-diagnostic",
}


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def require(errors: list[str], condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


def validate_case(case_dir: pathlib.Path) -> list[str]:
    errors: list[str] = []
    case_type = CASE_TYPES.get(case_dir.name)
    require(errors, case_type is not None, f"{case_dir}: missing case type mapping")

    for name in REQUIRED_CASE_FILES:
        require(errors, (case_dir / name).is_file(), f"{case_dir}: missing {name}")

    if errors:
        return errors

    router = read(case_dir / "router-expected.md")
    research = read(case_dir / "research-expected.md")
    review = read(case_dir / "review-expected.md")
    publish = read(case_dir / "publish-expected.md")
    all_expected = "\n".join([router, research, review, publish])

    require(errors, "## 路由判断" in router, f"{case_dir}: router expected missing route judgment")
    require(errors, "## brief" in router, f"{case_dir}: router expected missing brief")
    require(errors, "Angle" in router, f"{case_dir}: router expected missing Angle")
    require(errors, "Hook" in router, f"{case_dir}: router expected missing Hook")
    require(errors, "Subpoints" in router, f"{case_dir}: router expected missing Subpoints")
    require(errors, "What to avoid" in router, f"{case_dir}: router expected missing What to avoid")
    require(errors, "Suggested format" in router, f"{case_dir}: router expected missing Suggested format")
    require(errors, "content_state:" in router, f"{case_dir}: router expected missing content_state")
    require(errors, "handoff:" in router, f"{case_dir}: router expected missing handoff")
    require(errors, "accepted_inputs:" in router, f"{case_dir}: router expected missing accepted_inputs")
    require(errors, "ignored_context:" in router, f"{case_dir}: router expected missing ignored_context")
    require(errors, "## 正文" not in router and "## 编辑后正文" not in router, f"{case_dir}: router expected should not include body")

    require(errors, "## 采证结论" in research, f"{case_dir}: research expected missing conclusion")
    require(errors, "## 来源清单" in research, f"{case_dir}: research expected missing sources")
    require(errors, "## 关键事实" in research, f"{case_dir}: research expected missing key facts")
    require(errors, "## 反向数据 / 限制条件" in research, f"{case_dir}: research expected missing contrarian section")
    require(errors, "contrarian_points:" in research, f"{case_dir}: research expected missing contrarian_points")
    require(errors, "confidence:" in research, f"{case_dir}: research expected missing confidence")
    require(errors, "handoff:" in research, f"{case_dir}: research expected missing handoff")

    require(errors, "## 诊断结论" in review, f"{case_dir}: review expected missing diagnosis")
    require(errors, "## 最小修改建议" in review, f"{case_dir}: review expected missing minimum fixes")
    require(errors, "## 修改日志" in review, f"{case_dir}: review expected missing change log")
    require(errors, "## 删减说明" in review, f"{case_dir}: review expected missing cut note")
    require(errors, "## 最强一句" in review, f"{case_dir}: review expected missing strongest line")
    require(errors, "handoff:" in review, f"{case_dir}: review expected missing handoff")

    require(errors, "## 发布结论" in publish, f"{case_dir}: publish expected missing publish decision")
    require(errors, "## 必补项" in publish, f"{case_dir}: publish expected missing blockers")
    require(errors, "## 平台发布包" in publish, f"{case_dir}: publish expected missing publish package")
    require(errors, "publish_assets:" in publish, f"{case_dir}: publish expected missing publish_assets")
    require(errors, "distribution:" in publish, f"{case_dir}: publish expected missing distribution")
    require(errors, "archive:" in publish, f"{case_dir}: publish expected missing archive")
    require(errors, "handoff:" in publish, f"{case_dir}: publish expected missing handoff")

    if case_type == "existing-direction":
        require(errors, "current_stage: 采证" in router, f"{case_dir}: existing-direction should route to research")
        require(errors, "wenchang-research" in router, f"{case_dir}: existing-direction should call wenchang-research")

    if case_type == "external-article":
        require(errors, "外部文章" in router or "热点素材" in router, f"{case_dir}: external-article should mark source")
        require(errors, "逐段翻译" in all_expected, f"{case_dir}: external-article should explicitly ignore translation drift")
        require(errors, "纯 Codex 教程" in all_expected or "纯功能清单" in all_expected, f"{case_dir}: external-article should reject tutorial drift")
        require(errors, "参考来源" in publish or "原文" in publish, f"{case_dir}: external-article publish should mention source handling")

    if case_type == "draft-diagnostic":
        require(errors, "current_stage: 诊文" in router, f"{case_dir}: draft-diagnostic should route to review first")
        require(errors, "wenchang-review" in router, f"{case_dir}: draft-diagnostic should call wenchang-review first")
        require(errors, "30 万美元" in all_expected, f"{case_dir}: draft-diagnostic should track exaggerated claim")
        require(errors, "全自动" in all_expected, f"{case_dir}: draft-diagnostic should track automation drift")
        require(errors, "重构选题" in review, f"{case_dir}: draft-diagnostic review should reconstruct topic before writing")

    return errors


def main() -> int:
    if not FIXTURES_ROOT.exists():
        return 0

    errors: list[str] = []
    case_dirs = sorted(path for path in FIXTURES_ROOT.iterdir() if path.is_dir())
    if not case_dirs:
        errors.append(f"{FIXTURES_ROOT}: no fixture cases found")

    for case_dir in case_dirs:
        errors.extend(validate_case(case_dir))

    if errors:
        for error in errors:
            print(f"[fixtures][FAIL] {error}", file=sys.stderr)
        return 1

    print(f"[fixtures] validated {len(case_dirs)} case(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
