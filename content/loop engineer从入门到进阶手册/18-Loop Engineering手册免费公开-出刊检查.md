# 《Loop Engineering 从入门到进阶手册》免费公开｜出刊检查

## 发布结论

- 建议：补齐后发布。
- 正文状态：轻改完成，可以作为公众号首发母稿。
- 当前阻塞项：
  1. Superman 线上橙皮书仍是旧的 9 章版本；本地工作树才是新增 `loop-builder`、UI 精准复刻和第 10 章的 v1.1。
  2. 现有 PDF / DOCX 生成于 2026-06-18，早于 2026-07-12 的主稿更新，不能作为当前 v1.1 对外下载版。
  3. 现有导出脚本未处理书内图片，重新导出前需要补齐图片嵌入或明确 PDF 采用无图版。
  4. 正式电子书封面与公众号发布封面尚未完成。
  5. 正文中的统一公开页链接仍是占位符。

## 已核对的公开入口

- 计划作为权威在线版的地址：<https://yangxingzhi.reai.group/zh/orange-books/loop-engineering-handbook>
- 2026-07-12 实测：HTTP 200，可访问。
- 线上内容状态：旧版 9 章结构，第 6 章仍是 Codex CI 自动修复，第 9 章为 Agent Harness。
- Superman 本地内容状态：10 章 v1.1，已包含 `loop-builder`、CI 自动修复、UI 精准复刻和第 10 章，但改动尚未提交和生产部署。

## 必补项

- [ ] 在 Superman 仓完成 v1.1 中文橙皮书同步验证、提交和生产部署。
- [ ] 部署后用线上页面确认目录为 10 章，并抽查三张 UI 实践图。
- [ ] 更新 PDF 下载版，确保内容、目录、图片和版本号与在线版一致。
- [ ] 决定 DOCX 是否继续公开；若只用于投稿，可不放在公开页。
- [ ] 制作正式电子书封面和公众号横版封面。
- [ ] 将公众号正文链接占位符替换为已部署的个人站地址。
- [ ] 从未登录窗口和手机网络验证页面、图片与 PDF 下载。

## 建议优化

- 公开页以个人站为权威母版，PDF作为便携下载版，GitHub只承接 `loop-builder` 和版本协作，避免三个入口互相竞争。
- 公众号文章只链接个人站橙皮书页面；PDF、模板包、`loop-builder` 和更新记录由个人站统一分发。
- 当前文章约 3500 字，保留其独立阅读价值。公众号手机预览时重点检查前三屏节奏和三张图之间的留白。
- 线上页面建议加入清晰的 `v1.1`、更新时间、完整目录、PDF 下载和反馈入口。
- PDF 导出不应把 Markdown 图片语法当普通文字输出。若暂时无法嵌图，先只发布完整在线版，并从宣传稿中临时删去“PDF 下载版”。

## 平台发布包

- 正文源文件：`16-Loop Engineering手册免费公开-公众号初稿.md`
- 推荐标题：`AI Agent 如何从提示词走向可控工作流？《Loop Engineering 从入门到进阶手册》免费公开`
- 搜索友好标题：`Loop Engineering 实战手册免费公开：AI Agent 从提示词到可控工作流`
- 朋友圈传播标题：`我把 Loop Engineering 写成了一本免费手册：10 章、2 个案例、13 组模板`
- 摘要：`从 Prompt 到可控 Agent Loop，一套持续工作系统需要目标、状态、反馈、停止规则和人的判断边界。《Loop Engineering 从入门到进阶手册》公开版 v1.1 完整免费开放，包含 10 章、两种真实实践、7 天落地计划和 13 组模板。`
- 搜一搜摘要：`Loop Engineering 是什么，AI Agent 如何从一次性提示词升级为可验证、可停止、可纠错的工作流？本文发布一套免费实战手册，包含模式决策、三角色闭环、Codex 案例、loop-builder 和模板包。`
- 核心关键词：`Loop Engineering`、`AI Agent`、`Agent Loop`、`Codex`、`Prompt Engineering`
- 正文关键词补强建议：无需堆词；主标题、第二屏、章节结构和图片说明已自然覆盖核心概念。
- 封面文案：

```text
Loop Engineering
从入门到进阶手册
完整电子书免费公开
```

- 标签/话题：`Loop Engineering`、`AI Agent`、`Agent Loop`、`Codex`、`AI 编程`、`个人系统`
- 转发文案：使用 `16-Loop Engineering手册免费公开-发布策划.md` 中的朋友圈版本 1。
- 评论区引导：`你最想把哪个真实任务做成 Loop？如果已经跑过，也欢迎留下失败信号、验收方式和停止规则。`

## 微信搜一搜检查

- 主关键词：`Loop Engineering`
- 次关键词：`AI Agent`、`Agent Loop`、`Codex`
- 标题：关键词、对象和结果明确，没有隐藏“免费公开”这一关键信息。
- 开头：第一屏出现 `AI Agent`，随后说明 Loop Engineering 解决的问题。
- 正文：包含判断标准、模式、角色、案例、行动步骤和公开资产，能够独立回答搜索问题。
- 图片：三张图前后都有文字解释和准确 alt 文本。
- 原创建议：公众号发布时声明原创。
- 风险：标题偏长，但信息完整；发布前在公众号后台检查是否被截断。

