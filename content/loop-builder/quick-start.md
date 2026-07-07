# Loop Builder Quick Start

## 什么时候用

当一个任务不再适合靠一次性 Prompt 完成，而是需要多轮推进、状态记录、验收反馈、停止规则和人工确认时，使用 `loop-builder`。

典型任务：

- 把 CI 修复做成 Codex Loop。
- 把公众号专题做成内容生产 Loop。
- 把“按视觉稿复刻 UI”生成专用视觉闭环 Skill。
- 把一个可反复运行的任务生成专用 Loop Agent。
- 把一个 Skill 的维护做成验证 Loop。
- 把学习输入做成周期复盘 Loop。
- 把个人项目巡检做成低频维护 Loop。

## 最小入口

用户不需要先填复杂表单，也不需要先懂 Loop。直接用一句自然语言描述任务即可：

```md
帮我复刻这个 UI 视觉稿
```

UI 复刻场景里，如果已经上传图片或给出本地图片路径，这就是足够输入。`loop-builder` 不应该再拦着问页面入口和修改范围，而是把它们作为 Codex 执行 Prompt 里的默认侦察步骤。

`loop-builder` 会先做三件事：

1. 抽取任务目标、输入材料、反馈信号、允许动作、禁止动作。
2. 生成一张任务卡预览；缺失的必需信息全部补问并暂停等待回复，可默认信息最多展示 5 个默认处理方式。
3. 自动判断应该输出可复制 Prompt、Checklist、Human-in-the-Loop、完整 Loop、专用 Agent 还是专用 Skill。

如果没有缺失必需信息，默认先给用户一个能直接拿去给 Codex 使用的产物。只有用户明确说“后续反复用”“跨项目用”“生成 Skill”“全局安装”时，才升级为专用 Skill。

每次输出最后都会自动判断“是否值得做成 Skill”。如果合适，`loop-builder` 会主动问你是否继续生成 Skill 协议草案。

如果推荐产物是专用 Skill，`loop-builder` 会先输出“场景工作流分析”和“Skill 协议草案”，同时给一份过渡 Prompt 让用户可以先完成当前任务。用户确认协议后，再生成 `SKILL.md` 和 `skill.json`。

## 最短入口示例

```md
帮我复刻这个 UI 视觉稿
```

```md
帮我修这个 CI
```

```md
帮我把这个任务做成自动循环
```

## 想要更明确时

```md
帮我复刻这个 UI 视觉稿。

目标图：<图片路径或已附图>
当前页面：<可选，URL / 路由 / 启动命令；不填则让 Codex 在项目内侦察>
要求：先给我可复制给 Codex 的执行 Prompt；如果适合做成 Skill，再给我协议草案。
```

## 输出怎么用

先看“任务卡预览”。如果目标、输入、反馈信号或边界识别错了，先改任务卡。

再看“Loop 适配判断”和“自动产物选择”：

- 如果输出“给 Codex 使用的 Prompt”，先直接复制给 Codex 跑通任务。
- 如果输出 Checklist，先把人工验收标准稳定下来。
- 如果输出 Human-in-the-Loop，按确认节点推进，不要自动执行高风险动作。
- 如果输出完整 Loop，按 Planner、Maker、Checker、Evaluator 顺序运行。
- 如果输出专用 Agent，把 Agent 包放到业务目录，后续反复用它跑。
- 如果输出专用 Skill，再安装到全局 skill 目录跨项目复用。

完整 Loop 的默认运行顺序：

1. 把 `TODO.md` state file 放到项目或专题目录。
2. 让 Planner 做只读侦察。
3. 让 Maker 执行本轮最小任务。
4. 让 Checker 验收。
5. 让 Evaluator 判断继续、停止、回滚或等待人工确认。

业务数据、运行记录和专用规则只更新专用 Agent，不直接更新 `loop-builder`。只有用户确认某条经验具备通用价值，才进入 `loop-builder` 的维护流程。

## 生成专用 Skill 示例

当某类 Loop 会在多个项目反复使用时，可以让 `loop-builder` 生成专用 Skill。不要一开始就生成 Skill，先用 Prompt 跑通真实任务，再升级。

专用 Skill 生成分两步：

1. 先建模具体场景的专业工作流。
2. 再把确认后的工作流写成可安装 Skill。

不要跳过第一步。一个好的专用 Skill 应该减少用户反复解释场景，而不是只把一段 Prompt 包起来。

例子：UI 视觉复刻的最低成本入口。

```md
帮我复刻这个 UI 视觉稿
```

如果用户补充：

```md
这个流程我以后会在多个前端项目反复用，帮我做成可安装 Skill。
```

`loop-builder` 才升级为专用 Skill 路线：先输出场景工作流分析和 Skill 协议草案，确认后再生成并安装到 `~/.codex/skills/<skill-name>`。

即使用户没有补充这句话，`loop-builder` 也会在本轮输出最后判断是否值得 Skill 化；适合时会主动提示。

## 不适合 Loop 时怎么办

`loop-builder` 不应该强行把所有任务做成 Loop。常见退出条件：

- 没有可观察反馈，只能靠主观判断。
- 只需要一次性产出。
- 目标还没想清楚。
- 自动执行会碰到发布、权限、支付、生产配置、数据删除等高风险动作。
- 成本高于收益。

这时应输出更轻方案：一次性 Prompt、上下文清单、人工 Checklist 或只读侦察。

## 默认边界

- 不承诺无人值守。
- 不自动 merge、发布、上架或删除数据。
- 不把 Claude Code、Codex、Cursor、自建 Harness 的能力混写。
- 先手动跑通，再考虑 cron、GitHub Actions 或 Automations。
- 专用 Agent 可以记录候选通用规则，但升级 `loop-builder` 必须由用户确认。
