import React, { useState, useEffect } from 'react';
import { NavBar } from "../nav/nav";
import { auth, db } from '../../config/firebase-config'; // Consolidated imports from firebase-config.
import { doc, getDoc } from "firebase/firestore";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
} from 'mdb-react-ui-kit';
import "./profilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null); // Stores authenticated user.
  const [userInfo, setUserInfo] = useState(null); // Stores Firestore user data.

  // Fetch user and Firestore data on authentication state change.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser); // Set the current authenticated user.
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid); // Reference Firestore doc.
          const userSnap = await getDoc(userRef); // Fetch Firestore data.
          if (userSnap.exists()) {
            setUserInfo(userSnap.data()); // Store user data if available.
            console.log(userInfo)
            console.log(userSnap.data());
          } else {
            console.log("No user information found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe(); // Cleanup on unmount.
  }, []);

  return (
    <>
      <NavBar />
      {user ? (
        <div className="vh-100">
          <div className="profilePageContainer">
            <MDBContainer>
              <MDBRow className="justify-content-center">
                <MDBCol md="9" lg="7" xl="5" className="mt-5">
                  <MDBCard
                    style={{
                      borderRadius: '15px',
                      borderWidth: '0',
                      backgroundColor: 'lightsteelblue',
                    }}
                  >
                    <MDBCardImage
                      style={{ borderRadius: '15px 15px 0 0' }}
                      src="https://mdbootstrap.com/img/new/standard/nature/111.webp"
                      alt="Profile Banner"
                    />
                    <MDBCardBody className="p-4">
                      <div className="d-flex text-black">
                        <div className="flex-grow-1 ms-3">
                          <MDBCardTitle>{user.displayName}</MDBCardTitle>
                          <MDBCardText>{user.email}</MDBCardText>
                          <div>
                            <button>Profile Settings</button>
                          </div>
                          <br />
                          <div
                            className="d-flex justify-content-start rounded-3 p-2 mb-2"
                            style={{ backgroundColor: '#efefef' }}
                          >
                            <div>
                              <p className="small text-muted mb-1">
                                Movies Watched
                              </p>
                              <p className="mb-0">
                                {userInfo?.watchedMovies
                                  ? Object.keys(userInfo.watchedMovies).length
                                  : 0}
                              </p>
                            </div>
                            <div className="px-3">
                              <p className="small text-muted mb-1">Reviews</p>
                              <p className="mb-0">
                                {userInfo?.reviews
                                  ? userInfo.reviews.size
                                  : 0}
                              </p>
                            </div>
                            <div>
                              <p className="small text-muted mb-1">Followers</p>
                              <p className="mb-0">
                                {userInfo?.followers
                                  ? userInfo.followers.length
                                  : 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
        </div>
      ) : (
        <MDBContainer>
          <MDBRow className="justify-content-center">
            <MDBCol md="9" lg="7" xl="5" className="mt-5">
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <MDBCardTitle>Not Signed In</MDBCardTitle>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      )}
    </>
  );
}

export default ProfilePage;
