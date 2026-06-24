# Headless 电商 x Agent 商业化公众号专题规划

## 当前判断

这组素材适合放进「Agent 商业化」系列，定位成一组可执行专题：

**Agent 商业化第一站：先跑通一条真实交易闭环。**

它不应该写成 headless 电商科普，也不应该写成 v0 / Cursor / Shopify 工具测评。更稳的写法是：让读者用一个周末完成一次「商品 -> 页面 -> 加购 -> 结账 -> 上线验证」的最小商业化实验。

两篇素材分工如下：

- 《2分钟500单》：负责认知入口，解释为什么电商是 Agent 商业化的好切口。
- 《Headless 电商实战》：负责实操主文，交付保姆级路径、清单、提示词和验收标准。

## 专题名称备选

1. Agent 商业化第一站：一个人搭一家 AI 电商店
2. 一个人的 Agent-ready 电商实验
3. 用 AI 跑通第一条交易闭环
4. 从想法到收款：AI 时代的个人电商实验
5. Headless 电商实战：给 Agent 商业化找一个真实入口

推荐专题名：

**Agent 商业化第一站：一个人搭一家 AI 电商店**

理由：能接住「Agent 商业化」主系列，又足够具体。读者一眼能看出这是一篇实操文，不是泛谈趋势。

## 系列结构

### 01 认知入口文

工作标题：

**2分钟500单：下一个开电商店的人，可能不是人**

功能：

- 用 superbape 案例制造入口。
- 解释 headless 架构为什么适合 Agent。
- 把读者从「AI 写代码」带到「AI 帮人跑交易闭环」。

改稿重点：

- 保留案例冲击力。
- 压缩 WordPress 类比，避免解释过长。
- 强化「Agent 商业化」主线：先找到可交易、可验证、可复盘的场景，再讨论更复杂的万能 Agent。
- 文末直接引到下一篇实操：「下一篇我会按步骤搭一遍，一个周末跑通最小电商闭环。」

### 02 核心实操文

工作标题：

**一个人用 AI 搭一家电商站：从 0 到上线的保姆级实操**

功能：

- 这是专题关键文章。
- 目标是让读者照着做完，不停留在理解概念。
- 最终交付一个可访问的 demo storefront，至少跑通商品展示、加购、跳转结账。

建议作为主推文发布，篇幅可放到 4500-6500 字。

### 03 Agent-ready 进阶文

工作标题：

**电商站搭完以后，怎么让它准备好接待 AI 买家**

功能：

- 把第二篇做出来的网站升级成 Agent-ready 资产。
- 重点讲商品结构化、库存状态、购物车、checkoutUrl、订单状态、日志和人工确认。
- 让读者理解：网站页面服务人，接口结构服务 Agent。

可写成短一些的技术方法文，2500-3500 字。

### 04 国内适配文

工作标题：

**不用 Shopify，在微信生态怎么跑通 Agent-ready 电商**

功能：

- 讨论有赞开放平台、微信小店、小程序、公众号导流、微信支付闭环。
- 不承诺国内 API 成熟度。
- 输出一条务实路线：先用 Shopify 学方法，再评估国内替代。

这篇适合后发。需要单独核官方文档，避免用旧印象写微信小店接口能力。

## 核心实操文定位

### 读者对象

- 有个人 IP、课程、咨询、数字产品或实体小商品的人。
- 会用 AI 编程工具，但没有完整商业化闭环的人。
- 想做 Agent 应用，但还停在 demo 和聊天框的人。
- 工程师、创作者、独立开发者。

### 读者读完应该拿走什么

1. 一条最小电商闭环：商品、页面、购物车、结账、部署。
2. 一套工具链：Shopify Storefront API + v0 + Cursor + Vercel。
3. 三类提示词：v0 页面生成、Cursor API 接入、错误排查。
4. 一个验收表：每一步做到什么才算完成。
5. 一个 Agent 商业化判断：先做能收款的窄场景，再谈更复杂的 Agent。

### 核心观点

Agent 商业化不要从「做一个全能 Agent」开始。更稳的起点，是选择一条已经有 API、商品、库存、支付和履约的交易链路，把 AI 工具放进去，先让一个人跑通最小收款闭环。

