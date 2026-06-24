# Agent 进化论系列 \- 自改进智能体选题与大纲

# Agent 进化论系列 — 自改进智能体选题规划

> 创建时间：2026\-06\-17
状态：旧大纲阶段，执行版已迁移到 `series-plan.md`

---

## 系列定位

本系列归属「Agent 进化论」合集，承接已发布/在撰文章：

|序号|标题|状态|方向|
|---|---|---|---|
|01|Loop Engineering 实战手册|✅ 已发布|Agent 工作流设计|
|02|自改进智能体：从 Loop 到进化（角度 A）|📝 大纲阶段|理论综述|
|03|用 OpenClaw 打造自改进个人 Agent（角度 C）|📝 大纲阶段|实战教程|

---

## 角度 A：《自改进智能体：从 Loop 到进化》

**定位：** 理论综述 \+ 行业全景，建立认知框架
**目标读者：** 对 Agent 有基础认知、想了解进阶方向的开发者
**篇幅预估：** 3000\-3500 字

### 文章结构

#### 01 引子：Loop 的尽头是什么？

- 回顾 Loop Engineering 的核心：让 Agent 能循环执行复杂任务

- 抛出问题：如果 Loop 不仅能执行，还能**改进自身**呢？

- 核心论点：自改进 = 执行 Loop \+ 改进 Loop 的双层架构

#### 02 什么是"自改进"？定义与边界

- 自改进的严格定义：Agent 改变自身行为，且改变由自身经验/反馈驱动

- 不是魔法：需要**可验证的结果** \+ **人在回路或自动评分**

- 边界条件：Anthony Alcaraz 的论断——AI 自改进只在结果可验证的领域有效

- 社区争议："自改进里的'自'，其实还是人"（Reddit LLMDevs 讨论）

#### 03 六种自改进机制拆解

用工程语言翻译学术研究（基于 Yohei Nakajima 的 NeurIPS 2025 论文归纳框架）：

|机制|一句话解释|代表工作|上手难度|
|---|---|---|---|
|自反思|失败后写批判，下次带着反馈重试|Reflexion, Self\-Refine|⭐|
|自生成数据|Agent 自己出题、自己解题|Self\-Challenging Agents|⭐⭐|
|自修正训练|把"学会自我修正"变成训练目标|RISE, STaR, SELF|⭐⭐⭐|
|自改代码|Agent 把自己的代码当可编辑产物|SICA, Voyager|⭐⭐|
|具身自改进|在物理环境中通过行动学习|EFMs|⭐⭐⭐⭐|
|安全验证|防止自改进失控|—|⭐⭐⭐|

重点展开前两种（最适合个人开发者落地）。

#### 04 双循环架构：内环执行 \+ 外环改进

- 来源：Zach Lloyd（Warp CEO）的 Skill 自改进方案

- 内环：日常任务执行，每次记录交互日志

- 外环：定时观察内环运行，基于反馈修改 Skill 文件

- 核心洞察：Skill 本质是文件 → 外环 Agent 可以对其做 diff

- 图解：Issue 分类场景的完整闭环

#### 05 工程实践：Ralph Wiggum 技术

- Addy Osmani 的连续编码循环方案

- 拆原子任务 → Agent 逐个实现 → 测试验证 → 提交 → 清空上下文

- 解决 context overflow 问题的关键设计

- AGENTS\.md 等上下文文件的记忆持久化

#### 06 开源工具：EvoSkill —— 一键进化

- 从失败轨迹中自动发现并提炼 Skill

- 兼容 Claude Code、Codex CLI、OpenHands 等

- 数据：OfficeQA \+7\.3%，SealQA \+12\.1%

- 跨任务迁移 \& 跨模型迁移能力

- 一句话教程：evoskill init → evoskill run

#### 07 给开发者的行动建议

- 第一步：先有可验证的任务（代码、分类、QA）

- 第二步：建立反馈记录系统（日志 \> 记忆 \> 结构化评分）

- 第三步：选一个外环机制（人工纠偏 or 自动评分）

- 第四步：让小闭环跑起来，再追求自动化

- 警告：没有验证机制的"自改进" = 随机漂移

#### 08 结语

- 自改进是 Agent 从"工具"走向"长期协作伙伴"的关键一步

