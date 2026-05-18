# content_state 标准

`content_state` 是文昌工作流的接力对象。每个核心 skill 都应该尽量读取已有状态，并只补充自己负责的字段。

目标不是制造复杂表单，而是让选题、写作、诊断、分发、归档之间有稳定上下文，避免每一步重新理解用户。

## 最小结构

```yaml
content_state:
  project:
    name: 文昌.skill
    account: AI生命克劳德
    long_term_goal: Human3.0
  request:
    raw_intent:
    current_stage:
    target_platforms: []
  audience:
    primary:
    pain_points: []
  topic:
    source:
    core_angle:
    title_candidates: []
    selected_title:
    why_now:
    long_term_value:
  outline:
    thesis:
    sections: []
    examples_to_use: []
  draft:
    status:
    file:
    summary:
  diagnosis:
    recommendation:
    key_issues: []
    minimum_fixes: []
  publish_assets:
    title:
    summary:
    cover_text:
    tags: []
    images: []
    share_copy:
    comment_prompt:
  distribution:
    primary_platform:
    secondary_platforms: []
    card_skill:
    image_skill:
  archive:
    should_review_for_book:
    material_type:
    suggested_bucket:
  next_step:
    skill:
    reason:
    user_decision_needed:
```

## 使用规则

1. 不知道的字段保留空值，不要编造。
2. 每个阶段只更新自己负责的字段。
3. 涉及发布、归档、是否重写等关键判断时，必须保留 `user_decision_needed`。
4. 如果内容涉及 Human3.0，必须填写 `long_term_value` 或说明为什么没有长期沉淀价值。
5. 多平台分发不要覆盖主平台判断，应写入 `distribution.secondary_platforms`。

## 阶段负责字段

| 阶段 | 主要负责字段 |
| --- | --- |
| 路由 | `request`、`distribution`、`next_step` |
| 探脉/定题 | `topic`、`audience`、`next_step` |
| 立骨/起稿 | `outline`、`draft` |
| 诊文 | `diagnosis`、`archive`、`next_step` |
| 出刊 | `publish_assets`、`distribution`、`archive` |
| 归档 | `archive` |

