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
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Recipes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [spicesMap, setSpicesMap] = useState({});
  const navigate = useNavigate();

  const fields = [
    { name: "name", type: "text" },
    { name: "ingredients", type: "text" },
    { name: "preptime", type: "number" },
    { name: "instructions", type: "textarea" },
    { name: "tags", type: "text" },
    { name: "public", type: "checkbox" },
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchUserRecipes(firebaseUser);
        fetchSpices(firebaseUser);
      } else {
        setRecipes([]);
        setSpicesMap({});
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRecipes = async (firebaseUser) => {
    if (!firebaseUser) {
      setRecipes([]);
      return;
    }
    const q = query(
      collection(db, "recipes"),
      where("author", "==", firebaseUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const recipesList = [];
    querySnapshot.forEach((doc) => {
      recipesList.push({ id: doc.id, ...doc.data() });
    });
    setRecipes(recipesList);
  };

  const fetchSpices = async (firebaseUser) => {
    const spicesRef = collection(db, "spices");
    const publicQ = query(spicesRef, where("isPublic", "==", true));
    let spices = [];
    const publicSnap = await getDocs(publicQ);
    spices = publicSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (firebaseUser) {
      const userQ = query(spicesRef, where("author", "==", firebaseUser.uid));
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
    const map = {};
    spices.forEach((spice) => {
      map[spice.id] = spice.name;
    });
    setSpicesMap(map);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "recipes", id));
    if (user) {
      fetchUserRecipes(user);
    }
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
    if (user) {
      fetchUserRecipes(user);
    }
  };

  return (
    <div className="recipes">
      <h1 className="recipes__title">Your Recipes</h1>
      <div className="recipes__list">
        {recipes.map((recipe) => (
          <div
            className="recipe__card"
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="card__title">{recipe.name}</h3>
            <p className="card__ingredients">
              <strong>Ingredients:</strong>{" "}
              {Array.isArray(recipe.ingredients)
                ? recipe.ingredients.join(", ")
                : recipe.ingredients}
            </p>
            <p className="card__preptime">
              <strong>Prep Time:</strong> {recipe.preptime}
            </p>
            <p className="card__tags">
              <strong>Tags:</strong>{" "}
              {Array.isArray(recipe.tags)
                ? recipe.tags.join(", ")
                : recipe.tags}
            </p>
            <p className="card__public">
              <strong>Public:</strong> {recipe.public ? "Yes" : "No"}
            </p>
            <p className="card__spices">
              <strong>Spices:</strong>{" "}
              {Array.isArray(recipe.spices) && recipe.spices.length > 0
                ? recipe.spices.map((id) => spicesMap[id] || id).join(", ")
                : "None"}
            </p>
            <div className="recipe__buttons">
              <button
                className="card__edit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(recipe);
                }}
              >
                Edit
              </button>
              <button
                className="card__delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(recipe.id);
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
