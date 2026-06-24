# 自我改进 Agent 采证包

日期：2026-06-18
状态：执行前采证包，正式起稿前需要按当日信息复核

## 使用规则

- 这里是证据池，不是正文。
- 任何 2026 年公司计划、模型版本、工具数据、论文指标，起稿前都要重新打开原始来源核验。
- 如果只能找到二手转述，正文中不要写成确定事实。
- 反方材料必须保留。这个专题的可信度来自边界，不来自热词密度。

## 核心论点证据需求

| 论点 | 需要的证据 | 可用素材 | 起稿风险 |
| --- | --- | --- | --- |
| 自改进需要可验证结果 | 二元检查、客观指标、人审记录 | Anthony Alcaraz、MindStudio binary evals | 人名、原文链接需复核 |
| 自改进是双循环 | 内环执行、外环复盘、Skill diff | Zach Lloyd/Warp Skill loop | X/Twitter 链接可能访问不稳 |
| 自反思和自生成数据更适合个人落地 | 机制分类和代表工作 | Yohei Nakajima 归纳框架 | 不能写成单篇论文官方 taxonomy |
| 连续编码循环需要上下文重置和验证 | 任务拆分、测试、提交、清空上下文 | Addy Osmani、Ralph Wiggum | 项目状态需复核 |
| 工具自动提炼 Skill 有真实收益但不能神化 | benchmark 和迁移结果 | EvoSkill / Sentient AGI | 数据必须回到论文或官方说明 |
| 无验证的自改进会漂移 | 社区反方、失败案例、安全边界 | Reddit LLMDevs、生产事故、评估失败案例 | Reddit 只能做观点侧证 |

## 来源池

### A. 框架与机制

1. Yohei Nakajima: Better Ways to Build Self-Improving AI Agents
   - 用途：六类机制的工程化翻译。
   - 写法：表述为“Yohei Nakajima 的归纳框架”，不要写成 NeurIPS 官方综述。

2. Anthony Alcaraz 相关材料
   - 用途：自改进只适合结果可验证的领域。
   - 写法：起稿前重新核人名、链接和原文措辞。

3. MindStudio: self-improving agent feedback loop / binary evals
   - 用途：二元断言优先于主观评分。
   - 写法：适合放在第 03 篇，连接反馈日志模板。

### B. 工程实践

1. Zach Lloyd / Warp Skill self-improvement loop
   - 用途：内环/外环、Skill 文件 diff、人工修正流入系统。
   - 写法：适合第 02 篇和第 04 篇。

2. Addy Osmani: Self-Improving Coding Agents
   - 用途：连续编码循环、任务拆分、测试验证、上下文重置。
   - 写法：适合第 01 篇案例扫描和第 02 篇工程实践。

3. Ralph Wiggum 项目
   - 用途：连续编码循环工具侧例子。
   - 写法：只在复核项目仍可访问后使用。

4. OpenClaw
   - 用途：第 04 篇实战主角。
   - 写法：优先用作者自己的真实实践，不虚构效果数据。

### C. 工具与实验

1. EvoSkill / Sentient AGI
   - 用途：失败轨迹到 Skill 的自动归纳。
   - 写法：放加更或第 01 篇简短提及，主线不要被工具测评带偏。

2. Karpathy autoresearch
   - 用途：自动研究/自动实验的轻量案例。
   - 写法：只用一手 GitHub 或作者原文，不引用不可访问二手分析。

### D. 反方与边界

1. Reddit LLMDevs: self-improving AI agents are not happening anytime soon
   - 用途：第 01 篇和第 05 篇的反方。
   - 写法：只作为社区观点，不当成行业结论。

2. 安全与漂移材料
   - 用途：说明无验证机制会放大错误。
   - 写法：优先选代码、部署、数据修改这类可验证场景，少讲抽象风险。

## 分篇采证要求

### 01 全景图

- 必须有：定义、三层自改进、2-4 个案例、1 个反方。
- 避免：堆 2026 趋势预测。
- 可用来源：Nakajima、Addy、Warp、EvoSkill、Reddit。

#### 2026-06-18 采证快照

结论：足够支撑第 01 篇起稿，可信度 `Medium-High`。

可直接使用：

1. Yohei Nakajima《Better Ways to Build Self-Improving AI Agents》
   - 链接：https://yoheinakajima.com/better-ways-to-build-self-improving-ai-agents/
   - 可用价值：给出严格定义和六类机制框架。
   - 使用边界：页面说明内容由 AI 基于论文检索生成，应表述为“归纳框架”，不写成 NeurIPS 官方综述。

