import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { auth } from '../../config/firebase-config'; 
import { signInWithGoogle, logout } from '../auth';
import { Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SearchBar from '../search/SearchBar';
import React from 'react';

export const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navBar px-3">
      <Navbar.Brand>
        <Link to="/" className="text-light">
          Filmshelf
        </Link>
      </Navbar.Brand>
      <Nav.Item><SearchBar/></Nav.Item>
      <Nav.Item as={Link} to="/movies">Movies</Nav.Item>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Item>
            {user ? (
              <NavDropdown title={user.displayName} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profilePage">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/watchedMovies">Watched Movies</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/lists">Lists</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/reviews">Reviews</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link to="/LoginForm" className="ms-2 text-light">
                Login
              </Link>
            )}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
