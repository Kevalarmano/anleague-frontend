// src/pages/RegisterTeam.jsx
import React, { useState } from "react";
import { db, collection, addDoc } from "../firebase";
import { generatePlayers, calculateTeamRating } from "../lib/rating";

export default function RegisterTeam() {
  const [country, setCountry] = useState("");
  const [manager, setManager] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const players = generatePlayers(country);
      const rating = calculateTeamRating(players);
      await addDoc(collection(db, "teams"), {
        country,
        manager,
        rating,
        players,
      });
      setMsg(`✅ ${country} registered with rating ${rating}`);
      setCountry("");
      setManager("");
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  }

  return (
    <div>
      <h2>📝 Register a Team</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Country Name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          placeholder="Manager Name"
          value={manager}
          onChange={(e) => setManager(e.target.value)}
        />
        <button>Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
