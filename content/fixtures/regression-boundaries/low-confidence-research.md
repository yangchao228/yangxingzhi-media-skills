# low confidence research boundary

## 采证结论

- 是否足够支撑写作：不足
- 主要原因：只有二手转述，缺少一手来源和可核验案例。

## content_state 更新

```yaml
content_state:
  research:
    sources:
      - 未核验二手材料
    key_facts: []
    contrarian_points:
      - 关键结论缺少一手来源
    usable_quotes: []
    contradictions:
      - 来源口径无法确认
    confidence: Low
  next_step:
    skill: wenchang-research
    reason: 需要继续补一手来源和反向证据，不能进入起稿
    user_decision_needed: true
  handoff:
    from_stage: 采证
    to_stage: 采证
    accepted_inputs:
      - 已确认主题
      - 待核验来源清单
    ignored_context:
      - 未核验的效率数字
      - 社媒二手转述
    stop_condition: 找到至少 3 条可核验事实和 1 条反向证据
```
