import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { NavBar } from '../nav/nav'; // Import NavBar
import { auth, db } from '../../config/firebase-config';
import { doc, getDoc, updateDoc, deleteField} from "firebase/firestore";
import './MovieDetailsPage.css'; // Import the CSS for movie details page

function MovieDetailsPage() {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null); // State to hold movie details
  const [director, setDirector] = useState(''); // State to hold director's name
  const [selectedValue, setSelectedValue] = useState('None');
  const API_KEY = import.meta.env.VITE_TMDB_API; // TMDb API key from the .env file

  const handleSelectChange = async (e) => {
    const value = e.target.value === 'None' ? null : parseInt(e.target.value);
    console.log(movie)
    setSelectedValue(e.target.value);
    const uid = auth.currentUser?.uid;
    if (uid && movie) {
      if (value===null){
        deleteMovieFromWatched(uid, movie.id.toString())
      }
      else{
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

  useEffect(() => {
    const uid = auth.currentUser?.uid; 
    // Fetch movie details when the component mounts
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: API_KEY,
          },
        });
        setMovie(response.data);
        console.log(response.data)
        checkIfMovieRated(uid, response.data.id)
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
    console.log(movie)
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
            className="movie-poster-1"
          />

          {/* Movie Info */}
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
  );
}

export default MovieDetailsPage;
