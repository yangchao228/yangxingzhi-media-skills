# Loop Engineering 公众号预热拆分方案

日期：2026-06-12
阶段：文昌总控 / 立骨 -> 出刊规划
素材基础：

- `content/outputs/2026-06-12-loop-engineering-practice-source-pack.md`
- `content/outputs/2026-06-12-loop-engineering-book-outline.md`

## 策略判断

先发公众号系列，不直接发完整手册。

原因：

1. 手册太长，公众号用户第一反应会是“收藏但不读”。
2. Loop Engineering 还是新概念，需要先用几篇文章完成读者教育。
3. 公众号适合测试标题、概念、案例和读者痛点。
4. 电子书适合承接系统化需求，把模板、清单、实战流程打包成长期资产。

推荐路径：

```text
公众号系列预热 -> 读者反馈验证 -> 模板/清单沉淀 -> 电子书打包 -> 微信读书上架
```

## 发布目标

### 第一阶段：验证概念

目标：让读者意识到“只会写 prompt 不够了”。

衡量信号：

- 阅读完成率。
- 收藏率。
- 评论里是否出现“怎么做”“有没有模板”“能不能讲实战”。
- 私信是否问 Claude Code / Codex / Cursor / 自动化工作流。

### 第二阶段：验证方法

目标：让读者记住“好 Loop 四要素”和“三角色架构”。

衡量信号：

- 文章被转发到程序员、产品、内容创作者群。
- 读者开始用“规划器 / 生成器 / 评估器 / Harness”复述你的观点。
- 有人询问模板、案例、课程或电子书。

### 第三阶段：验证产品

目标：确认是否值得包装成电子书。

衡量信号：

- 读者愿意领取清单或模板。
- 有明确付费意愿。
- 有人问是否有完整手册、训练营、案例库。

## 系列定位

公众号系列不要叫“手册连载”。

更适合叫：

- 《AI Agent 工作流升级系列》
- 《Loop Engineer 入门系列》
- 《别只会写 Prompt 系列》
- 《Agent 循环系统实战笔记》

推荐栏目名：

《别只会写 Prompt》

原因：

- 普通读者能听懂。
- 能承接提示词工程的流量。
- 后续可以自然引出 Loop、Harness、Workflow、Personal System。

## 推荐拆成 5 篇主线文章

### 第 1 篇：趋势判断文

标题候选：

1. 《Claude Code 之父说他不再写提示词了》
2. 《提示词工程没死，但它正在被降级》
3. 《AI 编程的下一步，是可运行的 Agent Loop》
4. 《会用 Agent 的人，已经开始设计 Loop》

推荐标题：

《Claude Code 之父说他不再写提示词了》

核心问题：

- 为什么从 Prompt Engineering 走向 Loop Engineering？

正文主线：

1. 用 Boris / Peter 的讨论引出热点。
2. 解释 prompt 工作方式的天花板。
3. 引出 loop：目标、反馈、停止、拒绝。
4. 点到 Claude Code `/loop` 和 Codex Automations。
5. 收到人的新角色：从盯执行，转向设计系统。

适合使用的素材：

- Claude Code `/loop` 官方文档。
- Codex Automations。
- WIRED 关于 coding agents 的报道。

文章交付物：

- 一张图：Prompt / Task / Loop / Harness 的层级图。
- 一个自测问题：你现在是在写 prompt，还是在设计 loop？

结尾钩子：

下一篇讲：一个好 Loop 至少要有四个部件。

建议字数：

2200-2800 字。

### 第 2 篇：方法框架文

标题候选：

1. 《好 Loop 的四要素：目标、反馈、停止、拒绝》
2. 《没有反馈的 Agent，只是在反复自我确认》
3. 《别让 Agent 自己跑：一个好 Loop 必须有四道闸》
4. 《Loop Engineering 入门：先学会让 Agent 停下来》

推荐标题：

《没有反馈的 Agent，只是在反复自我确认》

核心问题：

- 一个 loop 最少要具备什么，才配叫工程系统？

正文主线：

1. 先讲一个常见失败场景：Agent 一直改，一直说快好了。
2. 拆出四要素：明确目标、反馈机制、停止规则、拒绝机制。
3. 分别给代码、内容、项目管理三个例子。
4. 强调停止规则和拒绝机制。
5. 给出一份基础 loop 合同。

适合使用的素材：

- Claude Code best practices。
- Claude Code common workflows。
- Replit 删除生产数据库事件作为风险侧证。

文章交付物：

- `basic_loop_contract` 简版。
- 四要素检查表。

结尾钩子：

下一篇讲：真正的 loop 系统里，为什么要拆出规划器、生成器和评估器。

建议字数：

2800-3500 字。

### 第 3 篇：核心架构文

标题候选：

1. 《真正的 Loop 系统里，有规划器、生成器和评估器》
2. 《别让一个 Agent 同时当员工、经理和审计》
3. 《为什么评估器才是 Agent 系统的核心》
4. 《Agent 工作流的关键，常常藏在评估器里》

