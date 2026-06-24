# 文昌 Studio v1 执行协议

## 目标

本协议定义文昌 Studio v1 中 Web SaaS、本地 Codex Runner、`codex exec` 和现有文昌 skills 之间的最小协作合同。

v1 只支持 Local Codex Runner 模式：

```text
Web SaaS -> Local Runner -> codex exec -> 文昌 skills -> Local Runner -> Web SaaS
```

协议目标：

- 让 Web SaaS 不依赖聊天历史推进流程。
- 让本地 Runner 可以稳定接收任务、执行任务、回传产物。
- 让 `content_state`、`handoff`、`decisions` 成为跨阶段状态合同。
- 为 v2 Cloud OpenAPI 预留同一套任务和产物结构。

## v1 边界

### 支持

- 本地 Codex Runner 执行。
- 调用现有文昌 skills。
- 阶段任务下发。
- 结构化结果回传。
- 决策请求回传。
- Markdown / HTML / JSON 等内容产物回传。
- 执行失败、重试和日志摘要。

### 不支持

- Cloud OpenAPI 执行。
- Ollama 或其他本地裸模型执行。
- 自动发布。
- 平台账号授权。
- SaaS 后端直接读取用户本地文件。
- SaaS 后端直接执行本机命令。

## 核心实体

### Project

项目是一次内容创作任务的根对象。

```json
{
  "id": "proj_01H...",
  "title": "AI 记忆会改变普通人的工作方式吗",
  "status": "active",
  "template_id": "tmpl_human3_wechat_judgment",
  "primary_platform": "wechat",
  "current_stage": "routing",
  "content_state": {},
  "created_at": "2026-05-28T10:00:00+08:00",
  "updated_at": "2026-05-28T10:10:00+08:00"
}
```

状态枚举：

```text
draft
active
waiting_for_decision
running
completed
failed
archived
```

### Template

模板定义账号方向、平台目标、写作约束和默认输出包。

```json
{
  "id": "tmpl_human3_wechat_judgment",
  "name": "Human3.0 公众号判断文",
  "version": "1.0.0",
  "account_profile": "AI生命克劳德",
  "long_term_goal": "Human3.0",
  "target_audience": "普通 AI 使用者、创作者、工程师",
  "default_platforms": ["wechat"],
  "writing_rules": [
    "第一屏必须有明确判断",
    "不要写成产品功能清单",
    "每篇保留一个可复用方法或案例"
  ],
  "forbidden_angles": [
    "纯追热点",
    "无证据的强结论",
    "自动替用户做最终发布判断"
  ],
  "output_package": [
    "wechat_article",
    "publish_package",
    "review_report"
  ]
}
```

### User Material

用户输入材料。

```json
{
  "id": "mat_01H...",
  "project_id": "proj_01H...",
  "type": "topic",
  "title": "AI 记忆能力会改变普通人的工作方式吗",
  "content": "我想写一篇公众号文章...",
  "source_url": null,
  "created_at": "2026-05-28T10:00:00+08:00"
}
```

类型枚举：

```text
topic
url
draft
note
file_reference
manual_context
```

v1 中 SaaS 只保存用户显式提交的内容。需要读取本地文件时，只保存 `file_reference`，由本地 Runner 在用户授权范围内读取。

## Execution Job

`execution_job` 是 Web SaaS 下发给本地 Runner 的任务。

### 最小结构

```json
{
  "schema_version": "1.0",
  "id": "job_01H...",
  "project_id": "proj_01H...",
  "runner_type": "local_codex",
  "stage": "routing",
  "skill": "wenchang-orchestrator",
  "intent": "从热点链接开始走文昌流程，遇到需要用户判断的节点暂停",
  "template": {
    "id": "tmpl_human3_wechat_judgment",
    "version": "1.0.0"
  },
  "accepted_inputs": {
    "content_state": {},
    "materials": [],
    "template_snapshot": {}
  },
  "expected_outputs": [
    "content_state",
    "handoff",
    "artifacts",
    "decision_request"
  ],
  "stop_condition": "如果需要用户确认，返回 needs_user_decision，不继续推进",
  "created_at": "2026-05-28T10:00:00+08:00"
}
```