## 核心实操文大纲

### 开头：这篇文章只交付一件事

第一屏不要泛讲趋势，直接承诺交付：

> 这篇文章的目标很简单：不用团队，不从零写后端，用一个周末搭出一个能展示商品、加入购物车、跳转结账的 headless 电商站。

随后补一句和系列的关系：

> 如果你正在研究 Agent 商业化，先别急着做通用 Agent。先让一个商品被看见、被加购、被结算，这就是最小商业闭环。

### 01 先定边界：这次做什么，不做什么

做：

- 3-5 个测试商品。
- 首页商品列表。
- 商品详情页。
- 购物车。
- Shopify checkout 跳转。
- Vercel 预览/生产部署。

不做：

- 复杂会员系统。
- 多仓库存。
- 优惠券体系。
- 自动发货。
- Agent 自动支付。
- 国内支付适配。

这段很关键。保姆级文章最容易失控，必须先把范围压住。

### 02 工具链总览

建议用一张表：

| 模块 | 工具 | 负责什么 | 本文验收标准 |
| --- | --- | --- | --- |
| 商品/库存/结账 | Shopify | 商品、库存、购物车、结账 | API 能返回商品，cart 能生成 checkoutUrl |
| 页面生成 | v0 | 首页、商品页、购物车 UI | 三个页面组件可运行 |
| 业务逻辑 | Cursor | 接入 Storefront API、状态和错误处理 | mock 数据替换成真实 API |
| 部署 | Vercel | 托管 Next.js 项目 | 外网可访问，环境变量生效 |

### 03 准备清单：开始前先凑齐这些东西

账号：

- Shopify Partner / Shopify store。
- v0。
- Cursor。
- GitHub。
- Vercel。

素材：

- 3-5 个商品。
- 每个商品至少一张图。
- 商品标题、价格、描述。
- 品牌名。
- 一个简单风格词，比如 minimal / streetwear / clean / bold。

技术准备：

- Node.js。
- 一个 Next.js 项目。
- 一个 GitHub 仓库。
- Storefront API 访问方式。

提醒：

- 正式发文不要把 token、店铺后台截图、真实订单信息暴露出来。
- Shopify Storefront API 当前官方文档显示最新稳定版本为 `2026-04`，素材里的 `2024-01` 需要更新。
- 当前 Storefront API 文档里，Cart 的 `checkoutUrl` 用于把买家带到 Shopify web checkout；文章里不要继续把它写成独立的「Checkout API」。

### 04 第一步：把 Shopify 后端跑起来

文章里要按「动作 -> 结果 -> 验收」写：

1. 创建店铺。
2. 添加测试商品。
3. 开启 Storefront API 访问。
4. 配置权限。
5. 用 cURL 或 GraphiQL 跑一次商品查询。

验收标准：

- 能拿到商品 `id`、`title`、`description`、`images`、`variants`。
- 能确认 variant id 后续可用于购物车。

注意：

- Storefront API 是 GraphQL API。
- 公开前端场景应区分 public access token、private access token 和 tokenless 能力。
- 如果用服务端封装 API，不要把私密 token 暴露到浏览器。

### 05 第二步：让 v0 生成三个页面

三个页面分开生成：

1. 首页：导航、hero、商品网格。
2. 商品详情页：图片、标题、价格、描述、variant、加购按钮。
3. 购物车页：商品行、数量调整、小计、结账按钮、空状态。

文章里要给可复制提示词。

保姆级写法：

- 每个提示词前说清楚「这一步要生成什么」。
- 提示词后写「生成后检查什么」。
- 明确 v0 生成的代码通常还需要放进真实项目里整合。

### 06 第三步：用 Cursor 接入 Shopify Storefront API

建议按模块推进：

1. 建 `lib/shopify.ts`。
2. 封装 `shopifyFetch`。
3. 写 `getProducts`。
4. 写 `getProduct`。
5. 写 `createCart`。
6. 写 `addToCart` 或直接 `cartCreate` 初始化商品行。
7. 用 `checkoutUrl` 跳转结账。

