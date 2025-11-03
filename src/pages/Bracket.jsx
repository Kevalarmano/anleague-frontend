// src/pages/Bracket.jsx
import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";

export default function Bracket() {
  const [qf, setQf] = useState([]);
  const [sf, setSf] = useState([]);
  const [fin, setFin] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [qfSnap, sfSnap, fSnap] = await Promise.all([
      getDocs(collection(db, "quarterFinals")),
      getDocs(collection(db, "semiFinals")),
      getDocs(collection(db, "final")),
    ]);

    const normalize = (snap) =>
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.id > b.id ? 1 : -1));

    // Ensure max counts per stage (defensive if old docs exist)
    setQf(normalize(qfSnap).slice(0, 4));
    setSf(normalize(sfSnap).slice(0, 2));
    setFin(normalize(fSnap).slice(0, 1));
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pitch to-green-900 py-10 px-4 text-white">
        <div className="max-w-5xl mx-auto text-center text-gray-300">Loading bracket…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pitch to-green-900 py-10 px-4 text-white">
      <div className="max-w-5xl mx-auto bg-green-800/80 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gold mb-10">Tournament Bracket</h2>

        <Stage title="Quarter-finals" matches={qf} />
        <Stage title="Semi-finals" matches={sf} />
        <Stage title="Final" matches={fin} />
      </div>

      <footer className="text-center mt-10 text-gray-300 text-sm">
        Data updates in real time as matches are seeded and results recorded.
      </footer>
    </div>
  );
}

function Stage({ title, matches }) {
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-semibold text-gold mb-4">{title}</h3>
      {matches.length === 0 ? (
        <p className="text-gray-300">No matches yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {matches.map((m) => <MatchCard key={m.id} m={m} />)}
        </div>
      )}
    </div>
  );
}

function MatchCard({ m }) {
  const decided = !!m.winner;
  return (
    <div className="bg-white text-green-900 rounded-lg p-6 shadow-lg hover:scale-105 transition">
      <h4 className="text-xl font-bold mb-3 text-center text-green-800">Match</h4>
      <Row name={m.teamA} score={m.scoreA} />
      <Row name={m.teamB} score={m.scoreB} />
      <div className="text-center mt-4 text-sm">
        {decided ? (
          <p className="text-green-800 font-semibold">Winner: {m.winner}</p>
        ) : (
          <p className="text-gray-600 italic">Awaiting result</p>
        )}
      </div>
    </div>
  );
}

function Row({ name, score }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold">{name}</span>
      <span className="font-bold text-green-700">{score ?? 0}</span>
    </div>
  );
}