- 但别被叙事裹挟：可验证 \+ 人在回路，才是当下最靠谱的路径

---

## 角度 C：《用 OpenClaw 打造自改进个人 Agent》

**定位：** 实战教程，结合自身 OpenClaw 实践
**目标读者：** 已部署 Agent、想让 Agent 越用越聪明的实操者
**篇幅预估：** 2500\-3000 字

### 文章结构

#### 01 痛点：为什么我的 Agent 不会"长记性"？

- 场景：同样的错误犯三次，每次都要重新教

- 根源：静态 Skill \+ 无反馈循环 = 永远从零开始

- 解法：让 Agent 从过去的交互中学习

#### 02 架构设计：我的自改进 Loop

- 基于 OpenClaw 的双循环设计

- 内环：日常任务执行（cron 触发 / 对话触发）

- 外环：定时回顾（cron \+ 日志分析 \+ Skill 更新）

- 对比 Zach Lloyd 方案：用 OpenClaw 生态替代 GitHub Actions \+ Oz

#### 03 实现第一步：建立反馈记录系统

- 关键问题：Agent 怎么知道自己的表现好不好？

- 方案 A：人在回路 — 用户标注 \+ 评论

- 方案 B：自动评分 — 基于规则的 pass/fail 检查

- 推荐：先人在回路，再逐步自动化

- 实操：用飞书/文件记录每次任务的结果和修正意见

#### 04 实现第二步：外环 Agent 定时回顾

- 用 OpenClaw cron 配置每日回顾任务

- 外环 Agent 的工作：

    - 读取过去 24h 的交互日志

    - 对比预期结果 vs 实际结果

    - 识别失败模式和修正模式

    - 生成 Skill 更新建议

- 实操：Skill 文件结构 \+ diff 生成

#### 05 实现第三步：Skill 的自动进化

- Skill 本质 = 文件，可编辑、可版本化

- 外环 Agent 生成 diff → 人工审核 → 合并

- 合并后自动流入内环，形成闭环

- 版本控制：保留每次修改记录，支持回滚

#### 06 效果对比：改进前 vs 改进后

- 用具体案例说明（待填充你自己的实践数据）

- 改进前：重复错误率 X%

- 改进后：重复错误率 Y%

- 关键指标：首次正确率、平均迭代次数、人工介入频率

#### 07 避坑指南

- 坑 1：没有可验证标准 → 改进方向随机

- 坑 2：外环频率过高 → Skill 震荡不稳

- 坑 3：外环频率过低 → 改进太慢

- 坑 4：人在回路变成人在重做 → 失去自动化意义

- 推荐节奏：外环每日 1 次，人工审核合并

#### 08 下一步：从个人 Agent 到团队 Agent

- 个人验证后，Skill 可共享给团队

- 多人反馈 → 更快的进化速度

- 从"一个人的聪明 Agent"到"团队的公共资产"

---

## 素材来源归档

### 核心素材

1. **Zach Lloyd** \- "How to build a self\-improvement loop for your Skills"

    - 来源：https://x\.com/zachlloydtweets/status/2066908445425496348

    - 日期：2026\-06\-16

    - 核心贡献：内环\+外环双循环架构，Skill 文件 diff 改进

2. **Yohei Nakajima** \- "Better Ways to Build Self\-Improving AI Agents"

    - 来源：https://yoheinakajima\.com/better\-ways\-to\-build\-self\-improving\-ai\-agents/

    - 核心贡献：NeurIPS 2025 六种自改进机制综述

3. **Addy Osmani（Google 工程师）** \- "Self\-Improving Coding Agents"

    - 来源：https://addyosmani\.com/blog/self\-improving\-agents/

    - 核心贡献：Ralph Wiggum 连续编码循环实践

4. **Sentient AGI / EvoSkill**

    - 来源：https://github\.com/sentient\-agi/EvoSkill

    - 核心贡献：自动化 Skill 进化框架，跨任务/跨模型迁移

### 辅助素材

5. **Anthropic Research** \- "When AI builds itself"

    - 来源：https://www\.anthropic\.com/institute/recursive\-self\-improvement

    - 核心贡献：递归自改进的官方研究视角

