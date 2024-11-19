import { describe, it, expect, vi } from "vitest";
import { getUserDisplayName, getUserReviews } from "./users"
import { getReviews, createReviews} from "./reviewsServices";
import { query, collection, where, getDocs, addDoc, doc, getDoc} from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
    const actual = await importOriginal();
  
    return {
      ...actual,
      getFirestore: vi.fn(() => ({})),
      doc: vi.fn(() => ({})),          
      getDoc: vi.fn(),                 
      query: vi.fn(),                  
      collection: vi.fn(() => ({})),   
      where: vi.fn(),                  
      getDocs: vi.fn(),                
      addDoc: vi.fn(),                
      updateDoc: vi.fn(),              
    };
  });
  

describe("getUserDisplayName", () => {
  it("should return the display name if the user document exists", async () => {
    const mockDisplayName = "John Doe";
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ displayName: mockDisplayName }),
    });

    const displayName = await getUserDisplayName({}, "test-uid");

    expect(displayName).toBe(mockDisplayName);
  });

  it("should return null if the user document does not exist", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });


    const displayName = await getUserDisplayName({}, "test-uid");

    expect(displayName).toBeNull();
  });

  it("should handle errors gracefully and return null", async () => {
    getDoc.mockRejectedValueOnce(new Error("Firestore error"));

    const displayName = await getUserDisplayName({}, "test-uid");

    expect(displayName).toBeNull();
  });
});



describe("getReviews", () => {
  it("should return reviews for the given movie ID", async () => {
    const mockReviews = [
      { id: "1", title: "Great Movie", author: "John Doe" },
      { id: "2", title: "Not Bad", author: "Jane Doe" },
    ];
    getDocs.mockResolvedValueOnce({
      docs: mockReviews.map((review) => ({
        id: review.id,
        data: () => ({ title: review.title, author: review.author }),
      })),
    });

    const movieId = "test-movie-id";
    const reviews = await getReviews(movieId);

    // Assertions
    expect(reviews).toEqual(mockReviews);
    expect(query).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(expect.anything(), "reviews");
    expect(where).toHaveBeenCalledWith("movieId", "==", movieId);
    expect(getDocs).toHaveBeenCalled();
  });

  it("should return an empty array if no reviews exist", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [],
    });

    const movieId = "non-existent-movie-id";
    const reviews = await getReviews(movieId);

    // Assertions
    expect(reviews).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    getDocs.mockRejectedValueOnce(new Error("Firestore error"));

    const movieId = "test-movie-id";
    const reviews = await getReviews(movieId);

    expect(reviews).toBeUndefined();
  });
});




describe("getUserReviews", () => {
    it("should return an array of reviews for the given user ID", async () => {
      const mockReviews = [
        {
          id: "1",
          data: () => ({
            title: "Great Movie!",
            content: "Loved it!",
            movieId: "123",
            createdAt: new Date(),
          }),
        },
      ];
  
      getDocs.mockResolvedValueOnce({ docs: mockReviews });
  
      const uid = "test-user-id";
      const reviews = await getUserReviews({}, uid);
  
      expect(reviews).toEqual([
        {
          id: "1",
          title: "Great Movie!",
          content: "Loved it!",
          movieId: "123",
          createdAt: expect.any(Date),
        },
      ]);
    });
  });
  


describe("createReviews", () => {
    it("should successfully create a review and return the document reference", async () => {
      const mockDocRef = { id: "mockDocId" };
      addDoc.mockResolvedValueOnce(mockDocRef);
  
      const title = "Great Movie!";
      const content = "I really enjoyed this movie.";
      const author = "John Doe";
      const movieId = "123";
      const userId = "456";
  
      const docRef = await createReviews(title, content, author, movieId, userId);
  
      expect(docRef).toEqual(mockDocRef);
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        title,
        content,
        author,
        movieId,
        userId,
        createdAt: expect.any(Date),
      });
    });
  });
  

