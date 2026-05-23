import {
  FaHome,
  FaBookmark,
  FaCog,
  FaSearch,
  FaCrown,
  FaHeadphones,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout, openAuthModal } =
    useAuth();
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`sidebar ${
        isMenuOpen ? "sidebar--open" : ""
      }`}
    >
      <div>
        <div className="sidebar__logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="logo"
          />

          <h2>Summarist</h2>

          <button
            className="sidebar__toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() =>
              setIsMenuOpen(
                (current) => !current
              )
            }
          >
            {isMenuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>

        <div className="sidebar__links">
          <Link to="/for-you" onClick={closeMenu}>
            <FaHome />
            <span>For You</span>
          </Link>

          <Link to="/library" onClick={closeMenu}>
            <FaBookmark />
            <span>My Library</span>
          </Link>

          <span className="sidebar__disabled">
            <FaHeadphones />
            <span>Highlights</span>
          </span>

          <span className="sidebar__disabled">
            <FaSearch />
            <span>Search</span>
          </span>

          <Link to="/settings" onClick={closeMenu}>
            <FaCog />
            <span>Settings</span>
          </Link>

          <Link to="/choose-plan" onClick={closeMenu}>
            <FaCrown />
            <span>Choose Plan</span>
          </Link>
        </div>
      </div>

      <div className="sidebar__bottom">
        {user ? (
          <button onClick={logout}>
            Logout
          </button>
        ) : (
          <button
            onClick={() =>
              openAuthModal("login")
            }
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
