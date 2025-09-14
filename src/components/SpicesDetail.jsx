import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function SpicesDetail() {
  const { id } = useParams();
  const [spice, setSpice] = useState(null);

  useEffect(() => {
    const fetchSpice = async () => {
      const docRef = doc(db, "spices", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setSpice(docSnap.data());
    };
    fetchSpice();
  }, [id]);

  if (!spice) return <div>Loading...</div>;
  return (
    <div>
      <h2>{spice.name}</h2>
      <img src={spice.image} alt={spice.name} />
      <p>{spice.instructions}</p>
    </div>
  );
}

export default SpicesDetail;