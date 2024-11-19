import { addDoc, collection, query, getDocs, limit, startAfter, orderBy, where, updateDoc, arrayUnion, doc} from "firebase/firestore";
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

export const addReviewToUser = async (uid, rid) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        reviews: arrayUnion(rid),
      });
  
      console.log(`Review ID ${rid} added to user ${uid}`);
    } catch (error) {
      console.error("Error adding review to user:", error);
    }
  };

