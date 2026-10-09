# 《AI 复刻 UI 总是不像？我用 Loop Builder 把它做成了可验证流程》出刊包

## 发布结论

- 建议：可发布。正文已压缩为公众号短长文体量，配图和 GitHub 仓库链接已补齐。
- 阻塞项：无。正文如果要明确写“OpenClaw 作者发推”，需要补推文链接或截图；当前正式稿已弱化为“AI 情报流里的一个思路”，不构成硬阻塞。

## 平台发布包

- 正文源文件：`content/loop engineer从入门到进阶手册/13-AI复刻UI总是不像？我用Loop Builder把它做成了可验证流程-正式稿.md`
- 推荐标题：AI 复刻 UI 总是不像？我用 Loop Builder 把它做成了可验证流程
- 搜索友好标题：AI 复刻 UI 总是不像？用 Loop Builder 搭一个 Visual Match Loop
- 朋友圈传播标题：Codex 复刻视觉稿翻车后，我开始用 Loop 修 UI
- 摘要/导语：我被 AI 复刻 UI 折腾过一轮：页面跑起来了，但打开一看就是不像目标稿。这篇先交代我做的 `loop-builder` 是什么，再用“安心记”首页复刻实战，讲如何把 UI 复刻变成 Visual Match Loop：目标图、当前截图、差异清单、修 Top 3、再截图验证。
- 搜一搜摘要：一次真实 UI 复刻踩坑：AI 能把页面做出来，却很难稳定贴近目标稿。这里用“安心记”首页复刻案例，记录如何用 Loop Builder 这个 Agent 工作流脚手架，把 UI 复刻拆成可验证、可停止、可复用的 Visual Match Loop。
- 核心关键词：AI 复刻 UI、Loop Builder、Visual Match Loop、Codex、UI 视觉稿、Agent Loop
- 标签/话题：AI Agent、Loop Engineering、Codex、AI 编程、UI 复刻、个人系统
- 评论区引导：你有没有遇到过“AI 写出来了，但 UI 总是不像”的情况？可以留言你的场景，也可以去 GitHub 试试 `loop-builder`。关注并私信回复【looper】，可免费领取完整版《Loop Engineering 从入门到进阶手册》。

## 标题备选

1. AI 复刻 UI 总是不像？我用 Loop Builder 把它做成了可验证流程
2. Codex 复刻视觉稿翻车后，我开始用 Loop 修 UI
3. 别只让 AI 照图写页面：UI 复刻需要一个 Visual Match Loop
4. 用 Codex 复刻 UI 总差一口气？问题可能出在反馈闭环
5. 我先让 Codex 直接生成 UI，失败后才明白复刻需要 Loop

## 正文配图

- 图 1：`content/loop engineer从入门到进阶手册/13-ui-visual-match-assets/01-target-vs-first-version.png`
  - 用途：目标图 vs 第一版实现。
  - 插入位置：开头承诺之后。
  - 说明：页面能跑，但日期卡片、字重和整体质感明显偏离。

- 图 2：`content/loop engineer从入门到进阶手册/13-ui-visual-match-assets/02-date-card-fixed.png`
  - 用途：日期卡片修正后对比。
  - 插入位置：真实实战小节中“第二轮改善动作”之后。
  - 说明：选中态恢复“星期三、21、小圆点”的三层结构。

- 图 3：`content/loop engineer从入门到进阶手册/13-ui-visual-match-assets/03-final-target-vs-current.png`
  - 用途：最终目标图 vs 当前实现全屏对比。
  - 插入位置：真实实战小节末尾。
  - 说明：剩余差异进入人工审美判断区。

## 朋友圈文案

版本 1：

我被 AI 复刻 UI 折腾过一轮：页面做出来了，但就是不像。

这篇写一个真实卡点：先让 Codex 直接生成 UI，效果不稳；后来用 imgGen 生成视觉稿，再让 Codex 复刻，还是会在细节上反复拉扯。

我把这次过程改成了 Visual Match Loop：目标图 -> 截图 -> 差异清单 -> 修 Top 3 -> 再截图。

里面有判断标准、loop-builder 工作流和一套可照着跑的最小操作流程。

版本 2：

AI 写页面不难，难的是照着视觉稿稳定还原。

这次的路径是：先用 Codex + 提示词直接生成 UI，效果不好；再用 imgGen 生成目标图；最后用 Loop 方式让 Codex 复刻。

文章里放了完整工作流和真实对比图，可以直接改成自己的 UI 复刻流程。

版本 3：

Loop Engineering 实战新篇：这次不讲概念，讲 AI 复刻 UI。

从“还是不像”的反复沟通，到“目标图、截图、差异清单、修 Top 3”的闭环。

如果你也遇到过 Codex / Cursor / Claude Code 复刻页面不稳定，这篇可以收藏。

## 待补素材

- 已补：目标图 vs 第一版实现对比图。
- 已补：日期卡片修正后对比图。
- 已补：最终目标图 vs 当前实现全屏对比图。
- 已补：`loop-builder` GitHub 真实仓库链接。
- 可选补充：loop-builder 输出的工作逻辑确认卡截图。
- 如果要在正文明确写 OpenClaw 作者线索，补对应推文链接或截图。

## 归档建议

- 是否建议进入 Human3.0 成书审查：是。
- 建议沉淀为：Loop Engineering 案例库 / UI 视觉复刻 Loop 案例 / 可复用 Skill 生成素材。
- 已确认的用户决策：默认归档（用户未撤销）。
