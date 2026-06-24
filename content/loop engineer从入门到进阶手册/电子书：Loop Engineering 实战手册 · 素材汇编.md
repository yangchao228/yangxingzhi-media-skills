# Loop Engineering 实战手册 · 素材汇编

# Loop Engineering 实战手册 · 素材汇编

> 创建时间：2026\-06\-12
用途：为公众号文章《Loop Engineering 实战手册》提供按章节归类的核心素材
状态：素材收集完成 → 待逐章生成正文

---

## 第1章｜概念层：什么是 Loop Engineering

### 1\.1 演进路径：Prompt → Context → Harness → Loop

|阶段|你优化什么|工作单元|代表工具/理念|
|---|---|---|---|
|Prompt Engineering|如何写单条指令|你手动打的一条 prompt|ChatGPT 早期|
|Context Engineering|窗口里放什么：文档、历史、工具定义|围绕单次回答的条件|CLAUDE\.md、SKILL\.md|
|Harness Engineering|约束机制、反馈回路、工作流控制|单次 Agent 运行的约束|Claude Code Hooks|
|**Loop Engineering**|**谁来决定 prompt 什么、何时 prompt、结果是否可接受**|**跨多次 turn 的自运行循环**|/loop、/goal、Automations|

> 核心洞察：每一层包裹前一层，杠杆点从模型调用本身逐渐外移。Prompt 工程不会消失——它是 Loop 的组件。Context 工程也不会消失——Loop 每次 turn 仍需正确注入上下文。Loop 新增的是自主控制结构。

### 1\.2 核心定义

> **一句话定义**：Loop Engineering 是构建一个系统，让它按计划、按目标自动提示你的 Agent，而不是你手动输入每条提示。杠杆从"单条 prompt 的质量"转移到"生成和验证 prompt 的系统的设计"。

> **Peter Steinberger（OpenClaw 创始人）**：你不应该在提示 coding agent，你应该设计循环来提示它们。

> **Boris Cherny（Claude Code 负责人）**：我不再直接提示 Claude 了。我有循环在运行，提示 Claude 自己 figuring out what to do。我的工作是写循环。

> **Addy Osmani（Google 工程师）**：普及了"Loop Engineering"这一术语，将 Loop 拆解为五要素 \+ Memory。

### 1\.3 Loop ≠ Cron Job

|Cron Job|Loop Engineering|
|---|---|
|运行固定脚本|运行一个 Agent，观察状态、选择行动、检查结果、决定下一步|
|固定触发 → 固定执行|触发 → 决策 → 行动 → 验证 → 再决策|
|无决策者|Agent 是循环内的决策者|
|老技术|LLM 能力足够后涌现的新范式|

> 关键区别：Loop 里有决策者。Cron 没有。

### 1\.4 为什么是 2026 年 6 月

- Claude Code 推出 /loop 和 /goal 命令

- OpenAI Codex 推出 Automations Tab 和 persisted goal

- Claude 4\.6/4\.7 推出 Auto Mode（安全分类模型替代人工审批）

- 五要素积木在两个主流工具中均已内置

- Addy Osmani 的系统性文章引爆讨论

---

## 第2章｜架构层：Loop 的六块积木

### 2\.1 Automations（心跳）

**定义**：让 Loop 成为真正的 Loop 而非一次性运行的机制。 recurring trigger，无需你主动询问就能发现工作。

**Claude Code 实现**：

- `/loop "prompt" --schedule "0 9 * * 1-5"` — 定时 recurring 任务

- Hooks — 在 Agent 生命周期关键点触发 shell 命令

- GitHub Actions 集成 — 关机后仍在运行

**Codex 实现**：

- Automations Tab — 选择项目、prompt、cadence、worktree 选项

- 发现内容的 run 进入 Triage inbox，无发现的自动归档

- 可调用 Skill，保持指令可维护

### 2\.2 Worktrees（并行隔离）

**定义**：让多个 Agent 并行工作而不互相覆盖文件。

**核心问题**：两个 Agent 写同一文件 = 两个工程师 commit 到同一段代码不沟通。

**解决**：git worktree — 独立工作目录 \+ 独立分支，共享同一 repo 历史。

- Codex 内置 worktree 支持

