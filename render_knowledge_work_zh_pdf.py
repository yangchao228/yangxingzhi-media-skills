from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parent
SRC = ROOT / "the-next-era-of-knowledge-work.zh.md"
OUT = ROOT / "the-next-era-of-knowledge-work.zh.pdf"
FONT_PATH = "/System/Library/Fonts/Supplemental/Songti.ttc"


def register_fonts():
    pdfmetrics.registerFont(TTFont("Songti", FONT_PATH, subfontIndex=0))
    pdfmetrics.registerFont(TTFont("SongtiBold", FONT_PATH, subfontIndex=1))


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("**", "")
    )


def inline(text: str) -> str:
    text = esc(text)
    return re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)


def make_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "ZhTitle",
            parent=base["Title"],
            fontName="SongtiBold",
            fontSize=26,
            leading=34,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111827"),
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "ZhSubtitle",
            parent=base["Normal"],
            fontName="Songti",
            fontSize=12.5,
            leading=20,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#374151"),
            spaceAfter=20,
        ),
        "h2": ParagraphStyle(
            "ZhH2",
            parent=base["Heading2"],
            fontName="SongtiBold",
            fontSize=17,
            leading=24,
            textColor=colors.HexColor("#111827"),
            spaceBefore=16,
            spaceAfter=8,
        ),
        "h3": ParagraphStyle(
            "ZhH3",
            parent=base["Heading3"],
            fontName="SongtiBold",
            fontSize=13.5,
            leading=20,
            textColor=colors.HexColor("#1f2937"),
            spaceBefore=12,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "ZhBody",
            parent=base["BodyText"],
            fontName="Songti",
            fontSize=10.6,
            leading=18,
            alignment=TA_LEFT,
            firstLineIndent=0,
            textColor=colors.HexColor("#111827"),
            spaceAfter=7,
        ),
        "bullet": ParagraphStyle(
            "ZhBullet",
            parent=base["BodyText"],
            fontName="Songti",
            fontSize=10.3,
            leading=17,
            leftIndent=8,
            textColor=colors.HexColor("#111827"),
        ),
    }


def flush_list(story, items, ordered, styles):
    if not items:
        return
    flow_items = [
        ListItem(Paragraph(inline(item), styles["bullet"]), leftIndent=0)
        for item in items
    ]
    story.append(
        ListFlowable(
            flow_items,
            bulletType="1" if ordered else "bullet",
            start="1",
            leftIndent=16,
            bulletFontName="Songti",
            bulletFontSize=9.5,
        )
    )
    story.append(Spacer(1, 4))


def build_story(markdown: str):
    styles = make_styles()
    story = []
    list_items = []
    ordered = False
    first_title = True

    for raw in markdown.splitlines():
        line = raw.strip()
        if not line:
            flush_list(story, list_items, ordered, styles)
            list_items = []
            continue

        bullet_match = re.match(r"^- (.+)$", line)
        ordered_match = re.match(r"^\d+\. \*\*(.+?)\*\*[:：](.*)$", line)

        if bullet_match:
            if list_items and ordered:
                flush_list(story, list_items, ordered, styles)
                list_items = []
            ordered = False
            list_items.append(bullet_match.group(1))
            continue

        if ordered_match:
            if list_items and not ordered:
                flush_list(story, list_items, ordered, styles)
                list_items = []
            ordered = True
            list_items.append(f"{ordered_match.group(1)}：{ordered_match.group(2).strip()}")
            continue

        flush_list(story, list_items, ordered, styles)
        list_items = []

        if line.startswith("# "):
            if not first_title:
                story.append(PageBreak())
            story.append(Paragraph(inline(line[2:]), styles["title"]))
            first_title = False
        elif line.startswith("## "):
            story.append(Paragraph(inline(line[3:]), styles["h2"]))
        elif line.startswith("### "):
            story.append(Paragraph(inline(line[4:]), styles["h3"]))
        elif line.startswith("**") and line.endswith("**"):
            story.append(Paragraph(inline(line.strip("*")), styles["subtitle"]))
        else:
            story.append(Paragraph(inline(line), styles["body"]))

    flush_list(story, list_items, ordered, styles)
    return story


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Songti", 8)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.drawCentredString(A4[0] / 2, 12 * mm, str(doc.page))
    canvas.restoreState()


def main():
    register_fonts()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="知识工作的新纪元",
        author="OpenAI / Chinese translation",
    )
    story = build_story(SRC.read_text(encoding="utf-8"))
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(OUT)


if __name__ == "__main__":
    main()
