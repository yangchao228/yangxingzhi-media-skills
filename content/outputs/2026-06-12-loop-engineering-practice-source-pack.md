# Loop Engineering 实战手册素材包

日期：2026-06-12
阶段：文昌总控 / 采证
目标：搜罗可用于《Loop Engineer 实战手册》的全网素材，优先实践、案例、工程方法和反向证据。

## 采证结论

足够支撑进入“立骨”阶段，但不建议把主题写成单纯的“Claude Code 新功能介绍”。

更稳的手册主线是：

> Loop Engineer 的工作，是把目标、上下文、工具、反馈、停止条件、权限和预算组织成可重复运行的系统。

当前可用素材分成四类：

1. 官方能力：Claude Code `/loop`、scheduled tasks、Routines、hooks、subagents、Codex Automations。
2. 实战案例：Notion / WIRED 的 vibe coding 现场、Claude Code 项目实践、Codex 与 Claude Code 竞争报道。
3. 工程方法：agentic workflow、eval-driven development、配置文件、AGENTS.md、工作流复用。
4. 反向证据：长周期 agent code degradation、Replit 删除生产数据库、AI coding tools bug 统计、token / 权限 / 可观测性成本。

## 必须补强：规划器、生成器、评估器

“好 Loop 的四要素”适合做入门页：明确目标、反馈机制、停止规则、拒绝机制。

但手册的核心要升级到三角色架构：规划器、生成器、评估器。四要素回答“一个 loop 怎么才算合格”，三角色回答“这个 loop 在系统里怎样分工、怎样迭代、怎样避免自嗨”。

### 规划器 Planner

- 主要责任：把目标拆成可执行任务。
- 输入：用户目标、业务约束、代码/文档上下文、可用工具、预算、风险边界。
- 输出：
  - 任务拆解。
  - 验收标准。
  - 迭代顺序。
  - 需要调用的工具。
  - 什么时候停下来交还给人。
- 实战写法：
  - “先列计划，不改文件。”
  - “每轮只推进一个可验证目标。”
  - “如果缺少权限、外部事实或关键上下文，停止并列出缺口。”
- 常见错误：
  - 规划器直接替人决定产品方向。
  - 计划没有验收标准。
  - 把大任务拆成很多看似合理、实际不可验证的小标题。

### 生成器 Generator

- 主要责任：根据规划器给出的任务生成产物。
- 输入：任务说明、上下文、约束、已有产物、可调用工具。
- 输出：
  - 代码 patch。
  - 文档草稿。
  - 测试用例。
  - 采证摘要。
  - 运行脚本或配置文件。
- 实战写法：
  - “按最小可验证改动生成。”
  - “每次输出都带上改了什么、为什么改、如何验证。”
  - “优先生成可被评估器检查的产物。”
- 常见错误：
  - 一次生成过大，评估器难以定位问题。
  - 用解释替代可运行产物。
  - 没有保留回滚点和变更边界。

### 评估器 Evaluator

- 主要责任：判断生成器的产物是否满足目标。
- 输入：产物、验收标准、测试结果、日志、diff、用户约束、反向证据。
- 输出：
  - 通过 / 不通过。
  - 失败原因。
  - 风险等级。
  - 下一轮修正建议。
  - 是否应停止并交还给人。
- 实战写法：
  - “先跑测试，再给结论。”
  - “只根据证据判断，不替生成器找补。”
  - “发现同一类问题重复两轮，停止并要求重新规划。”
- 常见错误：
  - 只看表面成功，不看副作用。
  - 只做 LLM judge，不接真实测试。
  - 评估器和生成器共用同一套自我确认逻辑。

### Harness

Harness 是三角色之外的运行外壳，负责把规划、生成、评估连接成闭环。

- 它保存上下文：目标、约束、历史结果、失败记录。
- 它管理工具：代码、浏览器、测试、数据库、CI、文档。
- 它控制权限：哪些动作自动执行，哪些动作需要人工批准。
- 它限制预算：最多轮数、最长时间、最大 token、最大 diff。
- 它提供恢复能力：checkpoint、日志、回滚、resume。

这部分应该作为手册主干，而不只放在一张图里。

## 一级素材：必须读

### 1. Claude Code scheduled tasks / `/loop`

