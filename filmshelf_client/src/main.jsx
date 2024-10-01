import App from './App.jsx'
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import ProfilePage from './components/profile/profilePage.jsx';
import LoginForm from "./components/login/LoginForm.jsx";
import Home from "./components/home/Home";
import "./config/firebase-config";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "profilePage",
    element: <ProfilePage/>,
  },
  {
    path: "LoginForm",
    element: <LoginForm/>,
  },
  
]);
import './config/firebase-config';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
