# Agent 进化论 04｜国内用户用 Codex 接国产模型，先把这三条底座跑通

## 事实边界

- 本文按 2026-06-22 公开资料复核，模型价格、工具支持范围和配置字段变化很快，发布前建议再复核一次官方页。
- OpenAI 当前价格页列出的 Codex 专用模型是 `gpt-5.3-codex`，标准价格为输入 1.75 美元 / 百万 tokens、输出 14 美元 / 百万 tokens；不是原素材里旧口径的 `GPT-5-Codex` 1.25 / 10 美元。
- Codex 官方配置文档支持自定义 `model_providers`，但当前 `wire_api` 只支持 `responses`。很多国产模型提供的是 OpenAI Chat Completions 或 Anthropic Messages 兼容接口，直接改 `base_url` 未必能跑，需要 Responses 兼容网关、代理层，或支持 Codex 的工具来做协议适配。
- DeepSeek 官方文档同时给出 OpenAI / Anthropic 兼容接口，DeepSeek-V4-Flash 中文价格页为输入 1 元 / 百万 tokens、输出 2 元 / 百万 tokens。
- Z.AI 官方文档显示 GLM-5.2 支持 1M 上下文、128K 最大输出，API 价格为输入 1.4 美元 / 百万 tokens、输出 4.4 美元 / 百万 tokens；GLM Coding Plan 是面向受支持编码工具的订阅包，不应当当成任意 SDK / 任意工具通用 API。
- 阿里云 Model Studio 文档已有 Coding Plan 入口；百炼文档显示千问模型支持 OpenAI 兼容 Chat 和 Responses 接口，Chat 兼容模型列表覆盖 Qwen-Coder、DeepSeek、GLM 等，Responses 兼容文档列出 qwen3-coder 等千问模型。用 Codex 接入时仍要核对所选模型是否支持 Responses，或是否需要工具层协议转换。

## 标题备选

1. 国内用户用 Codex 接国产模型，先把这三条底座跑通
2. Codex 接入 DeepSeek / GLM / 阿里云百炼：国内开发者上手路线
3. 先别急着优化 Agent，先让 Codex 跑上国产模型
4. 用国产模型跑 Codex：真正省下来的，是试错次数
5. Codex 接入国产模型后，开发者的成本账要重算了
6. 从 GPT 到 DeepSeek / GLM：编程 Agent 的下一道门槛是模型自由
7. 用 DeepSeek、GLM 和阿里云百炼跑 Codex，适合谁
8. 编程 Agent 成本账：什么时候用顶模，什么时候用国产模型
9. 国产模型跑 Codex：低成本迭代才是关键变量
10. Agent 进化论 04：先把模型底座换成可选择的

## 推荐标题

国内用户用 Codex 接国产模型，先把这三条底座跑通

## 导读

国内用户现在聊 Codex，第一步不该急着谈多 Agent、自我优化和复杂工作流。更现实的问题是：能不能先让 Codex 稳定用上 DeepSeek、GLM-5.2，或者阿里云百炼 / Model Studio 这类国内可访问的模型服务。这个底座跑通以后，后面才谈得上低成本试错、任务分层、自动化优化和个人编程 Agent 工作流。

## 正文

跑 Codex 最容易卡住国内用户的，往往不是某一次调用花了多少钱。

真正的问题是：你还没有一个稳定、可付费、可复用的模型底座。

一个中型项目的多文件修改，读仓库、找调用链、改代码、跑测试、修失败、再总结，几十万 tokens 很正常。只要模型按 API 计费，你每让它多试一次，账单都会动一下；如果账号、网络、支付、协议兼容还不稳定，你甚至很难把“多试几轮”变成日常动作。

结果就会变成一个奇怪的局面：明明 Agent 最适合反复迭代，你却先被模型入口卡住。

这就是“用国产模型跑 Codex”这个话题真正值得写的地方。

先把 DeepSeek、GLM-5.2、阿里云百炼或 Coding Plan 这类基础路线弄清楚，才有资格继续谈上层优化。