- Claude Code 通过 `--worktree` flag 和 `isolation: worktree` 设置

- 每个 helper 获得干净 checkout，完成后自动清理

> 警示：Worktree 消除了机械碰撞，但没有消除审阅瓶颈。你能阅读和 approve 的速度决定了实际能并行多少 Agent。

### 2\.3 Skills（知识沉淀）

**定义**：停止每次 session 重新解释项目上下文的方式。

**格式**：文件夹 \+ SKILL\.md（指令 \+ 元数据）\+ 可选的 scripts/references/assets。

**两种知识**：

- **Skill** = 持久项目知识（我们如何构建、约定是什么）

- **Memory** = 变化的状态（尝试了什么、什么通过了、什么还开放）

**实操建议**：

- 一个 Skill 对应一个任务

- 描述要 boring（利于自动匹配）

- 让 Agent 帮你整理和构建 Skill 索引

- 没有 Skills 的 Loop = 每次从零重新推导项目

### 2\.4 Plugins / Connectors（MCP 连接器）

**定义**：让 Loop 触达真实工具——issue tracker、数据库、staging API、Slack。

**基础协议**：Model Context Protocol \(MCP\)

- Codex 和 Claude Code 都支持 MCP

- 为一个工具写的 connector 通常能用于另一个

- 区别：只能看文件系统的 Loop vs 能连接全工具链的 Loop

### 2\.5 Sub\-agents（Maker vs Checker）

**定义**：让写代码的不是判代码的。

**原因**：单一模型有确认偏误——会给自己打高分。

**实现**：

- Maker sub\-agent：负责起草代码

- Checker sub\-agent：对照测试、spec、linter 验证

**Claude Code /goal**：委托代码生成给 helper sub\-agents，独立的 evaluator model 持续验证停止条件（空 linter log、单元测试通过等）。

### 2\.6 Memory（外部状态存储）

**定义**：模型会遗忘，但 repo 不会。

**形式**：markdown 文件、Linear board、GitHub issue list。

**唯一要求**：活在 context window 之外。

**作用**：明天的 run 读取 state file，从今天停下的地方继续。

---

## 第3章｜工具层：Claude Code vs Codex 实现对照

|功能|Claude Code|Codex CLI / App|
|---|---|---|
|定时任务|`/loop "prompt" --schedule "cron"`|Automations Tab|
|目标驱动|`/goal "condition"`|`codex /goal "condition"` \(0\.128\.0\+\)|
|Skills|SKILL\.md 文件夹|SKILL\.md 文件夹 \+ `$` / `/skills` 调用|
|Worktree|`--worktree` flag, `isolation: worktree`|内置 worktree 支持|
|MCP|支持|支持|
|Sub\-agents|subagent 配置|sub\-agents 支持|
|自动模式|Auto Mode \(4\.6/4\.7\)|—|
|Hooks|lifecycle hooks|—|

> 决策原则：先选模型，再选工具。想要 Anthropic Claude → Claude Code 或 Cursor。想要 OpenAI GPT → Codex CLI 或 Copilot。想要灵活切换 → Cursor 或 Copilot（多 provider）。

---

## 第4章｜模式层：5 种常用 Loop 模式

### 4\.1 Retry Loop（重试循环）

- **适用**：短、原子任务，有清晰 pass/fail 标准

- **示例**：写一个通过测试的函数

- **风险**：无限重试不改变策略 → 需要变化逻辑

### 4\.2 Plan\-Execute\-Verify Loop

- **适用**：多步骤任务，顺序重要，早期错误会级联

- **示例**：重构模块、搭建新服务

- **风险**：对错误计划过度承诺 → 需要计划修订能力

### 4\.3 Explore\-Narrow Loop

- **适用**：调试未知错误、探索不熟悉的 API、性能优化

- **示例**：不知道正确方案时的多路径探索

- **风险**：上下文爆炸 → 需要尽早修剪

### 4\.4 Human\-in\-the\-Loop

- **适用**：需求无法完全指定、生产变更需要人工 review

- **示例**：高代价假设的决策点

- **风险**：打断过频 → Agent 每个小决定都问人 = 不省时间

### 4\.5 PIV Loop（Cole Medin）

三阶段：

1. **Planning** — 规划与架构

