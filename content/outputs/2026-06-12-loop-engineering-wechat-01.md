# 《Claude Code 之父说他不再写提示词了》公众号出刊包

日期：2026-06-12
阶段：文昌总控 / 起稿
系列：《别只会写 Prompt》第一篇

## 推荐标题

《Claude Code 之父说他不再写提示词了》

## 标题候选

1. 《Claude Code 之父说他不再写提示词了》
2. 《提示词工程没死，但它正在被降级》
3. 《AI 编程的下一步，是可运行的 Agent Loop》
4. 《会用 Agent 的人，已经开始设计 Loop》
5. 《别只会写 Prompt，开始设计 Loop》
6. 《Agent 时代，真正稀缺的是循环设计能力》
7. 《Claude Code 火了以后，编程工作正在变成另一种东西》
8. 《从提示词到 Loop：AI 编程的第二次范式转移》

## 公众号摘要

AI 编程的变化不只发生在模型能力上，也发生在人的工作位置上。过去我们写 prompt，让 Agent 执行，再人工检查；现在更关键的是设计一个可验证、可停止、可复用的循环系统。

## 封面文案

主标题：别只会写 Prompt

副标题：AI Agent 的下一步，是 Loop

## 正文

### Claude Code 之父说他不再像以前那样写提示词了

Boris Cherny 最近频繁出现在 AI 编程讨论里。

他是 Claude Code 的核心创造者之一。Business Insider 在 2026 年 5 月报道过他的一个工作场景：他会同时开着 5 到 10 个 Claude Code 会话，每个会话里又有多个 Agent，晚上还有更多 Agent 跑更深的任务。

这不是普通意义上的“我让 AI 帮我写段代码”。

更像是一个人坐在控制台前，开了一组持续运行的任务系统：有的看代码，有的修问题，有的等 CI，有的处理 PR，有的在更长时间里做重构和优化。

这也是为什么“提示词工程要死了”这句话会被反复讨论。

严格讲，提示词没有消失。Agent 仍然需要指令，仍然需要上下文，仍然需要人告诉它目标和约束。

变化发生在工作重心上。

过去的典型流程是：

```text
人写提示词 -> Agent 执行 -> 人检查结果
```

现在更值得关注的流程是：

```text
人设计循环系统 -> Agent 持续执行 -> 系统反馈 -> 判断继续、停止、修正或交还给人
```

这就是 Loop Engineering。

它不是把一句 prompt 写得更长，也不是让 Agent 无限自跑。它关心的是：一个任务能不能被拆成可重复运行的循环，每一轮有没有反馈，什么时候该停，出了风险该交给谁。

### Prompt 解决的是“这一轮怎么说”

很多人第一次用 AI 编程，都会经历一个阶段：疯狂打磨提示词。

比如：

```text
请你扮演资深全栈工程师，基于最佳实践，帮我实现一个高质量、可维护、可扩展的登录系统。
```

这类提示词听起来很完整，实际问题很多。

“高质量”怎么验收？

“可维护”看什么证据？

“最佳实践”是哪套实践？

如果 Agent 改了 12 个文件、跑不通测试、顺手改了生产配置，人应该怎么判断？

提示词能解决表达问题，却很难独自解决工程问题。

工程任务需要反馈。

代码能不能跑，测试有没有过，类型检查有没有报错，CI 是否变绿，diff 是否越界，日志是否证明问题已经修复。这些东西不是一句漂亮 prompt 能替代的。

Claude Code 官方文档里对 agentic loop 的描述很直接：Claude 接到任务后，会收集上下文、采取行动、验证结果，并根据工具反馈继续调整。一个 bug fix 任务可能会反复经历读日志、查文件、改代码、跑测试、再修正。

这个过程里，真正起作用的不只是语言模型，还有工具、上下文、测试、权限、日志和人的干预。

换成一句更直接的话：

Prompt 是入口，Loop 才是工作单元。

### Loop 解决的是“下一轮凭什么继续”

一个好 Loop 至少要回答四个问题。

第一，目标是什么。

不要让 Agent “随便优化一下”。你要告诉它，这一轮到底要达成什么。

例如：

```text
检查 PR #123 的 CI 状态。如果失败，只处理失败 job 直接相关的问题；如果通过，输出一句状态总结。
```

第二，反馈来自哪里。

反馈不能只来自 Agent 自己的解释。

编程任务里，反馈可以是测试、lint、build、CI、日志、diff。

内容任务里，反馈可以是来源等级、反向证据、读者获得感、平台适配、AI 腔检查。

项目管理任务里，反馈可以是状态变化、阻塞项、待确认事项、负责人回复。

