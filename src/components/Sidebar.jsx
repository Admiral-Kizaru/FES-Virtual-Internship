import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout, openAuthModal } = useAuth();

  return (
    <div className="sidebar">
      <h2 className="sidebar__logo">Summarist</h2>

      <div className="sidebar__links">
        <Link to="/for-you">For You</Link>

        <Link to="/library">Library</Link>

        <span className="sidebar__disabled">Highlights</span>

        <span className="sidebar__disabled">Search</span>

        <Link to="/settings">Settings</Link>

        <span className="sidebar__disabled">Help & Support</span>

        <Link to="/choose-plan">Choose Plan</Link>
      </div>

      <div className="sidebar__bottom">
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={() => openAuthModal("login")}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;