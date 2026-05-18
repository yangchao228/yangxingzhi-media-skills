# Full Pipeline Example: 5-Agent 内容流水线已有初稿诊断型选题

这个样例验证“用户已有长初稿/搬运素材”进入文昌流水线时，如何先诊断选题，再重构为符合 Human3.0 的公众号判断文。

## 0. 用户输入

```md
把这篇“5人内容流水线，可替代价值30万美元的创意团队”的长文当成初稿，判断是否适合我写公众号，并跑一遍文昌流程。

核心素材：
- 5 个 agent：strategist、researcher、writer、editor、publisher
- 一个输入串联五个 Markdown 文件
- handoff 模板减少流水线漂移
- 结论是“团队就是文件。打开文件夹。”
```

## 1. 路由判断

- 平台：公众号
- 阶段：已有初稿，需要先诊断选题，而不是直接改写
- 推荐链路：`wenchang-router -> wenchang-review -> wenchang-research -> wechat-writing-skill-ai-human3 -> wenchang-publish-check`
- 为什么：原稿传播感强，但有明显夸张包装。适合重构成“从单次提示词到个人内容系统”的 Human3.0 选题。

```yaml
content_state:
  project:
    name: 文昌.skill
    account: AI生命克劳德
    long_term_goal: Human3.0
  request:
    raw_intent: 把 5-Agent 内容流水线长文当成已有初稿诊断选题
    current_stage: 诊文
    target_platforms: [公众号]
  audience:
    primary: 普通 AI 使用者、内容创作者、独立开发者
    pain_points:
      - 只会在一个聊天框里反复提示
      - 内容生产没有流程沉淀
      - 不知道如何把 AI 工作流变成可复用资产
  topic:
    source: 用户提供已有初稿
    core_angle: 真正有价值的不是 5 个 agent，而是把内容生产从一次性提示词变成可复用系统
    title_candidates:
      - 别再把 AI 当聊天框了，你需要的是一条内容流水线
      - 5 个 Agent 不重要，重要的是你终于有了自己的内容系统
      - 真正拉开创作者差距的，不是提示词，而是流程资产
    selected_title: 5 个 Agent 不重要，重要的是你终于有了自己的内容系统
    why_now: 多 agent 内容生产方法开始流行，但多数人只复制 prompt，没有沉淀系统
    long_term_value: 可沉淀为 Human3.0 中“个人内容生产系统”和“数字生产资料”的方法论
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
  next_step:
    skill: wenchang-review
    reason: 已有初稿，先判断可用部分和风险，再决定是否采证与重写
    user_decision_needed: false
  handoff:
    from_stage: 路由
    to_stage: 诊文
    accepted_inputs:
      - 用户提供初稿摘要
      - content_state.topic
      - content_state.audience
    ignored_context:
      - 30 万美元团队的夸张承诺
      - 全自动取代人的叙事
      - 直接复制 5 个 prompt 的做法
    stop_condition: 输出选题诊断和重构方向
```

## 2. 诊文结论

- 建议动作：重构选题后采证，再起稿
- 主要原因：原稿有强传播钩子和可执行结构，但标题承诺过大，且“替代创意团队”容易偏离 Human3.0 的人机边界。

## 核心问题

1. 标题“替代 30 万美元团队”传播强，但会把文章带向效率神话。
2. 原稿强调 agent 分工，却没有足够强调人的判断权。
3. 直接复制五个 Markdown 文件容易成为资料堆，没有形成自己的内容资产系统。

## 最小修改建议

1. 保留“链式流程优于单次提示词”的核心。
2. 把“替代团队”改成“让一个人拥有小团队式工作流”。
3. 把重点放在 `content_state + handoff + review`，而不是 agent 数量。

