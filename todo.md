# todo

## 2026-10-07 AI builder 产品分发大纲

- [x] 按文昌总控判断为“明确主题 → 立骨”入口
- [x] 收敛“产品即分发基础设施”主线，避开既有 AI Distribution 企业 GEO 总论重复
- [x] 生成公众号长文大纲与 storm-research 待查问题
- [x] 纳入“社区问题回答 → 产品功能演示 → 可测激活”的分发路径
- [ ] 完成 storm-research 多视角问题地图
- [ ] 采证产品分发入口、生态能力与真实案例
- [ ] 用户确认大纲后进入起稿

### review

- 本轮只交付大纲，不生成正文、不做发布资产、不进入外部发布。
- 大纲把“传播”与“分发”分开，暂不把可见性、调用或推荐写成获客与收入事实。
- 正式正文仍需单独维护；后续 source-pack 承接高波动事实和反向证据。

## 2026-06-29 Understand Anything 公众号洁净初稿

- [x] 根据用户反馈移除正文中的旧稿/新版/storm/content_state/发布检查等内部工作流痕迹
- [x] 重新核验 Understand Anything 当前 GitHub 元数据和 latest release
- [x] 新增只面向读者的公众号正文源文件
- [x] 执行禁用句式、内部痕迹和格式检查

### review

- 已新增 `content/outputs/2026-06-29-understand-anything-wechat-clean-draft.md`，只保留标题、导读、正文、互动引导和文末资料来源。
- 本次不再把发布包、对比结论、content_state、storm 研究过程或“旧稿/新版”判断放进正文源。
- 已按 2026-06-29 GitHub API 重新核验：约 68,957 stars、5,705 forks、MIT License、TypeScript，latest release 仍为 `v2.7.3`。

## 2026-06-24 文昌接入 storm-research 并重跑 Understand Anything

- [x] 将 `storm-research` 接入文昌总控默认阶段池和路由规则
- [x] 更新 `content_state`、README 和回归样例，防止后续又退回 `定题 -> 采证`
- [x] 用新链路 `定题 -> storm-research -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 出刊` 重跑 Understand Anything
- [x] 生成旧版 / storm 版对比结论
- [x] 执行基础验证并记录 review

### review

- 已把 `storm-research` 接入文昌总控和路由：外部项目、热点链接、趋势判断、产品问题、学习领域或模糊主题默认走 `定题 -> storm-research -> 采证`；已有初稿、只诊文、只发布检查、只配图/卡片不强行回到 storm。
- 已新增 `content/storm-research/` 并加入售卖包打包脚本，避免只在 `.codex/skills` 可用但分发包漏掉。
- 已更新 `content/CONTENT_STATE.md`、`content/content_state.schema.json`、README、用户指南、回归 fixture 和校验脚本，确保 `storm_research` 是结构化接力字段。
- 已基于 GitHub API、README 和 release API 重新采证 Understand Anything，新增 storm 研究包、storm 版公众号稿和旧版/新版对比文件。
- 对比结论：storm 版更适合作为正式发布候选，主线从“个人读代码地图”升级为“团队共同地图 + 数字生产资料”。
- 已通过 `./scripts/validate_skills.sh`，并通过禁用句式、尾随空格和 Markdown diff 检查。

## 2026-06-24 Understand Anything 公众号成稿

- [x] 启用文昌总控，从明确主题 + GitHub 项目链接进入定题链路
- [x] 采证 Understand Anything GitHub README、官网、release 信息和项目限制
- [x] 收敛主线为“AI 编程的下一道门槛是系统理解和知识图谱资产”
- [x] 生成公众号正文源、标题候选、摘要、搜一搜发布包、配图提示词和 content_state
- [x] 执行基础文本验证并记录 review

### review

- 已新增 `content/outputs/2026-06-24-understand-anything-wechat.md`，单文件维护公众号正文和发布资产。
- 文章没有把 Understand Anything 写成普通代码可视化工具，而是收束到 Human3.0 方向：把代码理解、业务流程、团队 onboarding 和 PR 影响分析沉淀为可复用的数字生产资料。
- 已保留反向边界：首次全仓分析 token 成本、隐私/本地模型选择、图谱漂移、语义层误差和高风险改动仍需人工验收。
- 当前停在出刊后的人工确认节点：需要确认最终标题、是否生成封面/公众号贴图，以及是否进入小红书卡片或视频拆条。

## 2026-06-18 Agent 进化论 04 国产模型跑 Codex 公众号

- [x] 使用文昌总控从已有素材/半成稿进入采证、起稿和出刊链路
- [x] 核验 OpenAI Codex 配置、OpenAI API 价格、DeepSeek 价格与 Anthropic API、Z.AI GLM-5.2 / Coding Plan、Claude Code LLM Gateway 和 CC Switch 信息
- [x] 修正原素材里过期或高风险口径，尤其是 gpt-5.3-codex 价格、Codex custom provider 的 `responses` 协议边界、DeepSeek 人民币价格和 GLM Coding Plan 使用范围
- [x] 生成公众号出刊包、正文、标题候选、摘要、朋友圈文案、配图建议、来源清单和 content_state
- [x] 执行基础文本验证并记录 review

### review

- 已新增 `content/outputs/2026-06-18-codex-domestic-models-wechat.md`，正文主线从“国产模型更便宜”收束为“模型选择权 + 低成本试错 + 个人编程 Agent 工作流”。
- 文章没有直接沿用原素材里的“直接改 base_url 就能跑”口径，而是补充 Codex 当前 `wire_api` 只支持 `responses` 的协议边界，避免误导读者。
- 当前停在出刊后的人工确认节点：需要确认最终标题、公众号封面方向，以及是否继续生成配图/卡片；不自动上传外部服务。
- 2026-06-22 本轮基于官方/项目来源复核 OpenAI Codex 配置、DeepSeek 价格、Z.AI GLM-5.2 价格与 Claude Code LLM Gateway 口径；仅刷新事实边界日期和错误源路径，不新增第二份正文。
- 根据用户反馈强化主线：面向国内用户，先跑通 DeepSeek、GLM-5.2、阿里云百炼 / Model Studio / Coding Plan 这三类模型底座，再谈低成本试错、任务分层和上层 Agent 优化；同步更新正文、发布包和 content_state。

## 2026-06-07 AI 记忆升级公众号初稿

- [x] 筛选最近 3 天 AI 热点并确认主选题
- [x] 采证 OpenAI Dreaming、Anthropic AI builds itself、Meta Business Agent 和白宫 AI 指令
- [x] 收敛主线为“AI 记忆升级后，个人系统成为新护城河”
- [x] 生成公众号出刊包初稿
- [x] 根据用户“AI味重”反馈升级写作 skill 的结构级去 AI 味规则
- [x] 重写 v2 版公众号稿，改为具体场景入口和文件/流程级建议
- [x] 执行基础文本验证并记录 review

### review

