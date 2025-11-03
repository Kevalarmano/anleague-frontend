// src/lib/simulator.js
import { db, collection, addDoc } from "../firebase";

/**
 * Simulate a full tournament from teams[] and persist:
 * - quarterFinals, semiFinals, final documents
 * Each match doc contains:
 *  { teamA, teamB, scoreA, scoreB, winner, scorers: [{team, player, minute}], simulated: true, createdAt }
 * Returns { winner, runnerUp }
 */
export async function simulateTournament(teams) {
  if (!teams || teams.length < 8) throw new Error("Not enough teams to simulate.");

  // Randomize teams for QF (you can keep your “top 8 by rating” if preferred)
  const shuffled = [...teams].sort(() => Math.random() - 0.5);

  // ---------- QUARTER FINALS ----------
  const qfWinners = [];
  const qfMatches = [];
  for (let i = 0; i < 8; i += 2) {
    const res = playMatch(shuffled[i], shuffled[i + 1]);
    qfWinners.push(res.winnerTeam);
    qfMatches.push(res);
    await writeMatch("quarterFinals", res);
  }

  // ---------- SEMI FINALS ----------
  const sfWinners = [];
  const sfMatches = [];
  for (let i = 0; i < 4; i += 2) {
    const res = playMatch(qfWinners[i], qfWinners[i + 1]);
    sfWinners.push(res.winnerTeam);
    sfMatches.push(res);
    await writeMatch("semiFinals", res);
  }

  // ---------- FINAL ----------
  const finalRes = playMatch(sfWinners[0], sfWinners[1]);
  await writeMatch("final", finalRes);

  const winner = finalRes.winnerTeam;
  const runnerUp = winner.country === finalRes.teamA.country ? finalRes.teamB : finalRes.teamA;

  // Optional: persist champions history
  await addDoc(collection(db, "pastWinners"), {
    champion: winner.country,
    year: new Date().getFullYear(),
  });

  return { winner, runnerUp };
}

/**
 * Simulates a single match: returns an object with scoreline and scorers with minutes.
 */
function playMatch(teamA, teamB) {
  // Bias: higher rating slightly increases expected goals
  const expA = Math.max(0, (teamA?.rating ?? 70) - 60) / 12; // ~0..3
  const expB = Math.max(0, (teamB?.rating ?? 70) - 60) / 12;

  const scoreA = poissonClamp(expA);
  const scoreB = poissonClamp(expB);

  const winnerTeam = scoreA >= scoreB ? teamA : teamB;

  // Build scorer events
  const scorers = [];
  const minutesA = uniqueSortedMinutes(scoreA);
  const minutesB = uniqueSortedMinutes(scoreB);

  for (const m of minutesA) {
    scorers.push({
      team: teamA.country,
      player: pickScorerName(teamA),
      minute: m,
    });
  }
  for (const m of minutesB) {
    scorers.push({
      team: teamB.country,
      player: pickScorerName(teamB),
      minute: m,
    });
  }
  // Show chronologically
  scorers.sort((x, y) => x.minute - y.minute);

  return {
    teamA,
    teamB,
    scoreA,
    scoreB,
    winner: winnerTeam.country,
    winnerTeam,
    scorers,
    simulated: true,
    createdAt: new Date(),
  };
}

/** Persist one match into the stage collection */
async function writeMatch(stage, res) {
  await addDoc(collection(db, stage), {
    teamA: res.teamA.country,
    teamB: res.teamB.country,
    scoreA: res.scoreA,
    scoreB: res.scoreB,
    winner: res.winner,
    scorers: res.scorers, // [{team, player, minute}]
    simulated: res.simulated,
    createdAt: res.createdAt,
  });
}

/** Return N distinct minutes in [1..90], sorted */
function uniqueSortedMinutes(n) {
  const s = new Set();
  while (s.size < n) s.add(rand(1, 90));
  return [...s].sort((a, b) => a - b);
}

/** Prefer attackers > mids > defs > keeper for scorer names */
function pickScorerName(team) {
  const players = team?.players || [];
  const AT = players.filter(p => p.position === "AT");
  const MD = players.filter(p => p.position === "MD");
  const DF = players.filter(p => p.position === "DF");
  const GK = players.filter(p => p.position === "GK");

  const bucket =
    AT.length ? AT :
    MD.length ? MD :
    DF.length ? DF : GK;

  if (!bucket.length) return `${team.country} Player`;

  const r = bucket[Math.floor(Math.random() * bucket.length)];
  return r?.name || `${team.country} Player`;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Tiny Poisson-ish clamp around expected goals */
function poissonClamp(lambda) {
  // simple discretization with clamp 0..5
  const base = Math.random() < 0.6 ? lambda : lambda + (Math.random() - 0.5);
  const val = Math.max(0, Math.round(base + Math.random() * 2));
  return Math.min(val, 5);
}
