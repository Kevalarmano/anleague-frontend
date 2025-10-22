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
    <div className="min-h-screen bg-[#0a0a0a] dark:bg-[#0a0a0a] text-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gold drop-shadow-md mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-400">
            Manage teams, seed matches, and monitor tournament progress.
          </p>
        </div>

        {/* Control Panel */}
        <div className="backdrop-blur-md bg-white/5 dark:bg-white/5 border border-green-900/50 rounded-2xl shadow-2xl p-6 mb-10 transition-all duration-300 hover:shadow-gold/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={seedQuarterFinals}
              className="bg-gold text-dark font-semibold px-6 py-3 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-gold/40 transition-all"
            >
              Seed Quarter Finals
            </button>

            {msg && (
              <p className="text-center md:text-left text-gold font-medium">
                {msg}
              </p>
            )}
          </div>
        </div>

        {/* Teams Section */}
        <div className="backdrop-blur-md bg-white/5 dark:bg-white/5 border border-green-900/50 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-semibold text-gold mb-6 text-center">
            Registered Teams ({teams.length})
          </h3>

          {loading ? (
            <p className="text-center text-gray-400">Loading teams...</p>
          ) : teams.length === 0 ? (
            <p className="text-center text-gray-400">No teams registered yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, i) => (
                <div
                  key={team.id}
                  className="bg-white/10 dark:bg-white/10 border border-green-800/40 rounded-xl p-5 shadow hover:scale-[1.03] hover:border-gold/70 hover:shadow-gold/20 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-gold">
                      {team.country}
                    </h4>
                    <span className="text-sm text-gray-400">
                      #{i + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Manager: <span className="font-medium">{team.manager}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    Rating:{" "}
                    <span className="font-semibold text-gold">
                      {team.rating}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-10">
          Admins can view, seed, and manage all tournament data in real time.
        </p>
      </div>
    </div>
  );
}