- 已新增 `content/outputs/2026-06-07-ai-memory-personal-system-wechat.md`，包含来源清单、关键事实、反向边界、标题候选、正文初稿、摘要、配图建议、朋友圈文案和后续选题。
- 正文主热点聚焦 OpenAI Dreaming 记忆系统，Anthropic、Meta 和白宫 AI 指令只作趋势侧证，避免写成 AI 快讯合集。
- 文章主线落到 Human3.0：个人说明书、项目档案、写作风格卡、AI 禁用清单和记忆清理机制。
- 用户反馈 v1 “一股子AI味”后，已把 `wechat-writing-skill-ai-human3` 的去 AI 味规则从词表扩展为结构级诊断：开头、段落推进、小标题、抽象词密度、清单形态和事实转写。
- 已新增 `content/outputs/2026-06-07-ai-memory-personal-system-wechat-v2.md`，标题改为《别急着让 ChatGPT 记住你，先把自己整理清楚》，正文从“反复交代前情”这一具体写作卡点进入。

## 2026-05-31 AI 学习系列独立仓库迁移

- [x] 核对源目录 `ai_study/` 与目标仓库 `/Users/yangchao/github/ai_study`
- [x] 保留用户未提交的写作篇 v2 修改并迁移到新仓库
- [x] 将独立仓库内部路径从 `ai_study/...` 归一为仓库根路径
- [x] 为新仓库补充 `AGENTS.md` 和 `.gitignore`
- [x] 旧仓库 `ai_study/` 仅保留迁移说明
- [x] 执行基础验证并记录 review

### review

- 已将 33 个 `ai_study` 内容文件迁移到 `/Users/yangchao/github/ai_study`，并补入 1 个历史三平台内容包到 `archive/`，目标仓库保持独立 Git 维护。
- 新仓库内不再保留 `ai_study/` 路径前缀，正文元数据、资产 README 和生成脚本命令已改为从仓库根目录引用。
- 旧仓库只保留 `ai_study/README.md` 作为迁移指针；后续正文、发布包、封面和卡片资产都在新仓库维护。
- 已通过两边文件数量核对、`rg "ai_study/"` 路径扫描、`git diff --check` 和资产脚本语法检查。

## 2026-05-28 文昌 Studio v1 PRD 技术方案补齐

- [x] 在 PRD 中补齐 v1 技术架构、模块边界和推荐技术栈
- [x] 补充 Web SaaS、Local Runner、`codex exec`、文昌 skills 的调用链路
- [x] 补充数据模型、API、状态机、安全边界和部署方案
- [x] 对齐 v1 不做自动发布、Cloud OpenAPI 和 Ollama 的工程边界
- [x] 执行基础验证并记录 review

### review

- 已在 `docs/product/wenchang-studio-v1.md` 增加“技术方案”章节，补齐总体架构、推荐技术栈、模块划分、数据模型、API、状态机、Codex 调用、结构化输出、安全边界、部署方案、POC 顺序和技术风险。
- 技术方案继续保持 v1 只支持 Local Codex Runner；Web SaaS 负责状态和产品体验，本地 Runner 负责调用 `codex exec` 和现有文昌 skills。
- 已明确 v1 不做自动发布、不接 Cloud OpenAPI、不接 Ollama，避免工程复杂度提前膨胀。
- 已通过 `git diff --check -- todo.md docs/product/wenchang-studio-v1.md` 和 `./scripts/validate_skills.sh`。

## 2026-05-28 文昌 Studio v1 原型与执行协议

- [x] 新增低保真原型文档，明确小白入口、工作台、决策卡片、产物箱和模板页
- [x] 新增执行协议文档，明确 Web SaaS、Local Runner、`codex exec` 和文昌 skills 的边界
- [x] 定义 `execution_job`、`execution_result`、`decision_request`、`artifact` 的最小结构
- [x] 标注 v1 不做自动发布、Cloud OpenAPI 和 Ollama 的协议边界
- [x] 执行基础验证并记录 review

### review

- 已新增 `docs/product/wenchang-studio-v1-wireframe.md`，覆盖首页/项目列表、新建项目、项目工作台、决策卡片、产物箱、模板管理和 Runner 连接状态。
- 已新增 `docs/product/wenchang-studio-v1-execution-protocol.md`，定义 Web SaaS、Local Runner、`codex exec`、文昌 skills 之间的最小任务协议。
- 协议已明确 v1 只支持 `local_codex`，不接 Cloud OpenAPI、Ollama 和自动发布；未来 v2 可复用同一套 job/result/artifact/decision 结构扩展。
- 已通过 `git diff --check -- todo.md docs/product/wenchang-studio-v1-wireframe.md docs/product/wenchang-studio-v1-execution-protocol.md` 和 `./scripts/validate_skills.sh`。

## 2026-05-28 文昌 Studio v1 产品定义

- [x] 明确 v1 产品定位、目标用户和范围边界
- [x] 固化一期只支持 Local Codex Runner，不做 Cloud OpenAPI / Ollama / 自动发布
- [x] 定义核心页面、项目状态、模板和决策卡片
- [x] 梳理本地 runner 与现有文昌 skills 的最小执行协议
- [x] 给出 v1 MVP、验证方式和 v2 演进边界
- [x] 执行基础验证并记录 review

### review

- 已新增 `docs/product/wenchang-studio-v1.md`，把文昌 Studio v1 定义为 Web SaaS 控制台 + 本地 Codex Runner 的内容创作工作台。
- v1 已明确不做自动发布、Cloud OpenAPI、Ollama、平台账号授权和发布后数据回收，先聚焦内容创作与发布资产包生成。
- 已把小白入口、项目状态、模板、决策卡片、产物箱、本地 runner 协议和 v2 Cloud OpenAPI 演进边界写入 PRD。
- 已通过 `git diff --check -- todo.md docs/product/wenchang-studio-v1.md` 和 `./scripts/validate_skills.sh`。

## 2026-05-28 Codex 个人网站上线公众号成稿

- [ ] 使用文昌总控从已确认主题进入定题/起稿链路
- [ ] 快检 Cloudflare DNS、Vercel 部署/访问和 ICP 事实边界
- [ ] 生成公众号 Markdown 初稿、摘要、标签和朋友圈文案
- [ ] 根据用户最新要求整理正文-only 版本
- [ ] 针对诊文问题新写正文 v2，补真实过程证据和叙事节奏
- [ ] 后续封面图、朋友圈文案、卡片和归档暂缓
- [ ] 执行基础验证并记录 review

### scope update

- 用户已明确“先只需要出正文即可，后面暂时可以先不出”。
- 本轮收敛为正文-only Markdown，不继续推进封面、朋友圈、卡片、上传或归档。
- 用户反馈 v1 缺少真实过程证据、DNS/ICP 段落偏科普、结尾泛化、移动端节奏偏紧、“三类动作”框架偏学术。v2 需要改成真实过程复盘。

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
- [x] 生成小红书 8 页卡片方案、HTML 预览和 PNG 图片包
- [ ] 用户确认公众号封面 / Human3.0 成书审查

## 2026-05-31 Emergence World Agent 自治公众号流程

- [x] 使用 `wenchang-orchestrator` 判断入口和链路
- [x] 读取 36Kr 转载素材与 Emergence AI 一手来源
- [x] 用户确认主切口 A：AI Agent 失控的本质，是能力没有被放进人的系统里
- [x] 完成采证与反向证据整理
- [x] 生成公众号文章骨架和标题候选
- [x] 起稿、诊文和出刊检查
- [ ] 用户确认封面 / 卡片 / Human3.0 成书审查

