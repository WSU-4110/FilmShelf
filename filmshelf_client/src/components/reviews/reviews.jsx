import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getReviews } from "../services/reviewsServices";

export const Review = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        setIsLoggedIn(!!auth.currentUser);

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });

        const fetchReviews = async () => {
            const reviewData = await getReviews(id);
            setReviews(reviewData);
        };

        console.log(id);
        fetchReviews();

        return () => unsubscribe();
    }, [id]);

    const handleReviewClick = (r_id) => {
        navigate(`/reviews/${r_id}`);
    };

    const handleCreateReview = () => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    };

    if (!reviews) {
        return <p style={{ color: "white" }}>Loading Reviews...</p>;
    }

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                {isLoggedIn ? (
                    <Link to={`/${id}/submit`}>
                        <button>Create Review</button>
                    </Link>
                ) : (
                    <button onClick={handleCreateReview}>Create Review</button>
                )}
            </div>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div
                        key={reviews.id}
                        style={{ border: "2px solid white", paddingBottom: "10px" }}
                        onClick={() => handleReviewClick(review.id)} 
                    >
                        <h2>{review.title}</h2>
                        <p>Author: {review.author}</p>
                    </div>
                ))
            ) : (
                <p>No reviews found</p>
            )}
        </div>
    );
};
