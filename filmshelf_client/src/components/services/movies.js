import axios from "axios";
const API_KEY = import.meta.env.VITE_TMDB_API;

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
