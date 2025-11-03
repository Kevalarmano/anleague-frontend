// src/lib/players.js

// Basic name pools (kept generic to avoid extra APIs)
const GK_NAMES = [
  "A. Kamara", "J. Mensah", "D. Ahmed", "M. Okoye", "S. Ndidi", "B. Traoré"
];
const DF_NAMES = [
  "K. Koulibaly", "A. Gabr", "O. Aguerd", "S. Hlatshwayo", "T. Tomori", "M. Mendy",
  "L. Jallow", "K. Rahman", "H. Aina", "B. Bensebaini", "M. Hegazi", "S. Sanusi"
];
const MD_NAMES = [
  "T. Partey", "N. Keïta", "Y. Bissouma", "H. Fofana", "A. Onana", "I. Sangaré",
  "M. Elneny", "H. Fathi", "Z. Jaziri", "W. Ndidi", "R. Mahrez", "H. Ziyech"
];
const AT_NAMES = [
  "M. Salah", "S. Mané", "V. Osimhen", "P. Aubameyang", "R. Ihenacho", "Y. En-Nesyri",
  "B. Dia", "T. Moffi", "T. Tavares", "A. Lookman"
];

// Helper: random integer inclusive
function randi(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate role-focused skill set (0–100)
function positionRatings(primary) {
  // Base windows by primary position (kept realistic)
  const bases = {
    GK: { GK: randi(70, 92), DF: randi(20, 45), MD: randi(15, 35), AT: randi(10, 25) },
    DF: { GK: randi(10, 25), DF: randi(68, 90), MD: randi(45, 70), AT: randi(20, 45) },
    MD: { GK: randi(10, 25), DF: randi(45, 70), MD: randi(68, 90), AT: randi(45, 72) },
    AT: { GK: randi(10, 25), DF: randi(20, 45), MD: randi(50, 72), AT: randi(70, 93) },
  };
  return bases[primary];
}

// Make a single player object
function makePlayer(name, pos, isCaptain = false) {
  return {
    name,
    position: pos,                       // "GK" | "DF" | "MD" | "AT"
    rating: positionRatings(pos),        // { GK, DF, MD, AT }
    isCaptain,
  };
}

// Compute a team rating from the squad
// We take each player's best-suited rating (by their primary position) and average.
export function computeTeamRating(players) {
  if (!players || players.length === 0) return 60;
  const byPrimary = players.map(p => p.rating[p.position]);
  const avg = byPrimary.reduce((a, b) => a + b, 0) / byPrimary.length;
  // Clamp to 50–95 for sanity
  return Math.max(50, Math.min(95, Math.round(avg)));
}

// Generate a 23-man squad: 3 GK, 8 DF, 8 MD, 4 AT
// You can pass an optional captainName; otherwise we pick one of the attackers/mids.
export function generateSquad(captainName) {
  // Shuffle helpers
  const pick = (arr, n) => {
    const a = [...arr];
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(a.splice(randi(0, a.length - 1), 1)[0]);
      if (a.length === 0) a.push(...arr); // recycle if we run out
    }
    return out;
  };

  const gks = pick(GK_NAMES, 3).map(n => makePlayer(n, "GK"));
  const dfs = pick(DF_NAMES, 8).map(n => makePlayer(n, "DF"));
  const mds = pick(MD_NAMES, 8).map(n => makePlayer(n, "MD"));
  const ats = pick(AT_NAMES, 4).map(n => makePlayer(n, "AT"));

  let players = [...gks, ...dfs, ...mds, ...ats];

  // Choose a captain
  if (captainName) {
    // Try to mark the given captain if present; otherwise just set first MF/AT as captain
    const idx = players.findIndex(p => p.name === captainName);
    if (idx >= 0) players[idx].isCaptain = true;
    else {
      const idx2 = players.findIndex(p => p.position === "AT") >= 0
        ? players.findIndex(p => p.position === "AT")
        : players.findIndex(p => p.position === "MD");
      if (idx2 >= 0) players[idx2].isCaptain = true;
      else players[0].isCaptain = true;
    }
  } else {
    const idx = players.findIndex(p => p.position === "AT");
    (idx >= 0 ? players[idx] : players[0]).isCaptain = true;
  }

  return players;
}
