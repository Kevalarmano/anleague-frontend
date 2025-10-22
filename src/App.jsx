import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged, signOut } from "./firebase";
import Bracket from "./pages/Bracket.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import RegisterTeam from "./pages/RegisterTeam.jsx";
import Analytics from "./pages/Analytics.jsx";
import { GiSoccerKick } from "react-icons/gi";
import { FaMoon, FaSun } from "react-icons/fa";
import clsx from "classnames";

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  // watch for login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // theme handling
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isAdmin = user && user.email === "admin@example.com";

  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <div
      className={clsx(
        "min-h-screen",
        theme === "dark"
          ? "bg-[#0a0a0a] text-gray-100"
          : "bg-gray-50 text-gray-900"
      )}
    >
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-green-900 to-green-700 dark:from-[#0a0a0a] dark:to-green-900">
        <div className="flex items-center gap-2">
          <GiSoccerKick className="text-gold text-2xl" />
          <h1 className="text-xl font-semibold tracking-wide text-gold">
            African Nations League
          </h1>
        </div>

        <nav className="flex items-center gap-6">
          <Link className="hover:text-gold transition" to="/">
            Bracket
          </Link>
          {isAdmin && (
            <Link className="hover:text-gold transition" to="/admin">
              Admin
            </Link>
          )}
          {isAdmin && (
            <Link className="hover:text-gold transition" to="/analytics">
              Analytics
            </Link>
          )}
          {user && !isAdmin && (
            <Link className="hover:text-gold transition" to="/register">
              Register
            </Link>
          )}
          {user ? (
            <button
              onClick={logout}
              className="bg-gold text-dark px-3 py-1 rounded-md hover:scale-105 transition"
            >
              Logout
            </button>
          ) : (
            <Link className="text-gold hover:underline" to="/login">
              Login
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2 p-2 rounded-md hover:bg-green-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <FaSun className="text-gold" />
            ) : (
              <FaMoon className="text-green-900" />
            )}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto transition">
        <Routes>
          <Route path="/" element={<Bracket />} />
          <Route
            path="/admin"
            element={isAdmin ? <Admin /> : <AccessDenied />}
          />
          <Route
            path="/register"
            element={user ? <RegisterTeam /> : <AccessDenied />}
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/analytics"
            element={isAdmin ? <Analytics /> : <AccessDenied />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm border-t border-green-800/50 dark:border-green-700/40 mt-10">
        © 2025 African Nations League Simulation | Built by Keval Armano Ramchander
      </footer>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <h2 className="text-2xl font-semibold text-gold mb-2">Access Denied</h2>
      <p className="text-gray-400">
        You do not have permission to view this page.
      </p>
    </div>
  );
}
