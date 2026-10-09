# Claude Tag 发布：AI 同事终于有了工位

日期：2026-06-26
阶段：文昌总控 / 起稿 / 出刊
主题：Claude Tag / @Claude 进入 Slack
目标平台：微信公众号

## 事实边界

- 本文按 2026-06-26 公开资料核验。
- Anthropic 在 2026-06-23 发布 Claude Tag，定位为团队与 Claude 协作的新方式，首发场景是 Slack。
- Claude Tag 当前面向 Claude Enterprise 和 Team 客户开放 beta。
- 在 Slack 中，团队可以把 Claude 加入指定频道，并按频道配置工具、数据和代码库访问权限；频道成员可以通过 `@Claude` 交给它任务。
- 官方发布页称，Anthropic 内部产品团队 65% 的代码由内部版本 Claude Tag 创建；这属于 Anthropic 自家场景数据，不代表所有团队都能达到同等比例。
- Claude Tag 的频道任务运行在 Anthropic 托管的临时 sandbox 中，不在用户本地电脑或内网中运行；对外访问默认走 Agent Proxy 和管理员配置的允许规则。
- Claude Tag 的记忆属于频道或工作区，不绑定到某个个人；公开频道记忆会在工作区内共享，私有频道记忆保持隔离。
- 本文把 Claude Tag 写成“AI 同事”是一种产品和组织视角的解释，不代表它拥有人的责任主体、独立判断权或组织授权。

## 来源清单

1. Anthropic 发布页：https://www.anthropic.com/news/introducing-claude-tag
2. Claude Tag 文档总览：https://claude.com/docs/claude-tag/overview
3. Agent identity 文档：https://claude.com/docs/claude-tag/concepts/agent-identity
4. Security and data handling 文档：https://claude.com/docs/claude-tag/concepts/security-and-data
5. Memory 文档：https://claude.com/docs/claude-tag/users/memory
6. Routines 文档：https://claude.com/docs/claude-tag/users/proactivity
7. Good habits 文档：https://claude.com/docs/claude-tag/users/good-habits

## 标题备选

1. Claude Tag 发布：AI 同事终于有了工位
2. @Claude 进 Slack，真正改变的是团队记忆
3. Claude Tag 值得收藏：团队该怎么用好 AI 同事
4. AI 同事来了：先别兴奋，先写岗位说明书
5. Claude Tag 发布后，每个团队都要重写协作规则
6. Slack 里多了一个 @Claude，团队协作要变了
7. AI 从聊天框走进团队现场，这次要认真看
8. Claude Tag 给团队的提醒：别只会提问，要会分工
9. 让 AI 进群前，先准备这张权限和验收清单
10. Claude Tag 爆点不在新功能，在组织方式变化

## 推荐标题

Claude Tag 发布：AI 同事终于有了工位

## 搜索友好标题

Claude Tag 使用指南：@Claude 进入 Slack 后团队如何使用 AI 同事

## 朋友圈传播标题

AI 同事终于有了工位，但你敢让它进群吗？

## 摘要

Anthropic 发布 Claude Tag，把 @Claude 带进 Slack 频道、线程和私聊。它可以按频道获得工具、数据和代码库访问权限，记住频道上下文，执行异步任务和定时 routine。真正值得关注的变化是：团队需要开始为 AI 设计岗位、权限、记忆和验收规则。会用它的团队，会把日常协作沉淀成可复用的数字生产资料；不会用的团队，只会把群聊变成更嘈杂的自动化现场。

## 开头钩子

### 钩子 1

AI 进入团队协作，一个关键时刻可能很普通：有人在 Slack 里打出一句：

`@Claude can you investigate?`

然后整个频道都能看见它怎么拆任务、查数据、开分支、汇报进度、等待人验收。

### 钩子 2

过去我们问 AI，多半是一个人面对一个聊天框。

Claude Tag 发布后，问题变成了：如果 AI 也坐在团队频道里，它该看见什么、记住什么、能动什么、谁来验收它？

### 钩子 3

Claude Tag 最值得收藏的地方，不是功能列表。

它逼每个团队回答一个更难的问题：你的协作流程，清楚到可以交给一个 AI 同事参与吗？

