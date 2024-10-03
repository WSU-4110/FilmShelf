import React from "react";
import './home.css';
import { NavBar } from '../nav/nav';

const Home = () => {
  //The Featured film (soon to be top films) ETA: \o/
  const featuredItems = {
    id: 0,
    title: "Film 0",
    cover: "https://via.placeholder.com/600x400", //Larger placeholder at the top for the big movies can be changed
    description: "This movie is super cool and awesome it was done in a brand new way blah blah blah. This will have the plot, genre, details, and notable cast",
  };



  //The "newer" items that are added to the films and other things
  const items = [
    { id: 1, title: "Film 1", cover: "https://via.placeholder.com/150" },
    { id: 2, title: "Film 2", cover: "https://via.placeholder.com/150" },
    { id: 3, title: "Film 3", cover: "https://via.placeholder.com/150" },
    { id: 4, title: "Film 4", cover: "https://via.placeholder.com/150" },
    { id: 5, title: "Film 5", cover: "https://via.placeholder.com/150" },
    { id: 6, title: "Film 6", cover: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="home-container">
      {/* Main Page setup */}
      <NavBar />
      <header className="home-header">
        <h1>Popular New Films</h1>
      </header>

      <main className="home-main">
      {/*Featured FIlm Section */}
      <div className="featuredinfo">
        <div className="featured-items">
          <img src={featuredItems.cover} alt={featuredItems.title} className="featured-images" />
        <div className="description"> </div>
          <h2>{featuredItems.title}</h2>
          <p className="description">{featuredItems.description}</p>
          </div>
        </div>

      <middle className="home-middle">
        <h1>Latest Film Releases</h1>
      </middle>

        <div className="item-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <img src={item.cover} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2024 FilmShelf</p>
      </footer>
    </div>
  );
};

export default Home;
