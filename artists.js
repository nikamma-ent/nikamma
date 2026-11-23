// The roster. Edit this file to change artist pages and the Artists list.
//
// spotify: an open.spotify.com link to the release (album, single or playlist)
//          or artist you want in the player. Leave '' if you don't have one yet.
// photo:   path inside img/artists/ (web-sized JPG, ~1500px, under ~400KB)
// credit:  photographer, shown small under the photo. Leave '' to hide.
// links:   shown as small buttons; remove any you don't need.
//
// To add an artist: add an entry here, then copy an existing folder in
// artists/ (e.g. artists/hulo) to artists/<slug>/ and change data-artist
// and the <title> in its index.html.

// The roster playlist for the player bar on the Artists page.
// Make a public playlist in Spotify with songs from every act, then paste its
// link here (Share → Copy link to playlist). Leave '' to fall back to one artist.
window.NIKAMMA_PLAYLIST = '';

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
  },
];
