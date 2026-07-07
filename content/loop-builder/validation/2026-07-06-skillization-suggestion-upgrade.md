# loop-builder Skill 化建议收尾升级验证

日期：2026-07-06

## 背景

用户反馈：`loop-builder` 完成 Prompt、Loop 或 Agent 输出后，不应该依赖用户自己想到“是否做成 Skill”。更好的体验是：系统在收尾主动判断本操作是否适合沉淀成 Skill，如果合适，提示用户是否继续生成 Skill 协议草案。

## 本次改动

- `SKILL.md` 增加“Skill 化复用判断”。
- `SKILL.md` 输出格式增加 `## Skill 化建议`。
- `templates/input-template.md` 增加 Skill 化复用判断字段。
- `references/skill-generation-contract.md` 增加收尾 Skill 化建议规则。
- `quick-start.md` 增加自动收尾判断说明。
- `skill.json` 更新 Skill 化建议定位。

## 验证用例

### 用例 1：UI 复刻 Prompt 输出后

用户输入：

```md
帮我复刻这个 UI 视觉稿
```

期望行为：

- 默认先输出给 Codex 使用的 UI 复刻 Prompt。
- 输出末尾必须包含 `## Skill 化建议`。
- 如果判断该流程可能跨项目复用，应输出：
  - 结论：建议 Skill 化 或 观察一次后再 Skill 化。
  - 适合沉淀的复用场景。
  - 建议 Skill 名称。
  - 是否需要继续生成 Skill 协议草案。
- 不自动生成或安装 Skill。

### 用例 2：一次性文案改写

用户输入：

```md
帮我把这段文案改短一点
```

期望行为：

- 输出可用 Prompt 或直接改写建议。
- 输出末尾包含 `## Skill 化建议`。
- 结论应为“暂不建议 Skill 化”。
- 原因：一次性任务、工作流太薄、维护成本高于复用价值。

### 用例 3：CI 自动修复 Loop

用户输入：

```md
帮我修这个 CI
```

期望行为：

- 输出 Codex CI 修复 Loop Prompt 或完整 Loop 脚手架。
- 输出末尾包含 `## Skill 化建议`。
- 如果有稳定流程和跨仓复用价值，应提示是否生成 Skill 协议草案。
- 必须保留人工确认：merge、发布、生产配置、权限变更。

## 通过标准

- 每次输出都主动判断是否值得 Skill 化。
- 合适时主动询问用户是否继续生成 Skill 协议草案。
- 不合适时说明原因和更轻保存方式。
- 没有用户确认前，不写入、覆盖、安装或提交 Skill。
