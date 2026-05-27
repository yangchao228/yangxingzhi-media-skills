# 从 Prompt 到 Harness：AI 时代工程师的新能力模型

## 发布定位

- 素材来源：用户提供微信公众号正文《从Prompt、Context到Harness，工程的三次进化与终局之战》
- 参考同步来源：OpenAI / Anthropic / arXiv / NeurIPS 一手来源
- 目标平台：微信公众号 / 知乎 / 小红书
- 账号：AI生命克劳德
- 类型：Human3.0 方法论 / AI 编程 / 工程师能力模型
- 核心判断：AI 时代工程师的新能力模型可以拆成三层：Prompt 负责把任务定义清楚，Context 负责把项目事实组织清楚，Harness 负责把 AI 执行过程约束、验证、反馈和沉淀下来。
- 长期主线：Human3.0 / 认知主权 / 结构杠杆 / 从消费者到生产者 / 数字生产资料沉淀

## 采证结论

- 是否足够支撑写作：足够。
- 主要原因：OpenAI 官方 Harness Engineering 文章可支撑“0 手写代码、百万行级别、AGENTS.md 索引化、仓库作为事实源、Human steer/Agents execute”的主干事实；Anthropic 官方文章可支撑“Planner / Generator / Evaluator 三 Agent 架构、外部评估、Playwright 验证、复杂任务中 Harness 成本更高但质量更好”的案例；RAG、CoT、Lost in the Middle 有论文来源支撑。

## 来源清单

1. OpenAI《Harness engineering: leveraging Codex in an agent-first world》：https://openai.com/index/harness-engineering/  
   可用价值：支撑“百万行级别、0 手写代码、约 1500 PR、小团队驱动 Codex、AGENTS.md 做索引、仓库作为事实源、反馈闭环”的核心事实。
2. Anthropic《Harness design for long-running application development》：https://www.anthropic.com/engineering/harness-design-long-running-apps  
   可用价值：支撑“长任务 Agent 需要 Planner / Generator / Evaluator、外部评估、Playwright 交互验证、复杂任务 Harness 成本显著增加”的关键案例。
3. Liu et al.《Lost in the Middle: How Language Models Use Long Contexts》：https://arxiv.org/abs/2307.03172  
   可用价值：支撑“长上下文中相关信息位置会影响模型表现，中间位置更容易被忽略”的上下文治理问题。
4. Lewis et al.《Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks》：https://papers.nips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html  
   可用价值：支撑 RAG 的基本思想：结合参数化模型与外部非参数化记忆 / 检索索引。
5. Wei et al.《Chain-of-Thought Prompting Elicits Reasoning in Large Language Models》：https://arxiv.org/abs/2201.11903  
   可用价值：支撑 CoT 在复杂推理任务中的提示词价值。
6. OpenAI Help《Prompt engineering best practices for ChatGPT》：https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt  
   可用价值：支撑 Prompt Engineering 的基础定义和“清晰、具体、迭代优化”的实践建议。

## 关键事实

- OpenAI 官方文章称，一个内部产品从空仓开始，五个月后达到百万行级别代码，约 1500 个 PR，由三名工程师起步，后来扩展到七名工程师，代码、测试、CI、文档、可观测性和内部工具都由 Codex 编写。
- OpenAI 的核心经验重点不在“提示词更强”，而在工程团队把主要工作转向设计环境、表达意图、构建反馈闭环，让 Codex agents 能可靠工作。
- OpenAI 早期尝试把大量规则塞进一个巨大的 `AGENTS.md`，后来改成短索引：`AGENTS.md` 只做目录，深层规范进入结构化 `docs/`，仓库成为系统事实源。
- Anthropic 的长任务 Harness 采用 Planner、Generator、Evaluator 三类 Agent。Planner 把短需求扩展为规格，Generator 分 sprint 执行，Evaluator 用 Playwright 交互验证 UI、API 和数据库状态。
- Anthropic 对比实验中，单 Agent 用约 20 分钟、约 9 美元；完整 Harness 用约 6 小时、约 200 美元。成本和耗时明显上升，但输出质量有显著差异。
- Lost in the Middle 论文指出，模型虽然能处理长上下文，但相关信息的位置会影响表现，开头和结尾通常更容易被利用，中间信息更容易被忽略。
- RAG 的基础思想是让模型结合参数化知识和外部检索记忆，适合解决“模型不知道最新或私有知识”的问题。
- CoT 论文说明，用中间推理步骤做提示，在算术、常识和符号推理等任务中能改善大模型表现。

