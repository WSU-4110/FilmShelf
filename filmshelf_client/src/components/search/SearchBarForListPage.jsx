// SearchBarForListPage.jsx
import React, { useState } from "react";
import { Form, InputGroup, Dropdown } from "react-bootstrap";
import axios from "axios";

function SearchBarForListPage({ onAddMovie }) {
    const [query, setQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const API_KEY = import.meta.env.VITE_TMDB_API;

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            try {
                const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
                    params: {
                        api_key: API_KEY,
                        query: value,
                    },
                });
                setFilteredOptions(response.data.results.slice(0, 5));
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        } else {
            setFilteredOptions([]);
        }
    };

    const handleOptionClick = (movie) => {
        onAddMovie(movie);
        setQuery("");
        setFilteredOptions([]);
    };

    return (
        <Form className="search-input-group">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Type here to search for movies..."
                    value={query}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ width: "100%" }}
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
                                        <strong className="dropdown-item-title">{movie.title}</strong>
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

export default SearchBarForListPage;
