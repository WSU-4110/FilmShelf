import { doc, getDoc, query, collection, where, getDocs} from "firebase/firestore";

export const getUserDisplayName = async (db, uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { displayName } = userSnap.data();
      return displayName || "No display name found";
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching display name:", error);
    return null;
  }
};



export const getUserReviews = async (db, uid) => {
  try {
    const userReviewsQuery = query(
      collection(db, "reviews"),
      where("userId", "==", uid)
    );
    const userReviewsSnap = await getDocs(userReviewsQuery);
    const userReviews = userReviewsSnap.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      movieId: doc.data().movieId,
      createdAt: doc.data().createdAt,
    }));

    return userReviews;
  } catch (error) {
    console.error("Error getting user reviews:", error);
    throw error;
  }
};
