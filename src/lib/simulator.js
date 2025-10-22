// src/lib/simulator.js
import { db, collection, addDoc } from "../firebase";

export async function simulateTournament(teams) {
  if (!teams || teams.length < 8) throw new Error("Not enough teams to simulate.");

  // Validate all teams
  const validTeams = teams.filter(
    (t) => t && t.country && typeof t.rating === "number"
  );
  if (validTeams.length < 8)
    throw new Error("Invalid or incomplete team data in Firestore");

  // Randomize order
  const shuffled = [...validTeams].sort(() => Math.random() - 0.5);

  // --- Quarter Finals ---
  const qfWinners = [];
  for (let i = 0; i < 8; i += 2) {
    const teamA = shuffled[i];
    const teamB = shuffled[i + 1];
    const { winner, scoreA, scoreB } = simulateMatch(teamA, teamB);
    qfWinners.push({ winner });
    await addMatch("quarterFinals", teamA, teamB, scoreA, scoreB, winner);
  }

  // --- Semi Finals ---
  const sfWinners = [];
  for (let i = 0; i < 4; i += 2) {
    const teamA = qfWinners[i].winner;
    const teamB = qfWinners[i + 1].winner;
    if (!teamA || !teamB)
      throw new Error("Invalid semi-final match setup (missing team).");
    const { winner, scoreA, scoreB } = simulateMatch(teamA, teamB);
    sfWinners.push({ winner });
    await addMatch("semiFinals", teamA, teamB, scoreA, scoreB, winner);
  }

  // --- Final ---
  const teamA = sfWinners[0].winner;
  const teamB = sfWinners[1].winner;
  if (!teamA || !teamB)
    throw new Error("Invalid final match setup (missing team).");
  const { winner, scoreA, scoreB } = simulateMatch(teamA, teamB);
  const runnerUp = winner === teamA ? teamB : teamA;

  await addMatch("final", teamA, teamB, scoreA, scoreB, winner);

  // --- Store Champion ---
  await addDoc(collection(db, "pastWinners"), {
    champion: winner.country,
    runnerUp: runnerUp.country,
    rating: winner.rating,
    year: new Date().getFullYear(),
    createdAt: new Date(),
  });

  // ✅ Return structured result
  return { winner, runnerUp };
}

function simulateMatch(teamA, teamB) {
  const scoreA = rand(0, 5);
  const scoreB = rand(0, 5);
  const winner = scoreA >= scoreB ? teamA : teamB;
  return { winner, scoreA, scoreB };
}

async function addMatch(stage, teamA, teamB, scoreA, scoreB, winner) {
  if (!teamA || !teamB || !winner) return;
  await addDoc(collection(db, stage), {
    teamA: teamA.country,
    teamB: teamB.country,
    scoreA,
    scoreB,
    winner: winner.country,
    createdAt: new Date(),
  });
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