2. **PIV Loop** — 自主编程迭代循环

3. **System Evolution** — 系统级进化与学习

适配所有 Coding Agent，完整生命周期工作流。

### 决策表

|任务特征|推荐模式|
|---|---|
|明确目标 \+ 可验证|Retry Loop|
|多步骤 \+ 顺序依赖|Plan\-Execute\-Verify|
|未知方案 \+ 需要探索|Explore\-Narrow|
|高代价决策|Human\-in\-the\-Loop|
|长期项目 \+ 持续改进|PIV Loop|

---

## 第5章｜实操层：从零搭建第一个 Loop

### 5\.1 前置准备

```Markdown
# CLAUDE.md / AGENTS.md 必备内容
- 项目构建步骤
- 测试命令
- 代码约定（"我们不这样做，因为那次事故"）
- 术语表（"你"=Agent，"我/我们"=人类开发者，"用户"=终端用户）
```

### 5\.2 定义可验证目标

**好目标**："test/auth 中所有测试通过且 lint 干净"
**坏目标**："让 app 更好"

标准：

- 足够具体以评估

- 可拆分为可测试子任务

- 范围不超出 Agent 能力

### 5\.3 配置调度器 \& 断路器

```Bash
# Claude Code 定时任务示例
/loop "读取昨天 CI 失败和 open issues，写入 TODO.md，
起草 quick-win 修复" --schedule "0 9 * * 1-5"

# Claude Code 目标驱动
/goal "test/auth 所有测试通过且 lint 干净"

# Codex 持久目标 (CLI 0.128.0+)
codex /goal "迁移 billing 模块到新 pricing API，保持所有测试通过"
```

**断路器必备**：

- `max_consecutive_failures` — 连续失败上限

- `max_runtime_min` — 硬时钟超时

- Token / Dollar 预算 — 每日上限

- No\-progress 检测 — 停滞自动停止

### 5\.4 端到端示例：每日 CI 修复 Loop

```
每天早晨 9:00 触发
↓
1. 读取昨天 CI 失败 + open issues + 最近 commits
↓
2. 写入 state file：值得处理的内容
↓
3. 对一个 issue 打开独立 worktree
↓
4. Agent A 起草修复
↓
5. Agent B 对照 project skill + 测试审核
↓
6. 测试通过 → 开 PR + 更新 ticket
   测试失败 → 反馈错误 1-2 次
   卡住 → 停止 + 放入收件箱
```

### 5\.5 成本管控

- 启动慢 cadence \+ 紧 goal 条件

- 观察几天 cost 再扩容

- 验证模型（checker）比生成模型更省钱

- 硬制动：迭代次数上限 \+ 无进展检测 \+ 预算上限

---

## 第6章｜避坑层

### 6\.1 目标定义难题

软件开发常是探索性的——不一定一开始知道功能的最终形状。模糊 end state → Loop 会优化到你给的模糊句子上，可能比手动做一遍更糟。

### 6\.2 成本失控

scheduled loop \+ verifier model 每次 turn 后都跑 = token 燃烧快。Loop 在 token 预算充足的大厂最容易 hype，对普通人，**预算本身就是架构的一部分**。

### 6\.3 验证责任仍在人

> "认知投降"——完全信任 Loop 的输出而不审阅，会侵蚀工程质量。

Claim ≠ Done。必须有验证：跑测试、类型检查、reviewer agent、diff 对比 spec。

### 6\.4 事件循环饥饿 \& Runaway 进程

Agent 无人值守运行时，tight retry loop 可能饱和调用栈，阻止标准 timer 和 signal handler 触发。

解决：同步 watchdog（绕过异步事件队列，直接从 OS 读取进程状态）。

---

## 第7章｜进阶层：多 Agent 协作 Loop

### 7\.1 Codex\-Claude 双 AI 工作流

```
Plan (Claude) → Validate (Codex) → Implement (Claude)
→ Review (Codex) → Fix → Re-validate → Done
```

**Codex 当 supervisor 的变体**：Codex 负责规划、审查、验收，把 bounded 任务委派给 Claude Code 执行。

**Claude 当 supervisor 的变体**：Claude 负责架构和实现，Codex 负责验证和 QA。

### 7\.2 工作流核心规则

