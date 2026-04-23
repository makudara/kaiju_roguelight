#!/usr/bin/env python3
import json
import math
import os
import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
ASSET_ROOT = ROOT / "assets" / "kaiju"


def clamp(value, lo=0, hi=255):
    return max(lo, min(hi, int(value)))


class Canvas:
    def __init__(self, width, height, bg=(0, 0, 0, 0)):
        self.width = width
        self.height = height
        self.data = bytearray(width * height * 4)
        self.clear(bg)

    def clear(self, color):
        r, g, b, a = color
        for y in range(self.height):
            for x in range(self.width):
                i = (y * self.width + x) * 4
                self.data[i : i + 4] = bytes((r, g, b, a))

    def blend_pixel(self, x, y, color):
        if x < 0 or y < 0 or x >= self.width or y >= self.height:
            return
        sr, sg, sb, sa = color
        if sa <= 0:
            return
        i = (y * self.width + x) * 4
        dr, dg, db, da = self.data[i : i + 4]
        src_a = sa / 255.0
        dst_a = da / 255.0
        out_a = src_a + dst_a * (1.0 - src_a)
        if out_a <= 0:
            self.data[i : i + 4] = bytes((0, 0, 0, 0))
            return
        out_r = (sr * src_a + dr * dst_a * (1.0 - src_a)) / out_a
        out_g = (sg * src_a + dg * dst_a * (1.0 - src_a)) / out_a
        out_b = (sb * src_a + db * dst_a * (1.0 - src_a)) / out_a
        self.data[i : i + 4] = bytes((clamp(out_r), clamp(out_g), clamp(out_b), clamp(out_a * 255)))

    def vertical_gradient(self, top, bottom):
        for y in range(self.height):
            t = y / max(1, self.height - 1)
            color = tuple(clamp(top[i] * (1 - t) + bottom[i] * t) for i in range(4))
            for x in range(self.width):
                self.blend_pixel(x, y, color)

    def radial_glow(self, cx, cy, radius, color):
        min_x = max(0, int(cx - radius))
        max_x = min(self.width - 1, int(cx + radius))
        min_y = max(0, int(cy - radius))
        max_y = min(self.height - 1, int(cy + radius))
        for y in range(min_y, max_y + 1):
            for x in range(min_x, max_x + 1):
                dx = x - cx
                dy = y - cy
                dist = math.sqrt(dx * dx + dy * dy)
                if dist > radius:
                    continue
                power = 1.0 - dist / radius
                alpha = color[3] * (power ** 2)
                self.blend_pixel(x, y, (color[0], color[1], color[2], clamp(alpha)))

    def circle(self, cx, cy, radius, color):
        min_x = max(0, int(cx - radius))
        max_x = min(self.width - 1, int(cx + radius))
        min_y = max(0, int(cy - radius))
        max_y = min(self.height - 1, int(cy + radius))
        r2 = radius * radius
        for y in range(min_y, max_y + 1):
            for x in range(min_x, max_x + 1):
                dx = x - cx
                dy = y - cy
                if dx * dx + dy * dy <= r2:
                    self.blend_pixel(x, y, color)

    def ellipse(self, cx, cy, rx, ry, color):
        min_x = max(0, int(cx - rx))
        max_x = min(self.width - 1, int(cx + rx))
        min_y = max(0, int(cy - ry))
        max_y = min(self.height - 1, int(cy + ry))
        for y in range(min_y, max_y + 1):
            for x in range(min_x, max_x + 1):
                dx = (x - cx) / max(1, rx)
                dy = (y - cy) / max(1, ry)
                if dx * dx + dy * dy <= 1:
                    self.blend_pixel(x, y, color)

    def line(self, x0, y0, x1, y1, width, color):
        steps = max(abs(x1 - x0), abs(y1 - y0), 1)
        for step in range(steps + 1):
            t = step / steps
            x = x0 * (1 - t) + x1 * t
            y = y0 * (1 - t) + y1 * t
            self.circle(x, y, width / 2.0, color)

    def polygon(self, points, color):
        min_x = max(0, int(min(p[0] for p in points)))
        max_x = min(self.width - 1, int(max(p[0] for p in points)))
        min_y = max(0, int(min(p[1] for p in points)))
        max_y = min(self.height - 1, int(max(p[1] for p in points)))
        for y in range(min_y, max_y + 1):
            for x in range(min_x, max_x + 1):
                if point_in_polygon(x + 0.5, y + 0.5, points):
                    self.blend_pixel(x, y, color)

    def save_png(self, path):
        path.parent.mkdir(parents=True, exist_ok=True)
        raw = bytearray()
        stride = self.width * 4
        for y in range(self.height):
            raw.append(0)
            start = y * stride
            raw.extend(self.data[start : start + stride])
        compressed = zlib.compress(bytes(raw), 9)

        def chunk(tag, data):
            return (
                struct.pack("!I", len(data))
                + tag
                + data
                + struct.pack("!I", zlib.crc32(tag + data) & 0xFFFFFFFF)
            )

        ihdr = struct.pack("!IIBBBBB", self.width, self.height, 8, 6, 0, 0, 0)
        png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")
        path.write_bytes(png)


