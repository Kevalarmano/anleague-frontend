// src/lib/rating.js
// Generates 23 players with realistic 4-position ratings and one captain.

export function generatePlayers(country) {
  const positions = [
    "GK", "GK", // 2 goalkeepers
    "DF", "DF", "DF", "DF", "DF", "DF", // 6 defenders
    "MD", "MD", "MD", "MD", "MD", "MD", // 6 midfielders
    "AT", "AT", "AT", "AT", "AT", "AT", "AT" // 7 attackers
  ];

  const players = positions.map((pos, i) => {
    const name = `${country} Player ${i + 1}`;

    // Assign ratings based on position
    const rating = {
      GK: pos === "GK" ? rand(60, 100) : rand(0, 60),
      DF: pos === "DF" ? rand(60, 100) : rand(0, 60),
      MD: pos === "MD" ? rand(60, 100) : rand(0, 60),
      AT: pos === "AT" ? rand(60, 100) : rand(0, 60),
    };

    return {
      name,
      position: pos,
      rating,
      isCaptain: false,
    };
  });

  // Randomly assign a captain
  const captainIndex = Math.floor(Math.random() * players.length);
  players[captainIndex].isCaptain = true;

  return players;
}

export function calculateTeamRating(players) {
  if (!players || players.length === 0) return 0;

  // Average the skill in each player's natural position
  const total = players.reduce((sum, p) => {
    const naturalSkill = p.rating[p.position];
    return sum + naturalSkill;
  }, 0);

  return Math.round(total / players.length);
}

// helper
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