- 始终使用 `codex exec`（在 Claude Code 中）

- Preflight checklist 强制 Git repo \+ 创建 `.codex-loop` 上下文目录

- 可复现 artifacts 保存在 `.codex-loop`（plan\.md、验证输出）

### 7\.3 Worktree 并行策略

```
主分支
├── worktree-A → Agent A 处理 auth 模块
├── worktree-B → Agent B 处理 billing 模块
└── worktree-C → Agent C 修复 CI 失败
```

### 7\.4 审阅瓶颈

> **你能 Review 的速度 = Loop 实际上限**，不是工具能开的 worktree 数量。

10 个 Agent 产出你无法 review 的变更 \< 2 个你能 fully review 的 Agent。

---

## 第8章｜哲学层

### 8\.1 Vibe Coding → Agentic Coding → Loop Engineering

|阶段|隐喻|质量标准|你的角色|
|---|---|---|---|
|Vibe Coding|3D 打印原型|能跑就行|操作者|
|Agentic Coding|生产线|测试\+安全\+可维护|审阅者|
|**Loop Engineering**|**自动化工厂**|**系统验证**|**架构师**|

### 8\.2 角色转变

- 从写代码 → 写生成代码的系统

- 从创意 prompt 写手 → 刚性系统工程师

- 价值集中在两端：定义意图 \+ 最终审阅

- 中间的执行和验证 = Agent 的工作

### 8\.3 "黑暗工厂"陷阱

完全自动化（生成→审阅→merge 全无人）是陷阱。好的软件开发很少是直线。Loop 对窄任务、可验证任务极好，但 vision\-level 决策仍需人类。

### 8\.4 Skill 是复利资产

> 没有可复用 Skills 的 Loop = 每次 run 从零发现项目。
有好 Skills 的 Loop = 开始复利。

Skill 是你写下约定、示例、测试命令、永远不想重复的东西。它是 markdown 文件集合，随着时间增长，是 Loop Engineering 中最被低估的复利资产。

---

## 附录

### A\. 资源清单

**英文文章**：

1. Lushbinary: Loop Engineering Guide — https://lushbinary\.com/blog/loop\-engineering\-ai\-coding\-agents\-guide

2. MindStudio: What Is Loop Engineering — https://www\.mindstudio\.ai/blog/what\-is\-loop\-engineering\-ai\-coding\-agents

3. Louis\-François Bouchard: Loop Engineering Explained — https://www\.louisbouchard\.ai/loop\-engineering

4. Cobus Greyling \(Substack\): Loop Engineering — https://cobusgreyling\.substack\.com/p/loop\-engineering

5. Medium: From Prompts to Loops — https://medium\.com/@KilgortTrout/from\-prompts\-to\-loops

6. WenHao Yu: Agentic Coding Guide — https://yu\-wenhao\.com/en/blog/agentic\-coding\-guide

**视频**：

1. Cole Medin: PIV Loop — YouTube

2. Matt Pocock: Full Walkthrough \(95min\) — https://www\.youtube\.com/watch?v=\-QFHIoCo\-Ko

3. Louis Bouchard 配套视频 — https://youtu\.be/NjXIIH9vcv0

**中文资源**：

1. 翔宇工作流 — https://xiangyugongzuoliu\.com

2. 知乎: Claude Code 万字教程 — https://zhuanlan\.zhihu\.com/p/2041162625233511147

3. AI超元域 — https://www\.aivi\.fyi/categories

4. GitHub: KimYx0207/AI\-Coding\-Guide\-Zh

### B\. 常用命令速查表

**Claude Code**：

```
/loop "prompt" --schedule "0 9 * * 1-5"   # 定时循环
/goal "condition"                          # 目标驱动
/skills                                    # 管理 skills
hooks                                      # 生命周期钩子
```

**Codex**：

```
codex /goal "condition"                    # 持久目标 (0.128.0+)
codex exec                                 # 执行验证
$ skill-name                               # 调用 skill
```

### C\. 第一个 Loop 模板

```Markdown
# TODO.md — Loop State File

## 目标

[ ] 所有 test/auth 测试通过


[ ] Lint 无错误


## 状态
- [ ] 尚未开始

## 日志
| 时间 | 动作 | 结果 | 下一步 |
|------|------|------|--------|
|      |      |      |        |
```

