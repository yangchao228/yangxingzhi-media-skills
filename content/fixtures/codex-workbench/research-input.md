# research input

## content_state

```yaml
content_state:
  request:
    current_stage: 采证
    target_platforms: [公众号]
  topic:
    source: 外部文章/热点素材
    core_angle: Codex 的关键变化不是写代码更强，而是让工作有了持续运行的工作台
    selected_title: 我以为 Codex 是写代码的，结果它开始接管我的工作台
  handoff:
    from_stage: 路由
    to_stage: 采证
    accepted_inputs:
      - https://jxnl.github.io/blog/writing/2026/05/10/codex-maxxing/
      - content_state.topic
    ignored_context:
      - 逐段翻译原文
      - 纯 Codex 教程写法
    stop_condition: 形成可支撑公众号判断文的研究包
```