## 正文

# Claude Tag 发布：AI 同事终于有了工位

2026 年 6 月 23 日，Anthropic 发布 Claude Tag。

表面看，这是一个 Slack 里的 @Claude。

你把 Claude 加进频道，给它指定工具、数据和代码库权限。频道里任何人都可以直接 `@Claude`，让它追一个 bug、整理一段决策线程、查项目状态、打开 PR、跟进审批、每天定时汇总进展。

这件事真正值得关注的地方，不在于 Slack 多了一个机器人。

它让 AI 第一次更像一个有工位的团队成员：它在频道里工作，使用团队授予的工具，保留频道上下文，把结果回到同一个公开线程里。

这会改变很多团队使用 AI 的方式。

过去的 AI 使用像单兵作战。每个人打开自己的聊天框，贴上下文，拿到结果，再复制回团队工具。

Claude Tag 把这条链路翻了过来：团队先把工作现场组织好，再让 AI 进入现场参与协作。

这个变化比一个新按钮大得多。

## 先看清它能做什么

按官方文档，Claude Tag 当前首发在 Slack。

你可以在频道、线程或私聊里提到 `@Claude`。频道里的 Claude 使用管理员给这个频道配置的 access bundle，比如 GitHub、数据仓库、监控系统、文档库或自定义工具。

它可以做几类事：

- 把一段讨论整理成文档或 ticket。
- 追踪项目状态，汇总阻塞项。
- 对接 GitHub，复现 bug、改代码、开 PR。
- 查询指标、日志、数据源，给出解释。
- 设置 routine，比如每天上午读未关闭线程、检查相关 ticket 和 PR，再发一行状态。
- 关注某个 PR、某个频道或某类告警，在有更新时回到频道提醒。

官方发布页还给了一个很刺激的数据：Anthropic 内部产品团队有 65% 的代码由内部版本 Claude Tag 创建。

这个数字很适合传播，也必须谨慎看。

Anthropic 是 Claude 的研发公司，内部工具链、权限、文化和验收流程都天然围绕 Claude 搭建。普通团队不能拿这个数字直接估算自己的提效幅度。

但它说明一件事：Claude Tag 不是“聊天框搬进 Slack”这么简单。它已经开始承担团队内部真实工作。

## AI 需要岗位说明书

很多团队试 AI 工具，第一步就错了。

他们会说：“我们把 AI 接进来，看它能帮什么。”

这句话听起来开放，实际会制造混乱。

一个新同事入职，你不会把他拉进所有群，然后说“你自己看看能帮什么”。你会告诉他负责什么、能看什么、找谁确认、交付标准是什么、遇到风险怎么升级。

AI 同事也一样。

Claude Tag 的文档里有一个重要设计：频道里的 Claude 使用管理员配置的 service account 行动。它在 GitHub、数据仓库或其他系统里的动作，也应该通过独立账号留下审计记录。

这意味着团队需要先写清楚岗位边界。

比如，一个 `#release-war-room` 频道里的 Claude，可以有这样的岗位说明：

| 项目 | 约定 |
| --- | --- |
| 主要职责 | 汇总发布阻塞、跟进 CI、整理失败原因 |
| 可读范围 | 当前发布相关 PR、CI、监控、发布文档 |
| 可写范围 | Slack 线程回复、草拟 issue、打开 draft PR |
| 禁止动作 | 自动合并、改生产配置、跳过审批 |
| 完成标准 | 给出证据链接、影响范围、建议下一步 |
| 人工验收 | 发布 owner 结论优先，Claude 只提供材料 |

这张表越清楚，AI 越有用。

没有这张表，Claude 只会变成一个更会说话的群助手。

## 团队记忆开始变成资产

Claude Tag 另一个关键能力是频道记忆。

官方文档写得很清楚：记忆属于频道，不属于某个个人。公开频道里的记忆会在工作区内共享，私有频道里的记忆保持在该频道自己的存储里。

这背后的意义很大。

过去，团队记忆分散在三种地方：

- 某个老员工脑子里。
- 一段很难搜索的聊天记录里。
- 一份过期很久的文档里。

Claude Tag 把一个新变量加进来：频道可以逐渐拥有可被 AI 调用的工作记忆。

