# Colibrì × GLM-5.2 × DeepSeek V4 Pro-0813 研究与事实包

首次采证：2026-07-14  
最新复核：2026-08-20  
阶段：文昌总控 / 热点改版终审  
目标平台：微信公众号

## 当前判断

本轮采用“双热点、单主线”：以 2026-08-20 发布的 Colibrì v1.7.0 为主钩子，以 2026-08-13 发布的 DeepSeek V4 Pro-0813 为第二钩子，正文仍聚焦个人设备运行超大模型的真实门槛。

Colibrì 的价值成立，但传播口径需要收紧。

它证明的是：借助 MoE 的稀疏激活、int4 量化和 NVMe 专家流式加载，一台消费级电脑可以启动并执行 GLM-5.2 这类 744B 模型。它尚未证明：普通用户已经能在约 25 GB 内存的电脑上流畅、稳定、低门槛地日常使用这类模型。

文章主线应围绕三个不同问题展开：

1. 能不能跑起来？可以，但有明确软硬件条件。
2. 跑得够不够快？25 GB 低内存基线仍然很慢，增加 RAM、VRAM 和缓存后速度可以显著提高。
3. 开放权重能不能直接本地部署？不能。DeepSeek V4 Pro-0813 已开放权重，但 Colibrì 当前明确适配的是 V4 Flash。
4. 这件事为什么重要？它降低了个人研究超大模型的门槛，并已经从 GLM-5.2 验证扩展到六个模型家族。

## Storm 研究简报

### 多视角扫描

- 普通用户：关注是否能在现有电脑上使用、安装成本多高、响应要等多久。
- 本地 AI 实践者：关注隐私、离线、模型控制权，以及硬盘、内存、显存之间的取舍。
- 系统工程师：关注 MoE 稀疏激活、专家分页、磁盘带宽、预取与缓存命中率。
- 怀疑者：关注“25 GB 跑 744B”是否偷换了量化、磁盘占用、速度和模型质量等条件。
- 内容创作者：关注 DeepSeek V4 Pro 开放权重后，为什么个人部署仍然需要推理引擎、量化格式和真实 checkpoint 验证。

### 核心矛盾

传播层把“峰值内存约 20—25 GB”理解成“25 GB 电脑可以轻松使用 744B 模型”；工程实现依赖约 372 GB 的本地 NVMe 权重、每 token 约 11 GB 的冷读数据量，25 GB 开发机冷运行速度仅为 0.05—0.1 token/s。

DeepSeek V4 Pro-0813 又把模型规模推到 1.6T，但 Colibrì 当前只适配较小的 V4 Flash。真正需要回答的问题是：开放权重之后，距离个人设备可部署、可交互、可日常使用还差哪些条件？

### 综合判断

Colibrì 已从早期系统实验发展成有正式版本、预编译包、OpenAI 兼容 API 和网页前端的多模型推理引擎。它仍把自己定位为开放的推理系统研究平台；25 GB 低内存路径距离流畅聊天依然较远。

这条路线的长期意义，在于重新定义本地推理的资源边界：模型不必整体常驻内存，显存、内存和存储可以组成一套分层资源。当前最大的代价是磁盘带宽和延迟。

### 可信度评审

- “约 25 GB 内存可以运行”：高可信。当前 README 把 25 GB 开发机列为已经验证的低配基线，并给出 16 GB 最低、24 GB 更宽松的要求。
- “完整 744B 模型”：中高可信。项目保留全部路由专家，但使用第三方制作的 gs64 int4 容器；正文必须带上“量化”和“专家流式加载”条件。
- “25 GB 电脑已经适合流畅日常使用”：低可信。当前 README 对 25 GB 电脑的描述仍是“slow but correct”，冷运行约 0.05—0.1 token/s。
- “量化质量没有代价”：证据不足。当前 gs64 容器已经修正旧 per-row int4 镜像约 9 个百分点的质量落差，但它仍是量化模型，不能直接等同于原始权重。
- “本地 AI 门槛已被彻底打下”：证据不足。容量门槛下降，存储、带宽、工程复杂度和稳定性门槛仍然存在。