每一步都写验收：

- 首页商品不再是 mock 数据。
- 商品详情页能显示真实 variant。
- 点击加购后能创建 cart。
- 结账按钮能跳到 Shopify checkout。

### 07 第四步：部署到 Vercel

写清楚：

1. 推到 GitHub。
2. Vercel 导入仓库。
3. 配置环境变量。
4. 部署。
5. 重新部署后验证。

重点提醒：

- Vercel 环境变量是代码外部的 key-value 配置；改动不会影响旧部署，需要新部署才生效。
- 本地开发变量放在 `.env.local`，不要提交到 Git。
- 如果线上读取不到 token，优先检查变量名、环境、重新部署。

### 08 常见坑：按错误现象写

不要写成泛泛注意事项，按读者会遇到的现象组织：

| 现象 | 可能原因 | 处理方式 |
| --- | --- | --- |
| 本地能跑，线上商品空白 | Vercel 环境变量没配或没重新部署 | 补变量后 redeploy |
| API 返回权限错误 | Storefront API 权限缺失 | 回 Shopify 后台检查权限 |
| 加购失败 | variant id 用错 | 商品查询里先取 variant id |
| 购物车能创建但不能结账 | 没取 `checkoutUrl` 或 cart 状态不完整 | 检查 cartCreate 返回字段 |
| v0 组件跑不起来 | 缺依赖或项目结构不同 | 先初始化 Next.js，再迁移组件 |

### 09 Agent 商业化验收表

这篇文章最后要落回 Agent 商业化，不要只停在建站。

验收表：

- 商品是否结构化：标题、价格、描述、图片、variant、库存状态。
- 是否有稳定 API：商品查询、购物车创建、结账跳转。
- 是否能被程序调用：不用模拟点击，也能完成商品读取和加购。
- 是否有人工确认点：付款、真实订单、发货不要自动放权。
- 是否有日志：API 请求、错误、订单状态、人工修改记录。
- 是否可复用：这次的项目结构、提示词、错误排查能不能下次复用。

结尾判断：

> 你最后得到的是一条可以反复改造的交易链路。Agent 商业化要落地，第一步就是把交易链路变成可调用、可检查、可复盘的系统。

## 标题候选

1. 一个人用 AI 搭一家电商站：从 0 到上线的保姆级实操
2. Agent 商业化第一站：用 AI 跑通一个电商闭环
3. 别只做 Agent Demo，先让 AI 帮你卖出一件东西
4. Headless 电商实战：一个人、一个周末、一个可收款页面
5. 用 v0 + Cursor + Shopify + Vercel 搭一家 AI 电商店
6. AI 时代的个人电商实验：从商品到结账全流程
7. 我建议想做 Agent 商业化的人，先搭一个电商站
8. 从聊天框到收款页：Agent 商业化的第一条路

推荐标题：

**Agent 商业化第一站：用 AI 跑通一个电商闭环**

备选主标题：

**一个人用 AI 搭一家电商站：从 0 到上线的保姆级实操**

建议公众号显示：

主标题用第二个，更直接；导读和封面强调 Agent 商业化。

## 封面与导读

封面文案：

**一个人跑通电商闭环**

副标题：

**Agent 商业化第一站**

导读：

这篇文章只解决一件事：用 Shopify、v0、Cursor 和 Vercel，搭出一个能展示商品、加入购物车、跳转结账的 headless 电商站。对想做 Agent 商业化的人来说，先跑通一条真实交易链路，比再做一个聊天 demo 更重要。

## 配套资产

这篇文章最好带一个「资料包」概念，提升收藏和转发价值。

建议产物：

1. `Shopify Storefront API 验证命令`
2. `v0 三页 UI 提示词`
3. `Cursor API 接入提示词`
4. `Vercel 环境变量清单`
5. `Headless 电商项目结构`
6. `Agent-ready 电商验收表`
7. `常见错误排查表`

其中 2、3、6 最适合放进公众号正文；1、4、5、7 可以作为文末资料包。

## 事实核验清单

正式起稿前需要补这些核验，避免保姆级文章写成过期教程：