def point_in_polygon(x, y, points):
    inside = False
    j = len(points) - 1
    for i in range(len(points)):
      xi, yi = points[i]
      xj, yj = points[j]
      intersects = ((yi > y) != (yj > y)) and (
          x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-9) + xi
      )
      if intersects:
          inside = not inside
      j = i
    return inside


THEMES = {
    "radiation": {
        "base": (22, 30, 36, 255),
        "mid": (38, 47, 55, 255),
        "glow": (60, 228, 221, 210),
        "core": (120, 255, 240, 255),
        "accent": (90, 160, 185, 255),
        "bg_top": (8, 18, 26, 255),
        "bg_bottom": (3, 8, 12, 255),
    },
    "faith": {
        "base": (24, 28, 34, 255),
        "mid": (70, 73, 84, 255),
        "glow": (120, 220, 255, 195),
        "core": (220, 245, 255, 255),
        "accent": (120, 140, 168, 255),
        "bg_top": (11, 18, 30, 255),
        "bg_bottom": (4, 8, 16, 255),
    },
    "abyss": {
        "base": (13, 27, 32, 255),
        "mid": (24, 53, 60, 255),
        "glow": (55, 222, 214, 205),
        "core": (110, 255, 233, 255),
        "accent": (40, 96, 108, 255),
        "bg_top": (5, 20, 24, 255),
        "bg_bottom": (2, 8, 12, 255),
    },
}


def make_portrait(theme_id):
    theme = THEMES[theme_id]
    c = Canvas(1024, 1024)
    c.vertical_gradient(theme["bg_top"], theme["bg_bottom"])
    c.radial_glow(760, 180, 280, (theme["glow"][0], theme["glow"][1], theme["glow"][2], 70))
    c.radial_glow(260, 720, 300, (255, 120, 45, 28))
    c.line(120, 820, 920, 770, 2, (70, 120, 140, 36))
    draw_portrait_kaiju(c, theme_id, theme)
    return c


def make_battle(theme_id):
    theme = THEMES[theme_id]
    c = Canvas(1600, 1600, (0, 0, 0, 0))
    draw_battle_kaiju(c, theme_id, theme)
    return c


def make_icon(theme_id):
    theme = THEMES[theme_id]
    c = Canvas(512, 512, (0, 0, 0, 0))
    draw_icon_kaiju(c, theme_id, theme)
    return c