## 关键事实

### GLM-5.2

- 官方模型卡把 GLM-5.2 标为 MIT License、1M token context，并列出 SGLang、vLLM、Transformers、KTransformers、Unsloth 等本地部署路径。
- 官方配置显示其架构为 `GlmMoeDsaForCausalLM`，共 78 层、256 个 routed experts，每个 token 选择 8 个专家，另有 1 个 shared expert。
- Colibrì 项目把模型描述为 744B 总参数、每 token 激活约 40B 参数。744B / 40B 是本文采用的项目口径。

### Colibrì 的实现

- 仓库首页主张用约 25 GB RAM 运行 744B MoE，并用纯 C 实现、从磁盘流式读取专家。
- 项目把 VRAM、RAM 和 storage 视为统一的存储层级。
- 约 17B 的 dense 部分常驻内存，int4 下约 9.9 GB。
- 19,456 个 routed experts 留在本地磁盘，完整 gs64 int4 容器约占 372 GB。
- README 的当前演示给出约 9.9 GB resident RAM、约 32 秒 ready 时间。
- 冷启动解码每个 token 约读取 11 GB；项目开发机约 1 GB/s 磁盘吞吐时，冷解码约 0.05—0.1 token/s。
- GLM-5.2 的基础要求包括至少 16 GB RAM，24 GB 更宽松，以及约 372 GB 本地模型文件；GPU 不是必需项。项目提供 Linux x86_64、macOS arm64 和 Windows x86_64 预编译包。

### 公开实测

以下数字来自 2026-08-20 仓库 README 汇总的实测，并非统一环境的正式横评：

- 25 GB 开发机：冷运行约 0.05—0.1 token/s。
- 128 GB 纯 CPU 桌面设备：预热后约 1.8 token/s。
- 单张 RTX 5070 Ti：GPU-resident pipeline 约 1.07 token/s。
- 6 张 RTX 5090、完整驻留：约 5.8—6.8 token/s，TTFT 约 13 秒。

### DeepSeek V4 Pro-0813 与当前适配边界

- DeepSeek 于 2026-08-13 发布 V4 Pro-0813，官方模型卡给出 1.6T 总参数、49B 激活参数和 1M 上下文。
- 官方仓库的 64 个 safetensors 分片合计约 864.7 GB，可在传播稿中写作“约 865 GB 权重”。
- V4 Pro 的配置为 61 层、7168 hidden size、384 个 routed experts，每个 token 选择 6 个专家。
- Colibrì 当前明确支持的是 DeepSeek V4 Flash：43 层、4096 hidden size、256 个 routed experts，每个 token 选择 6 个专家；项目支持矩阵标注其总参数约 284B、激活参数约 13B、权重约 167 GB。
- 两者都使用 `deepseek_v4` 模型类型，不代表张量形状和内存规划兼容。Colibrì 现有 DeepSeek 引擎不能直接加载 V4 Pro-0813。
- 因此，“Colibrì 支持 DeepSeek V4”必须限定为“当前支持 DeepSeek V4 Flash”，不能扩写为“支持 V4 Pro”。

### 项目成熟度

- GitHub 仓库创建于 2026-07-01；截至 2026-08-20 本轮查询为 25,554 Star、2,773 Fork、97 个 open issues / PRs。
- 最新正式版本为 v1.7.0，发布于 2026-08-20；GitHub Releases API 共返回 11 个正式版本。
- v1.7.0 提供 Linux x86_64、macOS arm64 和 Windows x86_64 预编译包及 SHA256 校验文件。
- 当前支持 GLM-5.2、Inkling、Kimi K3、DeepSeek V4 Flash、Qwen3.6 和 OLMoE 六个模型家族。
- 项目最初由一人在 25 GB RAM 的 12 核笔记本上开发；当前 README 已把测试数据描述为来自社区的真实机器。

