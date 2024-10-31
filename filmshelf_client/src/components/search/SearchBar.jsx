import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import './SearchBar.css';

// Base SearchBar Component
function BaseSearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3/search/movie';

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

        const movies = response.data.results.slice(0, 5).map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        }));

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
    if (onSearch) onSearch(movie.title); // Trigger any additional functionality provided by the decorator
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSearch} className="search-input-group">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search for Movies..."
          value={query}
          onChange={handleInputChange}
          className="form-control"
        />
        <Button type="submit" variant="outline-primary">Search</Button>
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
                  <span className="dropdown-item-title">{movie.title}</span>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </div>
      )}
    </Form>
  );
}

// Decorator to add logging functionality
function withLogging(WrappedComponent) {
  return function (props) {
    const handleSearch = (query) => {
      console.log(`Search performed: ${query}`);
    };

    return <WrappedComponent {...props} onSearch={handleSearch} />;
  };
}

// Enhanced SearchBar with logging functionality
const SearchBarWithLogging = withLogging(BaseSearchBar);

export default SearchBarWithLogging;
