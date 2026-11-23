#!/usr/bin/env python3
"""Pull each artist's Bandcamp store into merch.js.

Reads the Bandcamp link of every artist in artists.js, then:
  - <their-bandcamp>/merch: physical items that are in stock (vinyl, tees, …)
  - <their-bandcamp>/music: every album / EP (digital), newest first
and writes them to merch.js
(window.NIKAMMA_MERCH = { slug: [ {kind, title, type, price, year, url, img}, ... ] }).
Albums that already show up as merch (e.g. with a vinyl) aren't listed twice.
Single tracks are left out.

Runs every day from .github/workflows/bandcamp.yml; run it by hand with
    python3 tools/sync_bandcamp.py
Only the standard library is used. If Bandcamp can't be reached, the old
merch.js is kept, so the site never loses its store.
"""
import html, json, re, sys, urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parent.parent
UA = 'Mozilla/5.0 (compatible; nikamma-site merch sync)'


def artists():
    """(slug, bandcamp base url) for each artist in artists.js."""
    src = (ROOT / 'artists.js').read_text()
    blocks = re.split(r"\n  \{\n", src)[1:]
    for b in blocks:
        slug = re.search(r"slug:\s*'([^']+)'", b)
        bc = re.search(r"Bandcamp:\s*'([^']+)'", b)
        if slug and bc:
            u = urlparse(bc.group(1))
            yield slug.group(1), f'{u.scheme}://{u.netloc}'


def text(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.geturl(), r.read().decode('utf-8', 'replace')


def merch(base):
    final, page = get(base + '/merch')
    # No merch page: Bandcamp sends you to an album instead.
    if not urlparse(final).path.rstrip('/').endswith('/merch'):
        return []
    items = []
    for li in re.findall(r'<li[^>]*class="merch-grid-item.*?</li>', page, re.S):
        if 'sold-out' in li:
            continue
        href = re.search(r'<a href="([^"]+)"', li)
        title = re.search(r'<p class="title">(.*?)</p>', li, re.S)
        if not (href and title):
            continue
        # title is "Release – Item"; keep the item name.
        name = re.sub(r'<span class="artist-override">.*?</span>', '', title.group(1), flags=re.S)
        parts = [p for p in (text(x) for x in re.split(r'&ndash;|–', name)) if p]
        img = re.search(r'<img[^>]+src="([^"]+)"', li)
        kind = re.search(r'class="merchtype[^"]*">(.*?)</div>', li, re.S)
        price = re.search(r'<span class="price">(.*?)</span>\s*<span class="currency">(.*?)</span>', li, re.S)
        items.append({
            'kind': 'merch',
            'title': parts[-1] if parts else text(name),
            'type': text(kind.group(1)) if kind else '',
            'price': f'{text(price.group(1))} {text(price.group(2))}' if price else '',
            'url': urljoin(base + '/', href.group(1)),
            'img': re.sub(r'_\d+\.jpg$', '_16.jpg', img.group(1)) if img else '',
        })
    return items


def album(url):
    """Title, year and cover of one album page."""
    _, page = get(url)
    d = json.loads(html.unescape(re.search(r'data-tralbum="([^"]+)"', page).group(1)))
    cur = d.get('current') or {}
    year = re.search(r'\b(\d{4})\b', cur.get('release_date') or d.get('album_release_date') or '')
    art = d.get('art_id') or cur.get('art_id')
    return {
        'kind': 'album',
        'title': cur.get('title') or '',
        'type': 'digital album',
        'price': '',
        'year': year.group(1) if year else '',
        'url': url,
        'img': f'https://f4.bcbits.com/img/a{int(art):010d}_16.jpg' if art else '',
    }


def music(base, skip):
    final, page = get(base + '/music')
    path = urlparse(final).path
    if path.startswith('/album/'):  # only one release: Bandcamp opens it directly
        urls = [base + path]
    else:
        urls = []
        for h in re.findall(r'<a href="(/album/[^"?#]+)"', page):
            u = base + h
            if u not in urls:
                urls.append(u)
    out = [album(u) for u in urls if u not in skip]
    return sorted(out, key=lambda x: x['year'], reverse=True)


def main():
    out, failed = {}, False
    for slug, base in artists():
        try:
            stuff = merch(base)
            records = music(base, {m['url'] for m in stuff})
            out[slug] = stuff + records
            print(f'{slug}: {len(stuff)} merch, {len(records)} album(s) from {base}')
        except Exception as e:  # keep going; keep the old file below
            print(f'{slug}: could not read {base} ({e})', file=sys.stderr)
            failed = True
    if failed:
        print('Not updating merch.js because a fetch failed.', file=sys.stderr)
        return 1
    body = json.dumps(out, indent=2, ensure_ascii=False)
    (ROOT / 'merch.js').write_text(
        '// Written by tools/sync_bandcamp.py every day. Do not edit by hand:\n'
        '// add things on Bandcamp, or other shops in the store list in artists.js.\n'
        f'window.NIKAMMA_MERCH = {body};\n')
    return 0


if __name__ == '__main__':
    sys.exit(main())
