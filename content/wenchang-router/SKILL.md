---
name: wenchang-router
description: 文昌.skill 总调度入口。识别内容创作请求所处阶段与目标平台，并路由到选题、storm 研究、采证、写作、诊断、卡片化、发布检查或 Human3.0 归档流程。
---

# 文昌路由

## 目标

把用户的自然语言内容需求路由成一条可执行的创作链路，避免用户自己判断“下一步该用哪个 skill”。

路由时优先服务长期资产沉淀：不要只追热点，要判断内容是否能沉淀为栏目、方法论、案例、素材库或可复用工作流。

## 阶段识别

按用户输入判断当前最接近哪个阶段：

| 阶段 | 判断信号 | 推荐路由 |
| --- | --- | --- |
| 探脉 | 不知道写什么、想看近期热点、围绕主题找方向 | `wechat-hot-topic-skill-ai-human3` / `wechat-hot-topic-skill-generic` / `zhihu-topic-hunter` / `xiaohongshu-topic-generator` |
| 定题 | 已有热点、候选主题、想选最值得写的题 | 对应平台选题 skill |
| storm-research | 已有主题、外部项目/文章/热点、产品问题或学习领域，但还缺多视角问题地图、矛盾关系和采证计划 | `storm-research` |
| 采证 | 已有选题或 storm 研究包，但缺事实、数据、案例、来源、反向证据 | `wenchang-research` |
| 立骨 | 题目已定，需要结构、大纲、论点排序 | `wechat-writing-skill-ai-human3` 的大纲部分，或直接输出结构计划 |
| 起稿 | 已确认选题和大纲，需要正文初稿 | `wechat-writing-skill-ai-human3` |
| 诊文 | 已有初稿，需要判断是否值得发、是否要重写 | `wenchang-review` |
| 整章 | 初稿方向对，但需要删减、重排、强化开头结尾 | `wenchang-review` 的整章模式 |
| 配图/卡片 | 长文要转卡片、封面、图文分发 | `wechat-to-cards` / `redbook-cards` / `long-to-cards` / `xiaohongshu-viral-image-skill-v4` / `md-img-r2` |
| 出刊 | 发布前检查标题、摘要、标签、封面、分发文案；或要求搜一搜、搜索流量、微信搜索、SEO 标题优化 | `wenchang-publish-check` |
| 归档 | 判断文章是否服务 Human3.0 成书路径 | `human3-book-guardian` |

## 平台识别

- 公众号：优先长文、栏目沉淀、搜一搜标题/摘要、朋友圈转发文案。
- 知乎：优先问题意识、个人判断、争议点、评论区讨论。
- 小红书：优先封面点击、卡片结构、收藏价值、发布文案和标签。
- Human3.0 成书：优先主线归属、入书价值、素材库条目。

如果用户没有指定平台，默认先按公众号长文处理；如果内容更适合二次分发，再提示可继续转小红书/知乎版本。

## 默认执行规则

1. 先判断平台和阶段。
2. 如果阶段不明确，按“最小下一步”处理，不要直接跳到终稿。
3. 如果主题涉及 AI、Agent、OpenClaw、认知主权、结构杠杆、数字生产资料，优先使用 Human3.0 专用链路。
4. 如果已有选题但缺问题地图，且主题是外部项目、热点、趋势、产品问题或学习领域，优先 `storm-research`。
5. 如果已有选题或 storm 研究包但缺证据，优先采证，不要直接起稿。
6. 如果用户已有初稿，优先诊断，不要直接重写。
7. 如果用户要发布，必须保留发布前检查。
8. 如果内容有长期价值，默认进入 Human3.0 素材库 / 成书审查；只有用户明确撤销时才取消归档。
9. 如果用户提到“搜一搜”“搜索流量”“微信搜索”“SEO 标题”“关键词标题”，默认路由到 `wenchang-publish-check`，只做发布资产和搜索友好度检查，不回到起稿阶段。

## 成本敏感路由规则

路由阶段要控制后续成本，避免错误方向进入全文、卡片或多平台生成。