## 反向数据 / 限制条件

- OpenAI 百万行实验是 OpenAI 内部产品和内部工程环境，不应直接外推成“所有团队都能 3-7 人复制百万行生产代码”。它依赖模型、工具链、代码仓结构、验证系统和团队工程能力。
- “0 手写代码”不等于“0 人类判断”。人仍在做任务优先级、需求翻译、验收标准、风险判断和结果审查。
- Anthropic 三 Agent Harness 的质量提升伴随明显成本上升。复杂 Harness 不适合所有任务，简单 bugfix、短脚本、低风险内部工具未必需要多 Agent 编排。
- Harness 会随模型能力变化而衰减。模型变强后，部分人工规则、上下文重置和检查流程可能变成冗余负担。
- Prompt、Context、Harness 不应被当成职业标签或固定技术栈。真正可迁移的是背后的能力：表达意图、组织事实、设计约束、验证结果。

## 立骨

### 一句话主旨

AI 时代的合格研发工程师，要从“亲手执行者”升级为“能让 AI 稳定执行的系统设计者”。

### 结构

1. 开场：OpenAI 百万行代码实验带来的不安。
2. 判断：工程师的标准变了，价值向上迁移。
3. 第一层能力：Prompt，能把意图说清楚。
4. 第二层能力：Context，能让 AI 知道该知道什么。
5. 第三层能力：Harness，能让 AI 在约束和验证中可靠工作。
6. 合格研发工程师的新能力模型：定义问题、组织上下文、设计验证、保留判断权、沉淀资产。
7. 给工程师的实践路线：从个人项目开始搭最小 Harness。
8. Human3.0 收束：AI 放大的，是你已经沉淀出来的系统能力。

## 标题备选

1. 从 Prompt 到 Harness：AI 时代工程师的新能力模型
2. AI 时代，合格研发工程师的标准变了
3. 别再只学 Prompt 了，真正的工程师开始搭 Harness
4. OpenAI 百万行代码实验后，程序员该补哪门课？
5. AI 会写代码后，研发工程师还剩什么价值？
6. 未来的程序员，要让 AI 写得更稳
7. Human3.0：工程师要从执行者升级为系统设计者
8. 合格研发工程师的新标准：说清楚、给对信息、验得住

## 推荐标题

从 Prompt 到 Harness：AI 时代工程师的新能力模型

## 摘要

Prompt 解决任务定义，Context 解决事实供给，Harness 解决可靠执行。AI 时代的工程师，需要把“会用 AI”升级成“会设计 AI 工程系统”。

## 公众号正文

OpenAI 最近公开了一篇 Harness Engineering 的文章，里面有一个很刺眼的案例：

一个内部产品从空仓库开始，五个月后长到百万行级别代码，约 1500 个 PR。团队一开始 3 名工程师，后来扩展到 7 名。产品代码、测试、CI、文档、可观测性和内部工具，都由 Codex 编写。

这件事最容易被读成一句话：AI 已经会写大量代码了。

但重点不在这里。

重点是：那几个工程师到底在做什么？

如果 AI 负责执行，工程师的价值就会迁移到三个更上游的问题：

第一，任务怎么定义，AI 才不会理解偏？

第二，项目事实怎么组织，AI 才不会瞎猜？

第三，执行过程怎么约束和验证，AI 才不会自我宣布完成？

这三个问题，对应三层能力：

Prompt Engineering：把任务说清楚。

Context Engineering：把事实给准确。

Harness Engineering：把执行管起来。

这篇文章不讨论“程序员会不会被替代”。这个问题太粗了，也很容易制造焦虑。

我更关心一个具体问题：AI 时代，一个合格研发工程师到底应该练什么？

