# AI Visibility Baseline 公众号稿诊文记录

日期：2026-09-20  
目标平台：微信公众号  
诊断对象：`content/ai-distribution/articles/02-ai-visibility-baseline-wechat.md`

## 诊断结论

- 建议动作：整章编辑后进入出刊。
- 主要原因：用户原稿的核心观察成立，五层框架有记忆点，也能落到企业动作；首稿存在模板化开场、层级之间边界不够清晰、平台机制容易被读成官方规则的问题，已在正文中统一收紧。

## 核心问题

1. 开头使用了“我最近越来越觉得”，缺少具体场景，已改为客户任务场景。
2. Ranking、Mention、Citation、Recommendation、Conversion 在原稿中解释清楚，但缺少“为什么会断在这里”的业务例子，已补充中国行程和内容/服务差异。
3. “Google AI Mode 仍依赖排名”和“AI 推荐机制”属于易变产品事实，联网复核失败，已改为谨慎表述并放入资料入口和发布前复核项。
4. 原稿的 AI Visibility Baseline 有方向，但缺测试字段、重复方法和单次结果边界，已补齐。
5. 文章容易被读成“多写 GEO 内容就能获得推荐”，已增加产品匹配、信息准确度和行动系统的缺口诊断。

## 已执行的整章处理

1. 用一个带目的、预算和限制的真实客户问题替代泛背景开场。
2. 把文章主线压缩为“排名是底座，推荐要经过四层额外判断”。
3. 为每一层增加一个读者收益型小标题和一个明确问题。
4. 增加“3 次误判”和“5 种内容”两个可收藏模块。
5. 把 20～50 个问题的基线测试写成四步执行法。
6. 将五层模型明确标注为作者工作框架，不冒充平台官方标准。
7. 删除或改写模板化句式，包括“我最近越来越觉得”和“不是……而是……”。
8. 结尾收束到 AI 可见性系统，保留评论区问题作为互动入口。

## 平台适配

- 公众号：适合。首屏冲突清楚，五层模型适合收藏，Baseline 方法适合转发。
- 知乎：可改为“Google 排名第一，为什么 AI 仍然不推荐？”的问题型回答。
- 小红书：可拆为 8 页竖版卡片，重点保留五层路径、三次误判和四步 Baseline。

## 长期资产判断

- 是否适合沉淀：适合。
- 可沉淀为：AI Distribution 系列第二篇、品牌 AI 可见性基线模板、Human3.0 的组织分发系统案例。
- 是否建议进入 Human3.0 成书审查：是。
- 边界：归档表示进入素材审查，不代表最终入书、发布或公开上架。

## 反向证据自检

- 结果波动：保留。
- 指标非标准化：保留。
- 五层模型非官方标准：保留。
- 具体平台当前规则：降级为待发布前复核。
- 推荐不等于转化：保留。

## content_state 更新

```yaml
content_state:
  draft:
    status: "整章编辑完成"
    file: "content/ai-distribution/articles/02-ai-visibility-baseline-wechat.md"
    summary: "以客户任务场景解释 Google 排名与 AI 推荐的差异，建立 Ranking、Mention、Citation、Recommendation、Conversion 五层工作框架，并给出 AI Visibility Baseline 测试法"
  diagnosis:
    recommendation: "整章编辑后进入出刊"
    key_issues:
      - "原稿开头模板化"
      - "层级边界和业务断点需要强化"
      - "易变平台事实需降级表述"
    minimum_fixes:
      - "重写开头"
      - "增加可执行测量字段"
      - "明确模型非官方标准"
  next_step:
    skill: "wenchang-publish-check"
    reason: "进入标题、摘要、搜一搜关键词、视觉资产和归档检查"
    user_decision_needed: true
  handoff:
    from_stage: "诊文 / 整章"
    to_stage: "出刊"
    accepted_inputs:
      - "当前洁净正文"
      - "研究事实与限制条件"
      - "发布资产初稿"
    ignored_context:
      - "旧版模板化开场"
      - "把平台机制写成确定性排序规则"
      - "未经复核的当前产品细节"
    stop_condition: "出刊包完成后，在配图和最终发布处暂停"
```
