import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ManagementPage = () => {
  const { entity } = useParams();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/${entity}`);
        setData(response.data);
        defineColumns(entity, response.data);
      } catch (err) {
        setError(`Failed to fetch ${entity}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entity]); 

  const defineColumns = (entity, fetchedData) => {
    if (fetchedData.length === 0) return;

    switch (entity) {
      case "drivers":
        setColumns([
          { header: "Name", accessor: "name" },
          { header: "Shift Hours", accessor: "shift_hours" },
          { header: "Past Week Hours", accessor: "past_week_hours" },
        ]);
        break;
      case "routes":
        setColumns([
          { header: "Route ID", accessor: "route_id" },
          { header: "Distance (km)", accessor: "distance_km" },
          { header: "Traffic Level", accessor: "traffic_level" },
          { header: "Base Time (min)", accessor: "base_time_min" },
        ]);
        break;
      case "orders":
        setColumns([
          { header: "Order ID", accessor: "order_id" },
          { header: "Value (₹)", accessor: "value_rs" },
          { header: "Route ID", accessor: "route_id" },
          { header: "Delivery Duration", accessor: "delivery_time" },
        ]);
        break;
      default:
        setColumns([]);
    }
  };

  const renderCell = (item, column) => {
    const value = item[column.accessor];
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return value.route_id || JSON.stringify(value);
    }
    return value;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      {/* Capitalize first letter for a nice title */}
      <h1>Manage {entity.charAt(0).toUpperCase() + entity.slice(1)}</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} style={styles.th}>
                {col.header}
              </th>
            ))}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id || item.order_id}>
              {columns.map((col) => (
                <td key={col.accessor} style={styles.td}>
                  {renderCell(item, col)}
                </td>
              ))}
              <td style={styles.td}>
                {/* Placeholder buttons for CRUD actions */}
                <button style={styles.button}>Edit</button>
                <button style={{ ...styles.button, ...styles.deleteButton }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
  },
  button: {
    marginRight: "5px",
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    borderColor: "#dc3545",
  },
};

export default ManagementPage;
