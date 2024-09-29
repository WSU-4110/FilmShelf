import App from "./App.jsx";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";

// Import Firebase app to ensure it initializes when your app loads
import "./config/firebase-config";
import LoginForm from "./components/login/LoginForm.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginForm />
  </React.StrictMode>
);
