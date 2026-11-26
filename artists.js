// The roster. Edit this file to change artist pages and the Artists list.
//
// Each artist page has: bio · tracks · tour dates · live · store, then one video at the end.
// A section only appears if it has something in it.
//
// spotify:    open.spotify.com link (album, single, playlist or artist) for the player.
// bio:        fallback bio, used only if there's no bioDoc (or it can't be read).
// bioDoc:     Google Doc with the bio (shared: anyone with the link can view). The
//             part under the heading "Short" is used, refreshed on the 1st of
//             every month (tools/sync_bios.py → bios.js).
// hero:       optional wider photo for the top of the artist page;
//             landscape, ideally 3:2 at 2400 × 1600. Falls back to photo.
// photo:      file in img/artists/ (web-sized JPG, ~1500px, under ~400KB).
// credit:     photographer of that photo. '' hides it.
// links:      social / streaming buttons next to the name.
// bandsintown:
//   artist:   the artist's name exactly as on Bandsintown (or 'id_12345' for their id).
//   appId:    optional key from Bandsintown for Artists → Settings → API. With a key the
//             dates show in our own minimal style; without one, Bandsintown's widget is used.
//             Either way, dates update by themselves whenever they change on Bandsintown.
//   Tip: add ?sample-tour to a page address to preview the widget with sample dates.
// ticker:     optional lines for this artist's own ticker (under the bio):
//             [{ text: '…', link: '…' }]. It also picks up site news that names them,
//             their latest release, press and video by itself.
// press:      daily Google News search (tools/sync_press.py → press.js); the newest 3
//             articles show on the page. query: what to search; names: a headline
//             must mention one; also: …and one of these words; exclude: skip these;
//             pin: articles to always show first, in this order:
//               { outlet, title, url, date: 'YYYY-MM-DD' (optional) }
//             hide: article links never to show.
// live:       photos from shows: { src: 'img/live/…', caption: 'venue, city year' }.
// video:      the featured YouTube video, full width at the end of the page:
//             { id: 'the part after watch?v=', title: '…' }. Leave it out to hide it.
//             "more videos" next to it links to the YouTube in links.
// bandcampSingles: false → the store leaves out Bandcamp singles (albums/EPs only).
// store:      merch from shops other than Bandcamp: { title, where, note, url, img }.
//             where is the shop (shown as the yellow chip); img is optional.
//             The store shows 3 cards: Bandcamp merch, these, then Bandcamp albums.
//             "more in the store" goes to storeUrl if set, else the first shop here
//             that isn't Bandcamp, else their Bandcamp.
//             Bandcamp merch and albums are added by themselves every day
//             (tools/sync_bandcamp.py → merch.js), so don't list Bandcamp things here.
//
// To add an artist: add an entry here, then copy an existing folder in
// artists/ (e.g. artists/hulo) to artists/<slug>/ and change data-artist
// and the <title> in its index.html.

