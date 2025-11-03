// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      if (currentUser?.email === "admin@example.com") navigate("/admin");
      else if (currentUser?.email === "rep@example.com") navigate("/register");
    });
    return () => unsub();
  }, [navigate]);

  function mapError(err) {
    switch (err.code) {
      case "auth/too-many-requests":
        return "Too many attempts. Please wait and try again.";
      case "auth/user-not-found":
        return "User not found. Check your username.";
      case "auth/wrong-password":
        return "Incorrect password.";
      default:
        return err.message;
    }
  }

  function toEmail(value) {
    const v = (value || "").trim().toLowerCase();
    if (v.includes("@")) return v;
    if (v === "admin") return "admin@example.com";
    if (v === "rep") return "rep@example.com";
    return null;
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg("");

    const email = toEmail(username);
    if (!email) {
      setMsg("Use username 'admin' or 'rep'.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUsername("");
      setPassword("");
    } catch (err) {
      setMsg(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setMsg("Logged out successfully.");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="w-full max-w-md p-8 rounded-2xl border border-green-800/40 bg-white/5 backdrop-blur-md shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gold mb-8">
          African Nations League Login
        </h2>

        {user ? (
          <div className="text-center">
            <p className="mb-4">
              Logged in as{" "}
              <span className="font-semibold text-gold">{user.email}</span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label className="block font-semibold mb-1">Username</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg bg-transparent border border-green-800/40 focus:border-gold focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                type="password"
                className="w-full p-2 rounded-lg bg-transparent border border-green-800/40 focus:border-gold focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gold text-dark hover:scale-105 hover:shadow-lg hover:shadow-gold/30"
              }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Use <span className="text-gold font-semibold">admin@example.com</span> /
              <span className="text-gold font-semibold">rep@example.com</span> as username
              <br /> Passwords: admin123 / rep123
            </p>
          </form>
        )}

        {msg && (
          <p className="mt-4 text-center text-red-400 font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
}
