import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="nav">
        <h1 className="nav__title">Recipe book Arno Van Steenbergen</h1>  
        <ul className="nav__list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/spices">Spices</Link></li>
          <li><Link to="/about">About</Link></li>
          <button onClick={handleLogout}>Logout</button>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;