# ui-visual-match-loop 生成验证

## 背景

用户提出一个更适合完整 Loop 的真实场景：

> 使用 Codex 复刻指定 UI 视觉稿时，来回修改很多轮仍然不像。

这个场景具备完整 Loop 条件：

- 有目标视觉稿。
- 有当前页面截图。
- 有视觉差异反馈。
- 可以逐轮修正。
- 可以达标或触发停止规则。
- 高风险动作可以保留人工确认。

## loop-builder 判断

- 结论：适合生成专用 Loop Skill。
- 主模式：Plan-Execute-Verify。
- 辅助模式：Retry Loop、Human-in-the-Loop。
- 生成产物：`content/ui-visual-match-loop/`

## 生成的专用 Skill

- `content/ui-visual-match-loop/SKILL.md`
- `content/ui-visual-match-loop/skill.json`

## 为什么不是只加到 loop-builder

UI 视觉复刻是高频、强流程、需要截图证据的垂直任务。

保留为独立 Skill 的好处：

- 用户在任意前端项目中可以直接调用。
- 不需要每次从 `loop-builder` 重新生成完整流程。
- 仍然保留来源说明：由 `loop-builder` 生成。

## 人工确认边界

该 Skill 不自动：

- 安装依赖。
- 改业务逻辑。
- 引入 UI 库。
- 提交、发布或部署。
- 宣称像素级完全一致。

## 验收命令

```bash
git diff --check -- content/loop-builder content/ui-visual-match-loop
bash scripts/validate_skills.sh
```

## 仍需确认

- 是否在真实前端项目中跑第一轮 UI 视觉复刻 Loop。

## 安装结果

已安装到全局 Codex skills 目录：

- `/Users/yangchao/.codex/skills/loop-builder`
- `/Users/yangchao/.codex/skills/ui-visual-match-loop`
