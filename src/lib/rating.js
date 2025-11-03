// src/lib/rating.js
// Generates 23 realistic players with position-specific ratings and captain selection.

const GK_NAMES = [
  "A. Kamara", "J. Mensah", "D. Ahmed", "M. Okoye", "S. Ndidi", "B. Traoré",
];
const DF_NAMES = [
  "K. Koulibaly", "A. Gabr", "O. Aguerd", "S. Hlatshwayo", "T. Tomori", "M. Mendy",
  "L. Jallow", "K. Rahman", "H. Aina", "B. Bensebaini", "M. Hegazi", "S. Sanusi",
];
const MD_NAMES = [
  "T. Partey", "N. Keïta", "Y. Bissouma", "H. Fofana", "A. Onana", "I. Sangaré",
  "M. Elneny", "H. Fathi", "Z. Jaziri", "W. Ndidi", "R. Mahrez", "H. Ziyech",
];
const AT_NAMES = [
  "M. Salah", "S. Mané", "V. Osimhen", "P. Aubameyang", "K. Iheanacho",
  "Y. En-Nesyri", "B. Dia", "T. Moffi", "A. Lookman", "T. Tavares",
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function positionRatings(primary) {
  const bases = {
    GK: { GK: rand(70, 92), DF: rand(20, 45), MD: rand(15, 35), AT: rand(10, 25) },
    DF: { GK: rand(10, 25), DF: rand(68, 90), MD: rand(45, 70), AT: rand(20, 45) },
    MD: { GK: rand(10, 25), DF: rand(45, 70), MD: rand(68, 90), AT: rand(45, 72) },
    AT: { GK: rand(10, 25), DF: rand(20, 45), MD: rand(50, 72), AT: rand(70, 93) },
  };
  return bases[primary];
}

function makePlayer(name, pos, isCaptain = false) {
  return {
    name,
    position: pos,
    rating: positionRatings(pos),
    isCaptain,
  };
}

function pick(arr, n) {
  const src = [...arr];
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(src.splice(rand(0, src.length - 1), 1)[0]);
    if (src.length === 0) src.push(...arr);
  }
  return out;
}

export function generatePlayers(country) {
  const gks = pick(GK_NAMES, 3).map((n) => makePlayer(n, "GK"));
  const dfs = pick(DF_NAMES, 8).map((n) => makePlayer(n, "DF"));
  const mds = pick(MD_NAMES, 8).map((n) => makePlayer(n, "MD"));
  const ats = pick(AT_NAMES, 4).map((n) => makePlayer(n, "AT"));

  const players = [...gks, ...dfs, ...mds, ...ats];

  // Choose a captain (usually an attacker or midfielder)
  const capIdx =
    players.findIndex((p) => p.position === "AT") >= 0
      ? players.findIndex((p) => p.position === "AT")
      : players.findIndex((p) => p.position === "MD");
  if (capIdx >= 0) players[capIdx].isCaptain = true;
  else players[0].isCaptain = true;

  return players;
}

export function calculateTeamRating(players) {
  if (!players || players.length === 0) return 60;
  const primaryScores = players.map((p) => p.rating[p.position]);
  const avg = primaryScores.reduce((a, b) => a + b, 0) / primaryScores.length;
  return Math.max(50, Math.min(95, Math.round(avg)));
}
