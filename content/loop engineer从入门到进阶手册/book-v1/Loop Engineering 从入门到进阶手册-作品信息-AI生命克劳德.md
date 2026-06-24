# 《Loop Engineering 从入门到进阶手册》作品信息

## 基本信息

书名：《Loop Engineering 从入门到进阶手册》

副标题：从 Prompt 到可控循环：AI Agent 自动化的结构、模式与实战模板

作者：AI生命克劳德

类型：非虚构 / 计算机 / AI Agent / 技术实战 / 个人系统方法论

字数：约 2.5 万中文正文

投稿方向：短篇作品 / 非虚构技术实战手册

目标读者：正在使用 Codex、Claude Code、Cursor 等 AI 编程工具，希望把 AI Agent 用进真实工作流的开发者、产品人、内容创作者和个人系统建设者。

## 一句话定位

一本写给 AI Agent 实践者的入门手册，帮助读者从一次性提示词，走向可验证、可停止、可纠错、可交接的 Agent Loop。

## 作品亮点

1. 系统拆解 Prompt、Context、Harness、Loop 的演进关系。
2. 给出一个可控 Loop 的六块积木：Automations、Worktrees、Skills、Connectors、Sub-agents、Memory。
3. 梳理五种常见 Loop 模式：Retry Loop、Plan-Execute-Verify、Explore-Narrow、Human-in-the-Loop、Lifecycle Loop。
4. 展开 Planner / Generator / Evaluator 三角色闭环，说明为什么 Agent 需要独立验收。
5. 用 Codex CLI 搭建一个最小可跑的 CI 自动修复 Loop。
6. 补充失败案例、断路器清单、成本控制清单和人工确认清单。
7. 将 Loop Engineering 落回 Human3.0 主线：人的判断权、数字生产资料和个人系统建设。

## 200 字简介

《Loop Engineering 从入门到进阶手册》是一本写给 AI Agent 实践者的入门小册子。它从 Prompt、Context、Harness、Loop 的演进讲起，拆解一个可控 Loop 的六块积木、五种常见模式，以及 Planner / Generator / Evaluator 三角色闭环。书中用 Codex CLI 搭建一个最小可跑的 CI 自动修复 Loop，并补充模板包、决策表、断路器清单和成本控制清单。适合正在使用 Codex、Claude Code、Cursor 等工具，希望把 AI Agent 用进真实项目流的人。

## 500 字简介

AI Agent 正在从一次性问答，进入持续执行任务的阶段。真正的问题也随之出现：如何让 Agent 不只会生成代码，还能在有目标、有状态、有反馈、有停止规则的系统里工作？

《Loop Engineering 从入门到进阶手册》围绕这个问题展开。

这本书先解释 Prompt、Context、Harness、Loop 的演进，再拆解一个可控 Loop 的六块积木：Automations、Worktrees、Skills、Connectors、Sub-agents、Memory。随后，书中给出五种常见 Loop 模式，包括 Retry Loop、Plan-Execute-Verify、Explore-Narrow、Human-in-the-Loop 和 Lifecycle Loop，帮助读者判断不同任务该选择什么自动化方式。

书中还专门展开 Planner / Generator / Evaluator 三角色闭环，说明为什么 Agent 不能只靠自我确认完成任务，以及如何用外部测试、diff、日志、规则和人工确认来约束输出。

实操部分使用 Codex CLI，搭建一个最小可跑的 CI 自动修复 Loop，从失败日志、TODO 状态文件、Maker 修复、Checker 验收到停止规则，完整跑通一个可复用样板。

附录提供 TODO state file、Planner Prompt、Maker Prompt、Checker Prompt、Evaluator Prompt、成本控制清单、断路器清单和人工确认清单，方便读者直接复用到自己的项目里。

## 作者简介

AI生命克劳德，长期关注 AI Agent、个人系统和 Human3.0。持续写作 AI 编程、Agent 自动化、数字生产资料和内容产品化相关主题，强调人在 AI 时代保留判断权、构建个人系统、沉淀可复用资产。写作风格偏实战和结构化，习惯把真实工具使用、项目流程和内容方法论整理成手册、模板、清单和 SOP。

## 目录概要

- 前言：为什么需要一本 Loop Engineering 手册
- 使用指南：读完之后你应该能做什么
- 第 1 章：从提示词到循环系统
- 第 2 章：Loop 到底是什么
- 第 3 章：六块积木：一个 Loop 靠什么跑起来
- 第 4 章：五种 Loop 模式：不同任务怎么选
- 第 5 章：三角色闭环：谁规划、谁生成、谁验收
- 第 6 章：Codex 实战：从零搭建 CI 自动修复 Loop
- 第 7 章：失败案例：Loop 最容易在哪里失控
- 第 8 章：从工具使用者到系统设计者
- 第 9 章：从 Codex Loop 到 Agent Harness
- 附录 A：Loop Engineering 模板包
- 附录 B：术语表
- 附录 C：事实边界和使用建议

## 版权说明

本书由作者原创文章整理、扩写和重组而成。部分基础内容曾发布在作者本人内容账号，作者保留完整版权，未授权第三方进行商业电子出版。

如微信读书有独家电子版权、内容下架、章节调整或补充材料要求，作者愿意进一步沟通。