## 反向证据与边界

- 当前推荐的 Colibrì gs64 int4 权重由第三方发布，并非 Z.AI 官方量化产物。
- 旧的 `mateogrgic` / `jlnsrk` per-row int4 镜像已被 README 明确列为不推荐：受控测试约差 9 个百分点，并曾导致思考模式循环和生成无法结束。
- “内存低”依赖“硬盘大”：约 372 GB 模型文件仍需放在本地高速存储。
- “能生成”与“交互可用”差距明显。0.1 token/s 意味着 10 个 token 约需 100 秒。
- 高配机器的较好结果依赖 RAM / VRAM 完整或部分驻留、预热和缓存，不宜泛化到 25 GB 电脑。
- 正式 Release 和预编译包降低了安装门槛，但项目明确不提供统一速度 SLA，研究平台定位没有改变。
- DeepSeek V4 Pro-0813 已开放权重，但 Colibrì 当前没有完成对应适配；不能把“同属 `deepseek_v4` 架构”当作可直接运行的证据。

## 文章立骨

### 文章功能

帮助读者识别本地大模型传播中的条件省略，并建立“容量、速度、质量、稳定性、控制权”五维判断框架。

### 目标读者

- 关注本地 AI、国产大模型和个人 AI 系统的技术用户。
- 想在隐私、成本和体验之间做选择的创作者与工程师。
- 看到“25 GB 跑 744B”后，想知道真实门槛的人。

### 读完应拿走

1. 理解 Colibrì 如何把大部分专家权重留在 NVMe。
2. 能区分“运行成功”和“日常可用”。
3. 知道自己该选云端模型、小型本地模型，还是超大模型本地实验。
4. 把模型部署位置视为个人 AI 系统中的主动选择。

### 正文结构

1. 双热点开场：DeepSeek V4 Pro-0813 开放 1.6T 模型权重，一周后 Colibrì 发布 v1.7.0。
2. 它为什么真能跑：MoE、量化、专家流式加载。
3. 真实成本在哪里：372 GB、11 GB/token、低生成速度。
4. 开放与部署的距离：Colibrì 当前支持 V4 Flash，不能直接运行 V4 Pro。
5. 真正突破是什么：个人机器获得超大模型实验能力，内存边界被重新划分。
6. 普通人怎么选：云端、轻量本地、Colibrì 类实验的三种场景。
7. Human3.0 落点：保留部署、数据和成本的选择权。

## 来源清单

1. GLM-5.2 官方模型卡：<https://huggingface.co/zai-org/GLM-5.2>
2. Colibrì GitHub 仓库与 README：<https://github.com/JustVugg/colibri>
3. Colibrì v1.7.0 Release：<https://github.com/JustVugg/colibri/releases/tag/v1.7.0>
4. 当前推荐的第三方 gs64 int4 权重：<https://huggingface.co/mastouri/GLM-5.2-colibri-int4-g64-with-int8-mtp>
5. Colibrì GitHub Issues（社区实测与问题）：<https://github.com/JustVugg/colibri/issues>
6. DeepSeek V4 Pro-0813 官方模型页：<https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813>
7. Colibrì DeepSeek V4 Flash 引擎文档：<https://github.com/JustVugg/colibri/blob/main/docs/deepseek-v4.md>

## content_state

