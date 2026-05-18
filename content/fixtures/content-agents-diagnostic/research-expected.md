# research expected

case_type: draft-diagnostic

## 采证结论

- 是否足够支撑写作：足够
- 主要原因：不需要证明“5 个 agent 等于团队”，只需要证明链式处理、上下文隔离、交接协议和审查环节能提高流程稳定性。

## 来源清单

1. 用户提供初稿：提供 5-Agent 内容流水线结构和 handoff 模板。
2. 当前项目 `content/CONTENT_STATE.md`：提供 `content_state` 和 `handoff` 的阶段合同。
3. 当前项目 `wenchang-research`：提供采证阶段边界。
4. 当前项目 `wenchang-review`：提供诊断/整章模式和人的判断权。
5. 当前项目 `wenchang-publish-check`：提供发布前检查和阻塞项机制。

## 关键事实

- 内容生产可以拆成策略、研究、写作、编辑、发布。
- handoff 可以减少流水线漂移。
- content_state 比纯文本交接更适合长期维护。
- 单 agent 也可以通过交接包模拟上下文隔离。
- 发布和归档需要保留用户判断权。

## 反向数据 / 限制条件

- 真多 agent 会增加调度成本。
- prompt 文件不等于系统。
- 无审查自动化会放大错误。

## 可引用句子

> 不是让 AI 替你拥有团队，而是让你的判断有一套可以复用的生产线。

## 矛盾点

- 原稿强调替代团队，项目目标强调保留人的判断权。

## content_state 更新

```yaml
content_state:
  research:
    sources:
      - 用户提供初稿
      - content/CONTENT_STATE.md
      - content/wenchang-research/SKILL.md
      - content/wenchang-review/SKILL.md
      - content/wenchang-publish-check/SKILL.md
    key_facts:
      - 内容生产可以拆成策略、研究、写作、编辑、发布
      - handoff 可以减少流水线漂移
      - content_state 比纯文本交接更适合长期维护
      - 单 agent 也可以通过交接包模拟上下文隔离
      - 发布和归档需要保留用户判断权
    contrarian_points:
      - 真多 agent 会增加调度成本
      - prompt 文件不等于系统
      - 无审查自动化会放大错误
    usable_quotes:
      - 不是让 AI 替你拥有团队，而是让你的判断有一套可以复用的生产线。
    contradictions:
      - 原稿强调替代团队，项目目标强调保留人的判断权
    confidence: Medium
  next_step:
    skill: wechat-writing-skill-ai-human3
    reason: 已完成选题重构和限制条件采证
    user_decision_needed: false
  handoff:
    from_stage: 采证
    to_stage: 起稿
    accepted_inputs:
      - topic.core_angle
      - diagnosis.minimum_fixes
      - research.key_facts
      - research.contrarian_points
    ignored_context:
      - 原稿夸张商业价值
      - 直接复制 prompt 的教程写法
      - 全自动发布承诺
    stop_condition: 输出一篇公众号判断文初稿
```