我的答案是：从 Prompt 到 Harness，建立自己的 AI 工程能力模型。

### 01 Prompt：把需求变成可执行规格

Prompt Engineering 的本质，不在背提示词模板。

它是把模糊意图翻译成可执行规格的能力。

很多工程师用 AI 写代码，第一句就是：

```text
帮我实现登录功能。
```

这句话对人类同事都不够，对 AI 更不够。

一个合格的工程 Prompt，至少要包含 7 个要素：

| 要素 | 要回答的问题 | 示例 |
| --- | --- | --- |
| 目标 | 要解决什么问题 | 新增手机号验证码登录 |
| 范围 | 只改哪里 | 只改 `auth` 模块，不碰订单链路 |
| 输入 | 已知材料是什么 | 接口文档、现有登录代码、错误码规范 |
| 输出 | 交付什么 | 最小 diff、单测、接口说明 |
| 约束 | 不能做什么 | 不改数据库结构，不改变旧登录返回字段 |
| 验收 | 怎么算完成 | 单测通过，旧登录接口行为不变 |
| 风险 | 哪些点要先提醒 | 短信限流、验证码重放、兼容老客户端 |

所以更好的任务描述应该长这样：

```text
请在现有 auth 模块里新增手机号验证码登录。

范围：
- 只允许修改 auth 相关 controller/service/test。
- 不要修改用户表结构。
- 不要改变旧账号密码登录接口的返回字段。

要求：
- 先阅读现有登录实现和错误码规范。
- 先列出实现计划和风险点，等我确认后再改代码。
- 实现后补单元测试，至少覆盖验证码错误、验证码过期、手机号不存在、登录成功四种情况。

验收：
- 现有 auth 测试必须通过。
- 新增测试必须通过。
- 输出最终改动摘要和验证命令。
```

这已经超出了“会写 Prompt”的范畴。

这是需求定义、边界管理、验收设计的基本功。

Prompt 层的工程师能力，可以用一句话判断：

你能不能把一句“帮我做个功能”，拆成 AI 可以执行、同事可以 Review、测试可以验证的任务规格。

如果做不到，AI 输出再快，也只是更快地产生不确定性。

### 02 Context：把项目事实变成 AI 可读取的系统

Prompt 解决“怎么说”。

Context 解决“AI 应该知道什么”。

真实工程里，很多错误不是 AI 没听懂，而是它根本不知道关键信息。

它不知道历史上为什么不能改某个字段。

它不知道某个接口被三个老客户端依赖。

它不知道数据库里有脏数据。

它不知道这个项目的异常码、日志格式、灰度流程。

它不知道你们团队刚刚在会议里否掉了一个方案。

这就是 Context Engineering 的问题。

你给 AI 的上下文，不应该是一堆材料，而应该是一套事实供给系统。

一个工程项目里，至少应该有 5 类 AI 可读取的事实源：

| 事实源 | 作用 | 推荐位置 |
| --- | --- | --- |
| 项目入口 | 告诉 AI 怎么理解仓库 | `README.md` / `AGENTS.md` |
| 架构决策 | 告诉 AI 为什么这样设计 | `docs/adr/` |
| 业务规则 | 告诉 AI 哪些行为不能破坏 | `docs/business/` |
| 验证方式 | 告诉 AI 怎么证明完成 | `docs/testing.md` / CI 配置 |
| 常见坑 | 告诉 AI 哪些错误别再犯 | `docs/runbook.md` / `todo.md` review |

OpenAI 的实践里有一个很有价值的细节。

他们一开始把大量规则都写进一个巨大的 `AGENTS.md`。这看起来很勤奋，效果却不好。后来他们把 `AGENTS.md` 压缩成索引，把真正的规范、产品规格、执行计划、数据库 schema、技术债记录放到结构化文档里，需要什么再加载什么。

这背后的原则很简单：

上下文的价值不取决于数量，取决于准确度。

这也是很多人用 AI 写代码效果差的原因。

他们把整个仓库丢给 AI，让它自己理解。或者把几十段聊天记录贴进去，让它自己找重点。结果上下文窗口被填满，真正重要的信息反而被淹没。

