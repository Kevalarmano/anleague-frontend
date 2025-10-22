import React, { useState } from "react";
import { db, collection, getDocs, addDoc } from "../firebase";

export default function Admin() {
  const [msg, setMsg] = useState("");

  async function seedQuarterFinals() {
    try {
      setMsg("Seeding quarter-finals...");
      const teamsSnap = await getDocs(collection(db, "teams"));
      const teams = teamsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (teams.length < 8) throw new Error("You need 8 teams to start the tournament");

      // Create 4 matches (1v8, 2v7, etc.)
      const pairs = [[0,7],[1,6],[2,5],[3,4]];
      for (const [a,b] of pairs) {
        await addDoc(collection(db, "quarterFinals"), {
          stage: "QF",
          teamA: teams[a].country,
          teamB: teams[b].country,
          scoreA: 0,
          scoreB: 0
        });
      }
      setMsg("✅ Quarter-finals seeded successfully!");
    } catch (e) {
      setMsg("❌ " + e.message);
    }
  }

  return (
    <div>
      <h2>⚙️ Admin Dashboard</h2>
      <button onClick={seedQuarterFinals}>Seed Quarter Finals</button>
      <p>{msg}</p>
    </div>
  );
}
