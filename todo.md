# todo

## 2026-05-26 文昌写作 skill 优化

- [x] 阅读现有 `wechat-writing-skill-ai-human3` 写作规则和调用提示
- [x] 搜罗并提炼卡兹克写作 skill、横纵分析法和公众号 AI 写作流程资料
- [x] 给写作 skill 增加起稿前质检、AI/人边界、文章原型和研究转写规则
- [x] 给系统提示补充第一屏、活人感、干货密度、事实边界和长期资产自检
- [x] 更新 README 和切角库，方便后续继续迭代
- [x] 执行验证

### review

- 已把卡兹克写作 skill 里的“好奇心/知识增量/共鸣”“活人感”“AI 与人的边界”“文章原型”“四层自检”等方法，转译成适合文昌和 Human3.0 的写作规则，没有照搬卡兹克人设。
- 已吸收横纵分析法的“纵向变化 + 横向对比 + 交汇判断”，用于把 `content_state.research` 从资料包转成文章主判断。
- 已补充公众号 AI 写作流程里的分阶段起稿、标题兑现、结构先行、人工复核和手机端阅读约束。
- 已通过 `./scripts/validate_skills.sh`。

## 2026-05-26 AI/Codex 降本规则固化

- [x] 将降本清单固化到仓库级工作规则
- [x] 给文昌总控和路由补成本敏感执行闸门
- [x] 给卡片/图片类 skill 补“先确认结构，再生成成品”的默认约束
- [x] 增加校验，防止降本规则后续被删掉
- [x] 执行基础验证
- [x] 记录 review

### review

- 已把 AI/Codex 降本从 `docs/goals/ai-cost-savings` 的建议资产，固化为仓库级 `CLAUDE.md` 和 `README.md` 规则。
- 已在 `wenchang-orchestrator` 和 `wenchang-router` 增加成本敏感闸门：先判断入口、先确认高返工节点、优先使用 `content_state` / `handoff`，不在方向未定时生成全文、多平台版本、卡片或封面。
- 已在 `wechat-to-cards`、`redbook-cards`、`long-to-cards`、`xiaohongshu-viral-image-skill-v4` 中加入卡片/图片降本规则：先确认页数、结构、风格和输出形式，再生成 HTML、PNG、出图提示词、上传或发布动作。
- 已在 `scripts/validate_skills.sh` 增加成本规则校验，防止关键 skill 后续丢失成本敏感执行约束。
- 已通过 `./scripts/validate_skills.sh`。

## 2026-05-26 AI 学习主权 03 写作篇公众号流程

- [x] 使用文昌总控从明确主题进入定题节点
- [x] 读取 `ai_study` 系列规划和既有编程篇上下文
- [x] 采证：OpenAI Study Mode、MIT Media Lab 写作研究、Science Advances / Nature Human Behaviour 创意多样性研究
- [x] 立骨：收敛为“用 AI 学写作，保留观点、素材、结构和语气”
- [x] 起稿：生成公众号主稿
- [x] 诊文/出刊：补标题、摘要、标签、朋友圈文案、评论区引导和 content_state
- [x] 更新 `ai_study` 系列索引
- [x] 执行基础验证

### review

- 新稿定位为“别把学习外包给 AI”系列第三篇，文件为 `ai_study/03-ai-writing-learning-wechat.md`。
- 主线收敛为：AI 写作最值得用的地方，是反问、诊断、补反例、整理素材，逼作者把自己的观点、结构和语气说清楚。
- 已保留关键反向边界：不能污名化 AI 写作；MIT 写作研究为预印本，不能过度外推；AI 可能提升单篇输出，但会带来表达趋同风险。
- 已按用户要求去 AI 味并收紧段落：减少碎换行，压缩模板化表达，保留证据、prompt 和验收清单。
- 已按用户更新后的公众号写作 skill 重新生成 v2 版，文件为 `ai_study/03-ai-writing-learning-wechat-v2.md`，保留旧版不覆盖。
- 当前已推进到出刊检查；下一步需要用户确认最终标题、是否生成公众号封面，以及是否进入 Human3.0 成书归档审查。

## 2026-05-25 文昌技能包 v2 稳定性升级

- [x] 新增 `content_state` schema，明确字段、类型和决策日志结构
- [x] 将人工判断节点沉淀为 `decisions`，避免多轮流程丢失用户拍板
- [x] 升级 fixture 校验，覆盖状态合同、停顿节点和阶段边界
- [x] 增加负向回归样例，防止低可信采证、无反向证据、出刊改正文等跑偏
- [x] 更新文昌核心技能说明和用户指南
- [x] 运行 `./scripts/validate_skills.sh`

### review

- 已新增 `content/content_state.schema.json`，把文昌接力对象从纯文档约定推进到机器可读合同。
- 已在 `content/CONTENT_STATE.md`、总控、路由、诊文、出刊中加入 `decisions` 结构，用户确认的标题、封面、卡片、归档等判断不再只留在聊天历史。
- 已升级 `scripts/validate_content_fixtures.py`，增加状态合同、反向证据、低可信停顿、出刊不改正文、归档需人工确认等回归检查。
- 已新增 `content/fixtures/regression-boundaries/` 负向边界样例，覆盖低可信采证、缺反向证据、出刊退回诊文、决策日志记录。
- 已为 5 个文昌核心技能补 `agents/openai.yaml`，并在 `scripts/validate_skills.sh` 中加入基础校验。
- 已通过 `./scripts/validate_skills.sh` 和本轮文件的 `git diff --check`。

