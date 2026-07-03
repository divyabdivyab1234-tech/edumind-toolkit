import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session when the app loads
  useEffect(() => {
    const savedUser = localStorage.getItem("eduMind_user");
    const token = localStorage.getItem("eduMind_token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * loginUser function
   * @param {Object} data - Should contain { token, user: { name, email ... } }
   */
  const loginUser = (data) => {
    // 1. Save to LocalStorage for persistence
    localStorage.setItem("eduMind_token", data.token);
    localStorage.setItem("eduMind_user", JSON.stringify(data.user));

    // 2. Update the React state
    setUser(data.user);
    
    console.log("AuthContext: User state updated successfully", data.user);
  };

  /**
   * logout function
   * Clears session and local storage
   */
  const logout = () => {
    localStorage.removeItem("eduMind_token");
    localStorage.removeItem("eduMind_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};