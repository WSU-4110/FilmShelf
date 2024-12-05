import React from 'react';
import { NavBar } from "../nav/nav";;
import { auth } from '../../config/firebase-config'; 
import { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBBtn, MDBRipple, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import "./profileSettings.css";
import profilePic from '../../assets/profileImage.jpg';
import 'boxicons'
import { signInWithGoogle } from "../auth";

function ProfileSettings() {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(profilePic); // Initialize with default image
    const [error, setError] = useState("");
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    
    useEffect(() => {
        const checkAuthProvider = () => {
            const user = auth.currentUser;
            if (user) {
                const provider = user.providerData[0]?.providerId;
                setIsGoogleUser(provider === 'google.com');
            }
        };
        checkAuthProvider();
    }, []);

    const buttonFactory = (type) => {
        switch(type) {
            case 'ChangeAccount':
                return (
                    <button className='chngAcc' onClick={signInWithGoogle}>
                        <box-icon name='user-circle'></box-icon>
                        <p>Account</p>
                    </button>
                );
            case 'ChangePassword':
                return (
                    <button className='chngPass'>
                        <box-icon name='key' ></box-icon>
                        <p>Password</p>
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setError("");
            const newImageUrl = URL.createObjectURL(file); // Create URL for selected file
            setProfileImage(newImageUrl); // Update local profile image
            onUpdateProfileImage(newImageUrl); // Update profile image in ProfilePage
        } else {
            setError("Please select a JPEG or PNG image.");
        }
    };

    

    return (
        <>
            <NavBar/>

                        <img style={{borderRadius: '50%', height:'200px', width:'200px', marginLeft:'auto', marginRight:'auto', marginTop:'25px', marginBottom:'25px', display:'block'}} src={profileImage} className='img-fluid shadow-4' alt='Profile' />
                        <p style={{color: "white", textAlign:'center'}}>{user?.displayName}</p>
                        <p style={{color: "white", textAlign:'center'}}>{user?.email}</p>
            
            <MDBContainer >
                <MDBRow className="justify-content-center">
                    <MDBCol  xl="4">
                        <MDBCard style={{ borderRadius: '15px', borderWidth: '0', backgroundColor: 'lightsteelblue'}}>
                            <MDBCardBody className='p-4'>
                                <p>Choose to change:</p>
                                {isGoogleUser ? (
                                    <>
                                    <div className='profileSettingsButtons'>
                                    <button onClick={signInWithGoogle} className='chngAcc'>
                                        <box-icon name='user-circle'></box-icon>
                                        <p>Change Account</p>
                                    </button>

                                    <button onClick={() => document.getElementById("fileInput").click()} className='chngImg'>
                                        <box-icon name='image'></box-icon>
                                        <p>Change Profile</p>
                                    </button>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    {error && <p style={{ color: 'red' }}>{error}</p>}  
                                </div>
                                </>
                                ) : (
                                    <>
                                        <button>Change Password</button>
                                        <button>Change Image</button>
                                    </>

                                )}
                                
                            
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    )

}

export default ProfileSettings