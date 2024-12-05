import React, { useEffect, useState } from "react";
import { NavBar } from "../../nav/nav";
import { auth, db } from "../../../config/firebase-config";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";

export default function WatchedMovies() {
  const apiKey = import.meta.env.VITE_TMDB_API;
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedValue, setSelectedValue] = useState("None");

  const closeModal = () => {
    setSelectedMovie(null); // Deselect the movie
  };

  const handleMovieClick = (movie) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      checkIfMovieRated(uid, movie.id.toString());
    }
    setSelectedMovie(movie);
    console.log(movie.id);
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
  const getMovies = async () => {
    try {
      const moviesPromises = Object.keys(watchedMovies).map((movieId) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
        ).then((res) => res.json())
      );

      const moviesData = await Promise.all(moviesPromises);

      const thisfilteredMovies = moviesData.map((movie) => ({
        ...movie,
        rating: watchedMovies[movie.id],
      }));

      console.log("Filtered Movies:", thisfilteredMovies);
      setFilteredMovies(thisfilteredMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const getWatchedMovies = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        let watched = userData.watchedMovies;
        setWatchedMovies(watched);
        console.log("User Data:", Object.keys(watched));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const user = auth.currentUser;
      if (user) {
        await getWatchedMovies(user.uid);
      } else {
        console.log("User not logged in");
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (Object.keys(watchedMovies).length > 0) {
      getMovies(watchedMovies);
    }
  }, [watchedMovies]);
  return (
    <>
      <NavBar />
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
                <h1 style={{ color: "white" }} ß>
                  Rating: {movie.rating}
                </h1>
              </div>
            )
        )}

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
    </>
  );
}
