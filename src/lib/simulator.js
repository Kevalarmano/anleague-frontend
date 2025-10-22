// src/lib/simulator.js
import { db, collection, addDoc } from "../firebase";

export async function simulateTournament(teams) {
  if (!teams || teams.length < 8) throw new Error("Not enough teams to simulate.");

  // Randomize order
  const shuffled = [...teams].sort(() => Math.random() - 0.5);

  // Quarter Finals
  const qfWinners = [];
  for (let i = 0; i < 8; i += 2) {
    const teamA = shuffled[i];
    const teamB = shuffled[i + 1];
    const scoreA = rand(0, 5);
    const scoreB = rand(0, 5);
    const winner = scoreA >= scoreB ? teamA : teamB;
    qfWinners.push({ teamA, teamB, scoreA, scoreB, winner });
    await addMatch("quarterFinals", teamA, teamB, scoreA, scoreB, winner);
  }

  // Semi Finals
  const sfWinners = [];
  for (let i = 0; i < 4; i += 2) {
    const teamA = qfWinners[i].winner;
    const teamB = qfWinners[i + 1].winner;
    const scoreA = rand(0, 5);
    const scoreB = rand(0, 5);
    const winner = scoreA >= scoreB ? teamA : teamB;
    sfWinners.push({ teamA, teamB, scoreA, scoreB, winner });
    await addMatch("semiFinals", teamA, teamB, scoreA, scoreB, winner);
  }

  // Final
  const teamA = sfWinners[0].winner;
  const teamB = sfWinners[1].winner;
  const scoreA = rand(0, 5);
  const scoreB = rand(0, 5);
  const winner = scoreA >= scoreB ? teamA : teamB;
  await addMatch("final", teamA, teamB, scoreA, scoreB, winner);

  // Store champion
  await addDoc(collection(db, "pastWinners"), {
    champion: winner.country,
    year: new Date().getFullYear(),
  });

  return winner;
}

async function addMatch(stage, teamA, teamB, scoreA, scoreB, winner) {
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
