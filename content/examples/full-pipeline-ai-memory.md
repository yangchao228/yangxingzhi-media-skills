# Full Pipeline Example: AI 记忆能力会改变普通人的工作方式吗

这个样例用于回归验证文昌流水线的阶段边界：路由 -> 采证 -> 起稿 -> 诊文/整章 -> 出刊。

## 0. 用户输入

```md
帮我把“AI 记忆能力会改变普通人的工作方式吗”这个方向做成一篇公众号文章。

账号：AI生命克劳德
长期方向：Human3.0
目标读者：普通 AI 使用者、创作者、工程师
当前没有初稿
```

## 1. 路由判断

- 平台：公众号
- 阶段：已有方向，但缺少事实采证
- 推荐链路：`wenchang-router -> wenchang-research -> wechat-writing-skill-ai-human3 -> wenchang-review -> wenchang-publish-check`
- 为什么：这个题不是单纯工具教程，而是关于个人工作系统变化的判断文。需要先补事实与反向证据，再起稿。

```yaml
content_state:
  project:
    name: 文昌.skill
    account: AI生命克劳德
    long_term_goal: Human3.0
  request:
    raw_intent: 把“AI 记忆能力会改变普通人的工作方式吗”做成公众号文章
    current_stage: 采证
    target_platforms: [公众号]
  audience:
    primary: 普通 AI 使用者、创作者、工程师
    pain_points:
      - 每次和 AI 对话都要重新解释背景
      - 工具很多，但个人上下文没有沉淀
      - 担心记忆功能带来隐私和误用风险
  topic:
    source: 用户给定方向
    core_angle: AI 记忆不是让模型更像人，而是让个人工作系统开始有连续性
    title_candidates:
      - AI 记忆不是功能升级，而是个人工作系统的底层变化
      - 真正改变工作方式的，不是更聪明的 AI，而是会记住上下文的 AI
      - 你以为 AI 记住的是偏好，其实它在重组你的工作流
    selected_title: AI 记忆不是功能升级，而是个人工作系统的底层变化
    why_now: 2025 年以来，ChatGPT、Claude、Gemini 都在把记忆和过往上下文纳入产品能力
    long_term_value: 可沉淀为 Human3.0 中“个人数字生产资料”和“认知主权”的案例
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
  next_step:
    skill: wenchang-research
    reason: 需要先把产品事实、控制边界和风险点采证，再进入起稿
    user_decision_needed: false
  handoff:
    from_stage: 路由
    to_stage: 采证
    accepted_inputs:
      - content_state.project
      - content_state.request
      - content_state.audience
      - content_state.topic
      - 用户给定的真实目标
    ignored_context:
      - 未确认的旧标题
      - 未采证的强结论
      - 和公众号无关的平台设想
    stop_condition: 形成至少 3 条关键事实、1 条反向证据和可信度判断
```

## 2. 采证结论

- 是否足够支撑写作：足够
- 主要原因：主流 AI 产品已经把“保存信息”和“引用过往对话”产品化，但控制权、可见性、适用范围和删除机制仍然是这篇文章必须保留的反向证据。

## 来源清单