### 01

先把国产模型底座跑通

很多人理解 Codex，还停在“OpenAI 的编程助手”。

这个理解太窄了。

现在的 Codex CLI 更像一个本地工作流入口：它能读仓库、执行命令、改文件、跑测试、记录上下文，也能通过配置接到不同的模型服务。

OpenAI 官方文档里已经把自定义 model provider 写进了配置系统。你可以在用户级 `~/.codex/config.toml` 里定义 provider，设置模型、base URL、API key 来源和请求参数。Codex 还提供 `--oss` 模式，可连接 Ollama、LM Studio 这类本地服务。

对国内用户来说，这件事的意义很具体。

你可以不把所有编码任务都压在一个海外订阅上。至少有三条更现实的底座可以先验证：

- DeepSeek：适合低成本跑阅读、整理、单文件修改和初筛；
- GLM-5.2 / Z.AI：适合更长上下文、更复杂代码任务的国产能力层；
- 阿里云百炼 / Model Studio / Coding Plan：适合已经在阿里云体系里、有企业账号、账单和国内服务要求的团队。

这三条路线不一定都能“直接一键接 Codex”。真正要看的，是你能不能把 API Key、base URL、模型名、Responses 兼容或协议转换这一组基础件先跑通。

如果一个编程 Agent 只能使用单一模型，它的成本、能力和可用性都会被同一个供应商锁住。

如果底层模型可以替换，Codex 就开始接近一个“编程工作流引擎”：上层是任务、权限、文件、命令、验证；下层可以根据任务换不同模型。

普通开发者真正需要的，不是永远用最贵的模型。

真正需要的是分层：

- 小 bug、单文件生成、文档整理，用低成本模型先跑；
- 多文件重构、线上风险、复杂设计，用顶模兜底；
- 本地私有代码或离线场景，用本地模型试验；
- 需要稳定交付时，保留人工 review、测试和回滚。

这才是 Codex 接国产模型的核心价值：先让模型入口可选择，再谈工作流优化。

### 02

先纠正一个常见误解：Claude Code 也能接第三方

这篇文章不能写成“只有 Codex 开放，Claude Code 封闭”。

这个说法不准确。

