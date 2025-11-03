// src/pages/TopScorers.jsx
import React, { useEffect, useState } from "react";
import { db, collection, getDocs, query, orderBy } from "../firebase";

export default function TopScorers() {
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopScorers();
  }, []);

  async function loadTopScorers() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "topScorers"), orderBy("goals", "desc")));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setScorers(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pitch to-green-900 py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto bg-green-800/70 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gold mb-8">
          Top Goal Scorers
        </h2>

        {loading ? (
          <p className="text-center text-gray-300">Loading scorer data…</p>
        ) : scorers.length === 0 ? (
          <p className="text-center text-gray-300">No scorer data available yet.</p>
        ) : (
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-yellow-400/50 text-gold">
                <th className="py-2">Rank</th>
                <th className="py-2">Player</th>
                <th className="py-2">Country</th>
                <th className="py-2">Goals</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((s, i) => (
                <tr
                  key={s.id}
                  className="border-b border-green-700/40 hover:bg-green-900/40 transition"
                >
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2 font-semibold">{s.name}</td>
                  <td className="py-2">{s.country}</td>
                  <td className="py-2 text-yellow-400 font-bold">{s.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer className="text-center mt-10 text-gray-400 text-sm">
        Updated automatically after each simulated match.
      </footer>
    </div>
  );
}
