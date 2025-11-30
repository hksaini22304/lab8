const activityDiv = document.getElementById("activity");
const playlistDiv = document.getElementById("playlist");
const btn = document.getElementById("generateBtn");

btn.addEventListener("click", getPairing);

// Bored API mirror
const BORED_URL = "https://apis.scrimba.com/bored/api/activity";

// Deezer proxy + endpoints 
const DEEZER_PROXY = "https://corsproxy.io/?";
const DEEZER_ARTIST_SEARCH = "https://api.deezer.com/search/artist?q=";

// -----------------------------
// 1) ACTIVITY → VIBE BUCKETS
// -----------------------------

const typeToMusicKeywords = {
  education: [
    "lofi coding",
    "focus",
    "focus beats",
    "deep work",
    "instrumental study",
    "soft piano",
    "ambient concentration",
    "productive indie",
    "classical focus"
  ],

  recreational: [
    "upbeat",
    "summer vibes",
    "feel good pop",
    "indie pop",
    "alt fun",
    "road trip",
    "dance chill",
    "happy acoustic",
    "retro fun"
  ],

  social: [
    "party hits",
    "dance pop",
    "throwbacks",
    "girls night",
    "karaoke pop",
    "club energy",
    "latin party",
    "afrobeats party",
    "r&b slow jams"
  ],

  charity: [
    "uplifting",
    "inspiring acoustic",
    "hopeful pop",
    "soulful gospel",
    "feel good indie",
    "peaceful ambient",
    "heartwarming piano"
  ],

  cooking: [
    "chill kitchen jazz",
    "bossa nova",
    "r&b chill",
    "cafe vibes",
    "italian dinner",
    "soft indie",
    "oldies cooking",
    "funky kitchen",
    "late night snacks"
  ],

  relaxation: [
    "calm ambient",
    "soft piano",
    "mindfulness",
    "spa music",
    "sleepy lo-fi",
    "rainy day",
    "acoustic calm",
    "nature chill",
    "meditation bowls"
  ],

  busywork: [
    "productivity",
    "work music",
    "focus beats",
    "hyperfocus",
    "cleaning groove",
    "motivation pop",
    "energetic indie",
    "study sprint"
  ]
};

// Phrase rules override the type buckets for accuracy
const phraseToKeywordRules = [
  { match: ["website", "blog", "coding", "javascript", "learn"], keyword: "lofi coding" },
  { match: ["woodworking", "woodwork", "diy", "build", "craft"], keyword: "indie folk" },
  { match: ["game night", "friends over", "party", "board game"], keyword: "party hits" },
  { match: ["text a friend", "call a friend", "friendship"], keyword: "feel good pop" },
  { match: ["relax", "self care", "meditate", "calm"], keyword: "calm ambient" },
  { match: ["cook", "bake", "recipe", "meal"], keyword: "chill kitchen jazz" },
  { match: ["workout", "exercise", "fitness"], keyword: "workout energy" },
  { match: ["walk", "hike", "outdoors", "nature"], keyword: "nature chill" },
  { match: ["draw", "paint", "art"], keyword: "soft indie" },
  { match: ["garden", "plants", "pot some plants"], keyword: "calm ambient" },
  { match: ["clean", "organize", "declutter"], keyword: "cleaning groove" }
];

function chooseMusicKeyword(activityText, type) {
  const text = activityText.toLowerCase();

  // 1) phrase rules first
  for (const rule of phraseToKeywordRules) {
    if (rule.match.some(m => text.includes(m))) return rule.keyword;
  }

  // 2) fallback to type buckets
  const options = typeToMusicKeywords[type] || ["chill"];
  return options[Math.floor(Math.random() * options.length)];
}

// -----------------------------
// 2) VIBE → ARTISTS 
// -----------------------------

