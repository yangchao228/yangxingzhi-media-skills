# missing contrarian research boundary

## 采证结论

- 是否足够支撑写作：勉强
- 主要原因：已有若干正向事实，但未找到能削弱、限制或复杂化主论点的证据。

## 反向数据 / 限制条件

- 已检查官方文档、论文摘要和用户案例，但本轮未形成可用反向证据。
- 下一步应继续核验成本、权限、适用人群和失败案例。

## content_state 更新

```yaml
content_state:
  research:
    sources:
      - 官方文档
      - 用户案例
    key_facts:
      - 已有正向事实，但缺少边界材料
    contrarian_points:
    usable_quotes: []
    contradictions:
      - 暂未发现可用反向证据
    confidence: Medium
  next_step:
    skill: wenchang-research
    reason: 缺少反向证据，继续采证或请用户确认是否接受较低可信度
    user_decision_needed: true
  handoff:
    from_stage: 采证
    to_stage: 采证
    accepted_inputs:
      - 已找到的正向事实
      - 待补反向证据问题
    ignored_context:
      - 只支持原论点的单向材料
      - 没有来源的乐观判断
    stop_condition: 补到反向证据，或用户确认降低文章确定性
```
