# 2026年本地 AI 低门槛部署信息贴·采证包

采证日期：2026-08-20  
目标平台：微信公众号 / 可转发信息贴  
阶段：文昌总控 / 采证完成

## 采证结论

- 是否足够支撑写作：足够。
- 核心判断：低门槛部署需要同时选择运行器、量化等级和模型规模。对多数新手，LM Studio提供最完整的图形路径；需要本地API时，Ollama和LM Studio都可用；Apple Silicon追求效率时优先MLX。
- “当前最佳”不是统一排行榜。正文按内存档位提供默认选择，并把具体任务保留给用户判断。

## 多视角与矛盾地图

- 普通用户：安装步骤、界面、中文体验和磁盘占用比极限参数重要。
- 开发者：需要稳定本地API、工具集成和可替换模型标识。
- Mac用户：统一内存适合MLX，但系统和KV Cache会占用同一内存池。
- 怀疑者：模型能够加载不代表生成速度和任务质量可接受。
- 长期使用者：真正资产是本地工作流、数据边界和可替换模型层。

核心冲突：最大模型带来更高能力上限，同时增加内存、首字延迟和部署复杂度。低门槛信息贴应优先给出能稳定日用的模型档位。

## 来源清单

1. LM Studio系统要求：<https://lmstudio.ai/docs/app/system-requirements>
2. LM Studio模型下载：<https://lmstudio.ai/docs/app/basics/download-model>
3. LM Studio本地服务器：<https://lmstudio.ai/docs/developer/core/server>
4. LM Studio OpenAI兼容接口：<https://lmstudio.ai/docs/developer/openai-compat>
5. Ollama Quickstart：<https://docs.ollama.com/quickstart>
6. Ollama API：<https://docs.ollama.com/api/introduction>
7. Ollama GPU支持：<https://docs.ollama.com/gpu>
8. MLX-LM：<https://github.com/ml-explore/mlx-lm>
9. Qwen3.5官方模型列表：<https://huggingface.co/Qwen>
10. Qwen3.6-35B-A3B：<https://huggingface.co/Qwen/Qwen3.6-35B-A3B>
11. Qwen3.6 MLX 4-bit：<https://huggingface.co/mlx-community/Qwen3.6-35B-A3B-4bit>
12. Qwen3-Coder MLX 4-bit：<https://huggingface.co/mlx-community/Qwen3-Coder-30B-A3B-Instruct-4bit>
13. Gemma 4 Ollama模型页：<https://ollama.com/library/gemma4>
14. Colibrì README：<https://github.com/JustVugg/colibri>
15. Colibrì Qwen3.6文档：<https://github.com/JustVugg/colibri/blob/main/docs/qwen36.md>

## 关键事实

- LM Studio支持M1/M2/M3/M4 Apple Silicon，要求macOS 14或更高，官方建议16GB以上内存；模型下载后可以完全离线运行。
- LM Studio内置Hugging Face模型搜索和下载，并建议设备允许时选择4-bit或更高量化。
- LM Studio可从界面或`lms server start`启动本地服务，提供OpenAI兼容的Models、Responses、Chat Completions和Embeddings接口。
- Ollama支持macOS、Windows和Linux；安装后本地API默认监听`http://localhost:11434/api`。
- Ollama允许通过无效GPU ID强制CPU运行；Apple设备使用Metal，Windows/Linux可使用NVIDIA CUDA、AMD ROCm或Vulkan。
- LM Studio支持Apple Silicon、Windows和Linux；Intel Mac当前不支持，Windows x64要求AVX2，官方建议至少16GB RAM和4GB独立显存。
- MLX-LM面向Apple Silicon，支持量化模型、聊天、生成和缓存；官方提醒模型接近机器总内存时可能变慢。
- Qwen3.5 MLX 4-bit权重：4B约3.03GB、9B约5.95GB、27B约16.05GB、35B-A3B约20.39GB。
- Qwen3.6-35B-A3B官方模型为35B总参数、3B激活参数；MLX 4-bit safetensors合计约20.40GB。
- Qwen3-Coder-30B-A3B-Instruct MLX 4-bit safetensors合计约17.18GB。
- Ollama当前Gemma 4模型页列出：12B约7.6GB、26B约18GB、31B约20GB；Apple MLX标签对应约7.7GB、18GB和19GB。
- Ollama的Apple MLX标签可直接通过`gemma4:12b-mlx`、`gemma4:26b-mlx`和`gemma4:31b-mlx`运行。
- Colibrì支持矩阵列出GLM-5.2约372GB、DeepSeek V4 Flash约167GB、Qwen3.6 int4-gs64约20GB。

## 反向数据与限制