Claude Code 可以通过 LLM gateway 或 Anthropic Messages 兼容接口接入第三方模型。DeepSeek 官方文档也明确给了 Anthropic API 兼容地址：`https://api.deepseek.com/anthropic`，并展示了 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY` 的配置方式。

所以，真正的差异不在“能不能接第三方”。

差异在三点。

第一，Codex 把 provider 配置放进官方配置系统，模型提供方、base URL、env key、headers 都是明确配置项。

第二，Codex 的 `--oss` 模式把本地 Ollama、LM Studio 这类路线放进官方文档，适合做低成本和隐私优先的本地实验。

第三，Codex 的工作方式天然围绕仓库、命令、补丁和验证，更容易把“换模型”变成一套工程策略，而不是一次临时绕路。

但这里有个重要坑：Codex 当前官方自定义 provider 的 `wire_api` 只支持 `responses`。DeepSeek、GLM 等国产模型虽然兼容 OpenAI SDK 或 Anthropic API，但很多时候兼容的是 Chat Completions 或 Messages，不一定等于 Codex 可直接调用。

这意味着，手动配置时不要只看 base URL。

你要确认三件事：

- 这个服务是否提供 Responses API 兼容层；
- 当前工具是否替你做了协议转换；
- 模型名、鉴权方式、流式输出、工具调用是否都能被 Codex 正常理解。

如果这三点没核清楚，配置看起来对，实际跑不起来。

### 03

成本账要重算，但不要夸大

原素材里最有吸引力的点，是“同样 100 元预算，国产模型能跑更多轮”。

这个方向成立，但数字要按最新官方口径重算。

按 2026-06-22 的公开价格，几个参考模型大概是这样：

| 模型 / 服务 | 输入价格 | 输出价格 | 备注 |
| --- | ---: | ---: | --- |
| gpt-5.3-codex | 1.75 美元 / 百万 tokens | 14 美元 / 百万 tokens | OpenAI 价格页 Codex 类模型 |
| GPT-5.5 | 5 美元 / 百万 tokens | 30 美元 / 百万 tokens | OpenAI 旗舰模型 |
| DeepSeek-V4-Flash | 1 元 / 百万 tokens | 2 元 / 百万 tokens | DeepSeek 中文价格页 |
| GLM-5.2 | 1.4 美元 / 百万 tokens | 4.4 美元 / 百万 tokens | Z.AI API 价格页 |

拿一次典型编程任务粗算：5 万输入 tokens，加 2 万输出 tokens。

| 引擎 | 单次成本粗算 |
| --- | ---: |
| gpt-5.3-codex | 约 0.3675 美元，按 7.2 汇率约 2.65 元 |
| GPT-5.5 | 约 0.85 美元，按 7.2 汇率约 6.12 元 |
| DeepSeek-V4-Flash | 约 0.09 元 |
| GLM-5.2 | 约 0.158 美元，按 7.2 汇率约 1.14 元 |

这组数字说明两件事。

第一，DeepSeek 这种低价模型确实能把试错成本打下来。按这个样例，100 元预算跑 gpt-5.3-codex 大约 37 次，跑 DeepSeek-V4-Flash 大约 1100 次。

第二，GLM-5.2 的优势不是极限低价。它更像“能力更强、上下文更长、价格仍低于顶模”的中间层。

所以，别把结论写成“国产模型一定便宜 100 倍”。

更稳的判断是：

如果你拿 DeepSeek-V4-Flash 做大量轻任务试错，成本差距可以非常大；

如果你拿 GLM-5.2 做复杂代码任务，重点是用更低价格换接近前沿模型的工程能力；

如果你用 ChatGPT Pro / Team / Enterprise 订阅内额度跑 Codex，边际成本感知会完全不同，这篇文章对你的价值会下降。

成本账不能只看价格表，还要看你的任务结构。

### 04

便宜模型最适合跑哪类 Codex 任务

把便宜模型接进 Codex 后，最容易犯的错，是一上来就让它做大型重构。

这会浪费时间。

更合理的方式，是把任务分层。

第一层：低风险重复任务。

比如 README 更新、注释补齐、脚本参数整理、单文件小修、日志分析、测试失败初筛。这类任务失败成本低，适合用 DeepSeek 这类低成本模型多跑。

第二层：探索和定位任务。

比如“先读这个模块，找出可能的调用链”“列出这次改动会影响哪些文件”“给我三种修法和风险”。这类任务不一定需要模型一次改对，重点是帮助你扩大搜索范围。

第三层：中等复杂度实现。

比如小功能、内部工具、非核心路径重构。可以用 GLM-5.2 这类更强的国产模型跑第一版，再让顶模或人工做 review。

第四层：生产关键改动。

涉及支付、权限、数据删除、线上配置、核心交易链路，仍然建议顶模加人工兜底。模型便宜不代表风险便宜。

真正好用的策略，不是“全换国产模型”。

更像一张分工表：

| 任务类型 | 推荐策略 |
| --- | --- |
| 单文件修复、文档、脚本 | 低成本模型直接跑 |
| 代码阅读、方案比较、影响面分析 | 低成本模型先探索 |
| 多文件但非核心改动 | GLM-5.2 / 强国产模型起稿，顶模复核 |
| 核心生产链路 | 顶模 + 测试 + 人工 review |
| 私有代码实验 | 本地模型或自建网关 |

这样用，省下来的不只是 token 费。

你省下的是“敢多试几轮”的空间。

### 05

三条底座，一条配置底线

第一条路线：DeepSeek 做低成本试错底座。

如果你最关心成本，DeepSeek 是最适合先试的一条线。

它的价值在于扩大低风险试错空间：阅读、搜索、整理、单文件修改、测试失败分析这类任务，可以先用它多跑几轮。

但接入时要先分清两件事。

DeepSeek 官方同时提供 OpenAI 兼容和 Anthropic 兼容接口；这对很多开发工具很友好。但 Codex 官方自定义 provider 当前看的是 Responses 兼容能力，Chat Completions 兼容不一定等于 Codex 能直接跑。

所以第一步不要上来就改大项目。先用一个小仓库，让 Codex 完成三件小事：读 README、改一处注释、跑一个测试命令。能稳定走完，再扩大任务。

第二条路线：GLM-5.2 或 Z.AI Coding Plan 做能力层。

GLM-5.2 更适合放在中间层：它不是极限低价路线，但上下文窗口、代码能力和 agentic workflow 方向都更适合复杂任务。

如果你使用 Z.AI 的 GLM Coding Plan，要注意它是面向受支持编码工具的订阅包。它适合高频编码用户，但不要默认所有工具、所有 SDK、所有代理层都能吃到这个权益。

对 Codex 用户来说，正确动作是：

- 先看 Codex 是否在当时支持范围内；
- 如果不在，确认能否通过 API、Responses 兼容 endpoint 或代理层接入；
- 用非核心仓库跑一次完整闭环：读仓、改文件、跑测试、输出总结。

只有这个闭环通了，GLM-5.2 才能从“听起来很强的模型”变成你的日常开发底座。

第三条路线：阿里云百炼 / Model Studio / Coding Plan 做国内云底座。

这条路线尤其适合国内团队。

阿里云 Model Studio 文档里已经有 Coding Plan 入口；百炼文档也明确提供 OpenAI 兼容接口。中文文档里，Chat 兼容模型列表覆盖 Qwen 大语言模型、Qwen-Coder、DeepSeek、GLM、Kimi 等；Responses 兼容文档则列出了 qwen3-coder、qwen3.7-plus 等千问模型，并给出 `https://dashscope.aliyuncs.com/compatible-mode/v1/responses` 这类服务地址。

