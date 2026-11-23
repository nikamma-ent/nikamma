// The roster. Edit this file to change artist pages and the Artists list.
//
// Each artist page has: bio · tracks · tour dates · live · store, then one video at the end.
// A section only appears if it has something in it.
//
// spotify:    open.spotify.com link (album, single, playlist or artist) for the player.
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
// store:      { title, note, url, img } cards; img is optional.
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
    spotify: 'https://open.spotify.com/artist/0VmqJsRLRKbPBh9ZgnBzdB',
    links: {
      Spotify: 'https://open.spotify.com/artist/0VmqJsRLRKbPBh9ZgnBzdB',
      'Apple Music': 'https://music.apple.com/in/artist/hulo/1756067591',
      Instagram: 'https://www.instagram.com/adityahulo/',
      YouTube: 'https://www.youtube.com/@adityahulo',
      Bandcamp: 'https://hulo.bandcamp.com',
    },
    bandsintown: { artist: 'Hulo', appId: '' },
    live: [
      { src: 'img/live/hulo/g5a-bw.jpg', caption: 'The G5A Foundation, Mumbai 2025' },
      { src: 'img/live/hulo/casa-bacardi-kolkata.jpg', caption: 'Casa Bacardi, Kolkata 2025' },
      { src: 'img/live/hulo/g5a-teal.jpg', caption: 'The G5A Foundation, Mumbai 2025' },
      { src: 'img/live/hulo/antisocial-mumbai.jpg', caption: 'antiSOCIAL, Mumbai 2025' },
      { src: 'img/live/hulo/hamilton-bangalore.jpg', caption: 'Hamilton Bar, Bangalore 2025' },
    ],
    video: { id: 'A-EqlcvPvZE', title: 'Griefcase' },
    store: [
      { title: 'Griefcase', note: 'Debut album · Bandcamp', url: 'https://hulo.bandcamp.com', img: 'img/store/hulo-griefcase.jpg' },
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
    spotify: 'https://open.spotify.com/album/4C6Cgfuc0ZjnEMV76tnyUK',
    links: {
      Spotify: 'https://open.spotify.com/artist/0OxO7c4K0ozx5CTPDhFOXO',
      'Apple Music': 'https://music.apple.com/in/artist/shashwat-bulusu/1457492073',
      Instagram: 'https://www.instagram.com/bullu.frog',
      YouTube: 'https://youtube.com/@shashwatbulusu',
      Bandcamp: 'https://shashwatbulusu.bandcamp.com/music',
      'Pinocchio ↗': 'https://pinocchio.nikamma.co',
    },
    bandsintown: { artist: 'Shashwat Bulusu', appId: '' },
    live: [],
    store: [
      { title: 'Pinocchio', note: 'Album · Bandcamp', url: 'https://shashwatbulusu.bandcamp.com/album/pinocchio', img: 'img/store/pinocchio.jpg' },
    ],
  },
  {
    slug: 'begum',
    name: 'Begum',
    meta: 'Band · Delhi / Goa',
    bio: 'Delhi-bred, Goa-based trio making alternative, post-punk-leaning records: Bagh, We Are Excited and Are you ok?. Now on the We Are Okay! Tour.',
    latest: 'We Are Okay! Tour',
    photo: 'begum.jpg',
    credit: '',
    spotify: '', // TODO: add Begum's Spotify link
    links: {
      Bandcamp: 'https://begum.bandcamp.com',
    },
    bandsintown: { artist: 'Begum', appId: '' },
    live: [],
    store: [
      { title: 'We Are Okay! tour tee', note: 'Pre-order, pick up at the show', url: 'https://begumdarbaar.com', img: 'img/store/begum-tour-tee.jpg' },
      { title: 'AMFS tee', note: 'Pre-order, pick up at the show', url: 'https://begumdarbaar.com', img: 'img/store/begum-amfs-tee.jpg' },
    ],
  },
];
