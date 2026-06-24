# 安装说明

这份说明面向购买文昌 skill 包后的本地安装。你需要已经能使用 Codex、Claude Code 或兼容 skill 的本地 AI 工具。

## 交付内容

标准交付包通常是：

```text
wenchang-skill-pack-v0.1.zip
```

解压后应包含：

- `sale/`：买家文档、模板、示例和售后边界。
- `content/`：文昌内容生产相关 skills。
- `README.md`：项目总说明。
- `docs/wenchang-user-guide.md`：完整用户指南。

## 安装到 Codex

如果你的 Codex 使用 `~/.codex/skills` 作为 skill 目录，可以复制需要的 skill 目录：

```bash
mkdir -p ~/.codex/skills
cp -R content/wenchang-orchestrator ~/.codex/skills/
cp -R content/wenchang-router ~/.codex/skills/
cp -R content/wenchang-research ~/.codex/skills/
cp -R content/wenchang-review ~/.codex/skills/
cp -R content/wenchang-publish-check ~/.codex/skills/
cp -R content/wechat-writing-skill-ai-human3 ~/.codex/skills/
cp -R content/wechat-hot-topic-skill-ai-human3 ~/.codex/skills/
cp -R content/zhihu-topic-hunter ~/.codex/skills/
cp -R content/xiaohongshu-topic-generator ~/.codex/skills/
```

如果你希望保留仓库目录并用软链接安装，可以使用：

```bash
mkdir -p ~/.codex/skills
ln -s "$(pwd)/content/wenchang-orchestrator" ~/.codex/skills/wenchang-orchestrator
```

其他 skill 按同样方式链接。

## 安装到 Claude Code

如果你的 Claude Code 使用 `~/.claude/skills`：

```bash
mkdir -p ~/.claude/skills
cp -R content/wenchang-orchestrator ~/.claude/skills/
cp -R content/wenchang-router ~/.claude/skills/
cp -R content/wenchang-research ~/.claude/skills/
cp -R content/wenchang-review ~/.claude/skills/
cp -R content/wenchang-publish-check ~/.claude/skills/
cp -R content/wechat-writing-skill-ai-human3 ~/.claude/skills/
```

不同客户端的 skill 目录可能不同。如果你的工具界面提供了“导入 skill / 添加技能目录”，优先使用工具界面的路径提示。

## 推荐安装组合

最小组合：

- `wenchang-orchestrator`
- `wenchang-router`
- `wenchang-research`
- `wenchang-review`
- `wenchang-publish-check`
- `wechat-writing-skill-ai-human3`

多平台组合：

- `wechat-hot-topic-skill-ai-human3`
- `wechat-hot-topic-skill-generic`
- `zhihu-topic-hunter`
- `xiaohongshu-topic-generator`
- `wechat-to-cards`
- `redbook-cards`
- `long-to-cards`
- `xiaohongshu-viral-image-skill-v4`

图片上传、对象存储和公开外链不在首版售卖包范围内。首版只交付内容生产流程、模板和示例，避免新买家第一天就被 R2、密钥和存储配置卡住。

## 验证是否可用

安装后在 AI 工具里输入：

```text
请使用文昌总控，从主题“AI 时代个人内容系统怎么搭建”开始，先判断选题和流程，不要直接写全文。
```

理想输出应该包含：

- 当前入口阶段判断。
- 推荐子路径。
- 选题切口或 brief。
- 下一步需要用户确认的事项。

如果一上来直接生成完整文章，说明没有正确触发文昌总控，或当前工具没有识别 skill。

## 常见问题

### 找不到 skill

检查目录层级。正确结构应该是：

```text
~/.codex/skills/wenchang-orchestrator/SKILL.md
```

常见错误是多套了一层：

```text
~/.codex/skills/wenchang-skill-pack/content/wenchang-orchestrator/SKILL.md
```

这种情况下需要把具体 skill 目录复制到 `skills/` 下。

### 输出还是很像普通 AI 写作

优先使用总控入口，并明确要求“先判断入口阶段，不要直接写全文”。文昌流程重视选题、采证、诊文和发布检查，不建议跳过前置步骤。

### 能不能直接自动发公众号或小红书

这套交付包默认不做自动发布。最终发布、封面确认、平台合规、事实判断都需要你自己确认。

### 能不能替换成我的账号风格

可以。先填写 `sale/templates/account-positioning.md`，再把账号定位放进每次任务输入里。