这说明阿里云这条线很适合做国内模型底座，但写进 Codex 教程时要讲清楚边界：

- Chat Completions 兼容，适合很多 OpenAI SDK 迁移；
- Responses 兼容，才更贴近 Codex 当前自定义 provider 的要求；
- Coding Plan 是产品权益入口，具体能不能用于 Codex，要看当时支持工具、模型和调用方式。

如果你在国内已经有阿里云账号、企业账单、权限管理和合规要求，这条线值得优先验证。它的价值更接近“把模型调用放进你已经能管理的云服务体系里”，价格只是其中一个变量。

第四条路线：手动配置 Codex。

Codex 的官方配置方向大致是这样：

```toml
model = "your-model"
model_provider = "your-provider"

[model_providers.your-provider]
name = "Your Provider"
base_url = "https://your-responses-compatible-endpoint/v1"
env_key = "YOUR_PROVIDER_API_KEY"
```

这里最关键的一行其实是“responses-compatible”。`base_url` 只是入口，协议能不能对上才决定能不能跑。

如果你手上的 DeepSeek / GLM / Kimi 服务只提供 Chat Completions 或 Anthropic Messages 兼容接口，那就需要一个中间层把协议转成 Codex 当前能用的 Responses API 形态。阿里云百炼如果走 Responses 兼容接口，也要确认你使用的具体模型在 Responses 文档支持列表里。

这就是很多人“配置都填对了，Codex 还是报错”的原因。

### 06

这件事和 Human3.0 的关系：工具链主权

用国产模型跑 Codex，表面是技术折腾。

放到更大的工作系统里看，它其实是一个主权问题。

当你的编程工作流完全绑定一个模型，你会被三件事限制：

- 价格变化；
- 额度变化；
- 可访问性变化。

这不代表你要拒绝顶模。

顶模很重要，关键任务也应该用。但如果所有尝试都必须依赖同一个供应商，你就没有真正的选择权。

