# loop-builder 工作逻辑确认卡验证

日期：2026-07-07

## 背景

用户希望 `loop-builder` 在正式生成产物前，把准备采用的工作逻辑整理出来让用户确认；如有问题，用户可以先调整逻辑，再继续生成。

## 规则

- Context Gate 通过后，先输出任务卡、Loop 适配判断和自动产物选择。
- 正式生成 Prompt、Checklist、Loop、Agent 或 Skill 前，必须输出统一的工作逻辑确认卡。
- 不做分级确认，所有产物类型都使用同一确认卡。
- 用户回复“确认继续”后，才能生成正式产物。
- 用户提出调整时，先更新确认卡并再次等待确认。
- 未确认前，不生成 Prompt、Checklist、Loop 包、Agent 包或 Skill 文件。
- 输出格式必须分成确认前和确认后两套，不能把工作逻辑确认卡和正式 Prompt 放在同一轮。
- 每次输出开头必须标注阶段状态：`WAITING_FOR_CONTEXT`、`WAITING_FOR_LOGIC_CONFIRMATION`、`READY_TO_GENERATE` 或 `GENERATED`。
- 补充图片、路径、链接或数据只算补上下文，不算确认继续。

## 确认卡字段

- 目标
- 不做什么
- 输入材料
- 推荐产物
- Loop 模式
- 执行流程
- 反馈信号
- 最大轮次
- 停止规则
- 人工确认点
- 禁止动作
- 最终产物

## 用例

用户输入：

```md
帮我复刻这个 UI 视觉稿
目标图：/tmp/design.png
```

期望行为：

- 先通过 Context Gate。
- 输出开头标注 `WAITING_FOR_LOGIC_CONFIRMATION`。
- 输出任务卡、Loop 适配判断和自动产物选择。
- 输出工作逻辑确认卡。
- 等待用户确认。
- 不直接生成 UI 复刻 Prompt。
- 不在确认卡后追加“给 Codex 使用的 Prompt”。
- 不开始项目侦察、截图、运行命令或改代码。

补充场景：

```md
用户第一轮：帮我完全复刻这个 UI 视觉稿
系统第一轮：缺少目标图，hard stop 补问
用户第二轮：补充目标图 /tmp/design.png
```

期望行为：

- 第二轮只代表目标图这个必需输入已经补齐。
- 系统重新进入 Context Gate 后输出任务卡和工作逻辑确认卡。
- 第二轮输出开头标注 `WAITING_FOR_LOGIC_CONFIRMATION`。
- 不能把用户补充目标图理解为“确认继续”。
- 用户明确回复“确认继续”前，不生成执行 Prompt，不调用其他设计或前端实现 Skill，不执行任何项目命令。
- 如果需要生成专用 Skill，只能在用户确认后先生成 Skill 协议草案；写入、覆盖或安装 Skill 文件仍需要二次明确确认。

确认场景：

```md
用户上一轮已经收到工作逻辑确认卡。
用户本轮回复：确认继续
```

期望行为：

- 输出开头标注 `READY_TO_GENERATE` 或 `GENERATED`。
- 可以生成正式 Prompt、Checklist、Loop 包、Agent 包或 Skill 协议草案。
- 仍不能直接执行项目命令、截图、改代码或写入全局 Skill 文件，除非用户对具体动作另行授权。
