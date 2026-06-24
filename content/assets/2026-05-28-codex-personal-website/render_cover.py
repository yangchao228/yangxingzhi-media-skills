from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "png"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1400, 596
HEI = "/System/Library/Fonts/STHeiti Medium.ttc"
HEI_LIGHT = "/System/Library/Fonts/STHeiti Light.ttc"
SONG = "/System/Library/Fonts/Supplemental/Songti.ttc"

INK = "#182c34"
DEEP = "#0c171b"
PAPER = "#f7f1e3"
BLUE = "#2f80ed"
CYAN = "#39c2c9"
LIME = "#b8e36f"
GOLD = "#f2c94c"
CORAL = "#f26b5e"
MUTED = "#718087"


def font(size: int, bold: bool = True, serif: bool = False) -> ImageFont.FreeTypeFont:
    path = SONG if serif else (HEI if bold else HEI_LIGHT)
    return ImageFont.truetype(path, size)


def txt(draw: ImageDraw.ImageDraw, xy, value: str, size: int, fill=INK, bold=True, serif=False, anchor=None):
    draw.text(xy, value, font=font(size, bold=bold, serif=serif), fill=fill, anchor=anchor)


def blend(a: str, b: str, ratio: float):
    def rgb(v: str):
        v = v.lstrip("#")
        return tuple(int(v[i : i + 2], 16) for i in (0, 2, 4))

    ar, ag, ab = rgb(a)
    br, bg, bb = rgb(b)
    return (int(ar * ratio + br * (1 - ratio)), int(ag * ratio + bg * (1 - ratio)), int(ab * ratio + bb * (1 - ratio)))


def round_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_grid(draw: ImageDraw.ImageDraw):
    for x in range(0, W + 1, 56):
        draw.line((x, 0, x, H), fill=(255, 255, 255, 18), width=1)
    for y in range(0, H + 1, 56):
        draw.line((0, y, W, y), fill=(255, 255, 255, 14), width=1)


def flow(draw: ImageDraw.ImageDraw):
    steps = [("设计", BLUE), ("开发", CYAN), ("SEO", LIME), ("部署", GOLD), ("DNS", CORAL), ("验证", PAPER)]
    start_x, y = 810, 380
    for i, (label, color) in enumerate(steps):
        x = start_x + i * 86
        draw.ellipse((x, y, x + 52, y + 52), fill=color)
        txt(draw, (x + 26, y + 27), label, 18, fill=DEEP, anchor="mm")
        if i < len(steps) - 1:
            draw.line((x + 56, y + 26, x + 78, y + 26), fill=(247, 241, 227, 150), width=4)
            draw.polygon([(x + 78, y + 26), (x + 68, y + 20), (x + 68, y + 32)], fill=(247, 241, 227, 150))


def render():
    img = Image.new("RGBA", (W, H), DEEP)
    draw = ImageDraw.Draw(img, "RGBA")

    for y in range(H):
        ratio = y / H
        c = blend("#132f3b", DEEP, ratio)
        draw.line((0, y, W, y), fill=c)

    draw_grid(draw)

    for i in range(7):
        x0 = 760 + i * 86
        y0 = 68 + math.sin(i) * 10
        draw.arc((x0, y0, x0 + 340, y0 + 340), 190, 338, fill=(57, 194, 201, 40 + i * 7), width=3)

    round_rect(draw, (760, 76, 1288, 316), 28, (247, 241, 227, 232), (255, 255, 255, 60), 2)
    round_rect(draw, (790, 108, 1258, 286), 18, (255, 255, 255, 210), (24, 44, 52, 45), 2)
    draw.rectangle((790, 108, 1258, 146), fill=(24, 44, 52, 230))
    for i, color in enumerate([CORAL, GOLD, LIME]):
        draw.ellipse((812 + i * 30, 120, 826 + i * 30, 134), fill=color)
    txt(draw, (826, 204), "yangxingzhi.reai.group", 28, fill=INK)
    txt(draw, (826, 246), "Personal Digital Asset", 21, fill=MUTED, bold=False)

    flow(draw)
    txt(draw, (806, 474), "设计 · 开发 · SEO · 部署 · DNS · 访问验证", 24, fill=(247, 241, 227, 220), bold=False)
    txt(draw, (806, 516), "方向判断 / 账号授权 / 合规选择 / 最终确认", 22, fill=(184, 227, 111, 230), bold=False)

    round_rect(draw, (78, 72, 704, 524), 34, (6, 16, 20, 164), (255, 255, 255, 36), 2)
    round_rect(draw, (112, 108, 294, 154), 22, LIME)
    txt(draw, (203, 131), "Human3.0", 24, fill=DEEP, anchor="mm")
    txt(draw, (112, 226), "我没有写", 74, fill=PAPER, serif=True)
    txt(draw, (112, 318), "一行代码", 80, fill=PAPER, serif=True)
    draw.rounded_rectangle((114, 420, 618, 430), radius=5, fill=CYAN)
    draw.rounded_rectangle((114, 420, 340, 430), radius=5, fill=GOLD)
    txt(draw, (114, 464), "用 Codex 把个人网站上线了", 42, fill=PAPER)
    txt(draw, (114, 498), "人保留判断权，Agent 承担执行层", 22, fill=(247, 241, 227, 190), bold=False)

    txt(draw, (78, 558), "AI生命克劳德 · 个人数字资产生产方式复盘", 21, fill=(247, 241, 227, 180), bold=False)
    img.convert("RGB").save(OUT / "wechat-cover.png")


if __name__ == "__main__":
    render()
