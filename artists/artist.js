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
    s.className = 'ticker__dot';
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

// XL-style metadata chips: 'singer-songwriter · calcutta' → [singer-songwriter][calcutta], first one yellow.
function chips(text) {
  const wrap = document.createElement('span');
  wrap.className = 'chips';
  String(text || '').split('·').map((t) => t.trim()).filter(Boolean).forEach((t, i) => {
    const c = document.createElement('span');
    c.className = i === 0 ? 'chip chip--accent' : 'chip';
    c.textContent = t;
    wrap.append(c);
  });
  return wrap;
}
const artistUrl = (a) => `${ROOT}artists/${a.slug}/`;

// Turn any open.spotify.com link into its embed URL.
function spotifyEmbed(url) {
  const m = /open\.spotify\.com\/(?:intl-[\w-]+\/)?(album|artist|playlist|track|episode|show)\/([A-Za-z0-9]+)/.exec(url || '');
  // no theme param: Spotify tints the player with a colour from the artwork
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator` : null;
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

// Roster page: festival-lineup list, photo on the right that follows hover.
const rosterList = document.getElementById('roster');
if (rosterList && ARTISTS.length) {
  const photo = document.getElementById('roster-photo');

  const showPhoto = (a) => {
    const src = `${ROOT}img/artists/${a.photo}`;
    if (photo.getAttribute('src') === src) return;
    photo.classList.add('is-swapping');
    const next = new Image();
    next.onload = () => { photo.src = src; photo.alt = a.name; photo.classList.remove('is-swapping'); };
    next.src = src;
  };

  ARTISTS.forEach((a) => {
    const li = document.createElement('li');
    li.dataset.slug = a.slug;
    li.innerHTML = `<a class="lineup__name" href="${artistUrl(a)}"></a>`;
    li.querySelector('.lineup__name').textContent = a.name;
    if (a.latest) li.append(chips(a.latest));
    li.addEventListener('mouseenter', () => { rosterList.classList.add('is-hovering'); showPhoto(a); });
    li.addEventListener('mouseleave', () => rosterList.classList.remove('is-hovering'));
    rosterList.append(li);
    new Image().src = `${ROOT}img/artists/${a.photo}`; // preload so hover is instant
  });

  showPhoto(ARTISTS[0]);
}

// ---------- artist pages ----------
// Round icons for the usual links; anything else shows as a text pill.
const ICONS = {
  spotify: '<svg viewBox="0 0 24 24"><path d="M6.5 9.6c3.6-1.1 7.9-.7 10.9 1.1M7.2 12.8c3-.9 6.4-.5 8.9 1M7.9 15.8c2.4-.6 4.9-.4 7 .8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  'apple music': '<svg viewBox="0 0 24 24"><path d="M10 17.5V7.2l8-1.7v10.3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8" cy="17.6" r="2" fill="currentColor"/><circle cx="16" cy="15.9" r="2" fill="currentColor"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3.2"/><circle cx="16.2" cy="7.8" r=".5" fill="currentColor"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.6 9.8v4.4l3.8-2.2z" fill="currentColor"/></svg>',
  bandcamp: '<svg viewBox="0 0 24 24"><path d="M8.5 8h11l-4 8h-11z" fill="currentColor"/></svg>',
};

const artistMain = document.querySelector('[data-artist]');
if (artistMain && ARTISTS.length) {
  const i = ARTISTS.findIndex((a) => a.slug === artistMain.dataset.artist);
  const a = ARTISTS[i];
  if (a) renderArtist(a, i);
}

function renderArtist(a, i) {
  const $ = (id) => document.getElementById(id);
  const show = (id, yes) => { const el = $(id); if (el) el.hidden = !yes; };

  // hero
  $('artist-n').textContent = pad(i + 1);
  $('artist-name').textContent = a.name;
  $('artist-meta').replaceChildren(chips(a.meta));
  // hero: just their main photo (no carousel in this design)
  const slides = [
    { src: `${ROOT}img/artists/${a.hero || a.photo}`, caption: a.credit ? `photo: ${a.credit}` : '' },
  ];
  const photo = $('artist-photo');
  let h = 0, timer;
  const showSlide = (n) => {
    h = (n + slides.length) % slides.length;
    const sl = slides[h];
    const next = new Image();
    next.onload = () => {
      photo.classList.add('is-swapping');
      setTimeout(() => { photo.src = sl.src; photo.alt = h ? `${a.name} live` : a.name; photo.classList.remove('is-swapping'); }, h === 0 && !photo.src ? 0 : 250);
    };
    next.src = sl.src;
    $('artist-credit').textContent = sl.caption;
    $('hero-count').textContent = `${pad(h + 1)} / ${pad(slides.length)}`;
    const ahead = slides[(h + 1) % slides.length]; if (ahead) new Image().src = ahead.src;
  };
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const auto = () => { clearInterval(timer); if (!calm && slides.length > 1) timer = setInterval(() => showSlide(h + 1), 6000); };
  if (slides.length > 1) {
    $('hero-nav').hidden = false;
    $('hero-prev').addEventListener('click', () => { showSlide(h - 1); auto(); });
    $('hero-next').addEventListener('click', () => { showSlide(h + 1); auto(); });
    const stage = $('hero-stage');
    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', auto);
  }
  showSlide(0);
  auto();

  const links = $('artist-links');
  Object.entries(a.links || {}).forEach(([label, href]) => {
    const el = document.createElement('a');
    el.href = href; el.target = '_blank'; el.rel = 'noopener';
    const icon = ICONS[label.toLowerCase()];
    if (icon) { el.className = 'ahero__icon'; el.innerHTML = icon; el.setAttribute('aria-label', label); el.title = label; }
    else { el.className = 'ahero__pill'; el.textContent = label; }
    links.append(el);
  });

  // bio + tracks
  // bio: the "Short" part of their bio Google Doc (bios.js, monthly), else a.bio
  const bio = (window.NIKAMMA_BIOS || {})[a.slug] || a.bio || '';
  $('artist-bio').replaceChildren(...bio.split(/\n\s*\n/).filter(Boolean).map((t) => {
    const p = document.createElement('p'); p.textContent = t.trim(); return p;
  }));
  show('sec-bio', !!bio);
  // spotify after the social links; no link yet → no music block at all
  if (spotifyEmbed(a.spotify)) mountPlayer($('player'), a); else show('sec-tracks', false);


  // tour dates: loads when it scrolls near the screen
  if (a.bandsintown && a.bandsintown.artist) {
    show('sec-tour', true);
    whenNear($('sec-tour'), () => loadTour(a.bandsintown, $('tour')));
  }

  // live photos: a carousel next to the tour dates
  if ((a.live || []).length) {
    show('sec-live', true);
    let idx = 0;
    const go = (n) => {
      idx = (n + a.live.length) % a.live.length;
      const item = a.live[idx];
      const img = $('live-img');
      img.classList.add('is-swapping');
      const next = new Image();
      next.onload = () => { img.src = next.src; img.alt = item.caption || a.name; img.classList.remove('is-swapping'); };
      next.src = ROOT + item.src;
      $('live-caption').textContent = item.caption || '';
      $('live-count').textContent = `${pad(idx + 1)} / ${pad(a.live.length)}`;
      const ahead = a.live[(idx + 1) % a.live.length]; if (ahead) new Image().src = ROOT + ahead.src;
    };
    let timer;
    const restart = () => { clearInterval(timer); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && a.live.length > 1) timer = setInterval(() => go(idx + 1), 4500); };
    $('live-prev').addEventListener('click', () => go(idx - 1));
    $('live-next').addEventListener('click', () => go(idx + 1));
    // automatic, like a slow slideshow (paused for reduced-motion users)
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    whenNear($('sec-live'), () => { go(0); if (!calm) restart(); });
  }

  // press (left): pinned articles first, then the newest the daily search found. 3 in all.
  // news (right): for now, site news that mentions them (news.js); later, what we publish.
  {
    const key = (p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const pinned = ((a.press || {}).pin || []);
    const pinnedKeys = new Set(pinned.map(key));
    const press = [...pinned, ...((window.NIKAMMA_PRESS || {})[a.slug] || []).filter((p) => !pinnedKeys.has(key(p)))].slice(0, 3);
    const nm = a.name.toLowerCase();
    const news = (window.NIKAMMA_NEWS || []).filter((n) => n.text.toLowerCase().includes(nm)).slice(0, 3);   // 3 at a time
    const fmtDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    press.forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = '<a target="_blank" rel="noopener"><p class="apress__meta"></p><p class="apress__title"></p></a>';
      li.querySelector('a').href = p.url;
      li.querySelector('.apress__meta').textContent = [p.outlet, p.date ? fmtDay.format(new Date(p.date)) : ''].filter(Boolean).join(' · ');
      li.querySelector('.apress__title').textContent = p.title;
      $('press').append(li);
    });
    news.forEach((n) => {
      // a card: photo (the item's img, else the artist's photo), then the line
      const li = document.createElement('li');
      const el = document.createElement(n.link ? 'a' : 'div');
      el.className = 'anews__card';
      if (n.link) { el.href = n.link; if (/^https?:/.test(n.link)) { el.target = '_blank'; el.rel = 'noopener'; } }
      const im = document.createElement('img');
      im.src = ROOT + (n.img || `img/artists/${a.photo}`); im.alt = ''; im.loading = 'lazy';
      const t = document.createElement('p'); t.className = 'anews__text'; t.textContent = n.text;
      el.append(im, t); li.append(el); $('news').append(li);
    });
    if (!news.length) $('news').innerHTML = '<li><p class="anews__empty">nothing yet.</p></li>';
    show('sec-press', press.length > 0 || news.length > 0);
  }

  // video: one, full width at the end; "more videos" links to their YouTube
  if (a.video && a.video.id) {
    show('sec-video', true);
    whenNear($('sec-video'), () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${a.video.id}?rel=0`;
      f.title = a.video.title || a.name;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      $('video-stage').replaceChildren(f);
    });
    const yt = (a.links || {}).YouTube;
    if (yt) { $('video-all').href = yt; $('video-all').hidden = false; }
  }

  // store: Bandcamp merch + albums (pulled in daily, see merch.js) + other shops from artists.js
  // store (right column): Bandcamp merch, other shops, then Bandcamp albums. Max 4 cards.
  const STORE_CAP = 4;
  const bcAll = (window.NIKAMMA_MERCH || {})[a.slug] || [];
  const asCard = (m) => ({
    title: m.title, url: m.url, img: m.img,
    note: [m.type, m.price, m.year].filter(Boolean).join(' · '),   // no "bandcamp" chip: first chip (yellow) is the type
  });
  const bcMerch = bcAll.filter((m) => m.kind === 'merch').map(asCard);
  const shops = a.store || [];
  const bcAlbums = bcAll.filter((m) => m.kind === 'album').map(asCard);
  const items = [...bcMerch, ...shops, ...bcAlbums].slice(0, STORE_CAP);
  if (items.length) {
    show('sec-store', true);
    const grid = $('store');
    items.forEach((s) => {
      const card = document.createElement('a');
      card.className = 'store__card'; card.href = s.url; card.target = '_blank'; card.rel = 'noopener';
      card.innerHTML = '<div class="store__img"></div><p class="store__note"></p><p class="store__title"></p>';
      if (s.img) {
        const im = document.createElement('img');
        im.src = /^https?:/.test(s.img) ? s.img : ROOT + s.img; im.alt = s.title; im.loading = 'lazy';
        card.querySelector('.store__img').append(im);
      }
      card.querySelector('.store__title').textContent = s.title;
      card.querySelector('.store__note').replaceChildren(chips([s.where, s.note].filter(Boolean).join(' · ')));
      grid.append(card);
    });
    // "more in the store": the artist's own shop first, else their Bandcamp
    const more = $('store-more');
    const bc = (a.links || {}).Bandcamp;
    const external = shops.find((x) => x.where && !/bandcamp/i.test(x.where));
    const storeUrl = a.storeUrl
      || (external && external.url)
      || (bc && new URL(bcMerch.length ? '/merch' : '/music', bc).href)
      || items[0].url;
    if (storeUrl) more.href = storeUrl; else more.hidden = true;
  }

  // prev / next
  if (ARTISTS.length > 1) {
    const prev = ARTISTS[(i - 1 + ARTISTS.length) % ARTISTS.length];
    const next = ARTISTS[(i + 1) % ARTISTS.length];
    if ($('artist-prev')) { $('artist-prev').href = artistUrl(prev); $('artist-prev').textContent = `← ${prev.name}`; }
    if ($('artist-next')) { $('artist-next').href = artistUrl(next); $('artist-next').textContent = `${next.name} →`; }
  }
}