const vibeArtists = {
  // --- EDUCATION vibes ---
  "lofi coding": ["Lofi Girl", "potsu", "eevee", "Nujabes", "Jinsang", "Kudasai", "idealism"],
  "focus": ["Chillhop Music", "Tycho", "Bonobo", "ODESZA", "Lofi Girl"],
  "focus beats": ["Chillhop Music", "Tycho", "Nujabes", "Jinsang", "Lofi Girl"],
  "deep work": ["Tycho", "Bonobo", "Nils Frahm", "Emancipator"],
  "instrumental study": ["Explosions in the Sky", "This Will Destroy You", "Tycho"],
  "ambient concentration": ["Brian Eno", "Hammock", "Stars of the Lid", "Ólafur Arnalds"],
  "productive indie": ["Dayglow", "Wallows", "Rex Orange County", "LANY"],
  "classical focus": ["Max Richter", "Ludovico Einaudi", "Yiruma", "Ólafur Arnalds"],
  "soft piano": ["Ludovico Einaudi", "Yiruma", "Ólafur Arnalds", "Max Richter"],

  // --- RECREATIONAL vibes ---
  "upbeat": ["Dayglow", "LANY", "Rex Orange County", "Wallows", "Surfaces"],
  "summer vibes": ["Rex Orange County", "Dayglow", "LANY", "Surfaces", "Harry Styles"],
  "feel good pop": ["Dua Lipa", "Harry Styles", "Charlie Puth", "Katy Perry", "Beyoncé"],
  "indie pop": ["Clairo", "Coin", "Wallows", "The 1975"],
  "alt fun": ["Glass Animals", "Hippo Campus", "Cage the Elephant"],
  "road trip": ["Fleetwood Mac", "Tom Petty", "The Lumineers", "Khalid"],
  "dance chill": ["Kaytranada", "Disclosure", "ODESZA"],
  "happy acoustic": ["Jack Johnson", "Jason Mraz", "Vance Joy"],
  "retro fun": ["ABBA", "Earth, Wind & Fire", "Bee Gees"],

  // --- SOCIAL vibes ---
  "party hits": ["David Guetta", "Calvin Harris", "Pitbull", "Rihanna", "The Weeknd"],
  "dance pop": ["Lady Gaga", "Ariana Grande", "Rihanna", "Katy Perry"],
  "throwbacks": ["Usher", "Beyoncé", "Britney Spears", "Ne-Yo", "Destiny’s Child"],
  "girls night": ["Doja Cat", "Nicki Minaj", "Megan Thee Stallion", "SZA"],
  "karaoke pop": ["Taylor Swift", "Olivia Rodrigo", "Adele", "Bruno Mars"],
  "club energy": ["Swedish House Mafia", "Martin Garrix", "Tiesto"],
  "latin party": ["Bad Bunny", "J Balvin", "Karol G", "Daddy Yankee"],
  "afrobeats party": ["Burna Boy", "Wizkid", "Tems", "Davido"],
  "r&b slow jams": ["SZA", "Frank Ocean", "Daniel Caesar", "H.E.R."],

  // --- CHARITY vibes ---
  "uplifting": ["Coldplay", "OneRepublic", "Kygo", "Avicii"],
  "inspiring acoustic": ["Ben Howard", "Vance Joy", "Jack Johnson", "Novo Amor"],
  "hopeful pop": ["Imagine Dragons", "Kelly Clarkson", "Florence + The Machine"],
  "soulful gospel": ["Kirk Franklin", "Tasha Cobbs Leonard", "CeCe Winans"],
  "feel good indie": ["The Paper Kites", "Novo Amor", "The Lumineers"],
  "peaceful ambient": ["Brian Eno", "Hammock", "Tycho"],
  "heartwarming piano": ["Yiruma", "Einaudi", "Max Richter"],

  // --- COOKING vibes ---
  "chill kitchen jazz": ["Cafe Music BGM", "Jazz Vibes", "Bossa Nova Quartet", "Stan Getz"],
  "bossa nova": ["Stan Getz", "João Gilberto", "Antonio Carlos Jobim"],
  "r&b chill": ["SZA", "Daniel Caesar", "H.E.R.", "Frank Ocean"],
  "cafe vibes": ["Norah Jones", "Bill Evans", "Chet Baker"],
  "italian dinner": ["Andrea Bocelli", "Eros Ramazzotti", "Il Volo"],
  "oldies cooking": ["Stevie Wonder", "Marvin Gaye", "The Temptations"],
  "funky kitchen": ["Bruno Mars", "Mark Ronson", "Jamiroquai"],
  "late night snacks": ["The Weeknd", "Drake", "PARTYNEXTDOOR"],

  // --- RELAXATION vibes ---
  "calm ambient": ["Brian Eno", "Hammock", "Stars of the Lid", "Ólafur Arnalds"],
  "mindfulness": ["Hammock", "Tycho", "Ólafur Arnalds"],
  "spa music": ["Liquid Mind", "Deuter", "Enya"],
  "sleepy lo-fi": ["Lofi Girl", "Jinsang", "Kudasai"],
  "rainy day": ["Cigarettes After Sex", "Phoebe Bridgers", "Bon Iver"],
  "acoustic calm": ["Novo Amor", "Ben Howard", "The Paper Kites"],
  "nature chill": ["Tycho", "Explosions in the Sky", "Bonobo"],
  "meditation bowls": ["Tibetan Bowls", "Healing Frequency Music", "Calm Collective"],

  // --- BUSYWORK vibes ---
  "productivity": ["Tycho", "Bonobo", "ODESZA", "Lofi Girl", "Nujabes"],
  "work music": ["Tycho", "Bonobo", "Nujabes", "Jinsang"],
  "hyperfocus": ["Chillhop Music", "Tycho", "Bonobo"],
  "cleaning groove": ["Lizzo", "Bruno Mars", "Dua Lipa"],
  "motivation pop": ["Imagine Dragons", "Ariana Grande", "The Weeknd"],
  "energetic indie": ["Wallows", "Dayglow", "Glass Animals"],
  "study sprint": ["Lofi Girl", "Chillhop Music", "idealism"]
};