比如你可以在频道里告诉 Claude：

`@Claude remember for this channel: 所有数据变更先走 dry-run，结果贴到线程里，由 owner 确认后再执行。`

下次有人让它处理类似任务，它至少知道这个频道的稳定约定。

这对 Human3.0 很关键。

AI 时代真正有价值的，不只是让机器更快执行一次任务。更重要的是把团队长期重复的判断、规则、偏好、验收标准沉淀下来，变成可复用的数字生产资料。

频道记忆如果治理得好，会让团队越来越清楚。

治理不好，也会带来新问题：过期规则继续影响新任务，错误记忆被反复调用，公开频道记忆扩散到不该影响的场景。

所以频道记忆必须有维护机制。

最简单的做法是每月问一次：

`@Claude what do you remember about this channel?`

然后让团队删除过期规则，修正错误上下文，把长文档移到仓库或知识库，只在记忆里保留短而稳定的约定。

记忆不应该变成第二个聊天记录坟场。

## 权限比提示词重要

Claude Tag 让 AI 进团队现场，最大的风险不在提示词写得好不好。

真正的风险在权限。

官方安全文档里有几个关键信息：

- 频道任务运行在 Anthropic 托管的临时 sandbox 中。
- sandbox 本身不持有凭证。
- 对外请求通过 Agent Proxy。
- 未被管理员允许的 host 默认不可访问。
- 连接凭证在边界处注入，模型和 sandbox 不直接拿到密钥。
- 频道里的 Claude 使用 service account 行动，便于审计和撤销。

这些设计说明 Anthropic 很清楚企业协作场景的安全压力。

但安全设计不等于团队可以放松。

只要频道里的人都能调用 Claude，而 Claude 又能使用这个频道配置的工具，那么频道权限本身就变成了核心边界。

你把 GitHub 写权限给了某个频道，就等于让频道里所有能调用 Claude 的人，都能通过 Claude 触达这套能力。

所以接入 Claude Tag 前，团队至少要问五个问题：

1. 这个频道里的所有人，都应该共享同一组 AI 权限吗？
2. Claude 可以读哪些数据，哪些数据必须保持不可见？
3. Claude 可以写哪里，只能写草稿，还是可以打开 PR？
4. 哪些动作必须由人最后确认？
5. 出错后，审计日志能不能定位是谁发起、Claude 做了什么、改了哪里？

提示词能提升产出质量。

权限设计决定风险上限。

## 先从低风险闭环开始

很多团队看到 Claude Tag，会想立刻全公司铺开。

我不建议这样做。

更稳的方式，是先选一个低风险但高频的协作闭环。

比如：

- 每天汇总未关闭线程。
- 把决策讨论整理成文档。
- 跟进 PR 状态和 CI 结果。
- 从告警频道提取疑似根因。
- 把客户支持问题整理成产品反馈。

这些场景有三个共同点：

第一，输入和输出都在频道里。

第二，结果可以被人快速检查。

第三，出错不会直接伤到生产系统。

最小试点可以这样跑：

| 步骤 | 做法 |
| --- | --- |
| 选频道 | 只选一个真实工作频道，不从全公司大群开始 |
| 定职责 | 写一页岗位说明书，说明能做什么、不能做什么 |
| 限权限 | 先给只读或 draft 权限，避免一上来可写生产系统 |
| 设验收 | 每个任务都写 done 条件，比如“CI 绿并附链接” |
| 看日志 | 每周复盘 Claude 做了什么、谁发起、哪些结果被采纳 |
| 再放权 | 连续稳定后，再扩大权限或增加 routine |

这套做法的核心很简单：先让 AI 在一个可审计的小场景里证明自己，再让它进入更复杂的流程。

不要一开始就追求“自治”。

先追求可验证。

## 每个任务都要能关闭

Claude Tag 官方文档里有一条很实用的建议：任务要有可验证的结束状态。

这句话非常值得收藏。

很多人给 AI 的任务是：

“看一下这个问题。”

这种任务很难关闭。Claude 可以写一堆分析，但没人知道它是否完成。

更好的写法是：

