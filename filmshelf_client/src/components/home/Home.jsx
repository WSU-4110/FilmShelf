import React, { useState, useEffect } from "react";
import './home.css';
import { NavBar } from '../nav/nav';

const Home = () => {
  const [popularFilms, setPopularFilms] = useState([]);
  const [upcomingFilms, setUpcomingFilms] = useState([]); // State for upcoming films
  const [currentSlide, setCurrentSlide] = useState(0);
  const filmsPerSlide = 1; // Number of films to display per slide

  // Fetch the most popular movies
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API;
    const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=1`;

    fetch(popularUrl)
      .then(res => res.json())
      .then(data => {
        setPopularFilms(data.results.slice(0, 10)); // Store the top 10 popular movies
      })
      .catch(err => console.error('Error fetching popular films:', err));
  }, []);

  // Fetch upcoming movies for the US region
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API;
    const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&region=US&page=1`; // Added region=US

    fetch(upcomingUrl)
      .then(res => res.json())
      .then(data => {
        setUpcomingFilms(data.results.slice(0, 6)); // Store the first 6 upcoming movies
      })
      .catch(err => console.error('Error fetching upcoming films:', err));
  }, []);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % popularFilms.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + popularFilms.length) % popularFilms.length);
  };

  return (
    <div className="home-container">
      {/* Main Page setup */}
      <NavBar />

      <header className="home-header">
        <h1>Most Popular Movies</h1>
      </header>

      <main className="home-main">
        {/* Custom Carousel for Popular Films */}
        <div className="popular-carousel">
          {popularFilms.length > 0 && (
            <div className="carousel">
              <div className="carousel-content">
                <div className="carousel-item">
                  <img src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${popularFilms[currentSlide].poster_path}`} alt={popularFilms[currentSlide].title} />
                  <h3>{popularFilms[currentSlide].title}</h3>
                  <p>{popularFilms[currentSlide].overview.substring(0, 100)}...</p>
                  <p><strong>Genres:</strong> {popularFilms[currentSlide].genre_ids.join(', ')}</p> {/* Display genres */}
                </div>
              </div>
              <div className="carousel-controls">
                <button onClick={prevSlide} className="arrow left-arrow">&#9664;</button>
                <button onClick={nextSlide} className="arrow right-arrow">&#9654;</button>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Movies */}
        <section className="home-middle">
          <h1>Upcoming Movies</h1> {/* Changed header to Upcoming Movies */}
        </section>

        <div className="item-grid">
          {upcomingFilms.map((film) => (
            <div key={film.id} className="item-card">
              <div className="upcoming-film">
                <img src={`https://image.tmdb.org/t/p/w200/${film.poster_path}`} alt={film.title} className="upcoming-film-image" />
                <div className="upcoming-film-info">
                  <h3 className="upcoming-film-title">{film.title}</h3>
                  <p className="upcoming-film-description">{film.overview.substring(0, 100)}...</p> {/* Shorten description for cards */}
                </div>
              </div>
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