```yaml
content_state:
  diagnosis:
    recommendation: 重构选题后采证
    key_issues:
      - 标题承诺夸张
      - 人的判断权不足
      - 缺少长期资产沉淀视角
    minimum_fixes:
      - 降低替代团队叙事
      - 强化 Human3.0 人机边界
      - 把 handoff 和状态接力作为主线
  next_step:
    skill: wenchang-research
    reason: 需要补多 agent/链式流程的可信解释和反向限制
    user_decision_needed: false
  handoff:
    from_stage: 诊文
    to_stage: 采证
    accepted_inputs:
      - diagnosis.key_issues
      - topic.core_angle
      - 用户提供初稿摘要
    ignored_context:
      - 30 万美元团队标题
      - 全自动发布承诺
      - 不保留人工判断的流水线
    stop_condition: 形成支持重写的事实包和限制条件
```

## 3. 采证结论

- 是否足够支撑写作：足够
- 主要原因：不需要证明“5 个 agent 等于团队”，只需要证明链式处理、上下文隔离、交接协议和审查环节能提高流程稳定性。

## 来源清单

1. 用户提供初稿：提供 5-Agent 内容流水线结构和 handoff 模板。
2. 当前项目 `content/CONTENT_STATE.md`：提供 `content_state` 和 `handoff` 的阶段合同。
3. 当前项目 `wenchang-research`：提供采证阶段边界。
4. 当前项目 `wenchang-review`：提供诊断/整章模式和人的判断权。
5. 当前项目 `wenchang-publish-check`：提供发布前检查和阻塞项机制。

## 关键事实

- 原稿的可取之处是把内容生产拆成策略、研究、写作、编辑、发布五个阶段。
- 原稿的 handoff 模板本质是在减少阶段漂移。
- 当前项目已经用 `content_state` 和 `handoff` 把文本模板升级为结构化协议。
- 当前项目没有追求真多 agent 并行，而是先用单 agent 模拟上下文隔离。
- 发布和归档阶段仍保留 `user_decision_needed`，符合 Human3.0 的判断权边界。

## 反向数据 / 限制条件

- 真多 agent 不一定马上更好，会带来调度、状态同步、失败恢复成本。
- 五个 Markdown 文件不能自动保证高质量，关键是阶段合同和验证。
- 自动化内容流水线如果没有人的审查，容易放大错误和空泛表达。

## 可引用句子

> 不是让 AI 替你拥有团队，而是让你的判断有一套可以复用的生产线。

```yaml
content_state:
  research:
    sources:
      - 用户提供初稿
      - content/CONTENT_STATE.md
      - content/wenchang-research/SKILL.md
      - content/wenchang-review/SKILL.md
      - content/wenchang-publish-check/SKILL.md
    key_facts:
      - 内容生产可以拆成策略、研究、写作、编辑、发布
      - handoff 可以减少流水线漂移
      - content_state 比纯文本交接更适合长期维护
      - 单 agent 也可以通过交接包模拟上下文隔离
      - 发布和归档需要保留用户判断权
    contrarian_points:
      - 真多 agent 会增加调度成本
      - prompt 文件不等于系统
      - 无审查自动化会放大错误
    usable_quotes:
      - 不是让 AI 替你拥有团队，而是让你的判断有一套可以复用的生产线。
    contradictions:
      - 原稿强调替代团队，项目目标强调保留人的判断权
    confidence: Medium
  next_step:
    skill: wechat-writing-skill-ai-human3
    reason: 已完成选题重构和限制条件采证
    user_decision_needed: false
  handoff:
    from_stage: 采证
    to_stage: 起稿
    accepted_inputs:
      - topic.core_angle
      - diagnosis.minimum_fixes
      - research.key_facts
      - research.contrarian_points
    ignored_context:
      - 原稿夸张商业价值
      - 直接复制 prompt 的教程写法
      - 全自动发布承诺
    stop_condition: 输出一篇公众号判断文初稿
```

## 4. 起稿输出

# 5 个 Agent 不重要，重要的是你终于有了自己的内容系统

最近有一种说法很流行：五个 AI agent，就能替代一个 30 万美元的创意团队。

这句话很会传播，但容易把重点带偏。

真正值得关注的，不是五个 agent，也不是替代团队，而是内容生产第一次可以被普通人拆成一条可复用的生产线。

