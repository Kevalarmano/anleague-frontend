import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Analytics() {
  const [teams, setTeams] = useState([]);
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

  const avgRating =
    teams.length > 0
      ? (teams.reduce((sum, t) => sum + Number(t.rating || 0), 0) / teams.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gold drop-shadow-md mb-2">
            Team Performance Analytics
          </h2>
          <p className="text-gray-400">
            Insights into team strengths, ratings, and tournament balance.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading analytics...</p>
        ) : (
          <>
            {/* Summary */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10 text-center">
              <div className="bg-white/10 border border-green-800/40 rounded-xl p-5 shadow">
                <h3 className="text-xl text-gold font-bold">Total Teams</h3>
                <p className="text-3xl font-semibold mt-2">{teams.length}</p>
              </div>
              <div className="bg-white/10 border border-green-800/40 rounded-xl p-5 shadow">
                <h3 className="text-xl text-gold font-bold">Average Rating</h3>
                <p className="text-3xl font-semibold mt-2">{avgRating}</p>
              </div>
              <div className="bg-white/10 border border-green-800/40 rounded-xl p-5 shadow">
                <h3 className="text-xl text-gold font-bold">Top Team</h3>
                <p className="text-2xl font-semibold mt-2">
                  {teams.sort((a, b) => b.rating - a.rating)[0]?.country || "N/A"}
                </p>
              </div>
            </div>

            {/* Rating Bar Chart */}
            <div className="bg-white/5 border border-green-900/50 rounded-2xl p-6 shadow-xl mb-10">
              <h3 className="text-2xl text-gold font-semibold mb-4 text-center">
                Team Ratings Overview
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={teams}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="country" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #555",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rating" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Line Chart */}
            <div className="bg-white/5 border border-green-900/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl text-gold font-semibold mb-4 text-center">
                Simulated Performance Progression
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={teams}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="country" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #555",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#0B6623"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
