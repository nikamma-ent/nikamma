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
  const photo = $('artist-photo');
  photo.src = `${ROOT}img/artists/${a.photo}`;
  photo.alt = a.name;
  $('artist-credit').textContent = a.credit ? `photo: ${a.credit}` : '';
  $('artist-contact').href = `mailto:office@nikamma.co?subject=${encodeURIComponent(a.name)}`;

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
  $('artist-bio').textContent = a.bio || '';
  show('sec-bio', !!a.bio);
  mountPlayer($('player'), a);

  // tour dates: loads when it scrolls near the screen
  if (a.bandsintown && a.bandsintown.artist) {
    show('sec-tour', true);
    whenNear($('sec-tour'), () => loadTour(a.bandsintown, $('tour')));
  }

  // live photos
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
    $('live-prev').addEventListener('click', () => go(idx - 1));
    $('live-next').addEventListener('click', () => go(idx + 1));
    whenNear($('sec-live'), () => go(0));
  }

  // videos
  if ((a.videos || []).length) {
    show('sec-videos', true);
    const stage = $('video-stage');
    const list = $('video-list');
    const play = (v, autoplay) => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${v.id}?rel=0${autoplay ? '&autoplay=1' : ''}`;
      f.title = v.title;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      stage.replaceChildren(f);
      list.querySelectorAll('li').forEach((li) => li.classList.toggle('is-on', li.dataset.id === v.id));
    };
    a.videos.forEach((v) => {
      const li = document.createElement('li');
      li.dataset.id = v.id;
      li.innerHTML = '<button type="button"><img loading="lazy" alt=""><span></span></button>';
      li.querySelector('img').src = `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`;
      li.querySelector('span').textContent = v.title;
      li.querySelector('button').addEventListener('click', () => play(v, true));
      list.append(li);
    });
    whenNear($('sec-videos'), () => play(a.videos[0], false));
  }

  // store
  if ((a.store || []).length) {
    show('sec-store', true);
    const grid = $('store');
    a.store.forEach((s) => {
      const card = document.createElement('a');
      card.className = 'store__card'; card.href = s.url; card.target = '_blank'; card.rel = 'noopener';
      card.innerHTML = '<div class="store__img"></div><p class="store__note"></p><p class="store__title"></p>';
      if (s.img) {
        const im = document.createElement('img'); im.src = ROOT + s.img; im.alt = s.title;
        card.querySelector('.store__img').append(im);
      }
      card.querySelector('.store__title').textContent = s.title;
      card.querySelector('.store__note').replaceChildren(chips(s.note));
      grid.append(card);
    });
    const more = $('store-more');
    const storeUrl = a.storeUrl || a.store[0].url;
    if (storeUrl) more.href = storeUrl; else more.hidden = true;
  }

  // prev / next
  if (ARTISTS.length > 1) {
    const prev = ARTISTS[(i - 1 + ARTISTS.length) % ARTISTS.length];
    const next = ARTISTS[(i + 1) % ARTISTS.length];
    $('artist-prev').href = artistUrl(prev); $('artist-prev').textContent = `← ${prev.name}`;
    $('artist-next').href = artistUrl(next); $('artist-next').textContent = `${next.name} →`;
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
      'event-ticket-cta-bg-color': accent,
      'event-ticket-cta-text-color': '#000000',
      'event-ticket-cta-border-color': accent,
      'event-ticket-cta-border-radius': '99px',
      'play-my-city-cta-bg-color': 'rgba(0,0,0,0)',
      'play-my-city-cta-text-color': '#000000',
      'play-my-city-cta-border-color': 'rgba(0,0,0,0.25)',
      'play-my-city-cta-border-radius': '99px',
    };
    // add ?sample-tour to an artist page's address to preview with Bandsintown's sample dates
    if (new URLSearchParams(location.search).has('sample-tour')) opts['sample-events'] = 'true';
    Object.entries(opts).forEach(([k, v]) => w.setAttribute(`data-${k}`, v));
    box.append(w);
    paginateTour(box, 5);
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
        li.querySelector('.tour__where').textContent = [v.name, [v.city, v.country].filter(Boolean).join(', ')].filter(Boolean).join(' – ');
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
