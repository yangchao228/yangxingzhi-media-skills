# 《Loop Engineer 实战手册》成书大纲

日期：2026-06-12
阶段：文昌总控 / 立骨
素材基础：`content/outputs/2026-06-12-loop-engineering-practice-source-pack.md`

## 书名候选

1. 《Loop Engineer 实战手册：从提示词到可运行的 AI 循环系统》
2. 《别只会写 Prompt：AI Agent 循环系统实战手册》
3. 《会用 Agent 的人，都在设计 Loop》
4. 《Loop Engineering：把 AI Agent 放进可验证、可停止、可复用的系统》
5. 《人机协作的下一步：Loop Engineer 实战手册》

推荐书名：

《Loop Engineer 实战手册：从提示词到可运行的 AI 循环系统》

## 一句话定位

这是一本写给 AI 实践者、开发者、内容生产者和个人系统建设者的实战手册，帮助读者把一次性 prompt 升级为可验证、可停止、可复用、可复盘的 Agent 循环系统。

## 核心承诺

读完这本手册，读者应该能做到五件事：

1. 判断一个任务是否适合做成 loop。
2. 设计一个包含目标、反馈、停止、拒绝机制的基础 loop。
3. 拆出规划器、生成器、评估器三类角色。
4. 用 Harness 管理上下文、工具、权限、预算、日志和回滚。
5. 把编程、内容采证、周报、项目巡检、知识库维护等任务沉淀成可复用工作流。

## 目标读者

### 核心读者

- 已经会用 ChatGPT、Claude、Codex、Claude Code、Cursor 等 AI 工具的人。
- 经常让 Agent 写代码、写文档、做采证、跑测试、看日志的人。
- 感觉 prompt 越写越长、任务越做越碎，但没有形成稳定流程的人。

### 扩展读者

- 产品经理、内容创作者、独立开发者、知识工作者。
- 想把 AI 从“临时助手”变成“个人生产系统”的人。
- 负责团队内 AI 工作流、研发效能、自动化工具建设的人。

## 全书主线

全书围绕一条升级路径展开：

```text
Prompt -> Task -> Loop -> Harness -> Workflow -> Personal System
```

- Prompt：一次性指令。
- Task：明确目标和验收标准的任务。
- Loop：带反馈、停止和拒绝机制的循环。
- Harness：把规划、生成、评估接起来的运行外壳。
- Workflow：可以复用、迁移、审计、改进的工作流。
- Personal System：服务个人长期生产的数字资产系统。

## 全书结构

建议全书分为 5 篇、18 章、4 个附录。

### 第一篇：为什么需要 Loop Engineer

本篇解决认知问题：读者为什么不能只停留在 prompt 层。

#### 第 1 章 从 Prompt Engineering 到 Loop Engineering

核心问题：

- 为什么“会写提示词”开始不够用了？
- Agent 能连续执行后，人应该管什么？

要讲清楚：

- Prompt Engineering 的典型流程：人写提示、Agent 执行、人检查结果。
- Loop Engineering 的典型流程：人设计目标、反馈、停止、拒绝机制，Agent 在系统内迭代。
- Loop Engineering 不是简单定时任务，也不是让 Agent 无限自跑。
- 人的工作从“写一句指令”升级为“设计任务系统”。

案例：

- Boris Cherny / Peter Steinberger 引发的 loop 讨论。
- Claude Code `/loop` 与 Codex Automations 的出现。

本章交付物：

- 一张对照表：Prompt / Task / Loop / Harness / Workflow。
- 一份自测清单：你的工作还停留在哪一层。

#### 第 2 章 什么任务适合做成 Loop

核心问题：

- 哪些任务适合循环？
- 哪些任务应该保留人工判断？

要讲清楚：

- 适合 loop 的任务特征：重复、可验证、有明确边界、有外部反馈。
- 不适合 loop 的任务特征：价值判断强、风险不可逆、上下文缺失、验收模糊。
- 编程任务为什么天然适合 loop：代码、测试、日志、CI 都能提供反馈。
- 内容任务也能 loop，但必须保留选题、立场、发布判断给人。

