# loop-builder v0.2 升级验证

## 本轮目标

把 `loop-builder` 从可用雏形升级为更适合日常调用的 Loop 设计工作台。

本轮只修改 `content/loop-builder`，不安装到 `.codex/skills`，不提交，不发布。

## 改动范围

- 补充 `skill.json`，让仓库能识别该 skill 的标题、分类、入口和用户需求。
- 补充 `quick-start.md`，说明最小输入、推荐提示词和输出使用方式。
- 补充 `templates/input-template.md`，作为用户设计 Loop 前的需求输入表。
- 补充 `examples/loop-engineering-topic-loop.md`，把 Loop Engineering 专题沉淀成长期内容资产 Loop 的示例。
- 更新 `SKILL.md`：
  - 增加 Loop 设计工作台定位。
  - 增加输入处理规则。
  - 增加诊断档、脚手架档、运行包档、资产档。
  - 增加对输入模板和专题案例的引用。

## 验证命令

```bash
git diff --check -- content/loop-builder
python3 -m json.tool content/loop-builder/skill.json
bash scripts/validate_skills.sh
```

## 验证结果

- `git diff --check -- content/loop-builder`：通过。
- `python3 -m json.tool content/loop-builder/skill.json`：通过。
- `bash scripts/validate_skills.sh`：通过。

## 结论

`loop-builder` v0.2 已可作为内部 Loop 设计 skill 使用。它适合先服务以下任务：

- 给真实任务判断是否值得做成 Loop。
- 生成可复制的 TODO.md state file。
- 生成 Planner / Maker / Checker / Evaluator Prompt。
- 给内容专题、Skill 维护、学习复盘设计长期资产 Loop。

## 仍需人工确认

- 是否安装到个人 `.codex/skills`。
- 是否纳入 git commit。
- 是否把它包装成公开教程或配套电子书附赠模板。
