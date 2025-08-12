import React, { useState, useEffect } from "react";
import api from "../services/api";

const EditModal = ({ item, entity, columns, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const initialData = columns.reduce((acc, col) => {
      if (
        entity === "orders" &&
        col.accessor === "route_id" &&
        typeof item[col.accessor] === "object"
      ) {
        acc[col.accessor] = item[col.accessor]?.route_id;
      } else {
        acc[col.accessor] = item[col.accessor];
      }
      return acc;
    }, {});
    setFormData(initialData);
  }, [item, columns, entity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...formData };

      if (
        entity === "drivers" &&
        payload.past_week_hours &&
        typeof payload.past_week_hours === "string"
      ) {
        payload.past_week_hours = payload.past_week_hours
          .split(",")
          .map(Number);
      }

      await api.put(`/${entity}/${item._id}`, payload);
      onSave();
    } catch (err) {
      setError("Failed to update item. Please check your inputs.");
      console.error(err);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Edit {entity.slice(0, -1)}</h2>
        <form onSubmit={handleSubmit}>
          {columns.map((col) => {
            const isReadOnly = ["_id", "order_id", "route_id"].includes(
              col.accessor
            );

            return (
              <div key={col.accessor} style={styles.inputGroup}>
                <label>{col.header}</label>
                <input
                  type="text"
                  name={col.accessor}
                  value={
                    Array.isArray(formData[col.accessor])
                      ? formData[col.accessor].join(",")
                      : formData[col.accessor] || ""
                  }
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  style={isReadOnly ? styles.readOnlyInput : styles.input}
                />
              </div>
            );
          })}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton}>
              Save Changes
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
  readOnlyInput: {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#e9ecef",
    cursor: "not-allowed",
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
    backgroundColor: "#28a745",
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

export default EditModal;
