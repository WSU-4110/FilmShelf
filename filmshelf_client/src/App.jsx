import { useState } from "react";
import "./App.css";
import { NavBar } from "./components/nav";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import LoginForm from "./components/login/LoginForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="home" element={<Home />}></Route>
    </Routes>
  );
}

export default App;