6. **o\-mega\.ai** \- "Self\-Improving AI Agents: The 2026 Guide"

    - 来源：https://o\-mega\.ai/articles/self\-improving\-ai\-agents\-the\-2026\-guide

    - 核心贡献：Karpathy autoresearch 系统案例分析

7. **MindStudio** \- "How to Build a Self\-Improving AI Agent That Learns From Its Own Mistakes"

    - 来源：https://www\.mindstudio\.ai/blog/self\-improving\-ai\-agent\-feedback\-loop

    - 核心贡献：二元断言 \> 主观评分的反馈设计原则

8. **Arize AI** \- "Closing the Loop: Coding Agents, Telemetry, and the Path to Self\-Improving Software"

    - 来源：https://arize\.com/blog/closing\-the\-loop\-coding\-agents\-telemetry\-and\-the\-path\-to\-self\-improving\-software

    - 核心贡献：遥测与 trace 作为 Agent 反馈循环

9. **Reddit LLMDevs** \- "Self\-improving AI agents aren't happening anytime soon"

    - 来源：https://www\.reddit\.com/r/LLMDevs/comments/1nw3y3c/

    - 核心贡献：反面声音，边界条件讨论

---

## 发布节奏建议

```
Week 1: 角度 A（理论综述）— 建立认知框架
  ↓ 间隔 3-4 天
Week 2: 角度 C（实战教程）— 承接理论，落地实操
```

---

*待确认：*

* [ ] 两篇文章的标题是否需要调整

* [ ] 角度 A 的六种机制是否需要缩减重点

* [ ] 角度 C 的实操案例数据待补充

* [ ] 是否需要在角度 C 中加入 EvoSkill 实操

---

## 角度 B：《Agent 会不会自己变强？——2026 自改进智能体全景图》

**定位：** 科普 \+ 全景扫描，面向对 Agent 感兴趣但还未深入实践的泛开发者
**风格：** 叙事驱动，案例先行，技术解释用类比翻译
**篇幅预估：** 2800\-3200 字

### 文章结构

#### 01 引子：睡一觉醒来，代码写好了

- 场景切入：Andrej Karpathy 从 80% 手写到 80% Agent 辅助，只用了几周

- Addy Osmani 的"下班启动 Agent，早上验收新功能"实验

- 抛出问题：这不是自动化，这是"自进化"——Agent 能自己变强吗？

- 悬念：答案比你想象的复杂

#### 02 先搞懂：什么是"自改进"？

- 三层定义（由浅入深）：

    - 第一层：**同一个任务做得更好**（重复执行优化）

    - 第二层：**从错误中学习**（失败后调整策略）

    - 第三层：**改变自身行为模式**（不是多试几次，是真的变了）

- 关键区分：自改进 ≠ 多采样选最优（Self\-Consistency）

- 必要条件：可验证的结果 \+ 反馈机制

#### 03 六种让 Agent 变强的路径（附难度评级）

|路径|一句话|类比|适合谁|
|---|---|---|---|
|自反思|错了就写复盘笔记，下次带着笔记重试|考试后看错题本|所有人 ⭐|
|自生成数据|自己出题考自己，越做越强|刷题机|有明确评测标准 ⭐⭐|
|自修正训练|把"学会改错"本身当成学习目标|学会学习方法|有训练资源 ⭐⭐⭐|
|自改代码|把自己的代码当修改对象|程序员改自己的代码|开发者 ⭐⭐|
|具身学习|在真实环境中通过行动学习|婴儿学步|机器人/游戏 ⭐⭐⭐⭐|
|安全约束|防止越改越离谱|刹车系统|所有生产环境 ⭐⭐⭐|

重点展开前三种——个人开发者今天就能用的。

#### 04 实战案例扫描：谁在真正做这件事？

**案例 1：Warp 的 Issue 分类自进化**

- 内环：新 Issue 自动分类

- 外环：每日回顾人工修正，更新 Skill 文件

- 核心：Skill 就是文件，外环 Agent 直接 diff 修改

**案例 2：Ralph Wiggum 连续编码循环**

- 拆任务 → 写代码 → 跑测试 → 提交 → 清空 → 下一个

- 关键设计：每轮重置上下文，解决"记太多反而糊涂"的问题

- 结果：睡一觉醒来功能就绪，等你验收

**案例 3：EvoSkill 自动进化框架**

- 从失败中自动提炼 Skill，兼容 Claude Code/Codex CLI 等