Human3.0 里反复强调的一个方向，是人要沉淀自己的数字生产资料。

对开发者来说，这些资料不只是代码仓库，还包括：

- 你的 `AGENTS.md`；
- 你的任务拆解模板；
- 你的测试命令；
- 你的 review 标准；
- 你的模型分工策略；
- 你的失败案例；
- 你的 provider 配置和成本记录。

当这些东西沉淀下来，模型只是可替换的执行引擎。

你真正拥有的是一套能迁移、能复用、能审查的开发工作系统。

这比“今天哪个模型最强”更重要。

### 07

我的建议：先做基础验收

不要一开始就把 Codex、Claude Code、Cline、本地模型、DeepSeek、GLM、阿里云百炼全部接上。

先做一个最小可用验收清单。

第一步，只选一条国产底座。

DeepSeek、GLM-5.2、阿里云百炼 / Model Studio，先选一个。不要三条一起配。你需要先知道一条路线能不能稳定跑通，而不是同时排查三个变量。

第二步，只跑三个小任务。

让 Codex 读 README，总结项目结构；改一处注释或文档；跑一个不会破坏数据的测试命令。三件事都通过，才说明配置、鉴权、流式输出、模型响应和命令执行大体可用。

第三步，记录一次真实账本。

记录模型、入口、任务类型、耗时、token 或额度消耗、是否一次成功、失败原因。没有这张表，你很难判断 DeepSeek、GLM-5.2、阿里云 Coding Plan 到底适合你哪类任务。

第四步，再做两模型工作流。

用低成本模型做探索。

让它读仓库、找文件、画调用链、列风险、提出修法。这个阶段不要直接让它改核心代码。

用强模型或人工做决策。

从它给出的方案里选一条，删掉不可靠的部分，补清楚边界。

再让模型执行小范围修改。

每次只改一个目标，改完必须跑测试或至少跑静态检查。

最后把结果记录下来。

记录这次用了哪个模型、任务类型是什么、花了多少 tokens、成功点和失败点在哪里。跑十次以后，你就会知道哪些任务适合国产模型，哪些任务必须顶模兜底。

这个过程很朴素，但它会变成你的个人编程 Agent 策略。基础底座不稳定，后面的 prompt 优化、子 Agent 拆分、自动测试循环都会变成空转。

别把“哪个模型强”交给别人替你下结论。用自己的任务跑出真实账本，才知道该怎么分工。

### 08

最后的判断

用国产模型跑 Codex，最适合三类国内用户。

第一类，是高频试错的个人开发者。

你每天要让 Agent 读仓库、改脚本、修页面、整理文档。低成本模型可以让你多跑很多轮。

第二类，是正在搭个人工作流的人。

你关心的不只是一次输出，而是把 AI 编程变成固定流程：读仓、计划、修改、测试、复盘。

第三类，是对工具链可控性敏感的人。

你不希望自己的开发能力完全押在一个订阅、一个模型、一个供应商上。

但它不适合所有场景。

如果你只是偶尔用 Codex，ChatGPT 订阅额度已经够用，没必要为了省几块钱折腾 provider。

如果你做的是生产关键代码，不能因为模型便宜就降低 review 和测试标准。

如果你还没搞清楚协议兼容，先别把手动配置当主路线，用小任务验证更稳。

这篇文章的核心结论很简单：

对国内用户来说，先别急着追 Agent 优化。

先把 DeepSeek、GLM-5.2、阿里云百炼 / Coding Plan 这些可访问、可付费、可管理的模型底座跑通。

当模型入口稳定下来，低成本试错、任务分层和个人编程 Agent 工作流才真正有意义。

## 结尾互动

如果你已经用 DeepSeek、GLM、阿里云百炼、Kimi 或本地模型跑过 Codex / Claude Code / Cline，欢迎在评论区留三类信息：

- 你跑的是什么任务；
- 成功率和顶模差距多大；
- 最后省下的是钱、时间，还是试错次数。