### 字段说明

| 字段 | 说明 |
| --- | --- |
| `schema_version` | 协议版本 |
| `id` | 任务 ID，重试时保持原任务可追踪 |
| `project_id` | 所属项目 |
| `runner_type` | v1 固定为 `local_codex` |
| `stage` | 当前阶段 |
| `skill` | 建议调用的文昌 skill |
| `intent` | 面向 Runner / Codex 的任务意图 |
| `template` | 模板引用 |
| `accepted_inputs` | 本轮允许读取的输入 |
| `expected_outputs` | 期望回传的结构 |
| `stop_condition` | 停顿规则 |

### Stage 枚举

```text
orchestrating
routing
topic_selection
research
outline
drafting
review
rewrite
publish_check
distribution_package
archive_review
```

### Skill 映射

| Stage | 默认 skill |
| --- | --- |
| `orchestrating` | `wenchang-orchestrator` |
| `routing` | `wenchang-router` |
| `topic_selection` | 对应平台选题 skill |
| `research` | `wenchang-research` |
| `drafting` | `wechat-writing-skill-ai-human3` |
| `review` | `wenchang-review` |
| `rewrite` | `wenchang-review` 整章模式 |
| `publish_check` | `wenchang-publish-check` |
| `distribution_package` | `wechat-to-cards` / `redbook-cards` / `long-to-cards` |
| `archive_review` | `human3-book-guardian` |

## Runner 执行规则

### 输入组装

Runner 接收 `execution_job` 后，只能读取：

- `accepted_inputs.content_state`
- `accepted_inputs.materials`
- `accepted_inputs.template_snapshot`
- 用户已授权的本地文件引用

Runner 不应该读取未被 job 声明的聊天历史或项目外文件。

### Codex 调用

v1 推荐 Runner 生成一次明确的 `codex exec` 任务输入：

```text
Use $wenchang-orchestrator.

请根据下面 execution_job 执行当前阶段。
如果需要用户判断，必须返回 decision_request，不要继续推进。
不要自动发布，不要调用外部平台发布接口。

<execution_job JSON>
```

具体命令由 Runner 实现决定。协议只要求 Runner 回传结构化 `execution_result`。

### 幂等规则

- 同一个 `job.id` 重试时，不应该重复写入相同决策。
- 如果 Runner 生成新 artifact，应使用新的 artifact ID，并保留来源 job。
- Web SaaS 以最新成功的 `execution_result` 推进项目状态。
- 失败结果不推进 `current_stage`，但保留错误日志。

## Execution Result

`execution_result` 是 Runner 回传给 Web SaaS 的结果。

### 成功结果

```json
{
  "schema_version": "1.0",
  "job_id": "job_01H...",
  "project_id": "proj_01H...",
  "status": "succeeded",
  "stage": "research",
  "content_state": {},
  "handoff": {
    "from_stage": "research",
    "to_stage": "drafting",
    "accepted_inputs": [
      "content_state.topic",
      "content_state.research",
      "template_snapshot.writing_rules"
    ],
    "ignored_context": [
      "未确认的旧标题",
      "被淘汰的选题角度"
    ],
    "stop_condition": "如果起稿前发现关键事实不足，返回 needs_user_decision"
  },
  "artifacts": [],
  "decision_request": null,
  "logs": {
    "summary": "已完成采证，可信度为 Medium，下一步可起稿。",
    "error": null
  },
  "created_at": "2026-05-28T10:10:00+08:00"
}
```

### 需要用户决策

