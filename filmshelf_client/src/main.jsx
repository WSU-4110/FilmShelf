import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ProfilePage from "./components/profile/profilePage.jsx";
import ProfileSettings from "./components/profile/profileSettings.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import Home from "./components/home/Home";
import MoviesPage from "./components/search/MoviesPage"; // Update to reflect search folder
import TvShowsPage from "./components/search/TvShowsPage"; // Update to reflect search folder
import UsersPage from "./components/search/UsersPage"; // Update to reflect search folder
import Register from "./components/register/register.jsx";
import "./config/firebase-config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Update your router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Keep the existing Home route
  },
  {
    path: "profilePage",
    element: <ProfilePage />, // Keep the existing Profile page route
  },
  {
    path: "profileSettings",
    element: <ProfileSettings/>,
  },
  {
    path: "LoginForm",
    element: <LoginForm />, // Keep the existing Login page route
  },
  {
    path: "/movies", // New route for Movies
    element: <MoviesPage />,
  },
  {
    path: "/tvshows", // New route for TV Shows
    element: <TvShowsPage />,
  },
  {
    path: "/users", // New route for Users
    element: <UsersPage />,
  },
  {
    path: "/register", // New route for Users
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
