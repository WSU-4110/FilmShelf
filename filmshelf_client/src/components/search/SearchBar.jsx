import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for making API requests
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import './SearchBar.css'; // Import any styles for the SearchBar component

function SearchBar() {
  const [query, setQuery] = useState(''); // State for user input
  const [filteredOptions, setFilteredOptions] = useState([]); // State for the filtered movie options
  const navigate = useNavigate(); // Hook to navigate to movie details page

  // Access the API key from .env file
  const API_KEY = import.meta.env.VITE_TMDB_API;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
  const TMDB_MOVIE_CREDITS_URL = 'https://api.themoviedb.org/3/movie'; // For fetching credits

  // Function to handle input change and fetch movies from TMDb API
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value); // Update the input value in state

    if (value) {
      try {
        // Make an API call to TMDB for movies that match the query
        const response = await axios.get(TMDB_BASE_URL, {
          params: {
            api_key: API_KEY,
            query: value,
          },
        });

        // Store movie titles, IDs, poster paths, release year, and director (limit to the first 5 results)
        const movies = await Promise.all(
          response.data.results.slice(0, 5).map(async (movie) => {
            const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
            
            // Fetch movie credits to get the director's name
            const creditsResponse = await axios.get(`${TMDB_MOVIE_CREDITS_URL}/${movie.id}/credits`, {
              params: { api_key: API_KEY },
            });

            const director = creditsResponse.data.crew.find((person) => person.job === 'Director');

            return {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              releaseYear: releaseYear,
              director: director ? director.name : 'Unknown',
            };
          })
        );

        setFilteredOptions(movies); // Update the filtered options in state
      } catch (error) {
        console.error('Error fetching data from TMDB API:', error); // Log the error for debugging
      }
    } else {
      setFilteredOptions([]); // Clear the dropdown if the input is empty
    }
  };

  // Function to handle click on a movie option and navigate to its details page
  const handleOptionClick = (movie) => {
    setQuery(movie.title); // Set the selected movie title in the input field
    setFilteredOptions([]); // Clear dropdown after selecting

    // Navigate to the movie details page using the movie ID
    navigate(`/movies/${movie.id}`);
  };

  // Prevent default form submit behavior (so the page doesn't reload)
  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Helper function to truncate long movie titles
  const truncateTitle = (title, maxLength = 45) => {
    if (title.length > maxLength) {
      return `${title.substring(0, maxLength)}...`; // Truncate and append "..."
    }
    return title; // Return the full title if it's within the limit
  };

  return (
    <Form onSubmit={handleSearch} className="search-input-group">
      <InputGroup>
        {/* Search Input */}
        <Form.Control
          type="text"
          placeholder="Search for Movies..."
          value={query} // Controlled input bound to query state
          onChange={handleInputChange} // Handle input change and fetch movies
          className="form-control"
          style={{ width: '400px' }} // Make the search bar longer
        />
        <Button type="submit" variant="outline-primary">Search</Button>
      </InputGroup>

      {/* Display dropdown only when there are filtered options */}
      {filteredOptions.length > 0 && (
        <div className="dropdown-container">
          <Dropdown.Menu show className="w-100">
            {filteredOptions.map((movie, index) => (
              <Dropdown.Item key={index} onClick={() => handleOptionClick(movie)}>
                {/* Display movie poster and title side by side */}
                <div className="dropdown-item-content">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} // Small poster size (w92)
                    alt={movie.title}
                    className="dropdown-item-poster"
                  />
                  <div className="dropdown-item-details">
                    <strong className="dropdown-item-title">{truncateTitle(movie.title)}</strong>
                    <div className="dropdown-item-subtitle">
                      {movie.releaseYear}, Directed by <strong>{movie.director}</strong>
                    </div>
                  </div>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </div>
      )}
    </Form>
  );
}

export default SearchBar;