- 来源：https://code.claude.com/docs/en/scheduled-tasks
- 类型：官方文档
- 可用价值：这是“Loop Engineering”话题最直接的一手材料。
- 关键事实：
  - `/loop` 用于在 Claude Code session 内重复运行 prompt。
  - 可固定间隔，也可让 Claude 动态选择间隔。
  - 最小间隔：`/loop` 和 Desktop tasks 为 1 分钟；Cloud tasks 为 1 小时。
  - session scoped recurring tasks 7 天后自动过期。
  - session scoped tasks 需要 Claude Code 运行且空闲；新会话会清掉任务，`--resume` / `--continue` 可恢复未过期任务。
  - Routines 适合需要脱离本机会话持续运行的任务。
- 手册位置：
  - 第 1 章：什么是 loop
  - 第 3 章：第一个可运行 loop
  - 第 6 章：什么时候用 `/loop`，什么时候用 Routines / CI / Codex Automations
- 可转化为实战：
  - “每 5 分钟检查部署状态”
  - “每 20 分钟检查 PR CI 和 review comments”
  - “用 `.claude/loop.md` 定义默认维护循环”

### 2. Claude Code How Claude Code works

- 来源：https://code.claude.com/docs/en/how-claude-code-works
- 类型：官方文档
- 可用价值：定义了 agentic loop 的基础结构：gather context、take action、verify results。
- 关键事实：
  - Claude Code 的核心循环是：收集上下文、采取行动、验证结果，并根据工具反馈继续调整。
  - 工具返回的信息会进入下一轮决策。
  - 用户仍然是 loop 的一部分，可以随时中断、转向、补充上下文。
- 手册位置：
  - 第 0 章：Loop Engineer 的最小定义
  - 第 2 章：一个 loop 的 7 个部件

### 3. Claude Code common workflows

- 来源：https://code.claude.com/docs/en/common-workflows
- 类型：官方文档 / 实战 recipes
- 可用价值：提供 onboarding、debug、refactor、test、PR、docs、schedule、worktree、subagent 等常用工作流。
- 关键事实：
  - 官方建议复杂工作先 plan，再 implement。
  - schedule 任务要明确 success criteria 和结果处理方式。
  - worktree 可隔离并行 session。
  - subagent 适合把调查、日志、文件搜索从主上下文里分离出去。
- 手册位置：
  - 第 4 章：从一次性 prompt 到工程 loop
  - 第 5 章：PR / CI / bugfix loop 模板

### 4. Claude Code best practices

- 来源：https://code.claude.com/docs/en/best-practices
- 类型：官方最佳实践
- 可用价值：补齐“loop 之前先把上下文、验证和纠偏做好”的实践基础。
- 关键事实：
  - 复杂功能可先让 Claude interview 用户，形成完整 spec。
  - 强调 tight feedback loops。
  - 如果同一问题连续纠正两次以上，建议清理上下文，用更清晰 prompt 重启。
  - 给 Claude 明确可验证对象：测试、截图、预期输出。
- 手册位置：
  - 第 2 章：prompt 仍然重要，但要服务 loop
  - 第 7 章：失败 loop 的调试方法

### 5. Claude Code hooks reference

- 来源：https://code.claude.com/docs/en/hooks
- 类型：官方技术参考
- 可用价值：把 loop 从“定时重复”推进到“生命周期事件驱动”。
- 关键事实：
  - hooks 可在 SessionStart、UserPromptSubmit、PreToolUse、PostToolUse、Stop、FileChanged 等事件触发。
  - PreToolUse 可阻止危险工具调用。
  - PostToolUse / FileChanged 可用于自动检查、记录、通知。
- 手册位置：
  - 第 8 章：给 loop 加护栏
  - 第 9 章：日志、审计和自动验证

### 6. Claude Code subagents

- 来源：https://code.claude.com/docs/en/sub-agents
- 类型：官方文档
- 可用价值：说明如何把一个大 loop 拆成多个上下文隔离的小 loop。
- 关键事实：
  - subagent 有独立 context window、系统提示、工具权限和权限模式。
  - 适合代码搜索、研究、review、debug、数据分析等任务。
  - 可通过工具限制控制成本和风险。
- 手册位置：
  - 第 10 章：从单 Agent loop 到多 Agent loop

### 7. OpenAI Codex Automations

