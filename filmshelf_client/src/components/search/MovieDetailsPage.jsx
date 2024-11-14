import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { NavBar } from "../nav/nav";
import { auth, db } from "../../config/firebase-config";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { Review } from "../reviews/reviews";
import "./MovieDetailsPage.css";

function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [director, setDirector] = useState("");
  const [selectedValue, setSelectedValue] = useState("None");
  const [activeTab, setActiveTab] = useState("details");
  const API_KEY = import.meta.env.VITE_TMDB_API;

  const handleSelectChange = async (e) => {
    const value = e.target.value === "None" ? null : parseInt(e.target.value);
    setSelectedValue(e.target.value);
    const uid = auth.currentUser?.uid;
    if (uid && movie) {
      if (value === null) {
        deleteMovieFromWatched(uid, movie.id.toString());
      } else {
        await updateMovieRating(uid, movie.id.toString(), value);
      }
    }
  };

  const checkIfMovieRated = async (uid, movieId) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const movieRating = userData.watchedMovies?.[movieId];
        setSelectedValue(
          movieRating !== undefined ? movieRating.toString() : "None"
        );
      } else {
        setSelectedValue("None");
      }
    } catch (error) {
      console.error("Error checking movie rating:", error);
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

  const updateMovieRating = async (uid, movieId, rating) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        [`watchedMovies.${movieId}`]: rating,
      });
      console.log(`Movie ${movieId} updated with rating: ${rating}`);
    } catch (error) {
      console.error("Error updating movie rating:", error);
    }
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: API_KEY,
            },
          }
        );
        setMovie(response.data);
        checkIfMovieRated(uid, response.data.id);

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits`,
          {
            params: {
              api_key: API_KEY,
            },
          }
        );
        const directorInfo = creditsResponse.data.crew.find(
          (person) => person.job === "Director"
        );
        setDirector(directorInfo ? directorInfo.name : "Unknown");
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [id, API_KEY]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";

  return (
    <div className="movie-details-container">
      <NavBar />

      {/* Tab navigation directly on top of movie-details-content */}
      <div className="tab-container">
        <button
          className={activeTab === "details" ? "active-tab" : ""}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={activeTab === "review" ? "active-tab" : ""}
          onClick={() => setActiveTab("review")}
        >
          Reviews
        </button>
      </div>

      {activeTab === "details" ? (
        <div className="movie-details-content">
          <div className="movie-box">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster-1"
            />

            <div className="movie-info">
              <h1 className="movie-title">{movie.title}</h1>
              <p className="movie-subtitle">
                {releaseYear}, Directed by <strong>{director}</strong>
              </p>
              <p className="movie-description">{movie.overview}</p>
              <div>
                <strong>Your Rating:</strong>
                <br />
                <select value={selectedValue} onChange={handleSelectChange}>
                  <option value="None">None</option>
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
      ) : (
        <div className="discussion-content">
          <h2>Review</h2>
          <p>Share your thoughts on this movie!</p>
          <Review></Review>
        </div>
      )}
    </div>
  );
}

export default MovieDetailsPage;