window.NIKAMMA_ARTISTS = [
  {
    slug: 'hulo',
    name: 'Hulo',
    meta: 'Singer-songwriter · Calcutta',
    bio: 'Raw, intimate songs about love, loss and identity, carried by shimmering guitars and the textures of modern pop. Debut album Griefcase is out now; 50+ shows across India and Europe and counting.',
    latest: 'Griefcase',
    photo: 'hulo.jpg',
    hero: 'hulo-nkm-hero.jpg',   // big photo at the top of the artist page (test design)
    credit: 'Ankan Sarkar',
    bioDoc: 'https://docs.google.com/document/d/1bPOp2xt4cxbg4x8TUjVE0Jh8fdBW2Q1jxbyrfLt5w5Q/edit',
    spotify: 'https://open.spotify.com/artist/0VmqJsRLRKbPBh9ZgnBzdB',
    links: {
      Spotify: 'https://open.spotify.com/artist/0VmqJsRLRKbPBh9ZgnBzdB',
      'Apple Music': 'https://music.apple.com/in/artist/hulo/1756067591',
      Instagram: 'https://www.instagram.com/adityahulo/',
      YouTube: 'https://www.youtube.com/@adityahulo',
      Bandcamp: 'https://hulo.bandcamp.com',
    },
    press: {
      query: '"Hulo" (song OR album OR singer OR Griefcase OR Kolkata) OR "Aditya Majumdar"',
      names: ['Hulo', 'Aditya Majumdar', 'Griefcase'],
      exclude: ['DNA Music', 'Chiquerella'],
      pin: [
        { outlet: 'Platform', title: 'A conversation with indie singer-songwriter Hulo on his debut album, life between Kolkata and Berlin', url: 'https://www.platform-mag.com/music/guitars-griefcases-and-growing-up-hulo.html' },
      ],
    },
    bandsintown: { artist: 'id_15574558', appId: '' }, // bandsintown.com/a/15574558-hulo
    live: [
      { src: 'img/live/hulo/mumbai-sopan-borkar-1.jpg' },
      { src: 'img/live/hulo/bangalore-anush-shetty.jpg' },
      { src: 'img/live/hulo/mumbai-sopan-borkar-2.jpg' },
      { src: 'img/live/hulo/annweshan-priyam.jpg' },
      { src: 'img/live/hulo/mumbai-sopan-borkar-3.jpg' },
    ],
    video: { id: 'A-EqlcvPvZE', title: 'Griefcase' },
    store: [],
  },
  {
    slug: 'shashwat-bulusu',
    name: 'Shashwat Bulusu',
    meta: 'Songwriter',
    bio: 'New album Pinocchio is out now. Confess, paint and pick your track over at pinocchio.nikamma.co.',
    latest: 'Pinocchio',
    photo: 'shashwat-bulusu.jpg',
    credit: 'Krish Wadhwa',
    bioDoc: 'https://docs.google.com/document/d/1wrIakRF5feU7GN-zbDvywmvTllz_BEr2yVbD6fkzPY4/edit',
    spotify: 'https://open.spotify.com/artist/0OxO7c4K0ozx5CTPDhFOXO',   // his top tracks
    bandcampSingles: false,   // store: albums and EPs only, no singles
    links: {
      Spotify: 'https://open.spotify.com/artist/0OxO7c4K0ozx5CTPDhFOXO',
      'Apple Music': 'https://music.apple.com/in/artist/shashwat-bulusu/1457492073',
      Instagram: 'https://www.instagram.com/bullu.frog',
      YouTube: 'https://youtube.com/@shashwatbulusu',
      Bandcamp: 'https://shashwatbulusu.bandcamp.com/music',
    },
    press: {
      query: '"Shashwat Bulusu"',
      names: ['Shashwat Bulusu', 'Bulusu'],
      pin: [
        { outlet: 'Wild City', date: '2026-09-02', title: "Shashwat Bulusu Unpacks Abuse, Self-Harm And Compulsive Lying On 'Pinocchio'", url: 'https://www.thewildcity.com/news/21808-shashwat-bulusu-unpacks-abuse-self-harm-and-compulsive-lying-on-pinocchio' },
        { outlet: 'Homegrown', date: '2026-08-27', title: "Shashwat Bulusu's Latest Album, 'Pinocchio', Wants To Make You Uncomfortable", url: 'https://homegrown.co.in/homegrown-creators/shashwat-bulusus-latest-album-pinocchio-wants-to-make-you-uncomfortable' },
        { outlet: 'The Indian Music Diaries', date: '2026-09-19', title: "From Folk to Dissonant Electronica: Shashwat Bulusu's Sonic Confessions in 'Pinocchio'", url: 'https://theindianmusicdiaries.com/from-folk-to-dissonant-electronica-shashwat-bulusus-sonic-confessions-in-pinocchio/' },
      ],
    },
    bandsintown: { artist: 'id_15507468', appId: '' }, // bandsintown.com/a/15507468-shashwat-bulusu
    live: [
      { src: 'img/live/shashwat-bulusu/mumbai-krish-wadhwa-1.jpg' },
      { src: 'img/live/shashwat-bulusu/live-002.jpg' },
      { src: 'img/live/shashwat-bulusu/mumbai-krish-wadhwa-2.jpg' },
      { src: 'img/live/shashwat-bulusu/live-009.jpg' },
    ],
    store: [],
  },
  {
    slug: 'begum',
    name: 'Begum',
    meta: 'Band · Delhi / Goa',
    bio: 'Delhi-bred, Goa-based trio making alternative, post-punk-leaning records: Bagh, We Are Excited and Are you ok?. Now on the We Are Okay! Tour.',
    latest: 'We Are Okay! Tour',
    photo: 'begum.jpg',
    credit: '',
    bioDoc: 'https://docs.google.com/document/d/1GllctKWiAUX0NmC_XU0HO0rA2HqAiZasdBUNdI5brGs/edit',
    spotify: '', // TODO: add Begum's Spotify link
    links: {
      Bandcamp: 'https://begum.bandcamp.com',
    },
    press: {
      query: '"Begum" band (Goa OR Delhi OR album OR trio)',
      names: ['Begum'],
      also: ['band', 'trio', 'album', 'single', 'are you ok', 'bagh', 'we are excited', 'better person', 'tour', 'gig', 'music'],
      pin: [
        { outlet: 'Musicplus', date: '2026-09-15', title: 'Begum announce four-city India tour after three-year hiatus', url: 'https://www.musicplus.in/begum-announce-four-city-india-tour-after-three-year-hiatus/' },
      ],
    },
    bandsintown: { artist: 'id_15664566', appId: '' }, // bandsintown.com/a/15664566-begum
    live: [],
    store: [
      { title: 'We Are Okay! tour tee', where: 'begumdarbaar.com', note: 'pre-order, pick up at the show', url: 'https://begumdarbaar.com', img: 'img/store/begum-tour-tee.jpg' },
      { title: 'AMFS tee', where: 'begumdarbaar.com', note: 'pre-order, pick up at the show', url: 'https://begumdarbaar.com', img: 'img/store/begum-amfs-tee.jpg' },
    ],
  },
];
