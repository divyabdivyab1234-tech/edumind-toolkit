import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming your AuthContext path
import AuthModal from "./AuthModel/AuthModal"; // The modal component we'll create

export default function FeatureCard({ title, desc }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Check if user is logged in
  const [showAuth, setShowAuth] = useState(false);

  const handleClick = () => {
    // If user is logged in, navigate normally
    if (user) {
      if (title === "PDF Key Points") navigate("/pdf");
      if (title === "Quiz Generator") navigate("/quiz");
      if (title === "Task Roadmap") navigate("/roadmap");
      if (title === "Code Explainer") navigate("/code");
      if (title === "Resume Builder") navigate("/resume");
    } else {
      // If not logged in, trigger the pop-up
      setShowAuth(true);
    }
  };

  return (
    <>
      <div className="card">
        <h3>{title}</h3>
        <p>{desc}</p>
        <button className="card-btn" onClick={handleClick}>
          Explore
        </button>
      </div>

      {/* This modal only renders when showAuth is true */}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </>
  );
}