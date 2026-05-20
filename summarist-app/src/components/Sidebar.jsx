import {
  FaHome,
  FaBookmark,
  FaCog,
  FaSearch,
  FaCrown,
  FaHeadphones,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout, openAuthModal } =
    useAuth();

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar__logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="logo"
          />

          <h2>Summarist</h2>
        </div>

        <div className="sidebar__links">
          <Link to="/for-you">
            <FaHome />
            <span>For You</span>
          </Link>

          <Link to="/library">
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

          <Link to="/settings">
            <FaCog />
            <span>Settings</span>
          </Link>

          <Link to="/choose-plan">
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