import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { auth } from '../../config/firebase-config'; 
import { signInWithGoogle, logout } from '../auth';
import { Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SearchBar from '../search/SearchBar';

export const NavBar = () => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser){
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setUserInfo(userSnap.data());
        } else {
            console.log("No user information found");
        }
      }
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
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Item>
            {user ? (
              <NavDropdown title={userInfo?.displayName} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profilePage">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/movies">Movies</NavDropdown.Item>
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
