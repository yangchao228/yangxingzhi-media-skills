# router expected

case_type: external-article

## 路由判断

- 平台：公众号
- 阶段：外部热点/文章素材，需要定题与采证
- 推荐链路：`wenchang-router -> wenchang-research -> wechat-writing-skill-ai-human3 -> wenchang-review -> wenchang-publish-check`
- 为什么：原文是个人使用经验，不适合直接搬运。它的价值在于揭示 Codex 从代码工具变成个人工作台的结构变化。

## brief

- Angle：Codex 的关键变化不是写代码更强，而是让工作有了持续运行的工作台。
- Hook：我以为 Codex 是写代码的，结果它开始接管我的工作台。
- Subpoints：
  - 长期线程让工作不再每次从零开始。
  - 文件化 memory 让经验变成可审查资产。
  - heartbeats、goals、side panel 让任务从一次回答变成持续循环。
- What to avoid：
  - 不要复述原文功能清单。
  - 不要写成纯 Codex 教程。
  - 不要写成 AI 全自动接管工作。
- Suggested format：公众号判断文，1800-2500 字，后续可拆知乎判断文和小红书卡片。

## content_state

```yaml
content_state:
  request:
    raw_intent: 把 Codex-maxxing 当成外部热点素材，诊断选题并跑完整链路
    current_stage: 采证
    target_platforms: [公众号]
  topic:
    source: 外部文章/热点素材
    core_angle: Codex 的关键变化不是写代码更强，而是让工作有了持续运行的工作台
    selected_title: 我以为 Codex 是写代码的，结果它开始接管我的工作台
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
      - 逐段翻译原文
      - 把 Codex 写成纯功能清单
      - 程序员失业式标题
    stop_condition: 形成可支撑公众号判断文的研究包
```

## 下一步执行

调用 `wenchang-research`，只提炼事实、限制和可写角度，不搬运原文结构。