- Shopify Storefront API 当前版本和 endpoint。
- Storefront API tokenless、public token、private token 的适用边界。
- Cart API 的最新推荐写法，特别是 `cartCreate`、`cartLinesAdd`、`checkoutUrl`。
- Shopify Partner / development store 创建路径。
- v0 当前导出、GitHub、部署能力。
- Vercel 环境变量配置和重新部署机制。
- Shopify 当前 pricing 不要写死，按读者所在地和官网页面为准。
- Shopify Agentic commerce / UCP / MCP 的可用范围，尤其是 Universal Cart 是否仍在 early access。
- superbape 案例最好补原推文链接或截图；如果无法核验，就写成「素材案例」而非强事实。

## 采证备注

已核的官方信息：

- Shopify Storefront API 官方页显示 `2026-04 latest`，可用于商品、购物车和 checkout 链路。
- Shopify Storefront API 是 GraphQL API，需要关联具体 store；官方也说明可从任意 HTTP client 调用。
- Shopify Cart 对象包含 `checkoutUrl`，用于把买家带到 Shopify web checkout 完成购买。
- Shopify 官方已单列 Agentic commerce / UCP 文档，描述 discovery、cart、checkout、orders 等 Agent 购物链路，并提到 Shopify UCP-compliant MCP servers。
- v0 官方文档把 v0 定义为能创建真实代码、full-stack apps 和 agents 的 AI agent，并支持连接后端、生产部署或 PR。
- Vercel 官方环境变量文档说明环境变量是代码外部配置，变更只对新部署生效，本地开发变量可用 `.env.local`。

## 发布节奏

建议三篇连发，不要日更：

- 第 1 天：认知入口文，建立「Agent 商业化先看交易闭环」。
- 第 3-4 天：核心实操文，主推。
- 第 7 天：Agent-ready 进阶文，承接评论区问题。

如果核心实操文反馈好，再补国内适配文。

## content_state 建议

```yaml
content_state:
  project:
    name: Agent 商业化系列
    account: AI生命克劳德
    long_term_goal: Human3.0
  request:
    current_stage: 立骨
    target_platforms:
      - 微信公众号
  audience:
    primary:
      - AI 实践者
      - 独立开发者
      - 创作者
      - 个人 IP 商业化探索者
    pain_points:
      - Agent demo 很多，但缺少真实交易闭环
      - 会用 AI 工具，却不知道怎么变成可收款资产
      - 想做电商，但怕技术链路太长
  topic:
    source:
      - 2分钟500单：下一个开电商店的人，可能不是人.md
      - Headless 电商实战：一个人用 AI 搭一家电商站（附完整工具链）.md
    core_angle: Agent 商业化第一站，是用 AI 跑通一条真实电商交易闭环
    selected_title: Agent 商业化第一站：用 AI 跑通一个电商闭环
    long_term_value: 可沉淀为 Agent 商业化 SOP、个人商业闭环实验、Human3.0 数字生产资料案例
  outline:
    thesis: 先做可交易、可验证、可复盘的窄场景，再谈复杂 Agent。
    sections:
      - 先定边界
      - 工具链总览
      - Shopify 后端配置
      - v0 生成页面
      - Cursor 接入 API
      - Vercel 部署
      - 常见坑
      - Agent 商业化验收表
  next_step:
    skill: wechat-writing-skill-ai-human3
    reason: 进入核心实操文正文起稿
    user_decision_needed: true
  handoff:
    from_stage: 立骨
    to_stage: 起稿
    accepted_inputs:
      - 本专题规划
      - 两篇素材原文
      - 已核官方事实
    ignored_context:
      - 未核验的价格数字
      - 未核验的 superbape 原推文数据
      - 旧版 Storefront API endpoint
    stop_condition: 需要确认先写第 1 篇认知文还是第 2 篇核心实操文
```

## 下一步建议

直接写第 2 篇核心实操文。

原因：第一篇素材已经接近可发布，真正能成为「Agent 商业化」系列关键资产的是第二篇。它能把读者从看趋势推进到动手搭建，也更适合后续沉淀资料包、SOP、课程或小红书卡片。