```json
{
  "schema_version": "1.0",
  "job_id": "job_01H...",
  "project_id": "proj_01H...",
  "status": "needs_user_decision",
  "stage": "topic_selection",
  "content_state": {},
  "handoff": {},
  "artifacts": [],
  "decision_request": {
    "id": "dec_req_01H...",
    "required": true,
    "stage": "topic_selection",
    "question": "请选择本次文章的主角度",
    "reason": "当前素材有多个可写方向，继续前需要用户拍板。",
    "options": [
      {
        "id": "angle_workflow",
        "label": "写 AI 如何改变普通人的工作流",
        "description": "更贴近 Human3.0 和长期资产沉淀。"
      },
      {
        "id": "angle_product",
        "label": "写产品功能更新",
        "description": "更像资讯解读，长期价值较弱。"
      }
    ],
    "default_option_id": "angle_workflow",
    "impact": "后续采证、起稿和发布包会围绕所选角度推进。"
  },
  "logs": {
    "summary": "已完成定题判断，等待用户选择主角度。",
    "error": null
  },
  "created_at": "2026-05-28T10:10:00+08:00"
}
```

### 失败结果

```json
{
  "schema_version": "1.0",
  "job_id": "job_01H...",
  "project_id": "proj_01H...",
  "status": "failed",
  "stage": "drafting",
  "content_state": null,
  "handoff": null,
  "artifacts": [],
  "decision_request": null,
  "logs": {
    "summary": "起稿失败，未获得有效结构化输出。",
    "error": {
      "code": "INVALID_STRUCTURED_OUTPUT",
      "message": "Runner output missing content_state.next_step",
      "retryable": true
    }
  },
  "created_at": "2026-05-28T10:10:00+08:00"
}
```

状态枚举：

```text
succeeded
needs_user_decision
failed
cancelled
```

## Decision Request

`decision_request` 是产品层生成决策卡片的依据。

### 结构

```json
{
  "id": "dec_req_01H...",
  "required": true,
  "stage": "review",
  "question": "是否接受整章编辑？",
  "reason": "诊文认为方向可用，但结构需要大幅重排。",
  "options": [
    {
      "id": "accept_rewrite",
      "label": "接受整章编辑",
      "description": "下一步进入 rewrite 阶段。"
    },
    {
      "id": "light_edit",
      "label": "只做轻微润色",
      "description": "风险是核心问题可能仍然保留。"
    },
    {
      "id": "pause",
      "label": "暂停，先看诊文报告",
      "description": "不继续消耗执行任务。"
    }
  ],
  "default_option_id": "accept_rewrite",
  "impact": "用户选择会写入 content_state.decisions，并决定下一阶段。"
}
```

### 用户选择结果

Web SaaS 把用户选择写成 `decision_answer`：

```json
{
  "id": "dec_ans_01H...",
  "decision_request_id": "dec_req_01H...",
  "project_id": "proj_01H...",
  "stage": "review",
  "selected_option_id": "accept_rewrite",
  "freeform_note": "接受大幅调整，但保留开头的个人案例。",
  "created_at": "2026-05-28T10:15:00+08:00"
}
```

下一次 `execution_job.accepted_inputs` 必须包含这次选择，并要求 Runner 追加到 `content_state.decisions`。

## Artifact

Artifact 是可交付产物或阶段报告。

### 结构

```json
{
  "id": "art_01H...",
  "project_id": "proj_01H...",
  "job_id": "job_01H...",
  "type": "wechat_article",
  "title": "AI 不是开始写代码，而是开始接管你的工作台",
  "format": "markdown",
  "content": "# AI 不是开始写代码...",
  "metadata": {
    "stage": "drafting",
    "platform": "wechat",
    "word_count": 2300
  },
  "created_at": "2026-05-28T10:20:00+08:00"
}
```

### 类型枚举

```text
topic_brief
research_report
outline
wechat_article
zhihu_answer
xiaohongshu_card_outline
review_report
publish_package
title_candidates
summary
tags
cover_text
share_copy
content_state_snapshot
markdown_export
html_export
error_report
```

### 格式枚举

```text
markdown
html
json
text
uri
file_reference
```

## Web SaaS 状态推进规则

### 成功

当 `execution_result.status = succeeded`：

