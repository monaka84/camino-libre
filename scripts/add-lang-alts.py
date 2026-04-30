#!/usr/bin/env python3
"""
JA 記事 HTML に hreflang alternate / og:locale alternate / lang switcher を追加する。

使い方:
    python3 scripts/add-lang-alts.py noto-touring bandai-azuma himawari-tsunan ...

slug 単位で articles/<slug>.html を編集。EN/ES の HTML 生成は別途 Write で行うこと。
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTICLES = ROOT / "articles"


def update_file(slug: str) -> bool:
    p = ARTICLES / f"{slug}.html"
    if not p.exists():
        print(f"  skip: {p} (not found)", file=sys.stderr)
        return False
    text = p.read_text(encoding="utf-8")
    changed = False

    # 1) hreflang 追加（canonical の直後、まだなければ）
    canonical_re = re.compile(
        r'(<link rel="canonical" href="https://camino-libre\.jp/articles/'
        + re.escape(slug) + r'">\n)'
    )
    if 'hreflang="en"' not in text:
        block = (
            f'  <link rel="alternate" hreflang="ja" href="https://camino-libre.jp/articles/{slug}">\n'
            f'  <link rel="alternate" hreflang="en" href="https://camino-libre.jp/articles/en/{slug}">\n'
            f'  <link rel="alternate" hreflang="es" href="https://camino-libre.jp/articles/es/{slug}">\n'
            f'  <link rel="alternate" hreflang="x-default" href="https://camino-libre.jp/articles/{slug}">\n'
        )
        new_text, n = canonical_re.subn(r"\1" + block, text, count=1)
        if n:
            text = new_text
            changed = True

    # 2) og:locale + alternates 追加（og:site_name の直後、まだなければ）
    if 'property="og:locale:alternate" content="en_US"' not in text:
        site_re = re.compile(
            r'(<meta property="og:site_name" content="Camino Libre">\n)'
        )
        # 既に og:locale ja_JP があれば、その下に alternates だけ追加
        if 'property="og:locale" content="ja_JP"' in text:
            ja_locale_re = re.compile(
                r'(<meta property="og:locale" content="ja_JP">\n)'
            )
            block = (
                '  <meta property="og:locale:alternate" content="en_US">\n'
                '  <meta property="og:locale:alternate" content="es_419">\n'
            )
            new_text, n = ja_locale_re.subn(r"\1" + block, text, count=1)
            if n:
                text = new_text
                changed = True
        else:
            block = (
                '  <meta property="og:locale" content="ja_JP">\n'
                '  <meta property="og:locale:alternate" content="en_US">\n'
                '  <meta property="og:locale:alternate" content="es_419">\n'
            )
            new_text, n = site_re.subn(r"\1" + block, text, count=1)
            if n:
                text = new_text
                changed = True

    # 3) lang-switcher 追加（</nav> の直後、 </div></header> の前。まだなければ）
    if "v2-lang-switcher" not in text:
        nav_close = (
            "      <a href=\"../profile/\">プロフィール</a>\n"
            "    </nav>\n"
            "  </div>\n"
            "</header>"
        )
        replacement = (
            "      <a href=\"../profile/\">プロフィール</a>\n"
            "    </nav>\n"
            "    <div class=\"v2-lang-switcher\" data-current-lang=\"ja\">\n"
            "        <button type=\"button\" class=\"lang-trigger\" aria-haspopup=\"true\" aria-expanded=\"false\" aria-label=\"Language\" title=\"Change language / 言語 / Idioma\"><span class=\"lang-icon\" aria-hidden=\"true\">🌐</span><span class=\"lang-code\">JA</span></button>\n"
            "        <div class=\"lang-menu\" role=\"menu\">\n"
            f"          <a href=\"#\" hreflang=\"ja\" lang=\"ja\" aria-current=\"page\">日本語</a>\n"
            f"          <a href=\"en/{slug}.html\" hreflang=\"en\" lang=\"en\">English</a>\n"
            f"          <a href=\"es/{slug}.html\" hreflang=\"es\" lang=\"es\">Español</a>\n"
            "        </div>\n"
            "      </div>\n"
            "  </div>\n"
            "</header>"
        )
        if nav_close in text:
            text = text.replace(nav_close, replacement, 1)
            changed = True
        else:
            print(f"  warn: {slug}: nav-close pattern not found, skip lang switcher", file=sys.stderr)

    if changed:
        p.write_text(text, encoding="utf-8")
        print(f"  ok: {slug}", file=sys.stderr)
    else:
        print(f"  noop: {slug} (already done?)", file=sys.stderr)
    return changed


def main():
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        sys.exit(2)
    for slug in sys.argv[1:]:
        update_file(slug)


if __name__ == "__main__":
    main()
