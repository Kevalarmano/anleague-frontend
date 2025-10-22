import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";

export default function HallOfFame() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWinners();
  }, []);

  async function loadWinners() {
    const snap = await getDocs(collection(db, "hallOfFame"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setWinners(sorted);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gold mb-6">Hall of Fame</h2>
        {loading ? (
          <p className="text-gray-400">Loading past champions...</p>
        ) : winners.length === 0 ? (
          <p className="text-gray-400">No past champions recorded yet.</p>
        ) : (
          <div className="grid gap-4">
            {winners.map((w) => (
              <div
                key={w.id}
                className="bg-white/10 border border-green-800/40 rounded-xl p-4 shadow hover:scale-[1.02] transition"
              >
                <h3 className="text-2xl text-gold font-semibold mb-1">
                  {w.champion}
                </h3>
                <p className="text-gray-300 text-sm">
                  Rating: {w.rating} | Date:{" "}
                  {new Date(w.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