推荐标题：

《别让一个 Agent 同时当员工、经理和审计》

核心问题：

- 为什么要把 Planner、Generator、Evaluator 分开？

正文主线：

1. 从一个失败的 AI 编程例子切入：Agent 改完又自己确认自己对。
2. 解释三角色：
   - Planner：拆目标、定验收标准。
   - Generator：生成代码、文档、测试、摘要。
   - Evaluator：根据证据判定通过、失败、继续或停止。
3. 讲 Harness：保存上下文、控制权限、记录日志、限制预算。
4. 用 CI 修复或内容采证做完整例子。
5. 强调评估器需要真实测试、日志、diff、反向证据。

适合使用的素材：

- Nubank eval-driven agent。
- SlopCodeBench。
- Claude Code how it works。
- 规划器 / 生成器 / 评估器图片素材。

文章交付物：

- 三角色泳道图。
- `planner_prompt / generator_prompt / evaluator_prompt` 简版。

结尾钩子：

下一篇进入实战：用 Claude Code / Codex / GitHub Actions 搭一个真实 loop。

建议字数：

3200-4200 字。

### 第 4 篇：工具实战文

标题候选：

1. 《用 Claude Code 跑第一个 Loop：从部署检查开始》
2. 《Claude Code /loop 实战：让 Agent 持续盯 CI》
3. 《没有 /loop 也能做：Codex、GitHub Actions 和 cron 的 Agent 循环》
4. 《第一个可运行的 Agent Loop：目标、命令、日志和停止条件》

推荐标题：

《第一个可运行的 Agent Loop：让 AI 持续盯住 CI》

核心问题：

- 读者如何照着搭一个最小可运行 loop？

正文主线：

1. 选一个低风险高价值任务：CI / 部署状态 / PR review。
2. 写清目标和停止条件。
3. 给出 Claude Code `/loop` 写法。
4. 补充 Codex Automations / GitHub Actions / cron 的替代思路。
5. 给出运行日志模板和失败处理规则。

适合使用的素材：

- Claude Code scheduled tasks。
- Claude Code hooks。
- Codex Automations。
- GitHub Actions / cron 作为补齐方案。

文章交付物：

- `/loop` 命令模板。
- `loop_run_log` 简版。
- `stop_or_continue` 判断表。

结尾钩子：

下一篇讲安全、成本和事故：Agent 跑得越久，越需要护栏。

建议字数：

3000-4200 字。

### 第 5 篇：风险与资产文

标题候选：

1. 《别让 Agent 裸奔：Loop Engineering 的成本和事故清单》
2. 《Agent 跑得越久，越需要停止规则》
3. 《AI 自动化最危险的地方，是它看起来一直在努力》
4. 《从 Loop 到个人系统：把 Agent 变成长期资产》

推荐标题：

《Agent 跑得越久，越需要停止规则》

核心问题：

- 如何把 loop 从炫技变成长期资产？

正文主线：

1. 讲 token、上下文、权限、注意力成本。
2. 讲 Replit 事故和 SlopCodeBench 的反向证据。
3. 给出安全护栏：权限、生产隔离、checkpoint、rollback、人工审批。
4. 收到长期资产：loop 模板、harness spec、workflow、skill、SOP。
5. 预告电子书：把系列文章扩展成完整手册。

适合使用的素材：

- Replit production database incident。
- SlopCodeBench。
- Engineering Pitfalls in AI Coding Tools。
- AI Workflow Store。

文章交付物：

- `dangerous_actions_policy` 简版。
- `loop_budget_calculator` 简版。
- `workflow_card` 简版。

结尾钩子：

如果这个系列反馈不错，下一步整理为《Loop Engineer 实战手册》电子书。

建议字数：

3000-3800 字。

## 可选加更 3 篇

如果前 5 篇反馈好，可以继续发 3 篇加更，用来积累电子书素材。

### 加更 1：内容创作者版

标题：

《不只是写代码：内容创作者也需要 Loop Engineering》

主线：

- 热点采证。
- 反向证据。
- 诊文。
- 出刊检查。
- 素材归档。

用途：

- 承接非程序员读者。
- 连接文昌工作流。
- 服务 Human3.0 内容生产主线。

### 加更 2：个人系统版

标题：

《把 AI 变成个人系统：周报、知识库和项目巡检怎么 Loop 化》

主线：

- 周报整理。
- 未提交资产扫描。
- 知识库巡检。
- 项目地图更新。
- 记忆更新建议。

用途：

- 把话题从工具拉到个人系统。
- 为电子书后半部分铺垫。

### 加更 3：模板领取文

标题：

《我整理了 12 个 Agent Loop 模板》

主线：

- CI 修复 loop。
- PR review loop。
- 内容采证 loop。
- 周报 loop。
- 知识库 loop。
- 部署检查 loop。

