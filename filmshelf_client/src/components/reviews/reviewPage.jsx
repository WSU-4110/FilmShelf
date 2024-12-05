import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { NavBar } from '../nav/nav';

const ReviewPage = () => {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReview = async () => {
            if (id) {
                try {
                    const docRef = doc(db, 'reviews', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setReview(docSnap.data());
                    } else {
                        console.log('No review found');
                    }
                } catch (error) {
                    console.error('Error fetching review:', error);
                    setError('Failed to load review.');
                }
            }
        };
        fetchReview();
    }, [id]);

    if (error) {
        return <p style={{ color: "white" }}>{error}</p>;
    }

    if (!review) {
        return <p style={{ color: "white" }}>Loading review...</p>;
    }

    return (
        <div>
            <NavBar />
            <div style={{ borderBottom: "2px solid white", paddingBottom: "10px" }}>
                <p style={{ color: "white" }}>@{review.author}</p>
                <h1 style={{ color: "white" }}>{review.title}</h1>
                <p style={{ color: "white" }}>{review.content}</p>
            </div>
        </div>
    );
};

export default ReviewPage;
