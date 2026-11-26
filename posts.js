// News: everything we publish. Newest first.
// Each post gets its own page at news.html?p=<slug>, shows on the News page,
// and on the artist pages of the artists it's tagged with.
//
// slug:     short id for the address (letters, numbers, dashes)
// date:     'YYYY-MM-DD'
// title:    headline
// artists:  slugs of the artists it's about, e.g. ['begum'] (shown as tags)
// category: one word tag, e.g. 'live', 'release', 'announcement'
// img:      photo, ideally in img/news/ (landscape works best)
// body:     paragraphs, in order
// links:    optional buttons under the text: [{ label, url }]
// list:     optional box on the right, e.g. tour dates: { title, items: [...] }
window.NIKAMMA_POSTS = [
  {
    "slug": "begum-we-are-okay-tour",
    "date": "2026-09-15",
    "title": "Begum Announce We Are Okay! Tour, Marking Their Return After Three Years",
    "artists": [
      "begum"
    ],
    "category": "live",
    "img": "img/news/begum-we-are-okay-tour.jpg",
    "body": [
      "Indie cult classic Begum have announced a four-city India tour, marking their return after a three-year hiatus.",
      "The We Are Okay! Tour will take Begum to Delhi, Goa, Mumbai, and Bengaluru, bringing the band back to the cities and audiences that have been waiting for their return.",
      "Over the last three years, while Begum have been away from the live circuit, their music has continued to find its way to listeners. The audiences who have stayed with the band’s music through their hiatus have grown alongside a completely new generation discovering Begum for the first time.",
      "Initially formed as an exercise in allowing lyrics and sonics to spill out without second thoughts, Begum’s music has evolved considerably over almost a decade, while remaining rooted in the same instinctive approach. Their sound sits somewhere between a subconscious revelation of internalised pop music tropes and a resolve to find comfort in presenting the uncomfortable.",
      "Begum’s music has developed into a signature that has made them a quintessential “band’s band” — the kind of music that makes other musicians wonder, “why didn’t I think of that?”, while drawing new listeners into a world they instinctively connect with, even if they can’t quite explain why.",
      "We Are Okay! marks the beginning of this next chapter, a return to the stage after an extended pause and the first opportunity for audiences across four cities to experience Begum’s new iteration live."
    ],
    "list": {
      "title": "We Are Okay! Tour",
      "items": [
        "9th October — New Delhi",
        "10th October — Goa",
        "15th October — Mumbai",
        "16th October — Bengaluru"
      ]
    }
  },
  {
    "slug": "shashwat-bulusu-pinocchio-out-now",
    "date": "2026-08-21",
    "title": "Pinocchio Out Now!",
    "artists": [
      "shashwat-bulusu"
    ],
    "category": "release",
    "img": "https://f4.bcbits.com/img/a1621554334_10.jpg",
    "body": [
      "Shashwat Bulusu’s second album, Pinocchio, is out now: a bittersweet autobiography disguised as the story of Pinocchio.",
      "Twelve songs written over more than a decade, following his acclaimed debut Fitrat. Rather than retelling the fairy tale, Bulusu uses it to work through surviving abuse, self-harm, compulsive lying and narcissism in real time, and to ask what it takes to become human.",
      "Shimmering guitars, electronic textures and intimate songwriting sit side by side, in a record that doesn’t promise the wounds disappear but learns to live beside them. The album comes with artwork painted by Bulusu himself and a self-published companion book of essays, illustrations and lyrics. Listening sessions across India and a national tour follow later this year."
    ],
    "links": [
      { "label": "stream pinocchio", "url": "https://shashwatbulusu.bandcamp.com/album/pinocchio" }
    ],
    "list": {
      "title": "Pinocchio",
      "items": [
        "Out 21 August 2026",
        "Produced by Shashwat Bulusu, Ritwik De and Amar Pandey",
        "Mixed and mastered by Jonathan Anderson at Protection Island, Vancouver"
      ]
    }
  }
];
