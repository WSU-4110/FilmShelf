import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../nav/nav";
import { fetchMovieDetails } from "../services/movies";
import { createReviews as createReviewDocument } from "../services/reviewsServices"; // renamed here
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../../config/firebase-config"; 


export const CreateReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rTitle, setrTitle] = useState("");
    const [rContent, setrContent] = useState("");
    const [movieTitle, setMovieTitle] = useState("");
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const getMovieTitle = async () => {
            try {
                const movie = await fetchMovieDetails(id);
                setMovieTitle(movie.title);
            } catch (error) {
                console.error("Error fetching movie title:", error);
            }
        };

        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setUserInfo(userData);
                        console.log("User Info:", userData);
                    } else {
                        console.log("No user information found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        });
        getMovieTitle();

        return () => unsubscribe();
    }, [id, auth]);

    const handleCreateReview = async (e) => {
        e.preventDefault();

        try {
            const docRef = await createReviewDocument(rTitle, rContent, user.displayName, id, user.uid); // updated here
            console.log("Review created successfully!");
            setrTitle("");
            setrContent("");
            
            navigate(`/reviews/${docRef.id}`);
        } catch (error) {
            console.error("Error creating review:", error);
        }
    };

    return (
        <div>
            <NavBar />
            <h1>Create New Review for {movieTitle}</h1>

            <form onSubmit={handleCreateReview}>
                <input
                    type="text"
                    placeholder="Review Title"
                    value={rTitle}
                    onChange={(e) => setrTitle(e.target.value)}
                />
                <textarea
                    placeholder="Review Content"
                    value={rContent}
                    onChange={(e) => setrContent(e.target.value)}
                />
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};
