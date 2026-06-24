# 文昌 Studio v1 PRD

## 一句话定位

文昌 Studio v1 是一个面向内容创作者的 Web SaaS 控制台，通过本地 Codex Runner 调用现有文昌 skills，把主题、素材或初稿推进成可手动发布的内容资产包。

它不做自动发布，也不在第一期重写云端大模型编排。第一期重点是降低小白使用文昌的门槛，同时保留高阶用户对本地工作流、模板和状态资产的控制权。

## 背景判断

当前文昌 skills 已经具备比较完整的内容生产能力：探脉、定题、采证、立骨、起稿、诊文、整章、出刊、配图/卡片、归档。问题不在于能力缺失，而在于普通用户需要理解 skill 名称、阶段边界、提示词写法、`content_state`、`handoff` 和人工判断节点，使用成本偏高。

所以 v1 产品要做的不是再增加一个写作 prompt，而是把现有文昌流程产品化：

- 用界面替代复杂入口语。
- 用项目状态替代聊天历史接力。
- 用决策卡片替代用户自己判断下一步。
- 用模板替代从零配置账号定位和平台规则。
- 用产物箱替代散落在聊天里的文章、标题、摘要、卡片结构和发布检查。

## 目标用户

### 小白创作者

典型特征：

- 会用 AI，但不理解 prompt 工程、skill、agent、状态协议。
- 有主题、热点链接、初稿或表达欲，但不知道如何组织成可发布内容。
- 需要系统告诉自己下一步该做什么，以及什么时候该停下来拍板。

核心诉求：

- 输入简单。
- 流程明确。
- 结果能直接复制、导出或交给平台发布。
- 不需要理解文昌内部实现。

### 高阶内容生产者

典型特征：

- 有自己的账号定位、栏目、写作风格和长期内容主线。
- 愿意调整模板、检查中间状态、复用本地文件和 skills。
- 关心内容是否能沉淀成素材库、方法论、案例和长期资产。

核心诉求：

- 可定制模板。
- 可查看 `content_state`、执行日志和产物版本。
- 可接入本地 Codex 环境。
- 可把一次内容生产沉淀成可复用流程。

## v1 范围

### In scope

- Web SaaS 控制台。
- 本地 Codex Runner。
- 使用现有文昌 skills 完成内容创作流程。
- 项目管理：一个内容任务对应一个项目。
- 模板管理：官方示例模板 + 用户复制定制。
- 素材输入：主题、链接、初稿、补充材料。
- 阶段进度：展示当前处于探脉、定题、采证、起稿、诊文、出刊等哪一步。
- 决策卡片：把关键人工判断转成可点击选择。
- 内容资产包：正文、标题、摘要、标签、封面文案、朋友圈文案、小红书卡片结构、知乎改写建议。
- 手动导出：Markdown、HTML、JSON 状态包、图片素材路径或卡片结构。

### Out of scope

- 自动发布到公众号、小红书、知乎等平台。
- 平台账号授权。
- 定时发布。
- 发布后数据回收。
- Cloud OpenAPI 执行模式。
- Ollama 或其他本地裸模型执行模式。
- 多人协作、组织权限、复杂计费系统。
- 把现有文昌 skills 全量重写成云端 prompt workflow。

## 执行模式

v1 只支持一种正式执行模式：

```text
web_saas -> local_runner -> codex exec -> wenchang skills -> artifacts back to web_saas
```

选择这个边界的原因：

- 能最大化复用当前文昌项目的提示词工程、脚本、状态合同和本地资产。
- 避免第一期同时处理云端模型编排、token 成本、结构化输出兼容和质量评测。
- 让 v1 先验证产品交互、任务协议和小白使用路径。
- 保留用户本地文件、skills、知识库和执行环境的控制权。

v2 再评估 Cloud OpenAPI 模式。Cloud OpenAPI 需要单独抽取 stage prompt templates、服务端编排、token 成本控制、结构化校验和模型质量评测，不进入 v1。

Ollama 暂不进入正式路线。它可以用于局部起稿或改写实验，但不适合承诺跑完整文昌流程，会增加模型能力分层和失败解释成本。

## 技术方案

### 总体架构

v1 采用“云端控制台 + 本地执行器”的混合架构。

```text
Browser
  -> Web SaaS
       -> Project API
       -> Template API
       -> Job API
       -> Artifact API
       -> Decision API
  -> Local Runner connection
       -> Local Codex Runner
            -> codex exec
                 -> wenchang-orchestrator / wenchang-router / wenchang-* skills
            -> local workspace / user authorized files
```