过去大多数人使用 AI 写内容，方式很简单：打开一个聊天框，输入一个提示词，拿到一篇文章，然后复制到别处。

这看起来很快，但它有一个问题：每一次都是临时工作。

选题没有沉淀，研究没有沉淀，编辑判断没有沉淀，发布资产也没有沉淀。你不是在建设内容系统，只是在一次次消费模型能力。

5-Agent 流水线真正有价值的地方，是它把写作拆成了五个阶段。

策略负责判断角度。

研究负责寻找事实。

写作负责执行结构。

编辑负责删减和重排。

发布负责适配平台。

这个拆法的意义，不是让 AI 变成一个廉价团队，而是让每一步都有边界、有输入、有输出。

当边界清楚后，人的判断才更容易保留下来。

比如策略阶段，人要决定这篇内容是否值得写。研究阶段，人要看事实是否足够支撑观点。编辑阶段，人要判断哪些表达只是顺滑，哪些表达真正推进论证。发布阶段，人要确认这篇文章是不是符合账号长期方向。

这和单次提示词完全不同。

单次提示词追求的是一次生成。

内容系统追求的是长期复用。

所以，我更愿意把这件事理解成 Human3.0 的一个小案例：普通人不只是用 AI 生产内容，而是开始拥有自己的内容生产资料。

这些生产资料包括选题库、研究包、文章结构、修改日志、发布包、归档判断，也包括每个阶段之间的交接协议。

这也是为什么我不建议直接复制五个 prompt 文件。

文件本身不值钱。

真正值钱的是它们之间如何接力。

如果没有 handoff，上一个 agent 的输出很容易被下一个 agent 重新理解，甚至重新发明。研究员会写文章，写作者会重做策略，编辑会舍不得删稿，发布方会偷偷改内容。

流水线最后又退回一个万能聊天框。

更稳的做法，是为每一步建立阶段合同。

这一阶段读什么。

这一阶段写什么。

哪些旧信息必须忽略。

什么时候必须停下来让人判断。

这就是我们在文昌里用 `content_state` 和 `handoff` 做的事。

现在它还不是真正的五个独立 agent，但已经在行为上接近多 agent 工作流：每个阶段只拿自己需要的输入，只更新自己负责的字段，不继承整段混乱聊天历史。

这比盲目上五个 agent 更适合个人创作者。

因为系统一开始最重要的不是自动化程度，而是可控性。

你要先知道每一步是否真的有价值，再决定要不要拆成独立 agent。

这也是内容创作者真正应该关心的变化。

未来的差距，不是有人会写更长的提示词，而是有人开始拥有自己的内容系统。

一次提示词会帮你写一篇文章。

一套内容系统会帮你积累选题、事实、结构、风格和发布经验。

前者是消费 AI。

后者是在沉淀数字生产资料。

所以，别急着问自己要不要装五个 agent。

先问一个更重要的问题：你的内容生产，有没有任何东西能被下一篇文章复用？

```yaml
content_state:
  draft:
    status: first_draft
    file: content/examples/full-pipeline-content-agents-diagnostic.md
    summary: 已将 5-Agent 初稿重构为 Human3.0 公众号判断文
  next_step:
    skill: wenchang-review
    reason: 需要检查是否仍残留夸张替代叙事，以及行动建议是否足够
    user_decision_needed: false
  handoff:
    from_stage: 起稿
    to_stage: 诊文
    accepted_inputs:
      - 当前正式草稿
      - diagnosis.minimum_fixes
      - research.contrarian_points
    ignored_context:
      - 30 万美元团队标题
      - 原稿完整 prompt 清单
      - 全自动内容工厂叙事
    stop_condition: 输出诊断结论和发布前建议
```

## 5. 诊文结论

- 建议动作：轻改后出刊
- 主要原因：重构后已摆脱“替代团队”叙事，主线回到个人内容系统和数字生产资料；还可以补一个更具体的落地动作。

## 核心问题

