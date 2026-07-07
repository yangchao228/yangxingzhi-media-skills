# loop-builder Intake Router 升级验证

日期：2026-07-06

## 背景

用户反馈：如果 `loop-builder` 仍然要求普通用户填写“任务目标、输入材料、成功标准、反馈信号、允许动作、禁止动作、人工确认节点、输出档位”，使用门槛仍然偏高。

更合理的流程应该是：

```text
用户自然语言描述任务
-> loop-builder 自动生成补问
-> 用户确认任务卡
-> 判断是否适合 Loop
-> 自动选择 Loop 策略和产物
-> 生成 Prompt / Checklist / Loop / Agent / Skill
```

## 本次改动

- `SKILL.md` 增加 Intake 抽取、任务卡确认、自动产物选择。
- `quick-start.md` 从“复制模板填 5 个字段”改为“一句话入口”。
- `templates/input-template.md` 从用户填写表改为系统生成任务卡模板。
- `skill.json` 更新为 Intake Router 定位。

## 验证用例

### 用例 1：UI 视觉复刻

用户输入：

```md
我想用 Codex 复刻指定 UI 视觉稿，每次来回改很多轮还是不像。
```

期望行为：

- 自动识别为 UI 视觉复刻场景。
- 缺失必需信息补问：
  1. 目标视觉稿在哪里？
  2. 当前页面如何打开？
  3. 允许修改哪些文件？
- 判断为“适合完整 Loop”。
- 推荐主模式：Plan-Execute-Verify。
- 如果用户需要跨项目复用，推荐生成 `ui-visual-match-loop` 专用 Skill。

### 用例 2：公众号数据复盘

用户输入：

```md
我想复盘最近 5 篇公众号数据，看看下一篇该写什么。
```

期望行为：

- 自动识别为内容数据复盘。
- 判断为“适合 Loop-ready / Human-in-the-Loop”，不强行称为完整 Loop。
- 说明原因：反馈信号存在，但发布决策和选题判断需要人工确认。
- 推荐产物：复盘 Checklist 或专用 Loop Agent 包，而不是自动修复循环。

### 用例 3：一次性改写文案

用户输入：

```md
帮我把这段文案改得更短一点。
```

期望行为：

- 判断为“暂不适合 Loop”。
- 推荐一次性 Prompt 或直接改写。
- 不生成 TODO.md、Agent 包或专用 Skill。

## 通过标准

- 不要求用户先填复杂表。
- 不要求用户先选择输出档位。
- 能明确区分 Prompt、Checklist、Human-in-the-Loop、完整 Loop、专用 Agent、专用 Skill。
- 没有反馈信号时，不进入自动修复循环。
- 生成专用 Agent 或 Skill 前，必须有用户确认或明确要求。
