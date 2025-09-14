import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function CrudComponent({ collectionName, fields }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setItems(list);
      } catch (err) {
        setError("Failed to fetch: " + err.message);
      }
    };
    fetchItems();
  }, [collectionName]);

  // Handle form change
  const handleChange = (e, field) => {
    const value = field.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field.name]: value });
  };

  // Add or update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), form);
        setEditingId(null);
      } else {
        await addDoc(collection(db, collectionName), form);
      }
      setForm({});
      setError("");
      const querySnapshot = await getDocs(collection(db, collectionName));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setItems(list);
    } catch (err) {
      setError("Failed to save: " + err.message);
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete: " + err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label>
              {field.name}:
              {field.type === "textarea" ? (
                <textarea
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(e, field)}
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={form[field.name] || false}
                  onChange={(e) => handleChange(e, field)}
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(e, field)}
                />
              )}
            </label>
          </div>
        ))}
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {fields.map((field) => (
              <span key={field.name}>
                <strong>{field.name}:</strong> {String(item[field.name])}{" "}
              </span>
            ))}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrudComponent;
