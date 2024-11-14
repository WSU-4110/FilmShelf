import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
  const TMDB_MOVIE_CREDITS_URL = 'https://api.themoviedb.org/3/movie';

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      try {
        const response = await axios.get(TMDB_BASE_URL, {
          params: {
            api_key: API_KEY,
            query: value,
          },
        });

        const movies = await Promise.all(
          response.data.results.slice(0, 5).map(async (movie) => {
            const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

            const creditsResponse = await axios.get(`${TMDB_MOVIE_CREDITS_URL}/${movie.id}/credits`, {
              params: { api_key: API_KEY },
            });

            const director = creditsResponse.data.crew.find((person) => person.job === 'Director');

            return {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              releaseYear,
              director: director ? director.name : 'Unknown',
            };
          })
        );

        setFilteredOptions(movies);
      } catch (error) {
        console.error('Error fetching data from TMDB API:', error);
      }
    } else {
      setFilteredOptions([]);
    }
  };

  const handleOptionClick = (movie) => {
    setQuery(movie.title);
    setFilteredOptions([]);
    navigate(`/movies/${movie.id}`);
  };

  const truncateTitle = (title, maxLength = 45) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <Form className="search-input-group">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search for Movies..."
          value={query}
          onChange={handleInputChange}
          className="form-control"
          style={{ width: '400px' }}
        />
      </InputGroup>

      {filteredOptions.length > 0 && (
        <div className="dropdown-container">
          <Dropdown.Menu show className="w-100">
            {filteredOptions.map((movie, index) => (
              <Dropdown.Item key={index} onClick={() => handleOptionClick(movie)}>
                <div className="dropdown-item-content">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
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
