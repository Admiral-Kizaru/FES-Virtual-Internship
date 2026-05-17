import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthModal() {
  const navigate = useNavigate();

  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    register,
    loginGuest,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const isLogin = authMode === "login";

  const handleSubmit = (e) => {
    e.preventDefault();

    const authError = isLogin
      ? login(email, password)
      : register(email, password);

    if (authError) {
      setError(authError);
      return;
    }

    navigate("/for-you");

    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="auth">
      <div className="auth__modal">
        <button className="auth__close" onClick={closeAuthModal}>
          ×
        </button>

        <h3 className="auth__title">
          {isLogin ? "Log in to Summarist" : "Sign up to Summarist"}
        </h3>

        <button className="auth__google">
          <span className="auth__google-icon">
            <FcGoogle />
          </span>
          {isLogin ? "Login with Google" : "Sign up with Google"}
        </button>

        <div className="auth__divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {error && <p className="auth__error">{error}</p>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            className="auth__input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth__submit" type="submit">
            {isLogin ? "Login" : "Sign up"}
          </button>
        </form>

        <button
          className="auth__guest"
          onClick={() => {
            loginGuest();
            navigate("/for-you");
          }}
        >
          Login as Guest
        </button>

        <div className="auth__switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setError("");
              setAuthMode(isLogin ? "register" : "login");
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;