### review

- 已新增 `content/outputs/2026-05-31-agent-system-human3-wechat.md`，将 36Kr 转载素材收束为 Human3.0 方向的系统设计权判断文。
- 已补充 Emergence AI 官方博客、GitHub 仓库和 AWI 指标文档作为一手来源，并保留代表性运行、样本规模、利益相关和指标不完整等反向边界。
- 已新增 `content/outputs/2026-06-01-agent-system-human3-xhs-cards.md` 和 `content/assets/2026-06-01-agent-system-human3-xhs/`，包含小红书 8 页卡片方案、HTML 预览、8 张 1080x1440 PNG 和 zip 包。
- 当前按总控规则停在封面/归档判断节点，等待用户确认是否生成公众号封面和 Human3.0 成书审查。

## 2026-06-11 文昌技能包闲鱼最小可售包

- [x] 新增买家侧 sale 文档
- [x] 新增可复制模板和示例输出
- [x] 新增售卖包打包脚本
- [x] 跑结构校验和打包校验

### review

- 已新增 `sale/` 买家交付包，覆盖入口说明、安装、最小使用指南、交付清单、闲鱼商品页文案、FAQ、售后边界、模板、示例和商品图建议。
- 已新增 `scripts/package_for_sale.sh`，生成 `dist/sale/wenchang-skill-pack-v0.1.zip`，只打包公开交付材料、文昌核心 skills 和多平台辅助 skills。
- 打包校验时发现 `md-img-r2/.env` 会被误带入初版 zip；已删除初版生成物，并在打包脚本中排除 `.env`、`.env.*`、`*.env`，压缩前增加阻断扫描。
- 根据售卖复杂度判断，首版不再打包 `md-img-r2`，避免买家第一天理解 R2、对象存储、密钥和公开外链配置；图片上传后续可作为高级能力单独说明。
- 已通过 `bash -n scripts/package_for_sale.sh`、`./scripts/validate_skills.sh`、`./scripts/package_for_sale.sh` 和 zip 内容检查；最终包未包含 `md-img-r2`、`.env`、R2 配置、历史 `content/outputs`、历史图片资产、`ai_study` 或临时 PDF/渲染文件。

## 2026-06-12 Loop Engineering 实战手册采证

- [x] 使用 `wenchang-orchestrator` 判断入口阶段
- [x] 使用 `wenchang-research` 采集官方文档、实战报道、工程论文和反向案例
- [x] 新增素材包 `content/outputs/2026-06-12-loop-engineering-practice-source-pack.md`
- [x] 整理成书大纲与公众号预热拆分方案
- [x] 起稿第 1 篇公众号文章
- [ ] 第 1 篇诊文、压缩和出刊检查

### review

- 已将素材拆成官方能力、实战案例、工程方法和反向证据四类。
- 核心一手来源包括 Claude Code `/loop`、scheduled tasks、hooks、subagents、Codex Automations。
- 关键反向边界包括长周期 agent code degradation、Replit 删除生产数据库、AI coding tools bug taxonomy、token / 权限 / 可观测性成本。
- 已根据用户补充的两张图，补强“规划器 / 生成器 / 评估器 / Harness”章节，并把手册目录调整为“四要素入门 -> 三角色架构 -> Harness 系统”。
- 已新增 `content/outputs/2026-06-12-loop-engineering-book-outline.md`，整理为 5 篇、18 章、4 个附录的成书大纲，并给出 9 章最小电子手册版本和 8 篇公众号系列拆法。
- 已新增 `content/outputs/2026-06-12-loop-engineering-wechat-series-plan.md`，将手册拆成 5 篇公众号主线文章、3 篇可选加更，并设计“公众号验证 -> 模板领取 -> 电子书转化 -> 微信读书上架”的路径。
- 已新增 `content/outputs/2026-06-12-loop-engineering-wechat-01.md`，完成第 1 篇公众号出刊包《Claude Code 之父说他不再写提示词了》，包含标题候选、摘要、正文、封面文案、朋友圈文案、配图建议和来源边界。
- 当前已推进到第 1 篇起稿完成，下一步建议对 `2026-06-12-loop-engineering-wechat-01.md` 做诊文和 20% 压缩，再进入出刊检查。

## 2026-06-15 Loop Engineering 系列第 2 篇重写

- [x] 读取已发布第 1 篇和原第 2 篇素材
- [x] 按“6 块积木、5 种模式、1 张决策表”重写第 2 篇
- [x] 新增 `content/loop engineer从入门到进阶手册/02.Loop Engineering 入门：6块积木、5种模式、1张决策表.md`
- [x] 保留旧版 `02.积木搭好了，但你该选哪个工具？5 种 Loop 模式 + 决策表.md` 作为素材备份
- [x] 诊断并单独重写六块积木版第 2 篇，新增 `02.Loop Engineering 的六块积木：让 Agent 循环真正跑起来-v2.md`

### review

- 新第 2 篇定位为导航型公众号文章，先兑现第 1 篇对“六块积木”的预告，再承接到 5 种 Loop 模式和决策表。
- 6 块积木只做架构地图，不展开成工具说明书；5 种模式和决策表作为正文主体，增强收藏价值。
- 下一篇预告改为通用“三角色架构”，不再强绑定未核验的一手来源表述。
- 后续根据用户反馈判断“6 块积木”和“5 种模式”拆开发更清晰，已另写六块积木 v2：收紧 `/loop`、Codex Automations、worktree、sub-agents 等产品事实口径，并加入“CI 失败巡检”贯穿案例。
- 为避免与后续 CI 自动修复实战篇冲突，已将第 2 篇第 7 节从“搭成第一个 Loop”改为“最小装配顺序”，明确本篇只做架构地图，完整 CI 搭建留到实战篇。

## 2026-06-18 自我改进 Agent 自媒体矩阵资产

- [x] 将旧版 A/B/C 选题迁移为执行版 `series-plan.md`
- [x] 新增 `source-pack.md`，明确采证池、高波动事实和分篇证据要求
- [x] 新增 6 篇公众号长文 brief，覆盖全景、双循环、反馈日志、OpenClaw、边界和 EvoSkill 加更
- [x] 新增小红书 8 页图文卡片 brief
- [x] 新增小红书视频和抖音短视频脚本 brief
- [x] 新增 Agent 反馈日志和 Skill 更新审核两份可复用模板
- [x] 执行基础文本验证并记录 review

### review

