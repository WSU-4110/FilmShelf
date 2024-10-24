import React from 'react';
import { NavBar } from "../nav/nav";;
import { auth } from '../../config/firebase-config'; 
import { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBBtn, MDBRipple, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import "./profileSettings.css";
import profilePic from '../../assets/profileImage.jpg';
import 'boxicons'

function ProfileSettings() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {      
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <NavBar/>

            <MDBContainer >
                <MDBRow className="justify-content-center">
                    <MDBCol md="9" lg="7" xl="5" className="mt-5">
                        <img style={{borderRadius: '50%', height:'200px', width:'200px', alignContent:'center'}} src={profilePic} className='img-fluid shadow-4' alt='...' />
                        <p>{user.displayName}</p>
                        <p>{user.email}</p>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            
            <MDBContainer >
                <MDBRow className="justify-content-center">
                    <MDBCol md="9" lg="7" xl="5" className="mt-5">
                        <MDBCard style={{ borderRadius: '15px', borderWidth: '0', backgroundColor: 'lightsteelblue'}}>
                            <MDBCardBody className='p-4'>
                                <div className='profileSettingsButtons'>
                                    <button className='chngAcc'>
                                        <box-icon name='user-circle'></box-icon>
                                        <p>Change Account</p>
                                    </button>
                                    <button className='chngPass'>
                                        <box-icon name='key' ></box-icon>
                                        <p>Change Password</p>
                                    </button>
                                    <button className='chngImg'>
                                        <box-icon name='image'></box-icon>
                                        <p>Change Profile</p>
                                    </button>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    )

}

export default ProfileSettings