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