云端负责产品体验、状态管理和产物管理；本地 Runner 负责调用用户本机 Codex 和文昌 skills。Web SaaS 不直接调用用户本机命令，也不直接读取用户本地文件。

### 推荐技术栈

v1 推荐先选成熟、轻量、易部署的技术栈：

| 层 | 推荐方案 | 原因 |
| --- | --- | --- |
| Web 前端 | Next.js + React + TypeScript | 适合 SaaS 控制台和后续 Vercel 部署 |
| UI | shadcn/ui 或等价组件库 | 快速搭建表单、卡片、Tabs、Dialog |
| 后端 API | Next.js Route Handlers 或独立 Node API | MVP 阶段减少服务拆分 |
| 数据库 | Postgres | 适合项目、模板、任务、产物和状态记录 |
| ORM | Prisma 或 Drizzle | 提供 schema 迁移和类型约束 |
| Runner | Node.js CLI | 方便调用 `codex exec`、处理 JSON、跨平台分发 |
| Runner 通信 | HTTPS polling 起步，后续升级 WebSocket | polling 更简单，适合 v1 POC |
| 文件存储 | Postgres 文本字段起步，后续对象存储 | v1 产物主要是 Markdown/JSON/HTML |
| 校验 | JSON Schema / Zod | 校验 job、result、artifact、decision |

第一期不引入复杂队列系统。任务量小的时候，Job API + Runner polling 足够验证闭环。

### 模块划分

#### Web SaaS

Web SaaS 负责：

- 用户登录和项目列表。
- 项目创建、模板选择、素材提交。
- 保存 `content_state`、`decisions`、artifacts 和 execution jobs。
- 展示阶段进度、决策卡片和产物箱。
- 下发任务给本地 Runner。
- 接收 Runner 回传结果。
- 导出 Markdown、HTML、JSON。

Web SaaS 不负责：

- 直接执行 `codex exec`。
- 直接访问用户本地文件。
- 调用公众号、小红书、知乎发布接口。
- 调用 Cloud OpenAPI。

#### Local Codex Runner

Local Runner 负责：

- 与 Web SaaS 建立绑定关系。
- 轮询或接收待执行 `execution_job`。
- 把 job 转成 `codex exec` 输入。
- 调用本机 Codex。
- 收集原始输出。
- 解析为 `execution_result`。
- 回传 artifacts、decision_request、logs。

Local Runner 不负责：

- 自己决定产品阶段。
- 绕过用户确认继续推进。
- 自动上传图片或发布内容。
- 读取 job 未授权的本地文件。

#### Wenchang Skills

现有文昌 skills 保持为内容能力层：

- `wenchang-orchestrator`：总控和阶段判断。
- `wenchang-router`：阶段与平台路由。
- `wenchang-research`：采证。
- `wechat-writing-skill-ai-human3`：公众号起稿。
- `wenchang-review`：诊文和整章。
- `wenchang-publish-check`：发布前检查和发布资产包。
- 卡片类 skills：生成分发结构和卡片内容。

v1 不把这些能力重写成云端 prompt。Runner 只负责把结构化 job 交给 Codex 执行。

### 数据模型

v1 最小数据表：

```text
users
templates
projects
materials
execution_jobs
execution_results
decision_requests
decision_answers
artifacts
runner_devices
```

#### projects

```text
id
user_id
template_id
title
status
primary_platform
current_stage
content_state_json
created_at
updated_at
```

#### execution_jobs

```text
id
project_id
runner_device_id
status
stage
skill
job_payload_json
created_at
started_at
finished_at
error_code
```

#### artifacts

```text
id
project_id
execution_job_id
type
format
title
content
metadata_json
created_at
```

#### decision_requests

```text
id
project_id
execution_job_id
stage
question
reason
options_json
default_option_id
impact
status
created_at
answered_at
```

#### runner_devices

```text
id
user_id
name
status
last_seen_at
capabilities_json
created_at
```

### API 设计

v1 API 先按资源拆分：

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id

GET    /api/templates
POST   /api/templates/:id/clone
PATCH  /api/templates/:id

POST   /api/projects/:id/materials
GET    /api/projects/:id/artifacts

POST   /api/projects/:id/jobs
GET    /api/runner/jobs/next
POST   /api/runner/jobs/:id/results

