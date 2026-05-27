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

BG = "#181b1f"
INK = "#f7f2e8"
MUTED = "#b8b0a4"
GOLD = "#f0bd4d"
RED = "#f05f4a"
TEAL = "#40c1b2"
PANEL = "#24282e"
LINE = "#3b414a"


def font(size: int, bold: bool = True, serif: bool = False) -> ImageFont.FreeTypeFont:
    path = SONG if serif else (HEI if bold else HEI_LIGHT)
    return ImageFont.truetype(path, size)


def text(draw: ImageDraw.ImageDraw, xy, value: str, size: int, fill=INK, bold=True, serif=False, anchor=None):
    draw.text(xy, value, font=font(size, bold=bold, serif=serif), fill=fill, anchor=anchor)


def rounded(draw: ImageDraw.ImageDraw, box, radius: int, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def blend(a: str, b: str, ratio: float):
    def rgb(v: str):
        v = v.lstrip("#")
        return tuple(int(v[i : i + 2], 16) for i in (0, 2, 4))

    ar, ag, ab = rgb(a)
    br, bg, bb = rgb(b)
    return (int(ar * ratio + br * (1 - ratio)), int(ag * ratio + bg * (1 - ratio)), int(ab * ratio + bb * (1 - ratio)))


def draw_grid(draw: ImageDraw.ImageDraw):
    for x in range(0, W, 56):
        draw.line((x, 0, x, H), fill=(255, 255, 255, 12), width=1)
    for y in range(0, H, 56):
        draw.line((0, y, W, y), fill=(255, 255, 255, 10), width=1)


def draw_curve(draw: ImageDraw.ImageDraw, y: int, color, width: int):
    pts = []
    for x in range(-40, W + 40, 20):
        yy = y + math.sin(x / 125) * 22 + math.sin(x / 260) * 12
        pts.append((x, yy))
    draw.line(pts, fill=color, width=width, joint="curve")


def render():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img, "RGBA")

    for y in range(H):
        ratio = y / H
        draw.line((0, y, W, y), fill=blend("#111317", "#25292f", ratio))

    draw_grid(draw)
    draw.ellipse((850, -170, 1510, 470), fill=(240, 189, 77, 36))
    draw.ellipse((1040, 120, 1520, 720), fill=(64, 193, 178, 30))
    draw_curve(draw, 476, (240, 189, 77, 90), 6)
    draw_curve(draw, 522, (64, 193, 178, 80), 4)

    # Left signal panel.
    rounded(draw, (78, 72, 493, 514), 34, (28, 31, 36, 205), (72, 79, 88, 160), 2)
    rounded(draw, (112, 108, 238, 154), 23, GOLD)
    text(draw, (175, 131), "35+", 28, fill="#17191d", anchor="mm")
    text(draw, (112, 224), "被低估的", 38, fill=MUTED, bold=False)
    text(draw, (112, 302), "不是年龄", 62, fill=INK, serif=True)
    text(draw, (112, 382), "是战场", 70, fill=GOLD, serif=True)
    draw.line((114, 432, 430, 432), fill=(240, 189, 77, 190), width=5)
    text(draw, (112, 474), "速度被抹平，判断力重新定价", 24, fill="#d9d2c8", bold=False)

    # Main headline.
    text(draw, (548, 126), "AI 时代", 46, fill=GOLD)
    text(draw, (548, 236), "中年人", 78, fill=INK, serif=True)
    rounded(draw, (862, 162, 1204, 244), 41, RED)
    text(draw, (1033, 203), "反而更强了", 46, fill="#fff8ef", anchor="mm")

    text(draw, (550, 336), "年轻人的速度优势正在被 AI 抹平", 32, fill=INK)
    text(draw, (550, 382), "中年人的晶体智力开始浮出水面", 32, fill=INK)

    # Keyword chips.
    chips = [("流体智力", RED), ("晶体智力", GOLD), ("经验算法", TEAL)]
    x = 552
    for label, color in chips:
        rounded(draw, (x, 438, x + 150, 484), 23, (255, 255, 255, 18), color, 2)
        text(draw, (x + 75, 461), label, 21, fill=color, anchor="mm")
        x += 174

    rounded(draw, (552, 512, 1198, 546), 17, (255, 255, 255, 16))
    text(draw, (574, 529), "战场选对，经验就值钱", 23, fill="#f5efe5", bold=False, anchor="lm")

    # Small graph motif.
    draw.line((1228, 132, 1328, 132), fill=LINE, width=2)
    draw.line((1228, 132, 1228, 330), fill=LINE, width=2)
    old_pts = [(1230, 160), (1260, 142), (1290, 168), (1320, 150)]
    new_pts = [(1230, 312), (1260, 268), (1290, 226), (1320, 178)]
    draw.line(old_pts, fill=RED, width=5, joint="curve")
    draw.line(new_pts, fill=TEAL, width=6, joint="curve")
    text(draw, (1278, 368), "速度", 22, fill=RED, anchor="mm")
    text(draw, (1278, 402), "判断力", 22, fill=TEAL, anchor="mm")

    text(draw, (78, 558), "AI生命克劳德 · Human3.0", 22, fill=(247, 242, 232, 170), bold=False)

    img.save(OUT / "wechat-cover.png", quality=95)


if __name__ == "__main__":
    render()
