import React, { useState } from "react";
import { db, collection, addDoc, getDocs, query, where } from "../firebase";
import { generatePlayers, calculateTeamRating } from "../lib/rating";

export default function RegisterTeam() {
  const [country, setCountry] = useState("");
  const [manager, setManager] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (!country.trim() || !manager.trim()) {
      setMsg("Please fill in both the country and manager fields.");
      setLoading(false);
      return;
    }

    try {
      // Check if country already exists
      const q = query(collection(db, "teams"), where("country", "==", country));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setMsg(`The country "${country}" is already registered.`);
        setLoading(false);
        return;
      }

      // Generate player data and rating
      const players = generatePlayers(country);
      const rating = calculateTeamRating(players);

      await addDoc(collection(db, "teams"), {
        country: country.trim(),
        manager: manager.trim(),
        rating,
        players,
      });

      setMsg(`Team "${country}" registered successfully!`);
      setCountry("");
      setManager("");
    } catch (err) {
      console.error(err);
      setMsg("An error occurred while registering the team.");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pitch to-green-900">
      <div className="bg-white/10 text-gray-100 rounded-2xl shadow-lg backdrop-blur-md p-10 w-full max-w-lg border border-green-800/40">
        <h2 className="text-2xl font-bold text-center text-gold mb-6">
          Register a Team
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Country Name</label>
            <input
              className="border border-green-800/40 rounded-lg w-full p-2 bg-transparent text-white focus:border-gold focus:outline-none"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country name"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Manager Name</label>
            <input
              className="border border-green-800/40 rounded-lg w-full p-2 bg-transparent text-white focus:border-gold focus:outline-none"
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="Enter manager name"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 rounded-lg transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gold text-dark hover:scale-105 hover:shadow-lg hover:shadow-gold/40"
            }`}
          >
            {loading ? "Registering..." : "Register Team"}
          </button>
        </form>

        {msg && (
          <p className="mt-4 text-center text-gold font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
}
