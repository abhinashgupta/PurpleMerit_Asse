import React, { useState, useEffect } from "react";
import api from "../services/api";

const DashboardPage = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestKpis = async () => {
      try {
        const response = await api.get("/simulation/history?limit=1");
        if (response.data && response.data.length > 0) {
          setKpis(response.data[0]);
        } else {
          setKpis(null); 
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };

    fetchLatestKpis();
  }, []);

  if (loading) return <div>Loading Dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {kpis ? (
        <div>
          <h3>Latest Simulation Results</h3>
          <div style={styles.kpiContainer}>
            <div style={styles.kpiBox}>
              <h4>Total Profit</h4>
              <p>₹{parseFloat(kpis.total_profit).toFixed(2)}</p>
            </div>
            <div style={styles.kpiBox}>
              <h4>Efficiency Score</h4>
              <p>{parseFloat(kpis.efficiency_score).toFixed(2)}%</p>
            </div>
            <div style={styles.kpiBox}>
              <h4>On-Time Deliveries</h4>
              <p>{kpis.on_time_deliveries}</p>
            </div>
            <div style={styles.kpiBox}>
              <h4>Late Deliveries</h4>
              <p>{kpis.late_deliveries}</p>
            </div>
          </div>
          
        </div>
      ) : (
        <p>
          No simulation has been run yet. Go to the Simulation page to run one.
        </p>
      )}
    </div>
  );
};

const styles = {
  kpiContainer: { display: "flex", gap: "20px", flexWrap: "wrap" },
  kpiBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    minWidth: "200px",
    textAlign: "center",
    boxShadow: "0 0 5px rgba(0,0,0,0.05)",
  },
};

export default DashboardPage;
