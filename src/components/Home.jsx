import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Home() {
  const [publicRecipes, setPublicRecipes] = useState([]);
  const [publicSpices, setPublicSpices] = useState([]);

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
    const fetchPublicSpices = async () => {
      const q = query(collection(db, "spices"), where("public", "==", true));
      const querySnapshot = await getDocs(q);
      const spicesList = [];
      querySnapshot.forEach((doc) => {
        spicesList.push({ id: doc.id, ...doc.data() });
      });
      setPublicSpices(spicesList);
    };
    fetchPublicRecipes();
    fetchPublicSpices();
  }, []);

  return (
    <section className="section" id="home">
      <h1>Welcome to your Recipe Book</h1>

      <div>
        <h2>Public Recipes</h2>
        <p>Discover a world of culinary delights with our Recipe Book app!</p>
        <ul>
          {publicRecipes.map((recipe) => (
            <li key={recipe.id}>
              <strong>{recipe.name}</strong>:{" "}
              {Array.isArray(recipe.ingredients)
                ? recipe.ingredients.join(", ")
                : ""}
              <br />
              <strong>Tags:</strong>{" "}
              {Array.isArray(recipe.tags) && recipe.tags.length > 0 ? (
                recipe.tags.join(", ")
              ) : (
                <span>No tags</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Public Spices</h2>

        <ul>
          {publicSpices.map((spice) => (
            <li key={spice.id}>
              <strong>{spice.name}</strong>:{" "}
              {Array.isArray(spice.ingredients)
                ? spice.ingredients.join(", ")
                : ""}
              <br />
              <strong>Tags:</strong>{" "}
              {Array.isArray(spice.tags) && spice.tags.length > 0 ? (
                spice.tags.join(", ")
              ) : (
                <span>No tags</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Home;
