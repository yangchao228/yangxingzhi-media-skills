# router expected

case_type: draft-diagnostic

## 路由判断

- 平台：公众号
- 阶段：已有初稿，需要先诊断选题，而不是直接改写
- 推荐链路：`wenchang-router -> wenchang-review -> wenchang-research -> wechat-writing-skill-ai-human3 -> wenchang-publish-check`
- 为什么：原稿传播感强，但有明显夸张包装。适合重构成“从单次提示词到个人内容系统”的 Human3.0 选题。

## brief

- Angle：真正有价值的不是 5 个 agent，而是把内容生产从一次性提示词变成可复用系统。
- Hook：5 个 Agent 不重要，重要的是你终于有了自己的内容系统。
- Subpoints：
  - 单次提示词只能生成一次内容，内容系统会沉淀下一次可复用的资产。
  - handoff 的价值是减少阶段漂移，不是制造更多 prompt 文件。
  - 人的判断权必须保留在选题、采证、编辑和发布节点。
- What to avoid：
  - 不要使用“替代 30 万美元团队”作为主叙事。
  - 不要写成全自动发布流水线。
  - 不要直接复制五个 agent prompt。
- Suggested format：公众号判断文，1800-2400 字，先诊断再重构选题。

## content_state

```yaml
content_state:
  request:
    raw_intent: 把 5-Agent 内容流水线长文当成已有初稿诊断选题
    current_stage: 诊文
    target_platforms: [公众号]
  topic:
    source: 用户提供已有初稿
    core_angle: 真正有价值的不是 5 个 agent，而是把内容生产从一次性提示词变成可复用系统
    selected_title: 5 个 Agent 不重要，重要的是你终于有了自己的内容系统
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

## 下一步执行

调用 `wenchang-review`，先诊断原稿是否值得重构。
