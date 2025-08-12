import React, { useState, useEffect } from "react";
import api from "../services/api";
import DeliveryStatusChart from "../components/charts/DeliveryStatusChart";
import FuelCostChart from "../components/charts/FuelCostChart";

const DashboardPage = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestKpis = async () => {
      try {
        const response = await api.get("/simulation/history");
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
              <h4>Total Fuel Cost</h4>
              <p>₹{parseFloat(kpis.fuel_cost).toFixed(2)}</p>
            </div>
          </div>

      
          <div style={styles.chartsContainer}>
            <div style={styles.chartBox}>
              <DeliveryStatusChart data={kpis} />
            </div>
            <div style={styles.chartBox}>
             
              {kpis.fuel_cost_breakdown ? (
                <FuelCostChart data={kpis.fuel_cost_breakdown} />
              ) : (
                <p>Run a new simulation to see fuel cost breakdown.</p>
              )}
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
  kpiContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  kpiBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    minWidth: "200px",
    textAlign: "center",
    boxShadow: "0 0 5px rgba(0,0,0,0.05)",
  },
  chartsContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  chartBox: {
    flex: 1,
    minWidth: "400px",
    border: "1px solid #eee",
    padding: "20px",
    borderRadius: "8px",
  },
};

export default DashboardPage;
