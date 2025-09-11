import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
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