## 2026-05-22 AI 学习主权 02 编程篇公众号流程

- [x] 使用文昌总控从明确主题 + 参考稿进入定题节点
- [x] 读取参考稿 `2026-05-22-ai-era-qualified-engineer-wechat-zhihu-xhs.md`
- [x] 补采证：Claude Code Learning output style、NotebookLM 官方帮助、Anthropic AI 编程学习研究、OpenAI Harness Engineering
- [x] 立骨：将 Prompt / Context / Harness 转化为 AI 编程学习路线
- [x] 起稿：生成公众号主稿
- [x] 诊文/整章：确认主线承接系列开篇，且未逐段复述参考稿
- [x] 出刊：补标题、摘要、标签、朋友圈文案、评论区引导和 content_state
- [x] 更新 `ai_study` 系列索引和第二篇管理稿
- [x] 执行基础验证

### review

- 新稿定位为“别把学习外包给 AI”系列第二篇，文件为 `ai_study/02-ai-programming-learning-engineer-model-wechat.md`。
- 本次未直接沿用旧三平台编程稿；处理方式是把 Prompt / Context / Harness 能力模型转成“如何训练这些能力”的公众号稿。
- 主线收敛为：NotebookLM 管资料底座，Claude Learning 管小步练习，真实项目和 Harness 管验收。
- 当前已推进到出刊检查；下一步需要用户确认最终标题、是否生成公众号封面，以及是否进入 Human3.0 成书归档审查。
- 已清理主稿里的工作流痕迹：正文和 `content_state` 不再出现读者不可见的内部引用、路径和上下文指代。
- 已按诊文建议完成轻改：压缩重复开头，用 `POST /todos` 作为贯穿案例，补强 Harness 具体验收例子，并重写结尾收束。
- 已按用户要求提升信息密度：补入国外 vibe coding 讨论、Anthropic 技能形成研究和 OpenAI Harness Engineering 对学习闭环的启发。
- 已重写正文开头钩子：从“常见用法”改为“AI 让人提前获得掌握幻觉”的反差判断。
- 已在开头补充读者收益承诺：能力清单、工具组合训练系统和 7 天练习路线。
- 已澄清 Harness 相关表述：避免把 Harness 学习法写成既有术语，改为“把 Harness Engineering 降维成个人学习闸门”。
- 已通过 `git diff --check -- todo.md ai_study/README.md ai_study/02-programming-training-system.md ai_study/02-ai-programming-learning-engineer-model-wechat.md`，并检查新稿没有使用生硬对照句式。

## 2026-05-22 AI 志愿填报公众号内容流程

- [x] 使用文昌总控从明确主题进入定题节点
- [x] 采证：核验教育部阳光志愿、AI 志愿产品、付费规划师风险与反向证据
- [x] 立骨：收敛公众号主线与读者获得感
- [x] 起稿：生成公众号 Markdown 草稿
- [x] 诊文/整章：检查论证闭环、干货密度和 Human3.0 贴合度
- [x] 出刊：补标题、摘要、标签、朋友圈文案和阻塞项
- [x] 停在配图/卡片/归档判断节点

### review

- 已按文昌总控从“已有明确主题”进入定题，并自动推进到出刊检查。
- 采证覆盖教育部“阳光志愿”、2025 高考云咨询周、高考志愿规划师职业资格提示、志愿填报服务乱象调查、北京市场监管案例、AI 志愿填报产品测评和 HCI 研究。
- 主线收敛为：AI 可以做信息过滤器和风险整理器，但不能替孩子完成关于城市、专业、代价和生活方式的人生判断。
- 公众号内容包已落到 `content/outputs/2026-05-22-ai-gaokao-choice-wechat.md`。
- 当前建议为补齐封面后可发布；下一步需要用户确认最终标题、是否生成公众号封面/流程图，以及是否进入 Human3.0 成书归档审查。

## 2026-05-22 AI 伴侣与未成年人公众号内容流程

- [x] 使用文昌总控从明确主题进入定题节点
- [x] 采证：核验 AI 伴侣、AI 玩具、未成年人监管近期来源
- [x] 立骨：收敛公众号主线与读者获得感
- [x] 起稿：生成公众号 Markdown 草稿
- [x] 诊文/整章：检查焦虑开头、论证闭环和 Human3.0 贴合度
- [x] 出刊：补标题、摘要、标签、朋友圈文案和阻塞项
- [x] 停在配图/卡片/归档判断节点

### review

- 已按文昌总控从“已有明确主题”进入定题，并自动推进到出刊检查。
- 采证覆盖中国拟人化互动服务管理办法、FTC 调查、Common Sense Media 青少年 AI 伴侣调查、OUP 青少年社交关系研究、AI 玩具安全倡议和 Mozilla 联网玩具安全报告。
- 主线收敛为：AI 伴侣进入儿童关系场后，真正需要警惕的是关系能力被外包。
- 公众号内容包已落到 `content/outputs/2026-05-22-ai-companion-children-relationship-skills-wechat.md`。
- 当前出刊建议为补齐封面后可发布；下一步需要用户确认是否生成公众号封面，以及是否进入 Human3.0 成书归档审查。

## 2026-05-21 AI成本账 02 三平台出刊流程