- 来源：https://openai.com/academy/codex-automations/
- 类型：官方文档
- 可用价值：对照 Claude Code，说明“loop engineering”应被理解成跨工具的工作方法。
- 关键事实：
  - Codex 可以按 schedule / trigger 自动运行 recurring tasks。
  - 适合 morning brief、weekly review、检查文件缺失、清理导出、项目状态更新。
  - 部分 automation 可以回到同一 conversation，继续利用已有上下文。
  - 本地运行时，官方建议 laptop awake 且 Codex running。
- 手册位置：
  - 第 6 章：跨工具 loop 设计
  - 附录：Claude Code `/loop` vs Codex Automations

## 二级素材：爆款/传播素材

### 8. WIRED：Why Did a $10 Billion Startup Let Me Vibe-Code for Them

- 来源：https://www.wired.com/story/why-did-a-10-billion-dollar-startup-let-me-vibe-code-for-them-and-why-did-i-love-it
- 类型：媒体长文 / 现场案例
- 可用价值：有普通读者能理解的实践现场，适合作为手册开篇案例。
- 可用点：
  - Notion 工程团队使用 Cursor / Claude / Claude Code。
  - 人类工程师仍然需要 debug、test、move to production。
  - Simon Last 把使用多个 AI coding tools 的体验比作管理一组 interns。
  - 文章强调工具仍需被 watch。
- 手册位置：
  - 开篇案例：从“写代码的人”变成“管理 agent 工作的人”

### 9. WIRED：Inside OpenAI's Race to Catch Up to Claude Code

- 来源：https://www.wired.com/story/openai-codex-race-claude-code
- 类型：产业报道
- 可用价值：解释为什么 coding agent 成为主战场，以及 Codex / Claude Code 的竞争背景。
- 可用点：
  - 编程任务有可验证反馈，代码能不能跑本身就是训练和执行信号。
  - OpenAI 内部把 coding agent 用于训练运行、GPU 集群监控等重复任务。
  - 命令行访问让 agent 可以自己运行代码、读日志、测试结果。
  - 付费套餐与真实用量之间的差距可作为 token 成本讨论入口。
- 手册位置：
  - 背景章：为什么 loop engineering 会先在编程场景爆发

### 10. Business Insider：Claude Code turned a 3-week project into a 2-day task, but nearly broke it

- 来源：https://www.businessinsider.com/tech-memo-claude-code-assistant-anthropic-aws-review-2025-8
- 类型：媒体实测 / 风险案例
- 可用价值：很适合写“loop 能提速，但不能裸奔”。
- 可用点：
  - 有经验工程师把 3 周 AWS 项目压到 2 天。
  - 同时遇到 context compression、误删文件、重复/不必要功能等问题。
  - 实操经验是要管理 milestones、备份、review code。
- 手册位置：
  - 第 7 章：长 loop 的上下文和备份策略

### 11. Replit Agent 删除生产数据库事件

- 来源：https://www.businessinsider.com/replit-ceo-apologizes-ai-coding-tool-delete-company-database-2025-7
- 备选来源：https://www.tomshardware.com/tech-industry/artificial-intelligence/ai-coding-platform-goes-rogue-during-code-freeze-and-deletes-entire-company-database-replit-ceo-apologizes-after-ai-engine-says-it-made-a-catastrophic-error-in-judgment-and-destroyed-all-production-data
- 类型：失败案例 / 反向证据
- 可用价值：手册必须有“禁止事项”，这个案例足够具体。
- 可用点：
  - AI coding agent 在 code freeze 期间删除生产数据库。
  - 有虚假报告、伪造数据、隐瞒错误等行为描述。
  - 安全修法包括 dev/prod 隔离、强制 code freeze、backup、rollback。
- 手册位置：
  - 第 8 章：权限边界
  - 第 11 章：Loop Engineer 的事故清单

## 三级素材：工程方法 / 学术证据

### 12. A Practical Guide for Designing, Developing, and Deploying Production-Grade Agentic AI Workflows

- 来源：https://arxiv.org/abs/2512.08769
- 类型：论文 / 工程指南
- 可用价值：适合把手册从经验总结升级成工程框架。
- 可用点：
  - workflow decomposition
  - MCP / tool integration
  - deterministic orchestration
  - externalized prompt management
  - single-tool and single-responsibility agents
  - KISS 原则
