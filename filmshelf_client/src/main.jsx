import App from './App.jsx'
import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import ProfilePage from './pages/profilePage.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "profilePage",
    element: <ProfilePage/>,
  },
]);
import './config/firebase-config';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
