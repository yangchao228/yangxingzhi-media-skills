# loop-builder 专用 Skill 生成契约升级验证

日期：2026-07-06

## 背景

用户反馈：`ui-visual-match-loop` 方向正确，但生成得不够严格，原因不是 UI 场景本身，而是 `loop-builder` 在生成专用 Skill 前缺少“场景工作流建模闸门”。

如果 `loop-builder` 直接生成 `SKILL.md`，容易产出“通用 Loop 模板 + 场景名”，缺少具体行业/任务的专业工作流。

## 本次改动

- `SKILL.md` 增加“场景工作流建模闸门”。
- 新增 `references/skill-generation-contract.md`。
- `templates/input-template.md` 增加专用 Skill 候选判断、场景工作流分析和 Skill 协议草案模板。
- `quick-start.md` 明确专用 Skill 生成分两步：先协议草案，后生成文件。
- `skill.json` 增加场景工作流建模定位。

## 验证用例

### 用例 1：UI 视觉复刻专用 Skill

用户输入：

```md
请使用 loop-builder，帮我把“按目标 UI 设计稿高保真复刻页面”做成专用 Skill。
```

期望行为：

- 不直接输出完整 `SKILL.md`。
- 先输出场景工作流分析。
- 场景工作流分析应包含：
  - 专业角色。
  - 第一动作。
  - 输入契约。
  - 工作流阶段。
  - 反馈信号。
  - 验收标准。
  - 禁止动作。
  - 不确定项处理。
- 再输出 Skill 协议草案。
- 默认等待用户确认协议后再生成完整 Skill。

### 用例 2：一次性文案改写

用户输入：

```md
请使用 loop-builder，帮我生成一个改短文案的 Skill。
```

期望行为：

- 判断不适合生成专用 Skill。
- 推荐一次性 Prompt 或 Checklist。
- 说明原因：复用价值低、工作流太薄、没有必要增加维护成本。

### 用例 3：CI 自动修复

用户输入：

```md
请使用 loop-builder，把 CI 自动修复做成跨项目可复用 Skill。
```

期望行为：

- 先输出场景工作流分析。
- 必须区分 Planner / Maker / Checker / Evaluator。
- 必须保留人工确认：merge、发布、生产配置、权限变更。
- 必须包含失败回滚、最大轮次、只改最小范围。
- 用户确认协议后，才生成完整 Skill。

## 通过标准

- 生成专用 Skill 前，不直接跳到文件内容。
- 能说明真实专业角色和专业工作流。
- 能说明为什么不生成更重产物。
- 能在不适合时退出到 Prompt、Checklist、Human-in-the-Loop 或专用 Agent 包。
- 不改动既有 `ui-visual-match-loop`。
