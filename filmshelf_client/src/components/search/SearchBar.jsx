import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API;
  const TMDB_MOVIE_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
  const TMDB_PERSON_SEARCH_URL = "https://api.themoviedb.org/3/search/person";
  const TMDB_MOVIE_CREDITS_URL = "https://api.themoviedb.org/3/movie";

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      try {
        // Fetch movies and people in parallel
        const [movieResponse, personResponse] = await Promise.all([
          axios.get(TMDB_MOVIE_SEARCH_URL, {
            params: { api_key: API_KEY, query: value },
          }),
          axios.get(TMDB_PERSON_SEARCH_URL, {
            params: { api_key: API_KEY, query: value },
          }),
        ]);

        // Process movie results
        const movies = await Promise.all(
          movieResponse.data.results.slice(0, 5).map(async (movie) => {
            let director = "Unknown";
            try {
              const creditsResponse = await axios.get(
                `${TMDB_MOVIE_CREDITS_URL}/${movie.id}/credits`,
                { params: { api_key: API_KEY } }
              );
              const directorInfo = creditsResponse.data.crew.find(
                (person) => person.job === "Director"
              );
              if (directorInfo) {
                director = directorInfo.name;
              }
            } catch (error) {
              console.error(
                `Error fetching credits for movie ID ${movie.id}:`,
                error
              );
            }

            return {
              type: "movie",
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              releaseYear: movie.release_date
                ? movie.release_date.split("-")[0]
                : "N/A",
              director,
            };
          })
        );

        // Process person results
        const people = personResponse.data.results.slice(0, 5).map((person) => ({
          type: "person",
          id: person.id,
          name: person.name,
          profile_path: person.profile_path,
        }));

        // Combine and set options
        setFilteredOptions([...movies, ...people]);
      } catch (error) {
        console.error("Error fetching search results from TMDB:", error);
      }
    } else {
      setFilteredOptions([]);
    }
  };

  const handleOptionClick = (option) => {
    if (option.type === "movie") {
      navigate(`/movies/${option.id}`);
    } else if (option.type === "person") {
      navigate(`/person/${option.id}`);
    }
    setQuery("");
    setFilteredOptions([]);
  };

  const truncateTitle = (title, maxLength = 35) => {
    return title && title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  return (
    <Form className="search-input-group">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search for Movies, Cast, or Crew..."
          value={query}
          onChange={handleInputChange}
          className="form-control"
          style={{ width: "400px" }}
        />
      </InputGroup>

      {filteredOptions.length > 0 && (
        <div className="dropdown-container">
          <Dropdown.Menu show className="w-100">
            {filteredOptions.map((option, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleOptionClick(option)}
              >
                <div className="dropdown-item-content">
                  <img
                    src={
                      option.type === "movie"
                        ? `https://image.tmdb.org/t/p/w92${option.poster_path}`
                        : `https://image.tmdb.org/t/p/w92${option.profile_path}`
                    }
                    alt={option.title || option.name}
                    className="dropdown-item-poster"
                  />
                  <div className="dropdown-item-details">
                    {option.type === "movie" ? (
                      <>
                        <strong className="dropdown-item-title">
                          {truncateTitle(option.title)}
                        </strong>
                        <div className="dropdown-item-subtitle">
                          {option.releaseYear}, Directed by{" "}
                          <strong>{option.director}</strong>
                        </div>
                      </>
                    ) : (
                      <strong className="dropdown-item-title">
                        {truncateTitle(option.name)}
                      </strong>
                    )}
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