// Run fn once, when el comes within a screen of the viewport.
function whenNear(el, fn) {
  if (!('IntersectionObserver' in window)) return fn();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: '600px 0px' });
  io.observe(el);
}

// Tour dates from Bandsintown: our own list when there's an API key, the widget otherwise.
function loadTour({ artist, appId }, box) {
  const page = `https://www.bandsintown.com/a/${encodeURIComponent(artist)}`;
  const widget = () => {
    box.replaceChildren();
    const w = document.createElement('a');
    w.className = 'bit-widget-initializer';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ffd60a';
    const opts = {
      'artist-name': artist,
      // what it shows
      'display-limit': 'all',              // all dates; paged 5 at a time below
      'display-past-dates': 'false',
      'display-local-dates': 'false',
      'display-start-time': 'false',
      'display-details': 'false',
      'display-lineup': 'false',
      'display-logo': 'false',
      'display-follow-section': 'false',
      'display-play-my-city': 'true',
      'social-share-icon': 'false',
      // look: nikamma
      'auto-style': 'false',
      'layout-style': 'modern',           // not 'legacy': legacy forces the phone layout under 900px
      'font': 'Avenir Next',
      'font-size': '16px',
      'text-color': '#000000',
      'link-color': '#000000',
      'background-color': 'rgba(0,0,0,0)',
      'separator-color': 'rgba(0,0,0,0.1)',
      'date-format': 'D MMM',
      'date-capitalization': 'lowercase',
      'button-label-capitalization': 'lowercase',
      'header-capitalization': 'lowercase',
      'location-capitalization': 'lowercase',
      'venue-capitalization': 'lowercase',
      'event-ticket-cta-bg-color': 'rgba(0,0,0,0)',   // tickets: outlined box, same as "play my city"
      'event-ticket-cta-text-color': '#000000',
      'event-ticket-cta-border-color': 'rgba(0,0,0,0.45)',
      'event-ticket-cta-border-radius': '6px',
      'play-my-city-cta-bg-color': 'rgba(0,0,0,0)',
      'play-my-city-cta-text-color': '#000000',
      'play-my-city-cta-border-color': 'rgba(0,0,0,0.25)',
      'play-my-city-cta-border-radius': '6px',
    };
    // add ?sample-tour to an artist page's address to preview with Bandsintown's sample dates
    if (new URLSearchParams(location.search).has('sample-tour')) opts['sample-events'] = 'true';
    Object.entries(opts).forEach(([k, v]) => w.setAttribute(`data-${k}`, v));
    box.append(w);
    paginateTour(box, 3)   // 3 per page: stacked rows, sized to sit beside the photo;
    if (!document.querySelector('script[src*="widgetv3.bandsintown.com"]')) {
      const s = document.createElement('script');
      s.src = 'https://widgetv3.bandsintown.com/main.min.js';
      s.charset = 'utf-8';
      document.body.append(s);
    }
  };
  if (!appId) return widget();

  box.innerHTML = '<p class="tour__empty">loading dates…</p>';
  fetch(`https://rest.bandsintown.com/artists/${encodeURIComponent(artist)}/events?app_id=${encodeURIComponent(appId)}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((events) => {
      events = Array.isArray(events) ? events : [];
      box.replaceChildren();
      if (!events.length) {
        box.innerHTML = `<p class="tour__empty">no upcoming shows right now. <a href="${page}" target="_blank" rel="noopener">follow on bandsintown ↗</a></p>`;
        return;
      }
      const ol = document.createElement('ol');
      ol.className = 'tour__list';
      const fmt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' });
      events.slice(0, 12).forEach((e) => {
        const v = e.venue || {};
        const offer = (e.offers || []).find((o) => o.url);
        const li = document.createElement('li');
        li.innerHTML = '<span class="tour__date"></span><span class="tour__where"></span><a class="tour__btn" target="_blank" rel="noopener"></a>';
        li.querySelector('.tour__date').textContent = fmt.format(new Date(e.datetime));
        li.querySelector('.tour__where').textContent = [v.city, v.country].filter(Boolean).join(', '); // city only, no venue
        const btn = li.querySelector('.tour__btn');
        btn.href = (offer && offer.url) || e.url;
        btn.textContent = offer ? 'tickets' : 'details';
        ol.append(li);
      });
      box.append(ol);
      if (events.length > 12) {
        const more = document.createElement('a');
        more.className = 'tour__more'; more.href = page; more.target = '_blank'; more.rel = 'noopener';
        more.textContent = `all ${events.length} dates ↗`;
        box.append(more);
      }
    })
    .catch(widget);
}

// Show the widget's upcoming dates `per` at a time, with ← 1 / 3 → under it.
// The widget can redraw itself, so the current page is re-applied after every change.
function paginateTour(box, per) {
  const pager = document.createElement('div');
  pager.className = 'tour__pager';
  pager.hidden = true;
  pager.innerHTML = '<button type="button" aria-label="Earlier dates">←</button><span></span><button type="button" aria-label="Later dates">→</button>';
  box.after(pager);
  const [prevBtn, label, nextBtn] = pager.children;
  let pageNo = 0;

  const apply = () => {
    const rows = [...box.querySelectorAll('.bit-upcoming-events .bit-event, .bit-events-container .bit-event')]
      .filter((r, i, all) => all.indexOf(r) === i);
    const pages = Math.max(1, Math.ceil(rows.length / per));
    pageNo = Math.min(pageNo, pages - 1);
    rows.forEach((r, i) => {
      const on = Math.floor(i / per) === pageNo;
      if (r.hidden === on) r.hidden = !on;
    });
    pager.hidden = pages < 2;
    label.textContent = `${pageNo + 1} / ${pages}`;
    prevBtn.disabled = pageNo === 0;
    nextBtn.disabled = pageNo >= pages - 1;
  };

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(); });
  }).observe(box, { childList: true, subtree: true });

  prevBtn.addEventListener('click', () => { pageNo -= 1; apply(); });
  nextBtn.addEventListener('click', () => { pageNo += 1; apply(); });
}

// fixed ticker + nav: measure them so the page starts below and the hero sticks under them
(function () {
  const ticker = document.querySelector('.ticker');
  const top = document.querySelector('.top');
  if (!top) return;
  const set = () => {
    const t = ticker ? ticker.offsetHeight : 0;
    document.documentElement.style.setProperty('--ticker-h', `${t}px`);
    document.documentElement.style.setProperty('--head', `${t + top.offsetHeight}px`);
  };
  set();
  window.addEventListener('resize', set);
})();
