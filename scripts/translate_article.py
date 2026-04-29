#!/usr/bin/env python3
"""Translate a Camino Libre JA article into EN/ES versions.

Usage: pass a translations dict to translate_article(slug, translations).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LANG_SWITCHER_CSS = """    .article-lang-switcher {
      text-align: center;
      font-size: 0.85rem;
      padding: 0.6rem 1rem;
      background: rgba(0,0,0,0.04);
      border-bottom: 1px solid rgba(0,0,0,0.08);
      margin-top: 0;
    }
    .article-lang-switcher .lang-label { color: #666; margin-right: 0.5rem; }
    .article-lang-switcher a, .article-lang-switcher strong { margin: 0 0.5rem; text-decoration: none; }
    .article-lang-switcher a { color: #555; }
    .article-lang-switcher a:hover { color: var(--accent, #c2876a); }
    .article-lang-switcher strong { color: var(--accent, #c2876a); }
    [data-theme="dark"] .article-lang-switcher { background: rgba(255,255,255,0.04); border-bottom-color: rgba(255,255,255,0.08); }
    [data-theme="dark"] .article-lang-switcher .lang-label { color: #aaa; }
    [data-theme="dark"] .article-lang-switcher a { color: #ccc; }"""

# Shared text used across all articles. Each entry maps JA -> {en: ..., es: ...}.
NAV_TRANSLATIONS = {
    'aria-label="メニュー"': {'en': 'aria-label="Menu"', 'es': 'aria-label="Menú"'},
    'ホーム</a>': {'en': 'Home</a>', 'es': 'Inicio</a>'},
    '目的地 ▾': {'en': 'Destinations ▾', 'es': 'Destinos ▾'},
    '<div class="v2-dropdown-region">中南米</div>': {
        'en': '<div class="v2-dropdown-region">Latin America</div>',
        'es': '<div class="v2-dropdown-region">Latinoamérica</div>',
    },
    ' コスタリカ</a>': {'en': ' Costa Rica</a>', 'es': ' Costa Rica</a>'},
    ' ニカラグア</a>': {'en': ' Nicaragua</a>', 'es': ' Nicaragua</a>'},
    ' メキシコ</a>': {'en': ' Mexico</a>', 'es': ' México</a>'},
    ' パナマ</a>': {'en': ' Panama</a>', 'es': ' Panamá</a>'},
    ' エルサルバドル</a>': {'en': ' El Salvador</a>', 'es': ' El Salvador</a>'},
    ' ベリーズ</a>': {'en': ' Belize</a>', 'es': ' Belice</a>'},
    ' チリ</a>': {'en': ' Chile</a>', 'es': ' Chile</a>'},
    '<div class="v2-dropdown-region">アジア</div>': {
        'en': '<div class="v2-dropdown-region">Asia</div>',
        'es': '<div class="v2-dropdown-region">Asia</div>',
    },
    ' 台湾</a>': {'en': ' Taiwan</a>', 'es': ' Taiwán</a>'},
    '<div class="v2-dropdown-region">日本</div>': {
        'en': '<div class="v2-dropdown-region">Japan</div>',
        'es': '<div class="v2-dropdown-region">Japón</div>',
    },
    ' 北海道</a>': {'en': ' Hokkaido</a>', 'es': ' Hokkaidō</a>'},
    ' ツーリング</a>': {'en': ' Touring</a>', 'es': ' Motociclismo</a>'},
    ' キャンプ</a>': {'en': ' Camping</a>', 'es': ' Camping</a>'},
    '<a href="../stories.html">記事一覧</a>': {
        'en': '<a href="../stories.html">Stories</a>',
        'es': '<a href="../stories.html">Artículos</a>',
    },
    '<a href="../profile/">プロフィール</a>': {
        'en': '<a href="../profile/">Profile</a>',
        'es': '<a href="../profile/">Perfil</a>',
    },
}

SHARED_TRANSLATIONS = {
    '<a href="../stories.html" class="back-link">← 一覧に戻る</a>': {
        'en': '<a href="../../stories.html" class="back-link">← Back to all stories</a>',
        'es': '<a href="../../stories.html" class="back-link">← Volver a todos los artículos</a>',
    },
    '<span class="share-label">シェアする</span>': {
        'en': '<span class="share-label">Share</span>',
        'es': '<span class="share-label">Compartir</span>',
    },
    'aria-label="Xでシェア"': {'en': 'aria-label="Share on X"', 'es': 'aria-label="Compartir en X"'},
    'aria-label="LINEでシェア"': {'en': 'aria-label="Share on LINE"', 'es': 'aria-label="Compartir en LINE"'},
    'aria-label="URLをコピー"': {'en': 'aria-label="Copy URL"', 'es': 'aria-label="Copiar URL"'},
    '<span>コピー</span>': {'en': '<span>Copy</span>', 'es': '<span>Copiar</span>'},
    # Spot list
    '<h3>今回訪れた場所</h3>': {'en': '<h3>Places visited</h3>', 'es': '<h3>Lugares visitados</h3>'},
    # Affiliate disclosure
    '※ 本記事はAmazonアソシエイトリンクを含みます。詳細は<a href="../privacy.html">プライバシーポリシー</a>をご覧ください。': {
        'en': '* This article contains Amazon Associate links. See our <a href="../../privacy.html">Privacy Policy</a> for details.',
        'es': '* Este artículo contiene enlaces de afiliados de Amazon. Consulta nuestra <a href="../../privacy.html">Política de privacidad</a> para más información.',
    },
    # Footer nav
    '<a href="../index.html">ホーム</a>\n      <a href="../stories.html">記事一覧</a>\n      <a href="../profile/">プロフィール</a>\n      <a href="../privacy.html">プライバシーポリシー</a>': {
        'en': '<a href="../../index.html">Home</a>\n      <a href="../../stories.html">Stories</a>\n      <a href="../../profile/">Profile</a>\n      <a href="../../privacy.html">Privacy Policy</a>',
        'es': '<a href="../../index.html">Inicio</a>\n      <a href="../../stories.html">Artículos</a>\n      <a href="../../profile/">Perfil</a>\n      <a href="../../privacy.html">Política de privacidad</a>',
    },
    # Read-time formats (we'll override per-article anyway)
    '分で読める</span>': {'en': ' min read</span>', 'es': ' min de lectura</span>'},
}

def fix_paths_for_lang_dir(html, lang):
    """Adjust ../foo to ../../foo since we're nested one more level."""
    # CSS, JS, images, internal HTML links
    html = html.replace('href="../style.css', 'href="../../style.css')
    html = html.replace('src="../js/', 'src="../../js/')
    html = html.replace('src="../images/', 'src="../../images/')
    html = html.replace("src='../images/", "src='../../images/")
    html = html.replace("url('../images/", "url('../../images/")
    html = html.replace('url("../images/', 'url("../../images/')
    html = html.replace('href="../index.html', 'href="../../index.html')
    html = html.replace('href="../stories.html', 'href="../../stories.html')
    html = html.replace('href="../profile/', 'href="../../profile/')
    html = html.replace('href="../privacy.html', 'href="../../privacy.html')
    # Image hero src/srcset attributes
    html = html.replace('background-image: url(\'../images/', "background-image: url('../../images/")
    html = html.replace('background-image:url(\'../images/', "background-image:url('../../images/")
    return html

def add_hreflang(html, slug, lang):
    """Insert hreflang link tags after canonical."""
    canonical_pattern = r'<link rel="canonical" href="https://camino-libre\.jp/articles/[^"]+">'
    new_canonical = f'<link rel="canonical" href="https://camino-libre.jp/articles/{lang}/{slug}.html">'
    hreflang_block = f'''<link rel="canonical" href="https://camino-libre.jp/articles/{lang}/{slug}.html">
  <link rel="alternate" hreflang="ja" href="https://camino-libre.jp/articles/{slug}.html">
  <link rel="alternate" hreflang="en" href="https://camino-libre.jp/articles/en/{slug}.html">
  <link rel="alternate" hreflang="es" href="https://camino-libre.jp/articles/es/{slug}.html">
  <link rel="alternate" hreflang="x-default" href="https://camino-libre.jp/articles/{slug}.html">'''
    html = re.sub(canonical_pattern, hreflang_block, html, count=1)
    return html

def add_og_locale(html, lang):
    """Update og:locale and add alternates."""
    if lang == 'en':
        html = html.replace('<meta property="og:locale" content="ja_JP">', '<meta property="og:locale" content="en_US">')
        # If og:locale not present, add it after og:site_name
        if '<meta property="og:locale"' not in html:
            html = html.replace('<meta property="og:site_name" content="Camino Libre">',
                                '<meta property="og:site_name" content="Camino Libre">\n  <meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="ja_JP">\n  <meta property="og:locale:alternate" content="es_419">', 1)
        else:
            html = html.replace('<meta property="og:locale" content="en_US">',
                                '<meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="ja_JP">\n  <meta property="og:locale:alternate" content="es_419">', 1)
    elif lang == 'es':
        html = html.replace('<meta property="og:locale" content="ja_JP">', '<meta property="og:locale" content="es_419">')
        if '<meta property="og:locale"' not in html:
            html = html.replace('<meta property="og:site_name" content="Camino Libre">',
                                '<meta property="og:site_name" content="Camino Libre">\n  <meta property="og:locale" content="es_419">\n  <meta property="og:locale:alternate" content="ja_JP">\n  <meta property="og:locale:alternate" content="en_US">', 1)
        else:
            html = html.replace('<meta property="og:locale" content="es_419">',
                                '<meta property="og:locale" content="es_419">\n  <meta property="og:locale:alternate" content="ja_JP">\n  <meta property="og:locale:alternate" content="en_US">', 1)
    return html

def add_lang_switcher_css(html):
    """Insert lang switcher CSS into head <style> block (or inject one)."""
    if '.article-lang-switcher' in html:
        return html
    # Find the </head> and insert <style> just before it if no inline style. But all our
    # articles have an inline <style>... </style>? Actually most articles only have a <link>
    # to style.css. For those, we add a fresh <style>.
    if '  </style>\n</head>' in html:
        return html.replace('  </style>\n</head>', LANG_SWITCHER_CSS + '\n  </style>\n</head>', 1)
    # No inline style; inject our CSS as a new style tag before </head>
    return html.replace('</head>', f'<style>\n{LANG_SWITCHER_CSS}\n</style>\n</head>', 1)

def insert_lang_switcher_html(html, slug, lang):
    """Insert language switcher HTML right after </header>."""
    if lang == 'en':
        switcher = f'''<div class="article-lang-switcher" lang="en">
  <span class="lang-label">Read in:</span>
  <a href="../{slug}.html" hreflang="ja" lang="ja">日本語</a>
  <strong aria-current="page">English</strong>
  <a href="../es/{slug}.html" hreflang="es" lang="es">Español</a>
</div>

'''
    elif lang == 'es':
        switcher = f'''<div class="article-lang-switcher" lang="es">
  <span class="lang-label">Leer en:</span>
  <a href="../{slug}.html" hreflang="ja" lang="ja">日本語</a>
  <a href="../en/{slug}.html" hreflang="en" lang="en">English</a>
  <strong aria-current="page">Español</strong>
</div>

'''
    else:  # ja
        switcher = f'''<div class="article-lang-switcher" lang="ja">
  <span class="lang-label">言語:</span>
  <strong aria-current="page">日本語</strong>
  <a href="en/{slug}.html" hreflang="en" lang="en">English</a>
  <a href="es/{slug}.html" hreflang="es" lang="es">Español</a>
</div>

'''
    # Insert after </header>
    return html.replace('</header>\n', '</header>\n\n' + switcher, 1)

def apply_shared_translations(html, lang):
    for ja, langs in NAV_TRANSLATIONS.items():
        html = html.replace(ja, langs[lang])
    for ja, langs in SHARED_TRANSLATIONS.items():
        html = html.replace(ja, langs[lang])
    return html

def translate_article(slug, translations):
    """Generate EN/ES versions of articles/<slug>.html using `translations` dict.

    translations: {
        'en': {'title': '...', 'description': '...', 'og_title': '...', 'og_description': '...',
               'twitter_title': '...', 'twitter_description': '...',
               'category': '...', 'hero_title_html': '...',
               'date': '...', 'read_time': '5 min read',
               'body_html': '<p>...</p>...', 'tags': ['Tag1', 'Tag2']},
        'es': {... same shape ...}
    }
    """
    src = ROOT / 'articles' / f'{slug}.html'
    src_html = src.read_text()

    # Strip any pre-existing lang switcher block from JA source so EN/ES generations
    # don't accidentally include a JA switcher.
    src_html = re.sub(
        r'<div class="article-lang-switcher" lang="ja">.*?</div>\s*\n',
        '',
        src_html,
        count=1,
        flags=re.DOTALL,
    )

    for lang in ('en', 'es'):
        t = translations[lang]
        h = src_html
        h = h.replace('<html lang="ja">', f'<html lang="{lang}">')
        # Translate shared chrome BEFORE adjusting paths so dict patterns match
        h = apply_shared_translations(h, lang)
        h = fix_paths_for_lang_dir(h, lang)
        h = add_hreflang(h, slug, lang)
        h = add_og_locale(h, lang)
        h = add_lang_switcher_css(h)
        h = insert_lang_switcher_html(h, slug, lang)
        # Update og:url to language-specific URL
        h = h.replace(
            f'<meta property="og:url" content="https://camino-libre.jp/articles/{slug}.html">',
            f'<meta property="og:url" content="https://camino-libre.jp/articles/{lang}/{slug}.html">',
            1
        )

        # Title and metadata
        h = re.sub(
            r'<title>[^<]+</title>',
            f'<title>{t["title"]}</title>',
            h, count=1
        )
        h = re.sub(
            r'<meta name="description" content="[^"]+">',
            f'<meta name="description" content="{t["description"]}">',
            h, count=1
        )
        h = re.sub(
            r'<meta property="og:title" content="[^"]+">',
            f'<meta property="og:title" content="{t.get("og_title", t["title"].split(" | ")[0])}">',
            h, count=1
        )
        h = re.sub(
            r'<meta property="og:description" content="[^"]+">',
            f'<meta property="og:description" content="{t.get("og_description", t["description"])}">',
            h, count=1
        )
        h = re.sub(
            r'<meta name="twitter:title" content="[^"]+">',
            f'<meta name="twitter:title" content="{t.get("twitter_title", t.get("og_title", t["title"].split(" | ")[0]))}">',
            h, count=1
        )
        h = re.sub(
            r'<meta name="twitter:description" content="[^"]+">',
            f'<meta name="twitter:description" content="{t.get("twitter_description", t.get("og_description", t["description"]))}">',
            h, count=1
        )

        # article-category text
        h = re.sub(
            r'<div class="article-category">[^<]+</div>',
            f'<div class="article-category">{t["category"]}</div>',
            h, count=1
        )
        # article-hero-title — full <h1> replacement
        h = re.sub(
            r'<h1 class="article-hero-title">.*?</h1>',
            f'<h1 class="article-hero-title">{t["hero_title_html"]}</h1>',
            h, count=1, flags=re.DOTALL
        )
        # article-hero-meta — replace date and read-time
        # The 3 spans pattern: Monaka · DATE · READ_TIME分で読める
        h = re.sub(
            r'(<div class="article-hero-meta">\s*<span>Monaka</span>\s*<span class="dot">·</span>\s*<span>)([^<]+)(</span>\s*<span class="dot">·</span>\s*<span>)([^<]+)(</span>\s*</div>)',
            lambda m: m.group(1) + t['date'] + m.group(3) + t['read_time'] + m.group(5),
            h, count=1
        )

        # body content: replace everything between back-link and share-buttons
        body_html = t['body_html']
        h = re.sub(
            r'(<a href="../../stories.html" class="back-link">[^<]+</a>)(.*?)(<div class="share-buttons">)',
            r'\1\n\n' + body_html + r'\n\n  \3',
            h, count=1, flags=re.DOTALL
        )

        # tags
        tags_html = '\n'.join(f'    <span class="article-tag">{tag}</span>' for tag in t['tags'])
        h = re.sub(
            r'<div class="article-tags">.*?</div>',
            f'<div class="article-tags">\n{tags_html}\n  </div>',
            h, count=1, flags=re.DOTALL
        )

        # Apply any extra string substitutions (e.g. for spot-list entries)
        for pat, repl in t.get('extra_replacements', []):
            h = h.replace(pat, repl)

        out = ROOT / 'articles' / lang / f'{slug}.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(h)

    # Update JA file with hreflang and lang switcher
    ja_html = src_html
    if 'hreflang' not in ja_html:
        # Add hreflang block after canonical
        ja_html = re.sub(
            r'(<link rel="canonical" href="https://camino-libre\.jp/articles/[^"]+">)',
            r'\1\n  <link rel="alternate" hreflang="ja" href="https://camino-libre.jp/articles/' + slug + r'.html">\n  <link rel="alternate" hreflang="en" href="https://camino-libre.jp/articles/en/' + slug + r'.html">\n  <link rel="alternate" hreflang="es" href="https://camino-libre.jp/articles/es/' + slug + r'.html">\n  <link rel="alternate" hreflang="x-default" href="https://camino-libre.jp/articles/' + slug + r'.html">',
            ja_html, count=1
        )
    if '.article-lang-switcher' not in ja_html:
        ja_html = add_lang_switcher_css(ja_html)
        ja_html = insert_lang_switcher_html(ja_html, slug, 'ja')
    if 'og:locale' not in ja_html:
        # Add og:locale to JA
        ja_html = ja_html.replace(
            '<meta property="og:site_name" content="Camino Libre">',
            '<meta property="og:site_name" content="Camino Libre">\n  <meta property="og:locale" content="ja_JP">\n  <meta property="og:locale:alternate" content="en_US">\n  <meta property="og:locale:alternate" content="es_419">',
            1
        )
    src.write_text(ja_html)

    print(f"  -> {slug}: EN/ES generated, JA updated")
