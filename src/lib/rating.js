// src/lib/rating.js
export const positions = ["GK", "DF", "MD", "AT"];

export function generatePlayers(teamName) {
  const players = [];
  for (let i = 1; i <= 23; i++) {
    const natural = positions[Math.floor(Math.random() * 4)];
    const ratings = {};
    positions.forEach(pos => {
      ratings[pos] = pos === natural ? randomBetween(50, 100) : randomBetween(0, 50);
    });
    players.push({
      name: `${teamName} Player ${i}`,
      naturalPosition: natural,
      ...ratings
    });
  }
  return players;
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateTeamRating(players) {
  const sum = players.reduce((acc, p) => acc + p[p.naturalPosition], 0);
  return Math.round(sum / players.length);
}
