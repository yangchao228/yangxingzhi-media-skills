# 快速开始

## 用法一：直接贴给模型
把 `SYSTEM_PROMPT.md` 作为系统提示词。
再把 `templates/input-template.md` 填好，直接发送。

## 用法二：作为 ChatGPT / Claude / OpenClaw Skill
建议保留这些文件：
- `SKILL.md`
- `SYSTEM_PROMPT.md`
- `scorecard.md`
- `templates/input-template.md`
- `templates/output-template.md`
- `examples/`

## 用法三：接到自动化工作流
1. 上游抓热点
2. 热点作为 `热点素材` 输入
3. 模型输出结构化结果
4. 下游根据 `final_pick` 和 `top3` 路由到写作 skill

## 推荐串联下游
- 微信公众号写作 skill
- 标题优化 skill
- 小红书改写 skill
- 知乎长文适配 skill
