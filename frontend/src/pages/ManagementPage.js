import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import EditModal from "../components/EditModal"; 

const ManagementPage = () => {
  const { entity } = useParams();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = useCallback(async () => {
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
  }, [entity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/${entity}/${id}`);
        setData(data.filter((item) => item._id !== id));
      } catch (err) {
        setError(`Failed to delete item. Please try again.`);
        console.error(err);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchData(); 
  };

  const renderCell = (item, column) => {
    const value = item[column.accessor];

    if (
      entity === "orders" &&
      column.accessor === "route_id" &&
      typeof value === "object" &&
      value !== null
    ) {
      return value.route_id;
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return value;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
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
            <tr key={item._id}>
              {columns.map((col) => (
                <td key={col.accessor} style={styles.td}>
                  {renderCell(item, col)}
                </td>
              ))}
              <td style={styles.td}>
                <button onClick={() => handleEdit(item)} style={styles.button}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{ ...styles.button, ...styles.deleteButton }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditModal
          item={editingItem}
          entity={entity}
          columns={columns}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};


const styles = {
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: { border: "1px solid #ddd", padding: "12px" },
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
