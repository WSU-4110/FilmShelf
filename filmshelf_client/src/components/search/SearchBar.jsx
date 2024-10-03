import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import './SearchBar.css';  // Make sure this file exists and is imported

function SearchBar() {
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const navigate = useNavigate();

  // Search options
  const searchOptions = ['Movies', 'TV Shows', 'Users'];

  // Filter search options based on user input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter options based on the query (case-insensitive)
    const filtered = searchOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
  };

  // Handle option click to navigate to the selected page
  const handleOptionClick = (option) => {
    setQuery(option);  // Set the selected option in the input field
    setFilteredOptions([]);  // Clear dropdown

    // Navigate based on the selected option
    if (option === 'Movies') {
      navigate('/movies');
    } else if (option === 'TV Shows') {
      navigate('/tvshows');
    } else if (option === 'Users') {
      navigate('/users');
    }
  };

  // Prevent default form submit behavior
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSearch} className="search-input-group">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search for Movies, TV Shows, Users..."
          value={query}
          onChange={handleInputChange}
          className="form-control"
        />
        <Button type="submit" variant="outline-primary">Search</Button>
      </InputGroup>

      {/* Display dropdown only when there are filtered options */}
      {filteredOptions.length > 0 && (
        <div className="dropdown-container">
          <Dropdown.Menu show className="w-100">
            {filteredOptions.map((option, index) => (
              <Dropdown.Item key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </div>
      )}
    </Form>
  );
}

export default SearchBar;
