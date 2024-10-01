import React, { useEffect, useState } from "react";
import "./loginForm.css";
import { Navigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import { signInWithGoogle, logout } from "../auth";

const LoginForm = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false after auth state is determined
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner or placeholder while Firebase checks auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  // Navigate to home if user is logged in
  if (user) {
    document.body.style.background = "#fff";
    return <Navigate to="/home" />;
  }

  // Show login form if user is not logged in
  return (
    <div className="wrapper">
      <h1 className="title">Login using Google</h1>
      <button onClick={signInWithGoogle}>Google Sign In</button>
    </div>
  );
};
76;

export default LoginForm;
