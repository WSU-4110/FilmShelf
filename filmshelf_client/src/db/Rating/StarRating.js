import { RatingStrategy } from "./RatingStrategy";
export class StarRating extends RatingStrategy {
  async rate(movieId, rating, uid, db) {
    if (rating < 1 || rating > 5) throw new Error("Stars must be between 1 and 5");

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      [`watchedMovies.${movieId}`]: rating,
    });
    console.log(`Rated movie ${movieId} with ${rating} stars`);
  }
}