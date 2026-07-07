# loop-builder 专用 Loop Agent 包升级验证

## 背景

本轮修订用于澄清 `loop-builder` 的职责：

- `loop-builder` 是生成 Loop Agent 的脚手架 Skill。
- 具体任务后续应由专用 Loop Agent 反复运行。
- 业务数据和专用规则留在业务目录。
- 候选通用规则必须经用户确认后，才允许进入 `loop-builder` 维护流程。

## 本轮改动

- `SKILL.md`
  - 增加“生成专用 Loop Agent”的触发条件。
  - 增加 `Agent 包档` 输出档位。
  - 增加“专用 Loop Agent 包”固定流程。
  - 增加业务数据、专用规则、候选通用规则的边界。
- `references/agent-package.md`
  - 新增专用 Loop Agent 包生成规范。
  - 新增三层边界：`loop-builder`、专用 Agent、业务目录。
  - 新增 `LoopAgent.md`、state、反哺闸门模板。
- `quick-start.md`
  - 增加 Agent 包档的使用说明。
- `templates/input-template.md`
  - 增加 Agent 包档选项。

## 验收点

- `loop-builder` 不直接保存业务数据。
- 专用 Loop Agent 包默认放在业务目录。
- 专用 Agent 可以记录候选规则，但不能自动修改 `loop-builder`。
- 抽象回 `loop-builder` 必须经过用户确认、适用边界说明和反例检查。
- 输出格式能区分诊断档、脚手架档、运行包档、资产档、Agent 包档。

## 验证命令

```bash
git diff --check -- content/loop-builder
bash scripts/validate_skills.sh
```

## 验证结果

- `git diff --check -- content/loop-builder`：通过。
- `bash scripts/validate_skills.sh`：通过。

## 仍需人工确认

- 是否用“公众号数据复盘”生成第一个专用 Loop Agent。
- 是否把该专用 Agent 放到 Loop Engineering 专题目录。
- 是否将本轮升级纳入 git commit。