更糟糕的是，长上下文还会出现“中间遗忘”。相关研究已经指出，模型对上下文不同位置的信息利用能力并不均匀，开头和结尾往往更容易被关注，中间的大段内容更容易被忽略。

所以，AI 时代工程师要训练的能力，是组织更可信的信息。

你可以用一个很实用的标准检查自己的项目：

如果一个新人入职，能不能靠仓库文档在一天内跑起项目？

如果一个 AI Agent 接手任务，能不能靠仓库文档知道哪些目录该看、哪些命令该跑、哪些行为不能改？

如果答案是否定的，问题通常不在 AI。

问题在你的项目事实源还没有工程化。

### 03 Prompt 和 Context 的共同盲区：AI 会自信地跑偏

有了好 Prompt 和好 Context，AI 输出会明显变好。

但复杂工程任务里，它们仍然不够。

想象一个很常见的场景。

你让 AI 改一个登录问题。

你给了它清晰任务，也给了它相关代码和文档。它开始执行，半小时后告诉你：

功能已完成。

测试应该可以通过。

顺手优化了一些重复代码。

为了更优雅，调整了一下数据库访问层。

这几句话，每一句都危险。

“已完成”可能只是它自我判断完成。

“应该可以通过”说明它根本没跑测试。

“顺手优化”可能意味着它改了不该改的边界。

“更优雅”可能意味着它引入了新的风险。

这类问题的根源，不在“说得不够清楚”，也不在“信息给得不够多”。

根源在执行系统缺少约束、验证和反馈。

这就是 Harness 要解决的问题。

### 04 Harness：把 AI 执行变成可控工程流程

Harness 这个词，原意是马具。

放在 AI 工程里，它指的是模型之外的整套支撑系统：规则、工具、权限、测试、评估、日志、反馈、任务拆解、人工确认节点。

如果说 Prompt 是任务说明，Context 是事实来源，那么 Harness 就是执行环境。

一个最小可用 Harness，至少要覆盖 6 个环节：

| 环节 | 要解决的问题 | 最小做法 |
| --- | --- | --- |
| Plan | AI 是否理解任务 | 开工前必须列计划和风险 |
| Scope | AI 是否乱改范围 | 明确允许/禁止修改的文件 |
| Tools | AI 是否会用工具验证 | 给出测试、lint、build、浏览器检查命令 |
| Gate | 高风险点是否有人判断 | DB、接口、权限、生产配置改动必须暂停 |
| Evidence | 完成是否有证据 | 输出验证命令、日志、截图、测试结果 |
| Review | 经验是否沉淀 | 把跑偏原因补进文档或规则 |

这套东西不玄。

你今天就可以在项目里加一份最小规则：

```md
## AI coding rules

1. 改动前先列计划，不允许直接改代码。
2. 只修改任务相关文件，发现范围扩大必须暂停。
3. 涉及数据库、鉴权、支付、生产配置，必须先请人确认。
4. 完成后必须运行指定测试命令。
5. 测试没跑就不能写“已完成”。
6. 最终输出必须包含：改了什么、为什么改、怎么验证、剩余风险。
```

这就是最小 Harness。

OpenAI 那个百万行级别代码案例，关键不在“提示词写得特别神”。

他们真正做的是把 Agent 放进一套工程系统里：仓库是事实源，文档是索引，工具负责反馈，测试负责验收，人类负责掌舵。

Anthropic 的长任务实验也说明了同一件事。

单 Agent 做复杂应用，容易中途迷失、自评过高、功能半成品就宣布完成。引入 Planner、Generator、Evaluator 之后，Planner 拆规格，Generator 分阶段执行，Evaluator 独立验证，质量明显上升。

代价也很真实：时间和成本都上去了。

所以 Harness 的重点不在复杂度。

它的重点是匹配任务风险。

小任务用薄 Harness：计划、范围、测试。

中任务用中 Harness：文档索引、自动测试、人工确认点。

大任务用厚 Harness：多 Agent 分工、独立评估、可观测性、持续清债。

这才是工程判断。

### 05 三层能力是嵌套关系

很多人会把这三层理解成阶段替代：

