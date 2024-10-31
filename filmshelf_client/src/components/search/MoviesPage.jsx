import React, { useEffect, useState } from "react";
import { NavBar } from "../nav/nav";
import { auth, db } from '../../config/firebase-config';
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import "./MoviesPage.css";
import RatingContext from "../../db/Rating/RatingContext";
import { StarRating } from "../../db/Rating/StarRating";
import { ThumbsStrategy } from "../../db/Rating/ThumbsRating";

const MoviesPage = () => {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState('None');
  const [selectedStrategy, setSelectedStrategy] = useState("star");
  const [ratingContext, setRatingContext] = useState(new RatingContext(new StarRating()));

  const apiKey = import.meta.env.VITE_TMDB_API;

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

  const handleSelectChange = async (e) => {
    const value = e.target.value === "None" ? null : parseInt(e.target.value);
    setSelectedValue(e.target.value);

    const uid = auth.currentUser?.uid;
    if (uid && selectedMovie) {
      try {
        if (value === null) {
          deleteMovieFromWatched(uid, selectedMovie.id.toString());
        } else {
          await ratingContext.rateMovie(selectedMovie.id.toString(), value, uid, db);
        }
      } catch (error) {
        console.error("Error updating movie rating:", error);
      }
    }
  };

  const handleThumbsChange = async (thumbsUp) => {
    const uid = auth.currentUser?.uid;
    if (uid && selectedMovie) {
      await ratingContext.rateMovie(selectedMovie.id.toString(), thumbsUp, uid, db);
      setSelectedValue(thumbsUp ? "Thumbs Up" : "Thumbs Down");
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

  const handleStrategyChange = (strategyType) => {
    setSelectedStrategy(strategyType); // Track the selected strategy
    if (strategyType === "star") {
      setRatingContext(new RatingContext(new StarRating()));
    } else if (strategyType === "thumbs") {
      setRatingContext(new RatingContext(new ThumbsStrategy()));
    }
  };

  const getMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&certification_country=US&certification.lte=PG-13&certification.gte=G&sort_by=popularity.desc&vote_count.gte=1&language=en-US&page=${selectedPage}`
    )
      .then((res) => res.json())
      .then((json) => {
        const filteredMovies = json.results.filter((movie) => !movie.adult);
        setMovieList(filteredMovies);
        setFilteredMovies(filteredMovies);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  };

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
  }, [selectedPage]);

  const handleMovieClick = (movie) => {
    const uid = auth.currentUser?.uid; 
    if (uid) {
      checkIfMovieRated(uid, movie.id.toString()); 
    }
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <NavBar />
      <h1 style={{color:"white"}}>Movies</h1>

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
                <p><strong>Release Date:</strong> {selectedMovie.release_date}</p>
                <p><strong>Overview:</strong> {selectedMovie.overview}</p>
                <div>
                  <strong>Your Rating:</strong><br />
                  <button onClick={() => handleStrategyChange("star")}>Star Rating</button>
                  <button onClick={() => handleStrategyChange("thumbs")}>Thumbs Rating</button>

                  {selectedStrategy === "star" ? (
                    <select value={selectedValue} onChange={handleSelectChange}>
                      <option value={'None'}>None</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  ) : (
                    <div>
                      <button onClick={() => handleThumbsChange(true)}>Thumbs Up</button>
                      <button onClick={() => handleThumbsChange(false)}>Thumbs Down</button>
                    </div>
                  )}
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