- 已在 `content/自我改进agent/` 下建立专题入口、执行规划、采证包、长文 brief、图文 brief、视频脚本和模板目录，后续可以按“公众号长文 -> 小红书图文 -> 小红书视频 -> 抖音短视频”的矩阵节奏推进。
- 第一季主线收敛为：Agent 自我改进依赖可验证任务、反馈记录、外环复盘、Skill 更新和人工审核，避免写成空泛趋势稿。
- 已把可复用资产前置为 `templates/feedback-log.md` 和 `templates/skill-update-review.md`，让专题不只产出内容，也沉淀个人 Agent 自改进工作流。
- 已修正旧大纲中 Anthony Alcaraz 拼写、Addy Osmani 来源格式和 Nakajima 框架归属表述，并清理本专题目录中的硬禁句式。
- 已按用户补充的“公众号贴图”方向新增 `wechat-images/`，把每篇长文的首屏判断图、机制图、模板图、边界图和 CTA 图纳入标准交付，避免长文和视觉资产脱节。
- 已完成第 01 篇完整样板：补采证快照，生成公众号出刊包、公众号贴图细化、小红书图文细稿和小红书/抖音视频脚本；Zach Lloyd/Warp 的 X Article 本轮因登录限制未作为正文硬证据。
- 已继续完成第 01 篇发布前闭环：新增诊文记录、公众号发布定稿、出刊检查记录，并制作 4 张公众号贴图 SVG；当前只剩人工确认最终标题和是否将 SVG 转为 PNG/JPG。
- 已根据用户新偏好调整图片工作流：新增 `image-prompts/` 和第 01 篇完整图片提示词包，明确公众号贴图、小红书图文、视频封面/B-roll 默认只交付提示词，由用户手动到 ChatGPT 出图；既有 SVG 仅保留为低保真布局参考。
- 已根据用户补充修正图片口径：公众号贴图和公众号插图分开处理，贴图固定 3:4，插图默认 16:9 且按需生成；第 01 篇提示词、第一季贴图 brief、出刊检查和旧 SVG 预览说明已同步调整。
- 已新增 `publish-packs/01-panorama-execution-pack.md`，把第 01 篇公众号粘贴版、4 张 16:9 正文插图提示词、小红书图文发布版、抖音脚本和小红书视频脚本收成一个发布当天执行包。
- 已进一步修正公众号图片发布口径：公众号正文插图默认 16:9 横图，3:4 公众号贴图只作为收藏、转发、朋友圈、社群和跨平台复用资产；第 01 篇执行包、出刊检查、图片提示词和插图 brief 已同步切换。
- 已按发布需求补齐第 01 篇发布三件套：公众号、小红书图文、抖音短视频和小红书视频均已增加“爆款优质标题推荐 / 正文描述 / 热门标签”，并同步到执行包和出刊检查。
- 已将第 01 篇正文描述升级为长描述版本：公众号 4 张正文插图和小红书 8 张图文卡均按一图一段写到 200 字以上，短视频发布描述也扩展为 200 字以上版本。
- 已根据用户反馈修正正文描述口径：公众号和小红书图文的正文描述都改为整篇发布文案，不再按图片粒度写成看图说明；图片粒度信息只保留在卡片结构、插图清单和提示词区。
- 已继续加厚第 01 篇发布正文描述：四个平台都改为长版整篇文案，覆盖卡片/插图中的三层定义、5 个条件、内外环、失败变 Skill、人审边界和错题本行动，同时保持非逐图说明。
- 已优化第 01 篇发布包里的正文描述排版：四个平台都改成“正文描述（可直接复制）”文本块，内部自然分段，方便发布时整段复制。
- 已使用文昌出刊标准完成第 01 篇终审，新增 `articles/01-panorama-final-review.md`；初始结论为补 1 个一致性问题后可发布，主要问题是正文未承接资料来源和插图位中的 `Karpathy/autoresearch`。
- 已按终审建议补齐 `Karpathy/autoresearch` 正文承接段，并同步更新发布执行包和终审状态；当前正文结构阻塞已清除，剩余动作是手动出图、外链复核和最终标题确认。
- 已按用户要求改成单一正文源：第 01 篇正文只维护在 `articles/01-panorama-publish.md`，发布执行包只保留正文源文件引用；同时把“发布包不复制完整正文”的规则固化到 `wenchang-publish-check`。
- 已优化第 01 篇正文开头：保留写稿和 coding agent 两个真实痛点，并在首屏提前交代读者能获得判断标准、5 个条件和错题本行动，增强阅读抓手。
- 已在 `articles/01-panorama-publish-v2.md` 插入 4 张 16:9 公众号正文插图，图片来自 `agent自我进化公众号插图/`；第 3 张按实际文件内容调整为“自改进 Agent 的 4 类真实入口”。

## 2026-06-22 Stanford STORM x Claude 研究方法素材处理

- [x] 使用 `wenchang-orchestrator` 判断入口阶段和当前链路
- [x] 读取用户提供的 STORM / Claude 四提示词素材
- [x] 使用 `wenchang-research` 规则核查 STORM 论文、ACL Anthology、arXiv、GitHub 和 live preview
- [x] 新增素材处理包 `content/outputs/2026-06-22-storm-claude-research-source-pack.md`
- [x] 用户确认继续 Human3.0 主线，并强化可复制实操模板作为关注送资料钩子
- [x] 新增公众号起稿 `content/outputs/2026-06-22-storm-claude-research-wechat-draft.md`
- [x] 新增关注送资料模板包 `content/outputs/2026-06-22-storm-research-template-lead-magnet.md`
- [x] 新增诊文记录 `content/outputs/2026-06-22-storm-claude-research-draft-review.md`
- [x] 开发轻量版 `storm-research` skill，安装到 `.codex/skills/storm-research/`
- [ ] 出刊检查：确认最终标题、摘要、封面、关键词、资料领取路径

### review

- 已确认 STORM、NAACL 2024、25% absolute increase、10% coverage 这几个核心事实有一手来源支撑。
- 已将原素材里的“4 个 Claude 提示词”“5 分钟 PhD 研究”降级为传播包装和轻量迁移，不作为论文结论使用。
- 推荐后续采用 Human3.0 主线切口：把 STORM 写成“个人研究协议”和“认知主权工作流”，比单纯提示词合集更利于长期资产沉淀。
- 已按用户要求把“AI 研究四步模板”拆成独立资料包，适合公众号后台回复关键词领取，正文只保留文末钩子，避免资料正文混在文章里。
- 已完成诊文，结论为轻改后进入出刊检查；当前需要确认最终标题、后台关键词和资料领取路径。
- `storm-research` 定位为研究前置 skill，只输出多视角扫描、矛盾地图、研究简报、可信度评审和采证计划，不写正文、不替代事实核查。
- 已按用户要求把 `storm-research` skill 介绍补进公众号初稿，作为文末资料领取钩子的一部分，并同步清理该段固定对照句式。
- 已将正文中的研究示例替换为“Loop Engineering 是否真的提效”，并同步调整五视角、冲突示例和结论，让案例更贴合账号已有 Loop Engineering 系列。

## 2026-06-23 外网 Top 3 AI 主题 STORM 测试

- [x] 使用本地 `.codex/skills/storm-research/` 读取规则
- [x] 联网筛选 2026-06-16 至 2026-06-23 英文外网 AI 热点
- [x] 选择 3 个主题：AI 网络安全军备竞赛、中国开源/低价模型进入美国企业栈、AI 人才与资本战
- [x] 新增 STORM 批处理结果 `content/outputs/2026-06-23-top3-ai-topics-storm-research.md`
- [ ] 用户选择一个主题进入 `wenchang-research` 深采证或起稿

