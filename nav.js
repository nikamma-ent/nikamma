// Phones: hamburger on the left of the nav bar opens a full-screen black menu with the same links,
// plus follow us and the mailing list at the bottom right.
// Works on every page: it copies the links from the page's own <nav class="top__nav">.
(function () {
  const top = document.querySelector('.top');
  const nav = top && top.querySelector('.top__nav');
  if (!nav) return;
  const logoLink = top.querySelector('.top__logo');
  const logo = logoLink && logoLink.querySelector('img');

  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'navx__btn';
  btn.setAttribute('aria-label', 'Open menu'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'navx');
  btn.innerHTML = '<span class="navx__burger" aria-hidden="true"><i></i><i></i><i></i></span>';
  top.prepend(btn);

  const ICON = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r=".7" fill="currentColor" stroke="none"/></svg>',
    spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.4 9.8c3.3-.9 6.8-.5 9.4 1M7.9 12.7c2.7-.7 5.5-.4 7.8.9M8.5 15.4c2.1-.5 4.1-.3 5.9.7"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="M4 7l8 6 8-6"/></svg>',
  };

  const menu = document.createElement('div');
  menu.className = 'navx'; menu.id = 'navx';
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Menu');
  menu.innerHTML = `
    <div class="navx__head">
      <button type="button" class="navx__close" aria-label="Close menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 3.5l17 17M20.5 3.5l-17 17"/></svg></button>
    </div>
    <nav class="navx__links" aria-label="Menu"></nav>
    <div class="navx__foot">
      <div>
        <p class="navx__label">follow us</p>
        <div class="navx__social">
          <a href="https://www.instagram.com/nikamma.hq/" target="_blank" rel="noopener" aria-label="Instagram">${ICON.instagram}</a>
          <a href="https://open.spotify.com/user/31zuv35stp57j7e33lh7fj5aghoi" target="_blank" rel="noopener" aria-label="Spotify">${ICON.spotify}</a>
          <a href="mailto:office@nikamma.co" aria-label="Email">${ICON.email}</a>
        </div>
      </div>
      <form class="navx__list" action="https://app.kit.com/forms/10248609/subscriptions" method="post" target="_blank">
        <p class="navx__label">join the mailing list</p>
        <div class="navx__row">
          <label class="navx__sr" for="navx-email">email address</label>
          <input id="navx-email" name="email_address" type="email" placeholder="your email" autocomplete="email" required>
          <button type="submit">join</button>
        </div>
        <p class="navx__note" aria-live="polite"></p>
      </form>
    </div>`;
  const head = menu.querySelector('.navx__head');
  if (logo) {
    const a = document.createElement('a'); a.href = logoLink.getAttribute('href'); a.setAttribute('aria-label', 'nikamma, home');
    const im = logo.cloneNode(); im.src = logo.src.replace(/mark\.png(\?.*)?$/, 'mark-white.png'); im.removeAttribute('style');
    a.append(im); head.append(a);
  }
  const links = menu.querySelector('.navx__links');
  nav.querySelectorAll('a').forEach((a) => {
    const c = document.createElement('a'); c.href = a.getAttribute('href'); c.textContent = a.textContent.trim().toLowerCase();
    if (a.getAttribute('aria-current')) c.setAttribute('aria-current', a.getAttribute('aria-current'));
    links.append(c);
  });
  document.body.append(menu);

  // keep ✕ and the monkey exactly where ☰ and the monkey are (under the ticker, if it's on screen)
  const place = () => {
    const r = top.getBoundingClientRect();
    menu.style.setProperty('--navx-top', `${Math.max(0, Math.round(r.top))}px`);
    menu.style.setProperty('--navx-h', `${Math.round(r.height)}px`);
  };

  const close = menu.querySelector('.navx__close');
  const open = () => {
    place();
    menu.classList.add('is-open'); document.body.classList.add('navx-lock');
    btn.setAttribute('aria-expanded', 'true'); close.focus({ preventScroll: true });
  };
  const shut = () => {
    menu.classList.remove('is-open'); document.body.classList.remove('navx-lock');
    btn.setAttribute('aria-expanded', 'false'); btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', open);
  close.addEventListener('click', shut);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) shut(); });
  window.addEventListener('resize', () => { if (menu.classList.contains('is-open')) place(); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => { if (e.matches && menu.classList.contains('is-open')) shut(); });

  // mailing list (Kit form 10248609): send without leaving the page; plain post if that can't connect
  const form = menu.querySelector('.navx__list');
  const note = form.querySelector('.navx__note');
  const join = form.querySelector('button');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    join.disabled = true; note.textContent = 'joining…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status === 'failed') throw new Error('failed');
      form.classList.add('is-done');
      note.textContent = 'we promise to not spam you!';
    } catch (err) {
      join.disabled = false;
      if (err instanceof TypeError) { note.textContent = ''; form.submit(); return; }
      note.textContent = "that didn't work. check the email and try again.";
    }
  });
})();
