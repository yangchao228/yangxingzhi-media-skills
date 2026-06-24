# Agent 进化论系列 \- 用国产模型跑 Codex 选题与大纲

# 用国产模型跑 Codex，成本到底能省多少？

> **归属：** Agent 进化论系列 第 04 篇
**核心观点：** Codex CLI 的开放架构让它能从"单一模型工具"升级为"可编程工作流引擎"。接入 DeepSeek 或 GLM 5\.2，同等预算下迭代次数翻百。

---

## 01 引子：我的 Codex 额度焦虑

跑一次大型 refactoring，Codex 的消耗是肉眼可见的。

ChatGPT Pro 用户每月 $200，额度内随便用。但如果你的任务量超出订阅额度，或者你选择走 API 计费——

GPT\-5\-Codex API 定价：**输入 **$1.25/百万 token，输出 $**10\.00/百万 token。**

一个中型项目的多文件重构，轻松吃掉 10\-20 万 token。按这个价格算，单次成本约 13\-26 元。一天跑 5\-10 次，月账单轻松过千。

**但如果同一个 Codex，同样的工作流，换国产模型做引擎呢？**

答案可能比你想象的更激进。

---

## 02 先纠正一个误解：Claude Code 也能接第三方模型

很多人以为只有 Codex 能接第三方，Claude Code 只能调 Claude。

**这不是事实。**

Claude Code 支持通过 `ANTHROPIC_BASE_URL` 环境变量，指向任意 Anthropic 兼容的 API 端点。DeepSeek 官方文档专门有一个"接入 Claude Code"页面，提供 `https://api.deepseek.com/anthropic` 兼容接口，填 Key 就能用。GLM 5\.2 同样提供 `/api/anthropic` 端点。

**那 Codex CLI 的独特性在哪？**

两个层面：

**第一，协议开放度。** Claude Code 只能对接 Anthropic 兼容协议的模型。Codex CLI 除了 OpenAI 兼容协议，还通过 `--oss` 标志原生支持 Ollama、LM Studio、MLX 等本地推理服务——不需要对方提供任何兼容层。

- Ollama 在 2026 年 1 月发布了官方集成博文，演示了 `codex --oss -m deepseek-r1:70b`

- GitHub Discussion \#924 上开发者验证了 Codex 可以直接调 Gemini 2\.5 Pro

- Reddit r/LocalLLaMA 上有人跑通了 `codex --oss -m qwen2.5-coder:32b`

**第二，官方态度。** Claude Code 允许自定义 base\_url，但 Anthropic 从不宣传。Codex CLI 把 provider profile 系统写进了官方文档。

简单说：

- Claude Code 接第三方：能接，但需要对方提供 Anthropic 兼容端点

- Codex CLI 接第三方：能接，而且不需要对方做任何适配——你自己配 profile 就行

**对于这篇文章的主题——用国产模型降低编程 Agent 成本——两者都能实现。** 但如果你想要"任何模型都能跑"的自由度，Codex CLI 的天花板更高。

---

## 03 三条路线，选哪种？

|方案|难度|适合谁|核心工具|
|---|---|---|---|
|CC\-Switch|⭐ 最低|有桌面、喜欢 GUI 管理|farion1231/cc\-switch（GitHub 102K\+ stars）|
|Codex\+\+|⭐⭐ 中|CLI 用户、服务器部署|Codex\+\+（内置 DeepSeek/GLM/Kimi 预设）|
|手动配置|⭐⭐ 中|技术能力强|修改 `~/.codex/config.toml`|

**CC\-Switch** 是目前最流行的方案。开源桌面应用，一键管理 Claude Code、Codex、Gemini CLI 等六大编程 CLI 的 provider 配置。新版 v3\.16\.0 起正式支持 Codex 桌面端的第三方模型接入。

**Codex\+\+** 更轻量，内置预设填 Key 即用，适合习惯命令行的人。

---

## 04 成本对比：省下来的不是零花钱

先看 API 按量定价（每百万 token）：

|模型|输入价格|输出价格|来源|
|---|---|---|---|
|GPT\-5\-Codex API|$1\.25|$10\.00|OpenAI 官方|
|GPT\-5\.5 API|$0\.875|$7\.00|OpenAI 官方|
|DeepSeek\-V4\-Flash|0\.14 元|0\.28 元|DeepSeek 官方|
|GLM 5\.2（按量预估）|$1\.4|$4\.4|第三方聚合渠道|
|GLM 5\.2（订阅制）|—|—|$3\-10/月，每周 400\-2000 次 prompt|

以一次典型编程任务（5 万输入 token \+ 2 万输出 token）为例：

|引擎|输入成本|输出成本|合计|
|---|---|---|---|
|GPT\-5\-Codex API|0\.44 元|1\.43 元|**1\.87 元**|
|DeepSeek\-V4\-Flash|0\.01 元|0\.01 元|**0\.02 元**|
|GLM 5\.2（按量预估）|0\.50 元|1\.26 元|**1\.76 元**|

**关键数据：**

- 同样 100 元预算，GPT\-5\-Codex API 能跑约 **53 次**，DeepSeek 能跑约 **5000 次**

- 如果你用的是 ChatGPT Pro 订阅（$200/月），额度内边际成本为零，那本文对你意义不大

- 但如果你经常超出额度、或者没有海外订阅账号——**国产模型的成本优势是 90\-99x**

> **信息源：** OpenAI 定价页、DeepSeek API 定价页、GLM Coding Plan 订阅价（z\.ai）