POST   /api/decision-requests/:id/answer
GET    /api/runner/status
POST   /api/runner/heartbeat
```

Runner 拉取任务的 MVP 方式：

```text
Runner -> GET /api/runner/jobs/next
Runner -> execute local codex
Runner -> POST /api/runner/jobs/:id/results
```

这种方式比 WebSocket 简单，适合先跑通 POC。后续如果要实时进度，再引入 WebSocket 或 Server-Sent Events。

### 状态机

项目状态：

```text
draft
active
running
waiting_for_decision
failed
completed
archived
```

任务状态：

```text
queued
claimed
running
succeeded
needs_user_decision
failed
cancelled
```

状态推进规则：

- 创建项目后为 `draft`。
- 用户点击开始后创建 job，项目进入 `running`。
- Runner 成功返回普通结果后，项目回到 `active`。
- Runner 返回 `needs_user_decision` 后，项目进入 `waiting_for_decision`。
- 用户回答决策卡片后，创建下一阶段 job。
- Runner 失败时，项目进入 `failed`，但不覆盖上一次成功状态。
- 出刊资产包完成后，项目进入 `completed`。

### Codex 调用方式

Runner 生成给 Codex 的输入必须包含：

- 当前 `execution_job`。
- 本轮允许读取的 `content_state` 字段。
- 用户材料。
- 模板快照。
- 停顿规则。
- 禁止自动发布、上传、归档落库的约束。

示例：

```text
Use $wenchang-orchestrator.

请根据下面 execution_job 执行当前阶段。
只读取 accepted_inputs 中列出的材料。
如果需要用户判断，返回 decision_request，不要继续推进。
不要自动发布，不要上传图片，不要归档落库。

<execution_job JSON>
```

Runner 需要保存两份结果：

- 原始 Codex 输出，用于调试。
- 解析后的 `execution_result`，用于产品状态推进。

### 结构化输出策略

v1 不要求 Codex 每次都完美输出 JSON。Runner 采用“两层解析”：

1. 优先解析明确的 JSON / YAML 块。
2. 如果没有完整结构，按约定标题提取 `content_state`、`handoff`、artifacts 和 decision_request。

解析失败时返回：

```text
INVALID_STRUCTURED_OUTPUT
```

并保留原始输出，允许用户在专家模式查看。

后续 POC 如果发现解析不稳定，再增加一个本地结构化整理步骤，但仍通过 Runner 执行，不放到 Web SaaS 直接调用模型。

### 安全边界

v1 的安全边界要保守：

- Web SaaS 不持有用户本地文件系统权限。
- Web SaaS 不直接执行 shell 命令。
- Runner 只执行当前用户授权的 job。
- Runner 只读取 job 中声明的材料和授权文件。
- Runner 日志回传前要过滤 token、密钥、`.env`、敏感路径。
- 自动发布、外部上传、归档落库全部需要用户确认，v1 默认不执行。

### 部署方案

MVP 可以按两部分部署：

```text
Web SaaS:
  Vercel / Node runtime
  Postgres

Local Runner:
  npm package or standalone Node CLI
  user machine
  requires local Codex available
```

Runner 安装形态：

```text
npx wenchang-runner login
npx wenchang-runner doctor
npx wenchang-runner start
```

`doctor` 检查：

- 是否能访问 Web SaaS。
- 是否完成账号绑定。
- 本地是否能调用 Codex。
- 文昌 skills 是否可用。
- 当前目录或用户配置是否可作为工作区。

### POC 实施顺序

第一步：schema 和 mock job

- 落地 `execution_job`、`execution_result`、`decision_request`、`artifact` schema。
- 准备 3 个 mock job：热点链接、明确主题、已有初稿。

第二步：本地 Runner CLI

- 读取本地 mock job。
- 拼接 Codex 输入。
- 调用 `codex exec`。
- 保存原始输出。
- 生成 `execution_result`。

第三步：mock SaaS API

- 用本地 API 模拟 job 下发和 result 回传。
- UI 暂不做完整，只验证任务链路。

第四步：最小 Web 控制台

- 项目创建。
- Runner 状态。
- 阶段进度。
- 决策卡片。
- 产物箱。

### 技术风险

| 风险 | 影响 | v1 处理方式 |
| --- | --- | --- |
| Codex 输出不稳定 | 状态无法推进 | Runner 保存原始输出，解析失败返回错误码 |
| Runner 离线 | 用户无法执行 | UI 明确显示连接状态，允许先编辑素材 |
| 本地文件权限复杂 | 读取失败或泄露风险 | v1 只读取用户显式授权材料 |
| 决策节点被跳过 | 用户判断权丢失 | 产品层强制识别 `user_decision_needed` |
| 文昌 skill 更新导致协议变化 | Runner 解析失败 | 用 schema、fixtures 和 smoke check 做回归 |
| SaaS 和 Runner 版本不一致 | job 无法执行 | job 带 `schema_version`，Runner 做兼容检查 |

## 核心概念

### Project

一个内容创作项目。承载素材、模板、阶段状态、用户决策、执行记录和最终产物。

最小字段：

```yaml
project:
  id:
  title:
  status:
  template_id:
  created_at:
  updated_at:
  primary_platform:
  current_stage:
  content_state:
  artifacts: []
  decisions: []
  execution_jobs: []
