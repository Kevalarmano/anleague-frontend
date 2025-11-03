// src/pages/TopScorers.jsx
import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";

/**
 * Aggregates scorers from quarterFinals, semiFinals, final
 * Publicly viewable; no login required.
 */
export default function TopScorers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const stages = ["quarterFinals", "semiFinals", "final"];
      const all = [];
      for (const s of stages) {
        const snap = await getDocs(collection(db, s));
        all.push(...snap.docs.map(d => ({ id: d.id, stage: s, ...d.data() })));
      }

      const tally = new Map(); // key = player|country
      for (const m of all) {
        const scorers = Array.isArray(m.scorers) ? m.scorers : [];
        for (const g of scorers) {
          const key = `${g.player}|${g.team}`;
          tally.set(key, {
            player: g.player,
            country: g.team,
            goals: (tally.get(key)?.goals || 0) + 1,
          });
        }
      }
      const list = [...tally.values()].sort((a, b) => b.goals - a.goals);
      setRows(list);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white/10 border border-green-800/40 rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gold mb-4">Top Scorers</h2>
      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-300">No goals recorded yet.</p>
      ) : (
        <table className="w-full text-left">
          <thead className="text-gray-300">
            <tr>
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Player</th>
              <th className="py-2 pr-4">Country</th>
              <th className="py-2">Goals</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.player}-${i}`} className="border-t border-green-800/30">
                <td className="py-2 pr-4">{i + 1}</td>
                <td className="py-2 pr-4 font-medium">{r.player}</td>
                <td className="py-2 pr-4">{r.country}</td>
                <td className="py-2">{r.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="text-xs text-gray-400 mt-4">
        Anyone can view this page. It aggregates goal data from all simulated matches.
      </p>
    </div>
  );
}