- 阶段不明确时，只输出 brief 和下一步，不生成正文。
- 需要 storm 研究时，先输出问题地图和采证计划，不生成正文、不写发布包。
- 多平台需求先生成统一 `content_state`，再按平台分发，不重复理解原文。
- 卡片/图片需求先路由到结构规划，确认页数、风格和输出形式后再进入生成。
- 已有初稿只需要局部修订时，路由到诊文或整章局部修改，不默认完整重写。
- 如果用户的目标可以通过模板、SOP、清单或素材库沉淀完成，优先产出可复用资产。
- 订阅、模型价格、外部上传和真实发布只给建议与阻塞项，不替用户做最终决定。归档按默认推进规则处理：建议归档即默认归档，除非用户明确撤销。

## Brief 边界

路由、探脉、定题阶段只产出 brief，不写正文。brief 必须服务下一阶段决策，而不是伪装成文章开头。

brief 至少包含：

- Angle：一句话说明核心切口。
- Hook：第一句候选，必须是判断句，不要用提问句。
- Subpoints：3 个分论点。
- What to avoid：2 个以上不该写的角度。
- Suggested format：建议平台、篇幅、形态。
- Storm trigger：是否建议进入 `storm-research`，以及原因。

如果题目已经饱和、缺少 Human3.0 长期价值，或无法形成可防守角度，应直接说不建议写，并给出更好的替代题。

## content_state 接力规则

每次路由都要输出或更新 `content_state`。如果用户已经提供了 `content_state`，只更新本阶段能确认的字段，不要覆盖已有判断。

必须至少填写：

- `request.raw_intent`
- `request.current_stage`
- `request.target_platforms`
- `distribution.primary_platform`
- `next_step.skill`
- `next_step.reason`
- `next_step.user_decision_needed`

完整字段规范见 `content/CONTENT_STATE.md`。

如果用户明确确认或否决了选题、平台、标题或归档方向，追加到 `content_state.decisions`；路由阶段不要把自己的推荐写成用户选择。

归档例外：当系统判断内容适合进入 Human3.0 素材库 / 成书审查时，可以记录为 `user_choice: 默认归档（用户未撤销）`，且不要仅因为归档把 `next_step.user_decision_needed` 设为 `true`。

## 上下文隔离规则

路由只把下一阶段需要的信息写入 `handoff`，不要把整段聊天历史默认传给下一阶段。

`handoff.accepted_inputs` 应包含：

- 下一阶段允许读取的 `content_state` 字段。
- 上一阶段正式输出。
- 用户在本轮明确新增的材料。

`handoff.ignored_context` 应包含：

- 已淘汰的旧角度、旧标题、旧草稿。
- 未确认的推理过程。
- 与下一阶段无关的平台设想。

## 输出格式

```md
## 路由判断
- 平台：
- 阶段：
- 推荐链路：
- 为什么：

## content_state
```yaml
content_state:
  request:
    raw_intent:
    current_stage:
    target_platforms: []
  distribution:
    primary_platform:
    secondary_platforms: []
  storm_research:
    topic:
    purpose:
    perspectives: []
    contradiction_map:
      conflicts: []
      consensus: []
      blind_spots: []
    synthesis_brief:
      summary:
      key_findings: []
      hidden_connection:
      actionable_insight:
      frontier_question:
    confidence_review:
      scores: []
      weakest_claim:
      missing_perspectives: []
      verification_needed: []
    evidence_plan: []
  next_step:
    skill:
    reason:
    user_decision_needed:
  decisions:
    - stage:
      question:
      user_choice:
      timestamp:
      impact:
  handoff:
    from_stage:
    to_stage:
    accepted_inputs: []
    ignored_context: []
    stop_condition:
```

## 下一步执行
<输出当前阶段 brief，或明确调用哪个 skill。路由/定题阶段不要写正文。>

## 可选后续
- <下一阶段 1>
- <下一阶段 2>
```

## 不要做的事

- 不要把所有阶段一次性吞掉，输出一篇不可复用的一次性结果。
- 不要替用户做不可逆判断，例如最终发布、最终入书、售卖、删稿；素材归档按默认归档规则推进。
- 不要为追热点牺牲 Human3.0 的长期主线。
- 不要把 `storm-research` 的角色视角当作事实引用；事实仍要进入 `wenchang-research` 核验。
- 不要跳过采证环节去生成事实密集型文章。
- 不要在路由、探脉、定题阶段生成正文。
