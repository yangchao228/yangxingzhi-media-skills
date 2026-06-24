# publish expected

## 发布结论

- 建议：补齐后发布
- 阻塞项：缺封面图、正文配图、最终标题确认

## 必补项

- [ ] 确认最终标题。
- [ ] 补一张公众号封面图。
- [ ] 若正文插图使用本地图片，发布前走 `md-img-r2` 上传公开 URL。

## 平台发布包

- 标题：AI 记忆不是功能升级，而是个人工作系统的底层变化
- 摘要/导语：AI 记住你的偏好只是表层。真正重要的是，普通人开始拥有一套可复用的长期上下文系统。
- 标签/话题：AI工具、Human3.0、认知主权、个人知识库、数字生产资料
- 转发文案：以前我们用 AI，总是在重复解释自己。现在真正值得管理的，是哪些记忆有资格进入你的工作系统。
- 评论区引导：你希望 AI 长期记住你什么？又有哪些信息绝不能交给它保存？

## 归档建议

- 是否建议进入 Human3.0 成书审查：建议
- 建议沉淀为：个人数字生产资料 / 认知主权 / AI 工作系统案例
- 已确认的用户决策：默认归档（用户未撤销）

## content_state 更新

```yaml
content_state:
  publish_assets:
    title: AI 记忆不是功能升级，而是个人工作系统的底层变化
    summary: AI 记住你的偏好只是表层。真正重要的是，普通人开始拥有一套可复用的长期上下文系统。
    cover_text: AI 记忆正在重写个人工作系统
    tags: [AI工具, Human3.0, 认知主权, 个人知识库, 数字生产资料]
    images: []
    share_copy: 以前我们用 AI，总是在重复解释自己。现在真正值得管理的，是哪些记忆有资格进入你的工作系统。
    comment_prompt: 你希望 AI 长期记住你什么？又有哪些信息绝不能交给它保存？
  distribution:
    primary_platform: 公众号
    secondary_platforms: [知乎, 小红书]
    card_skill: long-to-cards
    image_skill: xiaohongshu-viral-image-skill-v4
  archive:
    should_review_for_book: true
    material_type: 案例/方法论
    suggested_bucket: Human3.0/认知主权/个人数字生产资料
  next_step:
    skill: human3-book-guardian-v6
    reason: 文章服务 Human3.0 主线，默认进入素材库 / 成书审查；不等于最终入书或公开上架
    user_decision_needed: false
  decisions:
    - stage: 归档
      question: 是否进入 Human3.0 成书审查
      user_choice: 默认归档（用户未撤销）
      timestamp: 2026-05-25
      impact: 自动进入素材库 / 成书审查候选，不替用户最终入书
  handoff:
    from_stage: 出刊
    to_stage: 归档
    accepted_inputs:
      - 编辑后正文
      - publish_assets
      - archive
      - 用户最终发布判断
    ignored_context:
      - 发布前已判定不使用的标题
      - 初稿中已删除的段落
      - 未上传的本地图片占位
    stop_condition: 默认进入素材库 / 成书审查候选，不替用户最终入书
```
