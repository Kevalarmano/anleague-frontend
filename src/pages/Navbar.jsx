// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkBase =
    "px-4 py-2 rounded-md font-semibold transition-all duration-200";

  const activeClass =
    "text-yellow-400 border-b-2 border-yellow-400 shadow-yellow-400/50";
  const inactiveClass =
    "text-white hover:text-yellow-300 hover:border-yellow-300";

  return (
    <nav className="bg-[#0a0a0a]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-green-900/40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <h1 className="text-xl font-bold text-gold tracking-wide">
          African Nations League
        </h1>

        <div className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Register
          </NavLink>

          <NavLink
            to="/bracket"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Bracket
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Admin
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
