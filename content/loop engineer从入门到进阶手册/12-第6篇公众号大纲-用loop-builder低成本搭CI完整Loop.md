# 第 6 篇公众号大纲：用 loop-builder 低成本搭一个完整 CI 修复 Loop

## 选题定位

这篇要从“哪些场景适合 Loop”进一步收敛到一个真正完整的落地案例：

> 如何用 `loop-builder` 低成本搭一个完整的 CI 自动修复 Loop。

它要解决读者最现实的问题：

> 我知道 Loop Engineering 很重要，但自己从零搭一个 Loop 成本太高。目标、状态文件、Planner、Maker、Checker、Evaluator、断路器、人工确认点都要设计，怎么开始？

这篇不再把公众号数据复盘当主案例。公众号数据复盘只能作为对照：

- 它是 Loop-ready 工作流：结构化上下文 + 状态 + 可复跑 prompt。
- 但它还不是严格意义的完整 Loop。
- 完整 Loop 必须有“执行 -> 反馈 -> 判断 -> 继续或停止”的闭环。

主案例改为 CI 自动修复，因为它具备完整 Loop 的核心条件：

- 有明确失败信号。
- 有测试 / lint / build 作为外部反馈。
- 有 diff 可检查。
- 能失败后重试。
- 能触发断路器停止。
- 能保留人工确认，不自动 merge。

## 推荐标题

主推标题：

> 用 loop-builder 搭一个完整 CI 修复 Loop：低成本落地 AI Agent 自动化

备选标题：

1. 什么才是真正的 Loop？用 loop-builder 搭一个 CI 自动修复闭环
2. 从 Prompt 到完整 Loop：用 loop-builder 低成本实现 CI 自动修复
3. AI Agent 自动化怎么落地？先用 loop-builder 搭一个最小 CI 修复 Loop
4. 别只写提示词了：用 loop-builder 生成 Planner / Maker / Checker 闭环
5. 一个真正跑得起来的 Loop：CI 修复、测试反馈、断路器和人工确认

## 开头抓手

开头直接回应读者误区：

```md
很多人第一次听到 Loop Engineering，会把它理解成：

我写一个结构化 prompt，下次继续复用。

这还不够。

结构化 prompt、上下文文件、状态记录，最多只能算 Loop-ready。

真正的 Loop，要有一条闭环：

执行 -> 反馈 -> 判断 -> 下一轮执行，直到通过或停止。
```

接着引出问题：

```md
问题是，完整 Loop 不便宜。

你要设计目标、状态文件、角色分工、验收方式、断路器和人工确认点。

如果每个任务都从零搭，成本太高。

所以这篇讲一个更现实的办法：

用 loop-builder 先生成 Loop 脚手架，再用一个 CI 自动修复任务，把它跑成完整闭环。
```

## 文章承诺

这篇只解决一个问题：

> 如何用 `loop-builder` 低成本搭出一个真正有反馈闭环的 CI 自动修复 Loop。

不承诺：

- 不做全自动程序员。
- 不自动 merge。
- 不自动改生产配置。
- 不处理大重构。
- 不把所有任务都包装成 Loop。

## 读者获得感

读者读完应能拿走：

1. 分清 Prompt、Loop-ready、完整 Loop 的区别。
2. 知道为什么 CI 修复是适合新手落地的完整 Loop 案例。
3. 学会用 `loop-builder` 生成 CI 修复 Loop 脚手架。
4. 拿到 Planner / Maker / Checker / Evaluator 的分工。
5. 拿到停止规则、人工确认节点和最小运行流程。

## 文章主线

主线：

> 完整 Loop 不是多写几个 Markdown 文件，而是让 Agent 在外部反馈约束下循环推进；`loop-builder` 的价值，是把这套闭环的设计成本降下来。

核心判断：

- Prompt 是一次性问答。
- Loop-ready 是结构化上下文 + 状态 + 可复跑流程。
- 完整 Loop 是执行、反馈、判断、继续或停止。
- CI 修复天然适合完整 Loop，因为测试就是反馈。
- `loop-builder` 不是执行器，而是 Loop 脚手架生成器。