### review

- 本轮热度判断不是严格全网流量榜，缺少 X、Reddit、Hacker News、YouTube 等完整互动数据；采用媒体覆盖、官方/行业信号和内容延展性综合判断。
- `storm-research` 对每个主题都能稳定输出多视角、矛盾地图、研究简报、可信度评审和后续采证计划，适合作为定题后、采证前的中间层。
- 最适合 Human3.0 账号继续写的方向是“中国开源/低价模型进入企业栈”，可承接模型选择权、低成本试错和个人数字生产资料主线。

## 2026-06-23 STORM Research Kit 打包

- [x] 整理《AI 研究四步提示词模板》
- [x] 整理 `storm-research` skill 交付目录
- [x] 新增包说明 `dist/storm-research-kit-20260623/README.md`
- [x] 新增复核清单 `dist/storm-research-kit-20260623/review-checklist.md`
- [x] 复核 skill 元数据、Markdown 格式、敏感文件和密钥模式
- [x] 生成最终 zip `dist/storm-research-kit-20260623-final.zip`
- [x] 测试 zip 完整性并确认包内文件名为跨平台安全的 ASCII 名称

### review

- 最终交付包包含两套资料：`ai-research-4-step-prompts.md` 和 `storm-research/` skill。
- 包内不包含 `.env`、token、key、password、secret、`.DS_Store`、`__MACOSX`、缓存或历史生成报告。
- 早期测试 zip 使用中文文件名，在 `unzip -l` 下出现编码显示风险；最终包改用 ASCII 文件名，中文标题保留在文件正文中。

## 2026-06-23 Loop Engineering STORM Demo HTML

- [x] 使用当前仓库 `.codex/skills/storm-research/` 跑「Loop Engineering 是否真的提效」demo
- [x] 读取 `storm-research` skill 协议和 prompt templates
- [x] 读取本地 Loop Engineering 手册素材、CI 自动修复篇、三角色架构篇和 STORM 方法稿
- [x] 新增研究源文件 `content/outputs/2026-06-23-loop-engineering-storm-demo-source.md`
- [x] 新增 HTML 主页面 `content/outputs/2026-06-23-loop-engineering-storm-demo.html`
- [x] 完成 HTML 静态可打开性和内容完整检查
- [x] 完成关键词、禁用句式和基础格式检查
- [ ] 如需公开成文，进入 `wenchang-research` 深采证

### review

- `storm-research` demo 已完整输出多视角扫描、矛盾地图、研究简报、可信度评审、后续采证计划和 `content_state / handoff`。
- 核心判断收敛为：Loop Engineering 有提效潜力，但提效成立依赖可验证目标、真实反馈、独立评估、停止规则、权限边界、日志和人工确认。
- HTML 页面为单文件、内联 CSS、无外部 CDN，包含 Hero、Demo 说明、五视角卡片、矛盾表、发现评分、采证计划和结构化 `content_state`。
- 已完成文件存在、关键词覆盖、禁用句式、静态 HTML 解析和 `git diff --check` 验证；未上传外部服务，未打 zip。
- 当前建议进入 `wenchang-research` 深采证，重点核验官方工具能力、论文/报道原文、真实 CI loop 执行日志、token 成本和人工接管次数。

## 2026-06-23 storm-research HTML 输出能力补充

- [x] 将“可浏览 HTML 研究页”作为 `storm-research` 的可选交付模式补进 `SKILL.md`
- [x] 新增 HTML 输出参考模板 `.codex/skills/storm-research/references/html-output-template.md`
- [x] 更新 `.codex/skills/storm-research/skill.json`，补充 HTML 研究页相关摘要、关键词和用户需求
- [x] 完成 JSON、引用、禁用句式和基础格式检查

### review

- 默认输出仍是 Markdown 研究结构；只有用户明确要求 HTML、可浏览页面、demo 页面、研究看板或方便用户查看时，才额外生成单文件 HTML。
- 新增模板固定了页面结构：Hero、Demo 说明、多视角扫描、矛盾地图、研究简报、可信度评审、后续采证计划、`content_state / handoff` 和下一步建议。
- HTML 要求保持研究展示用途，不写成公众号正文、知乎正文或营销页；页面必须单文件、内联 CSS、无外部 CDN。
- 仓库通用 `scripts/validate_skills.sh` 会跳过 `.codex` 目录，因此本次对 `.codex/skills/storm-research/` 做了专项静态校验。

## 2026-06-23 STORM 公众号初稿插图生成

- [x] 读取 `content/outputs/2026-06-22-storm-claude-research-wechat-draft.md` 的配图建议
- [x] 生成 3 张 16:9 SVG 插图到 `content/assets/2026-06-22-storm-research-wechat-illustrations/svg/`
- [x] 将首屏判断图插入正文标题后
- [x] 将人的判断权位置图插入“自查是保留判断权”段落后
- [x] 将四步研究流程图插入“四步协议”列表后
- [x] 在配图建议区补充已生成文件路径，便于出刊复核

### review

- 这次插图是结构图和流程图，中文文字准确性优先，因此使用可编辑 SVG 直接生成，没有调用位图生成工具。
- 三张图分别承接文章的首屏判断、可信度自查和四步模板钩子，位置与正文论点对应。
- 后续如公众号后台不接受 SVG，可再批量导出 PNG，但当前正文引用和资产文件已就位。

## 2026-06-24 STORM Research Kit 重新验证与打包

- [x] 在公众号初稿中新增 Co-STORM 下文预告，并加入后续选题
- [x] 重新读取《AI 研究四步提示词模板》和当前 `.codex/skills/storm-research/`
- [x] 重新组装新版资料包 `dist/storm-research-kit-20260624/`
- [x] 新版包已包含 `storm-research/references/html-output-template.md`
- [x] 新增新版包说明 `dist/storm-research-kit-20260624/README.md`
- [x] 新增新版复核清单 `dist/storm-research-kit-20260624/review-checklist.md`
- [x] 生成最终 zip `dist/storm-research-kit-20260624-final.zip`
- [x] 完成 skill、JSON、敏感信息、跨平台文件名、zip 完整性和包内清单校验

### review

- 新版包包含 7 个文件：`README.md`、`ai-research-4-step-prompts.md`、`review-checklist.md`、`storm-research/SKILL.md`、`storm-research/skill.json`、`prompt-templates.md`、`html-output-template.md`。
- `storm-research` 包内文件已和当前 `.codex/skills/storm-research/` 源文件逐项比对一致。
- `quick_validate.py` 校验通过；`zip -T` 校验通过；zip 内文件名均为 ASCII，未包含 `.DS_Store`、`__MACOSX`、`.env`、缓存或密钥模式。
- 全量 `todo.md` 中仍有旧历史句式命中，本次新增正文和新版资料包未命中禁用句式。

## 2026-06-29 storm-research 对外包术语修正

