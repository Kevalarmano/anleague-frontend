// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged, signOut } from "./firebase";

import Bracket from "./pages/Bracket.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import RegisterTeam from "./pages/RegisterTeam.jsx";
import Analytics from "./pages/Analytics.jsx";
import HallOfFame from "./pages/HallOfFame.jsx";
import Match from "./pages/Match.jsx";            
import TopScorers from "./pages/TopScorers.jsx";

import { GiSoccerKick } from "react-icons/gi";
import { FaMoon, FaSun } from "react-icons/fa";
import clsx from "classnames";

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isAdmin = user && user.email === "admin@example.com";

  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  const linkBase = "px-3 py-1 rounded-md font-medium transition duration-200";
  const activeLink =
    "text-yellow-400 border-b-2 border-yellow-400 shadow-yellow-400/50";
  const inactiveLink =
    "text-white hover:text-yellow-300 hover:border-yellow-300";

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
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Bracket
          </NavLink>

          <NavLink
            to="/topscorers"           
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Top Scorers
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Admin
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Analytics
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/halloffame"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Hall of Fame
            </NavLink>
          )}

          {user && !isAdmin && (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Register
            </NavLink>
          )}

          {user ? (
            <button
              onClick={logout}
              className="bg-gold text-dark px-3 py-1 rounded-md hover:scale-105 transition"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : inactiveLink}`
              }
            >
              Login
            </NavLink>
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
          <Route path="/login" element={<Login />} />

          {/* Admin-only */}
          <Route path="/admin" element={isAdmin ? <Admin /> : <AccessDenied />} />
          <Route
            path="/analytics"
            element={isAdmin ? <Analytics /> : <AccessDenied />}
          />
          <Route
            path="/halloffame"
            element={isAdmin ? <HallOfFame /> : <AccessDenied />}
          />

          {/* Rep-only */}
          <Route
            path="/register"
            element={user ? <RegisterTeam /> : <AccessDenied />}
          />

          {/* Public pages */}
          <Route path="/topscorers" element={<TopScorers />} />
          <Route path="/match/:stage/:id" element={<Match />} />
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