我后面可以把读者样例整理成一张“国内编程 Agent 模型底座验收表”。

## 朋友圈转发文案

国内用户聊 Codex 接国产模型，第一步别急着谈复杂优化。先把 DeepSeek、GLM-5.2、阿里云百炼 / Coding Plan 这类模型底座跑通：API Key、base URL、模型名、Responses 兼容、小任务闭环。底座稳定了，后面才谈得上低成本试错和个人编程 Agent 工作流。

## 配图建议

1. 首图：国内用户 Codex 国产模型三底座图。左侧 DeepSeek，右侧 GLM-5.2，中间阿里云百炼 / Model Studio，下方统一接到 Codex 工作流。
2. 正文图 1：基础验收清单，API Key、base URL、模型名、Responses 兼容、小任务闭环、成本记录。
3. 正文图 2：任务分层决策表，低风险探索、非核心实现、核心生产链路分别对应不同模型策略。
4. 结尾图：个人编程 Agent 资产清单，包括 AGENTS.md、测试命令、review 标准、模型分工、失败案例。

## 出刊检查

## 发布结论

- 建议：补齐封面后可发布
- 阻塞项：缺公众号封面；若正文要保留具体价格，发布前建议再打开官方价格页复核一次

## 必补项

- [ ] 选择最终标题
- [ ] 生成或制作公众号封面
- [ ] 发布前复核 OpenAI / DeepSeek / Z.AI / 阿里云百炼四类官方页

## 建议优化

- 价格表发布时可保留“截至 2026-06-22”提示，降低过期风险。
- 如果要做搜索流量，标题优先使用“Codex 国产模型 DeepSeek GLM 阿里云百炼”这组关键词。
- 正文不建议继续堆工具名，重点保留“国内用户先跑通模型底座”和“协议兼容边界”。

## 平台发布包

- 标题：国内用户用 Codex 接国产模型，先把这三条底座跑通
- 搜索友好标题：Codex 接入 DeepSeek / GLM / 阿里云百炼：国内用户上手路线
- 朋友圈传播标题：先别急着优化 Agent，先让 Codex 跑上国产模型
- 摘要/导语：国内用户用 Codex 接国产模型，第一步先跑通 DeepSeek、GLM-5.2、阿里云百炼 / Coding Plan 这类可访问、可付费、可管理的模型底座，再谈复杂优化。
- 搜一搜摘要：本文梳理国内用户用 Codex 接入 DeepSeek、GLM-5.2、阿里云百炼 / Model Studio / Coding Plan 的基础路线、协议兼容边界、配置验证清单和任务分层策略。
- 核心关键词：Codex，国产模型，DeepSeek，GLM-5.2，阿里云百炼，Coding Plan，编程 Agent
- 正文关键词补强建议：开头 150 字内已出现 Codex、国产模型、国内用户、DeepSeek、GLM-5.2、阿里云百炼；小标题中已覆盖 Claude Code、配置、Human3.0。
- 标签/话题：#Codex #DeepSeek #GLM #阿里云百炼 #编程Agent #AI工具 #Human3
- 转发文案：国内用户想用 Codex 接国产模型，先别急着谈复杂优化。DeepSeek、GLM-5.2、阿里云百炼 / Coding Plan 这三类底座先跑通，后面才谈得上低成本试错和个人编程 Agent 工作流。
- 评论区引导：你现在最想先跑通哪条 Codex 国产模型底座？DeepSeek、GLM-5.2，还是阿里云百炼 / Coding Plan？

## 资料来源