- [x] 移除 `storm-research` 对外 skill 中的内部采证 skill / 内部链路表述
- [x] 将下一步统一改成“事实采证 / 深度事实核查”
- [x] 同步更新 `dist/storm-research-kit-20260624/` 中的 skill 文件和 README
- [x] 重新更新 `dist/storm-research-kit-20260624-final.zip`
- [x] 同步修正 Loop Engineering demo HTML / source 中的内部链路表述
- [x] 完成 quick_validate、zip 完整性和内部术语扫描

### review

- 面向用户的 `storm-research` 现在是独立 skill，不再暴露用户不认识的内部采证 skill 名。
- 对外流程统一为：主题 / 选题 -> `storm-research` -> 事实采证 -> 大纲 -> 起稿 -> 发布前检查。
- `content_state.next_step` 示例从内部 skill 名改为 `stage: "事实采证"`，降低外部分发理解成本。
- 已确认 `.codex/skills/storm-research/`、`dist/storm-research-kit-20260624/`、新版 zip 和 demo 文件中不再出现内部链路名或内部术语。

## 2026-06-26 Claude Tag 公众号稿

- [x] 使用 `wenchang-orchestrator` 判断入口阶段：明确主题，走定题 -> storm-research -> 采证 -> 起稿 -> 诊文 -> 出刊
- [x] 核验 Anthropic Claude Tag 发布页和 Claude Tag 官方文档
- [x] 新增公众号正文与发布资产 `content/outputs/2026-06-26-claude-tag-wechat.md`
- [x] 补齐事实边界、来源清单、标题备选、正文、配图建议、搜一搜发布包和 `content_state`
- [x] 完成禁用句式扫描和 `git diff --check`
- [ ] 如需正式发布，补 1 张首屏判断图和 1 张权限边界图

### review

- 主线收敛为：Claude Tag 让 AI 进入团队工作现场，团队需要为 AI 设计岗位、权限、记忆和验收。
- 文章已避免只做产品功能搬运，重点转成可收藏的团队接入清单和 Human3.0 组织协作案例。
- Anthropic 内部 65% 代码数据已作为传播钩子使用，并在正文中降级说明不能直接外推到普通团队。
- 当前发布阻塞只剩配图；正文、标题、摘要、搜一搜和转发文案已就位。

## 2026-06-27 GPT-5.6 发布解读公众号稿

- [x] 使用 `wenchang-orchestrator` 判断入口阶段：明确主题，走定题 -> storm-research -> 采证 -> 起稿 -> 诊文 -> 出刊
- [x] 核验 OpenAI GPT-5.6 发布页和 GPT-5.6 Preview System Card
- [x] 新增公众号正文源文件 `content/outputs/2026-06-27-gpt-5-6-release-wechat.md`
- [x] 补齐事实边界、来源清单、标题备选、正文、配图建议、搜一搜发布包和 `content_state`
- [x] 将主线收敛为“顶级 AI 进入准入时代”，避免只做模型功能搬运
- [ ] 如需正式发布，补 1 张首屏判断图和 1 张模型调度表图

### review

- GPT-5.6 当前是有限预览，正文已把“未全量开放”“完整评测尚待公布”和安全边界写入事实限制。
- 文章重点从模型跑分转向模型分层、访问准入、成本调度、prompt caching 和个人上下文资产，更适合 Human3.0 长期素材沉淀。
- 当前发布阻塞主要是配图；正文、标题、摘要、搜一搜关键词、转发文案和评论区引导已就位。

## 2026-07-02 Loop Engineering 电子书插图收口

- [x] 按 v1.0 9 张图方案在投稿完整稿中补充插图占位和图注
- [x] 将 7 张可复用图片复制到 `content/loop engineer从入门到进阶手册/book-v1/images/`
- [x] 将 7 张已存在图片统一处理为 1600x900 公众号横版插图画布
- [x] 保留 2 张新图为明确占位：四层演进图、好 Loop 四要素图
- [x] 跳过 `03-3.png` 和旧 Evaluator 四项评分图，避免图片职责和正文主线割裂
- [x] 在微信读书投稿发送清单中补充 `images/` 目录和 9 张最终图边界
- [x] 新做并保存 `images/01-four-layer-evolution.png`
- [x] 新做并保存 `images/02-good-loop-four-factors.png`

### review

- 当前成书 v1.0 采用 9 张图，已全部保存为 ASCII 文件名，并统一为 1600x900 横版画布，便于后续投稿包和跨平台文件处理。
- 已插入图注，图片职责收敛为解释关键结构：四层演进、Loop 合格标准、六块积木、Skill/Memory、五种模式、模式决策、三角色、CI 巡检、人机边界。
- 现有导出脚本会把 Markdown 图片语法降级成 alt 文本；如要重新生成带图 docx/PDF，需要单独增强 `export_submission_docs.py` 的图片打包和渲染能力。

## 2026-07-03 Loop Engineering 电子书插图统一模板

- [x] 新增独立模板目录 `content/loop engineer从入门到进阶手册/book-v1/illustration-style-template/`
- [x] 固定书内插图统一视觉规范：1600x900、深色手册结构图、米白文字、暖金重点、青蓝流程、少量红色风险
- [x] 新增 `README.md`，记录画布、色彩、字号、图形语言、9 张图的结构类型和禁用项
- [x] 新增 `template-preview.html`，用四类核心结构做模板样张：四层演进、好 Loop 四要素、三角色架构、人机确认边界
- [x] 通过 Chrome headless 渲染并保存 `template-preview-full.png` 作为风格确认长图
- [x] 新增浅色对照版 `template-preview-light.html` 和 `template-preview-light-full.png`
- [x] 用户确认采用浅色版作为电子书正式插图方向
- [x] 新增 `figures-light-export.html` 作为 9 张正式图的可复用导出源
- [x] 按浅色模板重做并覆盖 `book-v1/images/` 中 9 张正式 PNG
- [x] 生成 `figures-light-preview-full.png` 作为 9 张正式图总览预览

### review

- 本轮先用深浅两版确认视觉方向，再按用户确认的浅色版覆盖正文引用的 9 张正式图。
- 模板方向从“科技大屏 / 爆款海报”收敛为“浅色手册结构图”，更适合电子书连续阅读；深色版保留为后续公众号传播图参考。
- 四张样张覆盖递进、四象限、三角色和人机边界四种核心结构，后续 9 张正式图可以按这些结构族扩展。
- 浅色版更接近书内插图，连续阅读压力更低；深色版更适合公众号传播图，可作为后续分发版模板。
- 当前 `book-v1/images/` 中 9 张正式图已统一为浅色手册结构图，并保持原有 Markdown 引用文件名不变。

## 2026-08-20 ChatGPT Ads 与 AI Distribution 公众号稿

- [x] 使用 `wenchang-orchestrator` 判断入口：明确主题，走定题 -> storm-research -> 采证 -> 起稿 -> 诊文 -> 出刊
- [x] 读取用户大纲，确认主线为 AI Distribution 四层模型，不写成功能介绍
- [x] 核验 OpenAI ChatGPT Ads、购物研究、商品发现与 Agentic Commerce 一手来源
- [x] 新增独立研究事实包、洁净公众号正文、诊文记录与出刊包
- [x] 完成禁用句式、正文洁净、链接、格式与 `git diff --check` 验证
- [x] 在配图与最终发布 Gate 暂停，等待用户确认