---

## 05 质量实测：便宜有没有代价？

**DeepSeek\-V4\-Flash：**

- 简单任务（单文件生成、Bug 修复）：差距极小

- 多文件重构：能力明显弱于 GPT\-5\-Codex

- 复杂 prompt 理解：偶尔跑偏，需要更精确的指令

**GLM 5\.2**（2026 年 6 月 13 日发布，仅 5 天）：

- ProgramBench：63\.7 分（GPT\-5\.5 是 70\.8，Claude Opus 4\.8 是 71\.9）

- Terminal Bench 2\.1：**82\.7 分**（GPT\-5\.5 是 83\.4，差距仅 0\.7）

- 1M token 上下文窗口

- 架构：MoE，744B 总参 / 40B 激活

**GLM 5\.2 的编程能力已经接近顶模水平。** 这是它和 DeepSeek\-V4\-Flash 最大的区别——后者定位是"够用就行"，GLM 5\.2 定位是"能打的国产替代"。

但这里要诚实给出结论：

**成本优势的真正意义是什么？**

它意味着你可以用 DeepSeek 跑 5000 次迭代，而 GPT\-5\-Codex API 只够跑 53 次。即使单次成功率低 20%，5000 次尝试的总成功率也远高于 53 次。

**对于学习、探索、原型开发，这个 trade\-off 极其划算。**

**对于生产环境的核心代码修改，还是建议用顶模兜底。**

---

## 06 实操：接入国产模型

### 方案一：CC\-Switch（推荐新手）

1. 安装 CC\-Switch：`brew install cc-switch` 或从 GitHub 下载

2. 打开 CC\-Switch，选择 Codex 作为目标 CLI

3. 填入 DeepSeek API Key（https://platform\.deepseek\.com 获取）

4. 选择内置的 DeepSeek 预设，保存

5. 打开 Codex，确认模型已切换

### 方案二：Codex\+\+（推荐 CLI 用户）

1. 安装 Codex\+\+（按项目 README）

2. 运行配置命令，填入 Base URL 和 API Key

3. DeepSeek 的 Base URL：`https://api.deepseek.com`

4. GLM 5\.2 的 Base URL：`https://api.z.ai/api/coding/paas/v4`（API 开放后）

5. 选择对应模型名，启动 Codex

### 方案三：手动配置 config\.toml

```
[profile.deepseek]
model = "deepseek-chat"
openai_base_url = "https://api.deepseek.com/v1"
```

> **注意：** Codex 默认使用 Responses API，而 DeepSeek 提供的是 Chat Completions API。如果你的代理层没有做协议翻译，直接配置可能无法运行。CC\-Switch 和 Codex\+\+ 都内置了协议转换层。

---

## 07 一个更大的背景

2026 年 6 月，有两件事同时发生：

**第一，Anthropic 因出口管制指令撤下了 Claude Fable 5 的公共访问。** 一夜之间，大量依赖 Claude 的海外开发者发现模型不可用了。

**第二，智谱在第二天发布了 GLM 5\.2，宣布 MIT 开源权重。** 智谱团队负责人唐杰在 X 上写：「前沿智能不应只属于少数人。」这条推文 36 小时内约 89\.8 万次浏览，登上 Hacker News 首页。

**开源权重 \+ 国产 API 的意义，不只是省钱。它是"不被断供"的保险。**

对于国内开发者来说，用 GLM 5\.2 跑 Codex，成本降低只是表象。更深层的价值是：

**你的工具链不再受制于任何单一公司的政策变化。**

---

## 08 观点：模型自由 = 编程 Agent 的下一道分水岭

Claude Code 和 Gemini CLI 体验好，但模型锁定 = 价格锁定 = 政策锁定。

Codex CLI 的开放架构让它从一个"OpenAI 模型的入口"，变成了"可编程的工作流引擎"。

2026 年的编程 Agent 竞争，核心不是谁更聪明——

**而是谁能让你用最低成本、完成最多迭代、同时不被任何单一厂商绑定。**

DeepSeek 是成本最优解。GLM 5\.2 是能力最接近顶模的国产替代。

**选哪个不重要。重要的是——你有选择权了。**

---

## 09 你的下一步

- 如果你还没用过 Codex → 先去装

- 如果你已用但嫌贵 → 接入 DeepSeek 或 GLM 5\.2 试一次

- 如果你已经在用国产模型 → 跑个对比测试，欢迎在评论区分享数据

---

*本文信息源：OpenAI Codex 官方文档、DeepSeek API 定价页（api\-docs\.deepseek\.com）、智谱 GLM 5\.2 官方发布（z\.ai）、Ollama 官方集成博文（ollama\.com/blog/codex）、CC\-Switch GitHub 仓库（farion1231/cc\-switch）、Codex\+\+ 项目文档、pricepertoken\.com 定价数据。所有价格数据截至 2026 年 6 月。*

---

## 审稿修正记录

### 2026\-06\-18 修正 \#1：Claude Code 第三方模型能力

**问题：** 原文称"唯一开放 provider 层"的结论不成立。
**修正：** 补充 Claude Code 通过 `ANTHROPIC_BASE_URL` 接入第三方的能力，并明确区分两者的协议开放度差异。

### 2026\-06\-18 修正 \#2：定价数据错误

**问题：** GPT\-5\-Codex 定价写成了 $5/$30，实际为 $1.25/$10\.00。
**修正：** 全部成本数据重新计算，区分"API 按量定价"和"订阅制额度"两种计费模式。

