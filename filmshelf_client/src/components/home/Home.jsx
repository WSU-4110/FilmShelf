import React from "react";
import './home.css';
import { NavBar } from '../nav/nav';
import SearchBar from '../search/SearchBar';

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <h1>Home Page</h1>
        <SearchBar /> {/* The search bar remains in Home */}
      </div>
    </div>
  );
};

export default Home;