用途：

- 测试电子书购买意愿。
- 引导读者留言、私信、进群或领取资料包。

## 发布时间与顺序建议

### 第一轮：5 篇主线，2-3 周发完

建议节奏：

1. 第 1 篇：周二或周三，趋势判断。
2. 第 2 篇：间隔 3-4 天，方法框架。
3. 第 3 篇：间隔 3-4 天，核心架构。
4. 第 4 篇：间隔 4-5 天，工具实战。
5. 第 5 篇：间隔 4-5 天，风险与资产。

不要日更。这个系列需要读者消化，太密会像课程广告。

### 第二轮：根据反馈加更

如果第 2、3、4 篇收藏率明显高，优先做模板领取文。

如果第 1 篇阅读高但收藏低，说明趋势吸引人，实战承接还要加强。

如果第 5 篇评论多，说明读者关心风险和落地，可以优先打包电子书。

## 电子书包装路径

### 不要一开始就卖书

第一阶段只在文末轻描淡写：

> 这个系列我会继续整理成一份更系统的《Loop Engineer 实战手册》，里面会放完整模板、清单和实战案例。

### 第 3 篇后开始收集意向

可以在文末加：

> 如果你想要 Planner / Generator / Evaluator 三角色模板，可以留言“Loop”。

目的不是马上卖书，重点是验证真实需求。

### 第 5 篇后宣布电子书计划

文末可以写：

> 如果这个系列反馈不错，我会把它扩展成电子书，补齐 Claude Code、Codex Automations、CI、内容采证、个人系统维护等完整案例。

### 加更模板文后再转化

等读者已经拿到几个免费模板，再推出电子书更自然。

电子书卖点：

- 完整 18 章结构。
- 12 个 Loop 模板。
- Planner / Generator / Evaluator prompt。
- Harness spec。
- 风险清单。
- CI / PR / 内容采证 / 周报 / 知识库案例。

## 微信读书电子书形态

建议电子书不要叫“公众号合集”。

推荐包装：

书名：

《Loop Engineer 实战手册：从提示词到 AI 循环系统》

副标题：

给 AI 实践者的 Agent 工作流、评估器、Harness 与个人系统指南

结构：

1. 正文：9-12 章。
2. 附录：模板库。
3. 案例：3-5 个完整 loop。
4. 清单：可复制检查表。

首版长度：

- 6-8 万字即可。
- 不必追求 18 章一次写完。
- 先做“实用电子书”，后续再升级为完整手册。

## 内容复用关系

```text
公众号第 1 篇 -> 电子书第 1 章
公众号第 2 篇 -> 电子书第 2-3 章
公众号第 3 篇 -> 电子书第 4-5 章
公众号第 4 篇 -> 电子书第 8-11 章
公众号第 5 篇 -> 电子书第 16-18 章
加更模板文 -> 电子书附录 A/B/C
```

## 每篇文章的发布前检查

每篇都要满足：

1. 第一屏有具体场景或强判断。
2. 不做工具参数堆砌。
3. 至少一个真实来源或案例。
4. 至少一个反向边界。
5. 至少一个可拿走的模板、表格或检查清单。
6. 文末有下一篇钩子。
7. 不直接强卖电子书。

## 推荐优先写第 1 篇

先写：

《Claude Code 之父说他不再写提示词了》

原因：

1. 话题有新闻势能。
2. 能承接之前的大纲。
3. 读者更容易进入。
4. 后续四篇都能自然接上。

第 1 篇不要写太技术，重点是让读者接受这个判断：

> AI Agent 的下一步，是让人学会设计可验证、可停止、可复用的循环系统。

## content_state

```yaml
content_state:
  request:
    raw_intent: "基于 Loop Engineering 手册素材，先拆分为适合公众号发布的选题，后续根据反馈包装电子书在微信读书发售"
    current_stage: "出刊规划"
    target_platforms: ["微信公众号", "微信读书电子书"]
  distribution:
    strategy: "先发公众号系列验证需求，再打包电子书"
    main_series:
      count: 5
      recommended_first_article: "Claude Code 之父说他不再写提示词了"
    optional_followups:
      count: 3
      purpose: "模板领取与电子书转化验证"
    ebook:
      timing: "第 5 篇后宣布计划，加更模板文后转化"
      first_version_length: "6-8 万字"
      format: "9-12 章 + 模板库 + 案例 + 检查表"
  next_step:
    skill: "wenchang-orchestrator -> 起稿"
    reason: "公众号拆分方案已完成，建议先写第 1 篇趋势判断文"
    user_decision_needed: true
  handoff:
    from_stage: "出刊规划"
    to_stage: "起稿"
    accepted_inputs:
      - "source pack"
      - "book outline"
      - "wechat series plan"
    ignored_context:
      - "未核验的社媒浏览量"
      - "直接售卖电子书的强转化话术"
    stop_condition: "等待用户确认先写哪一篇"
```
