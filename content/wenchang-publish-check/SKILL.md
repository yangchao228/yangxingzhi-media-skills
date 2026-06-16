---
name: wenchang-publish-check
description: 内容发布前检查清单。检查标题、摘要、封面、配图、标签、平台适配、分发文案和 Human3.0 归档建议。
---

# 文昌·出刊

## 目标

在内容发布前做最后一轮检查，确保文章不是“写完了就发”，而是具备标题、封面、配图、摘要、标签、分发和归档这些发布资产。

公众号文章如果需要搜索流量，出刊阶段必须同时检查微信搜一搜友好度。规则来源保留在 `weixin/如何让公众号文章获取更多搜索流量|微信搜一搜.md`；本 skill 只保留压缩后的执行清单，不复制原文。

## 输入

- 待发布正文
- 已有 `content_state`，如果有
- 目标平台：公众号 / 知乎 / 小红书 / 多平台
- 已有标题、封面、配图、标签、摘要，缺失项可自动识别

## 上下文隔离规则

出刊只读取最终待发布正文、`content_state.diagnosis`、`content_state.publish_assets`、`content_state.distribution` 和用户明确指定的平台要求。

不要回到选题、采证或写作阶段重新改文章。若发现正文质量问题、事实缺口或篇幅不适合平台，应退回 `wenchang-review` 或 `wenchang-research`，不要在出刊阶段自行重写。

## 检查清单

### 公众号

- 标题是否清晰、有承诺、不标题党
- 摘要是否能说明读者收益
- 开头 300 字是否能留住人
- 是否需要同时生成“搜索友好标题”和“朋友圈传播标题”
- 是否需要补齐微信搜一搜摘要、核心关键词、正文关键词补强建议
- 配图是否齐全，是否需要 `md-img-r2` 上传为公开 URL
- 朋友圈转发文案是否自然
- 是否适合进入 Human3.0 成书审查

### 公众号搜一搜优化

搜一搜是效率搜索场景。标题、摘要和正文首屏要让用户快速判断：这篇文章回答什么问题、是否可信、是否值得点。

检查规则：

- 标题要清晰、简洁、直接，呈现文章主旨和关键信息。
- 标题优先包含主关键词、对象、场景或结果；不要只写情绪钩子。
- 避免标题党、震惊体、故意隐瞒关键信息、标题与正文不匹配。
- 避免关键词堆砌、无意义符号、过长标题、过短标题。
- 一篇文章只押一个主关键词，副关键词 2-4 个即可。
- 开头 100-150 字内自然出现核心关键词，并说明文章解决的问题。
- 正文围绕一个主题展开，避免拼盘式内容。
- 内容要有判断、论据、案例、表格、步骤、决策标准等可用信息。
- 图片、视频、表格前后要有文字说明，帮助搜索引擎理解资源内容。
- 优先建议声明原创；搬运或泛泛复述不利于搜索流量沉淀。
- 排版要有分段、小标题和少量重点句；不要满屏加粗或让广告营销内容压在正文前面。

输出时区分两类标题：

- 搜索友好标题：关键词前置，清晰说明主题和收益。
- 朋友圈传播标题：允许更有情绪和系列感，但不能误导。

### 知乎

- 问题意识是否明确
- 结论是否先行
- 争议点是否可讨论
- 标题是否像知乎问题/判断，而不是公众号标题
- 是否有真实经验或案例

### 小红书

- 封面标题是否有点击理由
- 7/8/9 张图文结构是否完整
- 每页是否只讲一个点
- 爆款标题候选是否至少 3 个，且角度有区分
- 正文描述是否适合小红书语气，能承接图文内容
- 热门话题标签是否齐全，是否同时覆盖主题词、场景词和人群词
- 评论区引导是否齐全
- 是否需要转 `xiaohongshu-viral-image-skill-v4`

## 输出格式

```md
## 发布结论
- 建议：可发布 / 补齐后发布 / 暂不发布
- 阻塞项：

## 必补项
- [ ] <项目>
- [ ] <项目>

## 建议优化
- <建议>
- <建议>

## 平台发布包
- 标题：
- 搜索友好标题：
- 朋友圈传播标题：
- 摘要/导语：
- 搜一搜摘要：
- 核心关键词：
- 正文关键词补强建议：
- 标签/话题：
- 转发文案：
- 评论区引导：

### 小红书发布包
- 爆款标题候选：
  1. <候选标题 1>
  2. <候选标题 2>
  3. <候选标题 3>
- 正文描述：
- 热门话题标签：
- 评论区引导：

## 归档建议
- 是否建议进入 Human3.0 成书审查：
- 建议沉淀为：
- 已确认的用户决策：

## content_state 更新
```yaml
content_state:
  publish_assets:
    title:
    search_title:
    social_title:
    summary:
    search_summary:
    search_keywords: []
    body_keyword_notes: []
    cover_text:
    tags: []
    images: []
    share_copy:
    comment_prompt:
    wechat_search:
      source_reference: weixin/如何让公众号文章获取更多搜索流量|微信搜一搜.md
      title:
      summary:
      keywords: []
      body_keyword_notes: []
      opening_notes:
      originality_recommendation:
    xiaohongshu:
      title_candidates: []
      body_description:
      hot_topic_tags: []
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
  decisions:
    - stage:
      question:
      user_choice:
      timestamp:
      impact:
  next_step:
    skill:
    reason:
    user_decision_needed:
  handoff:
    from_stage: 出刊
    to_stage:
    accepted_inputs: []
    ignored_context: []
    stop_condition:
```
```

## 边界

- 不要替用户点击发布。
- 不要为了发布而降低内容质量判断。
- 缺关键素材时直接列阻塞项，不要假装已齐全。
- 不要为了搜一搜优化堆关键词、改成标题党，或让标题承诺超过正文实际内容。
