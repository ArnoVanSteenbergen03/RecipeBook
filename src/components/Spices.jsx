import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

function Spices() {
  const [spices, setSpices] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [publicSpice, setPublicSpice] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchSpices = async () => {
      if (!user) return;
      const q = query(
        collection(db, "spices"),
        where("author", "==", `/users/${user.uid}`)
      );
      const querySnapshot = await getDocs(q);
      const spicesList = [];
      querySnapshot.forEach((doc) => {
        spicesList.push({ id: doc.id, ...doc.data() });
      });
      setSpices(spicesList);
    };
    fetchSpices();
  }, [user]);

  const handleAddSpice = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to add a spice.");
      return;
    }
    try {
      const spiceData = {
        name,
        description,
        tags: tags.split(",").map((t) => t.trim()),
        public: publicSpice,
        author: `/users/${user.uid}`,
      };
      await addDoc(collection(db, "spices"), spiceData);
      setName("");
      setDescription("");
      setTags("");
      setPublicSpice(false);
      setError("");
      const q = query(
        collection(db, "spices"),
        where("author", "==", `/users/${user.uid}`)
      );
      const querySnapshot = await getDocs(q);
      const spicesList = [];
      querySnapshot.forEach((doc) => {
        spicesList.push({ id: doc.id, ...doc.data() });
      });
      setSpices(spicesList);
    } catch (err) {
      setError("Failed to add spice: " + err.message);
    }
  };

  return (
    <div>
      <h1>Spices</h1>
      <form onSubmit={handleAddSpice} style={{ marginBottom: "2em" }}>
        <input
          type="text"
          placeholder="Spice Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={publicSpice}
            onChange={(e) => setPublicSpice(e.target.checked)}
          />
          Public
        </label>
        <button type="submit">Add Spice</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {spices.map((spice) => (
          <li key={spice.id}>
            {spice.name}: {spice.description}{" "}
            {spice.tags && spice.tags.length > 0
              ? `(${spice.tags.join(", ")})`
              : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Spices;
