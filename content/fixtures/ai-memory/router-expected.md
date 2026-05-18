# router expected

## 路由判断

- 平台：公众号
- 阶段：已有方向，但缺少事实采证
- 推荐链路：`wenchang-router -> wenchang-research -> wechat-writing-skill-ai-human3 -> wenchang-review -> wenchang-publish-check`
- 为什么：这个题不是单纯工具教程，而是关于个人工作系统变化的判断文。需要先补事实与反向证据，再起稿。

## brief

- Angle：AI 记忆不是让模型更像人，而是让个人工作系统开始有连续性。
- Hook：真正改变工作方式的，不是更聪明的 AI，而是会记住上下文的 AI。
- Subpoints：
  - 记忆让 prompt 变成可复用上下文资产。
  - 人的角色从重复解释变成校准系统。
  - 记忆能力越强，越需要管理判断权和隐私边界。
- What to avoid：
  - 不要写成“AI 会越来越懂你”的泛化乐观文。
  - 不要写成纯产品功能教程。
- Suggested format：公众号判断文，1800-2500 字，后续可拆小红书卡片。

## content_state

```yaml
content_state:
  request:
    raw_intent: 把“AI 记忆能力会改变普通人的工作方式吗”做成公众号文章
    current_stage: 采证
    target_platforms: [公众号]
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

## 下一步执行

调用 `wenchang-research`。
