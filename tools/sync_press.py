#!/usr/bin/env python3
"""Find press about each artist and keep it in press.js.

For every artist in artists.js with a `press` setting, this searches Google
News (its public RSS feed, no key needed) and keeps articles whose headline
mentions one of the artist's names. Everything found is remembered, so an
article stays even after it drops out of Google's results. The site shows
the newest 3, after any articles pinned in artists.js (the site adds those).

    press: {
      query: '"Hulo" (song OR album OR Griefcase)',  // what to search for
      names: ['Hulo', 'Aditya Majumdar'],            // headline must mention one
      also: ['band', 'album'],                        // …and one of these (optional)
      exclude: ['DNA Music'],                         // skip headlines with these
      hide: ['https://…'],                            // never show these
    }

Runs every day from .github/workflows/press.yml; run it by hand with
    python3 tools/sync_press.py
If Google can't be reached, the old press.js is kept as it is.
"""
import html, json, re, sys, urllib.parse, urllib.request
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'press.js'
UA = 'Mozilla/5.0 (compatible; nikamma-site press finder)'
KEEP = 40  # remembered per artist


def js_list(block, key):
    m = re.search(key + r"\s*:\s*\[(.*?)\]", block, re.S)
    return re.findall(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"", m.group(1)) if m else []


def artists():
    src = (ROOT / 'artists.js').read_text()
    for b in re.split(r"\n  \{\n", src)[1:]:
        slug = re.search(r"slug:\s*'([^']+)'", b)
        name = re.search(r"name:\s*'([^']+)'", b)
        pm = re.search(r"press:\s*\{(.*?)\n    \}", b, re.S)
        if not (slug and pm):
            continue
        p = pm.group(1)
        q = re.search(r"query:\s*'((?:[^'\\]|\\.)*)'", p)
        pick = lambda k: [a or b for a, b in js_list(p, k)]
        yield slug.group(1), {
            'query': q.group(1).replace("\\'", "'") if q else f'"{name.group(1)}"',
            'names': pick('names') or [name.group(1)],
            'also': pick('also'),
            'exclude': pick('exclude'),
            'hide': pick('hide'),
        }


def search(query):
    url = 'https://news.google.com/rss/search?' + urllib.parse.urlencode(
        {'q': query, 'hl': 'en-IN', 'gl': 'IN', 'ceid': 'IN:en'})
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        feed = r.read().decode('utf-8', 'replace')
    out = []
    for it in re.findall(r'<item>(.*?)</item>', feed, re.S):
        get = lambda tag: (re.search(rf'<{tag}[^>]*>(.*?)</{tag}>', it, re.S) or [None, ''])[1]
        title = html.unescape(get('title')).strip()
        outlet = html.unescape(get('source')).strip()
        # Google adds " - Outlet" to the headline; drop it.
        if outlet and title.endswith(' - ' + outlet):
            title = title[: -len(outlet) - 3].strip()
        try:
            date = parsedate_to_datetime(get('pubDate')).date().isoformat()
        except Exception:
            date = ''
        out.append({'title': title, 'outlet': outlet, 'date': date, 'url': get('link').strip()})
    return out


def load_old():
    if not OUT.exists():
        return {}
    m = re.search(r'=\s*(\{.*\});', OUT.read_text(), re.S)
    return json.loads(m.group(1)) if m else {}


def main():
    old, out, failed = load_old(), {}, False
    for slug, cfg in artists():
        seen = {a['url']: a for a in old.get(slug, [])}
        try:
            found = search(cfg['query'])
        except Exception as e:
            print(f'{slug}: search failed ({e}); keeping what we had', file=sys.stderr)
            found, failed = [], True
        names = [n.lower() for n in cfg['names']]
        exclude = [x.lower() for x in cfg['exclude']]
        also = [x.lower() for x in cfg['also']]
        new = 0
        for a in found:
            t = a['title'].lower()
            if not any(n in t for n in names) or any(x in t for x in exclude):
                continue
            if also and not any(x in t for x in also):
                continue
            # the same story syndicated twice: keep one per headline
            if any(o['title'].lower() == t for o in seen.values()):
                continue
            if a['url'] not in seen:
                new += 1
            seen[a['url']] = a
        def ok(a):
            t = a['title'].lower()
            return (a['url'] not in cfg['hide'] and not any(x in t for x in exclude)
                    and (not also or any(x in t for x in also)))
        items = [a for a in seen.values() if ok(a)]
        items.sort(key=lambda a: a['date'], reverse=True)
        out[slug] = items[:KEEP]
        print(f'{slug}: {len(out[slug])} article(s), {new} new')
    OUT.write_text(
        '// Written by tools/sync_press.py every day from Google News. Do not edit by hand:\n'
        "// change the artist's press settings in artists.js instead.\n"
        f'window.NIKAMMA_PRESS = {json.dumps(out, indent=2, ensure_ascii=False)};\n')
    return 1 if failed and not out else 0


if __name__ == '__main__':
    sys.exit(main())