- [x] 使用文昌总控从已生成公众号稿进入诊文节点
- [x] 读取原稿并保留公众号正文主体，不覆盖源文件
- [x] 诊文：判断为轻改后发布
- [x] 出刊：补公众号标题、摘要、封面文案、标签、朋友圈文案和评论引导
- [x] 平台适配：补知乎最小改动发布包
- [x] 小红书：拆成 8 页图文方案、统一视觉规范、逐页出图提示词和发布配文
- [x] 快检 OpenAI / Anthropic 官方来源，确认输入、输出、缓存、推理相关表述方向成立
- [x] 停在配图/卡片/归档判断节点

### review

- 本轮没有修改原始公众号稿 `/Users/yangchao/my_knowledge_space/微信公众号/drafts/AI成本账/AI成本账02-Token经济学入门.md`。
- 出刊包已落到 `content/outputs/2026-05-21-ai-cost-token-economics-wechat-zhihu-xhs.md`。
- 公众号和知乎遵循“尽量不修改原文”的要求：公众号只补发布资产；知乎只建议替换首屏和文末，主体沿用。
- 小红书按 8 页图文卡处理，方向是收藏型清单，不直接搬公众号长文。
- 当前下一步需要用户确认：是否生成公众号封面、小红书 8 页卡片，以及是否进入 Human3.0 成书归档审查。

## 2026-05-20 AI 学习主权系列目录

- [x] 新增 `ai_study/` 作为“别把学习外包给 AI”系列统一管理目录
- [x] 新增 `ai_study/README.md` 作为系列入口和文件索引
- [x] 新增 `ai_study/series-plan.md`，明确栏目定位、目标读者、选题地图和统一写作约束
- [x] 新增开篇总纲 `ai_study/01-dont-outsource-learning-to-ai.md`
- [x] 将现有编程篇纳入 `ai_study/02-programming-training-system.md` 管理
- [x] 执行基础验证

### review

- 系列主名收敛为“别把学习外包给 AI”，比“AI 学习主权”更适合传播；“AI 学习主权”保留为方法论定位。
- 开篇总纲不讲单一工具，先立住底层判断：AI 可以帮助解释、拆解、陪练、反馈和复盘，但提出假设、亲手练习、识别错误、复盘迁移必须留给人。
- 编程篇不移动旧产物，保留 `content/outputs/2026-05-19-ai-programming-training-system-wechat-zhihu-xhs.md` 作为完整三平台内容包；`ai_study/02-programming-training-system.md` 负责系列目录内的管理、定位和复用说明。
- 已通过 `git diff --check -- todo.md ai_study/...`，并检查本轮新增 `ai_study/` 文件没有继续使用“不是……而是……”句式。
- 下一步可优先生成开篇总纲的封面和小红书卡片，也可以继续写第三篇“写作篇”。

## 2026-05-20 开篇总纲封面与小红书卡片

- [x] 为 `ai_study/01-dont-outsource-learning-to-ai.md` 生成公众号封面
- [x] 拆出小红书 8 页卡片
- [x] 新增 SVG 源文件和 HTML 预览页
- [x] 新增精确尺寸 PNG 渲染脚本
- [x] 导出公众号封面 PNG `1400x596`
- [x] 导出小红书卡片 PNG `1080x1440`
- [x] 将图片资产路径写回开篇稿和资产 README
- [x] 执行基础验证

### review

- 资产目录为 `ai_study/assets/01-dont-outsource-learning/`。
- 公众号封面路径：`ai_study/assets/01-dont-outsource-learning/png/wechat-cover.png`。
- 小红书卡片路径：`ai_study/assets/01-dont-outsource-learning/png/01-cover.png` 到 `08-series-preview.png`。
- SVG 与 `preview.html` 用于快速预览和后续改版；`render_pngs.py` 用 Pillow 直接渲染精确尺寸 PNG，避免 Quick Look 把 3:4 卡片导出成方图。
- 已通过 `git diff --check -- todo.md ai_study`、`python -m py_compile render_pngs.py`，并用 `file` 核对封面与卡片 PNG 尺寸。
- 已将开篇总纲正文里的流程型小标题改成发布型小标题，尤其把“结尾”“结尾互动”改成“最后，把学习主权拿回来”“下一次问 AI，先写下这三句话”。
- 已补小红书发布文案：标题候选、正文描述、简短口语版、热门话题标签、评论区引导和收藏引导。

## 2026-05-19 AI 编程训练系统三平台内容流程

- [x] 使用文昌总控从已确认主切口继续推进
- [x] 采证：核验 Claude Code Learning output style、NotebookLM 官方能力与 Anthropic AI 编程学习研究
- [x] 立骨：收敛为“NotebookLM 管资料，Claude Learning 管练习，真实项目管验收”
- [x] 起稿：生成公众号正文
- [x] 平台适配：生成知乎回答版、小红书 9 页图文方案和发布配文
- [x] 出刊：补标题、摘要、标签、朋友圈文案、prompt 模板库和阻塞项
- [x] 停在配图/卡片/归档判断节点

### review

- 本轮没有覆盖旧稿 `2026-05-19-ai-learning-not-outsourced-wechat-xhs.md`，而是另起更贴合当前主题的新三平台内容包。
- 主线从泛学习风险收敛为“AI 编程训练系统”：NotebookLM 负责资料底座和自测，Claude Code Learning output style 负责小步练习，真实项目与测试负责验收。
- 采证保留限制条件：Anthropic 研究不能被外推成所有 AI 编程辅助都会削弱能力；NotebookLM 不是代码执行环境；Learning mode 也不能替代用户自己的动手。
- 稿件位置：`content/outputs/2026-05-19-ai-programming-training-system-wechat-zhihu-xhs.md`。
- 当前下一步需要用户确认：是否生成公众号封面、9 页小红书卡片，以及是否进入 Human3.0 成书归档审查。

