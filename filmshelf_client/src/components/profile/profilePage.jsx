import React from 'react';
import { NavBar } from "../nav/nav";;
import { auth } from '../../config/firebase-config'; 
import { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBBtn, MDBRipple, MDBCardImage } from 'mdb-react-ui-kit';
import "./profilePage.css";

function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {      
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>    
            <NavBar />
            {user ? (
                <div className="vh-100">
                    <div className='profilePageContainer'>

                    <MDBContainer>
                        
                        <MDBRow className="justify-content-center">
                            <MDBCol md="9" lg="7" xl="5" className="mt-5">
                                <MDBCard style={{ borderRadius: '15px' }}>
                                        <MDBCardImage src='https://mdbootstrap.com/img/new/standard/nature/111.webp'/>
                                    <MDBCardBody className="p-4">
                                        <div className="d-flex text-black">
                                            <div className= "flex-shrink-0">   
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <MDBCardTitle>{user.displayName}</MDBCardTitle>
                                                <MDBCardText>{user.email}</MDBCardText> 
                                                    
                                                    <div>
                                                        <a><button>Profile Settings</button></a>
                                                        </div>

                                                <br />
                                                <div className="d-flex justify-content-start rounded-3 p-2 mb-2" style={{ backgroundColor: '#efefef' }}>
                                                    <div>
                                                        <p className="small text-muted mb-1">Movies Watched</p>
                                                        <p className="mb-0">41</p>
                                                    </div>
                                                    <div className="px-3">
                                                        <p className="small text-muted mb-1">Reviews</p>
                                                        <p className="mb-0">976</p>
                                                    </div>
                                                    <div>
                                                        <p className="small text-muted mb-1">Followers</p>
                                                        <p className="mb-0">8.5</p>
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
