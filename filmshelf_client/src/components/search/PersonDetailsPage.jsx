import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { NavBar } from "../nav/nav";
import axios from "axios";
import "./PersonDetailsPage.css";

function PersonDetailsPage() {
  const { personId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [person, setPerson] = useState(null);
  const [castFilmography, setCastFilmography] = useState([]);
  const [crewFilmography, setCrewFilmography] = useState([]);

  const API_KEY = import.meta.env.VITE_TMDB_API;

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        // Fetch person details
        const personResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}`,
          {
            params: { api_key: API_KEY },
          }
        );
        setPerson(personResponse.data);

        // Fetch filmography
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
          {
            params: { api_key: API_KEY },
          }
        );

        // Separate cast and crew filmography
        setCastFilmography(creditsResponse.data.cast || []);
        setCrewFilmography(creditsResponse.data.crew || []);
      } catch (error) {
        console.error("Error fetching person details:", error);
      }
    };

    fetchPersonDetails();
  }, [personId, API_KEY]);

  if (!person) {
    return <div>Loading...</div>;
  }

  return (
    <div className="person-details-container">
      <NavBar />
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; 
      </button>
      <h1>{person.name}</h1>
      <div className="person-info">
        <img
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : "https://via.placeholder.com/150"
          }
          alt={person.name}
          className="person-photo"
        />
        <p>{person.biography || "Biography not available."}</p>
      </div>

      {/* Cast Filmography */}
      {castFilmography.length > 0 && (
        <div className="filmography">
          <h2>Cast Filmography</h2>
          <div className="filmography-grid">
            {castFilmography.map((movie) => (
              <a
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="filmography-item"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="filmography-poster"
                  />
                ) : (
                  <div className="filmography-placeholder">
                    <p>{movie.title}</p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Crew Filmography */}
      {crewFilmography.length > 0 && (
        <div className="filmography">
          <h2>Crew Filmography</h2>
          <div className="filmography-grid">
            {crewFilmography.map((movie) => (
              <a
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="filmography-item"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="filmography-poster"
                  />
                ) : (
                  <div className="filmography-placeholder">
                    <p>{movie.title}</p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonDetailsPage;