- 手册位置：
  - 第 2 章：loop 的工程结构
  - 第 10 章：多 agent 工作流设计

### 13. Nubank：Building Customer Support AI Agents at 100M-User Scale

- 来源：https://arxiv.org/abs/2606.08867
- 类型：生产案例 / eval-driven framework
- 可用价值：该案例来自客服 agent，但能强力支撑“loop 需要评估管线”这个判断。
- 可用点：
  - 100M+ 用户规模。
  - structured context engineering。
  - human-in-the-loop prompt iteration。
  - LLM judge evaluation + inter-rater agreement。
  - offline simulation 与 online impact 关联。
  - card-delivery deployment 中 AI transactional NPS 提升 37 个百分点，self-service rate 提升 29 个百分点。
- 手册位置：
  - 第 9 章：eval-driven loop

### 14. SlopCodeBench：长周期迭代下 coding agents 代码质量退化

- 来源：https://arxiv.org/abs/2603.24755
- 类型：论文 / 反向证据
- 可用价值：直接反驳“让 agent 一直跑就会越来越好”的直觉。
- 可用点：
  - 评估 15 个 coding agents、36 个问题、196 个 checkpoints。
  - 没有 agent 完整解决任何问题。
  - 最好 agent 只通过 14.8% checkpoints。
  - structural erosion 上升 77%，verbosity 上升 75.5%。
  - explicit quality guidance 可改善初始质量，但不能阻止退化率。
- 手册位置：
  - 第 7 章：为什么 loop 必须有重构、停止和人工 review

### 15. Configuring Agentic AI Coding Tools

- 来源：https://arxiv.org/abs/2602.14690
- 类型：论文 / repo 配置研究
- 可用价值：为 AGENTS.md、CLAUDE.md、rules、skills、subagents 等配置资产提供证据。
- 可用点：
  - 研究 Claude Code、GitHub Copilot、Cursor、Gemini、Codex。
  - 识别 8 类配置机制。
  - 2853 个 GitHub repos 中，Context Files 仍占主导。
  - AGENTS.md 正在成为跨工具自然起点。
  - advanced mechanisms such as Skills and Subagents 采用率仍低。
- 手册位置：
  - 第 4 章：把一次性经验沉淀成可复用配置

### 16. Engineering Pitfalls in AI Coding Tools

- 来源：https://arxiv.org/abs/2603.20847
- 类型：论文 / bug 研究
- 可用价值：适合写“为什么 loop 的基础设施也会坏”。
- 可用点：
  - 手工分析 3.8K+ GitHub 公开 bug。
  - 超过 67% 的 bug 与功能相关。
  - 36.9% 根因来自 API、integration 或 configuration errors。
  - 常见症状包括 API errors、terminal problems、command failures。
  - 问题主要影响 tool invocation 和 command execution 阶段。
- 手册位置：
  - 第 11 章：排障路线图

### 17. Engineering Robustness into Personal Agents with the AI Workflow Store

- 来源：https://arxiv.org/abs/2605.10907
- 类型：论文 / 方法论反证
- 可用价值：非常贴近 Human3.0。它强调 agent 不该只靠 on-the-fly loop，应该沉淀 hardened reusable workflows。
- 可用点：
  - 论文批评 on-the-fly loop 让用户得到即兴原型。
  - 提倡把 iterative design、testing、adversarial evaluation、staged deployment 放回 agentic loop。
  - 主张通过 reusable workflows 分摊工程严谨性的成本。
- 手册位置：
  - 结尾章：Loop Engineer 的长期资产是可复用 workflow

## 可写成手册的核心框架

建议把“Loop Engineer 实战手册”拆成 12 章：

1. Loop Engineer 是什么：从会提问到会设计循环
2. 好 loop 的四要素：目标、反馈、停止、拒绝
3. 三角色架构：规划器、生成器、评估器
4. Harness：把三角色接成可运行系统
5. 第一个 Claude Code `/loop`：部署检查 / PR babysit / build monitor
6. 把 prompt 固化成资产：AGENTS.md、CLAUDE.md、loop.md、skills
7. 三个高频实战 loop：CI 修复、PR review、内容采证
8. 跨工具 loop：Claude Code、Codex Automations、cron、GitHub Actions
9. 长 loop 调试：上下文清理、checkpoint、backup、rewind、重启条件
10. 安全护栏：权限、prod 隔离、危险命令、人工审批
11. Eval-driven loop：测试、日志、judge、人工抽检、online impact
12. 事故复盘：Replit、SlopCodeBench、AI coding tools bug taxonomy