“请比较今天 10:00 前后 checkout p99 延迟，找出最可能的变化点，贴出 Datadog 图表链接、相关 deploy diff 和你建议的下一步。完成标准：至少给出一个可复核证据链接。”

区别很明显。

前者是在喊人帮忙。

后者是在定义交付物。

Claude Tag 进入团队之后，每个人都要学会写这种任务：

- 结果是什么？
- 证据在哪里？
- 谁有权关闭？
- 如果失败，下一步是什么？

这比“会不会写神奇 prompt”重要得多。

真正成熟的团队，不会把 AI 当作一个随叫随到的许愿池。它们会把任务写成可以完成、可以检查、可以交接的工作单元。

## 给团队的接入清单

如果你所在团队准备试 Claude Tag，可以先收藏这张清单。

### 1. 频道清单

- 哪些频道适合接入 Claude？
- 哪些频道只适合观察，不适合行动？
- 哪些频道包含敏感信息，暂不接入？
- 每个频道的 owner 是谁？

### 2. 权限清单

- Claude 能读哪些系统？
- Claude 能写哪些系统？
- 是否使用独立 service account？
- 是否区分只读、草稿、可写三档权限？
- 是否可以快速撤销某个频道的 access bundle？

### 3. 记忆清单

- 哪些规则值得写入频道记忆？
- 哪些内容必须放在仓库、文档库或 runbook 里？
- 谁定期检查 Claude 记住了什么？
- 错误记忆如何修正？

### 4. 验收清单

- 每类任务的 done 条件是什么？
- 哪些任务 Claude 可以自己关闭？
- 哪些任务必须等人确认？
- 结果必须附什么证据？

### 5. 升级清单

- 误操作时谁来暂停 Claude？
- 发现敏感信息泄露风险时如何处理？
- 任务跨频道、跨部门时谁有最终解释权？
- 哪些动作永远不能交给 AI 自动完成？

这张清单看起来像管理动作。

实际是在保护人的判断权。

## Human3.0 的真正启发

Claude Tag 这次发布，最适合放到 Human3.0 里看。

它提醒我们：AI 协作正在从个人效率工具，进入团队生产系统。

个人用 AI，关键能力是会提问、会拆任务、会验证。

团队用 AI，关键能力变成了：

- 能不能把工作现场整理清楚。
- 能不能给 AI 明确角色和边界。
- 能不能把规则沉淀成记忆、文档、流程和审计。
- 能不能保留人的最终判断权。

很多人担心 AI 会替代人。

更现实的分化是：有些人会继续把 AI 当成外包按钮，有些人会开始搭自己的生产系统。

到了 Claude Tag 这一层，差距会进一步拉开。

有些团队会让 AI 进入混乱的群聊，制造更多噪音。

有些团队会借这个机会，把会议、决策、代码、指标、反馈、复盘全部整理成可被 AI 参与的工作流。

后一种团队，才会真正获得复利。

AI 同事的价值，不取决于它坐进了哪个群。

取决于这个群有没有清楚的任务、权限、记忆和验收。

## 最后

Claude Tag 值得关注，因为它把一个问题摆到台面上：

你的团队准备好让 AI 进入工作现场了吗？

如果还没有，别急着接工具。

先拿一张纸，把一个频道写清楚：

- 这个频道负责什么？
- 这里最常重复的三类任务是什么？
- 哪些资料应该让 AI 可见？
- 哪些动作必须由人确认？
- 什么样的结果算完成？

这五个问题回答清楚，Claude Tag 才会变成团队生产力。

回答不清楚，它只会变成另一个热闹插件。

评论区可以聊一个具体问题：

如果你只能让 AI 进入一个工作频道，你会选哪个频道？你会给它什么权限，又会禁止它做什么？

## 配图建议

1. 首屏判断图：左侧是“个人聊天框”，右侧是“团队频道里的 @Claude”，中间箭头标注“从个人问答到团队工作现场”。
2. 频道岗位说明书图：用表格呈现“职责、可读、可写、禁止、验收、owner”六格。
3. 权限边界图：Slack 频道、Claude sandbox、Agent Proxy、GitHub / 数据仓库 / 文档库四层连接，突出默认阻断和 service account。
4. 试点路线图：一个频道、一个职责、只读权限、done 条件、每周复盘、逐步放权。

