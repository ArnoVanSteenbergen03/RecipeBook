import React from "react";
import { getAuth } from "firebase/auth";
import { useLocation, Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default RequireAuth;