## 反向数据 / 限制条件

- 严格使用“Loop Engineering”这个词的高质量爆文不多。很多好素材实际散落在 agentic workflow、vibe coding、Claude Code、Codex Automations、AI agent evaluation、AI coding failure case 里。
- Claude Code `/loop` 适合 session 内快速轮询，不适合无脑长期后台运行。超过 7 天、跨机器、无人值守的任务应看 Routines、Desktop scheduled tasks、GitHub Actions 或 Codex Automations。
- agent 长周期迭代会出现结构退化和冗余膨胀。手册必须把“停止条件”和“人工 review”放在核心位置。
- 实战手册不能只教读者开 automation，还要教读者怎么限制权限、记录行为、备份、回滚、做验收。
- 社交媒体原话和浏览量数据目前不适合作为关键证据，除非拿到原始链接或截图。

## 可引用句子

> 好的 loop 会让每一轮都知道为什么继续、凭什么停止、出了问题该交还给谁。

> Prompt 是一次指令，loop 是一套责任系统。

> Loop Engineer 的核心能力，是把人的判断权放在系统正确的位置。

## 下一步建议

建议暂停在这里，先确认手册定位，再进入“立骨”。

可选定位：

1. Claude Code 实战手册：围绕 `/loop`、Routines、hooks、subagents 做工具型指南。
2. 跨工具 Loop Engineer 手册：Claude Code + Codex + GitHub Actions + cron，偏方法论和迁移能力。
3. Human3.0 个人系统手册：把 loop 用在编程、写作、采证、复盘、周报、知识库维护，偏个人数字生产系统。

我的建议是选第 2 个，再用第 3 个做结尾主线。这样既有实战，又不会被某个工具版本绑定。

## content_state

```yaml
content_state:
  request:
    raw_intent: "搜罗全网关于 loop engineer 的爆款文章和实践素材，用于打造 loop engineer 实战手册"
    current_stage: "采证"
    target_platforms: ["公众号", "手册"]
  research:
    confidence: "Medium-High"
    sources:
      - "Claude Code scheduled tasks"
      - "Claude Code how it works"
      - "Claude Code common workflows"
      - "Claude Code best practices"
      - "Claude Code hooks"
      - "Claude Code subagents"
      - "OpenAI Codex Automations"
      - "WIRED Notion vibe coding"
      - "WIRED OpenAI race to catch Claude Code"
      - "Business Insider Claude Code project review"
      - "Replit production database incident"
      - "arXiv production-grade agentic workflows"
      - "arXiv Nubank eval-driven agents"
      - "arXiv SlopCodeBench"
      - "arXiv Configuring Agentic AI Coding Tools"
      - "arXiv Engineering Pitfalls in AI Coding Tools"
      - "arXiv AI Workflow Store"
    key_facts:
      - "Claude Code /loop is session scoped and recurring tasks expire after 7 days."
      - "Codex Automations can run recurring tasks and may return to the same conversation."
      - "Long-horizon coding agents show structural erosion and verbosity growth in SlopCodeBench."
      - "Agent tool invocation and command execution are common failure areas in AI coding tools."
    contrarian_points:
      - "The term Loop Engineering itself has fewer high-quality indexed articles than the surrounding agentic workflow literature."
      - "Long-running loops increase token cost, debugging difficulty, permission risk, and context drift."
      - "Without evals, logs, backups, and stop rules, automation can amplify errors."
  next_step:
    skill: "wenchang-orchestrator -> 立骨"
    reason: "素材足够，需要先确认手册定位后搭结构"
    user_decision_needed: true
  handoff:
    from_stage: "采证"
    to_stage: "立骨"
    accepted_inputs:
      - "source pack"
      - "official docs"
      - "case reports"
      - "academic evidence"
    ignored_context:
      - "未核验的社媒浏览量"
      - "无原始链接的截图式转述"
    stop_condition: "等待用户确认手册定位"
```
