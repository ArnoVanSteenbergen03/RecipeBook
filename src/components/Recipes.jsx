import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preptime, setPreptime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");
  const [publicRecipe, setPublicRecipe] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) return;
      const q = query(
        collection(db, "recipes"),
        where("author", "==", `/users/${user.uid}`)
      );
      const querySnapshot = await getDocs(q);
      const recipesList = [];
      querySnapshot.forEach((doc) => {
        recipesList.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(recipesList);
    };

    fetchRecipes();
  }, [user]);

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to add a recipe.");
      return;
    }
    try {
      const recipeData = {
        name,
        ingredients: ingredients.split(",").map((i) => i.trim()),
        preptime: Number(preptime),
        instructions,
        tags: tags.split(",").map((t) => t.trim()),
        public: publicRecipe,
        author: `/users/${user.uid}`,
      };
      await addDoc(collection(db, "recipes"), recipeData);
      setName("");
      setIngredients("");
      setPreptime("");
      setInstructions("");
      setTags("");
      setPublicRecipe(false);
      setError("");
      const q = query(
        collection(db, "recipes"),
        where("author", "==", `/users/${user.uid}`)
      );
      const querySnapshot = await getDocs(q);
      const recipesList = [];
      querySnapshot.forEach((doc) => {
        recipesList.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(recipesList);
    } catch (err) {
      setError("Failed to add recipe: " + err.message);
    }
  };

  return (
    <div>
      <h1>Recipes</h1>
      <form onSubmit={handleAddRecipe} style={{ marginBottom: "2em" }}>
        <input
          type="text"
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Prep Time (minutes)"
          value={preptime}
          onChange={(e) => setPreptime(e.target.value)}
          required
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
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
            checked={publicRecipe}
            onChange={(e) => setPublicRecipe(e.target.checked)}
          />
          Public
        </label>
        <button type="submit">Add Recipe</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            {recipe.name}: {recipe.ingredients.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recipes;