#!/usr/bin/env python3
"""Pull artist bios from Google Docs into bios.js.

For every artist in artists.js with a bioDoc (a Google Docs link shared as
"anyone with the link can view"), this downloads the doc as plain text and
keeps only the part under the heading "Short", up to the next heading
(Extended, Long, Medium…) or the end of the doc. Paragraphs are kept.

Runs on the 1st of every month from .github/workflows/bios.yml; run it by
hand with
    python3 tools/sync_bios.py
If a doc can't be read, or has no "Short" part, that artist keeps the bio
they had, so the site never ends up without one.
"""
import json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'bios.js'
HEADINGS = {'short', 'extended', 'long', 'medium', 'one-liner', 'one liner'}


def artists():
    src = (ROOT / 'artists.js').read_text()
    for b in re.split(r"\n  \{\n", src)[1:]:
        slug = re.search(r"slug:\s*'([^']+)'", b)
        doc = re.search(r"bioDoc:\s*'([^']+)'", b)
        if slug and doc:
            yield slug.group(1), doc.group(1)


def short_bio(doc_url):
    doc_id = re.search(r'/document/d/([\w-]+)', doc_url).group(1)
    url = f'https://docs.google.com/document/d/{doc_id}/export?format=txt'
    with urllib.request.urlopen(url, timeout=30) as r:
        txt = r.read().decode('utf-8-sig', 'replace')
    txt = re.sub(r'[​‌‍﻿]', '', txt).replace('\r', '')
    lines = [l.strip() for l in txt.split('\n')]
    try:
        start = next(i for i, l in enumerate(lines) if l.lower() == 'short') + 1
    except StopIteration:
        return None
    body = []
    for l in lines[start:]:
        if l.lower() in HEADINGS:
            break
        body.append(l)
    paras = [p for p in (re.sub(r'\s+', ' ', p).strip() for p in '\n'.join(body).split('\n')) if p]
    return '\n\n'.join(paras) or None


def main():
    old = {}
    if OUT.exists():
        m = re.search(r'=\s*(\{.*\});', OUT.read_text(), re.S)
        if m:
            old = json.loads(m.group(1))
    out = {}
    for slug, doc in artists():
        try:
            bio = short_bio(doc)
        except Exception as e:
            print(f'{slug}: could not read the doc ({e}); keeping the old bio', file=sys.stderr)
            bio = None
        if bio is None:
            if slug in old:
                out[slug] = old[slug]
            print(f'{slug}: no "Short" bio found; kept what we had')
        else:
            out[slug] = bio
            print(f'{slug}: {len(bio.split())} words')
    OUT.write_text(
        '// Written by tools/sync_bios.py on the 1st of every month, from each\n'
        "// artist's bioDoc (the part under \"Short\"). Edit the Google Doc, not this file.\n"
        f'window.NIKAMMA_BIOS = {json.dumps(out, indent=2, ensure_ascii=False)};\n')
    return 0


if __name__ == '__main__':
    sys.exit(main())
