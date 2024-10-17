import axios from "axios";

const fetchMovieData = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:5001/filmshelf-de256/us-central1/getPopularMovies`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        return null;
    }
};
export { fetchMovieData };