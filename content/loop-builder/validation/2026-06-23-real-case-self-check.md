# loop-builder v0.1 真实案例验证

## 验证案例

用户任务：

> 帮我把 `loop-builder v0.1 发布前自检` 做成一个 Agent Loop。

真实输入：

- 工作目录：`/Users/yangchao/github/skills/yangxingzhi-media-skills`
- Skill 入口：`content/loop-builder/SKILL.md`
- 参考资料：
  - `content/loop-builder/references/loop-patterns.md`
  - `content/loop-builder/references/templates.md`
  - `content/loop-builder/references/checklists.md`

## Loop 适配判断

- 结论：适合。
- 原因：目标明确，输入路径固定，验收信号清晰，可以通过 frontmatter、禁用句式、diff 空白检查和边界词检查来验证。
- 不适合自动化的部分：是否进入提交、是否安装到 `.codex/skills`、是否公开发布，都需要用户确认。

## 推荐 Loop 模式

- 主模式：Plan-Execute-Verify。
- 可组合模式：Human-in-the-Loop。
- 为什么：这个任务需要先读现有 Skill，再做静态检查，最后由用户确认是否继续安装或提交；高风险动作不应由 Loop 自行决定。

## 最小 Loop 设计卡

| 字段 | 内容 |
|---|---|
| 目标 | 验证 `loop-builder v0.1` 是否能用于真实任务设计，并找出首轮可改进点 |
| 状态 | `content/loop-builder/validation/2026-06-23-real-case-self-check.md` |
| 执行者 | Planner 负责只读侦察，Maker 负责补验证报告，Checker 负责静态检查，Evaluator 负责判断是否进入 v0.2 |
| 验收者 | 工具验收 + 用户确认 |
| 反馈信号 | frontmatter、禁用句式、`git diff --check`、真实输出是否可执行 |
| 停止规则 | 检查通过后停止；发现边界混写、禁用句式、无法验证命令时停止 |
| 人工确认节点 | git commit、安装 Skill、公开发布、商业包装 |
| 禁止动作 | 不改 `.codex/skills`，不执行提交，不替用户决定上架或发布 |

## 生成模板

### TODO.md

```md
# loop-builder v0.1 发布前自检 Loop State

## 目标

- 本轮目标：验证 `content/loop-builder` 是否满足 v0.1 设计目标。
- 成功标准：
  - `SKILL.md` 有 `name` 和 `description` frontmatter。
  - 参考资料覆盖模式、模板、检查清单。
  - 不命中禁用句式。
  - `git diff --check -- content/loop-builder` 通过。
  - 输出不会建议跳过人工确认。
- 非目标：
  - 不安装到 `.codex/skills`。
  - 不新增脚本。
  - 不提交代码。

## 输入

- Skill 目录：`content/loop-builder`
- 静态检查：
  - `rg -n '^name:|^description:' content/loop-builder/SKILL.md`
  - 禁用句式与越界建议检查：按项目当前禁用清单执行 `rg`，不要把清单原文写入样例文件。
  - `git diff --check -- content/loop-builder`

## 状态

- 当前轮次：1
- 当前阶段：verify
- 主模式：Plan-Execute-Verify
- 辅助模式：Human-in-the-Loop
- 预算：
  - 最大轮次：2
  - 最大时间：30 分钟
  - 最大 token / API 成本：低

## 任务拆解

| ID | 任务 | 状态 | 验收方式 | 风险 |
| --- | --- | --- | --- | --- |
| T1 | 读取 Skill 与 references | done | 文件可读 | 输出过长 |
| T2 | 生成真实案例 Loop | done | 本文件可读 | 模板偏重 |
| T3 | 跑静态检查 | pending | rg / diff check | 误报边界词 |
| T4 | 给出改进建议 | pending | 用户判断 | v0.2 范围膨胀 |

## 人工确认节点

- merge：需要用户确认。
- 安装 Skill：需要用户确认。
- 公开发布：需要用户确认。
- 商业包装：需要用户确认。

## 禁止动作

- 未经确认安装到 `.codex/skills`。
- 未经确认提交。
- 未经确认把本 Skill 包装为公开版。
```

### Planner Prompt