先学 Prompt，后来学 Context，最终学 Harness。

这个理解不准确。

它们更像三层嵌套。

| 层级 | 核心问题 | 工程产物 | 失败信号 |
| --- | --- | --- | --- |
| Prompt | 我该怎么表达任务 | 任务说明、验收标准、输出格式 | AI 理解偏、输出泛 |
| Context | AI 该知道什么事实 | 文档索引、RAG、仓库事实源 | AI 瞎猜、引用过期信息 |
| Harness | AI 如何可靠运转 | 工具链、测试、评估、权限、反馈闭环 | AI 乱改、自评过高、无验证证据 |

没有 Prompt，Context 再好也无法被正确使用。

没有 Context，Harness 只是在错误事实上稳定执行。

没有 Harness，Prompt 和 Context 只能保证单次输出看起来不错，无法保证复杂任务稳定交付。

所以 AI 时代工程师的新能力模型，可以压缩成三句话：

Prompt 层：把任务定义成规格。

Context 层：把项目整理成事实源。

Harness 层：把执行做成闭环。

### 06 能力模型：合格工程师要从“会写”升级到“会管系统”

如果把它落到个人成长上，我会把 AI 时代工程师能力拆成 9 项。

| 能力 | 对应层级 | 具体训练 |
| --- | --- | --- |
| 任务澄清 | Prompt | 把一句需求拆成目标、范围、输入、输出、验收 |
| 边界表达 | Prompt | 明确不能改什么、哪些点必须暂停 |
| 输出设计 | Prompt | 要求 AI 给 diff、测试、风险说明，而不只是代码 |
| 事实整理 | Context | 把项目入口、架构、业务规则放进仓库 |
| 检索意识 | Context | 先搜索定位，再让 AI 精读相关文件 |
| 上下文压缩 | Context | 用索引、摘要、分层文档控制 Token |
| 验证设计 | Harness | 为每类任务配置测试、lint、build、截图、日志 |
| 风险闸门 | Harness | 数据库、权限、接口契约、生产配置必须人工确认 |
| 复盘沉淀 | Harness | 把每次跑偏变成规则、脚本、测试或文档 |

这张表比“会不会用 Cursor / Claude Code / Codex”更重要。

工具会变。

模型会变。

但这 9 项能力迁移性很强。

它们决定你是 AI 工具的消费者，还是 AI 工程系统的设计者。

### 07 一套 7 天训练路线

如果你想把这件事练起来，不需要马上搭复杂平台。

拿一个真实小项目，做 7 天就够你感受到差异。

第 1 天：写一份项目入口文档。

包括项目怎么启动、核心目录、测试命令、关键限制、常见坑。控制在 100 行以内，只做索引。

第 2 天：选一个小需求，写任务规格。

不要直接让 AI 改代码。先写目标、范围、输入、输出、验收、禁止项。

第 3 天：让 AI 先读上下文并复述计划。

要求它列出准备读取哪些文件、为什么读、预期改哪些文件、风险在哪里。计划不合理就打回。

第 4 天：执行代码修改，但限制范围。

只允许它改计划中的文件。发现需要扩大范围，必须停下来说明原因。

第 5 天：建立验证闭环。

让 AI 跑测试、修失败、输出验证证据。测试没跑，不允许进入完成状态。

第 6 天：做一次反向评估。

换一个会话或另一个模型，让它 Review 改动，重点找：范围越界、重复实现、异常遗漏、安全风险、测试不足。

第 7 天：沉淀 Harness。

把这次过程中最有效的规则写进 `AGENTS.md`，把踩坑写进 `docs/runbook.md`，把能自动化的验证命令写成脚本。

这 7 天练完，你会发现自己对 AI 编程的理解会变。

你不再只是“问 AI 要代码”。

你开始设计一套让 AI 工作的环境。

这就是从 Prompt 到 Harness 的变化。

### 08 最后：人的判断权要上移

AI 会继续变强。

今天很多 Harness 规则，未来可能会被模型能力吸收。比如更强的模型会更懂上下文、更会自检、更会规划任务。

但有几类事情不会自动消失：

业务目标谁来定？

