import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Home() {
  const [publicRecipes, setPublicRecipes] = useState([]);

  useEffect(() => {
    const fetchPublicRecipes = async () => {
      const q = query(collection(db, "recipes"), where("public", "==", true));
      const querySnapshot = await getDocs(q);
      const recipesList = [];
      querySnapshot.forEach((doc) => {
        recipesList.push({ id: doc.id, ...doc.data() });
      });
      setPublicRecipes(recipesList);
    };
    fetchPublicRecipes();
  }, []);

  return (
    <section className="section" id="home">
      <div>Welcome to the Recipe Book</div>

      <div>
        <p>Discover a world of culinary delights with our Recipe Book app!</p>
        <h2>Public Recipes</h2>
        <ul>
          {publicRecipes.map((recipe) => (
            <li key={recipe.id}>
              {recipe.name}:{" "}
              {recipe.ingredients && recipe.ingredients.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Home;