import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModel/AuthModal";

import "./Navbar.css"
export default function Navbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
           <img 
      src="/headlogo/logo1.png" 
      alt="EduMind Logo" 
      className="hero-logo" 
    />
    
          <h2 onClick={() => navigate("/")} className="logo">EduMind</h2>
          
          {/* Spaced out Tool Links */}
          {user && (
            <div className="nav-links">
              <span className="nav-link" onClick={() => navigate("/pdf")}>📝PDF Tools</span>
              <span className="nav-link" onClick={() => navigate("/quiz")}>❓Quiz Generator</span>
              <span className="nav-link" onClick={() => navigate("/roadmap")}>🗺️Roadmap</span>
              <span className="nav-link" onClick={() => navigate("/code")}>💻Code Explainer</span>
                <span className="nav-link" onClick={() => navigate("/resume")}>📄Resume Builder</span>
            </div>
          )}
        </div>

        <div className="nav-right">
          <button className="theme-btn" onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <div className="user-section">
              <div className="user-badge">
                <div className="avatar">{user.name[0].toUpperCase()}</div>
                <span className="name-text">{user.name}</span>
              </div>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowAuth(true)}>
              Login
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}