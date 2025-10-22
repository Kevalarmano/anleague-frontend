import React, { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg("Login successful!");
      setEmail("");
      setPassword("");
      navigate("/admin");
    } catch (err) {
      setMsg(err.message);
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
            <p className="mb-4">Welcome, <span className="font-semibold">{user.email}</span></p>
            <button
              onClick={handleLogout}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="border border-gray-300 rounded-lg w-full p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                className="border border-gray-300 rounded-lg w-full p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold text-dark font-semibold py-2 rounded-lg hover:scale-105 transition"
            >
              Login
            </button>
          </form>
        )}

        {msg && (
          <p className="mt-4 text-center text-green-700 font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
}