def draw_portrait_kaiju(c, theme_id, theme):
    body = [
        (220, 820), (240, 620), (320, 420), (500, 270), (710, 230), (760, 320),
        (690, 470), (800, 580), (840, 720), (760, 860), (470, 900)
    ]
    neck = [(510, 710), (660, 580), (760, 610), (700, 770), (580, 800)]
    jaw = [(570, 600), (760, 560), (840, 610), (770, 700), (590, 690)]
    c.polygon(body, theme["base"])
    c.polygon(neck, theme["mid"])
    c.polygon(jaw, theme["base"])
    for offset in range(4):
        spike_x = 360 + offset * 90
        spike = [(spike_x, 420), (spike_x + 45, 180 - offset * 16), (spike_x + 95, 430)]
        c.polygon(spike, theme["mid"])
        c.radial_glow(spike_x + 48, 260 - offset * 10, 60, theme["glow"])

    c.line(465, 520, 640, 500, 18, (*theme["glow"][:3], 58))
    c.line(450, 625, 640, 590, 14, (*theme["glow"][:3], 48))
    c.ellipse(700, 520, 46, 24, theme["core"])
    c.radial_glow(705, 520, 95, theme["glow"])
    c.circle(720, 520, 8, (8, 16, 18, 255))

    if theme_id == "radiation":
        c.polygon([(735, 610), (900, 580), (870, 660), (745, 660)], theme["mid"])
        c.line(575, 745, 720, 800, 10, (*theme["glow"][:3], 45))
        c.line(450, 735, 500, 870, 14, (*theme["glow"][:3], 40))
    elif theme_id == "faith":
        c.polygon([(490, 310), (550, 140), (620, 330)], theme["mid"])
        c.polygon([(625, 280), (710, 120), (755, 320)], theme["mid"])
        for (x, y) in [(510, 610), (600, 650), (540, 760), (630, 735)]:
            c.radial_glow(x, y, 36, theme["glow"])
            c.line(x - 18, y, x + 18, y, 4, theme["core"])
            c.line(x, y - 18, x, y + 18, 4, theme["core"])
    elif theme_id == "abyss":
        for idx in range(5):
            px = 330 + idx * 70
            c.polygon([(px, 430), (px + 35, 240 - idx * 6), (px + 60, 450)], theme["accent"])
        for start in [(430, 815, 360, 930), (520, 820, 460, 970), (610, 820, 580, 980)]:
            c.line(*start, 10, (*theme["glow"][:3], 38))
        for orb in [(580, 690), (650, 740), (700, 795)]:
            c.radial_glow(orb[0], orb[1], 36, theme["glow"])
            c.circle(orb[0], orb[1], 10, theme["core"])


def draw_battle_kaiju(c, theme_id, theme):
    body = [
        (240, 1230), (290, 980), (470, 710), (690, 550), (900, 520), (1020, 620),
        (1090, 770), (1250, 880), (1310, 1120), (1190, 1310), (920, 1370), (640, 1360), (380, 1310)
    ]
    tail = [(290, 1160), (90, 1040), (170, 1180), (70, 1270), (230, 1265)]
    arm = [(700, 1030), (905, 1000), (990, 1095), (890, 1180), (725, 1140)]
    leg = [(850, 1180), (970, 1335), (870, 1380), (760, 1230)]
    head = [(740, 710), (980, 660), (1090, 720), (1030, 840), (770, 830)]
    neck = [(620, 820), (760, 710), (850, 820), (720, 940)]
    c.polygon(tail, theme["mid"])
    c.polygon(body, theme["base"])
    c.polygon(neck, theme["mid"])
    c.polygon(head, theme["base"])
    c.polygon(arm, theme["mid"])
    c.polygon(leg, theme["mid"])

    for idx in range(6):
        sx = 500 + idx * 110
        spike = [(sx, 710 + idx * 18), (sx + 48, 390 - idx * 10), (sx + 105, 760 + idx * 22)]
        c.polygon(spike, theme["mid"] if idx % 2 == 0 else theme["accent"])
        c.radial_glow(sx + 44, 520 + idx * 6, 72, theme["glow"])

    for path in [
        (560, 890, 830, 820, 18),
        (510, 1020, 770, 980, 14),
        (470, 1150, 700, 1180, 12),
    ]:
        c.line(path[0], path[1], path[2], path[3], path[4], (*theme["glow"][:3], 42))

    c.ellipse(930, 735, 52, 28, theme["core"])
    c.radial_glow(930, 735, 100, theme["glow"])
    c.circle(952, 736, 8, (8, 16, 18, 255))
    c.line(1040, 768, 1210, 748, 14, (*theme["glow"][:3], 56))

    if theme_id == "radiation":
        c.polygon([(980, 720), (1210, 680), (1280, 760), (1100, 820)], theme["mid"])
        c.line(845, 850, 1015, 880, 12, (255, 120, 40, 32))
    elif theme_id == "faith":
        c.polygon([(785, 615), (845, 410), (925, 640)], theme["mid"])
        c.polygon([(925, 628), (1020, 430), (1085, 670)], theme["mid"])
        for x, y in [(640, 960), (740, 1040), (880, 950), (980, 1030)]:
            c.radial_glow(x, y, 48, theme["glow"])
            c.line(x - 18, y, x + 18, y, 4, theme["core"])
            c.line(x, y - 18, x, y + 18, 4, theme["core"])
    elif theme_id == "abyss":
        fins = [
            [(530, 840), (580, 610), (630, 880)],
            [(660, 800), (700, 580), (760, 845)],
            [(780, 795), (820, 585), (885, 870)],
        ]
        for fin in fins:
            c.polygon(fin, theme["accent"])
        tendrils = [
            (350, 1240, 250, 1420),
            (470, 1280, 420, 1480),
            (1010, 1285, 1120, 1470),
        ]
        for line in tendrils:
            c.line(*line, 14, (*theme["glow"][:3], 34))
        for orb in [(700, 1035), (780, 1095), (880, 1165)]:
            c.radial_glow(orb[0], orb[1], 42, theme["glow"])
            c.circle(orb[0], orb[1], 12, theme["core"])


