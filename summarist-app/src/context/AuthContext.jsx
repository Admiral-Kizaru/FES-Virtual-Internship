import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
/* eslint-disable react-refresh/only-export-components */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email, password) => {
    if (!email.includes("@")) {
      return "Invalid email";
    }

    if (email !== "guest@gmail.com" || password !== "guest123") {
      return "User not found";
    }

    setUser({ email });
    closeAuthModal();
    navigate("/for-you");
    return "";
  };

  const register = (email, password) => {
    if (!email.includes("@")) {
      return "Invalid email";
    }

    if (password.length < 6) {
      return "Short password";
    }

    setUser({ email });
    closeAuthModal();
    navigate("/for-you");
    return "";
  };

  const loginGuest = () => {
    setUser({ email: "guest@gmail.com" });
    closeAuthModal();
    navigate("/for-you");
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);