## 2026-05-19 不要将学习外包给 AI 内容流程

- [x] 使用文昌总控进入定题节点
- [x] 用户确认主切口：你不是在用 AI 学习，你是在让 AI 替你记住
- [x] 采证：核验 Anthropic、MIT/arXiv、CHI 2026 与学习模式相关来源
- [x] 起稿：生成公众号正文
- [x] 平台适配：生成小红书 8 页图文方案与发布文案包
- [x] 出刊：补标题、摘要、标签、转发文案和阻塞项
- [x] 按用户确认修改标题为“不要将学习外包给AI”
- [x] 生成小红书 8 页 HTML 图文卡片预览
- [x] 进入 Human3.0 成书归档审查并落盘

### review

- 已按用户要求避免翻译原文，改写为 Human3.0 方向的原创判断文。
- 主线收敛为：AI 可以替你完成任务，但不能替你长出能力；关键是保留假设、理解、校准和复盘。
- 采证阶段保留了研究限制，避免把 MIT 预印本和特定任务研究夸大成普遍定论。
- 已同时交付公众号正文、小红书图文方案、发布文案包和出刊阻塞项。
- 用户确认后，已将标题改为“不要将学习外包给AI”，并新增小红书 HTML 卡片预览。
- 成书守门员判断为通过，归入 Part 2｜认知主权。
- 稿件位置：`content/outputs/2026-05-19-ai-learning-not-outsourced-wechat-xhs.md`。
- 卡片位置：`content/assets/2026-05-19-ai-learning-not-outsourced-xhs.html`。
- 归档位置：`human3.0_book/entries/2026-05-19-ai-learning-not-outsourced.md`。

## 2026-05-19 gstack × 判断力稿出刊归档

- [x] 读取 `content/outputs/2026-05-19-execution-judgment-virtual-team-wechat.md`
- [x] 核验 gstack GitHub 与 Anthropic playbook 当前来源
- [x] 补充出刊检查
- [x] 完成 Human3.0 成书审查
- [x] 新增 `human3.0_book` Part 3 归档条目
- [x] 执行验证
- [x] 记录 review

### review

- 已在稿件末尾补充出刊检查，当前建议为补齐封面后可发布。
- 已完成成书审查，结论为通过，建议归入 Part 3《结构杠杆》中的“从聊天框到虚拟团队”小节。
- 已新增 `human3.0_book/entries/2026-05-19-execution-judgment-virtual-team.md`，并在 `human3.0_book/materials.md` 中补索引。
- 当前 `materials.md` 同时包含“不要将学习外包给AI”索引；为了保持索引和 entry 一致，本轮最新内容产物提交应包含两篇 2026-05-19 内容与对应归档。
- 已通过 `python3 scripts/validate_human3_book.py`、`./scripts/validate_skills.sh` 和 `git diff --check`。

## 2026-05-19 gstack × 判断力公众号融合稿

- [x] 读取 gstack 虚拟团队稿和“执行力便宜，判断力昂贵”归档稿
- [x] 核验 gstack GitHub 与 Anthropic playbook 关键事实
- [x] 融合热点、观点和个人工作流经验
- [x] 落盘公众号 Markdown 初稿
- [x] 记录 review

### review

- 已将 gstack 的“虚拟团队”热点入口，与 Anthropic playbook 暴露的“创始人从执行者转向调度者”趋势合并。
- 新稿主线收敛为：执行力降价后，真正变贵的是判断系统和组织 AI 的能力。
- 已把文昌流程作为个人真实案例嵌入正文，避免只做热点评论。
- 稿件位置：`content/outputs/2026-05-19-execution-judgment-virtual-team-wechat.md`。

## 2026-05-19 历史内容归档迁移

- [x] 读取 `content/outputs/` 中已完成成书审查的两篇历史文章
- [x] 将 Codex 工作台文章归入 `human3.0_book` Part 3
- [x] 将 gstack 虚拟团队文章归入 `human3.0_book` Part 3
- [x] 执行验证
- [x] 记录 review

### review

- 已将两篇历史内容从 `content/outputs/` 的成书审查结果迁入 `human3.0_book/materials.md` 的 Part 3。
- 已新增 `human3.0_book/entries/2026-05-18-codex-workbench.md` 和 `human3.0_book/entries/2026-05-18-gstack-virtual-team.md`。
- 归档条目保留成书判断、最小纠偏、发布包和正文快照摘要，不依赖 `content/outputs/` 原产物入库。
- 已通过 `python3 scripts/validate_human3_book.py`、`./scripts/validate_skills.sh` 和 `git diff --check`。

## 2026-05-19 Human3.0 归档机制收口

- [x] 盘点未跟踪目录和验证阻塞
- [x] 将 `.codex/` 明确为本地 Codex skill install/cache
- [x] 修正 `validate_skills.sh`，避免扫描 `.codex/`
- [x] 新增 `scripts/validate_human3_book.py`
- [x] 将 Human3.0 归档校验接入统一验证
- [x] 更新成书守门员 README/SKILL，优先面向 `human3.0_book/` 归档
- [x] 执行验证
- [x] 记录 review

### review

