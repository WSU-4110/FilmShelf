import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ProfilePage from "./components/profile/profilePage.jsx";
import ProfileSettings from "./components/profile/profileSettings.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import Home from "./components/home/Home";
import MoviesPage from "./components/search/MoviesPage"; 
import TvShowsPage from "./components/search/TvShowsPage"; 
import UsersPage from "./components/search/UsersPage"; 
import Register from "./components/register/register.jsx";
import WatchedMovies from "./components/profile/watchedMovies/watchedMovies";
import MovieDetailsPage from "./components/search/MovieDetailsPage"; 
import PersonDetailsPage from "./components/search/PersonDetailsPage";
import UserLists from "./components/profile/listPage/listPage.jsx";
import "./config/firebase-config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CreateReview } from "./components/reviews/reviewCreation";
import ReviewPage from "./components/reviews/reviewPage";
import UserReviews from "./components/profile/reviewsPage/reviewsPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Home route
  },
  {
    path: "profilePage",
    element: <ProfilePage />, // Profile page route
  },
  {
    path: "profileSettings",
    element: <ProfileSettings/>,
  },
  {
    path: "LoginForm",
    element: <LoginForm />, // Login form route
  },
  {
    path: "/movies", // Movies list route
    element: <MoviesPage />,
  },
  {
    path: "/movies/:id", //movie information route
    element: <MovieDetailsPage />, 
  },
  {
    path: "/tvshows", // TV Shows list route
    element: <TvShowsPage />,
  },
  {
    path: "/users", // Users list route
    element: <UsersPage />,
  },
  {
    path: "/register", // Register page route
    element: <Register />,
  },
  {
    path:"/watchedMovies",
    element: <WatchedMovies/>
  },
  {
    path:"/:id/submit",
    element: <CreateReview/>
  },
  {
    path:"/reviews/:id",
    element: <ReviewPage/>
  },
  {
    path: "/lists",
    element: <UserLists />,
  },
  {
    path: "/person/:personId", // New route for PersonDetailsPage
    element: <PersonDetailsPage />,
  },
  {
    path: "/reviews",
    element: <UserReviews/>
  }
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
