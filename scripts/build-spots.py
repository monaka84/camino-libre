#!/usr/bin/env python3
"""
js/spots.js を画像EXIF GPSベースで再生成する。

使い方（プロジェクトルートで実行）:
    python3 scripts/build-spots.py

依存:
    pip install Pillow

優先順位:
    1. spot-item の直前にある figure 画像のEXIF GPS（最も正確）
    2. 該当記事内の全画像のEXIF GPSの中央値（記事代表座標）
    3. 既存 js/spots.js に座標があればそれを保持（Nominatim結果のフォールバック）
    4. どれも取れないスポットは spots.js に含めず、未解決として標準出力に出す

新規記事を追加した直後に走らせれば、自動的にマップにスポットが追加される。
EXIF GPS のない古い写真しかない記事は、Googleマップで座標を調べて
js/spots.js に手動追記してください。
"""

import glob
import json
import os
import re
import statistics
import sys

try:
    from PIL import Image, ExifTags
except ImportError:
    print("Pillow が必要です: pip install Pillow", file=sys.stderr)
    sys.exit(1)


def get_gps(path):
    try:
        img = Image.open(path)
        exif = img._getexif() or {}
        gps_tag = next((k for k, v in ExifTags.TAGS.items() if v == "GPSInfo"), None)
        if not gps_tag or gps_tag not in exif:
            return None
        gps = exif[gps_tag]
        d = {ExifTags.GPSTAGS.get(k, k): v for k, v in gps.items()}
        if "GPSLatitude" not in d or "GPSLongitude" not in d:
            return None

        def to_deg(dms, ref):
            v = float(dms[0]) + float(dms[1]) / 60 + float(dms[2]) / 3600
            return -v if ref in ("S", "W") else v

        return (
            to_deg(d["GPSLatitude"], d.get("GPSLatitudeRef", "N")),
            to_deg(d["GPSLongitude"], d.get("GPSLongitudeRef", "E")),
        )
    except Exception:
        return None


def scan_image_gps():
    full, base = {}, {}
    exts = ("jpg", "jpeg", "JPG", "JPEG", "png", "PNG", "avif", "AVIF")
    for ext in exts:
        for p in glob.glob(f"images/**/*.{ext}", recursive=True):
            c = get_gps(p)
            if c and -90 <= c[0] <= 90 and -180 <= c[1] <= 180:
                full[p] = c
                base[os.path.basename(p)] = c
    return full, base


def load_existing_spots():
    if not os.path.exists("js/spots.js"):
        return {}
    with open("js/spots.js", encoding="utf-8") as f:
        src = f.read()
    m = re.search(r"window\.SPOTS\s*=\s*(\[.*?\]);", src, re.S)
    if not m:
        return {}
    arr = re.sub(r",(\s*\])", r"\1", m.group(1))
    try:
        spots = json.loads(arr)
    except Exception:
        return {}
    return {(s["article"], s["name"]): (s["lat"], s["lng"]) for s in spots}


FIG_RE = re.compile(r'<figure[^>]*>\s*<img[^>]+src="([^"]+)"', re.I)
SPOT_RE = re.compile(
    r'<div class="spot-info-name"\s+data-map="([^"]+)"[^>]*>([^<]+)</div>\s*'
    r'<div class="spot-info-detail">([^<]*)</div>',
    re.S,
)
TITLE_RE = re.compile(r"<title>([^<]+)</title>")


def normalize_img_path(src):
    return src.replace("../", "")


def build():
    print("画像EXIFスキャン中...", flush=True)
    full, base = scan_image_gps()
    print(f"  GPS付き画像: {len(full)}", flush=True)

    existing = load_existing_spots()

    spots = []
    sources = {"figure-direct": 0, "article-median": 0, "existing": 0}
    unresolved = []

    for art_path in sorted(glob.glob("articles/*.html")):
        art_file = os.path.basename(art_path)
        with open(art_path, encoding="utf-8") as f:
            html = f.read()

        tm = TITLE_RE.search(html)
        art_title = (
            tm.group(1).split("｜")[0].split(" / ")[0].strip()
            if tm
            else art_file
        )

        figs = [
            (m.start(), normalize_img_path(m.group(1)))
            for m in FIG_RE.finditer(html)
        ]
        coords_in_article = [
            full.get(p) or base.get(os.path.basename(p)) for _, p in figs
        ]
        coords_in_article = [c for c in coords_in_article if c]
        repr_coord = None
        if coords_in_article:
            repr_coord = (
                statistics.median([c[0] for c in coords_in_article]),
                statistics.median([c[1] for c in coords_in_article]),
            )

        for sm in SPOT_RE.finditer(html):
            spot_pos = sm.start()
            name = sm.group(2).strip()
            detail = sm.group(3).strip()

            coord, src_kind = None, None
            prev_figs = [(pos, p) for pos, p in figs if pos < spot_pos]
            if prev_figs:
                _, p = prev_figs[-1]
                coord = full.get(p) or base.get(os.path.basename(p))
                if coord:
                    src_kind = "figure-direct"
            if not coord and repr_coord:
                coord, src_kind = repr_coord, "article-median"
            if not coord and (art_file, name) in existing:
                coord, src_kind = existing[(art_file, name)], "existing"

            if coord:
                sources[src_kind] += 1
                spots.append(
                    {
                        "name": name,
                        "detail": detail,
                        "lat": round(coord[0], 6),
                        "lng": round(coord[1], 6),
                        "article": art_file,
                        "articleTitle": art_title,
                    }
                )
            else:
                unresolved.append((art_file, name))

    out = [
        "// このファイルは scripts/build-spots.py により自動生成されたマップ用スポットデータ。",
        "// 生成優先度: 写真EXIF GPS → 記事内画像のGPS中央値 → 既存座標。",
        "// EXIF GPS のない記事のスポットは js/spots.js に直接追記してください。",
        "(function () {",
        "  window.SPOTS = [",
    ]
    for s in spots:
        out.append("    " + json.dumps(s, ensure_ascii=False) + ",")
    out.append("  ];")
    out.append("})();")

    with open("js/spots.js", "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")

    print(f"\n=== 結果 ===")
    print(f"スポット数: {len(spots)}")
    for k, v in sources.items():
        print(f"  {k}: {v}")
    if unresolved:
        print(f"\n未解決スポット ({len(unresolved)}件 / 手動追記が必要):")
        for art, name in unresolved:
            print(f"  {art:35s} | {name}")
    print("\njs/spots.js を更新しました。")
    print("忘れずに全ページの ?v=YYYYMMDDx を当日のキーに更新してください。")


if __name__ == "__main__":
    if not os.path.isdir("articles") or not os.path.isdir("images"):
        print("プロジェクトルートで実行してください（articles/ と images/ が必要）", file=sys.stderr)
        sys.exit(1)
    build()
