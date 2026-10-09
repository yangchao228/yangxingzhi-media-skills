# Jev 引导篇事实与边界包

日期：2026-09-21
阶段：文昌总控 / 采证 → 立骨 → 起稿
目标平台：微信公众号
系列位置：Jev 实战指南 00

## 采证结论

- 是否足够支撑写作：足够支撑引导篇，不能支撑性能或商业效果结论。
- 主要原因：TypeSafe 官方文档明确说明 Jev 的定位、输入输出契约、Choice / Score / Noul、概率与 confidence；准确率、成本、中文效果和人工替代能力仍缺本系列实测。

## 来源清单

1. [TypeSafe AI Introduction](https://docs.typesafe.ai/introduction)：Jev 是 TypeSafe 的旗舰模型与首个 System One model；输入 state 与 typed questions，返回结构化答案。
2. [TypeSafe AI Primitives](https://docs.typesafe.ai/primitives)：Choice、Score、Noul 的适用边界和组合方式。
3. [TypeSafe AI Choice](https://docs.typesafe.ai/primitives/choice)：Choice 返回选项、概率分布和 confidence。
4. [TypeSafe AI Confidence](https://docs.typesafe.ai/confidence)：confidence 来源于概率分布；阈值应结合风险和自有数据确定。
5. [TypeSafe AI Patterns](https://docs.typesafe.ai/patterns)：speculative fan-out、confidence-gated routing、composite scoring、intent routing。
6. [TypeSafe AI Machine Learning Primer](https://docs.typesafe.ai/introduction/machine-learning-primer)：官方对“决策模型”和“生成文本”训练目标的解释，以及概率校准的群体统计边界。
7. [TypeSafe AI 官方发布：Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)：官方产品定位、架构与 benchmark 叙述；性能和价格数字按官方自报处理，不进入引导篇确定性结论。
8. [TypeSafe AI State](https://docs.typesafe.ai/concepts/state) 与 [Models](https://docs.typesafe.ai/models)：state 输入边界、英文与 CJK 效果提示、`jev-latest` 与版本化模型 ID 的复现记录要求。
9. [OpenAI Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/)：Structured Outputs 可以保证 schema 匹配，但仍不保证字段值事实正确；用于对照“结构化输出”与“typed decision interface”的边界。

## 关键事实

- Jev 被 TypeSafe 定义为首个 System One model，目标是让软件直接消费结构化决策。
- Jev 接收 state 和 typed questions，官方文档强调不生成自由文本，也不要求应用从散文中解析字段。
- Choice 用于固定选项，返回 `choice`、`probabilities`、`confidence`。
- Score 用于有序 rubric，返回 `score`、`probabilities`、`confidence`；分数可能是等级之间的概率加权值。
- Noul 用于 yes/no 判断，返回 0–1 的 yes 概率，没有单独的 confidence 字段。引导篇将大纲中的“Boolean”改为“可理解为 Boolean gate 的 Noul”。
- 三类问题可以对同一 state 在一次请求中并行评估；复杂判断应拆成多个 atomic questions，再由代码组合。
- 官方 confidence 文档建议根据任务风险设置阈值，并用人工或其他系统处理低置信度结果。
- 官方文档明确指出概率是群体层面的校准信号，不能保证单个答案正确。

## 反向数据 / 限制条件

- Jev 有结构化接口，不代表事实正确；仍可能出现语义误判。
- confidence 不能直接当作准确率；阈值需要在自己的 gold set 上校准。
- 大纲中“reason”不适合直接要求 Jev 生成自由文本；更适合预定义原因类别，或把解释交给通用 LLM。
- 中文/CJK 输入可用性和效果需要独立测试；官方文档提示英文是主要训练语言，CJK 效果可能较弱，本文不做优劣断言。
- 实验必须记录响应里的版本化 model ID；`jev-latest` 会随发布移动，不能只记录别名。
- 官方 benchmark、速度、价格和成本数字属于官方或特定 workflow 的自报结果，不能外推到 China Clearly 或所有任务。
- “Jev 能替代大量人工阅读”“Decision Engineering 会成为下一阶段”“Generator → Evaluate → Decide → Act 是未来通用架构”都是作者的研究假设或工作框架，不是已证实事实。
- OpenAI Structured Outputs 已能提供 schema 约束，因此 Jev 的差异应写成“原生 typed decision + 概率/置信度接口”，不能写成“只有 Jev 能输出结构化结果”。

## 引导篇可用转述

> 当软件需要一个判断时，Jev 把“问题类型、候选空间和不确定性”放进了接口；这降低了解析负担，却没有替你完成事实验证。

> 结构化输出解决的是结果怎么交给代码，gold set 解决的是结果到底对不对。

## China Clearly 实验的原子标签建议

- `brand_mentioned`：Noul，是否出现品牌名或明确指代。
- `explicit_recommendation`：Noul，是否明确建议读者考虑或选择；仅提及、列举、对比或负面描述不算。
- `recommendation_strength`：Score，使用固定等级与示例，不能直接套 0–1。
- `traveler_fit`：Choice 或 Noul，先定义“美国家庭”等场景边界。
- `reason_categories`：多个 Noul / Choice，例如行程匹配、家庭适配、价格、服务、可信度；自由文本 why 另交给通用 LLM。

## content_state 更新

```yaml
content_state:
  research:
    sources:
      - "https://docs.typesafe.ai/introduction"
      - "https://docs.typesafe.ai/primitives"
      - "https://docs.typesafe.ai/primitives/choice"
      - "https://docs.typesafe.ai/confidence"
      - "https://docs.typesafe.ai/patterns"
      - "https://docs.typesafe.ai/introduction/machine-learning-primer"
      - "https://typesafe.ai/blog/introducing-system-one-models-and-jev"
      - "https://openai.com/index/introducing-structured-outputs-in-the-api/"
    key_facts:
      - "Jev 是 TypeSafe 的首个 System One model"
      - "输入 state + typed questions，输出结构化答案"
      - "Choice / Score / Noul 对应固定选项、等级评分、yes 概率"
      - "Choice / Score 有 probabilities 与 confidence，Noul 只有 yes 概率"
      - "confidence 需要结合任务风险和自有标注数据使用"
    contrarian_points:
      - "结构化输出不等于值正确"
      - "概率不保证单个判断正确"
      - "官方性能与成本数字不可直接外推"
      - "Jev 的业务效果需要 gold set 验证"
    usable_quotes:
      - "结构化输出解决接口，gold set 验证正确性"
    contradictions:
      - "Jev 与通用 LLM Structured Outputs 的边界不是‘能否出 JSON’，而是输出契约与概率接口不同"
    confidence: "高（产品事实）；中（架构主张）；低（业务效果）"
  next_step:
    skill: "wenchang-review"
    reason: "事实边界已足够，进入引导篇整章编辑与公众号适配"
    user_decision_needed: false
  handoff:
    from_stage: "采证"
    to_stage: "起稿 / 诊文"
    accepted_inputs:
      - "本事实包中的官方来源和限制条件"
      - "系列规划与用户提供的大纲"
    ignored_context:
      - "未复现实验的性能、价格、准确率和人工替代结论"
    stop_condition: "正文只保留可核验事实与明确标注的作者框架"
```
