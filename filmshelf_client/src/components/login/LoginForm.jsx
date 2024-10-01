import React, { useEffect, useState } from "react";
import "./loginForm.css";
import { auth } from "../../config/firebase-config";
import { signInWithGoogle } from "../auth";
import { NavBar } from "../nav/nav";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Navigate to home if user is logged in
  if (user) {
    document.body.style.background = "#fff";
    return <Navigate to="/home" />;
  }

  // Show login form if user is not logged in
  return (
    <div>
      <NavBar />
      <div className="loginContainer">
        <div className="wrapper">
          <h1 className="title">Login using Google</h1>
          <button onClick={signInWithGoogle}>Google Sign In</button>
        </div>
      </div>
    </div>
  );
};
76;

export default LoginForm;
