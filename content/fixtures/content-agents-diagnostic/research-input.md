# research input

## content_state

```yaml
content_state:
  request:
    current_stage: 采证
    target_platforms: [公众号]
  topic:
    source: 用户提供已有初稿
    core_angle: 真正有价值的不是 5 个 agent，而是把内容生产从一次性提示词变成可复用系统
  diagnosis:
    recommendation: 重构选题后采证
    key_issues:
      - 标题承诺夸张
      - 人的判断权不足
      - 缺少长期资产沉淀视角
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