### review

- 已将正文、研究事实包、诊文记录、发布包和系列规划分层维护；正文只保留读者可见内容，并作为唯一正式源。
- 事实核验确认：OpenAI 8 月 18 日公告使用“下周进入 31 个欧洲市场”的时态；Agentic Commerce 已有商品发现、Instant Checkout 与 ACP 早期能力，但与 ChatGPT Ads 分属不同链路。
- 正文主线收敛为 Earned、Owned、Paid、Agentic 四层 AI Distribution，并给出 20 个高价值问题、Visibility Baseline、Owned AI + Paid AI 三步行动。
- 已通过目标文件 `git diff --check`、正文禁用句式和内部工作流痕迹扫描；未生成图片、未上传外部服务、未发布。
- 当前标题已确认；发布阻塞项为封面与两张正文结构图尚未生成，发布当天还需复核欧洲市场上线时态。

#### 实拍插图补充

- [x] 检查用户提供的 ChatGPT 咖啡机对话截图：3364×1890 PNG，无个人账号信息暴露
- [x] 原图归档到 `content/ai-distribution/assets/01-chatgpt-ads-coffee-machine-example.png`
- [x] 将截图插入正文“广告不会改变 ChatGPT 的答案”事实边界之后
- [x] 在发布包记录尺寸、SHA-256、插入位置、使用边界和移动端排版建议
- [x] 用实拍截图替代原计划的 Organic AI 与 Paid AI 概念图

##### review

- 截图同时出现咖啡机自然推荐和回答下方单独标注的广告卡片，能直接支撑文章的界面分层判断。
- 截图中的推荐产品和广告商品不进入事实采证，只作为 ChatGPT Ads 展示形态的界面素材。
- 当前视觉缺口从“1 张封面 + 3 张正文结构图”收敛为“1 张封面 + 2 张正文结构图”。
- 未裁切、未改图、未上传外部服务；发布排版时先用原始 16:9 图，移动端标签过小时再确认是否制作裁切版。

#### 结构图与封面提示词

- [x] 用户确认保留推荐主标题，并按“四层模型图 -> 决策路径图 -> 封面”顺序继续
- [x] 固定深黑、暖金、米白的商业杂志信息图视觉底座
- [x] 生成 AI Distribution 四层模型图完整提示词
- [x] 生成用户决策路径迁移图完整提示词
- [x] 生成公众号 2.35:1 封面完整提示词
- [x] 补充建议文件名、生成顺序和图片验收清单
- [x] 更新发布包中的标题决策、提示词路径、图片状态和下一步 Gate

##### review

- 提示词独立维护在 `content/ai-distribution/image-prompts/01-chatgpt-ads-image-prompts.md`，正文继续保持唯一源和读者洁净。
- 三张图共用颜色、排版、图形语言和禁用项；先用四层模型图确认视觉底座，再生成路径图和封面，可减少风格漂移。
- 实拍截图继续承担“自然回答与广告分层”的事实界面，生成图只承担路径和方法论表达。
- 本轮只交付提示词，未调用图片生成工具、未上传、未排版、未发布。

## 2026-08-27 ChatGPT 事件触发与个人 AI OS 选题

- [x] 启用 `wenchang-orchestrator`，按明确主题进入定题，默认公众号 / Human3.0 读者
- [x] 完成 STORM 五视角问题地图，区分产品事实、解释框架与实践建议
- [x] 通过 OpenAI 官方更新日志、Scheduled tasks、Browser 文档核验事件触发与登录操作边界
- [x] 保存独立研究包和机器可读 `content_state`，验证格式与交接字段
- [x] 人工事实 Gate：用户回复“好的”，确认暂不写任务分享复制，采用“事件触发”口径
- [x] 成稿前重新读取 OpenAI Scheduled tasks、Browser 与 8 月 25 日更新条目
- [x] 完成立骨与公众号独立正文，保留设计示例和产品事实的区别
- [x] 完成诊文、出刊检查与 Human3.0 素材审查；不复制正文
- [x] 验证文件、事实边界、正文洁净与 `content_state`，在配图及发布 Gate 暂停

### review

- 首轮停在采证 Gate；本轮用户已确认事实取舍，继续成稿。官方可核实 8 月 25 日的事件触发与云端浏览器登录更新。
- 尚未证实“任务分享后由接收者独立授权并创建副本”；不把只读对话分享与任务复制混为一谈，也不把支持的应用事件扩展成任意 Webhook 接口。
- 保留工作区已有改动；本轮不创建真实自动化、不接入私人账号、不修改 Skill、不提交或推送。
- 验证通过：139 项当前 schema 规则检查、5 视角完整性、13 处官方链接域名、暂停状态与未起稿合同、禁用句式及目标文件空白检查。未安装额外依赖。

#### 成稿 review

- 正文独立保存，诊文与出刊包不复制全文；分享复制支线已按确认排除。
- 已完成重复字修正、公告年份补齐及可靠性措辞收紧。
- 最终静态验证通过：196 项当前 schema 规则检查、4 处正文官方来源链接、4 个正文小标题、3 条决策记录，以及正文洁净、禁用句式、文件引用与空白检查。
- Human3.0 素材审查为条件通过，候选条目已落盘；缺真实运行记录，尚未最终入书。
- 当前等待正文终审与两张图的视觉方案确认。未生成图片提示词或图片，未上传、未发布。

## 2026-09-20 AI Visibility Baseline 公众号稿

- [x] 启用 `wenchang-orchestrator`，识别为已有初稿的诊文入口
- [x] 读取用户五层框架，保留 Ranking -> Mention -> Citation -> Recommendation -> Conversion 主线
- [x] 按正文洁净规则重写开头、层级解释、Baseline 测试法和结尾
- [x] 新增独立正文源、事实边界包、诊文记录和公众号出刊包
- [x] 完成 `git diff --check`、禁用句式和内部工作流痕迹扫描
- [x] 在视觉资产与发布当天事实复核 Gate 暂停

### review

- 正文唯一维护源为 `content/ai-distribution/articles/02-ai-visibility-baseline-wechat.md`，发布包未复制全文。
- 文章将五层模型明确标注为作者工作框架；当前平台产品细节因本轮联网不可用，已降级为发布前官方文档复核项。
- 已保留反向证据：单次回答波动、指标未统一、推荐不等于转化、平台规则持续变化。
- 未生成图片、未上传外部服务、未代替用户发布；下一步等待视觉方案确认。

## 2026-09-21 Jev Decision Engineering 公众号专栏与引导篇

- [x] 启用 `wenchang-orchestrator`，按明确大纲进入定题 → storm-research → 采证 → 立骨 → 起稿 → 诊文 → 出刊
- [x] 核验 TypeSafe 官方 Jev / System One / Choice / Score / Noul / Confidence 文档
- [x] 新增独立 `content/jev/` 专题目录、系列规划、storm 研究、事实包、正文唯一源、诊文与出刊包
- [x] 完成引导篇：以 Decision Layer 为主线，接入 China Clearly gold set 实验计划
- [x] 明确结构化输出、confidence、准确率、中文效果、模型版本和人工替代能力的事实边界
- [x] 通过静态链接、禁用句式、正文洁净与 `git diff --check` 验证
- [x] 用户选择 A，生成封面与 3 张结构图并写入 `content/jev/assets/`
- [x] 将 3 张正文结构图插入引导篇正文，保存图片提示词与生成记录
- [ ] 等待人工终审；未上传外部服务、未发布

