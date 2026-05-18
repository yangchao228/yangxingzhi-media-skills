# publish expected

case_type: draft-diagnostic

## 发布结论

- 建议：补齐后发布
- 阻塞项：缺封面图和小红书二次分发卡片结构。

## 必补项

- [ ] 封面图：内容系统不是提示词清单。
- [ ] 摘要确认。
- [ ] 如二次分发到小红书，拆成 7 页卡片。

## 平台发布包

- 标题：5 个 Agent 不重要，重要的是你终于有了自己的内容系统
- 摘要/导语：真正拉开创作者差距的，不是会不会复制 prompt，而是能不能把选题、研究、写作、编辑和发布沉淀成可复用系统。
- 标签/话题：AI写作、内容系统、Human3.0、数字生产资料、个人工作流
- 转发文案：一次提示词帮你写一篇文章。一套内容系统，才会帮你积累下一篇文章的生产资料。
- 评论区引导：你的内容生产里，哪一步最值得先沉淀成可复用流程？

## 归档建议

- 是否建议进入 Human3.0 成书审查：建议
- 建议沉淀为：个人内容系统 / 数字生产资料 / 人机边界案例

## content_state 更新

```yaml
content_state:
  publish_assets:
    title: 5 个 Agent 不重要，重要的是你终于有了自己的内容系统
    summary: 真正拉开创作者差距的，不是会不会复制 prompt，而是能不能把选题、研究、写作、编辑和发布沉淀成可复用系统。
    cover_text: 内容系统不是提示词清单
    tags: [AI写作, 内容系统, Human3.0, 数字生产资料, 个人工作流]
    images: []
    share_copy: 一次提示词帮你写一篇文章。一套内容系统，才会帮你积累下一篇文章的生产资料。
    comment_prompt: 你的内容生产里，哪一步最值得先沉淀成可复用流程？
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
    card_skill: long-to-cards
    image_skill: xiaohongshu-viral-image-skill-v4
  archive:
    should_review_for_book: true
    material_type: 方法论/案例
    suggested_bucket: Human3.0/数字生产资料/内容系统
  next_step:
    skill: human3-book-guardian-v6
    reason: 适合进入 Human3.0 内容生产系统素材库
    user_decision_needed: true
  handoff:
    from_stage: 出刊
    to_stage: 归档
    accepted_inputs:
      - 发布版正文
      - publish_assets
      - archive
    ignored_context:
      - 原稿替代团队叙事
      - 未采用 prompt 原文
      - 未生成的封面图
    stop_condition: 给出归档建议，不替用户入库
```
