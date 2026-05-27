#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
FIXTURES_ROOT = ROOT / "content" / "fixtures"
CONTENT_STATE_SCHEMA = ROOT / "content" / "content_state.schema.json"


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
    "orchestrator-codex": "orchestrator",
    "regression-boundaries": "regression-boundaries",
}


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def require(errors: list[str], condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


def has_list_items_after(text: str, field: str) -> bool:
    pattern = re.compile(rf"^\s*{re.escape(field)}:\s*$", re.MULTILINE)
    match = pattern.search(text)
    if not match:
        return False
    rest = text[match.end() :]
    for line in rest.splitlines():
        if not line.strip():
            continue
        if re.match(r"^\s+-\s+\S+", line):
            return True
        if re.match(r"^\s{0,4}[\w_]+:", line):
            return False
    return False


def has_content_state_contract(text: str) -> bool:
    return all(token in text for token in ["content_state:", "next_step:", "handoff:"])


def has_handoff_contract(text: str) -> bool:
    return all(token in text for token in ["accepted_inputs:", "ignored_context:", "stop_condition:"])


def validate_case(case_dir: pathlib.Path) -> list[str]:
    errors: list[str] = []
    case_type = CASE_TYPES.get(case_dir.name)
    require(errors, case_type is not None, f"{case_dir}: missing case type mapping")

    if case_type == "orchestrator":
        return validate_orchestrator_case(case_dir)
    if case_type == "regression-boundaries":
        return validate_regression_boundaries(case_dir)

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
    require(errors, has_content_state_contract(router), f"{case_dir}: router expected missing content_state contract")
    require(errors, has_handoff_contract(router), f"{case_dir}: router expected missing handoff contract")
    require(errors, "## 正文" not in router and "## 编辑后正文" not in router, f"{case_dir}: router expected should not include body")

    require(errors, "## 采证结论" in research, f"{case_dir}: research expected missing conclusion")
    require(errors, "## 来源清单" in research, f"{case_dir}: research expected missing sources")
    require(errors, "## 关键事实" in research, f"{case_dir}: research expected missing key facts")
    require(errors, "## 反向数据 / 限制条件" in research, f"{case_dir}: research expected missing contrarian section")
    require(errors, "contrarian_points:" in research, f"{case_dir}: research expected missing contrarian_points")
    require(errors, has_list_items_after(research, "contrarian_points"), f"{case_dir}: research expected contrarian_points should include at least one item")
    require(errors, "confidence:" in research, f"{case_dir}: research expected missing confidence")
    require(errors, has_content_state_contract(research), f"{case_dir}: research expected missing content_state contract")
    require(errors, has_handoff_contract(research), f"{case_dir}: research expected missing handoff contract")

    require(errors, "## 诊断结论" in review, f"{case_dir}: review expected missing diagnosis")
    require(errors, "## 最小修改建议" in review, f"{case_dir}: review expected missing minimum fixes")
    require(errors, "## 修改日志" in review, f"{case_dir}: review expected missing change log")
    require(errors, "## 删减说明" in review, f"{case_dir}: review expected missing cut note")
    require(errors, "## 最强一句" in review, f"{case_dir}: review expected missing strongest line")
    require(errors, has_content_state_contract(review), f"{case_dir}: review expected missing content_state contract")
    require(errors, has_handoff_contract(review), f"{case_dir}: review expected missing handoff contract")

    require(errors, "## 发布结论" in publish, f"{case_dir}: publish expected missing publish decision")
    require(errors, "## 必补项" in publish, f"{case_dir}: publish expected missing blockers")
    require(errors, "## 平台发布包" in publish, f"{case_dir}: publish expected missing publish package")
    require(errors, "publish_assets:" in publish, f"{case_dir}: publish expected missing publish_assets")
    require(errors, "distribution:" in publish, f"{case_dir}: publish expected missing distribution")
    require(errors, "archive:" in publish, f"{case_dir}: publish expected missing archive")
    require(errors, has_content_state_contract(publish), f"{case_dir}: publish expected missing content_state contract")
    require(errors, has_handoff_contract(publish), f"{case_dir}: publish expected missing handoff contract")
    require(errors, "## 编辑后正文" not in publish and "## 正文" not in publish, f"{case_dir}: publish expected should not edit or regenerate body")

    if "should_review_for_book: true" in publish:
        require(errors, "user_decision_needed: true" in publish, f"{case_dir}: archive recommendation should require user decision")

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


def validate_orchestrator_case(case_dir: pathlib.Path) -> list[str]:
    errors: list[str] = []
    required = ["orchestrator-input.md", "orchestrator-expected.md"]
    for name in required:
        require(errors, (case_dir / name).is_file(), f"{case_dir}: missing {name}")
    if errors:
        return errors

    expected = read(case_dir / "orchestrator-expected.md")
    require(errors, "## 当前阶段" in expected, f"{case_dir}: orchestrator expected missing current stage")
    require(errors, "## 已完成" in expected, f"{case_dir}: orchestrator expected missing completed section")
    require(errors, "## 需要你确认" in expected, f"{case_dir}: orchestrator expected missing confirmation section")
    require(errors, "## 我建议" in expected, f"{case_dir}: orchestrator expected missing recommendation")
    require(errors, "## 用户回复后将执行" in expected, f"{case_dir}: orchestrator expected missing next action")
    require(errors, has_content_state_contract(expected), f"{case_dir}: orchestrator expected missing content_state contract")
    require(errors, has_handoff_contract(expected), f"{case_dir}: orchestrator expected missing handoff contract")
    require(errors, "配图" in expected or "卡片" in expected, f"{case_dir}: orchestrator expected should include image/card path")
    require(errors, "归档" in expected, f"{case_dir}: orchestrator expected should include archive path")
    require(errors, "定题" in expected, f"{case_dir}: orchestrator expected should include topic selection")
    require(errors, "路由 -> 采证 -> 起稿 -> 诊文 -> 出刊" not in expected, f"{case_dir}: orchestrator should not use fixed five-step chain")
    require(errors, "## 编辑后正文" not in expected and "## 正文" not in expected, f"{case_dir}: orchestrator expected should not write article body")
    return errors


def validate_regression_boundaries(case_dir: pathlib.Path) -> list[str]:
    errors: list[str] = []
    required = [
        "low-confidence-research.md",
        "missing-contrarian-research.md",
        "publish-must-not-edit-body.md",
        "decision-log-required.md",
    ]
    for name in required:
        require(errors, (case_dir / name).is_file(), f"{case_dir}: missing {name}")
    if errors:
        return errors

    low_confidence = read(case_dir / "low-confidence-research.md")
    missing_contrarian = read(case_dir / "missing-contrarian-research.md")
    publish_boundary = read(case_dir / "publish-must-not-edit-body.md")
    decision_log = read(case_dir / "decision-log-required.md")

    require(errors, "confidence: Low" in low_confidence, f"{case_dir}: low-confidence case should mark confidence Low")
    require(errors, "user_decision_needed: true" in low_confidence, f"{case_dir}: low-confidence case should stop for user decision")
    require(errors, "skill: wenchang-research" in low_confidence or "skill: null" in low_confidence, f"{case_dir}: low-confidence case should not advance to writing")

    require(errors, "contrarian_points:" in missing_contrarian, f"{case_dir}: missing-contrarian case should include contrarian_points field")
    require(errors, not has_list_items_after(missing_contrarian, "contrarian_points"), f"{case_dir}: missing-contrarian case should keep contrarian list empty")
    require(errors, "confidence: Low" in missing_contrarian or "confidence: Medium" in missing_contrarian, f"{case_dir}: missing-contrarian case should lower confidence")
    require(errors, "user_decision_needed: true" in missing_contrarian, f"{case_dir}: missing-contrarian case should stop for user decision")

    require(errors, "## 发布结论" in publish_boundary, f"{case_dir}: publish boundary missing publish section")
    require(errors, "## 编辑后正文" not in publish_boundary and "## 正文" not in publish_boundary, f"{case_dir}: publish boundary should not include article body")
    require(errors, "退回 `wenchang-review`" in publish_boundary or "退回 wenchang-review" in publish_boundary, f"{case_dir}: publish boundary should route body fixes back to review")

    require(errors, "decisions:" in decision_log, f"{case_dir}: decision log case missing decisions")
    for token in ("stage:", "question:", "user_choice:", "impact:"):
        require(errors, token in decision_log, f"{case_dir}: decision log case missing {token}")
    require(errors, "user_decision_needed: false" in decision_log, f"{case_dir}: resolved decision should clear user_decision_needed")
    return errors


def main() -> int:
    if not FIXTURES_ROOT.exists():
        return 0

    errors: list[str] = []
    if not CONTENT_STATE_SCHEMA.is_file():
        errors.append(f"{CONTENT_STATE_SCHEMA}: missing content_state schema")
    else:
        schema = read(CONTENT_STATE_SCHEMA)
        for token in ('"content_state"', '"decisions"', '"next_step"', '"handoff"'):
            if token not in schema:
                errors.append(f"{CONTENT_STATE_SCHEMA}: schema missing {token}")

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
