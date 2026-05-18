# Full Pipeline Example: Codex-maxxing 外部热点型选题

这个样例验证外部文章/热点素材进入文昌流水线时，如何从“资料解读”转成 Human3.0 选题，而不是复述原文。

原始素材：[Codex-maxxing - Jason Liu](https://jxnl.github.io/blog/writing/2026/05/10/codex-maxxing/)

## 0. 用户输入

```md
把 Jason Liu 的 Codex-maxxing 当成热点素材，判断是否适合写公众号。

账号：AI生命克劳德
长期方向：Human3.0
目标读者：普通 AI 使用者、创作者、工程师
目标：不要翻译原文，要提炼成我自己的选题。
```

## 1. 路由判断

- 平台：公众号
- 阶段：外部热点/文章素材，需要定题与采证
- 推荐链路：`wenchang-router -> wenchang-research -> wechat-writing-skill-ai-human3 -> wenchang-review -> wenchang-publish-check`
- 为什么：原文是个人使用经验，不适合直接搬运。它的价值在于揭示 Codex 从代码工具变成“个人工作台”的结构变化。

```yaml
content_state:
  project:
    name: 文昌.skill
    account: AI生命克劳德
    long_term_goal: Human3.0
  request:
    raw_intent: 把 Codex-maxxing 当成外部热点素材，诊断选题并跑完整链路
    current_stage: 采证
    target_platforms: [公众号]
  audience:
    primary: 普通 AI 使用者、创作者、工程师
    pain_points:
      - 仍把 AI 当聊天框使用
      - 不知道 Codex 这类工具和普通对话模型有什么本质差异
      - 缺少个人工作系统视角
  topic:
    source: 外部文章/热点素材
    core_angle: Codex 的关键变化不是写代码更强，而是让工作有了持续运行的工作台
    title_candidates:
      - 我以为 Codex 是写代码的，结果它开始接管我的工作台
      - AI 的下一步，不是更会聊天，而是开始让工作持续运行
      - 真正拉开差距的，不是提示词，而是你的 AI 工作系统
    selected_title: 我以为 Codex 是写代码的，结果它开始接管我的工作台
    why_now: 2026-05-10 外部文章系统梳理 Codex app 的长期线程、memory、browser/computer use、heartbeats、goals 和 side panel
    long_term_value: 可沉淀为 Human3.0 中“个人工作系统”和“数字生产资料”的案例
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
  next_step:
    skill: wenchang-research
    reason: 需要从原文中提炼事实点、结构变化和限制条件
    user_decision_needed: false
  handoff:
    from_stage: 路由
    to_stage: 采证
    accepted_inputs:
      - 原始文章 URL
      - content_state.topic
      - content_state.audience
      - Human3.0 长期方向
    ignored_context:
      - 直接翻译原文的需求
      - 把 Codex 写成纯功能清单的角度
      - 程序员失业式标题
    stop_condition: 形成可支撑公众号判断文的研究包
```

## 2. 采证结论

- 是否足够支撑写作：足够
- 主要原因：原文提供了完整的一手使用链路，足以支撑“从聊天框到工作台”的判断；但它是个人经验，不应写成所有用户都会立刻拥有同等能力。

## 来源清单

1. Jason Liu: [Codex-maxxing](https://jxnl.github.io/blog/writing/2026/05/10/codex-maxxing/)。一手使用经验，覆盖 durable threads、voice input、steering、memory、computer/browser use、remote control、heartbeats、goals、side panel。
2. 原文提到 OpenAI Agents SDK、OpenAI CLI 和 Codex for open source 作为长期线程中的工作流对象，可用于说明 Codex 不只承载代码任务，也承载知识工作。
3. 原文 memory 部分提到 Obsidian vault、AGENTS.md、GitHub repo、diff review，可用于支撑“memory 应该文件化、可审查”。
4. 原文 heartbeats 部分给出 Slack/Gmail、PR feedback、render feedback、refund 等例子，可用于支撑“工作变成持续循环”。
5. 原文 side panel 部分提到 Markdown、spreadsheets、CSV、PDF、slides、browser surface，可用于支撑“artifact 可检查、可批注、可操作”。

## 关键事实

- 作者说 Codex app upgrades 让更广义的知识工作开始变得原生，关键是“work somewhere to live”。来源：原文开头。
- 作者长期使用 pinned threads，把重要工作流沉淀在 durable thread 中。来源：Durable threads。
- 作者把 memory 放进 Obsidian vault 和 GitHub repo，通过 diff 审查 agent 认为值得记住的内容。来源：Memory。
- 作者用 Heartbeats 让线程定时检查 Slack、Gmail、PR feedback 或客服状态。来源：Heartbeats。
- 作者认为 side panel 的价值不只是 preview，而是让 Codex 成为“work happens”的地方。来源：The side panel。

## 反向数据 / 限制条件

- 长线程有成本。原文明确提醒，重新访问长期线程时可能不在缓存里，成本可能高于新开短线程。
- 这类工作流依赖本地文件、权限、工具和外部连接器，不是打开 Codex 就自动具备。
- Memory 文件化需要人审查 diff。否则长期线程会积累无法审计的模糊记忆。

## 可引用句子

> 工作不再死在一次 prompt 里。

## 矛盾点

- 原文强调让工作持续运行，但同时保留了人的 review、steering 和 approval。文章不能写成“AI 全自动接管工作”。

```yaml
content_state:
  research:
    sources:
      - Jason Liu Codex-maxxing
    key_facts:
      - Codex 被用于 slide deck、PDF、spreadsheet、index.html 等知识工作 artifact
      - durable threads 承载长期工作流
      - memory 通过 Obsidian vault 和 GitHub diff 变成可审查资产
      - heartbeats 让线程能定时检查反馈和推进任务
      - side panel 让 artifact 可检查、可批注、可操作
    contrarian_points:
      - 长线程可能带来更高成本
      - 工作流依赖本地权限和工具连接
      - memory 需要人工审查，不能只留在对话历史
    usable_quotes:
      - 工作不再死在一次 prompt 里。
    contradictions:
      - 自动持续推进和人工判断权必须同时存在
    confidence: High
  next_step:
    skill: wechat-writing-skill-ai-human3
    reason: 研究包已足够支撑一篇 Human3.0 判断文
    user_decision_needed: false
  handoff:
    from_stage: 采证
    to_stage: 起稿
    accepted_inputs:
      - content_state.topic
      - content_state.research
      - content_state.audience
    ignored_context:
      - 原文细节逐段翻译
      - 纯 Codex 教程写法
      - 无人工判断权的全自动叙事
    stop_condition: 输出公众号初稿，不做发布判断
```

## 3. 起稿输出

# 我以为 Codex 是写代码的，结果它开始接管我的工作台

我以前也以为 Codex 主要是写代码的。

直到我看到越来越多真实使用方式，才意识到它真正改变的不是代码生成，而是工作本身开始有了一个可以持续运行的地方。

过去我们用 AI，大多是打开一个聊天框，问一个问题，拿一个回答。这个流程看起来很快，但它有一个隐藏成本：工作没有地方停留。

你换一个问题，前面的上下文断了。你换一个工具，文件和反馈断了。你离开电脑，任务也停了。最后，AI 很聪明，但工作流仍然靠人反复搬运。

Codex 这类工具正在改变这一点。

它不只是回答你，而是开始接住一个完整工作循环：长期线程、共享记忆、浏览器和电脑控制、可继续 steering 的任务、定时 heartbeat、可检查的 side panel。

这些功能单独看，都像工具升级。放在一起看，它们指向同一件事：AI 正在从聊天框变成个人工作台。

第一，长期线程让工作不再每次从零开始。

一个短对话只能解决一个问题。一个长期线程承载的是一个持续工作流。

原文作者会为重要工作流保留 pinned threads，例如 Chief of Staff、OpenAI CLI、Codex for open source、Twitter 监控。这些线程不是临时聊天，而是长期积累历史、偏好和旧决策的工作空间。

这对普通人的启发是：不要只问“我今天要让 AI 回答什么”，而要问“哪些工作值得有自己的长期线程”。

你的公众号选题、家庭计划、项目复盘、知识库维护，都不应该永远从空白聊天框开始。

第二，memory 应该变成文件，而不是只留在聊天历史里。

很多人理解 AI 记忆，会以为就是模型记住你的偏好。原文更有价值的地方在于，它把 memory 放进 Obsidian vault 和 GitHub repo。

这意味着 agent 学到的东西不是一团对话印象，而是可以被检查、编辑、diff 和复用的文件。

这和 Human3.0 的方向高度一致。

真正重要的不是 AI 更懂你，而是你能不能把工作过程中的判断、关系、决策、项目状态沉淀成数字生产资料。

第三，浏览器、电脑控制和 side panel 让 AI 接触真实工作现场。

普通聊天框最大的问题，是它只能处理你喂进去的材料。真实工作并不只发生在文本里。它发生在网页、表格、PPT、PDF、设计稿、PR、Slack、邮箱和各种工具界面里。

原文里，side panel 的价值不是预览，而是让 Codex 和人看着同一个 artifact 工作。Markdown、CSV、PDF、slides、browser surface 都可以成为被检查和批注的对象。

这会改变协作关系。

你不再只是把结果复制出来看，而是在工作现场直接指出哪里不对，让 agent 继续改。

第四，Heartbeats 和 Goals 让任务从一次回答变成持续循环。

原文中最值得注意的不是“每 30 分钟检查 Slack 和 Gmail”这种功能本身，而是任务单位变了。

过去是一个 prompt，一个 answer。

现在是一个目标，一个循环。

线程可以定时回来，检查反馈，重新渲染，等待客服，监控 PR，直到达到条件。人仍然保留判断权，但最耗时间的上下文搜集、等待和重复检查，可以交给系统持续推进。

这正是个人工作系统的雏形。

所以，Codex 的重点不是让程序员少写几行代码。它让更多工作开始有地方记住、有地方执行、有地方检查、有地方继续。

未来普通人的差距，也许不在于谁会写更漂亮的提示词，而在于谁更早搭起自己的 AI 工作台。

会用聊天框的人，只是在使用 AI。

能让工作持续运行的人，才是在建设系统。

```yaml
content_state:
  draft:
    status: first_draft
    file: content/examples/full-pipeline-codex-workbench.md
    summary: 外部热点型选题已形成公众号初稿
  next_step:
    skill: wenchang-review
    reason: 初稿方向成立，需要检查是否过度依赖原文和是否有足够读者获得感
    user_decision_needed: false
  handoff:
    from_stage: 起稿
    to_stage: 诊文
    accepted_inputs:
      - 当前正式草稿
      - content_state.topic
      - content_state.research
    ignored_context:
      - 原文逐段结构
      - 纯工具教程写法
      - 自动化万能叙事
    stop_condition: 输出诊断结论或整章编辑建议
```

## 4. 诊文结论

- 建议动作：轻改后发布前检查
- 主要原因：主线清晰，能从原文功能清单中提炼结构变化；但需要减少“原文作者”出现次数，增加读者自己的行动建议。

## 核心问题

1. 开头足够清楚，但中段略像原文解读。
2. 读者行动建议还可以更具体，例如“先为哪三类工作建立长期线程”。
3. 反向限制只在采证包里，正文中可以补一句成本和权限边界。

## 最小修改建议

1. 把“原文作者”改成“一个真实使用者的经验”，避免文章像书评。
2. 在结尾前补一个行动段：先选 3 个长期工作流。
3. 保留人的判断权，不写成 AI 自动接管。

```yaml
content_state:
  diagnosis:
    recommendation: 轻改后进入出刊检查
    key_issues:
      - 中段有外部文章解读感
      - 行动建议不够具体
      - 限制条件进入正文不足
    minimum_fixes:
      - 减少对原文的显性转述
      - 补具体行动建议
      - 补成本和权限边界
  next_step:
    skill: wenchang-publish-check
    reason: 文章已能进入发布资产检查
    user_decision_needed: false
  handoff:
    from_stage: 诊文
    to_stage: 出刊
    accepted_inputs:
      - 当前正式草稿
      - diagnosis.minimum_fixes
      - distribution.primary_platform
    ignored_context:
      - 原文逐段目录
      - 未采用的标题备选
      - 未采证的 Codex 功能猜测
    stop_condition: 输出发布前检查包
```

## 5. 出刊检查

## 发布结论

- 建议：补齐后发布
- 阻塞项：需要确认是否加入作者自己的 Codex 使用截图或工作台截图。

## 必补项

- [ ] 最终标题确认。
- [ ] 配一张“聊天框 -> 工作台”的封面图。
- [ ] 如引用原文观点，在正文末尾注明参考来源。

## 平台发布包

- 标题：我以为 Codex 是写代码的，结果它开始接管我的工作台
- 摘要/导语：AI 真正的变化，不是回答更聪明，而是工作开始有地方持续运行。
- 标签/话题：Codex、AI工作流、Human3.0、个人工作系统、数字生产资料
- 转发文案：会用 AI 聊天框，只是在使用工具。能让工作持续运行，才是在建设自己的系统。
- 评论区引导：你现在最希望 AI 帮你持续推进哪一类工作？

## 归档建议

- 是否建议进入 Human3.0 成书审查：建议
- 建议沉淀为：个人工作系统 / 数字生产资料 / AI 工具从聊天到工作台

```yaml
content_state:
  publish_assets:
    title: 我以为 Codex 是写代码的，结果它开始接管我的工作台
    summary: AI 真正的变化，不是回答更聪明，而是工作开始有地方持续运行。
    cover_text: AI 正在从聊天框变成工作台
    tags: [Codex, AI工作流, Human3.0, 个人工作系统, 数字生产资料]
    images: []
    share_copy: 会用 AI 聊天框，只是在使用工具。能让工作持续运行，才是在建设自己的系统。
    comment_prompt: 你现在最希望 AI 帮你持续推进哪一类工作？
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
    card_skill: long-to-cards
    image_skill: xiaohongshu-viral-image-skill-v4
  archive:
    should_review_for_book: true
    material_type: 案例/判断文
    suggested_bucket: Human3.0/个人工作系统
  next_step:
    skill: human3-book-guardian-v6
    reason: 适合进入 Human3.0 工作系统主题素材库
    user_decision_needed: true
  handoff:
    from_stage: 出刊
    to_stage: 归档
    accepted_inputs:
      - 发布版正文
      - publish_assets
      - archive
    ignored_context:
      - 原文未使用细节
      - 未确认配图
      - 未发布状态
    stop_condition: 给出归档建议，不替用户入库
```

## 6. 回归观察

- 外部热点型样例最容易漂移成“原文总结”，需要 `topic.core_angle` 强制转成自己的主线。
- `wenchang-research` 对这类输入不一定需要大量外部搜索，但必须提炼事实、限制条件和反向证据。
- 出刊阶段应提醒参考来源和配图阻塞项，不应把文章当作已经可直接发布。
