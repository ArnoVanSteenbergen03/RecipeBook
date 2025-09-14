import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import Recipes from "./components/Recipes";
import Spices from "./components/Spices";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import Account from "./components/Account";
import RecipeDetail from "./components/RecipeDetail";
import SpicesDetail from "./components/SpicesDetail";

function App() {
  const location = useLocation();
  const showNav = location.pathname !== "/login" && location.pathname !== "/register";
  return (
    <div className="app-container">
      {showNav && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/recipes" element={<RequireAuth><Recipes /></RequireAuth>} />
        <Route path="/spices" element={<RequireAuth><Spices /></RequireAuth>} />
        <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
        <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        <Route path="/recipes/:id" element={<RequireAuth><RecipeDetail /></RequireAuth>} />
        <Route path="/spices/:id" element={<RequireAuth><SpicesDetail /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