```yaml
content_state:
  request:
    raw_intent: "写一篇近一周 AI 热点的微信公众号文章"
    current_stage: "2026-08-20热点改版终审通过"
    target_platforms:
      - "微信公众号"
  topic:
    final_pick: "Colibrì v1.7.0 + GLM-5.2 本地运行"
    working_title: "Colibrì v1.7.0发布：25GB内存跑7440亿参数，本地AI门槛真降了吗？"
    core_tension: "开放权重、低内存启动与日常可用是三个不同阶段"
  audience:
    primary: "关注本地 AI、国产模型和个人 AI 系统的工程师与创作者"
    reader_gain: "识别条件省略，并获得本地模型选择框架"
  outline:
    - "为什么真能跑"
    - "真实代价在哪里"
    - "DeepSeek V4 Pro开放后为什么仍不能直接在Colibrì运行"
    - "突破到底发生在哪一层"
    - "普通人如何选择"
    - "如何保留个人 AI 系统的控制权"
  research:
    confidence: "Medium-High"
    primary_sources:
      - "https://huggingface.co/zai-org/GLM-5.2"
      - "https://github.com/JustVugg/colibri"
      - "https://github.com/JustVugg/colibri/releases/tag/v1.7.0"
      - "https://huggingface.co/mastouri/GLM-5.2-colibri-int4-g64-with-int8-mtp"
      - "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813"
      - "https://github.com/JustVugg/colibri/blob/main/docs/deepseek-v4.md"
    key_facts:
      - "约17B dense参数常驻，int4约9.9GB"
      - "19,456个路由专家组成的gs64 int4容器约372GB，按需从NVMe加载"
      - "resident RAM约9.9GB，冷解码读取约11GB/token"
      - "25GB开发机冷运行约0.05至0.1 token/s"
      - "截至2026-08-20为25,554 Star、2,773 Fork、v1.7.0、六个模型家族"
      - "DeepSeek V4 Pro-0813为1.6T总参数、49B激活参数、约865GB权重"
      - "Colibrì当前明确支持V4 Flash，不能直接运行V4 Pro-0813"
    contrarian_points:
      - "25GB RAM不包含约372GB本地模型文件"
      - "运行成功不能直接推导为交互可用"
      - "旧per-row int4镜像质量约低9个百分点，必须改用当前gs64版本"
      - "正式Release降低安装门槛，但项目不承诺统一速度"
      - "开放DeepSeek V4 Pro权重不等于Colibrì已经完成适配"
  decisions:
    - stage: "定题"
      question: "选择近一周AI热点"
      user_choice: "5：Colibrì + GLM-5.2 本地运行"
      timestamp: "2026-07-14"
      impact: "主线聚焦本地超大模型的真实门槛和个人控制权"
    - stage: "二次采证"
      question: "发布前更新Colibrì最新GitHub数据与技术事实"
      user_choice: "现在发布，更新正文"
      timestamp: "2026-08-20"
      impact: "更新Star、Release、推荐权重、专家数量、性能区间和项目成熟度"
    - stage: "热点改版"
      question: "文章是否可以结合最近热点增强时效性"
      user_choice: "按建议改版"
      timestamp: "2026-08-20"
      impact: "主钩子切换为Colibrì v1.7.0，DeepSeek V4 Pro-0813作为开放权重与个人部署差距的第二钩子"
  next_step:
    skill: null
    reason: "热点改版和事实边界已完成终审，可进入公众号后台"
    user_decision_needed: false
  handoff:
    from_stage: "热点改版终审"
    to_stage: "公众号后台发布"
    accepted_inputs:
      - "GLM-5.2官方模型卡"
      - "Colibrì仓库README、提交、Issues与社区实测"
      - "当前推荐的gs64 int4权重模型卡"
      - "v1.7.0 Release"
      - "DeepSeek V4 Pro-0813官方模型卡与配置"
      - "Colibrì DeepSeek V4 Flash引擎文档"
    ignored_context:
      - "未标注条件的25GB轻松运行传播口径"
      - "未经统一测试的性能泛化"
      - "旧per-row int4镜像"
      - "7月14日的Star与无Release状态"
      - "Colibrì已支持DeepSeek V4 Pro的错误外推"
    stop_condition: "可复制到公众号后台发布；封面仍需平台侧补齐"
```
