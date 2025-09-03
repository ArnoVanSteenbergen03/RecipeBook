import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import Recipes from "./components/Recipes";
import Spices from "./components/Spices";
import About from "./components/About";

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/spices" element={<Spices />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;