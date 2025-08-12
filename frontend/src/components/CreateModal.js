import React, { useState } from "react";
import api from "../services/api";

const CreateModal = ({ entity, columns, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.accessor]: "" }), {})
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = { ...formData };
      for (const key in payload) {
        if (payload[key] === "") {
          delete payload[key];
        } else if (
          key.includes("hours") ||
          key.includes("id") ||
          key.includes("km") ||
          key.includes("min") ||
          key.includes("rs")
        ) {
          if (key === "past_week_hours" && typeof payload[key] === "string") {
            payload[key] = payload[key].split(",").map(Number);
          } else {
            payload[key] = Number(payload[key]);
          }
        }
      }

      await api.post(`/${entity}`, payload);
      onSave(); 
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create item. Please check your inputs."
      );
      console.error(err);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Create New {entity.slice(0, -1)}</h2>
        <form onSubmit={handleSubmit}>
          {columns.map((col) => (
            <div key={col.accessor} style={styles.inputGroup}>
              <label>{col.header}</label>
              <input
                type="text"
                name={col.accessor}
                value={formData[col.accessor] || ""}
                onChange={handleChange}
                placeholder={col.header}
                style={styles.input}
                required
              />
            </div>
          ))}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton}>
              Create
            </button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    width: "450px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  inputGroup: { marginBottom: "15px" },
  input: {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  saveButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
};

export default CreateModal;