## 结构大纲

### 一、先分清：Prompt、Loop-ready、完整 Loop

核心观点：

- 结构化上下文不等于 Loop。
- 可复跑 prompt 不等于 Loop。
- 只有能基于反馈继续或停止，才是完整 Loop。

建议放一张表：

| 层级 | 是什么 | 是否完整 Loop | 例子 |
|---|---|---|---|
| Prompt | 一次性问答 | 否 | 帮我分析这 5 篇数据 |
| Loop-ready | 结构化上下文 + 状态 + 可复跑流程 | 还不是 | 公众号数据复盘 Agent |
| 完整 Loop | 执行 -> 反馈 -> 判断 -> 继续或停止 | 是 | CI 自动修复 Loop |

要强调：

> 公众号数据复盘更像 Loop-ready：它有 state、schema、run-log，但缺少同一轮内自动根据验收反馈继续修正的机制。

CI 修复不同：

> Maker 修代码，Checker 跑测试；测试不过，Evaluator 可以判断继续、缩小范围或停止。这才是完整闭环。

### 二、为什么 CI 修复适合作为第一个完整 Loop？

核心观点：

- 第一个完整 Loop 要选反馈清楚、风险可控、边界明确的场景。
- CI 修复满足这些条件。

适合原因：

- 错误日志明确。
- 有测试命令。
- 有 diff 可以审。
- 可以只修一个小问题。
- 失败可以重试。
- 成功可以由 Checker 验证。
- merge 必须由人确认。

不适合的 CI 任务：

- 修复所有 CI 问题。
- 顺手重构。
- 改测试迎合结果。
- 修改生产配置。
- 处理需要产品判断的需求。

小结句：

> 第一个完整 Loop，不要选最有野心的任务，要选反馈最硬的任务。

### 三、loop-builder 在这里降低了什么成本？

核心观点：

- 搭 Loop 难的不是写一句 prompt，而是把闭环拆清楚。
- `loop-builder` 帮你把闭环脚手架一次性生成出来。

它要生成的不是一个答案，而是这些产物：

- 任务适配判断。
- Loop 模式选择。
- 最小设计卡。
- `TODO.md` state file。
- Planner Prompt。
- Maker Prompt。
- Checker Prompt。
- Evaluator Prompt。
- 断路器清单。
- 成本控制清单。
- 人工确认清单。

给读者的判断：

> 如果你每次都手写这些东西，Loop 的启动成本太高；`loop-builder` 的作用，就是把这些通用脚手架标准化。

### 四、给 loop-builder 的最小输入

这一节要给读者一个能复制的输入。

```md
请使用 loop-builder，把“CI 失败自动修复”设计成一个完整 Loop。

任务目标：
每轮只处理一个失败测试或明确 lint 错误。

输入材料：
- 项目目录：<path>
- 测试命令：<例如 npm test / pytest>
- 最近失败日志：<粘贴日志或路径>
- 项目规则：AGENTS.md / README / 代码约定

成功标准：
- 相关测试通过。
- diff 只包含必要修改。
- 不修改测试预期来迎合结果。
- 输出 PR 摘要。

反馈信号：
- test / lint / build。
- git diff。
- Checker 审查结果。

允许动作：
- 读取相关代码。
- 修改和失败问题直接相关的文件。
- 运行约定测试命令。

禁止动作：
- 不自动 merge。
- 不 push。
- 不改生产配置。
- 不改权限、支付、数据删除相关代码。
- 不做无关重构。

人工确认：
- 是否执行修复。
- 是否接受 diff。
- 是否 merge。

输出档位：
脚手架档；跑通后再升级运行包档。
```

这里要解释：

- 不要一开始就 Agent 包档。
- 第一次只要脚手架档。
- 跑通一轮后，再补运行包和自动调度。

### 五、loop-builder 会生成什么？

这一节展示输出结构，不需要贴全文。