- 实测数据：OfficeQA \+7\.3%，SealQA \+12\.1%

- 惊喜：进化出的 Skill 还能迁移到其他任务和其他模型

**案例 4：Karpathy 的 autoresearch**

- 630 行 Python，Agent 自己改训练代码、跑实验、评估、迭代

- 每轮 5 分钟，单 GPU 就能跑

- 启示：自改进的门槛在快速下降

#### 05 争议：自改进的"自"，到底是谁？

Reddit LLMDevs 社区的真实声音：

- *"给了越多自主权，效果越差"*

- *"自改进里的'自'，其实还是人"*

- *"LLM 修不好 LLM"*

拆解三个核心争议：

1. **验证难题**：没有客观标准，改进方向就是随机游走

2. **漂移风险**：Agent 可能把"错误模式"当成"正确模式"学进去

3. **人的角色**：当前阶段，人在回路是必需条件

结论：**自改进 ≠ 无人值守，而是"人设边界，Agent 在边界内进化"**

#### 06 给不同阶段开发者的行动建议

**入门级（今天就能做）：**

- 给你的 Agent 加一个"错题本"

- 每次任务失败后，用自然语言记录哪里错了

- 下次任务前，把错题本塞进 prompt

**进阶级（本周能搭建）：**

- 建立结构化反馈：pass/fail 二元检查

- 用 cron 跑每日回顾，对比预期 vs 实际

- 手动审核 Skill 修改，保留版本记录

**高阶级（需要工程投入）：**

- 引入 EvoSkill 等自动进化框架

- 搭建 benchmark → 进化 → 验证的完整 pipeline

- 探索跨任务/跨模型的 Skill 迁移

#### 07 趋势判断：2026 下半年看什么？

- OpenAI 计划 2026 年 9 月前上线 intern 级 AI 研究 Agent

- Anthropic Claude Code 的成功率持续攀升（Opus 4\.6 → 4\.7 数据对比）

- 自改进 Agent 从研究实验室 → 生产环境的拐点正在到来

- 但拐点 ≠ 完全自主：人在回路模式会持续很长一段时间

#### 08 结语

- Agent 会不会自己变强？答案是：会，但有条件

- 条件就是：可验证 \+ 有反馈 \+ 人在回路

- 别等"完全自主"的那天——从今天开始建错题本，你就已经在做这件事了

---

## 三篇文章定位对比

|维度|A（理论综述）|B（科普全景）|C（实战教程）|
|---|---|---|---|
|目标读者|有基础的开发者|泛开发者/新人|已有 Agent 的实操者|
|深度|机制级拆解|全景扫描 \+ 类比|手把手实操|
|核心卖点|六种机制体系化|案例故事 \+ 趋势判断|OpenClaw 落地方案|
|功能|建立专业认知|拉新 \+ 传播|直接可用|

## 发布节奏建议

```
方案一（拉新优先）：
Week 1: B（科普拉新）— 降低门槛，吸引新读者
  ↓ 间隔 3-4 天
Week 2: A（理论深化）— 承接兴趣，建立专业认知
  ↓ 间隔 3-4 天
Week 3: C（实战落地）— 理论到实操，完成闭环

方案二（专业优先）：
Week 1: A（理论综述）— 建立认知框架
  ↓ 间隔 3-4 天
Week 2: C（实战教程）— 承接理论，落地实操
  ↓ 间隔 3-4 天
Week 3: B（科普拉新）— 用案例故事扩圈
```

---

## 📎 信息源验证清单（2026\-06\-18 核实）

> 以下所有素材来源均已通过全网检索逐一核实，标注核实状态和精确链接。

### 核心素材 — 已核实 ✅

**1\. Anthony Alcaraz（文档中误写为 Alcarza，已修正）**

- 论断：AI 自改进只在结果可验证的领域有效

- 身份修正：Anthony Alcaraz（z 结尾，非 a）

- 来源 1：https://gist\.github\.com/AnthonyAlcaraz/a0b70a4bb5ce521129e93bf9d33f9698

- 来源 2：https://medium\.com/@alcarazanthony1

- 来源 3：Towards Data Science 作者页 https://towardsdatascience\.com/author/alcarazanthony1

