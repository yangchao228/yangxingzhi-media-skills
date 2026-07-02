---
name: superman-blog-publisher
description: >
  在 superman 个人站项目内通过自然语言发布 Markdown 博客文章。
  当用户说"发布博客"、"把这篇 md 发到博客"、"导入这篇文章"、
  "上传 Markdown 文章"、"补英文版博客"、"导入 released 目录"、
  "把微信公众号 released 作品上传到博客"或提供博客草稿并希望上线到站点时使用。
  Codex 应自动生成/补齐 frontmatter，处理本地图片到 R2，写入 frontend/content/blog，
  并完成 lint/build 与必要的本地页面验证。
---

# Superman Blog Publisher

## 使用方式

这是项目内 Codex skill。用户不需要手动执行脚本。

当用户用自然语言提出以下请求时，Codex 直接调用本 skill 的流程：

- "把这篇 md 发布到博客"
- "导入这篇文章"
- "发布一篇新博客"
- "把 raw 里的这篇文章放到个人站"
- "补这篇博客的英文版"
- "这篇文章上线到 superman"
- "把 released 目录里的作品上传到博客"
- "批量导入微信公众号 released 作品"

脚本只作为 Codex 的内部工具。不要要求用户复制命令、手动运行脚本或自己整理 frontmatter。

## 项目路径

仓库：`/Users/yangchao/github/superman`

内容目录：

- 中文博客：`frontend/content/blog/zh/{slug}.md`
- 英文博客：`frontend/content/blog/en/{slug}.md`

辅助脚本：

- `.codex/skills/superman-blog-publisher/scripts/import_blog_md.py`
- `.codex/skills/superman-blog-publisher/scripts/import_released_dir.py`

## 单篇发布流程

1. 读取用户提供的 Markdown、raw 草稿或指定文件。
2. 判断主语言、标题、发布日期、分类、标签、摘要和 slug。
3. 如果用户没有给 slug，生成稳定 kebab-case slug；同一篇文章的中英文版本必须共用一个 slug。
4. 清理正文：
   - 移除正文开头重复 H1。
   - 移除开头无意义分隔线。
   - 保留二级标题、三级标题、引用、列表、代码块和重点加粗。
5. 写入中文版本：
   - 如果源稿是中文，直接整理成 `frontend/content/blog/zh/{slug}.md`。
   - 如果源稿是英文，需要先生成中文版本，再写入中文目录。
6. 最后补英文版：
   - 如果源稿是中文，忠实翻译为英文。
   - 如果用户只要求补英文版，则沿用已有中文文件的 slug、发布日期和主题结构。
   - 英文标题、summary、category、tags 必须自然英文表达。
7. 写入英文版本 `frontend/content/blog/en/{slug}.md`。
8. 运行验证：
   - `cd frontend && npm run lint`
   - `cd frontend && npm run build`
   - 如已启动本地服务或需要页面验证，检查 `/zh/blog/{slug}` 与 `/en/blog/{slug}`。
9. 更新 `todo.md`：
   - 加 checklist。
   - 完成后补 Review。
10. 最终回复只说明产物路径、验证结果和未处理风险。

## released 目录批量导入流程

当用户要求导入 `/Users/yangchao/my_knowledge_space/微信公众号/released` 或类似已发布作品目录时，使用这个流程。

默认目标是把作品先沉淀进中文博客内容层，形成可维护资产；不要一次性强行补全所有英文版，除非用户明确要求。

1. 先检查工作区：
   - `git status --short --branch`
   - 不要 stage 或覆盖与本次导入无关的改动。
2. 扫描源目录并生成导入计划：
   - 递归查找 `.md` 文件。
   - 默认排除 `.venv`、`node_modules`、`site-packages`、隐藏目录和构建产物目录。
   - 跳过空稿、正文为空的稿子、重复内容。
   - 用去 frontmatter 后的正文 hash 去重。
   - 读取已有 `frontend/content/blog/import-released-report.json`，避免重复导入历史已处理文章。
3. 图片处理必须走 R2：
   - 不要使用 PicList。
   - 不要把本地图片提交到 GitHub。
   - 使用 `md-img-r2` 或本 skill 的批量脚本 staging 模式，把 Markdown 里的本地图片替换成 `https://images.reai.group/...` URL。
   - 如果 R2 报告里有 `upload_failed`，先重试；仍失败时不要把对应本地图片路径写入博客。
