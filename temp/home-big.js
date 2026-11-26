// Test homepage: artist names + latest three posts (the first screen is plain HTML).
(function () {
  const artists = (window.NIKAMMA_ARTISTS || []).slice().sort((a, b) => a.name.localeCompare(b.name));
  const posts = window.NIKAMMA_POSTS || [];

  const list = document.getElementById('hb-names');
  artists.forEach((a) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `artists/${a.slug}/`; link.textContent = a.name;
    li.append(link); list.append(li);
  });

  // latest three posts, same cards as the News page
  const grid = document.getElementById('hb-latest');
  const when = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase();
  const name = (s) => (artists.find((a) => a.slug === s) || {}).name || s;
  posts.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).forEach((p) => {
    const li = document.createElement('li');
    li.innerHTML = '<a class="news2-card"><img alt="" loading="lazy"><p class="news2__date"></p><p class="chips news2__tags"></p><h3 class="news2-card__title"></h3></a>';
    li.querySelector('a').href = `news.html?p=${encodeURIComponent(p.slug)}`;
    li.querySelector('img').src = p.img || 'img/home.jpg';
    li.querySelector('.news2__date').textContent = when(p.date);
    const tags = li.querySelector('.news2__tags');
    if (p.category) { const c = document.createElement('span'); c.className = 'chip chip--accent'; c.textContent = p.category; tags.append(c); }
    (p.artists || []).forEach((s) => { const c = document.createElement('span'); c.className = 'chip'; c.textContent = name(s); tags.append(c); });
    li.querySelector('.news2-card__title').textContent = p.title;
    grid.append(li);
  });
  if (!grid.children.length) grid.closest('section').hidden = true;
})();
