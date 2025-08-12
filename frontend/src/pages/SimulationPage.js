import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SimulationPage = () => {
  const [numDrivers, setNumDrivers] = useState(10);
  const [maxHours, setMaxHours] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const response = await api.post("/simulation/run", {
        num_drivers: parseInt(numDrivers, 10),
        max_hours_per_driver: parseInt(maxHours, 10),
      });
      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred during the simulation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Run Delivery Simulation</h1>
      <form onSubmit={handleRunSimulation} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Number of Available Drivers</label>
          <input
            type="number"
            value={numDrivers}
            onChange={(e) => setNumDrivers(e.target.value)}
            min="1"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Max Hours per Driver per Day</label>
          <input
            type="number"
            value={maxHours}
            onChange={(e) => setMaxHours(e.target.value)}
            min="1"
            required
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Running..." : "Run Simulation"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>Error: {error}</p>
      )}

      {results && (
        <div style={{ marginTop: "30px" }}>
          <h2>Simulation Results</h2>
          <div style={styles.kpiContainer}>
            <div style={styles.kpiBox}>
              <h4>Total Profit</h4>
              <p>₹{results.total_profit}</p>
            </div>
            <div style={styles.kpiBox}>
              <h4>Efficiency Score</h4>
              <p>{results.efficiency_score}%</p>
            </div>
            <div style={styles.kpiBox}>
              <h4>On-Time Deliveries</h4>
              <p>{results.on_time_deliveries}</p>
            </div>
            <div style={styles.kpiBox}>
              <h4>Late Deliveries</h4>
              <p>{results.late_deliveries}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ ...styles.button, marginTop: "20px" }}
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  form: {
    maxWidth: "500px",
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "8px",
  },
  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  input: { padding: "8px", marginTop: "5px" },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  kpiContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  kpiBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    minWidth: "200px",
    textAlign: "center",
    boxShadow: "0 0 5px rgba(0,0,0,0.05)",
  },
};

export default SimulationPage;
