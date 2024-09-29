import React, { useEffect, useState } from "react";
import "./loginForm.css";
import { Navigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import { signInWithGoogle, logout } from "../auth";

const LoginForm = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user) {
    return <Navigate to="/home" />;
  } else {
    return (
      <div className="wrapper">
        <h1 className="title">Login using Google</h1>
        <button onClick={signInWithGoogle}>Google Sign In</button>
      </div>
    );
  }
};

export default LoginForm;
