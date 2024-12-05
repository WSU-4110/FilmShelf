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
  const [visibleTheaters, setVisibleTheaters] = useState(4);
  const [showtimes, setShowtimes] = useState([]); // New state for SerpApi data
  const [cast, setCast] = useState([]);
  const [writers, setWriters] = useState([]);
  const [producers, setProducers] = useState([]);
  const [cinematographers, setCinematographers] = useState([]);

  const API_KEY = import.meta.env.VITE_TMDB_API;
  const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_API;

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

        // Set director
        const directorInfo = creditsResponse.data.crew.find(
          (person) => person.job === "Director"
        );
        setDirector(directorInfo ? directorInfo.name : "Unknown");

        // Set cast and crew details
        setCast(creditsResponse.data.cast.slice(0, 30)); // Limit cast to top 30
        setWriters(
          creditsResponse.data.crew.filter(
            (person) => person.job === "Writer" || person.job === "Screenplay"
          )
        );
        setProducers(
          creditsResponse.data.crew.filter(
            (person) =>
              person.job === "Producer" || person.job === "Executive Producer"
          )
        );
        setCinematographers(
          creditsResponse.data.crew.filter(
            (person) =>
              person.job === "Director of Photography" ||
              person.job === "Cinematographer"
          )
        );
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [id, API_KEY]);

  useEffect(() => {
    if (!movie) {
      return;
    }

    const fetchShowtimes = async () => {
      const params = new URLSearchParams({
        api_key: `${SERPAPI_KEY}`,
        engine: "google",
        q: `${movie.title} theater showtimes`,
        google_domain: "google.com",
        gl: "us",
        hl: "en",
        location: "Detroit, Michigan, United States",
      }).toString();

      try {
        const response = await fetch(`/api/showtimes?${params}`);
        const data = await response.json();

        const showtimesData = data.showtimes?.flatMap((showtime) =>
          showtime.theaters.map((theater) => ({
            theaterName: theater.name,
            link: theater.link,
            showtimes: theater.showing.map((show) => ({
              type: show.type,
              times: show.time,
            })),
          }))
        );

        setShowtimes(showtimesData || []);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        setShowtimes([]);
      }
    };

    fetchShowtimes();
  }, [movie]);

  const loadMoreTheaters = () => {
    setVisibleTheaters((prevVisible) => prevVisible + 4);
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";

  return (
    <div className="movie-details-container">
      <NavBar />

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

              <div className="showtimes-container">
                {showtimes && showtimes.length > 0 ? (
                  <div className="theaters">
                    {showtimes.slice(0, visibleTheaters).map((theater, index) => (
                      <div className="theater-card" key={index}>
                        <h3>
                          <a
                            href={theater.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {theater.theaterName}
                          </a>
                        </h3>
                        <p>{theater.address}</p>
                        {theater.showtimes.length > 0 ? (
                          <div className="showtimes">
                            {theater.showtimes.map((show, idx) => (
                              <div key={idx} className="showtime">
                                <h4>{show.type}</h4>
                                <div className="times">
                                  {show.times.map((time, i) => (
                                    <span key={i} className="time">
                                      {time}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No showtimes available</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No showtimes found for this movie.</p>
                )}

                {visibleTheaters < showtimes.length && (
                  <button className="load-more" onClick={loadMoreTheaters}>
                    Load More
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cast Section */}
          <div className="cast-crew-section">
            <h2>Cast</h2>
            <div className="scrollable-list">
              {cast.map((actor) => (
                <div key={actor.id} className="cast-member">
                  <a href={`/person/${actor.id}`}>
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
                          : "https://via.placeholder.com/92"
                      }
                      alt={actor.name}
                      className="cast-photo"
                    />
                    <p className="cast-name">{actor.name}</p>
                  </a>
                  <p className="cast-character">as {actor.character}</p>
                </div>
              ))}
            </div>
          </div>


          {/* Crew Section */}
          <div className="crew-section">
            <h2>Crew</h2>
            <p><strong>Director:</strong> <a href={`/person/${director.id}`}>{director}</a></p>

            {writers.length > 0 && (
              <div>
                <strong>Writers:</strong>
                <ul>
                  {writers.map((writer) => (
                    <li key={writer.id}>
                      <a href={`/person/${writer.id}`}>{writer.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {producers.length > 0 && (
              <div>
                <strong>Producers:</strong>
                <ul>
                  {producers.map((producer) => (
                    <li key={producer.id}>
                      <a href={`/person/${producer.id}`}>{producer.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {cinematographers.length > 0 && (
              <div>
                <strong>Cinematographers:</strong>
                <ul>
                  {cinematographers.map((cinematographer) => (
                    <li key={cinematographer.id}>
                      <a href={`/person/${cinematographer.id}`}>{cinematographer.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
