import React, { useEffect, useState } from "react";
import MovieService from "./MovieService";
import { NavBar } from "../nav/nav";
import "./MoviesPage.css";

const MoviesPage = () => {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);

  const apiKey = import.meta.env.VITE_TMDB_API;
  const movieService = new MovieService(apiKey);

  useEffect(() => {
    movieService.subscribe((event) => {
      if (event.type === "movies") {
        setMovieList(event.data);
        setFilteredMovies(event.data);
      }
      if (event.type === "genres") {
        setGenres(event.data);
      }
    });

    movieService.getMovies(selectedPage);
    movieService.getGenres();

    return () => {
      movieService.observers = [];
    };
  }, [selectedPage]);

  // Filter movies by genre
  const filterMoviesByGenre = (genreId) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      setFilteredMovies(movieList); // Reset to all movies
    } else {
      setSelectedGenre(genreId);
      const filtered = movieList.filter((movie) =>
        movie.genre_ids.includes(genreId)
      );
      setFilteredMovies(filtered);
    }
  };

  const handleNextPage = () => setSelectedPage((prevPage) => prevPage + 1);

  const handleLastPage = () =>
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1));

  const handleResetFilters = () => {
    setSelectedGenre(null);
    setSelectedPage(1);
    setFilteredMovies(movieList);
  };

  return (
    <div>
      <NavBar />
      <h1>Movies</h1>
      <div className="genre-filter-wrapper">
        <div className="genre-buttons-wrapper">
          {genres
            .filter((genre) =>
              ["Action", "Comedy", "Romance", "Adventure", "Horror"].includes(
                genre.name
              )
            )
            .map((genre) => (
              <button
                key={genre.id}
                className={`genre-button ${
                  selectedGenre === genre.id ? "active" : ""
                }`}
                onClick={() => filterMoviesByGenre(genre.id)}
              >
                {genre.name}
              </button>
            ))}
        </div>
        <div className="genre-dropdown-wrapper">
          <select
            id="genre-select"
            onChange={(e) =>
              filterMoviesByGenre(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
          >
            <option value="">More Genres</option>
            {genres
              .filter(
                (genre) =>
                  ![
                    "Action",
                    "Comedy",
                    "Romance",
                    "Adventure",
                    "Horror",
                  ].includes(genre.name)
              )
              .map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
          </select>
        </div>
        <div className="reset-button-wrapper">
          <button className="reset-button" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
      <div className="content">
        {filteredMovies.map(
          (movie) =>
            movie.poster_path && (
              <div className="movie-poster-container" key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                  onClick={() => setSelectedMovie(movie)}
                />
              </div>
            )
        )}
      </div>
      <div className="movie-pages-buttons-wrapper">
        <button onClick={handleLastPage}>{"<"}</button>
        <button onClick={handleNextPage}>{">"}</button>
      </div>
      {selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMovie(null)}>
              &times;
            </span>
            <div className="modal-body">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="modal-poster"
              />
              <div className="modal-text">
                <h2>{selectedMovie.title}</h2>
                <p>
                  <strong>Release Date:</strong> {selectedMovie.release_date}
                </p>
                <p>
                  <strong>Overview:</strong> {selectedMovie.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
