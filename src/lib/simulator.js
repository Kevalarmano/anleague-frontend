// src/lib/simulator.js
import {
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
} from "../firebase";

/**
 * Simulate the whole tournament from QF to Final.
 * @param {Array} teams - array of team objects from Firestore (each may include players[])
 * @returns {Promise<{ winner: any, runnerUp: any }>}
 */
export async function simulateTournament(teams) {
  if (!teams || teams.length < 8) {
    throw new Error("Not enough teams to simulate.");
  }

  // Shuffle a copy so it feels fresh each run
  const shuffled = [...teams].sort(() => Math.random() - 0.5);

  // --- Quarter Finals (4 matches) ---
  const qfPairs = [
    [shuffled[0], shuffled[1]],
    [shuffled[2], shuffled[3]],
    [shuffled[4], shuffled[5]],
    [shuffled[6], shuffled[7]],
  ];
  const qfWinners = await simulateStage("quarterFinals", qfPairs);

  // --- Semi Finals (2 matches) ---
  const sfPairs = [
    [qfWinners[0], qfWinners[1]],
    [qfWinners[2], qfWinners[3]],
  ];
  const sfWinners = await simulateStage("semiFinals", sfPairs);

  // --- Final (1 match) ---
  const finalPairs = [[sfWinners[0], sfWinners[1]]];
  const [champion, runnerUp] = await simulateFinal("final", finalPairs[0]);

  // Record champion in a simple history too
  await addDoc(collection(db, "pastWinners"), {
    champion: champion.country,
    runnerUp: runnerUp.country,
    year: new Date().getFullYear(),
    createdAt: new Date(),
  });

  return { winner: champion, runnerUp };
}

/**
 * Simulates a stage with N matches (QF/SF) and returns winners.
 * Writes match docs (with scorers) into {stageName}.
 */
async function simulateStage(stageName, pairs) {
  const winners = [];
  for (let i = 0; i < pairs.length; i++) {
    const [A, B] = pairs[i];

    const { scoreA, scoreB, scorersA, scorersB, winner } = simulateMatch(A, B);

    // Persist match with goal scorers & result
    await setDoc(doc(db, stageName, `match${i + 1}`), {
      teamA: A.country,
      teamB: B.country,
      scoreA,
      scoreB,
      scorersA, // [{name, minute}]
      scorersB, // [{name, minute}]
      winner: winner.country,
      simulated: true,
      createdAt: new Date(),
    });

    // Update cumulative top scorers
    await updateTopScorers(A.country, scorersA);
    await updateTopScorers(B.country, scorersB);

    winners.push(winner);
  }
  return winners;
}

/**
 * Final is just one match but we also want to return champion & runner-up as objects.
 */
async function simulateFinal(stageName, [A, B]) {
  const { scoreA, scoreB, scorersA, scorersB, winner } = simulateMatch(A, B);

  await setDoc(doc(db, stageName, "match1"), {
    teamA: A.country,
    teamB: B.country,
    scoreA,
    scoreB,
    scorersA,
    scorersB,
    winner: winner.country,
    simulated: true,
    createdAt: new Date(),
  });

  await updateTopScorers(A.country, scorersA);
  await updateTopScorers(B.country, scorersB);

  const runnerUp = winner.country === A.country ? B : A;
  return [winner, runnerUp];
}

/**
 * Simulate one match between two teams. Returns scores, scorer arrays, and winner team object.
 * If a team has a `players` array, scorers are chosen from there; otherwise fallback names are used.
 */
function simulateMatch(teamA, teamB) {
  // Target goals influenced by team rating (soft advantage)
  const baseA = clamp(Math.round(randn(1.2, 1.0) + (teamA.rating || 70) / 50 - 1), 0, 6);
  const baseB = clamp(Math.round(randn(1.2, 1.0) + (teamB.rating || 70) / 50 - 1), 0, 6);

  // Avoid all 0-0 boredom; tiny nudge
  const scoreA = maybeBumpZero(baseA);
  const scoreB = maybeBumpZero(baseB);

  const minutesA = pickUniqueMinutes(scoreA);
  const minutesB = pickUniqueMinutes(scoreB);

  const scorersA = minutesA.map((m) => ({
    name: pickScorerName(teamA),
    minute: m,
  }));
  const scorersB = minutesB.map((m) => ({
    name: pickScorerName(teamB),
    minute: m,
  }));

  // Tie-breaker: weighted by team rating for realism
  let finalA = scoreA;
  let finalB = scoreB;
  if (finalA === finalB) {
    const biasA = (teamA.rating || 70) / ((teamA.rating || 70) + (teamB.rating || 70));
    if (Math.random() < biasA) {
      finalA += 1;
      scorersA.push({ name: pickScorerName(teamA), minute: pickMinuteNotUsed(minutesA, minutesB) });
    } else {
      finalB += 1;
      scorersB.push({ name: pickScorerName(teamB), minute: pickMinuteNotUsed(minutesA, minutesB) });
    }
  }

  const winner = finalA >= finalB ? teamA : teamB;

  return {
    scoreA: finalA,
    scoreB: finalB,
    scorersA,
    scorersB,
    winner,
  };
}

/**
 * Increment cumulative goals in 'topScorers' for each scorer.
 * topScorers doc id: `${country}::${name}`
 */
async function updateTopScorers(country, scorers) {
  const batchOps = scorers.map(async (s) => {
    const id = `${country}::${s.name}`;
    const ref = doc(db, "topScorers", id);
    // create or update
    await setDoc(
      ref,
      { name: s.name, country, goals: increment(1), updatedAt: new Date() },
      { merge: true }
    );
  });
  await Promise.all(batchOps);
}

/* -------------------- helpers -------------------- */

function pickScorerName(team) {
  // If you registered teams with players[], pick a real player
  if (Array.isArray(team.players) && team.players.length > 0) {
    const p = team.players[Math.floor(Math.random() * team.players.length)];
    return p?.name || `${team.country} Player`;
  }
  // Fallback
  const n = Math.floor(Math.random() * 11) + 1;
  return `${team.country} Player ${n}`;
}

function pickUniqueMinutes(n) {
  const set = new Set();
  while (set.size < n) {
    set.add(randInt(1, 90));
  }
  return Array.from(set).sort((a, b) => a - b);
}

function pickMinuteNotUsed(minsA, minsB) {
  const used = new Set([...minsA, ...minsB]);
  let m = randInt(1, 90);
  while (used.has(m)) {
    m = randInt(1, 90);
  }
  return m;
}

function maybeBumpZero(x) {
  if (x === 0 && Math.random() < 0.35) return 1;
  return x;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// Normal-ish random for small numbers (mean, stdev)
function randn(mean = 0, stdev = 1) {
  // Box–Muller
  let u = 1 - Math.random();
  let v = 1 - Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
