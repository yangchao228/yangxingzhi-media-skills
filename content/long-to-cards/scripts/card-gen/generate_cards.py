#!/usr/bin/env python3
"""
生成 3:4 图文卡片 HTML 文件。

用法:
  python3 generate_cards.py --config config.json --output cards.html

config.json 格式:
{
  "theme": "light",          // light 或 dark
  "source": "公众号名称",
  "cards": [
    { "type": "cover", "tag": "深度精选", "title": "主标题", "subtitle": "副标题", "meta": "作者 · 日期" },
    { "type": "content", "index": 1, "title": "要点标题", "body": "正文内容(支持<strong>加粗</strong>)", "quote": "可选引用" },
    { "type": "ending", "text": "关注收藏", "sub": "获取更多 AI 实战内容", "cta": "立即关注" }
  ]
}
"""

import json
import argparse
import os
from html import escape

CARD_WIDTH = 1080
CARD_HEIGHT = 1440

STYLE = """
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bg-primary: #FAFAF9; --bg-card: #FFFFFF; --bg-accent: #F5F0EB;
  --text-primary: #1A1A1A; --text-secondary: #6B6B6B; --text-tertiary: #999999;
  --accent: #2D5BE3; --accent-light: #E8EFFC; --border: #E8E4DF;
  --shadow: 0 2px 16px rgba(0,0,0,0.06);
  --gradient-start: #2D5BE3; --gradient-end: #7C3AED;
}
[data-theme="dark"] {
  --bg-primary: #0F0F0F; --bg-card: #1A1A1A; --bg-accent: #252525;
  --text-primary: #F0F0F0; --text-secondary: #A0A0A0; --text-tertiary: #707070;
  --accent: #6B9FFF; --accent-light: #1A2A44; --border: #333333;
  --shadow: 0 2px 16px rgba(0,0,0,0.3);
  --gradient-start: #6B9FFF; --gradient-end: #A855F7;
}
body { background: var(--bg-primary); font-family: -apple-system, "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 40px; }
.card { width: """ + str(CARD_WIDTH) + """px; height: """ + str(CARD_HEIGHT) + """px; background: var(--bg-card); border-radius: 24px; box-shadow: var(--shadow); padding: 80px 72px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
.card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end)); }
.card.cover, .card.ending { justify-content: center; align-items: center; text-align: center; }
.card.cover { padding: 100px 80px; }
.card-middle { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; text-align: center; padding: 0 24px; }
.card-number { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end)); color: #FFF; font-size: 28px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; }
.card-title { font-size: 48px; font-weight: 700; color: var(--text-primary); line-height: 1.35; margin-bottom: 36px; letter-spacing: -0.02em; }
.card-title .hl { background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.card-body { font-size: 32px; color: var(--text-secondary); line-height: 1.8; max-width: 860px; text-align: center; }
.card-body p { margin-bottom: 20px; }
.card-body strong { color: var(--text-primary); font-weight: 600; }
.card-body ul { padding-left: 28px; margin: 16px 0; }
.card-body li { margin-bottom: 12px; }
.card-body li::marker { color: var(--accent); }
.card-quote { background: var(--bg-accent); border-left: 4px solid var(--accent); border-radius: 12px; padding: 28px 32px; margin: 24px 0; font-size: 28px; color: var(--text-secondary); font-style: italic; line-height: 1.7; }
.card-footer { margin-top: auto; padding-top: 32px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.card-source { font-size: 22px; color: var(--text-tertiary); }
.card-page { font-size: 22px; color: var(--text-tertiary); font-weight: 500; }
.cover-tag { display: inline-block; padding: 12px 28px; background: var(--accent-light); color: var(--accent); border-radius: 100px; font-size: 24px; font-weight: 600; margin-bottom: 48px; letter-spacing: 0.05em; }
.cover-title { font-size: 64px; font-weight: 800; color: var(--text-primary); line-height: 1.3; margin-bottom: 40px; letter-spacing: -0.03em; }
.cover-subtitle { font-size: 32px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 60px; }
.cover-meta { font-size: 22px; color: var(--text-tertiary); }
.ending-text { font-size: 40px; font-weight: 700; color: var(--text-primary); margin-bottom: 24px; }
.ending-sub { font-size: 28px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 48px; }
.ending-cta { padding: 20px 48px; background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end)); color: #FFF; border-radius: 100px; font-size: 28px; font-weight: 600; }
.controls { position: fixed; top: 16px; right: 16px; z-index: 100; display: flex; gap: 8px; }
.controls button { padding: 10px 20px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card); color: var(--text-primary); cursor: pointer; font-size: 14px; font-weight: 500; }
.controls button:hover { background: var(--bg-accent); }
@media print { .controls { display: none; } body { padding: 0; gap: 0; background: white; } }
"""


def render_cover(card, source):
    return f"""<div class="card cover">
  <div class="cover-tag">{escape(card.get('tag', '精选'))}</div>
  <div class="cover-title">{escape(card['title'])}</div>
  <div class="cover-subtitle">{escape(card.get('subtitle', ''))}</div>
  <div class="cover-meta">{escape(card.get('meta', source))}</div>
</div>"""


def render_content(card, source, total, idx):
    num = card.get('index', idx)
    body_html = card.get('body', '')
    quote_html = f'<div class="card-quote">{escape(card["quote"])}</div>' if card.get('quote') else ''
    return f"""<div class="card">
  <div class="card-middle">
    <div class="card-number">{num}</div>
    <div class="card-title">{escape(card['title'])}</div>
    <div class="card-body">{body_html}{quote_html}</div>
  </div>
  <div class="card-footer">
    <span class="card-source">{escape(source)}</span>
    <span class="card-page">{num} / {total}</span>
  </div>
</div>"""


def render_ending(card, source):
    return f"""<div class="card ending">
  <div class="ending-text">{escape(card.get('text', '感谢阅读'))}</div>
  <div class="ending-sub">{escape(card.get('sub', ''))}</div>
  <div class="ending-cta">{escape(card.get('cta', '关注收藏'))}</div>
</div>"""


def generate(config_path, output_path):
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    theme = config.get('theme', 'light')
    source = config.get('source', '')
    cards = config.get('cards', [])
    total = len([c for c in cards if c.get('type') == 'content'])

    cards_html = []
    for idx, card in enumerate(cards):
        t = card.get('type', 'content')
        if t == 'cover':
            cards_html.append(render_cover(card, source))
        elif t == 'ending':
            cards_html.append(render_ending(card, source))
        else:
            cards_html.append(render_content(card, source, total, idx))

    html = f"""<!DOCTYPE html>
<html lang="zh-CN" data-theme="{theme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>图文卡片</title>
<style>{STYLE}</style>
</head>
<body>
<div class="controls">
  <button onclick="document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')">切换明暗</button>
</div>
{''.join(cards_html)}
</body>
</html>"""

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Cards generated: {output_path} ({len(cards)} cards)")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate 3:4 image cards from config')
    parser.add_argument('--config', required=True, help='Path to config.json')
    parser.add_argument('--output', default='cards.html', help='Output HTML file')
    args = parser.parse_args()
    generate(args.config, args.output)
