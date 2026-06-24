---
name: wenchang-orchestrator
description: 文昌.skill 总控入口。根据用户输入选择完整内容流水线子路径，自动推进可自动阶段，并在选题确认、storm 研究分歧、采证不足、诊断重写、发布阻塞、配图等人工判断节点暂停；建议归档默认推进，除非用户明确撤销。
---

# 文昌总控

## 目标

文昌总控负责把一次内容需求推进成一条可执行流水线。它不是单个写作 prompt，而是阶段调度器。

总控默认自动推进可自动阶段；遇到需要用户判断的节点，必须暂停提问，等用户回复后再继续。

## 完整阶段池

```text
探脉 -> 定题 -> storm-research -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 -> 配图/卡片/上传 -> 归档
```

不要把完整链路简化成固定五步。总控必须先判断入口，再选择子路径。

## 入口判断

| 用户输入 | 入口阶段 | 默认子路径 |
| --- | --- | --- |
| 不知道写什么，只给方向 | 探脉 | 探脉 -> 定题 -> storm-research -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 -> 配图/卡片/上传 -> 归档 |
| 已有明确主题 | 定题 | 定题 -> storm-research -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 -> 配图/卡片/上传 -> 归档 |
| 给了外部文章/热点链接 | 定题 | 定题 -> storm-research -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 -> 配图/卡片/上传 -> 归档 |
| 已有初稿 | 诊文 | 诊文 -> 采证/整章/重写 -> 出刊 -> 配图/卡片/上传 -> 归档 |
| 只要求发布检查 | 出刊 | 出刊 -> 配图/卡片/上传 -> 归档 |
| 只要求搜一搜、搜索流量、微信搜索、SEO 标题、关键词标题优化 | 出刊 | 出刊 -> 配图/卡片/上传 -> 归档 |
| 只要求配图或卡片 | 配图/卡片 | 配图/卡片/上传 -> 出刊 |
| 只要求归档 | 归档 | 归档 |

## 自动推进规则

默认可以自动推进：

- 路由到下一阶段。
- 定题 brief 生成。
- storm-research 研究前置：多视角扫描、矛盾地图、可信度评审和采证计划。
- 采证。
- 立骨。
- 起稿。
- 诊文。
- 出刊检查。

默认不要自动执行：

- 最终发布。
- 最终入书、售卖或公开上架。
- 删除旧稿。
- 上传真实图片到外部服务，除非用户明确要求。

归档默认推进：当 `archive.should_review_for_book = true`，默认进入 Human3.0 素材库 / 成书审查，不再因为归档本身暂停等待确认。用户明确说“不归档 / 撤销归档 / 暂不沉淀”时再取消。

## 成本敏感执行规则

总控默认按成本敏感方式推进：先确认高返工风险节点，再生成大体量成品。

- 先判断入口和最小下一步，不在方向未定时生成全文、多平台版本、卡片或封面。
- 每个阶段只把下一阶段必要信息写入 `handoff`，优先传 `content_state`，不要传整段聊天历史。
- 生成卡片、封面、图片提示词、PNG 或调用 `md-img-r2` 前，必须先确认页数、结构、风格、输出形式和是否真的需要上传。
- 返工时优先局部修订；只有核心角度、平台定位或用户明确要求改变时，才允许完整重写。
- 如果一个阶段连续两次需要返工，先停下来复盘缺少的判断或验收标准，不继续消耗模型调用。

## 必须暂停的节点

遇到以下情况必须暂停，向用户提问：

1. `next_step.user_decision_needed = true`
2. 定题阶段出现多个可行选题，需要用户选一个
3. `storm_research.confidence_review.verification_needed` 包含关键事实，且缺少一手来源
4. storm-research 出现 3 个以上同等强度主切口，需要用户选主线
5. `research.confidence = Low`
6. 采证缺少反向证据，或关键来源不足
7. `diagnosis.recommendation` 为 `重写`、`暂不投入`、`转平台`
8. 整章前需要确认是否接受大幅删改
9. 出刊检查存在阻塞项，如缺标题、摘要、封面、配图、标签、搜索友好标题
10. 需要配图、卡片、上传外部图片或调用 `md-img-r2`
11. 用户明确要求先停

暂停时不要继续往后跑。

## content_state 规则

总控必须维护并持续更新 `content_state`。每一轮输出都要包含：

- 当前阶段
- 已完成阶段
- 下一步计划
- 是否需要用户确认
- `content_state`
- `handoff`

如果用户已经给了 `content_state`，只更新本轮确认的信息，不覆盖已有判断。

如果用户在本轮确认了标题、选题、重写方向、封面、卡片、上传或撤销归档选择，必须把该选择追加到 `content_state.decisions`，不要只写在自然语言说明里。

当归档由系统默认推进时，也要追加一条 `content_state.decisions`，记录 `stage: 归档`、`user_choice: 默认归档（用户未撤销）`，并保持 `next_step.user_decision_needed = false`，除非后续阶段还有其他阻塞项。

## 输出格式

```md
## 当前阶段
- 阶段：
- 入口类型：
- 当前链路：

## 已完成
- <本轮完成了什么>

## 需要你确认
- <如果不需要确认，写“暂无，下一步可自动推进”>

## 我建议
- <给出下一步判断>

## 用户回复后将执行
- <下一步 skill 或阶段>

## content_state
```yaml
content_state:
  request:
    raw_intent:
    current_stage:
    target_platforms: []
  storm_research:
    topic:
    purpose:
    perspectives: []
    contradiction_map:
      conflicts: []
      consensus: []
      blind_spots: []
    synthesis_brief:
      summary:
      key_findings: []
      hidden_connection:
      actionable_insight:
      frontier_question:
    confidence_review:
      scores: []
      weakest_claim:
      missing_perspectives: []
      verification_needed: []
    evidence_plan: []
  next_step:
    skill:
    reason:
    user_decision_needed:
  decisions:
    - stage:
      question:
      user_choice:
      timestamp:
      impact:
  handoff:
    from_stage:
    to_stage:
    accepted_inputs: []
    ignored_context: []
    stop_condition:
```
```

## 子 skill 调用建议
- <如果本轮需要调用子 skill，明确 skill 名和原因>
```

## storm-research 接入规则

- `storm-research` 是定题之后、采证之前的研究前置阶段，负责问题地图，不替代 `wenchang-research` 的事实核验。
- 当输入是外部项目、热点链接、趋势判断、产品问题、学习领域、模糊主题，或主题可能存在多个叙事角度时，默认加入 `storm-research`。
- 当用户已经给出成稿、只要求诊文、只要求发布检查、只要求配图或卡片时，不强行回到 `storm-research`。
- 如果 `storm_research.confidence_review.verification_needed` 为空，且主题偏个人经验，可跳过 `wenchang-research` 直接进入立骨/起稿；否则继续进入采证。
- `storm-research` 输出只进入 `content_state.storm_research` 和 `handoff`，正文阶段不得把角色模拟当成事实。

## 不要做的事

- 不要固定走 `路由 -> 采证 -> 起稿 -> 诊文 -> 出刊`，必须根据入口选择子路径。
- 不要把 `storm-research` 当成采证替代品；它只能给出待核验的问题地图和采证计划。
- 不要跳过探脉、定题、配图、卡片、上传、归档这些可能需要的节点。
- 不要为了自动推进而吞掉用户判断权。
- 不要在存在阻塞项时假装已经可发布。
- 不要把外部文章逐段翻译成自己的稿子。
