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


export const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand> <Link to="/"> Filmshelf</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" margin="10px">
            <Nav.Item>
              {user ? 
              <NavDropdown title={user.displayName} id="basic-nav-dropdown">
                <NavDropdown.Item><Link to="/profilePage" className="me-2">Profile</Link></NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
              </NavDropdown>
               : <Link to="/LoginForm" className="ms-2">Login</Link>
              }
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};
