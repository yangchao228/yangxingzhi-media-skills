---
name: long-to-cards
description: >
  将长文转化为社交媒体图文内容。提炼 4-8 个精华点，生成 HTML 卡片并可选拆分为独立 PNG 图片（1080x1440），提供 3 个爆款候选标题及对应正文和标签。支持一键发布到微信公众号草稿箱和小红书草稿箱。
  触发时机：用户提供长文并要求转成图文、卡片、公众号内容、小红书图文，
  或提到"长文转卡片"、"做成图文"、"发小红书"、"发公众号"、"爆款标题"等。
---

# 长文转图文卡片

## 边界

这是通用长文转 3:4 图文卡片的兜底模块。优先用于用户没有明确指定“公众号小绿书”或“小红书爆款图片集”的情况。

- 明确要公众号方形配图：优先用 `wechat-to-cards`
- 明确要小红书 HTML 卡片：优先用 `redbook-cards`
- 明确要小红书 7/8/9 张图片生成提示词和发布文案包：优先用 `xiaohongshu-viral-image-skill-v4`

## 工作流程

1. 阅读并分析用户提供的长文
2. 提炼 4-8 个最精华的核心观点
3. 生成 3 个爆款候选标题 + 对应正文 + 标签
4. 生成 3:4 卡片 HTML 文件供截图使用
5. 可选：自动发布到微信公众号/小红书草稿箱

## 成本敏感规则

通用卡片工作流默认先收敛结构，再生成完整卡片和发布动作。

- 先确认目标平台、卡片数量、核心观点和是否需要结尾页。
- 只需要标题、正文或标签时，不生成 HTML。
- HTML 已生成后，截图拆图、发布到草稿箱、上传图片都必须用户确认。
- 返工时优先修改 `config.json` 中对应卡片，不重跑全文提炼。
- 不同时生成多套平台版本，除非用户明确要求。

## Step 1: 内容提炼

分析长文，提取 4-8 个精华点。要求：
- 每个点独立成篇，2-4 句话
- 保留原文的核心论据或数据
- 用口语化、有信息密度的方式重写
- 避免学术腔，用"你/我们"拉近距离

## Step 2: 标题 + 正文 + 标签

生成 **3 个候选方案**，每个包含：

| 字段 | 要求 |
|------|------|
| 标题 | 15-25 字，制造反差/悬念/数字/利益点 |
| 正文 | 200-500 字，开头钩子 + 精华展开 + 结尾引导 |
| 标签 | 5-8 个话题标签，含 2 个泛流量词 + 3 个精准词 |

标题公式（至少覆盖其中 2 种）：
- **数字法**: "X 个 XX 方法，让 XX 提升 X 倍"
- **反差法**: "你以为 XX，其实 XX"
- **利益法**: "学会这个，XX 不再是问题"
- **悬念法**: "XX 背后的真相是..."
- **身份法**: "做 XX 的人，一定要知道 XX"

## Step 3: 生成卡片

使用 `scripts/card-gen/generate_cards.py` 生成 HTML 卡片：

1. 构建 `config.json`，包含封面卡 + 4-8 内容卡 + 结尾卡
2. 运行脚本生成 `cards.html`
3. 生成 `cards-ending.html`（Human3.0 品牌风格结尾）

```bash
python3 scripts/card-gen/generate_cards.py --config config.json --output cards.html

# 使用特定结尾版本（0-2 = 标准风格，3 = 参考风格）
python3 scripts/card-gen/generate_cards.py --config config.json --output cards-ending.html --ending-index 3
```

### config.json 格式

```json
{
  "theme": "light",
  "source": "AI实践 | HUMAN3.0 专栏",
  "cards": [
    {
      "type": "cover",
      "tag": "深度精选",
      "title": "主标题",
      "subtitle": "一句话副标题",
      "meta": "AI实践 | HUMAN3.0 专栏 · 2026/04/16"
    },
    {
      "type": "content",
      "index": 1,
      "title": "要点标题",
      "body": "正文，<strong>关键字会高亮</strong>，支持 HTML 标签",
      "quote": "可选引用"
    },
    {
      "type": "ending",
      "text": "感谢阅读",
      "sub": "关注获取更多 AI 实战内容",
      "cta": "关注收藏"
    }
  ],
  "ending_versions": [
    {
      "type": "ending",
      "tag": "AI实战指南",
      "text": "AI 不是答案，是杠杆",
      "sub": "真正拉开差距的，不是有没有用 AI<br>而是怎么把 AI 变成你的工作系统",
      "highlights": [
        "把重复的事交给 AI",
        "把混乱的信息变成结构",
        "把判断和审美留给自己"
      ],
      "cta": "关注收藏",
      "cta_sub": "每周更新 AI 实战内容"
    },
    {
      "type": "ending",
      "style": "ref",
      "avatar_initial": "AI",
      "brand": "AI生命克劳德",
      "brand_sub": "普通人和AI共生共创",
      "items": [
        "持续探索 HUMAN 3.0：AI 时代，个体如何重构工作方式、创作方式与能力结构",
        "后续内容：AI 提效实践、独立开发、认知主权与真实场景复盘",
        "欢迎关注，不错过系列更新"
      ],
      "btn_text": "搜索「AI生命克劳德」关注",
      "footer_tag": "MAN 3.0",
      "footer_copy": "@AI生命克劳德"
    }
  ]
}
```

