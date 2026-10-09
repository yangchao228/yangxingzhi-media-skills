# Jev 引导篇图片提示词与生成记录

日期：2026-09-21
生成方式：内置 `image_gen`；生成无文字底图后，用本地系统字体叠加精确中文标签
视觉底座：近黑炭色、米白、暖金、低饱和青蓝，少量珊瑚色表示人工复核或不确定性

## 01｜封面

Use case: productivity-visual
Asset type: WeChat public-account cover, wide 2.35:1 landscape
Primary request: Create a polished editorial technology cover about AI moving from text generation to structured decisions. Show an abstract conversational text stream on the left transforming into a precise decision panel on the right, with three distinct decision paths. Leave clear negative space in the upper-left for title overlay.
Style: premium editorial infographic illustration, restrained flat geometry, subtle depth, no people
Constraints: no embedded text, no logos, no watermark, no neon cyberpunk, no clutter

叠加文字：

- `AI 从生成走向判断`
- `Jev 实战指南 00 · Decision Layer`

## 02｜Decision Layer 架构图

Use case: infographic-diagram
Asset type: WeChat article body diagram, 16:9 landscape
Primary request: Show a left-to-right workflow from input/data to a generative model, then a visually distinct decision layer with three modules, then database, automation, product action and human-review fallback.
Style: premium editorial systems diagram, crisp geometric panels, thin glowing connectors
Constraints: no embedded text, keep large label areas, no logos, no watermark

叠加标签：`输入 / Data`、`生成 / Generate`、`Decision Layer`、`数据库`、`自动化`、`产品动作`、`人工复核`

## 03｜Choice / Score / Noul 对照图

Use case: infographic-diagram
Asset type: WeChat article body diagram, 16:9 landscape
Primary request: Create three equal panels: a branching choose-one selector, an ordered low-to-high scale, and a yes/no probability gauge with a confidence split.
Style: premium editorial educational infographic, coherent three-panel layout
Constraints: no embedded text, blank label areas, no logos, no watermark

叠加标签：

- `Choice` / `固定选项`
- `Score` / `有序等级`
- `Noul` / `Yes 概率`

## 04｜China Clearly 实验流程图

Use case: infographic-diagram
Asset type: WeChat article body diagram, 16:9 landscape
Primary request: Show AI answers flowing into human annotation, a structured decision engine, a gold-set comparison checkpoint, and measurement gauges for precision, recall and manual-review rate. Include a small language branch and a version tag marker for reproducibility.
Style: rigorous editorial research pipeline, calm and investigative
Constraints: no embedded text, explicit human-review gate, no logos, no watermark

叠加标签：`模型回答`、`人工标注`、`Decision Layer`、`Gold Set`、`Precision`、`Recall`、`人工复核率`、`EN · 中文 · 中英`、`versioned model ID`

## 产物

- `../assets/00-jev-cover.png`
- `../assets/01-decision-layer.png`
- `../assets/02-jev-primitives.png`
- `../assets/03-china-clearly-experiment.png`

底图保留在 `../assets/generated-base/` 作为内部可回滚素材，未上传外部服务。
