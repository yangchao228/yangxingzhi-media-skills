# 《永恒的互补》ChatGPT 生图提示词

## 使用方式

1. 先生成第 1 张封面，确认纸张、线稿、色板和阴影。
2. 后续每次生成时，把第 1 张作为 **style reference**，并告诉 ChatGPT：保持同一套视觉系统，只改变主题和构图。
3. 所有图片统一横向 16:9，建议 1600×900；图片内不生成中文标题，标题和图注在公众号排版中添加。
4. 建议先生成当前正文需要的 6 张：封面、韦布、机构智能、OPC、taste 和深度 / 宽度。首屏宇宙图是备选，不进入当前正文。

## 统一风格前缀

将下面这段放在每个提示词最前面：

```text
Create a restrained editorial science illustration for a long-form technology essay. Use warm ivory handmade paper texture, tactile cut-paper collage, delicate indigo and cobalt-blue blueprint linework, muted gold accents, occasional muted ochre-orange for emphasis, soft top lighting, small physical shadows, subtle watercolor and charcoal marks, calm surreal composition, generous negative space, one clear visual metaphor, quiet sense of scale and wonder, elegant asymmetry, horizontal 16:9 composition, 1600x900.

Keep the visual language consistent across the series. No photorealistic stock image, no glossy 3D render, no neon cyberpunk, no code rain, no generic humanoid robot, no corporate presentation style, no dense infographic, no logo, no watermark, no readable text inside the image, no invented labels or numbers.
```

## 1. 封面：采石场与星辰

```text
Create a wide editorial cover image about brilliant ideas needing a civilization to realize them. In the upper half, place a large abstract constellation, a folded architectural blueprint, and a faint branching galaxy. In the lower half, show a quiet quarry with tiny human figures, stones, ledgers, tools, and a narrow path being built toward the upper structure. The people and stones must be very small compared with the abstract idea above. Leave generous dark negative space on the left side for title overlay. The mood is contemplative and monumental, not dramatic.
```

公众号图注：**再大的想法，也需要一条通往现实的路。**

## 2. 可选图：思想走到宇宙，双手仍在地面

```text
Create an editorial conceptual illustration of the mismatch between human thought and physical reach. In the lower-left corner, show a small hand holding a simple two-lens telescope. A thin indigo line travels from the telescope toward the upper-right, opening into distant galaxies and a faint early-universe glow. Keep the hand and telescope grounded on a quiet paper surface while the cosmos remains spacious and almost weightless. Use scale contrast and silence; do not show an astronaut or a literal diagram.
```

公众号图注：**思想可以越过宇宙，身体仍然从地面出发。**

当前版本暂不插入这张图，只有在首屏需要视觉停顿时再启用。

## 3. 韦伯：从一架望远镜到一整套文明

```text
Create an editorial cut-paper and blueprint illustration comparing a simple handheld telescope with a civilization-scale observatory. On the left, show a small Galileo-like telescope made of two lenses and a tube. On the right, show an abstract folded space telescope with eighteen large mirror segments, surrounded by tiny laboratories, test benches, factories, rail lines, ports, and connected nodes. Do not draw a technically exact JWST; communicate the scale jump from a few hands to a global support system. Use indigo linework with muted gold highlights and ample empty space.
```

公众号图注：**看得更远，调用的互补能力也越来越多。**

## 4. 机构智能：天才画图，系统搬石头

```text
Create a conceptual editorial illustration of institutional intelligence as a chain of correct local actions. At the top, place a floating monument blueprint with a single luminous geometric idea. Below it, build a quiet horizontal chain of stones, tools, ledgers, approval stamps, transport tracks, workshops, and small human figures moving materials from one stage to the next. The blueprint should feel brilliant but incomplete; the lower system should feel ordinary, precise, and indispensable. Use paper collage, indigo blueprint lines, muted gold, and small ochre accents. Avoid an org chart or business infographic.
```

公众号图注：**纪念碑的图纸很重要，石头也要一块块砌上去。**

## 5. OPC：一个人能做很多，却补不上闭环

```text
Create an editorial conceptual illustration of a one-person technical system that needs complementary abilities. On the left, show a tall compact tower assembled from tools, gears, modular blocks, and abstract system components. On the right, show a separate network made of resource nodes, customer signals, delivery paths, and feedback loops. Between them is a missing bridge; a small diverse team is quietly building that bridge. Keep people small and non-heroic. The image should communicate complementarity and an incomplete loop, not failure or sadness.
```

公众号图注：**一个人可以先搭起一座塔，闭环还需要另一座塔接住它。**

## 6. Taste：选题变多以后，真正难的是取舍

```text
Create a calm editorial illustration about taste as the scarce ability to choose what deserves attention. Place a small compass or quiet human figure at the center. Around it, unfold many translucent paper doors, paths, project cards, small prototypes, and branching routes. One route is marked only by a faint ochre-orange light; the others remain plausible but quiet. Do not show stress, deadlines, clocks, or a busy office. The image should feel like a thoughtful choice among many good possibilities.
```

公众号图注：**选项越来越多，值得继续的方向仍然需要有人挑出来。**

## 7. 深度、宽度与人的独特方向

```text
Create a wide split-scene editorial illustration showing two possible civilizations without presenting either as good or bad. On the left, a deep vertical composition: a dark paper well, a quiet laboratory, a telescope, a precise beam of light, and a nearly completed puzzle. On the right, a wide horizontal composition: factories, energy modules, orbital construction, slow expanding rings, and a distant star field. At the bottom, place several tiny human figures choosing different directions, each carrying a different small object. Use indigo-blue for depth, muted ochre-orange for width, and a shared warm ivory paper ground. Keep the mood patient and open-ended.
```

公众号图注：**有些问题可以想得更深，有些问题必须等待现实完成它的部分。**

## 统一负面约束

```text
Avoid readable text, Chinese characters, English labels, logos, watermarks, fake statistics, literal AI brains, humanoid robot mascots, smiling corporate teams, glossy sci-fi interfaces, neon colors, photorealistic people, crowded dashboards, arrows everywhere, clip-art icons, poster typography, and excessive visual noise.
```

## 生成后检查

- 是否仍然是同一套暖象牙纸张、靛蓝线稿、哑金 / 赭橙点缀？
- 每张图是否只有一个主要隐喻？
- 缩小到公众号手机屏幕宽度后，主体是否仍然清楚？
- 是否出现错误文字、伪数据或无法解释的物件？
- 是否能在不看正文的情况下，大致理解“互补、支持系统、取舍、深度 / 宽度”中的一个概念？
