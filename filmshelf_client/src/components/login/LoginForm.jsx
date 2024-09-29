import React, { useEffect, useState } from "react";
import "./loginForm.css";

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

  return (
    <div className="wrapper">
      <form action="">
        <h1 className="title">Login using Google</h1>
        {user ? (
          <button onClick={logout}>Log Out</button>
        ) : (
          <button onClick={signInWithGoogle}>Google Sign In</button>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
