# router expected

case_type: external-article

## 路由判断

- 平台：公众号
- 阶段：外部热点/文章素材，需要定题、storm 研究前置与采证
- 推荐链路：`wenchang-router -> storm-research -> wenchang-research -> wechat-writing-skill-ai-human3 -> wenchang-review -> wenchang-publish-check`
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
- Storm trigger：建议进入 `storm-research`。原文既可以写成工具教程，也可以写成个人工作系统变化，需要先拆多视角问题地图，避免直接搬运功能清单。

## content_state

```yaml
content_state:
  request:
    raw_intent: 把 Codex-maxxing 当成外部热点素材，诊断选题并跑完整链路
    current_stage: storm-research
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
    skill: storm-research
    reason: 外部热点素材存在多个叙事角度，先拆多视角扫描、矛盾地图和采证计划
    user_decision_needed: false
  handoff:
    from_stage: 路由
    to_stage: storm-research
    accepted_inputs:
      - 原始文章 URL
      - content_state.topic
      - content_state.audience
      - Human3.0 长期方向
    ignored_context:
      - 逐段翻译原文
      - 把 Codex 写成纯功能清单
      - 程序员失业式标题
    stop_condition: 形成可交给 wenchang-research 的问题地图和采证计划
```

## 下一步执行

调用 `storm-research`，先输出多视角扫描、矛盾地图和后续采证计划，不搬运原文结构、不写正文。
