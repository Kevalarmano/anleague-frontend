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
      if (!country || !manager) {
        setMsg("Please fill in all fields.");
        return;
      }

      const players = generatePlayers(country);
      const rating = calculateTeamRating(players);

      await addDoc(collection(db, "teams"), {
        country,
        manager,
        rating,
        players,
      });

      setMsg(`Team ${country} registered successfully with rating ${rating}`);
      setCountry("");
      setManager("");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pitch to-green-900">
      <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          Register a Team
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Country Name</label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country name"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Manager Name</label>
            <input
              className="border border-gray-300 rounded-lg w-full p-2"
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="Enter manager name"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-dark font-semibold py-2 rounded-lg hover:scale-105 transition"
          >
            Register Team
          </button>
        </form>

        {msg && (
          <p className="mt-4 text-center text-green-700 font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
}
