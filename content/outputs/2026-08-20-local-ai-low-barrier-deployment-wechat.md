# 本地大模型，已经从“能跑”走到了“能用”

> 从 8GB 纯 CPU 设备，到 48GB Apple Silicon，再到配有独立显卡的 Windows 和 Linux，本地部署已经有了多套可日用方案。本文只按一个标准推荐：模型跑起来以后，能不能稳定完成真实任务。

把一个大模型装进电脑，今天已经不算什么新闻。

真正值得关注的变化是：一批本地模型已经跨过“勉强启动”的阶段，开始能够写作、整理资料、辅助编程、理解图片，也能通过本地 API 接进自己的工作流。

有人用几十上百 GB 的模型成功生成一个字，这当然很酷。可如果每次提问都要等很久、上下文稍长就卡住、输出还不如在线模型，那只是一次技术展示。

我更关心另一件事：**普通人现有的电脑上，有哪些方案真的能留下来干活？**

答案已经不止一种。

8GB 设备可以承担摘要和格式整理；16GB 能进入日常写作与轻量编程；24GB—32GB 开始接近高质量个人助手；48GB Apple Silicon 已经能容纳 35B 级 4-bit 模型。Windows 和 Linux 只要显存匹配，同样有成熟路线。

大模型，确实已经走进个人电脑了。

## 先说清楚，怎样才算好用

“成功加载”这个标准太低。模型能回答“你好”，只证明软件启动了。

我会用四个条件判断一套本地方案能不能日用：

1. **装得下，也留有余量。** 系统、上下文缓存和其他应用仍有空间；
2. **任务质量过关。** 摘要能核对，代码能修改，写作结果能继续编辑；
3. **等待可以接受。** 不追求在线服务的速度，但不能每次使用都打断思路；
4. **能够重复调用。** 下次开机仍能运行，并且可以接入本地 API 或固定工作流。

这篇文章没有给出 token/s 跑分。处理器、内存带宽、上下文长度和运行器都会改变速度，拿不同设备上的单次数字做保证，意义不大。

更可靠的判断是：选择比机器极限低一档的模型，先用 8K—16K 上下文完成三个真实任务，再决定要不要继续加码。

## 七套方案，覆盖大多数个人电脑

下面这张表给的是保守起点。每一档都留出了系统和上下文空间，目标是持续使用。

| 你的设备 | 推荐组合 | 适合完成的任务 | 使用边界 |
| --- | --- | --- | --- |
| 8GB、无独显 | LM Studio + Qwen3.5-4B 4-bit | 摘要、翻译、分类、短文改写 | 控制上下文，不承担复杂推理 |
| 16GB、无独显或入门 Mac | LM Studio / Ollama + Qwen3.5-9B 4-bit | 写作、资料整理、轻量编程 | 一次处理一个主要任务 |
| 24GB Apple Silicon | Gemma 4 12B MLX / Qwen3.5-9B 4-bit | 图文理解、长文整理、日常助手 | 给 macOS 和其他应用留空间 |
| 32GB Apple Silicon | Qwen3.5-27B / Gemma 4 26B 4-bit | 编程、复杂写作、图像理解 | 上下文先从 8K—16K 起步 |
| 48GB 及以上 Apple Silicon | Qwen3.6-35B-A3B / Gemma 4 31B 4-bit | Agent、代码、长文和综合任务 | 当前个人 Mac 的高质量日用档 |
| Windows / Linux，8GB—12GB 显存 | 4B—9B GGUF 4-bit | 写作、知识问答、轻量代码 | 避免模型频繁溢出到系统内存 |
| Windows / Linux，24GB 显存 | Qwen3.5-27B / Gemma 4 26B 4-bit | 高质量文本、代码和复杂任务 | 31B 可尝试，长上下文要保守 |

这里有一个容易被忽略的事实：**小模型也可以好用，前提是任务选对。**

4B 模型不适合承担复杂研究，但它做格式转换、内容分类、固定模板提取时，速度和资源占用都很合适。9B 模型已经能覆盖相当多的写作和资料处理。到了 27B—35B，综合能力、指令遵循和复杂任务的上限才会明显打开。

把 8GB 机器硬塞进 30B 模型，体验通常不如让 4B 模型专心做一件明确的小事。

## 我这台 48GB Mac，只是其中一档

我自己的机器是 16 英寸 MacBook Pro：M4 Pro 芯片，48GB 统一内存，1TB 硬盘还有约 439GB 可用。

看到配置页时，我先问了一个很基础的问题：

**它没有 NVIDIA 独显，到底有没有 GPU？**

答案很明确：有。

M4 Pro 芯片里集成了 Apple GPU。LM Studio、Ollama、MLX 这类工具可以通过 Metal 使用它。Apple Silicon 的 CPU 和 GPU 共用统一内存，所以这 48GB 同时承担系统、模型权重、上下文缓存和推理计算。