2. Addy Osmani《Self-Improving Coding Agents》
   - 链接：https://addyosmani.com/blog/self-improving-agents/
   - 可用价值：连续编码循环、任务拆分、测试验证、上下文重置、AGENTS.md 记忆持久化。
   - 使用边界：这是工程经验文章，不是实证论文。

3. EvoSkill 论文与 GitHub
   - arXiv：https://arxiv.org/abs/2603.02766
   - GitHub：https://github.com/sentient-agi/EvoSkill
   - 可用价值：从失败轨迹提炼可复用 Skill，OfficeQA、SealQA 和 BrowseComp 迁移数据。
   - 使用边界：第 01 篇只做案例扫描，完整工具测评留到加更。

4. Karpathy/autoresearch
   - GitHub：https://github.com/karpathy/autoresearch
   - 可用价值：把 AI agent 放进一个小型 LLM 训练实验系统，运行实验、评估结果并迭代。
   - 使用边界：项目 README 带有明显玩笑式叙事，正文只使用可核验的工程结构，不复述夸张表述。

5. MindStudio 自改进 Agent 反馈循环
   - 链接：https://www.mindstudio.ai/blog/self-improving-ai-agent-feedback-loop
   - 可用价值：把自改进循环拆成 task、evaluation harness、diagnostic feedback、learning store；强调 binary eval。
   - 使用边界：厂商博客，可作为工程设计参考，不作为中立研究结论。

6. Reddit LLMDevs 反方帖
   - 链接：https://www.reddit.com/r/LLMDevs/comments/1nw3y3c/selfimproving_ai_agents_arent_happening_anytime/
   - 可用价值：真实开发者视角的反方：更高自主性可能降低效果、反馈需要人工审查、漂移和 QA 是核心问题。
   - 使用边界：社区讨论，只作为观点侧证。

暂不作为正文硬证据：

- Zach Lloyd / Warp Skill 自改进 X Article：原链接可打开登录页，但正文不可公开读取；第 01 篇不引用具体说法，只保留为待复核来源。

第 01 篇可写入的关键事实：

- 自改进的严格边界：行为随经验、反馈或生成数据变化；单纯多采样或一次性微调不算长期自改进。
- 最轻量机制是反思和反馈循环，但如果反思不持久化，改进很容易停留在当前会话。
- 连续编码循环的可靠性来自小任务、明确验收、测试验证、提交记录、上下文重置和持久文件。
- EvoSkill 论文报告 OfficeQA exact-match 从 60.6% 到 67.9%，SealQA 从 26.6% 到 38.7%，SealQA skill 迁移到 BrowseComp 后提升 5.3%。
- Karpathy/autoresearch 的工程结构是：agent 修改 `train.py`，固定 5 分钟训练预算，用验证指标判断保留或丢弃实验。
- 反方观点集中在：无客观度量、真实输入混乱、RLAIF 脆弱、漂移、QA 和 rollback 成本。

第 01 篇反向边界：

- 许多“自改进”本质是人把失败整理成规则，再让 Agent 下次读取。
- 代码、分类、QA 这类可验证任务更适合起步；开放式写作、战略判断、价值选择需要更多人审。
- 如果只有单一 eval，Agent 可能优化指标而牺牲真实质量。
- 目前不应承诺“睡一觉 Agent 自动把系统变好”，更稳的说法是“可验证窄任务可以积累经验”。

### 02 从 Loop 到进化

- 必须有：Loop 与自改进的差异、双循环图、Skill 文件可版本化。
- 避免：重复 Loop Engineering 四要素。
- 可用来源：Warp Skill loop、Loop Engineering 已有文章。

### 03 Agent 错题本

- 必须有：反馈字段、pass/fail 检查、失败归因、下一次如何使用。
- 避免：把“复盘”写成情绪总结。
- 可用来源：MindStudio binary evals、个人内容/代码工作流。

### 04 OpenClaw 个人 Agent

- 必须有：低成本最小系统、每日复盘、人工审核、回滚。
- 避免：承诺自动改代码或自动发布。
- 可用来源：OpenClaw 实践、Zach Lloyd 双循环。

### 05 边界与漂移

- 必须有：没有验证的风险、权限边界、停止条件、Skill 更新审核。
- 避免：恐吓式叙事。
- 可用来源：Reddit 反方、工程事故、安全 checklist。

### 加更 EvoSkill

- 必须有：安装/运行记录、输入输出、失败样本、是否值得接入。
- 避免：只复述论文指标。
- 可用来源：EvoSkill GitHub、论文、实测日志。

## 待补事实

- 小红书和抖音最新发布规格：以当日创作后台为准。
- OpenClaw cron/调度能力的真实配置方式。
- EvoSkill 当前安装方式、支持的 agent runtime、benchmark 数据。
- 任何涉及 2026 年模型版本和公司路线的说法。
