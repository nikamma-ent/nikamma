// Layout test: Carpark-style scrolling homepage (index-temp.html only).
// Runs after script.js and uses its ARTISTS, ROOT, pad, chips and artistUrl.
(function () {
  if (!document.body.classList.contains('home-temp') || !ARTISTS.length) return;
  const $ = (id) => document.getElementById(id);

  // artists that have a test page in this design link there instead
  const TEMP_PAGES = {};   // none left: the artist pages now use the new design
  const pageFor = (a) => (TEMP_PAGES[a.slug] ? ROOT + TEMP_PAGES[a.slug] : artistUrl(a));

  // header: white bar once the photo has scrolled away; hamburger menu
  {
    const top = document.querySelector('.top');
    const hero = document.querySelector('.frame--tall');
    const onScroll = () => top.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - top.offsetHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const menu = $('menu'), open = $('menu-open'), close = $('menu-close');
    const setMenu = (on) => {
      menu.hidden = !on; open.setAttribute('aria-expanded', String(on));
      document.body.classList.toggle('menu-open', on);
      (on ? close : open).focus();
    };
    open.addEventListener('click', () => setMenu(true));
    close.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  }

  // hero: a slider of the artists' photos, crossfading like Carpark's
  {
    const box = $('hero-slides');
    const slides = ARTISTS.filter((a) => a.photo).map((a) => {
      const img = document.createElement('img');
      img.className = 'frame__slide'; img.alt = a.name; img.src = `${ROOT}img/artists/${a.photo}`;
      return { a, img };
    });
    if (slides.length) {
      box.replaceChildren(...slides.map((s) => s.img));
      const dots = slides.map((s, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-label', s.a.name);
        b.addEventListener('click', () => { show(i); auto(); });
        return b;
      });
      $('hero-dots').replaceChildren(...dots);
      let cur = 0, timer;
      const show = (n) => {
        cur = (n + slides.length) % slides.length;
        slides.forEach((s, i) => s.img.classList.toggle('is-on', i === cur));
        dots.forEach((d, i) => d.classList.toggle('is-on', i === cur));
        const who = $('hero-who');
        who.textContent = `${slides[cur].a.name} →`; who.href = pageFor(slides[cur].a); who.hidden = false;
      };
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const auto = () => { clearInterval(timer); if (!calm && slides.length > 1) timer = setInterval(() => show(cur + 1), 5000); };
      show(0); auto();
    }
  }

  // latest releases: every Bandcamp album on the roster, newest first
  const releases = ARTISTS.flatMap((a) => ((window.NIKAMMA_MERCH || {})[a.slug] || [])
    .filter((m) => m.kind === 'album').map((m) => ({ ...m, artist: a })))
    .sort((x, y) => (y.year || '').localeCompare(x.year || ''))
    .slice(0, 8);
  if (releases.length) {
    $('latest').hidden = false;
    let r = 0;
    const set = (img, rel) => { if (rel && rel.img) { img.src = rel.img; img.alt = rel.title; img.hidden = false; } else img.hidden = true; };
    const go = (n) => {
      r = (n + releases.length) % releases.length;
      const rel = releases[r];
      const front = $('rel-front');
      front.classList.add('is-swapping');
      setTimeout(() => {
        set(front, rel);
        set($('rel-back'), releases.length > 1 ? releases[(r + 1) % releases.length] : null);
        front.classList.remove('is-swapping');
      }, 160);
      $('rel-artist').textContent = rel.artist.name; $('rel-artist').href = pageFor(rel.artist);
      $('rel-title').textContent = rel.title;
      $('rel-meta').replaceChildren(chips([rel.type, rel.year].filter(Boolean).join(' · ')));
      $('rel-link').href = rel.url; $('rel-covers').href = rel.url;
      $('rel-count').textContent = `${pad(r + 1)} / ${pad(releases.length)}`;
    };
    $('rel-nav').hidden = releases.length < 2;
    $('rel-prev').addEventListener('click', () => go(r - 1));
    $('rel-next').addEventListener('click', () => go(r + 1));
    go(0);
  }

  // news (news.js; the bulletin board will feed this later)
  const news = window.NIKAMMA_NEWS || [];
  if (news.length) {
    $('home-news').hidden = false;
    news.slice(0, 4).forEach((n) => {
      const li = document.createElement('li');
      const el = document.createElement(n.link ? 'a' : 'p');
      const t = document.createElement('span'); t.textContent = n.text; el.append(t);
      if (n.link) { el.href = n.link; if (/^https?:/.test(n.link)) { el.target = '_blank'; el.rel = 'noopener'; } }
      li.append(el); $('hnews').append(li);
    });
  }

  // the roster
  ARTISTS.forEach((a) => {
    const card = document.createElement('a');
    card.className = 'hartist'; card.href = pageFor(a);
    card.innerHTML = '<div class="hartist__img"><img loading="lazy" alt=""></div><p class="hartist__name"></p>';
    card.querySelector('img').src = `${ROOT}img/artists/${a.photo}`;
    card.querySelector('img').alt = a.name;
    card.querySelector('.hartist__name').textContent = a.name;
    if (a.meta) card.append(chips(a.meta));
    $('hartists').append(card);
  });

  // press: pinned + found across the roster; newest 3, one per artist first
  const key = (p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const all = [];
  const seen = new Set();
  ARTISTS.forEach((a) => {
    [...((a.press || {}).pin || []), ...((window.NIKAMMA_PRESS || {})[a.slug] || [])].forEach((p) => {
      if (seen.has(key(p))) return; seen.add(key(p)); all.push({ ...p, artist: a });
    });
  });
  all.sort((x, y) => (y.date || '').localeCompare(x.date || ''));
  const picks = [];
  for (const p of all) if (picks.length < 3 && !picks.some((q) => q.artist === p.artist)) picks.push(p);
  for (const p of all) if (picks.length < 3 && !picks.includes(p)) picks.push(p);
  if (picks.length) {
    $('home-press').hidden = false;
    const fmtDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    picks.forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = '<a target="_blank" rel="noopener"><p class="press__meta"></p><p class="press__title"></p></a>';
      li.querySelector('a').href = p.url;
      const when = p.date ? fmtDay.format(new Date(p.date)) : '';
      li.querySelector('.press__meta').replaceChildren(chips([p.artist.name, p.outlet, when].filter(Boolean).join(' · ')));
      li.querySelector('.press__title').textContent = p.title;
      $('hpress').append(li);
    });
  }
})();
