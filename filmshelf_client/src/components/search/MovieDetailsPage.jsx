import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { NavBar } from '../nav/nav'; // Import NavBar
import './MovieDetailsPage.css'; // Import the CSS for movie details page

function MovieDetailsPage() {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null); // State to hold movie details
  const [director, setDirector] = useState(''); // State to hold director's name
  const API_KEY = import.meta.env.VITE_TMDB_API; // TMDb API key from the .env file

  useEffect(() => {
    // Fetch movie details when the component mounts
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: API_KEY,
          },
        });

        setMovie(response.data);

        // Fetch movie credits to get the director
        const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
          params: {
            api_key: API_KEY,
          },
        });
        const directorInfo = creditsResponse.data.crew.find(person => person.job === 'Director');
        setDirector(directorInfo ? directorInfo.name : 'Unknown');
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id, API_KEY]); // Fetch details every time the movie ID changes

  // Show loading message while fetching data
  if (!movie) {
    return <div>Loading...</div>;
  }

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'; // Extract the year from release date

  return (
    <div className="movie-details-container">
      {/* NavBar at the top */}
      <NavBar />

      {/* Movie Details Content */}
      <div className="movie-details-content">
        <div className="movie-box">
          {/* Movie Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster"
          />

          {/* Movie Info */}
          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-subtitle">
              {releaseYear}, Directed by <strong>{director}</strong>
            </p>
            <p className="movie-description">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