第三，什么时候停止。

停止规则比启动规则更重要。

一个没有停止条件的 Agent，很容易在错误方向上越跑越远。

常见停止条件包括：

- 测试通过。
- 目标已经完成。
- 连续两轮失败原因相同。
- 需要权限或外部信息。
- diff 超过约定范围。
- 涉及生产数据、密钥、支付、删除等高风险动作。

第四，什么时候拒绝。

拒绝机制不是给 Agent 添麻烦，它是防止错误放大的闸门。

比如：

```text
禁止修改生产配置。
禁止删除数据库。
禁止自动 push。
禁止在没有测试结果时宣称修复完成。
遇到不确定事实必须标注缺口。
```

这四件事合起来，才让 Loop 从“自动化小把戏”变成工程系统。

### Claude Code 的 `/loop` 把这个变化推到台前

Claude Code 官方文档已经把循环任务放到了产品能力里。

官方命令是 `/loop`。

它可以在会话里重复运行一个 prompt。你可以写固定间隔：

```text
/loop 5m check if the deployment finished and tell me what happened
```

也可以不写间隔，让 Claude 根据每一轮观察到的情况自己决定下一次等待多久。

官方文档里还有几个关键限制：

- `/loop` 适合会话内快速轮询。
- `/loop` 和 Desktop tasks 的最小间隔是 1 分钟，Cloud tasks 是 1 小时。
- session scoped recurring tasks 会在 7 天后自动过期。
- 如果要脱离会话长期运行，要看 Routines、Desktop scheduled tasks 或 GitHub Actions。

这几个限制很重要。

它说明官方也没有把 loop 设计成“放出去就不管”的全自动机器。

它更像一个带边界的工作台：你可以让 Agent 周期性检查部署、跟进 PR、处理 review comments、清理分支上的小问题，但它仍然需要上下文、权限和停止条件。

Business Insider 报道 Boris Cherny 的工作方式时提到，他依赖 Claude Code 里支持持续自动化的能力，包括循环任务和 Routines。这个信息本身已经足够说明问题：最前沿的 AI 编程实践，正在从单次对话转向持续调度。

### Codex 也在走向自动化

这不是 Claude Code 一家的方向。

OpenAI 的 Codex Automations 文档也写得很明确：Codex 可以根据 schedule 和 trigger 自动运行 recurring tasks。

它适合做什么？

比如：

- 每周五写一份工作回顾。
- 每天早上根据前一天的工作生成 brief。
- 总结新加入某个文件夹的文件。
- 检查缺失或不一致的信息。
- 生成周期性的项目状态更新。

OpenAI 文档里还有一个很关键的点：有些 automation 可以回到同一个 conversation，接着已有上下文继续工作。

这和传统 cron job 不一样。

传统 cron job 更像“到点运行脚本”。脚本没有真正理解上一次对话，也不会自然接住一个正在推进的任务。

Agent loop 的价值在于：它可以带着上下文、目标和反馈继续下一轮。

当然，代价也随之出现。

上下文越长，越容易压缩失真。

运行越频繁，token 成本越高。

权限越大，事故半径越大。

所以 Loop Engineering 的重点，是把自动化放进可控结构里。

### 真正的新能力，是设计循环

未来一段时间，很多人会继续追问：到底该学 prompt，还是学 Agent？

这个问题本身有点窄。

更准确的问题应该是：你能不能把一个目标，设计成一个可运行的循环？

比如你想让 Agent 帮你修 CI。

低级用法是：

```text
帮我修一下 CI。
```

更好的用法是：

```text
读取当前 PR 的失败 CI 日志。
只定位和失败 job 直接相关的问题。
提出一个最小修复计划。
修改前先列出会动哪些文件。
修改后运行对应测试。
如果连续两轮失败原因相同，停止并把原因交还给我。
禁止修改生产配置和无关文件。
```

这已经不是单纯的 prompt。

这里面有目标、边界、反馈、停止、拒绝。

再进一步，你可以把它拆成三个角色：

- 规划器：读日志，拆任务，定验收标准。
- 生成器：按计划生成最小 patch。
- 评估器：跑测试，看 diff，根据证据判断是否通过。

最后，你还需要一个 Harness，把上下文、工具、权限、日志、预算和回滚接起来。

这才是 Loop Engineer 要做的事。

### 普通人应该怎么开始

不要一上来就追求“每天自动跑 100 个 Agent”。

这类玩法容易让人兴奋，也容易烧钱、烧注意力、烧项目。

更务实的起点是低频、高价值、可验证。

先选一个任务：

