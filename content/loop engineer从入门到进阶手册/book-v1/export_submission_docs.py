from __future__ import annotations

import html
import re
import sys
import zipfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


BASE = Path(__file__).resolve().parent
MANUSCRIPT = BASE / "Loop Engineering 从入门到进阶手册-投稿完整稿.md"
INFO = BASE / "Loop Engineering 从入门到进阶手册-作品信息-AI生命克劳德.md"

DOCX_OUT = BASE / "Loop Engineering 从入门到进阶手册-投稿完整稿-AI生命克劳德.docx"
PDF_OUT = BASE / "Loop Engineering 从入门到进阶手册-投稿完整稿-AI生命克劳德.pdf"
INFO_DOCX_OUT = BASE / "Loop Engineering 从入门到进阶手册-作品信息-AI生命克劳德.docx"

FONT_PATH = Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf")


@dataclass
class Block:
    kind: str
    text: str = ""
    level: int = 0
    rows: list[list[str]] | None = None


def parse_markdown(text: str) -> list[Block]:
    blocks: list[Block] = []
    lines = text.splitlines()
    i = 0
    in_code = False
    code_lines: list[str] = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            if in_code:
                blocks.append(Block("code", "\n".join(code_lines)))
                code_lines = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_lines.append(line)
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        if stripped == "---":
            blocks.append(Block("hr"))
            i += 1
            continue

        if stripped.startswith("#"):
            m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
            if m:
                blocks.append(Block("heading", m.group(2).strip(), level=len(m.group(1))))
                i += 1
                continue

        if is_table_start(lines, i):
            table_lines = [lines[i], lines[i + 1]]
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            rows = parse_table(table_lines)
            if rows:
                blocks.append(Block("table", rows=rows))
            continue

        if re.match(r"^[-*]\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i].strip()):
                items.append(re.sub(r"^[-*]\s+", "", lines[i].strip()))
                i += 1
            for item in items:
                blocks.append(Block("bullet", item))
            continue

        if re.match(r"^\d+\.\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i].strip()):
                items.append(re.sub(r"^\d+\.\s+", "", lines[i].strip()))
                i += 1
            for item in items:
                blocks.append(Block("number", item))
            continue

        para = [stripped]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if (
                not nxt
                or nxt.startswith("#")
                or nxt == "---"
                or nxt.startswith("```")
                or re.match(r"^[-*]\s+", nxt)
                or re.match(r"^\d+\.\s+", nxt)
                or is_table_start(lines, i)
            ):
                break
            para.append(nxt)
            i += 1
        blocks.append(Block("paragraph", " ".join(para)))

    if code_lines:
        blocks.append(Block("code", "\n".join(code_lines)))

    return blocks


def is_table_start(lines: list[str], i: int) -> bool:
    if i + 1 >= len(lines):
        return False
    first = lines[i].strip()
    second = lines[i + 1].strip()
    return first.startswith("|") and second.startswith("|") and re.match(r"^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$", second) is not None


def parse_table(lines: list[str]) -> list[list[str]]:
    rows: list[list[str]] = []
    for idx, line in enumerate(lines):
        if idx == 1:
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        rows.append(cells)
    return rows


def inline_text(text: str) -> str:
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return text


def esc(text: str) -> str:
    return html.escape(inline_text(text), quote=False)


def w_p(text: str, style: str = "Normal", num_id: int | None = None, level: int = 0) -> str:
    p_style = f'<w:pStyle w:val="{style}"/>' if style else ""
    num = ""
    if num_id is not None:
        num = f"<w:numPr><w:ilvl w:val=\"{level}\"/><w:numId w:val=\"{num_id}\"/></w:numPr>"
    return (
        "<w:p><w:pPr>"
        f"{p_style}{num}"
        "</w:pPr><w:r><w:t xml:space=\"preserve\">"
        f"{esc(text)}"
        "</w:t></w:r></w:p>"
    )


def w_table(rows: list[list[str]]) -> str:
    if not rows:
        return ""
    cols = max(len(r) for r in rows)
    width = 9026
    col_width = max(900, width // max(cols, 1))
    out = [
        "<w:tbl><w:tblPr><w:tblW w:w=\"9026\" w:type=\"dxa\"/>"
        "<w:tblBorders>"
        "<w:top w:val=\"single\" w:sz=\"4\" w:color=\"CCCCCC\"/>"
        "<w:left w:val=\"single\" w:sz=\"4\" w:color=\"CCCCCC\"/>"
        "<w:bottom w:val=\"single\" w:sz=\"4\" w:color=\"CCCCCC\"/>"
        "<w:right w:val=\"single\" w:sz=\"4\" w:color=\"CCCCCC\"/>"
        "<w:insideH w:val=\"single\" w:sz=\"4\" w:color=\"CCCCCC\"/>"
        "<w:insideV w:val=\"single\" w:sz=\"4\" w:color=\"CCCCCC\"/>"
        "</w:tblBorders></w:tblPr>"
    ]
    for r_idx, row in enumerate(rows):
        out.append("<w:tr>")
        padded = row + [""] * (cols - len(row))
        for cell in padded:
            shade = "<w:shd w:fill=\"EAF2F8\"/>" if r_idx == 0 else ""
            out.append(
                "<w:tc><w:tcPr>"
                f"<w:tcW w:w=\"{col_width}\" w:type=\"dxa\"/>{shade}"
                "</w:tcPr>"
                f"{w_p(cell, 'TableText')}"
                "</w:tc>"
            )
        out.append("</w:tr>")
    out.append("</w:tbl>")
    return "".join(out)


def build_doc_xml(blocks: Iterable[Block]) -> str:
    body: list[str] = []
    for block in blocks:
        if block.kind == "heading":
            style = "Title" if block.level == 1 and not body else f"Heading{min(block.level, 3)}"
            body.append(w_p(block.text, style))
        elif block.kind == "paragraph":
            body.append(w_p(block.text))
        elif block.kind == "bullet":
            body.append(w_p(block.text, "Normal", num_id=1))
        elif block.kind == "number":
            body.append(w_p(block.text, "Normal", num_id=2))
        elif block.kind == "code":
            for line in block.text.splitlines() or [""]:
                body.append(w_p(line, "Code"))
        elif block.kind == "table" and block.rows:
            body.append(w_table(block.rows))
        elif block.kind == "hr":
            body.append("<w:p/>")
    sect = (
        "<w:sectPr>"
        "<w:pgSz w:w=\"11906\" w:h=\"16838\"/>"
        "<w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\"/>"
        "</w:sectPr>"
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        "<w:body>"
        + "".join(body)
        + sect
        + "</w:body></w:document>"
    )


def styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Songti SC"/><w:sz w:val="24"/></w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="160" w:line="360" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Songti SC"/><w:sz w:val="24"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="360"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Songti SC"/><w:b/><w:sz w:val="40"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="Heading 1"/><w:pPr><w:outlineLvl w:val="0"/><w:spacing w:before="360" w:after="200"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Songti SC"/><w:b/><w:sz w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="Heading 2"/><w:pPr><w:outlineLvl w:val="1"/><w:spacing w:before="280" w:after="160"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Songti SC"/><w:b/><w:sz w:val="28"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="Heading 3"/><w:pPr><w:outlineLvl w:val="2"/><w:spacing w:before="200" w:after="120"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Songti SC"/><w:b/><w:sz w:val="26"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:pPr><w:spacing w:before="40" w:after="40"/></w:pPr><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New" w:eastAsia="Songti SC"/><w:sz w:val="20"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:pPr><w:spacing w:after="80"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Songti SC"/><w:sz w:val="20"/></w:rPr></w:style>
</w:styles>"""


def numbering_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
  <w:abstractNum w:abstractNumId="1"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>
</w:numbering>"""


def write_docx(md_path: Path, out_path: Path) -> None:
    blocks = parse_markdown(md_path.read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc).isoformat()
    files = {
        "[Content_Types].xml": """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>""",
        "_rels/.rels": """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>""",
        "word/_rels/document.xml.rels": """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>""",
        "word/document.xml": build_doc_xml(blocks),
        "word/styles.xml": styles_xml(),
        "word/numbering.xml": numbering_xml(),
        "docProps/core.xml": f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>{html.escape(md_path.stem)}</dc:title>
  <dc:creator>AI生命克劳德</dc:creator>
  <cp:lastModifiedBy>AI生命克劳德</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>
</cp:coreProperties>""",
        "docProps/app.xml": """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Codex</Application></Properties>""",
    }
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, content in files.items():
            z.writestr(name, content)


def register_pdf_font() -> str:
    if FONT_PATH.exists():
        pdfmetrics.registerFont(TTFont("SubmissionFont", str(FONT_PATH)))
        return "SubmissionFont"
    return "Helvetica"


def para_text(text: str) -> str:
    return html.escape(inline_text(text)).replace("\n", "<br/>")


def write_pdf(md_path: Path, out_path: Path) -> None:
    font = register_pdf_font()
    styles = getSampleStyleSheet()
    normal = ParagraphStyle(
        "NormalCN",
        parent=styles["Normal"],
        fontName=font,
        fontSize=10.5,
        leading=17,
        alignment=TA_LEFT,
        spaceAfter=6,
    )
    title = ParagraphStyle(
        "TitleCN",
        parent=normal,
        fontSize=20,
        leading=28,
        alignment=TA_CENTER,
        spaceAfter=18,
    )
    h1 = ParagraphStyle("H1CN", parent=normal, fontSize=16, leading=22, spaceBefore=14, spaceAfter=8)
    h2 = ParagraphStyle("H2CN", parent=normal, fontSize=14, leading=20, spaceBefore=12, spaceAfter=6)
    h3 = ParagraphStyle("H3CN", parent=normal, fontSize=12, leading=18, spaceBefore=10, spaceAfter=5)
    code = ParagraphStyle(
        "CodeCN",
        parent=normal,
        fontName=font,
        fontSize=8.5,
        leading=12,
        leftIndent=10,
        backColor=colors.HexColor("#F5F7FA"),
        borderColor=colors.HexColor("#E0E6ED"),
        borderWidth=0.5,
        borderPadding=4,
    )
    bullet = ParagraphStyle("BulletCN", parent=normal, leftIndent=14, firstLineIndent=-8)
    blocks = parse_markdown(md_path.read_text(encoding="utf-8"))
    story = []
    for idx, block in enumerate(blocks):
        if block.kind == "heading":
            style = title if block.level == 1 and idx < 3 else h1 if block.level == 1 else h2 if block.level == 2 else h3
            story.append(Paragraph(para_text(block.text), style))
        elif block.kind == "paragraph":
            story.append(Paragraph(para_text(block.text), normal))
        elif block.kind == "bullet":
            story.append(Paragraph("• " + para_text(block.text), bullet))
        elif block.kind == "number":
            story.append(Paragraph(para_text(block.text), bullet))
        elif block.kind == "code":
            for line in block.text.splitlines() or [""]:
                if len(line) > 110:
                    chunks = [line[i : i + 110] for i in range(0, len(line), 110)]
                else:
                    chunks = [line]
                for chunk in chunks:
                    story.append(Paragraph(para_text(chunk), code))
        elif block.kind == "table" and block.rows:
            table_rows = [[Paragraph(para_text(cell), normal) for cell in row] for row in block.rows]
            table = Table(table_rows, repeatRows=1)
            table.setStyle(
                TableStyle(
                    [
                        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#C8D0D8")),
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EAF2F8")),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 4),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                    ]
                )
            )
            story.append(table)
            story.append(Spacer(1, 6))
        elif block.kind == "hr":
            story.append(Spacer(1, 10))
    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title=md_path.stem,
        author="AI生命克劳德",
    )
    doc.build(story)


def main() -> int:
    if not MANUSCRIPT.exists():
        print(f"Missing manuscript: {MANUSCRIPT}", file=sys.stderr)
        return 1
    write_docx(MANUSCRIPT, DOCX_OUT)
    write_docx(INFO, INFO_DOCX_OUT)
    write_pdf(MANUSCRIPT, PDF_OUT)
    print(DOCX_OUT)
    print(PDF_OUT)
    print(INFO_DOCX_OUT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