风险边界谁来划？

事实源谁来维护？

验收标准谁来定义？

出问题后经验沉淀到哪里？

这些问题都指向人的判断权。

Human3.0 更关心的问题，是人如何组织 AI 的执行力。

它关心的是：人能不能把 AI 的能力变成自己的结构杠杆。

Prompt 是表达杠杆。

Context 是事实杠杆。

Harness 是系统杠杆。

一个合格的 AI 时代工程师，要从会写代码，升级到会定义任务、组织事实、设计闭环。

真正的终局，是工程师从执行者，变成 AI 工程系统的设计者。

## 朋友圈转发文案

写了一篇关于 AI 时代研发工程师的新标准。

OpenAI 的百万行代码实验最值得看的，是人类工程师把工作重心移到了哪里：定义任务、组织上下文、设计约束、建立验证闭环。

我的判断是：未来合格研发工程师的核心能力，会从“亲手写代码”迁移到“让 AI 稳定写好代码的系统能力”。

Prompt 负责任务规格，Context 负责事实供给，Harness 负责可靠执行。

这已经进入一套新的工程能力模型。

## 知乎发布包

### 推荐标题

从 Prompt 到 Harness，AI 时代工程师需要什么新能力？

### 备选标题

1. AI 会写代码以后，研发工程师的核心竞争力是什么？
2. Prompt、Context、Harness 分别是什么？它们如何改变程序员工作方式？
3. 如何从会用 AI，升级为会设计 AI 工程系统？

### 100 字以内摘要

Prompt 解决任务定义，Context 解决事实供给，Harness 解决可靠执行。AI 时代工程师的核心能力，会从“会用 AI 写代码”升级到“会设计 AI 工程系统”。

### 知乎回答开头

先给结论：AI 时代合格研发工程师的标准，会从“能不能写代码”，迁移到“能不能让 AI 在真实工程环境里稳定产出”。

这背后有三个层次：Prompt、Context、Harness。

Prompt 解决“任务怎么定义”；Context 解决“事实怎么供给”；Harness 解决“执行怎么约束、验证和反馈”。只停在第一层的人，最多是 AI 熟练用户；能做到第三层的人，才更接近 AI 时代的工程系统设计者。

### 知乎正文使用建议

- 公众号正文可整体复用，但建议删掉部分公众号式转折。
- 保留 OpenAI 与 Anthropic 两个案例，这是知乎讨论价值最高的部分。
- 文末建议增加讨论问题：你认为未来研发工程师最重要的是代码能力、产品判断、系统设计，还是验证能力？

## 小红书图文方案

### 内容诊断

- 核心主题：从 Prompt 到 Harness 的工程师新能力模型。
- 核心传播角度：会用 AI 写代码只是起点，会设计 AI 工程系统才是分水岭。
- 目标受众：程序员、AI 编程工具用户、技术管理者、正在转型的研发。
- 推荐风格：冷静科技风，偏工程白皮书感，不做焦虑封面。
- 推荐页数：8 页。

### 8 页结构

| 页码 | 页面类型 | 页面标题 | 页面正文 | 推荐元素 |
| --- | --- | --- | --- | --- |
| 01 | 封面 | 从 Prompt 到 Harness | AI 时代工程师的新能力模型。 | 三层能力阶梯 |
| 02 | 冲突页 | OpenAI 案例说明什么？ | 重点在工程师如何设计执行系统。 | PR 流、代码仓 |
| 03 | 概念页 | Prompt：任务规格 | 目标、范围、输入、输出、约束、验收、风险。 | 7 要素任务卡 |
| 04 | 概念页 | Context：事实供给 | README、ADR、业务规则、测试方式、常见坑。 | 文档索引、上下文窗口 |
| 05 | 概念页 | Harness：可靠执行 | Plan、Scope、Tools、Gate、Evidence、Review。 | 测试闭环 |
| 06 | 能力页 | 工程师 9 项能力 | 任务澄清、边界表达、事实整理、验证设计、复盘沉淀。 | 9 项 checklist |
| 07 | 方法页 | 7 天训练路线 | 写入口文档、做任务规格、限制范围、验证闭环、沉淀规则。 | 7 天路线图 |
| 08 | 收束页 | AI 放大系统能力 | Prompt 是表达杠杆，Context 是事实杠杆，Harness 是系统杠杆。 | Human3.0 / 结构杠杆 |

