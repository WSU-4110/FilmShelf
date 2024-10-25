import React, { useState, useEffect, useRef } from "react";
import './home.css';
import { NavBar } from '../nav/nav';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const Home = () => {
  const [popularFilms, setPopularFilms] = useState([]);
  const [upcomingFilms, setUpcomingFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [genresList, setGenresList] = useState({}); // Store all genres

  const swiperRef = useRef(null);

  // Fetch genres for popular movies
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API;
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    fetch(genresUrl)
      .then(res => res.json())
      .then(data => {
        if (data.genres) {
          const genresMap = {};
          data.genres.forEach(genre => {
            genresMap[genre.id] = genre.name;
          });
          setGenresList(genresMap);
        }
      })
      .catch(err => console.error('Error fetching genres:', err));
  }, []);

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

  const handleNext = () => {
    swiperRef.current.swiper.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current.swiper.slidePrev();
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
          ref={swiperRef}
          className="popular-carousel"
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
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
                  {/* Display full movie description */}
                  <p>{film.overview}</p>
                  {/* Display genres */}
                  <div className="genres">
                    {film.genre_ids.map((genreId) => (
                      <span key={genreId} className="genre-badge">
                        {genresList[genreId]}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Slide Number */}
                <div className="swiper-slide-number">No. {currentSlide}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom navigation arrows */}
        <div className="custom-navigation">
          <button className="custom-arrow" onClick={handlePrev}>&lt;</button>
          <button className="custom-arrow" onClick={handleNext}>&gt;</button>
        </div>

        <section className="home-middle">
          <h1>Upcoming Movies</h1>
        </section>

        {/* Grid of upcoming movies */}
        <div className="item-grid">
          {upcomingFilms.map((film, index) => (
            <div key={index} className="item-card" onClick={() => openModal(film)}>
              <div className="upcoming-film">
                <img
                  className="upcoming-film-image"
                  src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${film.poster_path}`}
                  alt={film.title}
                />
                <div>
                  <h4 className="upcoming-film-title">{film.title}</h4>
                  {/* Display release date */}
                  <p className="release-date">Release Date: {new Date(film.release_date).toDateString()}</p>
                  <p className="upcoming-film-description">
                    {film.overview.substring(0, 100)}...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>Film Shelf &copy; 2023</p>
      </footer>

      {/* Modal for displaying selected film */}
      {isModalOpen && selectedFilm && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <img
                className="modal-poster"
                src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${selectedFilm.poster_path}`}
                alt={selectedFilm.title}
              />
              <div className="modal-info">
                <h2>{selectedFilm.title}</h2>
                <p>{selectedFilm.overview}</p>
                <button className="close" onClick={closeModal}>
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
