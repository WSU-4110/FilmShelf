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

    const buttonFactory = (type) => {
        switch(type) {
            case 'ChangeAccount':
                return (
                    <button className='chngAcc'>
                        <box-icon name='user-circle'></box-icon>
                        <p>Change Account</p>
                    </button>
                );
            case 'ChangePassword':
                return (
                    <button className='chngPass'>
                        <box-icon name='key' ></box-icon>
                        <p>Change Password</p>
                    </button>
                );
            case 'ChangeProfileImage':
                return (
                    <button className='chngImg'>
                        <box-icon name='image'></box-icon>
                        <p>Change Profile</p>
                    </button>
                );
        }
    };

    return (
        <>
            <NavBar/>

            <MDBContainer >
                <MDBRow className="justify-content-center">
                    <MDBCol md="9" lg="7" xl="5" className="mt-5">
                        <img style={{borderRadius: '50%', height:'200px', width:'200px', alignContent:'center'}} src={profilePic} className='img-fluid shadow-4' alt='...' />
                        <p style={{color: "white"}}>{user?.displayName}</p>
                        <p style={{color: "white"}}>{user?.email}</p>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            
            <MDBContainer >
                <MDBRow className="justify-content-center">
                    <MDBCol md="9" lg="7" xl="5" className="mt-5">
                        <MDBCard style={{ borderRadius: '15px', borderWidth: '0', backgroundColor: 'lightsteelblue'}}>
                            <MDBCardBody className='p-4'>
                                <div className='profileSettingsButtons'>
                                    {buttonFactory('ChangeAccount')}
                                    {buttonFactory('ChangePassword')}
                                    {buttonFactory('ChangeProfileImage')}
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