#### 1. Loop 适配判断

示例：

```md
结论：适合。
原因：目标明确，反馈信号稳定，失败后可重试，人工确认点清楚。
不适合自动化的部分：merge、生产配置、权限、支付、数据删除。
```

#### 2. Loop 策略

主模式：

- Plan-Execute-Verify

辅助模式：

- Retry Loop
- Human-in-the-Loop

解释：

- Planner 只读定位问题。
- Maker 做最小修复。
- Checker 跑测试和审 diff。
- Evaluator 判断继续、停止或交给人。

#### 3. State file

最小字段：

```md
## Goal
- 修复一个有明确失败信号的 CI 问题
- 相关测试通过
- 不做无关重构

## Current Attempt
- Issue:
- Related files:
- Last command:
- Last result:
- Next action:

## Stop Rules
- 连续 2 次同类失败停止
- 修改范围越界停止
- 需要改测试预期停止
- 触碰生产 / 权限 / 支付 / 数据删除停止
```

#### 4. 四个角色 Prompt

简要说明：

- Planner：只读侦察，不改文件。
- Maker：只做最小修复。
- Checker：独立验收，不改代码。
- Evaluator：决定继续、停止、回滚或等待人工确认。

### 六、完整 Loop 怎么跑起来？

这一节是全文核心，必须写出循环。

最小闭环：

```text
1. Planner 读取失败日志和 state
2. Planner 选一个最小可修问题
3. Maker 按 state 做最小修改
4. Maker 运行约定测试
5. Checker 审 diff + 测试结果
6. Evaluator 判断：
   - 通过：停止，输出 PR 摘要
   - 不通过但仍在范围内：进入下一轮 Maker
   - 连续失败 / 越界 / 高风险：停止，交给人
```

要强调：

- 循环不是无限跑。
- 每一轮都必须更新 state。
- Checker 不能和 Maker 是同一个“自我确认”角色。
- 人工确认不是失败，而是安全边界。

可以放一个伪流程：

```md
Round 1:
Planner -> Maker -> Checker -> Evaluator

如果 Checker 不通过：
Evaluator 判断是否允许 Round 2

Round 2:
Maker 缩小范围或换修复路径 -> Checker -> Evaluator

停止：
测试通过 / 连续失败 / 范围越界 / 需要人工确认
```

### 七、一个最小 CI 失败例子

用第 5 篇里的例子即可：

```text
FAIL test/auth/login.test.ts
Expected status 401, received 500
```

Planner 输出：

- 失败信号：登录失败返回码错误。
- 相关文件：auth handler。
- 验收命令：`npm test -- test/auth/login.test.ts`
- 适合进入 Loop：是。

Maker 任务：

- 只修 auth handler 的错误处理。
- 不改测试预期。
- 不改权限模型。
- 修复后运行指定测试。

Checker 验收：

- diff 是否只围绕 auth handler。
- 是否没有修改测试预期。
- 指定测试是否通过。
- 是否引入权限风险。

Evaluator 决策：

- 通过：输出 PR 摘要，等待人 review。
- 不通过：如果仍是同类小错误，允许第 2 轮。
- 连续失败：停止，写阻塞原因。

### 八、断路器：没有这些，就别叫可控 Loop

必须列清楚：

| 断路器 | 触发条件 | 动作 |
|---|---|---|
| 连续失败 | 同一测试连续失败 2 次 | 停止 |
| 范围越界 | 从单文件扩大到多模块 | 等待人工确认 |
| 修改测试 | 需要改测试预期 | 停止 |
| 高风险动作 | 生产、权限、支付、数据删除 | 停止 |
| 成本超限 | 超过时间 / token / 轮次预算 | 停止 |
| Checker 不确定 | 无法判断是否通过 | 交给人 |

小结句：

> Loop 的价值不只是会继续，更是知道什么时候不该继续。

### 九、什么时候升级到自动调度？

核心观点：

- 先手动跑通。
- 再只读定时侦察。
- 最后才考虑 Maker 自动执行。

