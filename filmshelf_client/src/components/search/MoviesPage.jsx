import React, { useEffect, useState } from "react";
import { NavBar } from "../nav/nav";
import { auth, db } from "../../config/firebase-config";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./MoviesPage.css";

const MoviesPage = () => {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]); // For displaying filtered movies
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null); // Track selected genre
  const [selectedMovie, setSelectedMovie] = useState(null); // Track the clicked movie
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState("None");
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API;

  const handleSelectChange = async (e) => {
    const value = e.target.value === "None" ? null : parseInt(e.target.value);
    setSelectedValue(e.target.value);
    const uid = auth.currentUser?.uid;
    if (uid && selectedMovie) {
      if (value === null) {
        deleteMovieFromWatched(uid, selectedMovie.id.toString());
      } else {
        await updateMovieRating(uid, selectedMovie.id.toString(), value);
      }
    }
  };
  const updateMovieRating = async (uid, movieId, rating) => {
    try {
      const userRef = doc(db, "users", uid); // Reference to the user document
      // Update the nested movie rating inside the watchedMovies map
      await updateDoc(userRef, {
        [`watchedMovies.${movieId}`]: rating, // Firestore syntax for nested field update
      });

      console.log(`Movie ${movieId} updated with rating: ${rating}`);
    } catch (error) {
      console.error("Error updating movie rating:", error);
    }
  };

  const deleteMovieFromWatched = async (uid, movieId) => {
    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        [`watchedMovies.${movieId}`]: deleteField(),
      });

      console.log(`Movie ${movieId} removed from watchedMovies.`);
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const checkIfMovieRated = async (uid, movieId) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const movieRating = userData.watchedMovies?.[movieId];

        if (movieRating !== undefined) {
          setSelectedValue(movieRating.toString());
        } else {
          setSelectedValue("None");
        }
      } else {
        console.log("No user data found.");
        setSelectedValue("None");
      }
    } catch (error) {
      console.error("Error checking movie rating:", error);
    }
  };
  const getMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&certification_country=US&certification.lte=PG-13&certification.gte=G&sort_by=popularity.desc&vote_count.gte=1&language=en-US&page=${selectedPage}`
    )
      .then((res) => res.json())
      .then((json) => {
        const filteredMovies = json.results.filter((movie) => !movie.adult); // Filter out adult movies
        setMovieList(filteredMovies); // Set the filtered list of movies
        setFilteredMovies(filteredMovies); // Set filtered movies initially to all movies
      })
      .catch((error) => console.error("Error fetching movies:", error));
  };

  console.log(movieList);

  // Fetch genres
  const getGenres = () => {
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    )
      .then((res) => res.json())
      .then((json) => setGenres(json.genres))
      .catch((error) => console.error("Error fetching genres:", error));
  };

  useEffect(() => {
    getMovies();
    getGenres();
  }, [selectedPage]); //selected page is a dependency. Whenever it updates, it reruns the useEffect hook.

  // Handle when a movie is clicked
  const handleMovieClick = (movie) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      checkIfMovieRated(uid, movie.id.toString());
    }
    setSelectedMovie(movie);
    console.log(movie.id);
  };

  // Handle modal close
  const closeModal = () => {
    setSelectedMovie(null); // Deselect the movie to close the modal
  };

  // Filter movies by genre
  const filterMoviesByGenre = (genreId) => {
    if (selectedGenre === genreId) {
      // If the clicked genre is already selected, reset the filter
      setSelectedGenre(null);
      setFilteredMovies(movieList); // Reset to all movies
    } else {
      // Otherwise, filter by the selected genre
      setSelectedGenre(genreId);
      const filtered = movieList.filter((movie) =>
        movie.genre_ids.includes(genreId)
      );
      setFilteredMovies(filtered);
    }
  };

  const handleNextPage = () => {
    setSelectedPage((prevPage) => prevPage + 1);
    console.log(selectedPage);
  };
  const handleLastPage = () => {
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1)); // Prevent going below page 1
    console.log(selectedPage);
  };
  const handleResetFilters = () => {
    setSelectedGenre(null); // Reset selected genre
    setSelectedPage(1); // Reset page to 1
    setFilteredMovies(movieList); // Reset filtered movies to the full movie list
  };

  return (
    <div>
      <NavBar />
      <h1 style={{ color: "white" }}>Movies</h1>

      {/* Genre Filter */}
      <div className="genre-filter-wrapper">
        {/* Buttons for specific genres */}
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
        {/* Dropdown for remaining genres */}
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
        {/* Reset Button */}
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
                  onClick={() => handleMovieClick(movie)} // Click to show modal
                />
              </div>
            )
        )}
      </div>
      <div className="movie-pages-buttons-wrapper">
        <button onClick={handleLastPage}>{`<`}</button>
        <button onClick={handleNextPage}> {`>`} </button>
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
                <div style={{ display: "flex" }}>
                  <h2>{selectedMovie.title}</h2>
                  <button
                    className="movie-link-button"
                    onClick={() => {
                      navigate(`/movies/${selectedMovie.id}`);
                    }}
                  >
                    🔗
                  </button>
                </div>
                <p>
                  <strong>Release Date:</strong> {selectedMovie.release_date}
                </p>
                <p>
                  <strong>Overview:</strong> {selectedMovie.overview}
                </p>
                <div>
                  <strong>Your Rating:</strong>
                  <br />
                  <select value={selectedValue} onChange={handleSelectChange}>
                    <option value={"None"}>None</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