1. OpenAI Help Center: [Memory FAQ](https://help.openai.com/en/articles/8590148-memory-in-chatgpt-faq)。可用于说明 ChatGPT 记忆分为 saved memories 与 reference chat history，以及用户控制、删除和来源展示。
2. OpenAI Blog: [Memory and new controls for ChatGPT](https://openai.com/blog/memory-and-new-controls-for-chatgpt)。可用于说明 2025-04-10 更新后，ChatGPT memory 更全面，会引用过往对话。
3. Anthropic: [Claude introduces memory for teams at work](https://www.anthropic.com/news/memory?from_blog=true)。可用于说明 Claude 在 Team 和 Enterprise 场景推出 memory，重点是工作上下文与偏好。
4. Google Help: [Save info and reference past chats in Gemini Apps](https://support.google.com/gemini/answer/15637730?hl=en-IN&ref_topic=13194540)。可用于说明 Gemini 的 saved info 和 past chats 机制，以及适用账号和计划限制。
5. Anthropic: [Introducing Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5?s=05)。可用于说明更长程 agent 工作开始依赖 context editing 和 memory tool。

## 关键事实

- ChatGPT memory 至少包含两类：用户明确或自动保存的 saved memories，以及从历史对话中提取有用信息的 reference chat history。来源：OpenAI Help Center。
- OpenAI 在 2025-04-10 更新中说明，ChatGPT memory 变得更全面，除 saved memories 外，还会引用过往对话来生成更相关的回答。来源：OpenAI Blog。
- Claude 在 2025-09-11 面向 Team 和 Enterprise 用户推出 memory，定位是记住团队项目、偏好和工作模式，减少重复解释上下文。来源：Anthropic。
- Gemini 支持 Saved info，也支持在特定条件下引用 past chats；但 past chats 需要个人 Google Account 和 Google AI Pro 或 Ultra。来源：Google Help。
- Anthropic 在 Claude Sonnet 4.5 公告中提到，API 中的 context editing 和 memory tool 用于让 agents 运行更久、处理更复杂任务。来源：Anthropic。

## 反向数据 / 限制条件

- 记忆不是“无限准确的个人大脑”。OpenAI Help Center 明确说 reference chat history 不会保留每个细节，重要信息仍应使用 saved memories。
- 记忆带来控制成本。OpenAI Help Center 说明，要完全删除某些被用于个性化的信息，可能需要同时处理 saved memories、原始聊天、文件库和连接应用。
- 不同产品的记忆能力存在计划和账号限制。Gemini 的 past chats 需要 Google AI Pro 或 Ultra，Claude memory 首发面向 Team 和 Enterprise。

## 可引用句子

> AI 记忆真正改变的不是模型回答，而是人和系统之间的连续性。

## 矛盾点

- 产品都强调“用户可控”，但删除、关闭、来源展示和实际引用范围并不完全等价。文章不能把“可控”写成零成本控制。

```yaml
content_state:
  research:
    sources:
      - OpenAI Help Center Memory FAQ
      - OpenAI Blog Memory and new controls for ChatGPT
      - Anthropic Claude introduces memory for teams at work
      - Google Gemini Apps Help Save info and reference past chats
      - Anthropic Introducing Claude Sonnet 4.5
    key_facts:
      - ChatGPT memory 包含 saved memories 与 reference chat history
      - 2025-04-10 后 ChatGPT memory 更全面，会引用过往对话
      - Claude memory 面向 Team 和 Enterprise，强调工作上下文
      - Gemini saved info 与 past chats 有账号和计划限制
      - Claude API 的 memory tool 支持更长程 agent 工作
    contrarian_points:
      - 记忆不会保留每个细节
      - 完全删除个性化信息可能需要处理多处来源
      - 不同产品的能力存在计划和账号限制
    usable_quotes:
      - AI 记忆真正改变的不是模型回答，而是人和系统之间的连续性。
    contradictions:
      - 产品可控性与实际删除、关闭、来源展示之间存在操作复杂度
    confidence: High
  next_step:
    skill: wechat-writing-skill-ai-human3
    reason: 研究包已足够支撑一篇公众号判断文
    user_decision_needed: false
  handoff:
    from_stage: 采证
    to_stage: 起稿
    accepted_inputs:
      - content_state.topic
      - content_state.audience
      - content_state.research
      - 用户给定的 Human3.0 长期方向
    ignored_context:
      - 没有来源的“AI 会越来越懂我们”式泛化表达
      - 把 memory 写成纯产品功能教程的角度
      - 未确认的夸张效率数字
    stop_condition: 输出公众号初稿，不做最终发布判断
```

## 3. 起稿输出

# AI 记忆不是功能升级，而是个人工作系统的底层变化

真正改变工作方式的，不是更聪明的 AI，而是会记住上下文的 AI。

过去我们使用 AI，像是在反复雇佣一个临时工。

每次打开新对话，你都要重新解释自己是谁、在做什么、项目到了哪一步、你喜欢什么风格、哪些方向已经被否掉、哪些文件值得参考。AI 很聪明，但它没有连续性。你像一个不断搬运背景材料的人，把同一段上下文从一个窗口复制到另一个窗口。

这也是很多人用 AI 越久，越觉得累的原因。

不是模型不强，而是你的工作系统没有被它记住。

2025 年以后，这件事开始变了。

OpenAI 的 ChatGPT memory 已经不只是保存几条偏好。官方文档里，它被拆成两类：一类是 saved memories，也就是用户明确或系统自动保存的重要信息；另一类是 reference chat history，也就是从历史对话中提取有用上下文。OpenAI 在 2025 年 4 月的更新中还明确说，ChatGPT memory 变得更全面，会引用过往对话，让回答更贴近用户。

Anthropic 也在 Claude 里推出了面向 Team 和 Enterprise 的 memory。它强调的不是闲聊偏好，而是工作场景里的项目、习惯和团队上下文。Google Gemini 也有 Saved info 和引用 past chats 的机制，只是能力会受到账号和计划限制。

这些变化放在一起看，说明 AI 产品正在从“单次问答工具”变成“连续工作环境”。

这对普通人意味着什么？

第一，你不再只是积累提示词，而是在积累上下文资产。

过去很多人把 AI 提效理解成“写一个更好的 prompt”。但 prompt 是一次性的。真正长期有价值的，是 AI 能不能知道你的目标、项目、风格、资料、偏好和判断边界。

比如一个创作者，如果 AI 记得你的账号定位、读者画像、长期栏目、标题风格和已经写过的选题，你下一次让它做选题，它就不再是从零开始猜。它会沿着你的系统继续工作。

一个工程师，如果 AI 记得项目结构、常见错误、代码风格和你不想碰的生产敏感配置，它就不只是代码助手，而更像一个项目协作者。

一个家庭用户，如果 AI 记得孩子课表、家庭约束、长期培养目标和每周执行偏差，它就不只是临时回答问题，而开始变成家庭工作台的一部分。

这就是 Human3.0 里很重要的一点：数字生产资料不只是文件、笔记和代码，也包括可复用的上下文。

第二，记忆会让工作流从“人搬运材料”变成“人校准系统”。

没有记忆时，人做的是重复解释。

你要告诉 AI：我是谁，我在写什么，我不喜欢什么，我之前试过什么。这些信息本来应该沉淀在系统里，却被迫留在人的脑子里。于是你每次开新对话，都在做低价值搬运。

有记忆后，人的角色会发生变化。

你不再每次从零喂背景，而是检查系统记住得对不对、哪些应该强化、哪些应该删除、哪些不能让 AI 记住。

这听起来只是交互变化，本质上是工作结构变化。

过去你管理的是一次对话。以后你管理的是一套长期上下文。

第三，记忆能力越强，人的判断权越重要。

这是这件事最容易被忽略的部分。

AI 记住你，并不自动等于它更懂你。记忆也可能过期、偏差、混入旧判断，甚至把你已经放弃的方向继续当成偏好。OpenAI 的帮助文档也提醒，reference chat history 不会保留每个细节。如果你想让某些信息长期保持在前台，仍然需要使用 saved memories。

控制成本也是真实存在的。要完全删除某些可能用于个性化的信息，可能不只是删一条 memory，还要处理原始聊天、文件库和连接应用。

所以，AI 记忆不是可以无脑打开的效率按钮。它更像一个新的个人系统层。

你要决定三件事。

什么应该被记住。

什么应该被临时使用。

什么绝不能交给系统长期保存。

这就是认知主权。

真正成熟的 AI 使用者，不是把所有记忆都交给模型，而是开始设计自己的记忆边界。

对普通人来说，最实用的做法不是追每一个新功能，而是建立一份自己的“AI 工作档案”。

里面可以包括：

- 你的长期目标。
- 你的项目清单。
- 你的写作风格。
- 你的读者画像。
- 你的常用判断原则。
- 你不希望 AI 代替你做的决定。

这些东西可以放在 ChatGPT memory、Claude Project、本地知识库、Markdown 文件或自己的工作流里。工具不是关键。关键是你开始把上下文当资产管理。

AI 记忆真正改变的不是模型回答，而是人和系统之间的连续性。

以前，AI 每次都像第一次见你。

以后，AI 会带着过去的你进入下一次工作。

问题也随之改变。

你不再只是问：“这个模型能帮我做什么？”

你要开始问：“我希望它记住我什么？又不该记住我什么？”

能回答这个问题的人，才会真正拥有自己的 AI 工作系统。

```yaml
content_state:
  draft:
    status: first_draft
    file: content/examples/full-pipeline-ai-memory.md
    summary: 围绕 AI 记忆能力与个人工作系统连续性完成公众号初稿
  next_step:
    skill: wenchang-review
    reason: 初稿方向成立，但需要删减重复段落、强化结尾和发布适配
    user_decision_needed: false
  handoff:
    from_stage: 起稿
    to_stage: 诊文
    accepted_inputs:
      - 当前正式草稿
      - content_state.topic
      - content_state.research
      - content_state.distribution
    ignored_context:
      - 起稿过程中的未使用标题
      - 未写入正文的推理草稿
      - 夸张效率承诺
    stop_condition: 输出诊断结论或整章编辑版本
```

## 4. 诊文结论

- 建议动作：整章编辑后发布前检查
- 主要原因：主题和事实链成立，但初稿中有几处概念重复，结尾可以更短、更有传播性。

## 核心问题

1. “连续性”和“上下文资产”出现多次，部分段落可以合并。
2. 事实采证已经够用，但正文里来源提示偏集中，后半段更像观点文。
3. 结尾三连问有效，但最后一句还可以更利落。

## 最小修改建议

1. 开头保留临时工比喻，但删掉重复解释背景的长句。
2. 三个分论点保留，分别压成“上下文资产、工作流角色变化、判断权边界”。
3. 结尾收束到“管理记忆边界”，不要再扩展新概念。

```yaml
content_state:
  diagnosis:
    recommendation: 整章编辑后进入出刊检查
    key_issues:
      - 概念重复
      - 后半段证据密度下降
      - 结尾还不够利落
    minimum_fixes:
      - 合并重复段落
      - 保留三段式论证
      - 重写最后一句
  next_step:
    skill: wenchang-review
    reason: 使用整章模式输出发布前版本
    user_decision_needed: false
  handoff:
    from_stage: 诊文
    to_stage: 整章
    accepted_inputs:
      - 当前正式草稿
      - diagnosis.minimum_fixes
      - research.key_facts
      - research.contrarian_points
    ignored_context:
      - 不再使用的长标题
      - 草稿中重复解释的段落
      - 没有证据的效率承诺
    stop_condition: 形成可进入出刊检查的正文
```

## 5. 整章后正文

# AI 记忆不是功能升级，而是个人工作系统的底层变化

真正改变工作方式的，不是更聪明的 AI，而是会记住上下文的 AI。

过去我们使用 AI，像是在反复雇佣一个临时工。

每次打开新对话，你都要重新解释自己是谁、项目到了哪一步、你喜欢什么风格、哪些方向已经被否掉。AI 很聪明，但没有连续性。于是你变成了上下文搬运工。

这也是很多人用 AI 越久，越觉得累的原因。

不是模型不强，而是你的工作系统没有被它记住。

2025 年以后，这件事开始变了。

OpenAI 的 ChatGPT memory 已经不只是保存几条偏好。官方文档里，它分为 saved memories 和 reference chat history。前者保存重要信息，后者从过往对话里提取有用上下文。OpenAI 在 2025 年 4 月的更新中还说明，ChatGPT memory 变得更全面，会引用过往对话，让回答更贴近用户。

Anthropic 也在 Claude 里推出了面向 Team 和 Enterprise 的 memory，重点是团队项目、偏好和工作模式。Google Gemini 也支持 Saved info 和引用 past chats，只是能力会受到账号和计划限制。

这些变化放在一起看，说明 AI 产品正在从“单次问答工具”变成“连续工作环境”。

这对普通人至少有三层影响。

第一，你积累的不再只是提示词，而是上下文资产。

过去很多人把 AI 提效理解成“写一个更好的 prompt”。但 prompt 往往是一次性的。真正长期有价值的，是 AI 能不能知道你的目标、项目、风格、资料、偏好和判断边界。

一个创作者，如果 AI 记得你的账号定位、读者画像、长期栏目和已经写过的选题，它下次做选题时就不是从零开始猜。

一个工程师，如果 AI 记得项目结构、代码风格和你不想碰的生产敏感配置，它就不只是代码助手，而更像一个项目协作者。

一个家庭用户，如果 AI 记得孩子课表、家庭约束和长期培养目标，它就开始变成家庭工作台的一部分。

这就是 Human3.0 里很重要的一点：数字生产资料不只是文件、笔记和代码，也包括可复用的上下文。

第二，人的工作会从“搬运材料”变成“校准系统”。

没有记忆时，人做的是重复解释。你要告诉 AI：我是谁，我在写什么，我不喜欢什么，我之前试过什么。

有记忆后，人的角色会变化。你要检查系统记住得对不对，哪些应该强化，哪些应该删除，哪些不能让 AI 长期保存。

这不是交互细节，而是工作结构变化。

过去你管理的是一次对话。以后你管理的是一套长期上下文。

第三，记忆能力越强，人的判断权越重要。

AI 记住你，并不自动等于它更懂你。记忆可能过期，可能有偏差，也可能把你已经放弃的方向继续当成偏好。

OpenAI 的帮助文档也提醒，reference chat history 不会保留每个细节。如果你想让某些信息长期保持在前台，仍然需要使用 saved memories。

控制成本也真实存在。要完全删除某些可能用于个性化的信息，可能不只是删一条 memory，还要处理原始聊天、文件库和连接应用。

所以，AI 记忆不是无脑打开的效率按钮。它更像一个新的个人系统层。

你要决定三件事：

- 什么应该被记住。
- 什么只适合临时使用。
- 什么绝不能交给系统长期保存。

这就是认知主权。

对普通人来说，最实用的做法不是追每一个新功能，而是建立一份自己的“AI 工作档案”。

它可以包括你的长期目标、项目清单、写作风格、读者画像、常用判断原则，以及你不希望 AI 代替你做的决定。

这些内容可以放在 ChatGPT memory、Claude Project、本地知识库、Markdown 文件或自己的工作流里。工具不是关键。关键是你开始把上下文当资产管理。

AI 记忆真正改变的不是模型回答，而是人和系统之间的连续性。

以前，AI 每次都像第一次见你。

以后，AI 会带着过去的你进入下一次工作。

你真正要管理的，不是 AI 记住了多少，而是哪些记忆有资格进入你的系统。

## 修改日志

1. 删除重复解释“连续性”的段落，避免概念空转。
2. 保留产品事实，但把来源段落压缩到文章前半部分。
3. 把三个分论点压成上下文资产、校准系统、判断边界。
4. 删除“模型更懂你”的泛化表达，改成记忆可能过期和偏差。
5. 重写最后一句，让文章收束到“记忆边界管理”。

## 最强一句

你真正要管理的，不是 AI 记住了多少，而是哪些记忆有资格进入你的系统。

```yaml
content_state:
  draft:
    status: edited
    file: content/examples/full-pipeline-ai-memory.md
    summary: 已完成整章编辑，可进入出刊检查
  diagnosis:
    recommendation: 进入出刊检查
    key_issues:
      - 原稿重复段落已压缩
      - 结尾已强化
    minimum_fixes: []
  next_step:
    skill: wenchang-publish-check
    reason: 正文已经稳定，需要补标题、摘要、标签、转发文案和归档建议
    user_decision_needed: false
  handoff:
    from_stage: 整章
    to_stage: 出刊
    accepted_inputs:
      - 编辑后正文
      - content_state.diagnosis
      - content_state.distribution
    ignored_context:
      - 初稿中已删除的重复段落
      - 不再采用的标题备选
      - 采证阶段未使用的来源摘要
    stop_condition: 输出发布前检查包，不替用户点击发布
```

## 6. 出刊检查

## 发布结论

- 建议：补齐后发布
- 阻塞项：缺封面图、正文配图、最终标题确认

## 必补项

- [ ] 确认最终标题。
- [ ] 补一张公众号封面图。
- [ ] 若正文插图使用本地图片，发布前走 `md-img-r2` 上传公开 URL。

## 建议优化

- 标题可以保留判断感，不要写成“AI 记忆功能教程”。
- 摘要要突出读者收益：普通人应该管理 AI 记忆边界。
- 小红书二次分发可以拆成 7 页卡片：痛点、产品变化、上下文资产、校准系统、风险、AI 工作档案、行动建议。

## 平台发布包

- 标题：AI 记忆不是功能升级，而是个人工作系统的底层变化
- 摘要/导语：AI 记住你的偏好只是表层。真正重要的是，普通人开始拥有一套可复用的长期上下文系统。
- 标签/话题：AI工具、Human3.0、认知主权、个人知识库、数字生产资料
- 转发文案：以前我们用 AI，总是在重复解释自己。现在真正值得管理的，是哪些记忆有资格进入你的工作系统。
- 评论区引导：你希望 AI 长期记住你什么？又有哪些信息绝不能交给它保存？

## 归档建议

- 是否建议进入 Human3.0 成书审查：建议
- 建议沉淀为：个人数字生产资料 / 认知主权 / AI 工作系统案例

```yaml
content_state:
  publish_assets:
    title: AI 记忆不是功能升级，而是个人工作系统的底层变化
    summary: AI 记住你的偏好只是表层。真正重要的是，普通人开始拥有一套可复用的长期上下文系统。
    cover_text: AI 记忆正在重写个人工作系统
    tags: [AI工具, Human3.0, 认知主权, 个人知识库, 数字生产资料]
    images: []
    share_copy: 以前我们用 AI，总是在重复解释自己。现在真正值得管理的，是哪些记忆有资格进入你的工作系统。
    comment_prompt: 你希望 AI 长期记住你什么？又有哪些信息绝不能交给它保存？
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
    card_skill: long-to-cards
    image_skill: xiaohongshu-viral-image-skill-v4
  archive:
    should_review_for_book: true
    material_type: 案例/方法论
    suggested_bucket: Human3.0/认知主权/个人数字生产资料
  next_step:
    skill: human3-book-guardian-v6
    reason: 文章服务 Human3.0 主线，适合判断是否入书或进入素材库
    user_decision_needed: true
  handoff:
    from_stage: 出刊
    to_stage: 归档
    accepted_inputs:
      - 编辑后正文
      - publish_assets
      - archive
      - 用户最终发布判断
    ignored_context:
      - 发布前已判定不使用的标题
      - 初稿中已删除的段落
      - 未上传的本地图片占位
    stop_condition: 只给归档建议，不替用户入库
```

## 7. 回归观察

- `handoff` 有效阻止了起稿阶段继续沿用未采证的泛化表达。
- `wenchang-research` 是必要环节，否则这篇会退化成“AI 越来越懂你”的空泛观点。
- `wenchang-review` 的整章模式比单纯诊断更实用，能直接产出进入出刊检查的版本。
- 出刊阶段没有重写正文，只补发布资产和阻塞项，边界符合预期。
- 下一步可把本样例拆成各 skill 的独立输入输出，用于更细粒度回归。
