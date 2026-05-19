import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user, openAuthModal } = useAuth();

  if (!user) {
    return (
      <>
        <Sidebar />

        <div className="page">
          <SearchBar />

          <div
            style={{
              marginTop: "48px",
              textAlign: "center",
            }}
          >
            <h1>You are not logged in</h1>

            <p>
              Login to access your settings.
            </p>

            <button
              onClick={() =>
                openAuthModal("login")
              }
              style={{
                marginTop: "20px",
              }}
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  const subscription =
    user?.subscription || "basic";

  return (
    <>
      <Sidebar />

      <div className="page">
        <SearchBar />

        <h1>Settings</h1>

        <div
          style={{
            marginTop: "32px",
          }}
        >
          <h2>Email</h2>

          <p>{user.email}</p>
        </div>

        <div
          style={{
            marginTop: "32px",
          }}
        >
          <h2>Subscription</h2>

          <p>
            {subscription}
          </p>

          {subscription === "basic" && (
            <Link to="/choose-plan">
              <button
                style={{
                  marginTop: "16px",
                }}
              >
                Upgrade
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Settings;