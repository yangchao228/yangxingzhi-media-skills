---
name: loop-builder
description: 设计和生成可控 Agent Loop 的 Skill。用于用户要求把真实任务做成 Loop、判断任务是否适合自动化、设计 Agent Loop、生成 TODO.md state file、Planner/Maker/Checker/Evaluator prompt、Codex Loop、内容生产 Loop、Skill 维护 Loop、学习复盘 Loop、项目维护 Loop，或需要断路器、成本控制、人工确认清单时。
---

# loop-builder

## 目标

把一个真实任务判断、拆解并设计成可验证、可停止、可纠错、可交接的 Agent Loop。

默认只做设计与脚手架：输出 Loop 设计卡、状态文件、角色 Prompt、验收规则、断路器和复盘方式。长期运行交给 Codex Goal、Automations、cron、GitHub Actions 或后续自建 Harness。

## 触发条件

用户出现以下意图时使用本 Skill：

- 帮我把这个任务做成 Loop
- 这个任务适合自动化吗
- 帮我设计一个 Agent Loop
- 生成 TODO.md state file
- 生成 Maker / Checker prompt
- 帮我搭 Codex Loop
- 设计内容生产 Loop / Skill 维护 Loop / 学习复盘 Loop / 项目维护 Loop

## 参考资料

按任务需要读取对应 reference：

- 选择 Loop 模式时，读取 `references/loop-patterns.md`。
- 生成 TODO.md、Planner、Maker、Checker、Evaluator、PR 摘要、失败报告时，读取 `references/templates.md`。
- 生成验收卡、断路器、成本控制、7 天落地计划、复盘清单时，读取 `references/checklists.md`。
- 设计垂直场景时，按需读取：
  - `references/scenarios/content-production-loop.md`
  - `references/scenarios/skill-maintenance-loop.md`
  - `references/scenarios/learning-review-loop.md`

## 垂直场景选择

如果用户没有明确指定场景，按任务目标选择：

| 用户目标 | 读取文件 | 默认主模式 |
| --- | --- | --- |
| 公众号、知乎、小红书、电子书、素材归档、文昌链路 | `references/scenarios/content-production-loop.md` | Explore-Narrow |
| 新增 Skill、升级 Skill、验证 Skill、生成 Skill 模板 | `references/scenarios/skill-maintenance-loop.md` | Plan-Execute-Verify |
| 学习输入、读书笔记、课程复盘、知识沉淀、个人系统建设 | `references/scenarios/learning-review-loop.md` | Lifecycle Loop |

## 固定流程

### 1. 任务适配判断

先判断任务是否适合进入 Loop。

结论只能从以下几类中选择：

- 适合
- 暂不适合
- 只适合 Human-in-the-Loop
- 先做只读侦察

如果暂不适合，给出更轻替代方案：Prompt、Context、Checklist 或一次性 Planner。

### 2. 模式选择

从以下五种模式中选主模式：

- Retry Loop
- Plan-Execute-Verify
- Explore-Narrow
- Human-in-the-Loop
- Lifecycle Loop

必须说明选择原因、主要风险和停止条件。可以组合模式，但主模式只能有一个。

### 3. 最小 Loop 设计卡

输出最小可运行结构：

- 目标
- 输入
- 状态位置
- 执行者
- 验收者
- 反馈信号
- 停止规则
- 人工确认节点
- 禁止动作

### 4. 模板生成

按任务类型生成：

- `TODO.md` state file
- Planner Prompt
- Maker Prompt
- Checker Prompt
- Evaluator Prompt
- 断路器清单
- 成本控制清单
- 人工确认清单

模板要能被用户直接复制到真实项目中使用。缺少真实路径、命令、工具权限时，用占位符并要求用户确认，不写成确定命令。

### 5. 复盘与资产沉淀

给出本轮运行后应沉淀的位置：

- `AGENTS.md`
- Skill
- 模板库
- 失败报告
- 项目规则
- 内容素材库

默认对齐 Human3.0：保留人的判断权，沉淀数字生产资料，帮助用户建设个人系统。

## 输出格式

```md
## Loop 适配判断
- 结论：
- 原因：
- 不适合自动化的部分：

## 推荐 Loop 模式
- 主模式：
- 可组合模式：
- 为什么：

## 最小 Loop 设计卡
| 字段 | 内容 |
|---|---|
| 目标 | |
| 状态 | |
| 执行者 | |
| 验收者 | |
| 反馈信号 | |
| 停止规则 | |
| 人工确认节点 | |
| 禁止动作 | |

## 生成模板
### TODO.md
...

### Planner Prompt
...

### Maker Prompt
...

### Checker Prompt
...

### Evaluator Prompt
...

## 断路器与成本控制
...

## 下一步
- 第一次运行建议：
- 复盘方式：
- 可沉淀资产：
```

## 边界

- 不承诺无人值守。
- 不替用户执行 merge、发布、生产配置、权限、支付、数据删除、商业上架。
- 不把未验证的工具能力写成确定命令。
- Codex、Claude Code、Cursor、自建 Harness 必须分清边界。
- 默认先手动跑通，再建议低频自动化。
- 没有外部反馈的任务，不进入修复循环，只能进入分析或人工确认流程。
- 生产、权限、支付、数据删除、公开发布、商业上架都必须保留人工确认。
- 如果用户要求越过人工确认节点，应拒绝并给出可审计的替代流程。
