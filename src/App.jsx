import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged, signOut } from "./firebase";
import Bracket from "./pages/Bracket.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  async function logout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">🏆 Bracket</Link>
        <Link to="/admin">⚙️ Admin</Link>
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

      <Routes>
        <Route path="/" element={<Bracket />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
