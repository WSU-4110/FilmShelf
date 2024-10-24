import React from 'react';
import { NavBar } from "../nav/nav";;
import { auth } from '../../config/firebase-config'; 
import { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBBtn, MDBRipple, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import "./profilePage.css";
import profilePic from '../../assets/profileImage.jpg';
import 'boxicons'
import Boxicons from 'boxicons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function ProfilePage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {      
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const onProfileSettings = () => {
        navigate("/profileSettings")
    };

    return (
        <>    
            <NavBar />

            
            {user ? (
                <div className="vh-100">
                <div className='profilePageContainer'>

                <MDBContainer>
                    
                    <MDBRow className="justify-content-center">
                        <MDBCol md="9" lg="7" xl="5" className="mt-5">
                            <MDBCard style={{ borderRadius: '15px', borderWidth: '0', backgroundColor: 'lightsteelblue'}}>
                                    <MDBCardImage className='cardImage' style={{borderRadius: '15px 15px 0 0'}} src={profilePic}/>   
                                    <MDBCardBody className="p-4">
                                        <div className="d-flex text-black">
                                            <div className= "flex-shrink-0">   
                                        </div>
                                            <div className="flex-grow-1 ms-3">
                                                <MDBCardTitle>{user.displayName}</MDBCardTitle>
                                                <MDBCardText>{user.email}</MDBCardText> 

                                                
                                                
                                                
                                                
                                                
                                                <div className='buttons'>
                                                        <button className='button' onClick={onProfileSettings}>Profile Settings</button>
                                                </div>

                                                
                                                
                                                <br />
                                                
                                                
                                                   

                                                    

                                            <div className="d-flex justify-content-start rounded-3 p-2 mb-2" style={{ backgroundColor: '#efefef' }}>
                                                <div>
                                                    <button className='buttonMW'>
                                                        <box-icon name='camera-movie' alt='Movies Watched'></box-icon>
                                                        <p className="small text-muted mb-1">Movies Watched</p>
                                                        <p className="mb-0">41</p>
                                                    </button>
                                                    
                                                </div>
                                                <div className="px-3">

                                                    <button className='buttonR'>
                                                        <box-icon name='comment-detail'></box-icon>
                                                        <p className="small text-muted mb-1">Reviews</p>
                                                        <p className="mb-0">976</p>
                                                    </button>
                                                    
                                                </div>
                                                <div>

                                                    <button className='buttonF'>
                                                    <box-icon name='user'></box-icon>
                                                    <p className="small text-muted mb-1">Followers</p>
                                                    <p className="mb-0">8.5</p>
                                                    </button>
                                                    
                                                    
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