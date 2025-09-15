import React, { useState, useEffect } from "react";
import CrudComponent from "./CRUD";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Spices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spices, setSpices] = useState([]);
  const [selectedSpice, setSelectedSpice] = useState(null);

  const fields = [
    { name: "name", type: "text" },
    { name: "description", type: "textarea" },
    { name: "tags", type: "text" },
    { name: "public", type: "checkbox" },
  ];

  const fetchUserSpices = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setSpices([]);
      return;
    }
    const q = query(collection(db, "spices"), where("author", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const spicesList = [];
    querySnapshot.forEach((doc) => {
      spicesList.push({ id: doc.id, ...doc.data() });
    });
    setSpices(spicesList);
  };

  useEffect(() => {
    fetchUserSpices();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "spices", id));
    fetchUserSpices();
  };

  const handleEdit = (spice) => {
    setSelectedSpice(spice);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSpice(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedSpice(null);
    fetchUserSpices();
  };

  return (
    <div>
      <h1>Spices</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {spices.map((spice) => (
          <div
            className="spice__card"
            key={spice.id}
            onClick={() => navigate(`/spices/${spice.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3>{spice.name}</h3>
            <p>
              <strong>Description:</strong> {spice.description}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {Array.isArray(spice.tags) ? spice.tags.join(", ") : spice.tags}
            </p>
            <p>
              <strong>Public:</strong> {spice.public ? "Yes" : "No"}
            </p>
            <button onClick={() => handleEdit(spice)}>Edit</button>
            <button onClick={() => handleDelete(spice.id)}>Delete</button>
          </div>
        ))}
      </div>

      <button
        style={{
          fontSize: "2rem",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 1000,
        }}
        onClick={handleAdd}
        aria-label="Add Spice"
      >
        +
      </button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CrudComponent
          collectionName="spices"
          fields={fields}
          initialData={selectedSpice}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
}

export default Spices;
