import React, { useState, useEffect } from "react";
import CrudComponent from "./CRUD";
import Modal from "./Modal";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    <div className="spices">
      <h1 className="spices__title">Spices</h1>
      <div className="spices__list">
        {spices.map((spice) => (
          <div
            className="spice__card"
            key={spice.id}
            onClick={() => navigate(`/spices/${spice.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="spice__title">{spice.name}</h3>
            <p className="spice__description">
              <strong>Description:</strong> {spice.description}
            </p>
            <p className="spice__tags">
              <strong>Tags:</strong>{" "}
              {Array.isArray(spice.tags) ? spice.tags.join(", ") : spice.tags}
            </p>
            <p className="spice__public">
              <strong>Public:</strong> {spice.public ? "Yes" : "No"}
            </p>
            <div className="spice__buttons">
            <button
              className="spice__edit-button"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(spice);
              }}
            >
              Edit
            </button>
            <button
              className="spice__delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(spice.id);
              }}
            >
              Delete
            </button>
            </div>
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