- 已确认 `.codex/` 是本地 skill install/cache 镜像，且包含 `.env`，不进入版本库；已在 `.gitignore` 忽略。
- 已修正 `validate_skills.sh`，技能扫描、Python 编译和 stale reference 扫描都排除 `.codex/`。
- 已新增 `scripts/validate_human3_book.py`，检查 `materials.md` 的 Part 结构、entry 链接、单篇条目的必要字段和状态标签。
- 已把 Human3.0 归档校验接入 `./scripts/validate_skills.sh`。
- 已更新 `content/human3-book-guardian-v6/README.md` 和 `SKILL.md`，确认用户同意归档后，优先写入 `human3.0_book/materials.md` 与 `human3.0_book/entries/`。
- 已通过 `python3 scripts/validate_human3_book.py`、`bash -n scripts/validate_skills.sh`、`python3 -m py_compile ...`、`./scripts/validate_skills.sh` 和 `git diff --check`。
- `content/assets/` 与 `content/outputs/` 是已有内容产物，当前保留为未跟踪状态，后续可按内容提交单独纳入。

## 2026-05-19 Human3.0 成书归档目录

- [x] 新增 `human3.0_book/` 作为独立成书素材库目录
- [x] 新增 `human3.0_book/materials.md` 总索引
- [x] 新增本篇文章归档条目
- [x] 在 README 补充归档目录说明
- [x] 执行验证
- [x] 记录 review

### review

- 已新增 `human3.0_book/README.md`、`human3.0_book/materials.md` 和 `human3.0_book/entries/2026-05-19-execution-cheap-judgment-expensive.md`。
- `materials.md` 作为总索引，只存归属、状态和条目链接；单篇正文快照放在 `entries/`。
- 已在 README 说明 Human3.0 成书归档由 `human3.0_book/` 维护，`content/outputs/` 仍保存内容产物。
- 已通过 `git diff --check`。
- `./scripts/validate_skills.sh` 当前被工作区既有未跟踪 `.codex/skills/human3-book-guardian-v6/skill.json` 的 `source_dir mismatch` 拦截，未改动该未跟踪目录。

## 2026-05-19 Anthropic AI-native startup 公众号内容流程

- [x] 使用文昌总控进入定题节点
- [x] 确认主线：AI 时代真正稀缺的不是执行力，而是判断力
- [x] 采证：核验官方来源、关键事实和反向限制
- [x] 起稿：生成公众号初稿
- [x] 诊文/整章：做发布前诊断与必要编辑
- [x] 出刊：补标题、摘要、转发文案和阻塞项
- [x] 记录 review

### review

- 已按用户确认的主线推进：执行力降价，判断力变贵。
- 起稿时只把 Anthropic playbook 当素材，不翻译原文、不逐段复述。
- 文章同时带入“创始人从执行者转向调度者”和“不要把厂商手册当行动地图”两层观点。
- 出刊阶段仍需用户确认最终标题、封面方向、是否进入 Human3.0 成书归档。

## 2026-05-18 文昌总控自动推进优化

- [x] 新增 `content/wenchang-orchestrator/`
- [x] 明确完整阶段池：探脉、定题、采证、立骨、起稿、诊文、整章、出刊、配图/卡片/上传、归档
- [x] 明确不同入口对应的默认子路径
- [x] 明确自动推进规则和必须暂停的人审节点
- [x] 更新 `CONTENT_STATE.md`、README 和用户指南
- [x] 新增 `orchestrator-codex` fixture
- [x] 扩展 fixture 校验脚本，防止总控退化成固定五步链路
- [x] 执行验证
- [x] 记录 review

### review

- 已把“默认自动推进”从固定 `路由 -> 采证 -> 起稿 -> 诊文 -> 出刊` 改成总控根据入口选择完整阶段池中的子路径。
- 总控会保留探脉、定题、配图/卡片/上传、归档等节点，不再把它们省略。
- 用户指南已改成总控模式优先，手动复制模式只用于调试和回归。
- fixture 校验新增 `orchestrator` case，要求输出包含配图/卡片/归档，且不能写成固定五步链路。
- 已通过 `./scripts/validate_skills.sh` 和 `git diff --check`。

## 2026-05-18 文昌产品页 GitHub 入口简化

- [x] 将 GitHub 入口收敛为首屏一个链接
- [x] 移除导航、右侧卡片、独立 GitHub 区和收尾 CTA 中的重复链接
- [x] 执行基础验证
- [x] 记录 review

### review

- 已将 `product.html` 中指向 `https://github.com/yangchao228/yangxingzhi-media-skills` 的链接收敛为首屏主按钮一处。
- 已把右侧首屏卡片改为产品摘要，不再承担仓库导流；移除了独立 GitHub 区和收尾 GitHub CTA。
- 已通过 `git diff --check -- product.html todo.md`、`./scripts/validate_skills.sh`，并用 Playwright 验证 GitHub 链接数量为 1、移动端无横向溢出。

## 2026-05-18 文昌产品页站点风格优化

- [x] 参考 `yangxingzhi.reai.group/zh/products` 的深色产品集合风格
- [x] 重构 `product.html` 为可并入产品页的详情页气质
- [x] 在首屏、仓库面板、开源区和收尾 CTA 强调 GitHub 项目地址
- [x] 执行基础验证
- [x] 记录 review

### review

- 已将 `product.html` 从浅色独立介绍页改成与 `yangxingzhi.reai.group/zh/products` 接近的深色产品详情页风格，复用深色背景、金色主色、产品集合页式卡片和 serif 标题气质。
- GitHub 项目地址已在导航、首屏主 CTA、右侧仓库面板、独立开源区和收尾 CTA 中重复强调，地址为 `https://github.com/yangchao228/yangxingzhi-media-skills`。
- 已通过 `git diff --check -- product.html todo.md`、`./scripts/validate_skills.sh`，并用 Playwright 验证桌面/移动首屏、8 个 GitHub 链接和移动端无横向溢出。