- OpenAI Codex 配置参考：`https://developers.openai.com/codex/config-reference`
- OpenAI Codex Advanced Configuration：`https://developers.openai.com/codex/config-advanced`
- OpenAI API Pricing：`https://developers.openai.com/api/docs/pricing`
- OpenAI Codex GitHub README：`https://github.com/openai/codex`
- DeepSeek API Pricing 中文页：`https://api-docs.deepseek.com/zh-cn/quick_start/pricing`
- DeepSeek Anthropic API 文档：`https://api-docs.deepseek.com/guides/anthropic_api`
- Z.AI Pricing：`https://docs.z.ai/guides/overview/pricing`
- Z.AI GLM-5.2 文档：`https://docs.z.ai/guides/llm/glm-5.2`
- Z.AI GLM Coding Plan Overview：`https://docs.z.ai/devpack/overview`
- 阿里云 Model Studio Coding Plan：`https://www.alibabacloud.com/help/en/model-studio/coding-plan-guide/`
- 阿里云百炼 OpenAI Chat 兼容：`https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope`
- 阿里云百炼 OpenAI Responses 兼容：`https://help.aliyun.com/zh/model-studio/compatibility-with-openai-responses-api`
- Claude Code LLM Gateway 配置：`https://code.claude.com/docs/en/llm-gateway`
- CC Switch GitHub：`https://github.com/farion1231/cc-switch`

## 归档建议

- 是否建议进入 Human3.0 成书审查：建议
- 建议沉淀为：Human3.0 Part 3「结构杠杆」或 Agent 进化论系列案例
- 素材价值：这篇不是单个工具教程，更适合作为“模型选择权 / 工具链主权 / 个人编程 Agent 工作流”的案例
- 已确认的用户决策：默认归档（除非用户明确撤销）

## content_state