```

### Template

模板不是单个 prompt，而是一套内容生产配置。

最小字段：

```yaml
template:
  id:
  name:
  description:
  account_profile:
  long_term_goal:
  target_audience:
  default_platforms: []
  writing_rules: []
  forbidden_angles: []
  quality_bar:
  stage_policy:
  output_package:
```

v1 官方示例模板：

- Human3.0 公众号判断文。
- AI 工具体验与工作流复盘。
- 小红书知识卡片。
- 知乎观点回答。

用户可以复制官方模板，改成自己的账号模板。

### Content State

`content_state` 是文昌流程的核心状态对象。v1 不把它暴露给小白，但每个项目都必须保存它。

小白界面显示：

- 当前阶段。
- 已完成什么。
- 下一步是什么。
- 需要用户决定什么。
- 当前产物有哪些。

专家模式显示：

- 完整 `content_state`。
- `handoff`。
- 调用的 skill。
- 执行日志。
- 原始输入与结构化输出。

### Decision Card

决策卡片是用户保留判断权的核心交互。

典型卡片：

- 这 3 个选题选哪个？
- 是否继续采证？
- 采证可信度低，要继续查还是改成观点文？
- 诊文建议重写，是否接受？
- 是否生成小红书卡片结构？
- 是否进入 Human3.0 素材库审查？

用户每次选择都写入 `content_state.decisions`，后续阶段按已确认判断推进。

### Artifact

产物是项目的可交付资产。

v1 产物类型：

- `wechat_article`
- `zhihu_answer`
- `xiaohongshu_card_outline`
- `title_candidates`
- `summary`
- `tags`
- `cover_text`
- `share_copy`
- `review_report`
- `content_state_snapshot`
- `markdown_export`
- `html_export`

## 核心入口

v1 首页只给 5 个任务入口：

1. 我不知道写什么。
2. 我有一个主题。
3. 我有一篇热点文章 / 链接。
4. 我有一篇初稿。
5. 我只想做发布前检查 / 分发包。

每个入口映射到现有文昌阶段：

| 入口 | 默认阶段 | 默认链路 |
| --- | --- | --- |
| 不知道写什么 | 探脉 | 探脉 -> 定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 |
| 有一个主题 | 定题 | 定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 |
| 有热点文章 / 链接 | 定题 | 定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 整章 -> 出刊 |
| 有初稿 | 诊文 | 诊文 -> 采证/整章/重写 -> 出刊 |
| 发布前检查 / 分发包 | 出刊 | 出刊 -> 分发资产包 |

配图、卡片、归档仍可作为后续可选节点，但 v1 不做平台自动发布。

## 页面设计

### 项目创建页

用户只需要填写：

- 任务入口。
- 目标平台。
- 模板。
- 主题、链接或初稿。
- 可选补充材料。

默认值：

- 模板：Human3.0 公众号判断文。
- 平台：公众号。
- 执行模式：本地 Codex Runner。

### 项目工作台

建议布局：

- 左侧：素材箱。
- 中间：阶段进度和当前任务。
- 右侧：需要你决定。
- 底部或二级页：产物箱。

小白模式只展示结论和选择。专家模式再展示日志、状态和原始输出。

### 模板管理页

功能：

- 查看官方模板。
- 复制成我的模板。
- 修改账号定位、读者画像、长期方向、平台规则、写作禁区、质量标准。
- 选择默认输出包。

v1 不做复杂 prompt 编辑器，先用结构化表单降低误改风险。

### 产物页

展示：

- 主文稿。
- 发布标题。
- 摘要。
- 标签。
- 封面文案。
- 朋友圈文案。
- 小红书卡片结构。
- 知乎改写建议。
- 发布前检查清单。

支持：

- 复制。
- 下载 Markdown。
- 下载 HTML。
- 导出项目状态 JSON。

## 本地 Codex Runner

### 职责

本地 Runner 负责：

- 与 SaaS 建立任务连接。
- 接收项目任务和必要上下文。
- 在本地调用 `codex exec`。
- 读取并执行文昌 skills。
- 回传结构化结果和产物。
- 保留本地执行日志。

SaaS 不直接读用户本地文件。需要本地文件时，由 Runner 在用户授权范围内读取。

### 最小任务协议

```yaml
execution_job:
  id:
  project_id:
  runner_type: local_codex
  stage:
  skill:
  prompt:
  accepted_inputs:
    content_state:
    user_materials: []
    template:
  stop_condition:
  expected_outputs:
    - content_state
    - handoff
    - artifacts
    - decision_request
