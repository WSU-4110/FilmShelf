import React, { useEffect, useState } from "react";
import { NavBar } from "../nav/nav";
import "./MoviesPage.css"; // Include your CSS file

const MoviesPage = () => {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]); // For displaying filtered movies
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null); // Track selected genre
  const [selectedMovie, setSelectedMovie] = useState(null); // Track the clicked movie

  // Fetch movies
  const getMovies = () => {
    fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=75376fc32c70731a3eb507d65789e638"
    )
      .then((res) => res.json())
      .then((json) => {
        setMovieList(json.results);
        setFilteredMovies(json.results); // Set filtered movies initially to all movies
      })
      .catch((error) => console.error("Error fetching movies:", error));
  };

  // Fetch genres
  const getGenres = () => {
    fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=75376fc32c70731a3eb507d65789e638&language=en-US"
    )
      .then((res) => res.json())
      .then((json) => setGenres(json.genres))
      .catch((error) => console.error("Error fetching genres:", error));
  };

  useEffect(() => {
    getMovies();
    getGenres();
  }, []);

  // Handle when a movie is clicked
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); // Set the clicked movie as selected
  };

  // Handle modal close
  const closeModal = () => {
    setSelectedMovie(null); // Deselect the movie to close the modal
  };

  // Filter movies by genre
  const filterMoviesByGenre = (genreId) => {
    setSelectedGenre(genreId);
    if (genreId) {
      const filtered = movieList.filter((movie) =>
        movie.genre_ids.includes(genreId)
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movieList); // Reset to all movies if no genre is selected
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Movies</h1>

      {/* Genre Filter */}
      <div>
        <label htmlFor="genre-select">Filter by Genre: </label>
        <select
          id="genre-select"
          onChange={(e) =>
            filterMoviesByGenre(
              e.target.value ? parseInt(e.target.value) : null
            )
          }
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
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
                  onClick={() => handleMovieClick(movie)} // Click to show modal
                />
              </div>
            )
        )}
      </div>

      {/* Conditionally render modal for movie details */}
      {selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-body">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} // Poster in the modal
                alt={selectedMovie.title}
                className="modal-poster" // Class for styling the poster
              />
              <div className="modal-text">
                <h2>{selectedMovie.title}</h2>
                <p>
                  <strong>Release Date:</strong> {selectedMovie.release_date}
                </p>
                <p>
                  <strong>Overview:</strong> {selectedMovie.overview}
                </p>
                {/* Optionally, add more movie details here */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
