# research input

## content_state

```yaml
content_state:
  request:
    current_stage: 采证
    target_platforms: [公众号]
  audience:
    primary: 普通 AI 使用者、创作者、工程师
  topic:
    core_angle: AI 记忆不是让模型更像人，而是让个人工作系统开始有连续性
    selected_title: AI 记忆不是功能升级，而是个人工作系统的底层变化
    why_now: 2025 年以来，ChatGPT、Claude、Gemini 都在把记忆和过往上下文纳入产品能力
    long_term_value: 可沉淀为 Human3.0 中“个人数字生产资料”和“认知主权”的案例
  handoff:
    from_stage: 路由
    to_stage: 采证
    accepted_inputs:
      - content_state.topic
      - content_state.audience
      - 用户给定的真实目标
    ignored_context:
      - 未采证的强结论
      - 纯功能教程角度
    stop_condition: 形成至少 3 条关键事实、1 条反向证据和可信度判断
```