1. 文章判断清楚，但实际落地步骤略少。
2. `content_state` 和 `handoff` 出现较晚，可以提前让读者理解。
3. 结尾问题有效，但可以补一个“今天就能做”的动作。

## 最小修改建议

1. 在中段补一句：先从一个主题、一篇文章、一份研究包开始。
2. 把 `content_state + handoff` 提前解释为“内容系统的接力单”。
3. 出刊时标题不要使用“30 万美元团队”作为主标题，只可作为文内反差。

```yaml
content_state:
  diagnosis:
    recommendation: 轻改后进入出刊检查
    key_issues:
      - 落地步骤略少
      - content_state 和 handoff 出现较晚
      - 标题需避免效率神话
    minimum_fixes:
      - 补一个最小启动动作
      - 提前解释接力单
      - 标题回到内容系统
  next_step:
    skill: wenchang-publish-check
    reason: 文章可进入发布资产检查
    user_decision_needed: false
  handoff:
    from_stage: 诊文
    to_stage: 出刊
    accepted_inputs:
      - 当前正式草稿
      - diagnosis.minimum_fixes
      - distribution.primary_platform
    ignored_context:
      - 原稿夸张标题
      - 未采用的五个 agent prompt 原文
      - 自动化替代团队叙事
    stop_condition: 输出发布前检查包
```

## 6. 出刊检查

## 发布结论

- 建议：补齐后发布
- 阻塞项：缺封面图和小红书二次分发卡片结构。

## 必补项

- [ ] 封面图：内容系统不是提示词清单。
- [ ] 摘要确认。
- [ ] 如二次分发到小红书，拆成 7 页卡片。

## 平台发布包

- 标题：5 个 Agent 不重要，重要的是你终于有了自己的内容系统
- 摘要/导语：真正拉开创作者差距的，不是会不会复制 prompt，而是能不能把选题、研究、写作、编辑和发布沉淀成可复用系统。
- 标签/话题：AI写作、内容系统、Human3.0、数字生产资料、个人工作流
- 转发文案：一次提示词帮你写一篇文章。一套内容系统，才会帮你积累下一篇文章的生产资料。
- 评论区引导：你的内容生产里，哪一步最值得先沉淀成可复用流程？

## 归档建议

- 是否建议进入 Human3.0 成书审查：建议
- 建议沉淀为：个人内容系统 / 数字生产资料 / 人机边界案例

```yaml
content_state:
  publish_assets:
    title: 5 个 Agent 不重要，重要的是你终于有了自己的内容系统
    summary: 真正拉开创作者差距的，不是会不会复制 prompt，而是能不能把选题、研究、写作、编辑和发布沉淀成可复用系统。
    cover_text: 内容系统不是提示词清单
    tags: [AI写作, 内容系统, Human3.0, 数字生产资料, 个人工作流]
    images: []
    share_copy: 一次提示词帮你写一篇文章。一套内容系统，才会帮你积累下一篇文章的生产资料。
    comment_prompt: 你的内容生产里，哪一步最值得先沉淀成可复用流程？
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
    card_skill: long-to-cards
    image_skill: xiaohongshu-viral-image-skill-v4
  archive:
    should_review_for_book: true
    material_type: 方法论/案例
    suggested_bucket: Human3.0/数字生产资料/内容系统
  next_step:
    skill: human3-book-guardian-v6
    reason: 适合进入 Human3.0 内容生产系统素材库
    user_decision_needed: true
  handoff:
    from_stage: 出刊
    to_stage: 归档
    accepted_inputs:
      - 发布版正文
      - publish_assets
      - archive
    ignored_context:
      - 原稿替代团队叙事
      - 未采用 prompt 原文
      - 未生成的封面图
    stop_condition: 给出归档建议，不替用户入库
```

## 7. 回归观察

- 已有初稿型入口应优先诊文，不应直接采证或起稿。
- 原稿里传播性强但价值观有偏的部分，需要进入 `ignored_context`，避免下游继续沿用。
- 这类样例证明 `wenchang-review` 不只是润色，而是承担选题重构和边界校准。
