import React, { useState, useEffect } from "react";
import './home.css';
import { NavBar } from '../nav/nav';
import { Swiper, SwiperSlide } from 'swiper/react';  // Import Swiper and SwiperSlide
import { Navigation, Pagination } from 'swiper/modules'; // Import Navigation and Pagination modules
import 'swiper/swiper-bundle.css'; // Import Swiper CSS

const Home = () => {
  const [popularFilms, setPopularFilms] = useState([]);
  const [upcomingFilms, setUpcomingFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch popular films
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API;
    const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=1`;

    fetch(popularUrl)
      .then(res => res.json())
      .then(data => {
        if (data.results) {
          setPopularFilms(data.results.slice(0, 10));
        }
      })
      .catch(err => console.error('Error fetching popular films:', err));
  }, []);

  // Fetch upcoming films
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API;
    const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&region=US&page=1`;

    fetch(upcomingUrl)
      .then(res => res.json())
      .then(data => {
        setUpcomingFilms(data.results.slice(0, 6));
      })
      .catch(err => console.error('Error fetching upcoming films:', err));
  }, []);

  const openModal = (film) => {
    setSelectedFilm(film);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFilm(null);
    setIsModalOpen(false);
  };

  return (
    <div className="home-container">
      <NavBar />
      <header className="home-header">
        <h1>Most Popular Movies</h1>
      </header>

      <main className="home-main">
        {/* Swiper carousel for popular films */}
        <Swiper
          className="popular-carousel"
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {popularFilms.map((film, index) => (
            <SwiperSlide key={index}>
              <div className="carousel-item swiper-slide-content">
                <img
                  className="swiper-image"
                  src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${film.poster_path}`}
                  alt={film.title}
                />
                <div className="swiper-info">
                  <h3>{film.title}</h3>
                  <p>{film.overview.substring(0, 100)}...</p>
                </div>
                {/*Slide Number */}
                <div className="swiper-slide-number">No. {index +1 }</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <section className="home-middle">
          <h1>Upcoming Movies</h1>
        </section>

        {/* Grid of upcoming movies */}
        <div className="item-grid">
          {upcomingFilms.map((film) => (
            <div key={film.id} className="item-card" onClick={() => openModal(film)}>
              <div className="upcoming-film">
                <img
                  src={`https://image.tmdb.org/t/p/w200/${film.poster_path}`}
                  alt={film.title}
                  className="upcoming-film-image"
                />
                <div className="upcoming-film-info">
                  <h3 className="upcoming-film-title">{film.title}</h3>
                  <p className="upcoming-film-description">{film.overview.substring(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal for movie details */}
      {isModalOpen && selectedFilm && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-body">
              <img
                src={`https://image.tmdb.org/t/p/w300/${selectedFilm.poster_path}`}
                alt={selectedFilm.title}
                className="modal-poster"
              />
              <div className="modal-info">
                <h2>{selectedFilm.title}</h2>
                <p><strong>Release Date:</strong> {selectedFilm.release_date}</p>
                <p>{selectedFilm.overview}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="home-footer">
        <p>&copy; 2024 FilmShelf</p>
      </footer>
    </div>
  );
};

export default Home;
