import React, { useEffect, useState } from "react";
import { NavBar } from "../nav/nav";
import "./MoviesPage.css";
import { fetchMovieData } from "../../services/movieService";
const MoviesPage = () => {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const getMovies =  async () => {
    try{
      const movieData = await fetchMovieData();
      setMovieList(movieData.results);
      setFilteredMovies(movieData.results);
    } catch (error){
      console.error("Error getting movie data: ", error)
    }
  };


  useEffect(() => {
    getMovies();
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