### D\. 术语表

|英文|中文|释义|
|---|---|---|
|Loop Engineering|循环工程|设计自动运行 Agent 循环的系统|
|Prompt Engineering|提示工程|优化单条 prompt|
|Context Engineering|上下文工程|优化注入窗口的内容|
|Harness Engineering|驾驭工程|单次 Agent 运行的约束机制|
|Agentic Coding|智能体编程|Agent 自主执行编码任务|
|Vibe Coding|氛围编程|凭感觉让 AI 写代码|
|Worktree|工作树|Git 并行开发隔离方案|
|MCP|模型上下文协议|连接外部工具的协议|
|Maker/Checker|制作者/验证者|多 Agent 分工模式|
|Sub\-agent|子智能体|主 Agent 派出的辅助 Agent|
|Auto Mode|自动模式|Claude 4\.6\+ 安全审批自动化|

---

> *素材汇编完成。下一步：按章节逐章生成公众号正文。*

---

## 📌 大纲调整确认（2026\-06\-12 10:40）

第7章升级为：Anthropic 三 Agent 架构与多 Agent 协作 Loop

新增 7\.1 Planner\-Generator\-Evaluator（🔥 重点章节）

---

## 第7章 新增素材（Anthropic 官方架构）

### 来源

Anthropic 工程博客：**Harness design for long\-running application development**
作者：Prithvi Rajasekaran（Labs 团队）

### 两个持久失败模式

**失败模式 1：上下文焦虑（Context Anxiety）**

- 模型在长任务中接近上下文上限时，会提前收工

- Compaction（原位摘要）不够——模型仍有"历史包袱"

- **Context Reset（上下文重置）才是解法**：清空上下文 \+ 结构化交接 artifact

- 代价：编排复杂度、token 开销、延迟

**失败模式 2：自我评估偏误（Self\-Evaluation Bias）**

- Agent 给自己的作品打高分——即使质量平庸

- 主观任务（如设计）尤甚：无二进制 pass/fail 测试

- **解法：分离"干活的"和"评判的"**

### GAN 启发的对抗评估架构

- 灵感来自 Generative Adversarial Networks

- Generator 生产 → Evaluator 评判 → 反馈 → Generator 迭代

- 同一个 Agent 无法可靠评估自己的输出

- 单独调教 Evaluator 变得批判性，比让 Generator 自我批判容易得多

### 三 Agent 架构

|角色|职责|
|---|---|
|Planner（规划器）|将产品 spec 分解为可执行的 sprint contract|
|Generator（生成器）|实现 sprint contract，产出代码|
|Evaluator（评估器）|对照 Planner 的要求独立验证 Generator 输出|

**关键原则**：Evaluator 必须与 Generator 分离——结构化分离是质量跃迁的前提

### 四条可量化评判标准（前端设计场景）

|标准|定义|默认表现|
|---|---|---|
|Design Quality|设计是否有凝聚力的整体|容易出"AI slop"|
|Originality|是否有定制决策|容易出"AI slop"|
|Craft|技术执行（字体、间距、色彩）|默认就好|
|Functionality|可用性独立于审美|默认就好|

**权重策略**：Design Quality \+ Originality \> Craft \+ Functionality

**Few\-shot 校准**：用详细评分 breakdown 的 few\-shot 示例校准 Evaluator，确保与人类偏好一致，减少评分漂移

### 全栈开发迁移

- Generator\-Evaluator Loop 自然映射到软件开发生命周期

- 代码 review 和 QA = 设计评估的同等结构角色

- 实际案例：2D 复古游戏（6 小时全自主）、DAW（Opus 4\.6 上近 4 小时）

---

### Ash \& Andrew 的 Generator\-Evaluator 契约

来源：AI Engineer Workshop 2026\-05\-18，Ash Prabaker \& Andrew Wilson（Anthropic）

核心观点：

- 对抗性 Evaluator 优于自我评估

- 上下文压缩 ≠ 治愈连贯性漂移 → 结构化交接才行

- 将工作分解为可测试的 sprint contract

- 用 rubric 评分主观输出

- 看 trace 作为首要调试手段

- 模型进化时，哪些 harness 组件该删掉

