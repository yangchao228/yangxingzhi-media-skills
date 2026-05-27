from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "png"
OUT.mkdir(parents=True, exist_ok=True)

HEI = "/System/Library/Fonts/STHeiti Medium.ttc"
HEI_LIGHT = "/System/Library/Fonts/STHeiti Light.ttc"
SONG = "/System/Library/Fonts/Supplemental/Songti.ttc"


INK = "#133b38"
INK2 = "#082422"
PAPER = "#f7f1e5"
PAPER2 = "#fff9ed"
LINE = "#d8cbb5"
YELLOW = "#f1c94a"
CORAL = "#e76f51"
TEAL = "#5aa7a0"
BLUE = "#5d87a1"
MUTED = "#64726e"
WHITE = "#fffaf0"


def font(size: int, bold: bool = True, serif: bool = False) -> ImageFont.FreeTypeFont:
    path = SONG if serif else (HEI if bold else HEI_LIGHT)
    return ImageFont.truetype(path, size)


def text(draw: ImageDraw.ImageDraw, xy, value: str, size: int, fill=INK, bold=True, serif=False, anchor=None):
    draw.text(xy, value, font=font(size, bold=bold, serif=serif), fill=fill, anchor=anchor)


def multiline(draw: ImageDraw.ImageDraw, x: int, y: int, lines: list[str], size: int, fill=INK, gap=16, bold=True, serif=False):
    f = font(size, bold=bold, serif=serif)
    current = y
    for line in lines:
        draw.text((x, current), line, font=f, fill=fill)
        current += size + gap
    return current