```yaml
content_state:
  request:
    raw_intent: "启用文昌总控，根据 content/codex使用国产大模型/Agent 进化论系列 - 用国产模型跑 Codex 选题与大纲.md 写微信公众号"
    current_stage: "出刊"
    target_platforms: ["微信公众号"]
  topic:
    series: "Agent 进化论系列 第 04 篇"
    title: "国内用户用 Codex 接国产模型，先把这三条底座跑通"
    core_claim: "国内用户用 Codex 接国产模型，第一步是跑通 DeepSeek、GLM-5.2、阿里云百炼 / Coding Plan 这类可访问、可付费、可管理的模型底座，再谈低成本试错和上层优化。"
    audience: ["国内 AI 实践者", "开发者", "编程 Agent 用户", "Human3.0 读者"]
  research:
    confidence: "Medium"
    sources:
      - "OpenAI Codex config-reference"
      - "OpenAI Codex config-advanced"
      - "OpenAI API pricing"
      - "DeepSeek API pricing"
      - "DeepSeek Anthropic API"
      - "Z.AI pricing"
      - "Z.AI GLM-5.2"
      - "Z.AI GLM Coding Plan"
      - "Alibaba Cloud Model Studio Coding Plan"
      - "Alibaba Cloud Model Studio OpenAI Chat compatibility"
      - "Alibaba Cloud Model Studio OpenAI Responses compatibility"
      - "Claude Code LLM Gateway"
      - "CC Switch GitHub"
    key_facts:
      - "Codex user-level config supports model_providers and model_provider."
      - "Codex custom provider wire_api currently supports responses only."
      - "DeepSeek provides OpenAI and Anthropic compatible endpoints."
      - "DeepSeek-V4-Flash Chinese pricing is input 1 yuan / MTok and output 2 yuan / MTok."
      - "Z.AI GLM-5.2 supports 1M context and 128K maximum output."
      - "Z.AI GLM-5.2 API pricing is input 1.4 USD / MTok and output 4.4 USD / MTok."
      - "GLM Coding Plan is limited to officially supported tools and scenarios."
      - "Alibaba Cloud Model Studio has a Coding Plan documentation entry."
      - "Alibaba Cloud Bailian supports OpenAI-compatible Chat APIs and documents Qwen-Coder, DeepSeek, GLM and other model families for Chat compatibility."
      - "Alibaba Cloud Bailian documents OpenAI-compatible Responses API for Qwen models including qwen3-coder variants."
    contrarian_points:
      - "Codex cannot necessarily call every OpenAI-compatible Chat Completions endpoint directly."
      - "ChatGPT subscription users may not feel API marginal cost in the same way."
      - "Low-cost models are not suitable as the only layer for production-critical code changes."
      - "Third-party provider tools must be validated against the current version before recommending as one-click stable."
      - "Alibaba Cloud Coding Plan should not be described as a confirmed Codex-specific unlimited plan without checking the current supported tools and model routing."
    contradictions:
      - "原素材中的 GPT-5-Codex 价格口径与当前 OpenAI 价格页不一致，已改为 gpt-5.3-codex。"
      - "原素材强调 Codex 直接配置 DeepSeek，但官方 Codex 文档当前只支持 responses wire_api，正文已加入协议适配边界。"
  publish_assets:
    title: "国内用户用 Codex 接国产模型，先把这三条底座跑通"
    search_title: "Codex 接入 DeepSeek / GLM / 阿里云百炼：国内用户上手路线"
    social_title: "先别急着优化 Agent，先让 Codex 跑上国产模型"
    summary: "国内用户用 Codex 接国产模型，第一步先跑通 DeepSeek、GLM-5.2、阿里云百炼 / Coding Plan 这类可访问、可付费、可管理的模型底座，再谈复杂优化。"
    search_summary: "本文梳理国内用户用 Codex 接入 DeepSeek、GLM-5.2、阿里云百炼 / Model Studio / Coding Plan 的基础路线、协议兼容边界、配置验证清单和任务分层策略。"
    search_keywords: ["Codex", "国产模型", "DeepSeek", "GLM-5.2", "阿里云百炼", "Coding Plan", "编程 Agent"]
    body_keyword_notes:
      - "开头 150 字内自然出现 Codex、国产模型、国内用户、DeepSeek、GLM-5.2、阿里云百炼。"
      - "正文小标题覆盖 Claude Code、DeepSeek、GLM、阿里云百炼、配置、Human3.0。"
    cover_text: "先让 Codex 跑上国产模型"
    tags: ["Codex", "DeepSeek", "GLM", "阿里云百炼", "编程Agent", "AI工具", "Human3"]
    images:
      - "国内用户 Codex 国产模型三底座图"
      - "基础验收清单"
      - "任务分层决策表"
      - "个人编程 Agent 资产清单"
    share_copy: "国内用户想用 Codex 接国产模型，先别急着谈复杂优化。DeepSeek、GLM-5.2、阿里云百炼 / Coding Plan 这三类底座先跑通，后面才谈得上低成本试错和个人编程 Agent 工作流。"
    comment_prompt: "你现在最想先跑通哪条 Codex 国产模型底座？DeepSeek、GLM-5.2，还是阿里云百炼 / Coding Plan？"
  distribution:
    primary_platform: "微信公众号"
    secondary_platforms: []
    card_skill: null
    image_skill: null
  archive:
    should_review_for_book: true
    material_type: "Agent 进化论系列案例 / 工具链主权案例"
    suggested_bucket: "Human3.0 / 结构杠杆 / 数字生产资料"
  decisions:
    - stage: "归档"
      question: "是否进入 Human3.0 成书审查 / 素材库"
      user_choice: "默认归档（用户未撤销）"
      timestamp: "2026-06-22"
      impact: "后续可沉淀为模型选择权、工具链主权和个人编程 Agent 工作流案例"
  next_step:
    skill: "人工确认"
    reason: "正文和出刊包已完成，仍需确认最终标题、封面和是否继续生成配图"
    user_decision_needed: true
  handoff:
    from_stage: "出刊"
    to_stage: "配图/卡片/上传"
    accepted_inputs:
      - "原始选题与大纲文件"
      - "官方采证资料"
      - "公众号写作与出刊规则"
    ignored_context:
      - "未核验的旧价格口径"
      - "未确认稳定可用的第三方工具承诺"
    stop_condition: "需要用户确认最终标题和公众号封面方向；不自动生成图片或上传外部服务"
```
