import React, { useEffect, useState } from "react";
import "./loginForm.css";
import { auth } from "../../config/firebase-config";
import { signInWithGoogle, doSignInWithEmailAndPassword } from "../auth";
import { NavBar } from "../nav/nav";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await doSignInWithEmailAndPassword(email, password);
  };

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
          <input
            type="text"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            className="email-input"
          />
          <input
            type="text"
            autoComplete="email"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="password"
            className="password-input"
          />
          <button className="submit" onClick={onSubmit}>
            Sign in
          </button>
          <h1 className="title">Login using Google</h1>
          <button className="sign-in" onClick={signInWithGoogle}>
            Google Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
76;

export default LoginForm;
