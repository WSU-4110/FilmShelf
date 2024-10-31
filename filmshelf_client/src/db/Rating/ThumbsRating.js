import { RatingStrategy } from "./RatingStrategy";
export class ThumbsStrategy extends RatingStrategy {
    async rate(movieId, thumbsUp, uid, db) {
      const rating = thumbsUp ? "Thumbs Up" : "Thumbs Down";
  
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        [`watchedMovies.${movieId}`]: rating,
      });
  
      console.log(`Rated movie ${movieId} as ${rating}`);
    }
  }