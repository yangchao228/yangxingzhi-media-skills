# expected-output-notes

必须包含：

- `## 诊断结论`
- 建议动作不能是“直接发布”
- 至少指出结构、案例、读者获得感中的一个问题
- `## 最小修改建议`
- `## content_state 更新`
- `diagnosis.recommendation`
- `next_step.user_decision_needed`
- `handoff.accepted_inputs`
- `handoff.ignored_context`
- 如果用户只要求检查，应使用诊断模式，不直接全文重写
- 如果用户要求直接改稿，应使用整章模式，并包含 `## 编辑后正文`、`## 修改日志`、`## 删减说明` 和 `## 最强一句`
- 整章模式应以删减 20%-30% 为目标，未达到时说明原因
- 最强一句必须能独立表达文章判断

不应该出现：

- 默认全文重写
- 只做语言润色
- 直接进入发布
- 整章模式新增无来源强断言
- 最后一行只是泛泛口号