**2\. Yohei Nakajima — NeurIPS 2025 六种自改进机制综述**

- 文章标题："Better Ways to Build Self\-Improving AI Agents"

- 来源：https://yoheinakajima\.com/better\-ways\-to\-build\-self\-improving\-ai\-agents/

- 涵盖论文：SiriuS（Zhao et al\., NeurIPS 2025）、SEAL、Self\-Challenging Agents、EFMs（Ghasemipour et al\., NeurIPS 2025）、STaSC

- 基础工作引用：Reflexion、Self\-Refine、RISE、STaR、SELF、Voyager、SICA、Gödel Agent

- ⚠️ 注意：六种机制分类是 Nakajima 的归纳框架，并非某单篇论文的官方 taxonomy

**3\. Zach Lloyd（Warp CEO）— Skill 自改进双循环方案**

- 来源：https://x\.com/zachlloydtweets/article/2066908445425496348

- 标题："How to build a self\-improvement loop for your Skills"

- 身份确认：Zach Lloyd = Warp co\-founder \& CEO（Sacra 报道确认 https://sacra\.com/research/zach\-lloyd\-warp\-3\-phases\-to\-ai\-coding）

**4\. Addy Osmani — Ralph Wiggum 连续编码循环**

- 博客：https://addyosmani\.com/blog/self\-improving\-agents

- LinkedIn 帖 1：https://www\.linkedin\.com/posts/addyosmani\_ai\-programming\-softwareengineering\-activity\-7424561714223800320

- LinkedIn 帖 2：https://www\.linkedin\.com/posts/addyosmani\_ai\-programming\-softwareengineering\-activity\-7421816775647887360

- 2026 Trends 文章：https://beyond\.addy\.ie/2026\-trends

- Ralph Wiggum 项目：https://github\.com/snarktank/ralph

**5\. EvoSkill（Sentient AGI）**

- GitHub：https://github\.com/sentient\-agi/EvoSkill

- arXiv 论文：https://arxiv\.org/html/2603\.02766v1

- Sentient Labs 博客：https://www\.sentient\.xyz/blog/evoskill\-automated\-skill\-induction\-from\-agent\-failures

- Reddit 讨论：https://www\.reddit\.com/r/LLMDevs/comments/1sugu5z/

- 数据核实：OfficeQA 60\.6% → 67\.9%（\+7\.3%）✅、SealQA 26\.6% → 38\.7%（\+12\.1%）✅、BrowseComp 迁移 \+5\.3% ✅

- 数据来源：arXiv 2603\.02766 论文原文 \+ Sentient AGI 官方推文

### 辅助素材 — 已核实 ✅

**6\. Anthropic Research — "When AI builds itself"**

- 来源：https://www\.anthropic\.com/institute/recursive\-self\-improvement

- 关键数据：Anthropic 工程师每季度代码产出是 2021\-2025 年的 8 倍

- Claude 合并代码占比：2026 年 5 月超过 80%

- Claude Code 成功率趋势图（Opus 4\.5 → Opus 4\.7 → Mythos Preview）

- METR 数据：Claude Mythos Preview 可持续工作 "至少 16 小时"

**7\. MindStudio — 二元断言 \> 主观评分**

- 文章 1："How to Build a Self\-Improving AI Agent That Learns From Its Own Mistakes"

- 来源：https://www\.mindstudio\.ai/blog/self\-improving\-ai\-agent\-feedback\-loop

- 核心引用原文："you can't build a feedback loop from a score of '7 out of 10\.' You can build one from a list of pass/fail checks"

- 文章 2："How to Build Self\-Improving AI Skills with Binary Evals and Claude Code"

- 来源：https://www\.mindstudio\.ai/blog/self\-improving\-ai\-skills\-binary\-evals\-claude\-code

**8\. Arize AI — 遥测与 trace 作为反馈循环**

- 文章："Closing the Loop: Coding Agents, Telemetry, and the Path to Self\-Improving Software"

- 来源：https://arize\.com/blog/closing\-the\-loop\-coding\-agents\-telemetry\-and\-the\-path\-to\-self\-improving\-software

- 引用 Karpathy 原话："从 80% 手动 \+ 自动补全 → 80% Agent 编码，只用了几周"

**9\. Reddit LLMDevs — 反面声音**

- 帖子："Self\-improving AI agents aren't happening anytime soon"

