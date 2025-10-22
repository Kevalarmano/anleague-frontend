import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg("Login successful!");
      navigate("/admin");
    } catch (e) {
      setMsg("❌ " + e.message);
    }
  }

  return (
    <div>
      <h2> Login</h2>
      <form onSubmit={submit}>
        <div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
