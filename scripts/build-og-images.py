#!/usr/bin/env python3
"""OGカード画像を全記事に対して生成する。

各記事のヒーロー画像 (article-hero の background-image) を 1200x630 (1.91:1)
にカバーリサイズ＋中央クロップして images/og/<slug>.jpg に出力する。

ヒーローが外部URL (wixstatic 等) の場合は、現状の og:image が指すローカル
画像をフォールバックソースとして使う。
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_DIR = ROOT / "articles"
OG_DIR = ROOT / "images" / "og"

TARGET_W, TARGET_H = 1200, 630

SITE_URL = "https://camino-libre.jp"

HERO_RE = re.compile(
    r'class="article-hero"[^>]*style="[^"]*background-image:\s*url\(\s*[\'"]?([^\'")]+)',
    re.IGNORECASE,
)
OG_IMAGE_RE = re.compile(r'<meta\s+property="og:image"\s+content="([^"]+)"')
OG_IMAGE_TAG_RE = re.compile(r'(<meta\s+property="og:image"\s+content=")[^"]+(")')
OG_W_TAG_RE = re.compile(r'(<meta\s+property="og:image:width"\s+content=")[^"]+(")')
OG_H_TAG_RE = re.compile(r'(<meta\s+property="og:image:height"\s+content=")[^"]+(")')
TW_IMAGE_TAG_RE = re.compile(r'(<meta\s+name="twitter:image"\s+content=")[^"]+(")')


def url_to_local(url: str) -> Path | None:
    if url.startswith("http://") or url.startswith("https://"):
        if "camino-libre.jp/" in url:
            rel = url.split("camino-libre.jp/", 1)[1]
            return ROOT / rel
        return None
    return None


def resolve_hero_source(html_path: Path) -> Path | None:
    text = html_path.read_text(encoding="utf-8")
    m = HERO_RE.search(text)
    if m:
        raw = m.group(1).strip()
        if raw.startswith("http"):
            local = url_to_local(raw)
            if local and local.exists():
                return local
        else:
            cand = (html_path.parent / raw).resolve()
            if cand.exists():
                return cand
    m2 = OG_IMAGE_RE.search(text)
    if m2:
        local = url_to_local(m2.group(1).strip())
        if local and local.exists():
            return local
    return None


def cover_resize(img: Image.Image, w: int, h: int) -> Image.Image:
    return ImageOps.fit(img, (w, h), method=Image.LANCZOS, centering=(0.5, 0.5))


def build_one(slug: str, src: Path, force: bool = False) -> tuple[bool, str]:
    OG_DIR.mkdir(parents=True, exist_ok=True)
    out = OG_DIR / f"{slug}.jpg"
    if not src.exists():
        return False, f"source missing: {src}"
    if not force and out.exists():
        try:
            with Image.open(out) as existing:
                if existing.size == (TARGET_W, TARGET_H):
                    return True, "already 1200x630, skipped"
        except Exception:
            pass
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGB")
        out_im = cover_resize(im, TARGET_W, TARGET_H)
        out_im.save(out, format="JPEG", quality=88, optimize=True, progressive=True)
    rel = src.relative_to(ROOT) if ROOT in src.parents else src
    return True, f"generated from {rel}"


def update_meta_tags(html_path: Path, slug: str) -> tuple[bool, str]:
    """記事HTMLの og:image / twitter:image / og:image:width/height を統一フォーマットに更新する。"""
    text = html_path.read_text(encoding="utf-8")
    new_url = f"{SITE_URL}/images/og/{slug}.jpg"
    changed = False
    parts = []

    for label, pattern, replacement in (
        ("og:image", OG_IMAGE_TAG_RE, rf'\g<1>{new_url}\g<2>'),
        ("og:image:width", OG_W_TAG_RE, r'\g<1>1200\g<2>'),
        ("og:image:height", OG_H_TAG_RE, r'\g<1>630\g<2>'),
        ("twitter:image", TW_IMAGE_TAG_RE, rf'\g<1>{new_url}\g<2>'),
    ):
        new_text, n = pattern.subn(replacement, text, count=1)
        if n == 0:
            parts.append(f"{label}=missing")
        elif new_text != text:
            changed = True
            parts.append(f"{label}=updated")
            text = new_text
        else:
            parts.append(f"{label}=ok")

    if changed:
        html_path.write_text(text, encoding="utf-8")
    return changed, ", ".join(parts)


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--only", help="single slug to process (e.g. hokkaido-car-day2)")
    p.add_argument("--force", action="store_true", help="regenerate even if 1200x630 exists")
    p.add_argument("--update-meta", action="store_true", help="also update og:image / twitter:image meta tags in articles")
    args = p.parse_args()

    articles = sorted(ARTICLES_DIR.glob("*.html"))
    n_ok = n_skip = n_err = 0
    for art in articles:
        slug = art.stem
        if args.only and slug != args.only:
            continue
        src = resolve_hero_source(art)
        if src is None:
            print(f"[ERR ] {slug}: no usable hero image found")
            n_err += 1
            continue
        ok, msg = build_one(slug, src, force=args.force)
        if ok:
            tag = "SKIP" if "skipped" in msg else "OK  "
            print(f"[{tag}] {slug}: {msg}")
            if "skipped" in msg:
                n_skip += 1
            else:
                n_ok += 1
        else:
            print(f"[ERR ] {slug}: {msg}")
            n_err += 1
            continue

        if args.update_meta:
            changed, meta_msg = update_meta_tags(art, slug)
            mark = "META" if changed else "meta"
            print(f"  [{mark}] {meta_msg}")

    print(f"\nDone: {n_ok} generated, {n_skip} skipped, {n_err} errors")
    return 0 if n_err == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
