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
  research:
    sources: []
    key_facts: []
    contrarian_points: []
    usable_quotes: []
    contradictions: []
    confidence:
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
  handoff:
    from_stage:
    to_stage:
    accepted_inputs: []
    ignored_context: []
    stop_condition:
```

## 使用规则

1. 不知道的字段保留空值，不要编造。
2. 每个阶段只更新自己负责的字段。
3. 涉及发布、归档、是否重写等关键判断时，必须保留 `user_decision_needed`。
4. 如果内容涉及 Human3.0，必须填写 `long_term_value` 或说明为什么没有长期沉淀价值。
5. 多平台分发不要覆盖主平台判断，应写入 `distribution.secondary_platforms`。
6. 每次跨阶段都要输出 `handoff`，明确下一阶段应该读取什么、忽略什么、何时停止。

## 阶段负责字段

| 阶段 | 主要负责字段 |
| --- | --- |
| 路由 | `request`、`distribution`、`next_step` |
| 探脉/定题 | `topic`、`audience`、`next_step` |
| 采证 | `research`、`next_step` |
| 立骨/起稿 | `outline`、`draft` |
| 诊文 | `diagnosis`、`archive`、`next_step` |
| 出刊 | `publish_assets`、`distribution`、`archive` |
| 归档 | `archive` |

## 阶段合同

阶段合同用于约束每个 skill 的读写边界，避免所有 skill 都重新理解、重写、重判。

| 阶段 | 主要读取 | 允许写入 | 不应该做 |
| --- | --- | --- | --- |
| 路由 | `request`、用户原始输入 | `request`、`distribution`、`next_step` | 直接生成终稿 |
| 探脉/定题 | `request`、`audience`、用户素材 | `topic`、`audience`、`next_step` | 替用户最终拍板不可逆发布决策 |
| 采证 | `topic`、`outline`、用户素材 | `research`、`next_step` | 写正文、排版、虚构来源 |
| 立骨/起稿 | `topic`、`audience`、`research` | `outline`、`draft`、`next_step` | 重新发明研究结论 |
| 诊文/整章 | `topic`、`research`、`draft` | `diagnosis`、必要时更新 `draft`、`next_step` | 为了润色保留无证据断言 |
| 出刊 | `draft`、`diagnosis`、`publish_assets` | `publish_assets`、`distribution`、`archive`、`next_step` | 自动发布或降低质量门槛 |
| 归档 | 全量状态和最终稿 | `archive` | 把低价值热点强行入库 |

## 交接包

文昌当前可以在一个 agent 中运行，但每个阶段都要按“伪多 agent”方式交接：下一阶段只读取交接包和允许字段，不继承前一阶段的隐含推理。

标准交接包：

```yaml
handoff:
  from_stage:
  to_stage:
  accepted_inputs:
    - content_state 中允许读取的字段
    - 上一阶段正式输出
    - 用户明确新增的材料
  ignored_context:
    - 未结构化的旧聊天过程
    - 已被淘汰的旧角度
    - 其他阶段的推理草稿
  stop_condition:
```

使用规则：

1. `accepted_inputs` 只列下一阶段完成任务必需的信息。
2. `ignored_context` 必须列出容易污染判断的旧信息，例如废弃标题、未确认观点、旧版草稿。
3. 下一阶段如果发现交接包缺关键字段，应返回 `user_decision_needed`，不要自行补编。
4. 阶段输出应面向下一阶段，而不是解释自己完整思考过程。
5. 如果未来拆成真正多 agent，`handoff + content_state` 就是 agent 间协议。

## 采证要求

当内容包含趋势判断、产品判断、方法论判断或 Human3.0 主线判断时，优先补 `research`。最小可用研究包至少包含：

- 3 条关键事实或案例。
- 1 条反向数据或限制条件。
- 来源口径和可信度判断。
- 找不到证据时的明确说明。
