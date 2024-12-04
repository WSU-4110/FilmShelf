import axios from "axios";
const API_KEY = import.meta.env.VITE_TMDB_API;
import { db } from "../../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";


export const fetchMovieDetails = async (id) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}`,
            {
                params: {
                    api_key: API_KEY,
                },
            }
        );
        let Moviedetails=response.data;
        return Moviedetails;
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
};

export const checkIfMovieRated = async (uid, movieId) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const movieRating = userData.watchedMovies?.[movieId];
  
        // Return the rating if found, otherwise return "None"
        return movieRating !== undefined ? movieRating.toString() : "None";
      } else {
        console.log("No user data found.");
        return "None"; // Return "None" if no user data is found
      }
    } catch (error) {
      console.error("Error checking movie rating:", error);
      return "None"; // Return "None" in case of error
    }
  };
