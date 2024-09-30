import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { auth } from '../config/firebase-config'; 
import { signInWithGoogle, logout } from './auth';
import { Link } from 'react-router-dom';

export const NavBar = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Navbar expand="lg" className="bg-light">
      <Container>
        <Navbar.Brand> <Link to="/"> Filmshelf</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              {user ? <Link to="/profilePage">Profile</Link> : 'Not logged in'}
              {user ? <button onClick={logout}>Log Out</button> : <button onClick={signInWithGoogle}>Google Sign In</button>}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
