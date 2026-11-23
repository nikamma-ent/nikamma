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
// photo:      file in img/artists/ (web-sized JPG, ~1500px, under ~400KB).
// credit:     photographer of that photo. '' hides it.
// links:      social / streaming buttons next to the name.
// bandsintown:
//   artist:   the artist's name exactly as on Bandsintown (or 'id_12345' for their id).
//   appId:    optional key from Bandsintown for Artists → Settings → API. With a key the
//             dates show in our own minimal style; without one, Bandsintown's widget is used.
//             Either way, dates update by themselves whenever they change on Bandsintown.
//   Tip: add ?sample-tour to a page address to preview the widget with sample dates.
// live:       photos from shows: { src: 'img/live/…', caption: 'venue, city year' }.
// video:      the featured YouTube video, full width at the end of the page:
//             { id: 'the part after watch?v=', title: '…' }. Leave it out to hide it.
//             "more videos" next to it links to the YouTube in links.
// store:      merch from shops other than Bandcamp: { title, where, note, url, img }.
//             where is the shop (shown as the yellow chip); img is optional.
//             The store shows 4 cards: Bandcamp merch, these, then Bandcamp albums.
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
    bandsintown: { artist: 'id_15574558', appId: '' }, // bandsintown.com/a/15574558-hulo
    live: [
      { src: 'img/live/hulo/g5a-bw.jpg', caption: 'The G5A Foundation, Mumbai 2025' },
      { src: 'img/live/hulo/casa-bacardi-kolkata.jpg', caption: 'Casa Bacardi, Kolkata 2025' },
      { src: 'img/live/hulo/g5a-teal.jpg', caption: 'The G5A Foundation, Mumbai 2025' },
      { src: 'img/live/hulo/antisocial-mumbai.jpg', caption: 'antiSOCIAL, Mumbai 2025' },
      { src: 'img/live/hulo/hamilton-bangalore.jpg', caption: 'Hamilton Bar, Bangalore 2025' },
    ],
    video: { id: 'A-EqlcvPvZE', title: 'Griefcase' },
    store: [
      { title: 'Griefcase', where: 'bandcamp', note: 'debut album', url: 'https://hulo.bandcamp.com', img: 'img/store/hulo-griefcase.jpg' },
    ],
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
    spotify: 'https://open.spotify.com/album/4C6Cgfuc0ZjnEMV76tnyUK',
    links: {
      Spotify: 'https://open.spotify.com/artist/0OxO7c4K0ozx5CTPDhFOXO',
      'Apple Music': 'https://music.apple.com/in/artist/shashwat-bulusu/1457492073',
      Instagram: 'https://www.instagram.com/bullu.frog',
      YouTube: 'https://youtube.com/@shashwatbulusu',
      Bandcamp: 'https://shashwatbulusu.bandcamp.com/music',
      'Pinocchio ↗': 'https://pinocchio.nikamma.co',
    },
    bandsintown: { artist: 'id_15507468', appId: '' }, // bandsintown.com/a/15507468-shashwat-bulusu
    live: [],
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
    bandsintown: { artist: 'id_15664566', appId: '' }, // bandsintown.com/a/15664566-begum
    live: [],
    store: [
      { title: 'We Are Okay! tour tee', where: 'begumdarbaar.com', note: 'pre-order, pick up at the show', url: 'https://begumdarbaar.com', img: 'img/store/begum-tour-tee.jpg' },
      { title: 'AMFS tee', where: 'begumdarbaar.com', note: 'pre-order, pick up at the show', url: 'https://begumdarbaar.com', img: 'img/store/begum-amfs-tee.jpg' },
    ],
  },
];