## 小红书发布包

- 爆款标题候选：
  1. 我把 Agent Loop 写成了一本免费手册
  2. AI Agent 总失控？先补这 4 条规则
  3. 10 章讲透 Loop Engineering，完整免费
- 正文描述：`从 Prompt 到 Agent Loop，我把任务判断、六块积木、五种模式、三角色闭环、CI 修复、UI 复刻和 13 组模板整理成了一本完整手册。公开版 v1.1 免费阅读，适合正在用 Codex、Claude Code、Cursor，又想把一次性 AI 对话沉淀成长期工作流的人。`
- 热门话题标签：`#LoopEngineering #AIAgent #AgentLoop #Codex #AI编程 #个人系统 #电子书`
- 评论区引导：`你最想把哪个重复任务做成自己的第一个 Loop？`

## 归档建议

- 是否建议进入 Human3.0 成书审查：不重复进入书稿正文，作为发布资产默认归档。
- 建议沉淀为：电子书公开发布母稿、个人品牌公开作品案例、多平台分发源、系列成书 SOP。
- 已确认的用户决策：默认归档（用户未撤销）。

## content_state 更新

```yaml
content_state:
  publish_assets:
    body_file: content/loop engineer从入门到进阶手册/16-Loop Engineering手册免费公开-公众号初稿.md
    title: AI Agent 如何从提示词走向可控工作流？《Loop Engineering 从入门到进阶手册》免费公开
    search_title: Loop Engineering 实战手册免费公开：AI Agent 从提示词到可控工作流
    social_title: 我把 Loop Engineering 写成了一本免费手册：10 章、2 个案例、13 组模板
    summary: 从 Prompt 到可控 Agent Loop，完整免费公开一套包含结构、模式、实战和模板的电子书。
    search_summary: Loop Engineering 是什么，AI Agent 如何从提示词升级为可验证、可停止、可纠错的工作流？
    search_keywords:
      - Loop Engineering
      - AI Agent
      - Agent Loop
      - Codex
      - Prompt Engineering
    body_keyword_notes:
      - 保持自然出现，不新增关键词堆砌
      - 图片前后保留解释文字和准确 alt
    cover_text: Loop Engineering 从入门到进阶手册｜完整电子书免费公开
    tags:
      - Loop Engineering
      - AI Agent
      - Agent Loop
      - Codex
      - AI 编程
      - 个人系统
    images:
      - book-v1/images/01-four-layer-evolution.png
      - book-v1/images/06-loop-pattern-decision.png
      - book-v1/images/08-ci-inspection-loop.png
    share_copy: 使用发布策划中的朋友圈版本 1
    comment_prompt: 你最想把哪个真实任务做成 Loop？
    wechat_search:
      source_reference: weixin/如何让公众号文章获取更多搜索流量|微信搜一搜.md
      title: Loop Engineering 实战手册免费公开：AI Agent 从提示词到可控工作流
      summary: Loop Engineering 是什么，AI Agent 如何从提示词升级为可验证、可停止、可纠错的工作流？
      keywords:
        - Loop Engineering
        - AI Agent
        - Agent Loop
        - Codex
      body_keyword_notes:
        - 正文单主题围绕可控 Agent Loop 展开
        - 保留判断、案例、步骤和模板价值
      opening_notes: 第一屏先写重复解释、人工调度和验收痛点，第二屏宣布完整免费公开
      originality_recommendation: 建议声明原创
    xiaohongshu:
      title_candidates:
        - 我把 Agent Loop 写成了一本免费手册
        - AI Agent 总失控？先补这 4 条规则
        - 10 章讲透 Loop Engineering，完整免费
      body_description: 完整免费公开一套 Agent Loop 实战手册，包含结构、模式、两个案例、7 天计划和 13 组模板。
      hot_topic_tags:
        - Loop Engineering
        - AI Agent
        - Agent Loop
        - Codex
        - AI 编程
      comment_prompt: 你最想把哪个重复任务做成自己的第一个 Loop？
  distribution:
    primary_platform: 微信公众号
    secondary_platforms:
      - Superman 个人站
      - 知乎
      - 小红书
      - 微信读书
    card_skill: wechat-to-cards
    image_skill: xiaohongshu-viral-image-skill-v4
  archive:
    should_review_for_book: false
    material_type: 电子书发布资产
    suggested_bucket: Loop Engineering 公开发布与个人品牌
  decisions:
    - stage: 归档
      question: 是否归档
      user_choice: 默认归档（用户未撤销）
      timestamp: 2026-07-12
      impact: 发布母稿和发布包作为长期资产维护
  next_step:
    skill: null
    reason: 需要先完成个人站生产部署、最新版 PDF 和封面，随后才能最终发布
    user_decision_needed: true
  handoff:
    from_stage: 出刊
    to_stage: 配图/发布准备
    accepted_inputs:
      - 已通过诊文的公众号正文
      - Superman 本地 v1.1 橙皮书
      - 电子书封面提示词
      - 最新 Markdown 主稿
    ignored_context:
      - 旧版 9 章线上内容
      - 2026-06-18 PDF 和 DOCX
      - 试读与关键词领取方案
    stop_condition: 未经用户确认不得生产部署、生成最终封面或对外发布
```
