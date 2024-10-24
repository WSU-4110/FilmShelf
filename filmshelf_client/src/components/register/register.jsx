import React, { useEffect, useState } from "react";
import "./register.css";
import { NavBar } from "../nav/nav";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { auth, googleProvider } from "../../config/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";

//Create the User on firebase
//Send email and lastName to firestore as well
export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  lastName
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const currentUser = result.user;
  await saveUserToFirestore(currentUser, email, lastName);
  return result;
};

//save create user info inside of firestore upon creation
const saveUserToFirestore = async (user, email, lastName) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName: lastName,
      email: email,
      lists: null,
      reviews: null,
      watchedMovies: null,
      public: false,
      followed: null,
      lastLogin: new Date(),
    },
    { merge: true }
  );
};
const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");

  const navigate = useNavigate();

  /* ==================================
    handle the user clicking on register
    send email, password, and lastName to createUser
   
    ==================================
   */
  const handleRegister = async () => {
    try {
      const result = await doCreateUserWithEmailAndPassword(
        email,
        password,
        lastName
      );
      // Redirect after successful registration
      navigate("/LoginForm");
    } catch (error) {
      alert("This email already exists");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="pageContainer">
        <div className="loginContainer">
          <div className="wrapper">
            <div className="nameFields">
              <input
                type="text"
                autoComplete="First Name"
                placeholder="First Name"
                className="email-input"
                value={firstName}
                onChange={(e) => {
                  setfirstName(e.target.value);
                }}
              />
              <input
                type="text"
                autoComplete="Last Name"
                placeholder="Last Name"
                className="password-input"
                value={lastName}
                onChange={(e) => {
                  setlastName(e.target.value);
                }}
              />
            </div>
            <div className="emailPasswordFields">
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
            </div>
            <button className="register" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default register;