def draw_icon_kaiju(c, theme_id, theme):
    head = [(120, 310), (170, 220), (285, 150), (390, 165), (432, 220), (392, 300), (250, 338), (145, 330)]
    neck = [(150, 330), (250, 325), (345, 405), (235, 430), (135, 400)]
    c.polygon(neck, theme["mid"])
    c.polygon(head, theme["base"])
    c.ellipse(330, 232, 28, 18, theme["core"])
    c.radial_glow(330, 232, 58, theme["glow"])
    if theme_id == "radiation":
        for spike in [
            [(180, 210), (210, 95), (255, 220)],
            [(245, 175), (275, 68), (320, 188)],
            [(315, 170), (350, 88), (395, 190)],
        ]:
            c.polygon(spike, theme["mid"])
    elif theme_id == "faith":
        for horn in [
            [(232, 170), (250, 70), (285, 160)],
            [(300, 155), (340, 62), (355, 170)],
            [(360, 180), (410, 94), (400, 205)],
        ]:
            c.polygon(horn, theme["mid"])
        for x, y in [(245, 260), (288, 280), (330, 298)]:
            c.line(x - 10, y, x + 10, y, 4, theme["core"])
            c.line(x, y - 10, x, y + 10, 4, theme["core"])
    elif theme_id == "abyss":
        for fin in [
            [(170, 240), (198, 120), (228, 252)],
            [(230, 195), (255, 94), (285, 215)],
            [(292, 178), (325, 95), (350, 210)],
        ]:
            c.polygon(fin, theme["accent"])
        for start in [(175, 360, 135, 430), (240, 380, 215, 455), (320, 392, 338, 470)]:
            c.line(*start, 8, (*theme["glow"][:3], 36))


def write_assets():
    manifest = json.loads((ASSET_ROOT / "manifest.json").read_text(encoding="utf-8"))
    for entry in manifest:
        kid = entry["id"]
        portrait = make_portrait(kid)
        battle = make_battle(kid)
        icon = make_icon(kid)
        portrait.save_png(ROOT / entry["portraitImage"].lstrip("./"))
        battle.save_png(ROOT / entry["battleImage"].lstrip("./"))
        icon.save_png(ROOT / entry["iconImage"].lstrip("./"))


if __name__ == "__main__":
    os.makedirs(ASSET_ROOT, exist_ok=True)
    write_assets()
