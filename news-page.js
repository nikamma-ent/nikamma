// News page: a grid of posts, or one post when the address has ?p=<slug>. Data: posts.js
(function () {
  const posts = window.NIKAMMA_POSTS || [];
  const artists = window.NIKAMMA_ARTISTS || [];
  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const when = (d) => (d ? fmt.format(new Date(d)) : '');
  const slug = new URLSearchParams(location.search).get('p');
  const post = slug && posts.find((p) => p.slug === slug);

  if (!post) {
    // the list
    $('news-list').hidden = false;
    posts.forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = '<a class="news2-card"><img alt="" loading="lazy"><p class="news2__date"></p><h2 class="news2-card__title"></h2></a>';
      li.querySelector('a').href = `news.html?p=${encodeURIComponent(p.slug)}`;
      li.querySelector('img').src = p.img || 'img/home.jpg';
      li.querySelector('.news2__date').textContent = when(p.date);
      li.querySelector('h2').textContent = p.title;
      $('news-grid').append(li);
    });
    if (!posts.length) $('news-grid').innerHTML = '<li class="news2__empty">nothing yet.</li>';
    return;
  }

  // one post
  document.title = `${post.title} · nikamma`;
  $('news-post').hidden = false;
  $('post-date').textContent = when(post.date);
  $('post-title').textContent = post.title;
  $('post-img').src = post.img || 'img/home.jpg';
  $('post-body').replaceChildren(...(post.body || []).map((t) => { const p = document.createElement('p'); p.textContent = t; return p; }));

  const side = $('post-side');
  if (post.list && (post.list.items || []).length) {
    const box = document.createElement('div');
    box.innerHTML = '<h2></h2><ul></ul>';
    box.querySelector('h2').textContent = post.list.title || '';
    post.list.items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; box.querySelector('ul').append(li); });
    side.append(box);
  }
  const tagged = (post.artists || []).map((s) => artists.find((a) => a.slug === s)).filter(Boolean);
  if (tagged.length) {
    const box = document.createElement('div');
    box.innerHTML = '<h2>artist</h2><ul></ul>';
    tagged.forEach((a) => {
      const li = document.createElement('li'); const l = document.createElement('a');
      l.href = `artists/${a.slug}/`; l.textContent = `${a.name} →`; l.className = 'news2__more';
      li.append(l); box.querySelector('ul').append(li);
    });
    side.append(box);
  }
  const back = document.createElement('div');
  back.innerHTML = '<a class="news2__more" href="news.html">← all news</a>';
  side.append(back);
})();
