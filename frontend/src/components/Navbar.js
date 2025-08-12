import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        GreenCart Logistics
      </Link>
      <div style={styles.navLinks}>
        {token ? (
          <>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/simulation" style={styles.link}>
              Simulation
            </Link>
            <Link to="/manage/drivers" style={styles.link}>
              Manage Drivers
            </Link>
            <Link to="/manage/routes" style={styles.link}>
              Manage Routes
            </Link>
            <Link to="/manage/orders" style={styles.link}>
              Manage Orders
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
  },
  brand: {
    fontSize: "1.5em",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#28a745",
  },
  navLinks: { display: "flex", alignItems: "center", gap: "20px" },
  link: { textDecoration: "none", color: "#333" },
  logoutButton: {
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;
