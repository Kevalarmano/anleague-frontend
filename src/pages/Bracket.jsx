import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";

export default function Bracket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "quarterFinals"));
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading bracket...</p>;

  return (
    <div>
      <h2>🏁 Road to the Final</h2>
      {matches.length === 0 && <p>No matches yet.</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {matches.map(m => (
          <div key={m.id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 10 }}>
            <b>{m.teamA}</b> {m.scoreA ?? 0} - {m.scoreB ?? 0} <b>{m.teamB}</b>
            <div style={{ fontSize: 12, color: "#666" }}>{m.stage || "QF"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
