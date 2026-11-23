// ---------- ticker: built from news.js ----------
(function buildTicker() {
  const track = document.getElementById('ticker');
  const news = window.NIKAMMA_NEWS || [];
  if (!track || !news.length) return;

  const item = (n, hidden) => {
    const el = document.createElement(n.link ? 'a' : 'span');
    el.textContent = n.text;
    if (n.link) {
      el.href = n.link;
      if (/^https?:/.test(n.link)) { el.target = '_blank'; el.rel = 'noopener'; }
    }
    if (hidden) { el.setAttribute('aria-hidden', 'true'); el.tabIndex = -1; }
    return el;
  };
  const star = () => {
    const s = document.createElement('span');
    s.textContent = '✺';
    s.setAttribute('aria-hidden', 'true');
    return s;
  };

  // Repeat the list until one copy is wider than the screen, then double it
  // so the -50% scroll loops seamlessly.
  const copy = [];
  const minItems = Math.max(news.length, 6);
  for (let i = 0; copy.length < minItems * 2; i++) copy.push(news[i % news.length]);
  for (let pass = 0; pass < 2; pass++) {
    copy.forEach((n, i) => {
      track.append(item(n, pass > 0 || i >= news.length), star());
    });
  }
})();

document.querySelectorAll('.year').forEach((el) => { el.textContent = new Date().getFullYear(); });

// ---------- artists ----------
const ROOT = document.body.dataset.root || '';
// Always A–Z, so the lineup, the numbering and prev/next all agree.
const ARTISTS = (window.NIKAMMA_ARTISTS || []).slice().sort((a, b) => a.name.localeCompare(b.name));
const pad = (n) => String(n).padStart(2, '0');
const artistUrl = (a) => `${ROOT}artists/${a.slug}/`;

// Turn any open.spotify.com link into its embed URL.
function spotifyEmbed(url) {
  const m = /open\.spotify\.com\/(?:intl-[\w-]+\/)?(album|artist|playlist|track|episode|show)\/([A-Za-z0-9]+)/.exec(url || '');
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : null;
}

function mountPlayer(box, artist) {
  if (!box) return;
  const src = spotifyEmbed(artist.spotify);
  box.replaceChildren();
  if (!src) {
    const empty = document.createElement('div');
    empty.className = 'player__empty';
    empty.textContent = 'Spotify player coming soon.';
    box.append(empty);
    return;
  }
  const f = document.createElement('iframe');
  f.src = src;
  f.title = `${artist.name} on Spotify`;
  f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  box.append(f);
}

// Roster page: festival-lineup list, photo + player on the right.
const rosterList = document.getElementById('roster');
if (rosterList && ARTISTS.length) {
  const player = document.getElementById('player');
  const now = document.getElementById('now-playing');
  const photo = document.getElementById('roster-photo');
  let playing = null;

  const showPhoto = (a) => {
    const src = `${ROOT}img/artists/${a.photo}`;
    if (photo.getAttribute('src') === src) return;
    photo.classList.add('is-swapping');
    const next = new Image();
    next.onload = () => { photo.src = src; photo.alt = a.name; photo.classList.remove('is-swapping'); };
    next.src = src;
  };

  const play = (a) => {
    playing = a;
    now.textContent = a.name;
    mountPlayer(player, a);
    showPhoto(a);
    rosterList.querySelectorAll('li').forEach((li) => li.classList.toggle('is-playing', li.dataset.slug === a.slug));
  };

  ARTISTS.forEach((a) => {
    const li = document.createElement('li');
    li.dataset.slug = a.slug;
    li.innerHTML = `<a class="lineup__name" href="${artistUrl(a)}"></a><button type="button" class="lineup__play"${a.spotify ? '' : ' hidden'}>▶</button>`;
    li.querySelector('.lineup__name').textContent = a.name;
    const btn = li.querySelector('.lineup__play');
    btn.setAttribute('aria-label', `Play ${a.name}`);
    btn.title = `Play ${a.name}`;
    btn.addEventListener('click', () => play(a));
    li.addEventListener('mouseenter', () => { rosterList.classList.add('is-hovering'); showPhoto(a); });
    li.addEventListener('mouseleave', () => { rosterList.classList.remove('is-hovering'); showPhoto(playing || ARTISTS[0]); });
    rosterList.append(li);
  });

  const playlist = window.NIKAMMA_PLAYLIST;
  if (playlist) {
    now.textContent = 'the nikamma roster';
    mountPlayer(player, { name: 'the nikamma roster', spotify: playlist });
    showPhoto(ARTISTS[0]);
  } else {
    play(ARTISTS.find((a) => a.spotify) || ARTISTS[0]);
  }
}

// Artist subpage: filled from artists.js by the slug on <main>.
const artistMain = document.querySelector('[data-artist]');
if (artistMain && ARTISTS.length) {
  const i = ARTISTS.findIndex((a) => a.slug === artistMain.dataset.artist);
  const a = ARTISTS[i];
  if (a) {
    const $ = (id) => document.getElementById(id);
    $('artist-n').textContent = pad(i + 1);
    $('artist-name').textContent = a.name;
    $('artist-meta').textContent = a.meta;
    $('artist-bio').textContent = a.bio;
    const img = $('artist-photo');
    img.src = `${ROOT}img/artists/${a.photo}`;
    img.alt = a.name;
    const credit = $('artist-credit');
    if (credit) credit.textContent = a.credit ? `photo: ${a.credit}` : '';
    mountPlayer($('player'), a);

    const links = $('artist-links');
    Object.entries(a.links || {}).forEach(([label, href]) => {
      const el = document.createElement('a');
      el.href = href; el.textContent = label; el.target = '_blank'; el.rel = 'noopener';
      links.append(el);
    });

    if (ARTISTS.length > 1) {
      const prev = ARTISTS[(i - 1 + ARTISTS.length) % ARTISTS.length];
      const next = ARTISTS[(i + 1) % ARTISTS.length];
      $('artist-prev').href = artistUrl(prev); $('artist-prev').textContent = `← ${prev.name}`;
      $('artist-next').href = artistUrl(next); $('artist-next').textContent = `${next.name} →`;
    }
  }
}
