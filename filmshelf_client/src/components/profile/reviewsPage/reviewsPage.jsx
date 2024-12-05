import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../../config/firebase-config";
import { getUserReviews } from "../../services/users";
import { fetchMovieDetails } from "../../services/movies";
import { NavBar } from "../../nav/nav";

const UserReviews = () => {
  const { userId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [movieNames, setMovieNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(!!auth.currentUser);
    };

    const fetchReviews = async () => {
      try {
        const reviewsData = await getUserReviews(db, userId || auth.currentUser?.uid);
        setReviews(reviewsData);
        fetchMovieNames(reviewsData.map((review) => review.movieId));
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    const fetchMovieNames = async (movieIds) => {
      const fetchedMovieNames = {};
      for (const id of movieIds) {
        try {
          const movieDetails = await fetchMovieDetails(id); // Fetch movie details
          fetchedMovieNames[id] = movieDetails.title; // Store the movie title
        } catch (error) {
          console.error(`Error fetching movie title for ID ${id}:`, error);
          fetchedMovieNames[id] = "Unknown Title";
        }
      }
      setMovieNames(fetchedMovieNames);
    };

    const unsubscribe = auth.onAuthStateChanged(checkAuthStatus);
    fetchReviews();

    return () => unsubscribe();
  }, [userId]);

  const handleReviewClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  const handleCreateReview = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/${userId}/submit`);
    }
  };

  if (reviews === null) {
    return <p style={{ color: "white" }}>Loading Reviews...</p>;
  }

  return (
    <div>
        <NavBar></NavBar>
        <div style={{ color: "white" }}>
        <h1>User Reviews</h1>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.id}
            style={{ border: "2px solid white", paddingBottom: "10px", margin: "10px 0" }}
            onClick={() => handleReviewClick(review.id)}
          >
            <h2>{review.title}</h2>
            <p>
              <strong>Movie Name:</strong> {movieNames[review.movieId] || "Loading..."}
            </p>
            <p>
              <strong>Content:</strong> {review.content}
            </p>
          </div>
        ))
      ) : (
        <p>No reviews found</p>
      )}
    </div>
    </div>
  );
};

export default UserReviews;