这台机器的合适区间是 **20GB 左右的 4-bit 模型**：

- 综合任务：Qwen3.6-35B-A3B 4-bit，模型权重约 20.4GB；
- 代码任务：Qwen3-Coder-30B-A3B-Instruct 4-bit，约 17.2GB；
- 少配置、直接运行：Ollama 的 `gemma4:31b-mlx`，下载体积约 19GB。

这几套方案都没有吃满 48GB，系统和上下文还能保留明显余量。对这台 Mac，我会先用下面这条命令建立日用基线：

```bash
ollama run gemma4:31b-mlx
```

如果更重视代码，再转到 MLX 版 Qwen3-Coder；如果希望在多种任务之间保持平衡，可以选择 Qwen3.6-35B-A3B。

这是 48GB Mac 的方案。16GB、32GB、Windows 独显和纯 CPU 设备，都应该按自己的资源走上面的其他档位。

## 三种工具，按使用方式选择

模型决定能力上限，运行工具决定你愿不愿意每天打开它。

### 想最快开始：LM Studio

LM Studio 有图形界面，可以直接搜索、下载、加载和对话，也能启动 OpenAI 兼容的本地服务。

第一次部署、还不确定自己会不会长期使用，选它最省事。macOS、Windows 和 Linux 都有对应版本，不过当前不支持 Intel Mac；Windows x64 处理器需要 AVX2。

### 想接入工具：Ollama

Ollama 安装后会提供本地 API，适合连接编程工具、Agent、知识库或自己的应用。

它覆盖 macOS、Windows 和 Linux：Apple Silicon 使用 Metal，Windows 和 Linux 可以调用 NVIDIA CUDA、AMD ROCm 或 Vulkan。没有独显时也能走 CPU，建议控制在 4B—9B。

### 想提高 Mac 效率：MLX

MLX 面向 Apple Silicon，能够利用 Apple GPU 和统一内存。愿意多做一点配置，通常可以获得更贴合 Mac 硬件的运行方式。

MLX 和带 `-mlx` 标签的模型只适用于 Apple Silicon。希望同一份模型文件跨 Mac、Windows、Linux 使用，优先选择 GGUF 4-bit。

## Colibrì 很有意思，但先放在实验区

Colibrì 证明了一件重要的事：通过 CPU、内存和磁盘协同，个人设备可以尝试体量远超物理内存的模型。

它当前列出的 DeepSeek V4 Flash 约 167GB，GLM-5.2 约 372GB。能让这种规模的模型在个人设备上启动，技术价值很高。

日用标准还要继续考察首字等待、持续生成速度、磁盘读写和实际任务质量。对多数人，先把 9B—35B 的 4-bit 模型跑顺，更容易得到一套每天愿意使用的本地 AI。Colibrì 可以作为第二条实验路线，专门研究超大模型的容量边界。

这样分开以后，探索新技术和获得生产力不会互相耽误。

## 别用“你好”验收本地模型

我会拿三件真实工作来验收：

1. 读一份自己的长文档，输出可以逐项核对的摘要；
2. 完成一段本来就要写的文章、代码或数据整理；
3. 通过本地 API 调用一次，确认它能进入现有工作流。

三个任务连续完成，等待时间没有打断思路，输出也值得继续加工，这套方案才算通过。

如果效果差，先换同档模型或缩短上下文，再考虑升级硬件。很多问题来自模型与任务不匹配，并非电脑一定不够强。

## 大模型进电脑，价值才刚开始

本地部署的意义当然包括隐私和离线使用。更长远的价值，是模型、个人资料和工作流程开始处在自己的控制范围内。

今天换 Qwen，明天换 Gemma；这次用 LM Studio，下次换 Ollama。只要任务模板、知识资料、验收标准和接口方式保留下来，之前的投入就不会随着某个模型下线而消失。

本地大模型已经走到“能用”的阶段。接下来值得积累的，是一套真正属于自己的使用方法。

你现在用的是多大内存、什么系统？如果先把一个任务搬到本地，你会选写作、编程、资料整理，还是图片理解？

---

## 资料来源

- [LM Studio 系统要求](https://lmstudio.ai/docs/app/system-requirements)
- [LM Studio 模型下载与量化说明](https://lmstudio.ai/docs/app/basics/download-model)
- [LM Studio 本地服务器与 OpenAI 兼容接口](https://lmstudio.ai/docs/developer/core/server)
- [Ollama Quickstart](https://docs.ollama.com/quickstart)
- [Ollama API](https://docs.ollama.com/api/introduction)
- [Ollama GPU 支持与 CPU 回退](https://docs.ollama.com/gpu)
- [Apple MLX-LM](https://github.com/ml-explore/mlx-lm)
- [Qwen3.6-35B-A3B 官方模型页](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [Gemma 4 的 Ollama 模型页](https://ollama.com/library/gemma4)
- [Colibrì 支持矩阵](https://github.com/JustVugg/colibri#other-supported-models)
