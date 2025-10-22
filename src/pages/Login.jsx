import React, { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Watch authentication state (auto-updates if user is logged in/out)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle login button
  async function handleLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg("✅ Logged in successfully!");
      setEmail("");
      setPassword("");
      navigate("/admin"); // go to admin after login
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  }

  // Handle logout button
  async function handleLogout() {
    await signOut(auth);
    setMsg("👋 Logged out");
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>🔐 Login</h2>
      {user ? (
        <div>
          <p>Welcome, <b>{user.email}</b></p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", margin: "10px 0", width: "100%", padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", margin: "10px 0", width: "100%", padding: "8px" }}
          />
          <button type="submit">Login</button>
        </form>
      )}
      <p style={{ marginTop: "10px", color: "green" }}>{msg}</p>
    </div>
  );
}
