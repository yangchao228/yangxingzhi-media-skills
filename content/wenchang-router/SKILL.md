---
name: wenchang-router
description: 文昌.skill 总调度入口。识别内容创作请求所处阶段与目标平台，并路由到选题、写作、诊断、卡片化、发布检查或 Human3.0 归档流程。
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
| 立骨 | 题目已定，需要结构、大纲、论点排序 | `wechat-writing-skill-ai-human3` 的大纲部分，或直接输出结构计划 |
| 起稿 | 已确认选题和大纲，需要正文初稿 | `wechat-writing-skill-ai-human3` |
| 诊文 | 已有初稿，需要判断是否值得发、是否要重写 | `wenchang-review` |
| 整章 | 初稿方向对，但需要改成发布版 | `wenchang-review` 后继续改写 |
| 配图/卡片 | 长文要转卡片、封面、图文分发 | `wechat-to-cards` / `redbook-cards` / `long-to-cards` / `xiaohongshu-viral-image-skill-v4` / `md-img-r2` |
| 出刊 | 发布前检查标题、摘要、标签、封面、分发文案 | `wenchang-publish-check` |
| 归档 | 判断文章是否服务 Human3.0 成书路径 | `human3-book-guardian` |

## 平台识别

- 公众号：优先长文、栏目沉淀、朋友圈转发文案。
- 知乎：优先问题意识、个人判断、争议点、评论区讨论。
- 小红书：优先封面点击、卡片结构、收藏价值、发布文案和标签。
- Human3.0 成书：优先主线归属、入书价值、素材库条目。

如果用户没有指定平台，默认先按公众号长文处理；如果内容更适合二次分发，再提示可继续转小红书/知乎版本。

## 默认执行规则

1. 先判断平台和阶段。
2. 如果阶段不明确，按“最小下一步”处理，不要直接跳到终稿。
3. 如果主题涉及 AI、Agent、OpenClaw、认知主权、结构杠杆、数字生产资料，优先使用 Human3.0 专用链路。
4. 如果用户已有初稿，优先诊断，不要直接重写。
5. 如果用户要发布，必须保留发布前检查。
6. 如果内容有长期价值，最后提示是否进入 Human3.0 素材库审查。

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
  next_step:
    skill:
    reason:
    user_decision_needed:
```

## 下一步执行
<直接执行当前最合适的一步，或明确调用哪个 skill>

## 可选后续
- <下一阶段 1>
- <下一阶段 2>
```

## 不要做的事

- 不要把所有阶段一次性吞掉，输出一篇不可复用的一次性结果。
- 不要替用户做不可逆判断，例如最终发布、入书、删稿。
- 不要为追热点牺牲 Human3.0 的长期主线。