实战场景：

- 适合：CI 失败修复、PR review 跟进、部署状态检查、资料采证、周报巡检。
- 不适合：产品战略拍板、生产数据操作、品牌立场判断、未经授权的外部发布。

本章交付物：

- `loop_fit_scorecard`：任务适配度评分表。
- `human_decision_boundary`：必须交还给人的判断清单。

#### 第 3 章 好 Loop 的四要素

核心问题：

- 一个 loop 最少需要哪些部件？

要讲清楚：

- 明确目标：不能只说“帮我优化”，要给 OKR / 验收标准。
- 反馈机制：测试、日志、diff、截图、数据、人工 review。
- 停止规则：通过、失败、超预算、重复错误、风险升级。
- 拒绝机制：内置风险检查，阻止危险动作和错误放大。

重点判断：

- 没有反馈的 loop 会变成 Agent 自我确认。
- 没有停止规则的 loop 会消耗预算、制造噪音、扩大风险。
- 没有拒绝机制的 loop 会在错误方向上持续加速。

本章交付物：

- `basic_loop_contract.md`：基础 loop 合同模板。
- 四要素检查表。

### 第二篇：Loop 的系统架构

本篇解决架构问题：如何把 loop 从原则变成可运行系统。

#### 第 4 章 三角色架构：规划器、生成器、评估器

核心问题：

- 为什么一个 Agent 不该同时负责计划、执行和验收？

要讲清楚：

- 规划器 Planner：拆目标、定验收标准、安排迭代顺序。
- 生成器 Generator：按计划产出代码、文档、测试、脚本、摘要。
- 评估器 Evaluator：根据证据判断是否通过，并决定继续、修正或停止。
- 三角色可以由同一个模型分时扮演，也可以由多个 Agent / subagent 承担。

关键原则：

- 规划器要保守。
- 生成器要小步。
- 评估器要冷酷。

实战案例：

- 修复一个 CI 失败：Planner 读日志拆任务，Generator 改代码，Evaluator 跑测试并判定。
- 写一篇采证型文章：Planner 定问题，Generator 搜集摘要，Evaluator 查来源和反向证据。

本章交付物：

- `planner_prompt.md`
- `generator_prompt.md`
- `evaluator_prompt.md`
- 三角色协作泳道图。

#### 第 5 章 Harness：把三角色接成系统

核心问题：

- Harness 到底管什么？

要讲清楚：

- Harness 是运行外壳，负责保存状态、调用工具、控制权限、记录日志、限制预算。
- Harness 不是某个单一工具，可以由 Claude Code、Codex、GitHub Actions、cron、脚本、数据库、文档规范共同组成。
- Harness 的核心是把人的判断标准写进系统。

Harness 七个部件：

1. Goal：目标和验收标准。
2. Context：项目上下文、约束、历史记录。
3. Tools：代码、浏览器、测试、CI、数据库、文档。
4. Policy：权限、禁止动作、审批规则。
5. Feedback：测试、日志、review、截图、数据。
6. Budget：时间、轮数、token、diff 大小。
7. Memory：checkpoint、失败记录、可复用模板。

本章交付物：

- `harness_spec.yaml`：Harness 规格模板。
- `loop_run_log.md`：单次 loop 运行日志模板。

#### 第 6 章 上下文工程：Loop 的燃料

核心问题：

- 为什么 loop 经常跑偏？

要讲清楚：

- 上下文不足会导致 Agent 猜测。
- 上下文过多会导致噪音、遗忘和压缩失真。
- 需要区分任务上下文、项目上下文、历史上下文、约束上下文。
- AGENTS.md、CLAUDE.md、rules、skills、examples 是可复用上下文资产。

实战方法：

- 给每个项目写 `AGENTS.md`。
- 给每类任务写 `task_brief.md`。
- 给每次 loop 写 `accepted_inputs` 和 `ignored_context`。
- 让评估器检查上下文缺口。

本章交付物：

- `context_pack_template.md`
- `AGENTS.md_loop_section` 示例。

#### 第 7 章 评估器优先：没有验证就没有 Loop

核心问题：

