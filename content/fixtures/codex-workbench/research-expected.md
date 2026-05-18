# research expected

case_type: external-article

## 采证结论

- 是否足够支撑写作：足够
- 主要原因：原文提供了完整的一手使用链路，足以支撑“从聊天框到工作台”的判断；但它是个人经验，不应写成所有用户都会立刻拥有同等能力。

## 来源清单

1. Jason Liu: Codex-maxxing。一手使用经验，覆盖 durable threads、voice input、steering、memory、computer/browser use、remote control、heartbeats、goals、side panel。
2. 原文 memory 部分：Obsidian vault、AGENTS.md、GitHub repo、diff review，可支撑“memory 应该文件化、可审查”。
3. 原文 heartbeats 部分：Slack/Gmail、PR feedback、render feedback、refund 等例子，可支撑“工作变成持续循环”。

## 关键事实

- Codex 被用于 slide deck、PDF、spreadsheet、index.html 等知识工作 artifact。
- durable threads 承载长期工作流。
- memory 通过 Obsidian vault 和 GitHub diff 变成可审查资产。
- heartbeats 让线程能定时检查反馈和推进任务。
- side panel 让 artifact 可检查、可批注、可操作。

## 反向数据 / 限制条件

- 长线程可能带来更高成本。
- 工作流依赖本地权限和工具连接。
- memory 需要人工审查，不能只留在对话历史。

## 可引用句子

> 工作不再死在一次 prompt 里。

## 矛盾点

- 自动持续推进和人工判断权必须同时存在。

## content_state 更新

```yaml
content_state:
  research:
    sources:
      - Jason Liu Codex-maxxing
    key_facts:
      - Codex 被用于 slide deck、PDF、spreadsheet、index.html 等知识工作 artifact
      - durable threads 承载长期工作流
      - memory 通过 Obsidian vault 和 GitHub diff 变成可审查资产
      - heartbeats 让线程能定时检查反馈和推进任务
      - side panel 让 artifact 可检查、可批注、可操作
    contrarian_points:
      - 长线程可能带来更高成本
      - 工作流依赖本地权限和工具连接
      - memory 需要人工审查，不能只留在对话历史
    usable_quotes:
      - 工作不再死在一次 prompt 里。
    contradictions:
      - 自动持续推进和人工判断权必须同时存在
    confidence: High
  next_step:
    skill: wechat-writing-skill-ai-human3
    reason: 研究包已足够支撑一篇 Human3.0 判断文
    user_decision_needed: false
  handoff:
    from_stage: 采证
    to_stage: 起稿
    accepted_inputs:
      - content_state.topic
      - content_state.research
      - content_state.audience
    ignored_context:
      - 原文细节逐段翻译
      - 纯 Codex 教程写法
      - 无人工判断权的全自动叙事
    stop_condition: 输出公众号初稿，不做发布判断
```