### 卡片视觉特性

| 特性 | 说明 |
|------|------|
| 尺寸 | 1080x1440 (3:4) |
| 主题 | light / dark 切换 |
| 左上角 | `@AI生命克劳德` 水印 |
| 分割线 | 渐变线 + 圆点装饰 |
| 关键字 | `<strong>` 自动转为蓝紫渐变高亮 |
| 页脚 | 内容卡居中页码，封面/结尾空条 |

### 结尾页风格

| 索引 | 风格 | 说明 |
|------|------|------|
| 0-2 | 标准 | 大标题 + 分割线 + 3 条要点 + CTA 按钮 |
| 3 | 参考 | 头像圆 + 品牌名 + 箭头列表 + 搜索按钮（Human3.0 品牌风格） |

## Step 4: 拆分为图片

HTML 生成完成后，**必须**使用 `AskUserQuestion` 询问用户是否要将 HTML 卡片拆分为独立图片：

```yaml
header: "拆分为图片"
question: "HTML 卡片已生成，是否要将每张卡片拆成独立 PNG 图片（1080x1440）？"
options:
  - label: "拆成图片（推荐）"
    description: "使用 Puppeteer 自动截图，生成 cover.png、card_1~N.png、ending.png"
  - label: "不用，我自己截图"
    description: "浏览器打开 HTML，手动截图每张卡片"
  - label: "拆成图片并指定输出目录"
    description: "指定自定义输出路径"
```

**用户选择拆图后的执行流程**：

1. 确保已安装 `puppeteer`：`npm install puppeteer --no-save`
2. 运行截图脚本，将 HTML 拆分为独立 PNG：

```bash
node scripts/screenshot_cards.js <html文件> <输出目录>
# 示例: node scripts/screenshot_cards.js cards-ending.html output_cards
```

3. 确认图片生成后，告知用户：
   - 图片数量和文件名
   - 输出目录路径
   - 图片尺寸（1080x1440）

### screenshot_cards.js 脚本

脚本位置：`scripts/screenshot_cards.js`

```javascript
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function main() {
  const htmlFile = path.resolve(process.argv[2] || 'cards-ending.html');
  const outputDir = path.resolve(process.argv[3] || 'output_cards');

  if (!fs.existsSync(htmlFile)) {
    console.error(`HTML file not found: ${htmlFile}`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1440 });

    const fileUrl = `file://${htmlFile}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.card');

    const cards = await page.$$('.card');
    console.log(`Found ${cards.length} cards`);

    for (let i = 0; i < cards.length; i++) {
      const name = i === 0 ? 'cover.png' : i === cards.length - 1 ? 'ending.png' : `card_${String(i).padStart(2, '0')}.png`;
      await cards[i].screenshot({
        path: path.join(outputDir, name),
        type: 'png'
      });
      console.log(`  ✓ ${name}`);
    }

    console.log(`\n共生成 ${cards.length} 张卡片 → ${outputDir}/`);
  } finally {
    await browser.close();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
```

## Step 5: 发布（可选）

### 微信公众号

```bash
pip install requests

python3 scripts/publish/publish_wechat.py \
  --app-id YOUR_APP_ID \
  --app-secret YOUR_APP_SECRET \
  --title "标题" \
  --content "<p>HTML 正文</p>" \
  --thumb cover.jpg
```

需要公众号 AppID 和 AppSecret。详见 [references/platform-apis.md](references/platform-apis.md)。

### 小红书

```bash
pip install playwright
playwright install chromium

python3 scripts/publish/publish_xiaohongshu.py \
  --title "标题" \
  --content "正文" \
  --images card1.jpg card2.jpg card3.jpg
```

首次运行需手动登录，后续自动加载 cookie。⚠️ 小红书后台可能改版导致选择器失效。

详见 [references/platform-apis.md](references/platform-apis.md)。