- 为什么评估器是 loop 的核心？

要讲清楚：

- 编程场景的评估：单测、集成测试、lint、type check、build、smoke test。
- 内容场景的评估：来源、反向证据、读者获得感、平台适配、AI 腔检查。
- 业务场景的评估：指标、人工抽检、用户反馈、线上影响。
- LLM judge 可以辅助评估，不能替代真实测试和人工抽检。

案例：

- Nubank 客服 agent 的 offline simulation、LLM judge、human-in-the-loop、online impact。
- SlopCodeBench 说明长周期 coding agent 会出现结构退化和冗余膨胀。

本章交付物：

- `evaluator_checklist.md`
- `evidence_only_review.md`
- `stop_or_continue_decision.md`

### 第三篇：工具实战

本篇解决落地问题：如何用现有工具搭出可运行 loop。

#### 第 8 章 Claude Code `/loop` 入门

核心问题：

- 如何用 Claude Code 跑第一个 loop？

要讲清楚：

- `/loop` 的适用范围：session 内重复任务。
- 最小间隔、过期机制、resume 机制。
- 什么时候用固定间隔，什么时候让 Claude 动态决定间隔。
- session scoped tasks、Desktop tasks、Cloud tasks、Routines 的差异。

实战任务：

- 部署检查 loop。
- PR CI babysit loop。
- 文档采证 loop。

本章交付物：

- `.claude/loop.md` 示例。
- 三个 `/loop` 命令模板。

#### 第 9 章 Claude Code Hooks：给 Loop 加护栏

核心问题：

- 如何阻止 Agent 做危险动作？

要讲清楚：

- hooks 的典型事件：SessionStart、UserPromptSubmit、PreToolUse、PostToolUse、Stop、FileChanged。
- PreToolUse 用于拦截危险命令。
- PostToolUse 用于记录、检查、触发验证。
- FileChanged 用于监控关键文件变化。

实战任务：

- 阻止生产配置修改。
- 自动要求跑测试。
- 修改敏感文件后提醒人工确认。

本章交付物：

- `hooks_policy.md`
- 危险命令拦截清单。

#### 第 10 章 Subagents 与 Worktrees：拆分复杂 Loop

核心问题：

- 什么时候需要多个 Agent？

要讲清楚：

- subagent 的价值：独立上下文、单职责、工具权限隔离。
- worktree 的价值：并行实验、降低互相污染。
- 多 agent loop 的风险：协调成本、重复搜索、上下文碎片化。

推荐分工：

- Research Agent：查资料、读代码、找证据。
- Builder Agent：生成 patch 或草稿。
- Reviewer Agent：评估、找问题、输出风险。
- Release Agent：做出刊检查、发布前 checklist。

本章交付物：

- `subagent_role_cards.md`
- `multi_agent_loop_board.md`

#### 第 11 章 Codex Automations、GitHub Actions 与 cron

核心问题：

- 如果工具没有原生 `/loop`，怎么补齐？

要讲清楚：

- Codex Automations 适合 recurring tasks、morning brief、weekly review、文件巡检。
- GitHub Actions 适合 CI、定时检查、仓库内自动任务。
- cron 适合本机定时任务，但需要自己管理日志、失败重试和权限。
- 跨工具迁移时，核心不变：目标、反馈、停止、拒绝、预算、日志。

实战任务：

- 每天生成项目巡检报告。
- 每周扫描未提交资产。
- 每小时检查构建状态。

本章交付物：

- `codex_automation_prompt.md`
- `github_actions_loop.yml`
- `cron_loop_wrapper.sh` 设计说明。

### 第四篇：高频实战场景

本篇解决迁移问题：把 loop 用到真实工作里。

#### 第 12 章 CI 修复 Loop

目标：

- 从失败日志到最小修复，再到测试通过。

流程：

1. Planner 读取 CI 日志，定位失败类型。
2. Generator 只改相关文件。
3. Evaluator 运行对应测试。
4. 如果失败重复两轮，停止并重新规划。

本章交付物：

- `ci_fix_loop.md`
- `failure_taxonomy.md`
- `test_mapping_table.md`

