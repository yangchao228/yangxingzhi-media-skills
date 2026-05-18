# review expected

case_type: draft-diagnostic

## 诊断结论

- 建议动作：重构选题后采证，再起稿
- 主要原因：原稿有强传播钩子和可执行结构，但标题承诺过大，且“替代创意团队”容易偏离 Human3.0 的人机边界。

## 核心问题

1. 标题“替代 30 万美元团队”传播强，但会把文章带向效率神话。
2. 原稿强调 agent 分工，却没有足够强调人的判断权。
3. 直接复制五个 Markdown 文件容易成为资料堆，没有形成自己的内容资产系统。

## 最小修改建议

1. 保留“链式流程优于单次提示词”的核心。
2. 把“替代团队”改成“让一个人拥有小团队式工作流”。
3. 把重点放在 `content_state + handoff + review`，而不是 agent 数量。

## content_state 更新

```yaml
content_state:
  diagnosis:
    recommendation: 重构选题后采证
    key_issues:
      - 标题承诺夸张
      - 人的判断权不足
      - 缺少长期资产沉淀视角
    minimum_fixes:
      - 降低替代团队叙事
      - 强化 Human3.0 人机边界
      - 把 handoff 和状态接力作为主线
  next_step:
    skill: wenchang-research
    reason: 需要补多 agent/链式流程的可信解释和反向限制
    user_decision_needed: false
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

## 修改日志

1. 降低替代团队叙事。
2. 强化人的判断权。
3. 把重点从 prompt 文件转为系统接力。

## 删减说明

- 目标删减比例：20%-30%
- 实际删减情况：诊断模式不执行完整删减
- 未删够的原因（如有）：当前阶段先做选题诊断

## 最强一句

不是让 AI 替你拥有团队，而是让你的判断有一套可以复用的生产线。
