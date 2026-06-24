# Stanford STORM x Claude 研究工作流素材处理包

日期：2026-06-22
阶段：文昌总控 / 定题 + 采证
素材来源：`/Users/yangchao/.codex/attachments/a5aa13ad-4798-45dd-832b-959c3a068a15/pasted-text.txt`

## 当前判断

这条素材可以进入写作，但不适合直接照着原推文写成“4 个提示词让 Claude 5 分钟变博士”。

更稳的内容主线是：

> STORM 真正值得学的是一套可复用的研究流程：多视角提问、矛盾映射、综合判断、同行评审式自查。

它适合放进 Human3.0 方向，核心落点是“人如何借助 AI 保留判断权，并把一次性搜索升级成个人研究系统”。

## 入口判断

- 入口类型：已有外部主题素材。
- 当前阶段：定题 + 采证。
- 当前链路：定题 -> 采证 -> 立骨 -> 起稿 -> 诊文 -> 出刊 -> 配图/卡片/上传 -> 归档。
- 本轮停止点：出现多个可行写作切口，需要用户确认主线后再起稿。

## 素材摘要

原素材围绕 Stanford STORM 展开，主张普通用户可以把 STORM 的思路简化成 4 个 Claude 提示词：

1. 多视角扫描：从实践者、学者、怀疑者、经济学家、历史学家五个角色看同一主题。
2. 矛盾地图：找出不同视角之间的冲突、共识和盲点。
3. 综合研究简报：产出摘要、关键发现、隐藏连接、行动建议和前沿问题。
4. 自我评审：给发现打可信度分数，找最弱结论、偏见、缺失视角和整体修订建议。

可用价值在于：它把“问 AI 一个答案”改造成“让 AI 帮人搭研究流程”。

## 采证结论

- 是否足够支撑写作：足够支撑一篇方法论文章；不足以支撑夸张传播话术。
- 主要原因：
  - STORM 论文、NAACL 2024、开源仓库、在线 preview、25% / 10% 评估结果均有一手来源可核。
  - 原素材把 STORM 系统简化成 Claude 提示词，这个迁移可以作为启发，但不能写成论文已经证明“4 个提示词有效”。
  - 论文和仓库都保留了边界：源偏见、错误关联、生成稿仍需大量编辑。

## 来源清单

1. 用户提供素材：本地附件 `pasted-text.txt`。可用价值是传播切口、提示词结构和读者入口。
2. ACL Anthology：<https://aclanthology.org/2024.naacl-long.347/>。可用价值是论文元数据、NAACL 2024、摘要、DOI、页码和实验结论。
3. arXiv 论文页：<https://arxiv.org/abs/2402.14207>。可用价值是 STORM 方法定义、作者、日期、实验摘要。
4. Stanford OVAL GitHub 仓库：<https://github.com/stanford-oval/storm>。可用价值是项目定位、开源实现、安装方式、模块结构、Co-STORM 更新和限制说明。
5. STORM live preview：<https://storm.genie.stanford.edu/>。可用价值是在线演示入口；正文中只适合作为“可试用入口”，不作为效果证据。

## 关键事实

- STORM 全称是 Synthesis of Topic Outlines through Retrieval and Multi-perspective Question Asking，论文题目为《Assisting in Writing Wikipedia-like Articles From Scratch with Large Language Models》。
- 论文作者为 Yijia Shao、Yucheng Jiang、Theodore Kanell、Peter Xu、Omar Khattab、Monica Lam，收录于 NAACL 2024 long papers。
- STORM 的关键流程是：发现多元视角、模拟不同视角的提问者与基于互联网来源的专家对话、整理信息并生成文章大纲。
- 论文评估中，相比 outline-driven RAG baseline，更多 STORM 文章被 Wikipedia 编辑认为组织性更好，绝对提升 25%；覆盖广度提升 10%。
- 论文明确指出挑战包括互联网源偏见转移，以及把无关事实错误关联。
- GitHub 仓库把 STORM 定位为基于互联网搜索生成 Wikipedia-like articles 的 LLM 系统，并说明它对 experienced Wikipedia editors 的 pre-writing stage 有帮助。
- GitHub 仓库也说明，系统产物通常仍不能直接达到 publication-ready，需要大量编辑。
- 2024 年 9 月，Co-STORM 代码已集成到 `knowledge-storm` Python package 1.0.0；Co-STORM 强化了 human-AI collaborative knowledge curation。

## 反向数据 / 限制条件

- “4 个 Claude 提示词”并不是 STORM 原系统。原系统包含检索、可信来源筛选、模拟对话、引用收集、大纲生成和文章生成模块；直接在 Claude 里跑提示词只能模拟其中一部分流程。
- “5 分钟知道得比别人读几天更多”是传播表达，不是论文结论。正式文章里只能写成“适合快速建立研究框架”，不能写成已被实验验证。
- 论文中的 25% 和 10% 是在特定任务、特定基线、特定评估口径下得到的结果，不能泛化成“所有研究都提升 25%”。
- 如果 Claude 没有联网检索或用户不提供来源，提示词版 STORM 很容易变成角色扮演式总结，事实可靠性会明显下降。
- STORM 自身也有源偏见和事实误关联风险，所以“自我评审”不能替代真实查证。

## 可引用句子

> 真正的研究能力，体现在先让 AI 帮你把问题空间打开，再决定哪些答案值得进入判断。

> STORM 给普通人的启发，是把一次性搜索升级成一套可复用的研究协议。

> AI 可以生成五种视角，但哪一种视角该进入判断，仍然要由人来负责。

## 矛盾点

