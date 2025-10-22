import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  auth,
  onAuthStateChanged,
  signOut
} from "./firebase";
import Bracket from "./pages/Bracket.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import RegisterTeam from "./pages/RegisterTeam.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Watch authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // ✅ Handle logout
  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  // ✅ Check if user is admin
  const isAdmin = user && user.email === "admin@example.com";

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 960, margin: "0 auto", padding: 16 }}>
      {/* 🔗 Navbar */}
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">🏆 Bracket</Link>
        {isAdmin && <Link to="/admin">⚙️ Admin</Link>}
        {user && !isAdmin && <Link to="/register">📝 Register Team</Link>}
        <span style={{ marginLeft: "auto" }}>
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>{user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </span>
      </nav>

      {/* 🔒 Route Protection */}
      <Routes>
        <Route path="/" element={<Bracket />} />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <Admin />
            ) : (
              <p style={{ color: "crimson" }}>⛔ Access Denied — Admins only</p>
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <RegisterTeam />
            ) : (
              <p style={{ color: "crimson" }}>⛔ Please log in to register your team</p>
            )
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