### review

- 正文唯一维护源为 `content/jev/articles/00-jev-decision-engineering-wechat.md`；研究、诊文和发布包不复制全文。
- 引导篇把大纲中的 Boolean 校正为官方原语 Noul，并把“能否替代人工”改为待验证的 gold set 实验。
- 已保留反向证据：结构化不等于正确，confidence 不等于单次准确率，官方性能与成本数字不可直接外推，CJK 输入需单测，`jev-latest` 需记录版本化 model ID。
- 视觉资产已生成并完成静态检查；当前只剩人工终审、外部上传和发布确认。
- 不自动上传外部图片、不代替用户发布。

## 2026-09-24 中国 Creator × 入境游小红书诊文

- [x] 读取文昌总控、诊文与出刊规则，从已有初稿进入
- [x] 确认目标读者为入境游商家，保留作者的产品假设与成都摄影师设想
- [x] 完成局部编辑、双标题候选、独立描述和话题词
- [x] 保存正文唯一源、诊文出刊包及 content_state
- [x] 验证标题和描述长度、事实边界、正文洁净与文件引用

### 执行范围

- 按用户“诊断并优化”授权进行局部编辑，不改核心角度。
- 不把设计设想当成真实案例，不引入市场规模、价格、经营资格或效果断言。
- 本轮完成文字优化；图片制作和发布不在本轮执行范围。

### review

- 正文唯一源为 `content/outputs/2026-09-24-chinese-creator-inbound-xiaohongshu.md`；诊文出刊包只引用正文。
- 三组双标题分别完成长度与非重复校验；独立描述 170 字符，正文 943 个非空白字符，统计口径见出刊包。
- 通过 content_state 当前 schema 的 126 项结构规则检查，以及引用、长度、正文洁净、事实边界和空白检查。
- “成都摄影师”保留为设计设想，“4–8 人”保留为起步建议；真实需求、共同获客效果及溢价均未验证。
- 保留工作区已有改动。本轮未制作图片、未上传、未发布；不把文字验收等同于平台展示验收。

## 2026-10-05 《The Eternal Complement》公众号诊文与优化

- [x] 按文昌总控从已有初稿进入诊文
- [x] 核验 OpenAI 原文与 Bloom 等人的研究来源、作者信息和数据口径
- [x] 收束主线为“前沿智能与机构智能是互补关系，个人观点延伸到小团队与个体的互补位置”
- [x] 保留原文优先入口，取消泛化的“AI让我更快却更忙”主题和方法论四步法
- [x] 生成独立诊文与优化版正文
- [x] 完成来源、正文洁净和 `git diff --check` 验证

### review

- 输出文件为 `content/outputs/2026-10-05-eternal-complement-wechat-review.md`，包含诊断、优化版正文、修改日志和 content_state。
- 文章建议“轻改后发布”，保留作者个人经验与“系统 / 工具”定位，压缩重复段落并补充小团队互补逻辑。
- 23 倍与 41 倍保留为 OpenAI 原文转引的历史估算，不外推为全球实时数据；AI 科学发现与未来文明保留为推演。
- 本轮未制作配图、未上传、未发布，下一步进入 `wenchang-publish-check` 与人工终审。

### 2026-10-05 用户反馈后的整合修订

- [x] 将标题和正文术语统一为“永恒的互补”与“互补关系”，避免商品化的“互补品”表述
- [x] 修正作者声明位置、译述引语、Bloom 研究口径、主镜镜片段和 `taste` 中文解释
- [x] 将标题统一为“永恒的互补”，正文首次解释为 complement 的互补关系
- [x] 补回“机器做无聊工作”和“宽度文明可能很慢”的反直觉点
- [x] 将机构智能、深度 / 广度、人的好奇心三处重复压缩，正文主体控制在约 2,800 个非空白字符
- [x] 保留个人 OPC、选题筛选和系统 / 工具定位，结尾只保留“你身边缺的，又是哪一种互补？”

### review

- 当前正文标题为 `《永恒的互补》：十亿个爱因斯坦，也得有人去“采石场”`。
- 原文引述的 Bloom Stanford PDF 与 AER 发表版均列入资料来源；数据写成同一项研究的 18 倍、23 倍和约四十一分之一口径。
- 正文主体约 2,800 个非空白字符，保留“互补关系”主线并删除多余的火箭延伸例子。
- 本轮仍停在诊文 / 出刊前，未制作配图、未上传、未发布。
- [x] 将小标题改为观点先行，让读者仅扫标题也能看出每节的判断和获得感。

### 2026-10-06 《永恒的互补》公众号插图规划

- [x] 按正文主线规划 1 张封面 + 5 张正文插图
- [x] 确定概念插画方向：互补关系、机构智能、采石场、OPC 缺口、taste 取舍、深度 / 宽度与人的多样性
- [x] 明确插图位置、图注、Alt 文本、尺寸和生图顺序
- [ ] 等待视觉方向确认后生成图片

### review

- 插图规划保存为 `content/outputs/2026-10-05-eternal-complement-visual-plan.md`。
- 当前未生成、未上传、未发布图片；正文维护源保持单一。

### 2026-10-06 ChatGPT 生图提示词

- [x] 为封面与 5 张正文插图补充可直接复制到 ChatGPT 的英文提示词，并保留 1 张首屏备选图
- [x] 固化统一风格前缀、负面约束、16:9 / 1600×900 规格和生成顺序
- [x] 将生成顺序收敛为先做当前正文需要的 6 张，首屏备选图暂不生成
- [ ] 等待用户开始生图并回传视觉结果后做定向调整

### review

- 提示词文件为 `content/outputs/2026-10-05-eternal-complement-image-prompts.md`。
- 提示词参考原文页面的暖象牙纸张、靛蓝蓝图、纸雕 / 拼贴、微型模型阴影和少量哑金 / 赭橙视觉语言。
- 本轮只提供提示词，未调用 imagegen、未生成、未上传、未发布图片。

### 2026-10-06 正文插图占位

- [x] 在正文维护源插入 1 张封面与 5 张正文插图占位
- [x] 为每个占位绑定主题、建议文件名、图注和 Alt 文本
- [x] 保持正文单一维护源，等待用户将生成图片替换进占位位置

### review

- 占位已写入 `content/outputs/2026-10-05-eternal-complement-wechat-review.md`，可搜索“图片占位”定位。
- 本轮未生成、未上传、未发布图片。
- [x] 删去与开头文字重复的首屏宇宙图占位，并重排韦布、机构智能和深度 / 宽度插图位置
- [x] 采用 B 版收尾，并按 `no-ai-slop` 规则把最后两节改为具体项目场景、个人分工与单一互动问题
- [x] 按 `no-ai-slop` 全文检测结果调整抽象总结、重复来源转述和排比节奏，保留原文事实与个人经历
