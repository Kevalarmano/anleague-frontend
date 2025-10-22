import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged, signOut } from "./firebase";
import Bracket from "./pages/Bracket.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import RegisterTeam from "./pages/RegisterTeam.jsx";
import { GiSoccerKick } from "react-icons/gi";
import { FaUserShield } from "react-icons/fa";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const isAdmin = user && user.email === "admin@example.com";

  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pitch to-green-900 text-white font-sans">
      {/* ⚽ Navbar */}
      <header className="bg-gradient-to-r from-green-800 to-green-600 shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GiSoccerKick className="text-gold text-3xl" />
          <h1 className="text-2xl font-bold tracking-wide text-gold">
            African Nations League
          </h1>
        </div>
        <nav className="flex items-center gap-6">
          <Link className="hover:text-gold font-medium" to="/">🏆 Bracket</Link>
          {isAdmin && <Link className="hover:text-gold font-medium" to="/admin">⚙️ Admin</Link>}
          {user && !isAdmin && <Link className="hover:text-gold font-medium" to="/register">📝 Register</Link>}
          {user ? (
            <button onClick={logout} className="bg-gold text-dark font-semibold px-3 py-1 rounded-md hover:scale-105 transition">
              Logout
            </button>
          ) : (
            <Link className="text-gold hover:underline" to="/login">Login</Link>
          )}
        </nav>
      </header>

      {/* ⚙️ Content */}
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Bracket />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Denied />} />
          <Route path="/register" element={user ? <RegisterTeam /> : <Denied />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* ⚽ Footer */}
      <footer className="text-center py-4 bg-green-900 text-gray-300 text-sm">
        © 2025 African Nations League Simulation | Built by Keval Armano Ramchander
      </footer>
    </div>
  );
}

function Denied() {
  return (
    <div className="text-center mt-20">
      <FaUserShield className="text-6xl text-gold mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gold">Access Denied</h2>
      <p className="text-gray-200">You do not have permission to view this page.</p>
    </div>
  );
}
