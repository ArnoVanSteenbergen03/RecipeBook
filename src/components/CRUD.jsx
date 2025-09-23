import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

function CrudComponent({ collectionName, fields, initialData, onSave }) {
  const [form, setForm] = useState(initialData || {});
  const [editingId, setEditingId] = useState(initialData?.id || null);
  const [error, setError] = useState("");
  const [spicesList, setSpicesList] = useState([]);
  const [spiceSearch, setSpiceSearch] = useState("");
  const [selectedSpices, setSelectedSpices] = useState(
    initialData?.spices || []
  );

  useEffect(() => {
    setForm(initialData || {});
    setEditingId(initialData?.id || null);
    setSelectedSpices(initialData?.spices || []);
  }, [initialData]);

  useEffect(() => {
    const fetchSpices = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const spicesRef = collection(db, "spices");
      const publicQ = query(spicesRef, where("isPublic", "==", true));
      let spices = [];
      const publicSnap = await getDocs(publicQ);
      spices = publicSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (user) {
        const userQ = query(spicesRef, where("author", "==", user.uid));
        const userSnap = await getDocs(userQ);
        const userSpices = userSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        spices = [
          ...spices,
          ...userSpices.filter((s) => !spices.some((ps) => ps.id === s.id)),
        ];
      }
      setSpicesList(spices);
    };
    if (collectionName === "recipes") fetchSpices();
  }, [collectionName]);

  const handleChange = (e, field) => {
    const value = field.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field.name]: value });
  };

  const handleSpiceToggle = (id) => {
    setSelectedSpices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedForm = { ...form };
      fields.forEach((field) => {
        if (
          ["ingredients", "tags"].includes(field.name) &&
          typeof processedForm[field.name] === "string"
        ) {
          processedForm[field.name] = processedForm[field.name]
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        }
      });

      if (collectionName === "recipes") {
        processedForm.spices = selectedSpices;
      }

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
      {collectionName === "recipes" && (
        <div className="form__item">
          <label className="form__label">Spices:</label>
          <input
            type="text"
            placeholder="Search spices..."
            value={spiceSearch}
            onChange={(e) => setSpiceSearch(e.target.value)}
            className="form__input"
            style={{ marginBottom: "0.5em" }}
          />
          <div
            className="spices__list"
            style={{ maxHeight: "150px", overflowY: "auto" }}
          >
            {spicesList
              .filter((spice) =>
                spice.name.toLowerCase().includes(spiceSearch.toLowerCase())
              )
              .map((spice) => (
                <div key={spice.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedSpices.includes(spice.id)}
                      onChange={() => handleSpiceToggle(spice.id)}
                    />
                    {spice.name}
                  </label>
                </div>
              ))}
            {spicesList.length === 0 && <div>No spices found.</div>}
          </div>
        </div>
      )}
      <button className="form__submit" type="submit">
        {editingId ? "Update" : "Add"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

export default CrudComponent;
