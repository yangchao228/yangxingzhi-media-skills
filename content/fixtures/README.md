# content fixtures

这些 fixture 用于验证文昌内容流水线的阶段边界。它们不调用 LLM，只检查输入/期望输出的结构是否符合工作流约束。

## 目录结构

每个 case 一个目录：

```text
content/fixtures/<case-name>/
  router-input.md
  router-expected.md
  research-input.md
  research-expected.md
  review-input.md
  review-expected.md
  publish-input.md
  publish-expected.md
```

当前 case：

- `ai-memory`：已有方向但无初稿，默认先采证。
- `codex-workbench`：外部热点/文章型，重点防止复述原文。
- `content-agents-diagnostic`：已有初稿诊断型，重点防止直接重写和继承夸张承诺。

## 必须覆盖

- `router-expected.md` 必须有 `brief`，且不能写正文。
- `research-expected.md` 必须有 `contrarian_points` 和 `confidence`。
- `review-expected.md` 必须有 `诊断结论`、`最小修改建议`、`修改日志`、`删减说明` 和 `最强一句`。
- `publish-expected.md` 必须有 `publish_assets`、`distribution`、`archive`。
- 每个 expected 都必须包含 `handoff`。

## 新增 case

1. 从 `content/examples/full-pipeline-*.md` 拆出四个阶段。
2. 每个阶段只保留该阶段需要的输入和期望输出。
3. 在 `scripts/validate_content_fixtures.py` 的 `CASE_TYPES` 中登记 case 类型。
4. 运行：

```bash
./scripts/validate_skills.sh
```

## 类型约束

- `existing-direction`：已有方向但无初稿，应优先进入采证。
- `external-article`：外部文章/热点，不要逐段翻译，不要变成工具教程。
- `draft-diagnostic`：已有初稿，必须先诊断，再决定是否采证、重写或出刊。