```md
你是 Planner，只负责只读侦察和计划，不修改文件。

任务：
验证 `content/loop-builder` 是否满足 v0.1 Skill 计划。

上下文：
- 工作目录：`/Users/yangchao/github/skills/yangxingzhi-media-skills`
- 允许读取：`content/loop-builder/**`
- 禁止修改：`.codex/skills/**`、仓库提交状态、发布相关文件

请输出：
1. 适配判断。
2. 推荐 Loop 模式。
3. 验收命令。
4. 高风险动作。
5. 下一步交给 Maker 的最小任务。
```

### Maker Prompt

```md
你是 Maker，只补充本轮验证报告，不修改 Skill 行为。

任务：
基于 `loop-builder` 的输出格式，生成一个真实案例验证报告。

允许修改：
- `content/loop-builder/validation/2026-06-23-real-case-self-check.md`

禁止动作：
- 不改 `.codex/skills`。
- 不改 `content/loop-builder/SKILL.md`，除非用户确认进入修订。
- 不执行 merge、公开发布、生产配置、权限、支付、数据删除、商业上架。

输出：
- 写入的验证内容。
- 发现的问题。
- 建议 Checker 执行的验收。
```

### Checker Prompt

```md
你是 Checker，只负责验收和风险检查。

验收目标：
确认 `loop-builder` 真实案例输出可读、可执行、边界清晰。

请检查：
1. `SKILL.md` 是否有 frontmatter。
2. 真实案例是否覆盖适配判断、模式选择、设计卡、模板、断路器、下一步。
3. 是否命中禁用句式。
4. `git diff --check -- content/loop-builder` 是否通过。
5. 是否出现跳过人工确认的建议。

输出：
- 通过 / 不通过 / 需要人工确认
- 证据
- 风险
- 下一步建议
```

### Evaluator Prompt

```md
你是 Evaluator，负责判断本 Skill 是否进入 v0.2。

输入：
- `content/loop-builder/SKILL.md`
- `content/loop-builder/references/*.md`
- 真实案例验证报告
- Checker 输出

请判断：
1. v0.1 是否可用。
2. 是否需要立刻修订。
3. v0.2 应优先补什么。
4. 哪些规则应沉淀到 Skill 或模板库。

输出：
- 决策：可用 / 需修订 / 等待用户确认
- 原因
- v0.2 建议
```

## 断路器与成本控制

### 断路器

- 如果检查命中禁用句式，停止并修订。
- 如果输出建议跳过人工确认，停止并修订。
- 如果模板生成过长导致用户无法直接使用，停止并增加轻量输出档位。
- 如果 Codex、Claude Code、Cursor 能力边界混写，停止并修订。

### 成本控制

- 最大轮次：2 轮。
- 最大时间：30 分钟。
- 检查范围限制在 `content/loop-builder`。
- 只做本地静态检查，不调用外部网络。

## 下一步

- 第一次运行建议：先用本案例验证 Skill 的设计类输出，再用“公众号选题 Loop”验证内容生产场景。
- 复盘方式：按 Checker 输出判断是否要修订 `SKILL.md` 或 references。
- 可沉淀资产：真实案例验证报告、v0.2 改进清单、后续公开版说明。

## 真实使用复盘

### 可用点

- 输出结构清楚，能稳定覆盖适配判断、模式选择、设计卡、模板和边界。
- 对高风险动作的人工确认约束足够明确。
- 对 Codex 场景友好，适合用来设计本地文件、代码、内容生产和复盘类 Loop。

### 暴露的问题

- 默认输出偏长，轻任务也会生成完整 Planner / Maker / Checker / Evaluator 模板。
- 内容生产场景还缺少更贴近文昌体系的示例，例如选题池、诊文、发布检查、素材归档。
- v0.1 只有 Markdown 模板，没有一键 scaffold，真实项目落地时还需要手动复制。

### v0.2 建议

1. 增加输出档位：`brief`、`standard`、`full`。
2. 增加 3 个场景模板：代码修复、内容生产、学习复盘。
3. 增加 `scripts/scaffold_loop.py`，按任务名生成 TODO.md 和 Prompt 文件。
4. 增加样例 fixtures，用于回归验证 Skill 输出是否越界。
