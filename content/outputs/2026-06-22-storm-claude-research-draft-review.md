# Stanford STORM x Claude 研究方法公众号稿诊文

日期：2026-06-22
阶段：文昌总控 / 诊文
诊断对象：`content/outputs/2026-06-22-storm-claude-research-wechat-draft.md`
配套资料包：`content/outputs/2026-06-22-storm-research-template-lead-magnet.md`

## 诊断结论

- 建议动作：轻改后进入出刊检查。
- 主要原因：主线成立，读者获得感明确，资料包钩子可以承接关注转化；事实边界也已经处理，没有把 4 个 Prompt 写成完整 STORM 系统。

## 核心问题

1. 标题还需要最终确认。当前首选标题稳，但传播张力略保守；如果追求点击，可以在“搜索框”和“研究流程”之间做更强对比。
2. 正文偏方法论，真人场景略少。如果要更像作者自己的长期系统，可以加入一个真实场景：写选题前、做产品判断前、准备访谈前，如何跑这套四步。
3. 资料包钩子已经清楚，但发布时需要确定后台关键词、领取路径和资料包文件格式，避免读者关注后找不到资料。

## 最小修改建议

1. 保留当前文章结构，不建议重写。
2. 发布前从标题备选里选 1 个主标题和 1 个副标题。
3. 在正文第 2 节后可补 1 个作者使用场景，增强真人感；如果暂时没有真实案例，可以先不补，避免编造。
4. 出刊包里明确：后台回复关键词为“研究模板”，领取内容为《AI 研究四步模板》。
5. 资料来源保留在文末或出刊包，不要挤进正文中段。

## 平台适配

- 公众号：适合。文章有方法论、事实来源、可领取资料，适合作为增长型专栏文。
- 知乎：可改成问题型标题，例如“如何用 AI 做真正有深度的研究？”正文可保留，资料领取 CTA 要弱化。
- 小红书：适合拆成 8 页卡片，主题为“别再让 AI 直接总结了”。每页讲一个动作：主题、五视角、矛盾地图、研究简报、可信度评审、证据日志、使用场景、领取模板。

## 长期资产判断

- 是否适合沉淀：适合。
- 可沉淀为：个人研究 SOP、Prompt 模板库、AI 写作/选题前置流程、Human3.0 认知主权素材。
- 是否建议进入 Human3.0 成书审查：建议作为“个人研究系统 / 认知主权”方向素材保留，等系列累计 3-5 篇后再集中审查。

## content_state 更新

```yaml
content_state:
  diagnosis:
    recommendation: "轻改后进入出刊检查"
    key_issues:
      - "标题需要最终确认"
      - "真人使用场景可选补强"
      - "资料包领取路径需要出刊前确认"
    minimum_fixes:
      - "确定主标题和副标题"
      - "确认后台关键词：研究模板"
      - "出刊包注明资料包文件和领取方式"
  archive:
    should_review_for_book: true
    material_type: "方法论 / 个人研究系统"
    suggested_bucket: "Human3.0 / 认知主权 / 数字生产资料"
  decisions:
    - stage: "起稿"
      question: "是否把可复制模板作为关注送资料钩子"
      user_choice: "是，作为关注送资料钩子"
      timestamp: "2026-06-22"
      impact: "新增独立资料包，并在正文前段和文末承接领取"
  next_step:
    skill: "wenchang-publish-check"
    reason: "进入出刊检查，确认标题、摘要、封面、关键词、资料领取路径和平台发布资产"
    user_decision_needed: true
  handoff:
    from_stage: "诊文"
    to_stage: "出刊"
    accepted_inputs:
      - "content/outputs/2026-06-22-storm-claude-research-wechat-draft.md"
      - "content/outputs/2026-06-22-storm-research-template-lead-magnet.md"
      - "content/outputs/2026-06-22-storm-claude-research-source-pack.md"
    ignored_context:
      - "不补没有真实依据的个人案例"
    stop_condition: "需要确认最终标题和资料领取路径"
```

