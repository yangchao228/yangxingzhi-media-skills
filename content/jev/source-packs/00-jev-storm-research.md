# Jev 引导篇 STORM 研究前置

日期：2026-09-21
阶段：文昌总控 / 定题 → storm-research
目标平台：微信公众号

## 研究结论

- 是否适合继续写作：适合。
- 推荐主线：把 Jev 放在“Decision Layer”问题里观察，先解释为什么许多工作流只需要有限、可验证的判断，再引出 Jev 的 typed questions 与后续实验。
- 主要原因：用户大纲已经提供了清晰的内容母题；官方资料可以支撑产品定位和输出契约，但准确率、成本与业务替代能力仍需实测。

## 多视角扫描

| 视角 | 核心关切 | 支持判断 | 反对说法 | 独有信息 | 待查问题 |
| --- | --- | --- | --- | --- | --- |
| 实践者 | 判断能否进入工作流并触发动作 | 有限输出空间更容易接数据库和路由 | 结构化不等于值正确 | 需要 schema、threshold、fallback 一起设计 | Jev 在真实样本上的复核率如何 |
| 系统设计者 | 模型、代码、人工的分工 | atomic questions + code composition 可审计 | 一个大问题塞进一个 Score 会掩盖标准冲突 | 组合逻辑和权重可以留在代码 | 哪些问题必须交给通用 LLM |
| 怀疑者 | 产品叙述会不会被过度泛化 | 官方文档也承认单个答案不保证正确 | “无文本生成”容易被误读成“不会错” | 需要 gold set、反例和失败记录 | confidence 是否在本业务上可校准 |
| 经济观察者 | 速度、价格、规模化收益 | 多个问题共享 state 可能减少往返 | 官方 benchmark 可能只代表特定 workflow | 成本应按真实输入和复核成本计算 | 端到端成本是否低于人工或通用 LLM |
| 历史观察者 | AI 从生成到判断的范式变化 | 软件接口会要求更稳定的机器可读结果 | “Decision Engineering”仍是作者框架 | 可沉淀为长期方法论 | 这个框架能否跨模型、跨平台复用 |

## 矛盾地图

### 直接冲突

1. 自由文本适合人阅读，typed decision 适合代码消费；同一个任务未必适合同一个接口。
2. 概率与 confidence 提供了不确定性信号，也可能被误读成单次正确率保证。
3. 原子判断便于验证，拆得过细会增加 rubric 和标注维护成本。
4. Jev 适合有限决策空间，China Clearly 的“推荐原因”仍可能需要开放式解释。

### 共识底座

- 进入软件流程的 AI 结果需要明确的字段、边界和失败路径。
- 复杂判断应拆成多个可验证问题，再由代码组合。
- 自动执行前需要用人工标注数据确定阈值和升级路径。

### 证据最强

- Jev 的 System One 定位、state + typed questions 输入输出。
- Choice、Score、Noul 的字段和适用问题。
- confidence 需要结合任务风险和自有标注数据使用。

### 证据最弱

- Jev 一定更准、更快、更便宜。
- Jev 可以替代大量人工阅读。
- Decision Engineering 会成为所有 AI 应用的下一阶段。

### 关键盲点

- 中文/CJK 场景的效果需要独立测试。
- 真实业务的误判成本、标注一致性和人工升级率尚无本系列数据。
- 推荐强度、旅客匹配、品牌原因等业务概念需要先写 rubric，不能直接交给模型自由发挥。

## 研究简报

Jev 的关键观察点不是“又一个模型”，而是一个不同的输出契约：state 进入系统，typed question 定义判断空间，模型返回结构化答案与部分概率信号，代码决定是否继续执行。这个契约可以降低自由文本解析和格式漂移的工程负担，却不能消除语义误判。引导篇应把 Generator、Decision Layer、Rules 和 Human 放在同一张架构图里，再把 China Clearly 作为待验证的实验场景。

## 可信度评审

- Jev 的产品定位与三类原语：高，官方文档已核验。
- “无文本生成、无需解析”：高，官方文档已核验；文章仍避免推导出“不会错”。
- “适合 AI Distribution”：中，作为作者研究方向，不是官方产品结论。
- “能否减少人工阅读”：低，必须等 gold set、人工标签和成本记录。
- “Decision Engineering 是下一阶段”：低到中，作为系列主张，不写成行业共识。

## 后续采证计划

1. 核验 TypeSafe 官方发布、System One、Primitives、Confidence、Patterns 文档。
2. 对照 OpenAI Structured Outputs 官方说明，区分 schema 合规与值正确性。
3. 设计 China Clearly 小型 gold set，先人工标注品牌提及、明确推荐、推荐强度和旅客匹配。
4. 用同一输入比较 Jev、通用 LLM、规则和人工，记录误判与升级率。

## content_state 更新

```yaml
content_state:
  storm_research:
    topic: "Jev 与 AI Decision Layer"
    purpose: "为微信公众号专栏建立产品事实、方法论与实验问题的边界"
    perspectives:
      - "AI 工作流实践者"
      - "系统设计者"
      - "怀疑者"
      - "经济观察者"
      - "历史观察者"
    contradiction_map:
      conflicts:
        - "自由文本可读性与 typed decision 可执行性的取舍"
        - "confidence 信号与单次正确率保证的区别"
        - "原子判断的可验证性与 rubric 维护成本"
      consensus:
        - "机器消费的结果需要明确字段、边界和失败路径"
        - "复杂判断应拆解后由代码组合"
      blind_spots:
        - "中文场景效果"
        - "业务误判成本"
        - "推荐原因的可结构化程度"
    synthesis_brief:
      summary: "把 Jev 当作 Decision Layer 的实验对象，而非单一产品宣传。"
      key_findings:
        - "官方定位是 System One typed decision model"
        - "Choice、Score、Noul 对应不同判断空间"
        - "confidence 要用自有标注数据和风险阈值解释"
      hidden_connection: "AI Distribution 的可见性分析本质上包含大量有限语义判断"
      actionable_insight: "先写 rubric 和 gold set，再谈替代人工或规模化成本"
      frontier_question: "Generator 与 Decision Layer 如何共同组成可审计的 AI 系统"
    confidence_review:
      scores:
        product_facts: "高"
        architecture_thesis: "中"
        business_replacement: "低"
      weakest_claim: "Jev 可以替代大量人工阅读"
      missing_perspectives:
        - "中文业务数据标注者"
        - "高风险动作的合规负责人"
      verification_needed:
        - "中国旅行推荐样本上的准确率与复核率"
        - "真实输入长度、用量与端到端成本"
  next_step:
    skill: "wenchang-research"
    reason: "进入一手资料采证，并把产品事实与实验假设分开"
    user_decision_needed: false
  handoff:
    from_stage: "storm-research"
    to_stage: "采证"
    accepted_inputs:
      - "用户提供的系列大纲"
      - "官方 TypeSafe 文档"
      - "China Clearly 实验方向"
    ignored_context:
      - "未经验证的性能、价格和替代人工结论"
    stop_condition: "关键产品事实有一手来源，实验命题已降级为待验证"
```
