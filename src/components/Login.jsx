import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
import app from "../../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          navigate("/");
        }
      })
      .catch((err) => setError(err.message));

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login">
      <h2 className="login__title">Login</h2>
      <form onSubmit={handleEmailLogin} className="login__form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login__input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login__input"
        />
        <button type="submit" className="login__button">Login</button>
      </form>
      <div style={{ marginTop: "1em" }} className="login__register-link">
        <Link to="/register">Don't have an account? Register</Link>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
