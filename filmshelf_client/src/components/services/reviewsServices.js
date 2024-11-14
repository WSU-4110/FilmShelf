import { addDoc, collection, query, getDocs, limit, startAfter, orderBy, where} from "firebase/firestore";
import { db } from "../../config/firebase-config";

export const createReviews = async (title, content, author, movieId, userId) => {
    try {
        const docRef = await addDoc(collection(db, "reviews"), {
            title,
            content,
            author,
            movieId,
            userId,
            createdAt: new Date()
        });
        return docRef;
    } catch (error) {
        console.error("Error creating review:", error);
        throw error;
    }
};

export const getReviews = async (mid) => {
    try {
        const discussionsQuery = query(collection(db, "reviews"), where("movieId", "==", mid));
        const discussionSnap = await getDocs(discussionsQuery);
        const discussions = discussionSnap.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            author: doc.data().author,
        }));
        return discussions
    } catch (error){ 
        console.error("Error getting reviews", error)
    }
}
