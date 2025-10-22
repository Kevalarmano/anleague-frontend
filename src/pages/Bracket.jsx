import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";

export default function Bracket() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const snap = await getDocs(collection(db, "quarterFinals"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMatches(data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pitch to-green-900 py-10 px-4 text-white">
      <div className="max-w-5xl mx-auto bg-green-800/80 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gold mb-10">
          Tournament Bracket
        </h2>

        {matches.length === 0 ? (
          <p className="text-center text-gray-300">
            No matches seeded yet. Once the admin seeds the quarter-finals, fixtures will appear here.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {matches.map((m) => (
              <div
                key={m.id}
                className="bg-white text-green-900 rounded-lg p-6 shadow-lg hover:scale-105 transition"
              >
                <h3 className="text-xl font-bold mb-3 text-center text-green-800">
                  Quarter Final
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{m.teamA}</span>
                  <span className="font-bold text-green-700">{m.scoreA}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{m.teamB}</span>
                  <span className="font-bold text-green-700">{m.scoreB}</span>
                </div>
                <div className="text-center mt-4 text-sm text-gray-700">
                  {m.winner ? (
                    <p className="text-green-800 font-semibold">
                      Winner: {m.winner}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Awaiting result
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center mt-10 text-gray-300 text-sm">
        Data updates in real-time as matches are seeded and results recorded.
      </footer>
    </div>
  );
}