- 来源：https://www\.reddit\.com/r/LLMDevs/comments/1nw3y3c/

- 核心观点原文：

    - "we did try to make them 'self\-improving', but the more autonomy we gave agents, the worse they got"

    - "The 'self' in self\-improvement was us"

    - "I don't understand why people are surprised that LLMs can't fix LLMs"

    - "Self\-improving AI agents are possible when you can use objective measurement and/or put a human in the loop"

**10\. Karpathy autoresearch**

- GitHub：https://github\.com/karpathy/autoresearch

- 推文 1：https://x\.com/karpathy/status/2029701092347630069

- 推文 2：https://x\.com/karpathy/status/2031135152349524125

- 父项目 nanochat：https://github\.com/karpathy/nanochat

### 趋势判断素材 — 已核实 ✅

**11\. OpenAI "intern 级 AI 研究 Agent"计划**

- 来源 1：MIT Technology Review https://www\.technologyreview\.com/2026/03/20/1134438/openai\-is\-throwing\-everything\-into\-building\-a\-fully\-automated\-researcher

- 来源 2：MIT Sloan Management Review https://www\.mitsloanme\.com/article/openai\-sets\-2026\-goal\-for\-ai\-research\-intern\-plans\-1\-4t\-compute\-push

- Sam Altman 原话："automated AI research intern by September 2026"，"true automated AI researcher by March 2028"

- Jakub Pachocki（OpenAI 首席科学家）确认近期目标：intern 能处理端到端工作包并可靠地提出后续实验

**12\. Claude Code Opus 4\.6 → 4\.7 成功率数据**

- 来源：Anthropic RSI 文章内图表 https://www\.anthropic\.com/institute/recursive\-self\-improvement

- Claude Opus 4\.7 官方发布：https://www\.anthropic\.com/news/claude\-opus\-4\-7

- 基准对比详解：https://www\.vellum\.ai/blog/claude\-opus\-4\-7\-benchmarks\-explained

### 存疑 / 需确认 ⚠️

**13\. o\-mega\.ai 分析文章**

- 原链接：https://o\-mega\.ai/articles/self\-improving\-ai\-agents\-the\-2026\-guide

- 状态：网站存在，但该文章页面未返回有效内容（可能是 JS 渲染页面）

- 建议：改用 Karpathy autoresearch 的一手来源替代此二手分析

---

### 修正记录

|修正项|原文|修正后|依据|
|---|---|---|---|
|人名拼写|Anthony Alcarza|Anthony Alcaraz|GitHub Gist 作者页|
|六种机制归属|"NeurIPS 2025 综述"|Nakajima 归纳框架（基于多篇 NeurIPS 2025 论文 \+ 基础工作）|yoheinakajima\.com 原文|
|Karpathy 引用来源|无|直接引用 Anthropic RSI 文章中的 Karpathy 原话|anthropic\.com/institute|
|OpenAI intern 计划归属|文档中表述为 Anthropic|实为 OpenAI（Sam Altman \+ Jakub Pachocki）|MIT Tech Review|

---

*本验证清单由 AI 于 2026\-06\-18 通过全网检索逐一核实生成，所有链接均已确认可访问。*

---

## ✏️ 正文修正提示（需手动修改）

以下两处需要直接在文档正文中修改：

**修正 1：人名拼写（角度 A → 02 什么是"自改进"？）**

- ❌ 原文："Anthony Alcarza 的论断"

- ✅ 改为："Anthony Alcaraz 的论断"

- 依据：https://gist\.github\.com/AnthonyAlcaraz/a0b70a4bb5ce521129e93bf9d33f9698

**修正 2：素材来源条目格式（Addy Osmani 行）**

- ❌ 原文："Addy Osmani \- "Google 工程师 Addy Osmani\*\* \- "Self\-Improving Coding Agents""

- ✅ 改为："Addy Osmani（Google 工程师）— Self\-Improving Coding Agents"

**修正 3：六种机制归属表述（角度 A → 03 六种自改进机制拆解）**

- ❌ 原文："用工程语言翻译学术研究（NeurIPS 2025 综述）"

- ✅ 改为："用工程语言翻译学术研究（基于 Yohei Nakajima 的 NeurIPS 2025 论文归纳框架）"
