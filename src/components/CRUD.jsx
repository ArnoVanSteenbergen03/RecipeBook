import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

function CrudComponent({ collectionName, fields, initialData, onSave }) {
  const [form, setForm] = useState(initialData || {});
  const [editingId, setEditingId] = useState(initialData?.id || null);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialData || {});
    setEditingId(initialData?.id || null);
  }, [initialData]);

  const handleChange = (e, field) => {
    const value = field.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field.name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const processedForm = { ...form };
    fields.forEach((field) => {
      if (["ingredients", "tags"].includes(field.name) && typeof processedForm[field.name] === "string") {
        processedForm[field.name] = processedForm[field.name]
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
    });

    if (!editingId && collectionName === "recipes") {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        processedForm.author = user.uid;
      }
    }
    if (!editingId && collectionName === "spices") {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        processedForm.author = user.uid;
      }
    }

    if (editingId) {
      await updateDoc(doc(db, collectionName, editingId), processedForm);
    } else {
      await addDoc(collection(db, collectionName), processedForm);
    }
    setForm({});
    setError("");
    if (onSave) onSave();
  } catch (err) {
    setError("Failed to save: " + err.message);
  }
};

  return (
    <form className="modal__form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form__item" key={field.name}>
          <label className="form__label">
            {field.name}:
            {field.type === "textarea" ? (
              <textarea
                className="form__text"
                value={form[field.name] || ""}
                onChange={(e) => handleChange(e, field)}
              />
            ) : field.type === "checkbox" ? (
              <input
                className="form__checkbox"
                type="checkbox"
                checked={form[field.name] || false}
                onChange={(e) => handleChange(e, field)}
              />
            ) : (
              <input 
                className="form__input"
                type={field.type}
                value={form[field.name] || ""}
                onChange={(e) => handleChange(e, field)}
              />
            )}
          </label>
        </div>
      ))}
      <button className="form__submit" type="submit">{editingId ? "Update" : "Add"}</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

export default CrudComponent;