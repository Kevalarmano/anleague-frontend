// src/pages/Match.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, collection, getDocs } from "../firebase";

/**
 * Route: /match/:stage/:id
 * stage in {quarterFinals, semiFinals, final}
 */
export default function Match() {
  const { stage, id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // get all docs in stage then pick id (Firestore needs a doc() read if you want direct)
      const snap = await getDocs(collection(db, stage));
      const m = snap.docs.map(d => ({ id: d.id, ...d.data() })).find(x => x.id === id);
      setMatch(m || null);
      setLoading(false);
    })();
  }, [stage, id]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading match...</p>;
  }
  if (!match) {
    return (
      <div className="max-w-3xl mx-auto bg-white/10 border border-green-800/40 rounded-xl p-6">
        <p className="text-center text-red-300">Match not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white/10 border border-green-800/40 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gold">
          {prettyStage(stage)} — {match.teamA} vs {match.teamB}
        </h2>
        <Link to="/" className="text-sm text-gold hover:underline">Back to Bracket</Link>
      </div>

      <div className="text-lg mb-4">
        <span className="font-semibold">{match.teamA}</span> {match.scoreA} — {match.scoreB} <span className="font-semibold">{match.teamB}</span>
      </div>

      {Array.isArray(match.scorers) && match.scorers.length > 0 ? (
        <div>
          <h3 className="font-semibold text-gold mb-2">Goal scorers</h3>
          <ul className="list-disc ml-6 space-y-1">
            {match.scorers
              .sort((a, b) => a.minute - b.minute)
              .map((g, idx) => (
                <li key={idx}>
                  <span className="font-medium">{g.player}</span> ({g.team}) — {g.minute}'
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-300 italic">
          No scorer details recorded. This match was simulated with a final scoreline only.
        </p>
      )}

      {match.simulated ? (
        <p className="text-xs text-gray-400 mt-4">This match was simulated.</p>
      ) : (
        <p className="text-xs text-gray-400 mt-4">This match was played.</p>
      )}
    </div>
  );
}

function prettyStage(s) {
  if (s === "quarterFinals") return "Quarter Final";
  if (s === "semiFinals") return "Semi Final";
  if (s === "final") return "Final";
  return s;
}
