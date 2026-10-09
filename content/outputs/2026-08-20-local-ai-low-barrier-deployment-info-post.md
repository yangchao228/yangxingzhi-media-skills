# 2026年本地 AI 低门槛部署指南：按内存选模型，一次跑通

> 截至2026年8月，普通人部署本地 AI 已经不需要先研究复杂命令。最省事的路径是：用 LM Studio 或 Ollama 管理模型，从4-bit量化开始，再按照可用内存选择参数规模。

如果只记住一个默认答案：

- 第一次部署：选 **LM Studio**，图形界面完成搜索、下载、聊天和本地服务。
- 需要接入编程工具或工作流：选 **Ollama**，安装后自动提供本地 API。
- 使用 Apple Silicon，愿意多走一步换取更高效率：选 **MLX / MLX-VLM**。
- 模型先选4-bit版本，给系统、上下文和其他应用留出内存。

这里的“不需要独立显卡”不等于“不使用GPU”。小模型可以只靠CPU运行；Apple Silicon通常通过Metal使用芯片内置GPU，Windows和Linux则可以调用NVIDIA、AMD或Vulkan后端。

## 一张表选对模型

Mac看统一内存；Windows和Linux有独立显卡时，优先看显存。系统内存可以承接部分权重，但模型频繁在显存和内存之间搬运时，速度会明显下降。

| 可用于模型的内存 | 推荐起步模型 | 4-bit模型体积参考 | 适合任务 | 使用判断 |
| --- | --- | ---: | --- | --- |
| 8GB | Qwen3.5-4B | 约3.0GB | 基础问答、摘要、短文改写 | 能用，控制上下文和并发 |
| 16GB | Qwen3.5-9B | 约6.0GB | 日常写作、资料整理、轻量编程 | 当前最稳入门档 |
| 24GB | Gemma 4 12B / Qwen3.5-9B | 约7—8GB | 图文理解、较长对话、日常助手 | 体验更从容 |
| 32GB | Qwen3.5-27B / Gemma 4 26B | 约16—18GB | 较复杂推理、代码、图像理解 | 进入高质量实用档 |
| 48GB及以上 | Qwen3.6-35B-A3B / Gemma 4 31B | 约19—20.4GB | Agent、编程、长文、图像与复杂任务 | 当前个人设备甜点档 |

表里的体积是模型权重参考值。实际运行还要占用上下文缓存和系统内存；模型刚好塞满内存，体验通常不会好。

Windows独显设备可以再简化成三档：8—12GB显存优先4B—9B，16GB显存优先9B—12B，24GB显存再考虑26B—32B的4-bit模型。显存不够时可以CPU卸载，但要接受速度下降。

## 先分清系统和GPU

| 方案 | 无独立显卡能否运行 | macOS | Windows | Linux | 关键边界 |
| --- | --- | ---: | ---: | ---: | --- |
| LM Studio + GGUF | 可以，CPU速度较慢 | Apple Silicon | 支持 | 支持 | Intel Mac暂不支持；Windows x64需要AVX2 |
| Ollama + 普通模型 | 可以，也能强制CPU | 支持 | 支持 | 支持 | 自动调用Metal、CUDA、ROCm或Vulkan后端 |
| MLX / MLX-VLM / `-mlx`模型 | 使用Apple内置GPU和统一内存 | Apple Silicon专用 | 不支持 | 不支持 | 模型文件不能原样搬到Windows或Linux |
| Colibrì | 多数引擎不强制GPU | arm64 | x86_64 | x86_64 | 超大模型CPU路径更适合研究和验证 |

真正通用的模型格式优先选GGUF 4-bit。模型文件通常可以在三大系统之间复用，但每个平台仍需安装对应版本的LM Studio、Ollama或llama.cpp。

CPU单独运行时，4B—9B的4-bit模型更容易获得正常交互体验；12B开始更依赖处理器和内存带宽；27B及以上通常需要Apple统一内存GPU或容量足够的独立显卡。

## 三种工具怎么选

### 想少折腾：LM Studio

LM Studio 适合第一次部署的人。它支持 Apple Silicon、Windows 和 Linux，可以在界面里搜索 Hugging Face 模型、选择量化版本、加载聊天，也可以打开本地服务器。

它还提供 OpenAI 兼容的 `/v1/chat/completions` 和 `/v1/responses` 接口。后续想把本地模型接入 Codex、脚本或其他 AI 工具，不需要重新更换整套方案。

### 想接工具：Ollama

Ollama 适合开发者和 Agent 工作流。安装后运行一条命令即可开始：

```bash
ollama run gemma4
```

