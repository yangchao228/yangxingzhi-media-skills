# 不要把学习外包给 AI｜封面与小红书卡片

生成内容：

- `svg/wechat-cover.svg`：公众号封面，尺寸 1400x596。
- `svg/01-cover.svg` 到 `svg/08-series-preview.svg`：小红书 8 页卡片，尺寸 1080x1440。
- `png/wechat-cover.png`：公众号封面 PNG，尺寸 1400x596。
- `png/01-cover.png` 到 `png/08-series-preview.png`：小红书 8 页卡片 PNG，尺寸 1080x1440。
- `preview.html`：本地预览页。

如需重新生成 SVG 和预览页：

```bash
node ai_study/assets/01-dont-outsource-learning/generate_assets.mjs
```

如需重新生成精确尺寸 PNG：

```bash
/Users/yangchao/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 ai_study/assets/01-dont-outsource-learning/render_pngs.py
```
