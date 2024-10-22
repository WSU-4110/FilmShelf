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
    try {
      await doSignInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      alert("Email or password is invalid");
    }
  };

  const onRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      console.log(user);
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
    <>
      <NavBar />
      <div className="pageContainer">
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
              type="password"
              autoComplete="email"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="password"
              className="password-input"
            />
            <div className="buttonGroup">
              <button className="signIn" onClick={onSubmit}>
                Sign in
              </button>
              <button className="registerButton" onClick={onRegister}>
                Register
              </button>
            </div>
            <h1 className="title">Login using Google</h1>
            <button className="googleSignIn" onClick={signInWithGoogle}>
              Google Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