- 原素材说“不需要软件、GitHub、设置”，这适合作为轻量工作流入口；但如果宣称“运行同样的 STORM 方法”，就和原系统的检索、引用、模块化 pipeline 存在落差。
- 原素材强调速度和效率，论文强调 pre-writing research、outline quality、grounded writing。两者可以结合，但正文要把“快”和“可靠”分开写。
- 原素材用“像博士一样研究”做传播入口，Human3.0 方向更适合写“把 AI 变成研究流程的一部分”，避免读者误以为可以外包判断。

## 选题切口

### A. 实用教程切口

工作标题：

**别再问 AI 一个答案了：用 STORM 方法把 Claude 变成研究助手**

适合平台：公众号 / 知乎。

优点：实操性强，读者能直接拿走 4 步流程。

风险：容易写成提示词合集，长期资产感弱。

### B. Human3.0 主线切口（推荐）

工作标题：

**会研究的人，已经不把 AI 当搜索框了**

适合平台：公众号主文，小红书可拆 8 页卡片，短视频可拆 1 条判断。

核心观点：

> AI 时代的研究能力，关键不在答案生成，而在视角设计、矛盾识别、证据分级和人工判断。

优点：和 Human3.0 的“认知主权 / 个人系统 / 数字资产沉淀”更贴合，也更容易沉淀成研究 SOP、Prompt 模板和个人知识工作流。

风险：需要把传播素材里的“5 分钟博士”压住，避免标题党。

### C. 反包装切口

工作标题：

**“4 个提示词让 Claude 像博士一样研究”，到底靠不靠谱？**

适合平台：知乎 / 公众号短文。

优点：可信度强，有事实核查感。

风险：容易写成辟谣，读者获得感不如 B。

## 推荐立骨

推荐选择 B。

### 文章功能

帮读者从“用 AI 搜答案”升级到“用 AI 建研究流程”，并交付一个可以复用的个人研究协议。

### 读者对象

- 经常写文章、做选题、做产品判断、学习新领域的人。
- 已经会用 Claude / ChatGPT，但输出经常停在摘要和清单的人。
- 想把 AI 用成长期生产系统，而不是热点工具的人。

### 读完应拿走

1. 一个判断：AI 研究的核心是流程，不是单次回答。
2. 一套四步研究协议：多视角 -> 矛盾地图 -> 综合简报 -> 可信度评审。
3. 一个边界：没有来源和反向证据时，任何“研究结论”都只能算草稿。
4. 一个行动：把常用研究主题沉淀成自己的 STORM Prompt 模板和证据日志。

### 公众号大纲草案

1. 开头：多数人还在把 AI 当搜索框。
2. STORM 真正解决的问题：先研究问题空间，再生成答案。
3. 4 步轻量协议：视角、矛盾、综合、评审。
4. 这套方法最容易被误用的地方：没有检索、没有来源、没有反方证据。
5. Human3.0 落点：人的判断权体现在流程设计、证据取舍和最终行动。
6. 结尾行动：把这套流程保存成自己的研究模板，下一次选题前先跑一遍。

## content_state

```yaml
content_state:
  request:
    raw_intent: "使用文昌总控处理 Stanford STORM x Claude 研究方法主题素材"
    current_stage: "定题/采证"
    target_platforms:
      - "公众号"
      - "知乎（可选）"
      - "小红书图文（待确认）"
      - "短视频（待确认）"
  topic:
    source_material:
      - "/Users/yangchao/.codex/attachments/a5aa13ad-4798-45dd-832b-959c3a068a15/pasted-text.txt"
    recommended_angle: "B. Human3.0 主线切口"
    candidate_angles:
      - "A. 实用教程切口"
      - "B. Human3.0 主线切口"
      - "C. 反包装切口"
  research:
    confidence: "Medium"
    sources:
      - "ACL Anthology: https://aclanthology.org/2024.naacl-long.347/"
      - "arXiv: https://arxiv.org/abs/2402.14207"
      - "GitHub: https://github.com/stanford-oval/storm"
      - "STORM live preview: https://storm.genie.stanford.edu/"
      - "user attachment: pasted-text.txt"
    key_facts:
      - "STORM 收录于 NAACL 2024 long papers"
      - "论文报告组织性 25% absolute increase、覆盖广度 10%"
      - "STORM 主要面向 Wikipedia-like grounded long-form article 的 pre-writing 和写作"
      - "项目仓库说明产物仍需大量编辑，不宜直接发布"
    contrarian_points:
      - "Claude 四提示词版不是原始 STORM 系统"
      - "5 分钟 PhD 研究是传播包装，不是论文结论"
      - "没有联网和来源日志时，提示词版容易产生事实幻觉"
      - "STORM 自身存在源偏见和事实误关联风险"
    contradictions:
      - "原素材轻量化表达与原系统检索/引用/模块化 pipeline 存在落差"
  next_step:
    skill: "wechat-writing-skill-ai-human3"
    reason: "用户确认主切口后，进入公众号起稿；若选择 C，则先做更完整的事实核查稿"
    user_decision_needed: true
  decisions:
    - stage: "定题"
      question: "从 A 实用教程、B Human3.0 主线、C 反包装核查中选择主切口"
      user_choice: "待确认"
      timestamp: "2026-06-22"
      impact: "决定后续文章语气、标题、结构和是否需要更深采证"
  handoff:
    from_stage: "采证"
    to_stage: "立骨/起稿"
    accepted_inputs:
      - "用户提供素材"
      - "ACL Anthology 论文页"
      - "arXiv 论文页"
      - "Stanford OVAL GitHub 仓库"
      - "STORM live preview"
    ignored_context:
      - "原素材中的夸张传播话术不作为事实结论"
      - "推文图片不作为关键证据"
    stop_condition: "等待用户确认主切口"
```
