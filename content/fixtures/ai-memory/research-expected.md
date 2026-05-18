# research expected

## 采证结论

- 是否足够支撑写作：足够
- 主要原因：主流 AI 产品已经把“保存信息”和“引用过往对话”产品化，但控制权、可见性、适用范围和删除机制仍然是这篇文章必须保留的反向证据。

## 来源清单

1. OpenAI Help Center Memory FAQ：说明 ChatGPT 记忆分为 saved memories 与 reference chat history，以及用户控制、删除和来源展示。
2. OpenAI Blog Memory and new controls for ChatGPT：说明 2025-04-10 更新后，ChatGPT memory 更全面，会引用过往对话。
3. Anthropic Claude memory：说明 Claude 在 Team 和 Enterprise 场景推出 memory，重点是工作上下文与偏好。
4. Google Gemini Apps Help：说明 Gemini 的 saved info 和 past chats 机制，以及适用账号和计划限制。

## 关键事实

- ChatGPT memory 包含 saved memories 与 reference chat history。
- 2025-04-10 后 ChatGPT memory 更全面，会引用过往对话。
- Claude memory 面向 Team 和 Enterprise，强调工作上下文。
- Gemini saved info 与 past chats 有账号和计划限制。

## 反向数据 / 限制条件

- 记忆不会保留每个细节，重要信息仍应使用 saved memories。
- 完全删除个性化信息可能需要同时处理 saved memories、原始聊天、文件库和连接应用。
- 不同产品的记忆能力存在计划和账号限制。

## 可引用句子

> AI 记忆真正改变的不是模型回答，而是人和系统之间的连续性。

## 矛盾点

- 产品都强调“用户可控”，但删除、关闭、来源展示和实际引用范围并不完全等价。

## content_state 更新

```yaml
content_state:
  research:
    sources:
      - OpenAI Help Center Memory FAQ
      - OpenAI Blog Memory and new controls for ChatGPT
      - Anthropic Claude memory
      - Google Gemini Apps Help
    key_facts:
      - ChatGPT memory 包含 saved memories 与 reference chat history
      - 2025-04-10 后 ChatGPT memory 更全面，会引用过往对话
      - Claude memory 面向 Team 和 Enterprise，强调工作上下文
      - Gemini saved info 与 past chats 有账号和计划限制
    contrarian_points:
      - 记忆不会保留每个细节
      - 完全删除个性化信息可能需要处理多处来源
      - 不同产品的能力存在计划和账号限制
    usable_quotes:
      - AI 记忆真正改变的不是模型回答，而是人和系统之间的连续性。
    contradictions:
      - 产品可控性与实际删除、关闭、来源展示之间存在操作复杂度
    confidence: High
  next_step:
    skill: wechat-writing-skill-ai-human3
    reason: 研究包已足够支撑一篇公众号判断文
    user_decision_needed: false
  handoff:
    from_stage: 采证
    to_stage: 起稿
    accepted_inputs:
      - content_state.topic
      - content_state.audience
      - content_state.research
      - 用户给定的 Human3.0 长期方向
    ignored_context:
      - 没有来源的“AI 会越来越懂我们”式泛化表达
      - 把 memory 写成纯产品功能教程的角度
      - 未确认的夸张效率数字
    stop_condition: 输出公众号初稿，不做最终发布判断
```