```

### Runner 输出协议

```yaml
execution_result:
  job_id:
  status: succeeded | failed | needs_user_decision
  stage:
  content_state:
  handoff:
  artifacts: []
  decision_request:
    required:
    question:
    options: []
    reason:
  logs:
    summary:
    error:
```

## v1 MVP

第一版只做一个稳定闭环：

```text
创建项目
-> 选择模板
-> 输入主题 / 链接 / 初稿
-> 本地 Codex Runner 执行文昌流程
-> 用户在关键节点通过决策卡片拍板
-> 生成公众号发布包
-> 可选生成小红书卡片结构和知乎改写建议
-> 手动导出
```

MVP 必须完成：

- 项目创建。
- 模板选择。
- 本地 Runner 任务下发。
- `codex exec` 调用现有文昌总控。
- 阶段进度展示。
- 决策卡片。
- 产物箱。
- Markdown 导出。
- 项目状态保存。

MVP 可以暂缓：

- 模板市场。
- 复杂模板编辑器。
- 多平台同时生成。
- 真实图片生成。
- 图片上传。
- Human3.0 成书归档自动落库。
- Cloud OpenAPI。

## 质量与风险控制

v1 必须保留以下停顿点：

- 多个可行选题需要用户选择。
- 采证可信度低。
- 缺少反向证据。
- 诊文建议重写、暂不投入或转平台。
- 出刊存在阻塞项。
- 需要生成图片、上传图片或进入归档。
- 用户明确要求暂停。

这些停顿点不能只写在模型提示词里。产品层也要识别 `content_state.next_step.user_decision_needed` 和 `decision_request.required`，强制展示决策卡片。

## 验收标准

### 用户侧验收

- 小白用户不需要知道任何 skill 名称，也能完成一次内容项目。
- 用户能清楚看到当前处于哪一步、下一步会做什么、为什么需要自己选择。
- 产物能被手动复制或导出，用于真实发布。
- 用户可以基于官方模板复制出自己的账号模板。

### 工程侧验收

- 所有项目状态可恢复。
- 每次用户选择都写入 `decisions`。
- Runner 失败时能展示失败原因和可重试动作。
- 同一个项目可以从上次阶段继续执行。
- 文昌核心技能仍通过仓库原有验证脚本。

### 内容侧验收

- 不在选题未定时生成全文。
- 不在采证不足时进入强事实写作。
- 不在诊文建议重写时假装可发布。
- 不自动发布。
- 不替用户做归档入库判断。

## v2 方向

v2 再考虑 Cloud OpenAPI 模式。

需要补充：

- Stage prompt templates 抽取。
- 云端执行编排。
- token 成本估算与上限控制。
- 模型质量评测。
- 结构化输出校验。
- 多模型兼容。
- 云端安全与隔离。
- 与本地 Codex Runner 的一致性测试。

v2 的目标不是替代本地模式，而是给小白提供免安装、开箱即用的云端执行路径。

## 暂不做的方向

### 不做自动发布

v1 聚焦内容创作，停在可手动发布的资产包。自动发布会引入平台账号、审核、风控、接口变动、失败重试和合规风险，暂不进入第一期。

### 不做 Ollama

Ollama 可以降低推理成本，但不稳定适合完整文昌流程，尤其是采证、复杂诊文、多阶段一致性和工具调用。v1 不引入半能力模型，避免产品承诺和实际体验错位。

### 不做万能聊天框

文昌 Studio 的核心体验是任务工作台，不是一个新的聊天壳。聊天可以作为补充输入，但主流程必须由项目、阶段、决策和产物驱动。

## 下一步

1. 画低保真原型：项目创建页、项目工作台、模板页、产物页。
2. 定义 `execution_job` 和 `execution_result` 的 JSON Schema。
3. 做本地 Runner POC：从 SaaS mock job 调 `codex exec`，回传一个文昌总控结果。
4. 用 3 个样例跑通端到端：主题输入、热点链接、已有初稿。
5. 再决定是否进入真实 Web SaaS 工程实现。