## 2026-05-18 文昌用户使用指南

- [x] 阅读 README、content_state 和 fixtures，确认当前真实流程
- [x] 新增 `docs/wenchang-user-guide.md`
- [x] 覆盖三类入口、完整流程、每阶段输入输出、跑偏信号和第一次实操主题
- [x] 在 README 增加指南入口
- [x] 执行验证
- [x] 记录 review

### review

- 已新增用户向指南，第一屏给出三类输入方式：已有方向、外部文章/热点、已有初稿。
- 指南按路由、采证、起稿、诊文、整章、出刊、配图/卡片、归档组织，强调每一步的输入、期望输出和停止点。
- 已补常见跑偏信号，帮助用户发现“路由写正文、采证缺反向数据、出刊偷改正文”等问题。
- 已在 README 的工作流入口处链接用户指南。
- 已通过 `./scripts/validate_skills.sh` 和 `git diff --check`。

## 2026-05-18 文昌下一步优化计划

- [x] 拆分 `content/examples/full-pipeline-codex-workbench.md` 为 `content/fixtures/codex-workbench/`
  - 目标：覆盖外部热点/文章型入口，重点校验“不复述原文，而是转成 Human3.0 主线”。
- [x] 拆分 `content/examples/full-pipeline-content-agents-diagnostic.md` 为 `content/fixtures/content-agents-diagnostic/`
  - 目标：覆盖已有初稿诊断型入口，重点校验“先诊文，不直接重写”和 `ignored_context` 是否排除夸张承诺。
- [x] 扩展 `scripts/validate_content_fixtures.py`
  - 增加 case 类型识别：`existing-direction`、`external-article`、`draft-diagnostic`。
  - 对不同类型追加专属检查，例如 external-article 不能出现“逐段翻译”，draft-diagnostic 必须先有诊断结论。
- [x] 补 `content/fixtures/README.md`
  - 说明 fixture 命名、文件结构、阶段边界、如何新增一个回归样例。
- [x] 收口 `product.html` 工作线
  - 核对是否需要保留产品介绍页。
  - 如果保留，补基础验证和 review；如果不保留，先确认再清理。
- [x] 做一次完整工作区检查
  - 运行 `./scripts/validate_skills.sh`。
  - 运行 `git diff --check`。
  - 检查未跟踪文件，确认哪些应该纳入版本库。
- [x] 准备提交
  - 按主题分组 review 改动。
  - 只 stage 本轮相关文件，避免混入无关产物。

### review

- 已把剩余两个 full-pipeline 样例拆成 fixture：`codex-workbench` 和 `content-agents-diagnostic`。
- 已扩展 fixture 校验脚本，支持 `existing-direction`、`external-article`、`draft-diagnostic` 三类入口的专属边界检查。
- 已补 `content/fixtures/README.md`，说明 fixture 结构、新增方式和类型约束。
- 已确认 `product.html` 保留，已有验证和 review 记录。
- 已完成完整工作区检查；当前相关新增文件应纳入版本库，未发现需要清理的生成垃圾文件。

## 2026-05-18 文昌产品介绍页

- [x] 阅读 README/CLAUDE，确认产品定位和主链路
- [x] 新增静态 HTML 产品介绍页
- [x] 覆盖流程、模块、content_state 接力和典型用法
- [x] 执行基础验证
- [x] 记录 review

### review

- 已新增 `product.html`，定位为 `文昌.skill` 的静态产品介绍页，可直接本地打开。
- 页面覆盖首屏定位、生产链路、可组合模块、`content_state` 接力、使用入口和长期资产沉淀价值。
- 已通过 `git diff --check -- product.html todo.md`、`./scripts/validate_skills.sh`，并用 Playwright 生成桌面/移动截图确认首屏可见、移动端无横向溢出。

## 2026-05-18 文昌 fixture 回归校验

- [x] 将 `full-pipeline-ai-memory.md` 拆成分阶段 fixture
- [x] 新增 `scripts/validate_content_fixtures.py`
- [x] 将 fixture 校验接入 `scripts/validate_skills.sh`
- [x] 执行统一验证
- [x] 记录 review

### review

- 已新增 `content/fixtures/ai-memory/`，包含 router、research、review、publish 四个阶段的 input/expected。
- 已新增 `scripts/validate_content_fixtures.py`，先做结构校验，不调用 LLM，检查 `brief`、`content_state`、`handoff`、`contrarian_points`、`删减说明`、`publish_assets` 等关键边界。
- 已将 fixture 校验接入 `scripts/validate_skills.sh`，后续修改核心 skill 时会自动检查回归样例结构。
- 当前只拆了最标准的 `ai-memory` 样例；`codex-workbench` 和 `content-agents-diagnostic` 可等 fixture 结构稳定后继续拆。

## 2026-05-18 吸收 5-Agent 提示词纪律

- [x] 强化路由/定题阶段只输出 brief，不写正文
- [x] 强化采证阶段 `contrarian_points` 为核心必填输出
- [x] 强化整章模式 20%-30% 删减、证据约束和最后一句传播性
- [x] 更新核心入口 expected-output-notes
- [x] 执行统一验证
- [x] 记录 review

### review