- CI 失败检查。
- PR review 跟进。
- 部署状态监控。
- 资料采证。
- 周报整理。
- 知识库巡检。

然后只写一个最小 loop：

```text
目标：这轮要完成什么。
反馈：用什么判断完成。
停止：什么时候结束。
拒绝：哪些动作不允许。
记录：每一轮留下什么日志。
```

这比写一段华丽 prompt 更有价值。

因为它会留下资产。

一次 prompt 用完就散了。

一个 loop 模板可以复用、迁移、改进，最后沉淀成你的个人工作流。

这也是我更关心的方向。

AI 工具的变化会很快，今天是 Claude Code，明天是 Codex，后天可能是新的 Agent 平台。

但目标、反馈、停止、拒绝、评估器、Harness 这些东西不会轻易过时。

它们是一套把 AI 放进个人系统的方法。

### 结尾

提示词还会存在。

但只会写提示词的人，很容易被工具更新牵着走。

更值得训练的是另一种能力：把任务设计成可验证、可停止、可复用的循环系统。

下一篇，我会拆开讲一个好 Loop 的四个部件：

目标、反馈、停止、拒绝。

如果你也想要我后面整理的 Loop 模板，可以在评论区留一个“Loop”。

## 结尾互动引导

你现在最想 Loop 化的任务是什么？

- 修 CI？
- 写周报？
- 盯 PR？
- 做资料采证？
- 维护知识库？

可以留言一个具体场景，我后面会优先拿真实场景做模板。

## 配图建议

1. 封面图：深色科技感背景，主文案“别只会写 Prompt”，副文案“AI Agent 的下一步，是 Loop”。
2. 正文图 1：Prompt -> Task -> Loop -> Harness -> Workflow 层级图。
3. 正文图 2：好 Loop 四要素：目标、反馈、停止、拒绝。
4. 正文图 3：Planner / Generator / Evaluator / Harness 协作图。

## 朋友圈转发文案

AI 编程的变化，不只是模型更会写代码了。

更大的变化是：人的工作开始从“写提示词”，转向“设计可验证、可停止、可复用的循环系统”。

我把这个方向叫 Loop Engineering。先写第一篇，后面会继续拆目标、反馈、停止规则、评估器和 Harness。

## 资料来源与事实边界

- Claude Code scheduled tasks 官方文档：`/loop`、最小间隔、7 天过期、Routines / Desktop / Cloud tasks 对比。
- Claude Code how it works 官方文档：agentic loop 包含 gather context、take action、verify results。
- OpenAI Codex Automations 官方文档：Codex 可按 schedule / trigger 运行 recurring tasks，部分 automation 可回到同一 conversation。
- Business Insider 2026-05-13 报道：Boris Cherny 描述自己同时运行多个 Claude Code sessions，并在夜间运行更多 AI agents。
- WIRED 2026-05-26 报道：Claude Code、OpenClaw、Peter Steinberger 和 AI agent 热潮。

边界：

- “Boris 原话：我不再提示 Claude 了，我有一堆 loops 在运行”这类社媒转述，本轮没有拿到稳定一手链接，因此正文没有把它当作关键证据。
- 媒体报道中出现 `/loops` 写法，Claude Code 官方文档中的命令写法是 `/loop`。

## content_state

```yaml
content_state:
  request:
    raw_intent: "写第 1 篇 Loop Engineering 公众号正文"
    current_stage: "起稿"
    target_platforms: ["微信公众号"]
  draft:
    title: "Claude Code 之父说他不再写提示词了"
    file: "content/outputs/2026-06-12-loop-engineering-wechat-01.md"
    series: "别只会写 Prompt"
    article_index: 1
    status: "draft"
  research:
    confidence: "Medium-High"
    official_sources:
      - "Claude Code scheduled tasks"
      - "Claude Code how it works"
      - "OpenAI Codex Automations"
    media_sources:
      - "Business Insider Boris Cherny AI agent setup"
      - "WIRED AI Agents / Claude Code / OpenClaw"
    limitations:
      - "未将未核验社媒原话作为关键证据"
  next_step:
    skill: "wenchang-review"
    reason: "正文已起稿，下一步应做诊文和发布前检查"
    user_decision_needed: false
  handoff:
    from_stage: "起稿"
    to_stage: "诊文"
    accepted_inputs:
      - "wechat series plan"
      - "source pack"
      - "official fact checks"
      - "draft"
    ignored_context:
      - "未核验社媒浏览量"
      - "未拿到一手链接的原话"
    stop_condition: "完成诊文后等待是否整章编辑或出刊"
```
