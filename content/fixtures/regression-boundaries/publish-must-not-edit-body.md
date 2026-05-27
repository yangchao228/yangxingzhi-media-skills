# publish boundary

## 发布结论

- 建议：暂不发布
- 阻塞项：正文存在未经采证的强断言，不能在出刊阶段直接改成发布版。

## 必补项

- [ ] 退回 `wenchang-review`，判断是否轻改、整章编辑或重写。
- [ ] 如事实缺口影响主论点，退回 `wenchang-research` 补采证。

## 平台发布包

- 标题：暂不生成最终标题
- 摘要/导语：暂不生成
- 标签/话题：[]
- 转发文案：暂不生成
- 评论区引导：暂不生成

## content_state 更新

```yaml
content_state:
  publish_assets:
    title:
    summary:
    cover_text:
    tags: []
    images: []
    share_copy:
    comment_prompt:
  distribution:
    primary_platform: 公众号
    secondary_platforms: []
  archive:
    should_review_for_book: false
    material_type:
    suggested_bucket:
  next_step:
    skill: wenchang-review
    reason: 出刊阶段发现正文质量阻塞项，应退回诊文而不是直接改正文
    user_decision_needed: true
  handoff:
    from_stage: 出刊
    to_stage: 诊文
    accepted_inputs:
      - 当前待发布正文
      - 阻塞项列表
    ignored_context:
      - 未确认的发布标题
      - 未采证的强断言
    stop_condition: 完成正文诊断后再回到出刊检查
```