4. 为每篇候选文章整理元数据：
   - title：优先取文章 H1，其次取文件名；明显像内部标题或模板标题时人工改写。
   - slug：使用稳定英文 kebab-case；不确定时先生成候选，再由 Codex 调整为可读 slug。
   - summary：写成面向读者的摘要，不直接复制开头废话。
   - category/tags：按目录主题归类，例如 `AI 实践`、`Codex 实践`、`Human 3.0`、`家庭协作`、`特征治理`。
   - status：能公开阅读的设为 `published`；大纲、模板、重复改写、内部素材设为 `draft` 或跳过。
5. 批量写入：
   - `--apply` 前必须先有 Codex 审过的 manifest；不要直接把自动猜测的 slug/title/summary 批量写入公开内容。
   - 默认写入 `frontend/content/blog/zh/{slug}.md`。
   - 保留正文结构，但清理重复 H1、无意义分隔线、公众号口播残留和明显内部备注。
   - 已存在目标文件时先读现有文件，除非用户明确要求覆盖。
6. 生成或更新报告：
   - `frontend/content/blog/import-released-report.json`
   - 记录 `created`、`skipped`、`duplicateOf`、`hash`、`source`、`target`。
7. 验证：
   - `cd frontend && npm run lint`
   - `cd frontend && npm run build`
   - 抽查 `/zh/blog` 与 2-3 篇新增文章详情。
8. 收尾：
   - 更新 `todo.md` 时只写本次导入事项。
   - 如用户要求上线，配合 `superman-vercel-deploy` skill 发布到 Vercel `superman` 项目。

## Frontmatter 规范

字段顺序固定：

```yaml
---
id: "blog-{slug}-{locale}"
type: "blog"
locale: "{zh|en}"
title: "..."
slug: "{same-slug-for-both-locales}"
summary: "..."
category: "..."
tags: ["...", "..."]
status: "published"
publishedAt: "YYYY-MM-DD"
displayDate: "2026年5月9日"
readingTime: "5 分钟阅读"
---
```

英文版：

- `displayDate`: `May 9, 2026`
- `readingTime`: `5 min read`
- `category`: 常用 `Method`, `Systems Architecture`, `Design Systems`, `Product`
- `tags`: 使用自然英文，例如 `AI`, `Personal Systems`, `Human 3.0`

中文版：

- `displayDate`: `2026年5月9日`
- `readingTime`: `5 分钟阅读`
- `category`: 常用 `方法论`、`系统架构`、`设计系统`、`产品`
- `tags`: 中文优先，必要术语可保留英文，例如 `AI`、`Agent`、`Human 3.0`

## 内部脚本用法

Codex 可用脚本生成标准文件，但不要把命令作为用户操作步骤输出。

示例：

```bash
python3 .codex/skills/superman-blog-publisher/scripts/import_blog_md.py \
  --source /path/to/source.md \
  --locale zh \
  --slug example-slug \
  --title "中文标题" \
  --summary "中文摘要" \
  --category "方法论" \
  --tags "AI,个人系统,Human 3.0" \
  --published-at 2026-05-09 \
  --force
```

批量扫描 released 目录，先生成计划：

```bash
python3 .codex/skills/superman-blog-publisher/scripts/import_released_dir.py \
  --source-root /Users/yangchao/my_knowledge_space/微信公众号/released \
  --report /private/tmp/superman-released-import-plan.json
```

批量导入时，优先提供 Codex 审过的 manifest，并开启图片 R2 处理：

```bash
python3 .codex/skills/superman-blog-publisher/scripts/import_released_dir.py \
  --source-root /Users/yangchao/my_knowledge_space/微信公众号/released \
  --manifest /private/tmp/superman-released-manifest.json \
  --upload-images \
  --apply
```

## 判断规则

- 如果目标文件已存在，先读现有文件，再决定覆盖、补齐或保留。
- 如果用户要求"发布"，默认写入 `status: "published"`。
- 如果文章尚未完成，只在用户明确说"先放草稿"时使用 `status: "draft"`。
- 单篇正式发布时，如果只收到中文稿，默认补英文版；released 批量归档默认先中文入库，英文版只给精选文章补。
- 如果只收到英文稿，也要补中文版，因为本站中文是主 audience。
- 不要把 raw 草稿、私人备注、密钥、cookie、内部账号信息写入博客正文。
- 不要改变站点视觉、导航或页面结构。