- 保存 `content_state`。
- 保存 `handoff`。
- 保存 artifacts。
- 更新项目 `current_stage`。
- 如果 `content_state.next_step.user_decision_needed = true`，项目状态改为 `waiting_for_decision`。
- 否则项目状态改为 `active` 或 `completed`。

### 需要用户决策

当 `execution_result.status = needs_user_decision`：

- 保存 `content_state`。
- 保存 `decision_request`。
- 项目状态改为 `waiting_for_decision`。
- UI 展示决策卡片。
- 不自动创建下一阶段任务。

### 失败

当 `execution_result.status = failed`：

- 项目状态改为 `failed`。
- 保存错误日志。
- 不覆盖上一次成功的 `content_state`。
- 展示重试按钮。

## 安全与权限

### SaaS 侧

- 不直接执行本机命令。
- 不直接读取本地文件。
- 不保存用户本地绝对路径内容，除非用户明确上传或粘贴。
- 不接平台发布账号。

### Runner 侧

- 只执行当前登录用户授权的项目任务。
- 只读取 `execution_job` 指定的材料和用户授权文件。
- 执行日志中避免回传密钥、token 和本地敏感路径。
- 调用 `codex exec` 前记录 job ID，方便失败追踪。

## 校验规则

v1 最小校验：

- `execution_job.runner_type` 必须是 `local_codex`。
- `execution_job.expected_outputs` 必须包含 `content_state`。
- `execution_result.status` 必须是合法枚举。
- `succeeded` 和 `needs_user_decision` 必须包含 `content_state`。
- `needs_user_decision` 必须包含 `decision_request.required = true`。
- `artifact.type` 必须是合法枚举。
- `content_state` 必须符合现有 `content/content_state.schema.json` 的关键字段要求。

## 错误码

| 错误码 | 含义 | 是否可重试 |
| --- | --- | --- |
| `RUNNER_OFFLINE` | 本地 Runner 离线 | 是 |
| `CODEX_NOT_AVAILABLE` | 本地 Codex 不可用 | 是 |
| `SKILL_NOT_FOUND` | 指定 skill 不存在 | 否 |
| `INVALID_JOB` | job 结构不合法 | 否 |
| `INVALID_STRUCTURED_OUTPUT` | Runner 输出缺关键字段 | 是 |
| `CONTENT_STATE_INVALID` | `content_state` 不符合合同 | 是 |
| `USER_DECISION_REQUIRED` | 需要用户判断 | 否 |
| `LOCAL_FILE_NOT_AUTHORIZED` | 本地文件未授权读取 | 否 |
| `EXECUTION_CANCELLED` | 用户取消任务 | 否 |

## POC 验证路径

### POC 1：mock job 到 Runner

目标：

- SaaS mock 一个 `execution_job`。
- Runner 接收后调用 `codex exec`。
- 回传 `execution_result`。

验收：

- 能返回 `content_state`。
- 能返回至少一个 artifact。
- 能在需要确认时返回 `decision_request`。

### POC 2：热点链接到选题决策卡

目标：

- 输入热点链接。
- 调用 `wenchang-orchestrator`。
- 停在选题确认。

验收：

- Web UI 展示 2-3 个选题选项。
- 用户选择后写入 `decision_answer`。
- 下一次 job 带上该选择继续推进。

### POC 3：已有初稿到诊文报告

目标：

- 输入一篇初稿。
- 调用 `wenchang-review`。
- 返回诊文报告和是否整章编辑的决策卡。

验收：

- 产物箱出现 `review_report`。
- 决策卡展示“整章编辑 / 轻改 / 暂停”。
- 不生成自动发布动作。

## v2 预留

v2 Cloud OpenAPI 可以复用：

- `execution_job`
- `execution_result`
- `decision_request`
- `artifact`
- `content_state`

但会新增：

- `runner_type = cloud_openapi`
- stage prompt templates
- token usage
- model routing
- cost limit
- cloud tool permissions
- structured output repair

v1 不为这些字段增加实现复杂度，只保留协议扩展空间。
