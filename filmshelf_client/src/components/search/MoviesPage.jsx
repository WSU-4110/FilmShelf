import React, { useEffect, useState } from "react";
import { NavBar } from "../nav/nav";
import { auth, db } from '../../config/firebase-config';
import { doc, getDoc, updateDoc, deleteField} from "firebase/firestore";
import "./MoviesPage.css";

const MoviesPage = () => {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState('None');
  const apiKey = import.meta.env.VITE_TMDB_API;

  const handleSelectChange = async (e) => {
    const value = e.target.value === 'None' ? null : parseInt(e.target.value);
    setSelectedValue(e.target.value);
    const uid = auth.currentUser?.uid;
    if (uid && selectedMovie) {
      if (value===null){
        deleteMovieFromWatched(uid, selectedMovie.id.toString())
      }
      else{
      await updateMovieRating(uid, selectedMovie.id.toString(), value); 
      }
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
          setSelectedValue('None');
        }
      } else {
        console.log("No user data found.");
        setSelectedValue('None'); 
      }
    } catch (error) {
      console.error("Error checking movie rating:", error);
    }
  };

  // Fetch popular movies from TMDB API
  const getMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&certification_country=US&certification.lte=PG-13&certification.gte=G&sort_by=popularity.desc&vote_count.gte=1&language=en-US&page=${selectedPage}`
    )
      .then((res) => res.json())
      .then((json) => {
        const filteredMovies = json.results?.filter((movie) => !movie.adult);
        setMovieList(filteredMovies);
        setFilteredMovies(filteredMovies);
      })
      .catch((error) => console.error("Error fetching movies:", error));
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
  // Fetch genres from TMDB API
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
  }, [selectedPage]); // Re-fetch on page change


  const handleMovieClick = (movie) => {
    const uid = auth.currentUser?.uid; 
    if (uid) {
      checkIfMovieRated(uid, movie.id.toString()); 
    }
    setSelectedMovie(movie); 
    console.log(movie.id)
  };

  // Close the modal
  const closeModal = () => {
    setSelectedMovie(null); // Deselect the movie
  };

  return (
    <div>
      <NavBar />
      <h1>Movies</h1>

      {/* Genre Filter */}
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
                onClick={() => setSelectedGenre(genre.id)}
              >
                {genre.name}
              </button>
            ))}
        </div>

        <div className="genre-dropdown-wrapper">
          <select
            id="genre-select"
            onChange={(e) =>
              setSelectedGenre(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            <option value="">More Genres</option>
            {genres
              .filter(
                (genre) =>
                  !["Action", "Comedy", "Romance", "Adventure", "Horror"].includes(
                    genre.name
                  )
              )
              .map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
          </select>
        </div>

        <button className="reset-button" onClick={() => setSelectedGenre(null)}>
          Reset Filters
        </button>
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
                  onClick={() => handleMovieClick(movie)}
                />
              </div>
            )
        )}
      </div>

      <div className="movie-pages-buttons-wrapper">
        <button onClick={() => setSelectedPage((prev) => Math.max(prev - 1, 1))}>
          {"<"}
        </button>
        <button onClick={() => setSelectedPage((prev) => prev + 1)}>
          {">"}
        </button>
      </div>

      {/* Modal for movie details */}
      {selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
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
                <div>
                  <strong>Your Rating:</strong>
                  <br />
                  <select value={selectedValue} onChange={handleSelectChange}>
                    <option value={'None'}>None</option>
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