三阶段：

| 阶段 | 做什么 | 风险 |
|---|---|---|
| 手动 Loop | 手动触发 Planner / Maker / Checker | 低 |
| 只读调度 | 定时找候选问题，不改代码 | 中 |
| 半自动修复 | 低风险问题自动出 diff，等待 review | 高 |

建议：

- 第一次不要直接 cron + 自动修复。
- 先让 cron 只做只读侦察。
- Maker 自动执行前，必须确认候选质量稳定。

### 十、和内容数据复盘的区别

这一节回应读者可能的疑问：

> 那内容数据复盘算不算 Loop？

回答要严谨：

- 单次内容数据复盘不是完整 Loop。
- 它更像 Loop-ready：结构化输入、状态、日志、人工确认。
- 只有当它每次发布后固定复盘，并且诊断不合格会退回重写，才逐渐接近 Lifecycle Loop。

对比表：

| 任务 | 当前形态 | 为什么 |
|---|---|---|
| CI 自动修复 | 完整 Loop | 有测试反馈，可以失败后继续修 |
| 内容数据复盘 | Loop-ready / Human-in-the-Loop | 主要是诊断和人工决策，缺少自动修正闭环 |
| 学习复盘 | Lifecycle 候选 | 多轮运行后可沉淀状态 |

小结句：

> 不是所有任务都要强行叫 Loop。先判断它是 Prompt、Loop-ready，还是完整 Loop。

### 十一、结尾：低成本落地，不等于低标准

结尾回到主判断：

```md
loop-builder 降低的是搭建成本，不是安全标准。

它帮你生成目标、状态、角色、验收和断路器。

但一个 Loop 是否值得跑，仍然取决于有没有反馈、能不能停止、是否保留人的判断权。
```

建议结尾句：

> 第一个完整 Loop，不要从最复杂的业务开始。先找一个有硬反馈的小任务，比如 CI 修复。让它跑通一轮，你才真正理解 Loop Engineering 不是多写提示词，而是设计一个会被反馈约束的系统。

互动问题：

> 如果下一篇继续展开，你更想看我把这个 CI 修复 Loop 做成可复制模板，还是看 Claude Code / Cursor 版本的同类实现？

## 图片建议

### 图 1：Prompt、Loop-ready、完整 Loop 三层对比

位置：第一节。

内容：

- Prompt：一次性回答。
- Loop-ready：上下文 + state + run-log。
- 完整 Loop：执行 -> 反馈 -> 判断 -> 继续 / 停止。

### 图 2：CI 自动修复完整闭环

位置：第六节。

内容：

- Planner
- Maker
- Checker
- Evaluator
- 通过 / 下一轮 / 停止

### 图 3：loop-builder 降低落地成本

位置：第三或第五节。

内容：

- 输入真实任务。
- 输出 state、角色 Prompt、断路器、人工确认点。
- 人确认后进入执行。

## 写作注意

- 不要把 Markdown 文件包装成完整 Loop。
- 要明确区分 Loop-ready 和完整 Loop。
- CI 修复是主案例，公众号数据复盘只作为对照。
- 写清 loop-builder 是脚手架生成器，不是执行器。
- 强调测试反馈、Checker 独立验收、Evaluator 停止规则。
- 不承诺自动 merge，不鼓励新手直接自动调度。

## 发布后验证指标

- 阅读：目标 1000+。
- 分享：目标 80+。
- 收藏：目标 40+。
- 新增关注：目标 15+。
- 留言或私信：希望出现 3 个以上“我想用 loop-builder 搭某个完整 Loop”的真实场景。

如果收藏高但留言少，说明这篇更像工具型方法论，适合进入电子书和模板包。

## 下一步

人工确认后进入正文初稿。

正文建议 3000-4000 字，重点讲清：

- 什么是完整 Loop。
- 为什么 CI 修复适合作为第一个完整案例。
- loop-builder 如何降低设计成本。
- 最小闭环如何跑。
- 断路器和人工确认为什么不能省。
