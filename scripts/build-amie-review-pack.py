#!/usr/bin/env python3
"""Build the fillable Rella website review pack for Amie."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.acroform import AcroForm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT / "tmp" / "pdfs"
OUT = ROOT / "output" / "pdf"
PDF_PATH = OUT / "RELLA-AMIE-WEBSITE-REVIEW-PACK-2026-08-08.pdf"

PAGE_W, PAGE_H = letter
INK = HexColor("#171717")
MUTED = HexColor("#6E6865")
ACCENT = HexColor("#AC514B")
BLUSH = HexColor("#FBF5F1")
PALE = HexColor("#F4E8E2")
LINE = HexColor("#DED5D0")


SECTION_MAP = {
    "M1": "Main homepage hero and first impression",
    "M2": "Aesthetic and wellness service cards",
    "M3": "Medical weight-loss feature on the main site",
    "M4": "Reviews and membership prompt",
    "M5": "Locations, final call-to-action, and footer",
    "G1": "Results page introduction",
    "G2": "Consent-gated before-and-after gallery slot",
    "G3": "Patient review proof",
    "G4": "Results page closing call-to-action",
    "W1": "Weight-loss promise and qualification call",
    "W2": "Physician-led qualification process",
    "W3": "Weight-loss Google reviews",
    "W4": "Patient story video",
    "W5": "How the program works",
    "W6": "Investment explanation",
    "W7": "Medical weight-loss FAQs",
    "W8": "Clinic chooser and qualification booking",
}

SCREENSHOTS = [
    {
        "path": TMP / "main-home.png",
        "annotated": TMP / "main-home-annotated.png",
        "title": "Main website — homepage",
        "site": "experiencerella.com replacement",
        "markers": [("M1", 0.06), ("M2", 0.26), ("M3", 0.52), ("M4", 0.68), ("M5", 0.84)],
    },
    {
        "path": TMP / "main-gallery.png",
        "annotated": TMP / "main-gallery-annotated.png",
        "title": "Main website — Results page",
        "site": "Where Amie’s approved before-and-afters will appear",
        "markers": [("G1", 0.10), ("G2", 0.45), ("G3", 0.66), ("G4", 0.84)],
    },
    {
        "path": TMP / "weight-loss.png",
        "annotated": TMP / "weight-loss-annotated.png",
        "title": "Medical weight-loss website",
        "site": "weightloss.experiencerella.com experience",
        "markers": [
            ("W1", 0.04),
            ("W2", 0.18),
            ("W3", 0.33),
            ("W4", 0.41),
            ("W5", 0.52),
            ("W6", 0.59),
            ("W7", 0.69),
            ("W8", 0.83),
        ],
    },
]


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def annotate_screenshot(source: Path, output: Path, markers: list[tuple[str, float]]) -> None:
    image = Image.open(source).convert("RGB")
    overlay = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    radius = max(32, image.width // 28)
    label_font = font(max(24, image.width // 48), bold=True)

    for label, y_fraction in markers:
        cx = radius + 22
        cy = max(radius + 12, min(image.height - radius - 12, int(image.height * y_fraction)))
        draw.ellipse(
            (cx - radius, cy - radius, cx + radius, cy + radius),
            fill=(172, 81, 75, 240),
            outline=(255, 255, 255, 255),
            width=max(3, radius // 10),
        )
        bbox = draw.textbbox((0, 0), label, font=label_font)
        draw.text(
            (cx - (bbox[2] - bbox[0]) / 2, cy - (bbox[3] - bbox[1]) / 2 - bbox[1]),
            label,
            fill=(255, 255, 255, 255),
            font=label_font,
        )

    Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB").save(output, quality=94)


def draw_header(c: canvas.Canvas, eyebrow: str, title: str, subtitle: str | None = None) -> None:
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(36, PAGE_H - 36, eyebrow.upper())
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(36, PAGE_H - 59, title)
    if subtitle:
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 9)
        c.drawRightString(PAGE_W - 36, PAGE_H - 57, subtitle)
    c.setStrokeColor(LINE)
    c.line(36, PAGE_H - 72, PAGE_W - 36, PAGE_H - 72)


def draw_wrapped(c: canvas.Canvas, text: str, x: float, y: float, width: float, size: float = 10, leading: float = 14, color=INK, bold: bool = False) -> float:
    words = text.split()
    lines: list[str] = []
    current = ""
    font_name = "Helvetica-Bold" if bold else "Helvetica"
    for word in words:
        candidate = f"{current} {word}".strip()
        if c.stringWidth(candidate, font_name, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    c.setFont(font_name, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_cover(c: canvas.Canvas) -> None:
    c.setFillColor(BLUSH)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.roundRect(36, PAGE_H - 70, 92, 24, 12, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(82, PAGE_H - 62, "FILLABLE PDF")

    c.setFillColor(INK)
    c.setFont("Helvetica", 12)
    c.drawString(36, PAGE_H - 113, "rella aesthetics")
    c.setFont("Helvetica-Bold", 34)
    c.drawString(36, PAGE_H - 168, "Website review pack")
    c.setFillColor(ACCENT)
    c.drawString(36, PAGE_H - 207, "for Amie")
    draw_wrapped(
        c,
        "A click-through design handoff for the main Rella website and the medical weight-loss website.",
        36,
        PAGE_H - 246,
        500,
        size=13,
        leading=18,
        color=MUTED,
    )

    cards = [
        ("1", "Review the real layout", "Use the numbered screenshots to see the current staging build in page order."),
        ("2", "Type changes directly", "Add notes in each fillable box using the section ID, such as W3 or G2."),
        ("3", "Send assets separately", "Upload approved photos or video to the shared project and name the target section."),
    ]
    y = PAGE_H - 360
    for number, heading, body in cards:
        c.setFillColor(white)
        c.roundRect(36, y - 74, 540, 82, 10, stroke=0, fill=1)
        c.setFillColor(ACCENT)
        c.circle(62, y - 31, 14, stroke=0, fill=1)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(62, y - 35, number)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(88, y - 22, heading)
        draw_wrapped(c, body, 88, y - 42, 460, size=9.5, leading=13, color=MUTED)
        y -= 100

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(36, 78, "Captured from the validated local staging build — August 8, 2026")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.5)
    c.drawString(36, 59, "A private live preview link can be added after Zach approves a preview-only deployment.")
    c.drawString(36, 42, "Do not include consent forms, patient names, appointment details, or other private medical information.")


def draw_guide(c: canvas.Canvas) -> None:
    draw_header(c, "How to use this pack", "Leave clear, section-based notes")
    y = PAGE_H - 104
    y = draw_wrapped(
        c,
        "Open this PDF in Preview or Acrobat. Type into the notes box beneath any screenshot. Start each request with the visible section ID.",
        36,
        y,
        540,
        size=11,
        leading=16,
    )
    c.setFillColor(PALE)
    c.roundRect(36, y - 70, 540, 54, 8, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(52, y - 38, "EXAMPLE")
    c.setFillColor(INK)
    c.setFont("Helvetica", 10)
    c.drawString(116, y - 38, "W3 — replace the middle review with the attached Google review screenshot.")
    y -= 103

    c.setFont("Helvetica-Bold", 13)
    c.drawString(36, y, "Section map")
    y -= 24
    items = list(SECTION_MAP.items())
    col_w = 258
    row_h = 31
    for index, (section_id, label) in enumerate(items):
        col = index % 2
        row = index // 2
        x = 36 + col * 282
        row_y = y - row * row_h
        c.setFillColor(ACCENT)
        c.roundRect(x, row_y - 18, 31, 21, 6, stroke=0, fill=1)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(x + 15.5, row_y - 11, section_id)
        draw_wrapped(c, label, x + 40, row_y - 3, col_w - 40, size=8, leading=9.5, color=INK)

    lower_y = 240
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(36, lower_y, "Before-and-after intake")
    rules = [
        "Use only images with verified written permission for public marketing.",
        "Send the before and after as separate, full-resolution files.",
        "Name the treatment, honest timeframe, and placement: main, weight loss, or both.",
        "Keep patient names, consent records, and appointment information out of the shared project.",
    ]
    rule_y = lower_y - 24
    for rule in rules:
        c.setFillColor(ACCENT)
        c.circle(41, rule_y + 3, 2.5, stroke=0, fill=1)
        rule_y = draw_wrapped(c, rule, 51, rule_y, 525, size=9.5, leading=13, color=MUTED) - 6

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(36, 95, "Keep unchanged")
    draw_wrapped(
        c,
        "Booking destinations, analytics, paid-ad settings, domains, medical claims, and the employee-only Rella HQ app.",
        36,
        78,
        540,
        size=9,
        leading=12,
        color=MUTED,
    )


def add_notes_field(c: canvas.Canvas, field_name: str) -> None:
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(36, 91, "AMIE'S REQUESTED CHANGES — START WITH THE SECTION ID")
    form: AcroForm = c.acroForm
    form.textfield(
        name=field_name,
        tooltip="Type requested changes here",
        x=36,
        y=31,
        width=540,
        height=52,
        borderColor=ACCENT,
        fillColor=Color(1, 1, 1, alpha=1),
        textColor=INK,
        borderWidth=1,
        borderStyle="solid",
        forceBorder=True,
        fontName="Helvetica",
        fontSize=9,
        fieldFlags=4096,
    )


def draw_screenshot_pages(c: canvas.Canvas, spec: dict, page_counter: int) -> int:
    annotate_screenshot(spec["path"], spec["annotated"], spec["markers"])
    image = Image.open(spec["annotated"]).convert("RGB")
    image_w, image_h = image.size
    image_box = (36, 112, 540, 598)
    _, _, box_w, box_h = image_box
    max_crop_h = int(image_w * box_h / box_w)
    slice_count = max(1, math.ceil(image_h / max_crop_h))
    slice_h = math.ceil(image_h / slice_count)

    for slice_index in range(slice_count):
        top = slice_index * slice_h
        bottom = min(image_h, (slice_index + 1) * slice_h)
        crop = image.crop((0, top, image_w, bottom))
        slice_path = TMP / f"{spec['annotated'].stem}-slice-{slice_index + 1}.png"
        crop.save(slice_path, quality=94)

        page_counter += 1
        draw_header(
            c,
            f"Page review {slice_index + 1} of {slice_count}",
            spec["title"],
            spec["site"],
        )
        available_h = image_box[3]
        rendered_h = min(available_h, box_w * crop.height / crop.width)
        image_y = image_box[1] + available_h - rendered_h
        c.setStrokeColor(LINE)
        c.rect(35.5, image_y - 0.5, box_w + 1, rendered_h + 1, stroke=1, fill=0)
        c.drawImage(str(slice_path), image_box[0], image_y, width=box_w, height=rendered_h, preserveAspectRatio=True, anchor="n")

        slice_marker_ids = [
            section_id
            for section_id, y_fraction in spec["markers"]
            if top <= int(image_h * y_fraction) < bottom
        ]
        marker_label = ", ".join(slice_marker_ids) if slice_marker_ids else "continuation"
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7.5)
        c.drawRightString(PAGE_W - 36, 96, f"Visible IDs: {marker_label}")
        add_notes_field(c, f"notes_{page_counter:02d}")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7)
        c.drawString(36, 16, "Rella website review pack • August 8, 2026")
        c.drawRightString(PAGE_W - 36, 16, str(page_counter))
        c.showPage()

    return page_counter


def build() -> Path:
    TMP.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    for spec in SCREENSHOTS:
        if not spec["path"].exists():
            raise FileNotFoundError(f"Missing screenshot: {spec['path']}")

    c = canvas.Canvas(str(PDF_PATH), pagesize=letter, pageCompression=1)
    c.setTitle("Rella Website Review Pack for Amie")
    c.setAuthor("Rella Aesthetics")
    c.setSubject("Fillable staging review for the Rella website revamp")

    draw_cover(c)
    c.showPage()
    draw_guide(c)
    c.showPage()

    page_counter = 2
    for spec in SCREENSHOTS:
        page_counter = draw_screenshot_pages(c, spec, page_counter)

    c.save()
    return PDF_PATH


if __name__ == "__main__":
    print(build())