#### 第 13 章 PR Review Loop

目标：

- 让 Agent 持续跟踪 review comments、CI、diff 风险，但最终合并权留给人。

流程：

1. 拉取 PR 状态。
2. 去重 review comments。
3. 分级处理 P0 / P1 / P2。
4. 生成小 patch。
5. 运行验证。
6. 输出交付清单。

本章交付物：

- `pr_review_loop.md`
- `review_comment_triage.md`
- `merge_readiness_checklist.md`

#### 第 14 章 内容采证 Loop

目标：

- 把热点选题变成有来源、有反向证据、有发布判断的素材包。

流程：

1. Planner 明确选题、受众、平台。
2. Generator 搜集一手来源、案例、数据。
3. Evaluator 检查来源等级、事实矛盾、反向证据。
4. Harness 保存 source pack 和 content_state。

本章交付物：

- `research_loop.md`
- `source_grading_table.md`
- `contrarian_points_template.md`

#### 第 15 章 个人系统维护 Loop

目标：

- 把 AI 用在长期资产维护上，而不是只追一次性效率。

适用任务：

- 周报整理。
- 知识库巡检。
- 项目地图更新。
- 未提交资产扫描。
- 写作素材归档。

流程：

1. 每周定时扫描。
2. 输出 evidence-only 报告。
3. 标出需要人工判断的节点。
4. 将可复用结论写入模板、skill 或记忆更新建议。

本章交付物：

- `weekly_asset_loop.md`
- `knowledge_base_maintenance_loop.md`
- `memory_update_candidate.md`

### 第五篇：风险、成本与长期资产

本篇解决可持续问题：loop 如何不变成成本和事故放大器。

#### 第 16 章 成本账：Token、时间、注意力

核心问题：

- Loop 的成本为什么经常被低估？

要讲清楚：

- 高频 loop 会放大 token 成本。
- 长上下文会带来压缩、遗忘和误读。
- 人的注意力成本也要计入，不是 Agent 跑起来就免费。
- 适合先做低频、高价值、可验证的 loop。

本章交付物：

- `loop_budget_calculator.md`
- `frequency_decision_table.md`

#### 第 17 章 事故复盘：Agent 失控通常从哪里开始

核心问题：

- Loop 的事故模式有哪些？

案例：

- Replit Agent 删除生产数据库。
- SlopCodeBench 的结构退化和冗余膨胀。
- AI coding tools 中 API、integration、configuration errors。

事故模式：

- 权限过大。
- 生产与测试不隔离。
- 没有 code freeze 保护。
- 评估器只看表面成功。
- Agent 为了完成目标编造状态。
- 长 loop 缺少 checkpoint 和回滚。

本章交付物：

- `loop_incident_postmortem.md`
- `dangerous_actions_policy.md`
- `rollback_plan.md`

#### 第 18 章 从 Loop 到 Workflow Store

核心问题：

- 如何把一次成功经验变成长期资产？

要讲清楚：

- 一次 loop 成功只能说明这次任务跑通。
- 可复用 workflow 需要模板、参数、边界、日志、案例和复盘。
- 好的个人系统会不断把临时经验沉淀成可重复调用的工作流。
- Human3.0 方向的核心是人的判断权、数字生产资料和长期系统。

资产化路径：

```text
一次任务 -> 手动流程 -> loop 模板 -> harness 规格 -> workflow -> skill / SOP / 产品
```

本章交付物：

- `workflow_card.md`
- `skill_candidate_template.md`
- `personal_system_map.md`

## 附录设计

### 附录 A：Loop 模板库

- CI 修复 loop。
- PR review loop。
- 部署检查 loop。
- 内容采证 loop。
- 周报整理 loop。
- 知识库巡检 loop。
- 个人复盘 loop。

### 附录 B：Prompt 与配置模板

- Planner prompt。
- Generator prompt。
- Evaluator prompt。
- AGENTS.md loop section。
- CLAUDE.md loop section。
- `.claude/loop.md`。
- Codex Automation prompt。

### 附录 C：检查表

