import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./AuthModel.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const { loginUser } = useAuth();

  if (!isOpen) return null;

 const handleSubmit = async (e) => {
  e.preventDefault();
  const url = isLogin ? "https://edumind-toolkit.onrender.com/api/auth/login" : "https://edumind-toolkit.onrender.com/api/auth/register";
  
  try {
    const res = await axios.post(url, formData);
    
    // DEBUG: Look at your browser console to see exactly what the backend sent
    console.log("Response from server:", res.data);

    if (isLogin) {
      // res.data contains { token, user: { name, email } }
      // Make sure this matches your AuthContext function name!
      loginUser(res.data); 
      onClose();
    } else {
      alert("Registration successful! Switching to login...");
      setIsLogin(true);
    }
  } catch (err) {
    // If the backend sent a 200, but this code crashes, check your loginUser function
    console.error("Frontend Error:", err);
    alert(err.response?.data?.message || "Something went wrong on the frontend");
  }
};

  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{isLogin ? "Login to EduMind" : "Create Account"}</h2>
        <p>Please {isLogin ? "sign in" : "register"} to access this tool</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
          <button type="submit" className="auth-btn">
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register here" : " Login here"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;