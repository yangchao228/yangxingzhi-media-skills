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

W, H = 1400, 596
INK = "#143d3a"
INK2 = "#102c2a"
PAPER = "#fff5df"
PAPER2 = "#f7ead0"
CREAM = "#fff8e7"
YELLOW = "#f6c85f"
TEAL = "#54b3a8"
CORAL = "#ef7d5d"
MUTED = "#68746e"
LINE = "#dfd0b6"


def font(size: int, bold: bool = True, serif: bool = False) -> ImageFont.FreeTypeFont:
    path = SONG if serif else (HEI if bold else HEI_LIGHT)
    return ImageFont.truetype(path, size)


def text(draw: ImageDraw.ImageDraw, xy, value: str, size: int, fill=INK, bold=True, serif=False, anchor=None):
    draw.text(xy, value, font=font(size, bold=bold, serif=serif), fill=fill, anchor=anchor)


def grid(draw: ImageDraw.ImageDraw, step=54):
    for x in range(0, W + 1, step):
        draw.line((x, 0, x, H), fill=(255, 248, 231, 18), width=1)
    for y in range(0, H + 1, step):
        draw.line((0, y, W, y), fill=(255, 248, 231, 18), width=1)


def blend(a: str, b: str, ratio: float):
    def rgb(v):
        v = v.lstrip("#")
        return tuple(int(v[i : i + 2], 16) for i in (0, 2, 4))

    ar, ag, ab = rgb(a)
    br, bg, bb = rgb(b)
    return (int(ar * ratio + br * (1 - ratio)), int(ag * ratio + bg * (1 - ratio)), int(ab * ratio + bb * (1 - ratio)))


def wave(draw: ImageDraw.ImageDraw, y: int, color, width: int):
    pts = []
    for x in range(-80, W + 90, 18):
        yy = y + math.sin(x / 150) * 42 + math.sin(x / 270) * 22
        pts.append((x, yy))
    draw.line(pts, fill=color, width=width, joint="curve")


def rounded_panel(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def render():
    img = Image.new("RGBA", (W, H), INK2)
    draw = ImageDraw.Draw(img, "RGBA")

    for y in range(H):
        ratio = y / H
        c = blend("#241b2f", INK2, ratio)
        draw.line((0, y, W, y), fill=c)

    grid(draw)
    draw.ellipse((640, -170, 1530, 560), fill=(246, 200, 95, 44))
    draw.ellipse((930, 98, 1610, 760), fill=(239, 125, 93, 25))
    wave(draw, 462, (246, 200, 95, 86), 7)
    wave(draw, 520, (84, 179, 168, 70), 4)

    # Main message.
    rounded_panel(draw, (78, 76, 754, 520), 34, (10, 37, 35, 174))
    rounded_panel(draw, (106, 106, 284, 152), 23, YELLOW)
    text(draw, (195, 129), "AI短剧时代", 24, fill=INK2, anchor="mm")
    text(draw, (106, 218), "人人都能", 76, fill=CREAM, serif=True)
    text(draw, (106, 308), "一人剧组", 76, fill=CREAM, serif=True)
    draw.rounded_rectangle((108, 368, 608, 377), radius=5, fill=YELLOW)
    draw.rounded_rectangle((228, 368, 498, 377), radius=5, fill=TEAL)
    draw.rounded_rectangle((454, 368, 608, 377), radius=5, fill=CORAL)
    text(draw, (106, 446), "你凭什么被记住？", 44, fill=CREAM)
    text(draw, (106, 486), "内容创作者要沉淀机器复制不了的东西", 24, fill="#d8eee9", bold=False)

    # Creator asset panel.
    rounded_panel(draw, (810, 64, 1310, 532), 34, PAPER)
    text(draw, (858, 128), "别只生成，要有自己的库", 30)
    text(draw, (858, 168), "生活样本 / 价值判断 / 故事资产 / 反馈复盘", 20, fill=MUTED, bold=False)

    templates = [("重生", "模板 01"), ("复仇", "模板 02"), ("逆袭", "模板 03")]
    for i, (name, meta) in enumerate(templates):
        x = 858 + i * 142
        rounded_panel(draw, (x, 212, x + 126, 298), 20, PAPER2, LINE, 2)
        text(draw, (x + 63, 250), name, 22, anchor="mm")
        text(draw, (x + 63, 278), meta, 16, fill=MUTED, bold=False, anchor="mm")

    rounded_panel(draw, (858, 332, 1268, 470), 26, INK)
    for i, color in enumerate([YELLOW, TEAL, CORAL]):
        draw.ellipse((906 + i * 44, 362, 942 + i * 44, 398), fill=color)
    text(draw, (906, 428), "创作者资产库", 28, fill=CREAM)
    text(draw, (1094, 428), "把自己变成变量", 20, fill="#d8eee9", bold=False)

    text(draw, (78, 558), "AI生命克劳德 · Human3.0 内容创作者方法论", 22, fill=(255, 248, 231, 194), bold=False)
    img.convert("RGB").save(OUT / "wechat-cover.png")


if __name__ == "__main__":
    render()