- “最佳”依赖写作、编程、视觉、Agent、长上下文等具体任务，本文只能提供低返工默认值。
- 模型文件体积不等于总内存占用；KV Cache、视觉编码、上下文长度和运行器都会增加内存。
- MLX模型主要服务Apple Silicon；Windows和Linux通常使用GGUF、CUDA或其他后端。
- `-mlx`模型不能原样用于Windows或Linux；跨平台低门槛路线应选择GGUF 4-bit或运行器提供的普通模型标签。
- “GPU不是必需项”只说明CPU路径存在，不能推导出三大系统具有相同生成速度。
- 24GB机器可能加载更大的4-bit模型，但低门槛方案需要为系统和上下文保留空间，因此正文推荐更保守。
- Mac统一内存和Windows独立显存不能直接按同一个数字横向比较；Windows模型溢出到系统内存后通常会损失交互速度。
- 官方模型支持很长上下文，不代表个人设备适合直接使用最大上下文。
- Colibrì的Qwen3.6路径约20GB且可在CPU运行，但当前Mac路径不等同MLX的完整Apple Silicon加速体验。

## content_state

```yaml
content_state:
  request:
    raw_intent: "整理一个当前最佳本地AI低门槛可用部署方案的信息贴"
    current_stage: "有活人感的公众号长文与发布包已完成，进入配图/后台预览确认"
    target_platforms:
      - "微信公众号"
      - "社交平台转发"
  topic:
    final_pick: "2026年本地AI低门槛部署指南"
    working_title: "2026年本地 AI 低门槛部署指南：按内存选模型，一次跑通"
    wechat_title: "本地大模型，已经从‘能跑’走到了‘能用’"
    core_tension: "追求最大模型会抬高门槛，稳定日用需要运行器、量化和内存共同匹配"
  audience:
    primary: "第一次部署本地AI的普通用户、创作者和开发者"
    reader_gain: "按内存直接选模型和工具，并避开常见资源误判"
  research:
    confidence: "Medium-High"
    key_facts:
      - "LM Studio提供GUI下载、聊天和OpenAI兼容本地服务"
      - "Ollama默认提供localhost:11434/api"
      - "Ollama支持CPU运行，并可使用Metal、CUDA、ROCm或Vulkan加速"
      - "MLX面向Apple Silicon"
      - "LM Studio和Ollama支持macOS、Windows与Linux；MLX仅支持Apple Silicon"
      - "Qwen3.5 4B/9B/27B的MLX 4-bit权重约3.03/5.95/16.05GB"
      - "Qwen3.6-35B-A3B MLX 4-bit权重约20.40GB"
      - "Gemma 4在Ollama提供12B、26B、31B及MLX变体"
    contrarian_points:
      - "模型权重大小不等于总运行内存"
      - "最长上下文会显著增加内存压力"
      - "最佳模型随任务变化，正文给出的是低返工默认值"
      - "Colibrì超大模型路径以研究验证为主"
      - "CPU可运行不等于各平台速度一致"
      - "-mlx模型不能直接用于Windows或Linux"
  decisions:
    - stage: "定题"
      question: "整理何种信息贴"
      user_choice: "当前最佳本地AI低门槛可用部署方案"
      timestamp: "2026-08-20"
      impact: "以运行器、内存档位和4-bit量化形成一张可执行决策表"
    - stage: "归档"
      question: "是否进入Human3.0素材审查"
      user_choice: "默认归档（用户未撤销）"
      timestamp: "2026-08-20"
      impact: "沉淀为个人AI系统的本地部署决策模板"
    - stage: "跨平台口径修正"
      question: "这些方案是否不依赖GPU且三大系统都能部署"
      user_choice: "同步更新到贴图正文"
      timestamp: "2026-08-20"
      impact: "正文新增CPU/GPU/系统兼容矩阵，分开GGUF通用路线与Apple MLX路线"
    - stage: "公众号长文改写"
      question: "如何把信息贴改成有活人感的公众号文章"
      user_choice: "以M4 Pro是否有内置GPU的真实疑问切入"
      timestamp: "2026-08-20"
      impact: "形成个人判断过程、跨平台部署建议和可执行的48GB Mac默认方案"
    - stage: "标题与主命题调整"
      question: "标题需要让读者获得什么第一认知"
      user_choice: "让大家知道个人电脑已经可以本地部署大模型"
      timestamp: "2026-08-20"
      impact: "主标题改为大模型进入个人电脑，GPU疑问下沉为正文认知转折"
    - stage: "多方案与可用性强化"
      question: "文章是否只处理用户Mac，以及如何避免把低质量启动写成可用"
      user_choice: "覆盖多种设备方案，并强调真实任务可用、好用"
      timestamp: "2026-08-20"
      impact: "正文新增七套跨平台方案和四项日用验收标准，Mac调整为其中一个案例"
  next_step:
    skill: "wechat-to-cards"
    reason: "公众号长文已完成；如需封面与正文信息图，需要确认视觉阶段"
    user_decision_needed: true
  handoff:
    from_stage: "出刊"
    to_stage: "配图/卡片"
    accepted_inputs:
      - "洁净信息贴正文"
      - "官方工具文档与模型仓库"
      - "按内存分档的部署决策表"
      - "运行器跨平台与GPU后端边界"
    ignored_context:
      - "只按参数规模排序的模型榜单"
      - "未经同机实测的速度承诺"
      - "把能加载写成流畅日用的传播口径"
      - "把MLX模型写成三大系统通用格式"
    stop_condition: "等待用户确认是否制作公众号或小红书信息卡片"
```
