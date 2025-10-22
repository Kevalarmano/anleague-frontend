import React, { useEffect, useState } from "react";
import { db, collection, getDocs, setDoc, doc } from "../firebase";

export default function Admin() {
  const [teams, setTeams] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    setLoading(true);
    const snap = await getDocs(collection(db, "teams"));
    const loadedTeams = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTeams(loadedTeams);
    setLoading(false);
  }

  async function seedQuarterFinals() {
    if (teams.length < 8) {
      setMsg("You need at least 8 teams to start the tournament.");
      return;
    }

    const sorted = [...teams].sort((a, b) => b.rating - a.rating);
    const pairs = [
      [sorted[0], sorted[7]],
      [sorted[1], sorted[6]],
      [sorted[2], sorted[5]],
      [sorted[3], sorted[4]],
    ];

    for (let i = 0; i < pairs.length; i++) {
      const [teamA, teamB] = pairs[i];
      await setDoc(doc(db, "quarterFinals", `match${i + 1}`), {
        teamA: teamA.country,
        teamB: teamB.country,
        scoreA: 0,
        scoreB: 0,
        winner: null,
      });
    }

    setMsg("Quarter-finals seeded successfully!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pitch to-green-900 py-10 px-4 text-white">
      <div className="max-w-5xl mx-auto bg-green-800/80 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gold mb-8">
          Admin Dashboard
        </h2>

        {/* Tournament Actions */}
        <div className="flex justify-center mb-10">
          <button
            onClick={seedQuarterFinals}
            className="bg-gold text-dark px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Seed Quarter Finals
          </button>
        </div>

        {/* Feedback Message */}
        {msg && (
          <p className="text-center text-lg font-medium text-gold mb-6">{msg}</p>
        )}

        {/* Teams Overview */}
        <div className="bg-green-900/80 rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gold mb-4 text-center">
            Registered Teams ({teams.length})
          </h3>

          {loading ? (
            <p className="text-center text-gray-300">Loading teams...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white text-green-900 rounded-lg p-4 shadow hover:scale-105 transition"
                >
                  <h4 className="font-bold text-lg">{team.country}</h4>
                  <p className="text-sm text-gray-700">Manager: {team.manager}</p>
                  <p className="text-sm text-gray-700">
                    Team Rating: <span className="font-semibold">{team.rating}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-center text-sm text-gray-300">
          Use this panel to manage team seeding and match data. Only admin users have access.
        </div>
      </div>
    </div>
  );
}
