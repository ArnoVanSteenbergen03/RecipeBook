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

function Recipes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fields = [
    { name: "name", type: "text" },
    { name: "ingredients", type: "text" },
    { name: "preptime", type: "number" },
    { name: "instructions", type: "textarea" },
    { name: "tags", type: "text" },
    { name: "public", type: "checkbox" },
  ];

  const fetchUserRecipes = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setRecipes([]);
      return;
    }
    const q = query(collection(db, "recipes"), where("author", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const recipesList = [];
    querySnapshot.forEach((doc) => {
      recipesList.push({ id: doc.id, ...doc.data() });
    });
    setRecipes(recipesList);
  };

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "recipes", id));
    fetchUserRecipes();
  };

  const handleEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRecipe(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
    fetchUserRecipes();
  };

  return (
    <div>
      <h1>Recipes</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {recipes.map((recipe) => (
          <Link to={`/recipes/${recipe.id}`}>
            <div
              key={recipe.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                width: "250px",
                background: "#fafafa",
              }}
            >
              <h3>{recipe.name}</h3>
              <p>
                <strong>Ingredients:</strong>{" "}
                {Array.isArray(recipe.ingredients)
                  ? recipe.ingredients.join(", ")
                  : recipe.ingredients}
              </p>
              <p>
                <strong>Prep Time:</strong> {recipe.preptime}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {Array.isArray(recipe.tags)
                  ? recipe.tags.join(", ")
                  : recipe.tags}
              </p>
              <p>
                <strong>Public:</strong> {recipe.public ? "Yes" : "No"}
              </p>
              <button onClick={() => handleEdit(recipe)}>Edit</button>
              <button onClick={() => handleDelete(recipe.id)}>Delete</button>
            </div>
          </Link>
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
        aria-label="Add Recipe"
      >
        +
      </button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CrudComponent
          collectionName="recipes"
          fields={fields}
          initialData={selectedRecipe}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
}

export default Recipes;
