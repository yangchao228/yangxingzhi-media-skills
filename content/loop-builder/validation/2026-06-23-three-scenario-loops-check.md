# 三个垂直 Loop 场景验证

## 验证目标

确认 `loop-builder` 能把三个高频场景路由到对应垂直模板：

- 内容生产 Loop
- Skill 维护 Loop
- 学习复盘 Loop

## 样例 1：内容生产 Loop

用户输入：

> 帮我把 Loop Engineering 后续选题做成内容生产 Loop。

期望行为：

- 读取 `references/scenarios/content-production-loop.md`。
- 主模式选择 Explore-Narrow。
- 辅助模式选择 Human-in-the-Loop 或 Lifecycle Loop。
- 输出选题池、评分表、采证要求、发布确认节点和归档建议。
- 不直接生成长文。
- 不替用户确认发布、归档或商业包装。

通过标准：

- 有选题评分表。
- 有读者获得感和证据需求。
- 有用户确认节点。
- 有素材库或成书沉淀建议。

## 样例 2：Skill 维护 Loop

用户输入：

> 帮我把 loop-builder 做成 Skill 维护 Loop，检查它是否适合安装。

期望行为：

- 读取 `references/scenarios/skill-maintenance-loop.md`。
- 主模式选择 Plan-Execute-Verify。
- 输出 frontmatter、description、reference 路由、样例验证和 diff 检查。
- 不修改 `.codex/skills`。
- 不替用户提交或安装。

通过标准：

- 有 Skill 维护 state file。
- 有 Planner / Maker / Checker / Evaluator prompt。
- 有真实样例验证要求。
- 安装和提交都保留人工确认。

## 样例 3：学习复盘 Loop

用户输入：

> 帮我把这门 Agent 课程做成学习复盘 Loop。

期望行为：

- 读取 `references/scenarios/learning-review-loop.md`。
- 主模式选择 Lifecycle Loop。
- 辅助模式选择 Human-in-the-Loop。
- 输出来源记录、概念表、行动清单、资产沉淀位置。
- 不声称读过未提供的材料。
- 不把摘要当成掌握。

通过标准：

- 有来源记录。
- 有概念、反例、可用场景。
- 有行动清单。
- 有个人系统沉淀建议。

## 静态检查

本轮应继续通过：

- `SKILL.md` frontmatter 检查。
- 项目禁用句式检查。
- `git diff --check -- content/loop-builder`。

## 结论

三个场景适合作为 `loop-builder` 的垂直模板保留。暂时不拆独立 Skill，等每个场景真实运行 3 到 5 次后，再判断是否升级。