- loop 适配度检查表。
- 上线前安全检查表。
- 评估器证据检查表。
- 停止条件检查表。
- 成本预算检查表。
- 人工交还检查表。

### 附录 D：案例索引

- Claude Code `/loop`。
- Claude Code hooks。
- Claude Code subagents。
- Codex Automations。
- Notion vibe coding。
- Nubank customer support agents。
- Replit production database incident。
- SlopCodeBench。
- Configuring Agentic AI Coding Tools。
- AI Workflow Store。

## 每章统一写作结构

建议每章都按这个结构写，保证成书后可读、可查、可练：

1. 本章要解决的问题。
2. 一个真实场景。
3. 核心概念。
4. 实战流程。
5. 模板或清单。
6. 常见错误。
7. 本章小结。
8. 练习任务。

## 出版级内容节奏

### 第一版最小可写版本

先写 9 章，形成可发布电子手册：

1. 从 Prompt Engineering 到 Loop Engineering。
2. 什么任务适合做成 Loop。
3. 好 Loop 的四要素。
4. 三角色架构。
5. Harness。
6. Claude Code `/loop` 入门。
7. 评估器优先。
8. CI 修复 Loop。
9. 风险与事故复盘。

### 完整版

补齐 18 章和 4 个附录，定位为成书级手册。

### 公众号系列拆法

可拆成 8 篇：

1. 《Claude Code 之父说他不再写提示词了》
2. 《好 Loop 的四要素：目标、反馈、停止、拒绝》
3. 《真正的 Loop 系统里，有规划器、生成器和评估器》
4. 《Harness：把 Agent 放进可控系统》
5. 《Claude Code /loop 实战：第一个可运行循环》
6. 《评估器优先：没有验证就没有 Agent 工程》
7. 《别让 Agent 裸奔：权限、预算和停止规则》
8. 《从 Loop 到个人系统：Human3.0 的工作流资产》

## 成书判断

这套大纲具备成书潜力，原因有四个：

1. 它有明确新概念：Loop Engineer。
2. 它有实战工具入口：Claude Code、Codex Automations、hooks、subagents。
3. 它有可迁移方法：规划器、生成器、评估器、Harness。
4. 它能沉淀资产：模板、清单、workflow、skill、SOP。

主要风险：

1. 如果写成工具功能说明，会很快过时。
2. 如果只讲概念，读者无法照着做。
3. 如果不讲事故和成本，会显得像自动化爽文。
4. 如果缺少真实案例，会像 AI 生成的课程目录。

建议写作策略：

- 每章至少有一个真实任务。
- 每章至少交付一个模板。
- 每章至少列一个失败模式。
- 官方功能只作工具入口，方法论和模板才是长期资产。

## content_state

```yaml
content_state:
  request:
    raw_intent: "整理一个能成书的 Loop Engineer 实战手册大纲"
    current_stage: "立骨"
    target_platforms: ["手册", "公众号系列"]
  outline:
    title: "Loop Engineer 实战手册：从提示词到可运行的 AI 循环系统"
    structure: "5 篇 / 18 章 / 4 附录"
    core_framework:
      - "Prompt -> Task -> Loop -> Harness -> Workflow -> Personal System"
      - "好 Loop 四要素：目标、反馈、停止、拒绝"
      - "三角色架构：规划器、生成器、评估器"
      - "Harness 七部件：Goal, Context, Tools, Policy, Feedback, Budget, Memory"
    first_version:
      chapter_count: 9
      goal: "先形成可发布电子手册"
    full_version:
      chapter_count: 18
      appendices: 4
      goal: "成书级手册"
  next_step:
    skill: "wenchang-orchestrator -> 起稿 / 模板库"
    reason: "大纲已具备章节结构，下一步可选择写第一章或先生成附录模板库"
    user_decision_needed: true
  handoff:
    from_stage: "立骨"
    to_stage: "起稿"
    accepted_inputs:
      - "source pack"
      - "book outline"
      - "chapter framework"
    ignored_context:
      - "未核验的社媒浏览量"
      - "无来源的工具宣传口号"
    stop_condition: "等待用户确认先写第一章还是先做模板库"
```
