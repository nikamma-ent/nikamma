// Homepage: what we do + photo, then the nikamma playlist and follow us.
(function () {
  // the nikamma playlist: any open.spotify.com link in data-playlist
  const pl = document.getElementById('hb-playlist');
  const m = pl && /open\.spotify\.com\/(?:intl-[\w-]+\/)?(album|artist|playlist|track)\/([A-Za-z0-9]+)/.exec(pl.dataset.playlist || '');
  if (m) {
    const f = document.createElement('iframe');
    f.src = `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator`;
    f.title = 'nikamma playlist on Spotify'; f.loading = 'lazy';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    pl.append(f);
  } else if (pl) pl.closest('.hb-listen__player').hidden = true;


  // mailing list: send to Kit without leaving the page; if that can't connect, the form posts normally
  const form = document.getElementById('hb-list');
  if (form) {
    const note = document.getElementById('hb-list-note');
    const btn = form.querySelector('button');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true; note.textContent = 'joining…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.status === 'failed') throw new Error('failed');
        form.classList.add('is-done');
        note.textContent = "you're in. check your inbox to confirm.";
      } catch (err) {
        btn.disabled = false;
        if (err instanceof TypeError) { note.textContent = ''; form.submit(); return; }
        note.textContent = "that didn't work. check the email and try again.";
      }
    });
  }
})();
