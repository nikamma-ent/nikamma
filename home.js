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

})();