def pill(draw, x, y, w, h, label, fill=YELLOW, text_fill=INK2, size=26):
    draw.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=fill)
    text(draw, (x + w // 2, y + h // 2), label, size, fill=text_fill, anchor="mm")


def footer(draw, width, y, fill=MUTED):
    f = font(26)
    draw.text((74, y), "更早发现", font=f, fill=fill)
    draw.text((width // 2, y), "更准判断", font=f, fill=fill, anchor="ma")
    draw.text((width - 74, y), "更快行动", font=f, fill=fill, anchor="ra")


def grid(draw, w, h, color, alpha=18, step=72):
    rgba = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g = ImageDraw.Draw(rgba)
    for x in range(0, w + 1, step):
        g.line((x, 0, x, h), fill=color + (alpha,), width=1)
    for y in range(0, h + 1, step):
        g.line((0, y, w, y), fill=color + (alpha,), width=1)
    return rgba


def hex_rgba(hex_color: str, alpha: int):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def _rgb(hex_color: str):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def blend_color(fg: str, bg: str, ratio: float):
    fr, fg_, fb = _rgb(fg)
    br, bg_, bb = _rgb(bg)
    return (
        int(fr * ratio + br * (1 - ratio)),
        int(fg_ * ratio + bg_ * (1 - ratio)),
        int(fb * ratio + bb * (1 - ratio)),
    )


def wave(draw, width, y, color, stroke=8):
    pts = []
    for x in range(-80, width + 90, 18):
        yy = y + math.sin(x / 145) * 42 + math.sin(x / 270) * 26
        pts.append((x, yy))
    draw.line(pts, fill=color, width=stroke, joint="curve")


def card_base(bg="warm", dark=False, accent=YELLOW):
    w, h = 1080, 1440
    base = Image.new("RGBA", (w, h), INK2 if dark else (PAPER2 if bg == "light" else PAPER))
    draw = ImageDraw.Draw(base, "RGBA")
    if bg == "teal":
        bg_fill = "#e9f1ed"
    elif bg == "yellow":
        bg_fill = "#f7e8ad"
    elif dark:
        bg_fill = INK
    elif bg == "light":
        bg_fill = PAPER2
    else:
        bg_fill = PAPER
    draw.rectangle((0, 0, w, h), fill=bg_fill)
    base.alpha_composite(grid(draw, w, h, (19, 59, 56) if not dark else (255, 250, 240), 16 if not dark else 12))
    wave_color = blend_color(accent, bg_fill, 0.34 if not dark else 0.45)
    area_color = blend_color(accent, bg_fill, 0.16 if not dark else 0.24)
    wave(draw, w, 250, wave_color, stroke=8)
    draw.polygon([(0, 1100), (220, 1040), (520, 1090), (850, 940), (1080, 1010), (1080, 1440), (0, 1440)], fill=area_color)
    fill = WHITE if dark else INK
    chip = blend_color(WHITE if dark else INK, bg_fill, 0.13)
    draw.rounded_rectangle((58, 54, 260, 102), radius=24, fill=chip)
    text(draw, (159, 80), "AI生命克劳德", 24, fill=fill, anchor="mm")
    return base, draw, fill


def add_page(draw, page: int, dark=False):
    chip = "#294b47" if dark else "#e1ddcf"
    fill = WHITE if dark else INK
    draw.rounded_rectangle((894, 54, 1022, 102), radius=24, fill=chip)
    text(draw, (958, 80), f"{page:02d}/08", 24, fill=fill, anchor="mm")


def note(draw, x, y, title, desc, color):
    draw.rounded_rectangle((x, y, x + 910, y + 104), radius=24, fill=PAPER2, outline=LINE, width=2)
    draw.rounded_rectangle((x + 34, y + 28, x + 82, y + 76), radius=16, fill=color)
    text(draw, (x + 112, y + 32), title, 30)
    text(draw, (x + 112, y + 68), desc, 24, fill=MUTED)


def tile(draw, x, y, num, title, desc):
    draw.rounded_rectangle((x, y, x + 438, y + 214), radius=30, fill=PAPER2, outline=LINE, width=2)
    text(draw, (x + 34, y + 36), num, 28, fill=CORAL)
    text(draw, (x + 34, y + 84), title, 38)
    text(draw, (x + 34, y + 144), desc, 25, fill=MUTED)


def role(draw, y, title, desc, color):
    draw.rounded_rectangle((74, y, 988, y + 88), radius=24, fill=PAPER2, outline=LINE, width=2)
    draw.rounded_rectangle((102, y + 24, 142, y + 64), radius=14, fill=color)
    text(draw, (170, y + 27), title, 30)
    text(draw, (392, y + 30), desc, 25, fill=MUTED)


def render_cover():
    img = Image.new("RGBA", (1400, 596), INK2)
    draw = ImageDraw.Draw(img, "RGBA")
    draw.rectangle((0, 0, 1400, 596), fill=INK)
    img.alpha_composite(grid(draw, 1400, 596, (255, 250, 240), 16, step=56))
    wave(draw, 1400, 455, blend_color(YELLOW, INK, 0.55), stroke=7)
    wave(draw, 1400, 520, blend_color(TEAL, INK, 0.48), stroke=4)
    draw.rounded_rectangle((76, 72, 716, 524), radius=34, fill=(8, 36, 34, 150))
    pill(draw, 100, 100, 224, 46, "Human3.0 总纲", size=24)
    multiline(draw, 100, 190, ["不要把学习", "外包给 AI"], 82, fill=WHITE, gap=12, serif=True)
    draw.rounded_rectangle((104, 436, 604, 444), radius=4, fill=YELLOW)
    text(draw, (104, 486), "AI 可以给答案，但不能替你长能力", 30, fill="#e7f2ed")

    draw.rounded_rectangle((790, 68, 1310, 524), radius=36, fill=PAPER)
    text(draw, (842, 128), "AI 学习系统", 30)
    text(draw, (842, 166), "把答案变成训练，把训练变成资产", 20, fill=MUTED, bold=False)
    items = [("提出假设", "先让自己入场", YELLOW), ("亲手练习", "保留关键动作", TEAL), ("复盘迁移", "沉淀数字资产", CORAL)]
    y = 220
    for title, desc, color in items:
        draw.rounded_rectangle((842, y, 1258, y + 72), radius=20, fill=PAPER2, outline=LINE, width=2)
        draw.ellipse((872, y + 18, 908, y + 54), fill=color)
        text(draw, (928, y + 22), title, 26)
        text(draw, (1108, y + 26), desc, 20, fill=MUTED, bold=False)
        y += 92
    text(draw, (78, 558), "AI生命克劳德 · 别把学习外包给 AI 系列 01", 22, fill=(255, 250, 240, 190), bold=False)
    img.convert("RGB").save(OUT / "wechat-cover.png")


def render_cards():
    # 01
    img, draw, fill = card_base("dark", dark=True, accent=YELLOW)
    add_page(draw, 1, True)
    pill(draw, 74, 202, 236, 54, "Human3.0 总纲", size=26)
    multiline(draw, 74, 390, ["不要把学习", "外包给 AI"], 92, fill=fill, gap=10, serif=True)
    draw.rounded_rectangle((78, 638, 594, 648), radius=5, fill=YELLOW)
    multiline(draw, 78, 724, ["AI 可以给答案", "但不能替你长能力"], 42, fill=(255, 250, 240, 230), gap=22)
    for i, label in enumerate(["提出假设", "亲手练习", "复盘迁移"]):
        x = 74 + i * 272
        draw.rounded_rectangle((x, 980, x + 248, 1066), radius=24, fill="#294b47")
        text(draw, (x + 124, 1023), label, 28, fill=fill, anchor="mm")
    footer(draw, 1080, 1372, fill=(255, 250, 240, 184))
    img.convert("RGB").save(OUT / "01-cover.png")

    # 02
    img, draw, fill = card_base("warm", accent=CORAL)
    add_page(draw, 2)
    pill(draw, 74, 206, 190, 52, "最危险的错觉", fill=CORAL, text_fill=WHITE, size=25)
    multiline(draw, 74, 388, ["看懂答案", "不等于真的会了"], 70, fill=fill, gap=16, serif=True)
    note(draw, 74, 666, "读了总结", "觉得自己懂了", YELLOW)
    note(draw, 74, 804, "复制代码", "觉得自己会了", TEAL)
    note(draw, 74, 942, "AI 改完", "觉得自己进步了", CORAL)
    text(draw, (82, 1140), "换个场景，问题又来了。", 38)
    footer(draw, 1080, 1372)
    img.convert("RGB").save(OUT / "02-illusion.png")

    # 03
    img, draw, fill = card_base("teal", accent=TEAL)
    add_page(draw, 3)
    pill(draw, 74, 206, 146, 52, "核心判断", size=25)
    multiline(draw, 74, 386, ["AI 默认优化交付", "不自动优化成长"], 64, fill=fill, gap=18, serif=True)
    panels = [("任务完成", "问题被关闭", YELLOW, "看得见、来得快"), ("能力增长", "判断被更新", TEAL, "慢一点、更值钱")]
    for i, (title, desc, color, foot) in enumerate(panels):
        x = 74 + i * 496
        draw.rounded_rectangle((x, 678, x + 420, 946), radius=30, fill=PAPER2, outline=LINE, width=2)
        text(draw, (x + 42, 734), title, 38)
        text(draw, (x + 42, 792), desc, 26, fill=MUTED, bold=False)
        draw.rounded_rectangle((x + 42, 856, x + (312 if i == 0 else 252), 878), radius=11, fill=color)
        text(draw, (x + 42, 914), foot, 24, fill=MUTED)
    multiline(draw, 80, 1080, ["学习要多看一个指标：", "这次结束后，我有没有变强？"], 38, gap=18)
    footer(draw, 1080, 1372)
    img.convert("RGB").save(OUT / "03-delivery-vs-growth.png")

    # 04
    img, draw, fill = card_base("yellow", accent=INK)
    add_page(draw, 4)
    pill(draw, 74, 206, 228, 52, "四个动作不能外包", fill=INK, text_fill=WHITE, size=25)
    multiline(draw, 74, 382, ["真正的学习", "长在这些动作里"], 66, fill=fill, gap=16, serif=True)
    tile(draw, 74, 636, "01", "提出假设", "我先判断问题在哪")
    tile(draw, 550, 636, "02", "亲手练习", "关键小块自己做")
    tile(draw, 74, 906, "03", "识别错误", "知道它错在哪里")
    tile(draw, 550, 906, "04", "复盘迁移", "变成下次可复用")
    footer(draw, 1080, 1372)
    img.convert("RGB").save(OUT / "04-four-actions.png")

    # 05
    img, draw, fill = card_base("light", accent=BLUE)
    add_page(draw, 5)
    pill(draw, 74, 206, 172, 52, "正确角色", fill=BLUE, text_fill=WHITE, size=25)
    multiline(draw, 74, 376, ["AI 不只做答案机器", "更适合做训练系统"], 62, fill=fill, gap=18, serif=True)
    roles = [
        ("资料整理员", "整理概念地图和问题清单", YELLOW),
        ("概念教练", "换说法、举反例、追问你", TEAL),
        ("练习搭档", "拆小任务，保留关键动作", CORAL),
        ("错误陪练", "先读错，再设计验证", BLUE),
        ("复盘助手", "沉淀 checklist / prompt / SOP", INK),
    ]
    for idx, (title, desc, color) in enumerate(roles):
        role(draw, 622 + idx * 120, title, desc, color)
    footer(draw, 1080, 1372)
    img.convert("RGB").save(OUT / "05-ai-roles.png")

    # 06
    img, draw, fill = card_base("teal", accent=YELLOW)
    add_page(draw, 6)
    pill(draw, 74, 206, 172, 52, "通用流程", size=25)
    multiline(draw, 74, 382, ["任何方向", "都可以先跑这 5 步"], 66, fill=fill, gap=16, serif=True)
    steps = ["定最小目标", "建立资料层", "进入练习层", "设计验收", "复盘沉淀"]
    for idx, label in enumerate(steps):
        x = 116 + idx * 146
        draw.ellipse((x, 636, x + 128, 764), fill=PAPER2, outline=LINE, width=2)
        text(draw, (x + 64, 700), str(idx + 1), 38, anchor="mm")
        text(draw, (x + 64, 820), label, 25, anchor="mm")
    multiline(draw, 86, 1132, ["别只保存聊天记录。", "要沉淀成模板、错题卡、SOP 或 skill。"], 38, gap=18)
    footer(draw, 1080, 1372)
    img.convert("RGB").save(OUT / "06-universal-flow.png")

    # 07
    img, draw, fill = card_base("warm", accent=CORAL)
    add_page(draw, 7)
    pill(draw, 74, 206, 198, 52, "问 AI 前加一句", fill=CORAL, text_fill=WHITE, size=25)
    multiline(draw, 74, 388, ["请不要直接", "替我完成"], 78, fill=fill, gap=8, serif=True)
    draw.rounded_rectangle((74, 660, 988, 1050), radius=32, fill=PAPER2, outline=LINE, width=2)
    text(draw, (118, 720), "请按学习教练的方式帮我：", 30)
    lines = ["1. 先判断我的假设", "2. 拆出练习步骤", "3. 保留关键部分让我做", "4. 最后给我验收标准"]
    for idx, line in enumerate(lines):
        text(draw, (118, 800 + idx * 58), line, 28, fill=MUTED)
    footer(draw, 1080, 1372)
    img.convert("RGB").save(OUT / "07-prompt-constraint.png")

    # 08
    img, draw, fill = card_base("dark", dark=True, accent=YELLOW)
    add_page(draw, 8, True)
    pill(draw, 74, 206, 172, 52, "系列预告", size=25)
    multiline(draw, 74, 386, ["别把学习", "外包给 AI"], 82, fill=fill, gap=8, serif=True)
    labels = ["编程篇", "写作篇", "英语篇", "知识管理", "考试篇", "工作技能"]
    for idx, label in enumerate(labels):
        x = 74 + (idx % 3) * 292
        y = 650 + (idx // 3) * 126
        draw.rounded_rectangle((x, y, x + 252, y + 82), radius=24, fill="#294b47", outline="#3a625c", width=2)
        text(draw, (x + 126, y + 42), label, 30, fill=fill, anchor="mm")
    multiline(draw, 78, 1056, ["让 AI 训练你完成学习，", "不要让它替你完成学习。"], 42, fill=(255, 250, 240, 235), gap=22)
    footer(draw, 1080, 1372, fill=(255, 250, 240, 184))
    img.convert("RGB").save(OUT / "08-series-preview.png")


if __name__ == "__main__":
    render_cover()
    render_cards()
    print(f"Rendered PNG assets to {OUT}")
