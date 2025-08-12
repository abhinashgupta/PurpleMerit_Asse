import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ isAuthenticated: true }); 
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setUser({ isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