- 已在 `wenchang-router` 增加 Brief 边界：路由、探脉、定题只输出 Angle、Hook、Subpoints、What to avoid、Suggested format，不生成正文。
- 已在 `wenchang-research` 增加反向证据规则：`contrarian_points` 是核心输出，缺反向证据时必须说明已查来源、未找到原因、待验证问题并降低可信度。
- 已在 `wenchang-review` 整章模式中强化删减纪律：目标删减 20%-30%，增加 `删减说明`，并要求最后一句能独立表达文章判断。
- 已更新对应 `expected-output-notes`，把这些规则纳入回归样例检查。

## 2026-05-18 文昌双类型流水线回归样例

- [x] 跑通外部热点/文章型选题样例
- [x] 跑通已有初稿诊断型选题样例
- [x] 分别验证 `handoff.ignored_context` 对阶段漂移的约束
- [x] 执行统一验证
- [x] 记录 review

### review

- 已新增 `content/examples/full-pipeline-codex-workbench.md`，用 Jason Liu 的 Codex-maxxing 验证外部文章/热点素材如何转成 Human3.0 主线选题。
- 已新增 `content/examples/full-pipeline-content-agents-diagnostic.md`，用 5-Agent 内容流水线长文验证已有初稿如何先诊断、再重构选题、再起稿。
- 外部热点型样例暴露的关键风险是“复述原文”；已通过 `ignored_context` 排除逐段翻译、纯工具教程和自动化万能叙事。
- 已有初稿型样例暴露的关键风险是“继承原稿夸张承诺”；已通过诊文阶段把“30 万美元团队”“全自动替代人”降级为不用的传播包装。
- 两个样例与此前 `full-pipeline-ai-memory.md` 形成三类入口覆盖：已有方向、外部热点、已有初稿。

## 2026-05-18 文昌完整流水线回归样例

- [x] 选择真实主题跑通路由、采证、起稿、诊文、整章、出刊
- [x] 使用一手来源补采证包
- [x] 落盘 full-pipeline 示例
- [x] 执行统一验证
- [x] 记录 review

### review

- 已用“AI 记忆能力会改变普通人的工作方式吗”跑通一条完整公众号内容链路。
- 已在 `content/examples/full-pipeline-ai-memory.md` 保存每一阶段的正式输出、`content_state` 和 `handoff`，可作为后续回归样例。
- 采证阶段使用 OpenAI、Anthropic、Google 的官方文档/公告，覆盖关键事实、反向证据、限制条件和可信度判断。
- 样例暴露的有效分工是：`wenchang-research` 防止观点空泛，`wenchang-review` 整章模式负责压缩和强化，`wenchang-publish-check` 只补发布资产不回头重写。
- 后续如要增强自动化，可把该 full-pipeline 文件拆成各核心 skill 的独立输入/输出 fixture。

## 2026-05-18 文昌伪多 agent 交接优化

- [x] 补充交接包与上下文隔离规范
- [x] 更新核心 skill 的读取边界
- [x] 更新 README 的伪多 agent 说明
- [x] 执行统一验证
- [x] 记录 review

### review

- 已在 `content/CONTENT_STATE.md` 中新增 `handoff` 标准交接包，明确 `from_stage`、`to_stage`、`accepted_inputs`、`ignored_context` 和 `stop_condition`。
- 已补充伪多 agent 规则：当前仍可由一个 agent 调度多个 skill，但每个阶段只读取交接包、允许字段、上一阶段正式输出和用户明确新增材料。
- 已更新 `wenchang-router`、`wenchang-research`、`wechat-writing-skill-ai-human3`、`wenchang-review`、`wenchang-publish-check` 的上下文隔离边界。
- 已更新核心入口 examples，要求输出 `handoff.accepted_inputs` 和 `handoff.ignored_context`，降低阶段漂移。
- 已通过 `./scripts/validate_skills.sh` 和 `git diff --check`。

## 2026-05-18 文昌内容流水线采证与编辑优化

- [x] 新增 `wenchang-research` 采证 skill
- [x] 扩展 `content_state.research` 与阶段合同
- [x] 更新 `wenchang-router` 和 README 工作流说明
- [x] 增强 `wenchang-review` 的诊断/整章编辑模式
- [x] 执行统一验证
- [x] 记录 review

### review

- 已新增 `content/wenchang-research/`，把事实采证独立成来源、关键事实、反向数据、可引用句子、矛盾点和可信度的研究包。
- 已扩展 `content/CONTENT_STATE.md`，新增 `research` 字段，并补充阶段合同，明确每个阶段读取、写入和不应处理的边界。
- 已更新 `wenchang-router`，让“已有选题但缺证据”的请求优先路由到 `wenchang-research`，避免直接起稿。
- 已增强 `wenchang-review`，区分诊断模式和整章模式，支持删减、重排、强化开头结尾并输出修改日志。
- 已让 `wechat-writing-skill-ai-human3` 在存在研究包时优先使用事实、反向数据和矛盾点，不重新发明研究结论。
- 已通过 `./scripts/validate_skills.sh` 和 `git diff --check`。

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

## 2026-05-18 Codex 工作台公众号判断文

- [x] 使用 `wenchang-orchestrator` 判断入口和链路
- [x] 读取外部素材 `Codex-maxxing`
- [x] 补充 OpenAI 官方来源和反向边界
- [x] 生成公众号判断文草稿
- [x] 完成诊文和出刊检查
- [x] 用户确认标题、封面、个人案例和 Human3.0 成书审查
- [x] 补入文昌流程个人案例
- [x] 新增封面 SVG 并插入稿件
- [x] 完成 Human3.0 成书审查

### review

