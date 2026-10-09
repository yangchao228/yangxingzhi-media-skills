# Colibrì v1.7.0 × DeepSeek V4 Pro-0813 公众号稿诊文记录

首次诊文：2026-07-14  
最新终审：2026-08-20  
目标平台：微信公众号  
诊断对象：`content/outputs/2026-07-14-colibri-glm52-wechat-draft.md`

## 终审结论

- 建议动作：可发布。
- 主要原因：标题和首屏已接入 Colibrì v1.7.0 与 DeepSeek V4 Pro-0813 两个一周内事件；正文继续把“开放权重、能跑起来、跑得够快、值得日常使用”分开讨论，且明确 Colibrì 当前只支持 V4 Flash，标题承诺没有超过证据。
- 发布边界：文字版已经齐全，公众号后台仍需上传封面。正文信息图属于增强项，不阻塞本次发布。

## 本轮发现的过期信息

1. Star 从 2026-07-14 的近一万增长到 2026-08-20 本轮查询的 25,554。
2. “尚无正式 Release”已经失效；当前最新版本为 v1.7.0，GitHub Releases API 返回 11 个正式版本。
3. 项目已从 GLM-5.2 参考实现扩展到六个模型家族，并提供 Linux、macOS、Windows 预编译包。
4. 当前 GLM-5.2 routed experts 口径为 19,456 个，旧稿的 21,504 个需要修正。
5. 当前推荐权重为 `mastouri` 的 gs64 int4 + int8 MTP 版本；旧的 per-row int4 镜像已被 README 明确列为不推荐。
6. “多数消费级设备低于 1 token/s”过于笼统，应改成分硬件口径：25 GB 冷运行 0.05—0.1，128 GB CPU 预热约 1.8，单张 RTX 5070 Ti 约 1.07，6 张 RTX 5090 完整驻留约 5.8—6.8 token/s。
7. DeepSeek V4 Pro-0813 于 8 月 13 日开放 1.6T 权重，但 Colibrì 当前只适配 V4 Flash，不能把同一 `model_type` 外推成兼容。

## 已执行修正

1. 首屏改为“7 月初走红 + 8 月 20 日最新状态”，保留热点来源并解决时间错位。
2. 更新为 25,554 Star、2,773 Fork、v1.7.0 和六个模型家族。
3. 删除“两千多行核心代码”“不需要 Python 运行时”等容易随项目变化而失真的表述，改为核心引擎的当前边界。
4. 更新为 19,456 个 routed experts、约 372 GB 容器和当前 gs64 int4 权重链接。
5. 用 README 当前性能摘要替换 7 月的零散社区测试数据。
6. 把项目成熟度判断改为“已超出一次性演示，但仍是没有统一速度 SLA 的研究平台”。
7. 保留云端、轻量本地和超大模型实验三类选择框架，没有扩大文章主题。
8. 标题和首屏改为 v1.7.0 主钩子；新增“1.6万亿参数开放，部署还没跟上”，用 DeepSeek V4 Pro-0813 强化“开放不等于可部署”。

## 发布风险

- Star 会继续变化。正文已经加上“截至 2026 年 8 月 20 日、本轮核验时”，后续无需追求实时同步。
- 不同硬件实测不能当成严格横评。正文已明确硬件、缓存状态不同。
- gs64 int4 是第三方量化容器。正文没有把它写成 Z.AI 官方量化权重。
- 25 GB 低内存运行成立，流畅日常使用仍不成立；文章结论保持该边界。
- DeepSeek V4 Pro-0813 的权重与配置已公开，但 Colibrì 当前支持的是 V4 Flash；正文没有暗示已经支持 Pro。

## content_state 更新

```yaml
content_state:
  draft:
    status: "2026-08-20热点改版终审通过"
    file: "content/outputs/2026-07-14-colibri-glm52-wechat-draft.md"
    summary: "接入Colibrì v1.7.0与DeepSeek V4 Pro-0813热点，并保留开放、部署与日常可用的边界"
  diagnosis:
    recommendation: "可发布"
    key_issues:
      - "7月Star与无Release状态已经过期"
      - "旧量化镜像和路由专家数量需要修正"
      - "性能数字需要按硬件与缓存条件分层"
      - "DeepSeek V4 Pro不能从同一model_type外推为已被Colibrì支持"
    minimum_fixes:
      - "更新25,554 Star、2,773 Fork和v1.7.0"
      - "改用当前gs64 int4权重"
      - "更新19,456个路由专家和372GB容器"
      - "替换当前README性能摘要"
      - "明确Colibrì当前只支持DeepSeek V4 Flash"
  decisions:
    - stage: "发布前复核"
      question: "是否更新Colibrì最新GitHub数据并立即发布"
      user_choice: "更新并准备现在发布"
      timestamp: "2026-08-20"
      impact: "正文和发布包完成最新事实校准"
    - stage: "热点改版"
      question: "是否结合最近热点增强传播时效"
      user_choice: "按建议改一版"
      timestamp: "2026-08-20"
      impact: "v1.7.0成为主钩子，DeepSeek V4 Pro-0813成为第二钩子"
  next_step:
    skill: null
    reason: "文字资产已完成，下一步为用户在公众号后台执行外部发布"
    user_decision_needed: true
  handoff:
    from_stage: "发布前终审"
    to_stage: "公众号后台发布"
    accepted_inputs:
      - "2026-08-20更新后的正文"
      - "更新后的标题、摘要和分发文案"
      - "DeepSeek V4 Pro-0813与V4 Flash适配边界"
    ignored_context:
      - "7月14日的Star和Release状态"
      - "已被项目淘汰的per-row int4镜像"
      - "Colibrì已经支持DeepSeek V4 Pro的错误外推"
    stop_condition: "外部发布动作由用户确认和执行"
```