## 朋友圈转发文案

Claude Tag 这次最值得关注的地方，不在 Slack，也不在某个功能按钮。它把一个更现实的问题摆到团队面前：如果 AI 也坐进工作频道，我们有没有能力给它定义职责、权限、记忆和验收标准？会用的人会把协作沉淀成数字生产资料；不会用的人只会把群聊变得更吵。

## 评论区引导

你最愿意让 AI 进入哪个工作频道？只给它读权限，还是允许它开 PR、查数据、跟进审批？评论区可以直接写你的“允许做 / 禁止做”清单。

## 搜一搜发布包

- 搜索友好标题：Claude Tag 使用指南：@Claude 进入 Slack 后团队如何使用 AI 同事
- 朋友圈传播标题：AI 同事终于有了工位，但你敢让它进群吗？
- 搜一搜摘要：Anthropic 发布 Claude Tag，把 @Claude 带进 Slack。本文梳理 Claude Tag 的核心能力、频道记忆、service account、sandbox、安全边界和团队接入清单，帮助团队判断如何试点 AI 同事。
- 核心关键词：Claude Tag
- 副关键词：@Claude、Slack AI、AI 同事、团队协作、Human3.0
- 标签：Claude、Anthropic、AI Agent、团队协作、Human3.0、AI 工作流
- 封面文案：AI 同事终于有了工位
- 正文关键词补强建议：
  - 开头 100 字内已自然出现 Claude Tag、Anthropic、Slack、@Claude。
  - 小标题覆盖团队协作、权限、频道记忆、接入清单。
  - 图片说明应包含 Claude Tag、Slack、权限、记忆、验收等词，帮助搜索理解。

## 诊文与出刊自检

- 发布建议：补图后可发布。
- 主线判断：成立。文章没有停留在产品搬运，而是把 Claude Tag 转成“AI 进入团队现场后如何设计岗位、权限、记忆和验收”的方法论。
- 传播钩子：标题和开头足够直接，65% 官方内部数据可作为首屏讨论点，但正文已做边界降级。
- 收藏点：岗位说明书表格、试点路线图、五张接入清单适合收藏。
- 讨论点：让 AI 进哪个频道、给什么权限、禁止什么动作，适合评论区展开。
- 风险点：Claude Tag 处于 beta，产品细节和可用范围可能变动；发布前如延迟超过一周，建议重新核一次官方文档。
- 配图阻塞：正文可发布，但如追求公众号完稿质量，建议至少补 1 张首屏判断图和 1 张权限边界图。

## content_state