- 已将主题按“定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 出刊”推进到第一个人工判断节点。
- 已新增 `content/outputs/2026-05-18-codex-workbench-wechat.md`，正文按用户要求写成账号自己的 Human3.0 判断文，不做原文翻译。
- 已保留官方来源和限制条件，避免把 Codex 写成无边界的自动接管叙事。
- 已补入“文昌总控处理这篇文章本身就是工作台案例”的个人真实场景，增强作者感和长期资产感。
- Human3.0 成书审查结论：通过，建议归入 Part 3《结构杠杆》，后续入书时弱化 Codex 功能清单，强化“工作如何被流程化、审查化、资产化”。
- 当前只剩发布前肉眼确认公众号后台封面裁切效果。

## 2026-05-18 gstack 虚拟团队公众号判断文

- [x] 使用 `wenchang-orchestrator` 判断入口和链路
- [x] 确认主切口：A 作为主稿，C 作为反向段落
- [x] 读取外部素材和一手仓库来源
- [x] 补充 TechCrunch / Hacker News 反向证据
- [x] 生成公众号判断文草稿
- [x] 完成诊文和出刊检查
- [x] 用户确认标题、封面、个人案例和 Human3.0 成书审查
- [x] 补入文昌流程个人案例
- [x] 完成 Human3.0 成书审查

### review

- 已将主题按“定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 出刊”推进到人工判断节点。
- 已新增 `content/outputs/2026-05-18-gstack-virtual-team-wechat.md`，正文按“别再把 AI 当聊天框，真正的高手在搭虚拟团队”展开，不翻译原文。
- 已把“照抄 gstack 不会让你变强”作为反向段落，避免写成工具崇拜或安装教程。
- 已补入“这篇文章本身就是文昌流程案例”的个人真实场景，增强账号作者感和长期资产感。
- Human3.0 成书审查结论：通过，建议归入 Part 3《结构杠杆》，后续入书时弱化 gstack 热点感，强化“重复工作如何角色化、流程化、资产化”。
- 当前只剩封面图生成后的发布前肉眼确认。

## 2026-05-22 AI 时代合格研发工程师多平台出刊包

- [x] 使用 `wenchang-orchestrator` 判断入口和链路
- [x] 接收用户补充的微信公众号正文素材
- [x] 补充 OpenAI / Anthropic / 论文一手来源
- [x] 生成公众号正文、知乎发布包和小红书图文方案
- [x] 完成诊文和出刊检查
- [ ] 用户确认封面 / 小红书卡片 / Human3.0 成书审查

### review

- 已将主题从泛“AI 时代合格研发工程师”收敛为“Prompt -> Context -> Harness 对应工程师能力升级”。
- 已新增 `content/outputs/2026-05-22-ai-era-qualified-engineer-wechat-zhihu-xhs.md`，包含采证、公众号正文、知乎发布包、小红书 8 页图文方案、诊文、出刊检查和 `content_state`。
- 已保留关键反向边界：OpenAI 内部案例不能直接外推到所有团队，复杂 Harness 有明显成本，Harness 需要随模型能力动态调整。
- 用户反馈初稿太虚后，已按素材模板重构正文：以“从 Prompt 到 Harness：AI 时代工程师的新能力模型”为主题，补入 7 要素 Prompt、5 类事实源、6 环节 Harness、9 项能力和 7 天训练路线。
- 当前按总控规则停在配图/卡片/归档判断节点，等待用户确认是否继续生成封面、小红书卡片和 Human3.0 成书审查。

## 2026-05-22 AI 短剧创作者不可替代性公众号出刊包

- [x] 使用 `wenchang-orchestrator` 判断入口和链路
- [x] 补充 AI 短剧 / AI 漫剧近期事实采证
- [x] 生成公众号正文、标题、摘要、转发文案和配图建议
- [x] 完成诊文和出刊检查
- [x] 用户确认最终标题
- [x] 用户确认封面文案
- [x] 用户确认不补个人案例
- [x] 生成公众号封面图
- [x] 用户确认不做 Human3.0 成书审查

### review

- 已将主题按“定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 出刊”推进到人工判断节点。
- 已新增 `content/outputs/2026-05-22-ai-short-drama-creator-irreplaceability-wechat.md`，正文面向内容创作者，主线为“AI 产能过剩后，创作者要把生活经验、价值判断、表达风格和长期资产变成不可替代性”。
- 已保留关键反向边界：AI 降低门槛有积极价值，同质化并非 AI 独有，版权不能简化成“AI 作品一律无版权”，不可替代性必须落成资产和流程。
- 用户已确认最终标题为“人人都能用 AI 做短剧，谁还能被观众记住？”，封面文案为“人人都能一人剧组，你凭什么被记住？”。
- 已新增公众号封面资产：`content/assets/2026-05-22-ai-short-drama-creator-irreplaceability/png/wechat-cover.png`，同时保留可编辑 SVG 和渲染脚本。
- 当前按总控规则停在发布前人工确认节点；本轮不补个人案例、不做 Human3.0 成书审查。

## 2026-05-27 Human 3.0 创造者革命公众号流程

- [x] 使用 `wenchang-orchestrator` 判断入口和链路
- [x] 读取外部素材 Daniel Miessler《The Problem with Human 2.0 and the Promise of Human 3.0》
- [x] 用户确认主线 A：人不该继续运行“雇员系统”
- [x] 完成采证与反向证据整理
- [x] 生成公众号文章骨架和标题候选
- [x] 起稿、诊文和出刊检查
- [ ] 用户确认封面 / 卡片 / Human3.0 成书审查
