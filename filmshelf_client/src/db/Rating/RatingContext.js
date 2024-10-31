import { StarRating } from "./StarRating";
import { ThumbsStrategy } from "./ThumbsRating";
class RatingContext {
    constructor(strategy) {
      this.strategy = strategy; // Set the initial rating strategy
    }
  
    setStrategy(strategy) {
      this.strategy = strategy; // Update the rating strategy
    }
  
    async rateMovie(movieId, rating, uid, db) {
      await this.strategy.rate(movieId, rating, uid, db); // Delegate to the current strategy
    }
  }
  
  export default RatingContext;
  