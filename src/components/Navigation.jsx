import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Navigation() {
  const [userdata, setUserdata] = useState({ name: "", lastname: "" });
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserdata = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDataRef = doc(db, `users/${user.uid}`);
        const userDataSnap = await getDoc(userDataRef);
        if (userDataSnap.exists()) {
          setUserdata(userDataSnap.data());
        }
      }
    };
    fetchUserdata();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="nav">
        <h1 className="nav__title">
          Recipe book of {userdata.name} {userdata.lastname}
        </h1>
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