# review expected

case_type: external-article

## 诊断结论

- 建议动作：轻改后发布前检查
- 主要原因：主线清晰，能从原文功能清单中提炼结构变化；但需要减少“原文作者”出现次数，增加读者自己的行动建议。

## 核心问题

1. 开头足够清楚，但中段略像原文解读。
2. 读者行动建议还可以更具体，例如“先为哪三类工作建立长期线程”。
3. 反向限制只在采证包里，正文中可以补一句成本和权限边界。

## 最小修改建议

1. 把“原文作者”改成“一个真实使用者的经验”，避免文章像书评。
2. 在结尾前补一个行动段：先选 3 个长期工作流。
3. 保留人的判断权，不写成 AI 自动接管。

## content_state 更新

```yaml
content_state:
  diagnosis:
    recommendation: 轻改后进入出刊检查
    key_issues:
      - 中段有外部文章解读感
      - 行动建议不够具体
      - 限制条件进入正文不足
    minimum_fixes:
      - 减少对原文的显性转述
      - 补具体行动建议
      - 补成本和权限边界
  next_step:
    skill: wenchang-publish-check
    reason: 文章已能进入发布资产检查
    user_decision_needed: false
  handoff:
    from_stage: 诊文
    to_stage: 出刊
    accepted_inputs:
      - 当前正式草稿
      - diagnosis.minimum_fixes
      - distribution.primary_platform
    ignored_context:
      - 原文逐段目录
      - 未采用的标题备选
      - 未采证的 Codex 功能猜测
    stop_condition: 输出发布前检查包
```

## 修改日志

1. 减少外部文章显性转述。
2. 保留“个人工作台”主线。
3. 增加行动建议。

## 删减说明

- 目标删减比例：20%-30%
- 实际删减情况：轻改模式下不执行完整删减
- 未删够的原因（如有）：当前建议动作不是整章模式

## 最强一句

会用聊天框的人，只是在使用 AI；能让工作持续运行的人，才是在建设系统。
