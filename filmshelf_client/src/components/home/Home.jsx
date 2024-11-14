import React, { useState, useEffect } from "react";
import './home.css';
import { NavBar } from '../nav/nav';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const Home = () => {
  const [popularFilms, setPopularFilms] = useState([]);
  const [upcomingFilms, setUpcomingFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [genresList, setGenresList] = useState({});

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API;
    const fetchData = async () => {
      try {
        const genresRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
        const genresData = await genresRes.json();
        const genresMap = {};
        genresData.genres.forEach(genre => genresMap[genre.id] = genre.name);
        setGenresList(genresMap);

        const popularRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&region=US&page=1`);
        const popularData = await popularRes.json();
        setPopularFilms(popularData.results.slice(0, 10));

        const upcomingRes = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&region=US&page=1`);
        const upcomingData = await upcomingRes.json();
        setUpcomingFilms(upcomingData.results.slice(0, 6));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
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
      {/* Dynamic background image using first popular movie poster */}
      <header
        className="home-header"
        style={{
        }}
      >
        <h1>Most Popular Movies</h1>
      </header>

      <main className="home-main">
        <Swiper
          className="popular-carousel"
          modules={[Pagination, Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.custom-next',
            prevEl: '.custom-prev'
          }}
          loop={true}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
        >
          {popularFilms.map((film, index) => (
            <SwiperSlide key={index}>
              <div
                className="carousel-item swiper-slide-content"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w600_and_h900_bestv2${film.poster_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'top',
                  backgroundBlendMode: 'overlay',
                  opacity: 0.7
                }}
              >
                <img
                  className="swiper-image"
                  src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${film.poster_path}`}
                  alt={film.title}
                />
                <div className="swiper-info">
                  <h3>{film.title}</h3>
                  <div className="genres">
                    {film.genre_ids.map((genreId) => (
                      <span key={genreId} className="genre-badge">
                        {genresList[genreId]}
                      </span>
                    ))}
                  </div>
                  <p>{film.overview}</p>
                </div>
                <div className="swiper-slide-number">No. {currentSlide}</div>
              </div>
            </SwiperSlide>
          ))}

          <button className="custom-prev custom-arrow">&lt;</button>
          <button className="custom-next custom-arrow">&gt;</button>
        </Swiper>

        <section className="home-middle">
          <h1>Upcoming Movies</h1>
        </section>

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

      <footer className="home-footer">
        <p>Film Shelf &copy; 2024</p>
      </footer>

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
                <div className="modal-genres">
                  {selectedFilm.genre_ids.map((genreId) => (
                    <span key={genreId} className="genre-badge">
                      {genresList[genreId]}
                    </span>
                  ))}
                </div>
                <p>{selectedFilm.overview}</p>
                <button className="close" onClick={closeModal}>&times;</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
