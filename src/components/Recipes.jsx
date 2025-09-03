import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from Firestore
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const recipesList = [];
      querySnapshot.forEach((doc) => {
        recipesList.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(recipesList);
    };

    fetchRecipes();
  }, []);

  // Example: Add a recipe (call this from a button or form, not on every render)
  // const addRecipe = async () => {
  //   await addDoc(collection(db, "recipes"), { name: "Pizza", ingredients: ["cheese", "tomato"] });
  // };

  return (
    <div>
      <h1>Recipes</h1>
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