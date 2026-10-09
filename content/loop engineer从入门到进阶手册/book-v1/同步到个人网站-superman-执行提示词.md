# 同步《Loop Engineering 从入门到进阶手册》到 Superman 个人站

> 在 `/Users/yangchao/github/superman` 根目录中执行以下提示词。目标是同步网站内容层并完成本地验证；本提示词不包含生产部署、Git 提交或推送。

```text
请将升级后的《Loop Engineering 从入门到进阶手册》同步到 Superman 个人站的橙皮书内容层。

## 目标

将本地权威源稿：

/Users/yangchao/github/skills/yangxingzhi-media-skills/content/loop engineer从入门到进阶手册/book-v1/Loop Engineering 从入门到进阶手册-投稿完整稿.md

同步到已有橙皮书，不新建博客文章、不新建 slug：

- 中文正文：frontend/content/orange-books/zh/loop-engineering-handbook.md
- 英文结构预览：frontend/content/orange-books/en/loop-engineering-handbook.md

这次源稿的核心升级是：

1. 原理章节之后新增第 6 章 `loop-builder：把模糊任务变成受控 Loop`。
2. 第 7 章合并两种实践：CI 自动修复与 UI 精准复刻。
3. 第 8-10 章依次为失败案例、个人系统、Agent Harness。
4. UI 实践新增三张过程图、最小任务卡、Top 3 差异优先级、截图条件和停止交接物。

## 先检查，不要覆盖无关改动

1. 阅读 AGENTS.md、现有中英文橙皮书文件和前端内容解析逻辑。
2. 执行 git status --short --branch，保留现有未跟踪的 output/ 和任何无关改动。
3. 读取权威源稿；它当前是本地工作树里的最新版本，即使尚未提交，也以它为准。
4. 确认目标仍为 type: orangeBook 且 slug: loop-engineering-handbook；不要调用博客导入流程，不要改 frontend/content/blog/。

## 中文橙皮书更新规则

1. 原地更新 frontend/content/orange-books/zh/loop-engineering-handbook.md。
2. 保留既有的 id、type、locale、slug、volume、order、publishedAt、displayDate、status: published、seriesStatus: published 和 cta。
3. 用源稿从 H1 开始的完整 Markdown 正文替换现有正文，确保目录、章节编号、7 天落地计划和三个附录完整一致。
4. 更新 frontmatter：
   - updatedAt: 2026-07-12
   - chapters: 10
   - summary: "一本面向开发者、技术管理者、产品人与个人系统建设者的完整手册，系统讲清从 Loop 原理、任务设计到 CI 自动修复与 UI 精准复刻，如何把 AI Agent 协作升级为可验证、可停止、可交接的循环系统。"
5. 不要凭空估算 pages。除非仓库已有可复核的最新 PDF 页数证据，否则保留现有 pages 值。

## UI 图片处理

源稿中的以下三张图片是本地相对路径，不能原样写入 Superman：

- /Users/yangchao/github/skills/yangxingzhi-media-skills/content/loop engineer从入门到进阶手册/13-ui-visual-match-assets/01-target-vs-first-version.png
- /Users/yangchao/github/skills/yangxingzhi-media-skills/content/loop engineer从入门到进阶手册/13-ui-visual-match-assets/02-date-card-fixed.png
- /Users/yangchao/github/skills/yangxingzhi-media-skills/content/loop engineer从入门到进阶手册/13-ui-visual-match-assets/03-final-target-vs-current.png

要求：

1. 只处理这三张新增本地图片；源稿中已有的 https 图片保持原 URL，不重复上传。
2. 使用已安装的 md-img-r2 能力或项目内等价的 R2 上传流程，将三张图片变为 https://images.reai.group/ 下的可公开访问 URL。
3. 在中文橙皮书中把这三处相对路径替换为上传后的 URL，并保留已有中文 alt 文本。
4. 如果 R2 上传能力、凭证或网络不可用，停止在内容同步完成之前：不要把本地绝对路径或 ../ 相对路径写入网站内容；明确报告阻塞的三张文件和所需权限。

## 英文结构预览更新规则

英文页仍是结构预览，不在本次生成整本英文译稿。

1. 保持相同 slug、type、locale、volume、status: seed、seriesStatus: planned 和英文阅读定位。
2. 更新 updatedAt 为 2026-07-12，chapters 为 10；pages 保持现有值，除非有实际分页证据。
3. 更新 Structure Preview，使其准确反映中文版：
   - Part 1: Why Loop Engineering matters
   - Part 2: Loop structures and patterns
   - Part 3: loop-builder as a task-design aid
   - Part 4: Two practices — CI auto-repair and UI visual matching
   - Part 5: Failure boundaries, personal systems, and Agent Harness
   - 7-day implementation plan and three appendices
4. 更新 Publication Note，说明中文版公开版 v1.1 已同步本次结构；英文完整版仍待后续单独翻译。

## 约束

- 不改变导航、页面布局、内容解析器、路由或视觉样式。
- 不覆盖其他橙皮书、博客、产品或资源条目。
- 不更新发布日 publishedAt；本次只更新 updatedAt。
- 不删除已有远程图片，不将本地图片提交进 Git。
- 不执行 git add、commit、push，也不执行 Vercel 生产部署。
- 不把本次“内容同步”描述成英文全书已经发布。

## 验证与交付

完成写入后：

1. 确认中文正文不再出现 ../13-ui-visual-match-assets/、源项目绝对路径或旧的 6-9 章目录结构。
2. 确认中英文 frontmatter 的 slug 相同，中文为 published / published，英文为 seed / planned。
3. 执行 npm run lint、npm run build 和 git diff --check。
4. 抽查中文和英文橙皮书详情页对应路由，确认标题、目录、图片、表格、代码块和语言切换均正常。
5. 更新 todo.md：记录本次橙皮书同步、三张图片的公开 URL、验证结果和“未部署生产”的边界，并在末尾补一段简短 Review。
6. 最终报告只列出：改动文件、图片 URL、验证结果、未部署生产，以及任何阻塞项。
```