本地 API 默认位于 `http://localhost:11434/api`，可以继续接入 VS Code、OpenClaw、Claude Code 类工具或自己的应用。

Apple Silicon可以直接按内存选一条命令：

```bash
# 16GB Mac
ollama run gemma4:12b-mlx

# 32GB Mac
ollama run gemma4:26b-mlx

# 48GB及以上 Mac
ollama run gemma4:31b-mlx
```

这三档模型在Ollama中的下载体积约为7.7GB、18GB和19GB。第一次使用48GB Mac时，可以先跑31B档建立速度基线，再决定是否换成Qwen3.6。

上面的`-mlx`命令只适用于Apple Silicon。Windows和Linux应选择没有`-mlx`后缀的普通版本，例如：

```bash
ollama run gemma4:12b
```

没有独立显卡时仍可运行，但建议从4B—9B开始；拥有24GB显存后，再考虑26B—31B档。

### Mac追求效率：MLX

MLX 专门服务 Apple Silicon，能够利用统一内存。当前已经有大量4-bit模型可直接下载。

以48GB Mac为例，`Qwen3.6-35B-A3B-4bit` 权重约20.4GB，适合做综合助手；主要写代码时，可以换成约17.2GB的 `Qwen3-Coder-30B-A3B-Instruct-4bit`。

MLX 的安装和命令比图形界面多一步，更适合已经确认自己会长期使用本地模型的人。

## 最小可用部署法

第一步，查看内存，不要只看硬盘容量。

第二步，按照上表选低一档或刚好匹配的模型，优先下载4-bit量化版本。

第三步，首次运行把上下文设在8K—16K。确认内存、速度和稳定性后，再逐步提高到32K或更高。

第四步，用三个真实任务验收：处理一份自己的文档、完成一次真实写作或编程任务、通过本地 API 调用一次。

能回答“你好”只证明模型启动成功。能稳定处理自己的任务，才算完成部署。

## 六个常见坑

1. **只追最大参数。** 模型越大，首字等待、内存压力和上下文成本通常越高。
2. **直接下载8-bit。** 第一次部署先用4-bit建立基线，再决定是否用更多内存换质量。
3. **一开始拉满上下文。** 模型支持256K，不代表个人电脑适合长期以256K运行。
4. **把MoE激活参数当成内存占用。** 35B-A3B每次只激活约3B参数，完整权重仍要下载并进入内存或存储层级。
5. **把实验引擎当日常聊天工具。** Colibrì 可以让个人设备启动数百B模型，但GLM-5.2约372GB、DeepSeek V4 Flash约167GB，低内存路径仍以研究和验证为主。
6. **把MLX模型当成跨平台文件。** `-mlx`只服务Apple Silicon；Windows和Linux优先选GGUF或对应GPU后端的模型格式。

## 一套可以直接照抄的默认方案

- 8GB设备：LM Studio + Qwen3.5-4B 4-bit
- 16GB设备：LM Studio或Ollama + Qwen3.5-9B 4-bit
- Windows/Linux纯CPU：LM Studio或Ollama + GGUF 4B—9B 4-bit
- Windows/Linux 24GB显存：Ollama或LM Studio + Gemma 4 26B/31B普通版
- 32GB Apple Silicon：Ollama + `gemma4:26b-mlx`
- 48GB Apple Silicon：MLX + Qwen3.6-35B-A3B 4-bit，或Ollama + `gemma4:31b-mlx`
- 需要本地 API：LM Studio启动OpenAI兼容服务，或直接使用Ollama

本地 AI 的第一目标，是把一个真实任务稳定留在自己的设备上。模型、工具和参数都可以继续升级，能长期复用的本地工作流才是个人数字资产。

---

## 资料来源

- [LM Studio 系统要求](https://lmstudio.ai/docs/app/system-requirements)
- [LM Studio 模型下载与量化说明](https://lmstudio.ai/docs/app/basics/download-model)
- [LM Studio 本地服务器与 OpenAI 兼容接口](https://lmstudio.ai/docs/developer/core/server)
- [Ollama Quickstart](https://docs.ollama.com/quickstart)
- [Ollama API](https://docs.ollama.com/api/introduction)
- [Ollama GPU支持与CPU回退](https://docs.ollama.com/gpu)
- [Apple MLX-LM](https://github.com/ml-explore/mlx-lm)
- [Qwen3.6-35B-A3B 官方模型页](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [Gemma 4 的 Ollama 模型页](https://ollama.com/library/gemma4)
- [Colibrì 支持矩阵](https://github.com/JustVugg/colibri#other-supported-models)