### 小红书标题候选

1. 别只学 Prompt，工程师真正要补的是 Harness
2. 从 Prompt 到 Harness：程序员新能力模型
3. 会用 AI 写代码不够，你要会设计系统

### 小红书发布配文

最近看到 OpenAI 的 Harness Engineering 文章，最值得警惕的是工程师的工作位置变了。

以前我们证明自己：我会写。

现在更重要的是：我能不能让 AI 在真实项目里稳定执行。

我把它拆成三层：

Prompt：把话说清楚。

Context：让 AI 知道正确背景。

Harness：用规则、工具、测试和反馈，让结果可验证。

真正的合格工程师，要把自己的判断、经验和流程沉淀成系统，让 AI 放大它。

这才是 AI 时代更值得练的能力。

### 话题标签

#AI编程 #程序员 #研发工程师 #Prompt工程 #Agent #AI工作流 #个人成长 #Human3

### 评论区引导

你觉得 AI 时代研发工程师最该补哪项能力：Prompt、Context，还是 Harness？

## 诊文结论

- 建议动作：重构后进入发布资产制作。
- 主要原因：已按用户反馈把正文从观点判断文重构为“Prompt -> Context -> Harness”能力模型文，补入任务规格、事实源、最小 Harness、9 项能力和 7 天训练路线，干货密度明显高于上一版。

## 核心问题

1. 正文信息量较大，发布前可考虑把“7 天训练路线”做成配图，增强收藏感。
2. OpenAI 与 Anthropic 案例都来自头部实验环境，正文已保留适用边界，发布时不宜再强化“百万行”标题党表达。
3. 文章更适合做方法论沉淀文，传播爆点弱于焦虑型标题，但更贴合 AI生命克劳德 和 Human3.0 长期方向。

## 最小修改建议

1. 发布前建议确认标题是否直接采用“从 Prompt 到 Harness：AI 时代工程师的新能力模型”。
2. 建议把“7 要素 Prompt / 5 类事实源 / 6 环节 Harness / 9 项能力 / 7 天路线”拆成小红书卡片。
3. 小红书建议不要直接发长文，优先做 8 页图文卡。

## 发布结论

- 建议：补齐封面 / 小红书卡片后发布。
- 阻塞项：缺封面图、小红书卡片成图、Human3.0 成书审查确认。

## 公众号发布包

- 标题：从 Prompt 到 Harness：AI 时代工程师的新能力模型
- 摘要：Prompt 解决任务定义，Context 解决事实供给，Harness 解决可靠执行。AI 时代的工程师，需要把“会用 AI”升级成“会设计 AI 工程系统”。
- 封面文案：从 Prompt 到 Harness / 工程师新能力模型
- 标签：AI编程、研发工程师、Prompt工程、Agent、AI工作流、Human3
- 评论区引导：你现在用 AI 写代码时，最缺的是提示词、上下文，还是验证闭环？

## 归档建议

- 是否建议进入 Human3.0 成书审查：建议。
- 建议素材类型：方法论条目 / 工程师能力模型 / 结构杠杆案例。
- 建议归属：Part 3｜结构杠杆。
- 原因：这篇从 AI 编程热点进入“人在 AI 时代如何保留判断权，并把 AI 执行力转成个人/团队系统资产”的长期问题。

## content_state

