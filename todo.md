# todo

## 2026-04-26 md-img-r2 可分发收尾

- [x] 确认当前仓库实际进展和已跟踪文件
- [x] 清理不应进入版本库的系统/缓存文件
- [x] 统一 `md-img-r2` 的分发路径说明
- [x] 移除或修正不存在的打包脚本说明
- [x] 执行基础验证

### review

- 已将 `.DS_Store` 和 Python `__pycache__` 从 Git 跟踪中移除，依靠 `.gitignore` 防止再次进入版本库。
- 已统一分发路径为 `md-img-r2/`，避免文档、元数据和脚本错误提示指向旧目录。
- 已把不存在的 `scripts/package_skill.py` 打包说明改成直接压缩 skill 目录，降低分发前置复杂度。
- 已通过 `py_compile` 和 `./md-img-r2/run.sh --help` 做基础验证。

## 2026-04-26 skill 本地快速验证

- [x] 明确验证目标：本地开发可快速跑，分发前可作为 smoke check
- [x] 新增统一验证脚本
- [x] 补充 README/CLAUDE 使用说明
- [x] 执行验证脚本
- [x] 记录 review

### review

- 已新增 `scripts/validate_skills.sh`，覆盖 skill 元数据、`skill.json`、入口脚本、Python 语法、旧路径引用、Git 跟踪污染文件和 `md-img-r2` dry-run 样例。
- 验证脚本使用 `/tmp` 生成临时 Markdown 和图片，不依赖真实 R2，不向仓库写测试产物。
- 已修正脚本为 macOS 默认 Bash 兼容写法，避免依赖 `mapfile`。
- 已通过 `./scripts/validate_skills.sh`。

## 2026-05-09 文昌内容工作流第一版

- [x] 迁移现有 `content` skills 到当前仓库
- [x] 标准化缺失 frontmatter 和 `skill.json`
- [x] 新增 `wenchang-router` 总路由
- [x] 新增 `wenchang-review` 文章诊断
- [x] 新增 `wenchang-publish-check` 发布前检查
- [x] 执行统一验证
- [x] 记录 review

### review

- 已把现有内容创作 skills 迁移到 `content/`，形成公众号、知乎、小红书、卡片化、成书审查的第一版能力池。
- 已新增 `wenchang-router`、`wenchang-review`、`wenchang-publish-check`，补齐总调度、文章诊断、发布前检查三个关键缺口。
- 已修正迁移模块中缺失的 frontmatter、`skill.json` 和 `source_dir`。
- 已修复 `human3-book-guardian-v6` 中两个不可编译脚本，保证统一验证可跑通。
- 已更新验证脚本，排除 `dist/` 打包产物，避免本地包影响开发验证。
- 已通过 `./scripts/validate_skills.sh`。

## 2026-05-09 文昌 SOP 接力优化

- [x] 新增 `content_state` 标准
- [x] 改造 `wenchang-router` 输出接力状态
- [x] 改造 `wenchang-review` 输出诊断状态更新
- [x] 改造 `wenchang-publish-check` 输出发布资产状态更新
- [x] 补齐核心入口最小回归样例
- [x] 收敛卡片类 skill 的触发边界
- [x] 执行统一验证
- [x] 记录 review

### review

- 已新增 `content/CONTENT_STATE.md`，把选题、写作、诊断、发布、分发、归档统一成可接力状态对象。
- 已让 `wenchang-router`、`wenchang-review`、`wenchang-publish-check` 明确输出 `content_state` 更新，减少不同 skill 之间重新理解上下文。
- 已为三个核心入口补充最小输入和预期输出说明，后续可用于人工回归或自动验证。
- 已收敛 `long-to-cards`、`wechat-to-cards`、`redbook-cards`、`xiaohongshu-viral-image-skill-v4` 的触发边界，降低卡片类 skill 互相抢任务的风险。
- 已升级 `scripts/validate_skills.sh`，要求 `content/wenchang-*` 入口必须带最小回归样例。
- 已通过 `./scripts/validate_skills.sh` 和 `git diff --check`。
