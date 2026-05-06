import { ArrowLeft, Home, UserCircle2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";

export default function AppHeader() {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isHomePage =
    location.pathname === "/main" || location.pathname === "/";

  return (
    <header className="app-header">
      <div className="app-header__left">
        {!isHomePage && (
          <button className="icon-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
        )}

        <Link to="/main" className="icon-button" aria-label="Home page">
          <Home size={20} />
        </Link>
      </div>

      <div className="app-header__title">HEALTH AI</div>

      <div
        className="header-avatar"
        onClick={() => setShowMenu(!showMenu)}
      >
        <UserCircle2 size={22} />
      </div>

      {showMenu && (
        <div className="profile-menu">
          <button onClick={() => navigate("/profile")}>
            Profile
          </button>

          {currentUser?.role === "ADMIN" && (
            <button onClick={() => navigate("/admin")}>
              Admin Panel
            </button>
          )}

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}