// Fallback artists if vibe key is missing
const DEFAULT_ARTISTS = ["Lofi Girl", "Tycho", "Dua Lipa", "Coldplay", "Bon Iver"];

// -----------------------------
// 3) HELPERS FOR DIVERSE PLAYLIST
// -----------------------------

function pickRandomArtists(list, n = 5) {
  const copy = [...list];
  const picked = [];
  while (copy.length && picked.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(i, 1)[0]);
  }
  return picked;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Use corsproxy.io: https://corsproxy.io/?https://api.deezer.com/...
async function getArtistIdByName(name) {
  const target = `${DEEZER_ARTIST_SEARCH}${encodeURIComponent(name)}`;
  const proxied = `${DEEZER_PROXY}${target}`;

  const res = await fetch(proxied);
  const data = await res.json();

  return data.data && data.data[0] ? data.data[0].id : null;
}

async function getTopTracksByArtistId(artistId, limit = 1) {
  const target = `https://api.deezer.com/artist/${artistId}/top?limit=${limit}`;
  const proxied = `${DEEZER_PROXY}${target}`;

  const res = await fetch(proxied);
  const data = await res.json();

  return data.data || [];
}

// DIVERSE PLAYLIST:
// 5 artists from same vibe, 1 top track each
async function fetchDeezerPlaylistForVibe(vibe) {
  const pool = vibeArtists[vibe] || DEFAULT_ARTISTS;
  const chosenArtists = pickRandomArtists(pool, 5);

  let tracks = [];
  let artistsUsed = [];

  for (const artistName of chosenArtists) {
    const id = await getArtistIdByName(artistName);
    if (!id) continue;

    artistsUsed.push(artistName);
    const topTrack = await getTopTracksByArtistId(id, 1);
    tracks = tracks.concat(topTrack);
  }

  // remove duplicate tracks
  const uniqueTracks = [];
  const seenIds = new Set();
  for (const t of tracks) {
    if (!seenIds.has(t.id)) {
      uniqueTracks.push(t);
      seenIds.add(t.id);
    }
  }

  return {
    tracks: shuffleArray(uniqueTracks),
    artistsUsed
  };
}

// -----------------------------
// 4) RENDER PLAYLIST
// -----------------------------

function renderPlaylist(tracks, vibe, artistsUsed) {
  if (!tracks.length) {
    playlistDiv.innerHTML = `<p>No tracks found for this vibe. Try again.</p>`;
    return;
  }

  const listItems = tracks.map(track => {
    const preview = track.preview
      ? `<audio controls src="${track.preview}"></audio>`
      : `<p class="label">No preview available</p>`;

    return `
      <li class="track">
        <p><strong>${track.title}</strong></p>
        <p class="label">Artist: ${track.artist.name}</p>
        ${preview}
      </li>
    `;
  }).join("");

  playlistDiv.innerHTML = `
    <p class="label">Vibe: <strong>${vibe}</strong></p>
    <p class="label">Artists mixed: <strong>${artistsUsed.join(", ")}</strong></p>
    <ul class="playlist">${listItems}</ul>
    <span class="badge">Mini-Playlist 🎶</span>
  `;
}

//------------------------------
// 6) INDEXEDDB: SAVE / LOAD LAST PAIRING
//------------------------------

const DB_NAME = "mashupDB";
const DB_VERSION = 1;
const STORE_NAME = "pairings";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveLastPairing(activityData, playlistData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.put({
      id: "last", 
      activityData, 
      playlistData
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}


// -----------------------------
// 5) MAIN FLOW
// -----------------------------

async function getPairing() {
  activityDiv.innerHTML = "Loading activity...";
  playlistDiv.innerHTML = "Loading playlist...";

  try {
    //  Fetch activity
    const activityRes = await fetch(BORED_URL);
    const activityData = await activityRes.json();

    const activityText = activityData.activity;
    const type = activityData.type;

    activityDiv.innerHTML = `
      <p><strong>${activityText}</strong></p>
      <p class="label">Type: ${type}</p>
      <p class="label">Participants: ${activityData.participants}</p>
      <span class="badge">New Activity ✨</span>
    `;

    //  Choose vibe from buckets
    const vibe = chooseMusicKeyword(activityText, type);

    //  Get diverse playlist for that vibe
    const { tracks, artistsUsed } = await fetchDeezerPlaylistForVibe(vibe);

    renderPlaylist(tracks, vibe, artistsUsed);

  } catch (err) {
    activityDiv.innerHTML = "Failed to load activity.";
    playlistDiv.innerHTML = "Failed to load playlist.";
    console.error(err);
  }
}

// Auto-load once on start
getPairing();