```yaml
content_state:
  project:
    name: 文昌.skill
    account: AI生命克劳德
    long_term_goal: Human3.0
  request:
    raw_intent: "启动文昌总控，帮我以最近claude刚发布的 claude tag为主题，写一篇爆款优质公众号，要能激发收藏、转发和讨论"
    current_stage: 出刊
    target_platforms:
      - 微信公众号
  audience:
    primary: AI 实践者、工程团队负责人、内容创作者、关注 Human3.0 的知识工作者
    pain_points:
      - 看到新 AI 产品更新，但不知道普通团队应该怎么落地
      - 想用 AI 提效，又担心权限、隐私、误操作和噪音
      - 缺少可复制的团队 AI 接入清单
  topic:
    source: Anthropic Claude Tag 发布页与官方文档
    core_angle: "Claude Tag 的价值在于让 AI 进入团队工作现场，团队需要为 AI 设计岗位、权限、记忆和验收。"
    title_candidates:
      - Claude Tag 发布：AI 同事终于有了工位
      - @Claude 进 Slack，真正改变的是团队记忆
      - AI 同事来了：先别兴奋，先写岗位说明书
    selected_title: Claude Tag 发布：AI 同事终于有了工位
    why_now: "Anthropic 于 2026-06-23 发布 Claude Tag，首发 Slack，当前仍具时效性。"
    long_term_value: "可沉淀为 Human3.0 中关于团队 AI 协作、权限设计、记忆治理和数字生产资料的案例。"
  storm_research:
    topic: Claude Tag 对团队协作和 Human3.0 的影响
    purpose: "把产品更新转成有收藏价值的团队 AI 接入方法论"
    perspectives:
      - 实践者: 关心能否把 bug、PR、数据查询、项目跟进交给 @Claude
      - 管理者: 关心频道职责、owner、验收和试点路线
      - 安全负责人: 关心 service account、sandbox、Agent Proxy、审计和权限边界
      - 怀疑者: 关心噪音、错误记忆、过度授权和 beta 变动
      - Human3.0 观察者: 关心团队如何把协作规则沉淀为数字生产资料
    contradiction_map:
      conflicts:
        - "Claude Tag 能提升异步协作，但也会放大团队原有流程混乱。"
        - "频道记忆能沉淀上下文，也可能固化过期规则。"
        - "更多工具权限提高任务完成度，也提高误用风险。"
      consensus:
        - "Claude Tag 适合从单频道、低风险、高频任务试点。"
        - "每个任务需要可验证的 done 条件。"
        - "权限设计比提示词技巧更底层。"
      blind_spots:
        - "不同企业对 ZDR、审计、内网访问和敏感数据的合规要求差异很大。"
        - "普通团队真实提效幅度不能从 Anthropic 内部 65% 数据直接推导。"
    synthesis_brief:
      summary: "Claude Tag 让 AI 从个人聊天框进入团队频道，关键变化是团队必须显性化职责、权限、记忆和验收。"
      key_findings:
        - "首发 Slack，面向 Enterprise 和 Team beta。"
        - "频道里的 Claude 使用管理员配置的 access bundle 和 service account。"
        - "频道任务运行在 Anthropic 托管 sandbox，通过 Agent Proxy 访问外部系统。"
        - "记忆按频道和工作区治理，不绑定个人。"
        - "任务要有可验证结束状态，适合从低风险闭环试点。"
      hidden_connection: "Claude Tag 把 AI 工具使用问题，推进成组织协作协议问题。"
      actionable_insight: "团队应先写频道级 AI 岗位说明书，再扩大权限和 routine。"
      frontier_question: "当 AI 参与团队记忆和执行后，哪些判断必须永久保留给人？"
    confidence_review:
      scores:
        - "官方事实可信度 High"
        - "组织影响判断可信度 Medium"
        - "普通团队提效幅度可信度 Low"
      weakest_claim: "Claude Tag 对普通团队的实际提效幅度"
      missing_perspectives:
        - 企业合规负责人实测
        - 普通中小团队试点数据
        - 中文企业协作工具适配情况
      verification_needed:
        - Claude Tag beta 可用范围和具体开放节奏
        - 后续是否扩展到 Slack 之外的协作平台
    evidence_plan:
      - "跟踪 Anthropic Claude Tag 发布页和官方文档变动"
      - "关注真实团队接入案例与安全复盘"
      - "后续可对比 Claude Tag、Codex Automations、Claude Code/Cowork 的协作边界"
  research:
    sources:
      - "Anthropic: Introducing Claude Tag"
      - "Claude Tag documentation overview"
      - "Claude Tag security and data handling"
      - "Claude Tag memory"
      - "Claude Tag routines"
      - "Claude Tag good habits"
    key_facts:
      - "2026-06-23 Anthropic 发布 Claude Tag。"
      - "Claude Tag 首发 Slack，频道成员可通过 @Claude 交付任务。"
      - "Claude Tag 当前面向 Claude Enterprise 和 Team 客户 beta。"
      - "频道任务运行在 Anthropic 托管 sandbox，不在用户本地或内网运行。"
      - "频道中的 Claude 通过 service account 和 access bundle 获取工具权限。"
      - "记忆属于频道或工作区，不绑定个人。"
    contrarian_points:
      - "Anthropic 内部 65% 代码数据不能直接代表普通团队。"
      - "Claude Tag beta 阶段产品边界可能变化。"
      - "频道共享权限会让频道成员间接共享 Claude 可触达能力，需要严格治理。"
      - "Claude Tag retained channel memory，因此不适用于启用 ZDR 的组织。"
    usable_quotes: []
    contradictions:
      - "能力越强，越依赖团队事先定义清楚权限和验收。"
    confidence: High
  outline:
    thesis: "Claude Tag 的核心启发是团队需要为 AI 设计岗位、权限、记忆和验收，而不只是学习新的提示词。"
    sections:
      - 先看清它能做什么
      - AI 需要岗位说明书
      - 团队记忆开始变成资产
      - 权限比提示词重要
      - 先从低风险闭环开始
      - 每个任务都要能关闭
      - 给团队的接入清单
      - Human3.0 的真正启发
    examples_to_use:
      - release war room 频道岗位说明书
      - 每天汇总未关闭线程的 routine
      - PR / CI 跟进任务
  draft:
    status: complete
    file: content/outputs/2026-06-26-claude-tag-wechat.md
    summary: "一篇面向公众号的 Claude Tag 热点稿，包含事实边界、正文、发布资产、配图建议和 content_state。"
  diagnosis:
    recommendation: 补图后可发布
    key_issues:
      - "需要至少补 1-2 张公众号结构图提升首屏和收藏价值。"
      - "如发布晚于 2026-07-03，建议重新核 Claude Tag beta 范围。"
    minimum_fixes:
      - "补首屏判断图。"
      - "补权限边界图。"
  publish_assets:
    title: Claude Tag 发布：AI 同事终于有了工位
    search_title: "Claude Tag 使用指南：@Claude 进入 Slack 后团队如何使用 AI 同事"
    social_title: "AI 同事终于有了工位，但你敢让它进群吗？"
    summary: "Anthropic 发布 Claude Tag，把 @Claude 带进 Slack 频道、线程和私聊。本文从能力、权限、记忆、routine 和团队接入清单拆解它对 AI 协作的真实启发。"
    search_summary: "Anthropic 发布 Claude Tag，把 @Claude 带进 Slack。本文梳理 Claude Tag 的核心能力、频道记忆、service account、sandbox、安全边界和团队接入清单。"
    search_keywords:
      - Claude Tag
      - "@Claude"
      - Slack AI
      - AI 同事
      - 团队协作
    body_keyword_notes:
      - "开头自然出现 Claude Tag、Anthropic、Slack、@Claude。"
      - "小标题覆盖团队协作、权限、频道记忆、接入清单。"
    cover_text: "AI 同事终于有了工位"
    tags:
      - Claude
      - Anthropic
      - AI Agent
      - 团队协作
      - Human3.0
    images:
      - "首屏判断图：个人聊天框到团队工作现场"
      - "频道岗位说明书图"
      - "权限边界图"
      - "试点路线图"
    share_copy: "Claude Tag 这次最值得关注的地方，不在 Slack，也不在某个功能按钮。它把一个更现实的问题摆到团队面前：如果 AI 也坐进工作频道，我们有没有能力给它定义职责、权限、记忆和验收标准？"
    comment_prompt: "如果你只能让 AI 进入一个工作频道，你会选哪个频道？你会给它什么权限，又会禁止它做什么？"
  distribution:
    primary_platform: 微信公众号
    secondary_platforms:
      - 小红书图文
      - 知乎讨论
    card_skill: wechat-to-cards
    image_skill: "默认先生成图片提示词，不直接出图"
  archive:
    should_review_for_book: true
    material_type: "Human3.0 团队 AI 协作案例"
    suggested_bucket: "AI 同事 / 团队工作流 / 数字生产资料"
  decisions:
    - stage: 归档
      question: 是否进入 Human3.0 成书审查
      user_choice: 默认归档（用户未撤销）
      timestamp: 2026-06-26
      impact: "作为 Human3.0 团队 AI 协作案例保留，暂不自动执行最终入书。"
  next_step:
    skill: wenchang-publish-check
    reason: "正文已完成，下一步如需发布应补公众号结构图和最终标题确认。"
    user_decision_needed: true
  handoff:
    from_stage: 出刊
    to_stage: 配图/卡片
    accepted_inputs:
      - "最终正文文件 content/outputs/2026-06-26-claude-tag-wechat.md"
      - "配图建议"
      - "publish_assets"
    ignored_context:
      - "未结构化聊天历史"
      - "未核验的二手媒体转述"
    stop_condition: "需要用户确认是否生成公众号插图、小红书卡片或直接进入发布。"
```
