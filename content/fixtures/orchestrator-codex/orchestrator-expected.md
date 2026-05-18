# orchestrator expected

case_type: orchestrator

## 当前阶段

- 阶段：定题
- 入口类型：外部文章/热点素材 + 已有明确主题
- 当前链路：定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 -> 配图/卡片/上传 -> 归档

## 已完成

- 已识别目标平台为公众号。
- 已确认这不是翻译任务，而是外部素材转 Human3.0 判断文。
- 已选择从定题进入，不从探脉开始。

## 需要你确认

- 暂无，下一步可自动推进到采证。

## 我建议

- 先输出定题 brief，再调用 `wenchang-research` 提炼原文事实、限制条件和反向证据。
- 文章不要写成 Codex 功能清单，应写成“AI 从聊天框变成个人工作台”的结构变化。

## 用户回复后将执行

- 如果用户无异议，执行 `wenchang-research`。
- 后续在出刊缺封面、配图、卡片或归档建议时暂停确认。

## content_state

```yaml
content_state:
  request:
    raw_intent: 从 Codex-maxxing 素材开始，走完整套文昌流程
    current_stage: 定题
    target_platforms: [公众号]
  topic:
    source: 外部文章/热点素材
    core_angle: Codex 的关键变化不是写代码更强，而是让工作有了持续运行的工作台
    selected_title: 我以为 Codex 是写代码的，结果它开始接管我的工作台
    long_term_value: 可沉淀为 Human3.0 中“个人工作系统”和“数字生产资料”的案例
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
    card_skill: long-to-cards
    image_skill: xiaohongshu-viral-image-skill-v4
  next_step:
    skill: wenchang-research
    reason: 需要从原文中提炼事实点、结构变化和限制条件
    user_decision_needed: false
  handoff:
    from_stage: 定题
    to_stage: 采证
    accepted_inputs:
      - 原始文章 URL
      - content_state.topic
      - content_state.distribution
      - Human3.0 长期方向
    ignored_context:
      - 逐段翻译原文
      - 纯 Codex 功能清单
      - AI 全自动接管工作的叙事
    stop_condition: 形成可支撑公众号判断文的研究包
```

## 子 skill 调用建议

- `wenchang-research`：采证。
- 后续自动链路：立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊。
- 出刊后如缺封面、卡片或图片上传，暂停确认后进入配图/卡片/上传。
- 如果文章有长期价值，暂停确认是否进入 Human3.0 归档。
