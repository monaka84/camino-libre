#!/usr/bin/env python3
"""Migrate the inline `.article-lang-switcher` block on every page to the new
header-integrated `.v2-lang-switcher` dropdown.

For each HTML file under the project that contains an `article-lang-switcher`
block:
1. Extract the three cross-language URLs (and the current language)
2. Remove the `.article-lang-switcher` CSS rules from the inline `<style>`
3. Remove the `<div class="article-lang-switcher">…</div>` HTML block
4. Insert a `<div class="v2-lang-switcher">…</div>` immediately before the
   final `</nav>` in the v2-header.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LANG_LABELS = {
    'ja': '🌐 JA',
    'en': '🌐 EN',
    'es': '🌐 ES',
}
# Full language names for the dropdown menu items.
LANG_NAMES = {
    'ja': '日本語',
    'en': 'English',
    'es': 'Español',
}

# Match the inline `.article-lang-switcher` CSS block (added by the original
# implementation). Greedy across newlines, but bounded to its own block.
INLINE_CSS_RE = re.compile(
    r'\n?\s*\.article-lang-switcher\s*\{.*?\}\s*'
    r'(?:\n?\s*\.article-lang-switcher[^{]*\{.*?\}\s*)*'
    r'(?:\n?\s*\[data-theme="dark"\][^{]*?\.article-lang-switcher[^{]*\{.*?\}\s*)*',
    re.DOTALL,
)

# The HTML block to remove (any of ja/en/es). Matches up to closing </div> + a
# trailing blank line.
HTML_BLOCK_RE = re.compile(
    r'<div class="article-lang-switcher" lang="(?P<lang>ja|en|es)">.*?</div>\s*\n*',
    re.DOTALL,
)

# Inside the block, links use either <a> or <strong> for the current language.
LINK_RE = re.compile(
    r'<(?P<tag>a|strong)[^>]*?(?:href="(?P<href>[^"]+)")?[^>]*?(?:hreflang="(?P<hreflang>[^"]+)")?[^>]*?(?:lang="(?P<lang>[^"]+)")?[^>]*?>(?P<text>[^<]+)</(?:a|strong)>',
    re.DOTALL,
)


def parse_lang_block(block_html):
    """From a captured `<div class="article-lang-switcher"…>…</div>` block,
    return {'current': 'ja'|'en'|'es', 'urls': {'ja': '...', 'en': '...', 'es': '...'}}.

    The current-language entry uses `<strong>` instead of `<a>`, so for the
    current language we set href to '' and the caller substitutes '#' or
    leaves it empty.
    """
    m = re.search(r'lang="(ja|en|es)"', block_html.split('>', 1)[0] + '>')
    current = m.group(1) if m else 'ja'

    urls = {'ja': '', 'en': '', 'es': ''}

    # Find each language's href: either via `<a … hreflang="X" lang="X">` or
    # `<strong … aria-current="page">{lang_label}</strong>` (no href).
    for hreflang in ('ja', 'en', 'es'):
        m = re.search(
            r'<a[^>]*hreflang="' + hreflang + r'"[^>]*href="([^"]+)"[^>]*>',
            block_html,
        ) or re.search(
            r'<a[^>]*href="([^"]+)"[^>]*hreflang="' + hreflang + r'"[^>]*>',
            block_html,
        )
        if m:
            urls[hreflang] = m.group(1)

    return {'current': current, 'urls': urls}


def build_v2_switcher(current, urls):
    """Generate the new header-integrated dropdown HTML."""
    label = LANG_LABELS[current]
    items = []
    for code in ('ja', 'en', 'es'):
        text = LANG_NAMES[code]
        if code == current:
            items.append(
                f'          <a href="#" hreflang="{code}" lang="{code}" aria-current="page">{text}</a>'
            )
        else:
            href = urls.get(code) or '#'
            items.append(
                f'          <a href="{href}" hreflang="{code}" lang="{code}">{text}</a>'
            )
    items_html = '\n'.join(items)
    return (
        f'      <div class="v2-lang-switcher" data-current-lang="{current}">\n'
        f'        <button type="button" class="lang-trigger" aria-haspopup="true" aria-expanded="false" aria-label="Language" title="Change language / 言語 / Idioma">{label}</button>\n'
        f'        <div class="lang-menu" role="menu">\n'
        f'{items_html}\n'
        f'        </div>\n'
        f'      </div>\n'
    )


def migrate_file(path: Path) -> bool:
    text = path.read_text()
    if 'article-lang-switcher' not in text:
        return False

    # Find the HTML block first (so we can extract URLs).
    m = HTML_BLOCK_RE.search(text)
    if not m:
        # CSS-only leftover; just drop it.
        new = INLINE_CSS_RE.sub('', text)
        path.write_text(new)
        return new != text

    block_html = m.group(0)
    info = parse_lang_block(block_html)
    new_block = build_v2_switcher(info['current'], info['urls'])

    # 1) Strip the inline CSS rules.
    text2 = INLINE_CSS_RE.sub('', text)

    # 2) Remove the HTML block (same content as `block_html`, but the
    #    text has changed length above so re-search).
    text2 = HTML_BLOCK_RE.sub('', text2, count=1)

    # 3) Insert the new switcher just before the closing </nav>.
    if '</nav>' in text2:
        text2 = text2.replace('</nav>', new_block + '    </nav>', 1)
    else:
        # Fallback: insert at the start of <body>.
        text2 = re.sub(r'<body[^>]*>', lambda mo: mo.group(0) + '\n' + new_block, text2, count=1)

    if text2 != text:
        path.write_text(text2)
        return True
    return False


def main():
    targets = []
    targets += list(ROOT.glob('*.html'))
    targets += list(ROOT.glob('articles/*.html'))
    targets += list(ROOT.glob('articles/en/*.html'))
    targets += list(ROOT.glob('articles/es/*.html'))
    targets += list(ROOT.glob('en/*.html'))
    targets += list(ROOT.glob('es/*.html'))
    targets += list(ROOT.glob('en/profile/*.html'))
    targets += list(ROOT.glob('es/profile/*.html'))
    targets += list(ROOT.glob('profile/*.html'))

    changed = 0
    for path in targets:
        if migrate_file(path):
            changed += 1
            print(f'  updated: {path.relative_to(ROOT)}')
    print(f'Done. {changed} files updated.')


if __name__ == '__main__':
    main()
