import React, { useEffect, useState } from "react";
import { NavBar } from "../nav/nav";
import { useNavigate } from "react-router-dom";
import "./MoviesPage.css";

const MoviesPage = () => {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState("None");
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API;

  const getMovies = () => {
    setIsLoading(true);
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${selectedPage}`
    )
      .then((res) => res.json())
      .then((json) => {
        const filteredMovies = json.results.filter((movie) => !movie.adult);
        setMovieList(filteredMovies);
        setFilteredMovies(filteredMovies);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  };

  const getGenres = () => {
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    )
      .then((res) => res.json())
      .then((json) => setGenres(json.genres || [])) // Ensure we set an empty array if genres is undefined
      .catch((error) => console.error("Error fetching genres:", error));
  };

  useEffect(() => {
    getMovies();
    getGenres();
  }, [selectedPage]);

  const filterMoviesByGenre = (genreId) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      setFilteredMovies(movieList);
    } else {
      setSelectedGenre(genreId);
      const filtered = movieList.filter((movie) =>
        movie.genre_ids.includes(genreId)
      );
      setFilteredMovies(filtered);
    }
  };

  const handleNextPage = () => {
    setSelectedPage((prevPage) => prevPage + 1);
  };

  const handleLastPage = () => {
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleResetFilters = () => {
    setSelectedGenre(null);
    setSelectedPage(1);
    setFilteredMovies(movieList);
    setSelectedValue("None");
    document.getElementById("genre-select").value = "";
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ color: "white" }}>Movies</h1>

      {/* Loading Spinner */}
      {isLoading && <div className="loading-spinner">Loading...</div>}

      <div className="genre-filter-wrapper">
        <div className="genre-buttons-wrapper">
          {genres.length > 0 &&
            genres
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
            data-testid="genre-select"
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
        {/* Show 'No Movies Found' if filteredMovies is empty */}
        {filteredMovies.length === 0 ? (
          <p>No Movies Found</p>
        ) : (
          filteredMovies.map(
            (movie) =>
              movie.poster_path && (
                <div className="movie-poster-container" key={movie.id}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                </div>
              )
          )
        )}
      </div>

      <div className="movie-pages-buttons-wrapper">
        <button onClick={handleLastPage}>{"<"}</button>
        <button onClick={handleNextPage}>{">"}</button>
      </div>
    </div>
  );
};

export default MoviesPage;
