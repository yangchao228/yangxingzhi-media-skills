# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo Overview

This is `yangxingzhi-media-skills` — 一套覆盖自媒体写作全流程的可组合技能体系，总品牌为 `文昌.skill`。

## 文昌.skill — 内容生产体系

**核心设计：**
- `文昌路由.skill` 是主入口，接收用户自然语言需求，判断当前创作阶段，调度合适的子技能或技能链
- 子技能各自负责一个独立环节：探脉（热点）→ 定题（选题）→ 立骨（提纲）→ 起稿（初稿）→ 诊文（诊断）→ 整章（排版）→ 配图（插图）→ 封面（封面文案）→ 出刊（发布）
- 典型调用链路覆盖：从零写全链路、已有题目成文、已有初稿修订、纯视觉补全

**当前落地目录：**
- `content/CONTENT_STATE.md`：内容工作流接力状态标准
- `content/wenchang-router/`：总调度入口
- `content/wenchang-review/`：文章诊断
- `content/wenchang-publish-check/`：发布前检查
- `content/*`：公众号、知乎、小红书、卡片化、成书审查等可复用内容 skills
- `md-img-r2/`：Markdown 图片上传 R2 的底层工具 skill

**典型用户表达：**
- `帮我找最近适合公众号写的 5 个 AI 选题`
- `把这个题做成一篇知乎文章`
- `这篇稿子帮我诊断一下`
- `把这篇改成适合小红书发布的版本`

详见 `README.md` 了解每个子技能的输入/输出、边界和典型调用链路。

## md-img-r2 — 图片 URL 生成能力

`md-img-r2/` 是 `文昌.skill` 体系中的底层图片处理能力，为 `文昌·配图` 和 `文昌·封面` 环节提供**图片上传到公开 URL** 的能力。同时它也可以**独立使用**——不需要依赖文昌其他技能，直接对任意 Markdown 文件执行图片上传和链接替换。

它将 Markdown 中的本地图片上传到 Cloudflare R2，并替换为可公开访问的 URL。

**目录结构：**
```
md-img-r2/
  SKILL.md               # 技能定义 + 使用说明
  skill.json             # 技能元数据
  run.sh                 # 入口脚本
  scripts/md_img_r2.py   # 核心 Python 脚本
  r2-config.env          # R2 配置模板；真实 .env 只放本地，不提交
```

**常用命令：**
```bash
# 单文件替换
bash ./md-img-r2/run.sh path/to/article.md

# 目录批处理
bash ./md-img-r2/run.sh path/to/dir --recursive

# Dry run（不修改文件，只生成报告）
bash ./md-img-r2/run.sh path/to/article.md --dry-run

# 本地 smoke check
./scripts/validate_skills.sh
```

**前置条件：** 需要 Cloudflare R2 凭证（通过 `.env` 或环境变量提供），运行环境需 `python3`，无额外 Python 依赖。

## 开发注意事项

- 这是一个**技能/配置仓库**，不是传统代码项目。没有 build/lint/test 流程。
- 新增 skill 时，参照 `md-img-r2/` 的目录结构：`SKILL.md`（定义）、`skill.json`（元数据）、`run.sh`（入口）、`scripts/`（实现）、`r2-config.env`（配置模板）。
- `.env` 文件不应提交，敏感配置（密钥、account ID 等）一律通过环境变量或 `.env` 提供。
- 所有 skill 的设计目标是**可分发**：别人拿到后只需补齐 `.env` 即可使用。
- 修改或分发前优先跑 `./scripts/validate_skills.sh`，确认元数据、脚本入口、缓存文件和 `md-img-r2` dry-run 样例都正常。
- `content/wenchang-*` 入口必须保留 `examples/minimal-input.md` 和 `examples/expected-output-notes.md`，用于回归验证触发边界和输出结构。

## 成本敏感执行

- 默认先搜索再读文件，先判断范围再生成成品，避免把整仓、长日志或完整聊天历史交给模型。
- 文昌链路必须优先用 `content_state` 和 `handoff` 接力；下一阶段只读正式输出、用户新增材料和必要字段。
- 选题、标题、平台、页数、视觉风格、封面、上传、归档等会导致返工或外部成本的节点，先让用户确认，再生成完整资产。
- 简单整理、标签、摘要、文件清单等任务默认低推理；复杂诊断、跨文件风险、最终审计再使用高推理。
- 卡片和图片类 skill 先输出页数/结构/视觉规范草案，确认后再生成 HTML、PNG、图片提示词或上传动作。
- 不自动取消订阅、降级工具、修改生产配置或发布具体价格；这类动作只提供证据和建议，保留用户判断权。
