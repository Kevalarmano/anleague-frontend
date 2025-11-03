import React, { useState, useEffect } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      // Optional: redirect admins immediately
      if (currentUser?.email === "admin@example.com") {
        navigate("/admin");
      }
    });
    return () => unsub();
  }, [navigate]);

  function mapError(err) {
    switch (err.code) {
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a few minutes and try again.";
      case "auth/user-not-found":
        return "No account found for that email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      default:
        return err.message;
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return; // prevent double submit
    setLoading(true);
    setMsg("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setEmail("");
      setPassword("");
      // Navigate after onAuthStateChanged fires. If you want immediate nav:
      // navigate("/admin");
    } catch (err) {
      setMsg(mapError(err));
      // small backoff to avoid hammering the endpoint
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setMsg("Logged out successfully.");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pitch to-green-900">
      <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          African Nations League Login
        </h2>

        {user ? (
          <div className="text-center">
            <p className="mb-4">
              Welcome, <span className="font-semibold">{user.email}</span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-4">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="border border-gray-300 rounded-lg w-full p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                className="border border-gray-300 rounded-lg w-full p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gold text-dark font-semibold py-2 rounded-lg transition ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {msg && (
          <p className="mt-4 text-center text-red-600 font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
}