```yaml
content_state:
  project:
    name: "文昌.skill"
    account: "AI生命克劳德"
    long_term_goal: "Human3.0"
  request:
    raw_intent: "围绕主题“探讨AI时代如何成为一名合格的研发工程师”，从微信公众号素材开始走文昌内容流程，目标平台为公众号、知乎、小红书。"
    current_stage: "出刊"
    target_platforms:
      - "公众号"
      - "知乎"
      - "小红书"
  audience:
    primary: "研发工程师、AI 编程工具用户、技术管理者、希望在 AI 时代升级能力模型的知识工作者"
    pain_points:
      - "担心 AI 会替代写代码能力"
      - "只会用 Prompt，但无法让 AI 稳定完成复杂工程任务"
      - "缺少组织上下文、验证结果和沉淀资产的方法"
  topic:
    source: "用户提供微信公众号正文 + OpenAI / Anthropic / 论文一手来源"
    core_angle: "从 Prompt 到 Harness，构建 AI 时代工程师的新能力模型"
    title_candidates:
      - "从 Prompt 到 Harness：AI 时代工程师的新能力模型"
      - "AI 时代，合格研发工程师的标准变了"
      - "别再只学 Prompt 了，真正的工程师开始搭 Harness"
    selected_title: "从 Prompt 到 Harness：AI 时代工程师的新能力模型"
    why_now: "OpenAI 与 Anthropic 在 2026 年集中发布 Agentic Coding / Harness 实践，工程师角色迁移进入可讨论阶段。"
    long_term_value: "可沉淀为 Human3.0 的工程师能力模型：人掌舵，AI 执行，系统负责约束和验证。"
  research:
    confidence: "High"
    sources:
      - "OpenAI Harness Engineering"
      - "Anthropic Harness design for long-running application development"
      - "Lost in the Middle"
      - "RAG NeurIPS 2020"
      - "Chain-of-Thought Prompting"
    contrarian_points:
      - "OpenAI 案例不能直接外推到所有团队。"
      - "复杂 Harness 有显著成本，不适合所有任务。"
      - "Harness 会随模型能力变化而衰减，需要动态调整。"
  draft:
    status: "完成初稿"
    file: "content/outputs/2026-05-22-ai-era-qualified-engineer-wechat-zhihu-xhs.md"
    summary: "已按用户反馈重构公众号正文，并同步更新知乎发布包、小红书图文方案和发布资产。"
  diagnosis:
    recommendation: "重构后进入发布资产制作"
    key_issues:
      - "需要把能力模型拆成封面/卡片资产。"
      - "需要补封面和小红书卡片成图。"
    minimum_fixes:
      - "发布前确认封面标题。"
      - "确认是否进入 Human3.0 成书审查。"
  publish_assets:
    title: "从 Prompt 到 Harness：AI 时代工程师的新能力模型"
    summary: "Prompt 解决任务定义，Context 解决事实供给，Harness 解决可靠执行。AI 时代的工程师，需要把“会用 AI”升级成“会设计 AI 工程系统”。"
    cover_text: "从 Prompt 到 Harness / 工程师新能力模型"
    tags:
      - "AI编程"
      - "研发工程师"
      - "Prompt工程"
      - "Agent"
      - "AI工作流"
      - "Human3"
    images: []
    share_copy: "写了一篇关于 Prompt、Context、Harness 的文章。核心判断：AI 时代工程师要把会用 AI，升级成会设计 AI 工程系统。"
    comment_prompt: "你现在用 AI 写代码时，最缺的是提示词、上下文，还是验证闭环？"
  distribution:
    primary_platform: "公众号"
    secondary_platforms:
      - "知乎"
      - "小红书"
    card_skill: "xiaohongshu-viral-image-skill-v4"
    image_skill: "imagegen 或本地 SVG/HTML 卡片"
  archive:
    should_review_for_book: true
    material_type: "方法论条目 / 工程师能力模型 / 结构杠杆案例"
    suggested_bucket: "Part 3｜结构杠杆"
  next_step:
    skill: "xiaohongshu-viral-image-skill-v4 / human3-book-guardian"
    reason: "出刊检查发现配图、卡片和成书审查是人工判断节点"
    user_decision_needed: true
  handoff:
    from_stage: "出刊"
    to_stage: "配图/卡片/归档"
    accepted_inputs:
      - "最终公众号正文"
      - "小红书 8 页结构"
      - "发布资产"
      - "归档建议"
    ignored_context:
      - "未验证通过的微信原链读取结果"
      - "已淘汰的泛职业焦虑切口"
    stop_condition: "需要用户确认是否生成封面/小红书卡片，以及是否进入 Human3.0 成书审查"
```
